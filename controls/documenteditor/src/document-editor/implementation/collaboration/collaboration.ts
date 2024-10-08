/* eslint-disable */
import { DocumentEditor, Selection, TextPosition, Point, Page, CaretHeightInfo, ParagraphInfo, HelperMethods, Operation, ParagraphWidget, BlockWidget, TableWidget, TableRowWidget, TableCellWidget, ImageInfo, AbsolutePositionInfo, AbsoluteParagraphInfo, CONTROL_CHARACTERS, SectionBreakType, ElementBox, BookmarkElementBox, LineWidget, ListTextElementBox, ShapeElementBox, FootnoteElementBox, EditRangeStartElementBox, CommentElementBox, CommentCharacterElementBox, CommentView, MarkerInfo, FieldElementBox, FormField, FormFieldType, WCharacterFormat, ElementInfo, ImageElementBox, WParagraphFormat, WParagraphStyle, WCharacterStyle, WTableFormat, WRowFormat, WCellFormat, AutoFitType, WSectionFormat, HeaderFooterWidget, HeaderFooterType, Revision, WList, WAbstractList, listIdProperty, WStyle, WStyles, abstractListsProperty, listsProperty, abstractListIdProperty, nsidProperty, ProtectionType } from '../../index'
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base'

/**
 * Module to handle collaborative editing.
 */
export class CollaborativeEditingHandler {
    //TODO need to prevent document change on collaborative editing session i.e. New document, select new document
    //#region SignalR collabrative editing
    private version: number = 0;
    private documentEditor: DocumentEditor;
    private roomName: string;
    private userMap: UserPositionInfo = {};
    private connectionId: string = '';
    private acknowledgmentPending: Operation[];
    private pendingOps: Operation[][] = [];
    private commentsStart: CommentCharacterElementBox[] = [];
    private commentsEnd: CommentCharacterElementBox[] = [];
    private deletedComments: CommentElementBox[] = [];
    private serviceUrl = '';;
    private isSyncServerChanges: boolean = false;
    private logEventEnabled: boolean = true;
    private message: string = '';
    private rowWidget: TableRowWidget;
    private table: TableWidget;

    constructor(documentEditor: DocumentEditor) {
        this.documentEditor = documentEditor;
    }

    /**
     * Get module name.
     * @returns - Returns the module name
     */
    public getModuleName(): string {
        return 'CollaborativeEditingHandler';
    }

    /**
     * This function updates the room information and server url of the collaborative editing session.
     * @param roomName - Specifies the current collaborative editing room name.
     * @param version - Specifies the current version of the document.
     * @param serviceUrl - Specifies the base url of the collaborative editing service.
     */
    public updateRoomInfo(roomName: string, version: number, serviceUrl: string): void {
        this.roomName = roomName;
        this.serviceUrl = serviceUrl;
        this.version = version;
    }
    /**
     * Send the current action to the server.
     * @param args - Specified the current action.
     * @returns 
     */
    public sendActionToServer(operations: Operation[]): void {
        if (!isNullOrUndefined(operations) && operations.length === 0) {
            return;
        }
        const lastPendingOp = this.pendingOps[this.pendingOps.length - 1];
        if (!lastPendingOp || !this.checkAndCombineOperation(lastPendingOp, operations)) {
            this.pendingOps.push(operations);
        }
        if (!this.isAcknowledgePending()) {
            this.sendLocalOperation()
        }
        this.transformRemoteCursor(this.connectionId, operations[0], (operations[0] as Operation).offset);
    }

    private checkAndCombineOperation(lastAction: Operation[], currentAction: Operation[]) {
        if (lastAction.length !== 1 || currentAction.length !== 1) {
            return false;
        }

        let lastOperation: Operation = lastAction[0];
        let currentOperation: Operation = currentAction[0];

        if (this.isSameOperation(lastOperation, currentOperation) && this.canCombineOperation(lastOperation, currentOperation)) {
            if ((lastOperation.action === 'Insert' && lastOperation.offset + lastOperation.length === currentOperation.offset) ||
                (lastOperation.action === 'Delete' && (lastOperation.offset === currentOperation.offset))) {
                lastOperation.length += currentOperation.length;
                lastOperation.text += currentOperation.text;
                return true;
            } else if (lastOperation.action === 'Delete' && currentOperation.offset + currentOperation.length === lastOperation.offset) {
                lastOperation.text = currentOperation.text + lastOperation.text;
                lastOperation.offset = currentOperation.offset;
                lastOperation.length += currentOperation.length;
                return true;
            }
        }
        return false;
    }

    private canCombineOperation(lastOperation: Operation, currentOperation: Operation): boolean {
        return lastOperation.format === currentOperation.format &&
            !this.isControlCharacter(lastOperation.text) &&
            !this.isControlCharacter(currentOperation.text) &&
            isNullOrUndefined(lastOperation.markerData) &&
            isNullOrUndefined(currentOperation.markerData);
    }

    private isSameOperation(lastOperation: Operation, currentOperation: Operation): boolean {
        return lastOperation.action === currentOperation.action;
    }

    private isControlCharacter(text: string): boolean {
        const controlCharacters = [
            CONTROL_CHARACTERS.Table,
            CONTROL_CHARACTERS.Row,
            CONTROL_CHARACTERS.Cell,
            CONTROL_CHARACTERS.Image,
            CONTROL_CHARACTERS.PageBreak,
            CONTROL_CHARACTERS.ColumnBreak,
            CONTROL_CHARACTERS.Section_Break,
            CONTROL_CHARACTERS.Table,
            CONTROL_CHARACTERS.Field_Separator,
            CONTROL_CHARACTERS.Marker_Start,
            CONTROL_CHARACTERS.Marker_End,
            CONTROL_CHARACTERS.Tab,
            CONTROL_CHARACTERS.LineBreak
        ];

        return controlCharacters.indexOf(text) !== -1;
    }
    /**
     * Apply the remote operation to the current document.
     * @param action - Specifies the remote action type.
     * @param data - Specifies the remote operation data.
     */
    public applyRemoteAction(action: string, data: string | ActionInfo): void {
        switch (action) {
            case 'connectionId':
                this.connectionId = data as string;
                break;
            case 'removeUser':
                this.removeCarets(data as string);
                break;
            case 'action':
                this.dataReceived(data as ActionInfo);
                break;
        }
    }


    private isAcknowledgePending(): boolean {
        return !isNullOrUndefined(this.acknowledgmentPending);
    }

    private handleAcknowledgementReceived(action: ActionInfo): void {
        let versionDiff = this.getVersionDifference(action);
        if (versionDiff > 1) {
            this.checkAndRetriveChangesFromServer();
        } else {
            this.logMessage('Ack received: ' + action.version);
            this.logMessage('Ack version diff: ' + versionDiff);
            if (action.version > this.version) {
                this.updateVersion(action.version);
                this.acknowledgementReceived();
                this.sendLocalOperation();
            }
        }
    }
    private updateVersion(version: number): void {
        if (version > this.version) {
            this.version = version;
        }
    }
    private acknowledgementReceived(): void {
        this.acknowledgmentPending = undefined;
    }

    //Send the local operation to server
    private sendLocalOperation(): void {
        if (this.pendingOps.length > 0) {
            let operations = this.pendingOps.shift();
            let changes: ActionInfo = {};
            changes.currentUser = this.documentEditor.currentUser;
            changes.roomName = this.roomName;
            changes.connectionId = this.connectionId;
            changes.version = this.version;
            changes.operations = operations;
            this.acknowledgmentPending = operations;
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('Post', this.serviceUrl + 'UpdateAction', true);
            httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            this.setCustomAjaxHeaders(httpRequest);
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200 || httpRequest.status === 304) {
                        let dataObject = JSON.parse(httpRequest.responseText)
                        if (!this.isSyncServerChanges) {
                            this.handleAcknowledgementReceived(dataObject);
                        }
                    } else {
                        alert('Failed to save the changes');
                    }
                }
            };
            this.logMessage('Sent: ' + JSON.stringify(changes));
            httpRequest.send(JSON.stringify(changes));
        }
    }
    private dataReceived(action: ActionInfo): void {
        if ((action.connectionId === this.connectionId && !this.documentEditor.editor.isIncrementalSave) || this.isSyncServerChanges) {
            this.logMessage(this.isSyncServerChanges ? 'SignalR Server sync' + action.version : 'SignalR Same user sync:' + action.version);
            return
        }
        let versionDiff = this.getVersionDifference(action);
        if (versionDiff <= 0 && !this.documentEditor.editor.isIncrementalSave) {
            this.logMessage('SignalR return diff:<=0' + action.version);
            return;
        }
        if (versionDiff > 1 && !this.documentEditor.editor.isIncrementalSave) {
            this.logMessage('SignalR return diff:>=1' + action.version);
            this.checkAndRetriveChangesFromServer();
            return;
        }
        this.logMessage('SignalR ack: ' + action.version);
        // try {
        this.logMessage('Received: ' + JSON.stringify(action));
        this.handleRemoteOperation(action);
        // } catch (e) {
        //     if (e instanceof Error) {
        //         this.logMessage('Error while handling remote operation: ' + e);
        //         this.logMessage('Error while handling remote operation: ' + e.stack);
        //     } else {
        //         this.logMessage('Error while handling remote operation: ' + e);
        //     }
        // }
    }
    private getVersionDifference(action: ActionInfo): number {
        return action.version - this.version;
    }
    private handleRemoteOperation(action: ActionInfo): void {
        //To Prevent the content change event while applying the remote operation
        this.documentEditor.editorModule.isRemoteAction = true;
        //TODO: Need to handle backward selection.
        let localStartOffset = this.documentEditor.selectionModule.getAbsolutePositionFromRelativePosition(this.documentEditor.selectionModule.start);
        let selectionLength = this.documentEditor.selectionModule.getAbsolutePositionFromRelativePosition(this.documentEditor.selectionModule.end) - localStartOffset;
        if (!isNullOrUndefined(this.acknowledgmentPending)) {
            this.logMessage('Acknowledge transform:' + this.acknowledgmentPending[0].text + 'version:' + action.version);
            this.transform([this.acknowledgmentPending], action.operations)
        }
        if (this.pendingOps.length > 0) {
            this.logMessage('Pending transform:' + this.pendingOps.length + 'version:' + action.version);
        }
        this.transform(this.pendingOps, action.operations);
        this.applyRemoteOperation(action, localStartOffset, selectionLength);
        this.updateVersion(action.version);
        this.documentEditor.editorModule.isRemoteAction = false;
        if (this.documentEditor.editorHistoryModule.canUndo()) {
            this.documentEditor.editorHistoryModule.undoStack.length = 0;
        }
        if (this.documentEditor.editorHistoryModule.canRedo()) {
            this.documentEditor.editorHistoryModule.redoStack.length = 0;
        }
    }
    private transform(operation: Operation[], remoteOperation: Operation[]): void {
        for (let i: number = 0; i < remoteOperation.length; i++) {
            let remoteData: Operation = remoteOperation[i];
            if (operation.length > 0) {
                for (let j = 0; j < operation.length; j++) {
                    for (let k = 0; k < operation[j].length; k++) {
                        let localOperation: Operation = operation[j][k];
                        this.transformSelectionOperation(localOperation, remoteData);
                        let previousOffset: number = remoteData.offset;
                        this.transformOperation(localOperation, remoteData, remoteOperation);
                        this.logMessage('Transformed offset:' + (remoteData.offset - previousOffset));
                    }
                }
            }
        }
    }
    private skipAction(remoteOperation: Operation[]) {
        for (let i: number = 0; i < remoteOperation.length; i++) {
            var data = remoteOperation[i];
            data.length = 0;
            data.skipOperation = true;
        }
    }
    private applyRemoteOperation(action: ActionInfo, offset: number, selectionLength: number): void {
        let currentUser: string = this.documentEditor.currentUser;
        let currentEditMode: boolean = this.documentEditor.commentReviewPane.commentPane.isEditMode;
        let currenteditorHistory = this.documentEditor.editorHistoryModule.lastOperation;
        let currentTextArea: HTMLTextAreaElement;
        if (!isNullOrUndefined(this.documentEditor.commentReviewPane.commentPane.currentEditingComment)) {
            currentTextArea = this.documentEditor.commentReviewPane.commentPane.currentEditingComment.textArea as HTMLTextAreaElement;
        }
        for (let i: number = 0; i < action.operations.length; i++) {
            let markerData: MarkerInfo = action.operations[i].markerData;
            let tableLength: number = undefined;
            let trackingCurrentValue: boolean = this.documentEditor.enableTrackChanges;
            if (!isNullOrUndefined(markerData) && !isNullOrUndefined(markerData.author)) {
                this.documentEditor.currentUser = markerData.author;
            }
            if (!isNullOrUndefined(markerData) && !isNullOrUndefined(markerData.isSkipTracking) && markerData.isSkipTracking && this.documentEditor.enableTrackChanges) {
                this.documentEditor.skipSettingsOps = true;
                this.documentEditor.enableTrackChanges = false;
            }
            if (action.operations[i].skipOperation || (!isNullOrUndefined(action.operations[i].markerData) && action.operations[i].markerData.skipOperation)) {
                continue;
            }
            if (action.operations[i].action === 'Update') {
                if (!isNullOrUndefined(action.operations[i].styleData)) {
                    let styleData = JSON.parse(action.operations[i].styleData);
                    this.documentEditor.editor.updateStyleObject(styleData);
                }
                continue;
            }
            let startOffset = this.getRelativePositionFromAbsolutePosition(action.operations[i].offset, false, false, false);
            // Code for Comparing the offset calculated using old approach and optimized approach
            // this.documentEditor.selection.isNewApproach = true;
            // let newStartOffset = this.getRelativePositionFromAbsolutePosition(action.operations[i].offset, false, false, false);
            // this.documentEditor.selection.isNewApproach = false;
            // throwCustomError(startOffset !== newStartOffset, "New StartIndex " + newStartOffset + " and old StartIndex " + startOffset + " doesnot match");
            let op2 = action.operations[i];
            let endOffset = startOffset;

            if (isNullOrUndefined(action.operations[i].action)) {
                this.documentSettings(action.operations[i]);
                continue;
            }
            if (action.operations[i].action === 'Delete' || action.operations[i].action === 'Format') {
                //Update endOffset
                if (!(op2.action === 'Format' && op2.length === 0)) {
                    this.documentEditor.selectionModule.isEndOffset = true;
                }
                endOffset = this.getRelativePositionFromAbsolutePosition(action.operations[i].offset + action.operations[i].length, false, false, false);
                this.documentEditor.selectionModule.isEndOffset = false;
                // Code for Comparing the offset calculated using old approach and optimized approach
                // this.documentEditor.selection.isNewApproach = true;
                // let newEndOffset = this.getRelativePositionFromAbsolutePosition(action.operations[i].offset + action.operations[i].length, false, false, false);
                // this.documentEditor.selection.isNewApproach = false;
                // throwCustomError(endOffset !== newEndOffset, "New EndIndex " + newEndOffset + " and old EndIndex " + endOffset + " doesnot match");
            }
            if (op2.action === 'Insert' && (op2.text !== CONTROL_CHARACTERS.Row && op2.text !== CONTROL_CHARACTERS.Cell) && (isNullOrUndefined(op2.markerData) || isNullOrUndefined(op2.markerData.isAcceptOrReject))) {
                this.documentEditor.selectionModule.select(startOffset, endOffset);
            } else if (op2.action === 'Delete' && op2.text !== CONTROL_CHARACTERS.Cell && (isNullOrUndefined(op2.markerData) || isNullOrUndefined(op2.markerData.isAcceptOrReject))) {
                this.documentEditor.selectionModule.select(startOffset, endOffset);
            } else if (op2.action === 'Format' && (isNullOrUndefined(op2.markerData) || isNullOrUndefined(op2.markerData.isAcceptOrReject))) {
                this.documentEditor.selectionModule.select(startOffset, endOffset);
            }
            if (!isNullOrUndefined(op2.markerData)) {
                if (!isNullOrUndefined(op2.markerData.revisionForFootnoteEndnoteContent) || !isNullOrUndefined(op2.markerData.revisionId)) {
                    this.documentEditor.editorModule.revisionData = [];
                }
                if (!isNullOrUndefined(op2.markerData.revisionForFootnoteEndnoteContent)) {
                    this.documentEditor.editorModule.revisionData.push(op2.markerData.revisionForFootnoteEndnoteContent);
                }
                if (!isNullOrUndefined(op2.markerData.revisionId)) {
                    this.documentEditor.editorModule.revisionData.push(op2.markerData);
                }
                if (!isNullOrUndefined(op2.markerData.splittedRevisions) && op2.markerData.splittedRevisions.length > 0) {
                    this.documentEditor.editorModule.revisionData = [...this.documentEditor.editorModule.revisionData, ...op2.markerData.splittedRevisions];
                }
            }
            if (!isNullOrUndefined(op2.markerData) && !isNullOrUndefined(op2.markerData.isAcceptOrReject) && op2.markerData.isAcceptOrReject !== '') {
                let revision: Revision = this.documentEditor.editorModule.getRevision(op2.markerData.revisionId);
                if (revision) {
                    if (op2.markerData.isAcceptOrReject === 'Accept') {
                        revision.accept();
                    } else if (op2.markerData.isAcceptOrReject === 'Reject') {
                        revision.reject();
                    }
                }
                continue;
            }
            if (op2.action === 'Insert') {
                if (op2.type === 'Paste') {
                    this.documentEditor.editorModule.isPasteListUpdated = false;
                    this.documentEditor.editorModule.pasteContents(HelperMethods.getSfdtDocument(op2.pasteContent));
                } else if (op2.type === 'PasteToc') {
                    this.documentEditor.editorModule.isInsertingTOC = true;
                    this.documentEditor.editorModule.pasteContents(HelperMethods.getSfdtDocument(op2.pasteContent));
                    this.documentEditor.editorModule.isInsertingTOC = false;
                } else if (op2.text === CONTROL_CHARACTERS.Image.toString()) {
                    this.insertImage(op2.imageData);
                } else if (op2.text === CONTROL_CHARACTERS.Section_Break.toString() && op2.type === 'NewPage') {
                    this.documentEditor.editorModule.insertSectionBreak();
                } else if (op2.text === CONTROL_CHARACTERS.Section_Break.toString() && op2.type === 'Continuous') {
                    this.documentEditor.editorModule.insertSectionBreak(SectionBreakType.Continuous);
                } else if (markerData && (op2.text === CONTROL_CHARACTERS.Marker_Start || op2.text === CONTROL_CHARACTERS.Marker_End || op2.text === CONTROL_CHARACTERS.Field_Separator)) {
                    let element: ElementBox;
                    if (markerData.type && markerData.type === 'Bookmark') {
                        if (op2.text === CONTROL_CHARACTERS.Marker_Start) {
                            let bookmarks: BookmarkElementBox[] = this.documentEditor.editorModule.createBookmarkElements(markerData.bookmarkName);
                            element = bookmarks[0];
                            this.documentEditor.documentHelper.isBookmarkInserted = false;
                            this.documentEditor.editorModule.insertElementsInternal(this.documentEditor.selectionModule.start, [element]);
                        } else {
                            if (this.documentEditor.documentHelper.bookmarks.containsKey(markerData.bookmarkName)) {
                                const bookmark: BookmarkElementBox = this.documentEditor.documentHelper.bookmarks.get(markerData.bookmarkName);
                                if (bookmark) {
                                    element = bookmark.reference;
                                    this.documentEditor.documentHelper.isBookmarkInserted = true;
                                    this.documentEditor.editorModule.insertElementsInternal(this.documentEditor.selectionModule.start, [element]);
                                    this.documentEditor.selectionModule.selectBookmark(markerData.bookmarkName);
                                    bookmark.properties = this.documentEditor.selectionModule.getBookmarkProperties(bookmark);
                                    (element as BookmarkElementBox).properties = this.documentEditor.selectionModule.getBookmarkProperties(element as BookmarkElementBox);
                                    this.documentEditor.editorModule.fireContentChange();
                                }
                            }
                        }
                    } else if (markerData.type && markerData.type === 'EditRange') {
                        let user: string = markerData.user;
                        var id = markerData.editRangeId;
                        if (op2.text === CONTROL_CHARACTERS.Marker_Start) {
                            if (this.documentEditor.documentHelper.restrictEditingPane) {
                                this.documentEditor.documentHelper.restrictEditingPane.addUserDialog.bindListData(user);
                            }
                            element = this.documentEditor.editorModule.addEditElement(user, id) as EditRangeStartElementBox;
                            (element as EditRangeStartElementBox).columnFirst = parseInt(markerData.columnFirst);
                            (element as EditRangeStartElementBox).columnLast = parseInt(markerData.columnLast);
                            element.line = this.documentEditor.selectionModule.start.currentWidget;
                        }
                        else {
                            var editRanges = this.documentEditor.documentHelper.editRanges.get(user);
                            for (var editStart of editRanges) {
                                if (editStart.editRangeId === id) {
                                    element = editStart.editRangeEnd;
                                    element.line = this.documentEditor.selectionModule.start.currentWidget;
                                    break;
                                }
                            }
                        }
                        this.documentEditor.editorModule.insertElementsInternal(this.documentEditor.selectionModule.start, [element]);
                        this.documentEditor.editorModule.fireContentChange();
                    } else if (markerData.type && markerData.type === 'Field') {
                        this.documentEditor.editor.isFieldOperation = true;
                        let type: number = op2.text === CONTROL_CHARACTERS.Marker_Start ? 0 : op2.text === CONTROL_CHARACTERS.Marker_End ? 1 : op2.text === CONTROL_CHARACTERS.Field_Separator ? 2 : undefined;
                        if (!isNullOrUndefined(type) && isNullOrUndefined(markerData.checkBoxValue)) {
                            var field = new FieldElementBox(type);
                            if (type === 0 && !isNullOrUndefined(markerData.formFieldData)) {
                                let formFieldData: FormField = this.documentEditor.editor.getFormFieldData(op2.type as FormFieldType);
                                this.documentEditor.parser.parseFormFieldData(0, JSON.parse(markerData.formFieldData), formFieldData);
                                field.formFieldData = formFieldData;
                            }
                            let characterFormat: WCharacterFormat = new WCharacterFormat();
                            if (op2.format) {
                                let data: object = JSON.parse(op2.format);
                                this.documentEditor.parser.parseCharacterFormat(0, data, characterFormat);
                            }
                            field.characterFormat.copyFormat(characterFormat);
                            this.documentEditor.editorModule.initInsertInline(field);
                        } else {
                            const inlineObj: ElementInfo = this.documentEditor.selectionModule.start.currentWidget.getInline(this.documentEditor.selectionModule.start.offset, 0);
                            const inline: ElementBox = inlineObj.element;
                            if (inline instanceof FieldElementBox) {
                                this.documentEditor.editorModule.toggleCheckBoxFormField(inline, true, markerData.checkBoxValue);
                            }
                        }
                    } else if (!isNullOrUndefined(markerData) && !isNullOrUndefined(markerData.commentId)) {
                        let commentType: number = op2.text === CONTROL_CHARACTERS.Marker_Start ? 0 : 1;
                        let deleteComment: CommentElementBox = this.documentEditor.documentHelper.layout.getCommentById(this.deletedComments, markerData.commentId);
                        let ownerDeleteComment: CommentElementBox = undefined;
                        if (isNullOrUndefined(deleteComment)) {
                            deleteComment = this.documentEditor.documentHelper.layout.getCommentById(this.documentEditor.documentHelper.comments, markerData.commentId);
                            if (isNullOrUndefined(deleteComment) && !isNullOrUndefined(markerData.ownerCommentId)) {
                                ownerDeleteComment = this.documentEditor.documentHelper.layout.getCommentById(this.documentEditor.documentHelper.comments, markerData.ownerCommentId);
                                deleteComment = this.documentEditor.documentHelper.layout.getCommentById(ownerDeleteComment.replyComments, markerData.commentId);
                            }
                        }
                        if (!isNullOrUndefined(deleteComment)) {
                            let item: CommentCharacterElementBox = new CommentCharacterElementBox(commentType);
                            item.commentId = markerData.commentId;
                            this.documentEditor.editorModule.insertElementsInternal(this.documentEditor.selectionModule.start, [item]);
                            item.comment = deleteComment;
                            let index: number = this.documentEditor.selectionModule.start.currentWidget.children.indexOf(item);
                            deleteComment.commentStart = this.documentEditor.selectionModule.start.currentWidget.children[index] as CommentCharacterElementBox;
                        } else {
                            let item: CommentCharacterElementBox = new CommentCharacterElementBox(commentType);
                            item.commentId = markerData.commentId;
                            this.documentEditor.editorModule.insertElementsInternal(this.documentEditor.selectionModule.start, [item]);
                            commentType === 0 ? this.commentsStart.push(item) : this.commentsEnd.push(item);
                        }
                    } else if (!isNullOrUndefined(op2.markerData.type) && (op2.markerData.type === 'Footnote' || op2.markerData.type === 'Endnote')) {
                        if (op2.markerData.type === 'Footnote') {
                            this.documentEditor.editorModule.insertFootnote();
                        } else if (op2.markerData.type === 'Endnote') {
                            this.documentEditor.editorModule.insertEndnote();
                        }
                    }
                } else if (markerData && !isNullOrUndefined(markerData.dropDownIndex) && op2.type === 'DropDown') {
                    const inlineObj: ElementInfo = this.documentEditor.selectionModule.start.currentWidget.getInline(this.documentEditor.selectionModule.start.offset, 0);
                    const inline: ElementBox = inlineObj.element;
                    if (inline instanceof FieldElementBox) {
                        this.documentEditor.editorModule.updateFormField(inline, markerData.dropDownIndex, false);
                    }
                } else if (op2.text === CONTROL_CHARACTERS.Section_Break.toString() && op2.type === 'NewPage') {
                    this.documentEditor.editorModule.insertSectionBreak();
                } else if (op2.text === CONTROL_CHARACTERS.Section_Break.toString() && op2.type === 'Continuous') {
                    this.documentEditor.editorModule.insertSectionBreak(SectionBreakType.Continuous);
                } else if (op2.text === CONTROL_CHARACTERS.Table) {
                    i = action.operations.length;
                    this.buildTable(action.operations);
                    tableLength = this.getOperationLength(action.operations);
                } else if (op2.text === CONTROL_CHARACTERS.Row) {
                    i = action.operations.length;
                    if (isNullOrUndefined(op2.format)) {
                        action.operations.reverse();
                    }
                    this.buildRow(action.operations);
                    tableLength = this.getOperationLength(action.operations);
                } else if (op2.text === CONTROL_CHARACTERS.Cell) {
                    let paraFormat: string = undefined;
                    let charFormat: string = undefined;
                    if (op2.type === 'CellFormat') {
                        if (op2.length > 0) {
                            paraFormat = action.operations[i - 1].format;
                            charFormat = action.operations[i - 2].format;
                        }
                        this.buildCell(op2, paraFormat, charFormat);
                    }
                } else if (op2.text === CONTROL_CHARACTERS.PageBreak.toString()) {
                    this.documentEditor.editorModule.insertPageBreak();
                } else if (op2.text === CONTROL_CHARACTERS.ColumnBreak.toString()) {
                    this.documentEditor.editorModule.insertColumnBreak();
                } else {
                    if (op2.format) {
                        let characterFormat: WCharacterFormat = new WCharacterFormat();
                        var data: object = JSON.parse(op2.format);
                        this.documentEditor.parser.parseCharacterFormat(0, data, characterFormat);
                        this.documentEditor.selectionModule.characterFormat.copyFormat(characterFormat);
                    }
                    this.documentEditor.editorModule.insertText(op2.text);
                }
            } else if (op2.action === 'Delete') {
                // if (this.documentEditor.selection.isEmpty && this.documentEditor.selection.start.currentWidget.isLastLine()
                //     && this.documentEditor.selection.start.offset === this.documentEditor.selection.getLineLength(this.documentEditor.selection.start.currentWidget) + 1) {
                //     this.documentEditor.selection.start.offset--;
                //     this.documentEditor.selection.end.offset--;
                //     //Delete pargaraph marker
                //     this.documentEditor.editor.delete();
                // } else {
                if (op2.text === CONTROL_CHARACTERS.Marker_Start || op2.text === CONTROL_CHARACTERS.Marker_End) {
                    if (!isNullOrUndefined(markerData) && !isNullOrUndefined(markerData.commentId)) {
                        let selection = this.documentEditor.selectionModule;
                        let commentType: number = op2.text === CONTROL_CHARACTERS.Marker_Start ? 0 : 1;
                        let deleteComment: CommentCharacterElementBox;
                        if (this.documentEditor.selection.getElementInfo(this.documentEditor.selection.end.currentWidget, this.documentEditor.selection.end.offset).element instanceof CommentCharacterElementBox) {
                            deleteComment = this.documentEditor.selection.getElementInfo(this.documentEditor.selection.end.currentWidget, this.documentEditor.selection.end.offset).element as CommentCharacterElementBox;
                        }
                        if (commentType === 1) {
                            const commentEnd: CommentCharacterElementBox = deleteComment;
                            if (commentEnd.indexInOwner !== -1) {
                                this.documentEditor.editorModule.removeAtOffset(selection.start.currentWidget, this.documentEditor.selectionModule, selection.start.offset);
                            }
                        } else {
                            const commentStart: CommentCharacterElementBox = deleteComment;
                            if (commentStart.indexInOwner !== -1) {
                                this.documentEditor.editorModule.removeAtOffset(selection.start.currentWidget, this.documentEditor.selectionModule, selection.start.offset);
                            }
                            commentStart.removeCommentMark();
                        }
                    } else {
                        let selection = this.documentEditor.selectionModule;
                        let offset: number = selection.start.offset - 1;
                        this.documentEditor.editorModule.removeAtOffset(selection.start.currentWidget, this.documentEditor.selectionModule, offset);
                    }
                } else if (op2.text === CONTROL_CHARACTERS.Cell) {
                    this.buildDeleteCells(op2);
                } else {
                    this.documentEditor.editorModule.onBackSpace();
                }
                //}
            } else if (op2.action === 'Format') {
                if (op2.text === (CONTROL_CHARACTERS.Marker_Start.toString() + CONTROL_CHARACTERS.Marker_End.toString())) {
                    this.updateOperation(op2);
                } else if (!isNullOrUndefined(op2.markerData) && !isNullOrUndefined(op2.markerData.revisionId)) {
                    if (!isNullOrUndefined(op2.markerData.revisionType)) {
                        if (op2.markerData.revisionType === 'Deletion') {
                            if (op2.text === CONTROL_CHARACTERS.Row) {
                                let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(op2.offset, false, true, false);
                                if (!isNullOrUndefined(data.rowWidget)) {
                                    let row: TableRowWidget = data.rowWidget;
                                    this.documentEditor.editorModule.trackRowDeletion(row);
                                    this.documentEditor.trackChangesPane.updateTrackChanges();
                                    continue;
                                }
                            }
                            this.documentEditor.editorModule.onBackSpace();
                        }
                    }
                } else if (op2.text === CONTROL_CHARACTERS.Row) {
                    let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(op2.offset, false, true, false);
                    if (!isNullOrUndefined(data.rowWidget)) {
                        let table: TableWidget = (data.rowWidget as TableRowWidget).ownerTable;
                        let rowData: any = JSON.parse(op2.format);
                        this.documentEditor.documentHelper.owner.parser.parseRowFormat(rowData, (data.rowWidget as TableRowWidget).rowFormat, 0);
                        table.calculateGrid(false);
                        this.documentEditor.documentHelper.layout.reLayoutTable(table);
                    }
                } else if (op2.text === CONTROL_CHARACTERS.Cell) {
                    if (op2.type === 'TableFormat') {
                        let tableData: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(op2.offset, true, false, false);
                        let table: any = JSON.parse(op2.format);
                        this.documentEditor.documentHelper.owner.parser.parseTableFormat(table, tableData.tableWidget.tableFormat, 0);
                        tableData.tableWidget.calculateGrid(false);
                        this.documentEditor.documentHelper.layout.reLayoutTable(tableData.tableWidget);
                    }
                    if (op2.type === 'RowFormat') {
                        let rowData: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(op2.offset, false, true, false);
                        let row: any = JSON.parse(op2.format);
                        this.documentEditor.documentHelper.owner.parser.parseRowFormat(row, rowData.rowWidget.rowFormat, 0);
                    }
                    if (op2.type === 'CellFormat') {
                        let cellData: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(op2.offset, false, false, true);
                        let cell: any = JSON.parse(op2.format);
                        this.documentEditor.documentHelper.owner.parser.parseCellFormat(cell, cellData.cellWidget.cellFormat, 0);
                    }
                } else if (op2.text === CONTROL_CHARACTERS.Image) {
                    let inlineObj: ElementInfo = this.documentEditor.selectionModule.end.currentWidget.getInline(this.documentEditor.selectionModule.end.offset, 0);
                    let inline: ElementBox = inlineObj.element;
                    if (inline instanceof ImageElementBox) {
                        this.documentEditor.editorModule.onImageFormat(inline, HelperMethods.convertPointToPixel(op2.imageData.width), HelperMethods.convertPointToPixel(op2.imageData.height), op2.imageData.alternativeText);
                    }
                } else if (op2.type === 'ListFormat') {
                    let paragraphFormat: any = JSON.parse(op2.format);
                    let format: WParagraphFormat = new WParagraphFormat(undefined);
                    this.documentEditor.parser.parseParagraphFormat(0, paragraphFormat, format);
                    this.updateList(op2, format);
                    let list: WList = this.documentEditor.documentHelper.getListById(paragraphFormat.listFormat.nsid, true);
                    if (!isNullOrUndefined(list)) {
                        format.listFormat.listId = list.listId;
                        format.listFormat.list = list;
                    }
                    this.documentEditor.editorModule.onApplyParagraphFormat(op2.text, format.listFormat, false, false);
                } else if (op2.type === 'RestartNumbering') {
                    let nsid: number = this.updateList(op2);
                    let list: WList = this.documentEditor.documentHelper.getListById(nsid, true);
                    this.documentEditor.editorModule.restartListAtInternal(this.documentEditor.selectionModule, list.listId, list.nsid);
                } else if (op2.type === 'ContinueNumbering') {
                    let paragraphFormat: any = JSON.parse(op2.format);
                    let format: WParagraphFormat = new WParagraphFormat(undefined);
                    this.documentEditor.parser.parseParagraphFormat(0, paragraphFormat, format);
                    let list: WList = this.documentEditor.documentHelper.getListById(format.listFormat.nsid, true);
                    if (!isNullOrUndefined(list)) {
                        format.listFormat.listId = list.listId;
                        format.listFormat.list = list;
                    }
                    this.documentEditor.editorModule.applyContinueNumberingInternal(this.documentEditor.selectionModule, format);
                } else if (op2.type === 'CharacterFormat') {
                    this.insertCharaterFormat(op2.type, op2.format);
                } else if (op2.type === 'ParagraphFormat') {
                    this.insertParagraphFormat(op2, op2.format);
                } else if (op2.type === 'TableFormat') {
                    this.insertTableFormat(op2.text, op2.format, op2.offset);
                } else if (op2.type === 'SectionFormat') {
                    this.insertSectionFormat(op2.text, op2.format);
                } else if (op2.type === 'RowFormat') {
                    this.insertRowFormat(op2.text, op2.format);
                } else if (op2.type === 'CellFormat') {
                    this.insertCellFormat(op2.format);
                }
            }
            this.documentEditor.editor.revisionData = undefined;
            if (this.documentEditor.enableTrackChanges != trackingCurrentValue) {
                this.documentEditor.skipSettingsOps = true;
                this.documentEditor.enableTrackChanges = trackingCurrentValue;
            }
            this.documentEditor.currentUser = currentUser;
            let newOffset = this.documentEditor.selectionModule.startOffset;
            //op2.offset = newOffset;
            this.updateRemoteSelection(action, this.documentEditor.selectionModule.getAbsolutePositionFromRelativePosition(newOffset));
            if (!isNullOrUndefined(tableLength)) {
                let temp: number = op2.length;
                op2.length = tableLength;
                tableLength = temp;
            }
            let tranformedOffset = this.transformSection(op2.action, op2, offset)[1];
            //TODO: Need to handle backward selection.
            //TODO: Need to optimize the code. Need to transform selection end length based on remove content
            let tranformedEndOffset = this.transformSection(op2.action, op2, offset + selectionLength)[1];
            offset = tranformedOffset;
            this.documentEditor.selectionModule.select(this.getRelativePositionFromAbsolutePosition(tranformedOffset, false, false, false), this.getRelativePositionFromAbsolutePosition(tranformedEndOffset, false, false, false));
            if (!isNullOrUndefined(tableLength)) {
                op2.length = tableLength;
            }
            this.transformRemoteCursor(action.connectionId, op2, op2.offset);
            if (!isNullOrUndefined(this.documentEditor.searchModule) && !isNullOrUndefined(this.documentEditor.optionsPaneModule) && this.documentEditor.searchModule.searchResults.length > 0 && this.documentEditor.optionsPaneModule.isOptionsPaneShow) {
                this.documentEditor.optionsPaneModule.searchIconClickInternal();
            }
        }
        if (this.documentEditor.editor.isFieldOperation) {
            this.documentEditor.editorModule.layoutWholeDocument();
            this.documentEditor.editor.isFieldOperation = false;
        }
        if (!isNullOrUndefined(this.rowWidget)) {
            let ownerTable: TableWidget = this.rowWidget.ownerTable.combineWidget(this.documentEditor.viewer) as TableWidget;
            ownerTable.updateRowIndex(0);
            ownerTable.calculateGrid(true);
            this.documentEditor.documentHelper.layout.reLayoutTable(ownerTable);
            this.documentEditor.editorModule.reLayout(this.documentEditor.selectionModule);
            this.rowWidget = undefined;
        }
        if (!isNullOrUndefined(this.table)) {
            this.table.calculateGrid();
            this.documentEditor.editorModule.updateTable(this.table);
            this.documentEditor.editorModule.reLayout(this.documentEditor.selectionModule, true);
            this.table = undefined;
        }
        this.documentEditor.currentUser = currentUser;
        this.documentEditor.commentReviewPane.commentPane.isEditMode = currentEditMode;
        this.documentEditor.editorHistoryModule.lastOperation = currenteditorHistory;
        if (!isNullOrUndefined(this.documentEditor.commentReviewPane.commentPane.currentEditingComment)) {
            this.documentEditor.commentReviewPane.commentPane.currentEditingComment.textArea = currentTextArea;
        }
    }
    private updateOperation(operation: Operation): void {
        let markerData = operation.markerData;
        if (operation.text === (CONTROL_CHARACTERS.Marker_Start.toString() + CONTROL_CHARACTERS.Marker_End.toString())) {
            let ownerComment: CommentElementBox = undefined;
            let commentToDelete: CommentElementBox = undefined;
            if (this.documentEditor.selection.getElementInfo(this.documentEditor.selection.end.currentWidget, this.documentEditor.selection.end.offset).element instanceof CommentCharacterElementBox && operation.offset > 0) {
                let commentID: string = (this.documentEditor.selection.getElementInfo(this.documentEditor.selection.end.currentWidget, this.documentEditor.selection.end.offset).element as CommentCharacterElementBox).commentId;
                commentToDelete = this.getComment(commentID);
            }
            if (!isNullOrUndefined(commentToDelete) && !(!isNullOrUndefined(markerData.done) && isNullOrUndefined(markerData.date)) && isNullOrUndefined(markerData.isReply)) {
                if (commentToDelete.text !== markerData.text) {
                    let commentView: CommentView = this.documentEditor.commentReviewPane.commentPane.comments.get(commentToDelete);
                    commentView.commentText.innerText = markerData.text;
                    commentToDelete.text = markerData.text;
                    return;
                }
            }
            if (!isNullOrUndefined(commentToDelete)) {
                if (!isNullOrUndefined(markerData.done) && isNullOrUndefined(markerData.commentAction)) {
                    if (markerData.done) {
                        this.documentEditor.editorModule.resolveComment(commentToDelete);
                    } else {
                        this.documentEditor.editorModule.reopenComment(commentToDelete);
                    }
                    return;
                }
                if (markerData.commentAction === "remove") {
                    let commentView: CommentView = this.documentEditor.commentReviewPane.commentPane.comments.get(!isNullOrUndefined(ownerComment) ? ownerComment : commentToDelete);
                    commentView.showDrawer();
                    this.documentEditor.editorModule.deleteCommentWidget(commentToDelete);
                    this.deletedComments.push(commentToDelete);
                    commentView.hideDrawer();
                } else {
                    let item: CommentElementBox = new CommentElementBox(markerData.date);
                    item.commentId = markerData.commentId;
                    let commentStart: CommentCharacterElementBox = this.getObjectByCommentId(this.commentsStart, item.commentId);
                    let commentEnd: CommentCharacterElementBox = this.getObjectByCommentId(this.commentsEnd, item.commentId);
                    if (!isNullOrUndefined(commentStart) && !isNullOrUndefined(commentEnd)) {
                        this.documentEditor.editorModule.updateCommentElement(item, commentStart, commentEnd, markerData);
                        item.ownerComment = commentToDelete;
                        commentToDelete.replyComments.splice(markerData.commentIndex, 0, item);
                        this.documentEditor.commentReviewPane.addReply(item, false, false);
                    }
                }
            } else {
                let item: CommentElementBox = new CommentElementBox(markerData.date);
                item.commentId = markerData.commentId;
                let commentStart: CommentCharacterElementBox = this.getObjectByCommentId(this.commentsStart, item.commentId);
                let commentEnd: CommentCharacterElementBox = this.getObjectByCommentId(this.commentsEnd, item.commentId);
                if (!isNullOrUndefined(commentStart) && !isNullOrUndefined(commentEnd)) {
                    this.documentEditor.editorModule.updateCommentElement(item, commentStart, commentEnd, markerData);
                    this.documentEditor.editorModule.addCommentWidget(item, true, true, false);
                    this.commentsStart.splice(this.commentsStart.indexOf(commentStart), 1);
                    this.commentsEnd.splice(this.commentsEnd.indexOf(commentEnd), 1);
                    const comment: CommentView = this.documentEditor.commentReviewPane.commentPane.comments.get(item);
                    comment.postComment();
                }
            }
        }
    }
    private getComment(commentID: string): CommentElementBox {
        let collection: CommentElementBox[] = this.documentEditor.documentHelper.comments;
        for (let i: number = 0; i < collection.length; i++) {
            let comment: CommentElementBox = this.documentEditor.documentHelper.layout.getCommentById(collection, commentID);
            if (isNullOrUndefined(comment)) {
                for (let j: number = 0; j < collection[i].replyComments.length; j++) {
                    let replyComment: CommentElementBox = this.documentEditor.documentHelper.layout.getCommentById(collection[i].replyComments, commentID);
                    if (!isNullOrUndefined(replyComment)) {
                        return replyComment;
                    }
                }
            } else {
                return comment;
            }
        }
        return null;
    }
    private updateList(operation: Operation, format?: WParagraphFormat): number {
        let nsid: number = -1;
        if (operation.listData) {
            let listData: any = JSON.parse(operation.listData);
            if (listData.hasOwnProperty('optimizeSfdt')) {
                this.documentEditor.parser.keywordIndex = listData.optimizeSfdt ? 1 : 0;
            }
            if (!isNullOrUndefined(format)) {
                let list: WList = this.documentEditor.documentHelper.getListById(format.listFormat.nsid, true);
                if (isNullOrUndefined(list)) {
                    this.updateListCollection(listData, this.documentEditor.parser.keywordIndex);
                } else {
                    let abstractLists: WAbstractList[] = [];
                    this.documentEditor.parser.parseAbstractList(listData, abstractLists);
                    if (!isNullOrUndefined(list.abstractList)) {
                        if (list.abstractList.levels.length < format.listFormat.listLevelNumber) {
                            list.abstractList.levels = [];
                            for (let i: number = 0; i < abstractLists[0].levels.length; i++) {
                                list.abstractList.levels.push(abstractLists[0].levels[i]);
                            }
                        }
                    }
                }
            } else {
                if (listData.hasOwnProperty(nsidProperty)) {
                    nsid = listData[nsidProperty];
                }
                this.updateListCollection(listData, this.documentEditor.parser.keywordIndex);
            }
        }
        return nsid;
    }
    private getOperationLength(operations: Operation[],): number {
        let length: number = 0;
        for (let i: number = 0; i < operations.length; i++) {
            if (operations[parseInt(i.toString(), 10)].text === CONTROL_CHARACTERS.Table || operations[parseInt(i.toString(), 10)].text === CONTROL_CHARACTERS.Row || operations[parseInt(i.toString(), 10)].text === CONTROL_CHARACTERS.Cell)
                length += operations[parseInt(i.toString(), 10)].length;
        }
        return length;
    }
    private updateListCollection(listData: any, keywordIndex: number): void {
        let uniqueListId: number = this.documentEditor.editorModule.getUniqueListOrAbstractListId(true);
        let uniqueAbsLstId: number = this.documentEditor.editorModule.getUniqueListOrAbstractListId(false);
        for (let k: number = 0; k < listData[listsProperty[keywordIndex]].length; k++) {
            let list: WList = listData[listsProperty[keywordIndex]][k];
            let abstractList: any = listData[abstractListsProperty[keywordIndex]].filter((obj: any) => {
                return obj[abstractListIdProperty[keywordIndex]] === list[abstractListIdProperty[keywordIndex]];
            })[0];
            if (!isNullOrUndefined(abstractList)) {
                abstractList[abstractListIdProperty[keywordIndex]] = uniqueAbsLstId;
                list[listIdProperty[keywordIndex]] = uniqueListId;
                list[abstractListIdProperty[keywordIndex]] = uniqueAbsLstId;
                uniqueListId++;
                uniqueAbsLstId++;
            }
        }
        this.documentEditor.parser.parseAbstractList(listData, this.documentEditor.documentHelper.abstractLists);
        this.documentEditor.parser.parseList(listData, this.documentEditor.documentHelper.lists);
    }
    private getObjectByCommentId(collection: CommentCharacterElementBox[], commentId: string): CommentCharacterElementBox {
        for (const obj of collection) {
            if (obj.commentId === commentId) {
                return obj;
            }
        }
        return undefined;
    }

    private transformOperation(operation1: Operation, operation2: Operation, action: Operation[]): Operation[] {
        if (operation1.action === 'Insert' && (operation2.action === 'Insert' || operation2.action === 'Format')) {
            if (operation1.offset < operation2.offset) {
                operation2.offset = operation2.offset + operation1.length;
                return [operation1, operation2];
            } else if (operation1.offset >= operation2.offset && operation2.action !== 'Format') {
                operation1.offset = operation1.offset + operation2.length;
                return [operation1, operation2,];
            }
        } else if (operation1.action === 'Delete' && (operation2.action === 'Delete' || operation2.action === 'Format')) {
            if (operation1.offset < operation2.offset) {
                operation2.offset = operation2.offset - operation1.length;

                return [operation1, operation2];
            } else if (operation1.offset > operation2.offset && operation2.action !== 'Format') {
                operation1.offset = operation1.offset - operation2.length;
                return [operation1, operation2,];
            }
        }
        else if (operation1.action === 'Insert' && (operation2.action === 'Delete' || operation2.action === 'Format')) {
            if (operation1.offset <= operation2.offset) {
                operation2.offset = operation2.offset + operation1.length;
                return [operation1, operation2];
            } else if (operation1.offset >= operation2.offset + operation2.length && operation2.action !== 'Format') {
                operation1.offset = operation1.offset - operation2.length;
                return [operation1, operation2,];
            }
            // Local selection fully encompasses the conflicting selection
            else if (operation1.offset > operation2.offset && operation1.offset < (operation2.offset + operation2.length)) {
                operation2.length += operation1.length;
            }
        } else if (operation1.action === 'Delete' && (operation2.action === 'Insert' || operation2.action === 'Format')) {
            if (operation1.offset <= operation2.offset && (operation1.offset + operation1.length) <= operation2.offset) {
                operation2.offset = operation2.offset - operation1.length;
            } else if (operation1.offset < operation2.offset && (operation1.offset + operation1.length) >= (operation2.offset + operation2.length)) {
                if (!isNullOrUndefined(operation2.markerData) && !isNullOrUndefined(operation2.markerData.type) && operation2.markerData.type !== 'Field' && (operation2.text === CONTROL_CHARACTERS.Marker_End || operation2.text === CONTROL_CHARACTERS.Marker_Start)) {
                    if (!isNullOrUndefined(operation2.markerData.commentId) && operation2.text === CONTROL_CHARACTERS.Marker_End) {
                        this.skipAction(action);
                        return [operation1, operation2];
                    }
                    var conflictLenth = operation2.offset - operation1.offset;
                    operation2.offset -= conflictLenth;
                } else {
                    //Skip insert operation
                    operation2.length = 0;
                    operation2.skipOperation = true;
                    if (!isNullOrUndefined(operation2.markerData) && !isNullOrUndefined(operation2.markerData.type) && operation2.markerData.type === 'Field' && (operation2.text === CONTROL_CHARACTERS.Marker_Start || operation2.text === CONTROL_CHARACTERS.Marker_End)) {
                        this.skipAction(action);
                    }
                }
            } else if (operation1.offset <= operation2.offset && operation2.action == "Insert" && (operation1.offset + operation1.length) >= operation2.offset) {
                this.skipAction(action);
            }
            else if (operation1.offset > operation2.offset && operation2.action !== 'Format') {
                operation1.offset = operation1.offset + operation2.length;
            }
        }
        // else {
        //     throw new Error(`Invalid operation types: ${operation1.action}, ${operation2.action}`);
        // }
        return [operation1, operation2];
    }
    private transformSection(action: string, operation1: Operation, operation2: number): number[] {
        if (action === 'Insert') {
            if (operation1.offset < operation2) {
                return [operation1.offset, operation2 + operation1.length];
            }
            // else if (operation1.offset > operation2.offset) {
            //     return [
            //         operation1.offset + operation2.length,
            //         operation2.offset,
            //     ];
            // }
        } else if (action === 'Delete') {
            if (operation1.offset <= operation2) {
                return [operation1.offset, operation2 - operation1.length];
            }
        }
        return [operation1.offset, operation2];
    }
    private transformRemoteCursor(connectionId: string, operation: Operation, offset: number) {
        if (this.documentEditor.editorModule.isIncrementalSave) {
            return;
        }
        this.updateCaretPosition(connectionId, operation);
    }
    /**
     * @private
     * @returns {void}
    */
    public updateCaretPosition(connectionId?: string, operation?: Operation): void {
        let keys: string[] = Object.keys(this.userMap);
        let tranformedOffset: number;
        //For loop to iterate over the keys
        for (let i = 0; i < keys.length; i++) {
            let key: string = keys[i];
            if (key === connectionId) {
                continue;
            }
            if (!isNullOrUndefined(operation)) {
                let remoteOffset: number = this.userMap[key].offset;
                tranformedOffset = this.transformSection(operation.action, operation, remoteOffset)[1];
                this.userMap[key].offset = tranformedOffset;
            } else {
                tranformedOffset = this.userMap[key].offset;
            }
            this.updateCaretPositionInteral(this.userMap[key].caret, tranformedOffset);
        }
    }

    private updateRemoteSelection(data: ActionInfo, removeOffset: number): void {
        if (this.documentEditor.editorModule.isIncrementalSave) {
            return;
        }
        if (data.connectionId) {
            let color = '';
            let caret: HTMLElement;
            if (this.userMap[data.connectionId] !== undefined) {
                color = this.userMap[data.connectionId].color;
                caret = this.userMap[data.connectionId].caret;
            } else {
                color = this.getColorForMember(Math.random() * 100);
                caret = createElement('div', { className: 'e-de-blink-cursor', styles: ('position:absolute;border-left: 2px solid ' + color) });
                this.userMap[data.connectionId] = new CaretInfo(color, caret, removeOffset, data.currentUser);
            }
            this.userMap[data.connectionId].offset = removeOffset;
            this.updateCaretPositionInteral(caret, removeOffset);
        }
    }
    private removeCarets(connectionId: string): void {
        if (this.userMap[connectionId] !== undefined) {
            this.userMap[connectionId].caret.remove();
            delete this.userMap[connectionId];
        }
    }
    private getColorForMember(randonNumber: number) {
        const colorValue = randonNumber % 20;
        return `hsl(${(colorValue * 360 / 7) % 360}, 100%, 35%)`;
    }
    private updateCaretPositionInteral(caret: HTMLElement, start: number): void {
        let zoomFactor: number = this.documentEditor.zoomFactor;
        let selection: Selection = this.documentEditor.selectionModule;
        let startPos: TextPosition = selection.getTextPosBasedOnLogicalIndex(this.getRelativePositionFromAbsolutePosition(start, false, false, false));
        //let endPos: TextPosition = selection.getTextPosBasedOnLogicalIndex(end);
        let caretPosition: Point = startPos.location;
        //if (startPos.isInSameParagraph(endPos)) {
        caret.style.display = 'block';
        if (!caret.parentElement) {
            this.documentEditor.documentHelper.viewerContainer.appendChild(caret);
        }
        let page: Page = selection.getSelectionPage(startPos);
        if (page) {
            caret.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * zoomFactor) + 'px';
            let caretInfo: CaretHeightInfo = selection.updateCaretSize(startPos);
            let topMargin: number = caretInfo.topMargin;
            caret.style.height = (caretInfo.height * zoomFactor) + 'px';
            let pageTop: number = selection.getPageTop(page);
            caret.style.top = pageTop + Math.round(caretPosition.y + topMargin) * zoomFactor + 'px';
            if (selection.characterFormat.baselineAlignment === 'Subscript') {
                caret.style.top = parseFloat(caret.style.top) + (parseFloat(caret.style.height) / 2) + 'px';
            }
        }
    }
    private getBlockPosition(offset: number, currentLength: number, block: BlockWidget, completed: AbsolutePositionInfo, isTableInserted: boolean, isRowInserted: boolean, isCellInserted: boolean): AbsoluteParagraphInfo {
        let paragraph;
        if (block instanceof ParagraphWidget) {
            // let paraLength: number = block.length;
            // Code for Comparing the offset calculated using old approach and optimized approach
            // if (this.documentEditor.selection.getParagraphLength(block) + 1 == block.length && currentLength + paraLength < offset && currentLength + paraLength + 1 < offset && this.documentEditor.selection.isNewApproach) {
            //     currentLength += paraLength;
            // } else {
            let absoluteData: AbsoluteParagraphInfo = this.getBlockTotalLength(offset, currentLength, block, completed, isTableInserted, isRowInserted, isCellInserted);
            // length = block.getTotalLength() + 1;
            // paragraph = block;
            if (completed.done) {
                completed.done = true;
                return absoluteData;
            } else {
                //Add paragraph mark length
                currentLength = absoluteData.currentLength;
                offset = absoluteData.offset;
                paragraph = absoluteData.paragraph;
            }
            // }
        } else if (block instanceof TableWidget) {
            // Table start mark length
            offset -= 1;
            if (offset === currentLength) {
                if (isTableInserted || this.documentEditor.selectionModule.isEndOffset) {
                    completed.done = true;
                    return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'tableWidget': block };
                }
            }
            let row: TableRowWidget = block.firstChild as TableRowWidget;
            while (row) {
                // Row mark length
                offset -= 1;
                if (offset === currentLength) {
                    if (isRowInserted || this.documentEditor.selectionModule.isEndOffset) {
                        completed.done = true;
                        let index: number = row.index;
                        return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'rowOrCellIndex': index, 'rowWidget': row };
                    } else if (isCellInserted) {
                        completed.done = true;
                        let cellWidget: TableCellWidget = paragraph.associatedCell as TableCellWidget;
                        let index: number = cellWidget.cellIndex + 1;
                        return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'rowOrCellIndex': index, 'cellWidget': cellWidget };
                    }
                }
                let cell: TableCellWidget = row.firstChild as TableCellWidget;
                while (cell) {
                    // Cell mark length
                    offset -= 1;
                    if (offset === currentLength) {
                        if (isCellInserted) {
                            completed.done = true;
                            let index: number = cell.cellIndex;
                            return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'rowOrCellIndex': index, 'cellWidget': cell };
                        }
                    }
                    let childBlock: BlockWidget = cell.firstChild as BlockWidget;
                    while (childBlock) {
                        let data: any = this.getBlockPosition(offset, currentLength, childBlock as BlockWidget, completed, isTableInserted, isRowInserted, isCellInserted);
                        if (completed.done) {
                            if (isRowInserted && isNullOrUndefined(data.rowWidget)) {
                                completed.done = true;
                                let rowWidget: TableRowWidget = cell.ownerRow as TableRowWidget;
                                let index: number = rowWidget.index + 1;
                                return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'rowOrCellIndex': index, 'rowWidget': rowWidget };
                            } else if (isCellInserted && isNullOrUndefined(data.cellWidget)) {
                                completed.done = true;
                                let cellWidget: TableCellWidget = cell as TableCellWidget;
                                let index: number = cellWidget.cellIndex + 1;
                                return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph, 'rowOrCellIndex': index, 'cellWidget': cellWidget };
                            } else {
                                return data;
                            }
                        } else {
                            offset = data.offset;
                            currentLength = data.currentLength;
                            paragraph = data.paragraph;
                        }
                        childBlock = childBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
                    }
                    cell = cell.nextWidget as TableCellWidget;
                }
                let tableIndex: number = row.ownerTable.index;
                row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
                if (row && row.ownerTable.index !== tableIndex) {
                    row = undefined;
                }
            }
        }
        return { 'offset': offset, 'currentLength': currentLength, 'paragraph': paragraph }
    }
    private getBlockTotalLength(offset: number, currentLength: number, block: ParagraphWidget, completed: AbsolutePositionInfo, isTableInserted: boolean, isRowInserted: boolean, isCellInserted: boolean) {
        let splittedWidget: ParagraphWidget[] = block.getSplitWidgets() as ParagraphWidget[];
        //Paragraph start offset
        let paragraphStartLength: number = 1;
        let length: number = 0;
        if (currentLength + paragraphStartLength >= offset) {
            completed.done = true;
            return { 'offset': offset - 1, 'currentLength': currentLength, 'paragraph': block };
        }
        let childBlockLength: number = 0;
        for (let i: number = 0; i < splittedWidget.length; i++) {
            for (let j: number = 0; j < splittedWidget[i].childWidgets.length; j++) {
                let line: LineWidget = splittedWidget[i].childWidgets[j] as LineWidget;
                for (let k: number = 0; k < line.children.length; k++) {
                    let element: ElementBox = line.children[k] as ElementBox;
                    if (element instanceof ListTextElementBox) {
                        continue;
                    }
                    if ((element instanceof ShapeElementBox && !isNullOrUndefined(element.textFrame) && element.textFrame.childWidgets.length > 0)
                        || element instanceof FootnoteElementBox) {
                        let absoluteData: AbsoluteParagraphInfo;
                        if (element instanceof ShapeElementBox) {
                            let currentLengthValue: number = currentLength + childBlockLength + length + paragraphStartLength;
                            for (let i: number = 0; i < element.textFrame.childWidgets.length; i++) {
                                absoluteData = this.getBlockPosition(offset, currentLengthValue, element.textFrame.childWidgets[i] as BlockWidget, completed, isTableInserted, isRowInserted, isCellInserted);
                                currentLengthValue = absoluteData.currentLength;
                                offset = absoluteData.offset;
                            }
                        } else {
                            let currentLengthValue: number = currentLength + childBlockLength + length + paragraphStartLength;
                            for (let m: number = 0; m < element.bodyWidget.childWidgets.length && !completed.done; m++) {
                                absoluteData = this.getBlockPosition(offset, currentLengthValue, element.bodyWidget.childWidgets[m] as BlockWidget, completed, isTableInserted, isRowInserted, isCellInserted);
                                currentLengthValue = absoluteData.currentLength;
                                offset = absoluteData.offset;
                            }
                        }
                        offset = absoluteData.offset;
                        childBlockLength += (absoluteData.currentLength - (currentLength + length + paragraphStartLength + childBlockLength));
                        if (completed.done) {
                            currentLength = absoluteData.currentLength;
                            return absoluteData;
                        }
                    }
                    length += element.length;
                    offset += element.skipformFieldLength ? element.length : 0;
                    if (currentLength + childBlockLength + length + paragraphStartLength >= offset) {
                        completed.done = true;
                        return { 'offset': offset - 1, 'currentLength': currentLength + childBlockLength, 'paragraph': block };
                    }
                }
            }
        }
        if (currentLength + childBlockLength + length + paragraphStartLength + 1 == offset && this.documentEditor.selection.isEndOffset && !this.documentEditor.selection.isFootEndNoteParagraph(block)) {
            completed.done = true;
            return { 'offset': offset - 1, 'currentLength': currentLength + childBlockLength, 'paragraph': block };
        } else {
            currentLength += (length + childBlockLength + paragraphStartLength);
            return { 'offset': offset, 'currentLength': currentLength, 'paragraph': block }
        }
    }
    private getRelativePositionFromAbsolutePosition(offset: number, isTableInserted: boolean, isRowInserted: boolean, isCellInserted: boolean): string | any {
        let documentEditor = this.documentEditor;
        let block: BlockWidget = this.documentEditor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as BlockWidget;
        let currentLength = 0;
        let positionInfo: AbsolutePositionInfo = { done: false };

        let blockObj: AbsoluteParagraphInfo = this.getBlockByIndex(block, offset, currentLength, positionInfo, isTableInserted, isRowInserted, isCellInserted);
        if (positionInfo.done) {
            let paraOffset: number = blockObj.offset - blockObj.currentLength;
            if (paraOffset < 0) {
                paraOffset = 0;
            }
            let paragraphInfo: ParagraphInfo = {
                paragraph: blockObj.paragraph,
                offset: paraOffset,
            }
            if (isTableInserted || isRowInserted || isCellInserted) {
                return blockObj;
            } else {
                return documentEditor.selectionModule.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
            }
        } else if (blockObj.offset === blockObj.currentLength + 1 && this.documentEditor.selection.isEndOffset) {
            let length: number = this.documentEditor.selection.getParagraphLength(blockObj.paragraph);
            currentLength = blockObj.currentLength - length;
            return documentEditor.selection.getHierarchicalIndex(blockObj.paragraph, (blockObj.offset - currentLength).toString());
        }
        let blockObj1: AbsoluteParagraphInfo = this.getBlockIndexFromHeaderFooter(blockObj.offset, blockObj.currentLength, positionInfo, isTableInserted, isRowInserted, isCellInserted);
        if (positionInfo.done) {
            let paraOffset: number = blockObj1.offset - blockObj1.currentLength;
            if (paraOffset < 0) {
                paraOffset = 0;
            }
            let paragraphInfo: ParagraphInfo = {
                paragraph: blockObj1.paragraph,
                offset: paraOffset,
            }
            if (isTableInserted || isRowInserted || isCellInserted) {
                return blockObj1;
            } else {
                return documentEditor.selectionModule.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
            }
        }
        return '';
    }
    private getBlockIndexFromHeaderFooter(offset: number, currentLength: number, positionInfo: AbsolutePositionInfo, isTableInserted: boolean, isRowInserted: boolean, isCellInserted: boolean): AbsoluteParagraphInfo {
        //Iterate header/footer content;
        let blockObj: AbsoluteParagraphInfo;
        const headersFooters = this.documentEditor.documentHelper.headersFooters;
        for (const headerFooter of headersFooters) {
            for (let i = 0; i < 6; i++) {
                const currentHeaderFooter = headerFooter[i];
                if (currentHeaderFooter) {
                    blockObj = this.getBlockByIndex(currentHeaderFooter.childWidgets[0] as BlockWidget, offset, currentLength, positionInfo, isTableInserted, isRowInserted, isCellInserted);
                    currentLength = blockObj.currentLength;
                    offset = blockObj.offset;
                    if (positionInfo.done) {
                        return blockObj;
                    }
                } else {
                    if (currentLength + 1 >= offset) {
                        positionInfo.done = true;
                        return blockObj;
                    }
                    //Insert new header footer and paragraph to existing collection.
                    currentLength++;
                    blockObj.currentLength = currentLength;
                }
            }
        }
        return blockObj;
    }
    private getBlockByIndex(block: BlockWidget, offset: number, currentLength: number, positionInfo: AbsolutePositionInfo, isTableInserted: boolean, isRowInserted: boolean, isCellInserted: boolean): AbsoluteParagraphInfo {
        let blockObj: AbsoluteParagraphInfo;
        do {
            blockObj = this.getBlockPosition(offset, currentLength, block, positionInfo, isTableInserted, isRowInserted, isCellInserted);
            currentLength = blockObj.currentLength;
            offset = blockObj.offset;
            if (positionInfo.done) {
                return blockObj;
            }
            block = block.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        } while (block)
        return blockObj;
    }
    private insertImage(imageData: ImageInfo): void {
        if (isNullOrUndefined(imageData.metaString)) {
            this.documentEditor.editorModule.insertImageInternal(imageData.imageString, true, HelperMethods.convertPointToPixel(imageData.width), HelperMethods.convertPointToPixel(imageData.height), imageData.alternativeText);
        }
        else {
            this.documentEditor.editorModule.isImageInsert = true;
            this.documentEditor.editorModule.insertImageInternal(imageData.metaString, true, HelperMethods.convertPointToPixel(imageData.width), HelperMethods.convertPointToPixel(imageData.height), imageData.alternativeText);
        }
    }
    private buildTable(operations: Operation[]): void {
        let rows: number = 0;
        let columns: number = 0;
        for (let i: number = 0; i < operations.length; i++) {
            if (operations[i].text === CONTROL_CHARACTERS.Row) {
                if (!isNullOrUndefined(operations[i].markerData)) {
                    if (isNullOrUndefined(this.documentEditor.editorModule.revisionData)) {
                        this.documentEditor.editorModule.revisionData = [];
                    }
                    this.documentEditor.editorModule.revisionData.push(operations[i].markerData);
                }
                rows++;
            }
        }
        for (let i: number = 0; i < operations.length; i++) {
            if (operations[i].text === CONTROL_CHARACTERS.Cell) {
                i += 2;
                columns++;
            }
            if (operations[i].text !== CONTROL_CHARACTERS.Table && (isNullOrUndefined(operations[i + 1]) || operations[i + 1].text === CONTROL_CHARACTERS.Row)) {
                break;
            }
        }
        this.documentEditor.editorModule.insertTable(rows, columns);
        this.documentEditor.editorModule.revisionData = undefined;
    }
    private buildRow(operations: Operation[]): void {
        let rowData: any;
        let cellDatas: any[] = [];
        let paragraphDatas: any[] = [];
        let characterDatas: any[] = [];
        let cellCount: number = 0;
        let insertRow: number = 0;
        let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(operations[0].offset, false, true, false);
        let tableWidget: TableWidget = (data.rowWidget as TableRowWidget).ownerTable.combineWidget(this.documentEditor.viewer) as TableWidget;
        if (!isNullOrUndefined(operations[0].markerData)) {
            if (isNullOrUndefined(operations[0].format)) {
                let row: TableRowWidget = data.rowWidget as TableRowWidget;
                if (row.rowFormat.revisions.length > 0) {
                    let revision: Revision = row.rowFormat.revisions[0];
                    revision.accept();
                    return;
                }
            }
        }
        for (let i: number = 0; i < operations.length; i++) {
            let operation: Operation = operations[i];
            if (operation.text === CONTROL_CHARACTERS.Cell) {
                cellCount++;
                cellDatas.push(JSON.parse(operation.format));
                paragraphDatas.push(JSON.parse(operations[i + 1].format));
                characterDatas.push(JSON.parse(operations[i + 2].format));
                i += 2;
            }
            if (isNullOrUndefined(operations[i + 1]) || operations[i + 1].text === CONTROL_CHARACTERS.Row) {
                break;
            }
        }
        for (let i: number = 0; i < operations.length; i++) {
            if (operations[i].text === CONTROL_CHARACTERS.Row) {
                if (!isNullOrUndefined(operations[i].markerData)) {
                    if (isNullOrUndefined(this.documentEditor.editorModule.revisionData)) {
                        this.documentEditor.editorModule.revisionData = [];
                    }
                    this.documentEditor.editorModule.revisionData.push(operations[i].markerData);
                }
                insertRow++;
                rowData = JSON.parse(operations[i].format);
            }
        }
        this.documentEditor.editorModule.rowInsertionForCE(data.rowOrCellIndex, cellCount, insertRow, tableWidget, rowData, cellDatas, paragraphDatas, characterDatas);
        cellDatas = [];
        paragraphDatas = [];
        characterDatas = [];
        this.documentEditor.editorModule.revisionData = undefined;
    }
    private buildCell(operation: Operation, paraFormt: string, charFormat: string): void {
        let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(operation.offset, false, false, true);
        if (operation.length > 0) {
            this.rowWidget = data.cellWidget.ownerRow;
            this.documentEditor.editorModule.cellInsertionForCE(data.rowOrCellIndex, this.rowWidget, JSON.parse(operation.format), JSON.parse(paraFormt), JSON.parse(charFormat));
        } else {
            this.documentEditor.documentHelper.owner.parser.parseCellFormat(JSON.parse(operation.format), data.cellWidget.cellFormat, 0);
        }
    }
    private buildDeleteCells(operation: Operation): void {
        let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(operation.offset, false, false, true);
        if (!isNullOrUndefined(data.cellWidget)) {
            const firstPara: ParagraphWidget = this.documentEditor.selectionModule.getFirstParagraph(data.cellWidget);
            const lastPara: ParagraphWidget = this.documentEditor.selectionModule.getLastParagraph(data.cellWidget);
            if (!isNullOrUndefined(firstPara) && !isNullOrUndefined(lastPara)) {
                this.documentEditor.selectionModule.start.setPosition(firstPara.firstChild as LineWidget, true);
                this.documentEditor.selectionModule.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
            }
            this.documentEditor.editorModule.checkAndRemoveComments();
            this.table = data.cellWidget.ownerTable.combineWidget(this.documentEditor.viewer) as TableWidget;
            let paragraph: ParagraphWidget = undefined;
            if (data.cellWidget.nextWidget) {
                let nextCell: TableCellWidget = data.cellWidget.nextWidget as TableCellWidget;
                paragraph = this.documentEditor.selectionModule.getFirstParagraph(nextCell);
            } else if (data.cellWidget.previousWidget) {
                let previousCell: TableCellWidget = data.cellWidget.previousWidget as TableCellWidget;
                paragraph = this.documentEditor.selectionModule.getFirstParagraph(previousCell);
            }
            if (isNullOrUndefined(paragraph)) {
                paragraph = this.documentEditor.editorModule.getParagraphForSelection(this.table);
            }
            operation.length += this.documentEditor.editorModule.onDeleteColumn(this.table, [data.cellWidget]);
            this.table.updateRowIndex(0);
            this.documentEditor.selectionModule.selectParagraphInternal(paragraph, true);
        }
    }
    private transformSelectionOperation(operation: Operation, conflictingOperation: Operation): void {
        if (operation.action === 'Delete'  && (conflictingOperation.action === 'Delete' || conflictingOperation.action == 'Format')) {
            let previousStart: number = conflictingOperation.offset;
            let conflictingSelection: Operation = conflictingOperation;
            // Case 1: No overlap, no conflict
            if ((operation.offset + operation.length) <= conflictingSelection.offset || operation.offset >= (conflictingSelection.offset + conflictingSelection.length)) {
                return;
            }
            // Case 2: Local selection is completely within the conflicting selection
            if (operation.offset >= conflictingSelection.offset && (operation.offset + operation.length) <= (conflictingSelection.offset + conflictingSelection.length)) {
                conflictingOperation.offset = conflictingOperation.offset;
                conflictingOperation.length -= operation.length;
                if (conflictingOperation.length <= 0) {
                    conflictingOperation.skipOperation = true;
                }
                return;
            }
            // Case 3: Local selection overlaps from the left side
            if (operation.offset < conflictingSelection.offset && (operation.offset + operation.length) <= (conflictingSelection.offset + conflictingSelection.length)) {
                conflictingOperation.offset = operation.offset + operation.length;
                conflictingOperation.length -= conflictingOperation.offset - previousStart;

                //return transformedOperation;
                return;
            }
            // Case 4: Local selection overlaps from the right side
            if (operation.offset >= conflictingSelection.offset && (operation.offset + operation.length) > (conflictingSelection.offset + conflictingSelection.length)) {
                conflictingOperation.length -= (conflictingOperation.offset + conflictingOperation.length) - operation.offset;
                return;
            }
            // Case 5: Local selection fully encompasses the conflicting selection
            if (operation.offset < conflictingSelection.offset && (operation.offset + operation.length) > (conflictingSelection.offset + conflictingSelection.length)) {
                conflictingSelection.offset = operation.offset;
                conflictingSelection.length = 0;
                conflictingOperation.skipOperation = true;
                return;
            }
        }
    }
    private documentSettings(operation: Operation): void {
        this.documentEditor.skipSettingsOps = true;
        switch (operation.text) {
            case 'enableTrackChanges':
                this.documentEditor.enableTrackChanges = operation.enableTrackChanges;
                break;
            case 'protection':
                this.documentEditor.documentHelper.restrictEditingPane.showHideRestrictPane(true);
                if (!isNullOrUndefined(operation.protectionData.saltValue)) {
                    if (operation.protectionData.hashValue === '' && operation.protectionData.saltValue === '') {
                        this.documentEditor.editorModule.protectDocument(operation.protectionData.protectionType);
                    }
                    else {
                        this.documentEditor.editorModule.enforceProtectionAssign(operation.protectionData.saltValue, operation.protectionData.hashValue, operation.protectionData.protectionType);
                    }
                }
                else {
                    if (isNullOrUndefined(operation.protectionData.hashValue)) {
                        this.documentEditor.editorModule.unProtectDocument();
                    }
                    else {
                        this.documentEditor.editorModule.validateHashValue(operation.protectionData.hashValue);
                    }
                }
                break;
        }
    }
    private checkAndRetriveChangesFromServer(): void {
        if (!this.isSyncServerChanges) {
            let action: ActionInfo = {
                version: this.version,
                connectionId: this.connectionId,
                roomName: this.roomName,
            }
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('Post', this.serviceUrl + 'GetActionsFromServer', true);
            httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            this.setCustomAjaxHeaders(httpRequest);
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200 || httpRequest.status === 304) {
                        this.applyChangesFromServer(httpRequest.responseText);
                    }
                    else {
                        alert('Fail to load the document');
                    }
                }
            };
            httpRequest.send(JSON.stringify(action));
            this.isSyncServerChanges = true;
        }
    }
    private applyChangesFromServer(data: string): void {
        let dataObject: ActionInfo[] = JSON.parse(data);
        if (dataObject.length > 0) {
            for (let i: number = 0; i < dataObject.length; i++) {
                let data: ActionInfo = dataObject[i]
                if (data.connectionId === this.connectionId) {
                    this.acknowledgementReceived();
                    this.logMessage(this.isSyncServerChanges ? 'SignalR Server sync' + data.version : 'SignalR Same user sync:' + data.version);
                } else {
                    this.handleRemoteOperation(data);
                    this.logMessage('Received: ' + JSON.stringify(JSON.stringify(data)));
                }
                this.updateVersion(data.version);
                this.logMessage('Server sync ack:' + data.version);
            }
            this.updateVersion(dataObject[dataObject.length - 1].version);
        }
        this.isSyncServerChanges = false;
        if (!this.isAcknowledgePending()) {
            this.acknowledgementReceived();
        }
        this.sendLocalOperation()
    }
    private insertCharaterFormat(type: string, characterData: string): void {
        let format: WCharacterFormat = new WCharacterFormat(undefined);
        let characterFormat: any = JSON.parse(characterData);
        let keys = Object.keys(characterFormat);
        this.documentEditor.documentHelper.owner.parser.parseCharacterFormat(0, characterFormat, format);
        if (keys.length > 1) {
            this.documentEditor.documentHelper.owner.fontDialogModule.onCharacterFormat(this.documentEditor.selectionModule, format);
            this.documentEditor.editorModule.onApplyCharacterFormat('CharacterFormat', format);
        } else if (keys.length === 1) {
            if (keys.indexOf('styleName') !== -1) {
                if (isNullOrUndefined(characterFormat.styleName)) {
                    this.documentEditor.editorModule.onApplyCharacterFormat('styleName', null, false, true);
                } else {
                    this.documentEditor.editorModule.applyStyle(characterFormat.styleName);
                }
            } else if (keys.indexOf('Uppercase') !== -1 || keys.indexOf('Lowercase') !== -1 || keys.indexOf('SentenceCase') !== -1 || keys.indexOf('ToggleCase') !== -1 || keys.indexOf('CapitalizeEachWord') !== -1) {
                this.documentEditor.editorModule.changeCase(keys[0]);
            } else {
                if (type === 'increment' || type === 'decrement') {
                    this.documentEditor.editorModule.onApplyCharacterFormat(keys[0], type, true);
                } else {
                    this.documentEditor.editorModule.onApplyCharacterFormat(keys[0], characterFormat[keys[0]]);
                }
            }
        } else {
            this.documentEditor.editorModule.clearFormatting();
        }
    }

    private insertParagraphFormat(operation: Operation, paragraphData: string): void {
        let format: WParagraphFormat = new WParagraphFormat(undefined);
        let paragraphFormat: any = JSON.parse(paragraphData);
        let update: boolean = false;
        if (!isNullOrUndefined(paragraphFormat.isFirstParaForList)) {
            delete paragraphFormat.isFirstParaForList;
            update = true;
        }
        let keys = Object.keys(paragraphFormat);
        this.documentEditor.documentHelper.owner.parser.parseParagraphFormat(0, paragraphFormat, format);
        if (keys.length === 1) {
            if (keys.indexOf('styleName') !== -1) {
                this.documentEditor.editorModule.applyStyle(paragraphFormat.styleName);
            } else {
                if (keys[0] === 'borders') {
                    this.documentEditor.editorModule.onApplyParagraphFormat(keys[0], format.borders, false, false);
                } else if (keys[0] === 'listFormat') {
                    this.updateList(operation, format);
                    let list: WList = this.documentEditor.documentHelper.getListById(paragraphFormat.listFormat.nsid, true);
                    if (!isNullOrUndefined(list)) {
                        format.listFormat.listId = list.listId;
                        format.listFormat.list = list;
                    }
                    this.documentEditor.editorModule.onApplyParagraphFormat('listFormat', format.listFormat, false, false);
                } else {
                    this.documentEditor.editorModule.onApplyParagraphFormat(keys[0], paragraphFormat[keys[0]], update, false);
                }
            }
        } else {
            this.documentEditor.documentHelper.owner.paragraphDialogModule.onParagraphFormat(format);
        }
    }
    private insertTableFormat(type: string, tableData: string, offset: number) {
        let format: WTableFormat = new WTableFormat(undefined);
        let tableFormat: any = JSON.parse(tableData);
        let keys = Object.keys(tableFormat);
        this.documentEditor.documentHelper.owner.parser.parseTableFormat(tableFormat, format, 0);
        let data: AbsoluteParagraphInfo = this.getRelativePositionFromAbsolutePosition(offset, true, false, false);
        let sourceTable: TableWidget = data.tableWidget;
        if (!isNullOrUndefined(type)) {
            let typeValue = type === 'TableAutoFitToContents' ? 'FitToContents' : type === 'TableAutoFitToWindow' ? 'FitToWindow' : 'FixedColumnWidth';
            this.documentEditor.editorModule.insertAutoFitTable(typeValue as AutoFitType, sourceTable);
            return;
        }
        if (keys.length === 1) {
            this.documentEditor.editorModule.onApplyTableFormat(keys[0], tableFormat[keys[0]], sourceTable);
        } else {
            if (keys.indexOf('borders') !== -1 || keys.indexOf('shading') !== -1) {
                this.documentEditor.editorModule.isBordersAndShadingDialog = true;
                this.documentEditor.editorModule.onTableFormat(format, true, sourceTable);
                this.documentEditor.editorModule.isBordersAndShadingDialog = false;
            } else if (keys.indexOf('cellSpacing') !== -1 || keys.indexOf('leftMargin') !== -1 || keys.indexOf('topMargin') !== -1 || keys.indexOf('rightMargin') !== -1 || keys.indexOf('bottomMargin') !== -1) {
                this.documentEditor.documentHelper.owner.tableOptionsDialogModule.applySubTableOptions(format, sourceTable);
            } else {
                this.documentEditor.editorModule.onTableFormat(format, false, sourceTable);
            }
        }
    }

    private insertRowFormat(property: string, rowData: string): void {
        let format: WRowFormat = new WRowFormat(undefined);
        let rowFormat: any = JSON.parse(rowData);
        let keys = Object.keys(rowFormat);
        this.documentEditor.documentHelper.owner.parser.parseRowFormat(rowFormat, format, 0);
        if (keys.length === 1) {
            this.documentEditor.editorModule.onApplyTableRowFormat(keys[0], rowFormat[keys[0]]);
        } else {
            this.documentEditor.editorModule.onRowFormat(format);
        }
    }

    private insertCellFormat(cellData: string): void {
        if (!this.documentEditor.selectionModule.start.paragraph.isInsideTable) {
            return;
        }
        let format: WCellFormat = new WCellFormat(undefined);
        let formatCell: any = JSON.parse(cellData);
        let keys = Object.keys(formatCell);
        this.documentEditor.documentHelper.owner.parser.parseCellFormat(formatCell, format, 0);
        let cellFormat: WCellFormat = this.documentEditor.selectionModule.start.paragraph.associatedCell.cellFormat;
        if (keys.length === 1) {
            if (keys[0] === 'shading') {
                this.documentEditor.editorModule.applyCellPropertyValue(this.documentEditor.selectionModule, keys[0], format.shading, cellFormat);
            } else if (keys[0] === 'borders') {
                this.documentEditor.editorModule.applyCellPropertyValue(this.documentEditor.selectionModule, keys[0], format.borders, cellFormat);
            } else {
                this.documentEditor.editorModule.applyCellPropertyValue(this.documentEditor.selectionModule, keys[0], formatCell[keys[0]], cellFormat);
            }
            this.rowWidget = this.documentEditor.selectionModule.start.paragraph.associatedCell.ownerRow;
        } else {
            if (keys.indexOf('preferredWidth') !== -1 || keys.indexOf('preferredWidthType') !== -1 || keys.indexOf('verticalAlignment') !== -1 || keys.indexOf('borders') !== -1 || keys.indexOf('shading') !== -1) {
                if (keys.indexOf('borders') !== -1 || keys.indexOf('shading') !== -1) {
                    this.documentEditor.editorModule.isBordersAndShadingDialog = true;
                }
                this.documentEditor.editorModule.applyCellPropertyValue(this.documentEditor.selectionModule, undefined, format, cellFormat);
                this.rowWidget = this.documentEditor.selectionModule.start.paragraph.associatedCell.ownerRow;
                this.documentEditor.editorModule.isBordersAndShadingDialog = false;
            } else {
                this.documentEditor.documentHelper.owner.cellOptionsDialogModule.applySubCellOptions(format);
            }
        }
    }
    private insertSectionFormat(property: string, sectionData: string) {
        let data: object = JSON.parse(sectionData);
        let keys = Object.keys(data);
        if (keys[0] === 'linkToPrevious') {
            const headerFooterWidget: HeaderFooterWidget = this.documentEditor.selectionModule.start.paragraph.bodyWidget as HeaderFooterWidget;
            let sectionIndex: number = headerFooterWidget.sectionIndex;
            let headerFooterType: HeaderFooterType = headerFooterWidget.headerFooterType;
            this.documentEditor.editorModule.removeInlineHeaderFooterWidget(sectionIndex, headerFooterType, property, data['linkToPrevious']);
        } else if (keys.length > 1) {
            let sectionFormat: WSectionFormat = new WSectionFormat();
            this.documentEditor.documentHelper.owner.parser.parseSectionFormat(0, data, sectionFormat);
            this.documentEditor.editorModule.onApplySectionFormat(undefined, sectionFormat);
        } else {
            this.documentEditor.editorModule.onApplySectionFormat(Object.keys(data)[0], data[Object.keys(data)[0]]);
        }
    }

    private logMessage(event: string): void {
        if (this.logEventEnabled) {
            this.message += event + ' ' + '\n';
        }
    }
    private setCustomAjaxHeaders(xmlHttpRequest: XMLHttpRequest): void {
        for (let i: number = 0; i < this.documentEditor.headers.length; i++) {
            const header: Object = this.documentEditor.headers[i];
            for (const key of Object.keys(header)) {
                xmlHttpRequest.setRequestHeader(key, header[key]);
            }
        }
    }
    /**
     * Destory collaborative editing module.
     * @private
     */
    public destroy(): void {
        this.version = undefined;
        this.documentEditor = undefined;
        this.roomName = undefined;
        this.userMap = undefined;
        this.connectionId = undefined;
        this.acknowledgmentPending = undefined;
        this.pendingOps = undefined;
        this.serviceUrl = undefined;
        this.isSyncServerChanges = undefined;
        this.message = undefined;
        this.rowWidget = undefined;
    }
}

/**
 * Specifies the action info.
 * > Reserved for internal use only.
 */
export interface ActionInfo {
    /**
     * Reserved for internal use only.
     */
    connectionId?: string,
    /**
     * Reserved for internal use only.
     */
    version?: number,
    /**
     * Reserved for internal use only.
     */
    roomName?: string,
    /**
     * Reserved for internal use only.
     */
    operations?: Operation[],
    /**
     * Reserved for internal use only.
     */
    currentUser?: string
}

/**
 * @private
 */
class CaretInfo {
    /**
     * @private
     */
    public color: string;
    /**
     * @private
     */
    public caret: HTMLElement;
    /**
     * @private
     */
    public offset: number;
    /**
     * @private
     */
    public userName: string;

    private hoverDiv: HTMLElement;
    private userViewContainer: HTMLElement;
    private spanViewContainer: HTMLElement;
    private spanView: HTMLSpanElement;

    constructor(color: string, caret: HTMLElement, offset: number, userName: string) {
        this.color = color;
        this.caret = caret;
        this.offset = offset;
        this.userName = userName;
        this.initializeElement();
    }

    /**
     * @private
     */
    public initializeElement(): void {
        this.hoverDiv = createElement('div', { className: 'e-de-user-info e-de-user-name-collapse', styles: 'z-index: 1; visibility: hidden;left:-4px;position:absolute;width:20px;height:20px;pointer-events:all;' });
        this.userViewContainer = createElement('div');
        this.spanViewContainer = createElement('div', { styles: 'background-color:' + this.color + ';left: 0px; top: 15px; visibility: visible;' });
        this.spanView = createElement('span', { styles: 'background-color:' + this.color + '; left: 0px;top:-4px;pointer:default' });
        this.spanViewContainer.appendChild(this.spanView);
        this.userViewContainer.appendChild(this.spanViewContainer);
        this.hoverDiv.appendChild(this.userViewContainer);
        this.caret.appendChild(this.hoverDiv);
        this.hoverDiv.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.hoverDiv.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    }

    private onMouseEnter(): void {
        this.hoverDiv.classList.remove('e-de-user-name-collapse');
        this.hoverDiv.classList.add('e-de-user-name-expended');
        this.spanView.innerText = this.userName;
    }

    private onMouseLeave(): void {
        this.hoverDiv.classList.add('e-de-user-name-collapse');
        this.hoverDiv.classList.remove('e-de-user-name-expended');
        this.spanView.innerText = '';
    }

}

/**
 * @private
 */
interface UserPositionInfo {
    [key: string]: CaretInfo
}
