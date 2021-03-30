import { TreeGrid, Resize as TreeGridResize } from '@syncfusion/ej2-treegrid';
import { Gantt } from '../base/gantt';
import { ResizeArgs } from '@syncfusion/ej2-grids';
/**
 * Column resize action related code goes here
 */
export class Resize {
    public parent: Gantt;
    constructor(gantt: Gantt) {
        this.parent = gantt;
        TreeGrid.Inject(TreeGridResize);
        this.parent.treeGrid.allowResizing = this.parent.allowResizing;
        this.bindEvents();
    }

    /**
     * Get module name
     *
     * @returns {void} .
     */
    private getModuleName(): string {
        return 'resize';
    }

    /**
     * To bind resize events.
     *
     * @returns {void} .
     * @private
     */
    private bindEvents(): void {
        this.parent.treeGrid.resizeStart = (args: ResizeArgs) => {
            this.parent.trigger('resizeStart', args);
        };
        this.parent.treeGrid.resizing = (args: ResizeArgs) => {
            this.parent.trigger('resizing', args);
        };
        this.parent.treeGrid.resizeStop = (args: ResizeArgs) => {
            this.parent.trigger('resizeStop', args);
        };
    }

    /**
     * To destroy the column-resizer.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        // Destroy Method
    }
}
