import { Spreadsheet } from '../index';
import { refreshCellElement, rowFillHandler, getTextSpace } from '../../workbook/common/event';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getTextWidth } from '../common/index';
import { CellModel } from '../../workbook';
/**
 * Specifies number format.
 */
export class NumberFormat {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookNumberFormat);
    }

    private refreshCellElement(args: RefreshValueArgs): void {
        const cell: HTMLElement = this.parent.getCell(args.rowIndex, args.colIndex);
        if (!isNullOrUndefined(cell)) {
            this.parent.refreshNode(cell as Element, args);
        }
    }

    private getTextSpace(args: { [key: string]: number | string | CellModel }): void {
        args.width = getTextWidth(<string>args.char, (args.cell as CellModel).style, this.parent.cellStyle);
    }

    private rowFillHandler(args: { [key: string]: string | number | boolean | CellModel | HTMLElement  }): void {
        const cellElem: HTMLElement = args.td ? <HTMLElement>args.td : this.parent.getCell(args.rowIdx as number, args.colIdx as number);
        let span2: HTMLElement;
        let span3: HTMLElement;
        if (cellElem) {
            if (args.formatText) {
                cellElem.innerHTML = args.formatText.toString();
            }
            if (args.secText) {
                span3 = this.parent.createElement('span');
                span3.classList.add('e-fill-sec');
                span3.innerHTML = args.secText.toString();
            }
            if (cellElem.children.length) {
                span2 = cellElem.querySelector('.e-fill');
            } else {
                span2 = this.parent.createElement('span');
                span2.style.flexGrow = '1';
                span2.classList.add('e-fill');
                cellElem.appendChild(span2);
                if (span3) {
                    cellElem.appendChild(span3);
                }
                cellElem.style.display = 'flex';
            }
            span2.innerHTML = '';
            const width: number = getTextWidth(args.value.toString(), (args.cell as CellModel).style, this.parent.cellStyle);
            const count: number = Math.round(span2.offsetWidth / width);
            args.formatText = (args.value as string).repeat(count);
            span2.innerHTML = args.formatText;
        }
    }

    /**
     * Adding event listener for number format.
     *
     * @hidden
     * @returns {void} - Adding event listener for number format.
     */
    private addEventListener(): void {
        this.parent.on(refreshCellElement, this.refreshCellElement, this);
        this.parent.on(rowFillHandler, this.rowFillHandler, this);
        this.parent.on(getTextSpace, this.getTextSpace, this);
    }

    /**
     * Removing event listener for number format.
     *
     * @hidden
     * @returns {void} - Removing event listener for number format.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(refreshCellElement, this.refreshCellElement);
            this.parent.off(rowFillHandler, this.rowFillHandler);
            this.parent.off(getTextSpace, this.getTextSpace);
        }
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook import module name.
     *
     * @returns {string} - Get the workbook import module name.
     */
    public getModuleName(): string {
        return 'numberFormat';
    }
}

/**
 * @hidden
 */
export interface RefreshValueArgs {
    rowIndex?: number;
    colIndex?: number;
    result?: string;
    sheetIndex?: number;
    isRightAlign?: boolean;
    type?: string;
    curSymbol?: string;
    value?: string;
    isRowFill?: boolean;
}
