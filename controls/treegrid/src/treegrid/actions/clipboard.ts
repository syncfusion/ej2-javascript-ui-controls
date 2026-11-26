/**
 * clipboard.ts file
 */
import { TreeGrid } from '../base/treegrid';
import * as events from '../base/constant';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { BeforeCopyEventArgs, Clipboard as GridClipboard, ServiceLocator } from '@syncfusion/ej2-grids';
import { Column } from '../models';
/**
 * The `Clipboard` module is used to handle clipboard copy action.
 *
 * @hidden
 */
export class TreeClipboard extends GridClipboard {
    private treeGridParent: TreeGrid;
    private treeCopyContent: string = '';
    private copiedUniqueIdCollection: string[] = [];
    protected serviceLocator: ServiceLocator;
    constructor(parent?: TreeGrid, serviceLocator?: ServiceLocator) {
        super(parent.grid, serviceLocator);
        this.treeGridParent = parent;
        this.serviceLocator = serviceLocator;
    }
    protected setCopyData(withHeader?: boolean): void {
        const copyContent: string = 'copyContent';
        const getCopyData: string = 'getCopyData';
        const isSelect: string = 'isSelect';
        const uniqueID: string = 'uniqueID';
        const currentRecords: Object[] = this.treeGridParent.getCurrentViewRecords();
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this[`${copyContent}`] = '';
            const rows: Element[] = this.treeGridParent.grid.getRows();
            if (this.treeGridParent.selectionSettings.mode !== 'Cell') {
                const selectedIndexes: number[] = this.treeGridParent.getSelectedRowIndexes().sort((a: number, b: number) => {
                    return a - b;
                });
                for (let i: number = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.treeCopyContent += '\n';
                    }
                    const selectedRowIndex: number = selectedIndexes[parseInt(i.toString(), 10)];
                    const row: Element = rows[this.getRowElementIndex(rows, selectedRowIndex) as number];
                    if (!isNullOrUndefined(row) && !row.classList.contains('e-summaryrow')) {
                        const cells: HTMLElement[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
                        const uniqueid: string = this.treeGridParent.getSelectedRecords()[parseInt(i.toString(), 10) as number][`${uniqueID}`];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            if (this.treeGridParent.copyHierarchyMode === 'Parent' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.parentContentData(currentRecords, selectedRowIndex, rows, withHeader, i);
                            }
                            this[`${getCopyData}`](cells, false, '\t', withHeader);
                            this.treeCopyContent += this[`${copyContent}`];
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[`${copyContent}`] = '';
                            if (this.treeGridParent.copyHierarchyMode === 'Child' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.childContentData(currentRecords, selectedIndexes[parseInt(i.toString(), 10)], rows, withHeader);
                            }
                        }
                    }
                }
                if (withHeader) {
                    const headerTextArray : string[] = this.treeGridParent.getVisibleColumns().map((col: Column) => col.headerText);
                    this[`${getCopyData}`](headerTextArray, false, '\t', withHeader);
                    this.treeCopyContent = this[`${copyContent}`] + '\n' + this.treeCopyContent;
                }
                const args: BeforeCopyEventArgs = {
                    data: this.treeCopyContent,
                    cancel: false
                };
                this.treeGridParent.trigger(events.beforeCopy, args);
                if (args.cancel) {
                    return;
                }
                this.clipBoardTextArea.value = this[`${copyContent}`] = args.data;
                if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    this.clipBoardTextArea.select();
                } else {
                    this.clipBoardTextArea.setSelectionRange(
                        0,
                        this.clipBoardTextArea.value.length
                    );
                }
                this[`${isSelect}`] = true;
                this.copiedUniqueIdCollection = [];
                this.treeCopyContent = '';
            } else {
                super.setCopyData(withHeader);
            }
        }
    }
    private parentContentData(currentRecords: Object[], selectedIndex: number, rows: Element[],
                              withHeader?: boolean, index?: number): void {
        const getCopyData: string = 'getCopyData';
        const copyContent: string = 'copyContent';
        const parentItem: string = 'parentItem';
        const uniqueID: string = 'uniqueID';
        const level: string = 'level';
        if (this.treeGridParent.enableVirtualization || this.treeGridParent.enableInfiniteScrolling) {
            currentRecords = this.treeGridParent.flatData;
        }
        if (!isNullOrUndefined(currentRecords[parseInt(selectedIndex.toString(), 10)]) &&
            !isNullOrUndefined(currentRecords[parseInt(selectedIndex.toString(), 10)][`${parentItem}`])) {
            const treeLevel: number = currentRecords[parseInt(selectedIndex.toString(), 10)][`${parentItem}`][`${level}`];
            for (let i: number = 0; i < treeLevel + 1; i++) {
                for (let j: number = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(currentRecords[parseInt(selectedIndex.toString(), 10)][`${parentItem}`]) &&
                        currentRecords[parseInt(j.toString(), 10)][`${uniqueID}`] === currentRecords[parseInt(selectedIndex.toString(), 10)][`${parentItem}`][`${uniqueID}`]) {
                        selectedIndex = j;
                        const rowIndex: number = this.getRowElementIndex(rows, selectedIndex);
                        const parentRow: Element = rows[rowIndex as number];
                        const cells: HTMLElement[] | string[] = !isNullOrUndefined(parentRow) && !parentRow.classList.contains('e-summaryrow') ?
                            [].slice.call(parentRow.querySelectorAll('.e-rowcell')) :
                            this.getCopyCells(currentRecords[parseInt(selectedIndex.toString(), 10)]);
                        const uniqueid: string = currentRecords[parseInt(j.toString(), 10)][`${uniqueID}`];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            this[`${getCopyData}`](cells, false, '\t', withHeader);
                            if (index > 0) {
                                this.treeCopyContent = this.treeCopyContent + this[`${copyContent}`] + '\n';
                            } else {
                                this.treeCopyContent = this[`${copyContent}`] + '\n' + this.treeCopyContent;
                            }
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[`${copyContent}`] = '';
                            break;
                        }
                    }
                }
            }
        }
    }
    public copy(withHeader?: boolean): void {
        super.copy(withHeader);
    }
    public paste(data: string, rowIndex: number, colIndex: number): void {
        super.paste(data, rowIndex, colIndex);
    }
    /**
     * For internal use only - Get the module name.
     *
     * @private
     * @returns {string} Returns clipboard module name
     */
    protected getModuleName(): string {
        return 'clipboard';
    }
    /**
     * To destroy the clipboard
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        super.destroy();
    }

    private getCopyCells(record: Object): string[] {
        const cells: string[] = [];
        const columns: Column[] = this.treeGridParent.getVisibleColumns();
        for (let i: number = 0; i < columns.length; i++) {
            const value: Object = record[columns[parseInt(i.toString(), 10)].field];
            cells.push(isNullOrUndefined(value) ? '' : value.toString());
        }
        return cells;
    }

    private getRowElementIndex(rows: Element[], viewIndex: number): number {
        if (this.treeGridParent.enableVirtualization || this.treeGridParent.enableInfiniteScrolling) {
            return this.getRenderedIndex(rows, viewIndex);
        }
        let dataIndex: number = -1;
        for (let i: number = 0; i < rows.length; i++) {
            if (!rows[parseInt(i.toString(), 10)].classList.contains('e-summaryrow') &&
                !rows[parseInt(i.toString(), 10)].classList.contains('e-detailrow')) {
                dataIndex++;
            }
            if (dataIndex === viewIndex) {
                return i;
            }
        }
        return viewIndex;
    }

    private getRenderedIndex(rows: Element[], viewIndex: number): number {
        if (isNullOrUndefined(rows) || rows.length === 0) {
            return viewIndex;
        }
        const start: number = rows[0].getAttribute('aria-rowindex') ?
            parseInt(rows[0].getAttribute('aria-rowindex'), 10) - 1 : 0;
        return viewIndex - start;
    }

    private childContentData(currentRecords: Object[], selectedIndex: number, rows: Element[], withHeader?: boolean): void {
        const getCopyData: string = 'getCopyData';
        const copyContent: string = 'copyContent';
        const childRecords: string = 'childRecords';
        const hasChildRecords: string = 'hasChildRecords';
        const uniqueID: string = 'uniqueID';
        if (this.treeGridParent.enableVirtualization || this.treeGridParent.enableInfiniteScrolling) {
            currentRecords = this.treeGridParent.flatData;
        }
        if (!isNullOrUndefined(currentRecords[parseInt(selectedIndex.toString(), 10)]) &&
            currentRecords[parseInt(selectedIndex.toString(), 10)][`${hasChildRecords}`]) {
            const childData: Object[] = currentRecords[parseInt(selectedIndex.toString(), 10)][`${childRecords}`];
            for (let i: number = 0; i < childData.length; i++ ) {
                for (let j: number = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(childData[parseInt(i.toString(), 10)][`${uniqueID}`]) && currentRecords[parseInt(j.toString(), 10)][`${uniqueID}`] === childData[parseInt(i.toString(), 10)][`${uniqueID}`]) {
                        const childIndex: number = this.getRowElementIndex(rows, j);
                        if ((!isNullOrUndefined(rows[childIndex as number])) && !rows[childIndex as number].classList.contains('e-summaryrow')) {
                            const cells: HTMLElement[] = [].slice.call(rows[childIndex as number].querySelectorAll('.e-rowcell'));
                            const uniqueid: string = currentRecords[parseInt(j.toString(), 10)][`${uniqueID}`];
                            if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                                this[`${getCopyData}`](cells, false, '\t', withHeader);
                                this.treeCopyContent += ('\n' + this[`${copyContent}`]);
                                this[`${copyContent}`] = '';
                                this.copiedUniqueIdCollection.push(uniqueid);
                                this.childContentData(currentRecords, j, rows, withHeader);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}
