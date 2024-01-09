import { Grid, ContextMenu as cmenu, ContextMenuOpenEventArgs } from '@syncfusion/ej2-grids';
import { ITreeData, TreeGrid } from '../base';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { isNullOrUndefined, select } from '@syncfusion/ej2-base';
/**
 * ContextMenu Module for TreeGrid
 *
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
     * @returns {void}
     */
    public addEventListener(): void {
        this.parent.on('contextMenuOpen', this.contextMenuOpen, this);
        this.parent.on('contextMenuClick', this.contextMenuClick, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off('contextMenuOpen', this.contextMenuOpen);
        this.parent.off('contextMenuClick', this.contextMenuClick);
    }
    private  contextMenuOpen(args: ContextMenuOpenEventArgs): void {
        const addRow: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_AddRow', args.element);
        const editRecord: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_Edit', args.element);
        const indent: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_Indent', args.element);
        const outdent: HTMLElement = select('#' + this.parent.element.id + '_gridcontrol_cmenu_Outdent', args.element);
        if (addRow) {
            if (this.parent.grid.editSettings.allowAdding === false || this.parent.grid.isEdit) {
                addRow.style.display = 'none';
            } else {
                addRow.style.display = 'block';
            }
        }
        if ((this.parent.editSettings.mode === 'Cell' || this.parent.editSettings.mode === 'Batch')
        && !(isNullOrUndefined(editRecord)) && !(editRecord.classList.contains('e-menu-hide'))) {
            editRecord.style.display = 'none';
        }
        const tObj: TreeGrid = this.parent;
        const selectedrow: HTMLTableRowElement = tObj.getSelectedRows()[0] as HTMLTableRowElement;
        if ((indent || outdent) && !isNullOrUndefined(selectedrow)) {
            const targetElement: Element = (args.event.target as Element).closest('td');
            if (isNullOrUndefined(targetElement) || (!isNullOrUndefined(targetElement) && (!targetElement.classList.contains('e-rowcell') || targetElement.querySelectorAll('.e-gridform').length !== 0))) {
                indent.style.display = outdent.style.display = 'none';
            }
            else {
                if (selectedrow.rowIndex === 0 || tObj.getSelectedRowIndexes().length > 1) {
                    indent.style.display = outdent.style.display = 'none';
                }
                else if (args['name'] !== 'rowDeselected' || (!isNullOrUndefined(selectedrow) && tObj.grid.isCheckBoxSelection)) {
                    const selectedItem: ITreeData = tObj.getCurrentViewRecords()[selectedrow.rowIndex];
                    if (!isNullOrUndefined(selectedItem)) {
                        if ((selectedItem.level > (tObj.getCurrentViewRecords()[selectedrow.rowIndex - 1] as ITreeData).level)) {
                            indent.style.display = 'none';
                        } else {
                            indent.style.display = 'block';
                        }
                        if ((selectedItem.level === (tObj.getCurrentViewRecords()[selectedrow.rowIndex - 1] as ITreeData).level)) {
                            indent.style.display = 'block';
                        }
                        if ((selectedItem.level === 0)) {
                            outdent.style.display = 'none';
                        }
                        else {
                            outdent.style.display = 'block';
                        }
                    }
                }
            }
        }
        else {
            if (tObj.grid.isEdit && isNullOrUndefined(selectedrow)) {
                indent.style.display = 'none';
                outdent.style.display = 'none';
            }
        }
    }
    private contextMenuClick(args: MenuEventArgs): void {
        if (args.item.id === 'Above' || args.item.id === 'Below' || args.item.id === 'Child') {
            this.parent.notify('savePreviousRowPosition', args);
            this.parent.setProperties({editSettings: {newRowPosition:  args.item.id }}, true);
            this.parent.editModule['isAddedRowByContextMenu'] = true;
            this.parent.addRecord();
        }
        if (args.item.id === this.parent.element.id + '_gridcontrol_cmenu_Indent' || args.item.id === this.parent.element.id + '_gridcontrol_cmenu_Outdent') {
            if (!isNullOrUndefined(this.parent.rowDragAndDropModule)) {
                const indentOutdentAction: string = 'indentOutdentAction';
                const action: string = args.item.id === this.parent.element.id + '_gridcontrol_cmenu_Indent' ? 'indent' : 'outdent';
                this.parent.rowDragAndDropModule[`${indentOutdentAction}`](null, action);
            }
        }
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns ContextMenu module name
     */
    protected getModuleName(): string {
        return 'contextMenu';
    }
    /**
     * Destroys the ContextMenu.
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * Gets the context menu element from the TreeGrid.
     *
     * @returns {Element} Return Context Menu root element.
     */
    public getContextMenu(): Element {
        return this.parent.grid.contextMenuModule.getContextMenu();
    }
}
