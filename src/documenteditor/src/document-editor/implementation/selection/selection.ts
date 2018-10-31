import { DocumentEditor } from '../../document-editor';
import {
    Rect, Margin, IWidget, Widget, BodyWidget, TableRowWidget, TableWidget,
    LineWidget, ElementBox, TextElementBox, ListTextElementBox, ImageElementBox, Page, ParagraphWidget, TableCellWidget,
    FieldElementBox, BlockWidget, HeaderFooterWidget, BlockContainer, BookmarkElementBox
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
import { PageLayoutViewer, LayoutViewer } from '../index';
import { isNullOrUndefined, createElement, L10n } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import {
    LineSpacingType, BaselineAlignment, HighlightColor,
    Strikethrough, Underline, TextAlignment
} from '../../base/index';
import { TextPositionInfo } from '../editor/editor-helper';
import { WCharacterFormat, WParagraphFormat, WStyle, WParagraphStyle } from '../index';
import { HtmlExport } from '../writer/html-export';
import { Popup } from '@syncfusion/ej2-popups';
import { ContextType, RequestNavigateEventArgs } from '../../index';
import { TextPosition, SelectionWidgetInfo, Hyperlink, ImageFormat } from './selection-helper';
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
    private viewer: LayoutViewer;
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
    /**
     * @private
     */
    public editPosition: string;
    /**
     * @private
     */
    public selectedWidgets: Dictionary<IWidget, SelectionWidgetInfo> = undefined;
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
     * @return {SelectionCharacterFormat}
     */
    get characterFormat(): SelectionCharacterFormat {
        return this.characterFormatIn;
    }
    /**
     * Gets the instance of selection paragraph format.
     * @default undefined
     * @return {SelectionParagraphFormat}
     */
    get paragraphFormat(): SelectionParagraphFormat {
        return this.paragraphFormatIn;
    }
    /**
     * Gets the instance of selection section format.
     * @default undefined
     * @return {SelectionSectionFormat}
     */
    get sectionFormat(): SelectionSectionFormat {
        return this.sectionFormatIn;
    }
    /**
     * Gets the instance of selection table format.
     * @default undefined
     * @return {SelectionTableFormat}
     */
    get tableFormat(): SelectionTableFormat {
        return this.tableFormatIn;
    }
    /**
     * Gets the instance of selection cell format.
     * @default undefined
     * @return {SelectionCellFormat}
     */
    get cellFormat(): SelectionCellFormat {
        return this.cellFormatIn;
    }
    /**
     * Gets the instance of selection row format.
     * @default undefined
     * @returns SelectionRowFormat
     */
    get rowFormat(): SelectionRowFormat {
        return this.rowFormatIn;
    }
    /**
     * Gets the instance of selection image format.
     * @default undefined
     * @returns SelectionImageFormat
     */
    get imageFormat(): SelectionImageFormat {
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
     * @private
     */
    get startPage(): number {
        if (!this.owner.isDocumentLoaded || isNullOrUndefined(this.viewer)
            || isNullOrUndefined(this.viewer.selectionStartPage)) {
            return 1;
        }
        return this.viewer.pages.indexOf(this.viewer.selectionStartPage) + 1;
    }
    /**
     * Gets the page number where the selection ends.
     * @private
     */
    get endPage(): number {
        if (!this.owner.isDocumentLoaded || isNullOrUndefined(this.viewer)
            || isNullOrUndefined(this.viewer.selectionEndPage)) {
            return 1;
        }
        return this.viewer.pages.indexOf(this.viewer.selectionEndPage) + 1;
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
     * Gets the text within selection.
     * @default ''
     * @returns {string}
     */
    get text(): string {
        return this.getText(false);
    }
    /**
     * Gets the context type of the selection.
     */
    get contextType(): ContextType {
        return this.contextTypeInternal;
    }
    /**
     * @private
     */
    get isCleared(): boolean {
        return isNullOrUndefined(this.end);
    }
    /**
     * @private
     */
    constructor(documentEditor: DocumentEditor) {
        this.owner = documentEditor;
        this.viewer = this.owner.viewer;
        this.start = new TextPosition(this.owner);
        this.end = new TextPosition(this.owner);
        this.selectedWidgets = new Dictionary<IWidget, SelectionWidgetInfo>();
        this.characterFormatIn = new SelectionCharacterFormat(this);
        this.paragraphFormatIn = new SelectionParagraphFormat(this, this.viewer);
        this.sectionFormatIn = new SelectionSectionFormat(this);
        this.rowFormatIn = new SelectionRowFormat(this);
        this.cellFormatIn = new SelectionCellFormat(this);
        this.tableFormatIn = new SelectionTableFormat(this);
        this.imageFormatInternal = new SelectionImageFormat(this);
    }
    private getModuleName(): string {
        return 'Selection';
    }
    //Public API
    /**
     * Moves the selection to the header of current page.
     */
    public goToHeader(): void {
        this.owner.enableHeaderAndFooter = true;
        this.enableHeadersFootersRegion(this.start.paragraph.bodyWidget.page.headerWidget);
    }
    /**
     * Moves the selection to the footer of current page.
     */
    public goToFooter(): void {
        this.owner.enableHeaderAndFooter = true;
        this.enableHeadersFootersRegion(this.start.paragraph.bodyWidget.page.footerWidget);
    }
    /**
     * Closes the header and footer region.
     */
    public closeHeaderFooter(): void {
        this.disableHeaderFooter();
    }
    /**
     * Moves the selection to the start of specified page number.
     */
    public goToPage(pageNumber: number): void {
        if (pageNumber >= 1 && pageNumber <= this.viewer.pages.length) {
            let page: Page = this.viewer.pages[pageNumber - 1];
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
     * Select content based on selection settings
     */
    public select(selectionSettings: SelectionSettings): void {
        let point: Point = new Point(selectionSettings.x, selectionSettings.y);
        let pageCoordinates: Point = this.viewer.findFocusedPage(point, true);
        if (selectionSettings.extend) {
            this.moveTextPosition(pageCoordinates, this.end);
        } else {
            this.viewer.updateTextPositionForSelection(pageCoordinates, 1);
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
            this.viewer.selection.navigateBookmark(hyperlink.localReference, true);
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
    //Selection add, Highlight, remove API starts
    /**
     * @private
     */
    public highlightSelection(isSelectionChanged: boolean): void {
        if (this.owner.enableImageResizerMode) {
            this.owner.imageResizerModule.hideImageResizer();
        }
        if (this.isEmpty) {
            this.updateCaretPosition();
        } else {
            if (this.isForward) {
                this.highlightSelectedContent(this.start, this.end);
            } else {
                this.highlightSelectedContent(this.end, this.start);
            }
            if (this.viewer.isComposingIME) {
                this.updateCaretPosition();
            }
        }
        this.viewer.updateTouchMarkPosition();
        if (isSelectionChanged) {
            this.viewer.scrollToPosition(this.start, this.end);
        }
    }
    /**
     * @private
     */
    public createHighlightBorder(lineWidget: LineWidget, width: number, left: number, top: number): void {
        if (width < 0) {
            width = 0;
        }
        let page: Page = this.getPage(lineWidget.paragraph);
        let height: number = lineWidget.height;
        let selectionWidget: SelectionWidgetInfo = undefined;
        if (!this.selectedWidgets.containsKey(lineWidget)) {
            selectionWidget = new SelectionWidgetInfo(left, width);
            this.selectedWidgets.add(lineWidget, selectionWidget);
        }
        let viewer: PageLayoutViewer = this.viewer as PageLayoutViewer;
        let pageTop: number = this.getPageTop(page);
        let pageLeft: number = page.boundingRectangle.x;
        if (viewer.containerTop <= pageTop
            || pageTop < viewer.containerTop + viewer.selectionCanvas.height) {
            let zoomFactor: number = viewer.zoomFactor;
            this.clipSelection(page, pageTop);
            if (this.viewer.isComposingIME) {
                // tslint:disable-next-line:max-line-length
                this.renderDashLine(viewer.selectionContext, page, lineWidget, (pageLeft + (left * zoomFactor)) - viewer.containerLeft, top, width * zoomFactor, height);
            } else {
                viewer.selectionContext.fillStyle = 'gray';
                viewer.selectionContext.globalAlpha = 0.4;
                // tslint:disable-next-line:max-line-length
                viewer.selectionContext.fillRect((pageLeft + (left * zoomFactor)) - viewer.containerLeft, (pageTop + (top * zoomFactor)) - viewer.containerTop, width * zoomFactor, height * zoomFactor);
            }
            viewer.selectionContext.restore();
        }
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
            || pageTop < this.viewer.containerTop + this.viewer.selectionCanvas.height;
        if (this.selectedWidgets.containsKey(cellWidget)) {
            selectionWidget = this.selectedWidgets.get(cellWidget);
            if (isVisiblePage) {
                // tslint:disable-next-line:max-line-length
                this.viewer.selectionContext.clearRect((pageLeft + (selectionWidget.left * this.viewer.zoomFactor) - this.viewer.containerLeft), (pageTop + (top * this.viewer.zoomFactor)) - this.viewer.containerTop, selectionWidget.width * this.viewer.zoomFactor, height * this.viewer.zoomFactor);
            }
        }
        selectionWidget = new SelectionWidgetInfo(left, width);
        this.selectedWidgets.add(cellWidget, selectionWidget);
        if (isVisiblePage) {
            this.viewer.selectionContext.fillStyle = 'gray';
            this.viewer.selectionContext.globalAlpha = 0.4;
            let zoomFactor: number = this.viewer.zoomFactor;
            this.clipSelection(page, pageTop);
            // tslint:disable-next-line:max-line-length
            this.viewer.selectionContext.fillRect((pageLeft + (left * zoomFactor)) - this.viewer.containerLeft, (pageTop + (top * zoomFactor)) - this.viewer.containerTop, width * zoomFactor, height * zoomFactor);
            this.viewer.selectionContext.restore();
        }
    }
    /**
     * @private
     */
    public clipSelection(page: Page, pageTop: number): void {
        let viewer: PageLayoutViewer = this.viewer as PageLayoutViewer;
        let width: number = page.boundingRectangle.width * viewer.zoomFactor;
        let height: number = page.boundingRectangle.height * viewer.zoomFactor;
        let left: number = page.boundingRectangle.x;
        viewer.selectionContext.beginPath();
        viewer.selectionContext.save();
        viewer.selectionContext.rect(left - viewer.containerLeft, pageTop - viewer.containerTop, width, height);
        viewer.selectionContext.clip();
    }

    /**
     * Add selection highlight
     * @private
     */
    public addSelectionHighlight(canvasContext: CanvasRenderingContext2D, widget: LineWidget, top: number): void {
        if (this.selectedWidgets.containsKey(widget)) {
            let height: number = widget.height;
            let widgetInfo: SelectionWidgetInfo = this.selectedWidgets.get(widget);
            let width: number = this.viewer.render.getScaledValue(widgetInfo.width);
            let left: number = this.viewer.render.getScaledValue(widgetInfo.left, 1);

            let page: Page = this.owner.selection.getPage(widget.paragraph);
            this.owner.selection.clipSelection(page, this.owner.selection.getPageTop(page));
            if (this.viewer.isComposingIME) {
                this.renderDashLine(canvasContext, page, widget, left, top, width, height);
            } else {
                height = this.viewer.render.getScaledValue(height);
                canvasContext.globalAlpha = 0.4;
                canvasContext.fillStyle = 'gray';
                canvasContext.fillRect(left, this.viewer.render.getScaledValue(top, 2), width, height);
            }
            canvasContext.restore();
        }
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    private renderDashLine(ctx: CanvasRenderingContext2D, page: Page, widget: LineWidget, left: number, top: number, width: number, height: number): void {
        let fontColor: string = this.characterFormat.fontColor;
        let fillColor: string = fontColor ? this.viewer.render.getColor(fontColor) : '#000000';
        ctx.globalAlpha = 1;
        // Get character format copied from selection format
        let format: WCharacterFormat = this.owner.editor.copyInsertFormat(new WCharacterFormat(), false);
        let heightInfo: TextSizeInfo = this.viewer.textHelper.getHeight(format);
        let pageTop: number = this.getPageTop(page);
        let descent: number = heightInfo.Height - heightInfo.BaselineOffset;
        top = this.viewer.render.getUnderlineYPosition(widget) + top + 4 - descent;
        // tslint:disable-next-line:max-line-length
        this.viewer.render.renderDashLine(ctx, left, (pageTop - this.viewer.containerTop) + (top * this.viewer.zoomFactor), width, fillColor, true);
    }
    /**
     * Add Selection highlight inside table
     * @private
     */
    public addSelectionHighlightTable(canvasContext: CanvasRenderingContext2D, tableCellWidget: TableCellWidget): void {
        if (this.selectedWidgets.containsKey(tableCellWidget)) {
            let selectionWidget: SelectionWidgetInfo = this.selectedWidgets.get(tableCellWidget);
            let left: number = this.viewer.render.getScaledValue(selectionWidget.left, 1);
            let top: number = this.viewer.render.getScaledValue(tableCellWidget.y, 2);
            let width: number = this.viewer.render.getScaledValue(selectionWidget.width);
            let height: number = this.viewer.render.getScaledValue(tableCellWidget.height);
            canvasContext.fillStyle = 'gray';
            let page: Page = this.owner.selection.getPage(tableCellWidget);
            this.owner.selection.clipSelection(page, this.owner.selection.getPageTop(page));
            canvasContext.fillRect(left, top, width, height);
            canvasContext.restore();
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
        let widgetInfo: SelectionWidgetInfo = this.selectedWidgets.get(widget);
        width = widgetInfo.width;
        left = widgetInfo.left;

        let pageRect: Rect = page.boundingRectangle;
        let pageIndex: number = this.viewer.pages.indexOf(page);
        let pageGap: number = (this.viewer as PageLayoutViewer).pageGap;
        let pageTop: number = (pageRect.y - pageGap * (pageIndex + 1)) * this.viewer.zoomFactor + pageGap * (pageIndex + 1);
        let pageLeft: number = pageRect.x;
        let zoomFactor: number = this.viewer.zoomFactor;
        if (this.viewer.containerTop <= pageTop
            || pageTop < this.viewer.containerTop + this.viewer.selectionCanvas.height) {
            // tslint:disable-next-line:max-line-length
            this.viewer.selectionContext.clearRect((pageLeft + (left * zoomFactor) - this.viewer.containerLeft) - 0.5, (pageTop + (top * zoomFactor)) - this.viewer.containerTop - 0.5, width * zoomFactor + 0.5, height * zoomFactor + 0.5);
        }
    }


    /**
     * Select Current word
     * @private
     */
    public selectCurrentWord(): void {
        let startPosition: TextPosition = this.start.clone();
        let endPosition: TextPosition = this.end.clone();
        this.selectCurrentWordRange(startPosition, endPosition, false);
        this.selectRange(startPosition, endPosition);
    }
    /**
     * Select current paragraph
     * @private
     */
    public selectCurrentParagraph(): void {
        if (!isNullOrUndefined(this.start)) {
            this.start.paragraphStartInternal(this, false);
            this.end.moveToParagraphEndInternal(this, false);
            this.upDownSelectionLength = this.end.location.x;
            this.fireSelectionChanged(true);
        }
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
     * Extend selection to paragraph start
     * @private
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
     * Extend selection to paragraph end
     * @private
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
     * Extend selection to previous line
     * @private
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
     * @private
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
     * Extend to line start
     * @private
     */
    public extendToLineStart(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveToLineStartInternal(this, true);
        this.upDownSelectionLength = this.end.location.x;
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
            let lastrow: TableRowWidget = table.childWidgets[table.childWidgets.length - 1] as TableRowWidget;
            let lastcell: TableCellWidget = lastrow.childWidgets[lastrow.childWidgets.length - 1] as TableCellWidget;
            return lastcell.childWidgets[lastcell.childWidgets.length - 1] as BlockWidget;
        }
        return undefined;
    }

    /**
     * Move to line start
     * @private
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
     * Move to line end
     * @private
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
        return (page.boundingRectangle.y - (this.viewer as PageLayoutViewer).pageGap * (this.viewer.pages.indexOf(page) + 1)) * this.viewer.zoomFactor + (this.viewer as PageLayoutViewer).pageGap * (this.viewer.pages.indexOf(page) + 1);
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
        let widget: LineWidget = this.viewer.getLineWidgetInternal(cursorPoint, true);
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
        let block: BlockWidget = this.viewer.pages[0].bodyWidgets[0].childWidgets[0] as BlockWidget;
        return this.setPositionForBlock(block, true);
    }
    /**
     * Get document end position
     * @private
     */
    public getDocumentEnd(): TextPosition {
        let textPosition: TextPosition = undefined;
        let documentStart: TextPosition = this.owner.documentStart;
        let lastPage: Page = this.viewer.pages[this.viewer.pages.length - 1];
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
        this.extendToWordStart(true);
        this.checkForCursorVisibility();
    }
    /**
     * @private
     * Handles control right key.
     */
    public handleControlRightKey(): void {
        this.extendToWordEnd(true);
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
        this.extendToWordStart(false);
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
        this.extendToWordEnd(false);
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
        this.movePreviousPosition();
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
        this.moveNextPosition();
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
            this.selectParagraph(lastParagraph, true);
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
     * @private
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
     * Extend selection backward
     * @private
     */
    public extendBackward(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveBackward();
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extent selection forward
     * @private
     */
    public extendForward(): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        this.end.moveForward();
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
     * Extend selection to word start
     * @private
     */
    public extendToWordStart(isNavigation: boolean): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isCellSelected: boolean = this.extendToWordStartEnd();
        if (isCellSelected) {
            this.end.moveToPreviousParagraphInTable(this);
        } else {
            this.end.moveToWordStartInternal(isNavigation ? 0 : 1);
        }
        if (isNavigation) {
            this.start.setPositionInternal(this.end);
        }
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extent selection to word end
     * @private
     */
    public extendToWordEnd(isNavigation: boolean): void {
        if (isNullOrUndefined(this.start)) {
            return;
        }
        let isCellSelect: boolean = this.extendToWordStartEnd();
        if (isCellSelect) {
            this.end.moveToNextParagraphInTable();
        } else {
            this.end.moveToWordEndInternal(isNavigation ? 0 : 1, false);
        }
        if (isNavigation) {
            this.start.setPositionInternal(this.end);
        }
        this.upDownSelectionLength = this.end.location.x;
        this.fireSelectionChanged(true);
    }
    /**
     * Extend selection to next line
     * @private
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
                    let nextParagraphWidget: ParagraphWidget = this.viewer.selection.getNextParagraphBlock(startPosition.paragraph) as ParagraphWidget;
                    text = text + '\r';
                    while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.isEmpty()) {
                        text = text + '\r';
                        if (nextParagraphWidget === endPosition.paragraph) {
                            return text;
                        }
                        nextParagraphWidget = this.viewer.selection.getNextParagraphBlock(nextParagraphWidget) as ParagraphWidget;
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
        let nextParagraphWidget: ParagraphWidget = this.viewer.selection.getNextParagraphBlock(inlineElement.line.paragraph) as ParagraphWidget;
        while (!isNullOrUndefined(nextParagraphWidget) && nextParagraphWidget.isEmpty()) {
            text = text + '\r';
            if (nextParagraphWidget === endParagraphWidget) {
                return text;
            }
            nextParagraphWidget = this.viewer.selection.getNextParagraphBlock(nextParagraphWidget) as ParagraphWidget;
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
                    let startPage: number = this.viewer.pages.indexOf(start.containerWidget.page);
                    let endPage: number = this.viewer.pages.indexOf(block.containerWidget.page);
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
                let startPage: number = this.viewer.pages.indexOf(start.containerWidget.page);
                let endPage: number = this.viewer.pages.indexOf(block.containerWidget.page);
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
        for (let i: number = 0; i < line.children.length; i++) {
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
            if (inline instanceof TextElementBox || inline instanceof ImageElementBox || inline instanceof BookmarkElementBox
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
        for (let i: number = 0; i < paragraph.childWidgets.length; i++) {
            let lineWidget: LineWidget = paragraph.childWidgets[i] as LineWidget;
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
        }
        return offset - 1 === count ? validOffset : offset - 1;
    }
    /**
     * Get next valid offset
     * @private
     */
    public getNextValidOffset(line: LineWidget, offset: number): number {
        let count: number = 0;
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
        return offset;
    }

    /**
     * Get paragraph mark size info
     * @private
     */
    public getParagraphMarkSize(paragraph: ParagraphWidget, topMargin: number, bottomMargin: number): SizeInfo {
        let size: TextSizeInfo = this.viewer.textHelper.getParagraphMarkSize(paragraph.characterFormat);
        let baselineOffset: number = size.BaselineOffset;
        let maxHeight: number = size.Height;
        let maxBaselineOffset: number = baselineOffset;
        if (paragraph instanceof ParagraphWidget) {
            // let paragraphWidget: ParagraphWidget[] = paragraph.renderedElement() as ParagraphWidget[];
            if (paragraph.childWidgets.length > 0) {
                let lineWidget: LineWidget = paragraph.childWidgets[0] as LineWidget;
            }

            //Gets line spacing.
            let lineSpacing: number = this.viewer.layout.getLineSpacing(paragraph, maxHeight);
            let beforeSpacing: number = this.viewer.layout.getBeforeSpacing(paragraph);
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
            bottomMargin += paragraph.paragraphFormat.afterSpacing;
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
            let inlineObj: ElementInfo = line.getInline(offset, indexInInline);
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
                if (this.viewer.isTouchInput) {
                    this.viewer.touchStart.style.display = 'none';
                    this.viewer.touchEnd.style.display = 'none';
                }
            } else {
                this.highlight(start.paragraph, start, end);
            }
        }
    }
    /**
     * @private
     */

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
            this.createHighlightBorder(startLineWidget, right - left, left, top);
        } else {
            if (!isNullOrUndefined(startLineWidget)) {
                let x: number = startLineWidget.paragraph.x;
                this.createHighlightBorder(startLineWidget, this.getWidth(startLineWidget, true) - (left - x), left, top);
                let lineIndex: number = startLineWidget.paragraph.childWidgets.indexOf(startLineWidget);
                //Iterates to last item of paragraph or selection end.                                             
                this.highlightParagraph(paragraph as ParagraphWidget, lineIndex + 1, endLineWidget, endElement, selectionEndIndex);
                if (paragraph.childWidgets.indexOf(end.currentWidget) !== -1) {
                    return;
                }
            }
            this.highlightNextBlock(paragraph, start, end);
        }
    }
    private highlightNextBlock(paragraph: BlockWidget, start: TextPosition, end: TextPosition): void {
        let block: BlockWidget = paragraph.nextRenderedWidget as BlockWidget;
        if (!isNullOrUndefined(block)) {
            if (block instanceof ParagraphWidget) {
                this.highlight(block, start, end);
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
        if (inline.length === index && inline.nextNode instanceof FieldElementBox) {
            //If inline is last item within field, then set field end as text position.
            let nextInline: ElementBox = this.getNextValidElement((inline.nextNode as FieldElementBox)) as ElementBox;
            if (nextInline instanceof FieldElementBox && nextInline.fieldType === 1) {
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
            if (inline instanceof FieldElementBox || inline instanceof BookmarkElementBox) {
                return this.getFieldCharacterPosition(inline);
            }
            return new Point(0, 0);
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
            let measureObj: TextSizeInfo = this.viewer.textHelper.getHeight(format);
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
            return { 'height': this.viewer.textHelper.getHeight(format).Height, 'topMargin': topMargin, 'isItalic': isItalic };
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
                    maxLineHeight += paragarph.paragraphFormat.afterSpacing;
                }
            } else if (isNullOrUndefined(previousInline)) {
                isItalic = nextInline.characterFormat.italic;
                return this.getCaretHeight(nextInline, 0, nextInline.characterFormat, isEmptySelection, topMargin, isItalic);
            } else {
                if (!isNullOrUndefined(nextInline) && element instanceof ImageElementBox) {
                    //Calculates the caret size using image character format.
                    let textSizeInfo: TextSizeInfo = this.viewer.textHelper.getHeight(element.characterFormat);
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
        let height: number = this.viewer.textHelper.getHeight(format).Height;
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
            let height: number = this.viewer.textHelper.getParagraphMarkSize(format).Height;
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
        for (let i: number = startIndex; i < widget.childWidgets.length; i++) {
            let line: LineWidget = widget.childWidgets[i] as LineWidget;
            if (i === startIndex) {
                top = this.getTop(line);
            }
            let left: number = this.getLeft(line);
            if (line === endLine) {
                //Selection ends in current line.
                let right: number = this.getLeftInternal(endLine, endElement, endIndex);
                this.createHighlightBorder(line, right - left, left, top);
                return;
            }
            this.createHighlightBorder(line, this.getWidth(line, true) - (left - widget.x), left, top);
            top += line.height;
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
        left = elementValues.left;
        if (isNullOrUndefined(element)) {
            let topMargin: number = 0; let bottomMargin: number = 0;
            let size: SizeInfo = this.getParagraphMarkSize(widget.paragraph, topMargin, bottomMargin);
            topMargin = size.topMargin;
            bottomMargin = size.bottomMargin;
            let selectParaMark: boolean = this.viewer.mouseDownOffset.y >= top && this.viewer.mouseDownOffset.y < top + widget.height ? (this.viewer.mouseDownOffset.x < left + size.width) : true;
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
                        if (caretPosition.x < left + element.margin.left + element.width || i === widget.children.length - 1) {
                            break;
                        }
                        left += element.margin.left + element.width;
                    }
                    if (caretPosition.x > left + element.margin.left + element.width) {
                        //Line End
                        index = element instanceof TextElementBox ? (element as TextElementBox).length : 1;
                        left += element.margin.left + element.width;
                    } else if (element instanceof TextElementBox) {
                        let x: number = caretPosition.x - left - element.margin.left;
                        left += element.margin.left;
                        let prevWidth: number = 0;
                        let charIndex: number = 0;
                        for (let i: number = 1; i <= (element as TextElementBox).length; i++) {
                            let width: number = 0;
                            if (i === (element as TextElementBox).length) {
                                width = element.width;
                            } else {
                                width = this.viewer.textHelper.getWidth((element as TextElementBox).text.substr(0, i), element.characterFormat);
                            }
                            if (x < width || i === (element as TextElementBox).length) {
                                //Updates exact left position of the caret.
                                let charWidth: number = width - prevWidth;
                                if (x - prevWidth > charWidth / 2) {
                                    left += width;
                                    charIndex = i;
                                } else {
                                    left += prevWidth;
                                    charIndex = i - 1;
                                    if (i === 1 && element !== widget.children[0]) {
                                        let curIndex: number = widget.children.indexOf(element);
                                        if (!(widget.children[curIndex - 1] instanceof ListTextElementBox)) {
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
                    left += element.margin.left;
                }
                if (element instanceof TextElementBox) {
                    top += element.margin.top > 0 ? element.margin.top : 0;
                } else {
                    let textMetrics: TextSizeInfo = this.viewer.textHelper.getHeight(element.characterFormat);     //for ascent and descent
                    let height: number = element.height;
                    if (element instanceof BookmarkElementBox && !this.viewer.layout.hasValidElement(element.line.paragraph)) {
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
                        width = this.viewer.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
                        let selectParaMark: boolean = this.viewer.mouseDownOffset.y >= top && this.viewer.mouseDownOffset.y < top + widget.height ? (this.viewer.mouseDownOffset.x < left + width) : true;
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
    // public getTextLength(viewer: LayoutViewer, widget: LineWidget, element: ElementBox): number {
    //     let length: number = 0;
    //     let count: number = widget.children.indexOf(element);
    //     if (widget.children.length > 0 && widget.children[0] instanceof ListTextElementBox) {
    //         if (widget.children[1] instanceof ListTextElementBox) {
    //             count -= 2;
    //         } else {
    //             count -= 1;
    //         }
    //     }
    //     for (let i: number = 1; i < count; i++) {
    //         length += widget.children[i].length;
    //     }
    //     return length;
    // }
    /**
     * Get Line widget left
     * @private
     */
    public getLeft(widget: LineWidget): number {
        let left: number = widget.paragraph.x;
        let paragraphFormat: WParagraphFormat = widget.paragraph.paragraphFormat;
        if (this.isParagraphFirstLine(widget) && !(paragraphFormat.textAlignment === 'Right')) {
            left += HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
        }
        for (let i: number = 0; i < widget.children.length; i++) {
            let element: ElementBox = widget.children[i];
            if (element instanceof ListTextElementBox) {     //after list implementation
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
        if (this.isParagraphFirstLine(widget)) {
            firstLineIndent = HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
        }
        left += firstLineIndent;
        let element: ElementBox = undefined;
        for (let i: number = 0; i < widget.children.length; i++) {
            element = widget.children[i];
            if (element instanceof ListTextElementBox) {
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
        if (this.isParagraphFirstLine(widget)) {
            width += HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
        }
        for (let i: number = 0; i < widget.children.length; i++) {
            width += widget.children[i].margin.left + widget.children[i].width;
        }
        if (includeParagraphMark && widget.paragraph.childWidgets.indexOf(widget) === widget.paragraph.childWidgets.length - 1
            && isNullOrUndefined(widget.paragraph.nextSplitWidget)) {
            width += this.viewer.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
        }
        return width;
    }
    /**
     * Return line widget left
     * @private
     */
    public getLeftInternal(widget: LineWidget, elementBox: ElementBox, index: number): number {
        let left: number = widget.paragraph.x;
        if (this.isParagraphFirstLine(widget)) {
            // tslint:disable-next-line:max-line-length
            left += HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
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
            } else {
                left += widget.children[i].margin.left + widget.children[i].width;
            }
        }
        if (!isNullOrUndefined(elementBox)) {
            left += elementBox.margin.left;
        }
        if (elementBox instanceof TextElementBox) {
            if (index === (elementBox as TextElementBox).length) {
                left += elementBox.width;
            } else if (index > (elementBox as TextElementBox).length) {
                // tslint:disable-next-line:max-line-length
                left += elementBox.width + this.viewer.textHelper.getParagraphMarkWidth(elementBox.line.paragraph.characterFormat);
            } else {
                // tslint:disable-next-line:max-line-length
                left += this.viewer.textHelper.getWidth((elementBox as TextElementBox).text.substr(0, index), (elementBox as TextElementBox).characterFormat);
            }
        } else if (index > 0) {
            if (!isNullOrUndefined(elementBox) && !(elementBox instanceof ListTextElementBox)) {
                left += elementBox.width;
                if (index === 2) {
                    let paragraph: ParagraphWidget = elementBox.line.paragraph;
                    left += this.viewer.textHelper.getParagraphMarkWidth(paragraph.characterFormat);
                }
            } else {
                left += this.viewer.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
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
        if (this.isParagraphFirstLine(widget)) {
            left += HelperMethods.convertPointToPixel(widget.paragraph.paragraphFormat.firstLineIndent);
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
        for (let i: number = 0; i < widget.children.length; i++) {
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
    public selectParagraph(paragraph: ParagraphWidget, positionAtStart: boolean): void {
        let line: LineWidget = paragraph.firstChild as LineWidget;
        if (positionAtStart) {
            this.start.setPosition(line, positionAtStart);
        } else {
            let endOffset: number = line.getEndOffset();
            this.start.setPositionParagraph(line, endOffset);
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
        this.viewer.clearSelectionHighlight();
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
        this.viewer.clearSelectionHighlight();
        this.hideToolTip();
        if (this.owner.isLayoutEnabled && !this.owner.isShiftingEnabled) {
            this.highlightSelection(true);
        }
        if (isSelectionChanged) {
            if (this.start.paragraph.isInHeaderFooter && !this.owner.enableHeaderAndFooter) {
                this.owner.enableHeaderAndFooter = true;
            } else if (!this.start.paragraph.isInHeaderFooter && this.owner.enableHeaderAndFooter) {
                this.owner.enableHeaderAndFooter = false;
            }
            this.owner.fireSelectionChange();
        }
        this.viewer.updateFocus();
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
            let startPageIndex: number = this.viewer.pages.indexOf(startParaSection.page);
            let endPageIndex: number = this.viewer.pages.indexOf(endParaSection.page);
            for (let i: number = startPageIndex + 1; i <= endPageIndex; i++) {
                this.sectionFormat.combineFormat((this.viewer.pages[i].bodyWidgets[0] as BodyWidget).sectionFormat);
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
        let widget: LineWidget = this.viewer.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget)) {
            let hyperLinkField: FieldElementBox = this.getHyperLinkFieldInCurrentSelection(widget, cursorPoint);
            //Invokes Hyperlink navigation events.
            if (!isNullOrUndefined(hyperLinkField)) {
                this.viewer.updateTextPositionForSelection(cursorPoint, 1);
                this.fireRequestNavigate(hyperLinkField);
                setTimeout(() => {
                    if (this.viewer) {
                        this.viewer.isTouchInput = isTouchInput;
                        this.viewer.updateFocus();
                        this.viewer.isTouchInput = false;
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
                this.viewer.viewerContainer.appendChild(this.toolTipElement);
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
            let widgetTop: number = this.getTop(widget) * this.viewer.zoomFactor;
            let page: Page = this.getPage(widget.paragraph);
            let containerWidth: number = this.viewer.viewerContainer.getBoundingClientRect().width + this.viewer.viewerContainer.scrollLeft;
            let left: number = page.boundingRectangle.x + xPos * this.viewer.zoomFactor;
            if ((left + this.toolTipElement.clientWidth + 10) > containerWidth) {
                left = left - ((this.toolTipElement.clientWidth - (containerWidth - left)) + 15);
            }
            let top: number = this.getPageTop(page) + (widgetTop - this.toolTipElement.offsetHeight);
            top = top > this.viewer.viewerContainer.scrollTop ? top : top + widget.height + this.toolTipElement.offsetHeight;
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
     * Show hyperlink tooltip
     * @private
     */
    public showToolTip(x: number, y: number): void {
        if (!this.toolTipObject) {
            this.toolTipObject = new Popup(this.toolTipElement, {
                height: 'auto',
                width: 'auto',
                relateTo: this.viewer.viewerContainer.parentElement,
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
            this.toolTipObject.hide();
            this.toolTipObject.destroy();
            this.toolTipObject = undefined;
            this.toolTipElement.style.display = 'none';
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
            let width: number = this.viewer.textHelper.getParagraphMarkWidth(widget.paragraph.characterFormat);
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
                width += this.viewer.textHelper.getParagraphMarkWidth(inline.line.paragraph.characterFormat);
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
    public getHyperlinkField(): FieldElementBox {
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
            field = this.getHyperLinkFields(this.end.paragraph as ParagraphWidget, checkedFields);
        } else {
            let paragraph: ParagraphWidget = inline.line.paragraph;
            field = this.getHyperLinkFieldInternal(paragraph, inline, checkedFields);
        }
        checkedFields = [];
        return field;
    }
    /**
     * @private
     */
    public getHyperLinkFields(paragraph: ParagraphWidget, checkedFields: FieldElementBox[]): FieldElementBox {
        for (let i: number = 0; i < this.viewer.fields.length; i++) {
            if (checkedFields.indexOf(this.viewer.fields[i]) !== -1 || isNullOrUndefined(this.viewer.fields[i].fieldSeparator)) {
                continue;
            } else {
                checkedFields.push(this.viewer.fields[i]);
            }
            let field: string = this.getFieldCode(this.viewer.fields[i]);
            field = field.trim().toLowerCase();
            if (field.match('hyperlink ') && this.paragraphIsInFieldResult(this.viewer.fields[i], paragraph as ParagraphWidget)) {
                return this.viewer.fields[i];
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
    public getHyperLinkFieldInternal(paragraph: Widget, inline: ElementBox, fields: FieldElementBox[]): FieldElementBox {
        for (let i: number = 0; i < this.viewer.fields.length; i++) {
            if (fields.indexOf(this.viewer.fields[i]) !== -1 || isNullOrUndefined(this.viewer.fields[i].fieldSeparator)) {
                continue;
            } else {
                fields.push(this.viewer.fields[i]);
            }
            let fieldCode: string = this.getFieldCode(this.viewer.fields[i]);
            fieldCode = fieldCode.trim().toLowerCase();
            if (fieldCode.match('hyperlink ') && (this.inlineIsInFieldResult(this.viewer.fields[i], inline) || this.isImageField())) {
                return this.viewer.fields[i];
            }
        }
        if (paragraph.containerWidget instanceof BodyWidget && !(paragraph instanceof HeaderFooterWidget)) {
            return this.getHyperLinkFieldInternal(paragraph.containerWidget, inline, fields);
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
     * Select List Text
     * @private
     */
    public selectListText(): void {
        let lineWidget: LineWidget = this.viewer.selectionLineWidget as LineWidget;
        let endOffset: string = '0';
        let selectionIndex: string = lineWidget.getHierarchicalIndex(endOffset);
        let startPosition: TextPosition = this.getTextPosition(selectionIndex);
        let endPosition: TextPosition = this.getTextPosition(selectionIndex);
        this.selectRange(startPosition, endPosition);
        this.highlightListText(this.viewer.selectionLineWidget);
        this.contextTypeInternal = 'List';
    }
    /**
     * Manually select the list text
     * @private
     */
    public highlightListText(linewidget: LineWidget): void {
        let width: number = linewidget.children[0].width;
        let left: number = this.viewer.getLeftValue(linewidget);
        let top: number = linewidget.paragraph.y;
        this.createHighlightBorder(linewidget, width, left, top);
        this.viewer.isListTextSelected = true;
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
            if (paragraph != null && paragraph.containerWidget != null && this.owner.editorModule) {
                let lineIndex: number = paragraph.childWidgets.indexOf(inline.line);
                let elementIndex: number = inline.line.children.indexOf(inline);
                this.viewer.layout.reLayoutParagraph(paragraph, lineIndex, elementIndex);
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
        let document: any = this.owner.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);

        /* tslint:enable:no-any */
        if (this.owner.editorModule) {
            this.owner.editorModule.copiedData = JSON.stringify(document);
        }
        let html: string = this.htmlWriter.writeHtml(document);
        this.copyToClipboard(html);
        if (isCut && this.owner.editorModule) {
            this.owner.editorModule.handleCut(this);
        }
        this.viewer.updateFocus();
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
        div.innerHTML = htmlContent;
        document.body.appendChild(div);
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
            this.viewer.viewerContainer.focus();
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
        let page: Page = !isNullOrUndefined(this.viewer.currentPage) ? this.viewer.currentPage : this.viewer.currentRenderingPage;
        if (isNullOrUndefined(page) || this.viewer.isRowOrCellResizing || this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizerVisible) {
            return;
        }
        let left: number = page.boundingRectangle.x;
        let right: number = page.boundingRectangle.width * this.viewer.zoomFactor + left;
        if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible) {
            // tslint:disable-next-line:max-line-length
            if (this.isEmpty && (!this.owner.isReadOnlyMode || this.owner.enableCursorOnReadOnly)) {
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
                    if (!this.viewer.isComposingIME) {
                        this.caret.style.display = 'none';
                    }
                }
            }
        }
        if (!isNullOrUndefined(this) && this.viewer.isTouchInput && !this.owner.isReadOnlyMode) {
            let caretStartLeft: number = parseInt(this.viewer.touchStart.style.left.replace('px', ''), 10) + 14;
            let caretEndLeft: number = parseInt(this.viewer.touchEnd.style.left.replace('px', ''), 10) + 14;
            let page: Page = this.getSelectionPage(this.start);
            if (page) {
                if (caretEndLeft < left || caretEndLeft > right) {
                    this.viewer.touchEnd.style.display = 'none';
                } else {
                    this.viewer.touchEnd.style.display = 'block';
                }
                if (!this.isEmpty) {
                    left = page.boundingRectangle.x;
                    right = page.boundingRectangle.width * this.viewer.zoomFactor + left;
                }
                if (caretStartLeft < left || caretStartLeft > right) {
                    this.viewer.touchStart.style.display = 'none';
                } else {
                    this.viewer.touchStart.style.display = 'block';
                }
            }
        } else {
            this.viewer.touchStart.style.display = 'none';
            this.viewer.touchEnd.style.display = 'none';
        }
    }
    /**
     * To set the editable div caret position
     * @private
     */
    public setEditableDivCaretPosition(index: number): void {
        this.viewer.editableDiv.focus();
        let child: Node = this.viewer.editableDiv.childNodes[this.viewer.editableDiv.childNodes.length - 1];
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
        this.caret.style.display = 'none';
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
        this.viewer.viewerContainer.appendChild(this.caret);
    }
    /**
     * Updates caret position.
     * @private
     */
    public updateCaretPosition(): void {
        let caretPosition: Point = this.end.location;
        let page: Page = this.getSelectionPage(this.end);
        if (page) {
            this.caret.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.viewer.zoomFactor) + 'px';
            let caretInfo: CaretHeightInfo = this.updateCaretSize(this.owner.selection.end);
            let topMargin: number = caretInfo.topMargin;
            let caretHeight: number = caretInfo.height;
            let viewer: LayoutViewer = this.viewer;
            // tslint:disable-next-line:max-line-length
            let pageTop: number = (page.boundingRectangle.y - (viewer as PageLayoutViewer).pageGap * (this.viewer.pages.indexOf(page) + 1)) * this.viewer.zoomFactor + (viewer as PageLayoutViewer).pageGap * (this.viewer.pages.indexOf(page) + 1);
            this.caret.style.top = pageTop + (Math.round(caretPosition.y + topMargin) * this.viewer.zoomFactor) + 'px';
            if (this.owner.selection.characterFormat.baselineAlignment === 'Subscript') {
                this.caret.style.top = parseFloat(this.caret.style.top) + (parseFloat(this.caret.style.height) / 2) + 'px';
            }
            if (this.viewer.isTouchInput || this.viewer.touchStart.style.display !== 'none') {
                // tslint:disable-next-line:max-line-length
                this.viewer.touchStart.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.viewer.zoomFactor - 14) + 'px';
                this.viewer.touchStart.style.top = pageTop + ((caretPosition.y + caretInfo.height) * this.viewer.zoomFactor) + 'px';
                // tslint:disable-next-line:max-line-length
                this.viewer.touchEnd.style.left = page.boundingRectangle.x + (Math.round(caretPosition.x) * this.viewer.zoomFactor - 14) + 'px';
                this.viewer.touchEnd.style.top = pageTop + ((caretPosition.y + caretInfo.height) * this.viewer.zoomFactor) + 'px';
            }
        }
    }
    /**
     * @private
     */
    public getRect(position: TextPosition): Point {
        let caretPosition: Point = position.location;
        let page: Page = this.getSelectionPage(position);
        if (page) {
            let viewer: PageLayoutViewer = this.viewer as PageLayoutViewer;
            let left: number = page.boundingRectangle.x + (Math.round(caretPosition.x) * viewer.zoomFactor);
            let pageGap: number = viewer.pageGap;
            // tslint:disable-next-line:max-line-length
            let pageTop: number = (page.boundingRectangle.y - pageGap * (page.index + 1)) * viewer.zoomFactor + pageGap * (page.index + 1);

            let top: number = pageTop + (Math.round(caretPosition.y) * viewer.zoomFactor);

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
                this.caret.style.height = caretHeight * this.viewer.zoomFactor + 'px';
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
                    this.caret.style.height = caret.height * this.viewer.zoomFactor + 'px';
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
            this.viewer.selectionEndPage = endPage;
            if (this.owner.selection.isEmpty) {
                this.viewer.selectionStartPage = endPage;
            } else {
                // tslint:disable-next-line:max-line-length
                let startLineWidget: LineWidget = this.getLineWidgetParagraph(startPosition.offset, startPosition.paragraph.childWidgets[0] as LineWidget);
                //Gets start page.
                let startPage: Page = this.getPage(startLineWidget.paragraph);
                if (!isNullOrUndefined(startPage)) {
                    this.viewer.selectionStartPage = startPage;
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
                bottom -= HelperMethods.convertPointToPixel(textPosition.paragraph.paragraphFormat.afterSpacing);
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
            this.viewer.isControlPressed = true;
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
                    this.viewer.viewerContainer.scrollTop -= this.viewer.visibleBounds.height;
                    break;
                case 34:
                    event.preventDefault();
                    this.viewer.viewerContainer.scrollTop += this.viewer.visibleBounds.height;
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
        let page: Page = this.viewer.currentPage;
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
            this.viewer.updateTextPositionForSelection(pagePoint, 1);
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInsidePageRect(point: Point, page: Page): boolean {
        if ((this.viewer.containerLeft + point.x) >= page.boundingRectangle.x &&
            (this.viewer.containerLeft + point.x) <= (page.boundingRectangle.x + (page.boundingRectangle.width * this.viewer.zoomFactor))) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInHeaderRegion(point: Point, page: Page): boolean {
        let pageTop: number = this.getPageTop(page);
        let headerHeight: number = 0;
        if (page.headerWidget) {
            headerHeight = (page.headerWidget.y + page.headerWidget.height);
        }
        let height: number = Math.max(headerHeight, HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin))
            * this.viewer.zoomFactor;
        if ((this.viewer.containerTop + point.y) >= pageTop && (this.viewer.containerTop + point.y) <= pageTop + height) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public isCursorInFooterRegion(point: Point, page: Page): boolean {
        let pageRect: Rect = page.boundingRectangle;
        let pageTop: number = this.getPageTop(page);
        let pageBottom: number = pageTop + (pageRect.height * this.viewer.zoomFactor);
        let footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
        let footerHeight: number = 0;
        if (page.footerWidget) {
            footerHeight = page.footerWidget.height;
        }
        // tslint:disable-next-line:max-line-length
        let height: number = (pageRect.height -
            Math.max(footerHeight + footerDistance, HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.bottomMargin))) * this.viewer.zoomFactor;
        if ((this.viewer.containerTop + point.y) <= pageBottom && (this.viewer.containerTop + point.y) >= pageTop + height) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
    public enableHeadersFootersRegion(widget: HeaderFooterWidget): boolean {
        this.owner.enableHeaderAndFooter = true;
        this.updateTextPositionForBlockContainer(widget);
        return true;
    }
    /**
     * @private
     */
    public updateTextPositionForBlockContainer(widget: BlockContainer): void {
        let block: BlockWidget = widget.firstChild as BlockWidget;
        if (block instanceof TableWidget) {
            block = this.getFirstBlockInFirstCell(block);
        }
        this.selectParagraph(block as ParagraphWidget, true);
    }
    /**
     * Disable Header footer
     * @private
     */
    public disableHeaderFooter(): void {
        let page: Page = this.getPage(this.start.paragraph);
        this.updateTextPositionForBlockContainer(page.bodyWidgets[0]);
        this.owner.enableHeaderAndFooter = false;
    }
    //#endregion
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.contextTypeInternal)) {
            this.contextTypeInternal = undefined;
        }
        this.caret = undefined;
        this.contextTypeInternal = undefined;
        this.upDownSelectionLength = undefined;
        this.viewer = undefined;
        this.owner = undefined;
    }
    /**
     * Navigates to the specified bookmark.
     * @param name
     * @param moveToStart
     * @private
     */
    public navigateBookmark(name: string, moveToStart?: boolean): void {
        let bookmarks: Dictionary<string, BookmarkElementBox> = this.viewer.bookmarks;
        if (bookmarks.containsKey(name)) {
            //bookmark start element
            let bookmrkElmnt: BookmarkElementBox = bookmarks.get(name);
            let offset: number = bookmrkElmnt.line.getOffset(bookmrkElmnt, 1);
            let startPosition: TextPosition = new TextPosition(this.viewer.owner);
            startPosition.setPositionParagraph(bookmrkElmnt.line, offset);
            if (moveToStart) {
                this.viewer.selection.selectRange(startPosition, startPosition);
            } else {
                //bookmark end element
                let bookmrkEnd: BookmarkElementBox = bookmrkElmnt.reference;
                let endoffset: number = bookmrkEnd.line.getOffset(bookmrkEnd, 0);
                let endPosition: TextPosition = new TextPosition(this.viewer.owner);
                endPosition.setPositionParagraph(bookmrkEnd.line, endoffset);
                //selects the bookmark range
                this.viewer.selection.selectRange(startPosition, endPosition);
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