import { TreeGrid } from '../base/treegrid';
import * as events from '../base/constant';
import { Grid, getObject, Print as GridPrint } from '@syncfusion/ej2-grids';
import { addClass } from '@syncfusion/ej2-base';


/**
 * TreeGrid Print module
 *
 * @hidden
 */
export class Print {
    private parent: TreeGrid;

    /**
     * Constructor for Print module
     *
     * @param {TreeGrid} parent - Tree Grid instance
     */
    constructor(parent?: TreeGrid) {
        this.parent = parent;
        Grid.Inject(GridPrint);
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns Print module name
     */
    private getModuleName(): string {
        return 'print';
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.grid.on(events.printGridInit, this.printTreeGrid, this);
    }

    public removeEventListener(): void {
        this.parent.grid.off(events.printGridInit, this.printTreeGrid);
    }

    private printTreeGrid(printGrid: Object): void {
        const grid: Grid = getObject('printgrid', printGrid);
        const gridElement: Element = getObject('element', printGrid);
        grid.addEventListener(events.queryCellInfo, this.parent.grid.queryCellInfo);
        grid.addEventListener(events.rowDataBound, this.parent.grid.rowDataBound);
        grid.addEventListener(events.beforeDataBound, this.parent.grid.beforeDataBound);
        addClass([gridElement], 'e-treegrid');
    }

    public print(): void {
        this.parent.grid.print();
    }
    /**
     * To destroy the Print
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
