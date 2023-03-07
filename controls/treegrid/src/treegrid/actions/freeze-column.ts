import { TreeGrid } from '../base/treegrid';
import { ColumnFreezeContentRenderer, ColumnFreezeHeaderRenderer, FreezeRender, parentsUntil, RenderType } from '@syncfusion/ej2-grids';
import { Column, ColumnModel } from '../models/column';
import { Grid, Freeze as FreezeColumn  } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { addClass, getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ColumnVirtualTreeFreezeRenderer, VirtualTreeFreezeRenderer, VirtualTreeFreezeHdrRenderer} from '../renderer/virtual-tree-freeze-render';

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
        this.parent.grid.on('initial-load', this.instantiateRenderer, this);
    }

    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off('rowExpandCollapse', this.rowExpandCollapse);
        this.parent.off('dataBoundArg', this.dataBoundArg);
        this.parent.grid.off('dblclick', this.dblClickHandler);
        this.parent.grid.off('initial-load', this.instantiateRenderer);
    }

    protected instantiateRenderer(): void {
        const renderer: Object = getValue('serviceLocator', this.parent.grid).getService('rendererFactory');
        if (this.parent.getFrozenColumns()) {
            if ( this.parent.enableColumnVirtualization) {
                getValue('addRenderer', renderer)
                    .apply(renderer, [RenderType.Header, new VirtualTreeFreezeHdrRenderer(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            } else {
                getValue('addRenderer', renderer)
                    .apply(renderer, [RenderType.Header, new FreezeRender(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            }
            if (this.parent.enableVirtualization) {
                getValue('addRenderer', renderer)
                    .apply(renderer, [RenderType.Content, new VirtualTreeFreezeRenderer(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            }
        }
        if (this.parent.getFrozenLeftColumnsCount() || this.parent.getFrozenRightColumnsCount()) {
            getValue('addRenderer', renderer)
                .apply(renderer, [RenderType.Header, new ColumnFreezeHeaderRenderer(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            if (this.parent.enableVirtualization) {
                getValue('addRenderer', renderer)
                    .apply(renderer, [RenderType.Content, new ColumnVirtualTreeFreezeRenderer(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            } else {
                getValue('addRenderer', renderer)
                    .apply(renderer, [RenderType.Content, new ColumnFreezeContentRenderer(getValue('grid', this.parent), getValue('serviceLocator', this.parent.grid))]);
            }
        }
    }

    private rowExpandCollapse(args: { detailrows: HTMLTableRowElement[], action: string,
        record?: ITreeData, row?: HTMLTableRowElement }): void {
        const movableRows: HTMLTableRowElement[] = <HTMLTableRowElement[]>this.parent.getMovableDataRows();
        const frozenrows: HTMLTableRowElement[] = this.parent.getRows();
        let rows: HTMLTableRowElement[];
        let frozenRightRows: HTMLTableRowElement[];
        const freeze: boolean = (this.parent.getFrozenLeftColumnsCount() > 0 ||
                                 this.parent.getFrozenRightColumnsCount() > 0 ) ? true : false;
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
            let row :HTMLTableRowElement= rows[parseInt(i.toString(),10)];
            const rData: ITreeData = this.parent.grid.getRowObjectFromUID(row.getAttribute('data-Uid')).data;
            if(!isNullOrUndefined(movableRows) && row.parentElement.firstElementChild.clientHeight>0)
            {
                row.style.height = row.parentElement.firstElementChild.clientHeight + 'px';
            }
            row.style.display = args.action;
            const queryselector: string = args.action === 'none' ? '.e-treecolumn-container .e-treegridcollapse'
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
