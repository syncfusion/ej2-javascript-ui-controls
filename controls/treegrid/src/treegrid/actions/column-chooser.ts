import { TreeGrid } from '../base/treegrid';
import { Grid, ColumnChooser as GridColumnChooser  } from '@syncfusion/ej2-grids';

/**
 * TreeGrid ColumnChooser module
 * @hidden
 */
export class ColumnChooser {
    private parent: TreeGrid;

    /**
     * Constructor for render module
     */
    constructor(parent?: TreeGrid) {
      Grid.Inject(GridColumnChooser);
      this.parent = parent;
    }

    public destroy(): void {
      //this.parent.grid.ColumnChooserModule.destroy();
    }


    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
      return 'ColumnChooser';
    }
}
