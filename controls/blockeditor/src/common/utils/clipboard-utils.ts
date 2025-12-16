import { BlockType } from '../../models/enums';
import { BlockModel, ContentModel, TableCellModel, TableColumnModel, ITableBlockSettings, TableRowModel } from '../../models/index';
import { BlockFactory } from '../../block-manager/services/index';
import { TableClipboardPayload } from '../../block-manager/base/interface';
import * as constants from '../../common/constant';
import { getModifierKey } from './data';
import { toModelRow } from './table-utils';

/**
 * Generates plain text representation of blocks for external clipboard
 *
 * @param {BlockModel[]} blocks - Block models to convert to plain text
 * @returns {string} Plain text representation of blocks
 */
export function generatePlainTextForExternalClipboard(blocks: BlockModel[]): string {
    const textParts: string[] = [];

    blocks.forEach((block: BlockModel) => {
        if (block.blockType === BlockType.BulletList) {
            textParts.push(`• ${getBlockText(block)}\n`);
        } else if (block.blockType === BlockType.NumberedList) {
            const blockElement: HTMLElement = document.getElementById(block.id);
            const listItem: HTMLElement = blockElement.querySelector('li');
            const computedStyle: CSSStyleDeclaration = window.getComputedStyle(listItem);
            const marker: string = computedStyle.getPropertyValue('list-style-type');
            textParts.push(`${marker}${getBlockText(block)}\n`);
        } else if (block.blockType === BlockType.Divider) {
            textParts.push('---\n');
        } else {
            textParts.push(`${getBlockText(block)}\n`);
        }
    });

    return textParts.join('');
}

/**
 * Creates block model from plain clipboard text
 *
 * @param {string} text - Text from clipboard
 * @returns {BlockModel[]} Array of block models
 */
export function createBlocksFromPlainText(text: string): BlockModel[] {
    const lines: string[] = text.split(/\r?\n/);
    const blocks: BlockModel[] = [];

    lines.forEach((line: string) => {
        if (line.trim() === '') {
            return;
        }

        const bulletMatch: RegExpMatchArray = line.match(/^[\s]*[•\-*]\s+(.*)/);
        if (bulletMatch) {
            blocks.push(
                BlockFactory.createBulletListBlock({
                    content: [BlockFactory.createTextContent({ content: bulletMatch[1] })]
                })
            );
            return;
        }

        const numberedMatch: RegExpMatchArray = line.match(/^[\s]*(\d+)[.)]\s+(.*)/);
        if (numberedMatch) {
            blocks.push(
                BlockFactory.createNumberedListBlock({
                    content: [BlockFactory.createTextContent({ content: numberedMatch[2] })]
                })
            );
            return;
        }

        blocks.push(
            BlockFactory.createParagraphBlock({
                content: [BlockFactory.createTextContent({ content: line })]
            })
        );
    });

    return blocks;
}

/**
 * Gets text content from a block model
 *
 * @param {BlockModel} block - Block model to extract text from
 * @returns {string} Plain text content from block
 */
export function getBlockText(block: BlockModel): string {
    if (!block.content || block.content.length === 0) {
        return '';
    }

    return block.content.map((content: ContentModel) => content.content).join('');
}

/**
 * Checks if HTML content contains block-level elements
 *
 * @param {HTMLElement} container - Container with HTML content
 * @returns {boolean} True if contains block-level elements
 */
export function isBlockLevelContent(container: HTMLElement): boolean {
    const blockTags: string[] = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'TABLE', 'IMG'];
    return Array.from(container.querySelectorAll('*')).some((el: Element) => blockTags.indexOf(el.tagName) !== -1);
}

/**
 * Unwraps container element if needed
 *
 * @param {HTMLElement} container - Container to potentially unwrap
 * @returns {HTMLElement} Unwrapped container or original
 */
export function unWrapContainer(container: HTMLElement): HTMLElement {
    const firstChild: HTMLElement = container.firstElementChild as HTMLElement;

    if (
        container.childElementCount === 1 &&
        firstChild.tagName === 'SPAN'
    ) {
        const innerHasBlock: boolean = isBlockLevelContent(firstChild);

        if (innerHasBlock) {
            const newContainer: HTMLElement = document.createElement('div');
            Array.from(firstChild.childNodes).forEach((child: ChildNode) => newContainer.appendChild(child.cloneNode(true)));
            return newContainer;
        }
    }
    return container;
}

export function writeTableClipboardPayload(dt: DataTransfer, payload: TableClipboardPayload, html: string, text: string): void {
    dt.setData('text/blockeditor-table', JSON.stringify(payload));
    dt.setData('text/html', html);
    dt.setData('text/plain', text);
}

export function readTableClipboardPayload(dt: DataTransfer): TableClipboardPayload | null {
    try {
        const data: string = dt.getData('text/blockeditor-table');
        if (!data) { return null; }
        const parsed: TableClipboardPayload = JSON.parse(data);
        if (parsed && parsed.type === 'table') {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

export function buildTableClipboardPayload(tableBlockEl: HTMLElement, blockModel: BlockModel): TableClipboardPayload {
    if (!tableBlockEl || !blockModel) { return null; }
    const tableEl: HTMLTableElement = tableBlockEl.querySelector('table');
    const props: ITableBlockSettings = blockModel.properties as ITableBlockSettings;

    // Detect row and column selection
    const selectedRow: HTMLElement = tableEl.querySelector('tr.e-row-selected');
    const selectedCol: HTMLElement = tableBlockEl.querySelector('td.e-col-selected');

    // Detect focused cells (TABLE_CELL_FOCUS)
    const targetEle: HTMLElement = (selectedRow || tableEl) as HTMLElement;
    const selector: string = selectedRow
        ? 'td:not(.e-row-number)'
        : (selectedCol ? ('td.e-col-selected') : (`td.${constants.TABLE_CELL_FOCUS}`));
    const focusedCells: HTMLTableCellElement[] = Array.from(targetEle.querySelectorAll(selector));

    type DataPos = { r: number, c: number };
    const dataPositions: DataPos[] = focusedCells.map((td: HTMLTableCellElement) => ({
        r: toModelRow(parseInt(td.dataset.row, 10), props.enableHeader),
        c: parseInt(td.dataset.col, 10)
    }));
    const minR: number = Math.min(...dataPositions.map((p: DataPos) => p.r));
    const maxR: number = Math.max(...dataPositions.map((p: DataPos) => p.r));
    const minC: number = Math.min(...dataPositions.map((p: DataPos) => p.c));
    const maxC: number = Math.max(...dataPositions.map((p: DataPos) => p.c));
    const height: number = maxR - minR + 1;
    const width: number = maxC - minC + 1;
    const cells: BlockModel[][][] = [];

    for (let r: number = 0; r < height; r++) {
        const rowCells: BlockModel[][] = [];
        for (let c: number = 0; c < width; c++) {
            rowCells.push(props.rows[minR + r].cells[minC + c].blocks);
        }
        cells.push(rowCells);
    }
    return {
        type: 'table',
        mode: 'cells',
        cells,
        meta: { rows: height, cols: width, enableHeader: !!props.enableHeader, enableRowNumbers: !!props.enableRowNumbers }
    };
}

export function extractPlainTextMatrixFromPayload(payload: TableClipboardPayload, blockModel: BlockModel): string[][] {
    const matrix: string[][] = [];
    const p: ITableBlockSettings = (payload.mode === 'table' ? payload.table.props : blockModel.properties) as ITableBlockSettings;
    if (p.enableHeader) {
        const headerRow: string[] = [];

        for (let i: number = 0; i < payload.meta.cols; i++) {
            const column: TableColumnModel = p.columns[i as number];
            const headerText: string = column.headerText;
            headerRow.push(headerText);
        }

        matrix.push(headerRow);
    }
    if (payload.mode === 'table' && payload.table && payload.table.props) {
        const colCount: number = (p.columns).length;
        p.rows.forEach((row: TableRowModel) => {
            const cells: string[] = new Array(colCount).fill('');
            (row.cells).forEach((cell: TableCellModel, idx: number) => {
                const blocks: BlockModel[] = cell.blocks;
                const cellText: string = blocks.map((b: BlockModel) => getBlockText(b)).join(' ');
                cells[idx as number] = cellText;
            });
            matrix.push(cells);
        });
        return matrix;
    }
    // For non-table modes, approximate to rectangular text for fallback
    if (payload.cells && payload.cells.length) {
        payload.cells.forEach((rowCells: BlockModel[][]) => {
            const rowTexts: string[] = rowCells.map((cellBlocks: BlockModel[]) => cellBlocks.map((b: BlockModel) => getBlockText(b)).join(' '));
            matrix.push(rowTexts);
        });
    }
    return matrix;
}

export function createCellsPayloadFromExternal(html: string, text: string): TableClipboardPayload | null {
    let matrix: string[][] = [];
    if (html && /<table[\s\S]*?>[\s\S]*?<\/table>/i.test(html)) {
        const div: HTMLElement = document.createElement('div');
        div.innerHTML = html;

        // For cell paste, always ignore headers
        const tbody: HTMLTableElement = div.querySelector('table tbody');
        if (tbody) {
            const rows: HTMLTableRowElement[] = Array.from(tbody.querySelectorAll('tr')) as HTMLTableRowElement[];
            const tmp: string[][] = [];
            for (const trow of rows) {
                const cells: HTMLElement[] = Array.from(trow.querySelectorAll('th,td')) as HTMLElement[];
                const filtered: HTMLElement[] = cells.filter((c: HTMLElement) => !c.classList.contains('e-row-number'));
                if (filtered.length) { tmp.push(filtered.map((c: HTMLElement) => (c.textContent).trim())); }
            }
            const maxCols: number = Math.max(0, ...tmp.map((r: string[]) => r.length));
            tmp.forEach((r: string[]) => { while (r.length < maxCols) { r.push(''); } });
            matrix = tmp;
        }
    } else if (text && (text.indexOf('\t') !== -1 || /\r?\n.*\t/.test(text))) {
        matrix = text.split(/\r?\n/).filter((l: string) => l.length > 0).map((l: string) => l.split('\t'));
    }
    if (!matrix.length) { return null; }
    const cells: BlockModel[][][] = matrix.map((row: string[]) => row.map((cell: string) =>
        [BlockFactory.createParagraphBlock({ content: [BlockFactory.createTextContent({ content: cell })] })]
    ));
    return {
        type: 'table',
        mode: 'cells',
        meta: { rows: matrix.length, cols: matrix[0].length, enableHeader: false, enableRowNumbers: false },
        cells
    };
}

export function tsvFromMatrix(matrix: string[][]): string {
    return matrix.map((row: string[]) => row.map((c: string) => c.replace(/\t/g, ' ').replace(/\r?\n/g, ' ')).join('\t')).join('\n');
}

export function matrixFromTsv(text: string): string[][] {
    return text.split(/\r?\n/).filter((l: string) => l.length > 0).map((l: string) => l.split('\t'));
}

export function htmlTableFromMatrix(matrix: string[][], options: { hasHeader?: boolean; hasRowNumbers?: boolean } = {}): string {
    const hasHeader: boolean = !!options.hasHeader;
    // const rn: boolean = !!options.hasRowNumbers;
    const rows: string[] = [];
    const bodyStart: number = hasHeader ? 1 : 0;
    if (hasHeader) {
        const hdrCells: string[] = matrix[0].map((text: string) => `<th>${escapeHtml(text)}</th>`);
        rows.push(`<thead><tr>${hdrCells.join('')}</tr></thead>`);
    }
    const bodyRows: string[] = [];
    for (let r: number = bodyStart; r < matrix.length; r++) {
        const tds: string[] = matrix[r as number].map((text: string) => `<td>${escapeHtml(text)}</td>`);
        bodyRows.push(`<tr>${tds.join('')}</tr>`);
    }
    rows.push(`<tbody>${bodyRows.join('')}</tbody>`);
    return `<table>${rows.join('')}</table>`;
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
