import { TreeGrid } from '../base/treegrid';
import { Grid, Resize as GridResize } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Resize module
 * @hidden
 */
export class Resize {
    private parent: TreeGrid;

    /**
     * Constructor for Resize module
     */
    constructor(parent?: TreeGrid) {
      Grid.Inject(GridResize);
      this.parent = parent;
    }

    /** 
     * Resize by field names. 
     * @param  {string|string[]} fName - Defines the field name.  
     * @return {void} 
     */
    public autoFitColumns(fName?: string | string[]): void {
      this.parent.grid.autoFitColumns(fName);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
      return 'resize';
    }

    /**
     * Destroys the Resize.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
      if (this.parent.isDestroyed) {
        return;
      }
      this.parent.grid.resizeModule.destroy();
    }
}