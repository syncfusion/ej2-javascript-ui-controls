import { TreeGrid } from '../base/treegrid';
import { parentsUntil } from '@syncfusion/ej2-grids';
import { Column, ColumnModel } from '../models/column';
import { Grid, Freeze as FreezeColumn  } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { addClass } from '@syncfusion/ej2-base';

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

    private rowExpandCollapse(args: { detailrows: HTMLTableRowElement[], action: string,
        record?: ITreeData, row?: HTMLTableRowElement }): void {
        const movableRows: HTMLTableRowElement[] = <HTMLTableRowElement[]>this.parent.getMovableDataRows();
        const frozenrows: HTMLTableRowElement[] = this.parent.getRows();
        let rows: HTMLTableRowElement[];
        let frozenRightRows: HTMLTableRowElement[];
        let freeze: boolean = (this.parent.getFrozenLeftColumnsCount() > 0 || this.parent.getFrozenRightColumnsCount() > 0 ) ? true : false;
        if (freeze) {
            frozenRightRows = <HTMLTableRowElement[]>this.parent.getFrozenRightRows().filter(
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
            const rData: ITreeData = this.parent.grid.getRowObjectFromUID(rows[i].getAttribute('data-Uid')).data;
            rows[i].style.display = args.action;
            if (freeze) {
                frozenRightRows[i].style.display = args.action;
            }
            const queryselector: string = args.action === 'none' ? '.e-treecolumn-container .e-treegridcollapse'
                : '.e-treecolumn-container .e-treegridexpand';
            if (frozenrows[rows[i].rowIndex].querySelector(queryselector)) {
                const cRow: HTMLTableRowElement[] = [];
                for (let i: number = 0; i < movableRows.length; i++) {
                    if (movableRows[i].querySelector('.e-gridrowindex' + rData.index + 'level' + (rData.level + 1))) {
                        cRow.push(movableRows[i]);
                    }
                }
                if (cRow.length) {
                    this.rowExpandCollapse({ detailrows: cRow, action: args.action });
                }
            }
        }
    }
    private dblClickHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, 'e-rowcell') &&
      this.parent.grid.editSettings.allowEditOnDblClick && this.parent.editSettings.mode !== 'Cell') {
            this.parent.grid.editModule.startEdit(parentsUntil(e.target as Element, 'e-row') as HTMLTableRowElement);
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
