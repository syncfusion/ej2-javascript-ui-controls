import { TableWidget, TableCellWidget, Page, BodyWidget, TableRowWidget, Widget, WColumn } from '../index';
import { DocumentEditor } from '../../document-editor';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Selection } from '../index';
import { Point, HelperMethods } from './editor-helper';
import { WRowFormat } from '../index';
import { LayoutViewer } from '../index';
import { TableAlignment } from '../../index';
import { TableHistoryInfo, RowFormatHistoryInfo, CellFormatHistoryInfo } from '../index';
import { DocumentHelper } from '../viewer';
/**
 * @private
 */
export class TableResizer {
    public owner: DocumentEditor;
    public documentHelper: DocumentHelper;
    public resizeNode: number = 0;
    public resizerPosition: number = -1;
    public currentResizingTable: TableWidget = undefined;
    public startingPoint: Point;
    public constructor(node: DocumentEditor) {
        this.owner = node;
        this.documentHelper = this.owner.documentHelper;
        this.startingPoint = new Point(0, 0);
    }
    private get viewer(): LayoutViewer {
        return this.owner.viewer;
    }

    private getModuleName(): string {
        return 'TableResizer';
    }

    public updateResizingHistory(touchPoint: Point): void {
        if (this.owner.editorHistory) {
            this.owner.editorHistory.updateResizingHistory(touchPoint, this);
        }
        this.documentHelper.isRowOrCellResizing = false;
        this.resizerPosition = -1;
    }
    public handleResize(point: Point): void {
        this.owner.documentHelper.isRowOrCellResizing = true;
        this.startingPoint.x = point.x;
        this.startingPoint.y = point.y;
        //Initialize resizing history.
        this.owner.editorHistory.initResizingHistory(point, this);
    }

    //Table Resizing implementation starts
    public isInRowResizerArea(touchPoint: Point): boolean {
        const position: number = this.getRowReSizerPosition(undefined, touchPoint);
        if (position === -1) {
            return false;
        } else {
            this.resizeNode = 1;
            this.resizerPosition = position;
            return true;
        }
    }
    public isInCellResizerArea(touchPoint: Point): boolean {
        const position: number = this.getCellReSizerPosition(touchPoint);
        if (position === -1) {
            return false;
        } else {
            this.resizeNode = 0;
            this.resizerPosition = position;
            return true;
        }

    }

    public getCellReSizerPosition(touchPoint: Point): number {
        let position: number = -1;
        const resizerBoundaryWidth: number = 2;
        const tableWidget: TableWidget = this.getTableWidget(touchPoint);
        const cellWidget: TableCellWidget = this.getTableCellWidget(touchPoint);
        const cellSpacing: number = isNullOrUndefined(tableWidget) ? 0 : tableWidget.tableFormat.cellSpacing;
        if (tableWidget && cellSpacing > 0) {
            this.currentResizingTable = tableWidget;
            /* eslint-disable-next-line max-len */
            if (this.documentHelper.isInsideRect(tableWidget.x - HelperMethods.convertPointToPixel(tableWidget.leftBorderWidth) - 0.25, tableWidget.y, HelperMethods.convertPointToPixel(tableWidget.leftBorderWidth) + 0.5, tableWidget.height, touchPoint)) {
                return position = 0;
            }
            let startingPointX: number = tableWidget.x;
            for (let i: number = 0; i < tableWidget.tableHolder.columns.length; i++) {
                const preferredWidth: number = HelperMethods.convertPointToPixel(tableWidget.tableHolder.columns[i].preferredWidth);
                /* eslint-disable-next-line max-len */
                if ((this.documentHelper.isInsideRect(startingPointX - 1, tableWidget.y, tableWidget.leftBorderWidth + resizerBoundaryWidth, tableWidget.height, touchPoint))) {
                    return position = i > 0 ? i : 0;
                    /* eslint-disable-next-line max-len */
                } else if (i > 0 && (this.documentHelper.isInsideRect(startingPointX + preferredWidth - resizerBoundaryWidth / 2, tableWidget.y, resizerBoundaryWidth, tableWidget.height, touchPoint))) {
                    return position = (i + 1);
                }
                startingPointX = startingPointX + preferredWidth;
            }
        } else {
            if (!isNullOrUndefined(cellWidget)) {
                this.currentResizingTable = cellWidget.ownerTable;
                /* eslint-disable-next-line max-len */
                if (this.documentHelper.isInsideRect(cellWidget.x - cellWidget.margin.left - resizerBoundaryWidth / 2, cellWidget.y - cellWidget.margin.top, resizerBoundaryWidth, cellWidget.height + cellWidget.margin.top + cellWidget.margin.bottom, touchPoint)) {
                    return position = cellWidget.columnIndex;
                } else if (isNullOrUndefined(cellWidget.nextRenderedWidget)
                    /* eslint-disable-next-line max-len */
                    && this.documentHelper.isInsideRect(cellWidget.x + cellWidget.margin.right + cellWidget.width - resizerBoundaryWidth / 2, cellWidget.y - cellWidget.margin.top, resizerBoundaryWidth, cellWidget.height + cellWidget.margin.top + cellWidget.margin.bottom, touchPoint)) {
                    return position = (cellWidget.columnIndex + cellWidget.cellFormat.columnSpan);
                } else if (cellWidget.childWidgets.length > 0) {
                    return this.getCellReSizerPositionInternal(cellWidget, touchPoint); // Gets the nested table resizer position.
                }
            }
        }
        return position;
    }

    private getCellReSizerPositionInternal(cellWidget: TableCellWidget, touchPoint: Point): number {
        let position: number = -1;
        const childTableWidget: TableWidget = this.getTableWidgetFromWidget(touchPoint, cellWidget);
        let childCellWidget: TableCellWidget = undefined;
        if (!isNullOrUndefined(childTableWidget) && childTableWidget.tableFormat.cellSpacing > 0) {
            this.currentResizingTable = childTableWidget;
            /* eslint-disable-next-line max-len */
            if (this.documentHelper.isInsideRect(childTableWidget.x - childTableWidget.leftBorderWidth - 0.25, childTableWidget.y, childTableWidget.leftBorderWidth + 0.5, childTableWidget.height, touchPoint)) {
                return position = 0;
            }
            let startingPointX: number = childTableWidget.x;
            for (let i: number = 0; i < childTableWidget.tableHolder.columns.length; i++) {
                const preferredWidth: number = HelperMethods.convertPointToPixel(childTableWidget.tableHolder.columns[i].preferredWidth);
                /* eslint-disable-next-line max-len */
                if ((this.documentHelper.isInsideRect(startingPointX - 1, childTableWidget.y, childTableWidget.leftBorderWidth + 2, childTableWidget.height, touchPoint))) {
                    return position = i > 0 ? i : 0;
                    /* eslint-disable-next-line max-len */
                } else if (i > 0 && (this.documentHelper.isInsideRect(startingPointX + preferredWidth - 1, childTableWidget.y, 2, childTableWidget.height, touchPoint))) {
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
                /* eslint-disable-next-line max-len */
                if (this.documentHelper.isInsideRect(childCellWidget.x - childCellWidget.margin.left - 1, childCellWidget.y - childCellWidget.margin.top, 2, childCellWidget.height, touchPoint)) {
                    return position = childCellWidget.columnIndex;
                } else if (isNullOrUndefined(childCellWidget.nextRenderedWidget)
                    /* eslint-disable-next-line max-len */
                    && this.documentHelper.isInsideRect(childCellWidget.x + childCellWidget.margin.right + childCellWidget.width - 1, childCellWidget.y - childCellWidget.margin.top, 2, childCellWidget.height, touchPoint)) {
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
        const cellSpacing: number = isNullOrUndefined(tableWidget) ? 0 : tableWidget.tableFormat.cellSpacing;
        if (tableWidget && cellSpacing > 0) {
            this.currentResizingTable = tableWidget;
            /* eslint-disable-next-line max-len */
            if (this.owner.documentHelper.isInsideRect(tableWidget.x, tableWidget.y + tableWidget.height - cellSpacing, this.getActualWidth(tableWidget.lastChild as TableRowWidget), (isNullOrUndefined(tableWidget.nextSplitWidget) ? tableWidget.bottomBorderWidth + cellSpacing : 0), touchPoint)) {
                return (tableWidget.lastChild as TableRowWidget).rowIndex;
            }
            for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
                //Need to consider for splitted widgets
                const rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
                if (tableWidget.childWidgets.indexOf(rowWidget) > -1
                    /* eslint-disable-next-line max-len */
                    && (this.owner.documentHelper.isInsideRect(rowWidget.x, rowWidget.y + rowWidget.height + cellSpacing / 2, this.getActualWidth(rowWidget), cellSpacing / 2, touchPoint))) {
                    return rowWidget.rowIndex;
                }
            }
        } else {
            if (tableWidget && cellWidget) {
                cellWidget = this.getTableCellWidget(touchPoint);
            }
            if (cellWidget) {
                const rowWidget: TableRowWidget = cellWidget.containerWidget as TableRowWidget;
                let height: number = 0;
                if (rowWidget.rowIndex === rowWidget.ownerTable.childWidgets.length - 1) {
                    height = rowWidget.bottomBorderWidth + 2;
                } else {
                    height = (rowWidget.nextRenderedWidget as TableRowWidget).topBorderWidth + 2;
                }
                /* eslint-disable-next-line max-len */
                if (this.owner.documentHelper.isInsideRect(rowWidget.x, rowWidget.y + rowWidget.height - height, rowWidget.width, height * 2, touchPoint)) {
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
        if (isNullOrUndefined(table) || dragValue === 0 || this.resizerPosition === -1) {
            return;
        }
        const selection: Selection = this.owner.selection;
        if (table.isInsideTable) {
            this.owner.isLayoutEnabled = false; //Layouting is disabled to skip the child table layouting.
        }
        let row: TableRowWidget = undefined;
        if (this.resizerPosition > -1) {
            row = table.childWidgets[this.resizerPosition] as TableRowWidget;
            if (row) {
                this.updateRowHeight(row, dragValue);
            }
            selection.selectPosition(selection.start, selection.end);
        }
        if (table.isInsideTable) {
            const parentTable: TableWidget = this.owner.documentHelper.layout.getParentTable(table);
            this.owner.isLayoutEnabled = true; //layouting is enabled to layout the parent table of the nested table.
            table = parentTable;
        }
        this.startingPoint.y += HelperMethods.convertPointToPixel(dragValue);
        this.owner.documentHelper.layout.reLayoutTable(table);
        this.owner.editorModule.reLayout(this.owner.selection);
        if (row) {
            this.getRowReSizerPosition(undefined, this.startingPoint);
        }
        if (this.currentResizingTable && (this.currentResizingTable.childWidgets === undefined
            || this.currentResizingTable.childWidgets[this.resizerPosition] === undefined)) {
            this.resizerPosition = -1;
        }
    }

    private getTableWidget(cursorPoint: Point): TableWidget {
        let widget: TableWidget = undefined;
        const currentPage: Page = this.owner.documentHelper.currentPage;
        if (!isNullOrUndefined(currentPage)) {
            for (let i: number = 0; i < currentPage.bodyWidgets.length; i++) {
                const bodyWidget: BodyWidget = currentPage.bodyWidgets[i];
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
                const childWidget: TableWidget = widget.childWidgets[j] as TableWidget;
                let tableWidth: number = 0;
                if (childWidget.wrapTextAround) {
                    tableWidth = childWidget.getTableCellWidth();
                }
                if (!(childWidget.wrapTextAround) && childWidget.y <= point.y && (childWidget.y + childWidget.height) >= point.y) {
                    return childWidget;
                }
                if ((childWidget.wrapTextAround &&
                    (childWidget.x <= point.x && (childWidget.x + tableWidth) >= point.x &&
                        childWidget.y <= point.y && (childWidget.y + childWidget.height) >= point.y))) {
                    return childWidget;
                }
            }
        }
        return undefined;
    }
    public getTableCellWidget(cursorPoint: Point): TableCellWidget {
        let widget: TableCellWidget = undefined;
        const currentPage: Page = this.owner.documentHelper.currentPage;
        if (!isNullOrUndefined(currentPage)) {
            for (let i: number = 0; i < currentPage.bodyWidgets.length; i++) {
                const bodyWidget: BodyWidget = currentPage.bodyWidgets[i];
                widget = bodyWidget.getTableCellWidget(cursorPoint);
                if (!isNullOrUndefined(widget)) {
                    break;
                }
            }
        }
        return widget;
    }
    public updateRowHeight(row: TableRowWidget, dragValue: number): void {
        const rowFormat: WRowFormat = row.rowFormat;
        if (rowFormat.heightType === 'Auto') {
            rowFormat.heightType = 'AtLeast';
            const row: TableRowWidget = rowFormat.ownerBase as TableRowWidget;
            const currentHeight: number = this.owner.documentHelper.layout.getRowHeight(row, [row]);
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
        if (isNullOrUndefined(table) || dragValue === 0 || isNullOrUndefined(table.childWidgets) || this.resizerPosition < 0) {
            return;
        }

        let selectionFlag: boolean = true;
        const selection: Selection = this.owner.selection;
        this.owner.editor.setOffsetValue(selection);
        table = table.combineWidget(this.viewer) as TableWidget;
        this.owner.isLayoutEnabled = false;
        // table.PreserveGrid = true;
        this.setPreferredWidth(table);
        const containerWidth: number = table.getOwnerWidth(true);
        let newIndent: number = table.leftIndent;
        const tableAlignment: TableAlignment = table.tableFormat.tableAlignment;
        if (!selection.isEmpty) {
            selectionFlag = this.resizeColumnWithSelection(selection, table, dragValue);
        }
        if (!selectionFlag) {
            this.owner.isLayoutEnabled = true;
            return;
        }
        if (this.resizerPosition === 0) {
            // Todo: need to handle the resizing of first column and table indent.
            const columnIndex: number = this.resizerPosition;
            const rightColumn: WColumn = table.tableHolder.columns[columnIndex];
            const width: number = rightColumn.preferredWidth;

            if (dragValue > 0) {
                let prevDragValue: number = dragValue;
                do {
                    const newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
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
                    const newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
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
            if (tableAlignment !== 'Left' && (table.tableHolder.getTotalWidth(0) > containerWidth) && table.tableFormat.preferredWidthType === 'Auto') {
                if (table.tableHolder.isFitColumns(containerWidth, table.tableHolder.tableWidth, table.tableFormat.preferredWidthType === 'Auto')) {
                    table.tableHolder.fitColumns(containerWidth, table.tableHolder.tableWidth, table.tableFormat.preferredWidthType === 'Auto');
                } else {
                    rightColumn.preferredWidth = width;
                }
                dragOffset = 0;
            }
            if (tableAlignment === 'Center'
                && (table.tableHolder.getTotalWidth(0) < containerWidth || table.tableFormat.preferredWidthType !== 'Auto')) {
                dragOffset = dragOffset / 2;
            }
            table.tableFormat.leftIndent = tableAlignment === 'Left' ? newIndent : 0;
            table.tableHolder.tableWidth = table.tableHolder.getTotalWidth(0);
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
    private resizeColumnWithSelection(selection: Selection, table: TableWidget, dragValue: number): boolean {
        //const newIndent: number = table.leftIndent;
        const cellwidget: Widget = this.getTableCellWidget(this.startingPoint) as Widget;
        if (cellwidget && (selection.selectedWidgets.containsKey(cellwidget) || ((cellwidget as TableCellWidget).previousWidget
            && selection.selectedWidgets.containsKey(((cellwidget as TableCellWidget).previousWidget))))) {
            const selectedCells: TableCellWidget[] = selection.getSelectedCells();
            if (this.resizerPosition === 0) {
                this.resizeColumnAtStart(table, dragValue, selectedCells);
            } else if (table !== null && this.resizerPosition === table.tableHolder.columns.length) {
                const leftColumnCollection: TableCellWidget[] = this.getColumnCells(table, this.resizerPosition, true);
                for (let i: number = 0; i < leftColumnCollection.length; i++) {
                    const cell: TableCellWidget = leftColumnCollection[i];
                    if (selectedCells.indexOf(cell) !== -1) {
                        this.increaseOrDecreaseWidth(cell, dragValue, true);
                    }
                }
                //Updates the grid after value for all the rows.
                this.updateRowsGridAfterWidth(table);
                table.updateWidth(dragValue);
                table.tableFormat.allowAutoFit = false;
                this.updateGridValue(table, true, dragValue);
            } else {
                if (this.resizerPosition === -1) {
                    return false;
                }
                const columnIndex: number = this.resizerPosition;
                const leftColumnCollection: TableCellWidget[] = this.getColumnCells(table, columnIndex, true);
                const rightColumnCollection: TableCellWidget[] = this.getColumnCells(table, columnIndex, false);
                const isColumnResizing: boolean = this.isColumnSelected(table, columnIndex);
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
                        const cell: TableCellWidget = rightColumnCollection[i] as TableCellWidget;
                        if (cell.previousWidget) {
                            leftColumnCollection.push(cell.previousWidget as TableCellWidget);
                        }
                    }
                } else if (rightColumnCollection.length === 0 && leftColumnCollection.length > 0) {
                    for (let i: number = 0; i < leftColumnCollection.length; i++) {
                        const cell: TableCellWidget = leftColumnCollection[i] as TableCellWidget;
                        if (cell.nextWidget) {
                            rightColumnCollection.push(cell.nextWidget as TableCellWidget);
                        }
                    }
                }
                this.changeWidthOfCells(table, leftColumnCollection, rightColumnCollection, dragValue);
                if (table.tableFormat.allowAutoFit) {
                    table.updateWidth(dragValue);
                }
                table.tableFormat.allowAutoFit = false;
                this.updateGridValue(table, true, dragValue);
            }
            selection.selectPosition(selection.start, selection.end);
        }
        return false;
    }

    private resizeColumnAtStart(table: TableWidget, dragValue: number, selectedCells: TableCellWidget[]): void {
        let newIndent: number = table.leftIndent;
        //const rightColumnCollection: TableCellWidget[] = this.getColumnCells(table, this.resizerPosition, false);
        const offset: number = 0;
        const selectedRow: TableRowWidget = selectedCells[0].ownerRow;
        const rowFormat: WRowFormat = selectedRow.rowFormat;
        if (rowFormat.beforeWidth > 0) {
            const newGridBefore: number = rowFormat.beforeWidth + dragValue;
            if (newGridBefore > 0) {
                this.updateGridBefore(selectedRow, dragValue);
            } else {
                const leastGridBefore: number = this.getLeastGridBefore(table, selectedRow);
                if (newGridBefore < leastGridBefore && offset !== newGridBefore) {
                    newIndent = table.leftIndent + newGridBefore;
                    table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                    for (let i: number = 0; i < table.childWidgets.length; i++) {
                        const tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
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
                const leastGridBefore: number = this.getLeastGridBefore(table, selectedRow);
                const currentTableIndent: number = table.tableFormat.leftIndent;
                if (currentTableIndent === 0) {
                    for (let i: number = 0; i < table.childWidgets.length; i++) {
                        const tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                        if (selectedCells.indexOf(tableRow.childWidgets[0] as TableCellWidget) !== -1) {
                            this.updateGridBefore(tableRow, dragValue);
                            this.increaseOrDecreaseWidth(tableRow.childWidgets[0] as TableCellWidget, dragValue, false);
                        }
                    }
                } else {
                    const difference: number = leastGridBefore - dragValue;
                    if (difference > 0) {
                        newIndent = table.leftIndent + dragValue;
                        table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        this.updateWidthForCells(table, selectedCells, dragValue);
                    } else {
                        newIndent = table.leftIndent + leastGridBefore;
                        table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                        for (let i: number = 0; i < table.childWidgets.length; i++) {
                            const tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
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
        table.tableFormat.allowAutoFit = false;
        this.updateGridValue(table, true, dragValue);
    }
    private updateWidthForCells(table: TableWidget, selectedCells: TableCellWidget[], dragValue: number): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (selectedCells.indexOf(tableRow.childWidgets[0] as TableCellWidget) !== -1) {
                this.increaseOrDecreaseWidth(tableRow.childWidgets[0] as TableCellWidget, dragValue, false);
            } else {
                this.updateGridBefore(tableRow, -dragValue);
            }
        }
    }
    private resizeColumnAtLastColumnIndex(table: TableWidget, dragValue: number, containerWidth: number): void {
        const tableAlignment: TableAlignment = table.tableFormat.tableAlignment;
        const preferredWidth: number = table.tableFormat.preferredWidth;
        const hasTableWidth: number = preferredWidth;
        const columnIndex: number = this.resizerPosition;
        const leftColumn: WColumn = table.tableHolder.columns[columnIndex - 1];
        let prevDragValue: number = 0;
        while (dragValue !== prevDragValue) {
            const newWidth: number = HelperMethods.round(leftColumn.preferredWidth + dragValue, 1);
            if (newWidth >= leftColumn.minWidth) {
                leftColumn.preferredWidth = newWidth;
                prevDragValue = dragValue;
            } else {
                prevDragValue = dragValue;
                dragValue -= newWidth - leftColumn.minWidth;
            }
        }
        this.updateCellPreferredWidths(table);
        if (hasTableWidth || table.tableHolder.getTotalWidth(0) > containerWidth) {
            table.tableFormat.allowAutoFit = false;
            table.updateWidth(dragValue);
            table.tableHolder.tableWidth = table.tableHolder.getTotalWidth(0);
        }
        let dragOffset: number = dragValue;
        if (tableAlignment === 'Right') {
            dragOffset = 0;
        } else if (tableAlignment === 'Center') {
            dragOffset = dragOffset / 2;
        }
        this.updateGridValue(table, true, dragOffset);
    }

    private resizeCellAtMiddle(table: TableWidget, dragValue: number): void {
        const columnIndex: number = this.resizerPosition;
        const leftColumn: WColumn = table.tableHolder.columns[columnIndex - 1];
        const rightColumn: WColumn = table.tableHolder.columns[columnIndex];
        if (dragValue > 0) {
            let isContinue: boolean = true;
            while (isContinue) {
                const newWidth: number = HelperMethods.round(rightColumn.preferredWidth - dragValue, 1);
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
                const newWidth: number = HelperMethods.round(leftColumn.preferredWidth + dragValue, 1);
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
        if (table.tableFormat.allowAutoFit) {
            table.updateWidth(dragValue);
        }
        table.tableFormat.allowAutoFit = false;
        table.tableHolder.tableWidth = table.tableHolder.getTotalWidth(0);
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
            const parentTable: TableWidget = this.documentHelper.layout.getParentTable(table);
            this.documentHelper.layout.reLayoutTable(parentTable); // Need to optmize this.
        } else {
            this.documentHelper.layout.reLayoutTable(table);
        }
        this.owner.editor.getOffsetValue(this.documentHelper.selection);
        this.owner.editorModule.reLayout(this.owner.selection);
        if (dragValue) {
            this.startingPoint.x += HelperMethods.convertPointToPixel(dragValue);
            this.resizerPosition = this.getCellReSizerPosition(this.startingPoint);
        }
    }
    private getColumnCells(table: TableWidget, columnIndex: number, isLeftSideCollection: boolean): TableCellWidget[] {
        const cells: TableCellWidget[] = [];
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
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
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
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
    /* eslint-disable-next-line max-len */
    private changeWidthOfCells(table: TableWidget, leftColumnCollection: TableCellWidget[], rightColumnCollection: TableCellWidget[], dragValue: number): void {
        if (leftColumnCollection.length > 0) {
            let flag: boolean = false;
            for (let i: number = 0; i < leftColumnCollection.length; i++) {
                const cell: TableCellWidget = leftColumnCollection[i];
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
                const cell: TableCellWidget = rightColumnCollection[i];
                if (cell.cellIndex === 0) {
                    const newGridBefore: number = cell.ownerRow.rowFormat.beforeWidth + dragValue;
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
                const newIndent: number = table.leftIndent + diff;
                table.tableFormat.leftIndent = newIndent >= -1440 ? (newIndent <= 1440 ? newIndent : 1440) : -1440;
                for (let j: number = 0; j < table.childWidgets.length; j++) {
                    const row: TableRowWidget = table.childWidgets[j] as TableRowWidget;
                    if (rightColumnCollection.indexOf(row.childWidgets[0] as TableCellWidget) === -1) {
                        this.updateGridBefore(row, diff > 0 ? diff : -diff);
                    }
                }
            }
        }
    }
    private updateRowsGridAfterWidth(table: TableWidget): void {
        const maxRowWidth: number = this.getMaxRowWidth(table, true);
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            const currentRowWidth: number = this.getRowWidth(row, true);
            if (maxRowWidth >= currentRowWidth && row.rowFormat.afterWidth !== maxRowWidth - currentRowWidth) {
                const value: number = maxRowWidth - currentRowWidth;
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
            const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            rowWidth += cell.cellFormat.cellWidth;
        }
        return rowWidth;
    }
    private getMaxRowWidth(table: TableWidget, toUpdateGridAfter: boolean): number {
        let width: number = 0;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowWidth: number = 0;
            if (toUpdateGridAfter) {
                rowWidth = rowWidth + row.rowFormat.beforeWidth;
            }
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                rowWidth += cell.cellFormat.cellWidth;
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    private isColumnSelected(table: TableWidget, columnIndex: number): boolean {
        const selection: Selection = this.owner.selection;
        const selectedCells: TableCellWidget[] = selection.getSelectedCells();
        const leftColumnCells: TableCellWidget[] = this.getColumnCells(table, columnIndex, true);
        const rightColumnCells: TableCellWidget[] = this.getColumnCells(table, columnIndex, false);
        let isColumnSelected: boolean = false;
        for (let i: number = 0; i < leftColumnCells.length; i++) {
            const columnCell: TableCellWidget = leftColumnCells[i];
            isColumnSelected = selectedCells.indexOf(columnCell) !== -1 ? true : false;
        }
        if (!isColumnSelected) {
            for (let i: number = 0; i < rightColumnCells.length; i++) {
                const columnCell: TableCellWidget = rightColumnCells[i];
                isColumnSelected = selectedCells.indexOf(columnCell) !== -1 ? true : false;
            }
        }
        return isColumnSelected;
    }

    public applyProperties(table: TableWidget, tableHistoryInfo: TableHistoryInfo): void {
        if (isNullOrUndefined(tableHistoryInfo)) {
            return;
        }
        // PreserveGrid = true;
        if (tableHistoryInfo.tableHolder) {
            table.tableHolder = tableHistoryInfo.tableHolder.clone();
        }
        if (tableHistoryInfo.tableFormat !== null) {
            table.tableFormat.leftIndent = tableHistoryInfo.tableFormat.leftIndent;
            table.tableFormat.preferredWidth = tableHistoryInfo.tableFormat.preferredWidth;
            table.tableFormat.preferredWidthType = tableHistoryInfo.tableFormat.preferredWidthType;
            table.tableFormat.allowAutoFit = tableHistoryInfo.tableFormat.allowAutoFit;
        }
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            const rowFormat: RowFormatHistoryInfo = tableHistoryInfo.rows[i];
            row.rowFormat.gridBefore = rowFormat.gridBefore;
            row.rowFormat.gridBeforeWidth = rowFormat.gridBeforeWidth;
            row.rowFormat.gridBeforeWidthType = rowFormat.gridBeforeWidthType;
            row.rowFormat.gridAfter = rowFormat.gridAfter;
            row.rowFormat.gridAfterWidth = rowFormat.gridAfterWidth;
            row.rowFormat.gridAfterWidthType = rowFormat.gridAfterWidthType;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                const cellFormat: CellFormatHistoryInfo = rowFormat.cells[j];
                cell.columnIndex = cellFormat.columnIndex;
                cell.cellFormat.columnSpan = cellFormat.columnSpan;
                cell.cellFormat.preferredWidth = cellFormat.preferredWidth;
                cell.cellFormat.preferredWidthType = cellFormat.preferredWidthType;
            }
        }

        const containerWidth: number = table.getOwnerWidth(true);
        const tableWidth: number = table.getTableClientWidth(containerWidth);
        //Sets the width to cells
        table.setWidthToCells(tableWidth, table.tableFormat.preferredWidthType === 'Auto');
        // PreserveGrid = false;
    }
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
            const rw: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            const rowFormat: WRowFormat = rw.rowFormat;
            if (rowFormat.gridBefore > 0) {
                rowFormat.gridBeforeWidth = rowFormat.beforeWidth;
                rowFormat.gridBeforeWidthType = 'Point';
            }
            for (let j: number = 0; j < rw.childWidgets.length; j++) {
                const cell: TableCellWidget = rw.childWidgets[j] as TableCellWidget;
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
        const tableWidth: number = table.tableHolder.tableWidth;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.gridBefore > 0) {
                const width: number = table.tableHolder.getCellWidth(0, row.rowFormat.gridBefore, tableWidth);
                this.updateGridBeforeWidth(width, row);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                cell.updateWidth(table.tableHolder.getCellWidth(cell.columnIndex, cell.cellFormat.columnSpan, tableWidth));
            }
            if (row.rowFormat.gridAfter > 0) {
                /* eslint-disable-next-line max-len */
                this.updateGridAfterWidth(table.tableHolder.getCellWidth(row.childWidgets.length, row.rowFormat.gridAfter, tableWidth), row);
            }
        }
    }
    private updateGridBeforeWidth(width: number, row: TableRowWidget): void {
        const rowFormat: WRowFormat = row.rowFormat;
        if (width !== rowFormat.beforeWidth) {
            rowFormat.beforeWidth = width;
            if (rowFormat.gridBeforeWidthType === 'Auto') {
                rowFormat.gridBeforeWidthType = 'Point';
            }
            if (rowFormat.gridBeforeWidthType === 'Point') {
                rowFormat.gridBeforeWidth = rowFormat.beforeWidth;
            } else {
                // The value is calculated from the pixel values hence, its converted to percent using method.
                const ownerWidth: number = row.ownerTable.getTableClientWidth(row.ownerTable.getOwnerWidth(true));
                const value: number = row.ownerTable.convertPointToPercent(rowFormat.beforeWidth, ownerWidth);
                rowFormat.gridBeforeWidth = value;
            }
        }
    }
    public updateGridAfterWidth(width: number, row: TableRowWidget): void {
        const rowFormat: WRowFormat = row.rowFormat;
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
            const ownerWidth: number = row.ownerTable.getTableClientWidth(row.ownerTable.getOwnerWidth(true));
            const value: number = row.ownerTable.convertPointToPercent(rowFormat.afterWidth, ownerWidth);
            rowFormat.gridAfterWidth = value;
        }
    }

}
