/* eslint-disable  */
import { RevisionType } from '../../base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';
import { ElementBox, ParagraphWidget, TableRowWidget, TableWidget, TableCellWidget } from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import { WRowFormat } from '../format/row-format';
import { Selection, TextPosition } from '../selection';
import { ParagraphInfo } from '../editor/editor-helper';
import { BaseHistoryInfo, EditorHistory } from '../editor-history';
/**
 * The revision class which holds the information related to changes made in the document
 */
export class Revision {
    /**
     * Gets or sets the author name who made the change
     *
     * @private
     */
    public author: string = null;
    /**
     * Indicates when the track changes made
     *
     * @private
     */
    public date: string = null;
    /**
     * Indicates the type of track changes revision
     *
     * @private
     */
    public revisionType: RevisionType;
    /**
     * Holds the reference of the items which are under this revision.
     *
     * @private
     */
    public range: object[] = [];
    /**
     * @private
     */
    public revisionID: string = '';
    private owner: DocumentEditor;
    /**
     * Used to update cursor position by ensuring items were removed or not
     */
    private isContentRemoved: boolean = false;
    private isTableRevision: boolean = false;
    /**
     * Indicates whether to skip unlinking ranges for table elements.
     */
    private canSkipTableItems: boolean = false;
    private skipUnLinkElement: boolean = false;

    public constructor(documentHelper: DocumentEditor, author: string, date: string) {
        this.author = author;
        this.date = date;
        this.owner = documentHelper;
    }

    private handleAcceptReject(isFromAccept: boolean): void {
        this.owner.selection.selectRevision(this);
        const selection: Selection = this.owner.selection;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        let blockInfo: ParagraphInfo = selection.getParagraphInfo(startPos);
        this.owner.editor.initHistory(isFromAccept ? 'Accept Change' : 'Reject Change');
        if (this.revisionType === 'Deletion') {
            blockInfo = selection.getParagraphInfo(this.owner.selection.start);
            selection.editPosition = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        } else {
            selection.editPosition = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        this.owner.editor.updateInsertPosition();
        this.isContentRemoved = false;
        this.canSkipTableItems = false;
        this.skipUnLinkElement = false;
        // Implement to accept/reject the revision
        if (this.revisionType === 'Insertion' || this.revisionType === 'Deletion' || this.revisionType === 'MoveFrom' || this.revisionType === 'MoveTo') {
            let rangeIndex: number = 0;
            while (this.range.length > 0) {
                if (this.range[rangeIndex] instanceof ElementBox || this.range[rangeIndex] instanceof WCharacterFormat || this.range[rangeIndex] instanceof WRowFormat) {
                    const moveToNextItem: boolean = this.unlinkRangeItem(this.range[rangeIndex] as ElementBox, this, isFromAccept);
                    if (moveToNextItem) {
                        rangeIndex++;
                    } else {
                        rangeIndex = 0;
                    }
                } else {
                    break;
                }
            }
        }
        this.isTableRevision = false;
        if (this.isContentRemoved) {
            const textPosition: TextPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
            this.owner.selection.selectContent(textPosition, true);
            this.owner.editor.updateEndPosition();
        } else {
            selection.selectRange(startPos, endPos);
            this.owner.editor.updateHistoryPosition(endPos, false);
        }
        if (this.owner.editorHistory && this.owner.editorHistory.currentBaseHistoryInfo.action !== 'BackSpace') {
            this.owner.editorHistory.currentBaseHistoryInfo.removedNodes.reverse();
        }
        if (this.owner.editorHistory) {
            if (this.owner.trackChangesPane.isTrackingPageBreak) {
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'TrackingPageBreak';
            }
            let editorHistory: EditorHistory = this.owner.editorHistory;
            if (editorHistory.currentHistoryInfo && (editorHistory.currentHistoryInfo.action === 'Accept All' || editorHistory.currentHistoryInfo.action === 'Reject All')) {
                if (this.owner.documentHelper.blockToShift) {
                    this.owner.documentHelper.layout.shiftLayoutedItems(false);
                }
            }
            editorHistory.updateHistory();
        }
        this.owner.editor.reLayout(this.owner.selection);
    }

    /**
     * Method which accepts the selected revision, revision marks will be removed and changes will be included in the viewer.
     *
     * @returns {void}
     */
    public accept(): void {
        this.handleAcceptReject(true);
    }
    /**
     * Method which rejects the selected revision, revision marks will be removed leaving the original content.
     */
    public reject(): void {
        this.handleAcceptReject(false);
    }
    /**
     * Unlinks revision and its assosiated range 
     * @private
     * @param item 
     * @param revision 
     * @param isFromAccept 
     */
    /* eslint-disable  */
    public unlinkRangeItem(item: any, revision: Revision, isFromAccept: boolean): boolean {
        if (this.isTableRevision) {
            this.removeRangeRevisionForItem(item);
            if (revision.range.length === 0) {
                this.owner.revisions.remove(revision);
            }
            return false;
        }
        let removeChanges: boolean = (!isNullOrUndefined(isFromAccept)) && ((revision.revisionType === 'MoveFrom' || revision.revisionType === 'Deletion') && isFromAccept ) || ((revision.revisionType === 'Insertion' || revision.revisionType === 'MoveTo') && !isFromAccept);
        if (this.owner.selection.isTOC()) {
            if (removeChanges) {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
                if (revision.range.length === 0) {
                    this.owner.revisions.remove(revision);
                }
                this.isContentRemoved = true;
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'BackSpace';
            } else {
                while (this.range.length > 0) {
                    let currentElement: ElementBox = this.range[0] as ElementBox;
                    this.removeRangeRevisionForItem(currentElement);
                    if (revision.range.length === 0) {
                        this.owner.revisions.remove(revision);
                    }
                }
                this.owner.editor.addRemovedNodes(this.revisionID);
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'AcceptTOC';
            }
            return false;
        }
        if (item instanceof ElementBox && !this.canSkipTableItems) {
            if (removeChanges) {
                if (!this.skipeElementRemoval(item)) {
                    this.owner.editor.addRemovedNodes(item.clone());
                } else {
                    this.skipUnLinkElement = true;
                    return true;
                }
            } else {
                this.owner.editorHistory.currentBaseHistoryInfo.action = 'ClearRevisions';
                this.updateRevisionID();
            }
        } else if (!this.canSkipTableItems && (item instanceof WCharacterFormat) && (!removeChanges)) {
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'ClearRevisions';
            this.updateRevisionID();
        } else if (item instanceof WRowFormat && !removeChanges) {
            this.isTableRevision = true;
            let tableWidget: TableWidget = (item as WRowFormat).ownerBase.ownerTable;
            let currentRow: TableRowWidget = item.ownerBase as TableRowWidget;
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'RemoveRowTrack';
            this.owner.editor.cloneTableToHistoryInfo(tableWidget);
        }

        removeChanges = removeChanges && !this.canSkipTableItems;
        if (item instanceof ElementBox && removeChanges) {
            let currentPara: ParagraphWidget = item.line.paragraph;
            this.removeRevisionItemsFromRange(item);
            this.removeItem(item);
            this.isContentRemoved = true;
            this.owner.documentHelper.layout.reLayoutParagraph(currentPara, 0, 0);
        } else if (item instanceof WCharacterFormat && removeChanges) {
            this.isContentRemoved = true;
            this.skipUnLinkElement = false;
            this.removeRevisionItemsFromRange(item);
            if (revision.range.length === 1) {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
            } else {
                this.owner.editor.deleteSelectedContents(this.owner.selection, true);
                let rangeIndex: number = revision.range.indexOf(item);
                revision.range.splice(rangeIndex, 1);
                while (this.range.length > 0) {
                    this.removeRangeRevisionForItem(this.range[0]);
                }
            }
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'BackSpace';
        } else if (item instanceof WRowFormat && removeChanges) {
            let tableWidget: TableWidget = (item as WRowFormat).ownerBase.ownerTable;
            let currentRow: TableRowWidget = item.ownerBase as TableRowWidget;
            this.removeRevisionItemsFromRange(item);
            this.owner.editorHistory.currentBaseHistoryInfo.action = 'DeleteCells';
            this.owner.editor.cloneTableToHistoryInfo(tableWidget);
            this.owner.editor.removeDeletedCellRevision(currentRow);
            this.isContentRemoved = true;
            tableWidget.removeChild(tableWidget.childWidgets.indexOf(currentRow));
            this.canSkipTableItems = true;
            currentRow.destroy();
            if (tableWidget.childWidgets.length === 0) {
                this.owner.selection.editPosition = this.owner.selection.getHierarchicalIndex(tableWidget, '0');
                this.owner.editor.removeBlock(tableWidget);
                tableWidget.destroy();
            } else {
                this.owner.editor.updateTable(tableWidget);
            }
        }
        // if the range is of row format, we will remove the row and for history preservation we use whole table to be cloned, hence skipping this part
        if (!(item instanceof WRowFormat) || !removeChanges) {
            if (!this.skipUnLinkElement) {
                this.removeRangeRevisionForItem(item);
            }
        }
        if (revision.range.length === 0) {
            this.owner.revisions.remove(revision);
        }
        return false;
    }
    private updateRevisionID(): void {
        this.owner.editor.addRemovedNodes(this.revisionID);
        while (this.range.length > 0) {
            this.removeRangeRevisionForItem(this.range[0]);
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private removeRevisionItemsFromRange(item: any): void {
        if (item.revisions.length > 0) {
            for (let revisionIndex: number = 0; revisionIndex < item.revisions.length; revisionIndex++) {
                let currentRevision: Revision = item.revisions[revisionIndex];
                if (this.revisionID !== currentRevision.revisionID) {
                    let rangeIndex: number = currentRevision.range.indexOf(item);
                    item.revisions[revisionIndex].range.splice(rangeIndex, 1);
                }
                if (currentRevision.range.length === 0) {
                    this.owner.revisions.remove(currentRevision);
                }
            }
        }
    }
    /**
     * Method to clear linked ranges in revision
     *
     * @private
     * @param {any} item - Specifies the item
     * @returns {void}
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public removeRangeRevisionForItem(item: any): void {
        let revisionIndex: number = item.revisions.indexOf(this);
        if (revisionIndex >= 0) {
            item.revisions.splice(revisionIndex, 1);
            let rangeIndex: number = this.range.indexOf(item);
            this.range.splice(rangeIndex, 1);
        }
    }
    /**
     * @private
     * @param {Element} element - Specifies the element.
     * @returns {boolean} Resturs skip element removal
     */
    public skipeElementRemoval(element: ElementBox): boolean {
        let elementPara: ParagraphWidget = element.paragraph;
        if (elementPara.characterFormat.revisions.length > 0) {
            for (let i: number = 0; i < elementPara.characterFormat.revisions.length; i++) {
                let currentRevision: Revision = elementPara.characterFormat.revisions[i];
                let rangeIndex: number = currentRevision.range.indexOf(element);
                if (rangeIndex >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    private removeRevisionFromRow(row: TableRowWidget): void {
        this.owner.editor.unlinkRangeFromRevision(row.rowFormat);
        //this.owner.editor.addRemovedRevisionInfo(row.rowFormat, undefined);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            this.owner.editor.removeRevisionForCell(cellWidget, false);
        }
    }

    private removeItem(element: ElementBox): void {
        let paraWidget: ParagraphWidget = element.line.paragraph;
        this.owner.editor.unLinkFieldCharacter(element);
        let elementIndex: number = element.line.children.indexOf(element);
        element.line.children.splice(elementIndex, 1);
        this.owner.editor.removeEmptyLine(paraWidget);
    }

    private canSkipCloning(): boolean {
        if (!isNullOrUndefined(this.owner) && this.owner.editorHistory && this.owner.editorHistory.currentBaseHistoryInfo) {
            let baseHistoryInfo: BaseHistoryInfo = this.owner.editorHistory.currentBaseHistoryInfo;
            if (baseHistoryInfo.action === 'DeleteCells') {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * @returns {Revision} - Returns revision
     */
    public clone(): Revision {
        if (this.canSkipCloning()) {
            return this;
        }

        let revision: Revision = new Revision(undefined, this.author, this.date);
        revision.revisionID = this.revisionID;
        revision.revisionType = this.revisionType;
        return revision;
    }
    /**
     * Method to clone the revisions for the element
     * 
     * @param {Revision[]} revisions - revision array.
     * @returns {string[]} - returns clones revisions.
     */
    public static cloneRevisions(revisions: Revision[]): string[] {
        let clonedRevisions: string[] = [];
        for (let i: number = 0; i < revisions.length; i++) {
            clonedRevisions.push(revisions[i].revisionID);
        }
        return clonedRevisions;
    }

}
/**
 * Represents the revision collections in the document.
 */
export class RevisionCollection {

    /**
     * @private
     */
    public changes: Revision[] = [];
    private owner: DocumentEditor;

    /**
     * @private
     */
    public get(index: number): Revision {
        if (index >= this.changes.length || index < 0) {
            throw new ReferenceError('Provided index is not within the range');
        }
        return this.changes[index];
    }

    public get length(): number {
        return this.changes.length;
    }

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }

    public remove(revision: Revision): any {
        if (isNullOrUndefined(revision) || this.changes.indexOf(revision) < 0) {
            return;
        }
        this.changes.splice(this.changes.indexOf(revision), 1);
    }

    /**
     * Method which accepts all the revision in the revision collection
     *
     * @returns {void}
     */
    public acceptAll(): void {
        if (!this.owner.isReadOnly) {
            this.handleRevisionCollection(true);
        }
    }
    /**
     * Method which rejects all the revision in the revision collection
     *
     * @returns {void}
     */
    public rejectAll(): void {
        if (!this.owner.isReadOnly) {
            this.handleRevisionCollection(false);
        }
    }

    /**
     * @private
     * @param {boolean} isfromAcceptAll - Specifies the is accept all.
     * @param {Revision[]} changes - Specifies the revisions.
     * @returns {void}
     */
    public handleRevisionCollection(isfromAcceptAll: boolean, changes?: Revision[]): void {
        let selection: Selection = this.owner.selection;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        startPos = startPos.clone();
        endPos = endPos.clone();
        if (isfromAcceptAll) {
            this.owner.editor.initComplexHistory('Accept All');
        } else {
            this.owner.editor.initComplexHistory('Reject All');
        }
        let revisionCollec: Revision[] = changes ? changes : this.changes;
        while (revisionCollec.length > 0) {
            if (isfromAcceptAll) {
                revisionCollec[0].accept();
            } else {
                revisionCollec[0].reject();
            }
            if (changes) {
                revisionCollec.splice(0, 1);
            }
        }
        let textPosition: TextPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
        this.owner.selection.selectContent(textPosition, true);
        if (this.owner.editorHistory) {
            this.owner.editorHistory.updateComplexHistory();
        }
        this.owner.editor.reLayout(this.owner.selection, false);
    }

    public destroy(): void {
        this.changes = [];
    }
}