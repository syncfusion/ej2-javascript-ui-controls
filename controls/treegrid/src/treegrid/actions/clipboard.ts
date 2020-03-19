/**
 * clipboard.ts file
 */
import { TreeGrid } from '../base/treegrid';
import * as events from '../base/constant';
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { BeforeCopyEventArgs, Clipboard as GridClipboard } from '@syncfusion/ej2-grids';
/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
export class TreeClipboard extends GridClipboard {
    private treeGridParent: TreeGrid;
    private treeCopyContent: string = '';
    private copiedUniqueIdCollection: string[] = [];
    constructor(parent?: TreeGrid) {
        super(parent.grid);
        this.treeGridParent = parent;
    }
    protected setCopyData(withHeader?: boolean): void {
        let copyContent: string = 'copyContent';
        let getCopyData: string = 'getCopyData';
        let isSelect: string = 'isSelect';
        let uniqueID: string = 'uniqueID';
        let currentRecords: object[] = this.treeGridParent.getCurrentViewRecords();
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this[copyContent] = '';
            let rows: Element[] = this.treeGridParent.grid.getRows();
            if (this.treeGridParent.selectionSettings.mode !== 'Cell') {
                let selectedIndexes: number[] = this.treeGridParent.getSelectedRowIndexes().sort((a: number, b: number) => {
                    return a - b;
                });
                for (let i: number = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.treeCopyContent += '\n';
                    }
                    if (!rows[selectedIndexes[i] as number].classList.contains('e-summaryrow')) {
                        let cells: HTMLElement[] = [].slice.call(rows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell'));
                        let uniqueid: string = this.treeGridParent.getSelectedRecords()[i as number][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            if (this.treeGridParent.copyHierarchyMode === 'Parent' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.parentContentData(currentRecords, selectedIndexes[i], rows, withHeader, i);
                            }
                            this[getCopyData](cells, false, '\t', withHeader);
                            this.treeCopyContent += this[copyContent];
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[copyContent] = '';
                            if (this.treeGridParent.copyHierarchyMode === 'Child' || this.treeGridParent.copyHierarchyMode === 'Both') {
                                this.childContentData(currentRecords, selectedIndexes[i], rows, withHeader);
                            }
                        }
                    }
                }
                if (withHeader) {
                    let headerTextArray: string[] = [];
                    for (let i: number = 0; i < this.treeGridParent.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.treeGridParent.getVisibleColumns()[i].headerText;
                    }
                    this[getCopyData](headerTextArray, false, '\t', withHeader);
                    this.treeCopyContent = this[copyContent] + '\n' + this.treeCopyContent;
                }
                let args: BeforeCopyEventArgs = {
                    data: this.treeCopyContent,
                    cancel: false,
                };
                this.treeGridParent.trigger(events.beforeCopy, args);
                if (args.cancel) {
                    return;
                }
                this.clipBoardTextArea.value = this[copyContent] = args.data;
                if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    this.clipBoardTextArea.select();
                } else {
                    this.clipBoardTextArea.setSelectionRange(
                        0,
                        this.clipBoardTextArea.value.length
                    );
                }
                this[isSelect] = true;
                this.copiedUniqueIdCollection = [];
                this.treeCopyContent = '';
            } else {
                super.setCopyData(withHeader);
            }
        }
    }
    private parentContentData(currentRecords: object[], selectedIndex: number, rows: Element[],
                              withHeader?: boolean, index?: number): void {
        let getCopyData: string = 'getCopyData';
        let copyContent: string = 'copyContent';
        let parentItem: string = 'parentItem';
        let uniqueID: string = 'uniqueID';
        let level: string = 'level';
        if (!isNullOrUndefined(currentRecords[selectedIndex][parentItem])) {
            let treeLevel: number = currentRecords[selectedIndex][parentItem][level];
            for (let i: number = 0; i < treeLevel + 1; i++) {
                for (let j: number = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(currentRecords[selectedIndex][parentItem]) &&
                        currentRecords[j][uniqueID] === currentRecords[selectedIndex][parentItem][uniqueID]) {
                        selectedIndex = j;
                        let cells: HTMLElement[] = [].slice.call(rows[selectedIndex].querySelectorAll('.e-rowcell'));
                        let uniqueid: string = currentRecords[j][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            this[getCopyData](cells, false, '\t', withHeader);
                            if (index > 0) {
                                this.treeCopyContent = this.treeCopyContent + this[copyContent] + '\n';
                            } else {
                                this.treeCopyContent = this[copyContent] + '\n' + this.treeCopyContent;
                            }
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this[copyContent] = '';
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
     * @private
     */
    protected getModuleName(): string {
        return 'clipboard';
    };
    /**
     * To destroy the clipboard 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        super.destroy();
    }

    private childContentData(currentRecords: object[], selectedIndex: number, rows: Element[], withHeader?: boolean): void {
        let getCopyData: string = 'getCopyData';
        let copyContent: string = 'copyContent';
        let childRecords: string = 'childRecords';
        let hasChildRecords: string = 'hasChildRecords';
        let uniqueID: string = 'uniqueID';
        if (currentRecords[selectedIndex][hasChildRecords]) {
            let childData: object[] = currentRecords[selectedIndex][childRecords];
            for (let i: number = 0; i < childData.length; i++ ) {
                for (let j: number = 0; j < currentRecords.length; j++) {
                    if (!isNullOrUndefined(childData[i][uniqueID]) && currentRecords[j][uniqueID] === childData[i][uniqueID]) {
                        if ((!isNullOrUndefined(rows[j])) && !rows[j].classList.contains('e-summaryrow')) {
                            let cells: HTMLElement[] = [].slice.call(rows[j].querySelectorAll('.e-rowcell'));
                            let uniqueid: string = currentRecords[j][uniqueID];
                            if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                                this[getCopyData](cells, false, '\t', withHeader);
                                this.treeCopyContent += ('\n' + this[copyContent]);
                                this[copyContent] = '';
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