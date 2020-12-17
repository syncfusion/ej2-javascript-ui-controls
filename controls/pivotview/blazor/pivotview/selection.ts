import { SfPivotView } from './sf-pivotview-fn';
import * as cls from '../common/constants';
import { EventHandler } from '@syncfusion/ej2-base';
import { removeClass, addClass } from '@syncfusion/ej2-base';
import { SelectionType } from '@syncfusion/ej2-grids';
import { PivotCellSelectedEventArgs } from '../../src/common/base/interface';
/**
 * Module for Selection action
 */
export class Selection {
    private parent: SfPivotView;
    private isPopupClicked: boolean = false;
    private shiftLockedPos: string[] = [];
    private lastCellClicked: Element;
    private savedSelectedCellsPos: { rowIndex: string, colIndex: string }[] = [];
    private cellSelectionPos: { rowIndex: string, colIndex: string }[] = [];

    constructor(parent: SfPivotView) {
        this.parent = parent;
        this.parent.selectionModule = this;
    }

    public addInternalEvents(): void {
        this.wireEvents();
    }
    private wireEvents(): void {
        this.unWireEvents();
        EventHandler.add(this.parent.element, this.parent.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.parent.element, this.parent.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
    }

    private mouseClickHandler(e: MouseEvent): void {
        if (e.which === 3) {
            this.lastCellClicked = (e.target as Element);
        }
        else if (e.which === 0) {
            this.lastCellClicked = (e.target as Element);
        }
        let target: Element = (e.target as Element);
        if ((target.classList.contains(cls.HEADERCELL) ||
            target.classList.contains(cls.HEADER_CELL_DIV) ||
            target.classList.contains(cls.ROWSHEADER) ||
            target.classList.contains(cls.ROW_CELL_CLASS) ||
            target.classList.contains(cls.STACKED_HEADER_CELL_DIV) ||
            target.classList.contains(cls.HEADER_TEXT) ||
            target.classList.contains(cls.STACKED_HEADER_TEXT)) && this.parent.options.dataType === 'pivot') {
            let targetElement: Element = null;
            if (target.classList.contains(cls.HEADERCELL) || target.classList.contains(cls.ROWSHEADER)
                || target.classList.contains(cls.ROW_CELL_CLASS)) {
                targetElement = target;
            }
            else if (target.classList.contains(cls.STACKED_HEADER_CELL_DIV) || target.classList.contains(cls.CELLVALUE) || target.classList.contains(cls.HEADER_CELL_DIV) ||
                target.classList.contains(cls.ASCENDING_CLASS) || target.classList.contains(cls.DESCENDING_CLASS)) {
                targetElement = target.parentElement;
            }
            else if (target.classList.contains(cls.HEADER_TEXT)) {
                targetElement = target.parentElement.parentElement;
            }
            this.cellClicked(target, e);
        }
        else {
            this.cellClicked(target, e);
            return;
        }
    }
    private cellClicked(target: Element, e: MouseEvent): void {
        let targetElement: Element = null;
        if (target.classList.contains(cls.HEADERCELL) || target.classList.contains(cls.STACKED_HEADER_CELL) || target.classList.contains(cls.ROW_CELL_CLASS)) {
            targetElement = target;
        } else if (target.classList.contains(cls.STACKED_HEADER_CELL_DIV) || target.classList.contains(cls.CELLVALUE) || target.classList.contains(cls.HEADER_CELL_DIV)) {
            targetElement = target.parentElement;
        } else if (target.classList.contains(cls.HEADER_TEXT)) {
            targetElement = target.parentElement.parentElement.parentElement;
        }
        else if (target.classList.contains(cls.STACKED_HEADER_TEXT)) {
            targetElement = target.parentElement.parentElement;
        }
        else if (target.classList.contains(cls.ROW_SELECT)) {
            if (target.classList.contains(cls.SPAN_CLICKED)) {
                this.isPopupClicked = false;
            } else {
                this.isPopupClicked = true;
            }
        }
        if (targetElement) {
            let colIndex: number = Number(targetElement.getAttribute('aria-colindex'));
            let rowIndex: number = Number(targetElement.getAttribute('index'));
            let colSpan: number = Number(targetElement.getAttribute('aria-colspan'));
            if (this.parent.gridSettings.allowSelection) {
                if (this.parent.gridSettings.selectionSettings.mode === 'Both' ? !targetElement.classList.contains(cls.ROW_CELL_CLASS) : this.parent.gridSettings.selectionSettings.mode !== 'Row') {
                    this.clearSelection(targetElement, e, colIndex, rowIndex);
                    this.applyColumnSelection(e, targetElement, colIndex, colIndex + (colSpan > 0 ? colSpan - 1 : 0), rowIndex);
                } else {
                    this.clearSelection(targetElement, e, colIndex, rowIndex);
                }
            }
            this.getSelectedCellsPos();
            let cellPos: string = JSON.stringify(this.savedSelectedCellsPos);
            if (this.parent.gridSettings.selectionSettings.mode === 'Both' ? !targetElement.classList.contains(cls.ROW_CELL_CLASS) : this.parent.gridSettings.selectionSettings.mode !== 'Row') {
                this.parent.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e);
                this.parent.dotNetRef.invokeMethodAsync('SelectHandler', colIndex, rowIndex, cellPos);
                this.savedSelectedCellsPos = [];
            }
            if(this.parent.gridSettings.selectionSettings.mode === 'Cell'? !targetElement.classList.contains(cls.ROW_CELL_CLASS) : this.parent.gridSettings.selectionSettings.mode !== 'Row') {
                this.parent.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e);
                this.parent.dotNetRef.invokeMethodAsync('SelectHandler', colIndex, rowIndex, cellPos);
            }
            if (!this.parent.gridSettings.allowSelection && !(target.classList.contains(cls.EXPAND_ICON) || target.classList.contains(cls.COLLAPSE_ICON) )) {
                this.parent.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e);
            }
        }
    }
    private clearSelection(targetElement: Element, e: MouseEvent, colIndex: number, rowIndex: number) {
        if ((!e.shiftKey && !e.ctrlKey) || this.parent.gridSettings.selectionSettings.type === 'Single') {
            if (this.parent.gridSettings.selectionSettings.mode === 'Cell') {
                if (targetElement.classList.contains(cls.COLUMNSHEADER)) {
                    removeClass(this.parent.element.querySelectorAll(('.' + cls.ROW_CELL_CLASS + '.') + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                } else {
                    removeClass(this.parent.element.querySelectorAll(('.' + cls.COLUMNSHEADER + '.') + cls.CELL_ACTIVE_BGCOLOR), [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                }
            } else if (this.parent.gridSettings.selectionSettings.mode === 'Both') {
                if (targetElement.classList.contains(cls.ROW_CELL_CLASS)) {
                    for (let ele of [].slice.call(this.parent.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR + ', .' + cls.CELL_SELECTED_BGCOLOR))) {
                        removeClass([ele], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR, cls.CELL_SELECTED_BGCOLOR]);
                    }
                } else {
                    removeClass(this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR), cls.CELL_SELECTED_BGCOLOR);
                }
            }
        }
    }

    private applyColumnSelection(e: MouseEvent, target: Element, colStart: number, colEnd: number, rowStart: number): void {
        let colIndex: number = Number(target.getAttribute('aria-colindex'));
        let rowIndex: number = Number(target.getAttribute('index'));
        if (!target.classList.contains(cls.ROWSHEADER) || (this.parent.gridSettings.selectionSettings.mode === 'Cell' ? target.classList.contains(cls.COLUMNSHEADER) : true)) {
            let isCtrl: boolean = e.ctrlKey;
            if (this.parent.gridSettings.selectionSettings.type === 'Multiple' && this.parent.element.querySelector('.' + cls.ROW_SELECT) !== null) {
                if (this.isPopupClicked) {
                    this.parent.element.querySelector('.' + cls.ROW_SELECT).classList.add(cls.SPAN_CLICKED);
                    isCtrl = true;
                } else {
                    this.parent.element.querySelector('.' + cls.ROW_SELECT).classList.remove(cls.SPAN_CLICKED);
                    isCtrl = false;
                }
            }
            let queryStringArray: string[] = [];
            let type: SelectionType = this.parent.gridSettings.selectionSettings.type;
            let isToggle: boolean = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
            let activeColumns: string[] = [];
            let actColPos: { [key: number]: number } = {};
            for (let cCnt: number = colStart; cCnt <= colEnd; cCnt++) {
                activeColumns.push(cCnt.toString());
            }
            if (!isCtrl || type === 'Single') {
                for (let targetElement of [].slice.call(this.parent.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR))) {
                    removeClass([targetElement], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                    if (activeColumns.indexOf(targetElement.getAttribute('aria-colindex')) === -1) {
                        isToggle = false;
                    }
                    let colIndex: number = Number(targetElement.getAttribute('aria-colindex'));
                    actColPos[colIndex] = colIndex;
                }
                activeColumns = Object.keys(actColPos).length > 0 ? Object.keys(actColPos).sort(function (a: any, b: any) {
                    return a - b;
                }) : activeColumns;
            } else {
                isToggle = false;
            }
            if (type === 'Multiple' && e.shiftKey) {
                this.shiftLockedPos = this.shiftLockedPos.length === 0 ? activeColumns : this.shiftLockedPos;

                if (Number(this.shiftLockedPos[0]) <= colStart) {
                    colStart = Number(this.shiftLockedPos[0]);
                } else {
                    colEnd = colEnd < Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) ? Number(this.shiftLockedPos[this.shiftLockedPos.length - 1]) : colEnd;
                }
            } else {
                this.shiftLockedPos = [];
            }
            let rowSelectedList: string[] = [];
            if (e.ctrlKey && this.parent.gridSettings.selectionSettings.mode === 'Both' && type === 'Multiple' && !target.classList.contains(cls.ROWSHEADER)) {
                for (let targetElement of [].slice.call(this.parent.element.querySelectorAll('.' + cls.ROWSHEADER + '.' + cls.CELL_SELECTED_BGCOLOR))) {
                    rowSelectedList.push(targetElement.getAttribute('index'));
                }
            }
            let count: number = colStart;
            while (count <= colEnd) {
                queryStringArray.push('[aria-colindex="' + count + '"]' + (this.parent.gridSettings.selectionSettings.mode === 'Cell' ? '[index="' + rowStart + '"]' : '') + '');
                count++;
            }
            if (!isToggle) {
                rowStart = target.classList.contains(cls.HEADERCELL) ? rowStart : (this.parent.scrollPageInfo.rowStartPos - 1);
                let isTargetSelected: boolean = target.classList.contains(cls.CELL_ACTIVE_BGCOLOR);
                for (let targetElement of [].slice.call(this.parent.element.querySelectorAll(queryStringArray.toString()))) {
                    if (Number(targetElement.getAttribute('index')) >= rowStart) {
                        if (isTargetSelected && isCtrl && rowSelectedList.indexOf(rowIndex.toString()) === -1) {
                            removeClass([targetElement], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        } else {
                            addClass([targetElement], [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
                        }
                    }
                }
            }
        }
    }
    private getSelectedCellsPos(): void {
        for (let targetElement of [].slice.call(this.parent.element.querySelectorAll('.' + cls.SELECTED_BGCOLOR))) {
            this.savedSelectedCellsPos.push({ rowIndex: targetElement.getAttribute('index'), colIndex: targetElement.getAttribute('aria-colindex') });
        }
        for (let targetElement of [].slice.call(this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR))) {
            this.cellSelectionPos.push({ rowIndex: targetElement.getAttribute('index'), colIndex: targetElement.getAttribute('aria-colindex') });
        }
    }

    public destroy(): void {
        this.unWireEvents();
    }
}