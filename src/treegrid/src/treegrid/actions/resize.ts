import { TreeGrid } from '../base/treegrid';
import { Grid, Resize as GridResize } from '@syncfusion/ej2-grids';

/**
 * TreeGrid Resize module
 *
 * @hidden
 */
export class Resize {
    private parent: TreeGrid;

    /**
     * Constructor for Resize module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridResize);
        this.parent = parent;
    }

    /**
     * Resize by field names.
     *
     * @param  {string|string[]} fName - Defines the field name.
     * @returns {void}
     */
    public autoFitColumns(fName?: string | string[]): void {
        this.parent.grid.autoFitColumns(fName);
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Resize module name
     */
    private getModuleName(): string {
        return 'resize';
    }

    /**
     * Destroys the Resize.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.grid.resizeModule.destroy();
    }
}
