import { Grid, ContextMenu as cmenu, ContextMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * ContextMenu Module for TreeGrid 

 */
export class ContextMenu {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(cmenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**

     */
    public addEventListener(): void {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
      }
    /**

     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
          return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
      }
    private  contextMenuOpen(args: ContextMenuOpenEventArgs): void {
      let addRow: HTMLElement = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow');
      let editRecord: HTMLElement = args.element.querySelector('#' + this.parent.element.id + '_gridcontrol_cmenu_Edit');
      if (addRow) {
        if (this.parent.grid.editSettings.allowAdding === false) {
          addRow.style.display = 'none';
        } else {
          addRow.style.display = 'block';
        }
      }
      if (this.parent.editSettings.mode === 'Cell' && !(isNullOrUndefined(editRecord)) && !(editRecord.classList.contains('e-menu-hide'))) {
        editRecord.style.display = 'none';
      }
    }
    private contextMenuClick(args: MenuEventArgs): void {
      if (args.item.id === 'Above' || args.item.id === 'Below') {
        this.parent.notify('savePreviousRowPosition', args);
        this.parent.setProperties({editSettings: {newRowPosition:  args.item.id }}, true);
        this.parent.addRecord();
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