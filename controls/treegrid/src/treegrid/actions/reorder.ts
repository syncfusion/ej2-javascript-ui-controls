import { TreeGrid } from '../base/treegrid';
import { ColumnModel, Column } from '../models';
import { getObject, Grid, Reorder as GridReorder } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Reorder module
 * @hidden
 */
export class Reorder {
    private parent: TreeGrid;

    /**
     * Constructor for Reorder module
     */
    constructor(parent?: TreeGrid, treeColumn?: Column | string | ColumnModel ) {
      Grid.Inject(GridReorder);
      this.parent = parent;
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
    }

    public removeEventListener(): void {
      if (this.parent.isDestroyed) { return; }
      this.parent.off('getColumnIndex', this.getTreeColumn);
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
      let columnModel: string = 'columnModel';
      let treeColumn: Column | string | ColumnModel = this.parent[columnModel][this.parent.treeColumnIndex];
      let treeIndex: number;
      let updatedCols: Column[] = this.parent.getColumns();
      for (let f: number = 0 ; f < updatedCols.length; f++) {
           let treeColumnfield: string = getObject('field', treeColumn);
           let parentColumnfield: string = getObject('field', updatedCols[f]);
           if (treeColumnfield === parentColumnfield) {
               treeIndex = f;
               break;
           }
        }
      this.parent.setProperties({treeColumnIndex: treeIndex}, true);
    }
}