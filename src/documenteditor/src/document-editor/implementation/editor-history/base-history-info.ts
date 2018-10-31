import { WParagraphFormat } from '../format/paragraph-format';
import { WSectionFormat } from '../format/section-format';
import { WCharacterFormat } from '../format/character-format';
import { WListFormat } from '../format/list-format';
import { WListLevel } from '../list/list-level';
import { Editor, EditorHistory, Selection } from '../index';
import { ModifiedLevel, RowHistoryFormat, TableHistoryInfo } from './history-helper';
import {
    IWidget, BlockWidget,
    ParagraphWidget, LineWidget, BodyWidget, TableCellWidget,
    FieldElementBox, TableWidget, TableRowWidget, BookmarkElementBox, HeaderFooterWidget
} from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { DocumentEditor } from '../../document-editor';
import { Action } from '../../index';
import { TextPosition, ImageFormat } from '../index';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ElementBox } from '../viewer/page';
import { TableResizer } from '../editor/table-resizer';
import { WTableFormat, WRowFormat, WCellFormat, WParagraphStyle } from '../format/index';
import { LineInfo, ParagraphInfo } from '../editor/editor-helper';
import { BookmarkInfo } from './history-helper';

/** 
 * @private
 */
export class BaseHistoryInfo {
    // Fields
    private ownerIn: DocumentEditor;
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
    private viewer: LayoutViewer;
    //Properties
    //gets owner control
    /**
     * gets the owner control
     * @private
     */
    get owner(): DocumentEditor { return this.ownerIn; }
    /**
     * gets or sets action
     * @private
     */
    get editorHistory(): EditorHistory {
        return this.owner.editorHistory;
    }
    /**
     * gets or sets action
     * @private
     */
    get action(): Action { return this.actionIn; }
    set action(value: Action) { this.actionIn = value; }

    /**
     * gets modified properties
     * @returns Object
     * @private
     */
    get modifiedProperties(): Object[] { return this.modifiedPropertiesIn; }

    /**
     * @private
     */
    get removedNodes(): IWidget[] {
        return this.removedNodesIn;
    }
    /**
     * Gets or Sets the selection start
     * @private
     */
    //gets or sets selection start
    get selectionStart(): string { return this.selectionStartIn; }
    set selectionStart(value: string) { this.selectionStartIn = value; }
    /**
     * Gets or Sets the selection end
     * @private
     */

    get selectionEnd(): string { return this.selectionEndIn; }
    set selectionEnd(value: string) { this.selectionEndIn = value; }
    /**
     * Gets or sets the insert position
     * @private
     */
    get insertPosition(): string { return this.insertPositionIn; }
    set insertPosition(value: string) { this.insertPositionIn = value; }

    /**
     * Gets or sets end position
     * @private
     */
    get endPosition(): string { return this.endPositionIn; }
    set endPosition(value: string) { this.endPositionIn = value; }
    constructor(node: DocumentEditor) {
        this.ownerIn = node;
        this.viewer = node.viewer;
        this.modifiedPropertiesIn = [];
        this.modifiedNodeLength = [];
        this.removedNodesIn = [];
    }
    /**
     * Update the selection
     * @param selection
     * @private
     */
    public updateSelection(): void {
        let blockInfo: ParagraphInfo = this.owner.editorModule.getParagraphInfo(this.owner.selection.start);
        this.selectionStart = this.owner.editorModule.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.owner.editorModule.getParagraphInfo(this.owner.selection.end);
        this.selectionEnd = this.owner.editorModule.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
    }
    public setBookmarkInfo(bookmark: BookmarkElementBox): void {
        this.removedNodes.push({ 'bookmark': bookmark, 'startIndex': bookmark.indexInOwner, 'endIndex': bookmark.reference.indexInOwner });
    }
    private revertBookmark(): void {
        let bookmarkInfo: BookmarkInfo = this.removedNodes[0] as BookmarkInfo;
        let bookmark: BookmarkElementBox = bookmarkInfo.bookmark;
        if (this.editorHistory.isUndoing) {
            this.viewer.bookmarks.add(bookmark.name, bookmark);
            bookmark.line.children.splice(bookmarkInfo.startIndex, 0, bookmark);
            bookmark.reference.line.children.splice(bookmarkInfo.endIndex, 0, bookmark.reference);
            this.editorHistory.recordChanges(this);
        } else {
            this.owner.editorModule.deleteBookmarkInternal(bookmark);
            this.editorHistory.undoStack.push(this);
        }
    }
    /**
     * Reverts this instance
     * @private
     */
    // tslint:disable: max-func-body-length
    public revert(): void {
        if (this.action === 'DeleteBookmark') {
            this.revertBookmark();
            return;
        }
        this.owner.isShiftingEnabled = true;
        let selectionStartTextPosition: TextPosition = undefined;
        let selectionEndTextPosition: TextPosition = undefined;
        let start: string = this.selectionStart;
        let end: string = this.selectionEnd;
        let isForwardSelection: boolean = TextPosition.isForwardSelection(start, end);
        if (this.modifiedProperties.length > 0 || this.action === 'Selection' || this.action === 'ClearCharacterFormat'
            || this.action === 'ClearParagraphFormat') {
            selectionStartTextPosition = this.getTextPosition(start);
            selectionEndTextPosition = this.getTextPosition(end);
            this.revertModifiedProperties(selectionStartTextPosition, selectionEndTextPosition);
        } else {
            let deletedNodes: IWidget[] = this.removedNodes;
            this.removedNodesIn = [];
            let isForward: boolean = TextPosition.isForwardSelection(this.insertPosition, this.endPosition);
            let insertTextPosition: TextPosition = this.getTextPosition(isForward ? this.insertPosition : this.endPosition);
            let endTextPosition: TextPosition = this.getTextPosition(isForward ? this.endPosition : this.insertPosition);
            if (insertTextPosition.isAtSamePosition(endTextPosition)) {
                this.owner.selection.selectContent(insertTextPosition, true);
            } else {
                this.owner.selection.selectPosition(insertTextPosition, endTextPosition);
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
            if (!insertTextPosition.isAtSamePosition(endTextPosition)) {
                isRemoveContent = this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'ClearCells'
                    || this.action === 'DeleteCells';
                if (!(isRemoveContent) && this.action !== 'MergeCells' && this.action !== 'InsertRowAbove'
                    && this.action !== 'InsertRowBelow' && this.action !== 'InsertColumnLeft'
                    && this.action !== 'InsertColumnRight' && this.action !== 'Borders'
                    && this.action !== 'DeleteTable' && this.action !== 'DeleteColumn' && this.action !== 'DeleteRow') {
                    this.owner.selection.end.setPositionInternal(endTextPosition);
                    if (!this.owner.selection.isEmpty) {
                        if (this.editorHistory.isRedoing) {
                            this.owner.editorModule.removeSelectedContents(this.owner.selection);
                        } else {
                            this.owner.editorModule.deleteSelectedContents(this.owner.selection, true);
                        }
                        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                            this.editorHistory.currentHistoryInfo.action === 'PageBreak' && this.viewer.blockToShift) {
                            this.viewer.layout.shiftLayoutedItems();
                        }
                    }
                }
            }
            let isRedoAction: boolean = this.editorHistory.isRedoing && !isRemoveContent;
            this.revertModifiedNodes(deletedNodes, isRedoAction, isForwardSelection ? start : end, start === end);
            if (isRemoveContent) {
                this.removeContent(insertTextPosition, endTextPosition);
            }
            //this.owner.editorModule.reLayout(this.viewer.selection);
        }
        let isSelectionChanged: boolean = false;
        if ((this.editorHistory.isUndoing && isNullOrUndefined(this.editorHistory.currentHistoryInfo)) ||
            ((this.action === 'InsertRowAbove' || this.action === 'Borders' || this.action === 'InsertRowBelow'
                || this.action === 'InsertColumnLeft'
                || this.action === 'InsertColumnRight') && (this.editorHistory.isRedoing
                    || this.editorHistory.currentHistoryInfo.action === 'Paste'))) {
            selectionStartTextPosition = this.getTextPosition(start);
            selectionEndTextPosition = this.getTextPosition(end);
            this.owner.selection.selectRange(selectionStartTextPosition, selectionEndTextPosition);
            isSelectionChanged = true;
        }
        // Updates insert position of history info instance.
        this.insertPosition = start;
        this.endPosition = end;
        this.owner.editorModule.reLayout(this.owner.selection, this.owner.selection.isEmpty);
        if (isSelectionChanged) {
            this.viewer.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
        }
        this.highlightListText();
    }
    private highlightListText(): void {
        if (!isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
            // tslint:disable-next-line:max-line-length
            if (this.action === 'ListCharacterFormat' || (this.editorHistory.currentHistoryInfo.action === 'ListSelect' && this.action === 'ListFormat')) {
                let selectionStartTextPosition: TextPosition = this.getTextPosition(this.selectionStart);
                let widget: LineWidget = selectionStartTextPosition.currentWidget as LineWidget;
                this.viewer.selection.highlightListText(widget);
            }
        }
    }
    private removeContent(insertTextPosition: TextPosition, endTextPosition: TextPosition): void {
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
                && !isNullOrUndefined(insertTextPosition.paragraph.bodyWidget))) {
            //Removes if any empty paragraph is added while delete.
            this.owner.selection.selectRange(insertTextPosition, endTextPosition);
            let isDelete: boolean = (this.action === 'BackSpace') ? true : false;
            this.owner.editorModule.deleteSelectedContents(this.owner.selection, isDelete);
        }
    }

    private revertModifiedProperties(start: TextPosition, end: TextPosition): void {
        if (this.action === 'CellFormat' || this.action === 'CellOptions' || this.action === 'TableOptions') {
            this.owner.isShiftingEnabled = false;
        }
        this.owner.selection.selectRange(start, end);
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
        }
    }
    /**
     * Revert the modified nodes
     * @param  {WNode[]} deletedNodes
     * @param  {boolean} isRedoAction
     * @param  {string} start
     * @param  {boolean} isEmptySelection
     */
    private revertModifiedNodes(deletedNodes: IWidget[], isRedoAction: boolean, start: string, isEmptySelection: boolean): void {
        if (isRedoAction && (this.action === 'BackSpace' || this.action === 'Delete' || this.action === 'DeleteTable'
            || this.action === 'DeleteColumn' || this.action === 'DeleteRow' || this.action === 'InsertRowAbove' ||
            this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft' || this.action === 'InsertColumnRight'
            || this.action === 'MergeCells' || this.action === 'SectionBreak')) {
            this.redoAction();
            if (this.action === 'SectionBreak') {
                return;
            }
        }
        if (deletedNodes.length > 0) {
            if ((this.editorHistory.isUndoing && (this.action === 'DeleteCells' || this.action === 'DeleteColumn'
                || this.action === 'DeleteRow' || this.action === 'MergeCells'))
                || (this.action === 'InsertRowAbove' || this.action === 'InsertRowBelow' || this.action === 'InsertColumnLeft'
                    || this.action === 'ClearCells' || this.action === 'InsertColumnRight' || this.action === 'Borders')) {
                let insertIndex: string = this.selectionStart;
                let block: BlockWidget = this.owner.editorModule.getBlock({ index: insertIndex }).node as BlockWidget;
                let lastNode: IWidget = deletedNodes[deletedNodes.length - 1];
                if ((block instanceof TableWidget || block.previousRenderedWidget instanceof TableWidget || block.isInsideTable)
                    && lastNode instanceof TableWidget) {
                    if (block instanceof ParagraphWidget && !block.isInsideTable) {
                        block = block.previousRenderedWidget as BlockWidget;
                    }
                    block = block.combineWidget(this.viewer) as BlockWidget;
                    this.owner.editorModule.insertTableInternal(block as TableWidget, lastNode as TableWidget, false);
                    deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
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
                    if (this.action === 'SectionBreak' && lastNode instanceof BodyWidget ||
                        !isNullOrUndefined(this.editorHistory.currentHistoryInfo) &&
                        this.editorHistory.currentHistoryInfo.action === 'PageBreak') {
                        lastNode = deletedNodes[1];
                    }
                    if (lastNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0) {
                        this.owner.editorModule.insertNewParagraphWidget(lastNode, true);
                        deletedNodes.splice(deletedNodes.indexOf(lastNode), 1);
                        if (isNullOrUndefined(block)) {
                            // tslint:disable-next-line:max-line-length
                            let nextBlock: BlockWidget = this.viewer.selection.getNextParagraphBlock(lastNode.getSplitWidgets().pop() as BlockWidget);
                            this.owner.selection.getNextRenderedBlock((lastNode as ParagraphWidget));
                            if (isNullOrUndefined(nextBlock)) {
                                //Sets the selection as starting of last paragraph.
                                this.owner.selection.selectParagraph(lastNode as ParagraphWidget, true);
                            }
                        }
                    }
                    if (lastNode instanceof TableWidget && this.owner.selection.start.offset > 0) {
                        let firstBlock: BlockWidget = deletedNodes[deletedNodes.length - 1] as BlockWidget;
                        if (firstBlock instanceof ParagraphWidget) {
                            this.owner.editorModule.insertNewParagraphWidget(firstBlock, true);
                            deletedNodes.splice(deletedNodes.indexOf(firstBlock), 1);
                            if (isNullOrUndefined(block)) {
                                // tslint:disable-next-line:max-line-length
                                let nextBlock: BlockWidget = this.viewer.selection.getNextParagraphBlock(firstBlock.getSplitWidgets().pop() as BlockWidget);
                                if (isNullOrUndefined(nextBlock)) {
                                    //Sets the selection as starting of last paragraph.
                                    this.owner.selection.selectParagraph(firstBlock as ParagraphWidget, true);
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
                    // tslint:disable-next-line:max-line-length
                    if (firstNode instanceof ParagraphWidget && this.owner.selection.start.offset > 0
                        && this.owner.selection.start.offset === this.owner.selection.getLineLength(this.owner.selection.start.paragraph.lastChild as LineWidget)) {
                        let editor: Editor = this.owner.editorModule;
                        editor.insertNewParagraphWidget(firstNode as ParagraphWidget, false);
                        deletedNodes.splice(deletedNodes.indexOf(firstNode), 1);
                        //Removes the intermediate empty paragraph instance.
                        if (this.action !== 'Paste') {
                            editor.removeBlock(this.owner.selection.start.paragraph);
                        }
                        // tslint:disable-next-line:max-line-length
                        let paragraph: ParagraphWidget = this.viewer.selection.getNextParagraphBlock(firstNode.getSplitWidgets().pop() as BlockWidget);
                        if (!isNullOrUndefined(paragraph)) {
                            this.owner.selection.selectParagraph(paragraph, true);
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
                            // tslint:disable-next-line:max-line-length
                            this.viewer.layout.layoutBodyWidgetCollection(block.index, block.containerWidget, block, false);
                        }
                    }
                } else if (block instanceof TableWidget) {
                    this.owner.editorModule.insertBlockTable(this.owner.selection, node as BlockWidget, block as TableWidget);
                } else {
                    this.owner.editorModule.insertBlock(node);
                }
            } else if (node instanceof BodyWidget) {
                this.owner.editorModule.insertSection(this.owner.selection, false);
            }
        }
        deletedNodes = [];
    }

    private revertResizing(): void {
        this.editorHistory.currentBaseHistoryInfo = this;
        if (this.action === 'RowResizing') {
            if (this.modifiedProperties[0] instanceof RowHistoryFormat) {
                // tslint:disable-next-line:max-line-length
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
    public getTextPosition(hierarchicalIndex: string): TextPosition {
        let textPosition: TextPosition = new TextPosition(this.owner);
        let blockInfo: ParagraphInfo = this.owner.editorModule.getParagraph({ index: hierarchicalIndex });
        let lineInfo: LineInfo = this.owner.editorModule.getLineInfo(blockInfo.paragraph, blockInfo.offset);
        textPosition.setPositionForLineWidget(lineInfo.line, lineInfo.offset);
        return textPosition;
    }
    /**
     * Add modified properties for section format
     * @param  {WSectionFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
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
    /**
     * Add the modified properties for character format
     * @param  {WCharacterFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public addModifiedProperties(format: WCharacterFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length           
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
    /**
     * Add the modified properties for paragraph format
     * @param  {WParagraphFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public addModifiedPropertiesForParagraphFormat(format: WParagraphFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
                previousFormat.listFormat = new WListFormat();
                previousFormat.listFormat.copyFormat(format.listFormat);
                this.currentPropertyIndex++;
                return value;
            }
            if (property === 'styleName') {
                if (!isNullOrUndefined(previousFormat.baseStyle)) {
                    value = new WParagraphStyle();
                    (value as WParagraphStyle).copyStyle(previousFormat.baseStyle as WParagraphStyle);
                    this.currentPropertyIndex++;
                    return value;
                } else {
                    return undefined;
                }
            }
            value = previousFormat.getPropertyValue(property);
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
    /**
     * @private
     */
    public addModifiedPropertiesForContinueNumbering(paragraphFormat: WParagraphFormat, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
    /**
     * @param listFormat 
     * @param value 
     * @private
     */
    public addModifiedPropertiesForRestartNumbering(listFormat: WListFormat, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
    /**
     * Add modified properties for list format
     * @param  {WListLevel} listLevel
     * @private
     */
    public addModifiedPropertiesForList(listLevel: WListLevel): Object {
        let value: Object;
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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

    /**
     * Revert the properties
     * @param  {SelectionRange} selectionRange    
     */
    private revertProperties(): void {
        this.editorHistory.currentBaseHistoryInfo = this;
        this.currentPropertyIndex = 0;
        let property: string = this.getProperty();
        this.viewer.owner.editorModule.setOffsetValue(this.viewer.selection);
        if (this.action === 'ClearCharacterFormat' || this.modifiedProperties[0] instanceof WCharacterFormat) {
            if (this.action === 'ListCharacterFormat') {
                this.owner.editorModule.updateListCharacterFormat(this.viewer.selection, property, undefined);
                return;
            }
            this.owner.editorModule.updateSelectionCharacterFormatting(property, undefined, false);
        } else if (this.action === 'ClearParagraphFormat' || this.modifiedProperties[0] instanceof WParagraphFormat) {
            if (this.action === 'ContinueNumbering') {
                // tslint:disable-next-line:max-line-length
                this.owner.editorModule.revertContinueNumbering(this.owner.selection, <WParagraphFormat>this.modifiedProperties[0]);
                return;
            }
            if (this.action === 'StyleName' && this.modifiedProperties[0] instanceof WParagraphFormat) {
                // tslint:disable-next-line:max-line-length
                this.owner.editorModule.updateSelectionParagraphFormatting(property, (this.modifiedProperties[0] as WParagraphFormat).baseStyle, false);
                return;
            }
            this.owner.editorModule.updateSelectionParagraphFormatting(property, undefined, false);
        } else if (this.modifiedProperties[0] instanceof WSectionFormat) {
            this.owner.editorModule.updateSectionFormat(property, undefined);
        } else if (this.action === 'RestartNumbering') {
            this.owner.editorModule.restartListAtInternal(this.owner.selection, <number>this.modifiedProperties[0]);
            return;
        } else if (this.modifiedProperties[0] instanceof ImageFormat) {
            this.owner.selection.updateImageSize(this.modifiedProperties[0] as ImageFormat);
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
            this.owner.editorModule.getOffsetValue(this.viewer.selection);
        }
    }
    /**
     * Add modified properties for cell options dialog
     * @param  {WCellFormat} format
     * @param  {WTable} table
     * @private
     */
    public addModifiedCellOptions(applyFormat: WCellFormat, format: WCellFormat, table: TableWidget): WCellFormat {
        let currentFormat: WCellFormat;
        if (isNullOrUndefined(applyFormat.bottomMargin) && isNullOrUndefined(applyFormat.topMargin)
            && isNullOrUndefined(applyFormat.rightMargin) && isNullOrUndefined(applyFormat.leftMargin)) {
            currentFormat = this.copyCellOptions(table.tableFormat);
        } else {
            currentFormat = this.copyCellOptions(applyFormat);
        }
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
    /**
     * Add modified properties for cell options dialog
     * @param  {WTableFormat} format
     * @private
     */
    public addModifiedTableOptions(format: WTableFormat): void {
        let currentFormat: WTableFormat = this.copyTableOptions(format);
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length           
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
    /**
     * Add modified properties for table format
     * @param  {WTableFormat} format
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public addModifiedTableProperties(format: WTableFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
    /**
     * Add modified properties for row format
     * @param  {WRowFormat} rowFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public addModifiedRowProperties(rowFormat: WRowFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
    /**
     * Add modified properties for cell format
     * @param  {WCellFormat} cellFormat
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public addModifiedCellProperties(cellFormat: WCellFormat, property: string, value: Object): Object {
        if (this.editorHistory.isUndoing || this.editorHistory.isRedoing) {
            // tslint:disable-next-line:max-line-length
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
                } else if (node instanceof ElementBox) {
                    (node as ElementBox).destroy();
                }
                this.removedNodes.splice(this.removedNodes.indexOf(node), 1);
                i--;
            }
            this.removedNodesIn = undefined;
        }
        this.ownerIn = undefined;
    }
}