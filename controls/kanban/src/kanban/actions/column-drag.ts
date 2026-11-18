/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable, formatUnit, createElement, isNullOrUndefined as isNoU, addClass, closest, MouseEventArgs } from '@syncfusion/ej2-base';
import { removeClass, remove } from '@syncfusion/ej2-base';
import { Kanban } from '../base/kanban';
import { ColumnDragEventArgs, EJ2Instance } from '../base/interface';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import { ColumnsModel, StackedHeadersModel } from '../models';

/**
 * ColumnDragAndDrop module is used to perform column reordering actions.
 */
export class ColumnDragAndDrop {
    private parent: Kanban;
    private draggedColumn: HTMLElement;
    private draggedIndex: number;
    private targetIndex: number;
    private isDragging: boolean;
    private dragInstance: Draggable;
    private headerCells: HTMLElement[];
    private dropIndicator: HTMLElement;
    private dragArea: HTMLElement;
    private contentCells: HTMLElement[];
    private isStackedHeader: boolean;
    private skeletonElement: HTMLElement;

    /**
     * Constructor for column drag and drop module
     *
     * @param {Kanban} parent Accepts the kanban instance
     * @private
     */
    constructor(parent: Kanban) {
        this.parent = parent;
        this.isDragging = false;
    }

    public wireColumnDragEvents(headerCell: HTMLElement): void {
        this.dragArea = this.parent.element;
        this.dragInstance = new Draggable(headerCell, {
            clone: true,
            dragArea: this.dragArea,
            dragStart: this.columnDragStart.bind(this),
            drag: this.columnDrag.bind(this),
            dragStop: this.columnDragStop.bind(this),
            helper: this.columnDragHelper.bind(this),
            enableTapHold: this.parent.isAdaptive as boolean
        });
        if (!this.dropIndicator) {
            this.dropIndicator = createElement('div', {
                className: 'e-kanban-column-indicator'
            });
            document.body.appendChild(this.dropIndicator);
        }
    }

    private columnDragHelper(e: { [key: string]: MouseEventArgs }): HTMLElement {
        this.draggedColumn = closest(e.sender.target as Element, '.' + cls.HEADER_CELLS_CLASS) as HTMLElement;
        if (isNoU(this.draggedColumn)) { return null; }
        this.isStackedHeader = this.draggedColumn.classList.contains(cls.STACKED_HEADER_CELL_CLASS);
        if (this.isStackedHeader) {
            const stackedHeaderIndex: number = this.getColumnIndex(this.draggedColumn);
            const stackedHeader: StackedHeadersModel = this.parent.stackedHeaders[stackedHeaderIndex as number];
            const keyFields: string[] = stackedHeader.keyFields.split(',').map((field: string) => field.trim());
            this.contentCells = [];
            keyFields.forEach((key: string) => {
                const cellsForKey: HTMLElement[] = Array.from(
                    this.parent.element.querySelectorAll('.e-content-cells[data-key="' + key + '"]')
                ) as HTMLElement[];
                this.contentCells.push(...cellsForKey);
            });
        } else {
            const columnKey: string = this.draggedColumn.getAttribute('data-key');
            this.contentCells = Array.from(
                this.parent.element.querySelectorAll('.e-content-cells[data-key="' + columnKey + '"]')
            ) as HTMLElement[];
        }
        addClass([this.draggedColumn], 'e-kanban-dragging-header');
        this.draggedIndex = this.getColumnIndex(this.draggedColumn);
        if (!this.skeletonElement) {
            this.skeletonElement = createElement('div', {
                className: 'e-kanban-column-skeleton'
            });
            document.body.appendChild(this.skeletonElement);
        }
        this.createColumnSkeleton();
        return this.skeletonElement;
    }

    private columnDragStart(e: MouseEvent & TouchEvent): void {
        if (!this.parent.allowColumnDragAndDrop) {
            return;
        }
        this.isDragging = true;
        const dragStartArgs: ColumnDragEventArgs = {
            cancel: false,
            event: e,
            element: this.draggedColumn,
            fromIndex: this.draggedIndex,
            column: this.isStackedHeader ? this.parent.stackedHeaders[this.draggedIndex] : this.parent.columns[this.draggedIndex]
        };
        this.parent.trigger(events.columnDragStart, dragStartArgs);
        if (dragStartArgs.cancel) {
            this.resetDragState();
            this.dragInstance.intDestroy(e);
            return;
        }
        addClass([this.draggedColumn], 'e-dragged-header');
        this.contentCells.forEach((cell: HTMLElement) => {
            addClass([cell], 'e-dragged-content');
        });
        this.showColumnSkeleton(e);
    }
    private columnDrag(e: MouseEvent & TouchEvent): void {
        if (!this.isDragging) {
            return;
        }
        const targetHeader: HTMLElement = this.findTargetHeader(e);
        if (!targetHeader) {
            this.dropIndicator.style.display = 'none';
            return;
        }
        const draggedColumnKey: string = this.draggedColumn.getAttribute('data-key');
        const targetColumnKey: string = targetHeader.getAttribute('data-key');
        const draggedParentHeader: StackedHeadersModel = this.getParentStackedHeader(draggedColumnKey);
        const targetParentHeader: StackedHeadersModel = this.getParentStackedHeader(targetColumnKey);
        if (!this.isStackedHeader && draggedParentHeader) {
            if (!targetParentHeader) {
                this.dropIndicator.style.display = 'none';
                return;
            } else if (draggedParentHeader.keyFields !== targetParentHeader.keyFields) {
                this.dropIndicator.style.display = 'none';
                return;
            }
        }
        if (!this.isStackedHeader && draggedParentHeader && targetParentHeader) {
            if (draggedParentHeader.keyFields !== targetParentHeader.keyFields) {
                this.dropIndicator.style.display = 'none';
                return;
            }
        }
        this.targetIndex = this.getColumnIndex(targetHeader);
        const rect: ClientRect = targetHeader.getBoundingClientRect();
        const dragArgs: ColumnDragEventArgs = {
            event: e,
            element: this.draggedColumn,
            fromIndex: this.draggedIndex,
            toIndex: this.targetIndex,
            column: this.isStackedHeader ? this.parent.stackedHeaders[this.draggedIndex] : this.parent.columns[this.draggedIndex]
        };
        this.parent.trigger(events.columnDrag, dragArgs);
        if (dragArgs.cancel) {
            this.resetDragState();
            return;
        }
        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.left = (rect.left + window.pageXOffset) + 'px';
        this.dropIndicator.style.top = (rect.top + window.pageYOffset) + 'px';
        this.dropIndicator.style.height = rect.height + 'px';
    }

    private columnDragStop(e: MouseEvent & TouchEvent): void {
        if (!this.isDragging) { return; }
        const targetHeader: HTMLElement = this.findTargetHeader(e);
        if (!targetHeader) {
            this.resetDragState();
            return;
        }
        const draggedColumnKey: string = this.draggedColumn.getAttribute('data-key');
        const targetColumnKey: string = targetHeader.getAttribute('data-key');
        const draggedParentHeader: StackedHeadersModel = this.getParentStackedHeader(draggedColumnKey);
        const targetParentHeader: StackedHeadersModel = this.getParentStackedHeader(targetColumnKey);
        if (!this.isStackedHeader && draggedParentHeader) {
            if (!targetParentHeader) {
                this.resetDragState();
                return;
            } else if (draggedParentHeader.keyFields !== targetParentHeader.keyFields) {
                this.resetDragState();
                return;
            }
        }
        if (!this.isStackedHeader && draggedParentHeader && targetParentHeader) {
            if (draggedParentHeader.keyFields !== targetParentHeader.keyFields) {
                this.resetDragState();
                return;
            }
        }
        const targetIndex: number = this.getColumnIndex(targetHeader);
        const dropIndex: number = targetIndex;
        const dropArgs: ColumnDragEventArgs = {
            cancel: false,
            event: e,
            element: this.draggedColumn,
            fromIndex: this.draggedIndex,
            toIndex: targetIndex,
            dropIndex: dropIndex,
            column: this.isStackedHeader ? this.parent.stackedHeaders[this.draggedIndex] : this.parent.columns[this.draggedIndex]
        };
        this.parent.trigger(events.columnDrop, dropArgs);
        if (!dropArgs.cancel && dropIndex !== this.draggedIndex) {
            if (this.isStackedHeader) {
                this.reorderStackedHeaders(this.draggedIndex, targetIndex);
            } else {
                this.reorderColumns(this.draggedIndex, targetIndex);
            }
        }
        this.resetDragState();
    }

    private createColumnSkeleton(): void {
        if (!this.skeletonElement || !this.draggedColumn) { return; }

        this.skeletonElement.innerHTML = '';
        this.skeletonElement.style.display = 'block';
        this.skeletonElement.style.position = 'absolute';
        this.skeletonElement.style.zIndex = '999';
        this.skeletonElement.style.width = formatUnit(this.draggedColumn.offsetWidth);
        // Clone header
        const headerClone: HTMLElement = this.draggedColumn.cloneNode(true) as HTMLElement;
        headerClone.classList.add('e-kanban-skeleton-header');
        this.skeletonElement.appendChild(headerClone);
        // Get the column key
        const columnKey: string = this.draggedColumn.getAttribute('data-key');
        const calculatedHeigt: number = this.parent.element.getBoundingClientRect().height;
        // Create content wrapper
        const contentWrapper: HTMLElement = createElement('div', {
            className: 'e-kanban-skeleton-content'
        });
        const availableSpace: number = calculatedHeigt - 16; // 16px for padding
        if (this.isStackedHeader) {
            const cardHeight: number = this.contentCells[0].childNodes[1].firstChild
                ? (this.contentCells[0].childNodes[1].firstChild as HTMLElement).offsetHeight : 0;
            const numCards: number = cardHeight === 0 ? 0 : Math.floor(calculatedHeigt / (cardHeight));
            for (let i: number = 0; i < numCards; i++) {
                const placeholderCard: HTMLElement = createElement('div', {
                    className: 'e-kanban-skeleton-card',
                    styles: 'height: ' + cardHeight + 'px;'
                });
                contentWrapper.appendChild(placeholderCard);
            }
        } else {
            const columnModel: ColumnsModel = this.parent.columns.find(
                (col: ColumnsModel): boolean => col.keyField.toString() === columnKey
            );
            const isCollapsed: boolean = columnModel && columnModel.allowToggle && !columnModel.isExpanded;
            if (isCollapsed) {
                // For collapsed columns, create a single placeholder with full content height
                const emptyContainer: HTMLElement = createElement('div', {
                    className: 'e-kanban-skeleton-empty-content',
                    styles: 'height: ' + availableSpace + 'px;'
                });
                contentWrapper.appendChild(emptyContainer);
            } else {
                // Get the first real card height
                const firstCard: HTMLElement = this.parent.element.querySelector(
                    '.e-content-cells[data-key="' + columnKey + '"] .e-card'
                ) as HTMLElement;
                let cardHeight : number;
                if (firstCard && firstCard.offsetHeight) {
                    cardHeight = Math.min(150, firstCard.offsetHeight); // Max 150px
                }
                const numCards: number = firstCard === null ? 0 : Math.floor(calculatedHeigt / (cardHeight));
                for (let i: number = 0; i < numCards; i++) {
                    const placeholderCard: HTMLElement = createElement('div', {
                        className: 'e-kanban-skeleton-card',
                        styles: 'height: ' + cardHeight + 'px;'
                    });
                    contentWrapper.appendChild(placeholderCard);
                }
            }
        }
        // Explicitly set the height of the content wrapper to match contentTd height
        contentWrapper.style.height = calculatedHeigt + 'px';
        // Add content wrapper to skeleton
        this.skeletonElement.appendChild(contentWrapper);
        // Set skeleton height to match header + content
        this.skeletonElement.style.height = calculatedHeigt + 'px';
    }
    private showColumnSkeleton(e: MouseEvent & TouchEvent): void {
        if (!this.skeletonElement) { return; }
        if (this.draggedColumn) {
            const headerElement: HTMLElement = closest(this.draggedColumn, '.e-kanban-header') as HTMLElement;
            if (headerElement && this.skeletonElement.parentElement !== headerElement) {
                headerElement.appendChild(this.skeletonElement);
            }
        }
        this.skeletonElement.style.display = 'block';
    }
    private findTargetHeader(e: MouseEvent & TouchEvent): HTMLElement {
        const target: HTMLElement = e.target as HTMLElement;
        if (this.isStackedHeader) {
            const stackedHeader: HTMLElement = closest(target, '.' + cls.STACKED_HEADER_CELL_CLASS) as HTMLElement;
            if (stackedHeader && stackedHeader !== this.draggedColumn) {
                return stackedHeader;
            }
        } else {
            const headerCell: HTMLElement = closest(target, '.' + cls.HEADER_CELLS_CLASS) as HTMLElement;
            if (headerCell && headerCell !== this.draggedColumn) {
                return headerCell;
            }
        }
        return null;
    }

    private getParentStackedHeader(columnKey: string): StackedHeadersModel {
        if (!this.parent.stackedHeaders || this.parent.stackedHeaders.length === 0) {
            return null;
        }
        return this.parent.stackedHeaders.find((header: StackedHeadersModel) => {
            const keyFields: string[] = header.keyFields.split(',').map((key: string) => key.trim());
            return keyFields.indexOf(columnKey) !== -1;
        });
    }

    private getColumnIndex(headerCell: HTMLElement): number {
        return Array.from(headerCell.parentElement.children).indexOf(headerCell);
    }

    private isColumnVisible(column: ColumnsModel): boolean {
        return this.parent.enableVirtualization
            ? this.parent.virtualLayoutModule.isColumnVisible(column)
            : this.parent.layoutModule.isColumnVisible(column);
    }

    private getVisibleColumns(columns: ColumnsModel[]): { column: ColumnsModel, index: number }[] {
        return columns
            .map((column: ColumnsModel, index: number) => ({ column, index }))
            .filter(({ column }: { column: ColumnsModel }) => this.isColumnVisible(column));
    }

    private reorderColumns(fromIndex: number, toIndex: number): void {
        const visibleColumns: { column: ColumnsModel; index: number; }[] = this.getVisibleColumns(this.parent.columns);
        const sourceIndex: number = visibleColumns[fromIndex as number].index;
        const targetIndex: number = visibleColumns[toIndex as number].index;
        const columns: ColumnsModel[] = this.parent.columns.slice();
        const column: ColumnsModel = columns.splice(sourceIndex, 1)[0];
        columns.splice(targetIndex, 0, column);
        this.parent.columns = columns;
        if (this.parent.enableVirtualization) {
            this.parent.virtualLayoutModule.refresh();
        } else {
            this.parent.layoutModule.refresh();
        }
    }

    private reorderStackedHeaders(sourceIndex: number, targetIndex: number): void {
        const stackedHeadersList: Array<StackedHeadersModel> = this.parent.stackedHeaders.slice();
        const movingStackedHeader: StackedHeadersModel = stackedHeadersList.splice(sourceIndex, 1)[0];
        stackedHeadersList.splice(targetIndex, 0, movingStackedHeader);
        this.parent.stackedHeaders = stackedHeadersList;
        const headerToColumnsMap: Map<string, Array<{ column: ColumnsModel, index: number }>> = new Map();
        stackedHeadersList.forEach((header: StackedHeadersModel): void => {
            const keyFields: string[] = header.keyFields.split(',').map((key: string): string => key.trim());
            headerToColumnsMap.set(header.keyFields, []);
            keyFields.forEach((keyField: string): void => {
                const columnIndex: number = this.parent.columns.findIndex((column: ColumnsModel): boolean =>
                    column.keyField.toString() === keyField);
                if (columnIndex !== -1) {
                    headerToColumnsMap.get(header.keyFields).push({
                        column: this.parent.columns[columnIndex as number],
                        index: columnIndex
                    });
                }
            });
        });
        const newColumnsArray: ColumnsModel[] = [];
        stackedHeadersList.forEach((header: StackedHeadersModel): void => {
            const columnsForHeader: Array<{ column: ColumnsModel, index: number }> = headerToColumnsMap.get(header.keyFields) || [];
            columnsForHeader.sort((a: { column: ColumnsModel, index: number }, b: { column: ColumnsModel, index: number }): number => {
                return a.index - b.index;
            });
            columnsForHeader.forEach((item: { column: ColumnsModel, index: number }): void => {
                newColumnsArray.push(item.column);
            });
        });
        this.parent.columns.forEach((column: ColumnsModel): void => {
            const isInStackedHeader: boolean = stackedHeadersList.some((header: StackedHeadersModel): boolean => {
                const keyFields: string[] = header.keyFields.split(',').map((key: string): string => key.trim());
                return keyFields.indexOf(column.keyField.toString()) !== -1;
            });
            if (!isInStackedHeader && newColumnsArray.indexOf(column) === -1) {
                newColumnsArray.push(column);
            }
        });
        this.parent.columns = newColumnsArray;
        if (this.parent.enableVirtualization) {
            this.parent.virtualLayoutModule.refresh();
        } else {
            this.parent.layoutModule.refresh();
        }
    }

    private resetDragState(): void {
        this.isDragging = false;
        if (this.dropIndicator) {
            this.dropIndicator.style.display = 'none';
        }
        if (this.skeletonElement) {
            this.skeletonElement.style.display = 'none';
        }
        if (this.draggedColumn) {
            removeClass([this.draggedColumn], ['e-kanban-dragging-header', 'e-dragged-header']);
        }
        if (this.contentCells && this.contentCells.length) {
            removeClass(this.contentCells, 'e-dragged-content');
        }
        this.draggedColumn = null;
        this.contentCells = null;
        this.isStackedHeader = false;
    }

    public unwireColumnDragEvents(headerCell: HTMLElement): void {
        if (!isNoU(headerCell)) {
            const ej2Instances: Record<string, any>[] = (headerCell as EJ2Instance).ej2_instances;
            if (!isNoU(ej2Instances) && ej2Instances.length > 0) {
                const dragInstance: Draggable = ej2Instances[0] as Draggable;
                if (dragInstance && !dragInstance.isDestroyed) {
                    dragInstance.destroy();
                }
            }
        }
        // Remove drop indicator if this is the last header being unwired
        if (this.dropIndicator && this.dropIndicator.parentElement) {
            remove(this.dropIndicator);
            this.dropIndicator = null;
        }
        this.resetDragState();
    }
}
