/* eslint-disable  */
import { RevisionType, RevisionActionType } from '../../base/types';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor';
import { ShapeBase, ElementBox, ParagraphWidget, TableRowWidget, TableWidget, TableCellWidget, BookmarkElementBox, FootnoteElementBox, Widget, BlockWidget, FieldElementBox, HeaderFooterWidget, ShapeElementBox, CommentCharacterElementBox, LineWidget, BlockContainer, ListTextElementBox, ContentControl, EditRangeEndElementBox, EditRangeStartElementBox } from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import { WRowFormat } from '../format/row-format';
import { Selection, TextPosition } from '../selection';
import { ParagraphInfo, SelectedCommentInfo } from '../editor/editor-helper';
import { BaseHistoryInfo, EditorHistory } from '../editor-history';
import { Dictionary, RevisionActionEventArgs, revisionActionEvent } from '../../base/index';
import { ChangesSingleView } from '../track-changes/track-changes-pane';

/**
 * The revision class which holds the information related to changes made in the document
 */
export class Revision {
    /**
     * @private
     */
    public ownerNode: ParagraphWidget | WCharacterFormat | WRowFormat;

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
     * To set the custom data value. 
     *
     * @private
     */
    public customData: string = null;
    /**
     * Holds the reference of the items which are under this revision.
     *
     * @private
     */
    private range: (WCharacterFormat | WRowFormat | ElementBox)[];
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

    /**
     * Private
     */
    public hasChanges: boolean = false;

    public constructor(documentHelper: DocumentEditor, author: string, date: string, ownerNode?: ParagraphWidget | WCharacterFormat | WRowFormat) {
        this.author = author;
        if (isNullOrUndefined(this.author)) {
            this.author = "Unknown";
        }
        this.date = date;
        this.owner = documentHelper;
        this.ownerNode = ownerNode;
    }

    /**
     * @private
     */
    public getRange(updateRange?: boolean): (WCharacterFormat | WRowFormat | ElementBox)[] {
        if (this.ownerNode instanceof ParagraphWidget) {
            if (isNullOrUndefined(this.range) || isNullOrUndefined(updateRange) || updateRange || this.hasChanges) {
                this.range = this.ownerNode.getRevisionRange(this);
            }
            return this.range;
        } else {
            return this.ownerNode.getRevisionRange(this);
        }
    }
    
    /**
     * @private
     */
    public handleAcceptReject(isFromAccept: boolean, isGroupAcceptOrReject?: boolean): void {
        let start: TextPosition = this.owner.selection.start.clone();
        let end: TextPosition = this.owner.selectionModule.end.clone();
        this.owner.selectionModule.selectRevision(this, undefined, undefined, true);
        const selection: Selection = this.owner.selectionModule;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        if (!selection.start.isExistBefore(selection.end)) {
            startPos = selection.end;
            endPos = selection.start;
        }
        let blockInfo: ParagraphInfo = selection.getParagraphInfo(startPos);
        let removeChanges: boolean = (!isNullOrUndefined(isFromAccept)) && ((this.revisionType === 'MoveFrom' || this.revisionType === 'Deletion') && isFromAccept ) || ((this.revisionType === 'Insertion' || this.revisionType === 'MoveTo') && !isFromAccept);
        let comments: CommentCharacterElementBox[];
        if (removeChanges) {
            let commentInfo: SelectedCommentInfo = this.owner.editorModule.getSelectedComments();
            if (commentInfo.commentEndInfo.length > 0 || commentInfo.commentStartInfo.length > 0) {
                comments = this.owner.editorModule.checkAndRemoveComments(false, true);
            } else {
                removeChanges = false;
            }
        }
        this.owner.editorModule.initHistory(isFromAccept ? 'Accept Change' : 'Reject Change');
        let fieldBegin: FieldElementBox = selection.getHyperlinkField();
        if (isFromAccept && this.revisionType === 'Deletion' && !isNullOrUndefined(fieldBegin) 
            && this.getRange(false).indexOf(fieldBegin) !== -1 && this.getRange(false).indexOf(fieldBegin.fieldEnd) !== -1 && this.getRange(false).indexOf(fieldBegin.fieldSeparator) === this.getRange(false).indexOf(fieldBegin.fieldEnd) - 1) {
            this.owner.editorHistoryModule.currentBaseHistoryInfo.isHyperlinkField = true;
        }
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
            while (this.getRange().length > 0) {
                if (this.getRange()[rangeIndex] instanceof ElementBox || this.getRange()[rangeIndex] instanceof WCharacterFormat || this.getRange()[rangeIndex] instanceof WRowFormat) {
                    if (this.getRange()[rangeIndex] instanceof BookmarkElementBox && isFromAccept && this.revisionType === 'Deletion') {
                        let inline: BookmarkElementBox = this.getRange()[rangeIndex] as BookmarkElementBox;
                        if (this.owner.documentHelper.bookmarks.containsKey(inline.name)) {
                            this.owner.documentHelper.bookmarks.remove(inline.name);
                        }
                    }
                    const moveToNextItem: boolean = this.unlinkRangeItem(this.getRange()[rangeIndex] as ElementBox, this, isFromAccept, startPos, endPos);
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
            if (!isNullOrUndefined(this.owner.editorHistory) && !isNullOrUndefined(this.owner.editorHistory.currentHistoryInfo) && (this.owner.editorHistory.currentHistoryInfo.action === 'Accept All' || this.owner.editorHistory.currentHistoryInfo.action === 'Reject All') && !blockInfo.paragraph.isInHeaderFooter) {
                this.owner.selection.selectPosition(start, end, true);
                this.owner.editorHistory.currentHistoryInfo.insertPosition = this.owner.selection.startOffset;
                this.owner.editorHistory.currentHistoryInfo.endPosition = this.owner.selection.endOffset;
            }
        }
        if (this.owner.editorHistoryModule && this.owner.editorHistoryModule.currentBaseHistoryInfo
            && this.owner.editorHistoryModule.currentBaseHistoryInfo.action !== 'BackSpace') {
            this.owner.editorHistoryModule.currentBaseHistoryInfo.removedNodes.reverse();
        }
        if (this.owner.editorHistoryModule) {
            let editorHistory: EditorHistory = this.owner.editorHistoryModule;
            if (editorHistory.currentHistoryInfo && (editorHistory.currentHistoryInfo.action === 'Accept All' || editorHistory.currentHistoryInfo.action === 'Reject All')) {
                if (this.owner.documentHelper.blockToShift) {
                    this.owner.documentHelper.layout.shiftLayoutedItems(false);
                }
            }
            editorHistory.updateHistory();
            if (removeChanges && this.owner.editorHistory && !isNullOrUndefined(this.owner.editorHistory.currentHistoryInfo)) {
                for (let k: number = 0; k < comments.length; k++) {
                    // Reset the removedIds array of the current comment element to an empty array.
                    comments[k].removedIds = [];
                    this.owner.editorModule.initInsertInline(comments[k], false);
                }
                this.owner.editorHistory.currentHistoryInfo.endPosition = this.owner.selection.startOffset;
                this.owner.editorHistory.updateComplexHistory();
            }
        }
        if (!isGroupAcceptOrReject) {
            if (this.owner.selectionModule.start.paragraph.isInsideTable) {
                let table: TableWidget = (this.owner.selectionModule.start.paragraph.containerWidget as TableCellWidget).ownerTable;
                this.owner.documentHelper.layout.reLayoutTable(table);
            }
            this.owner.editorModule.reLayout(this.owner.selectionModule);
        }
        if (blockInfo.paragraph.isInHeaderFooter) {
            this.owner.editorModule.updateHeaderFooterWidget();
        }
    }

    private handleGroupAcceptReject(revision: Revision[], isAccept?: boolean): void {
        let removeChanges: boolean = (!isNullOrUndefined(isAccept)) && ((this.revisionType === 'MoveFrom' || this.revisionType === 'Deletion') && isAccept) || ((this.revisionType === 'Insertion' || this.revisionType === 'MoveTo') && !isAccept);
        if (revision.length > 0) {
            if (!removeChanges) {
                let start: TextPosition = this.owner.selection.start.clone();
                let end: TextPosition = this.owner.selectionModule.end.clone();
                this.owner.editorModule.initComplexHistory(isAccept ? 'Accept All' : 'Reject All');
                this.owner.selectionModule.selectRevision(this);
                this.owner.selection.isModifyingSelectionInternally = true;
                while (revision.length > 0) {
                    if (isAccept) {
                        revision[revision.length - 1].handleAcceptReject(true, true);
                    } else {
                        revision[revision.length - 1].handleAcceptReject(false, true);
                    }
                }
                if (this.owner.selectionModule.start.paragraph.isInsideTable) {
                    let table: TableWidget = (this.owner.selectionModule.start.paragraph.containerWidget as TableCellWidget).ownerTable;
                    this.owner.documentHelper.layout.reLayoutTable(table);
                }
                this.owner.selection.isModifyingSelectionInternally = false;
                this.owner.selection.selectPosition(start, end, true);
                if (!isNullOrUndefined(this.owner.editorHistory) && !isNullOrUndefined(this.owner.editorHistory.currentHistoryInfo) && (this.owner.editorHistory.currentHistoryInfo.action === 'Accept All' || this.owner.editorHistory.currentHistoryInfo.action === 'Reject All')) {
                    this.owner.editorHistory.currentHistoryInfo.insertPosition = this.owner.selection.startOffset;
                    this.owner.editorHistory.currentHistoryInfo.endPosition = this.owner.selection.endOffset;
                }
                if (this.owner.editorHistoryModule) {
                    this.owner.editorHistoryModule.updateComplexHistory();
                }
            } else {
                this.deleteTrackedContents(isAccept);
            }
        }
    }
    private deleteTrackedContents(isAccept: boolean): void {
        //The boolean was used to check that if the revision from the item was was already removed or not.
        let isItemAlreadyUnlinked: boolean = this.owner.selectionModule.selectRevision(this, undefined, undefined, undefined, true, isAccept);
        if (!isItemAlreadyUnlinked) {
            this.owner.editorModule.initHistory(isAccept ? 'Accept Change' : 'Reject Change');
            this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
            if (!isNullOrUndefined(this.owner.editorHistory) && this.owner.editorHistoryModule.currentBaseHistoryInfo) {
                this.owner.editorHistoryModule.currentBaseHistoryInfo.isAcceptOrReject = isAccept ? 'Accept' : 'Reject';
            }
            if (!isNullOrUndefined(this.owner.editorHistory) && !isNullOrUndefined(this.owner.editorHistory.currentHistoryInfo) && (this.owner.editorHistory.currentHistoryInfo.action === 'Accept All' || this.owner.editorHistory.currentHistoryInfo.action === 'Reject All')) {
                this.owner.editorHistory.currentHistoryInfo.insertPosition = this.owner.selection.startOffset;
                this.owner.editorHistory.currentHistoryInfo.endPosition = this.owner.selection.endOffset;
            }
            this.owner.editorModule.reLayout(this.owner.selectionModule, undefined, undefined, true);
        }
    }
    /**
     * Method which accepts the selected revision, revision marks will be removed and changes will be included in the viewer.
     *
     * @returns {void}
     */
    public accept(): void {
        const eventArgs: RevisionActionEventArgs = { author: this.author, cancel: false, revisionType: this.revisionType, actionType: 'Accept', source: this };
        this.owner.trigger(revisionActionEvent, eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        let handled: boolean = false;
        if (!this.owner.documentHelper.isTrackedOnlyMode) {
            let revisions: Revision[] = [];
            if (!isNullOrUndefined(this.owner.trackChangesPane.changes.get(this))) {
                revisions = this.owner.revisions.groupedView.get(this.owner.trackChangesPane.changes.get(this));
            }
            if (revisions.length > 1) {
                this.handleGroupAcceptReject(revisions, true);
                handled = true
            }
            if (!handled) {
                this.handleAcceptReject(true, false);
            }
        }
    }
    /**
     * Method which rejects the selected revision, revision marks will be removed leaving the original content.
     */
    public reject(): void {
        const eventArgs: RevisionActionEventArgs = { author: this.author, cancel: false, revisionType: this.revisionType, actionType: 'Reject', source: this };
        this.owner.trigger(revisionActionEvent, eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        let handled: boolean = false;
        if (!this.owner.documentHelper.isTrackedOnlyMode) {
            let revisions: Revision[] = [];
            if (!isNullOrUndefined(this.owner.trackChangesPane.changes.get(this))) {
                revisions = this.owner.revisions.groupedView.get(this.owner.trackChangesPane.changes.get(this));
            }
            if (revisions.length > 1) {
                this.handleGroupAcceptReject(revisions, false);
                handled = true
            }
            if (!handled) {
                this.handleAcceptReject(false, false);
            }
        }
    }
    /**
     * Select the current revision.
     */
    public select(): void {
        this.owner.selectionModule.selectRevision(this);
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
            this.removeCurrentRevisionFromItem(item);
            if (revision.getRange().length === 0) {
                this.owner.revisions.remove(revision);
            }
            return false;
        }
        let removeChanges: boolean = (!isNullOrUndefined(isFromAccept)) && ((revision.revisionType === 'MoveFrom' || revision.revisionType === 'Deletion') && isFromAccept ) || ((revision.revisionType === 'Insertion' || revision.revisionType === 'MoveTo') && !isFromAccept);
        if (this.owner.selectionModule.isTOC()) {
            if (removeChanges) {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
                if (revision.getRange().length === 0) {
                    this.owner.revisions.remove(revision);
                }
                this.isContentRemoved = true;
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'BackSpace';
            } else {
                while (this.getRange().length > 0) {
                    let currentElement: ElementBox = this.getRange()[0] as ElementBox;
                    this.removeCurrentRevisionFromItem(currentElement);
                    if (revision.getRange().length === 0) {
                        this.owner.revisions.remove(revision);
                    }
                }
                this.owner.editorModule.addRemovedNodes(this.revisionID);
                this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'ClearRevisions';
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
                // Bug 873011: Handled the hyperlink formatting preservation when rejecting the RemoveHyperlink action.
                let fieldBegin: FieldElementBox = this.owner.selectionModule.getHyperlinkField();
                if (!isFromAccept && !isNullOrUndefined(fieldBegin) && fieldBegin == item && !isNullOrUndefined(fieldBegin.fieldEnd)) {
                    this.owner.editorModule.initComplexHistory('ClearRevisions');
                    this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'ClearRevisions';
                    this.updateRevisionID();
                    this.removeRevisionFromPara(start, end);
                    if (!isNullOrUndefined(this.owner.editorHistoryModule)) {
                        this.owner.editorHistoryModule.currentBaseHistoryInfo.isHyperlinkField = true;
                        let endInfo: ParagraphInfo = this.owner.selectionModule.getParagraphInfo(end);
                        let endIndex: string = this.owner.selectionModule.getHierarchicalIndex(endInfo.paragraph, endInfo.offset.toString());
                        this.owner.editorHistoryModule.currentBaseHistoryInfo.endPosition = endIndex;
                        this.owner.editorHistoryModule.currentBaseHistoryInfo.selectionEnd = endIndex;
                        this.owner.editorHistoryModule.updateHistory();
                    }
                    if (this.owner.enableTrackChanges) {
                        this.owner.enableTrackChanges = false;
                        this.owner.editorModule.updateHyperlinkFormat(this.owner.selectionModule);
                        this.owner.enableTrackChanges = true;
                    } else {
                        this.owner.editorModule.updateHyperlinkFormat(this.owner.selectionModule);
                    }
                    if (this.owner.editorHistoryModule && !isNullOrUndefined(this.owner.editorHistoryModule.currentHistoryInfo)) {
                        this.owner.editorHistoryModule.updateComplexHistory();
                    }
                } else {
                    this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'ClearRevisions';
                    this.updateRevisionID();
                    this.removeRevisionFromPara(start, end);
                }
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
            if (this.owner.enableCollaborativeEditing) {
                this.owner.editorHistoryModule.currentBaseHistoryInfo.createAcceptRejectRowOperation('RemoveRowTrack', currentRow);
            }
            this.owner.editorModule.cloneTableToHistoryInfo(tableWidget.combineWidget(this.owner.viewer) as TableWidget);
        }

        removeChanges = removeChanges && !this.canSkipTableItems;
        if (item instanceof ElementBox && removeChanges) {
            let currentPara: ParagraphWidget = item.line.paragraph;
            this.removeAllRevisionsFromItem(item);
            if (item instanceof FootnoteElementBox) {
                if (item.footnoteType === 'Footnote') {
                    this.owner.editorModule.removeFootnote(item);
                } else {
                    this.owner.editorModule.removeEndnote(item);
                }
            } else if (item instanceof ShapeElementBox) {
                this.owner.editorModule.removeDeletedShapeRevision(item);
            }
            this.removeItem(item);
            this.isContentRemoved = true;
            let skipRelayout: boolean = !isNullOrUndefined(currentPara) && !isNullOrUndefined(currentPara.bodyWidget) && currentPara.bodyWidget instanceof HeaderFooterWidget && (isNullOrUndefined(currentPara.bodyWidget.page) || (!isNullOrUndefined(currentPara.bodyWidget.page) && currentPara.bodyWidget.page.index === -1))
            if (!skipRelayout) {
                this.owner.documentHelper.layout.reLayoutParagraph(currentPara, 0, 0);
            }
            if (isNullOrUndefined(currentPara.childWidgets)) {
                const textPosition: TextPosition = this.owner.selectionModule.getTextPosBasedOnLogicalIndex(this.owner.selectionModule.editPosition);
                this.owner.selectionModule.selectContent(textPosition, true);
            }
        } else if (item instanceof WCharacterFormat && removeChanges) {
            this.isContentRemoved = true;
            this.skipUnLinkElement = false;
            this.owner.editor.addRemovedRevisionInfo(item);
            this.removeAllRevisionsFromItem(item);
            if (revision.getRange().length === 1) {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
            } else {
                this.owner.editorModule.deleteSelectedContents(this.owner.selectionModule, true);
                this.removeRevisionFromPara(start, end);
                let rangeIndex: number = revision.getRange().indexOf(item);
                if (rangeIndex >= 0) {
                    revision.getRange().splice(rangeIndex, 1);
                }
                this.owner.trackChangesPane.updateCurrentTrackChanges(revision);
                while (this.getRange().length > 0) {
                    this.removeCurrentRevisionFromItem(this.getRange()[0]);
                }
            }
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'BackSpace';
            this.owner.editorHistoryModule.currentBaseHistoryInfo.isAcceptOrReject = isFromAccept ? 'Accept' : 'Reject';
        } else if (item instanceof WRowFormat && removeChanges) {
            let tableWidget: TableWidget = (item as WRowFormat).ownerBase.ownerTable;
            tableWidget = tableWidget.combineWidget(this.owner.viewer) as TableWidget;
            let currentRow: TableRowWidget = item.ownerBase as TableRowWidget;
            this.owner.editor.addRemovedRevisionInfo(item);
            this.removeAllRevisionsFromItem(item);
            this.owner.editorHistoryModule.currentBaseHistoryInfo.action = 'DeleteCells';
            this.owner.editorHistoryModule.currentBaseHistoryInfo.isAcceptOrReject = isFromAccept ? 'Accept' : 'Reject';
            this.owner.editorModule.cloneTableToHistoryInfo(tableWidget);
            this.owner.editorModule.removeRevisionsInRow(currentRow);
            this.isContentRemoved = true;
            tableWidget.removeChild(tableWidget.childWidgets.indexOf(currentRow));
            this.canSkipTableItems = true;
            // Before destroying the table row widget, delete the field element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow);
            // Before destroying the table row widget, delete the bookmark element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow, true);
            // Before destroying the table row widget, delete the content control element from the row.
            this.owner.editorModule.removeFieldInBlock(currentRow, undefined, true);
            //currentRow.destroy();
            if (tableWidget.childWidgets.length === 0) {
                this.owner.selectionModule.editPosition = this.owner.selectionModule.getHierarchicalIndex(tableWidget, '0');
                this.owner.editorModule.removeBlock(tableWidget);
                //tableWidget.destroy();
            } else {
                this.owner.editorModule.updateTable(tableWidget, true);
            }
        }
        // if the range is of row format, we will remove the row and for history preservation we use whole table to be cloned, hence skipping this part
        if (!(item instanceof WRowFormat) || !removeChanges) {
            if (!this.skipUnLinkElement) {
                this.removeCurrentRevisionFromItem(item);
                if (removeChanges && item instanceof BookmarkElementBox) {
                    this.owner.editorModule.removedBookmarkElements.push(item);
                }
                if (item instanceof BookmarkElementBox) {
                    if (this.owner.documentHelper.bookmarks.containsKey(item.name)) {
                        if (this.owner.enableCollaborativeEditing && !isNullOrUndefined(this.owner.editorHistory.currentBaseHistoryInfo)) {
                            this.owner.editorHistory.currentBaseHistoryInfo.markerData.push({ bookmarkName: item.name });
                        }
                        this.owner.documentHelper.bookmarks.remove(item.name);
                    }
                }
            }
        }
        if (revision.getRange().length === 0) {
            this.owner.revisions.remove(revision);
        }
        return false;
    }

    private removeRevisionFromPara(start: TextPosition, end: TextPosition): void {
        let blockInfo: ParagraphInfo = this.owner.selectionModule.getParagraphInfo(start);
        let endBlockInfo: ParagraphInfo = this.owner.selectionModule.getParagraphInfo(end);
        let para: ParagraphWidget = blockInfo.paragraph;
        while (para instanceof ParagraphWidget) {
            if (para.characterFormat.revisionLength > 0) {
                for (let i: number = 0; i < para.characterFormat.revisionLength; i++) {
                    if (para.characterFormat.getRevision(i).getRange().length === 0) {
                        let revisionIndex: number = para.characterFormat.getAllRevision().indexOf(para.characterFormat.getRevision(i));
                        para.characterFormat.removeRevision(revisionIndex);
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
        while (this.getRange().length > 0) {
            this.removeCurrentRevisionFromItem(this.getRange()[0], true);
        }
        this.owner.trackChangesPane.updateCurrentTrackChanges(this);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private removeAllRevisionsFromItem(item: any): void {
        if (item.revisions.length > 0) {
            for (let i: number = item.revisionLength - 1; i >= 0; i--) {
                let currentRevision: Revision = item.revisions[i];
                // let rangeIndex: number = currentRevision.getRange().indexOf(item);
                // item.revisions[revisionIndex].getRange().splice(rangeIndex, 1);
                item.removeRevision(item.getAllRevision().indexOf(currentRevision))
                this.owner.trackChangesPane.updateCurrentTrackChanges(currentRevision);
                // Added condition to removed the another revision from collection which is present in the item. The current revision will be removed at the end of the unlinkRangeItem method. 
                if (this.revisionID !== currentRevision.revisionID) {
                    if (currentRevision.getRange().length === 0) {
                        this.owner.revisions.remove(currentRevision);
                    }
                }
            }
        }
    }
    /**
     * Method to remove current revision from the item
     *
     * @private
     * @param {any} item - Specifies the item
     * @returns {void}
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public removeCurrentRevisionFromItem(item: any, skipUpdate?: boolean): void {
        let revisionIndex: number = item.getAllRevision().indexOf(this);
        if (revisionIndex >= 0) {
            item.removeRevision(revisionIndex);
            if (!skipUpdate) {
                this.owner.trackChangesPane.updateCurrentTrackChanges(this);
            }
        }
    }
    /**
     * @private
     * @param {Element} element - Specifies the element.
     * @returns {boolean} Resturs skip element removal
     */
    public skipeElementRemoval(element: ElementBox): boolean {
        let elementPara: ParagraphWidget = element.paragraph;
        if (elementPara.characterFormat.revisionLength > 0) {
            for (let i: number = 0; i < elementPara.characterFormat.revisionLength; i++) {
                let currentRevision: Revision = elementPara.characterFormat.getRevision(i);
                let rangeIndex: number = currentRevision.getRange().indexOf(element);
                if (rangeIndex >= 0 && currentRevision.revisionID === this.revisionID) {
                    return true;
                }
            }
        }
        return false;
    }

    private removeItem(element: ElementBox): void {
        let paraWidget: ParagraphWidget = element.line.paragraph;
        this.owner.editorModule.unLinkFieldCharacter(element);
        let elementIndex: number = element.line.children.indexOf(element);
        let previousNode: ElementBox = element.previousNode;
        element.line.children.splice(elementIndex, 1);
        if (!isNullOrUndefined(previousNode)) {
            this.owner.editorModule.combineElementRevisionToPrevNxt(previousNode);
        }
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
        this.ownerNode = undefined;
        this.customData = undefined;
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
        revision.customData = this.customData;
        return revision;
    }

    /**
     * @private
     */
    public cloneRevision() : Revision {
        let revision: Revision = new Revision(this.owner, this.author, this.date);
        revision.revisionID = this.revisionID;
        revision.revisionType = this.revisionType;
        revision.author = this.author;
        revision.date = this.date;
        revision.customData = this.customData;
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
    public groupedView: Dictionary<ChangesSingleView, Revision[]>;
    /**
     * @private
     */
    public revisions: Revision[] = [];
    /**
     * @private
     */
    public changes: Revision[] = [];
    /**
     * @private
     */
    public isAcceptAllOrRejectAll: boolean = false;
    private owner: DocumentEditor;

    /**
     * @private
     */
    public get(index: number): Revision {
        if (index >= this.revisions.length || index < 0) {
            throw new ReferenceError('Provided index is not within the range');
        }
        return this.revisions[index];
    }

    public get length(): number {
        return this.revisions.length;
    }

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
    }


    /**
     * @private
     */
    public checkAndGetPreviousRevisionToCombine(revision: Revision): Revision {
        const range: (ElementBox | WCharacterFormat | WRowFormat)[] = revision.getRange();
        let revisionToCombine: Revision;
        if (range.length > 0) {
            let firstElement: (ElementBox | WCharacterFormat | WRowFormat) = range[0];
            if (firstElement instanceof ElementBox) {
                let previousElement: ElementBox = this.owner.editor.getPreviousNodeRevision(firstElement.previousNode);
                let currentParagraph: ParagraphWidget = (firstElement.paragraph.getSplitWidgets()[0] as ParagraphWidget);
                let skipAuthorCheck: boolean = currentParagraph.containerWidget instanceof TableCellWidget && currentParagraph.containerWidget.ownerRow.rowFormat.revisionLength > 0;
                let previousBlock: BlockWidget = currentParagraph.previousRenderedWidget as BlockWidget;
                let commonRevision: Revision[] = [];
                if ((previousElement instanceof ElementBox && previousElement.revisionLength > 0 && this.isSameRevisionType(previousElement.getAllRevision(), revision, commonRevision, skipAuthorCheck)) ||
                    (isNullOrUndefined(previousElement) && previousBlock instanceof ParagraphWidget && previousBlock.characterFormat.revisionLength > 0
                        && this.isSameRevisionType(previousBlock.characterFormat.getAllRevision(), revision, commonRevision, skipAuthorCheck))) {
                    if (commonRevision.length > 0) {
                        revisionToCombine = commonRevision[0];
                    }
                }
            } else if (firstElement instanceof WCharacterFormat) {
                let block: ParagraphWidget = firstElement.ownerBase as ParagraphWidget;
                let splittedParagraph: ParagraphWidget[] = block.getSplitWidgets() as ParagraphWidget[];
                let skipAuthorCheck: boolean = (splittedParagraph[splittedParagraph.length - 1] as ParagraphWidget).containerWidget instanceof TableCellWidget && (splittedParagraph[splittedParagraph.length - 1].containerWidget as TableCellWidget).ownerRow.rowFormat.revisionLength > 0;
                let previousBlock: BlockWidget = splittedParagraph[0].previousRenderedWidget as BlockWidget;
                let previousElement: ElementBox | WCharacterFormat;
                let commonRevision: Revision[] = [];
                if (block.isEmpty() && previousBlock instanceof ParagraphWidget) {
                    previousElement = previousBlock.characterFormat;
                } else {
                    let lastLine: LineWidget = (splittedParagraph[splittedParagraph.length - 1].lastChild as LineWidget);
                    previousElement = this.owner.editor.getPreviousNodeRevision(lastLine.children[lastLine.children.length - 1]);
                    if (isNullOrUndefined(previousElement) && previousBlock instanceof ParagraphWidget) {
                        previousElement = previousBlock.characterFormat;
                    }
                }
                if (!isNullOrUndefined(previousElement) && previousElement.revisionLength > 0 && this.isSameRevisionType(previousElement.getAllRevision(), revision, commonRevision, skipAuthorCheck)) {
                    if (commonRevision.length > 0) {
                        revisionToCombine = commonRevision[0];
                    }
                }
            } else if (firstElement instanceof WRowFormat) {
                let rowWidget: TableRowWidget = firstElement.ownerBase;
                let skipAuthorCheck: boolean = rowWidget.ownerTable.containerWidget instanceof TableCellWidget && rowWidget.ownerTable.containerWidget.ownerRow.rowFormat.revisionLength > 0;
                let previousRow: TableRowWidget = rowWidget.previousRenderedWidget as TableRowWidget;
                let commonRevision: Revision[] = [];
                if (!isNullOrUndefined(previousRow) && previousRow.rowFormat.revisionLength > 0 && this.isSameRevisionType(previousRow.rowFormat.getAllRevision(), revision, commonRevision, skipAuthorCheck)) {
                    if (commonRevision.length > 0) {
                        revisionToCombine = commonRevision[0];
                    }
                }
            }
            if (isNullOrUndefined(revisionToCombine)) {
                let block: BlockWidget;
                if (firstElement instanceof ElementBox) {
                    block = firstElement.paragraph;
                } else if (firstElement instanceof WCharacterFormat) {
                    block = firstElement.ownerBase as ParagraphWidget;
                } else if (firstElement instanceof WRowFormat) {
                    block = (firstElement.ownerBase as TableRowWidget).ownerTable;
                }
                let container: BlockContainer = block.containerWidget as BlockContainer;
                if (container instanceof TableCellWidget) {
                    let rowFormat: WRowFormat = container.ownerRow.rowFormat;
                    let commonRevision: Revision[] = [];
                    if (rowFormat.revisionLength > 0 && this.isSameRevisionType(rowFormat.getAllRevision(), revision, commonRevision, true)) {
                        revisionToCombine = commonRevision[0];
                    }
                }
            }
        }
        return revisionToCombine;
    }

    /**
     * @private
     */
    public checkAndGetNextRevisionToCombine(revision: Revision): Revision {
        const range: (ElementBox | WCharacterFormat | WRowFormat)[] = revision.getRange();
        if (range.length > 0) {
            let firstElement: (ElementBox | WCharacterFormat | WRowFormat) = range[0];
            let lastElement: (ElementBox | WCharacterFormat | WRowFormat) = range[range.length - 1];
            if (firstElement instanceof ElementBox) {
                let nextNode: ElementBox = (lastElement as ElementBox).nextNode;
                let currentParagraph: ParagraphWidget = (firstElement.paragraph.getSplitWidgets()[0] as ParagraphWidget);
                let skipAuthorCheck: boolean = currentParagraph.containerWidget instanceof TableCellWidget && currentParagraph.containerWidget.ownerRow.rowFormat.revisionLength > 0;
                let commonRevision: Revision[] = [];
                if ((nextNode instanceof ElementBox && nextNode.revisionLength > 0 && this.isSameRevisionType(nextNode.getAllRevision(), revision, commonRevision, skipAuthorCheck)) ||
                    (isNullOrUndefined(nextNode) && currentParagraph.characterFormat.revisionLength > 0 && this.isSameRevisionType(currentParagraph.characterFormat.getAllRevision(), revision, commonRevision, skipAuthorCheck))) {
                    if (commonRevision.length > 0) {
                        return commonRevision[0];
                    }
                }
            } else if (firstElement instanceof WCharacterFormat) {
                let block: ParagraphWidget = firstElement.ownerBase as ParagraphWidget;
                let splittedParagraph: ParagraphWidget[] = block.getSplitWidgets() as ParagraphWidget[];
                let skipAuthorCheck: boolean = (splittedParagraph[splittedParagraph.length - 1] as ParagraphWidget).containerWidget instanceof TableCellWidget && (splittedParagraph[splittedParagraph.length - 1].containerWidget as TableCellWidget).ownerRow.rowFormat.revisionLength > 0;
                let nextBlock: BlockWidget = splittedParagraph[splittedParagraph.length - 1].nextRenderedWidget as BlockWidget;
                let nextElement: ElementBox | WCharacterFormat;
                if (nextBlock instanceof ParagraphWidget) {
                    if (nextBlock.isEmpty()) {
                        nextElement = nextBlock.characterFormat;
                    } else {
                        nextElement = this.owner.editor.getNextNodeRevision((nextBlock.firstChild as LineWidget).children[0]);
                        if (isNullOrUndefined(nextElement) && nextBlock instanceof ParagraphWidget) {
                            nextElement = nextBlock.characterFormat;
                        }
                    }
                }
                let commonRevision: Revision[] = [];
                if (!isNullOrUndefined(nextElement) && nextElement.revisionLength > 0 && this.isSameRevisionType(nextElement.getAllRevision(), revision, commonRevision, skipAuthorCheck)) {
                    return commonRevision[0];
                }
            } else if (firstElement instanceof WRowFormat) {
                let rowWidget: TableRowWidget = firstElement.ownerBase;
                let skipAuthorCheck: boolean = rowWidget.ownerTable.containerWidget instanceof TableCellWidget && rowWidget.ownerTable.containerWidget.ownerRow.rowFormat.revisionLength > 0;
                let nextRow: TableRowWidget = rowWidget.nextRenderedWidget as TableRowWidget;
                let commonRevision: Revision[] = [];
                if (!isNullOrUndefined(nextRow) && nextRow.rowFormat.revisionLength > 0 && this.isSameRevisionType(nextRow.rowFormat.getAllRevision(), revision, commonRevision, skipAuthorCheck)) {
                    if (commonRevision.length > 0) {
                        return commonRevision[0];
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * @private
     */
    public addRevision(revision: Revision): void {
        this.insertRevisionAt(this.changes.length, revision);
    }
    
    /**
     * @private
     */
    public insertRevisionAt(index: number, revision: Revision): void {
        const previousRevision = this.checkAndGetPreviousRevisionToCombine(revision);
        const nextRevision = this.checkAndGetNextRevisionToCombine(revision);
        if (previousRevision) {
            this.combineWithExistingRevision(index, revision, previousRevision, false);
            if (nextRevision) {
                this.combineWithNextRevision(revision, nextRevision);
            }
        } else if (nextRevision && !isNullOrUndefined(this.owner.trackChangesPane.changes.get(nextRevision))) {
            this.combineWithExistingRevision(index, revision, nextRevision, true);
        } else {
            this.insertNewRevision(index, revision);
        }
        this.changes.splice(index, 0, revision);
    }
    private getIndexToInsertInGroup(revisions: Revision[], revisionToCombine: Revision, currentRevision: Revision, index: number): number {
        // if the previous row has a revision, It will return the row revision index not the child blocks. In that case we need to calculate the index based on the child blocks.
        if (revisionToCombine.ownerNode instanceof WRowFormat) {
            //Get previous revision to get the index to insert in grouped revision.
            let previousRevision: Revision = this.changes[index - 1];
            if (previousRevision === revisionToCombine) {
                return revisions.indexOf(revisionToCombine) + (this.changes.indexOf(revisionToCombine) < index ? 1 : 0);
            } else {
                if (revisions.indexOf(previousRevision) !== -1) {
                    return revisions.indexOf(previousRevision) + (this.changes.indexOf(previousRevision) < index ? 1 : 0);
                } else {
                    return revisions.indexOf(revisionToCombine) + (this.changes.indexOf(revisionToCombine) < index ? 1 : 0);
                }
            }
        } else {
            return revisions.indexOf(revisionToCombine) + (this.changes.indexOf(revisionToCombine) < index ? 1 : 0);
        }
    }
    private combineWithExistingRevision(index: number, revision: Revision, revisionToCombine: Revision, nextRevision: boolean): void {
        const currentChangeView = this.owner.trackChangesPane.changes.get(revisionToCombine);
        if (!currentChangeView) {
            return;
        }
        let revisions: Revision[] = this.owner.revisions.groupedView.get(currentChangeView);
        let insertIndex: number = this.getIndexToInsertInGroup(revisions, revisionToCombine, revision, index);

        revisions.splice(insertIndex, 0, revision);
        this.owner.trackChangesPane.changes.add(revision, currentChangeView);
        // When deleting the content it will be deleted in the reverse order. so that we need to update the owner node. If it is next node we need to update the revision because of owner node.
        if (nextRevision) {
            const revisionIndex: number = this.owner.revisions.revisions.indexOf(revisionToCombine);
            if (revisionIndex != -1) {
                this.owner.revisions.revisions.splice(revisionIndex, 1, revision);
                currentChangeView.revision = revision;
            }
        }
        if (revision.getRange().length > 0) {
          if (!isNullOrUndefined(currentChangeView.singleInnerDiv)) {
                this.clearChildren(currentChangeView.singleInnerDiv.querySelector("#textDiv"));
            }
            let ranges: (ElementBox | WCharacterFormat | WRowFormat)[] = [];
            for (let i: number = 0; i < revisions.length; i++) {
                ranges = [...ranges, ...revisions[i].getRange()];
            }
            currentChangeView.layoutElementText(revision, ranges, !isNullOrUndefined(currentChangeView.singleInnerDiv) ? currentChangeView.singleInnerDiv.querySelector("#textDiv") : undefined);
        }
    }
    
    private clearChildren(element: HTMLDivElement): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    private getNextRevision(index: number, previousRevision: Revision): Revision {
        // If two revisions are present in the element there is possible of change in revision type. So that view will not be split. In this case, we need to check all the revision which are present in the element.
        // Retrun the revision are match to the previous revision. If not then it will return the next revision directly.
        const nextRevision: Revision = this.changes[index];
        if (nextRevision && previousRevision) {
            const range = nextRevision.getRange(true);
            if (range.length > 0) {
                const node: ElementBox | WCharacterFormat | WRowFormat = range[range.length - 1];
                const revisions: Revision[] = node.getAllRevision();
                for (let i: number = 0; i < revisions.length; i++) {
                    const revision: Revision = revisions[i];
                    if (previousRevision.author === revision.author && revision.revisionType === previousRevision.revisionType) {
                        return revision;
                    }
                }
            }
        }
        return nextRevision;
    }

    private insertNewRevision(index: number, revision: Revision): void {
        const previousRevision: Revision = this.changes[index - 1];
        const nextRevision: Revision = this.getNextRevision(index, previousRevision);
        const previousSingleView: ChangesSingleView = previousRevision ? this.owner.trackChangesPane.changes.get(previousRevision) : undefined;
        const nextSingleView: ChangesSingleView = nextRevision ? this.owner.trackChangesPane.changes.get(nextRevision) : undefined;
        
        let splitRevision: boolean = !isNullOrUndefined(previousRevision) && !isNullOrUndefined(previousSingleView) && previousSingleView === nextSingleView;
        // While inserting a new revision inside a tracked table cell, 
        // we do not want to split the remaining rows.
        // so we set splitRevision to false.
        if (splitRevision) {
            if (revision.ownerNode instanceof ParagraphWidget) {
                splitRevision = !(revision.ownerNode.containerWidget instanceof TableCellWidget && revision.ownerNode.containerWidget.ownerRow.rowFormat.revisionLength > 0);
            } else if (revision.ownerNode instanceof WCharacterFormat) {
                if (revision.ownerNode.ownerBase instanceof ParagraphWidget) {
                    splitRevision = !(revision.ownerNode.ownerBase.containerWidget instanceof TableCellWidget && revision.ownerNode.ownerBase.containerWidget.ownerRow.rowFormat.revisionLength > 0);;
                }
            } else if (revision.ownerNode instanceof WRowFormat) {
                if (revision.ownerNode.ownerBase instanceof TableRowWidget && revision.ownerNode.ownerBase.ownerTable.containerWidget instanceof TableCellWidget && revision.ownerNode.ownerBase.ownerTable.containerWidget.ownerRow.rowFormat.revisionLength > 0) {
                    splitRevision = false;
                }
            }
        }
        // When an inserted revision row is deleted by another user, a child revision will be created.
        // In that case, we don't want to split the remaining rows,
        // so we set splitRevision to false.
        if (revision.getRange().length > 0 && revision.getRange()[0].revisionLength > 1) {
            splitRevision = false;
        }
        let threadIndex = index;
        if (!isNullOrUndefined(previousSingleView) && !isNullOrUndefined(previousSingleView.outerSingleDiv)) {
            threadIndex = this.getChildIndexQuery(previousSingleView.outerSingleDiv);
        }
        let currentChangeView = new ChangesSingleView(this.owner, this.owner.trackChangesPane);
        this.owner.trackChangesPane.changesInfoDiv.insertBefore(currentChangeView.createSingleChangesDiv(revision), this.owner.trackChangesPane.changesInfoDiv.children[threadIndex + 1]);
        this.revisions.splice(threadIndex, 0, revision);
        this.owner.trackChangesPane.changes.add(revision, currentChangeView);
        this.owner.trackChangesPane.renderedChanges.add(revision, currentChangeView);
    
        currentChangeView.layoutElementText(revision, revision.getRange(), !isNullOrUndefined(currentChangeView.singleInnerDiv) ? currentChangeView.singleInnerDiv.querySelector("#textDiv") : undefined);
        this.groupedView.add(currentChangeView, [revision]);
    
        if (splitRevision) {
            // If two revisions are present in the element then we need to split the two revisions into two different views.
            const range = previousRevision.getRange(true);
            if (range.length > 0) {
                const node: ElementBox | WCharacterFormat | WRowFormat = range[range.length - 1];
                const revisions: Revision[] = node.getAllRevision();
                for (let i: number = 0; i < revisions.length; i++) {
                    const revision: Revision = revisions[i];
                    const singleView: ChangesSingleView = this.owner.trackChangesPane.changes.get(revision);
                    if (singleView) {
                        this.splitView(revision, singleView, currentChangeView, threadIndex + i + 1);
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public splitView(previousRevision: Revision, previousSingleView: ChangesSingleView, currentChangeView: ChangesSingleView, threadIndex: number): void {
        if (this.groupedView.containsKey(previousSingleView)) {
            const groupedRevisions = this.groupedView.get(previousSingleView);
            const previousIndex = groupedRevisions.indexOf(previousRevision);
            if (previousIndex !== -1) {
                const removedFromGroup = groupedRevisions.splice(previousIndex + 1);
                if (removedFromGroup.length > 0) {
                    this.createSplittedView(removedFromGroup, threadIndex);
                    // Resetting the revision in the revision collection and also in the single view revision,
                    // since the previous revision was split and included in the new single view.
                    let revisionIndex: number = this.revisions.indexOf(previousSingleView.revision);
                    if (revisionIndex !== -1) {
                        this.revisions.splice(revisionIndex, 1, previousRevision);
                    }
                    previousSingleView.revision = previousRevision;
                    //Adding the new revision into the revisionCollection for splitted single view.
                    this.revisions.splice(threadIndex, 0, removedFromGroup[0]);
                }
            }
            this.owner.trackChangesPane.updateCurrentTrackChanges(groupedRevisions[0]);
        }
    }
    
    private createSplittedView(removedFromGroup: Revision[], threadIndex: number): void {
        const splittedView = new ChangesSingleView(this.owner, this.owner.trackChangesPane);
        const startRevision = removedFromGroup[0];
    
        removedFromGroup.forEach((movedRevision) => {
            if (this.owner.trackChangesPane.renderedChanges.containsKey(movedRevision)) {
                this.owner.trackChangesPane.renderedChanges.remove(movedRevision);
            }
            if (this.owner.trackChangesPane.changes.containsKey(movedRevision)) {
                this.owner.trackChangesPane.changes.remove(movedRevision);
            }
            this.owner.trackChangesPane.renderedChanges.add(movedRevision, splittedView);
            this.owner.trackChangesPane.changes.add(movedRevision, splittedView);
        });
        this.owner.trackChangesPane.changesInfoDiv.insertBefore(splittedView.createSingleChangesDiv(startRevision), this.owner.trackChangesPane.changesInfoDiv.children[threadIndex + 1]);
        let ranges: (ElementBox | WCharacterFormat | WRowFormat)[] = [];
        for (let i: number = 0; i < removedFromGroup.length; i++) {
            ranges = [...ranges, ...removedFromGroup[i].getRange()];
        }
        splittedView.layoutElementText(startRevision, ranges, !isNullOrUndefined(splittedView.singleInnerDiv) ? splittedView.singleInnerDiv.querySelector("#textDiv") : undefined);
        this.groupedView.add(splittedView, removedFromGroup);
    }
    /**
     * @private
     */
    public getChildIndexQuery(childElement: HTMLElement) {
        const parent = childElement.parentElement;
        if (!parent) return -1;

        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === childElement) return i;
        }

        return -1;
    }
    /**
     * @private
     */
    public isSameRevisionType(previousRevision: Revision[], currentRevision: Revision, commonRevision: Revision[], skipAuthorCheck: boolean): boolean {
        for (let i: number = 0; i < previousRevision.length; i++) {
            const isSameType = previousRevision[i].revisionType === currentRevision.revisionType;
            const isSameAuthor = previousRevision[i].author === currentRevision.author;
            if ((skipAuthorCheck && isSameType) || (!skipAuthorCheck && isSameType && isSameAuthor)) {
                commonRevision.push(previousRevision[i]);
                return true;
            }
        }
        return false;
    }

    public remove(revision: Revision): any {
        if (isNullOrUndefined(revision) || this.changes.indexOf(revision) < 0) {
            return;
        }
        if (this.owner.trackChangesPane.changes.containsKey(revision)) {
            let changesSingleView: ChangesSingleView = this.owner.trackChangesPane.changes.get(revision);
            let removeIndex: number = this.changes.indexOf(revision);
            let previousRevision: Revision = this.changes[removeIndex - 1];
            let nextRevision: Revision = this.changes[removeIndex + 1];
            this.changes.splice(removeIndex, 1);
            let isParentRemoved: boolean = false;
            let removedIndex: number = this.revisions.indexOf(revision);
            let removedSortedRevisionIndex: number = this.owner.trackChangesPane.sortedRevisions.indexOf(revision);
            if (removedIndex !== -1) {
                this.revisions.splice(removedIndex, 1);
                isParentRemoved = true;
            }
            if (removedSortedRevisionIndex !== -1) {
                this.owner.trackChangesPane.sortedRevisions.splice(removedSortedRevisionIndex, 1);
            }
            let groupedRevision: Revision[] = this.groupedView.get(changesSingleView);
            let removeChild: boolean = groupedRevision.length === 1;
            if (removeChild && !isNullOrUndefined(changesSingleView.outerSingleDiv)) {
                this.owner.trackChangesPane.changesInfoDiv.removeChild(changesSingleView.outerSingleDiv);
            }
            if (groupedRevision) {
                let groupedIndex: number = groupedRevision.indexOf(revision);
                groupedRevision.splice(groupedIndex, 1);
                if (groupedRevision.length === 0) {
                    this.groupedView.remove(changesSingleView);
                    if (!isNullOrUndefined(previousRevision)) {
                        this.checkAndCombineWithNextRevision(previousRevision);
                    }
                } else  {
                    let newParent: Revision = groupedRevision[0]
                    if (isParentRemoved) {
                        this.revisions.splice(removedIndex, 0, newParent);
                        this.owner.trackChangesPane.sortedRevisions.splice(removedSortedRevisionIndex, 0, newParent)
                        changesSingleView.revision = newParent;
                    }
                    newParent.hasChanges = true;
                    // // When removing the revision, it is necessary to split the view in the track changes pane. 
                    // const previousSingleView = previousRevision ? this.owner.trackChangesPane.changes.get(previousRevision) : undefined;
                    // const nextSingleView = nextRevision ? this.owner.trackChangesPane.changes.get(nextRevision) : undefined;
                    // const splitRevision = !isNullOrUndefined(previousRevision) && previousSingleView === nextSingleView;
                    // if (splitRevision) {
                    //     this.splitView(previousRevision, previousSingleView, nextSingleView);
                    // }
                }
            }
            this.owner.trackChangesPane.changes.remove(revision);
            if (this.owner.trackChangesPane.renderedChanges.containsKey(revision)) {
                this.owner.trackChangesPane.renderedChanges.remove(revision);
            }
        } else {
            this.changes.splice(this.changes.indexOf(revision), 1);
        }
    }

    private checkAndCombineWithNextRevision(revisionToCheck: Revision): void {
        let nextRevision: Revision = this.checkAndGetNextRevisionToCombine(revisionToCheck);
        if (!isNullOrUndefined(nextRevision)) {
            this.combineWithNextRevision(revisionToCheck, nextRevision);
        }
    }
    /**
     * @private
     */
    public combineWithNextRevision(currentRevision: Revision, nextRevision: Revision): void {
        const currentChangeView = this.owner.trackChangesPane.changes.get(currentRevision);
        const nextChangeView = this.owner.trackChangesPane.changes.get(nextRevision);
        if (!isNullOrUndefined(currentChangeView) && !isNullOrUndefined(nextChangeView) && currentChangeView !== nextChangeView) {
            let previousGroupedView: Revision[] = this.groupedView.get(currentChangeView);
            let nextGroupedView: Revision[] = this.groupedView.get(nextChangeView);

            if (!isNullOrUndefined(nextChangeView.outerSingleDiv)) {
                this.owner.trackChangesPane.changesInfoDiv.removeChild(nextChangeView.outerSingleDiv);
            }
            for (let i: number = 0; i < nextGroupedView.length; i++) {
                let revisionToMove: Revision = nextGroupedView[i];
                //Remove previous single view
                if (this.owner.trackChangesPane.renderedChanges.containsKey(revisionToMove)) {
                    this.owner.trackChangesPane.renderedChanges.remove(revisionToMove);
                }
                if (this.owner.trackChangesPane.changes.containsKey(revisionToMove)) {
                    this.owner.trackChangesPane.changes.remove(revisionToMove);
                }
                //Assign new single view
                this.owner.trackChangesPane.renderedChanges.add(revisionToMove, currentChangeView);
                this.owner.trackChangesPane.changes.add(revisionToMove, currentChangeView);
                previousGroupedView.push(revisionToMove);
                revisionToMove.hasChanges = true;

                //Remove the revision from revision collection
                let removeRevisionIndex: number = this.revisions.indexOf(revisionToMove);
                if (removeRevisionIndex !== -1) {
                    this.revisions.splice(removeRevisionIndex, 1)
                }
            }
            //Remove next single review
            this.groupedView.remove(nextChangeView);
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
        let selection: Selection = this.owner.selectionModule;
        let startPos: TextPosition = selection.start;
        let endPos: TextPosition = selection.end;
        let revisionCollec: Revision[] = changes ? changes : this.revisions;
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
        this.isAcceptAllOrRejectAll = true;
        while (revisionCollec.length > 0) {
            if (revisionCollec[0].getRange(false).length !== 0) {
                if (isfromAcceptAll) {
                    revisionCollec[0].accept();
                }
                else {
                    revisionCollec[0].reject();
                }
            }
            if (this.owner.enableHeaderAndFooter) {
                this.owner.editorModule.updateHeaderFooterWidget();
            }
        }
        this.isAcceptAllOrRejectAll = false;
        if (this.owner.editorHistoryModule) {
            this.owner.editorHistoryModule.updateComplexHistory();
        }
        this.owner.editorModule.isSkipOperationsBuild = this.owner.enableCollaborativeEditing;
        this.owner.editorModule.reLayout(this.owner.selectionModule, false);
        this.owner.editorModule.isSkipOperationsBuild = false;
    }

    public clear(): void {
        this.changes = [];
        this.revisions = [];
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
        if (this.groupedView) {
            this.groupedView.clear();
        }
        this.groupedView = undefined;
        this.revisions = [];
        this.changes = undefined;
        this.owner = undefined;
    }
}
