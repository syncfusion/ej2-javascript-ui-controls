import { Gantt } from '../base/gantt';
import { TreeGrid, VirtualScroll as TreeGridVirtualScroll } from '@syncfusion/ej2-treegrid';

/**
 * Gantt Virtual Scroll module will handle Virtualization
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
   */
  protected getModuleName(): string {
    return 'virtualScroll';
  }

  /**
   * Bind virtual-scroll related properties from Gantt to TreeGrid
   */
  private bindTreeGridProperties(): void {
    this.parent.treeGrid.enableVirtualization = this.parent.enableVirtualization;
    TreeGrid.Inject(TreeGridVirtualScroll);
  }

  /**
   * @private
   */
  public getTopPosition(): number {
    let virtualTable: HTMLElement = this.parent.ganttChartModule.scrollElement.querySelector('.e-virtualtable');
    let top: string = virtualTable.style.transform.split(',')[1].trim().split(')')[0];
    return parseFloat(top);
  }
  /**
   * To destroy the virtual scroll module.
   * @return {void}
   * @private
   */
  public destroy(): void {
    // destroy module
  }
}

