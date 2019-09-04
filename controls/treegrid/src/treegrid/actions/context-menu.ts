import { Grid, ContextMenu as cmenu, ContextMenuOpenEventArgs, ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';
import { TreeGrid } from '../base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
/**
 * ContextMenu Module for TreeGrid 
 * @hidden
 */
export class ContextMenu {
    private parent: TreeGrid;
    constructor(parent: TreeGrid) {
        Grid.Inject(TreeGridMenu);
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
      }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
          return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
      }
    private  contextMenuOpen(args: ContextMenuOpenEventArgs): void {
      this.parent.grid.notify('collectTreeGrid', { tree: this.parent });
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

class TreeGridMenu extends cmenu {
  private treegrid: TreeGrid;
  public addEventListener() : void {
    getValue('parent', this).on('collectTreeGrid', this.collectTreeGrid, this);
    super.addEventListener();
  }

  private collectTreeGrid(args: { tree: TreeGrid }) : void {
    this.treegrid = args.tree;
  }
  public contextMenuItemClick(args: ContextMenuClickEventArgs) : void {
    let item: string = getValue('getKeyFromId', this).apply(this, [args.item.id]);
    let isPrevent: boolean = false;
    switch (item) {
      case 'PdfExport':
          this.treegrid.pdfExport();
          isPrevent = true;
          break;
      case 'ExcelExport':
          this.treegrid.excelExport();
          isPrevent = true;
          break;
      case 'CsvExport':
          this.treegrid.csvExport();
          isPrevent = true;
          break;
      case 'Save':
          if (this.treegrid.editSettings.mode === 'Cell' && this.treegrid.grid.editSettings.mode === 'Batch') {
            isPrevent = true;
            this.treegrid.grid.editModule.saveCell();
          }
        }
    if (!isPrevent) {
      super.contextMenuItemClick(args);
    } else {
      args.column = getValue('targetColumn', this);
      args.rowInfo = getValue('targetRowdata', this);
      getValue('parent', this).trigger('contextMenuClick', args);
    }
  }
}