import { TreeGrid, Freeze as TreeGridFreeze} from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
/**
 * Column freeze module
 */

export class Freeze{
    public parent: Gantt;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridFreeze);
        this.parent.treeGrid.frozenColumns = this.parent.frozenColumns;
    }

    /**
     * Get module name
     *
     * @returns {string} .
     */
    private getModuleName(): string {
        return 'freeze';
    }

    /**
     * To destroy freeze module.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }
}
