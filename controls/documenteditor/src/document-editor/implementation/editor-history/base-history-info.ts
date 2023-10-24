import { WParagraphFormat } from '../format/paragraph-format';
import { WSectionFormat } from '../format/section-format';
import { WCharacterFormat } from '../format/character-format';
import { WListFormat } from '../format/list-format';
import { WListLevel } from '../list/list-level';
import { Editor, EditorHistory, Selection, Revision, HistoryInfo, CommentView, WList } from '../index';
import { ModifiedLevel, RowHistoryFormat, TableHistoryInfo, EditRangeInfo } from './history-helper';
import {
    IWidget, BlockWidget,
    ParagraphWidget, LineWidget, BodyWidget, TableCellWidget,
    FieldElementBox, TableWidget, TableRowWidget, BookmarkElementBox, HeaderFooterWidget,
    EditRangeStartElementBox, CommentElementBox, CheckBoxFormField, TextFrame, TextFormField, TextElementBox, HeaderFooters, CommentEditInfo, FormField, FootnoteElementBox, ImageElementBox
} from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { DocumentEditor } from '../../document-editor';
import { Action, abstractListsProperty, listIdProperty, listsProperty, nsidProperty } from '../../index';
import { TextPosition, ImageInfo } from '../index';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ElementBox, CommentCharacterElementBox } from '../viewer/page';
import { TableResizer } from '../editor/table-resizer';
import { WTableFormat, WRowFormat, WCellFormat, WParagraphStyle, WCharacterStyle, WShading, WBorders} from '../format/index';
import { ParagraphInfo, HelperMethods, AbsolutePositionInfo } from '../editor/editor-helper';
import { BookmarkInfo } from './history-helper';
import { DocumentHelper, TextHelper } from '../viewer';
import { BaselineAlignment, CONTROL_CHARACTERS, FootEndNoteNumberFormat, FootnoteRestartIndex, HeaderFooterType, HeightType,  HighlightColor, ListLevelPattern, ProtectionType, Strikethrough, Underline} from '../../base/types';

import { WBorder } from '../../index';
/**
 * @private
 */
export class BaseHistoryInfo {
    // Fields
    private ownerIn: DocumentEditor;
    public documentHelper: DocumentHelper;
    private actionIn: Action;
    private removedNodesIn: IWidget[];
    private modifiedPropertiesIn: Object[];
    private modifiedNodeLength: number[];
    private selectionStartIn: string;
    private selectionEndIn: string;
    private insertPositionIn: string;
    private endPositionIn: string;
    private currentPropertyIndex: number;
    private ignoredWord: string;
    public insertedText: string;
    public insertedData: ImageData;
    public type: string;
    public headerFooterStart: number;
    public headerFooterEnd: number;
    private tableRelatedLength: number;
    public insertNodesIn: IWidget[];
    public cellOperation: Operation[] = [];

    public fieldBegin: FieldElementBox;
    private startIndex: number;
    private insertIndex: number;
    private endIndex: number;
    public ignoreStartOffset: boolean;
    public insertedElement: ElementBox;
    public splittedRevisions: MarkerData[] = [];
    public isAcceptOrReject: string;
    public insertedNodes: IWidget[];
    public pasteContent: string;
    private insertedTableFormat: string;
    private insertedRowFormat: string;
    private insertedCellFormat: string;
    private insertedParagraphFormat: string;
    private insertedCharacterFormat: string;
    private insertedSectionFormat: string;
    public insertedFormat: Object;


    /**
     * @private
     */
    public lastElementRevision: ElementBox;
    /**
     * @private
     */
    public endRevisionLogicalIndex: string;
    /**
     * @private
     */
    public markerData: MarkerData[] = [];
	/**
     * @private
     */
    public formFieldType: string;
    /**
     * @private
     */
    public isEditHyperlink: boolean;
    /**
     * @private
     */
    public dropDownIndex: number;
    //Properties
    //gets owner control
    public get owner(): DocumentEditor {
        return this.ownerIn;
    }

    public get editorHistory(): EditorHistory {
        return this.owner.editorHistory;
    }
    public get action(): Action {
        return this.actionIn;
    }
    public set action(value: Action) {
        this.actionIn = value;
        if (this.owner.enableCollaborativeEditing) {
            if (value === 'DeleteColumn' || value === 'DeleteCells' || value === 'ClearCells' || value === 'MergeCells') {
                if (!this.owner.selection.isTableSelected() || value === 'ClearCells' || value === 'MergeCells') {
                    this.insertedText = CONTROL_CHARACTERS.Cell;
                    this.deleteColumnOperation(this.action);
                }
            } else if (value === 'Accept Change' || value === 'Reject Change') {
                if (this.cellOperation.length > 0) {
                    return;
                }
                this.createAcceptRejectOperation(this.action);
            }
        }
    }

    public get modifiedProperties(): Object[] {
        return this.modifiedPropertiesIn;
    }
    /* eslint-enable */
    public get removedNodes(): IWidget[] {
        return this.removedNodesIn;
    }
    //gets or sets selection start
    public get selectionStart(): string {
        return this.selectionStartIn;
    }
    public set selectionStart(value: string) {
        this.selectionStartIn = value;
    }
    public get selectionEnd(): string {
        return this.selectionEndIn;
    }
    public set selectionEnd(value: string) {
        this.selectionEndIn = value;
    }

    public get insertPosition(): string {
        return this.insertPositionIn;
    }
    public set insertPosition(value: string) {
        this.insertPositionIn = value;
        if (this.owner.enableCollaborativeEditing && value !== '' && !isNullOrUndefined(value) && value.indexOf('C') === -1) {
            //TODO: Insert position not needed in all the cases. Need to optimize it.
            this.insertIndex = this.owner.selection.getAbsolutePositionFromRelativePosition(value);
        }
    }
    public get endPosition(): string {
        return this.endPositionIn;
    }
    public set endPosition(value: string) {
        this.endPositionIn = value;
    }
    public constructor(node: DocumentEditor) {
        this.ownerIn = node;
        this.documentHelper = node.documentHelper;
        this.modifiedPropertiesIn = [];
        this.modifiedNodeLength = [];
        this.removedNodesIn = [];
        this.insertedNodes = [];
    }
    private get viewer(): LayoutViewer {
        return this.ownerIn.viewer;
    }

    public updateSelection(): void {
        if (this.owner.enableCollaborativeEditing) {
            //TODO: Need to consider formard and backward selection
            let start: TextPosition = this.owner.selection.start.clone();
            let end: TextPosition = this.owner.selection.end.clone();
            this.startIndex = this.owner.selection.getAbsolutePositionFromRelativePosition(start);
            this.endIndex = this.owner.selection.getAbsolutePositionFromRelativePosition(end);
        }
        let blockInfo: ParagraphInfo = this.owner.selection.getParagraphInfo(this.owner.selection.start);
        this.selectionStart = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.owner.selection.getParagraphInfo(this.owner.selection.end);
        this.selectionEnd = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
    }
    public setBookmarkInfo(bookmark: BookmarkElementBox): void {
        this.removedNodes.push({ 'bookmark': bookmark, 'startIndex': bookmark.indexInOwner, 'endIndex': bookmark.reference.indexInOwner });
    }
    public setFormFieldInfo(field: FieldElementBox, value: string | number | boolean): void {
        this.removedNodes.push({ 'formField': field, 'value': value });
    }
    public setEditRangeInfo(editStart: EditRangeStartElementBox): void {
        this.removedNodes.push({ 'editStart': editStart, 'startIndex': editStart.indexInOwner, 'endIndex': editStart.editRangeEnd.indexInOwner });
    }
    private revertFormTextFormat(): void {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const fieldInfo: any = this.removedNodes[0];
        let text: any = fieldInfo.value;
        /* eslint-enable @typescript-eslint/no-explicit-any */
        const formField: FieldElementBox = fieldInfo.formField;
        if (this.editorHistory.isUndoing) {
            this.owner.editorModule.applyTextFormatInternal(formField, text);
            this.editorHistory.recordChanges(this);
        } else {
            text = HelperMethods.formatText((formField.formFieldData as TextFormField).format, text);
            this.owner.editorModule.applyTextFormatInternal(formField, text);
            this.editorHistory.undoStack.push(this);
        }
    }
    private revertFormField(): void {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const fieldInfo: any = this.removedNodes[0];
        /* eslint-enable @typescript-eslint/no-explicit-any */
        const field: FieldElementBox = fieldInfo.formField;
        if (field.formFieldData instanceof CheckBoxFormField) {
            this.owner.editorModule.toggleCheckBoxFormField(field, true, fieldInfo.value);
        } else {
            this.owner.editorModule.updateFormField(field, fieldInfo.value);
        }
    }
    private revertBookmark(): void {
        const bookmarkInfo: BookmarkInfo = this.removedNodes[0] as BookmarkInfo;
        const bookmark: BookmarkElementBox = bookmarkInfo.bookmark;
        if (this.editorHistory.isUndoing) {
            this.documentHelper.bookmarks.add(bookmark.name, bookmark);
            bookmark.line.children.splice(bookmarkInfo.startIndex, 0, bookmark);
            const previousNode: ElementBox = bookmark.previousNode;
            if (previousNode instanceof FieldElementBox && !isNullOrUndefined(previousNode.formFieldData)) {
                previousNode.formFieldData.name = bookmark.name;
            }
            
            bookmark.reference.line.children.splice(bookmarkInfo.endIndex, 0, bookmark.reference);
            
            this.editorHistory.recordChanges(this);
        } else {
            this.owner.editorModule.deleteBookmarkInternal(bookmark);
            this.editorHistory.undoStack.push(this);
        }
    }
    private revertComment(): void {
        const editPosition: string = this.insertPosition;
        const comment: CommentElementBox = this.removedNodes[0] as CommentElementBox;
        let insert: boolean = false;
        if (this.action === 'ResolveComment') {
            this.editorHistory.currentBaseHistoryInfo = this;
            this.owner.editor.resolveOrReopenComment(comment, !comment.isResolved);
            return;
        }
        if (this.action === 'EditComment') {
            let modifiedCommentObject: CommentEditInfo = this.modifiedProperties[0] as CommentEditInfo;
            this.editorHistory.currentBaseHistoryInfo = this;
            let commentView: CommentView = this.owner.commentReviewPane.commentPane.comments.get(comment);
            commentView.commentText.innerText = modifiedCommentObject.text;
            modifiedCommentObject.text = comment.text;
            comment.text = commentView.commentText.innerText;
            this.owner.editorHistory.updateHistory();
            this.owner.fireContentChange();
            return;
        }
        if (this.action === 'InsertCommentWidget') {
            insert = (this.editorHistory.isRedoing);
        } else if (this.action === 'DeleteCommentWidget') {
            insert = (this.editorHistory.isUndoing);
        }
        if (insert) {
            if (comment) {
                if (comment.isReply) {
                    this.owner.editor.addReplyComment(comment, this.insertPosition);
                } else {
                    this.owner.editor.addCommentWidget(comment, false, true, true);
                }
            }
        } else {
            const commentElement: CommentElementBox = this.owner.editor.getCommentElementBox(editPosition);
            this.owner.editor.deleteCommentWidget(commentElement);
        }
    }
    private revertEditRangeRegion(): void {
        const editRangeInfo: EditRangeInfo = this.removedNodes[0] as EditRangeInfo;
        const editStart: EditRangeStartElementBox = editRangeInfo.editStart;
        if (this.editorHistory.isUndoing) {
            const user: string = editStart.user === '' ? editStart.group : editStart.user;
            this.owner.editor.updateRangeCollection(editStart, user);
            editStart.line.children.splice(editRangeInfo.startIndex, 0, editStart);
            editStart.editRangeEnd.line.children.splice(editRangeInfo.endIndex, 0, editStart.editRangeEnd);
            this.editorHistory.recordChanges(this);
        } else {
            this.owner.editorModule.removeUserRestrictionsInternal(editStart);
            this.editorHistory.undoStack.push(this);
        }
        this.owner.editor.fireContentChange();
    }
    /* eslint-disable  */
    public revert(): void {
        if (this.action === 'FormTextFormat') {
            this.revertFormTextFormat();
            return;
        }
        if (this.action === 'UpdateFormField') {
            this.revertFormField();
            return;
        }
        if (this.action === 'DeleteBookmark') {
            this.revertBookmark();
            return;
        }
        if (this.action === 'RemoveEditRange') {
            this.revertEditRangeRegion();
            return;
        }
        if (this.action === 'InsertCommentWidget' || this.action === 'DeleteCommentWidget' || this.action === 'ResolveComment' || this.action === 'EditComment') {
            this.revertComment();
            return;
        }
        if (this.action === 'ListFormat' && this.owner.editor.listNumberFormat !== '') {
            let abstractList: WListLevel = this.documentHelper.lists[0].abstractList.levels[this.owner.editor.listLevelNumber];
            let currentListLevelPattern: ListLevelPattern = abstractList.listLevelPattern;
            let currentNUmberFormat: string = abstractList.numberFormat
            abstractList.listLevelPattern = this.owner.editor.listLevelPattern;
            abstractList.numberFormat = this.owner.editor.listNumberFormat;
            this.owner.editor.listLevelPattern = currentListLevelPattern;
            this.owner.editor.listNumberFormat = currentNUmberFormat;
        }
        this.owner.isShiftingEnabled = true;
        let selectionStartTextPosition: TextPosition = undefined;
        let selectionEndTextPosition: TextPosition = undefined;
        let start: string = this.selectionStart;
        let end: string = this.selectionEnd;
        let isForwardSelection: boolean = TextPosition.isForwardSelection(start, end);
        if (this.modifiedProperties.length > 0 || this.action === 'Selection'
            || this.action === 'ClearCharacterFormat' || this.action === 'ClearParagraphFormat') {
            selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(start);
            selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(end);
            this.revertModifiedProperties(selectionStartTextPosition, selectionEndTextPosition);
        } else {
            let sel: Selection = this.owner.selection;
            let deletedNodes: IWidget[] = this.removedNodes;
            this.removedNodesIn = [];
            if (isNullOrUndefined(this.endPosition)) {
                this.endPosition = this.insertPosition;
            }
            let isForward: boolean = TextPosition.isForwardSelection(this.insertPosition, this.endPosition);
            let insertTextPosition: TextPosition = sel.getTextPosBasedOnLogicalIndex(isForward ? this.insertPosition : this.endPosition);
            let endTextPosition: TextPosition = sel.getTextPosBasedOnLogicalIndex(isForward ? this.endPosition : this.insertPosition);
            if (this.lastElementRevision && this.editorHistory.isUndoing) {
                if (isNullOrUndefined(this.endRevisionLogicalIndex)) {
                    this.updateEndRevisionInfo();
                }
            }
            if (this.action === 'ClearRevisions') {
                this.undoRevisionForElements(insertTextPosition, endTextPosition, deletedNodes[deletedNodes.length - 1] as string);
                deletedNodes = [];
            }
            if (this.action === 'Uppercase') {
                sel.selectPosition(insertTextPosition, endTextPosition);
                this.editorHistory.currentBaseHistoryInfo = this;
                let editModule: Editor = this.owner.editorModule;
                editModule.changeSelectedTextCase(sel, insertTextPosition, endTextPosition, this.action.toString(), deletedNodes);
                editModule.reLayout(sel);
                return;
            }
            if (insertTextPosition.isAtSamePosition(endTextPosition)) {
                sel.selectContent(insertTextPosition, true);
            } else {
                sel.selectPosition(insertTextPosition, endTextPosition);
            }
            if (this.action === 'InsertHyperlink' && this.editorHistory.isRedoing) {
                let fieldBegin: FieldElementBox = this.owner.selection.getHyperlinkField();
                if (!isNullOrUndefined(fieldBegin)) {
                    let offset: number = (fieldBegin.line).getOffset(fieldBegin, 0);
                    insertTextPosition.setPositionParagraph(fieldBegin.line, offset);
                    this.owner.selection.start.setPositionInternal(insertTextPosition);
                    offset = fieldBegin.fieldEnd.line.getOffset(fieldBegin.fieldEnd, 1);
                    endTextPosition.setPositionParagraph(fieldBegin.fieldEnd.line, offset);
                }
            }
            this.editorHistory.currentBaseHistoryInfo = this;
            this.selectionStart = this.insertPosition; this.insertPosition = undefined; this.selectionEnd = this.endPosition;
            this.endPosition = undefined;
            let isRemoveContent: boolean = false;
            if (this.endRevisionLogicalIndex && deletedNodes.length > 0) {
                if (this.editorHistory.isUndoing || (this.editorHistory.isRedoing && insertTextPosition.isAtSamePosition(endTextPosition))) {
                    let currentPosition: TextPosition = sel.getTextPosBasedOnLogicalIndex(this.endRevisionLogicalIndex);
                    sel.selectPosition(insertTextPosition, currentPosition);
                }
                if (this.editorHistory.isUndoing) {
                    this.owner.editor.deleteSelectedContents(sel, true);
                }
            }
            if (!insertTextPosition.isAtSamePosition(endTextPosition)) {
                isRemoveContent = this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'ClearCells'
                    || this.action === 'DeleteCells';
                let skipDelete: boolean = (deletedNodes.length > 0 && this.action === 'ParaMarkTrack') || this.action === 'ClearRevisions' || this.action === 'AcceptTOC';
                if (!(isRemoveContent) && this.action !== 'MergeCells' && this.action !== 'InsertRowAbove'
                    && this.action !== 'InsertRowBelow' && this.action !== 'InsertColumnLeft'
                    && this.action !== 'InsertColumnRight' && this.action !== 'Borders'
                    && this.action !== 'DeleteTable' && this.action !== 'DeleteColumn' && this.action !== 'DeleteRow') {
                    sel.end.setPositionInternal(endTextPosition);
                    if (!this.owner.selection.isEmpty && !skipDelete) {
                        if (this.editorHistory.isRedoing && this.action !== 'Accept Change' && this.action !== 'ParaMarkTrack' &&
                            this.action !== 'ParaMarkReject' && this.action !== 'RemoveRowTrack') {
                            this.owner.editorModule.removeSelectedContents(sel);
                        } else {
                            this.owner.editorModule.deleteSelectedContents(sel, true);
                        }
                        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                            this.editorHistory.currentHistoryInfo.action === 'PageBreak' && this.documentHelper.blockToShift) {
                            this.documentHelper.layout.shiftLayoutedItems(false);
                        }
                    }
                }
            } else if(this.action === 'SectionBreakContinuous' && insertTextPosition && this.editorHistory.isUndoing) {
                if (insertTextPosition.offset === 0 && !isNullOrUndefined(insertTextPosition.paragraph.previousRenderedWidget) && insertTextPosition.paragraph.previousRenderedWidget instanceof ParagraphWidget && insertTextPosition.paragraph.previousRenderedWidget.isEndsWithPageBreak && insertTextPosition.paragraph.containerWidget instanceof BodyWidget && insertTextPosition.currentWidget === insertTextPosition.currentWidget.paragraph.firstChild && insertTextPosition.paragraph.containerWidget.sectionFormat.breakCode === 'NoBreak') {
                    let section: BodyWidget = (insertTextPosition.paragraph.previousRenderedWidget as ParagraphWidget).containerWidget as BodyWidget;
                    this.owner.editor.combineSectionInternal(this.owner.selection, section, insertTextPosition.paragraph.containerWidget);
                    this.owner.editorModule.layoutWholeDocument();
                }
            }
            let isRedoAction: boolean = (this.editorHistory.isRedoing && !isRemoveContent);
            isRemoveContent = this.lastElementRevision ? false : isRemoveContent;
            this.revertModifiedNodes(deletedNodes, isRedoAction, isForwardSelection ? start : end, start === end);
            if (isRemoveContent) {
                this.removeContent(insertTextPosition, endTextPosition, true);
            }
            //this.owner.editorModule.reLayout(this.documentHelper.selection);
        }
        let isSelectionChanged: boolean = false;
        let updateSelection: boolean = false;
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) && (this.editorHistory.currentHistoryInfo.action === 'Reject All' || this.editorHistory.currentHistoryInfo.action === 'Accept All' || this.editorHistory.currentHistoryInfo.action === 'Paste')) {
            updateSelection = true;
        }
        if (!this.owner.trackChangesPane.isTrackingPageBreak && ((this.editorHistory.isUndoing || this.endRevisionLogicalIndex || this.action === 'RemoveRowTrack' || updateSelection) && isNullOrUndefined(this.editorHistory.currentHistoryInfo) || updateSelection) ||
            ((this.action === 'InsertRowAbove' || this.action === 'Borders' || this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft' || this.action === 'InsertColumnRight' || this.action === 'Accept Change' || this.action === 'PasteColumn' || this.action === 'PasteRow' || this.action === 'PasteOverwrite' || this.action === 'PasteNested') && (this.editorHistory.isRedoing
                || this.editorHistory.currentHistoryInfo.action === 'Paste'))) {
            if (this.action === 'RemoveRowTrack' && this.editorHistory.isRedoing) {
                selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionStart);
                selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionEnd);
            } else {
                selectionStartTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(start);
                selectionEndTextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(end);
            }
            this.owner.selection.selectRange(selectionStartTextPosition, selectionEndTextPosition);
            this.documentHelper.updateFocus();
            isSelectionChanged = true;
        }
        this.owner.trackChangesPane.isTrackingPageBreak = false;
        // Updates insert position of history info instance.
        this.insertPosition = start;
        this.endPosition = end;
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
            (this.editorHistory.currentHistoryInfo.action === 'Accept All'
                || this.editorHistory.currentHistoryInfo.action === 'Reject All' || this.editorHistory.currentHistoryInfo.action === 'RemoveComment')) {
            if (this.owner.documentHelper.blockToShift) {
                this.owner.documentHelper.layout.shiftLayoutedItems(false);
            }
        }
        this.owner.editorModule.reLayout(this.owner.selection, this.owner.selection.isEmpty);

        if (this.editorHistory.isUndoing && this.action === 'SectionBreak') {
            this.owner.editorModule.layoutWholeDocument();
        }
        if (isSelectionChanged) {
            this.documentHelper.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
        }
        this.highlightListText();
    }
    private highlightListText(): void {
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
            if (this.action === 'ListCharacterFormat' || (this.editorHistory.currentHistoryInfo.action === 'ListSelect' && this.action === 'ListFormat')) {
                let selectionStartTextPosition: TextPosition = this.owner.selection.getTextPosBasedOnLogicalIndex(this.selectionStart);
                let widget: LineWidget = selectionStartTextPosition.currentWidget as LineWidget;
                this.documentHelper.selection.highlightListText(widget);
            }
        }
    }
    private removeContent(insertTextPosition: TextPosition, endTextPosition: TextPosition, skipDeletecell?: boolean): void {
        //If the base parent of the insert text position and end text position is null 
        //then the paragraphs already removed.
        //Example scenario: In table editing that is delete cells operation 
        // we will backed up the entire table ad it will be replaced on undo operation.
        //At that time if the positions are in table 
        //which is already replaced in undo (revert modified nodes method) then the base parent of the paragraph will be null.
        //So again, selecting the content and deleting is unnecessary
        // and it will cause improper position updates and null reference exceptions. 
        if ((!isNullOrUndefined(insertTextPosition.paragraph.containerWidget) &&
            insertTextPosition.paragraph.containerWidget instanceof BodyWidget &&
            (!isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && endTextPosition.paragraph.containerWidget instanceof BodyWidget))
            || (!isNullOrUndefined(insertTextPosition.paragraph.containerWidget)
                && !isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && insertTextPosition.paragraph.containerWidget instanceof TableCellWidget
                && endTextPosition.paragraph.containerWidget instanceof TableCellWidget
                && !isNullOrUndefined(insertTextPosition.paragraph.bodyWidget)) ||
            (!isNullOrUndefined(insertTextPosition.paragraph.containerWidget)
                && !isNullOrUndefined(endTextPosition.paragraph.containerWidget)
                && insertTextPosition.paragraph.containerWidget instanceof TextFrame
                && endTextPosition.paragraph.containerWidget instanceof TextFrame)) {
            //Removes if any empty paragraph is added while delete.
            this.owner.selection.selectRange(insertTextPosition, endTextPosition);
            this.documentHelper.updateFocus();
            let isDelete: boolean = false;
            if (this.action === 'BackSpace' || this.action === 'Uppercase' || this.action === 'RemoveRowTrack') {
                isDelete = true;
            }
            this.owner.editorModule.deleteSelectedContents(this.owner.selection, isDelete, skipDeletecell);
        }
    }
    public updateEndRevisionInfo(): void {
        this.lastElementRevision = this.checkAdjacentNodeForMarkedRevision(this.lastElementRevision);
        let currentRevision: TextPosition = this.retrieveEndPosition(this.lastElementRevision);
        let blockInfo: ParagraphInfo = this.owner.selection.getParagraphInfo(currentRevision);
        if(blockInfo.paragraph.getLength() == blockInfo.offset) {
            blockInfo.offset++;
        }
        this.endRevisionLogicalIndex = this.owner.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        this.lastElementRevision.isMarkedForRevision = false;
    }
    private retrieveEndPosition(elementBox: ElementBox): TextPosition {
        let endPosition: TextPosition = new TextPosition(this.owner);
        let offset: number = elementBox.line.getOffset(elementBox, 0) + elementBox.length;
        endPosition.setPositionFromLine(elementBox.line, offset);
        return endPosition;
    }
    /**
     * Method to retrieve exact spitted node which is marked as last available element.
     *
     * @param {ElementBox} elementBox - Specifies the element box
     * @returns {ElementBox} - Returns element box 
     */
    private checkAdjacentNodeForMarkedRevision(elementBox: ElementBox): ElementBox {
        let nextItem: ElementBox = elementBox.nextNode;
        let markedNode: ElementBox;
        while (!isNullOrUndefined(nextItem) && nextItem.isMarkedForRevision) {
            markedNode = nextItem;
            nextItem = nextItem.nextNode;
        }
        return !isNullOrUndefined(markedNode) ? markedNode : elementBox;
    }

    private revertModifiedProperties(start: TextPosition, end: TextPosition): void {
        if (this.action === 'CellFormat' || this.action === 'CellOptions' || this.action === 'TableOptions') {
            this.owner.isShiftingEnabled = false;
        }
        this.owner.selection.selectRange(start, end);
        this.documentHelper.updateFocus();
        if (this.action === 'RowResizing' || this.action === 'CellResizing') {
            this.revertResizing();
        } else if (this.action === 'CellOptions' || this.action === 'TableOptions') {
            this.revertTableDialogProperties(this.action);
        } else if (this.action !== 'Selection') {
            this.revertProperties();
        }
    }
    // Redoes the Action
    private redoAction(): void {
        let editor: Editor = this.owner.editorModule;
        switch (this.action) {
            case 'BackSpace':
                editor.singleBackspace(this.owner.selection, true);
                break;
            case 'Delete':
                editor.singleDelete(this.owner.selection, true);
                break;
            case 'DeleteTable':
                editor.deleteTable();
                break;
            case 'DeleteColumn':
                editor.deleteColumn();
                break;
            case 'DeleteRow':
                editor.deleteRow();
                break;
            case 'MergeCells':
                editor.mergeSelectedCellsInTable();
                break;
            case 'InsertRowAbove':
                editor.insertRow(true);
                break;
            case 'InsertRowBelow':
                editor.insertRow(false);
                break;
            case 'InsertColumnLeft':
                editor.insertColumn(true);
                break;
            case 'InsertColumnRight':
                editor.insertColumn(true);
                break;
            case 'SectionBreak':
                editor.insertSection(this.owner.selection, true);
                break;
            case 'SectionBreakContinuous':
                editor.insertSection(this.owner.selection, true, undefined, true);
                break;
            case 'TableAutoFitToContents':
                editor.autoFitTable('FitToContents');
                break;
            case 'TableAutoFitToWindow':
                editor.autoFitTable('FitToWindow');
                break;
            case 'TableFixedColumnWidth':
                editor.autoFitTable('FixedColumnWidth');
                break;
            case 'RemoveRowTrack':
                this.owner.selection.handleAcceptReject(true);
                break;
        }
    }
    private revertModifiedNodes(deletedNodes: IWidget[], isRedoAction: boolean, start: string, isEmptySelection: boolean): void {
        if (isRedoAction && (this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'DeleteTable'
            || this.action === 'DeleteColumn' || this.action === 'DeleteRow' || this.action === 'InsertRowAbove' ||
            this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft' || this.action === 'InsertColumnRight'
            || this.action === 'MergeCells' || this.action === 'SectionBreak' || this.action === 'SectionBreakContinuous' || this.action === 'TableAutoFitToContents' ||
            this.action === 'TableAutoFitToWindow' || this.action === 'TableFixedColumnWidth' || this.action === 'PasteColumn' || this.action === 'PasteOverwrite' || this.action === 'PasteNested')) {
            this.redoAction();
            if (this.action === 'SectionBreak' || this.action === 'SectionBreakContinuous') {
                return;
            }
        }
        if (deletedNodes.length > 0) {
            //tslint:disable-next-line:max-line-length
            if ((this.editorHistory.isUndoing && (this.action === 'RemoveRowTrack' || this.action === 'DeleteCells' ||
                this.action === 'DeleteColumn' || this.action === 'DeleteRow' || this.action === 'MergeCells'))
                || (this.action === 'InsertRowAbove' || this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft'
                //tslint:disable-next-line:max-line-length
                    || this.action === 'ClearCells' || this.action === 'InsertColumnRight' || this.action === 'Borders' || this.action === 'TableAutoFitToContents' || this.action === 'TableAutoFitToWindow' ||
                    this.action === 'TableFixedColumnWidth' || this.action === 'RemoveRowTrack' || this.action === 'PasteColumn' || this.action === 'PasteRow' || this.action === 'PasteOverwrite' || this.action === 'PasteNested')) {
                let insertIndex: string = this.selectionStart;
                let block: BlockWidget = this.owner.editorModule.getBlock({ index: insertIndex }).node as BlockWidget;
                let lastNode: IWidget = deletedNodes[deletedNodes.length - 1];
                if ((block instanceof TableWidget || block.previousRenderedWidget instanceof TableWidget || block.isInsideTable)
                    && lastNode instanceof TableWidget) {
                    if (block instanceof ParagraphWidget && !block.isInsideTable) {
                        block = block.previousRenderedWidget as BlockWidget;
                    } else if (block instanceof ParagraphWidget && block.isInsideTable) {
                        block = block.associatedCell.ownerTable;
                    }
                    block = block.combineWidget(this.viewer) as BlockWidget;
                    this.owner.editorModule.insertTableInternal(block as TableWidget, lastNode as TableWidget, false);
                    if (this.action === 'PasteColumn' || this.action === 'PasteRow' || this.action === 'PasteOverwrite' || this.action === 'PasteNested') {
                        this.removedNodes.push(block);
                    } else {
                        deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                    }
                } else if (lastNode instanceof TableWidget) {
                    this.owner.editorModule.insertBlock(lastNode as TableWidget);
                }
            } else {
                let initialStart: string = start;
                let block: BlockWidget = this.owner.editorModule.getBlock({ index: initialStart }).node as BlockWidget;
                // initialStart = blockObj.position;
                if (deletedNodes.length > 0 && (this.action === 'BackSpace' && isEmptySelection
                    || (!(block instanceof TableWidget) && !(block instanceof HeaderFooterWidget)))) {
                    let lastNode: IWidget = deletedNodes[0];
                    if (lastNode instanceof BodyWidget && !isNullOrUndefined(deletedNodes[1])) {
                        lastNode = deletedNodes[1];
                    }
                    if (this.action === 'TrackingPageBreak' || ((this.action === 'SectionBreak' || this.action === 'SectionBreakContinuous') && lastNode instanceof BodyWidget ||
                        !isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                        this.editorHistory.currentHistoryInfo.action === 'PageBreak')) {
                        lastNode = deletedNodes[1];
                    }
                    if(lastNode instanceof WCharacterFormat) {
                        const newParagraph = new ParagraphWidget();
                        newParagraph.characterFormat = lastNode;
                        this.owner.editorModule.insertNewParagraphWidget(newParagraph, true);
                        deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                        block = newParagraph;
                    }
                    if (lastNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0) {
                        this.owner.editorModule.insertNewParagraphWidget(lastNode, true);
                        if (lastNode.characterFormat.removedIds.length > 0) {
                            this.owner.editor.constructRevisionFromID(lastNode.characterFormat, undefined);
                        }
                        deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                        if (isNullOrUndefined(block)) {
                            let nextBlock: BlockWidget = this.documentHelper.selection.getNextParagraphBlock(lastNode.getSplitWidgets().pop() as BlockWidget);
                            this.owner.selection.getNextRenderedBlock((lastNode as ParagraphWidget));
                            let startParagraph: BlockWidget = this.owner.selection.start.paragraph;
                            if (nextBlock && startParagraph && startParagraph.bodyWidget instanceof BodyWidget
                                && !startParagraph.isInsideTable && !this.owner.selection.isinEndnote && !this.owner.selection.isinFootnote
                                && !startParagraph.bodyWidget.equals(nextBlock.bodyWidget)) {
                                nextBlock = undefined;
                            }
                            if (isNullOrUndefined(nextBlock)) {
                                //Sets the selection as starting of last paragraph.
                                this.owner.selection.selectParagraphInternal(lastNode as ParagraphWidget, true);
                            }
                        }
                    }
                    if (lastNode instanceof TableWidget && this.owner.selection.start.offset > 0) {
                        let firstBlock: BlockWidget = deletedNodes[deletedNodes.length - 1] as BlockWidget;
                        if (firstBlock instanceof ParagraphWidget) {
                            this.owner.editorModule.insertNewParagraphWidget(firstBlock, true);
                            deletedNodes.splice(deletedNodes.indexOf(firstBlock), 1);
                            if (isNullOrUndefined(block)) {
                                let nextBlock: BlockWidget = this.documentHelper.selection.getNextParagraphBlock(firstBlock.getSplitWidgets().pop() as BlockWidget);
                                if (isNullOrUndefined(nextBlock)) {
                                    //Sets the selection as starting of last paragraph.
                                    this.owner.selection.selectParagraphInternal(firstBlock as ParagraphWidget, true);
                                }
                            }
                        }
                    }
                }
                if (deletedNodes.length > 0) {
                    let firstNode: IWidget = deletedNodes[deletedNodes.length - 1];
                    if (block instanceof TableWidget) {
                        block = block.combineWidget(this.viewer) as TableWidget;
                        if (firstNode instanceof TableWidget) {
                            this.owner.editorModule.insertTableInternal((block as TableWidget), firstNode as TableWidget, true);
                            deletedNodes.splice(deletedNodes.indexOf(firstNode), 1);
                            this.insertPosition = start;
                            let nextWidget: BlockWidget = firstNode.getSplitWidgets().pop() as BlockWidget;
                            if (nextWidget.nextRenderedWidget instanceof TableWidget) {
                                block = nextWidget.nextRenderedWidget as TableWidget;
                            } else {
                                initialStart = start;
                                block = this.owner.editorModule.getBlock({ index: initialStart }).node as BlockWidget;
                            }
                        }
                    }
                    //Checks if first node is paragraph and current insert position is paragraph end.
                    if (firstNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0
                        && this.owner.selection.start.offset === this.owner.selection.getLineLength(this.owner.selection.start.paragraph.lastChild as LineWidget)) {
                        let editor: Editor = this.owner.editorModule;
                        editor.insertNewParagraphWidget(firstNode as ParagraphWidget, false);
                        if (firstNode.characterFormat.removedIds.length > 0) {
                            this.owner.editor.constructRevisionFromID(firstNode.characterFormat, undefined);
                        }
                        deletedNodes.splice(deletedNodes.indexOf(firstNode), 1);
                        //Removes the intermediate empty paragraph instance.
                        if (this.action !== 'Paste') {
                            editor.removeBlock(this.owner.selection.start.paragraph);
                        }
                        let paragraph: ParagraphWidget = this.documentHelper.selection.getNextParagraphBlock(firstNode.getSplitWidgets().pop() as BlockWidget);
                        if (!isNullOrUndefined(paragraph)) {
                            this.owner.selection.selectParagraphInternal(paragraph, true);
                        }
                    } else if (deletedNodes[0] instanceof TableWidget && deletedNodes.length !== 1) {
                        let nextNode: BlockWidget = deletedNodes[1] as BlockWidget;
                        if (nextNode instanceof ParagraphWidget && nextNode.isEmpty()) {
                            deletedNodes.splice(deletedNodes.indexOf(nextNode), 1);
                        }
                    }
                }
                if (deletedNodes.length > 0) {
                    if (block instanceof TableWidget) {
                        block = block.combineWidget(this.viewer) as BlockWidget;
                    }
                    this.insertRemovedNodes(deletedNodes, block);
                }
            }
        }
    }
    private insertRemovedNodes(deletedNodes: IWidget[], block: BlockWidget): void {
        for (let i: number = deletedNodes.length - 1, index: number = 0; i > -1; i--) {
            let node: IWidget = deletedNodes[i];
            if (node instanceof ElementBox) {
                this.owner.editorModule.insertInlineInSelection(this.owner.selection, node as ElementBox);
            } else if (node instanceof BlockWidget) {
                if (node instanceof TableRowWidget) {
                    if (block instanceof TableWidget) {
                        block.childWidgets.splice(index, 0, node);
                        this.owner.editorModule.updateNextBlocksIndex(node, true);
                        if (i === 0 || !(deletedNodes[i - 1] instanceof TableRowWidget)) {
                            this.documentHelper.layout.layoutBodyWidgetCollection(block.index, block.containerWidget, block, false);
                        }
                    }
                } else if (block instanceof TableWidget) {
                    this.owner.editorModule.insertBlockTable(this.owner.selection, node as BlockWidget, block as TableWidget);
                } else {
                    this.owner.editorModule.insertBlock(node);
                }
            } else if (node instanceof WCharacterFormat) {
                let insertIndex: string = this.selectionStart;
                let wiget: BlockWidget = this.owner.editorModule.getBlock({ index: insertIndex }).node as BlockWidget;
                if (wiget instanceof ParagraphWidget) {
                    if (node.removedIds.length > 0) {
                        wiget.characterFormat.removedIds = node.removedIds.slice();
                        this.owner.editor.constructRevisionFromID(wiget.characterFormat, true);
                    } else if (wiget.characterFormat.revisions.length > 0) {
                        wiget.characterFormat = node.cloneFormat();
                    }
                }
            } else if (node instanceof BodyWidget) {
                if (!isNullOrUndefined(node.removedHeaderFooters) && node.removedHeaderFooters.length !== 0) {
                    this.owner.documentHelper.headersFooters.splice(node.sectionIndex, 0, node.removedHeaderFooters[0]);
                    node.removedHeaderFooters = undefined;
                }
                this.owner.editorModule.insertSection(this.owner.selection, false, true, undefined, undefined, node.sectionFormat);
            } else if (typeof (node) === 'string' && this.action === 'AcceptTOC') {
                let insertIndex: string = this.selectionStart;
                let widget: BlockWidget = this.owner.editorModule.getBlock({ index: insertIndex }).node as BlockWidget;
                let endWidget: BlockWidget = this.owner.editorModule.getBlock({ index: this.selectionEnd }).node as BlockWidget;
                let currentRevision: Revision = this.owner.documentHelper.revisionsInternal.get(node);
                if (this.editorHistory.isUndoing) {
                    while (widget instanceof ParagraphWidget && widget !== endWidget) {
                        this.owner.editor.insertRevisionForBlock(widget, currentRevision.revisionType, true, currentRevision);
                        widget = this.documentHelper.selection.getNextParagraphBlock(widget.getSplitWidgets().pop() as BlockWidget);
                    }
                    this.owner.editor.insertRevisionForBlock(endWidget as ParagraphWidget, currentRevision.revisionType, true, currentRevision);
                } else {
                    while (currentRevision.range.length > 0) {
                        let item: ElementBox = currentRevision.range[0] as ElementBox;
                        let revisionIndex: number = item.revisions.indexOf(currentRevision);
                        if (revisionIndex >= 0) {
                            item.revisions.splice(revisionIndex, 1);
                            let rangeIndex: number = currentRevision.range.indexOf(item);
                            currentRevision.range.splice(rangeIndex, 1);
                            this.owner.trackChangesPane.updateCurrentTrackChanges(currentRevision);
                        }
                        if (currentRevision.range.length === 0) {
                            this.owner.revisions.remove(currentRevision);
                        }
                    }
                }
                this.owner.editor.addRemovedNodes(currentRevision.revisionID);
            }
        }
        deletedNodes = [];
    }

    public undoRevisionForElements(start: TextPosition, end: TextPosition, id: string): void {
        let currentPara: ParagraphWidget = start.paragraph;
        let endPara: ParagraphWidget = end.paragraph;
        let currentRevision: Revision = this.documentHelper.revisionsInternal.get(id);
        let startoffset: number = this.owner.selection.getParagraphInfo(start).offset;
        let endoffset: number = this.owner.selection.getParagraphInfo(end).offset;
        let isSamePara: boolean = start.paragraph === end.paragraph;
        if (this.editorHistory.isUndoing) {
            while (currentPara !== endPara) {
                this.owner.editor.applyRevisionForCurrentPara(currentPara, startoffset, currentPara.getLength(), id, true);
                currentPara = this.documentHelper.selection.getNextParagraphBlock(currentPara.getSplitWidgets().pop() as BlockWidget);
                if (currentPara !== endPara) {
                    startoffset = 0;
                }
            }
            if (currentPara === endPara) {
                if (!isSamePara) {
                    startoffset = 0;
                }
                this.owner.editor.applyRevisionForCurrentPara(currentPara, startoffset, endoffset, id, false);
            }
        } else {
            while (currentRevision.range.length > 0) {
                let item: ElementBox = currentRevision.range[0] as ElementBox;
                let revisionIndex: number = item.revisions.indexOf(currentRevision);
                if (revisionIndex >= 0) {
                    item.revisions.splice(revisionIndex, 1);
                    let rangeIndex: number = currentRevision.range.indexOf(item);
                    currentRevision.range.splice(rangeIndex, 1);
                    this.owner.trackChangesPane.updateCurrentTrackChanges(currentRevision);
                }
                if (currentRevision.range.length === 0) {
                    this.owner.revisions.remove(currentRevision);
                }
            }
        }
        this.removedNodes.push(id);
    }

    private revertResizing(): void {
        this.editorHistory.currentBaseHistoryInfo = this;
        if (this.action === 'RowResizing') {
            if (this.modifiedProperties[0] instanceof RowHistoryFormat) {
                (this.modifiedProperties[0] as RowHistoryFormat).revertChanges(this.editorHistory.isRedoing, this.owner);
            }
        } else {
            if (this.modifiedProperties[0] instanceof TableHistoryInfo) {
                //selected cell resizing the condition checks done based on the selected widgets only. so need to highlight the selection.
                if (this.owner.selection.selectedWidgets.length === 0) {
                    this.owner.selection.highlightSelection(true);
                }
                let prevTableHistoryInfo: TableHistoryInfo = this.modifiedProperties[0] as TableHistoryInfo;
                let position: string = prevTableHistoryInfo.tableHierarchicalIndex;
                let block: TableWidget = this.owner.editorModule.getBlock({ index: position }).node as TableWidget;
                if (block instanceof TableWidget) {
                    let tableResize: TableResizer = this.owner.editorModule.tableResize;
                    this.owner.editor.setOffsetValue(this.owner.selection);
                    block = block.combineWidget(this.owner.viewer) as TableWidget;
                    tableResize.currentResizingTable = block as TableWidget;
                    this.modifiedProperties.splice(0, 1);
                    if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
                        let tableHistoryInfoCurrent: TableHistoryInfo = new TableHistoryInfo(block, this.owner);
                        this.modifiedProperties.splice(0, 0, tableHistoryInfoCurrent);
                        this.owner.isLayoutEnabled = false;
                        tableResize.applyProperties(tableResize.currentResizingTable, prevTableHistoryInfo);
                        tableResize.currentResizingTable.isGridUpdated = true;
                        this.owner.isLayoutEnabled = true;
                        tableResize.updateGridValue(tableResize.currentResizingTable, false);
                        prevTableHistoryInfo.destroy();
                        prevTableHistoryInfo = undefined;
                    }
                }
            }
        }
    }
    private revertTableDialogProperties(action: Action): void {
        this.owner.isShiftingEnabled = false;
        this.editorHistory.currentBaseHistoryInfo = this;
        this.currentPropertyIndex = 0;
        if (action === 'CellOptions') {
            let selection: Selection = this.owner.selection;
            let cellFormat: WCellFormat = <WCellFormat>this.modifiedProperties[0];
            this.owner.editorModule.updateCellMargins(selection, cellFormat);
        } else if (action === 'TableOptions') {
            this.owner.tableOptionsDialogModule.applyTableOptionsHelper(<WTableFormat>this.modifiedProperties[0]);
        }
        this.currentPropertyIndex = 0;
        this.owner.isShiftingEnabled = true;
    }
    public addModifiedPropertiesForSection(format: WSectionFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let modifiedProperties: Object[] = this.modifiedProperties;
            let previousFormat: WSectionFormat = (this.currentPropertyIndex < modifiedProperties.length ?
                modifiedProperties[this.currentPropertyIndex] : modifiedProperties[modifiedProperties.length - 1]) as WSectionFormat;
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
            } else {
                value = previousFormat.getPropertyValue(property);
                previousFormat.copyFormat(format);
            }
            this.currentPropertyIndex++;
        } else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            } else {
                let currentFormat: WSectionFormat = new WSectionFormat();
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
        }
        return value;
    }
    public addModifiedProperties(format: WCharacterFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WCharacterFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WCharacterFormat;
            let skipRemove: boolean = false;
            if (format.ownerBase instanceof ElementBox) {
                let prevLength: number = this.modifiedNodeLength[this.currentPropertyIndex];
                if ((format.ownerBase as ElementBox).length < prevLength) {
                    skipRemove = true;
                    this.modifiedNodeLength[this.currentPropertyIndex] = (format.ownerBase as ElementBox).length;
                    this.modifiedNodeLength.splice(this.currentPropertyIndex + 1, 0, prevLength - (format.ownerBase as ElementBox).length);
                    //Adds a copy of character format at next position for splitted inline.
                    let nextFormat: WCharacterFormat = new WCharacterFormat(undefined);
                    nextFormat.copyFormat(previousFormat);
                    this.modifiedProperties.splice(this.currentPropertyIndex + 1, 0, nextFormat);
                }
            }
            if (this.action === 'ClearCharacterFormat') {
                if (this.editorHistory.isUndoing) {
                    value = previousFormat;
                    if (!skipRemove) {
                        this.modifiedProperties.splice(this.currentPropertyIndex, 1);
                        this.currentPropertyIndex--;
                    }
                } else {
                    this.modifiedProperties.push(format.cloneFormat());
                }
            } else {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
            }
            this.currentPropertyIndex++;
        } else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            } else {
                let currentFormat: WCharacterFormat = new WCharacterFormat(undefined);
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
            if (format.ownerBase instanceof ElementBox) {
                this.modifiedNodeLength.push((format.ownerBase as ElementBox).length);
            } else {
                this.modifiedNodeLength.push(0);
            }
        }
        return value;
    }
    public addModifiedPropertiesForParagraphFormat(format: WParagraphFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WParagraphFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WParagraphFormat;
            if (this.action === 'ClearParagraphFormat') {
                if (this.editorHistory.isUndoing) {
                    value = previousFormat;
                    this.modifiedProperties.splice(this.currentPropertyIndex, 1);
                    this.currentPropertyIndex--;
                } else {
                    this.modifiedProperties.push(format.cloneFormat());
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'listFormat') {
                value = new WParagraphFormat(undefined);
                (value as WParagraphFormat).copyFormat(previousFormat);
                previousFormat.listFormat = new WListFormat(previousFormat);
                previousFormat.listFormat.copyFormat(format.listFormat);
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'styleName') {
                if (!isNullOrUndefined(previousFormat.baseStyle)) {
                    value = new WParagraphStyle();
                    (value as WParagraphStyle).copyStyle(previousFormat.baseStyle as WParagraphStyle);
                    this.currentPropertyIndex++;
                    if (!isNullOrUndefined(format.baseStyle)) {
                        previousFormat.baseStyle = new WParagraphStyle();
                        (previousFormat.baseStyle as WParagraphStyle).copyStyle(format.baseStyle as WParagraphStyle);
                    }
                    return value;
                } else {
                    if (!isNullOrUndefined(format.baseStyle)) {
                        previousFormat.baseStyle = new WParagraphStyle();
                        (previousFormat.baseStyle as WParagraphStyle).copyStyle(format.baseStyle as WParagraphStyle);
                    }
                    return undefined;
                }
            }
            if (property === 'borders') {
                value = previousFormat.borders.cloneFormat();
            } else if (this.action.indexOf('Border') >= 0) {
                value = previousFormat.borders.getBorder(property.replace('Border', ''));
            } else {
                value = previousFormat.getPropertyValue(property);
            }
            previousFormat.copyFormat(format);
            this.currentPropertyIndex++;
        } else {
            if (isNullOrUndefined(property)) {
                this.modifiedProperties.push(format.cloneFormat());
            } else {
                let currentFormat: WParagraphFormat = new WParagraphFormat(undefined);
                currentFormat.copyFormat(format);
                this.modifiedProperties.push(currentFormat);
            }
        }
        return value;
    }
    public addModifiedPropertiesForContinueNumbering(paragraphFormat: WParagraphFormat, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WParagraphFormat = <WParagraphFormat>(this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            value = previousFormat;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = paragraphFormat.cloneFormat();
            } else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = paragraphFormat.cloneFormat();
            }
            this.currentPropertyIndex++;
            return value;
        } else {
            let currentFormat: WParagraphFormat = new WParagraphFormat();
            currentFormat.copyFormat(paragraphFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    }
    public addModifiedPropertiesForRestartNumbering(listFormat: WListFormat, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let listId: number = <number>(this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]);
            value = listId;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = listFormat.listId;
            } else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = listFormat.listId;
            }
            this.currentPropertyIndex++;
            return value;
        } else {
            this.modifiedProperties.push(listFormat.listId);
        }
        return value;
    }
    public addModifiedPropertiesForList(listLevel: WListLevel): Object {
        let value: Object;
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousLevel: ModifiedLevel = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as ModifiedLevel;
            value = previousLevel;
            previousLevel = new ModifiedLevel(listLevel, this.owner.editorModule.cloneListLevel(listLevel));
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = previousLevel;
            } else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = previousLevel;
            }
            this.currentPropertyIndex++;

        } else {
            this.modifiedProperties.push(new ModifiedLevel(listLevel, this.owner.editorModule.cloneListLevel(listLevel)));
            value = listLevel;
        }
        return value;
    }
    private revertProperties(): void {
        this.editorHistory.currentBaseHistoryInfo = this;
        this.currentPropertyIndex = 0;
        let property: string = this.getProperty();
        this.viewer.owner.editorModule.setOffsetValue(this.documentHelper.selection);
        if (this.action === 'ClearCharacterFormat' || this.modifiedProperties[0] instanceof WCharacterFormat) {
            if (this.action === 'ListCharacterFormat') {
                this.owner.editorModule.updateListCharacterFormat(this.documentHelper.selection, property, undefined);
                return;
            }
            this.owner.editorModule.updateSelectionCharacterFormatting(property, undefined, false);
        } else if (this.action === 'ClearParagraphFormat' || this.modifiedProperties[0] instanceof WParagraphFormat) {
            if (this.action === 'ContinueNumbering') {
                this.owner.editorModule.revertContinueNumbering(this.owner.selection, <WParagraphFormat>this.modifiedProperties[0]);
                return;
            }
            if (this.action === 'StyleName' && this.modifiedProperties[0] instanceof WParagraphFormat) {
                this.owner.editorModule.updateSelectionParagraphFormatting(property, (this.modifiedProperties[0] as WParagraphFormat).baseStyle, false);
                return;
            }
            this.owner.editor.setPreviousBlockToLayout();
            this.owner.editorModule.updateSelectionParagraphFormatting(property, undefined, false);
        } else if (this.action === 'LinkToPrevious' && this.modifiedProperties[0] instanceof WSectionFormat) {
            let sectionIndex: number = parseInt(this.selectionStart.split(';')[0]);
            this.owner.editorModule.updateHeaderFooters(property, undefined, sectionIndex, (this.modifiedProperties[0] as WSectionFormat).removedHeaderFooters[0]);
        } else if (this.modifiedProperties[0] instanceof WSectionFormat) {
            this.owner.editorModule.updateSectionFormat(property, undefined);
        } else if (this.action === 'RestartNumbering') {
            this.owner.editorModule.restartListAtInternal(this.owner.selection, <number>this.modifiedProperties[0]);
            return;
        } else if (this.modifiedProperties[0] instanceof ImageInfo) {
            this.owner.selection.updateImageSize(this.modifiedProperties[0] as ImageInfo);
        } else if (this.modifiedProperties[0] instanceof ModifiedLevel) {
            let modified: Dictionary<number, ModifiedLevel> = new Dictionary<number, ModifiedLevel>();
            for (let i: number = 0; i < this.modifiedProperties.length; i++) {
                let modifiedLevel: ModifiedLevel = this.modifiedProperties[i] as ModifiedLevel;
                // modified.modifiedLevels.add(modifiedLevel.ownerListLevel.levelNumber, modifiedLevel);
                modified.add(i, modifiedLevel);
            }
            this.editorHistory.updateListChanges(modified);
            modified.destroy();
            modified = undefined;
        } else if (this.modifiedProperties[0] instanceof WTableFormat) {
            this.owner.editorModule.updateTableFormat(this.owner.selection, property, undefined);
        } else if (this.modifiedProperties[0] instanceof WCellFormat) {
            this.owner.isShiftingEnabled = true;
            this.owner.editorModule.updateCellFormat(this.owner.selection, property, undefined);
        } else if (this.modifiedProperties[0] instanceof WRowFormat) {
            this.owner.editorModule.updateRowFormat(this.owner.selection, property, undefined);
        }
        this.currentPropertyIndex = 0;
        if (this.action === 'ClearCharacterFormat' || this.action === 'ClearParagraphFormat') {
            this.owner.editorModule.getOffsetValue(this.documentHelper.selection);
        }
    }
     public addModifiedCellOptions(applyFormat: WCellFormat, format: WCellFormat, table: TableWidget): WCellFormat {
        let currentFormat: WCellFormat;
        if (isNullOrUndefined(applyFormat.bottomMargin) && isNullOrUndefined(applyFormat.topMargin)
            && isNullOrUndefined(applyFormat.rightMargin) && isNullOrUndefined(applyFormat.leftMargin)) {
            currentFormat = this.copyCellOptions(table.tableFormat);
        } else {
            currentFormat = this.copyCellOptions(applyFormat);
        }
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WCellFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WCellFormat;
            format = previousFormat;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties[this.currentPropertyIndex] = this.copyCellOptions(applyFormat);
            } else {
                this.modifiedProperties[this.modifiedProperties.length - 1] = this.copyCellOptions(applyFormat);
            }
            this.currentPropertyIndex++;
            return format;
        } else {
            this.modifiedProperties.push(currentFormat);
        }
        return format;
    }
    private copyCellOptions(format: WCellFormat | WTableFormat): WCellFormat {
        let cellFormat: WCellFormat = new WCellFormat();
        cellFormat.topMargin = format.topMargin;
        cellFormat.rightMargin = format.rightMargin;
        cellFormat.bottomMargin = format.bottomMargin;
        cellFormat.leftMargin = format.leftMargin;
        return cellFormat;
    }
    public addModifiedTableOptions(format: WTableFormat): void {
        let currentFormat: WTableFormat = this.copyTableOptions(format);
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WTableFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WTableFormat;
            if (this.currentPropertyIndex < this.modifiedProperties.length) {
                this.modifiedProperties.splice(this.currentPropertyIndex, 1, currentFormat);
            } else {
                this.modifiedProperties.splice(this.modifiedProperties.length - 1, 1, currentFormat);
            }
            this.currentPropertyIndex++;
        } else {
            this.modifiedProperties.push(currentFormat);
        }
    }
    private copyTableOptions(format: WTableFormat): WTableFormat {
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.topMargin = format.topMargin;
        tableFormat.rightMargin = format.rightMargin;
        tableFormat.bottomMargin = format.bottomMargin;
        tableFormat.leftMargin = format.leftMargin;
        tableFormat.cellSpacing = format.cellSpacing;
        return tableFormat;
    }
    private getProperty(): string {
        switch (this.action) {
            case 'Bold':
                return 'bold';
            case 'Italic':
                return 'italic';
            case 'FontColor':
                return 'fontColor';
            case 'FontFamily':
                return 'fontFamily';
            case 'FontSize':
                return 'fontSize';
            case 'HighlightColor':
                return 'highlightColor';
            case 'BaselineAlignment':
                return 'baselineAlignment';
            case 'Strikethrough':
                return 'strikethrough';
            case 'Underline':
                return 'underline';
            case 'AfterSpacing':
                return 'afterSpacing';
            case 'BeforeSpacing':
                return 'beforeSpacing';
            case 'LeftIndent':
                return 'leftIndent';
            case 'RightIndent':
                return 'rightIndent';
            case 'FirstLineIndent':
                return 'firstLineIndent';
            case 'LineSpacingType':
                return 'lineSpacingType';
            case 'LineSpacing':
                return 'lineSpacing';
            case 'TextAlignment':
                return 'textAlignment';
            case 'ListFormat':
                return 'listFormat';
            case 'PageHeight':
                return 'pageHeight';
            case 'PageWidth':
                return 'pageWidth';
            case 'DifferentOddAndEvenPages':
                return 'differentOddAndEvenPages';
            case 'TableAlignment':
                return 'tableAlignment';
            case 'TableLeftIndent':
                return 'leftIndent';
            case 'DefaultCellSpacing':
                return 'cellSpacing';
            case 'LeftMargin':
            case 'CellLeftMargin':
            case 'DefaultCellLeftMargin':
                return 'leftMargin';
            case 'RightMargin':
            case 'CellRightMargin':
            case 'DefaultCellRightMargin':
                return 'rightMargin';
            case 'TopMargin':
            case 'CellTopMargin':
            case 'DefaultCellTopMargin':
                return 'topMargin';
            case 'BottomMargin':
            case 'CellBottomMargin':
            case 'DefaultCellBottomMargin':
                return 'bottomMargin';
            case 'CellContentVerticalAlignment':
                return 'verticalAlignment';
            case 'RowHeight':
                return 'height';
            case 'RowHeightType':
                return 'heightType';
            case 'RowHeader':
                return 'isHeader';
            case 'AllowBreakAcrossPages':
                return 'allowBreakAcrossPages';
            case 'TablePreferredWidth':
            case 'CellPreferredWidth':
                return 'preferredWidth';
            case 'TablePreferredWidthType':
            case 'CellPreferredWidthType':
                return 'preferredWidthType';
            case 'Shading':
                return 'shading';
            case 'StyleName':
                return 'styleName';
            case 'ParagraphBidi':
            case 'TableBidi':
                return 'bidi';
            case 'ContextualSpacing':
                return 'contextualSpacing';
            case 'LinkToPrevious':
                return 'linkToPrevious';
            case 'LeftBorder':
            case 'TopBorder':
            case 'RightBorder':
            case 'BottomBorder':
            case 'HorizontalBorder':
            case 'VerticalBorder':
            case 'Borders':
                return (this.action[0].toLowerCase() + this.action.slice(1));
        }
        return undefined;
    }
    private getCharacterPropertyValue(property: string, modifiedProperty: WCharacterFormat): Object {
        let value: Object;
        if (property === 'bold') {
            value = modifiedProperty.bold;
        } else if (property === 'italic') {
            value = modifiedProperty.italic;
        } else if (property === 'fontColor') {
            value = modifiedProperty.fontColor;
        } else if (property === 'fontFamily') {
            value = modifiedProperty.fontFamily;
        } else if (property === 'fontSize') {
            value = modifiedProperty.fontSize;
        } else if (property === 'highlightColor') {
            value = modifiedProperty.highlightColor;
        } else if (property === 'baselineAlignment') {
            value = modifiedProperty.baselineAlignment;
        } else if (property === 'strikethrough') {
            value = modifiedProperty.strikethrough;
        } else if (property === 'underline') {
            value = modifiedProperty.underline;
        }
        return value;
    }
    public addModifiedTableProperties(format: WTableFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousTableFormat: WTableFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WTableFormat;
            if (isNullOrUndefined(property)) {
                value = previousTableFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = format.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = format.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'shading') {
                value = previousTableFormat.shading;
            } else {
                value = previousTableFormat.getPropertyValue(property);
            }
            previousTableFormat.copyFormat(format);
            this.currentPropertyIndex++;
        } else {
            let currentFormat: WTableFormat = new WTableFormat();
            currentFormat.copyFormat(format);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    }
    public addModifiedRowProperties(rowFormat: WRowFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WRowFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WRowFormat;
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = rowFormat.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = rowFormat.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            value = previousFormat.getPropertyValue(property);
            previousFormat.copyFormat(rowFormat);
            this.currentPropertyIndex++;
        } else {
            let currentFormat: WRowFormat = new WRowFormat();
            currentFormat.copyFormat(rowFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    }
    public addModifiedCellProperties(cellFormat: WCellFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            let previousFormat: WCellFormat = (this.currentPropertyIndex < this.modifiedProperties.length ? this.modifiedProperties[this.currentPropertyIndex] : this.modifiedProperties[this.modifiedProperties.length - 1]) as WCellFormat;
            if (isNullOrUndefined(property)) {
                value = previousFormat;
                if (this.currentPropertyIndex < this.modifiedProperties.length) {
                    this.modifiedProperties[this.currentPropertyIndex] = cellFormat.cloneFormat();
                } else {
                    this.modifiedProperties[this.modifiedProperties.length - 1] = cellFormat.cloneFormat();
                }
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'shading') {
                value = previousFormat.shading;
            } else {
                value = previousFormat.getPropertyValue(property);
            }
            previousFormat.copyFormat(cellFormat);
            this.currentPropertyIndex++;
        } else {
            let currentFormat: WCellFormat = new WCellFormat();
            currentFormat.copyFormat(cellFormat);
            this.modifiedProperties.push(currentFormat);
        }
        return value;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.selectionStart = undefined;
        this.selectionEnd = undefined;
        this.insertPosition = undefined;
        this.endPosition = undefined;
        if (!isNullOrUndefined(this.modifiedNodeLength)) {
            this.modifiedNodeLength = [];
            this.modifiedNodeLength = undefined;
        }
        if (!isNullOrUndefined(this.modifiedProperties)) {
            for (let i: number = 0; i < this.modifiedProperties.length; i++) {
                let property: object = this.modifiedProperties[i];
                if (property instanceof WCharacterFormat) {
                    (property as WCharacterFormat).destroy();
                } else if (property instanceof WParagraphFormat) {
                    (property as WParagraphFormat).destroy();
                } else if (property instanceof WSectionFormat) {
                    (property as WSectionFormat).destroy();
                } else if (property instanceof ModifiedLevel) {
                    (property as ModifiedLevel).destroy();
                }
                this.modifiedProperties.splice(this.modifiedProperties.indexOf(property), 1);
                i--;
            }
            this.modifiedPropertiesIn = undefined;
        }
        if (!isNullOrUndefined(this.removedNodes)) {
            for (let i: number = 0; i < this.removedNodes.length; i++) {
                let node: IWidget = this.removedNodes[i];
                if (node instanceof ParagraphWidget) {
                    (node as ParagraphWidget).destroyInternal(this.viewer);
                } else if (node instanceof ElementBox && !(node instanceof CommentCharacterElementBox)) {
                    (node as ElementBox).destroy();
                }
                this.removedNodes.splice(this.removedNodes.indexOf(node), 1);
                i--;
            }
            this.removedNodesIn = undefined;
        }
        if (!isNullOrUndefined(this.insertedNodes)) {
            for (let i: number = 0; i < this.insertedNodes.length; i++) {
                let node: IWidget = this.insertedNodes[i];
                if (node instanceof ParagraphWidget) {
                    (node as ParagraphWidget).destroyInternal(this.viewer);
                } else if (node instanceof ElementBox && !(node instanceof CommentCharacterElementBox)) {
                    (node as ElementBox).destroy();
                }
                this.insertedNodes.splice(this.insertedNodes.indexOf(node), 1);
                i--;
            }
            this.insertedNodes = undefined;
        }
        this.ownerIn = undefined;
    }

    /**
     * @private
     */
    public getDeleteOperationsForTrackChanges(): Operation[] {
        let operations: Operation[] = [];
        for (let i = this.removedNodes.length - 1; i >= 0; i--) {
            let element: ElementBox = this.removedNodes[i] as ElementBox;
            let operation: Operation = this.getDeleteOperationForTrackChanges(element);
            if (!isNullOrUndefined(operation)) {
                operations.push(operation);
            }
        }
        return operations.reverse();
    }
    /**
     * @private
     */
    public getDeleteOperationForTrackChanges(element: ElementBox): Operation {
        let operation: Operation;
        if (element instanceof TextElementBox || element instanceof ImageElementBox || element instanceof FieldElementBox || element instanceof BookmarkElementBox) {
            if ((element as TextElementBox).removedIds.length === 0) {
                operation = this.getFormatOperation(element);
            } else if ((element as TextElementBox).removedIds.length > 0) {
                let revisionId = (element as TextElementBox).removedIds[0];
                let revision: Revision = this.owner.editor.getRevision(revisionId);
                let currentUser: string = this.owner.currentUser === ''? 'Guest user': this.owner.currentUser;
                if (revision.revisionType === 'Insertion' && revision.author !== currentUser) {
                    operation = this.getFormatOperation(element);
                } else if (revision.revisionType === 'Insertion') {
                    operation = this.getDeleteOperation(this.action, undefined, this.getRemovedText(element));
                } else if (revision.revisionType === 'Deletion') {
                    if (revision.author !== currentUser) {
                        operation = this.getFormatOperation(element);
                        if (element.removedIds.length > 0) {
                            for (let i = 0; i < element.removedIds.length; i++) {
                                if (!isNullOrUndefined(operation.markerData.removedIds)) {
                                    operation.markerData.removedIds = [];
                                }
                                operation.markerData.removedIds.push(element.removedIds[i]);
                            }
                        }
                    }
                }
            }
        } else if (element instanceof ParagraphWidget) {
            if ((element as ParagraphWidget).characterFormat.revisions.length > 0) {
                operation = this.getDeleteOperation(this.action);
            } else if ((element as ParagraphWidget).characterFormat.removedIds.length > 0) {
                operation = this.getDeleteOperation(this.action);
            } else if ((element as ParagraphWidget).characterFormat.revisions.length === 0) {
                operation = this.getFormatOperation();
            }
            this.startIndex++;
        }
        if (this.action !== 'Enter' && !(element instanceof ParagraphWidget) && (isNullOrUndefined(operation) || operation.action !== 'Delete')) {
            this.startIndex += element.length;
        }
        return operation;
    }
    /**
     * @private
     */
    public getActionInfo(isInvertOperation?: boolean): Operation[] {
        let action: Action = this.action;
        if (!isNullOrUndefined(this.isAcceptOrReject) && this.isAcceptOrReject === 'Reject') {
            action = 'Reject Change';
        }
        let operations: Operation[] = [];
        switch (action.toString()) {
            case 'Insert':
            case 'Enter':
            case 'InsertInline':
            case 'SectionBreak':
            case 'SectionBreakContinuous':
                if (this.removedNodes.length > 0 && isNullOrUndefined(this.dropDownIndex)) {
                    if (this.owner.enableTrackChanges) {
                        operations = this.getDeleteOperationsForTrackChanges();
                        if (action !== 'InsertInline') {
                            this.insertIndex = this.startIndex;
                        }
                    } else {
                        operations.push(this.getDeleteOperation(action));
                    }
                }
                if (action === 'Enter' || this.insertedText.length > 0) {
                    let operation: Operation = this.getInsertOperation(action);
                    if (this.owner.enableTrackChanges && this.action !== 'Enter') {
                        if (this.insertedElement instanceof FootnoteElementBox) {
                            operation.markerData = this.markerData[0];
                            this.markerData.splice(0, 1);
                            operation.text = CONTROL_CHARACTERS.Marker_Start;
                            operation.markerData.type = (this.insertedElement as FootnoteElementBox).footnoteType;
                            operation.markerData.revisionForFootnoteEndnoteContent = this.markerData.pop();
                        }
                        // if (action === 'InsertInline') {
                            operations.push(operation);
                        // }
                        // else {
                        //     operations.splice(0, 0, operation);
                        // }
                        for (let i = 0; i < this.splittedRevisions.length; i++) {
                            if (isNullOrUndefined(operation.markerData)) {
                                operation.markerData = {};
                            }
                            if (isNullOrUndefined(operation.markerData.splittedRevisions)) {
                                operation.markerData.splittedRevisions = [];
                            }
                            operation.markerData.splittedRevisions.push(this.splittedRevisions[i]);
                        }
                    } else {
                        operations.push(operation);
                    }
                }
                let operation2 = operations[operations.length - 1];
                if (action === 'Insert' && !isNullOrUndefined(operation2.text)) {
                    operation2.length = operation2.text.length;
                }
                if (!isNullOrUndefined(this.dropDownIndex)) {
                    operation2.markerData = { 'type': 'Field', 'dropDownIndex': this.dropDownIndex };
                    operation2.offset = this.getElementAbsolutePosition(this.fieldBegin);
                    operation2.type = 'DropDown';
                }
                break;
            case 'InsertTable':
            case 'InsertTableBelow':
            case 'InsertRowAbove':
            case 'InsertRowBelow':
                if (this.removedNodes.length > 0 && (action === 'InsertTable' || action === 'InsertTableBelow')) {
                    operations.push(this.getDeleteOperation(action));
                }
                let tableRowOperation: Operation[] = this.buildTableRowCellOperation(action);
                for(let i: number = 0; i < tableRowOperation.length; i++) {
                    operations.push(tableRowOperation[i]);
                }
                break;
            case 'InsertColumnLeft':
            case 'InsertColumnRight':
                let tableCellOperation: Operation[] = this.buildTableRowCellOperation(action);
                operations = tableCellOperation.reverse().slice();
                break;
            case 'BackSpace':
            case 'Delete':
            case 'Cut':
            case 'DeleteBookmark':
            case 'RemoveEditRange':
                if (this.removedNodes.length > 0) {
                    if (this.owner.enableTrackChanges) {
                        operations = this.getDeleteOperationsForTrackChanges();
                    } else {
                        let deleteOperation: Operation = this.getDeleteOperation(action);
                        operations.push(deleteOperation);
                        for (let i = 0; i < this.removedNodes.length; i++) {
                            let element: ElementBox = this.removedNodes[i] as ElementBox;
                            if (element instanceof BodyWidget) {
                                let headersFooters: HeaderFooters[] = element.removedHeaderFooters;
                                for (let j = 0; j < headersFooters.length; j++) {
                                    let headerFooter: HeaderFooters = headersFooters[j];
                                    let keysLength: number = Object.keys(headerFooter).length;
                                    if (keysLength > 0) {
                                        operations.push(this.getDeleteOperation('DeleteHeaderFooter', undefined));
                                        break;
                                    }
                                }
                            }
                        }
                        if (action === 'DeleteBookmark' || action === 'RemoveEditRange') {
                            operations.push(this.getDeleteOperation(action, true));
                            if (action === 'RemoveEditRange') {
                                let operation = operations[operations.length - 1];
                                operation.offset -= 1;
                            }
                        }
                    }
                }
                break;
            case 'ResolveComment':
            case 'EditComment':
                for (let i = 0; i < this.removedNodes.length; i++) {
                    let operation: Operation = this.getUpdateOperation();
                    operations.push(this.getCommentOperation(operation, this.removedNodes[i] as CommentElementBox));
                }
                break;
            case 'ClearRevisions':
            case 'TrackingPageBreak':
                if (this.removedNodes.length > 0) {
                    let revision: Revision = this.owner.editor.getRevision(this.removedNodes[0] as string);
                    if (action === 'TrackingPageBreak') {
                        if (!(typeof this.removedNodes[0] === 'string')) {
                            let operation: Operation = this.getDeleteOperation(action);
                            operation.markerData.isAcceptOrReject = 'Reject';
                            operations.push(operation);
                            break;
                        }
                    }
                    if (revision.revisionType === 'Insertion') {
                        // Accept operation - Insertion
                        this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision, 'Accept'));
                        let operation: Operation = this.getFormatOperation();
                        operations.push(operation);
                    } else if (revision.revisionType === 'Deletion') {
                        // Reject operation - Deletion
                        this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision, 'Reject'));
                        let operation: Operation = this.getFormatOperation();
                        operations.push(operation);
                    }
                }
                break;
            case 'Reject Change':
                let operation: Operation = this.getDeleteOperation(action);
                operation.markerData.isAcceptOrReject = 'Reject';
                operations.push(operation);
                break;
            case 'Accept Change':
                let deleteOperation: Operation = this.getDeleteOperation(action);
                deleteOperation.markerData.isAcceptOrReject = 'Accept';
                operations.push(deleteOperation);
                break;
            case 'Paste':
                if (this.removedNodes.length > 0) {
                    operations.push(this.getDeleteOperation(action));
                } else {
                    let pasteOperation: Operation = {
                        action: 'Insert',
                        offset: this.startIndex,
                        length: this.getPasteContentLength(),
                        pasteContent: JSON.stringify(this.pasteContent),
                        type: this.type
                    }
                    operations.push(pasteOperation);
                }
                break;
            case 'InsertHyperlink':
                if (this.isEditHyperlink) {
                    operations = this.getEditHyperlinkOperation();
                } else {
                    operations = this.getFieldOperation();
                }
                break;
            case 'UpdateFormField':
                this.insertedText = '';
                let operation1: Operation = this.getInsertOperation('UpdateFormField');
                operation1.text = CONTROL_CHARACTERS.Marker_Start;
                operation1.markerData = { 'type': 'Field', 'checkBoxValue': (this.fieldBegin.formFieldData as CheckBoxFormField).checked };
                operation1.offset = this.getElementAbsolutePosition(this.fieldBegin);;
                operations.push(operation1);
                break;
            case 'DeleteRow':
            case 'DeleteCells':
            case 'DeleteColumn':
            case 'DeleteTable':
            case 'ClearCells':
            case 'MergeCells':
                if (this.removedNodes.length > 0) {
                    if(this.cellOperation.length > 0) {
                        // For delete column and delete cell.
                        for(let i: number = 0; i < this.cellOperation.length; i++) {
                            operations.push(this.cellOperation[i]);
                        }
                        if (action === 'MergeCells') {
                            operations.push(this.getPasteMergeOperation());
                            operations.push(this.getFormatOperation());
                        } else {
                            operations.reverse();
                        }
                    } else {
                        if (this.owner.enableTrackChanges) {
                            operations.push(this.getFormatOperation(undefined, action));
                        } else {
                            operations.push(this.getDeleteOperation(action));
                        }
                    }
                }
                break;
            case 'RemoveRowTrack':
                if (this.removedNodes.length > 0) {
                    if(this.removedNodes[0] instanceof TableWidget) {
                        // this.afterInsertTableRrevision();
                        operations = this.cellOperation.slice();
                    }
                }
                break;

            case 'RowResizing':
            case 'CellResizing':
                operations = this.getResizingOperation(action);
                break;
            case 'ImageResizing':
                operations.push(this.getFormatOperation());
                break;
            case 'Bold':
            case 'Italic':
            case 'Underline':
            case 'FontSize':
            case 'Strikethrough':
            case 'BaselineAlignment':
            case 'HighlightColor':
            case 'FontColor':
            case 'FontFamily':
            case 'Uppercase':
            case 'CharacterFormat':
                let charFormatOperation: Operation[] = this.buildFormatOperation(action, true, false);
                operations = charFormatOperation.slice();
            break;
            case 'AfterSpacing':
            case 'BeforeSpacing':
            case 'RightIndent':
            case 'LeftIndent':
            case 'FirstLineIndent':
            case 'LineSpacing':
            case 'LineSpacingType':
            case 'TextAlignment':
            case 'Borders':
            case 'TopBorder':
            case 'BottomBorder':
            case 'LeftBorder':
            case 'RightBorder':
            case 'HorizontalBorder':
            case 'VerticalBorder':
            case 'ListFormat':
            case 'ParagraphFormat':
            case 'StyleName':
            case 'ClearParagraphFormat':
            case 'SpaceBeforeAuto':
            case 'SpaceAfterAuto':
            case 'ParagraphBidi':
            case 'ContextualSpacing':
            case 'ContinueNumbering':
                if (action === 'ContinueNumbering') {
                    this.type = action.toString();
                }
                if (action === 'Borders' && this.removedNodes[this.removedNodes.length - 1] instanceof TableWidget) {
                    this.insertedText = CONTROL_CHARACTERS.Cell;
                    this.createCellFormat(action);
                    operations = this.getSelectedCellOperation(action, undefined, true);
                    break;
                }
                let paraFormatOperation: Operation[] = this.buildFormatOperation(action, false, false);
                operations = paraFormatOperation.slice();
                break;
            case 'TableAlignment':
            case 'DefaultCellSpacing':
            case 'TableLeftIndent':
            case 'DefaultCellLeftMargin':
            case 'DefaultCellRightMargin':
            case 'DefaultCellTopMargin':
            case 'DefaultCellBottomMargin':
            case 'TablePreferredWidth':
            case 'TablePreferredWidthType':
            case 'TableBidi':
                this.createTableFormat(action);
                operations.push(this.getFormatOperation());
                this.insertedTableFormat = undefined;
                break;
            case 'RestartNumbering':
                this.type = action.toString();
                let numberingOperation: Operation = this.getFormatOperation(undefined, action);
                this.createListFormat(action, numberingOperation);
                operations.push(numberingOperation);
                break;
            case 'Shading':
                this.createCellFormat(action);
                operations = this.getSelectedCellOperation(action, undefined, undefined, true);
                break;
            case 'TableAutoFitToContents':
            case 'TableAutoFitToWindow':
            case 'TableFixedColumnWidth':
                this.createTableFormat(action);
                operations.push(this.getFormatOperation(undefined, action));
                this.insertedTableFormat = undefined;
                break;
            case 'SectionFormat':
            case 'HeaderDistance':
            case 'FooterDistance':
            case 'DifferentFirstPage':
            case 'DifferentOddAndEvenPages':
            case 'PageWidth':
            case 'PageHeight':
            case 'LeftMargin':
            case 'TopMargin':
            case 'RightMargin':
            case 'BottomMargin':
            case 'RestartPageNumbering':
            case 'PageStartingNumber':
            case 'EndnoteNumberFormat':
            case 'FootNoteNumberFormat':
            case 'RestartIndexForEndnotes':
            case 'RestartIndexForFootnotes':
            case 'InitialFootNoteNumber':
            case 'InitialEndNoteNumber':
            case 'LineBetweenColumns':
            case 'EqualWidth':
            case 'BreakCode':
            case 'LinkToPrevious':
                this.createSectionFormat(action);
                operations.push(this.getFormatOperation(undefined, action));
                if (action === 'LinkToPrevious') {
                    let operation = operations[operations.length - 1];
                    operation.offset = this.insertIndex;
                }
            break;
            case 'RowHeight':
            case 'RowHeightType':
            case 'AllowBreakAcrossPages':
            case 'RowHeader':
                this.createRowFormat(action);
                operations.push(this.getFormatOperation(undefined, action));
                this.insertedRowFormat = undefined;
                break;
            case 'CellContentVerticalAlignment':
            case 'CellLeftMargin':
            case 'CellRightMargin':
            case 'CellBottomMargin':
            case 'CellTopMargin':
            case 'CellPreferredWidth':
            case 'Shading':
            case 'CellPreferredWidthType':
                this.createCellFormat(action);
                operations = this.getSelectedCellOperation(action).slice();
                this.insertedCellFormat = undefined;
                break;
        }
        return operations;
    }
    /**
     * @private
     */
    private getElementAbsolutePosition(element: ElementBox): number {
        if (element) {
            let offset: number = element.line.getOffset(element, element.length);
            let startOffset: string = this.owner.selection.getHierarchicalIndex(element.line.paragraph, offset.toString());
            let startIndex: number = this.owner.selection.getAbsolutePositionFromRelativePosition(startOffset);
            return startIndex;
        }
        return undefined;
    }
    /**
     * @private
     */
    public getFieldOperation(): Operation[] {
        let operations: Operation[] = [];
        let element: ElementBox = this.fieldBegin;
        let isFieldEnd: boolean = false;
        let elementOffset = this.insertIndex;
        if (!isNullOrUndefined(element)) {
            do {
                let insertedText;
                let Data: MarkerData;
                let elementLength;
                let characterFormat;
                let type;
                if (element instanceof FieldElementBox) {
                    if (element.fieldType === 0 && this.getRemovedText() !== '') {
                        operations.push(this.getDeleteOperation('Delete'));
                        let operation: Operation = operations[operations.length - 1];
                        operation.offset = elementOffset;
                        if (!isNullOrUndefined(operation.markerData) && this.owner.enableTrackChanges) {
                            operation.markerData.isSkipTracking = true;
                        }
                    }
                    insertedText = element.fieldType === 0 ? CONTROL_CHARACTERS.Marker_Start : element.fieldType === 1 ? CONTROL_CHARACTERS.Marker_End : element.fieldType === 2 ? CONTROL_CHARACTERS.Field_Separator : '';
                    
                    if (element.fieldType === 0 && element.formFieldData) {
                        type = this.formFieldType;
                        Data = this.markerData.pop();
                        if (isNullOrUndefined(Data)) {
                            Data = {};
                        }
                        Data.type = 'Field';
                        Data.formFieldData = element.formFieldData;
                    } else {
                        Data = this.markerData.pop();
                        if (isNullOrUndefined(Data)) {
                            Data = {};
                        }
                        Data.type = 'Field';
                    }
                    elementLength = element.length;
                } else if (this.fieldBegin.formFieldData && element instanceof BookmarkElementBox) {
                    insertedText = element.bookmarkType === 0 ? CONTROL_CHARACTERS.Marker_Start : CONTROL_CHARACTERS.Marker_End;
                    Data = {'bookmarkName': element.name, 'type':'Bookmark'};
                    elementLength = element.length;
                } else if (element instanceof TextElementBox) {
                    insertedText = element.text;
                    elementLength = element.length;
                    Data = this.markerData.pop();
                }
                if (!(element instanceof BookmarkElementBox)) {
                    let characterData: any = {}
                    HelperMethods.writeCharacterFormat(characterData, false, element.characterFormat);
                    characterFormat = JSON.stringify(characterData);
                }
                let operation: Operation = {
                    action: 'Insert',
                    offset: elementOffset,
                    type: type,
                    text: insertedText,
                    length: elementLength,
                    markerData: Data,
                    characterFormat: characterFormat
                }
                operations.push(operation);
                elementOffset += element.length;
                Data = undefined;
                type = undefined;
                characterFormat = undefined;
                if (element instanceof FieldElementBox && element.fieldType === 1) {
                    isFieldEnd = true;
                    if (this.fieldBegin.formFieldData && element.nextNode instanceof BookmarkElementBox) {
                        let elementBox: BookmarkElementBox = element.nextNode;
                        insertedText = elementBox.bookmarkType === 0 ? CONTROL_CHARACTERS.Marker_Start : CONTROL_CHARACTERS.Marker_End;
                        Data = {'bookmarkName': elementBox.name, 'type':'Bookmark'};
                        elementLength = elementBox.length;
                        let operation: Operation = {
                            action: 'Insert',
                            offset: elementOffset,
                            text: insertedText,
                            length: elementLength,
                            markerData: Data
                        };
                        operations.push(operation);
                    }
                }
                element = element.nextNode;
            } while (!isFieldEnd && !isNullOrUndefined(element));
        }
        return operations;
    }

    private getEditHyperlinkOperation(): Operation[] {
        let operations: Operation[] = [];
        let element = this.fieldBegin
        if (element) {
            let startIndex: number = this.getElementAbsolutePosition(element);
            operations.push(this.getDeleteOperation('Delete'));
            let operation = operations[operations.length - 1];
            operation.offset = startIndex;
            let fieldCode: string = this.getRemovedFieldCode();
            operation.length = fieldCode.length;
            operation.text = fieldCode;
            operations.push(this.getInsertOperation('InsertHyperlink'));
            operation = operations[operations.length - 1];
            operation.offset = startIndex;
            fieldCode = this.owner.selection.getFieldCode(element);;
            operation.text = fieldCode;
            operation.length = fieldCode.length;
        }
        return operations;
    }

    private getPasteContentLength(): number {
        let length: number = 0;
        for (let i: number = 0; i < this.insertedNodes.length; i++) {
            let block: BlockWidget = this.insertedNodes[i] as BlockWidget;
            length += this.owner.selection.getBlockLength(undefined, block, 0, { done: false }, true, undefined, undefined);
        }
        return length;
    }
    /**
     * @private
     * @returns {Operation}
     */
    public getUpdateOperation(): Operation {
        let operation: Operation = {
            action: 'Update'
        }
        return operation;
    }
    private getResizingOperation(action: Action): Operation [] {
        let operations: Operation[] = [];
        let tableResize = this.owner.editor.tableResize;
        let table: TableWidget = tableResize.currentResizingTable;
        if (!isNullOrUndefined(table.childWidgets)) {
            table = table.combineWidget(this.owner.viewer) as TableWidget;
            let resizerPosition: number = tableResize.resizerPosition;
            let paragraphInfo: ParagraphInfo = { 'paragraph': null, 'offset': 0 };
            if (action == 'RowResizing') {
                let row: TableRowWidget = table.childWidgets[resizerPosition] as TableRowWidget;
                this.insertIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, row).position;
                let rowFormat: any = {};
                if (!isNullOrUndefined(this.owner.sfdtExportModule)) {
                    this.owner.sfdtExportModule.assignRowFormat(rowFormat, row.rowFormat, 0);
                }
                this.insertedRowFormat = JSON.stringify(rowFormat);
                this.insertedText = CONTROL_CHARACTERS.Row;
                operations.push(this.getFormatOperation());
            } else {
                let rightColumnIndex: number = resizerPosition;
                let leftColumnIndex: number = resizerPosition - 1;
                this.insertedText = CONTROL_CHARACTERS.Cell;
                let tableFormat: any = {};
                tableFormat = this.owner.sfdtExportModule ? this.owner.sfdtExportModule.writeTableFormat(table.tableFormat, 0) : {};
                this.insertedTableFormat = JSON.stringify(tableFormat);
                if (!this.owner.selection.isEmpty) {
                    const selectedCells: TableCellWidget[] = this.owner.selection.getSelectedCells();
                    let startCell: TableCellWidget = selectedCells[0] as TableCellWidget;
                    let endCell: TableCellWidget = selectedCells[selectedCells.length - 1] as TableCellWidget;
                    let rowStartIndex: number = table.childWidgets.indexOf(startCell.ownerRow);
                    let count: number = table.childWidgets.indexOf(endCell.ownerRow);
                    let row: TableRowWidget = table.childWidgets[rowStartIndex] as TableRowWidget;
                    while (row && row.index <= count) {
                        let cell: TableCellWidget = row.firstChild as TableCellWidget;
                        while(cell) {
                            if (cell.index == rightColumnIndex || cell.index == leftColumnIndex) {
                                let rowFormat: any = {};
                                let cellFormat: any = {};
                                if (!isNullOrUndefined(this.owner.sfdtExportModule)) {
                                    this.owner.sfdtExportModule.assignRowFormat(rowFormat, row.rowFormat, 0);
                                    cellFormat = this.owner.sfdtExportModule.writeCellFormat(cell.cellFormat, 0)
                                }
                                this.insertIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
                                this.insertedCellFormat = JSON.stringify(cellFormat);
                                this.insertedRowFormat = JSON.stringify(rowFormat);
                                operations.push(this.getFormatOperation());
                            }
                            cell = cell.nextWidget as TableCellWidget;
                        }
                        row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
                    }

                } else {
                    let row: TableRowWidget = table.firstChild as TableRowWidget;
                    while (row) {
                        let cell: TableCellWidget = row.firstChild as TableCellWidget;
                        while(cell) {
                            if (cell.index == rightColumnIndex || cell.index == leftColumnIndex) {
                                let rowFormat: any = {};
                                let cellFormat: any = {};
                                if (!isNullOrUndefined(this.owner.sfdtExportModule)) {
                                    this.owner.sfdtExportModule.assignRowFormat(rowFormat, row.rowFormat, 0);
                                    cellFormat = this.owner.sfdtExportModule.writeCellFormat(cell.cellFormat, 0)
                                }
                                this.insertIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
                                this.insertedCellFormat = JSON.stringify(cellFormat);
                                this.insertedRowFormat = JSON.stringify(rowFormat);
                                operations.push(this.getFormatOperation());
                            }
                            cell = cell.nextWidget as TableCellWidget;
                        }
                        row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
                    }
                }
            }
            this.owner.documentHelper.layout.reLayoutTable(table);
        }
        this.insertedCellFormat = undefined;
        this.insertedRowFormat = undefined;
        this.insertedTableFormat = undefined;
        return operations;
    }
    /**
     * @private
     * @returns {Operation}
     */
    public getDeleteOperation(action: Action, setEndIndex?: boolean, text?: string): Operation {
        // if (action === 'Delete' && this.endIndex === this.startIndex) {
        //     this.startIndex++;
        //     this.endIndex++;
        // }
        if (action === 'Delete' && this.endIndex < this.startIndex) {
            let start: number = this.startIndex;
            this.startIndex = this.endIndex;
            this.endIndex = start;
        }
        if (this.endIndex === this.startIndex && action !== 'DeleteBookmark' && action !== 'RemoveEditRange' && this.action !== 'InsertHyperlink') {
            if(action === 'BackSpace') {
                this.startIndex--;
            } else {
                this.endIndex++;
            }
        }
        if (action === 'DeleteHeaderFooter') {
            this.startIndex = this.headerFooterStart;
            this.endIndex = this.headerFooterEnd;
        }
        let selectionLength: number = !isNullOrUndefined(text)? text.length: this.endIndex - this.startIndex;
        let removedText: string;
        if (action === 'DeleteBookmark' || action === 'RemoveEditRange') {
            removedText = this.insertedText;
            selectionLength = 1;
        } else if (action === 'DeleteHeaderFooter') {
            removedText === '';
        } else if (action === 'DeleteTable' || action === 'DeleteRow' || action === 'DeleteColumn' || action === 'MergeCells' || action === 'RemoveRowTrack') {
            removedText = this.insertedText;
            if (action !== 'DeleteTable' && action !== 'DeleteRow') {
                selectionLength = this.tableRelatedLength;
            }
        } else {
            removedText = !isNullOrUndefined(text)? text: this.getRemovedText();
        }
        if (action === 'Cut' && removedText[removedText.length - 1] === ' ' && selectionLength < removedText.length) {
            selectionLength = removedText.length;
        }
        let operation: Operation = {
            action: 'Delete',
            offset: setEndIndex ? this.endIndex : this.startIndex,
            text: removedText,
            length: (action === 'Paste' || selectionLength === 0) ? removedText.length : selectionLength,
            skipOperation: action === 'DeleteHeaderFooter' ? true : undefined,
            markerData: this.markerData[0],
        }
        if (this.removedNodes[0] instanceof FootnoteElementBox) {
            let element: ElementBox = this.removedNodes[0] as ElementBox;
            let lastPara: ParagraphWidget = (element as FootnoteElementBox).bodyWidget.lastChild as ParagraphWidget;
            let positionInfo: AbsolutePositionInfo = { position: 0, done: false};
            let paragraphInfo: ParagraphInfo = { paragraph: lastPara, offset: this.owner.selection.getParagraphLength(lastPara) + 1 };
            this.owner.selection.getPositionInfoForBodyContent(paragraphInfo, positionInfo, (element as FootnoteElementBox).bodyWidget.firstChild as ParagraphWidget);
            operation.length += positionInfo.position;
        }
        return operation;
    }

    /**
     * @private
     * @returns {Operation}
     */
    public getInsertOperation(action: Action): Operation {
        let insertedText: string = action === 'Enter' ? '\n' : this.insertedText;
        let length: number;
        if(action === 'InsertTable' || action === 'InsertTableBelow' || action === 'InsertRowAbove' || action === 'InsertRowBelow'
            || action === 'InsertColumnLeft' || action === 'InsertColumnRight' || action === 'MergeCells' || action === 'RemoveRowTrack') {
            length = this.tableRelatedLength;
            if (this.action === 'InsertTable' || this.action === 'InsertTableBelow') {
                this.insertIndex = this.startIndex;
            }
        } else {
            if (!isNullOrUndefined(insertedText)) {
                length = insertedText.length;
            }
        }
        let operation: Operation = {
            action: 'Insert',
            offset: this.insertIndex,
            text: insertedText,
            type: this.type,
            length: length,
            skipOperation: false,
            imageData: this.insertedData,
            tableFormat: this.insertedTableFormat,
            rowFormat: this.insertedRowFormat,
            cellFormat: this.insertedCellFormat,
            paragraphFormat: this.insertedParagraphFormat,
            characterFormat: this.insertedCharacterFormat,
        }
        if (!isNullOrUndefined(this.markerData)) {
            operation.markerData = this.markerData.pop();
        }
        if (this.insertedElement instanceof FootnoteElementBox) {
            let lastPara: ParagraphWidget = (this.insertedElement as FootnoteElementBox).bodyWidget.lastChild as ParagraphWidget;
            let positionInfo: AbsolutePositionInfo = { position: 0, done: false};
            let paragraphInfo: ParagraphInfo = {paragraph: lastPara, offset: this.owner.selection.getParagraphLength(lastPara)+1};
            this.owner.selection.getPositionInfoForBodyContent(paragraphInfo, positionInfo, (this.insertedElement as FootnoteElementBox).bodyWidget.firstChild as ParagraphWidget);
            operation.length += positionInfo.position;
        }
        if (this.insertedElement instanceof FootnoteElementBox) {
            let lastPara: ParagraphWidget = (this.insertedElement as FootnoteElementBox).bodyWidget.lastChild as ParagraphWidget;
            let positionInfo: AbsolutePositionInfo = { position: 0, done: false};
            let paragraphInfo: ParagraphInfo = {paragraph: lastPara, offset: this.owner.selection.getParagraphLength(lastPara)+1};
            this.owner.selection.getPositionInfoForBodyContent(paragraphInfo, positionInfo, (this.insertedElement as FootnoteElementBox).bodyWidget.firstChild as ParagraphWidget);
            operation.length += positionInfo.position;
        }
        return operation;
    }

    // Builds the Table and Row operation.
    private buildTableRowCellOperation(action: Action): Operation[] {
        let operations: Operation[] = [];
        if (this.insertedNodes.length > 0) {
            if(this.insertedNodes[0] instanceof TableRowWidget) {
                let row: TableRowWidget= this.insertedNodes[0] as TableRowWidget;
                let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
                this.insertIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, this.insertedNodes[0] as TableRowWidget).position;
                let length: number = this.insertedNodes.length;
                if(row.ownerTable.childWidgets.length === row.indexInOwner + length) {
                    this.insertIndex -= 1;
                }
            }
            for (let i: number = 0; i < this.insertedNodes.length; i++) {
                if (this.insertedNodes[i] instanceof ParagraphWidget && action === 'InsertTable') {
                    let enterOperation: Operation = this.getInsertOperation('Enter');
                    if (isNullOrUndefined(enterOperation.markerData)) {
                        enterOperation.markerData = {};
                    }
                    enterOperation.markerData.isSkipTracking = true;
                    operations.push(enterOperation);
                } else if (this.insertedNodes[i] instanceof TableWidget) {
                    let tableWidget: TableWidget = (this.insertedNodes[i] as TableWidget).combineWidget(this.owner.viewer) as TableWidget;
                    this.tableRelatedLength = action === 'InsertTableBelow' ? 0 : 1;
                    this.insertedText = CONTROL_CHARACTERS.Table;
                    let tableFormat: any = this.owner.sfdtExportModule ? this.owner.sfdtExportModule.writeTableFormat(tableWidget.tableFormat, 0) : {};
                    this.insertedTableFormat = JSON.stringify(tableFormat);
                    operations.push(this.getInsertOperation(action));
                    this.insertedTableFormat = undefined;
                    for (let j: number = 0; j < tableWidget.childWidgets.length; j++) {
                        let row: TableRowWidget = tableWidget.childWidgets[j] as TableRowWidget;
                        operations.push(this.buildRowOperation(row, action));
                        for (let k: number = 0; k < row.childWidgets.length; k++) {
                            let cell: TableCellWidget = row.childWidgets[k] as TableCellWidget;
                            operations.push(this.buildCellOperation(cell, action, true));
                        }
                    }
                } else if (this.insertedNodes[i] instanceof TableRowWidget) {
                    let row: TableRowWidget = this.insertedNodes[i] as TableRowWidget;
                    operations.push(this.buildRowOperation(row, action));
                    for (let j: number = 0; j < row.childWidgets.length; j++) {
                        let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                        operations.push(this.buildCellOperation(cell, action, true));
                    }
                } 	
	            else if(this.insertedNodes[i] instanceof TableCellWidget) {
                    let cell: TableCellWidget = this.insertedNodes[i] as TableCellWidget;
                    let table: TableWidget = cell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
                    let num: number = 0;
                    for(let j: number = 0; j < table.childWidgets.length; j++) {
                        i = this.insertedNodes.length;
                        let row: TableRowWidget = table.childWidgets[j] as TableRowWidget;
                        for(let k: number = 0; k < row.childWidgets.length; k++) {
                            let cell: TableCellWidget = row.childWidgets[k] as TableCellWidget;
                            let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
                            if(this.insertedNodes.indexOf(cell) !== -1) {
                                let offset: number = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
                                this.insertIndex = offset - num;
                                if(cell.ownerTable.childWidgets.length === cell.ownerRow.indexInOwner + 1) {
                                    if(this.insertedNodes.indexOf(row.childWidgets[row.childWidgets.length - 1]) !== -1) {
                                        this.insertIndex -= 1;
                                    }
                                }
                                operations.push(this.buildCellOperation(cell, action, true));
                                num += 2;
                            } else {
                                let offset: number = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
                                this.insertIndex = offset - num;
                                operations.push(this.buildCellOperation(cell, action, false));
                            }
                        }
                    }
                }
            }
        }
        return operations;
    }

    private assignRevisionData(type: string, author: string, date: string, revisionId: string): MarkerData {
        let markerData: MarkerData = {
            revisionType: type,
            author: author,
            date: date,
            revisionId: revisionId
        }
        return markerData;
    }

    private createAcceptRejectOperation(action: Action): void {
        let start: TextPosition = this.owner.selection.start;
        if (!start.paragraph.isInsideTable) {
            return;
        }
        let row: TableRowWidget = start.paragraph.associatedCell.ownerRow;
        let length: number = 0;
        this.insertedText = CONTROL_CHARACTERS.Row;
        if(row.rowFormat.revisions.length > 0) {
            let revision: Revision = row.rowFormat.revisions[0];
            let isAcceptOrReject: string;
            if (action === 'Accept Change') {
                isAcceptOrReject = 'Accept';
            } else if (action === 'Reject Change') {
                isAcceptOrReject = 'Reject';
            }
            this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision, isAcceptOrReject));
        }
        let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
        let offset: number = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, row).position;
        if(row.rowFormat.revisions.length > 0) {
            if(row.rowFormat.revisions[0].revisionType === 'Insertion') {
                if(action === 'Accept Change') {
                    this.startIndex = offset;
                    this.tableRelatedLength = 1;
                    this.cellOperation.push(this.getFormatOperation(undefined, 'RemoveRowTrack'));
                } else if(action === 'Reject Change') {
                    this.startIndex = offset;
                    for(let j: number = 0; j < row.childWidgets.length; j++) {
                        length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
                    }
                    this.tableRelatedLength = length;
                    this.cellOperation.push(this.getDeleteOperation('RemoveRowTrack'));
                }
            } else if (row.rowFormat.revisions[0].revisionType === 'Deletion') {
                if(action === 'Accept Change') {
                    this.startIndex = offset;
                    // this.tableRelatedLength = 0;
                    for(let j: number = 0; j < row.childWidgets.length; j++) {
                        length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
                    }
                    this.tableRelatedLength = length;
                    this.cellOperation.push(this.getDeleteOperation('RemoveRowTrack'));
                } else if(action === 'Reject Change') {
                    this.startIndex = offset;
                    for(let j: number = 0; j < row.childWidgets.length; j++) {
                        length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
                    }
                    this.tableRelatedLength = length;
                    this.cellOperation.push(this.getFormatOperation(undefined, 'RemoveRowTrack'));
                }
            }
            this.markerData = [];
        }
    }

    private beforeInsertTableRevision(): void {
        let start: TextPosition = this.owner.selection.start;
        let table: TableWidget = start.paragraph.associatedCell.ownerTable;
        for(let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let length: number = 0;
            for(let j: number = 0; j < row.childWidgets.length; j++) {
                length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
            }
            this.tableRelatedLength = length + 1;
            this.insertedText = CONTROL_CHARACTERS.Row;
            let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
            this.startIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, row).position;
            if(row.rowFormat.revisions.length > 0) {
                let revision: Revision = row.rowFormat.revisions[0];
                this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision));
            }
            this.cellOperation.push(this.getDeleteOperation('RemoveRowTrack'));
            this.markerData = [];
        }
        this.cellOperation.reverse();
    }

    private afterInsertTableRrevision(): void {
        let start: TextPosition = this.owner.selection.start;
        let table: TableWidget = start.paragraph.associatedCell.ownerTable;
        for(let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let length: number = 0;
            for(let j: number = 0; j < row.childWidgets.length; j++) {
                length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
            }
            this.tableRelatedLength = length + 1;
            this.insertedText = CONTROL_CHARACTERS.Row;
            let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
            this.insertIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, row).position;
            if(row.rowFormat.revisions.length > 0) {
                let revision: Revision = row.rowFormat.revisions[0];
                this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision));
            }
            let operation: Operation = this.getInsertOperation('RemoveRowTrack');
            operation.skipOperation = true;
            this.cellOperation.push(operation);
            this.markerData = [];
        }
    }

    private buildRowOperation(row: TableRowWidget, action: Action): Operation {
        this.insertedText = CONTROL_CHARACTERS.Row;
        let rowFormat: any = {};
        if (!isNullOrUndefined(this.owner.sfdtExportModule)) {
            this.owner.sfdtExportModule.assignRowFormat(rowFormat, row.rowFormat, 0);
        }
        this.insertedRowFormat = JSON.stringify(rowFormat);
        if(row.rowFormat.revisions.length > 0) {
            let revision: Revision = row.rowFormat.revisions[row.rowFormat.revisions.length - 1];
            let lastRevision: MarkerData = this.markerData[this.markerData.length - 1];
            if (!(!isNullOrUndefined(lastRevision) && lastRevision.revisionId === revision.revisionID)) {
                this.markerData.push(this.owner.editor.getMarkerData(undefined, undefined, revision));
            }
        }
        this.tableRelatedLength = 1;
        let operation: Operation = this.getInsertOperation(action);
        this.insertedRowFormat = undefined;
        this.markerData = [];
        return operation
    }
    /**
     * @private
     */
    public buildRowOperationForTrackChanges(row: TableRowWidget, action?: Action) {
        let paragraphInfo: ParagraphInfo = { 'paragraph':  null, 'offset': 0 };
        let length: number = 0;
        let offset: number = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, row).position;
        this.startIndex = offset;
        for(let j: number = 0; j < row.childWidgets.length; j++) {
            length += this.owner.selection.calculateCellLength(row.childWidgets[j] as TableCellWidget) + 1;
        }
        this.tableRelatedLength = length;
        this.insertedText = CONTROL_CHARACTERS.Row;
        this.cellOperation.push(this.getFormatOperation(undefined, action));
    }

    private buildCellOperation(cell: TableCellWidget, action: Action, isCellInserted: boolean): Operation {
        let characterFormat: any = {};
        let paragraphFormat: any = {};
        this.tableRelatedLength = isCellInserted ? 2 : 0;
        this.insertedText = CONTROL_CHARACTERS.Cell;
        let cellFormat: any = !isNullOrUndefined(this.owner.sfdtExportModule) ? this.owner.sfdtExportModule.writeCellFormat(cell.cellFormat, 0) : {};
        this.insertedCellFormat = JSON.stringify(cellFormat);
        HelperMethods.writeParagraphFormat(paragraphFormat, true, (cell.childWidgets[0] as ParagraphWidget).paragraphFormat);
        this.insertedParagraphFormat = JSON.stringify(paragraphFormat);
        HelperMethods.writeCharacterFormat(characterFormat, true, (cell.childWidgets[0] as ParagraphWidget).characterFormat);
        this.insertedCharacterFormat = JSON.stringify(characterFormat);
        let operation: Operation = this.getInsertOperation(action);
        this.insertedCellFormat = undefined;
        this.insertedParagraphFormat = undefined;
        this.insertedCharacterFormat = undefined;
        return operation;
    }

    private deleteColumnOperation(action: Action): void {
        let startCell: TableCellWidget = this.owner.editor.getOwnerCell(this.owner.selection.isForward);
        let endCell: TableCellWidget = this.owner.editor.getOwnerCell(!this.owner.selection.isForward);
        let table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
        let deleteCells: TableCellWidget[] = [];
        if(action === 'DeleteColumn') {
            deleteCells = table.getColumnCellsForSelection(startCell, endCell);
        } else {
            deleteCells = this.owner.selection.getSelectedCells();
        }
        for (let i: number = 0; i < deleteCells.length; i++) {
            if(action === 'ClearCells') {
                this.deleteCell(action, deleteCells[i]);
            } else if (action === 'MergeCells') {
                if (i !== 0) {
                    this.deleteCell(action, deleteCells[i]);
                }
            } else {
                this.deleteCell('DeleteColumn', deleteCells[i]);
            }
        }
        if (action === 'MergeCells') {
            this.cellOperation.reverse();
            this.deleteCell('ClearCells', deleteCells[0]);
        }
    }

    private getPasteMergeOperation(): Operation {
        let cell: TableCellWidget = this.owner.selection.start.paragraph.associatedCell;
        let paragraphInfo: ParagraphInfo = { 'paragraph': null, 'offset': 0 };
        let offset: number = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
        let length: number = this.owner.selection.calculateCellLength(cell);
        let firstParagraph: ParagraphWidget = this.owner.selection.getFirstParagraph(cell);
        let lastParagraph: ParagraphWidget = this.owner.selection.getLastParagraph(cell);
        let startPos: TextPosition = new TextPosition(this.owner);
        let endPos: TextPosition = new TextPosition(this.owner);
        let startline: LineWidget = firstParagraph.firstChild as LineWidget;
        let lastLine: LineWidget = lastParagraph.lastChild as LineWidget;
        startPos.setPosition(startline, true);
        endPos.setPosition(lastLine, false);
        this.pasteContent = this.owner.sfdtExportModule.write((this.owner.documentEditorSettings.optimizeSfdt ? 1 : 0), firstParagraph.firstChild as LineWidget, startPos.offset, lastParagraph.lastChild as LineWidget, endPos.offset, false, true);
        this.startIndex = offset + 1;
        let pasteOperation: Operation = {
            action: 'Insert',
            offset: this.startIndex,
            length: length,
            pasteContent: JSON.stringify(this.pasteContent),
            type: 'Paste'
        }
        this.insertedText = CONTROL_CHARACTERS.Cell;
        this.startIndex = offset;
        this.endIndex = offset;
        this.insertedCellFormat = JSON.stringify(this.owner.sfdtExportModule.writeCellFormat(cell.cellFormat, 0));
        return pasteOperation;
    }

    private deleteCell(action: Action, cell: TableCellWidget): void {
        this.tableRelatedLength = this.owner.selection.calculateCellLength(cell) + 1;
        let paragraphInfo: ParagraphInfo = { 'paragraph': null, 'offset': 0 };
        this.startIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position;
        if (!this.owner.enableTrackChanges) {
            if (action === 'ClearCells') {
                let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
                if (cell.childWidgets.length === 1 && block instanceof ParagraphWidget && (block as ParagraphWidget).isEmpty()) {
                    return;
                }
                this.endIndex = this.startIndex + this.tableRelatedLength - 1;
                this.startIndex += 1;
                this.cellOperation.push(this.getDeleteOperation('ClearCells'));
            } else {
                this.cellOperation.push(this.getDeleteOperation('DeleteColumn'));
            }
        }
    }
    /**
     * @private
     * @returns {Operation}
     */
    public getFormatOperation(element?: ElementBox, action?: string): Operation {
        let length: number = 0;
        if (action === 'RemoveRowTrack') {
            length = this.tableRelatedLength;
        } else if (action === 'RowResizing' || action === 'CellResizing' || action === 'ImageResizing') {
            length = this.insertedText.length;
        } else {
            length = !isNullOrUndefined(element) ? element.length : this.endIndex - this.startIndex;
        }
        let formatOperation: Operation = {
            action: 'Format',
            offset: this.startIndex,
            length: length,
            markerData: this.markerData[this.markerData.length - 1],
            imageData: this.insertedData,
            tableFormat: this.insertedTableFormat,
            rowFormat: this.insertedRowFormat,
            cellFormat: this.insertedCellFormat,
            text: this.insertedText,
            paragraphFormat: this.insertedParagraphFormat,
            characterFormat: this.insertedCharacterFormat,
            sectionFormat: this.insertedSectionFormat
        };
        this.markerData.pop();
        if (!isNullOrUndefined(action)) {
            formatOperation.type = action.toString();
        }
        return formatOperation;
    }
    private getRemovedText(element?: IWidget): string {
        let text: string = '';
        if (!isNullOrUndefined(element)) {
            let node: IWidget = element;
            if (node instanceof ParagraphWidget) {
                text += this.getParagraphText(node as ParagraphWidget);
            } else if (node instanceof ElementBox) {
                if (node instanceof TextElementBox) {
                    text += node.text;
                } else {
                    text += ElementBox.objectCharacter;
                }
            } else if (node instanceof TableWidget) {
                text += this.getTableText(node as TableWidget);
            } else if (node instanceof TableRowWidget) {
                text += this.getRowText(node as TableRowWidget);
            }
        } else {
            for (let i: number = this.removedNodes.length - 1; i >= 0; i--) {
                let node: IWidget = this.removedNodes[i];
                if (node instanceof ParagraphWidget) {
                    text += this.getParagraphText(node as ParagraphWidget);
                } else if (node instanceof ElementBox) {
                    if (node instanceof TextElementBox) {
                        text += node.text;
                    } else {
                        text += ElementBox.objectCharacter;
                    }
                } else if (node instanceof TableWidget) {
                    text += this.getTableText(node as TableWidget);
                } else if (node instanceof TableRowWidget) {
                    text += this.getRowText(node as TableRowWidget);
                }
            }
        }
        return text;
    }

    private getRemovedFieldCode(): string {
        let fieldCode: string = '';
        let isStarted: boolean = false;
        for (let i: number = this.removedNodes.length - 1; i >= 0; i--) {
            let node: IWidget = this.removedNodes[i];
            if (node instanceof ElementBox) {
                if (node instanceof FieldElementBox && (node as FieldElementBox).fieldType === 0) {
                    isStarted = true;
                }
                if (node && node instanceof TextElementBox) {
                    if(isStarted) {
                        fieldCode += node.text; 
                    }
                }
                if (node instanceof FieldElementBox
                    && ((node as FieldElementBox).fieldType === 2 || (node as FieldElementBox).fieldType === 1)) {
                    return fieldCode;
                }
            }
            else if (node instanceof ParagraphWidget) {
                for (let i = 0; i < node.childWidgets.length; i++) {
                    const lineWidget: LineWidget = node.childWidgets[i] as LineWidget;
                    for (let j = 0; j < lineWidget.children.length; j++) {
                        const element: ElementBox = lineWidget.children[j];
                        if (element instanceof FieldElementBox && (element as FieldElementBox).fieldType === 0) {
                            isStarted = true;
                        }
                        if (element instanceof TextElementBox) {
                            if(isStarted) {
                                fieldCode += element.text; 
                            }
                        }
                        if (element instanceof FieldElementBox
                            && ((element as FieldElementBox).fieldType === 2 || (element as FieldElementBox).fieldType === 1)) {
                            return fieldCode;
                        }
                    }
                }
            }
        }
        return undefined;
    }

    //  Add for loop to iterate paragraph child elements and get text 
    private getParagraphText(paragraph: ParagraphWidget): string {
        let text: string = '';
        if (!isNullOrUndefined(paragraph) && !isNullOrUndefined(paragraph.childWidgets)) {
            for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
                let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
                for (let j: number = 0; j < line.children.length; j++) {
                    if (line.children[j] instanceof TextElementBox) {
                        text += (line.children[j] as TextElementBox).text;
                    } else {
                        text += ElementBox.objectCharacter;
                    }
                }
            }
            return text + '\n';
        }
        return text;
    }

    //  Add for loop to iterate table child elements and get text
    private getTableText(table: TableWidget): string {
        let text: string = '';
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            text += this.getRowText(row);
        }
        return text;
    }

    // Add for loop to iterate table row child elements and get text
    private getRowText(row: TableRowWidget): string {
        let text: string = '';
        for (let j: number = 0; j < row.childWidgets.length; j++) {
            let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
            for (let k: number = 0; k < cell.childWidgets.length; k++) {
                let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                if (block instanceof ParagraphWidget) {
                    text += this.getParagraphText(block as ParagraphWidget);
                } else {
                    text += this.getTableText(block as TableWidget);
                }
            }
        }
        return text;
    }

    /**
     * @private
     * @returns {Operation}
     */
    public getCommentOperation(operation: Operation, comment?: CommentElementBox): Operation {
        if (this.action === 'InsertInline' || this.action === 'RemoveInline') {
            let commentRangeElement: CommentCharacterElementBox = this.action === 'RemoveInline' ? this.removedNodes[0] as CommentCharacterElementBox : this.insertedElement as CommentCharacterElementBox;
            let commentElement: CommentElementBox = commentRangeElement.comment;
            operation.text = commentRangeElement.commentType === 0 ? CONTROL_CHARACTERS.Marker_Start : CONTROL_CHARACTERS.Marker_End;
            operation.markerData = {
                type: 'Comment',
                commentId: commentRangeElement.commentId,
                ownerCommentId: commentElement.isReply? commentElement.ownerComment.commentId: undefined
            }
        } else if (this.action === 'InsertCommentWidget' || this.action === 'DeleteCommentWidget') {
            let comment: CommentElementBox = this.removedNodes[0] as CommentElementBox;
            operation.length = undefined;
            operation.action = 'Update';
            operation.offset = undefined;
            operation.text = CONTROL_CHARACTERS.Marker_Start + CONTROL_CHARACTERS.Marker_End;
            operation.markerData = {
                type: 'Comment',
                commentId: comment.commentId,
                author: comment.author,
                date: comment.date,
                commentIndex: comment.isReply ? comment.ownerComment.replyComments.indexOf(comment) : this.owner.documentHelper.comments.indexOf(comment),
                initial: comment.initial,
                done: comment.isResolved,
                text: comment.text,
                isReply: comment.isReply
            }
            if (!isNullOrUndefined(comment.ownerComment)) {
                operation.markerData.ownerCommentId = comment.ownerComment.commentId;
            }
        } else if (this.action === 'ResolveComment') {
            operation.text = CONTROL_CHARACTERS.Marker_Start + CONTROL_CHARACTERS.Marker_End;
            operation.markerData = {
                type: 'Comment',
                commentId: comment.commentId,
                done: comment.isResolved 
            }
        } else if (this.action === 'EditComment') {
            operation.text = CONTROL_CHARACTERS.Marker_Start + CONTROL_CHARACTERS.Marker_End;
            operation.markerData = {
                type: 'Comment',
                commentId: comment.commentId,
                text: comment.text,
                isReply: comment.isReply,
                ownerCommentId: comment.isReply? comment.ownerComment.commentId: undefined
            }
        }
        return operation;
    }
    /**
     * @private
     */
    public getDeleteCommentOperation(modifiedActions: BaseHistoryInfo[], operations: Operation[]) {
        for (let i = 0; i < modifiedActions.length; i++) {
            let currentHistory = modifiedActions[i];
            if (currentHistory instanceof HistoryInfo && (currentHistory.action === 'DeleteComment')) {
                this.getDeleteCommentOperation(currentHistory.modifiedActions, operations);
            } else {
                let operation: Operation = currentHistory.getDeleteOperation(currentHistory.action);
                operations.push(currentHistory.getCommentOperation(operation));
            }
        }
    }

    /**
     * @private
     * @returns {Operation}
     */
    public buildFormatOperation(action: Action, ischarFormat: boolean, isCellFormat: boolean): Operation[] {
        let operations: Operation[] = [];
        if ((action === 'ApplyStyle' || action === 'StyleName') && this.insertedFormat instanceof WParagraphStyle) {
            this.insertedFormat = (this.insertedFormat as WParagraphStyle).name;
            this.createParagraphFormat(action);
        } else {
            if (action === 'ApplyStyle' || action === 'StyleName') {
                this.insertedFormat = (this.insertedFormat as WCharacterStyle).name;
            }
            ischarFormat ? this.createCharacterFormat(action) : this.createParagraphFormat(action);
        }
        operations = this.getSelectedCellOperation(action, ischarFormat);
        this.insertedCharacterFormat = undefined;
        this.insertedParagraphFormat = undefined;
        this.insertedCellFormat = undefined;
        return operations;
    }

    /**
     * @private
     * @returns {Operation}
     */
    public getSelectedCellOperation(action: Action, ischarFormat?: boolean, isBorder?: boolean, isShading?: boolean): Operation[] {
        let operations: Operation[] = [];
        let start: TextPosition = this.owner.selection.start;
        let end: TextPosition = this.owner.selection.end;
        if (start.paragraph.isInsideTable && end.paragraph.isInsideTable && (start.paragraph.associatedCell.ownerTable.equals(end.paragraph.associatedCell.ownerTable)
            && this.owner.selection.isCellSelected(start.paragraph.associatedCell, start, end))) {
            let selectCells: TableCellWidget[] = this.owner.selection.getSelectedCells();
            for (let i: number = 0; i < selectCells.length; i++) {
                let cell: TableCellWidget = selectCells[i] as TableCellWidget;
                let paragraphInfo: ParagraphInfo = { 'paragraph': null, 'offset': 0 };
                this.startIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, cell).position + 1;
                let length: number = this.owner.selection.calculateCellLength(cell) - 1;
                this.endIndex = this.startIndex + length;
                if (length === 0 && ischarFormat) {
                    continue;
                }
                let cellFormat: any = {};
                if (isBorder) {
                    cellFormat['borders'] = HelperMethods.writeBorders(cell.cellFormat.borders, 0);
                    this.insertedCellFormat = JSON.stringify(cellFormat);
                } 
                if (isShading) {
                    cellFormat['shading'] = this.owner.sfdtExportModule ? this.owner.sfdtExportModule.writeShading(cell.cellFormat.shading, 0) : {};
                    this.insertedCellFormat = JSON.stringify(cellFormat);
                }
                let formatOperation: Operation;
                if (action === 'ListFormat') {
                    formatOperation = this.getFormatOperation(undefined, action);
                    this.createListFormat(action, formatOperation);
                } else {
                    formatOperation = this.getFormatOperation();
                }
                operations.push(formatOperation);
            }
        } else {
            let operation: Operation;
            if (action === 'ListFormat') {
                operation = this.getFormatOperation(undefined, action);
                this.createListFormat(action, operation);
            } else {
                operation = this.getFormatOperation();
            }
            operations.push(operation);
        }
        return operations;
    }

    private createListFormat(action: Action, operation: Operation): void {
        let listId: number;
        let nsid: number;
        if (action === 'ListFormat') {
           listId = (this.insertedFormat as WListFormat).listId;
           operation.text = action.toString().charAt(0).toLowerCase() + action.toString().slice(1);
        } else {
            listId = (<any>this.insertedFormat).listId;
            nsid = (<any>this.insertedFormat).nsid;
        }
        if (listId > -1) {
            let list: WList = this.owner.documentHelper.getListById(listId);
            let listData: any = {};
            listData.optimizeSfdt = this.owner.documentEditorSettings.optimizeSfdt;
            if (!isNullOrUndefined(this.owner.sfdtExportModule)) {
                this.owner.sfdtExportModule.keywordIndex = this.owner.documentEditorSettings.optimizeSfdt ? 1 : 0;
                listData[listsProperty[this.owner.sfdtExportModule.keywordIndex]] = [];
                listData[listsProperty[this.owner.sfdtExportModule.keywordIndex]].push(this.owner.sfdtExportModule.writeList(list));
                listData[abstractListsProperty[this.owner.sfdtExportModule.keywordIndex]] = [];
                if (!isNullOrUndefined(list)) {
                    listData[abstractListsProperty[this.owner.sfdtExportModule.keywordIndex]].push(this.owner.sfdtExportModule.writeAbstractList(list.abstractList));
                }
                if (action == 'RestartNumbering') {
                    listData[listIdProperty[this.owner.sfdtExportModule.keywordIndex]] = listId;
                    listData[nsidProperty] = nsid;
                }
            }
            operation.listData = JSON.stringify(listData);
        }
    }

    private createCharacterFormat(action: Action): void {
        let characterFormat: any = {};
        if (action === 'Uppercase') {
            characterFormat.allCaps = true;
        } else if (action === 'ApplyStyle' || action === 'StyleName') {
            characterFormat.styleName = this.insertedFormat;
        } else if (action === 'CharacterFormat') {
            let charFormat: WCharacterFormat = this.insertedFormat as WCharacterFormat;
            characterFormat.bold = charFormat.hasValue('bold') ? charFormat.bold : characterFormat.bold;
            characterFormat.italic = charFormat.hasValue('italic') ? charFormat.italic : characterFormat.italic;
            characterFormat.fontSize = charFormat.hasValue('fontSize') ? charFormat.fontSize : characterFormat.fontSize;
            characterFormat.underline = charFormat.hasValue('underline') ? charFormat.underline : characterFormat.underline;
            characterFormat.strikethrough = charFormat.hasValue('strikethrough') ? charFormat.strikethrough : characterFormat.strikethrough;
            characterFormat.baselineAlignment = charFormat.hasValue('baselineAlignment') ? charFormat.baselineAlignment : characterFormat.baselineAlignment;
            characterFormat.highlightColor = charFormat.hasValue('highlightColor') ? charFormat.highlightColor : characterFormat.highlightColor;
            characterFormat.fontColor = charFormat.hasValue('fontColor') ? charFormat.fontColor : characterFormat.fontColor;
            characterFormat.fontFamily = charFormat.hasValue('fontFamily') ? charFormat.fontFamily : characterFormat.fontFamily;
            characterFormat.allCaps = charFormat.hasValue('allCaps') ? charFormat.allCaps : characterFormat.allCaps;
        } else {
            if (this.insertedFormat === 'increment' || this.insertedFormat === 'decrement') {
                this.type = this.insertedFormat as string;
                characterFormat.fontSize = 0;
            } else {
                if (action !== 'ClearFormat') {
                    characterFormat[action.toString().charAt(0).toLowerCase() + action.toString().slice(1)] = this.insertedFormat;
                }
            }
        }
        this.insertedCharacterFormat = JSON.stringify(characterFormat);
    }
    private createParagraphFormat(action: Action): void {
        let paragraphFormat: any = {};
        if (action === 'ParagraphFormat' || action === 'ContinueNumbering') {
            let paraFormat: WParagraphFormat = this.insertedFormat as WParagraphFormat;
            paragraphFormat.afterSpacing = paraFormat.hasValue('afterSpacing') ? paraFormat.afterSpacing : undefined;
            paragraphFormat.beforeSpacing = paraFormat.hasValue('beforeSpacing') ? paraFormat.beforeSpacing : undefined;
            paragraphFormat.spaceAfterAuto = paraFormat.hasValue('spaceAfterAuto') ? paraFormat.spaceAfterAuto : paragraphFormat.spaceAfterAuto;
            paragraphFormat.spaceBeforeAuto = paraFormat.hasValue('spaceBeforeAuto') ? paraFormat.spaceBeforeAuto : paragraphFormat.spaceBeforeAuto;
            paragraphFormat.rightIndent = paraFormat.hasValue('rightIndent') ? paraFormat.rightIndent : paragraphFormat.rightIndent;
            paragraphFormat.leftIndent = paraFormat.hasValue('leftIndent') ? paraFormat.leftIndent : paragraphFormat.leftIndent;
            paragraphFormat.firstLineIndent = paraFormat.hasValue('firstLineIndent') ? paraFormat.firstLineIndent : paragraphFormat.firstLineIndent;
            paragraphFormat.lineSpacing = paraFormat.hasValue('lineSpacing') ? paraFormat.lineSpacing : paragraphFormat.lineSpacing;
            paragraphFormat.lineSpacingType = paraFormat.hasValue('lineSpacingType') ? paraFormat.lineSpacingType : paragraphFormat.lineSpacingType;
            paragraphFormat.textAlignment = paraFormat.hasValue('textAlignment') ? paraFormat.textAlignment : paragraphFormat.textAlignment;
            paragraphFormat.borders = paraFormat.hasValue('borders') ? paraFormat.borders : paragraphFormat.borders;
            if (paraFormat.listFormat.listId !== -1) {
                let listFormat: any = {};
                listFormat.listId = paraFormat.listFormat.listId;
                listFormat.listLevelNumber = paraFormat.listFormat.listLevelNumber;
                listFormat.nsid = paraFormat.listFormat.nsid;
                paragraphFormat.listFormat = listFormat;
            }
            paragraphFormat.styleName = paraFormat.hasValue('styleName') ? paragraphFormat.styleName.name : undefined;
            paragraphFormat.contextualSpacing = paraFormat.hasValue('contextualSpacing') ? paraFormat.contextualSpacing : paragraphFormat.contextualSpacing;
            paragraphFormat.keepWithNext = paraFormat.hasValue('keepWithNext') ? paraFormat.keepWithNext : paragraphFormat.keepWithNext;
            paragraphFormat.keepLinesTogether = paraFormat.hasValue('keepLinesTogether') ? paraFormat.keepLinesTogether : paragraphFormat.keepLinesTogether;
            paragraphFormat.widowControl = paraFormat.hasValue('contextualSpacing') ? paraFormat.widowControl : paragraphFormat.widowControl;
        } else if (action === 'ListFormat') {
            let listFormat: any = {};
            listFormat.listId = (this.insertedFormat as WListFormat).listId;
            listFormat.nsid = (this.insertedFormat as WListFormat).nsid;
            listFormat.listLevelNumber = (this.insertedFormat as WListFormat).listLevelNumber;
            paragraphFormat.listFormat = listFormat;
        } else if (action === 'ApplyStyle' || action === 'StyleName') {
            paragraphFormat.styleName = this.insertedFormat;
        } else if (action === 'ParagraphBidi') {
            paragraphFormat.bidi = this.insertedFormat;
        } else if (action === 'Borders') {
            paragraphFormat['borders'] = HelperMethods.writeBorders(this.insertedFormat as WBorders, 0);
        } else {
            if (this.insertedFormat instanceof WParagraphFormat) {
                let paraFormat: any = this.owner.sfdtExportModule.writeParagraphFormat(this.insertedFormat as WParagraphFormat);
                paragraphFormat[action.toString().charAt(0).toLowerCase() + action.toString().slice(1)] = paraFormat;
            } else {
                paragraphFormat[action.toString().charAt(0).toLowerCase() + action.toString().slice(1)] = this.insertedFormat;
            }
        }
        this.insertedParagraphFormat = JSON.stringify(paragraphFormat);
    }
    /**
     * @private
     * @returns {void}
     */
    public createTableFormat(action: Action): void {
        let paragraphInfo: ParagraphInfo = { 'paragraph': null, 'offset': 0 };
        this.startIndex = this.owner.selection.getPositionInfoForHeaderFooter(paragraphInfo, { position: 0, done: false }, this.owner.selection.start.paragraph.associatedCell.ownerTable).position;
        this.endIndex = this.startIndex;
        let tableFormat: any = {};
        if (action === 'TableFormat') {
            let tabFormat: WTableFormat = this.insertedFormat as WTableFormat
            if (!isNullOrUndefined(tabFormat)) {
                tableFormat.bidi = tabFormat.hasValue('bidi') ? tabFormat.bidi : undefined;
                tableFormat.preferredWidth = tabFormat.hasValue('preferredWidth') ? tabFormat.preferredWidth : undefined;
                tableFormat.preferredWidthType = tabFormat.hasValue('preferredWidthType') ? tabFormat.preferredWidthType : undefined;
                tableFormat.tableAlignment = tabFormat.hasValue('tableAlignment') ? tabFormat.tableAlignment : undefined;
                tableFormat.leftIndent = tabFormat.hasValue('leftIndent') ? tabFormat.leftIndent : undefined;
            }
        } else if (action === 'TableOptions') {
            let tableOption: WTableFormat = this.owner.selection.start.paragraph.associatedCell.ownerTable.tableFormat;
            if (!isNullOrUndefined(tableOption)) {
                tableFormat.cellSpacing = tableOption.hasValue('cellSpacing') ? tableOption.cellSpacing : undefined;
                tableFormat.leftMargin = tableOption.hasValue('leftMargin') ? tableOption.leftMargin : undefined;
                tableFormat.topMargin = tableOption.hasValue('topMargin') ? tableOption.topMargin : undefined;
                tableFormat.rightMargin = tableOption.hasValue('rightMargin') ? tableOption.rightMargin : undefined;
                tableFormat.bottomMargin = tableOption.hasValue('bottomMargin') ? tableOption.bottomMargin : undefined;
            }
        } else if (action === 'BordersAndShading') {
            let tabBorderFormat: WTableFormat = this.insertedFormat as WTableFormat;
            tableFormat = !isNullOrUndefined(this.owner.sfdtExportModule) ? this.owner.sfdtExportModule.writeTableFormat(tabBorderFormat, 0) : {};
        } else {
            tableFormat[this.getTableFormatString(action)] = this.insertedFormat;
        }
        this.insertedTableFormat = JSON.stringify(tableFormat);
    }
    /**
     * @private
     * @returns {void}
     */
    public createRowFormat(action: Action): void {
        let rowFormat: any = {};
        if(action === 'RowFormat') {
            let rForamt: WRowFormat = this.insertedFormat as WRowFormat;
            if (!isNullOrUndefined(rForamt)) {
                rowFormat.height = rForamt.hasValue('height') ? rForamt.height : undefined;
                rowFormat.heightType = rForamt.hasValue('heightType') ? rForamt.heightType : undefined;
                rowFormat.isHeader = rForamt.hasValue('isHeader') ? rForamt.isHeader : undefined;
                rowFormat.allowBreakAcrossPages = rForamt.hasValue('allowBreakAcrossPages') ? rForamt.allowBreakAcrossPages : undefined;
            }
        } else {
            rowFormat[this.getRowString(action)] = this.insertedFormat;
        }
        this.insertedRowFormat = JSON.stringify(rowFormat);
    }
    /**
     * @private
     * @returns {void}
     */
    public createCellFormat(action: Action): void {
        let cellFormat: any = {};
        if(action === 'CellFormat') {
            let cFormat: WCellFormat = this.insertedFormat as WCellFormat;
            cellFormat.preferredWidth = cFormat.hasValue('preferredWidth') ? cFormat.preferredWidth : undefined;
            cellFormat.preferredWidthType = cFormat.hasValue('preferredWidthType') ? cFormat.preferredWidthType : undefined;
            cellFormat.verticalAlignment = cFormat.hasValue('verticalAlignment') ? cFormat.verticalAlignment : undefined;
        } else if(action === 'CellOptions') {
            let cellOption: WCellFormat = this.insertedFormat as WCellFormat;
            cellFormat.leftMargin = cellOption.leftMargin;
            cellFormat.rightMargin = cellOption.rightMargin;
            cellFormat.bottomMargin = cellOption.bottomMargin;
            cellFormat.topMargin = cellOption.topMargin;
        } else if (action === 'Shading') {
            cellFormat[this.getCellString(action)] = !isNullOrUndefined(this.owner.sfdtExportModule) ? this.owner.sfdtExportModule.writeShading(this.insertedFormat as WShading, 0) : {};
        } else if (action === 'Borders') {
            cellFormat['borders'] = HelperMethods.writeBorders(this.insertedFormat as WBorders, 0);
        } else if (action === 'BordersAndShading') {
            cellFormat['shading'] = !isNullOrUndefined(this.owner.sfdtExportModule) ? this.owner.sfdtExportModule.writeShading(this.insertedFormat as WShading, 0) : {};
            cellFormat['borders'] = HelperMethods.writeBorders((this.insertedFormat as WCellFormat).borders as WBorders, 0);
        } else {
            cellFormat[this.getCellString(action)] = this.insertedFormat;
        }
        this.insertedCellFormat = JSON.stringify(cellFormat);
    }

    private getTableFormatString(property: Action): string {
        switch (property) {
            case 'TableAlignment':
                return 'tableAlignment';
            case 'TableLeftIndent':
                return 'leftIndent';
            case 'DefaultCellLeftMargin':
                return 'leftMargin';
            case 'DefaultCellRightMargin':
                return 'rightMargin';
            case 'DefaultCellBottomMargin':
                return 'bottomMargin';
            case 'DefaultCellTopMargin':
                return 'topMargin';
            case 'TablePreferredWidth':
                return 'preferredWidth';
            case 'TablePreferredWidthType':
                return 'preferredWidthType';
            case 'Shading':
                return 'shading';
            case 'TableBidi':
                return 'bidi';
            default:
                return 'cellSpacing';
        }
    }
    private createSectionFormat(action: Action): void {
        let sectionFormat: any = {};
        switch (action) {
            case 'SectionFormat':
                let secFormat: WSectionFormat = this.insertedFormat as WSectionFormat;
                this.owner.sfdtExportModule.writeSectionFormat(secFormat, sectionFormat, 0);
                break;
            case 'LinkToPrevious':
                const headerFooterWidget: HeaderFooterWidget = this.owner.selection.start.paragraph.bodyWidget as HeaderFooterWidget;
                let sectionIndex: number = headerFooterWidget.sectionIndex; 
                let headerFooterType: HeaderFooterType = headerFooterWidget.headerFooterType;
                this.insertedSectionFormat = JSON.stringify({ linkToPrevious: this.insertedFormat, sectionIndex: sectionIndex, headerFooterType: headerFooterType});
                return;
            default:
                sectionFormat[action[0].toLowerCase() + action.slice(1)] = this.insertedFormat;
        }
        this.insertedSectionFormat = JSON.stringify(sectionFormat);
    }


    private getRowString(property: Action): string {
        switch (property) {
            case 'RowHeight':
                return 'height';
            case 'RowHeightType':
                return 'heightType';
            case 'RowHeader':
                return 'isHeader';
            default:
                return 'allowBreakAcrossPages';
        }
    }

    private getCellString(property: Action): string{
        switch(property) {
            case 'CellContentVerticalAlignment':
                return 'verticalAlignment';
            case 'CellLeftMargin':
                return 'leftMargin';
            case 'CellRightMargin':
                return 'rightMargin';
            case 'CellBottomMargin':
                return 'bottomMargin';
            case 'CellTopMargin':
                return 'topMargin';
            case 'CellPreferredWidth':
                return 'preferredWidth';
            case 'Shading':
                return 'shading';
            default:
                return 'cellPreferredWidthType';
        }
    }
}



/**
 * @private
 */
export interface Operation {
    action?: 'Insert' | 'Delete' | 'Format' | 'Update',
    offset?: number,
    text?: string,
    length?: number,
    skipOperation?: boolean,
    imageData?: ImageData,
    type?: string,
    markerData?: MarkerData,
    protectionData?:ProtectionData,
    enableTrackChanges?: boolean,
    pasteContent?: string,
    characterFormat?: string,
    tableFormat?: string,
    rowFormat?: string,
    cellFormat?: string,
    paragraphFormat?: string,
    styleData?: string,
    sectionFormat?: string,
    listData?: string,
}

/**
 * @private
 */
export interface ImageData {
    imageString?: string,
    height?: number,
    width?: number,
    metaString?: string
}

/**
 * @private
 */
export interface MarkerData {
    bookmarkName?: string,
    type?: string,
    user?: string,
    editRangeId?: number,
    skipOperation?: boolean,
    columnFirst?: string,
    columnLast?: string,
    isAfterParagraphMark?: boolean,
    isAfterTableMark?: boolean,
    isAfterRowMark?: boolean,
    isAfterCellMark?: boolean,
    formFieldData?: FormField,
    checkBoxValue?: boolean,
    commentId?: string,
    author?: string,
    date?: string,
    initial?: string,
    done?: boolean,
    commentIndex?: number,
    text?: string,
    ownerCommentId?: string,
    isReply?: boolean,
    revisionId?: string,
    revisionType?: string,
    isAcceptOrReject?: string,
    splittedRevisions?: MarkerData[],
    removedIds?: string[],
    dropDownIndex?: number,
    isSkipTracking?: boolean,
    revisionForFootnoteEndnoteContent?: MarkerData
}
/**
 * @private
 */
export interface ProtectionData {
    saltValue?: string,
    hashValue?: string,
    protectionType?: ProtectionType
}