/* eslint-disable */
import { LayoutViewer } from '../index';
import { Selection } from '../index';
import { TextPosition, ImageInfo } from '../selection/selection-helper';
import {
    IWidget, ParagraphWidget, LineWidget, ElementBox, TextElementBox, Margin, Page, ImageElementBox,
    BlockWidget, BlockContainer, BodyWidget, TableWidget, TableCellWidget, TableRowWidget, Widget, ListTextElementBox,
    BookmarkElementBox, HeaderFooterWidget, FieldTextElementBox, TabElementBox, EditRangeStartElementBox, EditRangeEndElementBox,
    CommentElementBox, CommentCharacterElementBox, CheckBoxFormField, DropDownFormField, TextFormField, FormField, ShapeElementBox,
    TextFrame, ContentControl, FootnoteElementBox, FootNoteWidget, ShapeBase
} from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import {
    ElementInfo, HelperMethods, CellInfo, HyperlinkTextInfo,
    ParagraphInfo, LineInfo, IndexInfo, BlockInfo, CellCountInfo, PositionInfo, Base64,
    TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, RevisionMatchedInfo, FootNoteWidgetsInfo
} from './editor-helper';
import { isNullOrUndefined, Browser, classList, L10n } from '@syncfusion/ej2-base';
import {
    WParagraphFormat, WSectionFormat, WListFormat,
    WTableFormat, WRowFormat, WCellFormat, WStyle,
    WBorder, WBorders, WShading, WTabStop
} from '../index';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { FieldElementBox } from '../viewer/page';
import {
    HighlightColor, BaselineAlignment, Strikethrough, Underline,
    LineSpacingType, TextAlignment, ListLevelPattern, RowPlacement, ColumnPlacement,
    FollowCharacterType, HeaderFooterType, TrackChangeEventArgs
} from '../../base/index';
import { SelectionCharacterFormat } from '../index';
import { Action } from '../../index';
import { PageLayoutViewer, SfdtReader } from '../index';
import { WCharacterStyle } from '../format/style';
import { EditorHistory, HistoryInfo } from '../editor-history/index';
import { BaseHistoryInfo } from '../editor-history/base-history-info';
import { TableResizer } from './table-resizer';
import { Dictionary } from '../../base/dictionary';
import { WParagraphStyle } from '../format/style';
import {
    TableAlignment, WidthType, HeightType, CellVerticalAlignment, BorderType, LineStyle,
    TabLeader, OutlineLevel, AutoFitType, ProtectionType, PasteOptions, TablePasteOptions, FormFieldType, TextFormFieldType, RevisionType,
    FootEndNoteNumberFormat, FootnoteRestartIndex
} from '../../base/types';
import { DocumentEditor } from '../../document-editor';
import { showSpinner, hideSpinner, Dialog } from '@syncfusion/ej2-popups';
import { DialogUtility } from '@syncfusion/ej2-popups';
import { DocumentHelper, Layout } from '../viewer';
import { Revision } from '../track-changes/track-changes';
import { XmlHttpRequestHandler } from '../../base/ajax-helper';
import { CommentActionEventArgs, beforeCommentActionEvent, trackChangeEvent } from '../../base/index';
import { CommentView } from '../comments';

/**
 * Editor module
 */
export class Editor {
    public documentHelper: DocumentHelper;
    private nodes: IWidget[] = [];
    private editHyperlinkInternal: boolean = false;
    private startOffset: number;
    private startParagraph: ParagraphWidget = undefined;
    private endOffset: number;
    private pasteRequestHandler: XmlHttpRequestHandler;
    private endParagraph: ParagraphWidget = undefined;
    private removeEditRange: boolean = false;
    private currentProtectionType: ProtectionType;
    private alertDialog: Dialog;
    private formFieldCounter: number = 1;
    private skipFieldDeleteTracking: boolean = false;
    private isForHyperlinkFormat: boolean = false;
    private isTrackingFormField: boolean = false;
    private isCmtDeleteStarted: boolean = false;
    private removeCommentCharacters: CommentCharacterElementBox[] = [];
    private previousBlockToLayout: BlockWidget;
    /**
     * @private
     */
    public isRemoveRevision: boolean = false;
    /**
     * @private
     */
    public isHandledComplex: boolean = false;
    /**
     * @private
     */
    public isUserInsert: boolean = false;
    /**
     * @private
     */
    public tableResize: TableResizer = undefined;
    /**
     * @private
     */
    public tocStyles: TocLevelSettings = {};
    /**
     * @private
     */
    public chartType: boolean = false;

    private refListNumber: number = undefined;
    private incrementListNumber: number = -1;
    private removedBookmarkElements: BookmarkElementBox[] = [];
    /**
     * @private
     */
    public tocBookmarkId: number = 0;
    /**
     * @private
     */
    public copiedData: string = undefined;

    private animationTimer: number;
    private pageRefFields: PageRefFields = {};
    private delBlockContinue: boolean = false;
    private delBlock: Widget = undefined;
    private delSection: BodyWidget = undefined;
    /**
     * @private
     */
    public isInsertingTOC: boolean = false;
    private editStartRangeCollection: EditRangeStartElementBox[] = [];
    private skipReplace: boolean = false;
    private skipTableElements: boolean = false;
    private removedTextNodes: IWidget[];
    /**
     * @private
     */
    public listNumberFormat: string = '';
    /**
     * @private
     */
    public listLevelPattern: ListLevelPattern;
    /**
     * @private
     */
    public listLevelNumber: number = 0;
    /**
     * @private
     */
    public isXmlMapped: boolean = false;
    /**
     * @private
     * @returns {boolean} - Returns the restrict formatting
     */
    public get restrictFormatting(): boolean {
        return this.documentHelper.isDocumentProtected && (this.documentHelper.restrictFormatting
            || (!this.documentHelper.restrictFormatting && !this.selection.isSelectionInEditRegion()));
    }

    /**
     * @private
     * @returns {boolean} - Returns the restrict editing
     */
    public get restrictEditing(): boolean {
        return this.documentHelper.isDocumentProtected && (this.documentHelper.protectionType === 'ReadOnly'
            && !this.selection.isSelectionInEditRegion() || this.documentHelper.protectionType === 'FormFieldsOnly');
    }
    /**
     * @private
     * @returns {boolean} - Returns the can edit content control.
     */
    public get canEditContentControl(): boolean {
        if (this.owner.isReadOnlyMode) {
            return false;
        }
        if (this.selection.checkContentControlLocked()) {
            return false;
        }
        return true;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public copiedContent: any = '';
    private copiedTextContent: string = '';
    private previousParaFormat: WParagraphFormat = undefined;
    private previousCharFormat: WCharacterFormat = undefined;
    private previousSectionFormat: WSectionFormat = undefined;
    private currentPasteOptions: PasteOptions;
    private pasteTextPosition: PositionInfo = undefined;
    public isSkipHistory: boolean = false;
    public isPaste: boolean = false;
    public isPasteListUpdated: boolean = false;
    public base64: Base64;
    /**
     * @private
     */
    public isInsertField: boolean = false;

    /**
     * Initialize the editor module
     *
     * @param {DocumentHelper} documentHelper - Document helper
     * @private
     */
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        this.tableResize = new TableResizer(this.documentHelper.owner);
        this.base64 = new Base64();
    }
    private get viewer(): LayoutViewer {
        if (!isNullOrUndefined(this.owner)) {
            return this.owner.viewer;
        }
        return undefined;
    }
    private get editorHistory(): EditorHistory {
        return this.documentHelper.owner.editorHistory;
    }
    /**
     * @private
     */
    public isBordersAndShadingDialog: boolean = false;
    private get selection(): Selection {
        if (this.documentHelper) {
            return this.documentHelper.selection;
        }
        return undefined;
    }

    private get owner(): DocumentEditor {
        return this.documentHelper.owner;
    }
    private getModuleName(): string {
        return 'Editor';
    }

    /**
     * Inserts the specified field at cursor position
     *
     * @param {string} code - Specify the field code
     * @param {string} result - Specify the field result
     * @returns {void}
     */
    public insertField(code: string, result?: string): void {
        this.isInsertField = true;
        let fieldCode: string = code;
        if (isNullOrUndefined(result)) {
            fieldCode = HelperMethods.trimStart(fieldCode);
            if (fieldCode.substring(0, 10) === 'MERGEFIELD') {
                fieldCode = fieldCode.substring(10).trim();
                const index: number = fieldCode.indexOf('\\*');
                result = '«' + fieldCode.substring(0, index).trim() + '»';
            }
        }
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const insertFormat: WCharacterFormat = new WCharacterFormat();
        const selectionFormat: WCharacterFormat = this.copyInsertFormat(insertFormat, false);
        const line: LineWidget = new LineWidget(paragraph);
        const fieldBegin: FieldElementBox = new FieldElementBox(0);
        fieldBegin.characterFormat.mergeFormat(selectionFormat);
        line.children.push(fieldBegin);
        const fieldCodeSpan: TextElementBox = new TextElementBox();
        fieldCodeSpan.text = code;
        line.children.push(fieldCodeSpan);
        const fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldBegin.fieldSeparator = fieldSeparator;
        line.children.push(fieldSeparator);
        const fieldResultSpan: TextElementBox = new TextElementBox();
        fieldResultSpan.text = result;
        fieldResultSpan.characterFormat.mergeFormat(selectionFormat);
        line.children.push(fieldResultSpan);
        const fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.characterFormat.mergeFormat(selectionFormat);
        fieldEnd.fieldSeparator = fieldSeparator;
        fieldEnd.fieldBegin = fieldBegin;
        fieldBegin.fieldEnd = fieldEnd;
        fieldSeparator.fieldEnd = fieldEnd;
        line.children.push(fieldEnd);
        fieldBegin.line = line;
        paragraph.childWidgets.push(line);
        this.documentHelper.fields.push(fieldBegin);
        const section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat(section);
        section.childWidgets.push(paragraph);
        this.pasteContentsInternal([section], false);
        this.isInsertField = false;
    }

    /**
     * To update style for paragraph
     *
     * @param {string} style - style name
     * @param {boolean} clearDirectFormatting - Removes manual formatting (formatting not applied using a style)
     * from the selected text, to match the formatting of the applied style. Default value is false.
     * @returns {void}
     */
    public applyStyle(style: string, clearDirectFormatting?: boolean): void {
        clearDirectFormatting = isNullOrUndefined(clearDirectFormatting) ? false : clearDirectFormatting;
        let startPosition: number = undefined;
        let endPosition: number = undefined;
        if (clearDirectFormatting) {
            this.initComplexHistory('ApplyStyle');
            this.setOffsetValue(this.selection);
            startPosition = this.startOffset;
            endPosition = this.endOffset;
            const isSelectionEmpty: boolean = this.selection.isEmpty;
            this.clearFormatting();
            if (isSelectionEmpty && !this.selection.isEmpty) {
                this.selection.end.setPositionInternal(this.selection.start);
            }
        }
        const styleObj: Object = this.documentHelper.styles.findByName(style);
        if (styleObj !== undefined) {
            this.onApplyParagraphFormat('styleName', styleObj, false, true);
        } else {
            /* eslint-disable-next-line max-len */
            this.documentHelper.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), JSON.parse(this.documentHelper.preDefinedStyles.get(style)), this.documentHelper.styles);
            this.applyStyle(style);
        }
        if (this.editorHistory && this.editorHistory.currentHistoryInfo && this.editorHistory.currentHistoryInfo.action === 'ApplyStyle') {
            this.startOffset = startPosition;
            this.endOffset = endPosition;
            this.editorHistory.updateComplexHistory();
        }
        this.startParagraph = undefined;
        this.endParagraph = undefined;
    }
    // Public Implementation Starts
    /**
     * Moves the selected content in the document editor control to clipboard.
     *
     * @returns {void}
     */
    public cut(): void {
        if (this.owner.isReadOnlyMode || this.selection.isEmpty || !this.canEditContentControl) {
            return;
        }
        this.selection.copySelectedContent(true);
        this.documentHelper.owner.parser.isCutPerformed = true;
    }
    /**
     * Insert editing region where everyone can edit.
     *
     * @returns {void}
     */
    public insertEditingRegion(): void;
    /**
     * Insert editing region where mentioned user can edit.
     *
     * @returns {void}
     */
    public insertEditingRegion(user: string): void
    /**
     * Insert editing region in current selection range.
     *
     * @param {string} user - Specified the native rendering
     * @returns {void}
     */
    public insertEditingRegion(user?: string): void {
        this.insertEditRangeElement(user && user !== '' ? user : 'Everyone');
    }
    /**
     * Enforce document protection by protection type.
     *
     * @returns {void}
     */
    public enforceProtection(credential: string, protectionType: ProtectionType): void;
    /**
     * Enforce document protection.
     *
     * @returns {void}
     */
    public enforceProtection(credential: string, limitToFormatting: boolean, isReadOnly: boolean): void;

    public enforceProtection(credential: string, restrictFormatType: boolean | ProtectionType, isReadOnly?: boolean): void {
        let typeOfProtection: ProtectionType;
        let limitToFormatting: boolean;
        if (typeof (restrictFormatType) === 'boolean') {
            typeOfProtection = isReadOnly ? 'ReadOnly' : this.documentHelper.protectionType;
            limitToFormatting = restrictFormatType;
        } else {
            limitToFormatting = true;
            typeOfProtection = restrictFormatType;
        }
        this.documentHelper.restrictFormatting = limitToFormatting;
        this.documentHelper.protectionType = typeOfProtection;
        this.selection.isHighlightEditRegion = true;
        this.addProtection(credential, this.documentHelper.protectionType);
    }
    private getCommentHierarchicalIndex(comment: CommentElementBox): string {
        let index: string = '';
        while (comment.ownerComment) {
            if (!isNullOrUndefined(comment.ownerComment)) {
                index = comment.ownerComment.replyComments.indexOf(comment) + ';' + index;
                comment = comment.ownerComment;
            } else {
                index = comment.replyComments.indexOf(comment) + ';' + index;
                comment = comment;
            }
        }
        index = 'C;' + this.documentHelper.comments.indexOf(comment) + ';' + index;
        return index;
    }

    private alertBox(): void {
        const localObj: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        localObj.setLocale(this.owner.locale);
        DialogUtility.alert(localObj.getConstant('Multiple Comment'));
    }

    /**
     * Insert comment
     *
     * @param {string} text - comment text.
     * @returns {void}
     */
    // Comment implementation starts
    public insertComment(text?: string): void {
        if (isNullOrUndefined(this.selection.start) || this.owner.isReadOnlyMode || this.viewer.owner.enableHeaderAndFooter
            || !this.viewer.owner.enableComment) {
            return;
        }
        if (this.viewer.owner.commentReviewPane.commentPane.isEditMode) {
            return this.alertBox();
        }
        if (isNullOrUndefined(text)) {
            text = '';
        }
        this.insertCommentInternal(text);
    }

    private insertCommentInternal(text: string): void {
        if (this.selection.isEmpty) {
            // If selection is at paragraph end, move selection to previous word similar to MS Word
            if (this.selection.start.isAtSamePosition(this.selection.end) && this.selection.start.isAtParagraphEnd) {
                const startOffset: number = this.selection.start.offset;
                this.selection.start.offset = startOffset - 1 !== -1 ? startOffset - 1 : startOffset;
            }
            this.selection.selectCurrentWord();
            // If paragraph mark selected, remove paragraph mark selection
            if (this.selection.isParagraphLastLine(this.selection.end.currentWidget)
                && this.selection.end.offset === this.selection.getLineLength(this.selection.end.currentWidget) + 1) {
                this.selection.end.offset -= 1;
            }
        }
        const paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
        const startIndex: string = this.selection.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        const endParagraphInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.end);
        const endIndex: string = this.selection.getHierarchicalIndex(endParagraphInfo.paragraph, endParagraphInfo.offset.toString());
        this.initComplexHistory('InsertComment');
        let startPosition: TextPosition = this.selection.start;
        let endPosition: TextPosition = this.selection.end;
        const position: TextPosition = new TextPosition(this.owner);
        if (!this.selection.isForward) {
            startPosition = this.selection.end;
            endPosition = this.selection.start;
        }
        // Clones the end position.
        position.setPositionInternal(endPosition);

        const commentRangeStart: CommentCharacterElementBox = new CommentCharacterElementBox(0);
        const commentRangeEnd: CommentCharacterElementBox = new CommentCharacterElementBox(1);
        const isAtSameParagraph: boolean = startPosition.isInSameParagraphIndex(endPosition);
        // Adds comment start at selection start position.
        endPosition.setPositionInternal(startPosition);
        this.initInsertInline(commentRangeStart);
        if (isNullOrUndefined(position.paragraph)) {
            const endIndex: string = this.selection.getHierarchicalIndex(endParagraphInfo.paragraph, endParagraphInfo.offset.toString());
            const endPos: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(endIndex);
            position.setPositionInternal(endPos);
        }
        // Updates the cloned position, since comment start is added in the same paragraph.
        if (isAtSameParagraph) {
            position.setPositionParagraph(position.currentWidget, position.offset + commentRangeStart.length);
        }
        // Adds comment end and comment at selection end position.
        startPosition.setPositionInternal(position);
        endPosition.setPositionInternal(position);
        this.initInsertInline(commentRangeEnd);
        const commentAdv: CommentElementBox = new CommentElementBox(new Date().toISOString());
        if (this.owner.editorHistory) {
            this.initHistory('InsertCommentWidget');
            this.owner.editorHistory.currentBaseHistoryInfo.removedNodes.push(commentAdv);
        }

        commentAdv.author = this.owner.currentUser ? this.owner.currentUser : 'Guest user';
        commentAdv.initial = this.constructCommentInitial(commentAdv.author);
        commentAdv.text = text;
        commentAdv.commentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        commentRangeStart.comment = commentAdv;
        commentRangeStart.commentId = commentAdv.commentId;
        commentRangeEnd.comment = commentAdv;
        commentRangeEnd.commentId = commentAdv.commentId;
        commentAdv.commentStart = commentRangeStart;
        commentAdv.commentEnd = commentRangeEnd;
        this.addCommentWidget(commentAdv, true, true, true);
        if (this.editorHistory) {
            this.editorHistory.currentBaseHistoryInfo.insertPosition = this.getCommentHierarchicalIndex(commentAdv);
            this.editorHistory.updateHistory();
        }


        // this.selection.selectPosition(this.selection.getTextPosBasedOnLogicalIndex(startIndex), this.selection.getTextPosBasedOnLogicalIndex(endIndex));
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistory();
        }
        this.reLayout(this.selection, false);
        if (!this.isUserInsert) {
            const comment: CommentView = this.owner.commentReviewPane.commentPane.comments.get(commentAdv);
            comment.postComment();
        }
    }

    /**
     * Delete all the comments in current document
     *
     * @returns {void}
     */
    public deleteAllComments(): void {
        if (this.documentHelper.comments.length === 0) {
            return;
        }

        // this.documentHelper.clearSearchHighlight();
        this.initComplexHistory('DeleteAllComments');
        this.owner.isLayoutEnabled = false;
        let historyInfo: HistoryInfo;
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            historyInfo = this.editorHistory.currentHistoryInfo;
        }
        while (this.documentHelper.comments.length > 0) {
            const comment: CommentElementBox = this.documentHelper.comments[0];
            this.initComplexHistory('DeleteComment');
            this.deleteCommentInternal(comment);
            if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
                historyInfo.addModifiedAction(this.editorHistory.currentHistoryInfo);
            }
        }
        this.selection.selectContent(this.owner.documentStart, true);
        if (this.editorHistory) {
            this.editorHistory.currentHistoryInfo = historyInfo;
            this.editorHistory.updateComplexHistory();
        }
    }
    /**
     * Delete current selected comment.
     *
     * @returns {void}
     */
    public deleteComment(): void {
        if (this.owner.isReadOnlyMode || isNullOrUndefined(this.owner) || isNullOrUndefined(this.owner.viewer)
            || isNullOrUndefined(this.owner.documentHelper.currentSelectedComment) || this.owner.enableHeaderAndFooter
            || !this.viewer.owner.enableComment) {
            return;
        }
        this.deleteCommentInternal(this.owner.documentHelper.currentSelectedComment);
    }
    /**
     * @param {CommentElementBox} comment - Specified the comment element box
     * @private
     * @returns {void}
     */
    public deleteCommentInternal(comment: CommentElementBox): void {
        this.isCmtDeleteStarted = true;
        this.initComplexHistory('DeleteComment');
        if (comment) {
            if (comment.replyComments.length > 0) {
                for (let i: number = comment.replyComments.length - 1; i >= 0; i--) {
                    this.deleteCommentInternal(comment.replyComments[i]);
                }
            }
            this.isCmtDeleteStarted = true;
            this.deleteCommentWidgetInternal(comment);
            const commentStart: CommentCharacterElementBox = comment.commentStart;
            const commentEnd: CommentCharacterElementBox = comment.commentEnd;
            this.removeInline(commentEnd);
            this.removeInline(commentStart);
            commentStart.removeCommentMark();
        }
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistory();
        }
        this.isCmtDeleteStarted = false;
    }

    private deleteCommentWidgetInternal(comment: CommentElementBox): void {
        if (this.owner.editorHistory) {
            this.initHistory('DeleteCommentWidget');
            this.owner.editorHistory.currentBaseHistoryInfo.insertPosition = this.getCommentHierarchicalIndex(comment);
            this.owner.editorHistory.currentBaseHistoryInfo.removedNodes.push(comment);
        }
        this.deleteCommentWidget(comment);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
    }

    /**
     * @param {CommentElementBox} comment - Specified the comment element box
     * @private
     * @returns {void}
     */
    public deleteCommentWidget(comment: CommentElementBox): void {

        let commentIndex: number = this.documentHelper.comments.indexOf(comment);
        if (commentIndex !== -1) {
            this.documentHelper.comments.splice(commentIndex, 1);
        } else if (comment.isReply && comment.ownerComment) {
            commentIndex = comment.ownerComment.replyComments.indexOf(comment);
            comment.ownerComment.replyComments.splice(commentIndex, 1);
        }
        if (this.owner.commentReviewPane) {
            this.owner.commentReviewPane.deleteComment(comment);
            if (this.documentHelper.currentSelectedComment === comment) {
                this.documentHelper.currentSelectedComment = undefined;
            }
        }

    }

    /**
     * @param {CommentElementBox} comment - Specified the comment element box
     * @private
     * @returns {void}
     */
    public resolveComment(comment: CommentElementBox): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        const eventArgs: CommentActionEventArgs = { author: comment.author, cancel: false, type: 'Resolve' };
        this.owner.trigger(beforeCommentActionEvent, eventArgs);
        if (eventArgs.cancel && eventArgs.type === 'Resolve') {
            return;
        }
        this.resolveOrReopenComment(comment, true);
        if (this.owner.commentReviewPane) {
            this.owner.commentReviewPane.resolveComment(comment);
        }
    }

    /**
     * @param {CommentElementBox} comment - Specified the comment element box
     * @private
     * @returns {void}
     */
    public reopenComment(comment: CommentElementBox): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        const eventArgs: CommentActionEventArgs = { author: comment.author, cancel: false, type: 'Reopen' };
        this.owner.trigger(beforeCommentActionEvent, eventArgs);
        if (eventArgs.cancel && eventArgs.type === 'Reopen') {
            return;
        }
        this.resolveOrReopenComment(comment, false);
        if (this.owner.commentReviewPane) {
            this.owner.commentReviewPane.reopenComment(comment);
        }
    }

    private resolveOrReopenComment(comment: CommentElementBox, resolve: boolean): void {
        comment.isResolved = resolve;
        for (let i: number = 0; i < comment.replyComments.length; i++) {
            comment.replyComments[i].isResolved = resolve;
        }
    }

    /**
     * @param {CommentElementBox} parentComment - Specified the parent comment
     * @param {string} text - Specified the text.
     * @private
     * @returns {void}
     */
    public replyComment(parentComment: CommentElementBox, text?: string): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        const commentWidget: CommentElementBox = parentComment;
        if (parentComment) {
            this.initComplexHistory('InsertComment');
            const currentCmtStart: CommentCharacterElementBox = commentWidget.commentStart;
            const currentCmtEnd: CommentCharacterElementBox = commentWidget.commentEnd;
            const offset: number = currentCmtStart.line.getOffset(currentCmtStart, 1);

            let startPosition: TextPosition = new TextPosition(this.documentHelper.owner);
            startPosition.setPositionParagraph(currentCmtStart.line, offset);
            const endOffset: number = currentCmtEnd.line.getOffset(currentCmtEnd, 1);

            let endPosition: TextPosition = new TextPosition(this.documentHelper.owner);
            endPosition.setPositionParagraph(currentCmtEnd.line, endOffset);
            this.selection.start.setPositionInternal(startPosition);
            this.selection.end.setPositionInternal(endPosition);

            startPosition = this.selection.start;
            endPosition = this.selection.end;

            const position: TextPosition = new TextPosition(this.owner);
            // Clones the end position.
            position.setPositionInternal(endPosition);

            const commentRangeStart: CommentCharacterElementBox = new CommentCharacterElementBox(0);
            const commentRangeEnd: CommentCharacterElementBox = new CommentCharacterElementBox(1);
            const isAtSameParagraph: boolean = startPosition.isInSameParagraph(endPosition);

            // Adds comment start at selection start position.
            endPosition.setPositionInternal(startPosition);
            this.initInsertInline(commentRangeStart);

            // Updates the cloned position, since comment start is added in the same paragraph.
            if (isAtSameParagraph) {
                position.setPositionParagraph(position.currentWidget, position.offset + commentRangeStart.length);
            }

            // Adds comment end and comment at selection end position.
            startPosition.setPositionInternal(position);
            endPosition.setPositionInternal(position);

            this.initInsertInline(commentRangeEnd);
            const replyComment: CommentElementBox = new CommentElementBox(new Date().toISOString());
            replyComment.author = this.owner.currentUser ? this.owner.currentUser : 'Guest user';
            replyComment.text = text ? text : '';

            replyComment.commentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            replyComment.isReply = true;
            commentWidget.replyComments.push(replyComment);
            replyComment.ownerComment = commentWidget;
            if (this.owner.editorHistory) {
                this.initHistory('InsertCommentWidget');
                this.owner.editorHistory.currentBaseHistoryInfo.removedNodes.push(replyComment);
            }
            commentRangeStart.comment = replyComment;
            commentRangeStart.commentId = replyComment.commentId;
            commentRangeEnd.comment = replyComment;
            commentRangeEnd.commentId = replyComment.commentId;
            replyComment.commentStart = commentRangeStart;
            replyComment.commentEnd = commentRangeEnd;

            if (this.owner.commentReviewPane) {
                this.owner.commentReviewPane.addReply(replyComment, false, true);
            }
            if (this.editorHistory) {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = this.getCommentHierarchicalIndex(replyComment);
                this.editorHistory.updateHistory();
            }

            if (this.editorHistory) {
                this.editorHistory.updateComplexHistory();
            }
            this.reLayout(this.selection);
        }
    }



    private removeInline(element: ElementBox): void {
        this.selection.start.setPositionParagraph(element.line, element.line.getOffset(element, 0));
        this.selection.end.setPositionParagraph(this.selection.start.currentWidget, this.selection.start.offset + element.length);
        this.initHistory('RemoveInline');
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            this.updateHistoryPosition(this.selection.start, true);
        }
        this.removeSelectedContents(this.documentHelper.selection);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.fireContentChange();
    }
    /**
     * @param {CommentElementBox} commentWidget - Specifies the comment
     * @param {boolean} isNewComment - Specifies is new comment
     * @param {boolean} showComments - Specifies show comments
     * @param {boolean} selectComment - Specified select comment
     * @private
     * @returns {void}
     */
    public addCommentWidget(commentWidget: CommentElementBox, isNewComment: boolean, showComments: boolean, selectComment: boolean): void {
        if (this.documentHelper.comments.indexOf(commentWidget) === -1) {
            let isInserted: boolean = false;
            if (this.documentHelper.comments.length > 0) {

                const currentStart: TextPosition = this.selection.getElementPosition(commentWidget.commentStart).startPosition;
                for (let i: number = 0; i < this.documentHelper.comments.length; i++) {
                    /* eslint-disable-next-line max-len */
                    const paraIndex: TextPosition = this.selection.getElementPosition(this.documentHelper.comments[i].commentStart).startPosition;
                    if (currentStart.isExistBefore(paraIndex)) {
                        isInserted = true;
                        this.documentHelper.comments.splice(i, 0, commentWidget);
                        break;
                    }
                }
            }
            if (!isInserted) {
                this.documentHelper.comments.push(commentWidget);
            }
            if (this.owner.commentReviewPane) {
                this.owner.showComments = showComments;
                this.owner.commentReviewPane.selectedTab = 0;
                this.owner.commentReviewPane.addComment(commentWidget, isNewComment, selectComment);
                if (selectComment) {
                    this.owner.selection.selectComment(commentWidget);
                }
            }
        }
    }
    /**
     * @param {CommentElementBox} comment - Specifies comment element box
     * @param {string} hierarchicalIndex - Specifies the hierachical index.
     * @private
     * @returns {void}
     */
    public addReplyComment(comment: CommentElementBox, hierarchicalIndex: string): void {
        const index: string[] = hierarchicalIndex.split(';');
        const ownerComment: CommentElementBox = this.documentHelper.comments[parseInt(index[1], 10)];
        if (index[2] !== '') {
            ownerComment.replyComments.splice(parseInt(index[2], 10), 0, comment);
            comment.ownerComment = ownerComment;
        }
        if (this.owner.commentReviewPane) {
            this.owner.showComments = true;
            this.owner.commentReviewPane.addReply(comment, false, true);
            this.owner.selection.selectComment(comment);
        }
    }

    /**
     * @param {string} password - Specifies the password
     * @param {string} protectionType - Specifies the protection type
     * @private
     * @returns {void}
     */
    public addProtection(password: string, protectionType: ProtectionType): void {
        if (password === '') {
            this.protectDocument(protectionType);
        } else {
            this.currentProtectionType = protectionType;
            const enforceProtectionHandler: XmlHttpRequestHandler = new XmlHttpRequestHandler();
            const passwordBase64: string = this.base64.encodeString(password);
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const formObject: any = {
                passwordBase64: passwordBase64,
                saltBase64: '',
                spinCount: 100000
            };
            /* eslint-enable @typescript-eslint/no-explicit-any */
            const url: string = this.owner.serviceUrl + this.owner.serverActionSettings.restrictEditing;
            enforceProtectionHandler.url = url;
            enforceProtectionHandler.contentType = 'application/json;charset=UTF-8';
            enforceProtectionHandler.onSuccess = this.enforceProtectionInternal.bind(this);
            enforceProtectionHandler.onFailure = this.protectionFailureHandler.bind(this);
            enforceProtectionHandler.onError = this.protectionFailureHandler.bind(this);
            enforceProtectionHandler.customHeaders = this.owner.headers;
            enforceProtectionHandler.send(formObject);
        }
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private protectionFailureHandler(result: any): void {
        const localeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        localeValue.setLocale(this.documentHelper.owner.locale);
        if (result.name === 'onError') {
            DialogUtility.alert(localeValue.getConstant('Error in establishing connection with web server'));
        } else {
            this.owner.fireServiceFailure(result);
            console.error(result.statusText);
        }
    }
    private enforceProtectionInternal(result: any): void {
        const data: string[] = JSON.parse(result.data);
        this.documentHelper.saltValue = data[0];
        this.documentHelper.hashValue = data[1];
        this.protectDocument(this.currentProtectionType);
    }
    private protectDocument(protectionType: ProtectionType): void {
        this.protect(protectionType);
        const restrictPane: HTMLElement = this.documentHelper.restrictEditingPane.restrictPane;
        if (restrictPane && restrictPane.style.display === 'block') {
            this.documentHelper.restrictEditingPane.showStopProtectionPane(true);
            this.documentHelper.restrictEditingPane.loadPaneValue();
            this.documentHelper.dialog.hide();
        }
    }
    /**
     * Stop document protection.
     *
     * @param {string} password - Specifies the password
     * @returns {void}
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public stopProtection(password: string): void {
        if (this.documentHelper.isDocumentProtected) {
            const unProtectDocumentHandler: XmlHttpRequestHandler = new XmlHttpRequestHandler();
            const passwordBase64: string = this.base64.encodeString(password);
            const formObject: any = {
                passwordBase64: passwordBase64,
                saltBase64: this.documentHelper.saltValue,
                spinCount: 100000
            };
            unProtectDocumentHandler.url = this.owner.serviceUrl + this.owner.serverActionSettings.restrictEditing;
            unProtectDocumentHandler.contentType = 'application/json;charset=UTF-8';
            unProtectDocumentHandler.customHeaders = this.owner.headers;
            unProtectDocumentHandler.onSuccess = this.onUnProtectionSuccess.bind(this);
            unProtectDocumentHandler.onFailure = this.protectionFailureHandler.bind(this);
            unProtectDocumentHandler.onError = this.protectionFailureHandler.bind(this);
            unProtectDocumentHandler.send(formObject);
        }
    }
    private onUnProtectionSuccess(result: any): void {
        const encodeString: string[] = JSON.parse(result.data);
        this.validateHashValue(encodeString[1]);
    }
    private validateHashValue(currentHashValue: string): void {
        const localeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        localeValue.setLocale(this.documentHelper.owner.locale);
        const decodeUserHashValue: Uint8Array = this.base64.decodeString(currentHashValue);
        const documentHashValue: string = this.documentHelper.hashValue;
        const defaultHashValue: Uint8Array = this.base64.decodeString(documentHashValue);
        let stopProtection: boolean = true;
        if (decodeUserHashValue.length === defaultHashValue.length) {
            for (let i: number = 0; i < decodeUserHashValue.length; i++) {
                if (decodeUserHashValue[i] !== defaultHashValue[i]) {
                    stopProtection = false;
                    break;
                }
            }
        } else {
            stopProtection = false;
        }
        if (stopProtection) {
            this.unProtectDocument();
        } else {
            DialogUtility.alert(localeValue.getConstant('The password is incorrect'));
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public unProtectDocument(): void {
        this.documentHelper.isDocumentProtected = false;
        this.documentHelper.restrictFormatting = false;
        this.documentHelper.selection.highlightEditRegion();
        const restrictPane: HTMLElement = this.documentHelper.restrictEditingPane.restrictPane;
        if (restrictPane && restrictPane.style.display === 'block') {
            this.documentHelper.restrictEditingPane.showStopProtectionPane(false);
        }
        this.documentHelper.dialog.hide();
    }
    /**
     * Notify content change event
     *
     * @private
     * @returns {void}
     */
    public fireContentChange(): void {
        if (this.selection.isHighlightEditRegion) {
            if (this.owner.enableLockAndEdit) {
                this.owner.collaborativeEditingModule.updateLockRegion();
            } else {
                this.selection.onHighlight();
            }
        }
        this.selection.highlightFormFields();
        if (!this.isPaste) {
            this.copiedContent = undefined;
            this.copiedTextContent = '';
            this.previousSectionFormat = undefined;
            this.previousParaFormat = undefined;
            this.previousCharFormat = undefined;
            this.selection.isViewPasteOptions = false;
            if (this.isPasteListUpdated) {
                this.isPasteListUpdated = false;
            }
            this.selection.showHidePasteOptions(undefined, undefined);
        }
        if (this.documentHelper.owner.isLayoutEnabled && !this.documentHelper.owner.isShiftingEnabled) {
            this.documentHelper.owner.fireContentChange();
        }
    }
    /**
     * Update physical location for text position
     *
     * @param {boolean} isSelectionChanged - Specifies the selection change
     * @private
     * @returns {void}
     */
    public updateSelectionTextPosition(isSelectionChanged: boolean): void {
        this.getOffsetValue(this.selection);
        this.selection.start.updatePhysicalPosition(true);
        if (this.selection.isEmpty) {
            this.selection.end.setPositionInternal(this.selection.start);
        } else {
            this.selection.end.updatePhysicalPosition(true);
        }
        this.selection.upDownSelectionLength = this.selection.end.location.x;
        this.selection.fireSelectionChanged(isSelectionChanged);
    }
    /**
     * @private
     * @returns {void}
     */
    public onTextInputInternal = (): void => {
        if (Browser.isDevice) {
            const documentHelper: DocumentHelper = this.documentHelper;
            const nbsp: RegExp = new RegExp(String.fromCharCode(160), 'g');
            const lineFeed: RegExp = new RegExp(String.fromCharCode(10), 'g');
            documentHelper.prefix = documentHelper.prefix.replace(nbsp, ' ').replace(lineFeed, ' ');
            const text: string = documentHelper.editableDiv.textContent.replace(nbsp, ' ').replace(lineFeed, ' ');
            const textBoxText: string = text.substring(2);
            if (documentHelper.isCompositionStart && documentHelper.isCompositionUpdated) {
                documentHelper.isCompositionUpdated = false;
                if (!documentHelper.owner.isReadOnlyMode && documentHelper.owner.isDocumentLoaded && this.canEditContentControl) {
                    if (documentHelper.prefix.substring(2) !== textBoxText) {
                        if (this.selection.isEmpty) {
                            /* eslint-disable-next-line max-len */
                            this.selection.start.setPositionForLineWidget(documentHelper.selection.start.currentWidget, this.selection.start.offset - (documentHelper.prefix.length - 2));
                            this.handleTextInput(textBoxText);
                            documentHelper.prefix = '@' + String.fromCharCode(160) + textBoxText;
                        } else {
                            this.handleTextInput(textBoxText);
                            documentHelper.prefix = '@' + String.fromCharCode(160) + textBoxText;
                        }
                    }
                }
                return;
            } else if (documentHelper.isCompositionStart && documentHelper.isCompositionEnd && documentHelper.suffix === '') {
                if (documentHelper.prefix.substring(2) !== textBoxText) {
                    if (this.selection.isEmpty && documentHelper.isCompositionStart) {
                        documentHelper.isCompositionStart = false;
                        /* eslint-disable-next-line max-len */
                        this.selection.start.setPositionForLineWidget(documentHelper.selection.start.currentWidget, this.selection.start.offset - documentHelper.prefix.substring(2).length);
                        this.selection.retrieveCurrentFormatProperties();
                        if (documentHelper.suffix === '' || textBoxText === '') {
                            this.handleTextInput(textBoxText);
                        }
                    } else if (!this.selection.isEmpty) {
                        documentHelper.isCompositionStart = false;
                        this.handleTextInput(textBoxText);
                    }
                } else if (textBoxText === '') {
                    documentHelper.isCompositionStart = false;
                    this.handleBackKey();
                } else if (documentHelper.prefix.substring(2) === textBoxText && documentHelper.suffix === '') {
                    documentHelper.isCompositionStart = false;
                    this.handleTextInput(' ');
                }
                documentHelper.isCompositionEnd = false;
                return;

            } else if (documentHelper.isCompositionEnd || documentHelper.isCompositionStart && !documentHelper.isCompositionUpdated) {
                if (textBoxText.length < documentHelper.prefix.length &&
                    /* eslint-disable-next-line max-len */
                    textBoxText === documentHelper.prefix.substring(2, documentHelper.prefix.length - 1) || documentHelper.editableDiv.innerText.length < 2) {
                    this.handleBackKey();
                    return;
                } else if (documentHelper.suffix !== '' &&
                    documentHelper.editableDiv.innerText[documentHelper.editableDiv.innerText.length - 1] !== String.fromCharCode(160)) {
                    documentHelper.isCompositionStart = false;
                    //When cursor is placed in between a word and chosen a word from predicted words.
                    /* eslint-disable-next-line max-len */
                    this.selection.start.setPositionForLineWidget(documentHelper.selection.start.currentWidget, this.selection.start.offset - (documentHelper.prefix.length - 2));
                    /* eslint-disable-next-line max-len */
                    this.selection.end.setPositionForLineWidget(documentHelper.selection.end.currentWidget, this.selection.end.offset + documentHelper.suffix.length);
                    //Retrieve the character format properties. Since the selection was changed manually.
                    this.selection.retrieveCurrentFormatProperties();
                    this.handleTextInput(textBoxText);
                    return;
                }
            }

            if (text !== '\r' && text !== '\b' && text !== '\u001B' && !documentHelper.owner.isReadOnlyMode && documentHelper.isControlPressed === false && this.canEditContentControl) {
                if (text === '@' || text[0] !== '@' || text === '' || text.length < documentHelper.prefix.length &&
                    textBoxText === documentHelper.prefix.substring(2, documentHelper.prefix.length - 1)) {
                    this.handleBackKey();
                    if (documentHelper.editableDiv.innerText.length < 2) {
                        this.predictText();
                    }
                } else if (text.indexOf(documentHelper.prefix) === 0 && text.length > documentHelper.prefix.length) {
                    this.handleTextInput(text.substring(documentHelper.prefix.length));
                } else if (text.indexOf(documentHelper.prefix) === -1 && text[text.length - 1] !== String.fromCharCode(160)
                    && text[text.length - 1] !== ' ') {
                    if ((textBoxText.charAt(0).toLowerCase() + textBoxText.slice(1)) === documentHelper.prefix.substring(2)) {
                        /* eslint-disable-next-line max-len */
                        this.selection.start.setPositionParagraph(documentHelper.selection.start.currentWidget, this.selection.start.offset - (documentHelper.prefix.length - 2));
                    }
                    this.handleTextInput(textBoxText);
                } else if (text.length !== 2) {
                    this.handleTextInput(' ');
                }
            }
        } else {
            const text: string = this.documentHelper.editableDiv.innerText;
            if (text !== String.fromCharCode(160)) {

                if (text !== '\r' && text !== '\b' && text !== '\u001B' && !this.owner.isReadOnlyMode && this.documentHelper.isControlPressed === false && this.canEditContentControl) {
                    this.handleTextInput(text);
                }
            } else {
                this.handleTextInput(' ');
            }
            this.documentHelper.editableDiv.innerText = '';
        }
    };
    /**
     * Predict text
     *
     * @private
     * @returns {void}
     */
    public predictText(): void {
        this.documentHelper.suffix = '';
        if (this.selection.start.paragraph.isEmpty() || this.selection.start.offset === 0 &&
            this.selection.start.currentWidget.isFirstLine() || this.selection.end.offset === 0 &&
            this.selection.end.currentWidget.isFirstLine()) {
            this.documentHelper.prefix = '';
        } else {
            this.getPrefixAndSuffix();
        }
        this.documentHelper.prefix = '@' + String.fromCharCode(160) + this.documentHelper.prefix; // &nbsp;
        this.documentHelper.editableDiv.innerText = this.documentHelper.prefix;
        this.documentHelper.selection.setEditableDivCaretPosition(this.documentHelper.prefix.length);
    }

    /* eslint-disable  */
    private getPrefixAndSuffix(): void {
        //let viewer: LayoutViewer = this.owner.viewer;
        let editor: DocumentEditor = this.owner;
        let documentHelper: DocumentHelper = editor.documentHelper;
        if (this.selection.text !== '') {
            documentHelper.prefix = '';
            return;
        } else {
            let startIndex: number = 0;
            let inlineInfo: ElementInfo = this.selection.start.currentWidget.getInline(this.selection.start.offset, startIndex);
            let inline: ElementBox = inlineInfo.element;
            startIndex = inlineInfo.index;
            if (inline !== undefined) {
                let boxInfo: ElementInfo = this.selection.getElementBoxInternal(inline, startIndex);
                let box: ElementBox = boxInfo.element;
                startIndex = boxInfo.index;
                let spaceIndex: number = 0;
                if (!isNullOrUndefined(box)) {
                    let prefixAdded: Boolean = false;
                    if (box instanceof TextElementBox && startIndex > 0 && box.line.isFirstLine()) {
                        documentHelper.prefix = '';
                    }
                    if (!(inline instanceof TextElementBox)) {
                        inline = this.selection.getPreviousTextElement(inline);
                    }
                    /* eslint-disable no-cond-assign */
                    while ((spaceIndex = documentHelper.prefix.lastIndexOf(' ')) < 0 && inline instanceof TextElementBox) {
                        if (inline.previousNode instanceof TextElementBox && documentHelper.prefix.indexOf(' ') === -1) {
                            if (!prefixAdded) {
                                documentHelper.prefix = inline.text.substring(0, startIndex);
                                prefixAdded = true;
                            } else {
                                documentHelper.prefix = inline.text + documentHelper.prefix;
                            }
                            inline = inline.previousNode as TextElementBox;
                            // If the line has no elements then break the loop to avoid the exception.
                            if (inline instanceof ListTextElementBox) {
                                break;
                            }
                            if (!(inline instanceof TextElementBox)) {
                                inline = this.selection.getPreviousTextElement(inline);
                            }
                        } else if (!(inline.previousNode instanceof TextElementBox)) {
                            if (!prefixAdded) {
                                documentHelper.prefix = inline.text.substring(0, startIndex);
                                prefixAdded = true;
                            } else {
                                documentHelper.prefix = inline.text + documentHelper.prefix;
                            }
                            break;
                        }
                    }
                    if (!(documentHelper.prefix.length > 1 && documentHelper.prefix[documentHelper.prefix.length - 1] === ' ' &&
                        documentHelper.prefix[documentHelper.prefix.length - 2] === '.')) {
                        spaceIndex = documentHelper.prefix.lastIndexOf(' ');
                    } else {
                        spaceIndex = -1;
                        documentHelper.prefix = '';
                    }
                    documentHelper.prefix = spaceIndex < 0 ? documentHelper.prefix : documentHelper.prefix.substring(spaceIndex);
                    if (documentHelper.prefix.indexOf(' ') === 0 && documentHelper.prefix.length >= 1) {
                        documentHelper.prefix = documentHelper.prefix.substring(1);
                    }
                    // suffix text prediction
                    let endIndex: number = 0;
                    let endInlineInfo: ElementInfo = this.selection.end.currentWidget.getInline(this.selection.end.offset, endIndex);
                    let endInline: ElementBox = endInlineInfo.element;
                    endIndex = endInlineInfo.index;
                    boxInfo = this.selection.getElementBoxInternal(endInline, endIndex);
                    box = boxInfo.element;
                    endIndex = boxInfo.index;
                    if (box) {
                        let suffixAdded: boolean = false;
                        if (box instanceof TextElementBox && endIndex < (box as TextElementBox).length) {
                            documentHelper.suffix = '';
                        }
                        // boxIndex = renderedElements.get(endInline).indexOf(box);
                        while ((spaceIndex = documentHelper.suffix.indexOf(' ')) < 0 && endInline instanceof TextElementBox) {
                            if (endInline.nextNode instanceof TextElementBox && documentHelper.suffix.indexOf(' ') === -1) {
                                if (!suffixAdded) {
                                    documentHelper.suffix = (box as TextElementBox).text.substring(endIndex);
                                    suffixAdded = true;
                                } else {
                                    documentHelper.suffix = documentHelper.suffix + endInline.text;
                                }
                                endInline = endInline.nextNode as TextElementBox;
                            } else if (!(endInline.nextNode instanceof TextElementBox)) {
                                if (!suffixAdded) {
                                    documentHelper.suffix = (box as TextElementBox).text.substring(endIndex);
                                    suffixAdded = true;
                                } else {
                                    documentHelper.suffix = documentHelper.suffix + endInline.text;
                                }
                                break;
                            }
                        }
                        spaceIndex = documentHelper.suffix.indexOf(' ');
                        documentHelper.suffix = spaceIndex < 0 ? documentHelper.suffix : documentHelper.suffix.substring(0, spaceIndex);
                    }
                }
            }
        }
    }
    /**
     * Fired on paste.
     *
     * @param {ClipboardEvent} event - Specfies clipboard event
     * @private
     * @returns {void}
     */
    public onPaste = (event: ClipboardEvent): void => {
        if (!this.owner.isReadOnlyMode && this.canEditContentControl) {
            this.pasteInternal(event);
        }
        event.preventDefault();
    }
    /**
     * key action
     * @private
     * @returns {void}
     */
    /* eslint-disable  */
    public onKeyDownInternal(event: KeyboardEvent, ctrl: boolean, shift: boolean, alt: boolean): void {
        let key: number = event.which || event.keyCode;
        if (ctrl && !shift && !alt) {
            this.documentHelper.isControlPressed = true;
            switch (key) {
                case 8:
                    event.preventDefault();
                    this.handleCtrlBackKey();
                    break;
                case 46:
                    event.preventDefault();
                    this.handleCtrlDelete();
                    break;
                case 9:
                    event.preventDefault();
                    if (this.owner.acceptTab) {
                        this.selection.handleTabKey(false, false);
                    }
                    break;
                case 13:
                    event.preventDefault();
                    this.insertPageBreak();
                    break;
                case 48:
                    event.preventDefault();
                    this.onApplyParagraphFormat('beforeSpacing', 0, false, false);
                    break;
                case 49:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.onApplyParagraphFormat('lineSpacing', 1, false, false);
                    }
                    break;
                case 50:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.onApplyParagraphFormat('lineSpacing', 2, false, false);
                    }
                    break;
                case 53:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.onApplyParagraphFormat('lineSpacing', 1.5, false, false);
                    }
                    break;
                case 66:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleBold();
                    }
                    break;
                case 68:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode && this.owner.fontDialogModule) {
                        this.owner.fontDialogModule.showFontDialog();
                    }
                    break;
                case 69:
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleTextAlignment('Center');
                    }
                    event.preventDefault();
                    break;
                case 72:
                    event.preventDefault();
                    if (!this.owner.isReadOnly && this.owner.optionsPaneModule) {
                        this.owner.optionsPaneModule.isReplace = true;
                        this.owner.optionsPaneModule.showHideOptionsPane(true);
                    }
                    break;
                case 73:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleItalic();
                    }
                    break;
                case 74:
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleTextAlignment('Justify');
                    }
                    event.preventDefault();
                    break;
                case 75:
                    event.preventDefault();
                    if (this.owner.hyperlinkDialogModule && !this.owner.isReadOnlyMode) {
                        this.owner.hyperlinkDialogModule.show();
                    }
                    break;
                case 76:
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleTextAlignment('Left');
                    }
                    event.preventDefault();
                    break;
                case 77:
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.owner.selection.increaseIndent();
                    }
                    event.preventDefault();
                    break;
                case 78:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.owner.openBlank();
                    }
                    break;
                case 82:
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleTextAlignment('Right');
                    }
                    event.preventDefault();
                    break;
                case 85:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.owner.selection.toggleUnderline('Single');
                    }
                    break;
                case 88:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.owner.editor.cut();
                    }
                    break;
                case 89:
                    if (this.owner.enableEditorHistory) {
                        this.editorHistory.redo();
                        event.preventDefault();
                    }
                    break;
                case 90:
                    if (this.owner.enableEditorHistory) {
                        this.editorHistory.undo();
                        event.preventDefault();
                    }
                    break;
                case 219:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.onApplyCharacterFormat('fontSize', 'decrement', true);
                    }
                    break;
                case 221:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.onApplyCharacterFormat('fontSize', 'increment', true);
                    }
                    break;
                case 187:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
                        this.toggleBaselineAlignment('Subscript');
                    }
                    break;
            }
        } else if (shift && !ctrl && !alt) {
            switch (key) {
                case 9:
                    event.preventDefault();
                    if (this.owner.acceptTab) {
                        this.selection.handleTabKey(false, true);
                    }
                    break;
                case 13:
                    this.handleShiftEnter();
                    event.preventDefault();
                    break;
            }
        } else if (shift && ctrl && !alt) {
            switch (key) {

                case 68:
                    if (!this.owner.isReadOnlyMode) {
                        this.owner.selection.toggleUnderline('Double');
                    }
                    break;
                case 77:
                    if (!this.owner.isReadOnlyMode) {
                        this.owner.selection.decreaseIndent();
                    }
                    event.preventDefault();
                    break;
                case 188:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyCharacterFormat('fontSize', 'decrement', true);
                    }
                    break;
                case 190:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyCharacterFormat('fontSize', 'increment', true);
                    }
                    break;
                case 187:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.toggleBaselineAlignment('Superscript');
                    }
                    break;
                case 69:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        let eventArgs: TrackChangeEventArgs = { isTrackChangesEnabled: !this.owner.enableTrackChanges };
                        this.owner.trigger(trackChangeEvent, eventArgs);

                    }
            }
        } else if (!shift && ctrl && alt) {
            switch (key) {
                case 72:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode && this.owner.isDocumentLoaded) {
                        this.toggleHighlightColor();
                    }
                    break;
                case 70:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode && this.owner.isDocumentLoaded) {
                        this.insertFootnote();
                    }
                    break;
                case 68:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode && this.owner.isDocumentLoaded) {
                        this.insertEndnote();
                    }
                    break;
            }
        } else {
            switch (key) {
                case 8:
                    event.preventDefault();
                    this.handleBackKey();
                    break;
                case 9:
                    event.preventDefault();
                    if (this.owner.acceptTab) {
                        this.selection.handleTabKey(true, false);
                    }
                    break;
                case 13:
                    event.preventDefault();
                    this.documentHelper.triggerSpellCheck = true;
                    this.handleEnterKey();
                    this.documentHelper.triggerSpellCheck = false;
                    break;
                case 27:
                    event.preventDefault();
                    if (!this.isPaste) {
                        this.copiedContent = undefined;
                        this.copiedTextContent = '';
                        this.previousParaFormat = undefined;
                        this.previousCharFormat = undefined;
                        this.previousSectionFormat = undefined;
                        this.selection.isViewPasteOptions = false;
                        if (this.isPasteListUpdated) {
                            this.isPasteListUpdated = false;
                        }
                        this.selection.showHidePasteOptions(undefined, undefined);
                    }
                    break;
                case 46:
                    this.handleDelete();
                    event.preventDefault();
                    break;
                case 32:
                    this.selection.handleSpaceBarKey();
                    break;
                case 120:
                    let textPosition: TextPosition = this.selection.getDocumentEnd();
                    textPosition.offset = (this.selection.getDocumentEnd().offset + 1);
                    if (this.selection.start.isAtSamePosition(this.selection.getDocumentStart()) &&
                        this.selection.end.isAtSamePosition(textPosition)) {
                        this.owner.updateFields();
                    } else {
                        this.selection.updateRefField();
                    }
                    break;

            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public handleShiftEnter(): void {
        if (!this.owner.isReadOnlyMode) {
            this.handleTextInput('\v');
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Handles back key.
     *
     * @private
     * @returns {void}
     */
    public handleBackKey(): void {
        if ((!this.owner.isReadOnlyMode && this.canEditContentControl) || this.selection.isInlineFormFillMode()) {
            this.owner.editorModule.onBackSpace();
        }
        this.selection.checkForCursorVisibility();
    }

    /**
     * Handles delete
     *
     * @private
     * @returns {void}
     */
    public handleDelete(): void {
        if ((!this.owner.isReadOnlyMode && this.canEditContentControl) || this.selection.isInlineFormFillMode()) {
            this.owner.editorModule.delete();
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Handles enter key.
     *
     * @private
     * @returns {void}
     */
    public handleEnterKey(): void {
        if ((!this.owner.isReadOnlyMode && this.canEditContentControl) || this.selection.isInlineFormFillMode()) {
            if (Browser.isDevice) {
                this.documentHelper.isCompositionStart = false;
            }
            this.owner.editorModule.onEnter();
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Handles Control back key.
     *
     * @private
     * @returns {void}
     */
    public handleCtrlBackKey(): void {
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            if (!this.selection.isForward) {
                start = end;
            }
            if (this.selection.isEmpty) {
                this.selection.handleControlShiftLeftKey();
                this.owner.editorModule.onBackSpace();
                /* eslint-disable max-len */
            } else if (((isNullOrUndefined(start.paragraph.previousRenderedWidget) || start.paragraph.previousRenderedWidget instanceof TableWidget)
                && start.offset === 0)) {
                return;
            } else {
                this.selection.handleLeftKey();
                this.selection.handleControlShiftLeftKey();
                this.owner.editorModule.onBackSpace();
            }
        }
    }
    /**
     * Handles Ctrl delete
     *
     * @private
     * @returns {void}
     */
    public handleCtrlDelete(): void {
        if ((!this.owner.isReadOnlyMode && this.canEditContentControl) || this.selection.isInlineFormFillMode()) {
            if (!this.selection.isEmpty) {
                this.selection.handleLeftKey();
                this.selection.handleControlShiftRightKey();
                let selectedText: string = this.selection.text;
                let checkSpace: boolean = HelperMethods.endsWith(selectedText);
                if (checkSpace) {
                    this.selection.handleShiftLeftKey();
                }
                this.owner.editorModule.delete();
            } else {
                this.selection.handleControlShiftRightKey();
                this.owner.editorModule.delete();
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public handleTextInput(text: string): void {
        if (!this.owner.isReadOnlyMode && this.canEditContentControl || this.selection.isInlineFormFillMode()) {
            if (this.animationTimer) {
                clearTimeout(this.animationTimer);
            }
            classList(this.selection.caret, [], ['e-de-cursor-animation']);
            this.owner.editorModule.insertText(text);
            /* eslint-disable @typescript-eslint/indent */
            this.animationTimer = setTimeout(() => {
                if (this.animationTimer) {
                    clearTimeout(this.animationTimer);
                }
                if (this.selection && this.selection.caret) {
                    classList(this.selection.caret, ['e-de-cursor-animation'], []);
                }
            }, 600);
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Copies to format.
     * @param {WCharacterFormat} format
     * @private
     * @returns {void}
     */
    public copyInsertFormat(format: WCharacterFormat, copy: boolean): WCharacterFormat {
        let insertFormat: WCharacterFormat = new WCharacterFormat();
        let sFormat: SelectionCharacterFormat = this.selection.characterFormat;
        if (copy) {
            insertFormat.copyFormat(format);
        }
        if (!isNullOrUndefined(sFormat.bold) && format.bold !== sFormat.bold) {
            insertFormat.bold = sFormat.bold;
        }
        if (!isNullOrUndefined(sFormat.italic) && format.italic !== sFormat.italic) {
            insertFormat.italic = sFormat.italic;
        }
        if (sFormat.fontSize > 0 && format.fontSize !== sFormat.fontSize) {
            insertFormat.fontSize = sFormat.fontSize;
        }
        if (!isNullOrUndefined(sFormat.fontFamily) && format.fontFamily !== sFormat.fontFamily) {
            insertFormat.fontFamily = sFormat.fontFamily;
        }
        if (!isNullOrUndefined(sFormat.highlightColor) && format.highlightColor !== sFormat.highlightColor) {
            insertFormat.highlightColor = sFormat.highlightColor;
        }
        if (!isNullOrUndefined(sFormat.baselineAlignment) && format.baselineAlignment !== sFormat.baselineAlignment) {
            insertFormat.baselineAlignment = sFormat.baselineAlignment;
        }
        if (!isNullOrUndefined(sFormat.fontColor) && format.fontColor !== sFormat.fontColor) {
            insertFormat.fontColor = sFormat.fontColor;
        }
        if (!isNullOrUndefined(sFormat.underline) && format.underline !== sFormat.underline) {
            insertFormat.underline = sFormat.underline;
        }
        if (!isNullOrUndefined(sFormat.strikethrough) && format.strikethrough !== sFormat.strikethrough) {
            insertFormat.strikethrough = sFormat.strikethrough;
        }
        return insertFormat;
    }
    private getResultContentControlText(element: ContentControl): string {
        let ele: ElementBox = element.nextNode;
        let text: string = '';
        while (!(ele instanceof ContentControl)) {
            if (ele instanceof TextElementBox) {
                text += ele.text;
            }
            if (isNullOrUndefined(ele)) {
                break;
            }
            if (isNullOrUndefined(ele.nextNode)) {
                if (ele.paragraph.nextRenderedWidget) {
                    ele = (ele.paragraph.nextRenderedWidget.firstChild as LineWidget).children[0];
                } else {
                    break;
                }
            } else {
                ele = ele.nextNode;
            }
        }
        return text;
    }
    private updateXmlMappedContentControl(): void {
        if (this.isXmlMapped) {
            let startInlineEle: ContentControl = this.getContentControl();
            if (startInlineEle && startInlineEle.contentControlProperties) {
                this.updateCustomXml(startInlineEle.contentControlProperties.xmlMapping.storeItemId,
                    startInlineEle.contentControlProperties.xmlMapping.xPath, this.getResultContentControlText(startInlineEle));
            }
        }
    }
    private updateCustomXml(itemId: string, xPath: string, text: string): void {
        if (this.documentHelper.customXmlData.containsKey(itemId)) {
            let xml: string = this.documentHelper.customXmlData.get(itemId);
            let parser: DOMParser = new DOMParser();
            let xmlDoc: Document = parser.parseFromString(xml, 'text/xml');
            let lastText: string = xPath.substring(xPath.lastIndexOf('/') + 1);
            lastText = lastText.split('[')[0];
            lastText = lastText.substring(lastText.lastIndexOf(':') + 1);
            lastText = lastText.substring(lastText.lastIndexOf('@') + 1);
            let htmlCollec: HTMLCollectionOf<Element> = xmlDoc.getElementsByTagName(lastText);
            if (htmlCollec.length > 0) {
                htmlCollec[0].childNodes[0].nodeValue = text;
            } else if (xmlDoc.documentElement.attributes.length > 0 && xmlDoc.documentElement.attributes.getNamedItem(lastText) !== null) {
                xmlDoc.documentElement.attributes.getNamedItem(lastText).value = text;
            } else {
                return;
            }
            let newXml: XMLSerializer = new XMLSerializer();
            let xmlString: string = newXml.serializeToString(xmlDoc);
            this.documentHelper.customXmlData.set(itemId, xmlString);
        }
    }
    /**
     * Inserts the specified text at cursor position
     * @param {string} text - text to insert
     */
    public insertText(text: string): void {
        if (isNullOrUndefined(text) || text === '') {
            return;
        }
        this.insertTextInternal(text, false);
    }
    /**
     * @private
     * @returns {void}
     */
    /* eslint-disable  */
    public insertTextInternal(text: string, isReplace: boolean, revisionType?: RevisionType): void {
        if (this.documentHelper.protectionType === 'FormFieldsOnly' && this.selection.isInlineFormFillMode()) {
            let inline: FieldElementBox = this.selection.getCurrentFormField();
            let resultText: string = this.getFormFieldText();
            let rex: RegExp = new RegExp(this.owner.documentHelper.textHelper.getEnSpaceCharacter(), 'gi');
            if (resultText.length > 0 && resultText.replace(rex, '') === '') {
                resultText = '';
                this.selection.selectFieldInternal(inline);
            }
            let maxLength: number = (inline.formFieldData as TextFormField).maxLength;
            if (maxLength !== 0 && resultText.length >= maxLength) {
                return;
            }
        }
        let selection: Selection = this.documentHelper.selection;
        let insertPosition: TextPosition; let isRemoved: boolean = true;
        revisionType = (this.owner.enableTrackChanges && isNullOrUndefined(revisionType)) ? 'Insertion' : revisionType;
        this.isListTextSelected();
        if (isNullOrUndefined(revisionType) || revisionType === 'Insertion') {
            this.initHistory('Insert');
        }
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
        let paraFormat: WParagraphFormat = paragraphInfo.paragraph.paragraphFormat;
        selection.editPosition = selection.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        let bidi: boolean = selection.start.paragraph.paragraphFormat.bidi;
        if ((!selection.isEmpty && !selection.isImageSelected) ||
            this.documentHelper.isListTextSelected && selection.contextType === 'List') {
            selection.isSkipLayouting = true;
            selection.skipFormatRetrieval = true;
            let endPosition: TextPosition = undefined;
            if (this.owner.enableTrackChanges) {
                if (!this.selection.start.isExistBefore(this.selection.end)) {
                    endPosition = this.selection.start.clone();
                } else {
                    endPosition = this.selection.end.clone();
                }
                this.skipReplace = true;
            }
            isRemoved = this.removeSelectedContents(selection);
            this.skipReplace = false;
            if (!isNullOrUndefined(endPosition)) {
                if (this.owner.search.isRepalceTracking) {
                    this.owner.search.isRepalceTracking = false;
                }
                this.selection.start.setPositionInternal(this.selection.start);
                this.selection.end.setPositionInternal(endPosition);
            }
            selection.skipFormatRetrieval = false;
            selection.isSkipLayouting = false;
        } else if (selection.isEmpty && !this.documentHelper.isListTextSelected && !isReplace) {
            this.documentHelper.isTextInput = true;
        }
        paragraphInfo = this.selection.getParagraphInfo(selection.start);
        paragraphInfo.paragraph.paragraphFormat.copyFormat(paraFormat);
        let isSpecialChars: boolean = this.documentHelper.textHelper.containsSpecialCharAlone(text);
        if (isRemoved) {
            selection.owner.isShiftingEnabled = true;
            this.updateInsertPosition();
            insertPosition = selection.start;
            if (insertPosition.paragraph.isEmpty()) {
                let span: TextElementBox = new TextElementBox();
                let insertFormat: WCharacterFormat = this.copyInsertFormat(insertPosition.paragraph.characterFormat, true);
                span.characterFormat.copyFormat(insertFormat);
                span.text = text;
                let isBidi: boolean = this.documentHelper.textHelper.getRtlLanguage(text).isRtl;
                span.characterFormat.bidi = isBidi;
                span.isRightToLeft = isBidi;
                span.line = (insertPosition.paragraph as ParagraphWidget).childWidgets[0] as LineWidget;
                span.margin = new Margin(0, 0, 0, 0);
                span.line.children.push(span);
                if (this.owner.enableTrackChanges) {
                    if (span.paragraph.characterFormat.revisions.length > 0) {

                        let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(span.paragraph.characterFormat.revisions, revisionType);
                        if (matchedRevisions.length > 0) {
                            this.mapMatchedRevisions(matchedRevisions, span.paragraph.characterFormat, span, true);
                        }
                    } else if (!this.checkToCombineRevisionWithPrevPara(span, revisionType)) {
                        this.insertRevision(span, revisionType);
                    }
                }
                if ((insertPosition.paragraph.paragraphFormat.textAlignment === 'Center'
                    || insertPosition.paragraph.paragraphFormat.textAlignment === 'Right') &&
                    insertPosition.paragraph.paragraphFormat.listFormat.listId === -1) {
                    insertPosition.paragraph.x = this.owner.viewer.clientActiveArea.x;
                }
                this.documentHelper.layout.reLayoutParagraph(insertPosition.paragraph, 0, 0);
            } else {
                let indexInInline: number = 0;

                let inlineObj: ElementInfo = insertPosition.currentWidget.getInline(insertPosition.offset, indexInInline, bidi, (isReplace) ? false : true);
                let inline: ElementBox = inlineObj.element;
                indexInInline = inlineObj.index;
                inline.ischangeDetected = true;
                if (inline instanceof TextElementBox && text !== ' ' && this.documentHelper.owner.isSpellCheck) {
                    this.owner.spellChecker.removeErrorsFromCollection({ 'element': inline, 'text': (inline as TextElementBox).text });
                    if (!isReplace) {
                        (inline as TextElementBox).ignoreOnceItems = [];
                    }
                }
                if (inline.canTrigger && (inline as TextElementBox).text.length <= 1) {
                    inline.canTrigger = false;
                }
                // Todo: compare selection format
                let insertFormat: WCharacterFormat = this.copyInsertFormat(inline.characterFormat, true);
                let isBidi: boolean = this.documentHelper.textHelper.getRtlLanguage(text).isRtl;
                let insertLangId: number = this.documentHelper.textHelper.getRtlLanguage(text).id;
                let inlineLangId: number = 0;
                let isRtl: boolean = false;
                let isInlineContainsSpecChar: boolean = false;
                if (inline instanceof TextElementBox) {
                    inlineLangId = this.documentHelper.textHelper.getRtlLanguage(inline.text).id;
                    isRtl = this.documentHelper.textHelper.getRtlLanguage(inline.text).isRtl;
                    isInlineContainsSpecChar = this.documentHelper.textHelper.containsSpecialCharAlone(inline.text);
                }
                if (isBidi || !this.documentHelper.owner.isSpellCheck) {
                    insertFormat.bidi = isBidi;
                }

                if ((!this.documentHelper.owner.isSpellCheck || (text !== ' ' && (<TextElementBox>inline).text !== ' ')) && insertFormat.isSameFormat(inline.characterFormat) && this.canInsertRevision(inline, revisionType) && (insertLangId === inlineLangId)
                    || (text.trim() === '' && !isBidi && inline.characterFormat.bidi) || isRtl && insertFormat.isSameFormat(inline.characterFormat) && isSpecialChars) {
                    this.insertTextInline(inline, selection, text, indexInInline);
                } else {
                    let isContainsRtl: boolean = this.documentHelper.layout.isContainsRtl(selection.start.currentWidget);
                    let tempSpan: TextElementBox = new TextElementBox();
                    tempSpan.text = text;
                    tempSpan.line = inline.line;
                    tempSpan.isRightToLeft = isRtl;
                    tempSpan.characterFormat.copyFormat(insertFormat);
                    if (inline instanceof FootnoteElementBox) {
                        tempSpan.characterFormat.baselineAlignment = 'Normal';
                    }
                    let isRevisionCombined: boolean = false;
                    let insertIndex: number = inline.indexInOwner;
                    let prevRevisionCount: number = tempSpan.revisions.length;
                    if (indexInInline === inline.length) {
                        let isParaBidi: boolean = inline.line.paragraph.bidi;
                        if (isParaBidi && inline instanceof FieldElementBox && inline.fieldType === 1) {
                            inline = inline.fieldBegin;
                            insertIndex = inline.indexInOwner;
                        }
                        let index: number = -1;
                        if (isParaBidi || inline instanceof EditRangeEndElementBox || isContainsRtl && isInlineContainsSpecChar
                            || isRtl && isBidi) {
                            index = insertIndex;
                        } else {
                            index = insertIndex + 1;
                        }
                        if (this.owner.enableTrackChanges && !(inline instanceof BookmarkElementBox)) {

                            isRevisionCombined = this.checkToMapRevisionWithInlineText(inline, indexInInline, tempSpan, isBidi, revisionType);
                            if (!isRevisionCombined && tempSpan.revisions.length === prevRevisionCount) {
                                isRevisionCombined = this.checkToMapRevisionWithNextNode(inline.nextNode, tempSpan, isBidi, revisionType);
                            }
                        }
                        if (!isRevisionCombined) {
                            inline.line.children.splice(index, 0, tempSpan);

                            this.checkToCombineRevisionsinBlocks(tempSpan, prevRevisionCount === tempSpan.revisions.length, true, revisionType);
                        }
                    } else if (indexInInline === 0) {
                        if (this.owner.enableTrackChanges) {

                            isRevisionCombined = this.checkToMapRevisionWithInlineText(inline, indexInInline, tempSpan, isBidi, revisionType);
                            if (!isRevisionCombined && tempSpan.revisions.length === 0) {
                                this.checkToMapRevisionWithPreviousNode(inline.previousNode, tempSpan, isBidi, revisionType);
                            }
                        }
                        if (!isRevisionCombined) {
                            if (isRtl && !isBidi) {
                                inline.line.children.splice(insertIndex + 1, 0, tempSpan);
                            } else {
                                inline.line.children.splice(insertIndex, 0, tempSpan);
                            }

                            this.checkToCombineRevisionsinBlocks(tempSpan, prevRevisionCount === tempSpan.revisions.length, true, revisionType);
                        }
                    } else {
                        if (inline instanceof TextElementBox) {
                            let splittedSpan: TextElementBox = new TextElementBox();
                            splittedSpan.line = inline.line;
                            splittedSpan.characterFormat.copyFormat(inline.characterFormat);
                            if (bidi && isRtl && !isBidi) {
                                splittedSpan.text = inline.text.slice(0, indexInInline);
                                if (!this.owner.enableTrackChanges) {
                                    this.updateRevisionForSpittedTextElement(inline, splittedSpan);
                                }
                                inline.text = inline.text.substring(indexInInline);
                            } else {
                                splittedSpan.text = (inline as TextElementBox).text.substring(indexInInline);
                                if (!this.owner.enableTrackChanges && !this.selection.isInField) {
                                    this.updateRevisionForSpittedTextElement(inline, splittedSpan);
                                }
                                (inline as TextElementBox).text = (inline as TextElementBox).text.slice(0, indexInInline);
                            }
                            if (this.owner.enableTrackChanges) {

                                isRevisionCombined = this.checkToMapRevisionWithInlineText(inline, indexInInline, tempSpan, isBidi, revisionType);
                                if (isRevisionCombined || tempSpan.revisions.length > prevRevisionCount) {
                                    this.copyElementRevision(inline, splittedSpan, true);
                                } else if (tempSpan.revisions.length === prevRevisionCount) {
                                    this.updateRevisionForSpittedTextElement(inline, splittedSpan);
                                    this.insertRevision(tempSpan, revisionType);
                                }
                            } else if (this.selection.isInField) {
                                this.copyElementRevision(inline, splittedSpan, false);
                                this.updateElementInFieldRevision(inline, tempSpan, inline.revisions, true);
                            }
                            if (this.owner.isSpellCheck) {
                                this.owner.spellChecker.updateSplittedElementError(inline, splittedSpan);
                            }
                            inline.line.children.splice(insertIndex + 1, 0, splittedSpan);
                        }
                        if (!isRevisionCombined) {
                            inline.line.children.splice(insertIndex + 1, 0, tempSpan);
                        }
                    }
                    if (!bidi && this.documentHelper.layout.isContainsRtl(selection.start.currentWidget)) {
                        this.documentHelper.layout.reArrangeElementsForRtl(selection.start.currentWidget, bidi);
                    }
                    //if (!isRevisionCombined) {
                    this.documentHelper.layout.reLayoutParagraph(insertPosition.paragraph, inline.line.indexInOwner, 0);
                    //}

                }
            }
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + text.length, true);
            this.updateEndPosition();
            if (!isNullOrUndefined(this.editorHistory) && !isNullOrUndefined(this.editorHistory.currentHistoryInfo)
                && (this.editorHistory.currentHistoryInfo.action === 'ListSelect') &&
                this.documentHelper.isListTextSelected) {
                this.editorHistory.updateHistory();
                this.editorHistory.updateComplexHistory();
            }
            if (isNullOrUndefined(revisionType) || revisionType === 'Insertion') {
                this.reLayout(selection);
            }
            this.documentHelper.isTextInput = false;
        }
        this.updateXmlMappedContentControl();
        if (!isReplace && isRemoved && (text === ' ' || text === '\t' || text === '\v')) {
            let isList: boolean = false;
            if (!(text === '\v')) {
                isList = this.checkAndConvertList(selection, text === '\t');
            }
            if (!isList) {
                if (!isNullOrUndefined(selection.getHyperlinkField())) {
                    return;
                }
                //Checks if the previous text is URL, then it is auto formatted to hyperlink.
                this.checkAndConvertToHyperlink(selection, false);
            }
        }
    }

    private updateElementInFieldRevision(revisionElement: ElementBox, elementToInclude: ElementBox, revisions: Revision[], isEnd: boolean): void {
        for (let i: number = 0; i < revisions.length; i++) {
            let currentRevision: Revision = revisions[i];
            let rangeIndex: number = currentRevision.range.indexOf(revisionElement);
            currentRevision.range.splice(isEnd ? rangeIndex + 1 : rangeIndex, 0, elementToInclude);
        }
    }

    public retrieveFieldResultantText(item: FieldElementBox): string {
        let resultantText: string = '';
        if (item.fieldType === 1) {
            let textElement: TextElementBox = item.previousElement as TextElementBox;
            while (!isNullOrUndefined(textElement) && textElement instanceof TextElementBox) {
                resultantText = textElement.text + resultantText;

                textElement = (!isNullOrUndefined(textElement.previousNode)) ? textElement.previousNode.previousValidNodeForTracking as TextElementBox : undefined;
            }
        }
        return resultantText;
    }

    private checkToCombineRevisionsinBlocks(tempSpan: ElementBox, checkWidget: boolean, isEnd: boolean, revisionType: RevisionType): void {
        if (!checkWidget || !this.owner.enableTrackChanges) {
            return;
        }
        // if (tempSpan instanceof FieldElementBox && tempSpan.fieldType === 2) {
        //     return;
        // }

        if (tempSpan instanceof BookmarkElementBox || tempSpan instanceof CommentCharacterElementBox || tempSpan instanceof EditRangeStartElementBox || tempSpan instanceof EditRangeEndElementBox) {
            return;
        }

        let isCombined: boolean = false;
        if (isEnd) {
            isCombined = this.combineRevisionWithNextPara(tempSpan, revisionType);
        } else {
            isCombined = this.combineRevisionWithPrevPara(tempSpan, revisionType);
        }
        if (!isCombined) {
            this.insertRevision(tempSpan, revisionType);
        }
    }
    private checkToMapRevisionWithNextNode(inline: ElementBox, tempSpan: ElementBox, isBidi: boolean, revisionType: RevisionType): boolean {
        if (isNullOrUndefined(inline)) {
            return false;
        }
        let nextElement: ElementBox = inline.nextValidNodeForTracking;
        if (!isNullOrUndefined(nextElement)) {
            return this.checkToMapRevisionWithInlineText(nextElement, 0, tempSpan, isBidi, revisionType);
        }
        return false;
    }

    private checkToMapRevisionWithPreviousNode(inline: ElementBox, tempSpan: ElementBox, isBidi: boolean, revisionType: RevisionType): boolean {
        if (isNullOrUndefined(inline)) {
            return false;
        }
        let prevElement: ElementBox = inline.previousValidNodeForTracking;
        if (!isNullOrUndefined(prevElement)) {
            return this.checkToMapRevisionWithInlineText(prevElement, prevElement.length, tempSpan, isBidi, revisionType);
        }
        return false;
    }


    private checkToMapRevisionWithInlineText(inline: ElementBox, indexInInline: number, newElement: ElementBox, isBidi: boolean, revisionType: RevisionType): boolean {
        if (!isNullOrUndefined(inline)) {
            if (revisionType === 'Deletion') {
                this.updateLastElementRevision(newElement);
            }
            if (inline.length === indexInInline) {
                inline = inline.previousValidNodeForTracking;
                indexInInline = inline.length;
                if (inline.revisions.length > 0) {
                    return this.applyMatchedRevisionInorder(inline, newElement, indexInInline, false, isBidi, revisionType);
                }
            } else if (indexInInline === 0) {
                inline = inline.nextValidNodeForTracking;
                if (!isNullOrUndefined(inline) && inline.revisions.length > 0) {
                    return this.applyMatchedRevisionInorder(inline, newElement, indexInInline, true, isBidi, revisionType);
                }
            }
        }
        return false;
    }

    private combineElementRevisions(inline: ElementBox, elementToCombine: ElementBox): void {
        if (inline.revisions.length === 0 || elementToCombine.revisions.length === 0) {
            return;
        }
        for (let i: number = 0; i < inline.revisions.length; i++) {
            let prevRevision: Revision = inline.revisions[i];
            for (let j: number = 0; j < elementToCombine.revisions.length; j++) {
                let currentRevision: Revision = elementToCombine.revisions[i];

                if (prevRevision.range.indexOf(elementToCombine) === -1 && currentRevision.revisionType === prevRevision.revisionType && currentRevision.author === prevRevision.author) {
                    elementToCombine.revisions.splice(j, 1);
                    prevRevision.range.push(elementToCombine);
                    elementToCombine.revisions.splice(j, 0, prevRevision);

                }
            }
        }
    }


    private applyMatchedRevisionInorder(inline: ElementBox, newElement: ElementBox, indexInInline: number, isBegin: boolean, isBidi: boolean, revisionType: RevisionType): boolean {
        let revisionsMatched: Revision[] = this.getMatchedRevisionsToCombine(inline.revisions, revisionType);

        // if (revisionsMatched.length === inline.revisions.length && this.documentHelper.isTextInput && inline instanceof TextElementBox && newElement instanceof TextElementBox && !isBidi && (<TextElementBox>inline).text !== ' ') {
        //     this.insertTextInline(inline, this.selection, (newElement as TextElementBox).text, indexInInline, true);
        //     this.updateLastElementRevision(inline);
        //     return true;
        // } else
        if (revisionsMatched.length > 0) {
            this.mapMatchedRevisions(revisionsMatched, inline, newElement, isBegin);
        }
        //this.updateLastElementRevision(newElement);
        return false;
    }

    private copyElementRevision(elementToCopy: ElementBox, elementToInclude: ElementBox, isSplitElementMerged: boolean): void {
        if (!this.isTrackingFormField) {
            for (let i: number = 0; i < elementToCopy.revisions.length; i++) {
                let currentRevision: Revision = elementToCopy.revisions[i];
                let rangeIndex: number = currentRevision.range.indexOf(elementToCopy);
                elementToInclude.revisions.splice(0, 0, currentRevision);
                currentRevision.range.splice(rangeIndex + ((isSplitElementMerged) ? 2 : 1), 0, elementToInclude);
            }
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private mapMatchedRevisions(revisions: Revision[], revisionElement: any, elementToInclude: any, isBegin: boolean): any {
        for (let i: number = 0; i < revisions.length; i++) {
            let currentRevision: Revision = revisions[i];
            if (!this.isRevisionAlreadyIn(elementToInclude, currentRevision) || elementToInclude instanceof WCharacterFormat) {
                elementToInclude.revisions.splice(0, 0, currentRevision);
                let rangeIndex: number = currentRevision.range.indexOf(revisionElement);
                currentRevision.range.splice((isBegin) ? rangeIndex : rangeIndex + 1, 0, elementToInclude);
            }
        }
    }
    private isRevisionAlreadyIn(element: any, revision: Revision): boolean {
        if (element.revisions.length > 0) {
            for (let i = 0; i < element.revisions.length; i++) {
                let elementRevision: Revision = element.revisions[i];
                if (elementRevision.revisionID === revision.revisionID) {
                    return true;
                }
            }
        }
        return false;
    }
    private getMatchedRevisionsToCombine(revisions: Revision[], revisionType: RevisionType): Revision[] {
        let matchedRevisions: Revision[] = [];
        for (let i: number = 0; i < revisions.length; i++) {
            if (this.isRevisionMatched(revisions[i], revisionType)) {
                matchedRevisions.push(revisions[i]);
            }
        }
        return matchedRevisions;
    }
    private decideInlineForTrackChanges(inline: ElementBox, revisionType: RevisionType): RevisionMatchedInfo {
        let matched: boolean = false;
        if (this.owner.enableTrackChanges && !this.canInsertRevision(inline, revisionType)) {
            let currentElement: ElementBox = inline.nextValidNodeForTracking;
            if (!isNullOrUndefined(currentElement) && this.canInsertRevision(currentElement, revisionType)) {
                inline = currentElement;
                matched = true;
            }
        }
        return { 'element': inline, 'isMatched': matched };
    }
    /**
     * @private
     * @returns {void}
     */
    public insertIMEText(text: string, isUpdate: boolean): void {
        if (this.documentHelper.lastComposedText === text && isUpdate) {
            return;
        }
        // Clone selection start position
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
        let startPosition: string = this.selection.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        // Insert IME text in current selection
        this.insertText(text);
        this.documentHelper.lastComposedText = text;
        // update selection start
        let start: TextPosition = this.selection.start;
        this.setPositionForCurrentIndex(start, startPosition);
        // Update selection end
        let endPosition: TextPosition = new TextPosition(this.owner);
        endPosition.setPositionForLineWidget(start.currentWidget, start.offset + text.length);
        this.selection.selectPosition(isUpdate ? start : endPosition, endPosition);
    }
    /**
     * Insert Section break at cursor position
     *
     * @returns {void}
     */
    public insertSectionBreak(): void {
        let selection: Selection = this.documentHelper.selection;
        if (isNullOrUndefined(selection) || this.owner.isReadOnlyMode || selection.start.paragraph.isInHeaderFooter) {
            return;
        }
        this.initHistory('SectionBreak');
        if (!selection.isEmpty) {
            selection.selectContent(selection.isForward ? selection.start : selection.end, true);
        }
        this.documentHelper.owner.isShiftingEnabled = true;
        this.updateInsertPosition();
        this.insertSection(selection, true);
        this.updateEndPosition();
        this.reLayout(selection, true);
        if (this.owner.layoutType === 'Continuous') {
            this.layoutWholeDocument();
        }
    }

    private combineRevisionWithBlocks(elementBox: ElementBox, revisionType?: RevisionType): void {
        if (!this.owner.enableTrackChanges || isNullOrUndefined(elementBox)) {
            return;
        }
        while (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox) {
            elementBox = elementBox.nextElement;
        }
        if (isNullOrUndefined(elementBox)) {
            return;
        }
        let prevPara: ParagraphWidget = elementBox.paragraph.previousRenderedWidget as ParagraphWidget;
        if (prevPara instanceof TableWidget) {
            return;
        }
        let isNew: boolean = true;
        if (!isNullOrUndefined(prevPara) && !prevPara.isEmpty() && prevPara.characterFormat.revisions.length > 0) {
            let lastLine: LineWidget = prevPara.lastChild as LineWidget;
            if (isNullOrUndefined(lastLine) || lastLine.children.length === 0) {
                return;
            }
            let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1];
            while (lastElement instanceof BookmarkElementBox || lastElement instanceof CommentCharacterElementBox) {
                lastElement = lastElement.previousElement;
            }
            if (lastElement.revisions.length > 0) {
                if (this.compareElementRevision(prevPara.characterFormat, elementBox)) {
                    let currentRevision: Revision = elementBox.revisions[elementBox.revisions.length - 1];
                    if (this.compareElementRevision(lastElement, elementBox)) {
                        let lastElementRevision: Revision = lastElement.revisions[lastElement.revisions.length - 1];
                        isNew = false;
                        if (currentRevision !== lastElementRevision) {

                            this.clearAndUpdateRevisons(currentRevision.range, lastElementRevision, lastElementRevision.range.indexOf(lastElement) + 1);
                        }
                    }
                }
            }
        }
        prevPara = null;
        let lastLine: LineWidget = elementBox.paragraph.lastChild as LineWidget;
        let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1];
        elementBox = lastElement;
        let nextPara: ParagraphWidget = elementBox.paragraph.nextRenderedWidget as ParagraphWidget;
        if (nextPara instanceof TableWidget) {
            return;
        }
        if (!isNullOrUndefined(nextPara) && !nextPara.isEmpty() && elementBox.paragraph.characterFormat.revisions.length > 0) {
            // let lastLine: LineWidget = elementBox.paragraph.lastChild as LineWidget;
            // let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1];
            let firstLine: LineWidget = nextPara.firstChild as LineWidget;
            let firstElement: ElementBox = firstLine.children[0];
            while (firstElement instanceof BookmarkElementBox || firstElement instanceof CommentCharacterElementBox) {
                firstElement = firstElement.previousElement;
            }
            if (isNullOrUndefined(firstElement)) {
                return;
            }
            if (firstElement.revisions.length > 0) {
                let firstEleRevision: Revision = firstElement.revisions[firstElement.revisions.length - 1];
                if (this.compareElementRevision(elementBox.paragraph.characterFormat, firstElement)) {
                    if (this.compareElementRevision(elementBox, firstElement)) {
                        let lastElementRevision: Revision = elementBox.revisions[elementBox.revisions.length - 1];
                        isNew = false;
                        if (firstEleRevision !== lastElementRevision) {

                            this.clearAndUpdateRevisons(firstEleRevision.range, lastElementRevision, lastElementRevision.range.indexOf(elementBox) + 1);
                        }
                    }
                }
            }
        }
        if (elementBox.revisions.length === 0) {
            this.insertRevision(elementBox, revisionType);
        }
    }

    private checkToCombineRevisionWithNextPara(elementBox: ElementBox, revisionType: RevisionType): boolean {
        let nextPara: ParagraphWidget = elementBox.paragraph.nextRenderedWidget as ParagraphWidget;
        if (nextPara instanceof TableWidget) {
            return false;
        }
        if (!isNullOrUndefined(nextPara) && !nextPara.isEmpty()) {
            let firstLine: LineWidget = nextPara.firstChild as LineWidget;
            let firstElement: ElementBox = firstLine.children[0];
            while (firstElement instanceof BookmarkElementBox || firstElement instanceof CommentCharacterElementBox) {
                firstElement = firstElement.previousElement;
            }
            if (isNullOrUndefined(firstElement)) {
                return false;
            }
            if (firstElement.revisions.length > 0) {
                let mappedRevisions: Revision[] = this.getMatchedRevisionsToCombine(firstElement.revisions, revisionType);
                if (mappedRevisions.length > 0) {
                    this.mapMatchedRevisions(mappedRevisions, firstElement, elementBox, true);
                    return true;
                }
            }
        }
        return false;
    }

    private checkToCombineRevisionWithPrevPara(elementBox: ElementBox, revisionType: RevisionType): boolean {
        let prevPara: ParagraphWidget = elementBox.paragraph.previousRenderedWidget as ParagraphWidget;
        if (prevPara instanceof TableWidget) {
            return false;
        }
        if (!isNullOrUndefined(prevPara) && prevPara.characterFormat.revisions.length > 0) {
            if (!this.isRevisionMatched(prevPara.characterFormat, revisionType)) {
                return false;
            }
            // let firstLine: LineWidget = prevPara.firstChild as LineWidget;
            // let lastLine: LineWidget = prevPara.lastChild as LineWidget;
            // if (isNullOrUndefined(lastLine) || lastLine.children.length === 0) {
            //     return false;
            // }
            // let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1];
            // if (lastElement instanceof BookmarkElementBox || lastElement instanceof CommentCharacterElementBox) {
            //     lastElement = lastElement.previousValidNodeForTracking;
            // }
            // if (isNullOrUndefined(lastElement)) {
            //     return false;
            // }
            // if (lastElement.revisions.length > 0) {
            let mappedRevisions: Revision[] = this.getMatchedRevisionsToCombine(prevPara.characterFormat.revisions, revisionType);
            if (mappedRevisions.length > 0) {
                this.mapMatchedRevisions(mappedRevisions, prevPara.characterFormat, elementBox, false);
                return true;
            }
            // }
        }
        return false;
    }

    private combineRevisionWithNextPara(elementBox: ElementBox, revisionType: RevisionType): boolean {
        let isLastLine: boolean = elementBox.line.isLastLine();
        let nextElement: ElementBox = elementBox.nextNode;
        if (isLastLine && isNullOrUndefined(nextElement)) {
            return this.checkToCombineRevisionWithNextPara(elementBox, revisionType);
        }
        return false;
    }
    private combineRevisionWithPrevPara(elementBox: ElementBox, revisionType: RevisionType): boolean {
        let isFirstLine: boolean = elementBox.line.isFirstLine();
        let prevElement: ElementBox = elementBox.previousNode;
        if (isFirstLine && isNullOrUndefined(prevElement)) {
            return this.checkToCombineRevisionWithPrevPara(elementBox, revisionType);
        }
        return false;
    }

    public removeRevision(revisionToRemove: Revision): any {
        let elementInfo: ElementInfo = this.selection.start.currentWidget.getInline(this.selection.start.offset + 1, 0);
        let elementBox: ElementBox = elementInfo.element;
        if (elementInfo.element.revisions.length > 0) {
            for (let i: number = 0; i < elementBox.revisions.length; i++) {
                if (elementBox.revisions[i].revisionType === revisionToRemove.revisionType) {
                    let revision: Revision = elementBox.revisions[i];
                    let startIndex: number = revision.range.indexOf(elementBox);
                    for (let j: number = startIndex; startIndex < revision.range.length; startIndex++) {
                        (revision.range[j] as ElementBox).revisions.splice(i, 1);
                        revision.range.splice(j, 1);
                    }
                }
            }
        }
    }


    public clearElementRevision(revision: Revision): void {
        if (isNullOrUndefined(revision)) {
            return;
        }
        for (let i: number = 0; i < revision.range.length; i++) {
            if (revision.range[i] instanceof ElementBox) {
                let currentElement: ElementBox = revision.range[i] as ElementBox;
                currentElement.revisions.splice(currentElement.revisions.length - 1, 1);
                revision.range.splice(i, 1);
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public insertRevision(item: any, type: RevisionType, author?: string, date?: string, spittedRange?: object[]): void {
        author = !isNullOrUndefined(author) ? author : this.owner.currentUser ? this.owner.currentUser : 'Guest user';
        let currentDate: string = !isNullOrUndefined(date) ? date : new Date().toISOString();

        if (item instanceof ElementBox && !isNullOrUndefined(item.line) && item.line.paragraph.associatedCell || (item instanceof WCharacterFormat && item.ownerBase instanceof ParagraphWidget && item.ownerBase.associatedCell)) {
            let cellWidget: TableCellWidget = undefined;
            if (item instanceof ElementBox) {
                cellWidget = item.line.paragraph.associatedCell;
            } else if (item instanceof WCharacterFormat) {
                cellWidget = (item.ownerBase as ParagraphWidget).associatedCell;
            }
            if (cellWidget.ownerRow.rowFormat.revisions.length > 0) {
                let rowFormat: WRowFormat = cellWidget.ownerRow.rowFormat;
                let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(rowFormat.revisions, type);
                if (matchedRevisions.length > 0) {
                    for (let i: number = 0; i < matchedRevisions.length; i++) {
                        item.revisions.splice(0, 0, matchedRevisions[i]);
                        matchedRevisions[i].range.push(item);
                    }
                    return;
                }
            }
        }
        let revision: Revision = new Revision(this.owner, author, currentDate);
        revision.revisionType = type;
        revision.revisionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        if (!isNullOrUndefined(spittedRange) && spittedRange.length > 0) {
            this.clearAndUpdateRevisons(spittedRange, revision, spittedRange.indexOf(item));
        } else {
            item.revisions.push(revision);
            revision.range.push(item);
        }
        this.updateRevisionCollection(revision);
    }
    /**
     * Method help to clear previous revisions and include new revision at specified index
     *
     * @param range - range of elements to be cleared
     * @param revision - revision to be inserted
     * @param index - index at which to be included in the revision range
     * @returns {void}
     */
    private clearAndUpdateRevisons(range: object[], revision: Revision, index: number): void {
        for (let i: number = 0; i < range.length; i++) {
            if (range[i] instanceof ElementBox) {
                let currentElement: ElementBox = (range[i] as ElementBox);
                currentElement.revisions.splice(currentElement.revisions.length - 1, 1);
                currentElement.revisions.push(revision);
                revision.range.splice(index + i, 0, currentElement);
            }
        }
    }
    private splitRevisionByElement(item: ElementBox, revision: Revision): object[] {
        if (item.revisions.length > 0) {
            let range: object[] = revision.range;
            let index: number = range.indexOf(item);
            revision.range = range.splice(0, index + 1);
            return range;
        }
        return undefined;
    }
    /**
     * Method to update revision for the splitted text element
     * @param inline - Original text element
     * @param splittedSpan - Splitted element
     */
    private updateRevisionForSpittedTextElement(inline: TextElementBox, splittedSpan: TextElementBox): any {
        for (let i: number = 0; i < inline.revisions.length; i++) {
            let revision: Revision = inline.revisions[i];
            /* eslint-disable @typescript-eslint/no-explicit-any */
            let splittedRange: any = this.splitRevisionByElement(inline, revision);
            this.insertRevision(splittedSpan, revision.revisionType, revision.author, revision.date, splittedRange);
        }
    }
    private isRevisionMatched(item: any, type: RevisionType): boolean {
        let author: string = this.owner.currentUser ? this.owner.currentUser : 'Guest user';
        if (item instanceof Revision) {
            if ((isNullOrUndefined(type) || type === item.revisionType) && item.author === author) {
                return true;
            }
        } else if (item.revisions.length > 0) {
            for (let i: number = 0; i < item.revisions.length; i++) {
                let elementRevision: Revision = item.revisions[i];
                if ((isNullOrUndefined(type) || type === elementRevision.revisionType) && elementRevision.author === author) {
                    return true;
                }
            }
        }
        return false;
    }

    private compareElementRevision(element: any, compare: ElementBox): boolean {
        if (element.revisions.length === 0 || compare.revisions.length === 0) {
            return false;
        }
        for (let i: number = 0; i < element.revisions.length; i++) {
            let currentRevision: Revision = element.revisions[i];
            for (let j: number = 0; j < compare.revisions.length; j++) {

                if (currentRevision.author === compare.revisions[i].author && currentRevision.revisionType === compare.revisions[i].revisionType) {
                    return true;
                }
            }
        }

        return false;
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private canInsertRevision(item: any, type: RevisionType): boolean {
        let revisionType: RevisionType = isNullOrUndefined(type) ? 'Insertion' : type;
        if (revisionType === 'Deletion') {
            return false;
        }
        if (this.owner.enableTrackChanges) {
            return this.isRevisionMatched(item, revisionType);
            //if it has revision
        } else if (item.revisions.length > 0) {
            return false;
        }
        return true;
    }

    private insertRevisionAtEnd(item: ElementBox, newElement: ElementBox, revisionType: RevisionType): boolean {

        if (newElement instanceof BookmarkElementBox || newElement instanceof CommentCharacterElementBox || newElement instanceof EditRangeStartElementBox || newElement instanceof EditRangeEndElementBox) {
            return false;
        }
        item = item.previousValidNodeForTracking;
        if (isNullOrUndefined(item)) {
            return false;
        }
        return this.insertRevisionAtPosition(item, newElement, true, revisionType);
    }

    private insertRevisionAtPosition(item: ElementBox, newElement: ElementBox, isEnd: boolean, revisionType: RevisionType): boolean {
        // if (newElement instanceof FieldElementBox && (newElement as FieldElementBox).fieldType === 2) {
        //     return false;
        // }
        let prevRevisionLength: number = newElement.revisions.length;

        let isRevisionCombined: boolean = this.checkToMapRevisionWithInlineText(item, (isEnd) ? item.length : 0, newElement, false, revisionType);
        // Check to combine with previous and next element
        if (isEnd) {
            if (!isRevisionCombined && newElement.revisions.length === prevRevisionLength) {
                isRevisionCombined = this.checkToMapRevisionWithNextNode(item.nextNode, newElement, false, revisionType);
            }
        } else {
            if (!isRevisionCombined && newElement.revisions.length === prevRevisionLength) {
                isRevisionCombined = this.checkToMapRevisionWithPreviousNode(item.previousNode, newElement, false, revisionType);
            }
        }
        return isRevisionCombined;
    }

    private insertRevisionAtBegining(item: ElementBox, newElement: ElementBox, revisionType: RevisionType): boolean {

        if (newElement instanceof BookmarkElementBox || newElement instanceof CommentCharacterElementBox || newElement instanceof EditRangeStartElementBox || newElement instanceof EditRangeEndElementBox) {
            return false;
        }
        item = item.nextValidNodeForTracking;
        if (isNullOrUndefined(item)) {
            return false;
        }
        return this.insertRevisionAtPosition(item, newElement, false, revisionType);
    }

    private splitRevisionForSpittedElement(element: ElementBox, spittedElement: ElementBox): any {
        for (let i: number = element.revisions.length - 1; i >= 0; i--) {
            let revision: Revision = element.revisions[i];
            let splittedRange: object[] = this.splitRevisionByElement(element, revision);
            this.insertRevision(spittedElement, revision.revisionType, revision.author, revision.date, splittedRange);
        }
    }
    /**
     * Method to combine element revision if not inserts new revision
     */
    // private checkToCombineRevision(element: ElementBox, newElement: ElementBox, revisionType: RevisionType): boolean {
    //     let isCombined: boolean = false;
    //     if (this.isRevisionMatched(element, revisionType)) {
    //         isCombined = true;
    //         this.combineElementRevision(element, newElement, true);
    //     } else {
    //         this.insertRevision(newElement, revisionType);
    //     }
    //     return isCombined;
    // }
    private combineElementRevision(currentElementRevisions: Revision[], elementToCombine: Revision[]): void {
        for (let i: number = 0; i < currentElementRevisions.length; i++) {
            for (let j: number = 0; j < elementToCombine.length; j++) {
                let currentRevision: Revision = currentElementRevisions[i];
                let revisionToCombine: Revision = elementToCombine[i];

                if (currentRevision.author === revisionToCombine.author && currentRevision.revisionType === revisionToCombine.revisionType) {
                    let rangeLength: number = revisionToCombine.range.length;
                    for (let k: number = 0; k < rangeLength; k++) {
                        let item: any = revisionToCombine.range[0];
                        item.revisions.splice(item.revisions.indexOf(revisionToCombine), 1);
                        revisionToCombine.range.splice(0, 1);
                        currentRevision.range.push(item);
                        item.revisions.push(currentRevision);
                    }
                    if (revisionToCombine.range.length === 0) {
                        this.owner.revisions.remove(revisionToCombine);
                    }
                }
            }
        }
    }

    private combineRevisions(block: ParagraphWidget, startPosition: TextPosition, endposition: TextPosition): void {
        if (!this.owner.enableTrackChanges) {
            return;
        }
        let info: LineInfo = this.selection.getLineInfo(block, startPosition.offset);
        let elementInfo: ElementInfo = info.line.getInline(startPosition.offset, 0);
        let currentElement: ElementBox = elementInfo.element;
        if (currentElement.revisions.length > 0) {
            if (this.isRevisionMatched(currentElement, 'Insertion')) {
                let nextElement: ElementBox = currentElement.nextElement;
                if (!isNullOrUndefined(nextElement) && nextElement.revisions.length > 0) {
                    let revision: Revision = currentElement.revisions[currentElement.revisions.length - 1];
                    let range: object[] = nextElement.revisions[nextElement.revisions.length - 1].range;
                    this.clearAndUpdateRevisons(range, revision, revision.range.indexOf(currentElement) + 1);
                }
            }
        }
        // let startOffset: number = startPosition.currentWidget.getOffset(firstElement, 0);
        // let endOffset: number = endposition.currentWidget.getOffset(lastElement, 0);
    }
    /**
     * Method to update the revision for whole block
     *
     * @private
     * @returns {void}
     */
    public insertRevisionForBlock(widget: ParagraphWidget, revisionType: RevisionType, isTOC?: boolean, revision?: Revision): void {
        if (widget.childWidgets.length === 0 || !this.owner.enableTrackChanges) {
            return;
        }
        if (revisionType === 'Deletion') {
            let editPostion: string = this.selection.editPosition;
            let start: TextPosition = this.selection.start.clone();
            let end: TextPosition = this.selection.end.clone();
            for (let i: number = 0; i < widget.childWidgets.length; i++) {
                let line: LineWidget = (widget.childWidgets[i]) as LineWidget;
                this.removeContent(line, 0, this.documentHelper.selection.getLineLength(line));
            }
            this.selection.editPosition = editPostion;
            this.selection.start.setPositionInternal(start);
            this.selection.end.setPositionInternal(end);
            // let textPosition: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(editPostion);
            // this.selection.selectContent(textPosition, true);
            this.removeEmptyLine(widget);
        } else {
            let skipParaMark: boolean = false;
            if (isNullOrUndefined(revision)) {
                let author: string = this.owner.currentUser ? this.owner.currentUser : 'Guest user';
                let currentDate: string = new Date().toISOString();
                revision = new Revision(this.owner, author, currentDate);
                revision.revisionID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                revision.revisionType = revisionType;
            }
            for (let i: number = 0; i < widget.childWidgets.length; i++) {
                let elemets: ElementBox[] = (widget.childWidgets[i] as LineWidget).children;
                if (elemets.length === 0) {
                    let paraIndex: number = widget.containerWidget.childWidgets.indexOf(widget);
                    let prevWidget: ParagraphWidget = undefined;
                    if (paraIndex > 0) {
                        prevWidget = widget.containerWidget.childWidgets[paraIndex - 1] as ParagraphWidget;
                    }
                    if (!isNullOrUndefined(prevWidget) && prevWidget instanceof ParagraphWidget && prevWidget.characterFormat.revisions.length > 0) {
                        if (this.isRevisionMatched(prevWidget.characterFormat, revisionType)) {

                            let mappedRevisions: Revision[] = this.getMatchedRevisionsToCombine(prevWidget.characterFormat.revisions, revisionType);
                            if (mappedRevisions.length > 0) {
                                this.mapMatchedRevisions(mappedRevisions, prevWidget.characterFormat, widget.characterFormat, false);
                                skipParaMark = true;
                                revision = undefined;
                            }
                        }
                    }
                }
                for (let j: number = 0; j < elemets.length; j++) {
                    if (j === 0 && !isTOC) {
                        let prevRevisionCount: number = elemets[i].revisions.length;
                        this.checkToCombineRevisionsinBlocks(elemets[i], true, false, 'Insertion');
                        if (elemets[i].revisions.length > prevRevisionCount) {
                            revision = elemets[i].revisions[elemets[i].revisions.length - 1];
                        } else {
                            elemets[j].revisions.push(revision);
                            revision.range.push(elemets[j]);
                        }
                    } else {
                        elemets[j].revisions.push(revision);
                        revision.range.push(elemets[j]);
                    }
                }
            }
            if (!isTOC && !skipParaMark) {
                widget.characterFormat.revisions.push(revision);
                revision.range.push(widget.characterFormat);
            }
            if (!isNullOrUndefined(revision)) {
                this.updateRevisionCollection(revision);
            }
        }
    }

    private updateRevisionCollection(revision: Revision): void {
        let isInserted: boolean = false;
        let paraIndex: TextPosition = undefined;
        if (this.owner.revisions.changes.indexOf(revision) < 0) {
            if (!this.documentHelper.revisionsInternal.containsKey(revision.revisionID)) {
                this.documentHelper.revisionsInternal.add(revision.revisionID, revision);
            }
            if (this.owner.revisions.changes.length > 0) {
                let currentStart: TextPosition = this.owner.selection.start;
                for (let i: number = 0; i < this.owner.revisions.changes.length; i++) {
                    let currentRange: any = this.owner.revisions.changes[i].range[0];

                    if (currentRange instanceof ElementBox && !isNullOrUndefined((currentRange as ElementBox).line) && (currentRange as ElementBox).line.paragraph.bodyWidget) {

                        paraIndex = this.selection.getElementPosition(this.owner.revisions.changes[i].range[0] as ElementBox).startPosition;
                    } else if (currentRange instanceof WRowFormat) {
                        let rowWidget: TableRowWidget = (currentRange as WRowFormat).ownerBase;
                        let firstCell: TableCellWidget = rowWidget.childWidgets[0] as TableCellWidget;
                        let firstPara: ParagraphWidget = this.selection.getFirstParagraph(firstCell);
                        if (firstPara.bodyWidget) {
                            let selection: Selection = this.documentHelper.selection;
                            this.updateEditPosition(firstCell, selection);
                            paraIndex = this.selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
                        }

                    } else if (currentRange instanceof WCharacterFormat) {
                        let paraWidget: ParagraphWidget = (currentRange as WCharacterFormat).ownerBase as ParagraphWidget;
                        if (paraWidget.lastChild && (paraWidget.lastChild as LineWidget).paragraph.bodyWidget) {
                            let offset: number = paraWidget.getLength();
                            let startPosition: TextPosition = new TextPosition(this.owner);
                            startPosition.setPositionParagraph(paraWidget.lastChild as LineWidget, offset);
                            paraIndex = startPosition;
                        }

                    }
                    if (!isNullOrUndefined(paraIndex) && !isNullOrUndefined(currentStart)) {
                        if (currentStart.isExistBefore(paraIndex)) {
                            isInserted = true;
                            this.owner.revisions.changes.splice(i, 0, revision);
                            break;
                        }
                    }
                }
            }
            if (!isInserted) {
                this.owner.revisions.changes.push(revision);
            }
            this.documentHelper.updateAuthorIdentity();
        }
    }
    /**
     * @private
     * @returns {BodyWidget}
     */
    public insertSection(selection: Selection, selectFirstBlock: boolean): BlockWidget {
        let newSectionFormat: WSectionFormat = this.selection.start.paragraph.bodyWidget.sectionFormat.cloneFormat();
        let lastBlock: BlockWidget;
        let firstBlock: BlockWidget;
        if (selection.start.paragraph.isInsideTable) {
            let table: TableWidget = this.documentHelper.layout.getParentTable(selection.start.paragraph);
            table = table.combineWidget(this.owner.viewer) as TableWidget;
            let insertBefore: boolean = false;
            if (selection.start.paragraph.associatedCell.rowIndex === 0) {
                insertBefore = true;
            }
            let newParagraph: ParagraphWidget = new ParagraphWidget();
            let previousBlock: BlockWidget = table.previousRenderedWidget as BlockWidget;
            if (!insertBefore) {
                lastBlock = this.splitTable(table, selection.start.paragraph.associatedCell.ownerRow);
                this.documentHelper.layout.layoutBodyWidgetCollection(lastBlock.index, lastBlock.containerWidget, lastBlock, false);
                lastBlock = lastBlock.getSplitWidgets().pop() as BlockWidget;
            } else {
                lastBlock = table;
            }
            let insertIndex: number = 0;
            if ((isNullOrUndefined(previousBlock) || !previousBlock.bodyWidget.equals(lastBlock.bodyWidget)) && insertBefore) {
                insertIndex = 0;
                newParagraph.index = 0;
            } else {
                insertIndex = lastBlock.indexInOwner + 1;
                newParagraph.index = lastBlock.index + 1;
            }
            lastBlock.containerWidget.childWidgets.splice(insertIndex, 0, newParagraph);
            newParagraph.containerWidget = lastBlock.containerWidget;
            this.updateNextBlocksIndex(newParagraph, true);
            this.documentHelper.layout.layoutBodyWidgetCollection(newParagraph.index, newParagraph.containerWidget, newParagraph, false);
            lastBlock = newParagraph;
        } else {
            let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
            let selectionStart: string = this.selection.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
            //Split Paragraph
            this.splitParagraphInternal(selection, selection.start.paragraph, selection.start.currentWidget, selection.start.offset);
            this.setPositionForCurrentIndex(selection.start, selectionStart);
            lastBlock = selection.start.paragraph.getSplitWidgets().pop() as BlockWidget;
        }
        //Split body widget
        firstBlock = this.splitBodyWidget(lastBlock.bodyWidget, newSectionFormat, lastBlock).firstChild as BlockWidget;
        if (firstBlock instanceof TableWidget) {
            firstBlock.updateRowIndex(0);
        }
        this.documentHelper.layout.layoutBodyWidgetCollection(firstBlock.index, firstBlock.containerWidget, firstBlock, false);
        if (firstBlock instanceof TableWidget) {
            firstBlock = selection.getFirstParagraphInFirstCell(firstBlock);
        }
        if (selectFirstBlock) {
            selection.selectParagraphInternal(firstBlock as ParagraphWidget, true);
        }
        return firstBlock;
    }
    /**
     * @private
     */
    public splitBodyWidget(bodyWidget: BodyWidget, sectionFormat: WSectionFormat, startBlock: BlockWidget): BodyWidget {
        //let sectionIndex: number;
        //Move blocks after the start block to next body widget
        let newBodyWidget: BodyWidget = this.documentHelper.layout.moveBlocksToNextPage(startBlock);
        //Update SectionIndex for splitted body widget
        this.updateSectionIndex(sectionFormat, newBodyWidget, true);
        // insert New header footer widget in to section index 
        this.insertRemoveHeaderFooter(newBodyWidget.sectionIndex, true);
        if (this.documentHelper.viewer instanceof PageLayoutViewer) {
            //update header and footer for splitted widget

            this.documentHelper.layout.layoutHeaderFooter(newBodyWidget, this.owner.viewer as PageLayoutViewer, newBodyWidget.page);
        }
        //Update Child item index from 0 for new Section
        this.updateBlockIndex(0, newBodyWidget.firstChild as BlockWidget);
        // Start sinfting from first block
        this.owner.viewer.updateClientArea(newBodyWidget.sectionFormat, newBodyWidget.page);
        return newBodyWidget;
    }
    private insertRemoveHeaderFooter(sectionIndex: number, insert: boolean): void {
        if (this.documentHelper.headersFooters[sectionIndex]) {
            // Need to handle further
        } else {
            this.documentHelper.headersFooters[sectionIndex] = {};
        }
    }
    private updateBlockIndex(blockIndex: number, block: BlockWidget): void {
        let blocks: BlockWidget[];
        let sectionIndex: number = block.bodyWidget.sectionIndex;
        do {
            blocks = block.getSplitWidgets() as BlockWidget[];
            for (let i: number = 0; i < blocks.length; i++) {
                blocks[i].index = blockIndex;
            }
            blockIndex++;
            block = blocks.pop().nextRenderedWidget as BlockWidget;
        } while (!isNullOrUndefined(block) && block.bodyWidget.sectionIndex === sectionIndex);
    }
    /**
     * @private
     * @returns {void}
     */
    public updateSectionIndex(sectionFormat: WSectionFormat, startBodyWidget: BodyWidget, increaseIndex: boolean): void {
        let currentSectionIndex: number = startBodyWidget.sectionIndex;
        let blockIndex: number = 0;
        let bodyWidget: BodyWidget = startBodyWidget;
        do {
            if (bodyWidget.index === currentSectionIndex && sectionFormat) {
                bodyWidget.sectionFormat = sectionFormat;
            }
            if (increaseIndex) {
                bodyWidget.index++;
            } else {
                bodyWidget.index--;
            }
            bodyWidget = bodyWidget.nextRenderedWidget as BodyWidget;
        } while (bodyWidget);
    }
    //Auto convert List
    private checkAndConvertList(selection: Selection, isTab: boolean): boolean {
        let list: WList = selection.paragraphFormat.getList();
        if (!isNullOrUndefined(list) || selection.start.paragraph.containerWidget instanceof FootNoteWidget) {
            return false;
        }
        let convertList: boolean = false;
        let isLeadingZero: boolean = false;
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset - 1, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        if (!(inline instanceof TextElementBox)) {
            return false;
        }
        let span: TextElementBox = inline as TextElementBox;
        let text: string = span.text.substring(0, indexInInline);
        let tabValue: number = 0;
        let length: number = 0;
        while (!isNullOrUndefined(span.previousNode)) {

            if (span.previousNode instanceof TextElementBox && (span.previousNode.text === '\t' || span.previousNode.text.trim().length === 0)) {
                (span.previousNode.text === '\t') ? tabValue += 36 : length = span.previousNode.text.length * 2.5;
                span = span.previousNode;
                continue;
            }
            return false;
        }
        span = inline;
        let index: number = 0;
        let tabIndex: number = text.lastIndexOf('\t');
        index = (tabIndex >= 0) ? tabIndex + 1 : text.lastIndexOf(' ') + 1;
        while (span.previousNode instanceof TextElementBox && index === 0) {
            span = span.previousNode as TextElementBox;
            let previousText: string = span.text;
            tabIndex = previousText.lastIndexOf('\t');
            index = (tabIndex >= 0) ? tabIndex + 1 : previousText.lastIndexOf(' ') + 1;
            text = span.text + text;
            text = text.substring(index);
        }

        text = HelperMethods.trimStart(text);
        let numberFormat: string = text.substring(1, 2);

        let previousList: WList = undefined;
        let listLevelPattern: ListLevelPattern = this.getListLevelPattern(text.substring(0, 1));
        if (listLevelPattern !== 'None' && this.checkNumberFormat(numberFormat, listLevelPattern === 'Bullet', text)) {
            convertList = true;
        } else if (this.checkLeadingZero(text)) {
            isLeadingZero = true;
            convertList = true;
        } else {
            previousList = this.checkNextLevelAutoList(text);
            if (!isNullOrUndefined(previousList)) {
                convertList = true;
            }

        }
        if (convertList) {
            this.initComplexHistory('AutoList');
            let paragraph: ParagraphWidget = inline.paragraph as ParagraphWidget;

            selection.start.setPositionParagraph(paragraph.childWidgets[0] as LineWidget, (paragraph.childWidgets[0] as LineWidget).getOffset(inline, indexInInline + 1));
            selection.end.setPositionParagraph(paragraph.childWidgets[0] as LineWidget, 0);
            this.initHistory('Delete');
            this.deleteSelectedContents(selection, false);
            this.reLayout(selection, false);
            let followCharacter: FollowCharacterType = isTab ? 'Tab' : 'Space';
            numberFormat = !isLeadingZero ? '%1' + numberFormat : '%1' + text.substring(text.length - 1, text.length);
            let leadingZeroText: string = text.substring(text.length - 3, text.length - 1);
            listLevelPattern = !isLeadingZero ? listLevelPattern : this.getListLevelPattern(leadingZeroText);
            let listLevel: WListLevel = new WListLevel(undefined);
            listLevel.listLevelPattern = listLevelPattern;
            if (listLevelPattern === 'Bullet') {
                if (text === '*') {
                    listLevel.numberFormat = '\uf0b7';
                    listLevel.characterFormat.fontFamily = 'Symbol';
                } else if (text === '-') {
                    listLevel.numberFormat = '-';
                }
            } else {
                listLevel.numberFormat = numberFormat;
            }
            listLevel.followCharacter = followCharacter;
            let leftIndent: number = selection.paragraphFormat.leftIndent;
            if (tabValue !== 0 || length !== 0) {
                listLevel.paragraphFormat.leftIndent = leftIndent + 18 + tabValue + length;
            } else if (indexInInline > 2) {
                listLevel.paragraphFormat.leftIndent = leftIndent + (indexInInline - 2) * 2.5 + 18;
            } else if (leftIndent > 0) {
                listLevel.paragraphFormat.leftIndent = leftIndent + 18;
            } else {
                listLevel.paragraphFormat.leftIndent = 36;
            }
            listLevel.paragraphFormat.firstLineIndent = -18;
            if ((!isLeadingZero && text.substring(0, 1) === '0') || leadingZeroText === '00') {
                listLevel.startAt = 0;
            } else {
                listLevel.startAt = 1;
            }
            if (!isNullOrUndefined(previousList)) {
                selection.paragraphFormat.setList(previousList);
            } else {
                this.autoConvertList(selection, listLevel);
            }
            if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
                this.editorHistory.updateComplexHistory();
            } else {
                this.reLayout(selection);
            }

        }
        return convertList;
    }
    private checkNextLevelAutoList(text: string): WList {
        let selection: Selection = this.documentHelper.selection;
        let previousList: WList = undefined;
        let convertList: boolean = false;
        let currentParagraph: ParagraphWidget = selection.start.paragraph;
        let prevParagraph: ParagraphWidget = selection.getPreviousParagraphBlock(currentParagraph) as ParagraphWidget;
        let isList: boolean = false;
        while (!isNullOrUndefined(prevParagraph) && prevParagraph instanceof ParagraphWidget) {
            if (prevParagraph.paragraphFormat.listFormat && prevParagraph.paragraphFormat.listFormat.listId !== -1) {
                isList = true;
                break;
            }
            prevParagraph = selection.getPreviousParagraphBlock(prevParagraph) as ParagraphWidget;
        }
        if (isList) {
            let listNumber: string = this.documentHelper.layout.getListNumber(prevParagraph.paragraphFormat.listFormat, true);
            let prevListText: string = listNumber.substring(0, listNumber.length - 1);
            let currentListText: string = text.substring(0, text.length - 1);
            //check if numberFormat equal
            let inputString: number;
            if (listNumber.substring(listNumber.length - 1) !== text.substring(text.length - 1)) {
                convertList = false;
            } else if (currentListText.match(/^[0-9]+$/) && prevListText.match(/^[0-9]+$/)) {
                inputString = parseInt(currentListText, 10);
                if (parseInt(prevListText, 10) === inputString || parseInt(prevListText, 10) + 1 === inputString
                    || parseInt(prevListText, 10) + 2 === inputString) {
                    convertList = true;
                }
            } else if (currentListText.match(/^[a-zA-Z]+$/) && prevListText.match(/^[a-zA-Z]+$/)) {
                if (prevListText.charCodeAt(0) === text.charCodeAt(0) || prevListText.charCodeAt(0) + 1 === text.charCodeAt(0)
                    || prevListText.charCodeAt(0) + 2 === text.charCodeAt(0)) {
                    convertList = true;
                } else if (currentListText.match(/^[MDCLXVImdclxvi]+$/) && prevListText.match(/^[MDCLXVImdclxvi]+$/)) {
                    let prevListNumber: number = this.getNumber(prevListText.toUpperCase());
                    let currentListNumber: number = this.getNumber(currentListText.toUpperCase());
                    if (prevListNumber === currentListNumber || prevListNumber + 1 === currentListNumber
                        || prevListNumber + 2 === currentListNumber) {
                        convertList = true;
                    }
                }
            }
            if (convertList) {
                previousList = this.documentHelper.getListById(prevParagraph.paragraphFormat.listFormat.listId);
            }

        }
        return previousList;
    }
    private getNumber(roman: string): number {
        let conversion: object = { 'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1 };
        let arr: string[] = roman.split('');
        let num: number = 0;
        for (let i: number = 0; i < arr.length; i++) {
            let currentValue: number = conversion[arr[i]];
            let nextValue: number = conversion[arr[i + 1]];
            if (currentValue < nextValue) {
                num -= (currentValue);
            } else {
                num += (currentValue);
            }
        }

        return num;
    }
    private getListLevelPattern(value: string): ListLevelPattern {
        switch (value) {
            case '0':
            case '1':
                return 'Arabic';
            case 'I':
                return 'UpRoman';
            case 'i':
                return 'LowRoman';
            case 'A':
                return 'UpLetter';
            case 'a':
                return 'LowLetter';
            case '*':
            case '-':
                return 'Bullet';
            case '00':
            case '01':
                return 'LeadingZero';
            default:
                return 'None';
        }
    }
    private autoConvertList(selection: Selection, listLevel: WListLevel): void {
        let start: TextPosition = selection.start;
        if (!selection.isForward) {
            start = selection.end;
        }
        let newList: WList = new WList();
        if (this.documentHelper.lists.length > 0) {
            newList.listId = this.documentHelper.lists[this.documentHelper.lists.length - 1].listId + 1;
        } else {
            newList.listId = 0;
        }
        let newAbstractList: WAbstractList = new WAbstractList();
        let layout: DocumentHelper = this.documentHelper;
        if (layout.abstractLists.length > 0) {
            newAbstractList.abstractListId = layout.abstractLists[layout.abstractLists.length - 1].abstractListId + 1;
        } else {
            newAbstractList.abstractListId = 0;
        }
        newList.abstractListId = newAbstractList.abstractListId;
        newList.abstractList = newAbstractList;
        layout.abstractLists.push(newAbstractList);
        newAbstractList.levels.push(listLevel);
        listLevel.ownerBase = newAbstractList;
        selection.paragraphFormat.setList(newList);
        selection.paragraphFormat.listLevelNumber = 0;
    }
    private checkNumberFormat(numberFormat: string, isBullet: boolean, text: string): boolean {
        if (isBullet) {
            return numberFormat === '';
        } else {
            let index: number = text.indexOf(numberFormat);
            return (numberFormat === '.' || numberFormat === ')'
                || numberFormat === '>' || numberFormat === '-') && text.substring(index, text.length - 1) === '';
        }
    }
    private checkLeadingZero(text: string): boolean {
        let j: number;
        let isZero: boolean = false;
        for (let i: number = 0; i <= text.length - 1; i++) {
            if (text.charAt(i) === '0') {
                isZero = true;
                continue;
            }
            j = i;
            break;
        }
        let numberFormat: string = undefined;
        if (text.charAt(j) === '1') {
            numberFormat = text.charAt(j + 1);
        } else {
            numberFormat = text.charAt(j);
        }
        return isZero && this.checkNumberFormat(numberFormat, false, text);
    }
    private getPageFromBlockWidget(block: BlockWidget): Page {
        let page: Page = undefined;
        if (block.containerWidget instanceof BodyWidget) {
            page = (block.containerWidget as BodyWidget).page;
        } else if (block.containerWidget instanceof HeaderFooterWidget) {
            page = (block.containerWidget as HeaderFooterWidget).page;
        } else if (block.containerWidget instanceof TableCellWidget) {
            page = (block.containerWidget as TableCellWidget).bodyWidget.page;
        }
        return page;
    }

    /**
     * @private
     * @returns {void}
     */
    public insertTextInline(element: ElementBox, selection: Selection, text: string, index: number, skipReLayout?: boolean): void {
        if (element instanceof TextElementBox) {
            element.text = HelperMethods.insert(element.text, index, text);
            let paragraph: ParagraphWidget = (element.line as LineWidget).paragraph;
            let lineIndex: number = paragraph.childWidgets.indexOf(element.line);
            let elementIndex: number = element.line.children.indexOf(element);
            if (element.line.paragraph.bidi || this.documentHelper.layout.isContainsRtl(element.line)) {
                this.documentHelper.layout.reArrangeElementsForRtl(element.line, element.line.paragraph.bidi);
            }
            if (isNullOrUndefined(skipReLayout) || !skipReLayout) {
                this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex, element.line.paragraph.bidi);
            }
        } else if (element instanceof ImageElementBox) {
            this.insertImageText(element as ImageElementBox, selection, text, index);
        } else if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                this.insertFieldBeginText(element, selection, text, index);
            } else if (element.fieldType === 2) {
                this.insertFieldSeparatorText(element, selection, text, index);
            } else {
                this.insertFieldEndText(element, selection, text, index);
            }
        } else if (element instanceof BookmarkElementBox || element instanceof EditRangeStartElementBox
            || element instanceof EditRangeEndElementBox) {
            this.insertBookMarkText(element, text);
        }
    }
    private insertFieldBeginText(fieldBegin: FieldElementBox, selection: Selection, text: string, index: number): void {
        let spanObj: TextElementBox = new TextElementBox();
        spanObj.text = text;
        let lineIndex: number = fieldBegin.line.paragraph.childWidgets.indexOf(fieldBegin.line);
        let spanIndex: number = (fieldBegin.line as LineWidget).children.indexOf(fieldBegin);
        spanObj.characterFormat.copyFormat(fieldBegin.characterFormat);
        (fieldBegin.line as LineWidget).children.splice(spanIndex, 0, spanObj);
        spanObj.line = fieldBegin.line;
        this.documentHelper.layout.reLayoutParagraph(fieldBegin.line.paragraph, lineIndex, spanIndex);
    }
    private insertBookMarkText(element: ElementBox, text: string): void {
        let spanObj: TextElementBox = new TextElementBox();
        spanObj.text = text;
        let lineIndex: number = element.line.paragraph.childWidgets.indexOf(element.line);
        let spanIndex: number = (element.line as LineWidget).children.indexOf(element);
        spanObj.characterFormat.copyFormat(element.characterFormat);
        if (element instanceof EditRangeEndElementBox || element instanceof BookmarkElementBox) {
            (element.line as LineWidget).children.splice(spanIndex, 0, spanObj);
        } else {
            (element.line as LineWidget).children.splice(spanIndex + 1, 0, spanObj);
        }
        spanObj.line = element.line;
        this.documentHelper.layout.reLayoutParagraph(element.line.paragraph, lineIndex, spanIndex);
    }

    private insertFieldSeparatorText(fieldSeparator: FieldElementBox, selection: Selection, text: string, index: number): void {
        let previousInline: ElementBox = selection.getPreviousTextInline(fieldSeparator);
        let nextInline: ElementBox = selection.getNextTextInline(fieldSeparator);
        let span: TextElementBox = new TextElementBox();
        span.text = text;
        let spanIndex: number = (fieldSeparator.line as LineWidget).children.indexOf(fieldSeparator);
        if (index === fieldSeparator.length) {
            spanIndex++;
        }
        if (isNullOrUndefined(previousInline) && isNullOrUndefined(nextInline)) {
            span.characterFormat.copyFormat((fieldSeparator.line.paragraph as ParagraphWidget).characterFormat);
        } else if (isNullOrUndefined(previousInline)) {
            span.characterFormat.copyFormat(nextInline.characterFormat);
        } else {
            span.characterFormat.copyFormat(previousInline.characterFormat);
        }
        fieldSeparator.line.children.splice(spanIndex, 0, span);
        span.line = fieldSeparator.line;
        let lineIndex: number = fieldSeparator.line.paragraph.childWidgets.indexOf(fieldSeparator.line);
        this.documentHelper.layout.reLayoutParagraph(fieldSeparator.line.paragraph, lineIndex, spanIndex);
    }
    private insertFieldEndText(fieldEnd: FieldElementBox, selection: Selection, text: string, index: number): void {
        let span: TextElementBox = new TextElementBox();
        span.text = text;
        let spanIndex: number = (fieldEnd.line as LineWidget).children.indexOf(fieldEnd);
        span.characterFormat.copyFormat(fieldEnd.characterFormat);
        fieldEnd.line.children.splice(spanIndex + 1, 0, span);
        span.line = fieldEnd.line;
        let lineIndex: number = fieldEnd.line.paragraph.childWidgets.indexOf(fieldEnd.line);
        if (this.owner.enableTrackChanges) {
            let isBidi: boolean = this.documentHelper.textHelper.getRtlLanguage(text).isRtl;
            let revisionType: RevisionType = 'Insertion';
            let isRevisionCombined: boolean = this.checkToMapRevisionWithInlineText(fieldEnd, index, span, isBidi, revisionType);
            if (!isRevisionCombined && span.revisions.length === 0) {
                isRevisionCombined = this.checkToMapRevisionWithNextNode(fieldEnd.nextNode, span, isBidi, revisionType);
            }
        }
        this.documentHelper.layout.reLayoutParagraph(fieldEnd.line.paragraph, lineIndex, spanIndex);
    }
    private insertImageText(image: ImageElementBox, selection: Selection, text: string, index: number): void {
        let previousInlineObj: ElementBox = selection.getPreviousTextInline(image);
        let nextInlineObj: ElementBox = selection.getNextTextInline(image);
        let line: LineWidget = image.line;
        let element: TextElementBox = new TextElementBox();
        let paragraph: ParagraphWidget = line.paragraph;
        let lineIndex: number = paragraph.childWidgets.indexOf(line);
        element.text = text;
        let spanIndex: number = line.children.indexOf(image);
        if (index === image.length) {
            spanIndex++;
        }
        if (isNullOrUndefined(previousInlineObj) && isNullOrUndefined(nextInlineObj)) {
            element.characterFormat.copyFormat(paragraph.characterFormat);
        } else if (isNullOrUndefined(previousInlineObj)) {
            element.characterFormat.copyFormat(nextInlineObj.characterFormat);
        } else {
            element.characterFormat.copyFormat(previousInlineObj.characterFormat);
        }
        line.children.splice(spanIndex, 0, element);
        element.line = line;
        this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, spanIndex);
    }
    /**
     * @private
     */
    private isListTextSelected(): void {
        if (this.documentHelper.isListTextSelected) {
            this.initComplexHistory('ListSelect');

            if (this.documentHelper.selection.start.paragraph.paragraphFormat.listFormat && this.documentHelper.selection.start.paragraph.paragraphFormat.listFormat.listId !== -1) {
                this.onApplyList(undefined);
            }
        }
    }
    //Auto Format and insert Hyperlink Implementation starts
    private checkAndConvertToHyperlink(selection: Selection, isEnter: boolean, paragraph?: ParagraphWidget): void {
        let text: string;
        let span: TextElementBox;
        if (isEnter) {
            span = (paragraph.lastChild as LineWidget).children[(paragraph.lastChild as LineWidget).children.length - 1] as TextElementBox;
            text = span.text;
        } else {
            let indexInInline: number = 0;
            let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset - 1, indexInInline);
            let inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            if (!(inline instanceof TextElementBox)) {
                return;
            }
            span = inline as TextElementBox;
            text = span.text.substring(0, indexInInline);
        }
        let index: number = 0;
        let tabCharIndex: number = text.lastIndexOf('\t');
        index = (tabCharIndex >= 0) ? tabCharIndex + 1 : text.lastIndexOf(' ') + 1;
        while (span.previousElement instanceof TextElementBox && index === 0) {
            span = span.previousNode as TextElementBox;
            let previousText: string = span.text;
            tabCharIndex = previousText.lastIndexOf('\t');
            index = (tabCharIndex >= 0) ? tabCharIndex + 1 : previousText.lastIndexOf(' ') + 1;
            text = span.text + text;
        }
        text = text.substring(index);
        let lowerCaseText: string = text.toLowerCase();
        let containsURL: boolean = false;
        if (lowerCaseText.substring(0, 8) === 'file:///'
            || (lowerCaseText.substring(0, 7) === 'http://' && lowerCaseText.length > 7)
            || (lowerCaseText.substring(0, 8) === 'https://' && lowerCaseText.length > 8)
            || (lowerCaseText.substring(0, 4) === 'www.' && lowerCaseText.length > 4)
            || (lowerCaseText.substring(0, 3) === '\\' && lowerCaseText.length > 3)
            || (lowerCaseText.substring(0, 7) === 'mailto:' && lowerCaseText.length > 7)) {
            containsURL = true;
            if (lowerCaseText.substring(0, 4) === 'www.' && lowerCaseText.length > 4) {
                text = 'http://' + text;
            }
        } else {
            let atIndex: number = text.indexOf('@');
            let dotIndex: number = text.indexOf('.');
            if (atIndex > 0 && atIndex < dotIndex && dotIndex < text.length - 1) {
                containsURL = true;
                text = 'mailto:' + text;
            }
        }
        if (containsURL) {
            let startPos: TextPosition = new TextPosition(this.documentHelper.owner);
            startPos.setPositionParagraph(span.line, span.line.getOffset(span, index));
            let endPos: TextPosition = new TextPosition(this.documentHelper.owner);
            if (isEnter) {
                endPos.setPositionParagraph(span.line, span.line.getEndOffset());
            } else {
                if (selection.end.currentWidget.children.length === 0 && selection.end.offset === 0) {
                    let prevLine: LineWidget = selection.end.currentWidget.previousLine;
                    endPos.setPositionParagraph(prevLine, prevLine.getEndOffset());
                } else {
                    endPos.setPositionParagraph(selection.end.currentWidget, selection.end.offset - 1);
                }
            }

            this.autoFormatHyperlink(selection, text, startPos, endPos);
        }
    }
    private autoFormatHyperlink(selection: Selection, url: string, startPosition: TextPosition, endPosition: TextPosition): void {
        this.initComplexHistory('AutoFormatHyperlink');
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPosition);
        let start: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.currentHistoryInfo.insertPosition = start;
        }

        // Moves the selection to URL text start and end position.
        selection.start.setPositionInternal(startPosition);
        selection.end.setPositionInternal(endPosition);

        // Preserves the character format for hyperlink field.
        let temp: WCharacterFormat = this.getCharacterFormat(selection);
        let format: WCharacterFormat = new WCharacterFormat();
        format.copyFormat(temp);

        let fieldEnd: FieldElementBox = this.createHyperlinkElement(url, startPosition, endPosition, format);
        // Moves the selection to the end of field end position.
        selection.start.setPositionParagraph(fieldEnd.line, (fieldEnd.line).getOffset(fieldEnd, 1));
        // Moves to next text position. (To achieve common behavior for space and enter).
        selection.start.moveNextPosition();
        selection.end.setPositionInternal(selection.start);
        blockInfo = this.selection.getParagraphInfo(selection.end);
        let end: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.currentHistoryInfo.endPosition = end;
            this.editorHistory.updateComplexHistory();
            this.reLayout(selection);
        } else {
            this.updateComplexWithoutHistory(0, start, end);
        }
    }
    private appylingHyperlinkFormat(selection: Selection): void {
        this.initHistory('Underline');
        this.updateCharacterFormatWithUpdate(selection, 'underline', 'Single', false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.reLayout(selection, false);
        // Applies font color for field result.
        this.initHistory('FontColor');
        this.isForHyperlinkFormat = true;
        this.updateCharacterFormatWithUpdate(selection, 'fontColor', '#0563c1', false);
        this.isForHyperlinkFormat = false;
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.reLayout(selection, false);
    }

    private createHyperlinkElement(url: string, startPosition: TextPosition, endPosition: TextPosition, format: WCharacterFormat): FieldElementBox {
        let selection: Selection = this.selection;
        this.documentHelper.layout.allowLayout = false;
        this.appylingHyperlinkFormat(selection);
        this.documentHelper.layout.allowLayout = true;
        // Adds the field end at the URL text end position.
        let fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.characterFormat.copyFormat(format);
        fieldEnd.line = selection.end.currentWidget;
        selection.start.setPositionInternal(selection.end);
        // this.insertElementInCurrentLine(selection, fieldEnd, true);
        this.initInsertInline(fieldEnd);
        // Moves the selection to URL text start position.        
        selection.start.setPositionInternal(startPosition);
        selection.end.setPositionInternal(selection.start);

        // Adds field begin, field code and field separator at the URL text start position.
        let begin: FieldElementBox = this.insertHyperlinkfield(selection, format, url);
        let lineIndex: number = selection.start.paragraph.childWidgets.indexOf(begin.line);
        let index: number = begin.line.children.indexOf(begin);
        fieldEnd.linkFieldCharacter(this.documentHelper);
        this.documentHelper.layout.reLayoutParagraph(selection.start.paragraph, lineIndex, index);
        return fieldEnd;
    }
    private insertHyperlinkfield(selection: Selection, format: WCharacterFormat, url: string, isBookmark?: boolean): FieldElementBox {
        // Adds field begin, field code and field separator at the URL text start position.
        let begin: FieldElementBox = new FieldElementBox(0);
        begin.characterFormat.copyFormat(format);
        begin.line = selection.start.currentWidget;
        this.initInsertInline(begin);
        let span: TextElementBox = new TextElementBox();
        span.characterFormat.copyFormat(format);
        if (isBookmark) {
            span.text = ' HYPERLINK \\l \"' + url + '\" ';
        } else {
            span.text = ' HYPERLINK \"' + url + '\" ';
        }
        span.line = selection.start.currentWidget;
        this.initInsertInline(span);
        let separator: FieldElementBox = new FieldElementBox(2);
        separator.characterFormat.copyFormat(format);
        separator.line = selection.start.currentWidget;
        this.initInsertInline(separator);
        return begin;
    }
    /**
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public unlinkRangeFromRevision(inline: any, removeCollection?: boolean): void {
        for (let i: number = 0; i < inline.revisions.length; i++) {
            let currentRevision: Revision = inline.revisions[i];
            let rangeIndex: number = currentRevision.range.indexOf(inline);
            if (rangeIndex >= 0) {
                currentRevision.range.splice(rangeIndex, 1);
            }
            if (currentRevision.range.length === 0 && removeCollection) {
                this.owner.revisions.remove(currentRevision);
                if (this.isRemoveRevision && this.documentHelper.revisionsInternal.containsKey(currentRevision.revisionID)) {
                    this.documentHelper.revisionsInternal.remove(currentRevision.revisionID);
                }
            }
        }
    }
    /**
     * @private
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public unlinkWholeRangeInRevision(item: any, revision: Revision): void {
        let currentRevision: Revision = revision;
        item.revisions.splice(item.revisions.indexOf(item), 1);
        let rangeLength: number = currentRevision.range.length;
        for (let rangeIndex: number = 0; rangeIndex < rangeLength; rangeIndex++) {
            currentRevision.range.splice(0, 1);
        }
        if (currentRevision.range.length === 0) {
            this.owner.revisions.remove(currentRevision);
            if (this.isRemoveRevision && this.documentHelper.revisionsInternal.containsKey(currentRevision.revisionID)) {
                this.documentHelper.revisionsInternal.remove(currentRevision.revisionID);
            }
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public unLinkFieldCharacter(inline: ElementBox): void {
        if (inline instanceof FieldElementBox && inline.fieldType === 0) {
            if (inline.fieldEnd) {
                if (this.documentHelper) {
                    this.documentHelper.fieldToLayout = inline;
                    this.documentHelper.fieldEndParagraph = inline.line.paragraph;
                }
                // inline.line.paragraph.addFieldCharacter(inline.fieldEnd);
                if (inline.fieldEnd) {
                    inline.fieldEnd.fieldBegin = undefined;
                }
                inline.fieldEnd = undefined;
            }
        }
        if (inline instanceof FieldElementBox && inline.fieldType === 2) {
            if (!isNullOrUndefined(inline.fieldEnd)) {
                if (this.documentHelper) {
                    this.documentHelper.fieldToLayout = inline.fieldBegin;
                    this.documentHelper.fieldEndParagraph = inline.line.paragraph;
                }
                inline.fieldBegin.fieldSeparator = undefined;
                inline.fieldEnd.fieldSeparator = undefined;
            }
        } else if (inline instanceof FieldElementBox && inline.fieldType === 1) {
            if (inline.fieldBegin) {
                if (!isNullOrUndefined(this.documentHelper)) {
                    this.documentHelper.fieldToLayout = inline.fieldBegin;
                    this.documentHelper.fieldEndParagraph = inline.line.paragraph;
                }
                let fieldIndex: number = this.documentHelper.fields.indexOf(inline.fieldBegin);
                if (fieldIndex !== -1) {
                    this.documentHelper.fields.splice(fieldIndex, 1);
                }
                let formFieldIndex: number = this.documentHelper.formFields.indexOf(inline.fieldBegin);
                if (formFieldIndex !== -1) {
                    this.documentHelper.formFields.splice(formFieldIndex, 1);
                }
                inline.fieldBegin.fieldEnd = undefined;
                inline.fieldBegin = undefined;
            }
        }
    }

    private getCharacterFormat(selection: Selection): WCharacterFormat {
        if (selection.start.paragraph.isEmpty()) {
            return selection.start.paragraph.characterFormat;
        } else {
            let info: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset, 0);
            return info.element.characterFormat;
        }
    }
    /**
     * Insert Hyperlink
     *
     * @param {string} address - Hyperlink URL
     * @param {string} displayText - Display text for the hyperlink
     * @returns {void}
     */
    public insertHyperlink(address: string, displayText?: string): void {
        if (isNullOrUndefined(displayText)) {
            displayText = address;
        }
        this.insertHyperlinkInternal(address, displayText, this.owner.selection.text !== displayText, false);
    }
    /**
     * @private
     */
    public insertHyperlinkInternal(url: string, displayText: string, remove: boolean, isBookmark?: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        if (selection.start.paragraph.associatedCell !== selection.end.paragraph.associatedCell) {
            return;
        }
        if (remove) {
            //Empty selection Hyperlink insert
            this.insertHyperlinkInternalInternal(selection, url, displayText, isBookmark);
        } else {
            //Non-Empty Selection- change the selected text to Field       
            // this.preservedFontCol = this.getFontColor();
            let startPosition: TextPosition = selection.start;
            let endPosition: TextPosition = selection.end;
            if (!selection.isForward) {
                startPosition = selection.end;
                endPosition = selection.start;
            }
            let fieldStartPosition: TextPosition = new TextPosition(this.documentHelper.owner);
            fieldStartPosition.setPositionInternal(startPosition);

            let temp: WCharacterFormat = this.getCharacterFormat(selection);
            let format: WCharacterFormat = new WCharacterFormat(undefined);
            format.copyFormat(temp);
            this.initComplexHistory('InsertHyperlink');
            let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPosition);
            let start: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.editorHistory && this.editorHistory.currentHistoryInfo) {

                this.editorHistory.currentHistoryInfo.insertPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            }
            this.appylingHyperlinkFormat(selection);
            this.documentHelper.layout.allowLayout = true;
            startPosition.setPositionInternal(endPosition);
            // Adds the field end at the URL text end position.
            let fieldEnd: FieldElementBox = new FieldElementBox(1);
            fieldEnd.characterFormat.copyFormat(format);
            fieldEnd.line = selection.end.currentWidget;
            startPosition.setPositionInternal(endPosition);
            // this.insertElementInCurrentLine(selection, fieldEnd, true);
            this.initInsertInline(fieldEnd);
            // Moves the selection to URL text start position.        
            startPosition.setPositionInternal(fieldStartPosition);
            endPosition.setPositionInternal(startPosition);

            // Adds field begin, field code and field separator at the URL text start position.
            let begin: FieldElementBox = this.insertHyperlinkfield(selection, format, url, isBookmark);
            fieldEnd.linkFieldCharacter(this.documentHelper);
            let lineIndex: number = selection.start.paragraph.childWidgets.indexOf(begin.line);
            let index: number = begin.line.children.indexOf(begin);
            this.documentHelper.layout.reLayoutParagraph(selection.start.paragraph, lineIndex, index);
            let lineWidget: LineWidget = fieldEnd.line;
            selection.selects(lineWidget, lineWidget.getOffset(fieldEnd, fieldEnd.length), true);
            blockInfo = this.selection.getParagraphInfo(endPosition);
            let end: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.editorHistory && this.editorHistory.currentHistoryInfo) {

                this.editorHistory.currentHistoryInfo.endPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
                this.editorHistory.updateComplexHistory();
            } else {
                this.updateComplexWithoutHistory(1, start, end);
            }
        }
    }
    private insertHyperlinkInternalInternal(selection: Selection, url: string, displayText: string, isBookmark?: boolean): void {
        if (isNullOrUndefined(selection.start)) {
            return;
        }
        if (this.editHyperlink(selection, url, displayText)) {
            return;
        }
        this.initHistory('InsertHyperlink');
        let isRemoved: boolean = true;
        if (!selection.isEmpty) {
            let isTrackEnabled: boolean = this.owner.enableTrackChanges;
            this.owner.enableTrackChanges = false;
            isRemoved = this.removeSelectedContents(selection);
            this.owner.enableTrackChanges = isTrackEnabled;
        }
        if (isRemoved) {
            // Preserves the character format for hyperlink field.
            let temp: WCharacterFormat = this.getCharacterFormat(selection);
            let format: WCharacterFormat = new WCharacterFormat();
            format.copyFormat(temp);
            this.insertHyperlinkByFormat(selection, url, displayText, format, isBookmark);
        }
        //else
        //    this.Select(Start, true);
    }

    private insertHyperlinkByFormat(selection: Selection, url: string, displayText: string, format: WCharacterFormat, isBookmark?: boolean): void {
        this.updateInsertPosition();
        selection.owner.isShiftingEnabled = true;
        let indexInInline: number = 0;
        //let initial: number = indexInInline;
        let element: ElementBox[] = [];
        let fieldBegin: FieldElementBox = new FieldElementBox(0);
        element.push(fieldBegin);
        let span: TextElementBox = new TextElementBox();
        if (isBookmark) {
            span.text = ' HYPERLINK \\l \"' + url + '\" ';
        } else {
            span.text = ' HYPERLINK \"' + url + '\" ';
        }
        element.push(span);
        let fieldSeparator: FieldElementBox = new FieldElementBox(2);
        element.push(fieldSeparator);
        if (!isNullOrUndefined(displayText) && displayText !== '') {
            span = new TextElementBox();
            span.characterFormat.underline = 'Single';
            span.characterFormat.fontColor = '#0563c1';
            span.text = displayText;
            element.push(span);
        }
        let fieldEnd: FieldElementBox = new FieldElementBox(1);
        element.push(fieldEnd);
        this.insertElement(element);
        //let paragraph: ParagraphWidget = selection.start.paragraph;
        fieldEnd.linkFieldCharacter(this.documentHelper);
        if (this.documentHelper.fields.indexOf(fieldBegin) === -1) {
            this.documentHelper.fields.push(fieldBegin);
        }
        //let offset: number = fieldEnd.line.getOffset(fieldEnd, 1);
        selection.selects(fieldEnd.line, fieldEnd.line.getOffset(fieldEnd, fieldEnd.length), true);
        this.updateEndPosition();
        this.reLayout(selection, true);
    }
    private initInsertInline(element: ElementBox, insertHyperlink?: boolean): void {
        this.initHistory('InsertInline');
        this.insertInlineInSelection(this.documentHelper.selection, element);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
    }

    private insertElementInCurrentLine(selection: Selection, inline: ElementBox): void {
        if (this.checkIsNotRedoing()) {
            selection.owner.isShiftingEnabled = true;
        }
        if (!selection.isEmpty) {
            this.removeSelectedContents(selection);
        }
        this.updateInsertPosition();
        this.insertElement([inline]);
        if (this.checkEndPosition(selection)) {
            this.updateHistoryPosition(selection.start, false);
        }
        this.fireContentChange();
    }
    /**
     * Edit Hyperlink
     * @param {Selection} selection - Specified the selection
     * @param {string} url - Specifies the url
     * @param {string} displayText - Specified the display test
     * @param {boolean} isBookmark - Specifies is bookmark
     * @private
     * @returns {boolean} - Return tru of hyperlink is edited.
     */
    public editHyperlink(selection: Selection, url: string, displayText: string, isBookmark?: boolean): boolean {
        let fieldBegin: FieldElementBox = selection.getHyperlinkField();
        if (isNullOrUndefined(fieldBegin)) {
            return false;
        }
        this.initHistory('InsertHyperlink');
        this.editHyperlinkInternal = isNullOrUndefined(this.editorHistory)
            || (this.editorHistory && isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo));
        let fieldResult: string = '';
        let isNestedField: boolean = false;
        // Preserves the character format for hyperlink field.
        let temp: WCharacterFormat = this.getCharacterFormat(selection);
        let format: WCharacterFormat = new WCharacterFormat();
        format.copyFormat(temp);
        let fieldSeparator: FieldElementBox = undefined;
        if (!isNullOrUndefined(fieldBegin.fieldSeparator)) {
            fieldSeparator = fieldBegin.fieldSeparator;

            let fieldObj: HyperlinkTextInfo = selection.getHyperlinkDisplayText(fieldBegin.fieldSeparator.line.paragraph, fieldBegin.fieldSeparator, fieldBegin.fieldEnd, isNestedField, format);
            fieldResult = fieldObj.displayText;
            isNestedField = fieldObj.isNestedField;
            format = fieldObj.format;
        }
        let offset: number = fieldBegin.line.getOffset(fieldBegin, 0);
        selection.start.setPositionParagraph(fieldBegin.line, offset);
        offset = fieldBegin.fieldEnd.line.getOffset(fieldBegin.fieldEnd, 1);
        selection.end.setPositionParagraph(fieldBegin.fieldEnd.line, offset);
        this.skipFieldDeleteTracking = true;
        this.deleteSelectedContents(selection, false);
        if (!isNestedField && fieldResult !== displayText || isNullOrUndefined(fieldSeparator)) {
            this.insertHyperlinkByFormat(selection, url, displayText, format, isBookmark);
        } else {
            //Modify the new hyperlink url. Inserts field begin, url and field separator.
            this.updateInsertPosition();
            let newFieldBegin: FieldElementBox = new FieldElementBox(0);
            newFieldBegin.characterFormat.copyFormat(fieldBegin.characterFormat);
            newFieldBegin.line = selection.start.currentWidget;
            this.insertInlineInternal(newFieldBegin);
            let span: TextElementBox = new TextElementBox();
            span.characterFormat.copyFormat(fieldBegin.characterFormat);
            if (isBookmark) {
                span.text = ' HYPERLINK \\l \"' + url + '\" ';
            } else {
                span.text = ' HYPERLINK \"' + url + '\" ';
            }
            span.line = selection.start.currentWidget;
            this.insertInlineInternal(span);
            let nodes: IWidget[] = this.editorHistory && this.editorHistory.currentBaseHistoryInfo ?
                this.editorHistory.currentBaseHistoryInfo.removedNodes : this.nodes;
            this.insertClonedFieldResult(selection, nodes, fieldSeparator);
            let fieldEnd: FieldElementBox = selection.end.currentWidget.getInline(selection.end.offset, 0).element as FieldElementBox;
            fieldEnd.linkFieldCharacter(this.documentHelper);
            this.skipFieldDeleteTracking = false;
            let paragraph: ParagraphWidget = newFieldBegin.line.paragraph;
            let lineIndex: number = newFieldBegin.line.paragraph.childWidgets.indexOf(newFieldBegin.line);
            let elementIndex: number = newFieldBegin.line.children.indexOf(newFieldBegin);
            this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
            selection.selects(newFieldBegin.fieldEnd.line, offset, true);
            this.updateEndPosition();
            this.reLayout(selection, true);
        }
        this.editHyperlinkInternal = false;
        this.nodes = [];
        return true;
    }
    private insertClonedFieldResult(selection: Selection, nodes: any, fieldSeparator: FieldElementBox): void {
        let fieldEnd: FieldElementBox;
        let isStarted: boolean = false;
        for (let i: number = nodes.length - 1; i > -1; i--) {
            let node: any = nodes[i] as any;
            if (!isStarted) {
                if (fieldSeparator === node) {
                    isStarted = true;
                } else {
                    if (node instanceof ParagraphWidget && node === fieldSeparator.line.paragraph) {
                        isStarted = true;
                        let paragraph: ParagraphWidget = undefined;
                        if (i === nodes.length - 1) {
                            paragraph = selection.start.paragraph;
                            let fieldParagraph: ParagraphWidget = fieldSeparator.line.paragraph;
                            this.getClonedFieldResultWithSel(fieldParagraph, selection, fieldSeparator);
                        } else {

                            paragraph = this.getClonedFieldResult(fieldSeparator.line.paragraph, fieldSeparator);
                            this.insertParagraph(paragraph, true);
                        }
                        selection.selectParagraphInternal(selection.getNextParagraphBlock(paragraph), true);
                    }
                    continue;
                }
            }
            if (node instanceof ElementBox) {
                this.insertInlineInternal(node.clone());
            } else if (node instanceof BlockWidget) {
                this.insertBlock((node as BlockWidget).clone());
            }
            // else if (node instanceof WSection)
            //     editor.insertSection((node as WSection)._Clone());
        }
    }

    private getClonedFieldResultWithSel(paragraph: ParagraphWidget, selection: Selection, fieldSeparator: ElementBox): void {
        let lineIndex: number = paragraph.childWidgets.indexOf(fieldSeparator.line);
        let elementIndex: number = (paragraph.childWidgets[lineIndex] as LineWidget).children.indexOf(fieldSeparator);
        for (let j: number = lineIndex; j < paragraph.childWidgets.length; j++) {
            let lineWidget: LineWidget = paragraph.childWidgets[j] as LineWidget;
            if (j !== lineIndex) {
                elementIndex = 0;
            }
            for (let i: number = elementIndex; i < lineWidget.children.length; i++) {
                this.insertInlineInternal(lineWidget.children[i].clone());
            }
        }
    }
    private getClonedFieldResult(curParagraph: ParagraphWidget, fieldSeparator: ElementBox): ParagraphWidget {
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.characterFormat.copyFormat(curParagraph.characterFormat);
        paragraph.paragraphFormat.copyFormat(curParagraph.paragraphFormat);
        let lineIndex: number = curParagraph.childWidgets.indexOf(fieldSeparator.line);
        let elementIndex: number = (curParagraph.childWidgets[lineIndex] as LineWidget).children.indexOf(fieldSeparator);
        for (let j: number = lineIndex; j < curParagraph.childWidgets.length; j++) {
            let lineWidget: LineWidget = curParagraph.childWidgets[j] as LineWidget;
            if (j !== lineIndex) {
                elementIndex = 0;
            }
            for (let i: number = elementIndex; i < lineWidget.children.length; i++) {
                (paragraph.childWidgets[0] as LineWidget).children.push(lineWidget.children[i]);
            }
        }
        return paragraph;
    }
    /**
     * Removes the hyperlink if selection is within hyperlink.
     *
     * @returns {void}
     */
    public removeHyperlink(): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        let selection: Selection = this.selection;
        let fieldBegin: FieldElementBox = selection.getHyperlinkField();
        if (isNullOrUndefined(fieldBegin)) {
            return;
        }
        let fieldEnd: FieldElementBox = fieldBegin.fieldEnd;
        let fieldSeparator: FieldElementBox = fieldBegin.fieldSeparator;
        let fieldStartPosition: TextPosition = new TextPosition(selection.owner);

        fieldStartPosition.setPositionParagraph(fieldBegin.line, (fieldBegin.line).getOffset(fieldBegin, 0));
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(fieldStartPosition);
        let fieldStartString: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        let fieldSeparatorPosition: TextPosition = new TextPosition(selection.owner);

        fieldSeparatorPosition.setPositionParagraph(fieldSeparator.line, (fieldSeparator.line).getOffset(fieldSeparator, fieldSeparator.length));
        blockInfo = this.selection.getParagraphInfo(fieldSeparatorPosition);
        let fieldSeparatorString: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        this.initComplexHistory('RemoveHyperlink');
        selection.start.setPositionParagraph(fieldEnd.line, (fieldEnd.line).getOffset(fieldEnd, 0));
        blockInfo = this.selection.getParagraphInfo(selection.start);
        let startIndex: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        selection.end.setPositionInternal(selection.start);
        this.delete();

        selection.start.setPositionInternal(this.selection.getTextPosBasedOnLogicalIndex(fieldSeparatorString));
        this.initHistory('Underline');
        this.updateCharacterFormatWithUpdate(selection, 'underline', 'None', false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        selection.end.setPositionInternal(this.selection.getTextPosBasedOnLogicalIndex(startIndex));
        // Applies font color for field result.
        this.initHistory('FontColor');
        this.updateCharacterFormatWithUpdate(selection, 'fontColor', undefined, false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.reLayout(selection, false);
        selection.end.setPositionInternal(selection.start);
        selection.start.setPositionInternal(this.selection.getTextPosBasedOnLogicalIndex(fieldStartString));
        this.initHistory('Delete');
        this.deleteSelectedContents(selection, false);
        this.reLayout(selection, true);
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
            this.editorHistory.updateComplexHistory();
        }
    }
    //Paste Implementation starts
    /**
     * Paste copied clipboard content on Paste event
     * @param {ClipboardEvent} event - Specifies the paste event
     * @param {any} pasteWindow - Specifies the paste window
     * @private
     */
    public pasteInternal(event: ClipboardEvent, pasteWindow?: any): void {
        this.currentPasteOptions = this.owner.defaultPasteOption;
        if (this.documentHelper.owner.enableLocalPaste) {
            this.paste();
        } else {
            this.selection.isViewPasteOptions = true;
            if (this.selection.pasteElement) {
                this.selection.pasteElement.style.display = 'none';
            }
            if (isNullOrUndefined(pasteWindow)) {
                pasteWindow = window;
            }
            let textContent: string = '';
            let htmlContent: string = '';
            let rtfContent: string = '';
            let clipbordData: DataTransfer = pasteWindow.clipboardData ? pasteWindow.clipboardData : event.clipboardData;
            if (Browser.info.name !== 'msie') {
                rtfContent = clipbordData.getData('Text/Rtf');
                htmlContent = clipbordData.getData('Text/Html');
            }
            this.copiedTextContent = textContent = clipbordData.getData('Text');

            this.previousCharFormat = new WCharacterFormat();
            this.previousCharFormat.copyFormat(this.selection.start.paragraph.characterFormat);
            this.previousParaFormat = new WParagraphFormat();
            this.previousParaFormat.copyFormat(this.selection.start.paragraph.paragraphFormat);
            if (this.documentHelper.protectionType === 'FormFieldsOnly' && this.documentHelper.selection.isInlineFormFillMode()) {
                htmlContent = '';
                rtfContent = '';
            }
            if (rtfContent !== '') {
                this.pasteAjax(rtfContent, '.rtf');
            } else if (htmlContent !== '') {
                let doc: Document = new DOMParser().parseFromString(htmlContent, 'text/html');
                let result: string = new XMLSerializer().serializeToString(doc);
                result = result.replace(/<!--StartFragment-->/gi, '');
                result = result.replace(/<!--EndFragment-->/gi, '');
                // Removed namesapce which is added when using XMLSerializer.
                // When copy content from MS Word, the clipboard html content already have same namespace which cause duplicate namespace
                // Here, removed the duplicate namespace.
                result = result.replace('xmlns="http://www.w3.org/1999/xhtml"', '');
                this.pasteAjax(result, '.html');
            } else if (textContent !== null && textContent !== '') {
                this.pasteContents(textContent);
                this.applyPasteOptions(this.currentPasteOptions);
                this.documentHelper.editableDiv.innerHTML = '';
            } else if (Browser.info.name !== 'msie' && clipbordData.items !== undefined && clipbordData.items.length !== 0 &&
                clipbordData.items[0].type === 'image/png') {
                this.pasteImage(clipbordData.items[0].getAsFile());
            } else if (Browser.info.name === 'msie' && clipbordData.files !== undefined && clipbordData.files.length !== 0 &&
                clipbordData.files[0].type === 'image/png') {
                this.pasteImage(clipbordData.files[0] as File);
            }
            // if (textContent !== '') {
            //     this.pasteContents(textContent);
            //     this.documentHelper.editableDiv.innerHTML = '';
            // }
        }
    }

    private pasteImage(imgFile: File): void {
        let fileReader: FileReader = new FileReader();
        fileReader.onload = (): void => {
            this.onPasteImage(fileReader.result as string);
        };
        fileReader.readAsDataURL(imgFile);
    }
    /**
     * @private
     * @returns {void}
     */
    public onPasteImage(data: string): void {
        let image: HTMLImageElement = document.createElement('img');
        let editor: Editor = this;
        image.addEventListener('load', function (): void {
            editor.insertImage(data, this.width, this.height);
        });
        image.src = data;
    }

    private pasteAjax(content: string, type: string): void {
        let proxy: Editor = this;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let formObject: any = {
            content: content,
            type: type
        };
        let editor: any = this;
        this.pasteRequestHandler = new XmlHttpRequestHandler();
        this.owner.documentHelper.viewerContainer.focus();
        showSpinner(this.owner.element);
        this.pasteRequestHandler.url = proxy.owner.serviceUrl + this.owner.serverActionSettings.systemClipboard;
        this.pasteRequestHandler.responseType = 'json';
        this.pasteRequestHandler.contentType = 'application/json;charset=UTF-8';
        this.pasteRequestHandler.customHeaders = proxy.owner.headers;
        this.pasteRequestHandler.onSuccess = this.pasteFormattedContent.bind(this);
        this.pasteRequestHandler.onFailure = this.onPasteFailure.bind(this);
        this.pasteRequestHandler.onError = this.onPasteFailure.bind(this);
        this.pasteRequestHandler.send(formObject);
    }
    /**
     * @private
     * @returns {void}
     */
    public pasteFormattedContent(result: any): void {
        if (this.isPasteListUpdated) {
            this.isPasteListUpdated = false;
        }
        this.pasteContents(isNullOrUndefined(result.data) ? this.copiedTextContent : result.data);
        if (this.currentPasteOptions !== 'KeepSourceFormatting') {
            this.applyPasteOptions(this.currentPasteOptions);
        }
        hideSpinner(this.owner.element);
        setTimeout((): void => {
            if (!isNullOrUndefined(this.viewer)) {
                this.viewer.updateScrollBars();
            }
        }, 0);
    }
    private onPasteFailure(result: any): void {
        this.owner.fireServiceFailure(result);
        console.error(result.status, result.statusText);
        hideSpinner(this.owner.element);
        this.documentHelper.updateFocus();
    }

    /**
     * Pastes provided sfdt content or the data present in local clipboard if any.
     *
     * @param {string} sfdt? insert the specified sfdt content at current position
     * @returns {void}
     */
    public paste(sfdt?: string, defaultPasteOption?: PasteOptions): void {
        if (isNullOrUndefined(sfdt)) {
            sfdt = this.owner.enableLocalPaste ? this.copiedData : undefined;
        }
        if (!isNullOrUndefined(defaultPasteOption)) {
            this.currentPasteOptions = defaultPasteOption;
        }
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (sfdt) {
            let document: any = JSON.parse(sfdt);
            this.pasteContents(document);
            this.applyPasteOptions(this.currentPasteOptions);
            if (this.chartType) {
                setTimeout((): void => {
                    if (!isNullOrUndefined(this.viewer)) {
                        this.viewer.updateScrollBars();
                    }
                }, 30);
                this.chartType = false;
            }
        }
    }
    private getUniqueListOrAbstractListId(isList: boolean): number {
        if (isList && this.documentHelper.lists.length) {
            let sortedList: WList[] = this.documentHelper.lists.slice().sort((a: any, b: any) => {
                return a.listId - b.listId;
            });
            return sortedList[sortedList.length - 1].listId + 1;
        } else if (this.documentHelper.abstractLists.length) {
            let sortedAbsList: WAbstractList[] = this.documentHelper.abstractLists.slice().sort((a: any, b: any) => {
                return a.abstractListId - b.abstractListId;
            });
            return sortedAbsList[sortedAbsList.length - 1].abstractListId + 1;
        }
        return 0;
    }
    private checkSameLevelFormat(lstLevelNo: number, abstractList: any, list: WList): boolean {
        return abstractList.levels[lstLevelNo].listLevelPattern === list.abstractList.levels[lstLevelNo].listLevelPattern
            && abstractList.levels[lstLevelNo].numberFormat === list.abstractList.levels[lstLevelNo].numberFormat
            && (abstractList.levels[lstLevelNo].listLevelPattern === 'Bullet'
                || abstractList.levels[lstLevelNo].startAt === list.abstractList.levels[lstLevelNo].startAt);
    }
    private listLevelPatternInCollection(lstLevelNo: number, listLevel: any): WList {
        return this.documentHelper.lists.filter((list: WList) => {
            return list.abstractList.levels[lstLevelNo].listLevelPattern === listLevel.listLevelPattern
                && list.abstractList.levels[lstLevelNo].numberFormat === listLevel.numberFormat
                && (listLevel.listLevelPattern === 'Bullet' || list.abstractList.levels[lstLevelNo].startAt === listLevel.startAt)
                && this.isEqualParagraphFormat(list.abstractList.levels[lstLevelNo].paragraphFormat, listLevel.paragraphFormat);
        })[0];
    }
    private isEqualParagraphFormat(source: WParagraphFormat, dest: any): boolean {
        if ((isNullOrUndefined(dest.leftIndent) && source.leftIndent !== 0)
            || (!isNullOrUndefined(dest.leftIndent) && Math.round(source.leftIndent) !== Math.round(dest.leftIndent))) {
            return false;
        }
        if ((isNullOrUndefined(dest.rightIndent) && source.rightIndent !== 0)
            || (!isNullOrUndefined(dest.rightIndent) && Math.round(source.rightIndent) !== Math.round(dest.rightIndent))) {
            return false;
        }
        if ((isNullOrUndefined(dest.firstLineIndent) && source.firstLineIndent !== 0)
            || (!isNullOrUndefined(dest.firstLineIndent) && Math.round(source.firstLineIndent) !== Math.round(dest.firstLineIndent))) {
            return false;
        }
        if ((isNullOrUndefined(dest.beforeSpacing) && source.beforeSpacing !== 0)
            || (!isNullOrUndefined(dest.beforeSpacing) && Math.round(source.beforeSpacing) !== Math.round(dest.beforeSpacing))) {
            return false;
        }
        if ((isNullOrUndefined(dest.afterSpacing) && source.afterSpacing !== 0)
            || (!isNullOrUndefined(dest.afterSpacing) && Math.round(source.afterSpacing) !== Math.round(dest.afterSpacing))) {
            return false;
        }
        if ((isNullOrUndefined(dest.textAlignment) && source.textAlignment !== 'Left')
            || (!isNullOrUndefined(dest.textAlignment) && source.textAlignment !== dest.textAlignment)) {
            return false;
        }
        if ((isNullOrUndefined(dest.bidi) && source.bidi !== false)
            || (!isNullOrUndefined(dest.bidi) && source.bidi !== dest.bidi)) {
            return false;
        }
        if ((isNullOrUndefined(dest.contextualSpacing) && source.contextualSpacing !== false)
            || (!isNullOrUndefined(dest.contextualSpacing) && source.contextualSpacing !== dest.contextualSpacing)) {
            return false;
        }
        if ((isNullOrUndefined(dest.keepWithNext) && source.keepWithNext !== false)
            || (!isNullOrUndefined(dest.keepWithNext) && source.keepWithNext !== dest.keepWithNext)) {
            return false;
        }
        if ((isNullOrUndefined(dest.keepLinesTogether) && source.keepLinesTogether !== false)
            || (!isNullOrUndefined(dest.keepLinesTogether) && source.keepLinesTogether !== dest.keepLinesTogether)) {
            return false;
        }
        if ((isNullOrUndefined(dest.outlineLevel) && source.outlineLevel !== 'BodyText')
            || (!isNullOrUndefined(dest.outlineLevel) && source.outlineLevel !== dest.outlineLevel)) {
            return false;
        }
        if ((isNullOrUndefined(dest.lineSpacing) && source.lineSpacing !== 1)
            || (!isNullOrUndefined(dest.lineSpacing) && Math.round(source.lineSpacing) !== Math.round(dest.lineSpacing))) {
            return false;
        }
        if ((isNullOrUndefined(dest.lineSpacingType) && source.lineSpacingType !== 'Multiple')
            || (!isNullOrUndefined(dest.lineSpacingType) && source.lineSpacingType !== dest.lineSpacingType)) {
            return false;
        }
        return true;
    }
    private getBlocksToUpdate(blocks: any): any[] {
        let blcks: any[] = [];
        for (let i: number = 0; i < blocks.length; i++) {
            let obj: any = blocks[i];
            if (obj.paragraphFormat && obj.paragraphFormat.listFormat
                && Object.keys(obj.paragraphFormat.listFormat).length > 0) {
                blcks.push(obj);
            } else if (obj.rows) {
                for (let j: number = 0; j < obj.rows.length; j++) {
                    let currentRow: any = obj.rows[j];
                    for (let k: number = 0; k < currentRow.cells.length; k++) {
                        let cell: any = currentRow.cells[k];
                        blcks = blcks.concat(this.getBlocksToUpdate(cell.blocks));
                    }
                }
            }
        }
        return blcks;
    }
    private updateListIdForBlocks(blocks: any, abstractList: any, list: WList, id: number, idToUpdate: number): boolean {
        let update: boolean = false;
        for (let i: number = 0; i < blocks.length; i++) {
            let obj: any = blocks[i];
            if (obj.paragraphFormat && obj.paragraphFormat.listFormat
                && Object.keys(obj.paragraphFormat.listFormat).length > 0) {
                let format: any = obj.paragraphFormat.listFormat;

                let existingList: WList = this.listLevelPatternInCollection(format.listLevelNumber, abstractList.levels[format.listLevelNumber]);
                if (format.listId === id) {
                    if (isNullOrUndefined(existingList) && (!list || (list
                        && !this.checkSameLevelFormat(format.listLevelNumber, abstractList, list)))) {
                        update = true;
                        format.listId = idToUpdate;
                    } else if (!isNullOrUndefined(existingList)
                        && this.checkSameLevelFormat(format.listLevelNumber, abstractList, existingList)) {
                        if (!format.isUpdated) {
                            format.listId = existingList.listId;
                            format.isUpdated = true;
                        }
                        update = false;
                    }
                }
            } else if (obj.rows) {
                for (let j: number = 0; j < obj.rows.length; j++) {
                    let row: any = obj.rows[j];
                    for (let k: number = 0; k < row.cells.length; k++) {
                        let cell: any = row.cells[k];
                        let toUpdate: boolean = this.updateListIdForBlocks(cell.blocks, abstractList, list, id, idToUpdate);
                        if (!update) {
                            update = toUpdate;
                        }
                    }
                }
            }
        }

        return update;
    }
    private updatePasteContent(pasteContent: any, sectionId: number): void {
        let uniqueListId: number = this.getUniqueListOrAbstractListId(true);

        if (pasteContent.lists.filter((obj: any): any => { return obj.listId === uniqueListId; }).length > 0) {
            let sortedPasteList: any[] = pasteContent.lists.slice().sort((a: any, b: any) => {
                return a.listId - b.listId;
            });
            uniqueListId = sortedPasteList[sortedPasteList.length - 1].listId + 1;
        }
        let uniqueAbsLstId: number = this.getUniqueListOrAbstractListId(false);
        if (pasteContent.abstractLists.filter((obj: any): any => {
            return obj.abstractListId === uniqueAbsLstId;
        }).length > 0) {
            let sortedPasteAbsList: any[] = pasteContent.abstractLists.slice().sort((a: any, b: any) => {
                return a.abstractListId - b.abstractListId;
            });
            uniqueAbsLstId = sortedPasteAbsList[sortedPasteAbsList.length - 1].abstractListId + 1;
        }
        for (let k: number = 0; k < pasteContent.lists.length; k++) {
            let list: WList = pasteContent.lists[k];
            let abstractList: any = pasteContent.abstractLists.filter((obj: WAbstractList) => {
                return obj.abstractListId === list.abstractListId;
            })[0];
            let lstDup: WList[] = this.documentHelper.lists.filter((obj: any) => {
                return obj.listId === list.listId;
            });
            if (!isNullOrUndefined(abstractList)) {
                let isUpdate: boolean = this.updateListIdForBlocks(pasteContent.sections[sectionId].blocks, abstractList, lstDup[0], list.listId, uniqueListId);
                if (isUpdate) {
                    abstractList.abstractListId = uniqueAbsLstId;
                    list.listId = uniqueListId;
                    list.abstractListId = uniqueAbsLstId;
                    uniqueListId++;
                    uniqueAbsLstId++;
                } else {
                    pasteContent.lists.splice(k, 1);
                    pasteContent.abstractLists.splice(pasteContent.abstractLists.indexOf(abstractList), 1);
                    k--;
                }
            }
        }
        let blocks: any[] = this.getBlocksToUpdate(pasteContent.sections[sectionId].blocks);
        for (let i: number = 0; i < blocks.length; i++) {
            let blck: any = blocks[i];
            delete blck.paragraphFormat.listFormat.isUpdated;
        }
    }
    /**
     * @private
     */

    public getBlocks(pasteContent: any, isPaste: boolean, sections?: BodyWidget[], comments?: CommentElementBox[], revision?: Revision[]): BodyWidget[] {
        let widgets: BodyWidget[] = [];
        if (typeof (pasteContent) === 'string') {
            let startParagraph: ParagraphWidget = this.selection.start.paragraph;
            if (!this.selection.isForward) {
                startParagraph = this.selection.end.paragraph;
            }
            let arr: string[] = [];
            let txt: string = pasteContent;
            txt = txt.replace(/\r\n/g, '\r');
            if (navigator.userAgent.indexOf('Firefox') !== -1) {
                arr = txt.split('\n');
            } else {
                arr = txt.split('\r');
            }
            let widget: BlockWidget[] = [];
            let bodyWidget: BodyWidget = new BodyWidget();
            bodyWidget.sectionFormat = new WSectionFormat(bodyWidget);
            bodyWidget.childWidgets = widget;
            for (let i: number = 0; i < arr.length; i++) {
                if (i === arr.length - 1 && arr[i].length === 0) {
                    continue;
                }
                let currentInline: ElementInfo = this.selection.start.currentWidget.getInline(this.selection.start.offset, 0);
                let element: ElementBox = this.selection.getPreviousValidElement(currentInline.element);
                if (element !== currentInline.element) {
                    element = this.selection.getNextValidElement(currentInline.element);
                }
                let insertFormat: WCharacterFormat = element && element === currentInline.element ? startParagraph.characterFormat :
                    element ? element.characterFormat : this.copyInsertFormat(startParagraph.characterFormat, false);
                if (!isNullOrUndefined(this.previousCharFormat)) {
                    insertFormat = this.previousCharFormat;
                }
                let insertParaFormat: WParagraphFormat = this.documentHelper.selection.copySelectionParagraphFormat();
                if (!isNullOrUndefined(this.previousParaFormat)) {
                    insertParaFormat = this.previousParaFormat;
                }
                let paragraph: ParagraphWidget = new ParagraphWidget();
                paragraph.paragraphFormat.copyFormat(insertParaFormat);
                let line: LineWidget = new LineWidget(paragraph);
                if (arr[i].length > 0) {
                    let textElement: TextElementBox = new TextElementBox();
                    textElement.characterFormat.copyFormat(insertFormat);
                    textElement.text = arr[i];
                    line.children.push(textElement);
                    textElement.line = line;
                }
                paragraph.childWidgets.push(line);
                paragraph.containerWidget = bodyWidget;
                widget.push(paragraph);
            }
            widgets.push(bodyWidget);
        } else {
            this.viewer.owner.parser.addCustomStyles(pasteContent);
            if (pasteContent.comments && pasteContent.comments.length > 0) {
                this.documentHelper.owner.parser.commentsCollection = new Dictionary<string, CommentElementBox>();
                this.documentHelper.owner.parser.commentStarts = new Dictionary<string, CommentCharacterElementBox>();
                this.documentHelper.owner.parser.commentEnds = new Dictionary<string, CommentCharacterElementBox>();
                this.documentHelper.owner.parser.parseComments(pasteContent, comments ? comments : this.documentHelper.comments);
            }
            for (let i: number = 0; i < pasteContent.sections.length; i++) {
                let parser: SfdtReader = this.documentHelper.owner.parser;
                parser.isPaste = isPaste;
                if (!this.isPasteListUpdated && !isNullOrUndefined(pasteContent.lists)) {
                    if (this.documentHelper.lists.length > 0) {
                        this.updatePasteContent(pasteContent, i);
                    }
                    this.isPasteListUpdated = true;
                    if (!isNullOrUndefined(pasteContent.abstractLists)) {
                        parser.parseAbstractList(pasteContent, this.documentHelper.abstractLists);
                    }
                    if (!isNullOrUndefined(pasteContent.lists)) {
                        parser.parseList(pasteContent, this.documentHelper.lists);
                    }
                }
                if (!isNullOrUndefined(pasteContent.revisions)) {
                    if (isPaste) {
                        let revisionChanges: Revision[] = this.viewer.owner.revisionsInternal.changes;
                        if (!isNullOrUndefined(parser.revisionCollection)) {
                            parser.revisionCollection = undefined;
                        }
                        parser.revisionCollection = new Dictionary<string, Revision>();
                        let revisionCollection: Dictionary<string, Revision> = parser.revisionCollection;
                        if (!(this.documentHelper.owner.sfdtExportModule.copyWithTrackChange && parser.isCutPerformed)) {
                            if (pasteContent.revisions.length >= 1) {
                                for (let i: number = 0; i < pasteContent.revisions.length; i++) {
                                    let revisionCheck: boolean = true;
                                    if (revisionCollection.containsKey(pasteContent.revisions[i].revisionId)) {
                                        if (revisionChanges.length > 0) {
                                            for (let j: number = 0; j < revisionChanges.length; j++) {
                                                if (revisionChanges[j].revisionID === pasteContent.revisions[i].revisionId) {
                                                    revisionCheck = false;
                                                }
                                            }
                                        }
                                        if (revisionCheck) {
                                            let revision: Revision = revisionCollection.get(pasteContent.revisions[i].revisionId);
                                            revisionChanges.push(revision);
                                        }
                                    } else {
                                        parser.parseRevisions(pasteContent, revisionChanges);
                                    }
                                }
                            }
                        }
                        this.documentHelper.owner.sfdtExportModule.copyWithTrackChange = false;
                    } else {
                        parser.revisionCollection = this.documentHelper.revisionsInternal;
                        parser.parseRevisions(pasteContent, revision);
                    }
                }
                let bodyWidget: BodyWidget = new BodyWidget();
                bodyWidget.sectionFormat = new WSectionFormat(bodyWidget);
                parser.parseSectionFormat(pasteContent.sections[i].sectionFormat, bodyWidget.sectionFormat);
                if (!isPaste) {
                    sections.unshift(bodyWidget);
                } else {
                    widgets.push(bodyWidget);
                }
                parser.parseBody(pasteContent.sections[i].blocks, bodyWidget.childWidgets as BlockWidget[]);
                parser.isPaste = false;
            }
        }

        if (this.currentPasteOptions === 'MergeWithExistingFormatting') {
            this.applyMergeFormat(widgets);
        }
        return widgets;
    }
    private applyMergeFormat(bodyWidgets: BodyWidget[]): void {
        let startParagraph: ParagraphWidget = this.selection.start.paragraph;
        let currentInline: ElementInfo = this.selection.start.currentWidget.getInline(this.selection.start.offset, 0);
        let element: ElementBox = this.selection.getPreviousValidElement(currentInline.element);
        let insertFormat: WCharacterFormat = element ? element.characterFormat :
            this.copyInsertFormat(startParagraph.characterFormat, false);
        let insertParaFormat: WParagraphFormat = this.documentHelper.selection.copySelectionParagraphFormat();
        for (let k: number = 0; k < bodyWidgets.length; k++) {
            let widgets: BlockWidget[] = bodyWidgets[k].childWidgets as BlockWidget[];
            for (let i: number = 0; i < widgets.length; i++) {
                let widget: BlockWidget = widgets[i];
                if (widget instanceof ParagraphWidget) {
                    widget.paragraphFormat.copyFormat(insertParaFormat);
                    this.applyFormatInternal(widget, insertFormat);
                } else {
                    for (let j: number = 0; j < widget.childWidgets.length; j++) {
                        let row: TableRowWidget = widget.childWidgets[j] as TableRowWidget;
                        for (let k: number = 0; k < row.childWidgets.length; k++) {
                            let cell: TableCellWidget = row.childWidgets[k] as TableCellWidget;
                            for (let l: number = 0; l < cell.childWidgets.length; l++) {
                                this.applyFormatInternal(cell.childWidgets[l] as BlockWidget, insertFormat);
                            }
                        }
                    }
                }
            }
        }
    }

    private applyFormatInternal(widget: BlockWidget, insertFormat: WCharacterFormat): void {
        if (widget instanceof ParagraphWidget) {
            for (let j: number = 0; j < widget.childWidgets.length; j++) {
                let lineWidget: LineWidget = widget.childWidgets[j] as LineWidget;
                for (let k: number = 0; k < lineWidget.children.length; k++) {
                    let inlineCharacterFormat: WCharacterFormat = lineWidget.children[k].characterFormat;
                    let characterFormat: WCharacterFormat = inlineCharacterFormat.cloneFormat();
                    if (isNullOrUndefined(insertFormat.uniqueCharacterFormat)) {
                        lineWidget.children[k].characterFormat = insertFormat;
                    } else {
                        lineWidget.children[k].characterFormat.uniqueCharacterFormat = undefined;
                        lineWidget.children[k].characterFormat.copyFormat(insertFormat);
                    }
                    if (characterFormat.bold) {
                        lineWidget.children[k].characterFormat.bold = characterFormat.bold;
                    }
                    if (characterFormat.italic) {
                        lineWidget.children[k].characterFormat.italic = characterFormat.italic;
                    }
                    if (characterFormat.underline !== 'None') {
                        lineWidget.children[k].characterFormat.underline = characterFormat.underline;
                    }
                }
            }
        } else {
            for (let j: number = 0; j < widget.childWidgets.length; j++) {
                let rowWidget: TableRowWidget = widget.childWidgets[j] as TableRowWidget;
                for (let k: number = 0; k < rowWidget.childWidgets.length; k++) {
                    let cellWidget: TableCellWidget = rowWidget.childWidgets[k] as TableCellWidget;
                    for (let l: number = 0; l < cellWidget.childWidgets.length; l++) {
                        this.applyFormatInternal(cellWidget.childWidgets[l] as BlockWidget, insertFormat);
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    public applyPasteOptions(options: PasteOptions): void {
        if (isNullOrUndefined(this.copiedContent) || this.copiedTextContent === '') {
            return;
        }
        this.isSkipHistory = true;
        this.currentPasteOptions = options;
        this.selection.start.setPositionInternal(this.pasteTextPosition.startPosition);
        this.selection.end.setPositionInternal(this.pasteTextPosition.endPosition);
        switch (options) {
            case 'KeepSourceFormatting':
                this.pasteContents(this.copiedContent !== '' ? this.copiedContent : this.copiedTextContent);
                break;
            case 'MergeWithExistingFormatting':
                let start: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
                let currentFormat: WParagraphFormat = start.paragraph.paragraphFormat;
                this.pasteContents(this.copiedContent !== '' ? this.copiedContent : this.copiedTextContent, currentFormat);
                break;
            case 'KeepTextOnly':
                this.pasteContents(this.copiedTextContent);
                break;
        }
        this.isSkipHistory = false;
    }

    /**
     * @private
     */
    public applyTablePasteOptions(options: TablePasteOptions): void {
        if (isNullOrUndefined(this.copiedContent) || this.copiedTextContent === '') {
            return;
        }
        this.isPaste = true;
        let copiedContent: object = this.copiedContent !== '' ? this.copiedContent : this.copiedTextContent;
        if (this.editorHistory && this.editorHistory.canUndo()) {
            this.editorHistory.undo();
            this.editorHistory.redoStack.pop();
        }
        let widgets: BodyWidget[] = this.getBlocks(copiedContent, true);
        let currentFormat: WParagraphFormat = this.selection.start.paragraph.paragraphFormat;
        switch (options) {
            case 'NestTable':
                this.pasteAsNestedTable(widgets, currentFormat);
                break;
            case 'InsertAsRows':
                this.pasteAsNewRow(widgets[0].childWidgets[0] as TableWidget);
                break;
            case 'InsertAsColumns':
                this.pasteAsNewColumn(widgets[0].childWidgets[0] as TableWidget);
                break;
            case 'OverwriteCells':
                this.pasteOverwriteCell(widgets[0].childWidgets[0] as TableWidget);
                break;
        }
        this.isPaste = false;
    }

    /**
     * @private
     * @returns {void}
     */
    public pasteContents(content: any, currentFormat?: WParagraphFormat): void {
        if (typeof (content) !== 'string') {
            this.copiedContent = content;
        }
        if (this.documentHelper.protectionType === 'FormFieldsOnly' && this.documentHelper.selection.isInlineFormFillMode()) {
            let inline: FieldElementBox = this.selection.getCurrentFormField();
            let resultText: string = this.getFormFieldText();
            let maxLength: number = (inline.formFieldData as TextFormField).maxLength;
            let selectedTextLength: number = this.documentHelper.selection.text.length;
            if (maxLength > 0) {
                if (selectedTextLength === 0) {
                    let contentlength: number = maxLength - resultText.length;
                    content = content.substring(0, contentlength);
                } else if (selectedTextLength > 0) {
                    content = content.substring(0, selectedTextLength);
                }
            }
        }

        this.pasteContentsInternal(this.getBlocks(content, true), true, currentFormat);
        if (content.comments && content.comments.length > 0) {
            this.documentHelper.layout.layoutComments(this.documentHelper.comments);
        }
        this.isInsertField = false;
    }
    private pasteContentsInternal(widgets: BodyWidget[], isPaste: boolean, currentFormat?: WParagraphFormat): void {
        this.isPaste = isPaste;
        let selection: Selection = this.documentHelper.selection;
        if (selection.start.paragraph.isInsideTable && selection.end.paragraph.isInsideTable) {
            let isTablePaste: boolean = false;
            if (widgets.length === 1) {
                let childWidgets: IWidget[] = widgets[0].childWidgets;
                if ((childWidgets.length < 3)) {
                    if (childWidgets.length === 1 && childWidgets[0] instanceof TableWidget || childWidgets.length === 2 && childWidgets[0] instanceof TableWidget && (childWidgets[1] as ParagraphWidget).isEmpty()) {
                        isTablePaste = true;
                    }
                }
            }
            if (isTablePaste) {
                let startCell: TableCellWidget = selection.start.paragraph.associatedCell;
                let endCell: TableCellWidget = selection.end.paragraph.associatedCell;
                let newTable: TableWidget = widgets[0].childWidgets[0] as TableWidget;
                // tslint:disable-next-line:max-line-length
                if (startCell.ownerTable.equals(endCell.ownerTable)) {
                    if (selection.start.paragraph.associatedCell.rowIndex === 0 && selection.end.paragraph.associatedCell.rowIndex === 0
                        && startCell.equals(endCell) && !this.selection.isCellSelected(startCell, selection.start, selection.end)) {
                        this.selection.currentPasteAction = 'InsertAsColumns';
                        this.pasteAsNewColumn(newTable);
                    } else {
                        this.selection.currentPasteAction = 'OverwriteCells';
                        this.pasteOverwriteCell(newTable);
                    }
                    this.isPaste = false;
                    return;
                }
            }
        }
        this.selection.currentPasteAction = 'DefaultPaste';
        this.defaultPaste(widgets as BodyWidget[], currentFormat)
    }

    private defaultPaste(widgets: BodyWidget[], currentFormat?: WParagraphFormat): void {
        let selection: Selection = this.documentHelper.selection;
        let isRemoved: boolean = true;
        if (!this.isSkipHistory) {
            this.initComplexHistory('Paste');
        }
        if (this.documentHelper.isListTextSelected) {
            let paragraph: ParagraphWidget = selection.start.paragraph;
            if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1) {
                this.onApplyList(undefined);
            }
        }
        if (!this.isSkipHistory) {
            this.initHistory('Paste');
        }
        if (!selection.isEmpty || this.documentHelper.isListTextSelected) {
            isRemoved = this.removeSelectedContentInternal(selection, selection.start, selection.end);
        }
        if (isRemoved) {
            this.pasteContent(widgets, currentFormat);
        } else if (this.editorHistory) {
            this.editorHistory.currentBaseHistoryInfo = undefined;
        }

        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.updateHistory();
            this.editorHistory.updateComplexHistory();
        } else {
            this.reLayout(selection, selection.isEmpty);
        }
        this.isPaste = false;
    }

    private pasteAsNewColumn(data: TableWidget): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        if (this.selection.start.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory('PasteColumn');
            }
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let table: TableWidget = startCell.ownerRow.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (this.editorHistory) {
                //Clones the entire table to preserve in history.
                let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
            }
            this.selection.owner.isLayoutEnabled = false;
            let cloneTable: TableWidget = data.clone();
            let rowWidget: TableRowWidget = cloneTable.childWidgets[0] as TableRowWidget;
            let numberOfRows: number = cloneTable.childWidgets.length;
            let numberOfColumns: number = rowWidget.childWidgets.length;
            let cellIndex: number = startCell.columnIndex;
            let startParagraph: ParagraphWidget = undefined;
            let newCell: TableCellWidget = undefined;
            let columnCount: number = numberOfColumns;
            let rowSpannedCells: TableCellWidget[] = [];
            if (numberOfRows > table.childWidgets.length) {
                this.addRows(numberOfRows - table.childWidgets.length, table);
                this.tableUpdate(table);
            } else if (table.childWidgets.length > numberOfRows) {
                this.addRows(table.childWidgets.length - numberOfRows, cloneTable, table);
                this.tableUpdate(table);
            }
            for (let i: number = 0; i < columnCount; i++) {
                for (let j: number = 0; j < table.childWidgets.length; j++) {
                    let row: TableRowWidget = table.childWidgets[j] as TableRowWidget;
                    let rowWidget: TableRowWidget = cloneTable.childWidgets[j] as TableRowWidget;
                    let cellWidget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
                    let cell: TableCellWidget = row.childWidgets[startCell.columnIndex] as TableCellWidget;
                    newCell = this.createColumn(this.selection.getLastParagraph(startCell));
                    newCell.index = j;
                    newCell.rowIndex = row.index;
                    newCell.containerWidget = row; let prevCell: TableCellWidget = row.previousWidget as TableCellWidget;
                    let spannedCell = this.rowspannedCollection(row, rowSpannedCells);

                    if (cell != null) {
                        newCell.cellFormat.copyFormat(cell.cellFormat);
                        newCell.cellFormat.rowSpan = 1;
                    } else if (spannedCell.length > 0) {
                        for (let z: number = 0; z < spannedCell.length; z++) {
                            if (prevCell.rowIndex + (spannedCell[z].cellFormat.rowSpan - 1) >= row.rowIndex) {
                                newCell.cellFormat.copyFormat(spannedCell[z].cellFormat);
                                newCell.cellFormat.rowSpan = 1;
                            }
                        }
                    }

                    cellWidget.containerWidget = newCell.containerWidget;
                    newCell.childWidgets = cellWidget.childWidgets;
                    if (isNullOrUndefined(startParagraph)) {
                        startParagraph = this.selection.getFirstParagraph(newCell);
                    }
                    if (cellIndex === 0) {
                        row.childWidgets.splice(i, 0, newCell);
                    } else {
                        this.insertSpannedCells(row, rowSpannedCells, newCell, cellIndex);
                    }
                }
            }
            this.tableReLayout(table, startParagraph, newCell);
        }
    }

    private pasteAsNestedTable(widgets: BodyWidget[], currentFormat?: WParagraphFormat): void {
        let data: TableWidget = widgets[0].childWidgets[0] as TableWidget;
        if (this.selection.start.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory('PasteNested');
            }
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let table: TableWidget = startCell.ownerRow.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (this.editorHistory) {
                //Clones the entire table to preserve in history.
                this.cloneTableToHistoryInfo(table);
            }
            let startParagraph: ParagraphWidget = undefined;
            let dataTable: TableWidget = data.clone();
            let endCell: TableCellWidget = this.selection.end.paragraph.containerWidget as TableCellWidget;
            let pasteCell: TableCellWidget;
            if (startCell != endCell) {
                let row: TableRowWidget = startCell.ownerRow as TableRowWidget;
                while (row != endCell.ownerRow.nextRow) {
                    for (let cellIndex: number = startCell.columnIndex; cellIndex <= endCell.columnIndex; cellIndex++) {
                        pasteCell = row.childWidgets[cellIndex] as TableCellWidget;
                        let clonedTable: TableWidget = dataTable.clone() as TableWidget;
                        let newPara: ParagraphWidget = new ParagraphWidget();
                        pasteCell.childWidgets = [];
                        pasteCell.childWidgets[0] = clonedTable;
                        pasteCell.childWidgets[1] = newPara;
                        newPara.containerWidget = pasteCell;
                        clonedTable.containerWidget = pasteCell;
                        clonedTable.index = 0;
                        newPara.index = 1;
                        row.childWidgets[cellIndex] = pasteCell;
                        if (isNullOrUndefined(startParagraph)) {
                            startParagraph = this.selection.getFirstParagraph(pasteCell);
                        }
                    }
                    row = row.nextRow;
                }
                this.tableReLayout(table, startParagraph, pasteCell);
            }
            else {
                this.defaultPaste(widgets, currentFormat);
            }
        }
    }

    private pasteOverwriteCell(data: TableWidget): void {
        if (this.selection.start.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory('PasteOverwrite');
            }
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let table: TableWidget = startCell.ownerRow.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (this.editorHistory) {
                //Clones the entire table to preserve in history.
                this.cloneTableToHistoryInfo(table);
            }
            let cloneTable: TableWidget = data.clone();
            // let rowWidget: TableRowWidget = cloneTable.childWidgets[0] as TableRowWidget;
            let numberOfRows: number = cloneTable.childWidgets.length;
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            // let columnCount: number = numberOfColumns;
            // let newCell: TableCellWidget = undefined;
            let coloumnIndexPaste: number = startCell.columnIndex;
            let rowIndexPaste: number = startCell.rowIndex;
            let startParagraph: ParagraphWidget = undefined;
            let row: TableRowWidget = this.selection.start.paragraph.associatedCell.ownerRow as TableRowWidget;
            let rowWidget: TableRowWidget = cloneTable.childWidgets[0] as TableRowWidget;
            let newCells: TableCellWidget;// = rowWidget.childWidgets[0] as TableCellWidget;
            let numberOfColumns: number = rowWidget.childWidgets.length;
            let row2: TableRowWidget = startCell.ownerRow as TableRowWidget;
            if (startCell != endCell) {
                let k: number = 0;
                let rowSpan: number;
                let rowSpanIndex: number;
                let columnSpan: number;
                let cloneCells: TableCellWidget;
                while (row2 != endCell.ownerRow.nextRow) {
                    rowWidget = cloneTable.childWidgets[k] as TableRowWidget || cloneTable.childWidgets[k = 0] as TableRowWidget;
                    let rowWidgetLength: number = rowWidget.childWidgets.length;
                    let cellIndexSE: number = 0;
                    for (let cellIndex: number = startCell.columnIndex; cellIndex <= endCell.columnIndex; cellIndex++) {
                        rowWidget = cloneTable.childWidgets[k] as TableRowWidget;
                        if (rowSpan > 1 && rowSpanIndex === cellIndex) {
                            cellIndex++;
                            rowSpan--;
                            rowSpanIndex = null;
                        }
                        if (columnSpan > 1 && cellIndexSE >= (rowWidgetLength - (columnSpan - 1))) {
                            columnSpan = 1;
                            cellIndex = cellIndex + (columnSpan - 1);
                            cellIndexSE = 0;
                        }
                        newCells = rowWidget.childWidgets[cellIndexSE] as TableCellWidget || rowWidget.childWidgets[cellIndexSE = 0] as TableCellWidget;
                        cloneCells = newCells.clone();
                        let pasteCell: TableCellWidget = row2.childWidgets[cellIndex] as TableCellWidget;
                        for (let x: number = 0; x < cloneCells.childWidgets.length; x++) {
                            let newPara: ParagraphWidget = cloneCells.childWidgets[x] as ParagraphWidget;
                            newPara.containerWidget = pasteCell;
                            cloneCells.childWidgets[x] = newPara;
                        }
                        pasteCell.childWidgets = cloneCells.childWidgets;
                        if (newCells.cellFormat.rowSpan > 1) {
                            rowSpan = newCells.cellFormat.rowSpan;
                            rowSpanIndex = cellIndex;
                        }
                        if (newCells.cellFormat.columnSpan > 1) {
                            columnSpan = newCells.cellFormat.columnSpan;
                        }
                        row2.childWidgets[cellIndex] = pasteCell;
                        if (isNullOrUndefined(startParagraph)) {
                            startParagraph = this.selection.getFirstParagraph(cloneCells);
                        }
                        cellIndexSE++;
                    }
                    row2 = row2.nextRow;
                    k++;
                }
                this.tableReLayout(table, startParagraph, cloneCells);
            }
            else {
                let rowsToAdd: number;
                let rowSpan: number;
                let rowSpanIndex: number;
                let pasteCell: TableCellWidget;
                if (numberOfRows > table.childWidgets.length - rowIndexPaste) {
                    rowsToAdd = numberOfRows - table.childWidgets.length + rowIndexPaste;
                    this.addRows(rowsToAdd, table);
                }
                for (let i: number = 0; i < numberOfRows; i++) {
                    let cellIndex: number = startCell.columnIndex;
                    rowWidget = cloneTable.childWidgets[i] as TableRowWidget;
                    let numberOfColumns: number = rowWidget.childWidgets.length;
                    for (let cellIterate: number = 0; cellIterate < numberOfColumns; cellIterate++) {
                        newCells = rowWidget.childWidgets[cellIterate] as TableCellWidget;
                        let cloneCells: TableCellWidget = newCells.clone();
                        if (rowSpan > 1 && rowSpanIndex === cellIndex) {
                            cellIndex++;
                            rowSpan--;
                            rowSpanIndex = null;
                        }
                        pasteCell = row.childWidgets[cellIndex] as TableCellWidget;
                        if (!pasteCell) {
                            pasteCell = cloneCells;
                            pasteCell.containerWidget = row;
                            pasteCell.index = cellIndex;
                        }
                        for (let index: number = 0; index < cloneCells.childWidgets.length; index++) {
                            let newPara: ParagraphWidget = cloneCells.childWidgets[index] as ParagraphWidget;
                            newPara.containerWidget = pasteCell;
                            cloneCells.childWidgets[index] = newPara;
                        }
                        pasteCell.childWidgets = cloneCells.childWidgets;
                        if (newCells.cellFormat.rowSpan > 1) {
                            rowSpan = newCells.cellFormat.rowSpan;//getting span
                            rowSpanIndex = cellIndex;
                        }
                        row.childWidgets.splice(cellIndex++, 1, pasteCell);
                        if (isNullOrUndefined(startParagraph)) {
                            startParagraph = this.selection.getFirstParagraph(pasteCell);
                        }
                    }
                    row = row.nextRow;
                }
                this.tableReLayout(table, startParagraph, pasteCell);
            }
        }
    }

    private pasteAsNewRow(data: TableWidget): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        if (this.checkIsNotRedoing()) {
            this.initHistory('PasteRow');
        }
        this.documentHelper.owner.isShiftingEnabled = true;
        let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
        let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
        let table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
        let row: TableRowWidget = endCell.ownerRow;
        if (this.editorHistory) {
            this.cloneTableToHistoryInfo(table);
        }
        let rowCount: number = this.getRowCountToInsert();
        let columncount: number = this.getColumnCountToInsert();
        let rows: TableRowWidget[] = [];
        let index: number = row.rowIndex;
        index++;
        let pasteRowCount: number = data.childWidgets.length;
        for (let i: number = 0; i < pasteRowCount; i++) {
            let newRow: TableRowWidget = (data.childWidgets[i] as TableRowWidget).clone();
            if (this.owner.enableTrackChanges) {
                this.insertRevision(newRow.rowFormat, 'Insertion');
            }
            rows.push(newRow);
        }
        table.insertTableRowsInternal(rows, index, false);
        let cellWidget: TableCellWidget = undefined;
        let paragraphWidget: ParagraphWidget = undefined;
        if ((table.childWidgets[index] instanceof TableRowWidget)) {
            cellWidget = ((table.childWidgets[index] as TableRowWidget).firstChild as TableCellWidget);
            paragraphWidget = this.selection.getFirstParagraph(cellWidget);
        } else {
            let widget: Widget = undefined;
            while (!(widget instanceof TableWidget)) {
                widget = table.nextRenderedWidget;
            }
            paragraphWidget = this.selection.getFirstParagraphInFirstCell(widget);
        }
        this.documentHelper.layout.reLayoutTable(table);
        this.selection.selectParagraphInternal(paragraphWidget, true);
        this.reLayout(this.selection, true);
    }

    private tableUpdate(table: TableWidget): void {
        table.isGridUpdated = false;
        table.calculateGrid();
        table.buildTableColumns();
        table.isGridUpdated = true;
    }

    private rowspannedCollection(row: TableRowWidget, rowSpannedCells: TableCellWidget[]) {
        for (let j: number = 0; j < row.childWidgets.length; j++) {
            let rowCell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
            if (rowCell.cellFormat.rowSpan > 1) {
                rowSpannedCells.push(rowCell);
            }
        }
        return rowSpannedCells;
    }

    private insertSpannedCells(row: TableRowWidget, rowSpannedCells: TableCellWidget[], newCell: TableCellWidget, cellIndex: number): void {
        let isCellInserted: boolean = false;
        for (let j: number = 0; j < row.childWidgets.length; j++) {
            let rowCell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
            // Add the row spanned cells to colection for adding column before / after row spnned cells.
            if (rowCell.cellFormat.rowSpan > 1) {
                rowSpannedCells.push(rowCell);
            }
            if (rowCell.columnIndex + rowCell.cellFormat.columnSpan === cellIndex) {
                row.childWidgets.splice(rowCell.cellIndex + 1, 0, newCell);
                isCellInserted = true;
            } else if (cellIndex > rowCell.columnIndex && rowCell.columnIndex + rowCell.cellFormat.columnSpan > cellIndex
                && cellIndex < rowCell.columnIndex + rowCell.cellFormat.columnSpan) {
                row.childWidgets.splice(rowCell.cellIndex + 1, 0, newCell);
                isCellInserted = true;
            }
            if (isCellInserted) {
                break;
            }
        }
        // If the cell is not inserted for row, then check for row spanned cells.
        if (!isCellInserted) {
            if (rowSpannedCells.length > 0) {
                for (let k: number = 0; k < rowSpannedCells.length; k++) {
                    let rowSpannedCell: TableCellWidget = rowSpannedCells[k];
                    if (rowSpannedCell.ownerRow !== row
                        && row.rowIndex <= rowSpannedCell.ownerRow.rowIndex + rowSpannedCell.cellFormat.rowSpan - 1) {
                        if (rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan === cellIndex) {
                            if (rowSpannedCell.cellIndex > row.childWidgets.length) {
                                row.childWidgets.push(newCell);
                            } else {
                                row.childWidgets.splice(rowSpannedCell.cellIndex, 0, newCell);
                            }
                            isCellInserted = true;
                        } else if (cellIndex > rowSpannedCell.columnIndex &&
                            rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan > cellIndex
                            && cellIndex < rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan) {
                            row.childWidgets.splice(rowSpannedCell.columnIndex, 0, newCell);
                            isCellInserted = true;
                        }
                    }
                    if (isCellInserted) {
                        break;
                    }
                }
            }
        }
    }

    private addRows(count: number, table: TableWidget, ownerTable?: TableWidget): void {
        let rowPlacement: RowPlacement = 'Below';
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let isInsertRow: boolean = false;
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        let rows: number = table.childWidgets.length;
        let rowWidget: TableRowWidget = table.childWidgets[rows - 1] as TableRowWidget;
        let column: number = rowWidget.childWidgets.length;
        let cloneTable: TableWidget = ownerTable ? ownerTable : table;
        if (startPos.paragraph.isInsideTable) {
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
            let endCell: TableCellWidget = rowWidget.childWidgets[column - 1] as TableCellWidget;
            let row: TableRowWidget = endCell.ownerRow;
            this.rowInsertion(count, rowPlacement, startCell, endCell, row, table, isInsertRow);
        }
        //this.reLayout(this.selection, true);
    }

    private pasteContent(widgets: BodyWidget[], currentFormat?: WParagraphFormat): void {
        this.documentHelper.owner.isShiftingEnabled = true;
        let insertPosition: string = '';

        this.updateInsertPosition();
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            insertPosition = this.editorHistory.currentBaseHistoryInfo.insertPosition;
        } else {
            let position: TextPosition = this.selection.start;
            if (!this.selection.isForward) {
                position = this.selection.end;
            }
            let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(position);
            insertPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        this.documentHelper.owner.isLayoutEnabled = true;
        this.documentHelper.owner.isPastingContent = true;
        this.pasteCopiedData(widgets, currentFormat);

        let endPosition: string = '';

        this.updateEndPosition();
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            endPosition = this.editorHistory.currentBaseHistoryInfo.endPosition;
        } else {
            let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
            endPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        }
        let startPosition: TextPosition = new TextPosition(this.documentHelper.owner);
        this.setPositionForCurrentIndex(startPosition, insertPosition);
        let end: TextPosition = new TextPosition(this.documentHelper.owner);
        this.setPositionForCurrentIndex(end, endPosition);
        this.pasteTextPosition = { startPosition: startPosition, endPosition: end };
        this.documentHelper.owner.isPastingContent = false;
        this.documentHelper.selection.fireSelectionChanged(true);
    }

    private pasteCopiedData(bodyWidget: BodyWidget[], currentFormat?: WParagraphFormat): void {
        if (this.documentHelper.layout.isBidiReLayout) {
            this.documentHelper.layout.isBidiReLayout = false;
        }
        if (this.isPaste && this.isSectionEmpty(this.selection) && !this.selection.start.paragraph.isInHeaderFooter) {
            this.previousSectionFormat = new WSectionFormat();
            this.previousSectionFormat.copyFormat(this.selection.start.paragraph.bodyWidget.sectionFormat);
            this.selection.start.paragraph.bodyWidget.sectionFormat.copyFormat(bodyWidget[0].sectionFormat);
            this.selection.start.paragraph.bodyWidget.sectionFormat.footerDistance = this.previousSectionFormat.footerDistance;
            this.selection.start.paragraph.bodyWidget.sectionFormat.headerDistance = this.previousSectionFormat.headerDistance;
            if (this.owner.viewer instanceof PageLayoutViewer) {
                let page: Page = this.selection.start.paragraph.bodyWidget.page;
                this.owner.viewer.updatePageBoundingRectangle(this.selection.start.paragraph.bodyWidget, page, page.boundingRectangle.y);
                this.owner.viewer.updateClientArea(this.selection.start.paragraph.bodyWidget.sectionFormat, page);
            }
        }
        for (let k: number = 0; k < bodyWidget.length; k++) {
            let widgets: BlockWidget[] = bodyWidget[k].childWidgets as BlockWidget[];
            for (let j: number = 0; j < widgets.length; j++) {
                let widget: BlockWidget = widgets[j];
                if (widget instanceof ParagraphWidget && widget.childWidgets.length === 0) {
                    widget.childWidgets[0] = new LineWidget(widget as ParagraphWidget);
                }
                if (widget instanceof ParagraphWidget && !isNullOrUndefined(currentFormat)) {
                    widget.paragraphFormat.copyFormat(currentFormat);
                    let insertFormat: WCharacterFormat = this.copyInsertFormat(this.selection.start.paragraph.characterFormat, false);
                    widget.characterFormat.mergeFormat(insertFormat);
                }
                if (j === widgets.length - 1 && widget instanceof ParagraphWidget) {
                    let newParagraph: ParagraphWidget = widget as ParagraphWidget;
                    if (newParagraph.childWidgets.length > 0
                        && (newParagraph.childWidgets[0] as LineWidget).children.length > 0) {
                        let insertPosition: TextPosition = this.selection.start;
                        if ((insertPosition.paragraph.paragraphFormat.textAlignment === 'Center'
                            || insertPosition.paragraph.paragraphFormat.textAlignment === 'Right') &&
                            insertPosition.paragraph.paragraphFormat.listFormat.listId === -1) {
                            insertPosition.paragraph.x = this.owner.viewer.clientActiveArea.x;
                        }
                        if (this.currentPasteOptions === 'KeepTextOnly') {
                            let paraFormat: WParagraphFormat = new WParagraphFormat();
                            this.selection.start.paragraph.paragraphFormat = paraFormat;
                        }
                        this.insertElement((newParagraph.childWidgets[0] as LineWidget).children, newParagraph.paragraphFormat);
                    }
                } else if (widget instanceof BlockWidget) {
                    let startParagraph: ParagraphWidget = this.selection.start.paragraph;
                    let isTable: boolean = widget instanceof TableWidget;
                    if (isTable) {
                        let table: TableWidget = widget as TableWidget;
                        this.generateTableRevision(table);
                        if (startParagraph.isInsideTable) {
                            //Handled to resize table based on parent cell width.
                            let clientWidth: number = startParagraph.getContainerWidth();
                            table.fitCellsToClientArea(clientWidth);
                        }
                        if (startParagraph.isEmpty() && startParagraph.previousWidget instanceof TableWidget) {
                            return this.insertTableRows(table, startParagraph.previousWidget as TableWidget);
                        }
                    }
                    this.insertBlockInternal(widget);
                }
            }
        }
    }
    private generateTableRevision(table: TableWidget): void {
        if (this.owner.enableTrackChanges && !isNullOrUndefined(table)) {
            for (let i = 0; i < table.childWidgets.length; i++) {
                let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                this.insertRevision(row.rowFormat, 'Insertion');
                for (let j = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    for (let k = 0; k < cell.childWidgets.length; k++) {
                        let para: ParagraphWidget = cell.childWidgets[k] as ParagraphWidget;
                        if (!isNullOrUndefined(para)) {
                            this.insertRevisionForBlock(para, 'Insertion');
                        }
                    }
                }
            }
        }
    }

    private isSectionEmpty(selection: Selection): boolean {
        let startParagraph: ParagraphWidget = selection.start.paragraph;
        if (startParagraph) {
            if (startParagraph.isInsideTable || startParagraph.isInHeaderFooter ||
                startParagraph !== selection.end.paragraph) {
                return false;
            }
            let bodyWidget: BodyWidget = startParagraph.bodyWidget;
            if (bodyWidget) {
                let page: Page = bodyWidget.page;
                if (page) {
                    if ((isNullOrUndefined(page.previousPage) || page.previousPage.sectionIndex !== page.sectionIndex)
                        && isNullOrUndefined(page.nextPage) && startParagraph.isEmpty() &&
                        bodyWidget.childWidgets.length === 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Insert table on undo
     *
     * @param {TableWidget} table - Specifies the table
     * @param {TableWidget} newTable - Speciefies the new table
     * @param {boolean} moveRows - Specifies the new row
     * @private
     * @private {void}
     */
    public insertTableInternal(table: TableWidget, newTable: TableWidget, moveRows: boolean): void {
        //Gets the index of current table.
        let insertIndex: number = table.getIndex();
        if (moveRows) {
            //Moves the rows to table.
            for (let i: number = 0, index: number = 0; i < table.childWidgets.length; i++, index++) {
                let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                newTable.childWidgets.splice(index, 0, row);
                row.containerWidget = newTable;
                table.childWidgets.splice(i, 1);
                i--;
            }
        }
        let owner: Widget = table.containerWidget;
        //remove old table revisions if it is present.
        this.constructRevisionsForTable(table, false);
        this.removeBlock(table, true);
        //Inserts table in the current table position.        
        let blockAdvCollection: IWidget[] = owner.childWidgets;
        blockAdvCollection.splice(insertIndex, 0, newTable);
        newTable.index = table.index;
        table.containerWidget = undefined;
        newTable.containerWidget = owner;
        this.documentHelper.layout.clearTableWidget(newTable, true, true, true);
        newTable.buildTableColumns();
        this.constructRevisionsForTable(newTable, true);
        newTable.isGridUpdated = true;
        this.updateNextBlocksIndex(newTable, true);
        this.documentHelper.layout.linkFieldInTable(newTable);
        this.documentHelper.layout.layoutBodyWidgetCollection(newTable.index, owner as Widget, newTable, false);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private canConstructRevision(item: any): boolean {
        if ((item.revisions.length > 0 && item.revisions[0].range.length === 0) || item.removedIds.length > 0) {
            return true;
        }
        return false;
    }
    private constructRevisionsForTable(table: TableWidget, canConstructRevision: boolean): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (canConstructRevision) {
                if (this.canConstructRevision(rowWidget.rowFormat)) {
                    this.constructRevisionFromID(rowWidget.rowFormat, true);
                }
                for (let rowIndex: number = 0; rowIndex < rowWidget.childWidgets.length; rowIndex++) {
                    let cellWidget: TableCellWidget = rowWidget.childWidgets[rowIndex] as TableCellWidget;
                    for (let paraIndex: number = 0; paraIndex < cellWidget.childWidgets.length; paraIndex++) {
                        if (cellWidget.childWidgets[paraIndex] instanceof ParagraphWidget) {
                            this.constructRevisionsForBlock(cellWidget.childWidgets[paraIndex] as ParagraphWidget, canConstructRevision);
                        }
                    }
                }
            } else {
                this.removeDeletedCellRevision(rowWidget);
            }
        }
    }

    private constructRevisionsForBlock(paragraph: ParagraphWidget, canConstructRevision: boolean): void {
        for (let linIndex: number = 0; linIndex < paragraph.childWidgets.length; linIndex++) {
            let lineWidget: LineWidget = paragraph.childWidgets[linIndex] as LineWidget;
            for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                if (canConstructRevision) {

                    if (lineWidget.children[elementIndex] instanceof ElementBox && this.canConstructRevision(lineWidget.children[elementIndex])) {
                        this.constructRevisionFromID(lineWidget.children[elementIndex], true);
                    }
                }
            }
        }
        if (this.canConstructRevision(paragraph.characterFormat)) {
            this.constructRevisionFromID(paragraph.characterFormat, true);
        }
    }
    /**
     * @private
     * @param paraWidget 
     * @param startoffset 
     * @param endoffset 
     * @param revisionId 
     * @param isParaMarkIncluded 
     * @returns {void}
     */

    public applyRevisionForCurrentPara(paraWidget: ParagraphWidget, startoffset: number, endoffset: number, revisionId: string, isParaMarkIncluded: boolean): void {
        let elementInfo: ElementInfo = paraWidget.getInline(startoffset + 1, 0);
        let currentElement: ElementBox = elementInfo.element;
        let skipElement: boolean = false;
        if (startoffset === paraWidget.getLength()) {
            skipElement = true;
        }
        let endElement: ElementBox = paraWidget.getInline(endoffset, 0).element;
        if (endoffset > paraWidget.getLength()) {
            isParaMarkIncluded = true;
        }
        if (!isNullOrUndefined(currentElement) && !isNullOrUndefined(endElement)) {
            if (!skipElement && currentElement === endElement) {
                currentElement.removedIds.push(revisionId);
                this.constructRevisionFromID(currentElement, true);
            } else {
                while (!isNullOrUndefined(currentElement) && currentElement !== endElement) {
                    if (!skipElement) {
                        currentElement.removedIds.push(revisionId);
                        this.constructRevisionFromID(currentElement, true);
                    }
                    if (!isNullOrUndefined(currentElement.nextNode)) {
                        currentElement = currentElement.nextNode.nextValidNodeForTracking;
                    }
                    skipElement = false;
                }
                if (!isNullOrUndefined(currentElement) && !skipElement) {
                    currentElement.removedIds.push(revisionId);
                    this.constructRevisionFromID(currentElement, true);
                }
            }
        } else if (!isNullOrUndefined(currentElement) && !skipElement) {
            currentElement.removedIds.push(revisionId);
            this.constructRevisionFromID(currentElement, true);
        } else if (!isNullOrUndefined(endElement)) {
            endElement.removedIds.push(revisionId);
            this.constructRevisionFromID(endElement, true);
        }
        if (isParaMarkIncluded) {
            paraWidget.characterFormat.removedIds.push(revisionId);
            this.constructRevisionFromID(paraWidget.characterFormat, true);
        }
    }
    /**
     * Insert table on undo
     *
     * @param {Selection} selection - Specified the selection
     * @param {WBlock} block - Spcifies the block
     * @param {WTable} table - Specifies the table.
     * @private
     * @returns {void}
     */
    public insertBlockTable(selection: Selection, block: BlockWidget, table: TableWidget): void {
        let offset: number = selection.start.offset;
        let lineIndex: number = selection.start.paragraph.childWidgets.indexOf(selection.start.currentWidget);
        if (block instanceof ParagraphWidget && offset > 0) {
            //Moves the inline items before selection start to the inserted paragraph.

            this.moveInlines(selection.start.paragraph, block as ParagraphWidget, 0, 0, selection.start.paragraph.firstChild as LineWidget, offset, selection.start.currentWidget);
            selection.selectParagraphInternal(selection.start.paragraph, true);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(this.selection.getHierarchicalIndex((block as ParagraphWidget), offset.toString()), true);
            }
        }
        if (offset > 0 && this.checkInsertPosition(selection)) {
            this.updateHistoryPosition(selection.start, true);
        }
        let index: number = table.indexInOwner;
        (table.containerWidget as Widget).childWidgets.splice(index, 0, block);
        block.containerWidget = table.containerWidget;
        block.index = table.index;
        this.updateNextBlocksIndex(block, true);

        this.documentHelper.layout.layoutBodyWidgetCollection(block.index, block.containerWidget as Widget, block, false);
        if (this.checkInsertPosition(selection)) {
            let paragraph: BlockWidget = undefined;
            if (block instanceof ParagraphWidget) {
                paragraph = block as ParagraphWidget;
            }
            if (block instanceof TableWidget) {
                paragraph = selection.getFirstParagraphInFirstCell(block as TableWidget);
            }
            this.updateHistoryPosition(this.selection.getHierarchicalIndex(paragraph, '0'), true);
        }
    }
    /**
     * On cut handle selected content remove and relayout
     *
     * @param {Selection} selection - Specified the selection
     * @private
     * @returns {void}
     */
    public handleCut(selection: Selection): void {
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        // this.owner.isShiftingEnabled = true;
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPosition);
        selection.editPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        let image: ImageElementBox = undefined;
        if (startPosition.paragraph === endPosition.paragraph && startPosition.offset + 1 === endPosition.offset) {
            //Gets selected image and copy image to clipboard.
            let index: number = 0;
            let currentInline: ElementInfo = startPosition.paragraph.getInline(endPosition.offset, index);
            let inline: ElementBox = currentInline.element;
            image = inline as ImageElementBox;
        }
        this.initHistory('Cut');
        selection.owner.isShiftingEnabled = true;
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(selection.editPosition, true);
            }
        }
        this.deleteSelectedContent(endPosition.paragraph, selection, startPosition, endPosition, 3);
        let textPosition: TextPosition = new TextPosition(selection.owner);
        this.setPositionForCurrentIndex(textPosition, selection.editPosition);
        selection.selectContent(textPosition, true);
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            if (this.checkEndPosition(selection)) {
                this.updateHistoryPosition(selection.end, false);
            }
        }
        this.reLayout(selection);
    }

    private insertInlineInternal(element: ElementBox, revisionType?: RevisionType): void {
        let selection: Selection = this.selection;
        let length: number = element.length;
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
        revisionType = (isNullOrUndefined(revisionType) ? 'Insertion' : revisionType);
        if (selection.start.paragraph.isEmpty()) {
            let paragraph: ParagraphWidget = selection.start.paragraph as ParagraphWidget;
            if ((paragraph.paragraphFormat.textAlignment === 'Center' || paragraph.paragraphFormat.textAlignment === 'Right')
                && paragraph.paragraphFormat.listFormat.listId === -1) {
                paragraph.x = this.owner.viewer.clientActiveArea.x;
            }

            let isUndoing: boolean = !isNullOrUndefined(this.editorHistory) ? (this.editorHistory.isUndoing || this.editorHistory.isRedoing) : false;
            (paragraph.childWidgets[0] as LineWidget).children.push(element);
            element.line = (paragraph.childWidgets[0] as LineWidget);
            if (this.owner.enableTrackChanges && element.isValidNodeForTracking && !isUndoing) {
                this.insertRevision(element, revisionType);
            }
            if (element.removedIds.length > 0 || isUndoing) {
                this.constructRevisionFromID(element, true);
            }
            element.linkFieldCharacter(this.documentHelper);
            if (element instanceof FootnoteElementBox) {
                if (element.footnoteType === 'Footnote') {
                    this.updateFootnoteCollection(element);
                }
                if (element.footnoteType === 'Endnote') {
                    this.updateEndnoteCollection(element);
                }
            }
            this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0, undefined, undefined);
        } else {
            let indexInInline: number = 0;
            let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset, indexInInline);
            let curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            this.insertElementInternal(curInline, element, indexInInline, revisionType, true);
        }
        this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);
    }
    private insertElement(element: ElementBox[], paragraphFormat?: WParagraphFormat): void {
        let selection: Selection = this.selection;
        let length: number = 0;
        let paragraph: ParagraphWidget = undefined;
        let lineIndex: number = -1;
        let lineWidget: LineWidget = undefined;
        let insertIndex: number = 0;
        let begin: boolean = undefined;
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
        let isTrackingEnabled: boolean = this.owner.enableTrackChanges;
        let curInline: ElementBox = undefined;
        let prevElement: TextElementBox = undefined;
        let indexInInline: number = 0;
        if (selection.start.paragraph.isEmpty()) {
            paragraph = selection.start.paragraph as ParagraphWidget;
            lineWidget = (paragraph.childWidgets[0] as LineWidget);
            lineIndex = 0;
        } else {
            let bidi: boolean = selection.start.paragraph.paragraphFormat.bidi;
            let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset, indexInInline, bidi);
            curInline = inlineObj.element;
            indexInInline = inlineObj.index;
            paragraph = curInline.line.paragraph;
            lineIndex = paragraph.childWidgets.indexOf(curInline.line);
            insertIndex = curInline.indexInOwner;
            lineWidget = curInline.line;
            let isRtl: boolean = false;
            if (curInline instanceof TextElementBox) {
                isRtl = this.documentHelper.textHelper.getRtlLanguage(curInline.text).isRtl;
            }
            if (indexInInline === curInline.length) { // Add new Element in current 
                if (!bidi) {
                    insertIndex++;
                }
                begin = false;
            } else if (indexInInline === 0) {
                if (isRtl && bidi && this.isInsertField) {
                    insertIndex++;
                } else if (isNullOrUndefined(curInline.previousNode)) {
                    insertIndex = 0;
                }
                begin = true;

            } else {
                insertIndex++;
                prevElement = new TextElementBox();
                prevElement.characterFormat.copyFormat(curInline.characterFormat);
                if (bidi && this.isInsertField && isRtl) {
                    prevElement.text = (curInline as TextElementBox).text.slice(0, indexInInline);
                    (curInline as TextElementBox).text = (curInline as TextElementBox).text.substring(indexInInline);
                } else {
                    prevElement.text = (curInline as TextElementBox).text.substring(indexInInline);
                    (curInline as TextElementBox).text = (curInline as TextElementBox).text.slice(0, indexInInline);
                }
                if (curInline.revisions.length > 0 && !this.owner.enableTrackChanges) {
                    this.splitRevisionForSpittedElement(curInline, prevElement);
                }
                lineWidget.children.splice(insertIndex, 0, prevElement);
                prevElement.line = curInline.line;
            }
        }
        for (let i: number = 0; i < element.length; i++) {
            length += element[i].length;
            if (element[i] instanceof TextElementBox && (element[i] as TextElementBox).text.indexOf(' ') >= 0) {
                this.documentHelper.triggerSpellCheck = true;
            }
            let prevRevisionsCount: number = element[i].revisions.length;
            element[i].ischangeDetected = true;
            lineWidget.children.splice(insertIndex, 0, element[i]);
            element[i].line = lineWidget;
            element[i].linkFieldCharacter(this.documentHelper);

            let isRevisionCombined: boolean = this.updateRevisionForElement(curInline, element[i], indexInInline, (i === 0) ? true : false, prevElement, begin);
            //Check to combine elements with previous / next para
            if (isTrackingEnabled && !isRevisionCombined && element[i].revisions.length === prevRevisionsCount) {
                //if (!(element[i] instanceof FieldElementBox && (element[i] as FieldElementBox).fieldType === 2)) {

                this.checkToCombineRevisionsinBlocks(element[i], prevRevisionsCount === element[i].revisions.length, (i > 0 && i === element.length - 1), 'Insertion');
                //}
            }
            curInline = element[i];
            insertIndex++;
        }
        if (paragraphFormat && (isNullOrUndefined(paragraph.paragraphFormat.listFormat.list) ||
            (!isNullOrUndefined(paragraph.paragraphFormat.listFormat) && paragraph.paragraphFormat.listFormat.listId === -1))) {
            paragraph.paragraphFormat.copyFormat(paragraphFormat);
        }

        this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, 0, this.isInsertField ? undefined : paragraph.paragraphFormat.bidi);
        this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);
    }

    private updateRevisionForElement(currentElement: ElementBox, newElement: ElementBox, indexInInline: number, isFirstItem: boolean, prevElement: TextElementBox, isBeginning?: boolean): boolean {
        if (!this.owner.enableTrackChanges) {
            return false;
        }
        if (isNullOrUndefined(currentElement) && isNullOrUndefined(prevElement)) {
            return false;
        }
        let isMiddle: boolean = isNullOrUndefined(isBeginning) ? true : false;
        let prevRevisionCount: number = newElement.revisions.length;
        if (isFirstItem) {
            if (isMiddle) {

                let isRevisionCombined: boolean = this.checkToMapRevisionWithInlineText(currentElement, indexInInline, newElement, false, 'Insertion');
                if (isRevisionCombined || newElement.revisions.length > prevRevisionCount) {
                    this.copyElementRevision(currentElement, prevElement, true);
                } else if (newElement.revisions.length === 0) {
                    this.splitRevisionForSpittedElement(currentElement, prevElement);
                    this.insertRevision(newElement, 'Insertion');
                }
            } else if (isBeginning) {
                return this.insertRevisionAtBegining(currentElement, newElement, 'Insertion');
            } else {
                return this.insertRevisionAtEnd(currentElement, newElement, 'Insertion');
            }
        } else {
            // if (currentElement instanceof FieldElementBox && currentElement.fieldType === 2) {
            //     currentElement = (currentElement as FieldElementBox).previousElement;
            // }
            return this.insertRevisionAtEnd(currentElement, newElement, 'Insertion');
        }
        return false;
    }

    private insertElementInternal(element: ElementBox, newElement: ElementBox, index: number, revisionType: RevisionType, relayout?: boolean): void {
        let line: LineWidget = element.line;
        let paragraph: ParagraphWidget = line.paragraph;
        let lineIndex: number = line.indexInOwner;
        let insertIndex: number = element.indexInOwner;
        let isBidi: boolean = paragraph.paragraphFormat.bidi && element.isRightToLeft;
        let isEqualFormat: boolean = false;
        revisionType = isNullOrUndefined(revisionType) ? 'Insertion' : revisionType;

        let isUndoing: boolean = this.skipTracking();
        let isTrackingEnabled: boolean = this.owner.enableTrackChanges;
        let isRevisionCombined: boolean = false;
        let prevRevisionCount: number = newElement.revisions.length;
        if (this.owner.editorHistory && (this.owner.editorHistory.isUndoing || this.owner.editorHistory.isRedoing)
            && newElement instanceof TextElementBox) {
            isEqualFormat = element.characterFormat.isEqualFormat(newElement.characterFormat)
                && this.documentHelper.textHelper.isRTLText(newElement.text);
        }
        if (!isEqualFormat) {
            if (index === element.length) {
                // Add new Element in current 
                insertIndex = this.incrementCommentIndex(isBidi, element, insertIndex);
                if (newElement.removedIds.length > 0 || isUndoing) {
                    this.constructRevisionFromID(newElement, true, element);
                } else if (isTrackingEnabled && !isUndoing && !this.skipFieldDeleteTracking) {
                    isRevisionCombined = this.insertRevisionAtEnd(element, newElement, revisionType);
                }

                line.children.splice(insertIndex, 0, newElement);
            } else if (index === 0) {
                if (newElement.removedIds.length > 0) {
                    this.constructRevisionFromID(newElement, false);
                } else if (isTrackingEnabled && !isUndoing && !this.skipFieldDeleteTracking) {
                    isRevisionCombined = this.insertRevisionAtBegining(element, newElement, revisionType);
                }
                if (isNullOrUndefined(element.previousNode)) {
                    element.line.children.splice(0, 0, newElement);
                    insertIndex = 0;
                } else {
                    element.line.children.splice(insertIndex, 0, newElement);
                }
            } else {
                insertIndex = this.incrementCommentIndex(isBidi, element, insertIndex);                
                let textElement: TextElementBox = new TextElementBox();
                textElement.characterFormat.copyFormat(element.characterFormat);
                textElement.text = (element as TextElementBox).text.substring(index);
                if (element.revisions.length > 0 && !isTrackingEnabled && !isUndoing && newElement.removedIds.length === 0) {
                    this.splitRevisionForSpittedElement(element, textElement);
                }
                (element as TextElementBox).text = (element as TextElementBox).text.substr(0, index);
                line.children.splice(insertIndex, 0, textElement);
                textElement.line = element.line;
                isRevisionCombined = true;
                this.isTrackingFormField = element.previousElement instanceof FieldElementBox ? true : false;
                if (newElement.removedIds.length > 0 && !this.isTrackingFormField) {
                    this.constructRevisionFromID(newElement, false);
                    this.copyElementRevision(element, textElement, true);
                } else if (this.owner.enableTrackChanges) {

                    if (!(newElement instanceof BookmarkElementBox) && !(newElement instanceof CommentCharacterElementBox) && !(newElement instanceof EditRangeStartElementBox) && !(newElement instanceof EditRangeEndElementBox)) {

                        let isRevisionCombined: boolean = this.checkToMapRevisionWithInlineText(element, index, newElement, isBidi, revisionType);
                        if (isRevisionCombined || newElement.revisions.length > prevRevisionCount) {
                            this.copyElementRevision(element, textElement, true);
                        } else if (newElement.revisions.length === prevRevisionCount) {
                            this.splitRevisionForSpittedElement(element, textElement);
                            this.insertRevision(newElement, revisionType);
                        }
                    } else {
                        this.copyElementRevision(element, textElement, false);
                    }
                }
                //Inserts the new inline.
                line.children.splice(isBidi ? insertIndex + 1 : insertIndex, 0, newElement);
                insertIndex -= 1;
            }
        } else {

            (element as TextElementBox).text = (element as TextElementBox).text.substring(0, index) + (newElement as TextElementBox).text + (element as TextElementBox).text.substring(index);
        }
        newElement.line = element.line;
        newElement.linkFieldCharacter(this.documentHelper);
        if (newElement instanceof ContentControl && newElement.type === 0) {
            this.documentHelper.contentControlCollection.push(newElement);
        }
        if (newElement instanceof ShapeBase && newElement.textWrappingStyle !== 'Inline') {
            if (paragraph.floatingElements.indexOf(newElement) === -1) {
                paragraph.floatingElements.push(newElement);
            }
            if (paragraph.bodyWidget.floatingElements.indexOf(newElement) === -1) {
                paragraph.bodyWidget.floatingElements.push(newElement);
            }
        }
        if (isTrackingEnabled && !isRevisionCombined && !isUndoing && !this.skipFieldDeleteTracking) {

            this.checkToCombineRevisionsinBlocks(newElement, prevRevisionCount === newElement.revisions.length, (index === element.length), revisionType);
        }
        if (newElement instanceof FootnoteElementBox) {
            if (isUndoing) {
                // this.documentHelper.layout.isLayoutWhole = true;
                newElement.isLayout = false;
            }
            if (newElement.footnoteType === 'Footnote') {
                this.updateFootnoteCollection(newElement);
            }
            if (newElement.footnoteType === 'Endnote') {
                this.updateEndnoteCollection(newElement);
            }
        }
        if (relayout) {
            this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, insertIndex, undefined, undefined);
        }
    }
    private incrementCommentIndex(isBidi: boolean, element: ElementBox, insertIndex: number): number {
        if (!isBidi) {
            if (!this.owner.editorHistory || !(this.owner.editorHistory && this.owner.editorHistory.currentHistoryInfo) || (this.owner.editorHistory && this.owner.editorHistory.currentHistoryInfo
                && (this.owner.editorHistory.currentHistoryInfo.action !== "SkipCommentInline" ||
                    this.owner.editorHistory.currentHistoryInfo.action === "SkipCommentInline" &&
                    (this.owner.editorHistory.currentHistoryInfo.modifiedActions[0] === this.editorHistory.currentBaseHistoryInfo
                        || (this.owner.editorHistory.currentHistoryInfo.modifiedActions[0] !== this.editorHistory.currentBaseHistoryInfo
                            && !(element instanceof CommentCharacterElementBox)))))) {
                insertIndex++;
            }
        }
        return insertIndex;
    }
    /**
     * @private
     * @returns {void}
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    public constructRevisionFromID(insertElement: any, isEnd: boolean, prevElement?: ElementBox): void {
        if (insertElement.removedIds.length > 0) {
            for (let i: number = 0; i < insertElement.removedIds.length; i++) {
                let revisionToInclude: Revision = undefined;
                if (this.documentHelper.revisionsInternal.containsKey(insertElement.removedIds[i])) {
                    revisionToInclude = this.documentHelper.revisionsInternal.get(insertElement.removedIds[i]);
                    insertElement.revisions.push(revisionToInclude);
                    isEnd = isEnd ? true : this.skipTracking();
                    if (isEnd) {

                        if (this.editorHistory.isRedoing && this.owner.editorHistory.currentBaseHistoryInfo && this.owner.editorHistory.currentBaseHistoryInfo.action === 'BackSpace') {
                            isEnd = false;
                        }
                    }
                    if (!isNullOrUndefined(prevElement)) {
                        let rangeIndex: number = revisionToInclude.range.indexOf(prevElement);
                        if (rangeIndex >= 0) {
                            revisionToInclude.range.splice(rangeIndex + ((isEnd) ? 1 : 0), 0, insertElement);
                        } else {
                            revisionToInclude.range.splice((isEnd) ? revisionToInclude.range.length : 0, 0, insertElement);
                        }
                    } else {
                        revisionToInclude.range.splice((isEnd) ? revisionToInclude.range.length : 0, 0, insertElement);
                    }
                    this.updateRevisionCollection(revisionToInclude);
                }
            }
            insertElement.removedIds = [];
        } else {
            // on undoing revisions will be cloned , so need to update range information.
            for (let i: number = 0; i < insertElement.revisions.length; i++) {
                let currentRevision: Revision = insertElement.revisions[i];
                if (this.documentHelper.revisionsInternal.containsKey(currentRevision.revisionID)) {
                    currentRevision = this.documentHelper.revisionsInternal.get(currentRevision.revisionID);
                    currentRevision.range.splice(isEnd ? currentRevision.range.length : 0, 0, insertElement);
                    this.updateRevisionCollection(currentRevision);
                }
            }
        }
    }

    /**
     * Insert block on undo
     *
     * @param {Selection} selection - Specifies the selection
     * @param {WBlock} block - Specifes the block
     * @private
     * @returns {void}
     */
    public insertBlock(block: BlockWidget): void {
        let isRemoved: boolean = true;
        let selection: Selection = this.selection;
        if (!selection.isEmpty) {
            isRemoved = this.removeSelectedContents(selection);
        }
        if (!isRemoved) {
            selection.selectContent(selection.start, false);
        }
        this.insertBlockInternal(block);
        if (this.checkInsertPosition(selection)) {
            let paragraph: BlockWidget = undefined;
            if (block instanceof ParagraphWidget) {
                paragraph = block as BlockWidget;
            } else {
                paragraph = this.selection.getFirstParagraphInFirstCell(block as TableWidget);
            }

            this.updateHistoryPosition(this.selection.getHierarchicalIndex(paragraph, '0'), true);
        }
        this.fireContentChange();
    }
    private insertBlockInternal(block: BlockWidget): void {
        let selection: Selection = this.selection;
        let isRemoved: boolean = true;
        let startPara: ParagraphWidget = this.selection.start.paragraph;
        if (!selection.start.isAtParagraphStart) {
            if (block instanceof ParagraphWidget) {
                let startPosition: TextPosition = selection.start.clone();
                //let prevBlock: ParagraphWidget = (block as ParagraphWidget).clone()
                this.insertNewParagraphWidget(block as ParagraphWidget, false);
                if (!this.isInsertingTOC) {
                    this.combineRevisions(block, startPosition, this.selection.end);
                }
                return;
            }
            this.updateInsertPosition();
            startPara = startPara.combineWidget(this.owner.viewer) as ParagraphWidget;

            this.splitParagraph(startPara, startPara.firstChild as LineWidget, 0, selection.start.currentWidget, selection.start.offset, false);
            selection.selectParagraphInternal(this.selection.start.paragraph as ParagraphWidget, true);
        }
        let bodyWidget: BodyWidget = selection.start.paragraph.containerWidget as BodyWidget;
        let blockIndex: number = selection.start.paragraph.index;
        let insertIndex: number = bodyWidget.childWidgets.indexOf(selection.start.paragraph);
        if (!isNullOrUndefined(bodyWidget)) {
            bodyWidget.childWidgets.splice(insertIndex, 0, block);
            block.containerWidget = bodyWidget;
            block.index = blockIndex;
            block.height = 0;
            if (block instanceof TableWidget) {
                block.isGridUpdated = false;
                block.buildTableColumns();
                block.isGridUpdated = true;
            }
            this.updateNextBlocksIndex(block, true);
            if (!this.isInsertingTOC && this.owner.enableTrackChanges && !this.skipTracking() && block instanceof ParagraphWidget) {
                this.insertRevisionForBlock(block, 'Insertion');
            } else if (block instanceof ParagraphWidget) {
                this.constructRevisionsForBlock(block, true);
            } else if (block instanceof TableWidget) {
                this.constructRevisionsForTable(block, true);
            }
            this.documentHelper.layout.layoutBodyWidgetCollection(blockIndex, bodyWidget, block, false);
        }
    }
    /**
     * Inserts the image with specified size at cursor position in the document editor.
     *
     * @param {string} imageString  Base64 string, web URL or file URL.
     * @param {number} width? Image width
     * @param {number} height? Image height
     * @returns {void}
     */
    public insertImage(imageString: string, width?: number, height?: number): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        if (isNullOrUndefined(width)) {
            width = 100;
        }
        if (isNullOrUndefined(height)) {
            height = 100;
        }
        this.insertPicture(imageString, width, height);
        setTimeout((): void => {
            if (!isNullOrUndefined(this.viewer)) {
                this.viewer.updateScrollBars();
            }
        }, 30);
    }
    /**
     * Inserts a table of specified size at cursor position
     *  in the document editor.
     *
     * @param {number} rows Default value of ‘rows’ parameter is 1.
     * @param {number} columns Default value of ‘columns’ parameter is 1.
     * @returns {void}
     */
    public insertTable(rows?: number, columns?: number): void {
        let startPos: TextPosition = this.selection.start;
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        rows = rows || 1;
        columns = columns || 1;
        let table: TableWidget = this.createTable(rows, columns);
        let clientWidth: number = startPos.paragraph.getContainerWidth() - table.tableFormat.leftIndent;
        table.splitWidthToTableCells(clientWidth);
        let prevBlock: Widget = startPos.paragraph.previousWidget;
        if (startPos.currentWidget.isFirstLine() && startPos.offset === 0 && prevBlock instanceof TableWidget) {
            this.insertTableRows(table, prevBlock);
            table.destroy();
            return;
        } else {
            this.initHistory('InsertTable');
            this.documentHelper.owner.isShiftingEnabled = true;
            this.insertBlock(table);
        }
        let startLine: LineWidget = this.selection.getFirstParagraphInFirstCell(table).childWidgets[0] as LineWidget;
        startPos.setPosition(startLine, true);
        this.selection.end.setPositionInternal(startPos);
        let lastParagraph: ParagraphWidget = this.selection.getLastParagraphInLastCell(table.getSplitWidgets().pop() as TableWidget);
        let endOffset: number = lastParagraph.getLength() + 1;
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {

            this.editorHistory.currentBaseHistoryInfo.endPosition = this.selection.getHierarchicalIndex(lastParagraph, endOffset.toString());
        }
        this.reLayout(this.selection);
    }
    /**
     * Inserts the specified number of rows to the table above or below to the row at cursor position.
     *
     * @param {boolean} above The above parameter is optional and if omitted, 
     * it takes the value as false and inserts below the row at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     * @returns {void}
     */
    public insertRow(above?: boolean, count?: number): void {
        let rowPlacement: RowPlacement = above ? 'Above' : 'Below';
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let isInsertRow: boolean = true;
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        if (startPos.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory(rowPlacement === 'Above' ? 'InsertRowAbove' : 'InsertRowBelow');
            }
            this.documentHelper.owner.isShiftingEnabled = true;
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
            let table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            let row: TableRowWidget = rowPlacement === 'Below' ? endCell.ownerRow : startCell.ownerRow;
            if (this.editorHistory) {
                let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
            }
            this.rowInsertion(count, rowPlacement, startCell, endCell, row, table, isInsertRow);
        }

        this.reLayout(this.selection, true);
    }

    private rowInsertion(count: number, rowPlacement: RowPlacement, startCell: TableCellWidget, endCell: TableCellWidget, row: TableRowWidget, table: TableWidget, isInsertRow: boolean): void {
        let rowCount: number = count ? count : this.getRowCountToInsert();
        let rows: TableRowWidget[] = [];
        let index: number = row.rowIndex;
        if (rowPlacement === 'Below') {
            index++;
            let isAffectedByRowSpannedCell: boolean = isNullOrUndefined(endCell.previousWidget)
                || endCell.columnIndex === (endCell.previousWidget as TableCellWidget).columnIndex + 1;
            let isRowSpanEnd: boolean = endCell.cellIndex !== endCell.columnIndex && isAffectedByRowSpannedCell
                && row.rowIndex + startCell.cellFormat.rowSpan - 1 === endCell.ownerRow.rowIndex;
            if (!isRowSpanEnd) {
                if (endCell.cellFormat.rowSpan > 1) {
                    if (!isNullOrUndefined(row.nextWidget) && row.nextWidget instanceof TableRowWidget) {
                        endCell.cellFormat.rowSpan += rowCount;
                        row = row.nextWidget as TableRowWidget;
                    }
                }
            }
            row.bottomBorderWidth = 0;
        }
        for (let i: number = 0; i < rowCount; i++) {
            let cellCountInfo: CellCountInfo = this.updateRowspan(row, rowPlacement === 'Below' ? endCell : startCell, rowPlacement);
            let newRow: TableRowWidget = this.createRowAndColumn(cellCountInfo.count, i);
            newRow.rowFormat.copyFormat(row.rowFormat);
            if (this.owner.enableTrackChanges) {
                this.insertRevision(newRow.rowFormat, 'Insertion');
            }
            this.updateCellFormatForInsertedRow(newRow, cellCountInfo.cellFormats);
            rows.push(newRow);
        }
        table.insertTableRowsInternal(rows, index, isInsertRow);
        let cell: TableCellWidget = undefined;
        let paragraph: ParagraphWidget = undefined;
        if ((table.childWidgets[index] instanceof TableRowWidget)) {
            cell = ((table.childWidgets[index] as TableRowWidget).firstChild as TableCellWidget);
            paragraph = this.selection.getFirstParagraph(cell);
        } else {
            let widget: Widget = undefined;
            while (!(widget instanceof TableWidget)) {
                widget = table.nextRenderedWidget;
            }
            paragraph = this.selection.getFirstParagraphInFirstCell(widget);
        }
        if (isInsertRow) {
            this.documentHelper.layout.reLayoutTable(table);
        }
        this.selection.selectParagraphInternal(paragraph, true);
    }
    /**
     * Fits the table based on AutoFitType.
     *
     * @param {AutoFitType} - auto fit type
     * @returns {void}
     */
    public autoFitTable(fitType: AutoFitType): void {
        if (this.documentHelper.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let startPosition: TextPosition = this.selection.start;
        let endPosition: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPosition = this.selection.end;
            endPosition = this.selection.start;
        }
        let tableAdv: TableWidget = this.selection.getTable(startPosition, endPosition);
        tableAdv = tableAdv.getSplitWidgets()[0] as TableWidget;
        let parentTable: TableWidget = this.documentHelper.layout.getParentTable(tableAdv);
        if (!isNullOrUndefined(parentTable)) {
            this.setOffsetValue(this.selection);
            parentTable = parentTable.combineWidget(this.owner.viewer) as TableWidget;

            this.initHistory(fitType === 'FitToContents' ? 'TableAutoFitToContents' : fitType === 'FitToWindow' ? 'TableAutoFitToWindow' : 'TableFixedColumnWidth');
            if (this.documentHelper.owner.editorHistoryModule) {
                this.cloneTableToHistoryInfo(parentTable);
            }
            parentTable.updateProperties(true, tableAdv, fitType);
            this.documentHelper.owner.isShiftingEnabled = true;
            //Layouts the table.
            this.documentHelper.layout.reLayoutTable(tableAdv);
            this.reLayout(this.selection, true);
        }
    }
    private updateCellFormatForInsertedRow(newRow: TableRowWidget, cellFormats: WCellFormat[]): void {
        for (let i: number = 0; i < newRow.childWidgets.length; i++) {
            (newRow.childWidgets[i] as TableCellWidget).cellFormat.copyFormat(cellFormats[i]);
            (newRow.childWidgets[i] as TableCellWidget).cellFormat.rowSpan = 1;
        }
    }
    private updateRowspan(row: TableRowWidget, startCell: TableCellWidget, rowPlacement: RowPlacement): CellCountInfo {
        let spannedCells: TableCellWidget[] = row.getPreviousRowSpannedCells(true);
        let count: number = 0;
        let cellFormats: WCellFormat[] = [];
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            let isCellIncluded: boolean = false;
            // Need to check with all the row spanned cells. if the start cell contains rowspan greater than 1, 
            // and when inserting below, need to increment rowspan for all row spanned cells by 1 except
            // if the spanned cells is placed in the same column or cell to be cloned has the same row index of cloned cell row index.
            // and when inserting above, if cloned cell placed in the same row of start cell or
            // if the cloned cell has equal column index, need to skip updating rowspan value of cloned cell.
            // else update row span value for spanned cell except 
            // if the spanned cells is placed in the same column or cell to be cloned has the same row index of cloned cell row index.
            let isRowSpanned: boolean = (isNullOrUndefined(cell.previousWidget)
                || cell.columnIndex !== (cell.previousWidget as TableCellWidget).columnIndex + 1);
            for (let j: number = 0; j < spannedCells.length; j++) {
                if (isRowSpanned) {
                    let spannedCell: TableCellWidget = spannedCells[j];

                    let clonedRowIndex: number = spannedCell.ownerRow.rowIndex + spannedCell.cellFormat.rowSpan - 1;

                    if (cell.columnIndex < spannedCell.columnIndex && cell.cellIndex !== cell.columnIndex) {
                        isCellIncluded = true;
                        count++;
                        cellFormats.push(cell.cellFormat);
                    }
                    if (startCell.cellFormat.rowSpan === 1) {
                        // Need to check whether cell is affected by a row spanned cell. if cell is placed on the row where it is affected 
                        // by row spanned cell, then if we are inserting row below, need to add new cell with spanned cell width
                        // or if we are inserting above, need to update row span value of the spanned cell.
                        // if cell is placed inbetween the spanned cell , 
                        // then if we are inserting below, need to update row span value of spanned cell or
                        // if we are inserting above, need to skip updating row span value except
                        // if start cell is placed on the same row of spanned cell or if start cell placed in the same column.
                        if (clonedRowIndex > cell.ownerRow.rowIndex) {
                            if (rowPlacement === 'Above'
                                && spannedCell.ownerRow === startCell.ownerRow) {
                                continue;
                            } else {
                                spannedCell.cellFormat.rowSpan += 1;
                                spannedCells.splice(j, 1);
                                j--;
                            }
                        } else if (cell.cellIndex !== cell.columnIndex && isRowSpanned && clonedRowIndex === cell.ownerRow.rowIndex) {
                            if (rowPlacement === 'Above') {
                                spannedCell.cellFormat.rowSpan += 1;
                                spannedCells.splice(j, 1);
                                j--;
                            } else {
                                count++;
                                cellFormats.push(spannedCell.cellFormat);
                                spannedCells.splice(j, 1);
                                j--;
                            }
                        }
                    } else {
                        if (spannedCell !== startCell) {
                            if (rowPlacement === 'Above'
                                && (spannedCell.ownerRow === startCell.ownerRow || spannedCell.columnIndex === startCell.columnIndex)) {
                                continue;
                            } else {
                                if (spannedCell.columnIndex !== startCell.columnIndex
                                    && spannedCell.ownerRow.rowIndex !== cell.ownerRow.rowIndex
                                    && (clonedRowIndex > startCell.ownerRow.rowIndex
                                        || (rowPlacement === 'Above' && clonedRowIndex === startCell.ownerRow.rowIndex))) {
                                    spannedCell.cellFormat.rowSpan += 1;
                                    spannedCells.splice(j, 1);
                                    j--;
                                }
                            }
                        }
                    }
                }
            }
            if (spannedCells.indexOf(cell) === -1 && cell.cellFormat.rowSpan > 1) {
                isCellIncluded = true;
            }
            if (!isCellIncluded) {
                count++;
                cellFormats.push(cell.cellFormat);
            }
        }
        return { count, cellFormats };
    }
    private insertTableRows(table: TableWidget, prevBlock: TableWidget): void {
        this.initHistory('InsertTableBelow');
        table.containerWidget = prevBlock.containerWidget;
        prevBlock = prevBlock.combineWidget(this.owner.viewer) as TableWidget;
        // if (this.editorHistory) {
        //     let clonedTable: TableWidget = this.cloneTableToHistoryInfo(prevBlock);
        // }
        let row: TableRowWidget = prevBlock.childWidgets[prevBlock.childWidgets.length - 1] as TableRowWidget;
        prevBlock.insertTableRowsInternal(table.childWidgets as TableRowWidget[], prevBlock.childWidgets.length, true);
        let paragraph: ParagraphWidget = this.selection.getFirstParagraph(row.nextWidget.childWidgets[0] as TableCellWidget);
        if (this.checkInsertPosition(this.selection)) {
            this.updateHistoryPosition(this.selection.getHierarchicalIndex(paragraph, '0'), true);
        }
        prevBlock.isDefaultFormatUpdated = false;
        this.documentHelper.layout.reLayoutTable(prevBlock);
        this.selection.start.setPosition(paragraph.firstChild as LineWidget, true);
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            this.updateHistoryPosition(this.selection.end, false);
        }
        this.selection.end.setPosition(paragraph.firstChild as LineWidget, true);
        this.reLayout(this.selection);
    }
    /**
     * Inserts the specified number of columns to the table left or right to the column at cursor position.
     *
     * @param {number} left The left parameter is optional and if omitted, it takes the value as false and 
     * inserts to the right of column at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     * @returns {void}
     */
    public insertColumn(left?: boolean, count?: number): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let columnPlacement: ColumnPlacement = left ? 'Left' : 'Right';
        if (this.selection.start.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory(columnPlacement === 'Left' ? 'InsertColumnLeft' : 'InsertColumnRight');
            }
            this.selection.owner.isShiftingEnabled = true;
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            let table: TableWidget = startCell.ownerRow.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (this.editorHistory) {
                //Clones the entire table to preserve in history.
                this.cloneTableToHistoryInfo(table);
            }
            this.selection.owner.isLayoutEnabled = false;
            let cellIndex: number = startCell.columnIndex;
            if (columnPlacement === 'Right') {
                cellIndex = endCell.columnIndex + endCell.cellFormat.columnSpan;
            }
            let startParagraph: ParagraphWidget = undefined;
            let newCell: TableCellWidget = undefined;
            let columnCount: number = count ? count : this.getColumnCountToInsert();
            let rowSpannedCells: TableCellWidget[] = [];
            //let rowSpanCellIndex: number = cellIndex;
            for (let i: number = 0; i < columnCount; i++) {
                for (let j: number = 0; j < table.childWidgets.length; j++) {
                    let row: TableRowWidget = table.childWidgets[j] as TableRowWidget;
                    newCell = this.createColumn(this.selection.getLastParagraph(startCell));
                    newCell.index = j;
                    newCell.rowIndex = row.rowIndex;
                    newCell.containerWidget = row;
                    newCell.cellFormat.copyFormat(startCell.cellFormat);
                    newCell.cellFormat.rowSpan = 1;
                    if (isNullOrUndefined(startParagraph)) {
                        startParagraph = this.selection.getFirstParagraph(newCell);
                    }
                    if (cellIndex === 0) {
                        row.childWidgets.splice(cellIndex, 0, newCell);
                    } else {
                        this.insertSpannedCells(row, rowSpannedCells, newCell, cellIndex);
                    }
                }
            }
            this.tableReLayout(table, startParagraph, newCell);
        }
    }

    private tableReLayout(table: TableWidget, startParagraph: ParagraphWidget, newCell: TableCellWidget): void {
        table.updateRowIndex(0);
        let parentTable: TableWidget = this.documentHelper.layout.getParentTable(table);
        if (parentTable) {
            parentTable.fitChildToClientArea();
        } else {
            table.fitChildToClientArea();
        }
        this.selection.owner.isLayoutEnabled = true;
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.documentHelper.skipScrollToPosition = true;
        this.documentHelper.layout.reLayoutTable(table);
        this.selection.start.setPosition(startParagraph.firstChild as LineWidget, true);
        this.selection.end.setPosition(this.selection.getLastParagraph(newCell).firstChild as LineWidget, false);
        if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
            this.reLayout(this.selection);
        }
    }

    /**
     * Creates table with specified rows and columns.
     * @private
     * 
     * @returns {TableWidget}
     */
    public createTable(rows: number, columns: number): TableWidget {
        let startPara: ParagraphWidget = this.selection.start.paragraph;
        let table: TableWidget = new TableWidget();
        table.tableFormat = new WTableFormat(table);
        table.tableFormat.preferredWidthType = 'Auto';
        table.tableFormat.leftIndent = this.selection.start.paragraph.leftIndent;
        table.tableFormat.initializeTableBorders();
        let index: number = 0;
        while (index < rows) {
            let tableRow: TableRowWidget = this.createRowAndColumn(columns, index);
            tableRow.rowFormat.heightType = 'Auto';
            if (this.owner.enableTrackChanges) {
                this.insertRevision(tableRow.rowFormat, 'Insertion');
            }
            tableRow.containerWidget = table;
            table.childWidgets.push(tableRow);
            index++;
        }
        return table;
    }
    private createRowAndColumn(columns: number, rowIndex: number): TableRowWidget {
        let startPara: ParagraphWidget = this.selection.start.paragraph;
        let tableRow: TableRowWidget = new TableRowWidget();
        tableRow.rowFormat = new WRowFormat(tableRow);
        tableRow.index = rowIndex;
        for (let i: number = 0; i < columns; i++) {
            let tableCell: TableCellWidget = this.createColumn(startPara);
            tableCell.index = i;
            tableCell.rowIndex = rowIndex;
            tableCell.containerWidget = tableRow;
            tableRow.childWidgets.push(tableCell);
        }
        return tableRow;
    }
    private createColumn(paragraph: ParagraphWidget): TableCellWidget {
        let tableCell: TableCellWidget = new TableCellWidget();
        let para: ParagraphWidget = new ParagraphWidget();
        para.paragraphFormat.copyFormat(paragraph.paragraphFormat);
        para.paragraphFormat.leftIndent = 0;
        para.characterFormat.copyFormat(paragraph.characterFormat);
        para.containerWidget = tableCell;
        tableCell.childWidgets.push(para);
        tableCell.cellFormat = new WCellFormat(tableCell);
        return tableCell;
    }
    private getColumnCountToInsert(): number {
        let count: number = 1;
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            start = this.selection.end;
            end = this.selection.start;
        }
        if (start && end && this.selection.getTable(start, end)) {
            if (start.paragraph.associatedCell === end.paragraph.associatedCell) {
                return count = 1;
            }
            if (start.paragraph.associatedCell.ownerRow === end.paragraph.associatedCell.ownerRow) {
                return count = count + end.paragraph.associatedCell.cellIndex - start.paragraph.associatedCell.cellIndex;
            } else {
                count = 0;

                let selectedCells: TableCellWidget[] = start.paragraph.associatedCell.ownerTable.getColumnCellsForSelection(start.paragraph.associatedCell, end.paragraph.associatedCell);
                for (let i: number = 0; i < selectedCells.length; i++) {
                    if (start.paragraph.associatedCell.ownerRow === selectedCells[i].ownerRow) {
                        count++;
                    }
                }
            }
        }
        return count === 0 ? 1 : count;
    }
    private getRowCountToInsert(): number {
        let count: number = 1;
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            start = this.selection.end;
            end = this.selection.start;
        }
        if (!isNullOrUndefined(start) && !isNullOrUndefined(end) && !isNullOrUndefined(this.selection.getTable(start, end))) {
            if (start.paragraph.associatedCell === end.paragraph.associatedCell ||
                start.paragraph.associatedCell.ownerRow === end.paragraph.associatedCell.ownerRow) {
                return count = 1;
            } else {
                return count = count +
                    this.getOwnerRow(!this.selection.isForward).rowIndex - this.getOwnerRow(this.selection.isForward).rowIndex;
            }
        }
        return count === 0 ? 1 : count;
    }
    private getOwnerCell(isStart: boolean): TableCellWidget {
        let cell: TableCellWidget = undefined;
        let startCell: TableCellWidget = isStart ? this.selection.start.paragraph.associatedCell
            : this.selection.end.paragraph.associatedCell;
        let endCell: TableCellWidget = isStart ? this.selection.end.paragraph.associatedCell
            : this.selection.start.paragraph.associatedCell;
        cell = startCell;
        let owner: TableWidget = cell.ownerTable;
        while (!isNullOrUndefined(owner) && owner.containerWidget instanceof TableCellWidget && owner !== endCell.ownerTable) {
            cell = (owner.containerWidget as TableCellWidget);
            owner = cell.ownerTable;
        }
        return cell;
    }
    private getOwnerRow(isStart: boolean): TableRowWidget {
        let row: TableRowWidget;
        let startRow: TableRowWidget = isStart ? this.selection.start.paragraph.associatedCell.ownerRow
            : this.selection.end.paragraph.associatedCell.ownerRow;
        let endRow: TableRowWidget = isStart ? this.selection.end.paragraph.associatedCell.ownerRow
            : this.selection.start.paragraph.associatedCell.ownerRow;
        row = startRow;
        let owner: TableWidget = row.ownerTable;
        while (!isNullOrUndefined(owner) && owner.containerWidget instanceof TableCellWidget && owner !== endRow.ownerTable) {
            row = (owner.containerWidget as TableCellWidget).ownerRow;
            owner = row.ownerTable;
        }
        return row;
    }
    private getOwnerTable(isStart: boolean): TableWidget {
        let table: TableWidget = undefined;
        let startTable: TableWidget = this.selection.start.paragraph.associatedCell.ownerTable;
        let endTable: TableWidget = this.selection.end.paragraph.associatedCell.ownerTable;
        table = isStart ? startTable : endTable;
        while (table.containerWidget instanceof TableCellWidget && table !== (isStart ? endTable : startTable)) {
            table = (table.containerWidget as TableCellWidget).ownerTable;
        }
        return table;
    }
    /**
     * Merge Selected cells
     *
     * @private
     * @returns {void}
     */
    public mergeSelectedCellsInTable(): void {
        if (!this.canMergeCells()) {
            return;
        }
        if (this.owner.enableTrackChanges) {
            let localizeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
            localizeValue.setLocale(this.owner.locale);
            this.alertDialog = DialogUtility.alert({
                title: localizeValue.getConstant('UnTrack'),
                content: localizeValue.getConstant('Merge Track'),
                showCloseIcon: true,
                okButton: {
                    text: 'Ok', click: this.confirmCellMerge.bind(this)
                },
                closeOnEscape: true,
                position: { X: 'center', Y: 'center' },
                animationSettings: { effect: 'Zoom' }
            });
        } else {
            this.confirmCellMerge();
        }

    }
    private confirmCellMerge(): void {
        if (this.checkIsNotRedoing()) {
            this.initHistory('MergeCells');
        }
        this.selection.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = this.selection.start;
        let endPosition: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPosition = this.selection.end;
            endPosition = this.selection.start;
        }
        let startOwnerCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
        let endOwnerCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
        let containerCell: TableCellWidget = this.selection.getContainerCellOf(startOwnerCell, endOwnerCell);
        if (containerCell.ownerTable.contains(endOwnerCell)) {
            if (!this.selection.containsCell(containerCell, endOwnerCell)) {
                //Start and End are in different cells.               
                let table: TableWidget = startOwnerCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
                startOwnerCell = this.selection.getSelectedCell(startOwnerCell, containerCell);
                endOwnerCell = this.selection.getSelectedCell(endOwnerCell, containerCell);
                //Merges the selected cells.               
                let mergedCell: TableCellWidget = this.mergeSelectedCells(table, startOwnerCell, endOwnerCell);
                let firstParagraph: ParagraphWidget = this.selection.getFirstParagraph(mergedCell);
                startPosition.setPosition(firstParagraph.firstChild as LineWidget, true);
                let lastParagraph: ParagraphWidget = this.selection.getLastParagraph(mergedCell);
                endPosition.setPosition(lastParagraph.lastChild as LineWidget, false);
            }
        }
        if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
            this.reLayout(this.selection, false);
        }
        if (!isNullOrUndefined(this.alertDialog)) {
            this.alertDialog.close();
            this.alertDialog = undefined;
        }
    }
    private mergeSelectedCells(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): TableCellWidget {
        //Clones the entire table to preserve in history.
        let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
        this.selection.owner.isLayoutEnabled = false;
        //Merges the selected cells.
        let start: number = this.selection.getCellLeft(startCell.ownerRow, startCell);
        let end: number = start + startCell.cellFormat.cellWidth;
        let endCellLeft: number = this.selection.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        let cellInfo: CellInfo = this.updateSelectedCellsInTable(start, end, endCellLeft, endCellRight);
        start = cellInfo.start;
        end = cellInfo.end;
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        let rowStartIndex: number = table.childWidgets.indexOf(startCell.ownerRow);
        let mergedCell: TableCellWidget = undefined;
        let firstBlock: BlockWidget;
        for (let i: number = rowStartIndex; i <= count; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let cellStart: number = this.selection.getCellLeft(row, cell);
                if (HelperMethods.round(start, 2) <= HelperMethods.round(cellStart, 2)
                    && HelperMethods.round(cellStart, 2) < HelperMethods.round(end, 2)) {
                    let lastBlock: BlockWidget = cell.lastChild as BlockWidget;
                    if (lastBlock instanceof ParagraphWidget && lastBlock.isEmpty()) {
                        cell.childWidgets.pop();
                    }
                    if (isNullOrUndefined(mergedCell)) {
                        mergedCell = cell;
                        firstBlock = lastBlock;
                    } else {
                        if (i === rowStartIndex) {
                            mergedCell.cellFormat.preferredWidth += cell.cellFormat.preferredWidth;
                            mergedCell.cellFormat.columnSpan += cell.cellFormat.columnSpan;
                            this.mergeBorders(mergedCell, cell);
                        }
                        for (let k: number = 0; k < cell.childWidgets.length; k++) {
                            let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                            let newBlock: BlockWidget = block.clone();
                            newBlock.containerWidget = mergedCell;
                            mergedCell.childWidgets.push(newBlock);
                        }
                        row.childWidgets.splice(j, 1);
                        cell.destroy();
                        j--;
                    }
                }
            }
            //To Ensure minimul content. 

            if ((mergedCell.childWidgets.length === 0 || mergedCell.childWidgets.length === 1 && mergedCell.childWidgets[0] instanceof TableWidget) && firstBlock) {
                let newBlock: BlockWidget = firstBlock.clone();
                mergedCell.childWidgets.push(newBlock);
                newBlock.containerWidget = mergedCell;
            }
            if (row.childWidgets.length === 0) {
                let rowIndex: number = table.childWidgets.indexOf(row);
                row.updateRowBySpannedCells();
                table.childWidgets.splice(rowIndex, 1);
                row.destroy();
                count--;
                i--;
            }
        }
        if (!isNullOrUndefined(mergedCell) && rowStartIndex < count) {
            mergedCell.cellFormat.rowSpan = count - rowStartIndex + 1;
        }
        this.updateBlockIndexAfterMerge(mergedCell);
        table.updateRowIndex(0);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.documentHelper.layout.reLayoutTable(table);
        //Layouts the table after merging cells.
        this.selection.owner.isLayoutEnabled = true;
        return mergedCell;
    }

    private mergeBorders(mergedCell: TableCellWidget, tableCell: TableCellWidget): void {
        let mergedCellborders: WBorders = undefined;
        let cellBorders: WBorders = null;
        if (!isNullOrUndefined(mergedCell.cellFormat.borders)) {
            mergedCellborders = mergedCell.cellFormat.borders;
        }
        if (!isNullOrUndefined(tableCell.cellFormat.borders)) {
            cellBorders = tableCell.cellFormat.borders;
        }
        if (isNullOrUndefined(mergedCellborders) && isNullOrUndefined(cellBorders)) {
            return;
        }
        if (isNullOrUndefined(mergedCellborders)) {
            mergedCellborders = new WBorders(mergedCell.cellFormat);
            mergedCellborders.copyFormat(cellBorders);
        } else if (isNullOrUndefined(cellBorders)) {
            return;
        } else {
            if (mergedCell.ownerRow.rowIndex === tableCell.ownerRow.rowIndex) {
                mergedCellborders.top = mergedCell.getBorderBasedOnPriority(mergedCellborders.top, cellBorders.bottom);
                mergedCellborders.bottom = mergedCell.getBorderBasedOnPriority(mergedCellborders.bottom, cellBorders.bottom);
            }
        }
    }
    private updateBlockIndexAfterMerge(cell: TableCellWidget): void {
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            (cell.childWidgets[i] as BlockWidget).index = i;
        }
    }
    /**
     * Determines whether merge cell operation can be done.
     *
     * @returns {boolean} - Returns can merge cells.
     */
    public canMergeCells(): boolean {
        if (this.selection.isEmpty || !this.selection.start.paragraph.isInsideTable || !this.selection.end.paragraph.isInsideTable) {
            return false;
        }
        let startPos: TextPosition = this.selection.start;
        let endPos: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPos = this.selection.end;
            endPos = this.selection.start;
        }
        let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
        let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
        let containerCell: TableCellWidget = this.selection.getContainerCellOf(startCell, endCell);
        if (containerCell.ownerTable.contains(endCell)) {
            if (!this.selection.containsCell(containerCell, endCell)) {
                startCell = this.selection.getSelectedCell(startCell, containerCell);
                endCell = this.selection.getSelectedCell(endCell, containerCell);
                let rowSpan: number = 1;
                if (startCell.ownerRow === endCell.ownerRow) {
                    let startCellIndex: number = startCell.ownerRow.childWidgets.indexOf(startCell);
                    for (let i: number = startCellIndex; i <= startCell.ownerRow.childWidgets.indexOf(endCell); i++) {
                        let cell: TableCellWidget = startCell.ownerRow.childWidgets[i] as TableCellWidget;
                        let prevCell: TableCellWidget = cell.previousWidget as TableCellWidget;
                        if (i !== startCellIndex) {
                            if (cell.cellFormat.rowSpan !== rowSpan) {
                                return false;
                            }
                            if (!isNullOrUndefined(prevCell)
                                && cell.columnIndex !== (prevCell.cellFormat.columnSpan + prevCell.columnIndex)) {
                                return false;
                            }
                        }
                        rowSpan = cell.cellFormat.rowSpan;
                    }
                    return true;
                }
                return this.canMergeSelectedCellsInTable(startCell.ownerTable, startCell, endCell);
            }
        }
        return false;
    }
    private canMergeSelectedCellsInTable(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): boolean {
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        let rowStartIndex: number = table.childWidgets.indexOf(startCell.ownerRow);
        let startLeft: number = this.selection.getCellLeft(startCell.ownerRow, startCell);
        let endLeft: number = startLeft + startCell.cellFormat.cellWidth;
        let endCellLeft: number = this.selection.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        let cellInfo: CellInfo = this.updateSelectedCellsInTable(startLeft, endLeft, endCellLeft, endCellRight);
        startLeft = cellInfo.start;
        endLeft = cellInfo.end;
        let selectionLeft: number = 0; let selectionRight: number = 0;
        let isRowLeftWithinSel: boolean = false;
        let isRowRightWithinSel: boolean = false;
        let rowSpannedCells: TableCellWidget[] = [];
        for (let i: number = rowStartIndex; i <= count; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let rowLeft: number = 0; let rowRight: number = 0;
            let isStarted: boolean = false;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let cellStart: number = this.selection.getCellLeft(row, cell);
                if (this.checkCellWithInSelection(startLeft, endLeft, cellStart)) {
                    isRowLeftWithinSel = false;
                    isRowRightWithinSel = false;
                    if (cell.cellFormat.rowSpan > 1) {
                        rowSpannedCells.push(cell);
                    }
                    if (!isStarted) {
                        rowLeft = cellStart;
                        rowRight = cellStart;
                        isStarted = true;
                    }
                    let prevCell: TableCellWidget = cell.previousWidget as TableCellWidget;
                    if (rowRight !== 0 && HelperMethods.round(rowRight, 0) !== HelperMethods.round(cellStart, 0)) {
                        rowRight = cellStart;
                    }
                    rowRight += HelperMethods.convertPointToPixel(cell.cellFormat.cellWidth);
                    let isPrevCellWithinSel: boolean = this.checkPrevOrNextCellIsWithinSel(startLeft, endLeft, cell, true);
                    let isNextCellWithinSel: boolean = this.checkPrevOrNextCellIsWithinSel(startLeft, endLeft, cell, false);
                    // When selected cell not having row spanned cells and column index is not having immediate cell index value,
                    // then returned false.
                    let isNoRowSpan: boolean = rowSpannedCells.length === 0 || rowSpannedCells.length === 1 && rowSpannedCells[0] === cell;
                    // checks whether current cell is with in selection.
                    let isCellWithInSel: boolean = this.checkCurrentCell(rowSpannedCells, cell, isPrevCellWithinSel, isNextCellWithinSel);
                    // when last selected row not having equal row span then returned false.
                    if (i === count && !isNullOrUndefined(prevCell) && cell.cellFormat.rowSpan > prevCell.cellFormat.rowSpan
                        && !isCellWithInSel) {
                        return false;
                    }
                    if (i !== rowStartIndex) {
                        for (let m: number = 0; m < rowSpannedCells.length; m++) {
                            {
                                let rowSpan: number = (rowSpannedCells[m].ownerRow.rowIndex + rowSpannedCells[m].cellFormat.rowSpan) - 1;
                                if (rowSpan >= row.rowIndex) {
                                    if (rowSpannedCells[m].columnIndex > cell.columnIndex) {
                                        isRowRightWithinSel = true;
                                    } else {
                                        isRowLeftWithinSel = true;
                                    }
                                    if (i === count && rowSpannedCells[m] !== cell
                                        && rowSpan > (cell.ownerRow.rowIndex + cell.cellFormat.rowSpan - 1)) {
                                        return false;
                                    }
                                    if (rowSpan === row.rowIndex && !this.checkPrevOrNextCellIsWithinSel(startLeft, endLeft, cell, false)) {
                                        rowSpannedCells.splice(rowSpannedCells.indexOf(rowSpannedCells[m]), 1);
                                    }
                                }
                            }
                        }
                    }
                    if (isPrevCellWithinSel && !isNullOrUndefined(prevCell)
                        && isNoRowSpan
                        && (cell.columnIndex !== prevCell.columnIndex + 1 && this.checkCellWidth(cell))) {
                        return false;
                    }
                }
            }
            if (i === rowStartIndex) {
                selectionLeft = rowLeft;
                selectionRight = rowRight;
            } else {
                if (rowRight > 0 && rowLeft > 0) {
                    if (!((isRowLeftWithinSel || Math.round(selectionLeft) === Math.round(rowLeft))
                        && (isRowRightWithinSel || Math.round(selectionRight) === Math.round(rowRight)))) {
                        return false;
                    }
                }
                if (i === count) {
                    return true;
                }
            }
        }
        return false;
    }
    private checkCellWidth(cell: TableCellWidget): boolean {
        let prevCell: TableCellWidget = cell.previousWidget as TableCellWidget;
        let cellLeft: number = this.documentHelper.selection.getCellLeft(cell.ownerRow, cell);
        let prevCellLeft: number = this.documentHelper.selection.getCellLeft(cell.ownerRow, prevCell);
        let left: number = prevCellLeft + HelperMethods.convertPointToPixel(prevCell.cellFormat.cellWidth);
        if (HelperMethods.round(left, 2) !== HelperMethods.round(cellLeft, 2)) {
            return true;
        }
        return false;
    }
    private checkCellWithInSelection(startLeft: number, endLeft: number, cellStart: number): boolean {
        if (HelperMethods.round(startLeft, 2) <= HelperMethods.round(cellStart, 2)
            && HelperMethods.round(cellStart, 2) < HelperMethods.round(endLeft, 2)) {
            return true;
        }
        return false;
    }
    private checkPrevOrNextCellIsWithinSel(startLeft: number, endLeft: number, cell: TableCellWidget, isPrev: boolean): boolean {
        let prevOrNextCell: TableCellWidget = isPrev ? cell.previousWidget as TableCellWidget : cell.nextWidget as TableCellWidget;
        let cellStart: number = 0;
        if (isNullOrUndefined(prevOrNextCell)) {
            return false;
        }
        cellStart = this.documentHelper.selection.getCellLeft(prevOrNextCell.ownerRow, prevOrNextCell);
        return this.checkCellWithInSelection(startLeft, endLeft, cellStart);
    }

    private checkCurrentCell(rowSpannedCells: TableCellWidget[], cell: TableCellWidget, isPrevCellWithInSel: boolean, isNextCellWithinSel: boolean): boolean {
        let cellOwner: TableRowWidget = cell.ownerRow;
        if (rowSpannedCells.length > 0) {
            for (let i: number = 0; i < rowSpannedCells.length; i++) {
                let spannedCellOwner: TableRowWidget = rowSpannedCells[i].ownerRow;
                let rowSpan: number = (spannedCellOwner.rowIndex + rowSpannedCells[i].cellFormat.rowSpan) - 1;
                if (rowSpannedCells[i] === cell && (rowSpannedCells.length === 1 || this.checkRowSpannedCells(rowSpannedCells, cell))
                    && !(isNextCellWithinSel || isPrevCellWithInSel)) {
                    return true;
                }
                if (rowSpannedCells[i] !== cell && spannedCellOwner.rowIndex < cellOwner.rowIndex
                    && rowSpan === (cellOwner.rowIndex + cell.cellFormat.rowSpan - 1)) {
                    return true;
                }
            }
        }
        return false;
    }
    private checkRowSpannedCells(rowSpannedCells: TableCellWidget[], cell: TableCellWidget): boolean {
        for (let i: number = 0; i < rowSpannedCells.length; i++) {
            if (rowSpannedCells[i] !== cell && rowSpannedCells[i].columnIndex === cell.columnIndex) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     * @returns {void}
     */
    public insertNewParagraphWidget(newParagraph: ParagraphWidget, insertAfter: boolean): void {
        this.updateInsertPosition();
        this.insertParagraph(newParagraph, insertAfter);
        if (!insertAfter) {
            let nextParagraph: ParagraphWidget;
            let currentParagraph: ParagraphWidget = newParagraph;
            do {
                nextParagraph = this.selection.getNextParagraphBlock(currentParagraph as ParagraphWidget) as ParagraphWidget;
                currentParagraph = nextParagraph;
            } while (nextParagraph && nextParagraph.equals(newParagraph));
            if (!isNullOrUndefined(nextParagraph)) {
                this.selection.selectParagraphInternal(nextParagraph, true);
            } else {
                this.selection.selectParagraphInternal(newParagraph, true);
            }
        }
        this.fireContentChange();
    }
    private insertParagraph(newParagraph: ParagraphWidget, insertAfter: boolean): void {
        let lineWidget: LineWidget = this.selection.start.currentWidget;
        let offset: number = this.selection.start.offset;
        if (this.editorHistory && this.editorHistory.isUndoing &&
            this.editorHistory.currentBaseHistoryInfo.action === 'InsertTextParaReplace') {
            offset = 0;
        }
        let currentParagraph: ParagraphWidget = this.selection.start.paragraph;
        currentParagraph = currentParagraph.combineWidget(this.owner.viewer) as ParagraphWidget;
        if (insertAfter) {

            let length: number = this.selection.getLineLength(currentParagraph.lastChild as LineWidget);
            let insertIndex: number = newParagraph.firstChild ? (newParagraph.firstChild as LineWidget).children.length : 0;

            this.moveInlines(currentParagraph, newParagraph, insertIndex, offset, lineWidget, length, currentParagraph.lastChild as LineWidget);
        } else if (offset > 0) {
            this.moveInlines(currentParagraph, newParagraph, 0, 0, currentParagraph.firstChild as LineWidget, offset, lineWidget);
        }
        let splittedWidget: ParagraphWidget[] = currentParagraph.getSplitWidgets() as ParagraphWidget[];
        currentParagraph = insertAfter ? splittedWidget[splittedWidget.length - 1] : splittedWidget[0];
        let insertIndex: number = currentParagraph.containerWidget.childWidgets.indexOf(currentParagraph);
        if (insertAfter) {
            insertIndex++;
        }
        let bodyWidget: BodyWidget = currentParagraph.containerWidget as BodyWidget;
        newParagraph.index = currentParagraph.index;
        newParagraph.containerWidget = bodyWidget;
        bodyWidget.childWidgets.splice(insertIndex, 0, newParagraph);
        this.constructRevisionsForBlock(newParagraph, true);
        this.updateNextBlocksIndex(insertAfter ? currentParagraph : newParagraph, true);
        newParagraph.height = 0;
        this.documentHelper.layout.layoutBodyWidgetCollection(newParagraph.index, bodyWidget, newParagraph, false);
    }

    private moveInlines(currentParagraph: ParagraphWidget, newParagraph: ParagraphWidget, insertIndex: number, startOffset: number, startLine: LineWidget, endOffset: number, endLine: LineWidget): void {
        if (newParagraph.childWidgets.length === 0) {
            let line: LineWidget = new LineWidget(newParagraph);
            newParagraph.childWidgets.push(line);
        }
        let isMoved: boolean = false;
        this.documentHelper.layout.clearListElementBox(currentParagraph);
        this.documentHelper.layout.clearListElementBox(newParagraph);
        for (let j: number = 0; j < currentParagraph.childWidgets.length; j++) {
            let lineWidget: LineWidget = currentParagraph.childWidgets[j] as LineWidget;
            if (startLine === lineWidget && endLine === lineWidget) {
                insertIndex = this.moveContent(lineWidget, startOffset, endOffset, insertIndex, newParagraph);
                break;
            }
            if (endLine === lineWidget) {
                insertIndex = this.moveContent(lineWidget, 0, endOffset, insertIndex, newParagraph);
                break;
            } else if (startLine === lineWidget) {
                isMoved = true;

                insertIndex = this.moveContent(lineWidget, startOffset, this.documentHelper.selection.getLineLength(lineWidget), insertIndex, newParagraph);

            } else if (isMoved) {
                insertIndex = this.moveContent(lineWidget, 0, this.documentHelper.selection.getLineLength(lineWidget), insertIndex, newParagraph);
            }
        }
        this.removeEmptyLine(currentParagraph);
        if (!currentParagraph.isInsideTable) {
            this.documentHelper.layout.reLayoutParagraph(currentParagraph, 0, 0);
        }
    }


    private moveContent(lineWidget: LineWidget, startOffset: number, endOffset: number, insertIndex: number, paragraph: ParagraphWidget): number {
        let count: number = 0;
        //let lineIndex: number = lineWidget.paragraph.childWidgets.indexOf(lineWidget);
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let inline: ElementBox = lineWidget.children[i];
            if (startOffset >= count + inline.length || inline instanceof ListTextElementBox) {
                if (!(inline instanceof ListTextElementBox)) {
                    count += inline.length;
                }
                continue;
            }
            let startIndex: number = 0;
            if (startOffset > count) {
                startIndex = startOffset - count;
            }

            let endIndex: number = endOffset - count;
            if (endIndex > inline.length) {
                endIndex = inline.length;
            }
            if (startIndex > 0) {
                count += startIndex;
            }
            if (startIndex === 0 && endIndex === inline.length) {
                if (inline instanceof ShapeElementBox) {
                    let shapeIndex: number = lineWidget.paragraph.floatingElements.indexOf(inline);
                    if (shapeIndex !== -1) {
                        lineWidget.paragraph.floatingElements.splice(shapeIndex, 1);
                    }
                }
                (paragraph.firstChild as LineWidget).children.splice(insertIndex, 0, inline);
                inline.line = (paragraph.firstChild as LineWidget);
                insertIndex++;
                // if (editAction < 4) {
                // this.unLinkFieldCharacter(inline);
                lineWidget.children.splice(i, 1);
                i--;
                // }
            } else if (inline instanceof TextElementBox) {
                // if (editAction < 4) {
                let span: TextElementBox = new TextElementBox();
                span.characterFormat.copyFormat(inline.characterFormat);
                span.text = inline.text.substr(startIndex, endIndex - startIndex);
                inline.ischangeDetected = true;
                span.ischangeDetected = true;
                (paragraph.firstChild as LineWidget).children.splice(insertIndex, 0, span);
                span.line = (paragraph.firstChild as LineWidget);
                insertIndex++;
                this.updateRevisionForMovedContent(inline, span);
                inline.text = inline.text.slice(0, startIndex) + inline.text.slice(endIndex);
                inline.ischangeDetected = true;
            }
            if (endOffset <= count + endIndex - startIndex) {
                break;
            }
            count += endIndex - startIndex;
        }
        return insertIndex;
    }
    private updateRevisionForMovedContent(inline: ElementBox, tempSpan: ElementBox): any {
        for (let i: number = 0; i < inline.revisions.length; i++) {
            let currentRevision: Revision = inline.revisions[i];
            let rangeIndex: number = currentRevision.range.indexOf(inline);
            tempSpan.revisions.splice(0, 0, currentRevision);
            currentRevision.range.splice(rangeIndex, 0, tempSpan);
        }
    }

    /**
     * update complex changes when history is not preserved
     *
     * @param {number} action - Specifies the action
     * @param {string} start - Specifies the selection start
     * @param {string} end - Specified the selection end
     * @private
     * @returns {void}
     */
    public updateComplexWithoutHistory(action?: number, start?: string, end?: string): void {
        let selection: Selection = this.documentHelper.selection;
        if (action === 0) {
            let startPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(startPosition, start);
            this.documentHelper.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
            this.setPositionForCurrentIndex(selection.start, end);
            this.setPositionForCurrentIndex(selection.end, end);
        }
        if (action === 1) {
            let startPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(startPosition, start);
            let endPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(endPosition, end);
            this.documentHelper.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
            if (endPosition.paragraph !== startPosition.paragraph) {
                this.documentHelper.layout.reLayoutParagraph(endPosition.paragraph, 0, 0);
            }
        }
        if (selection.owner.isShiftingEnabled) {
            this.documentHelper.layout.shiftLayoutedItems(false);
            if (this.documentHelper.owner.enableHeaderAndFooter) {
                this.updateHeaderFooterWidget();
            }
        }
        selection.owner.isShiftingEnabled = false;
        selection.start.updatePhysicalPosition(true);
        if (selection.isEmpty) {
            selection.end.setPositionInternal(selection.start);
        } else {
            selection.end.updatePhysicalPosition(true);
        }
        selection.upDownSelectionLength = selection.end.location.x;
        selection.fireSelectionChanged(true);
        this.documentHelper.updateFocus();
        this.owner.viewer.updateScrollBars();
        this.fireContentChange();
        this.isHandledComplex = true;
    }
    /**
     * Re-layout content.
     *
     * @param {Selection} selection - Specifies the selection 
     * @param isSelectionChanged - Specifies the selection changed
     * @private
     * @returns {void}
     */
    public reLayout(selection: Selection, isSelectionChanged?: boolean): void {
        if (!isNullOrUndefined(this.previousBlockToLayout)) {
            // Layout content for previous page to fix content based on KeepWithNext format.
            let previousBlock: BlockWidget = this.previousBlockToLayout;
            this.documentHelper.layout.layoutBodyWidgetCollection(previousBlock.index, previousBlock.bodyWidget, previousBlock, false, false);
            this.previousBlockToLayout = undefined;
        }
        if (!this.documentHelper.isComposingIME && this.editorHistory && this.editorHistory.isHandledComplexHistory()) {
            if (this.editorHistory.currentHistoryInfo && this.editorHistory.currentHistoryInfo.action !== 'ClearFormat') {
                if (this.editorHistory.currentHistoryInfo.action !== 'ApplyStyle') {
                    this.startParagraph = undefined;
                    this.endParagraph = undefined;
                }
            }
            this.isHandledComplex = false;
            return;
        }
        if (isNullOrUndefined(this.documentHelper.blockToShift)) {
            this.documentHelper.removeEmptyPages();
            this.documentHelper.layout.updateFieldElements();
            /*  if (!isNullOrUndefined(selection.start.paragraph.bodyWidget.page.footnoteWidget)) {
                  let foot: FootNoteWidget = selection.start.paragraph.bodyWidget.page.footnoteWidget;
                  //this.documentHelper.layout.layoutfootNote(foot);
              }
              if (!isNullOrUndefined(selection.start.paragraph.bodyWidget.page.endnoteWidget)) {
                  let foot: FootNoteWidget = selection.start.paragraph.bodyWidget.page.endnoteWidget;
                  //this.documentHelper.layout.layoutfootNote(foot);
              }*/
            this.owner.viewer.updateScrollBars();
            if (!selection.owner.isShiftingEnabled) {
                selection.fireSelectionChanged(true);
                this.startParagraph = undefined;
                this.endParagraph = undefined;
            }
        }
        if (isNullOrUndefined(isSelectionChanged)) {
            isSelectionChanged = selection.isEmpty;
        }
        if (this.owner.showRevisions) {
            this.owner.trackChangesPane.updateTrackChanges();
        }
        if (selection.owner.isShiftingEnabled) {
            selection.owner.isShiftingEnabled = false;
            selection.owner.isLayoutEnabled = true;
            this.documentHelper.layout.shiftLayoutedItems(true);
            if (this.documentHelper.owner.enableHeaderAndFooter) {
                this.updateHeaderFooterWidget();
            }
            if (!isNullOrUndefined(selection.start.paragraph)) {
                if (selection.start.paragraph.containerWidget instanceof FootNoteWidget) {
                    if (selection.start.paragraph.containerWidget.footNoteType === 'Footnote') {
                        this.documentHelper.layout.isRelayoutFootnote = true;
                        this.shiftFootnotePageContent(selection.start.paragraph.containerWidget);
                    } else {
                        this.documentHelper.layout.isRelayoutFootnote = false;
                        this.shiftFootnotePageContent();
                    }
                }
            }
            this.getOffsetValue(selection);
            selection.upDownSelectionLength = selection.end.location.x;
            selection.fireSelectionChanged(true);
            this.documentHelper.updateFocus();
            this.startParagraph = undefined;
            this.endParagraph = undefined;
            this.documentHelper.layout.allowLayout = true;
        }
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo &&
            ((this.editorHistory.currentBaseHistoryInfo.action !== 'RowResizing'
                && this.editorHistory.currentBaseHistoryInfo.action !== 'CellResizing')
                || (this.editorHistory.isUndoing || this.editorHistory.isRedoing))) {
            if (this.editorHistory.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                this.editorHistory.currentBaseHistoryInfo.updateSelection();
            }
            if (!(this.editorHistory.undoStack && this.editorHistory.undoStack.length > 0 && this.editorHistory.undoStack[this.editorHistory.undoStack.length - 1] instanceof HistoryInfo &&
                (this.editorHistory.undoStack[this.editorHistory.undoStack.length - 1] as HistoryInfo).modifiedActions &&
                (this.editorHistory.undoStack[this.editorHistory.undoStack.length - 1] as HistoryInfo).modifiedActions[(this.editorHistory.undoStack[this.editorHistory.undoStack.length - 1] as HistoryInfo).modifiedActions.length - 1] === this.editorHistory.currentBaseHistoryInfo)) {
                this.editorHistory.updateHistory();
            }
            else {
                this.editorHistory.currentBaseHistoryInfo = undefined;
            }
        }
        this.fireContentChange();
        if (this.owner.enableLockAndEdit) {
            // Editable region border get updated in content changes event.
            // So, handled rerendering content after applying border.
            this.owner.viewer.updateScrollBars();
        }
        this.owner.documentHelper.layout.isRelayout = false;
    }
    /**
     * @private
     * @returns {void}
     */
    public updateHeaderFooterWidget(headerFooterWidget?: HeaderFooterWidget): void {
        if (isNullOrUndefined(headerFooterWidget)) {
            headerFooterWidget = this.selection.start.paragraph.bodyWidget as HeaderFooterWidget;
        }
        this.updateHeaderFooterWidgetToPage(headerFooterWidget);

        this.shiftPageContent(headerFooterWidget.headerFooterType, headerFooterWidget.sectionFormat);
    }

    private updateHeaderFooterWidgetToPage(node: HeaderFooterWidget): void {
        let currentPage: Page = node.page;
        node = this.documentHelper.layout.updateHeaderFooterToParent(node);
        let isEvenPage: boolean = (node.headerFooterType === 'EvenHeader' || node.headerFooterType === 'EvenFooter');
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let page: Page = this.documentHelper.pages[i];
            if ((i + 1 === 1) && page.bodyWidgets[0].sectionFormat.differentFirstPage &&
                node.headerFooterType.indexOf('FirstPage') !== -1) {
                return;
            }
            if (page.index === 0 && page.bodyWidgets[0].sectionFormat.differentFirstPage &&
                node.headerFooterType.indexOf('FirstPage') === -1) {
                continue;
            }
            if (currentPage !== page) {
                if (page.bodyWidgets[0].sectionFormat.differentOddAndEvenPages) {
                    if (isEvenPage && (i + 1) % 2 === 0) {
                        this.updateHeaderFooterWidgetToPageInternal(page, node, node.headerFooterType.indexOf('Header') !== -1);
                    } else if ((!isEvenPage && (i + 1) % 2 !== 0)) {
                        if (i > 0 || !(page.bodyWidgets[0].sectionFormat.differentFirstPage)) {
                            this.updateHeaderFooterWidgetToPageInternal(page, node, node.headerFooterType.indexOf('Header') !== -1);
                        }
                    }
                } else {
                    this.updateHeaderFooterWidgetToPageInternal(page, node, node.headerFooterType.indexOf('Header') !== -1);
                }
            }
        }
    }

    private updateHeaderFooterWidgetToPageInternal(page: Page, widget: HeaderFooterWidget, isHeader: boolean): void {
        if (widget.page !== page) {
            let hfWidget: HeaderFooterWidget = widget.clone();
            hfWidget.page = page;
            (this.owner.viewer as PageLayoutViewer).updateHFClientArea(hfWidget.sectionFormat, isHeader);
            hfWidget = this.documentHelper.layout.layoutHeaderFooterItems(this.owner.viewer, hfWidget);
            let headerOrFooter: HeaderFooterWidget;
            if (isHeader) {
                headerOrFooter = page.headerWidget;
                page.headerWidget = hfWidget;
            } else {
                headerOrFooter = page.footerWidget;
                page.footerWidget = hfWidget;
            }
            this.removeFieldInWidget(headerOrFooter);
            this.removeFieldInWidget(headerOrFooter, undefined, true);
            headerOrFooter.destroy();
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public removeFieldInWidget(widget: Widget, isBookmark?: boolean, isContentControl?: boolean): void {
        if (isNullOrUndefined(isBookmark)) {
            isBookmark = false;
        }
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            this.removeFieldInBlock(widget.childWidgets[i] as BlockWidget, isBookmark, isContentControl);
        }
    }

    private removeFieldInBlock(block: BlockWidget, isBookmark?: boolean, isContentControl?: boolean): void {
        if (block instanceof TableWidget) {
            if (block.wrapTextAround && !isNullOrUndefined(block.bodyWidget)) {
                let index: number = block.bodyWidget.floatingElements.indexOf(block);
                if (index !== -1) {
                    block.bodyWidget.floatingElements.splice(index, 1);
                }
            }
            this.removeFieldTable(block, isBookmark, isContentControl);
        } else {
            this.removeField(block as ParagraphWidget, isBookmark, isContentControl);
        }
    }

    private removeFieldTable(table: TableWidget, isBookmark?: boolean, isContentControl?: boolean): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.removeFieldInWidget(row.childWidgets[j] as Widget, isBookmark, isContentControl);
            }
        }
    }
    private shiftFootnotePageContent(foot?: FootNoteWidget): void {
        let section: BodyWidget = this.documentHelper.pages[0].bodyWidgets[0];
        if (!isNullOrUndefined(foot)) {
            let index: number = this.documentHelper.pages.indexOf(foot.page);
            section = this.documentHelper.pages[index].bodyWidgets[0];
        }
        if (!isNullOrUndefined(section.page.footnoteWidget)) {
            this.checkAndShiftFromBottom(section.page, section.page.footnoteWidget);
        }
        if (!isNullOrUndefined(section.page.endnoteWidget)) {
            //this.checkAndShiftFromBottom(section.page, section.page.endnoteWidget);
        }
        if (this.documentHelper.blockToShift) {
            this.documentHelper.renderedLists.clear();
            this.documentHelper.renderedLevelOverrides = [];
            this.documentHelper.layout.shiftLayoutedItems(false);
        }

    }
    /**
     * @private
     * @returns {void}
     */
    public shiftPageContent(type: HeaderFooterType, sectionFormat: WSectionFormat): void {
        // let type: HeaderFooterType = headerFooter.headerFooterType;
        let pageIndex: number;
        if (type.indexOf('First') !== -1) {
            pageIndex = 0;
        } else if (sectionFormat.differentOddAndEvenPages) {
            let isEven: boolean = type.indexOf('Even') !== -1;
            if (sectionFormat.differentFirstPage) {
                pageIndex = isEven ? 1 : 2;
            } else {
                pageIndex = !isEven ? 0 : 1;
            }
        } else {
            pageIndex = sectionFormat.differentFirstPage ? 1 : 0;
            if (pageIndex === 1 && this.documentHelper.pages.length === 1) {
                pageIndex = 0;
            }
        }
        let section: BodyWidget = this.documentHelper.pages[pageIndex].bodyWidgets[0];
        do {
            if (type.indexOf('Header') !== -1) {
                let widget: HeaderFooterWidget = section.page.headerWidget;
                let isNotEmpty: boolean = !widget.isEmpty || widget.isEmpty && this.owner.enableHeaderAndFooter;
                let firstBlock: BlockWidget = (section.firstChild as BlockWidget);
                let top: number = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
                let headerDistance: number = HelperMethods.convertPointToPixel(sectionFormat.headerDistance);
                if (isNotEmpty) {
                    top = Math.max(headerDistance + section.page.headerWidget.height, top);
                }
                if (firstBlock.y !== top) {
                    this.owner.viewer.updateClientArea(section.sectionFormat, section.page);
                    firstBlock = firstBlock.combineWidget(this.owner.viewer) as BlockWidget;
                    let prevWidget: BlockWidget = firstBlock.previousRenderedWidget as BlockWidget;
                    if (prevWidget) {
                        if (firstBlock.containerWidget.equals(prevWidget.containerWidget)) {
                            this.owner.viewer.cutFromTop(prevWidget.y + prevWidget.height);

                            this.documentHelper.layout.updateContainerWidget(firstBlock as Widget, prevWidget.containerWidget as BodyWidget, prevWidget.indexInOwner + 1, false);
                        }
                    }
                    this.documentHelper.blockToShift = firstBlock;
                }
            } else {
                this.checkAndShiftFromBottom(section.page, section.page.footerWidget);
            }
            if (this.documentHelper.blockToShift) {
                this.documentHelper.renderedLists.clear();
                this.documentHelper.renderedLevelOverrides = [];
                this.documentHelper.layout.shiftLayoutedItems(false);
            }
            while (section) {
                let splittedSection: BodyWidget[] = section.getSplitWidgets() as BodyWidget[];
                section = splittedSection[splittedSection.length - 1].nextRenderedWidget as BodyWidget;
                if (section) {
                    if (pageIndex === 0) {
                        break;
                    } else {
                        if (section.page.index + 1 % 2 === 0 && pageIndex === 1 ||
                            (section.page.index + 1 % 2 !== 0 && pageIndex === 2)) {
                            break;
                        }
                        let nextPage: Page = section.page.nextPage;
                        if (!isNullOrUndefined(nextPage) && nextPage.bodyWidgets[0].equals(section)) {
                            section = nextPage.bodyWidgets[0];
                            break;
                        }
                    }
                }
            }

        } while (section);

    }

    private checkAndShiftFromBottom(page: Page, footerWidget: HeaderFooterWidget | FootNoteWidget): void {
        let bodyWidget: BodyWidget = page.bodyWidgets[0];
        let blockToShift: BlockWidget;
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            let block: BlockWidget = bodyWidget.childWidgets[i] as BlockWidget;
            if (block.y + block.height > footerWidget.y) {
                blockToShift = block;
                break;
            }
            if (bodyWidget.childWidgets.length - 1 === i && block.y + block.height < footerWidget.y) {
                blockToShift = block as BlockWidget;
                break;
            }
        }
        this.owner.viewer.updateClientArea(bodyWidget.sectionFormat, page, true);
        this.owner.viewer.cutFromTop(blockToShift.y);
        this.documentHelper.blockToShift = blockToShift;
    }

    private allowFormattingInFormFields(property: string): boolean {
        if (this.documentHelper.protectionType === 'FormFieldsOnly' && this.selection.isInlineFormFillMode() &&
            !isNullOrUndefined(this.owner.documentEditorSettings.formFieldSettings.formattingExceptions)) {
            for (let j: number = 0; j < this.owner.documentEditorSettings.formFieldSettings.formattingExceptions.length; j++) {
                if (property.toLowerCase() === this.owner.documentEditorSettings.formFieldSettings.formattingExceptions[j].toLowerCase()) {
                    return true;
                }
            }
        }
        return false;
    }
    private getContentControl(): ContentControl {
        for (let i: number = 0; i < this.documentHelper.contentControlCollection.length; i++) {
            let contentControlStart: ContentControl = this.documentHelper.contentControlCollection[i];
            let position: PositionInfo = this.selection.getPosition(contentControlStart);
            let cCstart: TextPosition = position.startPosition;
            let cCend: TextPosition = position.endPosition;
            let start: TextPosition = this.selection.start;
            let end: TextPosition = this.selection.end;
            if (!this.selection.isForward) {
                start = this.selection.end;
                end = this.selection.start;
            }
            if ((start.isExistAfter(cCstart) || start.isAtSamePosition(cCstart))
                && (end.isExistBefore(cCend) || end.isAtSamePosition(cCend))) {
                return contentControlStart;
            }
        }
        return undefined;
    }
    private checkPlainTextContentControl(): void {
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            end = this.selection.start;
            start = this.selection.end;
        }
        let startIndex: number = 0;
        let endIndex: number = 0;
        let startInline: ElementInfo = start.currentWidget.getInline(start.offset, startIndex) as ElementInfo;
        let endInline: ElementInfo = end.currentWidget.getInline(end.offset, endIndex) as ElementInfo;
        startIndex = startInline.index;
        endIndex = endInline.index;
        let startInlineEle: ElementBox = startInline.element;
        let endInlineEle: ElementBox = endInline.element;
        let startPosition: TextPosition;
        let endPosition: TextPosition;
        if ((startInlineEle && startInlineEle.contentControlProperties && startInlineEle.contentControlProperties.type === 'Text')
            || (endInlineEle && endInlineEle.contentControlProperties && endInlineEle.contentControlProperties.type === 'Text')) {
            startInlineEle = this.getContentControl();
            if (startInlineEle.contentControlProperties && !isNullOrUndefined(startInlineEle)) {
                let offset: number = startInlineEle.line.getOffset(startInlineEle, 1);
                startPosition = new TextPosition(this.owner);
                startPosition.setPositionParagraph(startInlineEle.line, offset);
            } else {
                startPosition = start;
            }
            if (endInlineEle.contentControlProperties && (startInlineEle as ContentControl).reference) {
                endInlineEle = (startInlineEle as ContentControl).reference;
                let endoffset: number = endInlineEle.line.getOffset(endInlineEle, endInlineEle.length);
                endPosition = new TextPosition(this.owner);
                endPosition.setPositionParagraph(endInlineEle.line, endoffset);
            } else {
                endPosition = end;
            }
            this.selection.selectRange(startPosition, endPosition);
        } else if (start.paragraph.contentControlProperties
            && start.paragraph.contentControlProperties.type === 'Text') {
            this.selection.selectParagraph();
        }
    }
    //Paste Implementation ends
    //Character Format apply implementation starts

    /**
     * Applies character format for selection.
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @param {boolean} update - Spcifies the update
     * @private
     * @returns {void}
     */
    public onApplyCharacterFormat(property: string, value: Object, update?: boolean): void {
        let allowFormatting: boolean = this.documentHelper.isFormFillProtectedMode
            && this.documentHelper.selection.isInlineFormFillMode() && this.allowFormattingInFormFields(property);
        if ((this.restrictFormatting && !allowFormatting) || this.selection.checkContentControlLocked(true)) {
            return;
        }
        this.documentHelper.layout.isBidiReLayout = true;
        let selection: Selection = this.documentHelper.selection;
        if ((selection.owner.isReadOnlyMode && !allowFormatting) || !selection.owner.isDocumentLoaded) {
            return;
        }
        update = isNullOrUndefined(update) ? false : update;
        let action: Action = (property[0].toUpperCase() + property.slice(1)) as Action;
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let lastLine: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
        this.checkPlainTextContentControl();
        if (selection.isEmpty && selection.contextType !== 'List') {
            selection.skipFormatRetrieval = true;
            if (selection.end.isAtParagraphEnd) {
                this.initHistory(action);
                this.documentHelper.owner.isShiftingEnabled = true;
                this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
                this.reLayout(this.documentHelper.selection);
                this.documentHelper.updateFocus();
            } else {
                selection.fireSelectionChanged(true);
            }
            selection.skipFormatRetrieval = false;
            return;
        }
        //Skip consider highlightcolor if paragraph mark alone is selected similar to Microsoft Word behaviour
        if (property === 'highlightColor' && selection.start.isInSameParagraph(selection.end)) {
            let start: TextPosition = selection.start;
            let end: TextPosition = selection.end;
            if (!this.selection.isForward) {
                end = selection.start;
                start = selection.end;
            }
            if (end.offset === selection.getLineLength(end.currentWidget) + 1 && end.offset - 1 === start.offset) {
                return;
            }
        }

        this.setOffsetValue(selection);
        this.initHistory(action);
        // Todo: Complete Microsoft Word behavior on apply formatting in empty selection
        // if (selection.isEmpty) {
        //     this.documentHelper.owner.isShiftingEnabled = true;
        //     this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
        //     this.reLayout(this.documentHelper.selection);
        //     this.documentHelper.updateFocus();
        //     return;
        // }
        if (selection.contextType === 'List') {
            // this.updateCharacterFormatForListText(selection, action, value, update);
            this.applyCharacterFormatForListText(selection, property, value, update);
        } else {
            //Iterate and update format.
            this.updateSelectionCharacterFormatting(property, value, update);
        }
        this.documentHelper.layout.isBidiReLayout = false;
    }


    private applyCharacterFormatForListText(selection: Selection, property: string, values: Object, update: boolean): void {
        let listLevel: WListLevel = selection.getListLevel(selection.start.paragraph);
        if (isNullOrUndefined(listLevel)) {
            return;
        }
        let characterFormat: WCharacterFormat = listLevel.characterFormat;
        switch (property) {
            case 'bold':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'bold', !(characterFormat.bold));
                break;
            case 'italic':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'italic', !(characterFormat.italic));
                break;
            case 'fontColor':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'fontColor', values);
                break;
            case 'fontFamily':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'fontFamily', values);
                break;
            case 'fontSize':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'fontSize', values);
                break;
            case 'highlightColor':
                this.applyListCharacterFormatByValue(selection, characterFormat, 'highlightColor', values);
                break;
            case 'baselineAlignment':
                if (characterFormat.baselineAlignment === values) {
                    values = 'Normal';
                }
                this.applyListCharacterFormatByValue(selection, characterFormat, 'baselineAlignment', values);
                break;
            case 'strikethrough':
                if (characterFormat.strikethrough === values) {
                    values = 'None';
                }
                this.applyListCharacterFormatByValue(selection, characterFormat, 'strikethrough', values);
                break;
            case 'underline':
                if (characterFormat.underline === values) {
                    values = 'None';
                }
                this.applyListCharacterFormatByValue(selection, characterFormat, 'underline', values);
                break;
            case 'characterFormat':
                this.applyListCharacterFormatByValue(selection, characterFormat, undefined, values);
                break;
        }
    }
    private applyListCharacterFormatByValue(selection: Selection, format: WCharacterFormat, property: string, value: Object): void {
        this.initHistory('ListCharacterFormat');
        this.applyCharFormatValue(format, property, value, false);
        this.editorHistory.updateHistory();
        this.reLayout(selection);
        this.fireContentChange();
    }
    /**
     * @private
     * @returns {void}
     */
    public updateListCharacterFormat(selection: Selection, property: string, value: Object): void {
        this.updateListTextSelRange(selection, property, value, false);
    }
    private updateListTextSelRange(selection: Selection, property: string, value: Object, update: boolean): void {
        this.documentHelper.owner.isShiftingEnabled = true;
        let startPositionInternal: TextPosition = selection.start;
        let endPositionInternal: TextPosition = selection.end;
        if (!selection.isForward) {
            startPositionInternal = selection.end;
            endPositionInternal = selection.start;
        }
        this.initHistoryPosition(selection, startPositionInternal);
        let listLevel: WListLevel = selection.getListLevel(selection.start.paragraph);
        this.applyCharFormatValue(listLevel.characterFormat, property, value, update);
        this.startSelectionReLayouting(startPositionInternal.paragraph, selection, startPositionInternal, endPositionInternal);
    }
    /**
     * @private
     * @returns {void}
     */
    public updateInsertPosition(): void {
        let selection: Selection = this.documentHelper.selection;
        let position: TextPosition = selection.start;
        if (!selection.isForward) {
            position = selection.end;
        }
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)
            && !isNullOrUndefined(position)) {
            if (isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.insertPosition)) {
                this.updateHistoryPosition(position, true);
            }
        }
    }
    /**
     * Preserve paragraph and offset value for selection
     * 
     * @private
     * @returns {void}
     */
    public setOffsetValue(selection: Selection): void {
        let info: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
        this.startParagraph = info.paragraph;
        this.startOffset = info.offset;
        info = this.selection.getParagraphInfo(selection.end);
        this.endParagraph = info.paragraph;
        this.endOffset = info.offset;
    }
    /**
     * Toggles the highlight color property of selected contents.
     *
     * @param {HighlightColor} highlightColor Default value of ‘underline’ parameter is Yellow.
     * @returns {void}
     */
    public toggleHighlightColor(highlightColor?: HighlightColor): void {
        let selection: Selection = this.documentHelper.selection;
        if (isNullOrUndefined(highlightColor) || highlightColor === 'NoColor') {
            highlightColor = 'Yellow';
        }
        //In Ms Word the highlight color is took from the ribbon. So we Have given yellow as constant.
        if (selection.characterFormat.highlightColor === highlightColor) {
            highlightColor = 'NoColor';
        }
        this.selection.characterFormat.highlightColor = highlightColor;
    }
    /**
     * Toggles the subscript formatting of selected contents.
     *
     * @returns {void}
     */
    public toggleSubscript(): void {
        if (!this.owner.isReadOnlyMode) {
            let value: BaselineAlignment = this.selection.characterFormat.baselineAlignment === 'Subscript' ? 'Normal' : 'Subscript';
            this.selection.characterFormat.baselineAlignment = value as BaselineAlignment;
        }
    }
    /**
     * Toggles the superscript formatting of selected contents.
     *
     * @returns {void}
     */
    public toggleSuperscript(): void {
        if (!this.owner.isReadOnlyMode) {
            let value: BaselineAlignment = this.selection.characterFormat.baselineAlignment === 'Superscript' ? 'Normal' : 'Superscript';
            this.selection.characterFormat.baselineAlignment = value as BaselineAlignment;
        }
    }
    /**
     * Increases the left indent of selected paragraphs to a factor of 36 points.
     *
     * @returns {void}
     */
    public increaseIndent(): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            this.onApplyParagraphFormat('leftIndent', this.documentHelper.defaultTabWidth, true, false);
        }
    }
    /**
     * Decreases the left indent of selected paragraphs to a factor of 36 points.
     *
     * @returns {void}
     */
    public decreaseIndent(): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            this.onApplyParagraphFormat('leftIndent', -this.documentHelper.defaultTabWidth, true, false);
        }
    }
    /**
     * Clears the list format for selected paragraphs.
     *
     * @returns {void}
     */
    public clearList(): void {
        this.selection.owner.editorModule.onApplyList(undefined);
    }
    /**
     * Applies the bullet list to selected paragraphs.
     *
     * @param {string} bullet Bullet character
     * @param {string} fontFamily Bullet font family
     * @returns {void}
     */
    public applyBullet(bullet: string, fontFamily: string): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            this.applyBulletOrNumbering(bullet, 'Bullet', fontFamily);
        }
    }
    /**
     * Applies the numbering list to selected paragraphs.
     *
     * @param {string} numberFormat  “%n” representations in ‘numberFormat’ parameter will be replaced by respective list level’s value.
     * `“%1)” will be displayed as “1)” `
     * @param {ListLevelPattern} listLevelPattern  Default value of ‘listLevelPattern’ parameter is ListLevelPattern.Arabic
     * @returns {void}
     */
    public applyNumbering(numberFormat: string, listLevelPattern?: ListLevelPattern): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            this.applyBulletOrNumbering(numberFormat, listLevelPattern, 'Verdana');
        }
    }
    /**
     * Toggles the baseline alignment property of selected contents.
     *
     * @param {BaselineAlignment} baseAlignment Specifies the baseline alignment
     * @returns {void}
     */
    public toggleBaselineAlignment(baseAlignment: BaselineAlignment): void {
        this.updateProperty(2, baseAlignment);
    }

    /**
     * Clears the formatting.
     *
     * @returns {void}
     */
    public clearFormatting(): void {
        let selection: Selection = this.documentHelper.selection;
        this.setPreviousBlockToLayout();
        this.initComplexHistory('ClearFormat');
        // let startIndex: string = selection.start.getHierarchicalIndexInternal();
        // let endIndex: string = selection.end.getHierarchicalIndexInternal();
        if (selection.isEmpty) {
            selection.start.moveToParagraphStartInternal(selection, false);
            selection.end.moveToParagraphEndInternal(selection, false);
        }
        this.setOffsetValue(selection);
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ClearCharacterFormat');
        }
        this.updateSelectionCharacterFormatting('ClearCharacterFormat', undefined, false);
        this.getOffsetValue(selection);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.setOffsetValue(selection);
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ClearParagraphFormat');
        }
        this.updateParagraphFormatInternal('ClearParagraphFormat', undefined, false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.getOffsetValue(selection);
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
            this.editorHistory.updateComplexHistory();
        }
        this.startParagraph = undefined;
        this.endParagraph = undefined;
        // else {
        //     this.checkAndUpdatedSelection(startIndex, endIndex);
        // }
    }

    private updateProperty(type: number, value: Object): void {
        let selection: Selection = this.selection;
        if ((selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !selection.owner.isDocumentLoaded) {
            return;
        }
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = startPosition.currentWidget.getInline(startPosition.offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        let paragraph: ParagraphWidget = startPosition.paragraph;
        if (!isNullOrUndefined(inline) && inline.length === indexInInline && !this.selection.isEmpty) {
            inline = inline.nextNode as ElementBox;
        }
        if (type === 1) {
            let currentUnderline: Underline = 'None';
            if (!isNullOrUndefined(inline)) {
                currentUnderline = inline.characterFormat.underline;
            } else if (!isNullOrUndefined(paragraph)) {
                currentUnderline = paragraph.characterFormat.underline;
            }
            this.selection.characterFormat.underline = value === currentUnderline ? 'None' : value as Underline;
        } else {
            let script: BaselineAlignment = 'Normal';
            if (!isNullOrUndefined(inline)) {
                script = inline.characterFormat.baselineAlignment;
            } else if (!isNullOrUndefined(paragraph)) {
                script = paragraph.characterFormat.baselineAlignment;
            }
            if (script === value) {
                value = 'Normal';
            }
            this.selection.characterFormat.baselineAlignment = value as BaselineAlignment;
        }
    }
    private getCompleteStyles(): string {
        let completeStylesString: string = '{"styles":[';
        for (let name of this.documentHelper.preDefinedStyles.keys) {
            completeStylesString += (this.documentHelper.preDefinedStyles.get(name) + ',');
        }
        return completeStylesString.slice(0, -1) + ']}';
    }
    /**
     * Initialize default styles
     *
     * @private
     * @returns {void}
     */
    public intializeDefaultStyles(): void {
        let existingStyles: string[] = this.owner.getStyleNames('Paragraph');
        let defaultStyleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
        let styleNames: string[] = defaultStyleNames.filter((val: string) => {
            return existingStyles.indexOf(val) === -1;
        });
        for (let name of styleNames) {
            this.createStyle(this.documentHelper.preDefinedStyles.get(name));
        }
    }
    /**
     * Creates a new instance of Style.
     * 
     * @returns {void}
     */
    public createStyle(styleString: string): void {
        this.createStyleIn(styleString);
    }
    /**
     * Create a Style.
     * @private
     * @returns {object}
     */
    public createStyleIn(styleString: string): Object {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let style: any = JSON.parse(styleString);
        let styleObj: Object = this.documentHelper.styles.findByName(style.name);
        if (styleObj !== undefined) {
            //Create a new style with new name and add it to collection.
            style.name = this.getUniqueStyleName(style.name);
        }
        this.documentHelper.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), style, this.documentHelper.styles);
        return this.documentHelper.styles.findByName(style.name);
    }

    private getUniqueStyleName(name: string): string {
        let uniqueName: string = this.getUniqueName(name);
        let style: Object = this.documentHelper.styles.findByName(uniqueName);
        while (!isNullOrUndefined(style)) {
            uniqueName = this.getUniqueStyleName((style as WStyle).name);
            style = this.documentHelper.styles.findByName(uniqueName);
        }
        return uniqueName;
    }
    private getUniqueName(name: string): string {
        let matchArray: RegExpMatchArray = name.match(/\d+$/);
        let returnName: string;
        if (!isNullOrUndefined(matchArray) && matchArray.length > 0) {
            return name.replace(matchArray[0], (parseInt(matchArray[0], 10) + 1).toString());
        } else {
            return name + '_1';
        }
    }
    /**
     * Update Character format for selection
     * @private
     */
    public updateSelectionCharacterFormatting(property: string, values: Object, update: boolean): void {
        if (isNullOrUndefined(property)) {
            property = 'CharacterFormat';
        }
        switch (property) {
            case 'bold':
                this.updateCharacterFormat('bold', values);
                break;
            case 'italic':
                this.updateCharacterFormat('italic', values);
                break;
            case 'fontColor':
                this.updateCharacterFormat('fontColor', values);
                break;
            case 'fontFamily':
                this.updateCharacterFormat('fontFamily', values);
                break;
            case 'fontSize':
                this.documentHelper.layout.isBidiReLayout = false;
                this.updateCharacterFormatWithUpdate(this.documentHelper.selection, 'fontSize', values, update);
                break;
            case 'highlightColor':
                this.updateCharacterFormat('highlightColor', values);
                break;
            case 'baselineAlignment':
                this.updateCharacterFormat('baselineAlignment', values);
                break;
            case 'strikethrough':
                this.updateCharacterFormat('strikethrough', values);
                break;
            case 'underline':
                this.updateCharacterFormat('underline', values);
                break;
            case 'styleName':
                this.updateCharacterFormatWithUpdate(this.documentHelper.selection, 'styleName', values, true);
                break;
            case 'CharacterFormat':
                this.updateCharacterFormat(undefined, values);
                break;
            case 'ClearCharacterFormat':
                this.updateCharacterFormat(undefined, values);
                break;
            case 'allCaps':
                this.updateCharacterFormat('allCaps', values);
                break;
        }
        this.reLayout(this.documentHelper.selection);
    }

    private updateCharacterFormat(property: string, value: Object): void {
        this.updateCharacterFormatWithUpdate(this.documentHelper.selection, property, value, false);
    }
    private updateCharacterFormatWithUpdate(selection: Selection, property: string, value: Object, update: boolean): void {
        this.documentHelper.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        this.applyCharFormatSelectedContent(startPosition.paragraph, selection, startPosition, endPosition, property, value, update);
    }

    private applyCharFormatSelectedContent(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        //Selection start in cell.
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(start.paragraph.associatedCell, start, end))) {
            let cell: TableCellWidget;
            start.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(start, true);
            }
            cell = start.paragraph.associatedCell;
            this.applyCharFormatCell(cell, selection, start, end, property, value, update);
            let table: TableWidget = cell.ownerTable;

            this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        } else {
            this.applyCharFormat(paragraph, selection, start, end, property, value, update);
        }
    }

    private applyCharFormatForSelectedPara(paragraph: ParagraphWidget, selection: Selection, property: string, value: Object, update: boolean): void {
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let j: number = 0; j < line.children.length; j++) {
                let element: ElementBox = line.children[j];
                this.applyCharFormatValue(element.characterFormat, property, value, update);
            }
        }
        this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
    }
    private splittedLastParagraph(paragraph: ParagraphWidget): ParagraphWidget {
        let splittedWidets: ParagraphWidget[] = paragraph.getSplitWidgets() as ParagraphWidget[];
        return splittedWidets[splittedWidets.length - 1] as ParagraphWidget;
    }

    private getNextParagraphForCharacterFormatting(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let widgetCollection: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        block = widgetCollection[widgetCollection.length - 1];
        block = this.documentHelper.selection.getNextRenderedBlock(block);
        if (!isNullOrUndefined(block)) { //Goto the next block.
            if (block instanceof ParagraphWidget) {
                this.applyCharFormat(block, this.documentHelper.selection, start, end, property, value, update);
            } else {
                this.applyCharFormatForTable(0, block as TableWidget, this.documentHelper.selection, start, end, property, value, update);
            }
        }
    }

    private applyCharFormat(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        paragraph = paragraph.combineWidget(this.owner.viewer) as ParagraphWidget;
        let startOffset: number = 0;
        let length: number = selection.getParagraphLength(paragraph);
        let startLineWidget: number = paragraph.childWidgets.indexOf(start.currentWidget) !== -1 ?
            paragraph.childWidgets.indexOf(start.currentWidget) : 0;
        let endOffset: number = end.offset;
        let endLineWidget: number = paragraph.childWidgets.indexOf(end.currentWidget) !== -1 ?
            paragraph.childWidgets.indexOf(end.currentWidget) : paragraph.childWidgets.length - 1;
        if (!isNullOrUndefined(selection)) {
            if (paragraph === start.paragraph) {
                startOffset = start.offset;
            }
        }
        if (!paragraph.equals(end.paragraph)) {
            let lastLine: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
            //Skip consider highlightcolor if paragraph mark alone is selected similar to Microsoft Word behaviour
            if (!(property === 'highlightColor' && selection.isParagraphLastLine(lastLine)
                && start.currentWidget === lastLine && start.offset === selection.getLineLength(lastLine))) {
                this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
            }
            endOffset = length;

        } else {
            let lastLine: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
            if (selection.isParagraphLastLine(lastLine) && end.currentWidget === lastLine
                && ((endOffset === selection.getLineLength(lastLine) + 1) || (selection.isEmpty && selection.end.isAtParagraphEnd))) {
                this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
            }
        }
        // let count: number = 0;
        for (let i: number = startLineWidget; i <= endLineWidget; i++) {
            let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (i !== startLineWidget) {
                startOffset = selection.getStartLineOffset(line);
            }
            if (line === end.currentWidget) {
                endOffset = end.offset;
            } else {
                endOffset = selection.getLineLength(line);
            }
            let count: number = 0;
            let isBidi: boolean = line.paragraph.paragraphFormat.bidi;
            let isContainsRtl: boolean = this.documentHelper.layout.isContainsRtl(line);
            let isStarted: boolean = true;
            let endElement: ElementBox = undefined;
            let indexOf: number = -1;
            let isIncrease: boolean = true;

            for (let j: number = !isBidi ? 0 : line.children.length - 1; !isBidi ? j < line.children.length : j >= 0; isBidi ? j-- : isIncrease ? j++ : j--) {
                let inlineObj: ElementBox = line.children[j] as ElementBox;
                if (!isBidi && isContainsRtl) {
                    while ((isStarted || isNullOrUndefined(endElement)) && inlineObj instanceof TextElementBox
                        && (this.documentHelper.textHelper.isRTLText(inlineObj.text)
                            || this.documentHelper.textHelper.containsSpecialCharAlone(inlineObj.text)) && inlineObj.nextElement) {
                        if (!endElement) {
                            endElement = inlineObj;
                        }
                        if (indexOf === -1) {
                            indexOf = line.children.indexOf(inlineObj);
                        }
                        j = inlineObj.line.children.indexOf(inlineObj);
                        inlineObj = inlineObj.nextElement;
                        isIncrease = false;
                    }
                }
                isStarted = false;
                if (inlineObj instanceof ListTextElementBox) {
                    continue;
                }
                if (endElement === inlineObj) {
                    endElement = undefined;
                    j = indexOf;
                    indexOf = -1;
                    isIncrease = true;
                }
                if (startOffset >= count + inlineObj.length) {
                    count += inlineObj.length;
                    continue;
                }
                let startIndex: number = 0;
                if (startOffset > count) {
                    startIndex = startOffset - count;
                }
                let endIndex: number = endOffset - count;
                let inlineLength: number = inlineObj.length;
                if (endIndex > inlineLength) {
                    endIndex = inlineLength;
                }
                let index: number = this.applyCharFormatInline(inlineObj, selection, startIndex, endIndex, property, value, update);
                if (isBidi || isContainsRtl && !isIncrease) {
                    j -= index;
                } else {
                    j += index;
                }

                if (endOffset <= count + inlineLength) {
                    break;
                }
                count += inlineLength;
            }
        }
        let endParagraph: ParagraphWidget = end.paragraph;
        if (!paragraph.bidi && this.documentHelper.layout.isContainsRtl(paragraph.childWidgets[startLineWidget] as LineWidget)) {
            this.documentHelper.layout.reLayoutParagraph(paragraph, startLineWidget, 0, false, true);
        } else {
            this.documentHelper.layout.reLayoutParagraph(paragraph, startLineWidget, 0);
        }
        if (paragraph.equals(endParagraph)) {
            return;
        }
        this.getNextParagraphForCharacterFormatting(paragraph, start, end, property, value, update);
    }
    /**
     * Toggles the bold property of selected contents.
     *
     * @returns {void}
     */
    public toggleBold(): void {
        if (this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) {
            return;
        }
        let value: boolean = this.getCurrentSelectionValue('bold');
        this.selection.characterFormat.bold = value;
    }
    /**
     * Toggles the bold property of selected contents.
     *
     * @returns {void}
     */
    public toggleItalic(): void {
        if (this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) {
            return;
        }
        let value: boolean = this.getCurrentSelectionValue('italic');
        this.selection.characterFormat.italic = value;
    }
    /**
     * Change the selected text to uppercase.
     * @private
     */
    public changeCase(property: string): void {
        if (this.selection.isEmpty || (this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode())) {
            return;
        }
        this.initHistory('Uppercase');
        this.documentHelper.owner.isShiftingEnabled = true;
        let selection: Selection = this.selection;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        this.changeSelectedTextCase(selection, startPosition, endPosition, property);
        this.reLayout(selection);
    }
    /**
     * Change the selected text case.
     * @private
     */
    /* eslint-disable-next-line max-len */
    public changeSelectedTextCase(selection: Selection, startPosition: TextPosition, endPosition: TextPosition, property: string, removedTextNodes?: IWidget[]): void {
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPosition);
        selection.editPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(startPosition, true);
            }
        }
        let isRevert: boolean = this.editorHistory.isUndoing;
        if (isRevert && !isNullOrUndefined(removedTextNodes) && removedTextNodes.length > 0) {
            this.removedTextNodes = removedTextNodes;
        }
        let endPos: string = endPosition.selection.endOffset;
        this.changeTextCase(startPosition.paragraph, selection, startPosition, endPosition, property, isRevert);
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            if (endPosition.selection.endOffset !== endPos) {
                endPosition = selection.getTextPosBasedOnLogicalIndex(endPos);
            }
            if (this.checkEndPosition(selection)) {
                this.updateHistoryPosition(endPosition, false);
            }
            selection.selectPosition(startPosition, endPosition);
        }
    }
    /* eslint-disable-next-line max-len */
    private changeTextCase(para: ParagraphWidget, selection: Selection, startPosition: TextPosition, endPosition: TextPosition, property: string, isRevert: boolean): void {
        if (startPosition.paragraph.isInsideTable && (!endPosition.paragraph.isInsideTable
            || startPosition.paragraph.associatedCell !== endPosition.paragraph.associatedCell
            || selection.isCellSelected(startPosition.paragraph.associatedCell, startPosition, endPosition))) {
            let tableCell: TableCellWidget;
            startPosition.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(startPosition, true);
            }
            tableCell = startPosition.paragraph.associatedCell;
            this.changeCaseParaFormatInCell(tableCell, startPosition, endPosition, property, isRevert);
            let table: TableWidget = tableCell.ownerTable;
            this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        } else {
            this.changeCaseParagraph(para, selection, startPosition, endPosition, property, isRevert);
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseParagraph(para: ParagraphWidget, selection: Selection, startPos: TextPosition, endPos: TextPosition, property: string, isRevert: boolean): void {
        para = para.combineWidget(this.owner.viewer) as ParagraphWidget;
        let startOffsetVal: number = 0;
        let len: number = selection.getParagraphLength(para);
        let startLine: number = para.childWidgets.indexOf(startPos.currentWidget) !== -1 ?
            para.childWidgets.indexOf(startPos.currentWidget) : 0;
        let endOffsetVal: number = endPos.offset;
        let endLine: number = para.childWidgets.indexOf(endPos.currentWidget) !== -1 ?
            para.childWidgets.indexOf(endPos.currentWidget) : para.childWidgets.length - 1;
        if (!isNullOrUndefined(selection)) {
            if (para === startPos.paragraph) {
                startOffsetVal = startPos.offset;
            }
        }
        if (!para.equals(endPos.paragraph)) {
            endOffsetVal = len;
        }
        // let count: number = 0;
        for (let i: number = startLine; i <= endLine; i++) {
            let line: LineWidget = para.childWidgets[i] as LineWidget;
            if (i !== startLine) {
                startOffsetVal = selection.getStartLineOffset(line);
            }
            if (line === endPos.currentWidget) {
                endOffsetVal = endPos.offset;
            } else {
                endOffsetVal = selection.getLineLength(line);
            }
            let textCount: number = 0;
            let isBidi: boolean = line.paragraph.paragraphFormat.bidi;
            let isLineContainsRtl: boolean = this.documentHelper.layout.isContainsRtl(line);
            let isIterationStarted: boolean = true;
            let endElementBox: ElementBox = undefined;
            let childIndex: number = -1;
            let isIncreaseIteration: boolean = true;
            /* eslint-disable-next-line max-len */
            for (let j: number = !isBidi ? 0 : line.children.length - 1; !isBidi ? j < line.children.length : j >= 0; isBidi ? j-- : isIncreaseIteration ? j++ : j--) {
                let child: ElementBox = line.children[j] as ElementBox;
                if (!isBidi && isLineContainsRtl) {
                    while ((isIterationStarted || isNullOrUndefined(endElementBox)) && child instanceof TextElementBox
                        && (this.documentHelper.textHelper.isRTLText(child.text)
                            || this.documentHelper.textHelper.containsSpecialCharAlone(child.text)) && child.nextElement) {
                        if (!endElementBox) {
                            endElementBox = child;
                        }
                        if (childIndex === -1) {
                            childIndex = line.children.indexOf(child);
                        }
                        j = child.line.children.indexOf(child);
                        child = child.nextElement;
                        isIncreaseIteration = false;
                    }
                }
                isIterationStarted = false;
                if (child instanceof ListTextElementBox) {
                    continue;
                }
                if (endElementBox === child) {
                    endElementBox = undefined;
                    j = childIndex;
                    childIndex = -1;
                    isIncreaseIteration = true;
                }
                if (startOffsetVal >= textCount + child.length) {
                    textCount += child.length;
                    continue;
                }
                let startIndex: number = 0;
                if (startOffsetVal > textCount) {
                    startIndex = startOffsetVal - textCount;
                }
                let endIndex: number = endOffsetVal - textCount;
                let inlineLength: number = child.length;
                if (endIndex > inlineLength) {
                    endIndex = inlineLength;
                }
                let index: number = this.changeCaseInline(child, selection, startIndex, endIndex, property, isRevert);
                if (isBidi || isLineContainsRtl && !isIncreaseIteration) {
                    j -= index;
                } else {
                    j += index;
                }
                if (endOffsetVal <= textCount + inlineLength) {
                    break;
                }
                textCount += inlineLength;
            }
        }
        let endPara: ParagraphWidget = endPos.paragraph;
        if (!para.bidi && this.documentHelper.layout.isContainsRtl(para.childWidgets[startLine] as LineWidget)) {
            this.documentHelper.layout.reLayoutParagraph(para, startLine, 0, false, true);
        } else {
            this.documentHelper.layout.reLayoutParagraph(para, startLine, 0);
        }
        if (para.equals(endPara)) {
            return;
        }
        this.changeCaseNextBlock(para, startPos, endPos, property, isRevert);
    }
    /* eslint-disable-next-line max-len */
    private changeCaseInline(inline: ElementBox, selection: Selection, startIndex: number, endIndex: number, property: string, isRevert: boolean): number {
        if (inline instanceof TextElementBox) {
            if (startIndex === 0 && endIndex === inline.length) {
                this.changeCaseInlineInternal(inline, selection, startIndex, endIndex, property, isRevert);
            } else {
                return this.changeCaseInlineInternal(inline, selection, startIndex, endIndex, property, isRevert);
            }
        }
        return 0;
    }
    private addRemovedTextNodes(inline: ElementBox, newText: string): void {
        if (inline instanceof TextElementBox) {
            if (!isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                let span: TextElementBox = this.editorHistory.currentBaseHistoryInfo.removedNodes[0] as TextElementBox;
                if (isNullOrUndefined(span)) {
                    span = new TextElementBox();
                    span.text = '';
                    this.editorHistory.currentBaseHistoryInfo.removedNodes.push(span);
                }
                span.text += newText;
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseInlineInternal(inlineObj: ElementBox, selection: Selection, startIndex: number, endIndex: number, property: string, isRevert: boolean): number {
        let x: number = 0;
        let index: number = inlineObj.line.children.indexOf(inlineObj);
        let paragraph: ParagraphWidget = inlineObj.paragraph;
        let lineIndex: number = paragraph.childWidgets.indexOf(inlineObj.line);
        let textElement: TextElementBox;
        if (startIndex > 0) {
            let textToChange: string = (inlineObj as TextElementBox).text.substr(startIndex, endIndex - startIndex);
            this.addRemovedTextNodes(inlineObj, textToChange);
            textElement = new TextElementBox();
            textElement.characterFormat.copyFormat(inlineObj.characterFormat);
            textElement.line = inlineObj.line;
            //Change the text case
            textElement.text = this.getChangeCaseText(textToChange,
                property, isRevert);
            textElement.isRightToLeft = inlineObj.isRightToLeft;
            if (!paragraph.paragraphFormat.bidi && !this.documentHelper.layout.isContainsRtl(inlineObj.line)) {
                index++;
            }
            inlineObj.line.children.splice(index, 0, textElement);
            x++;
        }
        if (endIndex < inlineObj.length) {
            textElement = new TextElementBox();
            textElement.characterFormat.copyFormat(inlineObj.characterFormat);
            textElement.text = (inlineObj as TextElementBox).text.substring(endIndex);
            textElement.line = inlineObj.line;
            textElement.isRightToLeft = inlineObj.isRightToLeft;
            if (!paragraph.paragraphFormat.bidi && !this.documentHelper.layout.isContainsRtl(inlineObj.line)) {
                index++;
            }
            inlineObj.line.children.splice(index, 0, textElement);
            x++;
        }
        let textElementBox: TextElementBox = (inlineObj as TextElementBox);
        if (startIndex === 0) {
            let newText: string = textElementBox.text.substr(0, endIndex);
            this.addRemovedTextNodes(inlineObj, newText);
            //Change the text case
            textElementBox.text = this.getChangeCaseText(newText, property, isRevert);
        } else {
            let preText: string = textElementBox.text.substr(0, startIndex);
            textElementBox.text = preText;
        }
        return x;
    }
    /* eslint-disable-next-line max-len */
    private changeCaseNextBlock(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, isRevert: boolean): void {
        block = this.getNextBlockForChangeCase(block, start, end, property, isRevert);
        if (!isNullOrUndefined(block)) { //Goto the next block.
            if (block instanceof ParagraphWidget) {
                this.changeCaseParagraph(block, this.documentHelper.selection, start, end, property, isRevert);
            } else {
                this.changeCaseForTable(0, block as TableWidget, this.documentHelper.selection, start, end, property, isRevert);
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private getNextBlockForChangeCase(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, isRevert: boolean): BlockWidget {
        let widgetCollection: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        block = widgetCollection[widgetCollection.length - 1];
        block = this.documentHelper.selection.getNextRenderedBlock(block);
        return block;
    }
    private getChangeCaseText(input: string, property: string, isRevert: boolean): string {
        if (isRevert) {
            if (!isNullOrUndefined(this.removedTextNodes) && this.removedTextNodes.length > 0) {
                let textElement: TextElementBox = this.removedTextNodes[0] as TextElementBox;
                let oldText: string = textElement.text.substr(0, input.length);
                textElement.text = textElement.text.substr(oldText.length, textElement.length - oldText.length);
                input = oldText;
                if (textElement.text === '') {
                    this.removedTextNodes.splice(0, 1);
                }
            }
        } else {
            switch (property) {
                case 'Uppercase':
                    input = input.toUpperCase();
                    break;
                default:
                    break;
            }
        }
        return input;
    }
    // Table
    /* eslint-disable-next-line max-len */
    private changeCaseForTable(indexToStart: number, tableWidget: TableWidget, selection: Selection, startPos: TextPosition, endPos: TextPosition, property: string, isRevert: boolean): void {
        tableWidget = tableWidget.combineWidget(this.owner.viewer) as TableWidget;
        for (let i: number = indexToStart; i < tableWidget.childWidgets.length; i++) {
            let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.changeCaseForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, isRevert);
            }
            if (endPos.paragraph.isInsideTable && selection.containsRow(row, endPos.paragraph.associatedCell)) {
                this.documentHelper.layout.layoutBodyWidgetCollection(tableWidget.index, tableWidget.containerWidget, tableWidget, false);
                return;
            }
        }
        this.documentHelper.layout.layoutBodyWidgetCollection(tableWidget.index, tableWidget.containerWidget, tableWidget, false);
        this.changeCaseNextBlock(tableWidget, startPos, endPos, property, isRevert);
    }
    /* eslint-disable-next-line max-len */
    private changeCaseForSelectedCell(cell: TableCellWidget, selection: Selection, property: string, isRevert: boolean): void {
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                this.changeCaseForSelectedPara((block as ParagraphWidget), selection, property, isRevert);
            } else {
                this.changeCaseForSelTable(block as TableWidget, selection, property, isRevert);
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseForSelectedPara(paragraph: ParagraphWidget, selection: Selection, property: string, isRevert: boolean): void {
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let j: number = 0; j < line.children.length; j++) {
                let element: TextElementBox = line.children[j] as TextElementBox;
                if (!isNullOrUndefined(element) && element instanceof TextElementBox) {
                    this.addRemovedTextNodes(element, element.text);
                    element.text = this.getChangeCaseText(element.text, property, isRevert);
                }
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseForSelTable(tableWidget: TableWidget, selection: Selection, property: string, isRevert: boolean): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.changeCaseForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, isRevert);
            }
        }
    }
    // Cell
    /* eslint-disable-next-line max-len */
    private changeCaseParaFormatInCell(tableCell: TableCellWidget, startPos: TextPosition, endPos: TextPosition, property: string, isRevert: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        if (endPos.paragraph.isInsideTable) {
            let cellContainer: TableCellWidget = selection.getContainerCellOf(tableCell, endPos.paragraph.associatedCell);
            if (cellContainer.ownerTable.contains(endPos.paragraph.associatedCell)) {
                let startCell: TableCellWidget = selection.getSelectedCell(tableCell, cellContainer);
                let endCell: TableCellWidget = selection.getSelectedCell(endPos.paragraph.associatedCell, cellContainer);
                if (selection.containsCell(cellContainer, endPos.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (selection.isCellSelected(cellContainer, startPos, endPos)) {
                        this.changeCaseParaForCellInternal(cellContainer, selection, property, isRevert);
                    } else {
                        if (startCell === cellContainer) {
                            this.changeCaseParagraph(startPos.paragraph, selection, startPos, endPos, property, isRevert);
                        } else {
                            this.changeCaseParaForRow(startCell.ownerRow, selection, startPos, endPos, property, isRevert);
                        }
                    }
                } else {
                    //Change case of other selected cells in the current table.
                    this.changeCaseParaForTableCell(cellContainer.ownerTable, cellContainer, endCell, property, isRevert);
                }
            } else {
                this.changeCaseParaForRow(cellContainer.ownerRow, selection, startPos, endPos, property, isRevert);
            }
        } else {
            let wCell: TableCellWidget = selection.getContainerCell(tableCell);
            this.changeCaseParaForRow(wCell.ownerRow, selection, startPos, endPos, property, isRevert);
        }
    }
    // Table
    /* eslint-disable-next-line max-len */
    private changeCaseParaForTableCell(tableWidget: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget, property: string, isRevert: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        let cellStartValue: number = selection.getCellLeft(startCell.ownerRow, startCell);
        let cellEndValue: number = cellStartValue + startCell.cellFormat.cellWidth;
        let cellEndLeft: number = selection.getCellLeft(endCell.ownerRow, endCell);
        let cellEndRight: number = cellEndLeft + endCell.cellFormat.cellWidth;
        let cellInfo: CellInfo = this.updateSelectedCellsInTable(cellStartValue, cellEndValue, cellEndLeft, cellEndRight);
        cellStartValue = cellInfo.start;
        cellEndValue = cellInfo.end;
        let count: number = tableWidget.childWidgets.indexOf(endCell.ownerRow);
        for (let m: number = tableWidget.childWidgets.indexOf(startCell.ownerRow); m <= count; m++) {
            let row: TableRowWidget = tableWidget.childWidgets[m] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let left: number = selection.getCellLeft(row, row.childWidgets[j] as TableCellWidget);
                if (Math.round(cellStartValue) <= Math.round(left) && Math.round(left) < Math.round(cellEndValue)) {
                    this.changeCaseParaForCellInternal((row.childWidgets[j] as TableCellWidget), selection, property, isRevert);
                }
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseParaForCellInternal(tableCell: TableCellWidget, selection: Selection, property: string, isRevert: boolean): void {
        for (let i: number = 0; i < tableCell.childWidgets.length; i++) {
            let childBlock: BlockWidget = tableCell.childWidgets[i] as BlockWidget;
            if (childBlock instanceof ParagraphWidget) {
                this.changeCaseForSelectedPara((childBlock as ParagraphWidget), selection, property, isRevert);
            } else {
                this.changeCaseParaFormatTableInternal(childBlock as TableWidget, selection, property, isRevert);
            }
        }
    }
    /* eslint-disable-next-line max-len */
    private changeCaseParaFormatTableInternal(table: TableWidget, selection: Selection, property: string, isRevert: boolean): void {
        for (let x: number = 0; x < table.childWidgets.length; x++) {
            let row: TableRowWidget = table.childWidgets[x] as TableRowWidget;
            for (let y: number = 0; y < row.childWidgets.length; y++) {
                this.changeCaseParaForCellInternal((row.childWidgets[y] as TableCellWidget), selection, property, isRevert);
            }
        }
    }
    // Row
    /* eslint-disable-next-line max-len */
    private changeCaseParaForRow(wRow: TableRowWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, isRevert: boolean): void {
        for (let i: number = wRow.rowIndex; i < wRow.ownerTable.childWidgets.length; i++) {
            let row: TableRowWidget = wRow.ownerTable.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.changeCaseParaForCellInternal((row.childWidgets[j] as TableCellWidget), selection, property, isRevert);
            }
            if (end.paragraph.isInsideTable && this.documentHelper.selection.containsRow(row, end.paragraph.associatedCell)) {
                return;
            }
        }
        this.changeCaseNextBlock(wRow.ownerTable, start, end, property, isRevert);
    }
    /**
     * Toggle All Caps formatting for the selected content.
     *
     * @returns {void}
     */
    public toggleAllCaps(): void {
        if (this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) {
            return;
        }
        let value: boolean = this.getCurrentSelectionValue('allCaps');
        this.selection.characterFormat.allCaps = value;
    }
    private getCurrentSelectionValue(property: string): boolean {
        let value: boolean = false;
        if ((property === 'bold' || property === 'italic')) {
            let characterFormat: WCharacterFormat = this.getSelectedCharacterFormat();
            if (property === 'bold') {
                value = !(characterFormat.bold);
            }
            if (property === 'italic') {
                value = !(characterFormat.italic);
            }
        }
        return value;
    }
    private getSelectedCharacterFormat(): WCharacterFormat {
        let index: number = 0;
        let start: TextPosition = this.selection.start;
        if (!this.selection.isForward) {
            start = this.selection.end;
        }
        let lineWidget: LineWidget = start.currentWidget;
        let inlineObj: ElementInfo = lineWidget.getInline(start.offset, index);
        let inline: ElementBox = inlineObj.element;
        // inline.ownerBase
        index = inlineObj.index;
        let characterFormat: WCharacterFormat = lineWidget.paragraph.characterFormat;
        if (!isNullOrUndefined(inline)) {
            if (this.selection.isEmpty && this.selection.contextType === 'List') {
                let listLevel: WListLevel = this.selection.getListLevel(this.selection.start.paragraph);
                if (listLevel.characterFormat.uniqueCharacterFormat) {
                    characterFormat = listLevel.characterFormat;
                }
            } else if (!this.selection.isEmpty && index === inline.length) {
                characterFormat = isNullOrUndefined(inline.nextNode) ? lineWidget.paragraph.characterFormat
                    : (inline.nextNode as ElementBox).characterFormat;
            } else {
                characterFormat = inline.characterFormat;
            }
        }
        return characterFormat;
    }
    /**
     * Toggles the underline property of selected contents.
     *
     * @param underline Default value of ‘underline’ parameter is Single.
     * @returns {void}
     */
    public toggleUnderline(underline?: Underline): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            this.updateProperty(1, underline);
        }
    }
    /**
     * Toggles the strike through property of selected contents.
     *
     * @param {Strikethrough} strikethrough Default value of strikethrough parameter is SingleStrike.
     * @returns {void}
     */
    public toggleStrikethrough(strikethrough?: Strikethrough): void {
        if (!this.owner.isReadOnlyMode || this.selection.isInlineFormFillMode()) {
            let value: Strikethrough;
            if (isNullOrUndefined(strikethrough)) {
                value = this.selection.characterFormat.strikethrough === 'SingleStrike' ? 'None' : 'SingleStrike';
            } else {
                value = strikethrough;
            }
            this.selection.characterFormat.strikethrough = value as Strikethrough;
        }
    }
    private updateFontSize(format: WCharacterFormat, value: Object): Object {
        if (typeof (value) === 'number' && !(value < 0 && format.fontSize === 1)) {
            return format.fontSize + value;
        }
        let fontsizeCollection: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72];
        if (typeof (value) === 'string' && value === 'increment') {
            if (format.fontSize < 8) {
                return format.fontSize + 1;
            } else if (format.fontSize >= 72 && format.fontSize < 80) {
                return 80;
            } else if (format.fontSize >= 80) {
                return format.fontSize + 10;
            } else {
                for (let i: number = 0; i < fontsizeCollection.length; i++) {
                    if (format.fontSize < fontsizeCollection[i]) {
                        return fontsizeCollection[i];
                    }
                }
            }
        } else if (typeof (value) === 'string' && value === 'decrement' && format.fontSize > 1) {
            if (format.fontSize <= 8) {
                return format.fontSize - 1;
            } else if (format.fontSize > 72 && format.fontSize <= 80) {
                return 72;
            } else if (format.fontSize > 80) {
                return format.fontSize - 10;
            } else {
                for (let i: number = 0; i < fontsizeCollection.length; i++) {
                    if (format.fontSize <= fontsizeCollection[i]) {
                        return fontsizeCollection[i - 1];
                    }
                }
            }
        }
        return format.fontSize;
    }
    // Inline

    private applyCharFormatInline(inline: ElementBox, selection: Selection, startIndex: number, endIndex: number, property: string, value: Object, update: boolean): number {
        if (startIndex === 0 && endIndex === inline.length) {
            this.applyCharFormatValue(inline.characterFormat, property, value, update);
            return 0;
        } else if (inline instanceof TextElementBox) {
            return this.formatInline(inline, selection, startIndex, endIndex, property, value, update);
        }
        return 0;
    }

    private formatInline(inline: ElementBox, selection: Selection, startIndex: number, endIndex: number, property: string, value: Object, update: boolean): number {
        let x: number = 0;
        let node: ElementBox = inline;
        let index: number = inline.line.children.indexOf(node);
        let paragraph: ParagraphWidget = inline.paragraph;
        let lineIndex: number = paragraph.childWidgets.indexOf(inline.line);
        let textElement: TextElementBox;
        if (startIndex > 0) {
            textElement = new TextElementBox();
            textElement.characterFormat.copyFormat(inline.characterFormat);
            textElement.line = inline.line;
            textElement.text = (inline as TextElementBox).text.substr(startIndex, endIndex - startIndex);
            textElement.isRightToLeft = inline.isRightToLeft;
            this.applyCharFormatValue(textElement.characterFormat, property, value, update);
            if (!paragraph.paragraphFormat.bidi && !this.documentHelper.layout.isContainsRtl(inline.line)) {
                index++;
            }
            node.line.children.splice(index, 0, textElement);
            x++;
            // this.addToLinkedFields(span);                      
        }
        if (endIndex < node.length) {
            textElement = new TextElementBox();
            textElement.characterFormat.copyFormat(inline.characterFormat);
            textElement.text = (node as TextElementBox).text.substring(endIndex);
            textElement.line = inline.line;
            textElement.isRightToLeft = inline.isRightToLeft;
            if (!paragraph.paragraphFormat.bidi && !this.documentHelper.layout.isContainsRtl(inline.line)) {
                index++;
            }
            node.line.children.splice(index, 0, textElement);
            x++;
            // this.addToLinkedFields(span);                       
        }
        if (startIndex === 0) {
            (inline as TextElementBox).text = (inline as TextElementBox).text.substr(0, endIndex);
            this.applyCharFormatValue(inline.characterFormat, property, value, update);
        } else {
            (inline as TextElementBox).text = (inline as TextElementBox).text.substr(0, startIndex);
        }
        return x;
    }
    // Cell

    private applyCharFormatCell(cell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        if (end.paragraph.isInsideTable) {
            let containerCell: TableCellWidget = selection.getContainerCellOf(cell, end.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(end.paragraph.associatedCell)) {
                let startCell: TableCellWidget = selection.getSelectedCell(cell, containerCell);
                let endCell: TableCellWidget = selection.getSelectedCell(end.paragraph.associatedCell, containerCell);
                if (selection.containsCell(containerCell, end.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (selection.isCellSelected(containerCell, start, end)) {
                        value = this.getCharacterFormatValueOfCell(cell, selection, value, property);
                        this.applyCharFormatForSelectedCell(containerCell, selection, property, value, update);
                    } else {
                        if (startCell === containerCell) {
                            this.applyCharFormat(start.paragraph, selection, start, end, property, value, update);
                        } else {
                            this.applyCharFormatRow(startCell.ownerRow, selection, start, end, property, value, update);
                        }
                    }
                } else {//Format other selected cells in current table.
                    this.applyCharFormatForTableCell(containerCell.ownerTable, selection, containerCell, endCell, property, value, update);
                }
            } else {
                this.applyCharFormatRow(containerCell.ownerRow, selection, start, end, property, value, update);
            }
        } else {
            let tableCell: TableCellWidget = selection.getContainerCell(cell);
            this.applyCharFormatRow(tableCell.ownerRow, selection, start, end, property, value, update);
        }
    }

    private applyCharFormatForSelectedCell(cell: TableCellWidget, selection: Selection, property: string, value: Object, update: boolean): void {
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                this.applyCharFormatForSelectedPara((block as ParagraphWidget), selection, property, value, update);
            } else {
                this.applyCharFormatForSelTable(block as TableWidget, selection, property, value, update);
            }
        }
    }
    // Row

    private applyCharFormatRow(row: TableRowWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        value = this.getCharacterFormatValueOfCell((row.childWidgets[0] as TableCellWidget), selection, value, property);
        this.applyCharFormatForTable(row.rowIndex, row.ownerTable, selection, start, end, property, value, update);
    }
    // Table

    private applyCharFormatForTable(index: number, table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        for (let i: number = index; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyCharFormatForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, value, update);
            }
            if (end.paragraph.isInsideTable && selection.containsRow(row, end.paragraph.associatedCell)) {
                this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
                return;
            }
        }
        this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        this.getNextParagraphForCharacterFormatting(table, start, end, property, value, update);

    }

    private applyCharFormatForSelTable(tableWidget: TableWidget, selection: Selection, property: string, value: Object, update: boolean): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyCharFormatForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, value, update);
            }
        }
    }

    private applyCharFormatForTableCell(table: TableWidget, selection: Selection, startCell: TableCellWidget, endCell: TableCellWidget, property: string, value: Object, update: boolean): void {
        let startCellLeft: number = selection.getCellLeft(startCell.ownerRow, startCell);
        let startCellRight: number = startCellLeft + startCell.cellFormat.cellWidth;
        let endCellLeft: number = selection.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        let cellInfo: CellInfo = this.updateSelectedCellsInTable(startCellLeft, startCellRight, endCellLeft, endCellRight);
        startCellLeft = cellInfo.start;
        startCellRight = cellInfo.end;
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        let isStarted: boolean = false;
        for (let i: number = table.childWidgets.indexOf(startCell.ownerRow); i <= count; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let left: number = selection.getCellLeft(row, row.childWidgets[j] as TableCellWidget);
                if (HelperMethods.round(startCellLeft, 2) <= HelperMethods.round(left, 2) &&
                    HelperMethods.round(left, 2) < HelperMethods.round(startCellRight, 2)) {
                    if (!isStarted) {
                        value = this.getCharacterFormatValueOfCell((row.childWidgets[j] as TableCellWidget), selection, value, property);
                        isStarted = true;
                    }
                    this.applyCharFormatForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, value, update);
                }
            }
        }
    }
    private updateSelectedCellsInTable(start: number, end: number, endCellLeft: number, endCellRight: number): CellInfo {
        let selection: Selection = this.documentHelper.selection;
        if (start > endCellLeft) {
            start = endCellLeft;
        }
        if (end < endCellRight) {
            end = endCellRight;
        }
        if (start > selection.upDownSelectionLength) {
            start = selection.upDownSelectionLength;
        }
        if (end < selection.upDownSelectionLength) {
            end = selection.upDownSelectionLength;
        }
        return { start: start, end: end };
    }
    private getCharacterFormatValueOfCell(cell: TableCellWidget, selection: Selection, value: Object, property: string): Object {
        if (typeof (value) === 'boolean' || (value === undefined && (property === 'bold' || property === 'italic'))) {
            let firstParagraph: ParagraphWidget = selection.getFirstParagraph(cell);
            let format: WCharacterFormat = firstParagraph.characterFormat;
            if (firstParagraph.childWidgets.length > 0 && (firstParagraph.childWidgets[0] as LineWidget).children.length > 0) {
                format = (firstParagraph.childWidgets[0] as LineWidget).children[0].characterFormat;
            }
            value = !format.getPropertyValue(property);
        }
        return value;
    }
    /**
     * Apply Character format for selection 
     *
     * @private
     * @returns {void}
     */
    public applyCharFormatValueInternal(selection: Selection, format: WCharacterFormat, property: string, value: Object): void {
        this.applyCharFormatValue(format, property, value, false);
    }
    private copyInlineCharacterFormat(sourceFormat: WCharacterFormat, destFormat: WCharacterFormat): void {
        destFormat.uniqueCharacterFormat = sourceFormat.uniqueCharacterFormat;
        destFormat.baseCharStyle = sourceFormat.baseCharStyle;
    }
    private applyCharFormatValue(format: WCharacterFormat, property: string, value: Object, update: boolean): void {
        if (update && property === 'fontSize') {
            value = this.updateFontSize(format, value);
        }
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedProperties(format, property, value);
        }
        if (value instanceof WCharacterFormat) {
            if (this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
                this.copyInlineCharacterFormat(value, format);
            } else {
                format.copyFormat(value);
            }
            return;
        }
        if (this.isForHyperlinkFormat && this.owner.enableTrackChanges && format.ownerBase instanceof ElementBox) {
            let currentElement: ElementBox = format.ownerBase as ElementBox;
            let prevElement: ElementBox = currentElement.previousNode;
            if (isNullOrUndefined(prevElement)) {
                let paraWidget: ParagraphWidget = currentElement.paragraph.previousWidget as ParagraphWidget;
                if (!isNullOrUndefined(paraWidget) && !paraWidget.isEmpty()) {
                    let lineWidget: LineWidget = paraWidget.lastChild as LineWidget;
                    prevElement = lineWidget.children[lineWidget.children.length - 1];
                }
            }
            while (!isNullOrUndefined(prevElement) && !(prevElement instanceof TextElementBox)) {
                prevElement = prevElement.previousNode;
            }
            if (!isNullOrUndefined(prevElement) && prevElement.revisions.length > 0) {
                let currentRevision: Revision = prevElement.revisions[prevElement.revisions.length - 1];
                if (!this.isRevisionAlreadyIn(currentElement, currentRevision)) {
                    currentElement.revisions.push(currentRevision);
                    currentRevision.range.push(currentElement);
                }

            } else {
                this.insertRevision(currentElement, 'Insertion');
            }
        }
        if (isNullOrUndefined(value)) {
            format.clearFormat();
            return;
        }
        if (property === 'bold') {
            format.bold = value as boolean;
        } else if (property === 'italic') {
            format.italic = value as boolean;
        } else if (property === 'fontColor') {
            format.fontColor = value as string;
        } else if (property === 'fontFamily') {
            format.fontFamily = value as string;
        } else if (property === 'fontSize') {
            format.fontSize = value as number;
        } else if (property === 'highlightColor') {
            format.highlightColor = value as HighlightColor;
        } else if (property === 'baselineAlignment') {
            format.baselineAlignment = value as BaselineAlignment;
        } else if (property === 'strikethrough') {
            format.strikethrough = value as Strikethrough;
        } else if (property === 'underline') {
            format.underline = value as Underline;
        } else if (property === 'styleName') {
            format.baseCharStyle = value as WStyle;
        } else if (property === 'allCaps') {
            format.allCaps = value as boolean;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onImageFormat(elementBox: ImageElementBox, width: number, height: number): void {
        let modifiedFormat: ImageInfo = new ImageInfo(elementBox);
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ImageResizing');
            this.editorHistory.currentBaseHistoryInfo.modifiedProperties.push(modifiedFormat);
        }
        this.setOffsetValue(this.selection);
        elementBox.width = width;
        elementBox.height = height;

        this.documentHelper.layout.reLayoutParagraph(elementBox.line.paragraph, elementBox.line.indexInOwner, 0);
        this.reLayout(this.selection, false);
        if (this.documentHelper.owner.imageResizerModule) {
            this.documentHelper.owner.imageResizerModule.positionImageResizer(elementBox);
        }
    }
    /**
     * Toggles the text alignment of selected paragraphs.
     *
     * @param {TextAlignment} textAlignment - Specified the text alignment.
     * @returns {void}
     */
    public toggleTextAlignment(textAlignment: TextAlignment): void {

        if ((this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.documentHelper.owner.isDocumentLoaded) {
            return;
        }
        // Toggle performed based on current selection format similar to MS word behavior.

        if (!isNullOrUndefined(this.documentHelper.selection.paragraphFormat.textAlignment) && this.documentHelper.selection.paragraphFormat.textAlignment === textAlignment) {
            if (textAlignment === 'Left') {
                this.onApplyParagraphFormat('textAlignment', 'Justify', false, true);
            } else {
                this.onApplyParagraphFormat('textAlignment', 'Left', false, true);
            }
        } else {
            this.onApplyParagraphFormat('textAlignment', textAlignment, false, true);
        }
    }
    /**
     * @private
     */
    public setPreviousBlockToLayout(): void {
        let startPosition: TextPosition = this.documentHelper.selection.start;
        if (!this.documentHelper.selection.isForward) {
            startPosition = this.documentHelper.selection.end;
        }
        let startParagraph: ParagraphWidget = startPosition.paragraph;
        if (startParagraph.paragraphFormat.keepWithNext) {
            let bodyWidget: BlockContainer = startParagraph.bodyWidget;
            if (!isNullOrUndefined(bodyWidget) && bodyWidget instanceof BodyWidget && bodyWidget.page) {
                let previousPage: Page = bodyWidget.page.previousPage;
                if (previousPage) {
                    this.previousBlockToLayout = previousPage.bodyWidgets[0].lastChild as BlockWidget;
                }
            }
        }
    }
    /**
     * Applies paragraph format for the selection ranges.
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @param {boolean} update - Specifies the update
     * @param {boolean} isSelectionChanged - Specifies the selection change.
     * @private
     * @returns {void}
     */
    public onApplyParagraphFormat(property: string, value: Object, update: boolean, isSelectionChanged: boolean): void {
        let allowFormatting: boolean = this.documentHelper.isFormFillProtectedMode
            && this.documentHelper.selection.isInlineFormFillMode() && this.allowFormattingInFormFields(property);
        if (this.restrictFormatting && !allowFormatting) {
            return;
        }
        this.setPreviousBlockToLayout();
        let action: Action = property === 'bidi' ? 'ParagraphBidi' : (property[0].toUpperCase() + property.slice(1)) as Action;
        this.documentHelper.owner.isShiftingEnabled = true;
        let selection: Selection = this.documentHelper.selection;
        this.initHistory(action);
        if ((this.owner.isReadOnlyMode && !allowFormatting) || !this.owner.isDocumentLoaded) {
            return;
        }
        if (property === 'leftIndent') {
            if (selection.paragraphFormat.listId !== -1 && update) {
                this.updateListLevel(value > 0);
                return;
            }
        }
        if (selection.isEmpty) {
            this.setOffsetValue(selection);
            let isBidiList: boolean = selection.paragraphFormat.bidi &&
                (property === 'listFormat' || selection.paragraphFormat.listId !== -1);
            if (!isBidiList) {
                this.documentHelper.layout.isBidiReLayout = true;
            }
            if (update && property === 'leftIndent') {
                value = this.getIndentIncrementValue(selection.start.paragraph, value as number);
            }
            let para: ParagraphWidget = selection.start.paragraph;
            let layout: Layout = this.documentHelper.layout;
            let footNoteWidgetsInfo: FootNoteWidgetsInfo = layout.getFootNodeWidgetsToShiftToPage(para);
            para = para.combineWidget(this.owner.viewer) as ParagraphWidget;
            this.applyParaFormatProperty(para, property, value, update);
            this.layoutItemBlock(para, false);
            if (footNoteWidgetsInfo.footNoteWidgets.length > 0) {
                layout.moveFootNotesToPage(footNoteWidgetsInfo.footNoteWidgets, footNoteWidgetsInfo.fromBodyWidget, footNoteWidgetsInfo.toBodyWidget);
                layout.layoutfootNote(footNoteWidgetsInfo.toBodyWidget.page.footnoteWidget);
            }
            if (!isBidiList) {
                this.documentHelper.layout.isBidiReLayout = false;
            }
        } else {
            //Iterate and update formatting's.      
            if (action !== 'ParagraphBidi') {
                this.setOffsetValue(selection);
            }
            this.updateSelectionParagraphFormatting(property, value, update);
        }
        this.reLayout(selection);
    }
    /**
     * Update the list level 
     *
     * @param {boolean} increaseLevel - Specifies the increase level
     * @private
     * @returns {void}
     */
    public updateListLevel(increaseLevel: boolean): void {
        // Increment or Decrement list level for Multilevel lists.
        let documentHelper: DocumentHelper = this.documentHelper;
        let listFormat: WListFormat = this.documentHelper.selection.start.paragraph.paragraphFormat.listFormat;
        let paragraphFormat: WParagraphFormat = this.documentHelper.selection.start.paragraph.paragraphFormat;
        let list: WList = documentHelper.getListById(paragraphFormat.listFormat.listId);
        let listLevel: WListLevel = documentHelper.layout.getListLevel(list, paragraphFormat.listFormat.listLevelNumber);
        let levelNumber: number;
        if (increaseLevel) {
            levelNumber = paragraphFormat.listFormat.listLevelNumber + 1;
        } else {
            levelNumber = paragraphFormat.listFormat.listLevelNumber - 1;
        }
        let nextListLevel: WListLevel = documentHelper.layout.getListLevel(list, levelNumber);
        if (!isNullOrUndefined(nextListLevel)) {
            this.onApplyListInternal(list, levelNumber);
            documentHelper.selection.start.updatePhysicalPosition(true);
            documentHelper.selection.end.updatePhysicalPosition(true);
            documentHelper.selection.updateCaretPosition();
        }
    }
    /**
     * Applies list
     *
     * @param {WList} list - Specified the list
     * @param {number} listLevelNumber - Specified the list level number
     * @private
     * @returns {void}
     */
    public onApplyListInternal(list: WList, listLevelNumber: number): void {
        //let selection: Selection = this.documentHelper.selection;
        let listFormat: WListFormat = new WListFormat();
        if (!isNullOrUndefined(list) && listLevelNumber >= 0 && listLevelNumber < 9) {
            listFormat.listId = list.listId;
            listFormat.listLevelNumber = listLevelNumber;
        }
        this.onApplyParagraphFormat('listFormat', listFormat, false, false);
    }
    /**
     * Apply paragraph format to selection range
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @param {boolean} update - Specifies the update
     * @private
     * @returns {void}
     */
    public updateSelectionParagraphFormatting(property: string, value: Object, update: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        if (property === 'leftIndent' && update) {
            if (!isNullOrUndefined(selection.start) && selection.start.isExistBefore(selection.end)) {
                value = this.getIndentIncrementValue(selection.start.paragraph, value as number);
            } else {
                value = this.getIndentIncrementValue(selection.end.paragraph, value as number);
            }
        }
        this.updateParagraphFormatInternal(property, value, update);
    }
    private getIndentIncrementValue(currentParagraph: ParagraphWidget, incrementFactor: number): number {
        let currentParagraphIndent: number = currentParagraph.paragraphFormat.leftIndent as number;
        if (currentParagraphIndent < 0) {
            // In MS Word, if the current paragraph left indent is lesser that or equal to 0
            // then performing decrement indent will set left indent to 0. 
            if (incrementFactor < 0 || currentParagraphIndent + incrementFactor >= 0) {
                return -currentParagraphIndent;
            } else {
                let incrementValue: number = -this.getIndentIncrementValueInternal(-currentParagraphIndent, -incrementFactor);
                return incrementValue % incrementFactor === 0 ? incrementValue : incrementValue + incrementFactor;
            }
        } else {
            return this.getIndentIncrementValueInternal(currentParagraphIndent, incrementFactor);
        }
    }
    private getIndentIncrementValueInternal(position: number, incrementFactor: number): number {
        let tabValue: number = Math.abs(incrementFactor);
        if (position === 0 || tabValue === 0) {
            return incrementFactor > 0 ? tabValue : 0;
        } else {
            let diff: number = ((Math.round(position) * 100) % (Math.round(tabValue) * 100)) / 100;
            let cnt: number = (Math.round(position) - diff) / Math.round(tabValue);
            let fPosition: number = cnt * tabValue;
            if (incrementFactor > 0) {
                fPosition += tabValue;
            }
            return (fPosition - position) === 0 ? incrementFactor : fPosition - position;
        }
    }
    private updateParagraphFormatInternal(property: string, value: Object, update: boolean): void {
        if (isNullOrUndefined(property)) {
            property = 'ParagraphFormat';
        }
        switch (property) {
            case 'afterSpacing':
                this.updateParagraphFormat('afterSpacing', value, false);
                break;
            case 'beforeSpacing':
                this.updateParagraphFormat('beforeSpacing', value, false);
                break;
            case 'rightIndent':
                this.updateParagraphFormat('rightIndent', value, false);
                break;
            case 'leftIndent':
                this.updateParagraphFormat('leftIndent', value, update);
                break;
            case 'firstLineIndent':
                this.updateParagraphFormat('firstLineIndent', value, false);
                break;
            case 'lineSpacing':
                this.updateParagraphFormat('lineSpacing', value, false);
                break;
            case 'lineSpacingType':
                this.updateParagraphFormat('lineSpacingType', value, false);
                break;
            case 'textAlignment':
                this.updateParagraphFormat('textAlignment', value, false);
                break;
            case 'listFormat':
                this.updateParagraphFormat('listFormat', value, false);
                break;
            case 'ParagraphFormat':
                this.updateParagraphFormat(undefined, value, false);
                break;
            case 'styleName':
                this.updateParagraphFormat('styleName', value, false);
                break;
            case 'ClearParagraphFormat':
                // this.initializeHistory('ClearParagraphFormat', selectionRange);
                this.updateParagraphFormat(undefined, value, false);
                break;
            case 'bidi':
                let isBidiList: boolean = this.selection.paragraphFormat.listId !== -1;
                if (!isBidiList) {
                    this.documentHelper.layout.isBidiReLayout = true;
                }
                this.updateParagraphFormat('bidi', value, false);
                if (!isBidiList) {
                    this.documentHelper.layout.isBidiReLayout = false;
                }
                break;
            case 'contextualSpacing':
                this.updateParagraphFormat('contextualSpacing', value, false);
                break;
        }
    }
    /**
     * Update paragraph format on undo
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @param {boolean} update - Specifies the update
     * @private
     * @returns {void}
     */
    public updateParagraphFormat(property: string, value: Object, update: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        // this.updateInsertPosition(selection, startPosition);
        this.applyParaFormatSelectedContent(startPosition, endPosition, property, value, update);
        // this.startSelectionReLayouting(startPosition.paragraph, selection, startPosition, endPosition);
    }
    private applyParaFormatSelectedContent(start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(start.paragraph.associatedCell, start, end))) {
            let cell: TableCellWidget;
            start.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(start, true);
            }
            cell = start.paragraph.associatedCell;
            this.applyParaFormatInCell(cell, start, end, property, value, update);
            let table: TableWidget = cell.ownerTable;
            this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        } else {

            if (!isNullOrUndefined(value) && !this.selection.isEmpty && property === 'styleName' && this.applyCharacterStyle(start.paragraph, start, end, property, (value as WStyle), update)) {
                return;
            } else {
                this.applyParaFormat(start.paragraph, start, end, property, value, update);
            }
        }
    }

    /**
     * Apply Paragraph format
     *
     * @param {ParagraphWidget} paragraph - Specifies the selection
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @param {boolean} update - Specifies the update
     * @private
     * @returns {void}
     */
    public applyParaFormatProperty(paragraph: ParagraphWidget, property: string, value: Object, update: boolean): void {
        let format: WParagraphFormat = paragraph.paragraphFormat;
        if (update && property === 'leftIndent') {
            value = format.leftIndent + (value as number);
        }
        if (property === 'listFormat' && value instanceof WListFormat) {
            let listFormat: WListFormat = <WListFormat>value;
            if (!listFormat.hasValue('listLevelNumber')) {
                listFormat.listLevelNumber = format.listFormat.listLevelNumber;
            }
        }
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedPropertiesForParagraphFormat(format, property, value);
        }
        if (value instanceof WParagraphFormat) {
            if (isNullOrUndefined(property)) {
                if (this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
                    this.copyParagraphFormat(value as WParagraphFormat, format);
                } else {
                    format.copyFormat(value as WParagraphFormat);
                }
            } else if (property === 'listFormat') {
                format.listFormat = value.listFormat;
                // this.handleListFormat(format, value as WParagraphFormat);
            }
        }
        if (isNullOrUndefined(value)) {
            format.clearFormat();
            this.documentHelper.layout.reLayoutParagraph(format.ownerBase as ParagraphWidget, 0, 0);
            return;
        }

        if (property === 'afterSpacing') {
            format.afterSpacing = value as number;
        } else if (property === 'beforeSpacing') {
            format.beforeSpacing = value as number;
        } else if (property === 'leftIndent') {
            format.leftIndent = value as number;
        } else if (property === 'lineSpacingType') {
            format.lineSpacingType = <LineSpacingType>value;
        } else if (property === 'lineSpacing') {
            format.lineSpacing = value as number;
        } else if (property === 'rightIndent') {
            format.rightIndent = value as number;
        } else if (property === 'firstLineIndent') {
            format.firstLineIndent = value as number;
        } else if (property === 'textAlignment') {
            format.textAlignment = <TextAlignment>value;
            this.documentHelper.layout.allowLayout = false;
        } else if (property === 'styleName') {
            if (typeof (value) === 'string') {
                value = this.documentHelper.styles.findByName(value);
            }
            format.applyStyle(value as WStyle);
        } else if (property === 'listFormat') {
            if (value instanceof WParagraphFormat) {
                this.copyFromListLevelParagraphFormat(format, value);
                value = value.listFormat;
            }
            format.listFormat.copyFormat(<WListFormat>value);
            this.documentHelper.layout.clearListElementBox(format.ownerBase as ParagraphWidget);
            this.onListFormatChange(format.ownerBase as ParagraphWidget, <WListFormat>value, format);
            this.layoutItemBlock(format.ownerBase as ParagraphWidget, false);
            return;
        } else if (property === 'bidi') {
            format.bidi = value as boolean;
        } else if (property === 'keepWithNext') {
            format.keepWithNext = value as boolean;
        } else if (property === 'keepLinesTogether') {
            format.keepLinesTogether = value as boolean;
        } else if (property === 'contextualSpacing') {
            format.contextualSpacing = value as boolean;
        }
    }
    private copyParagraphFormat(sourceFormat: WParagraphFormat, destFormat: WParagraphFormat): void {
        destFormat.uniqueParagraphFormat = sourceFormat.uniqueParagraphFormat;
        destFormat.listFormat = sourceFormat.listFormat;
        destFormat.baseStyle = sourceFormat.baseStyle;
    }
    private onListFormatChange(paragraph: ParagraphWidget, listFormat: WListFormat, paraFormat: WParagraphFormat): void {
        if (listFormat instanceof WListFormat) {
            //let currentFormat: WListFormat = listFormat;
            // currentFormat.setOwnerBase(paraFormat);
            this.updateListParagraphFormat(paragraph, listFormat);
        }
    }
    private updateListParagraphFormat(paragraph: ParagraphWidget, listFormat: WListFormat): void {
        let list: WList = this.documentHelper.getListById(listFormat.listId);
        let listlevel: WListLevel = undefined;
        if (!isNullOrUndefined(list)) {
            listlevel = this.documentHelper.layout.getListLevel(list, listFormat.listLevelNumber);
        }
        let isUpdateIndent: boolean = !this.editorHistory || (this.editorHistory && !this.editorHistory.isUndoing);
        if (isUpdateIndent) {
            if (paragraph instanceof ParagraphWidget && !isNullOrUndefined(listlevel)
                && !isNullOrUndefined(listlevel.paragraphFormat) && !isNullOrUndefined(paragraph.containerWidget)) {
                this.copyFromListLevelParagraphFormat(paragraph.paragraphFormat, listlevel.paragraphFormat);
            } else if (isNullOrUndefined(list)) {
                paragraph.paragraphFormat.leftIndent = undefined;
                paragraph.paragraphFormat.firstLineIndent = undefined;
            }
        }
    }
    /**
     * Copies list level paragraph format
     *
     * @param {WParagraphFormat} oldFormat - Specifies the old format
     * @param {WParagraphFormat} newFormat - Specifies the new format
     * @private
     * @returns {void}
     */
    public copyFromListLevelParagraphFormat(oldFormat: WParagraphFormat, newFormat: WParagraphFormat): void {
        if (!isNullOrUndefined(newFormat.leftIndent)) {
            oldFormat.leftIndent = newFormat.leftIndent;
        }
        if (!isNullOrUndefined(newFormat.firstLineIndent)) {
            oldFormat.firstLineIndent = newFormat.firstLineIndent;
        }
    }
    /**
     * To apply continue numbering from the previous list
     *
     * @returns {void}
     */
    public applyContinueNumbering(): void {
        let selection: Selection = this.selection;
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ContinueNumbering');
        }
        this.applyContinueNumberingInternal(selection);
    }

    private applyContinueNumberingInternal(selection: Selection): void {
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let numberingInfo: ContinueNumberingInfo = this.getContinueNumberingInfo(paragraph);
        let paraFormat: WParagraphFormat = this.getParagraphFormat(paragraph, numberingInfo.listLevelNumber, numberingInfo.listPattern);
        this.changeListId(numberingInfo.currentList, paragraph, paraFormat, numberingInfo.listLevelNumber, numberingInfo.listPattern);
        this.reLayout(selection, false);
        this.documentHelper.updateFocus();
    }

    private getContinueNumberingInfo(paragraph: ParagraphWidget): ContinueNumberingInfo {
        let currentList: WList = undefined;
        let listLevelNumber: number = 0;
        let listPattern: ListLevelPattern = 'None';
        if (!isNullOrUndefined(paragraph.paragraphFormat)
            && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
            currentList = this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId);
            listLevelNumber = paragraph.paragraphFormat.listFormat.listLevelNumber;
        }
        let documentHelper: DocumentHelper = this.documentHelper;
        if (listLevelNumber !== 0 && !isNullOrUndefined(currentList) &&
            !isNullOrUndefined(documentHelper.getAbstractListById(currentList.abstractListId))
            && !isNullOrUndefined(documentHelper.getAbstractListById(currentList.abstractListId).levels[listLevelNumber])) {
            let listLevel: WListLevel = this.documentHelper.layout.getListLevel(currentList, listLevelNumber);
            if (!isNullOrUndefined(listLevel)) {
                listPattern = listLevel.listLevelPattern;
            }
        }
        return {
            currentList: currentList,
            listLevelNumber: listLevelNumber,
            listPattern: listPattern
        };
    }
    /**
     * @private
     * @returns {void}
     */
    public revertContinueNumbering(selection: Selection, format: WParagraphFormat): void {
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let numberingInfo: ContinueNumberingInfo = this.getContinueNumberingInfo(paragraph);
        this.changeListId(numberingInfo.currentList, paragraph, format, numberingInfo.listLevelNumber, numberingInfo.listPattern);
        this.reLayout(selection, false);
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.editorHistory.updateHistory();
        }
    }
    private changeListId(list: WList, block: BlockWidget, format: WParagraphFormat, levelNum: number, listType: string): void {
        if (isNullOrUndefined(block)) {
            return;
        }
        if (block instanceof ParagraphWidget) {
            if (list.listId === block.paragraphFormat.listFormat.listId
                && levelNum === block.paragraphFormat.listFormat.listLevelNumber) {
                if (this.editorHistory) {
                    let baseHistoryInfo: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
                    if (!isNullOrUndefined(baseHistoryInfo)) {
                        format = <WParagraphFormat>baseHistoryInfo.addModifiedPropertiesForContinueNumbering(block.paragraphFormat, format);
                    }
                }
                block.paragraphFormat.copyFormat(format);
                this.documentHelper.layout.reLayoutParagraph(block, 0, 0);
            }
        }
        return this.changeListId(list, block.nextRenderedWidget as BlockWidget, format, levelNum, listType);
    }
    private getParagraphFormat(paragraph: ParagraphWidget, levelNumber: number, listType: string): WParagraphFormat {
        if (!isNullOrUndefined(paragraph.previousRenderedWidget)) {
            if (paragraph.previousRenderedWidget instanceof ParagraphWidget) {
                if (!isNullOrUndefined(paragraph.previousRenderedWidget.paragraphFormat.listFormat)
                    && paragraph.previousRenderedWidget.paragraphFormat.listFormat.listId !== -1) {
                    let listLevel: WListLevel = this.selection.getListLevel(paragraph.previousRenderedWidget);
                    if (levelNumber === 0) {
                        return paragraph.previousRenderedWidget.paragraphFormat;
                    } else if (listType === listLevel.listLevelPattern
                        || this.checkNumberArabic(listType, listLevel.listLevelPattern)) {
                        return paragraph.previousRenderedWidget.paragraphFormat;
                    } else {
                        return this.getParagraphFormat(paragraph.previousRenderedWidget, levelNumber, listType);
                    }
                } else {
                    return this.getParagraphFormat(paragraph.previousRenderedWidget, levelNumber, listType);
                }
            }
        }
        return undefined;
    }
    private checkNumberArabic(listType: string, levelPattern: ListLevelPattern): boolean {
        if ((listType === 'Number' && levelPattern === 'Arabic')
            || (levelPattern === 'Number' && listType === 'Arabic')) {
            return true;
        }
        return false;
    }
    /**
     * @private
     * @returns {void}
     */
    public applyRestartNumbering(selection: Selection): void {
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('RestartNumbering');
        }
        this.restartListAt(selection);
    }
    /**
     * @private
     * @returns {void}
     */
    public restartListAt(selection: Selection): void {
        let currentList: WList = selection.paragraphFormat.getList();
        let list: WList = currentList.clone();
        list.listId = this.documentHelper.lists[(this.documentHelper.lists.length - 1)].listId + 1;
        this.documentHelper.lists.push(list);
        let abstractList: WAbstractList = currentList.abstractList.clone();
        abstractList.abstractListId = this.documentHelper.abstractLists[(this.documentHelper.abstractLists.length - 1)].abstractListId + 1;
        list.abstractListId = abstractList.abstractListId;
        list.abstractList = abstractList;
        this.documentHelper.abstractLists.push(abstractList);
        this.restartListAtInternal(selection, list.listId);
    }
    /**
     * @private
     * @returns {void}
     */
    public restartListAtInternal(selection: Selection, listId: number): void {
        let numberingInfo: ContinueNumberingInfo = this.getContinueNumberingInfo(selection.start.paragraph);
        this.changeRestartNumbering(numberingInfo.currentList, selection.start.paragraph, listId);
        this.reLayout(selection, false);
        this.incrementListNumber = -1;
        this.refListNumber = undefined;
        this.documentHelper.updateFocus();
    }
    private changeRestartNumbering(list: WList, block: BlockWidget, listId: number): void {
        if (isNullOrUndefined(block)) {
            return;
        }
        if (block instanceof ParagraphWidget) {
            if (list.listId === block.paragraphFormat.listFormat.listId) {
                if (this.editorHistory) {
                    let baseHistoryInfo: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
                    if (!isNullOrUndefined(baseHistoryInfo)) {
                        listId = <number>baseHistoryInfo.addModifiedPropertiesForRestartNumbering(block.paragraphFormat.listFormat, listId);
                    }
                }
                block.paragraphFormat.listFormat.listId = listId;
                if (this.refListNumber === undefined && this.incrementListNumber === -1) {
                    this.incrementListNumber = block.paragraphFormat.listFormat.listLevelNumber - 1;
                }
                if (this.refListNumber !== block.paragraphFormat.listFormat.listLevelNumber) {
                    this.incrementListNumber += 1;
                    this.refListNumber = block.paragraphFormat.listFormat.listLevelNumber;
                }

                block.paragraphFormat.listFormat.listLevelNumber = this.incrementListNumber;
                this.documentHelper.layout.reLayoutParagraph(block, 0, 0);
            }
        }
        return this.changeRestartNumbering(list, block.nextRenderedWidget as BlockWidget, listId);
    }


    private applyParaFormat(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        this.setOffsetValue(this.selection);
        paragraph = paragraph.combineWidget(this.owner.viewer) as ParagraphWidget;
        //Apply Paragraph Format for spitted paragraph
        this.applyParaFormatProperty(paragraph, property, value, update);
        this.layoutItemBlock(paragraph, false);
        this.getOffsetValue(this.selection);
        if (paragraph.equals(end.paragraph)) {
            return;
        }
        this.getNextParagraphForFormatting(paragraph, start, end, property, value, update);
    }
    private applyCharacterStyle(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition, property: string, value: WStyle, update: boolean): boolean {
        let paragraphWidget: BlockWidget[] = paragraph.getSplitWidgets() as BlockWidget[];
        let selection: Selection = end.owner.selection;
        let lastLine: LineWidget = end.currentWidget;
        let isParaSelected: boolean = start.offset === 0 && (selection.isParagraphLastLine(lastLine) && end.currentWidget === lastLine
            && end.offset === selection.getLineLength(lastLine) + 1 || end.isAtParagraphEnd);
        if (!isParaSelected && (end.paragraph === paragraph || paragraphWidget.indexOf(end.paragraph) !== -1)) {
            if (((value.type === 'Paragraph') && ((value.link) instanceof WCharacterStyle)) || (value.type === 'Character')) {
                let obj: WStyle = (value.type === 'Character') ? value : value.link;
                this.updateSelectionCharacterFormatting(property, obj, update);
                return true;
            }
        }
        return false;
    }
    // Cell

    private applyParaFormatInCell(cell: TableCellWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        if (end.paragraph.isInsideTable) {
            let cellContainer: TableCellWidget = selection.getContainerCellOf(cell, end.paragraph.associatedCell);
            if (cellContainer.ownerTable.contains(end.paragraph.associatedCell)) {
                let startCell: TableCellWidget = selection.getSelectedCell(cell, cellContainer);
                let endCell: TableCellWidget = selection.getSelectedCell(end.paragraph.associatedCell, cellContainer);
                if (selection.containsCell(cellContainer, end.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (selection.isCellSelected(cellContainer, start, end)) {
                        value = this.getParaFormatValueInCell(cellContainer, property, value);
                        this.applyParaFormatCellInternal(cellContainer, property, value, update);
                    } else {
                        if (startCell === cellContainer) {
                            this.applyParaFormat(start.paragraph, start, end, property, value, update);
                        } else {
                            this.applyParagraphFormatRow(startCell.ownerRow, start, end, property, value, update);
                        }
                    }
                } else {
                    //Format other selected cells in current table.
                    this.applyParaFormatTableCell(cellContainer.ownerTable, cellContainer, endCell, property, value, update);
                }
            } else {
                this.applyParagraphFormatRow(cellContainer.ownerRow, start, end, property, value, update);
            }
        } else {
            let wCell: TableCellWidget = selection.getContainerCell(cell);
            this.applyParagraphFormatRow(wCell.ownerRow, start, end, property, value, update);
        }
    }
    private applyParaFormatCellInternal(cell: TableCellWidget, property: string, value: Object, update: boolean): void {

        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            let block: BlockWidget = cell.childWidgets[i] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                this.applyParaFormatProperty((block as ParagraphWidget), property, value, update);
            } else {
                this.applyParagraphFormatTableInternal(block as TableWidget, property, value, update);
            }
        }
    }
    private getParaFormatValueInCell(cell: TableCellWidget, property: string, value: Object): Object {
        if (typeof value === 'boolean') {
            let firstPara: ParagraphWidget = this.documentHelper.selection.getFirstParagraph(cell);
            value = !<boolean>firstPara.paragraphFormat.getPropertyValue(property);
        }
        return value;
    }
    // Row

    private applyParagraphFormatRow(wRow: TableRowWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        value = this.getParaFormatValueInCell((wRow.childWidgets[0] as TableCellWidget), property, value);
        for (let i: number = wRow.rowIndex; i < wRow.ownerTable.childWidgets.length; i++) {
            let row: TableRowWidget = wRow.ownerTable.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyParaFormatCellInternal((row.childWidgets[j] as TableCellWidget), property, value, update);
            }
            if (end.paragraph.isInsideTable && this.documentHelper.selection.containsRow(row, end.paragraph.associatedCell)) {
                return;
            }
        }
        this.getNextParagraphForFormatting(wRow.ownerTable, start, end, property, value, update);
    }
    // Table

    private applyParaFormatTableCell(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget, property: string, value: Object, update: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        let startValue: number = selection.getCellLeft(startCell.ownerRow, startCell);
        let endValue: number = startValue + startCell.cellFormat.cellWidth;
        let endCellLeft: number = selection.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        let cellInfo: CellInfo = this.updateSelectedCellsInTable(startValue, endValue, endCellLeft, endCellRight);
        startValue = cellInfo.start;
        endValue = cellInfo.end;
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        let isStarted: boolean = false;
        for (let m: number = table.childWidgets.indexOf(startCell.ownerRow); m <= count; m++) {
            let row: TableRowWidget = table.childWidgets[m] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let left: number = selection.getCellLeft(row, row.childWidgets[j] as TableCellWidget);
                if (Math.round(startValue) <= Math.round(left) && Math.round(left) < Math.round(endValue)) {
                    if (!isStarted) {
                        value = this.getParaFormatValueInCell((row.childWidgets[j] as TableCellWidget), property, value);
                        isStarted = true;
                    }
                    this.applyParaFormatCellInternal((row.childWidgets[j] as TableCellWidget), property, value, update);
                }
            }
        }
    }

    private applyParaFormatTable(table: TableWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        let selection: Selection = this.documentHelper.selection;
        for (let m: number = 0; m < table.childWidgets.length; m++) {
            let tableRow: TableRowWidget = table.childWidgets[m] as TableRowWidget;
            for (let k: number = 0; k < tableRow.childWidgets.length; k++) {
                this.applyParaFormatCellInternal((tableRow.childWidgets[k] as TableCellWidget), property, value, update);
            }
            if (end.paragraph.isInsideTable && selection.containsRow(tableRow, end.paragraph.associatedCell)) {
                this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
                return;
            }
        }
        this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        this.getNextParagraphForFormatting(table, start, end, property, value, update);
    }

    private getNextParagraphForFormatting(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let widgetCollection: TableWidget[] = block.getSplitWidgets() as TableWidget[];
        block = widgetCollection[widgetCollection.length - 1];
        block = this.documentHelper.selection.getNextRenderedBlock(block);
        if (!isNullOrUndefined(block)) { //Goto the next block.
            if (block instanceof ParagraphWidget) {
                this.applyParaFormat(block, start, end, property, value, update);
            } else {
                this.applyParaFormatTable(block as TableWidget, start, end, property, value, update);
            }
        }
    }
    private applyParagraphFormatTableInternal(table: TableWidget, property: string, value: Object, update: boolean): void {
        for (let x: number = 0; x < table.childWidgets.length; x++) {
            let row: TableRowWidget = table.childWidgets[x] as TableRowWidget;
            for (let y: number = 0; y < row.childWidgets.length; y++) {
                this.applyParaFormatCellInternal((row.childWidgets[y] as TableCellWidget), property, value, update);
            }
        }
    }

    //Paragraph Format apply implementation Ends
    // Apply Selection Section Format Option Implementation Starts
    /**
     * Apply section format selection changes
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public onApplySectionFormat(property: string, value: Object): void {
        if (this.restrictFormatting) {
            return;
        }
        if (!isNullOrUndefined(property)) {
            let action: Action = (property[0].toUpperCase() + property.slice(1)) as Action;
            this.initHistory(action);
        } else {
            this.initHistory('SectionFormat');
        }
        this.updateSectionFormat(property, value);
    }
    /**
     * Update section format
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public updateSectionFormat(property: string, value: Object): void {
        let selection: Selection = this.documentHelper.selection;
        selection.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        let startPageIndex: number;
        let endPageIndex: number;
        this.documentHelper.clearContent();
        let startSectionIndex: number = startPosition.paragraph.bodyWidget.sectionIndex;
        let endSectionIndex: number = endPosition.paragraph.bodyWidget.sectionIndex;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            if (this.documentHelper.pages[i].bodyWidgets[0].index === startSectionIndex) {
                startPageIndex = i;
                break;
            }
        }
        for (let i: number = startPageIndex; i < this.documentHelper.pages.length; i++) {
            let bodyWidget: BodyWidget = this.documentHelper.pages[i].bodyWidgets[0];
            endPageIndex = i;
            if ((bodyWidget.index === startSectionIndex)) {
                continue;
            } else if ((bodyWidget.index >= startSectionIndex) && bodyWidget.index <= endSectionIndex) {
                continue;
            } else {
                endPageIndex = i - 1;
                break;
            }
        }
        // let startPageIndex: number = this.documentHelper.pages.indexOf((selection.start.paragraph.containerWidget as BodyWidget).page);
        // let endPageIndex: number = this.documentHelper.pages.indexOf((selection.end.paragraph.containerWidget as BodyWidget).page);
        let update: boolean = true;
        let index: number = 0;
        for (let i: number = startPageIndex; i <= endPageIndex; i++) {
            if (index !== this.documentHelper.pages[i].bodyWidgets[0].index && !update) {
                update = true;
            }
            this.applyPropertyValueForSection(this.documentHelper.pages[i].bodyWidgets[0].sectionFormat, property, value, update);
            index = this.documentHelper.pages[i].bodyWidgets[0].index;
            update = false;
        }
        this.layoutWholeDocument();
        this.fireContentChange();
    }
    //Apply Selection Table Format option implementation starts
    /**
     * Apply table format property changes
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public onApplyTableFormat(property: string, value: Object): void {
        if (this.restrictFormatting) {
            return;
        }
        let action: Action = this.getTableFormatAction(property);
        this.viewer.owner.isShiftingEnabled = true;
        let selection: Selection = this.documentHelper.selection;
        let table: TableWidget = selection.start.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        if (selection.isEmpty) {
            this.initHistory(action);
            this.applyTablePropertyValue(selection, property, value, table);
        } else {
            this.updateSelectionTableFormat(this.selection, action, value);
        }
        table.calculateGrid();
        this.selection.owner.isLayoutEnabled = true;
        this.documentHelper.layout.reLayoutTable(table);
        this.reLayout(selection, false);
    }
    private getTableFormatAction(property: string): Action {
        switch (property) {
            case 'tableAlignment':
                return 'TableAlignment';
            case 'leftIndent':
                return 'TableLeftIndent';
            case 'leftMargin':
                return 'DefaultCellLeftMargin';
            case 'rightMargin':
                return 'DefaultCellRightMargin';
            case 'bottomMargin':
                return 'DefaultCellBottomMargin';
            case 'topMargin':
                return 'DefaultCellTopMargin';
            case 'preferredWidth':
                return 'TablePreferredWidth';
            case 'preferredWidthType':
                return 'TablePreferredWidthType';
            case 'shading':
                return 'Shading';
            case 'bidi':
                return 'TableBidi';
            default:
                return 'DefaultCellSpacing';
        }
    }
    // Apply Selection Row Format Option Implementation Starts
    /**
     * Apply table row format property changes
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public onApplyTableRowFormat(property: string, value: Object): void {
        if (this.restrictFormatting) {
            return;
        }
        let action: Action = this.getRowAction(property);
        this.documentHelper.owner.isShiftingEnabled = true;
        let selection: Selection = this.documentHelper.selection;
        if (selection.isEmpty) {
            this.initHistory(action);
            let table: TableWidget = selection.start.paragraph.associatedCell.ownerRow.ownerTable;
            this.applyRowPropertyValue(selection, property, value, selection.start.paragraph.associatedCell.ownerRow);
        } else {
            this.updateSelectionTableFormat(this.selection, action, value);
        }
        this.reLayout(selection, false);
    }
    private getRowAction(property: string): Action {
        switch (property) {
            case 'height':
                return 'RowHeight';
            case 'heightType':
                return 'RowHeightType';
            case 'isHeader':
                return 'RowHeader';
            default:
                return 'AllowBreakAcrossPages';
        }
    }
    /**
     * Apply table cell property changes
     *
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public onApplyTableCellFormat(property: string, value: Object): void {
        if (this.restrictFormatting) {
            return;
        }
        let action: Action = this.getTableCellAction(property);
        this.documentHelper.owner.isShiftingEnabled = true;
        let selection: Selection = this.documentHelper.selection;
        let table: TableWidget = selection.start.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        if (selection.isEmpty) {
            this.initHistory(action);
            this.applyCellPropertyValue(selection, property, value, selection.start.paragraph.associatedCell.cellFormat);
            table.calculateGrid();
            this.selection.owner.isLayoutEnabled = true;
            this.documentHelper.layout.reLayoutTable(table);
        } else {
            this.updateSelectionTableFormat(this.selection, action, value);
        }
        this.reLayout(selection, false);
    }

    private getTableCellAction(property: string): Action {
        switch (property) {
            case 'verticalAlignment':
                return 'CellContentVerticalAlignment';
            case 'leftMargin':
                return 'CellLeftMargin';
            case 'rightMargin':
                return 'CellRightMargin';
            case 'bottomMargin':
                return 'CellBottomMargin';
            case 'topMargin':
                return 'CellTopMargin';
            case 'preferredWidth':
                return 'CellPreferredWidth';
            case 'shading':
                return 'Shading';
            default:
                return 'CellPreferredWidthType';
        }
    }
    private applyPropertyValueForSection(sectionFormat: WSectionFormat, property: string, value: Object, update: boolean): void {
        //let selection: Selection = this.documentHelper.selection;
        if (update && this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedPropertiesForSection(sectionFormat, property, value);
        }
        if (isNullOrUndefined(value)) {
            return;
        }
        if (value instanceof WSectionFormat) {
            if (isNullOrUndefined(property)) {
                sectionFormat.copyFormat(value as WSectionFormat, this.editorHistory);
            }
            return;
        }
        if (property === 'pageHeight') {
            sectionFormat.pageHeight = value as number;
        } else if (property === 'pageWidth') {
            sectionFormat.pageWidth = value as number;
        } else if (property === 'leftMargin') {
            sectionFormat.leftMargin = value as number;
        } else if (property === 'rightMargin') {
            sectionFormat.rightMargin = value as number;
        } else if (property === 'topMargin') {
            sectionFormat.topMargin = value as number;
        } else if (property === 'bottomMargin') {
            sectionFormat.bottomMargin = value as number;
        } else if (property === 'differentFirstPage') {
            sectionFormat.differentFirstPage = value as boolean;
        } else if (property === 'differentOddAndEvenPages') {
            sectionFormat.differentOddAndEvenPages = value as boolean;
        } else if (property === 'headerDistance') {
            sectionFormat.headerDistance = value as number;
        } else if (property === 'footerDistance') {
            sectionFormat.footerDistance = value as number;
        } else if (property === 'pageStartingNumber') {
            sectionFormat.pageStartingNumber = value as number;
        } else if (property === 'restartPageNumbering') {
            sectionFormat.restartPageNumbering = value as boolean;
        } else if (property === 'endnoteNumberFormat') {
            sectionFormat.endnoteNumberFormat = value as FootEndNoteNumberFormat;
        } else if (property === 'footNoteNumberFormat') {
            sectionFormat.footNoteNumberFormat = value as FootEndNoteNumberFormat;
        } else if (property === 'restartIndexForEndnotes') {
            sectionFormat.restartIndexForEndnotes = value as FootnoteRestartIndex;
        } else if (property === 'restartIndexForFootnotes') {
            sectionFormat.restartIndexForFootnotes = value as FootnoteRestartIndex;
        } else if (property === 'initialFootNoteNumber') {
            sectionFormat.initialFootNoteNumber = value as number;
        } else if (property === 'initialEndNoteNumber') {
            sectionFormat.initialEndNoteNumber = value as number;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public layoutWholeDocument(): void {
        this.documentHelper.layout.isLayoutWhole = true;
        let startPosition: TextPosition = this.documentHelper.selection.start;
        let endPosition: TextPosition = this.documentHelper.selection.end;
        if (startPosition.isExistAfter(endPosition)) {
            startPosition = this.documentHelper.selection.end;
            endPosition = this.documentHelper.selection.start;
        }
        let startInfo: ParagraphInfo = this.selection.getParagraphInfo(startPosition);
        let endInfo: ParagraphInfo = this.selection.getParagraphInfo(endPosition);
        let startIndex: string = this.selection.getHierarchicalIndex(startInfo.paragraph, startInfo.offset.toString());
        let endIndex: string = this.selection.getHierarchicalIndex(endInfo.paragraph, endInfo.offset.toString());
        this.documentHelper.renderedLists.clear();
        this.documentHelper.renderedLevelOverrides = [];
        // this.viewer.owner.isLayoutEnabled = true;
        let sections: BodyWidget[] = this.combineSection();
        this.documentHelper.clearContent();
        // this.documentHelper.layout.isRelayout = false;
        this.documentHelper.layout.layoutItems(sections, true);
        // this.documentHelper.layout.isRelayout = true;
        this.documentHelper.owner.isShiftingEnabled = false;
        this.setPositionForCurrentIndex(startPosition, startIndex);
        this.setPositionForCurrentIndex(endPosition, endIndex);
        this.documentHelper.selection.selectPosition(startPosition, endPosition);
        this.reLayout(this.documentHelper.selection);
        this.documentHelper.layout.isLayoutWhole = false;
    }
    private combineSection(): BodyWidget[] {
        let sections: BodyWidget[] = [];
        let nextSection: BodyWidget = this.documentHelper.pages[0].bodyWidgets[0];
        do {
            nextSection = this.combineSectionChild(nextSection, sections);
        } while (nextSection);
        return sections;
    }
    private combineSectionChild(bodyWidget: BodyWidget, sections: BodyWidget[]): BodyWidget {
        let previousBodyWidget: BodyWidget = bodyWidget;
        let temp: BodyWidget = new BodyWidget();
        temp.sectionFormat = bodyWidget.sectionFormat;
        temp.index = previousBodyWidget.index;
        do {
            previousBodyWidget = bodyWidget;
            if (bodyWidget.lastChild) {
                (bodyWidget.lastChild as BlockWidget).combineWidget(this.owner.viewer);
            }
            bodyWidget = bodyWidget.nextRenderedWidget as BodyWidget;
            for (let j: number = 0; j < previousBodyWidget.childWidgets.length; j++) {
                let block: BlockWidget = previousBodyWidget.childWidgets[j] as BlockWidget;
                if (block instanceof TableWidget) {
                    this.documentHelper.layout.clearTableWidget(block, true, true, true);
                } else {
                    block.x = 0;
                    block.y = 0;
                    block.width = 0;
                    block.height = 0;
                }
                temp.childWidgets.push(block);
                previousBodyWidget.childWidgets.splice(j, 1);
                j--;
                block.containerWidget = temp;
            }
            previousBodyWidget.page.destroy();
            // this.documentHelper.pages.splice(previousBodyWidget.page.index, 1);
        } while (bodyWidget && previousBodyWidget.equals(bodyWidget));
        sections.push(temp);
        return bodyWidget;
    }

    private updateSelectionTableFormat(selection: Selection, action: Action, value: Object): void {
        switch (action) {
            case 'TableAlignment':
                this.editorHistory.initializeHistory('TableAlignment');
                this.updateTableFormat(selection, 'tableAlignment', value);
                break;
            case 'TableLeftIndent':
                this.editorHistory.initializeHistory('TableLeftIndent');
                this.updateTableFormat(selection, 'leftIndent', value);
                break;
            case 'DefaultCellSpacing':
                this.editorHistory.initializeHistory('DefaultCellSpacing');
                this.updateTableFormat(selection, 'cellSpacing', value);
                break;
            case 'DefaultCellLeftMargin':
                this.editorHistory.initializeHistory('DefaultCellLeftMargin');
                this.updateTableFormat(selection, 'leftMargin', value);
                break;
            case 'DefaultCellRightMargin':
                this.editorHistory.initializeHistory('DefaultCellRightMargin');
                this.updateTableFormat(selection, 'rightMargin', value);
                break;
            case 'DefaultCellTopMargin':
                this.editorHistory.initializeHistory('DefaultCellTopMargin');
                this.updateTableFormat(selection, 'topMargin', value);
                break;
            case 'TablePreferredWidth':
                this.editorHistory.initializeHistory('TablePreferredWidth');
                this.updateTableFormat(selection, 'preferredWidth', value);
                break;
            case 'TablePreferredWidthType':
                this.editorHistory.initializeHistory('TablePreferredWidthType');
                this.updateTableFormat(selection, 'preferredWidthType', value);
                break;
            case 'DefaultCellBottomMargin':
                this.editorHistory.initializeHistory('DefaultCellBottomMargin');
                this.updateTableFormat(selection, 'bottomMargin', value);
                break;
            case 'CellContentVerticalAlignment':
                this.editorHistory.initializeHistory('CellContentVerticalAlignment');
                this.updateCellFormat(selection, 'verticalAlignment', value);
                break;
            case 'CellLeftMargin':
                this.editorHistory.initializeHistory('CellLeftMargin');
                this.updateCellFormat(selection, 'leftMargin', value);
                break;
            case 'CellRightMargin':
                this.editorHistory.initializeHistory('CellRightMargin');
                this.updateCellFormat(selection, 'rightMargin', value);
                break;
            case 'CellTopMargin':
                this.editorHistory.initializeHistory('CellTopMargin');
                this.updateCellFormat(selection, 'topMargin', value);
                break;
            case 'CellBottomMargin':
                this.editorHistory.initializeHistory('CellBottomMargin');
                this.updateCellFormat(selection, 'bottomMargin', value);
                break;
            case 'CellPreferredWidth':
                this.editorHistory.initializeHistory('CellPreferredWidth');
                this.updateCellFormat(selection, 'preferredWidth', value);
                break;
            case 'CellPreferredWidthType':
                this.editorHistory.initializeHistory('CellPreferredWidthType');
                this.updateCellFormat(selection, 'preferredWidthType', value);
                break;
            case 'Shading':
                this.editorHistory.initializeHistory('Shading');
                this.updateCellFormat(selection, 'shading', value);
                break;
            case 'RowHeight':
                this.editorHistory.initializeHistory('RowHeight');
                this.updateRowFormat(selection, 'height', value);
                break;
            case 'RowHeightType':
                this.editorHistory.initializeHistory('RowHeightType');
                this.updateRowFormat(selection, 'heightType', value);
                break;
            case 'RowHeader':
                this.editorHistory.initializeHistory('RowHeader');
                this.updateRowFormat(selection, 'isHeader', value);
                break;
            case 'AllowBreakAcrossPages':
                this.editorHistory.initializeHistory('AllowBreakAcrossPages');
                this.updateRowFormat(selection, 'allowBreakAcrossPages', value);
                break;
            case 'TableBidi':
                this.editorHistory.initializeHistory(action);
                this.updateTableFormat(selection, 'bidi', value);
                break;

        }
    }
    // Update Table Properties
    /**
     * Update Table Format on undo
     *
     * @param {Selection} selection - Specifies the selection
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public updateTableFormat(selection: Selection, property: string, value: object): void {
        let tableStartPosition: TextPosition = selection.start;
        let tableEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            tableStartPosition = selection.end;
            tableEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, tableStartPosition);

        this.applyTablePropertyValue(selection, property, value, tableStartPosition.paragraph.associatedCell.ownerTable);
        if (this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            this.documentHelper.layout.reLayoutTable(tableStartPosition.paragraph.associatedCell.ownerTable);
        }
    }
    /**
     * update cell format on undo
     *
     * @param {Selection} selection - Specifies the selection
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public updateCellFormat(selection: Selection, property: string, value: Object): void {
        selection.owner.isShiftingEnabled = true;
        let newStartPosition: TextPosition = selection.start;
        let newEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            newStartPosition = selection.end;
            newEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, newStartPosition);
        this.updateFormatForCell(selection, property, value);
    }
    /**
     * Update row format on undo
     *
     * @param {Selection} selection - Specifies the selection
     * @param {string} property - Specifies the property
     * @param {Object} value - Specifies the value
     * @private
     * @returns {void}
     */
    public updateRowFormat(selection: Selection, property: string, value: Object): void {
        let rowStartPosition: TextPosition = selection.start;
        let rowEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            rowStartPosition = selection.end;
            rowEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, rowStartPosition);

        this.applyRowFormat(rowStartPosition.paragraph.associatedCell.ownerRow, rowStartPosition, rowEndPosition, property, value);
    }
    private initHistoryPosition(selection: Selection, position?: TextPosition): void {
        if (this.documentHelper.owner.editorHistoryModule && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            if (!isNullOrUndefined(position)) {
                if (isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.insertPosition)) {
                    this.editorHistory.currentBaseHistoryInfo.insertPosition = position.getHierarchicalIndexInternal();
                }
            } else if (isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.insertPosition)) {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = selection.start.getHierarchicalIndexInternal();
            }
        }
    }
    private startSelectionReLayouting(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition): void {
        selection.owner.isLayoutEnabled = true;
        if (start.paragraph.isInsideTable) {
            let table: TableWidget = start.paragraph.associatedCell.ownerTable;
            while (table.isInsideTable) {
                table = table.associatedCell.ownerTable;
            }
            this.reLayoutSelectionOfTable(table, selection, start, end);
        } else {
            this.reLayoutSelection(paragraph, selection, start, end);
        }
    }
    private reLayoutSelectionOfTable(table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition): boolean {
        let isEnded: boolean = false;
        this.documentHelper.layout.layoutBodyWidgetCollection(table.index, table.containerWidget as BodyWidget, table, false);
        // If the selection ends in the current table, need to stop relayouting.
        if (!isNullOrUndefined(end.paragraph.associatedCell) && table.contains(end.paragraph.associatedCell)) {
            return true;
        }
        let block: BlockWidget = selection.getNextRenderedBlock(table);
        // Relayout the next block.
        if (!isNullOrUndefined(block)) {
            isEnded = this.reLayoutSelectionOfBlock(block, selection, start, end);
        }
        return isEnded;
    }
    private reLayoutSelection(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition): boolean {
        if (start.paragraph === paragraph) {
            let startOffset: number = start.offset;
            let length: number = selection.getParagraphLength(paragraph);
            let indexInInline: number = 0;
            let index: number = 0;
            let inlineObj: ElementInfo = paragraph.getInline(start.offset, indexInInline);
            let inline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            if (!isNullOrUndefined(inline)) {
                if (indexInInline === inline.length && !isNullOrUndefined(inline.nextNode)) {
                    inline = inline.nextNode as ElementBox;
                }
                index = inline.line.children.indexOf(inline);
            }
            let lineIndex: number = 0;
            if (start.currentWidget.paragraph === paragraph) {
                lineIndex = paragraph.childWidgets.indexOf(start.currentWidget);
                index = start.currentWidget.children.indexOf(inline);
            }

            // If selection start inline is at new inline, need to relayout from the previous inline.
            if (inline instanceof TextElementBox && !inline.line && index > 0) {
                this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, index - 1);
            } else {
                this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, index);
            }
        } else {
            this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0);
        }
        // If the selection ends at the current paragraph, need to stop relayouting.
        if (end.paragraph === paragraph) {
            return true;
        }
        // _Relayout the next block.
        let block: BlockWidget = selection.getNextRenderedBlock(paragraph);
        if (!isNullOrUndefined(block)) {
            return this.reLayoutSelectionOfBlock(block, selection, start, end);
        }
        return false;
    }
    //Relayouting Start    
    private reLayoutSelectionOfBlock(block: BlockWidget, selection: Selection, start: TextPosition, end: TextPosition): boolean {
        if (block instanceof ParagraphWidget) {
            return this.reLayoutSelection(block as ParagraphWidget, selection, start, end);
        } else {
            return undefined;
            // return this.reLayoutSelectionOfTable(block as TableWidget, selection, start, end);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public layoutItemBlock(block: BlockWidget, shiftNextWidget: boolean): void {
        let section: Widget = undefined;
        if (block.containerWidget instanceof BlockContainer) {
            section = block.containerWidget as BlockContainer;
            let index: number = section.childWidgets.indexOf(block);
            if (!isNullOrUndefined(this.documentHelper.owner)
                && this.documentHelper.owner.isLayoutEnabled) {

                this.documentHelper.layout.layoutBodyWidgetCollection(block.index, section as BodyWidget, block, false);
            }
        } else if (block.containerWidget instanceof TableCellWidget) {
            let cell: TableCellWidget = block.containerWidget as TableCellWidget;
            cell = this.documentHelper.selection.getContainerCell(cell);
            if (!isNullOrUndefined(this.documentHelper.owner)
                && this.documentHelper.owner.isLayoutEnabled) {
                this.documentHelper.layout.reLayoutTable(block);
            }
        }
    }
    /**
     * @private
     * @returns {boolean}
     */
    public removeSelectedContents(selection: Selection): boolean {
        return this.removeSelectedContentInternal(selection, selection.start, selection.end);
    }
    private removeSelectedContentInternal(selection: Selection, startPosition: TextPosition, endPosition: TextPosition): boolean {
        let startPos: TextPosition = startPosition;
        let endPos: TextPosition = endPosition;
        if (!startPosition.isExistBefore(endPosition)) {
            startPos = endPosition;
            endPos = startPosition;
        }

        if (startPos.paragraph === endPos.paragraph && startPos.paragraph.childWidgets.indexOf(startPos.currentWidget) === startPos.paragraph.childWidgets.length - 1 &&
            startPos.offset === selection.getParagraphLength(startPos.paragraph) && startPos.offset + 1 === endPos.offset) {
            selection.owner.isShiftingEnabled = true;
            selection.selectContent(startPos, true);
            return true;
        }
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(startPos);
        selection.editPosition = this.selection.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        let isRemoved: boolean = this.removeSelectedContent(endPos.paragraph, selection, startPos, endPos);
        let textPosition: TextPosition = new TextPosition(selection.owner);
        this.setPositionForCurrentIndex(textPosition, selection.editPosition);
        selection.selectContent(textPosition, true);
        return isRemoved;
    }
    private removeSelectedContent(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition): boolean {
        //If end is not table end and start is outside the table, then skip removing the contents and move caret to start position.
        if (end.paragraph.isInsideTable
            && end.paragraph !== selection.getLastParagraphInLastCell(end.paragraph.associatedCell.ownerTable)
            && (!start.paragraph.isInsideTable
                || start.paragraph.associatedCell.ownerTable.index !== end.paragraph.associatedCell.ownerTable.index)) {
            return false;
        }
        selection.owner.isShiftingEnabled = true;
        this.deleteSelectedContent(paragraph, selection, start, end, 2);
        return true;
    }

    private deleteSelectedContent(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = start.currentWidget.getInline(start.offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        // if (!isNullOrUndefined(inline)) {
        //     inline = selection.getNextRenderedInline(inline, indexInInline);
        // }
        // if (inline instanceof WFieldBegin && !isNullOrUndefined((inline as WFieldBegin).fieldEnd)) {

        //     let fieldEndOffset: number = ((inline as WFieldBegin).fieldEnd.owner as WParagraph).getOffset((inline as WFieldBegin).fieldEnd, 1);
        //     let fieldEndIndex: string = WordDocument.getHierarchicalIndexOf((inline as WFieldBegin).fieldEnd.owner as WParagraph, fieldEndOffset.toString());
        //     let selectionEndIndex: string = end.getHierarchicalIndexInternal();
        //     if (!TextPosition.isForwardSelection(fieldEndIndex, selectionEndIndex)) {
        //         //If selection end is after field begin, moves selection start to field separator.
        //         start.moveToInline((inline as WFieldBegin).fieldSeparator, 1);
        //         selection.editPosition = start.getHierarchicalIndexInternal();
        //         if (!isNullOrUndefined(selection.currentBaseHistoryInfo)) {
        //             selection.currentBaseHistoryInfo.insertPosition = selection.editPosition;
        //         }
        //     }
        // }
        indexInInline = 0;
        inlineObj = end.currentWidget.getInline(end.offset, indexInInline);
        inline = inlineObj.element;
        indexInInline = inlineObj.index;
        // if (!isNullOrUndefined(inline)) {
        //     inline = selection.getNextRenderedInline(inline, indexInInline);
        // }
        // if (inline instanceof WFieldEnd && !isNullOrUndefined((inline as WFieldEnd).fieldBegin)) {

        //     let fieldBeginOffset: number = ((inline as WFieldEnd).fieldBegin.owner as WParagraph).getOffset((inline as WFieldEnd).fieldBegin, 0);
        //     let fieldBeginIndex: string = WordDocument.getHierarchicalIndexOf((inline as WFieldEnd).fieldBegin.owner as WParagraph, fieldBeginOffset.toString());
        //     let selectionStartIndex: string = start.getHierarchicalIndexInternal();
        //     if (!TextPosition.isForwardSelection(selectionStartIndex, fieldBeginIndex)) {
        //         //If field begin is before selection start, move selection end to inline item before field end.
        //         let prevInline: WInline = selection.getPreviousTextInline(inline);
        //         if (isNullOrUndefined(prevInline)) {
        //             end.moveBackward();
        //         } else {
        //             end.moveToInline(prevInline, prevInline.length);
        //         }
        //     }
        // }
        // if (inline instanceof FootnoteElementBox) {
        //     this.removeFootnote(inline);
        // }
        if (end.paragraph !== paragraph) {
            this.deleteSelectedContent(end.paragraph, selection, start, end, editAction);
            return;
        }
        //  Selection start in cell.
        if (end.paragraph.isInsideTable && (!start.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(end.paragraph.associatedCell, start, end))) {
            end.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer);
            this.deleteTableCell(end.paragraph.associatedCell, selection, start, end, editAction);
        } else {
            this.deletePara(paragraph, start, end, editAction);
            if (this.delBlockContinue && this.delBlock) {
                if (this.delSection) {
                    let bodyWidget: BodyWidget = paragraph.bodyWidget instanceof BodyWidget ? paragraph.bodyWidget : undefined;
                    this.deleteSection(selection, this.delSection, bodyWidget, editAction);
                    this.delSection = undefined;
                }
                this.deleteBlock((this.delBlock as ParagraphWidget), selection, start, end, editAction);
                this.delBlockContinue = false;
                this.delBlock = undefined;
            }
        }
        if (this.removeCommentCharacters.length > 0 && !this.isCmtDeleteStarted) {
            for (let k: number = 0; k < this.removeCommentCharacters.length; k++) {
                let currentBaseHistryInfo: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
                let commentStartChar: CommentCharacterElementBox = this.removeCommentCharacters[k];
                this.isCmtDeleteStarted = true;
                if (commentStartChar.commentMark) {
                    commentStartChar.removeCommentMark();
                }
                if (commentStartChar.line && commentStartChar.line.paragraph &&
                    commentStartChar.line.paragraph.bodyWidget && currentBaseHistryInfo) {
                    this.removeInline(commentStartChar);
                    this.selection.editPosition = currentBaseHistryInfo.insertPosition;
                    this.isCmtDeleteStarted = false;
                    if (this.editorHistory.currentHistoryInfo) {
                        this.editorHistory.currentHistoryInfo.insertPosition = currentBaseHistryInfo.insertPosition;
                        this.editorHistory.currentHistoryInfo.endPosition = currentBaseHistryInfo.insertPosition;
                        this.editorHistory.currentHistoryInfo.selectionStart = currentBaseHistryInfo.selectionStart;
                        this.editorHistory.currentHistoryInfo.selectionEnd = currentBaseHistryInfo.selectionEnd;
                        currentBaseHistryInfo.endPosition = currentBaseHistryInfo.insertPosition;
                        this.editorHistory.updateComplexHistory();
                        this.editorHistory.currentBaseHistoryInfo = undefined;
                    }
                }
            }
            this.isCmtDeleteStarted = false;
            this.removeCommentCharacters = [];
            if (this.editorHistory.currentHistoryInfo) {
                this.editorHistory.updateComplexHistory();
                this.editorHistory.currentBaseHistoryInfo = undefined;
            }
            this.selection.owner.isShiftingEnabled = false;
        }
    }
    /**
     * Merge the selected cells.
     *
     * @returns {void}
     */
    public mergeCells(): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl || !this.owner.isDocumentLoaded) {
            return;
        }
        if (!isNullOrUndefined(this.documentHelper) && !this.selection.isEmpty) {
            this.mergeSelectedCellsInTable();
        }
    }
    /**
     * Deletes the entire table at selection.
     *
     * @returns {void}
     */
    public deleteTable(): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        if (startPos.paragraph.isInsideTable) {
            let table: TableWidget = this.getOwnerTable(this.selection.isForward).combineWidget(this.owner.viewer) as TableWidget;
            this.selection.owner.isShiftingEnabled = true;
            if (this.checkIsNotRedoing()) {
                this.initHistory('DeleteTable');
                //Sets the insert position in history info as current table.    
                this.updateHistoryPosition(startPos, true);
            }
            let paragraph: ParagraphWidget = this.getParagraphForSelection(table);
            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                this.editorHistory.currentBaseHistoryInfo.removedNodes.push(table.clone());
            }
            if (this.owner.enableTrackChanges) {
                for (let i: number = 0; i < table.childWidgets.length; i++) {
                    if (i === 0) {
                        let nextCell: TableCellWidget = table.childWidgets[0] as TableCellWidget;
                        paragraph = this.selection.getFirstParagraph(nextCell);
                    }
                    this.trackRowDeletion(table.childWidgets[i] as TableRowWidget);
                }

            } else {
                this.removeBlock(table);
            }
            this.selection.selectParagraphInternal(paragraph, true);
            if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
                this.reLayout(this.selection);
            }
        }
    }
    /**
     * Deletes the selected column(s).
     *
     * @returns {void}
     */
    public deleteColumn(): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        if (this.owner.enableTrackChanges) {
            let locale: L10n = new L10n('documenteditor', this.owner.defaultLocale);
            locale.setLocale(this.owner.locale);
            this.alertDialog = DialogUtility.alert({
                title: locale.getConstant('UnTrack'),
                content: locale.getConstant('Merge Track'),
                showCloseIcon: true,
                okButton: {
                    text: 'Ok', click: this.onDeleteColumnConfirmed.bind(this)
                },
                closeOnEscape: true,
                position: { X: 'center', Y: 'center' },
                animationSettings: { effect: 'Zoom' }
            });
        } else {
            this.onDeleteColumnConfirmed();
        }
    }
    private onDeleteColumnConfirmed(): void {
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        if (startPos.paragraph.isInsideTable) {
            this.selection.owner.isShiftingEnabled = true;
            if (this.checkIsNotRedoing()) {
                this.initHistory('DeleteColumn');
            }
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            let table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                this.cloneTableToHistoryInfo(table);
            }
            let paragraph: ParagraphWidget = undefined;
            if (endCell.nextWidget) {
                let nextCell: TableCellWidget = endCell.nextWidget as TableCellWidget;
                paragraph = this.selection.getFirstParagraph(nextCell);
            } else if (startCell.previousWidget) {
                let previousCell: TableCellWidget = startCell.previousWidget as TableCellWidget;
                paragraph = this.selection.getFirstParagraph(previousCell);
            }
            if (isNullOrUndefined(paragraph)) {
                paragraph = this.getParagraphForSelection(table);
            }
            //retrieve the cell collection based on start and end cell to remove. 
            let deleteCells: TableCellWidget[] = table.getColumnCellsForSelection(startCell, endCell);
            for (let i: number = 0; i < table.childWidgets.length; i++) {
                let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                if (row.childWidgets.length === 1) {
                    if (deleteCells.indexOf(row.childWidgets[0] as TableCellWidget) >= 0) {
                        table.childWidgets.splice(table.childWidgets.indexOf(row), 1);
                        row.destroy();
                        i--;
                    }
                } else {
                    for (let j: number = 0; j < row.childWidgets.length; j++) {
                        let tableCell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                        if (deleteCells.indexOf(tableCell) >= 0) {
                            row.childWidgets.splice(j, 1);
                            tableCell.destroy();
                            j--;
                        }
                    }
                    if (row.childWidgets.length === 0) {
                        table.childWidgets.splice(table.childWidgets.indexOf(row), 1);
                        row.destroy();
                        i--;
                    }
                }
            }
            if (table.childWidgets.length === 0) {
                // Before disposing table reset the paragrph.
                paragraph = this.getParagraphForSelection(table);
                this.removeBlock(table);
                if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                    this.editorHistory.currentBaseHistoryInfo.action = 'DeleteTable';
                }
                table.destroy();
            } else {
                table.isGridUpdated = false;
                table.buildTableColumns();
                table.isGridUpdated = true;
                this.documentHelper.layout.reLayoutTable(table);
            }
            this.selection.selectParagraphInternal(paragraph, true);
            if (isNullOrUndefined(this.editorHistory) || this.checkIsNotRedoing()) {
                this.reLayout(this.selection, true);
            }
            if (!isNullOrUndefined(this.alertDialog)) {
                this.alertDialog.close();
                this.alertDialog = undefined;
            }
        }
    }
    /**
     * Deletes the selected row(s).
     *
     * @returns {void}
     */
    public deleteRow(): void {
        if (this.owner.isReadOnlyMode || !this.canEditContentControl) {
            return;
        }
        let startPos: TextPosition = !this.selection.isForward ? this.selection.end : this.selection.start;
        let endPos: TextPosition = !this.selection.isForward ? this.selection.start : this.selection.end;
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPos);
        let startIndex: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        if (startPos.paragraph.isInsideTable) {
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            if (this.checkIsNotRedoing()) {
                this.initHistory('DeleteRow');
            }
            this.selection.owner.isShiftingEnabled = true;
            let table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            let row: TableRowWidget = this.getOwnerRow(true);
            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                this.cloneTableToHistoryInfo(table);
            }
            let paragraph: ParagraphWidget = undefined;
            if (row.nextWidget) {
                let nextCell: TableCellWidget = (row.nextWidget as TableRowWidget).childWidgets[0] as TableCellWidget;
                paragraph = this.selection.getFirstParagraph(nextCell);
            }
            if (isNullOrUndefined(paragraph)) {
                paragraph = this.getParagraphForSelection(table);
            }
            startPos = startPos.clone();
            if (!this.selection.isEmpty) {

                let containerCell: TableCellWidget = this.selection.getContainerCellOf(startCell, endCell);
                if (containerCell.ownerTable.contains(endCell)) {
                    startCell = this.selection.getSelectedCell(startCell, containerCell);
                    endCell = this.selection.getSelectedCell(endCell, containerCell);
                    if (this.selection.containsCell(containerCell, endCell)) {
                        row = startCell.ownerRow;
                        this.removeRow(row);
                    } else {
                        row = startCell.ownerRow;
                        let endRow: TableRowWidget = endCell.ownerRow;
                        //Update the selection paragraph.
                        paragraph = undefined;
                        if (endRow.nextWidget) {
                            let nextCell: TableCellWidget = (endRow.nextWidget as TableRowWidget).childWidgets[0] as TableCellWidget;
                            paragraph = this.selection.getFirstParagraph(nextCell);
                        }
                        if (isNullOrUndefined(paragraph)) {
                            paragraph = this.getParagraphForSelection(table);
                        }
                        for (let i: number = 0; i < table.childWidgets.length; i++) {
                            let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                            if (tableRow.rowIndex >= row.rowIndex && tableRow.rowIndex <= endRow.rowIndex) {
                                if (this.owner.enableTrackChanges && this.checkIsNotRedoing()) {
                                    this.trackRowDeletion(tableRow, true, false);
                                } else {
                                    table.childWidgets.splice(i, 1);
                                    tableRow.destroy();
                                    i--;
                                }
                            }
                        }
                        if (table.childWidgets.length === 0) {
                            this.removeBlock(table);
                            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                                this.editorHistory.currentBaseHistoryInfo.action = 'DeleteTable';
                            }
                            table.destroy();
                        } else {
                            this.updateTable(table);
                        }
                    }
                }
            } else {
                if (this.owner.enableTrackChanges) {
                    this.trackRowDeletion(row, true, false);
                } else {
                    this.removeRow(row);
                }
            }
            if (!this.owner.enableTrackChanges || isNullOrUndefined(table.childWidgets)) {
                this.selection.selectParagraphInternal(paragraph, true);
            } else {
                let textPosition: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(startIndex);
                this.selection.selectContent(textPosition, true);
                // this.selection.start.setPositionInternal(startPos);
                // this.selection.end.setPositionInternal(this.selection.start);
            }
            if (isNullOrUndefined(this.editorHistory) || this.checkIsNotRedoing()) {
                this.reLayout(this.selection, true);
            }
        }
    }

    private trackRowDeletion(row: TableRowWidget, canremoveRow?: boolean, updateHistory?: boolean): boolean {
        let rowFormat: WRowFormat = row.rowFormat;
        if (!isNullOrUndefined(rowFormat)) {
            let canInsertRevision: boolean = true;
            if (rowFormat.revisions.length > 0) {
                let revision: Revision = this.retrieveRevisionInOder(rowFormat);
                if (revision.revisionType === 'Insertion') {
                    if (this.isRevisionMatched(rowFormat, undefined)) {
                        if (isNullOrUndefined(canremoveRow) || canremoveRow) {
                            this.removeRow(row);
                        } else {
                            this.removeRevisionsInRow(row);
                        }
                        return true;
                    }
                } else if (revision.revisionType === 'Deletion') {
                    this.unlinkWholeRangeInRevision(rowFormat, revision);
                }
            }
            if (canInsertRevision) {

                if ((isNullOrUndefined(updateHistory) || updateHistory) && this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                    this.editorHistory.currentBaseHistoryInfo.action = 'RemoveRowTrack';
                }
                this.insertRevision(rowFormat, 'Deletion');
            }
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                for (let j: number = 0; j < cellWidget.childWidgets.length; j++) {
                    if (cellWidget.childWidgets[j] instanceof TableWidget) {
                        this.trackInnerTable(cellWidget.childWidgets[i] as TableWidget, canremoveRow, updateHistory);
                    } else {
                        let paraWidget: ParagraphWidget = cellWidget.childWidgets[j] as ParagraphWidget;

                        // We used this boolean since for table tracking we should add removed nodes only for entire table not for every elements in the table
                        this.skipTableElements = true;
                        this.insertRevisionForBlock(paraWidget, 'Deletion');
                        this.skipTableElements = false;
                    }
                }
            }
        }
        return false;
    }
    private trackInnerTable(tableWidget: TableWidget, canremoveRow?: boolean, updateHistory?: boolean): any {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            this.trackRowDeletion(tableWidget.childWidgets[i] as TableRowWidget, canremoveRow, updateHistory);
        }
    }
    private returnDeleteRevision(revisions: Revision[]): Revision {
        for (let i: number = 0; i < revisions.length; i++) {
            if (revisions[i].revisionType === 'Deletion') {
                return revisions[i];
            }
        }
        return undefined;
    }
    private removeRow(row: TableRowWidget): void {
        let table: TableWidget = row.ownerTable;
        if (row.rowFormat.revisions.length > 0) {
            this.removeRevisionsInRow(row);
        }
        if (table.childWidgets.length === 1) {
            this.removeBlock(table);
            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                this.editorHistory.currentBaseHistoryInfo.action = 'Delete';
            }
            table.destroy();
        } else {
            table.childWidgets.splice(table.childWidgets.indexOf(row), 1);
            row.destroy();
            this.updateTable(table);
        }
    }
    /**
     * @private
     * @param {TableWidget} table Specifies the table widget
     * @returns {void}
     */
    public updateTable(table: TableWidget): void {
        table.updateRowIndex(0);
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.documentHelper.layout.reLayoutTable(table);
    }
    private getParagraphForSelection(table: TableWidget): ParagraphWidget {
        let paragraph: ParagraphWidget = undefined;
        let nextWidget: Widget = table.nextWidget ? table.nextWidget : table.nextRenderedWidget;
        let previousWidget: Widget = table.previousWidget ? table.previousWidget : table.previousRenderedWidget;
        if (nextWidget) {
            paragraph = nextWidget instanceof ParagraphWidget ? nextWidget as ParagraphWidget
                : this.selection.getFirstParagraphInFirstCell((nextWidget as TableWidget));
        } else if (previousWidget) {
            paragraph = previousWidget instanceof ParagraphWidget ? previousWidget as ParagraphWidget
                : this.selection.getLastParagraphInLastCell((previousWidget as TableWidget));
        }
        return paragraph;
    }
    private deletePara(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition, editAction: number): void {
        paragraph = paragraph.combineWidget(this.owner.viewer) as ParagraphWidget;
        let selection: Selection = this.documentHelper.selection;
        let paragraphStart: number = selection.getStartOffset(paragraph);
        let endParagraphStartOffset: number = selection.getStartOffset(end.paragraph);
        let startOffset: number = paragraphStart;
        let endOffset: number = 0;
        let isCombineNextParagraph: boolean = false;
        let lastLinelength: number = this.selection.getLineLength(paragraph.lastChild as LineWidget);
        let currentParagraph: ParagraphWidget = paragraph;
        let section: BodyWidget = paragraph.bodyWidget instanceof BodyWidget ? paragraph.bodyWidget as BodyWidget : undefined;
        let startLine: LineWidget = undefined;
        let endLineWidget: LineWidget = undefined;
        if (paragraph === start.paragraph) {
            startOffset = start.offset;
            startLine = start.currentWidget;
            if (end.paragraph.isInsideTable) {
                isCombineNextParagraph = this.isEndInAdjacentTable(paragraph, end.paragraph);
            }
        } else {
            startLine = paragraph.firstChild as LineWidget;
        }
        if (paragraph !== start.paragraph && selection.isSkipLayouting) {
            selection.isSkipLayouting = false;
        }
        if (paragraph === end.paragraph) {
            endLineWidget = end.currentWidget;
            endOffset = end.offset;
        } else {
            endLineWidget = paragraph.lastChild as LineWidget;
            endOffset = this.documentHelper.selection.getLineLength(paragraph.lastChild as LineWidget);
        }
        // If previous widget is splitted paragraph, combine paragraph widget.
        let block: BlockWidget = paragraph.previousRenderedWidget ?
            paragraph.previousRenderedWidget.combineWidget(this.documentHelper.viewer) as BlockWidget : undefined;

        if (startOffset > paragraphStart && start.currentWidget === paragraph.lastChild &&
            startOffset === lastLinelength && (paragraph === end.paragraph && end.offset === startOffset + 1 ||
                paragraph.nextRenderedWidget === end.paragraph && end.offset === endParagraphStartOffset) ||
            (this.editorHistory && this.editorHistory.isUndoing && this.editorHistory.currentHistoryInfo &&
                this.editorHistory.currentHistoryInfo.action === 'PageBreak' && block && block.isPageBreak()
                && (startOffset === 0 && !start.currentWidget.isFirstLine || startOffset > 0))) {
            isCombineNextParagraph = true;
        }
        let paraEnd: TextPosition = end.clone();
        paraEnd.offset = paraEnd.offset - 1;
        let paraReplace: boolean = (start.paragraph === paragraph && start.isAtParagraphStart && paraEnd.isAtParagraphEnd &&
            this.editorHistory && this.editorHistory.currentBaseHistoryInfo.action === 'Insert');
        if (paraReplace) {
            this.editorHistory.currentBaseHistoryInfo.action = 'InsertTextParaReplace';
        }
        if (end.paragraph === paragraph && end.currentWidget !== paragraph.lastChild ||
            (end.currentWidget === paragraph.lastChild && end.offset <= selection.getLineLength(paragraph.lastChild as LineWidget)) ||
            paraReplace) {
            let isStartParagraph: boolean = start.paragraph === paragraph;
            if (end.currentWidget.isFirstLine() && end.offset > paragraphStart || !end.currentWidget.isFirstLine() || paraReplace) {
                //If selection end with this paragraph and selection doesnot include paragraph mark.               
                this.removeInlines(paragraph, startLine, startOffset, endLineWidget, endOffset, editAction);
                //Removes the splitted paragraph.
            }
            if (!isNullOrUndefined(block) && !isStartParagraph && !paraReplace) {
                this.delBlockContinue = true;
                this.delBlock = block;
                let nextSection: BodyWidget = block.bodyWidget instanceof BodyWidget ? block.bodyWidget : undefined;
                if (nextSection && !section.equals(nextSection) && section.index !== nextSection.index) {
                    this.delSection = nextSection;
                } else {
                    this.delSection = undefined;
                }
            } else {
                this.delBlockContinue = false;
                this.delBlock = undefined;
            }
        } else if (start.paragraph === paragraph && (start.currentWidget !== paragraph.firstChild ||
            (start.currentWidget === paragraph.firstChild && startOffset > paragraphStart))) {
            // If selection start is after paragraph start
            //And selection does not end with this paragraph Or selection include paragraph mark.
            this.delBlockContinue = false;
            this.delBlock = undefined;
            if (editAction === 4) {
                return;
            } else {
                if (this.skipTracking() && this.editorHistory.currentBaseHistoryInfo.action === 'ParaMarkTrack') {
                    this.addRemovedNodes(paragraph.characterFormat.cloneFormat());
                    if (paragraph.characterFormat.revisions.length > 0) {
                        this.unlinkRangeFromRevision(paragraph.characterFormat, true);
                    }
                    paragraph.characterFormat.revisions = [];
                } else {

                    if (this.owner.enableTrackChanges && !this.skipTracking() && this.editorHistory.currentBaseHistoryInfo.action !== 'TOC' && this.editorHistory.currentBaseHistoryInfo.action !== 'Reject Change') {
                        if (isCombineNextParagraph) {

                            currentParagraph = this.splitParagraph(paragraph, paragraph.firstChild as LineWidget, 0, startLine, startOffset, true);
                            this.deleteParagraphMark(currentParagraph, selection, editAction, true);
                            this.addRemovedNodes(paragraph);
                        } else {
                            this.removeInlines(paragraph, startLine, startOffset, endLineWidget, endOffset, editAction);
                        }
                    } else {

                        currentParagraph = this.splitParagraph(paragraph, paragraph.firstChild as LineWidget, 0, startLine, startOffset, true);
                        this.insertParagraphPaste(paragraph, currentParagraph, start, end, isCombineNextParagraph, editAction);
                        this.removeRevisionForBlock(paragraph, undefined, false, true);
                        this.addRemovedNodes(paragraph);
                    }
                }
                return;
            }
        } else {
            let newParagraph: ParagraphWidget = undefined;
            let previousBlock: BlockWidget = paragraph.previousWidget as BlockWidget;
            let prevParagraph: ParagraphWidget = (previousBlock instanceof ParagraphWidget) ? previousBlock : undefined;
            let nextWidget: BlockWidget = paragraph.nextRenderedWidget as BlockWidget;
            if (editAction < 4) {

                //Checks whether this is last paragraph of owner text body and previousBlock is not paragraph.
                if (this.owner.enableTrackChanges && !this.skipTracking() && this.editorHistory.currentBaseHistoryInfo && this.editorHistory.currentBaseHistoryInfo.action !== 'TOC') {
                    this.insertRevisionForBlock(paragraph, 'Deletion');
                    if (paragraph.isEmpty() && !(end.paragraph.previousRenderedWidget instanceof TableWidget)) {
                        newParagraph = this.checkAndInsertBlock(paragraph, start, end, editAction, prevParagraph);
                        this.removeBlock(paragraph);
                    } else {

                        // On deleting para, para items may be added with delete revisions so we need to ensure whether it can be combined with prev/ next para.
                        this.combineRevisionWithBlocks((paragraph.firstChild as LineWidget).children[0]);
                    }
                    if (paragraph === end.paragraph && this.editorHistory.currentBaseHistoryInfo.action === 'Delete') {
                        let paraInfo: ParagraphInfo = this.selection.getParagraphInfo(end);
                        this.selection.editPosition = this.selection.getHierarchicalIndex(paraInfo.paragraph, paraInfo.offset.toString());
                    }
                    if (start.paragraph !== paragraph && !isNullOrUndefined(block)) {
                        this.delBlockContinue = true;
                        this.delBlock = block;
                        return;
                    }

                } else {
                    //this.documentHelper.comments;
                    let foot: FootNoteWidget;
                    /*  if (!isNullOrUndefined(selection.start.paragraph.bodyWidget.page.footnoteWidget)) {
                          foot = selection.start.paragraph.bodyWidget.page.footnoteWidget;
                      }else if (!isNullOrUndefined(selection.start.paragraph.bodyWidget.page.endnoteWidget)) {
                          foot = selection.start.paragraph.bodyWidget.page.endnoteWidget;
                      }*/
                    newParagraph = this.checkAndInsertBlock(paragraph, start, end, editAction, prevParagraph);
                    this.removeRevisionForBlock(paragraph, undefined, false, true);
                    this.addRemovedNodes(paragraph);
                    this.removeBlock(paragraph);

                    /* let widget: IWidget;
                     for(let i:number =0;i< foot.childWidgets.length; i++) {
                     widget = foot.childWidgets[i];
                     if (widget instanceof ParagraphWidget) {
 
                     let para: ParagraphWidget = widget;
                     if (!isNullOrUndefined(para)) {
                         this.removeBlock(para);
                     }}}*/
                }
                if (this.documentHelper.blockToShift === paragraph) {
                    this.documentHelper.blockToShift = undefined;
                }
                if (!isNullOrUndefined(newParagraph)) {
                    selection.editPosition = this.selection.getHierarchicalIndex(newParagraph, '0');
                    let offset: number = selection.getParagraphLength(newParagraph) + 1;
                    if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {

                        this.editorHistory.currentBaseHistoryInfo.endPosition = this.selection.getHierarchicalIndex(newParagraph, offset.toString());
                    }
                } else if (paragraph === start.paragraph && isNullOrUndefined(nextWidget) && !isNullOrUndefined(prevParagraph)) {
                    let offset: number = this.selection.getParagraphLength(prevParagraph);
                    // if (isNullOrUndefined(block)) {
                    selection.editPosition = this.selection.getHierarchicalIndex(prevParagraph, offset.toString());
                    if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                        this.updateHistoryPosition(selection.editPosition, true);
                        this.editorHistory.currentBaseHistoryInfo.endPosition = selection.editPosition;
                    }
                    // } else {
                    //     let offset: number = selection.getParagraphLength(paragraph) + 1;
                    //     if (block instanceof ParagraphWidget) {
                    //         prevParagraph = block as ParagraphWidget;
                    //     }
                    //     // if (block instanceof WTable) {
                    //     //     prevParagraph = (block as WTable).getFirstParagraphInFirstCell();
                    //     // }
                    //     selection.editPosition = prevLineWidget.getHierarchicalIndex('0');
                    // }
                }
            }
            if (start.paragraph !== paragraph && !isNullOrUndefined(block)) {
                this.delBlockContinue = true;
                this.delBlock = block;
            } else {
                this.delBlockContinue = false;
                this.delBlock = undefined;
            }
        }
        this.insertParagraphPaste(paragraph, currentParagraph, start, end, isCombineNextParagraph, editAction);
    }
    private deleteSection(selection: Selection, section: BodyWidget, nextSection: BodyWidget, editAction: number): void {
        if (editAction < 4) {
            this.combineSectionInternal(selection, section, nextSection);
        }
        //Copies the section properties, if this is last paragraph of section.
        if (editAction > 2) {
            section.sectionFormat.copyFormat(nextSection.sectionFormat);
        }
    }
    private combineSectionInternal(selection: Selection, section: BodyWidget, nextSection: BodyWidget): void {
        // if (section.sectionFormat.isEqualFormat(nextSection.sectionFormat)) {

        // } else {
        let bodyWidget: BodyWidget = section.getSplitWidgets()[0] as BodyWidget;
        let currentSection: BodyWidget[] = [];
        this.combineSectionChild(bodyWidget, currentSection);
        bodyWidget = currentSection[0];
        let lastBlockIndex: number = (bodyWidget.lastChild as BlockWidget).index;
        this.updateBlockIndex(lastBlockIndex + 1, nextSection.firstChild as BlockWidget);
        let insertIndex: number = 0;
        let containerWidget: BodyWidget = nextSection;
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            let block: BlockWidget = bodyWidget.childWidgets.splice(i, 1)[0] as BlockWidget;
            containerWidget.childWidgets.splice(insertIndex, 0, block);
            block.containerWidget = containerWidget;
            this.documentHelper.layout.layoutBodyWidgetCollection(block.index, block.bodyWidget, block, false);
            block = block.getSplitWidgets().pop() as BlockWidget;
            containerWidget = block.containerWidget as BodyWidget;
            insertIndex = block.indexInOwner + 1;
            i--;
        }
        this.updateSectionIndex(undefined, nextSection, false);
        this.addRemovedNodes(bodyWidget);
        // this.insert
        // }
    }
    /* eslint-disable max-len */
    private checkAndInsertBlock(block: BlockWidget, start: TextPosition, end: TextPosition, editAction: number, previousParagraph: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget && block === start.paragraph || block instanceof TableWidget) {
            let newParagraph: ParagraphWidget; //Adds an empty paragraph, to ensure minimal content.
            if (isNullOrUndefined(block.nextWidget) && (isNullOrUndefined(previousParagraph) || previousParagraph.nextRenderedWidget instanceof TableWidget)) {
                newParagraph = new ParagraphWidget();
                if (editAction === 1 && block instanceof ParagraphWidget && !isNullOrUndefined(block.paragraphFormat.baseStyle) && block.paragraphFormat.baseStyle.name === 'Normal') {
                    newParagraph.characterFormat.copyFormat(block.characterFormat);
                    newParagraph.paragraphFormat.copyFormat(block.paragraphFormat);
                }
                newParagraph.index = block.index + 1;
                newParagraph.containerWidget = block.containerWidget;
                if (block instanceof ParagraphWidget) {
                    newParagraph.paragraphFormat.lineSpacing = block.paragraphFormat.lineSpacing;
                    newParagraph.paragraphFormat.lineSpacingType = block.paragraphFormat.lineSpacingType;
                    let style: Object = this.documentHelper.styles.findByName('Normal');
                    if (!isNullOrUndefined(style)) {
                        (newParagraph.paragraphFormat.baseStyle as WParagraphStyle) = new WParagraphStyle();
                        (newParagraph.paragraphFormat.baseStyle as WParagraphStyle).copyStyle(style as WParagraphStyle);
                    }
                }
                this.documentHelper.layout.layoutBodyWidgetCollection(newParagraph.index, newParagraph.bodyWidget, newParagraph, false);
                if (block.containerWidget instanceof Widget) {
                    block.containerWidget.childWidgets.push(newParagraph);
                }
            }
            return newParagraph;
        }
        return undefined;
    }

    private splitParagraph(paragraphAdv: ParagraphWidget, startLine: LineWidget, startOffset: number, endLine: LineWidget, endOffset: number, removeBlock: boolean): ParagraphWidget {
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.paragraphFormat = new WParagraphFormat(paragraph);
        paragraph.characterFormat = new WCharacterFormat(paragraph);
        paragraph.paragraphFormat.copyFormat(paragraphAdv.paragraphFormat);
        paragraph.characterFormat.copyFormat(paragraphAdv.characterFormat);
        let lineWidget: LineWidget = new LineWidget(paragraph);
        paragraph.childWidgets.push(lineWidget);
        let blockIndex: number = paragraphAdv.index;
        let insertIndex: number = paragraphAdv.indexInOwner;
        this.moveInlines(paragraphAdv, paragraph, 0, startOffset, startLine, endOffset, endLine);
        //Inserts new paragraph in the current text position.
        paragraphAdv.containerWidget.childWidgets.splice(insertIndex, 0, paragraph);
        paragraph.index = blockIndex;
        paragraph.containerWidget = paragraphAdv.containerWidget;
        this.updateNextBlocksIndex(paragraph, true);
        if (removeBlock) {
            this.removeBlock(paragraphAdv);
        }

        this.documentHelper.layout.layoutBodyWidgetCollection(blockIndex, paragraph.containerWidget as BodyWidget, paragraph, false);
        return paragraph;
    }

    private removeCommentsInBlock(block: BlockWidget): void {
        if (block instanceof TableWidget) {
            for (let i: number = 0; i < block.childWidgets.length; i++) {
                let row: TableRowWidget = block.childWidgets[i] as TableRowWidget;
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    for (let k: number = 0; k < cell.childWidgets.length; k++) {
                        let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                        this.removeCommentsInBlock(block);
                    }
                }
            }
        } else {
            this.removeCommentInPara(block as ParagraphWidget);
        }
    }

    private removeCommentInPara(block: ParagraphWidget): void {
        for (let i: number = 0; i < block.childWidgets.length; i++) {
            let lineWidget: LineWidget = block.childWidgets[i] as LineWidget;
            //Iterate through each line widgets.
            for (let j: number = 0; j < lineWidget.children.length; j++) {
                this.removeCommentsInline(lineWidget.children[j] as ElementBox);
            }
        }
        if (this.editorHistory && this.editorHistory.currentHistoryInfo && this.removeCommentCharacters.length === 0 && !this.isCmtDeleteStarted && !(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }

    private removeCommentsInline(inline: ElementBox) {
        if (inline instanceof CommentCharacterElementBox && inline.commentType === 1) {
            if (!inline.comment.isReply) {
                for (let i: number = 0; i < inline.comment.replyComments.length; i++) {
                    this.removeCommentsInline(inline.comment.replyComments[i].commentEnd);
                }
            }
            if (inline.comment.commentStart && inline.comment.commentStart.commentMark) {
                inline.comment.commentStart.removeCommentMark();
            }
            if (!inline.comment.isReply && this.documentHelper.comments.indexOf(inline.comment) >= 0
                || inline.comment.isReply && this.documentHelper.comments.indexOf(inline.comment.ownerComment) >= 0) {
                this.deleteCommentWidgetInline(inline);
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public removeBlock(block: BlockWidget, isSkipShifting?: boolean): void {
        let index: number;
        let blockCollection: IWidget[];
        let containerWidget: Widget;
        this.removeFieldInBlock(block);
        this.removeFieldInBlock(block, true);
        this.removeFieldInBlock(block, undefined, true);
        this.removeCommentsInBlock(block);
        if (block.isInsideTable) {
            containerWidget = block.associatedCell;
            index = block.associatedCell.childWidgets.indexOf(block);
            blockCollection = block.associatedCell.childWidgets;
            this.updateNextBlocksIndex(block, false);
            block.associatedCell.childWidgets.splice(index, 1);
            block.containerWidget = undefined;
            this.documentHelper.layout.layoutBodyWidgetCollection(block.index, containerWidget, block, false);
        } else {
            containerWidget = block.containerWidget;
            for (let i: number = 0; i < block.childWidgets.length; i++) {
                let isSkipTracking: boolean;
                if (!this.isPasteRevertAction()) {
                    isSkipTracking = this.skipTracking();
                }
                if (block.childWidgets[i] instanceof TableRowWidget && !isSkipTracking) {
                    let tableDelete: IWidget = block.childWidgets[i];
                    this.removeDeletedCellRevision(tableDelete as TableRowWidget);
                }
            }
            index = containerWidget.childWidgets.indexOf(block);
            blockCollection = containerWidget.childWidgets;
            this.updateNextBlocksIndex(block, false);
            containerWidget.childWidgets.splice(index, 1);
            block.containerWidget = undefined;
            containerWidget.height -= block.height;
            this.documentHelper.layout.layoutBodyWidgetCollection(block.index, containerWidget, block, false, isSkipShifting);
        }
    }
    private removePrevParaMarkRevision(currentBlock: BlockWidget, moveNext?: boolean) {
        moveNext = isNullOrUndefined(moveNext) ? false : moveNext;
        if (this.owner.enableTrackChanges) {
            let currentPara: ParagraphWidget = currentBlock as ParagraphWidget;
            let rangeIndex: number = -1;
            let revision: Revision;
            let nonEmptyEndPara: ParagraphWidget = currentPara;
            let i: number = 0;

            if (!currentPara.isEmpty()) {
                if (!moveNext && !isNullOrUndefined(nonEmptyEndPara.previousRenderedWidget)) {
                    nonEmptyEndPara = nonEmptyEndPara.previousRenderedWidget as ParagraphWidget;
                    i++;
                }
                if (moveNext && !isNullOrUndefined(nonEmptyEndPara.nextRenderedWidget)) {
                    nonEmptyEndPara = nonEmptyEndPara.nextRenderedWidget as ParagraphWidget;
                    i++;
                }
            }
            if (!moveNext) {
                while (nonEmptyEndPara.isEmpty() && !isNullOrUndefined(nonEmptyEndPara.previousRenderedWidget)) {
                    nonEmptyEndPara = nonEmptyEndPara.previousRenderedWidget as ParagraphWidget;
                    i++;
                }
            }
            else {
                while (nonEmptyEndPara.isEmpty() && !isNullOrUndefined(nonEmptyEndPara.nextRenderedWidget)) {
                    nonEmptyEndPara = nonEmptyEndPara.nextRenderedWidget as ParagraphWidget;
                    i++;
                }
            }
            let lineW: LineWidget = nonEmptyEndPara.childWidgets[0] as LineWidget;
            if (!isNullOrUndefined(lineW) && lineW.children.length > 0) {
                let firstTextBox = lineW.children[0] as TextElementBox;
                if (!isNullOrUndefined(firstTextBox) && firstTextBox.revisions.length > 0) {
                    revision = firstTextBox.revisions[firstTextBox.revisions.length - 1];
                    // if (!isNullOrUndefined(prevPara)) {
                    // revision = prevPara.characterFormat.revisions[prevPara.characterFormat.revisions.length - 1];
                    if (moveNext) {
                        rangeIndex = revision.range.indexOf(firstTextBox) - i;
                    }
                    else {
                        rangeIndex = revision.range.indexOf(firstTextBox) + i;
                    }
                    // }
                }
            }
            else if (nonEmptyEndPara.isEmpty()) {
                revision = nonEmptyEndPara.characterFormat.revisions[nonEmptyEndPara.characterFormat.revisions.length - 1];
                rangeIndex = i - 1;
            }
            if (rangeIndex >= 0 && !isNullOrUndefined(revision)) {
                let lastRange: Range = revision.range[rangeIndex] as Range;
                let isParaMark: boolean = lastRange instanceof WCharacterFormat;
                if (isParaMark) {
                    revision.range.splice(rangeIndex, 1);
                    if (revision.range.length == 0) {
                        this.owner.revisionsInternal.remove(revision);
                    }
                }
            }
        }
    }
    private isPasteRevertAction(): boolean {
        if (!isNullOrUndefined(this.editorHistory) && this.editorHistory.currentBaseHistoryInfo && this.editorHistory.currentBaseHistoryInfo.action === 'Paste') {
            return true;
        }
        return false;
    }
    private toCheckForTrack(block: BlockWidget): boolean {
        if (this.owner.enableTrackChanges && !this.skipTracking()) {
            if (block instanceof TableWidget && block.childWidgets.length > 0) {
                let rowFormat: WRowFormat = (block.childWidgets[0] as TableRowWidget).rowFormat;
                if ((rowFormat.revisions.length > 0 && rowFormat.revisions[0].revisionType !== 'Insertion'
                    && rowFormat.revisions[0].author === (this.owner.currentUser === '' ? 'Guest user' : this.owner.currentUser))
                    || (rowFormat.revisions.length === 0)) {
                    return true;
                }
            }
        }
        return false;
    }
    private removeFootnote(element: FootnoteElementBox, paragraph?: ParagraphWidget): void {
        if (element.paragraph.bodyWidget.page.footnoteWidget) {
            let footnoteWidget: FootNoteWidget = element.paragraph.bodyWidget.page.footnoteWidget;
            for (let j: number = 0; j < footnoteWidget.childWidgets.length; j++) {
                if (element === (footnoteWidget.childWidgets[j] as BlockWidget).footNoteReference) {
                    footnoteWidget.height -= (footnoteWidget.childWidgets[j] as BlockWidget).height;
                    footnoteWidget.childWidgets.splice(j, 1);
                    j--;
                }
            }
            if (footnoteWidget.childWidgets.length === 1) {
                element.paragraph.bodyWidget.page.footnoteWidget = undefined;
            }
        }
        this.documentHelper.footnoteCollection.splice(this.documentHelper.footnoteCollection.indexOf(element), 1);
    }
    private removeEndnote(element: FootnoteElementBox, paragraph?: ParagraphWidget): void {
        if (element.paragraph.bodyWidget.page.endnoteWidget) {
            let endnoteWidget: FootNoteWidget = element.paragraph.bodyWidget.page.endnoteWidget;
            for (let j: number = 0; j < endnoteWidget.childWidgets.length; j++) {
                if (element === (endnoteWidget.childWidgets[j] as BlockWidget).footNoteReference) {
                    endnoteWidget.height -= (endnoteWidget.childWidgets[j] as BlockWidget).height;
                    endnoteWidget.childWidgets.splice(j, 1);
                    j--;
                }
            }
            if (endnoteWidget.childWidgets.length === 1) {
                element.paragraph.bodyWidget.page.endnoteWidget = undefined;
            }
        }
        this.documentHelper.endnoteCollection.splice(this.documentHelper.endnoteCollection.indexOf(element), 1);
    }
    private removeAutoShape(inline: ShapeBase): void {
        let shapeIndex: number = inline.line.paragraph.floatingElements.indexOf(inline);

        inline.line.paragraph.bodyWidget.floatingElements.splice(inline.line.paragraph.bodyWidget.floatingElements.indexOf(inline), 1);
        inline.line.paragraph.floatingElements.splice(shapeIndex, 1);
    }
    /**
     * @private
     * @returns {void}
     */
    public removeField(block: BlockWidget, isBookmark?: boolean, isContentControl?: boolean): void {
        let collection: FieldElementBox[] | string[] | ContentControl[] = this.documentHelper.fields;
        if (isBookmark) {
            collection = this.documentHelper.bookmarks.keys;
        } else if (isContentControl) {
            collection = this.documentHelper.contentControlCollection;
        }
        if ((block as ParagraphWidget).floatingElements.length > 0) {
            for (let z: number = 0; z < (block as ParagraphWidget).floatingElements.length; z++) {
                let inline: ShapeBase = (block as ParagraphWidget).floatingElements[z];
                this.removeAutoShape(inline);
            }
        }

        for (let i: number = 0; i < collection.length; i++) {
            let element: FieldElementBox | BookmarkElementBox = isBookmark ?
                this.documentHelper.bookmarks.get(collection[i] as string) : collection[i] as FieldElementBox;
            if (element.line.paragraph === block) {
                if (isBookmark) {
                    this.documentHelper.bookmarks.remove(collection[i] as string);
                } else if (isContentControl) {
                    this.documentHelper.contentControlCollection.splice(i, 1);
                } else {
                    this.documentHelper.fields.splice(i, 1);
                    if (this.documentHelper.formFields.indexOf(element as FieldElementBox) !== -1) {
                        this.documentHelper.formFields.splice(this.documentHelper.formFields.indexOf(element as FieldElementBox), 1);
                    }
                }
                i--;
            }
        }
        if (this.documentHelper.footnoteCollection.length > 0) {
            for (let i: number = 0; i < this.documentHelper.footnoteCollection.length; i++) {
                let element: FootnoteElementBox = this.documentHelper.footnoteCollection[i] as FootnoteElementBox;
                if (element.line.paragraph === block) {
                    if (element.paragraph.bodyWidget.page.footnoteWidget) {
                        let footnote: FootNoteWidget = element.paragraph.bodyWidget.page.footnoteWidget;
                        for (let j: number = 0; j < footnote.childWidgets.length; j++) {
                            if (element === (footnote.childWidgets[j] as BlockWidget).footNoteReference) {
                                footnote.height -= (footnote.childWidgets[j] as BlockWidget).height;
                                footnote.childWidgets.splice(j, 1);
                                j--;
                            }
                        }
                        if (footnote.childWidgets.length === 1) {
                            element.paragraph.bodyWidget.page.footnoteWidget = undefined;
                        }
                    }
                    this.documentHelper.footnoteCollection.splice(i, 1);

                    i--;
                }
            }
        }
        if (this.documentHelper.endnoteCollection.length > 0) {
            for (let i: number = 0; i < this.documentHelper.endnoteCollection.length; i++) {
                let element: FootnoteElementBox = this.documentHelper.endnoteCollection[i] as FootnoteElementBox;
                if (element.line.paragraph === block) {
                    if (element.paragraph.bodyWidget.page.endnoteWidget) {
                        let endnote: FootNoteWidget = element.paragraph.bodyWidget.page.endnoteWidget;
                        for (let j: number = 0; j < endnote.childWidgets.length; j++) {
                            if (element === (endnote.childWidgets[j] as BlockWidget).footNoteReference) {
                                endnote.height -= (endnote.childWidgets[j] as BlockWidget).height;
                                endnote.childWidgets.splice(j, 1);
                                j--;
                            }
                        }
                        if (endnote.childWidgets.length === 1) {
                            element.paragraph.bodyWidget.page.endnoteWidget = undefined;
                        }
                    }
                    this.documentHelper.endnoteCollection.splice(i, 1);

                    i--;
                }
            }
        }

    }
    /**
     * @private
     * @param {IWidget} node Specifies the node.
     * @returns {void}
     */
    public addRemovedNodes(node: IWidget): void {
        if (node instanceof CommentCharacterElementBox && node.commentType === 0 && node.commentMark) {
            node.removeCommentMark();
        }
        if (node instanceof ContentControl && node.type === 0) {
            this.documentHelper.contentControlCollection.splice(this.documentHelper.contentControlCollection.indexOf(node), 1);
        }
        if (node instanceof FieldElementBox && node.fieldType === 0) {
            if (this.documentHelper.fields.indexOf(node) !== -1) {
                this.documentHelper.fields.splice(this.documentHelper.fields.indexOf(node), 1);
            }
            if (this.documentHelper.formFields.indexOf(node) !== -1) {
                this.documentHelper.formFields.splice(this.documentHelper.formFields.indexOf(node), 1);
            }
        }
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.editorHistory.currentBaseHistoryInfo.removedNodes.push(node);
        } else if (this.editHyperlinkInternal) {
            this.nodes.push(node);
        }
    }
    private deleteBlock(block: BlockWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        if (block instanceof ParagraphWidget) {
            this.deletePara(block as ParagraphWidget, start, end, editAction);
            if (this.delBlockContinue && this.delBlock) {
                if (this.delSection) {
                    let bodyWidget: BodyWidget = block.bodyWidget instanceof BodyWidget ? block.bodyWidget : undefined;
                    this.deleteSection(selection, this.delSection, bodyWidget, editAction);
                    this.delSection = undefined;
                }
                if (this.delBlock.indexInOwner !== -1) {
                    this.deleteBlock((this.delBlock as ParagraphWidget), selection, start, end, editAction);
                }
                this.delBlockContinue = false;
                this.delBlock = undefined;
            }
        } else {
            this.deleteTableBlock(block as TableWidget, selection, start, end, editAction);
        }
    }

    private deleteTableCell(cellAdv: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let deletePreviousBlock: boolean = !(start.paragraph.isInsideTable && cellAdv.ownerTable.contains(start.paragraph.associatedCell));
        let previousBlock: BlockWidget = cellAdv.ownerTable.previousRenderedWidget as BlockWidget;
        if (start.paragraph.isInsideTable) {
            let containerCell: TableCellWidget = selection.getContainerCellOf(cellAdv, start.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(start.paragraph.associatedCell)) {
                let startCell: TableCellWidget = selection.getSelectedCell(cellAdv, containerCell);
                let endCell: TableCellWidget = selection.getSelectedCell(start.paragraph.associatedCell, containerCell);
                if (selection.containsCell(containerCell, start.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (selection.isCellSelected(containerCell, start, end)) {
                        //Container cell is completely selected.
                        this.updateEditPosition(containerCell, selection);
                        if (editAction === 1) {
                            //Specifically handled for backspace. Delete selected cell in current table.
                            this.deleteCellsInTable(cellAdv.ownerRow.ownerTable, selection, start, end, editAction);
                        } else {
                            //Delete contents within table cell or Copy contents within table cell to clipboard.
                            let isCellCleared: boolean = this.deleteCell(containerCell, selection, editAction, true);
                            if (!isCellCleared && editAction !== 2 && this.editorHistory) {
                                this.editorHistory.currentBaseHistoryInfo = undefined;
                            } else if (isCellCleared) {
                                this.documentHelper.layout.reLayoutTable(containerCell.ownerRow.ownerTable);
                            }
                        }
                    } else {
                        if (startCell === containerCell) {
                            this.deletePara(end.paragraph, start, end, editAction);
                            if (this.delBlockContinue && this.delBlock) {
                                if (this.delSection) {
                                    let para: ParagraphWidget = end.paragraph;
                                    let bodyWidget: BodyWidget = para.bodyWidget instanceof BodyWidget ? para.bodyWidget : undefined;
                                    this.deleteSection(selection, this.delSection, bodyWidget, editAction);
                                    this.delSection = undefined;
                                }
                                this.deleteBlock((this.delBlock as ParagraphWidget), selection, start, end, editAction);
                                this.delBlockContinue = false;
                                this.delBlock = undefined;
                            }
                        } else {
                            this.deleteContainer(startCell, selection, start, end, editAction);
                        }
                    }
                } else {
                    if (editAction === 2) {
                        //Delete contents within table cell.
                        this.deleteCell(cellAdv, selection, 2, false);
                    } else {
                        //Delete other selected cells in current table.
                        this.deleteCellsInTable(containerCell.ownerTable, selection, start, end, editAction);
                    }
                }
            } else {
                //Selection end is different table.
                this.deleteContainer(containerCell, selection, start, end, editAction);
            }
        } else {
            //Selection end is outside table.
            let cell: TableCellWidget = selection.getContainerCell(cellAdv);
            this.deleteContainer(cell, selection, start, end, editAction);
        }
        if (deletePreviousBlock) {
            let sectionAdv: BodyWidget = previousBlock.bodyWidget instanceof BodyWidget ? previousBlock.bodyWidget : undefined;
            // this.deleteContent(cellAdv.ownerTable, selection, editAction);
            if (!isNullOrUndefined(previousBlock)) {
                // let nextSection: WSection = blockAdv.section instanceof WSection ? blockAdv.section as WSection : undefined;
                // if (sectionAdv !== nextSection) {
                //     this.deleteSection(selection, sectionAdv, nextSection, editAction);
                // }
                //Goto the next block.
                this.deleteBlock(previousBlock, selection, start, end, editAction);
            }
        }
    }

    private deleteCellsInTable(table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number, endCells?: TableCellWidget): void {
        let clonedTable: TableWidget = undefined;
        let action: Action = 'Delete';
        let isDeleteCells: boolean = false;
        let startCell: TableCellWidget = start.paragraph.associatedCell;
        let endCell: TableCellWidget = end.paragraph.associatedCell;
        if (!isNullOrUndefined(endCells)) {
            endCell = endCells;
        }
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            action = this.editorHistory.currentBaseHistoryInfo.action;

            isDeleteCells = this.editorHistory.currentBaseHistoryInfo.action === 'BackSpace' || this.editorHistory.currentBaseHistoryInfo.action === 'DeleteCells'
                || this.editorHistory.currentBaseHistoryInfo.action === 'InsertTable' || this.editorHistory.currentBaseHistoryInfo.action === 'RemoveRowTrack' || (isNullOrUndefined(startCell.ownerRow.previousWidget)
                    && isNullOrUndefined(endCell.ownerRow.nextWidget) && this.editorHistory.currentBaseHistoryInfo.action === 'Cut');
            clonedTable = this.cloneTableToHistoryInfo(table);
            if (this.editorHistory.currentBaseHistoryInfo.action === 'RemoveRowTrack') {
                return;
            }
            this.editorHistory.currentBaseHistoryInfo.action = isDeleteCells ? 'DeleteCells' : 'ClearCells';
            selection.owner.isLayoutEnabled = false;
        }
        let startColumnIndex: number = startCell.columnIndex;
        let endColumnIndex: number = endCell.columnIndex + endCell.cellFormat.columnSpan - 1;
        let startRowIndex: number = startCell.rowIndex;
        let endRowIndex: number = endCell.rowIndex;
        //let cells: TableCellWidget[] = [];
        let isRowSelected: boolean = this.isWholeRowSelected(startCell.ownerRow, startColumnIndex, endColumnIndex);
        if (this.owner.enableTrackChanges && !this.skipTracking()) {
            if (!isRowSelected) {
                let localizeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
                const tiltle: string = localizeValue.getConstant('UnTrack');
                const content: string = localizeValue.getConstant('Merge Track');
                localizeValue.setLocale(this.owner.locale);
                this.alertDialog = DialogUtility.alert({
                    title: tiltle,
                    content: content,
                    showCloseIcon: true,
                    okButton: {
                        text: 'Ok', click: this.onConfirmedTableCellsDeletion.bind(this, table, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction, isRowSelected, action)
                    },
                    closeOnEscape: true, position: { X: 'center', Y: 'center' },
                    animationSettings: { effect: 'Zoom' }
                });
            } else {

                this.onConfirmedTableCellsDeletion(table, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction, isRowSelected, action);
            }
        } else {

            this.onConfirmedTableCellsDeletion(table, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction, isRowSelected, action);
        }
    }
    /**
     * @private
     */
    public removeDeletedCellRevision(row: TableRowWidget): any {
        if (row.rowFormat.revisions.length > 0) {
            this.unlinkRangeFromRevision(row.rowFormat, true);
        }
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = row.childWidgets[i] as TableCellWidget;
            for (let j: number = 0; j < cellWidget.childWidgets.length; j++) {
                let paraWidget: ParagraphWidget = cellWidget.childWidgets[j] as ParagraphWidget;
                if (!isNullOrUndefined(paraWidget) && paraWidget instanceof ParagraphWidget) {
                    for (let lineIndex: number = 0; lineIndex < paraWidget.childWidgets.length; lineIndex++) {
                        let lineWidget: LineWidget = paraWidget.childWidgets[lineIndex] as LineWidget;
                        if (!isNullOrUndefined(lineWidget.children)) {
                            for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                                let element: ElementBox = lineWidget.children[elementIndex];
                                if (element.revisions.length > 0) {
                                    this.unlinkRangeFromRevision(element, true);
                                }
                            }
                        }
                    }
                    this.unlinkRangeFromRevision(paraWidget.characterFormat, true);
                }
            }
        }
    }


    private onConfirmedTableCellsDeletion(table: TableWidget, selection: Selection, startRowIndex: number, endRowIndex: number, startColumnIndex: number, endColumnIndex: number, isDeleteCells: boolean, editAction: number, isRowSelected: boolean, action: Action): any {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let canRemoveRow: boolean = false;
            if (row.index >= startRowIndex && row.index <= endRowIndex) {
                if (this.owner.enableTrackChanges && !this.skipTracking()) {
                    if (isRowSelected) {
                        canRemoveRow = this.trackRowDeletion(row, false);
                        if (canRemoveRow) {

                            this.onConfirmedCellDeletion(row, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction);
                        }
                    } else {

                        this.onConfirmedCellDeletion(row, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction);
                    }
                } else {

                    this.onConfirmedCellDeletion(row, selection, startRowIndex, endRowIndex, startColumnIndex, endColumnIndex, isDeleteCells, editAction);
                }
            }
            if (!canRemoveRow && row.childWidgets.length === 0) {
                let rowToRemove: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                let prevRenderedRow: TableRowWidget = rowToRemove.previousRenderedWidget as TableRowWidget;
                while (!isNullOrUndefined(prevRenderedRow)) {
                    for (let k: number = 0; k < prevRenderedRow.childWidgets.length; k++) {
                        let cell: TableCellWidget = prevRenderedRow.childWidgets[k] as TableCellWidget;
                        if (rowToRemove.rowIndex < cell.ownerRow.rowIndex + cell.cellFormat.rowSpan) {
                            cell.cellFormat.rowSpan--;
                        }
                    }
                    prevRenderedRow = prevRenderedRow.previousRenderedWidget as TableRowWidget;
                }
                this.updateNextBlocksIndex(rowToRemove, false);
                table.childWidgets.splice(i, 1);
                i--;
                endRowIndex--;
            }
        }
        //Layouts the table after delete cells.
        selection.owner.isLayoutEnabled = true;
        if (table.childWidgets.length === 0) {
            selection.editPosition = this.selection.getHierarchicalIndex(table, '0');
            this.setActionInternal(selection, action);
            this.removeBlock(table);
        } else {
            // Before lay outing need to update table grid.
            table.isGridUpdated = false;
            table.buildTableColumns();
            table.isGridUpdated = true;
            this.documentHelper.layout.reLayoutTable(table);
        }
        if (!isNullOrUndefined(this.alertDialog)) {
            let textPosition: TextPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
            selection.selectContent(textPosition, true);
            this.reLayout(selection);
            this.alertDialog.close();
            this.alertDialog = undefined;
        }
    }

    private onConfirmedCellDeletion(row: TableRowWidget, selection: Selection, startRowIndex: number, endRowIndex: number, startColumnIndex: number, endColumnIndex: number, isDeleteCells: boolean, editAction: number): void {
        let isStarted: boolean = false;
        let isCellCleared: boolean = false;
        this.removeDeletedCellRevision(row);
        for (let j: number = 0; j < row.childWidgets.length; j++) {
            let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
            //this.removeRevisionForCell(cell, true);
            if (cell.columnIndex >= startColumnIndex && cell.columnIndex <= endColumnIndex) {
                if (!isStarted) {
                    this.updateEditPosition(cell, selection);
                    isStarted = true;
                }
                if (isDeleteCells) {
                    //Specific for Backspace and Cut if selection includes all rows.
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    this.updateNextBlocksIndex(cell, false);
                    row.childWidgets.splice(j, 1);
                    j--;
                } else if (editAction < 4) {
                    isCellCleared = this.deleteCell(cell, selection, editAction, false);
                }
            }
        }
    }

    private removeRevisionForRow(rowWidget: TableRowWidget): any {
        if (rowWidget.rowFormat.revisions.length > 0 && this.skipTracking()) {
            this.unlinkRangeFromRevision(rowWidget.rowFormat, true);
            this.addRemovedRevisionInfo(rowWidget.rowFormat, undefined);
        }
    }

    private removeRevisionsInRow(rowWidget: TableRowWidget): any {
        if (rowWidget.rowFormat.revisions.length > 0) {
            for (let i: number = 0; i < rowWidget.rowFormat.revisions.length; i++) {
                let rowRevision: Revision = rowWidget.rowFormat.revisions[i];
                this.unlinkWholeRangeInRevision(rowWidget.rowFormat, rowRevision);
            }
        }
    }
    /**
     * @private
     */
    public removeRevisionForCell(cellWidget: TableCellWidget, removeCollection: boolean): any {
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            if (cellWidget.childWidgets[i] instanceof ParagraphWidget) {
                let paraWidget: ParagraphWidget = cellWidget.childWidgets[i] as ParagraphWidget;
                for (let lineIndex: number = 0; lineIndex < paraWidget.childWidgets.length; lineIndex++) {
                    let lineWidget: LineWidget = paraWidget.childWidgets[lineIndex] as LineWidget;
                    for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                        let currentElement: ElementBox = lineWidget.children[elementIndex];
                        if (!isNullOrUndefined(currentElement) && currentElement.revisions.length > 0) {
                            this.unlinkRangeFromRevision(currentElement, removeCollection);
                            this.addRemovedRevisionInfo(currentElement, undefined);
                        }
                    }
                }
            } else if (cellWidget.childWidgets[i] instanceof TableWidget) {
                this.removeRevisionForInnerTable(cellWidget.childWidgets[i] as TableWidget);
            }
        }
    }
    private removeRevisionForInnerTable(tableWidget: TableWidget): any {
        if (tableWidget.childWidgets.length > 0) {
            for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
                let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
                if (!isNullOrUndefined(row)) {
                    this.removeRevisionForRow(row);
                }
            }
        }
    }
    /**
     * @private
     */
    public removeRevisionForBlock(paraWidget: ParagraphWidget, revision: Revision, skipParaMark: boolean, addToRevisionInfo: boolean): any {
        if (paraWidget.characterFormat.revisions.length > 0 && !skipParaMark) {
            if (addToRevisionInfo) {
                this.addRemovedRevisionInfo(paraWidget.characterFormat, undefined, false);
            }
            if (isNullOrUndefined(revision)) {
                this.unlinkRangeFromRevision(paraWidget.characterFormat, true);
            } else {
                this.unlinkRangeByRevision(paraWidget.characterFormat, revision);
            }
            paraWidget.characterFormat.revisions = [];
        }
        if (!isNullOrUndefined(paraWidget)) {
            for (let lineIndex: number = 0; lineIndex < paraWidget.childWidgets.length; lineIndex++) {
                let lineWidget: LineWidget = paraWidget.childWidgets[lineIndex] as LineWidget;
                for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                    let currentElement: ElementBox = lineWidget.children[elementIndex];
                    if (!isNullOrUndefined(currentElement) && currentElement.revisions.length > 0) {
                        if (addToRevisionInfo) {
                            this.addRemovedRevisionInfo(currentElement, undefined, false);
                        }
                        if (isNullOrUndefined(revision)) {
                            this.unlinkRangeFromRevision(currentElement, true);
                        } else {
                            this.unlinkRangeByRevision(currentElement, revision);
                        }
                        currentElement.revisions = [];
                    }
                }
            }
        }
    }
    private unlinkRangeByRevision(item: any, revision: Revision): any {
        for (let i: number = 0; i < item.revisions.length; i++) {
            let currentRevision: Revision = item.revisions[i];
            if (currentRevision.author === revision.author && currentRevision.revisionType === revision.revisionType) {
                item.revisions.splice(item.revisions.indexOf(revision), 1);
                let rangeIndex: number = revision.range.indexOf(item);
                revision.range.splice(rangeIndex, 1);
            }
        }
    }
    private isWholeRowSelected(ownerRow: TableRowWidget, startColumnIndex: number, endColumnIndex: number): boolean {
        let columnCount: number = startColumnIndex + endColumnIndex;
        if (startColumnIndex === 0 && ownerRow.childWidgets.length - 1 === columnCount) {
            return true;
        }
        return false;
    }
    private deleteCell(cell: TableCellWidget, selection: Selection, editAction: number, copyChildToClipboard: boolean): boolean {
        //Checks whether this is last paragraph of owner textbody.
        let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
        let bookmarkCollection: ElementBox[] = [];
        if (cell.childWidgets.length === 1 && block instanceof ParagraphWidget && (block as ParagraphWidget).isEmpty()) {
            return false;
        }
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            block = cell.childWidgets[i] as BlockWidget;
            if (editAction < 4) {
                //Checks whether this is last paragraph of owner textbody.
                if (block instanceof ParagraphWidget && cell.childWidgets.length === 1) {
                    //Preserves empty paragraph, to ensure minimal content.
                    let paragraph: ParagraphWidget = block as ParagraphWidget;
                    bookmarkCollection = this.paragrapghBookmarkCollection(paragraph, bookmarkCollection);
                    //Removes all the inlines in the paragraph.
                    for (let j: number = 0; j < paragraph.childWidgets.length; j++) {
                        let inline: LineWidget = paragraph.childWidgets[j] as LineWidget;
                        for (let k: number = 0; k < inline.children.length; k++) {
                            let element: ElementBox = inline.children[k];
                            this.unLinkFieldCharacter(element);
                            inline.children.splice(k, 1);
                            // this.layoutInlineCollection(true, paragraph.inlines.indexOf(inline), paragraph.inlines, inline);
                            k--;
                            if (this.checkClearCells(selection)) {
                                this.addRemovedNodes(element);
                            }
                        }
                        if (paragraph.childWidgets.length > 1) {
                            paragraph.childWidgets.splice(j, 1);
                            j--;
                        }
                    }
                    if (this.checkClearCells(selection)) {
                        //Add Index for line Widget
                        selection.editPosition = this.selection.getHierarchicalIndex(paragraph, '0');
                        this.updateHistoryPosition(selection.editPosition, true);
                    }
                    break;
                }
                if (block instanceof ParagraphWidget) {
                    bookmarkCollection = this.paragrapghBookmarkCollection(block, bookmarkCollection);
                }
                this.removeBlock(block);
                i--;
                if (this.checkClearCells(selection)) {
                    this.addRemovedNodes(block);
                }
            }
        }
        for (let j: number = 0; j < bookmarkCollection.length; j++) {
            ((cell.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.push(bookmarkCollection[j]);
            ((cell.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children.push((bookmarkCollection[j] as BookmarkElementBox).reference);
            bookmarkCollection[j].line = (cell.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
            (bookmarkCollection[j] as BookmarkElementBox).reference.line = (cell.childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget;
            this.documentHelper.bookmarks.add((bookmarkCollection[j] as BookmarkElementBox).name, bookmarkCollection[j] as BookmarkElementBox);
        }
        return true;
    }
    private paragrapghBookmarkCollection(block: ParagraphWidget, existingBookmark: ElementBox[]): ElementBox[] {
        let bookmarkCol: Dictionary<string, BookmarkElementBox> = this.documentHelper.bookmarks;
        for (let i: number = 0; i < bookmarkCol.length; i++) {
            let bookmark: BookmarkElementBox = this.documentHelper.bookmarks.get(bookmarkCol.keys[i]);
            if (bookmark.paragraph === block) {
                existingBookmark.push(bookmark);
            }
        }
        return existingBookmark;
    }
    private deleteContainer(cell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let ownerTable: TableWidget = cell.ownerTable;
        if (selection.containsRow(ownerTable.lastChild as TableRowWidget, end.paragraph.associatedCell)) {
            this.deleteContent(ownerTable, selection, editAction);
        } else {
            if (this.toCheckForTrack(ownerTable)) {
                for (let i: number = 0; i < ownerTable.childWidgets.length; i++) {
                    let inline: TableRowWidget = ownerTable.childWidgets[i] as TableRowWidget;
                    this.trackRowDeletion(inline);
                    if (end.paragraph.isInsideTable && selection.containsRow(inline, end.paragraph.associatedCell)) {
                        this.documentHelper.layout.reLayoutTable(ownerTable);
                        return;
                    }
                }
            } else {
                for (let i: number = 0; i < ownerTable.childWidgets.length; i++) {
                    let row: TableRowWidget = ownerTable.childWidgets[i] as TableRowWidget;
                    if (editAction < 4) {
                        this.updateNextBlocksIndex(row, false);
                        ownerTable.childWidgets.splice(i, 1);
                        this.addRemovedNodes(row);
                        i--;
                    }
                    if (end.paragraph.isInsideTable && selection.containsRow(row, end.paragraph.associatedCell)) {
                        this.documentHelper.layout.reLayoutTable(ownerTable);
                        return;
                    }
                }
            }
        }
    }
    private deleteTableBlock(table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        if (start.paragraph.isInsideTable && table.contains(start.paragraph.associatedCell)) {
            let block: BlockWidget = table.previousRenderedWidget as BlockWidget;

            let previousBlock: ParagraphWidget = this.checkAndInsertBlock(table, start, end, editAction, block instanceof ParagraphWidget ? block : undefined);
            if (selection.containsRow((table.firstChild as TableRowWidget), start.paragraph.associatedCell)) {
                this.deleteContent(table, selection, editAction);
            } else {
                if (this.owner.enableTrackChanges) {
                    if (isNullOrUndefined(end.paragraph.associatedCell) && !end.paragraph.isInsideTable) {
                        let previousChild: TableCellWidget = end.paragraph.previousRenderedWidget.lastChild as TableCellWidget;
                        let endCells: TableCellWidget = previousChild.lastChild as TableCellWidget;
                        this.deleteCellsInTable(table, selection, start, end, editAction, endCells);
                    }
                } else {
                    let newTable: TableWidget = this.splitTable(table, start.paragraph.associatedCell.ownerRow);
                    this.deleteContent(table, selection, editAction);
                    this.documentHelper.layout.layoutBodyWidgetCollection(newTable.index, newTable.containerWidget, newTable, false);
                }
            }
            if (!isNullOrUndefined(previousBlock)) {
                selection.editPosition = this.selection.getHierarchicalIndex(previousBlock, '0');
                if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                    this.editorHistory.currentBaseHistoryInfo.endPosition = selection.editPosition;
                }
            }
        } else {
            let blockAdv: BlockWidget = table.previousRenderedWidget as BlockWidget;
            let sectionAdv: BodyWidget = table.bodyWidget instanceof BodyWidget ? table.bodyWidget : undefined;
            if (this.owner.enableTrackChanges) {
                for (let i: number = 0; i < table.childWidgets.length; i++) {
                    this.trackRowDeletion(table.childWidgets[i] as TableRowWidget);
                }

            } else {
                this.deleteContent(table, selection, editAction);
            }
            if (!isNullOrUndefined(blockAdv)) {
                // let nextSection: WSection = blockAdv.section instanceof WSection ? blockAdv.section as WSection : undefined;
                // if (sectionAdv !== nextSection) {
                //     this.deleteSection(selection, sectionAdv, nextSection, editAction);
                // }
                //Goto the next block.
                this.deleteBlock(blockAdv, selection, start, end, editAction);
            }
        }
    }
    private splitTable(table: TableWidget, splitEndRow: TableRowWidget): TableWidget {
        let newTable: TableWidget = new TableWidget();
        newTable.tableFormat.copyFormat(table.tableFormat);
        newTable.index = table.index;
        //Moves the rows to new table.
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row === splitEndRow) {
                break;
            }
            newTable.childWidgets.push(row);
            row.containerWidget = newTable;
            table.childWidgets.splice(i, 1);
            i--;
        }
        //Inserts new table in the current text position.
        let insertIndex: number = table.getIndex();
        table.containerWidget.childWidgets.splice(insertIndex, 0, newTable);
        newTable.containerWidget = table.containerWidget;
        this.updateNextBlocksIndex(newTable, true);
        return newTable;
    }
    private updateEditPosition(cell: TableCellWidget, selection: Selection): void {
        let firstParagraph: ParagraphWidget = selection.getFirstParagraphInCell(cell);
        selection.editPosition = this.selection.getHierarchicalIndex(firstParagraph, '0');
    }

    private deleteContent(table: TableWidget, selection: Selection, editAction: number): void {
        if (editAction < 4) {
            this.removeBlock(table);
            this.addRemovedNodes(table);
        }
    }

    private setActionInternal(selection: Selection, action: Action): void {
        if (this.documentHelper.owner.enableHistoryMode && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.editorHistory.currentBaseHistoryInfo.action = action;
        }
    }
    private checkClearCells(selection: Selection): boolean {

        return this.editorHistory && this.editorHistory.currentBaseHistoryInfo && this.editorHistory.currentBaseHistoryInfo.action !== 'ClearCells';
    }
    private isEndInAdjacentTable(paragraph: ParagraphWidget, endParagraph: ParagraphWidget): boolean {
        let start: string = this.selection.getHierarchicalIndex(paragraph, '');
        let end: string = this.selection.getHierarchicalIndex(endParagraph, '');
        let selectionStart: string[] = start.split(';');
        let selectionEnd: string[] = end.split(';');
        return selectionStart.length < selectionEnd.length;
    }
    /**
     * @private
     * @param table
     * @returns {TableWidget}
     */
    public cloneTableToHistoryInfo(table: TableWidget): TableWidget {
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            //Clones the entire table to preserve in history.
            let clonedTable: TableWidget = table.clone() as TableWidget;
            //Preserves the cloned table in history info, for future undo operation.
            this.editorHistory.currentBaseHistoryInfo.removedNodes.push(clonedTable);
            //Sets the insert position in history info as current table.
            if (this.documentHelper.selection.start.paragraph.isInsideTable &&
                this.documentHelper.selection.start.paragraph.associatedCell.ownerTable === table) {
                this.updateHistoryPosition(this.selection.getHierarchicalIndex(table, '0'), true);
            }

            return clonedTable;
        }
        return undefined;
    }

    private insertParagraphPaste(paragraph: ParagraphWidget, currentParagraph: ParagraphWidget, start: TextPosition, end: TextPosition, isCombineNextParagraph: boolean, editAction: number): void {

        if (this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing) && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo) && this.editorHistory.currentBaseHistoryInfo.action === 'Paste') {
            let nextParagraph: ParagraphWidget = this.selection.getNextParagraphBlock(currentParagraph);
            if (nextParagraph) {
                if (start.offset > 0 && nextParagraph === end.paragraph && paragraph === start.paragraph
                    && this.editorHistory.currentBaseHistoryInfo.action === 'Paste') {
                    //Combines the current paragraph with end paragraph specific for undo/redo paste action.
                    let insertIndex: number = 0;
                    this.removeBlock(currentParagraph);
                    this.documentHelper.layout.clearListElementBox(nextParagraph);
                    this.documentHelper.layout.clearListElementBox(currentParagraph);
                    for (let i: number = 0; i < currentParagraph.childWidgets.length; i++) {
                        let line: LineWidget = currentParagraph.childWidgets[i] as LineWidget;
                        nextParagraph.childWidgets.splice(insertIndex, 0, line);
                        currentParagraph.childWidgets.splice(i, 1);
                        i--;
                        insertIndex++;
                        line.paragraph = nextParagraph;
                    }
                    this.documentHelper.layout.reLayoutParagraph(nextParagraph, 0, 0);
                    isCombineNextParagraph = false;
                    let offset: string = this.selection.editPosition.substring(this.selection.editPosition.lastIndexOf(';') + 1);
                    this.selection.editPosition = this.selection.getHierarchicalIndex(nextParagraph, offset);
                }
            }
        }
        if (isCombineNextParagraph) {
            this.deleteParagraphMark(currentParagraph, this.selection, editAction);
        }
    }

    private removeInlines(paragraph: ParagraphWidget, startLine: LineWidget, startOffset: number, endLine: LineWidget, endOffset: number, editAction: number): void {
        let isRemoved: boolean = false;
        this.documentHelper.layout.clearListElementBox(paragraph);
        let startIndex: number = paragraph.childWidgets.indexOf(startLine);
        let startPosition: TextPosition = this.selection.start.clone();
        let endPosition: TextPosition = this.selection.end.clone();
        let editPosition: string = this.selection.editPosition;
        for (let i: number = paragraph.childWidgets.length - 1; i >= 0; i--) {
            let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (startLine === lineWidget && endLine === lineWidget) {
                this.removeContent(lineWidget, startOffset, endOffset, editAction);
                isRemoved = true;
                break;
            }
            if (endLine === lineWidget) {
                isRemoved = true;
                this.removeContent(lineWidget, 0, endOffset, editAction);
            } else if (startLine === lineWidget) {
                this.removeContent(lineWidget, startOffset, this.documentHelper.selection.getLineLength(lineWidget), editAction);
                break;
            } else if (isRemoved) {
                this.removeContent(lineWidget, 0, this.documentHelper.selection.getLineLength(lineWidget), editAction);
            }
        }
        if (this.owner.enableTrackChanges && !this.skipTracking()) {
            this.selection.start.setPositionInternal(startPosition);
            this.selection.end.setPositionInternal(endPosition);
            if (this.editorHistory.currentBaseHistoryInfo && this.editorHistory.currentBaseHistoryInfo.action === 'Delete') {
                if (startPosition.offset > endPosition.offset) {
                    endPosition = startPosition;
                }
                let parInfo: ParagraphInfo = this.selection.getParagraphInfo(endPosition);
                editPosition = this.selection.getHierarchicalIndex(parInfo.paragraph, parInfo.offset.toString());
            }
            if (this.skipReplace) {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = undefined;
                this.updateInsertPosition();
            }
            this.selection.editPosition = editPosition;
        }
        if (isRemoved) {
            this.removeEmptyLine(paragraph);
            this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0);
        }
    }
    private skipTracking(): boolean {
        if (!isNullOrUndefined(this.editorHistory) && (this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            return true;

        } else if (!isNullOrUndefined(this.editorHistory) && this.editorHistory.currentBaseHistoryInfo && (this.editorHistory.currentBaseHistoryInfo.action === 'Reject Change' || this.editorHistory.currentBaseHistoryInfo.action === 'Accept Change')) {
            return true;
        }
        return false;
    }
    private canHandleDeletion(): boolean {

        if (!isNullOrUndefined(this.editorHistory) && this.editorHistory.currentBaseHistoryInfo && (this.editorHistory.currentBaseHistoryInfo.action === 'DeleteRow')) {
            return true;
        }
        return false;
    }
    /**
     * 
     * @param comment 
     * Deletes comment start and end markers along with its comment widgets.
     */
    private deleteCommentInSelection(comment: CommentElementBox) {
        //if comment end mark is in selection, both comment start and end markers will get deleted along with its comment widgets.
        let curentBaseHistoryInfo: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo && !this.editorHistory.currentHistoryInfo
            && !(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            this.initComplexHistory('DeleteCommentInline');
        }
        this.deleteCommentInternal(comment);
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            if (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
                this.editorHistory.currentHistoryInfo.addModifiedAction(curentBaseHistoryInfo);
            }
            this.selection.editPosition = curentBaseHistoryInfo.insertPosition;
            this.editorHistory.currentHistoryInfo.insertPosition = this.selection.editPosition;
            this.editorHistory.currentBaseHistoryInfo = curentBaseHistoryInfo;
        }
    }
    /**
     * @private
     */
    public removeContent(lineWidget: LineWidget, startOffset: number, endOffset: number, editAction?: number): void {
        let count: number = this.selection.getLineLength(lineWidget);
        let isBidi: boolean = lineWidget.paragraph.paragraphFormat.bidi;
        let startText: any = undefined;
        let textCount: number = 0;
        let lastText: any = undefined;
        let cmtStartToRemove: CommentCharacterElementBox[] = [];
        let removedCommentEnd: CommentCharacterElementBox[] = [];
        for (let i: number = isBidi ? 0 : lineWidget.children.length - 1; isBidi ? i < lineWidget.children.length : i >= 0; isBidi ? i++ : i--) {
            let inline: ElementBox = lineWidget.children[i];
            if (isNullOrUndefined(editAction) || editAction !== 2) {
                for (let k: number = 0; k < lineWidget.children.length; k++) {
                    let elementbox: ElementBox = lineWidget.children[k];
                    if (elementbox instanceof TextElementBox) {
                        let text: any = elementbox.text;
                        if (text.length + textCount > startOffset && !(textCount > startOffset)) {
                            startText = text[startOffset - textCount - 1];
                            if (isNullOrUndefined(startText) && (startOffset - textCount) === 0) {
                                startText = lastText;
                            }
                        }
                        // tslint:disable-next-line:max-line-length
                        if (text.length + textCount > endOffset) {
                            if ((text[endOffset - textCount] === ' ' && startOffset === 0) || (startText === ' ' && text[endOffset - textCount] === ' ')) {
                                endOffset += 1;
                            }
                        }
                        lastText = text[text.length - 1];
                    }
                    textCount += elementbox.length;
                }
            }
            if (endOffset <= count - inline.length) {
                count -= inline.length;
                continue;
            }
            let endIndex: number = inline.length;
            if (count > endOffset && (count - endIndex < endOffset)) {
                endIndex = endOffset - (count - inline.length);
            }

            let startIndex: number = 0;
            if (count - inline.length < startOffset) {
                startIndex = startOffset - (count - inline.length);
            }
            if (count > endOffset) {
                count -= (inline.length - endIndex);
            }
            if (startIndex === 0 && endIndex === inline.length) {
                if (!(this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing))) {
                    if (inline instanceof BookmarkElementBox) {
                        this.removedBookmarkElements.push(inline);
                    }
                    if (!this.isCmtDeleteStarted && inline instanceof CommentCharacterElementBox && inline.commentType === 1) {
                        // if (this.selection.isElementInSelection(inline.comment.commentStart)){
                        //     // count -= inline.comment.commentStart.length + inline.comment.commentEnd.length;
                        //     i--;
                        //     // if (!inline.comment.isReply) {
                        //     //     for (var z = 0; z < inline.comment.replyComments.length; z++) {
                        //     //         count -= inline.comment.replyComments[z].commentStart.length;
                        //     //         i--;
                        //     //     }
                        //     // }
                        // }
                        this.deleteCommentWidgetInline(inline);
                        removedCommentEnd.push(inline);                      
                    }
                }
                if (!this.isCmtDeleteStarted && inline instanceof CommentCharacterElementBox &&
                    inline.commentType == 0 && (removedCommentEnd.indexOf(inline.comment.commentEnd) === -1) &&
                    this.editorHistory && (!(this.editorHistory && this.editorHistory.currentHistoryInfo)
                        || this.editorHistory && this.editorHistory.currentHistoryInfo
                        && this.editorHistory.currentHistoryInfo.action != 'DeleteComment')) {
                    this.skipCommentCharacter(inline);
                    if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
                        this.editorHistory.currentHistoryInfo.insertPosition = this.selection.editPosition;
                    }
                    startOffset++;
                    continue;
                }
                if (inline instanceof BookmarkElementBox) {
                    if (this.documentHelper.bookmarks.containsKey(inline.name)) {
                        this.documentHelper.bookmarks.remove(inline.name);
                    }
                }
                if (inline instanceof ShapeBase && inline.textWrappingStyle !== 'Inline') {
                    this.removeAutoShape(inline);
                }
                //clear form field revisions if it is intentionally deleted.
                if (this.skipFieldDeleteTracking && inline.revisions.length > 0) {
                    let fieldInline: ElementBox = inline;
                    if (fieldInline instanceof FieldElementBox) {
                        if (fieldInline.fieldType === 1 || fieldInline.fieldType === 2) {
                            fieldInline = fieldInline.fieldBegin;
                        }
                        this.clearFieldElementRevisions(fieldInline, inline.revisions);
                    }
                }
                if (this.canHandleDeletion() || (this.owner.enableTrackChanges && !this.skipTracking() && !this.skipFieldDeleteTracking)) {
                    if (!this.skipTableElements) {
                        this.addRemovedNodes(inline.clone());
                    }
                    this.handleDeleteTracking(inline, startOffset, endOffset, i);
                } else {
                    // if (editAction < 4) {                    
                    this.unLinkFieldCharacter(inline);
                    this.unlinkRangeFromRevision(inline, true);
                    this.addRemovedRevisionInfo(inline, undefined);
                    this.addRemovedNodes(inline);
                    lineWidget.children.splice(i, 1);
                }
                if (isBidi) {
                    if (this.isSkipHistory) {
                        i--;
                    } else {
                        i++;
                    }
                }
                // }
            } else if (inline instanceof TextElementBox) {
                let span: ElementBox = this.handleDeleteTracking(inline, startIndex, endIndex);
                //if (editAction < 4) {
                // let span: TextElementBox = new TextElementBox();
                // span.characterFormat.copyFormat(inline.characterFormat);
                // span.text = inline.text.substr(startIndex, endIndex - startIndex);
                // for (let i = inline.revisions.length - 1; i >= 0; i--) {
                //     let revision: Revision = inline.revisions[i];
                //     let splittedRange: object[] = this.splitRevisionByElement(inline, revision);
                //     this.insertRevision(span, revision.revisionType, revision.author, revision.date, splittedRange);
                // }
                // inline.text = inline.text.slice(0, startIndex) + inline.text.slice(endIndex);
                if (!isNullOrUndefined(span)) {
                    if (!this.skipTableElements) {
                        if (inline.revisions.length > 0) {
                            this.addRemovedRevisionInfo(inline, span as TextElementBox);
                        }
                        this.addRemovedNodes(span);
                    }
                }
                // else {

                //     this.insertTextInternal(span.text, false, 'Deletion');
                //     this.editorHistory.currentBaseHistoryInfo.revisionToRemove = inline.revisions[inline.revisions.length - 1];
                //     // let info: ElementInfo = this.selection.start.currentWidget.getInline(startOffset +1, 0);
                //     // let element: ElementBox = info.element.clone();
                //     //this.addRemovedNodes(span);
                // }
            }
            if (inline instanceof FootnoteElementBox) {
                if (inline.footnoteType === 'Footnote') {
                    this.removeFootnote(inline);
                } else {
                    this.removeEndnote(inline);
                }
            }
            if (startOffset >= count - (endIndex - startIndex)) {
                break;
            }
            count -= (endIndex - startIndex);
            this.documentHelper.layout.clearListElementBox(lineWidget.paragraph);
        }
        cmtStartToRemove = [];
        removedCommentEnd = [];
        if (this.editorHistory && this.editorHistory.currentHistoryInfo && this.removeCommentCharacters.length == 0 && !this.isCmtDeleteStarted && !(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }
    /**
     * 
     * @param inline 
     * Skips comment start marker, if its end marker is not in selection.
     */
    private skipCommentCharacter(inline: CommentCharacterElementBox) {
        let curentHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
        // Initialized a complex history and skipped comment start marker position is recorded as a new action, 
        // since its comment end mark is not in selection.
        if (this.editorHistory.currentBaseHistoryInfo && !this.editorHistory.currentHistoryInfo
            && !(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
            this.initComplexHistory('SkipCommentInline');
            this.editorHistory.updateHistory();
            this.initHistory(curentHistoryInfo.action);
        }
        if (this.editorHistory.currentHistoryInfo && this.editorHistory.currentHistoryInfo.action !== 'DeleteComment') {
            if (!(this.editorHistory.isUndoing || this.editorHistory.isRedoing)) {
                let offset: number = inline.line.getOffset(inline, 1);
                var startPosition = new TextPosition(this.owner);
                startPosition.setPositionParagraph(inline.line, offset);
                let startOff: string = this.selection.getHierarchicalIndexByPosition(startPosition);
                if (this.selection.isForward) {
                    this.editorHistory.currentBaseHistoryInfo.selectionEnd = startOff;
                    curentHistoryInfo.selectionStart = startOff;
                    this.editorHistory.currentHistoryInfo.selectionEnd = curentHistoryInfo.selectionEnd;
                } else {
                    this.editorHistory.currentBaseHistoryInfo.selectionStart = startOff;
                    curentHistoryInfo.selectionEnd = startOff;
                    this.editorHistory.currentHistoryInfo.selectionStart = curentHistoryInfo.selectionStart;
                }
                curentHistoryInfo.insertPosition = this.selection.isForward ? curentHistoryInfo.selectionStart : curentHistoryInfo.selectionEnd;
                curentHistoryInfo.endPosition = curentHistoryInfo.insertPosition;
                this.editorHistory.currentHistoryInfo.insertPosition = curentHistoryInfo.insertPosition;
                let baseHstry: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
                baseHstry.insertPosition = this.selection.isForward ? baseHstry.selectionStart : baseHstry.selectionEnd;
                baseHstry.endPosition = baseHstry.insertPosition;
                this.editorHistory.currentHistoryInfo.addModifiedAction(baseHstry);
            }
        }
    }
    /**
     * Deletes comment widgets from comment pane along with history preservation.
     */
    private deleteCommentWidgetInline(inline: CommentCharacterElementBox): void {
        let curentBaseHistoryInfo: BaseHistoryInfo = this.editorHistory.currentBaseHistoryInfo;
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo && !this.editorHistory.currentHistoryInfo) {
            this.initComplexHistory('DeleteCommentInline');
        }
        if (!this.selection.isElementInSelection(inline.comment.commentStart)) {
            this.removeCommentCharacters.push(inline.comment.commentStart);
        }
        this.deleteCommentWidgetInternal(inline.comment);
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            // let index = this.editorHistory.currentHistoryInfo.modifiedActions.indexOf(curentHistoryInfo);
            // this.editorHistory.currentHistoryInfo.modifiedActions.push(this.editorHistory.currentHistoryInfo.modifiedActions.splice(index, 1)[0]);
            let lstActionHistoryInfo: HistoryInfo = this.editorHistory.currentHistoryInfo;
            let frstAction: BaseHistoryInfo = lstActionHistoryInfo.modifiedActions[0];
            // if (frstAction.action === "DeleteCommentWidget" && frstAction.removedNodes[0] instanceof CommentElementBox
            //     && !(frstAction.removedNodes[0] as CommentElementBox).isReply && (lstActionHistoryInfo.modifiedActions[1].action === "DeleteCommentWidget")) {
            //     // index = this.editorHistory.currentHistoryInfo.modifiedActions.indexOf(curentHistoryInfo);
            //     // this.editorHistory.currentHistoryInfo.modifiedActions.splice(index - 1, 0, this.editorHistory.currentHistoryInfo.modifiedActions.splice(0, 1)[0]);
            // }
        }
        this.editorHistory.currentHistoryInfo.addModifiedAction(curentBaseHistoryInfo);
        this.editorHistory.currentBaseHistoryInfo = curentBaseHistoryInfo;
        this.selection.editPosition = curentBaseHistoryInfo.insertPosition;        
        this.editorHistory.currentHistoryInfo.insertPosition = curentBaseHistoryInfo.insertPosition;
        this.editorHistory.currentHistoryInfo.endPosition = curentBaseHistoryInfo.insertPosition;
        this.editorHistory.currentHistoryInfo.selectionStart = curentBaseHistoryInfo.selectionStart;
        this.editorHistory.currentHistoryInfo.selectionEnd = curentBaseHistoryInfo.selectionEnd;
    }

    private clearFieldElementRevisions(inline: ElementBox, revision: Revision[]): void {
        let revisions: Revision[] = revision;
        for (let i: number = 0; i < revisions.length; i++) {
            let currentRevision: Revision = revisions[i];
            for (let j: number = 0; j < currentRevision.range.length; j++) {
                if (currentRevision.range[j] === inline) {
                    for (let k: number = j; k < currentRevision.range.length; k) {

                        if (currentRevision.range[j] instanceof FieldElementBox && (currentRevision.range[j] as FieldElementBox).fieldType === 1 && (currentRevision.range[j] as FieldElementBox).fieldBegin === inline) {
                            currentRevision.removeRangeRevisionForItem(currentRevision.range[j]);
                            if (currentRevision.range.length === 0) {
                                this.owner.revisions.remove(currentRevision);
                            }
                            break;
                        }
                        currentRevision.removeRangeRevisionForItem(currentRevision.range[j]);
                    }
                }
            }
        }
    }
    private addRemovedRevisionInfo(currentElement: any, spittedElement: ElementBox, removePrevRevisions?: boolean): void {

        for (let i: number = 0; i < currentElement.revisions.length; i++) {
            let revisionId: string = currentElement.revisions[i].revisionID;
            if (!isNullOrUndefined(spittedElement)) {
                spittedElement.removedIds.push(revisionId);
            } else {
                currentElement.removedIds.push(revisionId);
            }
        }
        if (isNullOrUndefined(spittedElement) && (isNullOrUndefined(removePrevRevisions) || removePrevRevisions)) {
            currentElement.revisions = [];
        }
    }

    /**
     * @private
     * @returns {void}
     */
    public removeEmptyLine(paragraph: ParagraphWidget): void {
        if (paragraph.childWidgets.length > 1) {
            for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
                let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
                if (lineWidget.children.length === 0 && paragraph.childWidgets.length > 1) {
                    paragraph.childWidgets.splice(i, 1);
                    i--;
                }
            }
        }
    }
    //#endregion
    /**
     * Clone the list level
     *
     * @param {WListLevel} source - Specifies the source
     * @private
     * @returns {WListLevel} - Returns the list level
     */
    public cloneListLevel(source: WListLevel): WListLevel {
        let listLevel: WListLevel = new WListLevel(undefined);
        this.copyListLevel(listLevel, source);
        return listLevel;
    }
    /**
     * Copies the list level
     *
     * @param {WListLevel} destination - Specifies the destination
     * @param {WListLevel} listLevel - Specifies the list level
     * @private
     * @returns {void}
     */
    public copyListLevel(destination: WListLevel, listLevel: WListLevel): void {
        if (!isNullOrUndefined(listLevel.paragraphFormat)) {
            destination.paragraphFormat = new WParagraphFormat(destination);
            destination.paragraphFormat.copyFormat(listLevel.paragraphFormat);
        }
        if (!isNullOrUndefined(listLevel.characterFormat)) {
            destination.characterFormat = new WCharacterFormat(destination);
            destination.characterFormat.copyFormat(listLevel.characterFormat);
        }
        if (!isNullOrUndefined(listLevel.followCharacter)) {
            destination.followCharacter = listLevel.followCharacter;
        }
        if (!isNullOrUndefined(listLevel.listLevelPattern)) {
            destination.listLevelPattern = listLevel.listLevelPattern;
        }
        if (!isNullOrUndefined(listLevel.numberFormat)) {
            destination.numberFormat = listLevel.numberFormat;
        }
        if (!isNullOrUndefined(listLevel.restartLevel)) {
            destination.restartLevel = listLevel.restartLevel;
        }
        if (!isNullOrUndefined(listLevel.startAt)) {
            destination.startAt = listLevel.startAt;
        }
    }
    /**
     * Clone level override
     *
     * @param {WLevelOverride} source  @returns {void} - Specifies the level override
     * @private
     * @returns {WLevelOverride} - Returns the level overeide
     */
    public cloneLevelOverride(source: WLevelOverride): WLevelOverride {
        let levelOverride: WLevelOverride = new WLevelOverride();
        if (!isNullOrUndefined(source.startAt)) {
            levelOverride.startAt = source.startAt;
        }
        if (!isNullOrUndefined(source.overrideListLevel)) {
            levelOverride.overrideListLevel = source.overrideListLevel;
        }
        if (!isNullOrUndefined(source.levelNumber)) {
            levelOverride.levelNumber = source.levelNumber;
        }
        return levelOverride;
    }
    /**
     * Update List Paragraph
     * @private
     * @returns {void}
     */
    public updateListParagraphs(): void {
        this.documentHelper.listParagraphs = [];
        for (let j: number = 0; j < this.documentHelper.pages.length; j++) {
            let bodyWidget: BodyWidget = this.documentHelper.pages[j].bodyWidgets[0];
            for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
                this.updateListParagraphsInBlock(bodyWidget.childWidgets[i] as BlockWidget);
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public updateListParagraphsInBlock(block: BlockWidget): void {
        if (block instanceof ParagraphWidget) {
            if (!isNullOrUndefined(block.paragraphFormat)
                && !isNullOrUndefined(block.paragraphFormat.listFormat)
                && !isNullOrUndefined(block.paragraphFormat.listFormat.listId)) {
                if (isNullOrUndefined(this.documentHelper.listParagraphs)) {
                    this.documentHelper.listParagraphs = [];
                }
                this.documentHelper.listParagraphs.push(block);
            }
        } else if (block instanceof TableWidget) {
            for (let i: number = 0; i < block.childWidgets.length; i++) {
                for (let j: number = 0; j < (block.childWidgets[i] as TableRowWidget).childWidgets.length; j++) {
                    let cell: TableCellWidget = (block.childWidgets[i] as TableRowWidget).childWidgets[j] as TableCellWidget;
                    for (let k: number = 0; k < cell.childWidgets.length; k++) {
                        this.updateListParagraphsInBlock(cell.childWidgets[k] as BlockWidget);
                    }
                }
            }
        }
    }
    /**
     * Applies list format
     *
     * @param {WList} list - Specifies the list.
     * @private
     * @returns {void}
     */
    public onApplyList(list: WList): void {
        let selection: Selection = this.documentHelper.selection;
        this.setOffsetValue(this.documentHelper.selection);
        this.initHistory('ListFormat');
        let format: WListFormat = new WListFormat();
        if (!isNullOrUndefined(list)) {
            format.listId = list.listId;
        }
        this.documentHelper.owner.isShiftingEnabled = true;
        if (selection.isEmpty) {
            this.applyParaFormatProperty(selection.start.paragraph, 'listFormat', format, false);
            this.layoutItemBlock(selection.start.paragraph, false);
        } else {
            this.updateSelectionParagraphFormatting('listFormat', format, false);
        }
        this.reLayout(selection);
    }
    /**
     * Applies bullets or numbering list
     *
     * @param {string} format - Specifies the format
     * @param {ListLevelPattern} listLevelPattern - Specifies the list level patterns
     * @param {string} fontFamily - Specifies the font family.
     * @private
     * @returns {void}
     */
    public applyBulletOrNumbering(format: string, listLevelPattern: ListLevelPattern, fontFamily: string): void {
        let selection: Selection = this.documentHelper.selection;
        let list: WList = selection.paragraphFormat.getList();
        let isUpdate: boolean = false;
        let start: TextPosition = selection.start;
        if (!selection.isForward) {
            start = selection.end;
        }
        let currentParagraph: ParagraphWidget = start.paragraph;
        if (isNullOrUndefined(list)) {
            while (!isNullOrUndefined(currentParagraph.previousWidget) && currentParagraph.previousWidget instanceof ParagraphWidget
                && currentParagraph.previousWidget.isEmpty() && currentParagraph.previousWidget.paragraphFormat.listFormat.listId === -1) {
                currentParagraph = currentParagraph.previousWidget;
            }
            if (currentParagraph.previousWidget && currentParagraph.previousWidget instanceof ParagraphWidget
                && currentParagraph.previousWidget.paragraphFormat.listFormat.listId !== -1) {
                currentParagraph = currentParagraph.previousWidget;
                list = this.documentHelper.getListById(currentParagraph.paragraphFormat.listFormat.listId);
                isUpdate = true;
            }
            if (!isUpdate) {
                while (!isNullOrUndefined(currentParagraph.nextWidget) && currentParagraph.nextWidget instanceof ParagraphWidget
                    && currentParagraph.nextWidget.isEmpty() && currentParagraph.nextWidget.paragraphFormat.listFormat.listId === -1) {
                    currentParagraph = currentParagraph.nextWidget;
                }
                if (currentParagraph.nextWidget && currentParagraph.nextWidget instanceof ParagraphWidget
                    && currentParagraph.nextWidget.paragraphFormat.listFormat.listId !== -1) {
                    currentParagraph = currentParagraph.nextWidget;
                    list = this.documentHelper.getListById(currentParagraph.paragraphFormat.listFormat.listId);
                    isUpdate = true;
                }
            }
        }
        let startListLevel: WListLevel = undefined;
        let levelNumber: number = -1;
        let initialListLevel: WListLevel = undefined;
        let isSameList: boolean = false;
        if (currentParagraph.paragraphFormat.listFormat.listId !== -1 && !isNullOrUndefined(currentParagraph.paragraphFormat.listFormat.listLevel)) {
            this.listNumberFormat = currentParagraph.paragraphFormat.listFormat.listLevel.numberFormat;
            this.listLevelPattern = currentParagraph.paragraphFormat.listFormat.listLevel.listLevelPattern;
            this.listLevelNumber = currentParagraph.paragraphFormat.listFormat.listLevelNumber;
        }
        if (!isNullOrUndefined(list)) {
            levelNumber = currentParagraph.paragraphFormat.listFormat.listLevelNumber;
            let tempList: WList = this.documentHelper.getListById(currentParagraph.paragraphFormat.listFormat.listId);
            startListLevel = this.documentHelper.layout.getListLevel(tempList, levelNumber);
            if (levelNumber > 0) {
                initialListLevel = this.documentHelper.layout.getListLevel(tempList, 0);
                isSameList = !isNullOrUndefined(initialListLevel) && levelNumber > 0 && selection.start.isInSameParagraph(selection.end);
            }
            let abstractList: WAbstractList = tempList.abstractList;
            if (!abstractList) {
                abstractList = this.documentHelper.getAbstractListById(list.abstractListId);
            }
            if (abstractList.levels.length === 0) {

                startListLevel = this.documentHelper.layout.getListLevel(tempList, currentParagraph.paragraphFormat.listFormat.listLevelNumber);
            }
            if (isUpdate) {
                if (listLevelPattern !== 'Bullet' && startListLevel.listLevelPattern === listLevelPattern
                    && (startListLevel.numberFormat === format || startListLevel.numberFormat.indexOf(format) !== -1)) {
                    selection.paragraphFormat.listId = list.listId;
                    selection.paragraphFormat.listLevelNumber = levelNumber;
                    selection.paragraphFormat.setList(list);
                    return;
                } else {
                    startListLevel = abstractList.levels[0];
                }
            }
        }
        if (isNullOrUndefined(list) || (!isNullOrUndefined(list) && levelNumber === 0
            && ((startListLevel.listLevelPattern !== listLevelPattern) || startListLevel.numberFormat !== format
                || (startListLevel.characterFormat.fontFamily !== fontFamily && startListLevel.listLevelPattern === 'Bullet')))) {
            isUpdate = false;
            list = new WList();
            if (this.documentHelper.lists.length > 0) {
                list.listId = this.documentHelper.lists[this.documentHelper.lists.length - 1].listId + 1;
            } else {
                list.listId = 0;
            }
            let abstractList: WAbstractList = new WAbstractList();
            if (this.documentHelper.abstractLists.length > 0) {

                abstractList.abstractListId = this.documentHelper.abstractLists[this.documentHelper.abstractLists.length - 1].abstractListId + 1;
            } else {
                abstractList.abstractListId = 0;
            }
            list.abstractListId = abstractList.abstractListId;
            list.abstractList = abstractList;
            this.documentHelper.abstractLists.push(abstractList);
            if (format === 'bullet' || format === 'multiLevel' || format === 'numbering') {
                this.addListLevels(abstractList, format, selection);
            } else {
                let listLevel: WListLevel = new WListLevel(abstractList);
                listLevel.listLevelPattern = listLevelPattern;
                listLevel.numberFormat = format;
                if (listLevelPattern !== 'Bullet') {
                    listLevel.startAt = 1;
                } else {
                    listLevel.characterFormat.fontFamily = fontFamily;
                }
                listLevel.paragraphFormat.leftIndent = 36;
                listLevel.paragraphFormat.firstLineIndent = -18;
                abstractList.levels.push(listLevel);
                selection.paragraphFormat.listLevelNumber = 0;
            }
            selection.paragraphFormat.setList(list);
        } else if (isSameList && !isNullOrUndefined(list)) {
            let tempList: WList = this.documentHelper.getListById(currentParagraph.paragraphFormat.listFormat.listId);
            let listLevel: WListLevel = this.documentHelper.layout.getListLevel(tempList, levelNumber);
            if (listLevelPattern === 'Bullet') {
                listLevel.numberFormat = format;
                listLevel.characterFormat.fontFamily = fontFamily;
            } else {
                listLevel.listLevelPattern = listLevelPattern;
                listLevel.characterFormat.fontFamily = fontFamily;
                let currentFormat: string = listLevel.numberFormat.substring(listLevel.numberFormat.length - 1);
                if (listLevel.numberFormat.length !== format.length && levelNumber > 0) {
                    listLevel.numberFormat = format;
                } else if (format.substring(format.length - 1) !== listLevel.numberFormat.substring(listLevel.numberFormat.length - 1)) {
                    listLevel.numberFormat = listLevel.numberFormat.replace(currentFormat, format.substring(format.length - 1));
                }
            }
            selection.paragraphFormat.setList(tempList);
        } else if (!isNullOrUndefined(list) && isUpdate) {
            selection.paragraphFormat.setList(list);
        } else {
            selection.paragraphFormat.setList(undefined);
        }
    }

    private addListLevels(abstractListAdv: WAbstractList, listName: string, selection: Selection): void {
        let bulletCharacters: string[] = ['\uf076', '\uf0d8', '\uf0a7', '\uf0b7', '\uf0a8'];
        for (let i: number = abstractListAdv.levels.length; i < 9; i++) {
            let listLevel: WListLevel = new WListLevel(abstractListAdv);
            if (listName.match('bullet')) {
                listLevel.listLevelPattern = 'Bullet';
                listLevel.numberFormat = bulletCharacters[i < 5 ? i % 5 : i % 5 + 1];
                listLevel.characterFormat.fontFamily = i < 3 || i === 5 ? 'Wingdings' : 'Symbol';
            } else {
                if (listName.match('multiLevel')) {
                    for (let j: number = 0; j < i + 1; j++) {
                        listLevel.numberFormat += '%' + (j + 1).toString() + '.';
                    }
                    listLevel.listLevelPattern = 'Number';
                } else {
                    listLevel.numberFormat = '%' + (i + 1).toString() + ')';
                    listLevel.listLevelPattern = i % 3 === 0 ? 'Number'
                        : i % 3 === 1 ? 'LowLetter' : 'LowRoman';
                }
                listLevel.startAt = 1;
                listLevel.restartLevel = i;
            }
            if (i === 0) {
                listLevel.paragraphFormat.leftIndent = 36;
            } else {
                listLevel.paragraphFormat.leftIndent = 36 * i;
            }
            listLevel.paragraphFormat.firstLineIndent = -18;
            abstractListAdv.levels.push(listLevel);
            selection.paragraphFormat.listLevelNumber = i;
        }
    }
    /**
     * Insert page break at cursor position
     *
     * @returns {void}
     */
    public insertPageBreak(): void {
        if (!this.owner.isReadOnlyMode) {
            if (this.documentHelper.selection.start.paragraph.isInsideTable ||
                this.documentHelper.selection.start.paragraph.isInHeaderFooter) {
                return;
            }
            this.initComplexHistory('PageBreak');
            this.onEnter(true);
            if (this.editorHistory && this.editorHistory.currentHistoryInfo !== null) {
                this.editorHistory.updateComplexHistory();
            }
            this.selection.checkForCursorVisibility();
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onEnter(isInsertPageBreak?: boolean): void {
        let selection: Selection = this.documentHelper.selection;
        var format: SelectionCharacterFormat = new SelectionCharacterFormat(this.selection);
        if (selection.start.paragraph.paragraphFormat.baseStyle.name === 'Normal') {
            format.cloneFormat(this.selection.characterFormat);
        }
        if (this.isXmlMapped) {
            return;
        }
        if (selection.isEmpty) {
            //ToDo: Need to handle the CTRL + Enter (Page Break) and SHIFT + Enter (Line Break) behavior.
            let hyperlinkField: FieldElementBox = selection.getHyperlinkField();
            let isSelectionOnHyperlink: boolean = !isNullOrUndefined(hyperlinkField);
            if (isSelectionOnHyperlink) {
                selection.fireRequestNavigate(hyperlinkField);
                return;
            }
            let paragraph: ParagraphWidget = selection.start.paragraph;
            if (paragraph.isEmpty() && paragraph.paragraphFormat.listFormat.listId !== -1) {

                this.onApplyListInternal(this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId), paragraph.paragraphFormat.listFormat.listLevelNumber - 1);
                return;
            }
        }
        this.initHistory('Enter');
        let isRemoved: boolean = true;
        if (!selection.isEmpty) {
            // this.initHistoryWithSelection(selection, 'Enter');
            isRemoved = this.removeSelectedContents(selection);
        }
        if (isRemoved) {
            selection.owner.isShiftingEnabled = true;
            this.updateInsertPosition();
            let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
            let initialStart: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            this.splitParagraphInternal(selection, selection.start.paragraph, selection.start.currentWidget, selection.start.offset);
            this.setPositionForCurrentIndex(selection.start, initialStart);
            if (isInsertPageBreak) {
                let currentParagraph: ParagraphWidget = selection.start.paragraph;
                let breakParagraph: ParagraphWidget = new ParagraphWidget();
                breakParagraph.characterFormat.copyFormat(currentParagraph.characterFormat);
                breakParagraph.paragraphFormat.copyFormat(currentParagraph.paragraphFormat);
                let pageBreak: TextElementBox = new TextElementBox();
                pageBreak.text = '\f';
                let line: LineWidget = new LineWidget(breakParagraph);
                line.children.push(pageBreak);
                pageBreak.line = line;
                breakParagraph.childWidgets.push(line);
                if (this.owner.enableTrackChanges && currentParagraph.characterFormat.revisions.length > 0) {
                    let currentRevision: Revision = this.retrieveRevisionInOder(currentParagraph.characterFormat);
                    currentRevision.range.push(breakParagraph.characterFormat);
                    breakParagraph.characterFormat.revisions.push(currentRevision);
                    breakParagraph.characterFormat.removedIds = [];
                }
                this.insertParagraph(breakParagraph, true);
                selection.selectParagraphInternal(breakParagraph, true);
            }
            let nextNode: BlockWidget = selection.start.paragraph.nextWidget as BlockWidget;
            if (isNullOrUndefined(nextNode)) {
                nextNode = selection.getNextRenderedBlock(selection.start.paragraph);
            }
            selection.selectParagraphInternal(nextNode as ParagraphWidget, true);
            this.updateEndPosition();
            if (isInsertPageBreak && this.editorHistory) {
                this.owner.editorHistory.updateHistory();
            }
            // if (!isNullOrUndefined(selection.currentHistoryInfo)) {
            //     this.updateComplexHistory();
            // } else {
            this.reLayout(selection);

            let currentPara: ParagraphWidget = this.selection.start.paragraph.containerWidget.firstChild as ParagraphWidget;
            if (!isNullOrUndefined(currentPara)) {
                currentPara.isChangeDetected = false;
                let nextPara: ParagraphWidget = currentPara.nextRenderedWidget as ParagraphWidget;

                while (this.owner.isSpellCheck && !isNullOrUndefined(nextPara)) {
                    currentPara = nextPara;
                    currentPara.isChangeDetected = false;
                    nextPara = currentPara.nextRenderedWidget as ParagraphWidget;
                }
            }
            // }
            let paragraph: ParagraphWidget = selection.start.paragraph.previousWidget as ParagraphWidget;
            if (!isNullOrUndefined(paragraph) && !paragraph.isEmpty() &&

                (paragraph.lastChild as LineWidget).children[(paragraph.lastChild as LineWidget).children.length - 1] instanceof TextElementBox) {
                this.checkAndConvertToHyperlink(selection, true, paragraph);
            }
        }
        if (!isNullOrUndefined(selection.start.paragraph) && selection.start.paragraph.isEmpty()) {
            this.selection.characterFormat.cloneFormat(format);
        }
    }
    private splitParagraphInternal(selection: Selection, paragraphAdv: ParagraphWidget, currentLine: LineWidget, offset: number): void {
        let insertIndex: number = 0;
        let blockIndex: number = paragraphAdv.index;
        let currentPara: ParagraphWidget = paragraphAdv;
        currentPara.isChangeDetected = (offset === 0) ? true : false;
        while (this.owner.isSpellCheck && !isNullOrUndefined(currentPara.nextRenderedWidget)) {
            currentPara = currentPara.nextRenderedWidget as ParagraphWidget;
            currentPara.isChangeDetected = true;
        }
        let paragraph: ParagraphWidget = new ParagraphWidget();
        let lineWidget: LineWidget = new LineWidget(paragraph);
        paragraph.childWidgets.push(lineWidget);
        //Cop ies the format to new paragraph.
        paragraph.paragraphFormat.ownerBase = paragraph;
        paragraph.footNoteReference = paragraphAdv.footNoteReference;
        if (currentLine === paragraphAdv.lastChild && offset === selection.getLineLength(currentLine)) {

            if (paragraphAdv.paragraphFormat.baseStyle
                && paragraphAdv.paragraphFormat.baseStyle.name !== 'Normal' && paragraphAdv.paragraphFormat.baseStyle.next instanceof WParagraphStyle) {
                if (paragraphAdv.paragraphFormat.baseStyle.name === paragraphAdv.paragraphFormat.baseStyle.next.name) {
                    paragraph.paragraphFormat.copyFormat(paragraphAdv.paragraphFormat);
                    paragraph.characterFormat.copyFormat(paragraphAdv.characterFormat);
                } else {
                    paragraph.paragraphFormat.baseStyle = paragraphAdv.paragraphFormat.baseStyle.next;
                }
                this.selection.skipFormatRetrieval = false;
            } else {
                paragraph.paragraphFormat.copyFormat(paragraphAdv.paragraphFormat);
                paragraph.characterFormat.copyFormat(paragraphAdv.characterFormat);
            }
            if ((paragraphAdv.lastChild as LineWidget).children.length > 0) {
                paragraphAdv.characterFormat.copyFormat((paragraphAdv.lastChild as LineWidget).children[(paragraphAdv.lastChild as LineWidget).children.length - 1].characterFormat);
            }
            // let revisions: Revision[] = [];
            // if (paragraphAdv.characterFormat.revisions.length > 0) {
            //     revisions = paragraphAdv.characterFormat.revisions;
            // } else {
            if (this.owner.enableTrackChanges) {
                let lastLine: LineWidget = paragraphAdv.lastChild as LineWidget;
                if (!isNullOrUndefined(lastLine) && lastLine.children.length > 0) {
                    let lastElement: ElementBox = lastLine.children[lastLine.children.length - 1].previousValidNodeForTracking;
                    //ensure whether para mark can be combined with element revision
                    if (!this.checkParaMarkMatchedWithElement(lastElement, paragraphAdv.characterFormat, false, 'Insertion')) {
                        this.insertParaRevision(paragraphAdv);
                    }
                }
            }
            //}
            //ToDo in future: Need to skip copying formattings to new paragraph, if the style for following paragraph is same style.
            insertIndex++;
            blockIndex++;
        } else {
            paragraph.paragraphFormat.copyFormat(paragraphAdv.paragraphFormat);
            paragraph.characterFormat.copyFormat(paragraphAdv.characterFormat);
            if (offset > 0 || !currentLine.isFirstLine()) {
                paragraphAdv = paragraphAdv.combineWidget(this.owner.viewer) as ParagraphWidget;
                this.moveInlines(paragraphAdv, paragraph, 0, 0, paragraphAdv.firstChild as LineWidget, offset, currentLine);
                this.insertParaRevision(paragraph, paragraphAdv.firstChild as LineWidget);
            } else {
                if (this.owner.enableTrackChanges) {
                    let firstLine: LineWidget = paragraphAdv.firstChild as LineWidget;
                    let firstElement: ElementBox = firstLine.children[0].previousValidNodeForTracking;
                    //ensure whether para mark can be combined with element revision
                    if (!this.checkParaMarkMatchedWithElement(firstElement, paragraph.characterFormat, true, 'Insertion')) {
                        this.insertParaRevision(paragraph);
                    }
                }
            }
            paragraphAdv = paragraphAdv.getSplitWidgets()[0] as ParagraphWidget;
        }
        insertIndex += paragraphAdv.getIndex();
        let container: Widget = paragraphAdv.containerWidget;
        let childNodes: BlockWidget[] = container.childWidgets as BlockWidget[];
        childNodes.splice(insertIndex, 0, paragraph);

        if (this.owner.enableTrackChanges && (paragraph.characterFormat.revisions.length === 0 && paragraphAdv.characterFormat.revisions.length === 0)) {
            if (!this.checkToMatchEmptyParaMark(paragraphAdv)) {
                this.insertParaRevision(paragraphAdv);
            }
        }
        paragraph.containerWidget = container;
        paragraph.index = blockIndex;
        this.updateNextBlocksIndex(paragraph, true);

        this.documentHelper.layout.layoutBodyWidgetCollection(blockIndex, container as BodyWidget, paragraph, false);
    }

    private insertParaRevision(paragraph: ParagraphWidget, firstChild?: LineWidget): any {

        if (this.owner.enableTrackChanges && isNullOrUndefined(firstChild) && !this.isRevisionMatched(paragraph.characterFormat, 'Insertion')) {
            paragraph.characterFormat.revisions = [];
            this.insertRevision(paragraph.characterFormat, 'Insertion');
        }
        //If it is spitted para, we need to ensure whether first element of the spitted para matches with inserted revision
        if (!isNullOrUndefined(firstChild)) {
            if (firstChild.paragraph.isInsideTable) {
                this.insertRevision(paragraph.characterFormat, 'Insertion');
                return;
            }
            this.applyRevisionForParaMark(paragraph, firstChild, 'Insertion', true);
            // let firstElement: ElementBox = firstChild.children[0];
            // firstElement = firstElement.nextValidNodeForTracking;
            // let lastLine: LineWidget = paragraph.lastChild as LineWidget;

            // let lastElement: ElementBox = lastLine.children.length === 0 ? undefined : lastLine.children[lastLine.children.length - 1].previousValidNodeForTracking;
            // let isCombined: boolean = false;
            // //Ensure revision matched with inserted para mark
            // if (!isNullOrUndefined(lastElement)) {
            //     isCombined = this.checkParaMarkMatchedWithElement(lastElement, paragraph.characterFormat, true);
            // }
            // if (!isNullOrUndefined(firstElement)) {
            //     if (paragraph.characterFormat.revisions.length > 0) {
            //         if (this.isRevisionMatched(firstElement, 'Insertion')) {
            //             let revisionToInclude: Revision = paragraph.characterFormat.revisions[0];
            //             let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(firstElement.revisions, 'Insertion');
            //             for (let i: number = 0; i < matchedRevisions.length; i++) {
            //                 isCombined = true;

            //                 this.clearAndUpdateRevisons(matchedRevisions[i].range, revisionToInclude, revisionToInclude.range.indexOf(paragraph.characterFormat) + 1);
            //             }
            //         }
            //     } else {
            //         isCombined = this.checkParaMarkMatchedWithElement(firstElement, paragraph.characterFormat, false);
            //     }
            // }
            // if (!isCombined) {
            //     this.insertRevision(paragraph.characterFormat, 'Insertion');
            // }
        }
    }

    private applyRevisionForParaMark(paragraph: ParagraphWidget, firstChild: LineWidget, revisionType: RevisionType, splitRevision: boolean): any {
        let firstElement: ElementBox = firstChild.children[0];
        if (isNullOrUndefined(firstElement)) {
            return;
        }
        firstElement = firstElement.nextValidNodeForTracking;
        let lastLine: LineWidget = paragraph.lastChild as LineWidget;

        let lastElement: ElementBox = lastLine.children.length === 0 ? undefined : lastLine.children[lastLine.children.length - 1].previousValidNodeForTracking;
        let isCombined: boolean = false;
        let prevRevCount: number = paragraph.characterFormat.revisions.length;
        //Ensure revision matched with inserted para mark
        if (!isNullOrUndefined(lastElement)) {
            isCombined = this.checkParaMarkMatchedWithElement(lastElement, paragraph.characterFormat, false, revisionType);
        }
        if (!isNullOrUndefined(firstElement)) {
            //Ensure previous inserted para mark revision matched with first element of the next paragraph.
            if (paragraph.characterFormat.revisions.length > prevRevCount) {
                if (this.isRevisionMatched(firstElement, revisionType)) {
                    let revisionToInclude: Revision = paragraph.characterFormat.revisions[0];
                    let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(firstElement.revisions, revisionType);
                    for (let i: number = 0; i < matchedRevisions.length; i++) {
                        if (matchedRevisions[i] !== revisionToInclude) {
                            isCombined = true;

                            this.clearAndUpdateRevisons(matchedRevisions[i].range, revisionToInclude, revisionToInclude.range.indexOf(paragraph.characterFormat) + 1);
                        }
                    }
                }
            } else {
                isCombined = this.checkParaMarkMatchedWithElement(firstElement, paragraph.characterFormat, true, revisionType);
            }
        }
        if (!isCombined && (this.owner.enableTrackChanges || firstChild.paragraph.characterFormat.revisions.length > 0)) {
            this.insertRevision(paragraph.characterFormat, revisionType);

            // for spitted paragraph on moving content we maintain same revision, so if it not matched with inserted paragraph then we need to spit it.
            if (splitRevision && lastElement.revisions.length > 0 && firstElement.revisions.length > 0) {
                this.updateRevisionForSpittedTextElement(lastElement as TextElementBox, firstElement as TextElementBox);
            }
        }
    }
    //Combines para mark with element revision

    private checkParaMarkMatchedWithElement(lastElement: ElementBox, characterFormat: WCharacterFormat, isBegin: boolean, revisionType: RevisionType): boolean {
        let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(lastElement.revisions, revisionType);
        if (matchedRevisions.length > 0) {
            this.mapMatchedRevisions(matchedRevisions, lastElement, characterFormat, isBegin);
            return true;
        }
        return false;
    }
    private checkToMatchEmptyParaMark(paraWidget: ParagraphWidget): boolean {
        let prevPara: ParagraphWidget = paraWidget.previousRenderedWidget as ParagraphWidget;
        if (!isNullOrUndefined(prevPara) && prevPara instanceof ParagraphWidget && prevPara.characterFormat.revisions.length > 0) {
            let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(prevPara.characterFormat.revisions, 'Insertion');
            if (matchedRevisions.length > 0) {
                this.mapMatchedRevisions(matchedRevisions, prevPara.characterFormat, paraWidget.characterFormat, false);
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     * @returns {void}
     */
    public updateNextBlocksIndex(block: BlockWidget, increaseIndex: boolean): void {
        let nextIndex: number = block.containerWidget.childWidgets.indexOf(block) + 1;
        if (block.containerWidget instanceof BodyWidget) {
            let currentSectionIndex: number = (block.containerWidget as BodyWidget).index;
            for (let j: number = this.documentHelper.pages.indexOf(block.containerWidget.page); j < this.documentHelper.pages.length; j++) {
                let page: Page = this.documentHelper.pages[j];
                if (page.bodyWidgets[0].index === currentSectionIndex) {
                    for (let k: number = nextIndex; k < page.bodyWidgets[0].childWidgets.length; k++) {
                        let childWidget: BlockWidget = page.bodyWidgets[0].childWidgets[k] as BlockWidget;
                        this.updateIndex(childWidget, increaseIndex);
                    }
                    nextIndex = 0;
                } else {
                    return;
                }
            }
        } else if (block.containerWidget instanceof TableCellWidget) {
            let cells: TableCellWidget[] = block.containerWidget.getSplitWidgets() as TableCellWidget[];
            let currentCellIndex: number = cells.indexOf(block.containerWidget);
            for (let x: number = currentCellIndex; x < cells.length; x++) {
                let blocks: BlockWidget[] = cells[x].childWidgets as BlockWidget[];
                for (let y: number = nextIndex; y < blocks.length; y++) {
                    this.updateIndex(blocks[y], increaseIndex);
                }
                currentCellIndex = 0;
                nextIndex = 0;
            }
        } else if (block.containerWidget instanceof TableRowWidget) {
            for (let i: number = nextIndex; i < block.containerWidget.childWidgets.length; i++) {
                let cell: TableCellWidget = block.containerWidget.childWidgets[i] as TableCellWidget;
                if (cell.rowIndex === block.containerWidget.index) {
                    this.updateIndex(cell, increaseIndex);
                }
            }
        } else if (block.containerWidget instanceof TableWidget) {
            for (let i: number = nextIndex; i < block.containerWidget.childWidgets.length; i++) {
                let row: TableRowWidget = block.containerWidget.childWidgets[i] as TableRowWidget;
                this.updateIndex(row, increaseIndex);
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    cell.rowIndex = row.index;
                    cell.index = j;
                }
            }
            //update Row index of all the cell
        } else if (block.containerWidget instanceof HeaderFooterWidget || block.containerWidget instanceof TextFrame
            || block.containerWidget instanceof FootNoteWidget) {
            for (let i: number = nextIndex; i < block.containerWidget.childWidgets.length; i++) {
                let nextBlock: BlockWidget = block.containerWidget.childWidgets[i] as BlockWidget;
                this.updateIndex(nextBlock, increaseIndex);
            }
        }
    }
    private updateIndex(widget: Widget, increment: boolean): void {
        if (increment) {
            widget.index++;
        } else {
            widget.index--;
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public updateEndPosition(): void {
        let selection: Selection = this.documentHelper.selection;
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.updateHistoryPosition(selection.start, false);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onBackSpace(): void {
        this.removeEditRange = true;
        let selection: Selection = this.documentHelper.selection;
        this.documentHelper.triggerSpellCheck = true;
        if (selection.isEmpty) {
            this.singleBackspace(selection, false);
        } else {
            this.initHistory('BackSpace');
            let skipBackSpace: boolean = this.deleteSelectedContents(selection, true);
            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
                if (skipBackSpace) {
                    this.editorHistory.currentBaseHistoryInfo = undefined;
                } else {
                    if (this.checkEndPosition(selection)) {
                        this.updateHistoryPosition(selection.end, false);
                    }
                    this.reLayout(selection);
                    this.insertSpaceInFormField();
                }
            }
            this.documentHelper.triggerSpellCheck = false;
        }
        this.removeEditRange = false;
        this.updateXmlMappedContentControl();
    }
    /**
     * @private
     * @returns {boolean}
     */
    public insertRemoveBookMarkElements(): boolean {
        let isHandledComplexHistory: boolean = false;
        for (let i: number = 0; i < this.removedBookmarkElements.length; i++) {
            let bookMark: BookmarkElementBox = this.removedBookmarkElements[i];

            if (bookMark.bookmarkType === 0) {
                if (!this.documentHelper.bookmarks.containsKey(bookMark.name)) {
                    this.documentHelper.bookmarks.add(bookMark.name, bookMark);
                }
                let bookMarkStart: BookmarkElementBox = bookMark;
                if (bookMarkStart && bookMarkStart.reference && this.removedBookmarkElements.indexOf(bookMarkStart.reference) !== -1) {
                    let endIndex: number = this.removedBookmarkElements.indexOf(bookMarkStart.reference);
                    let startIndex: number = this.removedBookmarkElements.indexOf(bookMarkStart);
                    this.removedBookmarkElements.splice(endIndex, 1);
                    this.removedBookmarkElements.splice(startIndex, 1);
                    i--;
                } else {
                    if (this.editorHistory.currentBaseHistoryInfo) {
                        this.editorHistory.updateHistory();
                        this.initComplexHistory(this.editorHistory.currentBaseHistoryInfo.action);
                    }
                    this.initInsertInline(bookMarkStart.clone());
                    if (this.editorHistory.currentHistoryInfo) {
                        this.editorHistory.updateComplexHistory();
                        isHandledComplexHistory = true;
                    }
                }
            } else {
                let bookMarkEnd: BookmarkElementBox = bookMark;
                if (bookMarkEnd && bookMarkEnd.reference && this.removedBookmarkElements.indexOf(bookMarkEnd.reference) !== -1) {
                    let endIndex: number = this.removedBookmarkElements.indexOf(bookMarkEnd.reference);
                    let startIndex: number = this.removedBookmarkElements.indexOf(bookMarkEnd);
                    this.removedBookmarkElements.splice(endIndex, 1);
                    this.removedBookmarkElements.splice(startIndex, 1);
                    i--;
                } else {
                    if (this.editorHistory.currentBaseHistoryInfo) {
                        this.initComplexHistory(this.editorHistory.currentBaseHistoryInfo.action);
                        this.editorHistory.updateHistory();
                    }
                    this.initInsertInline(bookMarkEnd.clone());
                    if (this.editorHistory.currentHistoryInfo) {
                        this.editorHistory.updateComplexHistory();
                        isHandledComplexHistory = true;
                    }
                }
            }
        }
        this.removedBookmarkElements = [];
        return isHandledComplexHistory;
    }
    /**
     * @private
     * @param {Selection} selection - Specifies the selection
     * @param {boolean} isBackSpace - Specifies is backspace.
     * @returns {boolean}
     */
    public deleteSelectedContents(selection: Selection, isBackSpace: boolean): boolean {
        let skipBackSpace: boolean = this.deleteSelectedContentInternal(selection, isBackSpace, selection.start, selection.end);
        let textPosition: TextPosition = selection.getTextPosBasedOnLogicalIndex(selection.editPosition);
        selection.selectContent(textPosition, true);
        return skipBackSpace;
    }
    private removeWholeElement(selection: Selection): void {
        this.initHistory('BackSpace');
        this.deleteSelectedContents(selection, true);
        if (this.checkEndPosition(selection)) {
            this.updateHistoryPosition(selection.end, false);
        }
        this.reLayout(selection);
    }
    /**
     * Remove single character on left of cursor position
     *
     * @param {Selection} selection - Specifies the selection
     * @param {boolean} isRedoing - Specified the is redoing.
     * @private
     * @returns {void}
     */
    public singleBackspace(selection: Selection, isRedoing: boolean): void {
        let history: EditorHistory = this.editorHistory;
        // If backspace is pressed after auto format to hyperlink is done, need to undo auto format.
        if (history && !isRedoing && !history.canRedo() && history.canUndo()) {
            let historyInfo: BaseHistoryInfo = history.undoStack[history.undoStack.length - 1];
            let startBlockInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
            let endBlockInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.end);

            if (historyInfo.action === 'AutoFormatHyperlink' && historyInfo.insertPosition === this.selection.getHierarchicalIndex(startBlockInfo.paragraph, startBlockInfo.offset.toString()) &&
                historyInfo.endPosition === this.selection.getHierarchicalIndex(endBlockInfo.paragraph, endBlockInfo.offset.toString())) {
                history.undo();
                return;
            }
        }
        let isCommentDelete: boolean = false;
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let currentLineWidget: LineWidget = selection.start.currentWidget;
        let offset: number = selection.start.offset;
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = currentLineWidget.getInline(offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        if (this.selection.isInlineFormFillMode()) {
            if (inline instanceof FieldElementBox && inline.fieldType === 2) {
                return;
            }
            let resultText: string = this.getFormFieldText();
            if (resultText.length === 1) {
                this.selection.selectFieldInternal(this.selection.getCurrentFormField());

                this.insertTextInternal(this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5), true);
                this.selection.selectTextElementStartOfField(this.selection.getCurrentFormField());
                return;
            }
        }
        indexInInline = inlineObj.index;
        if (inline instanceof TextElementBox) {
            (inline as TextElementBox).ignoreOnceItems = [];
        }
        if (inline instanceof TextElementBox) {
            (inline as TextElementBox).ignoreOnceItems = [];
        }
        let previousInline: ElementBox = inline;
        if (inline instanceof FieldElementBox && inline.fieldType === 2) {
            if (HelperMethods.isLinkedFieldCharacter(inline)) {
                let begin: FieldElementBox = inline.fieldBegin;
                let end: ElementBox = inline.fieldEnd;
                if (begin.nextNode instanceof BookmarkElementBox) {
                    end = begin.nextNode.reference;
                }
                selection.start.setPositionParagraph(begin.line, begin.line.getOffset(begin, 0));
                selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                selection.fireSelectionChanged(true);
                return;
            }
        }
        if (inline instanceof FootnoteElementBox) {
            if (inline.footnoteType === 'Footnote') {
                this.removeFootnote(inline);
            } else {
                this.removeEndnote(inline);
            }
        }
        if (inline && (inline instanceof ContentControl || inline.previousNode instanceof ContentControl)) {
            if (inline instanceof ContentControl && inline.previousNode) {
                inline = inline.previousNode;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, inline.length);
            }
            if (inline && inline.length === 1 && inline.nextNode instanceof ContentControl
                && inline.previousNode instanceof ContentControl) {
                let start: ContentControl = inline.previousNode;
                let end: ContentControl = inline.nextNode;
                if (!start.contentControlProperties.lockContentControl) {
                    selection.start.setPositionParagraph(start.line, start.line.getOffset(start, 0));
                    selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                    this.removeWholeElement(selection);
                    return;
                }
            }
        }
        if (inline && (inline instanceof BookmarkElementBox || inline.previousNode instanceof BookmarkElementBox)) {
            if (inline instanceof BookmarkElementBox && inline.bookmarkType === 1) {
                if (inline.previousNode) {
                    inline = inline.previousNode;
                    paragraph = inline.line.paragraph;
                    offset = inline.line.getOffset(inline, inline.length);
                } else {
                    // remove paragraph mark and move bookmark to previous paragraph
                    if (paragraph.previousRenderedWidget instanceof ParagraphWidget) {
                        let prevParagraph: ParagraphWidget = paragraph.previousRenderedWidget;
                        let line: LineWidget = prevParagraph.lastChild as LineWidget;
                        selection.start.setPositionParagraph(inline.line, inline.line.getOffset(inline, 0));
                        selection.end.setPositionParagraph(line, line.getEndOffset());
                        this.removeWholeElement(selection);
                        return;
                    }
                }
                // Remove bookmark if selection is in between bookmark start and end element.
            } else if (inline.nextNode instanceof BookmarkElementBox && inline instanceof BookmarkElementBox &&
                inline.bookmarkType === 0 && inline.reference === inline.nextNode) {
                this.deleteBookmark(inline.name);
                return;
            }
            if (inline.length === 1 && inline.nextNode instanceof BookmarkElementBox && inline.previousNode instanceof BookmarkElementBox) {
                let begin: BookmarkElementBox = inline.previousNode;
                let end: BookmarkElementBox = inline.nextNode;
                selection.start.setPositionParagraph(begin.line, begin.line.getOffset(begin, 0));
                selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                this.removeWholeElement(selection);
                return;
            }
        }
        if (inline instanceof CommentCharacterElementBox && inline.commentType === 1) {
            let comment: CommentElementBox = inline.comment;
            if (comment.isReply) {
                comment = comment.ownerComment;
            }
            while (inline instanceof CommentCharacterElementBox) {
                inline = inline.previousNode;
            }
            this.deleteCommentInternal(comment);
            paragraph = inline.line.paragraph;
            offset = inline.line.getOffset(inline, inline.length);
            selection.start.setPositionParagraph(inline.line, offset);
            selection.end.setPositionParagraph(inline.line, offset);
            isCommentDelete = true;
        }
        if (inline instanceof FieldElementBox && inline.fieldType === 1) {
            let prevInline: ElementBox = selection.getPreviousValidElement(inline);
            if (prevInline instanceof FieldElementBox) {
                inline = (prevInline as FieldElementBox).fieldBegin;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 0);
                if (inline.nextNode instanceof BookmarkElementBox) {
                    let start: BookmarkElementBox = inline.nextNode.reference;
                    selection.start.setPositionParagraph(start.line, start.line.getOffset(start, 0));
                }
                selection.end.setPositionParagraph(inline.line, offset); //Selects the entire field.
                selection.fireSelectionChanged(true);
                return;
            } else if (prevInline !== inline) {
                inline = prevInline; //Updates the offset to delete next content.
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, inline.length);
            }
        }
        if (inline instanceof EditRangeStartElementBox || inline instanceof EditRangeEndElementBox) {
            if ((inline.nextNode instanceof EditRangeEndElementBox && (inline as EditRangeStartElementBox).editRangeEnd === inline.nextNode)
                || (inline.previousNode instanceof EditRangeStartElementBox
                    && (inline as EditRangeEndElementBox).editRangeStart === inline.previousNode)) {
                return;
            }
            if (inline instanceof EditRangeStartElementBox && !(inline.previousNode instanceof EditRangeEndElementBox)) {
                return;
            }
            if (inline instanceof EditRangeEndElementBox) {
                if (!isNullOrUndefined(inline.previousNode)) {
                    inline = inline.previousNode;
                    paragraph = inline.line.paragraph;
                    offset = inline.line.getOffset(inline, inline.length);
                }
            }
            if (inline.length === 1 && inline.nextNode instanceof EditRangeEndElementBox
                && inline.previousNode instanceof EditRangeStartElementBox) {
                let start: EditRangeStartElementBox = inline.previousNode;
                let end: EditRangeEndElementBox = inline.nextNode;
                selection.start.setPositionParagraph(start.line, start.line.getOffset(start, 0));
                selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                this.removeWholeElement(selection);
                return;
            }
        }
        if (!isRedoing) {
            this.initHistory('BackSpace');
        }
        if (offset === selection.getStartOffset(paragraph) && selection.start.currentWidget.isFirstLine()) {
            if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1) {
                this.onApplyList(undefined);
                return;
            }
            if (paragraph.paragraphFormat.firstLineIndent !== 0) {
                this.onApplyParagraphFormat('firstLineIndent', 0, false, false);
                return;
            }
            if (paragraph.paragraphFormat.leftIndent !== 0) {
                this.onApplyParagraphFormat('leftIndent', 0, false, false);
                return;
            }
            if (!paragraph.paragraphFormat.bidi && paragraph.paragraphFormat.textAlignment !== 'Left') {
                this.onApplyParagraphFormat('textAlignment', 'Left', false, true);
                return;
            }
            if (paragraph.previousRenderedWidget instanceof ParagraphWidget) {
                selection.owner.isShiftingEnabled = true;
                let previousParagraph: ParagraphWidget = paragraph.previousRenderedWidget as ParagraphWidget;
                // if (isNullOrUndefined(previousParagraph)) {
                //     previousParagraph = this.documentHelper.selection.getPreviousBlock(paragraph) as ParagraphWidget;
                // }
                if (previousParagraph.isEmpty()) {
                    this.removePrevParaMarkRevision(paragraph);
                    this.removeBlock(previousParagraph);
                    this.addRemovedNodes(previousParagraph);
                } else {
                    this.removePrevParaMarkRevision(paragraph);
                    this.removeBlock(paragraph);
                    let endOffset: number = this.documentHelper.selection.getLineLength(previousParagraph.lastChild as LineWidget);
                    let previousIndex: number = previousParagraph.childWidgets.length - 1;
                    let lineWidget: LineWidget;
                    if (!paragraph.isEmpty()) {
                        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
                            lineWidget = paragraph.childWidgets[i] as LineWidget;
                            previousParagraph.childWidgets.push(lineWidget);
                            paragraph.childWidgets.splice(i, 1);
                            i--;
                            lineWidget.paragraph = previousParagraph;
                        }
                    }
                    this.documentHelper.layout.reLayoutParagraph(previousParagraph, previousIndex, 0);
                    selection.selects(previousParagraph.childWidgets[previousIndex] as LineWidget, endOffset, true);
                    this.addRemovedNodes(paragraph);
                }
                this.setPositionForHistory();
                const footNoteWidgets: BlockWidget[] = this.documentHelper.layout.getFootNoteWidgetsOf(paragraph);
                if (footNoteWidgets.length > 0) {
                    let layout: Layout = this.documentHelper.layout;
                    let bodyWidget: BodyWidget = paragraph.containerWidget as BodyWidget;
                    layout.layoutfootNote(bodyWidget.page.footnoteWidget);
                }
                // if (!isRedoing) {
                this.reLayout(selection);
                // }
            } else {
                if (this.editorHistory) {
                    this.editorHistory.currentBaseHistoryInfo = undefined;
                }
            }
        } else {
            if (!isRedoing) {
                selection.owner.isShiftingEnabled = true;
            }
            let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
            let lineWidget: LineWidget = selection.start.currentWidget;
            let removeOffset: number = offset - 1;
            if (removeOffset < 0) {
                lineWidget = lineWidget.previousLine as LineWidget;
                removeOffset = this.documentHelper.selection.getLineLength(lineWidget) + removeOffset;
            }
            this.removeAtOffset(lineWidget, selection, removeOffset);
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset - 1, false);
            this.setPositionForHistory();
            if (!isRedoing) {
                this.reLayout(selection);
                if (isCommentDelete) {
                    (this.owner.editorHistory.undoStack[this.owner.editorHistory.undoStack.length -2] as HistoryInfo).modifiedActions.push(this.owner.editorHistory.undoStack[this.owner.editorHistory.undoStack.length - 1]);
                    this.owner.editorHistory.undoStack.splice(this.owner.editorHistory.undoStack.length - 1, 1);
                    isCommentDelete = false;
                }
            } else {
                this.fireContentChange();
            }
        }
    }
    private setPositionForHistory(editPosition?: string): void {
        let selection: Selection = this.documentHelper.selection;
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            if (isNullOrUndefined(editPosition)) {
                this.updateHistoryPosition(selection.start, true);
                this.editorHistory.currentBaseHistoryInfo.endPosition = this.editorHistory.currentBaseHistoryInfo.insertPosition;
            } else {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = editPosition;
                this.editorHistory.currentBaseHistoryInfo.endPosition = editPosition;
            }
        }
    }

    private removeAtOffset(lineWidget: LineWidget, selection: Selection, offset: number): void {
        let count: number = 0;
        let lineIndex: number = lineWidget.paragraph.childWidgets.indexOf(lineWidget);
        let isBidi: boolean = lineWidget.paragraph.paragraphFormat.bidi;
        let childLength: number = lineWidget.children.length;
        if (!isBidi && this.viewer.documentHelper.layout.isContainsRtl(lineWidget)) {
            let inline: ElementBox = lineWidget.children[0] as ElementBox;
            let endElement: ElementBox = undefined;
            let indexOf: number = -1;
            let isStarted: boolean = true;
            while (inline) {
                while ((isStarted || isNullOrUndefined(endElement)) && inline instanceof TextElementBox
                    && (this.documentHelper.textHelper.isRTLText(inline.text)
                        || this.documentHelper.textHelper.containsSpecialCharAlone(inline.text))
                    && inline.nextElement) {
                    if (!endElement) {
                        endElement = inline;
                    }
                    if (indexOf === -1) {
                        indexOf = lineWidget.children.indexOf(inline);
                    }
                    inline = inline.nextElement;
                }
                isStarted = false;
                let currentIndex: number = lineWidget.children.indexOf(inline);
                let isBreak: boolean = this.removeCharacter(inline, offset, count, lineWidget, lineIndex, currentIndex, true);
                if (isBreak) {
                    break;
                }
                count += inline.length;
                if (endElement === inline) {
                    if (indexOf !== -1) {
                        inline = lineWidget.children[indexOf + 1];
                    }
                    endElement = undefined;
                    indexOf = -1;
                } else if (endElement) {
                    inline = inline.previousElement;
                } else {
                    inline = inline.nextElement;
                }
            }
        } else {
            let sCmntCount: number = 0;
            let endCmntCount: number = 0;
            for (let i: number = !isBidi ? 0 : childLength - 1; !isBidi ? i < childLength : i >= 0; isBidi ? i-- : i++) {
                let inline: ElementBox = lineWidget.children[i] as ElementBox;
                if (inline instanceof ListTextElementBox) {
                    continue;
                }
                if (inline instanceof CommentCharacterElementBox) {
                    let commentElBox: CommentCharacterElementBox = inline as CommentCharacterElementBox;
                    if (commentElBox.commentType == 0) {
                        sCmntCount++;
                    } else {
                        endCmntCount++;
                    }
                    count++;
                    if (i != childLength - 1)
                        continue;
                }
                let isBreak: boolean = this.removeCharacter(inline, offset, count, lineWidget, lineIndex, i);
                if (isBreak) {
                    break;
                }
                count += inline.length;
            }
        }
    }

    private removeCharacter(inline: ElementBox, offset: number, count: number, lineWidget: LineWidget, lineIndex: number, i: number, isRearrange?: boolean): boolean {
        let isBreak: boolean = false;
        if (inline instanceof BookmarkElementBox && inline.line !== inline.reference.line) {
            if (!isNullOrUndefined(inline.line.previousLine)) {
                inline.line.previousLine.children.splice(inline.line.previousLine.children.length, 0, inline);
                inline.line = inline.line.previousLine;
            } else if (!isNullOrUndefined(inline.line.paragraph.previousRenderedWidget)) {

                (inline.line.paragraph.previousRenderedWidget.lastChild as LineWidget).children.splice((inline.line.paragraph.previousRenderedWidget.lastChild as LineWidget).children.length, 0, inline);
                inline.line = (inline.line.paragraph.previousRenderedWidget.lastChild as LineWidget);
            } else if (!isNullOrUndefined(inline.line.paragraph.nextRenderedWidget)) {

                (inline.line.paragraph.nextRenderedWidget.firstChild as LineWidget).children.splice((inline.line.paragraph.nextRenderedWidget.firstChild as LineWidget).children.length, 0, inline);
                inline.line = (inline.line.paragraph.nextRenderedWidget.firstChild as LineWidget);
            }
            lineWidget.children.splice(i, 1);
            return true;
        }
        if (offset < count + inline.length) {
            let indexInInline: number = offset - count;
            inline.ischangeDetected = true;
            if (this.owner.isSpellCheck) {
                this.owner.spellChecker.removeErrorsFromCollection({ 'element': inline, 'text': (inline as TextElementBox).text });
            }
            if (!inline.canTrigger) {
                this.documentHelper.triggerSpellCheck = false;
            }
            if (offset === count && inline.length === 1) {
                if (this.owner.enableTrackChanges && !this.skipTracking()) {
                    this.addRemovedNodes(inline.clone());
                    this.handleDeleteTracking(inline, indexInInline, 1, i);
                } else {
                    this.unLinkFieldCharacter(inline);
                    this.unlinkRangeFromRevision(inline, true);
                    this.addRemovedRevisionInfo(inline, undefined);
                    this.addRemovedNodes(inline);
                    lineWidget.children.splice(i, 1);
                }
                this.documentHelper.layout.reLayoutParagraph(lineWidget.paragraph, lineIndex, i, undefined, isRearrange);
            } else {
                let span: ElementBox = this.handleDeleteTracking(inline, indexInInline, 1);
                this.documentHelper.layout.reLayoutParagraph(lineWidget.paragraph, lineIndex, i, undefined, isRearrange);
                if (!isNullOrUndefined(span)) {
                    if (inline.revisions.length > 0) {
                        this.addRemovedRevisionInfo(inline as TextElementBox, span as TextElementBox);
                    }
                    this.addRemovedNodes(span);
                }
            }
            isBreak = true;
        }
        return isBreak;
    }
    private removeCharacterInLine(inline: ElementBox, indexInInline: number, endOffset: number): TextElementBox {
        let span: TextElementBox = new TextElementBox();
        if (inline instanceof TextElementBox) {
            span.characterFormat.copyFormat(inline.characterFormat);
            let removedCount: number = (endOffset === 1) ? 1 : (endOffset - indexInInline);
            span.text = (inline as TextElementBox).text.substr(indexInInline, removedCount);
            let text: string = (inline as TextElementBox).text;
            (inline as TextElementBox).text = text.substring(0, indexInInline) + text.substring(indexInInline + removedCount, text.length);
            if (inline.contentControlProperties) {
                span.contentControlProperties = inline.contentControlProperties.clone();
            }
        }
        return span;
    }
    private removeRevisionsInformation(elementBox: ElementBox, indexInInline: number, endOffset: number, elementIndex: number): void {
        let removeElement: ElementBox = elementBox.previousElement;
        let revision: Revision; revision = this.retrieveRevisionInOder(removeElement);
        if (revision.revisionType === 'Insertion') {
            if (this.isRevisionMatched(removeElement, undefined)) {
                elementBox.line.children.splice(elementIndex, 1);
            }
        }
    }

    private handleDeleteTracking(elementBox: ElementBox, indexInInline: number, endOffset: number, elementIndex?: number, startIndex?: number, endIndex?: number): ElementBox {
        let isTrackingEnabled: boolean = this.owner.enableTrackChanges;

        let isUndoing: boolean = isNullOrUndefined(this.editorHistory) ? false : (this.editorHistory.isUndoing || this.editorHistory.isRedoing);
        let removedNode: ElementBox = undefined;
        if (this.canHandleDeletion() || (isTrackingEnabled && !this.skipTracking())) {

            if (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox || elementBox instanceof EditRangeEndElementBox) {
                if (elementBox instanceof BookmarkElementBox && elementBox.previousElement instanceof FieldElementBox && elementBox.previousElement.formFieldData) {
                    if (elementBox.previousElement.revisions.length > 0) {
                        this.removeRevisionsInformation(elementBox, indexInInline, endOffset, elementIndex);
                    }
                } else {
                    elementBox.line.children.splice(elementBox.indexInOwner, 1);
                }
                return undefined;
            }
            let isDelete: boolean = false;
            if (this.owner.editorHistory) {

                isDelete = (!isNullOrUndefined(this.owner.editorHistory.currentBaseHistoryInfo) && this.owner.editorHistory.currentBaseHistoryInfo.action === 'Delete');
            }
            if (!this.skipTableElements) {
                this.updateEndRevisionIndex();
            }
            if (elementBox.revisions.length > 0) {
                let revision: Revision = this.retrieveRevisionInOder(elementBox);
                let index: number = this.owner.revisions.changes.indexOf(revision);
                if (revision.revisionType === 'Insertion') {
                    if (this.isRevisionMatched(elementBox, undefined)) {
                        // inserted revision same author as delete revision so we can delete
                        if (isNullOrUndefined(elementIndex)) {
                            removedNode = this.removeCharacterInLine(elementBox, indexInInline, endOffset);
                        } else {
                            let index: number = revision.range.indexOf(elementBox);
                            revision.range.splice(index, 1);
                            if (revision.range.length === 0) {
                                this.owner.revisionsInternal.remove(revision);
                            }
                            this.unLinkFieldCharacter(elementBox);
                            elementBox.line.children.splice(elementIndex, 1);
                        }
                    } else {
                        //Insert revision and delete revision (which is to be included) haven't matched
                        if (isNullOrUndefined(elementIndex)) {
                            let text: TextElementBox = this.removeCharacterInLine(elementBox, indexInInline, endOffset);
                            if (indexInInline === 0) {
                                let prevElement: ElementBox = elementBox.previousElement;
                                this.handleDeletionForInsertRevision(prevElement, elementBox, text, endOffset, indexInInline, true);
                            } else if (elementBox.length !== indexInInline) {
                                for (let i: number = elementBox.revisions.length - 1; i >= 0; i--) {
                                    let revision: Revision = elementBox.revisions[i];
                                    let index: number = revision.range.indexOf(elementBox);
                                    let newElement: TextElementBox = new TextElementBox();
                                    newElement.characterFormat.copyFormat(elementBox.characterFormat);
                                    newElement.line = elementBox.line;
                                    newElement.text = (elementBox as TextElementBox).text.substr(indexInInline);
                                    newElement.revisions.splice(0, 0, revision);
                                    revision.range.splice(index + 1, 0, newElement);
                                    text.revisions.splice(0, 0, revision);
                                    text.line = elementBox.line;
                                    revision.range.splice(index + 1, 0, text);
                                    (elementBox as TextElementBox).text = (elementBox as TextElementBox).text.substr(0, indexInInline);
                                    let indexInOwner: number = elementBox.indexInOwner;
                                    elementBox.line.children.splice(indexInOwner + 1, 0, newElement);
                                    elementBox.line.children.splice(indexInOwner + 1, 0, text);
                                    this.addRemovedNodes(text.clone());
                                    this.insertRevision(text, 'Deletion');
                                    this.updateLastElementRevision(text);
                                }
                            } else if (elementBox.length === indexInInline) {
                                let nextElement: ElementBox = elementBox.nextElement;
                                this.handleDeletionForInsertRevision(nextElement, elementBox, text, endOffset, indexInInline, false);
                            } else {
                                if (endOffset === 1) {
                                    if (!isDelete) {
                                        this.selection.start.movePreviousPosition();
                                        this.selection.end.setPositionInternal(this.selection.start);
                                    }
                                } else {
                                    this.updateCursorForInsertRevision(elementBox, indexInInline, endOffset);
                                }
                                this.addRemovedNodes(text.clone());
                                this.insertInlineInternal(text, 'Deletion');
                            }
                        } else if (!this.checkToCombineRevisionsInSides(elementBox, 'Deletion')) {
                            this.insertRevision(elementBox, 'Deletion');
                            this.updateLastElementRevision(elementBox);
                        } else {
                            this.updateLastElementRevision(elementBox);
                        }
                    }
                } else if (revision.revisionType === 'Deletion') {
                    if (index !== -1 && revision.author !== this.owner.currentUser) {
                        let range: Object[] = revision.range;
                        let startOff: number = (range[0] as ElementBox).line.getOffset(range[0] as ElementBox, 0);
                        let lastEle: ElementBox = range[range.length - 1] as ElementBox;
                        let endOff: number = lastEle.line.getOffset(lastEle, lastEle.length);

                        if (startOff === indexInInline && endOff === endOffset) {
                            elementBox.revisions.splice(elementBox.revisions.indexOf(revision), 1);
                            if (!this.checkToCombineRevisionsInSides(elementBox as ElementBox, 'Deletion')) {
                                this.insertRevision(elementBox, 'Deletion');
                                this.updateLastElementRevision(elementBox);
                            } else {
                                this.combineElementRevision(elementBox.revisions, elementBox.revisions);
                            }
                            if (elementBox.line.getOffset(elementBox, 0) === startOff) {
                                this.owner.revisions.changes.splice(index, 1);
                            }
                        }
                    }
                    if (endOffset === 1) {
                        if (isDelete) {
                            this.selection.start.moveNextPosition();
                            this.selection.end.setPositionInternal(this.selection.start);
                        } else {
                            this.selection.start.movePreviousPosition();
                            this.selection.end.setPositionInternal(this.selection.start);
                        }
                    } else {
                        if (this.isRevisionMatched(elementBox, 'Deletion')) {
                            this.updateCursorForInsertRevision(elementBox, indexInInline, endOffset);
                        } else {
                            let rangeIndex: number = revision.range.indexOf(elementBox);
                            let endOff: number = elementBox.line.getOffset(elementBox, elementBox.length);
                            if (endOff >= endOffset && (revision.range.length > (rangeIndex + 1))) {
                                this.updateRevisionForSpittedTextElement(elementBox as TextElementBox,
                                    revision.range[(rangeIndex + 1)] as TextElementBox);
                                revision.range.splice(revision.range.indexOf(elementBox), 1);
                                this.toCombineOrInsertRevision(elementBox, 'Deletion');
                            } else if (revision.range.length === 1 || indexInInline === 0) {
                                this.handleDeleteBySplitting(elementBox, indexInInline, endOffset);
                                if (rangeIndex !== -1 && revision.range.length !== 1) {
                                    this.updateRevisionForSpittedTextElement(revision.range[(rangeIndex - 1)] as TextElementBox,
                                        revision.range[rangeIndex] as TextElementBox);
                                    revision.range.splice(revision.range.indexOf(elementBox), 1);
                                }
                            } else {
                                revision.range.splice(revision.range.indexOf(elementBox), 1);
                                this.toCombineOrInsertRevision(elementBox, 'Deletion');
                            }
                        }
                    }
                    this.updateLastElementRevision(elementBox);
                }
            } else {
                //No revision information in the element
                if (!isNullOrUndefined(elementIndex)) {
                    if (!this.checkToCombineRevisionsInSides(elementBox, 'Deletion')) {
                        this.insertRevision(elementBox, 'Deletion');
                    }
                    this.updateLastElementRevision(elementBox);
                } else {
                    this.handleDeleteBySplitting(elementBox, indexInInline, endOffset);
                }
            }
        } else {
            removedNode = this.removeCharacterInLine(elementBox, indexInInline, endOffset);
        }

        return removedNode;
    }


    private toCombineOrInsertRevision(elementBox: ElementBox, type: RevisionType): void {
        if (!this.checkToCombineRevisionsInSides(elementBox as ElementBox, type)) {
            this.insertRevision(elementBox, type);
            this.updateLastElementRevision(elementBox);
        } else {
            this.combineElementRevision(elementBox.revisions, elementBox.revisions);
        }
    }

    private updateLastElementRevision(elementBox: ElementBox): void {
        if (!this.skipTableElements) {

            if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo && !this.skipReplace && (!isNullOrUndefined(this.owner.search) ? !this.owner.search.isRepalceTracking : true)) {
                if (isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.lastElementRevision)) {
                    this.editorHistory.currentBaseHistoryInfo.lastElementRevision = elementBox;
                    elementBox.isMarkedForRevision = true;
                }
            }
        }
    }

    private updateEndRevisionIndex(): void {
        if (!isNullOrUndefined(this.editorHistory.undoStack) && this.editorHistory.undoStack.length > 0) {
            let prevHistoryInfo: BaseHistoryInfo = this.editorHistory.undoStack[this.editorHistory.undoStack.length - 1];
            if (prevHistoryInfo.lastElementRevision && isNullOrUndefined(prevHistoryInfo.endRevisionLogicalIndex)) {
                prevHistoryInfo.updateEndRevisionInfo();
            }
        }
    }
    private retrieveRevisionInOder(elementBox: any): Revision {
        if (elementBox.revisions.length === 1) {
            return elementBox.revisions[0];
        }
        for (let i: number = 0; i < elementBox.revisions.length; i++) {
            if (elementBox.revisions[i].revisionType === 'Deletion') {
                return elementBox.revisions[i];
            }
        }
        return elementBox.revisions[elementBox.revisions.length - 1];
    }


    private handleDeletionForInsertRevision(elementToEnsure: ElementBox, currentElement: ElementBox, spittedSpan: TextElementBox, endOffset: number, indexInInline: number, isBegin: boolean): any {

        if (!isNullOrUndefined(elementToEnsure) && currentElement.revisions.length === 0 && this.isRevisionMatched(elementToEnsure, 'Deletion')) {
            this.addRemovedNodes(spittedSpan.clone());
            this.insertTextInline(elementToEnsure, this.selection, spittedSpan.text, 0);
        } else {
            let revision: Revision = currentElement.revisions[currentElement.revisions.length - 1];
            let index: number = revision.range.indexOf(currentElement);
            revision.range.splice((isBegin) ? index : index + 1, 0, spittedSpan);
            spittedSpan.revisions.splice(0, 0, revision);
            let isDelete: boolean = false;
            if (this.owner.editorHistory) {

                isDelete = (!isNullOrUndefined(this.owner.editorHistory.currentBaseHistoryInfo) && this.owner.editorHistory.currentBaseHistoryInfo.action === 'Delete');
            }
            if (endOffset === 1 && !isDelete) {
                this.selection.start.movePreviousPosition();
                this.selection.end.setPositionInternal(this.selection.start);
            } else {
                this.updateCursorForInsertRevision(currentElement, indexInInline, endOffset);
            }
            this.addRemovedNodes(spittedSpan.clone());
            this.insertInlineInternal(spittedSpan, 'Deletion');
        }
    }
    private handleDeleteBySplitting(elementBox: ElementBox, indexInInline: number, endOffset: number): void {
        let isDelete: boolean = false;
        if (this.owner.editorHistory) {

            isDelete = (!isNullOrUndefined(this.owner.editorHistory.currentBaseHistoryInfo) && this.owner.editorHistory.currentBaseHistoryInfo.action === 'Delete');
        }
        //Update cursor position to insert removed content
        if (endOffset === 1) {
            let startPosition: number = elementBox.line.getOffset(elementBox, 0);
            if (startPosition > 0) {
                let currentPosition: TextPosition = new TextPosition(this.owner);
                currentPosition.setPositionForLineWidget(elementBox.line, startPosition + indexInInline);
                this.selection.start.setPositionInternal(currentPosition);
                this.selection.end.setPositionInternal(this.selection.start);
            } else {
                if (!isDelete) {
                    this.selection.start.movePreviousPosition();
                    this.selection.end.setPositionInternal(this.selection.start);
                }
            }
        } else {
            this.updateCursorForInsertRevision(elementBox, indexInInline, endOffset);
        }

        let spittedElement: TextElementBox = this.removeCharacterInLine(elementBox, indexInInline, endOffset);
        this.addRemovedNodes(spittedElement.clone());
        this.insertTextInternal(spittedElement.text, false, 'Deletion');
    }

    private updateCursorForInsertRevision(inline: ElementBox, startOffset: number, endOffset: number): void {
        let startPosition: number = inline.line.getOffset(inline, 0);
        if (startPosition > 0) {
            startOffset = startPosition + startOffset;
            endOffset = startPosition + endOffset;
        }
        let currentPosition: TextPosition = new TextPosition(this.owner);
        currentPosition.setPositionFromLine(inline.line, startOffset);
        let endPosition: TextPosition = new TextPosition(this.owner);
        endPosition.setPositionFromLine(inline.line, endOffset);
        if (!currentPosition.isExistBefore(endPosition)) {
            this.selection.start.setPositionInternal(endPosition);
            this.selection.end.setPositionInternal(endPosition);
        } else {
            this.selection.end.setPositionInternal(currentPosition);
            this.selection.start.setPositionInternal(currentPosition);
        }
    }
    private checkToCombineRevisionsInSides(currentElement: ElementBox, revisionType: RevisionType): boolean {
        let prevElement: ElementBox = currentElement.previousNode;
        let nextElement: ElementBox = currentElement.nextNode;
        let isCombined: boolean = false;
        if (!isNullOrUndefined(prevElement)) {
            prevElement = prevElement.previousValidNodeForTracking;
            if (!isNullOrUndefined(prevElement)) {
                let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(prevElement.revisions, revisionType);
                if (matchedRevisions.length > 0) {
                    this.mapMatchedRevisions(matchedRevisions, prevElement, currentElement, false);
                    isCombined = true;
                }
            }
        }
        if (!isNullOrUndefined(nextElement)) {
            nextElement = nextElement.nextValidNodeForTracking;
            if (!isNullOrUndefined(nextElement)) {
                let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(nextElement.revisions, revisionType);
                if (matchedRevisions.length > 0) {
                    if (isCombined) {
                        this.combineElementRevision(currentElement.revisions, nextElement.revisions);
                    } else {
                        this.mapMatchedRevisions(matchedRevisions, nextElement, currentElement, true);
                    }
                    isCombined = true;
                }
            }
        }

        return isCombined;
    }
    /**
     * Remove the current selected content or one character right of cursor.
     *
     * @returns {void}
     */
    public delete(): void {
        this.removeEditRange = true;
        let selection: Selection = this.documentHelper.selection;
        if (selection.isEmpty) {
            this.singleDelete(selection, false);
        } else {
            // this.initComplexHistory('MultiSelection');
            // for (let i: number = 0; i < selection.selectionRanges.length; i++) {
            // let selectionRange: SelectionRange = selection.selectionRanges.getRange(i);
            this.initHistory('Delete');
            this.deleteSelectedContentInternal(selection, false, selection.start, selection.end);
            let textPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(textPosition, selection.editPosition);
            selection.selectContent(textPosition, true);
            // if (this.documentHelper.owner.enableEditorHistory) {
            this.reLayout(selection);
            this.insertSpaceInFormField();
            // }
            // this.updateSelectionRangeOffSet(selection.start, selection.end);
            // }
            // let textPosition: TextPosition = new TextPosition(selection.owner, this.documentHelper);
            // this.setPositionForCurrentIndex(textPosition,selection.editPosition);
            // selection.selectContent(textPosition, true);
            // if (!isNullOrUndefined(selection.currentHistoryInfo)) {
            //     this.updateComplexHistory();
            // } else {
            //     this.updateComplexWithoutHistory();
            // }
        }
        this.removeEditRange = false;
        this.updateXmlMappedContentControl();
    }
    private deleteEditElement(selection: Selection): void {
        this.initHistory('Delete');
        this.deleteSelectedContentInternal(selection, false, selection.start, selection.end);
        let textPosition: TextPosition = new TextPosition(selection.owner);
        this.setPositionForCurrentIndex(textPosition, selection.editPosition);
        selection.selectContent(textPosition, true);
        this.reLayout(selection);
    }
    private removeContentControlMark(start: ContentControl, end: ContentControl): boolean {
        if (!start.contentControlProperties.lockContentControl) {
            this.selection.start.setPositionParagraph(start.line, start.line.getOffset(start, 0));
            this.selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
            this.deleteEditElement(this.selection);
            return true;
        }
        return false;
    }
    /**
     * Remove single character on right of cursor position
     *
     * @param {Selection} selection - Specifies the selection
     * @param {boolean} isRedoing - Specified the is redoing.
     * @private
     * @returns {void}
     */
    /* eslint-disable  */
    public singleDelete(selection: Selection, isRedoing: boolean): void {

        let lineWidget: LineWidget = selection.start.currentWidget;
        let paragraph: ParagraphWidget = selection.start.paragraph; let offset: number = selection.start.offset; let indexInInline: number = 0;

        let inlineObj: ElementInfo = lineWidget.getInline(selection.start.offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        if (this.selection.isInlineFormFillMode()) {
            if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                return;
            }
            let resultText: string = this.getFormFieldText();
            if (!(inline instanceof TextElementBox)) {
                inline = inline.nextElement;
            }
            if (resultText.length === 1 && inline instanceof TextElementBox) {
                this.selection.selectFieldInternal(this.selection.getCurrentFormField());

                this.insertTextInternal(this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5), true);
                this.selection.selectTextElementStartOfField(this.selection.getCurrentFormField());
                return;
            } else {
                if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                    return;
                }
            }
        }
        indexInInline = inlineObj.index;
        if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1 &&
            this.documentHelper.isListTextSelected && selection.contextType === 'List') {
            this.onApplyList(undefined); return;
        }
        if (!isNullOrUndefined(inline) && indexInInline === inline.length && !isNullOrUndefined(inline.nextNode)) {
            inline = inline.nextNode as ElementBox;
            if (inline instanceof FieldElementBox && inline.fieldType === 1 &&
                !isNullOrUndefined(inline.fieldBegin.formFieldData)) {
                return;
            }
            indexInInline = 0;
        }
        if (!isNullOrUndefined(inline) && indexInInline === inline.length && !isNullOrUndefined(inline.nextNode)) {
            inline = inline.nextNode as ElementBox;
            if (inline instanceof FootnoteElementBox) {
                return;
            }
            indexInInline = 0;
        }
        if (inline instanceof FootnoteElementBox) {
            if (inline.footnoteType === 'Footnote') {
                this.removeFootnote(inline);
            } else {
                this.removeEndnote(inline);
            }
        }
        if (!isNullOrUndefined(inline)) {
            let nextRenderedInline: ElementBox = undefined;
            let nextInline: ElementBox = selection.getNextValidElement(inline);
            if (nextInline instanceof ElementBox) {
                nextRenderedInline = nextInline;
            }
            if (!isNullOrUndefined(nextRenderedInline) && nextRenderedInline instanceof FieldElementBox
                && nextRenderedInline.fieldType === 0) { //Selects the entire field.
                inline = (nextRenderedInline as FieldElementBox).fieldEnd;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 1);
                selection.end.setPositionParagraph(inline.line, offset);
                selection.fireSelectionChanged(true);
                return;
            } else if (inline !== nextRenderedInline) {  //Updates the offset to delete next content.               
                inline = nextRenderedInline;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 0);
                if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                    offset++;
                }
            }
        }
        if (inline instanceof EditRangeStartElementBox || inline instanceof EditRangeEndElementBox) {
            if ((inline.nextNode instanceof EditRangeEndElementBox && (inline as EditRangeStartElementBox).editRangeEnd === inline.nextNode)
                || (inline.previousNode instanceof EditRangeStartElementBox
                    && (inline as EditRangeEndElementBox).editRangeStart === inline.previousNode)) {
                return;
            }
            if (this.documentHelper.isDocumentProtected &&
                this.documentHelper.protectionType === 'ReadOnly') {
                if (inline instanceof EditRangeStartElementBox || inline instanceof EditRangeEndElementBox) {
                    return;
                }
            } else {
                if (inline instanceof EditRangeStartElementBox) {
                    inline = inline.nextNode;
                    offset = inline.line.getOffset(inline, 0);
                    paragraph = inline.line.paragraph;
                } else if (inline instanceof EditRangeEndElementBox) {
                    offset++;
                }
            }
            if (inline.length === 1 && inline.nextNode instanceof EditRangeEndElementBox
                && inline.previousNode instanceof EditRangeStartElementBox) {
                let editStart: EditRangeStartElementBox = inline.previousNode;
                let editEnd: EditRangeEndElementBox = inline.nextNode;
                selection.start.setPositionParagraph(editStart.line, editStart.line.getOffset(editStart, 0));
                selection.end.setPositionParagraph(editEnd.line, editEnd.line.getOffset(editEnd, 0) + 1);
                this.deleteEditElement(selection);
                return;
            }
        }
        if (inline && (inline instanceof ContentControl || inline.nextNode instanceof ContentControl)) {
            if (inline instanceof ContentControl && inline.nextNode) {
                inline = inline.nextNode;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 0);
                // Move cursor inbetween content control
                selection.start.setPositionParagraph(inline.line, offset);
                selection.end.setPositionParagraph(inline.line, offset);
                return;
            }
            if (inline && inline.length === 1 && inline.nextNode instanceof ContentControl
                && inline.previousNode instanceof ContentControl) {
                if (this.removeContentControlMark(inline.previousNode, inline.nextNode)) {
                    return;
                }
            }
            // Remove content if content control is empty
            if (inline instanceof ContentControl && inline.previousNode instanceof ContentControl
                && inline.previousNode.reference === inline) {
                // Remove content control if there is no element presen in between start and end mark.
                if (this.removeContentControlMark(inline.previousNode, inline)) {
                    return;
                }
            }
        }
        if (inline && (inline instanceof BookmarkElementBox && inline.bookmarkType === 0
            || inline.nextNode instanceof BookmarkElementBox)) {
            if (inline.nextNode && inline instanceof BookmarkElementBox) {
                inline = inline.nextNode;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 0);
            }
            if (inline.length === 1 && inline.nextNode instanceof BookmarkElementBox
                && inline.previousNode instanceof BookmarkElementBox) {
                let bookMarkBegin: BookmarkElementBox = inline.previousNode;
                let bookMarkEnd: BookmarkElementBox = inline.nextNode;

                selection.start.setPositionParagraph(bookMarkBegin.line, bookMarkBegin.line.getOffset(bookMarkBegin, 0));

                selection.end.setPositionParagraph(bookMarkEnd.line, bookMarkEnd.line.getOffset(bookMarkEnd, 0) + 1);
                this.deleteEditElement(selection);
                return;
            }
            if (inline instanceof BookmarkElementBox) {
                offset = inline.line.getOffset(inline, 1);
            }
        }

        if (selection.start.currentWidget.isLastLine() && offset === this.documentHelper.selection.getLineLength(selection.start.currentWidget)) {
            if (paragraph.isInsideTable && isNullOrUndefined(paragraph.nextWidget)) {
                return;
            }
            let previousParagraph: ParagraphWidget = undefined; let newParagraph: ParagraphWidget = undefined;
            let nextParagraph: ParagraphWidget = selection.getNextParagraphBlock(paragraph);
            if (isNullOrUndefined(nextParagraph)) {
                if (offset > 0) {
                    return;
                } else {
                    if (paragraph.previousWidget instanceof ParagraphWidget) {
                        previousParagraph = paragraph.previousWidget as ParagraphWidget;
                    }
                    if (paragraph.previousWidget instanceof FootNoteWidget) {
                        return;
                    }
                    if (paragraph.previousWidget instanceof TableWidget) {
                        return;
                    }
                    if (isNullOrUndefined(previousParagraph)) {
                        return;
                        //Adds an empty paragraph, to ensure minimal content.
                    }
                }
            }
            if (!isRedoing) {
                this.initHistory('Delete');
            }
            if (paragraph.isEndsWithPageBreak) {
                let lastLine: LineWidget = paragraph.lastChild as LineWidget;
                let lastChild: ElementBox = lastLine.children[lastLine.children.length - 1] as ElementBox;
                this.selection.start.setPositionForSelection(lastLine, lastChild, 0, this.selection.start.location);
            }
            let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
            selection.editPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.checkInsertPosition(selection)) {
                this.setPositionForHistory(selection.editPosition);
            }
            selection.owner.isShiftingEnabled = true;
            if (paragraph.isEmpty()) {
                this.removePrevParaMarkRevision(paragraph, true);
                this.removeBlock(paragraph);
                this.addRemovedNodes(paragraph);
                if (isNullOrUndefined(nextParagraph)) {
                    if (isNullOrUndefined(previousParagraph)) {
                        // selection.selectParagraphInternal(newParagraph, true, true);
                        let paraEndOffset: number = selection.getParagraphLength(newParagraph) + 1;
                        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                            this.updateHistoryPosition(selection.start, true);

                            this.editorHistory.currentBaseHistoryInfo.endPosition = this.selection.getHierarchicalIndex(newParagraph, paraEndOffset.toString());
                        }
                    } else {
                        selection.selectParagraphInternal(previousParagraph, false);
                        this.setPositionForHistory();
                    }
                } else {
                    selection.selectParagraphInternal(nextParagraph, true);
                }
            } else {
                paragraph = paragraph.combineWidget(this.owner.viewer) as ParagraphWidget;

                let currentParagraph: ParagraphWidget = this.splitParagraph(paragraph, paragraph.firstChild as LineWidget, 0, selection.start.currentWidget, selection.start.offset, true);
                this.removePrevParaMarkRevision(currentParagraph, true);
                this.deleteParagraphMark(currentParagraph, selection, 0);
                this.addRemovedNodes(paragraph);
                this.setPositionForCurrentIndex(selection.start, selection.editPosition);
                selection.selectContent(selection.start, true);
            }
            // if (!isRedoing) {
            this.reLayout(selection);
            // }
        } else {
            this.singleDeleteInternal(selection, isRedoing, paragraph);
        }
    }
    private singleDeleteInternal(selection: Selection, isRedoing: boolean, paragraph: ParagraphWidget): void {
        if (!isRedoing) {
            selection.owner.isShiftingEnabled = true;
            this.initHistory('Delete');
        }
        if (this.checkInsertPosition(selection)) {
            this.updateHistoryPosition(selection.start, true);
            this.editorHistory.currentBaseHistoryInfo.endPosition = this.editorHistory.currentBaseHistoryInfo.insertPosition;
        }
        let paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(selection.start);
        let lineWidget: LineWidget = selection.start.currentWidget;
        let removeOffset: number = selection.start.offset;
        let lineLength: number = selection.getLineLength(selection.start.currentWidget);
        if (removeOffset >= lineLength) {
            lineWidget = lineWidget.nextLine as LineWidget;
            removeOffset = removeOffset - lineLength;
        }
        this.removeAtOffset(lineWidget, selection, removeOffset);
        if (this.owner.enableTrackChanges && !this.skipTracking()) {
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + 1, false);
        } else {
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset, false);
        }
        if (!isRedoing) {
            this.reLayout(selection);
        } else {
            this.fireContentChange();
        }
    }

    private deleteParagraphMark(paragraph: ParagraphWidget, selection: Selection, editAction: number, handleParaMark?: boolean): void {
        if (isNullOrUndefined(paragraph.containerWidget)) {
            return;
        }
        paragraph = paragraph.combineWidget(this.owner.viewer) as ParagraphWidget;
        let nextParagraph: ParagraphWidget = selection.getNextParagraphBlock(paragraph);
        if (paragraph.isInsideTable && isNullOrUndefined(paragraph.nextWidget) || isNullOrUndefined(nextParagraph)) {
            return;
        }
        //BodyWidget
        let section: BodyWidget = paragraph.containerWidget instanceof BodyWidget ? paragraph.containerWidget : undefined;
        let table: TableWidget = undefined;
        if (selection.getNextRenderedBlock(paragraph) instanceof TableWidget) {
            table = selection.getNextRenderedBlock(paragraph) as TableWidget;
        } else {
            table = undefined;
        }

        if (nextParagraph.isInsideTable && !isNullOrUndefined(table) && table.contains(nextParagraph.associatedCell)) {
            if (editAction < 4) {
                // let nextSection: BodyWidget = table.containerWidget instanceof BodyWidget ? table.containerWidget : undefined;
                // if (section !== nextSection) {
                //     this.combineSection(section, selection, nextSection);
                // }                
                let offset: number = 0;
                this.removeBlock(paragraph);
                this.documentHelper.layout.clearListElementBox(nextParagraph);
                this.documentHelper.layout.clearListElementBox(paragraph);
                for (let i: number = paragraph.childWidgets.length - 1; i >= 0; i--) {
                    let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
                    for (let j: number = line.children.length - 1; j >= 0; j--) {
                        let element: ElementBox = line.children[j] as ElementBox;
                        offset += element.length;
                        (nextParagraph.firstChild as LineWidget).children.unshift(element);
                        element.line = nextParagraph.firstChild as LineWidget;
                        // this.layoutInlineCollection(false, 0, nextParagraph.inlines, inline);
                    }
                }
                this.documentHelper.layout.reLayoutParagraph(nextParagraph, 0, 0);
                if (offset > 0) {
                    selection.editPosition = this.selection.getHierarchicalIndex(nextParagraph, offset.toString());
                }
            }
        } else {
            if (editAction < 4) {
                // let nextSection: WSection = nextParagraph.section instanceof WSection ? nextParagraph.section as WSection : undefined;
                // if (section !== nextSection) {
                //     this.combineSection(section, selection, nextSection);
                // }
                let prevLength: number = paragraph.childWidgets.length - 1;
                let nextPara: ParagraphWidget[] = nextParagraph.getSplitWidgets() as ParagraphWidget[];
                nextParagraph = nextParagraph.combineWidget(this.owner.viewer) as ParagraphWidget;
                this.documentHelper.layout.clearListElementBox(nextParagraph);
                this.documentHelper.layout.clearListElementBox(paragraph);
                this.updateEditPositionOnMerge(paragraph, nextParagraph);

                let canRemoveParaMark: boolean = (!isNullOrUndefined(handleParaMark) && handleParaMark) ? this.handleDeleteParaMark(paragraph, nextPara[0]) : true;
                if (canRemoveParaMark) {
                    let prevLastLineIndex: number = paragraph.childWidgets.length - 1;
                    let elementIndex: number = (paragraph.childWidgets[prevLastLineIndex] as LineWidget).children.length - 1;
                    for (let i: number = 0; i < nextParagraph.childWidgets.length; i++) {
                        let inline: LineWidget = nextParagraph.childWidgets[i] as LineWidget;
                        if (nextParagraph.characterFormat.revisions.length > 0) {
                            for (let i: number = 0; i < nextParagraph.characterFormat.revisions.length; i++) {
                                for (let j: number = 0; j < nextParagraph.characterFormat.revisions[i].range.length; j++) {
                                    (nextParagraph.characterFormat.revisions[i].range[j] as any).ownerBase = paragraph;
                                }
                                paragraph.characterFormat.revisions.push(nextParagraph.characterFormat.revisions[i]);
                            }
                        }
                        nextParagraph.childWidgets.splice(i, 1);
                        paragraph.childWidgets.push(inline);
                        inline.paragraph = paragraph;
                        i--;
                    }
                    if (nextParagraph.childWidgets.length === 0) {
                        nextParagraph.childWidgets.push(new LineWidget(nextParagraph));
                    }
                    this.removeBlock(nextParagraph);
                    this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0);
                    //this.combineRevisionOnDeleteParaMark(paragraph, prevLastLineIndex, elementIndex);
                    this.addRemovedNodes(nextParagraph);
                }
            }
        }
    }
    private handleDeleteParaMark(currentPara: ParagraphWidget, nextPara: ParagraphWidget): boolean {
        if (!this.owner.enableTrackChanges && currentPara.characterFormat.revisions.length > 0) {
            // If tracking disabled and revision exists then remove revision from character format
            for (let i: number = 0; i < currentPara.characterFormat.revisions.length; i++) {
                let currentRevision: Revision = currentPara.characterFormat.revisions[i];
                let rangeIndex: number = currentRevision.range.indexOf(currentPara.characterFormat);
                currentRevision.range.splice(rangeIndex, 1);
                if (currentRevision.range.length === 0) {
                    this.owner.revisions.remove(currentRevision);
                }
                return true;
            }
        }
        if (this.owner.enableTrackChanges) {
            let canRemoveParaMark: boolean = false;
            if (currentPara.characterFormat.revisions.length > 0) {
                let deleteRevision: Revision = this.retrieveRevisionByType(currentPara.characterFormat, 'Deletion');
                if (!isNullOrUndefined(deleteRevision) && this.isRevisionMatched(deleteRevision, 'Deletion')) {
                    let revisionIndex: number = currentPara.characterFormat.revisions.indexOf(deleteRevision);
                    currentPara.characterFormat.revisions.splice(revisionIndex, 1);
                    deleteRevision.range.splice(deleteRevision.range.indexOf(currentPara.characterFormat), 1);
                    if (deleteRevision.range.length === 0) {
                        this.owner.revisions.remove(deleteRevision);
                    }
                    canRemoveParaMark = true;
                }
                let insertRevision: Revision = this.retrieveRevisionByType(currentPara.characterFormat, 'Insertion');
                if (!isNullOrUndefined(insertRevision) && this.isRevisionMatched(currentPara.characterFormat, 'Insertion')) {
                    let rangeIndex: number = insertRevision.range.indexOf(currentPara.characterFormat);
                    insertRevision.range.splice(rangeIndex, 1);
                    if (insertRevision.range.length === 0) {
                        this.owner.revisions.remove(insertRevision);
                    }
                    canRemoveParaMark = true;
                }
                if (canRemoveParaMark) {
                    return true;
                } else {
                    this.applyRevisionForParaMark(currentPara, nextPara.firstChild as LineWidget, 'Deletion', false);
                }
                return false;
            } else {
                this.applyRevisionForParaMark(currentPara, nextPara.firstChild as LineWidget, 'Deletion', false);
                return false;
            }
        }
        return true;
    }

    private insertDeleteParaMarkRevision(currentPara: ParagraphWidget, nextPara: ParagraphWidget): any {
        let lastLine: LineWidget = currentPara.lastChild as LineWidget;

        let lastElement: ElementBox = lastLine.children.length > 0 ? lastLine.children[lastLine.children.length - 1].previousValidNodeForTracking : undefined;
        if (!isNullOrUndefined(lastElement)) {
            let matchedRevisions: Revision[] = this.getMatchedRevisionsToCombine(lastElement.revisions, 'Deletion');
            if (matchedRevisions.length > 0) {
                this.mapMatchedRevisions(matchedRevisions, lastElement, currentPara.characterFormat, false);
            }
        }
        let firstLine: LineWidget = nextPara.firstChild as LineWidget;
        let firstElement: ElementBox = firstLine.children[0].nextValidNodeForTracking;

    }

    private retrieveRevisionByType(item: any, revisionToRetrieve: RevisionType): Revision {
        for (let i: number = 0; i < item.revisions.length; i++) {
            if (item.revisions[i].revisionType === revisionToRetrieve) {
                return item.revisions[i];
            }
        }
        return undefined;
    }
    private combineRevisionOnDeleteParaMark(paragraph: ParagraphWidget, lineIndex: number, elementIndex: number): void {
        let lastLine: LineWidget = paragraph.childWidgets[lineIndex] as LineWidget;
        let lastElement: ElementBox = lastLine.children[elementIndex];
        let firstElement: ElementBox = lastElement.nextNode;
        firstElement = firstElement.nextValidNodeForTracking;
        lastElement = lastElement.nextValidNodeForTracking;
        if (firstElement.revisions.length > 0 && lastElement.revisions.length > 0) {
            this.combineElementRevisions(lastElement, firstElement);
        }
    }
    private updateEditPositionOnMerge(currentParagraph: ParagraphWidget, nextParagraph: ParagraphWidget): void {
        if (this.documentHelper.selection.editPosition === this.selection.getHierarchicalIndex(nextParagraph, '0') &&
            nextParagraph.nextRenderedWidget === undefined) {

            this.documentHelper.selection.editPosition = this.selection.getHierarchicalIndex(currentParagraph, this.documentHelper.selection.getLineLength(currentParagraph.lastChild as LineWidget).toString());
        }
    }
    private checkEndPosition(selection?: Selection): boolean {
        return (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)
            && isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.endPosition));
    }
    private checkInsertPosition(selection?: Selection): boolean {
        return (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)
            && isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo.insertPosition));
    }
    private checkIsNotRedoing(): boolean {
        return this.documentHelper.owner.enableHistoryMode && !this.editorHistory.isRedoing;
    }
    /**
     * deleteSelectedContentInternal
     * @private
     */
    public deleteSelectedContentInternal(selection: Selection, isBackSpace: boolean, startPosition: TextPosition, endPosition: TextPosition): boolean {
        let startPos: TextPosition = startPosition;
        let endPos: TextPosition = endPosition;
        if (!startPosition.isExistBefore(endPosition)) {
            startPos = endPosition;
            endPos = startPosition;
        }
        const blockInfo: ParagraphInfo = this.selection.getParagraphInfo(startPos);
        selection.editPosition = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        let skipBackSpace: boolean = false;
        if (isBackSpace && startPos.isInSameParagraph(endPos)) {
            //Handled specifically to skip removal of contents, if selection is only paragraph mark and next rendered block is table.
            if (startPos.offset < endPos.offset && startPos.offset === selection.getParagraphLength(endPos.paragraph)) {
                const nextBlock: BlockWidget = selection.getNextRenderedBlock(startPos.paragraph);
                skipBackSpace = nextBlock instanceof TableWidget;
            }
            //Handled specifically to remove paragraph completely (Delete behavior), if the selected paragraph is empty.
            if (endPos.offset === 1 && endPos.offset > selection.getParagraphLength(endPos.paragraph)
                && !(endPos.paragraph.isInsideTable && isNullOrUndefined(endPos.paragraph.nextWidget))) {
                isBackSpace = false;
            }
        }
        if (!skipBackSpace) {
            selection.owner.isShiftingEnabled = true;
            if (this.checkInsertPosition(selection)) {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = selection.editPosition;
            }
            const editAction: number = (isBackSpace ? 1 : 0);
            this.deleteSelectedContent(endPos.paragraph, selection, startPos, endPos, editAction);
        }
        return skipBackSpace;
    }
    /**
     * Init EditorHistory
     *
     * @private
     * @param {Action} action Specified the action.
     * @returns {void}
     */
    public initHistory(action: Action): void {
        if (this.documentHelper.owner.enableHistoryMode) {
            this.editorHistory.initializeHistory(action);
        }
    }

    /**
     * Init Complex EditorHistory
     *
     * @private
     * @param {Action} action Specified the action.
     * @returns {void}
     */
    public initComplexHistory(action: Action): void {
        if (this.documentHelper.owner.enableHistoryMode) {
            this.editorHistory.initComplexHistory(this.documentHelper.selection, action);
        }
    }
    //Insert Picture implementation starts
    /**
     * Insert image
     *
     * @private
     * @param {string} base64String Base64 string, web URL or file URL.
     * @param {number} width Image width
     * @param {number} height Image height
     * @returns {void}
     */
    public insertPicture(base64String: string, width: number, height: number): void {
        const imageElementBox: ImageElementBox = new ImageElementBox(true);
        imageElementBox.imageString = base64String;
        imageElementBox.width = width;
        imageElementBox.height = height;
        imageElementBox.textWrappingStyle = 'Inline';
        this.insertPictureInternal(imageElementBox);
    }
    private insertPictureInternal(imageElementBox: ImageElementBox): void {
        const selection: Selection = this.documentHelper.selection;
        this.initHistory('InsertInline');
        this.fitImageToPage(selection, imageElementBox);
        this.insertInlineInSelection(selection, imageElementBox);
        this.reLayout(selection);
    }
    private fitImageToPage(selection: Selection, imageElementBox: ImageElementBox): void {
        const section: BodyWidget = selection.start.paragraph.bodyWidget as BodyWidget;
        const pageWidth: number = section.sectionFormat.pageWidth - section.sectionFormat.leftMargin - section.sectionFormat.rightMargin;
        const pageHeight: number = section.sectionFormat.pageHeight - section.sectionFormat.topMargin - section.sectionFormat.topMargin;
        //Resizes image to page size.
        if (imageElementBox.width > pageWidth) {
            imageElementBox.height = imageElementBox.height * pageWidth / imageElementBox.width;
            imageElementBox.width = pageWidth;
        }
        if (imageElementBox.height > pageHeight) {
            imageElementBox.width = imageElementBox.width * pageHeight / imageElementBox.height;
            imageElementBox.height = pageHeight;
        }
    }
    //Insert Picture implementation ends
    /**
     * @param {selection} Selection context.
     * @param {elementBox} Elementbox
     * @param selection
     * @param elementBox
     * @private
     */
    public insertInlineInSelection(selection: Selection, elementBox: ElementBox): void {
        if (this.checkIsNotRedoing()) {
            selection.owner.isShiftingEnabled = true;
        }
        if (!selection.isEmpty) {
            this.removeSelectedContents(selection);
        }
        this.updateInsertPosition();
        this.insertInlineInternal(elementBox);
        if (this.checkEndPosition(selection)) {
            this.updateHistoryPosition(selection.start, false);
        }
        this.fireContentChange();
    }
    /**
     * @private
     * @returns {void}
     */
    public onPortrait(): void {
        const sectionFormat: WSectionFormat = new WSectionFormat();
        const width: number = this.documentHelper.selection.sectionFormat.pageWidth;
        const height: number = this.documentHelper.selection.sectionFormat.pageHeight;
        if (width > height) {
            sectionFormat.pageWidth = height;
            sectionFormat.pageHeight = width;
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    /**
     * @private
     * @returns {void}
     */
    public onLandscape(): void {
        const sectionFormat: WSectionFormat = new WSectionFormat();
        const width: number = this.documentHelper.selection.sectionFormat.pageWidth;
        const height: number = this.documentHelper.selection.sectionFormat.pageHeight;
        if (width < height) {
            sectionFormat.pageWidth = height;
            sectionFormat.pageHeight = width;
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    private copyValues(): WSectionFormat {
        const format: WSectionFormat = new WSectionFormat();
        format.bottomMargin = this.documentHelper.selection.sectionFormat.bottomMargin;
        format.topMargin = this.documentHelper.selection.sectionFormat.topMargin;
        format.leftMargin = this.documentHelper.selection.sectionFormat.leftMargin;
        format.rightMargin = this.documentHelper.selection.sectionFormat.rightMargin;
        format.pageHeight = this.documentHelper.selection.sectionFormat.pageHeight;
        format.pageWidth = this.documentHelper.selection.sectionFormat.pageWidth;
        format.footerDistance = this.documentHelper.selection.sectionFormat.footerDistance;
        format.headerDistance = this.documentHelper.selection.sectionFormat.headerDistance;
        return format;
    }
    /**
     * @param property
     * @private
     * @returns {void}
     */
    public changeMarginValue(property: string): void {
        const sectionFormat: WSectionFormat = this.copyValues();

        if (property === 'lastCustomSetting' || property === 'normal') {
            sectionFormat.topMargin = 72;
            sectionFormat.bottomMargin = 72;
            sectionFormat.leftMargin = 72;
            sectionFormat.rightMargin = 72;
        } else if (property === 'narrow') {
            sectionFormat.topMargin = 36;
            sectionFormat.bottomMargin = 36;
            sectionFormat.leftMargin = 36;
            sectionFormat.rightMargin = 36;
        } else if (property === 'moderate') {
            sectionFormat.topMargin = 72;
            sectionFormat.bottomMargin = 72;
            sectionFormat.leftMargin = 54;
            sectionFormat.rightMargin = 54;
        } else if (property === 'wide') {
            sectionFormat.topMargin = 72;
            sectionFormat.bottomMargin = 72;
            sectionFormat.leftMargin = 144;
            sectionFormat.rightMargin = 144;
        } else if (property === 'mirrored') {
            sectionFormat.topMargin = 72;
            sectionFormat.bottomMargin = 72;
            sectionFormat.leftMargin = 90;
            sectionFormat.rightMargin = 72;
        } else if (property === 'office2003Default') {
            sectionFormat.topMargin = 72;
            sectionFormat.bottomMargin = 72;
            sectionFormat.leftMargin = 90;
            sectionFormat.rightMargin = 90;
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    /**
     * @param property
     * @private
     * @returns {void}
     */
    public onPaperSize(property: string): void {
        const sectionFormat: WSectionFormat = this.copyValues();

        const width: number = this.documentHelper.selection.sectionFormat.pageWidth;
        const height: number = this.documentHelper.selection.sectionFormat.pageHeight;
        if (property === 'letter') {
            if (width < height) {
                sectionFormat.pageWidth = 611.9;
                sectionFormat.pageHeight = 791.9;
            } else {
                sectionFormat.pageWidth = 791.9;
                sectionFormat.pageHeight = 611.9;
            }
        } else if (property === 'tabloid') {
            if (width < height) {
                sectionFormat.pageWidth = 791.9;
                sectionFormat.pageHeight = 1223.9;
            } else {
                sectionFormat.pageWidth = 1223.9;
                sectionFormat.pageHeight = 791.9;
            }
        } else if (property === 'legal') {
            if (width < height) {
                sectionFormat.pageWidth = 611.9;
                sectionFormat.pageHeight = 1007.9;
            } else {
                sectionFormat.pageWidth = 1007.9;
                sectionFormat.pageHeight = 611.9;
            }
        } else if (property === 'statement') {
            if (width < height) {
                sectionFormat.pageWidth = 396;
                sectionFormat.pageHeight = 611.9;
            } else {
                sectionFormat.pageWidth = 611.9;
                sectionFormat.pageHeight = 396;
            }
        } else if (property === 'executive') {
            if (width < height) {
                sectionFormat.pageWidth = 521.9;
                sectionFormat.pageHeight = 755.9;
            } else {
                sectionFormat.pageWidth = 755.9;
                sectionFormat.pageHeight = 521.9;
            }
        } else if (property === 'a3') {
            if (width < height) {
                sectionFormat.pageWidth = 841.8;
                sectionFormat.pageHeight = 1190.4;
            } else {
                sectionFormat.pageWidth = 1190.4;
                sectionFormat.pageHeight = 841.8;
            }
        } else if (property === 'a4') {
            if (width < height) {
                sectionFormat.pageWidth = 595.2;
                sectionFormat.pageHeight = 841.8;
            } else {
                sectionFormat.pageWidth = 841.8;
                sectionFormat.pageHeight = 595.2;
            }
        } else if (property === 'a5') {
            if (width < height) {
                sectionFormat.pageWidth = 419.5;
                sectionFormat.pageHeight = 595.2;
            } else {
                sectionFormat.pageWidth = 595.2;
                sectionFormat.pageHeight = 419.5;
            }
        } else if (property === 'b4') {
            if (width < height) {
                sectionFormat.pageWidth = 728.4;
                sectionFormat.pageHeight = 1031.7;
            } else {
                sectionFormat.pageWidth = 1031.7;
                sectionFormat.pageHeight = 728.4;
            }
        } else if (property === 'b5') {
            if (width < height) {
                sectionFormat.pageWidth = 515.8;
                sectionFormat.pageHeight = 728.4;
            } else {
                sectionFormat.pageWidth = 728.4;
                sectionFormat.pageHeight = 515.8;
            }
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    //Update List Items
    /**
     * @param blockAdv
     * @param updateNextBlockList
     * @param blockAdv
     * @param updateNextBlockList
     * @private
     * @returns {void}
     */
    public updateListItemsTillEnd(blockAdv: BlockWidget, updateNextBlockList: boolean): void {
        let block: BlockWidget = updateNextBlockList ? this.documentHelper.selection.getNextRenderedBlock(blockAdv) : blockAdv;
        while (!isNullOrUndefined(block) && !this.documentHelper.isTextInput) {
            //Updates the list value of the rendered paragraph.
            this.updateRenderedListItems(block);
            block = block.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        }

    }
    /**
     * @param block
     * @private
     * @returns {void}
     */
    public updateWholeListItems(block: BlockWidget): void {
        this.documentHelper.renderedLists.clear();
        this.documentHelper.renderedLevelOverrides = [];
        const sectionIndex: number = block.bodyWidget.index;
        let currentBlock: BlockWidget;
        for (let j: number = 0; j < this.documentHelper.pages.length; j++) {
            const page: Page = this.documentHelper.pages[j];
            if (page.bodyWidgets[0].index === sectionIndex) {
                currentBlock = this.getNextBlockForList(page.bodyWidgets[0].firstChild as BlockWidget);
                if (!isNullOrUndefined(currentBlock)) {
                    break;
                }
            }
        }
        let isListUpdated: boolean = false;
        do {
            isListUpdated = this.updateListItems(currentBlock, block);
            if (isListUpdated) {
                break;
            }
            currentBlock = currentBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
            if (!isNullOrUndefined(currentBlock)) {
                currentBlock = this.getNextBlockForList(currentBlock);
            }
        } while (currentBlock);
    }
    private getNextBlockForList(currentBlock: BlockWidget): BlockWidget {
        if (currentBlock instanceof ParagraphWidget &&
            this.documentHelper.layout.isFirstElementWithPageBreak(currentBlock)) {
            const nextBlock: BlockWidget = currentBlock.nextRenderedWidget as BlockWidget;
            if (nextBlock.equals(currentBlock)) {
                return nextBlock as BlockWidget;
            }
        }
        return currentBlock;
    }

    private updateListItems(blockAdv: BlockWidget, block: BlockWidget): boolean {
        let isListUpdated: boolean = false;
        if (blockAdv instanceof ParagraphWidget) {
            isListUpdated = this.updateListItemsForPara(blockAdv as ParagraphWidget, block);
        } else {
            isListUpdated = this.updateListItemsForTable(blockAdv as TableWidget, block);
        }
        return isListUpdated;
    }
    private updateListItemsForTable(table: TableWidget, block: BlockWidget): boolean {
        if (block instanceof TableWidget && table.equals(block)) {
            return true;
        }
        let row: TableRowWidget = table.firstChild as TableRowWidget;
        do {
            const isListUpdated: boolean = this.updateListItemsForRow(row, block);
            if (isListUpdated) {
                return true;
            }
            row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
        } while (row);
        return false;
    }
    private updateListItemsForRow(row: TableRowWidget, block: BlockWidget): boolean {
        if (block.isInsideTable && row.childWidgets.indexOf(this.documentHelper.selection.getContainerCell(block.associatedCell)) !== -1) {
            //Returns as list updated, inorder to start list numbering from first list paragraph of this row.
            return true;
        }
        let cell: TableCellWidget = row.firstChild as TableCellWidget;
        do {
            this.updateListItemsForCell(cell, block);
            cell = cell.nextRenderedWidget as TableCellWidget;
        } while (cell);
        return false;
    }
    private updateListItemsForCell(cell: TableCellWidget, block: BlockWidget): void {
        if (cell.childWidgets.length === 0) {
            return;
        }
        let currentBlock: BlockWidget = cell.firstChild as BlockWidget;
        do {
            this.updateListItems(currentBlock, block);
            currentBlock = currentBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        } while (currentBlock);
    }

    // public abstract updateListParagraphs(): void;
    /**
     * @param block
     * @private
     * @returns {void}
     */
    public updateRenderedListItems(block: BlockWidget): void {
        if (block instanceof ParagraphWidget) {
            this.updateRenderedListItemsForPara(block as ParagraphWidget);
        } else {
            this.updateRenderedListItemsForTable(block as TableWidget);
        }
    }
    private updateRenderedListItemsForTable(table: TableWidget): void {
        let row: TableRowWidget = table.firstChild as TableRowWidget;
        do {
            this.updateRenderedListItemsForRow(row);
            row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
        } while (row);
    }
    private updateRenderedListItemsForRow(row: TableRowWidget): void {
        let cell: TableCellWidget = row.firstChild as TableCellWidget;
        do {
            this.updateRenderedListItemsForCell(cell);
            cell = cell.nextRenderedWidget as TableCellWidget;
        } while (cell);
    }
    private updateRenderedListItemsForCell(cell: TableCellWidget): void {
        if (cell.childWidgets.length === 0) {
            return;
        }
        let currentBlock: BlockWidget = cell.firstChild as BlockWidget;
        do {
            this.updateRenderedListItems(currentBlock);
            currentBlock = currentBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        } while (currentBlock);
    }

    private updateListItemsForPara(paragraph: ParagraphWidget, block: BlockWidget): boolean {
        if (paragraph.equals(block)) {
            return true;
        } else {
            let currentList: WList = undefined;
            let levelNumber: number = 0;
            if (!isNullOrUndefined(paragraph.paragraphFormat) && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
                currentList = this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId);
                levelNumber = paragraph.paragraphFormat.listFormat.listLevelNumber;
            }
            if (!isNullOrUndefined(currentList) && !isNullOrUndefined(this.documentHelper.getAbstractListById(currentList.abstractListId))
                && !isNullOrUndefined(this.documentHelper.getAbstractListById(currentList.abstractListId).levels[levelNumber])) {
                const currentListLevel: WListLevel = this.documentHelper.layout.getListLevel(currentList, levelNumber);
                //Updates the list numbering from document start for reLayouting.
                this.updateListNumber(currentListLevel, paragraph, false);
            }
        }
        return false;
    }
    private updateRenderedListItemsForPara(paragraph: ParagraphWidget): void {

        if (!isNullOrUndefined(this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId))) {
            const currentList: WList = this.documentHelper.getListById(paragraph.paragraphFormat.listFormat.listId);
            const listLevelNumber: number = paragraph.paragraphFormat.listFormat.listLevelNumber;
            if (!isNullOrUndefined(currentList) && !isNullOrUndefined(this.documentHelper.getAbstractListById(currentList.abstractListId))

                && !isNullOrUndefined(this.documentHelper.getAbstractListById(currentList.abstractListId).levels[paragraph.paragraphFormat.listFormat.listLevelNumber])) {
                const currentListLevel: WListLevel = this.documentHelper.layout.getListLevel(currentList, listLevelNumber);
                //Updates the list numbering from document start for reLayouting.
                this.updateListNumber(currentListLevel, paragraph, true);
            }
        }
    }
    private updateListNumber(currentListLevel: WListLevel, paragraph: ParagraphWidget, isUpdate: boolean): void {
        if (currentListLevel.listLevelPattern !== 'Bullet') {
            let element: ListTextElementBox = undefined;
            if (paragraph.childWidgets.length > 0) {
                const lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
                if (lineWidget.children.length > 0) {
                    if (paragraph.paragraphFormat.bidi) {
                        element = lineWidget.children[lineWidget.children.length - 1] as ListTextElementBox;
                    } else {
                        element = lineWidget.children[0] as ListTextElementBox;
                    }
                }
            }
            if (!isNullOrUndefined(element) && element instanceof ListTextElementBox) {
                const text: string = this.documentHelper.layout.getListNumber(paragraph.paragraphFormat.listFormat);
                if (isUpdate) {
                    const prevWidth: number = element.width;
                    element.text = text;
                    const currentWidth: number = this.documentHelper.textHelper.getTextSize(element, element.characterFormat);
                    if (currentWidth > prevWidth) {
                        element.width = currentWidth;
                    }
                }
            }
        }
    }
    /**
     * Get offset value to update in selection
     *
     * @param selection
     * @private
     * @returns {void}
     */
    public getOffsetValue(selection: Selection): void {
        if (this.startParagraph) {
            const lineInfo: LineInfo = selection.getLineInfoBasedOnParagraph(this.startParagraph, this.startOffset);
            selection.start.setPositionFromLine(lineInfo.line, lineInfo.offset);
        }
        selection.start.updatePhysicalPosition(true);
        if (selection.isEmpty) {
            selection.end.setPositionInternal(selection.start);
        } else {
            if (this.endParagraph) {
                const lineInfo: LineInfo = selection.getLineInfoBasedOnParagraph(this.endParagraph, this.endOffset);
                selection.end.setPositionFromLine(lineInfo.line, lineInfo.offset);
            }
            selection.end.updatePhysicalPosition(true);
        }
    }

    private setPositionParagraph(paragraph: ParagraphWidget, offset: number, skipSelectionChange: boolean): void {
        const selection: Selection = this.documentHelper.selection;
        const lineInfo: LineInfo = selection.getLineInfoBasedOnParagraph(paragraph, offset);
        selection.start.setPositionFromLine(lineInfo.line, lineInfo.offset);
        selection.end.setPositionInternal(selection.start);
        if (!skipSelectionChange) {
            selection.fireSelectionChanged(true);
        }
    }
    /**
     * @param textPosition
     * @param editPosition
     * @param textPosition
     * @param editPosition
     * @private
     * @returns {void}
     */
    public setPositionForCurrentIndex(textPosition: TextPosition, editPosition: string): void {
        const blockInfo: ParagraphInfo = this.selection.getParagraph({ index: editPosition });
        const lineInfo: LineInfo = this.selection.getLineInfoBasedOnParagraph(blockInfo.paragraph, blockInfo.offset);
        textPosition.setPositionForLineWidget(lineInfo.line, lineInfo.offset);
    }
    /**
     * Insert page number in the current cursor position.
     *
     * @param {string} numberFormat - Optional switch that overrides the numeral style of the page number.
     * @returns {void}
     */
    public insertPageNumber(numberFormat?: string): void {
        if (isNullOrUndefined(numberFormat)) {
            numberFormat = '';
        } else {
            numberFormat = ' \\*' + numberFormat;
        }
        const fieldCode: string = 'PAGE ' + numberFormat + ' \\* MERGEFORMAT';
        this.createFields(fieldCode);
    }

    /**
     * @param numberFormat
     * @private
     * @returns {void}
     */
    public insertPageCount(numberFormat?: string): void {
        if (isNullOrUndefined(numberFormat)) {
            numberFormat = '';
        } else {
            numberFormat = ' \*' + numberFormat;
        }
        const fieldCode: string = 'NUMPAGES ' + numberFormat + ' \* MERGEFORMAT';
        this.createFields(fieldCode);
    }

    private createFields(fieldCode: string): void {
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const line: LineWidget = new LineWidget(paragraph);
        const fieldBegin: FieldElementBox = new FieldElementBox(0);
        line.children.push(fieldBegin);
        const fieldtext: FieldTextElementBox = new FieldTextElementBox();
        fieldtext.fieldBegin = fieldBegin;
        fieldtext.text = '1';
        const text: TextElementBox = new TextElementBox();
        text.text = fieldCode;
        line.children.push(text);
        const fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldBegin.fieldSeparator = fieldSeparator;
        line.children.push(fieldSeparator);
        line.children.push(fieldtext);
        const fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.fieldBegin = fieldBegin;
        fieldEnd.fieldSeparator = fieldSeparator;
        fieldSeparator.fieldEnd = fieldEnd;
        fieldBegin.fieldEnd = fieldEnd;
        line.children.push(fieldEnd);
        fieldBegin.line = line;
        paragraph.childWidgets.push(line);
        this.documentHelper.fields.push(fieldBegin);
        const bodyWidget: BodyWidget = new BodyWidget();
        bodyWidget.sectionFormat = new WSectionFormat(bodyWidget);
        bodyWidget.childWidgets.push(paragraph);
        this.pasteContentsInternal([bodyWidget], false);
    }
    /**
     * Insert Bookmark at current selection range
     *
     * @param {string} name - Name of bookmark
     * @returns {void}
     */
    public insertBookmark(name: string): void {
        if (this.documentHelper.bookmarks.containsKey(name)) {
            const existingBookmark: BookmarkElementBox = this.documentHelper.bookmarks.get(name);
            existingBookmark.line.children.splice(existingBookmark.line.children.indexOf(existingBookmark), 1);
            /* eslint-disable-next-line max-len */
            existingBookmark.reference.line.children.splice(existingBookmark.reference.line.children.indexOf(existingBookmark.reference), 1);
            this.documentHelper.bookmarks.remove(name);
        }
        const bookmark: BookmarkElementBox = new BookmarkElementBox(0);
        bookmark.name = name;
        const bookmarkEnd: BookmarkElementBox = new BookmarkElementBox(1);
        bookmarkEnd.name = name;
        bookmark.reference = bookmarkEnd;
        bookmarkEnd.reference = bookmark;
        this.initComplexHistory('InsertBookmark');
        this.insertElements([bookmarkEnd], [bookmark]);
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistoryInternal();
        }
        if (this.documentHelper.owner.enableHeaderAndFooter) {
            this.updateHeaderFooterWidget();
        }
        this.documentHelper.bookmarks.add(name, bookmark);
        this.selection.start.setPositionForSelection(bookmark.line, bookmark, 1, this.selection.start.location);
        this.selection.end.setPositionForSelection(bookmarkEnd.line, bookmarkEnd, 0, this.selection.end.location);
        this.selection.fireSelectionChanged(true);
        this.fireContentChange();
    }
    /**
     * Deletes specific bookmark
     *
     * @param {string} bookmarkName - Name of bookmark to delete.
     * @returns {void}
     */
    public deleteBookmark(bookmarkName: string): void {
        const bookmarks: Dictionary<string, BookmarkElementBox> = this.documentHelper.bookmarks;
        const bookmark: BookmarkElementBox = bookmarks.get(bookmarkName);
        if (bookmark instanceof BookmarkElementBox) {
            const bookmarkEnd: BookmarkElementBox = bookmark.reference;
            this.initHistory('DeleteBookmark');
            if (this.editorHistory) {
                this.editorHistory.currentBaseHistoryInfo.setBookmarkInfo(bookmark);
                this.editorHistory.updateHistory();
            }
            this.deleteBookmarkInternal(bookmark);
        }
        this.fireContentChange();
    }
    /**
     * @param bookmark
     * @private
     * @returns {void}
     */
    public deleteBookmarkInternal(bookmark: BookmarkElementBox): void {
        const previousNode: ElementBox = bookmark.previousNode;
        if (previousNode instanceof FieldElementBox && previousNode.fieldType === 0
            && !isNullOrUndefined(previousNode.formFieldData)) {
            previousNode.formFieldData.name = '';
        }
        this.documentHelper.bookmarks.remove(bookmark.name);
        bookmark.line.children.splice(bookmark.indexInOwner, 1);
        if (!isNullOrUndefined(bookmark.reference)) {
            bookmark.reference.line.children.splice(bookmark.reference.indexInOwner, 1);
        }
        // Remove bookmark from header footer collections
        const paragraph: ParagraphWidget = bookmark.line.paragraph;
        if (bookmark.line.paragraph.isInHeaderFooter) {
            let headerFooterWidget: HeaderFooterWidget = undefined;
            if (paragraph.containerWidget instanceof TableCellWidget) {

                headerFooterWidget = (paragraph.containerWidget as TableCellWidget).getContainerTable().containerWidget as HeaderFooterWidget;
            } else if (paragraph.containerWidget instanceof HeaderFooterWidget) {
                headerFooterWidget = paragraph.containerWidget;
            }
            this.updateHeaderFooterWidget(headerFooterWidget);
        }
    }

    private getSelectionInfo(): SelectionInfo {
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            start = this.selection.end;
            end = this.selection.start;
        }
        if (!(end.offset === this.selection.getLineLength(end.currentWidget) + 1
            && this.selection.isParagraphLastLine(end.currentWidget))) {
            end.offset += 1;
        }
        let blockInfo: ParagraphInfo = this.selection.getParagraphInfo(start);
        const startIndex: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        blockInfo = this.selection.getParagraphInfo(end);
        const endIndex: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        return { 'start': startIndex, 'end': endIndex };
    }

    private insertElements(endElements: ElementBox[], startElements?: ElementBox[]): void {
        const info: SelectionInfo = this.getSelectionInfo();
        if (!isNullOrUndefined(startElements)) {
            this.insertElementsInternal(this.selection.getTextPosBasedOnLogicalIndex(info.start), startElements);
        }
        if (!isNullOrUndefined(endElements)) {
            this.insertElementsInternal(this.selection.getTextPosBasedOnLogicalIndex(info.end), endElements);
        }

    }

    private insertElementsInternal(position: TextPosition, elements: ElementBox[], isRelayout?: boolean): void {
        this.selection.selectPosition(position, position);
        this.initHistory('InsertElements');
        this.updateInsertPosition();
        let indexInInline: number = 0;
        const paragraphInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
        if (this.selection.start.paragraph.isEmpty()) {
            const paragraph: ParagraphWidget = this.selection.start.paragraph as ParagraphWidget;
            (paragraph.childWidgets[0] as LineWidget).children.push(elements[0]);
            elements[0].line = (paragraph.childWidgets[0] as LineWidget);
            elements[0].linkFieldCharacter(this.documentHelper);
            this.documentHelper.layout.reLayoutParagraph(paragraph, 0, 0);
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);

            position.setPositionForSelection(elements[0].line, elements[0], elements[0].length, this.selection.start.location);
            this.selection.selectPosition(position, position);
        } else {

            const inlineObj: ElementInfo = this.selection.start.currentWidget.getInline(this.documentHelper.selection.start.offset, indexInInline);
            const curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            const firstElement: ElementBox = elements[0];
            this.insertElementInternal(curInline, firstElement, indexInInline, undefined, true);
            const index: number = firstElement.indexInOwner;
            let lastElement: ElementBox = firstElement;
            for (let i: number = 1; i < elements.length; i++) {
                lastElement = elements[i];
                firstElement.line.children.splice(index + i, 0, lastElement);
            }
            position.setPositionForSelection(lastElement.line, lastElement, lastElement.length, this.selection.start.location);
            this.selection.selectPosition(position, position);
        }
        if (this.editorHistory) {
            if (this.checkEndPosition()) {
                this.updateHistoryPosition(this.selection.start, false);
            }
            this.editorHistory.updateHistory();
        }
    }
    /**
     * @param index
     * @private
     * @returns {CommentElementBox}
     */
    public getCommentElementBox(index: string): CommentElementBox {
        const position: string[] = index.split(';');
        const comment: CommentElementBox = this.documentHelper.comments[parseInt(position[1], 10)];
        if (position.length > 2 && position[2] !== '') {
            return comment.replyComments[parseInt(position[2], 10)];
        }
        return comment;
    }
    /**
     * @param position
     * @private
     * @returns {BlockInfo}
     */
    public getBlock(position: IndexInfo): BlockInfo {
        const bodyWidget: BodyWidget = this.selection.getBodyWidget(position);
        return this.getBlockInternal(bodyWidget, position);
    }

    private getBlockInternal(widget: Widget, position: IndexInfo): BlockInfo {
        if (position.index === '' || isNullOrUndefined(position)) {
            return undefined;
        }
        let index: number = position.index.indexOf(';');
        const value: string = position.index.substring(0, index);
        position.index = position.index.substring(index).replace(';', '');
        const node: Widget = widget;
        // if (node instanceof WSection && value === 'HF') {
        //     //Gets the block in Header footers.
        //     let blockObj: BlockInfo = this.getBlock((node as WSection).headerFooters, position);

        //     return { 'node': (!isNullOrUndefined(blockObj)) ? blockObj.node : undefined, 'position': (!isNullOrUndefined(blockObj)) ? blockObj.position : undefined };
        // }
        index = parseInt(value, 10);
        const childWidget: Widget = this.selection.getBlockByIndex(widget, index);
        if (childWidget) {
            const child: Widget = childWidget as Widget;
            if (position.index.indexOf(';') >= 0) {
                if (child instanceof ParagraphWidget) {
                    if (position.index.indexOf(';') >= 0) {
                        position.index = '0';
                    }
                    return { 'node': child as ParagraphWidget, 'position': position };
                }
                if (child instanceof Widget) {
                    const blockObj: BlockInfo = this.getBlockInternal((child as Widget), position);

                    return { 'node': (!isNullOrUndefined(blockObj)) ? blockObj.node : undefined, 'position': (!isNullOrUndefined(blockObj)) ? blockObj.position : undefined };
                }
            } else {
                return { 'node': child as BlockWidget, 'position': position };
            }
        } else {
            return { 'node': node as BlockWidget, 'position': position };
        }
        return { 'node': node as BlockWidget, 'position': position };
    }
    /**
     * @param position
     * @param isInsertPosition
     * @private
     * @returns {void}
     */
    public updateHistoryPosition(position: TextPosition | string, isInsertPosition: boolean): void {
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            let hierarchicalIndex: string;
            if (position instanceof TextPosition) {
                const blockInfo: ParagraphInfo = this.selection.getParagraphInfo(position);
                hierarchicalIndex = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            } else {
                hierarchicalIndex = position;
            }
            if (isInsertPosition) {
                this.editorHistory.currentBaseHistoryInfo.insertPosition = hierarchicalIndex;
            } else {
                this.editorHistory.currentBaseHistoryInfo.endPosition = hierarchicalIndex;
            }
        }
    }

    /**
     * Applies the borders based on given settings.
     *
     * @param {BorderSettings} settings
     * @returns {void}
     */
    public applyBorders(settings: BorderSettings): void {
        this.initHistory('Borders');
        const startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        const endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        let table: TableWidget = startPos.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        if (this.editorHistory) {
            const clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
        }
        const startCell: TableCellWidget = startPos.paragraph.associatedCell;
        const endCell: TableCellWidget = endPos.paragraph.associatedCell;
        let cells: TableCellWidget[];
        const border: WBorder = this.getBorder(settings.borderColor, settings.lineWidth, settings.borderStyle);
        if (this.selection.isEmpty) {
            //Apply borders for current selected cell initially.
            if (settings.type === 'OutsideBorders' || settings.type === 'AllBorders' ||
                settings.type === 'LeftBorder') {
                endCell.cellFormat.borders.left.copyFormat(border);
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'AllBorders' ||
                settings.type === 'TopBorder') {
                endCell.cellFormat.borders.top.copyFormat(border);
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'AllBorders' ||
                settings.type === 'RightBorder') {
                endCell.cellFormat.borders.right.copyFormat(border);
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'AllBorders' ||
                settings.type === 'BottomBorder') {
                endCell.cellFormat.borders.bottom.copyFormat(border);
            }
            if (settings.type === 'AllBorders' || settings.type === 'InsideBorders'
                || settings.type === 'InsideVerticalBorder') {
                endCell.cellFormat.borders.vertical.copyFormat(border);
            }
            if (settings.type === 'AllBorders' || settings.type === 'InsideBorders'
                || settings.type === 'InsideHorizontalBorder') {
                endCell.cellFormat.borders.horizontal.copyFormat(border);
            }
            if (settings.type === 'NoBorder') {
                this.clearAllBorderValues(endCell.cellFormat.borders);
            }
        } else {
            if (settings.type === 'OutsideBorders' || settings.type === 'TopBorder') {
                const selectedCell: TableCellWidget[] = this.getTopBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.top.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'LeftBorder') {
                const selectedCell: TableCellWidget[] = this.getLeftBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.left.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'RightBorder') {
                const selectedCell: TableCellWidget[] = this.getRightBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.right.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'BottomBorder') {
                const selectedCell: TableCellWidget[] = this.getBottomBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.bottom.copyFormat(border);
                }
            }
        }
        //Apply Only borders property to selected cells
        if (settings.type === 'BottomBorder' || settings.type === 'AllBorders' || settings.type === 'OutsideBorders'
            || settings.type === 'NoBorder') {
            cells = this.getAdjacentCellToApplyBottomBorder();
            for (let i: number = 0; i < cells.length; i++) {
                const cell: TableCellWidget = cells[i];
                if (settings.type === 'NoBorder') {
                    cell.cellFormat.borders.top.copyFormat(this.clearBorder());
                } else {
                    cell.cellFormat.borders.top.copyFormat(border);
                }
            }
        }
        if (settings.type === 'AllBorders' || settings.type === 'OutsideBorders' || settings.type === 'RightBorder'
            || settings.type === 'NoBorder') {
            cells = this.getAdjacentCellToApplyRightBorder();
            for (let i: number = 0; i < cells.length; i++) {
                const cell: TableCellWidget = cells[i];
                if (settings.type === 'NoBorder') {
                    cell.cellFormat.borders.left.copyFormat(this.clearBorder());
                } else {
                    cell.cellFormat.borders.left.copyFormat(border);
                }
            }
        }
        if (settings.type === 'AllBorders' || settings.type === 'NoBorder') {
            this.applyAllBorders(border, settings.type);
        }
        if (settings.type === 'InsideBorders' || settings.type === 'InsideVerticalBorder'
            || settings.type === 'InsideHorizontalBorder' || settings.type === 'NoBorder') {
            this.applyInsideBorders(border, settings.type, table);
        }
        this.updateGridForTableDialog(table, false);
        this.reLayout(this.selection, false);
        this.editorHistory.updateHistory();
    }
    private applyAllBorders(border: WBorder, borderType: BorderType): void {
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            if (borderType === 'NoBorder') {
                cells[i].cellFormat.borders.left.copyFormat(this.clearBorder());
                cells[i].cellFormat.borders.right.copyFormat(this.clearBorder());
                cells[i].cellFormat.borders.top.copyFormat(this.clearBorder());
                cells[i].cellFormat.borders.bottom.copyFormat(this.clearBorder());
            } else {
                cells[i].cellFormat.borders.left.copyFormat(border);
                cells[i].cellFormat.borders.right.copyFormat(border);
                cells[i].cellFormat.borders.top.copyFormat(border);
                cells[i].cellFormat.borders.bottom.copyFormat(border);
            }
        }
    }
    private applyInsideBorders(border: WBorder, borderType: BorderType, table: TableWidget): void {
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            const cell: TableCellWidget = cells[i];
            const isLastSelectedRow: boolean = cell.ownerRow === cells[cells.length - 1].ownerRow;
            const isLastRightCell: boolean = (cell.columnIndex + cell.cellFormat.columnSpan - 1) === cells[cells.length - 1].columnIndex;
            if (borderType === 'NoBorder') {
                cell.cellFormat.borders.right.copyFormat(this.clearBorder());
                cell.cellFormat.borders.bottom.copyFormat(this.clearBorder());
            } else {
                if (!isLastRightCell && borderType !== 'InsideHorizontalBorder') {
                    cell.cellFormat.borders.right.copyFormat(border);
                }
                if (!isLastSelectedRow && borderType !== 'InsideVerticalBorder') {
                    cell.cellFormat.borders.bottom.copyFormat(border);
                }
            }
            if (!isLastSelectedRow && borderType !== 'InsideVerticalBorder') {
                // Apply adjacent bottom borders.
                const nextRowIndex: number = cell.ownerRow.rowIndex + cell.cellFormat.rowSpan;
                const nextRow: TableRowWidget = table.childWidgets[nextRowIndex] as TableRowWidget;
                if (nextRow) {
                    const selectedCells: TableCellWidget[] = this.getAdjacentBottomBorderOnEmptyCells(nextRow, cell, true);
                    for (let j: number = 0; j < selectedCells.length; j++) {
                        if (borderType === 'NoBorder') {
                            selectedCells[j].cellFormat.borders.top.copyFormat(this.clearBorder());
                        } else {
                            selectedCells[j].cellFormat.borders.top.copyFormat(border);
                        }
                    }
                }
            }
            if (!isLastRightCell && borderType !== 'InsideHorizontalBorder') {
                // Apply adjacent right borders.
                const rightBorderCells: TableCellWidget[] = this.getSelectedCellsNextWidgets(cell, table);
                for (let k: number = 0; k < rightBorderCells.length; k++) {
                    if (borderType === 'NoBorder') {
                        rightBorderCells[k].cellFormat.borders.left.copyFormat(this.clearBorder());
                    } else {
                        rightBorderCells[k].cellFormat.borders.left.copyFormat(border);
                    }
                }
            }
        }
    }

    private getTopBorderCellsOnSelection(): TableCellWidget[] {
        const startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        const startCell: TableCellWidget = startPos.paragraph.associatedCell;
        const topBorderCells: TableCellWidget[] = [];
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].ownerRow === startCell.ownerRow) {
                topBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return topBorderCells;
    }

    private getLeftBorderCellsOnSelection(): TableCellWidget[] {
        const startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        const startCell: TableCellWidget = startPos.paragraph.associatedCell;
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        const leftBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].columnIndex === startCell.columnIndex) {
                leftBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return leftBorderCells;
    }

    private getRightBorderCellsOnSelection(): TableCellWidget[] {
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        const rightBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if ((cells[i].columnIndex + cells[i].cellFormat.columnSpan - 1) === cells[cells.length - 1].columnIndex) {
                rightBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return rightBorderCells;
    }

    private getBottomBorderCellsOnSelection(): TableCellWidget[] {
        const endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        const endCell: TableCellWidget = endPos.paragraph.associatedCell;
        const cells: TableCellWidget[] = this.selection.getSelectedCells();
        const bottomBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].ownerRow === endCell.ownerRow) {
                bottomBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return bottomBorderCells;
    }

    private clearAllBorderValues(borders: WBorders): void {
        const border: WBorder = this.clearBorder();
        borders.bottom.copyFormat(border);
        borders.left.copyFormat(border);
        borders.right.copyFormat(border);
        borders.top.copyFormat(border);
        borders.vertical.copyFormat(border);
        borders.horizontal.copyFormat(border);
    }
    private clearBorder(): WBorder {
        const border: WBorder = new WBorder();
        border.lineStyle = 'Cleared';
        return border;
    }

    private getAdjacentCellToApplyBottomBorder(): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        let startPos: TextPosition = this.selection.start;
        let endPos: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPos = this.selection.end;
            endPos = this.selection.start;
        }
        let table: TableWidget = startPos.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        const startCell: TableCellWidget = startPos.paragraph.associatedCell;
        const endCell: TableCellWidget = endPos.paragraph.associatedCell;
        const nextRowIndex: number = endCell.ownerRow.rowIndex + endCell.cellFormat.rowSpan;
        const nextRow: TableRowWidget = table.childWidgets[nextRowIndex] as TableRowWidget;
        if (nextRow) {
            if (endCell.cellFormat.columnSpan > 1) {
                for (let i: number = endCell.columnIndex; i < endCell.columnIndex + endCell.cellFormat.columnSpan; i++) {
                    cells.push(nextRow.childWidgets[i] as TableCellWidget);
                }
            } else {
                cells = this.getAdjacentBottomBorderOnEmptyCells(nextRow, endCell);
                if (!this.selection.isEmpty) {
                    for (let i: number = 0; i < nextRow.childWidgets.length; i++) {
                        const nextCellColIndex: number = (nextRow.childWidgets[i] as TableCellWidget).columnIndex;
                        if (nextCellColIndex >= startCell.columnIndex && nextCellColIndex <= endCell.columnIndex) {
                            cells.push(nextRow.childWidgets[i] as TableCellWidget);
                        }
                    }
                }
            }
        }
        return cells;
    }
    private getAdjacentBottomBorderOnEmptyCells(nextRow: TableRowWidget, cell: TableCellWidget, isSingleCell?: boolean): TableCellWidget[] {
        const cells: TableCellWidget[] = [];
        if (cell.cellFormat.columnSpan > 1) {
            for (let i: number = cell.columnIndex; i < cell.columnIndex + cell.cellFormat.columnSpan; i++) {
                cells.push(nextRow.childWidgets[i] as TableCellWidget);
            }
        } else {
            if (this.selection.isEmpty || isSingleCell) {
                for (let i: number = 0; i < nextRow.childWidgets.length; i++) {
                    if ((nextRow.childWidgets[i] as TableCellWidget).columnIndex === cell.columnIndex) {
                        cells.push(nextRow.childWidgets[i] as TableCellWidget);
                    }
                }
            }
        }
        return cells;
    }

    private getAdjacentCellToApplyRightBorder(): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        let startPosIn: TextPosition = this.selection.start;
        let endPosIn: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPosIn = this.selection.end;
            endPosIn = this.selection.start;
        }
        let table: TableWidget = startPosIn.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.owner.viewer) as TableWidget;
        const startCell: TableCellWidget = startPosIn.paragraph.associatedCell;
        const endCell: TableCellWidget = endPosIn.paragraph.associatedCell;
        if (this.selection.isEmpty) {
            const selectedCell: TableCellWidget = startPosIn.paragraph.associatedCell;
            cells = this.getSelectedCellsNextWidgets(selectedCell, table);
        } else {

            const selectedCells: TableCellWidget[] = this.getRightBorderCellsOnSelection();
            for (let i: number = 0; i < selectedCells.length; i++) {
                const cell: TableCellWidget = selectedCells[i] as TableCellWidget;
                cells = cells.concat(this.getSelectedCellsNextWidgets(cell, table));

            }
        }
        return cells;
    }
    private getSelectedCellsNextWidgets(selectedCell: TableCellWidget, table: TableWidget): TableCellWidget[] {
        const cells: TableCellWidget[] = [];
        if (!isNullOrUndefined(selectedCell.nextWidget)) {
            cells.push(selectedCell.nextWidget as TableCellWidget);
            if (selectedCell.cellFormat.rowSpan > 1) {
                const nextRowIndex: number = selectedCell.ownerRow.rowIndex + selectedCell.cellFormat.rowSpan;
                for (let i: number = selectedCell.ownerRow.rowIndex + 1; i < nextRowIndex; i++) {
                    const nextRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                    if (nextRow) {
                        for (let j: number = 0; j < nextRow.childWidgets.length; j++) {
                            if ((nextRow.childWidgets[j] as TableCellWidget).columnIndex ===
                                (selectedCell.nextWidget as TableCellWidget).columnIndex) {
                                cells.push(nextRow.childWidgets[j] as TableCellWidget);
                            }
                        }
                    }
                }
            }
        }
        return cells;
    }

    private getBorder(borderColor: string, lineWidth: number, borderStyle: LineStyle): WBorder {
        const border: WBorder = new WBorder();
        border.color = borderColor || '#000000';
        border.lineWidth = lineWidth || 1;
        border.lineStyle = borderStyle || 'Single';
        return border;
    }

    /**
     * Applies borders
     *
     * @param {WBorders} sourceBorders
     * @param {WBorders} applyBorders
     * @private
     * @returns {void}
     */
    public applyBordersInternal(sourceBorders: WBorders, applyBorders: WBorders): void {
        if (!isNullOrUndefined(sourceBorders) && !isNullOrUndefined(sourceBorders)) {
            if (!isNullOrUndefined(sourceBorders.top)) {
                this.applyBorder(sourceBorders.top, applyBorders.top);
            }
            if (!isNullOrUndefined(sourceBorders.bottom)) {
                this.applyBorder(sourceBorders.bottom, applyBorders.bottom);
            }
            if (!isNullOrUndefined(sourceBorders.left)) {
                this.applyBorder(sourceBorders.left, applyBorders.left);
            }
            if (!isNullOrUndefined(sourceBorders.right)) {
                this.applyBorder(sourceBorders.right, applyBorders.right);
            }
            if (!isNullOrUndefined(sourceBorders.horizontal)) {
                this.applyBorder(sourceBorders.horizontal, applyBorders.horizontal);
            }
            if (!isNullOrUndefined(sourceBorders.vertical)) {
                this.applyBorder(sourceBorders.vertical, applyBorders.vertical);
            }
            if (!isNullOrUndefined(sourceBorders.diagonalUp)) {
                this.applyBorder(sourceBorders.diagonalUp, applyBorders.diagonalUp);
            }
            if (!isNullOrUndefined(sourceBorders.diagonalDown)) {
                this.applyBorder(sourceBorders.diagonalDown, applyBorders.diagonalDown);
            }
        }
    }
    /**
     * Apply shading to table
     *
     * @param {WShading} sourceShading
     * @param {WShading} applyShading
     * @private
     * @returns {void}
     */
    public applyShading(sourceShading: WShading, applyShading: WShading): void {
        if (!isNullOrUndefined(applyShading) && !isNullOrUndefined(sourceShading)) {
            if (!isNullOrUndefined(applyShading.backgroundColor)
                && sourceShading.backgroundColor !== applyShading.backgroundColor) {
                sourceShading.backgroundColor = applyShading.backgroundColor;
            }
            if (!isNullOrUndefined(applyShading.foregroundColor)
                && sourceShading.foregroundColor !== applyShading.foregroundColor) {
                sourceShading.foregroundColor = applyShading.foregroundColor;
            }
            if (!isNullOrUndefined(applyShading.textureStyle)
                && sourceShading.textureStyle !== applyShading.textureStyle) {
                sourceShading.textureStyle = applyShading.textureStyle;
            }
        }
    }
    private applyBorder(sourceBorder: WBorder, applyBorder: WBorder): void {
        if (!isNullOrUndefined(sourceBorder) && !isNullOrUndefined(applyBorder)) {
            if (!isNullOrUndefined(applyBorder.color)
                && sourceBorder.color !== applyBorder.color) {
                sourceBorder.color = applyBorder.color;
            }
            if (!isNullOrUndefined(applyBorder.lineStyle)
                && sourceBorder.lineStyle !== applyBorder.lineStyle) {
                sourceBorder.lineStyle = applyBorder.lineStyle;
            }
            if (!isNullOrUndefined(applyBorder.lineWidth)
                && sourceBorder.lineWidth !== applyBorder.lineWidth) {
                sourceBorder.lineWidth = applyBorder.lineWidth;
            }
            if (!isNullOrUndefined(applyBorder.shadow)
                && sourceBorder.shadow !== applyBorder.shadow) {
                sourceBorder.shadow = applyBorder.shadow;
            }
            if (!isNullOrUndefined(applyBorder.space)
                && sourceBorder.space !== applyBorder.space) {
                sourceBorder.space = applyBorder.space;
            }
        }
    }
    /**
     * Apply Table Format changes
     *
     * @param {WTableFormat} format Specifies table format
     * @param {boolean} isShading Specifies shading.
     * @private
     * @returns {void}
     */
    public onTableFormat(format: WTableFormat, isShading?: boolean): void {
        if (!isNullOrUndefined(this.selection.tableFormat)) {
            if (isNullOrUndefined(isShading)) {
                isShading = false;
            }
            this.documentHelper.owner.isShiftingEnabled = true;
            this.editorHistory.initializeHistory('TableFormat');

            const table: TableWidget = this.selection.start.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
            if (isShading) {
                for (let i: number = 0; i < table.childWidgets.length; i++) {
                    const rowWidget: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                    for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                        const cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                        cellWidget.cellFormat.shading.copyFormat(format.shading);
                    }
                }
            }
            this.applyTableFormat(table, undefined, format);
            this.reLayout(this.selection, false);
        }
    }

    private applyTableFormat(table: TableWidget, property: string, value: object): void {
        this.applyTablePropertyValue(this.documentHelper.selection, undefined, value, table);
    }

    private applyTablePropertyValue(selection: Selection, property: string, value: Object, table: TableWidget): void {
        const sourceFormat: WTableFormat = table.tableFormat;
        if (!isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedTableProperties(sourceFormat, property, value);
        }
        if (value instanceof WTableFormat) {
            if (isNullOrUndefined(property)) {
                this.handleTableFormat(sourceFormat, value);
            }
            return;
        }
        if (property === 'preferredWidth') {
            sourceFormat.preferredWidth = value as number;
        } else if (property === 'leftIndent') {
            sourceFormat.leftIndent = value as number;
        } else if (property === 'tableAlignment') {
            sourceFormat.tableAlignment = <TableAlignment>value;
        } else if (property === 'cellSpacing') {
            sourceFormat.cellSpacing = value as number;
        } else if (property === 'leftMargin') {
            sourceFormat.leftMargin = value as number;
        } else if (property === 'rightMargin') {
            sourceFormat.rightMargin = value as number;
        } else if (property === 'topMargin') {
            sourceFormat.topMargin = value as number;
        } else if (property === 'bottomMargin') {
            sourceFormat.bottomMargin = value as number;
        } else if (property === 'preferredWidthType') {
            sourceFormat.preferredWidthType = value as WidthType;
        } else if (property === 'bidi') {
            sourceFormat.bidi = value as boolean;
        }
        if (property === 'shading') {
            sourceFormat.shading = <WShading>value;
        } else if (property === 'borders') {
            sourceFormat.borders = <WBorders>value;
        }
        // if (!isNullOrUndefined(table)) {
        //     this.layoutItemBlock(table, true);
        // }
    }
    private handleTableFormat(tableFormat: WTableFormat, applyFormat: WTableFormat): void {
        if (this.isBordersAndShadingDialog || this.editorHistory.isUndoing
            || this.editorHistory.isRedoing) {
            if (!isNullOrUndefined(tableFormat.borders)) {
                this.applyBordersInternal(tableFormat.borders, applyFormat.borders);
            }
            if (!isNullOrUndefined(tableFormat.shading)) {
                this.applyShading(tableFormat.shading, applyFormat.shading);
            }
        }
        if (!this.isBordersAndShadingDialog) {
            if (applyFormat.hasValue('bidi') && applyFormat.bidi !== tableFormat.bidi) {
                tableFormat.bidi = applyFormat.bidi;
            }
            if (applyFormat.hasValue('preferredWidth') && applyFormat.preferredWidth !== tableFormat.preferredWidth) {
                tableFormat.preferredWidth = applyFormat.preferredWidth;
            }
            if (applyFormat.hasValue('preferredWidthType') && applyFormat.preferredWidthType !== tableFormat.preferredWidthType) {
                tableFormat.preferredWidthType = applyFormat.preferredWidthType;
            }
            if (applyFormat.hasValue('tableAlignment') && applyFormat.tableAlignment !== tableFormat.tableAlignment) {
                tableFormat.tableAlignment = applyFormat.tableAlignment;
            }
            if (applyFormat.hasValue('leftIndent') && applyFormat.leftIndent !== tableFormat.leftIndent) {
                tableFormat.leftIndent = applyFormat.leftIndent;
            }
        }
        this.updateGridForTableDialog(tableFormat.ownerBase as TableWidget, false);
    }
    private updateGridForTableDialog(table: TableWidget, shiftNextItem: boolean): void {
        if (table.tableHolder) {
            table.updateRowIndex(0);
            table.calculateGrid();
            table.isGridUpdated = false;
        }
        this.documentHelper.layout.reLayoutTable(table);
    }
    /**
     * Applies Row Format Changes
     *
     * @param {WRowFormat} format Specifies row format
     * @private
     * @returns {void}
     */
    public onRowFormat(format: WRowFormat): void {
        if (isNullOrUndefined(this.selection) || isNullOrUndefined(format)) {
            return;
        }
        this.editorHistory.initializeHistory('RowFormat');
        this.documentHelper.owner.isShiftingEnabled = true;
        const rowStartPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        const rowEndPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        const table: TableWidget = rowStartPos.paragraph.associatedCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
        this.applyRowFormat(rowStartPos.paragraph.associatedCell.ownerRow, rowStartPos, rowEndPos, undefined, format);
        this.reLayout(this.selection, false);
    }
    private applyRowFormat(row: TableRowWidget, start: TextPosition, end: TextPosition, property: string, value: Object): void {
        this.applyRowPropertyValue(this.documentHelper.selection, property, value, row);
        if (end.paragraph.associatedCell.ownerRow === row) {
            return;
        }
        const newRow: TableRowWidget = row.nextWidget as TableRowWidget;
        if (!isNullOrUndefined(newRow)) {
            this.applyRowFormat(newRow, start, end, property, value);
        }
    }
    private applyRowPropertyValue(selection: Selection, property: string, value: Object, row: TableRowWidget): void {
        const applyFormat: WRowFormat = row.rowFormat;
        if (!isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedRowProperties(applyFormat, property, value);
        }
        if (value instanceof WRowFormat) {
            if (isNullOrUndefined(property)) {
                this.handleRowFormat(value as WRowFormat, applyFormat);
            }
            return;
        }
        if (property === 'heightType') {
            applyFormat.heightType = value as HeightType;
        } else if (property === 'height') {
            applyFormat.height = value as number;
        } else if (property === 'isHeader') {
            applyFormat.isHeader = value as boolean;
        } else if (property === 'allowBreakAcrossPages') {
            applyFormat.allowBreakAcrossPages = value as boolean;
        }
        if (!isNullOrUndefined(row.ownerTable)) {
            this.layoutItemBlock(row.ownerTable, true);
        }
    }
    private handleRowFormat(format: WRowFormat, applyFormat: WRowFormat): void {
        if (format.hasValue('allowBreakAcrossPages') && format.allowBreakAcrossPages !== applyFormat.allowBreakAcrossPages) {
            applyFormat.allowBreakAcrossPages = format.allowBreakAcrossPages;
        }
        if (format.hasValue('isHeader') && format.isHeader !== applyFormat.isHeader) {
            applyFormat.isHeader = format.isHeader;
        }
        if (format.hasValue('heightType') && format.heightType !== applyFormat.heightType) {
            applyFormat.heightType = format.heightType;
        }
        if (format.hasValue('height') && format.height !== applyFormat.height) {
            applyFormat.height = format.height;
        }
        this.updateGridForTableDialog((applyFormat.ownerBase as TableRowWidget).ownerTable, true);
    }
    /**
     * Applies Cell Format changes
     *
     * @param {WCellFormat} format Specifies cell format
     * @private
     * @returns {void}
     */
    public onCellFormat(format: WCellFormat): void {
        if (isNullOrUndefined(this.selection) || isNullOrUndefined(format)) {
            return;
        }
        this.editorHistory.initializeHistory('CellFormat');
        this.updateFormatForCell(this.selection, undefined, format);
        this.reLayout(this.selection, false);
    }
    /**
     * @param selection
     * @param value
     * @private
     * @returns {void}
     */
    public updateCellMargins(selection: Selection, value: WCellFormat): void {
        let cellStartPosition: TextPosition = selection.start;
        let cellEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            cellStartPosition = selection.end;
            cellEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, cellStartPosition);

        this.documentHelper.owner.cellOptionsDialogModule.applyCellMarginValue(cellStartPosition.paragraph.associatedCell.ownerRow, cellStartPosition, cellEndPosition, value);
    }

    private updateFormatForCell(selection: Selection, property: string, value: Object): void {
        let start: TextPosition = selection.start;
        let end: TextPosition = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        const startCell: TableCellWidget = start.paragraph.associatedCell;
        const endCell: TableCellWidget = end.paragraph.associatedCell;
        let cells: TableCellWidget[];
        const table: TableWidget = startCell.ownerTable.combineWidget(this.owner.viewer) as TableWidget;
        let appliedFormat: WCellFormat;
        for (let k: number = startCell.columnIndex; k <= endCell.columnIndex; k++) {
            cells = this.getSelectedCellInColumn(startCell.ownerTable, startCell.ownerRow.rowIndex, k, endCell.ownerRow.rowIndex);
            for (let i: number = 0; i < cells.length; i++) {
                appliedFormat = this.applyCellPropertyValue(this.documentHelper.selection, property, value, cells[i].cellFormat);
            }
        }
        this.updateGridForTableDialog(table, false);
    }

    private getSelectedCellInColumn(table: TableWidget, rowStartIndex: number, columnIndex: number, rowEndIndex: number): TableCellWidget[] {
        const cells: TableCellWidget[] = [];
        for (let i: number = rowStartIndex; i <= rowEndIndex; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                if ((row.childWidgets[j] as TableCellWidget).columnIndex === columnIndex) {
                    cells.push(row.childWidgets[j] as TableCellWidget);
                }
            }
        }
        return cells;
    }
    private getColumnCells(table: TableWidget, columnIndex: number, isLeftSideCollection: boolean): TableCellWidget[] {
        const cells: TableCellWidget[] = [];
        for (let k: number = 0; k < table.childWidgets.length; k++) {
            const row: TableRowWidget = table.childWidgets[k] as TableRowWidget;
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                const cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                if (isLeftSideCollection) {
                    if (cell.columnIndex + cell.cellFormat.columnSpan === columnIndex) {
                        cells.push(cell);
                    }
                } else {
                    if (cell.columnIndex === columnIndex) {
                        cells.push(cell);
                    }
                }
            }
        }
        return cells;
    }

    private getTableWidth(table: TableWidget): number {
        if (table.tableFormat.preferredWidth !== 0 || table.tableFormat.preferredWidthType === 'Percent') {
            if (table.tableFormat.preferredWidthType === 'Auto' || table.tableFormat.preferredWidthType === 'Point') {
                return table.tableFormat.preferredWidth;
            } else {
                if (table.tableFormat.preferredWidth === 0) {
                    return 0;
                } else {
                    return HelperMethods.convertPixelToPoint(this.owner.viewer.clientArea.width) / 100 * table.tableFormat.preferredWidth;
                }
            }
        }
        return HelperMethods.convertPixelToPoint(this.documentHelper.layout.getTableWidth(table));
    }
    private applyCellPropertyValue(selection: Selection, property: string, value: Object, applyFormat: WCellFormat): WCellFormat {
        if (!isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            value = this.editorHistory.currentBaseHistoryInfo.addModifiedCellProperties(applyFormat, property, value);
        }
        if (value instanceof WCellFormat) {
            if (isNullOrUndefined(property)) {
                this.handleCellFormat(value as WCellFormat, applyFormat);
            }
            return value;
        }
        if (property === 'leftMargin') {
            applyFormat.leftMargin = value as number;
        } else if (property === 'topMargin') {
            applyFormat.topMargin = value as number;
        } else if (property === 'rightMargin') {
            applyFormat.rightMargin = value as number;
        } else if (property === 'bottomMargin') {
            applyFormat.bottomMargin = value as number;
        } else if (property === 'preferredWidth') {
            applyFormat.preferredWidth = value as number;
            applyFormat.cellWidth = value as number;
        } else if (property === 'cellWidth') {
            applyFormat.cellWidth = value as number;
        } else if (property === 'columnSpan') {
            applyFormat.columnSpan = value as number;
        } else if (property === 'rowSpan') {
            applyFormat.rowSpan = value as number;
        } else if (property === 'preferredWidthType') {
            applyFormat.preferredWidthType = <WidthType>value;
        } else if (property === 'verticalAlignment') {
            applyFormat.verticalAlignment = <CellVerticalAlignment>value;
        }
        if (property === 'shading') {
            applyFormat.shading = <WShading>value;
        } else if (property === 'borders') {
            applyFormat.borders = <WBorders>value;
        }
        return undefined;
    }
    private handleCellFormat(cellFormat: WCellFormat, applyFormat: WCellFormat): void {
        if (!isNullOrUndefined(cellFormat) && !isNullOrUndefined(applyFormat)) {
            if (this.isBordersAndShadingDialog) {
                if (!isNullOrUndefined(cellFormat.borders)) {
                    this.applyBordersInternal(applyFormat.borders, cellFormat.borders);
                }
                if (!isNullOrUndefined(cellFormat.shading)) {
                    this.applyShading(applyFormat.shading, cellFormat.shading);
                }
                // this.layoutRow((applyFormat.ownerBase as TableCellWidget).ownerRow, this.documentHelper, false);
            } else {
                if (cellFormat.hasValue('preferredWidth') && applyFormat.preferredWidth !== cellFormat.preferredWidth) {
                    applyFormat.preferredWidth = cellFormat.preferredWidth;
                }
                if (cellFormat.hasValue('preferredWidthType') && applyFormat.preferredWidthType !== cellFormat.preferredWidthType) {
                    applyFormat.preferredWidthType = cellFormat.preferredWidthType;
                }
                if (cellFormat.hasValue('verticalAlignment') && applyFormat.verticalAlignment !== cellFormat.verticalAlignment) {
                    applyFormat.verticalAlignment = cellFormat.verticalAlignment;
                }
            }
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        this.nodes = [];
    }
    /**
     * Updates the table of contents.
     *
     * @param tocField
     * @private
     * @returns {void}
     */
    public updateToc(tocField?: FieldElementBox): void {
        if (isNullOrUndefined(tocField)) {
            tocField = this.selection.getTocFieldInternal();
        }
        if (!this.documentHelper.layout.isTocField(tocField)) {
            return;
        }
        // Decode field code to get parameters
        const code: string = this.selection.getFieldCode(tocField);
        if (code.toLocaleLowerCase().indexOf('toc') !== -1) {
            this.insertTableOfContents(this.validateTocSettings(this.getTocSettings(code, tocField)));
        }

    }
    private getTocSettings(code: string, tocField: FieldElementBox): TableOfContentsSettings {
        const tocSettings: TableOfContentsSettings = {};
        tocSettings.includePageNumber = true;
        tocSettings.rightAlign = true;
        // Decode field code to get parameters

        if (code.toLowerCase() === 'toc \\mergeformat') {
            tocSettings.startLevel = 1;
            tocSettings.endLevel = 3;
        } else {
            const swtiches: string[] = code.split('\\');
            for (let i: number = 0; i < swtiches.length; i++) {
                const swtch: string = swtiches[i];
                if (swtch.length === 0) {
                    continue;
                }
                switch (swtch[0]) {
                case 'o':
                    if (!isNullOrUndefined(swtch.match(/\d+/g))) {
                        const levels: number[] = swtch.match(/\d+/g).map(Number);
                        tocSettings.startLevel = levels[0];
                        tocSettings.endLevel = levels[1];
                    } else {
                        tocSettings.startLevel = 1;
                        tocSettings.endLevel = 9;
                    }

                    break;
                case 'h':
                    tocSettings.includeHyperlink = true;
                    break;

                case 'n':
                    tocSettings.includePageNumber = false;
                    break;

                case 'p':
                    tocSettings.rightAlign = false;
                    break;

                case 'u':
                    tocSettings.includeOutlineLevels = true;
                    break;

                case 't':
                    this.decodeTSwitch(tocSettings, swtch);
                    break;
                }
            }
        }
        //assigns tab leader.
        const tabs: WTabStop[] = tocField.paragraph.paragraphFormat.getUpdatedTabs();
        if (tabs.length > 0) {
            tocSettings.tabLeader = tabs[tabs.length - 1].tabLeader;
        }
        if (tocSettings.rightAlign && isNullOrUndefined(tocSettings.tabLeader)) {
            tocSettings.tabLeader = 'Dot';
        }
        return tocSettings;
    }

    private decodeTSwitch(tocSettings: TableOfContentsSettings, tSwitch: string): void {
        tocSettings.levelSettings = {};
        tSwitch = tSwitch.replace('t', '');
        tSwitch = tSwitch.replace('"', '');
        tSwitch = tSwitch.replace('"', '');
        tSwitch = tSwitch.trim();
        const levels: string[] = tSwitch.split(',');
        for (let index: number = 0; index < levels.length; index++) {
            tocSettings.levelSettings[levels[index]] = parseInt(levels[index + 1], 10);
            index++;
        }
    }
    /**
     * Inserts, modifies or updates the table of contents based on given settings.
     *
     * @param {TableOfContentsSettings} tableOfContentsSettings
     * @returns {void}
     */
    public insertTableOfContents(tableOfContentsSettings?: TableOfContentsSettings): void {
        this.isInsertingTOC = true;
        this.initComplexHistory('TOC');
        if (isNullOrUndefined(tableOfContentsSettings)) {
            //Initializes with default value.
            tableOfContentsSettings = {};
            tableOfContentsSettings.startLevel = 1;
            tableOfContentsSettings.endLevel = 3;
            tableOfContentsSettings.includeHyperlink = true;
            tableOfContentsSettings.includeOutlineLevels = true;
            tableOfContentsSettings.includePageNumber = true;
            tableOfContentsSettings.rightAlign = true;
            tableOfContentsSettings.tabLeader = 'Dot';
        }
        let tocField: FieldElementBox = undefined;
        let code: string = undefined;
        if (this.selection.contextType === 'TableOfContents') {
            tocField = this.selection.getTocFieldInternal();
        }
        if (tocField instanceof FieldElementBox) {
            this.selection.start.setPositionForSelection(tocField.line, tocField, 0, this.selection.start.location);
            let offset: number = 2;
            if (tocField.fieldEnd.paragraph === tocField.fieldEnd.paragraph.bodyWidget.lastChild) {
                offset--;
            }
            this.selection.end.setPositionForSelection(tocField.fieldEnd.line, tocField.fieldEnd, offset, this.selection.end.location);
            this.delete();
        }
        // Build TOC field code based on parameter
        code = this.constructTocFieldCode(tableOfContentsSettings);
        const isStartParagraph: boolean = this.selection.start.isAtParagraphStart;
        const blockInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
        const initialStart: string = this.selection.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());

        // Build TOC fields

        const widgets: ParagraphWidget[] = this.buildToc(this.validateTocSettings(tableOfContentsSettings), code, true, isStartParagraph);
        if (widgets.length > 0) {
            const tocLastPara: ParagraphWidget = new ParagraphWidget();
            const tocLastLine: LineWidget = new LineWidget(tocLastPara);
            tocLastPara.childWidgets.push(tocLastLine);
            let index: number = 0;
            if (!isStartParagraph) {
                index = 1;
            }
            const line: LineWidget = widgets[index].childWidgets[0] as LineWidget;
            const fieldBegin: FieldElementBox = line.children[0] as FieldElementBox;
            this.appendEndField(fieldBegin, tocLastLine);
            widgets.push(tocLastPara);
            this.appendEmptyPara(widgets);
        } else {
            const localizeValue: L10n = new L10n('documenteditor', this.owner.defaultLocale);
            localizeValue.setLocale(this.owner.locale);
            DialogUtility.alert({
                title: localizeValue.getConstant('No Headings'),
                content: localizeValue.getConstant('Add Headings'),
                showCloseIcon: true,
                closeOnEscape: true,
                position: { X: 'center', Y: 'center' },
                animationSettings: { effect: 'Zoom' }
            });
        }

        this.setPositionForCurrentIndex(this.selection.start, initialStart);
        this.selection.end.setPositionInternal(this.selection.start);
        const bodyWidget: BodyWidget = new BodyWidget();
        bodyWidget.sectionFormat = new WSectionFormat(bodyWidget);
        bodyWidget.childWidgets = widgets;
        this.pasteContentsInternal([bodyWidget], false);
        this.isInsertingTOC = false;
        this.updatePageRef();
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistoryInternal();
        }
        if (widgets.length === 0) {
            this.owner.editorHistory.undo();
            this.owner.editorHistory.redoStack.pop();
        }
    }

    private appendEmptyPara(widgets: ParagraphWidget[]): void {
        const emptyPara: ParagraphWidget = new ParagraphWidget();
        const emptyLine: LineWidget = new LineWidget(emptyPara);
        emptyPara.childWidgets.push(emptyLine);
        widgets.push(emptyPara);
    }

    private constructTocFieldCode(tocSettings: TableOfContentsSettings): string {
        let tocFieldCode: string = 'TOC';
        //appends styles level

        if (!isNullOrUndefined(tocSettings.startLevel) && tocSettings.startLevel !== 0 && !isNullOrUndefined(tocSettings.endLevel) && tocSettings.endLevel !== 0) {
            tocFieldCode = tocFieldCode + ' \\o "' + tocSettings.startLevel + '-' + tocSettings.endLevel + '"';
        }
        if (tocSettings.includePageNumber && !tocSettings.rightAlign) {
            tocFieldCode = tocFieldCode + ' \\p " "';
        }
        if (!tocSettings.includePageNumber) {
            tocFieldCode = tocFieldCode + ' \\n';
        }
        if (tocSettings.includeHyperlink) {
            tocFieldCode = tocFieldCode + ' \\h \\z';
        }
        if (tocSettings.includeOutlineLevels) {
            tocFieldCode = tocFieldCode + ' \\u';
        }
        const tSwitch: string = this.constructTSwitch(tocSettings);
        if (tSwitch.length > 6) {
            tocFieldCode = tocFieldCode + tSwitch;
        }
        return tocFieldCode;
    }

    private constructTSwitch(tocSettings: TableOfContentsSettings): string {
        let tSwitch: string = '';
        const prefix: string = ' \\t ';
        if (!isNullOrUndefined(tocSettings.levelSettings)) {
            for (const key of Object.keys(tocSettings.levelSettings)) {
                tSwitch = tSwitch + key + ',' + tocSettings.levelSettings[key].toString() + ',';
            }
        }
        tSwitch = tSwitch.slice(0, -1);
        tSwitch = prefix + '"' + tSwitch + '"';
        return tSwitch;
    }


    private appendEndField(fieldBegin: FieldElementBox, lineWidget: LineWidget): void {
        const fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.fieldSeparator = fieldBegin.fieldSeparator;
        fieldBegin.fieldSeparator.fieldEnd = fieldEnd;
        fieldEnd.fieldBegin = fieldBegin;
        fieldEnd.fieldBegin.fieldEnd = fieldEnd;
        fieldEnd.line = lineWidget;
        //For TOC we used to append field end at last we need to map that inserted revision to field end.
        if (fieldBegin.revisions.length > 0) {
            const currentRevision: Revision = fieldBegin.revisions[fieldBegin.revisions.length - 1];
            currentRevision.range.push(fieldEnd);
            fieldEnd.revisions.push(currentRevision);
        }
        lineWidget.children.push(fieldEnd);
    }
    private validateTocSettings(tocSettings: TableOfContentsSettings): TableOfContentsSettings {
        if (isNullOrUndefined(tocSettings.startLevel) || tocSettings.startLevel < 1) {
            tocSettings.startLevel = 1;
        }
        if (isNullOrUndefined(tocSettings.endLevel) || tocSettings.endLevel < tocSettings.endLevel) {
            tocSettings.endLevel = tocSettings.startLevel > 3 ? tocSettings.startLevel : 3;
        }
        if (isNullOrUndefined(tocSettings.includeHyperlink)) {
            tocSettings.includeHyperlink = false;
        }
        if (isNullOrUndefined(tocSettings.includePageNumber)) {
            tocSettings.includePageNumber = false;
        }
        if (isNullOrUndefined(tocSettings.rightAlign)) {
            tocSettings.rightAlign = false;
        }
        if (isNullOrUndefined(tocSettings.levelSettings)) {
            tocSettings.levelSettings = {};
        }
        return tocSettings;
    }
    /**
     * Builds the TOC
     *
     * @private
     * @returns {ParagraphWidget[]}
     *
     */

    public buildToc(tocSettings: TableOfContentsSettings, fieldCode: string, isFirstPara: boolean, isStartParagraph?: boolean): ParagraphWidget[] {
        const tocDomBody: BodyWidget = this.documentHelper.pages[0].bodyWidgets[0];
        const widgets: ParagraphWidget[] = [];
        this.createHeadingLevels(tocSettings);
        if (tocSettings.includeOutlineLevels) {
            this.createOutlineLevels(tocSettings);
        }
        const sectionFormat: WSectionFormat = this.selection.start.paragraph.bodyWidget.sectionFormat;
        let widget: IWidget = tocDomBody.childWidgets[0];
        while (widget !== undefined) {

            if (widget instanceof ParagraphWidget && (this.isHeadingStyle(widget) || (tocSettings.includeOutlineLevels && this.isOutlineLevelStyle(widget)))) {
                const bookmarkName: string = this.insertTocBookmark(widget);

                this.createTOCWidgets(widget, widgets, fieldCode, bookmarkName, tocSettings, isFirstPara, isStartParagraph, sectionFormat);
                isFirstPara = false;
            }
            widget = this.selection.getNextParagraphBlock((widget as ParagraphWidget).getSplitWidgets().pop() as ParagraphWidget);
        }
        this.tocStyles = {};
        return widgets;
    }

    private createOutlineLevels(settings: TableOfContentsSettings): void {
        for (let i: number = settings.startLevel; i <= settings.endLevel; i++) {
            const levelStyle: string = 'Level' + i.toString();
            if (isNullOrUndefined(this.tocStyles[levelStyle])) {
                this.tocStyles[levelStyle] = i;
            }
        }
    }

    private createHeadingLevels(settings: TableOfContentsSettings): void {
        //let normalStyle: string = 'Normal';
        for (let i: number = settings.startLevel; i <= settings.endLevel; i++) {
            const headingStyle: string = 'Heading ' + i.toString();
            if (isNullOrUndefined(this.tocStyles[headingStyle])) {
                this.tocStyles[headingStyle] = i;
            }
        }
        if (!isNullOrUndefined(settings.levelSettings)) {
            for (const key of Object.keys(settings.levelSettings)) {
                this.tocStyles[key] = settings.levelSettings[key];
            }
        }
    }

    private isHeadingStyle(para: ParagraphWidget): boolean {
        const style: WStyle = (para.paragraphFormat.baseStyle as WStyle);
        if (style !== undefined) {
            return isNullOrUndefined(this.tocStyles[style.name]) ? false : true;
        }
        return false;
    }

    private isOutlineLevelStyle(para: ParagraphWidget): boolean {
        const styleName: OutlineLevel = para.paragraphFormat.outlineLevel;
        return isNullOrUndefined(this.tocStyles[styleName]) ? false : true;
    }

    private createTocFieldElement(lineWidget: LineWidget, fieldCode: string, isSkipRevision?: boolean): FieldElementBox {
        //begin
        const fieldBegin: FieldElementBox = new FieldElementBox(0);
        fieldBegin.hasFieldEnd = true;
        fieldBegin.line = lineWidget;
        lineWidget.children.push(fieldBegin);
        const currentRevision: Revision = undefined;
        //format toc
        const textElement: TextElementBox = new TextElementBox();
        textElement.text = fieldCode;
        textElement.line = lineWidget;
        lineWidget.children.push(textElement);
        //field separator
        const fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldSeparator.fieldBegin.fieldSeparator = fieldSeparator;
        fieldSeparator.line = lineWidget;
        lineWidget.children.push(fieldSeparator);
        // If revision enabled.
        return fieldBegin;
    }



    private createTOCWidgets(widget: ParagraphWidget, widgets: ParagraphWidget[], fieldCode: string, bookmarkName: string, tocSettings: TableOfContentsSettings, isFirstPara?: boolean, isStartParagraph?: boolean, sectionFormat?: WSectionFormat): void {
        let fieldBegin: FieldElementBox = undefined;
        let tocPara: ParagraphWidget = undefined;
        let tocLine: LineWidget = undefined;
        let emptyParaAppended: boolean = false;

        if (widgets.length === 1 && (widgets[0].childWidgets[0] as LineWidget).children.length === 3 && !isNullOrUndefined(isFirstPara) && !isFirstPara) {
            tocLine = widgets[0].childWidgets[0] as LineWidget;
        } else {
            tocPara = new ParagraphWidget();
            let styleName: string = undefined;
            //Adds toc syles into paragraph
            const headingStyleName: string = widget.paragraphFormat.baseStyle.name;
            if (tocSettings.includeOutlineLevels && isNullOrUndefined(this.tocStyles[headingStyleName])) {
                styleName = widget.paragraphFormat.outlineLevel;
            } else {
                styleName = headingStyleName;
            }
            const tocStyleName: string = 'Toc' + this.tocStyles[styleName];
            let paraStyle: Object = this.documentHelper.styles.findByName(tocStyleName, 'Paragraph');
            if (isNullOrUndefined(paraStyle)) {

                this.documentHelper.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), JSON.parse(this.documentHelper.preDefinedStyles.get(tocStyleName)), this.documentHelper.styles);
                paraStyle = this.documentHelper.styles.findByName(tocStyleName, 'Paragraph');
            }
            tocPara.paragraphFormat.applyStyle(paraStyle as WParagraphStyle);
            //Creates right tab for page number.
            if (tocSettings.rightAlign && tocSettings.includePageNumber) {
                const tabStop: WTabStop = new WTabStop();
                tabStop.position = sectionFormat.pageWidth - (sectionFormat.leftMargin + sectionFormat.rightMargin);
                tabStop.tabLeader = tocSettings.tabLeader;
                tabStop.deletePosition = 0;
                tabStop.tabJustification = 'Right';
                tocPara.paragraphFormat.tabs.push(tabStop);
            }

            tocLine = new LineWidget(tocPara);
            tocPara.childWidgets.push(tocLine);
        }
        //creates toc field element if it is insert
        if ((isFirstPara !== undefined) && isFirstPara) {
            if (!isNullOrUndefined(isStartParagraph) && !isStartParagraph) {
                this.appendEmptyPara(widgets);
                emptyParaAppended = true;
            }
            this.createTocFieldElement(tocLine, fieldCode);
        }
        let text: string = '';
        let isFieldCode: boolean = false;
        let paragraph: ParagraphWidget = widget;
        while (paragraph instanceof ParagraphWidget) {
            for (let lineIndex: number = 0; lineIndex < paragraph.childWidgets.length; lineIndex++) {
                const lineWidget: LineWidget = paragraph.childWidgets[lineIndex] as LineWidget;
                for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                    const element: ElementBox = lineWidget.children[elementIndex];
                    if (element.isPageBreak) {
                        continue;
                    }
                    if ((element instanceof FieldElementBox) || (element instanceof BookmarkElementBox) || isFieldCode) {
                        if (element instanceof FieldElementBox) {
                            if (element.fieldType === 0) {
                                isFieldCode = true;
                            } else if (element.fieldType === 2) {
                                isFieldCode = false;
                            }
                        }
                    } else if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                        let temp: string = element.text;
                        const tabChar: string = '\t';
                        if (temp.indexOf(tabChar) !== -1) {
                            temp = temp.replace(new RegExp(tabChar, 'g'), ' ');
                        }
                        text = text + temp;
                    }

                }
            }
            paragraph = paragraph.nextSplitWidget as ParagraphWidget;
        }
        if (text !== '') {
            // inserts hyperlink
            if (tocSettings.includeHyperlink && (bookmarkName !== undefined)) {
                fieldBegin = this.insertTocHyperlink(tocLine, bookmarkName, text);
            } else {
                const span: TextElementBox = new TextElementBox();
                span.text = text;
                span.line = tocLine;
                tocLine.children.push(span);
            }
            //inserts page number
            if (tocSettings.includePageNumber && (bookmarkName !== undefined)) {
                if (tocSettings.rightAlign) {
                    const tabText: TabElementBox = new TabElementBox();
                    tabText.text = '\t';
                    tabText.line = tocLine;
                    tocLine.children.push(tabText);
                }
                const pageField: FieldElementBox = this.insertTocPageNumber(bookmarkName, tocLine, tocSettings.rightAlign, widget);
                this.appendEndField(pageField, tocLine);
            }
            if (tocSettings.includeHyperlink && fieldBegin !== undefined) {
                this.appendEndField(fieldBegin, tocLine);
            }
        }
        if (!isNullOrUndefined(tocPara) && (text !== '' || isFirstPara)) {
            widgets.push(tocPara);
        }
        if (this.owner.enableTrackChanges && !isNullOrUndefined(tocPara)) {
            if (widgets.length === 1 || emptyParaAppended) {
                this.insertRevisionForBlock(tocPara, 'Insertion', true);
            } else {
                const revision: Revision = this.owner.revisionsInternal.changes[0];
                this.insertRevisionForBlock(tocPara, 'Insertion', true, revision);
            }
        }
    }

    private insertTocHyperlink(lineWidget: LineWidget, bookmarkName: string, text: string): FieldElementBox {
        const fieldCode: string = ' HYPERLINK \\l \"' + bookmarkName + '\" ';
        const fieldBegin: FieldElementBox = this.createTocFieldElement(lineWidget, fieldCode, true);

        //text element.
        const span: TextElementBox = new TextElementBox();
        span.text = text;
        span.line = lineWidget;
        lineWidget.children.push(span);
        return fieldBegin;
    }


    private insertTocPageNumber(bookMarkname: string, lineWidget: LineWidget, isRightAlign: boolean, widget: ParagraphWidget): FieldElementBox {
        const fieldCode: string = ' PAGEREF' + bookMarkname + ' \\h ';
        const fieldBegin: FieldElementBox = this.createTocFieldElement(lineWidget, fieldCode, true);
        let text: string = (this.documentHelper.pages.indexOf(widget.bodyWidget.page) + 1).toString();
        //text element.
        const span: FieldTextElementBox = new FieldTextElementBox();
        span.fieldBegin = fieldBegin;
        if (!isRightAlign) {
            text = ' ' + text;
        }
        span.text = text;
        span.line = lineWidget;
        lineWidget.children.push(span);
        this.pageRefFields[bookMarkname] = span;
        return fieldBegin;
    }

    private updatePageRef(): void {
        for (const key of Object.keys(this.pageRefFields)) {
            if (this.documentHelper.bookmarks.containsKey(key)) {
                const bookmark: BookmarkElementBox = this.documentHelper.bookmarks.get(key);
                const pageRef: string = (bookmark.paragraph.bodyWidget.page.index + 1).toString();
                const span: FieldTextElementBox = this.pageRefFields[key];
                if (pageRef !== span.text) {
                    span.text = pageRef;
                    const paragraph: ParagraphWidget = span.paragraph;
                    const lineIndex: number = paragraph.childWidgets.indexOf(span.line);
                    const elementIndex: number = span.line.children.indexOf(span);
                    this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
                }
            }
        }
    }
    /**
     * Inserts toc bookmark.
     *
     * @param widget
     * @returns {string}
     */
    private insertTocBookmark(widget: ParagraphWidget): string {
        let bookmarkName: string = undefined;
        const lineLength: number = widget.childWidgets.length;
        if (lineLength > 0) {
            const splitParagraph: ParagraphWidget[] = widget.getSplitWidgets() as ParagraphWidget[];
            const firstParagraph: ParagraphWidget = splitParagraph[0];
            const lastParagraph: ParagraphWidget = splitParagraph.pop();
            const startLine: LineWidget = firstParagraph.childWidgets[0] as LineWidget;
            const endLine: LineWidget = lastParagraph.childWidgets[lastParagraph.childWidgets.length - 1] as LineWidget;
            if ((startLine !== undefined) && (endLine !== undefined)) {
                let startElement: ElementBox = startLine.children[0];
                if (startElement instanceof ListTextElementBox || startElement instanceof CommentCharacterElementBox) {
                    do {
                        startElement = startElement.nextNode;
                    } while (startElement instanceof ListTextElementBox || startElement instanceof CommentCharacterElementBox);
                }
                //Returns the bookmark if already present for paragraph.

                if (!isNullOrUndefined(startElement) && startElement instanceof BookmarkElementBox && (startElement as BookmarkElementBox).bookmarkType === 0 && ((startElement as BookmarkElementBox).name.toLowerCase().match('^_toc'))) {
                    return (startElement as BookmarkElementBox).name;
                }
                const endElement: ElementBox = endLine.children[endLine.children.length - 1];
                if ((startElement !== undefined) && (endElement !== undefined)) {
                    this.selection.start.setPositionForSelection(startLine, startElement, 0, this.selection.start.location);
                    this.selection.end.setPositionForSelection(endLine, endElement, endElement.length, this.selection.end.location);
                    bookmarkName = this.generateBookmarkName();
                    this.insertBookmark(bookmarkName);
                }
            }
        }
        return bookmarkName;
    }

    private generateBookmarkName(): string {
        this.tocBookmarkId++;
        let count: number = 10 - this.tocBookmarkId.toString().length;
        let formatString: string = '';
        while (count - 1 > 0) {
            formatString = '0' + formatString;
            count--;
        }
        const bookmarkName: string = '_Toc' + formatString + this.tocBookmarkId;
        return bookmarkName;
    }

    /**
     * Change cell content alignment
     *
     * @param verticalAlignment
     * @param textAlignment
     * @param verticalAlignment
     * @param textAlignment
     * @private
     * @returns {void}
     */
    public onCellContentAlignment(verticalAlignment: CellVerticalAlignment, textAlignment: TextAlignment): void {
        this.owner.isShiftingEnabled = true;
        const selection: Selection = this.owner.selection;
        if (selection.isEmpty && selection.start.paragraph.isInsideTable) {
            if (this.owner.editorHistory) {
                this.owner.editorHistory.initComplexHistory(selection, 'MultiSelection');
            }
            //Selecting the table cell to update the all the paragraph format.
            selection.selectTableCell();
            this.initHistory('CellContentVerticalAlignment');
            const cellFormat: WCellFormat = selection.start.paragraph.associatedCell.cellFormat;
            this.applyCellPropertyValue(selection, 'verticalAlignment', verticalAlignment, cellFormat);
            this.reLayout(selection, false);
            this.initHistory('TextAlignment');
            this.updateParagraphFormat('textAlignment', textAlignment, false);
            this.reLayout(this.owner.selection, false);
            if (this.owner.editorHistory) {
                this.owner.editorHistory.updateComplexHistory();
            }
        } else {
            if (this.owner.editorHistory) {
                this.owner.editorHistory.initComplexHistory(selection, 'MultiSelection');
            }

            if (!isNullOrUndefined(selection.getTable(selection.start, selection.end))) {
                //Table cell vertical alignment.
                this.updateSelectionTableFormat(selection, 'CellContentVerticalAlignment', verticalAlignment);
                this.reLayout(this.owner.selection, false);
                this.initHistory('TextAlignment');
                //Paragraph text alignment.
                this.updateSelectionParagraphFormatting('textAlignment', textAlignment, false);
                this.reLayout(selection, false);
            }
            if (this.owner.editorHistory) {
                this.owner.editorHistory.updateComplexHistory();
            }
        }
    }

    //Restrict editing implementation starts
    /**
     * @param user
     * @private
     * @returns {void}
     */
    public insertEditRangeElement(user: string): void {
        if (this.documentHelper.isDocumentProtected || this.documentHelper.selection.isEmpty) {
            return;
        }
        this.initComplexHistory('RestrictEditing');
        this.selection.skipEditRangeRetrieval = true;
        const selection: Selection = this.documentHelper.selection;
        let startPos: TextPosition = this.selection.start;
        let endPos: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPos = this.selection.end;
            endPos = this.selection.start;
        }
        if (selection.start.paragraph.isInsideTable && selection.end.paragraph.isInsideTable
            && selection.start.paragraph.associatedCell.ownerTable.contains(selection.end.paragraph.associatedCell)) {
            const startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            const endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            if (startCell.rowIndex === endCell.rowIndex) {
                const startIndex: number = startCell.ownerRow.childWidgets.indexOf(startCell);
                const endIndex: number = startCell.ownerRow.childWidgets.indexOf(endCell);
                const startElement: ElementBox[] = [];
                const endElement: ElementBox[] = [];

                for (let i: number = startIndex; i <= endIndex; i++) {
                    const editStart: EditRangeStartElementBox = this.addEditElement(user);
                    editStart.columnFirst = i;
                    editStart.columnLast = i;
                    editStart.line = selection.start.currentWidget;
                    const editEnd: EditRangeEndElementBox = editStart.editRangeEnd;
                    editEnd.line = selection.end.currentWidget;
                    startElement.push(editStart);
                    endElement.push(editEnd);
                }
                this.insertElements(endElement, startElement);
                let offset: number = startElement[0].line.getOffset(startElement[0], 1);
                this.selection.start.setPositionParagraph(startElement[0].line, offset);
                offset = endElement[0].line.getOffset(endElement[0], 1);
                this.selection.end.setPositionParagraph(endElement[0].line, offset);
                this.selection.fireSelectionChanged(true);
                this.fireContentChange();
            } else {
                this.insertEditRangeInsideTable(startCell, endCell, user);
                const startLine: LineWidget = this.selection.getFirstParagraphInCell(startCell).childWidgets[0] as LineWidget;
                const endLine: LineWidget = this.selection.getLastParagraph(endCell).childWidgets[0] as LineWidget;
                let offset: number = startLine.getOffset(startLine.children[0], 1);
                this.selection.start.setPositionParagraph(startLine, offset);
                offset = endLine.getOffset(endLine.children[0], 1);
                this.selection.end.setPositionParagraph(endLine, offset);
                this.selection.fireSelectionChanged(true);
                this.fireContentChange();

            }
        } else {
            this.addRestrictEditingForSelectedArea(user);
        }
        this.selection.skipEditRangeRetrieval = false;

    }

    private insertEditRangeInsideTable(startCell: TableCellWidget, endCell: TableCellWidget, user: string): void {
        const table: TableWidget = startCell.ownerTable;
        const count: number = table.childWidgets.indexOf(endCell.ownerRow);
        const rowStartIndex: number = table.childWidgets.indexOf(startCell.ownerRow);
        let startLeft: number = this.selection.getCellLeft(startCell.ownerRow, startCell);
        let endLeft: number = startLeft + startCell.cellFormat.cellWidth;
        const endCellLeft: number = this.selection.getCellLeft(endCell.ownerRow, endCell);
        const endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        const cellInfo: CellInfo = this.updateSelectedCellsInTable(startLeft, endLeft, endCellLeft, endCellRight);
        startLeft = cellInfo.start;
        endLeft = cellInfo.end;
        let endElement: EditRangeEndElementBox[] = [];
        for (let i: number = rowStartIndex; i <= count; i++) {
            const row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            let cellSelectionStartIndex: number = -1;
            let cellSelectionEndIndex: number = -1;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                const cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                const cellStart: number = this.selection.getCellLeft(row, cell);
                if (this.checkCellWithInSelection(startLeft, endLeft, cellStart)) {
                    if (cellSelectionStartIndex === -1) {
                        cellSelectionStartIndex = j;
                    }
                    cellSelectionEndIndex = j;
                }
            }
            const newEndElement: EditRangeEndElementBox[] = [];
            for (let z: number = cellSelectionStartIndex; z <= cellSelectionEndIndex; z++) {
                let index: number = 0;
                let startCell: TableCellWidget;
                let startParagraph: LineWidget;
                if (z === cellSelectionStartIndex) {
                    startCell = row.childWidgets[cellSelectionStartIndex] as TableCellWidget;
                    startParagraph = this.selection.getFirstParagraphInCell(startCell).childWidgets[0] as LineWidget;
                }
                const editStart: EditRangeStartElementBox = this.addEditElement(user);
                editStart.columnFirst = z;
                editStart.columnLast = z;
                editStart.line = startParagraph;
                editStart.line.children.splice(index, 0, editStart);
                index++;
                const editEnd: EditRangeEndElementBox = editStart.editRangeEnd;
                newEndElement.push(editEnd);
                if (endElement.length > 0 && z === cellSelectionEndIndex) {
                    for (let l: number = 0; l < endElement.length; l++) {
                        endElement[l].line = editStart.line;
                        editStart.line.children.splice(index, 0, endElement[l]);
                        index++;
                    }
                    endElement = [];
                }
            }
            endElement = newEndElement;
            if (i === count && endElement.length > 0) {
                const cellWidget: TableCellWidget = row.childWidgets[cellSelectionEndIndex] as TableCellWidget;
                const lastLine: LineWidget = this.selection.getLastParagraph(cellWidget).lastChild as LineWidget;
                let index: number = lastLine.children.length - 1;
                for (let l: number = 0; l < endElement.length; l++) {
                    endElement[l].line = lastLine;
                    lastLine.children.splice(index, 0, endElement[l]);
                    index++;
                }
            }
        }
    }

    private addRestrictEditingForSelectedArea(user: string): void {
        const editStart: EditRangeStartElementBox = this.addEditElement(user);
        const editEnd: EditRangeEndElementBox = editStart.editRangeEnd;
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.currentHistoryInfo.editRangeStart = editStart;
        }
        this.insertElements([editEnd], [editStart]);
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistoryInternal();
        }
        let offset: number = editStart.line.getOffset(editStart, 1);
        this.selection.start.setPositionParagraph(editStart.line, offset);
        offset = editEnd.line.getOffset(editEnd, 1);
        this.selection.end.setPositionParagraph(editEnd.line, offset);
        this.selection.fireSelectionChanged(true);
        this.fireContentChange();

    }
    /**
     * @param user
     * @private
     * @returns {void}
     */
    public addEditElement(user: string): EditRangeStartElementBox {
        const editStart: EditRangeStartElementBox = new EditRangeStartElementBox();
        if (user.toLocaleLowerCase() === 'everyone') {
            editStart.group = user;
        } else {
            editStart.user = user;
        }
        const editEnd: EditRangeEndElementBox = new EditRangeEndElementBox();
        editEnd.editRangeStart = editStart;
        editStart.editRangeEnd = editEnd;
        this.editStartRangeCollection.push(editStart);
        this.addEditCollectionToDocument();
        this.editStartRangeCollection = [];
        return editStart;
    }
    /**
     * @param protectionType
     * @private
     * @returns {void}
     */
    public protect(protectionType: ProtectionType): void {
        this.documentHelper.isDocumentProtected = true;
        this.documentHelper.protectionType = protectionType;
        this.selection.highlightEditRegion();
        if (this.editorHistory) {
            this.editorHistory.destroy();
        }
    }

    private addEditCollectionToDocument(): void {
        for (let i: number = 0; i < this.editStartRangeCollection.length; i++) {
            const editStart: EditRangeStartElementBox = this.editStartRangeCollection[i];
            const user: string = editStart.user === '' ? editStart.group : editStart.user;
            if (this.documentHelper.editRanges.length > 0 && this.documentHelper.editRanges.containsKey(user)) {
                this.documentHelper.editRanges.get(user).push(editStart);
            } else {
                const collection: EditRangeStartElementBox[] = [];
                collection.push(editStart);
                this.documentHelper.editRanges.add(user, collection);
            }
        }
        this.selection.updateEditRangeCollection();
    }
    /**
     * @param editStart
     * @param user
     * @private
     * @returns {void}
     */
    public updateRangeCollection(editStart: EditRangeStartElementBox, user: string): void {
        if (this.documentHelper.editRanges.length > 0 && this.documentHelper.editRanges.containsKey(user)) {
            this.documentHelper.editRanges.get(user).push(editStart);
        } else {
            const collection: EditRangeStartElementBox[] = [];
            collection.push(editStart);
            this.documentHelper.editRanges.add(user, collection);
        }
    }
    /**
     * @param user
     * @private
     * @returns {void}
     */
    public removeUserRestrictions(user: string): void {
        if (!this.selection.checkSelectionIsAtEditRegion()) {
            return;
        }
        this.selection.skipEditRangeRetrieval = true;
        const editStart: EditRangeStartElementBox = this.selection.getEditRangeStartElement();
        this.initHistory('RemoveEditRange');
        if (this.editorHistory) {
            this.editorHistory.currentBaseHistoryInfo.setEditRangeInfo(editStart);
            this.editorHistory.updateHistory();
        }
        if (editStart.user === user || editStart.group === user) {
            this.removeUserRestrictionsInternal(editStart, user);
        }
        this.selection.updateEditRangeCollection();
        this.fireContentChange();
        this.selection.skipEditRangeRetrieval = false;
    }
    /**
     * @param editStart
     * @param currentUser
     * @private
     * @returns {void}
     */
    public removeUserRestrictionsInternal(editStart: EditRangeStartElementBox, currentUser?: string): void {
        let user: string = currentUser;
        if (isNullOrUndefined(currentUser)) {
            user = editStart.user === '' ? editStart.group : editStart.user;
        }
        const index: number = this.documentHelper.editRanges.get(user).indexOf(editStart);
        this.documentHelper.editRanges.get(user).splice(index, 1);
        if (this.documentHelper.editRanges.get(user).length === 0) {
            this.documentHelper.editRanges.remove(user);
        }
        editStart.removeEditRangeMark();
        editStart.editRangeEnd.line.children.splice(editStart.editRangeEnd.indexInOwner, 1);
        editStart.line.children.splice(editStart.indexInOwner, 1);
    }
    /**
     * @private
     * @returns {void}
     */
    public removeAllEditRestrictions(): void {
        this.selection.skipEditRangeRetrieval = true;
        const startPosition: TextPosition = this.selection.start;
        const endPosition: TextPosition = this.selection.end;
        let editStart: EditRangeStartElementBox[] = [];
        const keys: string[] = this.documentHelper.editRanges.keys;
        for (let j: number = 0; j < keys.length; j++) {
            editStart = this.documentHelper.editRanges.get(keys[j]);
            for (let i: number = 0; i < editStart.length; i++) {
                editStart[i].editRangeEnd.line.children.splice(editStart[i].editRangeEnd.indexInOwner, 1);
                editStart[i].line.children.splice(editStart[i].indexInOwner, 1);
            }
        }
        this.documentHelper.editRanges.clear();
        this.selection.updateEditRangeCollection();
        this.selection.start.setPositionInternal(startPosition);
        this.selection.end.setPositionInternal(endPosition);
        this.selection.editRegionHighlighters.clear();
        this.owner.viewer.updateScrollBars();
        this.selection.fireSelectionChanged(false);
        this.selection.skipEditRangeRetrieval = false;
    }
    /**
     * Insert specified form field at current selection.
     *
     * @param {FormFieldType} type Form field type
     * @returns {void}
     */
    public insertFormField(type: FormFieldType): void {
        if (isNullOrUndefined(this.selection.start) || this.owner.enableHeaderAndFooter) {
            return;
        }
        this.initHistory('InsertHyperlink');
        let isRemoved: boolean = true;
        if (!this.selection.isEmpty) {
            isRemoved = this.removeSelectedContents(this.selection);
        }
        if (isRemoved) {
            this.insertFormFieldInternal(type);
        }
    }

    private insertFormFieldInternal(type: FormFieldType): void {
        this.updateInsertPosition();
        const element: ElementBox[] = [];
        const temp: WCharacterFormat = this.getCharacterFormat(this.selection);
        const format: WCharacterFormat = new WCharacterFormat(undefined);
        format.copyFormat(temp);
        const fieldBegin: FieldElementBox = new FieldElementBox(0);
        fieldBegin.formFieldData = this.getFormFieldData(type);
        fieldBegin.characterFormat.copyFormat(format);
        element.push(fieldBegin);
        const bookmark: BookmarkElementBox = new BookmarkElementBox(0);
        bookmark.characterFormat.copyFormat(format);
        fieldBegin.formFieldData.name = this.getBookmarkName(type, 'Insert', this.formFieldCounter);
        bookmark.name = fieldBegin.formFieldData.name;
        element.push(bookmark);
        const span: TextElementBox = new TextElementBox();
        span.text = this.getFormFieldCode(type);
        element.push(span);
        const fieldSeparator: FieldElementBox = new FieldElementBox(2);
        element.push(fieldSeparator);
        const result: TextElementBox = new TextElementBox();
        if (type === 'CheckBox') {
            result.text = String.fromCharCode(9744);
        } else {
            result.text = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
        }
        result.characterFormat.copyFormat(format);
        element.push(result);
        const fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.characterFormat.copyFormat(format);
        element.push(fieldEnd);
        const bookmarkEnd: BookmarkElementBox = new BookmarkElementBox(1);
        bookmarkEnd.characterFormat.copyFormat(format);
        bookmarkEnd.name = fieldBegin.formFieldData.name;
        bookmarkEnd.reference = bookmark;
        bookmark.reference = bookmarkEnd;
        element.push(bookmarkEnd);
        this.insertElement(element);
        const paragraph: ParagraphWidget = this.selection.start.paragraph;
        fieldEnd.linkFieldCharacter(this.documentHelper);
        if (this.documentHelper.fields.indexOf(fieldBegin) === -1) {
            this.documentHelper.fields.push(fieldBegin);
        }
        if (this.documentHelper.formFields.indexOf(fieldBegin) === -1) {
            this.documentHelper.formFields.push(fieldBegin);
        }
        const offset: number = bookmarkEnd.line.getOffset(bookmarkEnd, 1);
        this.selection.selects(bookmarkEnd.line, offset, true);
        this.updateEndPosition();
        this.reLayout(this.selection, true);
    }

    private getFormFieldData(type: FormFieldType): FormField {
        switch (type) {
        case 'Text':
            return new TextFormField();
        case 'CheckBox':
            return new CheckBoxFormField();
        case 'DropDown':
            return new DropDownFormField();
        }
    }
    /**
     * @param field
     * @param info
     * @private
     * @returns {void}
     */
    public setFormField(field: FieldElementBox, info: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void {
        let type: FormFieldType;
        let formField: FormField;
        if (!isNullOrUndefined((info as TextFormFieldInfo).format)) {
            type = 'Text';
            formField = new TextFormField();
        } else if (!isNullOrUndefined((info as CheckBoxFormFieldInfo).sizeType)) {
            type = 'CheckBox';
            formField = new CheckBoxFormField();
        } else if (!isNullOrUndefined((info as DropDownFormFieldInfo).dropdownItems)) {
            type = 'DropDown';
            formField = new DropDownFormField();
        }
        if (!isNullOrUndefined(type) && !isNullOrUndefined(formField)) {
            formField.name = field.formFieldData.name;
            formField.copyFieldInfo(info);
            this.editFormField(type, formField);
        }
    }
    /**
     * @param type
     * @param formData
     * @param type
     * @param formData
     * @private
     * @returns {boolean}
     */
    public editFormField(type: FormFieldType, formData: FormField): boolean {
        const begin: FieldElementBox = this.selection.getCurrentFormField();
        if (isNullOrUndefined(begin) || isNullOrUndefined(begin.formFieldData)) {
            return false;
        }
        this.initComplexHistory('FormField');
        let bookmarkStart: BookmarkElementBox;
        let bookmarkEnd: BookmarkElementBox;
        if (formData.name !== '') {
            if (begin.formFieldData.name !== formData.name &&
                this.documentHelper.bookmarks.containsKey(formData.name)) {
                this.deleteBookmark(formData.name);
            }
            bookmarkStart = new BookmarkElementBox(0);
            bookmarkStart.name = formData.name;
            bookmarkEnd = new BookmarkElementBox(1);
            bookmarkEnd.name = formData.name;
            bookmarkStart.reference = bookmarkEnd;
            bookmarkEnd.reference = bookmarkStart;
        }

        this.initHistory('InsertHyperlink');
        this.editHyperlinkInternal = isNullOrUndefined(this.editorHistory)
            || (this.editorHistory && isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo));
        // Preserves the character format for hyperlink field.
        const temp: WCharacterFormat = begin.characterFormat.cloneFormat();
        const format: WCharacterFormat = new WCharacterFormat();
        format.copyFormat(temp);
        const textFormat: WCharacterFormat = begin.fieldSeparator.nextElement.characterFormat.cloneFormat();
        let currentOffset: number = begin.line.getOffset(begin, 0);
        this.selection.start.setPositionParagraph(begin.line, currentOffset);
        let endElement: ElementBox = begin.fieldEnd;
        if (begin.nextNode && begin.nextNode instanceof BookmarkElementBox) {
            endElement = begin.nextNode.reference;
        }
        currentOffset = endElement.line.getOffset(endElement, 1);
        this.selection.end.setPositionParagraph(endElement.line, currentOffset);
        this.skipFieldDeleteTracking = true;
        this.deleteSelectedContents(this.selection, false);
        this.skipFieldDeleteTracking = false;
        this.updateInsertPosition();
        const element: ElementBox[] = [];
        const fieldBegin: FieldElementBox = new FieldElementBox(0);
        fieldBegin.formFieldData = formData;
        element.push(fieldBegin);
        fieldBegin.characterFormat.copyFormat(format);
        if (!isNullOrUndefined(bookmarkStart)) {
            element.push(bookmarkStart);
        }
        let span: TextElementBox = new TextElementBox();
        span.text = this.getFormFieldCode(type);
        element.push(span);
        const fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.characterFormat.copyFormat(format);
        element.push(fieldSeparator);
        span = new TextElementBox();
        span.characterFormat.copyFormat(textFormat);
        span.text = this.getDefaultText(formData);
        if (type === 'CheckBox') {
            span.characterFormat.copyFormat(fieldBegin.characterFormat);
            if ((formData as CheckBoxFormField).sizeType === 'Exactly') {
                span.characterFormat.fontSize = (formData as CheckBoxFormField).size;
            }
        } else if (formData instanceof TextFormField) {
            if (formData.defaultValue !== '') {
                if (formData.type === 'Text') {
                    span.text = HelperMethods.formatText(formData.format, formData.defaultValue);
                } else if (formData.type === 'Number') {
                    span.text = HelperMethods.formatNumber(formData.format, formData.defaultValue);
                } else {
                    span.text = HelperMethods.formatDate(formData.format, formData.defaultValue);
                }
            }
        }
        element.push(span);
        const fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.characterFormat.copyFormat(format);
        element.push(fieldEnd);
        let lastElement: ElementBox = fieldEnd;
        if (!isNullOrUndefined(bookmarkEnd)) {
            lastElement = bookmarkEnd;
            element.push(bookmarkEnd);
        }
        this.insertElement(element);
        const paragraph: ParagraphWidget = this.selection.start.paragraph;
        fieldEnd.linkFieldCharacter(this.documentHelper);
        if (this.documentHelper.fields.indexOf(fieldBegin) === -1) {
            this.documentHelper.fields.push(fieldBegin);
        }
        const offset: number = lastElement.line.getOffset(lastElement, 1);
        this.selection.selects(lastElement.line, offset, true);
        this.updateEndPosition();
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            this.editorHistory.updateHistory();
        }
        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.updateComplexHistory();
        }
        this.reLayout(this.selection, true);
        this.editHyperlinkInternal = false;
        this.nodes = [];
        return true;
    }

    private getDefaultText(formField: FormField): string {
        let defaultText: string = '';
        if (formField instanceof CheckBoxFormField) {
            defaultText = formField.defaultValue ? String.fromCharCode(9745) : String.fromCharCode(9744);
        } else if (formField instanceof DropDownFormField) {
            if (formField.dropdownItems.length > 0) {
                defaultText = formField.dropdownItems[0];
            } else {
                defaultText = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
            }
        } else if (formField instanceof TextFormField) {
            if (formField.defaultValue !== '') {
                defaultText = formField.defaultValue;
            } else {
                defaultText = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
            }
        }
        return defaultText;
    }

    private getFormFieldCode(type: FormFieldType): string {
        switch (type) {
        case 'Text':
            return 'FORMTEXT';
        case 'CheckBox':
            return 'FORMCHECKBOX';
        case 'DropDown':
            return 'FORMDROPDOWN';
        }
    }

    /**
     * @param field
     * @param reset
     * @param value
     * @param field
     * @param reset
     * @param value
     * @private
     * @returns {void}
     */
    public toggleCheckBoxFormField(field: FieldElementBox, reset?: boolean, value?: boolean): void {
        const formFieldData: FormField = field.formFieldData;
        if (formFieldData instanceof CheckBoxFormField && formFieldData.enabled) {
            this.initHistory('UpdateFormField');
            if (this.editorHistory) {
                let currentValue: string | boolean | number;
                if (formFieldData instanceof CheckBoxFormField) {
                    currentValue = formFieldData.checked;
                }
                this.editorHistory.currentBaseHistoryInfo.setFormFieldInfo(field, currentValue);
                this.editorHistory.updateHistory();
            }
            if (reset) {
                (formFieldData as CheckBoxFormField).checked = value;
            } else {
                (formFieldData as CheckBoxFormField).checked = !(formFieldData as CheckBoxFormField).checked;
            }
            const separator: FieldElementBox = field.fieldSeparator;
            const checkBoxTextElement: TextElementBox = separator.nextNode as TextElementBox;
            if ((formFieldData as CheckBoxFormField).checked) {
                checkBoxTextElement.text = String.fromCharCode(9745);
            } else {
                checkBoxTextElement.text = String.fromCharCode(9744);
            }
            this.owner.documentHelper.layout.reLayoutParagraph(field.line.paragraph, 0, 0);
            this.reLayout(this.selection, false);
        }
    }
    /**
     * @param field
     * @param value
     * @param reset
     * @private
     * @returns {void}
     */
    public updateFormField(field: FieldElementBox, value: string | number, reset?: boolean): void {
        const formFieldData: FormField = field.formFieldData;
        if (formFieldData) {
            this.initHistory('UpdateFormField');
            if (this.editorHistory) {
                let currentValue: string | boolean | number;
                if (formFieldData instanceof TextFormField) {
                    currentValue = field.resultText;
                } else if (formFieldData instanceof DropDownFormField) {
                    currentValue = formFieldData.selectedIndex;
                }
                this.editorHistory.currentBaseHistoryInfo.setFormFieldInfo(field, currentValue);
                this.editorHistory.updateHistory();
            }
            this.updateFormFieldInternal(field, formFieldData, value, reset);
        }
    }


    private updateFormFieldInternal(field: FieldElementBox, formFieldData: FormField, value: string | number, reset?: boolean): void {
        if (formFieldData instanceof TextFormField) {
            if (value === '') {
                if (reset) {
                    value = this.getDefaultText(formFieldData) as string;
                } else {
                    value = this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5);
                }
            }
            let formattedText: string = value as string;
            const type: TextFormFieldType = formFieldData.type;
            if (type === 'Text' && formFieldData.format !== '') {
                formattedText = HelperMethods.formatText(formFieldData.format, value as string);
            }
            this.updateFormFieldResult(field, formattedText);
        } else if (formFieldData instanceof DropDownFormField) {
            const text: string = formFieldData.dropdownItems[value as number];
            formFieldData.selectedIndex = value as number;
            this.updateFormFieldResult(field, text);
        }
        const endoffset: number = field.fieldEnd.line.getOffset(field.fieldEnd, 1);
        const startPos: TextPosition = new TextPosition(this.owner);
        startPos.setPositionParagraph(field.fieldEnd.line, endoffset);
        //selects the field range
        this.documentHelper.selection.selectRange(startPos, startPos);
        this.reLayout(this.selection, false);
    }
    private updateFormFieldResult(field: FieldElementBox, value: string): void {
        let textElement: ElementBox = field.fieldSeparator.nextNode;
        while (!(textElement instanceof TextElementBox)) {
            textElement = textElement.nextNode;
            if (textElement === field.fieldEnd) {
                break;
            }
        }
        if (textElement instanceof TextElementBox) {
            textElement.text = value;
            textElement = textElement.nextNode;
            do {
                const index: number = field.line.children.indexOf(textElement);
                if (textElement instanceof TextElementBox) {
                    textElement = textElement.nextNode;
                    field.line.children.splice(index, 1);
                } else {
                    if (textElement === field.fieldEnd) {
                        break;
                    }
                    textElement = textElement.nextNode;
                }
            } while (textElement !== field.fieldEnd);
        }
        this.owner.documentHelper.layout.reLayoutParagraph(field.line.paragraph, 0, 0);
    }

    private checkBookmarkAvailability(name: string, action: string): boolean {
        const bookmarkCol: Dictionary<string, BookmarkElementBox> = this.documentHelper.bookmarks;
        for (let i: number = 0; i < bookmarkCol.length; i++) {
            if (bookmarkCol.containsKey(name)) {
                return false;
            }
        }
        return true;
    }

    private getBookmarkName(type: string, action: string, count: number): string {
        let name: string;
        let available: boolean = false;
        while (available === false) {
            name = type + count;
            available = this.checkBookmarkAvailability(name, action);
            count = count + 1;
        }
        return name;
    }
    /**
     * @param formField
     * @private
     * @returns {void}
     */
    public applyFormTextFormat(formField: FieldElementBox): void {
        if (!isNullOrUndefined(formField)) {
            let text: string = this.getFormFieldText(formField);
            const currentValue: string = text;
            text = HelperMethods.formatText((formField.formFieldData as TextFormField).format, text);
            this.applyTextFormatInternal(formField, text);
            this.initHistory('FormTextFormat');
            if (this.editorHistory) {
                this.editorHistory.currentBaseHistoryInfo.setFormFieldInfo(formField, currentValue);
                this.editorHistory.updateHistory();
            }
        }
    }
    // Inserts 5 space on Form Fill inline mode if length is 0
    private insertSpaceInFormField(): void {
        if (this.documentHelper.isInlineFormFillProtectedMode && this.selection.isInlineFormFillMode()) {
            const resultText: string = this.getFormFieldText();
            if (resultText.length === 0 || resultText === '\r') {

                this.insertTextInternal(this.documentHelper.textHelper.repeatChar(this.documentHelper.textHelper.getEnSpaceCharacter(), 5), true);
                this.selection.selectTextElementStartOfField(this.selection.getCurrentFormField());
            }
        }
    }
    /**
     * @param formField
     * @private
     * @returns {string}
     */
    public getFormFieldText(formField?: FieldElementBox): string {
        if (isNullOrUndefined(formField)) {
            formField = this.selection.getCurrentFormField();
        }
        const seperator: FieldElementBox = formField.fieldSeparator;
        const text: string = this.getNextRenderedWidgetText(seperator);
        return text;
    }

    private getNextRenderedWidgetText(seperator: ElementBox): string {
        let text: string = '';
        if (seperator instanceof FieldElementBox && seperator.fieldType === 2) {
            let textElement: ElementBox = seperator;
            do {
                if (!(isNullOrUndefined(textElement)) && textElement instanceof TextElementBox) {
                    text = text + textElement.text;
                }
                if (isNullOrUndefined(textElement.nextNode)) {
                    text += '\r';
                    let nextBlock: BlockWidget = textElement.paragraph.nextRenderedWidget as BlockWidget;
                    if (isNullOrUndefined(nextBlock)) {
                        break;
                    }
                    if (nextBlock instanceof TableWidget) {
                        nextBlock = this.selection.getFirstParagraphBlock(nextBlock);
                    }
                    while ((nextBlock as ParagraphWidget).isEmpty()) {
                        text += '\r';
                        nextBlock = nextBlock.nextRenderedWidget as BlockWidget;
                    }

                    textElement = ((nextBlock as ParagraphWidget).childWidgets[0] as LineWidget).children[0];
                } else {
                    textElement = textElement.nextNode;
                }
            }

            while (!(textElement instanceof FieldElementBox && textElement.fieldType === 1 && textElement === seperator.fieldEnd));
        }
        return text;
    }
    /**
     * @param field
     * @param text
     * @private
     * @returns {void}
     */
    public applyTextFormatInternal(field: FieldElementBox, text: string): void {
        let textElement: ElementBox = field.fieldSeparator.nextElement;
        let start: number = 0;
        text = text.replace(/\r/g, '');
        do {
            if (!isNullOrUndefined(textElement) && textElement instanceof TextElementBox) {
                textElement.text = text.slice(start, start + textElement.text.length);
                start = start + textElement.length;
            }
            if (isNullOrUndefined(textElement.nextElement)) {
                if (!isNullOrUndefined(textElement.line.nextLine)) {
                    textElement = textElement.line.nextLine.children[0];
                } else {

                    this.documentHelper.layout.layoutBodyWidgetCollection(textElement.paragraph.index, textElement.paragraph.bodyWidget, textElement.paragraph, true);
                    let nextBlock: BlockWidget = textElement.paragraph.nextRenderedWidget as BlockWidget;
                    if (isNullOrUndefined(nextBlock)) {
                        break;
                    }
                    if (nextBlock instanceof TableWidget) {
                        nextBlock = this.selection.getFirstParagraphBlock(nextBlock);
                    }
                    while ((nextBlock as ParagraphWidget).isEmpty()) {
                        nextBlock = nextBlock.nextRenderedWidget as BlockWidget;
                    }

                    textElement = ((nextBlock as ParagraphWidget).childWidgets[0] as LineWidget).children[0];
                }
            } else {
                textElement = textElement.nextElement;
            }
        } while (!(textElement instanceof FieldElementBox && textElement.fieldType === 1 &&
            textElement.fieldBegin.formFieldData instanceof TextFormField));

        this.documentHelper.layout.layoutBodyWidgetCollection(textElement.paragraph.index, textElement.paragraph.bodyWidget, textElement.paragraph, true);
        this.selection.isFormatUpdated = true;
        this.reLayout(this.selection, false);
        this.selection.isFormatUpdated = false;
    }
    private constructCommentInitial(authorName: string): string {
        const splittedName: string[] = authorName.split(' ');
        let initials: string = '';
        for (let i: number = 0; i < splittedName.length; i++) {
            if (splittedName[i].length > 0 && splittedName[i] !== '') {
                initials += splittedName[i][0];
            }
        }
        return initials;
    }
    /**
     * Insert Footnote at current selection
     *
     * @returns {void}
     */
    public insertFootnote(): void {
        if (this.selection.isinFootnote || this.selection.isinEndnote) {
            return;
        }
        const footnote: FootnoteElementBox = new FootnoteElementBox();
        footnote.characterFormat.baselineAlignment = 'Superscript';
        footnote.footnoteType = 'Footnote';
        footnote.text = 's';
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const lineWidget: LineWidget = new LineWidget(paragraph);
        const text: TextElementBox = new TextElementBox();
        text.characterFormat.baselineAlignment = 'Superscript';
        text.line = lineWidget;
        text.text = '?';
        lineWidget.children.push(text);
        const text1: TextElementBox = new TextElementBox();
        text1.text = ' ';
        text1.line = lineWidget;
        lineWidget.children.push(text1);
        paragraph.childWidgets.push(lineWidget);
        paragraph.footNoteReference = footnote;
        footnote.blocks.push(paragraph);

        if (!this.selection.isEmpty) {
            this.selection.handleRightKey();
        }
        this.initInsertInline(footnote);
        // this.documentHelper.layout.isLayoutWhole = true;
        // this.layoutWholeDocument();
        // this.documentHelper.layout.isLayoutWhole = false;
        let footPara: BlockWidget;
        if (footnote.paragraph.bodyWidget.page.footnoteWidget) {
            for (let i: number = 0; i < footnote.paragraph.bodyWidget.page.footnoteWidget.childWidgets.length; i++) {
                if ((footnote.paragraph.bodyWidget.page.footnoteWidget.childWidgets[i] as BlockWidget).footNoteReference === footnote) {
                    footPara = (footnote.paragraph.bodyWidget.page.footnoteWidget.childWidgets[i] as BlockWidget);
                }
            }
        }

        this.selection.start.setPositionForLineWidget((footPara.childWidgets[0] as LineWidget), text1.line.getOffset(text1, footnote.text.length));
        this.selection.end.setPositionInternal(this.selection.start);
        // this.selection.fireSelectionChanged(true);
        this.reLayout(this.selection, false);
        this.separator('footnote');
        this.continuationSeparator('footnote');

    }
    private updateFootnoteCollection(footnote: FootnoteElementBox): void {
        if (this.documentHelper.footnoteCollection.indexOf(footnote) === -1) {
            let isInserted: boolean = false;
            if (this.documentHelper.footnoteCollection.length > 0) {

                const currentStart: TextPosition = this.selection.getElementPosition(footnote).startPosition;
                for (let i: number = 0; i < this.documentHelper.footnoteCollection.length; i++) {

                    const paraIndex: TextPosition = this.selection.getElementPosition(this.documentHelper.footnoteCollection[i]).startPosition;
                    if (currentStart.isExistBefore(paraIndex)) {
                        isInserted = true;
                        this.documentHelper.footnoteCollection.splice(i, 0, footnote);
                        break;
                    }
                }
            }
            if (!isInserted) {
                this.documentHelper.footnoteCollection.push(footnote);
            }
            // this.viewer.updateScrollBars();
        }
    }
    // Footnote implementation ends
    /**
     * Insert Endnote at current selection
     *
     * @returns {void}
     */
    public insertEndnote(): void {
        if (this.selection.isinFootnote || this.selection.isinEndnote) {
            return;
        }
        this.documentHelper.layout.isEndnoteContentChanged = true;
        const endnote: FootnoteElementBox = new FootnoteElementBox();
        endnote.characterFormat.baselineAlignment = 'Superscript';
        endnote.footnoteType = 'Endnote';
        endnote.text = 's';
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const lineWidget: LineWidget = new LineWidget(paragraph);
        const footText: TextElementBox = new TextElementBox();
        footText.characterFormat.baselineAlignment = 'Superscript';
        footText.line = lineWidget;
        footText.text = '?';
        lineWidget.children.push(footText);
        const followText: TextElementBox = new TextElementBox();
        followText.text = ' ';
        followText.line = lineWidget;
        lineWidget.children.push(followText);
        paragraph.childWidgets.push(lineWidget);
        paragraph.footNoteReference = endnote;
        endnote.blocks.push(paragraph);
        if (!this.selection.isEmpty) {
            this.selection.handleRightKey();
        }
        this.initInsertInline(endnote);
        // this.documentHelper.layout.isLayoutWhole = true;
        // this.layoutWholeDocument();
        // this.documentHelper.layout.isLayoutWhole = false;
        const lastpage: number = this.documentHelper.pages.length;
        const bodyWidget: BlockContainer = this.documentHelper.pages[lastpage - 1].bodyWidgets[0];
        let footPara: BlockWidget;
        if (bodyWidget.page.endnoteWidget) {
            for (let i: number = 0; i < bodyWidget.page.endnoteWidget.childWidgets.length; i++) {
                if ((bodyWidget.page.endnoteWidget.childWidgets[i] as BlockWidget).footNoteReference === endnote) {
                    footPara = (bodyWidget.page.endnoteWidget.childWidgets[i] as BlockWidget);
                }
            }
        }

        this.selection.start.setPositionForLineWidget((footPara.childWidgets[0] as LineWidget), footText.line.getOffset(followText, endnote.text.length));
        this.selection.end.setPositionInternal(this.selection.start);
        this.reLayout(this.selection, false);
        this.separator('endnote');
        this.continuationSeparator('endnote');
        this.documentHelper.layout.isEndnoteContentChanged = false;
    }
    private updateEndnoteCollection(endnote: FootnoteElementBox): void {
        if (this.documentHelper.endnoteCollection.indexOf(endnote) === -1) {
            let isInserted: boolean = false;
            if (this.documentHelper.endnoteCollection.length > 0) {

                const currentStart: TextPosition = this.selection.getElementPosition(endnote).startPosition;
                for (let i: number = 0; i < this.documentHelper.endnoteCollection.length; i++) {

                    const paraIndex: TextPosition = this.selection.getElementPosition(this.documentHelper.endnoteCollection[i]).startPosition;
                    if (currentStart.isExistBefore(paraIndex)) {
                        isInserted = true;
                        this.documentHelper.endnoteCollection.splice(i, 0, endnote);
                        break;
                    }
                }
            }
            if (!isInserted) {
                this.documentHelper.endnoteCollection.push(endnote);
            }
            const lastpage: number = this.documentHelper.pages.length;
            if (this.documentHelper.endnoteCollection.length > 0) {
                let positionchanged: boolean = false;
                // this.documentHelper.layout.isFootnoteContentChanged = true;
                let foot: FootnoteElementBox;
                let endnoteWidget: FootNoteWidget;
                const footIndex: number = this.documentHelper.endnoteCollection.indexOf(endnote);
                let insertIndex: number = 1;
                const height: number = 0;
                let isCreated: boolean;
                const bodyWidget: BlockContainer = this.documentHelper.pages[lastpage - 1].bodyWidgets[0];
                if (bodyWidget.page.endnoteWidget) {
                    for (let j: number = 0; j < bodyWidget.page.endnoteWidget.childWidgets.length; j++) {

                        const currentIndex: number = this.documentHelper.endnoteCollection.indexOf((bodyWidget.page.endnoteWidget.childWidgets[j] as BlockWidget).footNoteReference);
                        if (currentIndex > footIndex) {
                            if (currentIndex - footIndex === 1) {
                                insertIndex = j;
                                positionchanged = true;
                                break;
                            }
                        }
                    }
                }
                // endnote.isLayout = true;
                foot = endnote; //this.documentHelper.endnoteCollection[i];
                if (bodyWidget.page.endnoteWidget instanceof FootNoteWidget && bodyWidget.page.endnoteWidget.footNoteType === 'Endnote') {
                    endnoteWidget = bodyWidget.page.endnoteWidget as FootNoteWidget;
                } else {
                    isCreated = true;
                    endnoteWidget = new FootNoteWidget();
                    endnoteWidget.footNoteType = 'Endnote';
                    endnoteWidget.page = bodyWidget.page;
                    const newParagraph: ParagraphWidget = new ParagraphWidget();
                    newParagraph.characterFormat = new WCharacterFormat();
                    newParagraph.paragraphFormat = new WParagraphFormat();
                    newParagraph.index = 0;
                    const lineWidget: LineWidget = new LineWidget(newParagraph);
                    newParagraph.childWidgets.push(lineWidget);
                    endnoteWidget.childWidgets.push(newParagraph);
                }
                for (let j: number = 0; j < foot.blocks.length; j++) {
                    const block: BlockWidget = foot.blocks[j];
                }
                if (positionchanged) {
                    endnoteWidget.childWidgets.splice(insertIndex, 0, foot.blocks[0]);
                } else {
                    endnoteWidget.childWidgets.push(foot.blocks[0]);
                }
                insertIndex++;
                if (isCreated) {
                    bodyWidget.page.endnoteWidget = endnoteWidget;
                }
                // endNote.containerWidget = bodyWidget;
                endnoteWidget.height += height;

                //         }
                // this.documentHelper.layout.layoutfootNote(endnoteWidget);
                //this.layoutfootNote(endNote);
            }
            // this.viewer.updateScrollBars();
        }
    }
    private separator(type: string): void {
        //let block = new page_1.block;
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const lineWidget: LineWidget = new LineWidget(paragraph);
        const text: TextElementBox = new TextElementBox();
        text.characterFormat.fontColor = '#00000000';
        text.line = lineWidget;
        text.text = '\u0003';
        lineWidget.children.push(text);
        paragraph.childWidgets.push(lineWidget);
        if (type === 'footnote' && this.documentHelper.footnotes.separator.length < 1) {
            this.documentHelper.footnotes.separator.push(paragraph);
        } else if (type === 'endnote' && this.documentHelper.endnotes.separator.length < 1) {
            this.documentHelper.endnotes.separator.push(paragraph);
        }
    }
    private continuationSeparator(type: string): void {
        //var block = new page_1.block;
        const paragraph: ParagraphWidget = new ParagraphWidget();
        const lineWidget: LineWidget = new LineWidget(paragraph);
        const text: TextElementBox = new TextElementBox();
        text.characterFormat.fontColor = '#00000000';
        text.line = lineWidget;
        text.text = '\u0004';
        lineWidget.children.push(text);
        paragraph.childWidgets.push(lineWidget);
        if (type === 'footnote' && this.documentHelper.footnotes.continuationSeparator.length < 1) {
            this.documentHelper.footnotes.continuationSeparator.push(paragraph);
        } else if (type === 'endnote' && this.documentHelper.endnotes.continuationSeparator.length < 1) {
            this.documentHelper.endnotes.continuationSeparator.push(paragraph);
        }
    }

}
/**
 * @private
 */
export interface SelectionInfo {
    start: string;
    end: string;
}

/**
 * @private
 */
export interface ContinueNumberingInfo {
    currentList: WList;
    listLevelNumber: number;
    listPattern: ListLevelPattern;
}
/**
 * Specifies the settings for border.
 */
export interface BorderSettings {
    /**
     * Specifies the border type.
     */
    type: BorderType;
    /**
     * Specifies the border color.
     */
    borderColor?: string;
    /**
     * Specifies the line width.
     */
    lineWidth?: number;
    /**
     * Specifies the border style.
     */
    borderStyle?: LineStyle;
}
/**
 * @private
 */
export interface TocLevelSettings {
    [key: string]: number;
}

/**
 * @private
 */
export interface PageRefFields {
    [key: string]: FieldTextElementBox;
}
/**
 * Specifies the settings for table of contents.
 */
export interface TableOfContentsSettings {
    /**
     * Specifies the start level.
     */
    startLevel?: number;
    /**
     * Specifies the end level.
     */
    endLevel?: number;
    /**
     * Specifies whether hyperlink can be included.
     */
    includeHyperlink?: boolean;
    /**
     * Specifies whether page number can be included.
     */
    includePageNumber?: boolean;
    /**
     * Specifies whether the page number can be right aligned.
     */
    rightAlign?: boolean;
    /**
     * Specifies the tab leader.
     */
    tabLeader?: TabLeader;
    /**
     * @private
     */
    levelSettings?: TocLevelSettings;
    /**
     * Specifies whether outline levels can be included.
     */
    includeOutlineLevels?: boolean;
}


/**
 * Defines the character format properties of document editor
 */
export interface CharacterFormatProperties {
    /**
     * Defines the bold formatting
     */
    bold?: boolean;
    /**
     * Defines the italic formatting
     */
    italic?: boolean;

    /**
     * Defines the font size
     */
    fontSize?: number;
    /**
     * Defines the font family
     */
    fontFamily?: string;
    /**
     * Defines the underline property
     */
    underline?: Underline;
    /**
     * Defines the strikethrough
     */
    strikethrough?: Strikethrough;
    /**
     * Defines the subscript or superscript property
     */
    baselineAlignment?: BaselineAlignment;
    /**
     * Defines the highlight color
     */
    highlightColor?: HighlightColor;
    /**
     * Defines the font color
     */
    fontColor?: string;
    /**
     * Defines the bidirectional property
     */
    bidi?: boolean;
    /**
     * Defines the allCaps formatting
     */
    allCaps?: boolean;
}

/**
 * Defines the paragraph format properties of document editor
 */
export interface ParagraphFormatProperties {
    /**
     * Defines the left indent
     */
    leftIndent?: number;
    /**
     * Defines the right indent
     */
    rightIndent?: number;
    /**
     * Defines the first line indent
     */
    firstLineIndent?: number;
    /**
     * Defines the text alignment property
     */
    textAlignment?: TextAlignment;
    /**
     * Defines the spacing value after the paragraph
     */
    afterSpacing?: number;
    /**
     * Defines the spacing value before the paragraph
     */
    beforeSpacing?: number;
    /**
     * Defines the spacing between the lines
     */
    lineSpacing?: number;
    /**
     * Defines the spacing type(AtLeast,Exactly or Multiple) between the lines
     */
    lineSpacingType?: LineSpacingType;
    /**
     * Defines the bidirectional property of paragraph
     */
    bidi?: boolean;
    /**
     * Defines the keep with next property of paragraph
     */
    keepWithNext?: boolean;
    /**
     * Defines the keep lines together property of paragraph
     */
    keepLinesTogether?: boolean;
}
/**
 * Defines the section format properties of document editor
 */
export interface SectionFormatProperties {
    /**
     * Defines the header distance.
     */
    headerDistance?: number;
    /**
     * Defines the footer distance.
     */
    footerDistance?: number;
    /**
     * Defines the page width.
     */
    pageWidth?: number;
    /**
     * Defines the page height.
     */
    pageHeight?: number;
    /**
     * Defines the left margin of the page.
     */
    leftMargin?: number;
    /**
     * Defines the top margin of the page.
     */
    topMargin?: number;
    /**
     * Defines the bottom margin of the page.
     */
    bottomMargin?: number;
    /**
     * Defines the right margin of the page.
     */
    rightMargin?: number;
}
