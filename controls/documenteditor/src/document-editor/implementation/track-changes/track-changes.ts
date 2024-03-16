/* eslint-disable  */
import { RevisionType, RevisionActionType } from '../../base/types';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';
import { ShapeBase, ElementBox, ParagraphWidget, TableRowWidget, TableWidget, TableCellWidget, BookmarkElementBox, FootnoteElementBox, Widget, BlockWidget } from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import { WRowFormat } from '../format/row-format';
import { Selection, TextPosition } from '../selection';
import { ParagraphInfo } from '../editor/editor-helper';
import { BaseHistoryInfo, EditorHistory } from '../editor-history';
import { RevisionActionEventArgs, revisionActionEvent } from '../../base/index';
import { ChangesSingleView } from '../track-changes/track-changes-pane';

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
        if(isNullOrUndefined(this.author)) {
            this.author = "Unknown";
        }
        this.date = date;
        this.owner = documentHelper;
    }

    private handleAcceptReject(isFromAccept: boolean): void {
        this.owner.selectionModule.selectRevision(this);
        const selection: Selection = this.owner.selectionModule;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        let blockInfo: ParagraphInfo = selection.getParagraphInfo(startPos);
        this.owner.editorModule.initHistory(isFromAccept ? 'Accept Change' : 'Reject Change');
        this.owner.editorHistoryModule.currentBaseHistoryInfo.markerData.push(this.owner.editorModule.getMarkerData(undefined, undefined, this));
        if (this.revisionType === 'Deletion') {
            blockInfo = selection.getParagraphInfo(this.owner.selectionModule.start);
            selection.editPosition = this.owner.selectionModule.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        } else {
            selection.editPosition = this.owner.selectionModule.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        this.owner.editorModule.updateInsertPosition();
        this.isContentRemoved = false;
        this.canSkipTableItems = false;
        this.skipUnLinkElement = false;
        // Implement to accept/reject the revision
        if (this.revisionType === 'Insertion' || this.revisionType === 'Deletion' || this.revisionType === 'MoveFrom' || this.revisionType === 'MoveTo') {
            this.owner.isShiftingEnabled = true;
            let rangeIndex: number = 0;
            while (this.range.length > 0) {
                if (this.range[rangeIndex] instanceof ElementBox || this.range[rangeIndex] instanceof WCharacterFormat || this.range[rangeIndex] instanceof WRowFormat) {
                    if (this.range[rangeIndex] instanceof BookmarkElementBox && isFromAccept && this.revisionType === 'Deletion') {
                        let inline: BookmarkElementBox = this.range[rangeIndex] as BookmarkElementBox;
                        if (this.owner.documentHelper.bookmarks.containsKey(inline.name)) {
                            this.owner.documentHelper.bookmarks.remove(inline.name);
                        }
                    }
                    const moveToNextItem: boolean = this.unlinkRangeItem(this.range[rangeIndex] as ElementBox, this, isFromAccept, startPos, endPos);
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
            this.owner.selectionModule.selectContent(textPosition, true);
            this.owner.editorModule.updateEndPosition();
        } else {
            selection.selectRange(startPos, endPos);
            this.owner.editorModule.updateHistoryPosition(endPos, false);
        }
        if (this.owner.editorHistoryModule && this.owner.editorHistoryModule.currentBaseHistoryInfo.action !== 'BackSpace') {
            this.owner.editorHistoryModule.currentBaseHistoryInfo.removedNodes.reverse();
        }
        if (this.owner.editorHistoryModule) {
            if (this.owner.trackChangesPane.isTrackingPageBreak) {
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'TrackingPageBreak';
            }
            let editorHistory: EditorHistory = this.owner.editorHistoryModule;
            if (editorHistory.currentHistoryInfo && (editorHistory.currentHistoryInfo.action === 'Accept All' || editorHistory.currentHistoryInfo.action === 'Reject All')) {
                if (this.owner.documentHelper.blockToShift) {
                    this.owner.documentHelper.layout.shiftLayoutedItems(false);
                }
            }
            editorHistory.updateHistory();
        }
        this.owner.editorModule.reLayout(this.owner.selectionModule);
        if (blockInfo.paragraph.isInHeaderFooter) {
            this.owner.editorModule.updateHeaderFooterWidget();
        }
    }
    private handleGroupAcceptReject(isAccept?: boolean): void {
        if (this.owner.trackChangesPane.tableRevisions.containsKey(this)) {
            this.owner.editorModule.initComplexHistory(isAccept? 'Accept All': 'Reject All');
            let groupingAcceptReject: Revision[] = this.owner.trackChangesPane.tableRevisions.get(this);
            for (let i: number = groupingAcceptReject.length - 1; i >= 0; i--) {
                if (isAccept) {
                    groupingAcceptReject[i].handleAcceptReject(true);
                } else {
                    groupingAcceptReject[i].handleAcceptReject(false);
                }
            }
            if (this.owner.editorHistoryModule) {
                this.owner.editorHistoryModule.updateComplexHistory();
            }
        }
    }
    /**
     * Method which accepts the selected revision, revision marks will be removed and changes will be included in the viewer.
     *
     * @returns {void}
     */
    public accept(): void {
        const eventArgs: RevisionActionEventArgs = { author: this.author, cancel: false, revisionType: this.revisionType, actionType: 'Accept' };
        this.owner.trigger(revisionActionEvent, eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (!this.owner.documentHelper.isTrackedOnlyMode) {
            if (!this.owner.revisions.skipGroupAcceptReject && this.range[0] instanceof WRowFormat
                && this.owner.trackChangesPane.tableRevisions.containsKey(this)) {
                this.handleGroupAcceptReject(true);
            } else {
                this.handleAcceptReject(true);
            }
        }
    }
    /**
     * Method which rejects the selected revision, revision marks will be removed leaving the original content.
     */
    public reject(): void {
        const eventArgs: RevisionActionEventArgs = { author: this.author, cancel: false, revisionType: this.revisionType, actionType: 'Reject' };
        this.owner.trigger(revisionActionEvent, eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        if (!this.owner.documentHelper.isTrackedOnlyMode) {
            if (!this.owner.revisions.skipGroupAcceptReject && this.range[0] instanceof WRowFormat
                && this.owner.trackChangesPane.tableRevisions.containsKey(this)) {
                this.handleGroupAcceptReject(false);
            } else {
                this.handleAcceptReject(false);
            }
        }
    }
    /**
     * Unlinks revision and its assosiated range 
     * @private
     * @param item 
     * @param revision 
     * @param isFromAccept 
     */
    /* eslint-disable  */
    public unlinkRangeItem(item: any, revision: Revision, isFromAccept: boolean, start: TextPosition, end: TextPosition): boolean {
        if (this.isTableRevision) {
            this.removeRangeRevisionForItem(item);
            if (revision.range.length === 0) {
                this.owner.revisions.remove(revision);
            }
            return false;
        }
        let removeChanges: boolean = (!isNullOrUndefined(isFromAccept)) && ((revision.revisionType === 'MoveFrom' || revision.revisionType === 'Deletion') && isFromAccept ) || ((revision.revisionType === 'Insertion' || revision.revisionType === 'MoveTo') && !isFromAccept);
        if (this.owner.selectionModule.isTOC()) {
            if (removeChanges) {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
                if (revision.range.length === 0) {
                    this.owner.revisions.remove(revision);
                }
                this.isContentRemoved = true;
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'BackSpace';
            } else {
                while (this.range.length > 0) {
                    let currentElement: ElementBox = this.range[0] as ElementBox;
                    this.removeRangeRevisionForItem(currentElement);
                    if (revision.range.length === 0) {
                        this.owner.revisions.remove(revision);
                    }
                }
                this.owner.editorModule.addRemovedNodes(this.revisionID);
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'AcceptTOC';
            }
            return false;
        }
        if (item instanceof ElementBox && !this.canSkipTableItems) {
            if (removeChanges) {
                if (!this.skipeElementRemoval(item)) {
                    this.owner.editorModule.addRemovedNodes(item.clone());
                } else {
                    this.skipUnLinkElement = true;
                    return true;
                }
            } else {
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'ClearRevisions';
                this.updateRevisionID();
                this.removeRevisionFromPara(start, end);
                // Set false to this because we retrived the revision based on above action (after this iteration we have changed the action basded the below property)
                this.owner.trackChangesPane.isTrackingPageBreak = false;
            }
        } else if (!this.canSkipTableItems && (item instanceof WCharacterFormat) && (!removeChanges)) {
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'ClearRevisions';
            this.updateRevisionID();
            this.removeRevisionFromPara(start, end);
        } else if (item instanceof WRowFormat && !removeChanges) {
            this.isTableRevision = true;
            let tableWidget: TableWidget = (item as WRowFormat).ownerBase.ownerTable;
            let currentRow: TableRowWidget = item.ownerBase as TableRowWidget;
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'RemoveRowTrack';
            this.owner.editorModule.cloneTableToHistoryInfo(tableWidget);
        }

        removeChanges = removeChanges && !this.canSkipTableItems;
        if (item instanceof ElementBox && removeChanges) {
            let currentPara: ParagraphWidget = item.line.paragraph;
            this.removeRevisionItemsFromRange(item);
            if (item instanceof FootnoteElementBox) {
                if (item.footnoteType === 'Footnote') {
                    this.owner.editorModule.removeFootnote(item);
                }
            }
            this.removeItem(item);
            this.isContentRemoved = true;
            this.owner.documentHelper.layout.reLayoutParagraph(currentPara, 0, 0);
            if (isNullOrUndefined(currentPara.childWidgets)) {
                const textPosition: TextPosition = this.owner.selectionModule.getTextPosBasedOnLogicalIndex(this.owner.selectionModule.editPosition);
                this.owner.selectionModule.selectContent(textPosition, true);
            }
        } else if (item instanceof WCharacterFormat && removeChanges) {
            this.isContentRemoved = true;
            this.skipUnLinkElement = false;
            this.removeRevisionItemsFromRange(item);
            if (revision.range.length === 1) {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
            } else {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
                this.removeRevisionFromPara(start, end);
                let rangeIndex: number = revision.range.indexOf(item);
                revision.range.splice(rangeIndex, 1);
                this.owner.trackChangesPane.updateCurrentTrackChanges(revision);
                while (this.range.length > 0) {
                    this.removeRangeRevisionForItem(this.range[0]);
                }
            }
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'BackSpace';
            this.owner.editorHistoryModule.currentBaseHistoryInfo.isAcceptOrReject = isFromAccept ? 'Accept' : 'Reject';
        } else if (item instanceof WRowFormat && removeChanges) {
            let tableWidget: TableWidget = (item as WRowFormat).ownerBase.ownerTable;
            tableWidget = tableWidget.combineWidget(this.owner.viewer) as TableWidget;
            let currentRow: TableRowWidget = item.ownerBase as TableRowWidget;
            this.removeRevisionItemsFromRange(item);
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'DeleteCells';
            this.owner.editorModule.cloneTableToHistoryInfo(tableWidget);
            this.owner.editorModule.removeDeletedCellRevision(currentRow);
            this.isContentRemoved = true;
            tableWidget.removeChild(tableWidget.childWidgets.indexOf(currentRow));
            this.canSkipTableItems = true;
            // Before destroying the table row widget, delete the field element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow);
            // Before destroying the table row widget, delete the bookmark element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow, true);
            // Before destroying the table row widget, delete the content control element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow, undefined, true);
            currentRow.destroy();
            if (tableWidget.childWidgets.length === 0) {
                this.owner.selectionModule.editPosition = this.owner.selectionModule.getHierarchicalIndex(tableWidget, '0');
                this.owner.editorModule.removeBlock(tableWidget);
                tableWidget.destroy();
            } else {
                this.owner.editorModule.updateTable(tableWidget, true);
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

    private removeRevisionFromPara(start: TextPosition, end: TextPosition): void {
        let blockInfo: ParagraphInfo = this.owner.selectionModule.getParagraphInfo(start);
        let endBlockInfo: ParagraphInfo = this.owner.selectionModule.getParagraphInfo(end);
        let para: ParagraphWidget = blockInfo.paragraph;
        while (para instanceof ParagraphWidget) {
            if (para.characterFormat.revisions.length > 0) {
                for (let i: number = 0; i < para.characterFormat.revisions.length; i++) {
                    if (para.characterFormat.revisions[i].range.length === 0) {
                        let revisionIndex: number = para.characterFormat.revisions.indexOf(para.characterFormat.revisions[i]);
                        para.characterFormat.revisions.splice(revisionIndex, 1);
                        i--;
                    }
                }
            }
            if (endBlockInfo.paragraph === para) {
                para = undefined;
            } else {
                para = para.nextWidget as ParagraphWidget;
            }
        }
    }

    private updateRevisionID(): void {
        this.owner.editorModule.addRemovedNodes(this.revisionID);
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
                    this.owner.trackChangesPane.updateCurrentTrackChanges(item.revisions[revisionIndex]);
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
            this.owner.trackChangesPane.updateCurrentTrackChanges(this);
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
        this.owner.editorModule.unlinkRangeFromRevision(row.rowFormat);
        //this.owner.editor.addRemovedRevisionInfo(row.rowFormat, undefined);
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            this.owner.editorModule.removeRevisionForCell(cellWidget, false);
        }
    }

    private removeItem(element: ElementBox): void {
        let paraWidget: ParagraphWidget = element.line.paragraph;
        this.owner.editorModule.unLinkFieldCharacter(element);
        let elementIndex: number = element.line.children.indexOf(element);
        element.line.children.splice(elementIndex, 1);
        let paraFloatingElementIndex: number = element.line.paragraph.floatingElements.indexOf(element as ShapeBase);
        element.line.paragraph.floatingElements.splice(paraFloatingElementIndex, 1);
        let blockFloatingElementIndex: number = element.line.paragraph.bodyWidget.floatingElements.indexOf(element as ShapeBase);
        if (blockFloatingElementIndex > -1) {
            element.line.paragraph.bodyWidget.floatingElements.splice(blockFloatingElementIndex, 1);
        }
        this.owner.editorModule.removeEmptyLine(paraWidget);
    }

    private canSkipCloning(): boolean {
        if (!isNullOrUndefined(this.owner) && this.owner.editorHistoryModule && this.owner.editorHistoryModule.currentBaseHistoryInfo) {
            let baseHistoryInfo: BaseHistoryInfo = this.owner.editorHistoryModule.currentBaseHistoryInfo;
            if (baseHistoryInfo.action === 'DeleteCells') {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     *
     */
    public destroy(): void {
        this.author = undefined;
        this.revisionType = undefined;
        this.revisionID = undefined;
        this.date = undefined;
        this.range = [];
        this.range = undefined;
        this.owner = undefined;
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
    public skipGroupAcceptReject: boolean = false;

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
        if (this.owner.trackChangesPane.revisions.indexOf(revision) !== -1) {
            let index: number = this.owner.trackChangesPane.revisions.indexOf(revision);
            let removeChild: boolean = !(this.owner.trackChangesPane.tableRevisions.containsKey(revision) && (this.owner.trackChangesPane.tableRevisions.get(revision))[(this.owner.trackChangesPane.tableRevisions.get(revision)).length -1] !== revision);
            let changesSingleView: ChangesSingleView = this.owner.trackChangesPane.changes.get(revision);
            if (removeChild) {
                this.owner.trackChangesPane.changesInfoDiv.removeChild(changesSingleView.outerSingleDiv);
            }
            this.owner.trackChangesPane.revisions.splice(index, 1);
            this.owner.trackChangesPane.changes.remove(revision);
            if (this.owner.trackChangesPane.renderedChanges.containsKey(revision)) {
                this.owner.trackChangesPane.renderedChanges.remove(revision);
            }
            if (this.owner.trackChangesPane.tableRevisions.containsKey(revision)) {
                this.owner.trackChangesPane.tableRevisions.remove(revision);
            }
        }
    }

    /**
     * Method which accepts all the revision in the revision collection
     *
     * @returns {void}
     */
    public acceptAll(): void {
        if (!this.owner.isReadOnly && !this.owner.documentHelper.isTrackedOnlyMode) {
            this.handleRevisionCollection(true);
        }
    }
    /**
     * Method which rejects all the revision in the revision collection
     *
     * @returns {void}
     */
    public rejectAll(): void {
        if (!this.owner.isReadOnly && !this.owner.documentHelper.isTrackedOnlyMode) {
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
        this.skipGroupAcceptReject = true;
        let selection: Selection = this.owner.selectionModule;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        let revisionCollec: Revision[] = changes ? changes : this.changes;
        if (revisionCollec.length <= 0) {
            return;
        }
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        startPos = startPos.clone();
        endPos = endPos.clone();
        if (isfromAcceptAll) {
            this.owner.editorModule.initComplexHistory('Accept All');
        } else {
            this.owner.editorModule.initComplexHistory('Reject All');
        }
        while (revisionCollec.length > 0) {
            if (isfromAcceptAll) {
                revisionCollec[0].accept();
            } else {
                revisionCollec[0].reject();
            }
            if (changes) {
                revisionCollec.splice(0, 1);
            }
            if (this.owner.enableHeaderAndFooter) {
                this.owner.editorModule.updateHeaderFooterWidget();
            }
        }
        if(!isNullOrUndefined(selection.editPosition)) {
            let textPosition: TextPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
            this.owner.selectionModule.selectContent(textPosition, true);
        }
        if (this.owner.editorHistoryModule) {
            this.owner.editorHistoryModule.updateComplexHistory();
            if(isNullOrUndefined(selection.editPosition)) {
                this.owner.editorHistoryModule.undoStack.pop();
            }
        }
        this.owner.editorModule.isSkipOperationsBuild = true;
        this.owner.editorModule.reLayout(this.owner.selectionModule, false);
        this.owner.editorModule.isSkipOperationsBuild = false;
        this.skipGroupAcceptReject = false;
    }

    public clear(): void {
        this.changes = [];
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public destroy(): void {
        if (this.changes) {
            for (let i: number = 0; i < this.changes.length; i++) {
                let revision: Revision = this.changes[i] as Revision;
                revision.destroy();
            }
            this.changes = [];
        }
        this.changes = undefined;
        this.owner = undefined;
    }
}