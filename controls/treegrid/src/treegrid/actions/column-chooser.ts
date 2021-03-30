import { TreeGrid } from '../base/treegrid';
import { Grid, ColumnChooser as GridColumnChooser  } from '@syncfusion/ej2-grids';

/**
 * TreeGrid ColumnChooser module
 *
 * @hidden
 */
export class ColumnChooser {
    private parent: TreeGrid;

    /**
     * Constructor for render module
     *
     * @param {TreeGrid} parent - Tree Grid instance.
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridColumnChooser);
        this.parent = parent;
    }

    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     *
     * @param  {number} X - Defines the X axis.
     * @param  {number} Y - Defines the Y axis.
     * @returns {void}
     */

    public openColumnChooser(X?: number, Y?: number): void {
        return this.parent.grid.columnChooserModule.openColumnChooser(X, Y);
    }
    /**
     * Destroys the openColumnChooser.
     *
     * @function destroy
     * @returns {void}
     */

    public destroy(): void {
        //this.parent.grid.ColumnChooserModule.destroy();
    }



    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns ColumnChooser module name
     */
    private getModuleName(): string {
        return 'ColumnChooser';
    }
}
