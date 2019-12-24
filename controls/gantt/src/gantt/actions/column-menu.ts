import { Gantt } from '../base/gantt';
import { TreeGrid, ColumnMenu as TreeGridColumnMenu } from '@syncfusion/ej2-treegrid';

/**
 * Configures columnMenu collection in Gantt.
 */
export class ColumnMenu {
  private parent: Gantt;

  constructor(parent?: Gantt) {
    TreeGrid.Inject(TreeGridColumnMenu);
    this.parent = parent;
  }
  /**
   * To get column menu collection.
   */
  public getColumnMenu(): HTMLElement {
    return this.parent.treeGrid.columnMenuModule.getColumnMenu();
  }

  public destroy(): void {
    // column menu destroy module
  }

  /**
   * For internal use only - Get the module name.
   * @private
   */
  private getModuleName(): string {
    return 'columnMenu';
  }
}