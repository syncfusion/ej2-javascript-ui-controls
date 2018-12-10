import { TreeGrid } from '../base/treegrid';
import { ColumnModel, Column } from '../models';
import { getObject, Grid, Reorder as GridReorder } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Reorder module
 * @hidden
 */
export class Reorder {
    private parent: TreeGrid;
    private treeColumn: Column | string | ColumnModel;

    /**
     * Constructor for Reorder module
     */
    constructor(parent?: TreeGrid, treeColumn?: Column | string | ColumnModel ) {
      Grid.Inject(GridReorder);
      this.parent = parent;
      this.treeColumn = treeColumn;
      this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
      return 'reorder';
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
      this.parent.on('getColumnIndex', this.getTreeColumn, this);
      this.parent.on('setColumnIndex', this.setTreeColumnIndex, this);
    }

    public removeEventListener(): void {
      if (this.parent.isDestroyed) { return; }
      this.parent.off('getColumnIndex', this.getTreeColumn);
      this.parent.off('setColumnIndex', this.getTreeColumn);
    }
    /**
     * To destroy the Reorder 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
      this.removeEventListener();
    }
    private getTreeColumn(): void {
        this.treeColumn = this.parent.columns[this.parent.treeColumnIndex];
    }

    private setTreeColumnIndex(): void {
      let treeIndex: number;
      for (let f: number = 0 ; f < this.parent.columns.length; f++) {
         let treeColumnfield: string = getObject('field', this.treeColumn);
         let parentColumnfield: string = getObject('field', this.parent.columns[f]);
         if (treeColumnfield === parentColumnfield) {
             treeIndex = f;
         }
      }
      this.parent.treeColumnIndex = treeIndex;
    }
}