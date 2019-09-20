import { TreeGrid } from '../base/treegrid';
import { parentsUntil } from '@syncfusion/ej2-grids';
import { Column, ColumnModel } from '../models/column';
import { Grid, Freeze as FreezeColumn  } from '@syncfusion/ej2-grids';
import { ITreeData } from '../base';
import { addClass } from '@syncfusion/ej2-base';

/**
 * TreeGrid Freeze module
 * @hidden
 */
export class Freeze {
    private parent: TreeGrid;

    /**
     * Constructor for render module
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

  private rowExpandCollapse(args: { frozenrows: HTMLTableRowElement, action: string,
    record?: ITreeData, row?: HTMLTableRowElement }): void {
    let movableRows: HTMLTableRowElement[] = <HTMLTableRowElement[]>this.parent.getMovableDataRows();
    let frozenrows: HTMLTableRowElement[] = movableRows.filter(
      (e: HTMLTableRowElement) =>
        e.classList.contains(
          'e-gridrowindex' + args.record.index + 'level' + (args.record.level + 1)
        ));
    for (let i: number = 0; i < frozenrows.length; i++) {
      frozenrows[i].style.display = args.action;
    }
  }
  private dblClickHandler(e: MouseEvent): void {
    if (parentsUntil(e.target as Element, 'e-rowcell') &&
      this.parent.grid.editSettings.allowEditOnDblClick && this.parent.editSettings.mode !== 'Cell') {
      this.parent.grid.editModule.startEdit(parentsUntil(e.target as Element, 'e-row') as HTMLTableRowElement);
    }
  }
  private dataBoundArg(args: Column): void {
    let checkboxColumn: Column[] = this.parent.getColumns().filter((e: ColumnModel) => {
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
     * @private
     */
    private getModuleName(): string {
      return 'freeze';
    }
}