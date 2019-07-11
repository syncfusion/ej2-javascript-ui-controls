import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat, WParagraphFormat } from '../index';
import { WCellFormat } from '../index';
import { WBorder } from '../index';
import { WBorders } from '../index';
import {
    Page, Rect, Widget, ImageElementBox, LineWidget, ParagraphWidget,
    BodyWidget, TextElementBox, ElementBox, HeaderFooterWidget, ListTextElementBox,
    TableRowWidget, TableWidget, TableCellWidget, FieldElementBox, TabElementBox, BlockWidget, ErrorTextElementBox
} from './page';
import { BaselineAlignment, HighlightColor, Underline, Strikethrough, TabLeader } from '../../index';
import { Layout } from './layout';
import { LayoutViewer } from './viewer';
// tslint:disable-next-line:max-line-length
import { HelperMethods, ErrorInfo, Point, SpecialCharacterInfo, SpaceCharacterInfo } from '../editor/editor-helper';
import { SearchWidgetInfo } from '../index';
import { SelectionWidgetInfo } from '../selection';
import { SpellChecker } from '../spell-check/spell-checker';

/** 
 * @private
 */
export class Renderer {
    public isPrinting: boolean = false;
    private pageLeft: number = 0;
    private pageTop: number = 0;
    private viewer: LayoutViewer;
    private pageIndex: number = -1;
    private pageCanvasIn: HTMLCanvasElement;
    private isFieldCode: boolean = false;
    private leftPosition: number = 0;
    private topPosition: number = 0;
    /**
     * Gets page canvas.
     * @private    
     */
    get pageCanvas(): HTMLCanvasElement {
        if (this.isPrinting) {
            if (isNullOrUndefined(this.pageCanvasIn)) {
                this.pageCanvasIn = document.createElement('canvas');
                this.pageCanvasIn.getContext('2d').save();
            }
            return this.pageCanvasIn;
        }
        return isNullOrUndefined(this.viewer) ? undefined : this.viewer.containerCanvas;
    }
    /**
     * Gets the spell checker
     * @private
     */
    get spellChecker(): SpellChecker {
        return this.viewer.owner.spellChecker;
    }
    /**
     * Gets selection canvas.
     */
    private get selectionCanvas(): HTMLCanvasElement {
        return isNullOrUndefined(this.viewer) ? undefined : this.viewer.selectionCanvas;
    }
    /**
     * Gets page context.
     */
    private get pageContext(): CanvasRenderingContext2D {
        return this.pageCanvas.getContext('2d');
    }
    /**
     * Gets selection context.
     */
    private get selectionContext(): CanvasRenderingContext2D {
        return this.selectionCanvas.getContext('2d');
    }

    constructor(viewer: LayoutViewer) {
        this.viewer = viewer;
    }
    /**
     * Gets the color.
     * @private
     */
    public getColor(color: string): string {
        if (color.length > 0) {
            if (color[0] === '#') {
                if (color.length > 7) {
                    return color.substr(0, 7);
                }
            }
        }
        return color;
    }
    /**
     * Renders widgets.
     * @param {Page} page 
     * @param {number} left 
     * @param {number} top 
     * @param {number} width 
     * @param {number} height 
     * @private
     */
    public renderWidgets(page: Page, left: number, top: number, width: number, height: number): void {
        if (isNullOrUndefined(this.pageCanvas) || isNullOrUndefined(page)) {
            return;
        }
        this.pageContext.fillStyle = this.getColor(this.viewer.backgroundColor);
        this.pageContext.beginPath();
        this.pageContext.fillRect(left, top, width, height);
        this.pageContext.closePath();
        this.pageContext.strokeStyle = this.viewer.owner.pageOutline;
        this.pageContext.strokeRect(left, top, width, height);
        this.pageLeft = left;
        this.pageTop = top;
        this.pageIndex = page.index;
        if (this.isPrinting) {
            this.setPageSize(page);
        } else {
            this.pageContext.beginPath();
            this.pageContext.save();
            this.pageContext.rect(left, top, width, height);
            this.pageContext.clip();
        }
        if (page.headerWidget) {
            this.renderHFWidgets(page, page.headerWidget, width, true);
        }
        if (page.footerWidget) {
            this.renderHFWidgets(page, page.footerWidget, width, false);
        }
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            this.render(page, page.bodyWidgets[i]);
        }
        if (this.viewer.owner.enableHeaderAndFooter && !this.isPrinting) {
            this.renderHeaderSeparator(page, this.pageLeft, this.pageTop, page.headerWidget);
        }
        this.pageLeft = 0;
        this.pageTop = 0;
        this.pageContext.restore();
    }
    /**
     * Sets page size.
     * @param {Page} page 
     */
    private setPageSize(page: Page): void {
        this.pageContext.clearRect(0, 0, this.pageCanvas.width, this.pageCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

        this.pageContext.restore();
        this.selectionContext.restore();
        let width: number = page.boundingRectangle.width;
        let height: number = page.boundingRectangle.height;
        let dpr: number = Math.max(1, window.devicePixelRatio || 1);
        if (this.pageCanvas.width !== width * dpr || this.pageCanvas.height !== height * dpr) {
            this.pageCanvas.height = height * dpr;
            this.pageCanvas.width = width * dpr;
            this.pageCanvas.style.height = height + 'px';
            this.pageCanvas.style.width = width + 'px';
            this.pageContext.globalAlpha = 1;
            this.pageContext.scale(dpr, dpr);
        }
    }
    /**
     * Renders header footer widget.
     * @param {Page} page 
     * @param {HeaderFooterWidget} headFootWidget 
     */
    private renderHFWidgets(page: Page, widget: HeaderFooterWidget, width: number, isHeader: boolean): void {
        this.pageContext.globalAlpha = this.viewer.owner.enableHeaderAndFooter ? 1 : 0.65;
        let cliped: boolean = false;
        if (isHeader) {
            let topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
            let widgetHeight: number = Math.max((widget.y + widget.height), topMargin);
            let headerFooterHeight: number = page.boundingRectangle.height / 100 * 40;
            if (widgetHeight > headerFooterHeight) {
                cliped = true;
                this.pageContext.beginPath();
                this.pageContext.save();
                this.pageContext.rect(this.pageLeft, this.pageTop, width, this.getScaledValue(headerFooterHeight));
                this.pageContext.clip();
            }
        }
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            let block: BlockWidget = widget.childWidgets[i] as BlockWidget;
            this.renderWidget(page, block);
        }
        if (cliped) {
            this.pageContext.restore();
        }
        this.pageContext.globalAlpha = this.viewer.owner.enableHeaderAndFooter ? 0.65 : 1;
    }
    private renderHeaderSeparator(page: Page, left: number, top: number, widget: HeaderFooterWidget): void {
        //Header Widget
        let topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
        let y: number = this.getScaledValue(Math.max((widget.y + widget.height), topMargin));
        let pageWidth: number = this.getScaledValue(page.boundingRectangle.width);
        let ctx: CanvasRenderingContext2D = this.pageContext;
        ctx.save();
        ctx.globalAlpha = 0.65;
        let headerFooterHeight: number = (this.getScaledValue(page.boundingRectangle.height) / 100) * 40;
        //Maximum header height limit       
        y = Math.min(y, headerFooterHeight);
        //Dash line Separator
        this.renderDashLine(ctx, left, top + y, pageWidth, '#000000', false);
        let type: string = this.getHeaderFooterType(page, true);
        ctx.font = '9pt Arial';
        let width: number = ctx.measureText(type).width;
        this.renderHeaderFooterMark(ctx, left + 5, top + y, width + 10, 20);
        this.renderHeaderFooterMarkText(ctx, type, left + 10, y + top + 15);
        if (page.footerWidget) {
            //Footer Widget
            let footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
            // tslint:disable-next-line:max-line-length
            let footerHeight: number = this.getScaledValue(page.boundingRectangle.height) -
                this.getScaledValue(Math.max(page.footerWidget.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidget.sectionFormat.bottomMargin)));
            //Maximum footer height limit     
            footerHeight = Math.max((this.getScaledValue(page.boundingRectangle.height) - headerFooterHeight), footerHeight);
            this.renderDashLine(ctx, left, top + footerHeight, pageWidth, '#000000', false);
            type = this.getHeaderFooterType(page, false);
            width = ctx.measureText(type).width;
            this.renderHeaderFooterMark(ctx, left + 5, top + footerHeight - 20, width + 10, 20);
            this.renderHeaderFooterMarkText(ctx, type, left + 10, top + footerHeight - 5);
            ctx.restore();
        }
    }
    private getHeaderFooterType(page: Page, isHeader: boolean): string {
        let type: string;
        type = isHeader ? 'Header' : 'Footer';
        if (page.bodyWidgets[0].sectionFormat.differentFirstPage &&
            (isNullOrUndefined(page.previousPage) || page.sectionIndex !== page.previousPage.sectionIndex)) {
            type = isHeader ? 'First Page Header' : 'First Page Footer';
        } else if (page.bodyWidgets[0].sectionFormat.differentOddAndEvenPages) {
            if ((this.viewer.pages.indexOf(page) + 1) % 2 === 0) {
                type = isHeader ? 'Even Page Header' : 'Even Page Footer';
            } else {
                type = isHeader ? 'Odd Page Header' : 'Odd Page Footer';
            }
        }
        return type;
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public renderDashLine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, fillStyle: string, isSmallDash: boolean): void {
        ctx.beginPath();
        ctx.strokeStyle = fillStyle;
        ctx.lineWidth = 1;
        if (isSmallDash) {
            ctx.setLineDash([3, 2]);
        } else {
            ctx.setLineDash([6, 4]);
        }
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();
    }
    private renderHeaderFooterMark(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
        ctx.beginPath();
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }
    private renderHeaderFooterMarkText(ctx: CanvasRenderingContext2D, content: string, x: number, y: number): void {
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(content, x, y);
        ctx.closePath();
    }
    /**
     * Renders body widget.
     * @param {Page} page
     * @param {BodyWidget} bodyWidget
     */
    private render(page: Page, bodyWidget: BodyWidget): void {
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            let widget: Widget = bodyWidget.childWidgets[i] as ParagraphWidget;
            if (i === 0 && bodyWidget.childWidgets[0] instanceof TableWidget && page.repeatHeaderRowTableWidget) {
                // tslint:disable-next-line:max-line-length
                this.renderHeader(page, widget as TableWidget, this.viewer.layout.getHeader(bodyWidget.childWidgets[0] as TableWidget));
            }
            this.renderWidget(page, widget);
        }
    }
    /**
     * Renders block widget.
     * @param {Page} page 
     * @param {Widget} widget 
     */
    private renderWidget(page: Page, widget: Widget): void {
        if (widget instanceof ParagraphWidget) {
            this.renderParagraphWidget(page, widget as ParagraphWidget);
        } else {
            this.renderTableWidget(page, widget as TableWidget);
        }
    }
    /**
     * Renders header.
     * @param {Page} page 
     * @param {TableWidget} widget 
     * @param {WRow} header 
     * @private
     */
    public renderHeader(page: Page, widget: TableWidget, header: TableRowWidget): void {
        if (isNullOrUndefined(header)) {
            return;
        }
        //Updated client area for current page
        page.viewer.updateClientArea(page.bodyWidgets[0].sectionFormat, page);
        let top: number = page.viewer.clientArea.y;
        let parentTable: TableWidget = header.ownerTable.getSplitWidgets()[0] as TableWidget;
        for (let i: number = 0; i <= header.rowIndex; i++) {
            if (parentTable.childWidgets.length === 0) {
                return;
            }
            let row: TableRowWidget = (parentTable.childWidgets[i] as TableRowWidget);
            let headerWidget: TableRowWidget = row.clone();
            headerWidget.containerWidget = row.containerWidget;
            // tslint:disable-next-line:max-line-length
            page.viewer.updateClientAreaLocation(headerWidget, new Rect(page.viewer.clientArea.x, top, headerWidget.width, headerWidget.height));
            page.viewer.layout.updateChildLocationForRow(top, headerWidget);
            let cell: TableCellWidget = undefined;
            //Renders table cell outline rectangle - Border and background color.
            for (let j: number = 0; j < headerWidget.childWidgets.length; j++) {
                cell = headerWidget.childWidgets[j] as TableCellWidget;
                this.renderTableCellWidget(page, cell);
            }
            top += headerWidget.height;
        }
        if (widget.y !== top) {
            //this.Location.Y = top;
            page.viewer.layout.updateChildLocationForTable(top, widget);
        }
    }

    /**
     * Renders paragraph widget.
     * @param {Page} page
     * @param {ParagraphWidget} paraWidget
     */
    private renderParagraphWidget(page: Page, paraWidget: ParagraphWidget): void {
        let top: number = paraWidget.y;
        let left: number = paraWidget.x;
        for (let i: number = 0; i < paraWidget.childWidgets.length; i++) {
            let widget: LineWidget = paraWidget.childWidgets[i] as LineWidget;
            this.renderLine(widget, page, left, top);
            top += widget.height;
        }
    }
    /**
     * Renders table widget.
     * @param {Page} page 
     * @param {TableWidget} tableWidget 
     */
    private renderTableWidget(page: Page, tableWidget: TableWidget): void {
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let widget: Widget = tableWidget.childWidgets[i] as Widget;
            this.renderTableRowWidget(page, widget);

            if (tableWidget.tableFormat.cellSpacing > 0) {
                this.renderTableOutline(tableWidget);
            }
        }
    }
    /**
     * Renders table row widget.
     * @param {Page} page 
     * @param {Widget} rowWidget 
     */
    private renderTableRowWidget(page: Page, rowWidget: Widget): void {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let widget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            this.renderTableCellWidget(page, widget);
        }
    }
    /**
     * Renders table cell widget.
     * @param {Page} page 
     * @param {TableCellWidget} cellWidget 
     */
    private renderTableCellWidget(page: Page, cellWidget: TableCellWidget): void {
        if (!this.isPrinting) {
            if (this.getScaledValue(cellWidget.y, 2) + cellWidget.height * this.viewer.zoomFactor < 0 ||
                this.getScaledValue(cellWidget.y, 2) > this.viewer.visibleBounds.height) {
                return;
            }
        }
        let widgetHeight: number = 0;
        if (!this.isPrinting && page.viewer.owner.selection && page.viewer.owner.selection.selectedWidgets.length > 0) {
            page.viewer.owner.selection.addSelectionHighlightTable(this.selectionContext, cellWidget);
        }
        this.renderTableCellOutline(page.viewer, cellWidget);
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            let widget: Widget = cellWidget.childWidgets[i] as Widget;
            let width: number = cellWidget.width + cellWidget.margin.left - cellWidget.leftBorderWidth;
            this.clipRect(cellWidget.x, cellWidget.y, this.getScaledValue(width), this.getScaledValue(cellWidget.height));
            this.renderWidget(page, widget);
            this.pageContext.restore();
        }
    }
    /**
     * Renders line widget.
     * @param {LineWidget} lineWidget
     * @param {Page} page 
     * @param {number} left 
     * @param {number} top 
     */
    private renderLine(lineWidget: LineWidget, page: Page, left: number, top: number): void {
        // tslint:disable-next-line:max-line-length
        if (!this.isPrinting && page.viewer.owner.selection && !this.viewer.isScrollToSpellCheck && page.viewer.owner.selection.selectedWidgets.length > 0) {
            page.viewer.owner.selection.addSelectionHighlight(this.selectionContext, lineWidget, top);
        }

        let paraFormat: WParagraphFormat = lineWidget.paragraph.paragraphFormat;
        if (lineWidget.isFirstLine() && !paraFormat.bidi) {
            left += HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        if (this.viewer.owner.searchModule) {
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(page.viewer.owner.searchModule.searchHighlighters) && page.viewer.owner.searchModule.searchHighlighters.containsKey(lineWidget)) {
                let widgetInfo: SearchWidgetInfo[] = page.viewer.owner.searchModule.searchHighlighters.get(lineWidget);
                for (let i: number = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = '#ffe97f';
                    // tslint:disable-next-line:max-line-length
                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
                }
            }
        }
        // EditRegion highlight 
        if (page.viewer.selection && !isNullOrUndefined(page.viewer.selection.editRegionHighlighters)
            && page.viewer.selection.editRegionHighlighters.containsKey(lineWidget)) {
            let widgetInfo: SelectionWidgetInfo[] = page.viewer.selection.editRegionHighlighters.get(lineWidget);
            for (let i: number = 0; i < widgetInfo.length; i++) {
                this.pageContext.fillStyle = widgetInfo[i].color !== '' ? widgetInfo[i].color : '#add8e6';
                // tslint:disable-next-line:max-line-length
                this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
            }
        }

        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let elementBox: ElementBox = lineWidget.children[i] as ElementBox;

            if (elementBox instanceof FieldElementBox || this.isFieldCode ||
                (elementBox.width === 0 && elementBox.height === 0)) {
                if (this.isFieldCode) {
                    elementBox.width = 0;
                }
                left += elementBox.width + elementBox.margin.left;
                this.toSkipFieldCode(elementBox);
                continue;
            }
            let underlineY: number = this.getUnderlineYPosition(lineWidget);
            if (!this.isPrinting) {
                if (this.getScaledValue(top + elementBox.margin.top, 2) + elementBox.height * this.viewer.zoomFactor < 0 ||
                    this.getScaledValue(top + elementBox.margin.top, 2) > this.viewer.visibleBounds.height) {
                    left += elementBox.width + elementBox.margin.left;
                    if (elementBox instanceof TextElementBox) {
                        elementBox.canTrigger = true;
                        elementBox.isVisible = false;
                        if (!elementBox.isSpellChecked) {
                            elementBox.ischangeDetected = true;
                        }
                    }
                    continue;
                }

            }
            if (elementBox instanceof ListTextElementBox) {
                this.renderListTextElementBox(elementBox, left, top, underlineY);
            } else if (elementBox instanceof ImageElementBox) {
                this.renderImageElementBox(elementBox, left, top, underlineY);
            } else {
                elementBox.isVisible = true;
                this.renderTextElementBox(elementBox as TextElementBox, left, top, underlineY);
            }
            left += elementBox.width + elementBox.margin.left;
        }
    }



    private toSkipFieldCode(element: ElementBox): void {
        if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                if ((!isNullOrUndefined(element.fieldEnd) || element.hasFieldEnd)) {
                    this.isFieldCode = true;
                }
            } else if (element.fieldType === 2 || element.fieldType === 1) {
                this.isFieldCode = false;
            }
        }
    }
    /**
     * Gets underline y position.
     * @param {LineWidget} lineWidget
     * @private 
     */
    public getUnderlineYPosition(lineWidget: LineWidget): number {
        let height: number = 0;
        let lineHeight: number = 0;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof FieldElementBox ||
                (lineWidget.children[i].width === 0 && lineWidget.children[i].height === 0)) {
                continue;
            }
            if (height < lineWidget.children[i].height + lineWidget.children[i].margin.top) {
                height = lineWidget.children[i].margin.top + lineWidget.children[i].height;
                lineHeight = lineWidget.children[i].height / 20;
            }
        }
        return height - 2 * lineHeight;
    }
    /**
     * Renders list element box
     * @param {ListTextElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     */
    private renderListTextElementBox(elementBox: ListTextElementBox, left: number, top: number, underlineY: number): void {
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        let format: WCharacterFormat = elementBox.listLevel.characterFormat;
        let breakCharacterFormat: WCharacterFormat = elementBox.line.paragraph.characterFormat;
        let color: string = format.fontColor === '#000000' ? breakCharacterFormat.fontColor : format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontFamily: string = format.fontFamily === 'Verdana' ? breakCharacterFormat.fontFamily : format.fontFamily;
        let fontSize: number = format.fontSize === 11 ? breakCharacterFormat.fontSize : format.fontSize;
        // tslint:disable-next-line:max-line-length
        let baselineAlignment: BaselineAlignment = format.baselineAlignment === 'Normal' ? breakCharacterFormat.baselineAlignment : format.baselineAlignment;
        bold = format.bold ? 'bold' : breakCharacterFormat.bold ? 'bold' : '';
        italic = format.italic ? 'italic' : breakCharacterFormat.italic ? 'italic' : '';
        fontSize = fontSize === 0 ? 0.5 : fontSize / (baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.viewer.zoomFactor;
        let strikethrough: Strikethrough = format.strikethrough === 'None' ? breakCharacterFormat.strikethrough : format.strikethrough;
        let highlightColor: HighlightColor = format.highlightColor === 'NoColor' ? breakCharacterFormat.highlightColor :
            format.highlightColor;
        if (highlightColor !== 'NoColor') {
            if (highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(highlightColor);
            } else {
                this.pageContext.fillStyle = this.getColor(highlightColor);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + fontFamily;
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        let baselineOffset: number = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        let text: string = elementBox.text;
        let followCharacter: boolean = text === '\t' || text === ' ';
        if (!followCharacter && (format.bidi || elementBox.line.paragraph.paragraphFormat.bidi)) {
            this.pageCanvas.setAttribute('dir', 'rtl');
        }
        this.pageContext.fillStyle = this.getColor(color);
        // tslint:disable-next-line:max-line-length
        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));

        if (format.underline !== 'None' && !isNullOrUndefined(format.underline)) {
            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, baselineAlignment);
        }
        if (strikethrough !== 'None') {
            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, baselineAlignment);
        }
        this.pageCanvas.setAttribute('dir', 'ltr');
    }
    /**
     * Renders text element box.
     * @param {TextElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     */
    // tslint:disable-next-line:max-line-length
    private renderTextElementBox(elementBox: TextElementBox, left: number, top: number, underlineY: number): void {
        let isHeightType: boolean = false;
        let containerWidget: Widget = elementBox.line.paragraph.containerWidget;
        if (containerWidget instanceof TableCellWidget) {
            isHeightType = ((containerWidget as TableCellWidget).ownerRow.rowFormat.heightType === 'Exactly');
        }
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        if (isHeightType) {
            // tslint:disable-next-line:max-line-length
            this.clipRect(containerWidget.x, containerWidget.y, this.getScaledValue(containerWidget.width), this.getScaledValue(containerWidget.height));
        }
        let format: WCharacterFormat = elementBox.characterFormat;
        if (format.highlightColor !== 'NoColor') {
            if (format.highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(format.highlightColor);
            } else {
                this.pageContext.fillStyle = this.getColor(format.highlightColor);
            }
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        let color: string = format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontSize: number = 11;
        bold = format.bold ? 'bold' : '';
        italic = format.italic ? 'italic' : '';
        fontSize = format.fontSize === 0 ? 0.5 : format.fontSize / (format.baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.viewer.zoomFactor;
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + format.fontFamily;
        if (format.baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        let baselineOffset: number = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        this.pageContext.fillStyle = this.getColor(color);

        let scaledWidth: number = this.getScaledValue(elementBox.width);
        let text: string = elementBox.text;
        if (elementBox instanceof TabElementBox) {
            let tabElement: TabElementBox = elementBox as TabElementBox;
            if (tabElement.tabText === '' && !isNullOrUndefined(tabElement.tabLeader) && tabElement.tabLeader !== 'None') {
                text = this.getTabLeader(elementBox);
                tabElement.tabText = text;
            } else if (tabElement.tabText !== '') {
                text = tabElement.tabText;
            }
        }
        let isRTL: boolean = format.bidi || this.viewer.textHelper.isRTLText(elementBox.text);
        text = this.viewer.textHelper.setText(text, isRTL, format.bdo, true);
        // tslint:disable-next-line:max-line-length
        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), scaledWidth);
        // tslint:disable-next-line:max-line-length
        if ((this.viewer.owner.enableSpellCheck && !this.spellChecker.removeUnderline) && (this.viewer.triggerSpellCheck || elementBox.canTrigger) && elementBox.text !== ' ' && !this.viewer.isScrollHandler && (isNullOrUndefined(elementBox.previousNode) || !(elementBox.previousNode instanceof FieldElementBox))) {
            elementBox.canTrigger = true;
            this.leftPosition = this.pageLeft;
            this.topPosition = this.pageTop;
            let errorDetails: ErrorInfo = this.spellChecker.checktextElementHasErrors(elementBox.text, elementBox, left);
            if (errorDetails.errorFound) {
                color = '#FF0000';
                for (let i: number = 0; i < errorDetails.elements.length; i++) {
                    let currentElement: ErrorTextElementBox = errorDetails.elements[i];
                    // tslint:disable-next-line:max-line-length
                    if (elementBox.ignoreOnceItems.indexOf(this.spellChecker.manageSpecialCharacters(currentElement.text, undefined, true)) === -1) {
                        // tslint:disable-next-line:max-line-length
                        let backgroundColor: string = (containerWidget instanceof TableCellWidget) ? (containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.viewer.backgroundColor;
                        // tslint:disable-next-line:max-line-length
                        this.renderWavyline(currentElement, (isNullOrUndefined(currentElement.start)) ? left : currentElement.start.location.x, (isNullOrUndefined(currentElement.start)) ? top : currentElement.start.location.y, underlineY, color, 'Single', format.baselineAlignment, backgroundColor);
                    }
                }
            } else if (elementBox.ischangeDetected || this.viewer.triggerElementsOnLoading) {
                elementBox.ischangeDetected = false;
                this.handleChangeDetectedElements(elementBox, underlineY, left, top, format.baselineAlignment);
            }
        }
        if (format.underline !== 'None' && !isNullOrUndefined(format.underline)) {
            // tslint:disable-next-line:max-line-length
            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, format.baselineAlignment);
        }
        if (format.strikethrough !== 'None' && !isNullOrUndefined(format.strikethrough)) {
            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, format.baselineAlignment);
        }
        if (isHeightType) {
            this.pageContext.restore();
        }
    }

    /**
     * Method to handle spell check for modified or newly added elements
     * @param {TextElementBox} elementBox 
     * @param {number} underlineY 
     * @param {number} left 
     * @param {number} top 
     * @param {number} baselineAlignment 
     */
    // tslint:disable-next-line:max-line-length
    private handleChangeDetectedElements(elementBox: TextElementBox, underlineY: number, left: number, top: number, baselineAlignment: BaselineAlignment): void {
        let checkText: string = elementBox.text.trim();
        let beforeIndex: number = this.pageIndex;
        if (!this.spellChecker.checkElementCanBeCombined(elementBox, underlineY, beforeIndex, true)) {
            /* tslint:disable:no-any */
            let splittedText: any[] = checkText.split(/[\s]+/);
            let markindex: number = elementBox.line.getOffset(elementBox, 0);
            let spaceValue: number = 1;
            if (splittedText.length > 1) {
                for (let i: number = 0; i < splittedText.length; i++) {
                    let currentText: string = splittedText[i];
                    let retrievedText: string = this.spellChecker.manageSpecialCharacters(currentText, undefined, true);
                    // tslint:disable-next-line:max-line-length
                    if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                        this.handleUnorderdElements(retrievedText, elementBox, underlineY, i, markindex, i === splittedText.length - 1, beforeIndex);
                        markindex += currentText.length + spaceValue;
                    }
                }
            } else {
                let retrievedText: string = this.spellChecker.manageSpecialCharacters(checkText, undefined, true);
                // tslint:disable-next-line:max-line-length
                if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                    let indexInLine: number = elementBox.indexInOwner;
                    let indexinParagraph: number = elementBox.line.paragraph.indexInOwner;
                    /* tslint:disable:no-any */
                    // tslint:disable-next-line:max-line-length
                    this.spellChecker.CallSpellChecker(this.spellChecker.languageID, checkText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
                        /* tslint:disable:no-any */
                        let jsonObject: any = JSON.parse(data);
                        // tslint:disable-next-line:max-line-length
                        let canUpdate: boolean = (beforeIndex === this.pageIndex || elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);
                        // tslint:disable-next-line:max-line-length
                        this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, canUpdate);
                    });
                }
            }
        }
    }

    /**
     * Method to handle spell check combine and splitted text elements
     * @param {string} currentText 
     * @param {TextElementBox} elementBox 
     * @param {number} underlineY 
     * @param {number} iteration 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public handleUnorderdElements(currentText: string, elementBox: TextElementBox, underlineY: number, iteration: number, markindex: number, isLastItem?: boolean, beforeIndex?: number): void {
        let indexInLine: number = elementBox.indexInOwner;
        let indexinParagraph: number = elementBox.line.paragraph.indexInOwner;
        /* tslint:disable:no-any */
        // tslint:disable-next-line:max-line-length
        this.spellChecker.CallSpellChecker(this.spellChecker.languageID, currentText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
            /* tslint:disable:no-any */
            let jsonObject: any = JSON.parse(data);
            // tslint:disable-next-line:max-line-length
            let canUpdate: boolean = (elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);
            // tslint:disable-next-line:max-line-length
            this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, canUpdate, underlineY, iteration, markindex, isLastItem);
        });
    }

    /** 
     * Render Wavy Line
     * @param {ElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     * @param {string} color 
     * @param {Underline} underline 
     * @param {BaselineAlignment} baselineAlignment 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public renderWavyline(elementBox: TextElementBox, left: number, top: number, underlineY: number, color: string, underline: Underline, baselineAlignment: BaselineAlignment, backgroundColor?: string): void {
        if (elementBox.text.length > 1) {
            let renderedHeight: number = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
            let topMargin: number = elementBox.margin.top;
            let underlineHeight: number = renderedHeight / 20;
            const frequencyRange: number = 0.5;
            const amplitudeRange: number = 1.0;
            const stepToCover: number = .7;
            let y: number = 0;
            if (baselineAlignment === 'Subscript' || elementBox instanceof ListTextElementBox) {
                y = (renderedHeight - 2 * underlineHeight) + top;
                topMargin += elementBox.height - renderedHeight;
                y += topMargin > 0 ? topMargin : 0;
            } else {
                y = underlineY + top;
            }
            // tslint:disable-next-line:max-line-length
            let specialCharacter: SpecialCharacterInfo = this.spellChecker.getSpecialCharactersInfo(elementBox.text, elementBox.characterFormat);
            // tslint:disable-next-line:max-line-length
            let whiteSpaceData: SpaceCharacterInfo = this.spellChecker.getWhiteSpaceCharacterInfo(elementBox.text, elementBox.characterFormat);
            // tslint:disable-next-line:max-line-length
            let x: number = left + specialCharacter.beginningWidth + ((whiteSpaceData.isBeginning) ? whiteSpaceData.width : 0) + elementBox.margin.left;
            let x1: number = x * this.viewer.zoomFactor + this.leftPosition;
            let y1: number = y * this.viewer.zoomFactor + this.topPosition;
            // tslint:disable-next-line:max-line-length
            let x2: number = x1 + this.getScaledValue(elementBox.width - (specialCharacter.beginningWidth + specialCharacter.endWidth) - whiteSpaceData.width);
            let startingPoint: Point = new Point(x1, y1);
            let endingPoint: Point = new Point(x2, y1);
            // tslint:disable-next-line:max-line-length
            this.drawWavy(startingPoint, endingPoint, (x2 - x1) * frequencyRange, amplitudeRange, stepToCover, color, elementBox.height, backgroundColor);
        }
    }

    /**
     * Draw wavy line
     * @param {Point} from
     * @param {Point} to 
     * @param {Number} frequency 
     * @param {Number} amplitude 
     * @param {Number} step 
     * @param {string} color 
     * @param {Number} negative 
     * @private
     */
    // tslint:disable-next-line:max-line-length
    public drawWavy(from: Point, to: Point, frequency: number, amplitude: number, step: number, color: string, height: number, backColor: string, negative?: number): void {
        this.pageContext.save();
        this.pageContext.fillStyle = (!isNullOrUndefined(backColor) ? backColor : this.viewer.backgroundColor);
        this.pageContext.fillRect(from.x, from.y - amplitude, (to.x - from.x), amplitude * 3);
        this.pageContext.restore();
        this.pageContext.lineWidth = 1;
        this.pageContext.lineCap = 'round';
        this.pageContext.strokeStyle = color;
        this.pageContext.beginPath();
        //this.pageContext.save();
        let cx: number = 0;
        let cy: number = 0;
        let fx: number = from.x;
        let fy: number = from.y;
        let tx: number = to.x;
        let ty: number = to.y;
        let i: number = 0;
        let waveOffsetLength: number = 0;
        let ang: number = Math.atan2(ty - fy, tx - fx);
        let distance: number = Math.sqrt((fx - tx) * (fx - tx) + (fy - ty) * (fy - ty));
        let a: number = amplitude * 1;
        let f: number = Math.PI * frequency;

        for (i; i <= distance; i += step) {
            waveOffsetLength = Math.sin((i / distance) * f) * a;
            cx = from.x + Math.cos(ang) * i + Math.cos(ang - Math.PI / 2) * waveOffsetLength;
            cy = from.y + Math.sin(ang) * i + Math.sin(ang - Math.PI / 2) * waveOffsetLength;
            i > 0 ? this.pageContext.lineTo(cx, cy) : this.pageContext.moveTo(cx, cy);
        }
        this.pageContext.stroke();
        this.pageContext.restore();
    }

    /**
     * Returns tab leader
     */
    private getTabLeader(elementBox: TabElementBox): string {
        let textWidth: number = 0;
        let tabString: string = this.getTabLeaderString(elementBox.tabLeader);
        let tabText: string = tabString;
        textWidth = this.viewer.textHelper.getWidth(tabText, elementBox.characterFormat);
        let count: number = Math.floor(elementBox.width / textWidth);
        for (let i: number = 0; i <= count; i++) {
            tabText += tabString;
        }
        return tabText.slice(0, -1);
    }

    /**
     * Returns tab leader string.
     */
    private getTabLeaderString(tabLeader: TabLeader): string {
        let tabString: string = '';
        switch (tabLeader) {
            case 'Dot':
                tabString = '.';
                break;
            case 'Hyphen':
                tabString = '-';
                break;
            case 'Underscore':
                tabString = '_';
                break;
        }
        return tabString;
    }
    /**
     * Clips the rectangle with specified position.
     * @param {number} xPos 
     * @param {number} yPos 
     * @param {number} width 
     * @param {number} height 
     */
    private clipRect(xPos: number, yPos: number, width: number, height: number): void {
        this.pageContext.beginPath();
        this.pageContext.save();
        this.pageContext.rect(this.getScaledValue(xPos, 1), this.getScaledValue(yPos, 2), width, height);
        this.pageContext.clip();
    }
    /**
     * Renders underline.
     * @param {ElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     * @param {string} color 
     * @param {Underline} underline 
     * @param {BaselineAlignment} baselineAlignment 
     */
    // tslint:disable-next-line:max-line-length
    private renderUnderline(elementBox: ElementBox, left: number, top: number, underlineY: number, color: string, underline: Underline, baselineAlignment: BaselineAlignment): void {
        let renderedHeight: number = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        let topMargin: number = elementBox.margin.top;
        let underlineHeight: number = renderedHeight / 20;
        let y: number = 0;
        if (baselineAlignment === 'Subscript' || elementBox instanceof ListTextElementBox) {
            y = (renderedHeight - 2 * underlineHeight) + top;
            topMargin += elementBox.height - renderedHeight;
            y += topMargin > 0 ? topMargin : 0;
        } else {
            y = underlineY + top;
        }
        // tslint:disable-next-line:max-line-length
        this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y, 2), this.getScaledValue(elementBox.width), this.getScaledValue(underlineHeight));
    }
    /**
     * Renders strike through.
     * @param {ElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {Strikethrough} strikethrough 
     * @param {string} color 
     * @param {BaselineAlignment} baselineAlignment 
     */
    // tslint:disable-next-line:max-line-length
    private renderStrikeThrough(elementBox: ElementBox, left: number, top: number, strikethrough: Strikethrough, color: string, baselineAlignment: BaselineAlignment): void {
        let renderedHeight: number = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        let topMargin: number = elementBox.margin.top;
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - renderedHeight;
        }
        top += topMargin > 0 ? topMargin : 0;
        let lineHeight: number = renderedHeight / 20;
        let y: number = (renderedHeight / 2) + (0.5 * lineHeight);
        let lineCount: number = 0;
        if (strikethrough === 'DoubleStrike') {
            y -= lineHeight;
        }
        while (lineCount < (strikethrough === 'DoubleStrike' ? 2 : 1)) {
            lineCount++;
            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y + top, 2), this.getScaledValue(elementBox.width), this.getScaledValue(lineHeight));
            y += 2 * lineHeight;
        }
    }
    /**
     * Renders image element box.
     * @param {ImageElementBox} elementBox 
     * @param {number} left 
     * @param {number} top 
     * @param {number} underlineY 
     */
    // tslint:disable-next-line:max-line-length
    private renderImageElementBox(elementBox: ImageElementBox, left: number, top: number, underlineY: number): void {
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        let color: string = 'black';
        this.pageContext.textBaseline = 'top';
        let widgetWidth: number = 0;
        let isClipped: boolean = false;
        if (topMargin < 0 || elementBox.line.paragraph.width < elementBox.width) {
            let containerWid: Widget = elementBox.line.paragraph.containerWidget;
            // if (containerWid instanceof BodyWidget) {
            //     widgetWidth = containerWid.width + containerWid.x;
            // } else 
            if (containerWid instanceof TableCellWidget) {
                let leftIndent: number = 0;
                if (containerWid.childWidgets[0] instanceof ParagraphWidget) {
                    let paraAdv: ParagraphWidget = containerWid.childWidgets[0] as ParagraphWidget;
                    leftIndent = paraAdv.paragraphFormat.leftIndent;
                }
                widgetWidth = containerWid.width + containerWid.margin.left - containerWid.leftBorderWidth - leftIndent;
                isClipped = true;
                // tslint:disable-next-line:max-line-length
                this.clipRect(left + leftMargin, top + topMargin, this.getScaledValue(widgetWidth), this.getScaledValue(containerWid.height));
            }
        }
        if (elementBox.isMetaFile) {
            /* tslint:disable:no-empty */
        } else {
            // tslint:disable-next-line:max-line-length
            this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        if (isClipped) {
            this.pageContext.restore();
        }
    }
    /**
     * Renders table outline.
     * @param {TableWidget} tableWidget 
     */
    private renderTableOutline(tableWidget: TableWidget): void {
        let layout: Layout = new Layout(this.viewer);
        let table: TableWidget = tableWidget;
        tableWidget.width = this.viewer.layout.getTableWidth(table);
        let border: WBorder = !table.isBidiTable ? layout.getTableLeftBorder(table.tableFormat.borders)
            : layout.getTableRightBorder(table.tableFormat.borders);

        let lineWidth: number = 0;
        //ToDo: Need to draw the borders based on the line style.
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }

        border = layout.getTableTopBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y - lineWidth / 2, lineWidth);
        // }
        border = !table.isBidiTable ? layout.getTableRightBorder(table.tableFormat.borders)
            : layout.getTableLeftBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }
        border = layout.getTableBottomBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y + tableWidget.height - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y + tableWidget.height - lineWidth / 2, lineWidth);
        // }
    }
    /**
     * Renders table cell outline.
     * @param {LayoutViewer} viewer 
     * @param {TableCellWidget} cellWidget 
     */
    // tslint:disable: max-func-body-length
    private renderTableCellOutline(viewer: LayoutViewer, cellWidget: TableCellWidget): void {
        let layout: Layout = viewer.layout;
        let borders: WBorders = undefined;
        let tableCell: TableCellWidget = cellWidget;
        let cellTopMargin: number = 0;
        let cellBottomMargin: number = 0;
        let cellLeftMargin: number = 0;
        let cellRightMargin: number = 0;
        let height: number = 0;
        let isBidiTable: boolean = cellWidget.ownerTable.isBidiTable;
        borders = tableCell.cellFormat.borders;
        if (cellWidget.containerWidget instanceof TableRowWidget) {
            cellBottomMargin = cellWidget.margin.bottom - (cellWidget.containerWidget as TableRowWidget).bottomBorderWidth;
            cellTopMargin = cellWidget.margin.top - (cellWidget.containerWidget as TableRowWidget).topBorderWidth;
        }
        cellLeftMargin = cellWidget.margin.left - cellWidget.leftBorderWidth;
        cellRightMargin = cellWidget.margin.right - cellWidget.rightBorderWidth;
        if (!isNullOrUndefined(tableCell.ownerRow) && tableCell.ownerRow.rowFormat.heightType === 'Exactly') {
            height = HelperMethods.convertPointToPixel(tableCell.ownerRow.rowFormat.height) + cellTopMargin + cellBottomMargin;
        } else {
            if (!isNullOrUndefined(tableCell.ownerRow) && [tableCell.ownerRow].length <= 1) {
                // tslint:disable-next-line:max-line-length
                height = Math.max(HelperMethods.convertPointToPixel(tableCell.ownerRow.rowFormat.height), cellWidget.height) + cellTopMargin + cellBottomMargin;
            } else {
                height = cellWidget.height + cellTopMargin + cellBottomMargin;
            }
        }
        let border: WBorder = !isBidiTable ? TableCellWidget.getCellLeftBorder(tableCell) : TableCellWidget.getCellRightBorder(tableCell);
        let lineWidth: number = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth()); //Renders the cell left border.
        this.renderCellBackground(height, cellWidget, cellLeftMargin, lineWidth);
        let leftBorderWidth: number = lineWidth;
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y - cellTopMargin, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        // }
        border = TableCellWidget.getCellTopBorder(tableCell);
        // if (!isNullOrUndefined(border )) { //Renders the cell top border.        
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        // tslint:disable-next-line:max-line-length
        this.renderSingleBorder(border, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y - cellWidget.margin.top + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right, cellWidget.y - cellWidget.margin.top + lineWidth / 2, lineWidth);
        // }

        let isLastCell: boolean = false;
        if (!isBidiTable) {
            isLastCell = tableCell.cellIndex === tableCell.ownerRow.childWidgets.length - 1;
        } else {
            isLastCell = tableCell.cellIndex === 0;
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0 || isLastCell) {
            border = isBidiTable ? TableCellWidget.getCellLeftBorder(tableCell) : TableCellWidget.getCellRightBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell right border.           
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
            // }
        }
        let nextRow: TableRowWidget = tableCell.ownerRow.nextWidget as TableRowWidget;
        //Specifies the next row is within the current table widget.
        //True means current row is not rendered at page end; Otherwise False.
        let nextRowIsInCurrentTableWidget: boolean = false;
        if (!isNullOrUndefined(nextRow)) {
            let nextRowWidget: TableRowWidget = undefined;
            // if (viewer.renderedElements.containsKey(nextRow) && viewer.renderedElements.get(nextRow).length > 0) {
            nextRowWidget = nextRow as TableRowWidget;
            // }
            if (nextRowWidget instanceof TableRowWidget) {
                // tslint:disable-next-line:max-line-length
                if (cellWidget.containerWidget instanceof TableRowWidget && cellWidget.containerWidget.containerWidget instanceof TableWidget) {
                    nextRowIsInCurrentTableWidget = (cellWidget.containerWidget.containerWidget as TableWidget).childWidgets.indexOf(nextRowWidget) !== -1;
                }
            }
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0 || tableCell.ownerRow.rowIndex === tableCell.ownerTable.childWidgets.length - 1
            || (tableCell.cellFormat.rowSpan > 1
                && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan === tableCell.ownerTable.childWidgets.length) ||
            !nextRowIsInCurrentTableWidget) {
            // tslint:disable-next-line:max-line-length
            border = (tableCell.cellFormat.rowSpan > 1 && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan === tableCell.ownerTable.childWidgets.length) ?
                //true part for vertically merged cells specifically.
                tableCell.getBorderBasedOnPriority(tableCell.cellFormat.borders.bottom, TableCellWidget.getCellBottomBorder(tableCell))
                //false part for remaining cases that has been handled inside method. 
                : TableCellWidget.getCellBottomBorder(tableCell);
            // if (!isNullOrUndefined(border )) {
            //Renders the cell bottom border.
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, lineWidth);
            // }
        }
        border = layout.getCellDiagonalUpBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal up border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border, cellWidget.x - cellLeftMargin, cellWidget.y + cellWidget.height + cellBottomMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y - cellTopMargin, lineWidth);
            // }
        }
        border = layout.getCellDiagonalDownBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal down border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            // tslint:disable-next-line:max-line-length
            this.renderSingleBorder(border, cellWidget.x - cellLeftMargin, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        }
        // }
    }
    /**
     * Renders cell background.
     * @param {number} height 
     * @param {TableCellWidget} cellWidget 
     */
    private renderCellBackground(height: number, cellWidget: TableCellWidget, leftMargin: number, lineWidth: number): void {
        let cellFormat: WCellFormat = cellWidget.cellFormat;
        let bgColor: string = cellFormat.shading.backgroundColor === '#ffffff' ?
            cellWidget.ownerTable.tableFormat.shading.backgroundColor : cellFormat.shading.backgroundColor;

        this.pageContext.beginPath();
        if (bgColor !== 'empty') {
            this.pageContext.fillStyle = this.getColor(bgColor);
            let left: number = cellWidget.x - leftMargin - lineWidth;
            let top: number = cellWidget.y - HelperMethods.convertPointToPixel(cellWidget.topMargin);
            // tslint:disable-next-line:max-line-length
            let width: number = cellWidget.width + leftMargin + lineWidth + cellWidget.margin.right;

            // tslint:disable-next-line:max-line-length
            this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
            this.pageContext.closePath();
        }
    }
    /**
     * Renders single border.
     * @param {WBorder} border 
     * @param {number} startX 
     * @param {number} startY 
     * @param {number} endX 
     * @param {number} endY 
     * @param {number} lineWidth 
     */
    // tslint:disable-next-line:max-line-length
    private renderSingleBorder(border: WBorder, startX: number, startY: number, endX: number, endY: number, lineWidth: number): void {
        this.pageContext.beginPath();
        this.pageContext.moveTo(this.getScaledValue(startX, 1), this.getScaledValue(startY, 2));
        this.pageContext.lineTo(this.getScaledValue(endX, 1), this.getScaledValue(endY, 2));
        this.pageContext.lineWidth = this.getScaledValue(lineWidth);
        // set line color
        this.pageContext.strokeStyle = border.color;
        if (lineWidth > 0) {
            this.pageContext.stroke();
        }
        this.pageContext.closePath();
    }
    /**
     * Gets scaled value.
     * @param {number} value 
     * @param {number} type 
     * @private
     */
    public getScaledValue(value: number, type?: number): number {
        if (this.isPrinting) {
            return value;
        }
        if (isNullOrUndefined(type)) {
            type = 0;
        }
        let x: number = value * this.viewer.zoomFactor;
        return x + (type === 1 ? this.pageLeft : (type === 2 ? this.pageTop : 0));
    }
    /**
     * Destroys the internal objects which is maintained.
     */
    public destroy(): void {
        this.viewer = undefined;
        if (!isNullOrUndefined(this.pageCanvasIn)) {
            this.pageCanvasIn.innerHTML = '';
        }
        this.pageCanvasIn = undefined;
    }
}