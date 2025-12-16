import { createElement, formatUnit } from '@syncfusion/ej2-base';
import { ITableBlockSettings, TableRowModel, TableColumnModel, BlockModel } from '../../../models/index';
import { events } from '../../../common/constant';
import { BlockManager } from '../../base/block-manager';
import * as constants from '../../../common/constant';
import { decoupleReference, extractBlockTypeFromElement, getBlockModelById } from '../../../common/utils/index';
import { TableUIManager } from '../../plugins/table/ui-manager';
import { TableContext } from '../../base/interface';

export class TableRenderer {
    private parent: BlockManager;
    private uiManagers: Map<string, TableUIManager> = new Map();
    public nonEditableElements: string[] = [
        'e-row-insert-handle',
        'e-col-insert-handle',
        'e-row-action-handle',
        'e-col-action-handle',
        'e-row-dot',
        'e-col-dot',
        'e-row-dot-hit',
        'e-col-dot-hit',
        'e-row-number'
    ];

    constructor(editor: BlockManager) {
        this.parent = editor;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.observer.on('input', this.handleHeaderInput, this);
        this.parent.observer.on(events.destroy, this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.observer.off('input', this.handleHeaderInput);
        this.parent.observer.off(events.destroy, this.destroy);
    }

    /**
     * Renders the table block element in the editor
     *
     * @param {BlockModel} block - The data model of the block, used to determine available actions and state.
     * @param {HTMLElement} blockElement - The root DOM element representing the table block.
     * @returns {HTMLTableElement} - The html table element
     * @hidden
     */
    public renderTable(block: BlockModel, blockElement: HTMLElement): HTMLTableElement {
        blockElement.classList.add(constants.TABLE_BLOCK_CLS);
        const props: ITableBlockSettings = block.properties as ITableBlockSettings;
        const blockId: string = block.id;
        const table: HTMLTableElement = createElement('table', {
            className: 'e-table-element',
            attrs: {
                'data-block-id': blockId,
                'data-col-counter': `${(props.columns).length}`,
                'role': 'grid',
                'style': `width: ${formatUnit(props.width)}`
            }
        }) as HTMLTableElement;
        // Create colgroup for column width management
        const colgroup: HTMLTableColElement = createElement('colgroup') as HTMLTableColElement;
        table.appendChild(colgroup);

        if (props.enableRowNumbers) {
            const rnCol: HTMLTableColElement = createElement('col') as HTMLTableColElement;
            rnCol.classList.add('e-col-row-number');
            rnCol.style.width = '44px'; // fixed width for row numbers
            colgroup.appendChild(rnCol);
        }

        const colCount: number = props.columns.length;
        const newWidth: string = (100 / colCount).toLocaleString() + '%';

        // Add columns with specified widths or default
        for (let i: number = 0; i < colCount; i++) {
            const col: HTMLTableColElement = createElement('col') as HTMLTableColElement;
            col.style.width = props.columns[i as number].width ? formatUnit(props.columns[i as number].width) : newWidth;
            colgroup.appendChild(col);
        }

        if (props.enableHeader && colCount > 0) {
            const thead: HTMLTableSectionElement = createElement('thead') as HTMLTableSectionElement;
            const headerRow: HTMLTableRowElement = createElement('tr') as HTMLTableRowElement;

            if (props.enableRowNumbers) {
                const thRN: HTMLTableCellElement = createElement('th', {
                    className: 'e-row-number',
                    attrs: { 'aria-hidden': 'true', tabindex: '-1', contenteditable: 'false' }
                }) as HTMLTableCellElement;
                headerRow.appendChild(thRN);
            }

            props.columns.forEach((c: TableColumnModel, cIdx: number) => {
                const th: HTMLTableCellElement = createElement('th') as HTMLTableCellElement;
                th.textContent = c.headerText;
                th.dataset.row = '0';
                th.dataset.col = cIdx.toString();
                th.tabIndex = 0;
                th.setAttribute('role', 'columnheader');
                th.setAttribute('contenteditable', 'true');
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        const tbody: HTMLTableSectionElement = createElement('tbody') as HTMLTableSectionElement;
        props.rows.forEach((row: TableRowModel, rIdx: number) => {
            const visualIndex: number = props.enableHeader ? rIdx + 1 : rIdx;
            tbody.appendChild(this.parent.tableService.createRow(visualIndex, props, block, row));
        });
        table.appendChild(tbody);

        if (!props.readOnly) {
            this.attachHoverUI(table, blockElement, block);
            this.parent.tableSelectionManager.attachTableEvents(table, blockElement);
        } else {
            this.updateTableReadyOnlyState(table, props.readOnly);
        }
        return table;
    }

    /**
     * Attaches unified hover UI elements (dots, hit-zones, drag lines, action menu, and insert handles)
     * to the specified block when the mouse hovers over it
     *
     * @param {HTMLTableElement} table - The table element associated with the block (used for certain block types).
     * @param {HTMLElement} blockElement - The root DOM element representing the table block.
     * @param {BlockModel} blockModel - The data model of the block, used to determine available actions and state.
     * @returns {void}
     * @hidden
     */
    public attachHoverUI(table: HTMLTableElement, blockElement: HTMLElement, blockModel: BlockModel): void {
        const uiManager: TableUIManager = this.registerUIManager(blockElement.id);
        uiManager.init(table, blockElement, blockModel);
    }

    /**
     * Removes the created ui manager instance for the particular block
     *
     * @param {string} blockId - The id of the table block
     * @returns {void}
     * @hidden
     */
    public removeHoverUI(blockId: string): void {
        const uiManager: TableUIManager = this.getManager(blockId);
        if (uiManager) {
            uiManager.destroy();
            this.uiManagers.delete(blockId);
        }
    }

    /**
     * Registers the UI manager instance in map for retrieving.
     *
     * @param {string} blockId - The id of the table block
     * @returns {TableUIManager} - Manager instance
     * @hidden
     */
    public registerUIManager(blockId: string): TableUIManager {
        const manager: TableUIManager = new TableUIManager(this.parent);
        this.uiManagers.set(blockId, manager);
        return manager;
    }

    /**
     * Fetches the UI manager instance based on blockId.
     *
     * @param {string} blockId - The id of the table block
     * @returns {TableUIManager} - Manager instance
     * @hidden
     */
    public getManager(blockId: string): TableUIManager {
        return this.uiManagers.get(blockId);
    }

    /**
     * Updates the read-only state of a table block by toggling content editing capabilities.
     *
     * @param {HTMLTableElement} element - The table element to update.
     * @param {boolean} value - `true` to make the table read-only, `false` to make it editable.
     * @returns {void}
     * @hidden
     */
    public updateTableReadyOnlyState(element: HTMLTableElement, value: boolean): void {
        let editableElements: HTMLElement[] = Array.from(element.querySelectorAll(`[contenteditable='${value}']`));

        editableElements = editableElements.filter((element: HTMLElement) => {
            return !this.nonEditableElements.some((className: string) => element.classList.contains(className));
        });

        editableElements.forEach((element: HTMLElement) => {
            element.contentEditable = (!value).toString();
            element.dataset.tableReadonlyProcessed = 'true';
        });

        element.classList.toggle('e-readonly', value);
    }

    /**
     * Based on current focused cell element, resolves the context and returns it.
     *
     * @returns {TableContext} - The context object containing details about current focused table
     * @hidden
     */
    public resolveTableContext(): TableContext {
        const focusedEl: HTMLElement = this.parent.currentFocusedBlock;
        const tableBlockEl: HTMLElement = focusedEl && focusedEl.closest('.' + constants.TABLE_BLOCK_CLS) as HTMLElement;
        if (!tableBlockEl) { return null; }
        const tableEl: HTMLTableElement = tableBlockEl.querySelector('table');
        const blockId: string = tableEl.getAttribute('data-block-id') || tableBlockEl.id;
        const tableBlock: BlockModel = getBlockModelById(blockId, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = tableBlock.properties as ITableBlockSettings;
        const td: HTMLTableCellElement = focusedEl.closest('td') || tableEl.querySelector('.e-cell-focus');
        const startDataRow: number = props.enableHeader ? (parseInt(td.dataset.row, 10) - 1) : parseInt(td.dataset.row, 10);
        const startDataCol: number = parseInt(td.dataset.col, 10);
        return { tableBlockEl, tableEl, props, startDataRow, startDataCol };
    }

    private handleHeaderInput(): void {
        const blockElement: HTMLElement = this.parent.currentFocusedBlock;
        if (!blockElement || (blockElement && extractBlockTypeFromElement(blockElement) !== 'Table')) { return; }

        const blockModel: BlockModel = getBlockModelById(blockElement.id, this.parent.getEditorBlocks());
        const props: ITableBlockSettings = blockModel.properties as ITableBlockSettings;
        const tableHeaders: NodeListOf<HTMLTableCellElement> = blockElement.querySelectorAll('thead th:not(.e-row-number)');
        const oldColumns: TableColumnModel[] = decoupleReference(props.columns);
        tableHeaders.forEach((headerElement: HTMLTableCellElement) => {
            const colIndex: number = parseInt(headerElement.getAttribute('data-col'), 10);
            const updatedHeaderText: string = headerElement.textContent;

            props.columns[colIndex as number].headerText = updatedHeaderText;
        });
        const updatedColumns: TableColumnModel[] = decoupleReference(props.columns);

        this.parent.undoRedoAction.trackTableHeaderInputForUndoRedo({
            blockId: blockModel.id,
            oldColumns,
            updatedColumns
        });
    }

    private destroyAllTableManagers(): void {
        if (this.uiManagers.size > 0) {
            this.uiManagers.forEach((manager: TableUIManager) => {
                manager.destroy();
            });
            this.uiManagers.clear();
        }
    }

    public destroy(): void {
        this.removeEventListener();
        this.destroyAllTableManagers();
    }
}
