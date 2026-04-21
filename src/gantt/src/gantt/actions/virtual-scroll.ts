import { Gantt } from '../base/gantt';
import { TreeGrid, VirtualScroll as TreeGridVirtualScroll } from '@syncfusion/ej2-treegrid';

/**
 * Gantt Virtual Scroll module will handle Virtualization
 *
 * @hidden
 */
export class VirtualScroll {
    private parent: Gantt;
    constructor(parent?: Gantt) {
        this.parent = parent;
        this.bindTreeGridProperties();
    }
    /**
     * Get module name
     *
     * @returns {void} .
     */
    protected getModuleName(): string {
        return 'virtualScroll';
    }

    /**
     * Bind virtual-scroll related properties from Gantt to TreeGrid
     *
     * @returns {void} .
     */
    private bindTreeGridProperties(): void {
        this.parent.treeGrid.enableVirtualization = this.parent.enableVirtualization;
        TreeGrid.Inject(TreeGridVirtualScroll);
    }

    /**
     * @returns {number} .
     * @private
     */
    public getTopPosition(): number {
        const virtualTable: HTMLElement = this.parent.ganttChartModule.scrollElement.querySelector('.e-virtualtable');
        let transform: string = virtualTable.style.transform;
        transform = this.parent['normalizeTranslate'](transform);
        const translates: string[] = transform.split(',');
        let top: string;
        if (translates.length > 1) {
            top = translates[1].trim().split(')')[0];
        } else {
            const transformString: string = virtualTable.style.transform;
            top = transformString.substring(transformString.lastIndexOf('(') + 1, transformString.lastIndexOf(')'));
        }
        return parseFloat(top);
    }
    /**
     * To destroy the virtual scroll module.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
    // destroy module
    }
}

