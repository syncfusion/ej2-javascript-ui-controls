import { TreeGrid } from '../base/treegrid';
import { parentsUntil } from '@syncfusion/ej2-grids';
import { Column, ColumnModel } from '../models/column';
import { Grid, Freeze as FreezeColumn } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { addClass, isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * TreeGrid Freeze module
 *
 * @hidden
 */
export class Freeze {
    private parent: TreeGrid;

    /**
     * Constructor for render module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(FreezeColumn);
        this.parent = parent;
        this.addEventListener();
    }

    public addEventListener(): void {
        this.parent.on('rowExpandCollapse', this.rowExpandCollapse, this);
        this.parent.on('dataBoundArg', this.dataBoundArg, this);
        this.parent.grid.on('dblclick', this.dblClickHandler, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.grid.off('dblclick', this.dblClickHandler);
    }

    private rowExpandCollapse(args: {
        detailrows: HTMLTableRowElement[], action: string,
        record?: ITreeData, row?: HTMLTableRowElement
    }): void {
        const movableRows: HTMLTableRowElement[] = <HTMLTableRowElement[]>this.parent.getDataRows();
        const frozenrows: HTMLTableRowElement[] = this.parent.getRows();
        let rows: HTMLTableRowElement[];
        let frozenRightRows: HTMLTableRowElement[];
        const freeze: boolean = (this.parent.getFrozenLeftColumnsCount() > 0 ||
            this.parent.getFrozenRightColumnsCount() > 0) ? true : false;
        if (freeze) {
            frozenRightRows = <HTMLTableRowElement[]>this.parent.getRows().filter(
                (e: HTMLTableRowElement) =>
                    e.querySelector(
                        '.e-gridrowindex' + args.record.index + 'level' + (args.record.level + 1)
                    ));
        }
        if (!args.detailrows.length) {
            rows = movableRows.filter(
                (e: HTMLTableRowElement) =>
                    e.querySelector(
                        '.e-gridrowindex' + args.record.index + 'level' + (args.record.level + 1)
                    ));
        } else {
            rows = args.detailrows;
        }
        for (let i: number = 0; i < rows.length; i++) {
            const row: HTMLTableRowElement = rows[parseInt(i.toString(), 10)];
            const rData: ITreeData = this.parent.grid.getRowObjectFromUID(row.getAttribute('data-uid')).data;
            if (!isNullOrUndefined(movableRows) && row.parentElement.firstElementChild.clientHeight > 0) {
                row.style.height = row.parentElement.firstElementChild.clientHeight + 'px';
            }
            this.parent['toggleRowVisibility'](row, args.action);
            if (freeze && frozenRightRows.length) {
                this.parent['toggleRowVisibility'](frozenRightRows[parseInt(i.toString(), 10)], args.action);
            }
            const queryselector: string = args.action === 'e-childrow-hidden' ? '.e-treecolumn-container .e-treegridcollapse'
                : '.e-treecolumn-container .e-treegridexpand';
            if (frozenrows[row.rowIndex].querySelector(queryselector)) {
                const cRow: HTMLTableRowElement[] = [];
                for (let i: number = 0; i < movableRows.length; i++) {
                    if (movableRows[parseInt(i.toString(), 10)].querySelector('.e-gridrowindex' + rData.index + 'level' + (rData.level + 1))) {
                        cRow.push(movableRows[parseInt(i.toString(), 10)]);
                    }
                }
                if (cRow.length) {
                    const data: ITreeData = this.parent.getCurrentViewRecords()[cRow[0].rowIndex];
                    this.rowExpandCollapse({ detailrows: cRow, action: args.action, record: data });
                }
            }
        }
    }
    private dblClickHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, 'e-rowcell') &&
            this.parent.grid.editSettings.allowEditOnDblClick && this.parent.editSettings.mode !== 'Cell' && (!e.target['classList'].contains('e-treegridcollapse') && !e.target['classList'].contains('e-treegridexpand'))) {
            this.parent.startEdit(parentsUntil(e.target as Element, 'e-row') as HTMLTableRowElement);
        }
    }
    private dataBoundArg(): void {
        const checkboxColumn: Column[] = this.parent.getColumns().filter((e: ColumnModel) => {
            return e.showCheckbox;
        });
        if (checkboxColumn.length && this.parent.freezeModule && this.parent.initialRender) {
            addClass([this.parent.element.getElementsByClassName('e-grid')[0]], 'e-checkselection');
        }
    }
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Freeze module name
     */
    private getModuleName(): string {
        return 'freeze';
    }
}
