import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { WCharacterFormat, WParagraphFormat } from '../index';
import { WCellFormat } from '../index';
import { WBorder } from '../index';
import { WBorders } from '../index';
import {
    Page, Rect, Widget, ImageElementBox, LineWidget, ParagraphWidget,
    BodyWidget, TextElementBox, ElementBox, HeaderFooterWidget, ListTextElementBox,
    TableRowWidget, TableWidget, TableCellWidget, FieldElementBox, TabElementBox, BlockWidget, ErrorTextElementBox,
    CommentCharacterElementBox, ShapeElementBox, EditRangeStartElementBox, FootNoteWidget, ShapeBase
} from './page';
import { BaselineAlignment, HighlightColor, Underline, Strikethrough, TabLeader, CollaborativeEditingSettingsModel } from '../../index';
import { Layout } from './layout';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, DocumentHelper } from './viewer';
import { HelperMethods, ErrorInfo, Point, SpecialCharacterInfo, SpaceCharacterInfo, WordSpellInfo, RevisionInfo, BorderInfo } from '../editor/editor-helper';
import { SearchWidgetInfo } from '../index';
import { SelectionWidgetInfo } from '../selection';
import { SpellChecker } from '../spell-check/spell-checker';
import { Revision } from '../track-changes/track-changes';
import { WSectionFormat } from '../format';
import { TextWrappingStyle } from '../../base';

/**
 * @private
 */
export class Renderer {
    public isPrinting: boolean = false;
    private pageLeft: number = 0;
    private pageTop: number = 0;
    private documentHelper: DocumentHelper;
    private pageIndex: number = -1;
    private pageCanvasIn: HTMLCanvasElement;
    private isFieldCode: boolean = false;
    private leftPosition: number = 0;
    private topPosition: number = 0;
    private height: number = 0;
    public get pageCanvas(): HTMLCanvasElement {
        if (this.isPrinting) {
            if (isNullOrUndefined(this.pageCanvasIn)) {
                this.pageCanvasIn = document.createElement('canvas');
                this.pageCanvasIn.getContext('2d').save();
            }
            return this.pageCanvasIn;
        }
        return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.containerCanvas;
    }
    public get spellChecker(): SpellChecker {
        return this.documentHelper.owner.spellChecker;
    }
    private get selectionCanvas(): HTMLCanvasElement {
        return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.selectionCanvas;
    }
    private get pageContext(): CanvasRenderingContext2D {
        return this.pageCanvas.getContext('2d');
    }
    private get selectionContext(): CanvasRenderingContext2D {
        return this.selectionCanvas.getContext('2d');
    }

    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
    }
    private get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }
    public renderWidgets(page: Page, left: number, top: number, width: number, height: number): void {
        if (isNullOrUndefined(this.pageCanvas) || isNullOrUndefined(page)) {
            return;
        }
        this.pageContext.fillStyle = HelperMethods.getColor(this.documentHelper.backgroundColor);
        this.pageContext.beginPath();
        if (this.viewer instanceof WebLayoutViewer) {
            height = height > this.documentHelper.visibleBounds.height ? height : this.documentHelper.visibleBounds.height;
            let marginTop: number = top;
            if (page.index === 0) {
                marginTop = top - this.viewer.padding.top;
            }
            /* eslint-disable-next-line max-len */
            this.pageContext.fillRect(left - this.viewer.padding.left, marginTop, width + this.viewer.padding.left, height + this.viewer.padding.top);
        } else {
            this.pageContext.fillRect(left, top, width, height);
        }
        this.pageContext.closePath();
        if (this.viewer instanceof PageLayoutViewer) {
            this.pageContext.strokeStyle = this.documentHelper.owner.pageOutline;
            this.pageContext.strokeRect(left, top, width, height);
        }

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
        this.height = height;
        if (page.headerWidget) {
            this.renderHFWidgets(page, page.headerWidget, width, true);
        }
        if (page.footerWidget) {
            this.renderHFWidgets(page, page.footerWidget, width, false);
        }
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            this.render(page, page.bodyWidgets[i]);
            if (page.footnoteWidget && this.documentHelper.owner.layoutType === 'Pages') {
                this.renderfootNoteWidget(page, page.footnoteWidget);
            }
        }
        if (page.endnoteWidget && this.documentHelper.owner.layoutType === 'Pages') {
            this.renderfootNoteWidget(page, page.endnoteWidget);
        }
        if (this.documentHelper.owner.enableHeaderAndFooter && !this.isPrinting) {
            this.renderHeaderSeparator(page, this.pageLeft, this.pageTop, page.headerWidget);
        }
        this.pageLeft = 0;
        this.pageTop = 0;
        this.pageContext.restore();
    }
    private setPageSize(page: Page): void {
        this.pageContext.clearRect(0, 0, this.pageCanvas.width, this.pageCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        this.pageContext.restore();
        this.selectionContext.restore();
        const width: number = page.boundingRectangle.width;
        const height: number = page.boundingRectangle.height;
        const dpr: number = Math.max(window.devicePixelRatio, this.documentHelper.owner.documentEditorSettings.printDevicePixelRatio);
        if (this.pageCanvas.width !== width * dpr || this.pageCanvas.height !== height * dpr) {
            this.pageCanvas.height = height * dpr;
            this.pageCanvas.width = width * dpr;
            this.pageCanvas.style.height = height + 'px';
            this.pageCanvas.style.width = width + 'px';
            this.pageContext.globalAlpha = 1;
            this.pageContext.scale(dpr, dpr);
        }
        this.pageContext.fillStyle = '#FFFFFF';
        this.pageContext.fillRect(0, 0, this.pageCanvas.width, this.pageCanvas.height);
        this.pageContext.fillStyle = '#000000';
    }
    private renderHFWidgets(page: Page, widget: HeaderFooterWidget, width: number, isHeader: boolean): void {
        if (!this.isPrinting) {
            this.pageContext.globalAlpha = this.documentHelper.owner.enableHeaderAndFooter ? 1 : 0.65;
        }
        let cliped: boolean = false;
        let height: number = 0;
        let pageHt: number = 0;
        const headerFooterHeight: number = page.boundingRectangle.height / 100 * 40;
        if (isHeader) {
            const topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
            const widgetHeight: number = Math.max((widget.y + widget.height), topMargin);
            if (widgetHeight > headerFooterHeight) {
                cliped = true;
                this.pageContext.beginPath();
                this.pageContext.save();
                this.pageContext.rect(this.pageLeft, this.pageTop, width, this.getScaledValue(headerFooterHeight));
                this.pageContext.clip();
            }
        } else {
            const footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);

            const footerHeight: number = page.boundingRectangle.height -
                /* eslint-disable-next-line max-len */
                Math.max(page.footerWidget.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidget.sectionFormat.bottomMargin));
            height = Math.max(page.boundingRectangle.height - headerFooterHeight, footerHeight);
            pageHt = page.boundingRectangle.height - footerDistance;
        }
        this.renderFloatingItems(page, widget.floatingElements, 'Behind');
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            const block: BlockWidget = widget.childWidgets[i] as BlockWidget;
            if (!isHeader) {
                height += block.height;
            }
            if (isHeader || !isHeader && this.getScaledValue(Math.round(height)) <= this.getScaledValue(Math.round(pageHt))) {
                this.renderWidget(page, block);
            }
        }
        this.renderFloatingItems(page, widget.floatingElements, 'InFrontOfText');
        if (cliped) {
            this.pageContext.restore();
        }
        if (!this.isPrinting) {
            this.pageContext.globalAlpha = this.documentHelper.owner.enableHeaderAndFooter ? 0.65 : 1;
        }
    }
    private renderHeaderSeparator(page: Page, left: number, top: number, widget: HeaderFooterWidget): void {
        //Header Widget
        const topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
        let y: number = this.getScaledValue(Math.max((widget.y + widget.height), topMargin));
        const pageWidth: number = this.getScaledValue(page.boundingRectangle.width);
        const ctx: CanvasRenderingContext2D = this.pageContext;
        ctx.save();
        ctx.globalAlpha = 0.65;
        const headerFooterHeight: number = (this.getScaledValue(page.boundingRectangle.height) / 100) * 40;
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
            const footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);

            let footerHeight: number = this.getScaledValue(page.boundingRectangle.height) -
                /* eslint-disable-next-line max-len */
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
            if ((this.documentHelper.pages.indexOf(page) + 1) % 2 === 0) {
                type = isHeader ? 'Even Page Header' : 'Even Page Footer';
            } else {
                type = isHeader ? 'Odd Page Header' : 'Odd Page Footer';
            }
        }
        return type;
    }

    /* eslint-disable-next-line max-len */
    public renderDashLine(context: CanvasRenderingContext2D, x: number, y: number, width: number, fillStyle: string, isSmallDash: boolean): void {
        context.beginPath();
        context.strokeStyle = fillStyle;
        context.lineWidth = 1;
        if (isSmallDash) {
            context.setLineDash([3, 2]);
        } else {
            context.setLineDash([6, 4]);
        }
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.stroke();
        context.setLineDash([]);
        context.closePath();
    }

    public renderSolidLine(context: CanvasRenderingContext2D, x: number, y: number, width: number, fillStyle: string): void {
        context.beginPath();
        context.strokeStyle = fillStyle;
        context.lineWidth = 0.5;
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.stroke();
        context.closePath();
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
    private render(page: Page, bodyWidget: BodyWidget): void {
        if (this.isFieldCode) {
            this.isFieldCode = false;
        }
        this.renderFloatingItems(page, page.bodyWidgets[0].floatingElements, 'Behind');
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            const widget: Widget = bodyWidget.childWidgets[i] as ParagraphWidget;
            if (i === 0 && bodyWidget.childWidgets[0] instanceof TableWidget &&
                ((bodyWidget.childWidgets[0] as TableWidget).childWidgets.length > 0) &&
                (((bodyWidget.childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).rowFormat.isHeader ||
                    page.repeatHeaderRowTableWidget)) {
                /* eslint-disable-next-line max-len */
                this.renderHeader(page, widget as TableWidget, this.documentHelper.layout.getHeader(bodyWidget.childWidgets[0] as TableWidget));
            }
            this.renderWidget(page, widget);
        }
        this.renderFloatingItems(page, page.bodyWidgets[0].floatingElements, 'InFrontOfText');
    }

    private renderFloatingItems(page: Page, floatingElements: (ShapeBase | TableWidget)[], wrappingType: TextWrappingStyle): void {
        if (!isNullOrUndefined(floatingElements) && floatingElements.length > 0) {
            /* eslint-disable */
            floatingElements.sort(function (a, b) {
                if (a instanceof TableWidget || b instanceof TableWidget) {
                    return 0;
                } else {
                    return a.zOrderPosition - b.zOrderPosition;
                }
            });
            for (let i: number = 0; i < floatingElements.length; i++) {
                if (floatingElements[i] instanceof TableWidget) {
                    continue;
                }
                let shape: ShapeBase = floatingElements[i] as ShapeBase;
                if ((wrappingType === "Behind" && shape.textWrappingStyle !== "Behind") ||
                    (wrappingType !== "Behind" && shape.textWrappingStyle === "Behind")) {
                    continue;
                }
                if (shape instanceof ImageElementBox) {
                    this.renderImageElementBox(shape, shape.x, shape.y, 0);
                } else if (shape instanceof ShapeElementBox) {
                    let shapeLeft: number = this.getScaledValue(shape.x, 1);
                    let shapeTop: number = this.getScaledValue(shape.y, 2);
                    this.renderShapeElementBox(shape, shapeLeft, shapeTop, page);
                }
            }
        }
    }

    private renderShapeElementBox(shape: ShapeElementBox, shapeLeft: number, shapeTop: number, page: Page): void {
        let isZeroShapeHeight: boolean = (shape.height === 0) ? true : false;
        let shapeType: any = shape.autoShapeType;
        let blocks: BlockWidget[] = shape.textFrame.childWidgets as BlockWidget[];
        
        this.pageContext.beginPath();
        if (shape.fillFormat && shape.fillFormat.color && shape.fillFormat.fill) {
            this.pageContext.fillStyle = shape.fillFormat.color;
            this.pageContext.fillRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
        }
        if (!isNullOrUndefined(shapeType)) {
            if ((shape.lineFormat.line && shape.lineFormat.lineFormatType !== 'None') || (!isNullOrUndefined(shape.lineFormat.lineFormatType) && shape.lineFormat.lineFormatType !== 'None')) {
                this.pageContext.lineWidth = shape.lineFormat.weight;
                this.pageContext.strokeStyle = HelperMethods.getColor(shape.lineFormat.color);
                this.pageContext.strokeRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
            }
        }
        this.pageContext.closePath();
        let isClipped: boolean = false;
        if (shape.width != 0 && shape.height != 0) {
            isClipped = true;
            this.clipRect(shape.x, shape.y, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
        }
        for (let i: number = 0; i < blocks.length; i++) {
            this.renderWidget(page, blocks[i]);
            if (isZeroShapeHeight && shapeType !== 'StraightConnector') {
                shape.height += blocks[i].height;
            }
        }
        if (isZeroShapeHeight) {
            isZeroShapeHeight = false;
        }
        if (isClipped) {
            this.pageContext.restore();
        }
    }

    private renderWidget(page: Page, widget: Widget): void {
        if (this.documentHelper.owner.enableLockAndEdit) {
            this.renderLockRegionBorder(page, widget);
        }
        if (widget instanceof ParagraphWidget) {
            this.renderParagraphWidget(page, widget as ParagraphWidget);
        } else {
            this.renderTableWidget(page, widget as TableWidget);
        }
    }

    private renderLockRegionBorder(page: Page, widget: Widget) {
        if (!(widget as BlockWidget).isInsideTable && widget instanceof BlockWidget && widget.locked) {
            let settinsModel: CollaborativeEditingSettingsModel = this.documentHelper.owner.documentEditorSettings.collaborativeEditingSettings;
            let sectionFormat: WSectionFormat = page.bodyWidgets[0].sectionFormat;
            let leftPosition: number = HelperMethods.convertPointToPixel(sectionFormat.leftMargin) - 5;
            let pageWidth: number = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;
            pageWidth = HelperMethods.convertPointToPixel(pageWidth) + 10;
            if (this.viewer instanceof WebLayoutViewer) {

                leftPosition = widget.x - 5
                pageWidth = (this.documentHelper.visibleBounds.width - (this.viewer.padding.right * 5)) / this.documentHelper.zoomFactor;
            }
            let previousWidget: BlockWidget = widget.previousRenderedWidget as BlockWidget;
            let nextWidget: BlockWidget = widget.nextRenderedWidget as BlockWidget;

            let color: string = widget.lockedBy === this.documentHelper.owner.currentUser ? settinsModel.editableRegionColor : settinsModel.lockedRegionColor;
            let topPosition: number = widget.y
            let height: number = widget.y + widget.height;
            //Left border
            this.renderSingleBorder(color, leftPosition, topPosition, leftPosition, height, 1);
            //Top border
            if (isNullOrUndefined(previousWidget) || !previousWidget.locked || widget.lockedBy !== previousWidget.lockedBy) {
                this.renderSingleBorder(color, leftPosition, topPosition, leftPosition + pageWidth, topPosition, 1);
            }
            //Right border
            this.renderSingleBorder(color, leftPosition + pageWidth, topPosition, leftPosition + pageWidth, height, 1);
            if (isNullOrUndefined(nextWidget) || !nextWidget.locked || widget.lockedBy !== nextWidget.lockedBy) {
                // Bottom border
                this.renderSingleBorder(color, leftPosition, height, leftPosition + pageWidth, height, 1);
            }
        }
    }
    private renderHeader(page: Page, widget: TableWidget, header: TableRowWidget): void {
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

            page.viewer.updateClientAreaLocation(headerWidget, new Rect(page.viewer.clientArea.x, top, headerWidget.width, headerWidget.height));
            page.documentHelper.layout.updateChildLocationForRow(top, headerWidget);
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
            page.documentHelper.layout.updateChildLocationForTable(top, widget);
        }
    }

    private renderParagraphWidget(page: Page, paraWidget: ParagraphWidget): void {
        let top: number = paraWidget.y;
        let left: number = paraWidget.x;
        for (let i: number = 0; i < paraWidget.childWidgets.length; i++) {
            let widget: LineWidget = paraWidget.childWidgets[i] as LineWidget;
            top += widget.marginTop;
            this.renderLine(widget, page, left, top);
            top += widget.height;
        }
    }
    private renderfootNoteWidget(page: Page, paraWidget: FootNoteWidget): void {
        for (let i: number = 0; i < paraWidget.childWidgets.length; i++) {
            let widget: BlockWidget = paraWidget.childWidgets[i] as BlockWidget;
            if (i === 0) {
                let ctx: CanvasRenderingContext2D = this.pageContext;

                this.renderSolidLine(ctx, this.getScaledValue(widget.x, 1), this.getScaledValue(widget.y + widget.height / 2, 2), 300 * this.documentHelper.zoomFactor, '#000000');
                continue;
            }

            if (!isNullOrUndefined(widget.footNoteReference) && (widget.childWidgets[0] as LineWidget).children[0] instanceof TextElementBox) {

                if (i < 2 || (i > 1 && widget.footNoteReference !== (paraWidget.childWidgets[i - 1] as BlockWidget).footNoteReference)) {

                    ((widget.childWidgets[0] as LineWidget).children[0] as TextElementBox).text = ((widget.childWidgets[0] as LineWidget).children[0] as TextElementBox).text.replace(((widget.childWidgets[0] as LineWidget).children[0] as TextElementBox).text, widget.footNoteReference.text);
                }
            }
            this.renderWidget(page, widget);
        }

    }
    private renderTableWidget(page: Page, tableWidget: TableWidget): void {
        if (this.isFieldCode) {
            return;
        }
        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let widget: Widget = tableWidget.childWidgets[i] as Widget;
            this.renderTableRowWidget(page, widget);

            if (tableWidget.tableFormat.cellSpacing > 0) {
                this.renderTableOutline(tableWidget);
            }
        }
    }
    private renderTableRowWidget(page: Page, rowWidget: Widget): void {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let widget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            this.renderTableCellWidget(page, widget);
        }
    }
    private renderTableCellWidget(page: Page, cellWidget: TableCellWidget): void {
        if (!this.isPrinting) {
            if (this.getScaledValue(cellWidget.y, 2) + cellWidget.height * this.documentHelper.zoomFactor < 0 ||
                this.getScaledValue(cellWidget.y, 2) > this.documentHelper.visibleBounds.height) {
                return;
            }
        }
        let widgetHeight: number = 0;
        if (!this.isPrinting && page.documentHelper.owner.selection && page.documentHelper.owner.selection.selectedWidgets.length > 0) {
            page.documentHelper.owner.selection.addSelectionHighlightTable(this.selectionContext, cellWidget);
        }
        this.renderTableCellOutline(page.documentHelper, cellWidget);
        for (let i: number = 0; i < cellWidget.childWidgets.length; i++) {
            let widget: Widget = cellWidget.childWidgets[i] as Widget;
            // MS word render the content in right margin also.
            // So, we need to add right margin value while cliping the content
            let width: number = (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right) - cellWidget.leftBorderWidth;
            if (!this.isPrinting) {

                this.clipRect(cellWidget.x - cellWidget.margin.left, cellWidget.y, this.getScaledValue(width), this.getScaledValue(this.height));
            }
            this.renderWidget(page, widget);
            this.pageContext.restore();
        }
    }
    private renderLine(lineWidget: LineWidget, page: Page, left: number, top: number): void {

        if (!this.isPrinting && page.documentHelper.owner.selection && !this.documentHelper.isScrollToSpellCheck && page.documentHelper.owner.selection.selectedWidgets.length > 0) {
            page.documentHelper.owner.selection.addSelectionHighlight(this.selectionContext, lineWidget, top);
        }

        let paraFormat: WParagraphFormat = lineWidget.paragraph.paragraphFormat;
        if (lineWidget.isFirstLine() && !paraFormat.bidi) {
            left += HelperMethods.convertPointToPixel(paraFormat.firstLineIndent);
        }
        if (this.documentHelper && this.documentHelper.selection && !isNullOrUndefined(this.documentHelper.selection.formFieldHighlighters)
            && this.documentHelper.selection.formFieldHighlighters.containsKey(lineWidget)) {
            if (this.documentHelper.owner.documentEditorSettings
                && this.documentHelper.owner.documentEditorSettings.formFieldSettings.applyShading) {
                let widgetInfo: SelectionWidgetInfo[] = page.documentHelper.selection.formFieldHighlighters.get(lineWidget);
                for (let i: number = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = this.documentHelper.owner.documentEditorSettings.formFieldSettings.shadingColor;
                    let height: number = lineWidget.height;
                    let isLastLine: boolean = lineWidget.isLastLine();
                    if (isLastLine) {

                        height = height - HelperMethods.convertPointToPixel(this.documentHelper.layout.getAfterSpacing(lineWidget.paragraph))
                    }

                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(height));
                }
            }
        }
        if (this.documentHelper.owner.searchModule) {

            if (!isNullOrUndefined(page.documentHelper.owner.searchModule.searchHighlighters) && page.documentHelper.owner.searchModule.searchHighlighters.containsKey(lineWidget)) {
                let widgetInfo: SearchWidgetInfo[] = page.documentHelper.owner.searchModule.searchHighlighters.get(lineWidget);
                for (let i: number = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = this.viewer.owner.documentEditorSettings.searchHighlightColor;

                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
                }
            }
        }
        // EditRegion highlight 
        if (page.documentHelper.selection && !isNullOrUndefined(page.documentHelper.selection.editRegionHighlighters)
            && page.documentHelper.selection.editRegionHighlighters.containsKey(lineWidget)) {
            let widgetInfo: SelectionWidgetInfo[] = page.documentHelper.selection.editRegionHighlighters.get(lineWidget);
            for (let i: number = 0; i < widgetInfo.length; i++) {
                this.pageContext.fillStyle = widgetInfo[i].color !== '' ? widgetInfo[i].color : '#add8e6';

                this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
            }
        }
        let isCommentMark: boolean = false;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            let elementBox: ElementBox = lineWidget.children[i] as ElementBox;
            if (elementBox instanceof ShapeBase && elementBox.textWrappingStyle !== 'Inline') {
                continue;
            }
            if (elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox) {
                let pageGap: number = 0;
                if (this.viewer instanceof PageLayoutViewer) {
                    pageGap = (this.viewer as PageLayoutViewer).pageGap;
                }
                let style: string = 'display:block;position:absolute;';
                let topPosition: string = this.getScaledValue((top - 10) + (page.boundingRectangle.y -
                    (pageGap * (page.index + 1)))) + (pageGap * (page.index + 1)) + 'px;';
                if (elementBox instanceof EditRangeStartElementBox) {
                    if (this.documentHelper.owner.enableLockAndEdit) {
                        let l10n: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
                        l10n.setLocale(this.documentHelper.owner.locale);
                        elementBox.renderLockMark(this.documentHelper.owner.currentUser, l10n);

                        let settings: CollaborativeEditingSettingsModel = this.documentHelper.owner.documentEditorSettings.collaborativeEditingSettings;
                        let color: string = elementBox.user === this.documentHelper.owner.currentUser ? settings.editableRegionColor : settings.lockedRegionColor;
                        style += `color:${color};`;
                        let leftMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.leftMargin);
                        let leftPosition: string = page.boundingRectangle.x + this.getScaledValue(leftMargin - 20) + 'px;';
                        if (this.viewer instanceof WebLayoutViewer) {
                            leftPosition = lineWidget.paragraph.x - 5 + 'px;';
                        }
                        style = style + 'left:' + leftPosition + 'top:' + topPosition;
                        elementBox.editRangeMark.setAttribute('style', style);
                    } else {
                        if (elementBox.editRangeMark) {
                            elementBox.editRangeMark.setAttribute('style', 'display:none');
                        }
                    }
                } else if (elementBox instanceof CommentCharacterElementBox &&
                    elementBox.commentType === 0 && this.documentHelper.owner.selectionModule) {
                    if (this.documentHelper.owner.enableComment && !isCommentMark) {
                        isCommentMark = true;
                        elementBox.renderCommentMark();
                        let rightMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.rightMargin);
                        let pageWidth: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.pageWidth);

                        let leftPosition: string = page.boundingRectangle.x + this.getScaledValue((pageWidth - rightMargin) + (rightMargin / 4)) + 'px;';
                        if (this.viewer instanceof WebLayoutViewer) {

                            leftPosition = (page.boundingRectangle.width - (this.viewer.padding.right * 2) - (this.viewer.padding.left * 2)) + 'px;';
                        }
                        style = style + 'left:' + leftPosition + 'top:' + topPosition;
                        elementBox.commentMark.setAttribute('style', style);
                    } else {
                        if (elementBox.commentMark) {
                            elementBox.commentMark.setAttribute('style', 'display:none');
                        }
                    }
                }

            }
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
                if (this.getScaledValue(top + elementBox.margin.top, 2) + elementBox.height * this.documentHelper.zoomFactor < 0 ||
                    this.getScaledValue(top + elementBox.margin.top, 2) > this.documentHelper.visibleBounds.height) {
                    left += elementBox.width + elementBox.margin.left;
                    if (elementBox instanceof TextElementBox) {
                        elementBox.canTrigger = true;
                        elementBox.isVisible = false;
                        if (!elementBox.isSpellChecked || elementBox.line.paragraph.isChangeDetected) {
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
            } else if (elementBox instanceof ShapeElementBox) {
                let shapeLeft: number = this.getScaledValue(left, 1);
                let shapeTop: number = this.getScaledValue(top, 2);
                this.renderShapeElementBox(elementBox, shapeLeft, shapeTop, page);
            }  else {
                elementBox.isVisible = true;
                left += elementBox.padding.left;
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
    public getUnderlineYPosition(lineWidget: LineWidget): number {
        let height: number = 0;
        let lineHeight: number = 0;
        for (let i: number = 0; i < lineWidget.children.length; i++) {
            if (lineWidget.children[i] instanceof FieldElementBox ||
                (lineWidget.children[i].width === 0 && lineWidget.children[i].height === 0)) {
                continue;
            }
            if (lineWidget.children[i] instanceof ShapeElementBox) {
                continue;
            } else {
                if (height < lineWidget.children[i].height + lineWidget.children[i].margin.top) {
                    height = lineWidget.children[i].margin.top + lineWidget.children[i].height;
                    lineHeight = (lineWidget.children[i] instanceof ImageElementBox) ? 0.9 : lineWidget.children[i].height / 20;
                }
            }
        }
        return height - 2 * lineHeight;
    }
    private renderListTextElementBox(elementBox: ListTextElementBox, left: number, top: number, underlineY: number): void {
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        let format: WCharacterFormat = elementBox.listLevel.characterFormat;
        let breakCharacterFormat: WCharacterFormat = elementBox.line.paragraph.characterFormat;
        let color: string = (format.fontColor === 'empty' || format.fontColor === '#00000000') ? breakCharacterFormat.fontColor : format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontFamily: string = format.hasValue('fontFamily') ? format.fontFamily : breakCharacterFormat.fontFamily;
        if (this.documentHelper.isIosDevice && (elementBox.text === '\u25CF' || elementBox.text === '\u25CB')) {
            fontFamily = '';
        }
        let fontSize: number = format.fontSize === 11 ? breakCharacterFormat.fontSize : format.fontSize;

        let baselineAlignment: BaselineAlignment = format.baselineAlignment === 'Normal' ? breakCharacterFormat.baselineAlignment : format.baselineAlignment;
        bold = format.hasValue('bold') ? format.bold ? 'bold' : '' : breakCharacterFormat.bold ? 'bold' : '';
        italic = format.hasValue('italic') ? format.italic ? 'italic' : '' : breakCharacterFormat.italic ? 'italic' : '';
        fontSize = fontSize === 0 ? 0.5 : fontSize / (baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.documentHelper.zoomFactor;
        let strikethrough: Strikethrough = format.strikethrough === 'None' ? breakCharacterFormat.strikethrough : format.strikethrough;
        let highlightColor: HighlightColor = format.highlightColor === 'NoColor' ? breakCharacterFormat.highlightColor :
            format.highlightColor;
        if (highlightColor !== 'NoColor') {
            if (highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(highlightColor);
            } else {
                this.pageContext.fillStyle = HelperMethods.getColor(highlightColor);
            }

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
            let index: number = text.indexOf('.');
            text = text.substr(index) + text.substring(0, index);
        }
        if (color === "empty" || color === '#00000000') {
            let bgColor: string = this.documentHelper.backgroundColor;
            this.pageContext.fillStyle = this.getDefaultFontColor(bgColor);
        } else {
            this.pageContext.fillStyle = HelperMethods.getColor(color);
        }

        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));

        if (format.underline !== 'None' && !isNullOrUndefined(format.underline)) {
            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, baselineAlignment);
        }
        if (strikethrough !== 'None') {
            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, baselineAlignment);
        }
    }

    private getDefaultFontColor(backColor: string) {
        if (HelperMethods.isVeryDark(backColor)) {
            return "#FFFFFF";
        } else {
            return "#000000";
        }
    }

    private renderTextElementBox(elementBox: TextElementBox, left: number, top: number, underlineY: number): void {
        let isHeightType: boolean = false;
        let containerWidget: Widget = elementBox.line.paragraph.containerWidget;
        if (containerWidget instanceof TableCellWidget) {
            isHeightType = ((containerWidget as TableCellWidget).ownerRow.rowFormat.heightType === 'Exactly');
        }
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        if (isHeightType && containerWidget instanceof TableCellWidget) {
            let width: number = (containerWidget.width + containerWidget.margin.left + containerWidget.margin.right) - containerWidget.leftBorderWidth;
            this.clipRect(containerWidget.x - containerWidget.margin.left, containerWidget.y, this.getScaledValue(width), this.getScaledValue(containerWidget.height));
        }
        let format: WCharacterFormat = elementBox.characterFormat;
        if (format.highlightColor !== 'NoColor') {
            if (format.highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(format.highlightColor);
            } else {
                this.pageContext.fillStyle = HelperMethods.getColor(format.highlightColor);
            }

            this.pageContext.fillRect(this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
        }
        let revisionInfo: RevisionInfo[] = this.checkRevisionType(elementBox);

        let color: string = revisionInfo.length > 0 ? this.getRevisionColor(revisionInfo) : format.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontSize: number = 11;
        bold = format.bold ? 'bold' : '';
        italic = format.italic ? 'italic' : '';
        fontSize = format.fontSize === 0 ? 0.5 : format.fontSize / (format.baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.documentHelper.zoomFactor;
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + format.fontFamily;
        if (format.baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        let baselineOffset: number = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
        if (color === "empty" || color === '#00000000') {
            let bgColor: string = this.documentHelper.backgroundColor;
            this.pageContext.fillStyle = this.getDefaultFontColor(bgColor);
        } else {
            this.pageContext.fillStyle = HelperMethods.getColor(color);
        }

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
        let isRTL: boolean = format.bidi || this.documentHelper.textHelper.isRTLText(elementBox.text);
        text = this.documentHelper.textHelper.setText(text, isRTL, format.bdo, true);
        if (format.allCaps) {
            text = text.toUpperCase();
        }

        this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), scaledWidth);

        if ((this.documentHelper.owner.isSpellCheck && !this.spellChecker.removeUnderline) && (this.documentHelper.triggerSpellCheck || elementBox.canTrigger) && elementBox.text !== ' ' && !this.documentHelper.isScrollHandler && (isNullOrUndefined(elementBox.previousNode) || !(elementBox.previousNode instanceof FieldElementBox))) {
            elementBox.canTrigger = true;
            this.leftPosition = this.pageLeft;
            this.topPosition = this.pageTop;
            let errorDetails: ErrorInfo = this.spellChecker.checktextElementHasErrors(elementBox.text, elementBox, left);
            if (errorDetails.errorFound) {
                color = '#FF0000';
                for (let i: number = 0; i < errorDetails.elements.length; i++) {
                    let currentElement: ErrorTextElementBox = errorDetails.elements[i];

                    if (elementBox.ignoreOnceItems.indexOf(this.spellChecker.manageSpecialCharacters(currentElement.text, undefined, true)) === -1) {

                        let backgroundColor: string = (containerWidget instanceof TableCellWidget) ? (containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;

                        this.renderWavyLine(currentElement, (isNullOrUndefined(currentElement.start)) ? left : currentElement.start.location.x, (isNullOrUndefined(currentElement.start)) ? top : currentElement.start.location.y - elementBox.margin.top, underlineY, color, 'Single', format.baselineAlignment, backgroundColor);
                    }
                }
            } else if (elementBox.ischangeDetected || this.documentHelper.triggerElementsOnLoading) {
                elementBox.ischangeDetected = false;
                this.handleChangeDetectedElements(elementBox, underlineY, left, top, format.baselineAlignment);
            }
        }
        let currentInfo: RevisionInfo = this.getRevisionType(revisionInfo, true);

        if (format.underline !== 'None' && !isNullOrUndefined(format.underline) || (!isNullOrUndefined(currentInfo) && (currentInfo.type === 'Insertion' || currentInfo.type === 'MoveTo'))) {

            this.renderUnderline(elementBox, left, top, underlineY, color, format.underline, format.baselineAlignment, currentInfo);
        }
        currentInfo = this.getRevisionType(revisionInfo, false);

        if (format.strikethrough !== 'None' && !isNullOrUndefined(format.strikethrough) || (!isNullOrUndefined(currentInfo) && (currentInfo.type === 'Deletion' || currentInfo.type === 'MoveFrom'))) {

            this.renderStrikeThrough(elementBox, left, top, format.strikethrough, color, format.baselineAlignment, currentInfo);
        }
        if (isHeightType) {
            this.pageContext.restore();
        }
    }


    private handleChangeDetectedElements(elementBox: TextElementBox, underlineY: number, left: number, top: number, baselineAlignment: BaselineAlignment): void {
        let checkText: string = elementBox.text.trim();
        let beforeIndex: number = this.pageIndex;
        if (elementBox.text === '\v') {
            return;
        }
        if (!this.spellChecker.checkElementCanBeCombined(elementBox, underlineY, beforeIndex, true)) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            let splittedText: any[] = checkText.split(/[\s]+/);
            let markindex: number = elementBox.line.getOffset(elementBox, 0);
            let spaceValue: number = 1;
            if (splittedText.length > 1) {
                for (let i: number = 0; i < splittedText.length; i++) {
                    let currentText: string = splittedText[i];
                    let retrievedText: string = this.spellChecker.manageSpecialCharacters(currentText, undefined, true);

                    if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                        this.handleUnorderedElements(retrievedText, elementBox, underlineY, i, markindex, i === splittedText.length - 1, beforeIndex);
                        markindex += currentText.length + spaceValue;
                    }
                }
            } else {
                let retrievedText: string = this.spellChecker.manageSpecialCharacters(checkText, undefined, true);
                if (checkText.length > 0) {

                    if (this.spellChecker.ignoreAllItems.indexOf(retrievedText) === -1 && elementBox.ignoreOnceItems.indexOf(retrievedText) === -1) {
                        let indexInLine: number = elementBox.indexInOwner;
                        let indexinParagraph: number = elementBox.line.paragraph.indexInOwner;
                        let spellInfo: WordSpellInfo = this.spellChecker.checkSpellingInPageInfo(retrievedText);
                        if (spellInfo.isElementPresent && this.spellChecker.enableOptimizedSpellCheck) {
                            let jsonObject: any = JSON.parse('{\"HasSpellingError\":' + spellInfo.hasSpellError + '}');

                            this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, true);
                        } else {
                            /* eslint-disable @typescript-eslint/no-explicit-any */

                            this.spellChecker.callSpellChecker(this.spellChecker.languageID, checkText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
                                /* eslint-disable @typescript-eslint/no-explicit-any */
                                let jsonObject: any = JSON.parse(data);

                                let canUpdate: boolean = (beforeIndex === this.pageIndex || elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);

                                this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, canUpdate);
                            });
                        }
                    }
                }
            }
        }
    }


    public handleUnorderedElements(currentText: string, elementBox: TextElementBox, underlineY: number, iteration: number, markIndex: number, isLastItem?: boolean, beforeIndex?: number): void {
        let indexInLine: number = elementBox.indexInOwner;
        let indexinParagraph: number = elementBox.line.paragraph.indexInOwner;
        if (currentText.length > 0) {
            let spellInfo: WordSpellInfo = this.spellChecker.checkSpellingInPageInfo(currentText);
            if (spellInfo.isElementPresent && this.spellChecker.enableOptimizedSpellCheck) {
                let jsonObject: any = JSON.parse('{\"HasSpellingError\":' + spellInfo.hasSpellError + '}');

                this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, true, underlineY, iteration, markIndex, isLastItem);
            } else {
                /* eslint-disable @typescript-eslint/no-explicit-any */

                this.spellChecker.callSpellChecker(this.spellChecker.languageID, currentText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    let jsonObject: any = JSON.parse(data);

                    let canUpdate: boolean = (elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);

                    this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, canUpdate, underlineY, iteration, markIndex, isLastItem);
                });
            }
        }
    }


    public renderWavyLine(elementBox: TextElementBox, left: number, top: number, underlineY: number, color: string, underline: Underline, baselineAlignment: BaselineAlignment, backgroundColor?: string): void {
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

            let specialCharacter: SpecialCharacterInfo = this.spellChecker.getSpecialCharactersInfo(elementBox.text, elementBox.characterFormat);

            let whiteSpaceData: SpaceCharacterInfo = this.spellChecker.getWhiteSpaceCharacterInfo(elementBox.text, elementBox.characterFormat);

            let x: number = left + specialCharacter.beginningWidth + ((whiteSpaceData.isBeginning) ? whiteSpaceData.width : 0) + elementBox.margin.left;
            let x1: number = x * this.documentHelper.zoomFactor + this.leftPosition;
            let y1: number = y * this.documentHelper.zoomFactor + this.topPosition;

            let x2: number = x1 + this.getScaledValue(elementBox.width - (specialCharacter.beginningWidth + specialCharacter.endWidth) - whiteSpaceData.width);
            let startingPoint: Point = new Point(x1, y1);
            let endingPoint: Point = new Point(x2, y1);

            this.drawWavy(startingPoint, endingPoint, (x2 - x1) * frequencyRange, amplitudeRange, stepToCover, color, elementBox.height, backgroundColor);
        }
    }


    public drawWavy(from: Point, to: Point, frequency: number, amplitude: number, step: number, color: string, height: number, backColor: string, negative?: number): void {
        this.pageContext.save();
        this.pageContext.fillStyle = (!isNullOrUndefined(backColor) ? backColor : this.documentHelper.backgroundColor);
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

    private getTabLeader(elementBox: TabElementBox): string {
        let textWidth: number = 0;
        let tabString: string = this.getTabLeaderString(elementBox.tabLeader);
        let tabText: string = tabString;
        textWidth = this.documentHelper.textHelper.getWidth(tabText, elementBox.characterFormat);
        let count: number = Math.floor(elementBox.width / textWidth);
        for (let i: number = 0; i <= count; i++) {
            tabText += tabString;
        }
        return tabText.slice(0, -1);
    }
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
    private clipRect(xPos: number, yPos: number, width: number, height: number): void {
        this.pageContext.beginPath();
        this.pageContext.save();
        this.pageContext.rect(this.getScaledValue(xPos, 1), this.getScaledValue(yPos, 2), width, height);
        this.pageContext.clip();
    }

    private renderUnderline(elementBox: ElementBox, left: number, top: number, underlineY: number, color: string, underline: Underline, baselineAlignment: BaselineAlignment, revisionInfo?: RevisionInfo): void {
        let renderedHeight: number = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        let topMargin: number = elementBox.margin.top;
        let underlineHeight: number = renderedHeight / 20;
        let y: number = 0;
        let lineHeight: number = renderedHeight / 20;
        if (baselineAlignment === 'Subscript' || elementBox instanceof ListTextElementBox) {
            y = (renderedHeight - 2 * underlineHeight) + top;
            topMargin += elementBox.height - renderedHeight;
            y += topMargin > 0 ? topMargin : 0;
        } else {
            y = underlineY + top;
        }
        let lineCount: number = 0;
        if (!isNullOrUndefined(revisionInfo)) {
            underline = (revisionInfo.type === 'MoveTo') ? 'Double' : 'Single';
        }
        if (underline === 'Double') {
            y -= lineHeight;
        }
        if (elementBox instanceof ImageElementBox) {
            underlineHeight = 0.9;
        }
        while (lineCount < (underline === 'Double' ? 2 : 1)) {
            lineCount++;
            let width: number = elementBox.width;
            if (elementBox instanceof TextElementBox && !(elementBox instanceof TabElementBox) && isNullOrUndefined(elementBox.nextNode)) {              
                width = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(elementBox.text), elementBox.characterFormat);
            }
            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y, 2), this.getScaledValue(width), this.getScaledValue(underlineHeight));
            y += 2 * lineHeight;
        }
    }

    private renderStrikeThrough(elementBox: ElementBox, left: number, top: number, strikethrough: Strikethrough, color: string, baselineAlignment: BaselineAlignment, revisionInfo?: RevisionInfo): void {
        let renderedHeight: number = elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5);
        let topMargin: number = elementBox.margin.top;
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - renderedHeight;
        }
        top += topMargin > 0 ? topMargin : 0;
        let lineHeight: number = renderedHeight / 20;
        let y: number = (renderedHeight / 2) + (0.5 * lineHeight);
        let lineCount: number = 0;
        if (!isNullOrUndefined(revisionInfo)) {
            strikethrough = (revisionInfo.type === 'Deletion') ? 'SingleStrike' : 'DoubleStrike';
        }
        if (elementBox instanceof ImageElementBox) {
            lineHeight = 0.9;
        }
        if (strikethrough === 'DoubleStrike') {
            y -= lineHeight;
        }
        while (lineCount < (strikethrough === 'DoubleStrike' ? 2 : 1)) {
            lineCount++;

            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y + top, 2), this.getScaledValue(elementBox.width), this.getScaledValue(lineHeight));
            y += 2 * lineHeight;
        }
    }

    private renderImageElementBox(elementBox: ImageElementBox, left: number, top: number, underlineY: number): void {
        let topMargin: number = elementBox.margin.top;
        let leftMargin: number = elementBox.margin.left;
        let revisionInfo: RevisionInfo[] = this.checkRevisionType(elementBox);
        let color: string = revisionInfo.length > 0 ? this.getRevisionColor(revisionInfo) : 'black';
        this.pageContext.textBaseline = 'top';
        let widgetWidth: number = 0;
        let isClipped: boolean = false;
        let containerWid: Widget = elementBox.line.paragraph.containerWidget;
        let isHeightType: boolean = false;
        if (containerWid instanceof TableCellWidget) {
            isHeightType = ((containerWid as TableCellWidget).ownerRow.rowFormat.heightType === 'Exactly');
        }

        if (elementBox.textWrappingStyle === 'Inline') {
            if (topMargin < 0 || elementBox.line.paragraph.width < elementBox.width) {
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

                    this.clipRect(left + leftMargin, top + topMargin, this.getScaledValue(widgetWidth), this.getScaledValue(containerWid.height));
                }
            } else if (isHeightType) {
                let width: number = containerWid.width + containerWid.margin.left - (containerWid as TableCellWidget).leftBorderWidth;
                isClipped = true;

                this.clipRect(containerWid.x, containerWid.y, this.getScaledValue(width), this.getScaledValue(containerWid.height));
            }
        }
        if (elementBox.isMetaFile && !isNullOrUndefined(elementBox.metaFileImageString)) {
            this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1),
                this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width),
                this.getScaledValue(elementBox.height));
        } else {
            try {
                if (!elementBox.isCrop) {

                    this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
                } else {

                    this.pageContext.drawImage(elementBox.element, this.getScaledValue(elementBox.x), this.getScaledValue(elementBox.y),
                        elementBox.cropWidth, elementBox.cropHeight, this.getScaledValue(left + leftMargin, 1),
                        this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
                }
            } catch (e) {

                elementBox.imageString = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC';

                this.pageContext.drawImage(elementBox.element, this.getScaledValue(left + leftMargin, 1), this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width), this.getScaledValue(elementBox.height));
            }
        }
        this.pageContext.fillStyle = HelperMethods.getColor(color);
        let currentRevision: RevisionInfo = this.getRevisionType(revisionInfo, false);

        if (!isNullOrUndefined(currentRevision) && (currentRevision.type === 'Deletion' || currentRevision.type === 'MoveFrom')) {

            this.renderStrikeThrough(elementBox, left, top, 'SingleStrike', color, 'Normal', currentRevision);
        }
        currentRevision = this.getRevisionType(revisionInfo, true);

        if (!isNullOrUndefined(currentRevision) && (currentRevision.type === 'Insertion' || currentRevision.type === 'MoveTo')) {
            let y: number = this.getUnderlineYPosition(elementBox.line);
            this.renderUnderline(elementBox, left, top, y, color, 'Single', 'Normal');
        }
        if (isClipped) {
            this.pageContext.restore();
        }
    }


    private renderTableOutline(tableWidget: TableWidget): void {
        let layout: Layout = new Layout(this.documentHelper);
        let table: TableWidget = tableWidget;
        tableWidget.width = this.documentHelper.layout.getTableWidth(table);
        let border: WBorder = !table.isBidiTable ? layout.getTableLeftBorder(table.tableFormat.borders)
            : layout.getTableRightBorder(table.tableFormat.borders);

        let lineWidth: number = 0;
        //ToDo: Need to draw the borders based on the line style.
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }

        border = layout.getTableTopBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y - lineWidth / 2, lineWidth);
        // }
        border = !table.isBidiTable ? layout.getTableRightBorder(table.tableFormat.borders)
            : layout.getTableLeftBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth);
        // }
        border = layout.getTableBottomBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y + tableWidget.height - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y + tableWidget.height - lineWidth / 2, lineWidth);
        // }
    }
    /* eslint-disable  */
    private renderTableCellOutline(documentHelper: DocumentHelper, cellWidget: TableCellWidget): void {
        let layout: Layout = documentHelper.layout;
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
        if (tableCell.index === 0 || tableCell.cellFormat.rowSpan === 1 || (tableCell.cellFormat.rowSpan > 1 && tableCell.columnIndex === 0)) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y - cellTopMargin, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        } else { 
            for (let i: number = 0; i < tableCell.ownerTable.childWidgets.length; i++) {
                let row: TableRowWidget = tableCell.ownerTable.childWidgets[i] as TableRowWidget;
                let cell: TableCellWidget
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let currentCell :TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    if ((currentCell.columnIndex + currentCell.cellFormat.columnSpan - 1) === tableCell.columnIndex - 1) {
                        cell = currentCell as TableCellWidget;
                        break;
                    } else if ((row.childWidgets[j] as TableCellWidget).columnIndex >= tableCell.columnIndex && (row.childWidgets[j] as TableCellWidget).previousWidget) {
                        cell = (row.childWidgets[j] as TableCellWidget).previousWidget as TableCellWidget;
                        break;
                    }
                }
                if (cell && cell.columnIndex + cell.cellFormat.columnSpan - 1 === tableCell.columnIndex - 1) {
                    let border: WBorder = !isBidiTable ? TableCellWidget.getCellRightBorder(cell) : TableCellWidget.getCellLeftBorder(cell);
                    let lineWidthInt: number = border.lineWidth;
                    if (cell.y + cell.height < tableCell.y) {
                        continue;
                    } else if (cell.y < tableCell.y && cell.y + cell.height > tableCell.y) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, tableCell.y - cellTopMargin, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cell.margin.bottom, lineWidthInt);
                    } else if ((cell.y === tableCell.y) || (cell.y > tableCell.y && cell.y + cell.height < tableCell.y + tableCell.height)) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, cell.y - cell.margin.top, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cell.margin.bottom, lineWidthInt);
                    } else if (cell.y < tableCell.y + tableCell.height && cell.y + cell.height >= tableCell.y + tableCell.height) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, cell.y - cell.margin.top, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cellBottomMargin, lineWidthInt);
                    } else if (cell.y > tableCell.y + tableCell.height) {
                        break;
                    }
                }
            }
        }
        // }
        if (tableCell.updatedTopBorders && tableCell.updatedTopBorders.length > 1) {
            let cellX: number = cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2;
            let cellY: number = cellWidget.y - cellWidget.margin.top;
            for (let a: number = 0; a < tableCell.updatedTopBorders.length; a++) {
                let borderInfo: BorderInfo = tableCell.updatedTopBorders[a];
                border = borderInfo.border;
                if (border.lineStyle !== 'None' && border.lineWidth < TableCellWidget.getCellTopBorder(tableCell).lineWidth) {
                    border.lineWidth = TableCellWidget.getCellTopBorder(tableCell).lineWidth;
                }
                if (!isNullOrUndefined(border)) {
                    lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
                    this.renderSingleBorder(border.color, cellX, cellY + lineWidth / 2, cellX + borderInfo.width, cellY + lineWidth / 2, lineWidth);
                    cellX = cellX + borderInfo.width;
                }
            }
        } else {
            border = TableCellWidget.getCellTopBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell top border.        
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            let width: number = 0;
            this.renderSingleBorder(border.color, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y - cellWidget.margin.top + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right + width, cellWidget.y - cellWidget.margin.top + lineWidth / 2, lineWidth);
            // }
        }
        let isLastCell: boolean = false;
        if (!isBidiTable) {
            isLastCell = tableCell.cellIndex === tableCell.ownerRow.childWidgets.length - 1;
        } else {
            isLastCell = tableCell.cellIndex === 0;
        }
        let prevRowSpannedCells: TableCellWidget[] = (tableCell.containerWidget as TableRowWidget).getPreviousRowSpannedCells();
        let isAffectedByRowSpan: boolean = false;
        for (let k: number = 0; k < prevRowSpannedCells.length; k++) {
            let spannedCell: TableCellWidget = prevRowSpannedCells[k];
            if (tableCell.rowIndex < spannedCell.rowIndex + spannedCell.cellFormat.rowSpan && tableCell.columnIndex < spannedCell.columnIndex) {
                isAffectedByRowSpan = true;
                break;
            }
        }
        if ((tableCell.ownerTable.tableFormat.cellSpacing > 0 || isLastCell) && (isBidiTable || tableCell.columnIndex + tableCell.cellFormat.columnSpan === tableCell.ownerTable.tableHolder.columns.length || !isAffectedByRowSpan)) {
            border = isBidiTable ? TableCellWidget.getCellLeftBorder(tableCell) : TableCellWidget.getCellRightBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell right border.           
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

            this.renderSingleBorder(border.color, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
            // }
        }
        let nextRow: TableRowWidget = tableCell.ownerRow.nextWidget as TableRowWidget;
        //Specifies the next row is within the current table widget.
        //True means current row is not rendered at page end; Otherwise False.
        let nextRowIsInCurrentTableWidget: boolean = false;
        let previousCellIndex: number = undefined;
        if (!isNullOrUndefined(nextRow)) {
            if (nextRow.lastChild) {
                let lastCellWidget: TableCellWidget = nextRow.lastChild as TableCellWidget;
                previousCellIndex = lastCellWidget.columnIndex + lastCellWidget.cellFormat.columnSpan;
            }
            let nextRowWidget: TableRowWidget = undefined;
            // if (viewer.renderedElements.containsKey(nextRow) && viewer.renderedElements.get(nextRow).length > 0) {
            nextRowWidget = nextRow as TableRowWidget;
            // }
            if (nextRowWidget instanceof TableRowWidget) {

                if (cellWidget.containerWidget instanceof TableRowWidget && cellWidget.containerWidget.containerWidget instanceof TableWidget) {
                    nextRowIsInCurrentTableWidget = (cellWidget.containerWidget.containerWidget as TableWidget).childWidgets.indexOf(nextRowWidget) !== -1;
                }
            }
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0 || tableCell.ownerRow.rowIndex === tableCell.ownerTable.childWidgets.length - 1
            || (tableCell.cellFormat.rowSpan > 1
                && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan >= tableCell.ownerTable.childWidgets.length) ||
            !nextRowIsInCurrentTableWidget || previousCellIndex && nextRow.childWidgets.length < tableCell.ownerRow.childWidgets.length
            && previousCellIndex < tableCell.columnIndex + tableCell.cellFormat.columnSpan) {
            let bottomBorder: WBorder = tableCell.cellFormat.borders.bottom;
            if (!isNullOrUndefined(bottomBorder) && bottomBorder.lineStyle === 'Cleared') {
                border = TableCellWidget.getCellBottomBorder(tableCell);
            } else {
                border = (tableCell.cellFormat.rowSpan > 1 && tableCell.ownerRow.rowIndex + tableCell.cellFormat.rowSpan === tableCell.ownerTable.childWidgets.length) ?
                    //true part for vertically merged cells specifically.
                    tableCell.getBorderBasedOnPriority(tableCell.getBorderBasedOnPriority(tableCell.cellFormat.borders.bottom, tableCell.ownerRow.rowFormat.borders.bottom), tableCell.ownerTable.tableFormat.borders.bottom)
                    //false part for remaining cases that has been handled inside method. 
                    : TableCellWidget.getCellBottomBorder(tableCell);
            }
            // if (!isNullOrUndefined(border )) {
            //Renders the cell bottom border.
            if (tableCell.cellFormat.borders.top.lineStyle === 'Cleared' && tableCell.cellFormat.borders.bottom.lineStyle === 'None' && !isNullOrUndefined(tableCell.nextWidget)) {
                border = tableCell.cellFormat.borders.bottom;
            }
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            this.renderSingleBorder(border.color, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, lineWidth);
            // }
        }
        border = layout.getCellDiagonalUpBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal up border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y + cellWidget.height + cellBottomMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y - cellTopMargin, lineWidth);
            // }
        }
        border = layout.getCellDiagonalDownBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal down border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth);
        }
        // }
    }
    private renderCellBackground(height: number, cellWidget: TableCellWidget, leftMargin: number, lineWidth: number): void {
        let cellFormat: WCellFormat = cellWidget.cellFormat;
        let bgColor: string = cellFormat.shading.backgroundColor === '#ffffff' ?
            cellWidget.ownerTable.tableFormat.shading.backgroundColor : cellFormat.shading.backgroundColor;
        let left: number = cellWidget.x - leftMargin - lineWidth;
        let topMargin: number = cellWidget.topMargin ? HelperMethods.convertPointToPixel(cellWidget.topMargin) : 0;
        let top: number = cellWidget.y - topMargin;
        let width: number = cellWidget.width + leftMargin + cellWidget.margin.right - lineWidth;
        if (cellWidget.ownerRow.rowFormat.revisions.length > 0) {
            let revision: Revision = cellWidget.ownerRow.rowFormat.revisions[cellWidget.ownerRow.rowFormat.revisions.length - 1];
            bgColor = (revision.revisionType === 'Insertion') ? '#e1f2fa' : '#fce6f4';
        }
        this.pageContext.beginPath();
        if (bgColor !== 'empty') {
            this.pageContext.fillStyle = HelperMethods.getColor(bgColor);
            this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
            this.pageContext.closePath();
        }
        //Render foreground color
        if (cellFormat.shading.hasValue('foregroundColor') && cellFormat.shading.textureStyle !== 'TextureNone') {
            this.pageContext.beginPath();
            if (cellFormat.shading.foregroundColor !== 'empty') {
                this.pageContext.fillStyle = HelperMethods.getColor(cellFormat.shading.foregroundColor);
                this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
                this.pageContext.closePath();
            }
        }

    }
    private renderSingleBorder(color: string, startX: number, startY: number, endX: number, endY: number, lineWidth: number): void {
        this.pageContext.beginPath();
        this.pageContext.moveTo(this.getScaledValue(startX, 1), this.getScaledValue(startY, 2));
        this.pageContext.lineTo(this.getScaledValue(endX, 1), this.getScaledValue(endY, 2));
        this.pageContext.lineWidth = this.getScaledValue(lineWidth);
        // set line color
        this.pageContext.strokeStyle = HelperMethods.getColor(color);
        if (lineWidth > 0) {
            this.pageContext.stroke();
        }
        this.pageContext.closePath();
    }
    public getScaledValue(value: number, type?: number): number {
        if (this.isPrinting) {
            return value;
        }
        if (isNullOrUndefined(type)) {
            type = 0;
        }
        let x: number = value * this.documentHelper.zoomFactor;
        return x + (type === 1 ? this.pageLeft : (type === 2 ? this.pageTop : 0));
    }
    private checkRevisionType(elementBox: ElementBox): RevisionInfo[] {
        let revisions: RevisionInfo[] = [];
        let count: number = elementBox.revisions.length;
        for (let i: number = 0; i < count; i++) {
            let currentRevision: Revision = elementBox.revisions[i];
            let color: string = this.documentHelper.authors.get(currentRevision.author);
            revisions.push({ 'type': currentRevision.revisionType, 'color': color });
        }
        return revisions
    }
    private getRevisionColor(revisionInfo: RevisionInfo[]): string {
        if (revisionInfo.length === 1) {
            return revisionInfo[0].color;
        }

        for (let i = 0; i < revisionInfo.length; i++) {
            if (revisionInfo[i].type === 'Deletion' || revisionInfo[i].type === 'MoveFrom') {
                return revisionInfo[i].color;
            }
        }
        return undefined;

    }
    private getRevisionType(revisionInfo: RevisionInfo[], checkInsert: boolean): RevisionInfo {
        if (revisionInfo.length === 0) {
            return undefined;
        }
        for (let i: number = 0; i < revisionInfo.length; i++) {
            let type: RevisionInfo = undefined;
            if (checkInsert && (revisionInfo[i].type === 'Insertion' || revisionInfo[i].type === 'MoveTo')) {
                type = revisionInfo[i];
                this.pageContext.fillStyle = HelperMethods.getColor(type.color);
                revisionInfo.splice(i, 1);
                return type;
            }
            if (!checkInsert && (revisionInfo[i].type === 'Deletion' || revisionInfo[i].type === 'MoveFrom')) {
                type = revisionInfo[i];
                this.pageContext.fillStyle = HelperMethods.getColor(type.color);
                revisionInfo.splice(i, 1);
                return type;
            }
        }
        return undefined;
    }
    /**
     * Destroys the internal objects which is maintained.
     * 
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        if (!isNullOrUndefined(this.pageCanvasIn)) {
            this.pageCanvasIn.innerHTML = '';
        }
        this.pageCanvasIn = undefined;
    }
}
