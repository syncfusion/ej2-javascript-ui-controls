import { Dictionary } from '../../base/dictionary';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { Selection } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { DocumentEditor } from '../../document-editor';
import { Action, CONTROL_CHARACTERS } from '../../index';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo } from './base-history-info';
import { ModifiedParagraphFormat, ModifiedLevel, RowHistoryFormat, TableHistoryInfo, CellHistoryFormat } from './history-helper';
import { HistoryInfo } from './history-info';
import { WParagraphFormat } from '../format/paragraph-format';
import { ParagraphWidget, TableRowWidget, TableWidget } from '../viewer/page';
import { Point, HelperMethods } from '../editor/editor-helper';
import { TableResizer } from '../editor/table-resizer';
import { DocumentHelper } from '../viewer';

/**
 *  `EditorHistory` Module class is used to handle history preservation
 */
export class EditorHistory {
    private undoLimitIn: number;
    private redoLimitIn: number;
    //Fields
    private undoStackIn: BaseHistoryInfo[] = [];
    private redoStackIn: BaseHistoryInfo[] = [];
    /**
     * @private
     */
    public historyInfoStack: HistoryInfo[] = [];
    private isUndoGroupingEnded: boolean = true;
    private owner: DocumentEditor;
    /**
     * @private
     */
    public isUndoing: boolean = false;
    /**
     * @private
     */
    public isRedoing: boolean = false;
    /**
     * @private
     */
    public currentBaseHistoryInfo: BaseHistoryInfo;
    /**
     * @private
     * @returns {HistoryInfo} - Returns the history info.
     */
    public get currentHistoryInfo(): HistoryInfo {
        return this.historyInfoStack && this.historyInfoStack.length > 0 ?
            this.historyInfoStack[this.historyInfoStack.length - 1] : undefined;
    }
    /**
     * @private
     * @param {HistoryInfo} value - Specified the value.
     */
    public set currentHistoryInfo(value: HistoryInfo) {
        if (value instanceof HistoryInfo) {
            this.historyInfoStack.push(value);
        } else {
            this.historyInfoStack.pop();
        }
    }
    /**
     * @private
     */
    public modifiedParaFormats: Dictionary<BaseHistoryInfo, ModifiedParagraphFormat[]>;
    /**
     * @private
     */
    public documentHelper: DocumentHelper;

    /**
     * @private
     */
    public lastOperation: BaseHistoryInfo;

    //Properties
    /**
     * gets undo stack
     *
     * @private
     * @returns {BaseHistoryInfo[]} - Returns the undo stack.
     */

    public get undoStack(): BaseHistoryInfo[] {
        return this.undoStackIn;
    }
    /**
     * gets redo stack
     *
     * @private
     * @returns {BaseHistoryInfo[]} - Returns the redo stack.
     */
    public get redoStack(): BaseHistoryInfo[] {
        return this.redoStackIn;
    }
    /**
     * Gets the limit of undo operations can be done.
     *
     * @aspType int
     * @returns {number} - Returns the redo limit
     */
    public get undoLimit(): number {
        return isNullOrUndefined(this.undoLimitIn) ? 0 : this.undoLimitIn;
    }
    /**
     * Sets the limit of undo operations can be done.
     *
     * @aspType int
     * @param {number} value - Specifies the value to set undo limit.
     */
    public set undoLimit(value: number) {
        if (value < 0) {
            throw new Error('The limit should be greater than or equal to zero.');
        }
        this.undoLimitIn = value;
    }
    /**
     * Gets the limit of redo operations can be done.
     *
     * @aspType int
     * @returns {number} - Returns the redo limit.
     */
    public get redoLimit(): number {
        return isNullOrUndefined(this.redoLimitIn) ? 0 : this.redoLimitIn;
    }
    /**
     * Sets the limit of redo operations can be done.
     *
     * @aspType int
     * @param {number} value Specifies the value to set redo limit.
     */
    public set redoLimit(value: number) {
        if (value < 0) {
            throw new Error('The limit should be greater than or equal to zero.');
        }
        this.redoLimitIn = value;
    }
    /**
     * @param {DocumentEditor} node - Specified the document editor.
     * @private
     */
    public constructor(node: DocumentEditor) {
        this.owner = node;
        this.documentHelper = node.documentHelper;
        this.modifiedParaFormats = new Dictionary<BaseHistoryInfo, ModifiedParagraphFormat[]>();
        this.undoLimitIn = 500;
        this.redoLimitIn = 500;
    }
    private get viewer(): LayoutViewer {
        return this.owner.viewer;
    }


    private getModuleName(): string {
        return 'EditorHistory';
    }
    /**
     * Determines whether the undo operation can be done.
     *
     * @returns {boolean} - Returns true if can undo; Otherwise, false.
     */
    public canUndo(): boolean {
        return !isNullOrUndefined(this.undoStack) && this.undoStack.length > 0;
    }
    /**
     * Determines whether the redo operation can be done.
     *
     * @returns {boolean} - Returns true if can redo; Otherwise, false.
     */
    public canRedo(): boolean {
        return !isNullOrUndefined(this.redoStack) && this.redoStack.length > 0;
    }
    //EditorHistory Initialization
    /**
     * initialize EditorHistory
     *
     * @private
     * @param {Action} action - Specifies the action.
     * @returns {void}
     */
    public initializeHistory(action: Action): void {
        if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
            this.currentBaseHistoryInfo.destroy();
        }
        this.currentBaseHistoryInfo = new BaseHistoryInfo(this.owner);
        this.currentBaseHistoryInfo.action = action;
        if (action !== 'ModifyStyle') {
            this.currentBaseHistoryInfo.updateSelection();
        }
        if (!isNullOrUndefined(this.documentHelper.selection) && this.documentHelper.selection.isEmpty
            && (action === 'BackSpace' || action === 'Delete' ||
                (action === 'Insert' && !isNullOrUndefined(this.documentHelper.owner.editor) && this.documentHelper.owner.editor.handledTextInput))) {
            this.currentBaseHistoryInfo.isEmptySelection = true;
        }
    }
    /**
     * Initialize complex history
     *
     * @private
     * @param {Selection} selection - Specifies the selection.
     * @param {Action} action - Specifies the action.
     * @returns {void}
     */
    public initComplexHistory(selection: Selection, action: Action): void {
        this.currentHistoryInfo = new HistoryInfo(selection.owner, !isNullOrUndefined(this.currentHistoryInfo));
        this.currentHistoryInfo.action = action;
        switch (action) {
        case 'PageBreak':
            this.currentHistoryInfo.insertedText = CONTROL_CHARACTERS.PageBreak;
            this.currentHistoryInfo.insertPosition = selection.startOffset;
            break;
        case 'ColumnBreak':
            this.currentHistoryInfo.insertedText = CONTROL_CHARACTERS.ColumnBreak;
            this.currentHistoryInfo.insertPosition = selection.startOffset;
            break;
        }
        this.currentHistoryInfo.updateSelection();
    }
    /**
     * @private
     * @param {Point} startingPoint - Specifies the start point.
     * @param {TableResizer} tableResize - Spcifies the table resizer.
     * @returns {void}
     */
    public initResizingHistory(startingPoint: Point, tableResize: TableResizer): void {
        if (tableResize.resizeNode === 1) {
            this.initializeHistory('RowResizing');
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                /* eslint-disable-next-line max-len */
                tableResize.currentResizingTable = tableResize.currentResizingTable.combineWidget(this.viewer) as TableWidget;
                this.currentBaseHistoryInfo.modifiedProperties.push(new RowHistoryFormat(
                    tableResize.currentResizingTable, startingPoint,
                    (tableResize.currentResizingTable.childWidgets[tableResize.resizerPosition] as TableRowWidget).rowFormat, this.owner));
                this.documentHelper.layout.reLayoutTable(tableResize.currentResizingTable);
            }
        } else {
            this.initializeHistory('CellResizing');
            if (this.currentBaseHistoryInfo) {
                tableResize.currentResizingTable = tableResize.currentResizingTable.combineWidget(this.viewer) as TableWidget;
                const tableHistoryInfo: TableHistoryInfo = new TableHistoryInfo(tableResize.currentResizingTable, this.owner);
                tableHistoryInfo.startingPoint = startingPoint;
                this.currentBaseHistoryInfo.modifiedProperties.push(tableHistoryInfo);
                this.documentHelper.layout.reLayoutTable(tableResize.currentResizingTable);
            }
        }
    }
    /**
     * Starts a new undo able action.
     * > All editing and formatting changes made between `beginUndoAction` and `endUndoAction` will be grouped together as a single undo able action.
     *
     * @returns {void}
     */
    public beginUndoAction(): void {
        if (this.isUndoGroupingEnded) {
            this.owner.editorModule.initComplexHistory('Grouping');
            this.isUndoGroupingEnded = false;
            this.clearRedoStack();
        }
    }
    /**
     * Ends the current undo able action.
     * > All editing and formatting changes made between `beginUndoAction` and `endUndoAction` will be grouped together as a single undo able action.
     *
     * @returns {void}
     */
    public endUndoAction(): void {
        if (!this.isUndoGroupingEnded) {
            this.updateComplexHistory();
            this.isUndoGroupingEnded = true;
        }
    }
    /**
     * Update resizing history
     *
     * @private
     * @param {Point} point - Specifies the point.
     * @param {TableResizer} tableResize - Specifies the table resizer.
     * @returns {void}
     */
    public updateResizingHistory(point: Point, tableResize: TableResizer): void {
        if (tableResize.resizeNode === 1) {
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                const rowHistoryFormat: RowHistoryFormat = this.currentBaseHistoryInfo.modifiedProperties[0] as RowHistoryFormat;
                if (rowHistoryFormat.startingPoint.y === point.y) {
                    this.currentBaseHistoryInfo.modifiedProperties.length = 0;
                } else {
                    rowHistoryFormat.displacement = HelperMethods.convertPixelToPoint(point.y - rowHistoryFormat.startingPoint.y);
                    this.recordChanges(this.currentBaseHistoryInfo);
                    this.owner.fireContentChange();
                    this.currentBaseHistoryInfo = undefined;
                }
            }
        } else {
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                const cellHistoryFormat: CellHistoryFormat = this.currentBaseHistoryInfo.modifiedProperties[0] as CellHistoryFormat;
                if (cellHistoryFormat.startingPoint.x === point.x) {
                    this.currentBaseHistoryInfo.modifiedProperties.length = 0;
                } else {
                    cellHistoryFormat.displacement = HelperMethods.convertPixelToPoint(point.x - cellHistoryFormat.startingPoint.x);
                    cellHistoryFormat.endIndex = tableResize.getCellReSizerPosition(point);
                    this.owner.editorHistoryModule.recordChanges(this.currentBaseHistoryInfo);
                    this.owner.fireContentChange();
                    this.currentBaseHistoryInfo = undefined;
                }
            }
        }
    }
    /**
     * Record the changes
     *
     * @private
     * @param {BaseHistoryInfo} baseHistoryInfo - Specified the base history info.
     * @returns {void}
     */
    public recordChanges(baseHistoryInfo: BaseHistoryInfo): void {
        if (!this.owner.enableHistoryMode) {
            return;
        }
        if (this.isUndoing) {
            if (isNullOrUndefined(this.redoStack)) {
                this.redoStackIn = [];
            }
            if (this.redoStack.length === this.redoLimit && this.redoLimit > 0) {
                const count: number = this.undoLimit > 20 ? 10 : 1;
                this.redoStackIn.splice(0, count);
            }
            if (this.redoStack.length < this.redoLimit) {
                this.redoStack.push(baseHistoryInfo);
            }
        } else {
            if (!this.isRedoing) {
                this.clearRedoStack();
            }
            if (isNullOrUndefined(this.undoStack)) {
                this.undoStackIn = [];
            }
            if (this.undoStack.length === this.undoLimit && this.undoLimit > 0) {
                const count: number = this.undoLimit > 20 ? 10 : 1;
                this.undoStackIn.splice(0, count);
            }
            if (this.undoStack.length < this.undoLimit) {
                this.undoStackIn.push(baseHistoryInfo);
            }
        }
        this.lastOperation = baseHistoryInfo;
    }
    /**
     * update EditorHistory
     *
     * @private
     * @returns {void}
     */
    public updateHistory(): void {
        if (this.documentHelper.owner.enableHistoryMode && !isNullOrUndefined(this.currentBaseHistoryInfo)) {
            //Updates the current end position
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)
                && isNullOrUndefined(this.currentBaseHistoryInfo.endPosition)) {
                this.currentBaseHistoryInfo.endPosition = this.currentBaseHistoryInfo.insertPosition;
            }
            if (!isNullOrUndefined(this.currentHistoryInfo)) {
                this.currentHistoryInfo.addModifiedAction(this.currentBaseHistoryInfo);
            } else {
                this.recordChanges(this.currentBaseHistoryInfo);
            }
            this.currentBaseHistoryInfo = undefined;
        }
    }
    /**
     * @private
     * @returns {boolean} -Returns isHandleComplexHistory
     */
    public isHandledComplexHistory(): boolean {
        let isHandledComplexHistory: boolean = false;
        if (!(this.isUndoing || this.isRedoing)) {
            if (this.owner.editorModule.removedBookmarkElements.length > 0
                && this.owner.editorModule.insertRemoveBookMarkElements(isHandledComplexHistory)) {
                isHandledComplexHistory = true;
            }
            if (this.owner.editorModule.removedEditRangeEndElements.length > 0
                && this.owner.editorModule.insertRemovedEditRangeEndElements(isHandledComplexHistory)) {
                isHandledComplexHistory = true;
            }
            if (this.owner.editorModule.removedEditRangeStartElements.length > 0
                && this.owner.editorModule.insertRemovedEditRangeStartElements(isHandledComplexHistory)) {
                isHandledComplexHistory = true;
            }
            if (this.owner.editorModule.removedContentControlElements.length > 0
                && this.owner.editorModule.insertRemoveContentControlElements(isHandledComplexHistory)) {
                isHandledComplexHistory = true;
            }
        }
        if (this.documentHelper.owner.enableHistoryMode && !isNullOrUndefined(this.currentHistoryInfo)) {
            if (this.currentHistoryInfo.action !== 'Grouping') {
                this.updateHistory();
                isHandledComplexHistory = true;
            }
        } else if (this.owner.editorModule.isHandledComplex) {
            isHandledComplexHistory = true;
        }
        return isHandledComplexHistory;
    }

    /**
     * Update complex history
     *
     * @private
     * @returns {void}
     */
    public updateComplexHistory(): void {
        const selection: Selection = this.documentHelper.selection;
        if (!isNullOrUndefined(this.currentHistoryInfo) && this.currentHistoryInfo.hasAction) {
            if (this.currentHistoryInfo.action === 'AutoFormatHyperlink' || this.currentHistoryInfo.action === 'SkipCommentInline'
            || this.currentHistoryInfo.action === 'DeleteCommentInline' || this.currentHistoryInfo.action === 'RemoveComment') {
                // this.reLayoutParagraph(startPosition.paragraph, 0);
                if (selection.owner.editorHistoryModule.isUndoing) {
                    this.owner.editorModule.setPositionForCurrentIndex(selection.start, this.currentHistoryInfo.selectionStart);
                    this.owner.editorModule.setPositionForCurrentIndex(selection.end, this.currentHistoryInfo.selectionEnd);
                } else {
                    this.owner.editorModule.setPositionForCurrentIndex(selection.start, this.currentHistoryInfo.endPosition);
                    this.owner.editorModule.setPositionForCurrentIndex(selection.end, this.currentHistoryInfo.endPosition);
                }
            }
            if (this.currentHistoryInfo.action === 'InsertHyperlink') {
                const startPosition: TextPosition = new TextPosition(selection.owner);
                if (!isNullOrUndefined(this.currentHistoryInfo.insertPosition)) {
                    this.owner.editorModule.setPositionForCurrentIndex(startPosition, this.currentHistoryInfo.insertPosition);
                    const endPosition: TextPosition = new TextPosition(selection.owner);
                    this.owner.editorModule.setPositionForCurrentIndex(endPosition, this.currentHistoryInfo.endPosition);
                    this.documentHelper.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
                    if (endPosition.paragraph !== startPosition.paragraph) {
                        this.documentHelper.layout.reLayoutParagraph(endPosition.paragraph, 0, 0);
                    }
                }
            }
            if (this.currentHistoryInfo.action === 'ReplaceAll') {
                this.documentHelper.contentControlCollection = [];
                this.owner.editorModule.layoutWholeDocument();
            } else if (selection.owner.isShiftingEnabled) {
                if (!isNullOrUndefined(selection.editRegionHighlighters)) {
                    selection.editRegionHighlighters.clear();
                }
                this.documentHelper.layout.shiftLayoutedItems(false);
                if (this.owner.enableHeaderAndFooter) {
                    this.owner.editorModule.updateHeaderFooterWidget();
                }
                this.documentHelper.removeEmptyPages();
            }
        }
        if (this.owner.showRevisions && !this.owner.editorModule.restrictLayout) {
            this.owner.trackChangesPane.updateTrackChanges();
        }
        selection.owner.isShiftingEnabled = false;
        selection.owner.isLayoutEnabled = true;
        // // selection.addMultipleSelectionRanges();

        if (!isNullOrUndefined(this.currentHistoryInfo) && this.currentHistoryInfo.action === 'ApplyStyle') {
            this.owner.editorModule.getOffsetValue(selection);
        } else {
            selection.start.updatePhysicalPosition(true);
            if (selection.isEmpty) {
                selection.end.setPositionInternal(selection.start);
            } else {
                selection.end.updatePhysicalPosition(true);
            }
        }
        selection.upDownSelectionLength = selection.end.location.x;
        this.documentHelper.isScrollHandler = true;
        if (!this.owner.editorModule.restrictLayout) {
            this.viewer.updateScrollBars();
        }
        selection.fireSelectionChanged(true);
        this.documentHelper.isScrollHandler = false;
        if (this.owner.enableAutoFocus)
        {
            this.documentHelper.updateFocus();
        }

        this.updateComplexHistoryInternal();
        if (!this.owner.editorModule.isInsertingTOC) {
            this.owner.editorModule.fireContentChange();
        }
    }
    /**
     * @private
     *
     * @returns {void}
     */
    public updateComplexHistoryInternal(): void {
        if (!isNullOrUndefined(this.currentHistoryInfo)) {
            //Updates the current end position
            if (isNullOrUndefined(this.currentHistoryInfo.endPosition)) {
                this.currentHistoryInfo.endPosition = this.currentHistoryInfo.insertPosition;
            }
            if (this.historyInfoStack.length > 1) {
                const historyInfo: HistoryInfo = this.historyInfoStack[this.historyInfoStack.length - 2];
                historyInfo.addModifiedAction(this.currentHistoryInfo);
            } else {
                this.recordChanges(this.currentHistoryInfo);
            }
            this.currentHistoryInfo = undefined;
        }
    }
    //List history preservation undo API
    /**
     * update list changes for history preservation
     *
     * @private
     * @param  {WAbstractList} currentAbstractList - Specfies the abstractlist.
     * @param  {WList} list - Specifies the list.
     * @returns {Dictionary<number, ModifiedLevel>} - Returns the modified action.
     */
    public updateListChangesInHistory(currentAbstractList: WAbstractList, list: WList): Dictionary<number, ModifiedLevel> {
        this.currentBaseHistoryInfo = new BaseHistoryInfo(this.documentHelper.owner);
        this.currentBaseHistoryInfo.action = 'List';
        this.currentBaseHistoryInfo.updateSelection();
        const collection: Dictionary<number, ModifiedLevel> = new Dictionary<number, ModifiedLevel>();
        for (let i: number = 0; i < currentAbstractList.levels.length; i++) {
            const levels: WListLevel = this.documentHelper.getAbstractListById(list.abstractListId).levels[parseInt(i.toString(), 10)];
            this.currentBaseHistoryInfo.addModifiedPropertiesForList(levels);
            const modifiedLevel: ModifiedLevel = new ModifiedLevel(levels, currentAbstractList.levels[parseInt(i.toString(), 10)]);
            if (!isNullOrUndefined(levels)) {
                this.documentHelper.owner.editorModule.copyListLevel(
                    levels, (currentAbstractList.levels[parseInt(i.toString(), 10)] as WListLevel));
            }
            collection.add(i, modifiedLevel);
        }
        return collection;
    }
    /**
     * Apply list changes
     *
     * @private
     * @param  {Selection} selection - Specifies the selection.
     * @param  {Dictionary<number, ModifiedLevel>} modifiedLevelsInternal - Specifies the modified levels.
     * @returns {void}
     */
    public applyListChanges(selection: Selection, modifiedLevelsInternal: Dictionary<number, ModifiedLevel>): void {
        if (isNullOrUndefined(this.modifiedParaFormats)) {
            this.modifiedParaFormats = new Dictionary<BaseHistoryInfo, ModifiedParagraphFormat[]>();
        }
        const collection: ModifiedParagraphFormat[] = [];
        for (let i: number = 0; i < this.documentHelper.listParagraphs.length; i++) {
            const paragraph: ParagraphWidget = this.documentHelper.listParagraphs[parseInt(i.toString(), 10)];
            const paraFormat: WParagraphFormat = paragraph.paragraphFormat;
            const currentList: WList = this.documentHelper.getListById(paraFormat.listFormat.listId);
            const listLevel: WListLevel = this.documentHelper.layout.getListLevel(currentList, paraFormat.listFormat.listLevelNumber);
            if (modifiedLevelsInternal.containsKey(paraFormat.listFormat.listLevelNumber)
                && modifiedLevelsInternal.get(paraFormat.listFormat.listLevelNumber).ownerListLevel === listLevel) {
                const modifiedFormat: WParagraphFormat = new WParagraphFormat(null);
                modifiedFormat.leftIndent = paraFormat.leftIndent;
                modifiedFormat.firstLineIndent = paraFormat.firstLineIndent;
                const modified: ModifiedParagraphFormat = new ModifiedParagraphFormat(paraFormat, modifiedFormat);
                collection.push(modified);
                this.owner.editorModule.copyFromListLevelParagraphFormat(paraFormat, listLevel.paragraphFormat);
            }
        }
        this.modifiedParaFormats.add(this.currentBaseHistoryInfo, collection);
    }
    /**
     * Update list changes
     *
     * @private
     * @param  {Dictionary<number, ModifiedLevel>} modifiedCollection - Specifies the modified colection.
     * @returns {void }
     */
    public updateListChanges(modifiedCollection: Dictionary<number, ModifiedLevel>): void {
        this.documentHelper.owner.isLayoutEnabled = false;
        this.owner.editorModule.updateListParagraphs();
        for (let i: number = 0; i < modifiedCollection.keys.length; i++) {
            const levelNumber: number = modifiedCollection.keys[parseInt(i.toString(), 10)];
            let modifiedLevel: ModifiedLevel = modifiedCollection.get(levelNumber);
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                modifiedLevel = this.currentBaseHistoryInfo.addModifiedPropertiesForList(modifiedLevel.ownerListLevel) as ModifiedLevel;
            }
            this.owner.editorModule.copyListLevel(modifiedLevel.ownerListLevel, modifiedLevel.modifiedListLevel);
        }
        this.documentHelper.owner.isLayoutEnabled = true;
        this.documentHelper.renderedLists.clear();
        this.documentHelper.renderedLevelOverrides = [];
        this.owner.editorModule.layoutWholeDocument();
        const selection: Selection = this.documentHelper.selection;
        selection.start.updatePhysicalPosition(true);
        if (selection.isEmpty) {
            selection.end.setPositionInternal(selection.start);
        } else {
            selection.end.updatePhysicalPosition(true);
        }
        selection.upDownSelectionLength = selection.end.location.x;
        selection.fireSelectionChanged(false);
        this.updateHistory();
    }
    /**
     * Reverts the last editing action.
     *
     * @returns {void}
     */
    public undo(): void {
        if ((this.owner.isReadOnlyMode && !this.owner.documentHelper.isCommentOnlyMode &&
            (this.owner.documentHelper.protectionType !== 'FormFieldsOnly')) ||
            !this.canUndo() || !this.owner.enableHistoryMode) {
            return;
        }
        //this.owner.ClearTextSearchResults();

        const historyInfo: BaseHistoryInfo = this.undoStack.pop();
        this.isUndoing = true;
        historyInfo.revert();
        this.isUndoing = false;
        this.owner.selection.contentControleditRegionHighlighters.clear();
        this.owner.selection.onHighlightContentControl();
        this.owner.selectionModule.checkForCursorVisibility();
        this.owner.editorModule.isBordersAndShadingDialog = false;
    }
    /**
     * Performs the last reverted action.
     *
     * @returns {void}
     */
    public redo(): void {
        if ((this.owner.isReadOnlyMode && !this.owner.documentHelper.isCommentOnlyMode &&
            (this.owner.documentHelper.protectionType !== 'FormFieldsOnly'))
            || !this.canRedo() || !this.owner.enableHistoryMode) {
            return;
        }
        //this.owner.ClearTextSearchResults();
        const historyInfo: BaseHistoryInfo = this.redoStack.pop();
        if (historyInfo.action === 'BordersAndShading') {
            this.owner.editorModule.isBordersAndShadingDialog = true;
        }
        this.isRedoing = true;
        historyInfo.revert();
        this.isRedoing = false;
        this.owner.selection.contentControleditRegionHighlighters.clear();
        this.owner.selection.onHighlightContentControl();
        this.owner.selectionModule.checkForCursorVisibility();
        this.owner.editorModule.isBordersAndShadingDialog = false;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.clearHistory();
        this.undoStackIn = undefined;
        this.redoStackIn = undefined;
    }
    /**
     * @private
     * @returns {void}
     */
    public clearHistory(): void {
        this.clearUndoStack();
        this.clearRedoStack();
    }
    private clearUndoStack(): void {
        if (this.canUndo()) {
            while (this.undoStack.length > 0) {
                let historyInfo: BaseHistoryInfo = this.undoStack.pop();
                historyInfo.destroy();
                historyInfo = undefined;
            }
        }
    }
    private clearRedoStack(): void {
        if (this.canRedo()) {
            while (this.redoStack.length > 0) {
                let historyInfo: BaseHistoryInfo = this.redoStack.pop();
                historyInfo.destroy();
                historyInfo = undefined;
            }
        }
    }
}
