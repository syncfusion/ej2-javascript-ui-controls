import { Browser, isNullOrUndefined, createElement, classList } from '@syncfusion/ej2-base';
import { SfTreeGrid } from './sf-treegrid-fn';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */

export class Clipboard {
    //Internal variables 
    protected clipBoardTextArea: HTMLInputElement;
    //Module declarations
    private parent: SfTreeGrid;
    private treeCopyContent: string = '';
    /* tslint:disable-next-line */
    private gridClipboard: any;
    private copiedUniqueIdCollection: string[] = [];

    constructor(parent?: SfTreeGrid) {
        this.parent = parent;
        this.gridClipboard = this.parent.grid.clipboardModule;
        this.clipBoardTextArea = createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard', 'aria-hidden': 'true' }
        }) as HTMLInputElement;
        this.parent.element.appendChild(this.clipBoardTextArea);
    }

    public copy(withHeader?: boolean): void {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
        }
        if (this.gridClipboard.isSelect) {
            window.getSelection().removeAllRanges();
            this.gridClipboard.isSelect = false;
        }
    }

    protected setCopyData(withHeader?: boolean): void {
        let copyContent: string = 'copyContent';
        let getCopyData: string = 'getCopyData';
        let isSelect: string = 'isSelect';
        let uniqueID: string = 'uniqueID';
        let currentRecords: object[] = this.parent.options.currentViewData;
        if (window.getSelection().toString() === '') {
            this.clipBoardTextArea.value = this.gridClipboard[copyContent] = '';
            let rows: Element[] = this.parent.grid.getRows();
            if (this.parent.grid.selectionMode !== 'Cell') {
                let selectedIndexes: number[] = this.parent.grid.getSelectedRowIndexes().sort((a: number, b: number) => {
                    return a - b;
                });
                for (let i: number = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.treeCopyContent += '\n';
                    }
                    if (!rows[selectedIndexes[i] as number].classList.contains('e-summaryrow')) {
                        let cells: HTMLElement[] = [].slice.call(rows[selectedIndexes[i] as number].querySelectorAll('.e-rowcell'));
                        let uniqueid: string = this.parent.options.currentViewData[selectedIndexes[i] as number][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            if (this.parent.options.copyHierarchyMode === 'Parent' || this.parent.options.copyHierarchyMode === 'Both') {
                                this.parentContentData(currentRecords, selectedIndexes[i], rows, withHeader, i);
                            }
                            this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                            this.treeCopyContent += this.gridClipboard[copyContent];
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this.gridClipboard[copyContent] = '';
                            if (this.parent.options.copyHierarchyMode === 'Child' || this.parent.options.copyHierarchyMode === 'Both') {
                                this.childContentData(currentRecords, selectedIndexes[i], rows, withHeader);
                            }
                        }
                    }
                }
                if (withHeader) {
                    let headerTextArray: string[] = [];
                    for (let i: number = 0; i < this.parent.grid.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.parent.grid.getVisibleColumns()[i].headerText;
                    }
                    this.gridClipboard[getCopyData](headerTextArray, false, '\t', withHeader);
                    this.treeCopyContent = this.gridClipboard[copyContent] + '\n' + this.treeCopyContent;
                }
                this.clipBoardTextArea.value = this.gridClipboard[copyContent] = this.treeCopyContent;
                if (!Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    window.getSelection().removeAllRanges();
                    this.clipBoardTextArea.select();
                } else {
                    this.clipBoardTextArea.setSelectionRange(
                        0,
                        this.clipBoardTextArea.value.length
                    );
                }
                this.gridClipboard[isSelect] = true;
                this.copiedUniqueIdCollection = [];
                this.treeCopyContent = '';
            }
        }
    }
    private parentContentData(currentRecords: object[], selectedIndex: number, rows: Element[],
                              withHeader?: boolean, index?: number): void {
        let getCopyData: string = 'getCopyData';
        let copyContent: string = 'copyContent';
        let parentItem: string = 'parentRecord';
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
                            this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                            if (index > 0) {
                                this.treeCopyContent = this.treeCopyContent + this.gridClipboard[copyContent] + '\n';
                            } else {
                                this.treeCopyContent = this.gridClipboard[copyContent] + '\n' + this.treeCopyContent;
                            }
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this.gridClipboard[copyContent] = '';
                            break;
                        }
                    }
                }
            }
        }
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
                                this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                                this.treeCopyContent += ('\n' + this.gridClipboard[copyContent]);
                                this.gridClipboard[copyContent] = '';
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
