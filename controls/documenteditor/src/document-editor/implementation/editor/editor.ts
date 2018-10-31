import { LayoutViewer } from '../index';
import { Selection } from '../index';
import { TextPosition, ImageFormat } from '../selection/selection-helper';
import {
    IWidget, ParagraphWidget, LineWidget, ElementBox, TextElementBox, Margin, Page, ImageElementBox,
    BlockWidget, BlockContainer, BodyWidget, TableWidget, TableCellWidget, TableRowWidget, Widget, ListTextElementBox,
    BookmarkElementBox, HeaderFooterWidget, FieldTextElementBox, TabElementBox
} from '../viewer/page';
import { WCharacterFormat } from '../format/character-format';
import {
    ElementInfo, HelperMethods, CellInfo, HyperlinkTextInfo,
    ParagraphInfo, LineInfo, IndexInfo, BlockInfo, CellCountInfo
} from './editor-helper';
import { isNullOrUndefined, Browser, classList } from '@syncfusion/ej2-base';
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
    FollowCharacterType, HeaderFooterType
} from '../../base/index';
import { SelectionCharacterFormat } from '../index';
import { Action } from '../../index';
import { PageLayoutViewer } from '../index';
import { WCharacterStyle } from '../format/style';
import { EditorHistory } from '../editor-history/index';
import { BaseHistoryInfo } from '../editor-history/base-history-info';
import { TableResizer } from './table-resizer';
import { Dictionary } from '../../base/dictionary';
import { WParagraphStyle } from '../format/style';
import {
    TableAlignment, WidthType, HeightType, CellVerticalAlignment, BorderType, LineStyle,
    TabLeader, OutlineLevel
} from '../../base/types';
import { DocumentEditor } from '../../document-editor';

/** 
 * Editor module 
 */
export class Editor {
    /**
     * @private
     */
    public viewer: LayoutViewer;
    private nodes: IWidget[] = [];
    private editHyperlinkInternal: boolean = false;
    private startOffset: number;
    private startParagraph: ParagraphWidget = undefined;
    private endOffset: number;
    private endParagraph: ParagraphWidget = undefined;
    /**
     * @private
     */
    public isHandledComplex: boolean = false;
    /**
     * @private
     */
    public tableResize: TableResizer = undefined;
    /**
     * @private
     */
    public tocStyles: TocLevelSettings = {};
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
    /**
     * @private
     */
    public isInsertingTOC: boolean = false;

    /**
     * Initialize the editor module
     * @param  {LayoutViewer} viewer
     * @private
     */
    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
        this.tableResize = new TableResizer(this.viewer.owner);
    }
    private get editorHistory(): EditorHistory {
        return this.viewer.owner.editorHistory;
    }
    /**
     * @private
     */
    public isBordersAndShadingDialog: boolean = false;
    private get selection(): Selection {
        if (this.viewer) {
            return this.viewer.selection;
        }
        return undefined;
    }

    private get owner(): DocumentEditor {
        return this.viewer.owner;
    }
    private getModuleName(): string {
        return 'Editor';
    }

    public insertField(code: string, result?: string): void {
        let fieldCode: string = code;
        if (isNullOrUndefined(result)) {
            fieldCode = HelperMethods.trimStart(fieldCode);
            if (fieldCode.substring(0, 10) === 'MERGEFIELD') {
                fieldCode = fieldCode.substring(10).trim();
                let index: number = fieldCode.indexOf('\\*');
                result = '«' + fieldCode.substring(0, index).trim() + '»';
            }
        }
        let paragraph: ParagraphWidget = new ParagraphWidget();
        let line: LineWidget = new LineWidget(paragraph);
        let fieldBegin: FieldElementBox = new FieldElementBox(0);
        line.children.push(fieldBegin);
        let fieldCodeSpan: TextElementBox = new TextElementBox();
        fieldCodeSpan.text = code;
        line.children.push(fieldCodeSpan);
        let fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldBegin.fieldSeparator = fieldSeparator;
        line.children.push(fieldSeparator);
        let fieldResultSpan: TextElementBox = new TextElementBox();
        fieldResultSpan.text = result;
        line.children.push(fieldResultSpan);
        let fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.fieldSeparator = fieldSeparator;
        fieldEnd.fieldBegin = fieldBegin;
        fieldBegin.fieldEnd = fieldEnd;
        fieldSeparator.fieldEnd = fieldEnd;
        line.children.push(fieldEnd);
        fieldBegin.line = line;
        paragraph.childWidgets.push(line);
        this.viewer.fields.push(fieldBegin);
        let widgets: BlockWidget[] = [];
        widgets.push(paragraph);
        this.pasteContentsInternal(widgets);

    }

    /**
     * To update style for paragraph
     * @param style - style name
     * @param clearDirectFormatting - Removes manual formatting (formatting not applied using a style) 
     * from the selected text, to match the formatting of the applied style. Default value is false.
     */
    public applyStyle(style: string, clearDirectFormatting?: boolean): void {
        clearDirectFormatting = isNullOrUndefined(clearDirectFormatting) ? false : clearDirectFormatting;
        if (clearDirectFormatting) {
            this.initComplexHistory('ApplyStyle');
            this.clearFormatting();
        }
        let styleObj: Object = this.viewer.styles.findByName(style);
        if (styleObj !== undefined) {
            this.onApplyParagraphFormat('styleName', styleObj, false, true);
        } else {
            // tslint:disable-next-line:max-line-length
            this.viewer.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), JSON.parse(this.viewer.preDefinedStyles.get(style)), this.viewer.styles);
            this.applyStyle(style);
        }
        if (this.editorHistory && this.editorHistory.currentHistoryInfo && this.editorHistory.currentHistoryInfo.action === 'ApplyStyle') {
            this.editorHistory.updateComplexHistory();
        }
    }
    // Public Implementation Starts
    /**
     * Moves the selected content in the document editor control to clipboard.
     */
    public cut(): void {
        if (this.owner.isReadOnlyMode || this.selection.isEmpty) {
            return;
        }
        this.selection.copySelectedContent(true);
    }
    /**
     * Notify content change event
     * @private
     */
    public fireContentChange(): void {
        if (this.viewer.owner.isLayoutEnabled && !this.viewer.owner.isShiftingEnabled) {
            this.viewer.owner.fireContentChange();
        }
    }
    /**
     * Update physical location for text position
     * @private
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
     */
    public onTextInputInternal = (event: KeyboardEvent): void => {
        if (Browser.isDevice) {
            let viewer: LayoutViewer = this.viewer;
            let nbsp: RegExp = new RegExp(String.fromCharCode(160), 'g');
            let lineFeed: RegExp = new RegExp(String.fromCharCode(10), 'g');
            viewer.prefix = viewer.prefix.replace(nbsp, ' ').replace(lineFeed, ' ');
            let text: string = viewer.editableDiv.textContent.replace(nbsp, ' ').replace(lineFeed, ' ');
            let textBoxText: string = text.substring(2);
            if (viewer.isCompositionStart && viewer.isCompositionUpdated) {
                viewer.isCompositionUpdated = false;
                if (!viewer.owner.isReadOnlyMode && viewer.owner.isDocumentLoaded) {
                    if (viewer.prefix.substring(2) !== textBoxText) {
                        if (this.selection.isEmpty) {
                            // tslint:disable-next-line:max-line-length
                            this.selection.start.setPositionForLineWidget(viewer.selection.start.currentWidget, this.selection.start.offset - (viewer.prefix.length - 2));
                            this.handleTextInput(textBoxText);
                            viewer.prefix = '@' + String.fromCharCode(160) + textBoxText;
                        } else {
                            this.handleTextInput(textBoxText);
                            viewer.prefix = '@' + String.fromCharCode(160) + textBoxText;
                        }
                    }
                }
                return;
            } else if (viewer.isCompositionStart && viewer.isCompositionEnd && viewer.suffix === '') {
                if (viewer.prefix.substring(2) !== textBoxText) {
                    if (this.selection.isEmpty && viewer.isCompositionStart) {
                        viewer.isCompositionStart = false;
                        // tslint:disable-next-line:max-line-length
                        this.selection.start.setPositionForLineWidget(viewer.selection.start.currentWidget, this.selection.start.offset - viewer.prefix.substring(2).length);
                        this.selection.retrieveCurrentFormatProperties();
                        if (viewer.suffix === '' || textBoxText === '') {
                            this.handleTextInput(textBoxText);
                        }
                    } else if (!this.selection.isEmpty) {
                        viewer.isCompositionStart = false;
                        this.handleTextInput(textBoxText);
                    }
                } else if (textBoxText === '') {
                    viewer.isCompositionStart = false;
                    this.handleBackKey();
                } else if (viewer.prefix.substring(2) === textBoxText && viewer.suffix === '') {
                    viewer.isCompositionStart = false;
                    this.handleTextInput(' ');
                }
                viewer.isCompositionEnd = false;
                return;
            } else if (viewer.isCompositionEnd || viewer.isCompositionStart && !viewer.isCompositionUpdated) {
                if (textBoxText.length < viewer.prefix.length &&
                    textBoxText === viewer.prefix.substring(2, viewer.prefix.length - 1) || viewer.editableDiv.innerText.length < 2) {
                    this.handleBackKey();
                    return;
                } else if (viewer.suffix !== '' &&
                    viewer.editableDiv.innerText[viewer.editableDiv.innerText.length - 1] !== String.fromCharCode(160)) {
                    viewer.isCompositionStart = false;
                    //When cursor is placed in between a word and chosen a word from predicted words.
                    // tslint:disable-next-line:max-line-length
                    this.selection.start.setPositionForLineWidget(viewer.selection.start.currentWidget, this.selection.start.offset - (viewer.prefix.length - 2));
                    this.selection.end.setPositionForLineWidget(viewer.selection.end.currentWidget, this.selection.end.offset + viewer.suffix.length);
                    //Retrieve the character format properties. Since the selection was changed manually.
                    this.selection.retrieveCurrentFormatProperties();
                    this.handleTextInput(textBoxText);
                    return;
                }
            }
            // tslint:disable-next-line:max-line-length
            if (text !== '\r' && text !== '\b' && text !== '\u001B' && !viewer.owner.isReadOnlyMode && viewer.isControlPressed === false) {
                if (text === '@' || text[0] !== '@' || text === '' || text.length < viewer.prefix.length &&
                    textBoxText === viewer.prefix.substring(2, viewer.prefix.length - 1)) {
                    this.handleBackKey();
                    if (viewer.editableDiv.innerText.length < 2) {
                        this.predictText();
                    }
                } else if (text.indexOf(viewer.prefix) === 0 && text.length > viewer.prefix.length) {
                    this.handleTextInput(text.substring(viewer.prefix.length));
                } else if (text.indexOf(viewer.prefix) === -1 && text[text.length - 1] !== String.fromCharCode(160)
                    && text[text.length - 1] !== ' ') {
                    if ((textBoxText.charAt(0).toLowerCase() + textBoxText.slice(1)) === viewer.prefix.substring(2)) {
                        // tslint:disable-next-line:max-line-length
                        this.selection.start.setPositionParagraph(viewer.selection.start.currentWidget, this.selection.start.offset - (viewer.prefix.length - 2));
                    }
                    this.handleTextInput(textBoxText);
                } else if (text.length !== 2) {
                    this.handleTextInput(' ');
                }
            }
        } else {
            let text: string = this.viewer.editableDiv.innerText;
            if (text !== String.fromCharCode(160)) {
                // tslint:disable-next-line:max-line-length
                if (text !== '\r' && text !== '\b' && text !== '\u001B' && !this.owner.isReadOnlyMode && this.viewer.isControlPressed === false) {
                    this.handleTextInput(text);
                }
            } else {
                this.handleTextInput(' ');
            }
            this.viewer.editableDiv.innerText = '';
        }
    }
    /**
     * Predict text
     * @private
     */
    public predictText(): void {
        this.viewer.suffix = '';
        if (this.selection.start.paragraph.isEmpty() || this.selection.start.offset === 0 &&
            this.selection.start.currentWidget.isFirstLine() || this.selection.end.offset === 0 &&
            this.selection.end.currentWidget.isFirstLine()) {
            this.viewer.prefix = '';
        } else {
            this.getPrefixAndSuffix();
        }
        this.viewer.prefix = '@' + String.fromCharCode(160) + this.viewer.prefix; // &nbsp;
        this.viewer.editableDiv.innerText = this.viewer.prefix;
        this.viewer.selection.setEditableDivCaretPosition(this.viewer.prefix.length);
    }
    /**
     * Gets prefix and suffix.
     * @private
     */
    /* tslint:disable:max-func-body-length */
    public getPrefixAndSuffix(): void {
        let viewer: LayoutViewer = this.viewer;
        if (this.selection.text !== '') {
            viewer.prefix = '';
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
                        viewer.prefix = '';
                    }
                    if (!(inline instanceof TextElementBox)) {
                        inline = this.selection.getPreviousTextElement(inline);
                    }
                    /* tslint:disable:no-conditional-assignment */
                    while ((spaceIndex = viewer.prefix.lastIndexOf(' ')) < 0 && inline instanceof TextElementBox) {
                        if (inline.previousNode instanceof TextElementBox && viewer.prefix.indexOf(' ') === -1) {
                            if (!prefixAdded) {
                                viewer.prefix = inline.text.substring(0, startIndex);
                                prefixAdded = true;
                            } else {
                                viewer.prefix = inline.text + viewer.prefix;
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
                                viewer.prefix = inline.text.substring(0, startIndex);
                                prefixAdded = true;
                            } else {
                                viewer.prefix = inline.text + viewer.prefix;
                            }
                            break;
                        }
                    }
                    if (!(viewer.prefix.length > 1 && viewer.prefix[viewer.prefix.length - 1] === ' ' &&
                        viewer.prefix[viewer.prefix.length - 2] === '.')) {
                        spaceIndex = viewer.prefix.lastIndexOf(' ');
                    } else {
                        spaceIndex = -1;
                        viewer.prefix = '';
                    }
                    viewer.prefix = spaceIndex < 0 ? viewer.prefix : viewer.prefix.substring(spaceIndex);
                    if (viewer.prefix.indexOf(' ') === 0 && viewer.prefix.length >= 1) {
                        viewer.prefix = viewer.prefix.substring(1);
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
                            viewer.suffix = '';
                        }
                        // boxIndex = renderedElements.get(endInline).indexOf(box);
                        while ((spaceIndex = viewer.suffix.indexOf(' ')) < 0 && endInline instanceof TextElementBox) {
                            if (endInline.nextNode instanceof TextElementBox && viewer.suffix.indexOf(' ') === -1) {
                                if (!suffixAdded) {
                                    viewer.suffix = (box as TextElementBox).text.substring(endIndex);
                                    suffixAdded = true;
                                } else {
                                    viewer.suffix = viewer.suffix + endInline.text;
                                }
                                endInline = endInline.nextNode as TextElementBox;
                            } else if (!(endInline.nextNode instanceof TextElementBox)) {
                                if (!suffixAdded) {
                                    viewer.suffix = (box as TextElementBox).text.substring(endIndex);
                                    suffixAdded = true;
                                } else {
                                    viewer.suffix = viewer.suffix + endInline.text;
                                }
                                break;
                            }
                        }
                        spaceIndex = viewer.suffix.indexOf(' ');
                        viewer.suffix = spaceIndex < 0 ? viewer.suffix : viewer.suffix.substring(0, spaceIndex);
                    }
                }
            }
        }
    }
    /**
     * Fired on paste.
     * @param {ClipboardEvent} event
     * @private
     */
    public onPaste = (event: ClipboardEvent): void => {
        if (!this.owner.isReadOnlyMode) {
            this.pasteInternal(event);
        }
        event.preventDefault();
    }
    /**
     * key action 
     * @private
     */
    // tslint:disable:max-func-body-length
    public onKeyDownInternal(event: KeyboardEvent, ctrl: boolean, shift: boolean, alt: boolean): void {
        let key: number = event.which || event.keyCode;
        if (ctrl && !shift && !alt) {
            this.viewer.isControlPressed = true;
            switch (key) {
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
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyParagraphFormat('lineSpacing', 1, false, false);
                    }
                    break;
                case 50:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyParagraphFormat('lineSpacing', 2, false, false);
                    }
                    break;
                case 53:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyParagraphFormat('lineSpacing', 1.5, false, false);
                    }
                    break;
                case 66:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
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
                    if (!this.owner.isReadOnlyMode) {
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
                    if (!this.owner.isReadOnlyMode) {
                        this.toggleItalic();
                    }
                    break;
                case 74:
                    if (!this.owner.isReadOnlyMode) {
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
                    if (!this.owner.isReadOnlyMode) {
                        this.toggleTextAlignment('Left');
                    }
                    event.preventDefault();
                    break;
                case 77:
                    if (!this.owner.isReadOnlyMode) {
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
                    if (!this.owner.isReadOnlyMode) {
                        this.toggleTextAlignment('Right');
                    }
                    event.preventDefault();
                    break;
                case 85:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
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
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyCharacterFormat('fontSize', 'decrement', true);
                    }
                    break;
                case 221:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
                        this.onApplyCharacterFormat('fontSize', 'increment', true);
                    }
                    break;
                case 187:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode) {
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
            }
        } else if (!shift && ctrl && alt) {
            switch (key) {
                case 72:
                    event.preventDefault();
                    if (!this.owner.isReadOnlyMode && this.owner.isDocumentLoaded) {
                        this.toggleHighlightColor();
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
                    this.handleEnterKey();
                    break;
                case 46:
                    this.handleDelete();
                    event.preventDefault();
                    break;

            }
        }
    }
    /**
     * @private
     */
    public handleShiftEnter(): void {
        if (!this.owner.isReadOnlyMode) {
            this.handleTextInput('\v');
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Handles back key.
     * @private
     */
    public handleBackKey(): void {
        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.onBackSpace();
        }
        this.selection.checkForCursorVisibility();
    }

    /**
     * Handles delete
     * @private
     */
    public handleDelete(): void {
        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.onDelete();
        }
        this.selection.checkForCursorVisibility();
    }
    /**
     * Handles enter key.
     * @private
     */
    public handleEnterKey(): void {
        if (!this.owner.isReadOnlyMode) {
            if (Browser.isDevice) {
                this.viewer.isCompositionStart = false;
            }
            this.owner.editorModule.onEnter();
        }
        this.selection.checkForCursorVisibility();
    }

    /**
     * @private
     */
    public handleTextInput(text: string): void {
        if (!this.owner.isReadOnlyMode) {
            if (this.animationTimer) {
                clearTimeout(this.animationTimer);
            }
            classList(this.selection.caret, [], ['e-de-cursor-animation']);
            this.owner.editorModule.insertText(text, false);
            /* tslint:disable:align */
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
     * @param  {WCharacterFormat} format
     * @private
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
    /**
     * Inserts the specified text at cursor position
     * @param  {string} text
     * @param  {boolean} isReplace
     * @private
     */
    //tslint:disable: max-func-body-length
    public insertText(text: string, isReplace: boolean): void {
        let selection: Selection = this.viewer.selection;
        let insertPosition: TextPosition; let isRemoved: boolean = true;
        this.isListTextSelected();
        this.initHistory('Insert');
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
        this.viewer.selection.editPosition = this.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        if ((!selection.isEmpty && !this.viewer.selection.isImageSelected) ||
            this.viewer.isListTextSelected && selection.contextType === 'List') {
            selection.isSkipLayouting = true;
            selection.skipFormatRetrieval = true;
            isRemoved = this.removeSelectedContents(selection);
            selection.skipFormatRetrieval = false;
            selection.isSkipLayouting = false;
        }
        paragraphInfo = this.getParagraphInfo(selection.start);
        if (isRemoved) {
            selection.owner.isShiftingEnabled = true;
            this.updateInsertPosition();
            insertPosition = selection.start;
            if (insertPosition.paragraph.isEmpty()) {
                let span: TextElementBox = new TextElementBox();
                let insertFormat: WCharacterFormat = this.copyInsertFormat(insertPosition.paragraph.characterFormat, true);
                span.characterFormat.copyFormat(insertFormat);
                span.text = text;
                span.line = (insertPosition.paragraph as ParagraphWidget).childWidgets[0] as LineWidget;
                span.margin = new Margin(0, 0, 0, 0);
                span.line.children.push(span);
                if ((insertPosition.paragraph.paragraphFormat.textAlignment === 'Center'
                    || insertPosition.paragraph.paragraphFormat.textAlignment === 'Right') &&
                    insertPosition.paragraph.paragraphFormat.listFormat.listId === -1) {
                    insertPosition.paragraph.x = this.viewer.clientActiveArea.x;
                }
                this.viewer.layout.reLayoutParagraph(insertPosition.paragraph, 0, 0);
            } else {
                let indexInInline: number = 0;
                let inlineObj: ElementInfo = insertPosition.currentWidget.getInline(insertPosition.offset, indexInInline);
                let inline: ElementBox = inlineObj.element;
                indexInInline = inlineObj.index;
                // Todo: compare selection format
                let insertFormat: WCharacterFormat = this.copyInsertFormat(inline.characterFormat, true);
                if (insertFormat.isSameFormat(inline.characterFormat)) {
                    this.insertTextInline(inline, selection, text, indexInInline);
                } else {
                    let tempSpan: TextElementBox = new TextElementBox();
                    tempSpan.text = text;
                    tempSpan.line = inline.line;
                    tempSpan.characterFormat.copyFormat(insertFormat);
                    let insertIndex: number = inline.indexInOwner;
                    if (indexInInline === inline.length) {
                        inline.line.children.splice(insertIndex + 1, 0, tempSpan);
                    } else if (indexInInline === 0) {
                        inline.line.children.splice(insertIndex, 0, tempSpan);
                    } else {
                        if (inline instanceof TextElementBox) {
                            let splittedSpan: TextElementBox = new TextElementBox();
                            splittedSpan.line = inline.line;
                            splittedSpan.characterFormat.copyFormat(inline.characterFormat);
                            splittedSpan.text = (inline as TextElementBox).text.substring(indexInInline);
                            (inline as TextElementBox).text = (inline as TextElementBox).text.slice(0, indexInInline);
                            inline.line.children.splice(insertIndex + 1, 0, splittedSpan);
                        }
                        inline.line.children.splice(insertIndex + 1, 0, tempSpan);
                    }
                    this.viewer.layout.reLayoutParagraph(insertPosition.paragraph, inline.line.indexInOwner, 0);
                }
            }
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + text.length, true);
            this.updateEndPosition();
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(this.editorHistory) && !isNullOrUndefined(this.editorHistory.currentHistoryInfo) && (this.editorHistory.currentHistoryInfo.action === 'ListSelect') &&
                this.viewer.isListTextSelected) {
                this.editorHistory.updateHistory();
                this.editorHistory.updateComplexHistory();
            }
            // if (!isNullOrUndefined(selection.currentHistoryInfo) && (selection.currentHistoryInfo.action === 'MultiSelection')) {
            //     this.updateComplexHistory();
            // } else {           
            this.reLayout(selection);
            // }
        } else {
            // selection.selectContent(selection.start, true);
        }
        // insertFormat.destroy();
        if (!isReplace && isRemoved && (text === ' ' || text === '\t' || text === '\v')) {
            let hyperlinkField: FieldElementBox = selection.getHyperlinkField();
            let isSelectionOnHyperlink: boolean = !isNullOrUndefined(hyperlinkField);
            let isList: boolean = false;
            if (!(text === '\v')) {
                isList = this.checkAndConvertList(selection, text === '\t');
            }
            if (isSelectionOnHyperlink) {
                return;
            }
            if (!isList) {
                //Checks if the previous text is URL, then it is auto formatted to hyperlink.
                this.checkAndConvertToHyperlink(selection, false);
            }
        }
    }
    /**
     * @private
     */
    public insertIMEText(text: string, isUpdate: boolean): void {
        if (this.viewer.lastComposedText === text && isUpdate) {
            return;
        }
        // Clone selection start position
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(this.selection.start);
        let startPosition: string = this.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
        // Insert IME text in current selection
        this.insertText(text, false);
        this.viewer.lastComposedText = text;
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
     */
    public insertSectionBreak(): void {
        let selection: Selection = this.viewer.selection;
        if (isNullOrUndefined(selection) || this.owner.isReadOnlyMode || selection.start.paragraph.isInHeaderFooter) {
            return;
        }
        this.initHistory('SectionBreak');
        if (!selection.isEmpty) {
            selection.selectContent(selection.isForward ? selection.start : selection.end, true);
        }
        this.viewer.owner.isShiftingEnabled = true;
        this.updateInsertPosition();
        this.insertSection(selection, true);
        this.updateEndPosition();
        this.reLayout(selection, true);
    }
    /**
     * @private
     */
    public insertSection(selection: Selection, selectFirstBlock: boolean): BlockWidget {
        let newSectionFormat: WSectionFormat = this.selection.start.paragraph.bodyWidget.sectionFormat.cloneFormat();
        let lastBlock: BlockWidget;
        let firstBlock: BlockWidget;
        if (selection.start.paragraph.isInsideTable) {
            let table: TableWidget = this.viewer.layout.getParentTable(selection.start.paragraph);
            table = table.combineWidget(this.viewer) as TableWidget;
            let insertBefore: boolean = false;
            if (selection.start.paragraph.associatedCell.rowIndex === 0) {
                insertBefore = true;
            }
            let newParagraph: ParagraphWidget = new ParagraphWidget();
            let previousBlock: BlockWidget = table.previousRenderedWidget as BlockWidget;
            if (!insertBefore) {
                lastBlock = this.splitTable(table, selection.start.paragraph.associatedCell.ownerRow);
                this.viewer.layout.layoutBodyWidgetCollection(lastBlock.index, lastBlock.containerWidget, lastBlock, false);
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
            this.viewer.layout.layoutBodyWidgetCollection(newParagraph.index, newParagraph.containerWidget, newParagraph, false);
            lastBlock = newParagraph;
        } else {
            let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
            let selectionStart: string = this.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
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
        this.viewer.layout.layoutBodyWidgetCollection(firstBlock.index, firstBlock.containerWidget, firstBlock, false);
        if (firstBlock instanceof TableWidget) {
            firstBlock = selection.getFirstParagraphInFirstCell(firstBlock);
        }
        if (selectFirstBlock) {
            selection.selectParagraph(firstBlock as ParagraphWidget, true);
        }
        return firstBlock;
    }
    private splitBodyWidget(bodyWidget: BodyWidget, sectionFormat: WSectionFormat, startBlock: BlockWidget): BodyWidget {
        let sectionIndex: number;
        //Move blocks after the start block to next body widget
        let newBodyWidget: BodyWidget = this.viewer.layout.moveBlocksToNextPage(startBlock);
        //Update SectionIndex for splitted body widget
        this.updateSectionIndex(sectionFormat, newBodyWidget, true);
        // insert New header footer widget in to section index 
        this.insertRemoveHeaderFooter(newBodyWidget.sectionIndex, true);
        //update header and footer for splitted widget
        this.viewer.layout.layoutHeaderFooter(newBodyWidget, this.viewer as PageLayoutViewer, newBodyWidget.page);
        //Update Child item index from 0 for new Section
        this.updateBlockIndex(0, newBodyWidget.firstChild as BlockWidget);
        // Start sinfting from first block
        this.viewer.updateClientArea(newBodyWidget.sectionFormat, newBodyWidget.page);
        return newBodyWidget;
    }
    private insertRemoveHeaderFooter(sectionIndex: number, insert: boolean): void {
        if (this.viewer.headersFooters[sectionIndex]) {
            // Need to handle further
        } else {
            this.viewer.headersFooters[sectionIndex] = {};
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
    private updateSectionIndex(sectionFormat: WSectionFormat, startBodyWidget: BodyWidget, increaseIndex: boolean): void {
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
        if (!isNullOrUndefined(list)) {
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
            // tslint:disable-next-line:max-line-length
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
        let listLevelPattern: ListLevelPattern = this.getListLevelPattern(text.substring(0, 1));
        if (listLevelPattern !== 'None' && this.checkNumberFormat(numberFormat, listLevelPattern === 'Bullet', text)) {
            convertList = true;
        } else if (this.checkLeadingZero(text)) {
            isLeadingZero = true;
            convertList = true;
        }
        if (convertList) {
            this.initComplexHistory('AutoList');
            let paragraph: ParagraphWidget = inline.paragraph as ParagraphWidget;
            // tslint:disable-next-line:max-line-length
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
            this.autoConvertList(selection, listLevel);
            if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentHistoryInfo)) {
                this.editorHistory.updateComplexHistory();
            } else {
                this.reLayout(selection);
            }

        }
        return convertList;
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
        if (this.viewer.lists.length > 0) {
            newList.listId = this.viewer.lists[this.viewer.lists.length - 1].listId + 1;
        } else {
            newList.listId = 0;
        }
        let newAbstractList: WAbstractList = new WAbstractList();
        let layout: LayoutViewer = this.viewer;
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
     */
    public insertTextInline(element: ElementBox, selection: Selection, text: string, index: number): void {
        if (element instanceof TextElementBox) {
            element.text = HelperMethods.insert(element.text, index, text);
            let paragraph: ParagraphWidget = (element.line as LineWidget).paragraph;
            let lineIndex: number = paragraph.childWidgets.indexOf(element.line);
            let elementIndex: number = element.line.children.indexOf(element);
            this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
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
        } else if (element instanceof BookmarkElementBox) {
            this.insertBookMarkText(element, selection, text, index);
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
        this.viewer.layout.reLayoutParagraph(fieldBegin.line.paragraph, lineIndex, spanIndex);
    }
    private insertBookMarkText(element: BookmarkElementBox, selection: Selection, text: string, index: number): void {
        let spanObj: TextElementBox = new TextElementBox();
        spanObj.text = text;
        let lineIndex: number = element.line.paragraph.childWidgets.indexOf(element.line);
        let spanIndex: number = (element.line as LineWidget).children.indexOf(element);
        spanObj.characterFormat.copyFormat(element.characterFormat);
        (element.line as LineWidget).children.splice(spanIndex, 0, spanObj);
        spanObj.line = element.line;
        this.viewer.layout.reLayoutParagraph(element.line.paragraph, lineIndex, spanIndex);
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
        this.viewer.layout.reLayoutParagraph(fieldSeparator.line.paragraph, lineIndex, spanIndex);
    }
    private insertFieldEndText(fieldEnd: FieldElementBox, selection: Selection, text: string, index: number): void {
        let span: TextElementBox = new TextElementBox();
        span.text = text;
        let spanIndex: number = (fieldEnd.line as LineWidget).children.indexOf(fieldEnd);
        span.characterFormat.copyFormat(fieldEnd.characterFormat);
        fieldEnd.line.children.splice(spanIndex + 1, 0, span);
        span.line = fieldEnd.line;
        let lineIndex: number = fieldEnd.line.paragraph.childWidgets.indexOf(fieldEnd.line);
        this.viewer.layout.reLayoutParagraph(fieldEnd.line.paragraph, lineIndex, spanIndex);
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
        this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, spanIndex);
    }
    /**
     * @private
     */
    private isListTextSelected(): void {
        if (this.viewer.isListTextSelected) {
            this.initComplexHistory('ListSelect');
            // tslint:disable-next-line:max-line-length
            if (this.viewer.selection.start.paragraph.paragraphFormat.listFormat && this.viewer.selection.start.paragraph.paragraphFormat.listFormat.listId !== -1) {
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
        while (span.previousNode instanceof TextElementBox && index === 0) {
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
            let startPos: TextPosition = new TextPosition(this.viewer.owner);
            startPos.setPositionParagraph(span.line, span.line.getOffset(span, index));
            let endPos: TextPosition = new TextPosition(this.viewer.owner);
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
        let blockInfo: ParagraphInfo = this.getParagraphInfo(startPosition);
        let start: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
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
        blockInfo = this.getParagraphInfo(selection.end);
        let end: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
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
        this.updateCharacterFormatWithUpdate(selection, 'fontColor', '#0563c1', false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.reLayout(selection, false);
    }
    // tslint:disable-next-line:max-line-length
    private createHyperlinkElement(url: string, startPosition: TextPosition, endPosition: TextPosition, format: WCharacterFormat): FieldElementBox {
        let selection: Selection = this.selection;
        this.viewer.layout.allowLayout = false;
        this.appylingHyperlinkFormat(selection);
        this.viewer.layout.allowLayout = true;
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
        fieldEnd.linkFieldCharacter(this.viewer);
        this.viewer.layout.reLayoutParagraph(selection.start.paragraph, lineIndex, index);
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
    private unLinkFieldCharacter(inline: ElementBox): void {
        if (inline instanceof FieldElementBox && inline.fieldType === 0) {
            if (inline.fieldEnd) {
                if (this.viewer) {
                    this.viewer.fieldToLayout = inline;
                    this.viewer.fieldEndParagraph = inline.line.paragraph;
                }
                // inline.line.paragraph.addFieldCharacter(inline.fieldEnd);
                inline.fieldEnd = undefined;
            }
        }
        if (inline instanceof FieldElementBox && inline.fieldType === 2) {
            if (!isNullOrUndefined(inline.fieldEnd)) {
                if (this.viewer) {
                    this.viewer.fieldToLayout = inline.fieldBegin;
                    this.viewer.fieldEndParagraph = inline.line.paragraph;
                }
                inline.fieldBegin.fieldSeparator = undefined;
                inline.fieldEnd.fieldSeparator = undefined;
            }
        } else if (inline instanceof FieldElementBox && inline.fieldType === 1) {
            if (inline.fieldBegin) {
                if (!isNullOrUndefined(this.viewer)) {
                    this.viewer.fieldToLayout = inline.fieldBegin;
                    this.viewer.fieldEndParagraph = inline.line.paragraph;
                }
                let fieldIndex: number = this.viewer.fields.indexOf(inline.fieldBegin);
                if (fieldIndex !== -1) {
                    this.viewer.fields.splice(fieldIndex, 1);
                }
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
     * @param  {string} url
     * @param  {string} displayText
     * @param  {boolean} remove
     * @private
     */
    public insertHyperlink(url: string, displayText: string, remove: boolean, isBookmark?: boolean): void {
        let selection: Selection = this.viewer.selection;
        if (selection.start.paragraph.associatedCell !== selection.end.paragraph.associatedCell) {
            return;
        }
        if (remove) {
            //Empty selection Hyperlink insert
            this.insertHyperlinkInternal(selection, url, displayText, isBookmark);
        } else {
            //Non-Empty Selection- change the selected text to Field       
            // this.preservedFontCol = this.getFontColor();
            let startPosition: TextPosition = selection.start;
            let endPosition: TextPosition = selection.end;
            if (!selection.isForward) {
                startPosition = selection.end;
                endPosition = selection.start;
            }
            let fieldStartPosition: TextPosition = new TextPosition(this.viewer.owner);
            fieldStartPosition.setPositionInternal(startPosition);

            let temp: WCharacterFormat = this.getCharacterFormat(selection);
            let format: WCharacterFormat = new WCharacterFormat(undefined);
            format.copyFormat(temp);
            this.initComplexHistory('InsertHyperlink');
            let blockInfo: ParagraphInfo = this.getParagraphInfo(startPosition);
            let start: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
                // tslint:disable-next-line:max-line-length
                this.editorHistory.currentHistoryInfo.insertPosition = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            }
            this.appylingHyperlinkFormat(selection);
            this.viewer.layout.allowLayout = true;
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
            fieldEnd.linkFieldCharacter(this.viewer);
            let lineIndex: number = selection.start.paragraph.childWidgets.indexOf(begin.line);
            let index: number = begin.line.children.indexOf(begin);
            this.viewer.layout.reLayoutParagraph(selection.start.paragraph, lineIndex, index);
            let lineWidget: LineWidget = fieldEnd.line;
            selection.selects(lineWidget, lineWidget.getOffset(fieldEnd, fieldEnd.length), true);
            blockInfo = this.getParagraphInfo(endPosition);
            let end: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
                // tslint:disable-next-line:max-line-length
                this.editorHistory.currentHistoryInfo.endPosition = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
                this.editorHistory.updateComplexHistory();
            } else {
                this.updateComplexWithoutHistory(1, start, end);
            }
        }
    }
    private insertHyperlinkInternal(selection: Selection, url: string, displayText: string, isBookmark?: boolean): void {
        if (isNullOrUndefined(selection.start)) {
            return;
        }
        if (this.editHyperlink(selection, url, displayText)) {
            return;
        }
        this.initHistory('InsertHyperlink');
        let isRemoved: boolean = true;
        if (!selection.isEmpty) {
            isRemoved = this.removeSelectedContents(selection);
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
    // tslint:disable-next-line:max-line-length
    private insertHyperlinkByFormat(selection: Selection, url: string, displayText: string, format: WCharacterFormat, isBookmark?: boolean): void {
        this.updateInsertPosition();
        selection.owner.isShiftingEnabled = true;
        let indexInInline: number = 0;
        let initial: number = indexInInline;
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
        let paragraph: ParagraphWidget = selection.start.paragraph;
        fieldEnd.linkFieldCharacter(this.viewer);
        if (this.viewer.fields.indexOf(fieldBegin) === -1) {
            this.viewer.fields.push(fieldBegin);
        }
        let offset: number = fieldEnd.line.getOffset(fieldEnd, 1);
        selection.selects(fieldEnd.line, fieldEnd.line.getOffset(fieldEnd, fieldEnd.length), true);
        this.updateEndPosition();
        this.reLayout(selection, true);
    }
    private initInsertInline(element: ElementBox, insertHyperlink?: boolean): void {
        this.initHistory('InsertInline');
        this.insertInlineInSelection(this.viewer.selection, element);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
    }
    /**
     * @private
     */
    public insertElementInCurrentLine(selection: Selection, inline: ElementBox, isReLayout: boolean): void {
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
     * @param  {Selection} selection
     * @param  {string} url
     * @param  {string} displayText
     * @private
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
            // tslint:disable-next-line:max-line-length
            let fieldObj: HyperlinkTextInfo = selection.getHyperlinkDisplayText(fieldBegin.fieldSeparator.line.paragraph, fieldBegin.fieldSeparator, fieldBegin.fieldEnd, isNestedField, format);
            fieldResult = fieldObj.displayText;
            isNestedField = fieldObj.isNestedField;
            format = fieldObj.format;
        }
        let offset: number = fieldBegin.line.getOffset(fieldBegin, 0);
        selection.start.setPositionParagraph(fieldBegin.line, offset);
        offset = fieldBegin.fieldEnd.line.getOffset(fieldBegin.fieldEnd, 1);
        selection.end.setPositionParagraph(fieldBegin.fieldEnd.line, offset);
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
            fieldEnd.linkFieldCharacter(this.viewer);
            let paragraph: ParagraphWidget = newFieldBegin.line.paragraph;
            let lineIndex: number = newFieldBegin.line.paragraph.childWidgets.indexOf(newFieldBegin.line);
            let elementIndex: number = newFieldBegin.line.children.indexOf(newFieldBegin);
            this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
            selection.selects(newFieldBegin.fieldEnd.line, offset, true);
            this.updateEndPosition();
            this.reLayout(selection, true);
        }
        this.editHyperlinkInternal = false;
        this.nodes = [];
        return true;
    }
    /* tslint:disable:no-any */
    private insertClonedFieldResult(selection: Selection, nodes: any, fieldSeparator: FieldElementBox): void {
        let fieldEnd: FieldElementBox;
        let isStarted: boolean = false;
        for (let i: number = nodes.length - 1; i > -1; i--) {
            let node: any = nodes[i] as any;
            /* tslint:enable:no-any */
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
                        selection.selectParagraph(selection.getNextParagraphBlock(paragraph), true);
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
        // tslint:disable-next-line:max-line-length
        fieldStartPosition.setPositionParagraph(fieldBegin.line, (fieldBegin.line).getOffset(fieldBegin, 0));
        let fieldSeparatorPosition: TextPosition = new TextPosition(selection.owner);
        // tslint:disable-next-line:max-line-length
        fieldSeparatorPosition.setPositionParagraph(fieldSeparator.line, (fieldSeparator.line).getOffset(fieldSeparator, fieldSeparator.length));

        this.initComplexHistory('RemoveHyperlink');
        selection.start.setPositionParagraph(fieldEnd.line, (fieldEnd.line).getOffset(fieldEnd, 0));
        selection.end.setPositionInternal(selection.start);
        this.onDelete();

        selection.start.setPositionInternal(fieldSeparatorPosition);
        this.initHistory('Underline');
        this.updateCharacterFormatWithUpdate(selection, 'underline', 'None', false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        // Applies font color for field result.
        this.initHistory('FontColor');
        this.updateCharacterFormatWithUpdate(selection, 'fontColor', undefined, false);
        if (this.editorHistory) {
            this.editorHistory.updateHistory();
        }
        this.reLayout(selection, false);
        selection.end.setPositionInternal(selection.start);
        selection.start.setPositionInternal(fieldStartPosition);
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
     * @param  {ClipboardEvent} event
     * @param  {any} pasteWindow?
     * @private
     */
    /* tslint:disable:no-any */
    public pasteInternal(event: ClipboardEvent, pasteWindow?: any): void {
        if (this.viewer.owner.enableLocalPaste) {
            this.pasteLocal();
        } else {
            if (isNullOrUndefined(pasteWindow)) {
                pasteWindow = window;
            }
            /* tslint:enable:no-any */
            let textContent: string = '';
            let clipbordData: DataTransfer = pasteWindow.clipboardData ? pasteWindow.clipboardData : event.clipboardData;
            textContent = clipbordData.getData('Text');
            if (textContent !== '') {
                this.pasteContents(textContent);
                this.viewer.editableDiv.innerHTML = '';
            }
        }
        this.viewer.updateFocus();
    }
    /**
     * Pastes the data present in local clipboard if any.
     */
    public pasteLocal(): void {
        /* tslint:disable:no-any */
        if (this.copiedData && this.owner.enableLocalPaste) {
            let document: any = JSON.parse(this.copiedData);
            this.pasteContents(document);
        }
    }
    private getBlocks(pasteContent: any): BlockWidget[] {
        let widgets: BlockWidget[] = [];
        if (typeof (pasteContent) === 'string') {
            let startParagraph: ParagraphWidget = this.selection.start.paragraph;
            if (!this.selection.isForward) {
                startParagraph = this.selection.end.paragraph;
            }
            let arr: string[] = [];
            let txt: string = pasteContent;
            txt = txt.replace(/\r\n/g, '\r');
            arr = txt.split('\r');
            for (let i: number = 0; i < arr.length; i++) {
                let insertFormat: WCharacterFormat = this.copyInsertFormat(startParagraph.characterFormat, false);
                let insertParaFormat: WParagraphFormat = this.viewer.selection.copySelectionParagraphFormat();
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
                widgets.push(paragraph);
            }
        } else {
            for (let i: number = 0; i < pasteContent.sections.length; i++) {
                this.viewer.owner.parser.parseBody(pasteContent.sections[i].blocks, widgets);
            }
        }
        return widgets;

    }
    private pasteContents(content: any): void {
        this.pasteContentsInternal(this.getBlocks(content));
    }
    private pasteContentsInternal(widgets: BlockWidget[]): void {
        /* tslint:enable:no-any */
        let selection: Selection = this.viewer.selection;
        let isRemoved: boolean = true;
        this.initComplexHistory('Paste');
        if (this.viewer.isListTextSelected) {
            let paragraph: ParagraphWidget = selection.start.paragraph;
            if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1) {
                this.onApplyList(undefined);
            }
        }
        this.initHistory('Paste');
        if (!selection.isEmpty || this.viewer.isListTextSelected) {
            isRemoved = this.removeSelectedContentInternal(selection, selection.start, selection.end);
        }
        if (isRemoved) {
            this.pasteContent(widgets);
        } else if (this.editorHistory) {
            this.editorHistory.currentBaseHistoryInfo = undefined;
        }

        if (this.editorHistory && this.editorHistory.currentHistoryInfo) {
            this.editorHistory.updateHistory();
            this.editorHistory.updateComplexHistory();
        } else {
            this.reLayout(selection, selection.isEmpty);
        }
    }
    /* tslint:disable:no-any */
    private pasteContent(widgets: BlockWidget[]): void {
        /* tslint:enable:no-any */
        this.viewer.owner.isShiftingEnabled = true;
        this.updateInsertPosition();
        this.viewer.owner.isLayoutEnabled = true;
        this.viewer.owner.isPastingContent = true;
        this.pasteCopiedData(widgets);
        this.updateEndPosition();
        this.viewer.owner.isPastingContent = false;
        this.viewer.selection.fireSelectionChanged(true);
    }
    private pasteCopiedData(widgets: BlockWidget[]): void {
        for (let j: number = 0; j < widgets.length; j++) {
            let widget: BlockWidget = widgets[j];
            if (widget instanceof ParagraphWidget && widget.childWidgets.length === 0) {
                widget.childWidgets[0] = new LineWidget(widget as ParagraphWidget);
            }
            if (j === widgets.length - 1 && widget instanceof ParagraphWidget) {
                let newParagraph: ParagraphWidget = widget as ParagraphWidget;
                if (newParagraph.childWidgets.length > 0
                    && (newParagraph.childWidgets[0] as LineWidget).children.length > 0) {
                    this.insertElement((newParagraph.childWidgets[0] as LineWidget).children);
                }
            } else if (widget instanceof BlockWidget) {
                let startParagraph: ParagraphWidget = this.selection.start.paragraph;
                if (widget instanceof TableWidget && startParagraph.isInsideTable) {
                    let table: TableWidget = widget as TableWidget;
                    //Handled to resize table based on parent cell width.
                    let clientWidth: number = startParagraph.getContainerWidth();
                    table.fitCellsToClientArea(clientWidth);
                }
                if (widget instanceof TableWidget && startParagraph.isEmpty()
                    && startParagraph.previousWidget instanceof TableWidget) {
                    this.insertTableRows(widget as TableWidget, startParagraph.previousWidget as TableWidget);
                } else {
                    this.insertBlockInternal(widget);
                }
            }
        }
    }
    /**
     * Insert Table on undo
     * @param  {WTable} table
     * @param  {WTable} newTable
     * @param  {boolean} moveRows
     * @private
     */
    public insertTableInternal(table: TableWidget, newTable: TableWidget, moveRows: boolean): void {
        //Gets the index of current table.
        let insertIndex: number = table.getIndex();
        if (moveRows) {
            //Moves the rows to table.
            for (let i: number = 0, index: number = 0; i < table.childWidgets.length; i++ , index++) {
                let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
                newTable.childWidgets.splice(index, 0, row);
                row.containerWidget = newTable;
                table.childWidgets.splice(i, 1);
                i--;
            }
        }
        let owner: Widget = table.containerWidget;
        this.removeBlock(table);
        //Inserts table in the current table position.        
        let blockAdvCollection: IWidget[] = owner.childWidgets;
        blockAdvCollection.splice(insertIndex, 0, newTable);
        newTable.index = table.index;
        table.containerWidget = undefined;
        newTable.containerWidget = owner;
        newTable.isGridUpdated = false;
        newTable.buildTableColumns();
        newTable.isGridUpdated = true;
        this.viewer.layout.clearTableWidget(newTable, true, true);
        this.updateNextBlocksIndex(newTable, true);
        this.viewer.layout.linkFieldInTable(newTable);
        this.viewer.layout.layoutBodyWidgetCollection(newTable.index, owner as Widget, newTable, false);
    }
    /**
     * Insert Table on undo
     * @param  {Selection} selection
     * @param  {WBlock} block
     * @param  {WTable} table
     * @private
     */
    public insertBlockTable(selection: Selection, block: BlockWidget, table: TableWidget): void {
        let offset: number = selection.start.offset;
        let lineIndex: number = selection.start.paragraph.childWidgets.indexOf(selection.start.currentWidget);
        if (block instanceof ParagraphWidget && offset > 0) {
            //Moves the inline items before selection start to the inserted paragraph.
            // tslint:disable-next-line:max-line-length
            this.moveInlines(selection.start.paragraph, block as ParagraphWidget, 0, 0, selection.start.paragraph.firstChild as LineWidget, offset, selection.start.currentWidget);
            selection.selectParagraph(selection.start.paragraph, true);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(this.getHierarchicalIndex((block as ParagraphWidget), offset.toString()), true);
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

        this.viewer.layout.layoutBodyWidgetCollection(block.index, block.containerWidget as Widget, block, false);
        if (this.checkInsertPosition(selection)) {
            let paragraph: BlockWidget = undefined;
            if (block instanceof ParagraphWidget) {
                paragraph = block as ParagraphWidget;
            }
            if (block instanceof TableWidget) {
                paragraph = selection.getFirstParagraphInFirstCell(block as TableWidget);
            }
            this.updateHistoryPosition(this.getHierarchicalIndex(paragraph, '0'), true);
        }
    }
    /**
     * On cut handle selected content remove and relayout
     * @param  {Selection} selection
     * @param  {TextPosition} startPosition
     * @param  {TextPosition} endPosition
     * @private
     */
    public handleCut(selection: Selection): void {
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        // this.owner.isShiftingEnabled = true;
        let blockInfo: ParagraphInfo = this.getParagraphInfo(startPosition);
        selection.editPosition = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
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
    private insertInlineInternal(element: ElementBox): void {
        let selection: Selection = this.selection;
        let length: number = element.length;
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
        if (selection.start.paragraph.isEmpty()) {
            let paragraph: ParagraphWidget = selection.start.paragraph as ParagraphWidget;
            if ((paragraph.paragraphFormat.textAlignment === 'Center' || paragraph.paragraphFormat.textAlignment === 'Right')
                && paragraph.paragraphFormat.listFormat.listId === -1) {
                paragraph.x = this.viewer.clientActiveArea.x;
            }
            (paragraph.childWidgets[0] as LineWidget).children.push(element);
            element.line = (paragraph.childWidgets[0] as LineWidget);
            element.linkFieldCharacter(this.viewer);
            this.viewer.layout.reLayoutParagraph(paragraph, 0, 0);
        } else {
            let indexInInline: number = 0;
            let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset, indexInInline);
            let curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            this.insertElementInternal(curInline, element, indexInInline, true);
        }
        this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);
    }
    private insertElement(element: ElementBox[]): void {
        let selection: Selection = this.selection;
        let length: number = 0;
        let paragraph: ParagraphWidget = undefined;
        let lineIndex: number = -1;
        let lineWidget: LineWidget = undefined;
        let insertIndex: number = 0;
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
        if (selection.start.paragraph.isEmpty()) {
            paragraph = selection.start.paragraph as ParagraphWidget;
            lineWidget = (paragraph.childWidgets[0] as LineWidget);
            lineIndex = 0;
        } else {
            let indexInInline: number = 0;
            let inlineObj: ElementInfo = selection.start.currentWidget.getInline(selection.start.offset, indexInInline);
            let curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            paragraph = curInline.line.paragraph;
            lineIndex = paragraph.childWidgets.indexOf(curInline.line);
            insertIndex = curInline.indexInOwner;
            lineWidget = curInline.line;
            if (indexInInline === curInline.length) { // Add new Element in current 
                insertIndex++;
            } else if (indexInInline === 0) {
                if (isNullOrUndefined(curInline.previousNode)) {
                    insertIndex = 0;
                }
            } else {
                insertIndex++;
                let prevElement: TextElementBox = new TextElementBox();
                prevElement.characterFormat.copyFormat(curInline.characterFormat);
                prevElement.text = (curInline as TextElementBox).text.substring(indexInInline);
                (curInline as TextElementBox).text = (curInline as TextElementBox).text.substr(0, indexInInline);
                lineWidget.children.splice(insertIndex, 0, prevElement);
                prevElement.line = curInline.line;
            }
        }
        for (let i: number = 0; i < element.length; i++) {
            length += element[i].length;
            lineWidget.children.splice(insertIndex, 0, element[i]);
            element[i].line = lineWidget;
            element[i].linkFieldCharacter(this.viewer);
            insertIndex++;
        }
        this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, 0);
        this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);
    }
    private insertElementInternal(element: ElementBox, newElement: ElementBox, index: number, relayout?: boolean): void {
        let line: LineWidget = element.line;
        let paragraph: ParagraphWidget = line.paragraph;
        let lineIndex: number = line.indexInOwner;
        let insertIndex: number = element.indexInOwner;
        if (index === element.length) { // Add new Element in current 
            insertIndex++;
            line.children.splice(insertIndex, 0, newElement);
        } else if (index === 0) {
            if (isNullOrUndefined(element.previousNode)) {
                element.line.children.splice(0, 0, newElement);
                insertIndex = 0;
            } else {
                element.line.children.splice(insertIndex, 0, newElement);
            }
        } else {
            insertIndex++;
            let textElement: TextElementBox = new TextElementBox();
            textElement.characterFormat.copyFormat(element.characterFormat);
            textElement.text = (element as TextElementBox).text.substring(index);
            (element as TextElementBox).text = (element as TextElementBox).text.substr(0, index);
            line.children.splice(insertIndex, 0, textElement);
            textElement.line = element.line;
            //Inserts the new inline.
            line.children.splice(insertIndex, 0, newElement);
            insertIndex -= 1;
        }
        newElement.line = element.line;
        newElement.linkFieldCharacter(this.viewer);
        if (relayout) {
            this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, insertIndex);
        }
    }

    /**
     * Insert Block on undo
     * @param  {Selection} selection
     * @param  {WBlock} block
     * @private
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
            // tslint:disable-next-line:max-line-length
            this.updateHistoryPosition(this.getHierarchicalIndex(paragraph, '0'), true);
        }
        this.fireContentChange();
    }
    /**
     * Insert new Block on specific index
     * @param  {Selection} selection
     * @param  {BlockWidget} block
     * @private
     */
    public insertBlockInternal(block: BlockWidget): void {
        let selection: Selection = this.selection;
        let isRemoved: boolean = true;
        let startPara: ParagraphWidget = this.selection.start.paragraph;
        if (!selection.start.isAtParagraphStart) {
            if (block instanceof ParagraphWidget) {
                this.insertNewParagraphWidget(block as ParagraphWidget, false);
                return;
            }
            this.updateInsertPosition();
            startPara = startPara.combineWidget(this.viewer) as ParagraphWidget;
            // tslint:disable-next-line:max-line-length
            this.splitParagraph(startPara, startPara.firstChild as LineWidget, 0, selection.start.currentWidget, selection.start.offset, false);
            selection.selectParagraph(this.selection.start.paragraph as ParagraphWidget, true);
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
            this.viewer.layout.layoutBodyWidgetCollection(blockIndex, bodyWidget, block, false);
        }
    }
    /**
     * Inserts the image with specified size at cursor position in the document editor.
     * @param {string} imageString  Base64 string, web URL or file URL.
     * @param {number} width? Image width
     * @param {number} height? Image height
     */
    public insertImage(imageString: string, width?: number, height?: number): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        if (isNullOrUndefined(width)) {
            width = 100;
        }
        if (isNullOrUndefined(height)) {
            height = 100;
        }
        this.insertPicture(imageString, width, height);
    }
    /**
     * Inserts a table of specified size at cursor position
     *  in the document editor.
     * @param {number} rows Default value of ‘rows’ parameter is 1.
     * @param {number} columns Default value of ‘columns’ parameter is 1.
     */
    public insertTable(rows?: number, columns?: number): void {
        let startPos: TextPosition = this.selection.start;
        if (this.owner.isReadOnlyMode) {
            return;
        }
        rows = rows || 1;
        columns = columns || 1;
        let table: TableWidget = this.createTable(rows, columns);
        let clientWidth: number = startPos.paragraph.getContainerWidth();
        table.splitWidthToTableCells(clientWidth);
        let prevBlock: Widget = startPos.paragraph.previousWidget;
        if (startPos.currentWidget.isFirstLine() && startPos.offset === 0 && prevBlock instanceof TableWidget) {
            this.insertTableRows(table, prevBlock);
            table.destroy();
            return;
        } else {
            this.initHistory('InsertTable');
            this.viewer.owner.isShiftingEnabled = true;
            this.insertBlock(table);
        }
        let startLine: LineWidget = this.selection.getFirstParagraphInFirstCell(table).childWidgets[0] as LineWidget;
        startPos.setPosition(startLine, true);
        this.selection.end.setPositionInternal(startPos);
        let lastParagraph: ParagraphWidget = this.selection.getLastParagraphInLastCell(table);
        let endOffset: number = lastParagraph.getLength() + 1;
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            // tslint:disable-next-line:max-line-length
            this.editorHistory.currentBaseHistoryInfo.endPosition = this.getHierarchicalIndex(lastParagraph, endOffset.toString());
        }
        this.reLayout(this.selection);
    }
    /**
     * Inserts the specified number of rows to the table above or below to the row at cursor position.
     * @param {boolean} above The above parameter is optional and if omitted, 
     * it takes the value as false and inserts below the row at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     */
    public insertRow(above?: boolean, count?: number): void {
        let rowPlacement: RowPlacement = above ? 'Above' : 'Below';
        if (this.owner.isReadOnlyMode) {
            return;
        }
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        if (startPos.paragraph.isInsideTable) {
            if (this.checkIsNotRedoing()) {
                this.initHistory(rowPlacement === 'Above' ? 'InsertRowAbove' : 'InsertRowBelow');
            }
            this.viewer.owner.isShiftingEnabled = true;
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward).getSplitWidgets()[0] as TableCellWidget;
            let table: TableWidget = startCell.ownerTable.combineWidget(this.viewer) as TableWidget;
            let row: TableRowWidget = rowPlacement === 'Below' ? endCell.ownerRow : startCell.ownerRow;
            if (this.editorHistory) {
                let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
            }
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
            }
            for (let i: number = 0; i < rowCount; i++) {
                let cellCountInfo: CellCountInfo = this.updateRowspan(row, rowPlacement === 'Below' ? endCell : startCell, rowPlacement);
                let newRow: TableRowWidget = this.createRowAndColumn(cellCountInfo.count, i);
                newRow.rowFormat.copyFormat(row.rowFormat);
                this.updateCellFormatForInsertedRow(newRow, cellCountInfo.cellFormats);
                rows.push(newRow);
            }
            table.insertTableRowsInternal(rows, index);
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
            this.viewer.layout.reLayoutTable(table);
            this.selection.selectParagraph(paragraph, true);
        }
        this.reLayout(this.selection, true);
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
        this.initHistory('InsertRowBelow');
        table.containerWidget = prevBlock.containerWidget;
        prevBlock = prevBlock.combineWidget(this.viewer) as TableWidget;
        if (this.editorHistory) {
            let clonedTable: TableWidget = this.cloneTableToHistoryInfo(prevBlock);
        }
        let row: TableRowWidget = prevBlock.childWidgets[prevBlock.childWidgets.length - 1] as TableRowWidget;
        prevBlock.insertTableRowsInternal(table.childWidgets as TableRowWidget[], prevBlock.childWidgets.length);
        let paragraph: ParagraphWidget = this.selection.getFirstParagraph(row.nextWidget.childWidgets[0] as TableCellWidget);
        this.viewer.layout.reLayoutTable(prevBlock);
        this.selection.selectParagraph(paragraph, true);
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo) {
            this.updateHistoryPosition(this.selection.start, true);
            this.updateHistoryPosition(this.selection.end, false);
        }
        this.reLayout(this.selection);
    }
    /**
     * Inserts the specified number of columns to the table left or right to the column at cursor position.
     * @param {number} left The left parameter is optional and if omitted, it takes the value as false and 
     * inserts to the right of column at cursor position.
     * @param {number} count The count parameter is optional and if omitted, it takes the value as 1.
     */
    public insertColumn(left?: boolean, count?: number): void {
        if (this.owner.isReadOnlyMode) {
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
            let table: TableWidget = startCell.ownerRow.ownerTable.combineWidget(this.viewer) as TableWidget;
            if (this.editorHistory) {
                //Clones the entire table to preserve in history.
                let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
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
            let rowSpanCellIndex: number = cellIndex;
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
                                row.childWidgets.splice(rowCell.cellIndex, 0, newCell);
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
                }
            }
            table.updateRowIndex(0);
            let parentTable: TableWidget = this.viewer.layout.getParentTable(table);
            if (parentTable) {
                parentTable.fitChildToClientArea();
            } else {
                table.fitChildToClientArea();
            }
            this.selection.owner.isLayoutEnabled = true;
            table.isGridUpdated = false;
            table.buildTableColumns();
            table.isGridUpdated = true;
            this.viewer.layout.reLayoutTable(table);
            this.selection.start.setPosition(startParagraph.firstChild as LineWidget, true);
            this.selection.end.setPosition(this.selection.getLastParagraph(newCell).firstChild as LineWidget, false);
            if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
                this.reLayout(this.selection);
            }
        }
    }
    /**
     * Creates table with specified rows and columns.
     * @private
     */
    public createTable(rows: number, columns: number): TableWidget {
        let startPara: ParagraphWidget = this.selection.start.paragraph;
        let table: TableWidget = new TableWidget();
        table.tableFormat = new WTableFormat(table);
        table.tableFormat.preferredWidthType = 'Auto';
        table.tableFormat.initializeTableBorders();
        let index: number = 0;
        while (index < rows) {
            let tableRow: TableRowWidget = this.createRowAndColumn(columns, index);
            tableRow.rowFormat.heightType = 'Auto';
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
                // tslint:disable-next-line:max-line-length
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
     * @private
     */
    public mergeSelectedCellsInTable(): void {
        if (!this.canMergeCells()) {
            return;
        }
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
                let table: TableWidget = startOwnerCell.ownerTable.combineWidget(this.viewer) as TableWidget;
                startOwnerCell = this.selection.getSelectedCell(startOwnerCell, containerCell);
                endOwnerCell = this.selection.getSelectedCell(endOwnerCell, containerCell);
                //Merges the selected cells.               
                let mergedCell: TableCellWidget = this.mergeSelectedCells(table, startOwnerCell, endOwnerCell);
                let lastParagraph: ParagraphWidget = this.selection.getLastParagraph(mergedCell);
                endPosition.setPosition(lastParagraph.lastChild as LineWidget, false);
            }
        }
        if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
            this.reLayout(this.selection, false);
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
        for (let i: number = rowStartIndex; i <= count; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let cellStart: number = this.selection.getCellLeft(row, cell);
                if (HelperMethods.round(start, 2) <= HelperMethods.round(cellStart, 2)
                    && HelperMethods.round(cellStart, 2) < HelperMethods.round(end, 2)) {
                    if (isNullOrUndefined(mergedCell)) {
                        mergedCell = cell;
                    } else {
                        if (i === rowStartIndex) {
                            mergedCell.cellFormat.preferredWidth += cell.cellFormat.preferredWidth;
                            mergedCell.cellFormat.columnSpan += cell.cellFormat.columnSpan;
                            this.mergeBorders(mergedCell, cell);
                        }
                        for (let k: number = 0; k < cell.childWidgets.length; k++) {
                            let block: BlockWidget = cell.childWidgets[k] as BlockWidget;
                            if (cell.childWidgets.length === 1 && block instanceof ParagraphWidget
                                && block.childWidgets.length === 0) {
                                break;
                            }
                            mergedCell.childWidgets.push(block.clone());
                        }
                        row.childWidgets.splice(j, 1);
                        cell.destroy();
                        j--;
                    }
                }
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
        this.viewer.layout.reLayoutTable(table);
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
        let cellLeft: number = this.viewer.selection.getCellLeft(cell.ownerRow, cell);
        let prevCellLeft: number = this.viewer.selection.getCellLeft(cell.ownerRow, prevCell);
        let left: number = prevCellLeft + HelperMethods.convertPointToPixel(prevCell.cellFormat.cellWidth);
        if (HelperMethods.round(left, 2) !== HelperMethods.round(cellLeft, 2)) {
            return true;
        }
        return false;
    };
    private checkCellWithInSelection(startLeft: number, endLeft: number, cellStart: number): boolean {
        if (HelperMethods.round(startLeft, 2) <= HelperMethods.round(cellStart, 2)
            && HelperMethods.round(cellStart, 2) < HelperMethods.round(endLeft, 2)) {
            return true;
        }
        return false;
    };
    private checkPrevOrNextCellIsWithinSel(startLeft: number, endLeft: number, cell: TableCellWidget, isPrev: boolean): boolean {
        let prevOrNextCell: TableCellWidget = isPrev ? cell.previousWidget as TableCellWidget : cell.nextWidget as TableCellWidget;
        let cellStart: number = 0;
        if (isNullOrUndefined(prevOrNextCell)) {
            return false;
        }
        cellStart = this.viewer.selection.getCellLeft(prevOrNextCell.ownerRow, prevOrNextCell);
        return this.checkCellWithInSelection(startLeft, endLeft, cellStart);
    }
    // tslint:disable-next-line:max-line-length
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
                this.selection.selectParagraph(nextParagraph, true);
            } else {
                this.selection.selectParagraph(newParagraph, true);
            }
        }
        this.fireContentChange();
    }
    private insertParagraph(newParagraph: ParagraphWidget, insertAfter: boolean): void {
        let lineWidget: LineWidget = this.selection.start.currentWidget;
        let offset: number = this.selection.start.offset;
        let currentParagraph: ParagraphWidget = this.selection.start.paragraph;
        currentParagraph = currentParagraph.combineWidget(this.viewer) as ParagraphWidget;
        if (insertAfter) {
            // tslint:disable-next-line:max-line-length
            let length: number = this.selection.getLineLength(currentParagraph.lastChild as LineWidget);
            let insertIndex: number = newParagraph.firstChild ? (newParagraph.firstChild as LineWidget).children.length : 0;
            // tslint:disable-next-line:max-line-length
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
        this.updateNextBlocksIndex(insertAfter ? currentParagraph : newParagraph, true);
        newParagraph.height = 0;
        this.viewer.layout.layoutBodyWidgetCollection(newParagraph.index, bodyWidget, newParagraph, false);
    }
    // tslint:disable-next-line:max-line-length
    private moveInlines(currentParagraph: ParagraphWidget, newParagraph: ParagraphWidget, insertIndex: number, startOffset: number, startLine: LineWidget, endOffset: number, endLine: LineWidget): void {
        if (newParagraph.childWidgets.length === 0) {
            let line: LineWidget = new LineWidget(newParagraph);
            newParagraph.childWidgets.push(line);
        }
        let isMoved: boolean = false;
        this.viewer.layout.clearListElementBox(currentParagraph);
        this.viewer.layout.clearListElementBox(newParagraph);
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
                // tslint:disable-next-line:max-line-length
                insertIndex = this.moveContent(lineWidget, startOffset, this.viewer.selection.getLineLength(lineWidget), insertIndex, newParagraph);
            } else if (isMoved) {
                insertIndex = this.moveContent(lineWidget, 0, this.viewer.selection.getLineLength(lineWidget), insertIndex, newParagraph);
            }
        }
        this.removeEmptyLine(currentParagraph);
        if (!currentParagraph.isInsideTable) {
            this.viewer.layout.reLayoutParagraph(currentParagraph, 0, 0);
        }
    }
    /**
     * @private
     */
    //tslint:disable-next-line:max-line-length
    public moveContent(lineWidget: LineWidget, startOffset: number, endOffset: number, insertIndex: number, paragraph: ParagraphWidget): number {
        let count: number = 0;
        let lineIndex: number = lineWidget.paragraph.childWidgets.indexOf(lineWidget);
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
                (paragraph.firstChild as LineWidget).children.splice(insertIndex, 0, span);
                span.line = (paragraph.firstChild as LineWidget);
                insertIndex++;
                inline.text = inline.text.slice(0, startIndex) + inline.text.slice(endIndex);
            }
            if (endOffset <= count + endIndex - startIndex) {
                break;
            }
            count += endIndex - startIndex;
        }
        return insertIndex;
    }

    /**
     * update complex changes when history is not preserved
     * @param  {number} action?
     * @param  {string} start?
     * @param  {string} end?
     * @private
     */
    public updateComplexWithoutHistory(action?: number, start?: string, end?: string): void {
        let selection: Selection = this.viewer.selection;
        if (action === 0) {
            let startPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(startPosition, start);
            this.viewer.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
            this.setPositionForCurrentIndex(selection.start, end);
            this.setPositionForCurrentIndex(selection.end, end);
        }
        if (action === 1) {
            let startPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(startPosition, start);
            let endPosition: TextPosition = new TextPosition(selection.owner);
            this.setPositionForCurrentIndex(endPosition, end);
            this.viewer.layout.reLayoutParagraph(startPosition.paragraph, 0, 0);
            if (endPosition.paragraph !== startPosition.paragraph) {
                this.viewer.layout.reLayoutParagraph(endPosition.paragraph, 0, 0);
            }
        }
        if (selection.owner.isShiftingEnabled) {
            this.viewer.layout.shiftLayoutedItems();
            if (this.viewer.owner.enableHeaderAndFooter) {
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
        this.viewer.updateFocus();
        this.viewer.updateScrollBars();
        this.fireContentChange();
        this.isHandledComplex = true;
    }
    /**
     * reLayout 
     * @param selection 
     * @param isSelectionChanged 
     * @private
     */
    public reLayout(selection: Selection, isSelectionChanged?: boolean): void {
        if (!this.viewer.isComposingIME && this.editorHistory && this.editorHistory.isHandledComplexHistory()) {
            if (isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)
                || (this.editorHistory.currentBaseHistoryInfo
                    && !(this.editorHistory.currentBaseHistoryInfo.action === 'ClearCharacterFormat'
                        || this.editorHistory.currentBaseHistoryInfo.action === 'ClearParagraphFormat'))) {
                this.startParagraph = undefined;
                this.endParagraph = undefined;
            }
            this.isHandledComplex = false;
            return;
        }
        if (isNullOrUndefined(this.viewer.blockToShift)) {
            this.viewer.removeEmptyPages();
            this.viewer.layout.updateFieldElements();
            this.viewer.updateScrollBars();
            if (!selection.owner.isShiftingEnabled) {
                selection.fireSelectionChanged(true);
                this.startParagraph = undefined;
                this.endParagraph = undefined;
            }
        }
        if (isNullOrUndefined(isSelectionChanged)) {
            isSelectionChanged = selection.isEmpty;
        }
        if (selection.owner.isShiftingEnabled) {
            selection.owner.isShiftingEnabled = false;
            selection.owner.isLayoutEnabled = true;
            this.viewer.layout.shiftLayoutedItems();
            if (this.viewer.owner.enableHeaderAndFooter) {
                this.updateHeaderFooterWidget();
            }
            this.getOffsetValue(selection);
            selection.upDownSelectionLength = selection.end.location.x;
            selection.fireSelectionChanged(true);
            this.viewer.updateFocus();
            this.startParagraph = undefined;
            this.endParagraph = undefined;
            this.viewer.layout.allowLayout = true;
        }
        if (this.editorHistory && this.editorHistory.currentBaseHistoryInfo &&
            ((this.editorHistory.currentBaseHistoryInfo.action !== 'RowResizing'
                && this.editorHistory.currentBaseHistoryInfo.action !== 'CellResizing')
                || (this.editorHistory.isUndoing || this.editorHistory.isRedoing))) {
            if (this.editorHistory.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                this.editorHistory.currentBaseHistoryInfo.updateSelection();
            }
            this.editorHistory.updateHistory();
        }
        this.fireContentChange();
    }
    /**
     * @private
     */
    public updateHeaderFooterWidget(): void {
        this.updateHeaderFooterWidgetToPage(this.selection.start.paragraph.bodyWidget as HeaderFooterWidget);
        this.shiftPageContent(this.selection.start.paragraph.bodyWidget as HeaderFooterWidget);
    }
    /**
     * @private
     */
    public updateHeaderFooterWidgetToPage(node: HeaderFooterWidget): void {
        let currentPage: Page = node.page;
        node = this.viewer.layout.updateHeaderFooterToParent(node);
        let isEvenPage: boolean = (node.headerFooterType === 'EvenHeader' || node.headerFooterType === 'EvenFooter');
        for (let i: number = 0; i < this.viewer.pages.length; i++) {
            let page: Page = this.viewer.pages[i];
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
                        if (page.bodyWidgets[0].sectionFormat.differentFirstPage && (i + 1 !== 1)) {
                            this.updateHeaderFooterWidgetToPageInternal(page, node, node.headerFooterType.indexOf('Header') !== -1);
                        }
                    }
                } else {
                    this.updateHeaderFooterWidgetToPageInternal(page, node, node.headerFooterType.indexOf('Header') !== -1);
                }
            }
        }
    }
    /**
     * @private
     */
    public updateHeaderFooterWidgetToPageInternal(page: Page, widget: HeaderFooterWidget, isHeader: boolean): void {
        if (widget.page !== page) {
            let hfWidget: HeaderFooterWidget = widget.clone();
            hfWidget.page = page;
            (this.viewer as PageLayoutViewer).updateHFClientArea(hfWidget.sectionFormat, isHeader);
            hfWidget = this.viewer.layout.layoutHeaderFooterItems(this.viewer, hfWidget);
            let headerOrFooter: HeaderFooterWidget;
            if (isHeader) {
                headerOrFooter = page.headerWidget;
                page.headerWidget = hfWidget;
            } else {
                headerOrFooter = page.footerWidget;
                page.footerWidget = hfWidget;
            }
            this.removeFieldInWidget(headerOrFooter);
            headerOrFooter.destroy();
        }
    }
    /**
     * @private
     */
    public removeFieldInWidget(widget: Widget): void {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            this.removeFieldInBlock(widget.childWidgets[i] as BlockWidget);
        }
    }
    /**
     * @private
     */
    public removeFieldInBlock(block: BlockWidget): void {
        if (block instanceof TableWidget) {
            this.removeFieldTable(block);
        } else {
            this.removeField(block as ParagraphWidget);
        }
    }
    /**
     * @private
     */
    public removeFieldTable(table: TableWidget): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.removeFieldInWidget(row.childWidgets[j] as Widget);
            }
        }
    }
    /**
     * @private
     */
    public shiftPageContent(headerFooter: HeaderFooterWidget): void {
        let type: HeaderFooterType = headerFooter.headerFooterType;
        let pageIndex: number;
        if (type === 'FirstPageHeader' || type === 'FirstPageFooter') {
            pageIndex = 0;
        } else if (headerFooter.sectionFormat.differentOddAndEvenPages) {
            if (headerFooter.sectionFormat.differentFirstPage) {
                pageIndex = (type === 'EvenHeader' || type === 'EvenFooter') ? 1 : 2;
            } else {
                pageIndex = (type.indexOf('Even') === -1) ? 0 : 1;
            }
        } else {
            pageIndex = headerFooter.sectionFormat.differentFirstPage ? 1 : 0;
            if (pageIndex === 1 && this.viewer.pages.length === 1) {
                pageIndex = 0;
            }
        }
        let page: Page = this.viewer.pages[pageIndex];
        if (type.indexOf('Header') !== -1) {
            let firstBlock: BlockWidget = (page.bodyWidgets[0].firstChild as BlockWidget);
            let top: number = HelperMethods.convertPointToPixel(headerFooter.sectionFormat.topMargin);
            let headerDistance: number = HelperMethods.convertPointToPixel(headerFooter.sectionFormat.headerDistance);
            top = Math.max(headerDistance + page.headerWidget.height, top);
            if (firstBlock.y !== top) {
                this.viewer.updateClientArea(page.bodyWidgets[0].sectionFormat, page);
                firstBlock = firstBlock.combineWidget(this.viewer) as BlockWidget;
                let prevWidget: BlockWidget = firstBlock.previousRenderedWidget as BlockWidget;
                if (prevWidget) {
                    this.viewer.cutFromTop(prevWidget.y + prevWidget.height);
                    if (firstBlock.containerWidget !== prevWidget.containerWidget) {
                        // tslint:disable-next-line:max-line-length
                        this.viewer.layout.updateContainerWidget(firstBlock as Widget, prevWidget.containerWidget as BodyWidget, prevWidget.indexInOwner + 1, false);
                    }
                }
                this.viewer.blockToShift = firstBlock;
            }
        } else {
            this.checkAndShiftFromBottom(page, headerFooter);
        }
        if (this.viewer.blockToShift) {
            this.viewer.renderedLists.clear();
            this.viewer.layout.shiftLayoutedItems();
        }
    }
    /**
     * @private
     */
    public checkAndShiftFromBottom(page: Page, footerWidget: HeaderFooterWidget): void {
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
        this.viewer.updateClientArea(bodyWidget.sectionFormat, page);
        this.viewer.cutFromTop(blockToShift.y);
        this.viewer.blockToShift = blockToShift;
    }
    //Paste Implementation ends
    //Character Format apply implementation starts

    /**
     * Change HighlightColor
     * @param  {HighlightColor} highlightColor
     * Applies character format for selection.
     * @param {string} property
     * @param {Object} value
     * @param {boolean} update
     * @private
     */
    public onApplyCharacterFormat(property: string, value: Object, update?: boolean): void {
        let selection: Selection = this.viewer.selection;
        if (selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded) {
            return;
        }
        update = isNullOrUndefined(update) ? false : update;
        let action: Action = (property[0].toUpperCase() + property.slice(1)) as Action;
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let lastLine: LineWidget = paragraph.childWidgets[paragraph.childWidgets.length - 1] as LineWidget;
        if (selection.isEmpty && selection.contextType !== 'List') {
            selection.skipFormatRetrieval = true;
            if (selection.end.isAtParagraphEnd) {
                this.initHistory(action);
                this.viewer.owner.isShiftingEnabled = true;
                this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
                this.reLayout(this.viewer.selection);
                this.viewer.updateFocus();
            } else {
                selection.fireSelectionChanged(true);
            }
            selection.skipFormatRetrieval = false;
            return;
        }
        this.setOffsetValue(selection);
        this.initHistory(action);
        // Todo: Complete Microsoft Word behavior on apply formatting in empty selection
        // if (selection.isEmpty) {
        //     this.viewer.owner.isShiftingEnabled = true;
        //     this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
        //     this.reLayout(this.viewer.selection);
        //     this.viewer.updateFocus();
        //     return;
        // }
        if (selection.contextType === 'List') {
            // this.updateCharacterFormatForListText(selection, action, value, update);
            this.applyCharacterFormatForListText(selection, property, value, update);
        } else {
            //Iterate and update format.
            this.updateSelectionCharacterFormatting(property, value, update);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public applyCharacterFormatForListText(selection: Selection, property: string, values: Object, update: boolean): void {
        let listLevel: WListLevel = this.getListLevel(selection.start.paragraph);
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
     */
    public updateListCharacterFormat(selection: Selection, property: string, value: Object): void {
        this.updateListTextSelRange(selection, property, value, false);
    }
    private updateListTextSelRange(selection: Selection, property: string, value: Object, update: boolean): void {
        this.viewer.owner.isShiftingEnabled = true;
        let startPositionInternal: TextPosition = selection.start;
        let endPositionInternal: TextPosition = selection.end;
        if (!selection.isForward) {
            startPositionInternal = selection.end;
            endPositionInternal = selection.start;
        }
        this.initHistoryPosition(selection, startPositionInternal);
        let listLevel: WListLevel = this.getListLevel(selection.start.paragraph);
        this.applyCharFormatValue(listLevel.characterFormat, property, value, update);
        this.startSelectionReLayouting(startPositionInternal.paragraph, selection, startPositionInternal, endPositionInternal);
    }
    /**
     * @private
     */
    public getListLevel(paragraph: ParagraphWidget): WListLevel {
        let currentList: WList = undefined;
        let listLevelNumber: number = 0;
        if (!isNullOrUndefined(paragraph.paragraphFormat) && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
            currentList = this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId);
            listLevelNumber = paragraph.paragraphFormat.listFormat.listLevelNumber;
        }
        if (!isNullOrUndefined(currentList) &&
            !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId))
            // && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId).levels.getItem(listLevelNumber))) {
            && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId).levels)) {
            return this.viewer.layout.getListLevel(currentList, listLevelNumber);
        }
        return undefined;
    }
    private updateInsertPosition(): void {
        let selection: Selection = this.viewer.selection;
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
     * preserve paragraph and offset value for selection
     * @private
     */
    public setOffsetValue(selection: Selection): void {
        let info: ParagraphInfo = this.getParagraphInfo(selection.start);
        this.startParagraph = info.paragraph;
        this.startOffset = info.offset;
        info = this.getParagraphInfo(selection.end);
        this.endParagraph = info.paragraph;
        this.endOffset = info.offset;
    }
    /**
     * Toggles the highlight color property of selected contents.
     * @param {HighlightColor} highlightColor Default value of ‘underline’ parameter is Yellow.
     */
    public toggleHighlightColor(highlightColor?: HighlightColor): void {
        let selection: Selection = this.viewer.selection;
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
     */
    public toggleSubscript(): void {
        if (!this.owner.isReadOnlyMode) {
            let value: BaselineAlignment = this.selection.characterFormat.baselineAlignment === 'Subscript' ? 'Normal' : 'Subscript';
            this.selection.characterFormat.baselineAlignment = value as BaselineAlignment;
        }
    }
    /**
     * Toggles the superscript formatting of selected contents.
     */
    public toggleSuperscript(): void {
        if (!this.owner.isReadOnlyMode) {
            let value: BaselineAlignment = this.selection.characterFormat.baselineAlignment === 'Superscript' ? 'Normal' : 'Superscript';
            this.selection.characterFormat.baselineAlignment = value as BaselineAlignment;
        }
    }
    /**
     * Toggles the text alignment property of selected contents.
     * @param {TextAlignment} textAlignment Default value of ‘textAlignment parameter is TextAlignment.Left.
     */
    /**
     * Increases the left indent of selected paragraphs to a factor of 36 points.
     */
    public increaseIndent(): void {
        if (!this.owner.isReadOnlyMode) {
            this.onApplyParagraphFormat('leftIndent', this.viewer.defaultTabWidth, true, false);
        }
    }
    /**
     * Decreases the left indent of selected paragraphs to a factor of 36 points.
     */
    public decreaseIndent(): void {
        if (!this.owner.isReadOnlyMode) {
            this.onApplyParagraphFormat('leftIndent', -this.viewer.defaultTabWidth, true, false);
        }
    }
    /**
     * Clears the list format for selected paragraphs.
     */
    public clearList(): void {
        this.selection.owner.editorModule.onApplyList(undefined);
    }
    /**
     * Applies the bullet list to selected paragraphs.
     * @param {string} bullet Bullet character
     * @param {string} fontFamily Bullet font family     
     */
    public applyBullet(bullet: string, fontFamily: string): void {
        if (!this.owner.isReadOnlyMode) {
            this.applyBulletOrNumbering(bullet, 'Bullet', fontFamily);
        }
    }
    /**
     * Applies the numbering list to selected paragraphs.
     * @param numberFormat  “%n” representations in ‘numberFormat’ parameter will be replaced by respective list level’s value.
     * `“%1)” will be displayed as “1)” `
     * @param listLevelPattern  Default value of ‘listLevelPattern’ parameter is ListLevelPattern.Arabic
     */
    public applyNumbering(numberFormat: string, listLevelPattern?: ListLevelPattern): void {
        if (!this.owner.isReadOnlyMode) {
            this.applyBulletOrNumbering(numberFormat, listLevelPattern, 'Verdana');
        }
    }
    /**
     * Toggles the baseline alignment property of selected contents.
     * @param  {Selection} selection
     * @param  {BaselineAlignment} baseAlignment
     */
    public toggleBaselineAlignment(baseAlignment: BaselineAlignment): void {
        this.updateProperty(2, baseAlignment);
    }
    /**
     * Clears the formatting.
     */
    public clearFormatting(): void {
        let selection: Selection = this.viewer.selection;
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
    /**
     * Toggles the specified property. If property is assigned already. Then property will be changed
     * @param  {Selection} selection
     * @param  {number} type
     * @param  {Object} value
     * @private
     */
    public updateProperty(type: number, value: Object): void {
        let selection: Selection = this.selection;
        if (selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded) {
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
        for (let name of this.viewer.preDefinedStyles.getItem()) {
            completeStylesString += (this.viewer.preDefinedStyles.get(name) + ',');
        }
        return completeStylesString.slice(0, -1) + ']}';
    }
    /**
     * Initialize default styles
     * @private
     */
    public intializeDefaultStyles(): void {
        let existingStyles: string[] = this.owner.getStyleNames('Paragraph');
        let defaultStyleNames: string[] = ['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6'];
        let styleNames: string[] = defaultStyleNames.filter((val: string) => {
            return existingStyles.indexOf(val) === -1;
        });
        for (let name of styleNames) {
            this.createStyle(this.viewer.preDefinedStyles.get(name));
        }
    }
    /**
     * Creates a new instance of Style.
     */
    public createStyle(styleString: string): void {
        this.createStyleIn(styleString);
    }
    /**
     * Create a Style.
     * @private
     */
    public createStyleIn(styleString: string): Object {
        /* tslint:disable:no-any */
        let style: any = JSON.parse(styleString);
        let styleObj: Object = this.viewer.styles.findByName(style.name);
        if (styleObj !== undefined) {
            //Create a new style with new name and add it to collection.
            style.name = this.getUniqueStyleName(style.name);
        }
        this.viewer.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), style, this.viewer.styles);
        return this.viewer.styles.findByName(style.name);
    }
    /**
     * @private
     */
    public getUniqueStyleName(name: string): string {
        let uniqueName: string = this.getUniqueName(name);
        let style: Object = this.viewer.styles.findByName(uniqueName);
        while (!isNullOrUndefined(style)) {
            uniqueName = this.getUniqueStyleName((style as WStyle).name);
            style = this.viewer.styles.findByName(uniqueName);
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
                this.updateCharacterFormatWithUpdate(this.viewer.selection, 'fontSize', values, update);
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
                this.updateCharacterFormatWithUpdate(this.viewer.selection, 'styleName', values, true);
                break;
            case 'CharacterFormat':
                this.updateCharacterFormat(undefined, values);
                break;
            case 'ClearCharacterFormat':
                this.updateCharacterFormat(undefined, values);
                break;
        }
        this.reLayout(this.viewer.selection);
    }
    /**
     * Update character format for selection range
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @returns void
     * @private
     */
    public updateCharacterFormat(property: string, value: Object): void {
        this.updateCharacterFormatWithUpdate(this.viewer.selection, property, value, false);
    }
    private updateCharacterFormatWithUpdate(selection: Selection, property: string, value: Object, update: boolean): void {
        this.viewer.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        this.applyCharFormatSelectedContent(startPosition.paragraph, selection, startPosition, endPosition, property, value, update);
    }
    // tslint:disable-next-line:max-line-length
    private applyCharFormatSelectedContent(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        //Selection start in cell.
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(start.paragraph.associatedCell, start, end))) {
            let cell: TableCellWidget;
            start.paragraph.associatedCell.ownerTable.combineWidget(this.viewer);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(start, true);
            }
            cell = start.paragraph.associatedCell;
            this.applyCharFormatCell(cell, selection, start, end, property, value, update);
            let table: TableWidget = cell.ownerTable;
            // tslint:disable-next-line:max-line-length
            this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        } else {
            this.applyCharFormat(paragraph, selection, start, end, property, value, update);
        }
    }
    // tslint:disable-next-line:max-line-length
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
    // tslint:disable-next-line:max-line-length
    private getNextParagraphForCharacterFormatting(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let widgetCollection: BlockWidget[] = block.getSplitWidgets() as BlockWidget[];
        block = widgetCollection[widgetCollection.length - 1];
        block = this.viewer.selection.getNextRenderedBlock(block);
        if (!isNullOrUndefined(block)) { //Goto the next block.
            if (block instanceof ParagraphWidget) {
                this.applyCharFormat(block, this.viewer.selection, start, end, property, value, update);
            } else {
                this.applyCharFormatForTable(0, block as TableWidget, this.viewer.selection, start, end, property, value, update);
            }
        }
    }
    // tslint:disable-next-line:max-line-length
    private applyCharFormat(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        paragraph = paragraph.combineWidget(this.viewer) as ParagraphWidget;
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
            this.applyCharFormatValue(paragraph.characterFormat, property, value, update);
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
            for (let j: number = 0; j < line.children.length; j++) {
                let inlineObj: ElementBox = line.children[j] as ElementBox;
                if (inlineObj instanceof ListTextElementBox) {
                    continue;
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
                j += this.applyCharFormatInline(inlineObj, selection, startIndex, endIndex, property, value, update);
                if (endOffset <= count + inlineLength) {
                    break;
                }
                count += inlineLength;
            }
        }
        let endParagraph: ParagraphWidget = end.paragraph;
        this.viewer.layout.reLayoutParagraph(paragraph, startLineWidget, 0);
        if (paragraph.equals(endParagraph)) {
            return;
        }
        this.getNextParagraphForCharacterFormatting(paragraph, start, end, property, value, update);
    }
    /**
     * Toggles the bold property of selected contents.
     */
    public toggleBold(): void {
        if (this.viewer.owner.isReadOnlyMode) {
            return;
        }
        let value: boolean = this.getCurrentSelectionValue('bold');
        this.selection.characterFormat.bold = value;
    }
    /**
     * Toggles the bold property of selected contents.
     */
    public toggleItalic(): void {
        if (this.viewer.owner.isReadOnlyMode) {
            return;
        }
        let value: boolean = this.getCurrentSelectionValue('italic');
        this.selection.characterFormat.italic = value;
    }
    private getCurrentSelectionValue(property: string): boolean {
        let value: boolean = false;
        if ((property === 'bold' || property === 'italic')) {
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
                if (!this.selection.isEmpty && index === inline.length) {
                    characterFormat = isNullOrUndefined(inline.nextNode) ? lineWidget.paragraph.characterFormat
                        : (inline.nextNode as ElementBox).characterFormat;
                } else {
                    characterFormat = inline.characterFormat;
                }
            }
            if (property === 'bold') {
                value = !(characterFormat.bold);
            }
            if (property === 'italic') {
                value = !(characterFormat.italic);
            }
        }
        return value;
    }
    /**
     * Toggles the underline property of selected contents.
     * @param underline Default value of ‘underline’ parameter is Single.
     */
    public toggleUnderline(underline?: Underline): void {
        if (!this.owner.isReadOnlyMode) {
            this.updateProperty(1, underline);
        }
    }
    /**
     * Toggles the strike through property of selected contents.
     * @param {Strikethrough} strikethrough Default value of strikethrough parameter is SingleStrike.
     */
    public toggleStrikethrough(strikethrough?: Strikethrough): void {
        if (!this.owner.isReadOnlyMode) {
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
    // tslint:disable-next-line:max-line-length
    private applyCharFormatInline(inline: ElementBox, selection: Selection, startIndex: number, endIndex: number, property: string, value: Object, update: boolean): number {
        if (startIndex === 0 && endIndex === inline.length) {
            this.applyCharFormatValue(inline.characterFormat, property, value, update);
            return 0;
        } else if (inline instanceof TextElementBox) {
            return this.formatInline(inline, selection, startIndex, endIndex, property, value, update);
        }
        return 0;
    }
    // tslint:disable-next-line:max-line-length
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
            this.applyCharFormatValue(textElement.characterFormat, property, value, update);
            index++;
            node.line.children.splice(index, 0, textElement);
            x++;
            // this.addToLinkedFields(span);                      
        }
        if (endIndex < node.length) {
            textElement = new TextElementBox();
            textElement.characterFormat.copyFormat(inline.characterFormat);
            textElement.text = (node as TextElementBox).text.substring(endIndex);
            textElement.line = inline.line;
            index++;
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
    // tslint:disable-next-line:max-line-length
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
    // tslint:disable-next-line:max-line-length
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
    // tslint:disable-next-line:max-line-length
    private applyCharFormatRow(row: TableRowWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        value = this.getCharacterFormatValueOfCell((row.childWidgets[0] as TableCellWidget), selection, value, property);
        this.applyCharFormatForTable(row.rowIndex, row.ownerTable, selection, start, end, property, value, update);
    }
    // Table
    // tslint:disable-next-line:max-line-length
    private applyCharFormatForTable(index: number, table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        table = table.combineWidget(this.viewer) as TableWidget;
        for (let i: number = index; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyCharFormatForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, value, update);
            }
            if (end.paragraph.isInsideTable && selection.containsRow(row, end.paragraph.associatedCell)) {
                this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
                return;
            }
        }
        this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        this.getNextParagraphForCharacterFormatting(table, start, end, property, value, update);

    }
    // tslint:disable-next-line:max-line-length
    private applyCharFormatForSelTable(tableWidget: TableWidget, selection: Selection, property: string, value: Object, update: boolean): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let row: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyCharFormatForSelectedCell((row.childWidgets[j] as TableCellWidget), selection, property, value, update);
            }
        }
    }
    // tslint:disable-next-line:max-line-length
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
        let selection: Selection = this.viewer.selection;
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
     * @private
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
        }
    }
    /**
     * @private
     */
    public onImageFormat(elementBox: ImageElementBox, width: number, height: number): void {
        let modifiedFormat: ImageFormat = new ImageFormat(elementBox);
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ImageResizing');
            this.editorHistory.currentBaseHistoryInfo.modifiedProperties.push(modifiedFormat);
        }
        this.setOffsetValue(this.selection);
        elementBox.width = width;
        elementBox.height = height;
        // tslint:disable-next-line:max-line-length
        this.viewer.layout.reLayoutParagraph(elementBox.line.paragraph, elementBox.line.indexInOwner, 0);
        this.reLayout(this.selection, false);
        if (this.viewer.owner.imageResizerModule) {
            this.viewer.owner.imageResizerModule.positionImageResizer(elementBox);
        }
    }
    /**
     * Toggles the text alignment of selected paragraphs.
     * @param  {TextAlignment} textAlignment
     */
    public toggleTextAlignment(textAlignment: TextAlignment): void {
        if (this.viewer.owner.isReadOnlyMode || !this.viewer.owner.isDocumentLoaded) {
            return;
        }
        // Toggle performed based on current selection format similar to MS word behavior.
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.viewer.selection.paragraphFormat.textAlignment) && this.viewer.selection.paragraphFormat.textAlignment === textAlignment) {
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
     * Applies paragraph format for the selection ranges.
     * @param {string} property
     * @param {Object} value
     * @param {boolean} update
     * @param {boolean} isSelectionChanged
     * @private
     */
    public onApplyParagraphFormat(property: string, value: Object, update: boolean, isSelectionChanged: boolean): void {
        let action: Action = (property[0].toUpperCase() + property.slice(1)) as Action;
        this.viewer.owner.isShiftingEnabled = true;
        let selection: Selection = this.viewer.selection;
        this.initHistory(action);
        if (this.viewer.owner.isReadOnlyMode || !this.viewer.owner.isDocumentLoaded) {
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
            if (update && property === 'leftIndent') {
                value = this.getIndentIncrementValue(selection.start.paragraph, value as number);
            }
            let para: ParagraphWidget = selection.start.paragraph.combineWidget(this.viewer) as ParagraphWidget;
            this.applyParaFormatProperty(para, property, value, update);
            this.layoutItemBlock(para, false);
        } else {
            //Iterate and update formatting's.      
            this.setOffsetValue(selection);
            this.updateSelectionParagraphFormatting(property, value, update);
        }
        this.reLayout(selection);
    }
    /**
     * Update the list level 
     * @param  {boolean} increaseLevel
     * @private
     */
    public updateListLevel(increaseLevel: boolean): void {
        // Increment or Decrement list level for Multilevel lists.
        let viewer: LayoutViewer = this.viewer;
        let listFormat: WListFormat = this.viewer.selection.start.paragraph.paragraphFormat.listFormat;
        let paragraphFormat: WParagraphFormat = this.viewer.selection.start.paragraph.paragraphFormat;
        let list: WList = viewer.getListById(paragraphFormat.listFormat.listId);
        let listLevel: WListLevel = viewer.layout.getListLevel(list, paragraphFormat.listFormat.listLevelNumber);
        let levelNumber: number;
        if (increaseLevel) {
            levelNumber = paragraphFormat.listFormat.listLevelNumber + 1;
        } else {
            levelNumber = paragraphFormat.listFormat.listLevelNumber - 1;
        }
        let nextListLevel: WListLevel = viewer.layout.getListLevel(list, levelNumber);
        if (!isNullOrUndefined(nextListLevel)) {
            this.onApplyListInternal(list, levelNumber);
            viewer.selection.start.updatePhysicalPosition(true);
            viewer.selection.end.updatePhysicalPosition(true);
            viewer.selection.updateCaretPosition();
        }
    }
    /**
     * Applies list
     * @param  {WList} list
     * @param  {number} listLevelNumber
     * @private
     */
    public onApplyListInternal(list: WList, listLevelNumber: number): void {
        let selection: Selection = this.viewer.selection;
        let listFormat: WListFormat = new WListFormat();
        if (!isNullOrUndefined(list) && listLevelNumber >= 0 && listLevelNumber < 9) {
            listFormat.listId = list.listId;
            listFormat.listLevelNumber = listLevelNumber;
        }
        this.onApplyParagraphFormat('listFormat', listFormat, false, false);
    }
    /**
     * Apply paragraph format to selection range
     * @private
     */
    public updateSelectionParagraphFormatting(property: string, value: Object, update: boolean): void {
        let selection: Selection = this.viewer.selection;
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
        }
    }
    /**
     * Update paragraph format on undo
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @param  {boolean} update
     * @private
     */
    public updateParagraphFormat(property: string, value: Object, update: boolean): void {
        let selection: Selection = this.viewer.selection;
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
        let selection: Selection = this.viewer.selection;
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(start.paragraph.associatedCell, start, end))) {
            let cell: TableCellWidget;
            start.paragraph.associatedCell.ownerTable.combineWidget(this.viewer);
            if (this.checkInsertPosition(selection)) {
                this.updateHistoryPosition(start, true);
            }
            cell = start.paragraph.associatedCell;
            this.applyParaFormatInCell(cell, start, end, property, value, update);
            let table: TableWidget = cell.ownerTable;
            this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        } else {
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(value) && !this.selection.isEmpty && property === 'styleName' && this.applyCharacterStyle(start.paragraph, start, end, property, (value as WStyle), update)) {
                return;
            } else {
                this.applyParaFormat(start.paragraph, start, end, property, value, update);
            }
        }
    }

    /**
     * Apply Paragraph format
     * @private
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
            this.viewer.layout.reLayoutParagraph(format.ownerBase as ParagraphWidget, 0, 0);
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
            this.viewer.layout.allowLayout = false;
        } else if (property === 'styleName') {
            if (typeof (value) === 'string') {
                value = this.viewer.styles.findByName(value);
            }
            format.ApplyStyle(value as WStyle);
        } else if (property === 'listFormat') {
            if (value instanceof WParagraphFormat) {
                this.copyFromListLevelParagraphFormat(format, value);
                value = value.listFormat;
            }
            format.listFormat.copyFormat(<WListFormat>value);
            this.viewer.layout.clearListElementBox(format.ownerBase as ParagraphWidget);
            this.onListFormatChange(format.ownerBase as ParagraphWidget, <WListFormat>value, format);
            this.layoutItemBlock(format.ownerBase as ParagraphWidget, false);
            return;
        }
    }
    private copyParagraphFormat(sourceFormat: WParagraphFormat, destFormat: WParagraphFormat): void {
        destFormat.uniqueParagraphFormat = sourceFormat.uniqueParagraphFormat;
        destFormat.listFormat = sourceFormat.listFormat;
        destFormat.baseStyle = sourceFormat.baseStyle;
    }
    private onListFormatChange(paragraph: ParagraphWidget, listFormat: WListFormat, paraFormat: WParagraphFormat): void {
        if (listFormat instanceof WListFormat) {
            let currentFormat: WListFormat = listFormat;
            // currentFormat.setOwnerBase(paraFormat);
            this.updateListParagraphFormat(paragraph, listFormat);
        }
    }
    private updateListParagraphFormat(paragraph: ParagraphWidget, listFormat: WListFormat): void {
        let list: WList = this.viewer.getListById(listFormat.listId);
        let listlevel: WListLevel = undefined;
        if (!isNullOrUndefined(list)) {
            listlevel = this.viewer.layout.getListLevel(list, listFormat.listLevelNumber);
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
     * @param  {WParagraphFormat} oldFormat
     * @param  {WParagraphFormat} newFormat
     * @private
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
     * @private
     */
    public applyContinueNumbering(selection: Selection): void {
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('ContinueNumbering');
        }
        this.applyContinueNumberingInternal(selection);
    }
    /**
     * @private 
     */
    public applyContinueNumberingInternal(selection: Selection): void {
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let numberingInfo: ContinueNumberingInfo = this.getContinueNumberingInfo(paragraph);
        let paraFormat: WParagraphFormat = this.getParagraphFormat(paragraph, numberingInfo.listLevelNumber, numberingInfo.listPattern);
        this.changeListId(numberingInfo.currentList, paragraph, paraFormat, numberingInfo.listLevelNumber, numberingInfo.listPattern);
        this.reLayout(selection, false);
        this.viewer.updateFocus();
    }
    /**
     * @private 
     */
    public getContinueNumberingInfo(paragraph: ParagraphWidget): ContinueNumberingInfo {
        let currentList: WList = undefined;
        let listLevelNumber: number = 0;
        let listPattern: ListLevelPattern = 'None';
        if (!isNullOrUndefined(paragraph.paragraphFormat)
            && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
            currentList = this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId);
            listLevelNumber = paragraph.paragraphFormat.listFormat.listLevelNumber;
        }
        let viewer: LayoutViewer = this.viewer;
        if (listLevelNumber !== 0 && !isNullOrUndefined(currentList) &&
            !isNullOrUndefined(viewer.getAbstractListById(currentList.abstractListId))
            && !isNullOrUndefined(viewer.getAbstractListById(currentList.abstractListId).levels[listLevelNumber])) {
            let listLevel: WListLevel = this.viewer.layout.getListLevel(currentList, listLevelNumber);
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
                this.viewer.layout.reLayoutParagraph(block, 0, 0);
            }
        }
        return this.changeListId(list, block.nextRenderedWidget as BlockWidget, format, levelNum, listType);
    }
    private getParagraphFormat(paragraph: ParagraphWidget, levelNumber: number, listType: string): WParagraphFormat {
        if (!isNullOrUndefined(paragraph.previousRenderedWidget)) {
            if (paragraph.previousRenderedWidget instanceof ParagraphWidget) {
                if (!isNullOrUndefined(paragraph.previousRenderedWidget.paragraphFormat.listFormat)
                    && paragraph.previousRenderedWidget.paragraphFormat.listFormat.listId !== -1) {
                    let listLevel: WListLevel = this.getListLevel(paragraph.previousRenderedWidget);
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
     */
    public applyRestartNumbering(selection: Selection): void {
        if (this.editorHistory) {
            this.editorHistory.initializeHistory('RestartNumbering');
        }
        this.restartListAt(selection);
    }
    /**
     * @private 
     */
    public restartListAt(selection: Selection): void {
        let currentListLevel: WListLevel = this.getListLevel(selection.start.paragraph);
        let list: WList = new WList();
        list.listId = this.viewer.lists[(this.viewer.lists.length - 1)].listId + 1;
        let abstractList: WAbstractList = new WAbstractList();
        abstractList.abstractListId = this.viewer.abstractLists[(this.viewer.abstractLists.length - 1)].abstractListId + 1;
        list.abstractListId = abstractList.abstractListId;
        list.abstractList = abstractList;
        this.viewer.abstractLists.push(abstractList);
        this.createListLevels(abstractList, currentListLevel, list);
        this.viewer.lists.push(list);
        this.restartListAtInternal(selection, list.listId);
    }
    /**
     * @private 
     */
    public restartListAtInternal(selection: Selection, listId: number): void {
        let numberingInfo: ContinueNumberingInfo = this.getContinueNumberingInfo(selection.start.paragraph);
        this.changeRestartNumbering(numberingInfo.currentList, selection.start.paragraph, listId);
        this.reLayout(selection, false);
        this.incrementListNumber = -1;
        this.refListNumber = undefined;
        this.viewer.updateFocus();
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
                if (this.refListNumber !== block.paragraphFormat.listFormat.listLevelNumber) {
                    this.incrementListNumber += 1;
                    this.refListNumber = block.paragraphFormat.listFormat.listLevelNumber;
                }
                block.paragraphFormat.listFormat.listLevelNumber = this.incrementListNumber;
                this.viewer.layout.reLayoutParagraph(block, 0, 0);
            }
        }
        return this.changeRestartNumbering(list, block.nextRenderedWidget as BlockWidget, listId);
    }
    private createListLevels(abstractList: WAbstractList, currentListLevel: WListLevel, list: WList): void {
        let levelPattern: ListLevelPattern = currentListLevel.listLevelPattern;
        let levelPatterns: ListLevelPattern[] = [];
        let currentAbstractList: WAbstractList = <WAbstractList>currentListLevel.ownerBase;
        for (let i: number = 0; i < 3; i++) {
            let listLevel: WListLevel = currentAbstractList.levels[i];
            if (!isNullOrUndefined(listLevel)) {
                levelPatterns.push(listLevel.listLevelPattern);
            }
        }
        let indexOfLevelPattern: number = levelPatterns.indexOf(levelPattern) === -1 ? 0 : levelPatterns.indexOf(levelPattern);
        let numberFormat: string = currentListLevel.numberFormat.charAt(currentListLevel.numberFormat.length - 1);
        for (let i: number = 0; i < currentAbstractList.levels.length; i++) {
            let listLevel: WListLevel = new WListLevel(abstractList);
            if (i === 0) {
                listLevel.listLevelPattern = levelPattern;
            } else {
                if (indexOfLevelPattern === 0 || indexOfLevelPattern < levelPatterns.length - 1) {
                    indexOfLevelPattern++;
                } else {
                    indexOfLevelPattern = 0;
                }
                listLevel.listLevelPattern = levelPatterns[indexOfLevelPattern];
            }
            listLevel.numberFormat = '%' + (i + 1) + numberFormat;
            listLevel.startAt = 1;
            listLevel.characterFormat.copyFormat(currentListLevel.characterFormat);
            listLevel.paragraphFormat.copyFormat(currentListLevel.paragraphFormat);
            listLevel.restartLevel = i;
            abstractList.levels.push(listLevel);
        }
    }
    // tslint:disable-next-line:max-line-length
    private applyParaFormat(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        this.setOffsetValue(this.selection);
        paragraph = paragraph.combineWidget(this.viewer) as ParagraphWidget;
        //Apply Paragraph Format for spitted paragraph
        this.applyParaFormatProperty(paragraph, property, value, update);
        this.layoutItemBlock(paragraph, false);
        this.getOffsetValue(this.selection);
        if (paragraph.equals(end.paragraph)) {
            return;
        }
        this.getNextParagraphForFormatting(paragraph, start, end, property, value, update);
    }
    /* tslint:disable-next-line:max-line-length */
    private applyCharacterStyle(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition, property: string, value: WStyle, update: boolean): boolean {
        let paragraphWidget: BlockWidget[] = paragraph.getSplitWidgets() as BlockWidget[];
        if ((end.paragraph === paragraph || paragraphWidget.indexOf(end.paragraph) !== -1)) {
            if (((value.type === 'Paragraph') && ((value.link) instanceof WCharacterStyle)) || (value.type === 'Character')) {
                let obj: WStyle = (value.type === 'Character') ? value : value.link;
                this.updateSelectionCharacterFormatting(property, obj, update);
                return true;
            }
        }
        return false;
    }
    // Cell
    // tslint:disable-next-line:max-line-length
    private applyParaFormatInCell(cell: TableCellWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let selection: Selection = this.viewer.selection;
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
            let firstPara: ParagraphWidget = this.viewer.selection.getFirstParagraph(cell);
            value = !<boolean>firstPara.paragraphFormat.getPropertyValue(property);
        }
        return value;
    }
    // Row
    // tslint:disable-next-line:max-line-length
    private applyParagraphFormatRow(wRow: TableRowWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        value = this.getParaFormatValueInCell((wRow.childWidgets[0] as TableCellWidget), property, value);
        for (let i: number = wRow.rowIndex; i < wRow.ownerTable.childWidgets.length; i++) {
            let row: TableRowWidget = wRow.ownerTable.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.applyParaFormatCellInternal((row.childWidgets[j] as TableCellWidget), property, value, update);
            }
            if (end.paragraph.isInsideTable && this.viewer.selection.containsRow(row, end.paragraph.associatedCell)) {
                return;
            }
        }
        this.getNextParagraphForFormatting(wRow.ownerTable, start, end, property, value, update);
    }
    // Table
    // tslint:disable-next-line:max-line-length
    private applyParaFormatTableCell(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget, property: string, value: Object, update: boolean): void {
        let selection: Selection = this.viewer.selection;
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
    // tslint:disable-next-line:max-line-length
    private applyParaFormatTable(table: TableWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        table = table.combineWidget(this.viewer) as TableWidget;
        let selection: Selection = this.viewer.selection;
        for (let m: number = 0; m < table.childWidgets.length; m++) {
            let tableRow: TableRowWidget = table.childWidgets[m] as TableRowWidget;
            for (let k: number = 0; k < tableRow.childWidgets.length; k++) {
                this.applyParaFormatCellInternal((tableRow.childWidgets[k] as TableCellWidget), property, value, update);
            }
            if (end.paragraph.isInsideTable && selection.containsRow(tableRow, end.paragraph.associatedCell)) {
                this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
                return;
            }
        }
        this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget, table, false);
        this.getNextParagraphForFormatting(table, start, end, property, value, update);
    }
    // tslint:disable-next-line:max-line-length
    private getNextParagraphForFormatting(block: BlockWidget, start: TextPosition, end: TextPosition, property: string, value: Object, update: boolean): void {
        let widgetCollection: TableWidget[] = block.getSplitWidgets() as TableWidget[];
        block = widgetCollection[widgetCollection.length - 1];
        block = this.viewer.selection.getNextRenderedBlock(block);
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
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public onApplySectionFormat(property: string, value: Object): void {
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
     * @param  {string} property
     * @param  {Object} value
     * @returns TextPosition
     * @private
     */
    public updateSectionFormat(property: string, value: Object): void {
        let selection: Selection = this.viewer.selection;
        selection.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = selection.start;
        let endPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            startPosition = selection.end;
            endPosition = selection.start;
        }
        let startPageIndex: number;
        let endPageIndex: number;
        this.viewer.clearContent();
        let startSectionIndex: number = (startPosition.paragraph.containerWidget as BodyWidget).index;
        let endSectionIndex: number = (endPosition.paragraph.containerWidget as BodyWidget).index;
        for (let i: number = 0; i < this.viewer.pages.length; i++) {
            if (this.viewer.pages[i].bodyWidgets[0].index === startSectionIndex) {
                startPageIndex = i;
                break;
            }
        }
        for (let i: number = startPageIndex; i < this.viewer.pages.length; i++) {
            let bodyWidget: BodyWidget = this.viewer.pages[i].bodyWidgets[0];
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
        // let startPageIndex: number = this.viewer.pages.indexOf((selection.start.paragraph.containerWidget as BodyWidget).page);
        // let endPageIndex: number = this.viewer.pages.indexOf((selection.end.paragraph.containerWidget as BodyWidget).page);
        let update: boolean = true;
        let index: number = 0;
        for (let i: number = startPageIndex; i <= endPageIndex; i++) {
            if (index !== this.viewer.pages[i].bodyWidgets[0].index && !update) {
                update = true;
            }
            this.applyPropertyValueForSection(this.viewer.pages[i].bodyWidgets[0].sectionFormat, property, value, update);
            index = this.viewer.pages[i].bodyWidgets[0].index;
            update = false;
        }
        this.layoutWholeDocument();
        this.fireContentChange();
    }
    //Apply Selection Table Format option implementation starts
    /**
     * Apply table format property changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public onApplyTableFormat(property: string, value: Object): void {
        let action: Action = this.getTableFormatAction(property);
        this.viewer.owner.isShiftingEnabled = true;
        let selection: Selection = this.viewer.selection;
        let table: TableWidget = selection.start.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.viewer) as TableWidget;
        if (selection.isEmpty) {
            this.initHistory(action);
            this.applyTablePropertyValue(selection, property, value, table);
        } else {
            this.updateSelectionTableFormat(this.selection, action, value);
        }
        table.calculateGrid();
        this.selection.owner.isLayoutEnabled = true;
        this.viewer.layout.reLayoutTable(table);
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
            default:
                return 'DefaultCellSpacing';
        }
    }
    // Apply Selection Row Format Option Implementation Starts
    /**
     * Apply table row format property changes
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public onApplyTableRowFormat(property: string, value: Object): void {
        let action: Action = this.getRowAction(property);
        this.viewer.owner.isShiftingEnabled = true;
        let selection: Selection = this.viewer.selection;
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
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public onApplyTableCellFormat(property: string, value: Object): void {
        let action: Action = this.getTableCellAction(property);
        this.viewer.owner.isShiftingEnabled = true;
        let selection: Selection = this.viewer.selection;
        let table: TableWidget = selection.start.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.viewer) as TableWidget;
        if (selection.isEmpty) {
            this.initHistory(action);
            this.applyCellPropertyValue(selection, property, value, selection.start.paragraph.associatedCell.cellFormat);
            table.calculateGrid();
            this.selection.owner.isLayoutEnabled = true;
            this.viewer.layout.reLayoutTable(table);
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
        let selection: Selection = this.viewer.selection;
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
        }
    }
    /**
     * @private
     */
    public layoutWholeDocument(): void {
        let startPosition: TextPosition = this.viewer.selection.start;
        let endPosition: TextPosition = this.viewer.selection.end;
        if (startPosition.isExistAfter(endPosition)) {
            startPosition = this.viewer.selection.end;
            endPosition = this.viewer.selection.start;
        }
        let startInfo: ParagraphInfo = this.getParagraphInfo(startPosition);
        let endInfo: ParagraphInfo = this.getParagraphInfo(startPosition);
        let startIndex: string = this.getHierarchicalIndex(startInfo.paragraph, startInfo.offset.toString());
        let endIndex: string = this.getHierarchicalIndex(endInfo.paragraph, endInfo.offset.toString());
        this.viewer.renderedLists.clear();
        // this.viewer.owner.isLayoutEnabled = true;
        let sections: BodyWidget[] = this.combineSection();
        this.viewer.clearContent();
        this.viewer.layout.layoutItems(sections);
        this.viewer.owner.isShiftingEnabled = false;
        this.setPositionForCurrentIndex(startPosition, startIndex);
        this.setPositionForCurrentIndex(endPosition, endIndex);
        this.viewer.selection.selectPosition(startPosition, endPosition);
        this.reLayout(this.viewer.selection);
    }
    private combineSection(): BodyWidget[] {
        let sections: BodyWidget[] = [];
        let nextSection: BodyWidget = this.viewer.pages[0].bodyWidgets[0];
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
                (bodyWidget.lastChild as BlockWidget).combineWidget(this.viewer);
            }
            bodyWidget = bodyWidget.nextRenderedWidget as BodyWidget;
            for (let j: number = 0; j < previousBodyWidget.childWidgets.length; j++) {
                let block: BlockWidget = previousBodyWidget.childWidgets[j] as BlockWidget;
                if (block instanceof TableWidget) {
                    this.viewer.layout.clearTableWidget(block, true, true);
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
            // this.viewer.pages.splice(previousBodyWidget.page.index, 1);
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
        }
    }
    // Update Table Properties
    /**
     * Update Table Format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {object} value
     * @private
     */
    public updateTableFormat(selection: Selection, property: string, value: object): void {
        let tableStartPosition: TextPosition = selection.start;
        let tableEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            tableStartPosition = selection.end;
            tableEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, tableStartPosition);
        // tslint:disable-next-line:max-line-length
        this.applyTablePropertyValue(selection, property, value, tableStartPosition.paragraph.associatedCell.ownerTable);
    }
    /**
     * update cell format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @private
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
     * update row format on undo
     * @param  {Selection} selection
     * @param  {SelectionRange} selectionRange
     * @param  {string} property
     * @param  {Object} value
     * @private
     */
    public updateRowFormat(selection: Selection, property: string, value: Object): void {
        let rowStartPosition: TextPosition = selection.start;
        let rowEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            rowStartPosition = selection.end;
            rowEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, rowStartPosition);
        // tslint:disable-next-line:max-line-length
        this.applyRowFormat(rowStartPosition.paragraph.associatedCell.ownerRow, rowStartPosition, rowEndPosition, property, value);
    }
    private initHistoryPosition(selection: Selection, position?: TextPosition): void {
        if (this.viewer.owner.editorHistoryModule && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
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
        this.viewer.layout.layoutBodyWidgetCollection(table.index, table.containerWidget as BodyWidget, table, false);
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
                this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, index - 1);
            } else {
                this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, index);
            }
        } else {
            this.viewer.layout.reLayoutParagraph(paragraph, 0, 0);
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
     */
    public layoutItemBlock(block: BlockWidget, shiftNextWidget: boolean): void {
        let section: Widget = undefined;
        if (block.containerWidget instanceof BlockContainer) {
            section = block.containerWidget as BlockContainer;
            let index: number = section.childWidgets.indexOf(block);
            if (!isNullOrUndefined(this.viewer.owner)
                && this.viewer.owner.isLayoutEnabled) {
                // tslint:disable-next-line:max-line-length
                this.viewer.layout.layoutBodyWidgetCollection(block.index, section as BodyWidget, block, false);
            }
        } else if (block.containerWidget instanceof TableCellWidget) {
            let cell: TableCellWidget = block.containerWidget as TableCellWidget;
            cell = this.viewer.selection.getContainerCell(cell);
            if (!isNullOrUndefined(this.viewer.owner)
                && this.viewer.owner.isLayoutEnabled) {
                this.viewer.layout.reLayoutTable(block);
            }
        }
    }
    /**
     * @private
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
        // tslint:disable-next-line:max-line-length
        if (startPos.paragraph === endPos.paragraph && startPos.paragraph.childWidgets.indexOf(startPos.currentWidget) === startPos.paragraph.childWidgets.length - 1 &&
            startPos.offset === selection.getParagraphLength(startPos.paragraph) && startPos.offset + 1 === endPos.offset) {
            selection.owner.isShiftingEnabled = true;
            selection.selectContent(startPos, true);
            return true;
        }
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(startPos);
        selection.editPosition = this.getHierarchicalIndex(paragraphInfo.paragraph, paragraphInfo.offset.toString());
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
            && (!start.paragraph.isInsideTable || start.paragraph.associatedCell.ownerTable !== end.paragraph.associatedCell.ownerTable)) {
            return false;
        }
        selection.owner.isShiftingEnabled = true;
        this.deleteSelectedContent(paragraph, selection, start, end, 2);
        return true;
    }
    // tslint:disable-next-line:max-line-length
    private deleteSelectedContent(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = start.currentWidget.getInline(start.offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        // if (!isNullOrUndefined(inline)) {
        //     inline = selection.getNextRenderedInline(inline, indexInInline);
        // }
        // if (inline instanceof WFieldBegin && !isNullOrUndefined((inline as WFieldBegin).fieldEnd)) {
        // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
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
        if (end.paragraph !== paragraph) {
            this.deleteSelectedContent(end.paragraph, selection, start, end, editAction);
            return;
        }
        //  Selection start in cell.
        if (end.paragraph.isInsideTable && (!start.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || selection.isCellSelected(end.paragraph.associatedCell, start, end))) {
            end.paragraph.associatedCell.ownerTable.combineWidget(this.viewer);
            this.deleteTableCell(end.paragraph.associatedCell, selection, start, end, editAction);
        } else {
            this.deletePara(paragraph, start, end, editAction);
        }
    }
    /**
     * Merge the selected cells.
     */
    public mergeCells(): void {
        if (this.owner.isReadOnlyMode || !this.owner.isDocumentLoaded) {
            return;
        }
        if (!isNullOrUndefined(this.viewer) && !this.selection.isEmpty) {
            this.mergeSelectedCellsInTable();
        }
    }
    /**
     * Deletes the entire table at selection.
     */
    public deleteTable(): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        if (startPos.paragraph.isInsideTable) {
            let table: TableWidget = this.getOwnerTable(this.selection.isForward).combineWidget(this.viewer) as TableWidget;
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
            this.removeBlock(table);
            this.selection.selectParagraph(paragraph, true);
            if (this.checkIsNotRedoing() || isNullOrUndefined(this.editorHistory)) {
                this.reLayout(this.selection);
            }
        }
    }
    /**
     * Deletes the selected column(s).
     */
    public deleteColumn(): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        if (startPos.paragraph.isInsideTable) {
            this.selection.owner.isShiftingEnabled = true;
            if (this.checkIsNotRedoing()) {
                this.initHistory('DeleteColumn');
            }
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            let table: TableWidget = startCell.ownerTable.combineWidget(this.viewer) as TableWidget;
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
                this.viewer.layout.reLayoutTable(table);
            }
            this.selection.selectParagraph(paragraph, true);
            if (isNullOrUndefined(this.editorHistory) || this.checkIsNotRedoing()) {
                this.reLayout(this.selection, true);
            }
        }
    }
    /**
     * Deletes the selected row(s).
     */
    public deleteRow(): void {
        if (this.owner.isReadOnlyMode) {
            return;
        }
        let startPos: TextPosition = !this.selection.isForward ? this.selection.end : this.selection.start;
        let endPos: TextPosition = !this.selection.isForward ? this.selection.start : this.selection.end;
        if (startPos.paragraph.isInsideTable) {
            let startCell: TableCellWidget = this.getOwnerCell(this.selection.isForward);
            let endCell: TableCellWidget = this.getOwnerCell(!this.selection.isForward);
            if (this.checkIsNotRedoing()) {
                this.initHistory('DeleteRow');
            }
            this.selection.owner.isShiftingEnabled = true;
            let table: TableWidget = startCell.ownerTable.combineWidget(this.viewer) as TableWidget;
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
            if (!this.selection.isEmpty) {
                //tslint:disable-next-line:max-line-length
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
                                table.childWidgets.splice(i, 1);
                                tableRow.destroy();
                                i--;
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
                this.removeRow(row);
            }
            this.selection.selectParagraph(paragraph, true);
            if (isNullOrUndefined(this.editorHistory) || this.checkIsNotRedoing()) {
                this.reLayout(this.selection, true);
            }
        }
    }
    private removeRow(row: TableRowWidget): void {
        let table: TableWidget = row.ownerTable;
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
    private updateTable(table: TableWidget): void {
        table.updateRowIndex(0);
        table.isGridUpdated = false;
        table.buildTableColumns();
        table.isGridUpdated = true;
        this.viewer.layout.reLayoutTable(table);
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
        paragraph = paragraph.combineWidget(this.viewer) as ParagraphWidget;
        let selection: Selection = this.viewer.selection;
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
            endOffset = this.viewer.selection.getLineLength(paragraph.lastChild as LineWidget);
        }
        let block: BlockWidget = paragraph.previousRenderedWidget as BlockWidget;
        if (startOffset > paragraphStart && start.currentWidget === paragraph.lastChild &&
            startOffset === lastLinelength && (paragraph === end.paragraph && end.offset === startOffset + 1 ||
                paragraph.nextRenderedWidget === end.paragraph && end.offset === endParagraphStartOffset) ||
            (this.editorHistory && this.editorHistory.isUndoing && this.editorHistory.currentHistoryInfo &&
                this.editorHistory.currentHistoryInfo.action === 'PageBreak' && block && block.isPageBreak()
                && (startOffset === 0 && !start.currentWidget.isFirstLine || startOffset > 0))) {
            isCombineNextParagraph = true;
        }

        if (end.paragraph === paragraph && end.currentWidget !== paragraph.lastChild ||
            (end.currentWidget === paragraph.lastChild && end.offset <= selection.getLineLength(paragraph.lastChild as LineWidget))) {
            let isStartParagraph: boolean = start.paragraph === paragraph;
            if (end.currentWidget.isFirstLine() && end.offset > paragraphStart || !end.currentWidget.isFirstLine()) {
                //If selection end with this paragraph and selection doesnot include paragraph mark.               
                this.removeInlines(paragraph, startLine, startOffset, endLineWidget, endOffset, editAction);
                //Removes the splitted paragraph.
            }
            if (!isNullOrUndefined(block) && !isStartParagraph) {
                let nextSection: BodyWidget = block.bodyWidget instanceof BodyWidget ? block.bodyWidget : undefined;
                if (nextSection && !section.equals(nextSection) && section.index !== nextSection.index) {
                    this.deleteSection(selection, nextSection, section, editAction);
                }
                this.deleteBlock(block, selection, start, end, editAction);
            }
        } else if (start.paragraph === paragraph && (start.currentWidget !== paragraph.firstChild ||
            (start.currentWidget === paragraph.firstChild && startOffset > paragraphStart))) {
            // If selection start is after paragraph start
            //And selection does not end with this paragraph Or selection include paragraph mark.
            if (editAction === 4) {
                return;
            } else {
                currentParagraph = this.splitParagraph(paragraph, paragraph.firstChild as LineWidget, 0, startLine, startOffset, true);
                this.insertParagraphPaste(paragraph, currentParagraph, start, end, isCombineNextParagraph, editAction);
                this.addRemovedNodes(paragraph);
                return;
            }
        } else {
            let newParagraph: ParagraphWidget = undefined;
            let previousBlock: BlockWidget = paragraph.previousWidget as BlockWidget;
            let prevParagraph: ParagraphWidget = (previousBlock instanceof ParagraphWidget) ? previousBlock : undefined;
            let nextWidget: BlockWidget = paragraph.nextRenderedWidget as BlockWidget;
            if (editAction < 4) {
                //Checks whether this is last paragraph of owner text body and previousBlock is not paragraph.
                newParagraph = this.checkAndInsertBlock(paragraph, start, end, editAction, prevParagraph);
                this.removeBlock(paragraph);
                if (this.viewer.blockToShift === paragraph) {
                    this.viewer.blockToShift = undefined;
                }
                this.addRemovedNodes(paragraph);
                if (!isNullOrUndefined(newParagraph)) {
                    selection.editPosition = this.getHierarchicalIndex(newParagraph, '0');
                    let offset: number = selection.getParagraphLength(newParagraph) + 1;
                    if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                        //tslint:disable-next-line:max-line-length
                        this.editorHistory.currentBaseHistoryInfo.endPosition = this.getHierarchicalIndex(newParagraph, offset.toString());
                    }
                } else if (paragraph === start.paragraph && isNullOrUndefined(nextWidget) && !isNullOrUndefined(prevParagraph)) {
                    let offset: number = this.selection.getParagraphLength(prevParagraph);
                    // if (isNullOrUndefined(block)) {
                    selection.editPosition = this.getHierarchicalIndex(prevParagraph, offset.toString());
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
                let nextSection: BodyWidget = block.bodyWidget instanceof BodyWidget ? block.bodyWidget : undefined;
                // if (section !== nextSection) {
                //     this.deleteSection(selection, section, nextSection, editAction);
                // }
                this.deleteBlock(block, selection, start, end, editAction);
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
            this.viewer.layout.layoutBodyWidgetCollection(block.index, block.bodyWidget, block, false);
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
    //tslint:disable:max-line-length
    /**
     * @private
     */
    public checkAndInsertBlock(block: BlockWidget, start: TextPosition, end: TextPosition, editAction: number, previousParagraph: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget && block === start.paragraph || block instanceof TableWidget) {
            let newParagraph: ParagraphWidget; //Adds an empty paragraph, to ensure minimal content.
            if (isNullOrUndefined(block.nextWidget) && (isNullOrUndefined(previousParagraph) || previousParagraph.nextRenderedWidget instanceof TableWidget)) {
                newParagraph = new ParagraphWidget();
                if (editAction === 1 && block instanceof ParagraphWidget) {
                    newParagraph.characterFormat.copyFormat(block.characterFormat);
                    newParagraph.paragraphFormat.copyFormat(block.paragraphFormat);
                }
                newParagraph.index = block.index + 1;
                newParagraph.containerWidget = block.containerWidget;
                this.viewer.layout.layoutBodyWidgetCollection(newParagraph.index, newParagraph.bodyWidget, newParagraph, false);
                if (block.containerWidget instanceof Widget) {
                    block.containerWidget.childWidgets.push(newParagraph);
                }
            }
            return newParagraph;
        }
        return undefined;
    }
    // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
        this.viewer.layout.layoutBodyWidgetCollection(blockIndex, paragraph.containerWidget as BodyWidget, paragraph, false);
        return paragraph;
    }
    /**
     * @private
     */
    public removeBlock(block: BlockWidget): void {
        let index: number;
        let blockCollection: IWidget[];
        let containerWidget: Widget;
        this.removeFieldInBlock(block);
        if (block.isInsideTable) {
            containerWidget = block.associatedCell;
            index = block.associatedCell.childWidgets.indexOf(block);
            blockCollection = block.associatedCell.childWidgets;
            this.updateNextBlocksIndex(block, false);
            block.associatedCell.childWidgets.splice(index, 1);
            block.containerWidget = undefined;
            this.viewer.layout.layoutBodyWidgetCollection(block.index, containerWidget, block, false);
        } else {
            containerWidget = block.containerWidget;
            index = containerWidget.childWidgets.indexOf(block);
            blockCollection = containerWidget.childWidgets;
            this.updateNextBlocksIndex(block, false);
            containerWidget.childWidgets.splice(index, 1);
            block.containerWidget = undefined;
            containerWidget.height -= block.height;
            this.viewer.layout.layoutBodyWidgetCollection(block.index, containerWidget, block, false);
        }
    }
    private removeField(block: BlockWidget): void {
        for (let i: number = 0; i < this.viewer.fields.length; i++) {
            let field: FieldElementBox = this.viewer.fields[i];
            if (field.line.paragraph === block) {
                this.viewer.fields.splice(i, 1);
                i--;
            }
        }
    }
    private addRemovedNodes(node: IWidget): void {
        if (node instanceof FieldElementBox && node.fieldType === 0) {
            if (this.viewer.fields.indexOf(node) !== -1) {
                this.viewer.fields.splice(this.viewer.fields.indexOf(node), 1);
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
        } else {
            this.deleteTableBlock(block as TableWidget, selection, start, end, editAction);
        }
    }
    // tslint:disable-next-line:max-line-length
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
                            }
                        }
                    } else {
                        if (startCell === containerCell) {
                            this.deletePara(end.paragraph, start, end, editAction);
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
    // tslint:disable-next-line:max-line-length
    private deleteCellsInTable(table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let clonedTable: TableWidget = undefined;
        let isDeleteCells: boolean = false;
        let action: Action = 'Delete';
        let startCell: TableCellWidget = start.paragraph.associatedCell;
        let endCell: TableCellWidget = end.paragraph.associatedCell;
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            action = this.editorHistory.currentBaseHistoryInfo.action;
            //tslint:disable-next-line:max-line-length
            isDeleteCells = this.editorHistory.currentBaseHistoryInfo.action === 'BackSpace' || this.editorHistory.currentBaseHistoryInfo.action === 'DeleteCells'
                || this.editorHistory.currentBaseHistoryInfo.action === 'InsertTable' || (isNullOrUndefined(startCell.ownerRow.previousWidget)
                    && isNullOrUndefined(endCell.ownerRow.nextWidget) && this.editorHistory.currentBaseHistoryInfo.action === 'Cut');
            this.editorHistory.currentBaseHistoryInfo.action = isDeleteCells ? 'DeleteCells' : 'ClearCells';
            clonedTable = this.cloneTableToHistoryInfo(table);
            selection.owner.isLayoutEnabled = false;
        }
        let startColumnIndex: number = startCell.columnIndex;
        let endColumnIndex: number = endCell.columnIndex + endCell.cellFormat.columnSpan - 1;
        let startRowIndex: number = startCell.rowIndex;
        let endRowIndex: number = endCell.rowIndex;
        let cells: TableCellWidget[] = [];
        let isStarted: boolean = false;
        let isCellCleared: boolean = false;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.index >= startRowIndex && row.index <= endRowIndex) {
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
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
                if (row.childWidgets.length === 0) {
                    this.updateNextBlocksIndex(table.childWidgets[i] as TableRowWidget, false);
                    table.childWidgets.splice(i, 1);
                    i--;
                    endRowIndex--;
                }
            }
        }
        //Layouts the table after delete cells.
        selection.owner.isLayoutEnabled = true;
        if (table.childWidgets.length === 0) {
            selection.editPosition = this.getHierarchicalIndex(table, '0');
            this.setActionInternal(selection, action);
            this.removeBlock(table);
        } else {
            // Before lay outing need to update table grid.
            table.isGridUpdated = false;
            table.buildTableColumns();
            table.isGridUpdated = true;
            this.viewer.layout.reLayoutTable(table);
        }
    }
    private deleteCell(cell: TableCellWidget, selection: Selection, editAction: number, copyChildToClipboard: boolean): boolean {
        //Checks whether this is last paragraph of owner textbody.
        let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
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
                        selection.editPosition = this.getHierarchicalIndex(paragraph, '0');
                        this.updateHistoryPosition(selection.editPosition, true);
                    }
                    break;
                }
                this.removeBlock(block);
                i--;
                if (this.checkClearCells(selection)) {
                    this.addRemovedNodes(block);
                }
            }
        }
        return true;
    }
    private deleteContainer(cell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        let ownerTable: TableWidget = cell.ownerTable;
        if (selection.containsRow(ownerTable.lastChild as TableRowWidget, end.paragraph.associatedCell)) {
            this.deleteContent(ownerTable, selection, editAction);
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
                    this.viewer.layout.reLayoutTable(ownerTable);
                    return;
                }
            }
        }
    }
    private deleteTableBlock(table: TableWidget, selection: Selection, start: TextPosition, end: TextPosition, editAction: number): void {
        table = table.combineWidget(this.viewer) as TableWidget;
        if (start.paragraph.isInsideTable && table.contains(start.paragraph.associatedCell)) {
            let block: BlockWidget = table.previousRenderedWidget as BlockWidget;
            // tslint:disable-next-line:max-line-length
            let previousBlock: ParagraphWidget = this.checkAndInsertBlock(table, start, end, editAction, block instanceof ParagraphWidget ? block : undefined);
            if (selection.containsRow((table.firstChild as TableRowWidget), start.paragraph.associatedCell)) {
                this.deleteContent(table, selection, editAction);
            } else {
                let newTable: TableWidget = this.splitTable(table, start.paragraph.associatedCell.ownerRow);
                this.deleteContent(table, selection, editAction);
                this.viewer.layout.layoutBodyWidgetCollection(newTable.index, newTable.containerWidget, newTable, false);
            }
            if (!isNullOrUndefined(previousBlock)) {
                selection.editPosition = this.getHierarchicalIndex(previousBlock, '0');
                if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                    this.editorHistory.currentBaseHistoryInfo.endPosition = selection.editPosition;
                }
            }
        } else {
            let blockAdv: BlockWidget = table.previousRenderedWidget as BlockWidget;
            let sectionAdv: BodyWidget = table.bodyWidget instanceof BodyWidget ? table.bodyWidget : undefined;
            this.deleteContent(table, selection, editAction);
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
        selection.editPosition = this.getHierarchicalIndex(firstParagraph, '0');
    }
    /**
     * @private
     */
    public deleteContent(table: TableWidget, selection: Selection, editAction: number): void {
        if (editAction < 4) {
            this.removeBlock(table);
            this.addRemovedNodes(table);
        }
    }

    private setActionInternal(selection: Selection, action: Action): void {
        if (this.viewer.owner.enableHistoryMode && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.editorHistory.currentBaseHistoryInfo.action = action;
        }
    }
    private checkClearCells(selection: Selection): boolean {
        // tslint:disable-next-line:max-line-length
        return this.editorHistory && this.editorHistory.currentBaseHistoryInfo && this.editorHistory.currentBaseHistoryInfo.action !== 'ClearCells';
    }
    private isEndInAdjacentTable(paragraph: ParagraphWidget, endParagraph: ParagraphWidget): boolean {
        let start: string = this.getHierarchicalIndex(paragraph, '');
        let end: string = this.getHierarchicalIndex(endParagraph, '');
        let selectionStart: string[] = start.split(';');
        let selectionEnd: string[] = end.split(';');
        return selectionStart.length < selectionEnd.length;
    }
    private cloneTableToHistoryInfo(table: TableWidget): TableWidget {
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            //Clones the entire table to preserve in history.
            let clonedTable: TableWidget = table.clone() as TableWidget;
            //Preserves the cloned table in history info, for future undo operation.
            this.editorHistory.currentBaseHistoryInfo.removedNodes.push(clonedTable);
            //Sets the insert position in history info as current table.
            if (this.viewer.selection.start.paragraph.isInsideTable &&
                this.viewer.selection.start.paragraph.associatedCell.ownerTable === table) {
                this.updateHistoryPosition(this.getHierarchicalIndex(table, '0'), true);
            }

            return clonedTable;
        }
        return undefined;
    }
    // tslint:disable-next-line:max-line-length
    private insertParagraphPaste(paragraph: ParagraphWidget, currentParagraph: ParagraphWidget, start: TextPosition, end: TextPosition, isCombineNextParagraph: boolean, editAction: number): void {
        if (this.editorHistory && (this.editorHistory.isUndoing || this.editorHistory.isRedoing) && this.editorHistory.currentBaseHistoryInfo.action === 'Paste') {
            let nextParagraph: ParagraphWidget = this.selection.getNextParagraphBlock(currentParagraph);
            if (nextParagraph) {
                if (start.offset > 0 && nextParagraph === end.paragraph && paragraph === start.paragraph
                    && this.editorHistory.currentBaseHistoryInfo.action === 'Paste') {
                    //Combines the current paragraph with end paragraph specific for undo/redo paste action.
                    let insertIndex: number = 0;
                    this.removeBlock(currentParagraph);
                    this.viewer.layout.clearListElementBox(nextParagraph);
                    this.viewer.layout.clearListElementBox(currentParagraph);
                    for (let i: number = 0; i < currentParagraph.childWidgets.length; i++) {
                        let line: LineWidget = currentParagraph.childWidgets[i] as LineWidget;
                        nextParagraph.childWidgets.splice(insertIndex, 0, line);
                        currentParagraph.childWidgets.splice(i, 1);
                        i--;
                        insertIndex++;
                        line.paragraph = nextParagraph;
                    }
                    this.viewer.layout.reLayoutParagraph(nextParagraph, 0, 0);
                    isCombineNextParagraph = false;
                    let offset: string = this.selection.editPosition.substring(this.selection.editPosition.lastIndexOf(';') + 1);
                    this.selection.editPosition = this.getHierarchicalIndex(nextParagraph, offset);
                }
            }
        }
        if (isCombineNextParagraph) {
            this.deleteParagraphMark(currentParagraph, this.selection, editAction);
        }
    }
    // tslint:disable-next-line:max-line-length
    private removeInlines(paragraph: ParagraphWidget, startLine: LineWidget, startOffset: number, endLine: LineWidget, endOffset: number, editAction: number): void {
        let isRemoved: boolean = false;
        this.viewer.layout.clearListElementBox(paragraph);
        let startIndex: number = paragraph.childWidgets.indexOf(startLine);
        for (let i: number = paragraph.childWidgets.length - 1; i >= 0; i--) {
            let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (startLine === lineWidget && endLine === lineWidget) {
                this.removeContent(lineWidget, startOffset, endOffset);
                isRemoved = true;
                break;
            }
            if (endLine === lineWidget) {
                isRemoved = true;
                this.removeContent(lineWidget, 0, endOffset);
            } else if (startLine === lineWidget) {
                this.removeContent(lineWidget, startOffset, this.viewer.selection.getLineLength(lineWidget));
                break;
            } else if (isRemoved) {
                this.removeContent(lineWidget, 0, this.viewer.selection.getLineLength(lineWidget));
            }
        }
        if (isRemoved) {
            this.removeEmptyLine(paragraph);
            this.viewer.layout.reLayoutParagraph(paragraph, 0, 0);
        }
    }
    /**
     * @private
     */
    public removeContent(lineWidget: LineWidget, startOffset: number, endOffset: number): void {
        let count: number = this.selection.getLineLength(lineWidget);
        for (let i: number = lineWidget.children.length - 1; i >= 0; i--) {
            let inline: ElementBox = lineWidget.children[i];
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
                }
                // if (editAction < 4) {
                this.unLinkFieldCharacter(inline);
                this.addRemovedNodes(lineWidget.children[i]);
                lineWidget.children.splice(i, 1);
                // }
            } else if (inline instanceof TextElementBox) {
                // if (editAction < 4) {
                let span: TextElementBox = new TextElementBox();
                span.characterFormat.copyFormat(inline.characterFormat);
                span.text = inline.text.substr(startIndex, endIndex - startIndex);
                this.addRemovedNodes(span);
                inline.text = inline.text.slice(0, startIndex) + inline.text.slice(endIndex);
            }
            if (startOffset >= count - (endIndex - startIndex)) {
                break;
            }
            count -= (endIndex - startIndex);
        }
    }
    /**
     * @private
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
     * clone the list level
     * @param  {WListLevel} source
     * @private
     */
    public cloneListLevel(source: WListLevel): WListLevel {
        let listLevel: WListLevel = new WListLevel(undefined);
        this.copyListLevel(listLevel, source);
        return listLevel;
    }
    /**
     * Copies the list level
     * @param  {WListLevel} destination
     * @param  {WListLevel} listLevel
     * @private
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
     * @param  {WLevelOverride} source
     * @private
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
     */
    public updateListParagraphs(): void {
        this.viewer.listParagraphs = [];
        for (let j: number = 0; j < this.viewer.pages.length; j++) {
            let bodyWidget: BodyWidget = this.viewer.pages[j].bodyWidgets[0];
            for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
                this.updateListParagraphsInBlock(bodyWidget.childWidgets[i] as BlockWidget);
            }
        }
    }
    /**
     * @private
     */
    public updateListParagraphsInBlock(block: BlockWidget): void {
        if (block instanceof ParagraphWidget) {
            if (!isNullOrUndefined(block.paragraphFormat)
                && !isNullOrUndefined(block.paragraphFormat.listFormat)
                && !isNullOrUndefined(block.paragraphFormat.listFormat.listId)) {
                if (isNullOrUndefined(this.viewer.listParagraphs)) {
                    this.viewer.listParagraphs = [];
                }
                this.viewer.listParagraphs.push(block);
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
     * @param  {WList} list
     * @private
     */
    public onApplyList(list: WList): void {
        let selection: Selection = this.viewer.selection;
        this.setOffsetValue(this.viewer.selection);
        this.initHistory('ListFormat');
        let format: WListFormat = new WListFormat();
        if (!isNullOrUndefined(list)) {
            format.listId = list.listId;
        }
        this.viewer.owner.isShiftingEnabled = true;
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
     * @param  {string} format
     * @param  {ListLevelPattern} listLevelPattern
     * @param  {string} fontFamily
     * @private
     */
    public applyBulletOrNumbering(format: string, listLevelPattern: ListLevelPattern, fontFamily: string): void {
        let selection: Selection = this.viewer.selection;
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
                list = this.viewer.getListById(currentParagraph.paragraphFormat.listFormat.listId);
                isUpdate = true;
            }
        }

        let startListLevel: WListLevel = undefined;
        if (!isNullOrUndefined(list)) {
            let tempList: WList = this.viewer.getListById(currentParagraph.paragraphFormat.listFormat.listId);
            startListLevel = this.viewer.layout.getListLevel(tempList, currentParagraph.paragraphFormat.listFormat.listLevelNumber);
        }

        if (isNullOrUndefined(list) || (!isNullOrUndefined(list) && ((startListLevel.listLevelPattern !== listLevelPattern) ||
            startListLevel.numberFormat !== format || (startListLevel.characterFormat.fontFamily !== fontFamily
                && startListLevel.listLevelPattern === 'Bullet')))) {
            isUpdate = false;
            list = new WList();
            if (this.viewer.lists.length > 0) {
                list.listId = this.viewer.lists[this.viewer.lists.length - 1].listId + 1;
            } else {
                list.listId = 0;
            }
            let abstractList: WAbstractList = new WAbstractList();
            if (this.viewer.abstractLists.length > 0) {
                abstractList.abstractListId = this.viewer.abstractLists[this.viewer.abstractLists.length - 1].abstractListId + 1;
            } else {
                abstractList.abstractListId = 0;
            }
            list.abstractListId = abstractList.abstractListId;
            list.abstractList = abstractList;
            this.viewer.abstractLists.push(abstractList);
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
     */
    public insertPageBreak(): void {
        if (!this.owner.isReadOnlyMode) {
            if (this.viewer.selection.start.paragraph.isInsideTable ||
                this.viewer.selection.start.paragraph.isInHeaderFooter) {
                return;
            }
            this.initComplexHistory('PageBreak');
            this.onEnter(true);
            if (this.editorHistory && this.editorHistory.currentHistoryInfo != null) {
                this.editorHistory.updateComplexHistory();
            }
            this.selection.checkForCursorVisibility();
        }
    }
    /**
     * @private
     */
    public onEnter(isInsertPageBreak?: boolean): void {
        let selection: Selection = this.viewer.selection;
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
                // tslint:disable-next-line:max-line-length
                this.onApplyListInternal(this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId), paragraph.paragraphFormat.listFormat.listLevelNumber - 1);
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
            let blockInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
            let initialStart: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
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
                this.insertParagraph(breakParagraph, true);
                selection.selectParagraph(breakParagraph, true);
            }
            let nextNode: BlockWidget = selection.start.paragraph.nextWidget as BlockWidget;
            if (isNullOrUndefined(nextNode)) {
                nextNode = selection.getNextRenderedBlock(selection.start.paragraph);
            }
            selection.selectParagraph(nextNode as ParagraphWidget, true);
            this.updateEndPosition();
            if (isInsertPageBreak && this.editorHistory) {
                this.owner.editorHistory.updateHistory();
            }
            // if (!isNullOrUndefined(selection.currentHistoryInfo)) {
            //     this.updateComplexHistory();
            // } else {
            this.reLayout(selection);
            // }
            let paragraph: ParagraphWidget = selection.start.paragraph.previousWidget as ParagraphWidget;
            if (!isNullOrUndefined(paragraph) && !paragraph.isEmpty() &&
                // tslint:disable-next-line:max-line-length
                (paragraph.lastChild as LineWidget).children[(paragraph.lastChild as LineWidget).children.length - 1] instanceof TextElementBox) {
                this.checkAndConvertToHyperlink(selection, true, paragraph);
            }
        }
    }
    private splitParagraphInternal(selection: Selection, paragraphAdv: ParagraphWidget, currentLine: LineWidget, offset: number): void {
        let insertIndex: number = 0;
        let blockIndex: number = paragraphAdv.index;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        let lineWidget: LineWidget = new LineWidget(paragraph);
        paragraph.childWidgets.push(lineWidget);
        //Copies the format to new paragraph.
        paragraph.paragraphFormat.ownerBase = paragraph;
        if (currentLine === paragraphAdv.lastChild && offset === selection.getLineLength(currentLine)) {
            // tslint:disable-next-line:max-line-length
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
            //ToDo in future: Need to skip copying formattings to new paragraph, if the style for following paragraph is same style.
            insertIndex++;
            blockIndex++;
        } else {
            paragraph.paragraphFormat.copyFormat(paragraphAdv.paragraphFormat);
            paragraph.characterFormat.copyFormat(paragraphAdv.characterFormat);
            if (offset > 0 || !currentLine.isFirstLine()) {
                paragraphAdv = paragraphAdv.combineWidget(this.viewer) as ParagraphWidget;
                this.moveInlines(paragraphAdv, paragraph, 0, 0, paragraphAdv.firstChild as LineWidget, offset, currentLine);
            }
            paragraphAdv = paragraphAdv.getSplitWidgets()[0] as ParagraphWidget;
        }
        insertIndex += paragraphAdv.getIndex();
        let container: Widget = paragraphAdv.containerWidget;
        let childNodes: BlockWidget[] = container.childWidgets as BlockWidget[];
        childNodes.splice(insertIndex, 0, paragraph);
        paragraph.containerWidget = container;
        paragraph.index = blockIndex;
        this.updateNextBlocksIndex(paragraph, true);
        // tslint:disable-next-line:max-line-length
        this.viewer.layout.layoutBodyWidgetCollection(blockIndex, container as BodyWidget, paragraph, false);
    }
    /**
     * @private
     */
    public updateNextBlocksIndex(block: BlockWidget, increaseIndex: boolean): void {
        let nextIndex: number = block.containerWidget.childWidgets.indexOf(block) + 1;
        if (block.containerWidget instanceof BodyWidget) {
            let currentSectionIndex: number = (block.containerWidget as BodyWidget).index;
            for (let j: number = this.viewer.pages.indexOf(block.containerWidget.page); j < this.viewer.pages.length; j++) {
                let page: Page = this.viewer.pages[j];
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
                let row: TableCellWidget = block.containerWidget.childWidgets[i] as TableCellWidget;
                this.updateIndex(row, increaseIndex);
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    (row.childWidgets[j] as TableCellWidget).rowIndex = row.index;
                }
            }
            //update Row index of all the cell
        } else if (block.containerWidget instanceof HeaderFooterWidget) {
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
    private updateEndPosition(): void {
        let selection: Selection = this.viewer.selection;
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            this.updateHistoryPosition(selection.start, false);
        }
    }
    /**
     * @private
     */
    public onBackSpace(): void {
        let selection: Selection = this.viewer.selection;
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
                }
            }
        }

    }
    /**
     * @private
     */
    public insertRemoveBookMarkElements(): boolean {
        let isHandledComplexHistory: boolean = false;
        for (let i: number = 0; i < this.removedBookmarkElements.length; i++) {
            let bookMark: BookmarkElementBox = this.removedBookmarkElements[i];
            if (bookMark.bookmarkType === 0) {
                let bookMarkStart: BookmarkElementBox = bookMark;
                if (bookMarkStart && bookMarkStart.reference && this.removedBookmarkElements.indexOf(bookMarkStart.reference) !== -1) {
                    let endIndex: number = this.removedBookmarkElements.indexOf(bookMarkStart.reference);
                    let startIndex: number = this.removedBookmarkElements.indexOf(bookMarkStart);
                    this.removedBookmarkElements.splice(endIndex, 1);
                    this.removedBookmarkElements.splice(startIndex, 1);
                } else {
                    this.initComplexHistory(this.editorHistory.currentBaseHistoryInfo.action);
                    this.editorHistory.updateHistory();
                    this.initInsertInline(bookMarkStart.clone());
                    this.editorHistory.updateComplexHistory();
                    isHandledComplexHistory = true;
                }
            } else {
                let bookMarkEnd: BookmarkElementBox = bookMark;
                if (bookMarkEnd && bookMarkEnd.reference && this.removedBookmarkElements.indexOf(bookMarkEnd.reference) !== -1) {
                    let endIndex: number = this.removedBookmarkElements.indexOf(bookMarkEnd.reference);
                    let startIndex: number = this.removedBookmarkElements.indexOf(bookMarkEnd);
                    this.removedBookmarkElements.splice(endIndex, 1);
                    this.removedBookmarkElements.splice(startIndex, 1);
                } else {
                    this.initComplexHistory(this.editorHistory.currentBaseHistoryInfo.action);
                    this.editorHistory.updateHistory();
                    this.initInsertInline(bookMarkEnd.clone());
                    this.editorHistory.updateComplexHistory();
                    isHandledComplexHistory = true;
                }
            }
        }
        this.removedBookmarkElements = [];
        return isHandledComplexHistory;
    }
    /**
     * @private
     */
    public deleteSelectedContents(selection: Selection, isBackSpace: boolean): boolean {
        let skipBackSpace: boolean = this.deleteSelectedContentInternal(selection, isBackSpace, selection.start, selection.end);
        let textPosition: TextPosition = new TextPosition(selection.owner);
        let blockInfo: ParagraphInfo = this.getParagraph({ index: selection.editPosition });
        let lineInfo: LineInfo = this.getLineInfo(blockInfo.paragraph, blockInfo.offset);
        textPosition.setPositionForLineWidget(lineInfo.line, lineInfo.offset);
        selection.selectContent(textPosition, true);
        return skipBackSpace;
    }
    /**
     * @private
     */
    public singleBackspace(selection: Selection, isRedoing: boolean): void {
        let history: EditorHistory = this.editorHistory;
        // If backspace is pressed after auto format to hyperlink is done, need to undo auto format.
        if (history && !isRedoing && !history.canRedo() && history.canUndo()) {
            let historyInfo: BaseHistoryInfo = history.undoStack[history.undoStack.length - 1];
            let startBlockInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
            let endBlockInfo: ParagraphInfo = this.getParagraphInfo(selection.end);
            // tslint:disable-next-line:max-line-length
            if (historyInfo.action === 'AutoFormatHyperlink' && historyInfo.insertPosition === this.getHierarchicalIndex(startBlockInfo.paragraph, startBlockInfo.offset.toString()) &&
                historyInfo.endPosition === this.getHierarchicalIndex(endBlockInfo.paragraph, endBlockInfo.offset.toString())) {
                history.undo();
                return;
            }
        }
        let paragraph: ParagraphWidget = selection.start.paragraph;
        let currentLineWidget: LineWidget = selection.start.currentWidget;
        let offset: number = selection.start.offset;
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = currentLineWidget.getInline(offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        let previousInline: ElementBox = inline;
        if (inline instanceof FieldElementBox && inline.fieldType === 2) {
            if (HelperMethods.isLinkedFieldCharacter(inline)) {
                let begin: FieldElementBox = inline.fieldBegin;
                let end: FieldElementBox = inline.fieldEnd;
                selection.start.setPositionParagraph(begin.line, begin.line.getOffset(begin, 0));
                selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                selection.fireSelectionChanged(true);
                return;
            }
        }
        if (inline instanceof FieldElementBox && inline.fieldType === 1) {
            let prevInline: ElementBox = selection.getPreviousValidElement(inline);
            if (prevInline instanceof FieldElementBox) {
                inline = (prevInline as FieldElementBox).fieldBegin;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, 0);
                selection.end.setPositionParagraph(inline.line, offset); //Selects the entire field.
                selection.fireSelectionChanged(true);
                return;
            } else if (prevInline !== inline) {
                inline = prevInline; //Updates the offset to delete next content.
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, inline.length);
            }
        }
        if (inline && (inline instanceof BookmarkElementBox && inline.bookmarkType === 1
            || inline.previousNode instanceof BookmarkElementBox)) {
            if (inline instanceof BookmarkElementBox) {
                inline = inline.previousNode;
                paragraph = inline.line.paragraph;
                offset = inline.line.getOffset(inline, inline.length);
            }
            if (inline.length === 1 && inline.nextNode instanceof BookmarkElementBox && inline.previousNode instanceof BookmarkElementBox) {
                let begin: BookmarkElementBox = inline.previousNode;
                let end: BookmarkElementBox = inline.nextNode;
                selection.start.setPositionParagraph(begin.line, begin.line.getOffset(begin, 0));
                selection.end.setPositionParagraph(end.line, end.line.getOffset(end, 0) + 1);
                this.initHistory('BackSpace');
                this.deleteSelectedContents(selection, true);
                if (this.checkEndPosition(selection)) {
                    this.updateHistoryPosition(selection.end, false);
                }
                this.reLayout(selection);
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
            if (paragraph.paragraphFormat.textAlignment !== 'Left') {
                this.onApplyParagraphFormat('textAlignment', 'Left', false, true);
                return;
            }
            if (paragraph.previousRenderedWidget instanceof ParagraphWidget) {
                selection.owner.isShiftingEnabled = true;
                let previousParagraph: ParagraphWidget = paragraph.previousRenderedWidget as ParagraphWidget;
                // if (isNullOrUndefined(previousParagraph)) {
                //     previousParagraph = this.viewer.selection.getPreviousBlock(paragraph) as ParagraphWidget;
                // }
                if (previousParagraph.isEmpty()) {
                    this.removeBlock(previousParagraph);
                    this.addRemovedNodes(previousParagraph);
                } else {
                    this.removeBlock(paragraph);
                    let endOffset: number = this.viewer.selection.getLineLength(previousParagraph.lastChild as LineWidget);
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
                    this.viewer.layout.reLayoutParagraph(previousParagraph, previousIndex, 0);
                    selection.selects(previousParagraph.childWidgets[previousIndex] as LineWidget, endOffset, true);
                    this.addRemovedNodes(paragraph);
                }
                this.setPositionForHistory();
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
            let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
            let lineWidget: LineWidget = selection.start.currentWidget;
            let removeOffset: number = offset - 1;
            if (removeOffset < 0) {
                lineWidget = lineWidget.previousLine as LineWidget;
                removeOffset = this.viewer.selection.getLineLength(lineWidget) + removeOffset;
            }
            this.removeAtOffset(lineWidget, selection, removeOffset);
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset - 1, false);
            this.setPositionForHistory();
            if (!isRedoing) {
                this.reLayout(selection);
            } else {
                this.fireContentChange();
            }
        }
    }
    private setPositionForHistory(editPosition?: string): void {
        let selection: Selection = this.viewer.selection;
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
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let inline: ElementBox = lineWidget.children[i] as ElementBox;
            if (inline instanceof ListTextElementBox) {
                continue;
            }
            if (offset < count + inline.length) {
                let indexInInline: number = offset - count;
                if (offset === count && inline.length === 1) {
                    this.unLinkFieldCharacter(inline);
                    lineWidget.children.splice(i, 1);
                    this.viewer.layout.reLayoutParagraph(lineWidget.paragraph, lineIndex, i);
                    this.addRemovedNodes(inline);
                } else {
                    let span: TextElementBox = new TextElementBox();
                    span.characterFormat.copyFormat(inline.characterFormat);
                    span.text = (inline as TextElementBox).text.substr(indexInInline, 1);
                    (inline as TextElementBox).text = HelperMethods.remove((inline as TextElementBox).text, indexInInline, 1);
                    this.viewer.layout.reLayoutParagraph(lineWidget.paragraph, lineIndex, i);
                    this.addRemovedNodes(span);
                }
                break;
            }
            count += inline.length;
        }
    }
    /**
     * @private
     */
    public onDelete(): void {
        let selection: Selection = this.viewer.selection;
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
            // if (this.viewer.owner.enableEditorHistory) {
            this.reLayout(selection);
            // }
            // this.updateSelectionRangeOffSet(selection.start, selection.end);
            // }
            // let textPosition: TextPosition = new TextPosition(selection.owner, this.viewer);
            // this.setPositionForCurrentIndex(textPosition,selection.editPosition);
            // selection.selectContent(textPosition, true);
            // if (!isNullOrUndefined(selection.currentHistoryInfo)) {
            //     this.updateComplexHistory();
            // } else {
            //     this.updateComplexWithoutHistory();
            // }
        }
    }
    /**
     * Remove single character on right of cursor position
     * @param  {Selection} selection
     * @param  {boolean} isRedoing
     * @private
     */
    public singleDelete(selection: Selection, isRedoing: boolean): void {
        // tslint:disable-next-line:max-line-length
        let paragraph: ParagraphWidget = selection.start.paragraph; let offset: number = selection.start.offset; let indexInInline: number = 0;
        let inlineObj: ElementInfo = paragraph.getInline(selection.start.offset, indexInInline); let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        if (paragraph.paragraphFormat.listFormat && paragraph.paragraphFormat.listFormat.listId !== -1 &&
            this.viewer.isListTextSelected && selection.contextType === 'List') {
            this.onApplyList(undefined); return;
        }
        if (!isNullOrUndefined(inline) && indexInInline === inline.length && !isNullOrUndefined(inline.nextNode)) {
            inline = inline.nextNode as ElementBox;
            indexInInline = 0;
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
        if (inline && (inline instanceof BookmarkElementBox && inline.bookmarkType === 0
            || inline.nextNode instanceof BookmarkElementBox)) {
            if (inline instanceof BookmarkElementBox) {
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
                this.initHistory('Delete');
                this.deleteSelectedContentInternal(selection, false, selection.start, selection.end);
                let textPosition: TextPosition = new TextPosition(selection.owner);
                this.setPositionForCurrentIndex(textPosition, selection.editPosition);
                selection.selectContent(textPosition, true);
                this.reLayout(selection);
                return;
            }
        }
        if (selection.start.currentWidget.isLastLine() && offset === this.viewer.selection.getLineLength(selection.start.currentWidget)) {
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
            let blockInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
            selection.editPosition = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
            if (this.checkInsertPosition(selection)) {
                this.setPositionForHistory(selection.editPosition);
            }
            selection.owner.isShiftingEnabled = true;
            if (paragraph.isEmpty()) {
                this.removeBlock(paragraph);
                this.addRemovedNodes(paragraph);
                if (isNullOrUndefined(nextParagraph)) {
                    if (isNullOrUndefined(previousParagraph)) {
                        // selection.selectParagraph(newParagraph, true, true);
                        let paraEndOffset: number = selection.getParagraphLength(newParagraph) + 1;
                        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
                            this.updateHistoryPosition(selection.start, true);
                            //tslint:disable-next-line:max-line-length
                            this.editorHistory.currentBaseHistoryInfo.endPosition = this.getHierarchicalIndex(newParagraph, paraEndOffset.toString());
                        }
                    } else {
                        selection.selectParagraph(previousParagraph, false);
                        this.setPositionForHistory();
                    }
                } else {
                    selection.selectParagraph(nextParagraph, true);
                }
            } else {
                paragraph = paragraph.combineWidget(this.viewer) as ParagraphWidget;
                // tslint:disable-next-line:max-line-length
                let currentParagraph: ParagraphWidget = this.splitParagraph(paragraph, paragraph.firstChild as LineWidget, 0, selection.start.currentWidget, selection.start.offset, true);
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
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(selection.start);
        let lineWidget: LineWidget = selection.start.currentWidget;
        let removeOffset: number = selection.start.offset;
        let lineLength: number = selection.getLineLength(selection.start.currentWidget);
        if (removeOffset >= lineLength) {
            lineWidget = lineWidget.nextLine as LineWidget;
            removeOffset = removeOffset - lineLength;
        }
        this.removeAtOffset(lineWidget, selection, removeOffset);
        this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset, false);
        if (!isRedoing) {
            this.reLayout(selection);
        } else {
            this.fireContentChange();
        }
    }
    private deleteParagraphMark(paragraph: ParagraphWidget, selection: Selection, editAction: number): void {
        if (isNullOrUndefined(paragraph.containerWidget)) {
            return;
        }
        paragraph = paragraph.combineWidget(this.viewer) as ParagraphWidget;
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
                this.viewer.layout.clearListElementBox(nextParagraph);
                this.viewer.layout.clearListElementBox(paragraph);
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
                this.viewer.layout.reLayoutParagraph(nextParagraph, 0, 0);
                if (offset > 0) {
                    selection.editPosition = this.getHierarchicalIndex(nextParagraph, offset.toString());
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
                nextParagraph = nextParagraph.combineWidget(this.viewer) as ParagraphWidget;
                this.viewer.layout.clearListElementBox(nextParagraph);
                this.viewer.layout.clearListElementBox(paragraph);
                this.updateEditPositionOnMerge(paragraph, nextParagraph);
                for (let i: number = 0; i < nextParagraph.childWidgets.length; i++) {
                    let inline: LineWidget = nextParagraph.childWidgets[i] as LineWidget;
                    nextParagraph.childWidgets.splice(i, 1);
                    paragraph.childWidgets.push(inline);
                    inline.paragraph = paragraph;
                    i--;
                }
                if (nextParagraph.childWidgets.length === 0) {
                    nextParagraph.childWidgets.push(new LineWidget(nextParagraph));
                }
                this.removeBlock(nextParagraph);
                this.viewer.layout.reLayoutParagraph(paragraph, 0, 0);
                this.addRemovedNodes(nextParagraph);
            }
        }
    }
    private updateEditPositionOnMerge(currentParagraph: ParagraphWidget, nextParagraph: ParagraphWidget): void {
        if (this.viewer.selection.editPosition === this.getHierarchicalIndex(nextParagraph, '0') &&
            nextParagraph.nextRenderedWidget === undefined) {
            // tslint:disable-next-line:max-line-length
            this.viewer.selection.editPosition = this.getHierarchicalIndex(currentParagraph, this.viewer.selection.getLineLength(currentParagraph.lastChild as LineWidget).toString());
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
        return this.viewer.owner.enableHistoryMode && !this.editorHistory.isRedoing;
    }
    // tslint:disable-next-line:max-line-length
    private deleteSelectedContentInternal(selection: Selection, isBackSpace: boolean, startPosition: TextPosition, endPosition: TextPosition): boolean {
        let startPos: TextPosition = startPosition;
        let endPos: TextPosition = endPosition;
        if (!startPosition.isExistBefore(endPosition)) {
            startPos = endPosition;
            endPos = startPosition;
        }
        let blockInfo: ParagraphInfo = this.getParagraphInfo(startPos);
        selection.editPosition = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
        let skipBackSpace: boolean = false;
        if (isBackSpace && startPos.isInSameParagraph(endPos)) {
            //Handled specifically to skip removal of contents, if selection is only paragraph mark and next rendered block is table.
            if (startPos.offset < endPos.offset && startPos.offset === selection.getParagraphLength(endPos.paragraph)) {
                let nextBlock: BlockWidget = selection.getNextRenderedBlock(startPos.paragraph);
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
            let editAction: number = (isBackSpace ? 1 : 0);
            this.deleteSelectedContent(endPos.paragraph, selection, startPos, endPos, editAction);
        }
        return skipBackSpace;
    }
    /**
     * Init EditorHistory
     * @private
     */
    public initHistory(action: Action): void {
        if (this.viewer.owner.enableHistoryMode) {
            this.editorHistory.initializeHistory(action);
        }
    }

    /**
     * Init Complex EditorHistory
     * @private
     */
    public initComplexHistory(action: Action): void {
        if (this.viewer.owner.enableHistoryMode) {
            this.editorHistory.initComplexHistory(this.viewer.selection, action);
        }
    }
    //Insert Picture implementation starts
    /**
     * Insert image 
     * @param  {string} base64String
     * @param  {number} width
     * @param  {number} height
     * @private
     */
    public insertPicture(base64String: string, width: number, height: number): void {
        let imageElementBox: ImageElementBox = new ImageElementBox(true);
        imageElementBox.imageString = base64String;
        imageElementBox.width = width;
        imageElementBox.height = height;
        this.insertPictureInternal(imageElementBox);
    }
    private insertPictureInternal(imageElementBox: ImageElementBox): void {
        let selection: Selection = this.viewer.selection;
        this.initHistory('InsertInline');
        this.fitImageToPage(selection, imageElementBox);
        this.insertInlineInSelection(selection, imageElementBox);
        this.reLayout(selection);
    }
    private fitImageToPage(selection: Selection, imageElementBox: ImageElementBox): void {
        let section: BodyWidget = selection.start.paragraph.bodyWidget as BodyWidget;
        let pageWidth: number = section.sectionFormat.pageWidth - section.sectionFormat.leftMargin - section.sectionFormat.rightMargin;
        let pageHeight: number = section.sectionFormat.pageHeight - section.sectionFormat.topMargin - section.sectionFormat.topMargin;
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
     */
    public onPortrait(): void {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let width: number = this.viewer.selection.sectionFormat.pageWidth;
        let height: number = this.viewer.selection.sectionFormat.pageHeight;
        if (width > height) {
            sectionFormat.pageWidth = height;
            sectionFormat.pageHeight = width;
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    /**
     * @private
     */
    public onLandscape(): void {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let width: number = this.viewer.selection.sectionFormat.pageWidth;
        let height: number = this.viewer.selection.sectionFormat.pageHeight;
        if (width < height) {
            sectionFormat.pageWidth = height;
            sectionFormat.pageHeight = width;
        }
        this.onApplySectionFormat(undefined, sectionFormat);
    }
    private copyValues(): WSectionFormat {
        let format: WSectionFormat = new WSectionFormat();
        format.bottomMargin = this.viewer.selection.sectionFormat.bottomMargin;
        format.topMargin = this.viewer.selection.sectionFormat.topMargin;
        format.leftMargin = this.viewer.selection.sectionFormat.leftMargin;
        format.rightMargin = this.viewer.selection.sectionFormat.rightMargin;
        format.pageHeight = this.viewer.selection.sectionFormat.pageHeight;
        format.pageWidth = this.viewer.selection.sectionFormat.pageWidth;
        format.footerDistance = this.viewer.selection.sectionFormat.footerDistance;
        format.headerDistance = this.viewer.selection.sectionFormat.headerDistance;
        return format;
    }
    /**
     * @private
     */
    public changeMarginValue(property: string): void {
        let sectionFormat: WSectionFormat = this.copyValues();

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
     * @private
     */
    public onPaperSize(property: string): void {
        let sectionFormat: WSectionFormat = this.copyValues();

        let width: number = this.viewer.selection.sectionFormat.pageWidth;
        let height: number = this.viewer.selection.sectionFormat.pageHeight;
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
     * @private
     */
    public updateListItemsTillEnd(blockAdv: BlockWidget, updateNextBlockList: boolean): void {
        let block: BlockWidget = updateNextBlockList ? this.viewer.selection.getNextRenderedBlock(blockAdv) : blockAdv;
        while (!isNullOrUndefined(block)) {
            //Updates the list value of the rendered paragraph. 
            this.updateRenderedListItems(block);
            block = block.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        }

    }
    /**
     * @private
     */
    public updateWholeListItems(block: BlockWidget): void {
        this.viewer.renderedLists.clear();
        let sectionIndex: number = block.bodyWidget.index;
        let currentBlock: BlockWidget;
        for (let j: number = 0; j < this.viewer.pages.length; j++) {
            let page: Page = this.viewer.pages[j];
            if (page.bodyWidgets[0].index === sectionIndex) {
                currentBlock = page.bodyWidgets[0].firstChild as BlockWidget;
                break;
            }
        }
        let isListUpdated: boolean = false;
        do {
            isListUpdated = this.updateListItems(currentBlock, block);
            if (isListUpdated) {
                break;
            }
            currentBlock = currentBlock.getSplitWidgets().pop().nextRenderedWidget as BlockWidget;
        } while (currentBlock);
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
            let isListUpdated: boolean = this.updateListItemsForRow(row, block);
            if (isListUpdated) {
                return true;
            }
            row = row.getSplitWidgets().pop().nextRenderedWidget as TableRowWidget;
        } while (row);
        return false;
    }
    private updateListItemsForRow(row: TableRowWidget, block: BlockWidget): boolean {
        if (block.isInsideTable && row.childWidgets.indexOf(this.viewer.selection.getContainerCell(block.associatedCell)) !== -1) {
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
     * @private
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
            let listLevelNumber: number = 0;
            if (!isNullOrUndefined(paragraph.paragraphFormat) && !isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
                currentList = this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId);
                listLevelNumber = paragraph.paragraphFormat.listFormat.listLevelNumber;
            }
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(currentList) && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId))
                // tslint:disable-next-line:max-line-length
                && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId).levels[listLevelNumber])) {
                let currentListLevel: WListLevel = this.viewer.layout.getListLevel(currentList, listLevelNumber);
                //Updates the list numbering from document start for reLayouting.
                if (currentListLevel.listLevelPattern !== 'Bullet') {
                    this.viewer.layout.getListNumber(paragraph.paragraphFormat.listFormat);
                }
            }
        }
        return false;
    }
    private updateRenderedListItemsForPara(paragraph: ParagraphWidget): void {

        if (!isNullOrUndefined(this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId))) {
            let currentList: WList = this.viewer.getListById(paragraph.paragraphFormat.listFormat.listId);
            let listLevelNumber: number = paragraph.paragraphFormat.listFormat.listLevelNumber;
            if (!isNullOrUndefined(currentList) && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId))
                // tslint:disable-next-line:max-line-length
                && !isNullOrUndefined(this.viewer.getAbstractListById(currentList.abstractListId).levels[paragraph.paragraphFormat.listFormat.listLevelNumber])) {
                let currentListLevel: WListLevel = this.viewer.layout.getListLevel(currentList, listLevelNumber);
                //Updates the list numbering from document start for reLayouting.
                if (currentListLevel.listLevelPattern !== 'Bullet') {
                    let element: ListTextElementBox = undefined;
                    if (paragraph.childWidgets.length > 0) {
                        let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
                        if (lineWidget.children.length > 0) {
                            element = lineWidget.children[0] as ListTextElementBox;
                        }
                    }
                    if (!isNullOrUndefined(element)) {
                        element.text = this.viewer.layout.getListNumber(paragraph.paragraphFormat.listFormat);
                    }
                }
            }
        }
    }
    /**
     * Get logical offset of paragraph.
     * @private
     */
    public getParagraphInfo(position: TextPosition): ParagraphInfo {
        return this.getParagraphInfoInternal(position.currentWidget, position.offset);
    }
    /**
     * @private
     */
    public getParagraphInfoInternal(line: LineWidget, lineOffset: number): ParagraphInfo {
        let paragraph: ParagraphWidget = line.paragraph;
        let offset: number = this.selection.getParagraphLength(paragraph, line) + lineOffset;
        let previous: ParagraphWidget = paragraph.previousSplitWidget as ParagraphWidget;
        while (previous instanceof ParagraphWidget) {
            paragraph = previous;
            offset += this.viewer.selection.getParagraphLength(paragraph);
            previous = paragraph.previousSplitWidget as ParagraphWidget;
        }
        return { 'paragraph': paragraph, 'offset': offset };
    }
    /**
     * Get offset value to update in selection
     * @private
     */
    public getOffsetValue(selection: Selection): void {
        if (this.startParagraph) {
            let lineInfo: LineInfo = this.getLineInfo(this.startParagraph, this.startOffset);
            selection.start.setPositionFromLine(lineInfo.line, lineInfo.offset);
        }
        selection.start.updatePhysicalPosition(true);
        if (selection.isEmpty) {
            selection.end.setPositionInternal(selection.start);
        } else {
            if (this.endParagraph) {
                let lineInfo: LineInfo = this.getLineInfo(this.endParagraph, this.endOffset);
                selection.end.setPositionFromLine(lineInfo.line, lineInfo.offset);
            }
            selection.end.updatePhysicalPosition(true);
        }
    }
    /**
     * Get offset value to update in selection
     * @private
     */
    public getLineInfo(paragraph: ParagraphWidget, offset: number): LineInfo {
        let position: TextPosition = undefined;
        let element: ElementBox = undefined;
        let length: number = this.selection.getParagraphLength(paragraph);
        let next: ParagraphWidget = paragraph.nextSplitWidget as ParagraphWidget;
        if (offset > length + 1 && isNullOrUndefined(next)) {
            offset = length;
        }
        while (offset > length && next instanceof ParagraphWidget) {
            offset -= length;
            paragraph = next;
            length = this.selection.getParagraphLength(paragraph);
            next = paragraph.nextSplitWidget as ParagraphWidget;
        }
        return this.selection.getLineInfo(paragraph, offset);
    }
    /**
     * @private
     */
    public setPositionParagraph(paragraph: ParagraphWidget, offset: number, skipSelectionChange: boolean): void {
        let selection: Selection = this.viewer.selection;
        let lineInfo: LineInfo = this.getLineInfo(paragraph, offset);
        selection.start.setPositionFromLine(lineInfo.line, lineInfo.offset);
        selection.end.setPositionInternal(selection.start);
        if (!skipSelectionChange) {
            selection.fireSelectionChanged(true);
        }
    }
    /**
     * @private
     */
    public setPositionForCurrentIndex(textPosition: TextPosition, editPosition: string): void {
        let blockInfo: ParagraphInfo = this.getParagraph({ index: editPosition });
        let lineInfo: LineInfo = this.getLineInfo(blockInfo.paragraph, blockInfo.offset);
        textPosition.setPositionForLineWidget(lineInfo.line, lineInfo.offset);
    }
    /**
     * @private
     */
    public insertPageNumber(numberFormat?: string): void {
        if (isNullOrUndefined(numberFormat)) {
            numberFormat = '';
        } else {
            numberFormat = ' \\*' + numberFormat;
        }
        let fieldCode: string = 'PAGE ' + numberFormat + ' \\* MERGEFORMAT';
        this.createFields(fieldCode);
    }

    /**
     * @private
     */
    public insertPageCount(numberFormat?: string): void {
        if (isNullOrUndefined(numberFormat)) {
            numberFormat = '';
        } else {
            numberFormat = ' \*' + numberFormat;
        }
        let fieldCode: string = 'NUMPAGES ' + numberFormat + ' \* MERGEFORMAT';
        this.createFields(fieldCode);
    }

    private createFields(fieldCode: string): void {
        let paragraph: ParagraphWidget = new ParagraphWidget();
        let line: LineWidget = new LineWidget(paragraph);
        let fieldBegin: FieldElementBox = new FieldElementBox(0);
        line.children.push(fieldBegin);
        let fieldtext: FieldTextElementBox = new FieldTextElementBox();
        fieldtext.fieldBegin = fieldBegin;
        fieldtext.text = '1';
        let text: TextElementBox = new TextElementBox();
        text.text = fieldCode;
        line.children.push(text);
        let fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldBegin.fieldSeparator = fieldSeparator;
        line.children.push(fieldSeparator);
        line.children.push(fieldtext);
        let fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.fieldBegin = fieldBegin;
        fieldEnd.fieldSeparator = fieldSeparator;
        fieldSeparator.fieldEnd = fieldEnd;
        fieldBegin.fieldEnd = fieldEnd;
        line.children.push(fieldEnd);
        fieldBegin.line = line;
        paragraph.childWidgets.push(line);
        let widgets: BlockWidget[] = [];
        widgets.push(paragraph);
        this.viewer.fields.push(fieldBegin);
        this.pasteContentsInternal(widgets);
    }
    /**
     * @private
     */
    public insertBookmark(name: string): void {
        let bookmark: BookmarkElementBox = new BookmarkElementBox(0);
        bookmark.name = name;
        let bookmarkEnd: BookmarkElementBox = new BookmarkElementBox(1);
        bookmarkEnd.name = name;
        bookmark.reference = bookmarkEnd;
        bookmarkEnd.reference = bookmark;
        this.viewer.bookmarks.add(name, bookmark);
        this.initComplexHistory('InsertBookmark');
        this.insertElements([bookmarkEnd], [bookmark]);
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistoryInternal();
        }
        this.selection.start.setPositionForSelection(bookmark.line, bookmark, 1, this.selection.start.location);
        this.selection.end.setPositionForSelection(bookmarkEnd.line, bookmarkEnd, 0, this.selection.end.location);
        this.selection.fireSelectionChanged(true);
        this.fireContentChange();
    }
    /**
     * @private
     */
    public deleteBookmark(bookmarkName: string): void {
        let bookmarks: Dictionary<string, BookmarkElementBox> = this.viewer.bookmarks;
        let bookmark: BookmarkElementBox = bookmarks.get(bookmarkName);
        if (bookmark instanceof BookmarkElementBox) {
            let bookmarkEnd: BookmarkElementBox = bookmark.reference;
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
     * @private
     */
    public deleteBookmarkInternal(bookmark: BookmarkElementBox): void {
        this.viewer.bookmarks.remove(bookmark.name);
        bookmark.line.children.splice(bookmark.indexInOwner, 1);
        bookmark.reference.line.children.splice(bookmark.reference.indexInOwner, 1);
    }
    /**
     * @private
     */
    public getSelectionInfo(): SelectionInfo {
        let start: TextPosition = this.selection.start;
        let end: TextPosition = this.selection.end;
        let isEmpty: boolean = this.selection.isEmpty;
        if (!this.selection.isForward) {
            start = this.selection.end;
            end = this.selection.start;
        }
        let startElementInfo: ElementInfo = start.currentWidget.getInline(start.offset, 0);
        let endElementInfo: ElementInfo = end.currentWidget.getInline(end.offset, 0);
        // tslint:disable-next-line:max-line-length
        return { 'start': start.clone(), 'end': end.clone(), 'startElementInfo': startElementInfo, 'endElementInfo': endElementInfo, 'isEmpty': isEmpty };
    }
    /**
     * @private
     */
    public insertElements(endElements: ElementBox[], startElements?: ElementBox[]): void {
        let info: SelectionInfo = this.getSelectionInfo();
        if (!isNullOrUndefined(startElements)) {
            this.insertElementsInternal(info.start, startElements);
        }
        if (!isNullOrUndefined(endElements)) {
            this.insertElementsInternal(info.end, endElements);
        }

    }
    /**
     * @private
     */
    public insertElementsInternal(position: TextPosition, elements: ElementBox[]): void {
        this.selection.selectPosition(position, position);
        this.initHistory('InsertElements');
        this.updateInsertPosition();
        let indexInInline: number = 0;
        let paragraphInfo: ParagraphInfo = this.getParagraphInfo(this.selection.start);
        if (this.selection.start.paragraph.isEmpty()) {
            let paragraph: ParagraphWidget = this.selection.start.paragraph as ParagraphWidget;
            (paragraph.childWidgets[0] as LineWidget).children.push(elements[0]);
            elements[0].line = (paragraph.childWidgets[0] as LineWidget);
            elements[0].linkFieldCharacter(this.viewer);
            this.viewer.layout.reLayoutParagraph(paragraph, 0, 0);
            this.setPositionParagraph(paragraphInfo.paragraph, paragraphInfo.offset + length, true);
            position.setPositionForSelection(elements[0].line, elements[0], elements[0].length, this.selection.start.location);
            this.selection.selectPosition(position, position);
        } else {
            let inlineObj: ElementInfo = this.selection.start.currentWidget.getInline(this.viewer.selection.start.offset, indexInInline);
            let curInline: ElementBox = inlineObj.element;
            indexInInline = inlineObj.index;
            let firstElement: ElementBox = elements[0];
            this.insertElementInternal(curInline, firstElement, indexInInline, true);
            let index: number = firstElement.indexInOwner;
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
     * @private
     */
    public getHierarchicalIndex(block: Widget, offset: string): string {
        let index: string;
        if (block) {
            if (block instanceof HeaderFooterWidget) {
                let hfString: string = block.headerFooterType.indexOf('Header') !== -1 ? 'H' : 'F';
                let pageIndex: string = block.page.index.toString();
                let headerFooterIndex: string = (this.viewer as PageLayoutViewer).getHeaderFooter(block.headerFooterType).toString();
                let sectionIndex: number = block.page.sectionIndex;
                index = sectionIndex + ';' + hfString + ';' + pageIndex + ';' + offset;
            } else {
                index = block.index + ';' + offset;
            }
            if (block.containerWidget) {
                if (block instanceof TableCellWidget && block.rowIndex !== block.containerWidget.index) {
                    index = block.rowIndex + ';' + index;
                    block = block.containerWidget;
                }
                return this.getHierarchicalIndex(block.containerWidget, index);
            }
        }
        return index;
    }
    /**
     * @private
     */
    public getBlock(position: IndexInfo): BlockInfo {
        let bodyWidget: BodyWidget = this.getBodyWidget(position);
        return this.getBlockInternal(bodyWidget, position);
    }
    /**
     * Return Block relative to position
     * @private
     */
    public getBlockInternal(widget: Widget, position: IndexInfo): BlockInfo {
        if (position.index === '' || isNullOrUndefined(position)) {
            return undefined;
        }
        let index: number = position.index.indexOf(';');
        let value: string = position.index.substring(0, index);
        position.index = position.index.substring(index).replace(';', '');
        let node: Widget = widget;
        // if (node instanceof WSection && value === 'HF') {
        //     //Gets the block in Header footers.
        //     let blockObj: BlockInfo = this.getBlock((node as WSection).headerFooters, position);
        // tslint:disable-next-line:max-line-length
        //     return { 'node': (!isNullOrUndefined(blockObj)) ? blockObj.node : undefined, 'position': (!isNullOrUndefined(blockObj)) ? blockObj.position : undefined };
        // }
        index = parseInt(value, 10);
        let childWidget: Widget = this.getBlockByIndex(widget, index);
        if (childWidget) {
            let child: Widget = childWidget as Widget;
            if (position.index.indexOf(';') >= 0) {
                if (child instanceof ParagraphWidget) {
                    if (position.index.indexOf(';') >= 0) {
                        position.index = '0';
                    }
                    return { 'node': child as ParagraphWidget, 'position': position };
                }
                if (child instanceof Widget) {
                    let blockObj: BlockInfo = this.getBlockInternal((child as Widget), position);
                    // tslint:disable-next-line:max-line-length
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
     * @private
     */
    public getParagraph(position: IndexInfo): ParagraphInfo {
        let paragraph: ParagraphWidget = this.getParagraphInternal(this.getBodyWidget(position), position);
        return { paragraph: paragraph, offset: parseInt(position.index, 10) };
    }
    /**
     * Get paragraph relative to position
     * @private
     */
    private getParagraphInternal(container: Widget, position: IndexInfo): ParagraphWidget {
        if (isNullOrUndefined(position.index)) {
            return undefined;
        }
        // let ins: Widget = container;
        let index: number = position.index.indexOf(';');
        let value: string = '0';
        if (index >= 0) {
            value = position.index.substring(0, index);
            position.index = position.index.substring(index).replace(';', '');
        }
        // if (container instanceof BodyWidget && value === 'HF') {
        //     return this.getParagraph(container.headerFooters, position);
        // }
        index = parseInt(value, 10);
        if (container instanceof TableRowWidget && index >= container.childWidgets.length) {
            position.index = '0;0';
            index = container.childWidgets.length - 1;
        }
        let childWidget: Widget = this.getBlockByIndex(container, index);
        if (childWidget) {
            let child: Widget = childWidget as Widget;
            if (child instanceof ParagraphWidget) {
                if (position.index.indexOf(';') > 0) {
                    position.index = '0';
                }
                return child as ParagraphWidget;
            }
            if (child instanceof Widget) {
                if (position.index.indexOf(';') > 0) {
                    return this.getParagraphInternal((child as Widget), position);
                } else {
                    //If table is shifted to previous text position then return the first paragraph within table.
                    if (child instanceof TableWidget) {
                        return this.viewer.selection.getFirstParagraphInFirstCell((child as TableWidget));
                    }
                    return undefined;
                }
            }
        } else if (container) {
            let nextWidget: Widget = container.getSplitWidgets().pop().nextRenderedWidget;
            if (nextWidget instanceof Widget) {
                position.index = '0';
                if (nextWidget instanceof TableWidget) {
                    return this.viewer.selection.getFirstParagraphInFirstCell((nextWidget as TableWidget));
                }
                return nextWidget as ParagraphWidget;
            }
        }
        return undefined;
    }

    private getBodyWidget(position: IndexInfo): BlockContainer {
        let index: number = position.index.indexOf(';');
        let value: string = position.index.substring(0, index);
        position.index = position.index.substring(index).replace(';', '');
        let sectionIndex: number = parseInt(value, 10);
        index = parseInt(value, 10);
        index = position.index.indexOf(';');
        value = position.index.substring(0, index);
        // position = position.substring(index).replace(';', '');
        if (value === 'H' || value === 'F') {
            return this.getHeaderFooterWidget(position);
        }
        index = parseInt(value, 10);
        return this.getBodyWidgetInternal(sectionIndex, index);
    }
    private getHeaderFooterWidget(position: IndexInfo): HeaderFooterWidget {
        //HEADER OR FOOTER WIDGET
        let index: number = position.index.indexOf(';');
        let value: string = position.index.substring(0, index);
        position.index = position.index.substring(index).replace(';', '');
        let isHeader: boolean = value === 'H';
        index = position.index.indexOf(';');
        value = position.index.substring(0, index);
        position.index = position.index.substring(index).replace(';', '');
        index = parseInt(value, 10);
        let page: Page = this.viewer.pages[index];
        if (isHeader) {
            return page.headerWidget;
        } else {
            return page.footerWidget;
        }
    }
    private getBodyWidgetInternal(sectionIndex: number, blockIndex: number): BodyWidget {
        for (let i: number = 0; i < this.viewer.pages.length; i++) {
            let bodyWidget: BodyWidget = this.viewer.pages[i].bodyWidgets[0];
            if (bodyWidget.index === sectionIndex) {
                if ((bodyWidget.firstChild as Widget).index <= blockIndex && (bodyWidget.lastChild as Widget).index >= blockIndex) {
                    return bodyWidget;
                }
            }
            if (bodyWidget.index > sectionIndex) {
                break;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getBlockByIndex(container: Widget, blockIndex: number): Widget {
        let childWidget: Widget;
        if (container) {
            for (let j: number = 0; j < container.childWidgets.length; j++) {
                if ((container.childWidgets[j] as Widget).index === blockIndex) {
                    childWidget = container.childWidgets[j] as Widget;
                    break;
                }
            }
            if (!childWidget && !(container instanceof HeaderFooterWidget)) {
                return this.getBlockByIndex(container.nextSplitWidget, blockIndex);
            }
        }
        return childWidget;
    }
    /**
     * @private
     */
    public updateHistoryPosition(position: TextPosition | string, isInsertPosition: boolean): void {
        if (this.editorHistory && !isNullOrUndefined(this.editorHistory.currentBaseHistoryInfo)) {
            let hierarchicalIndex: string;
            if (position instanceof TextPosition) {
                let blockInfo: ParagraphInfo = this.getParagraphInfo(position);
                hierarchicalIndex = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());
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
     * @param {BorderSettings} settings
     */
    public applyBorders(settings: BorderSettings): void {
        this.initHistory('Borders');
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        let table: TableWidget = startPos.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.viewer) as TableWidget;
        if (this.editorHistory) {
            let clonedTable: TableWidget = this.cloneTableToHistoryInfo(table);
        }
        let startCell: TableCellWidget = startPos.paragraph.associatedCell;
        let endCell: TableCellWidget = endPos.paragraph.associatedCell;
        let cells: TableCellWidget[];
        let border: WBorder = this.getBorder(settings.borderColor, settings.lineWidth, settings.borderStyle);
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
                let selectedCell: TableCellWidget[] = this.getTopBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.top.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'LeftBorder') {
                let selectedCell: TableCellWidget[] = this.getLeftBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.left.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'RightBorder') {
                let selectedCell: TableCellWidget[] = this.getRightBorderCellsOnSelection();
                for (let i: number = 0; i < selectedCell.length; i++) {
                    selectedCell[i].cellFormat.borders.right.copyFormat(border);
                }
            }
            if (settings.type === 'OutsideBorders' || settings.type === 'BottomBorder') {
                let selectedCell: TableCellWidget[] = this.getBottomBorderCellsOnSelection();
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
                let cell: TableCellWidget = cells[i];
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
                let cell: TableCellWidget = cells[i];
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
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
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
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            let cell: TableCellWidget = cells[i];
            let isLastSelectedRow: boolean = cell.ownerRow === cells[cells.length - 1].ownerRow;
            let isLastRightCell: boolean = (cell.columnIndex + cell.cellFormat.columnSpan - 1) === cells[cells.length - 1].columnIndex;
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
                let nextRowIndex: number = cell.ownerRow.rowIndex + cell.cellFormat.rowSpan;
                let nextRow: TableRowWidget = table.childWidgets[nextRowIndex] as TableRowWidget;
                if (nextRow) {
                    let selectedCells: TableCellWidget[] = this.getAdjacentBottomBorderOnEmptyCells(nextRow, cell, true);
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
                let rightBorderCells: TableCellWidget[] = this.getSelectedCellsNextWidgets(cell, table);
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
    /**
     * @private
     */
    public getTopBorderCellsOnSelection(): TableCellWidget[] {
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let startCell: TableCellWidget = startPos.paragraph.associatedCell;
        let topBorderCells: TableCellWidget[] = [];
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].ownerRow === startCell.ownerRow) {
                topBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return topBorderCells;
    }
    /**
     * @private
     */
    public getLeftBorderCellsOnSelection(): TableCellWidget[] {
        let startPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let startCell: TableCellWidget = startPos.paragraph.associatedCell;
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
        let leftBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].columnIndex === startCell.columnIndex) {
                leftBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return leftBorderCells;
    }
    /**
     * @private
     */
    public getRightBorderCellsOnSelection(): TableCellWidget[] {
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
        let rightBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if ((cells[i].columnIndex + cells[i].cellFormat.columnSpan - 1) === cells[cells.length - 1].columnIndex) {
                rightBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return rightBorderCells;
    }
    /**
     * @private
     */
    public getBottomBorderCellsOnSelection(): TableCellWidget[] {
        let endPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        let endCell: TableCellWidget = endPos.paragraph.associatedCell;
        let cells: TableCellWidget[] = this.selection.getSelectedCells();
        let bottomBorderCells: TableCellWidget[] = [];
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].ownerRow === endCell.ownerRow) {
                bottomBorderCells.push(cells[i] as TableCellWidget);
            }
        }
        return bottomBorderCells;
    }
    /**
     * @private
     */
    public clearAllBorderValues(borders: WBorders): void {
        let border: WBorder = this.clearBorder();
        borders.bottom.copyFormat(border);
        borders.left.copyFormat(border);
        borders.right.copyFormat(border);
        borders.top.copyFormat(border);
        borders.vertical.copyFormat(border);
        borders.horizontal.copyFormat(border);
    }
    private clearBorder(): WBorder {
        let border: WBorder = new WBorder();
        border.lineStyle = 'Cleared';
        return border;
    }
    /**
     * @private
     */
    public getAdjacentCellToApplyBottomBorder(): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        let startPos: TextPosition = this.selection.start;
        let endPos: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPos = this.selection.end;
            endPos = this.selection.start;
        }
        let table: TableWidget = startPos.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.viewer) as TableWidget;
        let startCell: TableCellWidget = startPos.paragraph.associatedCell;
        let endCell: TableCellWidget = endPos.paragraph.associatedCell;
        let nextRowIndex: number = endCell.ownerRow.rowIndex + endCell.cellFormat.rowSpan;
        let nextRow: TableRowWidget = table.childWidgets[nextRowIndex] as TableRowWidget;
        if (nextRow) {
            if (endCell.cellFormat.columnSpan > 1) {
                for (let i: number = endCell.columnIndex; i < endCell.columnIndex + endCell.cellFormat.columnSpan; i++) {
                    cells.push(nextRow.childWidgets[i] as TableCellWidget);
                }
            } else {
                cells = this.getAdjacentBottomBorderOnEmptyCells(nextRow, endCell);
                if (!this.selection.isEmpty) {
                    for (let i: number = 0; i < nextRow.childWidgets.length; i++) {
                        let nextCellColIndex: number = (nextRow.childWidgets[i] as TableCellWidget).columnIndex;
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
        let cells: TableCellWidget[] = [];
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
    /**
     * @private
     */
    public getAdjacentCellToApplyRightBorder(): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        let startPosIn: TextPosition = this.selection.start;
        let endPosIn: TextPosition = this.selection.end;
        if (!this.selection.isForward) {
            startPosIn = this.selection.end;
            endPosIn = this.selection.start;
        }
        let table: TableWidget = startPosIn.paragraph.associatedCell.ownerTable;
        table = table.combineWidget(this.viewer) as TableWidget;
        let startCell: TableCellWidget = startPosIn.paragraph.associatedCell;
        let endCell: TableCellWidget = endPosIn.paragraph.associatedCell;
        if (this.selection.isEmpty) {
            let selectedCell: TableCellWidget = startPosIn.paragraph.associatedCell;
            cells = this.getSelectedCellsNextWidgets(selectedCell, table);
        } else {
            // tslint:disable-next-line:max-line-length
            let selectedCells: TableCellWidget[] = this.getRightBorderCellsOnSelection();
            for (let i: number = 0; i < selectedCells.length; i++) {
                let cell: TableCellWidget = selectedCells[i] as TableCellWidget;
                cells = cells.concat(this.getSelectedCellsNextWidgets(cell, table));

            }
        }
        return cells;
    }
    private getSelectedCellsNextWidgets(selectedCell: TableCellWidget, table: TableWidget): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        if (selectedCell.nextWidget) {
            cells.push(selectedCell.nextWidget as TableCellWidget);
        }
        if (selectedCell.cellFormat.rowSpan > 1) {
            let nextRowIndex: number = selectedCell.ownerRow.rowIndex + selectedCell.cellFormat.rowSpan;
            for (let i: number = selectedCell.ownerRow.rowIndex + 1; i < nextRowIndex; i++) {
                let nextRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
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
        return cells;
    }
    /**
     * @private
     */
    public getBorder(borderColor: string, lineWidth: number, borderStyle: LineStyle): WBorder {
        let border: WBorder = new WBorder();
        border.color = borderColor || '#000000';
        border.lineWidth = lineWidth || 1;
        border.lineStyle = borderStyle || 'Single';
        return border;
    }

    /**
     * Applies borders
     * @param  {WBorders} sourceBorders
     * @param  {WBorders} applyBorders
     * @private
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
     * @param  {WShading} sourceShading
     * @param  {WShading} applyShading
     * @private
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
     * @param  {Selection} selection
     * @param  {WTableFormat} format
     * @private
     */
    public onTableFormat(format: WTableFormat): void {
        if (!isNullOrUndefined(this.selection.tableFormat)) {
            this.viewer.owner.isShiftingEnabled = true;
            this.editorHistory.initializeHistory('TableFormat');
            let table: TableWidget = this.selection.start.paragraph.associatedCell.ownerTable.combineWidget(this.viewer) as TableWidget;
            this.applyTableFormat(table, undefined, format);
            this.reLayout(this.selection, false);
        }
    }
    /**
     * @private
     */
    public applyTableFormat(table: TableWidget, property: string, value: object): void {
        this.applyTablePropertyValue(this.viewer.selection, undefined, value, table);
    }
    // tslint:disable-next-line:max-line-length
    private applyTablePropertyValue(selection: Selection, property: string, value: Object, table: TableWidget): void {
        let sourceFormat: WTableFormat = table.tableFormat;
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
        this.viewer.layout.reLayoutTable(table);
    }
    /**
     * Applies Row Format Changes
     * @param  {Selection} selection
     * @param  {WRowFormat} format
     * @param  {WRow} row
     * @private
     */
    public onRowFormat(format: WRowFormat): void {
        if (isNullOrUndefined(this.selection) || isNullOrUndefined(format)) {
            return;
        }
        this.editorHistory.initializeHistory('RowFormat');
        this.viewer.owner.isShiftingEnabled = true;
        let rowStartPos: TextPosition = this.selection.isForward ? this.selection.start : this.selection.end;
        let rowEndPos: TextPosition = this.selection.isForward ? this.selection.end : this.selection.start;
        let table: TableWidget = rowStartPos.paragraph.associatedCell.ownerTable.combineWidget(this.viewer) as TableWidget;
        this.applyRowFormat(rowStartPos.paragraph.associatedCell.ownerRow, rowStartPos, rowEndPos, undefined, format);
        this.reLayout(this.selection, false);
    }
    private applyRowFormat(row: TableRowWidget, start: TextPosition, end: TextPosition, property: string, value: Object): void {
        this.applyRowPropertyValue(this.viewer.selection, property, value, row);
        if (end.paragraph.associatedCell.ownerRow === row) {
            return;
        }
        let newRow: TableRowWidget = row.nextWidget as TableRowWidget;
        if (!isNullOrUndefined(newRow)) {
            this.applyRowFormat(newRow, start, end, property, value);
        }
    }
    private applyRowPropertyValue(selection: Selection, property: string, value: Object, row: TableRowWidget): void {
        let applyFormat: WRowFormat = row.rowFormat;
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
     * @param  {Selection} selection
     * @param  {WCellFormat} format
     * @param  {WCell} cell
     * @private
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
     * @private
     */
    public updateCellMargins(selection: Selection, value: WCellFormat): void {
        let cellStartPosition: TextPosition = selection.start;
        let cellEndPosition: TextPosition = selection.end;
        if (!selection.isForward) {
            cellStartPosition = selection.end;
            cellEndPosition = selection.start;
        }
        this.initHistoryPosition(selection, cellStartPosition);
        // tslint:disable-next-line:max-line-length
        this.viewer.owner.cellOptionsDialogModule.applyCellmarginsValue(cellStartPosition.paragraph.associatedCell.ownerRow, cellStartPosition, cellEndPosition, value);
    }
    /**
     * @private
     */
    public updateFormatForCell(selection: Selection, property: string, value: Object): void {
        let start: TextPosition = selection.start;
        let end: TextPosition = selection.end;
        if (!selection.isForward) {
            start = selection.end;
            end = selection.start;
        }
        let startCell: TableCellWidget = start.paragraph.associatedCell;
        let endCell: TableCellWidget = end.paragraph.associatedCell;
        let cells: TableCellWidget[];
        let table: TableWidget = startCell.ownerTable.combineWidget(this.viewer) as TableWidget;
        let appliedFormat: WCellFormat;
        for (let k: number = startCell.columnIndex; k <= endCell.columnIndex; k++) {
            cells = this.getSelectedCellInColumn(startCell.ownerTable, startCell.ownerRow.rowIndex, k, endCell.ownerRow.rowIndex);
            for (let i: number = 0; i < cells.length; i++) {
                appliedFormat = this.applyCellPropertyValue(this.viewer.selection, property, value, cells[i].cellFormat);
            }
        }
        this.updateGridForTableDialog(table, false);
    }
    /**
     * @private
     */
    public getSelectedCellInColumn(table: TableWidget, rowStartIndex: number, columnIndex: number, rowEndIndex: number): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        for (let i: number = rowStartIndex; i <= rowEndIndex; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                if ((row.childWidgets[j] as TableCellWidget).columnIndex === columnIndex) {
                    cells.push(row.childWidgets[j] as TableCellWidget);
                }
            }
        }
        return cells;
    }
    private getColumnCells(table: TableWidget, columnIndex: number, isLeftSideCollection: boolean): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        for (let k: number = 0; k < table.childWidgets.length; k++) {
            let row: TableRowWidget = table.childWidgets[k] as TableRowWidget;
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
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
    /**
     * @private
     */
    public getTableWidth(table: TableWidget): number {
        if (table.tableFormat.preferredWidth !== 0 || table.tableFormat.preferredWidthType === 'Percent') {
            if (table.tableFormat.preferredWidthType === 'Auto' || table.tableFormat.preferredWidthType === 'Point') {
                return table.tableFormat.preferredWidth;
            } else {
                if (table.tableFormat.preferredWidth === 0) {
                    return 0;
                } else {
                    return HelperMethods.convertPixelToPoint(this.viewer.clientArea.width) / 100 * table.tableFormat.preferredWidth;
                }
            }
        }
        return HelperMethods.convertPixelToPoint(this.viewer.layout.getTableWidth(table));
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
                // this.layoutRow((applyFormat.ownerBase as TableCellWidget).ownerRow, this.viewer, false);
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
     */
    public destroy(): void {
        this.viewer = undefined;
        this.nodes = [];
    }
    private isTocField(element: FieldElementBox): boolean {
        if (element instanceof FieldElementBox) {
            let nextElement: ElementBox = element.nextNode;
            if (element instanceof FieldElementBox && element.fieldType === 0 && nextElement instanceof TextElementBox
                && nextElement.text.trim().toLowerCase().indexOf('toc') === 0) {
                return true;
            }
        }
        return false;
    }
    /**
     * Updates the table of contents.
     * @private
     */
    public updateToc(tocField?: FieldElementBox): void {
        if (isNullOrUndefined(tocField)) {
            tocField = this.selection.getTocFieldInternal();
        }
        if (!this.isTocField(tocField)) {
            return;
        }
        // Decode field code to get parameters
        let code: string = this.selection.getFieldCode(tocField);
        if (code.toLocaleLowerCase().indexOf('toc') !== -1) {
            this.insertTableOfContents(this.validateTocSettings(this.getTocSettings(code, tocField)));
        }

    }
    private getTocSettings(code: string, tocField: FieldElementBox): TableOfContentsSettings {
        let tocSettings: TableOfContentsSettings = {};
        tocSettings.includePageNumber = true;
        tocSettings.rightAlign = true;
        // Decode field code to get parameters

        if (code.toLowerCase() === 'toc \\mergeformat') {
            tocSettings.startLevel = 1;
            tocSettings.endLevel = 3;
        } else {
            let swtiches: string[] = code.split('\\');
            for (let i: number = 0; i < swtiches.length; i++) {
                let swtch: string = swtiches[i];
                if (swtch.length === 0) {
                    continue;
                }
                switch (swtch[0]) {
                    case 'o':
                        if (!isNullOrUndefined(swtch.match(/\d+/g))) {
                            let levels: number[] = swtch.match(/\d+/g).map(Number);
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
        let tabs: WTabStop[] = tocField.paragraph.paragraphFormat.getUpdatedTabs();
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
        let levels: string[] = tSwitch.split(',');
        for (let index: number = 0; index < levels.length; index++) {
            tocSettings.levelSettings[levels[index]] = parseInt(levels[index + 1], 10);
            index++;
        }
    }
    /**
     * Inserts, modifies or updates the table of contents based on given settings.
     * @param {TableOfContentsSettings} tableOfContentsSettings
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
            this.selection.end.setPositionForSelection(tocField.fieldEnd.line, tocField.fieldEnd, 2, this.selection.end.location);
            this.onDelete();
        }
        // Build TOC field code based on parameter
        code = this.constructTocFieldCode(tableOfContentsSettings);
        let isStartParagraph: boolean = this.selection.start.isAtParagraphStart;
        let blockInfo: ParagraphInfo = this.getParagraphInfo(this.selection.start);
        let initialStart: string = this.getHierarchicalIndex(blockInfo.paragraph, blockInfo.offset.toString());

        // Build TOC fields
        // tslint:disable-next-line:max-line-length
        let widgets: ParagraphWidget[] = this.buildToc(this.validateTocSettings(tableOfContentsSettings), code, true, isStartParagraph);
        if (widgets.length > 0) {
            let tocLastPara: ParagraphWidget = new ParagraphWidget();
            let tocLastLine: LineWidget = new LineWidget(tocLastPara);
            tocLastPara.childWidgets.push(tocLastLine);
            let index: number = 0;
            if (!isStartParagraph) {
                index = 1;
            }
            let line: LineWidget = widgets[index].childWidgets[0] as LineWidget;
            let fieldBegin: FieldElementBox = line.children[0] as FieldElementBox;
            this.appendEndField(fieldBegin, tocLastLine);
            widgets.push(tocLastPara);
            this.appendEmptyPara(widgets);
        }

        this.setPositionForCurrentIndex(this.selection.start, initialStart);
        this.selection.end.setPositionInternal(this.selection.start);
        this.pasteContentsInternal(widgets);
        this.isInsertingTOC = false;
        this.updatePageRef();
        if (this.editorHistory) {
            this.editorHistory.updateComplexHistoryInternal();
        }
    }

    private appendEmptyPara(widgets: ParagraphWidget[]): void {
        let emptyPara: ParagraphWidget = new ParagraphWidget();
        let emptyLine: LineWidget = new LineWidget(emptyPara);
        emptyPara.childWidgets.push(emptyLine);
        widgets.push(emptyPara);
    }

    private constructTocFieldCode(tocSettings: TableOfContentsSettings): string {
        let tocFieldCode: string = 'TOC';
        //appends styles level
        // tslint:disable-next-line:max-line-length
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
        let tSwitch: string = this.constructTSwitch(tocSettings);
        if (tSwitch.length > 6) {
            tocFieldCode = tocFieldCode + tSwitch;
        }
        return tocFieldCode;
    }

    private constructTSwitch(tocSettings: TableOfContentsSettings): string {
        let tSwitch: string = '';
        let prefix: string = ' \\t ';
        if (!isNullOrUndefined(tocSettings.levelSettings)) {
            for (let key of Object.keys(tocSettings.levelSettings)) {
                tSwitch = tSwitch + key + ',' + tocSettings.levelSettings[key].toString() + ',';
            }
        }
        tSwitch = tSwitch.slice(0, -1);
        tSwitch = prefix + '"' + tSwitch + '"';
        return tSwitch;
    }

    /**
     * Appends the end filed to the given line.
     */
    private appendEndField(fieldBegin: FieldElementBox, lineWidget: LineWidget): void {
        let fieldEnd: FieldElementBox = new FieldElementBox(1);
        fieldEnd.fieldSeparator = fieldBegin.fieldSeparator;
        fieldBegin.fieldSeparator.fieldEnd = fieldEnd;
        fieldEnd.fieldBegin = fieldBegin;
        fieldEnd.fieldBegin.fieldEnd = fieldEnd;
        fieldEnd.line = lineWidget;
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
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public buildToc(tocSettings: TableOfContentsSettings, fieldCode: string, isFirstPara: boolean, isStartParagraph?: boolean): ParagraphWidget[] {
        let tocDomBody: BodyWidget = this.viewer.pages[0].bodyWidgets[0];
        let widgets: ParagraphWidget[] = [];
        this.createHeadingLevels(tocSettings);
        if (tocSettings.includeOutlineLevels) {
            this.createOutlineLevels(tocSettings);
        }

        let widget: IWidget = tocDomBody.childWidgets[0];
        while (widget !== undefined) {
            // tslint:disable-next-line:max-line-length
            if (widget instanceof ParagraphWidget && (this.isHeadingStyle(widget) || (tocSettings.includeOutlineLevels && this.isOutlineLevelStyle(widget)))) {
                let bookmarkName: string = this.insertTocBookmark(widget);
                // tslint:disable-next-line:max-line-length
                this.createTOCWidgets(widget, widgets, fieldCode, bookmarkName, tocSettings, isFirstPara, isStartParagraph);
                isFirstPara = false;
            }
            widget = this.selection.getNextParagraphBlock(widget as ParagraphWidget);
        }
        this.tocStyles = {};
        return widgets;
    }

    private createOutlineLevels(settings: TableOfContentsSettings): void {
        for (let i: number = settings.startLevel; i <= settings.endLevel; i++) {
            let levelStyle: string = 'Level' + i.toString();
            if (isNullOrUndefined(this.tocStyles[levelStyle])) {
                this.tocStyles[levelStyle] = i;
            }
        }
    }
    /**
     * Creates TOC heading styles
     * @param start - lower heading level
     * @param end - higher heading level
     */
    private createHeadingLevels(settings: TableOfContentsSettings): void {
        let normalStyle: string = 'Normal';
        for (let i: number = settings.startLevel; i <= settings.endLevel; i++) {
            let headingStyle: string = 'Heading ' + i.toString();
            if (isNullOrUndefined(this.tocStyles[headingStyle])) {
                this.tocStyles[headingStyle] = i;
            }
        }
        if (!isNullOrUndefined(settings.levelSettings)) {
            for (let key of Object.keys(settings.levelSettings)) {
                this.tocStyles[key] = settings.levelSettings[key];
            }
        }
    }

    /**
     * Checks the current style is heading style.
     */
    private isHeadingStyle(para: ParagraphWidget): boolean {
        let style: WStyle = (para.paragraphFormat.baseStyle as WStyle);
        if (style !== undefined) {
            return isNullOrUndefined(this.tocStyles[style.name]) ? false : true;
        }
        return false;
    }

    private isOutlineLevelStyle(para: ParagraphWidget): boolean {
        let styleName: OutlineLevel = para.paragraphFormat.outlineLevel;
        return isNullOrUndefined(this.tocStyles[styleName]) ? false : true;
    }

    /**
     * Creates TOC field element.
     */
    private createTocFieldElement(lineWidget: LineWidget, fieldCode: string): FieldElementBox {
        //begin
        let fieldBegin: FieldElementBox = new FieldElementBox(0);
        fieldBegin.hasFieldEnd = true;
        fieldBegin.line = lineWidget;
        lineWidget.children.push(fieldBegin);
        //format toc
        let textElement: TextElementBox = new TextElementBox();
        textElement.text = fieldCode;
        textElement.line = lineWidget;
        lineWidget.children.push(textElement);
        //field separator
        let fieldSeparator: FieldElementBox = new FieldElementBox(2);
        fieldSeparator.fieldBegin = fieldBegin;
        fieldSeparator.fieldBegin.fieldSeparator = fieldSeparator;
        fieldSeparator.line = lineWidget;
        lineWidget.children.push(fieldSeparator);
        return fieldBegin;
    }

    /**
     * Updates TOC para
     */
    // tslint:disable-next-line:max-line-length
    private createTOCWidgets(widget: ParagraphWidget, widgets: ParagraphWidget[], fieldCode: string, bookmarkName: string, tocSettings: TableOfContentsSettings, isFirstPara?: boolean, isStartParagraph?: boolean): void {
        let fieldBegin: FieldElementBox = undefined;
        let tocPara: ParagraphWidget = undefined;
        let tocLine: LineWidget = undefined;

        // tslint:disable-next-line:max-line-length
        if (widgets.length === 1 && (widgets[0].childWidgets[0] as LineWidget).children.length === 3 && !isNullOrUndefined(isFirstPara) && !isFirstPara) {
            tocLine = widgets[0].childWidgets[0] as LineWidget;
        } else {
            tocPara = new ParagraphWidget();
            let styleName: string = undefined;
            //Adds toc syles into paragraph
            let headingStyleName: string = widget.paragraphFormat.baseStyle.name;
            if (tocSettings.includeOutlineLevels && isNullOrUndefined(this.tocStyles[headingStyleName])) {
                styleName = widget.paragraphFormat.outlineLevel;
            } else {
                styleName = headingStyleName;
            }
            let tocStyleName: string = 'Toc' + this.tocStyles[styleName];
            let paraStyle: Object = this.viewer.styles.findByName(tocStyleName, 'Paragraph');
            if (isNullOrUndefined(paraStyle)) {
                // tslint:disable-next-line:max-line-length
                this.viewer.owner.parser.parseStyle(JSON.parse(this.getCompleteStyles()), JSON.parse(this.viewer.preDefinedStyles.get(tocStyleName)), this.viewer.styles);
                paraStyle = this.viewer.styles.findByName(tocStyleName, 'Paragraph');
            }
            tocPara.paragraphFormat.ApplyStyle(paraStyle as WParagraphStyle);
            //Creates right tab for page number.
            if (tocSettings.rightAlign && tocSettings.includePageNumber) {
                let tabStop: WTabStop = new WTabStop();
                tabStop.position = HelperMethods.convertPixelToPoint(this.viewer.clientArea.width);
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
            }
            this.createTocFieldElement(tocLine, fieldCode);
        }
        let text: string = '';
        for (let lineIndex: number = 0; lineIndex < widget.childWidgets.length; lineIndex++) {
            let lineWidget: LineWidget = widget.childWidgets[lineIndex] as LineWidget;
            for (let elementIndex: number = 0; elementIndex < lineWidget.children.length; elementIndex++) {
                let element: ElementBox = lineWidget.children[elementIndex];
                if (element instanceof TextElementBox || element instanceof ListTextElementBox) {
                    let temp: string = element.text;
                    let tabChar: string = '\t';
                    if (temp.indexOf(tabChar) !== -1) {
                        temp = temp.replace(new RegExp(tabChar, 'g'), ' ');
                    }
                    text = text + temp;
                }
            }
        }
        if (text !== '') {
            // inserts hyperlink
            if (tocSettings.includeHyperlink && (bookmarkName !== undefined)) {
                fieldBegin = this.insertTocHyperlink(tocLine, bookmarkName, text);
            } else {
                let span: TextElementBox = new TextElementBox();
                span.text = text;
                span.line = tocLine;
                tocLine.children.push(span);
            }
            //inserts page number
            if (tocSettings.includePageNumber && (bookmarkName !== undefined)) {
                if (tocSettings.rightAlign) {
                    let tabText: TabElementBox = new TabElementBox();
                    tabText.text = '\t';
                    tabText.line = tocLine;
                    tocLine.children.push(tabText);
                }
                let pageField: FieldElementBox = this.insertTocPageNumber(bookmarkName, tocLine, tocSettings.rightAlign, widget);
                this.appendEndField(pageField, tocLine);
            }
            if (tocSettings.includeHyperlink && fieldBegin !== undefined) {
                this.appendEndField(fieldBegin, tocLine);
            }
        }
        if (!isNullOrUndefined(tocPara) && (text !== '' || isFirstPara)) {
            widgets.push(tocPara);
        }
    }

    /**
     * Inserts toc hyperlink.
     */
    private insertTocHyperlink(lineWidget: LineWidget, bookmarkName: string, text: string): FieldElementBox {
        let fieldCode: string = ' HYPERLINK \\l \"' + bookmarkName + '\" ';
        let fieldBegin: FieldElementBox = this.createTocFieldElement(lineWidget, fieldCode);

        //text element.
        let span: TextElementBox = new TextElementBox();
        span.text = text;
        span.line = lineWidget;
        lineWidget.children.push(span);
        return fieldBegin;
    }

    /**
     * Inserts toc page number.
     */
    // tslint:disable-next-line:max-line-length
    private insertTocPageNumber(bookMarkname: string, lineWidget: LineWidget, isRightAlign: boolean, widget: ParagraphWidget): FieldElementBox {
        let fieldCode: string = ' PAGEREF' + bookMarkname + ' \\h ';
        let fieldBegin: FieldElementBox = this.createTocFieldElement(lineWidget, fieldCode);
        let text: string = (this.viewer.pages.indexOf(widget.bodyWidget.page) + 1).toString();
        //text element.
        let span: FieldTextElementBox = new FieldTextElementBox();
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
        for (let key of Object.keys(this.pageRefFields)) {
            let bookmark: BookmarkElementBox = this.viewer.bookmarks.get(key);
            let pageRef: string = (bookmark.paragraph.bodyWidget.page.index + 1).toString();
            let span: FieldTextElementBox = this.pageRefFields[key];
            if (pageRef !== span.text) {
                span.text = pageRef;
                let paragraph: ParagraphWidget = span.paragraph;
                let lineIndex: number = paragraph.childWidgets.indexOf(span.line);
                let elementIndex: number = span.line.children.indexOf(span);
                this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
            }
        }
    }
    /**
     * Inserts toc bookmark.
     */
    private insertTocBookmark(widget: ParagraphWidget): string {
        let bookmarkName: string = undefined;
        let lineLength: number = widget.childWidgets.length;
        if (lineLength > 0) {
            let startLine: LineWidget = widget.childWidgets[0] as LineWidget;
            let endLine: LineWidget = widget.childWidgets[lineLength - 1] as LineWidget;
            if ((startLine !== undefined) && (endLine !== undefined)) {
                let startElement: ElementBox = startLine.children[0];
                //Returns the bookmark if already present for paragraph.
                // tslint:disable-next-line:max-line-length
                if (!isNullOrUndefined(startElement) && startElement instanceof BookmarkElementBox && (startElement as BookmarkElementBox).bookmarkType === 0 && ((startElement as BookmarkElementBox).name.toLowerCase().match('^_toc'))) {
                    return (startElement as BookmarkElementBox).name;
                }
                let endElement: ElementBox = endLine.children[endLine.children.length - 1];
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

    /**
     * Generates bookmark id.
     */
    private generateBookmarkName(): string {
        this.tocBookmarkId++;
        let count: number = 10 - this.tocBookmarkId.toString().length;
        let formatString: string = '';
        while (count - 1 > 0) {
            formatString = '0' + formatString;
            count--;
        }
        let bookmarkName: string = '_Toc' + formatString + this.tocBookmarkId;
        return bookmarkName;
    }

    /**
     * Change cell content alignment 
     * @private
     */
    public onCellContentAlignment(verticalAlignment: CellVerticalAlignment, textAlignment: TextAlignment): void {
        this.owner.isShiftingEnabled = true;
        let selection: Selection = this.owner.selection;
        if (selection.isEmpty && selection.start.paragraph.isInsideTable) {
            if (this.owner.editorHistory) {
                this.owner.editorHistory.initComplexHistory(selection, 'MultiSelection');
            }
            //Selecting the table cell to update the all the paragraph format.
            selection.selectTableCell();
            this.initHistory('CellContentVerticalAlignment');
            let cellFormat: WCellFormat = selection.start.paragraph.associatedCell.cellFormat;
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

}
/**
 * @private
 */
export interface SelectionInfo {
    start: TextPosition;
    end: TextPosition;
    startElementInfo: ElementInfo;
    endElementInfo: ElementInfo;
    isEmpty: boolean;
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