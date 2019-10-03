import { Gantt } from '../base/gantt';
import { TreeGrid, ColumnMenu as TreeGridColumnMenu } from '@syncfusion/ej2-treegrid';

/**
 * Gantt ColumnMenu module
 *
 */
export class ColumnMenu {
  private parent: Gantt;

  /**
   * Constructor for render module
   */
  constructor(parent?: Gantt) {
    TreeGrid.Inject(TreeGridColumnMenu);
    this.parent = parent;
  }

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