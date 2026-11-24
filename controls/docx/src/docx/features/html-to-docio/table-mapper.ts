/**
 */
/* eslint-disable security/detect-object-injection, valid-jsdoc */

import { WordDocument } from '../document/document';
import { Body } from '../document/body';
import { TextRange } from '../document/text-range';
import { Table, createTable, TableRow, TableCell, AutoFitType } from '../tables/index';
import { TableAlignment, TableRowHeightRule } from '../tables/tbl-pr';
import { TableCellVerticalAlignment } from '../tables/tc-pr';
import {
    _HTMLTableElement,
    _HTMLTableRowElement,
    _HTMLTableCellElement,
    _HTMLElement,
    _HTMLGenericElement
} from '../html-parser/dom-node';
import {  _ParagraphMapper } from './paragraph-mapper';
import { _ListMapper } from './list-mapper';
import { _ImageMapper } from './image-mapper';
import { BorderStyle } from '../document/page-setup';
import { parseCssHex } from './css-paragraph-style-builder';
import { HorizontalAlignment } from '../images/layout-types';
import { Border } from '../tables/borders';
import { Paragraph } from '../document/paragraph';

/** Position of one HTML cell on the logical table grid. */
interface CellPlacement {
    column: number;
    colSpan: number;
    rowSpan: number;
}

/** Logical table grid built from the HTML rows. */
interface TableGrid {
    rows: _HTMLTableRowElement[];
    placements: CellPlacement[][];
    columnCount: number;
}

// Type aliases for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _Paragraph = any;

/**
 * Maps HTML tables to document tables.
 *
 * @private
 */
export class _TableMapper {
    /**
     * Map an HTML table element to a document Table with applied styles.
     *
     * Handles:
     * - Table structure (rows and cells)
     * - Table attributes (border, cellpadding, cellspacing)
     * - Cell content (paragraphs, inline formatting, nested tables)
     * - Table sections (thead, tbody, tfoot)
     *
     * @param {unknown} tableElement - The HTML <table> element to map
     * @param {unknown} document - The WordDocument (for context)
     * @param {unknown} owner - Optional table owner (Body) to attach the table to
     * @returns A new Table with applied styles, or null if table cannot be created
     */
    static mapHTMLTable(
        tableElement: _HTMLTableElement,
        document: WordDocument,
        owner?: Body
    ): Table | null {
        try {
            // Build the table grid FIRST to get the authoritative row/column count
            // This ensures consistency between table creation and content mapping
            const grid: TableGrid = this.buildTableGrid(tableElement);
            const rowCount: number = grid.rows.length;
            const colCount: number = grid.columnCount;

            if (rowCount <= 0 || colCount <= 0) {
                // Empty or invalid table - create minimal 1x1 table
                const table: Table = createTable(1, 1);
                if (owner) {
                    owner.items.add(table);
                }
                return table;
            }

            // Create table using createTable factory function with safeguards
            let table: Table | null = null;
            try {
                table = createTable(rowCount, colCount);
            } catch (createError) {
                console.warn(`Failed to create table with ${rowCount}x${colCount} dimensions:`, createError);
                // Create a minimal table as fallback
                table = createTable(1, 1);
            }

            if (!table) {
                console.error('Failed to create table - createTable returned null');
                return null;
            }

            // If an owner is provided, attach BEFORE processing content
            if (owner) {
                try {
                    owner.items.add(table);
                } catch (addError) {
                    console.error('Failed to add table to owner:', addError);
                    return null;
                }
            }

            // Map table content using the grid we already built
            this.mapTableContentWithGrid(table, tableElement, grid, document);
            this.applyTableCss(table, tableElement);

            // Apply table-level attributes
            this.applyTableAttributes(table, tableElement);

            // A table with no width keeps its default column widths (Word sizes it to
            // content); only a table whose width would exceed the page is scaled down
            const hasTableWidth: boolean = !!(tableElement.getAttribute('width') ||
                (tableElement._styles && (tableElement._styles.width || tableElement._styles['width'])));
            if (hasTableWidth) {
                try {
                    table.autoFit(AutoFitType.FitToWindow);
                } catch (fitError) {
                    // eslint-disable-next-line no-console
                    console.debug('Could not fit the table to the window:', fitError);
                }
            }

            return table;
        } catch (error) {
            console.error('Error mapping HTML table:', error);
            return null;
        }
    }

    /**
     * Map content of an HTML table (rows and cells) using a pre-built grid.
     * This variant accepts the grid as a parameter to avoid rebuilding it.
     *
     * @param {unknown} table - The table value
     * @param {unknown} tableElement - The tableElement value
     * @param {unknown} grid - The pre-built table grid
     * @param {unknown} document - The document value
     */
    private static mapTableContentWithGrid(
        table: Table,
        tableElement: _HTMLTableElement,
        grid: TableGrid,
        document: WordDocument
    ): void {
        const rowCount: number = table.rows.length;

        for (let rowIndex: number = 0; rowIndex < grid.rows.length && rowIndex < rowCount; rowIndex++) {
            const columns: number[] = grid.placements[rowIndex].map((placement: CellPlacement) => placement.column);
            this.mapTableRow(table, grid.rows[rowIndex], rowIndex, document, columns);
        }

        // Merge after all content is mapped: horizontal (colspan) and vertical (rowspan) in one range
        for (let rowIndex: number = 0; rowIndex < grid.rows.length && rowIndex < rowCount; rowIndex++) {
            for (const placement of grid.placements[rowIndex]) {
                const toRow: number = Math.min(rowIndex + placement.rowSpan - 1, rowCount - 1);
                const toColumn: number = Math.min(placement.column + placement.colSpan - 1, grid.columnCount - 1);
                if (toRow === rowIndex && toColumn === placement.column) {
                    continue;
                }
                try {
                    table.mergeCells({
                        fromRow: rowIndex,
                        fromColumn: placement.column,
                        toRow: toRow,
                        toColumn: toColumn
                    });
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.debug('Could not merge table cells:', error);
                }
            }
        }
    }

    /**
     * Map content of an HTML table (rows and cells).
     * This is the legacy version that rebuilds the grid each time.
     *
     * @param {unknown} table - The table value
     * @param {unknown} tableElement - The tableElement value
     * @param {unknown} document - The document value
     */
    private static mapTableContent(
        table: Table,
        tableElement: _HTMLTableElement,
        document: WordDocument
    ): void {
        const grid: TableGrid = this.buildTableGrid(tableElement);
        this.mapTableContentWithGrid(table, tableElement, grid, document);
    }

    /**
     * Build the logical grid of a table: every cell gets the first free grid column of its row,
     * skipping columns still occupied by a rowspan from an earlier row.
     *
     * @param {unknown} tableElement - The tableElement value
     * @returns {TableGrid}
     */
    private static buildTableGrid(tableElement: _HTMLTableElement): TableGrid {
        const rows: _HTMLTableRowElement[] = [];
        for (const child of tableElement._childNodes) {
            const childTag: string = child.tagName.toLowerCase();
            if (childTag === 'thead' || childTag === 'tbody' || childTag === 'tfoot') {
                for (const sectionChild of child._childNodes) {
                    if (sectionChild.tagName.toLowerCase() === 'tr') {
                        rows.push(sectionChild as _HTMLTableRowElement);
                    }
                }
            } else if (childTag === 'tr') {
                rows.push(child as _HTMLTableRowElement);
            }
        }

        const occupied: boolean[][] = [];
        const placements: CellPlacement[][] = [];
        let columnCount: number = 0;
        for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
            if (!occupied[rowIndex]) {
                occupied[rowIndex] = [];
            }
            const rowPlacements: CellPlacement[] = [];
            let column: number = 0;
            for (const cellElement of rows[rowIndex]._childNodes) {
                const cellTag: string = cellElement.tagName.toLowerCase();
                if (cellTag !== 'td' && cellTag !== 'th') {
                    continue;
                }
                while (occupied[rowIndex][column]) {
                    column++;
                }
                const colSpan: number = Math.max(parseInt(cellElement.getAttribute('colspan') || '1', 10) || 1, 1);
                // rowspan is limited to the rows that remain in the table
                const rowSpan: number = Math.min(
                    Math.max(parseInt(cellElement.getAttribute('rowspan') || '1', 10) || 1, 1),
                    rows.length - rowIndex
                );
                for (let r: number = rowIndex; r < rowIndex + rowSpan; r++) {
                    if (!occupied[r]) {
                        occupied[r] = [];
                    }
                    for (let c: number = column; c < column + colSpan; c++) {
                        occupied[r][c] = true;
                    }
                }
                rowPlacements.push({ column: column, colSpan: colSpan, rowSpan: rowSpan });
                column += colSpan;
                columnCount = Math.max(columnCount, column);
            }
            placements.push(rowPlacements);
        }
        return { rows: rows, placements: placements, columnCount: Math.max(columnCount, 1) };
    }

    /**
     * Map a single HTML table row to a document TableRow.
     *
     * @param {unknown} table - The table value
     * @param {unknown} rowElement - The rowElement value
     * @param {unknown} rowIndex - The rowIndex value
     * @param {unknown} document - The document value
     */
    private static mapTableRow(
        table: Table,
        rowElement: _HTMLTableRowElement,
        rowIndex: number,
        document: WordDocument,
        columns?: number[]
    ): void {
        try {
            const row: TableRow = table.rows[rowIndex];
            if (!row) { return; }

            // Apply row-level attributes
            this.applyRowAttributes(row, rowElement);

            // tslint:disable-next-line: no-any
            let cellIndex: number = 0;

            // Process each cell in the row
            for (const child of rowElement._childNodes) {
                const childTag: string = child.tagName.toLowerCase();
                // Check for td or th (table cell elements)
                if (childTag === 'td' || childTag === 'th') {
                    const gridColumn: number = columns && columns[cellIndex] !== undefined ? columns[cellIndex] : cellIndex;
                    // Ensure we don't exceed column count
                    if (gridColumn >= row.cells.length) {
                        break;
                    }

                    const cell: TableCell = row.cells[gridColumn];
                    if (cell) {
                        this.mapTableCell(cell, child as _HTMLTableCellElement, document);
                        this.applyCellCss(cell, child as _HTMLTableCellElement);
                        if (childTag === 'th') {
                            this.applyHeaderCellFormatting(cell);
                        }
                    }

                    cellIndex++;
                }
            }
        } catch (error) {
            console.error('Error mapping table row:', error);
        }
    }

    /**
     * Map content of a single HTML table cell.
     *
     * COMPREHENSIVE CELL CONTENT HANDLING:
     *
     * Handles all content types inside table cells:
     * - Direct text nodes: <td>Cell Data</td>
     * - Inline elements: <td><b>Bold</b></td>
     * - Block elements: <td><p>Paragraph</p></td>
     * - Lists: <td><ul><li>Item</li></ul></td>
     * - Nested tables: <td><table>...</table></td>
     * - Images: <td><img src="..."></td>
     * - Mixed content: All combinations above
     *
     * Strategy:
     * 1. Separate block-level content (p, div, table, ul, ol, img) from inline
     * 2. If ONLY inline content: put in default paragraph
     * 3. If block content: process block by block, adding to cell
     * 4. Handle special cases: images, lists, nested tables
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} cellElement - The cellElement value
     * @param {unknown} document - The document value
     */
    private static mapTableCell(
        cell: TableCell,
        cellElement: _HTMLTableCellElement,
        document: WordDocument
    ): void {
        try {
            // Apply cell-level attributes (including colspan/rowspan and th formatting)
            this.applyCellAttributes(cell, cellElement);

            // Check if cell has ANY content at all
            if (cellElement._childNodes.length === 0) {
                // Empty cell - will have default empty paragraph from TableCell creation
                return;
            }

            // Separate block-level content from inline content
            const blockContent: _HTMLElement[] = [];
            const inlineAndTextContent: _HTMLElement[] = [];
            const imageChildren: _HTMLElement[] = [];

            for (const child of cellElement._childNodes) {
                const childTag: string = child.tagName.toLowerCase();

                // Block-level elements: p, div, table, ul, ol, img
                if (childTag === 'img') {
                    // An image stays inline (in order) when the cell has no block children
                    imageChildren.push(child);
                    inlineAndTextContent.push(child);
                } else if (childTag === 'p' || childTag === 'div' || childTag === 'table' ||
            childTag === 'ul' || childTag === 'ol') {
                    blockContent.push(child);
                } else if (childTag === '#text') {
                    // Text node - include if not just whitespace
                    // eslint-disable-next-line no-irregular-whitespace
                    if (child._text && child._text.replace(/[^\S\u00A0]+/g, '').length > 0) {
                        inlineAndTextContent.push(child);
                    }
                } else if (this.isInlineElement(childTag)) {
                    // Inline elements (b, i, u, span, strong, em, a, etc.)
                    inlineAndTextContent.push(child);
                } else {
                    // Unknown elements - default to block-level to be safe
                    blockContent.push(child);
                }
            }

            if (blockContent.length > 0) {
                for (const imageChild of imageChildren) {
                    blockContent.push(imageChild);
                }
            }

            // Process inline content if present
            if (inlineAndTextContent.length > 0) {
                // If ONLY inline content (no block content), put it in default paragraph
                if (blockContent.length === 0) {
                    // Ensure cell has at least one paragraph
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let defaultPara: any = cell.paragraphs[0];
                    if (!defaultPara) {
                        // Cell has no paragraphs, create one using the factory
                        defaultPara = cell.paragraphs.add();
                    }

                    if (defaultPara) {
                        // Create wrapper for inline content only
                        const inlineWrapper: _Paragraph = this.createInlineOnlyWrapper(inlineAndTextContent, cellElement);
                        // Map all inline content to the default paragraph
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        _ParagraphMapper.mapHTMLParagraphContent(inlineWrapper as any, defaultPara, document, cell);
                    }
                }
                // If there IS block content, the inline content will be ignored (HTML semantics)
                // because block elements imply structure
            }

            // Process block-level content
            for (const blockElement of blockContent) {
                const blockTag: string = blockElement.tagName.toLowerCase();

                if (blockTag === 'p') {
                    // Paragraph element
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _ParagraphMapper.mapHTMLParagraph(blockElement as any, document, cell);
                } else if (blockTag === 'h1' || blockTag === 'h2' || blockTag === 'h3' ||
                    blockTag === 'h4' || blockTag === 'h5' || blockTag === 'h6') {
                    // Heading element - map to a paragraph with the matching heading style
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    _ParagraphMapper.mapHTMLHeading(blockElement as any, document, cell);
                } else if (blockTag === 'div') {
                    // A div that wraps block-level content (nested table, lists, headings)
                    // is a container: recursively map its children, not a paragraph.
                    if (this.containsBlockLevelElements(blockElement)) {
                        this.mapCellContainer(cell, blockElement, document);
                    } else {
                        // Inline-only div: treat as a paragraph
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        _ParagraphMapper.mapHTMLParagraph(blockElement as any, document, cell);
                    }
                } else if (blockTag === 'table') {
                    // Nested table - import the _TableMapper for recursive handling
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.mapHTMLTable(blockElement as any, document, cell as any);
                } else if (blockTag === 'ul' || blockTag === 'ol') {
                    // List inside table cell - use list mapper
                    this.mapListInTableCell(cell, blockElement, document);
                } else if (blockTag === 'img') {
                    // Image inside table cell - create paragraph with image
                    this.mapImageInTableCell(cell, blockElement, document);
                }
                // Skip other block elements for now
            }

            // If NO content was added at all, cell should still have default empty paragraph
            // (which is created by TableCell automatically)
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.error('Error mapping table cell:', error);
        }
    }

    /**
     * Check whether an element contains block-level children (p, h1-h6, div,
     * table, ul, ol, ...), mirroring the body mapper's detection.
     *
     * @param {unknown} element - The element value
     * @returns {boolean}
     */
    private static containsBlockLevelElements(element: _HTMLElement): boolean {
        if (!element._childNodes || element._childNodes.length === 0) {
            return false;
        }
        const blockTags: string[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'blockquote',
            'pre', 'ul', 'ol', 'li', 'table', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav'];
        for (const child of element._childNodes) {
            if (child.tagName && child.tagName !== '#text' &&
                blockTags.indexOf(child.tagName.toLowerCase()) !== -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Map a container element (div, span wrapper) inside a table cell by
     * recursively processing its block-level children against the cell.
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} container - The container value
     * @param {unknown} document - The document value
     * @returns {void}
     */
    private static mapCellContainer(cell: TableCell, container: _HTMLElement, document: WordDocument): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blockContent: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inlineContent: any[] = [];
        for (const child of container._childNodes) {
            if (child.tagName && child.tagName !== '#text' &&
                this.containsBlockLevelElements(child)) {
                blockContent.push(child);
            } else if (child.tagName === '#text' || this.isInlineElement(child.tagName ? child.tagName.toLowerCase() : '')) {
                inlineContent.push(child);
            } else {
                blockContent.push(child);
            }
        }
        // Inline content before/among blocks goes into one paragraph
        if (inlineContent.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const para: any = cell.paragraphs.add ? cell.paragraphs.add() : cell.paragraphs[0];
            if (para) {
                const wrapper: _HTMLElement = this.createInlineOnlyWrapper(inlineContent, container);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _ParagraphMapper.mapHTMLParagraphContent(wrapper as any, para, document, cell);
            }
        }
        for (const blockElement of blockContent) {
            const blockTag: string = blockElement.tagName ? blockElement.tagName.toLowerCase() : '';
            if (blockTag === 'table') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.mapHTMLTable(blockElement as any, document, cell as any);
            } else if (blockTag === 'div') {
                this.mapCellContainer(cell, blockElement, document);
            } else if (blockTag === 'ul' || blockTag === 'ol') {
                this.mapListInTableCell(cell, blockElement, document);
            } else if (blockTag === 'p') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _ParagraphMapper.mapHTMLParagraph(blockElement as any, document, cell);
            } else if (blockTag === 'h1' || blockTag === 'h2' || blockTag === 'h3' ||
                blockTag === 'h4' || blockTag === 'h5' || blockTag === 'h6') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _ParagraphMapper.mapHTMLHeading(blockElement as any, document, cell);
            } else if (blockTag === 'img') {
                this.mapImageInTableCell(cell, blockElement, document);
            }
        }
    }

    /**
     * Create a synthetic wrapper element containing only inline content.
     * Similar to list-mapper's version, but for table cells.
     *
     * @param {unknown} inlineContent - The inlineContent value
     * @returns {_HTMLElement}
     */
    private static createInlineOnlyWrapper(inlineContent: _HTMLElement[], source?: _HTMLElement): _HTMLElement {
    // Create wrapper with inline content
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const wrapper: _HTMLElement = new _HTMLGenericElement('span') as any;
        // Directly assign childNodes - no appendChild() to avoid mutations
        (wrapper as any)._childNodes = [...inlineContent];
        // The li / td / th element's own declarations (alignment, colour, ...) apply to its paragraph
        if (source && source._styles) {
            // Box declarations (border, padding, background, margin, size) belong to the cell itself
            // (tcBorders / tcMar / shading) and must not be repeated on its paragraph and runs
            const textStyles: Record<string, string> = {};
            for (const key of Object.keys(source._styles)) {
                if (!/^(border|padding|margin|background|width|height)/.test(key)) {
                    textStyles[key] = source._styles[key];
                }
            }
            wrapper._styles = textStyles;
        }
        return wrapper;
    }

    /**
     * Map an HTML list (ol/ul) inside a table cell.
     * Lists inside cells should be rendered with proper bullets/numbers.
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} listElement - The listElement value
     * @param {unknown} document - The document value
     */
    private static mapListInTableCell(
        cell: TableCell,
        listElement: _HTMLElement,
        document: WordDocument
    ): void {
        try {
            // Import list mapper dynamically to avoid circular dependencies
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listMapper: any = _ListMapper; // eslint-disable-line
            if (listMapper && listMapper.mapListInTableCell) {
                listMapper.mapListInTableCell(cell, listElement, document);
            } else {
                // Fallback: treat list items as paragraphs
                for (const child of listElement._childNodes) {
                    if (child.tagName.toLowerCase() === 'li') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        _ParagraphMapper.mapHTMLParagraph(child as any, document, cell);
                    }
                }
            }
        } catch (error) {
            console.error('Error mapping list in table cell:', error);
        }
    }

    /**
     * Map an HTML image inside a table cell.
     * Creates a paragraph containing the image.
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} imgElement - The imgElement value
     * @param {unknown} document - The document value
     */
    private static mapImageInTableCell(
        cell: TableCell,
        imgElement: _HTMLElement,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        document: WordDocument
    ): void {
        try {
            // Import image mapper dynamically
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageMapper: any = _ImageMapper; // eslint-disable-line
            if (imageMapper) {
                // Create a paragraph to hold the image
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let imagePara: any = cell.paragraphs[0];
                if (!imagePara || (imagePara.items && imagePara.items.snapshot && imagePara.items.snapshot().length > 0)) {
                    // Default paragraph already has content, create a new one
                    imagePara = cell.paragraphs.add();
                }

                if (imagePara) {
                    // Extract image data
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const imageData: any = imageMapper.extractImageData(imgElement);
                    if (imageData && imageData.bytes) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const appendImageMethod: any = (imagePara as any).appendImage;
                        if (appendImageMethod) {
                            appendImageMethod.call(imagePara, imageData.bytes, {
                                width: imageData.width,
                                height: imageData.height,
                                name: imageData.name || imageData.alt,
                                title: imageData.title,
                                description: imageData.alt
                            });
                        }
                    } else {
                        const altText: string | null = imgElement.getAttribute('alt');
                        if (altText) {
                            const altRange: any = new TextRange(document);
                            altRange.text = '[Image: ' + altText + ']';
                            imagePara.items.add(altRange);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error mapping image in table cell:', error);
        }
    }

    /**
     * Check if a tag is an inline element.
     *
     * @param {unknown} tagName - The tagName value
     * @returns {boolean}
     */
    private static isInlineElement(tagName: string): boolean {
        const inlineTags: string[] = [
            'a', 'abbr', 'b', 'bdo', 'br', 'cite', 'code', 'dfn', 'em', 'i',
            'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub',
            'sup', 'time', 'u', 'var', 'wbr', 'ins', 'del'
        ];
        return inlineTags.indexOf(tagName.toLowerCase()) !== -1;
    }

    /**
     * Apply table-level attributes from HTML element.
     *
     * @param {unknown} table - The table value
     * @param {unknown} tableElement - The tableElement value
     * @returns {void}
     */
    private static applyTableAttributes(table: Table, tableElement: _HTMLTableElement): void {
        try {
            // CSS margins on the <table> element: left/right become the table indent,
            // top/bottom become spacing around the table.
            const tableBox: { left: number; right: number; top: number; bottom: number } | undefined =
                this.parseMarginBox(tableElement._styles);
            if (tableBox) {
                if (tableBox.left > 0) {
                    table.indentFromLeft = tableBox.left;
                }
                if (tableBox.top > 0) {
                    this.applySpacingAroundTable(table, tableBox.top, true);
                }
                if (tableBox.bottom > 0) {
                    this.applySpacingAroundTable(table, tableBox.bottom, false);
                }
            }
            // Border attribute
            const border: string | null = tableElement.getAttribute('border');
            if (border) {
                const borderWidth: number = parseInt(border, 10);
                if (borderWidth > 0) {
                    table.tableFormat.borders.lineWidth = borderWidth;
                }
            }

            // Alignment
            const align: string | null = tableElement.getAttribute('align');
            if (align) {
                const alignLower: string = align.toLowerCase();
                if (alignLower === 'left') {
                    table.tableFormat.horizontalAlignment = TableAlignment.Left;
                } else if (alignLower === 'center') {
                    table.tableFormat.horizontalAlignment = TableAlignment.Center;
                } else if (alignLower === 'right') {
                    table.tableFormat.horizontalAlignment = TableAlignment.Right;
                }
            }

            // Width - Note: preferredWidth is read-only, width properties are set via OOXML
            // const width: string | null = tableElement.getAttribute('width');
            // Width can be set via CSS styles on the table element

            // Background color
            const bgcolor: string | null = tableElement.getAttribute('bgcolor');
            if (bgcolor) {
                table.tableFormat.backColor = bgcolor;
            }

            // Styles
            if (tableElement._styles) {
                if (tableElement._styles.backgroundColor) {
                    table.tableFormat.backColor = tableElement._styles.backgroundColor;
                }

                // Apply border styles from inline CSS
                if (tableElement._styles.borderColor || tableElement._styles['border-color']) {
                    const borderColor: string = tableElement._styles.borderColor || tableElement._styles['border-color'];
                    if (borderColor && table.tableFormat.borders) {
                        try {
                            table.tableFormat.borders.color = borderColor;
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.debug('Could not set table border color:', error);
                        }
                    }
                }

                if (tableElement._styles.borderStyle || tableElement._styles['border-style']) {
                    const borderStyle: string = tableElement._styles.borderStyle || tableElement._styles['border-style'];
                    if (borderStyle && table.tableFormat.borders) {
                        try {
                            // Map CSS border styles to OOXML
                            const styleValue: string = String(borderStyle).toLowerCase();
                            if (styleValue === 'solid') {
                                table.tableFormat.borders.borderType = BorderStyle.Single;
                            } else {
                                table.tableFormat.borders.borderType = BorderStyle.None;
                            }
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.debug('Could not set table border style:', error);
                        }
                    }
                }

                if (tableElement._styles.borderWidth || tableElement._styles['border-width']) {
                    const borderWidth: string = tableElement._styles.borderWidth || tableElement._styles['border-width'];
                    if (borderWidth && table.tableFormat.borders) {
                        try {
                            // Parse border width (e.g., "2pt" -> 2)
                            const widthMatch: RegExpMatchArray = String(borderWidth).match(/(\d+)/);
                            if (widthMatch) {
                                table.tableFormat.borders.lineWidth = parseInt(widthMatch[1], 10);
                            }
                        } catch (error) {
                            // eslint-disable-next-line no-console
                            console.debug('Could not set table border width:', error);
                        }
                    }
                }
                // Note: CSS width styles can be captured but preferredWidth is read-only
            }
        } catch (error) {
            console.error('Error applying table attributes:', error);
        }
    }

    /**
     * Apply row-level attributes from HTML element.
     *
     * @param {unknown} row - The row value
     * @param {unknown} rowElement - The rowElement value
     * @returns {void}
     */
    private static applyRowAttributes(row: TableRow, rowElement: _HTMLTableRowElement): void {
        try {
            // Row height
            const height: string | null = rowElement.getAttribute('height');
            if (height) {
                const heightValue: number = parseInt(height, 10);
                if (heightValue > 0) {
                    row.height = heightValue;
                }
            }

            // Row alignment - Note: RowFormat does not have alignment property
            // Alignment is a table-level property, not row-level
            // const align: string | null = rowElement.getAttribute('align');

            // Background color
            const bgcolor: string | null = rowElement.getAttribute('bgcolor');
            if (bgcolor) {
                row.rowFormat.backColor = bgcolor;
            }
            // CSS inheritance: the row inherits background and colour from its section
            // (thead/tbody/tfoot) or table when it does not set them itself
            const rowStyles: Record<string, string> = rowElement._styles || {};
            const inherited: Record<string, string> = {};
            let ancestor: _HTMLElement | null | undefined = rowElement._parentNode;
            while (ancestor && ancestor.tagName && ancestor.tagName.toLowerCase() !== 'table') {
                const tag: string = ancestor.tagName.toLowerCase();
                if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') {
                    const ancestorStyles: Record<string, string> = ancestor._styles || {};
                    if (inherited.background === undefined) {
                        inherited.background = ancestorStyles.background || ancestorStyles.backgroundColor;
                    }
                    if (inherited.color === undefined) {
                        inherited.color = ancestorStyles.color;
                    }
                    if (inherited.margin === undefined) {
                        inherited.margin = ancestorStyles.margin || ancestorStyles.marginTop;
                    }
                }
                ancestor = ancestor._parentNode;
            }
            // CSS margins on the row or its section: top/bottom set a minimum row height
            // (the cell content plus the margin), left/right shift the row's first cell.
            const rowMargin: { left: number; right: number; top: number; bottom: number } | undefined =
                this.parseMarginBox(rowStyles) || this.parseMarginBox(inherited);
            if (rowMargin && rowMargin.top + rowMargin.bottom > 0) {
                try {
                    row.heightType = TableRowHeightRule.AtLeast;
                    row.height = Math.max(row.height, rowMargin.top + rowMargin.bottom);
                } catch (heightError) {
                    // eslint-disable-next-line no-console
                    console.debug('Could not apply margin to row height:', heightError);
                }
            }
            const rowBg: string | undefined = rowStyles.backgroundColor || rowStyles.background ||
                inherited.background;
            const rowHex: string | undefined = parseCssHex(rowBg);
            if (rowHex) {
                row.rowFormat.backColor = rowHex;
                // Word renders cell shading over row shading, so the row background
                // must also be painted on the row's cells to be visible.
                const shadedCells: TableCell[] = row.listCells();
                for (const shadedCell of shadedCells) {
                    if (!shadedCell.cellFormat.backColor) {
                        shadedCell.cellFormat.backColor = rowHex;
                    }
                }
            }
            // Text colour inherited from the section is applied in applyCellCss,
            // which runs after the cell content exists.
        } catch (error) {
            console.error('Error applying row attributes:', error);
        }
    }

    /**
     * Apply cell-level attributes from HTML element.
     *
     * @param {unknown} cell - The cell value
     * @param {unknown} cellElement - The cellElement value
     * @returns {void}
     */
    private static applyCellAttributes(cell: TableCell, cellElement: _HTMLTableCellElement): void {
        try {
            // Check if this is a header cell (th element)
            const isHeaderCell: boolean = cellElement.tagName.toLowerCase() === 'th';

            // Apply header formatting if this is a <th> element
            if (isHeaderCell) {
                // Apply bold formatting to header cell content
                this.applyHeaderCellFormatting(cell);
            }

            // Apply inline styles to cell
            if (cellElement._styles) {
                // Background color from inline styles
                if (cellElement._styles.backgroundColor) {
                    cell.cellFormat.backColor = cellElement._styles.backgroundColor;
                }

                // Border styles
                if (cellElement._styles.borderColor || cellElement._styles['border-color']) {
                    const borderColor: string = cellElement._styles.borderColor || cellElement._styles['border-color'];
                    if (borderColor) {
                        // Apply border color to all borders
                        this.applyBorderColor(cell, borderColor);
                    }
                }

                // Border width/style
                if (cellElement._styles.borderWidth || cellElement._styles['border-width'] ||
                    cellElement._styles.borderStyle || cellElement._styles['border-style']) {
                    this.applyBorderStyles(cell, cellElement._styles);
                }

                // Text alignment from inline styles
                if (cellElement._styles.textAlign || cellElement._styles['text-align']) {
                    const textAlign: string = cellElement._styles.textAlign || cellElement._styles['text-align'];
                    this.applyTextAlignment(cell, textAlign);
                }

                // Cell width from inline styles
                if (cellElement._styles.width) {
                    this.applyCellWidth(cell, cellElement._styles.width);
                }

                // Vertical alignment from inline styles
                if (cellElement._styles.verticalAlign || cellElement._styles['vertical-align']) {
                    const vAlign: string = cellElement._styles.verticalAlign || cellElement._styles['vertical-align'];
                    this.applyCellVerticalAlignment(cell, vAlign);
                }
            }

            // Browsers centre cell content vertically unless vertical-align says otherwise
            const hasVerticalAlign: boolean = !!(cellElement._styles &&
                (cellElement._styles.verticalAlign || cellElement._styles['vertical-align'])) ||
                !!cellElement.getAttribute('valign');
            if (!hasVerticalAlign) {
                cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Center;
            }

            // Cell width and height from attributes
            const width: string | null = cellElement.getAttribute('width');
            if (width) {
                this.applyCellWidth(cell, width);
            }

            const height: string | null = cellElement.getAttribute('height');
            if (height) {
                try {
                    const heightValue: number = parseInt(height, 10);
                    if (heightValue > 0) {
                        // Note: Row height is set at the row level, not cell level in DOCX
                        // Cell height can be set indirectly via row height or row format
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.debug('Could not parse cell height:', error);
                }
            }

            // Vertical alignment
            const valign: string | null = cellElement.getAttribute('valign');
            if (valign) {
                const valignLower: string = valign.toLowerCase();
                if (valignLower === 'top') {
                    cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Top;
                } else if (valignLower === 'middle' || valignLower === 'center') {
                    cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Center;
                } else if (valignLower === 'bottom') {
                    cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Bottom;
                }
            }

            // Text alignment from align attribute
            const align: string | null = cellElement.getAttribute('align');
            if (align) {
                const alignLower: string = align.toLowerCase();
                this.applyTextAlignment(cell, alignLower);
            }

            // Background color from bgcolor attribute
            const bgcolor: string | null = cellElement.getAttribute('bgcolor');
            if (bgcolor) {
                cell.cellFormat.backColor = bgcolor;
            }

        } catch (error) {
            console.error('Error applying cell attributes:', error);
        }
    }


    /**
     * Converts a CSS length to points (px = 0.75pt). Returns undefined if not a length.
     */
    /**
     * Expands a CSS margin shorthand / longhands on a styles record to points.
     * Returns undefined when no margin is set.
     */
    private static parseMarginBox(
        st: Record<string, string> | undefined
    ): { left: number; right: number; top: number; bottom: number } | undefined {
        if (!st) {
            return undefined;
        }
        const shorthand: string[] = (st.margin || '').trim().split(/\s+/).filter((v: string) => v.length > 0);
        const top: number | undefined = shorthand.length > 0 ? this.cssLengthToPoints(shorthand[0]) : this.cssLengthToPoints(st.marginTop);
        const right: number | undefined = shorthand.length > 1 ? this.cssLengthToPoints(shorthand[1]) :
            (shorthand.length === 1 ? top : this.cssLengthToPoints(st.marginRight));
        const bottom: number | undefined = shorthand.length > 2 ? this.cssLengthToPoints(shorthand[2]) :
            (shorthand.length > 0 ? top : this.cssLengthToPoints(st.marginBottom));
        const left: number | undefined = shorthand.length > 3 ? this.cssLengthToPoints(shorthand[3]) :
            (shorthand.length === 2 ? right : (shorthand.length === 1 ? top : this.cssLengthToPoints(st.marginLeft)));
        if (top === undefined && right === undefined && bottom === undefined && left === undefined) {
            return undefined;
        }
        return { top: top || 0, right: right || 0, bottom: bottom || 0, left: left || 0 };
    }

    /**
     * Put spacing around a table by setting before/after spacing on the table's
     * paragraphs, which is how Word renders vertical space next to tables.
     */
    private static applySpacingAroundTable(table: Table, spacingPoints: number, before: boolean): void {
        const rows: TableRow[] = table.listRows();
        for (const row of rows) {
            const cells: TableCell[] = row.listCells();
            for (const cell of cells) {
                const paras: ReadonlyArray<Paragraph> = cell.listParagraphs();
                for (const para of paras) {
                    const format: any = para.paragraphFormat; // eslint-disable-line @typescript-eslint/no-explicit-any
                    if (format) {
                        if (before) {
                            format.beforeSpacing = Math.max(format.beforeSpacing || 0, spacingPoints);
                        } else {
                            format.afterSpacing = Math.max(format.afterSpacing || 0, spacingPoints);
                        }
                    }
                }
            }
        }
    }

    private static cssLengthToPoints(value: string | undefined): number | undefined {
        const m: RegExpExecArray = value ? /^(-?\d*\.?\d+)(px|pt|cm|mm|in|em)?$/.exec(value.trim().toLowerCase()) : null;
        if (!m) {
            return undefined;
        }
        const n: number = parseFloat(m[1]);
        switch (m[2]) {
        case 'pt': return n;
        case 'cm': return n * 28.35;
        case 'mm': return n * 2.835;
        case 'in': return n * 72;
        case 'em': return n * 12;
        default: return n * 0.75;
        }
    }

    /**
     * Parses a CSS border shorthand ("1px solid #ccc") into width (pt), style and hex color.
     */
    private static parseBorderShorthand(value: string): { width: number; style: BorderStyle; color: string } | undefined {
        let width: number = 0.75;
        let style: BorderStyle | undefined;
        let color: string = '000000';
        for (const token of value.trim().split(/\s+(?![^(]*\))/)) {
            const lower: string = token.toLowerCase();
            if (lower === 'none' || lower === 'hidden') {
                return undefined;
            }
            if (lower === 'solid') { style = BorderStyle.Single; continue; }
            if (lower === 'double') { style = BorderStyle.Double; continue; }
            if (lower === 'dotted') { style = BorderStyle.Dotted; continue; }
            if (lower === 'dashed') { style = BorderStyle.Dashed; continue; }
            const len: number = this.cssLengthToPoints(lower);
            if (len !== undefined) { width = len; continue; }
            if (lower === 'thin') { width = 0.75; continue; }
            if (lower === 'medium') { width = 2.25; continue; }
            if (lower === 'thick') { width = 4.5; continue; }
            const hex: string = parseCssHex(token);
            if (hex) { color = hex; }
        }
        return { width, style: style !== undefined ? style : BorderStyle.Single, color };
    }

    /**
     * Applies CSS-driven table properties: width, centering via `margin: auto`,
     * and font/colour inherited by the table's cells.
     */
    private static applyTableCss(table: Table, tableElement: _HTMLTableElement): void {
        try {
            const st: Record<string, string> = tableElement._styles;
            const width: string = st.width ? st.width.trim() : '';
            if (width.endsWith('%')) {
                const pct: number = parseFloat(width);
                if (pct > 0) {
                    // pct widths are stored as fiftieths of a percent through the twips bridge
                    table.tableFormat.preferredWidth = { type: 'pct', value: pct * 50 / 20 };
                }
            } else {
                const pts: number = this.cssLengthToPoints(width);
                if (pts !== undefined && pts > 0) {
                    table.tableFormat.preferredWidth = { type: 'dxa', value: pts };
                }
            }
            const margin: string[] = (st.margin || '').trim().toLowerCase().split(/\s+/);
            const marginLeft: string = (st.marginLeft || '').toLowerCase();
            const marginRight: string = (st.marginRight || '').toLowerCase();
            if ((margin.length >= 2 && margin[1] === 'auto' && (margin.length < 4 || margin[3] === 'auto')) ||
                (marginLeft === 'auto' && marginRight === 'auto')) {
                table.tableFormat.horizontalAlignment = TableAlignment.Center;
            } else if (marginLeft === 'auto') {
                table.tableFormat.horizontalAlignment = TableAlignment.Right;
            }
            const paddings: { top: number; right: number; bottom: number; left: number; } = this.parsePaddingBox(st);
            if (paddings && table.tableFormat.paddings) {
                table.tableFormat.paddings.top = paddings.top;
                table.tableFormat.paddings.right = paddings.right;
                table.tableFormat.paddings.bottom = paddings.bottom;
                table.tableFormat.paddings.left = paddings.left;
            }
            // Inherited font-family from the table applies to runs without their own.
            if (st.fontFamily) {
                const font: string = st.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
                for (const row of table.rows) {
                    for (const cell of row.cells) {
                        this.forEachRun(cell, (fmt: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                            if (!fmt.fontName || fmt.fontName === 'Times New Roman') {
                                fmt.fontName = font;
                            }
                        });
                    }
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply table CSS:', error);
        }
    }

    private static parsePaddingBox(st: Record<string, string>): { top: number; right: number; bottom: number; left: number } | undefined {
        const sides: { top: number; right: number; bottom: number; left: number; } = {
            top: undefined as number | undefined,
            right: undefined as number | undefined,
            bottom: undefined as number | undefined,
            left: undefined as number | undefined
        };
        if (st.padding) {
            const t: number[] = st.padding.trim().split(/\s+/).map((v: string) => this.cssLengthToPoints(v));
            if (t.length === 0 || t.length > 4 || t.some((v: number) => v === undefined)) {
                return undefined;
            }
            sides.top = t[0];
            sides.right = t.length > 1 ? t[1] : t[0];
            sides.bottom = t.length > 2 ? t[2] : t[0];
            sides.left = t.length > 3 ? t[3] : sides.right;
        }
        const edge: (v: string, cur: number) => number = (v: string | undefined, cur: number | undefined): number | undefined => {
            const n: number = this.cssLengthToPoints(v);
            return n !== undefined ? n : cur;
        };
        sides.top = edge(st.paddingTop, sides.top);
        sides.right = edge(st.paddingRight, sides.right);
        sides.bottom = edge(st.paddingBottom, sides.bottom);
        sides.left = edge(st.paddingLeft, sides.left);
        if (sides.top === undefined && sides.right === undefined && sides.bottom === undefined && sides.left === undefined) {
            return undefined;
        }
        return { top: sides.top || 0, right: sides.right || 0, bottom: sides.bottom || 0, left: sides.left || 0 };
    }

    /** Runs `fn` with the character format of every text run in the cell. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static forEachRun(cell: TableCell, fn: (fmt: any) => void): void {
        for (const para of cell.paragraphs) {
            if (!para || !para.items) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const items: any[] = para.items.snapshot ? para.items.snapshot() : [];
            for (const item of items) {
                if (item && item.characterFormat) {
                    fn(item.characterFormat);
                }
            }
        }
    }

    /**
     * Applies CSS properties that the generic cell code does not cover: border
     * shorthand, padding, and text colour / size / font / alignment for runs.
     * Runs after the cell content has been mapped.
     */
    private static applyCellCss(cell: TableCell, cellElement: _HTMLTableCellElement): void {
        try {
            const st: Record<string, string> = cellElement._styles;
            const edges: Array<['top' | 'right' | 'bottom' | 'left', string | undefined]> = [
                ['top', st.borderTop || st.border], ['right', st.borderRight || st.border],
                ['bottom', st.borderBottom || st.border], ['left', st.borderLeft || st.border]
            ];
            for (const [edge, value] of edges) {
                const parsed: { width: number; style: BorderStyle; color: string; } = value ? this.parseBorderShorthand(value) : undefined;
                if (parsed) {
                    const b: Border = cell.cellFormat.borders[edge];
                    b.borderType = parsed.style;
                    b.lineWidth = parsed.width;
                    b.color = parsed.color;
                }
            }
            const pad: { top: number; right: number; bottom: number; left: number; } = this.parsePaddingBox(st);
            if (pad) {
                cell.cellFormat.paddings.top = pad.top;
                cell.cellFormat.paddings.right = pad.right;
                cell.cellFormat.paddings.bottom = pad.bottom;
                cell.cellFormat.paddings.left = pad.left;
            }
            let hex: string = parseCssHex(st.color);
            if (!hex) {
                // CSS inheritance: cell -> row -> thead/tbody/tfoot section
                let ancestor: _HTMLElement | null | undefined = cellElement._parentNode;
                while (ancestor && !hex) {
                    const tag: string = ancestor.tagName ? ancestor.tagName.toLowerCase() : '';
                    if (tag === 'table') {
                        break;
                    }
                    const ancestorColor: string | undefined = ancestor._styles ? parseCssHex(ancestor._styles.color) : undefined;
                    hex = ancestorColor !== undefined ? ancestorColor : undefined;
                    ancestor = ancestor._parentNode;
                }
            }
            const font: string = st.fontFamily ? st.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '') : undefined;
            const size: number = st.fontSize ? this.cssLengthToPoints(st.fontSize) : undefined;
            if (hex || font || size) {
                this.forEachRun(cell, (fmt: any) => {
                    const snap: any = fmt.snapshot();
                    if (hex && !snap.textColorValue) {
                        snap.textColorValue = hex;
                        snap.textColorTheme = undefined;
                        fmt.hydrate(snap);
                    }
                    if (font) { fmt.fontName = font; }
                    if (size && size > 0) { fmt.fontSize = size; }
                });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply cell CSS:', error);
        }
    }

    /**
     * Apply header cell formatting (bold text).
     * Recursively apply bold formatting to all paragraphs and text ranges in the cell.
     *
     * @param {unknown} cell - The cell value
     * @returns {void}
     */
    private static applyHeaderCellFormatting(cell: TableCell): void {
        try {
            for (const para of cell.paragraphs) {
                if (para && para.items) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const items: any[] = para.items.snapshot ? para.items.snapshot() : [];
                    for (const item of items) {
                        // Apply bold to text ranges (only TextRange has characterFormat)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if ((item as any).characterFormat) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (item as any).characterFormat.bold = true;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error applying header cell formatting:', error);
        }
    }

    /**
     * Get the number of rows in an HTML table.
     *
     * @param {unknown} tableElement - The tableElement value
     * @returns {number}
     */
    private static getTableRowCount(tableElement: _HTMLTableElement): number {
    // tslint:disable-next-line: no-any
        let rowCount: number = 0;

        for (const child of tableElement._childNodes) {
            const childTag: string = child.tagName.toLowerCase();
            if (childTag === 'thead' || childTag === 'tbody' || childTag === 'tfoot') {
                // Count tr elements in sections
                for (const sectionChild of child._childNodes) {
                    if (sectionChild.tagName.toLowerCase() === 'tr') {
                        rowCount++;
                    }
                }
            } else if (childTag === 'tr') {
                // Direct tr element
                rowCount++;
            }
        }

        return Math.max(rowCount, 1);
    }

    /**
     * Get the maximum number of columns in an HTML table.
     *
     * @param {unknown} tableElement - The tableElement value
     * @returns {number}
     */
    private static getTableColumnCount(tableElement: _HTMLTableElement): number {
        return this.buildTableGrid(tableElement).columnCount;
    }

    /**
     * Apply border color to all borders of a table cell.
     *
     * @param cell - The table cell
     * @param borderColor - The border color value
     */
    private static applyBorderColor(cell: TableCell, borderColor: string): void {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cellFormat: any = cell.cellFormat as any;
            if (cellFormat.borders) {
                cellFormat.borders.top.color = borderColor;
                cellFormat.borders.bottom.color = borderColor;
                cellFormat.borders.left.color = borderColor;
                cellFormat.borders.right.color = borderColor;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply border color to cell:', error);
        }
    }

    /**
     * Apply border styles (width and line style) to table cell.
     *
     * @param cell - The table cell
     * @param styles - The inline styles object
     */
    private static applyBorderStyles(cell: TableCell, styles: any): void {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cellFormat: any = cell.cellFormat as any;

            const borderWidth: any = styles.borderWidth || styles['border-width'];
            const borderStyle: any = styles.borderStyle || styles['border-style'];

            if (cellFormat.borders) {
                // Apply border width if specified (convert CSS to OOXML)
                if (borderWidth) {
                    // Parse border width (e.g., "1pt" -> 1)
                    const widthMatch: RegExpMatchArray = String(borderWidth).match(/(\d+)/);
                    if (widthMatch && cellFormat.borders.top) {
                        cellFormat.borders.top.lineWidth = parseInt(widthMatch[1], 10);
                        cellFormat.borders.bottom.lineWidth = parseInt(widthMatch[1], 10);
                        cellFormat.borders.left.lineWidth = parseInt(widthMatch[1], 10);
                        cellFormat.borders.right.lineWidth = parseInt(widthMatch[1], 10);
                    }
                }

                // Apply border style if specified
                if (borderStyle) {
                    // Map CSS border styles to OOXML
                    const styleValue: string = String(borderStyle).toLowerCase();
                    cellFormat.borders.top.lineStyle = styleValue === 'solid' ? 'Single' : styleValue;
                    cellFormat.borders.bottom.lineStyle = styleValue === 'solid' ? 'Single' : styleValue;
                    cellFormat.borders.left.lineStyle = styleValue === 'solid' ? 'Single' : styleValue;
                    cellFormat.borders.right.lineStyle = styleValue === 'solid' ? 'Single' : styleValue;
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply border styles to cell:', error);
        }
    }

    /**
     * Apply text alignment to all paragraphs in a table cell.
     *
     * @param cell - The table cell
     * @param alignment - The text alignment value (left, center, right, justify)
     */
    private static applyTextAlignment(cell: TableCell, alignment: string): void {
        try {
            const alignLower: string = String(alignment).toLowerCase();
            let alignValue: HorizontalAlignment = HorizontalAlignment.Left;

            if (alignLower === 'center' || alignLower === 'centered') {
                alignValue = HorizontalAlignment.Center;
            } else if (alignLower === 'right') {
                alignValue = HorizontalAlignment.Right;
            }
            // Apply alignment to all paragraphs in the cell
            for (const para of cell.paragraphs) {
                if (para && para.paragraphFormat) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    para.paragraphFormat.horizontalAlignment = alignValue as any;
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply text alignment to cell:', error);
        }
    }

    /**
     * Apply cell width from CSS or HTML attribute.
     *
     * @param cell - The table cell
     * @param widthValue - The width value (e.g., "110px", "20%", "100")
     */
    private static applyCellWidth(cell: TableCell, widthValue: string): void {
        try {
            const widthStr: string = String(widthValue).trim();
            if (!widthStr) {
                return;
            }

            // Parse numeric value and unit
            let numValue: number = 0;
            let unit: string = 'px';

            // Try to extract number and unit
            if (widthStr.endsWith('%')) {
                numValue = parseFloat(widthStr);
                unit = '%';
            } else if (widthStr.endsWith('pt')) {
                numValue = parseFloat(widthStr);
                unit = 'pt';
            } else if (widthStr.endsWith('px')) {
                numValue = parseFloat(widthStr);
                unit = 'px';
            } else if (widthStr.endsWith('cm')) {
                numValue = parseFloat(widthStr);
                unit = 'cm';
            } else if (widthStr.endsWith('in')) {
                numValue = parseFloat(widthStr);
                unit = 'in';
            } else {
                // Try to parse as just a number (default to px)
                numValue = parseFloat(widthStr);
                if (isNaN(numValue)) {
                    return;
                }
                unit = 'px';
            }

            if (isNaN(numValue) || numValue <= 0) {
                return;
            }

            // Convert to appropriate unit for DOCX (points)
            let points: number = numValue;
            if (unit === 'px') {
                // 1px ≈ 0.75pt
                points = numValue * 0.75;
            } else if (unit === 'cm') {
                // 1cm = 28.35pt
                points = numValue * 28.35;
            } else if (unit === 'in') {
                // 1in = 72pt
                points = numValue * 72;
            } else if (unit === '%') {
                // For percentage, set as percentage type
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cellFormat: any = cell.cellFormat as any;
                if (cellFormat && cellFormat.preferredWidth !== undefined) {
                    cellFormat.preferredWidth = {
                        type: 'pct',
                        value: numValue * 50 // OOXML uses fiftieths of a percent
                    };
                }
                return;
            }

            // Set preferred width in dxa (twips)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cellFormat: any = cell.cellFormat as any;
            if (cellFormat && cellFormat.preferredWidth !== undefined) {
                cellFormat.preferredWidth = {
                    type: 'dxa',
                    value: Math.round(points) // Store as points, OOXML will convert to twips
                };
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply cell width:', error);
        }
    }

    /**
     * Apply cell vertical alignment from CSS or HTML attribute.
     *
     * @param cell - The table cell
     * @param vAlign - The vertical alignment value (top, middle, bottom, center)
     */
    private static applyCellVerticalAlignment(cell: TableCell, vAlign: string): void {
        try {
            const valignLower: string = String(vAlign).toLowerCase();
            if (valignLower === 'top') {
                cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Top;
            } else if (valignLower === 'middle' || valignLower === 'center') {
                cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Center;
            } else if (valignLower === 'bottom') {
                cell.cellFormat.verticalAlignment = TableCellVerticalAlignment.Bottom;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.debug('Could not apply cell vertical alignment:', error);
        }
    }

    /**
     * Get the number of columns in an HTML table row.
     *
     * @param {unknown} rowElement - The rowElement value
     * @returns {number}
     */
    private static getRowColumnCount(rowElement: _HTMLTableRowElement): number {
    // tslint:disable-next-line: no-any
        let colCount: number = 0;

        for (const child of rowElement._childNodes) {
            const childTag: string = child.tagName.toLowerCase();
            if (childTag === 'td' || childTag === 'th') {
                const colspan: string | null = child.getAttribute('colspan');
                const colspanValue: number = colspan ? parseInt(colspan, 10) : 1;
                colCount += colspanValue;
            }
        }

        return Math.max(colCount, 1);
    }
}
