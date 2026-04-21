import { Grid, CommandColumn as Command } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
/**
 * Command Column Module for TreeGrid
 *
 * @hidden
 */
export class CommandColumn {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(Command);
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns CommandColumn module name
     */
    protected getModuleName(): string {
        return 'commandColumn';
    }
    /**
     * Destroys the ContextMenu.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        //this.removeEventListener();
    }
}
