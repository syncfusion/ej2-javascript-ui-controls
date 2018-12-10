import { Grid, ContextMenu as cmenu, ContextMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
/**
 * ContextMenu Module for TreeGrid 
 * @hidden
 */
export class ContextMenu {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(cmenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
      }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
          return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
      }
    private  contextMenuOpen(args: ContextMenuOpenEventArgs): void {
      let addRow: HTMLElement = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow');
      if (addRow) {
        if (this.parent.grid.editSettings.allowAdding === false) {
          addRow.style.display = 'none';
        } else {
          addRow.style.display = 'block';
        }
      }
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'contextMenu';
    }
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
      this.removeEventListener();
    }

    /**
     * Gets the context menu element from the TreeGrid.
     * @return {Element}
     */
    public getContextMenu(): Element {
      return this.parent.grid.contextMenuModule.getContextMenu();
    }
}