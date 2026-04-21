import { Spreadsheet } from '../base/index';
import { IRowRenderer, ICellRenderer, CellRenderArgs, deInitProperties } from '../common/index';
import { getRowHeight, SheetModel, getCell, isHiddenRow, isHiddenCol } from '../../workbook/base/index';
import { attributes } from '@syncfusion/ej2-base';
import { getCellAddress, getCellIndexes, skipHiddenIdx, isImported } from '../../workbook/common/index';

/**
 * RowRenderer module is used for creating row element
 *
 * @hidden
 */
export class RowRenderer implements IRowRenderer {
    private parent: Spreadsheet;
    private element: HTMLTableRowElement;
    private cellRenderer: ICellRenderer;
    private bottomBorderWidth: number;

    constructor(parent?: Spreadsheet) {
        this.parent = parent;
        this.element = this.parent.createElement('tr') as HTMLTableRowElement;
        this.cellRenderer = parent.serviceLocator.getService<ICellRenderer>('cell');
        this.parent.on(deInitProperties, this.initProps, this);
    }

    public render(index?: number, isRowHeader?: boolean, preventHiddenCls?: boolean): Element {
        const row: HTMLElement = this.element.cloneNode() as HTMLElement;
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (index === undefined) {
            row.classList.add('e-header-row');
            return row;
        }
        row.classList.add('e-row');
        this.getBorderWidth();
        const rowHeight: number = getRowHeight(sheet, index, true);
        const actualRowHgt: number = getRowHeight(sheet, index);
        const rowStyles: { height: string, lineHeight: string } = {
            height: `${rowHeight}px`,
            lineHeight: (actualRowHgt < 20) ?
                (rowHeight > this.bottomBorderWidth ? `${rowHeight - this.bottomBorderWidth}px` : '0px') : ''
        };
        Object.assign(row.style, rowStyles);
        attributes(row, { 'aria-rowindex': (index + 1).toString() });
        if (isRowHeader && !preventHiddenCls) {
            if (actualRowHgt < 20) {
                const width: number = 4 + (this.bottomBorderWidth - 1);
                row.style.lineHeight = rowHeight >= width ? `${rowHeight - width}px` :
                    (rowHeight > this.bottomBorderWidth ? `${rowHeight - this.bottomBorderWidth}px` : '0px');
                if (!row.classList.contains('e-reach-fntsize')) {
                    row.classList.add('e-reach-fntsize');
                }
            }
            if (isHiddenRow(sheet, index + 1) && !isHiddenRow(sheet, index - 1)) {
                row.classList.add('e-hide-start');
            }
            if (index !== 0 && isHiddenRow(sheet, index - 1) && !isHiddenRow(sheet, index + 1)) {
                row.classList.add('e-hide-end');
            }
        }
        return row;
    }

    public getBorderWidth(): number {
        if (!this.bottomBorderWidth) {
            let width: number = 1;
            if (window.devicePixelRatio % 1 > 0) {
                const pointValue: number = (1 * window.devicePixelRatio) % 1;
                width = 1 + (pointValue ? ((pointValue > 0.5 ? (1 - pointValue) : -1 * pointValue) / window.devicePixelRatio) : 0);
            }
            this.bottomBorderWidth = width;
        }
        return this.bottomBorderWidth;
    }

    public refresh(index: number, pRow: Element, hRow?: Element, header?: boolean, preventHiddenCls?: boolean): Element {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let row: Element;
        if (header) {
            row = this.render(index, header, preventHiddenCls);
            this.cellRenderer.renderRowHeader(index, row);
        } else {
            let i: number; let len: number;
            const updateCells: Function = (): void => {
                while (i <= len) {
                    if (!isHiddenCol(sheet, i)) {
                        this.cellRenderer.render(
                            <CellRenderArgs>{ colIdx: i, rowIdx: index, cell: getCell(index, i, sheet), address: getCellAddress(index, i),
                                lastCell: i === len, row: row, hRow: hRow, isHeightCheckNeeded: true, pRow: pRow, first:
                                index === this.parent.viewport.topIndex && skipHiddenIdx(sheet, index, true) !==
                                skipHiddenIdx(sheet, 0, true) ? 'Row' : '', skipFormatCheck: isImported(this.parent), checkCF: true });
                    }
                    i++;
                }
            };
            const frozenCol: number = this.parent.frozenColCount(sheet);
            if (frozenCol) {
                row = hRow;
                i = getCellIndexes(sheet.topLeftCell)[0];
                len = frozenCol - 1;
                updateCells();
            }
            row = this.render(index, header, preventHiddenCls);
            i = this.parent.viewport.leftIndex + frozenCol;
            len = this.parent.viewport.rightIndex;
            updateCells();
        }
        return row;
    }

    private initProps(): void {
        this.bottomBorderWidth = null;
    }

    /**
     * Clears the internal properties of RowRenderer module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.parent.off(deInitProperties, this.initProps);
        if (this.element) { this.element.remove(); }
        if (this.bottomBorderWidth) { this.bottomBorderWidth = null; }
        this.parent = null; this.element = null;
    }
}
