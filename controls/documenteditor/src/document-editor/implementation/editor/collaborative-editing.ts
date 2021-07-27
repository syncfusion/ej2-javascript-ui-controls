import { DocumentEditor } from '../../document-editor';
import {
    EditRangeStartElementBox, EditRangeEndElementBox, BlockWidget, BodyWidget, TableWidget,
    TableRowWidget, ParagraphWidget, Widget, LineWidget, ElementBox, CommentElementBox, Page, TableCellWidget
} from '../viewer/page';
import { TextPosition } from '../selection/selection-helper';
import { Selection } from '../selection/index';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { WSectionFormat } from '../format/section-format';
import { XmlHttpRequestHandler, actionCompleteEvent } from '../../base/index';
import { ElementInfo, PositionInfo, ParagraphInfo, LockSelectionInfo, CollaborativeEditingEventArgs } from './editor-helper';
import { HistoryInfo, BaseHistoryInfo } from '../editor-history/index';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { DocumentHelper } from '../viewer';
import { CollaborativeEditingSettingsModel } from '../../document-editor-model';
import { showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Dictionary } from '../../base';
import { Revision } from '../track-changes/index';
import { WCharacterFormat, WRowFormat } from '../format/index';

/**
 * Collaborative editing module
 */
export class CollaborativeEditing {
    private owner: DocumentEditor;
    private version: number = 0;
    private lockStart: string[];
    private saveTimer: number;

    //private lockEnd: string = '';
    private get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }
    private get selection(): Selection {
        return this.owner.selection;
    }
    private get collaborativeEditingSettings(): CollaborativeEditingSettingsModel {
        return this.owner.documentEditorSettings.collaborativeEditingSettings;
    }

    public constructor(editor: DocumentEditor) {
        this.owner = editor;
    }
    private getModuleName(): string {
        return 'CollaborativeEditing';
    }
    /**
     * To update the action which need to perform.
     *
     * @param {CollaborativeEditingEventArgs} data - Specifies the data.
     * @returns {void}
     */
    public updateAction(data: CollaborativeEditingEventArgs | CollaborativeEditingEventArgs[]): void {
        if (!Array.isArray(data)) {
            data = [data];
        }
        for (let i: number = 0; i < data.length; i++) {
            const documentData: CollaborativeEditingEventArgs = data[i];
            switch (documentData.action) {
            case 'LockContent':
                // Transform position
                this.transFormLockRegion(documentData);
                this.lockRegion(documentData.selectionInfo.start, documentData.selectionInfo.end, documentData.author);
                break;
            case 'SaveContent':
                this.version = documentData.version;
                this.updateRegion(documentData.author, documentData.data);
                break;
            case 'UnlockContent':
                this.version = documentData.version;
                this.updateRegion(documentData.author, documentData.data);
                this.removeEditRange(documentData.author);
                break;
            }
        }
    }

    private transFormLockRegion(data: CollaborativeEditingEventArgs): void {
        const previousLockInfo: LockSelectionInfo = data.selectionInfo.previousLockInfo;
        if (!isNullOrUndefined(previousLockInfo)) {
            const author: string = previousLockInfo.author;
            let sectionDiff: number = 0;
            let blockDiff: number = 0;
            if (this.documentHelper.editRanges.containsKey(author)) {
                const editRange: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(author);
                if (editRange.length > 0) {
                    const position: PositionInfo = this.selection.getPosition(editRange[0]);
                    const endOffset: string[] = this.selection.getHierarchicalIndexByPosition(position.endPosition).split(';');
                    const previousOffset: string[] = previousLockInfo.end.split(';');
                    sectionDiff = parseInt(endOffset[0], 10) - parseInt(previousOffset[0], 10);
                    blockDiff = parseInt(endOffset[1], 10) - parseInt(previousOffset[1], 10);
                    // Same section
                    if (data.selectionInfo.start.split(';')[0] === previousLockInfo.end.split(';')[0]) {
                        data.selectionInfo.start = this.tranformPosition(data.selectionInfo.start, sectionDiff, blockDiff);
                        data.selectionInfo.end = this.tranformPosition(data.selectionInfo.end, sectionDiff, blockDiff);
                    } else {
                        data.selectionInfo.start = this.tranformPosition(data.selectionInfo.start, sectionDiff, 0);
                        data.selectionInfo.end = this.tranformPosition(data.selectionInfo.end, sectionDiff, 0);
                    }
                }
            }
        }
    }

    /**
     * Lock selected region from editing by other users.
     *
     * @param {string} user - Specifies the user.
     * @returns {void}
     */
    public lockContent(user: string): void {
        if (this.canLock()) {
            let start: TextPosition = this.owner.selection.start;
            let end: TextPosition = this.owner.selection.end;
            if (!this.owner.selection.isForward) {
                start = this.owner.selection.end;
                end = this.owner.selection.start;
            }
            if (start.paragraph.isInsideTable) {
                const table: TableWidget = this.owner.documentHelper.layout.getParentTable(start.paragraph);
                const firstPara: ParagraphWidget = this.owner.selection.getFirstParagraphBlock(table);
                start.setPosition(firstPara.childWidgets[0] as LineWidget, true);
            } else {
                start.paragraphStartInternal(this.owner.selection, false);
            }
            if (end.paragraph.isInsideTable) {
                const table: TableWidget = this.owner.documentHelper.layout.getParentTable(end.paragraph);
                const lastPara: ParagraphWidget = this.owner.selection.getLastParagraphBlock(table);
                const offset: number = (lastPara.lastChild as LineWidget).getEndOffset();
                end.setPositionParagraph((lastPara.lastChild as LineWidget), offset);
            } else {
                end.moveToParagraphEndInternal(this.owner.selection, false);
            }
            const startOffset: string = this.owner.selection.getHierarchicalIndexByPosition(start);
            const endOffset: string = this.owner.selection.getHierarchicalIndexByPosition(end);
            const selectionInfo: LockSelectionInfo = {
                start: startOffset,
                end: endOffset,
                roomName: this.owner.documentEditorSettings.collaborativeEditingSettings.roomName,
                author: isNullOrUndefined(user) ? this.owner.currentUser : user,
                version: this.version
            };
            const startInfo: ParagraphInfo = this.selection.getParagraphInfo(start);
            const endInfo: ParagraphInfo = this.selection.getParagraphInfo(end);
            this.owner.selection.select(startOffset, endOffset);
            const ajax: XmlHttpRequestHandler = new XmlHttpRequestHandler();
            ajax.url = this.owner.serviceUrl + this.owner.serverActionSettings.canLock;
            ajax.contentType = 'application/json;charset=UTF-8';
            ajax.onSuccess = (result: CollaborativeEditingEventArgs) => {
                this.successHandler(result, selectionInfo, startInfo, endInfo);
            };
            ajax.onFailure = this.failureHandler.bind(this);
            ajax.onError = this.failureHandler.bind(this);
            ajax.customHeaders = this.owner.headers;
            ajax.send(selectionInfo);
        }
    }
    /**
     * @private
     * @returns {boolean} - Returns can lock.
     */
    public canLock(): boolean {
        const editRanges: Dictionary<string, EditRangeStartElementBox[]> = this.documentHelper.editRanges;
        if (editRanges.containsKey(this.owner.currentUser)) {
            return false;
        }
        const userNames: string[] = editRanges.keys;
        for (let i: number = 0; i < userNames.length; i++) {
            const range: EditRangeStartElementBox[] = editRanges.get(userNames[i]);
            if (!isNullOrUndefined(range) && range.length > 0) {
                if (this.isSelectionInEditableRange(range[0])) {
                    return false;
                }
            }
        }
        return true;
    }

    private getPreviousLockedRegion(): EditRangeStartElementBox {
        const editRanges: Dictionary<string, EditRangeStartElementBox[]> = this.documentHelper.editRanges;
        if (editRanges.containsKey(this.owner.currentUser)) {
            return undefined;
        }
        let previous: EditRangeStartElementBox;
        const userNames: string[] = editRanges.keys;
        for (let i: number = 0; i < userNames.length; i++) {
            const range: EditRangeStartElementBox = editRanges.get(userNames[i])[0];
            const startPosition: TextPosition = this.selection.getPosition(range).startPosition;
            if (startPosition.isExistBefore(this.selection.start)) {
                if (isNullOrUndefined(previous)) {
                    previous = range;
                } else if (startPosition.isExistAfter(this.selection.getPosition(previous).startPosition)) {
                    previous = range;
                }
            }
        }
        return previous;
    }
    /**
     * @private
     * @param {string} user - Specifies the user.
     * @returns {void}
     */
    public unlockContent(user: string): void {
        if (this.documentHelper.editRanges.containsKey(user)) {
            if (this.saveTimer) {
                clearTimeout(this.saveTimer);
            }
            const sfdtContent: string = JSON.stringify(this.serializeEditableRegion(user));
            const saveObject: CollaborativeEditingEventArgs = {
                action: 'UnlockContent',
                author: user,
                version: this.version,
                data: sfdtContent,
                selectionInfo: {
                    start: '',
                    end: '',
                    roomName: this.collaborativeEditingSettings.roomName,
                    author: this.owner.currentUser,
                    version: this.version
                },
                roomName: this.collaborativeEditingSettings.roomName
            };
            this.removeEditRange(user);
            this.owner.editorHistory.clearHistory();
            this.owner.fireContentChange();
            // Todo: selection tranformation
            this.owner.trigger(actionCompleteEvent, saveObject);
        }
    }
    private removeEditRange(user: string): void {
        if (this.documentHelper.editRanges.containsKey(user)) {
            this.updateLockRegion(user, false);
            this.owner.editor.removeUserRestrictionsInternal(this.documentHelper.editRanges.get(user)[0]);
            this.documentHelper.clearContent();
            this.selection.updateEditRangeCollection();
            this.documentHelper.owner.viewer.updateScrollBars();
        }
    }
    /**
     * Save locked content to other clients.
     *
     * @private
     * @returns {void}
     */
    public saveContent(): void {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
        let timeOut: number = this.collaborativeEditingSettings.saveTimeout;
        if (isNullOrUndefined(timeOut)) {
            timeOut = 3000;
        }
        this.saveTimer = setTimeout(() => {
            this.saveContentInternal();
        }, timeOut);
    }

    private saveContentInternal(): void {
        if (this.documentHelper.editRanges.containsKey(this.owner.currentUser)) {
            const editRangeStart: EditRangeStartElementBox = this.documentHelper.editRanges.get(this.owner.currentUser)[0];
            const position: PositionInfo = this.selection.getPosition(editRangeStart);
            const saveObject: CollaborativeEditingEventArgs = {
                action: 'SaveContent',
                author: this.owner.currentUser,
                version: this.version,
                data: JSON.stringify(this.serializeEditableRegion(this.owner.currentUser)),
                selectionInfo: {
                    'start': this.selection.getHierarchicalIndexByPosition(position.startPosition),
                    'end': this.selection.getHierarchicalIndexByPosition(position.endPosition),
                    roomName: this.collaborativeEditingSettings.roomName,
                    author: this.owner.currentUser,
                    version: this.version
                },
                roomName: this.collaborativeEditingSettings.roomName
            };
            this.owner.trigger(actionCompleteEvent, saveObject);
        }
    }

    private serializeEditableRegion(user: string): string {
        const startElement: EditRangeStartElementBox = this.documentHelper.editRanges.get(user)[0];
        const endElement: EditRangeEndElementBox = startElement.editRangeEnd;

        const start: TextPosition = new TextPosition(this.owner);
        start.setPosition(startElement.line, true);
        const end: TextPosition = new TextPosition(this.owner);
        end.setPosition(endElement.line, false);
        this.owner.sfdtExportModule.isPartialExport = true;
        /* eslint-disable-next-line max-len */
        const sfdtContent: string = this.owner.sfdtExportModule.write(start.currentWidget, start.offset, end.currentWidget, end.offset, false);
        this.owner.sfdtExportModule.isPartialExport = false;
        return sfdtContent;
    }

    /* eslint-disable-next-line max-len */
    private successHandler(result: CollaborativeEditingEventArgs, selectionInfo: LockSelectionInfo, startInfo: ParagraphInfo, endInfo: ParagraphInfo): void {
        const canLock: boolean = JSON.parse(result.data).canLock;
        if (canLock) {
            selectionInfo.start = this.selection.getHierarchicalIndex(startInfo.paragraph, startInfo.offset.toString());
            selectionInfo.end = this.selection.getHierarchicalIndex(endInfo.paragraph, endInfo.offset.toString());
            const previousEditRange: EditRangeStartElementBox = this.getPreviousLockedRegion();
            if (previousEditRange) {
                const position: PositionInfo = this.selection.getPosition(previousEditRange);
                selectionInfo.previousLockInfo = {
                    start: this.selection.getHierarchicalIndexByPosition(position.startPosition),
                    end: this.selection.getHierarchicalIndexByPosition(position.endPosition),
                    author: previousEditRange.user,
                    roomName: '',
                    version: 0
                };
            }
            const lockObject: CollaborativeEditingEventArgs = {
                action: 'LockContent',
                selectionInfo: selectionInfo,
                author: this.owner.currentUser,
                version: this.version,
                data: '',
                roomName: this.collaborativeEditingSettings.roomName
            };
            this.owner.trigger(actionCompleteEvent, lockObject);
        } else {
            const localizeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
            localizeValue.setLocale(this.owner.locale);
            DialogUtility.alert({
                content: localizeValue.getConstant('Already locked'),
                closeOnEscape: true, showCloseIcon: true, position: { X: 'Center', Y: 'Center' }
            });
        }
    }
    private failureHandler(): void {
        const localizeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        localizeValue.setLocale(this.owner.locale);
        DialogUtility.alert({
            content: localizeValue.getConstant('Error in establishing connection with web server'),
            closeOnEscape: true, showCloseIcon: true, position: { X: 'Center', Y: 'Center' }
        });
    }
    /**
     * Locker specified region for specified user.
     *
     * @private
     * @param {string} start - Specified the selection start.
     * @param {string} end - Specifies the selection end.
     * @param {string} user - Specifies the user
     * @returns {void}
     */
    public lockRegion(start: string, end: string, user: string): void {
        const startPosition: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(start);
        const endPosition: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(end);
        this.lockRegionInternal(startPosition, endPosition, user);
    }
    private lockRegionInternal(start: TextPosition, end: TextPosition, user: string): void {
        const editStart: EditRangeStartElementBox = this.owner.editor.addEditElement(user);
        const editEnd: EditRangeEndElementBox = editStart.editRangeEnd;
        this.insertElements(start, end, [editEnd], [editStart]);
        this.updateLockInfo(editStart.paragraph, editEnd.paragraph, user, true);
        this.owner.viewer.updateScrollBars();
    }

    private insertElements(start: TextPosition, end: TextPosition, endElements: ElementBox[], startElements?: ElementBox[]): void {
        if (!isNullOrUndefined(startElements)) {
            this.insertElementsInternal(start, startElements);
        }
        if (!isNullOrUndefined(endElements)) {
            this.insertElementsInternal(end, endElements);
        }
    }

    private insertElementsInternal(position: TextPosition, elements: ElementBox[]): void {
        let indexInInline: number = 0;
        if (position.paragraph.isEmpty()) {
            const paragraph: ParagraphWidget = position.paragraph as ParagraphWidget;
            (paragraph.childWidgets[0] as LineWidget).children.push(elements[0]);
            elements[0].line = (paragraph.childWidgets[0] as LineWidget);
            this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0);
        } else {
            const inlineObj: ElementInfo = position.currentWidget.getInline(position.offset, indexInInline);
            const curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            const firstElement: ElementBox = elements[0];
            this.insertElementInternal(curInline, firstElement, indexInInline);
            const index: number = firstElement.indexInOwner;
            let lastElement: ElementBox = firstElement;
            for (let i: number = 1; i < elements.length; i++) {
                lastElement = elements[i];
                firstElement.line.children.splice(index + i, 0, lastElement);
            }
        }

    }

    private insertElementInternal(element: ElementBox, newElement: ElementBox, index: number): void {
        const line: LineWidget = element.line;
        const paragraph: ParagraphWidget = line.paragraph;
        let insertIndex: number = element.indexInOwner;
        const isBidi: boolean = paragraph.paragraphFormat.bidi && element.isRightToLeft;
        if (index === element.length) {
            // Add new Element in current
            if (!isBidi) {
                insertIndex++;
            }
            line.children.splice(insertIndex, 0, newElement);
        } else if (index === 0) {
            if (isNullOrUndefined(element.previousNode)) {
                line.children.splice(0, 0, newElement);
                insertIndex = 0;
            } else {
                line.children.splice(insertIndex, 0, newElement);
            }
        }
        newElement.line = element.line;
    }

    //#region Save content



    private setEditableRegion(): void {
        if (this.documentHelper.editRanges.containsKey(this.owner.currentUser)) {
            const editRanges: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(this.owner.currentUser);
            const editRangeStart: EditRangeStartElementBox = editRanges[0];
            const firstBlock: BlockWidget = this.getParentBlock(editRangeStart.paragraph);
            this.lockStart = this.owner.selection.getHierarchicalIndex(firstBlock, '0').split(';');
        }
    }

    private isSelectionInEditableRange(editRange: EditRangeStartElementBox): boolean {
        if (!isNullOrUndefined(this.owner.selection)) {
            let start: TextPosition = this.owner.selection.start;
            let end: TextPosition = this.owner.selection.end;
            if (!this.owner.selection.isForward) {
                [start, end] = [end, start];
            }
            const position: PositionInfo = this.owner.selection.getPosition(editRange);
            if ((start.isExistAfter(position.startPosition) || start.isAtSamePosition(position.startPosition))
                && (end.isExistBefore(position.endPosition) || end.isAtSamePosition(position.endPosition)) ||
                ((position.startPosition.isExistAfter(start) || position.startPosition.isAtSamePosition(start))
                    && (position.endPosition.isExistBefore(end) || position.endPosition.isAtSamePosition(end))) ||
                (position.startPosition.isExistAfter(start) && position.startPosition.isExistBefore(end)
                    && (end.isExistAfter(position.endPosition) || end.isExistBefore(position.endPosition))) ||
                (position.endPosition.isExistBefore(end) && position.endPosition.isExistAfter(start)
                    && (start.isExistBefore(position.startPosition) || start.isExistAfter(position.startPosition)))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Updated modified content from remote user
     *
     * @returns {void}
     */
    /* eslint-disable  */
    public updateRegion(user: string, content: string): void {
        if (this.documentHelper.editRanges.containsKey(user)) {
            let editRanges: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(user);
            if (editRanges.length === 1) {
                // Remove exisiting range  from collection.
                // New range will get inserted while updating the content.
                this.documentHelper.editRanges.remove(user);
                editRanges[0].removeEditRangeMark();
            }
            // Preserve hierachical position for history position tranformation
            this.setEditableRegion();
            let startElement: EditRangeStartElementBox = editRanges[0];
            let endElement: EditRangeEndElementBox = startElement.editRangeEnd;
            let firstBlock: BlockWidget = this.getParentBlock(startElement.paragraph);
            let lastBlock: BlockWidget = this.getParentBlock(endElement.paragraph);
            let isInEditRange: boolean = this.isSelectionInEditableRange(startElement);
            let startParagrahInfo: ParagraphInfo;
            let endParagrahInfo: ParagraphInfo;
            this.owner.editor.isRemoveRevision = true;
            if (!isInEditRange) {
                startParagrahInfo = this.owner.selection.getParagraphInfo(this.owner.selection.start);
                endParagrahInfo = this.owner.selection.getParagraphInfo(this.owner.selection.end);
            }
            let sections: BodyWidget[] = [];
            while (lastBlock !== firstBlock) {
                let currentBlock: BlockWidget = lastBlock.combineWidget(this.owner.viewer) as BlockWidget;
                lastBlock = currentBlock.previousRenderedWidget as BlockWidget;
                if (lastBlock.bodyWidget.index !== currentBlock.bodyWidget.index) {
                    sections.push(currentBlock.bodyWidget);
                }
                let removedBlock: BlockWidget = currentBlock.containerWidget.childWidgets[currentBlock.indexInOwner] as BlockWidget;
                this.removeDuplicateCollection(removedBlock);
                currentBlock.containerWidget.removeChild(currentBlock.indexInOwner);
            }
            if (!isNullOrUndefined(firstBlock)) {
                let lastBockIndex: number = firstBlock.index;
                let containerWidget: BodyWidget = firstBlock.containerWidget as BodyWidget;
                sections.push(containerWidget);
                let lastInsertIndex: number = firstBlock.containerWidget.childWidgets.indexOf(firstBlock);
                let removedBlock: BlockWidget = containerWidget.childWidgets[lastInsertIndex] as BlockWidget;
                containerWidget.removeChild(lastInsertIndex);
                this.removeDuplicateCollection(removedBlock);
                let comments: CommentElementBox[] = [];
                let blocks: BodyWidget[] = [];
                let revision: Revision[] = [];
                this.owner.editor.isPasteListUpdated = false;
                this.owner.editor.getBlocks(JSON.parse(content), false, blocks, comments, revision);
                if (sections.length !== blocks.length) {
                    if (sections.length === 1) {
                        let bodyWidget: BodyWidget = sections[0];
                        sections.unshift(this.owner.editor.splitBodyWidget(bodyWidget, blocks[blocks.length - 2].sectionFormat, bodyWidget.childWidgets[lastInsertIndex - 1] as BlockWidget));
                    }
                    if (sections.length < blocks.length) {
                        for (let m: number = 1; m < blocks.length - 1; m++) {
                            let page: Page = new Page(this.owner.documentHelper);
                            let bodyWidget: BodyWidget = new BodyWidget();
                            page.bodyWidgets.push(bodyWidget);
                            bodyWidget.page = page;
                            sections.splice(m, 0, bodyWidget);
                            bodyWidget.index = sections[m - 1].index;
                            bodyWidget.sectionFormat = new WSectionFormat(bodyWidget);
                            bodyWidget.sectionFormat.copyFormat(blocks[m].sectionFormat);
                            let pageIndex: number = sections[m - 1].page.index;
                            this.documentHelper.insertPage(pageIndex, page);
                            //Todo: update section index
                            this.owner.editor.updateSectionIndex(sections[m - 1].sectionFormat, sections[m - 1], true);
                            if (sections.length === blocks.length) {
                                break;
                            }
                        }
                    }
                }
                for (let z: number = 0; z < sections.length; z++) {
                    let containerWidget: BodyWidget = sections[z];
                    let blockIndex: number = 0;
                    let insertIndex: number = 0;
                    if (z === sections.length - 1) {
                        blockIndex = lastBockIndex;
                        insertIndex = lastInsertIndex;
                    }
                    let block: BlockWidget[] = blocks[z].childWidgets as BlockWidget[];
                    for (let i: number = 0; i < block.length; i++) {
                        block[i].containerWidget = containerWidget;
                        block[i].index = blockIndex;
                        containerWidget.childWidgets.splice(insertIndex, 0, block[i]);
                        insertIndex++;
                        blockIndex++;
                    }
                    lastBlock = block[block.length - 1];
                    if (lastBlock.nextRenderedWidget && lastBlock.nextRenderedWidget.index !== lastBlock.index) {
                        //Todo: update block index properly
                        this.updateNextBlocksIndex(lastBlock, true);
                    }
                    this.documentHelper.layout.layoutBodyWidgetCollection(block[0].index, containerWidget, undefined, false);
                }

                for (let k: number = 0; k < comments.length; k++) {
                    let comment: CommentElementBox = comments[k];
                    this.owner.editor.addCommentWidget(comment, false, this.owner.showComments, false);
                    if (comment.replyComments.length > 0) {
                        for (let z: number = 0; z < comment.replyComments.length; z++) {
                            this.owner.commentReviewPane.addReply(comment.replyComments[z], false, false);
                        }
                    }
                }
                if (revision.length > 0) {
                    this.updateRevisionCollection(revision);
                }
                this.owner.trackChangesPane.updateTrackChanges();
                let editRanges: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(user);
                // update content
                if (!isInEditRange) {
                    this.tranformSelection(startParagrahInfo, endParagrahInfo);
                } else {
                    if (editRanges.length > 0) {
                        let positionInfo: PositionInfo = this.selection.getPosition(editRanges[0]);
                        // We can't able to predic the modified content inside editable region
                        // So, it not possible to transform the position relativly.
                        // So, move the selection to editable region end.
                        this.selection.selectPosition(positionInfo.endPosition, positionInfo.endPosition);
                    }
                }
                this.tranformHistoryPosition();
                this.selection.updateEditRangeCollection();
                this.updateLockRegion(user);
                this.documentHelper.removeEmptyPages();
                this.owner.viewer.updateScrollBars();
                this.owner.editor.isRemoveRevision = false;
            }
        }
    }
    private updateRevisionCollection(revision: Revision[]): void {
        let insertIndex: number = 0;
        let revisionStart: TextPosition = this.getRevisionTextPosition(revision[0]);
        let isInsert: boolean = false;
        if (this.owner.revisionsInternal.changes.length > 0 &&
            !isNullOrUndefined(revisionStart)) {
            for (let i: number = 0; i < this.owner.revisionsInternal.changes.length; i++) {
                let textPosition: TextPosition = this.getRevisionTextPosition(this.owner.revisionsInternal.changes[i]);
                if (textPosition.isExistAfter(revisionStart)) {
                    insertIndex = i;
                    isInsert = true;
                    break;
                }
            }
        }
        for (let j: number = 0; j < revision.length; j++) {
            if (isInsert) {
                this.owner.revisionsInternal.changes.splice(insertIndex, 0, revision[j]);
                insertIndex++;
            } else {
                this.owner.revisionsInternal.changes.push(revision[j]);
            }
        }
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private getRevisionTextPosition(revision: Revision): TextPosition {
        if (revision.range.length > 0) {
            let range: any = revision.range[0];
            if (range instanceof ElementBox) {
                return this.selection.getElementPosition(range as ElementBox).startPosition;
            } else if (range instanceof WRowFormat) {
                let block: BlockWidget = (range.ownerBase.firstChild as TableCellWidget).firstChild as BlockWidget;
                if (block.bodyWidget) {
                    return this.selection.getTextPosBasedOnLogicalIndex(this.selection.getHierarchicalIndex(block, '0'));
                }
            } else if (range instanceof WCharacterFormat) {
                let paraWidget: ParagraphWidget = (range as WCharacterFormat).ownerBase as ParagraphWidget;
                if ((paraWidget.lastChild as LineWidget).paragraph.bodyWidget) {
                    let offset: number = paraWidget.getLength();
                    let startPosition: TextPosition = new TextPosition(this.owner);
                    startPosition.setPositionParagraph(paraWidget.lastChild as LineWidget, offset);
                    return startPosition;
                }
            }
        }
        return undefined;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private tranformSelection(startParagrahInfo: ParagraphInfo, endParagraphInfo: ParagraphInfo): void {
        this.documentHelper.skipScrollToPosition = true;
        let startIndex: string = this.selection.getHierarchicalIndex(startParagrahInfo.paragraph, startParagrahInfo.offset.toString());
        let endIndex: string = this.selection.getHierarchicalIndex(endParagraphInfo.paragraph, endParagraphInfo.offset.toString());
        this.selection.select(startIndex, endIndex);
    }
    private tranformHistoryPosition(): void {
        if (this.documentHelper.editRanges.containsKey(this.owner.currentUser)) {
            let editRanges: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(this.owner.currentUser);
            let startElement: EditRangeStartElementBox = editRanges[0];
            let startBlock: BlockWidget = this.getParentBlock(startElement.paragraph);
            let startOffset: string[] = this.selection.getHierarchicalIndex(startBlock, '0').split(';');
            if (!isNullOrUndefined(this.lockStart) && this.lockStart.length > 1) {
                let sectionDiff: number = parseInt(startOffset[0], 10) - parseInt(this.lockStart[0], 10);
                let blockDiff: number = parseInt(startOffset[1], 10) - parseInt(this.lockStart[1], 10);
                this.transformHistory(sectionDiff, blockDiff);
            }
        }
    }

    private transformHistory(sectionDiff: number, blockDiff: number): void {
        if (this.owner.enableEditorHistory) {
            let undoStack: BaseHistoryInfo[] = this.owner.editorHistory.undoStack;
            if (!isNullOrUndefined(undoStack)) {
                for (let i: number = 0; i < undoStack.length; i++) {
                    this.transformBaseHistoryInfo(undoStack[i], sectionDiff, blockDiff);
                }
            }
            let redoStack: BaseHistoryInfo[] = this.owner.editorHistory.redoStack;
            if (!isNullOrUndefined(redoStack)) {
                for (let i: number = 0; i < redoStack.length; i++) {
                    this.transformBaseHistoryInfo(redoStack[i], sectionDiff, blockDiff);
                }
            }
        }
    }

    private transformBaseHistoryInfo(baseHistoryInfo: BaseHistoryInfo, sectionDiff: number, blockDiff: number): void {
        if (baseHistoryInfo.endPosition) {
            baseHistoryInfo.endPosition = this.tranformPosition(baseHistoryInfo.endPosition, sectionDiff, blockDiff);
        }
        if (baseHistoryInfo.insertPosition) {
            baseHistoryInfo.insertPosition = this.tranformPosition(baseHistoryInfo.insertPosition, sectionDiff, blockDiff);
        }
        if (baseHistoryInfo.selectionStart) {
            baseHistoryInfo.selectionStart = this.tranformPosition(baseHistoryInfo.selectionStart, sectionDiff, blockDiff);
        }
        if (baseHistoryInfo.selectionEnd) {
            baseHistoryInfo.selectionEnd = this.tranformPosition(baseHistoryInfo.selectionEnd, sectionDiff, blockDiff);
        }
        if (baseHistoryInfo instanceof HistoryInfo) {
            let modifiedActions: BaseHistoryInfo[] = baseHistoryInfo.modifiedActions;
            for (let j: number = 0; j < modifiedActions.length; j++) {
                this.transformBaseHistoryInfo(modifiedActions[j], sectionDiff, blockDiff);
            }
        }
    }

    private tranformPosition(position: string, sectionDiff: number, blockDiff: number): string {
        let index: string[] = position.split(';');
        index[0] = (parseInt(index[0], 10) + sectionDiff).toString();
        index[1] = (parseInt(index[1], 10) + blockDiff).toString();
        return index.join(';');
    }


    private getParentBlock(block: BlockWidget): BlockWidget {
        if (block.isInsideTable) {
            block = this.owner.documentHelper.layout.getParentTable(block);
        }
        return block.combineWidget(this.owner.viewer) as BlockWidget;
    }

    //#endregion

    //#region Remove existing items in locked region

    private removeDuplicateCollection(removedBlock: BlockWidget): void {
        this.removeFieldInBlock(removedBlock, false, false);
        this.removeFieldInBlock(removedBlock, true, false);
        this.removeFieldInBlock(removedBlock, false, true);
        if (removedBlock instanceof TableWidget) {
            for (let i: number = 0; i < removedBlock.childWidgets.length; i++) {
                if (removedBlock.childWidgets[i] instanceof TableRowWidget) {
                    let tableDelete: TableRowWidget = removedBlock.childWidgets[i] as TableRowWidget;
                    this.owner.editor.removeDeletedCellRevision(tableDelete);
                }
            }
        } else {
            this.owner.editor.removeRevisionForBlock(removedBlock as ParagraphWidget, undefined, false, false);
        }
    }

    private removeFieldInBlock(block: BlockWidget, isBookmark?: boolean, contentControl?: boolean): void {
        if (block instanceof TableWidget) {
            this.removeFieldTable(block, isBookmark, contentControl);
        } else {
            this.owner.editor.removeField(block as ParagraphWidget, isBookmark, contentControl);
            this.removeComment(block as ParagraphWidget);
        }
    }

    private removeFieldTable(table: TableWidget, isBookmark?: boolean, contentControl?: boolean): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                let widget: Widget = rowWidget.childWidgets[j] as Widget;
                for (let i: number = 0; i < widget.childWidgets.length; i++) {
                    this.removeFieldInBlock(widget.childWidgets[i] as BlockWidget, isBookmark, contentControl);
                }
            }
        }
    }

    private removeComment(block: ParagraphWidget): void {
        if (this.documentHelper.comments.length > 0) {
            for (let i: number = 0; i < this.documentHelper.comments.length; i++) {
                let comment: CommentElementBox = this.documentHelper.comments[i];
                if (comment.commentStart.line.paragraph === block) {
                    this.documentHelper.comments.splice(i, 1);
                    this.owner.commentReviewPane.deleteComment(comment);
                    i--;
                }
            }
        }
    }
    //#endregion

    private updateNextBlocksIndex(block: BlockWidget, increaseIndex: boolean): void {
        let nextBlock: BlockWidget = block.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        let incrementCount: number = 1;
        if (nextBlock.bodyWidget.index === block.bodyWidget.index) {
            incrementCount = block.index - nextBlock.index + 1;
        }
        let nextIndex: number = block.containerWidget.childWidgets.indexOf(block) + 1;
        if (block.containerWidget instanceof BodyWidget) {
            let sectionIndex: number = (block.containerWidget as BodyWidget).index;
            let pageIndex: number = this.documentHelper.pages.indexOf(block.containerWidget.page);
            for (let j: number = pageIndex; j < this.documentHelper.pages.length; j++) {
                let page: Page = this.documentHelper.pages[j];
                if (page.bodyWidgets[0].index === sectionIndex) {
                    for (let k: number = nextIndex; k < page.bodyWidgets[0].childWidgets.length; k++) {
                        let childWidget: BlockWidget = page.bodyWidgets[0].childWidgets[k] as BlockWidget;
                        childWidget.index += incrementCount;
                    }
                    nextIndex = 0;
                } else {
                    return;
                }
            }
        }
    }
    /**
     * Update locked region highlight. 
     *
     * @private
     * @param {string} user - Specified the user.
     * @param {boolean} isLocked - Specifies the isLocked.
     * @returns {void} 
     */
    public updateLockRegion(user?: string, isLocked?: boolean): void {
        if (isNullOrUndefined(user)) {
            user = this.owner.currentUser;
        }
        isLocked = isNullOrUndefined(isLocked) ? true : isLocked;
        if (this.documentHelper.editRanges.containsKey(user)) {
            let editRanges: EditRangeStartElementBox[] = this.documentHelper.editRanges.get(user);
            if (editRanges.length === 1 && !isNullOrUndefined(editRanges[0].editRangeEnd)) {
                let editStart: EditRangeStartElementBox = editRanges[0];
                this.updateLockInfo(editStart.paragraph, editStart.editRangeEnd.paragraph, user, isLocked);
            }
        }
    }

    private updateLockInfo(startBlock: BlockWidget, endBlock: BlockWidget, user: string, locked: boolean): void {
        if (startBlock.isInsideTable) {
            startBlock = this.documentHelper.layout.getParentTable(startBlock);
        }
        if (endBlock.isInsideTable) {
            endBlock = this.documentHelper.layout.getParentTable(endBlock);
        }
        do {
            if (locked) {
                startBlock.lockedBy = user;
                startBlock.locked = locked;
            } else {
                startBlock.lockedBy = undefined;
                startBlock.locked = locked;
            }
            if (startBlock === endBlock) {
                break;
            }
            startBlock = startBlock.nextRenderedWidget as BlockWidget;
            if (isNullOrUndefined(startBlock)) {
                break;
            }
        } while (startBlock);
    }
    /**
     * Pull pending actions from server.
     *
     * @returns {void} 
     */
    public pullAction(): void {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (this.owner) {
            let ajax: XmlHttpRequestHandler = new XmlHttpRequestHandler();
            ajax.url = this.owner.serviceUrl + this.owner.serverActionSettings.getPendingActions;
            ajax.contentType = 'application/json;charset=UTF-8';
            ajax.onSuccess = (result: any) => {
                this.updateAction(JSON.parse(result.data));
                hideSpinner(this.owner.element);
            };
            ajax.onFailure = this.failureHandler.bind(this);
            ajax.onError = this.failureHandler.bind(this);
            ajax.customHeaders = this.owner.headers;
            showSpinner(this.owner.element);
            ajax.send(({ 'roomName': this.collaborativeEditingSettings.roomName, version: this.version }));
        }
    }

    /* eslint-enable @typescript-eslint/no-explicit-any */
    /**
     * Destroy collaborative editing module.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.owner = undefined;
    }

}