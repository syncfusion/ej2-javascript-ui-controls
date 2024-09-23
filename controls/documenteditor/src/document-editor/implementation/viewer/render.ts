import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { WCharacterFormat, WParagraphFormat } from '../index';
import { WCellFormat } from '../index';
import { WBorder } from '../index';
import { WBorders } from '../index';
import {
    Page, Rect, IWidget, Widget, ImageElementBox, LineWidget, ParagraphWidget,
    BodyWidget, TextElementBox, ElementBox, HeaderFooterWidget, ListTextElementBox,
    TableRowWidget, TableWidget, TableCellWidget, FieldElementBox, TabElementBox, BlockWidget, ErrorTextElementBox,
    CommentCharacterElementBox, ShapeElementBox, EditRangeStartElementBox, FootNoteWidget, ShapeBase,
    FootnoteElementBox, TextFrame, BookmarkElementBox, EditRangeEndElementBox,
    ContentControl
} from './page';
import { BaselineAlignment, HighlightColor, Underline, Strikethrough, TabLeader, CollaborativeEditingSettingsModel, TextureStyle } from '../../index';
import { Layout } from './layout';
import { LayoutViewer, PageLayoutViewer, WebLayoutViewer, DocumentHelper } from './viewer';
import { HelperMethods, ErrorInfo, Point, SpecialCharacterInfo, SpaceCharacterInfo, WordSpellInfo, RevisionInfo, BorderInfo, BorderRenderInfo } from '../editor/editor-helper';
import { SearchWidgetInfo, WColor, CharacterRangeType } from '../../index';
import { SelectionWidgetInfo } from '../selection';
import { SpellChecker } from '../spell-check/spell-checker';
import { Revision } from '../track-changes/track-changes';
import { WColumnFormat, WSectionFormat } from '../format';
import { FontScriptType, TextWrappingStyle } from '../../index';
import { TextSizeInfo } from './text-helper';
import { DocumentCanvasElement, DocumentCanvasRenderingContext2D } from './document-canvas';
import { Dictionary } from '../../base/dictionary';
import { getPathString, PathSegment, pathSegmentCollection, PointModel, processPathData, splitArrayCollection, transformPath } from '../utility/path-util';

/**
 * @private
 */
export class Renderer {
    /**
     * @private
     */
    public commentMarkDictionary: Dictionary<HTMLElement, CommentCharacterElementBox[]> =
    new Dictionary<HTMLElement, CommentCharacterElementBox[]>();
    public isPrinting: boolean = false;
    public isExporting: boolean =  false;
    private pageLeft: number = 0;
    private pageTop: number = 0;
    private documentHelper: DocumentHelper;
    private pageIndex: number = -1;
    private pageCanvasIn: HTMLCanvasElement;
    private isFieldCode: boolean = false;
    private isRenderHeader: boolean = false;
    private leftPosition: number = 0;
    private topPosition: number = 0;
    private height: number = 0;
    private exportPageCanvas: DocumentCanvasElement;
    private fieldStacks: FieldElementBox[] = [];
    public get pageCanvas(): HTMLCanvasElement | DocumentCanvasElement {
        if (this.isPrinting) {
            if (isNullOrUndefined(this.pageCanvasIn)) {
                this.pageCanvasIn = document.createElement('canvas');
                this.pageCanvasIn.getContext('2d').save();
            }
            return this.pageCanvasIn;
        }
        if (this.isExporting) {
            if (isNullOrUndefined(this.exportPageCanvas)) {
                this.exportPageCanvas = new DocumentCanvasElement();
            }
            return this.exportPageCanvas;
        } else {
            return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.containerCanvas;
        }
    }
    public get spellChecker(): SpellChecker {
        try{
            return this.documentHelper.owner.spellCheckerModule;
        } catch {
            return undefined;
        }
    }
    private get selectionCanvas(): HTMLCanvasElement {
        return isNullOrUndefined(this.viewer) ? undefined : this.documentHelper.selectionCanvas;
    }
    private get pageContext(): CanvasRenderingContext2D | DocumentCanvasRenderingContext2D {
        return this.pageCanvas.getContext('2d');
    }
    private get selectionContext(): CanvasRenderingContext2D | DocumentCanvasRenderingContext2D {
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
            this.renderHFWidgets(page, page.headerWidgetIn, width, true);
        }
        if (page.footerWidget) {
            this.renderHFWidgets(page, page.footerWidgetIn, width, false);
        }
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            this.render(page, page.bodyWidgets[parseInt(i.toString(), 10)]);
            if (page.footnoteWidget && this.documentHelper.owner.layoutType === 'Pages') {
                this.renderfootNoteWidget(page, page.footnoteWidget, width);
            }
        }
        if (page.endnoteWidget && this.documentHelper.owner.layoutType === 'Pages') {
            this.renderfootNoteWidget(page, page.endnoteWidget, width);
        }
        if (this.documentHelper.owner.enableHeaderAndFooter && !this.isPrinting) {
            this.renderHeaderSeparator(page, this.pageLeft, this.pageTop, page.headerWidgetIn);
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
        if (this.isFieldCode) {
            this.isFieldCode = false;
        }
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
            let footerHeight: number;
            if (isNullOrUndefined(page.footerWidgetIn.sectionFormat)) {
                footerHeight = page.boundingRectangle.height -
                /* eslint-disable-next-line max-len */
                Math.max(page.footerWidgetIn.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidgetIn.sectionFormat.bottomMargin));
            } else {
                footerHeight = page.boundingRectangle.height -
                /* eslint-disable-next-line max-len */
                Math.max(page.footerWidgetIn.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidgetIn.sectionFormat.bottomMargin));
            }
            height = Math.max(page.boundingRectangle.height - headerFooterHeight, footerHeight);
            pageHt = page.boundingRectangle.height - footerDistance;
        }
        this.renderFloatingItems(page, widget.floatingElements, 'Behind');
        for (let i: number = 0; i < widget.childWidgets.length; i++) {
            const block: BlockWidget = widget.childWidgets[parseInt(i.toString(), 10)] as BlockWidget;
            if (!isHeader) {
                height += block.height;
            }
            // if (isHeader || !isHeader && this.getScaledValue(Math.round(height)) <= this.getScaledValue(Math.round(pageHt))) {
            this.renderWidget(page, block);
            // }
        }
        this.renderFloatingItems(page, widget.floatingElements, 'InFrontOfText');
        if (cliped) {
            this.pageContext.restore();
        }
        if (!this.isPrinting) {
            this.pageContext.globalAlpha = this.documentHelper.owner.enableHeaderAndFooter ? 0.50 : 1;
        }
    }
    private renderHeaderSeparator(page: Page, left: number, top: number, widget: HeaderFooterWidget): void {
        //Header Widget
        const topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
        let y: number = this.getScaledValue(Math.max((widget.y + widget.height), Math.abs(topMargin)));
        const pageWidth: number = this.getScaledValue(page.boundingRectangle.width);
        const ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D = this.pageContext;
        ctx.save();
        ctx.globalAlpha = 0.85;
        const headerFooterHeight: number = (this.getScaledValue(page.boundingRectangle.height) / 100) * 40;
        //Maximum header height limit
        y = Math.min(y, headerFooterHeight);
        //Dash line Separator
        this.renderDashLine(ctx, left, top + y, pageWidth, '#000000', false);
        let type: string = this.getHeaderFooterType(page, true);
        const index: number = (this.viewer as PageLayoutViewer).getHeaderFooter(widget.headerFooterType);
        const sectionIndex: number = page.sectionIndex;
        const l10n: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        l10n.setLocale(this.documentHelper.owner.locale);
        if (this.documentHelper.headersFooters.length > 1) {
            const sectionMarkIndex: number = sectionIndex + 1;
            type = type + ' -' + l10n.getConstant('Section') + ' ' + sectionMarkIndex + '-';
        }
        ctx.font = '9pt Arial';
        let width: number = ctx.measureText(type).width;
        this.renderHeaderFooterMark(ctx, left + 5, top + y, width + 10, 20);
        this.renderHeaderFooterMarkText(ctx, type, left + 10, y + top + 15);
        let headerFooterWidget: HeaderFooterWidget;
        if (this.documentHelper.headersFooters[parseInt(sectionIndex.toString(), 10)]) {
            headerFooterWidget = this.documentHelper.headersFooters[parseInt(
                sectionIndex.toString(), 10)][parseInt(index.toString(), 10)] as HeaderFooterWidget;
        }
        if (sectionIndex !== 0 && !headerFooterWidget) {
            const content: string = l10n.getConstant('Same as Previous');
            const width: number = ctx.measureText(content).width;
            const right: number = this.viewer.containerWidth - width - 75 + left;
            this.renderHeaderFooterMark(ctx, right, top + y, width + 10, 20);
            this.renderHeaderFooterMarkText(ctx, content, right + 5, y + top + 15);
        }
        if (page.footerWidget) {
            //Footer Widget
            const footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);

            let footerHeight: number = this.getScaledValue(page.boundingRectangle.height) -
                /* eslint-disable-next-line max-len */
                this.getScaledValue(Math.max(page.footerWidgetIn.height + footerDistance, Math.abs(HelperMethods.convertPointToPixel(page.footerWidgetIn.sectionFormat.bottomMargin))));
            //Maximum footer height limit
            footerHeight = Math.max((this.getScaledValue(page.boundingRectangle.height) - headerFooterHeight), footerHeight);
            this.renderDashLine(ctx, left, top + footerHeight, pageWidth, '#000000', false);
            let type: string = this.getHeaderFooterType(page, false);
            const sectionIndex: number = page.sectionIndex;
            if (this.documentHelper.headersFooters.length > 1) {
                const sectionMarkIndex: number = sectionIndex + 1;
                type = type + ' -' + l10n.getConstant('Section') + ' ' + sectionMarkIndex + '-';
            }
            width = ctx.measureText(type).width;
            this.renderHeaderFooterMark(ctx, left + 5, top + footerHeight - 20, width + 10, 20);
            this.renderHeaderFooterMarkText(ctx, type, left + 10, top + footerHeight - 5);
            const index: number = (this.viewer as PageLayoutViewer).getHeaderFooter(page.footerWidget.headerFooterType);
            let headerFooterWidget: HeaderFooterWidget;
            if (this.documentHelper.headersFooters[parseInt(sectionIndex.toString(), 10)]) {
                headerFooterWidget = this.documentHelper.headersFooters[parseInt(
                    sectionIndex.toString(), 10)][parseInt(index.toString(), 10)] as HeaderFooterWidget;
            }
            if (sectionIndex !== 0 && !headerFooterWidget) {
                const content: string = l10n.getConstant('Same as Previous');
                const width: number = ctx.measureText(content).width;
                const right: number = this.viewer.containerWidth - width - 75 + left;
                this.renderHeaderFooterMark(ctx, right, top + footerHeight - 20, width + 10, 20);
                this.renderHeaderFooterMarkText(ctx, content, right + 5, top + footerHeight - 5);
            }
            ctx.restore();
        }
    }

    private getFooterHeight(page: Page): number {
        const footerWidgetHeight: number = ((page.boundingRectangle.height) / 100) * 40;
        const footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
        const actualHeight: number = page.boundingRectangle.height -
            Math.max(page.footerWidgetIn.height + footerDistance, HelperMethods.convertPointToPixel(
                page.footerWidgetIn.sectionFormat.bottomMargin));
        return Math.max((page.boundingRectangle.height) - footerWidgetHeight, actualHeight);
    }

    private getHeaderFooterType(page: Page, isHeader: boolean): string {
        let type: string;
        const l10n: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
        l10n.setLocale(this.documentHelper.owner.locale);
        type = isHeader ? l10n.getConstant('Header') : l10n.getConstant('Footer');
        if (page.bodyWidgets[0].sectionFormat.differentFirstPage &&
            (isNullOrUndefined(page.previousPage) || page.sectionIndex !== page.previousPage.sectionIndex)) {
            type = isHeader ? l10n.getConstant('First Page Header') : l10n.getConstant('First Page Footer');
        } else if (page.bodyWidgets[0].sectionFormat.differentOddAndEvenPages) {
            if ((this.documentHelper.pages.indexOf(page) + 1) % 2 === 0) {
                type = isHeader ? l10n.getConstant('Even Page Header') : l10n.getConstant('Even Page Footer');
            } else {
                type = isHeader ? l10n.getConstant('Odd Page Header') : l10n.getConstant('Odd Page Footer');
            }
        }
        return type;
    }

    /* eslint-disable-next-line max-len */
    public renderDashLine(context: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D, x: number, y: number, width: number, fillStyle: string, isSmallDash: boolean): void {
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

    public renderSolidLine(context: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D, x: number, y: number,
                           width: number, fillStyle: string): void {
        context.beginPath();
        context.strokeStyle = fillStyle;
        context.lineWidth = 0.5;
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.stroke();
        context.closePath();
    }
    private renderHeaderFooterMark(ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D, x: number, y: number,
                                   w: number, h: number): void {
        ctx.beginPath();
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, w, h);
        ctx.closePath();
    }
    private renderHeaderFooterMarkText(ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D, content: string,
                                       x: number, y: number): void {
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
        /* eslint-disable */
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            if (!isNullOrUndefined(page.bodyWidgets[i].floatingElements)) {
                this.renderFloatingItems(page, page.bodyWidgets[i].floatingElements, 'Behind');
            }
        }
        /* eslint-enable */
        let isClipped: boolean = false;

        let nextColumnBody: BodyWidget;
        if (!isNullOrUndefined(bodyWidget.nextRenderedWidget)
            && bodyWidget.columnIndex + 1 === (bodyWidget.nextRenderedWidget as BodyWidget).columnIndex) {
            nextColumnBody = bodyWidget.nextRenderedWidget  as BodyWidget;
        }
        if (!(this.viewer instanceof WebLayoutViewer) && bodyWidget.sectionFormat.columns.length > 1
        && !isNullOrUndefined(nextColumnBody)) {
            const colIndex: number = page.bodyWidgets.indexOf(bodyWidget);
            let xPos: number;
            let width: number;
            if (bodyWidget.columnIndex === 0) {
                /* eslint-disable */
                xPos = page.bodyWidgets[colIndex].x - HelperMethods.convertPointToPixel(page.bodyWidgets[colIndex].sectionFormat.leftMargin);
                width = HelperMethods.convertPointToPixel(page.bodyWidgets[colIndex].sectionFormat.leftMargin) + (bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).width + ((bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).space / 2);
                /* eslint-enable */
            } else if (colIndex === bodyWidget.sectionFormat.columns.length - 1) {
                /* eslint-disable */
                xPos = page.bodyWidgets[colIndex].x - ((bodyWidget.sectionFormat.columns[bodyWidget.columnIndex - 1] as WColumnFormat).space / 2);
                width = HelperMethods.convertPointToPixel(page.bodyWidgets[colIndex].sectionFormat.rightMargin) + (bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).width + ((bodyWidget.sectionFormat.columns[bodyWidget.columnIndex - 1] as WColumnFormat).space / 2);
                /* eslint-enable */
            } else {
                /* eslint-disable */
                xPos = page.bodyWidgets[colIndex].x - ((bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).space / 2);
                width = (bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).width + (bodyWidget.sectionFormat.columns[bodyWidget.columnIndex] as WColumnFormat).space;
                /* eslint-enable */
            }
            /* eslint-disable */
            this.clipRect(xPos, page.bodyWidgets[colIndex].y, this.getScaledValue(width), this.getScaledValue(page.boundingRectangle.height));
            /* eslint-enable */
            isClipped = true;
        }
        for (let i: number = 0; i < bodyWidget.childWidgets.length; i++) {
            const widget: Widget = bodyWidget.childWidgets[parseInt(i.toString(), 10)] as ParagraphWidget;
            if (i === 0 && bodyWidget.childWidgets[0] instanceof TableWidget &&
                ((bodyWidget.childWidgets[0] as TableWidget).childWidgets.length > 0) &&
                page.repeatHeaderRowTableWidget) {
                /* eslint-disable-next-line max-len */
                this.renderHeader(page, widget as TableWidget, this.documentHelper.layout.getHeader(bodyWidget.childWidgets[0] as TableWidget));
            }

            this.renderWidget(page, widget);
        }
        if (isClipped) {
            this.pageContext.restore();
        }
        /* eslint-disable */
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            if (!isNullOrUndefined(page.bodyWidgets[i].floatingElements)) {
                this.renderFloatingItems(page, page.bodyWidgets[i].floatingElements, 'InFrontOfText');
            }
        }
        /* eslint-enable */
        for (let i: number = 0; i < page.bodyWidgets.length; i++) {
            if (page.bodyWidgets[parseInt(i.toString(), 10)].sectionFormat.lineBetweenColumns === true) {
                if (page.bodyWidgets[parseInt(i.toString(), 10)].columnIndex !== 0 && page.bodyWidgets.length > 1) {
                    const topMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin);
                    const linestartY: number =
                    this.getScaledValue(Math.max((page.headerWidgetIn.y + page.headerWidgetIn.height), topMargin));
                    const headerFooterHeight: number = (this.getScaledValue(page.boundingRectangle.height) / 100) * 40;
                    const footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
                    let footerHeight: number = this.getScaledValue(page.boundingRectangle.height) -
                        /* eslint-disable-next-line max-len */
                        this.getScaledValue(Math.max(page.footerWidgetIn.height + footerDistance, HelperMethods.convertPointToPixel(page.footerWidgetIn.sectionFormat.bottomMargin)));
                    footerHeight = Math.max((this.getScaledValue(page.boundingRectangle.height) - headerFooterHeight), footerHeight);
                    const inBetweenSpace: number =
                        (page.bodyWidgets[parseInt(i.toString(), 10)].x
                            - (page.bodyWidgets[parseInt(i.toString(), 10)].previousRenderedWidget.x
                                + page.bodyWidgets[parseInt(i.toString(), 10)].previousRenderedWidget.width)) / 2;
                    const startX: number = inBetweenSpace + (page.bodyWidgets[parseInt(i.toString(), 10)].previousRenderedWidget.x
                        + page.bodyWidgets[parseInt(i.toString(), 10)].previousRenderedWidget.width);
                    let startY: number = linestartY / this.documentHelper.zoomFactor;
                    const endX: number = startX;
                    let endY: number;
                    if (page.footnoteWidget) {
                        endY = ((footerHeight - (page.footerWidgetIn.height / 2))
                            - page.footnoteWidget.height * this.documentHelper.zoomFactor) / this.documentHelper.zoomFactor;
                    } else {
                        endY = (footerHeight - (page.footerWidgetIn.height / 2)) / this.documentHelper.zoomFactor;
                    }
                    const firstBody: BodyWidget = this.documentHelper.layout.getBodyWidget(
                        page.bodyWidgets[parseInt(i.toString(), 10)], true);
                    const height: number = this.documentHelper.layout.getNextWidgetHeight(firstBody);
                    startY = page.bodyWidgets[parseInt(i.toString(), 10)].y;
                    endY = height;
                    const color: string = '#000000';
                    this.renderSingleBorder(color, startX, startY, endX, endY, 0.5, 'Single');
                }
            }
        }
    }

    private renderFloatingItems(page: Page, floatingElements: (ShapeBase | TableWidget)[], wrappingType: TextWrappingStyle): void {
        if (!isNullOrUndefined(floatingElements) && floatingElements.length > 0) {
            const overLappedShapeWidgets : Dictionary<number, ShapeBase> = new Dictionary<number, ShapeBase>();
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
                if (!this.isOverLappedShapeWidget(shape) || overLappedShapeWidgets.containsKey(shape.zOrderPosition)) {
                    if (shape instanceof ImageElementBox) {
                        this.renderImageElementBox(shape, shape.x, shape.y, 0);
                    } else if (shape instanceof ShapeElementBox) {
                        let shapeLeft: number = this.getScaledValue(shape.x, 1);
                        let shapeTop: number = this.getScaledValue(shape.y, 2);
                        this.renderShapeElementBox(shape, shapeLeft, shapeTop, page);
                    }
                } else if (!overLappedShapeWidgets.containsKey(shape.zOrderPosition)) {
                    overLappedShapeWidgets.add(shape.zOrderPosition, shape);
                }
            }
            if (overLappedShapeWidgets.length > 0) {
                let sortedOverLappedShapeWidgets: number[] = overLappedShapeWidgets.keys.sort();
                for (let j: number = 0; j < sortedOverLappedShapeWidgets.length; j++) {
                    let shape: ShapeBase = overLappedShapeWidgets.get(sortedOverLappedShapeWidgets[j]) as ShapeBase;
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
    }

    private isOverLappedShapeWidget(floatingElement: ShapeBase): boolean {
        return ((floatingElement instanceof ImageElementBox
            && floatingElement.textWrappingStyle !== 'Inline'
            && floatingElement.textWrappingStyle !== 'Behind'
            && !(this.documentHelper.compatibilityMode !== 'Word2013'
            && (floatingElement.isBelowText
            && floatingElement.textWrappingStyle !== 'InFrontOfText')))
            || (floatingElement instanceof ShapeElementBox
            && floatingElement.textWrappingStyle !== 'Inline'
            && floatingElement.textWrappingStyle !== 'Behind'
            && !(this.documentHelper.compatibilityMode !== 'Word2013'
            && (floatingElement.isBelowText
            && floatingElement.textWrappingStyle !== 'InFrontOfText'))));
    }
    private renderShapeElementBox(shape: ShapeElementBox, shapeLeft: number, shapeTop: number, page: Page): void {
        if (shape.isHorizontalRule) {
            return;
        }
        let isZeroShapeHeight: boolean = (shape.height === 0) ? true : false;
        let shapeType: any = shape.autoShapeType;
        let blocks: BlockWidget[] = shape.textFrame.childWidgets as BlockWidget[];
        this.pageContext.beginPath();
        if (shape.fillFormat && shape.fillFormat.color && shape.fillFormat.fill && shapeType !== 'StraightConnector') {
            this.pageContext.fillStyle = shape.fillFormat.color;
            if(shapeType === 'Rectangle') {
                this.pageContext.fillRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
            } 
            else {
                this.renderPathElement(shape, shapeLeft, shapeTop);
            }
        }
        if (!isNullOrUndefined(shapeType)) {
            if (shape.lineFormat.line && shape.lineFormat.lineFormatType !== 'None') {
                this.pageContext.lineWidth = shape.lineFormat.weight;
                this.pageContext.strokeStyle = HelperMethods.getColor(shape.lineFormat.color);
                if (shapeType === 'Rectangle') {
                    this.pageContext.strokeRect(shapeLeft, shapeTop, this.getScaledValue(shape.width), this.getScaledValue(shape.height));
                } else if(shapeType === 'StraightConnector') {
                    this.pageContext.moveTo(shapeLeft, shapeTop);
                    this.pageContext.lineTo(shapeLeft + this.getScaledValue(shape.width), shapeTop + this.getScaledValue(shape.height));
                    this.pageContext.stroke();
                }
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
                shape.height = HelperMethods.round((shape.height + blocks[i].height), 5);
            }
        }
        if (isZeroShapeHeight) {
            isZeroShapeHeight = false;
        }
        if (isClipped) {
            this.pageContext.restore();
        }
    }
    private renderPathElement(shape: ShapeElementBox, x: number, y: number) {
        let pathData: string;
        if (shape.autoShapeType && shape.autoShapeType != 'Unknown') {
            switch(shape.autoShapeType){
                case 'ElbowConnector':
                    pathData = this.getConnectorPathData(shape);
                    break;
                case 'CurvedConnector':
                    pathData = this.getCurvedPathData(shape);
                    break;
                default:
                    pathData = this.getShape(shape.autoShapeType);
                    break;
            }
        } else if(shape.autoShapeType) {
            pathData = this.constructPath(shape);
        }
        if (pathData) {
            let bounds: Rect = this.calculatePathBounds(pathData);
            let data: string = this.updatePath(pathData, bounds, shape);
            this.drawPath(data, shape, x, y);
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

    private getConnectorPathData(shape: ShapeElementBox): string{
        const startX = shape.distanceTop;
        const startY = shape.distanceLeft;
        const endX = shape.distanceTop + this.getScaledValue(shape.width);
        const endY = shape.distanceLeft + this.getScaledValue(shape.height);

        // Determine the mid points
        const midX = startX + (endX - startX) / 2;
        // const midY = startY + (endY - startY) / 2;

        // Create the path data
        let pathData = `M ${startX},${startY} `; // Move to the start point
        pathData += `L ${midX},${startY} `; // Horizontal line to the middle X
        pathData += `L ${midX},${endY} `; // Vertical line to the end Y
        pathData += `L ${endX},${endY}`; // Horizontal line to the end point
        return pathData;
    }

    private getCurvedPathData(shape: ShapeElementBox) {
        const startX = shape.distanceTop;
        const startY = shape.distanceLeft;
        const endX = shape.distanceTop + this.getScaledValue(shape.width);
        const endY = shape.distanceLeft + this.getScaledValue(shape.height);


        // Control points for the Bezier curve
        const controlPoint1X = startX + this.getScaledValue(shape.width) / 1.5;
        const controlPoint1Y = startY;

        const controlPoint2X = endX - this.getScaledValue(shape.width) / 1.5;
        const controlPoint2Y = endY;

        // Create the path data using cubic Bezier curve command
        const pathData = `M ${startX},${startY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}`;

        return pathData;
    }
    private constructPath(shape: ShapeElementBox): string {
        let points: any = shape.editingPoints;
        const coords = {};

        for (var key in points) {
            if (points.hasOwnProperty(key)) {
                // Assigning key-value pairs to the new object
                coords[key] = this.calculateCoord(points[key], 400, 400);
            }
        }
        // Create path data using the coordinates
        const pathData = `
      M ${(coords as any).connsiteX0},${(coords as any).connsiteY0}
      L ${(coords as any).connsiteX1},${(coords as any).connsiteY1}
      L ${(coords as any).connsiteX2},${(coords as any).connsiteY2}
      L ${(coords as any).connsiteX3},${(coords as any).connsiteY3}
      L ${(coords as any).connsiteX4},${(coords as any).connsiteY4}
      Z
    `;

    return pathData;
    }
    private calculateCoord(pointValue: string, w: number, h: number) {
        const parts = pointValue.split(" ");
        const operation = parts[0];
        const numerator = parseFloat(parts[1]);
        const dimension = parts[2] === 'w' ? w : h;
        const denominator = parseFloat(parts[3]);

        if (operation === "*/") {
            return (numerator / denominator) * dimension;
        }
        return 0; // Default return value if operation is not recognized
    }
    private drawPath(data: string, shape: ShapeElementBox, x: number, y: number): void {
        let collection: Object[] = [];
        collection = processPathData(data);
        collection = pathSegmentCollection(collection);
        this.setStyle(shape);
        const ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D = this.pageContext;
        if ((ctx as CanvasRenderingContext2D).translate) {
            ctx.save();
            ctx.beginPath();
            //this.rotateContext(canvas, options.angle, pivotX, pivotY);
            (ctx as CanvasRenderingContext2D).translate(x, y);
            this.renderPath(ctx, collection);
            ctx.fill();
            (ctx as CanvasRenderingContext2D).translate(-x, -y);
            ctx.stroke();
            ctx.restore();
        }
    }
    private renderPath(canvas: any, collection: Object[]): void {
        const ctx: CanvasRenderingContext2D = canvas;
        let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
        let x: number; let y: number; let length: number; let i: number; const segs: Object[] = collection;
        for (x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
            const obj: Object = segs[parseInt(i.toString(), 10)]; const seg: PathSegment = obj; const char: string = seg.command;
            if ('x1' in seg) { x1 = seg.x1; }
            if ('x2' in seg) { x2 = seg.x2; }
            if ('y1' in seg) { y1 = seg.y1; }
            if ('y2' in seg) { y2 = seg.y2; }
            if ('x' in seg) { x = seg.x; }
            if ('y' in seg) { y = seg.y; }
            switch (char) {
            case 'M':
                ctx.moveTo(x, y); seg.x = x; seg.y = y;
                break;
            case 'L':
                ctx.lineTo(x, y); seg.x = x; seg.y = y;

                break;
            case 'C':
                ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1; seg.x2 = x2; seg.y2 = y2;
                break;
            case 'Q':
                ctx.quadraticCurveTo(x1, y1, x, y);
                seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1;
                break;
            case 'A':
            // eslint-disable-next-line
            let curr: PointModel = { x: x0, y: y0 }; let rx: number = seg.r1; let ry: number = seg.r2;
            const xAxisRotation: number = seg.angle * (Math.PI / 180.0);
            const largeArc: boolean = seg.largeArc; const sweep: boolean = seg.sweep; const cp: PointModel = { x: x, y };
                    const currp: PointModel = {
                        x:
                            Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                        y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                    };
                    const l: number = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                    if (l > 1) {
                        rx *= Math.sqrt(l);
                        ry *= Math.sqrt(l);
                    }
                    const k: number = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                    let s: number = (largeArc === sweep ? -1 : 1) * Math.sqrt(
                        ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                        (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
                    );
                    if (isNaN(s)) {
                        s = 0;
                    }
                const cpp: PointModel = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                    const centp: PointModel = {
                        x:
                        (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                    y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                };
                const a1: number = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                const u: number[] = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                const v: number[] = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                let ad: number = this.a(u, v);
                if (this.r(u, v) <= -1) {
                    ad = Math.PI;
                }
                if (this.r(u, v) >= 1) {
                    ad = 0;
                  }
                const dir: number = !sweep ? -1.0 : 1.0;
                const ah: number = a1 + dir * (ad / 2.0);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const halfWay: PointModel = {
                        x:
                            centp.x + rx * Math.cos(ah),
                        y: centp.y + ry * Math.sin(ah)
                    };
                seg.centp = centp; seg.xAxisRotation = xAxisRotation; seg.rx = rx;
                seg.ry = ry; seg.a1 = a1; seg.ad = ad; seg.sweep = sweep;
                if (ctx != null) {
                    const ra: number = rx > ry ? rx : ry;
                    const sx: number = rx > ry ? 1 : rx / ry;
                    const sy: number = rx > ry ? ry / rx : 1;
                    ctx.save();
                    ctx.translate(centp.x, centp.y);
                    ctx.rotate(xAxisRotation);
                    ctx.scale(sx, sy);
                    ctx.arc(0, 0, ra, a1, a1 + ad, !sweep);
                    ctx.scale(1 / sx, 1 / sy);
                    ctx.rotate(-xAxisRotation);
                    ctx.translate(-centp.x, -centp.y);
                    ctx.restore();
                }
                break;
            case 'Z':
            case 'z':
                ctx.closePath();
                x = x0; y = y0;
                break;
            }
            x0 = x; y0 = y;
        }
}

// vector magnitude
private m(v: number[]): number { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
// ratio between two vectors
private r(u: number[], v: number[]): number { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); }
// angle between two vectors
private a(u: number[], v: number[]): number { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); }

private updatePath(pathData: string, bounds: Rect, shape: ShapeElementBox): string {
    let isScale: boolean = false;
    let newPathString: string = '';
    let scaleX: number = - bounds.x;
    let scaleY: number = - bounds.y;
    let arrayCollection: Object[] = [];
    if (this.getScaledValue(shape.width) !== bounds.width || this.getScaledValue(shape.height) !== bounds.height) {
        scaleX = this.getScaledValue(shape.width) / Number(bounds.width ? bounds.width : 1);
        scaleY = this.getScaledValue(shape.height) / Number(bounds.height ? bounds.height : 1);
        isScale = true;
    }
    arrayCollection = processPathData(pathData);
    arrayCollection = splitArrayCollection(arrayCollection);
    if ((isScale)) {
        newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bounds.x, bounds.y, 0, 0);
    } else {
        newPathString = getPathString(arrayCollection);
    }
    isScale = false;
    return newPathString;
}

private calculatePathBounds(data: string): Rect {
    // Create an SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    document.body.appendChild(svg); // Append to the DOM to ensure rendering context

    // Create a path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", data);
    svg.appendChild(path);

    // Get the bounding box of the path
    const bounds = path.getBBox();

    // Remove the temporary SVG element
    svg.remove();

    const svgBounds: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
    return svgBounds;
}

    private setStyle(shape: ShapeElementBox): void {
        const ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D = this.pageContext;
        if (shape.lineFormat.color === 'none') { 
            shape.lineFormat.color = 'transparent'; 
        }
        ctx.strokeStyle = HelperMethods.getColor(shape.lineFormat.color);
        ctx.lineWidth = shape.lineFormat.weight;
        if (shape.lineFormat.weight === 0) {
            ctx.strokeStyle = 'transparent';
        }
        //ctx.globalAlpha = style.opacity;
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
            this.renderSingleBorder(color, leftPosition, topPosition, leftPosition, height, 1, "Single");
            //Top border
            if (isNullOrUndefined(previousWidget) || !previousWidget.locked || widget.lockedBy !== previousWidget.lockedBy) {
                this.renderSingleBorder(color, leftPosition, topPosition, leftPosition + pageWidth, topPosition, 1, "Single");
            }
            //Right border
            this.renderSingleBorder(color, leftPosition + pageWidth, topPosition, leftPosition + pageWidth, height, 1, "Single");
            if (isNullOrUndefined(nextWidget) || !nextWidget.locked || widget.lockedBy !== nextWidget.lockedBy) {
                // Bottom border
                this.renderSingleBorder(color, leftPosition, height, leftPosition + pageWidth, height, 1, "Single");
            }
        }
    }
    private renderHeader(page: Page, widget: TableWidget, header: TableRowWidget): void {
        if (isNullOrUndefined(header)) {
            return;
        }
        //Updated client area for current page
        page.viewer.updateClientArea(page.bodyWidgets[0], page);
        let top: number = page.viewer.clientArea.y;
        let parentTable: TableWidget = header.ownerTable.getSplitWidgets()[0] as TableWidget;
        if (parentTable.childWidgets.length === 0) {
            return;
        }
        if (widget.childWidgets.indexOf(header) !== -1) {
            return;
        }
        let table: TableWidget = parentTable.clone();
        table.childWidgets = [];
        page.viewer.updateClientAreaLocation(table, new Rect(page.viewer.clientArea.x, top, table.width, table.height));
        this.updateTableHeaderRows(header, table, page, top);
        this.isRenderHeader = true;
        for (let j: number = 0; j < table.childWidgets.length; j++) {
            let headerWidget: TableRowWidget = table.childWidgets[j] as TableRowWidget;
            let cell: TableCellWidget = undefined;
            //Renders table cell outline rectangle - Border and background color.
            for (let j: number = 0; j < headerWidget.childWidgets.length; j++) {
                cell = headerWidget.childWidgets[j] as TableCellWidget;
                this.renderTableCellWidget(page, cell);
            }
            top += headerWidget.height;
        }
        this.isRenderHeader = false;
        if (widget.y !== top) {
            //this.Location.Y = top;
            page.documentHelper.layout.updateChildLocationForTable(top, widget);
        }
    }
    private updateTableHeaderRows(headerRow: TableRowWidget, clonedTable: TableWidget, page: Page, top: number): void {
        let table: TableWidget = headerRow.ownerTable;
        let rowSpan: number = 1;
        for (let i: number = 0; i < table.childWidgets.length; i++) {
            let row: TableRowWidget = table.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.isHeader) {
                let clonedRow: TableRowWidget = row.clone();
                clonedTable.childWidgets.push(clonedRow);
                clonedRow.containerWidget = clonedTable;
                page.viewer.updateClientAreaLocation(clonedRow, new Rect(page.viewer.clientArea.x, top, clonedRow.width, clonedRow.height));
                page.documentHelper.layout.updateChildLocationForRow(top, clonedRow);
                top += clonedRow.height;
                if (row == headerRow) {
                    for (let j: number = 0; j < headerRow.childWidgets.length; j++) {
                        let cell: TableCellWidget = headerRow.childWidgets[j] as TableCellWidget;
                        rowSpan = Math.max(rowSpan, cell.cellFormat.rowSpan);
                    }
                    if (rowSpan > 1 && i + rowSpan < table.childWidgets.length) {
                        for (let k: number = 1; k < rowSpan; k++) {
                            let nextRow: TableRowWidget = table.childWidgets[i + k] as TableRowWidget;
                            if (!isNullOrUndefined(nextRow)) {
                                let clonedRow: TableRowWidget = nextRow.clone();
                                clonedTable.childWidgets.push(clonedRow);
                                clonedRow.containerWidget = clonedTable;
                                page.viewer.updateClientAreaLocation(clonedRow, new Rect(page.viewer.clientArea.x, top, clonedRow.width, clonedRow.height));
                                page.documentHelper.layout.updateChildLocationForRow(top, clonedRow);
                                top += clonedRow.height;
                            }
                        }
                    }
                }
            }
        }
    }
    private renderParagraphWidget(page: Page, paraWidget: ParagraphWidget): void {
        if (this.isFieldCode && paraWidget.isFieldCodeBlock) {
            return;
        }
        let top: number = paraWidget.y;
        let left: number = paraWidget.x;
        let isClipped: boolean = false;
        let firstLine: LineWidget = paraWidget.firstChild as LineWidget;
        let paddingLeft: number = 0;
        if(!isNullOrUndefined(firstLine)) {
            for (let i: number = 0; i < firstLine.children.length; i++) {
                const element: ElementBox = firstLine.children[i] as ElementBox;
                if (element instanceof TextElementBox) {
                    paddingLeft = element.padding.left;
                    break;
                }
            }
        }
        if (paddingLeft > 0) {
            this.clipRect(paraWidget.x + paddingLeft, this.getScaledValue(page.boundingRectangle.y), this.getScaledValue(page.boundingRectangle.width), this.getScaledValue(page.boundingRectangle.height));
            isClipped = true;
        }
        if (!(paraWidget.containerWidget instanceof HeaderFooterWidget && paraWidget.containerWidget.isEmpty && !isNullOrUndefined(this.documentHelper.owner.selectionModule) && !isNullOrUndefined(this.documentHelper.selection.start.paragraph) && !this.documentHelper.selection.start.paragraph.isInHeaderFooter)) {
            this.renderParagraphBorder(page, paraWidget);
        }
        if (isClipped) {
            this.pageContext.restore();
        }
        for (let i: number = 0; i < paraWidget.childWidgets.length; i++) {
            let widget: LineWidget = paraWidget.childWidgets[i] as LineWidget;
            top += widget.marginTop;
            this.renderLine(widget, page, left, top);
            top += widget.height;
        }
    }
    private renderParagraphBorder(page: Page, paragraphWidet: ParagraphWidget) {
        let leftBorder: WBorder = paragraphWidet.paragraphFormat.borders.left;
        let topBorder: WBorder = paragraphWidet.paragraphFormat.borders.top;
        let rightBorder: WBorder = paragraphWidet.paragraphFormat.borders.right;
        let bottomBorder: WBorder = paragraphWidet.paragraphFormat.borders.bottom;
        let startX: number = 0;
        let startY: number = 0;
        let endX: number = 0;
        let endY: number = 0;
        let lineWidth: number = 0;
        let firstLine: LineWidget = paragraphWidet.firstChild as LineWidget;
        let lastLine: LineWidget = paragraphWidet.lastChild as LineWidget;
        let canRenderParagraphBorders: BorderRenderInfo = this.documentHelper.canRenderBorder(paragraphWidet);
        if (!isNullOrUndefined(leftBorder) && leftBorder.lineStyle !== 'None') {
            startX = this.documentHelper.getParagraphLeftPosition(paragraphWidet) - HelperMethods.convertPointToPixel(leftBorder.space);
            endX = startX;
            endY = startY + paragraphWidet.height;
            if (topBorder.lineStyle !== 'None' && firstLine.isFirstLine() && !canRenderParagraphBorders.skipTopBorder) {
                startY = paragraphWidet.y + this.getTopMargin(paragraphWidet) - (HelperMethods.convertPointToPixel(topBorder.lineWidth + topBorder.space));
                endY = startY + paragraphWidet.height - (this.getTopMargin(paragraphWidet) - (HelperMethods.convertPointToPixel(topBorder.lineWidth + topBorder.space)));
            }
            else {
                startY = paragraphWidet.y;
                endY = startY + paragraphWidet.height;
            }
            if (bottomBorder.lineStyle !== 'None' && lastLine.isLastLine() && !canRenderParagraphBorders.skipBottomBorder) {
                endY = (endY + HelperMethods.convertPointToPixel(bottomBorder.lineWidth + bottomBorder.space)) - this.getBottomMargin(paragraphWidet);
            }
            lineWidth = HelperMethods.convertPointToPixel(leftBorder.lineWidth);
            this.renderSingleBorder(leftBorder.color, startX, startY, endX, endY, lineWidth, leftBorder.lineStyle);
        }
        if (!isNullOrUndefined(topBorder) && topBorder.lineStyle !== 'None' && firstLine.isFirstLine() && !canRenderParagraphBorders.skipTopBorder) {
            startX = this.documentHelper.getParagraphLeftPosition(paragraphWidet);
            endX = startX + this.getContainerWidth(paragraphWidet, page);
            startY = paragraphWidet.y + this.getTopMargin(paragraphWidet) - (HelperMethods.convertPointToPixel(topBorder.lineWidth + topBorder.space));
            endY = startY;
            if (leftBorder.lineStyle !== 'None') {
                startX -= HelperMethods.convertPointToPixel(leftBorder.space);
            }
            if (rightBorder.lineStyle !== 'None') {
                endX += HelperMethods.convertPointToPixel(rightBorder.space);
            }
            lineWidth = HelperMethods.convertPointToPixel(topBorder.lineWidth);
            this.renderSingleBorder(topBorder.color, startX, startY, endX, endY, lineWidth, topBorder.lineStyle);
        }
        if (!isNullOrUndefined(rightBorder) && rightBorder.lineStyle !== 'None') {
            startX = this.documentHelper.getParagraphLeftPosition(paragraphWidet) + this.getContainerWidth(paragraphWidet, page) + HelperMethods.convertPointToPixel(rightBorder.space);
            startY = endY;
            endX = startX;
            endY = startY + paragraphWidet.height;
            if (topBorder.lineStyle !== 'None' && firstLine.isFirstLine() && !canRenderParagraphBorders.skipTopBorder) {
                startY = paragraphWidet.y + this.getTopMargin(paragraphWidet) - (HelperMethods.convertPointToPixel(topBorder.lineWidth + topBorder.space));
                endY = startY + paragraphWidet.height - (this.getTopMargin(paragraphWidet) - (HelperMethods.convertPointToPixel(topBorder.lineWidth + topBorder.space)));
            }
            else {
                startY = paragraphWidet.y;
                endY = startY + paragraphWidet.height
            }
            if (bottomBorder.lineStyle !== 'None' && lastLine.isLastLine() && !canRenderParagraphBorders.skipBottomBorder) {
                endY = (endY + HelperMethods.convertPointToPixel(bottomBorder.lineWidth + bottomBorder.space)) - this.getBottomMargin(paragraphWidet);
            }
            lineWidth = HelperMethods.convertPointToPixel(rightBorder.lineWidth);
            this.renderSingleBorder(rightBorder.color, startX, startY, endX, endY, lineWidth, rightBorder.lineStyle);
        }
        if (!isNullOrUndefined(bottomBorder) && bottomBorder.lineStyle !== 'None' && lastLine.isLastLine() && !canRenderParagraphBorders.skipBottomBorder) {
            startX = this.documentHelper.getParagraphLeftPosition(paragraphWidet);
            endX = startX + this.getContainerWidth(paragraphWidet, page);
            startY = (paragraphWidet.y + paragraphWidet.height + HelperMethods.convertPointToPixel(bottomBorder.lineWidth + bottomBorder.space)) - (this.getBottomMargin(paragraphWidet));
            endY = startY;
            if (leftBorder.lineStyle !== 'None') {
                startX -= HelperMethods.convertPointToPixel(leftBorder.space);
            }
            if (rightBorder.lineStyle !== 'None') {
                endX += HelperMethods.convertPointToPixel(rightBorder.space);
            }
            lineWidth = HelperMethods.convertPointToPixel(bottomBorder.lineWidth);
            this.renderSingleBorder(bottomBorder.color, startX, startY, endX, endY, lineWidth, bottomBorder.lineStyle);
        }
    }
    /**
     * Renders the border around a TextElementBox.
     * @param elementBox - The TextElementBox for which the border is rendered.
     * @param left - The left position of the TextElementBox.
     * @param top - The top position of the TextElementBox.
     * @param color - The color of the border.
     * @param borderStyle - The style of the border (e.g., 'Single', 'Double').
     * @param borderWidth - The width of the border.
     * @param baselineAlignment - The baseline alignment of the TextElementBox.
     * @param revisionInfo - Revision information (optional).
     */
    private renderImgBorder(elementBox: ImageElementBox, left: number, top: number, color: string, borderStyle: string, borderWidth: number, baselineAlignment: BaselineAlignment, revisionInfo?: RevisionInfo): void {
        // Get the width dynamically based on the current text content
        let width: number = (elementBox.width) / this.documentHelper.zoomFactor;
        let lineWidth = HelperMethods.convertPointToPixel(borderWidth);
        let next = this.documentHelper.selection.getNextTextElement(elementBox);
        let previous = this.documentHelper.selection.getPreviousTextElement(elementBox);

        // Calculate top margin based on baseline alignment
        let topMargin: number = (baselineAlignment === 'Subscript') ? elementBox.margin.top + (elementBox.height - elementBox.height / 1.5) : elementBox.margin.top;

        // Apply top margin
        top += topMargin > 0 ? topMargin : 0;

        // Calculate rendered height based on baseline alignment
        let renderedHeight: number = (elementBox.height / (baselineAlignment === 'Normal' ? 1 : 1.5)) + 15;
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        startX = left;
        startY = top;
        endX = left + width;
        endY = top;
        this.renderSingleBorder(color, startX, startY, endX, endY, lineWidth, borderStyle);

        // Render bottom border
        startY = top + renderedHeight;
        endY = startY;

        this.renderSingleBorder(color, startX, startY, endX, endY, lineWidth, borderStyle);

        //Render left border
        startY = top;
        endX = left;
        if (previous instanceof TextElementBox) {
            if (previous.line !== elementBox.line || previous.contentControlProperties == undefined) {
                borderStyle = 'Solid';
            }
            else {
                borderStyle = 'None';
            }
        }
        this.renderSingleBorder(color, startX, startY, endX, endY, lineWidth, borderStyle);

        // Render right border
        startX = left + width;
        endX = startX;
        if (next instanceof TextElementBox) {
            if (next.line !== elementBox.line || next.contentControlProperties == undefined) {
                borderStyle = 'Solid';
            }
            else {
                borderStyle = 'None';
            }
        } else {
            borderStyle = 'Solid';
        }
        this.renderSingleBorder(color, startX, startY, endX, endY, lineWidth, borderStyle);
    }
    private getContainerWidth(paraWidget: ParagraphWidget, page: Page): any {
        let hangingIndent: number = 0;
        if (paraWidget.paragraphFormat.firstLineIndent < 0) {
            hangingIndent = Math.abs(paraWidget.paragraphFormat.firstLineIndent);
        }
        if (paraWidget.isInsideTable) {
            let cell = paraWidget.associatedCell;
            return (cell.width + cell.margin.left + cell.margin.right) - cell.leftBorderWidth;
        } else {
            if (this.viewer instanceof WebLayoutViewer) {
                let indent: number = HelperMethods.convertPointToPixel(paraWidget.leftIndent + paraWidget.rightIndent);
                return (this.documentHelper.visibleBounds.width - (indent) - (this.viewer.padding.right * 4) - (this.viewer.padding.left * 2)) / this.documentHelper.zoomFactor;
            } else {
                let section: BodyWidget = paraWidget.bodyWidget as BodyWidget;
                if (section instanceof BodyWidget && section.sectionFormat.columns.length > 1) {
                    let colIndex: number = section.columnIndex;
                    return (section.sectionFormat.columns[colIndex] as WColumnFormat).width + HelperMethods.convertPointToPixel(hangingIndent - (paraWidget.rightIndent + paraWidget.leftIndent));
                }
                else {
                    let width: number = section.sectionFormat.pageWidth - section.sectionFormat.leftMargin - section.sectionFormat.rightMargin;
                    return HelperMethods.convertPointToPixel(width + hangingIndent - (paraWidget.rightIndent + paraWidget.leftIndent));
                }
            }
        }
    }
    private getTopMargin(paragraph: ParagraphWidget) {
        if (paragraph.isEmpty()) {
            return (paragraph.childWidgets[0] as LineWidget).margin.top;
        } else {
            let widget: LineWidget = paragraph.childWidgets[0] as LineWidget;
            let topMargin: number = 0;
            if (!isNullOrUndefined(widget.margin)) {
                topMargin = widget.margin.top;
            }
            return topMargin;
        }
    }
    private getBottomMargin(paragarph: ParagraphWidget) {
        if (paragarph.isEmpty()) {
            return (paragarph.childWidgets[paragarph.childWidgets.length - 1] as LineWidget).margin.bottom;
        } else {
            let widget: LineWidget = paragarph.childWidgets[paragarph.childWidgets.length - 1] as LineWidget;
            let bottomMargin: number = 0;
            if (!isNullOrUndefined(widget.margin)) {
                bottomMargin = widget.margin.bottom;
            }
            return bottomMargin;
        }
    }

    private renderfootNoteWidget(page: Page, footnote: FootNoteWidget, width: number): void {
        let isEmptyPage: boolean = footnote.page.bodyWidgets.length === 1 && ((footnote.page.bodyWidgets[0].childWidgets.length === 1
            && (footnote.page.bodyWidgets[0].childWidgets[0] as ParagraphWidget).isEmpty != undefined && (footnote.page.bodyWidgets[0].childWidgets[0] as ParagraphWidget).isEmpty()) || footnote.page.bodyWidgets[0].childWidgets.length === 0);
        let footerY: number = this.getFooterHeight(page);
        let height: number = footnote.y + footnote.height;
        if (height > footerY) {
            height = (footerY - footnote.y);
        }
        this.pageContext.beginPath();
        this.pageContext.save();
        this.pageContext.rect(this.pageLeft, this.getScaledValue(footnote.y, 2), this.getScaledValue(width), this.getScaledValue(height));
        this.pageContext.clip();
        for (let i: number = 0; i < footnote.bodyWidgets.length; i++) {
            let bodyWidget: BodyWidget = footnote.bodyWidgets[i];
            let footNoteReference: FootnoteElementBox = bodyWidget.footNoteReference;
            for (let j: number = 0; j < bodyWidget.childWidgets.length; j++) {
                let widget: BlockWidget = bodyWidget.childWidgets[j] as BlockWidget;
                if (i === 0 && j === 0) {
                    let ctx: CanvasRenderingContext2D | DocumentCanvasRenderingContext2D = this.pageContext;
                    let xPos: number = page.bodyWidgets[0].x;
                    if (page.bodyWidgets.length > 1 && !isNullOrUndefined(bodyWidget.nextWidget) && !((bodyWidget.nextWidget as BodyWidget).sectionFormat.breakCode === 'NoBreak')) {
                        let footWidth = page.bodyWidgets[0].width;
                        this.renderSolidLine(ctx, this.getScaledValue(xPos, 1), this.getScaledValue(footnote.y + (footnote.margin.top / 2) + 1, 2), footWidth * this.documentHelper.zoomFactor, '#000000');

                    } else {
                        this.renderSolidLine(ctx, this.getScaledValue(xPos, 1), this.getScaledValue(footnote.y + (footnote.margin.top / 2) + 1, 2), 210 * this.documentHelper.zoomFactor, '#000000');
                    }
                }
                if (!isNullOrUndefined(footNoteReference) && !this.documentHelper.owner.editorModule.isFootNoteInsert) {
                    //if (j < 1 || (j > 0 && widget.footNoteReference !== (bodyWidget.childWidgets[j - 1] as BlockWidget).footNoteReference)) {
                    const paragraph: ParagraphWidget = this.documentHelper.getFirstParagraphBlock(widget);
                    if ((paragraph.firstChild as LineWidget).children[0] instanceof TextElementBox) {
                        let footNoteElement: TextElementBox = (paragraph.firstChild as LineWidget).children[0] as TextElementBox;
                        if (footNoteElement.text === '\u0002') {
                            footNoteElement.text = footNoteElement.text.replace(footNoteElement.text, footNoteReference.text);
                            footNoteElement.width = footNoteReference.width;
                        }
                    }
                    //}
                }
                this.renderWidget(page, widget);
            }
        }
        this.pageContext.restore();
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
            if((widget as TableRowWidget).isRenderBookmarkEnd && this.documentHelper.owner.documentEditorSettings.showBookmarks){
                let cellWidget: TableCellWidget = widget.lastChild as TableCellWidget;
                let border = cellWidget.ownerTable.isBidiTable ? TableCellWidget.getCellLeftBorder(cellWidget) : TableCellWidget.getCellRightBorder(cellWidget);
                let lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
                let lastPara: ParagraphWidget = this.documentHelper.selection.getLastParagraph(widget.lastChild as TableCellWidget);
                let height: number = (lastPara.lastChild as LineWidget).height - (lastPara.lastChild as LineWidget).margin.bottom;
                this.renderBookmark(this.getScaledValue((cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2) + this.documentHelper.textHelper.getParagraphMarkWidth(lastPara.characterFormat), 1), this.getScaledValue(cellWidget.y - cellWidget.margin.top, 2), this.getScaledValue(height), 1);
            }
        }
    }
    private renderTableRowWidget(page: Page, rowWidget: Widget): void {
        for (let i: number = 0; i < rowWidget.childWidgets.length; i++) {
            let widget: TableCellWidget = rowWidget.childWidgets[i] as TableCellWidget;
            this.renderTableCellWidget(page, widget);
            if (widget.isRenderBookmarkEnd && this.documentHelper.owner.documentEditorSettings.showBookmarks) {
                let lastPara: ParagraphWidget = this.documentHelper.selection.getLastParagraph(widget) as ParagraphWidget;
                let lastLine: LineWidget = lastPara.lastChild as LineWidget;
                let position: Point = this.documentHelper.selection.getEndPosition(lastPara);
                this.renderBookmark(this.getScaledValue(position.x, 1), this.getScaledValue(position.y, 2), this.getScaledValue(lastLine.height - lastLine.margin.bottom), 1);
            }
        }
    }
    private renderTableCellWidget(page: Page, cellWidget: TableCellWidget): void {
        if (!this.isPrinting && !this.isExporting) {
            let cellTopMargin = 0;
            let cellBottomMargin = 0;
            cellTopMargin = cellWidget.margin.top - (cellWidget.containerWidget as TableRowWidget).topBorderWidth;
            cellBottomMargin = cellWidget.margin.bottom - (cellWidget.containerWidget as TableRowWidget).bottomBorderWidth;
            if (this.getScaledValue(cellWidget.y, 2) + cellWidget.height + cellBottomMargin * this.documentHelper.zoomFactor < 0 ||
                (this.getScaledValue(cellWidget.y, 2) - cellTopMargin > this.documentHelper.visibleBounds.height)) {
                return;
            }
        }
        let widgetHeight: number = 0;
        this.renderSelectionHighlightOnTable(page, cellWidget);
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
        if (cellWidget.isRenderEditRangeStart) {
            let firstPara: ParagraphWidget = this.documentHelper.selection.getFirstParagraph(cellWidget) as ParagraphWidget;
            let firstLine: LineWidget = firstPara.firstChild as LineWidget;                
            let xLeft = firstLine.paragraph.x;
            let ytop = firstLine.paragraph.y;
            if(this.documentHelper.owner.documentEditorSettings.highlightEditableRanges){
                let highlighters = this.documentHelper.selection.editRegionHighlighters;
                let widgetInfo : SelectionWidgetInfo[]= !isNullOrUndefined(highlighters)? highlighters.get(firstLine) : [];
                let color : string = !isNullOrUndefined(widgetInfo) && !isNullOrUndefined(widgetInfo[0])? widgetInfo[0].color  : "ffff00";
                this.renderBookmark(this.getScaledValue(xLeft, 1),this.getScaledValue(ytop, 2),this.getScaledValue(firstLine.height - firstLine.margin.bottom),0,color);
            }
        }
        if (cellWidget.isRenderEditRangeEnd) {
            let lastPara: ParagraphWidget = this.documentHelper.selection.getLastParagraph(cellWidget) as ParagraphWidget;
            let lastLine: LineWidget = lastPara.lastChild as LineWidget;
            let position: Point = this.documentHelper.selection.getEndPosition(lastPara);
            let xLeft = this.documentHelper.textHelper.getWidth(String.fromCharCode(164), lastLine.paragraph.characterFormat) + position.x;
            if(this.documentHelper.owner.documentEditorSettings.highlightEditableRanges){
                let highlighters = this.documentHelper.selection.editRegionHighlighters;
                let widgetInfo : SelectionWidgetInfo[]= !isNullOrUndefined(highlighters)? highlighters.get(lastLine) : [];
                let color : string = !isNullOrUndefined(widgetInfo) && !isNullOrUndefined(widgetInfo[0])? widgetInfo[0].color  : "ffff00";
                this.renderBookmark(this.getScaledValue(xLeft, 1),this.getScaledValue(position.y, 2),this.getScaledValue(lastLine.height - lastLine.margin.bottom),0,color);           
            }    
        }
    }
    private checkHeaderFooterLineWidget(widget: IWidget, keys: IWidget[]): IWidget {
        let headerFooter: HeaderFooterWidget;
        if (widget instanceof LineWidget) {
            headerFooter = widget.paragraph.bodyWidget as HeaderFooterWidget;
        } else if (widget instanceof TableCellWidget) {
            headerFooter = widget.bodyWidget as HeaderFooterWidget;
        }
        if (!isNullOrUndefined(headerFooter.parentHeaderFooter)) {
            headerFooter = headerFooter.parentHeaderFooter;
            for (let j: number = 0; j < keys.length; j++) {
                let selectedWidget: IWidget = keys[j];
                if (selectedWidget instanceof LineWidget && widget instanceof LineWidget) {
                    let parentIndex: string = selectedWidget.getHierarchicalIndex('');
                    let currentLineIndex: string = widget.getHierarchicalIndex('');
                    if (selectedWidget.paragraph.isInHeaderFooter && headerFooter === selectedWidget.paragraph.bodyWidget
                        && parentIndex.substring(parentIndex.indexOf(';')) === currentLineIndex.substring(currentLineIndex.indexOf(';'))) {
                        return selectedWidget;
                    }
                } else if (selectedWidget instanceof TableCellWidget && widget instanceof TableCellWidget) {
                    let parentIndex: string = selectedWidget.getHierarchicalIndex('');
                    let currentLineIndex: string = widget.getHierarchicalIndex('');
                    if (selectedWidget.ownerTable.isInHeaderFooter && headerFooter === selectedWidget.ownerTable.bodyWidget
                        && parentIndex.substring(parentIndex.indexOf(';')) === currentLineIndex.substring(currentLineIndex.indexOf(';'))) {
                        return selectedWidget;
                    }
                }
            }
        }
        return undefined;
    }
    private renderEditregionContentHighlight(page: Page, lineWidget: LineWidget, top: number, contenControl: ContentControl): void {
        if (!isNullOrUndefined(this.documentHelper.owner.editorModule) && page.documentHelper.selection && !isNullOrUndefined(page.documentHelper.selection.contentControleditRegionHighlighters)) {
            if (!isNullOrUndefined(contenControl)) {
                let widgetInfo: Dictionary<LineWidget, SelectionWidgetInfo[]> = this.documentHelper.selection.contentControleditRegionHighlighters.get(contenControl);
                let totalHeight: number = top;
                if (!isNullOrUndefined(widgetInfo) && lineWidget == contenControl.line) {
                    for (var i = 0; i < widgetInfo.length; i++) {
                        let color: string = contenControl.contentControlProperties.color;
                        if (color === '#00000000') {
                            //Change color to grey if color is transparent
                            color = '#939393'
                        }
                        let widget: SelectionWidgetInfo[] = widgetInfo.get(widgetInfo.keys[i]);
                        let previousHeight: number = totalHeight;
                        totalHeight += widgetInfo.keys[i].height;
                        for (var j = 0; j < widget.length; j++) {
                            let startX = widget[j].left - 2;
                            let endX = widget[j].left + widget[j].width + 2;
                            if (widgetInfo.length - 1 > i) {
                                endX = this.documentHelper.getParagraphLeftPosition(lineWidget.paragraph) + this.getContainerWidth(lineWidget.paragraph, page) + HelperMethods.convertPointToPixel(lineWidget.paragraph.paragraphFormat.borders.right.space);
                            }
                            let startY = previousHeight;
                            let endY = totalHeight;
                            if (i == 0) {
                                //left
                                this.renderSingleBorder(color, startX, startY, startX, endY, 1, 'single');
                                //top
                                this.renderSingleBorder(color, startX, startY, endX, startY, 1, 'single');
                                //right
                                this.renderSingleBorder(color, endX, startY, endX, endY, 1, 'single');
                                if (widgetInfo.length === 1) {
                                    //bottom
                                    this.renderSingleBorder(color, startX, endY, endX, endY, 1, 'single');
                                }
                            }
                            if (i > 0 && i < widgetInfo.length - 1) {
                                //left
                                this.renderSingleBorder(color, startX, startY, startX, endY, 1, 'single');
                                //right
                                this.renderSingleBorder(color, endX, startY, endX, endY, 1, 'single');
                                //top
                                let widgets: SelectionWidgetInfo[] = widgetInfo.get(widgetInfo.keys[i - 1]);
                                this.renderSingleBorder(color, startX, startY, widgets[j].left - 2, startY, 1, 'single');
                            }
                            if (i == widgetInfo.length - 1 && widgetInfo.length > 1) {
                                // left
                                this.renderSingleBorder(color, startX, startY, startX, endY, 1, 'single');
                                //Top
                                let widgets: SelectionWidgetInfo[] = widgetInfo.get(widgetInfo.keys[i - 1]);
                                if (startX > widgets[j].left) {
                                    this.renderSingleBorder(color, widgets[j].left - 2, startY, startX, startY, 1, 'single');
                                }
                                let lastLine: any = widgetInfo.keys[i].paragraph.lastChild;
                                if (!isNullOrUndefined(lastLine) && widgetInfo.keys[i] === lastLine && lastLine.children[lastLine.children.length - 1] instanceof ContentControl  && lastLine.children[lastLine.children.length - 1] === contenControl.reference && contenControl.contentControlWidgetType === 'Block') {
                                    //bottom
                                    endX = this.documentHelper.getParagraphLeftPosition(widgetInfo.keys[i].paragraph) + this.getContainerWidth(widgetInfo.keys[i].paragraph, page) + HelperMethods.convertPointToPixel(widgetInfo.keys[i].paragraph.paragraphFormat.borders.right.space);
                                    this.renderSingleBorder(color, startX, endY, endX, endY, 1, 'single');
                                }
                                else {
                                    //bottom
                                    this.renderSingleBorder(color, startX, endY, endX, endY, 1, 'single');
                                    //top
                                    if (widgetInfo.length > 1) {
                                        let widgets: SelectionWidgetInfo[] = widgetInfo.get(widgetInfo.keys[i - 1]);
                                        let endUpdated = this.documentHelper.getParagraphLeftPosition(lineWidget.paragraph) + this.getContainerWidth(lineWidget.paragraph, page) + HelperMethods.convertPointToPixel(lineWidget.paragraph.paragraphFormat.borders.right.space);
                                        this.renderSingleBorder(color, endX, startY, endUpdated, startY, 1, 'single');
                                        if (startX < widgets[j].left - 2) {
                                            this.renderSingleBorder(color, widgets[j].left - 2, startY, startX, startY, 1, 'single');
                                        }
                                    }
                                }
                                //right
                                this.renderSingleBorder(color, endX, startY, endX, endY, 1, 'single');
                            }
                            if (i == widgetInfo.length - 1 && !isNullOrUndefined(contenControl) && (contenControl.contentControlProperties.type === 'ComboBox' || contenControl.contentControlProperties.type === 'DropDownList' || contenControl.contentControlProperties.type === 'Date')) {
                                let element = document.getElementById("contenticon");
                                if (element) {
                                    element.style.display = 'block';
                                    startX = this.getScaledValue(endX, 1);
                                    startY = this.getScaledValue(startY, 2);
                                    element.style.left = `${startX}px`; // Position to the right of the right border
                                    element.style.top = `${startY}px`; // Align with the top of the border
                                    element.style.border = '0.5px solid #7F7F7F';
                                    element.style.backgroundColor = '#D3D3D3'
                                    element.style.height = lineWidget.height + 'px';
                                    element.addEventListener('click', this.documentHelper.owner.editor.contentControlDropDownChange.bind(this));
                                }
                                else {
                                    let contentMark = document.createElement('div');
                                    contentMark.id = "contenticon"
                                    contentMark.style.display = 'block';
                                    contentMark.style.position = 'sticky';
                                    startX = this.getScaledValue(endX, 1);
                                    startY = this.getScaledValue(startY, 2);
                                    contentMark.style.left = `${startX}px`; // Position to the right of the right border
                                    contentMark.style.top = `${startY}px`; // Align with the top of the border
                                    contentMark.style.border = '0.5px solid #7F7F7F';
                                    contentMark.style.backgroundColor = '#D3D3D3'
                                    contentMark.style.height = lineWidget.height + 'px';
                                    contentMark.classList.add('e-de-cmt-mark');
                                    let span: HTMLElement = document.createElement('span');
                                    span.classList.add('e-icons');
                                    span.classList.add('e-chevron-down-fill');
                                    contentMark.appendChild(span);
                                    this.documentHelper.pageContainer.appendChild(contentMark);
                                    contentMark.addEventListener('click', this.documentHelper.owner.editor.contentControlDropDownChange.bind(this));
                                }
                            }


                        }
                    }
                }

            }

        }
    }
    private renderEditRegionHighlight(page: Page, lineWidget: LineWidget, top: number): void {
        if (page.documentHelper.selection && !isNullOrUndefined(page.documentHelper.selection.editRegionHighlighters)) {
            let renderHighlight: boolean = this.documentHelper.selection.editRegionHighlighters.containsKey(lineWidget);
            if (!renderHighlight && lineWidget.paragraph.isInHeaderFooter) {
                let keys: LineWidget[] = this.documentHelper.selection.editRegionHighlighters.keys;
                lineWidget = this.checkHeaderFooterLineWidget(lineWidget, keys) as LineWidget;
                if (!isNullOrUndefined(lineWidget)) {
                    renderHighlight = true;
                }
            }
            if (renderHighlight) {
                let widgetInfo: SelectionWidgetInfo[] = this.documentHelper.selection.editRegionHighlighters.get(lineWidget);
                for (let i: number = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = widgetInfo[i].color !== '' ? widgetInfo[i].color : '#add8e6';
                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
                }
            }
        }
    }
    private renderSearchHighlight(page: Page, lineWidget: LineWidget, top: number): void {
        if (this.documentHelper.owner.searchModule && !isNullOrUndefined(page.documentHelper.owner.searchModule.searchHighlighters)) {
            let renderHighlight: boolean = page.documentHelper.owner.searchModule.searchHighlighters.containsKey(lineWidget);
            if (!renderHighlight && lineWidget.paragraph.isInHeaderFooter) {
                let keys: LineWidget[] = page.documentHelper.owner.searchModule.searchHighlighters.keys;
                lineWidget = this.checkHeaderFooterLineWidget(lineWidget, keys) as LineWidget;
                if (!isNullOrUndefined(lineWidget)) {
                    renderHighlight = true;
                }
            }
            if (renderHighlight) {
                let widgetInfo: SearchWidgetInfo[] = page.documentHelper.owner.searchModule.searchHighlighters.get(lineWidget);
                for (let i: number = 0; i < widgetInfo.length; i++) {
                    this.pageContext.fillStyle = this.viewer.owner.documentEditorSettings.searchHighlightColor;

                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(lineWidget.height));
                }
            }
        }
    }
    private renderSelectionHighlight(page: Page, lineWidget: LineWidget, top: number): void {
        if (!this.isPrinting && page.documentHelper.owner.selectionModule && !this.documentHelper.isScrollToSpellCheck && page.documentHelper.owner.selectionModule.selectedWidgets.length > 0) {
            let renderHighlight: boolean = page.documentHelper.owner.selectionModule.selectedWidgets.containsKey(lineWidget);
            if (!renderHighlight && lineWidget.paragraph.isInHeaderFooter) {
                let keys: IWidget[] = page.documentHelper.owner.selectionModule.selectedWidgets.keys;
                lineWidget = this.checkHeaderFooterLineWidget(lineWidget, keys) as LineWidget;
                if (!isNullOrUndefined(lineWidget)) {
                    renderHighlight = true;
                }
            }
            if (renderHighlight) {
                page.documentHelper.owner.selectionModule.addSelectionHighlight(this.selectionContext, lineWidget, top, page);
            }
        }
    }
    private renderSelectionHighlightOnTable(page: Page, cellWidget: TableCellWidget): void {
        if (!this.isPrinting && page.documentHelper.owner.selectionModule && page.documentHelper.owner.selectionModule.selectedWidgets.length > 0) {
            let renderHighlight: boolean = page.documentHelper.owner.selectionModule.selectedWidgets.containsKey(cellWidget);
            if (!renderHighlight && cellWidget.ownerTable.isInHeaderFooter) {
                let keys: IWidget[] = page.documentHelper.owner.selectionModule.selectedWidgets.keys;
                cellWidget = this.checkHeaderFooterLineWidget(cellWidget, keys) as TableCellWidget;
                if (!isNullOrUndefined(cellWidget)) {
                    renderHighlight = true;
                }
            }
            if (renderHighlight) {
                page.documentHelper.owner.selectionModule.addSelectionHighlightTable(this.selectionContext, cellWidget, page);
            }
        }
    }
    private  renderLine(lineWidget: LineWidget, page: Page, left: number, top: number): void {
        this.renderSelectionHighlight(page, lineWidget, top);
        let paraFormat: WParagraphFormat = lineWidget.paragraph.paragraphFormat;
        let x: number = left;
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
                    let isAltered: boolean = false;
                    let isLastLine: boolean = lineWidget.isLastLine();
                    if (isLastLine) {
                        height = height - HelperMethods.convertPointToPixel(this.documentHelper.layout.getAfterSpacing(lineWidget.paragraph))
                        if (lineWidget.paragraph.paragraphFormat.lineSpacing > 1) {
                            let formField: FieldElementBox = this.getFormfieldInLine(lineWidget);
                            if (!isNullOrUndefined(formField)) {
                                const sizeInfo: TextSizeInfo = this.documentHelper.textHelper.getHeight(formField.characterFormat);
                                let maxHeight: number = sizeInfo.Height;
                                if (lineWidget.paragraph.paragraphFormat.lineSpacingType === 'Multiple') {
                                    height = height - HelperMethods.convertPointToPixel(this.documentHelper.layout.getLineSpacing(lineWidget.paragraph, maxHeight, true))
                                } else {
                                    top = top + HelperMethods.convertPointToPixel(lineWidget.paragraph.paragraphFormat.beforeSpacing);
                                    height = sizeInfo.Height;
                                    isAltered = true;
                                }
                            }
                        }
                    }
                    this.pageContext.fillRect(this.getScaledValue(widgetInfo[i].left, 1), this.getScaledValue(top, 2), this.getScaledValue(widgetInfo[i].width), this.getScaledValue(height));
                    if (isAltered) {
                        isAltered = false;
                        top = top - HelperMethods.convertPointToPixel(lineWidget.paragraph.paragraphFormat.beforeSpacing);
                    }
                }
            }
        }
        // Render search highlight
        this.renderSearchHighlight(page, lineWidget, top);
        // EditRegion highlight 
        this.renderEditRegionHighlight(page, lineWidget, top);
        let commentIDList: string[]=[];

        let children: ElementBox[] = lineWidget.renderedElements;
        let underlineY: number = this.getUnderlineYPosition(lineWidget);
        let bookmarks: any = [];
        if (!isNullOrUndefined(lineWidget.paragraph.associatedCell) && lineWidget.paragraph.associatedCell.isRenderBookmarkStart) {
            let firstLineInFirstPara: LineWidget = ((lineWidget.paragraph.associatedCell.firstChild as ParagraphWidget).firstChild as LineWidget);
            if(firstLineInFirstPara == lineWidget){
                bookmarks.push({ x: left, y: top, height: lineWidget.height - lineWidget.margin.bottom, type: 0 });
            }
        }
        let contentControlstart: ContentControl = undefined;
        for (let i: number = 0; i < children.length; i++) {
            let elementBox: ElementBox = children[i] as ElementBox;
            if (elementBox instanceof ContentControl && elementBox.type === 0 && isNullOrUndefined(contentControlstart) && !isNullOrUndefined(this.documentHelper.owner.editorModule) && !isNullOrUndefined(this.documentHelper.selection) && !isNullOrUndefined(this.documentHelper.selection.contentControleditRegionHighlighters)) {
                contentControlstart = this.documentHelper.owner.editorModule.getContentControl(elementBox);
            }
            if (elementBox instanceof ShapeBase && elementBox.textWrappingStyle !== 'Inline') {
                continue;
            }
            if (elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox) {
                let pageGap: number = 0;
                if (this.viewer instanceof PageLayoutViewer) {
                    pageGap = (this.viewer as PageLayoutViewer).pageGap;
                }
                let style: string = 'display:block;position:absolute;';
                let topPosition: string = this.getScaledValue((top) + (page.boundingRectangle.y -
                    (pageGap * (page.index + 1)))) + (pageGap * (page.index + 1)) + 'px;';
                if (elementBox instanceof EditRangeStartElementBox && (this.documentHelper.owner.currentUser === elementBox.user || (elementBox.group === "Everyone" && elementBox.user === ""))) {
                    if(this.documentHelper.owner.documentEditorSettings.highlightEditableRanges && elementBox.columnFirst==-1 ){
                        var height = elementBox.line.height - elementBox.line.margin.bottom;
                        let xLeft = left;
                        let yTop = top;
                        let highlighters = this.documentHelper.selection.editRegionHighlighters;
                        let widgetInfo : SelectionWidgetInfo[]= !isNullOrUndefined(highlighters)? highlighters.get(lineWidget) : [];
                        let color : string = !isNullOrUndefined(widgetInfo) && !isNullOrUndefined(widgetInfo[0])? widgetInfo[0].color  : "ffff00";
                        this.renderBookmark(this.getScaledValue(xLeft, 1),this.getScaledValue(yTop, 2),this.getScaledValue(lineWidget.height - lineWidget.margin.bottom),0,color);
                    }
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
                    if (this.documentHelper.owner.enableComment ) {
                        let rightMargin: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.rightMargin);
                        let pageWidth: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.pageWidth);

                        let leftPosition: string = page.boundingRectangle.x + this.getScaledValue((pageWidth - rightMargin) + (rightMargin / 4)) + 'px;';
                        if (this.viewer instanceof WebLayoutViewer) {

                            leftPosition = (page.boundingRectangle.width - (this.viewer.padding.right * 2) - (this.viewer.padding.left * 2)) + 'px;';
                        }
                        style = style + 'left:' + leftPosition + 'top:' + topPosition;
                        if (commentIDList.indexOf(elementBox.commentId) === -1 && !isNullOrUndefined(elementBox.comment) && !elementBox.comment.isReply) {
                            commentIDList.push(elementBox.commentId);
                            elementBox.renderCommentMark(topPosition, leftPosition);
                            elementBox.commentMark.setAttribute('style', style);
                        }
                    } else {
                        if (elementBox.commentMark) {
                            elementBox.commentMark.setAttribute('style', 'display:none');
                        }
                    }
                }

            }
            if (elementBox instanceof EditRangeEndElementBox && (this.documentHelper.owner.currentUser === elementBox.editRangeStart.user || (elementBox.editRangeStart.group === "Everyone" && elementBox.editRangeStart.user === ""))) {
                if (elementBox.editRangeStart.columnFirst==-1 && this.documentHelper.owner.documentEditorSettings.highlightEditableRanges) {
                    var height = elementBox.line.height - elementBox.line.margin.bottom;
                    let xLeft = left;
                    let yTop = top;
                    let highlighters = this.documentHelper.selection.editRegionHighlighters;
                    let widgetInfo : SelectionWidgetInfo[]= !isNullOrUndefined(highlighters)? highlighters.get(lineWidget) : [];
                    let color : string = !isNullOrUndefined(widgetInfo) && !isNullOrUndefined(widgetInfo[0])? widgetInfo[0].color  : "ffff00";
                    this.renderBookmark(this.getScaledValue(xLeft, 1),this.getScaledValue(yTop, 2),this.getScaledValue(lineWidget.height - lineWidget.margin.bottom),1,color);
                }
            }
            if (elementBox instanceof BookmarkElementBox && this.documentHelper.owner.documentEditorSettings.showBookmarks && this.documentHelper.getBookmarks().indexOf(elementBox.name) !== -1) {
                var height = elementBox.line.height - elementBox.line.margin.bottom;
                let xLeft = left;
                let yTop = top;
                if(elementBox.bookmarkType == 1){
                    if(this.isBookmarkEndAtStart(elementBox) && isNullOrUndefined(elementBox.properties)){
                        let previousParaElement: ParagraphWidget = elementBox.paragraph;
                        let prevRenderableElement: any;
                        let isRenderablePresent: boolean = false;
                        while(!isRenderablePresent && !isNullOrUndefined(previousParaElement)){
                            let lineIndex: number = previousParaElement.childWidgets.indexOf(elementBox.line) >= 0 ? previousParaElement.childWidgets.indexOf(elementBox.line) : previousParaElement.childWidgets.length - 1;
                            for(let i = lineIndex; i >= 0; i --){
                                let line: LineWidget = previousParaElement.childWidgets[i] as LineWidget;
                                let elementIndex: number = line.children.indexOf(elementBox) >= 0 ? line.children.indexOf(elementBox) : line.children.length - 1;
                                for(let j = elementIndex; j >= 0; j --){
                                    if(this.isRenderable(line.children[j])){
                                        prevRenderableElement = line.children[j];
                                        isRenderablePresent = true;
                                        break;
                                    }
                                }
                                if(isRenderablePresent){
                                    break;
                                }
                            }
                            if(!isRenderablePresent){
                                previousParaElement = this.documentHelper.selection.getPreviousParagraphBlock(previousParaElement);
                            }
                        }
                        if(!isNullOrUndefined(prevRenderableElement)){
                            xLeft += this.documentHelper.selection.getWidth(prevRenderableElement.line, false) + this.documentHelper.textHelper.getParagraphMarkWidth(elementBox.line.paragraph.characterFormat);
                            yTop = this.documentHelper.selection.getTop(prevRenderableElement.line);
                        }
                    }
                    if(!isNullOrUndefined(elementBox.properties)){
                        if(elementBox.properties['isAfterParagraphMark']){
                            xLeft += this.documentHelper.textHelper.getParagraphMarkWidth(elementBox.line.paragraph.characterFormat);
                        }
                        if (elementBox.properties['isAfterCellMark']) {
                            xLeft += this.documentHelper.textHelper.getWidth(String.fromCharCode(164), lineWidget.paragraph.characterFormat);
                        }
                    }
                }
                if(elementBox.bookmarkType == 1){
                    if(!isNullOrUndefined(elementBox.reference)){
                        if(isNullOrUndefined(elementBox.reference.properties)){
                            if(!this.documentHelper.selection.isRenderBookmarkAtEnd(elementBox)){
                                bookmarks.push({ x: xLeft, y: yTop, height: height, type: elementBox.bookmarkType });
                            }
                        }
                        else{
                            let bookmarkEndCell: TableCellWidget = elementBox.paragraph.associatedCell;
                            if(isNullOrUndefined(bookmarkEndCell)){
                                bookmarks.push({ x: xLeft, y: yTop, height: height, type: elementBox.bookmarkType });
                            }
                        }
                    }
                }else{
                    if(isNullOrUndefined(elementBox.properties)){
                        bookmarks.push({ x: xLeft, y: yTop, height: height, type: elementBox.bookmarkType });
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
            if (!this.isPrinting) {
                if (this.getScaledValue(top + elementBox.margin.top, 2) + elementBox.height * this.documentHelper.zoomFactor < 0 ||
                    this.getScaledValue(top + elementBox.margin.top, 2) > this.documentHelper.visibleBounds.height) {
                    left += elementBox.width + elementBox.margin.left;
                    if (elementBox instanceof TextElementBox) {
                        if(this.documentHelper.owner.isSpellCheck){
                        elementBox.canTrigger = true;
                        }
                        elementBox.isVisible = false;
                        if (!elementBox.isSpellChecked || elementBox.line.paragraph.isChangeDetected) {
                            elementBox.ischangeDetected = true;
                        }
                    }
                    if (!this.isExporting) {
                        continue;
                    }
                }

            }
            if (elementBox instanceof ListTextElementBox) {
                this.renderListTextElementBox(elementBox, left, top, underlineY);
            } else if (elementBox instanceof ImageElementBox) {
                left += elementBox.padding.left;
                this.renderImageElementBox(elementBox, left, top, underlineY);
            } else if (elementBox instanceof ShapeElementBox) {
                let shapeLeftMargin: number = elementBox.margin.left;
                let shapeTopMargin: number = elementBox.margin.top;
                let shapeLeft: number = this.getScaledValue(left + shapeLeftMargin, 1);
                let shapeTop: number = this.getScaledValue(top + shapeTopMargin, 2);
                this.renderShapeElementBox(elementBox, shapeLeft, shapeTop, page);
            } else {
                elementBox.isVisible = true;
                left += elementBox.padding.left;
                this.renderTextElementBox(elementBox as TextElementBox, left, top, underlineY);
            }
            left += elementBox.width + elementBox.margin.left;
            if(lineWidget.paragraph.bidi) {
                x += (elementBox.margin.left);
            } else {
                x = left;
            }
        }
        // Content region border
        this.renderEditregionContentHighlight(page, lineWidget, top, contentControlstart);
        if (this.documentHelper.owner.documentEditorSettings.showBookmarks && bookmarks.length > 0) {
            for (let i = 0; i < bookmarks.length; i++) {
                let bookmark = bookmarks[i];
                this.renderBookmark(this.getScaledValue(bookmark.x, 1), this.getScaledValue(bookmark.y, 2), this.getScaledValue(bookmark.height), bookmark.type);
            }
        }
        if (this.documentHelper.owner.documentEditorSettings.showHiddenMarks && !this.isPrinting) {
            let text: string = '';
            let currentCharFormat: WCharacterFormat = lineWidget.paragraph.characterFormat;
            let y: number = 0;
            let characterFont: string = this.retriveCharacterformat(currentCharFormat);
            let l10n: L10n = new L10n('documenteditor', this.documentHelper.owner.defaultLocale);
            l10n.setLocale(this.documentHelper.owner.locale);
            this.pageContext.fillStyle = HelperMethods.getColor(currentCharFormat.fontColor);
            let pageIndex: number = 0;
            if (lineWidget.paragraph.bodyWidget && !(lineWidget.paragraph.bodyWidget instanceof HeaderFooterWidget)) {
                pageIndex = this.documentHelper.pages.indexOf(lineWidget.paragraph.bodyWidget.page);
            }
            if ((children.length == 0 && !lineWidget.isEndsWithLineBreak && !isNullOrUndefined(lineWidget.paragraph)) || (lineWidget.paragraph.childWidgets.length === 1)) {
                y = lineWidget.paragraph.y + (this.documentHelper.textHelper.getHeight(currentCharFormat)).BaselineOffset + this.documentHelper.layout.getBeforeSpacing(lineWidget.paragraph, pageIndex);
                //Paragraph with empty linewidgets with mutiple line breaks
                if (!lineWidget.isEndsWithLineBreak && lineWidget.indexInOwner > 0 && children.length == 0) {
                    y = top + lineWidget.previousLine.maxBaseLine;
                }
            } else {
                y = top + lineWidget.maxBaseLine;
            }
            if (currentCharFormat.revisions.length > 0) {
                //CharacterFormat Track changes is not supported., Hence only the Para mark changes are parsed and preserved in the charcterForamt. 
                let color: string = this.documentHelper.authors.get(currentCharFormat.revisions[0].author);
                this.pageContext.fillStyle = HelperMethods.getColor(color);
            }
            if (lineWidget.isEndsWithColumnBreak) {
                characterFont = this.retriveCharacterformat(currentCharFormat, 0.7);
                text = "....." + l10n.getConstant('Column Break') + ".....";
            } else if (lineWidget.isEndsWithPageBreak) {
                characterFont = this.retriveCharacterformat(currentCharFormat, 0.7);
                if (lineWidget.paragraph.bidi) {
                    text = String.fromCharCode(182) + '.....' + l10n.getConstant('Page Break') + '.....';
                } else {
                    text = '.....' + l10n.getConstant('Page Break') + '.....' + String.fromCharCode(182);
                }
                let textinfo: number = this.documentHelper.textHelper.getWidth(text, currentCharFormat, FontScriptType.English);
                if (this.viewer instanceof PageLayoutViewer) {
                    if (lineWidget.paragraph.bidi) {
                        if (x < (textinfo + this.viewer.clientActiveArea.x)) {
                            text = '.....';
                        }
                    }
                    else {
                        if (x > this.viewer.clientActiveArea.width) {
                            text = '.....';
                        }
                    }
                } else {
                    if (lineWidget.paragraph.bidi) {
                        if ((x - textinfo) < this.viewer.clientActiveArea.x) {
                            text = '.....';
                        }
                    }
                    else {
                        if ((x + textinfo) > (this.viewer.clientActiveArea.width + this.viewer.clientActiveArea.x)) {
                            text = '.....';
                        }
                    }
                }
            } else if (lineWidget.isEndsWithLineBreak) {
                text = lineWidget.paragraph.bidi ? String.fromCharCode(8627): String.fromCharCode(8629);
            } else if (lineWidget.paragraph.isInsideTable && isNullOrUndefined(lineWidget.nextLine) && isNullOrUndefined(lineWidget.paragraph.nextWidget)) {
                if (lineWidget.height != 0) { //The nested table parent cell mark is render the out bound ,So skip cell mark is linewidget height equal to zero 
                    text = String.fromCharCode(164);
                }
            } else if(isNullOrUndefined(lineWidget.nextLine)) {
                text = String.fromCharCode(182);
            }
            if (lineWidget.paragraph.containerWidget instanceof BodyWidget && !isNullOrUndefined(lineWidget.paragraph.nextRenderedWidget)) {
                if (lineWidget.paragraph.containerWidget.sectionIndex !== (lineWidget.paragraph.nextRenderedWidget.containerWidget as BodyWidget).sectionIndex && lineWidget.isLastLine()) {
                    if ((lineWidget.paragraph.nextRenderedWidget.containerWidget as BodyWidget).sectionFormat.breakCode === 'NoBreak' && lineWidget.paragraph.containerWidget.index !== (lineWidget.paragraph.nextRenderedWidget.containerWidget as BodyWidget).index) {
                        text = ':::::' + l10n.getConstant('Section Break Continuous') + ':::::';
                    } else {
                        text = ':::::' + l10n.getConstant('Section Break Next Page') + ':::::';
                    }
                    characterFont = this.retriveCharacterformat(currentCharFormat, 0.7);
                    if(lineWidget.isEndsWithPageBreak){
                        if (lineWidget.paragraph.bidi) {
                            text = text+String.fromCharCode(182)+'.....' + l10n.getConstant('Page Break') + '.....';
                        } else {
                            text = '.....' + l10n.getConstant('Page Break') + '.....' + String.fromCharCode(182)+text;
                        }
                    }
                    let textinfo: number = this.documentHelper.textHelper.getWidth(text, currentCharFormat, FontScriptType.English);
                    if (this.viewer instanceof PageLayoutViewer) {
                        if (lineWidget.paragraph.bidi) {
                            if (x < (textinfo + this.viewer.clientActiveArea.x)) {
                                text = ':::::';
                                if (lineWidget.isEndsWithPageBreak) {
                                    text = ':::::.....'
                                }
                            }
                        }
                        else {
                            if ((x + textinfo - this.viewer.clientActiveArea.x) > (this.viewer.clientActiveArea.width)) {
                                text = ':::::';
                                if (lineWidget.isEndsWithPageBreak) {
                                    text = '.....:::::'
                                }
                            }
                        }
                    }
                    else {
                        if (lineWidget.paragraph.bidi) {
                            if ((x - textinfo) < this.viewer.clientActiveArea.x) {
                                text = ':::::';
                                if (lineWidget.isEndsWithPageBreak) {
                                    text = ':::::.....'
                                }
                            }
                        }
                        else {
                            if ((x + textinfo - this.documentHelper.pages[0].boundingRectangle.x) > (this.viewer.clientActiveArea.width)) {
                                text = ':::::';
                                if (lineWidget.isEndsWithPageBreak) {
                                    text = '.....:::::'
                                }
                            }
                        }
                    }
                }
            }
            if (text.length > 0) {
                if (lineWidget.paragraph.bidi && !lineWidget.paragraph.isEmpty()) {
                    x -= this.documentHelper.textHelper.getWidth(text, currentCharFormat, FontScriptType.English);
                }
                this.pageContext.font = characterFont;
                let scaleFactor: number = currentCharFormat.scaling < 100 ? 1 : currentCharFormat.scaling / 100;
                (this.pageContext as any).letterSpacing = currentCharFormat.characterSpacing * this.documentHelper.zoomFactor + 'pt';
                this.pageContext.save();
                this.pageContext.scale(scaleFactor, 1);
                this.pageContext.fillText(text, this.getScaledValue(x, 1) / (scaleFactor), this.getScaledValue(y, 2));
                this.pageContext.restore();
            }
        }  
    }
    private isBookmarkEndAtStart(bookmark: BookmarkElementBox): boolean{
        let para: ParagraphWidget = bookmark.paragraph;
        let index: number = 0;
        let firstLine: LineWidget = para.childWidgets[index] as LineWidget;
        let isBookmarkAtStart: boolean = true;
        while(firstLine.children.indexOf(bookmark) == -1){
            firstLine = para.childWidgets[++index] as LineWidget;
            if(index == para.childWidgets.length){
                break;
            }
        }
        if (bookmark.line != firstLine) {
            return false;
        }
        let bookmarkIndex: number = firstLine.children.indexOf(bookmark) >= 0 ? firstLine.children.indexOf(bookmark) : -1;
        for (let i: number = bookmarkIndex; i >= 0; i--) {
            let element: any = firstLine.children[i];
            if(this.isRenderable(element)){
                isBookmarkAtStart = false;
            }
        }
        if(isBookmarkAtStart){
            return true;
        }else{
            return false;
        }
    }
    private isRenderable(element: any): boolean{
        if(!(element instanceof BookmarkElementBox || element instanceof EditRangeStartElementBox || element instanceof EditRangeEndElementBox)){
            return true;
        }
        return false;
    }
    private combineHexColors(color1: string, color2: string):string{
        const hex1 = color1.replace("#", "");
        const hex2 = color2.replace("#", "");
        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);
        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);
        const r = Math.round((r1 * 0.35) + (r2 * 0.65));
        const g = Math.round((g1 * 0.35) + (g2 * 0.65));
        const b = Math.round((b1 * 0.35) + (b2 * 0.65));
        const mixedColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        return mixedColor;      
    }
    private renderBookmark(x: number, y: number, height: number, type: number,restrictColor?:string): void {
        if(this.isPrinting) {
            return;    
        }
        this.pageContext.beginPath();
        this.pageContext.lineWidth = 1.5;
        let extensionLength = 3;
        if (type == 0) {
            this.pageContext.moveTo(x + extensionLength, y);
            this.pageContext.lineTo(x, y);
            this.pageContext.lineTo(x, y + height);
            this.pageContext.lineTo(x + extensionLength, y + height);
        }
        if (type == 1) {
            this.pageContext.moveTo(x - extensionLength, y);
            this.pageContext.lineTo(x, y);
            this.pageContext.lineTo(x, y + height);
            this.pageContext.lineTo(x - extensionLength, y + height);
        }
        this.pageContext.strokeStyle = "#7F7F7F";
        this.pageContext.stroke();
        this.pageContext.closePath();        
        if(!isNullOrUndefined(restrictColor)){
            const combinedColor = this.combineHexColors(restrictColor,"#7F7F7F")
            this.pageContext.fillStyle = combinedColor;
            this.pageContext.fillRect(x, y, 1.5, height);
        }
    }
    private retriveCharacterformat(character: WCharacterFormat, fontSizeFactor?: number): string {
        if(isNullOrUndefined(fontSizeFactor)){
            fontSizeFactor = 1;
        }
        let font: string = '';
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontSize: number = 11;
        let fontFamily: string = '';
        bold = character.bold ? 'bold' : '';
        italic = character.italic ? 'italic' : '';
        fontSize = character.fontSize === 0 ? 0.5 : character.fontSize / (character.baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = fontSize * this.documentHelper.zoomFactor * fontSizeFactor;
        fontFamily = character.fontFamily;
        font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + '"' + fontFamily + '"';
        return font;
    }

    private toSkipFieldCode(element: ElementBox): void {
        if (element instanceof FieldElementBox) {
            if (element.fieldType === 0) {
                if (!this.isFieldCode && (!isNullOrUndefined(element.fieldEnd) || element.hasFieldEnd)) {
                    this.fieldStacks.push(element);
                    this.isFieldCode = true;
                }
            } else if (element.fieldType === 2 || element.fieldType === 1) {
                if (this.fieldStacks.length > 0 && element.fieldBegin === this.fieldStacks[this.fieldStacks.length - 1]) {
                    this.fieldStacks.pop();
                    this.isFieldCode = false;
                }
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
        let color: string = format.hasValue('fontColor') ? format.fontColor : breakCharacterFormat.fontColor;
        this.pageContext.textBaseline = 'alphabetic';
        let bold: string = '';
        let italic: string = '';
        let fontFamily: string = format.hasValue('fontFamily') ? format.fontFamily : breakCharacterFormat.fontFamily;
        if (this.documentHelper.isIosDevice && (elementBox.text === String.fromCharCode(9679) || elementBox.text === String.fromCharCode(9675))) {
            fontFamily = '';
        }
        let fontSize: number = format.hasValue('fontSize') ? format.fontSize : breakCharacterFormat.fontSize;

        let baselineAlignment: BaselineAlignment = format.hasValue('baselineAlignment') ? format.baselineAlignment : breakCharacterFormat.baselineAlignment;
        bold = format.hasValue('bold') ? format.bold ? 'bold' : '' : breakCharacterFormat.bold ? 'bold' : '';
        italic = format.hasValue('italic') ? format.italic ? 'italic' : '' : breakCharacterFormat.italic ? 'italic' : '';
        fontSize = fontSize === 0 ? 0.5 : fontSize / (baselineAlignment === 'Normal' ? 1 : 1.5);
        fontSize = this.isPrinting ? fontSize : fontSize * this.documentHelper.zoomFactor;
        let strikethrough: Strikethrough = format.hasValue('strikethrough') ? format.strikethrough : breakCharacterFormat.strikethrough;
        let highlightColor: HighlightColor = format.hasValue('highlightColor') ? format.highlightColor : breakCharacterFormat.highlightColor;
        if (highlightColor !== 'NoColor') {
            if (highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(highlightColor);
            } else {
                this.pageContext.fillStyle = HelperMethods.getColor(highlightColor);
            }

            this.pageContext.fillRect(Math.floor(this.getScaledValue(left + leftMargin, 1)), Math.floor(this.getScaledValue(top + topMargin, 2) - 1), Math.ceil(this.getScaledValue(elementBox.width) + 1), Math.ceil(this.getScaledValue(elementBox.height) + 1));
        }
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + '"' + fontFamily + '"';
        if (baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        let baselineOffset: number = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        let text: string = elementBox.text;
        let isParaBidi: boolean = elementBox.paragraph.paragraphFormat.bidi;
        if (isParaBidi) {
            this.pageContext.direction = 'rtl';
            left += elementBox.width;
        }
        // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
        if (color === "empty" || color === '#00000000') {
            let bgColor: string = this.getBackgroundColorHeirachy(elementBox);
            this.pageContext.fillStyle = this.getDefaultFontColor(bgColor);
        } else {
            this.pageContext.fillStyle = HelperMethods.getColor(color);
        }
        let scaleFactor: number = format.scaling < 100 ? 1 : format.scaling / 100;
        if (this.documentHelper.owner.documentEditorSettings.showHiddenMarks && !this.isPrinting) {
            if (elementBox instanceof ListTextElementBox && elementBox.text === "\t") {
                this.tabMark(elementBox, format, left, top, leftMargin, topMargin);
            }
            (this.pageContext as any).letterSpacing = format.characterSpacing * this.documentHelper.zoomFactor + 'pt';
            this.pageContext.save();
            this.pageContext.scale(scaleFactor, 1);
            this.pageContext.fillText(this.replaceSpace(text), this.getScaledValue(left + leftMargin, 1)/scaleFactor, this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));
            this.pageContext.restore();
        } else {
            (this.pageContext as any).letterSpacing = format.characterSpacing * this.documentHelper.zoomFactor + 'pt';
            this.pageContext.save();
            this.pageContext.scale(scaleFactor, 1);
            this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1)/scaleFactor, this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));
            this.pageContext.restore();
        }
        if (isParaBidi) {
            this.pageContext.direction = 'ltr';
            left -= elementBox.width;
        }
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
        let doHighLight: Boolean = true;
        if(format.highlightColor != "NoColor" && elementBox.text.trim() == "") {
            const firstLine = elementBox.line.paragraph.firstChild
            const lastLine = elementBox.line.paragraph.lastChild;
            if(!isNullOrUndefined(firstLine) && firstLine instanceof LineWidget
                && firstLine.children.length > 0 && elementBox === firstLine.children[0]) {
                doHighLight = false;
            } 
            if(!isNullOrUndefined(lastLine) && lastLine instanceof LineWidget
                && lastLine.children.length > 0 && elementBox === lastLine.children[lastLine.children.length - 1]) {
                doHighLight = false;
            }
        }
        if (format.highlightColor !== 'NoColor' && doHighLight) {
            if (format.highlightColor.substring(0, 1) !== '#') {
                this.pageContext.fillStyle = HelperMethods.getHighlightColorCode(format.highlightColor);
            } else {
                this.pageContext.fillStyle = HelperMethods.getColor(format.highlightColor);
            }

            this.pageContext.fillRect(Math.floor(this.getScaledValue(left + leftMargin, 1)), Math.floor(this.getScaledValue(top + topMargin, 2) - 1), Math.ceil(this.getScaledValue(elementBox.width) + 1), Math.ceil(this.getScaledValue(elementBox.height) + 1));
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
        let renderFontFamily: string = this.documentHelper.textHelper.getFontNameToRender(elementBox.scriptType, format);
        this.pageContext.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + '"' + renderFontFamily + '"';
        if (format.baselineAlignment === 'Subscript') {
            topMargin += elementBox.height - elementBox.height / 1.5;
        }
        let baselineOffset: number = elementBox.baselineOffset;
        topMargin = (format.baselineAlignment === 'Normal') ? topMargin + baselineOffset : (topMargin + (baselineOffset / 1.5));
        // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
        if (color === "empty" || color === '#00000000') {
            let bgColor: string = this.getBackgroundColorHeirachy(elementBox);
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
        //this.pageContext.direction = 'ltr';

        let isRTL: boolean = format.bidi || this.documentHelper.textHelper.isRTLText(elementBox.text);
        text = this.documentHelper.textHelper.setText(text, isRTL, format.bdo, true);
        if (format.allCaps) {
            text = text.toUpperCase();
        }
        let characterRange: CharacterRangeType = elementBox.characterRange;
        if (((characterRange == CharacterRangeType.WordSplit) ||
            (((characterRange & CharacterRangeType.WordSplit) == CharacterRangeType.WordSplit) &&
                ((characterRange & CharacterRangeType.RightToLeft) == CharacterRangeType.RightToLeft))) && format.bidi) {
            text = this.inverseCharacter(text);
        }
        let scaleFactor: number = format.scaling < 100 ? 1 : format.scaling / 100;
        if (characterRange === CharacterRangeType.RightToLeft && !HelperMethods.startsWith(text, ' ')) {
            this.pageContext.direction = 'rtl';
            left += elementBox.width;
        }
        if (this.documentHelper.owner.documentEditorSettings.showHiddenMarks && !this.isPrinting) {
            if ((elementBox instanceof TabElementBox || elementBox instanceof TextElementBox) && elementBox.text === "\t") {
                this.tabMark(elementBox, format, left, top, leftMargin, topMargin);
            }
            if (text === '\r') {
                text = String.fromCharCode(182);
            }
            (this.pageContext as any).letterSpacing = format.characterSpacing * this.documentHelper.zoomFactor + 'pt';
            this.pageContext.save();
            this.pageContext.scale(scaleFactor, 1);
            this.pageContext.fillText(this.replaceSpace(text), this.getScaledValue(left + leftMargin, 1)/(scaleFactor), this.getScaledValue(top + topMargin, 2), scaledWidth);            
            this.pageContext.restore();
        } else {
            (this.pageContext as any).letterSpacing = format.characterSpacing * this.documentHelper.zoomFactor + 'pt';
            this.pageContext.save();
            this.pageContext.scale(scaleFactor, 1);
            // Text frame align position.
            if (((elementBox.paragraph.containerWidget as TextFrame).containerShape as ShapeElementBox) && (elementBox.paragraph.containerWidget as TextFrame).textVerticalAlignment == 'Center') {
                let shapeHeight: number = ((elementBox.paragraph.containerWidget as TextFrame).containerShape as ShapeElementBox).height;
                let y: number = this.getScaledValue(top + topMargin, 2) + (this.getScaledValue(shapeHeight) / 4.5);
                let height: number = 0;
                if(elementBox.paragraph.containerWidget.childWidgets && elementBox.paragraph.containerWidget.childWidgets.length > 0) {
                    for(let i = 0; i < elementBox.paragraph.containerWidget.childWidgets.length; i++) {
                        height = height + (elementBox.paragraph.containerWidget.childWidgets[i] as TextFrame).height;
                    }
                }
                if((height + this.getScaledValue(shapeHeight) / 2) < this.getScaledValue(shapeHeight)) {
                    this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1) / (scaleFactor), y, scaledWidth);
                } else {
                    this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1) / (scaleFactor), this.getScaledValue(top + topMargin, 2), scaledWidth);
                }
            }
            else if (((elementBox.paragraph.containerWidget as TextFrame).containerShape as ShapeElementBox) && (elementBox.paragraph.containerWidget as TextFrame).textVerticalAlignment == 'Bottom') {
                let shapeHeight: number = ((elementBox.paragraph.containerWidget as TextFrame).containerShape as ShapeElementBox).height;
                let y: number = this.getScaledValue(top + topMargin, 2) + (this.getScaledValue(shapeHeight) / 2);
                let height: number = 0;
                if(elementBox.paragraph.containerWidget.childWidgets && elementBox.paragraph.containerWidget.childWidgets.length > 0) {
                    for(let i = 0; i < elementBox.paragraph.containerWidget.childWidgets.length; i++) {
                        height = height + (elementBox.paragraph.containerWidget.childWidgets[i] as TextFrame).height;
                    }
                }
                if((height + this.getScaledValue(shapeHeight) / 2) < this.getScaledValue(shapeHeight)) {
                    this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1) / (scaleFactor), y, scaledWidth);
                } else {
                    this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1) / (scaleFactor), this.getScaledValue(top + topMargin, 2), scaledWidth);
                }
            } else {
                this.pageContext.fillText(text, this.getScaledValue(left + leftMargin, 1) / (scaleFactor), this.getScaledValue(top + topMargin, 2), scaledWidth);
            }
            this.pageContext.restore();
        }
        if (characterRange === CharacterRangeType.RightToLeft && !HelperMethods.startsWith(text, ' ')) {
            this.pageContext.direction = 'ltr';
            left -= elementBox.width;
        }
        if (this.documentHelper.owner.isSpellCheck) {
            if (((this.documentHelper.owner.isSpellCheck && !this.spellChecker.removeUnderline) && (this.documentHelper.triggerSpellCheck || elementBox.canTrigger) && elementBox.text !== ' ' && !this.documentHelper.isScrollHandler && (isNullOrUndefined(elementBox.previousNode) || !(elementBox.previousNode instanceof FieldElementBox)))) {
                elementBox.canTrigger = true;
                this.leftPosition = this.pageLeft;
                this.topPosition = this.pageTop;
                let errorDetails: ErrorInfo = this.spellChecker.checktextElementHasErrors(elementBox.text, elementBox, left);
                if (errorDetails.errorFound && !this.isPrinting) {
                    color = '#FF0000';
                    let backgroundColor: string = (containerWidget instanceof TableCellWidget) ? (containerWidget as TableCellWidget).cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
                    const errors = this.spellChecker.errorWordCollection;
                    for (let i: number = 0; i < errorDetails.elements.length; i++) {
                        let currentElement: ErrorTextElementBox = errorDetails.elements[i];
                        const exactText = this.spellChecker.manageSpecialCharacters(currentElement.text, undefined, true);
                        if (elementBox.ignoreOnceItems.indexOf(exactText) === -1) {
                            if (isRTL) {
                                this.renderWavyLine(currentElement, (isNullOrUndefined(currentElement.end)) ? left : currentElement.end.location.x, top, underlineY, color, 'Single', format.baselineAlignment, backgroundColor);
                            } else {
                                this.renderWavyLine(currentElement, (isNullOrUndefined(currentElement.start)) ? left : currentElement.start.location.x, top, underlineY, color, 'Single', format.baselineAlignment, backgroundColor);
                            }
                            if (errors.containsKey(exactText)) {
                                const errorElements = errors.get(exactText);
                                if (errorElements.indexOf(currentElement) === -1) {
                                    errorElements.push(currentElement);
                                }
                            }
                        }
                    }
                } else if (elementBox.ischangeDetected || this.documentHelper.triggerElementsOnLoading) {
                    elementBox.ischangeDetected = false;
                    this.handleChangeDetectedElements(elementBox, underlineY, left, top, format.baselineAlignment);
                }
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

    private tabMark(elementBox: TextElementBox, format: WCharacterFormat, left: number, top: number, leftMargin: number, topMargin: number) {
        let tabMarkString: string = elementBox.paragraph.bidi? String.fromCharCode(8592): String.fromCharCode(8594);
        let tabMarkWidth: number = this.documentHelper.textHelper.getWidth(tabMarkString, format, elementBox.scriptType);
        let availableSpaceWidth = elementBox.width / 2;
        let tabWidth = tabMarkWidth / 2;
        this.pageContext.font = this.retriveCharacterformat(elementBox.characterFormat);
        (this.pageContext as any).letterSpacing = format.characterSpacing * this.documentHelper.zoomFactor + 'pt';
        this.pageContext.save();
        let scaleFactor: number = format.scaling < 100 ? 1 : format.scaling / 100;
        this.pageContext.scale(scaleFactor, 1);
        if (availableSpaceWidth > tabMarkWidth) {
            this.pageContext.fillText(tabMarkString, this.getScaledValue(((left + leftMargin + availableSpaceWidth) - (tabWidth)), 1)/scaleFactor, this.getScaledValue(top + topMargin, 2));
        } else {
            this.pageContext.fillText(tabMarkString, this.getScaledValue(left + leftMargin, 1)/scaleFactor, this.getScaledValue(top + topMargin, 2), this.getScaledValue(elementBox.width));
        }
        this.pageContext.restore();
    }
    private replaceSpace(text: string) {
        text = text.replace(new RegExp(String.fromCharCode(32), 'g'), String.fromCharCode(183));
        text = text.replace(new RegExp(String.fromCharCode(160), 'g'), String.fromCharCode(176));
        return text;
    }

    
    private inverseCharacter(ch: string): string {
        switch (ch) {
            //Specify the '('
            case String.fromCharCode(40):
                //Specify the ')'
                return String.fromCharCode(41);
            //Specify the ')'
            case String.fromCharCode(41):
                //Specify the '('
                return String.fromCharCode(40);

            //Specify the '<'
            case String.fromCharCode(60):
                //Specify the '>'
                return String.fromCharCode(62);

            //Specify the '>'
            case String.fromCharCode(62):
                //Specify the '<'
                return String.fromCharCode(60);

            //Specify the '{'
            case String.fromCharCode(123):
                //Specify the '}'
                return String.fromCharCode(125);

            //Specify the '}'
            case String.fromCharCode(125):
                //Specify the '{'
                return String.fromCharCode(123);

            //Specify the '['
            case String.fromCharCode(91):
                //Specify the ']'
                return String.fromCharCode(93);

            //Specify the ']'
            case String.fromCharCode(93):
                //Specify the '['
                return String.fromCharCode(91);

            default:
                return ch;
        }
    }

    private getBackgroundColorHeirachy(element: ElementBox): string {
        let bgColor: string;
        // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
        if (element.paragraph.isInsideTable) {
            let cell: TableCellWidget = element.paragraph.containerWidget as TableCellWidget;
            bgColor = cell.cellFormat.shading.backgroundColor;
            if (bgColor !== "empty" && bgColor !== '#00000000') {
                return bgColor;
            } else {
                bgColor = cell.ownerTable.tableFormat.shading.backgroundColor;
                if (bgColor !== "empty" && bgColor !== '#00000000') {
                    return bgColor;
                }
            }
        }else if(element.paragraph.containerWidget instanceof TextFrame
            && !isNullOrUndefined(element.paragraph.containerWidget.containerShape as ShapeElementBox) && !isNullOrUndefined((element.paragraph.containerWidget.containerShape as ShapeElementBox).fillFormat) && (element.paragraph.containerWidget.containerShape as ShapeElementBox).fillFormat.color  === '#000000FF'){
                return (element.paragraph.containerWidget.containerShape as ShapeElementBox).fillFormat.color;
        }
        return this.documentHelper.backgroundColor;
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
                            if (this.spellChecker.isInUniqueWords(retrievedText)) {
                                let hasSpellingError: boolean = this.spellChecker.isErrorWord(retrievedText) ? true : false;
                                let jsonObject: any = JSON.parse('{\"HasSpellingError\":' + hasSpellingError + '}');
                                this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, true);
                            } else if (!this.documentHelper.owner.editorModule.triggerPageSpellCheck || this.documentHelper.triggerElementsOnLoading) {
                                /* eslint-disable @typescript-eslint/no-explicit-any */
                                this.spellChecker.callSpellChecker(this.spellChecker.languageID, checkText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
                                    /* eslint-disable @typescript-eslint/no-explicit-any */
                                    let jsonObject: any = JSON.parse(data);
                                    if (!isNullOrUndefined(this.spellChecker)) {
                                        let canUpdate: boolean = (beforeIndex === this.pageIndex || elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);
                                        this.spellChecker.handleWordByWordSpellCheck(jsonObject, elementBox, left, top, underlineY, baselineAlignment, canUpdate);
                                    }
                                });
                            }
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
                let canUpdate: boolean = (elementBox.isVisible) && (indexInLine === elementBox.indexInOwner) && (indexinParagraph === elementBox.line.paragraph.indexInOwner);
                if (this.spellChecker.isInUniqueWords(currentText)) {
                    let hasSpellingError: boolean = this.spellChecker.isErrorWord(currentText) ? true : false;
                    let jsonObject: any = JSON.parse('{\"HasSpellingError\":' + hasSpellingError + '}');
                    this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, canUpdate, underlineY, iteration, markIndex, isLastItem);
                } else if (!this.documentHelper.owner.editorModule.triggerPageSpellCheck || this.documentHelper.triggerElementsOnLoading) {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    this.spellChecker.callSpellChecker(this.spellChecker.languageID, currentText, true, this.spellChecker.allowSpellCheckAndSuggestion).then((data: any) => {
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        let jsonObject: any = JSON.parse(data);
                        if (!isNullOrUndefined(this.spellChecker)) {
                            this.spellChecker.handleSplitWordSpellCheck(jsonObject, currentText, elementBox, canUpdate, underlineY, iteration, markIndex, isLastItem);
                        }
                    });
                }
            }
        }
    }


    public renderWavyLine(elementBox: TextElementBox, left: number, top: number, underlineY: number, color: string, underline: Underline, baselineAlignment: BaselineAlignment, backgroundColor?: string): void {
        if (this.isPrinting) {
            return;
        }
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

            let specialCharacter: SpecialCharacterInfo = this.spellChecker.getSpecialCharactersInfo(elementBox);

            let whiteSpaceData: SpaceCharacterInfo = this.spellChecker.getWhiteSpaceCharacterInfo(elementBox);

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
    /**
     * @private
     */
    public getTabLeader(elementBox: TabElementBox): string {
        let textWidth: number = 0;
        let tabString: string = this.getTabLeaderString(elementBox.tabLeader);
        let tabText: string = tabString;
        textWidth = this.documentHelper.textHelper.getWidth(tabText, elementBox.characterFormat, elementBox.scriptType);
        let count: number = Math.floor(elementBox.width / textWidth);
        if (textWidth == 0) {
            count = 0;
        }
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
            case 'Single':
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
    private getTrimmedWidth(elementBox: ElementBox): number {
        let width: number = elementBox.width;
        if (elementBox instanceof TextElementBox && !(elementBox instanceof TabElementBox) && isNullOrUndefined(elementBox.nextNode)) {
            width = this.documentHelper.textHelper.getWidth(HelperMethods.trimEnd(elementBox.text), elementBox.characterFormat, elementBox.scriptType);
        }
        return width;
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
            let width: number = this.getTrimmedWidth(elementBox);
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
            let width: number = this.getTrimmedWidth(elementBox);
            this.pageContext.fillRect(this.getScaledValue(left + elementBox.margin.left, 1), this.getScaledValue(y + top, 2), this.getScaledValue(width), this.getScaledValue(lineHeight));
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
            const fallbackImage: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8AAADgAADY2Njl5eVcXFxjY2NZWVl/f3+wsLCmpqb4+PiioqKpqam7u7vV1dX2uLj2wsLhFRXzpKT3vb30sbHhCwv74+P40dH+9vbkIyO2trbBwcHLy8tsbGycnJz529v4zMzrbGzlLS3qZmblNzfrdXXoRkbvi4vvgYHlHh7CZsBOAAADpUlEQVR4nO3da1faQBSF4ekAUQlUEFs14AXxVv7/D6yaQiZx5mSEYXF2ut+PNKzyyK5diYDmR9czx34AB49C/CjE759w3jvvWr15Tdgz3atXE54f++EcIArxoxA/CvGjED8K8aMQPwrxoxA/CvGLEeZ9jPJdhfk4GyCUjb3ECGE/Q6m/q3DwfudjP0ERZYN9hKdn2hvd3+0jHJz5/kBVuTk96bbQUEjhYR9ckiikUH8UUqg/CinUH4UU6o9CCvVHIYX6o5BC/VFIof4opFB/FFKoPwop1B+FFOqPQgrjyxfjVC38Lxk9tnAxGqZqdKtSOE4GHA5/fuNJpDCtcNHbv4VqYYqPLjgfUViPQgrjozA2CptRSGF8/59w+Wrt+rr1btNna1cPzg0wwuXavncxabnX7PfHYYXzlYARvlobQZyUR9mXm+1NMEK7SSLONgcVV9vb8IQXv4J3KSeKKlxXxNCzONkeYp8AV3p9UT1+P3FWHVAsq5thhGZSEb1DrSZq7dS5HUdoLiuBZ6jORG3tCwAkNJfCUJ2Jrqe1P0ESCkMNTdSACYNDDU7UoAkDQw1P1MAJvUMVJmrwhJ6hShM1gMIvQxUnahCFjaHKEzWQQneoxR95ogZTWBuqPFEDKnSHKk/UoArdoYoTNbDC5lBDEzW4QjMpYiZqgIXG/S76JhwHK5zVVipcnkIVuv/RW/HyFKhwYhuFr6NiCmdNoDBUSGFjovJQEYXuRN9ahwoorJ8uSZenPsMTNk+X2q6jwgm/ntHL11HhhL4zenmoYEL/Gb04VCxh6KKTNFQoYfiikzBUJKF00Sk8VCChfF00OFQcYdt10dBQYYRT5xn0n9G7Q0X8GfCzNNEyZ6iPgD/HlydaVg11DfhajJaJlm2HugIUrlomWrYZKuJKHz6vHhbSM/hROdRnxNe1meuXYvW0DB6+aflYrB7dlzDiCM3N1dVN6GDhMCDhjlHYjEIK46MwNgqbUUhhfJ/vA07wO8N1vw94ONo/3e/lTpVOYfc/UyG//ZmqW52fi/FuTNW3/lZ+eguF+qOQQv1RSKH+KKRQfxRSqD8KKdQfhRTqj0IK9UchhfqjkEL9UUih/iikUH8UUqg/CmXh6Hsv3jlK+wnvD/vgkrSHMMuyu1P9ZdmuwnycDQYn+svG3n9KEUKT9zHyf6+IEWJHIX4U4kchfhTiRyF+FOJHIX4U4kchfnVhijeZa6sunCf4ZdPamteEHY5C/CjEr/vCv0ec0g+AtS1QAAAAAElFTkSuQmCC';
            try {
                const imgX: number = this.getScaledValue(left + leftMargin, 1);
                const imgY: number = this.getScaledValue(top + topMargin, 2);
                const width: number = this.getScaledValue(elementBox.width);
                const height: number = this.getScaledValue(elementBox.height);
                const render: Renderer = this;
                elementBox.element.onload = (): void => {
                    const lastLoaded: string | null = elementBox.element.getAttribute("lastLoaded");

                    if (!isNullOrUndefined(render.documentHelper) && lastLoaded !== elementBox.element.src) {
                        if (!elementBox.isCrop) {
                            render.pageContext.drawImage(elementBox.element, imgX, imgY, width, height);
                        } else {
                            render.pageContext.drawImage(elementBox.element,
                                elementBox.cropX,
                                elementBox.cropY,
                                elementBox.cropWidth,
                                elementBox.cropHeight,
                                imgX,
                                imgY,
                                width,
                                height
                            );
                        }
                    }
                };

                elementBox.element.onerror = (): void => {
                    let srcImage: string = fallbackImage;
                    let imageString: string = this.documentHelper.getImageString(elementBox);
                    if (imageString && (HelperMethods.startsWith(imageString, 'http://') || HelperMethods.startsWith(imageString, 'https://'))) {
                        let imageStrings: string[] = this.viewer.documentHelper.images.get(parseInt(elementBox.imageString));
                        if (imageStrings && imageStrings.length > 1) {
                            srcImage = imageStrings[1];
                        }
                    }
                    elementBox.element.src = srcImage;
                };

                if (!elementBox.isCrop) {
                    this.pageContext.drawImage(elementBox.element, 
                        imgX, //dx
                        imgY, //dy
                        width, //dw
                        height); //dh
                } else {
                    this.pageContext.drawImage(elementBox.element, 
                        elementBox.cropX, //sx
                        elementBox.cropY, //sy
                        elementBox.cropWidth, //sw
                        elementBox.cropHeight, //sh
                        imgX, //dx
                        imgY, //dy
                        width, //dw
                        height); //dh
                }
            } catch (e) {
                let imageString: string = this.documentHelper.getImageString(elementBox);
                if (imageString && (HelperMethods.startsWith(imageString, 'http://') || HelperMethods.startsWith(imageString, 'https://'))) {
                    let imageStrings: string[] = this.viewer.documentHelper.images.get(parseInt(elementBox.imageString));
                    if (imageStrings && imageStrings.length > 1) {
                        elementBox.element.src = imageStrings[1];
                    } else {
                        elementBox.element.src = fallbackImage;
                    }
                } else {
                    elementBox.imageString = fallbackImage;
                    this.documentHelper.addBase64StringInCollection(elementBox);
                    elementBox.element.src = this.documentHelper.getImageString(elementBox);
                }
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
        this.documentHelper.owner.picturePositionY = this.getScaledValue(top + topMargin, 2);
        if (!isNullOrUndefined(this.documentHelper.selection) && this.documentHelper.selection.checkContentControlLocked() &&  this.documentHelper.selection.start.currentWidget === elementBox.line) {
            let contentControlImage: ElementBox = this.documentHelper.owner.getImageContentControl();
            if (!isNullOrUndefined(contentControlImage) && contentControlImage.contentControlProperties.type == "Picture") {
                let format: WCharacterFormat = elementBox.characterFormat;
                let color : string = contentControlImage.contentControlProperties.color;
                        if(color === '#00000000'){
                            //Change color to grey if color is transparent
                            color = '#939393'
                        }
                this.renderImgBorder(elementBox, left, top, 'black', 'Solid', 0.5, format.baselineAlignment);
            }
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

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y, tableWidget.x - tableWidget.margin.left - lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth, border.lineStyle);
        // }

        border = layout.getTableTopBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y - lineWidth / 2, lineWidth, border.lineStyle);
        // }
        border = !table.isBidiTable ? layout.getTableRightBorder(table.tableFormat.borders)
            : layout.getTableLeftBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y, tableWidget.x + tableWidget.width + tableWidget.margin.right + lineWidth / 2, tableWidget.y + tableWidget.height, lineWidth, border.lineStyle);
        // }
        border = layout.getTableBottomBorder(table.tableFormat.borders);
        lineWidth = 0;
        // if (!isNullOrUndefined(border )) {
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());

        this.renderSingleBorder(border.color, tableWidget.x - tableWidget.margin.left - lineWidth, tableWidget.y + tableWidget.height - lineWidth / 2, tableWidget.x + tableWidget.width + lineWidth + tableWidget.margin.right, tableWidget.y + tableWidget.height - lineWidth / 2, lineWidth, border.lineStyle);
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
        this.renderCellBackground(height, cellWidget, cellLeftMargin, cellRightMargin, lineWidth);
        let leftBorderWidth: number = lineWidth;
        if (tableCell.index === 0 || tableCell.cellFormat.rowSpan === 1 || (tableCell.cellFormat.rowSpan > 1 && tableCell.columnIndex === 0)) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y - cellWidget.margin.top, cellWidget.x - cellLeftMargin - lineWidth, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth, border.lineStyle);
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
                    let lineWidthInt: number = HelperMethods.convertPointToPixel(border.getLineWidth());
                    cellLeftMargin = tableCell.margin.left - lineWidthInt;
                    if (cell.y + cell.height < tableCell.y) {
                        continue;
                    } else if (cell.y < tableCell.y && cell.y + cell.height > tableCell.y) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, tableCell.y - cellTopMargin, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cell.margin.bottom, lineWidthInt, border.lineStyle);
                    } else if ((cell.y === tableCell.y) || (cell.y > tableCell.y && cell.y + cell.height < tableCell.y + tableCell.height)) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, cell.y - cell.margin.top, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cell.margin.bottom, lineWidthInt, border.lineStyle);
                    } else if (cell.y < tableCell.y + tableCell.height && cell.y + cell.height >= tableCell.y + tableCell.height) {
                        this.renderSingleBorder(border.color, tableCell.x - cellLeftMargin - lineWidthInt, cell.y - cell.margin.top, tableCell.x - cellLeftMargin - lineWidthInt, cell.y + cell.height + cellBottomMargin, lineWidthInt, border.lineStyle);
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
                    this.renderSingleBorder(border.color, cellX, cellY + lineWidth / 2, cellX + borderInfo.width, cellY + lineWidth / 2, lineWidth, border.lineStyle);
                    cellX = cellX + borderInfo.width;
                }
            }
        } else {
            border = TableCellWidget.getCellTopBorder(tableCell);
            // if (!isNullOrUndefined(border )) { //Renders the cell top border.        
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            let width: number = 0;
            this.renderSingleBorder(border.color, cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2, cellWidget.y - cellWidget.margin.top + lineWidth / 2, cellWidget.x + cellWidget.width + cellWidget.margin.right + width, cellWidget.y - cellWidget.margin.top + lineWidth / 2, lineWidth, border.lineStyle);
            // }
        }
        let isLastCell: boolean = false;
        if (!isBidiTable) {
            isLastCell = tableCell.cellIndex === tableCell.ownerRow.childWidgets.length - 1;
        } else {
            isLastCell = tableCell.columnIndex === 0;
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

            this.renderSingleBorder(border.color, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y - cellWidget.margin.top, cellWidget.x + cellWidget.width + cellWidget.margin.right - lineWidth / 2, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth, border.lineStyle);
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
            !nextRowIsInCurrentTableWidget || this.isRenderHeader || previousCellIndex && nextRow.childWidgets.length < tableCell.ownerRow.childWidgets.length
            && previousCellIndex < tableCell.columnIndex + tableCell.cellFormat.columnSpan ||
            ((!isNullOrUndefined(tableCell.cellFormat.borders.bottom) && tableCell.cellFormat.borders.bottom.lineStyle !== 'Cleared' && tableCell.cellFormat.rowSpan === 1 && !isBidiTable) &&
                ((!isNullOrUndefined(nextRow) && cellWidget.x < ((nextRow.firstChild as TableCellWidget).x - (nextRow.firstChild as TableCellWidget).margin.left) &&
                    nextRow.rowFormat.gridBefore > 0 && (nextRow.rowFormat.beforeWidth !== 0 || nextRow.rowFormat.gridBeforeWidth !== 0)) ||
                    (!isNullOrUndefined(nextRow) && cellWidget.x + cellWidget.width > ((nextRow.lastChild as TableCellWidget).x + (nextRow.lastChild as TableCellWidget).width + (nextRow.lastChild as TableCellWidget).margin.right) &&
                        nextRow.rowFormat.gridAfter > 0 && (nextRow.rowFormat.afterWidth !== 0 || nextRow.rowFormat.gridAfterWidth !== 0))))) {
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
            let startX: number = cellWidget.x - cellWidget.margin.left - leftBorderWidth / 2;
            let endX: number = cellWidget.x + cellWidget.width + cellWidget.margin.right;
            if (!(previousCellIndex && nextRow.childWidgets.length < tableCell.ownerRow.childWidgets.length && previousCellIndex < tableCell.columnIndex + tableCell.cellFormat.columnSpan) &&
                !isNullOrUndefined(nextRow) && !isBidiTable && nextRow.rowFormat.gridAfter > 0 && (nextRow.rowFormat.afterWidth !== 0 || nextRow.rowFormat.gridAfterWidth !== 0) && !isNullOrUndefined(nextRow.lastChild) && !isNullOrUndefined(TableCellWidget.getCellTopBorder(nextRow.lastChild as TableCellWidget)) && TableCellWidget.getCellTopBorder(nextRow.lastChild as TableCellWidget).lineStyle !== "None" && cellWidget.x < (nextRow.lastChild as TableCellWidget).x + (nextRow.lastChild as TableCellWidget).width + (nextRow.lastChild as TableCellWidget).margin.right) {
                startX = (nextRow.lastChild as TableCellWidget).x + (nextRow.lastChild as TableCellWidget).width + (nextRow.lastChild as TableCellWidget).margin.right;
            }
            if (!(previousCellIndex && nextRow.childWidgets.length < tableCell.ownerRow.childWidgets.length && previousCellIndex < tableCell.columnIndex + tableCell.cellFormat.columnSpan) &&
                !isNullOrUndefined(nextRow) && !isBidiTable && nextRow.rowFormat.gridBefore > 0 && (nextRow.rowFormat.beforeWidth !== 0 || nextRow.rowFormat.gridBeforeWidth !== 0) && !isNullOrUndefined(nextRow.firstChild) && !isNullOrUndefined(TableCellWidget.getCellTopBorder(nextRow.firstChild as TableCellWidget)) && TableCellWidget.getCellTopBorder(nextRow.firstChild as TableCellWidget).lineStyle !== "None" && cellWidget.x + cellWidget.width > (nextRow.firstChild as TableCellWidget).x - (nextRow.firstChild as TableCellWidget).margin.left) {
                endX = (nextRow.firstChild as TableCellWidget).x - (nextRow.firstChild as TableCellWidget).margin.left;
            }
            // if (!isNullOrUndefined(border )) {
            //Renders the cell bottom border.
            lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
            this.renderSingleBorder(border.color, startX, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, endX, cellWidget.y + cellWidget.height + cellBottomMargin + lineWidth / 2, lineWidth, border.lineStyle);
            // }
        }
        border = layout.getCellDiagonalUpBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal up border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y + cellWidget.height + cellBottomMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y - cellTopMargin, lineWidth, border.lineStyle);
            // }
        }
        border = layout.getCellDiagonalDownBorder(tableCell);
        // if (!isNullOrUndefined(border )) {
        //Renders the cell diagonal down border.
        lineWidth = HelperMethods.convertPointToPixel(border.getLineWidth());
        if (lineWidth > 0) {
            this.renderSingleBorder(border.color, cellWidget.x - cellLeftMargin, cellWidget.y - cellTopMargin, cellWidget.x + cellWidget.width + cellRightMargin, cellWidget.y + cellWidget.height + cellBottomMargin, lineWidth, border.lineStyle);
        }
        // }
    }
    private renderCellBackground(height: number, cellWidget: TableCellWidget, leftMargin: number, rightMargin: number, lineWidth: number): void {
        let cellFormat: WCellFormat = cellWidget.cellFormat;
        let bgColor: string = cellFormat.shading.backgroundColor === '#ffffff' ?
            cellWidget.ownerTable.tableFormat.shading.backgroundColor : cellFormat.shading.backgroundColor;
        let left: number = cellWidget.x - leftMargin - lineWidth;
        let topMargin: number = (cellWidget.margin.top - (cellWidget.containerWidget as TableRowWidget).topBorderWidth);
        let top: number = cellWidget.y - topMargin;
        let width: number = cellWidget.width + leftMargin + rightMargin + lineWidth / 2;
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
                this.pageContext.fillStyle = this.drawTextureStyle(cellFormat.shading.textureStyle, HelperMethods.getColor(cellFormat.shading.foregroundColor), HelperMethods.getColor(cellFormat.shading.backgroundColor), cellFormat.shading.foregroundColor === 'empty', cellFormat.shading.backgroundColor === 'empty');
                this.pageContext.fillRect(this.getScaledValue(left, 1), this.getScaledValue(top, 2), this.getScaledValue(width), this.getScaledValue(height));
                this.pageContext.closePath();
        }    
        
    }
    private drawTextureStyle(textureStyle: TextureStyle, foreColor: string, backColor: string, isForeColorEmpty: boolean, isBackColorEmpty: boolean): string {
        if (isBackColorEmpty) {
            backColor = '#ffffff';
        }
        if (isForeColorEmpty) {
            foreColor = '#000000';
        }
        if (textureStyle.indexOf('Percent') > -1) {
            let text: string = textureStyle.replace("Texture", "").replace("Percent", "").replace("Pt", ".");
            let percent: number = parseInt(text);
            return this.getForeColor(foreColor, backColor, percent, isForeColorEmpty, isBackColorEmpty);
        }
        if(textureStyle === 'TextureSolid') {
            return foreColor;
        }
        return '#FFFFFF';
    }
    private getForeColor(foreColor: string, backColor: string, percent: number, isForeColorEmpty: boolean, isBackColorEmpty: boolean): string {
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        let foreColorRgb: WColor = HelperMethods.convertHexToRgb(foreColor);
        let backColorRgb: WColor = HelperMethods.convertHexToRgb(backColor);
        r = this.getColorValue(foreColorRgb.r, backColorRgb.r, percent, isForeColorEmpty, isBackColorEmpty);
        g = this.getColorValue(foreColorRgb.g, backColorRgb.g, percent, isForeColorEmpty, isBackColorEmpty);
        b = this.getColorValue(foreColorRgb.b, backColorRgb.b, percent, isForeColorEmpty, isBackColorEmpty);
        return ('#' + HelperMethods.convertRgbToHex(r) + HelperMethods.convertRgbToHex(g) + HelperMethods.convertRgbToHex(b));
    }
    private getColorValue(foreColorValue: number, backColorValue: number, percent: number, isForeColorEmpty: boolean, isBackColorEmpty: boolean): number {
        let colorValue: number = 0;
        if (percent == 100) {
            colorValue = foreColorValue;
        }
        else {
            if (isForeColorEmpty) {
                if (isBackColorEmpty) {
                    colorValue = Math.round(255 * (1 - percent / 100));
                } else {
                    colorValue = Math.round(backColorValue * (1 - percent / 100));
                }
            }
            else {
                if (isBackColorEmpty) {
                    colorValue = Math.round(foreColorValue * (percent / 100));
                } else {
                    colorValue = backColorValue + Math.round(foreColorValue * (percent / 100)) - Math.round(backColorValue * (percent / 100));
                }
            }
        }
        return colorValue;
    }

    private renderSingleBorder(color: string, startX: number, startY: number, endX: number, endY: number, lineWidth: number, lineStyle: string): void {
        this.pageContext.beginPath();
        this.pageContext.moveTo(this.getScaledValue(startX, 1), this.getScaledValue(startY, 2));
        this.pageContext.lineTo(this.getScaledValue(endX, 1), this.getScaledValue(endY, 2));
        this.pageContext.lineWidth = this.getScaledValue(lineWidth);
        // set line color
        this.pageContext.strokeStyle = HelperMethods.getColor(color);
        if (lineStyle !== "None" && lineStyle !== "Cleared") {
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
        if (revisionInfo.length > 0) {
            return revisionInfo[0].color;
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

    private getFormfieldInLine(line: LineWidget) : FieldElementBox {
      for (let i: number = 0; i < line.children.length; i++) {
          if (line.children[i] instanceof FieldElementBox && !isNullOrUndefined((line.children[i] as FieldElementBox).formFieldData)) {
              return line.children[i] as FieldElementBox;
          }
      }
      return undefined;
    }
    // Shape utility
    private getShape(shape: string): string {
        return this.shapes[shape.toString()];
    }
    
    // eslint-disable-next-line prefer-const
    private shapes: {} = {
    
        //<---------------- Basic Shapes ---------------->
    
        'Rectangle': 'M0,0 L50,0 L50,50 L0,50 z',
    
        'Oval': 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
            'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z',
    
        'IsoscelesTriangle': 'M45,0 L90,45 L0,45 L45,0 z',
    
        'RightTriangle': 'M836.293,292.9238 L776.293,292.9238 L776.293,254.8408 L836.293,292.9238 z',
    
        'Parallelogram': 'M30,0 L60,0 L45,30 L15,30 z',
    
        'Trapezoid': 'M 1873 358 l -506 1332 h -686 l -506 -1332 z',
    
        'Diamond': 'M397.784,287.875 L369.5,316.159 L341.216,287.875 L369.5,259.591 L397.784,287.875 z',
    
        'RegularPentagon': 'M30,0 L60,30 L50,70 L10,70 L0,30 L30,0 z',
    
        'Hexagon': 'M30,0 L60,0 L90,30 L60,60 L30,60 L0,30 L30,0 z',
    
        'Heptagon': 'M223.7783,195.7134 L207.1303,174.8364 L213.0713,148.8034 L237.1303,137.2174 L261.1883,148.8034 L267.1303,174.8364' +
            'L250.4813,195.7134 L223.7783,195.7134 z',
    
        'Octagon': 'M98.7319,196.4653 L81.1579,178.8923 L81.1579,154.0393 L98.7319,136.4653 L123.5849,136.4653' +
            'L141.1579,154.0393 L141.1579,178.8923 L123.5849,196.4653 L98.7319,196.4653 z',
    
        'Decagon': 'M657.3379,302.4141 L642.3369,291.5161 L636.6089,273.8821 L642.3369,256.2481 L657.3379,245.3511 L675.8789,245.3511' +
            'L690.8789,256.2481 L696.6089,273.8821' +
            'L690.8789,291.5161 L675.8789,302.4141 L657.3379,302.4141 z',
    
        'Dodecagon': 'M-69.20000457763672,-17.685555555555553L-50.656966313962585,-48.31444444444445L-18.543038263674127,-66L18.543038263674134,-66L50.656966313962585,-48.31444444444445L69.20000457763672,-17.685555555555553L69.20000457763672,17.685555555555553L50.656966313962585,48.31444444444445L18.543038263674134,66L-18.543038263674127,66L-50.656966313962585,48.31444444444445L-69.20000457763672,17.685555555555553Z',
    
        'Pie': 'M 1024 1894 q -120 0 -231 -31 q -111 -31 -208 -88 q -97 -57 -176 -136 q -79 -79 -136 -176 q -57 -97 -88 -208 q -31 -111 -31 -231 q 0 -109 26 -212 q 26 -102 75 -194 q 48 -92 117 -170 q 68 -78 153 -138 q 84 -59 183 -98 q 99 -39 207 -52 l 58 -7 v 922 h 922 l -7 58 q -13 109 -52 207 q -39 99 -98 183 q -60 85 -138 153 q -78 69 -170 117 q -92 49 -194 75 q -103 26 -212 26 z',
    
        'Chord': 'M 1024 1894 q -120 0 -231 -31 q -111 -31 -208 -88 q -97 -57 -176 -136 q -79 -79 -136 -176 q -57 -97 -88 -208 q -31 -111 -31 -231 q 0 -116 29 -224 q 29 -108 82 -203 q 53 -94 128 -173 q 75 -79 167 -137 q 92 -57 198 -92 q 106 -34 222 -40 l 23 -1 l 891 891 l -1 23 q -6 116 -40 222 q -35 106 -92 198 q -58 92 -137 167 q -79 75 -173 128 q -95 53 -203 82 q -108 29 -224 29 z',
    
        'Teardrop': 'M 1024 1894 q -120 0 -231 -31 q -111 -31 -208 -88 q -97 -57 -176 -136 q -79 -79 -136 -176 q -57 -97 -88 -208 q -31 -111 -31 -231 q 0 -120 31 -231 q 31 -111 88 -208 q 57 -97 136 -176 q 79 -79 176 -136 q 97 -57 208 -88 q 111 -31 231 -31 h 870 v 870 q 0 120 -31 231 q -31 111 -88 208 q -57 97 -136 176 q -79 79 -176 136 q -97 57 -208 88 q -111 31 -231 31 z',
    
        'Frame': 'M 1894 154 v 1740 h -1740 v -1740 m 1433 307 h -1126 v 1126 h 1126 z',
    
        'HalfFrame': 'M 154 154 h 1668 l -307 307 h -1054 v 1054 l -307 307 z',
    
        'L_Shape': 'M 870 154 v 1024 h 1024 v 716 h -1740 v -1740 z',
    
        'DiagonalStripe': 'M 154 943 l 789 -789 h 879 l -1668 1668 z',
    
        'Cross': 'M 666 1894 v -512 h -512 v -716 h 512 v -512 h 716 v 512 h 512 v 716 h -512 v 512 z',
    
        'Plaque': 'M 563 1894 v -51 q 0 -66 -31 -131 q -31 -64 -81 -115 q -51 -50 -115 -81 q -65 -31 -131 -31 h -51 v -922 h 51 q 66 0 131 -31 q 64 -31 115 -82 q 50 -50 81 -115 q 31 -64 31 -130 v -51 h 922 v 51 q 0 66 31 130 q 31 65 82 115 q 50 51 115 82 q 64 31 130 31 h 51 v 922 h -51 q -66 0 -130 31 q -65 31 -115 81 q -51 51 -82 115 q -31 65 -31 131 v 51 z',
    
        // 'Can': 'M 1024 154 q 132 0 253 15 q 121 16 213 43 q 91 27 146 64 q 54 38 54 82 v 1332 q 0 44 -54 81 q -55 38 -146 65 q -92 27 -213 42 q -121 16 -253 16 q -132 0 -253 -16 q -121 -15 -212 -42 q -92 -27 -146 -65 q -55 -37 -55 -81 v -1332 q 0 -44 55 -82 q 54 -37 146 -64 q 91 -27 212 -43 q 121 -15 253 -15 z',
    
        'Cube': 'M 1946 102 v 1280 l -564 564 h -1280 v -1280 l 564 -564 m 665 615 h -1126 v 1126 h 1126 m 51 -1229 l 410 -409 h -1075 l -410 409 m 1536 -307 l -409 410 v 1024 l 409 -410 z',
    
        'Bevel': 'M 1946 102 v 1844 h -1844 v -1844 m 175 103 l 205 205 h 1084 l 205 -205 m -235 1331 v -1024 h -1024 v 1024 m -307 235 l 205 -205 v -1084 l -205 -205 m 1566 1566 l -205 -205 h -1084 l -205 205 m 1566 -1566 l -205 205 v 1084 l 205 205 z',
    
        'Donut': 'M 1024 154 q 120 0 231 31 q 111 31 208 88 q 97 57 176 136 q 79 79 136 176 q 57 97 88 208 q 31 111 31 231 q 0 120 -31 231 q -31 111 -88 208 q -57 97 -136 176 q -79 79 -176 136 q -97 57 -208 88 q -111 31 -231 31 q -120 0 -231 -31 q -111 -31 -208 -88 q -97 -57 -176 -136 q -79 -79 -136 -176 q -57 -97 -88 -208 q -31 -111 -31 -231 q 0 -120 31 -231 q 31 -111 88 -208 q 57 -97 136 -176 q 79 -79 176 -136 q 97 -57 208 -88 q 111 -31 231 -31 m 0 1331 q 95 0 179 -37 q 84 -36 147 -99 q 62 -62 99 -146 q 36 -84 36 -179 q 0 -95 -36 -179 q -37 -84 -99 -147 q -63 -62 -147 -99 q -84 -36 -179 -36 q -95 0 -179 36 q -84 37 -146 99 q -63 63 -99 147 q -37 84 -37 179 q 0 95 37 179 q 36 84 99 146 q 62 63 146 99 q 84 37 179 37 z',
    
        'NoSymbol': 'M 1024 154 q 124 0 237 30 q 112 30 209 85 q 96 56 175 134 q 78 79 134 175 q 55 97 85 209 q 30 113 30 237 q 0 124 -30 236 q -30 113 -85 209 q -56 97 -134 175 q -79 79 -175 134 q -97 56 -209 86 q -113 30 -237 30 q -124 0 -236 -30 q -113 -30 -209 -86 q -97 -55 -175 -134 q -79 -78 -134 -175 q -56 -96 -86 -209 q -30 -112 -30 -236 q 0 -124 30 -237 q 30 -112 86 -209 q 55 -96 134 -175 q 78 -78 175 -134 q 96 -55 209 -85 q 112 -30 236 -30 m 273 1369 l -772 -772 l -28 74 q -36 96 -36 199 q 0 116 45 218 q 44 103 121 179 q 76 77 179 121 q 102 45 218 45 q 103 0 199 -36 m 328 -328 q 36 -96 36 -199 q 0 -116 -44 -219 q -45 -102 -121 -179 q -77 -76 -179 -121 q -103 -44 -219 -44 q -103 0 -199 36 l -74 28 l 772 772 z',
    
        'BlockArc': 'M 1485 1485 v -51 q 0 -96 -36 -180 q -37 -84 -99 -147 q -63 -62 -147 -98 q -84 -36 -179 -36 q -95 0 -179 36 q -84 36 -146 98 q -63 63 -99 147 q -37 84 -37 180 v 51 h -409 v -51 q 0 -120 31 -231 q 31 -111 88 -208 q 57 -97 136 -177 q 79 -79 176 -136 q 97 -57 208 -88 q 111 -31 231 -31 q 120 0 231 31 q 111 31 208 88 q 97 57 176 136 q 79 80 136 177 q 57 97 88 208 q 31 111 31 231 v 51 z',
    
        'FoldedCorner': 'M 1946 102 v 1229 l -615 615 h -1229 v -1844 m 1229 1699 l 470 -470 h -470 m 512 -1126 h -1638 v 1638 h 1024 v -614 h 614 z' + 'M 154 1894 v -1740 h 1740 v 1156 l -584 584 z',
    
        'SmileyFace': 'M 1024 102 q 127 0 245 33 q 118 33 221 93 q 102 60 186 144 q 84 84 144 186 q 60 103 93 221 q 33 118 33 245 q 0 127 -33 245 q -33 118 -93 220 q -60 103 -144 187 q -84 84 -186 144 q -103 60 -221 93 q -118 33 -245 33 q -127 0 -245 -33 q -118 -33 -220 -93 q -103 -60 -187 -144 q -84 -84 -144 -187 q -60 -102 -93 -220 q -33 -118 -33 -245 q 0 -127 33 -245 q 33 -118 93 -221 q 60 -102 144 -186 q 84 -84 187 -144 q 102 -60 220 -93 q 118 -33 245 -33 m 0 1741 q 113 0 218 -30 q 104 -29 195 -82 q 91 -53 166 -128 q 75 -75 128 -166 q 53 -91 83 -196 q 29 -104 29 -217 q 0 -113 -29 -218 q -30 -104 -83 -195 q -53 -91 -128 -166 q -75 -75 -166 -128 q -91 -53 -195 -83 q -105 -29 -218 -29 q -113 0 -217 29 q -105 30 -196 83 q -91 53 -166 128 q -75 75 -128 166 q -53 91 -82 195 q -30 105 -30 218 q 0 113 30 217 q 29 105 82 196 q 53 91 128 166 q 75 75 166 128 q 91 53 196 82 q 104 30 217 30 m 358 -1331 q 32 0 60 12 q 28 12 49 33 q 21 21 33 49 q 12 28 12 60 q 0 32 -12 59 q -12 28 -33 49 q -21 21 -49 33 q -28 12 -60 12 q -32 0 -59 -12 q -28 -12 -49 -33 q -21 -21 -33 -49 q -12 -27 -12 -59 q 0 -32 12 -60 q 12 -28 33 -49 q 21 -21 49 -33 q 27 -12 59 -12 m 52 102 h -103 v 103 h 103 m -768 -205 q 31 0 59 12 q 28 12 49 33 q 21 21 33 49 q 12 28 12 60 q 0 32 -12 59 q -12 28 -33 49 q -21 21 -49 33 q -28 12 -59 12 q -32 0 -60 -12 q -28 -12 -49 -33 q -21 -21 -33 -49 q -12 -27 -12 -59 q 0 -32 12 -60 q 12 -28 33 -49 q 21 -21 49 -33 q 28 -12 60 -12 m 51 102 h -103 v 103 h 103 m 823 512 q -18 87 -66 162 q -48 75 -117 130 q -69 55 -154 86 q -86 31 -179 31 q -93 0 -178 -31 q -86 -31 -155 -86 q -69 -55 -117 -130 q -48 -75 -66 -162 h 106 q 17 66 57 122 q 39 56 94 97 q 55 42 122 65 q 66 23 137 23 q 71 0 138 -23 q 66 -23 121 -65 q 55 -41 95 -97 q 39 -56 56 -122 z',
    
        'Heart': 'M 997 1758 q -401 -286 -612 -551 q -212 -265 -231 -504 v -101 q 9 -106 45 -187 q 35 -80 87 -135 q 52 -55 114 -85 q 62 -30 122 -36 q 21 -2 41 -3 q 19 -1 38 -1 q 67 0 119 12 q 51 13 96 38 q 44 26 85 65 q 40 39 84 91 l 39 46 l 39 -46 q 44 -52 85 -91 q 40 -39 85 -65 q 44 -25 96 -38 q 51 -12 118 -12 q 19 0 39 1 q 19 1 40 3 q 60 6 122 36 q 62 31 114 86 q 51 56 87 137 q 36 82 45 189 v 100 q -19 240 -229 503 q -211 264 -609 548 l -30 21 z',
    
        'LightningBolt': 'M-8,-55L7,-24L1,-20L19,6L13,11L36,55L-3,21L5,16L-19,-6L-11,-12L-36,-35Z',
    
        'Sun': 'M69.60002899169922,0L41.51352437242167,8.416795119701419L41.51352437242167,-8.416795119701426ZM49.209798275982905,-41.47314036934465L36.41601824906962,-18.783766017986338L22.290725499983694,-30.686752034954836ZM0,-58.64998245239259L9.988224375410937,-34.982276749768076L-9.988224375410944,-34.982276749768076ZM-49.216242723111755,-41.47314036934465L-22.290725499983694,-30.686752034954836L-36.416018249069616,-18.783766017986338ZM-69.60002899169922,0L-41.51352437242167,-8.416795119701426L-41.51352437242167,8.416795119701419ZM-49.216242723111755,41.46770981541388L-36.416018249069616,18.783766017986338L-22.290725499983694,30.68675203495485ZM0,58.64998245239259L-9.988224375410944,34.98227674976806L9.988224375410937,34.98227674976806ZM49.209798275982905,41.46770981541388L22.290725499983694,30.68675203495485L36.41601824906962,18.783766017986338ZM-34.80001449584961,0Q-34.800014495849624,-12.14680908236253,-24.607326235405417,-20.735900154279413Q-14.414637974961238,-29.32499122619629,-1.4210854715202004e-14,-29.324991226196296Q14.414637974961224,-29.324991226196293,24.60732623540541,-20.735900154279413Q34.80001449584961,-12.146809082362545,34.80001449584961,-7.105427357601002e-15Q34.80001449584961,12.146809082362523,24.60732623540541,20.735900154279406Q14.414637974961224,29.32499122619629,0,29.32499122619629Q-14.414637974961217,29.32499122619629,-24.607326235405388,20.73590015427945Q-34.8000144958496,12.146809082362552,-34.80001449584961,7.105427357601002e-15Z',
    
        'Moon': 'M36.80000305175781,60.90000915527344Q6.313882332939066,60.90000915527344,-15.243060359409363,43.06280944801668Q-36.80000305175781,25.22560974075992,-36.80000305175781,7.105427357601002e-15Q-36.800003051757834,-25.225609740759907,-15.243060359409384,-43.062809448016665Q6.3138823329390235,-60.90000915527342,36.8000030517578,-60.90000915527344Q6.313882332939052,-41.98080184970351,0.9246466598519447,-10.765702362004177Q-4.464589013235177,20.449397125695157,18.400001525878878,45.67500686645508Q26.28571646554125,54.375008174351294,36.800003051757784,60.90000915527344Z',
    
        'Cloud': 'M 1024 1792 q -60 0 -115 -20 q -55 -19 -100 -54 q -46 -34 -79 -83 q -34 -48 -50 -106 l -24 -86 l -62 65 q -37 38 -83 58 q -47 21 -101 21 q -54 0 -101 -21 q -47 -20 -81 -55 q -35 -35 -54 -83 q -20 -47 -20 -100 q 0 -48 18 -91 q 18 -42 50 -78 l 25 -28 l -19 -32 q -38 -64 -56 -135 q -18 -71 -18 -145 q 0 -116 44 -219 q 44 -102 121 -179 q 76 -76 179 -121 q 102 -44 219 -44 q 106 0 206 38 q 99 39 177 113 l 39 37 l 35 -41 q 61 -72 140 -110 q 79 -37 171 -37 q 85 0 160 32 q 74 33 130 88 q 55 56 87 130 q 32 75 32 160 q 0 70 -23 135 q -23 66 -71 123 l -28 34 l 30 32 q 45 51 69 112 q 23 61 23 127 q 0 74 -28 139 q -28 65 -76 114 q -49 49 -114 77 q -66 28 -140 28 q -63 0 -126 -24 l -44 -17 l -20 43 q -23 47 -56 84 q -34 38 -76 64 q -42 27 -90 41 q -48 14 -100 14 z',
    
        'Arc': 'M-1.4210854715202004e-14,-45.200008392333984Q15.408730615404892,-45.200008392334,26.304348523034477,-31.96123244390823Q37.19996643066406,-18.722456495482472,37.19996643066406,-2.1316282072803006e-14Q37.19996643066406,-1.4210854715202004e-14,37.19996643066406,-1.4210854715202004e-14',
    
        'DoubleBracket': 'M 717 1843 v 103 h -307 q -63 0 -119 -25 q -56 -24 -98 -66 q -42 -42 -66 -98 q -25 -56 -25 -119 v -1228 q 0 -63 25 -119 q 24 -56 66 -98 q 42 -42 98 -67 q 56 -24 119 -24 h 307 v 103 h -307 q -42 0 -79 16 q -38 16 -66 44 q -28 28 -44 65 q -16 38 -16 80 v 1228 q 0 42 16 79 q 16 38 44 66 q 28 28 66 44 q 37 16 79 16 m 1228 -1741 q 63 0 119 24 q 56 25 98 67 q 42 42 67 98 q 24 56 24 119 v 1228 q 0 63 -24 119 q -25 56 -67 98 q -42 42 -98 66 q -56 25 -119 25 h -307 v -103 h 307 q 42 0 80 -16 q 37 -16 65 -44 q 28 -28 44 -66 q 16 -37 16 -79 v -1228 q 0 -42 -16 -80 q -16 -37 -44 -65 q -28 -28 -65 -44 q -38 -16 -80 -16 h -307 v -103 z',
    
        'DoubleBrace': 'M 1843 1126 q -38 0 -75 8 q -37 9 -66 32 q -29 23 -46 62 q -18 40 -18 103 v 410 q 0 77 -22 118 q -23 42 -55 61 q -33 20 -68 23 q -35 3 -59 3 h -103 v -103 q 14 -1 25 -1 q 10 0 18 0 q 15 0 27 0 q 11 1 33 1 q 38 0 59 -16 q 20 -15 30 -35 q 11 -22 13 -51 v -410 q 0 -62 18 -113 q 17 -51 46 -90 q 29 -39 66 -66 q 36 -26 75 -38 q -39 -12 -75 -40 q -37 -27 -66 -67 q -29 -40 -46 -91 q -18 -50 -18 -109 v -410 q 0 -38 -16 -59 q -16 -20 -35 -30 q -23 -11 -51 -13 h -103 v -103 h 103 q 57 3 102 26 q 19 10 38 24 q 18 15 32 37 q 14 22 23 51 q 9 29 9 67 v 410 q 0 59 18 98 q 17 39 46 63 q 29 24 66 34 q 37 10 75 10 m -1638 0 q 38 0 75 -10 q 37 -10 66 -34 q 29 -24 47 -63 q 17 -39 17 -98 v -410 q 0 -38 9 -67 q 9 -29 23 -51 q 14 -22 33 -37 q 18 -14 37 -24 q 45 -23 102 -26 h 103 v 103 h -103 q -29 2 -51 13 q -20 10 -35 30 q -16 21 -16 59 v 410 q 0 59 -17 109 q -18 51 -47 91 q -29 40 -65 67 q -37 28 -76 40 q 39 12 76 38 q 36 27 65 66 q 29 39 47 90 q 17 51 17 113 v 410 q 2 29 13 51 q 10 20 31 35 q 20 16 58 16 q 22 0 33 -1 q 11 0 27 0 q 8 0 19 0 q 10 0 24 1 v 103 h -103 q -24 0 -59 -3 q -35 -3 -67 -23 q -33 -19 -55 -61 q -23 -41 -23 -118 v -410 q 0 -63 -17 -103 q -18 -39 -47 -62 q -29 -23 -66 -32 q -37 -8 -75 -8 z',
    
        'LeftBracket': 'M 1331 1843 v 103 h -307 q -63 0 -119 -25 q -56 -24 -98 -66 q -42 -42 -66 -98 q -24 -56 -24 -119 v -1228 q 0 -63 24 -119 q 24 -56 66 -98 q 42 -42 98 -67 q 56 -24 119 -24 h 307 v 103 h -307 q -42 0 -79 16 q -38 16 -66 44 q -28 28 -44 65 q -16 38 -16 80 v 1228 q 0 42 16 79 q 16 38 44 66 q 28 28 66 44 q 37 16 79 16 z',
    
        'RightBracket': 'M 1024 102 q 63 0 119 24 q 56 25 98 67 q 42 42 66 98 q 24 56 24 119 v 1228 q 0 63 -24 119 q -24 56 -66 98 q -42 42 -98 66 q -56 25 -119 25 h -307 v -103 h 307 q 42 0 80 -16 q 37 -16 65 -44 q 28 -28 44 -66 q 16 -37 16 -79 v -1228 q 0 -42 -16 -80 q -16 -37 -44 -65 q -28 -28 -65 -44 q -38 -16 -80 -16 h -307 v -103 z',
    
        'LeftBrace': 'M 717 922 q 38 0 75 -10 q 37 -10 66 -34 q 29 -24 47 -63 q 17 -39 17 -98 v -410 q 0 -38 9 -67 q 9 -29 23 -51 q 14 -22 33 -37 q 18 -14 37 -24 q 45 -23 102 -26 h 103 v 103 h -103 q -29 2 -51 13 q -20 10 -35 30 q -16 21 -16 59 v 410 q 0 59 -17 109 q -18 51 -47 91 q -29 40 -65 67 q -37 28 -76 40 q 39 12 76 38 q 36 27 65 66 q 29 39 47 90 q 17 51 17 113 v 410 q 2 29 13 51 q 10 20 31 35 q 20 16 58 16 q 22 0 33 -1 q 11 0 27 0 q 8 0 19 0 q 10 0 24 1 v 103 h -103 q -24 0 -59 -3 q -35 -3 -67 -23 q -33 -19 -55 -61 q -23 -41 -23 -118 v -410 q 0 -63 -17 -103 q -18 -39 -47 -62 q -29 -23 -66 -32 q -37 -8 -75 -8 z',
    
        'RightBrace': 'M 1229 1126 q -39 0 -75 8 q -37 9 -66 32 q -29 23 -46 62 q -18 40 -18 103 v 410 q 0 51 -10 86 q -11 35 -28 58 q -18 23 -40 35 q -22 13 -44 18 q -23 6 -45 7 q -22 1 -38 1 h -102 v -103 q 14 -1 25 -1 q 10 0 18 0 q 15 0 26 0 q 11 1 33 1 q 38 0 59 -16 q 21 -15 31 -35 q 11 -22 13 -51 v -410 q 0 -62 18 -113 q 17 -51 46 -90 q 28 -39 65 -66 q 36 -26 75 -38 q -39 -12 -75 -40 q -37 -27 -65 -67 q -29 -40 -46 -91 q -18 -50 -18 -109 v -410 q 0 -38 -16 -59 q -16 -20 -36 -30 q -23 -11 -51 -13 h -102 v -103 h 102 q 57 3 102 26 q 19 10 38 24 q 18 15 33 37 q 14 22 23 51 q 9 29 9 67 v 410 q 0 59 18 98 q 17 39 46 63 q 29 24 66 34 q 36 10 75 10 z',
    
        'Plus': 'M696.6084,158.2656 L674.8074,158.2656 L674.8074,136.4656 L658.4084,136.4656 L658.4084,158.2656 L636.6084,158.2656' +
            'L636.6084,174.6646 L658.4084,174.6646 L658.4084,196.4656 L674.8074,196.4656 L674.8074,174.6646 L696.6084,174.6646' +
            'L696.6084,158.2656 z',
    
        'Star': 'M540.3643,137.9336 L546.7973,159.7016 L570.3633,159.7296 L550.7723,171.9366 L558.9053,194.9966 L540.3643,179.4996' +
            'L521.8223,194.9966 L529.9553,171.9366 L510.3633,159.7296 L533.9313,159.7016 L540.3643,137.9336 z',
    
        'Can': 'M 542.802,362.009C 542.802,368.452 525.341,373.676 503.802,373.676C 482.263,373.676 464.802,368.452 464.802,362.009' +
            'L 464.802,466.484C 464.802,472.928 482.263,478.151 503.802,478.151' +
            'C 525.341,478.151 542.802,472.928 542.802,466.484L 542.802,362.016C 542.802,368.459 525.341,373.534 503.802,373.534' +
            'C 482.263,373.534 464.802,368.31 464.802,361.867' +
            'L 464.802,362.016C 464.802,355.572 482.263,350.349 503.802,350.349C 525.341,350.349 542.802,355.572 542.802,362.016',
    
    
        //<---------------- Flowchart Shapes ---------------->
    
    
        'FlowChartProcess': 'M419.511,76.687L359.511,76.687L359.511,43.086L419.511,43.086z',
    
        'FlowChartAlternateProcess': 'M 456 1690 q -62 0 -117 -24 q -55 -24 -96 -65 q -41 -41 -65 -96 q -24 -55 -24 -118 v -726 q 0 -63 24 -118 q 24 -55 65 -96 q 41 -41 96 -65 q 55 -24 117 -24 h 1136 q 62 0 117 24 q 55 24 96 65 q 41 41 65 96 q 24 55 24 118 v 726 q 0 63 -24 118 q -24 55 -65 96 q -41 41 -96 65 q -55 24 -117 24 z',
    
        'FlowChartPunchedTape': 'M 563 1894 q -94 0 -169 -15 q -76 -15 -129 -38 q -54 -23 -82 -50 q -29 -27 -29 -50 v -1276 q 69 45 175 71 q 105 27 234 27 q 109 0 203 -20 q 94 -19 163 -54 q 68 -34 107 -81 q 39 -46 39 -101 q 0 -23 29 -50 q 29 -27 83 -50 q 53 -23 129 -38 q 75 -15 169 -15 q 94 0 170 15 q 75 15 128 38 q 53 23 82 50 q 29 27 29 50 v 1276 q -69 -45 -174 -72 q -106 -26 -235 -26 q -110 0 -203 19 q -94 20 -162 54 q -69 35 -108 81 q -39 47 -39 102 q 0 23 -29 50 q -29 27 -82 50 q -54 23 -129 38 q -76 15 -170 15 Z',
    
        'FlowChartDecision': 'M 253.005,115.687L 200.567,146.071L 148.097,115.687L 200.534,85.304L 253.005,115.687 Z',
    
        'FlowChartDocument': 'M 60 31.9 c 0 0 -11 -7.7 -30 0 s -30 0 -30 0 V 0 h 60 V 31.9 Z',
    
        'FlowChartPredefinedProcess': 'M 0,0 L 50,0 L 50,50 L 0,50 Z  M 8.334,0 L 8.334,50 M 41.667,0 L 41.667,50',
    
        'FlowChartTerminator': 'M 269.711,29.33C 269.71,44.061 257.77,56 243.04,56L 158.058,56C 143.33,56 131.39,44.061 131.39,29.33L 131.39,29.33' +
            'C 131.391,14.6057 143.33,2.669 158.058,2.669L 243.044,2.669C 257.772,2.669 269.711,14.6057 269.711,29.333 Z',
    
        'PaperTap': 'M0.0009,17.2042 L0.0009,47.165 C0.001,47.165 14.403,53.5455 25.00,47.165 C35.599,40.7852 44.403,43.5087 50.00,47.165' +
            'L50.001,17.2042 M50.001,32.7987 L50.001,2.8405 C50.001,2.8405 35.599,-3.5427 25.001,2.8405' +
            'C14.403,9.2237 5.599,6.494 0.0009,2.8405 L0.0009,32.7987',
    
        'DirectData': 'M 132.62 0 L 17.38 0 C 7.78 0 0 13.43 0 30 C 0 46.57 7.78 60 17.38 60 L 132.62 60 M 132.62 0' +
            'C 123.02 0 115.24 13.43 115.24 30 C 115.24 46.57 123.02 60 132.62 60 C 142.22 60 150 46.57 150 30 C 150 13.43 142.22 0 132.62 0 z ',
    
        'SequentialData': 'M0.0029,24.999 C0.0029,11.1922 10.433,0.0021 23.295,0.0021 C36.159,0.00216 46.585,11.1922 46.585,24.999' +
            'C46.585,38.8057 36.159,49.9979 23.295,49.9979 C10.433,49.9979 0.0029,38.8057 0.0029,24.999 z M23.294,49.999 L50.002,49.999',
    
        'FlowChartSort': 'M50.001,24.9971 L25.001,49.9971 L0.00097,24.9971 L25.001,-0.00286865 L50.001,24.9971 z' +
            ' M0.000976562,24.9971 L50.001,24.9971',
    
        'FlowChartMultiDocument': 'M43.6826,40 C44.8746,40.6183 45.8586,41.3502 46.8366,42.1122 L46.8366,4.74487 L3.09857,4.74487 L3.09857,10.9544' +
            ' M46.837,35.143 C48.027,35.765 49.025,36.604 50.003,37.369 L50.003,0.002 L6.264,0.002 L6.264,4.744 M43.682,47.113 L43.682,10.765' +
            ' L0.0025,10.7652 L0.0025,47.1132 C0.0025,47.1132 12.5846,53.6101 21.8426,47.1132 C31.1006,40.6163 38.792,43.393 43.6826,47.1132 z',
    
        'FlowChartCollate': 'M50.001,0.0028 L25.001,25.0029 L0.00097,0.0028 L50.001,0.002 z M0.0009,50.002 L25.001,25.002' +
            'L50.001,50.002 L0.0009,50.0029 z',
    
        'FlowChartSummingJunction': 'M7.3252,42.6768 L42.6772,7.3247 M42.6768,42.6768 L7.3248,7.3247 M0.0009,25.001 ' +
            'C0.0009,11.193 11.197,0.0009 25.001,0.0009' +
            ' C38.809,0.0009 50.001,11.193 50.001,25.001 C50.001,38.809 38.809,50.001 25.001,50.001 C11.197,50.00 0.0009,38.809 0.0009,25.00 z',
    
        'FlowChartOr': 'M 0 50 L 100 50 M 50 100 L 50 0.0 M 0 50 C 0 22.384 22.392 0 50 0 C 77.616 0 100 22.384 100 50' +
            ' C 100 77.616 77.616 100 50 100 C 22.392 100 0 77.616 0 50 Z',
    
        'FlowChartInternalStorage': 'M 0 3.81946A 2.5,3.81946 0 0,1 2.5,0L 47.5 0A 2.5,3.81946 0 0,1 50,3.81946' +
            'L 50 45.836A 2.5,3.819446 0 0,1 47.5,49.652778' +
            'L 2.5 49.652778A 2.5,3.819446 0 0,1 0,45.8336L 0 3.819446ZM 0 11.45834L 50 11.4583334M 12.5 0L 12.5 49.652778',
    
        'FlowChartExtract': 'M0,35 L30,0 L60,35 Z',
    
        'FlowChartManualOperation': 'M46.4,28.8 L14.8,28.8 L0,0 L60,0 Z',
    
        'FlowChartMagneticDisk': 'M 1024 1690 q -128 0 -242 -13 q -115 -12 -211 -34 q -97 -22 -174 -52 q -78 -30 -131 -64 q -54 -34 -83 -71 q -29 -37 -29 -74 v -716 q 0 -36 29 -74 q 29 -37 83 -71 q 53 -34 131 -64 q 77 -30 174 -52 q 96 -22 211 -35 q 114 -12 242 -12 q 128 0 243 12 q 114 13 211 35 q 96 22 174 52 q 77 30 131 64 q 53 34 82 71 q 29 38 29 74 v 716 q 0 37 -29 74 q -29 37 -82 71 q -54 34 -131 64 q -78 30 -174 52 q -97 22 -211 34 q -115 13 -243 13 Z',
    
        'FlowChartConnector': 'M 973 1792 q -113 0 -217 -30 q -105 -29 -196 -82 q -91 -53 -166 -128 q -75 -75 -128 -166 q -53 -91 -82 -196 q -30 -104 -30 -217 q 0 -113 30 -218 q 29 -104 82 -195 q 53 -91 128 -166 q 75 -75 166 -128 q 91 -53 196 -83 q 104 -29 217 -29 q 113 0 218 29 q 104 30 195 83 q 91 53 166 128 q 75 75 128 166 q 53 91 83 195 q 29 105 29 218 q 0 113 -29 217 q -30 105 -83 196 q -53 91 -128 166 q -75 75 -166 128 q -91 53 -195 82 q -105 30 -218 30 Z',
    
        'FlowChartOffPageConnector': 'M 358 1407 v -1253 h 1332 v 1253 l -666 476 Z',
    
        'FlowChartDirectAccessStorage': 'M 358 1024 q 0 -128 13 -243 q 12 -114 34 -211 q 22 -96 52 -174 q 30 -77 64 -131 q 34 -53 71 -82 q 37 -29 74 -29 h 716 q 36 0 74 29 q 37 29 71 82 q 34 54 64 131 q 30 78 52 174 q 22 97 35 211 q 12 115 12 243 q 0 128 -12 242 q -13 115 -35 211 q -22 97 -52 174 q -30 78 -64 131 q -34 54 -71 83 q -38 29 -74 29 h -716 q -37 0 -74 -29 q -37 -29 -71 -83 q -34 -53 -64 -131 q -30 -77 -52 -174 q -22 -96 -34 -211 q -13 -114 -13 -242 Z',
    
        'FlowChartMerge': 'M60,0 L30,35 L0,0 Z',
    
        'OffPageReference': 'M60,33.3 L30.1,39 L0,33.3 L0,0 L60,0 Z',
    
        'FlowChartSequentialAccessStorage': 'M 60 30 C 60 13.4 46.6 0 30 0 S 0 13.4 0 30 s 13.4 30 30 30 h 28.6 v -6.5 h -9.9' +
            'C 55.5 48 60 39.5 60 30 Z',
    
        'Annotation': 'M49.9984,50.0029 L-0.00271199,50.0029 L-0.00271199,0.00286865 L49.9984,0.00286865',
    
        'Annotation2': 'M49.9977,50.0029 L25.416,50.0029 L25.416,0.00286865 L49.9977,0.00286865 M25.4166,25.0029 L-0.00227869,25.0029',
    
        'FlowChartData': 'M 10 0 L 40 0 L 30 40 L 0 40 Z',
    
        'FlowChartCard': 'M275,60 L400,60 L400,110 L260,110 L260,75 Z',
    
        'FlowChartDelay': 'M0,0 L12.029,0 C14.212999,0 16,1.7869979 16,3.9709952 C16,6.1549926 14.212999,7.9409904 12.029,7.9409904 L0,7.9409904 z',
    
        'FlowChartPreparation': 'M 1048.17 572 C 1051.06 568.86 1055.17 567.05 1059.5 567 L 1094.51 567'
            + ' C 1098.84 567.05 1102.95 568.86 1105.84 572' +
            ' L 1126.43 595 C 1127.01 596.28 1127.01 597.72 1126.43 599 L 1105.84 622 C 1102.95 625.14 1098.84 626.95 1094.51 627' +
            ' L 1059.5 627 C 1055.17 626.95 1051.06 625.14 1048.17 622 L 1027.58 599 C 1027 597.72 1027 596.28 1027.58 595 L 1048.17 572 Z',
    
        'FlowChartDisplay': 'M47.8809,19.2914 L32.7968,-0.00594145 L11.3902,-0.00594145 C7.93166,-0.00594145 0.00124586,11.187 0.00124586,24.9968' +
            'C0.00124586,38.8032 7.93166,49.9962 11.3902,49.9962 L32.7968,49.99 L47.615,31.038 C47.615,31.0388 52.798,24.9968 47.880,19.2914 z',
    
        'FlowChartManualInput': 'M 912 732 L 1006.85 707 C 1008.2 707 1009.5 707.53 1010.46 708.46 C 1011.41 709.4 1011.95 710.67 1011.95 712' +
            ' L 1011.95 762C 1012 764.41 1010.28 766.52 1007.87 767 L 917.1 767 C 915.75 767 914.45 766.47 913.49 765.54' +
            ' C 912.54 764.6 912 763.33 912 762 L 912 732 Z',
    
        'LoopLimit': 'M 8 9 L 27 9 L 33 15 L 33 26 C 33 27 33 27 32 27 L 4 27 C 3 27 2 27 2 26 L 2 15 L 8 9 Z',
    
        'FlowChartStoredData': 'M 5.55 0L 50 0A 1.5,30 0 0,1 50,0A 5.555,25 0 0,0 50,50A 1.5,30 0 0,1 50,50L 5.555 50A 5.55,25 0 0,1 5.555,0Z',
    
    
        //<---------------- Block Arrow Shapes ---------------->
    
    
        'RightArrow': 'M 1178 1382 h -1024 v -716 h 1024 v -338 l 695 696 l -695 696 z',
    
        'LeftArrow': 'M 870 666 h 1024 v 716 h -1024 v 338 l -695 -696 l 695 -696 z',
    
        'UpArrow': 'M 1382 870 v 1024 h -716 v -1024 h -338 l 696 -695 l 696 695 z',
    
        'DownArrow': 'M 666 1178 v -1024 h 716 v 1024 h 338 l -696 695 l -696 -695 z',
    
        'LeftRightArrow': 'M 1382 1280 h -716 v 235 l -491 -491 l 491 -491 v 235 h 716 v -235 l 491 491 l -491 491 z',
    
        'UpDownArrow': 'M 768 1382 v -716 h -235 l 491 -491 l 491 491 h -235 v 716 h 235 l -491 491 l -491 -491 z',
    
        'QuadArrow': 'M 738 1587 h 132 v -409 h -409 v 132 l -286 -286 l 286 -286 v 132 h 409 v -409 h -132 l 286 -286 l 286 286 h -132 v 409 h 409 v -132 l 286 286 l -286 286 v -132 h -409 v 409 h 132 l -286 286 z',
    
        'LeftRightUpArrow': 'M 461 1485 v 132 l -286 -286 l 286 -286 v 133 h 409 v -615 h -132 l 286 -286 l 286 286 h -132 v 615 h 409 v -133 l 286 286 l -286 286 v -132 z',
    
        'BentArrow': 'M 154 1894 v -1126 q 0 -63 24 -119 q 24 -56 66 -98 q 41 -42 97 -66 q 56 -24 120 -24 h 1024 v -235 l 388 388 l -388 389 v -235 h -768 q -53 0 -99 20 q -47 20 -82 55 q -35 35 -55 81 q -20 47 -20 100 v 870 z',
    
        'UTurnArrow': 'M 154 1894 v -1075 q 0 -92 24 -177 q 24 -85 67 -159 q 43 -73 104 -134 q 61 -61 135 -104 q 73 -43 158 -67 q 85 -24 177 -24 h 103 q 92 0 177 24 q 85 24 159 67 q 73 43 134 104 q 61 61 104 134 q 43 74 67 159 q 24 85 24 177 v 359 h 235 l -388 388 l -389 -388 h 235 v -359 q 0 -74 -28 -139 q -28 -65 -77 -114 q -49 -49 -114 -77 q -65 -28 -139 -28 h -103 q -74 0 -139 28 q -65 28 -114 77 q -49 49 -77 114 q -28 65 -28 139 v 1075 z',
    
        'LeftUpArrow': 'M 175 1434 l 388 -389 v 235 h 717 v -717 h -235 l 389 -388 l 388 388 h -235 v 1024 h -1024 v 235 z',
    
        'BentUpArrow': 'M 154 1894 v -307 h 1126 v -1024 h -235 l 389 -388 l 388 388 h -235 v 1331 z',
    
        'CurvedRightArrow': 'M 1280 1587 h -205 q -99 0 -190 -26 q -92 -25 -171 -72 q -80 -47 -145 -112 q -66 -65 -113 -145 q -47 -80 -72 -172 q -26 -91 -26 -190 q 0 -99 26 -191 q 25 -91 72 -171 q 47 -79 113 -145 q 65 -65 145 -112 q 79 -46 171 -72 q 91 -25 190 -25 h 205 v 307 h -205 q -108 0 -208 31 q -101 31 -187 88 q -87 57 -155 137 q -68 81 -110 180 l -10 25 l 14 23 q 50 79 116 141 q 66 62 144 105 q 78 43 166 66 q 87 23 179 23 h 256 v -235 l 388 389 l -388 388 z',
    
        'CurvedLeftArrow': 'M 768 1822 l -388 -388 l 388 -389 v 235 h 256 q 92 0 180 -23 q 87 -23 165 -66 q 78 -43 144 -105 q 66 -62 116 -141 l 14 -23 l -10 -25 q -42 -99 -110 -180 q -68 -80 -154 -137 q -87 -57 -187 -88 q -101 -31 -209 -31 h -205 v -307 h 205 q 99 0 191 25 q 91 26 171 72 q 79 47 145 112 q 65 66 112 145 q 47 80 73 171 q 25 92 25 191 q 0 99 -25 190 q -26 92 -73 172 q -47 80 -112 145 q -66 65 -145 112 q -80 47 -171 72 q -92 26 -191 26 h -205 z',
    
        'CurvedUpArrow': 'M 1587 768 v 205 q 0 99 -25 190 q -26 92 -73 171 q -47 80 -112 145 q -65 66 -145 113 q -80 47 -171 72 q -92 26 -191 26 q -99 0 -190 -26 q -92 -25 -171 -72 q -80 -47 -145 -113 q -66 -65 -112 -145 q -47 -79 -72 -171 q -26 -91 -26 -190 v -205 h 307 v 205 q 0 108 31 208 q 31 101 88 187 q 57 87 138 155 q 80 68 179 110 l 25 10 l 23 -14 q 79 -50 141 -116 q 62 -66 105 -144 q 43 -78 66 -166 q 23 -87 23 -179 v -256 h -235 l 389 -388 l 388 388 z',
    
        'CurvedDownArrow': 'M 1822 1280 l -388 388 l -389 -388 h 235 v -256 q 0 -92 -23 -180 q -23 -87 -66 -165 q -43 -78 -105 -144 q -62 -66 -141 -116 l -23 -14 l -25 10 q -99 42 -179 110 q -81 68 -138 154 q -57 87 -88 187 q -31 101 -31 209 v 205 h -307 v -205 q 0 -99 26 -191 q 25 -91 72 -171 q 46 -79 112 -145 q 65 -65 145 -112 q 79 -47 171 -73 q 91 -25 190 -25 q 99 0 191 25 q 91 26 171 73 q 80 47 145 112 q 65 66 112 145 q 47 80 73 171 q 25 92 25 191 v 205 z',
    
        'StripedRightArrow': 'M 102 614 h 103 v 820 h -103 m 205 -820 h 103 v 820 h -103 m 819 409 v -409 h -614 v -820 h 614 v -409 l 820 819 m -717 307 v 265 l 572 -572 l -572 -572 v 265 h -615 v 614 z',
    
        'NotchedRightArrow': 'M 1126 1843 v -409 h -1024 l 512 -410 l -512 -410 h 1024 v -409 l 820 819 m -717 307 v 265 l 572 -572 l -572 -572 v 265 h -835 l 384 307 l -384 307 z',
    
        'Pentagon': 'M 154 1690 v -1434 h 1002 l 717 717 l -717 717 z',
    
        'Chevron': 'M 226 1690 l 717 -717 l -717 -717 h 930 l 717 717 l -717 717 z',
    
        'RightArrowCallout': 'M 154 154 h 1024 v 716 h 307 v -234 l 388 388 l -388 388 v -234 h -307 v 716 h -1024 z',
    
        'DownArrowCallout': 'M 154 154 h 1740 v 1024 h -716 v 307 h 234 l -388 388 l -388 -388 h 234 v -307 h -716 z',
    
        'LeftArrowCallout': 'M 1894 154 v 1740 h -1024 v -716 h -307 v 234 l -388 -388 l 388 -388 v 234 h 307 v -716 z',
    
        'UpArrowCallout': 'M 1894 1894 h -1740 v -1024 h 716 v -307 h -234 l 388 -388 l 388 388 h -234 v 307 h 716 z',
    
        'LeftRightArrowCallout': 'M 666 1894 v -716 h -205 v 132 l -286 -286 l 286 -286 v 132 h 205 v -716 h 716 v 716 h 205 v -132 l 286 286 l -286 286 v -132 h -205 v 716 z',
    
        'QuadArrowCallout': 'M 738 1587 h 132 v -205 h -204 v -204 h -205 v 132 l -286 -286 l 286 -286 v 132 h 205 v -204 h 204 v -205 h -132 l 286 -286 l 286 286 h -132 v 205 h 204 v 204 h 205 v -132 l 286 286 l -286 286 v -132 h -205 v 204 h -204 v 205 h 132 l -286 286 z',
    
        'CircularArrow': 'M 1045 1382 h 235 v -460 q 0 -74 -28 -140 q -28 -65 -77 -114 q -49 -48 -114 -77 q -65 -28 -139 -28 h -103 q -74 0 -139 28 q -65 29 -114 77 q -49 49 -77 114 q -28 66 -28 140 v 665 h -307 v -665 q 0 -92 24 -177 q 24 -85 67 -159 q 43 -74 104 -135 q 61 -60 135 -104 q 73 -43 158 -67 q 85 -24 177 -24 h 103 q 92 0 177 24 q 85 24 159 67 q 73 44 134 104 q 61 61 104 135 q 43 74 67 159 q 24 85 24 177 v 460 h 235 l -388 389 z',
    
    
        //<---------------- Stars and banners ---------------->
    
        'Explosion1': 'M 833 1509 l -270 225 v -352 h -282 l 309 -193 l -374 -421 h 450 v -337 l 260 260 l 354 -443 v 418 h 361 l -226 317 l 381 297 h -394 l 228 457 l -479 -218 l -134 312 z',
    
        'Explosion2': 'M 591 1480 l -324 -1 l 208 -249 l -270 -360 h 492 l -135 -270 l 247 82 l 39 -239 l 187 281 l 168 -418 l 35 281 l 417 -186 l -135 408 l 253 42 l -215 172 l 246 206 h -300 l 174 346 l -347 -173 v 353 l -305 -175 l -416 270 z',
    
        'Star4Point': 'M 848 1200 l -572 -176 l 572 -176 l 176 -572 l 176 572 l 572 176 l -572 176 l -176 572 z',
    
        'Star5Point': 'M 1219 768 h 603 l -446 446 l 175 612 l -527 -352 l -527 352 l 175 -612 l -446 -446 h 598 l 202 -521 z',
    
        'Star6Point': 'M 786 1485 h -580 l 350 -461 l -350 -461 h 580 l 238 -367 l 238 367 h 580 l -350 461 l 350 461 h -580 l -238 367 z',
    
        'Star7Point': 'M 1024 1541 l -395 307 l -42 -422 l -396 -176 l 314 -314 l -207 -373 h 461 l 265 -372 l 265 372 h 461 l -207 373 l 314 314 l -396 176 l -42 422 z',
    
        'Star8Point': 'M 738 1587 h -277 v -277 l -286 -286 l 286 -286 v -277 h 282 l 281 -286 l 286 286 h 277 v 277 l 286 286 l -286 286 v 277 h -277 l -286 286 z',
    
        'Star10Point': 'M 828 1635 l -367 48 v -286 l -277 -93 l 198 -280 l -198 -280 l 277 -93 v -286 l 367 48 l 196 -231 l 196 231 l 370 -48 v 286 l 274 92 l -198 281 l 198 280 l -277 93 v 286 l -367 -48 l -196 231 z',
    
        'Star12Point': 'M 868 1611 l -305 231 v -357 h -357 l 231 -305 l -241 -156 l 241 -156 l -231 -305 h 357 v -357 l 305 231 l 156 -241 l 156 241 l 305 -231 v 357 h 357 l -231 305 l 241 156 l -241 156 l 231 305 h -357 v 357 l -305 -231 l -156 241 z',
    
        'Star16Point': 'M-51.20001220703125,0L-37.66234497940063,-6.9061855534744225L-47.302667277832036,-18.06249483215332L-31.9284556123352,-19.667176728401184L-36.204040631713866,-33.375589842071534L-21.333893086395264,-29.434036096916195L-19.593220671386717,-43.60713318054199L-7.491457786102288,-34.71996375514984L0,-47.19999694824219L7.491457786102288,-34.71996375514984L19.593220671386717,-43.60713318054199L21.33389308639528,-29.434036096916195L36.20404063171388,-33.375589842071534L31.928455612335213,-19.667176728401184L47.30266727783204,-18.06249483215332L37.66234497940066,-6.9061855534744225L51.20001220703125,0L37.66234497940066,6.9061855534744225L47.30266727783204,18.06249483215332L31.928455612335213,19.667176728401188L36.20404063171388,33.37558984207155L21.33389308639528,29.434036096916202L19.593220671386717,43.60713318054199L7.491457786102288,34.71996375514985L0,47.19999694824219L-7.491457786102288,34.71996375514985L-19.593220671386717,43.60713318054199L-21.333893086395264,29.434036096916202L-36.204040631713866,33.37558984207155L-31.9284556123352,19.667176728401188L-47.302667277832036,18.06249483215332L-37.66234497940063,6.9061855534744225Z',
    
        'Star24Point': 'M-51.20001220703125,0L-38.071305076904295,-4.620761701240539L-49.45541409708704,-12.216258138985935L-35.47700045837402,-13.546871124114986L-44.34051124536243,-23.599998474121094L-30.464647263336182,-21.55010260665893L-36.20387582842581,-33.3754379140864L-23.37638957336425,-28.084588184165955L-25.600006103515625,-40.87639641572571L-14.694915503540031,-32.70534988540649L-13.251538268661228,-45.59169605307234L-5.012353195037839,-35.096973730773925L0,-47.19999694824219L5.012353195037846,-35.096973730773925L13.251538268661236,-45.59169605307234L14.694915503540045,-32.70534988540649L25.600006103515625,-40.87639641572571L23.37638957336425,-28.084588184165955L36.20387582842582,-33.3754379140864L30.464647263336204,-21.55010260665893L44.340511245362435,-23.599998474121094L35.47700045837402,-13.546871124114986L49.45541409708704,-12.216258138985935L38.07130507690431,-4.620761701240539L51.20001220703125,0L38.07130507690431,4.620761701240539L49.45541409708704,12.216258138985935L35.47700045837402,13.546871124114993L44.340511245362435,23.599998474121094L30.464647263336204,21.550102606658925L36.20387582842582,33.375437914086405L23.37638957336425,28.084588184165966L25.600006103515625,40.87639641572571L14.694915503540045,32.70534988540649L13.251538268661236,45.59169605307234L5.012353195037846,35.096973730773925L0,47.19999694824219L-5.012353195037839,35.096973730773925L-13.251538268661228,45.59169605307234L-14.694915503540031,32.70534988540649L-25.600006103515625,40.87639641572571L-23.37638957336425,28.084588184165966L-36.20387582842581,33.375437914086405L-30.464647263336182,21.550102606658925L-44.34051124536243,23.599998474121094L-35.47700045837402,13.546871124114993L-49.45541409708704,12.216258138985935L-38.071305076904295,4.620761701240539Z',
    
        'Star32Point': 'M-54,0L-40.30479,-3.52872L-52.96266,-9.36432L-38.75607,-10.45008L-49.889520000000005,-18.368640000000003L-35.71776,-16.9704L-44.89938,-26.667360000000002L-31.306905,-22.838040000000007L-38.18376618407357,-33.94112549695428L-25.692795000000004,-27.828360000000004L-30.00078,-39.910560000000004L-19.091700000000003,-31.749120000000005L-20.664719999999996,-44.34624L-11.756339999999994,-34.44984L-10.534859999999995,-47.077920000000006L-3.9698099999999954,-35.82648L0,-48L3.9698100000000025,-35.82648L10.534860000000009,-47.077920000000006L11.756340000000009,-34.44984L20.664720000000003,-44.34624L19.091700000000003,-31.749120000000005L30.000780000000006,-39.910560000000004L25.692795000000004,-27.828360000000004L38.183766184073576,-33.94112549695428L31.306905000000015,-22.838040000000007L44.89938000000001,-26.667360000000002L35.71776000000001,-16.9704L49.889520000000005,-18.368640000000003L38.75607000000001,-10.45008L52.962660000000014,-9.36432L40.30479000000001,-3.52872L54,0L40.30479000000001,3.52872L52.962660000000014,9.36432L38.75607000000001,10.45008L49.889520000000005,18.36864L35.71776000000001,16.970399999999998L44.89938000000001,26.667359999999988L31.306905000000015,22.838039999999992L38.183766184073576,33.941125496954285L25.692795000000004,27.828360000000004L30.000780000000006,39.91055999999999L19.091700000000003,31.749120000000005L20.664720000000003,44.346239999999995L11.756340000000009,34.449839999999995L10.534860000000009,47.077920000000006L3.9698100000000025,35.826480000000004L0,48L-3.9698099999999954,35.826480000000004L-10.534859999999995,47.077920000000006L-11.756339999999994,34.449839999999995L-20.664719999999996,44.346239999999995L-19.091700000000003,31.749120000000005L-30.00078,39.91055999999999L-25.692795000000004,27.828360000000004L-38.18376618407357,33.941125496954285L-31.306905,22.838039999999992L-44.89938,26.667359999999988L-35.71776,16.970399999999998L-49.889520000000005,18.36864L-38.75607,10.45008L-52.96266,9.36432L-40.30479,3.52872Z',
    
        'UpRibbon': 'M 1741 1075 l 205 461 h -717 v -205 h -410 v 205 h -717 l 205 -461 l -205 -461 h 410 v -204 h 1024 v 204 h 410 m -512 615 v -717 h -820 v 717 m -102 -512 h -252 l 159 358 l -159 359 h 252 m 1117 -359 l 159 -358 h -252 v 717 h 252 m -1071 -103 h -103 v 103 h 103 m 717 0 v -103 h -103 v 103 z',
    
        'DownRibbon': 'M 1946 410 l -205 460 l 205 461 h -410 v 205 h -1024 v -205 h -410 l 205 -461 l -205 -460 h 717 v 204 h 410 v -204 m -615 307 v 717 h 820 v -717 m 102 512 h 252 l -159 -359 l 159 -358 h -252 m -1117 358 l -159 359 h 252 v -717 h -252 m 1174 0 h -103 v 102 h 103 m -820 -102 v 102 h 103 v -102 z',
    
        'CurvedUpRibbon': 'M 1741 1075 l 205 666 q -62 -57 -130 -102 q -29 -19 -62 -38 q -34 -18 -70 -33 q -36 -14 -73 -23 q -38 -9 -75 -9 h -307 v -256 q 0 -10 -16 -20 q -16 -9 -44 -16 q -28 -7 -65 -11 q -38 -4 -80 -4 q -42 0 -79 4 q -38 4 -66 11 q -28 7 -44 16 q -16 10 -16 20 v 256 h -307 q -38 0 -75 9 q -38 9 -74 23 q -36 15 -69 33 q -33 19 -62 38 q -69 45 -130 102 l 205 -666 l -205 -461 q 60 -75 122 -117 q 62 -41 119 -62 q 56 -20 104 -25 q 47 -4 78 -4 q 19 -43 65 -80 q 45 -37 111 -64 q 66 -27 149 -42 q 82 -15 174 -15 q 92 0 175 15 q 82 15 148 42 q 66 27 112 64 q 45 37 64 80 q 31 0 79 4 q 47 5 104 25 q 56 21 118 62 q 62 42 122 117 m -1659 876 q 116 -56 225 -56 v -926 l -8 -1 q -21 0 -51 4 q -30 4 -65 16 q -35 12 -73 34 q -39 22 -78 58 l 184 456 m 296 256 h -103 v 103 h 103 m 307 -308 q 72 0 124 8 q 52 9 87 23 q 35 15 55 33 q 20 19 30 39 h 114 v -773 l -4 -9 q -9 -21 -41 -46 q -32 -24 -83 -45 q -52 -21 -123 -35 q -71 -14 -159 -14 q -88 0 -159 14 q -71 14 -123 35 q -52 21 -83 45 q -32 25 -41 46 l -4 9 v 773 h 114 q 10 -20 30 -39 q 20 -18 55 -33 q 35 -14 87 -23 q 52 -8 124 -8 m 410 308 v -103 h -103 v 103 m 296 -380 l 184 -435 q -39 -36 -77 -58 q -39 -22 -74 -34 q -35 -12 -64 -16 q -30 -4 -51 -4 h -9 v 927 q 109 0 225 56 z',
    
        'CurvedDownRibbon': 'M 307 870 l -205 -665 q 61 58 130 103 q 29 19 62 37 q 33 19 69 33 q 36 14 74 23 q 37 9 75 9 h 307 v 256 q 0 11 16 20 q 16 9 44 16 q 28 7 66 11 q 37 4 79 4 q 42 0 80 -4 q 37 -4 65 -11 q 28 -7 44 -16 q 16 -9 16 -20 v -256 h 307 q 37 0 75 -9 q 37 -9 73 -23 q 36 -14 70 -33 q 33 -18 62 -37 q 68 -45 130 -103 l -205 665 l 205 461 q -55 69 -112 110 q -57 41 -110 63 q -54 23 -100 30 q -47 7 -80 7 q -6 0 -11 -1 q -5 0 -10 0 q -19 43 -64 80 q -46 37 -112 64 q -66 27 -148 42 q -83 15 -175 15 q -92 0 -174 -15 q -83 -15 -149 -42 q -66 -27 -111 -64 q -46 -37 -65 -80 q -5 0 -10 0 q -6 1 -11 1 q -33 0 -79 -7 q -47 -7 -100 -30 q -54 -22 -111 -63 q -57 -41 -112 -110 m 1659 -875 q -120 56 -225 56 v 926 h 8 q 21 0 51 -4 q 30 -4 65 -16 q 35 -12 74 -34 q 38 -22 77 -58 l -184 -456 m -296 -256 h 103 v -102 h -103 m -307 307 q -72 0 -124 -9 q -52 -8 -87 -22 q -35 -14 -55 -33 q -20 -18 -30 -38 h -114 v 773 l 4 9 q 9 21 41 45 q 31 25 83 45 q 52 21 123 35 q 71 14 159 14 q 88 0 159 -14 q 71 -14 123 -35 q 51 -20 83 -45 q 32 -24 41 -45 l 4 -9 v -773 h -114 q -10 20 -30 38 q -20 19 -55 33 q -35 14 -87 22 q -52 9 -124 9 m -410 -307 v 102 h 103 v -102 m -296 380 l -184 434 q 39 36 78 58 q 38 22 73 34 q 35 12 65 16 q 29 4 50 4 h 9 v -926 q -105 0 -225 -56 z',
    
        'VerticalScroll': 'M 1690 102 q 53 0 100 20 q 46 20 81 55 q 35 35 55 81 q 20 47 20 100 q 0 53 -20 100 q -20 47 -55 81 q -35 35 -81 55 q -47 20 -100 20 h -52 v 1178 q 0 32 -12 60 q -12 28 -32 49 q -21 21 -49 33 q -28 12 -60 12 h -1178 q -42 0 -79 -17 q -38 -16 -65 -44 q -28 -27 -44 -65 q -17 -37 -17 -79 q 0 -42 17 -80 q 16 -37 44 -65 q 27 -28 65 -44 q 37 -16 79 -16 h 103 v -1280 q 0 -32 12 -60 q 12 -28 33 -49 q 20 -21 48 -33 q 28 -12 60 -12 m 51 308 q 0 -41 16 -78 q 15 -36 42 -64 q 26 -28 62 -45 q 35 -16 76 -18 h -247 q -21 0 -36 15 q -15 15 -15 36 v 1587 h 973 q 21 0 36 -15 q 15 -15 15 -36 v -1178 h -717 q -42 0 -79 -16 q -38 -16 -66 -44 q -28 -27 -44 -65 q -16 -37 -16 -79 m 1076 102 q 31 0 59 -12 q 28 -12 49 -33 q 21 -21 33 -49 q 12 -28 12 -60 q 0 -31 -12 -59 q -12 -28 -33 -49 q -21 -21 -49 -33 q -28 -12 -59 -12 h -863 q 41 2 77 18 q 36 17 63 45 q 26 28 42 64 q 15 37 15 78 q 0 28 -7 53 q -7 26 -20 49 m -587 1126 h -103 q -21 0 -39 8 q -19 8 -33 22 q -14 14 -22 33 q -8 19 -8 40 q 0 21 8 39 q 8 19 22 33 q 14 14 33 22 q 18 8 39 8 h 103 m 409 -1331 q 21 0 40 -8 q 19 -8 33 -22 q 14 -14 22 -33 q 8 -18 8 -39 q 0 -21 -8 -40 q -8 -19 -22 -33 q -14 -14 -33 -22 q -19 -8 -40 -8 q -21 0 -39 8 q -19 8 -33 22 q -14 14 -22 33 q -8 19 -8 40 q 0 21 8 39 q 8 19 22 33 q 14 14 33 22 q 18 8 39 8 z',
    
        'HorizontalScroll': 'M 1741 102 q 42 0 80 16 q 37 17 65 44 q 27 28 44 65 q 16 38 16 80 v 1178 q 0 32 -12 60 q -12 28 -33 48 q -21 21 -49 33 q -28 12 -60 12 h -1178 v 52 q 0 53 -20 99 q -20 47 -54 82 q -35 35 -82 55 q -47 20 -100 20 q -53 0 -99 -20 q -47 -20 -82 -55 q -35 -35 -55 -82 q -20 -46 -20 -99 v -1127 q 0 -32 12 -60 q 12 -28 33 -49 q 21 -20 49 -32 q 28 -12 60 -12 h 1280 v -103 q 0 -42 16 -80 q 16 -37 44 -65 q 28 -27 66 -44 q 37 -16 79 -16 m 102 410 h -1587 q -21 0 -36 15 q -15 15 -15 36 v 248 q 1 -41 18 -77 q 17 -36 45 -63 q 27 -26 64 -42 q 37 -15 78 -15 q 42 0 80 16 q 37 16 65 44 q 27 28 43 65 q 16 38 16 80 v 717 h 1178 q 21 0 36 -15 q 15 -15 15 -36 m -1433 -461 q -41 0 -78 -16 q -37 -15 -64 -42 q -28 -26 -45 -62 q -17 -35 -18 -76 v 862 q 0 32 12 59 q 12 28 33 49 q 21 21 49 33 q 27 12 59 12 q 32 0 60 -12 q 28 -12 49 -33 q 21 -21 33 -49 q 12 -27 12 -59 v -693 q -23 13 -48 20 q -26 7 -54 7 m 1433 -717 q 0 -21 -8 -40 q -8 -18 -22 -32 q -14 -14 -32 -22 q -19 -8 -40 -8 q -21 0 -40 8 q -19 8 -33 22 q -14 14 -22 32 q -8 19 -8 40 v 103 h 205 m -1331 409 q 0 -21 -8 -40 q -8 -18 -22 -32 q -14 -14 -32 -22 q -19 -8 -40 -8 q -21 0 -40 8 q -19 8 -33 22 q -14 14 -22 32 q -8 19 -8 40 q 0 21 8 40 q 8 19 22 33 q 14 14 33 22 q 19 8 40 8 q 21 0 40 -8 q 18 -8 32 -22 q 14 -14 22 -33 q 8 -19 8 -40 z',
    
        'Wave': 'M 1383 1894 q -42 0 -84 -8 q -43 -7 -77 -16 q -34 -9 -55 -17 q -22 -7 -23 -7 q -8 -5 -26 -17 q -18 -11 -39 -25 q -21 -13 -41 -27 q -20 -13 -32 -24 l -38 -33 q -40 -35 -89 -76 q -49 -41 -106 -77 q -58 -35 -123 -59 q -66 -23 -138 -23 q -68 0 -122 10 q -55 10 -99 27 q -44 17 -78 39 q -34 23 -59 47 v -1275 q 24 -16 77 -47 q 52 -30 126 -59 q 73 -29 165 -51 q 91 -22 195 -22 q 72 0 130 17 q 57 18 104 47 q 46 29 85 65 q 38 37 74 75 q 35 39 70 75 q 34 37 72 66 q 38 29 83 46 q 44 18 99 18 q 78 0 147 -24 q 69 -23 127 -59 q 57 -36 104 -80 q 47 -44 82 -85 v 1356 q -16 18 -57 55 q -41 38 -105 75 q -64 37 -149 65 q -86 28 -191 28 z',
    
        'DoubleWave': 'M 1690 1894 q -58 0 -100 -19 q -42 -19 -75 -48 q -33 -28 -62 -61 q -29 -33 -61 -62 q -32 -28 -71 -47 q -39 -19 -92 -19 q -51 0 -92 19 q -42 19 -77 47 q -35 29 -65 62 q -30 33 -59 61 q -29 29 -57 48 q -29 19 -60 19 q -35 0 -73 -19 q -39 -19 -79 -48 q -40 -28 -80 -61 q -40 -33 -79 -62 q -40 -28 -78 -47 q -38 -19 -72 -19 q -26 0 -52 10 q -27 11 -53 27 q -27 17 -52 38 q -25 22 -47 44 v -1480 q 19 -20 45 -42 q 26 -21 54 -39 q 27 -18 55 -30 q 27 -12 50 -12 q 24 0 55 19 q 31 19 67 47 q 36 29 77 62 q 41 33 84 61 q 43 29 88 48 q 45 19 90 19 q 48 0 87 -19 q 38 -19 71 -48 q 33 -28 63 -61 q 29 -33 59 -62 q 30 -28 62 -47 q 31 -19 68 -19 q 36 0 68 19 q 31 19 63 47 q 31 29 64 62 q 33 33 72 61 q 39 29 87 48 q 47 19 107 19 q 70 0 120 -17 q 50 -16 84 -40 v 1477 q -5 6 -17 17 q -12 11 -35 21 q -24 11 -61 18 q -37 8 -91 8 z',
    
    
        //<---------------- Equation Shapes ---------------->
    
    
        'MathPlus': 'M 1894 1280 h -614 v 614 h -512 v -614 h -614 v -512 h 614 v -614 h 512 v 614 h 614 z',
    
        'MathMinus': 'M 154 768 h 1740 v 512 h -1740 z',
    
        'MathMultiply': 'M 1409 1771 l -435 -435 l -434 435 l -362 -362 l 434 -435 l -434 -434 l 362 -362 l 434 434 l 435 -434 l 362 362 l -435 434 l 435 435 z',
    
        'MathDivision': 'M 1024 1792 q -32 0 -60 -12 q -28 -12 -49 -33 q -21 -21 -33 -49 q -12 -28 -12 -60 q 0 -31 12 -59 q 12 -28 33 -49 q 21 -21 49 -33 q 28 -12 60 -12 q 32 0 60 12 q 28 12 49 33 q 21 21 33 49 q 12 28 12 59 q 0 32 -12 60 q -12 28 -33 49 q -21 21 -49 33 q -28 12 -60 12 m 0 -1229 q -32 0 -60 -12 q -28 -12 -49 -33 q -21 -21 -33 -49 q -12 -27 -12 -59 q 0 -32 12 -60 q 12 -28 33 -49 q 21 -21 49 -33 q 28 -12 60 -12 q 32 0 60 12 q 28 12 49 33 q 21 21 33 49 q 12 28 12 60 q 0 32 -12 59 q -12 28 -33 49 q -21 21 -49 33 q -28 12 -60 12 m -870 205 h 1740 v 512 h -1740 z',
    
        'MathEqual': 'M 154 358 h 1740 v 512 h -1740 m 0 205 h 1740 v 512 h -1740 z',
    
        'MathNotEqual': 'M 1372 870 l -136 205 h 658 v 512 h -1000 l -205 307 h -389 l 205 -307 h -351 v -512 h 693 l 136 -205 h -829 v -512 h 1170 l 137 -204 h 389 l -137 204 h 181 v 512 z',
    
    
        //<---------------- Rectangle Shapes ---------------->
    
        'RoundedRectangle': 'M 20,0 h 160 a 20,20 0 0 1 20,20 v 60 a 20,20 0 0 1 -20,20 h -160 a 20,20 0 0 1 -20,-20 v -60 a 20,20 0 0 1 20,-20 z',
    
        'SnipSingleCornerRectangle': 'M 154 1690 v -1332 h 1258 l 482 482 v 850 z',
    
        'SnipSameSideCornerRectangle': 'M 154 1690 v -850 l 482 -482 h 776 l 482 482 v 850 z',
    
        'SnipDiagonalCornerRectangle': 'M 636 1690 l -482 -482 v -850 h 1258 l 482 482 v 850 z',
    
        'SnipAndRoundSingleCornerRectangle': 'M 154 1690 v -1029 q 0 -63 24 -118 q 24 -55 65 -96 q 41 -41 96 -65 q 55 -24 117 -24 h 956 l 482 482 v 850 z',
    
        'RoundSingleCornerRectangle': 'M 154 1690 v -1332 h 1438 q 62 0 117 24 q 55 24 96 65 q 41 41 65 96 q 24 55 24 118 v 1029 z',
    
        'RoundSameSideCornerRectangle': 'M 154 1690 v -1029 q 0 -63 24 -118 q 24 -55 65 -96 q 41 -41 96 -65 q 55 -24 117 -24 h 1136 q 62 0 117 24 q 55 24 96 65 q 41 41 65 96 q 24 55 24 118 v 1029 z',
    
        'RoundDiagonalCornerRectangle': 'M 456 1690 q -62 0 -117 -24 q -55 -24 -96 -65 q -41 -41 -65 -96 q -24 -55 -24 -118 v -1029 h 1438 q 62 0 117 24 q 55 24 96 65 q 41 41 65 96 q 24 55 24 118 v 1029 z'
    
    
        //<---------------- umlActivityShapes Shapes ---------------->
    
        // // Action,
        // 'Action': 'M 90 82.895 C 90 86.819 86.776 90 82.8 90 H 7.2 C 3.224 90 0 86.819 0 82.895' +
        // ' V 7.105 C 0 3.181 3.224 0 7.2 0 h 75.6 C 86.776 0 90 3.181 90 7.105 V 82.895 Z',
        // // umlDecision,
        // 'umlDecision': 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z',
        // // MergeNode,
        // 'MergeNode': 'M10,19.707L0.293,10L10,0.293L19.707,10L10,19.707z',
        // // InitialNode,
        // 'InitialNode': 'M10,19.5c-5.238,0-9.5-4.262-9.5-9.5S4.762,0.5,10,0.5s9.5,4.262,9.5,9.5S15.238,19.5,10,19.5z',
        // // ForkNode,
        // 'ForkNode': 'm0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z',
        // // JoinNode,
        // 'JoinNode': 'm0.75,0.75l636.00002,0l0,290l-636.00002,0l0,-290z',
        // // TimeEvent,
        // 'TimeEvent': 'M50.001,0.00286865 L25.001,25.0029 L0.000976562,0.00286865 L50.001,0.00286865 z' +
        //     ' M0.000976562,50.0029 L25.001,25.0029 L50.001,50.0029 L0.000976562,50.0029 z',
        // // AcceptingEvent,
        // 'AcceptingEvent': 'M17.8336 32.164 L29.64 24 L17.32 16 L48.1664 16 L48.5 32 Z',
        // // SendSignal,
        // 'SendSignal': 'M48.164 31.8336 L56 23.832 L47.836 16 L16.168 16 L16.1668 31.8336 Z',
        // // ReceiveSignal,
        // 'ReceiveSignal': 'M48.1664 31.8336 L39.836 24 L47.836 16 L16.168 16 L16.168 31.836 Z',
        // // StructuredNode,
        // 'StructuredNode': 'M0,0 L50,0 L50,50 L0,50 z',
        // // Note,
        // 'Note': 'M20 12 L4 12 L4 22 L22 22 L22 14 L20 14 L20 12 L22 14 Z'
    };
    // eslint-disable-next-line    
    /**
     * Destroys the internal objects which is maintained.
     * 
     * @returns {void}
     */
    public destroy(): void {
        this.documentHelper = undefined;
        this.shapes = null;
        if (!isNullOrUndefined(this.pageCanvasIn)) {
            this.pageCanvasIn.innerHTML = '';
        }
        this.pageCanvasIn = undefined;
    }
}
