import { DocumentEditor } from '../../document-editor';
import {
    Rect, Margin, IWidget, Widget, BodyWidget, TableRowWidget, TableWidget,
    LineWidget, TextElementBox, ListTextElementBox, ImageElementBox, Page, ParagraphWidget, TableCellWidget,
    FieldElementBox, BlockWidget, HeaderFooterWidget, BlockContainer, BookmarkElementBox, ElementBox, HeaderFooters,
    EditRangeStartElementBox, EditRangeEndElementBox, TabElementBox, CommentElementBox, CommentCharacterElementBox
} from '../viewer/page';
import {
    ElementInfo, CaretHeightInfo, IndexInfo, SizeInfo,
    FirstElementInfo, HelperMethods, HyperlinkTextInfo, LineInfo, Point
} from '../editor/editor-helper';
import {
    SelectionCharacterFormat, SelectionCellFormat, SelectionParagraphFormat,
    SelectionRowFormat, SelectionSectionFormat, SelectionTableFormat, SelectionImageFormat
} from './selection-format';
import { TextSizeInfo } from '../viewer/text-helper';
import { PageLayoutViewer, LayoutViewer, DocumentHelper, WebLayoutViewer } from '../index';
import { isNullOrUndefined, createElement, L10n } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import {
    LineSpacingType, BaselineAlignment, HighlightColor,
    Strikethrough, Underline, TextAlignment
} from '../../base/index';
import { TextPositionInfo, PositionInfo, ParagraphInfo } from '../editor/editor-helper';
import { WCharacterFormat, WParagraphFormat, WStyle, WParagraphStyle, WSectionFormat } from '../index';
import { HtmlExport } from '../writer/html-export';
import { Popup } from '@syncfusion/ej2-popups';
import { ContextType, RequestNavigateEventArgs } from '../../index';
import { TextPosition, SelectionWidgetInfo, Hyperlink, ImageFormat } from './selection-helper';
import { ItemModel, MenuEventArgs, DropDownButton } from '@syncfusion/ej2-splitbuttons';
/**
 * Selection 
 */
export class Selection {
    /**
     * @private
     */
    public owner: DocumentEditor;
    /**
     * @private
     */
    public upDownSelectionLength: number = 0;
    /**
     * @private
     */
    public isSkipLayouting: boolean = false;
    /**
     * @private
     */
    public isImageSelected: boolean = false;
    private documentHelper: DocumentHelper;
    private contextTypeInternal: ContextType = undefined;
    /**
     * @private
     */
    public caret: HTMLDivElement = undefined;
    //Format Retrieval Field
    /**
     * @private
     */
    public isRetrieveFormatting: boolean = false;
    private characterFormatIn: SelectionCharacterFormat;
    private paragraphFormatIn: SelectionParagraphFormat;
    private sectionFormatIn: SelectionSectionFormat;
    private tableFormatIn: SelectionTableFormat;
    private cellFormatIn: SelectionCellFormat;
    private rowFormatIn: SelectionRowFormat;
    private imageFormatInternal: SelectionImageFormat;
    /**
     * @private
     */
    public skipFormatRetrieval: boolean = false;
    private startInternal: TextPosition;
    private endInternal: TextPosition;
    private htmlWriterIn: HtmlExport;

    private toolTipElement: HTMLElement;
    private toolTipObject: Popup;
    private toolTipField: FieldElementBox;
    private isMoveDownOrMoveUp: boolean = false;
    private pasteDropDwn: DropDownButton;
    /**
     * @private
     */
    public pasteElement: HTMLElement;
    /**
     * @private
     */
    public isViewPasteOptions: boolean = false;
    /**
     * @private
     */
    public skipEditRangeRetrieval: boolean = false;

    /**
     * @private
     */
    public editPosition: string;
    /**
     * @private
     */
    public selectedWidgets: Dictionary<IWidget, object> = undefined;
    /**
     * @private
     */
    public isHighlightEditRegionIn: boolean = false;
    /**
     * @private
     */
    public editRangeCollection: EditRangeStartElementBox[];
    /**
     * @private
     */
    public isHightlightEditRegionInternal: boolean = false;
    /**
     * @private
     */
    public isCurrentUser: boolean = false;
    /**
     * @private
     */
    public isHighlightNext: boolean = false;
    /**
     * @private
     */
    public hightLightNextParagraph: BlockWidget;
    /**
     * @private
     */
    public isWebLayout: boolean = false;
    /**
     * @private
     */
    public editRegionHighlighters: Dictionary<LineWidget, SelectionWidgetInfo[]> = undefined;
    /**
     * @private
     */
    get isHighlightEditRegion(): boolean {
        return this.isHighlightEditRegionIn;
    }
    /**
     * @private
     */
    set isHighlightEditRegion(value: boolean) {
        this.isHighlightEditRegionIn = value;
        this.onHighlight();
    }
    /**
     * @private
     */
    get htmlWriter(): HtmlExport {
        if (isNullOrUndefined(this.htmlWriterIn)) {
            this.htmlWriterIn = new HtmlExport();
        }
        return this.htmlWriterIn;
    }
    /**
     * Gets the start text position of last range in the selection
     * @returns {TextPosition}
     * @private
     */
    get start(): TextPosition {
        if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.viewer)) {
            if (isNullOrUndefined(this.startInternal)) {
                this.startInternal = this.owner.documentStart;
            }
            return this.startInternal;
        }
        return undefined;
    }
    /**
     * @private
     */
    set start(value: TextPosition) {
        this.startInternal = value;
    }
    //Format retrieval properties
    /**
     * Gets the instance of selection character format.
     * @default undefined
     * @aspType SelectionCharacterFormat
     * @blazorType SelectionCharacterFormat
     * @return {SelectionCharacterFormat}
     */
    public get characterFormat(): SelectionCharacterFormat {
        return this.characterFormatIn;
    }
    /**
     * Gets the instance of selection paragraph format.
     * @default undefined
     * @aspType SelectionParagraphFormat
     * @blazorType SelectionParagraphFormat
     * @return {SelectionParagraphFormat}
     */
    public get paragraphFormat(): SelectionParagraphFormat {
        return this.paragraphFormatIn;
    }
    /**
     * Gets the instance of selection section format.
     * @default undefined
     * @aspType SelectionSectionFormat
     * @blazorType SelectionSectionFormat
     * @return {SelectionSectionFormat}
     */
    public get sectionFormat(): SelectionSectionFormat {
        return this.sectionFormatIn;
    }
    /**
     * Gets the instance of selection table format.
     * @default undefined
     * @aspType SelectionTableFormat
     * @blazorType SelectionTableFormat
     * @return {SelectionTableFormat}
     */
    public get tableFormat(): SelectionTableFormat {
        return this.tableFormatIn;
    }
    /**
     * Gets the instance of selection cell format.
     * @default undefined
     * @aspType SelectionCellFormat
     * @blazorType SelectionCellFormat
     * @return {SelectionCellFormat}
     */
    public get cellFormat(): SelectionCellFormat {
        return this.cellFormatIn;
    }
    /**
     * Gets the instance of selection row format.
     * @default undefined
     * @aspType SelectionRowFormat
     * @blazorType SelectionRowFormat
     * @returns {SelectionRowFormat}
     */
    public get rowFormat(): SelectionRowFormat {
        return this.rowFormatIn;
    }
    /**
     * Gets the instance of selection image format.
     * @default undefined
     * @aspType SelectionImageFormat
     * @blazorType SelectionImageFormat
     * @returns {SelectionImageFormat}
     */
    public get imageFormat(): SelectionImageFormat {
        return this.imageFormatInternal;
    }
    /**
     * Gets the start text position of selection range.
     * @private
     */
    get end(): TextPosition {
        return this.endInternal;
    }
    /**
     * Gets the page number where the selection ends.
     */
    public get startPage(): number {
        if (!this.owner.isDocumentLoaded || isNullOrUndefined(this.viewer)
            || this.viewer instanceof WebLayoutViewer || isNullOrUndefined(this.documentHelper.selectionStartPage)) {
            return 1;
        }
        return this.documentHelper.pages.indexOf(this.documentHelper.selectionStartPage) + 1;
    }
    /**
     * Gets the page number where the selection ends.
     */
    public get endPage(): number {
        if (!this.owner.isDocumentLoaded || isNullOrUndefined(this.viewer)
            || this.viewer instanceof WebLayoutViewer || isNullOrUndefined(this.documentHelper.selectionEndPage)) {
            return 1;
        }
        return this.documentHelper.pages.indexOf(this.documentHelper.selectionEndPage) + 1;
    }
    /**
     * For internal use
     * @private
     */
    set end(value: TextPosition) {
        this.endInternal = value;
    }

    /**
     * Determines whether the selection direction is forward or not.
     * @default false
     * @returns {boolean}
     * @private
     */
    get isForward(): boolean {
        return this.start.isExistBefore(this.end);
    }
    /**
     * Determines whether the start and end positions are same or not.
     * @default false
     * @returns {boolean}
     * @private
     */
    get isEmpty(): boolean {
        if (isNullOrUndefined(this.start)) {
            return true;
        }
        return this.start.isAtSamePosition(this.end);
    }
    /**
     * Returns start hierarchical index.
     */
    get startOffset(): string {
        return this.getHierarchicalIndexByPosition(this.start);
    }
    /**
     * Returns end hierarchical index.
     */
    get endOffset(): string {
        return this.getHierarchicalIndexByPosition(this.end);
    }
    /**
     * Gets the text within selection.
     * @default ''
     * @aspType string
     * @blazorType string
     * @returns {string}
     */
    public get text(): string {
        return this.getText(false);
    }
    /**
     * Gets the context type of the selection.
     */
    public get contextType(): ContextType {
        return this.contextTypeInternal;
    }
    /**
     * Gets bookmark name collection.
     */
    public get bookmarks(): string[] {
        return this.getSelBookmarks();
    }
    /**
     * @private
     */
    get isCleared(): boolean {
        return isNullOrUndefined(this.end);
    }
    /**
     * Returns true if selection is in field 
     */
    public get isInField(): boolean {
        if (!isNullOrUndefined(this.getHyperlinkField(true))) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    constructor(documentEditor: DocumentEditor) {
        this.owner = documentEditor;
        this.documentHelper = this.owner.documentHelper;
        this.start = new TextPosition(this.owner);
        this.end = new TextPosition(this.owner);
        this.selectedWidgets = new Dictionary<IWidget, object>();
        this.characterFormatIn = new SelectionCharacterFormat(this);
        this.paragraphFormatIn = new SelectionParagraphFormat(this, this.documentHelper);
        this.sectionFormatIn = new SelectionSectionFormat(this);
        this.rowFormatIn = new SelectionRowFormat(this);
        this.cellFormatIn = new SelectionCellFormat(this);
        this.tableFormatIn = new SelectionTableFormat(this);
        this.imageFormatInternal = new SelectionImageFormat(this);
        this.editRangeCollection = [];
        this.editRegionHighlighters = new Dictionary<LineWidget, SelectionWidgetInfo[]>();
    }
    private getSelBookmarks(): string[] {
        let bookmarkCln: string[] = [];
        let bookmarks: Dictionary<string, BookmarkElementBox> = this.documentHelper.bookmarks;
        let start: TextPosition = this.start;
        let end: TextPosition = this.end;
        if (!this.isForward) {
            start = this.end;
            end = this.start;
        }
        let bookmrkStart: BookmarkElementBox;
        let bookmrkEnd: BookmarkElementBox;
        let isCellSelected: boolean = false;
        let selectedCells: TableCellWidget[] = this.getSelectedCells();
        for (let i: number = 0; i < bookmarks.length; i++) {
            if (bookmarks.keys[i].indexOf('_') !== 0) {
                bookmrkStart = bookmarks.get(bookmarks.keys[i]);
                bookmrkEnd = bookmrkStart.reference;
                let bmStartPos: TextPosition = this.getElementPosition(bookmrkStart).startPosition;
                let bmEndPos: TextPosition = this.getElementPosition(bookmrkEnd).startPosition;
                if (bmStartPos.paragraph.isInsideTable || bmEndPos.paragraph.isInsideTable) {
                    if (selectedCells.length > 0) {
                        if (selectedCells.indexOf(bmStartPos.paragraph.associatedCell) >= 0
                            || selectedCells.indexOf(bmEndPos.paragraph.associatedCell) >= 0) {
                            isCellSelected = true;
                        } else {
                            isCellSelected = false;
                            if (selectedCells.indexOf(bmStartPos.paragraph.associatedCell) < 0
                                || selectedCells.indexOf(bmEndPos.paragraph.associatedCell) < 0) {
                                let endCell: TableCellWidget = end.paragraph.isInsideTable && end.paragraph.associatedCell;
                                let bmEndPosCell: TableCellWidget = bmEndPos.paragraph.associatedCell;
                                if (endCell && bmEndPosCell && endCell.ownerTable.equals(bmEndPosCell.ownerTable) &&
                                    !(endCell.ownerTable
                                        && selectedCells.indexOf(this.getCellInTable(endCell.ownerTable, bmEndPosCell)) >= 0)) {
                                    continue;
                                }
                            }
                        }
                    } else {
                        isCellSelected = false;
                    }
                } else {
                    isCellSelected = false;
                }
                if ((start.isExistAfter(bmStartPos) || start.isAtSamePosition(bmStartPos))
                    && (end.isExistBefore(bmEndPos) || end.isAtSamePosition(bmEndPos)) ||
                    ((bmStartPos.isExistAfter(start) || bmStartPos.isAtSamePosition(start))
                        && (bmEndPos.isExistBefore(end) || bmEndPos.isAtSamePosition(end))) ||
                    (bmStartPos.isExistAfter(start) && bmStartPos.isExistBefore(end)
                        && (end.isExistAfter(bmEndPos) || end.isExistBefore(bmEndPos))) ||
                    (bmEndPos.isExistBefore(end) && bmEndPos.isExistAfter(start)
                        && (start.isExistBefore(bmStartPos) || start.isExistAfter(bmStartPos))) || isCellSelected) {
                    bookmarkCln.push(bookmrkStart.name);
                }
            }
        }
        return bookmarkCln;
    }
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }

    private getModuleName(): string {
        return 'Selection';
    }
    private checkLayout(): void {
        if (this.owner.layoutType === 'Continuous') {
            this.isWebLayout = true;
            this.documentHelper.isHeaderFooter = true;
            this.owner.layoutType = 'Pages';
            this.owner.viewer.destroy();
            this.owner.viewer = new PageLayoutViewer(this.owner);
            this.owner.editor.layoutWholeDocument();
        }
    }
    //Public API
    /**
     * Moves the selection to the header of current page.
     */
    public goToHeader(): void {
        this.checkLayout();
        this.owner.enableHeaderAndFooter = true;
        this.enableHeadersFootersRegion(this.start.paragraph.bodyWidget.page.headerWidget);
        this.isWebLayout = false;
    }
    /**
     * Moves the selection to the footer of current page.
     */
    public goToFooter(): void {
        this.checkLayout();
        this.owner.enableHeaderAndFooter = true;
        this.enableHeadersFootersRegion(this.start.paragraph.bodyWidget.page.footerWidget);
        this.isWebLayout = false;
    }
    /**
     * Closes the header and footer region.
     */
    public closeHeaderFooter(): void {
        this.disableHeaderFooter();
        if (this.documentHelper.isHeaderFooter && this.owner.layoutType === 'Pages') {
            this.owner.layoutType = 'Continuous';
            this.documentHelper.isHeaderFooter = false;
        }
    }
    /**
     * Moves the selection to the start of specified page number.
     */
    public goToPage(pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= this.owner.documentHelper.pages.length) {
            let page: Page = this.owner.documentHelper.pages[pageNumber - 1];
            this.updateTextPositionForBlockContainer(page.bodyWidgets[0]);
        }
    }
    /**
     * Selects the entire table if the context is within table.
     */
    public selectTable(): void {
        if (!this.owner.enableSelection) {
            return;
        }
        this.selectTableInternal();
    }
    /**
     * Selects the entire row if the context is within table.
     */
    public selectRow(): void {
        if (!this.owner.enableSelection) {
            return;
        }
        this.selectTableRow();
    }
    /**
     * Selects the entire column if the context is within table.
     */
    public selectColumn(): void {
        if (!this.owner.enableSelection) {
            return;
        }
        this.selectColumnInternal();
    }
    /**
     * Selects the entire cell if the context is within table.
     */
    public selectCell(): void {
        if (!this.owner.enableSelection) {
            return;
        }
        this.selectTableCell();
    }
    /**
     * Selects content based on selection settings
     */
    public select(selectionSettings: SelectionSettings): void;
    /**
     * Selects content based on start and end hierarchical index.
     * @param start start hierarchical index.
     * @param end end hierarchical index.
     */
    public select(start: string, end: string): void;

    public select(selectionSettings: SelectionSettings | string, startOrEnd?: string): void {
        if (typeof (selectionSettings) === 'string') {
            let startPosition: TextPosition = this.getTextPosBasedOnLogicalIndex(selectionSettings);
            let endPosition: TextPosition = this.getTextPosBasedOnLogicalIndex(startOrEnd);
            this.selectPosition(startPosition, endPosition);
        } else {
            let point: Point = new Point(selectionSettings.x, selectionSettings.y);
            let pageCoordinates: Point = this.viewer.findFocusedPage(point, true);
            if (selectionSettings.extend) {
                this.moveTextPosition(pageCoordinates, this.end);
            } else {
                this.documentHelper.updateTextPositionForSelection(pageCoordinates, 1);
            }
        }
    }
    /**
     * Selects based on start and end hierarchical index.
     */
    public selectByHierarchicalIndex(start: string, end: string): void {
        let startPosition: TextPosition = this.getTextPosBasedOnLogicalIndex(start);
        let endPosition: TextPosition = this.getTextPosBasedOnLogicalIndex(end);
        this.selectPosition(startPosition, endPosition);
    }
    /**
     * Select the current field if selection is in field
     */
    public selectField(): void {
        if (this.isInField) {
            let fieldStart: FieldElementBox = this.getHyperlinkField(true);
            let fieldEnd: FieldElementBox = fieldStart.fieldEnd;
            let offset: number = fieldStart.line.getOffset(fieldStart, 0);
            let startPosition: TextPosition = new TextPosition(this.owner);
            startPosition.setPositionParagraph(fieldStart.line, offset);

            let endoffset: number = fieldEnd.line.getOffset(fieldEnd, 1);
            let endPosition: TextPosition = new TextPosition(this.owner);
            endPosition.setPositionParagraph(fieldEnd.line, endoffset);
            //selects the field range
            this.documentHelper.selection.selectRange(startPosition, endPosition);
        }
    }
    /**
     * Toggles the bold property of selected contents.
     * @private
     */
    public toggleBold(): void {
        if (this.owner.editorModule) {
            this.owner.editorModule.toggleBold();
        }
    }
    /**
     * Toggles the italic property of selected contents.
     * @private
     */
    public toggleItalic(): void {
        if (this.owner.editorModule) {
            this.owner.editorModule.toggleItalic();
        }
    }
    /**
     * Toggles the underline property of selected contents.
     * @param underline Default value of ‘underline’ parameter is Single.
     * @private
     */
    public toggleUnderline(underline?: Underline): void {
        if (this.owner.editor) {
            this.owner.editor.toggleUnderline(underline);
        }
    }
    /**
     * Toggles the strike through property of selected contents.
     * @param {Strikethrough} strikethrough Default value of strikethrough parameter is SingleStrike.
     * @private
     */
    public toggleStrikethrough(strikethrough?: Strikethrough): void {
        if (this.owner.editor) {
            this.owner.editor.toggleStrikethrough(strikethrough);
        }
    }
    /**
     * Toggles the highlight color property of selected contents.
     * @param {HighlightColor} highlightColor Default value of ‘underline’ parameter is Yellow.
     * @private
     */
    public toggleHighlightColor(highlightColor?: HighlightColor): void {
        if (this.owner.editor) {
            this.owner.editor.toggleHighlightColor(highlightColor);
        }
    }
    /**
     * Toggles the subscript formatting of selected contents.
     * @private
     */
    public toggleSubscript(): void {
        if (this.owner.editor) {
            this.owner.editor.toggleSubscript();
        }
    }
    /**
     * Toggles the superscript formatting of selected contents.
     * @private
     */
    public toggleSuperscript(): void {
        if (this.owner.editor) {
            this.owner.editor.toggleSuperscript();
        }
    }
    /**
     * Toggles the text alignment property of selected contents.
     * @param {TextAlignment} textAlignment Default value of ‘textAlignment parameter is TextAlignment.Left.
     * @private
     */
    public toggleTextAlignment(textAlignment: TextAlignment): void {
        if (this.owner.editor) {
            this.owner.editor.toggleTextAlignment(textAlignment);
        }
    }
    /**
     * Increases the left indent of selected paragraphs to a factor of 36 points.
     * @private
     */
    public increaseIndent(): void {
        if (this.owner.editor) {
            this.owner.editor.increaseIndent();
        }
    }
    /**
     * Decreases the left indent of selected paragraphs to a factor of 36 points.
     * @private
     */
    public decreaseIndent(): void {
        if (this.owner.editor) {
            this.owner.editor.decreaseIndent();
        }
    }

    /**
     * Fires the `requestNavigate` event if current selection context is in hyperlink.
     */
    public navigateHyperlink(): void {
        let fieldBegin: FieldElementBox = this.getHyperlinkField();
        if (fieldBegin) {
            this.fireRequestNavigate(fieldBegin);
        }
    }
    /**
     * Navigate Hyperlink
     * @param fieldBegin 
     * @private
     */
    public fireRequestNavigate(fieldBegin: FieldElementBox): void {
        let hyperlink: Hyperlink = new Hyperlink(fieldBegin, this);
        let eventArgs: RequestNavigateEventArgs = {
            isHandled: false,
            navigationLink: hyperlink.navigationLink,
            linkType: hyperlink.linkType,
            localReference: hyperlink.localReference,
            source: this.owner
        };
        this.owner.trigger('requestNavigate', eventArgs);
        if (!eventArgs.isHandled) {
            this.documentHelper.selection.navigateBookmark(hyperlink.localReference, true);
        }
    }
    /**
     * Copies the hyperlink URL if the context is within hyperlink.
     */
    public copyHyperlink(): void {
        let hyperLinkField: FieldElementBox = this.getHyperlinkField();
        let linkText: string = this.getLinkText(hyperLinkField);
        this.copyToClipboard(linkText);
    }
    private isHideSelection(paragraph: ParagraphWidget): boolean {
        let bodyWgt: BodyWidget = paragraph.bodyWidget;
        let sectionFormat: WSectionFormat = bodyWgt.sectionFormat;
        let pageHt: number = sectionFormat.pageHeight - sectionFormat.footerDistance;
        let headerFooterHt: number = bodyWgt.page.boundingRectangle.height / 100 * 40;
        return this.contextType.indexOf('Footer') >= 0
            && (paragraph.y + paragraph.height > HelperMethods.convertPointToPixel(pageHt))
            || this.contextType.indexOf('Header') >= 0 && paragraph.y + paragraph.height > headerFooterHt;
    }
    //Selection add, Highlight, remove API starts
    /**
     * @private
     */
    public highlightSelection(isSelectionChanged: boolean): void {
        if (this.owner.enableImageResizerMode) {
            this.owner.imageResizerModule.hideImageResizer();
        }
        if (this.isEmpty) {
            if (this.isHideSelection(this.start.paragraph)) {
                this.hideCaret();
                return;
            }
            this.updateCaretPosition();
        } else {
            if (this.isForward) {
                this.highlightSelectedContent(this.start, this.end);
            } else {
                this.highlightSelectedContent(this.end, this.start);
            }
            if (this.documentHelper.isComposingIME) {
                this.updateCaretPosition();
            }
        }
        this.documentHelper.updateTouchMarkPosition();
        if (isSelectionChanged) {
            this.documentHelper.scrollToPosition(this.start, this.end);
        }
    }
    /**
     * @private
     */
    public createHighlightBorder(lineWidget: LineWidget, width: number, left: number, top: number, isElementBoxHighlight: boolean): void {
        if (width < 0) {
            width = 0;
        }
        let page: Page = this.getPage(lineWidget.paragraph);
        let height: number = lineWidget.height;
        let widgets: Dictionary<IWidget, object> = this.selectedWidgets;
        let selectionWidget: SelectionWidgetInfo = undefined;
        let selectionWidgetCollection: SelectionWidgetInfo[] = undefined;
        if (this.isHightlightEditRegionInternal) {
            this.addEditRegionHighlight(lineWidget, left, width);
            return;
        } else {
            if (widgets.containsKey(lineWidget)) {
                if (widgets.get(lineWidget) instanceof SelectionWidgetInfo) {
                    selectionWidget = widgets.get(lineWidget) as SelectionWidgetInfo;
                    // if the line element has already added with SelectionWidgetInfo
                    // now its need to be added as ElementBox highlighting them remove it from dictionary and add it collection.
                    if (isElementBoxHighlight) {
                        widgets.remove(lineWidget);
                        selectionWidgetCollection = [];
                        widgets.add(lineWidget, selectionWidgetCollection);
                    }

                } else {
                    selectionWidgetCollection = widgets.get(lineWidget) as SelectionWidgetInfo[];
                }
            } else {
                if (isElementBoxHighlight) {
                    selectionWidgetCollection = [];
                    widgets.add(lineWidget, selectionWidgetCollection);
                } else {
                    selectionWidget = new SelectionWidgetInfo(left, width);
                    widgets.add(lineWidget, selectionWidget);
                }
            }
            if (selectionWidget === undefined) {
                selectionWidget = new SelectionWidgetInfo(left, width);
                widgets.add(lineWidget, selectionWidget);
            }
        }
        let documentHelper: DocumentHelper = this.owner.documentHelper;
        let pageTop: number = this.getPageTop(page);
        let pageLeft: number = page.boundingRectangle.x;
        if (this.viewer.containerTop <= pageTop
            || pageTop < this.viewer.containerTop + documentHelper.selectionCanvas.height) {
            let zoomFactor: number = documentHelper.zoomFactor;
            this.clipSelection(page, pageTop);
            if (this.documentHelper.isComposingIME) {
                // tslint:disable-next-line:max-line-length
                this.renderDashLine(documentHelper.selectionContext, page, lineWidget, (pageLeft + (left * zoomFactor)) - this.viewer.containerLeft, top, width * zoomFactor, height);
            } else {
                this.documentHelper.selectionContext.fillStyle = 'gray';
                documentHelper.selectionContext.globalAlpha = 0.4;
                // tslint:disable-next-line:max-line-length
                documentHelper.selectionContext.fillRect((pageLeft + (left * zoomFactor)) - this.viewer.containerLeft, (pageTop + (top * zoomFactor)) - this.viewer.containerTop, width * zoomFactor, height * zoomFactor);
            }
            documentHelper.selectionContext.restore();
        }
        if (isElementBoxHighlight) {
            selectionWidgetCollection.push(selectionWidget);
        }
    }
    /**
     * @private
     */
    public addEditRegionHighlight(lineWidget: LineWidget, left: number, width: number): SelectionWidgetInfo {
        let highlighters: SelectionWidgetInfo[] = undefined;
        let collection: Dictionary<LineWidget, SelectionWidgetInfo[]> = this.editRegionHighlighters;
        if (collection.containsKey(lineWidget)) {
            highlighters = collection.get(lineWidget);
        } else {
            highlighters = [];
            collection.add(lineWidget, highlighters);
        }
        let editRegionHighlight: SelectionWidgetInfo = new SelectionWidgetInfo(left, width);
        if (this.isCurrentUser) {
            editRegionHighlight.color = this.owner.userColor !== '' ? this.owner.userColor : '#FFFF00';
        }
        highlighters.push(editRegionHighlight);
        return editRegionHighlight;
    }
    /**
     * Create selection highlight inside table
     * @private
     */
    public createHighlightBorderInsideTable(cellWidget: TableCellWidget): void {
        let page: Page = this.getPage(cellWidget);
        let selectionWidget: SelectionWidgetInfo = undefined;
        let left: number = cellWidget.x - cellWidget.margin.left + cellWidget.leftBorderWidth;
        let width: number = cellWidget.width + cellWidget.margin.left
            + cellWidget.margin.right - cellWidget.leftBorderWidth - cellWidget.rightBorderWidth;
        let top: number = cellWidget.y;
        let height: number = cellWidget.height;
        let pageTop: number = this.getPageTop(page);
        let pageLeft: number = page.boundingRectangle.x;
        let isVisiblePage: boolean = this.viewer.containerTop <= pageTop
            || pageTop < this.viewer.containerTop + this.documentHelper.selectionCanvas.height;
        let widgets: Dictionary<IWidget, object> = this.selectedWidgets;
        if (!this.isHightlightEditRegionInternal) {
            if (widgets.containsKey(cellWidget) && widgets.get(cellWidget) instanceof SelectionWidgetInfo) {
                selectionWidget = widgets.get(cellWidget) as SelectionWidgetInfo;
                if (isVisiblePage) {
                    // tslint:disable-next-line:max-line-length
                    this.documentHelper.selectionContext.clearRect((pageLeft + (selectionWidget.left * this.documentHelper.zoomFactor) - this.viewer.containerLeft), (pageTop + (top * this.documentHelper.zoomFactor)) - this.viewer.containerTop, selectionWidget.width * this.documentHelper.zoomFactor, height * this.documentHelper.zoomFactor);
                }
            } else {
                selectionWidget = new SelectionWidgetInfo(left, width);
                if (widgets.containsKey(cellWidget)) {
                    widgets.remove(widgets.get(cellWidget));
                }
                widgets.add(cellWidget, selectionWidget);
            }
        }
        if (isVisiblePage) {
            this.documentHelper.selectionContext.fillStyle = 'gray';
            this.documentHelper.selectionContext.globalAlpha = 0.4;
            let zoomFactor: number = this.documentHelper.zoomFactor;
            this.clipSelection(page, pageTop);
            // tslint:disable-next-line:max-line-length
            this.documentHelper.selectionContext.fillRect((pageLeft + (left * zoomFactor)) - this.viewer.containerLeft, (pageTop + (top * zoomFactor)) - this.viewer.containerTop, width * zoomFactor, height * zoomFactor);
            this.documentHelper.selectionContext.restore();
        }
    }
    /**
     * @private
     */
    public clipSelection(page: Page, pageTop: number): void {
        let documentHelper: DocumentHelper = this.owner.documentHelper;
        let width: number;
        let height: number;
        if (this.viewer instanceof WebLayoutViewer && this.documentHelper.zoomFactor < 1) {
            width = page.boundingRectangle.width / this.documentHelper.zoomFactor;
            height = page.boundingRectangle.height / this.documentHelper.zoomFactor;
        } else {
            width = page.boundingRectangle.width * this.documentHelper.zoomFactor;
            height = page.boundingRectangle.height * this.documentHelper.zoomFactor;
        }
        let left: number = page.boundingRectangle.x;
        documentHelper.selectionContext.beginPath();
        documentHelper.selectionContext.save();
        // tslint:disable-next-line:max-line-length
        documentHelper.selectionContext.rect(left - this.viewer.containerLeft, pageTop - this.viewer.containerTop, width, height);
        documentHelper.selectionContext.clip();
    }

    /**
     * Add selection highlight
     * @private
     */
    public addSelectionHighlight(canvasContext: CanvasRenderingContext2D, widget: LineWidget, top: number): void {
        if (this.selectedWidgets.containsKey(widget)) {
            let height: number = widget.height;
            let widgetInfo: object = this.selectedWidgets.get(widget);
            let widgetInfoCollection: SelectionWidgetInfo[] = undefined;
            if (widgetInfo instanceof SelectionWidgetInfo) {
                widgetInfoCollection = [];
                widgetInfoCollection.push(widgetInfo as SelectionWidgetInfo);
            } else {
                widgetInfoCollection = widgetInfo as SelectionWidgetInfo[];
            }
            if (!isNullOrUndefined(widgetInfoCollection)) {
                for (let i: number = 0; i < widgetInfoCollection.length; i++) {
                    let width: number = this.documentHelper.render.getScaledValue(widgetInfoCollection[i].width);
                    let left: number = this.documentHelper.render.getScaledValue(widgetInfoCollection[i].left, 1);

                    let page: Page = this.owner.selection.getPage(widget.paragraph);
                    this.owner.selection.clipSelection(page, this.owner.selection.getPageTop(page));
                    if (this.documentHelper.isComposingIME) {
                        this.renderDashLine(canvasContext, page, widget, left, top, width, height);
                    } else {
                        height = this.documentHelper.render.getScaledValue(height);
                        canvasContext.globalAlpha = 0.4;
                        canvasContext.fillStyle = 'gray';
                        canvasContext.fillRect(left, this.documentHelper.render.getScaledValue(top, 2), width, height);
                    }
                    canvasContext.restore();
                }
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    private renderDashLine(ctx: CanvasRenderingContext2D, page: Page, widget: LineWidget, left: number, top: number, width: number, height: number): void {
        let fontColor: string = this.characterFormat.fontColor;
        let fillColor: string = fontColor ? HelperMethods.getColor(fontColor) : '#000000';
        ctx.globalAlpha = 1;
        // Get character format copied from selection format
        let format: WCharacterFormat = this.owner.editor.copyInsertFormat(new WCharacterFormat(), false);
        let heightInfo: TextSizeInfo = this.documentHelper.textHelper.getHeight(format);
        let pageTop: number = this.getPageTop(page);
        let descent: number = heightInfo.Height - heightInfo.BaselineOffset;
        top = this.documentHelper.render.getUnderlineYPosition(widget) + top + 4 - descent;
        // tslint:disable-next-line:max-line-length
        this.documentHelper.render.renderDashLine(ctx, left, (pageTop - this.viewer.containerTop) + (top * this.documentHelper.zoomFactor), width, fillColor, true);
    }
    /**
     * Add Selection highlight inside table
     * @private
     */
    public addSelectionHighlightTable(canvasContext: CanvasRenderingContext2D, tableCellWidget: TableCellWidget): void {
        if (this.selectedWidgets.containsKey(tableCellWidget)) {
            let selectedWidgetInfo: object = this.selectedWidgets.get(tableCellWidget);
            let selectedWidgetInfoCollection: SelectionWidgetInfo[] = undefined;
            if (selectedWidgetInfo instanceof SelectionWidgetInfo) {
                selectedWidgetInfoCollection = [];
                selectedWidgetInfoCollection.push(selectedWidgetInfo as SelectionWidgetInfo);
            } else {
                selectedWidgetInfoCollection = selectedWidgetInfo as SelectionWidgetInfo[];
            }
            if (!isNullOrUndefined(selectedWidgetInfoCollection)) {
                for (let i: number = 0; i < selectedWidgetInfoCollection.length; i++) {
                    let left: number = this.documentHelper.render.getScaledValue(selectedWidgetInfoCollection[i].left, 1);
                    let top: number = this.documentHelper.render.getScaledValue(tableCellWidget.y, 2);
                    let width: number = this.documentHelper.render.getScaledValue(selectedWidgetInfoCollection[i].width);
                    let height: number = this.documentHelper.render.getScaledValue(tableCellWidget.height);
                    canvasContext.fillStyle = 'gray';
                    let page: Page = this.owner.selection.getPage(tableCellWidget);
                    this.owner.selection.clipSelection(page, this.owner.selection.getPageTop(page));
                    canvasContext.fillRect(left, top, width, height);
                    canvasContext.restore();
                }
            }
        }
    }
    /**
     * Remove Selection highlight 
     * @private
     */
    public removeSelectionHighlight(widget: IWidget): void {
        let left: number = 0;
        let top: number = 0;
        let width: number = 0;
        let height: number = 0;
        let page: Page = undefined;
        if (widget instanceof LineWidget) {
            let lineWidget: LineWidget = widget as LineWidget;
            let currentParaWidget: ParagraphWidget = lineWidget.paragraph as ParagraphWidget;
            page = !isNullOrUndefined(currentParaWidget) ?
                this.getPage((lineWidget.paragraph)) : undefined;
            if (isNullOrUndefined(page)) {
                return;
            }
            top = this.getTop(lineWidget);
            height = lineWidget.height;
        } else if (widget instanceof TableCellWidget) {
            page = !isNullOrUndefined(widget) ?
                this.getPage(widget) : undefined;
            if (isNullOrUndefined(page)) {
                return;
            }
            top = widget.y;
            height = widget.height;
        }
        if (isNullOrUndefined(page)) {
            return;
        }
        let selectedWidget: object = this.selectedWidgets.get(widget);
        let selectedWidgetCollection: SelectionWidgetInfo[] = undefined;
        if (selectedWidget instanceof SelectionWidgetInfo) {
            selectedWidgetCollection = [];
            selectedWidgetCollection.push(selectedWidget as SelectionWidgetInfo);
        } else {
            selectedWidgetCollection = selectedWidget as SelectionWidgetInfo[];
        }
        if (!isNullOrUndefined(selectedWidgetCollection)) {
            for (let i: number = 0; i < selectedWidgetCollection.length; i++) {
                width = selectedWidgetCollection[i].width;
                left = selectedWidgetCollection[i].left;

                let pageRect: Rect = page.boundingRectangle;
                let pageIndex: number = this.documentHelper.pages.indexOf(page);
                let pageGap: number = (this.viewer as PageLayoutViewer).pageGap;
                let pageTop: number = (pageRect.y - pageGap * (pageIndex + 1)) * this.documentHelper.zoomFactor + pageGap * (pageIndex + 1);
                let pageLeft: number = pageRect.x;
                let zoomFactor: number = this.documentHelper.zoomFactor;
                if (this.viewer.containerTop <= pageTop
                    || pageTop < this.viewer.containerTop + this.documentHelper.selectionCanvas.height) {
                    // tslint:disable-next-line:max-line-length
                    this.documentHelper.selectionContext.clearRect((pageLeft + (left * zoomFactor) - this.viewer.containerLeft) - 0.5, (pageTop + (top * zoomFactor)) - this.viewer.containerTop - 0.5, width * zoomFactor + 0.5, height * zoomFactor + 0.5);
                }
            }
        }
    }
    /**
     * Selects Current word
     */
    public selectCurrentWord(excludeSpace?: boolean): void {
        let startPosition: TextPosition = this.start.clone();
        let endPosition: TextPosition = this.end.clone();
        this.selectCurrentWordRange(startPosition, endPosition, excludeSpace ? excludeSpace : false);
        this.selectRange(startPosition, endPosition);
    }
    /**
     * Selects current paragraph         
     */
    public selectParagraph(): void {
        if (!isNullOrUndefined(this.start)) {
            this.start.paragraphStartInternal(this, false);
            this.end.moveToParagraphEndInternal(this, false);
            this.upDownSelectionLength = this.end.location.x;
            this.fireSelectionChanged(true);
        }
    }
    /**
     * Selects current line.
     */
    public selectLine(): void {
        if (!isNullOrUndefined(this.start)) {
            this.moveToLineStart();
            this.handleShiftEndKey();
        }
    }
    /**
     * Moves selection to start of the document.
     */
    public moveToDocumentStart(): void {
        this.handleControlHomeKey();
    }
    /**
     * Moves selection to end of the document.
     */
    public moveToDocumentEnd(): void {
        this.handleControlEndKey();
    }
    /**
     * Moves selection to current paragraph start.
     */
    public moveToParagraphStart(): void {
        if (this.isForward) {
            this.start.paragraphStartInternal(this, false);
            this.end.setPositionInternal(this.start);
            this.upDownSelectionLength = this.end.location.x;
        } else {
            this.end.paragraphStartInternal(this, false);
            this.start.setPositionInternal(this.end);
            this.upDownSelectionLength = this.start.location.x;
        }
        this.fireSelectionChanged(true);
    }
    /**
     * Moves selection to current paragraph end.
     */
    public moveToParagraphEnd(): void {
        if (this.isForward) {
            this.start.moveToParagraphEndInternal(this, false);
            this.end.setPositionInternal(this.start);
            this.upDownSelectionLength = this.end.location.x;
        } else {
            this.end.moveToParagraphEndInternal(this, false);
            this.start.setPositionInternal(this.end);
            this.upDownSelectionLength = this.start.location.x;
        }
        this.fireSelectionChanged(true);
    }
    /** 
     * Moves selection to next line.
     */
    public moveToNextLine(): void {
        this.moveDown();
    }
    /**
     * Moves selection to previous line.
     */
    public moveToPreviousLine(): void {
        this.moveUp();
    }
    /** 
     * Moves selection to next character.
     */
    public moveToNextCharacter(): void {
        this.handleRightKey();
    }
    /** 
     * Moves selection to previous character.
     */
    public moveToPreviousCharacter(): void {
        this.handleLeftKey();
    }
    /**
     * Select current word range
     * @private
     */
    public selectCurrentWordRange(startPosition: TextPosition, endPosition: TextPosition, excludeSpace: boolean): void {
        if (!isNullOrUndefined(startPosition)) {
            if (startPosition.offset > 0) {
                let wordStart: TextPosition = startPosition.clone();
                let indexInInline: number = 0;
                let inlineObj: ElementInfo = startPosition.currentWidget.getInline(startPosition.offset, indexInInline);
                let inline: ElementBox = inlineObj.element;
                indexInInline = inlineObj.index;
                if (!isNullOrUndefined(inline) && inline instanceof FieldElementBox && inline.fieldType === 1) {
                    // tslint:disable-next-line:max-line-length
                    if (startPosition.offset > 2 && (!isNullOrUndefined((inline as FieldElementBox).fieldSeparator) || isNullOrUndefined((inline as FieldElementBox).fieldBegin))) {
                        wordStart.setPositionParagraph(wordStart.currentWidget, startPosition.offset - 2);
                        wordStart.moveToWordEndInternal(0, false);
                        if (!(wordStart.paragraph === startPosition.paragraph && wordStart.offset === startPosition.offset - 1)) {
                            startPosition.moveToWordStartInternal(2);
                        }
                    } else if (startPosition.offset > 3 && isNullOrUndefined((inline as FieldElementBox).fieldSeparator)) {
                        wordStart.setPositionParagraph(wordStart.currentWidget, startPosition.offset - 3);
                        wordStart.moveToWordEndInternal(0, false);
                        if (!(wordStart.paragraph === startPosition.paragraph && wordStart.offset === startPosition.offset)) {
                            startPosition.moveToWordStartInternal(2);
                        }
                    }
                } else {
                    wordStart.setPositionParagraph(wordStart.currentWidget, startPosition.offset - 1);
                    wordStart.moveToWordEndInternal(0, false);
                    if (!(wordStart.paragraph === startPosition.paragraph && wordStart.offset === startPosition.offset)) {
                        startPosition.moveToWordStartInternal(2);
                    }
                }
            }
            endPosition.moveToWordEndInternal(2, excludeSpace);
        }
    }
    /**
     * Extends selection to paragraph start.     
     */
    public extendToParagraphStart(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.paragraphStartInternal(this, true);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extend selection to paragraph end.     
     */
    public extendToParagraphEnd(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToParagraphEndInternal(this, true);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Move to next text position
     * @private
     */
    public moveNextPosition(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        if (this.isEmpty) {
            this.start.moveNextPosition();
            this.end.setPositionInternal(this.start);
        }
        this.updateForwardSelection();
        this.upDownSelectionLength = this.start.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Move to next paragraph
     * @private
     */
    public moveToNextParagraph(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToNextParagraphStartInternal();
        this.start.setPositionInternal(this.end);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Move to previous text position
     * @private
     */
    public movePreviousPosition(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }

        if (this.isEmpty) {
            this.start.movePreviousPosition();
            this.end.setPositionInternal(this.start);
        }
        this.updateBackwardSelection();
        this.upDownSelectionLength = this.start.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Move to previous paragraph
     * @private
     */
    public moveToPreviousParagraph(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToPreviousParagraph(this);
        this.start.setPositionInternal(this.end);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extends selection to previous line.
     */
    public extendToPreviousLine(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToPreviousLine(this, this.upDownSelectionLength);
        this.fireSelectionChanged(true);
    }
    /**
     * Extend selection to line end    
     */
    public extendToLineEnd(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToLineEndInternal(this, true);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extends selection to line start.
     */
    public extendToLineStart(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToLineStartInternal(this, true);
        this.upDownSelectionLength = this.end.location.x;
        // To select Paragraph mark similar to MS WORD
        if (this.start.paragraph === this.end.paragraph && this.start.offset === this.start.currentWidget.getEndOffset()
            && this.isParagraphLastLine(this.start.currentWidget) && this.isParagraphFirstLine(this.end.currentWidget)) {
            this.start.setPositionParagraph(this.start.currentWidget, this.start.offset + 1);
        }
        this.fireSelectionChanged(true);
    }
    /**
     * @private
     */
    public moveUp(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        if (!this.isEmpty) {
            if (this.isForward) {
                this.end.setPositionInternal(this.start);
            } else {
                this.start.setPositionInternal(this.end);
            }
            this.upDownSelectionLength = this.start.location.x;
        }
        this.upDownSelectionLength = this.start.location.x;
        this.start.moveUp(this, this.upDownSelectionLength);
        this.end.setPositionInternal(this.start);
        this.fireSelectionChanged(true);
    }
    /**
     * @private
     */
    public moveDown(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        if (!this.isEmpty) {
            if (this.isForward) {
                this.start.setPositionInternal(this.end);
            } else {
                this.end.setPositionInternal(this.start);
            }
            this.upDownSelectionLength = this.start.location.x;
        }
        this.start.moveDown(this, this.upDownSelectionLength);
        this.end.setPositionInternal(this.start);
        this.fireSelectionChanged(true);
    }
    private updateForwardSelection(): void {
        if (!this.isEmpty) {
            if (this.isForward) {
                this.start.setPositionInternal(this.end);
            } else {
                this.end.setPositionInternal(this.start);
            }
        }
    }
    private updateBackwardSelection(): void {
        if (!this.isEmpty) {
            if (this.isForward) {
                this.end.setPositionInternal(this.start);
            } else {
                this.start.setPositionInternal(this.end);
            }
        }
    }
    /**
     * @private
     */
    public getFirstBlockInFirstCell(table: TableWidget): BlockWidget {
        if (table.childWidgets.length > 0) {
            let firstrow: TableRowWidget = table.childWidgets[0] as TableRowWidget;
            if (firstrow.childWidgets.length > 0) {
                let firstcell: TableCellWidget = firstrow.childWidgets[0] as TableCellWidget;
                if (firstcell.childWidgets.length === 0) {
                    return undefined;
                }
                return firstcell.childWidgets[0] as BlockWidget;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getFirstCellInRegion(row: TableRowWidget, startCell: TableCellWidget, selectionLength: number, isMovePrevious: boolean): TableCellWidget {
        let cellStart: number = this.getCellLeft(row, startCell);
        let cellEnd: number = cellStart + startCell.cellFormat.cellWidth;
        let flag: boolean = true;
        if (cellStart <= selectionLength && selectionLength < cellEnd) {
            for (let k: number = 0; k < row.childWidgets.length; k++) {
                let left: number = this.getCellLeft(row, row.childWidgets[k] as TableCellWidget);
                if (HelperMethods.round(cellStart, 2) <= HelperMethods.round(left, 2) &&
                    HelperMethods.round(left, 2) < HelperMethods.round(cellEnd, 2)) {
                    flag = false;
                    return row.childWidgets[k] as TableCellWidget;
                }
            }
        } else {
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cellLeft: number = this.getCellLeft(row, row.childWidgets[j] as TableCellWidget);
                if (cellLeft <= selectionLength && cellLeft +
                    (row.childWidgets[j] as TableCellWidget).cellFormat.cellWidth > selectionLength) {
                    flag = false;
                    return row.childWidgets[j] as TableCellWidget;
                }
            }
        }
        if (flag) {
            if (!isNullOrUndefined(row.previousRenderedWidget) && isMovePrevious) {
                let previousWidget: TableRowWidget = (row.previousRenderedWidget as TableRowWidget);
                return this.getFirstCellInRegion(previousWidget, startCell, selectionLength, isMovePrevious);
            } else if (!isNullOrUndefined(row.nextRenderedWidget) && !isMovePrevious) {
                return this.getFirstCellInRegion((row.nextRenderedWidget as TableRowWidget), startCell, selectionLength, isMovePrevious);
            }
        }
        return row.childWidgets[0] as TableCellWidget;
    }
    /**
     * @private
     */
    public getFirstParagraph(tableCell: TableCellWidget): ParagraphWidget {
        while (tableCell.previousSplitWidget) {
            tableCell = tableCell.previousSplitWidget as TableCellWidget;
        }
        let firstBlock: BlockWidget = tableCell.firstChild as BlockWidget;
        return this.getFirstParagraphBlock(firstBlock);
    }
    /**
     * Get last block in last cell
     * @private
     */
    //Table
    public getLastBlockInLastCell(table: TableWidget): BlockWidget {
        if (table.childWidgets.length > 0) {
            let lastRow: TableRowWidget = table.childWidgets[table.childWidgets.length - 1] as TableRowWidget;
            let lastCell: TableCellWidget = lastRow.childWidgets[lastRow.childWidgets.length - 1] as TableCellWidget;
            while (lastCell.childWidgets.length === 0 && !isNullOrUndefined(lastCell.previousSplitWidget)) {
                lastCell = lastCell.previousSplitWidget as TableCellWidget;
            }
            return lastCell.childWidgets[lastCell.childWidgets.length - 1] as BlockWidget;
        }
        return undefined;
    }

    /**
     * Moves selection to start of the current line.     
     */
    public moveToLineStart(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.updateBackwardSelection();
        this.start.moveToLineStartInternal(this, false);
        this.end.setPositionInternal(this.start);
        this.upDownSelectionLength = this.start.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Moves selection to end of the current line.
     */
    public moveToLineEnd(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.updateForwardSelection();
        this.start.moveToLineEndInternal(this, false);
        this.end.setPositionInternal(this.start);
        this.upDownSelectionLength = this.start.location.x;
        this.fireSelectionChanged(true);
    }

    /**
     * Get Page top 
     * @private
     */
    public getPageTop(page: Page): number {
        // tslint:disable-next-line:max-line-length
        return (page.boundingRectangle.y - (this.viewer as PageLayoutViewer).pageGap * (this.documentHelper.pages.indexOf(page) + 1)) * this.documentHelper.zoomFactor + (this.viewer as PageLayoutViewer).pageGap * (this.documentHelper.pages.indexOf(page) + 1);
    }
    /**
     * Move text position to cursor point
     * @private
     */
    public moveTextPosition(cursorPoint: Point, textPosition: TextPosition): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }

        //Updates the text position based on the cursor position.
        let widget: LineWidget = this.documentHelper.getLineWidgetInternal(cursorPoint, true);
        if (!isNullOrUndefined(widget)) {
            this.updateTextPositionWidget(widget, cursorPoint, textPosition, true);
        }
        this.upDownSelectionLength = textPosition.location.x;
        let selectionStartIndex: string = this.start.getHierarchicalIndexInternal();
        let selectionEndIndex: string = this.end.getHierarchicalIndexInternal();
        if (selectionStartIndex !== selectionEndIndex) {
            // Extends selection end to field begin or field end.
            if (TextPosition.isForwardSelection(selectionStartIndex, selectionEndIndex)) {
                textPosition.validateForwardFieldSelection(selectionStartIndex, selectionEndIndex);
            } else {

                textPosition.validateBackwardFieldSelection(selectionStartIndex, selectionEndIndex);
            }
        }
        this.fireSelectionChanged(true);
    }
    //Helper Method Implementation 
    //Document
    /**
     * Get document start position
     * @private
     */
    public getDocumentStart(): TextPosition {
        let textPosition: TextPosition = undefined;
        let block: BlockWidget = this.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as BlockWidget;
        return this.setPositionForBlock(block, true);
    }
    /**
     * Get document end position
     * @private
     */
    public getDocumentEnd(): TextPosition {
        let textPosition: TextPosition = undefined;
        let documentStart: TextPosition = this.owner.documentStart;
        let lastPage: Page = this.documentHelper.pages[this.documentHelper.pages.length - 1];
        if (!isNullOrUndefined(documentStart) && lastPage.bodyWidgets[0].childWidgets.length > 0) {
            let block: BlockWidget = undefined;
            let section: BodyWidget = lastPage.bodyWidgets[0] as BodyWidget;
            let blocks: IWidget[] = section.childWidgets;
            let lastBlkItem: number = blocks.length - 1;
            let lastBlock: BlockWidget = blocks[lastBlkItem] as BlockWidget;
            if (lastBlock instanceof BlockWidget) {
                block = lastBlock;
            }
            textPosition = this.setPositionForBlock(block, false);
        }
        return textPosition;
    }

    //Keyboard shortcut internal API
    /**
     * @private
     * Handles control end key.
     */
    public handleControlEndKey(): void {
        let documentEnd: TextPosition = undefined;
        if (!isNullOrUndefined(this.owner.documentEnd)) {
            documentEnd = this.owner.documentEnd;
        }
        if (!isNullOrUndefined(documentEnd)) {
            this.owner.selection.selectContent(documentEnd, true);
        }
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles control home key.
     */
    public handleControlHomeKey(): void {
        let documentStart: TextPosition = undefined;
        if (!isNullOrUndefined(this.owner.documentStart)) {
            documentStart = this.owner.documentStart;
        }
        if (!isNullOrUndefined(documentStart)) {
            this.owner.selection.selectContent(documentStart, true);
        }
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles control left key.
     */
    public handleControlLeftKey(): void {
        this.extendToWordStartInternal(true);
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles control right key.
     */
    public handleControlRightKey(): void {
        this.extendToWordEndInternal(true);
        this.checkForCursorVisibility();
    }
    /**
     * Handles control down key.
     * @private
     */
    public handleControlDownKey(): void {
        this.moveToNextParagraph();
        this.checkForCursorVisibility();
    }
    /**
     * Handles control up key.
     * @private
     */
    public handleControlUpKey(): void {
        this.moveToPreviousParagraph();
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles shift left key.
     */
    public handleShiftLeftKey(): void {
        this.extendBackward();
        this.checkForCursorVisibility();
    }
    /**
     * Handles shift up key.
     * @private
     */
    public handleShiftUpKey(): void {
        this.extendToPreviousLine();
        this.checkForCursorVisibility();
    }
    /**
     * Handles shift right key.
     * @private
     */
    public handleShiftRightKey(): void {
        this.extendForward();
        this.checkForCursorVisibility();
    }
    /**
     * Handles shift down key.
     * @private
     */
    public handleShiftDownKey(): void {
        this.extendToNextLine();
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles control shift left key.
     */
    public handleControlShiftLeftKey(): void {
        let isForward: boolean = this.isForward ? this.start.isCurrentParaBidi : this.end.isCurrentParaBidi;
        if (isForward) {
            this.extendToWordEndInternal(false);
        } else {
            this.extendToWordStartInternal(false);
        }
        this.checkForCursorVisibility();
    }
    /**
     * Handles control shift up key.
     * @private
     */
    public handleControlShiftUpKey(): void {
        this.extendToParagraphStart();
        this.checkForCursorVisibility();
    }
    /**
     * Handles control shift right key
     * @private
     */
    public handleControlShiftRightKey(): void {
        let isForward: boolean = this.isForward ? this.start.isCurrentParaBidi : this.end.isCurrentParaBidi;
        if (isForward) {
            this.extendToWordStartInternal(false);
        } else {
            this.extendToWordEndInternal(false);
        }
        this.checkForCursorVisibility();
    }
    /**
     * Handles control shift down key.
     * @private
     */
    public handleControlShiftDownKey(): void {
        this.extendToParagraphEnd();
        this.checkForCursorVisibility();
    }
    /**
     * Handles left key.
     * @private
     */
    public handleLeftKey(): void {
        if (this.end.isCurrentParaBidi) {
            this.moveNextPosition();
        } else {
            this.movePreviousPosition();
        }

        this.checkForCursorVisibility();
    }
    /**
     * Handles up key.
     * @private
     */
    public handleUpKey(): void {
        this.isMoveDownOrMoveUp = true;
        this.moveUp();
        this.isMoveDownOrMoveUp = false;
        this.checkForCursorVisibility();
    }
    /**
     * Handles right key.
     * @private
     */
    public handleRightKey(): void {
        if (this.end.isCurrentParaBidi) {
            this.movePreviousPosition();
        } else {
            this.moveNextPosition();
        }
        this.checkForCursorVisibility();
    }
    /**
     * Handles end key.
     * @private
     */
    public handleEndKey(): void {
        this.moveToLineEnd();
        this.checkForCursorVisibility();
    }
    /**
     * Handles home key.
     * @private
     */
    public handleHomeKey(): void {
        this.moveToLineStart();
        this.checkForCursorVisibility();
    }
    /**
     * Handles down key.
     * @private
     */
    public handleDownKey(): void {
        this.isMoveDownOrMoveUp = true;
        this.moveDown();
        this.isMoveDownOrMoveUp = false;
        this.checkForCursorVisibility();
    }
    /**
     * Handles shift end key.
     * @private
     */
    public handleShiftEndKey(): void {
        this.extendToLineEnd();
        this.checkForCursorVisibility();
    }
    /**
     * Handles shift home key.
     * @private
     */
    public handleShiftHomeKey(): void {
        this.extendToLineStart();
        this.checkForCursorVisibility();
    }
    /**
     * Handles control shift end key.
     * @private
     */
    public handleControlShiftEndKey(): void {
        let documentEnd: TextPosition = undefined;
        if (!isNullOrUndefined(this.owner.documentEnd)) {
            documentEnd = this.owner.documentEnd;
        }
        if (!isNullOrUndefined(documentEnd)) {
            this.end.setPosition(documentEnd.currentWidget, false);
            this.fireSelectionChanged(true);
        }
        this.checkForCursorVisibility();
    }
    /**
     * Handles control shift home key.
     * @private
     */
    public handleControlShiftHomeKey(): void {
        let documentStart: TextPosition = undefined;
        if (!isNullOrUndefined(this.owner.documentStart)) {
            documentStart = this.owner.documentStart;
        }
        if (!isNullOrUndefined(documentStart)) {
            this.end.setPositionInternal(documentStart);
            this.fireSelectionChanged(true);
        }
        this.checkForCursorVisibility();
    }
    /**
     * Handles tab key.
     * @param isNavigateInCell
     * @param isShiftTab
     * @private
     */
    public handleTabKey(isNavigateInCell: boolean, isShiftTab: boolean): void {
        let start: TextPosition = this.start;
        if (isNullOrUndefined(start)) {
            return;
        }
        if (start.paragraph.isInsideTable && this.end.paragraph.isInsideTable && (isNavigateInCell || isShiftTab)) {
            //Perform tab navigation
            if (isShiftTab) {
                this.selectPreviousCell();
            } else {
                this.selectNextCell();
            }
        } else if ((isNavigateInCell || isShiftTab) && !isNullOrUndefined(start) && start.offset === this.getStartOffset(start.paragraph)
            && !isNullOrUndefined(start.paragraph.paragraphFormat) && !isNullOrUndefined(start.paragraph.paragraphFormat.listFormat)
            && start.paragraph.paragraphFormat.listFormat.listId !== -1 && !this.owner.isReadOnlyMode) {
            this.owner.editorModule.updateListLevel(isShiftTab ? false : true);
        } else if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.handleTextInput('\t');
        }
        this.checkForCursorVisibility();
    }
    private selectPreviousCell(): void {
        let tableCell: TableCellWidget = this.start.paragraph.associatedCell;
        let tableRow: TableRowWidget = tableCell.ownerRow;
        let tableAdv: TableWidget = tableRow.ownerTable;
        if (isNullOrUndefined(tableCell.previousWidget)) {
            if (!isNullOrUndefined(tableRow.previousRenderedWidget)) {
                //Move text selection or cursor to previous row's last cell
                let prevRow: TableRowWidget = undefined;
                if (tableRow.previousRenderedWidget instanceof TableRowWidget) {
                    prevRow = tableRow.previousRenderedWidget as TableRowWidget;
                }
                this.selectTableCellInternal(prevRow.childWidgets[prevRow.childWidgets.length - 1] as TableCellWidget, true);
            }
        } else {
            //Move text selection or cursor to next cell in current row
            let prevCell: TableCellWidget = undefined;
            if (tableCell.previousWidget instanceof TableCellWidget) {
                prevCell = tableCell.previousWidget as TableCellWidget;
            }
            this.selectTableCellInternal(prevCell, true);
        }
    }
    private selectNextCell(): void {
        let tableCell: TableCellWidget = this.start.paragraph.associatedCell;
        let tableRow: TableRowWidget = tableCell.ownerRow;
        let tableAdv: TableWidget = tableRow.ownerTable;
        if (isNullOrUndefined(tableCell.nextWidget)) {
            if (isNullOrUndefined(tableRow.nextRenderedWidget) && !this.owner.isReadOnlyMode) {
                //Insert new row below                  
                this.owner.editorModule.insertRow(false);
            } else {
                //Move text selection or cursor to next row's first cell
                let nextRow: TableRowWidget = undefined;
                if (tableRow.nextRenderedWidget instanceof TableRowWidget) {
                    nextRow = tableRow.nextRenderedWidget as TableRowWidget;
                }
                this.selectTableCellInternal(nextRow.childWidgets[0] as TableCellWidget, true);
            }
            // }
        } else {
            //Move text selection or cursor to next cell in current row
            let nextCell: TableCellWidget = undefined;
            if (tableCell.nextRenderedWidget instanceof TableCellWidget) {
                nextCell = tableCell.nextRenderedWidget as TableCellWidget;
            }
            this.selectTableCellInternal(nextCell, true);
        }
    }
    /**
     * Select given table cell
     * @private
     */
    public selectTableCellInternal(tableCell: TableCellWidget, clearMultiSelection: boolean): void {
        let firstParagraph: ParagraphWidget = this.getFirstParagraph(tableCell);
        let lastParagraph: ParagraphWidget = this.getLastParagraph(tableCell);
        if (firstParagraph === lastParagraph && lastParagraph.isEmpty()) {
            this.selectParagraphInternal(lastParagraph, true);
        } else {
            let firstLineWidget: LineWidget = lastParagraph.childWidgets[0] as LineWidget;
            this.start.setPosition(firstParagraph.childWidgets[0] as LineWidget, true);
            this.end.setPositionParagraph(firstLineWidget, firstLineWidget.getEndOffset());
            this.fireSelectionChanged(true);
        }
    }

    /**
     * Select while table
     * @private
     */
    private selectTableInternal(): void {
        let start: TextPosition = this.start;
        let end: TextPosition = this.end;
        if (!this.isForward) {
            start = this.end;
            end = this.start;
        }
        if (!isNullOrUndefined(start) && !isNullOrUndefined(end) && !isNullOrUndefined(this.getTable(start, end))) {
            let containerCell: TableCellWidget = this.getContainerCellOf(start.paragraph.associatedCell, end.paragraph.associatedCell);
            let table: TableWidget = containerCell.ownerTable;
            let firstPara: ParagraphWidget = this.getFirstParagraphBlock(table);
            let lastPara: ParagraphWidget = this.getLastParagraphBlock(table);
            let offset: number = (lastPara.lastChild as LineWidget).getEndOffset();
            this.start.setPosition(firstPara.childWidgets[0] as LineWidget, true);
            this.end.setPositionParagraph((lastPara.lastChild as LineWidget), offset + 1);
        }
        this.selectPosition(this.start, this.end);
    }
    /**
     * Select single column
     * @private
     */
    public selectColumnInternal(): void {
        let startTextPos: TextPosition = this.start;
        let endTextPos: TextPosition = this.end;
        if (!this.isForward) {
            startTextPos = this.end;
            endTextPos = this.start;
        }
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(startTextPos) && !isNullOrUndefined(endTextPos) && !isNullOrUndefined(this.getTable(startTextPos, endTextPos))) {
            let containerCell: TableCellWidget = this.getContainerCellOf(startTextPos.paragraph.associatedCell, endTextPos.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(endTextPos.paragraph.associatedCell)) {
                let startCell: TableCellWidget = this.getSelectedCell(startTextPos.paragraph.associatedCell, containerCell);
                let endCell: TableCellWidget = this.getSelectedCell(endTextPos.paragraph.associatedCell, containerCell);
                if (this.containsCell(containerCell, endTextPos.paragraph.associatedCell)) {
                    let row: TableRowWidget = startCell.ownerRow;
                    let columnCells: TableCellWidget[] = containerCell.ownerTable.getColumnCellsForSelection(containerCell, containerCell);
                    if (columnCells.length > 0) {
                        let firstPara: ParagraphWidget = this.getFirstParagraph(columnCells[0] as TableCellWidget);
                        let lastPara: ParagraphWidget = this.getLastParagraph(columnCells[columnCells.length - 1] as TableCellWidget);
                        this.start.setPosition(firstPara.firstChild as LineWidget, true);
                        let lastLine: LineWidget = (lastPara.lastChild as LineWidget);
                        this.end.setPositionParagraph(lastLine, lastLine.getEndOffset() + 1);
                    }
                } else {
                    let startCellColumnCells: TableCellWidget[] = containerCell.ownerTable.getColumnCellsForSelection(startCell, startCell);
                    let endCellColumnCells: TableCellWidget[] = containerCell.ownerTable.getColumnCellsForSelection(endCell, endCell);
                    if (startCellColumnCells.length > 0 && endCellColumnCells.length > 0) {
                        let firstPara: ParagraphWidget = this.getFirstParagraph(startCellColumnCells[0] as TableCellWidget);
                        // tslint:disable-next-line:max-line-length
                        let lastPara: ParagraphWidget = this.getLastParagraph(endCellColumnCells[endCellColumnCells.length - 1] as TableCellWidget);
                        this.start.setPosition(firstPara.firstChild as LineWidget, true);
                        let lastLine: LineWidget = (lastPara.lastChild as LineWidget);
                        this.end.setPositionParagraph(lastLine, lastLine.getEndOffset() + 1);
                    }
                }
            }
        }
        this.selectPosition(this.start, this.end);
    }
    /**
     * Select single row
     * @private
     */
    public selectTableRow(): void {
        let startPos: TextPosition = this.start;
        let endPos: TextPosition = this.end;
        if (!this.isForward) {
            startPos = this.end;
            endPos = this.start;
        }
        if (!isNullOrUndefined(startPos) && !isNullOrUndefined(endPos) && !isNullOrUndefined(this.getTable(startPos, endPos))) {
            let containerCell: TableCellWidget;
            containerCell = this.getContainerCellOf(startPos.paragraph.associatedCell, endPos.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(endPos.paragraph.associatedCell)) {
                let startCell: TableCellWidget = this.getSelectedCell(startPos.paragraph.associatedCell, containerCell);
                let endCell: TableCellWidget = this.getSelectedCell(endPos.paragraph.associatedCell, containerCell);
                if (this.containsCell(containerCell, endPos.paragraph.associatedCell)) {
                    let row: TableRowWidget = startCell.ownerRow;
                    let firstPara: ParagraphWidget = this.getFirstParagraph(row.childWidgets[0] as TableCellWidget);
                    let lastPara: ParagraphWidget = this.getLastParagraph(row.childWidgets[row.childWidgets.length - 1] as TableCellWidget);
                    this.start.setPosition(firstPara.firstChild as LineWidget, true);
                    this.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
                } else {
                    let firstPara: ParagraphWidget = this.getFirstParagraph(startCell.ownerRow.childWidgets[0] as TableCellWidget);
                    let lastPara: ParagraphWidget;
                    // tslint:disable-next-line:max-line-length
                    lastPara = this.getLastParagraph(endCell.ownerRow.childWidgets[endCell.ownerRow.childWidgets.length - 1] as TableCellWidget);
                    this.start.setPosition(firstPara.firstChild as LineWidget, true);
                    this.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
                }
            }
        }
        this.selectPosition(this.start, this.end);
    }
    /**
     * Select single cell
     * @private
     */
    public selectTableCell(): void {
        let start: TextPosition = this.start;
        let end: TextPosition = this.end;
        if (!this.isForward) {
            start = this.end;
            end = this.start;
        }
        if (isNullOrUndefined(this.getTable(start, end))) {
            return;
        }
        if (this.isEmpty) {
            if (start.paragraph.isInsideTable && !isNullOrUndefined(start.paragraph.associatedCell)) {
                let firstPara: ParagraphWidget = this.getFirstParagraph(start.paragraph.associatedCell);
                let lastPara: ParagraphWidget = this.getLastParagraph(end.paragraph.associatedCell);
                if (firstPara === lastPara) {
                    this.start.setPosition(lastPara.firstChild as LineWidget, true);
                    this.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
                } else {
                    this.start.setPosition(firstPara.firstChild as LineWidget, true);
                    this.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
                }
            }
        } else {
            let containerCell: TableCellWidget = this.getContainerCell(start.paragraph.associatedCell);
            // tslint:disable-next-line:max-line-length
            if (this.containsCell(containerCell, start.paragraph.associatedCell) && this.containsCell(containerCell, end.paragraph.associatedCell)) {
                let firstPara: ParagraphWidget = this.getFirstParagraph(containerCell);
                let lastPara: ParagraphWidget = this.getLastParagraph(containerCell);
                if (!isNullOrUndefined(firstPara) && !isNullOrUndefined(lastPara)) {
                    this.start.setPosition(firstPara.firstChild as LineWidget, true);
                    this.end.setPositionParagraph(lastPara.lastChild as LineWidget, (lastPara.lastChild as LineWidget).getEndOffset() + 1);
                }
            }
        }
        this.selectPosition(this.start, this.end);
    }
    /**     
     * Selects the entire document.
     */
    public selectAll(): void {
        let documentStart: TextPosition;
        let documentEnd: TextPosition;
        if (this.owner.enableHeaderAndFooter) {
            let headerFooter: HeaderFooterWidget = this.getContainerWidget(this.start.paragraph) as HeaderFooterWidget;
            documentStart = this.setPositionForBlock(headerFooter.firstChild as BlockWidget, true);
            documentEnd = this.setPositionForBlock(headerFooter.lastChild as BlockWidget, false);
        } else {
            documentStart = this.owner.documentStart;
            documentEnd = this.owner.documentEnd;
        }
        //Selects the entire document.        
        if (!isNullOrUndefined(documentStart)) {
            this.start.setPositionInternal(documentStart);
            this.end.setPositionParagraph(documentEnd.currentWidget, documentEnd.offset + 1);
            this.upDownSelectionLength = this.end.location.x;
            this.fireSelectionChanged(true);
        }
    }
    /**
     * Extends selection backward.
     */
    public extendBackward(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isForward: boolean = this.isForward ? this.start.isCurrentParaBidi : this.end.isCurrentParaBidi;
        if (isForward) {
            this.end.moveForward();
        } else {
            this.end.moveBackward();
        }
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extends selection forward.
     */
    public extendForward(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isForward: boolean = this.isForward ? this.start.isCurrentParaBidi : this.end.isCurrentParaBidi;
        if (isForward) {
            this.end.moveBackward();
        } else {
            this.end.moveForward();
        }

        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extend selection to word start and end
     * @private
     */
    public extendToWordStartEnd(): boolean {
        if ((this.start.paragraph.isInsideTable || this.end.paragraph.isInsideTable)
            && (this.start.paragraph.associatedCell !== this.end.paragraph.associatedCell
                || this.isCellSelected(this.start.paragraph.associatedCell, this.start, this.end))) {
            return true;
        }
        return false;
    }
    /**
     * Extends selection to word start.
     */
    public extendToWordStart(): void {
        this.extendToWordStartInternal(false);
    }
    /**
     * Extends selection to word end.
     */
    public extendToWordEnd(): void {
        this.extendToWordEndInternal(false);
    }
    /**
     * Extends selection to word start
     * @private
     */
    public extendToWordStartInternal(isNavigation: boolean): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isCellSelected: boolean = this.extendToWordStartEnd();
        if (isCellSelected) {
            this.end.moveToPreviousParagraphInTable(this);
        } else {
            if (isNavigation && this.end.isCurrentParaBidi) {
                this.end.moveToWordEndInternal(isNavigation ? 0 : 1, false);
            } else {
                this.end.moveToWordStartInternal(isNavigation ? 0 : 1);
            }
        }
        if (isNavigation) {
            this.start.setPositionInternal(this.end);
        }
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extends selection to word end.
     */
    public extendToWordEndInternal(isNavigation: boolean): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isCellSelect: boolean = this.extendToWordStartEnd();
        if (isCellSelect) {
            this.end.moveToNextParagraphInTable();
        } else {
            if (isNavigation && this.end.isCurrentParaBidi) {
                this.end.moveToWordStartInternal(isNavigation ? 0 : 1);
            } else {
                this.end.moveToWordEndInternal(isNavigation ? 0 : 1, false);
            }
        }
        if (isNavigation) {
            this.start.setPositionInternal(this.end);
        }
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extend selection to next line.     
     */
    public extendToNextLine(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToNextLine(this.upDownSelectionLength);
        this.fireSelectionChanged(true);
    }
    //Selection Text get API

    //Selection add, Highlight, remove API enda
    private getTextPosition(hierarchicalIndex: string): TextPosition {
        let textPosition: TextPosition = new TextPosition(this.owner);
        textPosition.setPositionForCurrentIndex(hierarchicalIndex);
        return textPosition;
    }
    /**
     * Get Selected text
     * @private
     */
    public getText(includeObject: boolean): string {
        if (isNullOrUndefined(this.start) || isNullOrUndefined(this.end)
            || isNullOrUndefined(this.start.paragraph) || isNullOrUndefined(this.end.paragraph)) {
            return undefined;
        }
        let startPosition: TextPosition = this.start;
        let endPosition: TextPosition = this.end;
        if (startPosition.isAtSamePosition(endPosition)) {
            return '';
        }
        return this.getTextInternal(startPosition, endPosition, includeObject);
    }
    /**
     * Get selected text
     * @private
     */
    public getTextInternal(start: TextPosition, end: TextPosition, includeObject: boolean): string {
        if (start.isExistAfter(end)) {
            let temp: TextPosition = end;
            end = start;
            start = temp;
        }
        let startPosition: TextPosition = start;
        let endPosition: TextPosition = end;
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(start) && !isNullOrUndefined(end) && !isNullOrUndefined(start.paragraph) && !isNullOrUndefined(end.paragraph)) {
            let startIndex: number = 0;
            let endIndex: number = 0;
            let startOffset: number = start.offset;
            let endOffset: number = end.offset;
            let startInlineObj: ElementInfo = (start.currentWidget as LineWidget).getInline(startOffset, startIndex);
            startIndex = startInlineObj.index;
            let inline: ElementBox = startInlineObj.element;
            // If the start position is at the beginning of field begin that has field end, then field code should be skipped.
            if (inline instanceof FieldElementBox && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
                let elementInfo: ElementInfo = this.getRenderedInline(inline as FieldElementBox, startIndex);
                inline = elementInfo.element;
                startIndex = elementInfo.index;
            }
            let endInlineObj: ElementInfo = (end.currentWidget as LineWidget).getInline(endOffset, endIndex);
            let endInline: ElementBox = endInlineObj.element;
            endIndex = endInlineObj.index;

            let text: string = '';
            // Retrieves the text from start inline.
            if (inline instanceof ImageElementBox && includeObject && startIndex === 0) {

                text = ElementBox.objectCharacter;
            } else if (inline instanceof TextElementBox) {
                // tslint:disable-next-line:max-line-length
                text = ((isNullOrUndefined((inline as TextElementBox).text)) || ((inline as TextElementBox).text) === '') || (inline as TextElementBox).text.length < startIndex ? text : (inline as TextElementBox).text.substring(startIndex);
            }
            if (startPosition.paragraph === endPosition.paragraph) {
                if (inline instanceof ElementBox) {
                    if (inline === endInline && inline instanceof TextElementBox) {
                        text = text.length < endIndex - startIndex ? text : text.substring(0, endIndex - startIndex);
                    } else if (inline.nextNode instanceof ElementBox) {
                        // tslint:disable-next-line:max-line-length
                        text = text + this.getTextInline(inline.nextNode as ElementBox, endPosition.paragraph, endInline, endIndex, includeObject);
                    }
                }
            } else {
                if (inline instanceof ElementBox && inline.nextNode instanceof ElementBox) {
                    text = text + this.getTextInline(inline.nextNode as ElementBox, endPosition.paragraph, undefined, 0, includeObject);
                } else {
                    // tslint:disable-next-line:max-line-length
                    let nextParagraphWidget: ParagraphWidget = this.documentHelper.selection.getNextParagraphBlock(startPosition.paragraph) as ParagraphWidget;
                    text = text + '\r';
                    while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.isEmpty()) {
                        text = text + '\r';
                        if (nextParagraphWidget === endPosition.paragraph) {
                            return text;
                        }
                        nextParagraphWidget = this.documentHelper.selection.getNextParagraphBlock(nextParagraphWidget) as ParagraphWidget;
                    }
                    if (!isNullOrUndefined(nextParagraphWidget) && !nextParagraphWidget.isEmpty()) {
                        // tslint:disable-next-line:max-line-length
                        text = text + this.getTextInline((nextParagraphWidget.childWidgets[0] as LineWidget).children[0] as ElementBox, endPosition.paragraph, endInline, endIndex, includeObject);
                    }
                }
            }
            // If the selection includes end paragraph mark.
            if (endOffset === (endPosition.currentWidget).getEndOffset() + 1) {
                text = text + '\r';
            }
            return text;
        }
        return undefined;
    }
    /**
     * @private
     * @param block 
     * @param offset
     */
    public getHierarchicalIndex(block: Widget, offset: string): string {
        let index: string;
        if (block) {
            if (block instanceof HeaderFooterWidget) {
                let hfString: string = block.headerFooterType.indexOf('Header') !== -1 ? 'H' : 'F';
                let pageIndex: string = block.page.index.toString();
                // let headerFooterIndex: string = (this.viewer as PageLayoutViewer).getHeaderFooter(block.headerFooterType).toString();
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
    private getHierarchicalIndexByPosition(position: TextPosition): string {
        let info: ParagraphInfo = this.getParagraphInfo(position);
        return this.getHierarchicalIndex(info.paragraph, info.offset.toString());
    }
    /**
     * @private
     * Gets logical position.
     */
    public getTextPosBasedOnLogicalIndex(hierarchicalIndex: string): TextPosition {
        let textPosition: TextPosition = new TextPosition(this.owner);
        let blockInfo: ParagraphInfo = this.getParagraph({ index: hierarchicalIndex });
        let lineInfo: LineInfo = this.getLineInfoBasedOnParagraph(blockInfo.paragraph, blockInfo.offset);
        textPosition.setPositionForLineWidget(lineInfo.line, lineInfo.offset);
        return textPosition;
    }
    /**
     * Get offset value to update in selection
     * @private
     */
    public getLineInfoBasedOnParagraph(paragraph: ParagraphWidget, offset: number): LineInfo {
        let position: TextPosition = undefined;
        let element: ElementBox = undefined;
        let length: number = this.getParagraphLength(paragraph);
        let next: ParagraphWidget = paragraph.nextSplitWidget as ParagraphWidget;
        if (offset > length + 1 && isNullOrUndefined(next)) {
            offset = length;
        }
        while (offset > length && next instanceof ParagraphWidget) {
            offset -= length;
            paragraph = next;
            length = this.getParagraphLength(paragraph);
            next = paragraph.nextSplitWidget as ParagraphWidget;
        }
        return this.getLineInfo(paragraph, offset);
    }
    /**
     * @private
     */
    public getParagraph(position: IndexInfo): ParagraphInfo {
        let paragraph: ParagraphWidget = this.getParagraphInternal(this.getBodyWidget(position), position);
        return { paragraph: paragraph, offset: parseInt(position.index, 10) };
    }
    /**
     * Gets body widget based on position.
     * @private
     */
    public getBodyWidget(position: IndexInfo): BlockContainer {
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
        let page: Page = this.documentHelper.pages[index];
        if (isHeader) {
            return page.headerWidget;
        } else {
            return page.footerWidget;
        }
    }
    /**
     * @private
     */
    public getBodyWidgetInternal(sectionIndex: number, blockIndex: number): BodyWidget {
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let bodyWidget: BodyWidget = this.documentHelper.pages[i].bodyWidgets[0];
            if (bodyWidget.index === sectionIndex) {
                if (bodyWidget.childWidgets.length > 0 && (bodyWidget.firstChild as Widget).index <= blockIndex &&
                    (bodyWidget.lastChild as Widget).index >= blockIndex) {
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
                        return this.documentHelper.selection.getFirstParagraphInFirstCell((child as TableWidget));
                    }
                    return undefined;
                }
            }
        } else if (container) {
            let nextWidget: Widget = container.getSplitWidgets().pop().nextRenderedWidget;
            if (nextWidget instanceof Widget) {
                position.index = '0';
                if (nextWidget instanceof TableWidget) {
                    return this.documentHelper.selection.getFirstParagraphInFirstCell((nextWidget as TableWidget));
                }
                return nextWidget as ParagraphWidget;
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
        let offset: number = this.getParagraphLength(paragraph, line) + lineOffset;
        let previous: ParagraphWidget = paragraph.previousSplitWidget as ParagraphWidget;
        while (previous instanceof ParagraphWidget) {
            paragraph = previous;
            offset += this.documentHelper.selection.getParagraphLength(paragraph);
            previous = paragraph.previousSplitWidget as ParagraphWidget;
        }
        return { 'paragraph': paragraph, 'offset': offset };
    }
    /**
     * @private
     */
    public getListTextElementBox(paragarph: ParagraphWidget): ListTextElementBox {
        if (isNullOrUndefined(paragarph)) {
            return undefined;
        }
        let listTextElement: ListTextElementBox;
        if (!paragarph.isEmpty()) {
            let lineWidget: LineWidget = paragarph.childWidgets[0] as LineWidget;
            if (lineWidget.children.length > 1) {
                if (lineWidget.children[0] instanceof ListTextElementBox) {
                    listTextElement = lineWidget.children[0] as ListTextElementBox;
                }
            }
        }
        return listTextElement;

    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getTextInline(inlineElement: ElementBox, endParagraphWidget: ParagraphWidget, endInline: ElementBox, endIndex: number, includeObject: boolean): string {
        let text: string = '';
        do {
            if (inlineElement === endInline) {
                if (inlineElement instanceof TextElementBox) {
                    let span: TextElementBox = inlineElement as TextElementBox;
                    if (!(isNullOrUndefined(span.text) || span.text === '')) {
                        if (span.text.length < endIndex) {
                            text = text + span.text;
                        } else {
                            text = text + span.text.substring(0, endIndex);
                        }
                    }
                    // tslint:disable-next-line:max-line-length
                } else if (inlineElement instanceof ImageElementBox && includeObject && endIndex === (inlineElement as ImageElementBox).length) {
                    text = text + ElementBox.objectCharacter;
                }
                return text;
            }
            if (inlineElement instanceof TextElementBox) {
                text = text + (inlineElement as TextElementBox).text;
            } else if (inlineElement instanceof ImageElementBox && includeObject) {
                text = text + ElementBox.objectCharacter;
            } else if (inlineElement instanceof FieldElementBox && !isNullOrUndefined((inlineElement as FieldElementBox).fieldEnd)) {
                if (!isNullOrUndefined((inlineElement as FieldElementBox).fieldSeparator)) {
                    inlineElement = (inlineElement as FieldElementBox).fieldSeparator;
                } else {
                    inlineElement = (inlineElement as FieldElementBox).fieldEnd;
                }
            }
            if (isNullOrUndefined(inlineElement.nextNode)) {
                break;
            }
            inlineElement = inlineElement.nextNode as ElementBox;
        } while (!isNullOrUndefined(inlineElement));
        if (endParagraphWidget as ParagraphWidget === inlineElement.line.paragraph) {
            return text;
        }
        // tslint:disable-next-line:max-line-length
        let nextParagraphWidget: ParagraphWidget = this.documentHelper.selection.getNextParagraphBlock(inlineElement.line.paragraph) as ParagraphWidget;
        while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.isEmpty()) {
            text = text + '\r';
            if (nextParagraphWidget === endParagraphWidget) {
                return text;
            }
            nextParagraphWidget = this.documentHelper.selection.getNextParagraphBlock(nextParagraphWidget) as ParagraphWidget;
        }
        if (!isNullOrUndefined(nextParagraphWidget) && !nextParagraphWidget.isEmpty()) {
            let lineWidget: LineWidget = nextParagraphWidget.childWidgets[0] as LineWidget;
            // tslint:disable-next-line:max-line-length
            text = text + '\r' + this.getTextInline(lineWidget.children[0] as ElementBox, endParagraphWidget, endInline, endIndex, includeObject);
        }
        return text;
    }
    /**
     * Returns field code.
     * @private
     * @param fieldBegin 
     */
    public getFieldCode(fieldBegin: FieldElementBox): string {
        let fieldCode: string = '';
        if (!(fieldBegin.fieldEnd instanceof FieldElementBox)) {
            return fieldCode;
        }
        let paragraph: ParagraphWidget = fieldBegin.paragraph;
        let endParagraph: ParagraphWidget = fieldBegin.fieldEnd.paragraph;
        if (fieldBegin.fieldSeparator instanceof FieldElementBox) {
            endParagraph = fieldBegin.fieldSeparator.paragraph;
        }
        let startLineIndex: number = fieldBegin.line.indexInOwner;
        let startIndex: number = fieldBegin.indexInOwner;
        do {
            fieldCode += this.getFieldCodeInternal(paragraph, startLineIndex, startIndex);
            if (paragraph === endParagraph) {
                break;
            }
            paragraph = this.getNextParagraphBlock(paragraph);
            startLineIndex = 0;
            startIndex = 0;
        } while (paragraph instanceof ParagraphWidget);

        return fieldCode.trim();
    }
    private getFieldCodeInternal(paragraph: ParagraphWidget, startLineIndex: number, inlineIndex: number): string {
        let fieldCode: string = '';
        for (let i: number = startLineIndex; i < paragraph.childWidgets.length; i++) {
            let line: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let i: number = inlineIndex; i < line.children.length; i++) {
                let element: ElementBox = line.children[i];
                if (element instanceof TextElementBox) {
                    fieldCode += element.text;
                }
                if (element instanceof FieldElementBox
                    && ((element as FieldElementBox).fieldType === 2 || (element as FieldElementBox).fieldType === 1)) {
                    return fieldCode;
                }
            }
            inlineIndex = 0;
        }
        return fieldCode;
    }
    /**
     * @private
     */
    public getTocFieldInternal(): FieldElementBox {
        let paragraph: ParagraphWidget = this.start.paragraph;
        if (!this.isEmpty && !this.isForward) {
            paragraph = this.end.paragraph;
        }
        while (paragraph instanceof ParagraphWidget && paragraph.childWidgets.length > 0) {
            let line: LineWidget = paragraph.firstChild as LineWidget;
            if (line.children.length > 0) {
                let element: ElementBox = line.children[0];
                let nextElement: ElementBox = element.nextNode;
                if (element instanceof FieldElementBox && element.fieldType === 0 && nextElement instanceof TextElementBox
                    && nextElement.text.trim().toLowerCase().indexOf('toc') === 0) {
                    return element;
                }
            }
            paragraph = paragraph.previousRenderedWidget as ParagraphWidget;
        }
        return undefined;
    }
    /**
     * Get next paragraph in bodyWidget
     * @private
     */
    public getNextParagraph(section: BodyWidget): ParagraphWidget {
        if (section.nextRenderedWidget instanceof BodyWidget) {
            let block: BlockWidget = (section.nextRenderedWidget as BodyWidget).childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(block);
        }
        return undefined;
    }
    /**
     * @private
     */
    public getPreviousParagraph(section: BodyWidget): ParagraphWidget {
        if (section.previousRenderedWidget instanceof BodyWidget) {
            let bodyWidget: BodyWidget = section.previousRenderedWidget as BodyWidget;
            let block: BlockWidget = bodyWidget.childWidgets[bodyWidget.childWidgets.length - 1] as BlockWidget;
            return this.getLastParagraphBlock(block);
        }
        return undefined;
    }
    /**
     * Get first paragraph in cell
     * @private
     */
    public getFirstParagraphInCell(cell: TableCellWidget): ParagraphWidget {
        let firstBlock: BlockWidget = cell.childWidgets[0] as BlockWidget;
        if (firstBlock instanceof ParagraphWidget) {
            return firstBlock as ParagraphWidget;
        } else {
            return this.getFirstParagraphInFirstCell((firstBlock as TableWidget));
        }
    }
    /**
     * Get first paragraph in first cell
     * @private
     */
    public getFirstParagraphInFirstCell(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            let firstRow: TableRowWidget = table.childWidgets[0] as TableRowWidget;
            let cell: TableCellWidget = firstRow.childWidgets[0] as TableCellWidget;
            let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(block);
        }
        return undefined;
    }
    /**
     * Get last paragraph in last cell
     * @private
     */
    public getLastParagraphInLastCell(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            let lastrow: TableRowWidget = table.lastChild as TableRowWidget;
            let lastcell: TableCellWidget = lastrow.lastChild as TableCellWidget;
            let lastBlock: BlockWidget = lastcell.lastChild as BlockWidget;
            return this.getLastParagraphBlock(lastBlock);
        }
        return undefined;
    }
    /**
     * Get last paragraph in first row
     * @private
     */
    public getLastParagraphInFirstRow(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            let row: TableRowWidget = table.firstChild as TableRowWidget;
            let lastcell: TableCellWidget = row.lastChild as TableCellWidget;
            let lastBlock: BlockWidget = lastcell.lastChild as BlockWidget;
            return this.getLastParagraphBlock(lastBlock);
        }
        return undefined;
    }

    /**
     * Get Next start inline
     * @private
     */
    public getNextStartInline(line: LineWidget, offset: number): ElementBox {
        let indexInInline: number = 0;
        let inlineObj: ElementInfo = line.getInline(offset, indexInInline);
        let inline: ElementBox = inlineObj.element;
        indexInInline = inlineObj.index;
        if (!isNullOrUndefined(inline) && indexInInline === inline.length && inline.nextNode instanceof FieldElementBox) {
            let nextValidInline: ElementBox = this.getNextValidElement((inline.nextNode as ElementBox));
            if (nextValidInline instanceof FieldElementBox && nextValidInline.fieldType === 0) {
                inline = nextValidInline;
            }
        }
        return inline;
    }
    /**
     * Get previous text inline
     * @private
     */
    public getPreviousTextInline(inline: ElementBox): ElementBox {
        if (inline.previousNode instanceof TextElementBox) {
            return inline.previousNode;
        }
        if (inline.previousNode instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter(inline.previousNode)) {
            if (inline.previousNode.fieldType === 0 || inline.previousNode.fieldType === 1) {
                return inline.previousNode;
            }
            return inline.previousNode.fieldBegin;
        }
        if (!isNullOrUndefined(inline.previousNode)) {
            return this.getPreviousTextInline((inline.previousNode));
        }
        return undefined;
    }
    /**
     * Get next text inline
     * @private
     */
    public getNextTextInline(inline: ElementBox): ElementBox {
        if (inline.nextNode instanceof TextElementBox) {
            return inline.nextNode;
        }
        if (inline.nextNode instanceof FieldElementBox && (HelperMethods.isLinkedFieldCharacter((inline.nextNode as FieldElementBox)))) {
            if (inline.nextNode.fieldType === 1 || inline.nextNode.fieldType === 0) {
                return inline.nextNode as ElementBox;
            }
            return (inline.nextNode as FieldElementBox).fieldEnd;
        }
        if (!isNullOrUndefined(inline.nextNode)) {
            return this.getNextTextInline((inline.nextNode));
        }
        return undefined;
    }
    /**
     * Get container table
     * @private
     */
    public getContainerTable(block: BlockWidget): TableWidget {
        if (block.isInsideTable) {
            if (block.associatedCell.ownerTable.isInsideTable) {
                block = this.getContainerTable(block.associatedCell.ownerTable);
            } else {
                block = block.associatedCell.ownerTable;
            }
        }
        if (block instanceof TableWidget) {
            return block as TableWidget;
        }
        return undefined;
    }
    /**
     * @private
     */
    public isExistBefore(start: BlockWidget, block: BlockWidget): boolean {
        if (start.isInsideTable) {
            let cell1: TableCellWidget = start.associatedCell;
            if (block.isInsideTable) {
                let cell2: TableCellWidget = block.associatedCell;
                if (cell1 === cell2) {
                    return cell1.childWidgets.indexOf(start) < cell1.childWidgets.indexOf(block);
                }
                if (cell1.ownerRow === cell2.ownerRow) {
                    return cell1.cellIndex < cell2.cellIndex;
                }
                if (cell1.ownerTable === cell2.ownerTable) {
                    return cell1.ownerRow.rowIndex < cell2.ownerRow.rowIndex;
                }
                //Checks if current block exists before the block.
                let containerCell: TableCellWidget = this.getContainerCellOf(cell1, cell2);
                if (containerCell.ownerTable.contains(cell2)) {
                    cell1 = this.getSelectedCell(cell1, containerCell);
                    cell2 = this.getSelectedCell(cell2, containerCell);
                    if (cell1 === containerCell) {
                        return this.isExistBefore(start, cell2.ownerTable);
                    }
                    if (cell2 === containerCell) {
                        return this.isExistBefore(cell1.ownerTable, block);
                    }
                    if (containerCell.ownerRow === cell2.ownerRow) {
                        return containerCell.cellIndex < cell2.cellIndex;
                    }
                    if (containerCell.ownerTable === cell2.ownerTable) {
                        return containerCell.ownerRow.rowIndex < cell2.ownerRow.rowIndex;
                    }
                    return this.isExistBefore(cell1.ownerTable, cell2.ownerTable);
                }
                return this.isExistBefore(containerCell.ownerTable, this.getContainerTable(cell2.ownerTable));
            } else {
                let ownerTable: TableWidget = this.getContainerTable(start) as TableWidget;
                return this.isExistBefore(ownerTable, block);
            }
        } else if (block.isInsideTable) {
            let ownerTable: TableWidget = this.getContainerTable(block) as TableWidget;
            return this.isExistBefore(start, ownerTable);
        } else {
            {
                if (start.containerWidget === block.containerWidget) {
                    return start.index <
                        block.index;

                }
                if (start.containerWidget instanceof BodyWidget && block.containerWidget instanceof BodyWidget) {
                    //Splitted blocks                     
                    let startPage: number = this.documentHelper.pages.indexOf(start.containerWidget.page);
                    let endPage: number = this.documentHelper.pages.indexOf(block.containerWidget.page);
                    return startPage < endPage;
                }

            }
        }
        return false;
    }
    /**
     * @private
     */
    public isExistAfter(start: BlockWidget, block: BlockWidget): boolean {
        if (start.isInsideTable) {
            let cell1: TableCellWidget = start.associatedCell;
            //Current paragraph in cell, paragraph in cell
            if (block.isInsideTable) {
                let cell2: TableCellWidget = block.associatedCell;
                if (cell1 === cell2) {
                    return cell1.childWidgets.indexOf(start) > cell1.childWidgets.indexOf(block);
                }
                if (cell1.ownerRow === cell2.ownerRow) {
                    return cell1.cellIndex > cell2.cellIndex;
                }
                if (cell1.ownerTable === cell2.ownerTable) {
                    return cell1.ownerRow.rowIndex > cell2.ownerRow.rowIndex;
                }
                //Checks if this block exists before block.
                let containerCell: TableCellWidget = this.getContainerCellOf(cell1, cell2);
                if (containerCell.ownerTable.contains(cell2)) {
                    cell1 = this.getSelectedCell(cell1, containerCell);
                    cell2 = this.getSelectedCell(cell2, containerCell);
                    if (cell1 === containerCell) {
                        return this.isExistAfter(start, cell2.ownerTable);
                    }
                    if (cell2 === containerCell) {
                        return this.isExistAfter(cell1.ownerTable, block);
                    }
                    if (containerCell.ownerRow === cell2.ownerRow) {
                        return containerCell.cellIndex > cell2.cellIndex;
                    }
                    if (containerCell.ownerTable === cell2.ownerTable) {
                        return containerCell.ownerRow.rowIndex > cell2.ownerRow.rowIndex;
                    }
                    return this.isExistAfter(cell1.ownerTable, cell2.ownerTable);
                }
                return this.isExistAfter(containerCell.ownerTable, this.getContainerTable(cell2.ownerTable));
            } else {
                let ownerTable: TableWidget = this.getContainerTable(start) as TableWidget;
                return this.isExistAfter(ownerTable, block);
            }
        } else if (block.isInsideTable) {
            let ownerTable: TableWidget = this.getContainerTable(block) as TableWidget;
            return this.isExistAfter(start, ownerTable);
        } else {
            if (start.containerWidget === block.containerWidget) {
                return start.index >
                    block.index;

            }
            if (start.containerWidget instanceof BodyWidget && block.containerWidget instanceof BodyWidget) {
                //Splitted blocks                     
                let startPage: number = this.documentHelper.pages.indexOf(start.containerWidget.page);
                let endPage: number = this.documentHelper.pages.indexOf(block.containerWidget.page);
                return startPage > endPage;
            }
            //     if (start.owner instanceof WHeaderFooter) {
            //         return (start.owner as WHeaderFooter).childWidgets.indexOf(start) 
            // > (block.owner as WHeaderFooter).childWidgets.indexOf(block);
            //     } else if (start.section === block.section && start.section instanceof WSection) {
            //         return (start.section as WSection).childWidgets.indexOf(start)
            //  > (start.section as WSection).childWidgets.indexOf(block);
            //     } else if (start.wordDocument instanceof WordDocument) {
            // tslint:disable-next-line:max-line-length
            //         return (start.wordDocument as WordDocument).sections.indexOf(start.section as WSection) > (start.wordDocument as WordDocument).sections.indexOf(block.section as WSection);

        }
        return false;
    }

    /**
     * Return true if current inline in exist before inline
     * @private
     */
    public isExistBeforeInline(currentInline: ElementBox, inline: ElementBox): boolean {
        if (currentInline.line === inline.line) {
            return currentInline.line.children.indexOf(currentInline) <
                inline.line.children.indexOf(inline);
        }
        if (currentInline.line.paragraph === inline.line.paragraph) {
            return currentInline.line.paragraph.childWidgets.indexOf(currentInline.line)
                < inline.line.paragraph.childWidgets.indexOf(inline.line);
        }
        let startParagraph: ParagraphWidget = currentInline.line.paragraph;
        let endParagraph: ParagraphWidget = inline.line.paragraph;
        if (startParagraph.containerWidget === endParagraph.containerWidget) {
            if (startParagraph.isInsideTable) {
                return startParagraph.associatedCell.childWidgets.indexOf(startParagraph) <
                    endParagraph.associatedCell.childWidgets.indexOf(endParagraph);
            } else if (startParagraph.containerWidget instanceof HeaderFooterWidget) {
                // return ((currentInline.owner as WParagraph).owner as WHeaderFooter).blocks.indexOf(currentInline.owner as WParagraph) <
                //     ((inline.owner as WParagraph).owner as WHeaderFooter).blocks.indexOf(inline.owner as WParagraph);
            } else {
                return startParagraph.containerWidget.childWidgets.indexOf(startParagraph) <
                    endParagraph.containerWidget.childWidgets.indexOf(endParagraph);
            }
        }
        return this.isExistBefore(startParagraph, endParagraph);
    }
    /**
     * Return true id current inline is exist after inline
     * @private
     */
    public isExistAfterInline(currentInline: ElementBox, inline: ElementBox): boolean {
        if (currentInline.line === inline.line) {
            return currentInline.line.children.indexOf(currentInline) >
                inline.line.children.indexOf(inline);
        }
        if (currentInline.line.paragraph === inline.line.paragraph) {
            return currentInline.line.paragraph.childWidgets.indexOf(currentInline.line)
                > inline.line.paragraph.childWidgets.indexOf(inline.line);
        }
        let startParagraph: ParagraphWidget = currentInline.line.paragraph;
        let endParagraph: ParagraphWidget = inline.line.paragraph;
        if (startParagraph.containerWidget === endParagraph.containerWidget) {
            if (startParagraph.isInsideTable) {
                return startParagraph.associatedCell.childWidgets.indexOf(startParagraph) >
                    endParagraph.associatedCell.childWidgets.indexOf(endParagraph);
            } else if (startParagraph.containerWidget instanceof HeaderFooterWidget) {
                // return ((currentInline.owner as WParagraph).owner as WHeaderFooter).blocks.indexOf(currentInline.owner as WParagraph) <
                //     ((inline.owner as WParagraph).owner as WHeaderFooter).blocks.indexOf(inline.owner as WParagraph);
            } else {
                return startParagraph.containerWidget.childWidgets.indexOf(startParagraph) >
                    endParagraph.containerWidget.childWidgets.indexOf(endParagraph);
            }
        }
        return this.isExistAfter(startParagraph, endParagraph);
    }
    /**
     * Get next rendered block
     * @private
     */
    public getNextRenderedBlock(block: BlockWidget): BlockWidget {
        if (isNullOrUndefined(block.nextWidget)) {
            return block.nextRenderedWidget as BlockWidget;
        }
        return block.nextWidget as BlockWidget;
    }
    /**
     * Get next rendered block
     * @private
     */
    public getPreviousRenderedBlock(block: BlockWidget): BlockWidget {
        if (isNullOrUndefined(block.previousWidget)) {
            return block.previousRenderedWidget as BlockWidget;
        }
        return block.previousWidget as BlockWidget;
    }
    /**
     * Get Next paragraph in block
     * @private
     */
    public getNextParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block.nextRenderedWidget instanceof ParagraphWidget) {
            return block.nextRenderedWidget as ParagraphWidget;
        } else if (block.nextRenderedWidget instanceof TableWidget) {
            return this.getFirstParagraphInFirstCell((block.nextRenderedWidget as TableWidget));
        }
        if ((block as BlockWidget).containerWidget instanceof TableCellWidget) {
            return this.getNextParagraphCell(((block as BlockWidget).containerWidget as TableCellWidget));
        } else if ((block as BlockWidget).containerWidget instanceof BodyWidget) {
            let bodyWidget: BodyWidget = (block as BlockWidget).containerWidget as BodyWidget;
            return this.getNextParagraph((block as BlockWidget).containerWidget as BodyWidget);
        } else if (block.containerWidget instanceof HeaderFooterWidget && this.isMoveDownOrMoveUp) {
            return this.getFirstBlockInNextHeaderFooter(block);
        }
        return undefined;
    }
    /**
     * @private
     */
    public getFirstBlockInNextHeaderFooter(block: BlockWidget): ParagraphWidget {
        let headerFooter: HeaderFooterWidget = block.containerWidget as HeaderFooterWidget;
        let nextBlock: BlockWidget;
        if (headerFooter.headerFooterType.indexOf('Header') !== -1) {
            nextBlock = headerFooter.page.footerWidget.firstChild as BlockWidget;
        } else if (headerFooter.page.nextPage) {
            nextBlock = headerFooter.page.nextPage.headerWidget.firstChild as BlockWidget;
        } else {
            return undefined;
        }
        if (nextBlock instanceof ParagraphWidget) {
            return nextBlock;
        } else {
            return this.getFirstBlockInFirstCell(nextBlock as TableWidget) as ParagraphWidget;
        }
    }
    /**
     * @private
     */
    public getLastBlockInPreviousHeaderFooter(block: BlockWidget): ParagraphWidget {
        let headerFooter: HeaderFooterWidget = block.containerWidget as HeaderFooterWidget;
        let previousBlock: BlockWidget;
        if (headerFooter.headerFooterType.indexOf('Footer') !== -1) {
            previousBlock = headerFooter.page.headerWidget.lastChild as BlockWidget;
        } else if (headerFooter.page.previousPage) {
            previousBlock = headerFooter.page.previousPage.footerWidget.lastChild as BlockWidget;
        } else {
            return undefined;
        }
        if (previousBlock instanceof ParagraphWidget) {
            return previousBlock;
        } else {
            return this.getFirstBlockInFirstCell(previousBlock as TableWidget) as ParagraphWidget;
        }
    }
    /**
     * Get previous paragraph in block
     * @private
     */
    public getPreviousParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block.previousRenderedWidget instanceof ParagraphWidget) {
            return block.previousRenderedWidget as ParagraphWidget;
        } else if (block.previousRenderedWidget instanceof TableWidget) {
            return this.getLastParagraphInLastCell((block.previousRenderedWidget));
        }
        if (block.containerWidget instanceof TableCellWidget) {
            return this.getPreviousParagraphCell((block.containerWidget)) as ParagraphWidget;
        } else if (block.containerWidget instanceof BodyWidget) {
            return this.getPreviousParagraph(block.containerWidget);
        } else if (block.containerWidget instanceof HeaderFooterWidget && this.isMoveDownOrMoveUp) {
            return this.getLastBlockInPreviousHeaderFooter(block);
        }
        return undefined;
    }

    /**
     * Get first paragraph in block
     * @private
     */
    public getFirstParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget) {
            return block as ParagraphWidget;
        } else if (block instanceof TableWidget) {
            return this.getFirstParagraphInFirstCell(block as TableWidget);
        }
        return undefined;
    }
    /**
     * Get last paragraph in block
     * @private
     */
    public getLastParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget) {
            return block as ParagraphWidget;
        } else if (block instanceof TableWidget) {
            return this.getLastParagraphInLastCell(block as TableWidget);
        }
        return undefined;
    }
    /**
     * Return true if paragraph has valid inline
     * @private
     */
    public hasValidInline(paragraph: ParagraphWidget, start: ElementBox, end: ElementBox): boolean {
        let index: number = paragraph.childWidgets.indexOf(start.line);
        for (let i: number = index; i < paragraph.childWidgets.length; i++) {
            for (let j: number = 0; j < (paragraph.childWidgets[i] as LineWidget).children.length; j++) {
                let inline: ElementBox = (paragraph.childWidgets[i] as LineWidget).children[j];
                if (inline.length === 0) {
                    continue;
                }
                if (inline === end) {
                    return false;
                }
                if (inline instanceof TextElementBox || inline instanceof ImageElementBox
                    || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Get paragraph length
     * @private
     */
    public getParagraphLength(paragraph: ParagraphWidget, endLine?: LineWidget, elementInfo?: ElementInfo): number {
        let length: number = 0;
        for (let j: number = 0; j < paragraph.childWidgets.length; j++) {
            let line: LineWidget = paragraph.childWidgets[j] as LineWidget;
            if (endLine instanceof LineWidget && endLine === line) {
                if (elementInfo) {
                    length += this.getLineLength(line, elementInfo);
                }
                break;
            }
            length += this.getLineLength(line);
        }
        return length;
    }
    /**
     * Get Line length
     * @private
     */
    public getLineLength(line: LineWidget, elementInfo?: ElementInfo): number {
        let length: number = 0;
        let bidi: boolean = line.paragraph.bidi;
        for (let i: number = !bidi ? 0 : line.children.length - 1; bidi ? i > -1 : i < line.children.length; bidi ? i-- : i++) {
            let element: ElementBox = line.children[i] as ElementBox;
            if (element instanceof ListTextElementBox) {
                continue;
            }
            if (elementInfo && elementInfo.element instanceof ElementBox && elementInfo.element === element) {
                length += elementInfo.index;
                break;
            }
            length += element.length;
        }
        return length;
    }
    /**
     * Get line information
     * @private
     */
    public getLineInfo(paragraph: ParagraphWidget, offset: number): LineInfo {
        let line: LineWidget = undefined;
        let length: number = 0;
        let childLength: number = paragraph.childWidgets.length;
        for (let j: number = 0; j < childLength; j++) {
            line = paragraph.childWidgets[j] as LineWidget;
            length = this.getLineLength(line);
            if (offset <= length || j === childLength - 1) {
                break;
            } else {
                offset = offset - length;
            }
        }
        return { 'line': line, 'offset': offset };
    }
    /**
     * @private
     */
    public getElementInfo(line: LineWidget, offset: number): ElementInfo {
        let index: number = 0;
        let element: ElementBox = undefined;
        for (let i: number = 0; i < line.children.length; i++) {
            element = line.children[i] as ElementBox;
            if (element instanceof ListTextElementBox) {
                continue;
            }
            if (offset > element.length
                && (!(offset === element.length + 1 && isNullOrUndefined(element.nextNode)))) {
                offset = offset - element.length;
            } else {
                break;
            }
        }
        return { 'element': element, 'index': offset };
    }
    /**
     * Get paragraph start offset
     * @private
     */
    public getStartOffset(paragraph: ParagraphWidget): number {
        let startOffset: number = 0;
        if (paragraph.childWidgets.length > 0) {
            let childWidgets: LineWidget = paragraph.childWidgets[0] as LineWidget;
            return this.getStartLineOffset(childWidgets);
        }
        return startOffset;
    }
    /**
     * @private
     */
    public getStartLineOffset(line: LineWidget): number {
        let startOffset: number = 0;
        for (let i: number = 0; i < line.children.length; i++) {
            let inline: ElementBox = line.children[i] as ElementBox;
            if (inline.length === 0) {
                continue;
            }
            // tslint:disable-next-line:max-line-length
            if (inline instanceof TextElementBox || inline instanceof ImageElementBox || inline instanceof BookmarkElementBox
                || inline instanceof EditRangeStartElementBox || inline instanceof EditRangeEndElementBox || inline instanceof CommentCharacterElementBox
                || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                return startOffset;
            }
            if (inline instanceof ListTextElementBox) {
                continue;
            }
            startOffset += inline.length;
        }
        return startOffset;
    }
    /**
     * Get previous paragraph from selection
     * @private
     */
    public getPreviousSelectionCell(cell: TableCellWidget): ParagraphWidget {
        if (!isNullOrUndefined(cell.previousRenderedWidget)) {
            if (!this.isForward) {
                let block: BlockWidget = (cell.previousRenderedWidget as TableCellWidget).childWidgets[0] as BlockWidget;
                if (block instanceof ParagraphWidget) {
                    return block as ParagraphWidget;
                } else {
                    return this.getFirstParagraphInLastRow(block as TableWidget);
                }
            } else {
                let widgets: IWidget[] = (cell.previousRenderedWidget as TableCellWidget).childWidgets;
                let block: BlockWidget = widgets[widgets.length - 1] as BlockWidget;
                if (block instanceof ParagraphWidget) {
                    return block as ParagraphWidget;
                } else {
                    // tslint:disable-next-line:max-line-length
                    return this.getPreviousParagraphSelection(((block as TableWidget).childWidgets[(block as TableWidget).childWidgets.length - 1] as TableRowWidget));
                }
            }
        }
        return this.getPreviousSelectionRow(cell.ownerRow);
    }
    /**
     * Get previous paragraph selection in selection
     * @private
     */
    public getPreviousSelectionRow(row: TableRowWidget): ParagraphWidget {
        if (!isNullOrUndefined(row.previousRenderedWidget)) {
            if (!this.isForward) {
                let cell: TableCellWidget = (row.previousRenderedWidget as TableRowWidget).childWidgets[0] as TableCellWidget;
                let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
                return this.getFirstParagraphBlock(block);
            } else {
                return this.getPreviousParagraphSelection((row.previousRenderedWidget as TableRowWidget));
            }
        }
        return this.getPreviousSelectionBlock(row.ownerTable);
    }
    /**
     * @private
     */
    public getNextSelectionBlock(block: BlockWidget): ParagraphWidget {
        if (block.nextRenderedWidget instanceof ParagraphWidget) {
            return block.nextRenderedWidget as ParagraphWidget;
        } else if (block.nextRenderedWidget instanceof TableWidget) {
            if (this.isEmpty || this.isForward) {
                return this.getLastParagraphInFirstRow(block.nextRenderedWidget);
            } else {
                return this.getNextParagraphSelection(((block.nextRenderedWidget as TableWidget).childWidgets[0] as TableRowWidget));
            }
        }
        if (block.containerWidget instanceof TableCellWidget) {
            return this.getNextSelectionCell((block.containerWidget as TableCellWidget));
        } else if (block.containerWidget instanceof BodyWidget) {
            return this.getNextSelection(block.containerWidget as BodyWidget);
        }
        return undefined;
    }
    /**
     * Get next paragraph from selected cell
     * @private
     */
    public getNextSelectionCell(cell: TableCellWidget): ParagraphWidget {
        if (!isNullOrUndefined(cell.nextRenderedWidget)) {
            if (this.isEmpty || this.isForward) {
                // tslint:disable-next-line:max-line-length
                let block: BlockWidget = (cell.nextRenderedWidget as TableCellWidget).childWidgets[(cell.nextRenderedWidget as TableCellWidget).childWidgets.length - 1] as BlockWidget;
                return this.getLastParagraphBlock(block);
            } else {
                //Return first paragraph in cell. 
                let block: BlockWidget = (cell.nextRenderedWidget as TableCellWidget).childWidgets[0] as BlockWidget;
                if (block instanceof ParagraphWidget) {
                    return block as ParagraphWidget;
                } else {
                    return this.getNextParagraphSelection(((block as TableWidget).childWidgets[0] as TableRowWidget));
                }
            }
        }
        return this.getNextSelectionRow(cell.ownerRow);
    }
    /**
     * Get next paragraph in selection
     * @private
     */
    public getNextSelectionRow(row: TableRowWidget): ParagraphWidget {
        if (!isNullOrUndefined(row.nextRenderedWidget)) {
            let isForwardSelection: boolean = this.isEmpty || this.isForward;
            if (isForwardSelection) {
                // tslint:disable-next-line:max-line-length
                let cell: TableCellWidget = (row.nextRenderedWidget as TableRowWidget).childWidgets[(row.nextRenderedWidget as TableRowWidget).childWidgets.length - 1] as TableCellWidget;
                let block: BlockWidget = cell.childWidgets[cell.childWidgets.length - 1] as BlockWidget;
                return this.getLastParagraphBlock(block);
            } else {
                return this.getNextParagraphSelection(row.nextRenderedWidget as TableRowWidget);
            }
        }
        return this.getNextSelectionBlock(row.ownerTable);
    }
    /**
     * Get next block with selection
     * @private
     */
    public getNextSelection(section: BodyWidget): ParagraphWidget {
        if (section.nextRenderedWidget instanceof BodyWidget) {
            let block: BlockWidget = (section.nextRenderedWidget as BodyWidget).childWidgets[0] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                return block as ParagraphWidget;
            } else {
                if (this.isEmpty || this.isForward) {
                    return this.getLastParagraphInFirstRow((block as TableWidget));
                } else {
                    return this.getNextParagraphSelection(((block as TableWidget).childWidgets[0] as TableRowWidget));
                }
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getNextParagraphSelection(row: TableRowWidget): ParagraphWidget {
        //Iterate the exact cell based on UP/Down selection length.
        let cell: TableCellWidget = row.childWidgets[0] as TableCellWidget;
        if (this.start.paragraph.isInsideTable
            && row.ownerTable.contains(this.start.paragraph.associatedCell)) {
            let startCell: TableCellWidget = this.getCellInTable(row.ownerTable, this.start.paragraph.associatedCell);
            cell = this.getFirstCellInRegion(row, startCell, this.upDownSelectionLength, false);
        }
        let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
        return this.getFirstParagraphBlock(block);
    }
    /**
     * @private
     */
    public getPreviousSelectionBlock(block: BlockWidget): ParagraphWidget {
        if (block.previousRenderedWidget instanceof ParagraphWidget) {
            return block.previousRenderedWidget as ParagraphWidget;
        } else if (block.previousRenderedWidget instanceof TableWidget) {
            if (!this.isForward) {
                return this.getFirstParagraphInLastRow(block.previousRenderedWidget as TableWidget);
            } else {
                // tslint:disable-next-line:max-line-length
                return this.getPreviousParagraphSelection(((block.previousRenderedWidget as TableWidget).childWidgets[(block.previousRenderedWidget as TableWidget).childWidgets.length - 1] as TableRowWidget));
            }
        }
        if (block.containerWidget instanceof TableCellWidget) {
            return this.getPreviousSelectionCell(block.containerWidget as TableCellWidget);
        } else if (block.containerWidget instanceof BodyWidget) {
            return this.getPreviousSelection(block.containerWidget as BodyWidget);
        }
        return undefined;
    }
    /**
     * Get previous paragraph in selection
     * @private 
     */
    public getPreviousSelection(section: BodyWidget): ParagraphWidget {
        if (section.previousRenderedWidget instanceof BodyWidget) {
            let prevBodyWidget: BodyWidget = (section.previousRenderedWidget as BodyWidget);
            let block: BlockWidget = prevBodyWidget.childWidgets[prevBodyWidget.childWidgets.length - 1] as BlockWidget;
            if (block instanceof ParagraphWidget) {
                return block as ParagraphWidget;
            } else {
                if (!this.isForward) {
                    return this.getFirstParagraphInLastRow(block as TableWidget);
                } else {
                    let tableWidget: TableWidget = block as TableWidget;
                    // tslint:disable-next-line:max-line-length
                    return this.getPreviousParagraphSelection(tableWidget.childWidgets[tableWidget.childWidgets.length - 1] as TableRowWidget);
                }
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getPreviousParagraphSelection(row: TableRowWidget): ParagraphWidget {
        //Iterate the exact cell based on UP/Down selection length.
        let cell: TableCellWidget = row.childWidgets[row.childWidgets.length - 1] as TableCellWidget;
        if (this.start.paragraph.isInsideTable
            && row.ownerTable.contains(this.start.paragraph.associatedCell)) {
            let startCell: TableCellWidget = this.getCellInTable(row.ownerTable, this.start.paragraph.associatedCell);
            cell = this.getLastCellInRegion(row, startCell, this.upDownSelectionLength, true);
        }
        let block: BlockWidget = cell.childWidgets[cell.childWidgets.length - 1] as BlockWidget;
        return this.getLastParagraphBlock(block);
    }
    /**
     * Get last cell in the selected region
     * @private
     */
    public getLastCellInRegion(row: TableRowWidget, startCell: TableCellWidget, selLength: number, isMovePrev: boolean): TableCellWidget {
        let start: number = this.getCellLeft(row, startCell);
        let end: number = start + startCell.cellFormat.cellWidth;
        let flag: boolean = true;
        if (start <= selLength && selLength < end) {
            for (let i: number = row.childWidgets.length - 1; i >= 0; i--) {
                let left: number = this.getCellLeft(row, row.childWidgets[i] as TableCellWidget);
                if (HelperMethods.round(start, 2) <= HelperMethods.round(left, 2) &&
                    HelperMethods.round(left, 2) < HelperMethods.round(end, 2)) {
                    flag = false;
                    return row.childWidgets[i] as TableCellWidget;
                }
            }
        } else {
            for (let i: number = row.childWidgets.length - 1; i >= 0; i--) {
                let left: number = this.getCellLeft(row, row.childWidgets[i] as TableCellWidget);
                if (left <= selLength && left + (row.childWidgets[i] as TableCellWidget).cellFormat.cellWidth > selLength) {
                    flag = false;
                    return row.childWidgets[i] as TableCellWidget;
                }
            }
        }
        if (flag) {
            if (!isNullOrUndefined(row.previousRenderedWidget) && isMovePrev) {
                return this.getLastCellInRegion(row.previousRenderedWidget as TableRowWidget, startCell, selLength, isMovePrev);
            } else if (!isNullOrUndefined(row.nextRenderedWidget) && !isMovePrev) {
                return this.getLastCellInRegion(row.nextRenderedWidget as TableRowWidget, startCell, selLength, isMovePrev);
            }
        }
        return row.childWidgets[row.childWidgets.length - 1] as TableCellWidget;
    }
    /**
     * Get Container table
     * @private
     */
    public getCellInTable(table: TableWidget, tableCell: TableCellWidget): TableCellWidget {
        while (tableCell.ownerTable.isInsideTable) {
            if (table.equals(tableCell.ownerTable)) {
                return tableCell;
            }
            tableCell = tableCell.ownerTable.associatedCell;
        }
        return tableCell;
    }
    /**
     * Get first paragraph in last row
     * @private
     */
    public getFirstParagraphInLastRow(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            let lastRow: TableRowWidget = table.childWidgets[table.childWidgets.length - 1] as TableRowWidget;
            let lastCell: TableCellWidget = lastRow.childWidgets[0] as TableCellWidget;
            let lastBlock: BlockWidget = lastCell.childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(lastBlock);
        }
        return undefined;
    }
    /**
     * Get previous valid offset
     * @private
     */
    public getPreviousValidOffset(paragraph: ParagraphWidget, offset: number): number {
        if (offset === 0) {
            return 0;
        }
        let validOffset: number = 0;
        let count: number = 0;
        let value: number = 0;
        let bidi: boolean = paragraph.paragraphFormat.bidi;
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (!bidi) {
                for (let j: number = 0; j < lineWidget.children.length; j++) {
                    let inline: ElementBox = lineWidget.children[j] as ElementBox;
                    if (inline.length === 0) {
                        continue;
                    }
                    if (offset <= count + inline.length) {
                        return offset - 1 === count ? validOffset : offset - 1;
                    }
                    if (inline instanceof TextElementBox || inline instanceof ImageElementBox
                        || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                        validOffset = count + inline.length;
                    }
                    count += inline.length;
                }
            } else {
                value = lineWidget.getInlineForOffset(offset, false, undefined, false, true, false).index;
                if (value >= 0) {
                    return value;
                }
            }
        }
        return offset - 1 === count ? validOffset : offset - 1;
    }
    /**
     * Get next valid offset
     * @private
     */
    public getNextValidOffset(line: LineWidget, offset: number): number {
        let count: number = 0;
        if (!line.paragraph.paragraphFormat.bidi) {
            for (let i: number = 0; i < line.children.length; i++) {
                let inline: ElementBox = line.children[i] as ElementBox;
                if (inline.length === 0 || inline instanceof ListTextElementBox) {
                    continue;
                }
                if (offset < count + inline.length) {
                    if (inline instanceof TextElementBox || inline instanceof ImageElementBox
                        || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                        return (offset > count ? offset : count) + 1;
                    }
                }
                count += inline.length;
            }
        } else {
            if (offset !== this.getLineLength(line)) {
                offset = line.getInlineForOffset(offset, false, undefined, false, false, true).index;
            }
        }
        return offset;
    }

    /**
     * Get paragraph mark size info
     * @private
     */
    public getParagraphMarkSize(paragraph: ParagraphWidget, topMargin: number, bottomMargin: number): SizeInfo {
        let size: TextSizeInfo = this.documentHelper.textHelper.getParagraphMarkSize(paragraph.characterFormat);
        let baselineOffset: number = size.BaselineOffset;
        let maxHeight: number = size.Height;
        let maxBaselineOffset: number = baselineOffset;
        if (paragraph instanceof ParagraphWidget) {
            // let paragraphWidget: ParagraphWidget[] = paragraph.renderedElement() as ParagraphWidget[];
            if (paragraph.childWidgets.length > 0) {
                let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
            }

            //Gets line spacing.
            let lineSpacing: number = this.documentHelper.layout.getLineSpacing(paragraph, maxHeight);
            let beforeSpacing: number = this.documentHelper.layout.getBeforeSpacing(paragraph);
            topMargin = maxBaselineOffset - baselineOffset;
            bottomMargin = maxHeight - maxBaselineOffset - (size.Height - baselineOffset);
            //Updates line spacing, paragraph after/ before spacing and aligns the text to base line offset.
            let lineSpacingType: LineSpacingType = paragraph.paragraphFormat.lineSpacingType;
            if (lineSpacingType === 'Multiple') {
                if (lineSpacing > maxHeight) {
                    bottomMargin += lineSpacing - maxHeight;
                } else {
                    topMargin += lineSpacing - maxHeight;
                }
            } else if (lineSpacingType === 'Exactly') {
                topMargin += lineSpacing - (topMargin + size.Height + bottomMargin);
            } else if (lineSpacing > topMargin + size.Height + bottomMargin) {
                topMargin += lineSpacing - (topMargin + size.Height + bottomMargin);
            }
            topMargin += beforeSpacing;
            bottomMargin += this.documentHelper.layout.getAfterSpacing(paragraph);
        }
        return { 'width': size.Width, 'height': size.Height, 'topMargin': topMargin, 'bottomMargin': bottomMargin };
    }
    /**
     * @private
     */
    public getPhysicalPositionInternal(line: LineWidget, offset: number, moveNextLine: boolean): Point {
        if (line.paragraph.isEmpty()) {
            let paragraphWidget: ParagraphWidget = line.paragraph;
            let left: number = paragraphWidget.x;
            if (paragraphWidget.childWidgets.length > 0) {
                let lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
                left = this.getLeft(lineWidget);
            }
            let topMargin: number = 0;
            let bottomMargin: number = 0;
            let size: SizeInfo = this.getParagraphMarkSize(line.paragraph, topMargin, bottomMargin);
            if (offset > 0) {
                left += size.width;
            }
            return new Point(left, paragraphWidget.y + topMargin);
        } else {
            let indexInInline: number = 0;
            let inlineObj: ElementInfo = line.getInline(offset, indexInInline, line.paragraph.bidi);
            let inline: ElementBox = inlineObj.element;           //return indexInInline must
            indexInInline = inlineObj.index;
            // tslint:disable-next-line:max-line-length
            // if (inline.length === indexInInline && !isNullOrUndefined(inline.nextNode) && this.viewer.renderedElements.containsKey(inline) &&
            //     this.viewer.renderedElements.get(inline).length > 0 && this.viewer.renderedElements.containsKey(inline.nextNode as WInline)
            //     && this.viewer.renderedElements.get(inline.nextNode as WInline).length > 0 &&
            // tslint:disable-next-line:max-line-length
            //     (this.viewer.renderedElements.get(inline)[this.viewer.renderedElements.get(inline).length - 1] as ElementBox).line !== (this.viewer.renderedElements.get(inline.nextNode as WInline)[0] as ElementBox).line) {
            //     //Handled specifically to move the cursor at start of next line.
            //     inline = inline.nextNode as WInline;
            //     indexInInline = 0;
            // }
            return this.getPhysicalPositionInline(inline, indexInInline, moveNextLine);
        }
    }
    /**
     * Highlight selected content 
     * @private
     */
    public highlightSelectedContent(start: TextPosition, end: TextPosition): void {
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || (!start.paragraph.associatedCell.equals(end.paragraph.associatedCell))
            || this.isCellSelected(start.paragraph.associatedCell, start, end))) {
            this.highlightCell(start.paragraph.associatedCell, this, start, end);
        } else {
            let inline: ElementBox = undefined;
            let index: number = 0;
            if (!this.owner.isReadOnlyMode && start.paragraph === end.paragraph) {
                if (start.offset + 1 === end.offset) {
                    let inlineObj: ElementInfo = end.currentWidget.getInline(end.offset, index);
                    inline = inlineObj.element;  // return index value
                    index = inlineObj.index;
                    if (inline instanceof ImageElementBox) {
                        let startOffset: number = start.currentWidget.getOffset(inline, 0);
                        if (startOffset !== start.offset) {
                            inline = undefined;
                        }
                    }
                } else {
                    let indexInInline: number = 0;
                    let startInlineObj: ElementInfo = start.currentWidget.getInline(start.offset, indexInInline);
                    let startInline: ElementBox = startInlineObj.element as ElementBox;        //return indexInInline
                    indexInInline = startInlineObj.index;
                    if (indexInInline === startInline.length) {
                        startInline = this.getNextRenderedElementBox(startInline, indexInInline);
                    }
                    let endInlineObj: ElementInfo = end.currentWidget.getInline(end.offset, indexInInline);
                    let endInline: ElementBox = endInlineObj.element;                //return indexInInline
                    indexInInline = endInlineObj.index;
                    // tslint:disable-next-line:max-line-length
                    if (startInline instanceof FieldElementBox && endInline instanceof FieldElementBox && !isNullOrUndefined((startInline as FieldElementBox).fieldSeparator)) {
                        let fieldValue: ElementBox = (startInline as FieldElementBox).fieldSeparator.nextNode as ElementBox;
                        if (fieldValue instanceof ImageElementBox && fieldValue.nextNode === endInline) {
                            inline = fieldValue;
                        }
                    }
                }
            }
            if (!this.owner.isReadOnlyMode && inline instanceof ImageElementBox && this.owner.isDocumentLoaded) {
                let elementBoxObj: ElementInfo = this.getElementBoxInternal(inline, index);
                let elementBox: ImageElementBox = elementBoxObj.element as ImageElementBox;     //return index 
                index = elementBoxObj.index;
                if (this.owner.enableImageResizerMode) {
                    this.owner.imageResizerModule.positionImageResizer(elementBox);
                    this.owner.imageResizerModule.showImageResizer();
                }
                if (this.documentHelper.isTouchInput) {
                    this.documentHelper.touchStart.style.display = 'none';
                    this.documentHelper.touchEnd.style.display = 'none';
                }
            } else {
                this.highlight(start.paragraph, start, end);
                if (this.isHighlightNext) {
                    this.highlightNextBlock(this.hightLightNextParagraph, start, end);
                    this.isHighlightNext = false;
                    this.hightLightNextParagraph = undefined;
                }
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable:max-func-body-length
    public highlight(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void {
        let selectionStartIndex: number = 0;
        let selectionEndIndex: number = 0;
        let startElement: ElementBox = undefined;
        let endElement: ElementBox = undefined;
        let startLineWidget: LineWidget = undefined;
        let endLineWidget: LineWidget = undefined;

        //return start Element and selection start index
        let startLineObj: ElementInfo = this.getStartLineWidget(paragraph, start, startElement, selectionStartIndex);
        startElement = startLineObj.element;
        if (isNullOrUndefined(startElement)) {
            startLineWidget = paragraph.childWidgets[0] as LineWidget;
        } else {
            startLineWidget = startElement.line;
        }
        selectionStartIndex = startLineObj.index;
        let endLineObj: ElementInfo = this.getEndLineWidget(end, endElement, selectionEndIndex);
        endElement = endLineObj.element;
        if (endElement) {
            endLineWidget = endElement.line;
        } else {
            endLineWidget = end.paragraph.childWidgets[end.paragraph.childWidgets.length - 1] as LineWidget;
        }
        selectionEndIndex = endLineObj.index;
        let top: number = 0;
        let left: number = 0;
        if (!isNullOrUndefined(startLineWidget)) {
            top = this.getTop(startLineWidget);
            left = this.getLeftInternal(startLineWidget, startElement, selectionStartIndex);
        }
        if (!isNullOrUndefined(startLineWidget) && startLineWidget === endLineWidget) {
            //Selection ends in current line.
            let right: number = this.getLeftInternal(endLineWidget, endElement, selectionEndIndex);
            let width: number = 0;
            let isRtlText: boolean = false;
            if (endElement instanceof TextElementBox) {
                isRtlText = endElement.isRightToLeft;
            }
            if (!isRtlText && startElement instanceof TextElementBox) {
                isRtlText = startElement.isRightToLeft;
            }
            width = Math.abs(right - left);
            // Handled the highlighting approach as genric for normal and rtl text.
            if (isRtlText || paragraph.bidi) {
                let elementBoxCollection: ElementBox[] = this.getElementsForward(startLineWidget, startElement, endElement, paragraph.bidi);
                if (elementBoxCollection && elementBoxCollection.length > 1) {
                    for (let i: number = 0; i < elementBoxCollection.length; i++) {
                        let element: ElementBox = elementBoxCollection[i];
                        let elementIsRTL: boolean = false;
                        let index: number = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                        if (element === startElement) {
                            left = this.getLeftInternal(startLineWidget, element, selectionStartIndex);
                            right = this.getLeftInternal(startLineWidget, element, index);
                        } else if (element === endElement) {
                            left = this.getLeftInternal(startLineWidget, element, 0);
                            right = this.getLeftInternal(startLineWidget, element, selectionEndIndex);
                        } else {
                            left = this.getLeftInternal(startLineWidget, element, 0);
                            right = this.getLeftInternal(startLineWidget, element, index);
                        }
                        if (element instanceof TextElementBox) {
                            elementIsRTL = element.isRightToLeft;
                        }
                        width = Math.abs(right - left);
                        // Handled the paragraph mark highliting as special case.
                        if (element === endElement && element instanceof TextElementBox
                            && selectionEndIndex > (element as TextElementBox).length) {
                            let charFormat: WCharacterFormat = element.line.paragraph.characterFormat;
                            let paragraphMarkWidth: number = this.documentHelper.textHelper.getParagraphMarkSize(charFormat).Width;
                            if (paragraph.bidi && !elementIsRTL) {
                                width -= paragraphMarkWidth;
                                // Highlight the element.
                                this.createHighlightBorder(startLineWidget, width, left, top, true);
                                // Highlight the paragraph mark of Bidi paragrph. 
                                left = this.getLineStartLeft(startLineWidget) - paragraphMarkWidth;
                                this.createHighlightBorder(startLineWidget, paragraphMarkWidth, left, top, true);
                                // continue to next element.
                                continue;
                            }
                        }
                        this.createHighlightBorder(startLineWidget, width, elementIsRTL ? right : left, top, true);
                    }
                } else { // Need to handle the Paragraph mark highlighting.
                    if (endElement instanceof TextElementBox && selectionEndIndex > (endElement as TextElementBox).length) {
                        let charFormat: WCharacterFormat = endElement.line.paragraph.characterFormat;
                        let paragraphMarkWidth: number = this.documentHelper.textHelper.getParagraphMarkSize(charFormat).Width;
                        // Since isRTLText is truo, so the right is considered as left
                        if (!paragraph.bidi && isRtlText) {
                            right += paragraphMarkWidth;
                            width -= paragraphMarkWidth;
                            // Highlight the element.
                            this.createHighlightBorder(startLineWidget, width, right, top, true);
                            // Highlight the paragraph mark. 
                            right += endElement.width;
                            this.createHighlightBorder(startLineWidget, paragraphMarkWidth, right, top, true);
                        } else if (paragraph.bidi && !isRtlText) {
                            width -= paragraphMarkWidth;
                            // Highlight the element.
                            this.createHighlightBorder(startLineWidget, width, left, top, true);
                            // Highlight the paragraph mark of Bidi paragrph. 
                            left = this.getLineStartLeft(startLineWidget) - paragraphMarkWidth;
                            this.createHighlightBorder(startLineWidget, paragraphMarkWidth, left, top, true);
                        } else {
                            this.createHighlightBorder(startLineWidget, width, isRtlText ? right : left, top, false);
                        }

                    } else {
                        this.createHighlightBorder(startLineWidget, width, isRtlText ? right : left, top, false);
                    }
                }
            } else {
                // Start element and end element will be in reverese for Bidi paragraph highlighting. 
                // So, the right is considered based on Bidi property. 
                this.createHighlightBorder(startLineWidget, width, paragraph.bidi ? right : left, top, false);
            }
        } else {
            if (!isNullOrUndefined(startLineWidget)) {
                let x: number = startLineWidget.paragraph.x;
                if (paragraph !== startLineWidget.paragraph) {
                    paragraph = startLineWidget.paragraph;
                }
                let width: number = this.getWidth(startLineWidget, true) - (left - startLineWidget.paragraph.x);
                // Handled the  highlighting approach as genric for normal and rtl text.
                if (paragraph.bidi || (startElement instanceof TextElementBox && startElement.isRightToLeft)) {
                    let right: number = 0;
                    // tslint:disable-next-line:max-line-length
                    let elementCollection: ElementBox[] = this.getElementsForward(startLineWidget, startElement, endElement, paragraph.bidi);
                    if (elementCollection) {
                        let elementIsRTL: boolean = false;
                        for (let i: number = 0; i < elementCollection.length; i++) {
                            let element: ElementBox = elementCollection[i];
                            elementIsRTL = false;
                            if (element === startElement) {
                                left = this.getLeftInternal(startLineWidget, element, selectionStartIndex);
                            } else {
                                left = this.getLeftInternal(startLineWidget, element, 0);
                            }
                            let index: number = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                            right = this.getLeftInternal(startLineWidget, element, index);
                            if (element instanceof TextElementBox) {
                                elementIsRTL = element.isRightToLeft;
                            }
                            width = Math.abs(right - left);
                            this.createHighlightBorder(startLineWidget, width, elementIsRTL ? right : left, top, true);
                        }
                        // Highlight the Paragrph mark for last line.
                        if (startLineWidget.isLastLine()) {
                            // tslint:disable-next-line:max-line-length
                            let charFormat: WCharacterFormat = elementCollection[elementCollection.length - 1].line.paragraph.characterFormat;
                            let paragraphMarkWidth: number = this.documentHelper.textHelper.getParagraphMarkSize(charFormat).Width;
                            if (paragraph.bidi) {
                                // The paragraph mark will be at the left most end.
                                left = this.getLineStartLeft(startLineWidget) - paragraphMarkWidth;
                            } else { // The paragraph mark will at right most end.
                                left = elementIsRTL ? startLineWidget.paragraph.x + this.getWidth(startLineWidget, false) : right;
                            }
                            this.createHighlightBorder(startLineWidget, paragraphMarkWidth, left, top, true);
                        }
                    } else {
                        this.createHighlightBorder(startLineWidget, width, left, top, false);
                    }
                } else {
                    this.createHighlightBorder(startLineWidget, width, left, top, false);
                }
                let lineIndex: number = startLineWidget.paragraph.childWidgets.indexOf(startLineWidget);
                //Iterates to last item of paragraph or selection end.                                             
                this.highlightParagraph(paragraph as ParagraphWidget, lineIndex + 1, endLineWidget, endElement, selectionEndIndex);
                if (paragraph.childWidgets.indexOf(end.currentWidget) !== -1) {
                    return;
                }
            }
            if (this.isHideSelection(paragraph)) {
                this.isHighlightNext = false;
                return;
            }
            this.isHighlightNext = true;
            this.hightLightNextParagraph = paragraph;
        }
    }
    private highlightNextBlock(paragraph: BlockWidget, start: TextPosition, end: TextPosition): void {
        let block: BlockWidget = paragraph.nextRenderedWidget as BlockWidget;
        if (!isNullOrUndefined(block)) {
            if (block instanceof ParagraphWidget) {
                this.isHighlightNext = false;
                this.highlight(block, start, end);
                if (this.isHighlightNext) {
                    this.highlightNextBlock(this.hightLightNextParagraph, start, end);
                    this.isHighlightNext = false;
                    this.hightLightNextParagraph = undefined;
                }
            } else {
                this.highlightTable(block as TableWidget, start, end);
            }
        }
    }
    /**
     * Get start line widget
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getStartLineWidget(paragraph: ParagraphWidget, start: TextPosition, startElement: ElementBox, selectionStartIndex: number): ElementInfo {
        let offset: number = paragraph === start.paragraph ? start.offset : this.getStartOffset(paragraph);
        let startInlineObj: ElementInfo = undefined;
        if (paragraph === start.paragraph) {
            startInlineObj = start.currentWidget.getInline(offset, selectionStartIndex);
        } else {
            startInlineObj = (paragraph.firstChild as LineWidget).getInline(offset, selectionStartIndex);
        }
        startElement = startInlineObj.element;      //return selectionStartIndex
        selectionStartIndex = startInlineObj.index;
        if (startElement instanceof FieldElementBox) {
            let inlineInfo: ElementInfo = this.getRenderedInline((startElement as FieldElementBox), selectionStartIndex);
            startElement = inlineInfo.element;
            selectionStartIndex = inlineInfo.index;
        }
        if (offset === this.getParagraphLength(start.paragraph) + 1) {
            selectionStartIndex++;
        }
        return {
            'index': selectionStartIndex, 'element': startElement
        };
    }
    /**
     * Get end line widget
     * @private
     */
    public getEndLineWidget(end: TextPosition, endElement: ElementBox, selectionEndIndex: number): ElementInfo {
        let endInlineObj: ElementInfo = end.currentWidget.getInline(end.offset, selectionEndIndex) as ElementInfo;
        endElement = endInlineObj.element;       //return selection end index
        selectionEndIndex = endInlineObj.index;
        if (endElement instanceof FieldElementBox) {
            let inlineInfo: ElementInfo = this.getRenderedInline((endElement as FieldElementBox), selectionEndIndex);
            endElement = inlineInfo.element;
            selectionEndIndex = inlineInfo.index;
        }
        let lineIndex: number = end.paragraph.childWidgets.indexOf(end.currentWidget);
        if (lineIndex === end.paragraph.childWidgets.length - 1 && end.offset === this.getLineLength(end.currentWidget) + 1) {
            selectionEndIndex = endElement ? endElement.length + 1 : 1;
        }
        return { 'index': selectionEndIndex, 'element': endElement };
    }
    /**
     * Get line widget
     * @private
     */
    public getLineWidgetInternal(line: LineWidget, offset: number, moveToNextLine: boolean): LineWidget {
        let lineWidget: LineWidget = undefined;
        if (line.children.length === 0 && line instanceof LineWidget) {
            lineWidget = line as LineWidget;
        } else {
            let indexInInline: number = 0;
            let inlineInfo: ElementInfo = line.getInline(offset, indexInInline);
            let inline: ElementBox = inlineInfo.element;
            indexInInline = inlineInfo.index;
            lineWidget = inline instanceof ElementBox ? inline.line
                : this.getLineWidgetInternalInline(inline, indexInInline, moveToNextLine);
        }
        return lineWidget;
    }
    /**
     * Get last line widget
     * @private
     */
    public getLineWidgetParagraph(offset: number, line: LineWidget): LineWidget {
        let linewidget: LineWidget = undefined;
        if (line.children.length === 0) {
            linewidget = line as LineWidget;
        } else {
            let indexInInline: number = 0;
            let inlineInfo: ElementInfo = line.getInline(offset, indexInInline);
            let inline: ElementBox = inlineInfo.element;
            indexInInline = inlineInfo.index;
            linewidget = this.getLineWidget(inline, indexInInline);
        }

        return linewidget;
    }

    /**
     * Highlight selected cell
     * @private
     */
    /* tslint:disable */
    // tslint:disable-next-line:max-line-length    
    public highlightCells(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): void {
        let start: number = this.getCellLeft(startCell.ownerRow, startCell);
        let end: number = start + startCell.cellFormat.cellWidth;
        let endCellLeft: number = this.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        if (start > endCellLeft) {
            start = endCellLeft;
        }
        if (end < endCellRight) {
            end = endCellRight;
        }
        if (start > this.upDownSelectionLength) {
            start = this.upDownSelectionLength;
        }
        if (end < this.upDownSelectionLength) {
            end = this.upDownSelectionLength;
        }
        let tableWidgetCollection: TableWidget[] = table.getSplitWidgets() as TableWidget[];
        let startTableIndex: number = tableWidgetCollection.indexOf(startCell.ownerRow.ownerTable);
        let endTableIndex: number = tableWidgetCollection.indexOf(endCell.ownerRow.ownerTable);
        if (startTableIndex === endTableIndex) {
            let count: number = table.childWidgets.indexOf(endCell.ownerRow as TableRowWidget);
            for (let i: number = table.childWidgets.indexOf(startCell.ownerRow as TableRowWidget); i <= count; i++) {
                this.highlightRow((table.childWidgets[i] as TableRowWidget), start, end);
            }
        } else {
            let startRowIndex: number = 0;
            let endRowIndex: number = 0;
            for (let i: number = startTableIndex; i <= endTableIndex; i++) {
                table = tableWidgetCollection[i];
                if (i === startTableIndex) {
                    startRowIndex = table.childWidgets.indexOf(startCell.ownerRow);
                } else {
                    startRowIndex = 0;
                }
                if (i === endTableIndex) {
                    endRowIndex = table.childWidgets.indexOf(endCell.ownerRow);
                } else {
                    endRowIndex = table.childWidgets.length - 1;
                }
                for (let j: number = startRowIndex; j <= endRowIndex; j++) {
                    this.highlightRow((table.childWidgets[j] as TableRowWidget), start, end);
                }
            }
        }
    }
    /* tslint:enable */
    /**
     * highlight selected table
     * @private
     */
    public highlightTable(table: TableWidget, start: TextPosition, end: TextPosition): void {
        this.highlightInternal(table.childWidgets[0] as TableRowWidget, start, end);
        if (!end.paragraph.isInsideTable //Selection end is outside the table cell.
            || !table.contains(end.paragraph.associatedCell)) {//Selection end is not inside the current table.
            this.highlightNextBlock(table, start, end);
        }
    }
    /**
     * Get cell left
     * @private
     */
    public getCellLeft(row: TableRowWidget, cell: TableCellWidget): number {
        let left: number = 0;
        left += (cell as TableCellWidget).x - (cell as TableCellWidget).margin.left;
        return left;
    }

    /**
     * Get next paragraph for row
     * @private
     */
    public getNextParagraphRow(row: BlockWidget): ParagraphWidget {
        if (!isNullOrUndefined(row.nextRenderedWidget)) {
            let cell: TableCellWidget = (row.nextRenderedWidget as TableRowWidget).childWidgets[0] as TableCellWidget;
            let block: BlockWidget = cell.childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(block);
        }
        return this.getNextParagraphBlock((row as TableRowWidget).ownerTable) as ParagraphWidget;
    }
    /**
     * Get previous paragraph from row
     * @private
     */
    public getPreviousParagraphRow(row: TableRowWidget): ParagraphWidget {
        if (!isNullOrUndefined(row.previousRenderedWidget)) {
            // tslint:disable-next-line:max-line-length
            let cell: TableCellWidget = (row.previousRenderedWidget as TableRowWidget).lastChild as TableCellWidget;
            let block: BlockWidget = (cell.lastChild as BlockWidget) ? cell.lastChild as BlockWidget : (cell.previousSplitWidget).lastChild as BlockWidget;
            return this.getLastParagraphBlock(block);
        }
        return this.getPreviousParagraphBlock(row.ownerTable as BlockWidget) as ParagraphWidget;
    }
    /**
     * Return true if row contain cell
     * @private
     */
    public containsRow(row: TableRowWidget, tableCell: TableCellWidget): boolean {
        if ((row as TableRowWidget).childWidgets.indexOf(tableCell) !== -1) {
            return true;
        }
        while (tableCell.ownerTable.isInsideTable) {
            if ((row as TableRowWidget).childWidgets.indexOf(tableCell) !== -1) {
                return true;
            }
            tableCell = tableCell.ownerTable.associatedCell;
        }
        return (row as TableRowWidget).childWidgets.indexOf(tableCell) !== -1;
    }
    /**
     * Highlight selected row
     * @private
     */
    public highlightRow(row: TableRowWidget, start: number, end: number): void {
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            let left: number = this.getCellLeft(row, row.childWidgets[i] as TableCellWidget);
            if (HelperMethods.round(start, 2) <= HelperMethods.round(left, 2) &&
                HelperMethods.round(left, 2) < HelperMethods.round(end, 2)) {
                this.highlightCellWidget(row.childWidgets[i] as TableCellWidget);
            }
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public highlightInternal(row: TableRowWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = 0; i < row.childWidgets.length; i++) {
            this.highlightCellWidget(row.childWidgets[i] as TableCellWidget);
        }
        if (end.paragraph.isInsideTable && this.containsRow(row, end.paragraph.associatedCell)) {
            return;
        } else if ((row as TableRowWidget).nextRenderedWidget instanceof TableRowWidget) {
            this.highlightInternal(row.nextRenderedWidget as TableRowWidget, start, end);
        }
    }

    /**
     * Get last paragraph in cell
     * @private
     */
    public getLastParagraph(cell: TableCellWidget): ParagraphWidget {
        while (cell.nextSplitWidget) {
            if (cell.nextSplitWidget.childWidgets.length > 0) {
                cell = cell.nextSplitWidget as TableCellWidget;
            } else {
                break;
            }
        }

        let lastBlock: BlockWidget;

        if (cell.childWidgets.length > 0) {
            lastBlock = (cell as TableCellWidget).lastChild as BlockWidget;
        } else {
            lastBlock = cell.previousSplitWidget.lastChild as BlockWidget;
        }
        return this.getLastParagraphBlock(lastBlock);
    }
    /**
     * Return true is source cell contain cell
     * @private
     */
    public containsCell(sourceCell: TableCellWidget, cell: TableCellWidget): boolean {
        if (sourceCell.equals(cell)) {
            return true;
        }
        while (cell.ownerTable.isInsideTable) {
            if (sourceCell.equals(cell.ownerTable.associatedCell)) {
                return true;
            }
            cell = cell.ownerTable.associatedCell;
        }
        return false;
    }
    /**
     * Return true if cell is selected
     * @private
     */
    public isCellSelected(cell: TableCellWidget, startPosition: TextPosition, endPosition: TextPosition): boolean {
        let lastParagraph: ParagraphWidget = this.getLastParagraph(cell as TableCellWidget) as ParagraphWidget;
        // tslint:disable-next-line:max-line-length
        let isAtCellEnd: boolean = lastParagraph === endPosition.paragraph && endPosition.offset === this.getParagraphLength(lastParagraph) + 1;

        return isAtCellEnd || (!this.containsCell(cell, startPosition.paragraph.associatedCell) ||
            !this.containsCell(cell, endPosition.paragraph.associatedCell));
    }
    /**
     * Return Container cell
     * @private
     */
    public getContainerCellOf(cell: TableCellWidget, tableCell: TableCellWidget): TableCellWidget {
        while (cell.ownerTable.isInsideTable) {
            if ((cell.ownerTable as TableWidget).contains(tableCell as TableCellWidget)) {
                return cell;
            }
            cell = cell.ownerTable.associatedCell;
        }
        return cell;
    }
    /**
     * Get Selected cell
     * @private
     */
    public getSelectedCell(cell: TableCellWidget, containerCell: TableCellWidget): TableCellWidget {
        if (cell.ownerTable.equals(containerCell.ownerTable)) {
            return cell;
        }
        while (cell.ownerTable.isInsideTable) {
            if (cell.ownerTable.associatedCell.equals(containerCell)) {
                return cell;
            }
            cell = cell.ownerTable.associatedCell;
        }
        return cell;
    }

    /**
     * @private
     */
    public getSelectedCells(): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        for (let i: number = 0; i < this.selectedWidgets.keys.length; i++) {
            let widget: Widget = this.selectedWidgets.keys[i] as Widget;
            if (widget instanceof TableCellWidget) {
                cells.push(widget);
            }
        }
        return cells;
    }
    /**
     * Get Next paragraph from cell
     * @private
     */
    public getNextParagraphCell(cell: TableCellWidget): ParagraphWidget {
        if ((cell as TableCellWidget).nextRenderedWidget && cell.nextRenderedWidget instanceof TableCellWidget) {
            //Return first paragraph in cell.            
            cell = cell.nextRenderedWidget as TableCellWidget;
            let block: BlockWidget = cell.firstChild as BlockWidget;
            if (block) {
                return this.getFirstParagraphBlock(block);
            } else {
                return this.getNextParagraphCell(cell);
            }
        }
        return this.getNextParagraphRow((cell as TableCellWidget).containerWidget as BlockWidget);
    }
    /**
     * Get previous paragraph from cell 
     * @private
     */
    public getPreviousParagraphCell(cell: TableCellWidget): ParagraphWidget {
        if (!isNullOrUndefined(cell.previousRenderedWidget) && cell.previousRenderedWidget instanceof TableCellWidget) {
            cell = cell.previousRenderedWidget as TableCellWidget;
            let block: BlockWidget = cell.lastChild as BlockWidget;
            return this.getLastParagraphBlock(block);
        }
        return this.getPreviousParagraphRow(cell.ownerRow as TableRowWidget);
    }
    /**
     * Get cell's container cell
     * @private
     */
    public getContainerCell(cell: TableCellWidget): TableCellWidget {
        while (!isNullOrUndefined(cell.ownerTable) && cell.ownerTable.isInsideTable) {
            cell = cell.ownerTable.associatedCell;
        }
        return cell;
    }
    /**
     * Highlight selected cell
     * @private
     */
    /* tslint:disable */
    public highlightCell(cell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition): void {
        if (end.paragraph.isInsideTable) {
            let containerCell: TableCellWidget = this.getContainerCellOf(cell, end.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(end.paragraph.associatedCell)) {
                let startCell: TableCellWidget = this.getSelectedCell(cell, containerCell);
                let endCell: TableCellWidget = this.getSelectedCell(end.paragraph.associatedCell, containerCell);
                if (this.containsCell(containerCell, end.paragraph.associatedCell)) {
                    /* tslint:enable */
                    //Selection end is in container cell.
                    if (this.isCellSelected(containerCell, start, end)) {
                        this.highlightCellWidget(containerCell);
                    } else {
                        if (startCell === containerCell) {
                            this.highlight(start.paragraph, start, end);
                            if (this.isHighlightNext) {
                                this.highlightNextBlock(this.hightLightNextParagraph, start, end);
                                this.isHighlightNext = false;
                                this.hightLightNextParagraph = undefined;
                            }
                        } else {
                            this.highlightContainer(startCell, start, end);
                        }
                    }
                } else {
                    //Selection end is not in container cell.
                    this.highlightCellWidget(containerCell);
                    if (containerCell.ownerRow.equals(endCell.ownerRow)) {
                        //Highlight other selected cells in current row.
                        startCell = containerCell as TableCellWidget;
                        while (!isNullOrUndefined((startCell as TableCellWidget).nextRenderedWidget)) {
                            startCell = startCell.nextRenderedWidget as TableCellWidget;
                            this.highlightCellWidget(startCell);
                            if (startCell === endCell) {
                                break;
                            }
                        }
                    } else {
                        this.highlightCells(containerCell.ownerTable, containerCell, endCell);
                    }
                }
            } else {
                this.highlightContainer(containerCell, start, end);
            }
        } else {
            let cell1: TableCellWidget = this.getContainerCell(cell);
            this.highlightContainer(cell1, start, end);
        }
    }
    /**
     * @private
     */
    public highlightContainer(cell: TableCellWidget, start: TextPosition, end: TextPosition): void {
        this.highlightInternal(cell.containerWidget as TableRowWidget, start, end);
        this.highlightNextBlock(cell.ownerTable, start, end);
    }
    /**
     * Get previous valid element
     * @private
     */
    public getPreviousValidElement(inline: ElementBox): ElementBox {
        let previousValidInline: ElementBox = undefined;
        while (inline instanceof FieldElementBox) {
            if (HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox))) {
                if (inline instanceof FieldElementBox && inline.fieldType === 0) {
                    previousValidInline = inline;
                } else if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                    previousValidInline = inline;
                    if (isNullOrUndefined((inline as FieldElementBox).fieldSeparator)) {
                        inline = (inline as FieldElementBox).fieldBegin;
                        previousValidInline = inline;
                    }
                } else {
                    inline = (inline as FieldElementBox).fieldBegin;
                    previousValidInline = inline;
                }
            }
            inline = inline.previousNode as ElementBox;
        }

        return isNullOrUndefined(previousValidInline) ? inline : previousValidInline;
    }
    /**
     * Get next valid element
     * @private
     */
    public getNextValidElement(inline: ElementBox): ElementBox {
        let nextValidInline: ElementBox = undefined;
        if (inline instanceof BookmarkElementBox && inline.bookmarkType === 1) {
            return inline;
        }
        while (inline instanceof FieldElementBox) {
            if (inline.fieldType === 0 && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
                return isNullOrUndefined(nextValidInline) ? inline : nextValidInline;
            } else if (inline.fieldType === 1 && !isNullOrUndefined((inline as FieldElementBox).fieldBegin)) {
                nextValidInline = inline;
            }
            inline = inline.nextNode as ElementBox;
        }
        return (isNullOrUndefined(nextValidInline) ? inline : nextValidInline) as ElementBox;
    }
    /**
     * Return next valid inline with index
     * @private
     */
    public validateTextPosition(inline: ElementBox, index: number): ElementInfo {
        if (inline.length === index && (inline.nextNode instanceof FieldElementBox || inline.nextNode instanceof BookmarkElementBox)) {
            //If inline is last item within field, then set field end as text position.
            let nextInline: ElementBox = this.getNextValidElement((inline.nextNode as FieldElementBox)) as ElementBox;
            if (nextInline instanceof FieldElementBox && nextInline.fieldType === 1
                || nextInline instanceof BookmarkElementBox && nextInline.bookmarkType === 1) {
                inline = nextInline;
                index = 1;
            }
        } else if (index === 0 && inline.previousNode instanceof FieldElementBox) {
            let prevInline: ElementBox = this.getPreviousValidElement((inline.previousNode as ElementBox));
            inline = prevInline;
            index = inline instanceof FieldElementBox ? 0 : inline.length;
            if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                index++;
            }
        }
        return { 'element': inline, 'index': index };
    }
    /**
     * Get inline physical location
     * @private
     */
    public getPhysicalPositionInline(inline: ElementBox, index: number, moveNextLine: boolean): Point {
        let element: ElementBox = undefined;
        element = this.getElementBox(inline, index, moveNextLine).element;
        let lineWidget: LineWidget = undefined;
        if (isNullOrUndefined(element) || isNullOrUndefined(element.line)) {
            if (inline instanceof FieldElementBox && inline.fieldType === 1) {
                element = inline;
            } else {
                if (inline instanceof FieldElementBox || inline instanceof BookmarkElementBox) {
                    return this.getFieldCharacterPosition(inline);
                }
                return new Point(0, 0);
            }
        }
        let margin: Margin = element.margin;
        let top: number = 0;
        let left: number = 0;
        if (element instanceof TextElementBox && (element as TextElementBox).text === '\v' && isNullOrUndefined(inline.nextNode)) {
            lineWidget = this.getNextLineWidget(element.line.paragraph, element);
            index = 0;
        } else {
            lineWidget = element.line;
        }
        top = this.getTop(lineWidget);
        if (element instanceof ImageElementBox) {
            let format: WCharacterFormat = element.line.paragraph.characterFormat;
            let previousInline: ElementBox = this.getPreviousTextElement(inline as ElementBox);
            if (!isNullOrUndefined(previousInline)) {
                format = previousInline.characterFormat;
            } else {
                let nextInline: ElementBox = this.getNextTextElement(inline as ElementBox);
                if (!isNullOrUndefined(nextInline)) {
                    format = nextInline.characterFormat;
                }
            }
            let measureObj: TextSizeInfo = this.documentHelper.textHelper.getHeight(format);
            if (element.margin.top + element.height - measureObj.BaselineOffset > 0) {
                top += element.margin.top + element.height - measureObj.BaselineOffset;
            }
        } else if (!(element instanceof FieldElementBox)) {
            top += margin.top > 0 ? margin.top : 0;
        }
        left = (isNullOrUndefined(element) || isNullOrUndefined(lineWidget)) ? 0 : this.getLeftInternal(lineWidget, element, index);
        return new Point(left, top);
    }
    /**
     * Get field character position
     * @private
     */
    public getFieldCharacterPosition(firstInline: ElementBox): Point {
        let nextValidInline: ElementBox = this.getNextValidElementForField(firstInline);

        //If field separator/end exists at end of paragraph, then move to next paragraph.
        if (isNullOrUndefined(nextValidInline)) {
            let nextParagraph: ParagraphWidget = firstInline.line.paragraph;
            return this.getEndPosition(nextParagraph);
        } else {
            return this.getPhysicalPositionInline(nextValidInline, 0, true);
        }
    }
    /**
     * @private
     */
    public getNextValidElementForField(firstInline: ElementBox): ElementBox {
        if (firstInline instanceof FieldElementBox && firstInline.fieldType === 0
            && HelperMethods.isLinkedFieldCharacter((firstInline as FieldElementBox))) {
            let fieldBegin: FieldElementBox = firstInline as FieldElementBox;
            if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                firstInline = fieldBegin.fieldEnd;
            } else {
                firstInline = fieldBegin.fieldSeparator;
            }
        }
        let nextValidInline: ElementBox = undefined;
        if (!isNullOrUndefined(firstInline.nextNode)) {
            nextValidInline = this.getNextValidElement((firstInline.nextNode as ElementBox)) as ElementBox;
        }
        return nextValidInline;
    }
    /**
     * Get paragraph end position
     * @private
     */
    public getEndPosition(widget: ParagraphWidget): Point {
        let left: number = widget.x;
        let top: number = widget.y;
        let lineWidget: LineWidget = undefined;
        if (widget.childWidgets.length > 0) {
            lineWidget = widget.childWidgets[widget.childWidgets.length - 1] as LineWidget;
            left += this.getWidth(lineWidget, false);
        }
        if (!isNullOrUndefined(lineWidget)) {
            top = this.getTop(lineWidget);
        }
        let topMargin: number = 0;
        let bottomMargin: number = 0;
        let size: SizeInfo = this.getParagraphMarkSize(widget, topMargin, bottomMargin);
        return new Point(left, top + size.topMargin);
    }
    /**
     * Get element box
     * @private
     */
    public getElementBox(currentInline: ElementBox, index: number, moveToNextLine: boolean): ElementInfo {
        let elementBox: ElementBox = undefined;
        if (!(currentInline instanceof FieldElementBox || currentInline instanceof BookmarkElementBox)) {
            elementBox = currentInline;
        }
        return { 'element': elementBox, 'index': index };
    }
    /**
     * @private
     */
    public getPreviousTextElement(inline: ElementBox): ElementBox {
        if (inline.previousNode instanceof TextElementBox) {
            return inline.previousNode as ElementBox;
        }
        if (!isNullOrUndefined(inline.previousNode)) {
            return this.getPreviousTextElement((inline.previousNode as ElementBox));
        }
        return undefined;
    }
    /**
     * Get next text inline
     * @private
     */
    public getNextTextElement(inline: ElementBox): ElementBox {
        if (inline.nextNode instanceof TextElementBox) {
            return inline.nextNode as ElementBox;
        }
        if (!isNullOrUndefined(inline.nextNode)) {
            return this.getNextTextElement((inline.nextNode as ElementBox));
        }
        return undefined;
    }
    /**
     * @private
     */
    public getNextRenderedElementBox(inline: ElementBox, indexInInline: number): ElementBox {
        if (inline instanceof FieldElementBox) {
            let fieldBegin: FieldElementBox = inline as FieldElementBox;
            if (fieldBegin.fieldType === 0) {
                inline = this.getRenderedField(fieldBegin) as ElementBox;
                if (fieldBegin === inline) {
                    return fieldBegin;
                }
            }
            indexInInline = 1;
        }
        while (!isNullOrUndefined(inline) && indexInInline === inline.length && inline.nextNode instanceof FieldElementBox) {
            let nextValidInline: ElementBox = this.getNextValidElement((inline.nextNode)) as ElementBox;
            if (nextValidInline instanceof FieldElementBox && nextValidInline.fieldType === 0) {
                let fieldBegin: FieldElementBox = nextValidInline;
                inline = this.getRenderedField(fieldBegin) as ElementBox;
                if (!isNullOrUndefined(inline) && fieldBegin === inline) {
                    return fieldBegin;
                }
                indexInInline = 1;
            } else {
                inline = nextValidInline;
            }
        }
        return inline;
    }
    /**
     * @private
     */
    public getElementBoxInternal(inline: ElementBox, index: number): ElementInfo {              //for Highlight text
        let element: ElementBox = undefined;
        element = inline;
        return {
            'element': element, 'index': index
        };
    }
    /**
     * Get Line widget
     * @private
     */
    public getLineWidget(inline: ElementBox, index: number): LineWidget {
        return this.getLineWidgetInternalInline(inline, index, true);
    }
    /**
     * @private
     */
    public getLineWidgetInternalInline(inline: ElementBox, index: number, moveToNextLine: boolean): LineWidget {
        let elementObj: ElementInfo = this.getElementBox(inline, index, moveToNextLine);
        let element: ElementBox = elementObj.element;    //return index
        index = elementObj.index;
        if (!isNullOrUndefined(element)) {
            if (moveToNextLine && element instanceof TextElementBox && (element as TextElementBox).text === '\v' && index === 1) {
                return this.getNextLineWidget(element.line.paragraph, element);
            } else {
                return element.line;
            }
        }
        let startInline: ElementBox = inline;
        //ToDo: Check previous inline here.
        let nextValidInline: ElementBox = this.getNextValidElementForField(startInline);
        //If field separator/end exists at end of paragraph, then move to next paragraph.
        if (isNullOrUndefined(nextValidInline)) {
            let lineWidget: LineWidget = undefined;
            let widget: Widget = startInline.line.paragraph;
            if (widget.childWidgets.length > 0) {
                lineWidget = widget.childWidgets[widget.childWidgets.length - 1] as LineWidget;
            }
            return lineWidget;
        } else {
            return this.getLineWidget(nextValidInline, 0);
        }
    }
    /**
     * Get next line widget
     * @private
     */
    private getNextLineWidget(paragraph: ParagraphWidget, element: ElementBox): LineWidget {
        let lineWidget: LineWidget = undefined;
        let widget: Widget = paragraph;
        if (widget.childWidgets.length > 0) {
            let widgetIndex: number = widget.childWidgets.indexOf(element.line);
            if (widgetIndex === widget.childWidgets.length - 1) {
                widget = paragraph;
                // widget = paragraph.leafWidgets[paragraph.leafWidgets.length - 1];
                widgetIndex = -1;
            } else if (widgetIndex > widget.childWidgets.length - 1) {
                widget = this.getNextParagraphBlock(paragraph);
                widgetIndex = -1;
            } else if (widgetIndex < 0) {
                // widget = paragraph.leafWidgets[paragraph.leafWidgets.length - 1];
                widget = paragraph;
                widgetIndex = widget.childWidgets.indexOf(element.line);
            }
            lineWidget = widget.childWidgets[widgetIndex + 1] as LineWidget;
        }
        return lineWidget;
    }
    /**
     * Get Caret height
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getCaretHeight(inline: ElementBox, index: number, format: WCharacterFormat, isEmptySelection: boolean, topMargin: number, isItalic: boolean): CaretHeightInfo {
        let elementBoxInfo: ElementInfo = this.getElementBox(inline, index, false);
        let element: ElementBox = elementBoxInfo.element;
        let currentInline: ElementBox = inline;
        if (isNullOrUndefined(element)) {
            if (currentInline instanceof FieldElementBox) {
                return this.getFieldCharacterHeight(currentInline, format, isEmptySelection, topMargin, isItalic);
            }
            return { 'height': this.documentHelper.textHelper.getHeight(format).Height, 'topMargin': topMargin, 'isItalic': isItalic };
        }
        let margin: Margin = element.margin;

        let heightElement: number = element.height;
        let maxLineHeight: number = 0;
        if (element instanceof ImageElementBox) {
            let previousInline: ElementBox = this.getPreviousTextElement(inline);
            let nextInline: ElementBox = this.getNextTextElement(inline);
            if (isNullOrUndefined(previousInline) && isNullOrUndefined(nextInline)) {
                let top: number = 0;
                let bottom: number = 0;
                let paragarph: ParagraphWidget = inline.line.paragraph;
                let sizeInfo: SizeInfo = this.getParagraphMarkSize(paragarph, top, bottom);
                top = sizeInfo.topMargin;
                bottom = sizeInfo.bottomMargin;
                maxLineHeight = sizeInfo.height;
                isItalic = paragarph.characterFormat.italic;
                if (!isEmptySelection) {
                    maxLineHeight += this.documentHelper.layout.getAfterSpacing(paragarph);
                }
            } else if (isNullOrUndefined(previousInline)) {
                isItalic = nextInline.characterFormat.italic;
                return this.getCaretHeight(nextInline, 0, nextInline.characterFormat, isEmptySelection, topMargin, isItalic);
            } else {
                if (!isNullOrUndefined(nextInline) && element instanceof ImageElementBox) {
                    //Calculates the caret size using image character format.
                    let textSizeInfo: TextSizeInfo = this.documentHelper.textHelper.getHeight(element.characterFormat);
                    let charHeight: number = textSizeInfo.Height;
                    let baselineOffset: number = textSizeInfo.BaselineOffset;
                    // tslint:disable-next-line:max-line-length
                    maxLineHeight = (element.margin.top < 0 && baselineOffset > element.margin.top + element.height) ? element.margin.top + element.height + charHeight - baselineOffset : charHeight;
                    if (!isEmptySelection) {
                        maxLineHeight += element.margin.bottom;
                    }
                } else {
                    isItalic = previousInline.characterFormat.italic;
                    // tslint:disable-next-line:max-line-length
                    return this.getCaretHeight(previousInline, previousInline.length, previousInline.characterFormat, isEmptySelection, topMargin, isItalic);
                }
            }
        } else {
            let baselineAlignment: BaselineAlignment = format.baselineAlignment;
            let elementHeight: number = heightElement;
            if (baselineAlignment !== 'Normal' && isEmptySelection) {
                //Set the caret height as sub/super script text height and updates the top margin for sub script text.
                elementHeight = elementHeight / 1.5;
                if (baselineAlignment === 'Subscript') {
                    topMargin = heightElement - elementHeight;
                }
            }
            maxLineHeight = (margin.top < 0 ? margin.top : 0) + elementHeight;
            if (!isEmptySelection) {
                maxLineHeight += margin.bottom;
            }
        }
        if (!isEmptySelection) {
            return { 'height': maxLineHeight, 'topMargin': topMargin, 'isItalic': isItalic };
        }
        let height: number = this.documentHelper.textHelper.getHeight(format).Height;
        if (height > maxLineHeight) {
            height = maxLineHeight;
        }
        return { 'height': height, 'topMargin': topMargin, 'isItalic': isItalic };
    }
    /**
     * Get field characters height
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getFieldCharacterHeight(startInline: FieldElementBox, format: WCharacterFormat, isEmptySelection: boolean, topMargin: number, isItalic: boolean): CaretHeightInfo {
        let nextValidInline: ElementBox = this.getNextValidElementForField(startInline);
        //If field separator/end exists at end of paragraph, then move to next paragraph.
        if (isNullOrUndefined(nextValidInline)) {
            let nextParagraph: ParagraphWidget = startInline.line.paragraph as ParagraphWidget;
            let height: number = this.documentHelper.textHelper.getParagraphMarkSize(format).Height;
            let top: number = 0;
            let bottom: number = 0;
            let sizeInfo: SizeInfo = this.getParagraphMarkSize(nextParagraph, top, bottom);
            let maxLineHeight: number = sizeInfo.height;
            top = sizeInfo.topMargin;
            bottom = sizeInfo.bottomMargin;
            if (!isEmptySelection) {
                maxLineHeight += bottom;
                return { 'height': maxLineHeight, 'topMargin': topMargin, 'isItalic': isItalic };
            }
            if (height > maxLineHeight) {
                height = maxLineHeight;
            }
            return { 'height': height, 'topMargin': topMargin, 'isItalic': isItalic };
        } else {
            return this.getCaretHeight(nextValidInline, 0, format, isEmptySelection, topMargin, isItalic);
        }
    }
    /**
     * Get rendered inline
     * @private
     */
    //FieldCharacter
    public getRenderedInline(inline: FieldElementBox, inlineIndex: number): ElementInfo {
        let prevInline: ElementBox = this.getPreviousValidElement(inline);
        while (prevInline instanceof FieldElementBox) {
            prevInline = this.getPreviousTextElement(prevInline);
            if (prevInline instanceof FieldElementBox) {
                prevInline = prevInline.previousNode as ElementBox;
            }
        }
        if (!isNullOrUndefined(prevInline)) {
            inlineIndex = prevInline.length;
            return { 'element': prevInline, 'index': inlineIndex };
        }
        inlineIndex = 0;
        let nextInline: ElementBox = this.getNextRenderedElementBox(inline, 0) as ElementBox;
        if (nextInline instanceof FieldElementBox && nextInline.fieldType === 0) {
            nextInline = (nextInline as FieldElementBox).fieldSeparator;
            nextInline = nextInline.nextNode as ElementBox;
            while (nextInline instanceof FieldElementBox) {
                if (nextInline instanceof FieldElementBox && nextInline.fieldType === 0
                    && HelperMethods.isLinkedFieldCharacter((nextInline as FieldElementBox))) {
                    if (isNullOrUndefined((nextInline as FieldElementBox).fieldSeparator)) {
                        nextInline = (nextInline as FieldElementBox).fieldEnd;
                    } else {
                        nextInline = (nextInline as FieldElementBox).fieldSeparator;
                    }
                }
                nextInline = nextInline.nextNode as ElementBox;
            }
        }
        return { 'element': nextInline, 'index': inlineIndex };
    }
    //Field Begin
    /**
     * Get rendered field
     * @private
     */
    public getRenderedField(fieldBegin: FieldElementBox): FieldElementBox {
        let inline: FieldElementBox = fieldBegin as FieldElementBox;
        if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
            inline = fieldBegin.fieldEnd;
        } else {
            inline = fieldBegin.fieldSeparator;
            let paragraph: ParagraphWidget = inline.line.paragraph;
            if (paragraph === fieldBegin.fieldEnd.line.paragraph
                && !this.hasValidInline(paragraph, inline, fieldBegin.fieldEnd)) {
                inline = fieldBegin.fieldEnd;
            } else {
                return inline;
            }
        }
        return inline;
    }

    /**
     * Return true is inline is tha last inline
     * @private
     */
    public isLastRenderedInline(inline: ElementBox, index: number): boolean {
        while (index === inline.length && inline.nextNode instanceof FieldElementBox) {
            let nextValidInline: ElementBox = this.getNextValidElement((inline.nextNode as ElementBox)) as ElementBox;
            index = 0;
            if (nextValidInline instanceof FieldElementBox && nextValidInline.fieldType === 0) {
                inline = nextValidInline;
            }
            if (inline instanceof FieldElementBox && inline.fieldType === 0 && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
                let fieldBegin: FieldElementBox = inline as FieldElementBox;
                if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                    inline = fieldBegin.fieldEnd;
                    index = 1;
                } else {
                    inline = fieldBegin.fieldSeparator;
                    let paragraph: ParagraphWidget = inline.line.paragraph;
                    index = 1;
                    if (paragraph === fieldBegin.fieldEnd.line.paragraph
                        && !this.hasValidInline(paragraph, inline, fieldBegin.fieldEnd)) {
                        inline = fieldBegin.fieldEnd;
                    } else {
                        break;
                    }
                }
            }
        }
        return index === inline.length && isNullOrUndefined(inline.nextNode);
    }
    /**
     * Get page
     * @private
     */
    public getPage(widget: Widget): Page {
        let page: Page = undefined;
        if (widget.containerWidget instanceof BlockContainer) {
            let bodyWidget: BodyWidget = widget.containerWidget as BodyWidget;
            page = (widget.containerWidget as BodyWidget).page;
        } else if (!isNullOrUndefined(widget.containerWidget)) {
            page = this.getPage(widget.containerWidget);
        }
        return page;
    }

    /**
     * Clear Selection highlight
     * @private
     */
    public clearSelectionHighlightInSelectedWidgets(): boolean {
        let isNonEmptySelection: boolean = false;
        let widgets: IWidget[] = this.selectedWidgets.keys;
        for (let i: number = 0; i < widgets.length; i++) {
            this.removeSelectionHighlight(widgets[i]);
            isNonEmptySelection = true;
        }
        this.selectedWidgets.clear();
        return isNonEmptySelection;
    }
    /**
     * Clear selection highlight
     * @private
     */
    public clearChildSelectionHighlight(widget: Widget): void {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            if (widget.childWidgets[i] instanceof LineWidget) {
                this.clearSelectionHighlightLineWidget((widget.childWidgets[i] as LineWidget));
            } else if (widget.childWidgets[i] instanceof TableCellWidget) {
                this.clearSelectionHighlight((widget.childWidgets[i] as TableCellWidget));
            } else if (widget.childWidgets[i] instanceof Widget) {
                this.clearChildSelectionHighlight((widget.childWidgets[i] as Widget));
            }
        }
    }
    /**
     * Get line widget from paragraph widget
     * @private
     */
    //Body Widget
    public getLineWidgetBodyWidget(widget: Widget, point: Point): LineWidget {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let childWidget: IWidget = widget.childWidgets[i];
            if (childWidget instanceof Widget && (childWidget as Widget).y <= point.y
                && ((childWidget as Widget).y + (childWidget as Widget).height) >= point.y) {
                if (childWidget instanceof ParagraphWidget) {
                    return this.getLineWidgetParaWidget((childWidget as ParagraphWidget), point);
                } else {
                    return this.getLineWidgetTableWidget((childWidget as TableWidget), point);
                }
            }
        }
        let line: LineWidget = undefined;
        if (widget.childWidgets.length > 0) {
            let firstChild: IWidget = widget.childWidgets[0];
            if (firstChild instanceof Widget && (firstChild as Widget).y <= point.y) {
                if ((widget.childWidgets[widget.childWidgets.length - 1] as Widget) instanceof ParagraphWidget) {
                    // tslint:disable-next-line:max-line-length
                    line = this.getLineWidgetParaWidget((widget.childWidgets[widget.childWidgets.length - 1] as ParagraphWidget), point);
                } else {
                    // tslint:disable-next-line:max-line-length
                    line = this.getLineWidgetTableWidget((widget.childWidgets[widget.childWidgets.length - 1] as TableWidget), point);
                }
            } else {
                let childWidget: Widget = undefined;
                if (firstChild instanceof Widget) {
                    childWidget = firstChild as Widget;
                }
                if (!isNullOrUndefined(childWidget)) {
                    if (childWidget instanceof ParagraphWidget) {
                        line = this.getLineWidgetParaWidget((firstChild as ParagraphWidget), point);
                    } else {
                        line = this.getLineWidgetTableWidget((firstChild as TableWidget), point);
                    }
                }
            }
        }
        return line;
    }
    //ParagraphWidget
    /**
     * Get line widget from paragraph widget
     * @private
     */
    public getLineWidgetParaWidget(widget: ParagraphWidget, point: Point): LineWidget {
        let childWidgets: IWidget[] = widget.childWidgets;
        let top: number = widget.y;
        for (let i: number = 0; i < childWidgets.length; i++) {
            if (top <= point.y
                && (top + (childWidgets[i] as LineWidget).height) >= point.y) {
                return childWidgets[i] as LineWidget;
            }
            top += (childWidgets[i] as LineWidget).height;
        }
        let lineWidget: LineWidget = undefined;
        if (childWidgets.length > 0) {
            if (widget.y <= point.y) {
                lineWidget = childWidgets[childWidgets.length - 1] as LineWidget;
            } else {
                lineWidget = childWidgets[0] as LineWidget;
            }
        }
        return lineWidget;
    }
    /**
     * highlight paragraph widget
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public highlightParagraph(widget: ParagraphWidget, startIndex: number, endLine: LineWidget, endElement: ElementBox, endIndex: number): void {
        let top: number = 0;
        let width: number = 0;
        let isRtlText: boolean = false;
        if (widget.paragraphFormat.bidi && endLine.children.indexOf(endElement) > 0) {
            endElement = endLine.children[0];
        }
        for (let i: number = startIndex; i < widget.childWidgets.length; i++) {
            let line: LineWidget = widget.childWidgets[i] as LineWidget;
            if (i === startIndex) {
                top = this.getTop(line);
            }
            if (endElement instanceof TextElementBox) {
                isRtlText = endElement.isRightToLeft;
            }
            let left: number = this.getLeft(line);
            if (line === endLine) {
                //Selection ends in current line.
                let right: number = 0;
                // highlighting approach for normal and rtl text.
                if (isRtlText || widget.bidi) {
                    let elementBoxCollection: ElementBox[] = this.getElementsBackward(line, endElement, endElement, widget.bidi);
                    for (let i: number = 0; i < elementBoxCollection.length; i++) {
                        let element: ElementBox = elementBoxCollection[i];
                        let elementIsRTL: boolean = false;
                        if (element === endElement) {
                            right = this.getLeftInternal(line, element, endIndex);
                        } else {
                            let index: number = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                            right = this.getLeftInternal(line, element, index);
                        }
                        left = this.getLeftInternal(line, element, 0);
                        if (element instanceof TextElementBox) {
                            elementIsRTL = element.isRightToLeft;
                        }
                        width = Math.abs(right - left);
                        // Handled the paragraph mark highliting as special case.
                        if (element === endElement && element instanceof TextElementBox && endIndex > (element as TextElementBox).length) {
                            // tslint:disable-next-line:max-line-length
                            let paragraphMarkWidth: number = this.documentHelper.textHelper.getParagraphMarkSize(element.line.paragraph.characterFormat).Width;
                            if (!widget.bidi && elementIsRTL) {
                                right += paragraphMarkWidth;
                            } else if (widget.bidi && !elementIsRTL) { // Paragrph and Selection ends in normal text
                                width -= paragraphMarkWidth;
                                // Highlight the element.
                                this.createHighlightBorder(line, width, left, top, true);
                                // Highlight the paragraph mark of Bidi paragrph. 
                                left = this.getLineStartLeft(line) - paragraphMarkWidth;
                                this.createHighlightBorder(line, paragraphMarkWidth, left, top, true);
                                // continue to next element.
                                continue;
                            }
                        }
                        this.createHighlightBorder(line, width, elementIsRTL ? right : left, top, true);
                    }
                    return;
                } else {
                    right = this.getLeftInternal(endLine, endElement, endIndex);
                    width = Math.abs(right - left);
                    this.createHighlightBorder(line, width, isRtlText ? right : left, top, false);
                    return;
                }
            } else {
                width = this.getWidth(line, true) - (left - widget.x);
                // Highlight the paragrph mark for Bidi paragrph.
                if (widget.bidi && line.isLastLine()) {
                    left -= this.documentHelper.textHelper.getParagraphMarkSize(widget.characterFormat).Width;
                }
                this.createHighlightBorder(line, width, left, top, false);
                top += line.height;
            }

        }
    }
    //Table Widget
    /**
     * Get line widget form table widget
     * @private
     */
    public getLineWidgetTableWidget(widget: TableWidget, point: Point): LineWidget {
        let lineWidget: LineWidget = undefined;
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            //Removed the height condition check to handle the vertically merged cells.
            let childWidget: IWidget = widget.childWidgets[i];
            if (childWidget instanceof TableRowWidget && (childWidget as TableRowWidget).y <= point.y) {
                lineWidget = this.getLineWidgetRowWidget((childWidget as TableRowWidget), point);
                let cellWidget: TableCellWidget = undefined;
                if (!isNullOrUndefined(lineWidget) && lineWidget.paragraph.containerWidget instanceof TableCellWidget) {
                    cellWidget = lineWidget.paragraph.containerWidget as TableCellWidget;
                }

                let cellSpacing: number = 0;
                let rowSpan: number = 0;
                if (!isNullOrUndefined(cellWidget)) {
                    let tableWidget: TableWidget = (cellWidget.ownerRow.containerWidget as TableWidget);
                    cellSpacing = HelperMethods.convertPointToPixel(tableWidget.tableFormat.cellSpacing);
                    rowSpan = cellWidget.cellFormat.rowSpan;
                }
                let leftCellSpacing: number = 0;
                let rightCellSpacing: number = 0;
                let topCellSpacing: number = 0;
                let bottomCellSpacing: number = 0;
                if (cellSpacing > 0) {
                    leftCellSpacing = cellWidget.cellIndex === 0 ? cellSpacing : cellSpacing / 2;
                    // tslint:disable-next-line:max-line-length
                    rightCellSpacing = cellWidget.cellIndex === cellWidget.ownerRow.childWidgets.length - 1 ? cellSpacing : cellSpacing / 2;
                    let rowWidget: TableRowWidget = undefined;
                    if (cellWidget.containerWidget instanceof TableRowWidget) {
                        rowWidget = cellWidget.containerWidget as TableRowWidget;
                    }
                    let tableWidget: TableWidget = undefined;
                    if (cellWidget.containerWidget.containerWidget instanceof TableWidget) {
                        tableWidget = cellWidget.containerWidget.containerWidget as TableWidget;
                    }
                    if (!isNullOrUndefined(rowWidget) && !isNullOrUndefined(tableWidget)) {
                        topCellSpacing = cellWidget.ownerRow.rowIndex === 0 ? cellSpacing : cellSpacing / 2;
                        if (cellWidget.ownerRow.rowIndex + rowSpan === cellWidget.ownerTable.childWidgets.length) {
                            bottomCellSpacing = cellSpacing;
                        } else {
                            bottomCellSpacing = cellSpacing / 2;
                        }
                    }
                }
                if ((!isNullOrUndefined(lineWidget) && lineWidget.paragraph.x <= point.x
                    && lineWidget.paragraph.x + lineWidget.width >= point.x
                    && lineWidget.paragraph.y <= point.y && this.getTop(lineWidget) + lineWidget.height >= point.y)
                    || (!isNullOrUndefined(cellWidget) && cellWidget.x - cellWidget.margin.left - leftCellSpacing <= point.x
                        && cellWidget.x + cellWidget.width + cellWidget.margin.right + rightCellSpacing >= point.x
                        && cellWidget.y - cellWidget.margin.top - topCellSpacing <= point.y
                        && cellWidget.y + cellWidget.height + cellWidget.margin.bottom + bottomCellSpacing >= point.y)) {
                    break;
                }
            }
        }
        return lineWidget;
    }
    //TableRowWidget
    /**
     * Get line widget fom row 
     * @private
     */
    public getLineWidgetRowWidget(widget: TableRowWidget, point: Point): LineWidget {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let cellSpacing: number = 0;
            cellSpacing = HelperMethods.convertPointToPixel(widget.ownerTable.tableFormat.cellSpacing);
            let leftCellSpacing: number = 0;
            let rightCellSpacing: number = 0;
            if (cellSpacing > 0) {
                leftCellSpacing = (widget.childWidgets[i] as TableCellWidget).columnIndex === 0 ? cellSpacing : cellSpacing / 2;
                // tslint:disable-next-line:max-line-length
                rightCellSpacing = (widget.childWidgets[i] as TableCellWidget).cellIndex === (widget.childWidgets[i] as TableCellWidget).ownerRow.childWidgets.length - 1 ? cellSpacing : cellSpacing / 2;
            }
            if ((widget.childWidgets[i] as TableCellWidget).x -
                // tslint:disable-next-line:max-line-length
                (widget.childWidgets[i] as TableCellWidget).margin.left - leftCellSpacing <= point.x && ((widget.childWidgets[i] as TableCellWidget).x +
                    // tslint:disable-next-line:max-line-length
                    (widget.childWidgets[i] as TableCellWidget).width) + (widget.childWidgets[i] as TableCellWidget).margin.right + rightCellSpacing >= point.x) {
                return this.getLineWidgetCellWidget((widget.childWidgets[i] as TableCellWidget), point);
            }
        }
        let lineWidget: LineWidget = undefined;
        if (widget.childWidgets.length > 0) {
            if ((widget.childWidgets[0] as Widget).x <= point.x) {
                lineWidget = this.getLineWidgetCellWidget((widget.childWidgets[widget.childWidgets.length - 1] as TableCellWidget), point);
            } else {
                lineWidget = this.getLineWidgetCellWidget((widget.childWidgets[0] as TableCellWidget), point);
            }
        }
        return lineWidget;
    }
    /**
     * @private
     */
    public getFirstBlock(cell: TableCellWidget): BlockWidget {
        if (cell.childWidgets.length > 0) {
            return cell.childWidgets[0] as BlockWidget;
        }
        return undefined;
    }
    //Table Cell Widget
    /**
     * Highlight selected cell widget
     * @private
     */
    public highlightCellWidget(widget: TableCellWidget): void {
        let widgets: TableCellWidget[] = [];
        if (widget.previousSplitWidget || widget.nextSplitWidget) {
            widgets = widget.getSplitWidgets() as TableCellWidget[];
        } else {
            widgets.push(widget);
        }
        for (let i: number = 0; i < widgets.length; i++) {
            widget = widgets[i];
            //Clears Selection highlight of the child widgets.
            this.clearChildSelectionHighlight(widget);
            //Highlights the entire cell.
            this.createHighlightBorderInsideTable(widget);
        }
    }
    /**
     * Clear selection highlight
     * @private
     */
    public clearSelectionHighlight(widget: IWidget): void {
        if (this.selectedWidgets.containsKey(widget)) {
            this.removeSelectionHighlight(widget);
            this.selectedWidgets.remove(widget);
        }
    }
    /**
     * Get line widget from cell widget
     * @private
     */
    public getLineWidgetCellWidget(widget: TableCellWidget, point: Point): LineWidget {
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            if ((widget.childWidgets[i] as Widget).y <= point.y
                && ((widget.childWidgets[i] as Widget).y + (widget.childWidgets[i] as Widget).height) >= point.y) {
                if ((widget.childWidgets[i] as Widget) instanceof ParagraphWidget) {
                    return this.getLineWidgetParaWidget((widget.childWidgets[i] as ParagraphWidget), point);
                } else {
                    return this.getLineWidgetTableWidget((widget.childWidgets[i] as TableWidget), point);
                }
            }
        }
        let lineWidget: LineWidget = undefined;
        if (widget.childWidgets.length > 0) {
            if ((widget.childWidgets[0] as Widget).y <= point.y) {
                if ((widget.childWidgets[widget.childWidgets.length - 1] as Widget) instanceof ParagraphWidget) {
                    // tslint:disable-next-line:max-line-length
                    lineWidget = this.getLineWidgetParaWidget((widget.childWidgets[widget.childWidgets.length - 1] as ParagraphWidget), point);
                } else {
                    lineWidget = this.getLineWidgetTableWidget((widget.childWidgets[0] as TableWidget), point);
                }
            }
        }
        return lineWidget;
    }
    //LineWidget
    /**
     * update text position
     * @private
     */
    public updateTextPosition(widget: LineWidget, point: Point): void {
        let caretPosition: Point = point;
        let element: ElementBox = undefined;
        let index: number = 0;
        let isImageSelected: boolean = false;
        let isImageSelectedObj: TextPositionInfo = this.updateTextPositionIn(widget, element, index, point, false);
        if (!isNullOrUndefined(isImageSelectedObj)) {
            element = isImageSelectedObj.element;
            index = isImageSelectedObj.index;
            caretPosition = isImageSelectedObj.caretPosition;
            isImageSelected = isImageSelectedObj.isImageSelected;
            this.isImageSelected = isImageSelected;
        }
        if (isImageSelected) {
            this.selectInternal(widget, element, index, caretPosition);
            if (index === 0) {
                this.extendForward();
            } else {
                this.extendBackward();
            }
        } else {
            this.selectInternal(widget, element, index, caretPosition);
        }
    }
    /**
     * @private
     */
    /* tslint:disable */
    public updateTextPositionIn(widget: LineWidget, inline: ElementBox, index: number, caretPosition: Point, includeParagraphMark: boolean): TextPositionInfo {
        let isImageSelected: boolean = false;
        let top: number = this.getTop(widget);
        let left: number = widget.paragraph.x;
        let elementValues: FirstElementInfo = this.getFirstElement(widget, left);
        let element: ElementBox = elementValues.element;
        let isRtlText: boolean = false;
        let isParaBidi: boolean = false;
        left = elementValues.left;
        if (isNullOrUndefined(element)) {
            let topMargin: number = 0; let bottomMargin: number = 0;
            let size: SizeInfo = this.getParagraphMarkSize(widget.paragraph, topMargin, bottomMargin);
            topMargin = size.topMargin;
            bottomMargin = size.bottomMargin;
            let selectParaMark: boolean = this.documentHelper.mouseDownOffset.y >= top && this.documentHelper.mouseDownOffset.y < top + widget.height ? (this.documentHelper.mouseDownOffset.x < left + size.width) : true;
            if (selectParaMark && includeParagraphMark && caretPosition.x > left + size.width / 2) {
                left += size.width;
                if (widget.children.length > 0) {
                    inline = widget.children[widget.children.length - 1];
                    index = inline.length;
                }
                index++;
            }
            caretPosition = new Point(left, topMargin > 0 ? top + topMargin : top);
        } else {
            if (!isNullOrUndefined(element)) {
                if (caretPosition.x > left + element.margin.left) {
                    for (let i: number = widget.children.indexOf(element); i < widget.children.length; i++) {
                        element = widget.children[i];
                        let isCurrentParaBidi: boolean = false;
                        if (element instanceof ListTextElementBox || element instanceof TextElementBox) {
                            isCurrentParaBidi = element.line.paragraph.paragraphFormat.bidi;
                        }
                        if (caretPosition.x < left + element.margin.left + element.width || i === widget.children.length - 1
                            || ((widget.children[i + 1] instanceof ListTextElementBox) && isCurrentParaBidi)) {
                            break;
                        }
                        left += element.margin.left + element.width;
                    }
                    if (element instanceof TextElementBox) {
                        isRtlText = element.isRightToLeft;
                        isParaBidi = (element as TextElementBox).line.paragraph.paragraphFormat.bidi;
                    }
                    if (caretPosition.x > left + element.margin.left + element.width) {
                        //Line End
                        index = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                        if (isRtlText && isParaBidi) {
                            index = 0;
                        }
                        if ((element instanceof TextElementBox && (element as TextElementBox).text !== "\v") || includeParagraphMark) {
                            left += element.margin.left + element.width;
                        }
                    } else if (element instanceof TextElementBox) {
                        if (element instanceof TextElementBox && isRtlText) {
                            left += element.width;
                        }
                        let x: number = 0;
                        if (isRtlText) {
                            x = (left + element.margin.left) - caretPosition.x;
                        } else {
                            x = caretPosition.x - left - element.margin.left;
                        }
                        left += element.margin.left;
                        let prevWidth: number = 0;
                        let charIndex: number = 0;
                        for (let i: number = 1; i <= (element as TextElementBox).length; i++) {
                            let width: number = 0;
                            if (i === (element as TextElementBox).length) {
                                width = element.width;
                            } else {
                                width = this.documentHelper.textHelper.getWidth((element as TextElementBox).text.substr(0, i), element.characterFormat);
                                (element as TextElementBox).trimEndWidth = width;
                            }
                            if (x < width || i === (element as TextElementBox).length) {
                                //Updates exact left position of the caret.
                                let charWidth: number = width - prevWidth;
                                if (x - prevWidth > charWidth / 2) {
                                    if (isRtlText) {
                                        left -= width;
                                    } else {
                                        left += width;
                                    }
                                    charIndex = i;
                                } else {
                                    if (isRtlText) {
                                        left -= prevWidth;
                                    } else {
                                        left += prevWidth;
                                    }
                                    charIndex = i - 1;
                                    if (i === 1 && element !== widget.children[0]) {
                                        let curIndex: number = widget.children.indexOf(element);
                                        if (!(widget.children[curIndex - 1] instanceof ListTextElementBox) && !isRtlText) {
                                            element = widget.children[curIndex - 1];
                                            charIndex = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                                        }
                                    }
                                }
                                break;
                            }
                            prevWidth = width;
                        }
                        index = charIndex;
                    } else {
                        isImageSelected = element instanceof ImageElementBox;
                        if (caretPosition.x - left - element.margin.left > element.width / 2) {
                            index = 1;
                            left += element.margin.left + element.width;
                        } else if (element !== widget.children[0] && !isImageSelected) {
                            let curIndex: number = widget.children.indexOf(element);
                            if (!(widget.children[curIndex - 1] instanceof ListTextElementBox)) {
                                element = widget.children[curIndex - 1];
                                index = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                            }
                        }
                    }
                    if (element instanceof TextElementBox && (element as TextElementBox).text === '\v') {
                        index = 0;
                    }

                } else {
                    isRtlText = element.isRightToLeft;
                    isParaBidi = element.line.paragraph.paragraphFormat.bidi;
                    if (element instanceof TextElementBox && (isParaBidi || isRtlText) && caretPosition.x < left + element.margin.left + element.width) {
                        index = this.getTextLength(element.line, element) + (element as TextElementBox).length;
                    } else {
                        index = this.getTextLength(element.line, element);
                    }
                    left += element.margin.left;
                }
                if (element instanceof TextElementBox) {
                    top += element.margin.top > 0 ? element.margin.top : 0;
                } else {
                    let textMetrics: TextSizeInfo = this.documentHelper.textHelper.getHeight(element.characterFormat);     //for ascent and descent
                    let height: number = element.height;
                    if (element instanceof BookmarkElementBox && !this.documentHelper.layout.hasValidElement(element.line.paragraph)) {
                        height = textMetrics.Height;    //after text helper class
                    }
                    top += element.margin.top + height - textMetrics.BaselineOffset;
                }
                inline = element;
                let inlineObj: ElementInfo = this.validateTextPosition(inline, index);
                inline = inlineObj.element;
                index = inlineObj.index;
                let isParagraphEnd: boolean = isNullOrUndefined(inline.nextNode) && index === inline.length;
                let isLineEnd: boolean = isNullOrUndefined(inline.nextNode)
                    && inline instanceof TextElementBox && (inline as TextElementBox).text === '\v';
                if (includeParagraphMark && inline.nextNode instanceof FieldElementBox && index === inline.length) {
                    isParagraphEnd = this.isLastRenderedInline(inline, index);
                }
                if (includeParagraphMark && isParagraphEnd || isLineEnd) {
                    let width: number = 0;
                    //Include width of Paragraph mark.
                    if (isParagraphEnd) {
                        width = this.documentHelper.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
                        let selectParaMark: boolean = this.documentHelper.mouseDownOffset.y >= top && this.documentHelper.mouseDownOffset.y < top + widget.height ? (this.documentHelper.mouseDownOffset.x < left + width) : true;
                        if (selectParaMark && caretPosition.x > left + width / 2) {
                            left += width;
                            index = inline.length + 1;
                        }
                        //Include width of line break mark.
                    } else if (isLineEnd) {
                        width = element.width;
                        left += width;
                        index = inline.length;
                    }
                }
                caretPosition = new Point(left, top);
            }
        }
        return {
            'element': inline,
            'index': index,
            'caretPosition': caretPosition,
            'isImageSelected': isImageSelected
        };
    }
    /* tslint:enable */
    /**
     * Get text length if the line widget
     * @private
     */
    public getTextLength(widget: LineWidget, element: ElementBox): number {
        let length: number = 0;
        let count: number = widget.children.indexOf(element);
        if (widget.children.length > 0 && widget.children[0] instanceof ListTextElementBox) {
            if (widget.children[1] instanceof ListTextElementBox) {
                count -= 2;
            } else {
                count -= 1;
            }
        }
        for (let i: number = 1; i < count; i++) {
            length += widget.children[i].length;
        }
        return length;
    }
    /**
     * Get Line widget left
     * @private
     */
    public getLeft(widget: LineWidget): number {
        let left: number = widget.paragraph.x;
        let paragraphFormat: WParagraphFormat = widget.paragraph.paragraphFormat;
        if (this.isParagraphFirstLine(widget) && !paragraphFormat.bidi && !(paragraphFormat.textAlignment === 'Right')) {
            left += HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
        }
        for (let i: number = 0; i < widget.children.length; i++) {
            let element: ElementBox = widget.children[i];
            if (element instanceof ListTextElementBox && !paragraphFormat.bidi) {     //after list implementation
                if (i === 0) {
                    left += element.margin.left + element.width;
                } else {
                    left += element.width;
                }
            } else {
                left += element.margin.left;
                break;
            }
        }
        return left;
    }
    /**
     * Get line widget top
     * @private
     */
    public getTop(widget: LineWidget): number {
        let top: number = widget.paragraph.y;
        let count: number = widget.paragraph.childWidgets.indexOf(widget);
        for (let i: number = 0; i < count; i++) {
            top += (widget.paragraph.childWidgets[i] as LineWidget).height;
        }
        return top;
    }
    /**
     * Get first element the widget
     * @private
     */
    public getFirstElement(widget: LineWidget, left: number): FirstElementInfo {
        let firstLineIndent: number = 0;
        if (this.isParagraphFirstLine(widget) && !widget.paragraph.paragraphFormat.bidi) {
            firstLineIndent = HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
        }
        left += firstLineIndent;
        let element: ElementBox = undefined;
        for (let i: number = 0; i < widget.children.length; i++) {
            element = widget.children[i];
            if (element instanceof ListTextElementBox || element instanceof CommentCharacterElementBox) {
                if (widget.paragraph.paragraphFormat.bidi) {
                    left += element.margin.left;
                    element = undefined;
                    break;
                }
                left += element.margin.left + element.width;
                element = undefined;
                // }
                //  else if (element instanceof FieldElementBox || element instanceof BookmarkElementBox
                //     || (element.nextNode instanceof FieldElementBox && ((element.nextNode as FieldElementBox).fieldType === 2))) {
                //     element = undefined;
            } else {
                break;
            }
        }
        return { 'element': element, 'left': left };
    }
    /**
     * Return inline index
     * @private
     */
    //ElementBox
    public getIndexInInline(elementBox: ElementBox): number {
        let indexInInline: number = 0;
        if (elementBox instanceof TextElementBox) {
            let count: number = elementBox.line.children.indexOf(elementBox);
            for (let i: number = 0; i < count; i++) {
                let element: ElementBox = elementBox.line.children[i];
                if (element instanceof FieldElementBox || element instanceof ListTextElementBox) {
                    continue;
                }
                indexInInline += element.length;
            }
        }
        return indexInInline;
    }
    /**
     * Return true if widget is first inline of paragraph
     * @private
     */
    public isParagraphFirstLine(widget: LineWidget): boolean {
        if (isNullOrUndefined(widget.paragraph.previousSplitWidget) &&
            widget === widget.paragraph.firstChild) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isParagraphLastLine(widget: LineWidget): boolean {
        if (isNullOrUndefined(widget.paragraph.nextSplitWidget)
            && widget === widget.paragraph.lastChild) {
            return true;
        }
        return false;

    }
    /**
     * Return line widget width
     * @private
     */
    public getWidth(widget: LineWidget, includeParagraphMark: boolean): number {
        let width: number = 0;
        let paraFormat: WParagraphFormat = widget.paragraph.paragraphFormat;
        if (this.isParagraphFirstLine(widget) && !paraFormat.bidi) {
            width += HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        for (let i: number = 0; i < widget.children.length; i++) {
            width += widget.children[i].margin.left + widget.children[i].width;
        }
        if (includeParagraphMark && widget.paragraph.childWidgets.indexOf(widget) === widget.paragraph.childWidgets.length - 1
            && isNullOrUndefined(widget.paragraph.nextSplitWidget)) {
            width += this.documentHelper.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
        }
        return width;
    }
    /**
     * Return line widget left
     * @private
     */
    public getLeftInternal(widget: LineWidget, elementBox: ElementBox, index: number): number {
        let left: number = widget.paragraph.x;
        let paraFormat: WParagraphFormat = widget.paragraph.paragraphFormat;
        if (this.isParagraphFirstLine(widget) && !paraFormat.bidi) {
            // tslint:disable-next-line:max-line-length
            left += HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
        }
        let isRtlText: boolean = false;
        let isParaBidi: boolean = false;
        if (elementBox instanceof TextElementBox) {
            isRtlText = elementBox.isRightToLeft;
            isParaBidi = (elementBox as TextElementBox).line.paragraph.paragraphFormat.bidi;
        }
        //when line contains normal text and para is RTL para.
        //if home key is pressed, update caret position after the last element in a line.
        //if end key pressed, update caret position before the first element in a line. 

        if (isParaBidi) {
            if (!isRtlText) {
                if (this.documentHelper.moveCaretPosition === 1 && widget.children.length > 0) {
                    elementBox = widget.children[widget.children.length - 1];
                } else if (this.documentHelper.moveCaretPosition === 2) {
                    elementBox = widget.children[0];
                }
                if (elementBox instanceof ListTextElementBox && widget.children.length > 2) {
                    elementBox = widget.children[widget.children.length - 3];
                }
            }
        }
        let count: number = widget.children.indexOf(elementBox);
        if ((widget.children.length === 1 && widget.children[0] instanceof ListTextElementBox) || (widget.children.length === 2
            && widget.children[0] instanceof ListTextElementBox && widget.children[1] instanceof ListTextElementBox)) {
            count = widget.children.length;
        }
        for (let i: number = 0; i < count; i++) {
            let widgetInternal: ElementBox = widget.children[i];
            // if (widgetInternal instanceof FieldElementBox) {
            //     continue;
            // }
            if (i === 1 && widget.children[i] instanceof ListTextElementBox) {
                left += widget.children[i].width;
            } else if (widget.children[i] instanceof TabElementBox && elementBox === widgetInternal) {
                left += widget.children[i].margin.left;
            } else {
                left += widget.children[i].margin.left + widget.children[i].width;
            }
        }
        if (!isNullOrUndefined(elementBox)) {
            left += elementBox.margin.left;
            if (isRtlText || (this.documentHelper.moveCaretPosition === 1 && !isRtlText && isParaBidi)) {
                left += elementBox.width;
            }
        }
        let width: number = 0;
        if (elementBox instanceof TextElementBox) {
            if ((this.documentHelper.moveCaretPosition !== 0) && (isParaBidi || isRtlText)) {
                if ((isRtlText && isParaBidi && this.documentHelper.moveCaretPosition === 2)
                    || (isRtlText && !isParaBidi && this.documentHelper.moveCaretPosition === 1)) {
                    left -= elementBox.width;
                }
                this.documentHelper.moveCaretPosition = 0;
                return left;
            }
            if (index === (elementBox as TextElementBox).length && !isRtlText) {
                left += elementBox.width;
            } else if (index > (elementBox as TextElementBox).length) {
                width = this.documentHelper.textHelper.getParagraphMarkWidth(elementBox.line.paragraph.characterFormat);
                if (isRtlText) {
                    left -= elementBox.width + width;
                } else {
                    left += elementBox.width + width;
                }
            } else {
                // tslint:disable-next-line:max-line-length
                width = this.documentHelper.textHelper.getWidth((elementBox as TextElementBox).text.substr(0, index), (elementBox as TextElementBox).characterFormat);
                (elementBox as TextElementBox).trimEndWidth = width;
                if (isRtlText) {
                    left -= width;
                } else {
                    left += width;
                }
            }
            this.documentHelper.moveCaretPosition = 0;
        } else if (index > 0) {
            if (!isNullOrUndefined(elementBox) && !(elementBox instanceof ListTextElementBox)) {
                left += elementBox.width;
                if (index === 2) {
                    let paragraph: ParagraphWidget = elementBox.line.paragraph;
                    left += this.documentHelper.textHelper.getParagraphMarkWidth(paragraph.characterFormat);
                }
            } else {
                left += this.documentHelper.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
            }
        }
        return left;
    }
    /**
     * Return line widget start offset
     * @private
     */
    public getLineStartLeft(widget: LineWidget): number {
        let left: number = widget.paragraph.x;
        let paragraphFormat: WParagraphFormat = widget.paragraph.paragraphFormat;
        if (this.isParagraphFirstLine(widget) && !paragraphFormat.bidi) {
            left += HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
        }
        if (widget.children.length > 0) {
            left += widget.children[0].margin.left;
        }
        return left;
    }
    /**
     * Update text position 
     * @private
     */
    public updateTextPositionWidget(widget: LineWidget, point: Point, textPosition: TextPosition, includeParagraphMark: boolean): void {
        let caretPosition: Point = point;
        let inline: ElementBox = undefined;
        let index: number = 0;
        let updatePositionObj: TextPositionInfo;
        updatePositionObj = this.updateTextPositionIn(widget, inline, index, caretPosition, includeParagraphMark);
        inline = updatePositionObj.element;
        index = updatePositionObj.index;
        caretPosition = updatePositionObj.caretPosition;
        textPosition.setPositionForSelection(widget, inline, index, caretPosition);
    }
    /**
     * Clear selection highlight
     * @private
     */
    public clearSelectionHighlightLineWidget(widget: LineWidget): void {
        if (!isNullOrUndefined(this.owner) && this.selectedWidgets.length > 0) {
            this.clearSelectionHighlight(this);
        }
    }
    /**
     * Return first element from line widget
     * @private
     */
    public getFirstElementInternal(widget: LineWidget): ElementBox {
        let element: ElementBox = undefined;
        let isBidi: boolean = widget.paragraph.paragraphFormat.bidi;
        let childLen: number = widget.children.length;
        for (let i: number = isBidi ? childLen - 1 : 0; isBidi ? i >= 0 : i < childLen; isBidi ? i-- : i++) {
            element = widget.children[i];
            if (element instanceof ListTextElementBox) {
                element = undefined;
            } else {
                break;
            }
        }
        return element;
    }
    //Selection API    
    /**
     * Select content between given range
     * @private
     */
    public selectRange(startPosition: TextPosition, endPosition: TextPosition): void {
        this.start.setPositionInternal(startPosition);
        this.end.setPositionInternal(endPosition);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Selects current paragraph
     * @private
     */
    public selectParagraphInternal(paragraph: ParagraphWidget, positionAtStart: boolean): void {
        let line: LineWidget;
        if (!isNullOrUndefined(paragraph) && !isNullOrUndefined(paragraph.firstChild)) {
            line = paragraph.firstChild as LineWidget;
            if (positionAtStart) {
                this.start.setPosition(line, positionAtStart);
            } else {
                let endOffset: number = line.getEndOffset();
                this.start.setPositionParagraph(line, endOffset);
            }
        }
        this.end.setPositionInternal(this.start);
        this.upDownSelectionLength = this.start.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * @private
     */
    public setPositionForBlock(block: BlockWidget, selectFirstBlock: boolean): TextPosition {
        let position: TextPosition;
        if (block instanceof TableWidget) {
            if (selectFirstBlock) {
                block = this.getFirstParagraphInFirstCell(block);
            } else {
                block = this.getLastParagraphInLastCell(block);
            }
        }
        if (block instanceof ParagraphWidget) {
            position = new TextPosition(this.owner);
            if (selectFirstBlock) {
                position.setPosition(block.firstChild as LineWidget, true);
            } else {
                let line: LineWidget = block.lastChild as LineWidget;
                position.setPositionParagraph(line, line.getEndOffset());
            }
        }
        return position;
    }
    /**
     * Select content in given text position
     * @private
     */
    public selectContent(textPosition: TextPosition, clearMultiSelection: boolean): void {
        if (isNullOrUndefined(textPosition)) {
            throw new Error('textPosition is undefined.');
        }

        this.start.setPositionInternal(textPosition);
        this.end.setPositionInternal(textPosition);
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }

    /**
     * Select paragraph
     * @private
     */
    public selectInternal(lineWidget: LineWidget, element: ElementBox, index: number, physicalLocation: Point): void {
        this.start.setPositionForSelection(lineWidget, element, index, physicalLocation);
        this.end.setPositionInternal(this.start);
        this.upDownSelectionLength = physicalLocation.x;
        this.fireSelectionChanged(true);
    }
    /**
     * @private
     */
    public selects(lineWidget: LineWidget, offset: number, skipSelectionChange: boolean): void {
        this.documentHelper.clearSelectionHighlight();
        this.start.setPositionForLineWidget(lineWidget, offset);
        this.end.setPositionInternal(this.start);
        if (!skipSelectionChange) {
            this.fireSelectionChanged(true);
        }
    }

    /**
     * Select content between start and end position
     * @private
     */
    public selectPosition(startPosition: TextPosition, endPosition: TextPosition): void {
        if (isNullOrUndefined(startPosition) || isNullOrUndefined(endPosition)) {
            throw new Error('TextPosition cannot be undefined');
        }
        if (isNullOrUndefined(startPosition.paragraph)
            || startPosition.offset > this.getParagraphLength(startPosition.paragraph) + 1) {
            throw new Error('Start TextPosition is not valid.');
        }
        if (isNullOrUndefined(endPosition.paragraph)
            || endPosition.offset > this.getParagraphLength(endPosition.paragraph) + 1) {
            throw new Error('End TextPosition is not valid.');
        }


        if (startPosition.isAtSamePosition(endPosition)) {
            // Select start position.
            this.selectRange(startPosition, startPosition);
        } else {
            // If both text position exists within same comment or outside comment, and not at same position.
            if (startPosition.isExistBefore(endPosition)) {
                // tslint:disable-next-line:max-line-length
                endPosition.validateForwardFieldSelection(startPosition.getHierarchicalIndexInternal(), endPosition.getHierarchicalIndexInternal());
            } else {
                // tslint:disable-next-line:max-line-length
                startPosition.validateForwardFieldSelection(endPosition.getHierarchicalIndexInternal(), startPosition.getHierarchicalIndexInternal());
            }
            this.selectRange(startPosition, endPosition);
        }
    }

    /**
     * Notify selection change event
     * @private
     */
    public fireSelectionChanged(isSelectionChanged: boolean): void {
        if (!this.isEmpty) {
            if (this.isForward) {
                this.start.updatePhysicalPosition(true);
                this.end.updatePhysicalPosition(false);
            } else {
                this.start.updatePhysicalPosition(false);
                this.end.updatePhysicalPosition(true);
            }
        }
        if (!this.skipFormatRetrieval) {
            this.retrieveCurrentFormatProperties();
        }
        this.documentHelper.clearSelectionHighlight();
        this.hideToolTip();
        if (this.owner.isLayoutEnabled && !this.owner.isShiftingEnabled) {
            this.highlightSelection(true);
        }
        if (this.documentHelper.restrictEditingPane.isShowRestrictPane && !this.skipEditRangeRetrieval) {
            this.documentHelper.restrictEditingPane.updateUserInformation();
        }
        if (isSelectionChanged) {
            if (this.start.paragraph.isInHeaderFooter && !this.owner.enableHeaderAndFooter) {
                this.owner.enableHeaderAndFooter = true;
            } else if (!this.start.paragraph.isInHeaderFooter && this.owner.enableHeaderAndFooter) {
                this.owner.enableHeaderAndFooter = false;
            }
            this.owner.fireSelectionChange();
        }
        this.documentHelper.updateFocus();
    }
    //Formats Retrieval
    /**
     * Retrieve all current selection format
     * @private
     */
    public retrieveCurrentFormatProperties(): void {
        this.isRetrieveFormatting = true;
        let startPosition: TextPosition = this.start;
        let endPosition: TextPosition = this.end;
        if (!this.isForward) {
            startPosition = this.end;
            endPosition = this.start;
        }
        this.retrieveImageFormat(startPosition, endPosition);
        this.retrieveCharacterFormat(startPosition, endPosition);
        this.retrieveParagraphFormat(startPosition, endPosition);
        this.retrieveSectionFormat(startPosition, endPosition);
        this.retrieveTableFormat(startPosition, endPosition);
        if (!this.isImageSelected) {
            this.imageFormat.clearImageFormat();
        }
        this.isRetrieveFormatting = false;
        this.setCurrentContextType();
    }
    /**
     * @private
     */
    public retrieveImageFormat(start: TextPosition, end: TextPosition): void {
        let image: ElementBox;
        if (start.currentWidget === end.currentWidget && start.offset + 1 === end.offset) {
            let elementInfo: ElementInfo = end.currentWidget.getInline(end.offset, 0);
            image = elementInfo.element;
            let index: number = elementInfo.index;
            if (image instanceof ImageElementBox) {
                let startOffset: number = start.currentWidget.getOffset(image, 0);
                if (startOffset !== start.offset) {
                    image = undefined;
                }
            }
        }
        if (image instanceof ImageElementBox) {
            this.imageFormat.copyImageFormat(image);
        } else {
            this.imageFormat.clearImageFormat();
        }
    }
    private setCurrentContextType(): void {
        let contextIsinImage: boolean = this.imageFormat.image ? true : false;
        let contextIsinTable: boolean = (isNullOrUndefined(this.tableFormat) || isNullOrUndefined(this.tableFormat.table)) ? false : true;
        let style: WStyle = this.start.paragraph.paragraphFormat.baseStyle;
        if (style instanceof WParagraphStyle && style.name.toLowerCase().indexOf('toc') === 0) {
            let tocField: FieldElementBox = this.getTocFieldInternal();
            if (!isNullOrUndefined(tocField)) {
                this.contextTypeInternal = 'TableOfContents';
                return;
            }
        }
        if (this.start.paragraph.isInHeaderFooter) {
            let isInHeader: boolean = (this.start.paragraph.bodyWidget as HeaderFooterWidget).headerFooterType.indexOf('Header') !== -1;
            if (contextIsinTable) {
                if (contextIsinImage) {
                    this.contextTypeInternal = isInHeader ? 'HeaderTableImage' : 'FooterTableImage';
                } else {
                    this.contextTypeInternal = isInHeader ? 'HeaderTableText' : 'FooterTableText';
                }

            } else {
                if (contextIsinImage) {
                    this.contextTypeInternal = isInHeader ? 'HeaderImage' : 'FooterImage';
                } else {
                    this.contextTypeInternal = isInHeader ? 'HeaderText' : 'FooterText';
                }
            }
        } else {
            if (contextIsinTable) {
                this.contextTypeInternal = contextIsinImage ? 'TableImage' : 'TableText';
            } else {
                this.contextTypeInternal = contextIsinImage ? 'Image' : 'Text';
            }
        }
    }
    //Table Format retrieval starts
    /**
     * Retrieve selection table format
     * @private
     */
    public retrieveTableFormat(start: TextPosition, end: TextPosition): void {
        let tableAdv: TableWidget = this.getTable(start, end);

        if (!isNullOrUndefined(tableAdv)) {
            this.tableFormat.copyFormat(tableAdv.tableFormat);
            this.tableFormat.table = tableAdv;
            this.retrieveCellFormat(start, end);
            this.retrieveRowFormat(start, end);
        } else {
            //When the selection is out of table
            this.tableFormat.clearFormat();
        }
    }
    /**
     * Retrieve selection cell format
     * @private
     */
    public retrieveCellFormat(start: TextPosition, end: TextPosition): void {
        if (start.paragraph.isInsideTable && end.paragraph.isInsideTable) {
            this.cellFormat.copyFormat(start.paragraph.associatedCell.cellFormat);
            this.getCellFormat(start.paragraph.associatedCell.ownerTable, start, end);
        } else {
            //When the selection is out of table
            this.cellFormat.clearCellFormat();
        }
    }
    /**
     * Retrieve selection row format
     * @private
     */
    public retrieveRowFormat(start: TextPosition, end: TextPosition): void {
        if (start.paragraph.isInsideTable && end.paragraph.isInsideTable) {
            this.rowFormat.copyFormat(start.paragraph.associatedCell.ownerRow.rowFormat);
            this.getRowFormat(start.paragraph.associatedCell.ownerTable, start, end);
        } else {
            //When the selection is out of table
            this.rowFormat.clearRowFormat();
        }
    }
    /**
     * Get selected cell format
     * @private
     */
    public getCellFormat(table: TableWidget, start: TextPosition, end: TextPosition): void {
        if (start.paragraph.associatedCell.equals(end.paragraph.associatedCell)) {
            return;
        }
        let isStarted: boolean = false;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row === start.paragraph.associatedCell.ownerRow) {
                isStarted = true;
            }
            if (isStarted) {
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    if (this.isCellSelected(cell, start, end)) {
                        this.cellFormat.combineFormat(cell.cellFormat);
                    }
                    if (cell === end.paragraph.associatedCell) {
                        this.cellFormat.combineFormat(cell.cellFormat);
                        return;
                    }
                }
            }
        }
    }
    /**
     * Get selected row format
     * @private
     */
    public getRowFormat(table: TableWidget, start: TextPosition, end: TextPosition): void {
        let tableRow: TableRowWidget = start.paragraph.associatedCell.ownerRow;
        if (tableRow === end.paragraph.associatedCell.ownerRow) {
            return;
        }
        for (let i: number = table.childWidgets.indexOf(tableRow) + 1; i < table.childWidgets.length; i++) {
            let tempTableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            this.rowFormat.combineFormat(tempTableRow.rowFormat);
            if (tempTableRow === end.paragraph.associatedCell.ownerRow) {
                return;
            }
        }
    }
    /**
     * Return table with given text position
     * @private
     */
    public getTable(startPosition: TextPosition, endPosition: TextPosition): TableWidget {
        if (!isNullOrUndefined(startPosition.paragraph.associatedCell) && !isNullOrUndefined(endPosition.paragraph.associatedCell)) {
            let startTable: TableWidget = startPosition.paragraph.associatedCell.ownerTable;
            let endTable: TableWidget = startPosition.paragraph.associatedCell.ownerTable;
            if (startTable === endTable) {
                return startTable;
            } else {
                if (startTable.contains(startPosition.paragraph.associatedCell)) {
                    return startTable;
                } else if (endTable.contains(startPosition.paragraph.associatedCell)) {
                    return endTable;
                } else if (!startTable.isInsideTable || !endTable.isInsideTable) {
                    return undefined;
                } else {
                    do {
                        startTable = startTable.associatedCell.ownerTable;
                        if (startTable === endTable || startTable.contains(endTable.associatedCell)) {
                            return startTable;
                        } else if (endTable.contains(startTable.associatedCell)) {
                            return endTable;
                        }
                    } while (!isNullOrUndefined(startTable.associatedCell));
                }
            }
        }
        return undefined;
    }
    private getContainerWidget(block: BlockWidget): BlockContainer {
        let bodyWidget: Widget;
        if (block.containerWidget instanceof BlockContainer) {
            bodyWidget = block.containerWidget;
        } else {
            bodyWidget = block.containerWidget;
            while (!(bodyWidget instanceof BlockContainer)) {
                bodyWidget = bodyWidget.containerWidget;
            }
        }
        return bodyWidget as BlockContainer;
    }
    //Table format retrieval ends
    //Section format retrieval starts
    /**
     * Retrieve selection section format
     * @private
     */
    public retrieveSectionFormat(start: TextPosition, end: TextPosition): void {
        let startParaSection: BodyWidget = this.getContainerWidget(start.paragraph) as BodyWidget;
        let endParaSection: BodyWidget = this.getContainerWidget(end.paragraph) as BodyWidget;
        if (!isNullOrUndefined(startParaSection)) {
            this.sectionFormat.copyFormat(startParaSection.sectionFormat);
            let startPageIndex: number = this.documentHelper.pages.indexOf(startParaSection.page);
            let endPageIndex: number = this.documentHelper.pages.indexOf(endParaSection.page);
            for (let i: number = startPageIndex + 1; i <= endPageIndex; i++) {
                this.sectionFormat.combineFormat((this.documentHelper.pages[i].bodyWidgets[0] as BodyWidget).sectionFormat);
            }
        }
    }
    //section format retrieval ends.
    //Paragraph format retrieval implementation starts.
    /**
     * Retrieve selection paragraph format
     * @private
     */
    public retrieveParagraphFormat(start: TextPosition, end: TextPosition): void {
        this.getParagraphFormatForSelection(start.paragraph, this, start, end);
    }
    /**
     * @private
     */
    public getParagraphFormatForSelection(paragraph: ParagraphWidget, selection: Selection, start: TextPosition, end: TextPosition): void {
        //Selection start in cell.
        if (start.paragraph.isInsideTable && (!end.paragraph.isInsideTable
            || start.paragraph.associatedCell !== end.paragraph.associatedCell
            || this.isCellSelected(start.paragraph.associatedCell, start, end)
        )) {
            this.getParagraphFormatInternalInCell(start.paragraph.associatedCell, start, end);
        } else {
            this.getParagraphFormatInternalInParagraph(paragraph, start, end);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getParagraphFormatInternalInParagraph(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void {
        if (start.paragraph === paragraph) {
            this.paragraphFormat.copyFormat(paragraph.paragraphFormat);
        } else {
            this.paragraphFormat.combineFormat(paragraph.paragraphFormat);
        }
        if (end.paragraph === paragraph) {
            return;
        }
        let block: BlockWidget = this.getNextRenderedBlock(paragraph) as BlockWidget;
        if (!isNullOrUndefined(block)) {
            this.getParagraphFormatInternalInBlock(block, start, end);
        }
    }
    /**
     * @private
     */
    public getParagraphFormatInternalInBlock(block: BlockWidget, start: TextPosition, end: TextPosition): void {
        if (block instanceof ParagraphWidget) {
            this.getParagraphFormatInternalInParagraph(block, start, end);
        } else {
            this.getParagraphFormatInternalInTable(block as TableWidget, start, end);
        }
    }
    /**
     * @private
     */
    public getParagraphFormatInternalInTable(table: TableWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < tableRow.childWidgets.length; j++) {
                this.getParagraphFormatInCell(tableRow.childWidgets[j] as TableCellWidget);
            }
            if (end.paragraph.isInsideTable && this.containsRow(tableRow, end.paragraph.associatedCell)) {
                return;
            }
        }
        let block: BlockWidget = this.getNextRenderedBlock(table) as BlockWidget;
        //Goto the next block.
        this.getParagraphFormatInternalInBlock(block, start, end);
    }
    /**
     * Get paragraph format in cell
     * @private
     */
    public getParagraphFormatInCell(cell: TableCellWidget): void {
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            this.getParagraphFormatInBlock((cell.childWidgets[i] as BlockWidget));
        }
    }
    /**
     * @private
     */
    public getParagraphFormatInBlock(block: BlockWidget): void {
        if (block instanceof ParagraphWidget) {
            this.getParagraphFormatInParagraph(block);
        } else {
            this.getParagraphFormatInTable(block as TableWidget);
        }
    }
    /**
     * @private
     */
    public getParagraphFormatInTable(tableAdv: TableWidget): void {
        for (let i: number = 0; i < tableAdv.childWidgets.length; i++) {
            let tableRow: TableRowWidget = tableAdv.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < tableRow.childWidgets.length; j++) {
                this.getParagraphFormatInCell((tableRow.childWidgets[j] as TableCellWidget));
            }
        }
    }
    /**
     * @private
     */
    public getParagraphFormatInParagraph(paragraph: ParagraphWidget): void {
        this.paragraphFormat.combineFormat(paragraph.paragraphFormat);
    }
    /**
     * Get paragraph format in cell
     * @private
     */
    public getParagraphFormatInternalInCell(cellAdv: TableCellWidget, start: TextPosition, end: TextPosition): void {
        if (end.paragraph.isInsideTable) {
            let containerCell: TableCellWidget = this.getContainerCellOf(cellAdv, end.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(end.paragraph.associatedCell)) {
                let startCell: TableCellWidget = this.getSelectedCell(cellAdv, containerCell);
                let endCell: TableCellWidget = this.getSelectedCell(end.paragraph.associatedCell, containerCell);
                if (this.containsCell(containerCell, end.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (this.isCellSelected(containerCell, start, end)) {
                        this.getParagraphFormatInCell(containerCell);
                    } else {
                        if (startCell === containerCell) {
                            this.getParagraphFormatInternalInParagraph(start.paragraph, start, end);
                        } else {
                            this.getParagraphFormatInRow(startCell.ownerRow, start, end);
                        }
                    }
                } else {
                    //Format other selected cells in current table.
                    this.getParaFormatForCell(containerCell.ownerTable, containerCell, endCell);
                }
            } else {
                this.getParagraphFormatInRow(containerCell.ownerRow, start, end);
            }
        } else {
            let cell: TableCellWidget = this.getContainerCell(cellAdv);
            this.getParagraphFormatInRow(cell.ownerRow, start, end);
        }
    }
    /**
     * @private
     */
    public getParaFormatForCell(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): void {
        let startCellIn: number = this.getCellLeft(startCell.ownerRow, startCell);
        let endCellIn: number = startCellIn + startCell.cellFormat.cellWidth;
        let endCellLeft: number = this.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        if (startCellIn > endCellLeft) {
            startCellIn = endCellLeft;
        }
        if (endCellIn < endCellRight) {
            endCellIn = endCellRight;
        }
        if (startCellIn > this.upDownSelectionLength) {
            startCellIn = this.upDownSelectionLength;
        }
        if (startCellIn < this.upDownSelectionLength) {
            startCellIn = this.upDownSelectionLength;
        }
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        for (let i: number = table.childWidgets.indexOf(startCell.ownerRow); i <= count; i++) {
            let tableRow: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < tableRow.childWidgets.length; j++) {
                let cell: TableCellWidget = tableRow.childWidgets[j] as TableCellWidget;
                let left: number = this.getCellLeft(tableRow, cell);
                if (HelperMethods.round(startCellIn, 2) <= HelperMethods.round(left, 2)
                    && HelperMethods.round(left, 2) < HelperMethods.round(endCellIn, 2)) {
                    this.getParagraphFormatInCell(cell);
                }
            }
        }
    }
    /**
     * Get paragraph format ins row
     * @private
     */
    public getParagraphFormatInRow(tableRow: TableRowWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = tableRow.rowIndex; i < tableRow.ownerTable.childWidgets.length; i++) {
            let row: TableRowWidget = tableRow.ownerTable.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.getParagraphFormatInCell((row.childWidgets[j] as TableCellWidget));
            }
            if (end.paragraph.isInsideTable && this.containsRow(row, end.paragraph.associatedCell)) {
                return;
            }
        }
        let block: BlockWidget = this.getNextRenderedBlock(tableRow.ownerTable) as BlockWidget;
        //Goto the next block.
        this.getParagraphFormatInternalInBlock(block, start, end);
    }
    // paragraph format retrieval implementation ends
    // Character format retrieval implementation starts.
    /**
     * Retrieve Selection character format
     * @private
     */
    public retrieveCharacterFormat(start: TextPosition, end: TextPosition): void {
        this.characterFormat.copyFormat(start.paragraph.characterFormat);
        if (start.paragraph === end.paragraph && start.currentWidget.isLastLine()
            && start.offset === this.getLineLength(start.currentWidget) && start.offset + 1 === end.offset) {
            return;
        }
        let para: ParagraphWidget = start.paragraph as ParagraphWidget;
        if (start.offset === this.getParagraphLength(para) && !this.isEmpty) {
            para = this.getNextParagraphBlock(para) as ParagraphWidget;
        }
        while (!isNullOrUndefined(para) && para !== end.paragraph && para.isEmpty()) {
            para = this.getNextParagraphBlock(para) as ParagraphWidget;
        }
        let offset: number = para === start.paragraph ? start.offset : 0;
        let indexInInline: number = 0;
        if (!isNullOrUndefined(para) && !para.isEmpty()) {
            let position: TextPosition = new TextPosition(this.owner);
            let elemInfo: ElementInfo = start.currentWidget.getInline(offset, indexInInline);
            let physicalLocation: Point = this.getPhysicalPositionInternal(start.currentWidget, offset, true);
            position.setPositionForSelection(start.currentWidget, elemInfo.element, elemInfo.index, physicalLocation);
            this.getCharacterFormatForSelection(para, this, position, end);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getCharacterFormatForSelection(paragraph: ParagraphWidget, selection: Selection, startPosition: TextPosition, endPosition: TextPosition): void {
        //Selection start in cell.
        if (startPosition.paragraph instanceof ParagraphWidget && startPosition.paragraph.isInsideTable
            && (!endPosition.paragraph.isInsideTable
                || startPosition.paragraph.associatedCell !== endPosition.paragraph.associatedCell
                || this.isCellSelected(startPosition.paragraph.associatedCell, startPosition, endPosition))) {
            this.getCharacterFormatInTableCell(startPosition.paragraph.associatedCell, selection, startPosition, endPosition);
        } else {
            this.getCharacterFormat(paragraph, startPosition, endPosition);
        }
    }
    /**
     * Get Character format
     * @private
     */
    //Format Retrieval
    public getCharacterFormatForTableRow(tableRowAdv: TableRowWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = tableRowAdv.rowIndex; i < tableRowAdv.ownerTable.childWidgets.length; i++) {
            let tableRow: TableRowWidget = tableRowAdv.ownerTable.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < tableRow.childWidgets.length; j++) {
                this.getCharacterFormatForSelectionCell((tableRow.childWidgets[j] as TableCellWidget), start, end);
            }
            if (end.paragraph.isInsideTable && this.containsRow(tableRow, end.paragraph.associatedCell)) {
                return;
            }
        }
        let block: BlockWidget = this.getNextRenderedBlock(tableRowAdv.ownerTable) as BlockWidget;
        // //Goto the next block.
        this.getCharacterFormatForBlock(block, start, end);
    }
    /**
     * Get Character format in table
     * @private
     */
    public getCharacterFormatInTableCell(tableCell: TableCellWidget, selection: Selection, start: TextPosition, end: TextPosition): void {
        if (end.paragraph.isInsideTable) {
            let containerCell: TableCellWidget = this.getContainerCellOf(tableCell, end.paragraph.associatedCell);
            if (containerCell.ownerTable.contains(end.paragraph.associatedCell)) {
                let startCell: TableCellWidget = this.getSelectedCell(tableCell, containerCell);
                let endCell: TableCellWidget = this.getSelectedCell(end.paragraph.associatedCell, containerCell);
                if (this.containsCell(containerCell, end.paragraph.associatedCell)) {
                    //Selection end is in container cell.
                    if (this.isCellSelected(containerCell, start, end)) {
                        this.getCharacterFormatForSelectionCell(containerCell, start, end);
                    } else {
                        if (startCell === containerCell) {
                            this.getCharacterFormat(start.paragraph, start, end);
                        } else {
                            this.getCharacterFormatForTableRow(startCell.ownerRow, start, end);
                        }
                    }
                } else {
                    //Format other selected cells in current table.
                    this.getCharacterFormatInternalInTable(containerCell.ownerTable, containerCell, endCell, start, end);
                }
            } else {
                this.getCharacterFormatForTableRow(containerCell.ownerRow, start, end);
            }
        } else {
            let cell: TableCellWidget = this.getContainerCell(tableCell);
            this.getCharacterFormatForTableRow(cell.ownerRow, start, end);
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getCharacterFormatInternalInTable(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget, startPosition: TextPosition, endPosition: TextPosition): void {
        let startIn: number = this.getCellLeft(startCell.ownerRow, startCell);
        let endIn: number = startIn + startCell.cellFormat.cellWidth;
        let endCellLeft: number = this.getCellLeft(endCell.ownerRow, endCell);
        let endCellRight: number = endCellLeft + endCell.cellFormat.cellWidth;
        if (startIn > endCellLeft) {
            startIn = endCellLeft;
        }
        if (endIn < endCellRight) {
            endIn = endCellRight;
        }
        if (startIn > this.upDownSelectionLength) {
            startIn = this.upDownSelectionLength;
        }
        if (endIn < this.upDownSelectionLength) {
            endIn = this.upDownSelectionLength;
        }
        let count: number = table.childWidgets.indexOf(endCell.ownerRow);
        for (let i: number = table.childWidgets.indexOf(startCell.ownerRow); i <= count; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let left: number = this.getCellLeft(row, cell);
                if (HelperMethods.round(startIn, 2) <= HelperMethods.round(left, 2) &&
                    HelperMethods.round(left, 2) < HelperMethods.round(endIn, 2)) {
                    this.getCharacterFormatForSelectionCell(cell, startPosition, endPosition);
                }
            }
        }
    }
    /**
     * Get character format with in selection
     * @private
     */
    public getCharacterFormat(paragraph: ParagraphWidget, start: TextPosition, end: TextPosition): void {
        if (paragraph !== start.paragraph && paragraph !== end.paragraph) {
            this.getCharacterFormatInternal(paragraph, this);
            return;
        }
        if (end.paragraph === paragraph && start.paragraph !== paragraph && end.offset === 0) {
            return;
        }
        let startOffset: number = 0;
        let length: number = this.getParagraphLength(paragraph);
        if (paragraph === start.paragraph) {
            startOffset = start.offset;
            //Sets selection character format.            
            let isUpdated: boolean = this.setCharacterFormat(paragraph, start, end, length);
            if (isUpdated) {
                return;
            }
        }
        let startLineWidget: number = paragraph.childWidgets.indexOf(start.currentWidget) !== -1 ?
            paragraph.childWidgets.indexOf(start.currentWidget) : 0;
        let endLineWidget: number = paragraph.childWidgets.indexOf(end.currentWidget) !== -1 ?
            paragraph.childWidgets.indexOf(end.currentWidget) : paragraph.childWidgets.length - 1;
        let endOffset: number = end.offset;
        if (paragraph !== end.paragraph) {
            endOffset = length;
        }
        let isFieldStartSelected: boolean = false;
        for (let i: number = startLineWidget; i <= endLineWidget; i++) {
            let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
            if (i !== startLineWidget) {
                startOffset = this.getStartLineOffset(lineWidget);
            }
            if (lineWidget === end.currentWidget) {
                endOffset = end.offset;
            } else {
                endOffset = this.getLineLength(lineWidget);
            }
            let count: number = 0;
            for (let j: number = 0; j < lineWidget.children.length; j++) {
                let inline: ElementBox = lineWidget.children[j] as ElementBox;
                if (startOffset >= count + inline.length) {
                    count += inline.length;
                    continue;
                }
                if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 0
                    && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox))) {
                    let nextInline: ElementBox = isNullOrUndefined((inline as FieldElementBox).fieldSeparator) ?
                        (inline as FieldElementBox).fieldEnd : (inline as FieldElementBox).fieldSeparator;
                    do {
                        count += inline.length;
                        inline = inline.nextNode;
                        i++;
                    } while (!isNullOrUndefined(inline) && inline !== nextInline);
                    isFieldStartSelected = true;
                }
                if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 1
                    && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)) && isFieldStartSelected) {
                    let fieldInline: ElementBox = (inline as FieldElementBox).fieldBegin;
                    do {
                        this.characterFormat.combineFormat(fieldInline.characterFormat);
                        fieldInline = fieldInline.nextNode as ElementBox;
                    } while (!(fieldInline instanceof FieldElementBox));
                }
                if (inline instanceof TextElementBox) {
                    this.characterFormat.combineFormat(inline.characterFormat);
                }
                if (isNullOrUndefined(inline) || endOffset <= count + inline.length) {
                    break;
                }
                count += inline.length;
            }
        }
        if (end.paragraph === paragraph) {
            return;
        }
        let block: BlockWidget = this.getNextRenderedBlock(paragraph) as BlockWidget;
        if (!isNullOrUndefined(block)) {
            this.getCharacterFormatForBlock(block, start, end);
        }
    }
    private setCharacterFormat(para: ParagraphWidget, startPos: TextPosition, endPos: TextPosition, length: number): boolean {
        let index: number = 0;
        let startOffset: number = startPos.offset;
        let inlineAndIndex: ElementInfo = startPos.currentWidget.getInline(startOffset, index);
        index = inlineAndIndex.index;
        let inline: ElementBox = inlineAndIndex.element;
        if (isNullOrUndefined(inline)) {
            let currentLineIndex: number = startPos.paragraph.childWidgets.indexOf(startPos.currentWidget);
            if (startPos.currentWidget.previousLine) {
                inline = startPos.currentWidget.previousLine.children[startPos.currentWidget.previousLine.children.length - 1];
                this.characterFormat.copyFormat(inline.characterFormat);
                return true;
            }
        }
        if (startOffset < length) {
            if (this.isEmpty) {
                if (inline instanceof TextElementBox || (inline instanceof FieldElementBox
                    && ((inline as FieldElementBox).fieldType === 0 || (inline as FieldElementBox).fieldType === 1))) {
                    let previousNode: TextElementBox = this.getPreviousTextElement(inline) as TextElementBox;
                    if (startOffset === 0 && previousNode) {
                        inline = previousNode;
                    }
                    this.characterFormat.copyFormat(inline.characterFormat);
                } else {
                    if (!isNullOrUndefined(this.getPreviousTextElement(inline))) {
                        this.characterFormat.copyFormat(this.getPreviousTextElement(inline).characterFormat);
                    } else if (!isNullOrUndefined(this.getNextTextElement(inline))) {
                        this.characterFormat.copyFormat(this.getNextTextElement(inline).characterFormat);
                    } else {
                        this.characterFormat.copyFormat(para.characterFormat);
                    }
                }
                return true;
            } else {
                if (index === inline.length && !isNullOrUndefined(inline.nextNode)) {
                    this.characterFormat.copyFormat(this.getNextValidCharacterFormat(inline));
                } else if (inline instanceof TextElementBox) {
                    this.characterFormat.copyFormat(inline.characterFormat);
                } else if (inline instanceof FieldElementBox) {
                    this.characterFormat.copyFormat(this.getNextValidCharacterFormatOfField(inline as FieldElementBox));
                }
            }
        } else {
            if (length === endPos.offset) {
                if (inline instanceof TextElementBox || inline instanceof FieldElementBox) {
                    this.characterFormat.copyFormat(inline.characterFormat);
                } else if (!isNullOrUndefined(inline)) {
                    inline = this.getPreviousTextElement(inline);
                    if (!isNullOrUndefined(inline)) {
                        this.characterFormat.copyFormat(inline.characterFormat);
                    }
                } else {
                    this.characterFormat.copyFormat(para.characterFormat);
                }
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public getCharacterFormatForBlock(block: BlockWidget, start: TextPosition, end: TextPosition): void {
        if (block instanceof ParagraphWidget) {
            this.getCharacterFormat(block, start, end);
        } else {
            this.getCharacterFormatInTable(block as TableWidget, start, end);
        }
    }
    /**
     * @private
     */
    public getCharacterFormatInTable(table: TableWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                this.getCharacterFormatForSelectionCell((row.childWidgets[j] as TableCellWidget), start, end);
            }
            if (end.paragraph.isInsideTable && this.containsRow(row, end.paragraph.associatedCell)) {
                return;
            }
        }
        let blockAdv: BlockWidget = this.getNextRenderedBlock(table) as BlockWidget;
        // //Goto the next block.
        this.getCharacterFormatForBlock(blockAdv, start, end);
    }
    /**
     * Get character format in selection
     * @private
     */
    public getCharacterFormatForSelectionCell(cell: TableCellWidget, start: TextPosition, end: TextPosition): void {
        for (let i: number = 0; i < cell.childWidgets.length; i++) {
            this.getCharacterFormatForBlock((cell.childWidgets[i] as BlockWidget), start, end);
        }
    }
    /**
     * @private
     */
    public getCharacterFormatInternal(paragraph: ParagraphWidget, selection: Selection): void {
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            let linewidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
            for (let j: number = 0; j < linewidget.children.length; j++) {
                let element: ElementBox = linewidget.children[j];
                if (!(element instanceof ImageElementBox || element instanceof FieldElementBox)) {
                    selection.characterFormat.combineFormat(element.characterFormat);
                }
            }
        }
    }
    /**
     * Get next valid character format from inline
     * @private
     */
    public getNextValidCharacterFormat(inline: ElementBox): WCharacterFormat {
        let startInline: ElementBox = this.getNextTextElement(inline);
        if (isNullOrUndefined(startInline)) {
            return inline.characterFormat;
        }
        let fieldBegin: FieldElementBox = undefined;
        if (startInline instanceof FieldElementBox) {
            if (fieldBegin.fieldType === 0) {
                fieldBegin = startInline;
            }
        }
        if (isNullOrUndefined(fieldBegin)) {
            return startInline.characterFormat;
        } else {
            return this.getNextValidCharacterFormatOfField(fieldBegin as FieldElementBox);
        }
    }
    /**
     * Get next valid paragraph format from field
     * @private
     */
    public getNextValidCharacterFormatOfField(fieldBegin: FieldElementBox): WCharacterFormat {
        let startInline: ElementBox = fieldBegin;
        if (HelperMethods.isLinkedFieldCharacter(fieldBegin)) {
            if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                startInline = fieldBegin.fieldEnd;
            } else {
                startInline = fieldBegin.fieldSeparator;
            }
        }
        let nextValidInline: ElementBox = undefined;
        if (!isNullOrUndefined(startInline.nextNode)) {
            //Check the next node is a valid and returns inline.
            nextValidInline = this.getNextValidElement((startInline.nextNode as ElementBox)) as ElementBox;
        }
        //If field separator/end exists at end of paragraph, then move to next paragraph.
        if (isNullOrUndefined(nextValidInline)) {
            return startInline.characterFormat;
        }
        return nextValidInline.characterFormat;
    }
    /**
     * Return true if cursor point with in selection range
     * @private
     */
    public checkCursorIsInSelection(widget: IWidget, point: Point): boolean {
        if (isNullOrUndefined(this.start) || this.isEmpty || isNullOrUndefined(widget)) {
            return false;
        }
        let isSelected: boolean = false;
        do {
            if (this.selectedWidgets.containsKey(widget)) {
                let top: number;
                let left: number;
                if (widget instanceof LineWidget) {
                    top = this.owner.selection.getTop(widget);
                    left = this.owner.selection.getLeft(widget);
                } else {
                    top = (widget as Widget).y;
                    left = (widget as Widget).x;
                }
                let widgetInfo: SelectionWidgetInfo = this.selectedWidgets.get(widget as IWidget) as SelectionWidgetInfo;
                isSelected = widgetInfo.left <= point.x && top <= point.y &&
                    top + (widget as Widget).height >= point.y && widgetInfo.left + widgetInfo.width >= point.x;
            }
            widget = (widget instanceof LineWidget) ? widget.paragraph : (widget as Widget).containerWidget;
        } while (!isNullOrUndefined(widget) && !isSelected);
        return isSelected;
    }
    /**
     * Copy paragraph for to selection paragraph format
     * @private
     */
    public copySelectionParagraphFormat(): WParagraphFormat {
        let format: WParagraphFormat = new WParagraphFormat();
        this.paragraphFormat.copyToFormat(format);
        return format;
    }
    /**
     * Get hyperlink display text
     * @private
     */
    // tslint:disable-next-line
    public getHyperlinkDisplayText(paragraph: ParagraphWidget, fieldSeparator: FieldElementBox, fieldEnd: FieldElementBox, isNestedField: boolean, format: WCharacterFormat): HyperlinkTextInfo {
        let para: ParagraphWidget = paragraph;
        if (para !== fieldEnd.line.paragraph) {
            isNestedField = true;
            return { displayText: '<<Selection in Document>>', 'isNestedField': isNestedField, 'format': format };
        }
        let displayText: string = '';
        let lineIndex: number = para.childWidgets.indexOf(fieldSeparator.line);
        let index: number = (para.childWidgets[lineIndex] as LineWidget).children.indexOf(fieldSeparator);
        for (let j: number = lineIndex; j < para.childWidgets.length; j++) {
            let lineWidget: LineWidget = para.childWidgets[j] as LineWidget;
            if (j !== lineIndex) {
                index = -1;
            }
            for (let i: number = index + 1; i < lineWidget.children.length; i++) {
                let inline: ElementBox = lineWidget.children[i];
                if (inline === fieldEnd) {
                    return { 'displayText': displayText, 'isNestedField': isNestedField, 'format': format };
                }
                if (inline instanceof TextElementBox) {
                    displayText += (inline as TextElementBox).text;
                    format = inline.characterFormat;
                } else if (inline instanceof FieldElementBox) {
                    if (inline instanceof FieldElementBox && inline.fieldType === 0
                        && !isNullOrUndefined((inline as FieldElementBox).fieldEnd)) {
                        if (isNullOrUndefined((inline as FieldElementBox).fieldSeparator)) {
                            index = lineWidget.children.indexOf((inline as FieldElementBox).fieldEnd);
                        } else {
                            index = lineWidget.children.indexOf((inline as FieldElementBox).fieldSeparator);
                        }
                    }
                } else {
                    isNestedField = true;
                    return { 'displayText': '<<Selection in Document>>', 'isNestedField': isNestedField, 'format': format };
                }
            }
        }
        return { 'displayText': displayText, 'isNestedField': isNestedField, 'format': format };
    }

    /**
     * Navigates hyperlink on mouse Event.
     * @private
     */
    public navigateHyperLinkOnEvent(cursorPoint: Point, isTouchInput: boolean): void {
        let widget: LineWidget = this.documentHelper.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget)) {
            let hyperLinkField: FieldElementBox = this.getHyperLinkFieldInCurrentSelection(widget, cursorPoint);
            //Invokes Hyperlink navigation events.
            if (!isNullOrUndefined(hyperLinkField)) {
                this.documentHelper.updateTextPositionForSelection(cursorPoint, 1);
                this.fireRequestNavigate(hyperLinkField);
                setTimeout(() => {
                    if (this.viewer) {
                        this.documentHelper.isTouchInput = isTouchInput;
                        this.documentHelper.updateFocus();
                        this.documentHelper.isTouchInput = false;
                    }
                });

            }
        }
    }
    /**
     * @private
     */
    public getLinkText(fieldBegin: FieldElementBox): string {
        let hyperlink: Hyperlink = new Hyperlink(fieldBegin, this);
        let link: string = hyperlink.navigationLink;
        if (hyperlink.localReference.length > 0) {
            if (hyperlink.localReference[0] === '_' && (isNullOrUndefined(link) || link.length === 0)) {
                link = 'Current Document';
            } else {
                link += '#' + hyperlink.localReference;
            }
        }
        hyperlink.destroy();
        return link;
    }
    /**
     * Set Hyperlink content to tool tip element
     * @private
     */
    public setHyperlinkContentToToolTip(fieldBegin: FieldElementBox, widget: LineWidget, xPos: number): void {
        if (fieldBegin) {
            if (this.owner.contextMenuModule &&
                this.owner.contextMenuModule.contextMenuInstance.element.style.display === 'block') {
                return;
            }


            if (!this.toolTipElement) {
                this.toolTipElement = createElement('div', { className: 'e-de-tooltip' });
                this.documentHelper.viewerContainer.appendChild(this.toolTipElement);
            }
            this.toolTipElement.style.display = 'block';
            let l10n: L10n = new L10n('documenteditor', this.owner.defaultLocale);
            l10n.setLocale(this.owner.locale);
            let toolTipText: string = l10n.getConstant('Click to follow link');
            if (this.owner.useCtrlClickToFollowHyperlink) {
                toolTipText = 'Ctrl+' + toolTipText;
            }
            let linkText: string = this.getLinkText(fieldBegin);
            this.toolTipElement.innerHTML = linkText + '</br><b>' + toolTipText + '</b>';
            let widgetTop: number = this.getTop(widget) * this.documentHelper.zoomFactor;
            let page: Page = this.getPage(widget.paragraph);
            // tslint:disable-next-line:max-line-length
            let containerWidth: number = this.documentHelper.viewerContainer.getBoundingClientRect().width + this.documentHelper.viewerContainer.scrollLeft;
            let left: number = page.boundingRectangle.x + xPos * this.documentHelper.zoomFactor;
            if ((left + this.toolTipElement.clientWidth + 10) > containerWidth) {
                left = left - ((this.toolTipElement.clientWidth - (containerWidth - left)) + 15);
            }
            let top: number = this.getPageTop(page) + (widgetTop - this.toolTipElement.offsetHeight);
            top = top > this.documentHelper.viewerContainer.scrollTop ? top : top + widget.height + this.toolTipElement.offsetHeight;
            this.showToolTip(left, top);
            if (!isNullOrUndefined(this.toolTipField) && fieldBegin !== this.toolTipField) {
                this.toolTipObject.position = { X: left, Y: top };
            }
            this.toolTipObject.show();
            this.toolTipField = fieldBegin;
        } else {
            this.hideToolTip();
        }
    }
    /**
     * @private
     */
    public createPasteElement(top: string, left: string): void {
        let locale: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        locale.setLocale(this.owner.locale);
        let items: ItemModel[] = [
            {
                text: locale.getConstant('Keep source formatting'),
                iconCss: 'e-icons e-de-paste-source'
            },
            {
                text: locale.getConstant('Match destination formatting'),
                iconCss: 'e-icons e-de-paste-merge'
            },
            {
                text: locale.getConstant('Text only'),
                iconCss: 'e-icons e-de-paste-text'
            }
        ];
        if (!this.pasteElement) {
            this.pasteElement = createElement('div', { className: 'e-de-tooltip' });
            this.documentHelper.viewerContainer.appendChild(this.pasteElement);
            let splitButtonEle: HTMLElement = createElement('button', { id: 'iconsplitbtn' });
            this.pasteElement.appendChild(splitButtonEle);
            this.pasteDropDwn = new DropDownButton({
                items: items, iconCss: 'e-icons e-de-paste', select: this.pasteOptions
            });
            this.pasteDropDwn.appendTo('#iconsplitbtn');
        }
        this.pasteElement.style.display = 'block';
        this.pasteElement.style.position = 'absolute';
        this.pasteElement.style.left = left;
        this.pasteElement.style.top = top;
    }
    /**
     * @private
     */
    public pasteOptions = (event: MenuEventArgs) => {
        if (event.item.text === 'Keep source formatting') {
            this.owner.editor.applyPasteOptions('KeepSourceFormatting');
        } else if (event.item.text === 'Match destination formatting') {
            this.owner.editor.applyPasteOptions('MergeWithExistingFormatting');
        } else {
            this.owner.editor.applyPasteOptions('KeepTextOnly');
        }
    }
    /**
     * Show hyperlink tooltip
     * @private
     */
    public showToolTip(x: number, y: number): void {
        if (!this.toolTipObject) {
            this.toolTipObject = new Popup(this.toolTipElement, {
                height: 'auto',
                width: 'auto',
                relateTo: this.documentHelper.viewerContainer.parentElement,
                position: { X: x, Y: y }
            });
        }
    }
    /**
     * Hide tooltip object
     * @private
     */
    public hideToolTip(): void {
        this.toolTipField = undefined;
        if (this.toolTipObject) {
            this.toolTipElement.style.display = 'none';
            this.toolTipObject.hide();
            this.toolTipObject.destroy();
            this.toolTipObject = undefined;
        }
    }
    /**
     * Return hyperlink field
     * @private
     */
    public getHyperLinkFieldInCurrentSelection(widget: LineWidget, cursorPosition: Point): FieldElementBox {
        let inline: ElementBox = undefined;
        let top: number = this.getTop(widget);
        let lineStartLeft: number = this.getLineStartLeft(widget);
        if (cursorPosition.y < top || cursorPosition.y > top + widget.height
            || cursorPosition.x < lineStartLeft || cursorPosition.x > lineStartLeft + widget.paragraph.width) {
            return undefined;
        }
        let left: number = widget.paragraph.x;
        let elementValues: FirstElementInfo = this.getFirstElement(widget, left);
        left = elementValues.left;
        let element: ElementBox = elementValues.element;
        if (isNullOrUndefined(element)) {
            let width: number = this.documentHelper.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
            if (cursorPosition.x <= lineStartLeft + width || cursorPosition.x >= lineStartLeft + width) {
                //Check if paragraph is within a field result.
                let checkedFields: FieldElementBox[] = [];
                let field: FieldElementBox = this.getHyperLinkFields(widget.paragraph, checkedFields);
                checkedFields = [];
                checkedFields = undefined;
                return field;
            }
        } else {
            if (cursorPosition.x > left + element.margin.left) {
                for (let i: number = widget.children.indexOf(element); i < widget.children.length; i++) {
                    element = widget.children[i];
                    if (cursorPosition.x < left + element.margin.left + element.width || i === widget.children.length - 1) {
                        break;
                    }
                    left += element.margin.left + element.width;
                }
            }
            inline = element;
            let width: number = element.margin.left + element.width;
            if (isNullOrUndefined(inline.nextNode)) {
                //Include width of Paragraph mark.
                width += this.documentHelper.textHelper.getParagraphMarkWidth(inline.line.paragraph.characterFormat);
            }
            if (cursorPosition.x <= left + width) {
                //Check if inline is within a field result.
                let checkedFields: FieldElementBox[] = [];
                let field: FieldElementBox = this.getHyperLinkFieldInternal(inline.line.paragraph, inline, checkedFields);
                checkedFields = [];
                checkedFields = undefined;
                return field;
            }
        }
        return undefined;
    }
    /**
     * Return field if paragraph contain hyperlink field
     * @private
     */
    public getHyperlinkField(isRetrieve?: boolean): FieldElementBox {
        if (isNullOrUndefined(this.end)) {
            return undefined;
        }
        let index: number = 0;
        let currentInline: ElementInfo = this.end.currentWidget.getInline(this.end.offset, index) as ElementInfo;
        index = currentInline.index;
        let inline: ElementBox = currentInline.element;
        let checkedFields: FieldElementBox[] = [];
        let field: FieldElementBox = undefined;
        if (isNullOrUndefined(inline)) {
            field = this.getHyperLinkFields(this.end.paragraph as ParagraphWidget, checkedFields, isRetrieve);
        } else {
            let paragraph: ParagraphWidget = inline.line.paragraph;
            field = this.getHyperLinkFieldInternal(paragraph, inline, checkedFields, isRetrieve);
        }
        checkedFields = [];
        return field;
    }
    /**
     * @private
     */
    public getHyperLinkFields(paragraph: ParagraphWidget, checkedFields: FieldElementBox[], isRetrieve?: boolean): FieldElementBox {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            // tslint:disable-next-line:max-line-length
            if (checkedFields.indexOf(this.documentHelper.fields[i]) !== -1 || isNullOrUndefined(this.documentHelper.fields[i].fieldSeparator)) {
                continue;
            } else {
                checkedFields.push(this.documentHelper.fields[i]);
            }
            let field: string = this.getFieldCode(this.documentHelper.fields[i]);
            field = field.trim().toLowerCase();
            let isParagraph: boolean = this.paragraphIsInFieldResult(this.documentHelper.fields[i], paragraph as ParagraphWidget);
            if ((isRetrieve || (!isRetrieve && field.match('hyperlink '))) && isParagraph) {
                return this.documentHelper.fields[i];
            }
        }
        // if (paragraph.containerWidget instanceof BodyWidget && !(paragraph instanceof WHeaderFooter)) {
        //     return this.getHyperLinkFields((paragraph.con as WCompositeNode), checkedFields);
        // }

        return undefined;
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public getHyperLinkFieldInternal(paragraph: Widget, inline: ElementBox, fields: FieldElementBox[], isRetrieve?: boolean): FieldElementBox {
        for (let i: number = 0; i < this.documentHelper.fields.length; i++) {
            if (fields.indexOf(this.documentHelper.fields[i]) !== -1 || isNullOrUndefined(this.documentHelper.fields[i].fieldSeparator)) {
                continue;
            } else {
                fields.push(this.documentHelper.fields[i]);
            }
            let fieldCode: string = this.getFieldCode(this.documentHelper.fields[i]);
            fieldCode = fieldCode.trim().toLowerCase();
            let isInline: boolean = (this.inlineIsInFieldResult(this.documentHelper.fields[i], inline) || this.isImageField());
            if ((isRetrieve || (!isRetrieve && fieldCode.match('hyperlink '))) && isInline) {
                return this.documentHelper.fields[i];
            }
        }
        if (paragraph.containerWidget instanceof BodyWidget && !(paragraph instanceof HeaderFooterWidget)) {
            return this.getHyperLinkFieldInternal(paragraph.containerWidget, inline, fields, isRetrieve);
        }
        return undefined;
    }
    /**
     * @private
     */
    public getBlock(currentIndex: string): BlockWidget {
        if (currentIndex === '' || isNullOrUndefined(currentIndex)) {
            return undefined;
        }
        let index: IndexInfo = { index: currentIndex };
        let page: Page = this.start.getPage(index);
        let bodyIndex: number = index.index.indexOf(';');
        let value: string = index.index.substring(0, bodyIndex);
        index.index = index.index.substring(bodyIndex).replace(';', '');
        let bodyWidget: BodyWidget = page.bodyWidgets[parseInt(value, 10)];
        return this.getBlockInternal(bodyWidget, index.index);
    }
    /**
     * Return Block relative to position
     * @private
     */
    public getBlockInternal(widget: Widget, position: string): BlockWidget {
        if (position === '' || isNullOrUndefined(position)) {
            return undefined;
        }
        let index: number = position.indexOf(';');
        let value: string = position.substring(0, index);
        position = position.substring(index).replace(';', '');
        let node: Widget = widget;
        // if (node instanceof Widget && value === 'HF') {
        //     //Gets the block in Header footers.
        //     let blockObj: BlockInfo = this.getBlock((node as WSection).headersFooters, position);
        // tslint:disable-next-line:max-line-length
        //     return { 'node': (!isNullOrUndefined(blockObj)) ? blockObj.node : undefined, 'position': (!isNullOrUndefined(blockObj)) ? blockObj.position : undefined };
        // }
        index = parseInt(value, 10);
        if (index >= 0 && index < widget.childWidgets.length) {
            let child: Widget = widget.childWidgets[(index)] as Widget;
            if (position.indexOf(';') >= 0) {
                if (child instanceof ParagraphWidget) {
                    if (position.indexOf(';') >= 0) {
                        position = '0';
                    }
                    return child;
                }
                if (child instanceof BlockWidget) {
                    let blockObj: BlockWidget = this.getBlockInternal(child, position);
                    return blockObj;
                }
            } else {
                return child as BlockWidget;
            }
        } else {
            return node as BlockWidget;
        }
        return node as BlockWidget;
    }
    /**
     * Return true if inline is in field result
     * @private
     */
    public inlineIsInFieldResult(fieldBegin: FieldElementBox, inline: ElementBox): boolean {
        if (!isNullOrUndefined(fieldBegin.fieldEnd) && !isNullOrUndefined(fieldBegin.fieldSeparator)) {
            if (this.isExistBeforeInline(fieldBegin.fieldSeparator, inline)) {
                return this.isExistAfterInline(fieldBegin.fieldEnd, inline);
            }
        }
        return false;
    }
    /**
     * Retrieve true if paragraph is in field result
     * @private
     */
    public paragraphIsInFieldResult(fieldBegin: FieldElementBox, paragraph: ParagraphWidget): boolean {
        if (!isNullOrUndefined(fieldBegin.fieldEnd) && !isNullOrUndefined(fieldBegin.fieldSeparator)) {
            let fieldParagraph: ParagraphWidget = fieldBegin.fieldSeparator.line.paragraph;
            if (fieldBegin.fieldSeparator.line.paragraph === paragraph
                || this.isExistBefore(fieldParagraph, paragraph)) {
                let currentParagraph: ParagraphWidget = fieldBegin.fieldEnd.line.paragraph;
                return (currentParagraph !== paragraph && this.isExistAfter(fieldParagraph, paragraph));
            }
        }
        return false;
    }
    /**
     * Return true if image is In field
     * @private
     */
    public isImageField(): boolean {
        if (this.start.paragraph.isEmpty() || this.end.paragraph.isEmpty()) {
            return false;
        }
        let startPosition: TextPosition = this.start;
        let endPosition: TextPosition = this.end;
        if (!this.isForward) {
            startPosition = this.end;
            endPosition = this.start;
        }
        let indexInInline: number = 0;
        let inlineInfo: ElementInfo = startPosition.paragraph.getInline(startPosition.offset, indexInInline) as ElementInfo;
        let inline: ElementBox = inlineInfo.element;
        indexInInline = inlineInfo.index;
        if (indexInInline === inline.length) {
            inline = this.getNextRenderedElementBox(inline, indexInInline) as ElementBox;
        }
        inlineInfo = endPosition.paragraph.getInline(endPosition.offset, indexInInline) as ElementInfo;
        let endInline: ElementBox = inlineInfo.element;
        indexInInline = inlineInfo.index;
        if (inline instanceof FieldElementBox && inline.fieldType === 0
            && endInline instanceof FieldElementBox && endInline.fieldType === 1 && (inline as FieldElementBox).fieldSeparator) {
            let fieldValue: ElementBox = (inline as FieldElementBox).fieldSeparator.nextNode as ElementBox;
            if (fieldValue instanceof ImageElementBox && fieldValue.nextNode === endInline) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public isTableSelected(): boolean {
        let start: TextPosition = this.start;
        let end: TextPosition = this.end;
        if (!this.isForward) {
            start = this.end;
            end = this.start;
        }
        if (isNullOrUndefined(start.paragraph.associatedCell) ||
            isNullOrUndefined(end.paragraph.associatedCell)) {
            return false;
        }
        let table: TableWidget[] = start.paragraph.associatedCell.ownerTable.getSplitWidgets() as TableWidget[];
        let firstParagraph: ParagraphWidget = this.getFirstBlockInFirstCell(table[0]) as ParagraphWidget;
        let lastParagraph: ParagraphWidget = this.getLastBlockInLastCell(table[table.length - 1]) as ParagraphWidget;
        return start.paragraph.associatedCell.equals(firstParagraph.associatedCell) &&
            end.paragraph.associatedCell.equals(lastParagraph.associatedCell)
            && (!firstParagraph.associatedCell.equals(lastParagraph.associatedCell) || (start.offset === 0
                && end.offset === this.getLineLength(lastParagraph.lastChild as LineWidget) + 1));

    }
    /**
     * Select List Text
     * @private
     */
    public selectListText(): void {
        let lineWidget: LineWidget = this.documentHelper.selectionLineWidget as LineWidget;
        let endOffset: string = '0';
        let selectionIndex: string = lineWidget.getHierarchicalIndex(endOffset);
        let startPosition: TextPosition = this.getTextPosition(selectionIndex);
        let endPosition: TextPosition = this.getTextPosition(selectionIndex);
        this.selectRange(startPosition, endPosition);
        this.highlightListText(this.documentHelper.selectionLineWidget);
        this.contextTypeInternal = 'List';
    }
    /**
     * Manually select the list text
     * @private
     */
    public highlightListText(linewidget: LineWidget): void {
        let width: number = linewidget.children[0].width;
        let left: number = this.documentHelper.getLeftValue(linewidget);
        let top: number = linewidget.paragraph.y;
        this.createHighlightBorder(linewidget, width, left, top, false);
        this.documentHelper.isListTextSelected = true;
    }
    /**
     * @private
     */
    public updateImageSize(imageFormat: ImageFormat): void {
        this.owner.isShiftingEnabled = true;
        let startPosition: TextPosition = this.start;
        let endPosition: TextPosition = this.end;
        if (!this.isForward) {
            startPosition = this.end;
            endPosition = this.start;
        }
        let inline: ElementBox = null;
        let index: number = 0;
        let paragraph: ParagraphWidget = startPosition.paragraph;
        if (paragraph === endPosition.paragraph
            && startPosition.offset + 1 === endPosition.offset) {
            let inlineObj: ElementInfo = paragraph.getInline(endPosition.offset, index);
            inline = inlineObj.element;
            index = inlineObj.index;
        }
        if (inline instanceof ImageElementBox) {
            let width: number = (inline as ImageElementBox).width;
            let height: number = (inline as ImageElementBox).height;
            (inline as ImageElementBox).width = imageFormat.width;
            (inline as ImageElementBox).height = imageFormat.height;
            imageFormat.width = width;
            imageFormat.height = height;
            if (paragraph !== null && paragraph.containerWidget !== null && this.owner.editorModule) {
                let lineIndex: number = paragraph.childWidgets.indexOf(inline.line);
                let elementIndex: number = inline.line.children.indexOf(inline);
                this.documentHelper.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
                this.highlightSelection(false);
            }
        }
    }
    /**
     * Gets selected table content 
     * @private
     */
    private getSelectedCellsInTable(table: TableWidget, startCell: TableCellWidget, endCell: TableCellWidget): TableCellWidget[] {
        let startColumnIndex: number = startCell.columnIndex;
        let endColumnIndex: number = endCell.columnIndex + endCell.cellFormat.columnSpan - 1;
        let startRowindex: number = startCell.ownerRow.index;
        let endRowIndex: number = endCell.ownerRow.index;
        let cells: TableCellWidget[] = [];
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.index >= startRowindex && row.index <= endRowIndex) {
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    if (cell.columnIndex >= startColumnIndex && cell.columnIndex <= endColumnIndex) {
                        cells.push(cell);
                    }
                }
            }
            if (row.index > endRowIndex) {
                break;
            }
        }
        return cells;
        // return html;
    }
    /**
     * Copies the selected content to clipboard.
     */
    public copy(): void {
        if (this.isEmpty) {
            return;
        }
        this.copySelectedContent(false);
    }
    /**
     * @private
     */
    public copySelectedContent(isCut: boolean): void {
        if (isNullOrUndefined(this.owner.sfdtExportModule)) {
            return;
        }
        let startPosition: TextPosition = this.start;
        let endPosition: TextPosition = this.end;
        if (!this.isForward) {
            startPosition = this.end;
            endPosition = this.start;
        }
        /* tslint:disable:no-any */
        // tslint:disable-next-line:max-line-length
        let documentContent: any = this.owner.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);

        /* tslint:enable:no-any */
        if (this.owner.editorModule) {
            this.owner.editorModule.copiedData = JSON.stringify(documentContent);
        }
        let html: string = this.htmlWriter.writeHtml(documentContent);
        this.copyToClipboard(html);
        if (isCut && this.owner.editorModule) {
            this.owner.editorModule.handleCut(this);
        }
        this.documentHelper.updateFocus();
    }
    /**
     * Copy content to clipboard
     * @private
     */
    public copyToClipboard(htmlContent: string): boolean {
        window.getSelection().removeAllRanges();
        let div: HTMLDivElement = document.createElement('div');
        div.style.left = '-10000px';
        div.style.top = '-10000px';
        div.style.position = 'relative';
        div.innerHTML = htmlContent;
        document.body.appendChild(div);
        if (navigator.userAgent.indexOf('Firefox') !== -1) {
            div.tabIndex = 0;
            div.focus();
        }
        let range: Range = document.createRange();
        range.selectNodeContents(div);
        window.getSelection().addRange(range);
        let copySuccess: boolean = false;
        try {
            copySuccess = document.execCommand('copy');
        } catch (e) {
            // Copying data to Clipboard can potentially fail - for example, if another application is holding Clipboard open.
        } finally {
            window.getSelection().removeAllRanges();
            div.parentNode.removeChild(div);
            this.documentHelper.viewerContainer.focus();
        }
        return copySuccess;
    }
    // Caret implementation starts
    /**
     * Shows caret in current selection position.
     * @private
     */
    public showCaret(): void {
        // tslint:disable-next-line:max-line-length
        let page: Page = !isNullOrUndefined(this.documentHelper.currentPage) ? this.documentHelper.currentPage : this.documentHelper.currentRenderingPage;
        if (isNullOrUndefined(page) || this.documentHelper.isRowOrCellResizing || this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizerVisible) {
            return;
        }
        let left: number = page.boundingRectangle.x;
        let right: number;
        if (this.viewer instanceof PageLayoutViewer) {
            right = page.boundingRectangle.width * this.documentHelper.zoomFactor + left;
        } else {
            right = page.boundingRectangle.width - this.owner.viewer.padding.right - this.documentHelper.scrollbarWidth;
        }
        if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible) {
            if (this.isHideSelection(this.start.paragraph)) {
                this.caret.style.display = 'none';
            } else if (this.isEmpty && (!this.owner.isReadOnlyMode || this.owner.enableCursorOnReadOnly)) {
                let caretLeft: number = parseInt(this.caret.style.left.replace('px', ''), 10);
                if (caretLeft < left || caretLeft > right) {
                    this.caret.style.display = 'none';
                } else {
                    this.caret.style.display = 'block';
                }
            } else if (this.isImageSelected && !this.owner.enableImageResizerMode) {
                this.caret.style.display = 'block';
            } else {
                if (this.caret.style.display === 'block' || isNullOrUndefined(this)) {
                    if (!this.documentHelper.isComposingIME) {
                        this.caret.style.display = 'none';
                    }
                }
            }
        }
        if (!isNullOrUndefined(this) && this.documentHelper.isTouchInput && !this.owner.isReadOnlyMode) {
            let caretStartLeft: number = parseInt(this.documentHelper.touchStart.style.left.replace('px', ''), 10) + 14;
            let caretEndLeft: number = parseInt(this.documentHelper.touchEnd.style.left.replace('px', ''), 10) + 14;
            let page: Page = this.getSelectionPage(this.start);
            if (page) {
                if (caretEndLeft < left || caretEndLeft > right) {
                    this.documentHelper.touchEnd.style.display = 'none';
                } else {
                    this.documentHelper.touchEnd.style.display = 'block';
                }
                if (!this.isEmpty) {
                    left = page.boundingRectangle.x;
                    right = page.boundingRectangle.width * this.documentHelper.zoomFactor + left;
                }
                if (caretStartLeft < left || caretStartLeft > right) {
                    this.documentHelper.touchStart.style.display = 'none';
                } else {
                    this.documentHelper.touchStart.style.display = 'block';
                }
            }
        } else {
            this.documentHelper.touchStart.style.display = 'none';
            this.documentHelper.touchEnd.style.display = 'none';
        }
    }
    /**
     * To set the editable div caret position
     * @private
     */
    public setEditableDivCaretPosition(index: number): void {
        this.documentHelper.editableDiv.focus();
        let child: Node = this.documentHelper.editableDiv.childNodes[this.documentHelper.editableDiv.childNodes.length - 1];
        if (child) {
            let range: Range = document.createRange();
            range.setStart(child, index);
            range.collapse(true);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }
    /**
     * Hides caret.
     * @private
     */
    public hideCaret = (): void => {
        if (!isNullOrUndefined(this.caret)) {
            this.caret.style.display = 'none';
        }
    }
    /** 
     * Initializes caret.
     * @private
     */
    public initCaret(): void {
        this.caret = createElement('div', {
            styles: 'position:absolute',
            className: 'e-de-blink-cursor e-de-cursor-animation'
        }) as HTMLDivElement;
        this.owner.documentHelper.viewerContainer.appendChild(this.caret);
    }
    /**
     * Updates caret position.
     * @private
     */
    public updateCaretPosition(): void {
        let caretPosition: Point = this.end.location;
        let page: Page = this.getSelectionPage(this.end);
        if (page && !isNullOrUndefined(this.caret)) {
            this.caret.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.documentHelper.zoomFactor) + 'px';
            let caretInfo: CaretHeightInfo = this.updateCaretSize(this.owner.selection.end);
            let topMargin: number = caretInfo.topMargin;
            let caretHeight: number = caretInfo.height;
            let viewer: LayoutViewer = this.viewer;
            // tslint:disable-next-line:max-line-length
            let pageTop: number = (page.boundingRectangle.y - (viewer as PageLayoutViewer).pageGap * (this.documentHelper.pages.indexOf(page) + 1)) * this.documentHelper.zoomFactor + (viewer as PageLayoutViewer).pageGap * (this.documentHelper.pages.indexOf(page) + 1);
            this.caret.style.top = pageTop + (Math.round(caretPosition.y + topMargin) * this.documentHelper.zoomFactor) + 'px';
            if (this.owner.selection.characterFormat.baselineAlignment === 'Subscript') {
                this.caret.style.top = parseFloat(this.caret.style.top) + (parseFloat(this.caret.style.height) / 2) + 'px';
            }
            if (this.documentHelper.isTouchInput || this.documentHelper.touchStart.style.display !== 'none') {
                // tslint:disable-next-line:max-line-length
                this.documentHelper.touchStart.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.documentHelper.zoomFactor - 14) + 'px';
                this.documentHelper.touchStart.style.top = pageTop + ((caretPosition.y + caretInfo.height) * this.documentHelper.zoomFactor) + 'px';
                // tslint:disable-next-line:max-line-length
                this.documentHelper.touchEnd.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.documentHelper.zoomFactor - 14) + 'px';
                this.documentHelper.touchEnd.style.top = pageTop + ((caretPosition.y + caretInfo.height) * this.documentHelper.zoomFactor) + 'px';
            }
        }
        this.showHidePasteOptions(this.caret.style.top, this.caret.style.left);
    }
    /**
     * @private
     */
    public showHidePasteOptions(top: string, left: string): void {
        if (this.isViewPasteOptions) {
            if (this.pasteElement && this.pasteElement.style.display === 'block') {
                return;
            }
            this.createPasteElement(top, left);
        } else if (this.pasteElement) {
            this.pasteElement.style.display = 'none';
        }
    }
    /**
     * @private
     */
    public getRect(position: TextPosition): Point {
        let caretPosition: Point = position.location;
        let page: Page = this.getSelectionPage(position);
        if (page) {

            let documentHelper: DocumentHelper = this.owner.documentHelper;
            let left: number = page.boundingRectangle.x + (Math.round(caretPosition.x) * documentHelper.zoomFactor);
            let pageGap: number = this.viewer.pageGap;
            // tslint:disable-next-line:max-line-length
            let pageTop: number = (page.boundingRectangle.y - pageGap * (page.index + 1)) * documentHelper.zoomFactor + pageGap * (page.index + 1);

            let top: number = pageTop + (Math.round(caretPosition.y) * documentHelper.zoomFactor);

            return new Point(left, top);
        }
        return new Point(0, 0);
    }
    /**
     * Gets current selected page
     * @private
     */
    public getSelectionPage(position: TextPosition): Page {
        let lineWidget: LineWidget = this.getLineWidgetInternal(position.currentWidget, position.offset, true);
        if (lineWidget) {
            return this.getPage(lineWidget.paragraph);
        }
        return undefined;
    }
    /**
     * Updates caret size.
     * @private
     */
    public updateCaretSize(textPosition: TextPosition, skipUpdate?: boolean): CaretHeightInfo {
        let topMargin: number = 0;
        let isItalic: boolean = false;
        let caret: CaretHeightInfo;
        let index: number = 0;
        let caretHeight: number = 0;
        if (this.characterFormat.italic) {
            isItalic = this.characterFormat.italic;
        }
        if (textPosition.paragraph.isEmpty()) {
            let paragraph: ParagraphWidget = textPosition.paragraph;
            let bottomMargin: number = 0;
            let paragraphInfo: SizeInfo = this.getParagraphMarkSize(paragraph, topMargin, bottomMargin);
            topMargin = paragraphInfo.topMargin;
            bottomMargin = paragraphInfo.bottomMargin;
            let height: number = paragraphInfo.height;
            caretHeight = topMargin < 0 ? topMargin + height : height;
            if (!skipUpdate) {
                this.caret.style.height = caretHeight * this.documentHelper.zoomFactor + 'px';
            }
            topMargin = 0;
        } else {
            let inlineInfo: ElementInfo = textPosition.currentWidget.getInline(textPosition.offset, index);
            index = inlineInfo.index;
            let inline: ElementBox = inlineInfo.element;
            if (!isNullOrUndefined(inline)) {
                caret = this.getCaretHeight(inline, index, inline.characterFormat, true, topMargin, isItalic);
                caretHeight = caret.height;
                if (!skipUpdate) {
                    this.caret.style.height = caret.height * this.documentHelper.zoomFactor + 'px';
                }
            }
        }
        if (!skipUpdate) {
            if (isItalic) {
                this.caret.style.transform = 'rotate(13deg)';
            } else {
                this.caret.style.transform = '';
            }
        }
        return {
            'topMargin': topMargin,
            'height': caretHeight
        };
    }
    /**
     * Updates caret to page.
     * @private
     */
    public updateCaretToPage(startPosition: TextPosition, endPage: Page): void {
        if (!isNullOrUndefined(endPage)) {
            this.documentHelper.selectionEndPage = endPage;
            if (this.owner.selection.isEmpty) {
                this.documentHelper.selectionStartPage = endPage;
            } else {
                // tslint:disable-next-line:max-line-length
                let startLineWidget: LineWidget = this.getLineWidgetParagraph(startPosition.offset, startPosition.paragraph.childWidgets[0] as LineWidget);
                //Gets start page.
                let startPage: Page = this.getPage(startLineWidget.paragraph);
                if (!isNullOrUndefined(startPage)) {
                    this.documentHelper.selectionStartPage = startPage;
                }
            }
        }
        this.checkForCursorVisibility();
    }
    /**
     * Gets caret bottom position.
     * @private
     */
    public getCaretBottom(textPosition: TextPosition, isEmptySelection: boolean): number {
        let bottom: number = textPosition.location.y;
        if (textPosition.paragraph.isEmpty()) {
            let paragraph: ParagraphWidget = textPosition.paragraph;
            let topMargin: number = 0;
            let bottomMargin: number = 0;
            let sizeInfo: SizeInfo = this.getParagraphMarkSize(paragraph, topMargin, bottomMargin);
            topMargin = sizeInfo.topMargin;
            bottomMargin = sizeInfo.bottomMargin;
            bottom += sizeInfo.height;
            bottom += topMargin;
            if (!isEmptySelection) {
                bottom += bottomMargin;
            }
        } else {
            let index: number = 0;
            let inlineInfo: ElementInfo = textPosition.paragraph.getInline(textPosition.offset, index);
            let inline: ElementBox = inlineInfo.element;
            index = inlineInfo.index;
            let topMargin: number = 0;
            let isItalic: boolean = false;
            // tslint:disable-next-line:max-line-length
            let caretHeightInfo: CaretHeightInfo = this.getCaretHeight(inline, index, inline.characterFormat, false, topMargin, isItalic);
            topMargin = caretHeightInfo.topMargin;
            isItalic = caretHeightInfo.isItalic;
            bottom += caretHeightInfo.height;
            if (isEmptySelection) {
                bottom -= HelperMethods.convertPointToPixel(this.documentHelper.layout.getAfterSpacing(textPosition.paragraph));
            }
        }
        return bottom;
    }
    /**
     * Checks for cursor visibility.
     * @param isTouch
     * @private
     */
    public checkForCursorVisibility(): void {
        this.showCaret();
    }
    // caret implementation ends
    /**
     * Keyboard shortcuts 
     * @private
     */
    // tslint:disable:max-func-body-length
    public onKeyDownInternal(event: KeyboardEvent, ctrl: boolean, shift: boolean, alt: boolean): void {
        let key: number = event.which || event.keyCode;
        if (ctrl && !shift && !alt) {
            this.documentHelper.isControlPressed = true;
            switch (key) {
                // case 9:
                //     event.preventDefault();
                //     if (this.owner.acceptTab) {
                //         this.selection.handleTabKey(false, false);
                //     }
                //     break;
                case 35:
                    this.handleControlEndKey();
                    break;
                case 36:
                    this.handleControlHomeKey();
                    break;
                case 37:
                    this.handleControlLeftKey();
                    break;
                case 38:
                    this.handleControlUpKey();
                    break;
                case 39:
                    this.handleControlRightKey();
                    break;
                case 40:
                    this.handleControlDownKey();
                    break;
                case 65:
                    this.owner.selection.selectAll();
                    break;
                case 67:
                    event.preventDefault();
                    this.copy();
                    break;
                case 70:
                    event.preventDefault();
                    if (!isNullOrUndefined(this.owner.optionsPaneModule)) {
                        this.owner.optionsPaneModule.showHideOptionsPane(true);
                    }
                    break;
            }
        } else if (shift && !ctrl && !alt) {
            switch (key) {
                case 35:
                    this.handleShiftEndKey();
                    event.preventDefault();
                    break;
                case 36:
                    this.handleShiftHomeKey();
                    event.preventDefault();
                    break;
                case 37:
                    this.handleShiftLeftKey();
                    event.preventDefault();
                    break;
                case 38:
                    this.handleShiftUpKey();
                    event.preventDefault();
                    break;
                case 39:
                    this.handleShiftRightKey();
                    event.preventDefault();
                    break;
                case 40:
                    this.handleShiftDownKey();
                    event.preventDefault();
                    break;
            }
        } else if (shift && ctrl && !alt) {
            switch (key) {
                case 35:
                    this.handleControlShiftEndKey();
                    break;
                case 36:
                    this.handleControlShiftHomeKey();
                    break;
                case 37:
                    this.handleControlShiftLeftKey();
                    break;
                case 38:
                    this.handleControlShiftUpKey();
                    break;
                case 39:
                    this.handleControlShiftRightKey();
                    break;
                case 40:
                    this.handleControlShiftDownKey();
                    break;
            }
        } else {
            switch (key) {
                // case 9:
                //     event.preventDefault();
                //     if (this.owner.acceptTab) {
                //         this.handleTabKey(true, false);
                //     }
                //     break;             
                case 33:
                    event.preventDefault();
                    this.documentHelper.viewerContainer.scrollTop -= this.documentHelper.visibleBounds.height;
                    break;
                case 34:
                    event.preventDefault();
                    this.documentHelper.viewerContainer.scrollTop += this.documentHelper.visibleBounds.height;
                    break;
                case 35:
                    this.handleEndKey();
                    event.preventDefault();
                    break;
                case 36:
                    this.handleHomeKey();
                    event.preventDefault();
                    break;
                case 37:
                    this.handleLeftKey();
                    event.preventDefault();
                    break;
                case 38:
                    this.handleUpKey();
                    event.preventDefault();
                    break;
                case 39:
                    this.handleRightKey();
                    event.preventDefault();
                    break;
                case 40:
                    this.handleDownKey();
                    event.preventDefault();
                    break;

            }
        }

        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.onKeyDownInternal(event, ctrl, shift, alt);
        }
        if (this.owner.searchModule) {
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(this.owner.searchModule.searchHighlighters) && this.owner.searchModule.searchHighlighters.length > 0) {
                this.owner.searchModule.searchResults.clear();
            }
        }
        if (event.keyCode === 27 || event.which === 27) {
            if (!isNullOrUndefined(this.owner.optionsPaneModule)) {
                this.owner.optionsPaneModule.showHideOptionsPane(false);
            }
            if (this.owner.enableHeaderAndFooter) {
                this.disableHeaderFooter();
            }
        }
    }



    //#region Enable or disable Header Footer
    /**
     * @private
     */
    public checkAndEnableHeaderFooter(point: Point, pagePoint: Point): boolean {
        let page: Page = this.documentHelper.currentPage;
        if (this.isCursorInsidePageRect(point, page)) {
            if (this.isCursorInHeaderRegion(point, page)) {
                if (this.owner.enableHeaderAndFooter) {
                    return false;
                }
                return this.enableHeadersFootersRegion(page.headerWidget);
            }
            if (this.isCursorInFooterRegion(point, page)) {
                if (this.owner.enableHeaderAndFooter) {
                    return false;
                }
                return this.enableHeadersFootersRegion(page.footerWidget);
            }
        }
        if (this.owner.enableHeaderAndFooter) {
            this.owner.enableHeaderAndFooter = false;
            this.documentHelper.updateTextPositionForSelection(pagePoint, 1);
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInsidePageRect(point: Point, page: Page): boolean {
        // tslint:disable-next-line:max-line-length
        if ((this.viewer.containerLeft + point.x) >= page.boundingRectangle.x &&
            (this.viewer.containerLeft + point.x) <= (page.boundingRectangle.x + (page.boundingRectangle.width * this.documentHelper.zoomFactor)) && this.viewer instanceof PageLayoutViewer) {
            return true;
            // tslint:disable-next-line:max-line-length
        } else if ((this.viewer.containerLeft + point.x) >= page.boundingRectangle.x &&
            (this.viewer.containerLeft + point.x) <= (page.boundingRectangle.x + page.boundingRectangle.width)) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInHeaderRegion(point: Point, page: Page): boolean {
        if (this.viewer instanceof PageLayoutViewer) {
            let pageTop: number = this.getPageTop(page);
            let headerHeight: number = 0;
            let header: HeaderFooterWidget = page.headerWidget;
            if (header) {
                headerHeight = (header.y + header.height);
            }
            let isEmpty: boolean = header.isEmpty && !this.owner.enableHeaderAndFooter;
            let topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
            let pageHeight: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.pageHeight);
            let height: number = isEmpty ? topMargin : Math.min(Math.max(headerHeight, topMargin), pageHeight / 100 * 40);
            height = height * this.documentHelper.zoomFactor;
            if ((this.viewer.containerTop + point.y) >= pageTop && (this.viewer.containerTop + point.y) <= pageTop + height) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInFooterRegion(point: Point, page: Page): boolean {
        if (this.viewer instanceof PageLayoutViewer) {
            let pageRect: Rect = page.boundingRectangle;
            let pageTop: number = this.getPageTop(page);
            let pageBottom: number = pageTop + (pageRect.height * this.documentHelper.zoomFactor);
            let footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
            let footerHeight: number = 0;
            if (page.footerWidget) {
                footerHeight = page.footerWidget.height;
            }
            let bottomMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.bottomMargin);
            let isEmpty: boolean = page.footerWidget.isEmpty && !this.owner.enableHeaderAndFooter;
            let height: number = pageRect.height;
            if (isEmpty) {
                height = (height - bottomMargin) * this.documentHelper.zoomFactor;
            } else {
                // tslint:disable-next-line:max-line-length
                height = (height - Math.min(pageRect.height / 100 * 40, Math.max(footerHeight + footerDistance, bottomMargin))) * this.documentHelper.zoomFactor;
            }
            // tslint:disable-next-line:max-line-length
            if ((this.viewer.containerTop + point.y) <= pageBottom && (this.viewer.containerTop + point.y) >= pageTop + height) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public enableHeadersFootersRegion(widget: HeaderFooterWidget): boolean {
        if (this.viewer instanceof PageLayoutViewer) {
            this.owner.enableHeaderAndFooter = true;
            this.updateTextPositionForBlockContainer(widget);
            this.shiftBlockOnHeaderFooterEnableDisable();
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public shiftBlockOnHeaderFooterEnableDisable(): void {
        for (let i: number = 0; i < this.documentHelper.headersFooters.length; i++) {
            let headerFooter: HeaderFooters = this.documentHelper.headersFooters[i];
            let sectionFormat: WSectionFormat = this.getBodyWidgetInternal(i, 0).sectionFormat;
            for (let key of Object.keys(headerFooter)) {
                let widget: HeaderFooterWidget = headerFooter[key];
                if (widget.isEmpty) {
                    this.owner.editor.shiftPageContent(widget.headerFooterType, sectionFormat);
                }
            }
        }
    }
    /**
     * @private
     */
    public updateTextPositionForBlockContainer(widget: BlockContainer): void {
        let block: BlockWidget = widget.firstChild as BlockWidget;
        if (block instanceof TableWidget) {
            block = this.getFirstBlockInFirstCell(block);
        }
        this.selectParagraphInternal(block as ParagraphWidget, true);
    }
    /**
     * Disable Header footer
     * @private
     */
    public disableHeaderFooter(): void {
        let page: Page = this.getPage(this.start.paragraph);
        this.updateTextPositionForBlockContainer(page.bodyWidgets[0]);
        this.owner.enableHeaderAndFooter = false;
        this.shiftBlockOnHeaderFooterEnableDisable();
    }
    //#endregion
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.contextTypeInternal)) {
            this.contextTypeInternal = undefined;
        }
        if (this.pasteDropDwn) {
            this.pasteDropDwn.destroy();
            this.pasteDropDwn = undefined;
        }
        this.caret = undefined;
        this.contextTypeInternal = undefined;
        this.upDownSelectionLength = undefined;
        this.owner = undefined;
    }
    /**
     * Navigates to the specified bookmark.
     * @param name
     * @param moveToStart
     * @private
     */
    public navigateBookmark(name: string, moveToStart?: boolean): void {
        let bookmarks: Dictionary<string, BookmarkElementBox> = this.documentHelper.bookmarks;
        if (bookmarks.containsKey(name)) {
            //bookmark start element
            let bookmrkElmnt: BookmarkElementBox = bookmarks.get(name);
            let offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 1);
            let startPosition: TextPosition = new TextPosition(this.owner);
            startPosition.setPositionParagraph(bookmrkElmnt.line, offset);
            if (moveToStart) {
                this.documentHelper.selection.selectRange(startPosition, startPosition);
            } else {
                //bookmark end element
                let bookmrkEnd: BookmarkElementBox = bookmrkElmnt.reference;
                let endoffset: number = bookmrkEnd.line.getOffset(bookmrkEnd, 0);
                let endPosition: TextPosition = new TextPosition(this.owner);
                endPosition.setPositionParagraph(bookmrkEnd.line, endoffset);
                //selects the bookmark range
                this.documentHelper.selection.selectRange(startPosition, endPosition);
            }
        }
    }
    /**
     * Selects the specified bookmark.
     * @param name
     */
    public selectBookmark(name: string): void {
        this.navigateBookmark(name);
    }
    /**
     * Returns the toc field from the selection.
     * @private
     */
    public getTocField(): FieldElementBox {
        let paragraph: ParagraphWidget = this.start.paragraph;
        let tocPara: ParagraphWidget = undefined;
        while ((paragraph !== undefined && this.isTocStyle(paragraph))) {
            tocPara = paragraph;
            paragraph = paragraph.previousRenderedWidget as ParagraphWidget;
        }
        if (tocPara !== undefined) {
            let lineWidget: LineWidget = tocPara.childWidgets[0] as LineWidget;
            if (lineWidget !== undefined) {
                return lineWidget.children[0] as FieldElementBox;
            }
        }
        return undefined;
    }
    /**
     * Returns true if the paragraph has toc style.
     */
    private isTocStyle(paragraph: ParagraphWidget): boolean {
        let style: WStyle = (paragraph.paragraphFormat.baseStyle as WStyle);
        return (style !== undefined && (style.name.toLowerCase().indexOf('toc') !== -1));
    }

    /**
     * @private
     */
    public getElementsForward(lineWidget: LineWidget, startElement: ElementBox, endElement: ElementBox, bidi: boolean): ElementBox[] {
        if (isNullOrUndefined(startElement)) {
            return undefined;
        }
        let elements: ElementBox[] = [];
        while (bidi && startElement && startElement !== endElement && startElement.nextElement && !startElement.isRightToLeft) {
            startElement = startElement.nextElement;
        }
        while (bidi && endElement && startElement !== endElement && endElement.previousElement && !endElement.isRightToLeft) {
            endElement = endElement.previousElement;
        }
        let elementIndex: number = lineWidget.children.indexOf(startElement);
        while (elementIndex >= 0) {
            for (let i: number = elementIndex; i > -1 && i < lineWidget.children.length; bidi ? i-- : i++) {
                let inlineElement: ElementBox = lineWidget.children[i];
                if (inlineElement.line === lineWidget) {
                    if (inlineElement === endElement) {
                        elements.push(inlineElement);
                        elementIndex = -1;
                        break;
                    } else {
                        elements.push(inlineElement);
                    }
                } else {
                    elementIndex = -1;
                    break;
                }

            }
            // inline = inline !== null && inline.NextNode !== null ? (inline.NextNode as Inline).GetNextRenderedInline() : null;
            elementIndex = -1;
        }

        return elements.length === 0 ? undefined : elements;
    }

    // Gets the current line elements in inline reverse order from the end element.
    /**
     * @private
     */
    public getElementsBackward(lineWidget: LineWidget, startElement: ElementBox, endElement: ElementBox, bidi: boolean): ElementBox[] {
        let elements: ElementBox[] = [];
        while (bidi && startElement && startElement.previousElement && (!startElement.isRightToLeft
            || startElement instanceof TextElementBox && this.documentHelper.textHelper.isRTLText(startElement.text))) {
            startElement = startElement.previousElement;
        }
        let elementIndex: number = lineWidget.children.indexOf(startElement);
        while (elementIndex >= 0) {
            for (let i: number = elementIndex; i > -1 && i < lineWidget.children.length; bidi ? i++ : i--) {
                let inlineElement: ElementBox = lineWidget.children[i];
                if (inlineElement.line === lineWidget) {
                    elements.push(inlineElement);
                } else {
                    elementIndex = -1;
                    break;
                }

            }
            // inline = inline !== null && inline.NextNode !== null ? (inline.NextNode as Inline).GetNextRenderedInline() : null;
            elementIndex = -1;
        }

        return elements;
    }

    /**
     * Navigate to previous comment in the document.
     */
    public navigatePreviousComment(): void {
        this.commentNavigateInternal(false);
    }
    /**
     * Navigate to next comment in the document.
     */
    public navigateNextComment(): void {
        this.commentNavigateInternal(true);
    }
    private commentNavigateInternal(next: boolean): void {
        if (!this.documentHelper.currentSelectedComment) {
            if (this.documentHelper.comments.length === 0) {
                return;
            }
            this.documentHelper.currentSelectedComment = this.documentHelper.comments[0];
        }
        if (this.documentHelper.currentSelectedComment) {
            let comments: CommentElementBox[] = this.documentHelper.comments;
            let comment: CommentElementBox = this.documentHelper.currentSelectedComment;
            let index: number = comments.indexOf(comment);
            if (next) {
                comment = (index === (comments.length - 1)) ? comments[0] : comments[index + 1];
            } else {
                comment = index === 0 ? comments[comments.length - 1] : comments[index - 1];
            }
            this.documentHelper.currentSelectedComment = comment;
            this.selectComment(comment);
        }
    }
    /**
     * @private
     */
    public selectComment(comment: CommentElementBox): void {
        if (!isNullOrUndefined(comment)) {
            let startPosition: TextPosition = this.getElementPosition(comment.commentStart).startPosition;
            let endPosition: TextPosition = this.getElementPosition(comment.commentEnd).startPosition;
            this.selectPosition(startPosition, endPosition);
            if (this.owner.commentReviewPane) {
                this.owner.commentReviewPane.selectComment(comment);
            }
        }
    }
    /**
     * @private
     */
    public updateEditRangeCollection(): void {
        if (this.editRangeCollection.length > 0) {
            this.editRangeCollection = [];
        }
        let editRangeStart: EditRangeStartElementBox[];
        let everyOneArea: EditRangeStartElementBox[];
        if (!this.documentHelper.isDocumentProtected) {
            for (let i: number = 0; i < this.documentHelper.editRanges.length; i++) {
                let user: string = this.documentHelper.editRanges.keys[i];
                editRangeStart = this.documentHelper.editRanges.get(user);
                for (let j: number = 0; j < editRangeStart.length; j++) {
                    this.editRangeCollection.push(editRangeStart[j]);
                }
            }
        } else {
            if (this.documentHelper.editRanges.containsKey(this.owner.currentUser)) {
                editRangeStart = this.documentHelper.editRanges.get(this.owner.currentUser);
                for (let j: number = 0; j < editRangeStart.length; j++) {
                    this.editRangeCollection.push(editRangeStart[j]);
                }
            }
            if (this.documentHelper.editRanges.containsKey('Everyone')) {
                let user: string = 'Everyone';
                everyOneArea = this.documentHelper.editRanges.get(user);
                for (let j: number = 0; j < everyOneArea.length; j++) {
                    this.editRangeCollection.push(everyOneArea[j]);
                }
            }
        }
    }
    //Restrict editing implementation starts
    /**
     * @private
     */
    public onHighlight(): void {
        if (this.isHighlightEditRegion) {
            this.highlightEditRegion();
        } else {
            this.unHighlightEditRegion();
        }
        this.viewer.renderVisiblePages();
    }
    /**
     * @private
     */
    public highlightEditRegion(): void {
        this.updateEditRangeCollection();
        if (!this.isHighlightEditRegion) {
            this.unHighlightEditRegion();
            return;
        }
        this.isHightlightEditRegionInternal = true;
        if (isNullOrUndefined(this.editRegionHighlighters)) {
            this.editRegionHighlighters = new Dictionary<LineWidget, SelectionWidgetInfo[]>();
        }
        this.editRegionHighlighters.clear();
        for (let j: number = 0; j < this.editRangeCollection.length; j++) {
            this.highlightEditRegionInternal(this.editRangeCollection[j]);
        }
        this.isHightlightEditRegionInternal = false;
        this.viewer.updateScrollBars();
    }
    /**
     * @private
     */
    public unHighlightEditRegion(): void {
        if (!isNullOrUndefined(this.editRegionHighlighters)) {
            this.editRegionHighlighters.clear();
            this.editRegionHighlighters = undefined;
        }
        this.isHightlightEditRegionInternal = false;
    }
    /**
     * @private
     */
    public highlightEditRegionInternal(editRangeStart: EditRangeStartElementBox): void {
        let positionInfo: PositionInfo = this.getPosition(editRangeStart);
        let startPosition: TextPosition = positionInfo.startPosition;
        let endPosition: TextPosition = positionInfo.endPosition;
        // if (editRangeStart.user === this.owner.currentUser && editRangeStart.group === '') {
        this.isCurrentUser = true;
        // }
        this.highlightEditRegions(editRangeStart, startPosition, endPosition);
        this.isCurrentUser = false;
    }
    /**
     * Shows all the editing region, where current user can edit.
     */
    public showAllEditingRegion(): void {
        if (this.editRangeCollection.length === 0) {
            this.updateEditRangeCollection();
        }
        this.documentHelper.clearSelectionHighlight();
        for (let j: number = 0; j < this.editRangeCollection.length; j++) {
            let editRangeStart: EditRangeStartElementBox = this.editRangeCollection[j];
            let positionInfo: PositionInfo = this.getPosition(editRangeStart);
            let startPosition: TextPosition = positionInfo.startPosition;
            let endPosition: TextPosition = positionInfo.endPosition;
            this.highlightEditRegions(editRangeStart, startPosition, endPosition);
        }
    }
    private highlightEditRegions(editRangeStart: EditRangeStartElementBox, startPosition: TextPosition, endPosition: TextPosition): void {
        if (!editRangeStart.line.paragraph.isInsideTable
            || (editRangeStart.line.paragraph.isInsideTable && !editRangeStart.editRangeEnd.line.paragraph.isInsideTable)) {
            this.highlight(editRangeStart.line.paragraph, startPosition, endPosition);
            if (this.isHighlightNext) {
                this.highlightNextBlock(this.hightLightNextParagraph, startPosition, endPosition);
                this.isHighlightNext = false;
                this.hightLightNextParagraph = undefined;
            }
        } else {
            let row: TableRowWidget = editRangeStart.line.paragraph.associatedCell.ownerRow as TableRowWidget;
            let cell: TableCellWidget = row.childWidgets[editRangeStart.columnFirst] as TableCellWidget;
            if (cell) {
                for (let i: number = 0; i < cell.childWidgets.length; i++) {
                    if (cell.childWidgets[i] instanceof ParagraphWidget) {
                        this.highlight(cell.childWidgets[i] as ParagraphWidget, startPosition, endPosition);
                        if (this.isHighlightNext) {
                            this.highlightNextBlock(this.hightLightNextParagraph, startPosition, endPosition);
                            this.isHighlightNext = false;
                            this.hightLightNextParagraph = undefined;
                        }
                    }
                }
            }
        }
    }
    /**
     * Navigate to next editing region, where current user can edit.
     */
    public navigateToNextEditingRegion(): void {
        let editRange: EditRangeStartElementBox = this.getEditRangeStartElement();

        //Sort based on position
        for (let i: number = this.editRangeCollection.length - 1; i >= 0; i--) {
            for (let j: number = 1; j <= i; j++) {
                let nextPosition: TextPosition = this.getPosition(this.editRangeCollection[j - 1]).startPosition;
                let firstPosition: TextPosition = this.getPosition(this.editRangeCollection[j]).startPosition;
                if (nextPosition.isExistAfter(firstPosition)) {
                    let temp: EditRangeStartElementBox = this.editRangeCollection[j - 1];
                    this.editRangeCollection[j - 1] = this.editRangeCollection[j];
                    this.editRangeCollection[j] = temp;
                }
            }
        }

        let index: number = this.editRangeCollection.indexOf(editRange);
        let editRangeStart: EditRangeStartElementBox = index < this.editRangeCollection.length - 1 ?
            this.editRangeCollection[index + 1] as EditRangeStartElementBox : this.editRangeCollection[0] as EditRangeStartElementBox;
        let positionInfo: PositionInfo = this.getPosition(editRangeStart);
        let startPosition: TextPosition = positionInfo.startPosition;
        let endPosition: TextPosition = positionInfo.endPosition;
        this.selectRange(startPosition, endPosition);
    }
    /**
     * Highlight all the editing region, where current user can edit.  
     */
    public toggleEditingRegionHighlight(): void {
        this.isHighlightEditRegion = !this.isHighlightEditRegion;
    }
    /**
     * @private
     */
    public getEditRangeStartElement(): EditRangeStartElementBox {
        for (let i: number = 0; i < this.editRangeCollection.length; i++) {
            let editStart: EditRangeStartElementBox = this.editRangeCollection[i];
            let position: PositionInfo = this.getPosition(editStart);
            let start: TextPosition = position.startPosition;
            let end: TextPosition = position.endPosition;
            if ((this.start.isExistAfter(start) || this.start.isAtSamePosition(start))
                && (this.end.isExistBefore(end) || this.end.isAtSamePosition(end))) {
                return editStart;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public isSelectionIsAtEditRegion(update: boolean): boolean {
        if (!this.documentHelper.isDocumentProtected) {
            return false;
        }
        return this.checkSelectionIsAtEditRegion();
    }
    public checkSelectionIsAtEditRegion(): boolean {
        for (let i: number = 0; i < this.editRangeCollection.length; i++) {
            let editRangeStart: EditRangeStartElementBox = this.editRangeCollection[i];
            let positionInfo: PositionInfo = this.getPosition(editRangeStart);
            let startPosition: TextPosition = positionInfo.startPosition;
            let endPosition: TextPosition = positionInfo.endPosition;
            let start: TextPosition = this.start;
            let end: TextPosition = this.end;
            if (!this.isForward) {
                start = this.end;
                end = this.start;
            }
            if ((start.isExistAfter(startPosition) || start.isAtSamePosition(startPosition))
                && (end.isExistBefore(endPosition) || end.isAtSamePosition(endPosition))) {
                return true;
            }
        }
        return false;
    }
    private getPosition(element: ElementBox): PositionInfo {
        let offset: number = element.line.getOffset(element, 1);
        let startPosition: TextPosition = new TextPosition(this.owner);
        startPosition.setPositionParagraph(element.line, offset);
        let endElement: EditRangeEndElementBox = (element as EditRangeStartElementBox).editRangeEnd;
        offset = endElement.line.getOffset(endElement, 1);
        let endPosition: TextPosition = new TextPosition(this.owner);
        endPosition.setPositionParagraph(endElement.line, offset);
        return { 'startPosition': startPosition, 'endPosition': endPosition };
    }
    /**
     * @private
     */
    public getElementPosition(element: ElementBox): PositionInfo {
        let offset: number = element.line.getOffset(element, 1);
        let startPosition: TextPosition = new TextPosition(this.owner);
        startPosition.setPositionParagraph(element.line, offset);
        return { 'startPosition': startPosition, 'endPosition': undefined };
    }
    //Restrict editing implementation ends
}
/**
 *  Specifies the settings for selection.
 */
export interface SelectionSettings {
    /**
     * Specifies selection left position
     */
    x: number;
    /**
     * Specifies selection top position
     */
    y: number;
    /**
     * Specifies whether to extend or update selection
     */
    extend?: boolean;
}