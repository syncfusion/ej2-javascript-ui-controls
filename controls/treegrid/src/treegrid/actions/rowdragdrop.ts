import { TreeGrid } from '../base/treegrid';
import { Grid, RowDD as GridDragDrop, RowDropEventArgs, parentsUntil } from '@syncfusion/ej2-grids';
import { EJ2Intance, RowDragEventArgs, getObject, Scroll } from '@syncfusion/ej2-grids';
import { closest, isNullOrUndefined, classList, setValue, extend } from '@syncfusion/ej2-base';
import { ITreeData } from '../base';
import { DataManager } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import { editAction } from './crud-actions';
import { getParentData, findChildrenRecords, isRemoteData, isOffline } from '../utils';
/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
export class RowDD {
    private parent: TreeGrid;
    /** @hidden */
    private dropPosition: string;
    /** @hidden */
    private draggedRecord: ITreeData;
    /** @hidden */
    private droppedRecord: ITreeData;
    /** @hidden */
    private treeGridData: ITreeData[];
    /** @hidden */
    private treeData: ITreeData[];
    /** @hidden */
    private canDrop: boolean = true;
    /** @hidden */
    private isDraggedWithChild: boolean = false;
    /** @hidden */
    public isMultipleGrid: string;
    /** @hidden */
    public isaddtoBottom: boolean = false;
    /**
     * 
     * Constructor for render module
     */
    constructor(parent?: TreeGrid) {
        Grid.Inject(GridDragDrop);
        this.parent = parent;
        this.addEventListener();
    }

    private getChildrecordsByParentID(id: string): ITreeData[] {
        let index: number;
        let treeGridDataSource: Object;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            treeGridDataSource = (<DataManager>this.parent.grid.dataSource).dataSource.json;
        } else {
            treeGridDataSource = this.parent.grid.dataSource;
        }
        let record: Object[] = (treeGridDataSource as ITreeData[]).filter((e: ITreeData) => {
            return e.uniqueID === id;
        });
        return record;
    }

    /**
     * @hidden
     */
    private addEventListener(): void {
        this.parent.on(events.rowdraging, this.Rowdraging, this);
        this.parent.on(events.rowDropped, this.rowDropped, this);
        this.parent.on(events.rowsAdd, this.rowsAdded, this);
        this.parent.on(events.rowsRemove, this.rowsRemoved, this);
    }

    /**
     * Reorder the rows based on given indexes and position
     */
    public reorderRows(fromIndexes: number[], toIndex: number, position: string): void {
        if (fromIndexes[0] !== toIndex && position === 'above' || 'below' || 'child') {
            if (position === 'above') {
                this.dropPosition = 'topSegment';
            }
            if (position === 'below') {
                this.dropPosition = 'bottomSegment';
            }
            if (position === 'child') {
                this.dropPosition = 'middleSegment';
            }
            let data: ITreeData[] = [];
            for (let i: number = 0; i < fromIndexes.length; i++) {
                data[i] = this.parent.getCurrentViewRecords()[fromIndexes[i]];
            }
            let isByMethod: boolean = true;
            let args: RowDropEventArgs = {
                data: data,
                dropIndex: toIndex
            };
            this.dropRows(args, isByMethod);
            //this.refreshGridDataSource();
            this.parent.refresh();
        } else {
            return;
        }
    }

    private rowsAdded(e: { toIndex: number, records: Object[] }): void {
        let draggedRecord: ITreeData;
        let dragRecords: ITreeData[] = e.records;
        for (let i: number = e.records.length - 1; i > -1; i--) {
            draggedRecord = dragRecords[i];
            if (draggedRecord.parentUniqueID) {
                let record: ITreeData[] = dragRecords.filter((data: ITreeData) => {
                    return data.uniqueID === draggedRecord.parentUniqueID;
                });
                if (record.length) {
                    let index: number = record[0].childRecords.indexOf(draggedRecord);
                    let parentRecord: ITreeData = record[0];
                    if (index !== -1) {
                        parentRecord.childRecords.splice(index, 1);
                        if (!parentRecord.childRecords.length) {
                            parentRecord.hasChildRecords = false;
                            parentRecord.hasFilteredChildRecords = false;
                        }
                        this.isDraggedWithChild = true;
                    }
                }
            }
        }
        if (!(this.parent.dataSource as ITreeData[]).length) {
            let tObj: TreeGrid = this.parent;
            let draggedRecord: ITreeData;
            let dragRecords: ITreeData[] = e.records;
            let dragLength: number = e.records.length;
            for (let i: number = dragLength - 1; i > -1; i--) {
                draggedRecord = dragRecords[i];
                let recordIndex1: number = 0;
                if (!(draggedRecord.taskData as Object).hasOwnProperty(tObj.childMapping)) {
                   draggedRecord.taskData[tObj.childMapping] = [];
                }
                (tObj.dataSource as ITreeData[]).splice(recordIndex1, 0, draggedRecord.taskData);
                tObj.setProperties({ dataSource: tObj.dataSource }, false);
            }
        } else {
            for (let i: number = 0; i < dragRecords.length; i++) {
                setValue ('uniqueIDCollection.' + dragRecords[i].uniqueID, dragRecords[i], this.parent);
            }
            let args: RowDropEventArgs = { data: e.records, dropIndex: e.toIndex };
            if (this.parent.dataSource instanceof DataManager) {
                this.treeGridData = this.parent.dataSource.dataSource.json;
            } else {
                this.treeGridData = this.parent.grid.dataSource as ITreeData[];
            }
            this.dropRows(args);
        }
    }

    private rowsRemoved(e: { indexes: number[], records: Object[] }): void {
        for (let i: number = 0; i < e.records.length; i++) {
            this.draggedRecord = e.records[i];
            if (this.draggedRecord.hasChildRecords || this.draggedRecord.parentItem &&
                (this.parent.grid.dataSource as ITreeData[]).
                    indexOf(this.getChildrecordsByParentID(this.draggedRecord.parentUniqueID)[0]) !== -1 ||
                this.draggedRecord.level === 0) {
                this.deleteDragRow();
            }
        }
    }

    private refreshGridDataSource(): void {
        let draggedRecord: ITreeData = this.draggedRecord;
        let droppedRecord: ITreeData = this.droppedRecord;
        let proxy: TreeGrid = this.parent;
        let tempDataSource: Object; let idx: number;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            tempDataSource = (<DataManager>proxy.dataSource).dataSource.json;
        } else {
            tempDataSource = proxy.dataSource;
        }
        if (tempDataSource && (!isNullOrUndefined(droppedRecord) && !droppedRecord.parentItem)) {
            for (let i: number = 0; i < Object.keys(tempDataSource).length; i++) {
                if (tempDataSource[i][this.parent.childMapping] === droppedRecord.taskData[this.parent.childMapping]) {
                    idx = i;
                }
            }
            if (this.dropPosition === 'topSegment') {
                if (!this.parent.idMapping) {
                    (tempDataSource as ITreeData[]).splice(idx, 0, draggedRecord.taskData);
                }
           } else if (this.dropPosition === 'bottomSegment') {
                if (!this.parent.idMapping) {
                    (tempDataSource as ITreeData[]).splice(idx + 1, 0, draggedRecord.taskData);
                }
           }

        } else if (!this.parent.parentIdMapping && (!isNullOrUndefined(droppedRecord) && droppedRecord.parentItem)) {
            if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                let record: ITreeData = (this.getChildrecordsByParentID(droppedRecord.parentUniqueID) as ITreeData)[0];
                let childRecords: ITreeData[] = record.childRecords;
                for (let i: number = 0; i < childRecords.length; i++) {
                    droppedRecord.parentItem.taskData[this.parent.childMapping][i] = childRecords[i].taskData;
                }
            }
        }

        if (this.parent.parentIdMapping) {
           if (draggedRecord.parentItem) {
              if (this.dropPosition === 'topSegment' || this.dropPosition === 'bottomSegment') {
                draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
                draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.parentIdMapping];
              } else {
                draggedRecord[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
                draggedRecord.taskData[this.parent.parentIdMapping] = droppedRecord[this.parent.idMapping];
              }
           } else {
               draggedRecord.taskData[this.parent.parentIdMapping] = null;
               draggedRecord[this.parent.parentIdMapping] = null;
           }
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
        this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
            element.getAttribute('data-uid');
        let canremove: boolean = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    }

    private updateIcon(row: Element[], index: number, args: RowDragEventArgs): string {
        let rowEle: Element = args.target ? closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        let rowPositionHeight: number = 0;
        this.removeFirstrowBorder(rowEle as HTMLTableRowElement);
        this.removeLastrowBorder(rowEle as HTMLTableRowElement);
        for (let i: number = 0; i < args.rows.length; i++) {
            if (!isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === args.rows[i].getAttribute('data-uid')
              || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position 
        let tObj: TreeGrid = this.parent;
        let rowTop: number = 0;
        let roundOff: number = 0;
        let toolHeight: number = tObj.toolbar && tObj.toolbar.length ?
            document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        let positionOffSet: PositionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        let contentHeight: number = (tObj.getHeaderContent() as HTMLElement).offsetHeight + positionOffSet.top + toolHeight;
        let scrollTop: number = (tObj.getContent() as HTMLElement).firstElementChild.scrollTop;
        if (!isNullOrUndefined(rowEle)) {
            rowPositionHeight = (rowEle as HTMLElement).offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.allowTextWrap) {
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
        let mouseEvent: MouseEvent = getObject('originalEvent.event', args);
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
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                let element: Element;
                let rowElement: HTMLElement[] = [];
                element = closest(args.target, 'tr');
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
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
                this.topOrBottomBorder(args.target);
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
        let tObj: TreeGrid = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            let div: HTMLElement = this.parent.createElement('div', { className: 'e-firstrow-border' });
            let gridheaderEle: Element = this.parent.getHeaderContent();
            let toolbarHeight: number = 0;
            if (tObj.toolbar) {
                toolbarHeight = (tObj.toolbarModule.getToolbar() as HTMLElement).offsetHeight;
            }
            let multiplegrid: boolean = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
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
        if (trElement && !isEmptyRow && this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            let bottomborder: HTMLElement = this.parent.createElement('div', { className: 'e-lastrow-border' });
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
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? Scroll.getScrollBarWidth() : 0;
    }


    private addErrorElem(): void {
        let dragelem: Element = document.getElementsByClassName('e-cloneproperties')[0];
        let errorelem: number = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.rowDropSettings.targetID) {
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
            if (!isNullOrUndefined(spanContent.children) && spanContent.children.length >= 1
            && spanContent.children[0].classList.contains('e-treecolumn-container')) {
                (<HTMLElement>spanContent.children[0]).style.display = 'inline-block';
                (<HTMLElement>spanContent.children[0]).style.verticalAlign = 'middle';
                (<HTMLElement>ele).style.display = 'inline-block';
            }
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
        let multiplegrid: boolean = !isNullOrUndefined(this.parent.rowDropSettings.targetID);
        let rowElement: HTMLElement[] = [];
        element = closest(target, 'tr');
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

    private Rowdraging(args: RowDragEventArgs): void {
        let tObj: TreeGrid = this.parent;
        let cloneElement: HTMLElement = this.parent.element.querySelector('.e-cloneproperties') as HTMLElement;
        cloneElement.style.cursor = '';
        let rowEle: Element = args.target ? closest(args.target, 'tr') : null;
        let rowIdx: number = rowEle ? (rowEle as HTMLTableRowElement).rowIndex : -1;
        let dragRecords: ITreeData[] = [];
        let droppedRecord: ITreeData = tObj.getCurrentViewRecords()[rowIdx];
        this.removeErrorElem();
        this.canDrop = true;
        if (!args.data[0]) {
            dragRecords.push(args.data as ITreeData);
        } else {
            dragRecords = args.data;
        }
        if (rowIdx !== -1) {
            this.ensuredropPosition(dragRecords, droppedRecord);
        } else {
            this.canDrop = false;
            this.addErrorElem();
        }
        if (!tObj.rowDropSettings.targetID && this.canDrop) {
            tObj.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
        }
        if (tObj.rowDropSettings.targetID) {
            let dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID) {
                let srcControl: TreeGrid = (<EJ2Intance>dropElement).ej2_instances[0];
                srcControl.rowDragAndDropModule.updateIcon(args.rows, rowIdx, args);
            }
        }
        if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID)) {
            let dropElement: Element = parentsUntil(args.target, 'e-treegrid');
            if (!dropElement) {
                cloneElement.style.cursor = 'default';
            }
        }
    }

    private rowDropped(args: RowDropEventArgs): void {
        let tObj: TreeGrid = this.parent;
        if (!tObj.rowDropSettings.targetID) {
            if (parentsUntil(args.target, 'e-content')) {
            if (this.parent.element.querySelector('.e-errorelem')) {
                this.dropPosition = 'Invalid';
            }
            setValue('dropPosition', this.dropPosition, args);
            tObj.trigger(events.rowDrop, args);
            if (!args.cancel) {
                this.dropRows(args);
                tObj.refresh();
                if (!isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                    tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
                }
            }
          }
        } else {
            if (args.target && closest(args.target, '#' + tObj.rowDropSettings.targetID) || parentsUntil(args.target, 'e-treegrid') &&
            parentsUntil(args.target, 'e-treegrid').id === tObj.rowDropSettings.targetID ) {
              setValue('dropPosition', this.dropPosition, args);
              tObj.trigger(events.rowDrop, args);
              if (!args.cancel && tObj.rowDropSettings.targetID) {
                  this.dragDropGrid(args);
              }
            }
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        } else if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    }

    private dragDropGrid(args: RowDropEventArgs): void {
        let tObj: TreeGrid = this.parent;
        let currentIndex: number;
        let targetRow: HTMLTableRowElement = closest(args.target, 'tr') as HTMLTableRowElement;
        let targetIndex: number = isNaN(this.getTargetIdx(targetRow)) ? 0 : this.getTargetIdx(targetRow);
        let dropElement: Element = parentsUntil(args.target, 'e-treegrid');
        if (dropElement && dropElement.id === this.parent.rowDropSettings.targetID && !isRemoteData(this.parent)) {
            let srcControl: TreeGrid = (<EJ2Intance>dropElement).ej2_instances[0];
            let records: ITreeData[] = tObj.getSelectedRecords();
            let indexes: number[] = [];
            for (let i: number = 0; i < records.length; i++) {
                indexes[i] = records[i].index;
            }
            tObj.notify(events.rowsRemove, { indexes: indexes, records: records });
            srcControl.notify(events.rowsAdd, { toIndex: targetIndex, records: records });
            tObj.refresh();
            srcControl.refresh();
            if ((<ITreeData[]>srcControl.grid.dataSource).length > 1) {
               srcControl.refresh();
               if (!isNullOrUndefined(srcControl.getHeaderContent().querySelector('.e-firstrow-border'))) {
                   srcControl.getHeaderContent().querySelector('.e-firstrow-border').remove();
               }
               if (!isNullOrUndefined(srcControl.getContent().querySelector('.e-lastrow-border'))) {
                   srcControl.getContent().querySelector('.e-lastrow-border').remove();
                }
            }
        }
    }

    private getTargetIdx(targetRow: Element): number {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    }

    private getParentData(record: ITreeData): void {
        let parentItem: ITreeData = record.parentItem;
        if (this.dropPosition === 'bottomSegment') {
            let selectedRecord: ITreeData = this.parent.getSelectedRecords()[0];
            this.droppedRecord = getParentData(this.parent, selectedRecord.parentItem.uniqueID);
        }
        if (this.dropPosition === 'middleSegment') {
            let level: number = (this.parent.getSelectedRecords()[0] as ITreeData).level;
            if (level === parentItem.level) {
                this.droppedRecord = getParentData(this.parent, parentItem.uniqueID);
            } else {
                this.getParentData(parentItem);
            }
        }
    }

    private dropRows(args: RowDropEventArgs, isByMethod?: boolean): void {
        if (this.dropPosition !== 'Invalid' && !isRemoteData(this.parent)) {
            let tObj: TreeGrid = this.parent;
            let draggedRecord: ITreeData; let droppedRecord: ITreeData;
            if (isNullOrUndefined(args.dropIndex)) {
                let rowIndex: number = tObj.getSelectedRowIndexes()[0] - 1;
                let record: ITreeData = (tObj.getCurrentViewRecords()[rowIndex] as ITreeData);
                this.getParentData(record);
            } else {
                this.droppedRecord = tObj.getCurrentViewRecords()[args.dropIndex];
            }
            let dragRecords: ITreeData[] = [];
            droppedRecord = this.droppedRecord;
            if (!args.data[0]) {
                dragRecords.push(args.data as ITreeData);
            } else {
                dragRecords = args.data;
            }
            let count: number = 0;
            let multiplegrid: string = this.parent.rowDropSettings.targetID;
            this.isMultipleGrid = multiplegrid;
            let addToBottom: boolean = false;
            if (!multiplegrid) {
                this.ensuredropPosition(dragRecords, droppedRecord);
            } else {
                this.isaddtoBottom = addToBottom = multiplegrid && this.isDraggedWithChild;
            }
            let dragLength: number = dragRecords.length;
            for (let i: number = 0; i < dragLength; i++) {
                draggedRecord = dragRecords[i];
                this.draggedRecord = draggedRecord;
                let recordIndex: number = args.dropIndex;
                let isSelfReference: boolean = !isNullOrUndefined(tObj.parentIdMapping);
                if (this.dropPosition !== 'Invalid') {
                    if (!tObj.rowDropSettings.targetID || isByMethod) {
                        this.deleteDragRow();
                    }
                    let recordIndex1: number = this.treeGridData.indexOf(droppedRecord);
                    this.dropAtTop(recordIndex1, isSelfReference, i);
                    if (this.dropPosition === 'bottomSegment') {
                        if (!droppedRecord.hasChildRecords) {
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + 1, 0, this.draggedRecord);
                        } else {
                            count = this.getChildCount(droppedRecord, 0);
                            if (this.parent.parentIdMapping) {
                                this.treeData.splice(recordIndex1 + count + 1, 0, this.draggedRecord.taskData);
                            }
                            this.treeGridData.splice(recordIndex1 + count + 1, 0, this.draggedRecord);
                        }
                        draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
                        draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
                        draggedRecord.level = this.treeGridData[recordIndex1].level;
                        if (draggedRecord.hasChildRecords) {
                            let level: number = 1;
                            this.updateChildRecordLevel(draggedRecord, level);
                            this.updateChildRecord(draggedRecord, recordIndex1 + count + 1);
                        }
                        if (droppedRecord.parentItem) {
                            let rec: ITreeData[] = this.getChildrecordsByParentID(droppedRecord.parentUniqueID);
                            let childRecords: ITreeData[] = rec[0].childRecords;
                            let droppedRecordIndex: number = childRecords.indexOf(droppedRecord) + 1;
                            childRecords.splice(droppedRecordIndex, 0, draggedRecord);
                        }
                    }
                    this.dropMiddle(recordIndex, recordIndex1, args, isByMethod, isSelfReference, i);
                }
                if (isNullOrUndefined(draggedRecord.parentItem)) {
                    let parentRecords: ITreeData[] = tObj.parentData;
                    let newParentIndex: number = parentRecords.indexOf(this.droppedRecord);
                    if (this.dropPosition === 'bottomSegment') {
                        parentRecords.splice(newParentIndex + 1, 0, draggedRecord);
                    } else if (this.dropPosition === 'topSegment') {
                        parentRecords.splice(newParentIndex, 0, draggedRecord);
                    }
                }
                tObj.rowDragAndDropModule.refreshGridDataSource();
            }
        }
    }

    private dropMiddle(recordIndex: number, recordIndex1: number, args: RowDropEventArgs, isSelfReference: boolean,
                       isByMethod?: boolean, i?: number): void {
        let tObj: TreeGrid = this.parent;
        let childRecords: ITreeData[] = findChildrenRecords(this.droppedRecord);
        let childRecordsLength: number = (isNullOrUndefined(childRecords) ||
                childRecords.length === 0) ? recordIndex1 + 1 :
            childRecords.length + recordIndex1 + 1;
        if (this.dropPosition === 'middleSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(childRecordsLength, 0, this.draggedRecord.taskData);
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            } else {
                this.treeGridData.splice(childRecordsLength, 0, this.draggedRecord);
            }
            this.recordLevel();
            if (this.draggedRecord.hasChildRecords) {
                this.updateChildRecord(this.draggedRecord, childRecordsLength, this.droppedRecord.expanded);
            }
        }
    }
    private dropAtTop(recordIndex1: number, isSelfReference: boolean, i: number): void {
        let tObj: TreeGrid = this.parent;
        if (this.dropPosition === 'topSegment') {
            if (tObj.parentIdMapping) {
                this.treeData.splice(recordIndex1, 0, this.draggedRecord.taskData);
            }
            this.draggedRecord.parentItem = this.treeGridData[recordIndex1].parentItem;
            this.draggedRecord.parentUniqueID = this.treeGridData[recordIndex1].parentUniqueID;
            this.draggedRecord.level = this.treeGridData[recordIndex1].level;
            this.treeGridData.splice(recordIndex1, 0, this.draggedRecord);
            if (this.draggedRecord.hasChildRecords) {
                let level: number = 1;
                this.updateChildRecord(this.draggedRecord, recordIndex1);
                this.updateChildRecordLevel(this.draggedRecord, level);
            }
            if (this.droppedRecord.parentItem) {
                let rec: ITreeData[] = this.getChildrecordsByParentID(this.droppedRecord.parentUniqueID);
                let childRecords: ITreeData[] = rec[0].childRecords;
                let droppedRecordIndex: number = childRecords.indexOf(this.droppedRecord);
                childRecords.splice(droppedRecordIndex, 0, this.draggedRecord);
            }
        }
    }
    private recordLevel(): void {
        let tObj: TreeGrid = this.parent;
        let draggedRecord: ITreeData = this.draggedRecord;
        let droppedRecord: ITreeData = this.droppedRecord;
        let childItem: string = tObj.childMapping;
        if (!droppedRecord.hasChildRecords) {
            droppedRecord.hasChildRecords = true;
            droppedRecord.hasFilteredChildRecords = true;
            if (isNullOrUndefined(droppedRecord.childRecords)) {
                droppedRecord.childRecords = [];
                if (!tObj.parentIdMapping && isNullOrUndefined(droppedRecord.taskData[childItem])) {
                    droppedRecord.taskData[childItem] = [];
                }
            }
        }
        if (this.dropPosition === 'middleSegment') {
            let parentItem: ITreeData = extend({}, droppedRecord);
            delete parentItem.childRecords;
            draggedRecord.parentItem = parentItem;
            draggedRecord.parentUniqueID = droppedRecord.uniqueID;
            droppedRecord.childRecords.splice(droppedRecord.childRecords.length, 0, draggedRecord);
            if (!isNullOrUndefined(draggedRecord) && !tObj.parentIdMapping && !isNullOrUndefined(droppedRecord.taskData[childItem])) {
                droppedRecord.taskData[tObj.childMapping].splice(droppedRecord.childRecords.length, 0, draggedRecord.taskData);
            }
            if (!draggedRecord.hasChildRecords) {
                draggedRecord.level = droppedRecord.level + 1;
            } else {
                let level: number = 1;
                draggedRecord.level = droppedRecord.level + 1;
                this.updateChildRecordLevel(draggedRecord, level);
            }
            droppedRecord.expanded = true;
            // if (tObj.isLocalData) {
            //     tObj.parentData.push(droppedRecord);
            // }
        }
    }

    private deleteDragRow(): void {
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            this.treeGridData = (<DataManager>this.parent.grid.dataSource).dataSource.json;
            this.treeData = (<DataManager>this.parent.dataSource).dataSource.json;
        } else {
            this.treeGridData = this.parent.grid.dataSource as ITreeData[];
            this.treeData = this.parent.dataSource as ITreeData[];
        }
        let deletedRow: ITreeData;
        deletedRow = getParentData(this.parent, this.draggedRecord.uniqueID);
        this.removeRecords(deletedRow);
    }

    private updateChildRecord(record: ITreeData, count: number, expanded?: boolean): number {
        let currentRecord: ITreeData;
        let tObj: TreeGrid = this.parent;
        let length: number = 0;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            tObj.flatData.splice(count, 0, currentRecord);
            if (tObj.parentIdMapping) {
                this.treeData.splice(count, 0, currentRecord.taskData);
            }
            if (currentRecord.hasChildRecords) {
                count = this.updateChildRecord(currentRecord, count);
            }
        }
        return count;
    }
    private updateChildRecordLevel(record: ITreeData, level: number): number {
        let length: number = 0;
        let currentRecord: ITreeData;
        level++;
        if (!record.hasChildRecords) {
            return 0;
        }
        length = record.childRecords.length;
        for (let i: number = 0; i < length; i++) {
            currentRecord = record.childRecords[i];
            let parentData: ITreeData;
            if (record.parentItem) {
                parentData = getParentData(this.parent, record.parentItem.uniqueID);
            }
            currentRecord.level = record.parentItem ? parentData.level + level : record.level + 1;
            if (currentRecord.hasChildRecords) {
                level--;
                level = this.updateChildRecordLevel(currentRecord, level);
            }
        }
        return level;
    }

    private removeRecords(record: ITreeData): void {
        let tObj: TreeGrid = this.parent;
        let dataSource: Object;
        if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
            dataSource = (<DataManager>this.parent.dataSource).dataSource.json;
        } else {
            dataSource = this.parent.dataSource;
        }
        let deletedRow: ITreeData = record;
        let recordIndex: number;
        let rowIndex: number;
        let isSelfReference: boolean = !isNullOrUndefined(tObj.parentIdMapping);
        let flatParentData: ITreeData = (this.getChildrecordsByParentID(deletedRow.parentUniqueID) as ITreeData)[0];
        if (deletedRow) {
            if (deletedRow.parentItem) {
                let childRecords: ITreeData[] = flatParentData ? flatParentData.childRecords : [];
                let childIndex: number = 0;
                if (childRecords && childRecords.length > 0) {
                    childIndex = childRecords.indexOf(deletedRow);
                    flatParentData.childRecords.splice(childIndex, 1);
                    if (!this.parent.parentIdMapping) {
                        editAction({ value: deletedRow, action: 'delete' }, this.parent,
                                   isSelfReference, deletedRow.index, deletedRow.index);
                    }
                }
            }
            if (tObj.parentIdMapping) {
                if (deletedRow.hasChildRecords && deletedRow.childRecords.length > 0) {
                    this.removeChildItem(deletedRow);
                }
                let idx: number; let idz: number;
                let treeGridData: ITreeData[] = dataSource as ITreeData[];
                for (let i: number = 0; i < treeGridData.length; i++) {
                    if (treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idx = i;
                    }
                }
                for (let i: number = 0; i < this.treeGridData.length; i++) {
                    if (this.treeGridData[i][this.parent.idMapping] === deletedRow.taskData[this.parent.idMapping]) {
                        idz = i;
                        break;
                    }
                }
                if (idx !== -1 || idz !== -1) {
                    (dataSource as ITreeData[]).splice(idx, 1);
                    this.treeGridData.splice(idz, 1);
                }
            }
            let recordIndex: number = this.treeGridData.indexOf(deletedRow);
            if (!tObj.parentIdMapping) {
                let parentIndex: number = this.parent.parentData.indexOf(deletedRow);
                if (parentIndex !== -1) {
                    tObj.parentData.splice(parentIndex, 1);
                    (dataSource as ITreeData[]).splice(parentIndex, 1);
                }
            }
            if (recordIndex === -1 && !tObj.parentIdMapping) {
                let primaryKeyField: string = tObj.getPrimaryKeyFieldNames()[0];
                for (let j: number = 0; j < this.treeGridData.length; j++) {
                    if (this.treeGridData[j][primaryKeyField] === deletedRow[primaryKeyField]) {
                        recordIndex = j;
                    }
                }
            }
            if (!tObj.parentIdMapping) {
                let deletedRecordCount: number = this.getChildCount(deletedRow, 0);
                this.treeGridData.splice(recordIndex, deletedRecordCount + 1);
            }
            if (deletedRow.parentItem && flatParentData && flatParentData.childRecords && !flatParentData.childRecords.length) {
                flatParentData.expanded = false;
                flatParentData.hasChildRecords = false;
                flatParentData.hasFilteredChildRecords = false;
            }
        }
    }
    private removeChildItem(record: ITreeData): void {
        let tObj: TreeGrid = this.parent;
        let currentRecord: ITreeData;
        let idx: number;
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            let treeGridData: Object;
            if (this.parent.dataSource instanceof DataManager && isOffline(this.parent)) {
                treeGridData = (<DataManager>this.parent.dataSource).dataSource.json;
            } else {
                treeGridData = this.parent.dataSource;
            }
            for (let i: number = 0; i < (< ITreeData[]>treeGridData).length; i++) {
                if (treeGridData[i][this.parent.idMapping] === currentRecord.taskData[this.parent.idMapping]) {
                    idx = i;
                }
            }
            if (idx !== -1) {
                this.treeData.splice(idx, 1);
                this.treeGridData.splice(idx, 1);
            }
            if (currentRecord.hasChildRecords) {
                this.removeChildItem(currentRecord);
            }
        }
    }
    private getChildCount(record: ITreeData, count: number): number {
        let currentRecord: ITreeData;
        if (!record.hasChildRecords) {
            return 0;
        }
        for (let i: number = 0; i < record.childRecords.length; i++) {
            currentRecord = record.childRecords[i];
            count++;
            if (currentRecord.hasChildRecords) {
                count = this.getChildCount(currentRecord, count);
            }
        }
        return count;
    }

    private ensuredropPosition(draggedRecords: ITreeData[], currentRecord: ITreeData): void {
        let tObj: TreeGrid = this.parent;
        let rowDragMoudule: RowDD = this;
        draggedRecords.filter((e: ITreeData) => {
            if (e.hasChildRecords && !isNullOrUndefined(e.childRecords)) {
                let valid: number = e.childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(e.childRecords, currentRecord);
                } else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    }

    public destroy(): void {
        this.removeEventListener();
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
      if (this.parent.isDestroyed) { return; }
      this.parent.off(events.rowdraging, this.Rowdraging);
      this.parent.off(events.rowDropped, this.rowDropped);
      this.parent.off(events.rowsAdd, this.rowsAdded);
      this.parent.off(events.rowsRemove, this.rowsRemoved);
    }
    /**
     * hidden
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName(): string {
        return 'rowDragAndDrop';
    }
}


interface PositionOffSet {
    left: number;
    top: number;
}