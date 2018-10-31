import { Dictionary } from '../../base/dictionary';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { Selection } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { DocumentEditor } from '../../document-editor';
import { Action } from '../../index';
import { LayoutViewer } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, } from './base-history-info';
import { ModifiedParagraphFormat, ModifiedLevel, RowHistoryFormat, TableHistoryInfo, CellHistoryFormat } from './history-helper';
import { HistoryInfo } from './history-info';
import { WParagraphFormat } from '../format/paragraph-format';
import { ParagraphWidget, TableRowWidget, TableWidget } from '../viewer/page';
import { Point, HelperMethods } from '../editor/editor-helper';
import { TableResizer } from '../editor/table-resizer';

/**
 *  `EditorHistory` Module class is used to handle history preservation
 */
export class EditorHistory {
    private undoLimitIn: number;
    private redoLimitIn: number;
    //Fields
    private undoStackIn: BaseHistoryInfo[] = [];
    private redoStackIn: BaseHistoryInfo[] = [];
    private historyInfoStack: HistoryInfo[] = [];
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
     */
    get currentHistoryInfo(): HistoryInfo {
        return this.historyInfoStack && this.historyInfoStack.length > 0 ?
            this.historyInfoStack[this.historyInfoStack.length - 1] : undefined;
    }
    set currentHistoryInfo(value: HistoryInfo) {
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
    private viewer: LayoutViewer;
    //Properties
    /**
     * gets undo stack
     * @private
     */

    get undoStack(): BaseHistoryInfo[] { return this.undoStackIn; }
    /**
     * gets redo stack
     * @private
     */
    get redoStack(): BaseHistoryInfo[] { return this.redoStackIn; }
    /**
     * Gets or Sets the limit of undo operations can be done.
     */
    get undoLimit(): number {
        return isNullOrUndefined(this.undoLimitIn) ? 0 : this.undoLimitIn;
    }
    set undoLimit(value: number) {
        if (value < 0) {
            throw new Error('The limit should be greater than or equal to zero.');
        }
        this.undoLimitIn = value;
    }
    /**
     * Gets or Sets the limit of redo operations can be done.
     */
    get redoLimit(): number {
        return isNullOrUndefined(this.redoLimitIn) ? 0 : this.redoLimitIn;
    }
    set redoLimit(value: number) {
        if (value < 0) {
            throw new Error('The limit should be greater than or equal to zero.');
        }
        this.redoLimitIn = value;
    }
    /**
     * @private
     */
    constructor(node: DocumentEditor) {
        this.owner = node;
        this.viewer = node.viewer;
        this.modifiedParaFormats = new Dictionary<BaseHistoryInfo, ModifiedParagraphFormat[]>();
        this.undoLimitIn = 500;
        this.redoLimitIn = 500;
    }
    /**
     * @private
     */
    public getModuleName(): string {
        return 'EditorHistory';
    }
    /**
     * Determines whether undo operation can be done.
     * @returns boolean         
     */
    public canUndo(): boolean {
        return !isNullOrUndefined(this.undoStack) && this.undoStack.length > 0;
    }
    /**
     * Determines whether redo operation can be done.
     * @returns boolean 
     */
    public canRedo(): boolean {
        return !isNullOrUndefined(this.redoStack) && this.redoStack.length > 0;
    }
    //EditorHistory Initialization    
    /**
     * initialize EditorHistory
     * @param  {Selection} selection
     * @param  {Action} action
     * @param  {SelectionRange} selectionRange
     * @private
     */
    public initializeHistory(action: Action): void {
        this.currentBaseHistoryInfo = new BaseHistoryInfo(this.owner);
        this.currentBaseHistoryInfo.action = action;
        this.currentBaseHistoryInfo.updateSelection();
    }
    /**
     * Initialize complex history
     * @param  {Selection} selection
     * @param  {Action} action
     * @private
     */
    public initComplexHistory(selection: Selection, action: Action): void {
        this.currentHistoryInfo = new HistoryInfo(selection.owner, !isNullOrUndefined(this.currentHistoryInfo));
        this.currentHistoryInfo.action = action;
        this.currentHistoryInfo.updateSelection();
    }
    /**
     * @private
     */
    public initResizingHistory(startingPoint: Point, tableResize: TableResizer): void {
        if (tableResize.resizeNode === 1) {
            this.initializeHistory('RowResizing');
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                // tslint:disable-next-line:max-line-length
                this.currentBaseHistoryInfo.modifiedProperties.push(new RowHistoryFormat(startingPoint, (tableResize.currentResizingTable.childWidgets[tableResize.resizerPosition] as TableRowWidget).rowFormat));
            }
        } else {
            this.initializeHistory('CellResizing');
            if (this.currentBaseHistoryInfo) {
                tableResize.currentResizingTable = tableResize.currentResizingTable.combineWidget(this.viewer) as TableWidget;
                let tableHistoryInfo: TableHistoryInfo = new TableHistoryInfo(tableResize.currentResizingTable, this.owner);
                tableHistoryInfo.startingPoint = startingPoint;
                this.currentBaseHistoryInfo.modifiedProperties.push(tableHistoryInfo);
            }
        }
    }

    /**
     * Update resizing history
     * @param  {Point} point
     * @param  {Selection} selection
     * @private
     */
    public updateResizingHistory(point: Point, tableResize: TableResizer): void {
        if (tableResize.resizeNode === 1) {
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                let rowHistoryFormat: RowHistoryFormat = this.currentBaseHistoryInfo.modifiedProperties[0] as RowHistoryFormat;
                if (rowHistoryFormat.startingPoint.y === point.y) {
                    this.currentBaseHistoryInfo.modifiedProperties.length = 0;
                } else {
                    rowHistoryFormat.displacement = HelperMethods.convertPixelToPoint(point.y - rowHistoryFormat.startingPoint.y);
                    this.recordChanges(this.currentBaseHistoryInfo);
                    this.currentBaseHistoryInfo = undefined;
                }
            }
        } else {
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                let cellHistoryFormat: CellHistoryFormat = this.currentBaseHistoryInfo.modifiedProperties[0] as CellHistoryFormat;
                if (cellHistoryFormat.startingPoint.x === point.x) {
                    this.currentBaseHistoryInfo.modifiedProperties.length = 0;
                } else {
                    cellHistoryFormat.displacement = HelperMethods.convertPixelToPoint(point.x - cellHistoryFormat.startingPoint.x);
                    cellHistoryFormat.endIndex = tableResize.getCellReSizerPosition(point);
                    this.owner.editorHistory.recordChanges(this.currentBaseHistoryInfo);
                    this.currentBaseHistoryInfo = undefined;
                }
            }
        }
    }
    /**
     * Record the changes
     * @param  {BaseHistoryInfo} baseHistoryInfo
     * @private
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
                let count: number = this.undoLimit > 20 ? 10 : 1;
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
                let count: number = this.undoLimit > 20 ? 10 : 1;
                this.undoStackIn.splice(0, count);
            }
            if (this.undoStack.length < this.undoLimit) {
                this.undoStackIn.push(baseHistoryInfo);
            }
        }
    }
    /**
     * update EditorHistory
     * @private
     */
    public updateHistory(): void {
        if (this.viewer.owner.enableHistoryMode && !isNullOrUndefined(this.currentBaseHistoryInfo)) {
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
     */
    public isHandledComplexHistory(): boolean {
        let isHandledComplexHistory: boolean = false;
        if (!(this.isUndoing || this.isRedoing)) {
            isHandledComplexHistory = this.owner.editorModule.insertRemoveBookMarkElements();
        }
        if (this.viewer.owner.enableHistoryMode && !isNullOrUndefined(this.currentHistoryInfo)) {
            this.updateHistory();
            isHandledComplexHistory = true;
        } else if (this.owner.editorModule.isHandledComplex) {
            isHandledComplexHistory = true;
        }
        return isHandledComplexHistory;
    }

    /**
     * Update complex history 
     * @private
     */
    public updateComplexHistory(): void {
        let selection: Selection = this.viewer.selection;
        if (this.currentHistoryInfo.hasAction) {
            if (this.currentHistoryInfo.action === 'AutoFormatHyperlink') {
                let startPosition: TextPosition = new TextPosition(selection.owner);
                this.owner.editorModule.setPositionForCurrentIndex(startPosition, this.currentHistoryInfo.insertPosition);
                // this.reLayoutParagraph(startPosition.paragraph, 0);
                if (selection.owner.editorHistory.isUndoing) {
                    this.owner.editorModule.setPositionForCurrentIndex(selection.start, this.currentHistoryInfo.selectionStart);
                    this.owner.editorModule.setPositionForCurrentIndex(selection.end, this.currentHistoryInfo.selectionEnd);
                } else {
                    this.owner.editorModule.setPositionForCurrentIndex(selection.start, this.currentHistoryInfo.endPosition);
                    this.owner.editorModule.setPositionForCurrentIndex(selection.end, this.currentHistoryInfo.endPosition);
                }
            }
            if (this.currentHistoryInfo.action === 'InsertHyperlink') {
                let startPosition: TextPosition = new TextPosition(selection.owner);
                this.owner.editorModule.setPositionForCurrentIndex(startPosition, this.currentHistoryInfo.insertPosition);
                let endPosition: TextPosition = new TextPosition(selection.owner);
                this.owner.editorModule.setPositionForCurrentIndex(endPosition, this.currentHistoryInfo.endPosition);
                this.viewer.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
                if (endPosition.paragraph !== startPosition.paragraph) {
                    this.viewer.layout.reLayoutParagraph(endPosition.paragraph, 0, 0);
                }
            }
            if (this.currentHistoryInfo.action === 'ReplaceAll') {
                this.owner.editorModule.layoutWholeDocument();
            } else if (selection.owner.isShiftingEnabled) {
                this.viewer.layout.shiftLayoutedItems();
                if (this.owner.enableHeaderAndFooter) {
                    this.owner.editorModule.updateHeaderFooterWidget();
                }
                this.viewer.removeEmptyPages();
            }
        }
        selection.owner.isShiftingEnabled = false;
        selection.owner.isLayoutEnabled = true;
        // // selection.addMultipleSelectionRanges();

        selection.start.updatePhysicalPosition(true);
        if (selection.isEmpty) {
            selection.end.setPositionInternal(selection.start);
        } else {
            selection.end.updatePhysicalPosition(true);
        }
        selection.upDownSelectionLength = selection.end.location.x;
        this.viewer.updateScrollBars();
        selection.fireSelectionChanged(true);
        this.viewer.updateFocus();
        this.updateComplexHistoryInternal();
        this.owner.editorModule.fireContentChange();
    }
    /**
     * @private
     */
    public updateComplexHistoryInternal(): void {
        if (!isNullOrUndefined(this.currentHistoryInfo)) {
            //Updates the current end position
            if (isNullOrUndefined(this.currentHistoryInfo.endPosition)) {
                this.currentHistoryInfo.endPosition = this.currentHistoryInfo.insertPosition;
            }
            if (this.historyInfoStack.length > 1) {
                let historyInfo: HistoryInfo = this.historyInfoStack[this.historyInfoStack.length - 2];
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
     * @param  {Selection} selection
     * @param  {WAbstractList} currentAbstractList
     * @param  {WList} list
     * @private
     */
    public updateListChangesInHistory(currentAbstractList: WAbstractList, list: WList): Dictionary<number, ModifiedLevel> {
        this.currentBaseHistoryInfo = new BaseHistoryInfo(this.viewer.owner);
        this.currentBaseHistoryInfo.action = 'List';
        this.currentBaseHistoryInfo.updateSelection();
        let collection: Dictionary<number, ModifiedLevel> = new Dictionary<number, ModifiedLevel>();
        for (let i: number = 0; i < currentAbstractList.levels.length; i++) {
            let levels: WListLevel = this.viewer.getAbstractListById(list.abstractListId).levels[i];
            let value: Object = this.currentBaseHistoryInfo.addModifiedPropertiesForList(levels);
            let modifiedLevel: ModifiedLevel = new ModifiedLevel(levels, currentAbstractList.levels[i]);
            if (!isNullOrUndefined(levels)) {
                this.viewer.owner.editorModule.copyListLevel(levels, (currentAbstractList.levels[i] as WListLevel));
            }
            collection.add(i, modifiedLevel);
        }
        return collection;
    }
    /**
     * Apply list changes 
     * @param  {Selection} selection
     * @param  {Dictionary<number, ModifiedLevel>} modifiedLevelsInternal
     * @private
     */
    public applyListChanges(selection: Selection, modifiedLevelsInternal: Dictionary<number, ModifiedLevel>): void {
        if (isNullOrUndefined(this.modifiedParaFormats)) {
            this.modifiedParaFormats = new Dictionary<BaseHistoryInfo, ModifiedParagraphFormat[]>();
        }
        let collection: ModifiedParagraphFormat[] = [];
        for (let i: number = 0; i < this.viewer.listParagraphs.length; i++) {
            let paragraph: ParagraphWidget = this.viewer.listParagraphs[i];
            let paraFormat: WParagraphFormat = paragraph.paragraphFormat;
            let currentList: WList = this.viewer.getListById(paraFormat.listFormat.listId);
            let listLevel: WListLevel = this.viewer.layout.getListLevel(currentList, paraFormat.listFormat.listLevelNumber);
            // tslint:disable-next-line:max-line-length
            if (modifiedLevelsInternal.containsKey(paraFormat.listFormat.listLevelNumber)
                && modifiedLevelsInternal.get(paraFormat.listFormat.listLevelNumber).ownerListLevel === listLevel) {
                let modifiedFormat: WParagraphFormat = new WParagraphFormat(null);
                modifiedFormat.leftIndent = paraFormat.leftIndent;
                modifiedFormat.firstLineIndent = paraFormat.firstLineIndent;
                let modified: ModifiedParagraphFormat = new ModifiedParagraphFormat(paraFormat, modifiedFormat);
                collection.push(modified);
                this.owner.editorModule.copyFromListLevelParagraphFormat(paraFormat, listLevel.paragraphFormat);
            }
        }
        this.modifiedParaFormats.add(this.currentBaseHistoryInfo, collection);
    }
    /**
     * Update list changes
     * @param  {Dictionary<number, ModifiedLevel>} modifiedCollection
     * @param  {Selection} selection
     * @private
     */
    public updateListChanges(modifiedCollection: Dictionary<number, ModifiedLevel>): void {
        this.viewer.owner.isLayoutEnabled = false;
        this.owner.editorModule.updateListParagraphs();
        for (let i: number = 0; i < modifiedCollection.keys.length; i++) {
            let levelNumber: number = modifiedCollection.keys[0];
            let modifiedLevel: ModifiedLevel = modifiedCollection.get(levelNumber);
            if (!isNullOrUndefined(this.currentBaseHistoryInfo)) {
                // tslint:disable-next-line:max-line-length
                modifiedLevel = this.currentBaseHistoryInfo.addModifiedPropertiesForList(modifiedLevel.ownerListLevel) as ModifiedLevel;
            }
            this.owner.editorModule.copyListLevel(modifiedLevel.ownerListLevel, modifiedLevel.modifiedListLevel);
        }
        this.revertListChanges();
        this.viewer.owner.isLayoutEnabled = true;
        this.viewer.renderedLists.clear();
        this.viewer.pages = [];
        this.viewer.layout.layout();
        let selection: Selection = this.viewer.selection;
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
     * Revert list changes
     * @param  {Selection} selection
     */
    private revertListChanges(): void {
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.currentBaseHistoryInfo)
            && this.viewer.owner.editorHistory.modifiedParaFormats.containsKey(this.currentBaseHistoryInfo)) {
            // tslint:disable-next-line:max-line-length
            let collection: ModifiedParagraphFormat[] = this.modifiedParaFormats.get(this.currentBaseHistoryInfo);
            for (let i: number = 0; i < collection.length; i++) {
                let modified: WParagraphFormat = new WParagraphFormat(null);
                modified.leftIndent = collection[i].ownerFormat.leftIndent;
                modified.firstLineIndent = collection[i].ownerFormat.firstLineIndent;
                collection[i].ownerFormat.copyFormat(collection[i].modifiedFormat);
                collection[i].modifiedFormat.leftIndent = modified.leftIndent;
                collection[i].modifiedFormat.firstLineIndent = modified.firstLineIndent;
            }
        }
    }
    /**
     * Reverts the last editing action.
     */
    public undo(): void {
        if (this.owner.isReadOnlyMode || !this.canUndo() || !this.owner.enableHistoryMode) {
            return;
        }
        //this.owner.ClearTextSearchResults();

        let historyInfo: BaseHistoryInfo = this.undoStack.pop();
        this.isUndoing = true;
        historyInfo.revert();
        this.isUndoing = false;
        this.owner.selection.checkForCursorVisibility();
        this.owner.editorModule.isBordersAndShadingDialog = false;
    }
    /**
     * Performs the last reverted action.
     */
    public redo(): void {
        if (this.owner.isReadOnlyMode || !this.canRedo() || !this.owner.enableHistoryMode) {
            return;
        }
        //this.owner.ClearTextSearchResults();
        let historyInfo: BaseHistoryInfo = this.redoStack.pop();
        if (historyInfo.action === 'BordersAndShading') {
            this.owner.editorModule.isBordersAndShadingDialog = true;
        }
        this.isRedoing = true;
        historyInfo.revert();
        this.isRedoing = false;
        this.owner.selection.checkForCursorVisibility();
        this.owner.editorModule.isBordersAndShadingDialog = false;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.clearHistory();
        this.undoStackIn = undefined;
        this.redoStackIn = undefined;
    }
    private clearHistory(): void {
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