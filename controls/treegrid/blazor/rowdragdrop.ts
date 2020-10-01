import { isNullOrUndefined, closest as closestElement, classList, remove, MouseEventArgs } from '@syncfusion/ej2-base';
import { DropEventArgs, setValue, createElement, BlazorDragEventArgs } from '@syncfusion/ej2-base';
import { SfTreeGrid } from './sf-treegrid-fn';
import { ITreeData } from './interface';
import { parentsUntil } from './util';

/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
export class RowDD {
    private parent: SfTreeGrid;
    private dropPosition: string;
    private draggedRecords: ITreeData[] = [];
    private startedRow: HTMLTableRowElement;
    private dragTarget: number;
    private selectedRows: HTMLTableRowElement[] = [];
    private canDrop: boolean = true;
    private gridDrag: Function;
    private gridDragStart: Function;
    /**
     *
     * Constructor for render module
     */
    constructor(parent?: SfTreeGrid) {
        this.parent = parent;
        if (this.parent.options.allowRowDragAndDrop) {
            this.gridDrag = this.parent.grid.rowDragAndDropModule.drag;
            this.gridDragStart = this.parent.grid.rowDragAndDropModule.dragStart;
            this.parent.grid.rowDragAndDropModule.draggable.drag = this.rowDraging;
            this.parent.grid.rowDragAndDropModule.draggable.dragStop = this.rowDropped;
            this.parent.grid.rowDragAndDropModule.draggable.dragStart = this.rowDragStart;
            this.parent.grid.rowDragAndDropModule.droppable.drop = this.drop;
        }
    }

    private removeFirstrowBorder(element: HTMLTableRowElement, isRemove?: boolean): void {
        let canremove: boolean = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            ((element as HTMLTableRowElement).rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    }

    private removeLastrowBorder(element: HTMLTableRowElement, isRemove?: boolean): void {
        let isEmptyRow: boolean = element && (element.classList.contains('e-emptyrow') || element.classList.contains('e-columnheader'));
        let islastRowIndex: boolean = element && !isEmptyRow &&
        this.parent.getRows()[this.parent.getRows().length - 1].getAttribute('data-uid') !==
            element.getAttribute('data-uid');
        let canremove: boolean = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    }

    private updateIcon(row: Element[], index: number, args: { target: HTMLElement, event: MouseEventArgs }): string {
        let rowEle: Element = args.target ? closestElement(args.target as Element, 'tr') : null;
        this.dropPosition = undefined;
        let rowPositionHeight: number = 0;
        this.removeFirstrowBorder(rowEle as HTMLTableRowElement);
        this.removeLastrowBorder(rowEle as HTMLTableRowElement);
        for (let i: number = 0; i < this.selectedRows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === this.selectedRows[i].getAttribute('data-uid')
              || !parentsUntil(args.target as Element, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position
        let tObj: SfTreeGrid = this.parent;
        let rowTop: number = 0;
        let roundOff: number = 0;
        let toolbar: HTMLElement = document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems');
        let toolHeight: number = toolbar ? toolbar.offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        let positionOffSet: PositionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        let contentHeight: number = (tObj.getHeaderContent() as HTMLElement).offsetHeight + positionOffSet.top + toolHeight;
        let scrollTop: number = (tObj.getContent() as HTMLElement).firstElementChild.scrollTop;
        if (!isNullOrUndefined(rowEle)) {
            rowPositionHeight = (rowEle as HTMLElement).offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.options.allowTextWrap) {
            rowTop = (row[0] as HTMLElement).offsetHeight;
        } else {
            rowTop = rowPositionHeight + contentHeight + roundOff;
        }
        let rowBottom: number = rowTop + (row[0] as HTMLElement).offsetHeight;
        let difference: number = rowBottom - rowTop;
        let divide: number = difference / 3;
        let topRowSegment: number = rowTop + divide;
        let middleRowSegment: number = topRowSegment + divide;
        let bottomRowSegment: number = middleRowSegment + divide;
        let posx: number = positionOffSet.left;
        let mouseEvent: MouseEvent = args.event;
        let posy: number = mouseEvent.pageY;
        let isTopSegment: boolean = posy <= topRowSegment;
        let isMiddleRowSegment: boolean = (posy > topRowSegment && posy <= middleRowSegment);
        let isBottomRowSegment: boolean = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle as HTMLTableRowElement);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle as HTMLTableRowElement);
                this.topOrBottomBorder(args.target as Element);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                let element: Element;
                let rowElement: HTMLElement[] = [];
                element = closestElement(args.target as Element, 'tr');
                rowElement = !isNullOrUndefined(element) ?
                             [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle as HTMLTableRowElement);
                this.addFirstrowBorder(rowEle as HTMLTableRowElement);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle as HTMLTableRowElement);
                this.removeFirstrowBorder(rowEle as HTMLTableRowElement);
                this.topOrBottomBorder(args.target as Element);
            }
        }
        return this.dropPosition;
    }

    private removeChildBorder(): void {
        let borderElem: HTMLElement[] = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    }

    private addFirstrowBorder(targetRow: HTMLTableRowElement): void {
        let node: Element = this.parent.element;
        let tObj: SfTreeGrid = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            let div: HTMLElement = createElement('div', { className: 'e-firstrow-border' });
            let gridheaderEle: Element = this.parent.getHeaderContent();
            let toolbarHeight: number = 0;
            if (tObj.options.toolbar) {
                toolbarHeight = document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight;
            }
            let multiplegrid: boolean = !isNullOrUndefined(this.parent.options.rowDropTargetID);
            if (multiplegrid) {
                div.style.top = (this.parent.grid.element.getElementsByClassName('e-gridheader')[0] as HTMLElement).offsetHeight
                + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? (node as HTMLElement).offsetWidth + 'px' :
                (node as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    }

    private addLastRowborder(trElement: HTMLTableRowElement): void {
        let isEmptyRow: boolean = trElement && (trElement.classList.contains('e-emptyrow') ||
        trElement.classList.contains('e-columnheader'));
        if (trElement && !isEmptyRow && this.parent.getRows()[this.parent.getRows().length - 1].getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            let bottomborder: HTMLElement = createElement('div', { className: 'e-lastrow-border' });
            let gridcontentEle: Element = this.parent.getContent();
            bottomborder.style.width = (this.parent.element as HTMLElement).offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    }

    private getScrollWidth(): number {
        let scrollElem: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? this.parent.grid.Scroll.getScrollBarWidth() : 0;
    }


    private addErrorElem(): void {
        let dragelem: Element = document.getElementsByClassName('e-cloneproperties')[0];
        let errorelem: number = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.options.rowDropTargetID) {
            let ele: Element = document.createElement('div');
            classList(ele, ['e-errorcontainer'], []);
            classList(ele, ['e-icons', 'e-errorelem'], []);
            let errorVal: Element = dragelem.querySelector('.errorValue');
            let content: string = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            let spanContent: HTMLElement = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    }

    private removeErrorElem(): void {
        let errorelem: Element = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    }

    private topOrBottomBorder(target: Element): void {
        let element: Element;
        let multiplegrid: boolean = !isNullOrUndefined(this.parent.options.rowDropTargetID);
        let rowElement: HTMLElement[] = [];
        element = closestElement(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    }

    private removetopOrBottomBorder(): void {
        let border: HTMLElement[] = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    }

    private addRemoveClasses(cells: Element[], add: boolean, className: string): void {
        for (let i: number = 0, len: number = cells.length; i < len; i++) {
            if (add) {
               cells[i].classList.add(className);
            } else {
               cells[i].classList.remove(className);
            }
        }
    }

    private getOffset(element: Element): PositionOffSet {
        let box: DOMRect | ClientRect = element.getBoundingClientRect();
        let body: HTMLElement = document.body;
        let docElem: HTMLElement = document.documentElement;
        let scrollTop: number = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft: number = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop: number = docElem.clientTop || body.clientTop || 0;
        let clientLeft: number = docElem.clientLeft || body.clientLeft || 0;
        let top: number = box.top + scrollTop - clientTop;
        let left: number = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    }

    private rowDragStart: Function = (args: { target: HTMLElement, event: MouseEventArgs } & BlazorDragEventArgs) => {
        this.gridDragStart.apply(this.parent.grid, [args]);
        this.startedRow = this.parent.grid.rowDragAndDropModule.startedRow;
        let rowIndexes: number[] = this.parent.grid.getSelectedRowIndexes();
        let fromIndex: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
        this.selectedRows = this.parent.grid.getSelectedRows();
        if (this.selectedRows.length === 0 || rowIndexes.length === 0) {
           this.selectedRows.push(this.startedRow);
           rowIndexes.push(fromIndex);
        }
        for (let i: number = 0; i < rowIndexes.length; i++) {
            this.draggedRecords.push(this.parent.options.currentViewData[rowIndexes[i]]);
        }
    }

    private rowDraging : Function = (args: { target: HTMLElement, event: MouseEventArgs }) => {
        this.gridDrag.apply(this.parent.grid, [args]);
        this.dragTarget = this.parent.grid.rowDragAndDropModule.dragTarget;
        let tObj: SfTreeGrid = this.parent;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        cloneElement.style.cursor = '';
        let rowEle: Element = args.target ? closestElement(args.target, 'tr') : null;
        let rowIdx: number = rowEle ? (rowEle as HTMLTableRowElement).rowIndex : -1;
        let droppedRecord: ITreeData = tObj.options.currentViewData[rowIdx];
        this.removeErrorElem();
        this.canDrop = true;
        if (rowIdx !== -1) {
            this.ensuredropPosition(this.draggedRecords, droppedRecord);
        } else {
            this.canDrop = false;
            this.addErrorElem();
        }
        if (!tObj.options.rowDropTargetID && this.canDrop) {
            tObj.rowDragAndDropModule.updateIcon(this.selectedRows, rowIdx, args);
        }
        if (tObj.options.rowDropTargetID) {
            let dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.options.rowDropTargetID) {
                // tslint:disable-next-line
                let srcControl: SfTreeGrid = (dropElement as any).blazor_instance;
                srcControl.rowDragAndDropModule.updateIcon(this.selectedRows, rowIdx, args);
            }
        }
        if (args.target && closestElement(args.target, '#' + tObj.options.rowDropTargetID)) {
            let dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    }

    private rowDropped: Function = (e: { target: HTMLTableRowElement, event: MouseEventArgs, helper: Element }) => {
        let targetEle: Element = this.getElementFromPosition(e.helper as HTMLElement, e.event);
        let target: Element = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
            targetEle : e.target;
        this.parent.grid.element.classList.remove('e-rowdrag');
        // tslint:disable-next-line
        let dropElement: any = document.getElementById(this.parent.options.rowDropTargetID);
        if (this.parent.options.allowRowDragAndDrop && this.parent.options.rowDropTargetID && !parentsUntil(target, 'e-treegrid')) {
            let toIdx: number = 0;
            // tslint:disable-next-line
            let targetClass: string = (target.classList as any).value;
            let targetID: string = target.id;
            let fromIdx: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
            let rowPosition: string = this.dropPosition === 'topSegment' ? 'Above' : this.dropPosition === 'bottomSegment' ? 'Below' :
                                      this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid' ;
            this.parent.dotNetRef.invokeMethodAsync('ReorderRows', fromIdx, toIdx, 'add', false, targetClass, targetID, null, true,
                                                    rowPosition);
        }
        if (this.parent.options.rowDropTargetID && dropElement && dropElement.blazor_instance) {
            dropElement.blazor_instance.getContent().classList.remove('e-allowRowDrop');
        }
        if (!parentsUntil(target, 'e-gridcontent')) {
            this.dragTarget = null;
            remove(e.helper);
            this.removetopOrBottomBorder();
            this.removeChildBorder();
            if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
                this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
            } else if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
                this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
            }
            return;
        }
        let tObj: SfTreeGrid = this.parent;
        if (!tObj.options.rowDropTargetID) {
            if (parentsUntil(e.target, 'e-content')) {
            if (this.parent.element.querySelector('.e-errorelem')) {
                this.dropPosition = 'Invalid';
            }
            setValue('dropPosition', this.dropPosition, e);
            if (!isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
            }
          }
        } else {
            if (e.target && closestElement(e.target, '#' + tObj.options.rowDropTargetID) || parentsUntil(e.target, 'e-treegrid') &&
            parentsUntil(e.target, 'e-treegrid').id === tObj.options.rowDropTargetID ) {
              setValue('dropPosition', this.dropPosition, e);
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        } else if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
        if (this.parent.options.allowRowDragAndDrop && !this.parent.options.rowDropTargetID) {
            this.parent.grid.rowDragAndDropModule.stopTimer();
            this.parent.grid.getContent().classList.remove('e-grid-relative');
            this.parent.grid.rowDragAndDropModule.removeBorder(targetEle);
            let stRow: Element = this.parent.grid.element.querySelector('.e-dragstartrow');
            if (stRow) {
                stRow.classList.remove('e-dragstartrow');
            }
            let toIdx: number = this.dragTarget;
            // tslint:disable-next-line
            let targetClass: string = (target.classList as any).value;
            let targetID: string = target.id;
            let fromIdx: number = parseInt(this.startedRow.getAttribute('aria-rowindex'), 10);
            let rowPosition: string = this.dropPosition === 'topSegment' ? 'Above' : this.dropPosition === 'bottomSegment' ? 'Below' :
                                   this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid' ;
            if (rowPosition !== 'Invalid') {
                setTimeout(
                    () => {
                        this.parent.dotNetRef.invokeMethodAsync('ReorderRows', fromIdx, toIdx, 'delete', true, targetClass, targetID, null,
                                                                false, rowPosition);
                    },
                    10
                );
            }
            this.dragTarget = null;
            this.draggedRecords = [];
        }
    }


    private drop: Function = (e: DropEventArgs) => {
        this.treeGridDrop({ target: e.target as HTMLTableRowElement, droppedElement: e.droppedElement });
        remove(e.droppedElement);
    }

    private treeGridDrop(e: { target: HTMLTableRowElement, droppedElement: HTMLElement }): void {
        let tObj: SfTreeGrid = this.parent;
        let targetRow: HTMLTableRowElement = closestElement(e.target, 'tr') as HTMLTableRowElement;
        let srcControl: SfTreeGrid;
        let currentIndex: number;
        if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
            e.droppedElement.parentElement.parentElement.id === tObj.element.id)
            || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                e.droppedElement.parentElement.parentElement.id !== tObj.element.id)) {
            return;
        }
        if (e.droppedElement.parentElement.parentElement.id !== tObj.element.id) {
            // tslint:disable-next-line
            srcControl = (<any>e.droppedElement.parentElement.parentElement).blazor_instance;
        }
        if (srcControl.element.id !== tObj.element.id && srcControl.options.rowDropTargetID !== tObj.element.id) {
            return;
        }
        let targetIndex: number = currentIndex = this.getTargetIdx(targetRow);
        if (isNaN(targetIndex)) {
            targetIndex = currentIndex = 0;
        }
        if (tObj.options.allowPaging) {
            targetIndex = targetIndex + (tObj.options.currentPage * tObj.options.pageSize) - tObj.options.pageSize;
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        // tslint:disable-next-line
        let targetClass: string = (e.target.classList as any).value;
        let targetID: string = e.target.id;
        let rowPosition: string = this.dropPosition === 'topSegment' ? 'Above' : this.dropPosition === 'bottomSegment' ? 'Below' :
                                   this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid' ;
        tObj.dotNetRef.invokeMethodAsync('ReorderRows', 0, targetIndex, 'add', false, targetClass, targetID, srcControl.dotNetRef, false,
                                         rowPosition);
        srcControl.dotNetRef.invokeMethodAsync('ReorderRows', 0, targetIndex, 'delete', false, targetClass, targetID, null, false,
                                               rowPosition);
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }

    private getElementFromPosition(element: HTMLElement, event: MouseEventArgs): Element {
        let target: Element;
        let position: IPosition = this.getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    }

    private ensuredropPosition(draggedRecords: ITreeData[], currentRecord: ITreeData): void {
        let tObj: SfTreeGrid = this.parent;
        let rowDragMoudule: RowDD = this;
        draggedRecords.filter((e: ITreeData) => {
            let childRecords: ITreeData[] = tObj.options.currentViewData.filter((r: ITreeData) => {
                return r.parentUniqueID === e.uniqueID;
            });
            if (e.hasChildRecords && childRecords.length) {
                let valid: number = childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(childRecords, currentRecord);
                } else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    }

    private getPosition(e: MouseEvent | TouchEvent): IPosition {
        let position: IPosition = {} as IPosition;
        position.x = (isNullOrUndefined((e as MouseEvent).clientX) ? (e as TouchEvent).changedTouches[0].clientX :
            (e as MouseEvent).clientX);
        position.y = (isNullOrUndefined((e as MouseEvent).clientY) ? (e as TouchEvent).changedTouches[0].clientY :
            (e as MouseEvent).clientY);
        return position;
    }
}

interface PositionOffSet {
    left: number;
    top: number;
}

interface IPosition {
    x: number;
    y: number;
}
