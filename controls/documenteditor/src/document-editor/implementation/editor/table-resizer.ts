import { TableWidget, TableCellWidget, Page, BodyWidget, TableRowWidget, Widget, WColumn } from '../index';
import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Selection } from '../index';
import { Point, HelperMethods } from './editor-helper';
import { WRowFormat } from '../index';
import { LayoutViewer } from '../index';
import { TableAlignment } from '../../index';
import { TableHistoryInfo, RowFormatHistoryInfo, CellFormatHistoryInfo } from '../index';
/** 
 * @private
 */
export class TableResizer {
    public owner: DocumentEditor;
    public resizeNode: number = 0;
    public resizerPosition: number = 0;
    public currentResizingTable: TableWidget = undefined;
    public startingPoint: Point;
    /** 
     * @private
     */
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    /** 
     * @private
     */
    constructor(node: DocumentEditor) {
        this.owner = node;
        this.startingPoint = new Point(0, 0);
    }
    /**
     * Gets module name.
     */
    private getModuleName(): string {
        return 'TableResizer';
    }
    /** 
     * @private
     */
    public updateResizingHistory(touchPoint: Point): void {
        if (this.owner.editorHistory) {
            this.owner.editorHistory.updateResizingHistory(touchPoint, this);
        }
        this.viewer.isRowOrCellResizing = false;
        this.resizerPosition = -1;
    }
    public handleResize(point: Point): void {
        this.owner.viewer.isRowOrCellResizing = true;
        this.startingPoint.x = point.x;
        this.startingPoint.y = point.y;
        //Initialize resizing history.
        this.owner.editorHistory.initResizingHistory(point, this);
    }

    //Table Resizing implementation starts
    /**
     * @private
     */
    public isInRowResizerArea(touchPoint: Point): boolean {
        let position: number = this.getRowReSizerPosition(undefined, touchPoint);
        if (position === -1) {
            return false;
        } else {
            this.resizeNode = 1;
            this.resizerPosition = position;
            return true;
        }
    }
    public isInCellResizerArea(touchPoint: Point): boolean {
        let position: number = this.getCellReSizerPosition(touchPoint);
        if (position === -1) {
            return false;
        } else {
            this.resizeNode = 0;
            this.resizerPosition = position;
            return true;
        }

    }

    /**
     * Gets cell resizer position.
     * @param {Point} point    
     * @private
     */
    public getCellReSizerPosition(touchPoint: Point): number {
        let position: number = -1;
        let resizerBoundaryWidth: number = 2;
        let tableWidget: TableWidget = this.getTableWidget(touchPoint);
        let cellWidget: TableCellWidget = this.getTableCellWidget(touchPoint);
        let cellSpacing: number = isNullOrUndefined(tableWidget) ? 0 : tableWidget.tableFormat.cellSpacing;
        if (tableWidget && cellSpacing > 0) {
            this.currentResizingTable = tableWidget;
            // tslint:disable-next-line:max-line-length
            if (this.viewer.isInsideRect(tableWidget.x - HelperMethods.convertPointToPixel(tableWidget.leftBorderWidth) - 0.25, tableWidget.y, HelperMethods.convertPointToPixel(tableWidget.leftBorderWidth) + 0.5, tableWidget.height, touchPoint)) {
                return position = 0;
            }
            let startingPointX: number = tableWidget.x;
            for (let i: number = 0; i < tableWidget.tableHolder.columns.length; i++) {
                let preferredWidth: number = HelperMethods.convertPointToPixel(tableWidget.tableHolder.columns[i].preferredWidth);
                // tslint:disable-next-line:max-line-length
                if ((this.viewer.isInsideRect(startingPointX - 1, tableWidget.y, tableWidget.leftBorderWidth + resizerBoundaryWidth, tableWidget.height, touchPoint))) {
                    return position = i > 0 ? i : 0;
                    // tslint:disable-next-line:max-line-length
                } else if (i > 0 && (this.viewer.isInsideRect(startingPointX + preferredWidth - resizerBoundaryWidth / 2, tableWidget.y, resizerBoundaryWidth, tableWidget.height, touchPoint))) {
                    return position = (i + 1);
                }
                startingPointX = startingPointX + preferredWidth;
            }
        } else {
            if (!isNullOrUndefined(cellWidget)) {
                this.currentResizingTable = cellWidget.ownerTable;
                // tslint:disable-next-line:max-line-length
                if (this.viewer.isInsideRect(cellWidget.x - cellWidget.margin.left - resizerBoundaryWidth / 2, cellWidget.y - cellWidget.margin.top, resizerBoundaryWidth, cellWidget.height, touchPoint)) {
                    return position = cellWidget.columnIndex;
                    // tslint:disable-next-line:max-line-length
                } else if (isNullOrUndefined(cellWidget.nextRenderedWidget)
                    && this.viewer.isInsideRect(cellWidget.x + cellWidget.margin.right + cellWidget.width - resizerBoundaryWidth / 2, cellWidget.y - cellWidget.margin.top, resizerBoundaryWidth, cellWidget.height, touchPoint)) {
                    return position = (cellWidget.columnIndex + cellWidget.cellFormat.columnSpan);
                } else if (cellWidget.childWidgets.length > 0) {
                    return this.getCellReSizerPositionInternal(cellWidget, touchPoint); // Gets the nested table resizer position.
                }
            }
        }
        return position;
    }
    /**
     * Gets cell resizer position.
     * @param {TableCellWidget} cellWidget
     * @param {Point} touchPoint  
     */
    private getCellReSizerPositionInternal(cellWidget: TableCellWidget, touchPoint: Point): number {
        let position: number = -1;
        let childTableWidget: TableWidget = this.getTableWidgetFromWidget(touchPoint, cellWidget);
        let childCellWidget: TableCellWidget = undefined;
        if (!isNullOrUndefined(childTableWidget) && childTableWidget.tableFormat.cellSpacing > 0) {
            this.currentResizingTable = childTableWidget;
            // tslint:disable-next-line:max-line-length
            if (this.viewer.isInsideRect(childTableWidget.x - childTableWidget.leftBorderWidth - 0.25, childTableWidget.y, childTableWidget.leftBorderWidth + 0.5, childTableWidget.height, touchPoint)) {
                return position = 0;
            }
            let startingPointX: number = childTableWidget.x;
            for (let i: number = 0; i < childTableWidget.tableHolder.columns.length; i++) {
                // tslint:disable-next-line:max-line-length
                let preferredWidth: number = HelperMethods.convertPointToPixel(childTableWidget.tableHolder.columns[i].preferredWidth);
                // tslint:disable-next-line:max-line-length
                if ((this.viewer.isInsideRect(startingPointX - 1, childTableWidget.y, childTableWidget.leftBorderWidth + 2, childTableWidget.height, touchPoint))) {
                    return position = i > 0 ? i : 0;
                    // tslint:disable-next-line:max-line-length
                } else if (i > 0 && (this.viewer.isInsideRect(startingPointX + preferredWidth - 1, childTableWidget.y, 2, childTableWidget.height, touchPoint))) {
                    return position = (i + 1);
                }
                startingPointX = startingPointX + preferredWidth;
            }
        } else {
            if (!isNullOrUndefined(childTableWidget)) {
                childCellWidget = childTableWidget.getTableCellWidget(touchPoint);
            }
            if (!isNullOrUndefined(childCellWidget)) {
                this.currentResizingTable = childCellWidget.ownerTable;
                // tslint:disable-next-line:max-line-length
                if (this.viewer.isInsideRect(childCellWidget.x - childCellWidget.margin.left - 1, childCellWidget.y - childCellWidget.margin.top, 2, childCellWidget.height, touchPoint)) {
                    return position = childCellWidget.columnIndex;
                } else if (isNullOrUndefined(childCellWidget.nextRenderedWidget)
                    // tslint:disable-next-line:max-line-length
                    && this.viewer.isInsideRect(childCellWidget.x + childCellWidget.margin.right + childCellWidget.width - 1, childCellWidget.y - childCellWidget.margin.top, 2, childCellWidget.height, touchPoint)) {
                    return position = (childCellWidget.columnIndex + childCellWidget.cellFormat.columnSpan);
                } else if (childCellWidget.childWidgets.length > 0) {
                    return this.getCellReSizerPositionInternal(childCellWidget, touchPoint);
                }
            }
        }
        return position;
    }
    private getRowReSizerPosition(widget: TableCellWidget, touchPoint: Point): number {
        let tableWidget: TableWidget = undefined;
        let cellWidget: TableCellWidget = undefined;
        if (isNullOrUndefined(widget)) {
            tableWidget = this.getTableWidget(touchPoint);
            cellWidget = this.getTableCellWidget(touchPoint);
        } else {
            tableWidget = this.getTableWidgetFromWidget(touchPoint, widget);
        }
        let cellSpacing: number = isNullOrUndefined(tableWidget) ? 0 : tableWidget.tableFormat.cellSpacing;
        if (tableWidget && cellSpacing > 0) {
            this.currentResizingTable = tableWidget;
            // tslint:disable-next-line:max-line-length
            if (this.owner.viewer.isInsideRect(tableWidget.x, tableWidget.y + tableWidget.height - cellSpacing, this.getActualWidth(tableWidget.lastChild as TableRowWidget), (isNullOrUndefined(tableWidget.nextSplitWidget) ? tableWidget.bottomBorderWidth + cellSpacing : 0), touchPoint)) {
                return (tableWidget.lastChild as TableRowWidget).rowIndex;
            }
            for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
                //Need to consider for splitted widgets
                let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
                if (tableWidget.childWidgets.indexOf(rowWidget) > -1
                    // tslint:disable-next-line:max-line-length
                    && (this.owner.viewer.isInsideRect(rowWidget.x, rowWidget.y + rowWidget.height + cellSpacing / 2, this.getActualWidth(rowWidget), cellSpacing / 2, touchPoint))) {
                    return rowWidget.rowIndex;
                }
            }
        } else {
            if (tableWidget && cellWidget) {
                cellWidget = this.getTableCellWidget(touchPoint);
            }
            if (cellWidget) {
                let rowWidget: TableRowWidget = cellWidget.containerWidget as TableRowWidget;
                let height: number = 0;
                if (rowWidget.rowIndex === rowWidget.ownerTable.childWidgets.length - 1) {
                    height = rowWidget.bottomBorderWidth + 2;
                } else {
                    height = (rowWidget.nextRenderedWidget as TableRowWidget).topBorderWidth + 2;
                }
                // tslint:disable-next-line:max-line-length
                if (this.owner.viewer.isInsideRect(rowWidget.x, rowWidget.y + rowWidget.height - height, rowWidget.width, height * 2, touchPoint)) {
                    this.currentResizingTable = rowWidget.ownerTable;
                    return rowWidget.rowIndex;
                } else {
                    if (cellWidget.childWidgets.length > 0) {
                        return this.getRowReSizerPosition(cellWidget, touchPoint);
                    }
                }
            }
        }
        return -1;
    }
    /**
     * To handle Table Row and cell resize
     * @param touchPoint 
     * @private
     */
    public handleResizing(touchPoint: Point): void {
        let dragValue: number = 0;
        if (this.resizeNode === 0) {
            dragValue = touchPoint.x - this.startingPoint.x;
            this.resizeTableCellColumn(dragValue);
        } else {
            dragValue = touchPoint.y - this.startingPoint.y;
            this.resizeTableRow(dragValue);
        }
    }
    public resizeTableRow(dragValue: number): void {
        let table: TableWidget = this.currentResizingTable;
        if (isNullOrUndefined(table) || dragValue === 0) {
            return;
        }
        let selection: Selection = this.owner.selection;
        if (table.isInsideTable) {
            this.owner.isLayoutEnabled = false; //Layouting is disabled to skip the child table layouting. 
        }
        if (this.resizerPosition > -1) {
            let row: TableRowWidget = table.childWidgets[this.resizerPosition] as TableRowWidget;
            this.updateRowHeight(row, dragValue);
            selection.selectPosition(selection.start, selection.end);
        }
        if (table.isInsideTable) {
            let parentTable: TableWidget = this.owner.viewer.layout.getParentTable(table);
            this.owner.isLayoutEnabled = true; //layouting is enabled to layout the parent table of the nested table.
            table = parentTable;
        }
        this.startingPoint.y += HelperMethods.convertPointToPixel(dragValue);
        this.owner.viewer.layout.reLayoutTable(table);
        this.owner.editorModule.reLayout(this.owner.selection);
    }

    /**
     * Gets the table widget from given cursor point
     * @param cursorPoint      
     */
    private getTableWidget(cursorPoint: Point): TableWidget {
        let widget: TableWidget = undefined;
        let currentPage: Page = this.owner.viewer.currentPage;
        if (!isNullOrUndefined(currentPage)) {
            for (let i: number = 0; i < currentPage.bodyWidgets.length; i++) {
                let bodyWidget: BodyWidget = currentPage.bodyWidgets[i];
                widget = this.getTableWidgetFromWidget(cursorPoint, bodyWidget);
                if (!isNullOrUndefined(widget)) {
                    break;
                }
            }
        }
        return widget;
    }
    private getTableWidgetFromWidget(point: Point, widget: Widget): TableWidget {
        for (let j: number = 0; j < widget.childWidgets.length; j++) {
            if (widget.childWidgets[j] instanceof TableWidget) {
                let childWidget: TableWidget = widget.childWidgets[j] as TableWidget;
                if (childWidget.y <= point.y && (childWidget.y + childWidget.height) >= point.y) {
                    return childWidget;
                }
            }
        }
        return undefined;
    }
    /**
     * Return the table cell widget from the given cursor point
     * @param cursorPoint 
     * @private
     */
    public getTableCellWidget(cursorPoint: Point): TableCellWidget {
        let widget: TableCellWidget = undefined;
        let currentPage: Page = this.owner.viewer.currentPage;
        if (!isNullOrUndefined(currentPage)) {
            for (let i: number = 0; i < currentPage.bodyWidgets.length; i++) {
                let bodyWidget: BodyWidget = currentPage.bodyWidgets[i];
                widget = bodyWidget.getTableCellWidget(cursorPoint);
                if (!isNullOrUndefined(widget)) {
                    break;
                }
            }
        }
        return widget;
    }
    public updateRowHeight(row: TableRowWidget, dragValue: number): void {
        let rowFormat: WRowFormat = row.rowFormat;
        if (rowFormat.heightType === 'Auto') {
            rowFormat.heightType = 'AtLeast';
            let row: TableRowWidget = rowFormat.ownerBase as TableRowWidget;
            let currentHeight: number = this.owner.viewer.layout.getRowHeight(row, [row]);
            //the minimum height of the Row in MS word is 2.7 points which is equal to 3.6 pixel.
            if (currentHeight + dragValue >= 2.7 && rowFormat.height !== currentHeight + dragValue) {
                rowFormat.height = currentHeight + dragValue;
            }
        } else {
            //the minimum height of the Row in MS word is 2.7 points which is equal to 3.6 pixel.
            if (rowFormat.height + dragValue >= 2.7 && rowFormat.height !== rowFormat.height + dragValue) {
                rowFormat.height = rowFormat.height + dragValue;
            }
        }
    }
    //Resize Table cell
    public resizeTableCellColumn(dragValue: number): void {
        let table: TableWidget = this.currentResizingTable;
        if (isNullOrUndefined(table) || dragValue === 0 || isNullOrUndefined(table.childWidgets)) {
            return;
        }

        let selectionFlag: boolean = true;
        let selection: Selection = this.owner.selection;
        this.owner.editor.setOffsetValue(selection);
        table = table.combineWidget(this.viewer) as TableWidget;
        this.owner.isLayoutEnabled = false;
        // table.PreserveGrid = true;
        this.setPreferredWidth(table);
        let containerWidth: number = table.getOwnerWidth(true);
        let newIndent: number = table.leftIndent;
        let tableAlignment: TableAlignment = table.tableFormat.tableAlignment;
        if (!selection.isEmpty) {
            selectionFlag = this.resizeColumnWithSelection(selection, table, dragValue);
        }
        if (!selectionFlag) {
            this.owner.isLayoutEnabled = true;
            return;
        }
        if (this.resizerPosition === 0) {
            // Todo: need to handle the resizing of first column and table indent.
            let columnIndex: number = this.resizerPosition;
            let rightColumn: WColumn = table.tableHolder.columns[columnIndex];
            let width: number = rightColumn.preferredWidth;

            if (dragValue > 0) {
                let prevDragValue: number = dragValue;
                do {
                    let newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
                    if (newWidth >= rightColumn.minWidth) {
                        rightColumn.preferredWidth = newWidth;
                        newIndent = table.leftIndent + dragValue;
                        newIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        break;
                    } else {
                        prevDragValue = dragValue;
                        dragValue += newWidth - rightColumn.minWidth;
                    }
                } while (dragValue !== prevDragValue);
            } else {
                let prevDragValue: number = dragValue;
                do {
                    let newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
                    if (newWidth <= 2112) {
                        rightColumn.preferredWidth = newWidth;
                        newIndent = table.leftIndent + dragValue;
                        newIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        break;
                    } else {
                        prevDragValue = dragValue;
                        dragValue -= newWidth - 2112;
                    }
                } while (dragValue !== prevDragValue);
            }
            let dragOffset: number = dragValue;
            // tslint:disable-next-line:max-line-length
            if (tableAlignment !== 'Left' && (table.tableHolder.getTotalWidth() > containerWidth) && table.tableFormat.preferredWidthType === 'Auto') {
                if (table.tableHolder.isFitColumns(containerWidth, table.tableHolder.tableWidth, table.tableFormat.preferredWidthType === 'Auto')) {
                    // tslint:disable-next-line:max-line-length
                    table.tableHolder.fitColumns(containerWidth, table.tableHolder.tableWidth, table.tableFormat.preferredWidthType === 'Auto');
                } else {
                    rightColumn.preferredWidth = width;
                }
                dragOffset = 0;
            }
            if (tableAlignment === 'Center'
                && (table.tableHolder.getTotalWidth() < containerWidth || table.tableFormat.preferredWidthType !== 'Auto')) {
                dragOffset = dragOffset / 2;
            }
            table.tableFormat.leftIndent = tableAlignment === 'Left' ? newIndent : 0;
            table.tableHolder.tableWidth = table.tableHolder.getTotalWidth();
            this.updateCellPreferredWidths(table);
            this.updateGridValue(table, true, dragOffset);
        } else if (table !== null && this.resizerPosition === table.tableHolder.columns.length) {
            // Todo: need to handle the resizing of last column and table width.
            this.resizeColumnAtLastColumnIndex(table, dragValue, containerWidth);
        } else {
            if (this.resizerPosition === -1) {
                this.owner.isLayoutEnabled = true;
                return;
            }
            this.resizeCellAtMiddle(table, dragValue);
        }
        // table.PreserveGrid = false;
        this.owner.isLayoutEnabled = true;
        selection.selectPosition(selection.start, selection.end);
    }
    /**
     * Resize Selected Cells
     */
    private resizeColumnWithSelection(selection: Selection, table: TableWidget, dragValue: number): boolean {
        let newIndent: number = table.leftIndent;
        let cellwidget: Widget = this.getTableCellWidget(this.startingPoint) as Widget;
        if (cellwidget && (selection.selectedWidgets.containsKey(cellwidget) || ((cellwidget as TableCellWidget).previousWidget
            && selection.selectedWidgets.containsKey(((cellwidget as TableCellWidget).previousWidget))))) {
            let selectedCells: TableCellWidget[] = selection.getSelectedCells();
            if (this.resizerPosition === 0) {
                this.resizeColumnAtStart(table, dragValue, selectedCells);
            } else if (table !== null && this.resizerPosition === table.tableHolder.columns.length) {
                let leftColumnCollection: TableCellWidget[] = this.getColumnCells(table, this.resizerPosition, true);
                for (let i: number = 0; i < leftColumnCollection.length; i++) {
                    let cell: TableCellWidget = leftColumnCollection[i];
                    if (selectedCells.indexOf(cell) !== -1) {
                        this.increaseOrDecreaseWidth(cell, dragValue, true);
                    }
                }
                //Updates the grid after value for all the rows.
                this.updateRowsGridAfterWidth(table);
                table.updateWidth(dragValue);
                this.updateGridValue(table, true, dragValue);
            } else {
                if (this.resizerPosition === -1) {
                    return false;
                }
                let columnIndex: number = this.resizerPosition;
                let leftColumnCollection: TableCellWidget[] = this.getColumnCells(table, columnIndex, true);
                let rightColumnCollection: TableCellWidget[] = this.getColumnCells(table, columnIndex, false);
                let isColumnResizing: boolean = this.isColumnSelected(table, columnIndex);
                if (leftColumnCollection.length > 0 && !isColumnResizing) {
                    for (let i: number = 0; i < leftColumnCollection.length; i++) {
                        if (selectedCells.indexOf(leftColumnCollection[i]) === -1) {
                            leftColumnCollection.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (rightColumnCollection.length > 0 && !isColumnResizing) {
                    for (let i: number = 0; i < rightColumnCollection.length; i++) {
                        if (selectedCells.indexOf(rightColumnCollection[i]) === -1) {
                            rightColumnCollection.splice(i, 1);
                            i--;
                        }
                    }
                }
                //Getting the adjacent cell collections for left side selected cells in the right column collection.
                if (leftColumnCollection.length === 0 && rightColumnCollection.length > 0) {
                    for (let i: number = 0; i < rightColumnCollection.length; i++) {
                        let cell: TableCellWidget = rightColumnCollection[i] as TableCellWidget;
                        if (cell.previousWidget) {
                            leftColumnCollection.push(cell.previousWidget as TableCellWidget);
                        }
                    }
                } else if (rightColumnCollection.length === 0 && leftColumnCollection.length > 0) {
                    for (let i: number = 0; i < leftColumnCollection.length; i++) {
                        let cell: TableCellWidget = leftColumnCollection[i] as TableCellWidget;
                        if (cell.nextWidget) {
                            rightColumnCollection.push(cell.nextWidget as TableCellWidget);
                        }
                    }
                }
                this.changeWidthOfCells(table, leftColumnCollection, rightColumnCollection, dragValue, true);
                this.updateGridValue(table, true, dragValue);
            }
            selection.selectPosition(selection.start, selection.end);
        }
        return false;
    }

    /**
     * Resize selected cells at resizer position 0
     */
    private resizeColumnAtStart(table: TableWidget, dragValue: number, selectedCells: TableCellWidget[]): void {
        let newIndent: number = table.leftIndent;
        let rightColumnCollection: TableCellWidget[] = this.getColumnCells(table, this.resizerPosition, false);
        let offset: number = 0;
        let selectedRow: TableRowWidget = selectedCells[0].ownerRow;
        let rowFormat: WRowFormat = selectedRow.rowFormat;
        if (rowFormat.beforeWidth > 0) {
            let newGridBefore: number = rowFormat.beforeWidth + dragValue;
            if (newGridBefore > 0) {
                this.updateGridBefore(selectedRow, dragValue);
            } else {
                let leastGridBefore: number = this.getLeastGridBefore(table, selectedRow);
                if (newGridBefore < leastGridBefore && offset !== newGridBefore) {
                    newIndent = table.leftIndent + newGridBefore;
                    table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                    for (let i: number = 0; i < table.childWidgets.length; i++) {
                        let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                        if (selectedRow !== tableRow) {
                            this.updateGridBefore(tableRow, -newGridBefore);
                        }
                    }
                }
            }
        } else {
            if (dragValue < 0) {
                newIndent = table.leftIndent + dragValue;
                table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                this.updateWidthForCells(table, selectedCells, dragValue);
            } else {
                let leastGridBefore: number = this.getLeastGridBefore(table, selectedRow);
                let currentTableIndent: number = table.tableFormat.leftIndent;
                if (currentTableIndent === 0) {
                    for (let i: number = 0; i < table.childWidgets.length; i++) {
                        let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                        if (selectedCells.indexOf(tableRow.childWidgets[0] as TableCellWidget) !== -1) {
                            this.updateGridBefore(tableRow, dragValue);
                            this.increaseOrDecreaseWidth(tableRow.childWidgets[0] as TableCellWidget, dragValue, false);
                        }
                    }
                } else {
                    let difference: number = leastGridBefore - dragValue;
                    if (difference > 0) {
                        newIndent = table.leftIndent + dragValue;
                        table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        this.updateWidthForCells(table, selectedCells, dragValue);
                    } else {
                        newIndent = table.leftIndent + leastGridBefore;
                        table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        for (let i: number = 0; i < table.childWidgets.length; i++) {
                            let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                            if (selectedCells.indexOf(tableRow.childWidgets[0] as TableCellWidget) !== -1) {
                                this.increaseOrDecreaseWidth(tableRow.childWidgets[0] as TableCellWidget, dragValue, false);
                                this.updateGridBefore(tableRow, dragValue - leastGridBefore);
                            } else {
                                this.updateGridBefore(tableRow, -leastGridBefore);
                            }
                        }
                    }
                }
            }
        }
        this.updateGridValue(table, true, dragValue);
    }
    private updateWidthForCells(table: TableWidget, selectedCells: TableCellWidget[], dragValue: number): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (selectedCells.indexOf(tableRow.childWidgets[0] as TableCellWidget) !== -1) {
                this.increaseOrDecreaseWidth(tableRow.childWidgets[0] as TableCellWidget, dragValue, false);
            } else {
                this.updateGridBefore(tableRow, -dragValue);
            }
        }
    }
    /**
     * Resize selected cells at last column 
     */
    private resizeColumnAtLastColumnIndex(table: TableWidget, dragValue: number, containerWidth: number): void {
        let tableAlignment: TableAlignment = table.tableFormat.tableAlignment;
        let preferredWidth: number = table.tableFormat.preferredWidth;
        let hasTableWidth: number = preferredWidth;
        let columnIndex: number = this.resizerPosition;
        let leftColumn: WColumn = table.tableHolder.columns[columnIndex - 1];
        let prevDragValue: number = 0;
        while (dragValue !== prevDragValue) {
            let newWidth: number = HelperMethods.round(leftColumn.preferredWidth + dragValue, 1);
            if (newWidth >= leftColumn.minWidth) {
                leftColumn.preferredWidth = newWidth;
                prevDragValue = dragValue;
            } else {
                prevDragValue = dragValue;
                dragValue -= newWidth - leftColumn.minWidth;
            }
        }
        this.updateCellPreferredWidths(table);
        if (hasTableWidth || table.tableHolder.getTotalWidth() > containerWidth) {
            table.updateWidth(dragValue);
            table.tableHolder.tableWidth = table.tableHolder.getTotalWidth();
        }
        let dragOffset: number = dragValue;
        if (tableAlignment === 'Right') {
            dragOffset = 0;
        } else if (tableAlignment === 'Center') {
            dragOffset = dragOffset / 2;
        }
        this.updateGridValue(table, true, dragOffset);
    }
    /**
     *  Resize selected cells at middle column
     */
    private resizeCellAtMiddle(table: TableWidget, dragValue: number): void {
        let columnIndex: number = this.resizerPosition;
        let leftColumn: WColumn = table.tableHolder.columns[columnIndex - 1];
        let rightColumn: WColumn = table.tableHolder.columns[columnIndex];
        if (dragValue > 0) {
            let isContinue: boolean = true;
            while (isContinue) {
                let newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
                if (newWidth >= rightColumn.minWidth) {
                    rightColumn.preferredWidth = newWidth;
                    leftColumn.preferredWidth = leftColumn.preferredWidth + dragValue;
                    isContinue = false;
                } else {
                    dragValue += newWidth - rightColumn.minWidth;
                }
            }
        } else {
            let isContinue: boolean = true;
            while (isContinue) {
                let newWidth: number = HelperMethods.round(leftColumn.preferredWidth + dragValue, 1);
                if (newWidth >= leftColumn.minWidth) {
                    leftColumn.preferredWidth = newWidth;
                    rightColumn.preferredWidth = rightColumn.preferredWidth - dragValue;
                    isContinue = false;
                } else {
                    dragValue -= newWidth - leftColumn.minWidth;
                }
            }
        }
        // Update the cell widths based on the columns preferred width
        this.updateCellPreferredWidths(table);
        // table.tableFormat.AllowAutoFit = false;
        table.tableHolder.tableWidth = table.tableHolder.getTotalWidth();
        this.updateGridValue(table, false, dragValue);
    }
    public updateGridValue(table: TableWidget, isUpdate: boolean, dragValue?: number): void {
        if (isUpdate) {
            table.calculateGrid();
            table.isGridUpdated = false;
        }
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.viewer.owner.isLayoutEnabled = true;
        if (table.isInsideTable) {
            let parentTable: TableWidget = this.viewer.layout.getParentTable(table);
            this.viewer.layout.reLayoutTable(parentTable); // Need to optmize this.
        } else {
            this.viewer.layout.reLayoutTable(table);
        }
        this.owner.editor.getOffsetValue(this.viewer.selection);
        this.owner.editorModule.reLayout(this.owner.selection);
        if (dragValue) {
            this.startingPoint.x += HelperMethods.convertPointToPixel(dragValue);
            this.resizerPosition = this.getCellReSizerPosition(this.startingPoint);
        }
    }
    private getColumnCells(table: TableWidget, columnIndex: number, isLeftSideCollection: boolean): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                if (isLeftSideCollection) {
                    if (cell.columnIndex + cell.cellFormat.columnSpan === columnIndex) {
                        cells.push(cell);
                    }
                } else {
                    if (cell.columnIndex === columnIndex) {
                        cells.push(cell);
                    }
                }
            }
        }
        return cells;
    }

    private updateGridBefore(row: TableRowWidget, offset: number): void {
        if (row.rowFormat.beforeWidth + offset !== row.rowFormat.beforeWidth) {
            row.rowFormat.beforeWidth = row.rowFormat.beforeWidth + offset;
            row.rowFormat.gridBeforeWidth = row.rowFormat.beforeWidth;
        }
    }
    private getLeastGridBefore(table: TableWidget, ignoreRow: TableRowWidget): number {
        let gridBefore: number = 0;
        let flag: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row !== ignoreRow) {
                if (flag === 0) {
                    gridBefore = row.rowFormat.beforeWidth;
                    flag++;
                }
                if (row.rowFormat.beforeWidth <= gridBefore) {
                    gridBefore = row.rowFormat.beforeWidth;
                }
            }
        }
        return gridBefore;
    }
    private increaseOrDecreaseWidth(cell: TableCellWidget, dragValue: number, isIncrease: boolean): void {
        let preferredWidth: number = cell.cellFormat.preferredWidth;
        if (cell.cellFormat.preferredWidthType === 'Auto') {
            preferredWidth = cell.cellFormat.cellWidth;
            cell.cellFormat.preferredWidthType = 'Point';
        }
        let minimumWidth: number = cell.ownerColumn.minWidth;
        if (cell.cellFormat.preferredWidthType === 'Percent') {
            minimumWidth = cell.convertPointToPercent(minimumWidth);
        }
        // Margins properties usedd for internal purpose.
        if (isIncrease) {
            cell.cellFormat.preferredWidth = preferredWidth + dragValue > minimumWidth ? preferredWidth + dragValue : minimumWidth;
        } else {
            cell.cellFormat.preferredWidth = preferredWidth - dragValue > minimumWidth ? preferredWidth - dragValue : minimumWidth;
        }

    }
    // tslint:disable-next-line:max-line-length
    private changeWidthOfCells(table: TableWidget, leftColumnCollection: TableCellWidget[], rightColumnCollection: TableCellWidget[], dragValue: number, isSelection: boolean): void {
        if (leftColumnCollection.length > 0) {
            let flag: boolean = false;
            for (let i: number = 0; i < leftColumnCollection.length; i++) {
                let cell: TableCellWidget = leftColumnCollection[i];
                this.increaseOrDecreaseWidth(cell, dragValue, true);
                if (cell.cellIndex === cell.ownerRow.childWidgets.length - 1) {
                    flag = true;
                }
            }
            if (flag) {
                this.updateRowsGridAfterWidth(table);
            }
        }
        if (rightColumnCollection.length > 0) {
            let diff: number = 0;
            for (let i: number = 0; i < rightColumnCollection.length; i++) {
                let cell: TableCellWidget = rightColumnCollection[i];
                if (cell.cellIndex === 0) {
                    let newGridBefore: number = cell.ownerRow.rowFormat.beforeWidth + dragValue;
                    if (newGridBefore >= 0) {
                        this.updateGridBefore(cell.ownerRow, dragValue);
                    } else {
                        if (diff !== newGridBefore) {
                            diff = newGridBefore;
                        }
                        cell.ownerRow.rowFormat.gridBeforeWidth = 0;
                        cell.ownerRow.rowFormat.gridBeforeWidthType = 'Auto';
                    }
                }
                this.increaseOrDecreaseWidth(cell, dragValue, false);
            }
            if (diff !== 0) {
                let newIndent: number = table.leftIndent + diff;
                table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                for (let j: number = 0; j < table.childWidgets.length; j++) {
                    let row: TableRowWidget = table.childWidgets[j] as TableRowWidget;
                    if (rightColumnCollection.indexOf(row.childWidgets[0] as TableCellWidget) === -1) {
                        this.updateGridBefore(row, diff > 0 ? diff : -diff);
                    }
                }
            }
        }
    }
    private updateRowsGridAfterWidth(table: TableWidget): void {
        let maxRowWidth: number = this.getMaxRowWidth(table, true);
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let currentRowWidth: number = this.getRowWidth(row, true);
            if (maxRowWidth >= currentRowWidth && row.rowFormat.afterWidth !== maxRowWidth - currentRowWidth) {
                let value: number = maxRowWidth - currentRowWidth;
                row.rowFormat.gridAfterWidth = value;
                row.rowFormat.afterWidth = value;
            }
        }
    }

    private getRowWidth(row: TableRowWidget, toUpdateGridAfter: boolean): number {
        let rowWidth: number = 0;
        if (toUpdateGridAfter) {
            rowWidth = rowWidth + row.rowFormat.beforeWidth;
        }
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            rowWidth += cell.cellFormat.cellWidth;
        }
        return rowWidth;
    }
    private getMaxRowWidth(table: TableWidget, toUpdateGridAfter: boolean): number {
        let width: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowWidth: number = 0;
            if (toUpdateGridAfter) {
                rowWidth = rowWidth + row.rowFormat.beforeWidth;
            }
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                rowWidth += cell.cellFormat.cellWidth;
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    private isColumnSelected(table: TableWidget, columnIndex: number): boolean {
        let selection: Selection = this.owner.selection;
        let selectedCells: TableCellWidget[] = selection.getSelectedCells();
        let leftColumnCells: TableCellWidget[] = this.getColumnCells(table, columnIndex, true);
        let rightColumnCells: TableCellWidget[] = this.getColumnCells(table, columnIndex, false);
        let isColumnSelected: boolean = false;
        for (let i: number = 0; i < leftColumnCells.length; i++) {
            let columnCell: TableCellWidget = leftColumnCells[i];
            isColumnSelected = selectedCells.indexOf(columnCell) !== -1 ? true : false;
        }
        if (!isColumnSelected) {
            for (let i: number = 0; i < rightColumnCells.length; i++) {
                let columnCell: TableCellWidget = rightColumnCells[i];
                isColumnSelected = selectedCells.indexOf(columnCell) !== -1 ? true : false;
            }
        }
        return isColumnSelected;
    }

    public applyProperties(table: TableWidget, tableHistoryInfo: TableHistoryInfo): void {
        if (isNullOrUndefined(tableHistoryInfo)) {
            return;
        }
        table = table;
        // PreserveGrid = true;
        if (tableHistoryInfo.tableHolder) {
            table.tableHolder = tableHistoryInfo.tableHolder.clone();
        }
        if (tableHistoryInfo.tableFormat !== null) {
            table.tableFormat.leftIndent = tableHistoryInfo.tableFormat.leftIndent;
            table.tableFormat.preferredWidth = tableHistoryInfo.tableFormat.preferredWidth;
            table.tableFormat.preferredWidthType = tableHistoryInfo.tableFormat.preferredWidthType;
        }
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowFormat: RowFormatHistoryInfo = tableHistoryInfo.rows[i];
            row.rowFormat.gridBefore = rowFormat.gridBefore;
            row.rowFormat.gridBeforeWidth = rowFormat.gridBeforeWidth;
            row.rowFormat.gridBeforeWidthType = rowFormat.gridBeforeWidthType;
            row.rowFormat.gridAfter = rowFormat.gridAfter;
            row.rowFormat.gridAfterWidth = rowFormat.gridAfterWidth;
            row.rowFormat.gridAfterWidthType = rowFormat.gridAfterWidthType;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let cellFormat: CellFormatHistoryInfo = rowFormat.cells[j];
                cell.columnIndex = cellFormat.columnIndex;
                cell.cellFormat.columnSpan = cellFormat.columnSpan;
                cell.cellFormat.preferredWidth = cellFormat.preferredWidth;
                cell.cellFormat.preferredWidthType = cellFormat.preferredWidthType;
            }
        }

        let containerWidth: number = table.getOwnerWidth(true);
        let tableWidth: number = table.getTableClientWidth(containerWidth);
        //Sets the width to cells
        table.setWidthToCells(tableWidth, table.tableFormat.preferredWidthType === 'Auto');
        // PreserveGrid = false;
    }
    /**
     * Return table row width
     */
    private getActualWidth(row: TableRowWidget): number {
        let width: number = 0;
        if (row.childWidgets.length > 0) {
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                width += (row.childWidgets[i] as TableCellWidget).cellFormat.cellWidth;
            }
        }
        return width;
    }

    public setPreferredWidth(table: TableWidget): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let rw: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowFormat: WRowFormat = rw.rowFormat;
            if (rowFormat.gridBefore > 0) {
                rowFormat.gridBeforeWidth = rowFormat.beforeWidth;
                rowFormat.gridBeforeWidthType = 'Point';
            }
            for (let j: number = 0; j < rw.childWidgets.length; j++) {
                let cell: TableCellWidget = rw.childWidgets[j] as TableCellWidget;
                cell.cellFormat.preferredWidth = cell.cellFormat.cellWidth;
                cell.cellFormat.preferredWidthType = 'Point';
            }
            if (rowFormat.gridAfter > 0) {
                rowFormat.gridAfterWidth = rowFormat.afterWidth;
                rowFormat.gridAfterWidthType = 'Point';
            }
        }
    }
    private updateCellPreferredWidths(table: TableWidget): void {
        let tableWidth: number = table.tableHolder.tableWidth;
        let isAutoFit: boolean = table.tableFormat.preferredWidthType === 'Auto';
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.gridBefore > 0) {
                let width: number = table.tableHolder.getCellWidth(0, row.rowFormat.gridBefore, tableWidth, isAutoFit);
                this.updateGridBeforeWidth(width, row);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                cell.updateWidth(table.tableHolder.getCellWidth(cell.columnIndex, cell.cellFormat.columnSpan, tableWidth, isAutoFit));
            }
            if (row.rowFormat.gridAfter > 0) {
                // tslint:disable-next-line:max-line-length
                this.updateGridAfterWidth(table.tableHolder.getCellWidth(row.childWidgets.length, row.rowFormat.gridAfter, tableWidth, isAutoFit), row);
            }
        }
    }
    /**
     * Update grid before width value
     */
    private updateGridBeforeWidth(width: number, row: TableRowWidget): void {
        let rowFormat: WRowFormat = row.rowFormat;
        if (width !== rowFormat.beforeWidth) {
            rowFormat.beforeWidth = width;
            if (rowFormat.gridBeforeWidthType === 'Auto') {
                rowFormat.gridBeforeWidthType = 'Point';
            }
            if (rowFormat.gridBeforeWidthType === 'Point') {
                rowFormat.gridBeforeWidth = rowFormat.beforeWidth;
            } else {
                // The value is calculated from the pixel values hence, its converted to percent using method. 
                let ownerWidth: number = row.ownerTable.getTableClientWidth(row.ownerTable.getOwnerWidth(true));
                let value: number = row.ownerTable.convertPointToPercent(rowFormat.beforeWidth, ownerWidth);
                rowFormat.gridBeforeWidth = value;
            }
        }
    }
    /**
     * Update grid after width value
     */
    public updateGridAfterWidth(width: number, row: TableRowWidget): void {
        let rowFormat: WRowFormat = row.rowFormat;
        if (width !== rowFormat.afterWidth) {
            rowFormat.afterWidth = width;
        }
        if (rowFormat.gridAfterWidthType === 'Auto') {
            rowFormat.gridAfterWidthType = 'Point';
        }
        if (rowFormat.gridAfterWidthType === 'Point') {
            rowFormat.gridAfterWidth = rowFormat.afterWidth;
        } else {
            // The value is calculated from the pixel values hence, its converted to percent using method. 
            let ownerWidth: number = row.ownerTable.getTableClientWidth(row.ownerTable.getOwnerWidth(true));
            let value: number = row.ownerTable.convertPointToPercent(rowFormat.afterWidth, ownerWidth);
            rowFormat.gridAfterWidth = value;
        }
    }

}
