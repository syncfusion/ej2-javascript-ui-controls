import { MouseEventArgs, Draggable } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { remove, closest as closestElement, classList } from '@syncfusion/ej2-base';
import { IGrid, IAction, NotifyArgs, EJ2Intance, IPosition } from '../base/interface';
import { parentsUntil, removeElement, getPosition } from '../base/util';
import * as events from '../base/constant';
import { Column } from '../models/column';
import { RowDropEventArgs } from '../base/interface';

/**
 * 
 * Reorder module is used to handle row reordering.
 * @hidden
 */
export class RowDD implements IAction {

    //Internal variables    
    private selectedRows: number[] = [];
    private isDragStop: boolean;
    private helper: Function = (e: { sender: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        if (document.getElementsByClassName('e-griddragarea').length ||
            (!(e.sender.target as Element).classList.contains('e-selectionbackground') && gObj.selectionSettings.type !== 'Single')) {
            return false;
        }
        let visualElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
            styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
        });
        let table: Element = this.parent.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
        let tbody: Element = this.parent.createElement('tbody');
        if (gObj.selectionSettings.mode === 'Row' && gObj.selectionSettings.type === 'Single') {
            let index: number = parseInt((e.sender.target as Element).parentElement.getAttribute('aria-rowindex'), 10);
            gObj.selectRow(index);
        }
        let selectedRows: Element[] = gObj.getSelectedRows();
        for (let i: number = 0, len: number = selectedRows.length; i < len; i++) {
            let selectedRow: Element = selectedRows[i].cloneNode(true) as Element;
            removeElement(selectedRow, '.e-indentcell');
            removeElement(selectedRow, '.e-detailrowcollapse');
            removeElement(selectedRow, '.e-detailrowexpand');
            tbody.appendChild(selectedRow);
        }
        table.appendChild(tbody);
        visualElement.appendChild(table);
        gObj.element.appendChild(visualElement);
        return visualElement;
    }
    private dragStart: Function = (e: MouseEvent) => {
        let gObj: IGrid = this.parent;
        if (document.getElementsByClassName('e-griddragarea').length) {
            return;
        }
        gObj.trigger(events.rowDragStart, {
            rows: gObj.getSelectedRows(),
            target: e.target, draggableType: 'rows', data: gObj.getSelectedRecords()
        });
        let dropElem: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
            dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
        }
        this.isDragStop = false;
    }
    private drag: Function = (e: { target: HTMLElement, event: MouseEventArgs }) => {
        let gObj: IGrid = this.parent;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        let target: Element = this.getElementFromPosition(cloneElement, e.event);
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        gObj.trigger(events.rowDrag, {
            rows: gObj.getSelectedRows(),
            target: target, draggableType: 'rows', data: gObj.getSelectedRecords()
        });
        gObj.element.classList.add('e-rowdrag');
        if (!parentsUntil(target, 'e-gridcontent') ||
            parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
            classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
        }
    }
    private dragStop: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        let gObj: IGrid = this.parent; if (this.parent.isDestroyed) { return; }
        let target: Element = this.getElementFromPosition(e.helper as HTMLElement, e.event);
        gObj.element.classList.remove('e-rowdrag');
        let dropElem: EJ2Intance = document.getElementById(gObj.rowDropSettings.targetID) as EJ2Intance;
        if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
            dropElem.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
        }
        let args: RowDropEventArgs = {
                    target: target, draggableType: 'rows', cancel: false,
                    rows: gObj.getSelectedRows(), data: gObj.getSelectedRecords()
                };
        gObj.trigger(events.rowDrop, args);

        if (!parentsUntil(target, 'e-gridcontent') || args.cancel) {
            remove(e.helper);
            return;
        }

    }
    //Module declarations
    private parent: IGrid;

    /**
     * Constructor for the Grid print module
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.initializeDrag, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.parent.on(events.rowDragAndDropComplete, this.onActionComplete, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }

    private initializeDrag(): void {
        let gObj: IGrid = this.parent;
        let column: Column;
        let drag: Draggable;
        drag = new Draggable(gObj.getContent() as HTMLElement, {
            dragTarget: '.e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });

    }

    private getElementFromPosition(element: HTMLElement, event: MouseEventArgs): Element {
        let target: Element;
        let position: IPosition = getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    }

    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    public onActionComplete(e: NotifyArgs): void {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }

    private columnDrop(e: { target: Element, droppedElement: HTMLElement }): void {
        let gObj: IGrid = this.parent;
        if (e.droppedElement.getAttribute('action') !== 'grouping') {
            let targetRow: Element = closestElement(e.target, 'tr');
            let srcControl: IGrid;
            let currentIndex: number;
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl = (<EJ2Intance>e.droppedElement.parentElement).ej2_instances[0];
            } else {
                return;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.rowDropSettings.targetID !== gObj.element.id) {
                return;
            }
            let records: Object[] = srcControl.getSelectedRecords();
            let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
            let count: number = 0;
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.allowPaging) {
                targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
            }
            //Todo: drag and drop mapper & BatchChanges                   
            gObj.notify(events.rowsAdded, { toIndex: targetIndex, records: records });
            gObj.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
            let selectedRows: number[] = srcControl.getSelectedRowIndexes();
            let skip: number = srcControl.allowPaging ?
                (srcControl.pageSettings.currentPage * srcControl.pageSettings.pageSize) - srcControl.pageSettings.pageSize : 0;
            this.selectedRows = [];
            for (let i: number = 0, len: number = records.length; i < len; i++) {
                this.selectedRows.push(skip + selectedRows[i]);
            }
            srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows, records: records });
            srcControl.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }
    }

    private enableAfterRender(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            this.initializeDrag();
        }
    }

    /**
     * To destroy the print 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        let gridElement: Element = this.parent.element;
        if (this.parent.isDestroyed || !gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) { return; }
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.off(events.rowDragAndDropComplete, this.onActionComplete);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        //destory ejdrag and drop
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'rowDragAndDrop';
    }

}
