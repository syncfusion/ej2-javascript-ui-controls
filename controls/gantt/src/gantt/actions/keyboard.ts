import { Gantt } from '../base/gantt';
import { KeyboardEventArgs, isNullOrUndefined, getValue, removeClass } from '@syncfusion/ej2-base';
import { IKeyPressedEventArgs, IGanttData } from '../base/interface';
import { ColumnModel } from '../models/column';
import { TextBox } from '@syncfusion/ej2-inputs';
import { ISelectedCell, IIndex } from '@syncfusion/ej2-grids';
import { ContextMenu } from '@syncfusion/ej2-navigations/src/context-menu';
interface EJ2Instance extends HTMLElement {
    // eslint-disable-next-line
    ej2_instances: Object[];
}
/**
 * Focus module is used to handle certain action on focus elements in keyboard navigations.
 */

export class FocusModule {
    private parent: Gantt;
    private activeElement: HTMLElement;
    private previousActiveElement: HTMLElement;
    private isFromKeyboardAction: boolean = false;
    constructor(parent: Gantt) {
        this.parent = parent;
        this.activeElement = null;
        this.previousActiveElement = null;
    }

    public getActiveElement(isPreviousActiveElement?: boolean): HTMLElement {
        return isPreviousActiveElement ? this.previousActiveElement : this.activeElement;
    }

    public setActiveElement(element: HTMLElement): void {
        this.previousActiveElement = this.activeElement;
        this.activeElement = element;
    }

    /**
     * To perform key interaction in Gantt
     *
     * @param {KeyboardEventArgs} e .
     * @returns {void} .
     * @private
     */
    public onKeyPress(e: KeyboardEventArgs): void | boolean {
        const ganttObj: Gantt = this.parent;
        const ele: Element = e.target as Element;
        const expandedRecords: IGanttData[] = ganttObj.expandedRecords;
        if (isNullOrUndefined(this.parent.focusModule.getActiveElement()) && (e.action === 'expandAll' || e.action === 'collapseAll')) {
            const focussedElement: HTMLElement = this.parent.element.querySelector('.e-treegrid');
            focussedElement.focus();
        }
        if (!this.parent.isEdit && !isNullOrUndefined(ele) && ele.closest('.e-headercell') && (e.key === 'Enter') && this.parent.sortModule
        && this.parent.allowSorting) {
            e.action = 'enter';
            this.parent.treeGrid.grid.notify('key-pressed', e);
        }
        const targetElement: Element = this.parent.focusModule.getActiveElement();
        if (e.action === 'home' || e.action === 'end' || e.action === 'downArrow' || e.action === 'upArrow' || e.action === 'delete' ||
            e.action === 'rightArrow' || e.action === 'leftArrow' || e.action === 'focusTask' || e.action === 'focusSearch' ||
            e.action === 'expandAll' || e.action === 'collapseAll' || e.action === 'undo' || e.action === 'redo' || e.action === 'selectAll') {
            if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule) &&
                ganttObj.editModule.cellEditModule.isCellEdit === true) {
                return;
            }
        }
        if (ganttObj.isAdaptive) {
            if (e.action === 'addRowDialog' || e.action === 'editRowDialog' || e.action === 'delete'
                || e.action === 'addRow') {
                if (ganttObj.selectionModule && ganttObj.selectionSettings.type === 'Multiple') {
                    ganttObj.selectionModule.hidePopUp();
                    (<HTMLElement>document.getElementsByClassName('e-gridpopup')[0]).style.display = 'none';
                }
            }
        }
        switch (e.action) {
        case 'home':
            if (!ganttObj.selectionModule) {
                return;
            }
            if (ganttObj.selectionSettings.mode === 'Cell') {
                ganttObj.selectionModule.selectCell({ rowIndex: 0, cellIndex: 0 });
            }
            else {
                ganttObj.clearSelection();
                ganttObj.selectionModule.selectRow(0);
            }
            break;
        case 'end':
            if (ganttObj.selectionModule && ganttObj.selectionSettings.mode !== 'Cell') {
                const currentSelectingRecord: IGanttData = expandedRecords[expandedRecords.length - 1];
                if (ganttObj.selectedRowIndex === ganttObj.flatData.indexOf(currentSelectingRecord)) {
                    return;
                }
                if (ganttObj.selectionModule && ganttObj.selectionModule.getCellSelectedRecords().length === 0) {
                    ganttObj.selectionModule.selectRow(ganttObj.flatData.indexOf(currentSelectingRecord), false, true);
                }
            }
            break;
        case 'downArrow':
        case 'upArrow':
        {
            const searchElement: HTMLInputElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar');
            if (searchElement && searchElement.parentElement.classList.contains('e-input-focus')) {
                ganttObj.selectionModule.clearSelection();
            }
            if (!ganttObj.element.classList.contains('e-scroll-disabled')) {
                this.upDownKeyNavigate(e);
                if (!isNullOrUndefined(targetElement) && !isNullOrUndefined(targetElement.closest('.e-chart-row'))) {
                    ganttObj.ganttChartModule.manageFocus(this.getActiveElement(), 'remove', true, e.action);
                }
                if (ganttObj.selectionSettings && ganttObj.selectionSettings.mode === 'Both' && e.target instanceof HTMLElement && e.target.classList.contains('e-cellselectionbackground')) {
                    e.target.classList.remove('e-cellselectionbackground');
                }
            }
            break;
        }
        case 'expandAll':
            ganttObj.ganttChartModule.expandCollapseAll('expand');
            break;
        case 'collapseAll':
            ganttObj.ganttChartModule.expandCollapseAll('collapse');
            break;
        case 'expandRow':
        case 'collapseRow':
            this.expandCollapseKey(e);
            break;
        case 'saveRequest':
            if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule) &&
                ganttObj.editModule.cellEditModule.isCellEdit) {
                const col: ColumnModel = ganttObj.editModule.cellEditModule.editedColumn;
                if (col.field === ganttObj.columnMapping.duration && !isNullOrUndefined(col.edit) &&
                        !isNullOrUndefined(col.edit.read)) {
                    const textBox: TextBox = <TextBox>(<EJ2Instance>e.target).ej2_instances[0];
                    const textValue: string = (e.target as HTMLInputElement).value;
                    // const ganttProp: ITaskData = ganttObj.currentViewData[ganttObj.selectedRowIndex].ganttProperties;
                    let tempValue: string | Date | number;
                    if (col.field === ganttObj.columnMapping.duration) {
                        // tempValue = !isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read) ? (col.edit.read as Function)() :
                        //     // eslint-disable-next-line
                        //     !isNullOrUndefined(col.valueAccessor) ? (col.valueAccessor as Function)(ganttObj.columnMapping.duration, ganttObj.editedRecords, col) :
                        //         ganttObj.dataOperation.getDurationString(ganttProp.duration, ganttProp.durationUnit);
                        if (!isNullOrUndefined(col.edit) && !isNullOrUndefined(col.edit.read)) {
                            tempValue = (col.edit.read as Function)();
                        }
                        if (textValue !== tempValue.toString()) {
                            textBox.value = textValue;
                            textBox.dataBind();
                        }
                    }
                }
                if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                    return;
                }
                ganttObj.treeGrid.grid.saveCell();
                const focussedElement: HTMLElement = <HTMLElement>ganttObj.element.querySelector('.e-treegrid');
                focussedElement.focus();
            }
            // if (!isNullOrUndefined(this.parent.onTaskbarClick) && !isNullOrUndefined(targetElement)
            //     && !isNullOrUndefined(targetElement.closest('.e-chart-row'))) {
            //     const target: EventTarget = e.target;
            //     const taskbarElement: Element = targetElement.querySelector('.e-gantt-parent-taskbar,' +
            //             '.e-gantt-child-taskbar,.e-gantt-milestone');
            //     if (taskbarElement) {
            //         this.parent.ganttChartModule.onTaskbarClick(e, target, taskbarElement);
            //     }
            // }
            if (!isNullOrUndefined(targetElement)
                && !isNullOrUndefined(targetElement.closest('.e-chart-row'))) {
                const target: EventTarget = e.target;
                const taskbarElement: Element = targetElement.querySelector('.e-gantt-parent-taskbar,' +
                        '.e-gantt-child-taskbar,.e-gantt-milestone');
                if (taskbarElement) {
                    this.parent.ganttChartModule.onTaskbarClick(e, target, taskbarElement);
                }
            }
            break;
        case 'escape':
            if (!isNullOrUndefined(ganttObj.editModule) && !isNullOrUndefined(ganttObj.editModule.cellEditModule)) {
                ganttObj.editModule.cellEditModule.isCellEdit = false;
                if (!isNullOrUndefined(ganttObj.toolbarModule)) {
                    ganttObj.toolbarModule.refreshToolbarItems();
                }
            }
            break;
        case 'addRow':
        {
            if (ganttObj.editModule && ganttObj.editModule.cellEditModule && ganttObj.editModule.cellEditModule.isCellEdit) {
                e.stopPropagation();
            }
            else if (isNullOrUndefined(document.getElementById(this.parent.element.id + '_dialog'))) {
                e.preventDefault();
                ganttObj.addRecord(undefined, this.parent.editSettings.newRowPosition, this.parent.selectedRowIndex);
                const focussedElement: HTMLElement = <HTMLElement>ganttObj.element;
                focussedElement.focus();
            }
            break;
        }
        case 'addRowDialog':
            e.preventDefault();
            if (ganttObj.editModule && ganttObj.editModule.dialogModule && ganttObj.editSettings.allowAdding) {
                if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                    return;
                }
                ganttObj.editModule.dialogModule.openAddDialog();
            }
            break;
        case 'editRowDialog':
        {
            e.preventDefault();
            const focussedTreeElement: HTMLElement = <HTMLElement>ganttObj.element.querySelector('.e-treegrid');
            focussedTreeElement.focus();
            if (ganttObj.editModule && ganttObj.editModule.dialogModule && ganttObj.editSettings.allowEditing) {
                if (ganttObj.editModule.dialogModule.dialogObj && getValue('dialogOpen', ganttObj.editModule.dialogModule.dialogObj)) {
                    return;
                }
                ganttObj.editModule.dialogModule.openToolbarEditDialog();
            }
            break;
        }
        case 'delete':
            if (ganttObj.selectionModule && ganttObj.editModule && ganttObj.editModule.dialogModule &&
                (!ganttObj.editModule.dialogModule.dialogObj || (ganttObj.editModule.dialogModule.dialogObj &&
                    !ganttObj.editModule.dialogModule.dialogObj.visible)) && (!ganttObj.editSettings.allowTaskbarEditing
                    || (ganttObj.editSettings.allowTaskbarEditing && !ganttObj.editModule.taskbarEditModule.touchEdit))) {
                if ((ganttObj.selectionSettings.mode !== 'Cell' && ganttObj.selectionModule.selectedRowIndexes.length)
                        || (ganttObj.selectionSettings.mode === 'Cell' && ganttObj.selectionModule.getSelectedRowCellIndexes().length)) {
                    if (!isNullOrUndefined(e.target)) {
                        if (e.target['tagName'] !== 'INPUT' ){
                            ganttObj.editModule.startDeleteAction();
                        }
                    } else {
                        ganttObj.editModule.startDeleteAction();
                    }
                }
            }
            break;
        case 'focusTask':
        {
            e.preventDefault();
            let selectedId: string;
            if (ganttObj.selectionModule) {
                const currentViewData: IGanttData[] = ganttObj.currentViewData;
                if (ganttObj.selectionSettings.mode !== 'Cell' &&
                    !isNullOrUndefined(currentViewData[ganttObj.selectedRowIndex])) {
                    selectedId = ganttObj.currentViewData[ganttObj.selectedRowIndex].ganttProperties.rowUniqueID;
                } else if (ganttObj.selectionSettings.mode === 'Cell' &&
                        ganttObj.selectionModule.getSelectedRowCellIndexes().length > 0) {
                    const selectCellIndex: ISelectedCell[] = ganttObj.selectionModule.getSelectedRowCellIndexes();
                    selectedId = currentViewData[selectCellIndex[selectCellIndex.length - 1].rowIndex].ganttProperties.rowUniqueID;
                }
            }
            if (selectedId) {
                ganttObj.scrollToTask(selectedId.toString());
            }
            break;
        }
        case 'focusSearch':
        {
            if (<HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar')) {
                const searchElement: HTMLInputElement =
                        <HTMLInputElement>ganttObj.element.querySelector('#' + ganttObj.element.id + '_searchbar');
                searchElement.setAttribute('tabIndex', '-1');
                searchElement.focus();
            }
            break;
        }
        case 'tab':
        case 'shiftTab':
        {
            let target: Element = e.target as Element;
            if (this.parent.element.querySelectorAll('.e-focused').length > 0) {
                target = this.parent.element.querySelectorAll('.e-focused')[0];
            }
            const nextElement: Element | string  = this.parent.ganttChartModule['getNextElement'](target, e.action === 'tab' ? true : false, false);
            if (!ganttObj.element.classList.contains('e-scroll-disabled')) {
                if ((target.classList.contains('e-headercell') && !nextElement) || (target.classList.contains('e-rowcell') && !nextElement)) {
                    this.parent.treeGrid.grid.notify('key-pressed', e);
                    return;
                }
                else if (target.classList.contains('e-headercell')){
                    this.parent.treeGrid.grid.notify('key-pressed', e);
                    return;
                }
                ganttObj.ganttChartModule.onTabAction(e);
            }
            break;
        }
        case 'contextMenu':
        {
            const contextMenu: ContextMenu = <ContextMenu>(<EJ2Instance>document.getElementById(this.parent.element.id +
                    '_contextmenu')).ej2_instances[0];
            const containerPosition: { top: number, left: number, width?: number, height?: number } =
                    this.parent.getOffsetRect(e.target as HTMLElement);
            const top: number = containerPosition.top + (containerPosition.height / 2);
            const left: number = containerPosition.left + (containerPosition.width / 2);
            this.setActiveElement(e.target as HTMLElement);
            contextMenu.open(top, left);
            e.preventDefault();
            break;
        }
        case 'undo':
        {
            if (this.parent.undoRedoModule && this.parent.undoRedoModule['getUndoCollection'].length > 0) {
                this.parent.undo();
            }
            break;
        }
        case 'redo':
        {
            if (this.parent.undoRedoModule && this.parent.undoRedoModule['getRedoCollection'].length > 0) {
                this.parent.redo();
            }
            break;
        }
        case 'selectAll':
        {
            e.preventDefault();
            const ganttRow: HTMLElement[] = [].slice.call(this.parent.ganttChartModule.chartBodyContent.querySelector('tbody').children);
            if (ganttRow.length > 0) {
                let firstRowIndex: number = parseInt(ganttRow[0].getAttribute('aria-rowindex'), 10) - 1;
                let lastRowIndex: number = parseInt(ganttRow[ganttRow.length - 1].getAttribute('aria-rowindex'), 10) - 1;
                if (!isNullOrUndefined(firstRowIndex)) {
                    firstRowIndex = Number(firstRowIndex);
                }
                if (!isNullOrUndefined(lastRowIndex)) {
                    lastRowIndex = Number(lastRowIndex);
                }
                if (!isNullOrUndefined(firstRowIndex) && !isNullOrUndefined(lastRowIndex)) {
                    this.parent.selectionModule.selectRowsByRange(firstRowIndex, lastRowIndex);
                }
            }
            break;
        }
        default:
        {
            const eventArgs: IKeyPressedEventArgs = {
                requestType: 'keyPressed',
                action: e.action,
                keyEvent: e
            };
            ganttObj.trigger('actionComplete', eventArgs);
            break;
        }
        }
    }
    private upDownKeyNavigate(e: KeyboardEventArgs): void {
        e.preventDefault();
        const ganttObj: Gantt = this.parent;
        let expandedRecords: IGanttData[];
        const target : Element = e.target as Element;
        if (ganttObj.selectionModule) {
            if (ganttObj.selectedRowIndex !== -1 && (!target || ((!target.classList.contains('e-rowcell') &&
                !target.classList.contains('e-headercell')) || (this.parent.contextMenuModule && this.parent.contextMenuModule.isOpen)))) {
                if ((e.action === 'downArrow' || e.action === 'upArrow') && this.parent.selectionModule && this.parent.allowSelection && this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                    expandedRecords = ganttObj.getExpandedRecords(ganttObj.flatData);
                }
                else {
                    expandedRecords = ganttObj.expandedRecords;
                }
                let selectedItem: IGanttData;
                if ((e.action === 'downArrow' || e.action === 'upArrow') && this.parent.selectionModule && this.parent.allowSelection && this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                    selectedItem = ganttObj.flatData[ganttObj.selectedRowIndex];
                }
                else {
                    selectedItem = ganttObj.currentViewData[ganttObj.selectedRowIndex];
                }
                const focussedElement: HTMLElement = <HTMLElement>ganttObj.element.querySelector('.e-focused');
                if (focussedElement) {
                    removeClass([focussedElement], 'e-focused');
                }
                const selectingRowIndex: number = expandedRecords.indexOf(selectedItem);
                const currentSelectingRecord: IGanttData = e.action === 'downArrow' ? expandedRecords[selectingRowIndex + 1] :
                    expandedRecords[selectingRowIndex - 1];
                const activeElement: Element = this.parent['args'];
                if (document.activeElement !== activeElement) {
                    if ((e.action === 'downArrow' || e.action === 'upArrow') && this.parent.selectionModule && this.parent.allowSelection && this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                        ganttObj.selectionModule.selectRow(ganttObj.flatData.indexOf(currentSelectingRecord), false, true);
                    }
                    else {
                        ganttObj.selectionModule.selectRow(ganttObj.currentViewData.indexOf(currentSelectingRecord), false, true);
                    }
                }
            }  else {
                this.parent.treeGrid.grid.notify('key-pressed', e);
            }
            this.parent.ganttChartModule.focusedRowIndex = this.parent.selectedRowIndex;
        } else {
            this.parent.treeGrid.grid.notify('key-pressed', e);
        }
    }
    private expandCollapseKey(e: KeyboardEventArgs): void {
        const ganttObj: Gantt = this.parent;
        if (ganttObj.selectionModule && ganttObj.selectedRowIndex !== -1) {
            let selectedRowIndex: number;
            if (ganttObj.selectionSettings.mode !== 'Cell') {
                selectedRowIndex = ganttObj.selectedRowIndex;
            } else if (ganttObj.selectionSettings.mode === 'Cell' && ganttObj.selectionModule.getSelectedRowCellIndexes().length > 0) {
                const selectCellIndex: ISelectedCell[] = ganttObj.selectionModule.getSelectedRowCellIndexes();
                selectedRowIndex = selectCellIndex[selectCellIndex.length - 1].rowIndex;
            }
            if (this.parent.virtualScrollModule && this.parent.enableVirtualization) {
                selectedRowIndex = this.parent.currentViewData.findIndex((obj: IGanttData) => obj.ganttProperties.rowUniqueID ===
                    selectedRowIndex.toString()) + 1;
            }
            if (e.action === 'expandRow') {
                this.isFromKeyboardAction = true;
                ganttObj.expandByIndex(selectedRowIndex);
                this.isFromKeyboardAction = false;
            } else {
                this.isFromKeyboardAction = true;
                ganttObj.collapseByIndex(selectedRowIndex);
                this.isFromKeyboardAction = false;
            }
        }
    }
}
