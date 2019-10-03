import { TreeGrid } from '../base/treegrid';
import * as events from '../base/constant';
import { Grid, getObject, Print as GridPrint } from '@syncfusion/ej2-grids';
import { addClass } from '@syncfusion/ej2-base';


/**
 * TreeGrid Print module

 */
export class Print {
    private parent: TreeGrid;

    /**
     * Constructor for Print module
     */
    constructor(parent?: TreeGrid) {
      this.parent = parent;
      Grid.Inject(GridPrint);
      this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
      return 'print';
    }

    /**

     */
    public addEventListener(): void {
      this.parent.grid.on(events.printGridInit, this.printTreeGrid, this);
    }

    public removeEventListener(): void {
       this.parent.grid.off(events.printGridInit, this.printTreeGrid);
    }

    private printTreeGrid(printGrid: Object): void {
      let grid: Grid = getObject('printgrid', printGrid);
      let gridElement: Element = getObject('element', printGrid);
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
     * @return {void}

     */
    public destroy(): void {
      this.removeEventListener();
    }
}