/* eslint-disable */
import { WTableFormat, WRowFormat, WCellFormat, WColumnFormat, WTabStop } from '../format/index';
import {
    WidthType, WColor, AutoFitType, TextFormFieldType, CheckBoxSizeType, VerticalOrigin, VerticalAlignment,
    HorizontalOrigin, HorizontalAlignment, LineFormatType, LineDashing, AutoShapeType, ContentControlType, ContentControlWidgetType,
    TextWrappingStyle, TextWrappingType, CharacterRangeType, FontScriptType, BreakClearType
} from '../../base/types';
import { WListLevel } from '../list/list-level';
import { WParagraphFormat, WCharacterFormat, WSectionFormat, WBorder, WBorders } from '../format/index';
import { isNullOrUndefined, createElement, L10n, classList } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { ElementInfo, HelperMethods, Point, WidthInfo, TextFormFieldInfo, CheckBoxFormFieldInfo, DropDownFormFieldInfo, BorderInfo, LtrRtlTextInfo } from '../editor/editor-helper';
import { HeaderFooterType, TabLeader, FootnoteType } from '../../base/types';
import { TextPosition } from '..';
import { ChartComponent } from '@syncfusion/ej2-office-chart';
import { TextHelper } from './text-helper';
import { LayoutViewer, WebLayoutViewer, DocumentHelper } from './viewer';
import { Revision } from '../track-changes/track-changes';
import { Layout } from './layout';
import { FieldSettingsModel } from '@syncfusion/ej2-dropdowns';
import { trackChanges } from '../../base';
/**
 * @private
 */
export class Rect {
    /**
     * @private
     */
    public width: number;
    /**
     * @private
     */
    public height: number;
    /**
     * @private
     */
    public x: number;
    /**
     * @private
     */
    public y: number;
    public get right(): number {
        return this.x + this.width;
    }
    public get bottom(): number {
        return this.y + this.height;
    }
    public constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /**
     * @param currentBound
     * @private
     */
    public isIntersecting(currentBound: Rect): boolean {
        if (currentBound.y > this.bottom || this.y > currentBound.bottom ||
            currentBound.x > this.right || this.x > currentBound.right) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    public clone(): Rect {
        return new Rect(this.x, this.y, this.width, this.height);
    }
}
/**
 * @private
 */
export class Padding {
    public right: number = 10;
    public left: number = 10;
    public top: number = 10;
    public bottom: number = 10;
    public constructor(right: number, left: number, top: number, bottom: number) {
        this.right = right;
        this.left = left;
        this.top = top;
        this.bottom = bottom;
    }
}
/**
 * @private
 */
export class Margin {
    /**
     * @private
     */
    public left: number;
    /**
     * @private
     */
    public top: number;
    /**
     * @private
     */
    public right: number;
    /**
     * @private
     */
    public bottom: number;
    public constructor(leftMargin: number, topMargin: number, rightMargin: number, bottomMargin: number) {
        this.left = leftMargin;
        this.top = topMargin;
        this.right = rightMargin;
        this.bottom = bottomMargin;
    }
    public clone(): Margin {
        return new Margin(this.left, this.top, this.right, this.bottom);
    }
    public destroy(): void {
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
    }
}

/**
 * @private
 */
/* eslint-disable */
export interface IWidget { }
/** 
 * @private
 */
export abstract class Widget implements IWidget {

    /**
     * @private
     */
    public childWidgets: IWidget[] = [];
    /**
     * @private
     */
    public x: number = 0;
    /**
     * @private
     */
    public y: number = 0;
    /**
     * @private
     */
    public width: number = 0;
    /**
     * @private
     */
    public height: number = 0;
    /**
     * @private
     */
    public margin: Margin;
    /**
     * @private
     */
    public containerWidget: Widget;
    /**
     * @private
     */
    public index: number = 0;
    public get indexInOwner(): number {
        if (this instanceof BodyWidget && this.page) {
            if (this.containerWidget instanceof FootNoteWidget) {
                return this.containerWidget.bodyWidgets.indexOf(this);
            } else {
                return this.page.bodyWidgets.indexOf(this);
            }
        } else if (this.containerWidget && this.containerWidget.childWidgets) {
            return this.containerWidget.childWidgets.indexOf(this);
        } else if (this instanceof FootNoteWidget) {
            return 0;
        }
        return -1;
    }
    public get firstChild(): IWidget {
        return this.childWidgets.length > 0 ? this.childWidgets[0] : undefined;
    }
    public get lastChild(): IWidget {
        if (this.childWidgets) {
            return this.childWidgets.length > 0 ?
                this.childWidgets[this.childWidgets.length - 1] : undefined;
        }
        return undefined;
    }
    public get previousWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (widget instanceof BodyWidget) {
            widget = index > 0 ? widget.page.bodyWidgets[index - 1] : undefined;
        } else {
            widget = index > 0 ? widget.containerWidget.childWidgets[index - 1] as Widget : undefined;
        }
        return widget;
    }
    public get nextWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (index === -1) {
            return undefined;
        }
        if (widget instanceof BodyWidget) {
            widget = index < widget.page.bodyWidgets.length - 1 ?
                widget.page.bodyWidgets[index + 1] : undefined;
        } else {
            widget = index < widget.containerWidget.childWidgets.length - 1 ?
                widget.containerWidget.childWidgets[index + 1] as Widget : undefined;
        }
        return widget;
    }
    public get previousRenderedWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (index < 0) {
            return undefined;
        }
        if (widget instanceof BodyWidget) {
            if (index > 0 && !(widget.containerWidget instanceof FootNoteWidget)) {
                widget = widget.page.bodyWidgets[index - 1];
            } else if ((widget.containerWidget instanceof FootNoteWidget) && !widget.page.documentHelper.owner.editorModule.removeEditRange) {
                if (index <= 0) {
                    return undefined;
                }
                widget = widget.containerWidget.bodyWidgets[index - 1];
            } else {
                let page: Page = widget.page.previousPage;
                widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[page.bodyWidgets.length - 1] : undefined;
            }
        } else if (widget instanceof FootNoteWidget) {
            let page: Page = widget.page;
            while (page.previousPage) {
                page = page.previousPage;
                widget = page.footnoteWidget;
                if (!isNullOrUndefined(widget)) {
                    break;
                }
            }
        } else {
            if (index > 0) {
                widget = widget.containerWidget.childWidgets[index - 1] as Widget;
            } else {
                let previousContainer: Widget = undefined;
                if (widget.containerWidget instanceof TableCellWidget) {
                    previousContainer = widget.containerWidget.getPreviousSplitWidget();
                } else if (widget.containerWidget && widget.containerWidget.containerWidget instanceof FootNoteWidget &&
                    widget.containerWidget.containerWidget.footNoteType === 'Endnote') {
                    previousContainer = widget.containerWidget.previousWidget ? widget.containerWidget.previousWidget : widget.containerWidget.previousRenderedWidget;
                } else if (!(widget.containerWidget instanceof TableRowWidget
                    || widget.containerWidget instanceof HeaderFooterWidget || (widget.containerWidget && widget.containerWidget.containerWidget instanceof FootNoteWidget))) {
                    // Since cells are lay outed left to right, we should not navigate to previous row.
                    previousContainer = widget.containerWidget.previousRenderedWidget;
                }
                while (previousContainer && previousContainer.childWidgets.length === 0) {
                    previousContainer = previousContainer.previousRenderedWidget;
                    if (isNullOrUndefined(previousContainer)) {
                        break;
                    }
                }
                widget = previousContainer && previousContainer.constructor === widget.containerWidget.constructor ?
                    previousContainer.lastChild as Widget : undefined;
            }
        }
        return widget;
    }
    public get nextRenderedWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (index < 0) {
            return undefined;
        }
        if (widget instanceof BodyWidget) {
            if (index < widget.page.bodyWidgets.length - 1 && !(widget.containerWidget instanceof FootNoteWidget)) {
                widget = widget.page.bodyWidgets[index + 1];
            } else if (widget.containerWidget instanceof FootNoteWidget) {
                if (index >= widget.containerWidget.bodyWidgets.length - 1 && !widget.page.documentHelper.owner.editorModule.removeEditRange) {
                    return undefined;
                }
                widget = widget.containerWidget.bodyWidgets[index + 1];
            } else if (widget.page.allowNextPageRendering) {
                let page: Page = widget.page.nextPage;
                widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[0] : undefined;
            } else {
                widget = undefined;
            }
        } else if (widget instanceof FootNoteWidget) {
            let page: Page = widget.page;
            while (page.allowNextPageRendering && page.nextPage) {
                page = page.nextPage;
                widget = page.footnoteWidget;
                if (!isNullOrUndefined(widget)) {
                    break;
                }
            }
        } else {
            if (index < widget.containerWidget.childWidgets.length - 1) {
                widget = widget.containerWidget.childWidgets[index + 1] as Widget;
            } else {
                let nextContainer: Widget = undefined;
                if (widget.containerWidget instanceof TableCellWidget) {
                    nextContainer = widget.containerWidget.getNextSplitWidget();
                } else if (widget.containerWidget && widget.containerWidget.containerWidget instanceof FootNoteWidget &&
                    widget.containerWidget.containerWidget.footNoteType === 'Endnote') {
                    nextContainer = widget.containerWidget.nextWidget ? widget.containerWidget.nextWidget : widget.containerWidget.nextRenderedWidget;
                } else if (!(widget.containerWidget instanceof TableRowWidget
                    || widget.containerWidget instanceof HeaderFooterWidget || (widget.containerWidget && widget.containerWidget.containerWidget instanceof FootNoteWidget))) {
                    // Since cells are lay outed left to right, we should not navigate to next row.
                    nextContainer = widget.containerWidget.nextRenderedWidget;
                }
                while (nextContainer && nextContainer.childWidgets.length === 0 && !(nextContainer instanceof TableCellWidget)) {
                    nextContainer = nextContainer.nextRenderedWidget;
                    if (isNullOrUndefined(nextContainer)) {
                        break;
                    }
                }
                widget = nextContainer && nextContainer.constructor === widget.containerWidget.constructor ?
                    nextContainer.firstChild as Widget : undefined;
            }
        }
        return widget;
    }
    public get previousSplitWidget(): Widget {
        let widget: Widget = this;
        if (widget instanceof TableCellWidget) {
            return widget.getPreviousSplitWidget();
        } else {
            let previous: Widget = widget.previousRenderedWidget;
            if (widget instanceof BodyWidget && previous instanceof BodyWidget && widget.equals(previous) && !(widget.containerWidget instanceof FootNoteWidget && widget.containerWidget.footNoteType === 'Endnote')) {
                return previous;
            } else if (previous instanceof BlockWidget && widget.index === previous.index && widget.equals(previous)) {
                return previous;
            } else if (widget instanceof BodyWidget && widget.containerWidget instanceof FootNoteWidget
                && widget.containerWidget.footNoteType === 'Endnote' && !isNullOrUndefined(widget.page.previousPage)
                && !isNullOrUndefined(widget.page.previousPage.endnoteWidget)) {
                previous = widget.page.previousPage.endnoteWidget.bodyWidgets[widget.page.previousPage.endnoteWidget.bodyWidgets.length - 1];
                if (previous && previous instanceof BodyWidget && widget.index === previous.index && widget.equals(previous)) {
                    return previous;
                }
            } else if (widget instanceof BlockWidget && widget.bodyWidget
                && widget.bodyWidget.containerWidget instanceof FootNoteWidget && widget.bodyWidget.containerWidget.footNoteType === 'Endnote'
                && !isNullOrUndefined(widget.bodyWidget.page.previousPage) && !isNullOrUndefined(widget.bodyWidget.page.previousPage.endnoteWidget)
                && widget.bodyWidget.page.previousPage.endnoteWidget.bodyWidgets.length > 0) {
                const previousEndnotePage = widget.bodyWidget.page.previousPage.endnoteWidget;
                const lastBodyWidget = previousEndnotePage.bodyWidgets[previousEndnotePage.bodyWidgets.length - 1];
                previous = lastBodyWidget.childWidgets[lastBodyWidget.childWidgets.length - 1] as BlockWidget;
                if (previous && previous instanceof BlockWidget && widget.index === previous.index && widget.equals(previous)) {
                    return previous;
                }
            }
        }
        return undefined;
    }
    public get nextSplitWidget(): Widget {
        let widget: Widget = this;
        if (widget instanceof TableCellWidget) {
            return widget.getNextSplitWidget();
        } else {
            let next: Widget = widget.nextRenderedWidget;
            if (widget instanceof BodyWidget && next instanceof BodyWidget && widget.equals(next) && !(widget.containerWidget instanceof FootNoteWidget && widget.containerWidget.footNoteType === 'Endnote')) {
                return next;
            } else if (next instanceof BlockWidget && widget.index === next.index && widget.equals(next)) {
                return next;
            } else if (widget instanceof BodyWidget && widget.containerWidget instanceof FootNoteWidget
                && widget.containerWidget.footNoteType === 'Endnote' && !isNullOrUndefined(widget.page.nextPage)
                && !isNullOrUndefined(widget.page.nextPage.endnoteWidget)) {
                next = widget.page.nextPage.endnoteWidget.bodyWidgets[0];
                if (next && next instanceof BodyWidget && widget.index === next.index && widget.equals(next)) {
                    return next;
                }
            } else if (widget instanceof BlockWidget && widget.bodyWidget
                && widget.bodyWidget.containerWidget instanceof FootNoteWidget && widget.bodyWidget.containerWidget.footNoteType === 'Endnote'
                && !isNullOrUndefined(widget.bodyWidget.page.nextPage) && !isNullOrUndefined(widget.bodyWidget.page.nextPage.endnoteWidget)
                && widget.bodyWidget.page.nextPage.endnoteWidget.bodyWidgets.length > 0) {
                next = widget.bodyWidget.page.nextPage.endnoteWidget.bodyWidgets[0].childWidgets[0] as BlockWidget;
                if (next && next instanceof BlockWidget && widget.index === next.index && widget.equals(next)) {
                    return next;
                }
            }
        }
        return undefined;
    }
    public abstract equals(widget: Widget): boolean;

    public abstract getTableCellWidget(point: Point): TableCellWidget;

    public getPreviousSplitWidgets(): Widget[] {
        let widgets: Widget[] = [];

        let widget: Widget = this.previousSplitWidget;
        while (widget) {
            widgets.unshift(widget);
            widget = widget.previousSplitWidget;
            if(widget && widget == widget.previousSplitWidget) {
                break;
            }
        }
        return widgets;
    }

    public getSplitWidgets(): Widget[] {
        let widgets: Widget[] = this.getPreviousSplitWidgets();
        let widget: Widget = this;
        while (widget) {
            widgets.push(widget);
            widget = widget.nextSplitWidget;
        }
        return widgets;
    }
    public combineWidget(viewer: LayoutViewer): Widget {
        let root: Widget = this;
        let widgets: Widget[] = this.getSplitWidgets();
        if (widgets.length > 1) {
            root = widgets.shift();
            while (widgets.length > 0) {
                let splitWidget: Widget = widgets.shift();
                root.combine(splitWidget, viewer);
            }
        }
        if (root instanceof TableWidget) {
            root.combineRows(viewer);
        }
        return root;
    }
  
    private combine(widget: Widget, viewer: LayoutViewer): void {
        if (widget.childWidgets.length > 0) {
            let lastChild: Widget = this.lastChild as Widget;

            if (lastChild instanceof TableWidget) {
                lastChild.combineWidget(viewer);
            } else {
                let firstChild: Widget = widget.firstChild as Widget;
                if (!(widget instanceof TableWidget) && lastChild instanceof Widget && firstChild instanceof Widget &&
                    lastChild.index === firstChild.index) {
                    lastChild.combine(widget.childWidgets.shift() as Widget, viewer);
                }
            }
            this.addWidgets(widget.childWidgets);
            widget.childWidgets = [];
        }
        widget.destroyInternal(viewer);
    }
    public addWidgets(childWidgets: IWidget[]): void {
        while (childWidgets.length > 0) {
            let widget: IWidget = childWidgets.shift();
            if (widget instanceof LineWidget && this instanceof ParagraphWidget) {
                widget.paragraph = this;
                this.height += widget.height;
            } else if (widget instanceof Widget) {
                let lastChild: Widget = this.lastChild as Widget;
                widget.containerWidget = this;
                widget.y = lastChild instanceof Widget ? lastChild.y + lastChild.height : this.y;
                this.height += widget.height;
            }
            if (widget instanceof TableRowWidget) {
                let previousRow: TableRowWidget = this.childWidgets[this.childWidgets.length - 1] as TableRowWidget;
                for (let i = 0; i < previousRow.childWidgets.length; i++) {
                    let previousCell: TableCellWidget = previousRow.childWidgets[i] as TableCellWidget;
                    if (previousCell.cellFormat.rowSpan > 1) {
                        for (let j = 0; j < (widget as TableRowWidget).childWidgets.length; j++) {
                            let currentCell: TableCellWidget = (widget as TableRowWidget).childWidgets[j] as TableCellWidget;
                            if (currentCell.columnIndex === previousCell.columnIndex && currentCell.isSplittedCell && currentCell.cellFormat.rowSpan === previousCell.cellFormat.rowSpan) {
                                for (let k = 0; k < currentCell.childWidgets.length; k++) {
                                    let block: BlockWidget = currentCell.childWidgets[k] as BlockWidget;
                                    currentCell.childWidgets.splice(block.indexInOwner, 1);
                                    previousCell.childWidgets.push(block);
                                    block.containerWidget = previousCell;
                                    k--;
                                }
                                currentCell.ownerRow.childWidgets.splice(currentCell.indexInOwner, 1);
                                currentCell.containerWidget = undefined;
                                j--;
                            }
                        }
                    }
                }
            }
            this.childWidgets.push(widget);
        }
    }
    public removeChild(index: number): void {
        if (index > -1 && index < this.childWidgets.length) {
            this.childWidgets.splice(index, 1);
        }
    }
    public abstract destroyInternal(viewer: LayoutViewer): void;
    public destroy(): void {
        if (this.childWidgets) {
            while (this.childWidgets.length > 0) {
                let child: IWidget = this.childWidgets.pop();
                if (child instanceof LineWidget || child instanceof Widget) {
                    child.destroy();
                }
            }
        }
        this.childWidgets = undefined;
        if (this.containerWidget) {
            this.containerWidget.removeChild(this.indexInOwner);
        }
        this.containerWidget = undefined;
        // if (this.margin) {
        //     this.margin.destroy();
        // }
        this.margin = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
        this.index = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.childWidgets) {
            while (this.childWidgets.length > 0) {
                let child: IWidget = this.childWidgets.pop();
                if (child instanceof LineWidget || child instanceof Widget) {
                    child.componentDestroy();
                }
            }
        }
        this.childWidgets = undefined;
        if (this.margin) {
            this.margin.destroy();
        }
        this.margin = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
        this.index = undefined;
        this.containerWidget = undefined;
    }
}
/** 
 * @private
 */
export abstract class BlockContainer extends Widget {
    /**
     * @private
     */
    public page: Page;
    /**
     * @private
     */
    public floatingElements: (ShapeBase | TableWidget)[] = [];
    /**
     * @private
     */
    public footNoteReference: FootnoteElementBox = undefined;
    /**
    * @private
    */
    public removedHeaderFooters: HeaderFooters[];
    /**
     * @private
     */
    public sectionFormatIn: WSectionFormat = undefined;
    /**
    * @private
    */
    public columnIndex: number = 0;
    /**
     * @private
     */
    public isWord2010NextColumn: boolean = false; 
    public get sectionFormat(): WSectionFormat {
        let container: BlockContainer = this;
        if (container instanceof BodyWidget) {
            return container.sectionFormatIn;
        } else if (container.page && !isNullOrUndefined(container.page.bodyWidgets)) {
            return container.page.bodyWidgets[0].sectionFormat;
        }
        return undefined;
    }
    public set sectionFormat(value: WSectionFormat) {
        if (this instanceof BodyWidget) {
            this.sectionFormatIn = value;
        }
    }
    public get sectionIndex(): number {
        let container: BlockContainer = this;
        let index: number = 0;
        if (container instanceof BodyWidget) {
            index = container.index;
        } else if (container.page) {
            index = container.page.bodyWidgets[0].index;
        }
        return index;
    }
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let documentHelper: DocumentHelper = undefined;
        let node: BlockContainer = this;
        if (node instanceof BodyWidget) {
            hierarchicalIndex = node.index + ';' + hierarchicalIndex;
        } else if (node instanceof FootNoteWidget) {
            if (node.footNoteType === 'Footnote') {
                hierarchicalIndex = 'FN' + ';' + hierarchicalIndex;
            } else {
                hierarchicalIndex = 'EN' + ';' + hierarchicalIndex;
            }
        } else {
            if ((node as HeaderFooterWidget).headerFooterType.indexOf('Header') !== -1) {
                hierarchicalIndex = 'H' + ';' + hierarchicalIndex;
            } else {
                hierarchicalIndex = 'F' + ';' + hierarchicalIndex;
            }
        }
        if (!isNullOrUndefined(node.page)) {
            documentHelper = this.page.documentHelper;
            let pageIndex: number = documentHelper.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.sectionFormatIn) {
            this.sectionFormatIn.destroy();
        }
        this.sectionFormatIn = undefined;
        this.floatingElements = [];
        this.removedHeaderFooters = [];
        this.footNoteReference = undefined;
        this.page = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class BodyWidget extends BlockContainer {
    /**
     * Initialize the constructor of BodyWidget
     */
    public constructor() {
        super();
    }
    public equals(widget: Widget): boolean {
        return widget instanceof BodyWidget && widget.sectionFormat === this.sectionFormat;
    }
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let documentHelper: DocumentHelper = undefined;
        let node: BodyWidget = this;
        if (node.containerWidget instanceof FootNoteWidget) {
            hierarchicalIndex = node.containerWidget.bodyWidgets.indexOf(node) + ';' + hierarchicalIndex;
            if (node.containerWidget.footNoteType === 'Footnote') {
                hierarchicalIndex = 'FN' + ';' + hierarchicalIndex;
            } else {
                hierarchicalIndex = 'EN' + ';' + hierarchicalIndex;
            }
        } else {
            if (this.page && this.page.bodyWidgets.indexOf(this) !== -1) {
                hierarchicalIndex = this.page.bodyWidgets.indexOf(this) + ';' + hierarchicalIndex;
            } else {
                hierarchicalIndex = node.index + ';' + hierarchicalIndex;
            }
        }
        if (!isNullOrUndefined(node.page)) {
            documentHelper = this.page.documentHelper;
            let pageIndex: number = documentHelper.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    }
    public getTableCellWidget(touchPoint: Point): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            if (this.childWidgets[i] instanceof TableWidget) {
                const childWidget: TableWidget = this.childWidgets[i] as TableWidget;
                let tableWidth: number = 0;
                if (childWidget.wrapTextAround) {
                    tableWidth = childWidget.getTableCellWidth();
                }
                if (!(childWidget.wrapTextAround) && childWidget.y <= touchPoint.y && (childWidget.y + childWidget.height) >= touchPoint.y) {
                    return (childWidget as Widget).getTableCellWidget(touchPoint);
                }
                if ((childWidget.wrapTextAround &&
                    (childWidget.x <= touchPoint.x && (childWidget.x + tableWidth) >= touchPoint.x &&
                        childWidget.y <= touchPoint.y && (childWidget.y + childWidget.height) >= touchPoint.y))) {
                    return (childWidget as Widget).getTableCellWidget(touchPoint);
                }
            }
        }
        let tableCellWidget: TableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if ((this.childWidgets[0] as Widget).y <= touchPoint.y) {
                tableCellWidget = (this.childWidgets[this.childWidgets.length - 1] as Widget).getTableCellWidget(touchPoint);
            } else {
                tableCellWidget = (this.childWidgets[0] as Widget).getTableCellWidget(touchPoint);
            }
        }
        return tableCellWidget;
    }
    public destroyInternal(viewer: LayoutViewer): void {
        let height: number = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (let n: number = 0; n < this.childWidgets.length; n++) {
                let chilgWidget: Widget = this.childWidgets[n] as Widget;
                if (chilgWidget instanceof ParagraphWidget) {
                    (chilgWidget as ParagraphWidget).destroyInternal(viewer);
                } else {
                    (chilgWidget as TableWidget).destroyInternal(viewer);
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                n--;
            }
            this.childWidgets = undefined;
        }
        // if (this instanceof HeaderFooterWidget && ((this as HeaderFooterWidget).currentNode ))) {
        //     if (((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets )) {
        //         let index: number = ((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets.indexOf(this);
        //         ((this as HeaderFooterWidget).currentNode as WHeaderFooter).layoutedWidgets.splice(index, 1);
        //     }
        //     this.currentNode = undefined;
        if (!isNullOrUndefined(this.page)) {
            let index: number = this.indexInOwner;
            if (this.indexInOwner > -1) {
                this.page.bodyWidgets.splice(index, 1);
                if (this.page.bodyWidgets.length === 0) {
                    this.page.destroy();
                    // }
                } else if ((this instanceof HeaderFooterWidget)
                    && this.page.headerWidget === (this as HeaderFooterWidget)) {
                    this.page.headerWidget = undefined;
                } else if ((this instanceof HeaderFooterWidget)
                    && this.page.footerWidget === (this as HeaderFooterWidget)) {
                    this.page.footerWidget = undefined;
                }
                this.page = undefined;
            }
        }
        this.destroy();
    }
    public destroy(): void {
        // if (this.sectionFormatIn) {
        //     this.sectionFormatIn.destroy();
        // }
        this.sectionFormatIn = undefined;
        if (this.page && this.page.headerWidgetIn) {
            this.page.headerWidgetIn.page = undefined;
        }
        if (this.page && this.page.footerWidgetIn) {
            this.page.footerWidgetIn.page = undefined;
        }
        this.page = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export interface HeaderFooters {
    [key: number]: HeaderFooterWidget;
}
/** 
 * @private
 */
export class HeaderFooterWidget extends BlockContainer {
    /**
     * @private
     */
    public headerFooterType: HeaderFooterType;
    /**
     * @private
     */
    public parentHeaderFooter: HeaderFooterWidget;
    /**
     * @private
     */
    public isEmpty: boolean = false;
    public constructor(type: HeaderFooterType) {
        super();
        this.headerFooterType = type;
    }
    public getTableCellWidget(point: Point): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            if (this.childWidgets[i] instanceof TableWidget) {
                const child: TableWidget = this.childWidgets[i] as TableWidget;
                let tableWidth: number = 0;
                if (child.wrapTextAround) {
                    tableWidth = child.getTableCellWidth();
                }
                if (!(child.wrapTextAround) && child.y <= point.y && (child.y + child.height) >= point.y) {
                    return (child as Widget).getTableCellWidget(point);
                }
                if ((child.wrapTextAround &&
                    (child.x <= point.x && (child.x + tableWidth) >= point.x &&
                        child.y <= point.y && (child.y + child.height) >= point.y))) {
                    return (child as Widget).getTableCellWidget(point);
                }
            }
        }
        let tableCell: TableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if ((this.childWidgets[0] as Widget).y <= point.y) {
                tableCell = (this.childWidgets[this.childWidgets.length - 1] as Widget).getTableCellWidget(point);
            } else {
                tableCell = (this.childWidgets[0] as Widget).getTableCellWidget(point);
            }
        }
        return tableCell;
    }
    public equals(widget: Widget): boolean {
        // Todo: Need to work
        return widget instanceof HeaderFooterWidget
            && widget.containerWidget === this.containerWidget;
    }
    public clone(): HeaderFooterWidget {
        let headerFooter: HeaderFooterWidget = new HeaderFooterWidget(this.headerFooterType);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = (this.childWidgets[i] as BlockWidget).clone();
            headerFooter.childWidgets.push(block);
            block.index = i;
            block.containerWidget = headerFooter;
        }
        headerFooter.isEmpty = this.isEmpty;
        headerFooter.x = this.x;
        headerFooter.y = this.y;
        headerFooter.height = 0;
        headerFooter.width = 0;
        return headerFooter;
    }
    public destroyInternal(viewer: LayoutViewer): void {
        this.page = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        super.componentDestroy();
        this.parentHeaderFooter = undefined;
    }
}
/** 
 * @private
 */
export abstract class BlockWidget extends Widget {
    /**
     * @private
     */
    public isLayouted: boolean = false;
    /**
     * @private
     */
    public isFieldCodeBlock: boolean = false;
    /**
     * @private
     */
    public leftBorderWidth: number;
    /**
     * @private
     */
    public rightBorderWidth: number;
    /**
     * @private
     */
    public topBorderWidth: number;
    /**
     * @private
     */
    public bottomBorderWidth: number;
    /**
     * @private
     */
    public locked: boolean = false;
    /**
     * @private
     */
    public lockedBy: string = '';
    // /**
    //  * @private
    //  */
    // private lengthIn: number = 1;
    // /**
    //  * @private
    //  */
    // get length(): number {
    //     if (this.lengthIn == 0) {
    //         this.lengthIn = 1;
    //     }
    //     return this.lengthIn;
    // }
    // /**
    //  * @private
    //  */
    // set length(value: number) {
    //     this.lengthIn = value;
    // }
    /**
     * @private
     */
    public contentControlProperties: ContentControlProperties;
    public get bodyWidget(): BlockContainer {
        let widget: Widget = this;
        while (widget.containerWidget) {
            if (widget.containerWidget instanceof TextFrame) {
                let paragraph: ParagraphWidget = widget.containerWidget.containerShape.line.paragraph;
                if (paragraph) {
                    return paragraph.bodyWidget;
                }
            }
            else if (widget.containerWidget instanceof BlockContainer) {
                return widget.containerWidget as BlockContainer;
            }
            widget = widget.containerWidget;
        }
        return undefined;
    }
    public get leftIndent(): number {
        let blockAdv: BlockWidget = this;
        if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
            return blockAdv.paragraphFormat.leftIndent;
        } else if (blockAdv instanceof TableWidget && (blockAdv as TableWidget).tableFormat instanceof WTableFormat) {
            return blockAdv.tableFormat.leftIndent;
        }
        return 0;
    }
    public get rightIndent(): number {
        let blockAdv: BlockWidget = this;
        if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
            return (blockAdv as ParagraphWidget).paragraphFormat.rightIndent;
        }
        return 0;
    }
    public get isInsideTable(): boolean {
        return this.containerWidget instanceof TableCellWidget;
    }
    public get isInHeaderFooter(): boolean {
        return this.bodyWidget instanceof HeaderFooterWidget;
    }
    public get associatedCell(): TableCellWidget {
        if (this.containerWidget instanceof TableCellWidget) {
            return this.containerWidget as TableCellWidget;
        }
        return undefined;
    }
    /**
     * Check whether the paragraph contains only page break.
     * 
     * @private
     * @returns {boolean}: Returns true if paragraph contains page break alone.
     */
    public isPageBreak(): boolean {
        let isPageBreak: boolean = false;
        if (this instanceof ParagraphWidget) {
            let paragraph: ParagraphWidget = this as ParagraphWidget;
            if (paragraph != null && paragraph.childWidgets.length === 1 &&
                (paragraph.firstChild as LineWidget).children.length === 1) {
                let pageBreak: ElementBox = (paragraph.firstChild as LineWidget).children[0] as ElementBox;
                isPageBreak = pageBreak.isPageBreak;
            }
        }
        return isPageBreak;
    }
    public isColumnBreak(): boolean {
        let isColumnBreak: boolean = false;
        if (this instanceof ParagraphWidget) {
            let paragraph: ParagraphWidget = this as ParagraphWidget;
            if (paragraph != null && paragraph.childWidgets.length === 1 &&
                (paragraph.firstChild as LineWidget).children.length === 1) {
                let columnBreak: ElementBox = (paragraph.firstChild as LineWidget).children[0] as ElementBox;
                isColumnBreak = columnBreak.isColumnBreak;
            }
        }
        return isColumnBreak;
    }
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let node: BlockWidget = this;
        hierarchicalIndex = node.containerWidget.childWidgets.indexOf(node) + ';' + hierarchicalIndex;
        if (!isNullOrUndefined(node.containerWidget)) {
            if (node.containerWidget instanceof TextFrame) {
                return (node.containerWidget as TextFrame).getHierarchicalIndex(hierarchicalIndex);
            } else if (node.containerWidget instanceof BlockWidget) {
                return (node.containerWidget as BlockWidget).getHierarchicalIndex(hierarchicalIndex);
            } else if (node.containerWidget instanceof BlockContainer) {
                hierarchicalIndex = node.containerWidget.getHierarchicalIndex(hierarchicalIndex);
            }
        }
        return hierarchicalIndex;
    }
    public abstract getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo;

    public abstract clone(): BlockWidget;

    public getIndex(): number {
        if (this instanceof ParagraphWidget || this instanceof TableWidget) {
            return (this as BlockWidget).containerWidget.childWidgets.indexOf(this);
        } else if (this instanceof TableRowWidget) {
            return (this as TableRowWidget).ownerTable.childWidgets.indexOf(this);
        } else if (this instanceof TableCellWidget) {
            return (this as TableCellWidget).ownerRow.childWidgets.indexOf(this);
        }
        return 0;
    }

    public getContainerWidth(): number {
        if (this.isInsideTable) {
            let block: BlockWidget = this;
            if ((block instanceof TableWidget) && block.tableFormat.preferredWidthType === 'Auto' && this.associatedCell.ownerTable.isGridUpdated) {
                let containerWidth: number = 0;
                let columnSpan: number = this.associatedCell.cellFormat.columnSpan;
                let columnIndex: number = this.associatedCell.columnIndex;
                for (let i: number = 0; i < columnSpan; i++) {
                    containerWidth += this.associatedCell.ownerTable.tableHolder.columns[columnIndex].preferredWidth;
                    columnIndex++;
                }
                if (containerWidth > 0) {
                    return containerWidth;
                }
            }
            return this.associatedCell.getCellWidth(this);
        }
        if (this.containerWidget instanceof TextFrame) {
            let shape: ShapeElementBox = this.containerWidget.containerShape as ShapeElementBox;
            return HelperMethods.convertPixelToPoint(shape.width) - HelperMethods.convertPixelToPoint(shape.textFrame.marginLeft)
                - HelperMethods.convertPixelToPoint(shape.textFrame.marginRight);
        } else {
            let bodyWidget: BlockContainer = this.bodyWidget;
            let sectionFormat: WSectionFormat = bodyWidget.sectionFormat;
            let padding: number = 0;
            if (!isNullOrUndefined(bodyWidget.page) && !isNullOrUndefined(bodyWidget.page.documentHelper) &&
                bodyWidget.page.documentHelper.compatibilityMode !== 'Word2013' && !this.isInsideTable && this instanceof TableWidget) {
                let firstRow: TableRowWidget = this.firstChild as TableRowWidget;
                padding = (firstRow.firstChild as TableCellWidget).leftMargin + ((firstRow).lastChild as TableCellWidget).rightMargin;
            }
            if (bodyWidget instanceof BodyWidget && sectionFormat.columns.length > 1) {
                let colIndex: number = bodyWidget.columnIndex;
                return HelperMethods.convertPixelToPoint((sectionFormat.columns[colIndex] as WColumnFormat).width);
            }
            else {
                return sectionFormat.pageWidth - (sectionFormat.leftMargin + sectionFormat.rightMargin) + padding;
            }
        }
    }
    public get bidi(): boolean {
        if (this instanceof ParagraphWidget && (this as ParagraphWidget).paragraphFormat instanceof WParagraphFormat) {
            return (this as ParagraphWidget).paragraphFormat.bidi;
        }
        if (this instanceof TableWidget && (this as TableWidget).tableFormat instanceof WTableFormat) {
            return (this as TableWidget).tableFormat.bidi;
        }
        return false;

    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        super.componentDestroy();
        this.contentControlProperties = undefined;
    }
}
/** 
 * @private
 */
export class FootNoteWidget extends BlockContainer {
    public getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo {
        throw new Error('Method not implemented.');
    }
    /**
     * @private
     */
    public footNoteType: FootnoteType;
    /**
     * @private
     */
    public containerWidget: BodyWidget;
    /**
     * @private
     */
    public bodyWidgets: BodyWidget[] = [];
    /**
     * @private
     */
    public block: BlockWidget;
    public getTableCellWidget(point: Point): TableCellWidget {
        return undefined;
    }
    public equals(widget: Widget): boolean {
        // Todo: Need to work
        return widget instanceof FootNoteWidget
            && widget.containerWidget === this.containerWidget;
    }
    public clone(): FootNoteWidget {
        let footNote: FootNoteWidget = new FootNoteWidget();
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = (this.childWidgets[i] as BlockWidget).clone();
            footNote.childWidgets.push(block);
            block.index = i;
            block.containerWidget = footNote;
        }
        footNote.block = this.block;
        return footNote;
    }
    public destroyInternal(viewer: LayoutViewer): void {
        this.block = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.bodyWidgets && this.bodyWidgets.length > 0) {
            for (let i: number = 0; i < this.bodyWidgets.length; i++) {
                let bodyWidget: BodyWidget = this.bodyWidgets[i] as BodyWidget;
                bodyWidget.componentDestroy();
            }
            this.bodyWidgets = [];
        }
        this.bodyWidgets = undefined;
        this.block = undefined;
        super.componentDestroy();
    }
}

/** 
 * @private
 */
export class ParagraphWidget extends BlockWidget {
    /**
     * @private
     */
    public paragraphFormat: WParagraphFormat;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat;
    /**
     * @private
     */
    public isSectionBreak: boolean = false;
    /**
     * @private
     */
    public isChangeDetected: boolean = false;
    /**
     * @private
     * The clientX having previous left value of empty paragraph
     */
     public clientX: number = undefined;
    /**
     * @private
     */
    public floatingElements: ShapeBase[] = [];
    public get isEndsWithPageBreak(): boolean {
        if (this.childWidgets.length > 0) {
            return (this.lastChild as LineWidget).isEndsWithPageBreak;
        }
        return false;
    }
    public get isEndsWithColumnBreak(): boolean{
        if (this.childWidgets.length > 0) {
            return (this.lastChild as LineWidget).isEndsWithColumnBreak;
        }
        return false;
    }
    /**
     * Initialize the constructor of ParagraphWidget
     */
    public constructor() {
        super();
        this.paragraphFormat = new WParagraphFormat(this);
        this.characterFormat = new WCharacterFormat(this);
    }
    public equals(widget: Widget): boolean {
        return widget instanceof ParagraphWidget && widget.paragraphFormat === this.paragraphFormat;
    }
    public isContainsShapeAlone(): boolean {
        let containsShape: boolean = false;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let lineWidget: LineWidget = this.childWidgets[i] as LineWidget;
            for (let j: number = 0; j < lineWidget.children.length; j++) {
                let inline: ElementBox = lineWidget.children[j] as ElementBox;
                if (!(inline instanceof ShapeBase) || (inline instanceof ShapeBase && inline.textWrappingStyle === 'Inline')) {
                    return false;
                } else {
                    containsShape = true;
                }
            }
        }
        return containsShape ? true : false;
    }
    public isEmpty(): boolean {
        if (isNullOrUndefined(this.childWidgets) || this.childWidgets.length === 0) {
            return true;
        }
        for (let j: number = 0; j < this.childWidgets.length; j++) {
            let inlineElement: LineWidget = this.childWidgets[j] as LineWidget;
            for (let i: number = 0; i < inlineElement.children.length; i++) {
                let inline: ElementBox = inlineElement.children[i] as ElementBox;
                if (inline.length === 0) {
                    continue;
                }
                if (inline instanceof TextElementBox || inline instanceof ImageElementBox || inline instanceof BookmarkElementBox
                    || inline instanceof EditRangeEndElementBox || inline instanceof EditRangeStartElementBox
                    || inline instanceof ChartElementBox || inline instanceof ShapeElementBox
                    || inline instanceof ContentControl
                    || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                    return false;
                }
            }
        }
        return true;
    }
    public getInline(offset: number, indexInInline: number): ElementInfo {
        let inline: ElementBox = undefined;
        let count: number = 0;
        let isStarted: boolean = false;
        let splittedWidget: BlockWidget[] = this.getSplitWidgets() as BlockWidget[];
        for (let k: number = 0; k < splittedWidget.length; k++) {
            let widget: ParagraphWidget = splittedWidget[k] as ParagraphWidget;
            for (let j: number = 0; j < widget.childWidgets.length; j++) {
                let line: LineWidget = widget.childWidgets[j] as LineWidget;
                for (let i: number = 0; i < line.children.length; i++) {
                    inline = line.children[i] as ElementBox;
                    if (inline instanceof ListTextElementBox) {
                        continue;
                    }
                    if (!isStarted && (inline instanceof TextElementBox || inline instanceof ImageElementBox
                        || inline instanceof ShapeElementBox
                        || inline instanceof BookmarkElementBox || inline instanceof FieldElementBox
                        && HelperMethods.isLinkedFieldCharacter(inline as FieldElementBox))
                        || inline instanceof ChartElementBox) {
                        isStarted = true;
                    }

                    if (isStarted && offset <= count + inline.length) {
                        indexInInline = (offset - count);
                        return { 'element': inline, 'index': indexInInline };
                    }
                    count += inline.length;
                }
            }
        }
        if (offset > count) {
            indexInInline = isNullOrUndefined(inline) ? offset : inline.length;
        }
        return { 'element': inline, 'index': indexInInline };
    }
    public getLength(): number {
        let length: number = 0;
        if (isNullOrUndefined(this.childWidgets)) {
            return length;
        }
        for (let j: number = 0; j < this.childWidgets.length; j++) {
            let line: LineWidget = this.childWidgets[j] as LineWidget;
            for (let i: number = 0; i < line.children.length; i++) {
                let element: ElementBox = line.children[i] as ElementBox;
                if (element instanceof ListTextElementBox) {
                    continue;
                }
                length += element.length;
            }
        }
        return length;
    }
    /**
     * Return the total length by considering splitted paragraph widgets.
     * @private
     */
    public getTotalLength(): number {
        let offset: number = 0;
        let splittedWidget: ParagraphWidget[] = this.getSplitWidgets() as ParagraphWidget[];
        for (let i: number = 0; i < splittedWidget.length; i++) {
            offset += splittedWidget[i].getLength();
        }
        return offset;
    }
    public getTableCellWidget(point: Point): TableCellWidget {
        return undefined;
    }
    public getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo {
        minimumWordWidth = HelperMethods.convertPointToPixel(minimumWordWidth);
        maximumWordWidth = HelperMethods.convertPointToPixel(maximumWordWidth);
        if (this.childWidgets.length > 0) {
            let element: ElementBox = (this.childWidgets[0] as LineWidget).children[0] as ElementBox;
            let text: string = '';
            let elements: Dictionary<TextElementBox, number> = new Dictionary<TextElementBox, number>();
            let imageWidths: number[] = [];
            do {
                if (element instanceof TextElementBox && (element as TextElementBox).text !== '') {
                    elements.add(element as TextElementBox, text.length);
                    text += ((element as TextElementBox).text);
                } else if (element instanceof FieldElementBox && element.fieldType === 0) {
                    let fieldBegin: FieldElementBox = element as FieldElementBox;
                    if (!isNullOrUndefined(fieldBegin.fieldEnd)) {
                        element = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd as ElementBox : fieldBegin.fieldSeparator as ElementBox;
                    }
                } else if (element instanceof ImageElementBox) {
                    imageWidths.push((element as ImageElementBox).width);
                }
                if (isNullOrUndefined(element) || isNullOrUndefined(element.nextNode)) {
                    break;
                }
                element = element.nextNode as ElementBox;
            } while (true);

            let pattern: RegExp = new RegExp('\\b\\w+\\b', 'g');

            let matches: RegExpExecArray[] = [];
            let matchInfo: RegExpExecArray;
            // eslint-disable  no-cond-assign
            while (!isNullOrUndefined(matchInfo = pattern.exec(text))) {
                matches.push(matchInfo);
            }
            for (let i: number = 0; i < matches.length; i++) {
                let match: RegExpExecArray = matches[i];
                let width: number = 0;
                text = '';
                let matchedValue: string = '';
                let wordStartIndex: number = 0;
                let wordEndIndex: number = match.index;
                let index: number = match.index;
                for (let j: number = 0; j < elements.keys.length; j++) {
                    let span: TextElementBox = elements.keys[j];
                    let startIndex: number = elements.get(span);
                    let spanLength: number = span.length;
                    if (index <= startIndex + spanLength) {
                        wordStartIndex = index - startIndex;
                        if (match.index + match[0].length <= startIndex + spanLength) {
                            wordEndIndex = (match.index + match[0].length) - (startIndex + wordStartIndex);
                        } else {
                            wordEndIndex = spanLength - wordStartIndex;
                            index += wordEndIndex;
                        }
                        text = span.text.substring(wordStartIndex, wordStartIndex + wordEndIndex);
                        matchedValue = matchedValue + text;
                    }
                    if (text !== '') {
                        width += this.bodyWidget.page.documentHelper.textHelper.getWidth(text, span.characterFormat, span.scriptType);
                    }
                    if (matchedValue === match[0]) {
                        break;
                    }
                }
                if (width !== 0) {
                    if (minimumWordWidth === 0 || width > minimumWordWidth) {
                        minimumWordWidth = width;
                    }
                }
            }
            // Check the image widths present in the paragraph. Consider the maximum image width as minimum word width.
            let imageWidth: number = 0;
            if (imageWidths.length > 0) {
                imageWidth = Math.max.apply(null, imageWidths);
            }
            if (minimumWordWidth === 0 || imageWidth > minimumWordWidth) {
                minimumWordWidth = imageWidth;
            }
            let maximum: number = this.measureParagraph();
            if (maximumWordWidth === 0 || maximum > maximumWordWidth) {
                maximumWordWidth = maximum;
            }
        }
        let leftIndent: number = 0;
        if (!this.isEmpty() && this.floatingElements.length == 0 && !isNullOrUndefined(this.paragraphFormat) && this.paragraphFormat.leftIndent > 0
            && !isNullOrUndefined(this.associatedCell) && !isNullOrUndefined(this.associatedCell.cellFormat) && this.associatedCell.cellFormat.preferredWidthType === 'Point') {
            const paraIndent: number = this.paragraphFormat.leftIndent + this.paragraphFormat.firstLineIndent;
            if ((paraIndent + minimumWordWidth) > this.associatedCell.cellFormat.preferredWidth) {
                leftIndent = paraIndent;
            }
        }
        return {
            'maximumWordWidth': HelperMethods.convertPixelToPoint(maximumWordWidth),
            'minimumWordWidth': HelperMethods.convertPixelToPoint(minimumWordWidth) + leftIndent
        };
    }
    private measureParagraph(): number {
        let width: number = 0;
        let element: ElementBox = (this.childWidgets[0] as LineWidget).children[0];
        do {
            if (element instanceof TextElementBox && element.text !== '') {
                width += this.bodyWidget.page.documentHelper.textHelper.getWidth(element.text, element.characterFormat, element.scriptType);
            } else if (element instanceof FieldElementBox && element.fieldType === 0) {
                let fieldBegin: FieldElementBox = element as FieldElementBox;
                if (fieldBegin.fieldEnd != null) {
                    element = isNullOrUndefined(fieldBegin.fieldSeparator) ? fieldBegin.fieldEnd : fieldBegin.fieldSeparator;
                }
            } else if (element instanceof ImageElementBox) {
                width += element.width;
            }
            if (isNullOrUndefined(element) || isNullOrUndefined(element.nextNode)) {
                break;
            }
            element = element.nextNode;
        } while (true);
        // Considered the left and right indent.
        if (this.leftIndent > 0) {
            width += this.leftIndent;
        }
        if (this.rightIndent > 0) {
            width += this.rightIndent;
        }
        return width;
    }

    private isArabicChar(character: string): boolean {
        //Arabic characters https://en.wikipedia.org/wiki/Arabic_script#Unicode
        return ((character >= String.fromCharCode(1536) && character <= String.fromCharCode(1791)) //Script-Arab, Arabic characters https://en.wikipedia.org/wiki/Arabic_(Unicode_block)
            || (character >= String.fromCharCode(1872) && character <= String.fromCharCode(1919)) //Script-Arab, Arabic Supplement characters https://en.wikipedia.org/wiki/Arabic_Supplement
            || (character >= String.fromCharCode(2208) && character <= String.fromCharCode(2303)) //Script-Arab, Arabic Extended-A characters https://en.wikipedia.org/wiki/Arabic_Extended-A
            || (character >= String.fromCharCode(64336) && character <= String.fromCharCode(65023)) //Script-Arab, Arabic Presentation Forms-A characters https://en.wikipedia.org/wiki/Arabic_Presentation_Forms-A
            || (character >= String.fromCharCode(65136) && character <= String.fromCharCode(65279))); //Script-Arab, Arabic Presentation Forms-B characters https://en.wikipedia.org/wiki/Arabic_Presentation_Forms-B                
    }
    private isHebrewChar(character: string): boolean {
        return ((character >= String.fromCharCode(1424) && character <= String.fromCharCode(1535)) //Script-Hebr, Hebrew characters https://en.wikipedia.org/wiki/Hebrew_alphabet#Unicode_and_HTML (https://en.wikipedia.org/wiki/Hebrew_(Unicode_block))
            || (character >= String.fromCharCode(64285) && character <= String.fromCharCode(64335))); //Script-Hebr, Hebrew Alphabetic Presentation Forms characters https://en.wikipedia.org/wiki/Alphabetic_Presentation_Forms                                                                    
    }
    private isHindiChar(character: string): boolean {
        //Hindi characters are comes under the Devanagari scripts.
        //The Unicode Standard defines three blocks for Devanagari. https://en.wikipedia.org/wiki/Devanagari#Unicode              
        return ((character >= String.fromCharCode(2304) && character <= String.fromCharCode(2431)) //Devanagari (U+0900–U+097F), https://en.wikipedia.org/wiki/Devanagari_(Unicode_block)
            || (character >= String.fromCharCode(43232) && character <= String.fromCharCode(43263)) //Devanagari Extended (U+A8E0–U+A8FF), https://en.wikipedia.org/wiki/Devanagari_Extended
            || (character >= String.fromCharCode(7376) && character <= String.fromCharCode(7423))); //Vedic Extensions (U+1CD0–U+1CFF), https://en.wikipedia.org/wiki/Vedic_Extensions
    }
    private isKoreanChar(character: string): boolean {
        return (
            //Korean characters https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode
            (character >= String.fromCharCode(44032) && character <= String.fromCharCode(55203)) //Hangul Syllables characters https://en.wikipedia.org/wiki/Hangul_Syllables
            || (character >= String.fromCharCode(4352) && character <= String.fromCharCode(4607)) //Hangul Jamo characters https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)
            || (character >= String.fromCharCode(12592) && character <= String.fromCharCode(12687)) //Hangul Compatibility Jamo characters https://en.wikipedia.org/wiki/Hangul_Compatibility_Jamo
            || (character >= String.fromCharCode(43360) && character <= String.fromCharCode(43391)) //Hangul Jamo Extended-A characters https://en.wikipedia.org/wiki/Hangul_Jamo_Extended-A
            || (character >= String.fromCharCode(55216) && character <= String.fromCharCode(55295)) //Hangul Jamo Extended-B characters https://en.wikipedia.org/wiki/Hangul_Jamo_Extended-B
            || (character >= String.fromCharCode(44032) && character <= String.fromCharCode(55215)) //Hangul_Syllables characters https://en.wikipedia.org/wiki/Hangul_Syllables
        );
    }
    private isJapanese(character: string): boolean {
        return (
            //Japanese and Ainu languages
            (character >= String.fromCharCode(12448) && character <= String.fromCharCode(12543)) //Katakana characters https://en.wikipedia.org/wiki/Katakana_(Unicode_block)
            || (character >= String.fromCharCode(12352) && character <= String.fromCharCode(12447)) //Hiragana characters https://en.wikipedia.org/wiki/Hiragana_(Unicode_block)
        );
    }
    private isThaiCharacter(character: string): boolean {
        // Thai characters https://en.wikipedia.org/wiki/Thai_script#Unicode_ranges 
        return (character >= String.fromCharCode(3584) && character <= String.fromCharCode(3711));
    }
    private isChineseChar(character: string): boolean {
        //To-Do: Should handle a Chinese characters as two separate scripts such as Chinese Simplified and Chinese Traditional.
        return (
            //Chinese characters https://en.wikipedia.org/wiki/Han_unification#Unicode_ranges
            //Chinese characters are comes under the Han script.
            (character >= String.fromCharCode(19968) && character <= String.fromCharCode(40959)) //CJK Unified Ideographs(4E00–9FFF), https://en.wikipedia.org/wiki/CJK_Unified_Ideographs_(Unicode_block)
            || (character >= String.fromCharCode(13312) && character <= String.fromCharCode(19903)) //CJK Unified Ideographs Extension A(3400–4DBF), https://en.wikipedia.org/wiki/CJK_Unified_Ideographs_Extension_A
            //|| (character >= '\u20000' && character <= '\u2A6DF') //CJK Unified Ideographs Extension B(20000–2A6DF), https://en.wikipedia.org/wiki/CJK_Unified_Ideographs_Extension_B
            // As we don't hold a 32 bit character into char data type, and also it get splitted into two char value, when it is 32 bit.
            // So, below we have added a maximum and least char range of the above 32 bit character.
            // We can split a 32 bit character into two 16 bit characters by "Char.ConvertFromUtf32(0x20000).ToCharArray()" built-in method.
            || (character >= String.fromCharCode(55360) && character <= String.fromCharCode(55401)) // Represents a start and end range of first character code, when we split a character between (character >= '\u20000' && character <= '\u2A6DF').
            || (character >= String.fromCharCode(56320) && character <= String.fromCharCode(57055)) // Represents a start and end range of second character code, when we split a character between (character >= '\u20000' && character <= '\u2A6DF').
            || (character >= String.fromCharCode(43360) && character <= String.fromCharCode(43391)) //CJK Compatibility Ideographs(F900–FAFF), https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
            || (character >= String.fromCharCode(65280) && character <= String.fromCharCode(65519)) //Halfwidth and Fullwidth Forms, https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block).
            || (character >= String.fromCharCode(12288) && character <= String.fromCharCode(12351)) //CJK Symbols and Punctuation, https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation
        );
    }

    private getFontScriptType(inputCharacter: string): FontScriptType {
        // Return FontScriptType as Hindi, if input character is in-between Hindi character ranges.
        if (this.isHindiChar(inputCharacter))
            return FontScriptType.Hindi;
        // Return FontScriptType as Korean, if input character is in-between Korean character ranges.
        else if (this.isKoreanChar(inputCharacter))
            return FontScriptType.Korean;
        // Return FontScriptType as Japanese, if input character is in-between Japanese character ranges.
        else if (this.isJapanese(inputCharacter))
            return FontScriptType.Japanese;
        // Return FontScriptType as Chinese, if input character is in-between Chinese character ranges.
        else if (this.isChineseChar(inputCharacter))
            return FontScriptType.Chinese;
        // Return FontScriptType as Arabic, if input character is in-between Arabic character ranges.
        else if (this.isArabicChar(inputCharacter))
            return FontScriptType.Arabic;
        // Return FontScriptType as Hebrew, if input character is in-between Hebrew character ranges.
        else if (this.isHebrewChar(inputCharacter))
            return FontScriptType.Hebrew;
        // Return FontScriptType as Thai, if input character is in-between Thai character ranges.
        else if (this.isThaiCharacter(inputCharacter))
            return FontScriptType.Thai;
        // Return FontScriptType as English, for remaining character ranges.
        else
            return FontScriptType.English;
    }

    public splitTextByFontScriptType(inputText: string, fontScriptTypes: FontScriptType[]): string[] {
        let splittedText: string[] = [];
        //Retrun the empty array, if input text is Null or Empty.
        if (isNullOrUndefined(inputText)
            || (!isNullOrUndefined(inputText) && inputText === '')) {
            return splittedText;
        }
        let text: string = '';
        let prevCharacterType: FontScriptType = FontScriptType.English;
        let currCharacterType: FontScriptType = FontScriptType.English;
        // Regex for finding a string is unicode or not.
        const surrogateRegex = /[\uD800-\uDFFF]/;
        for (let i: number = 0; i < inputText.length; i++) {
            // Gets a FontScriptType for the current character.
            // As per the Microsoft application behavior, we need to consider a space (\u0020) as previous character type.
            // So, that we can avoid a text splitting based on space character.
            if (inputText[i] != String.fromCharCode(32) && !surrogateRegex.test(inputText[i])) {
                // && !(char.IsHighSurrogate(inputText.charAt(i)) || char.IsLowSurrogate(inputText.charAt(i)))) { //Skip the setting of script type for surrogate character.
                currCharacterType = this.getFontScriptType(inputText[i]);
            }

            //Add a current text into splitted text collection, when previous character type is not equival to current type.
            if (text != '' && currCharacterType !== prevCharacterType) {
                //Add splitted text and it's FontScriptType into the collection.
                splittedText.push(text);
                fontScriptTypes.push(prevCharacterType);
                //Reset the text value.
                text = '';
            }
            //Add a current character.
            text += inputText[i];
            //Assign a current character type as previous type.
            prevCharacterType = currCharacterType;
        }
        //Add a final text.
        if (text != '') {
            //Add splitted text and it's FontScriptType into the collection.
            splittedText.push(text);
            fontScriptTypes.push(currCharacterType);
            //Reset the text value.
            text = '';
        }
        return splittedText;
    }
    public splitTextRangeByScriptType(lineIndex: number): void {
        let isField: boolean = false;
        let iIncrementer: number = 1;
        // Iterates the items for textrange in the paragraph.
        if (this.childWidgets.length > 0) {
            let lineWidget: LineWidget = this.childWidgets[lineIndex] as LineWidget;
            for (let i = lineIndex + 1; i < this.childWidgets.length; i++) {
                let nextLineWidget: LineWidget = this.childWidgets[i] as LineWidget;
                for (let m: number = 0; m < nextLineWidget.children.length; m++) {
                    let element: ElementBox = nextLineWidget.children[m];
                    lineWidget.children.push(element);
                    element.line = lineWidget;
                }
                this.childWidgets.splice(i, 1);
                i--;
            }
            for (let i: number = 0; i < lineWidget.children.length; i += iIncrementer) {
                let elementBox: ElementBox = lineWidget.children[i];
                iIncrementer = 1;

                // InlineContentControl inlineContentControl = paraItems[i] as InlineContentControl;
                // if (inlineContentControl != null)
                //     this.splitTextRangeByScriptType(inlineContentControl.ParagraphItems, splitter);

                ////Gets the span to split.
                let textElement: TextElementBox = undefined;
                if (elementBox instanceof TextElementBox) {
                    textElement = elementBox as TextElementBox;
                }
                if (elementBox instanceof FieldElementBox && elementBox.fieldType == 0) {
                    isField = true;
                } else if (elementBox instanceof FieldElementBox && elementBox.fieldType === 2) {
                    isField = false;
                }

                if (textElement != undefined && !isField) {
                    // let hasHintPath: boolean = textElement.characterFormat.IdctHint != FontHintType.Default;
                    let fontScriptTypes: FontScriptType[] = [];
                    // Split a current text part text based on FontScriptType.
                    let splitedTextCollection: string[] = this.splitTextByFontScriptType(textElement.text, fontScriptTypes);

                    if (splitedTextCollection.length > 1) {
                        for (let j: number = 0; j < splitedTextCollection.length; j++) {
                            let text: string = splitedTextCollection[j];
                            if (j > 0) {
                                //Split text range.
                                //Clone the source text range.
                                let clonedtextElement: TextElementBox = textElement.clone();
                                clonedtextElement.text = text;
                                //Sets a script type of WTextRange.
                                clonedtextElement.scriptType = fontScriptTypes[j];
                                //Insert the splitted text ranges in order.
                                lineWidget.children.splice(i + j, 0, clonedtextElement);
                                clonedtextElement.line = lineWidget;
                                iIncrementer++;
                                if (textElement.revisions.length > 0) {
                                    this.updateTextElementInRevisionRange(textElement, clonedtextElement);
                                }
                            }
                            else {
                                //Replace the source text range with splitted text.
                                textElement.text = text;
                                //Sets a script type of WTextRange.
                                textElement.scriptType = fontScriptTypes[j];
                            }
                        }
                    }
                    else if (splitedTextCollection.length > 0) {
                        //Sets a script type of WTextRange.
                        textElement.scriptType = fontScriptTypes[0];
                    }

                    // Clear the FontScriptType collection.
                    fontScriptTypes.length = 0;
                }
            }
        }
    }

    /**
     * @private
     */
    public splitLtrAndRtlText(lineIndex: number): void {
        let isPrevLTRText: LtrRtlTextInfo = { value: null };
        let iIncrementer: number = 1;
        let hasRTLCharacter: LtrRtlTextInfo = { value: null };
        let characterRangeTypes: CharacterRangeType[] = [];
        let isField: boolean = false;
        let documentHelper: DocumentHelper = this.bodyWidget.page.documentHelper;
        let textHelper: TextHelper = documentHelper.textHelper;
        if (this.childWidgets.length > 0) {
            let lineWidget: LineWidget = this.childWidgets[lineIndex] as LineWidget;
            for (let i: number = 0; i < lineWidget.children.length; i += iIncrementer) {
                let elementBox: ElementBox = lineWidget.children[i];
                iIncrementer = 1;
                ////Gets the span to split.
                let textElement: TextElementBox = undefined;
                if (elementBox instanceof TextElementBox) {
                    textElement = elementBox as TextElementBox;
                }
                if (elementBox instanceof FieldElementBox && elementBox.fieldType == 0) {
                    isField = true;
                } else if (elementBox instanceof FieldElementBox && elementBox.fieldType === 2) {
                    isField = false;
                }

                if (textElement != undefined && !isField) {
                    let text: string = textElement.text;
                    let isTextBidi: boolean = textElement.characterFormat.bidi;
                    let isRTLLang: boolean = false;
                    let charTypeIndex: number = characterRangeTypes.length;

                    if (isTextBidi) {
                        isRTLLang = textHelper.isRightToLeftLanguage(elementBox.characterFormat.localeIdBidi);
                    }

                    ////Split the text as consicutive LTR and RTL
                    let splitedTextCollection: string[] = textHelper.splitTextByConsecutiveLtrAndRtl(text, isTextBidi, isRTLLang, characterRangeTypes, isPrevLTRText, hasRTLCharacter);

                    if (splitedTextCollection.length > 1) {
                        for (let j = 0; j < splitedTextCollection.length; j++) {
                            text = splitedTextCollection[j];
                            if (j > 0) {
                                ////Clone the source span.
                                let clonedTextElement: TextElementBox = textElement.clone();
                                clonedTextElement.text = text;
                                clonedTextElement.characterRange = characterRangeTypes[j + charTypeIndex];
                                ////Inert the splitted span in order.
                                lineWidget.children.splice(i + j, 0, clonedTextElement);
                                clonedTextElement.line = lineWidget;
                                iIncrementer++;
                                if (textElement.revisions.length > 0) {
                                    this.updateTextElementInRevisionRange(textElement, clonedTextElement);
                                }
                            } else {
                                ////Replace the source span with splitted text.
                                textElement.text = text;
                                textElement.characterRange = characterRangeTypes[charTypeIndex];
                            }
                        }
                    } else if (splitedTextCollection.length > 0) {
                        textElement.characterRange = characterRangeTypes[charTypeIndex];
                    }
                }
            }
            characterRangeTypes.length = 0;
        }

    }

    private updateTextElementInRevisionRange(inline: TextElementBox, splittedElementBox: TextElementBox): void {
        for (let i: number = 0; i < inline.revisions.length; i++) {
            let revision: Revision = inline.revisions[i];
            let inlineIndex: number = revision.range.indexOf(inline);
            revision.range.splice(inlineIndex + 1, 0, splittedElementBox);
            splittedElementBox.revisions.push(revision);
            splittedElementBox.removedIds = [];
        }
    }
    /**
     * Combine the spans by consecutive LTR and RTL texts.
     * @private
     */
    public combineconsecutiveRTL(lineIndex: number) {
        let isField: boolean = false;
        let documentHelper: DocumentHelper = this.bodyWidget.page.documentHelper;
        let textHelper: TextHelper = documentHelper.textHelper;
        for (let j: number = lineIndex; j < this.childWidgets.length; j++) {
            let lineWidget: LineWidget = this.childWidgets[j] as LineWidget;
            for (let i: number = 0; i <= lineWidget.children.length - 2; i++) {
                let elementBox: ElementBox = lineWidget.children[i];
                if (elementBox instanceof FieldElementBox && elementBox.fieldType === 0) {
                    isField = true;
                } else if (elementBox instanceof FieldElementBox && elementBox.fieldType === 2) {
                    isField = false;
                }
                if (!isField && elementBox instanceof TextElementBox && lineWidget.children[i + 1] instanceof TextElementBox) {
                    let currentTxtRange: TextElementBox = elementBox;
                    let nextTxtRange: TextElementBox = lineWidget.children[i + 1] as TextElementBox;
                    // Bug 866413: Here skipped the Hewbrew script type rtl text combining, because facing element left margin issue.
                    if (((currentTxtRange.characterFormat.complexScript && currentTxtRange.scriptType == nextTxtRange.scriptType) || (currentTxtRange.characterFormat.bidi && currentTxtRange.scriptType !== FontScriptType.Hebrew
                        && currentTxtRange.characterRange == CharacterRangeType.RightToLeft && nextTxtRange.characterRange == CharacterRangeType.RightToLeft)) &&
                        currentTxtRange.text.length > 0 && nextTxtRange.text.length > 0 &&
                        !textHelper.isWordSplitChar(currentTxtRange.text[currentTxtRange.text.length - 1]) && !textHelper.isWordSplitChar(nextTxtRange.text[0])
                        && currentTxtRange.characterFormat.isEqualFormat(nextTxtRange.characterFormat) && this.compareRevisions(currentTxtRange.revisions, nextTxtRange.revisions)) {
                        currentTxtRange.text = currentTxtRange.text + nextTxtRange.text;
                        lineWidget.children.splice(i + 1, 1);
                        i--;
                    } else if (currentTxtRange.characterRange == CharacterRangeType.RightToLeft && nextTxtRange.characterRange == CharacterRangeType.RightToLeft &&
                        currentTxtRange.text.length > 0 && nextTxtRange.text.length > 0 &&
                        textHelper.isWordSplitChar(currentTxtRange.text[currentTxtRange.text.length - 1]) && textHelper.isWordSplitChar(nextTxtRange.text[0])
                        && currentTxtRange.characterFormat.isEqualFormat(nextTxtRange.characterFormat) && this.compareRevisions(currentTxtRange.revisions, nextTxtRange.revisions)) {
                        currentTxtRange.text = currentTxtRange.text + nextTxtRange.text;
                        lineWidget.children.splice(i + 1, 1);
                        i--;
                    }
                }
            }
        }
    }

    private compareRevisions(revisionA: Revision[], revisionB: Revision[]): boolean {
        if (revisionA.length !== revisionB.length) {
            return false;
        }
        for (let i: number = 0; i < revisionA.length; i++) {
            if (revisionA[i] !== revisionB[i]) {
                return false;
            }
        }
        return true;
    }

    public clone(): ParagraphWidget {
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.paragraphFormat.copyFormat(this.paragraphFormat);
        paragraph.characterFormat.copyFormat(this.characterFormat);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let line: LineWidget = this.childWidgets[i] as LineWidget;
            let cloneLine: LineWidget = line.clone();
            paragraph.childWidgets.push(cloneLine);
            for (let j: number = 0; j < cloneLine.children.length; j++) {
                let element: ElementBox = cloneLine.children[j];
                if ((element instanceof ImageElementBox && element.textWrappingStyle !== 'Inline') || element instanceof ShapeElementBox) {
                    paragraph.floatingElements.push(element);
                }
            }
            cloneLine.paragraph = paragraph;
        }
        paragraph.x = this.x;
        paragraph.y = this.y;
        paragraph.height = this.height;
        paragraph.width = this.width;
        paragraph['absoluteXPosition'] = isNullOrUndefined(this['absoluteXPosition']) ? undefined: { 'width': this['absoluteXPosition']['width'], 'x': this['absoluteXPosition']['x'] };
        if (this.contentControlProperties) {
            paragraph.contentControlProperties = this.contentControlProperties;
        }
        return paragraph;
    }
    public destroyInternal(viewer: LayoutViewer): void {
        let height: number = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let widget: LineWidget = this.childWidgets[i] as LineWidget;
                widget.destroy();
                if (this.childWidgets.length === 1 && isNullOrUndefined((this.childWidgets[0] as LineWidget).children)) {
                    this.childWidgets = undefined;
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                i--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget) && !isNullOrUndefined(this.containerWidget.childWidgets)
            && this.containerWidget.childWidgets.indexOf(this) !== -1) {
            this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
            this.containerWidget.height -= height;
            // if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
            //     && this.containerWidget instanceof BodyWidget) {
            //     // (this.containerWidget as BodyWidget).destroyInternal(viewer);
            // }
            this.containerWidget = undefined;
        }
        if (this.hasOwnProperty('absoluteXPosition')) {
            delete this['absoluteXPosition'];
        }
        this.destroy();
    }
    public destroy(): void {
        // if (this.paragraphFormat) {
        //     this.paragraphFormat.destroy();
        // }

        this.paragraphFormat = undefined;
        // if (this.characterFormat) {
        //     this.characterFormat.destroy();
        // }
        this.characterFormat = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.paragraphFormat) {
            this.paragraphFormat.destroy();
        }
        this.paragraphFormat = undefined;
        if (this.characterFormat) {
            this.characterFormat.destroy();
        }
        this.characterFormat = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class TablePosition {
    /**
     * @private
     */
    public allowOverlap: boolean;
    /**
     * @private
     */
    public distanceTop: number;
    /**
     * @private
     */
    public distanceRight: number;
    /**
     * @private
     */
    public distanceLeft: number;
    /**
     * @private
     */
    public distanceBottom: number;
    /**
    * @private
    */
    public verticalOrigin: string;
    /**
     * @private
     */
    public verticalAlignment: VerticalAlignment;
    /**
     * @private
     */
    public verticalPosition: number;
    /**
     * @private
     */
    public horizontalOrigin: string;
    /**
     * @private
     */
    public horizontalAlignment: HorizontalAlignment;
    /**
     * @private
     */
    public horizontalPosition: number;
    /**
     * @private
     */
    public clone(): TablePosition {
        let positioning: TablePosition = new TablePosition();
        positioning.allowOverlap = this.allowOverlap;
        positioning.distanceTop = this.distanceTop;
        positioning.distanceRight = this.distanceRight;
        positioning.distanceLeft = this.distanceLeft;
        positioning.distanceBottom = this.distanceBottom;
        positioning.verticalAlignment = this.verticalAlignment;
        positioning.verticalOrigin = this.verticalOrigin;
        positioning.verticalPosition = this.verticalPosition;
        positioning.horizontalAlignment = this.horizontalAlignment;
        positioning.horizontalOrigin = this.horizontalOrigin;
        positioning.horizontalPosition = this.horizontalPosition;
        return positioning;
    }
}
/** 
 * @private
 */
export class TableWidget extends BlockWidget {
    private flags: number = 0;
    /**
     * @private
     */
    public leftMargin: number = 0;
    /**
     * @private
     */
    public topMargin: number = 0;
    /**
     * @private
     */
    public rightMargin: number = 0;
    /**
     * @private
     */
    public bottomMargin: number = 0;
    /**
     * @private
     */
    public tableFormat: WTableFormat;
    /**
     * @private
     */
    public spannedRowCollection: Dictionary<number, number>;
    /**
     * @private
     */
    public tableHolder: WTableHolder;
    /**
     * @private
     */
    public headerHeight: number;
    /**
     * @private
     */
    public tableCellInfo: Dictionary<number, Dictionary<number, number>>;
    /**
     * @private
     */
    public isDefaultFormatUpdated: boolean = false;
    /**
     * @private
     */
    public wrapTextAround: boolean;
    /**
     * @private
     */
    public positioning: TablePosition;
    /**
     * @private
     */
    public isContainInsideTable: boolean = false;
    /**
     * @private
     */
    public footnoteElement: FootnoteElementBox[] = [];
    // /**
    //  * @private
    //  */
    // get length(): number {
    //     if (!isNullOrUndefined(this.nextSplitWidget)) {
    //         return 1;
    //     } else {
    //         if (isNullOrUndefined(this.previousSplitWidget)) {
    //             return 1;
    //         }
    //         return 0;
    //     }
    // }
    /**
     * @private
     */
    get isGridUpdated(): boolean {
        return ((this.flags & 0x4) >> 2) !== 0;
    }
    /**
     * @private
     */
    set isGridUpdated(value: boolean) {
        this.flags = ((this.flags & 0xFB) | ((value ? 1 : 0) << 2));
    }
    /**
     * @private
     */
    get continueHeader(): boolean {
        return ((this.flags & 0x2) >> 1) !== 0;
    }
    /**
     * @private
     */
    set continueHeader(value: boolean) {
        this.flags = ((this.flags & 0xFD) | ((value ? 1 : 0) << 1));
    }
    /**
     * @private
     */
    get header(): boolean {
        return (this.flags & 0x1) !== 0;
    }
    /**
     * @private
     */
    set header(value: boolean) {
        this.flags = ((this.flags & 0xFE) | (value ? 1 : 0));
    }

    get isBidiTable(): boolean {
        return ((this.flags & 0x10) >> 4) !== 0;
    }
    set isBidiTable(value: boolean) {
        this.flags = ((this.flags & 0xEF) | ((value ? 1 : 0) << 4));
    }


    constructor() {
        super();
        this.margin = new Margin(this.leftMargin, this.topMargin, this.rightMargin, this.bottomMargin);
        this.leftBorderWidth = 0;
        this.rightBorderWidth = 0;
        this.topBorderWidth = 0;
        this.bottomBorderWidth = 0;
        this.tableFormat = new WTableFormat(this);
        this.tableHolder = new WTableHolder();
        this.spannedRowCollection = new Dictionary<number, number>();
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        return widget instanceof TableWidget && widget.tableFormat === this.tableFormat;
    }
    /**
     * @private
     */
    public combineRows(viewer: LayoutViewer): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            if (!isNullOrUndefined(row.firstChild) && (row.firstChild as TableCellWidget).index !== 0 && row.getSplitWidgets().length === 1) {
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    (row.childWidgets[j] as TableCellWidget).index--;
                }
            }
            if (row.childWidgets.length === 0) {
                row.destroy();
                i--;
            } else {
                row.combineCells(viewer);
            }
        }
    }
    /**
     * @private
     */
    public contains(tableCell: TableCellWidget): boolean {
        if (this.equals(tableCell.ownerTable)) {
            return true;
        }
        while ((tableCell.ownerTable as BlockWidget).isInsideTable) {
            if (this.equals(tableCell.ownerTable)) {
                return true;
            }
            tableCell = tableCell.ownerTable.associatedCell;
        }
        return this.equals(tableCell.ownerTable);
    }
    /**
     * @private
     */
    public getOwnerWidth(isBasedOnViewer: boolean): number {
        let width: number = this.getContainerWidth();
        // Left and right indents should be neglected.
        width = width - this.leftIndent - this.rightIndent;
        return width >= 0 ? width : 0;
    }
    /**
     * @private
     */
    public getTableWidth(): number {
        let width: number = 0;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let rowWidth: number = 0;
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                rowWidth += (row.childWidgets[j] as TableCellWidget).cellFormat.cellWidth;
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    /**
     * @private
     */
    public getTableCellWidth(): number {
        let width: number = 0;
        for (let k: number = 0; k < this.childWidgets.length; k++) {
            let rowWidth: number = 0;
            let rowWidget: TableRowWidget = this.childWidgets[k] as TableRowWidget;
            for (let m: number = 0; m < rowWidget.childWidgets.length; m++) {
                let cellWidget: TableCellWidget = (rowWidget.childWidgets[m] as TableCellWidget);
                let cellWidth: number = cellWidget.width;
                if (cellWidth === 0) {
                    cellWidth = cellWidget.cellFormat.cellWidth;
                    if (cellWidth > cellWidget.cellFormat.preferredWidth &&
                        cellWidget.cellFormat.preferredWidth !== 0 && cellWidget.cellFormat.preferredWidthType !== 'Percent') {
                        cellWidth = cellWidget.cellFormat.preferredWidth;
                    }
                    cellWidth = HelperMethods.convertPointToPixel(cellWidth - (cellWidget.margin.left + cellWidget.margin.right));
                }
                rowWidth += (cellWidth + cellWidget.margin.left + cellWidget.margin.right);
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    /**
     * @private
     */
    public getTableClientWidth(clientWidth: number): number {
        let tableWidth: number = clientWidth;
        if (this.tableFormat.preferredWidthType === 'Point'
            && this.tableFormat.preferredWidth > 0) {
            tableWidth = this.tableFormat.preferredWidth;
        } else {
            if (this.tableFormat.preferredWidthType === 'Percent'
                && this.tableFormat.preferredWidth > 0) {
                tableWidth = tableWidth * this.tableFormat.preferredWidth / 100;
            }
        }
        return tableWidth;
    }
    /**
     * @private
     */
    public getCellWidth(preferredWidth: number, preferredWidthType: WidthType, containerWidth: number, cell: TableCellWidget): number {
        let cellWidth: number = preferredWidth;
        if (preferredWidthType === 'Percent') {
            cellWidth = (preferredWidth * containerWidth) / 100;
        } else if (preferredWidthType === 'Point') {
            cellWidth = preferredWidth;
        }
        // For grid before and grid after with auto width, no need to calculate minimum preferred width.
        else if (!isNullOrUndefined(cell)) {
            cellWidth = this.getMinimumPreferredWidth(cell);
        }
        return cellWidth;
    }

    private getMinimumPreferredWidth(cell: TableCellWidget): number {
        let defaultWidth: number = 0;
        ////For fixed table, cell width (grid column width) should be considered as default width, When the preferred cell width is zero.
        if (cell.cellFormat.preferredWidth === 0 && cell.cellFormat.cellWidth !== 0) {
            defaultWidth = cell.cellFormat.cellWidth;
        } else {
            defaultWidth = cell.getMinimumPreferredWidth();
        }
        return defaultWidth;
    }

    /**
     * @private
     */
    public fitCellsToClientArea(clientWidth: number): void {
        let tableWidth: number = this.getTableWidth();
        let factor: number = clientWidth / tableWidth;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            row.rowFormat.gridAfterWidth *= factor;
            row.rowFormat.gridBeforeWidth *= factor;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                (row.childWidgets[j] as TableCellWidget).cellFormat.cellWidth *= factor;
                (row.childWidgets[j] as TableCellWidget).cellFormat.preferredWidth *= factor;
            }
        }
    }
    /**
     * @private
     */
    public getTableCellWidget(point: Point): TableCellWidget {
        let tableCellWidget: TableCellWidget = undefined;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            if ((this.childWidgets[i] as TableRowWidget).y <= point.y
                && ((this.childWidgets[i] as TableRowWidget).y + (this.childWidgets[i] as TableRowWidget).height) >= point.y) {
                tableCellWidget = (this.childWidgets[i] as TableRowWidget).getTableCellWidget(point);
                break;
            }
        }
        return tableCellWidget;
    }

    /**
     * @private
     */
    /* eslint-disable  */
    public calculateGrid(isInsertRow?: boolean): void {
        let tempGrid: number[] = [];
        let tempSpanDecimal: number[] = [];
        let spannedCells: TableCellWidget[] = [];
        let containerWidth: number = this.getOwnerWidth(true);
        let tableWidth: number = this.getTableClientWidth(containerWidth);
        this.tableCellInfo = new Dictionary<number, Dictionary<number, number>>();
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            let rowCellInfo: Dictionary<number, number> = new Dictionary<number, number>();
            let rowFormat: WRowFormat = row.rowFormat;
            let cellWidth: number = 0;
            let columnSpan: number = row.rowFormat.gridBefore;
            let currOffset: number = 0;
            if (tempGrid.indexOf(currOffset) < 0) {
                tempGrid.push(currOffset);
                tempSpanDecimal.push(currOffset);
            }
            //Converts the row grid before width from point to twips point by 15 factor.
            cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, tableWidth, null);
            currOffset += cellWidth;
            let startOffset: number = parseFloat(currOffset.toFixed(2));
            if (tempGrid.indexOf(startOffset) < 0) {
                tempGrid.push(startOffset);
                tempSpanDecimal.push(currOffset);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < spannedCells.length; k++) {
                    if (spannedCells[k].columnIndex < columnSpan) {
                        continue;
                    }
                    let rowSpan: number = spannedCells[k].cellFormat.rowSpan;
                    let removeSpannedCell: boolean = true;
                    if (spannedCells[k].columnIndex > columnSpan) {
                        {
                            removeSpannedCell = false;
                            // If the cell is the last cell in the row and the row has grid after value..
                            if (j === row.childWidgets.length - 1 && row.rowFormat.gridAfter > 0) {
                                cellWidth = this.getCellWidth(spannedCells[k].cellFormat.preferredWidth, spannedCells[k].cellFormat.preferredWidthType, tableWidth, null);
                                currOffset += cellWidth;
                            }
                        }
                    } else {
                        // If the table gird alone calculted then column index of the rowspanned cell will be directly taken. 
                        // If the gird calculation is done from the UI level opearations such as resizing then table holder 
                        // will have the columns at that time we can get the column index from the table holder.
                        //Converts the cell width from point to twips point by 15 factor.
                        cellWidth = this.getCellWidth(spannedCells[k].cellFormat.preferredWidth, spannedCells[k].cellFormat.preferredWidthType, tableWidth, null);
                        currOffset += cellWidth;
                        columnSpan = spannedCells[k].columnIndex + spannedCells[k].cellFormat.columnSpan;
                    }
                    if (!removeSpannedCell && j === row.childWidgets.length - 1) {
                        removeSpannedCell = true;
                    }
                    if (removeSpannedCell && i - spannedCells[k].ownerRow.rowIndex === rowSpan - 1) {
                        spannedCells.splice(k, 1);
                        k--;
                    }
                }
                // At the start of each row, we will process the row spanned cells to get the start column index.
                // To calculate grid properly, we need the items in the spanned cells collection in the order of their column index
                if (cell.cellFormat.rowSpan > 1) {
                    if (spannedCells.length === 0 || spannedCells[spannedCells.length - 1].columnIndex <= columnSpan) {
                        spannedCells.push(cell);
                    }
                    else {
                        for (let m: number = spannedCells.length; m > 0; m--) {
                            if (spannedCells[m - 1].columnIndex > columnSpan) {
                                spannedCells.splice(m - 1, 0, cell);
                            }
                        }
                    }
                }
                // Add start offset of each cell based on its index
                if (!rowCellInfo.containsKey(cell.cellIndex)) {
                    rowCellInfo.add(cell.cellIndex, parseFloat((currOffset - startOffset).toFixed(2)));
                }
                columnSpan += cell.cellFormat.columnSpan;
                //Converts the cell width from pixel to twips point by 15 factor.
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, null);
                currOffset += cellWidth;
                let offset: number = parseFloat(currOffset.toFixed(2));
                if (tempGrid.indexOf(offset) < 0) {
                    tempGrid.push(offset);
                    tempSpanDecimal.push(currOffset);
                }

                if (j === row.childWidgets.length - 1 && rowFormat.gridAfter > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    currOffset += cellWidth;

                    if (tempGrid.indexOf(parseFloat(currOffset.toFixed(2))) < 0) {
                        tempGrid.push(parseFloat(currOffset.toFixed(2)));
                        tempSpanDecimal.push(currOffset);
                    }
                    columnSpan += rowFormat.gridAfter;
                }
                // Add rowindex and its cells info for each row
                if (!this.tableCellInfo.containsKey(row.rowIndex)) {
                    this.tableCellInfo.add(row.rowIndex, rowCellInfo);
                }
            }
        }
        tempGrid.sort((a: number, b: number) => { return a - b; });
        tempSpanDecimal.sort((a: number, b: number) => { return a - b; });
        if (this.tableHolder.columns.length > 0 && (tempGrid.length - 1 !== this.tableHolder.columns.length || isInsertRow)) {
            this.updateColumnSpans(tempGrid, tableWidth, tempSpanDecimal);
        }
        this.tableCellInfo.clear();
        this.tableCellInfo = undefined;
    }
    private updateColumnSpans(tempGrid: number[], containerWidth: number, tempSpan: number[]): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.gridBeforeWidth >= 0) {
                row.rowFormat.gridBefore = row.getGridCount(tempGrid, undefined, -1, containerWidth, tempSpan);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let columnSpan: number = row.getGridCount(tempGrid, cell, cell.getIndex(), containerWidth, tempSpan);
                if (columnSpan > 0 && cell.cellFormat.columnSpan !== columnSpan) {
                    cell.cellFormat.columnSpan = columnSpan;
                }
            }
            if (row.rowFormat.gridAfterWidth >= 0) {
                row.rowFormat.gridAfter = row.getGridCount(tempGrid, undefined, row.childWidgets.length, containerWidth, tempSpan);
            }
        }
    }
    /**
     * @private
     */
    public getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo {
        this.checkTableColumns();
        let isAllColumnHasPointWidth: boolean = this.tableHolder.isAllColumnHasPointWidthType();
        let tableWidth: number = isAllColumnHasPointWidth ? this.tableHolder.getTotalWidth(0) : this.tableHolder.getTotalWidth(1);
        if (tableWidth > minimumWordWidth) {
            minimumWordWidth = tableWidth;
        }
        if (!isAllColumnHasPointWidth) {
        tableWidth = this.tableHolder.getTotalWidth(2);
        }
        if (tableWidth > maximumWordWidth) {
            maximumWordWidth = tableWidth;
        }
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    }
    /**
     * @private
     */
    public checkTableColumns(): void {
        if (this.isGridUpdated) {
            return;
        }
        let isAutoFit: boolean = this.isAutoFit();
        if (isAutoFit || this.tableHolder.columns.length === 0) {
            this.buildTableColumns();
        }
        this.isGridUpdated = false;
    }
    /**
     * @private
     */
    public isAutoFit(): boolean {
        let bodyWidget: BlockContainer = this.bodyWidget;
        if (!isNullOrUndefined(bodyWidget) && !isNullOrUndefined(bodyWidget.page)) {
            return bodyWidget.page.documentHelper.layout.getParentTable(this).tableFormat.allowAutoFit;
        }
        return false;
    }

    /**
     * @private
     */
    public buildTableColumns(): void {
        if (this.isGridUpdated) {
            return;
        }
        // Clear existing columns in order to start creating columns freshly.
        this.tableHolder.resetColumns();
        let containerWidth: number = 0;
        let tableWidth: number = 0;
        let rowSpannedCells: TableCellWidget[] = [];
        /* eslint-disable-next-line max-len */
        let isAutoWidth: boolean = (this.tableFormat.preferredWidthType === 'Auto' || (this.tableFormat.preferredWidthType === "Point" && this.tableFormat.preferredWidth === 0));
        let isAutoFit: boolean = this.tableFormat.allowAutoFit;
        // For continuous layout, window width should be considered. 
        // If preferred width exceeds this limit, it can take upto maximum of 2112 pixels (1584 points will be assigned by Microsoft Word).
        if (((!isNullOrUndefined(this.bodyWidget.page)) && this.bodyWidget.page.viewer instanceof WebLayoutViewer && isAutoFit && !this.isInsideTable && !(this.containerWidget instanceof TextFrame))) {
            containerWidth = HelperMethods.convertPixelToPoint(this.bodyWidget.page.viewer.clientArea.width - this.bodyWidget.page.viewer.padding.right * 3);
        } else {
            containerWidth = this.getOwnerWidth(true);
        }
        containerWidth = (this.tableFormat.preferredWidth > containerWidth) ? this.tableFormat.preferredWidth : containerWidth;
        let isZeroWidth: boolean = (isAutoWidth && this.tableFormat.preferredWidth === 0 && !isAutoFit);
        tableWidth = this.getTableClientWidth(containerWidth);
        let pageContainerWidth = this.getContainerWidth();
        if (isZeroWidth && !this.isDefaultFormatUpdated && isAutoFit) {
            this.splitWidthToTableCells(tableWidth, isZeroWidth);
        }
        let hasSpannedCells: boolean = false;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            let rowFormat: WRowFormat = row.rowFormat;
            let columnSpan: number = 0;
            let cellWidth: number = 0;
            let sizeInfo: ColumnSizeInfo = new ColumnSizeInfo();
            let offset: number = 0;
            if (rowFormat.gridBefore > 0 && (row.rowFormat.beforeWidth !== 0 || row.rowFormat.gridBeforeWidth !== 0) && ((this.bodyWidget.page.documentHelper.alignTablesRowByRow) ? row.ownerTable.tableFormat.tableAlignment === 'Left' || (this.bodyWidget.page.documentHelper.compatibilityMode === 'Word2003' && (row.ownerTable.firstChild as TableRowWidget).rowFormat.gridAfter > 0) : true)) {
                cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, row.rowFormat.gridAfterWidthType, tableWidth, null);
                sizeInfo.minimumWidth = cellWidth;
                this.tableHolder.addColumns(columnSpan, columnSpan = rowFormat.gridBefore, cellWidth, sizeInfo, offset = cellWidth, 'Point');
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                if (cell.cellFormat.rowSpan > 1 || cell.cellFormat.columnSpan > 1) {
                    hasSpannedCells = true;
                }
                if (rowSpannedCells.length === 0) {
                    cell.columnIndex = columnSpan;
                }
                for (let k: number = 0; k < rowSpannedCells.length; k++) {
                    let rowSpannedCell: TableCellWidget = rowSpannedCells[k];
                    if (rowSpannedCell.columnIndex < columnSpan) {
                        cell.columnIndex = columnSpan;
                        continue;
                    }
                    let rowSpan: number = 1;
                    let removeSpannedCell: boolean = true;
                    rowSpan = rowSpannedCell.cellFormat.rowSpan;
                    if (rowSpannedCell.columnIndex > columnSpan) {
                        cell.columnIndex = columnSpan;
                        removeSpannedCell = false;
                    }
                    else {
                        sizeInfo = rowSpannedCell.getCellSizeInfo(isAutoFit);
                        cellWidth = this.getCellWidth(rowSpannedCell.cellFormat.preferredWidth, rowSpannedCell.cellFormat.preferredWidthType, tableWidth, rowSpannedCell);
                        // If the table gird alone calculated then column index of the rowspanned cell will be directly taken. 
                        // If the gird calculation is done from the UI level operations such as resizing then table holder will have the columns at that time we can get the column index from the table holder.
                        if (this.tableHolder.columns.length > 0) {
                            this.tableHolder.addColumns(columnSpan, columnSpan = this.tableHolder.columns.indexOf(rowSpannedCell.ownerColumn) + rowSpannedCell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth, cell.cellFormat.preferredWidthType);
                            cell.columnIndex = columnSpan;
                        } else {
                            this.tableHolder.addColumns(columnSpan, columnSpan = rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth,  cell.cellFormat.preferredWidthType);
                            cell.columnIndex = columnSpan;
                        }
                    }
                    if (!removeSpannedCell && j === row.childWidgets.length - 1) {
                        removeSpannedCell = true;
                    }
                    if (removeSpannedCell && i - rowSpannedCell.ownerRow.rowIndex === rowSpan - 1) {
                        rowSpannedCells.splice(k, 1);
                        k--;
                    }
                }
                // At the start of each row, we will process the row spanned cells to get the start column index.
                // To calculate grid properly, we need the items in the spanned cells collection in the order of their column index
                if (cell.cellFormat.rowSpan > 1) {
                    if (rowSpannedCells.length === 0 || rowSpannedCells[rowSpannedCells.length - 1].columnIndex <= columnSpan) {
                        rowSpannedCells.push(cell);
                    } else {
                        let insertIndex: number = 0;
                        for (let m: number = rowSpannedCells.length; m > 0; m--) {
                            if (rowSpannedCells[m - 1].columnIndex > columnSpan) {
                                insertIndex = m - 1;
                            }
                        }
                        rowSpannedCells.splice(insertIndex, 0, cell);
                    }
                }
                sizeInfo = cell.getCellSizeInfo(isAutoFit);
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, cell);
                this.tableHolder.addColumns(columnSpan, columnSpan += cell.cellFormat.columnSpan, cellWidth, sizeInfo, offset += cellWidth, cell.cellFormat.preferredWidthType);
                if (j === row.childWidgets.length - 1 && rowFormat.gridAfterWidth > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    sizeInfo.minimumWordWidth = sizeInfo.maximumWordWidth = sizeInfo.minimumWidth = cellWidth;
                    this.tableHolder.addColumns(columnSpan, columnSpan += rowFormat.gridAfter, cellWidth, sizeInfo, offset += cellWidth, 'Point');
                }
            }
        }
        if (isZeroWidth && !this.isDefaultFormatUpdated) {
            this.isDefaultFormatUpdated = true;
        }
        this.tableHolder.validateColumnWidths();
        if (isAutoFit) {
            // Fits the column width automatically based on contents.
            this.tableHolder.autoFitColumn(containerWidth, tableWidth, isAutoWidth, this.isInsideTable, isAutoFit, hasSpannedCells, this.leftIndent + this.rightIndent, pageContainerWidth);
        } else {
            // Fits the column width based on preferred width. i.e. Fixed layout.
            this.tableHolder.fitColumns(containerWidth, tableWidth, isAutoWidth, isAutoFit, this.leftIndent + this.rightIndent);
        }
        // if (!isAutoFit && isAutoWidth) {
        //     tableWidth = this.tableHolder.tableWidth;
        // }
        //Sets the width to cells
        this.setWidthToCells(tableWidth, isAutoWidth);
    }

    /**
     * @private
     */
    public setWidthToCells(tableWidth: number, isAutoWidth: boolean): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let rw: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            let rowFormat: WRowFormat = rw.rowFormat;
            if (rowFormat.gridBefore > 0) {
                rowFormat.beforeWidth = this.tableHolder.getCellWidth(0, rowFormat.gridBefore, tableWidth);
            }
            for (let j: number = 0; j < rw.childWidgets.length; j++) {
                let cell: TableCellWidget = rw.childWidgets[j] as TableCellWidget;
                cell.cellFormat.cellWidth = this.tableHolder.getCellWidth(cell.columnIndex, cell.cellFormat.columnSpan, tableWidth);
                //By default, if cell preferred widthType is auto , width set based on table width and type is changed to 'Point'
            }
            if (rowFormat.gridAfter > 0) {
                rowFormat.afterWidth = this.tableHolder.getCellWidth(0, rowFormat.gridAfter, tableWidth);
            }
        }
    }
    /**
     * @private
     */
    public updateProperties(updateAllowAutoFit: boolean, currentSelectedTable: TableWidget, autoFitBehavior: AutoFitType): void {
        if (updateAllowAutoFit) {
            this.tableFormat.allowAutoFit = autoFitBehavior !== 'FixedColumnWidth';
        }
        if (this !== currentSelectedTable) {
            currentSelectedTable.updateProperties(false, currentSelectedTable, autoFitBehavior);
            return;
        }
        if (autoFitBehavior === 'FixedColumnWidth') {
            // Clear the table widths and set the preferred width for cells.
            this.tableFormat.preferredWidth = 0;
            this.tableFormat.preferredWidthType = 'Auto';
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let rowWidget: TableRowWidget = this.childWidgets[i] as TableRowWidget;
                for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                    let cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                    cellWidget.cellFormat.preferredWidthType = 'Point';
                    cellWidget.cellFormat.preferredWidth = cellWidget.cellFormat.cellWidth;
                }
            }
        } else if (autoFitBehavior === 'FitToWindow') {
            // Set the preferred width for table and cells in percentage.
            let tableWidth: number = this.tableHolder.getTotalWidth(0);
            this.tableFormat.leftIndent = 0;
            this.tableFormat.preferredWidth = 100;
            this.tableFormat.preferredWidthType = 'Percent';
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
                for (let z: number = 0; z < row.childWidgets.length; z++) {
                    let cell: TableCellWidget = row.childWidgets[z] as TableCellWidget;
                    if (cell.cellFormat.preferredWidthType !== 'Percent') {
                        cell.cellFormat.preferredWidthType = 'Percent';
                        cell.cellFormat.preferredWidth = (cell.cellFormat.cellWidth / tableWidth) * 100;
                    }
                }
            }
        } else {
            // Clear the preferred width for table and cells.
            this.tableFormat.preferredWidth = 0;
            this.tableFormat.preferredWidthType = 'Auto';
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
                row.rowFormat.beforeWidth = 0;
                row.rowFormat.gridBefore = 0;
                row.rowFormat.gridBeforeWidth = 0;
                row.rowFormat.gridBeforeWidthType = 'Auto';
                row.rowFormat.afterWidth = 0;
                row.rowFormat.gridAfter = 0;
                row.rowFormat.gridAfterWidth = 0;
                row.rowFormat.gridAfterWidthType = 'Auto';
                for (let j: number = 0; j < row.childWidgets.length; j++) {
                    let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                    cell.cellFormat.preferredWidth = 0;
                    cell.cellFormat.preferredWidthType = 'Auto';
                }
            }
        }
    }

    /**
     * @private
     */
    public getMaxRowWidth(clientWidth: number): number {
        let width: number = 0;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            let rowWidth: number = 0;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                rowWidth += this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, clientWidth, cell);
            }
            if (width < rowWidth) {
                width = rowWidth;
            }
        }
        return width;
    }
    /**
     * @private
     */
    public updateWidth(dragValue: number): void {
        let totalPreferredWidth: number = this.tableHolder.getTotalWidth(0);
        let ownerWidth: number = this.getOwnerWidth(true);
        let containerWidth: number = this.getTableClientWidth(ownerWidth);
        if (containerWidth <= totalPreferredWidth) {
            if (this.tableFormat.preferredWidthType === 'Auto') {
                this.tableFormat.preferredWidthType = 'Point';
            }
        }
        if (this.tableFormat.preferredWidthType !== 'Auto') {
            if (this.tableFormat.preferredWidthType === 'Point') {
                this.tableFormat.preferredWidth = this.getMaxRowWidth(containerWidth);
            } else {   //ToDo:Need to analyze more the Percentage calculation for table width.
                let value: number = (totalPreferredWidth / ownerWidth) * 100;
                this.tableFormat.preferredWidth = value;
            }
        }
    }
    /**
     * @private
     */
    public convertPointToPercent(tablePreferredWidth: number, ownerWidth: number): number {
        let value: number = 0;
        value = (tablePreferredWidth / ownerWidth) * 100;
        value = Math.round(value);
        return value < 100 ? value : 100; // The value should be lesser than or equal to 100%;
    }

    public updateChildWidgetLeft(left: number, updateLeftIndent?: boolean): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            rowWidget.x = left;
            rowWidget.updateChildWidgetLeft(left, updateLeftIndent);
        }
    }

    /**
     * Shift the widgets for right to left aligned table.
     * @private
     */
    public shiftWidgetsForRtlTable(clientArea: Rect, tableWidget: TableWidget): void {
        let clientAreaX: number = tableWidget.x;
        let clientAreaRight: number = clientArea.right;
        let cellSpace: number = 0;

        if (tableWidget.tableFormat && tableWidget.tableFormat.cellSpacing > 0) {
            cellSpace = tableWidget.tableFormat.cellSpacing;
        }

        for (let i: number = 0; i < tableWidget.childWidgets.length; i++) {
            let rowWidget: TableRowWidget = tableWidget.childWidgets[i] as TableRowWidget;
            let rowX: number = rowWidget.x;
            let left: number = clientAreaRight - (rowX - clientAreaX);
            for (let j: number = 0; j < rowWidget.childWidgets.length; j++) {
                let cellWidget: TableCellWidget = rowWidget.childWidgets[j] as TableCellWidget;
                left = left -
                    (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right - cellWidget.rightBorderWidth + cellSpace);
                cellWidget.updateWidgetLeft(left + cellWidget.margin.left);
            }
        }
    }
    /**
     * @private
     */
    public clone(): TableWidget {
        let table: TableWidget = new TableWidget();
        table.tableHolder = this.tableHolder.clone();
        table.tableFormat.copyFormat(this.tableFormat);
        if (this.wrapTextAround) {
            table.wrapTextAround = this.wrapTextAround;
            table.positioning = this.positioning.clone();
        }
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = (this.childWidgets[i] as TableRowWidget).clone();
            table.childWidgets.push(row);
            row.containerWidget = table;
            row.index = i;
        }
        table.x = this.x;
        table.y = this.y;
        table.height = this.height;
        table.width = this.width;
        table.isBidiTable = this.isBidiTable;
        table.containerWidget = this.containerWidget;
        if (this.contentControlProperties) {
            table.contentControlProperties = this.contentControlProperties;
        }
        return table;
    }
    /**
     * @private
     */
    public static getTableOf(node: WBorders): TableWidget {
        if (node instanceof WBorders) {
            let row: TableRowWidget = TableRowWidget.getRowOf(node);
            if (!isNullOrUndefined(row)) {
                return row.ownerTable;
            } else if (node.ownerBase instanceof WTableFormat && (node.ownerBase as WTableFormat).ownerBase instanceof TableWidget) {
                return (node.ownerBase as WTableFormat).ownerBase as TableWidget;
            } else {
                return undefined;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public fitChildToClientArea(): void {
        let clientWidth: number = this.getContainerWidth();
        if (Math.round(clientWidth) < Math.round(this.getTableWidth())) {
            this.fitCellsToClientArea(clientWidth);
        }
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                for (let k: number = 0; k < cell.childWidgets.length; k++) {
                    if (cell.childWidgets[k] instanceof TableWidget) {
                        (cell.childWidgets[k] as TableWidget).fitChildToClientArea();
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    public getColumnCellsForSelection(startCell: TableCellWidget, endCell: TableCellWidget): TableCellWidget[] {
        let cells: TableCellWidget[] = [];
        let start: number = startCell.columnIndex;
        let end: number = endCell.columnIndex + endCell.cellFormat.columnSpan;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let columnIndex: number = cell.columnIndex;
                let columnSpan: number = cell.cellFormat.columnSpan;
                if ((columnIndex + columnSpan > start && columnIndex + columnSpan < end) || (columnIndex > start && columnIndex < end)) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
                else if ((columnIndex > start && columnIndex < end && columnIndex + columnSpan < end)
                    || (columnIndex < start && columnIndex + columnSpan > end)) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
                else if (columnIndex === start || columnIndex + columnSpan === end) {
                    if (cells.indexOf(cell) < 0) {
                        cells.push(cell);
                    }
                }
            }
        }
        return cells;
    }
    /**
     * Splits width equally for all the cells.
     * @param tableClientWidth 
     * @private
     */
    public splitWidthToTableCells(tableClientWidth: number, isZeroWidth?: boolean): void {
        for (let row: number = 0; row < this.childWidgets.length; row++) {
            (this.childWidgets[row] as TableRowWidget).splitWidthToRowCells(tableClientWidth, isZeroWidth);
        }
    }
    /**
     * @private
     */
    public insertTableRowsInternal(tableRows: TableRowWidget[], startIndex: number, isInsertRow?: boolean): void {
        for (let i: number = tableRows.length - 1; i >= 0; i--) {
            let row: TableRowWidget = tableRows.splice(i, 1)[0] as TableRowWidget;
            row.containerWidget = this;
            this.childWidgets.splice(startIndex, 0, row);
        }
        this.updateRowIndex(startIndex);
        this.isGridUpdated = false;
        if (isInsertRow) {
            this.calculateGrid(true);
            this.buildTableColumns();
        }
        this.isGridUpdated = true;
    }
    /**
     * @private
     */
    public updateRowIndex(startIndex: number): void {
        for (let i: number = startIndex; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = (this.childWidgets[i] as TableRowWidget);
            row.index = i;
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                (row.childWidgets[j] as TableCellWidget).index = j;
                (row.childWidgets[j] as TableCellWidget).rowIndex = row.rowIndex;
            }
            startIndex++;
        }
    }
    /**
     * @private
     */
    public getCellStartOffset(cell: TableCellWidget): number {
        let offset: number = 0;
        if (cell && this.tableCellInfo) {
            if (this.tableCellInfo.containsKey(cell.ownerRow.rowIndex)) {
                let rowCellInfo: Dictionary<number, number> = this.tableCellInfo.get(cell.ownerRow.rowIndex);
                if (rowCellInfo.containsKey(cell.cellIndex)) {
                    offset = rowCellInfo.get(cell.cellIndex);
                }
            }
        }
        return offset;
    }
    /**
     * @private
     */
    public destroyInternal(viewer: LayoutViewer): void {
        let height: number = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (let j: number = 0; j < this.childWidgets.length; j++) {
                let widget: TableRowWidget = undefined;
                let childWidget: IWidget = this.childWidgets[j];
                widget = childWidget as TableRowWidget;
                if (!isNullOrUndefined(widget)) {
                    widget.destroyInternal(viewer);
                }
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                j--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget)) {
            if (this.containerWidget instanceof BodyWidget) {
                if (this.containerWidget.floatingElements.indexOf(this) !== -1) {
                    this.containerWidget.floatingElements.splice(this.containerWidget.floatingElements.indexOf(this), 1);
                }
            }
            if (!isNullOrUndefined(this.containerWidget.childWidgets)) {
                if (this.containerWidget.childWidgets.indexOf(this) !== -1) {
                    this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
                }
                this.containerWidget.height -= height;
                // if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
                //     && this.containerWidget instanceof BodyWidget) {
                //     // (this.containerWidget as BodyWidget).destroyInternal(viewer);
                // }
            }
            this.containerWidget = undefined;
        }
        this.destroy();
    }
    /**
     * @private
     */
    public destroy(): void {
        // if (this.tableFormat) {
        //     this.tableFormat.destroy();
        // }
        this.tableFormat = undefined;
        if (this.spannedRowCollection) {
            this.spannedRowCollection.destroy();
        }
        this.spannedRowCollection = undefined;
        // if (this.tableHolder) {
        //     this.tableHolder.destroy();
        // }
        this.tableHolder = undefined;
        this.flags = undefined;
        this.leftMargin = undefined;
        this.topMargin = undefined;
        this.rightMargin = undefined;
        this.bottomMargin = undefined;
        this.headerHeight = undefined;
        this.isDefaultFormatUpdated = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.tableFormat) {
            this.tableFormat.destroy();
        }
        this.tableFormat = undefined;
        if (this.spannedRowCollection) {
            this.spannedRowCollection.destroy();
        }
        this.spannedRowCollection = undefined;
        if (this.tableHolder) {
            this.tableHolder.destroy();
        }
        this.tableHolder = undefined;
        this.flags = undefined;
        this.leftMargin = undefined;
        this.topMargin = undefined;
        this.rightMargin = undefined;
        this.bottomMargin = undefined;
        this.headerHeight = undefined;
        this.isDefaultFormatUpdated = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class TableRowWidget extends BlockWidget {
    /**
     * @private
     */
    public topBorderWidth: number;
    /**
     * @private
     */
    public bottomBorderWidth: number;
    /**
     * @private
     */
    public rowFormat: WRowFormat;
    /**
     * @private
     */
    public contentControlProperties: ContentControlProperties;
    /**
     * @private
     */
    public isRenderBookmarkEnd: boolean = false;
    /**
     * @private
     */
    public editRangeID: Dictionary<number, ElementBox>;
    // /**
    //  * @private
    //  */
    // get length(): number {
    //     if (!isNullOrUndefined(this.nextSplitWidget)) {
    //         return 1;
    //     } else {
    //         if (isNullOrUndefined(this.previousSplitWidget)) {
    //             return 1;
    //         }
    //         return 0;
    //     }
    // }
    /**
     * @private
     */
    get rowIndex(): number {
        if (this.containerWidget) {
            return this.containerWidget.childWidgets.indexOf(this);
        }
        return -1;
    }
    /**
     * @private
     */
    get ownerTable(): TableWidget {
        if (this.containerWidget instanceof TableWidget) {
            return this.containerWidget;
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextRow(): TableRowWidget {
        let index: number = this.indexInOwner;
        if (index > -1 && index < this.ownerTable.childWidgets.length - 1) {
            return this.ownerTable.childWidgets[index + 1] as TableRowWidget;
        }
        return undefined;
    }
    constructor() {
        super();
        this.topBorderWidth = 0;
        this.bottomBorderWidth = 0;
        this.rowFormat = new WRowFormat(this);
        this.editRangeID = new Dictionary<number, ElementBox>();
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        return widget instanceof TableRowWidget && widget.rowFormat === this.rowFormat;
    }
    /**
     * @private
     */
    public combineCells(viewer: LayoutViewer): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            cell.combineWidget(viewer);
            if (!isNullOrUndefined(cell.cellFormat) && cell.cellFormat.rowSpan === 1) {
                let cellHeight: number = cell.height + cell.margin.top + cell.margin.bottom;
                if ((this.height - this.ownerTable.tableFormat.cellSpacing) < cell.height) {
                    this.height = this.ownerTable.tableFormat.cellSpacing + cell.height;
                }
            } else if (isNullOrUndefined(cell.cellFormat)) {
                i--;
            }
        }
    }
    /**
     * @private
     */
    public static getRowOf(node: WBorders): TableRowWidget {
        if (node instanceof WBorders) {
            let cell: TableCellWidget = TableCellWidget.getCellOf(node);
            if (!isNullOrUndefined(cell)) {
                return cell.ownerRow;
            } else if (node.ownerBase instanceof WRowFormat && (node.ownerBase as WRowFormat).ownerBase instanceof TableRowWidget) {
                return (node.ownerBase as WRowFormat).ownerBase as TableRowWidget;
            } else {
                return undefined;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getCell(rowIndex: number, columnIndex: number, cellIndex?: number): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            if (cell.rowIndex === rowIndex && (!isNullOrUndefined(cellIndex) ? cell.cellIndex === cellIndex : cell.columnIndex === columnIndex)) {
                return cell;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getCellUsingColumnIndex(rowIndex: number, columnIndex: number): TableCellWidget {
        let cell: TableCellWidget;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            cell = this.childWidgets[i] as TableCellWidget;
            if (cell.rowIndex === rowIndex && cell.columnIndex === columnIndex) {
                return cell;
            }
        }
        cell = this.getCell(rowIndex, columnIndex);
        if(!isNullOrUndefined(cell)){
            return cell;
        }
        return undefined;
    }
    /**
     * @private
     */
    public splitWidthToRowCells(tableClientWidth: number, isZeroWidth?: boolean): void {
        let cells: TableCellWidget[] = this.childWidgets as TableCellWidget[];
        let cellWidth: number = tableClientWidth / cells.length;
        for (let cell: number = 0; cell < cells.length; cell++) {
            if (isZeroWidth && cells[cell].cellFormat.preferredWidth === 0) {
                cells[cell].cellFormat.preferredWidth = cellWidth;
                this.ownerTable.isDefaultFormatUpdated = false;
            } else if (isZeroWidth) {
                this.ownerTable.isDefaultFormatUpdated = true;
                break;
            } else {
                cells[cell].cellFormat.preferredWidth = cellWidth;
            }
        }
    }
    /**
     * @private
     */
    public getGridCount(tableGrid: number[], cell: TableCellWidget, index: number, containerWidth: number, tempSpan: number[]): number {
        let prevOffset: number = 0; let width: number = 0;
        let ownerTable: TableWidget = this.ownerTable;
        let rowFormat: WRowFormat = this.rowFormat;
        if (index === -1) {
            width = ownerTable.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, containerWidth, null);
        }
        else {
            prevOffset += ownerTable.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, containerWidth, null);
            if (index >= 0) {
                prevOffset += ownerTable.getCellStartOffset(cell);
            }
            if (index < this.childWidgets.length) {
                width = ownerTable.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, containerWidth, null);
            } else {
                width = ownerTable.getCellWidth(rowFormat.gridAfterWidth, rowFormat.gridAfterWidthType, containerWidth, null);
            }
        }
        let tabIndex: number = tableGrid.indexOf(prevOffset);
        let tabGrid: number = tempSpan[tabIndex];
        let gridEndIndex: number;
        let gridStartIndex: number = this.getOffsetIndex(tableGrid, prevOffset);
        let gridWidth: number = parseFloat((width + prevOffset).toFixed(2));
        let gridDecimalWidth: number = parseFloat((width + tabGrid).toFixed(2))
        if (gridDecimalWidth !== gridWidth && !isNullOrUndefined(tabGrid)) {
            gridEndIndex = this.getOffsetIndex(tableGrid, tabGrid + width);
        } else {
            gridEndIndex = this.getOffsetIndex(tableGrid, prevOffset + width);
        }
        return gridEndIndex - gridStartIndex;
    }
    private getOffsetIndex(tableGrid: number[], offset: number): number {
        offset = parseFloat(offset.toFixed(2));
        let index: number = 0;
        if (tableGrid.indexOf(offset) >= 0) {
            index = tableGrid.indexOf(offset);
        } else {
            for (let i: number = 0; i < tableGrid.length; i++) {
                if (tableGrid[i] > offset) {
                    return i;
                }
            }
            index = tableGrid.length - 1;
        }
        return index;
    }

    private getCellOffset(index: number, containerWidth: number): number {
        let prevOffset: number = 0;
        let ownerTable: TableWidget = this.ownerTable;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cellFormat: WCellFormat = (this.childWidgets[i] as TableCellWidget).cellFormat;
            if (i === index) {
                break;
            }
            prevOffset += ownerTable.getCellWidth(cellFormat.preferredWidth, cellFormat.preferredWidthType, containerWidth, null);
        }
        return prevOffset;
    }
    /**
     * @private
     */
    public updateRowBySpannedCells(): void {
        let rowSpannedCells: TableCellWidget[] = this.getPreviousRowSpannedCells();
        let currentRowIndex: number = this.rowIndex;
        for (let i: number = 0; i < rowSpannedCells.length; i++) {
            let spannedCell: TableCellWidget = rowSpannedCells[i];
            let rowSpanEnd: number = spannedCell.ownerRow.rowIndex + spannedCell.cellFormat.rowSpan - 1;
            // If current row is row span end or includes spanned cells. then, decrease the rowspan
            if (rowSpanEnd >= currentRowIndex) {
                spannedCell.cellFormat.rowSpan -= 1;
            }
        }
    }
    /**
     * @private
     */
    public getPreviousRowSpannedCells(include?: boolean): TableCellWidget[] {
        let rowSpannedCells: TableCellWidget[] = [];
        let row: TableRowWidget = include ? this : this.previousWidget as TableRowWidget;
        while (!isNullOrUndefined(row)) {
            for (let i: number = 0; i < row.childWidgets.length; i++) {
                let cell: TableCellWidget = row.childWidgets[i] as TableCellWidget;
                if (cell.cellFormat.rowSpan > 1) {
                    rowSpannedCells.splice(0, 0, cell);
                }
            }
            row = row.previousWidget as TableRowWidget;
        }
        return rowSpannedCells;
    }
    /**
     * @private
     */
     public isCellsHaveSameWidthUnit():boolean {
        if(this.childWidgets.length > 0){
            var firstCellWidthUnit = (this.childWidgets[0] as TableCellWidget).cellFormat.preferredWidthType;
        for (let i: number = 1; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            if (firstCellWidthUnit != cell.cellFormat.preferredWidthType) {
                return false;
            }
        }
        }
        return true;
    }
    /**
     * @private
     */
    public updateUniformWidthUnitForCells():void{
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            cell.cellFormat.preferredWidthType = "Point";
            cell.cellFormat.preferredWidth = cell.cellFormat.cellWidth;
        }
    }
    /**
     * @private
     */
    public getTableCellWidget(point: Point): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let x: number = Math.round((this.childWidgets[i] as TableCellWidget).x);
            if (x - (this.childWidgets[i] as TableCellWidget).margin.left - 1 <= point.x
                && (x + (this.childWidgets[i] as TableCellWidget).width) >= point.x) {
                return (this.childWidgets[i] as TableCellWidget);
            } else if (i === this.childWidgets.length - 1
                && ((this.childWidgets[i] as TableCellWidget).x + (this.childWidgets[i] as TableCellWidget).width) + 1 <= point.x) {
                return (this.childWidgets[i] as TableCellWidget);
            }
        }
        let cellWidget: TableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if ((this.childWidgets[0] as Widget).x <= point.x) {
                cellWidget = (this.childWidgets[this.childWidgets.length - 1] as Widget).getTableCellWidget(point);
            } else {
                cellWidget = (this.childWidgets[0] as Widget).getTableCellWidget(point);
            }
        }
        return cellWidget;
    }
    /**
     * @private
     */
    public getFirstRowWidth(): number {
        let width: number = 0;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            width += (this.childWidgets[i] as TableCellWidget).getCellWidth(this.ownerTable);
        }
        return width;
    }
    /**
     * @private
     */
    public getCellWidget(columnIndex: number, columnSpan: number): TableCellWidget {
        let tableHolder: WTableHolder = this.ownerTable.tableHolder;
        let index: number = tableHolder.getValidColumnIndex(columnIndex);
        if(index > columnIndex)
        {
            columnSpan -= index - columnIndex;
            columnIndex = index;
        }
        let colIndex: number = 0;
        if (this.rowFormat.gridBefore > 0) {
            colIndex += this.rowFormat.gridBefore;
        }
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            let colSpan: number = cell.cellFormat.columnSpan;
            if (colIndex < cell.columnIndex && (colIndex <= columnIndex || colIndex < columnIndex + columnSpan)
                && cell.columnIndex > columnIndex) {
                return null;
            }
            if ((cell.columnIndex <= columnIndex || cell.columnIndex < columnIndex + columnSpan)
                && cell.columnIndex + colSpan > columnIndex) {
                return cell;
            }
            else if (cell.columnIndex > columnIndex) {
                break;
            }
            colIndex += colSpan;
        }
        return null;
    }

    public getVerticalMergeStartCell(columnIndex: number, columnSpan: number): TableCellWidget {
        let columns: WColumn[] = this.ownerTable.tableHolder.columns;
        if (this.rowFormat.gridBefore > 0 && this.rowFormat.gridBefore > columnIndex + columnSpan) {
            return null;
        }
        var matchedCell = this.getCellWidget(columnIndex, columnSpan);
        if (!isNullOrUndefined(matchedCell)) {
            return matchedCell;
        }
        if (columnIndex + this.rowFormat.gridAfter === columns.length) {
            return null;
        }
        var cell: TableCellWidget;
        let previousRow: TableRowWidget = this.previousWidget as TableRowWidget;
        if (!isNullOrUndefined(previousRow)) {
            //Gets the First intersecting cell from previous row
            cell = previousRow.getVerticalMergeStartCell(columnIndex, columnSpan);
        }
        if (!isNullOrUndefined(cell) && cell.cellFormat.rowSpan > 1 && this.index === cell.rowIndex + cell.cellFormat.rowSpan - 1) {
            return cell;
        }
        return null;
    }
    /**
     * @private
     */
    public getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo {
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    }
    /**
     * @private
     */
    public destroyInternal(viewer: LayoutViewer): void {
        let height: number = this.height;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let widget: TableCellWidget = this.childWidgets[i] as TableCellWidget;
                widget.destroyInternal(viewer);
                if (isNullOrUndefined(this.childWidgets)) {
                    break;
                }
                i--;
            }
            this.childWidgets = undefined;
        }
        if (!isNullOrUndefined(this.containerWidget)) {
            if (!isNullOrUndefined(this.containerWidget.childWidgets)) {
                this.containerWidget.childWidgets.splice(this.containerWidget.childWidgets.indexOf(this), 1);
                if ((isNullOrUndefined(this.containerWidget.childWidgets) || this.containerWidget.childWidgets.length === 0)
                    && this.containerWidget instanceof TableWidget) {
                    (this.containerWidget as TableWidget).destroyInternal(viewer);
                } else if (this.containerWidget.containerWidget instanceof BodyWidget) {
                    this.containerWidget.containerWidget.height -= height;
                }
                this.containerWidget.height -= height;
            }
        }
        this.destroy();
    }
    /**
     * @private
     */
    public clone(): TableRowWidget {
        let row: TableRowWidget = new TableRowWidget();
        row.rowFormat.copyFormat(this.rowFormat);
        row.topBorderWidth = this.topBorderWidth;
        row.bottomBorderWidth = this.bottomBorderWidth;
        row.isRenderBookmarkEnd = this.isRenderBookmarkEnd;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = (this.childWidgets[i] as TableCellWidget).clone();
            row.childWidgets.push(cell);
            cell.containerWidget = row;
            cell.index = i;
            cell.rowIndex = this.rowIndex;
        }
        row.x = this.x;
        row.y = this.y;
        row.height = this.height;
        row.width = this.width;
        if (this.contentControlProperties) {
            row.contentControlProperties = this.contentControlProperties;
        }
        return row;
    }

    /**
     * Updates the child widgets left.
     * @param left 
     * @private
     */
    public updateChildWidgetLeft(left: number, updateLeftIndent?: boolean): void {
        // TODO: Cell spacing calculation.
        let spacing: number = 0;
        if (this.ownerTable.tableFormat.cellSpacing > 0) {
            spacing = this.ownerTable.tableFormat.cellSpacing;
        }
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cellWidget: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            left += spacing + cellWidget.margin.left;
            cellWidget.x = left;
            cellWidget.updateChildWidgetLeft(cellWidget.x, updateLeftIndent);
            left += cellWidget.width + cellWidget.margin.right;
        }
    }

    /**
     * Shift the widgets for RTL table.
     * @param tableWidget 
     * @private
     */
    public shiftWidgetForRtlTable(): void {
        let tableWidget: TableWidget = this.ownerTable;
        let clientAreaX: number = tableWidget.x;
        let cellSpace: number = 0;
        let tableWidth: number = 0;
        if (tableWidget.tableFormat != null && tableWidget.tableFormat.cellSpacing > 0) {
            cellSpace = tableWidget.tableFormat.cellSpacing;
        }
        tableWidth = HelperMethods.convertPointToPixel(tableWidget.getTableWidth());

        let rowX: number = this.x;
        let clientAreaRight: number = clientAreaX + tableWidth;
        let left: number = clientAreaRight - (rowX - clientAreaX);
        let prevSpannedCellWidth: number = 0;
        for (let j: number = 0; j < this.childWidgets.length; j++) {
            let cellWidget: TableCellWidget = this.childWidgets[j] as TableCellWidget;
            let prevColumnIndex: number = 0;
            if (!isNullOrUndefined(cellWidget.previousWidget)) {
                prevColumnIndex = (cellWidget.previousWidget as TableCellWidget).columnIndex + (cellWidget.previousWidget as TableCellWidget).cellFormat.columnSpan;
            }
            if (prevColumnIndex < cellWidget.columnIndex) {
                prevSpannedCellWidth = HelperMethods.convertPointToPixel(cellWidget.ownerTable.tableHolder.getPreviousSpannedCellWidth(prevColumnIndex, cellWidget.columnIndex));
                if (prevColumnIndex === 0) {
                    prevSpannedCellWidth = prevSpannedCellWidth - cellSpace / 2;
                }
            }
            left = left - (cellWidget.width + cellWidget.margin.left + cellWidget.margin.right + cellSpace);
            cellWidget.updateWidgetLeft(left + cellWidget.margin.left - prevSpannedCellWidth);
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        // if (this.rowFormat) {
        //     this.rowFormat.destroy();
        // }
        this.rowFormat = undefined;
        this.topBorderWidth = undefined;
        this.bottomBorderWidth = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.rowFormat) {
            this.rowFormat.destroy();
        }
        this.rowFormat = undefined;
        this.topBorderWidth = undefined;
        this.bottomBorderWidth = undefined;
        this.isRenderBookmarkEnd = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class TableCellWidget extends BlockWidget {
    /**
     * @private
     */
    public rowIndex: number = -1;
    /**
     * @private
     */
    public cellFormat: WCellFormat;
    /**
     * @private
     */
    public columnIndex: number;
    private sizeInfoInternal: ColumnSizeInfo = new ColumnSizeInfo();
    /**
     * @private
     */
    public contentControlProperties: ContentControlProperties;
    /**
     * @private
     */
    public updatedTopBorders: BorderInfo[] = [];
    /**
     * @private
     */
    public isRenderBookmarkStart: boolean = false;
    /**
     * @private
     */
    public isRenderBookmarkEnd: boolean = false;
    /**
     * @private
     */
    public isRenderEditRangeStart: boolean = false;
    /**
    * @private
     */
    public isRenderEditRangeEnd: boolean = false;
    // /**
    //  * @private
    //  */
    // get length(): number {
    //     if (!isNullOrUndefined(this.nextSplitWidget)) {
    //         return 1;
    //     } else {
    //         if (isNullOrUndefined(this.previousSplitWidget)) {
    //             return 1;
    //         }
    //         return 0;
    //     }
    // }
    /**
    * @private
     */
    public isSplittedCell: boolean = false;
    /**
     * @private
     */
    get ownerColumn(): WColumn {
        return this.ownerTable.tableHolder.columns[this.columnIndex];
    }
    /**
     * @private
     */
    get leftMargin(): number {
        if (this.cellFormat && this.cellFormat.hasValue('leftMargin')) {
            return this.cellFormat.leftMargin;
        } else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('leftMargin')) {
            return this.ownerRow.rowFormat.leftMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat) && this.ownerTable.tableFormat.hasValue('leftMargin')) {
            return this.ownerTable.tableFormat.leftMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get topMargin(): number {
        if (this.cellFormat && this.cellFormat.hasValue('topMargin')) {
            return this.cellFormat.topMargin;
        } else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('topMargin')) {
            return this.ownerRow.rowFormat.topMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat) && this.ownerTable.tableFormat.hasValue('topMargin')) {
            return this.ownerTable.tableFormat.topMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get rightMargin(): number {
        if (this.cellFormat && this.cellFormat.hasValue('rightMargin')) {
            return this.cellFormat.rightMargin;
        } else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('rightMargin')) {
            return this.ownerRow.rowFormat.rightMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat) && this.ownerTable.tableFormat.hasValue('rightMargin')) {
            return this.ownerTable.tableFormat.rightMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get bottomMargin(): number {
        if (this.cellFormat && this.cellFormat.hasValue('bottomMargin')) {
            return this.cellFormat.bottomMargin;
        } else if (!isNullOrUndefined(this.ownerRow) && this.ownerRow.rowFormat.hasValue('bottomMargin')) {
            return this.ownerRow.rowFormat.bottomMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat) && this.ownerTable.tableFormat.hasValue('bottomMargin')) {
            return this.ownerTable.tableFormat.bottomMargin;
        } else {
            return 0;
        }
    }

    /**
     * @private
     */
    get cellIndex(): number {
        if (this.ownerRow) {
            return this.ownerRow.childWidgets.indexOf(this);
        }
        return -1;
    }

    /**
     * @private
     */
    get ownerTable(): TableWidget {
        if (this.containerWidget instanceof TableRowWidget) {
            return this.containerWidget.ownerTable;
        }
        return undefined;
    }
    /**
     * @private
     */
    get ownerRow(): TableRowWidget {
        return this.containerWidget as TableRowWidget;
    }
    /**
     * @private
     */
    get sizeInfo(): ColumnSizeInfo {
        return this.sizeInfoInternal;
    }
    constructor() {
        super();
        this.margin = new Margin(this.leftMargin, this.topMargin, this.rightMargin, this.bottomMargin);
        this.leftBorderWidth = 0;
        this.rightBorderWidth = 0;
        this.cellFormat = new WCellFormat(this);
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        return widget instanceof TableCellWidget && widget.cellFormat === this.cellFormat;
    }
    /**
     * @private
     */
    public getContainerTable(): TableWidget {
        let table: TableWidget = this.ownerTable;
        while (table instanceof TableWidget && table.associatedCell instanceof TableCellWidget) {
            table = table.associatedCell.getContainerTable();
        }
        return table;
    }
    /**
     * @private
     */
    public getPreviousSplitWidget(): TableCellWidget {
        if (this.containerWidget instanceof TableRowWidget) {
            let row: TableRowWidget = this.containerWidget;
            do {
                row = row.previousRenderedWidget as TableRowWidget;
                if (isNullOrUndefined(row) || row.index < this.rowIndex) {
                    break;
                }
                let previousCell: TableCellWidget = row.getCell(this.rowIndex, this.columnIndex);
                if (previousCell && this.equals(previousCell)) {
                    return previousCell;
                }
            } while (row);
        }
        return undefined;
    }
    /**
     * @private
     */
    public getNextSplitWidget(): TableCellWidget {
        let rowSpan: number = this.cellFormat.rowSpan;
        if (this.containerWidget instanceof TableRowWidget) {
            let row: TableRowWidget = this.containerWidget;
            do {
                row = row.nextRenderedWidget as TableRowWidget;
                if (isNullOrUndefined(row) || row.index > this.rowIndex + rowSpan) {
                    break;
                }
                let nextCell: TableCellWidget = row.getCell(this.rowIndex, this.columnIndex);
                if (nextCell && this.equals(nextCell)) {
                    return nextCell;
                }
            } while (row);
        }
        return undefined;
    }
    /**
     * @private
     */
    public getTableCellWidget(point: Point): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            if ((this.childWidgets[i] as Widget).y <= point.y
                && ((this.childWidgets[i] as Widget).y + (this.childWidgets[i] as Widget).height) >= point.y) {
                return (this.childWidgets[i] as Widget).getTableCellWidget(point);
            }
        }
        let tableCellWidget: TableCellWidget = undefined;
        if (this.childWidgets.length > 0) {
            if ((this.childWidgets[0] as Widget).y <= point.y) {
                tableCellWidget = (this.childWidgets[this.childWidgets.length - 1] as Widget).getTableCellWidget(point);
            } else {
                tableCellWidget = (this.childWidgets[0] as Widget).getTableCellWidget(point);
            }
        }
        return tableCellWidget;
    }
    /**
     * @private
     */
    public updateWidth(preferredWidth: number): void {
        if (this.cellFormat.preferredWidthType === 'Point') {
            this.cellFormat.preferredWidth = preferredWidth;
        } else if (this.cellFormat.preferredWidthType === 'Percent') {
            this.cellFormat.preferredWidth = this.convertPointToPercent(preferredWidth);
        }
        this.cellFormat.cellWidth = preferredWidth;
    }
    /**
     * @private
     */
    public getCellWidth(block: BlockWidget): number {
        let ownerTable: TableWidget = this.ownerTable;
        let containerWidth: number = ownerTable ? ownerTable.getTableClientWidth(ownerTable.getOwnerWidth(true)) : 0;
        let cellWidth: number = containerWidth;
        let leftMargin: number = !isNullOrUndefined(this.leftMargin) ? this.leftMargin : 0;
        let rightMargin: number = !isNullOrUndefined(this.rightMargin) ? this.rightMargin : 0;
        if (ownerTable && ownerTable.tableFormat.preferredWidthType === 'Auto' && ownerTable.tableFormat.allowAutoFit) {
            if (this.cellFormat.preferredWidth === 0) {
                cellWidth = containerWidth;
            } else {
                if (this.cellFormat.preferredWidthType === 'Percent') {
                    cellWidth = (this.cellFormat.preferredWidth * containerWidth) / 100 - leftMargin - rightMargin;
                } else {
                    // If cell has prefferd width, we need to consider prefferd width.
                    cellWidth = this.cellFormat.preferredWidth - leftMargin - rightMargin;
                }
            }
        } else if (this.cellFormat.preferredWidthType === 'Percent') {
            cellWidth = (this.cellFormat.preferredWidth * containerWidth) / 100 - leftMargin - rightMargin;
        } else if (this.cellFormat.preferredWidthType === 'Point') {
            if (block instanceof TableWidget && block.tableFormat.preferredWidthType === 'Percent') {
                cellWidth = this.cellFormat.cellWidth - leftMargin - rightMargin;
            } else {
                cellWidth = this.cellFormat.preferredWidth - leftMargin - rightMargin;
            }
        }
        // For grid before and grid after with auto width, no need to calculate minimum preferred width.
        return cellWidth;
    }
    /**
     * @private
     */
    public convertPointToPercent(cellPreferredWidth: number): number {
        let value: number = 0;
        let clientWidth: number = this.ownerTable.getOwnerWidth(true);
        let tableWidth: number = this.ownerTable.getTableClientWidth(clientWidth);
        value = (cellPreferredWidth / tableWidth) * 100;
        value = Math.round(value);
        return value < 100 ? value : 100; // The value should be lesser than or equal to 100%;
    }
    /**
     * @private
     */
     public static getCellLeftBorder(tableCell: TableCellWidget): WBorder {
        let leftBorder: WBorder = undefined;
        let cellBorder: WBorders = tableCell.cellFormat.borders;
        let rowBorders: WBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        let tableBorders: WBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.left)) {
            leftBorder = cellBorder.left;
        }
        if (isNullOrUndefined(leftBorder)) {
            leftBorder = tableCell.getLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            leftBorder = tableCell.getLeftBorderToRenderByHierarchy(leftBorder, rowBorders, tableBorders);
        } else {
            let prevCell: TableCellWidget = this.getPreviousCell(tableCell);
            // if the border is shared then choose the border based on Conflict Resolution algorithm.
            leftBorder = tableCell.getPreviousCellLeftBorder(leftBorder, prevCell);
        }
        if (isNullOrUndefined(leftBorder)) {
            leftBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return leftBorder;
    }
    private static getPreviousCell(tableCell: TableCellWidget): TableCellWidget {
        let prevCell: TableCellWidget = undefined;
        if (!isNullOrUndefined(tableCell.previousWidget)) {
            //Validates whether the previous cell in same row is adjacent left cell and sets to prevCell.
            //If the previous cell is not in the same row and it is vertically merged, we have handled in serverside
            //to copy border based on priority of current cell left border and previous cell right border.
            let cell: TableCellWidget = tableCell.previousWidget as TableCellWidget;
            if (cell.columnIndex + cell.cellFormat.columnSpan === tableCell.columnIndex) {
                prevCell = cell;
            }
        }
        return prevCell;
    }
    /**
     * @private
     */
    public getLeftBorderWidth(): number {
        let borderWidth: number = 0;
        // Added null condition check for asynchronous loading.
        if (this.cellFormat !== null && this.cellFormat.borders !== null) {
            // update the margins values respect to layouting of borders.
            // For normal table cells only left border is rendered. for last cell left and right border is rendered.
            // this border widths are not included in margins.
            borderWidth = TableCellWidget.getCellLeftBorder(this).getLineWidth();
            // need to render rightBorder specifically for all the cells when the cellSpacing is greater than zero or for last cell of each row.
        }
        return borderWidth;
    }
    /**
     * @private
     */
    public getRightBorderWidth(): number {
        let borderWidth: number = 0;
        let ownerTable: TableWidget = this.ownerTable;
        //Added null condition check for asynchronous loading.
        if (this.cellFormat !== null && this.cellFormat.borders !== null) {
            borderWidth = TableCellWidget.getCellRightBorder(this).getLineWidth();
        }
        return borderWidth;
    }
    /**
     * @private
     */
    public getCellSpacing(): number {
        let actualCellSpacing: number = this.ownerTable && this.ownerTable.tableFormat ? this.ownerTable.tableFormat.cellSpacing : 0;
        let cellSpacingToLayout: number = actualCellSpacing;
        // Considers the left, right margins and border widths(only available for Layouted table) for Minimum width.
        if (this.ownerRow.childWidgets.length === 1) {
            cellSpacingToLayout = actualCellSpacing * 2;
        } else if (this.cellIndex === 0 || this.cellIndex === this.ownerRow.childWidgets.length - 1) {
            cellSpacingToLayout = actualCellSpacing + (actualCellSpacing / 2);
        } else {
            cellSpacingToLayout = actualCellSpacing;
        }
        return cellSpacingToLayout;
    }
    /**
     * @private
     */
    public getCellSizeInfo(isAutoFit: boolean): ColumnSizeInfo {
        let isSetWidth: boolean = true;
        let layout: Layout = undefined;
        if (!isNullOrUndefined(this.bodyWidget) && !isNullOrUndefined(this.bodyWidget.page)) {
            if (!isNullOrUndefined(this.bodyWidget.page.documentHelper)) {
                layout = this.bodyWidget.page.documentHelper.layout;
            }
        }
        if (!isNullOrUndefined(layout) && !isNullOrUndefined(layout.currentCell)) {
            isSetWidth = false;
            if (this === layout.currentCell) {
                isSetWidth = true;
            }
        }
        // Gets the minimum preferred width for the table cell.
        if (isSetWidth && !this.sizeInfo.hasMinimumWidth) {
            this.sizeInfo.minimumWidth = this.getMinimumPreferredWidth();
        }
        // Gets the minimum and maximum word widths.
        if (isAutoFit) {
            if (isSetWidth && !this.sizeInfo.hasMinimumWordWidth) {
                let size: WidthInfo = this.getMinimumAndMaximumWordWidth(0, 0);
                this.sizeInfo.minimumWordWidth = size.minimumWordWidth + this.sizeInfo.minimumWidth;
                this.sizeInfo.maximumWordWidth = size.maximumWordWidth + this.sizeInfo.minimumWidth;
                // if minimum and maximum width values are equal, set value as zero.
                // later, preferred width value is considered for all width values.
                // if (this.sizeInfo.minimumWidth === this.sizeInfo.minimumWordWidth
                //     && this.sizeInfo.minimumWordWidth === this.sizeInfo.maximumWordWidth) {
                //     this.sizeInfo.minimumWordWidth = 0;
                //     this.sizeInfo.maximumWordWidth = 0;
                //     this.sizeInfo.minimumWidth = 0;
                // }
            }
        }
        let sizeInfo: ColumnSizeInfo = new ColumnSizeInfo();
        sizeInfo.minimumWidth = this.sizeInfo.minimumWidth;
        sizeInfo.minimumWordWidth = this.sizeInfo.minimumWordWidth;
        sizeInfo.maximumWordWidth = this.sizeInfo.maximumWordWidth;
        return sizeInfo;
    }
    /**
     * @private
     */
    public getMinimumPreferredWidth(): number {
        let defaultWidth: number = this.leftMargin + this.rightMargin + this.getLeftBorderWidth() + this.getRightBorderWidth() + this.getCellSpacing();
        return defaultWidth;
    }
    /**
     * @private
     */
    public getPreviousCellLeftBorder(leftBorder: WBorder, previousCell: TableCellWidget): WBorder {
        if ((isNullOrUndefined(previousCell) || (!isNullOrUndefined(leftBorder) && (leftBorder.lineStyle === 'None' && !leftBorder.hasNoneStyle)))) {
            if (!isNullOrUndefined(leftBorder) && !((leftBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                leftBorder = this.getLeftBorderToRenderByHierarchy(leftBorder, TableRowWidget.getRowOf(leftBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(leftBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(previousCell)) {
            return leftBorder;
        } else {
            let prevCellRightBorder: WBorder = undefined;
            if (!isNullOrUndefined(previousCell.cellFormat.borders) && !isNullOrUndefined(previousCell.cellFormat.borders.right) && previousCell.cellFormat.borders.right.lineStyle !== 'None') {
                prevCellRightBorder = previousCell.cellFormat.borders.right;
            }
            if (!isNullOrUndefined(prevCellRightBorder) && prevCellRightBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(prevCellRightBorder, leftBorder);
            }
            else  if (!isNullOrUndefined(leftBorder) && !((leftBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                return this.getLeftBorderToRenderByHierarchy(leftBorder, TableRowWidget.getRowOf(leftBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(leftBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        return leftBorder;
    }
    /**
     * @private
     */
    public getBorderBasedOnPriority(border: WBorder, adjacentBorder: WBorder): WBorder {
        // If the cell and its adjacent cell defined different borders then based on this algorithm the border choose to render.
        // Reference link :https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.wordprocessing.tablecellborders.aspx
        if (isNullOrUndefined(border)) {
            return adjacentBorder;
        } else if (isNullOrUndefined(adjacentBorder)) {
            return border;
        }
        let borderWeight: number = border.getBorderWeight();
        let adjacentBorderWeight: number = adjacentBorder.getBorderWeight();
        //the border with higher wight  shall be displayed.
        if (borderWeight === adjacentBorderWeight) {
            //if the border is equal weight the based on the priority the border will be choosen to render.
            let borderPriority: number = border.getPrecedence();
            let adjacentBorderPriority: number = adjacentBorder.getPrecedence();
            if (borderPriority === adjacentBorderPriority) {
                //The color with the smaller brightness value shall be displayed.
                let borderColInRGB: WColor = HelperMethods.convertHexToRgb(border.color);
                let R1: number = borderColInRGB.r;
                let G1: number = borderColInRGB.g;
                let B1: number = borderColInRGB.b;
                let adjacentBorderColInRGB: WColor = HelperMethods.convertHexToRgb(adjacentBorder.color);
                let R2: number = adjacentBorderColInRGB.r;
                let G2: number = adjacentBorderColInRGB.g;
                let B2: number = adjacentBorderColInRGB.b;
                let borderBrightness: number = (R1 + B1 + (2 * G1));
                let adjacentBorderBrightness: number = (R2 + B2 + (2 * G2));
                if (borderBrightness === adjacentBorderBrightness) {
                    borderBrightness = (B1 + (2 * G1));
                    adjacentBorderBrightness = (B2 + (2 * G2));
                    if (borderBrightness === adjacentBorderBrightness) {
                        if (G1 === G2) {
                            return border;
                        } else if (G1 > G2) {
                            return adjacentBorder;
                        } else {
                            return border;
                        }
                    } else if (borderBrightness > adjacentBorderBrightness) {
                        return adjacentBorder;
                    } else {
                        return border;
                    }
                } else if (borderBrightness > adjacentBorderBrightness) {
                    return adjacentBorder;
                } else {
                    return border;
                }
            } else if (borderPriority > adjacentBorderPriority) {
                return border;
            } else {
                return adjacentBorder;
            }
        } else if (borderWeight > adjacentBorderWeight) {
            return border;
        } else {
            return adjacentBorder;
        }
    }
    /**
     * @private
     */
    public getLeftBorderToRenderByHierarchy(leftBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        let ownerCell: TableCellWidget = TableCellWidget.getCellOf(leftBorder.ownerBase as WBorders);
        if (!isNullOrUndefined(ownerCell)) {
            let isFirstCell: boolean = false;
            if (ownerCell.columnIndex === 0 || (ownerCell.cellIndex === 0 && ownerCell.ownerRow.rowFormat.gridBefore > 0)) {
                isFirstCell = true;
            }
            let isRowBorderDefined: boolean = false;
            if (!isNullOrUndefined(rowBorders.left) && rowBorders.left.lineStyle !== 'None' 
                && rowBorders.left.isBorderDefined && !isNullOrUndefined(leftBorder) 
                && leftBorder.lineStyle === 'None' && leftBorder.isBorderDefined && !leftBorder.hasValue('color')) {
                isRowBorderDefined = true;
            }
            if ((!isNullOrUndefined(leftBorder) && leftBorder.lineStyle === 'None' && (!leftBorder.isBorderDefined || isRowBorderDefined)) || isNullOrUndefined(leftBorder)) {
                if (isFirstCell) {
                    leftBorder = rowBorders.left;
                    if ((!isNullOrUndefined(leftBorder) && leftBorder.lineStyle === 'None') || isNullOrUndefined(leftBorder)) {
                        leftBorder = tableBorders.left;
                    }
                } else {
                    leftBorder = rowBorders.vertical;
                    if ((!isNullOrUndefined(leftBorder) && leftBorder.lineStyle === 'None') || isNullOrUndefined(leftBorder)) {
                        leftBorder = tableBorders.vertical;
                    }
                }
            }
        }
        return leftBorder;
    }
    /**
     * @private
     */
    public static getCellRightBorder(tableCell: TableCellWidget): WBorder {
        let rightBorder: WBorder = undefined;
        let cellBorder: WBorders = tableCell.cellFormat.borders;
        let rowBorders: WBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        let tableBorders: WBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.right)) {
            rightBorder = cellBorder.right;
        }
        if (isNullOrUndefined(rightBorder)) {
            rightBorder = tableCell.getRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            rightBorder = tableCell.getRightBorderToRenderByHierarchy(rightBorder, rowBorders, tableBorders);
        } else {
            let nextCell: TableCellWidget = this.getNextCell(tableCell);
            // if the border is shared then choose the border based on Conflict Resolution algorithm.
            rightBorder = tableCell.getAdjacentCellRightBorder(rightBorder, nextCell);
        }
        if (isNullOrUndefined(rightBorder)) {
            rightBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return rightBorder;
    }
    private static getNextCell(tableCell: TableCellWidget): TableCellWidget {
        let nextCell: TableCellWidget = undefined;
        let columnSpan: number = tableCell.cellFormat.columnSpan;
        if (!isNullOrUndefined(tableCell.nextWidget)) {
            //Validates whether the next cell in same row is adjacent right cell and sets to nextCell.
            //If the next cell is not in the same row and it is vertically merged, we have handled in serverside
            //to copy border based on priority of current cell right border and next cell left border.
            let cell: TableCellWidget = tableCell.nextWidget as TableCellWidget;
            if (tableCell.columnIndex + columnSpan === cell.columnIndex) {
                nextCell = cell;
            }
        }
        return nextCell;
    }

    /**
     * @private
     */
    public getAdjacentCellRightBorder(rightBorder: WBorder, nextCell: TableCellWidget): WBorder {
        if (isNullOrUndefined(nextCell) || (!isNullOrUndefined(rightBorder) && (rightBorder.lineStyle === 'None' && !rightBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(rightBorder) && !((rightBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                rightBorder = this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(nextCell)) {
            return rightBorder;
        } else {
            let nextCellLeftBorder: WBorder = undefined;
            if (!isNullOrUndefined(nextCell.cellFormat.borders) && !isNullOrUndefined(nextCell.cellFormat.borders.left) && nextCell.cellFormat.borders.left.lineStyle !== 'None') {
                nextCellLeftBorder = nextCell.cellFormat.borders.left;
            }
            if (!isNullOrUndefined(nextCellLeftBorder) && nextCellLeftBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(rightBorder, nextCellLeftBorder);
            } else if (!isNullOrUndefined(rightBorder) && !((rightBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                return this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase as WBorders).tableFormat.borders);

            }
        }
        return rightBorder;
    }
    /**
     * @private
     */
    public getRightBorderToRenderByHierarchy(rightBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        let ownerCell: TableCellWidget = TableCellWidget.getCellOf(rightBorder.ownerBase as WBorders);
        if (!isNullOrUndefined(ownerCell)) {
            let isLastCell: boolean = false;
            //Have to check lastcell logic
            if ((ownerCell.columnIndex + ownerCell.cellFormat.columnSpan) === ownerCell.ownerTable.tableHolder.columns.length
                || (ownerCell.cellIndex === ownerCell.ownerRow.childWidgets.length - 1)) {
                isLastCell = true;
            }
            let isRowBorderDefined: boolean = false;
            if (!isNullOrUndefined(rowBorders.right) && rowBorders.right.lineStyle !== 'None' 
                && rowBorders.right.isBorderDefined && !isNullOrUndefined(rightBorder) && rightBorder.lineStyle === 'None' 
                && rightBorder.isBorderDefined && !rightBorder.hasValue('color')) {
                isRowBorderDefined = true;
            }
            if ((!isNullOrUndefined(rightBorder) && rightBorder.lineStyle === 'None' && (!rightBorder.isBorderDefined || isRowBorderDefined)) || isNullOrUndefined(rightBorder)) {
                if (isLastCell) {
                    rightBorder = rowBorders.right;
                    if ((!isNullOrUndefined(rightBorder) && rightBorder.lineStyle === 'None') || isNullOrUndefined(rightBorder)) {
                        rightBorder = tableBorders.right;
                    }
                } else {
                    rightBorder = rowBorders.vertical;
                    if ((!isNullOrUndefined(rightBorder) && rightBorder.lineStyle === 'None') || isNullOrUndefined(rightBorder)) {
                        rightBorder = tableBorders.vertical;
                    }
                }
            }
        }
        return rightBorder;
    }
    /**
     * @private
     */
    public static getCellTopBorder(tableCell: TableCellWidget): WBorder {
        let topBorder: WBorder = undefined;
        let cellBorder: WBorders = tableCell.cellFormat.borders;
        let rowBorders: WBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        let tableBorders: WBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.top)) {
            topBorder = cellBorder.top;
        }
        if (isNullOrUndefined(topBorder)) {
            topBorder = tableCell.getTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            topBorder = tableCell.getTopBorderToRenderByHierarchy(topBorder, rowBorders, tableBorders);
        } else {
            let prevTopCell: TableCellWidget = tableCell.getTopAdjacentCell();
            //If the border is shared then choose the border based on Conflict Resolution algorithm.
            topBorder = tableCell.getPreviousCellTopBorder(topBorder, prevTopCell);
        }
        if (isNullOrUndefined(topBorder)) {
            topBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return topBorder;
    }
    private getTopAdjacentCell(): TableCellWidget {
        let previousRow: TableRowWidget = this.ownerRow.previousWidget as TableRowWidget;
        let cell: TableCellWidget;
        if (!isNullOrUndefined(previousRow)) {
            cell = previousRow.getVerticalMergeStartCell(this.columnIndex, this.cellFormat.columnSpan);
        }
        return cell;
    }
    /**
     * @private
     */
    public getPreviousCellTopBorder(topBorder: WBorder, previousTopCell: TableCellWidget): WBorder {
        if (isNullOrUndefined(previousTopCell) || (!isNullOrUndefined(topBorder) && (topBorder.lineStyle === 'None' && !topBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(topBorder) && !((topBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                topBorder = this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(previousTopCell)) {
            return topBorder;
        } else {
            let prevTopCellBottomBorder: WBorder = undefined;
            if (!isNullOrUndefined(previousTopCell.cellFormat.borders) && !isNullOrUndefined(previousTopCell.cellFormat.borders.bottom)) {
                prevTopCellBottomBorder = this.getBottomBorderToRenderByHierarchy(previousTopCell.cellFormat.borders.bottom, previousTopCell.ownerRow.rowFormat.borders, previousTopCell.ownerTable.tableFormat.borders);
            }
            if (!isNullOrUndefined(prevTopCellBottomBorder) && prevTopCellBottomBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(topBorder, prevTopCellBottomBorder);
            }
            else  if (!isNullOrUndefined(topBorder) && !((topBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                return this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        return topBorder;
    }
    /**
     * @private
     */
    public getTopBorderToRenderByHierarchy(topBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        let ownerCell: TableCellWidget = TableCellWidget.getCellOf(topBorder.ownerBase as WBorders);
        if (!isNullOrUndefined(ownerCell)) {
            let isFirstRow: boolean = isNullOrUndefined(ownerCell.ownerRow.previousWidget);
            let isRowBorderDefined: boolean = false;
            if (!isNullOrUndefined(rowBorders.top) && rowBorders.top.lineStyle !== 'None' 
                && rowBorders.top.isBorderDefined && !isNullOrUndefined(topBorder) 
                && topBorder.lineStyle === 'None' && topBorder.isBorderDefined && !topBorder.hasValue('color')) {
                isRowBorderDefined = true;
            }
            if ((!isNullOrUndefined(topBorder) && topBorder.lineStyle === 'None' && (!topBorder.isBorderDefined || isRowBorderDefined)) || isNullOrUndefined(topBorder)) {
                if (isFirstRow) {
                    topBorder = rowBorders.top;
                    if ((!isNullOrUndefined(topBorder) && topBorder.lineStyle === 'None') || isNullOrUndefined(topBorder)) {
                        topBorder = tableBorders.top;
                    }
                } else {
                    topBorder = rowBorders.horizontal;
                    if ((!isNullOrUndefined(topBorder) && topBorder.lineStyle === 'None') || isNullOrUndefined(topBorder)) {
                        topBorder = tableBorders.horizontal;
                    }
                }
            }
        }
        return topBorder;
    }
    /**
     * @private
     */
    public static getCellBottomBorder(tableCell: TableCellWidget): WBorder {
        let bottomBorder: WBorder = undefined;
        let cellBorder: WBorders = tableCell.cellFormat.borders;
        let rowBorders: WBorders = !isNullOrUndefined(tableCell.ownerRow) ? tableCell.ownerRow.rowFormat.borders : undefined;
        let tableBorders: WBorders = !isNullOrUndefined(tableCell.ownerTable) ? tableCell.ownerTable.tableFormat.borders : undefined;
        if (!isNullOrUndefined(cellBorder.bottom)) {
            bottomBorder = cellBorder.bottom;
        }
        if (isNullOrUndefined(bottomBorder)) {
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders); // select the left border based on heirarchy.
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders);
        } else {
            let nextBottomCell: TableCellWidget = undefined;
            let nextRow: TableRowWidget = undefined;
            let rowSpan: number = tableCell.cellFormat.rowSpan;
            if (rowSpan === 1){
                nextRow = tableCell.ownerRow.nextWidget as TableRowWidget
            } else if (rowSpan > 1){
                let row: TableRowWidget = tableCell.containerWidget as TableRowWidget;
                do {
                    row = row.nextWidget as TableRowWidget;
                    if (isNullOrUndefined(row)) {
                        break;
                    } else if (row.index === tableCell.rowIndex + rowSpan){
                        nextRow = row;
                        break;
                    }
                } while (row);
            }
            if (!isNullOrUndefined(nextRow)) {
                nextBottomCell = nextRow.getCellWidget(tableCell.columnIndex,tableCell.cellFormat.columnSpan);
            }
            //If the border is shared then choose the border based on Conflict Resolution algorithm.
            bottomBorder = tableCell.getAdjacentCellBottomBorder(bottomBorder, nextBottomCell);
        }
        if (isNullOrUndefined(bottomBorder)) {
            bottomBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return bottomBorder;
    }
    /**
     * @private
     */
    public getAdjacentCellBottomBorder(bottomBorder: WBorder, nextBottomCell: TableCellWidget): WBorder {
        if (isNullOrUndefined(nextBottomCell) || (!isNullOrUndefined(bottomBorder) && (bottomBorder.lineStyle === 'None' && !bottomBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(bottomBorder) && !((bottomBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                bottomBorder = this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        if (isNullOrUndefined(nextBottomCell)) {
            return bottomBorder;
        } else {
            let prevBottomCellTopBorder: WBorder = undefined;
            if (!isNullOrUndefined(nextBottomCell.cellFormat.borders) && !isNullOrUndefined(nextBottomCell.cellFormat.borders.top) && nextBottomCell.cellFormat.borders.top.lineStyle !== 'None') {
                prevBottomCellTopBorder = nextBottomCell.cellFormat.borders.top;
            }
            if (!isNullOrUndefined(prevBottomCellTopBorder) && prevBottomCellTopBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(bottomBorder, prevBottomCellTopBorder);
            } else if (!isNullOrUndefined(bottomBorder) && !((bottomBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                return this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        return bottomBorder;
    }
    /**
     * @private
     */
    public getBottomBorderToRenderByHierarchy(bottomBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        let ownerCell: TableCellWidget = TableCellWidget.getCellOf(bottomBorder.ownerBase as WBorders);
        if (!isNullOrUndefined(ownerCell)) {
            let isLastRow: boolean = isNullOrUndefined(ownerCell.ownerRow.nextWidget);
            let isRowBorderDefined: boolean = false;
            if (!isNullOrUndefined(rowBorders.bottom) && rowBorders.bottom.lineStyle !== 'None' 
                && rowBorders.bottom.isBorderDefined && !isNullOrUndefined(bottomBorder) 
                && bottomBorder.lineStyle === 'None' && bottomBorder.isBorderDefined && !bottomBorder.hasValue('color')) {
                isRowBorderDefined = true;
            }
            if ((!isNullOrUndefined(bottomBorder) && bottomBorder.lineStyle === 'None' && (!bottomBorder.isBorderDefined || isRowBorderDefined)) || isNullOrUndefined(bottomBorder)) {
                if (isLastRow) {
                    bottomBorder = rowBorders.bottom;
                    if ((!isNullOrUndefined(bottomBorder) && bottomBorder.lineStyle === 'None') || isNullOrUndefined(bottomBorder)) {
                        bottomBorder = tableBorders.bottom;
                    }
                } else {
                    bottomBorder = rowBorders.horizontal;
                    if ((!isNullOrUndefined(bottomBorder) && bottomBorder.lineStyle === 'None') || isNullOrUndefined(bottomBorder)) {
                        bottomBorder = tableBorders.horizontal;
                    }
                }
            }
        }
        return bottomBorder;
    }
    /**
     * @private
     */
    public static getCellOf(node: WBorders): TableCellWidget {
        if (node instanceof WBorders) {
            if (node.ownerBase instanceof WCellFormat && (node.ownerBase as WCellFormat).ownerBase instanceof TableCellWidget) {
                return (node.ownerBase as WCellFormat).ownerBase as TableCellWidget;
            } else {
                return undefined;
            }
        }
        return undefined;
    }

    /**
     * Updates the Widget left.
     * @private
     */
    public updateWidgetLeft(x: number): void {
        this.x = x;
        this.updateChildWidgetLeft(x);
    }

    /**
     * @private
     */
    public updateChildWidgetLeft(left: number, updateLeftIndent?: boolean): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let widget: Widget = this.childWidgets[i] as Widget;
            widget.x = left;
            if (updateLeftIndent && widget instanceof ParagraphWidget) {
                widget.x = left + HelperMethods.convertPointToPixel(widget.leftIndent);
            }
            if (widget instanceof TableWidget) {
                let tableWidget: TableWidget = widget as TableWidget;
                tableWidget.updateChildWidgetLeft(left, updateLeftIndent);
                if (tableWidget.isBidiTable) {
                    let clientArea: Rect = new Rect(tableWidget.x, tableWidget.y, tableWidget.width, tableWidget.height);
                    tableWidget.shiftWidgetsForRtlTable(clientArea, tableWidget);
                }
            }
        }
    }
    /**
     * @private
     */
    public getMinimumAndMaximumWordWidth(minimumWordWidth: number, maximumWordWidth: number): WidthInfo {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = this.childWidgets[i] as BlockWidget;
            let widthInfo: WidthInfo = block.getMinimumAndMaximumWordWidth(minimumWordWidth, maximumWordWidth);
            minimumWordWidth = widthInfo.minimumWordWidth;
            maximumWordWidth = widthInfo.maximumWordWidth;
        }
        return { 'minimumWordWidth': minimumWordWidth, 'maximumWordWidth': maximumWordWidth };
    }
    /**
     * @private
     */
    public destroyInternal(viewer: LayoutViewer): void {
        // let viewer: LayoutViewer = undefined;
        // let page: Page = this.getPage();
        // if (!isNullOrUndefined(page ))
        //     viewer = page.viewer;
        if (!isNullOrUndefined(this.childWidgets)) {
            for (let i: number = 0; i < this.childWidgets.length; i++) {
                let widget: Widget = this.childWidgets[i] as Widget;
                if (widget instanceof ParagraphWidget) {
                    (widget as ParagraphWidget).destroyInternal(viewer);
                } else {
                    (widget as TableWidget).destroyInternal(viewer);
                }
                i--;
            }
            this.childWidgets = undefined;
            if(!isNullOrUndefined(viewer.documentHelper.selection)) {
                if(viewer.documentHelper.selection.selectedWidgets.containsKey(this)) {
                    viewer.documentHelper.selection.selectedWidgets.remove(this)
                }
            }
        }
        this.destroy();
    }
    /**
     * @private
     */
    public clone(): TableCellWidget {
        let cell: TableCellWidget = new TableCellWidget();
        cell.cellFormat.copyFormat(this.cellFormat);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = (this.childWidgets[i] as BlockWidget).clone();
            cell.childWidgets.push(block);
            block.containerWidget = cell;
            block.index = i;
        }
        cell.leftBorderWidth = this.leftBorderWidth;
        cell.rightBorderWidth = this.rightBorderWidth;
        cell.isRenderBookmarkEnd = this.isRenderBookmarkEnd;
        cell.isRenderBookmarkStart = this.isRenderBookmarkStart;
        if (this.margin) {
            cell.margin = this.margin.clone();
        }
        cell.columnIndex = this.columnIndex;
        cell.x = this.x;
        cell.y = this.y;
        cell.height = this.height;
        cell.width = this.width;
        if (this.contentControlProperties) {
            cell.contentControlProperties = this.contentControlProperties;
        }
        return cell;
    }
    /**
     * @private
     */
    public destroy(): void {
        // if (this.cellFormat) {
        //     this.cellFormat.destroy();
        // }
        this.cellFormat = undefined;
        this.rowIndex = undefined;
        this.columnIndex = undefined;
        this.isSplittedCell = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.cellFormat) {
            this.cellFormat.destroy();
        }
        this.cellFormat = undefined;
        this.contentControlProperties = undefined;
        this.rowIndex = undefined;
        this.columnIndex = undefined;
        this.isRenderBookmarkStart = undefined;
        this.isRenderBookmarkEnd = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class LineWidget implements IWidget {
    /**
     * @private
     */
    public children: ElementBox[] = [];
    /**
     * @private
     */
    public layoutedElements: ElementBox[];
    /**
     * @private
     */
    public paragraph: ParagraphWidget;
    /**
     * @private
     */
    public x: number = 0;
    /**
     * @private
     */
    public y: number = 0;
    /**
     * @private
     */
    public width: number = 0;
    /**
     * @private
     */
    public height: number = 0;
    /**
     * @private
     */
    public marginTop: number = 0;

    /**
     * @private
     */
    public maxBaseLine: number = 0;
    /**
    * @private
    */
    public skipClipImage: boolean = false;
    /**
     * Rendered elements contains reordered element for RTL layout 
     */
    get renderedElements(): ElementBox[] {
        if (!isNullOrUndefined(this.layoutedElements)) {
            return this.layoutedElements;
        }
        return this.children;
    }

    /**
    * @private
    */
    public margin: Margin;
    /**
     * @private
     */
    get indexInOwner(): number {
        if (this.paragraph && this.paragraph.childWidgets) {
            return this.paragraph.childWidgets.indexOf(this);
        }
        return -1;
    }
    /**
     * @private
     */
    get nextLine(): LineWidget {
        let paragraph: ParagraphWidget = this.paragraph;
        let lineIndex: number = this.indexInOwner;
        if (lineIndex <= paragraph.childWidgets.length - 2) {
            return paragraph.childWidgets[lineIndex + 1] as LineWidget;
        } else if (paragraph.nextSplitWidget) {
            let line: LineWidget = paragraph.nextSplitWidget.firstChild as LineWidget;
            if (line instanceof LineWidget && line.paragraph.equals(this.paragraph)) {
                return line;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    get previousLine(): LineWidget {
        let paragraph: ParagraphWidget = this.paragraph;
        let lineIndex: number = this.indexInOwner;
        let splitParagraph: ParagraphWidget = paragraph.previousSplitWidget as ParagraphWidget;
        if (lineIndex > 0) {
            return paragraph.childWidgets[lineIndex - 1] as LineWidget;
        } else if (splitParagraph instanceof ParagraphWidget) {
            let line: LineWidget = splitParagraph.lastChild as LineWidget;
            if (line instanceof LineWidget && line.paragraph.equals(this.paragraph)) {
                return line;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    get isEndsWithPageBreak(): boolean {
        if (this.children.length > 0) {
            let lastElement: ElementBox = this.children[this.children.length - 1];
            if (lastElement instanceof TextElementBox) {
                return lastElement.isPageBreak;
            }
        }
        return false;
    }
    get isEndsWithColumnBreak(): boolean{
        if (this.children.length > 0) {
            let lastElement: ElementBox = this.children[this.children.length - 1];
            if (lastElement instanceof TextElementBox) {
                return lastElement.isColumnBreak;
            }
        }
        return false;
    }
    /**
     * @private
     */
    get isEndsWithLineBreak(): boolean {
        if (this.children.length > 0) {
            let lastElement: ElementBox = this.children[this.children.length - 1];
            if (lastElement instanceof TextElementBox) {
                return lastElement.text === '\v';
            }
        }
        return false;
    }
    /**
     * Initialize the constructor of LineWidget
     */
    constructor(paragraphWidget: ParagraphWidget) {
        this.paragraph = paragraphWidget;
    }
    /**
     * @private
     */
    public isFirstLine(): boolean {
        let index: number = this.indexInOwner;
        if (index > -1 && (this.paragraph.previousSplitWidget === undefined || (this.paragraph.previousSplitWidget instanceof ParagraphWidget && ((this.paragraph.previousSplitWidget as ParagraphWidget).isEndsWithColumnBreak || (this.paragraph.previousSplitWidget as ParagraphWidget).isEndsWithPageBreak)))) {
            return index === 0;
        }
        return false;
    }
    /**
     * @private
     */
    public isLastLine(): boolean {
        let index: number = this.indexInOwner;
        if (index > -1 && this.paragraph.nextSplitWidget === undefined) {
            return index === this.paragraph.childWidgets.length - 1;
        }
        return false;
    }
    /**
     * @private
     */
    public getOffset(inline: ElementBox, index: number): number {
        if (isNullOrUndefined(inline)) {
            return index;
        }
        let textIndex: number = index;
        let line: LineWidget = inline.line as LineWidget;
        for (let i: number = 0; i < line.children.length; i++) {
            let inlineElement: ElementBox = line.children[i] as ElementBox;
            if (inline === inlineElement) {
                break;
            }
            if (inlineElement instanceof ListTextElementBox) {
                continue;
            }
            textIndex += inlineElement.length;
        }
        return textIndex;
    }
    /**
     * @private
     */
    public getEndOffset(): number {
        let startOffset: number = 0;
        let count: number = 0;
        for (let i: number = 0; i < this.children.length; i++) {
            let inlineElement: ElementBox = this.children[i] as ElementBox;
            if (inlineElement.length === 0) {
                continue;
            }
            if (inlineElement instanceof ListTextElementBox) {
                continue;
            }
            if (inlineElement instanceof TextElementBox || inlineElement instanceof CommentCharacterElementBox
                || inlineElement instanceof EditRangeStartElementBox || inlineElement instanceof ImageElementBox
                || inlineElement instanceof EditRangeEndElementBox || inlineElement instanceof BookmarkElementBox
                || inlineElement instanceof ContentControl || (inlineElement instanceof FieldElementBox
                    && HelperMethods.isLinkedFieldCharacter((inlineElement as FieldElementBox)))) {
                startOffset = count + inlineElement.length;
            }
            count += inlineElement.length;
        }
        return startOffset;
    }

    /**
     * @private
     */
    public getInline(offset: number, indexInInline: number, bidi?: boolean, isInsert?: boolean, isSpellCheck?: boolean): ElementInfo {
        bidi = isNullOrUndefined(bidi) ? this.paragraph.bidi : bidi;
        let inlineElement: ElementBox = undefined;
        let count: number = 0;
        let isStarted: boolean = false;
        if (this.children.length === 0) {
            if (this.previousLine) {
                let elementBox: TextElementBox = this.previousLine.children[this.previousLine.children.length - 1] as TextElementBox;
                if (elementBox instanceof TextElementBox && elementBox.text === '\v') {
                    inlineElement = this.previousLine.children[this.previousLine.children.length - 1];
                    indexInInline = 1;
                    return { 'element': inlineElement, 'index': indexInInline };
                }
            }
        }
        for (let i: number = 0; i < this.children.length; i++) {
            inlineElement = this.children[i] as ElementBox;
            if (inlineElement instanceof ListTextElementBox) {
                continue;
            }
            if (!isStarted && (inlineElement instanceof TextElementBox || inlineElement instanceof ImageElementBox
                || inlineElement instanceof ShapeElementBox || inlineElement instanceof ContentControl
                || inlineElement instanceof BookmarkElementBox || inlineElement instanceof EditRangeEndElementBox
                || inlineElement instanceof EditRangeStartElementBox || inlineElement instanceof CommentCharacterElementBox
                || inlineElement instanceof FieldElementBox
                && HelperMethods.isLinkedFieldCharacter(inlineElement as FieldElementBox))) {
                isStarted = true;
            }
            if (isStarted && offset <= count + inlineElement.length) {
                if (inlineElement instanceof TextElementBox && ((inlineElement as TextElementBox).text === ' ' && inlineElement.revisions.length === 0 && isInsert && !isSpellCheck)) {
                    let currentElement: ElementBox = this.getNextTextElement(this, i + 1);
                    inlineElement = !isNullOrUndefined(currentElement) ? currentElement : inlineElement;
                    indexInInline = isNullOrUndefined(currentElement) ? (offset - count) : 0;
                    return { 'element': inlineElement, 'index': indexInInline };
                } else if (offset === count + inlineElement.length && this.children[i + 1] instanceof FootnoteElementBox) {
                    return { 'element': this.children[i + 1], 'index': indexInInline };
                } else {
                    indexInInline = (offset - count);
                }
                return { 'element': inlineElement, 'index': indexInInline };
            }
            count += inlineElement.length;
        }
        if (offset > count) {
            indexInInline = isNullOrUndefined(inlineElement) ? offset : inlineElement.length;
        }
        return { 'element': inlineElement, 'index': indexInInline };
    }

    /**
     * @private
     */
    public isEndnoteLineWidget(): boolean {
        if (!isNullOrUndefined(this.paragraph.containerWidget)
            && this.paragraph.containerWidget.containerWidget instanceof FootNoteWidget
            && this.paragraph.containerWidget.containerWidget.footNoteType === 'Endnote') {
            return true;
        }
        return false;
    }

    /**
     * Method to retrieve next element
     * @param line 
     * @param index 
     */
    private getNextTextElement(line: LineWidget, index: number): ElementBox {
        if (index < line.children.length - 1 && line.children[index] as TextElementBox) {
            return line.children[index];
        }
        return null;
    }
    /**
     * @private
     */
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let node: LineWidget = this;
        hierarchicalIndex = node.paragraph.childWidgets.indexOf(node) + ';' + hierarchicalIndex;
        if (node.paragraph instanceof BlockWidget) {
            return (node.paragraph as BlockWidget).getHierarchicalIndex(hierarchicalIndex);
        }
        return hierarchicalIndex;
    }
    /**
     * @private
     */
    public clone(): LineWidget {
        let line: LineWidget = new LineWidget(undefined);
        for (let j: number = 0; j < this.children.length; j++) {
            let element: ElementBox = this.children[j] as ElementBox;
            let clone: ElementBox = element.clone();
            line.children.push(clone);
            clone.line = line;
        }
        line.width = this.width;
        line.height = this.height;
        if (!isNullOrUndefined(this.margin)) {
            line.margin = this.margin.clone();
        }
        return line;
    }
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.children)) {
            for (let i: number = 0; i < this.children.length; i++) {
                this.children[i].destroy();
            }
            this.children = [];
        }
        this.children = undefined;
        if (this.paragraph) {
            this.paragraph.removeChild(this.indexInOwner);
        }
        this.paragraph = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (!isNullOrUndefined(this.children)) {
            for (let i: number = 0; i < this.children.length; i++) {
                let elementBox: ElementBox = this.children[i];
                elementBox.componentDestroy();
            }
            this.children = [];
        }
        this.children = undefined;
        this.paragraph = undefined;
        this.layoutedElements = [];
        this.layoutedElements = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
    }
}
/** 
 * @private
 */
export abstract class ElementBox {
    /**
     * @private
     */
    public x: number = 0;
    /**
     * @private
     */
    public y: number = 0;
    /**
     * @private
     */
    public width: number = 0;
    /**
     * @private
     */
    public height: number = 0;
    /**
    * @private
    */
    public isWidthUpdated: boolean = false;
    /**
     * @private
     */
    public margin: Margin = new Margin(0, 0, 0, 0);
    /**
     * @private
     */
    public padding: Margin = new Margin(0, 0, 0, 0);
    /**
     * @private
     */
    public line: LineWidget;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat = undefined;
    /**
     * @private
     */
    public static objectCharacter: string = String.fromCharCode(65532);
    /**
     * @private
     */

    public isRightToLeft: boolean = false;
    /**
     * @private
     */
    public canTrigger: boolean = false;

    /**
     * @private
     */
    public ischangeDetected: boolean = false;
    /**
     * @private
     */
    public isWrongWord: boolean = false;
    /**
     * @private
     */
    public isVisible: boolean = false;
    /**
     * @private
     */
    public isSpellChecked?: boolean = false;
    /**
     * @private
     */
    public revisions: Revision[] = [];
    /**
     * @private
     */
    public canTrack: boolean = false;
    /**
     * @private
     */
    public removedIds: string[] = [];
    /**
     * @private
     */
    public isMarkedForRevision: boolean = false;
    /**
     * @private
     */
    public contentControlProperties: ContentControlProperties;
    /**
     * @private
     */
    public skipformFieldLength: boolean = false;
    /**
     * @private
     */
    public characterRange: CharacterRangeType = undefined;

    /**
     * @private
     */
    get isPageBreak(): boolean {
        if (this instanceof TextElementBox) {
            return this.text === '\f';
        }
        return false;
    }
    get isColumnBreak(): boolean {
        if (this instanceof TextElementBox) {
            return this.text === String.fromCharCode(14);
        }
        return false;
    }
    
    /**
     * @private
     * Method to indicate whether current element is trackable.
     */
    get isValidNodeForTracking(): boolean {
        if (this instanceof BookmarkElementBox || this instanceof CommentCharacterElementBox || this instanceof EditRangeStartElementBox || this instanceof EditRangeEndElementBox || this instanceof ContentControl) {
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    get isCheckBoxElement(): boolean {
        let element: ElementBox = this;
        if (element instanceof TextElementBox && !isNullOrUndefined(element.text)) {
            return element.text === String.fromCharCode(9745) || element.text === String.fromCharCode(9744);
        }
        return false;
    }
    /**
     * @private
     */
    public linkFieldCharacter(documentHelper: DocumentHelper): void {
        if (!(this instanceof FieldElementBox)) {
            return;
        }
        if (this.fieldType === 0) {
            let fieldBegin: FieldElementBox = this as FieldElementBox;
            if (isNullOrUndefined(fieldBegin.fieldEnd)) {
                this.linkFieldTraversingForward(this.line, fieldBegin, fieldBegin);
                if (documentHelper.fields.indexOf(fieldBegin) === -1) {
                    documentHelper.fields.push(fieldBegin);
                }
                if (!isNullOrUndefined(fieldBegin.formFieldData) &&
                    documentHelper.formFields.indexOf(fieldBegin) === -1 && !documentHelper.layout.isInsertFormField) {
                    documentHelper.formFields.push(fieldBegin);
                }
            }
        } else if (this.fieldType === 2) {
            let fieldSeparator: FieldElementBox = this as FieldElementBox;
            //Links the field begin for the current separator.
            if (isNullOrUndefined(fieldSeparator.fieldBegin)) {
                this.linkFieldTraversingBackwardSeparator(this.line, fieldSeparator, fieldSeparator);
            }
            if (!isNullOrUndefined(fieldSeparator.fieldBegin)) {
                fieldSeparator.fieldBegin.fieldSeparator = fieldSeparator;
                //Links to field end traversing from field separator.
                if (isNullOrUndefined(fieldSeparator.fieldEnd)) {
                    let isFieldEnd: boolean = this.linkFieldTraversingForward(this.line, fieldSeparator.fieldBegin, fieldSeparator);
                    if (isFieldEnd) {
                        fieldSeparator.fieldEnd = fieldSeparator.fieldBegin.fieldEnd;
                    }
                }
                if (fieldSeparator.fieldEnd) {
                    fieldSeparator.fieldEnd.fieldSeparator = fieldSeparator;
                }
            }
        } else {
            let fieldEnd: FieldElementBox = this as FieldElementBox;
            //Links the field begin and separator for the current end.
            if (isNullOrUndefined(fieldEnd.fieldBegin)) {
                this.linkFieldTraversingBackward(this.line, fieldEnd, fieldEnd);
            }
        }
    }
    /**
     * @private
     */
    public linkFieldTraversingBackward(line: LineWidget, fieldEnd: FieldElementBox, previousNode: ElementBox): boolean {
        let k: number = line.children.length - 1;
        if (line.children.indexOf(previousNode) > -1) {
            k = line.children.indexOf(previousNode) - 1;
        }

        for (let j: number = k; j >= 0; j--) {
            let childNode: ElementBox = line.children[j];
            if (childNode instanceof FieldElementBox) {
                if (childNode.fieldType === 0) {
                    if (isNullOrUndefined((childNode as FieldElementBox).fieldEnd)) {
                        fieldEnd.fieldBegin = childNode as FieldElementBox;
                        if (isNullOrUndefined((childNode as FieldElementBox).fieldEnd)) {
                            (childNode as FieldElementBox).fieldEnd = fieldEnd;
                        }
                        if (fieldEnd.fieldSeparator && isNullOrUndefined(fieldEnd.fieldSeparator.fieldBegin)) {
                            fieldEnd.fieldSeparator.fieldBegin = childNode as FieldElementBox;
                            if (isNullOrUndefined(childNode.fieldSeparator)) {
                                childNode.fieldSeparator = fieldEnd.fieldSeparator;
                            }
                        }
                        return !isNullOrUndefined(fieldEnd.fieldBegin);
                    }
                } else if (childNode.fieldType === 2 && isNullOrUndefined((childNode as FieldElementBox).fieldEnd)) {
                    fieldEnd.fieldSeparator = childNode as FieldElementBox;
                    (childNode as FieldElementBox).fieldEnd = fieldEnd;
                    if (!isNullOrUndefined((childNode as FieldElementBox).fieldBegin)) {
                        fieldEnd.fieldBegin = (childNode as FieldElementBox).fieldBegin;
                    }
                }
            }
        }
        if (line.previousLine) {
            this.linkFieldTraversingBackward(line.previousLine, fieldEnd, this);
        } else if (line.paragraph.previousRenderedWidget instanceof ParagraphWidget
            && line.paragraph.previousRenderedWidget.childWidgets.length > 0) {
            let prevParagraph: ParagraphWidget = line.paragraph.previousRenderedWidget as ParagraphWidget;
            this.linkFieldTraversingBackward(prevParagraph.childWidgets[prevParagraph.childWidgets.length - 1] as LineWidget, fieldEnd, this);
        }
        return true;

    }
    /**
     * @private
     */
    public linkFieldTraversingForward(line: LineWidget, fieldBegin: FieldElementBox, previousNode: ElementBox): boolean {
        let i: number = 0;
        if (line.children.indexOf(previousNode) > -1) {
            i = line.children.indexOf(previousNode) + 1;
        }
        for (let j: number = i; j < line.children.length; j++) {
            let node: ElementBox = line.children[j];
            if (node instanceof FieldElementBox) {
                if (node.fieldType === 1) {
                    if (isNullOrUndefined((node as FieldElementBox).fieldBegin)) {
                    fieldBegin.fieldEnd = node as FieldElementBox;
                    }
                    if (fieldBegin.fieldEnd && isNullOrUndefined(fieldBegin.fieldEnd.fieldBegin)) {
                        fieldBegin.fieldEnd.fieldBegin = fieldBegin;
                    }
                    return true;
                } else if (isNullOrUndefined(fieldBegin.fieldSeparator)) {
                    if (node.fieldType === 2 && isNullOrUndefined((node as FieldElementBox).fieldBegin)) {
                        fieldBegin.fieldSeparator = node as FieldElementBox;
                        if (fieldBegin.fieldSeparator && isNullOrUndefined(fieldBegin.fieldSeparator.fieldBegin)) {
                            fieldBegin.fieldSeparator.fieldBegin = fieldBegin;
                        }
                        if (!isNullOrUndefined((node as FieldElementBox).fieldEnd)) {
                            fieldBegin.fieldEnd = (node as FieldElementBox).fieldEnd;
                            fieldBegin.fieldSeparator.fieldEnd = fieldBegin.fieldEnd;
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }
        }
        if (line.nextLine) {
            this.linkFieldTraversingForward(line.nextLine, fieldBegin, this);
        } else if (line.paragraph.nextRenderedWidget instanceof ParagraphWidget
            && line.paragraph.nextRenderedWidget.childWidgets.length > 0) {
            this.linkFieldTraversingForward(line.paragraph.nextRenderedWidget.childWidgets[0] as LineWidget, fieldBegin, this);
        } else if (line.paragraph.nextRenderedWidget instanceof TableWidget) {
            var tableWidget: TableWidget = line.paragraph.nextRenderedWidget as TableWidget;
            tableWidget = tableWidget.getSplitWidgets().pop() as TableWidget;
            if (!isNullOrUndefined(tableWidget.nextRenderedWidget) && tableWidget.nextRenderedWidget instanceof ParagraphWidget && tableWidget.nextRenderedWidget.childWidgets.length > 0) {
                this.linkFieldTraversingForward(tableWidget.nextRenderedWidget.childWidgets[0] as LineWidget, fieldBegin, this);
            }
        }
        return true;
    }
    /**
     * @private
     */
    public linkFieldTraversingBackwardSeparator(line: LineWidget, fieldSeparator: FieldElementBox, previousNode: ElementBox): boolean {
        let index: number = line.children.length - 1;
        if (line.children.indexOf(previousNode) > -1) {
            index = line.children.indexOf(previousNode) - 1;
        }
        for (let i: number = index; i >= 0; i--) {
            let childElement: ElementBox = line.children[i];
            if (childElement instanceof FieldElementBox) {
                if (childElement instanceof FieldElementBox && childElement.fieldType === 0) {
                    if (isNullOrUndefined((childElement as FieldElementBox).fieldSeparator)) {
                        fieldSeparator.fieldBegin = childElement as FieldElementBox;
                    }
                    return !isNullOrUndefined(fieldSeparator.fieldBegin);
                }
            }
        }
        if (line.previousLine) {
            this.linkFieldTraversingBackwardSeparator(line.previousLine, fieldSeparator, this);
        } else if (line.paragraph.previousRenderedWidget instanceof ParagraphWidget
            && line.paragraph.previousRenderedWidget.childWidgets.length > 0) {
            line = line.paragraph.previousRenderedWidget.childWidgets[line.paragraph.previousRenderedWidget.childWidgets.length - 1] as LineWidget;
            this.linkFieldTraversingBackwardSeparator(line, fieldSeparator, this);
        } else {
            return true;
        }
        return true;
    }
    /**
     * @private
     */
    get length(): number {
        return this.getLength();
    }
    /**
     * @private
     */
    get indexInOwner(): number {
        return this.line instanceof LineWidget && this.line.children ? this.line.children.indexOf(this) : -1;
    }
    /**
     * @private
     */
    get previousElement(): ElementBox {
        let index: number = this.indexInOwner;
        if (index > 0 && index < this.line.children.length) {
            return this.line.children[index - 1];
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextElement(): ElementBox {
        let index: number = this.indexInOwner;
        if (index > -1 && index < this.line.children.length - 1) {
            return this.line.children[index + 1];
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextNode(): ElementBox {
        let index: number = this.line.children.indexOf(this);
        let lineIndex: number = this.line.paragraph.childWidgets.indexOf(this.line);
        if (index < this.line.children.length - 1) {
            return this.line.children[index + 1];
        } else if (lineIndex < this.line.paragraph.childWidgets.length - 1) {
            return (this.line.paragraph.childWidgets[lineIndex + 1] as LineWidget).children[0];
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextValidNodeForTracking(): ElementBox {
        let elementBox: ElementBox = this;
        while (!isNullOrUndefined(elementBox) && (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox || elementBox instanceof EditRangeEndElementBox || elementBox instanceof ContentControl)) {
            elementBox = elementBox.nextNode;
        }
        return elementBox;
    }
    /**
     * @private
     */
    get previousValidNodeForTracking(): ElementBox {
        let elementBox: ElementBox = this;
        while (!isNullOrUndefined(elementBox) && (elementBox instanceof BookmarkElementBox || elementBox instanceof CommentCharacterElementBox || elementBox instanceof EditRangeStartElementBox || elementBox instanceof EditRangeEndElementBox || elementBox instanceof ContentControl)) {
            elementBox = elementBox.previousNode;
        }
        return elementBox;
    }
    /**
     * @private
     */
    get previousNode(): ElementBox {
        let index: number = this.line.children.indexOf(this);
        let lineIndex: number = this.line.paragraph.childWidgets.indexOf(this.line);
        if (index > 0) {
            return this.line.children[index - 1];
        } else if (lineIndex > 0) {
            let lineWidget: LineWidget = this.line.paragraph.childWidgets[lineIndex - 1] as LineWidget;
            return lineWidget.children[lineWidget.children.length - 1];
        }
        return undefined;
    }
    /** 
     * @private 
     */
    get paragraph(): ParagraphWidget {
        if (this.line) {
            return this.line.paragraph;
        }
        return undefined;
    }
    /**
     * Initialize the constructor of ElementBox
     */
    constructor() {
        this.characterFormat = new WCharacterFormat(this);
        this.margin = new Margin(0, 0, 0, 0);
    }
    /**
     * @private
     */
    public abstract getLength(): number;
    /**
     * @private
     */
    public abstract clone(): ElementBox;
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.line) && this.line.children && this.line.children.indexOf(this) > -1) {
            let index: number = this.line.children.indexOf(this);
            this.line.children.splice(index, 1);
        }
        this.line = undefined;
        if (this.characterFormat) {
            this.characterFormat.destroy();
        }
        this.characterFormat = undefined;
        if (this.margin) {
            this.margin.destroy();
        }
        this.margin = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.characterFormat) {
            this.characterFormat.destroy();
        }
        this.characterFormat = undefined;
        if (this.margin) {
            this.margin.destroy();
        }
        this.margin = undefined;
        if (this.padding) {
            this.padding.destroy();
        }
        this.padding = undefined;
        this.contentControlProperties = undefined;
        this.line = undefined;
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
    }
}
/** 
 * @private
 */
export class FieldElementBox extends ElementBox {
    /**
     * @private
     */
    public fieldType: number = 0;
    /**
     * @private
     */
    public fieldCodeType: string = '';
    /**
     * @private
     */
    public hasFieldEnd: boolean = false;
    /**
     * @private
     */
    public formFieldData: FormField;
    /**
    * @private
    */
    public fieldBeginInternal: FieldElementBox = undefined;
    private fieldSeparatorInternal: FieldElementBox = undefined;
    private fieldEndInternal: FieldElementBox = undefined;

    get fieldBegin(): FieldElementBox {
        return this.fieldBeginInternal;
    }
    set fieldBegin(field: FieldElementBox) {
        this.fieldBeginInternal = field;
    }
    get fieldSeparator(): FieldElementBox {
        return this.fieldSeparatorInternal;
    }
    set fieldSeparator(field: FieldElementBox) {
        this.fieldSeparatorInternal = field;
    }
    get fieldEnd(): FieldElementBox {
        return this.fieldEndInternal;
    }
    set fieldEnd(field: FieldElementBox) {
        this.fieldEndInternal = field;
    }

    /**
     * @private
     */
    public get resultText(): string {
        if (!isNullOrUndefined(this.formFieldData) && this.fieldType === 0 &&
            !isNullOrUndefined(this.fieldSeparator) && !isNullOrUndefined(this.fieldEnd)) {
            let textElement: ElementBox = this.fieldSeparator.nextElement;
            let text: string = '';
            do {
                if (textElement instanceof TextElementBox) {
                    text += textElement.text;
                }
                textElement = textElement.nextNode;
                if (textElement === this.fieldEnd) {
                    break;
                }
            } while (textElement);
            return text;
        }
        return undefined;
    }
    constructor(type: number) {
        super();
        this.fieldType = type;
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public clone(): FieldElementBox {
        let field: FieldElementBox = new FieldElementBox(this.fieldType);
        if (this.fieldType === 0 && !isNullOrUndefined(this.formFieldData)) {
            field.formFieldData = this.formFieldData.clone();
        }
        field.characterFormat.copyFormat(this.characterFormat);
        if (this.margin) {
            field.margin = this.margin.clone();
        }
        field.width = this.width;
        field.height = this.height;
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    field.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                field.removedIds = Revision.cloneRevisions(this.revisions);
                if (this.fieldEnd) {
                    field.hasFieldEnd = this.hasFieldEnd;
                }
            } else {
                field.removedIds = this.removedIds.slice();
                if (!isNullOrUndefined(this.fieldEnd) && !isNullOrUndefined(this.fieldEnd.paragraph) && !(this.fieldEnd.paragraph.containerWidget instanceof TableCellWidget)) {
                    field.hasFieldEnd = this.hasFieldEnd;
                }
            }
        }
        field.fieldCodeType = this.fieldCodeType;
        return field;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.fieldType = undefined;
        this.hasFieldEnd = undefined;
        this.fieldBeginInternal = undefined;
        this.fieldEndInternal = undefined;
        this.fieldSeparatorInternal = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.formFieldData) {
            this.formFieldData.destroy();
        }
        this.formFieldData = undefined;
        this.fieldCodeType = undefined;
        this.fieldBeginInternal = undefined;
        this.fieldEndInternal = undefined;
        this.fieldSeparatorInternal = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export abstract class FormField {
    /*
     * @private
     */
    public name: string = '';
    /**
     * @private
     */
    public enabled: boolean = true;
    /**
     * @private
     */
    public helpText: string = '';
    /**
     * @private
     */
    public statusText: string = '';
    /**
     * @private
     */
    public abstract clone(): FormField;
    /**
     * @private
     */
    public destroy(): void {
        this.name = undefined;
        this.helpText = undefined;
        this.statusText = undefined;
    }
    /**
     * @private
     */
    public abstract getFormFieldInfo(): TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo;
    /**
     * @private
     */
    public abstract copyFieldInfo(info: TextFormFieldInfo | CheckBoxFormFieldInfo | DropDownFormFieldInfo): void;
}
/** 
 * @private
 */
export class TextFormField extends FormField {
    /**
     * @private
     */
    public type: TextFormFieldType = 'Text';
    /**
     * @private
     */
    public maxLength: number = 0;
    /**
     * @private
     */
    public defaultValue: string = '';
    /**
     * @private
     */
    public format: string = '';

    /**
     * @private
     */
    public clone(): TextFormField {
        let textForm: TextFormField = new TextFormField();
        textForm.type = this.type;
        textForm.name = this.name;
        textForm.enabled = this.enabled;
        textForm.helpText = this.helpText;
        textForm.statusText = this.statusText;
        textForm.maxLength = this.maxLength;
        textForm.defaultValue = this.defaultValue;
        textForm.format = this.format;
        return textForm;
    }
    /**
     * @private
     */
    public getFormFieldInfo(): TextFormFieldInfo {
        let textFormField: TextFormFieldInfo = {
            defaultValue: this.defaultValue,
            enabled: this.enabled,
            format: this.format,
            helpText: this.helpText,
            maxLength: this.maxLength,
            type: this.type,
            name: this.name
        };
        return textFormField;
    }
    /**
     * @private
     */
    public copyFieldInfo(info: TextFormFieldInfo): void {
        if (!isNullOrUndefined(info.defaultValue)) {
            this.defaultValue = info.defaultValue;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.format)) {
            this.format = info.format;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
        if (!isNullOrUndefined(info.maxLength)) {
            this.maxLength = info.maxLength;
        }
        if (!isNullOrUndefined(info.type)) {
            this.type = info.type;
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.format = undefined;
        this.defaultValue = undefined;
        super.destroy();
    }
}
/** 
 * @private
 */
export class CheckBoxFormField extends FormField {
    /**
     * @private
     */
    public sizeType: CheckBoxSizeType = 'Auto';
    /**
     * @private
     */
    public size: number = 11;
    /**
     * @private
     */
    public defaultValue: boolean = false;
    /**
     * @private
     */
    public checked: boolean = false;

    /**
     * @private
     */
    public clone(): CheckBoxFormField {
        let checkBoxForm: CheckBoxFormField = new CheckBoxFormField();
        checkBoxForm.name = this.name;
        checkBoxForm.enabled = this.enabled;
        checkBoxForm.helpText = this.helpText;
        checkBoxForm.statusText = this.statusText;
        checkBoxForm.sizeType = this.sizeType;
        checkBoxForm.size = this.size;
        checkBoxForm.defaultValue = this.defaultValue;
        checkBoxForm.checked = this.checked;
        return checkBoxForm;
    }

    /**
     * @private
     */
    public getFormFieldInfo(): CheckBoxFormFieldInfo {
        let checkBoxFormField: CheckBoxFormFieldInfo = {
            defaultValue: this.defaultValue,
            enabled: this.enabled,
            helpText: this.helpText,
            size: this.size,
            sizeType: this.sizeType,
            name: this.name
        };
        return checkBoxFormField;
    }
    /**
     * @private
     */
    public copyFieldInfo(info: CheckBoxFormFieldInfo): void {
        if (!isNullOrUndefined(info.defaultValue)) {
            this.defaultValue = info.defaultValue;
            this.checked = info.defaultValue;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.size)) {
            this.size = info.size;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
        if (!isNullOrUndefined(info.sizeType)) {
            this.sizeType = info.sizeType;
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        super.destroy();
    }

}
/** 
 * @private
 */
export class DropDownFormField extends FormField {
    /**
     * @private
     */
    public dropdownItems: string[] = [];
    /**
     * @private
     */
    public selectedIndex: number = 0;
    /**
     * @private
     */
    public clone(): DropDownFormField {
        let dropDown: DropDownFormField = new DropDownFormField();
        dropDown.name = this.name;
        dropDown.enabled = this.enabled;
        dropDown.helpText = this.helpText;
        dropDown.statusText = this.statusText;
        dropDown.dropdownItems = this.dropdownItems.slice();
        dropDown.selectedIndex = this.selectedIndex;
        return dropDown;
    }

    /**
     * @private
     */
    public getFormFieldInfo(): DropDownFormFieldInfo {
        let dropDownFormField: DropDownFormFieldInfo = {
            dropdownItems: this.dropdownItems.slice(),
            enabled: this.enabled,
            helpText: this.helpText,
            name: this.name
        };
        return dropDownFormField;
    }
    /**
     * @private
     */
    public copyFieldInfo(info: DropDownFormFieldInfo): void {
        if (!isNullOrUndefined(info.dropdownItems)) {
            this.dropdownItems = info.dropdownItems;
        }
        if (!isNullOrUndefined(info.enabled)) {
            this.enabled = info.enabled;
        }
        if (!isNullOrUndefined(info.helpText)) {
            this.helpText = info.helpText;
        }
    }
    /**
     * @private
     */
     public destroy(): void {
        this.dropdownItems = [];
        this.dropdownItems = undefined;
        super.destroy();
    }
}
/** 
 * @private
 */
export class TextElementBox extends ElementBox {
    /**
     * @private
     */
    public baselineOffset: number = 0;
    /**
     * @private
     */
    public text: string = '';
    /**
     * @private
     */
    public trimEndWidth: number = 0;
    /**
     * @private
     */
    public errorCollection?: ErrorTextElementBox[];
    /**
     * @private
     */
    public ignoreOnceItems?: string[] = [];
    /**
     * @private
     */
    public istextCombined?: boolean = false;
    /**
     * @private
     */
    public scriptType?: FontScriptType = FontScriptType.English;
    /**
     * @private
     */
    public renderedFontFamily?: string = undefined
    constructor() {
        super();
        this.errorCollection = [];
    }
    /**
     * @private
     */
    public getLength(): number {
        return this.text ? this.text.length : 0;
    }
    /**
     * @private
     */
    public clone(): TextElementBox {
        let textEle: TextElementBox = new TextElementBox();
        textEle.characterFormat.copyFormat(this.characterFormat);
        textEle.text = this.text;
        if (this.margin) {
            textEle.margin = this.margin.clone();
        }
        textEle.baselineOffset = this.baselineOffset;
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    textEle.revisions.push(revision.clone());
                }
            }
        } else {
            // Copy the revisions when cloning the header row.
            if (this.paragraph && this.paragraph.isInsideTable && this.paragraph.containerWidget instanceof TableCellWidget && this.paragraph.containerWidget.ownerRow.rowFormat.isHeader) {
                textEle.revisions = this.revisions;
            } else {
                if (this.revisions.length > 0) {
                    textEle.removedIds = Revision.cloneRevisions(this.revisions);
                } else {
                    textEle.removedIds = this.removedIds.slice();
                }
            }
        }
        textEle.width = this.width;
        textEle.height = this.height;
        if (this.contentControlProperties) {
            textEle.contentControlProperties = this.contentControlProperties;
        }
        return textEle;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.text = undefined;
        super.destroy();
    }
    /**
     * @private
     */
    public componentDestroy(): void {
        this.text = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class Footnote {
    /**
     * @private
     */
    public separator: BlockWidget[];
    /**
     * @private
     */
    public continuationSeparator: BlockWidget[];
    /**
     * @private
     */
    public continuationNotice: BlockWidget[];
    constructor() {
        this.separator = [];
        this.continuationNotice = [];
        this.continuationSeparator = [];
    }
    /**
     * @private
     */
    public clear(): void {
        if (this.separator) {
            for (let i: number = 0; i < this.separator.length; i++){
                let bodyWidget: BlockWidget = this.separator[i];
                bodyWidget.destroy();
            }
            this.separator = [];
        }
        if (this.continuationSeparator) {
            for (let i: number = 0; i < this.continuationSeparator.length; i++){
                let bodyWidget: BlockWidget = this.continuationSeparator[i];
                bodyWidget.destroy();
            }
            this.continuationSeparator = [];
        }
        if (this.continuationNotice) {
            for (let i: number = 0; i < this.continuationNotice.length; i++){
                let bodyWidget: BlockWidget = this.continuationNotice[i];
                bodyWidget.destroy();
            }
            this.continuationNotice = [];
        }
    }
    public destroy(): void {
        this.separator = [];
        this.continuationSeparator = [];
        this.continuationNotice = [];
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.separator) {
            for (let i: number = 0; i < this.separator.length; i++){
                let bodyWidget: BlockWidget = this.separator[i];
                bodyWidget.componentDestroy();
            }
            this.separator = [];
        }
        this.separator = undefined;
        if (this.continuationSeparator) {
            for (let i: number = 0; i < this.continuationSeparator.length; i++){
                let bodyWidget: BlockWidget = this.continuationSeparator[i];
                bodyWidget.componentDestroy();
            }
            this.continuationSeparator = [];
        }
        this.continuationSeparator = undefined;
        if (this.continuationNotice) {
            for (let i: number = 0; i < this.continuationNotice.length; i++){
                let bodyWidget: BlockWidget = this.continuationNotice[i];
                bodyWidget.componentDestroy();
            }
            this.continuationNotice = [];
        }
        this.continuationNotice = undefined;
    }
}

/** 
 * @private
 */
export class FootnoteElementBox extends TextElementBox {
    /**
     * @private
     */
    public footnoteType: FootnoteType;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat;
    /**
     * @private
     */
    public bodyWidget: BodyWidget;
    /**
     * @private
     */
    public symbolCode: string;
    /**
     * @private
     */
    public height: number;
    /**
     * @private
     */
    public index: boolean;
    public isLayout: boolean = false;
    /**
     * @private
     */
    public symbolFontName: string;
    /**
     * @private
     */
    public customMarker: string;
    constructor() {
        super();
        this.bodyWidget = new BodyWidget();
        this.bodyWidget.footNoteReference = this;
    }
    public clone(): FootnoteElementBox {
        let span: FootnoteElementBox = new FootnoteElementBox();
        span.text = this.text;
        span.characterFormat.copyFormat(this.characterFormat);
        span.height = this.height;
        span.footnoteType = this.footnoteType;
        span.width = this.width;
        span.symbolCode = this.symbolCode;
        // span.bodyWidget.childWidgets = this.bodyWidget.childWidgets;
        for(let i=0;i<this.bodyWidget.childWidgets.length;i++){
            let element=this.bodyWidget.childWidgets[i];
            if(element instanceof ParagraphWidget){
                element=(this.bodyWidget.childWidgets[i] as ParagraphWidget).clone();
            }else if(element instanceof TableWidget){
                element=(this.bodyWidget.childWidgets[i] as TableWidget).clone();
            }
            span.bodyWidget.childWidgets.push(element);
        }
        span.bodyWidget.page = this.bodyWidget.page;
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    span.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                span.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                span.removedIds = this.removedIds.slice();
            }
        }
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        return span;
    }
    public getLength(): number {
        return 1;
    }
    public destroy(): void {
        this.symbolCode = '';
        this.symbolFontName = '';
        this.customMarker = '';
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        this.symbolCode = '';
        this.symbolFontName = '';
        this.customMarker = '';
        if (this.bodyWidget) {
            this.bodyWidget.componentDestroy();
        }
        this.bodyWidget = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class ErrorTextElementBox extends TextElementBox {
    private startIn: TextPosition = undefined;
    private endIn: TextPosition = undefined;
    get start(): TextPosition {
        return this.startIn;
    }
    set start(value: TextPosition) {
        this.startIn = value;
    }
    get end(): TextPosition {
        return this.endIn;
    }
    set end(value: TextPosition) {
        this.endIn = value;
    }

    constructor() {
        super();
    }
    public destroy(): void {
        this.start = undefined;
        this.end = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.startIn) {
            this.startIn.destroy();
        }
        this.startIn = undefined;
        if (this.endIn) {
            this.endIn.destroy();
        }
        this.endIn = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class FieldTextElementBox extends TextElementBox {
    /**
     * @private
     */
    public fieldBegin: FieldElementBox;
    private fieldText: string = '';
    get text(): string {
        return this.fieldText;
    }
    set text(value: string) {
        this.fieldText = value;
    }
    constructor() {
        super();
    }
    /**
     * @private
     */
    public clone(): FieldTextElementBox {
        let fieldSpan: FieldTextElementBox = new FieldTextElementBox();
        fieldSpan.characterFormat.copyFormat(this.characterFormat);
        fieldSpan.fieldBegin = this.fieldBegin;
        fieldSpan.text = this.text;
        if (this.margin) {
            fieldSpan.margin = this.margin.clone();
        }
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revisionChanges: Revision = this.revisions[i];
                    fieldSpan.revisions.push(revisionChanges.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                fieldSpan.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                fieldSpan.removedIds = this.removedIds.slice();
            }
        }
        fieldSpan.width = this.width;
        fieldSpan.height = this.height;
        return fieldSpan;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        this.fieldText = undefined;
        this.fieldBegin = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
export class TabElementBox extends TextElementBox {

    /**
     * @private
     */
    public tabText: string = '';
    /**
     * @private
     */
    public tabLeader: TabLeader = 'None';
    /**
     * @private
     */
    public destroy(): void {
        this.tabText = undefined;
        this.tabLeader = undefined;
    }
    /**
     * @private
     */
     public componentDestroy(): void {
        this.tabText = undefined;
        this.tabLeader = undefined;
        super.componentDestroy();
    }
    constructor() {
        super();
    }
    /**
     * @private
     */
    public clone(): TabElementBox {
        let tabSpan: TabElementBox = new TabElementBox();
        tabSpan.characterFormat.copyFormat(this.characterFormat);
        tabSpan.tabText = this.tabText;
        tabSpan.tabLeader = this.tabLeader;
        tabSpan.text = this.text;
        if (this.margin) {
            tabSpan.margin = this.margin.clone();
        }
        tabSpan.width = this.width;
        tabSpan.height = this.height;
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    tabSpan.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                tabSpan.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                tabSpan.removedIds = this.removedIds.slice();
            }
        }
        return tabSpan;
    }
}
/** 
 * @private
 */
export class BookmarkElementBox extends ElementBox {
    private bookmarkTypeIn: number = 0;
    private refereneceIn: BookmarkElementBox = undefined;
    private nameIn: string = '';
    private propertiesIn: object;
    /**
     * @private
     */
    get bookmarkType(): number {
        return this.bookmarkTypeIn;
    }
    /**
     * @private
     */
    get properties(): object {
        return this.propertiesIn;
    }
    /**
     * @private
     */
    set properties(properties: object) {
        this.propertiesIn = properties;
    }
    /**
     * @private
     */
    get name(): string {
        return this.nameIn;
    }
    /**
     * @private
     */
    set name(name: string) {
        this.nameIn = name;
    }
    /**
     * @private
     */
    get reference(): BookmarkElementBox {
        return this.refereneceIn;
    }
    /**
     * @private
     */
    set reference(reference: BookmarkElementBox) {
        this.refereneceIn = reference;
    }
    constructor(type: number) {
        super();
        this.bookmarkTypeIn = type;
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.name = undefined;
        this.reference = undefined;
        this.bookmarkTypeIn = undefined;
    }
    /**
     * @private
     */
     public componentDestroy(): void {
        this.name = undefined;
        this.reference = undefined;
        this.bookmarkTypeIn = undefined;
        super.componentDestroy();
    }
    /**
     * Clones the bookmark element box.
     * @param element - book mark element
     */

    /**
     * @private
     */
    public clone(): BookmarkElementBox {
        let span: BookmarkElementBox = new BookmarkElementBox(this.bookmarkType);
        span.name = this.name;
        span.reference = this.reference;
        span.properties = this.properties;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        if (this.revisions.length > 0) {
            span.removedIds = Revision.cloneRevisions(this.revisions);
        } else {
            span.removedIds = this.removedIds.slice();
        }
        span.width = this.width;
        span.height = this.height;
        if (this.contentControlProperties) {
            span.contentControlProperties = this.contentControlProperties;
        }
        return span;
    }
}
/** 
 * @private
 */
export class ContentControl extends ElementBox {
    /**
     * @private
     */
    public contentControlProperties: ContentControlProperties;
    /**
     * @private
     */
    public type: number;
    /**
     * @private
     */
    public reference: ContentControl;
    /**
     * @private
     */
    public contentControlWidgetType: ContentControlWidgetType;

    constructor(widgetType: ContentControlWidgetType) {
        super();
        this.contentControlWidgetType = widgetType;
        this.contentControlProperties = new ContentControlProperties(widgetType);
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public clone(): ElementBox {
        let span: ContentControl = new ContentControl(this.contentControlWidgetType);
        span.characterFormat.copyFormat(this.characterFormat);
        span.contentControlProperties = this.contentControlProperties;
        span.contentControlWidgetType = this.contentControlWidgetType;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revisionChange: Revision = this.revisions[i];
                    span.revisions.push(revisionChange.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                span.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                span.removedIds = this.removedIds.slice();
            }
        }
        span.type = this.type;
        span.width = this.width;
        span.height = this.height;
        span.reference = this.reference;
        return span;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.contentControlProperties = undefined;
        this.contentControlWidgetType = undefined;
        super.destroy();
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.contentControlProperties) {
            this.contentControlProperties.destroy();
            this.contentControlProperties = undefined;
        }
        this.contentControlWidgetType = undefined;
        super.componentDestroy();
    }
}
/** 
 * @private
 */
/** 
 * @private
 */
export class ContentControlProperties {
    /**
     * @private
     */
    public contentControlWidgetType: ContentControlWidgetType;
    /**
     * @private
     */
    public lockContentControl: boolean;
    /**
     * @private
     */
    public lockContents: boolean;
    /**
     * @private
     */
    public tag: string;
    /**
     * @private
     */
    public color: string;
    /**
     * @private
     */
    public title: string;
    /**
     * @private
     */
    public appearance: string;
    /**
     * @private
     */
    public type: ContentControlType;
    /**
     * @private
     */
    public hasPlaceHolderText: boolean;
    /**
     * @private
     */
    public multiline: boolean;
    /**
     * @private
     */
    public isTemporary: boolean;
    /**
     * @private
     */
    public isChecked: boolean;
    /**
     * @private
     */
    public dateCalendarType: string;
    /**
     * @private
     */
    public dateStorageFormat: string;
    /**
     * @private
     */
    public dateDisplayLocale: string;
    /**
     * @private
     */
    public dateDisplayFormat: string;
    /**
     * @private
     */
    public uncheckedState: CheckBoxState;
    /**
     * @private
     */
    public checkedState: CheckBoxState;
    /**
     * @private
     */
    public contentControlListItems: ContentControlListItems[] = [];
    /**
     * @private
     */
    public xmlMapping: XmlMapping;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat;

    constructor(widgetType: ContentControlWidgetType) {
        this.contentControlWidgetType = widgetType;
        this.characterFormat = new WCharacterFormat();
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        if (this.xmlMapping) {
            this.xmlMapping.destroy();
            this.xmlMapping = undefined;
        }
        this.lockContentControl = undefined;
        this.lockContents = undefined;
        this.tag = undefined;
        this.color = undefined;
        this.title = undefined;
        this.appearance = undefined;
        this.type = undefined;
        this.hasPlaceHolderText = undefined;
        this.multiline = undefined;
        this.isTemporary = undefined;
        this.isChecked = undefined;
        this.dateCalendarType = undefined;
        this.dateStorageFormat = undefined;
        this.dateDisplayLocale = undefined;
        this.dateDisplayFormat = undefined;
    }
    /**
     * @private
     */
    public clone(): ContentControlProperties {
        let span: ContentControlProperties = new ContentControlProperties(this.contentControlWidgetType);
        span.lockContentControl = this.lockContentControl;
        span.lockContents = this.lockContents;
        span.tag = this.tag;
        span.color = this.color;
        span.title = this.title;
        span.appearance = this.appearance;
        span.type = this.type;
        span.hasPlaceHolderText = this.hasPlaceHolderText;
        span.multiline = this.multiline;
        span.isTemporary = this.isTemporary;
        span.isChecked = this.isChecked;
        span.dateCalendarType = this.dateCalendarType;
        span.dateStorageFormat = this.dateStorageFormat;
        span.dateDisplayLocale = this.dateDisplayLocale;
        span.dateDisplayFormat = this.dateDisplayFormat;
        if (this.contentControlListItems.length > 0) {
            for (let i: number = 0; i < this.contentControlListItems.length; i++) {
                span.contentControlListItems.push(this.contentControlListItems[i].clone());
            }
        }
        if (this.checkedState) {
            span.checkedState = this.checkedState.clone();
        }
        if (this.uncheckedState) {
            span.uncheckedState = this.uncheckedState.clone();
        }
        if (this.xmlMapping) {
            span.xmlMapping = this.xmlMapping.clone();
        }
        return span;
    }
}
/** 
 * @private
 */
export class ContentControlListItems {
    /**
     * @private
     */
    public displayText: string;
    /**
     * @private
     */
    public value: string;
    /**
     * @private
     */
    public destroy(): void {
        this.displayText = undefined;
        this.value = undefined;
    }
    /**
     * @private
     */
    public clone(): ContentControlListItems {
        let span: ContentControlListItems = new ContentControlListItems();
        span.displayText = this.displayText;
        span.value = this.value;
        return span;
    }
}
/** 
 * @private
 */
export class CheckBoxState {
    /**
     * @private
     */
    public font: string;
    /**
     * @private
     */
    public value: string;
    /**
     * @private
     */
    public destroy(): void {
        this.font = undefined;
        this.value = undefined;
    }
    /**
     * @private
     */
    public clone(): CheckBoxState {
        let span: CheckBoxState = new CheckBoxState();
        span.font = this.font;
        span.value = this.value;
        return span;
    }
}
/** 
 * @private
 */
export class XmlMapping {
    /**
     * @private
     */
    public isMapped: boolean;
    /**
     * @private
     */
    public isWordMl: boolean;
    /**
     * @private
     */
    public prefixMapping: string;
    /**
     * @private
     */
    public xPath: string;
    /**
     * @private
     */
    public storeItemId: string;
    /**
     * @private
     */
    public customXmlPart: CustomXmlPart;
    /**
     * @private
     */
    public destroy(): void {
        this.isMapped = undefined;
        this.isWordMl = undefined;
        this.prefixMapping = undefined;
        this.xPath = undefined;
        this.storeItemId = undefined;
        this.customXmlPart = undefined;
    }
    /**
     * @private
     */
    public clone(): XmlMapping {
        let span: XmlMapping = new XmlMapping();
        span.isMapped = this.isMapped;
        span.isWordMl = this.isWordMl;
        span.prefixMapping = this.prefixMapping;
        span.xPath = this.xPath;
        span.storeItemId = this.storeItemId;
        if (this.customXmlPart) {
            span.customXmlPart = this.customXmlPart.clone();
        }
        return span;
    }
}
/** 
 * @private
 */
export class CustomXmlPart {
    /**
     * @private
     */
    public id: string;
    /**
     * @private
     */
    public xml: string;
    /**
     * @private
     */
    public destroy(): void {
        this.id = undefined;
        this.xml = undefined;
    }
    /**
     * @private
     */
    public clone(): CustomXmlPart {
        let span: CustomXmlPart = new CustomXmlPart();
        span.id = this.id;
        span.xml = this.xml;
        return span;
    }
}
/** 
 * @private
 */
export class ShapeCommon extends ElementBox {
    /**
     * @private
     */
    public shapeId: number;
    /**
     * @private
     */
    public name: string = '';
    /**
     * @private
     */
    public alternateText: string = '';
    /**
     * @private
     */
    public title: string = '';
    /**
     * @private
     */
    public visible: boolean;
    /**
     * @private
     */
    public width: number;
    /**
     * @private
     */
    public height: number;
    /**
     * @private
     */
    public widthScale: number;
    /**
     * @private
     */
    public heightScale: number;
    /**
     * @private
     */
    public lineFormat: LineFormat;
    /**
     * @private
     */
    public fillFormat: FillFormat;
    /**
     * 
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */

    public clone(): ShapeCommon {
        let shape: ShapeElementBox = new ShapeElementBox();
        return shape;

    }
}
/** 
 * @private
 */
export class ShapeBase extends ShapeCommon {
    /**
     * @private
     */
    public verticalPosition: number = 0;
    /**
     * @private
     */
    public verticalOrigin: VerticalOrigin;
    /**
     * @private
     */
    public verticalAlignment: VerticalAlignment;
    /**
     * @private
     */
    public verticalRelativePercent: number;
    /**
     * @private
     */
    public horizontalPosition: number = 0;
    /**
     * @private
     */
    public heightRelativePercent: number;
    /**
     * @private
     */
    public widthRelativePercent: number;
    /**
     * @private
     */
    public horizontalOrigin: HorizontalOrigin;
    /**
     * @private
     */
    public horizontalAlignment: HorizontalAlignment;
    /**
     * @private
     */
    public horizontalRelativePercent: number;
    /**
     * @private
     */
    public zOrderPosition: number;
    /**
     * @private
     */
    public allowOverlap: boolean;
    /**
     * @private
     */
    public textWrappingStyle: TextWrappingStyle = 'Inline';
    /**
     * @private
     */
    public textWrappingType: TextWrappingType;
    /**
     * @private
     */
    public distanceBottom: number = 0;
    /**
     * @private
     */
    public distanceLeft: number = 0;
    /**
     * @private
     */
    public distanceRight: number = 0;
    /**
     * @private
     */
    public distanceTop: number = 0;
    /**
     * @private
     */
    public layoutInCell: boolean;
    /**
     * @private
     */
    public lockAnchor: boolean;
    /**
     * @private
     */
    public isBelowText: boolean;
    /**
     * @private
     */
    public isHorizontalRule: boolean;
     /**
     * @private
     */
     public editingPoints: {};
}
/** 
 * @private
 */
export class ShapeElementBox extends ShapeBase {
    /**
     * @private
     */
    public textFrame: TextFrame;
    /**
     * @private
     */
    public isZeroHeight: boolean;
    /**
     * @private
     */
    public autoShapeType: AutoShapeType;
    /**
     * @private
     */
    public clone(): ShapeElementBox {
        let shape: ShapeElementBox = new ShapeElementBox();
        shape.characterFormat.copyFormat(this.characterFormat);
        shape.x = this.x;
        shape.y = this.y;
        shape.width = this.width;
        shape.height = this.height;
        shape.shapeId = this.shapeId;
        shape.name = this.name;
        shape.alternateText = this.alternateText;
        shape.title = this.title;
        shape.widthScale = this.widthScale;
        shape.heightScale = this.heightScale;
        shape.visible = this.visible;
        shape.verticalPosition = this.verticalPosition;
        shape.verticalAlignment = this.verticalAlignment;
        shape.verticalOrigin = this.verticalOrigin;
        shape.verticalRelativePercent = this.verticalRelativePercent;
        shape.horizontalPosition = this.horizontalPosition;
        shape.horizontalAlignment = this.horizontalAlignment;
        shape.horizontalOrigin = this.horizontalOrigin;
        shape.horizontalRelativePercent = this.horizontalRelativePercent;
        shape.heightRelativePercent = this.heightRelativePercent;
        shape.widthRelativePercent = this.widthRelativePercent;
        shape.zOrderPosition = this.zOrderPosition;
        shape.allowOverlap = this.allowOverlap;
        shape.textWrappingStyle = this.textWrappingStyle;
        shape.textWrappingType = this.textWrappingType;
        shape.distanceBottom = this.distanceBottom;
        shape.distanceLeft = this.distanceLeft;
        shape.distanceRight = this.distanceRight;
        shape.distanceTop = this.distanceTop;
        shape.editingPoints  = this.editingPoints;
        shape.layoutInCell = this.layoutInCell;
        shape.lockAnchor = this.lockAnchor;
        shape.autoShapeType = this.autoShapeType;
        if (this.lineFormat) {
            shape.lineFormat = this.lineFormat.clone();
        }
        if (this.fillFormat) {
            shape.fillFormat = this.fillFormat.clone();
        }
        if (this.textFrame) {
            shape.textFrame = this.textFrame.clone();
            shape.textFrame.containerShape = shape;
        }
        if (this.margin) {
            shape.margin = this.margin.clone();
        }
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    shape.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                shape.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                shape.removedIds = this.removedIds.slice();
            }
        }
        return shape;
    }
}
/** 
 * @private
 */
export class TextFrame extends Widget {
    /**
     * @private
     */
    public containerShape: ElementBox;
    /**
     * @private
     */
    public textVerticalAlignment: VerticalAlignment;
    /**
     * @private
     */
    public marginLeft: number = 0;
    /**
     * @private
     */
    public marginRight: number = 0;
    /**
     * @private
     */
    public marginTop: number = 0;
    /**
     * @private
     */
    public marginBottom: number = 0;

    public equals(): boolean {
        return false;
    }
    public destroyInternal(): void {
        //return;
    }
    public getHierarchicalIndex(index: string): string {
        let line: LineWidget = this.containerShape.line;
        let offset: string = line.getOffset(this.containerShape, 0).toString();
        return line.getHierarchicalIndex(offset);
    }
    public getTableCellWidget(): TableCellWidget {
        return undefined;
    }
    /**
     * @private
     */
    public clone(): TextFrame {
        let textFrame: TextFrame = new TextFrame();
        textFrame.textVerticalAlignment = this.textVerticalAlignment;
        textFrame.marginBottom = this.marginBottom;
        textFrame.marginLeft = this.marginLeft;
        textFrame.marginRight = this.marginRight;
        textFrame.marginTop = this.marginTop;
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = (this.childWidgets[i] as BlockWidget).clone();
            textFrame.childWidgets.push(block);
            block.index = i;
            block.containerWidget = textFrame;
        }

        return textFrame;
    }
}
/** 
 * @private
 */
export class LineFormat {
    /**
     * @private
     */
    public line: boolean;
    /**
     * @private
     */
    public lineFormatType: LineFormatType;
    /**
     * @private
     */
    public color: string;
    /**
     * @private
     */
    public weight: number;
    /**
     * @private
     */
    public dashStyle: LineDashing;
    /**
     * @private
     */
    public clone(): LineFormat {
        let lineFormat: LineFormat = new LineFormat();
        lineFormat.lineFormatType = this.lineFormatType;
        lineFormat.color = this.color;
        lineFormat.weight = this.weight;
        lineFormat.dashStyle = this.dashStyle;
        lineFormat.line = this.line;
        return lineFormat;
    }
}
/** 
 * @private
 */
export class FillFormat {
    /**
     * @private
     */
    public color: string;
    /**
     * @private
     */
    public fill: boolean;
    /**
     * @private
     */
    public clone(): FillFormat {
        let fillFormat: FillFormat = new FillFormat();
        fillFormat.color = this.color;
        fillFormat.fill = this.fill;
        return fillFormat;
    }
}
/** 
 * @private
 */
export class ImageElementBox extends ShapeBase {
    private imageStr: string = '';
    private imgElement: HTMLImageElement = undefined;
    private isInlineImageIn: boolean = true;
    private crop: boolean = false;
    /**
     * @private
     */
    public get isCrop(): boolean {
        return this.crop;
    }
    public set isCrop(value: boolean) {
        this.crop = value;
        if (value) {
            let right: number = 0;
            let bottom: number = 0;
            if (this.left !== 0) {
                this.cropX = (this.left * this.cropWidthScale) / 100;
            } else {
                this.cropX = 0;
            }
            if (this.top !== 0) {
                this.cropY = (this.top * this.cropHeightScale) / 100;
            } else {
                this.cropY = 0;
            }
            if (this.right !== 0) {
                right = (this.right * this.cropWidthScale) / 100;
            }
            if (this.bottom !== 0) {
                bottom = (this.bottom * this.cropHeightScale) / 100;
            }
            this.cropWidth = (this.cropWidthScale - (this.cropX + right));
            this.cropHeight = (this.cropHeightScale - (this.cropY + bottom));
        }
    }
    /**
     * @private
     */
    public cropX: number;
    /**
     * @private
     */
    public cropY: number;
    /**
     * @private
     */
    public cropWidth: number;
    /**
     * @private
     */
    public cropHeight: number;
    /**
     * @private
     */
    public cropWidthScale: number;
    /**
     * @private
     */
    public cropHeightScale: number;
    /**
     * @private
     */
    public left: number = 0;
    /**
     * @private
     */
    public top: number = 0;
    /**
     * @private
     */
    public right: number = 0;
    /**
     * @private
     */
    public bottom: number = 0;
    /**
     * @private
     */
    public isMetaFile: boolean = false;
    /**
     * @private
     */
    public isCompressed: boolean = false;
    /**
     * @private
     */
    public metaFileImageString: string;
    /**
     * @private
     */
    get isInlineImage(): boolean {
        return this.isInlineImageIn;
    }
    /**
     * @private
     */
    get element(): HTMLImageElement {
        if (isNullOrUndefined(this.imgElement)) {
            this.imgElement = document.createElement('img');
        }
        return this.imgElement;
    }
    /**
     * @private
     */
    get length(): number {
        return 1;
    }
    /**
     * @private
     */
    get imageString(): string {
        return this.imageStr;
    }
    /**
     * @private
     */
    set imageString(value: string) {
        this.imageStr = value;
    }
    constructor(isInlineImage?: boolean) {
        super();
        this.isInlineImageIn = isInlineImage;
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public clone(): ImageElementBox {
        let image: ImageElementBox = new ImageElementBox(this.isInlineImage);
        image.characterFormat.copyFormat(this.characterFormat);
        image.imageString = this.imageString;
        image.element.src = this.element.src;
        image.isMetaFile = this.isMetaFile;
        image.isCompressed = this.isCompressed;
        image.metaFileImageString = this.metaFileImageString;
        image.width = this.width;
        image.height = this.height;
        image.top = this.top;
        image.left = this.left;
        image.bottom = this.bottom;
        image.right = this.right;
        image.cropHeightScale = this.cropHeightScale;
        image.cropWidthScale = this.cropWidthScale;
        image.cropX = this.cropX;
        image.cropY = this.cropY;
        image.isCrop = this.isCrop;
        image.x = this.x;
        image.y = this.y;
        if (this.margin) {
            image.margin = this.margin.clone();
        }
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    image.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                image.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                image.removedIds = this.removedIds.slice();
            }
        }
        image.name = this.name;
        image.alternateText = this.alternateText;
        image.title = this.title;
        image.visible = this.visible;
        image.widthScale = this.widthScale;
        image.heightScale = this.heightScale;
        image.verticalPosition = this.verticalPosition;
        image.verticalOrigin = this.verticalOrigin;
        image.verticalAlignment = this.verticalAlignment;
        image.horizontalPosition = this.horizontalPosition;
        image.horizontalOrigin = this.horizontalOrigin;
        image.horizontalAlignment = this.horizontalAlignment;
        image.allowOverlap = this.allowOverlap;
        image.textWrappingStyle = this.textWrappingStyle;
        image.textWrappingType = this.textWrappingType;
        image.layoutInCell = this.layoutInCell;
        image.zOrderPosition = this.zOrderPosition;
        return image;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.imgElement = undefined;
        this.imageString = undefined;
        this.isInlineImageIn = undefined;
        super.destroy();
    }
}
/** 
 * @private
 */
export class ListTextElementBox extends ElementBox {
    /**
     * @private
     */
    public baselineOffset: number = 0;
    /**
     * @private
     */
    public text: string;
    /**
     * @private
     */
    public trimEndWidth: number = 0;
    /**
     * @private
     */
    public listLevel: WListLevel;
    /**
     * @private
     */
    public isFollowCharacter: boolean = false;
    constructor(listLevel: WListLevel, isListFollowCharacter: boolean) {
        super();
        this.listLevel = listLevel;
        this.isFollowCharacter = isListFollowCharacter;
    }
    /**
     * @private
     */
    public getLength(): number {
        return this.text ? this.text.length : 0;
    }
    /**
     * @private
     */
    public clone(): ListTextElementBox {
        let list: ListTextElementBox = new ListTextElementBox(this.listLevel, this.isFollowCharacter);
        list.text = this.text;
        list.baselineOffset = this.baselineOffset;
        if (this.margin) {
            list.margin = this.margin.clone();
        }
        list.width = this.width;
        list.height = this.height;
        return list;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.text = undefined;
        super.destroy();
    }
}
/** 
 * @private
 */
export class EditRangeEndElementBox extends ElementBox {
    /**
     * @private
     */
    public editRangeStart: EditRangeStartElementBox = undefined;
    public editRangeId: number = -1;

    constructor() {
        super();
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.editRangeStart = undefined;
    }


    /**
     * @private
     */
    public clone(): EditRangeEndElementBox {
        let end: EditRangeEndElementBox = new EditRangeEndElementBox();
        end.editRangeStart = this.editRangeStart;
        end.editRangeId = this.editRangeId;
        return end;
    }
}
/** 
 * @private
 */
export class EditRangeStartElementBox extends ElementBox {
    /**
     * @private
     */
    public columnFirst: number = -1;
    /**
     * @private
     */
    public columnLast: number = -1;
    /**
     * @private
     */
    public user: string = '';
    /**
     * @private
     */
    public group: string = '';
    /**
     * @private
     */
    public editRangeEnd: EditRangeEndElementBox;
    public editRangeId: number = -1;
    /**
     * Edit range mark
     * @private
     */
    public editRangeMark: HTMLElement;

    constructor() {
        super();
    }
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public renderLockMark(currentUser: string, locale: L10n): void {
        if (isNullOrUndefined(this.editRangeMark)) {
            let user: string = currentUser === this.user ? 'you' : this.user;
            this.editRangeMark = document.createElement('div');
            this.editRangeMark.style.display = 'none';
            this.editRangeMark.classList.add('e-de-lock-mark');
            let span: HTMLElement = document.createElement('span');
            span.className = 'e-icons e-de-ctnr-lock';
            this.editRangeMark.appendChild(span);
            this.editRangeMark.title = locale.getConstant('This region is locked by') + ' ' + user;
        }
        if (this.line && isNullOrUndefined(this.editRangeMark.parentElement)) {
            let documentHelper: DocumentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
            documentHelper.pageContainer.appendChild(this.editRangeMark);
        }
    }
    /**
     * @private
     */
    public removeEditRangeMark(): void {
        if (this.editRangeMark) {
            this.editRangeMark.parentElement.removeChild(this.editRangeMark);
            this.editRangeMark = undefined;
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.user = undefined;
        this.columnFirst = undefined;
        this.columnLast = undefined;
    }
    /**
     * @private
     */
    public clone(): EditRangeStartElementBox {
        let start: EditRangeStartElementBox = new EditRangeStartElementBox();
        start.columnFirst = this.columnFirst;
        start.columnLast = this.columnLast;
        start.user = this.user;
        start.group = this.group;
        start.editRangeEnd = this.editRangeEnd;
        start.editRangeId = this.editRangeId;
        return start;
    }
}
/** 
 * @private
 */
export class ChartElementBox extends ImageElementBox {
    /**
     * @private
     */
    private div: HTMLDivElement;
    /**
     * @private
     */
    private officeChartInternal: ChartComponent;
    /**
     * @private
     */
    private chartTitle: string = '';
    /**
     * @private
     */
    private chartType: string = '';
    /**
     * @private
     */
    private gapWidth: number;
    /**
     * @private
     */
    private overlap: number;
    /**
     * @private
     */
    private chartElement: HTMLDivElement = undefined;
    /**
     * @private
     */
    public chartArea: ChartArea;
    /**
     * @private
     */
    public chartPlotArea: ChartArea;
    /**
     * @private
     */
    public chartCategory: ChartCategory[] = [];
    /**
     * @private
     */
    public chartSeries: ChartSeries[] = [];
    /**
     * @private
     */
    public chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    public chartLegend: ChartLegend;
    /**
     * @private
     */
    public chartPrimaryCategoryAxis: ChartCategoryAxis;
    /**
     * @private
     */
    public chartPrimaryValueAxis: ChartCategoryAxis;
    /**
     * @private
     */
    public chartDataTable: ChartDataTable;
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    get title(): string {
        return this.chartTitle;
    }
    /**
     * @private
     */
    set title(value: string) {
        this.chartTitle = value;
    }
    /**
     * @private
     */
    get type(): string {
        return this.chartType;
    }
    /**
     * @private
     */
    set type(value: string) {
        this.chartType = value;
    }
    /**
     * @private
     */
    get chartGapWidth(): number {
        return this.gapWidth;
    }
    /**
     * @private
     */
    set chartGapWidth(value: number) {
        this.gapWidth = value;
    }
    /**
     * @private
     */
    get chartOverlap(): number {
        return this.overlap;
    }
    /**
     * @private
     */
    set chartOverlap(value: number) {
        this.overlap = value;
    }
    /**
     * @private
     */
    get targetElement(): HTMLDivElement {
        if (isNullOrUndefined(this.div)) {
            this.div = createElement('div') as HTMLDivElement;
        }
        return this.div;
    }
    /**
     * @private
     */
    get officeChart(): ChartComponent {
        return this.officeChartInternal;
    }
    /**
     * @private
     */
    set officeChart(value: ChartComponent) {
        if (value) {
            this.officeChartInternal = value;
            this.officeChartInternal.chart.loaded = this.onChartLoaded.bind(this);
        }
    }
    /**
     * @private
     */
    constructor() {
        super();
        this.chartArea = new ChartArea();
        this.chartPlotArea = new ChartArea();
        this.chartTitleArea = new ChartTitleArea();
        this.chartLegend = new ChartLegend();
        this.chartPrimaryCategoryAxis = new ChartCategoryAxis();
        this.chartPrimaryValueAxis = new ChartCategoryAxis();
        this.chartDataTable = new ChartDataTable();
    }

    private onChartLoaded(): void {
        this.officeChart.convertChartToImage(this.officeChart.chart, this.width, this.height).then((dataURL: string) => {
            this.imageString = dataURL;
            this.element.src = dataURL;
        });
    }
    /**
     * @private
     */
    public clone(): ChartElementBox {
        let chart: ChartElementBox = new ChartElementBox();
        chart.chartTitle = this.chartTitle;
        chart.chartType = this.chartType;
        chart.height = this.height;
        chart.width = this.width;
        chart.gapWidth = this.gapWidth;
        chart.overlap = this.overlap;
        for (let i: number = 0; i < this.chartCategory.length; i++) {
            let chartCategory: ChartCategory = (this.chartCategory[i] as ChartCategory).clone();
            chart.chartCategory.push(chartCategory);
        }
        for (let i: number = 0; i < this.chartSeries.length; i++) {
            let series: ChartSeries = (this.chartSeries[i] as ChartSeries).clone();
            chart.chartSeries.push(series);
        }
        chart.chartArea = this.chartArea.clone();
        chart.chartPlotArea = this.chartPlotArea.clone();
        chart.chartLegend = this.chartLegend.clone();
        chart.chartTitleArea = this.chartTitleArea.clone();
        chart.chartPrimaryCategoryAxis = this.chartPrimaryCategoryAxis.clone();
        chart.chartPrimaryValueAxis = this.chartPrimaryValueAxis.clone();
        chart.chartDataTable = this.chartDataTable.clone();
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        super.destroy();
        if (this.officeChartInternal) {
            this.officeChartInternal.chart.loaded = undefined;
            this.officeChartInternal.destroy();
            this.officeChartInternal = undefined;
        }
        if (this.div) {
            this.div = undefined;
        }
        this.chartTitle = undefined;
        this.chartType = undefined;
        this.chartArea = undefined;
        this.chartPlotArea = undefined;
        this.chartCategory = [];
        this.chartSeries = [];
        this.chartTitleArea = undefined;
        this.chartLegend = undefined;
        this.chartPrimaryCategoryAxis = undefined;
        this.chartPrimaryValueAxis = undefined;
        this.chartDataTable = undefined;
        this.chartElement = undefined;
    }
}

/** 
 * @private
 */
export class ChartArea {
    /**
     * @private
     */
    private foreColor: string;
    /**
     * @private
     */
    get chartForeColor(): string {
        return this.foreColor;
    }
    /**
     * @private
     */
    set chartForeColor(value: string) {
        this.foreColor = value;
    }
    /**
     * @private
     */
    public clone(): ChartArea {
        let chart: ChartArea = new ChartArea();
        chart.foreColor = this.foreColor;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.foreColor = undefined;
    }
}

/** 
 * @private
 */
export class ChartCategory {
    /**
     * @private
     */
    private categoryXName: string = '';
    /**
     * @private
     */
    public chartData: ChartData[] = [];
    /**
     * @private
     */
    get xName(): string {
        return this.categoryXName;
    }
    /**
     * @private
     */
    set xName(value: string) {
        this.categoryXName = value;
    }
    /**
     * @private
     */
    public clone(): ChartCategory {
        let chart: ChartCategory = new ChartCategory();
        chart.categoryXName = this.categoryXName;
        for (let i: number = 0; i < this.chartData.length; i++) {
            let chartData: ChartData = (this.chartData[i] as ChartData).clone();
            chart.chartData.push(chartData);
        }
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.categoryXName = undefined;
        this.chartData = [];
    }
}
/** 
 * @private
 */
export class ChartData {
    private yValue: number;
    private xValue: number;
    private size: number;
    /**
     * @private
     */
    get yAxisValue(): number {
        return this.yValue;
    }
    /**
     * @private
     */
    set yAxisValue(value: number) {
        this.yValue = value;
    }
    /**
     * @private
     */
    get xAxisValue(): number {
        return this.xValue;
    }
    /**
     * @private
     */
    set xAxisValue(value: number) {
        this.xValue = value;
    }
    /**
     * @private
     */
    get bubbleSize(): number {
        return this.size;
    }
    /**
     * @private
     */
    set bubbleSize(value: number) {
        this.size = value;
    }
    /**
     * @private
     */
    public clone(): ChartData {
        let chart: ChartData = new ChartData();
        chart.yValue = this.yValue;
        chart.xValue = this.xValue;
        chart.size = this.size;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.xValue = undefined;
        this.yValue = undefined;
        this.size = undefined;
    }
}

/** 
 * @private
 */
export class ChartLegend {
    /**
     * @private
     */
    private legendPostion: string;
    /**
     * @private
     */
    public chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    get chartLegendPostion(): string {
        return this.legendPostion;
    }
    /**
     * @private
     */
    set chartLegendPostion(value: string) {
        this.legendPostion = value;
    }
    /**
     * @private
     */
    constructor() {
        this.chartTitleArea = new ChartTitleArea();
    }
    /**
     * @private
     */
    public clone(): ChartLegend {
        let chart: ChartLegend = new ChartLegend();
        chart.legendPostion = this.legendPostion;
        chart.chartTitleArea = this.chartTitleArea.clone();
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.legendPostion = undefined;
        this.chartTitleArea = undefined;
    }
}

/** 
 * @private
 */
export class ChartSeries {
    /**
     * @private
     */
    public chartDataFormat: ChartDataFormat[] = [];
    /**
     * @private
     */
    public errorBar: ChartErrorBar;
    /**
     * @private
     */
    public seriesFormat: ChartSeriesFormat;
    /**
     * @private
     */
    public trendLines: ChartTrendLines[] = [];
    /**
     * @private
     */
    private name: string;
    /**
     * @private
     */
    private sliceAngle: number;
    /**
     * @private
     */
    private holeSize: number;
    /**
     * @private
     */
    public dataLabels: ChartDataLabels;
    /**
     * @private
     */
    get seriesName(): string {
        return this.name;
    }
    /**
     * @private
     */
    set seriesName(value: string) {
        this.name = value;
    }
    /**
     * @private
     */
    get firstSliceAngle(): number {
        return this.sliceAngle;
    }
    /**
     * @private
     */
    set firstSliceAngle(value: number) {
        this.sliceAngle = value;
    }
    /**
     * @private
     */
    get doughnutHoleSize(): number {
        return this.holeSize;
    }
    /**
     * @private
     */
    set doughnutHoleSize(value: number) {
        this.holeSize = value;
    }
    constructor() {
        this.errorBar = new ChartErrorBar();
        this.dataLabels = new ChartDataLabels();
        this.seriesFormat = new ChartSeriesFormat();
    }
    /**
     * @private
     */
    public clone(): ChartSeries {
        let chart: ChartSeries = new ChartSeries();
        chart.name = this.name;
        chart.sliceAngle = this.sliceAngle;
        chart.holeSize = this.holeSize;
        chart.errorBar = this.errorBar.clone();
        chart.dataLabels = this.dataLabels.clone();
        chart.seriesFormat = this.seriesFormat.clone();
        for (let i: number = 0; i < this.chartDataFormat.length; i++) {
            let format: ChartDataFormat = (this.chartDataFormat[i].clone());
            chart.chartDataFormat.push(format);
        }
        for (let i: number = 0; i < this.trendLines.length; i++) {
            let trendLine: ChartTrendLines = (this.trendLines[i].clone());
            chart.trendLines.push(trendLine);
        }
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.name = undefined;
        this.errorBar = undefined;
        this.trendLines = undefined;
        this.chartDataFormat = [];
    }
}

/** 
 * @private
 */
export class ChartErrorBar {
    /**
     * @private
     */
    private type: string;
    /**
     * @private
     */
    private direction: string;
    /**
     * @private
     */
    private errorValue: number;
    /**
     * @private
     */
    private endStyle: string;
    /**
     * @private
     */
    get errorType(): string {
        return this.type;
    }
    /**
     * @private
     */
    set errorType(value: string) {
        this.type = value;
    }
    /**
     * @private
     */
    get errorDirection(): string {
        return this.direction;
    }
    /**
     * @private
     */
    set errorDirection(value: string) {
        this.direction = value;
    }
    /**
     * @private
     */
    get errorEndStyle(): string {
        return this.endStyle;
    }
    /**
     * @private
     */
    set errorEndStyle(value: string) {
        this.endStyle = value;
    }
    get numberValue(): number {
        return this.errorValue;
    }
    /**
     * @private
     */
    set numberValue(value: number) {
        this.errorValue = value;
    }
    /**
     * @private
     */
    public clone(): ChartErrorBar {
        let chart: ChartErrorBar = new ChartErrorBar();
        chart.type = this.type;
        chart.errorDirection = this.errorDirection;
        chart.endStyle = this.endStyle;
        chart.errorValue = this.errorValue;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.type = undefined;
        this.errorDirection = undefined;
        this.endStyle = undefined;
    }
}

/** 
 * @private
 */
export class ChartSeriesFormat {
    /**
     * @private
     */
    private style: string;
    /**
     * @private
     */
    private color: string;
    /**
     * @private
     */
    private size: number;
    /**
     * @private
     */
    get markerStyle(): string {
        return this.style;
    }
    /**
     * @private
     */
    set markerStyle(value: string) {
        this.style = value;
    }
    /**
     * @private
     */
    get markerColor(): string {
        return this.color;
    }
    /**
     * @private
     */
    set markerColor(value: string) {
        this.color = value;
    }
    /**
     * @private
     */
    get numberValue(): number {
        return this.size;
    }
    /**
     * @private
     */
    set numberValue(value: number) {
        this.size = value;
    }
    /**
     * @private
     */
    public clone(): ChartSeriesFormat {
        let chart: ChartSeriesFormat = new ChartSeriesFormat();
        chart.style = this.style;
        chart.color = this.color;
        chart.size = this.size;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.style = undefined;
        this.color = undefined;
        this.size = undefined;
    }
}

/** 
 * @private
 */
export class ChartDataLabels {
    /**
     * @private
     */
    private position: string;
    /**
     * @private
     */
    private name: string;
    /**
     * @private
     */
    private color: string;
    /**
     * @private
     */
    private size: number;
    /**
     * @private
     */
    private isLegend: boolean;
    /**
     * @private
     */
    private isBubble: boolean;
    /**
     * @private
     */
    private isCategory: boolean;
    /**
     * @private
     */
    private isSeries: boolean;
    /**
     * @private
     */
    private isValueEnabled: boolean;
    /**
     * @private
     */
    private isPercentageEnabled: boolean;
    /**
     * @private
     */
    private showLeaderLines: boolean;
    /**
     * @private
     */
    get labelPosition(): string {
        return this.position;
    }
    /**
     * @private
     */
    set labelPosition(value: string) {
        this.position = value;
    }
    /**
     * @private
     */
    get fontName(): string {
        return this.name;
    }
    /**
     * @private
     */
    set fontName(value: string) {
        this.name = value;
    }
    /**
     * @private
     */
    get fontColor(): string {
        return this.color;
    }
    /**
     * @private
     */
    set fontColor(value: string) {
        this.color = value;
    }
    /**
     * @private
     */
    get fontSize(): number {
        return this.size;
    }
    /**
     * @private
     */
    set fontSize(value: number) {
        this.size = value;
    }
    /**
     * @private
     */
    get isLegendKey(): boolean {
        return this.isLegend;
    }
    /**
     * @private
     */
    set isLegendKey(value: boolean) {
        this.isLegend = value;
    }
    /**
     * @private
     */
    get isBubbleSize(): boolean {
        return this.isBubble;
    }
    /**
     * @private
     */
    set isBubbleSize(value: boolean) {
        this.isBubble = value;
    }
    /**
     * @private
     */
    get isCategoryName(): boolean {
        return this.isCategory;
    }
    /**
     * @private
     */
    set isCategoryName(value: boolean) {
        this.isCategory = value;
    }
    /**
     * @private
     */
    get isSeriesName(): boolean {
        return this.isSeries;
    }
    /**
     * @private
     */
    set isSeriesName(value: boolean) {
        this.isSeries = value;
    }
    /**
     * @private
     */
    get isValue(): boolean {
        return this.isValueEnabled;
    }
    /**
     * @private
     */
    set isValue(value: boolean) {
        this.isValueEnabled = value;
    }
    /**
     * @private
     */
    get isPercentage(): boolean {
        return this.isPercentageEnabled;
    }
    /**
     * @private
     */
    set isPercentage(value: boolean) {
        this.isPercentageEnabled = value;
    }
    /**
     * @private
     */
    get isLeaderLines(): boolean {
        return this.showLeaderLines;
    }
    /**
     * @private
     */
    set isLeaderLines(value: boolean) {
        this.showLeaderLines = value;
    }
    /**
     * @private
     */
    public clone(): ChartDataLabels {
        let chart: ChartDataLabels = new ChartDataLabels();
        chart.position = this.position;
        chart.name = this.name;
        chart.color = this.color;
        chart.size = this.size;
        chart.isBubble = this.isBubble;
        chart.isLegend = this.isLegend;
        chart.isCategory = this.isCategory;
        chart.isSeries = this.isSeries;
        chart.isValueEnabled = this.isValueEnabled;
        chart.isPercentageEnabled = this.isPercentageEnabled;
        chart.showLeaderLines = this.showLeaderLines;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.position = undefined;
    }
}

/** 
 * @private
 */
export class ChartTrendLines {
    /**
     * @private
     */
    private type: string;
    /**
     * @private
     */
    private name: string;
    /**
     * @private
     */
    private backward: number;
    /**
     * @private
     */
    private forward: number;
    /**
     * @private
     */
    private intercept: number;
    /**
     * @private
     */
    private displayRSquared: boolean;
    /**
     * @private
     */
    private displayEquation: boolean;
    /**
     * @private
     */
    get trendLineType(): string {
        return this.type;
    }
    /**
     * @private
     */
    set trendLineType(value: string) {
        this.type = value;
    }
    /**
     * @private
     */
    get trendLineName(): string {
        return this.name;
    }
    /**
     * @private
     */
    set trendLineName(value: string) {
        this.name = value;
    }
    /**
     * @private
     */
    get interceptValue(): number {
        return this.intercept;
    }
    /**
     * @private
     */
    set interceptValue(value: number) {
        this.intercept = value;
    }
    /**
     * @private
     */
    get forwardValue(): number {
        return this.forward;
    }
    /**
     * @private
     */
    set forwardValue(value: number) {
        this.forward = value;
    }
    /**
     * @private
     */
    get backwardValue(): number {
        return this.backward;
    }
    /**
     * @private
     */
    set backwardValue(value: number) {
        this.backward = value;
    }
    /**
     * @private
     */
    get isDisplayRSquared(): boolean {
        return this.displayRSquared;
    }
    /**
     * @private
     */
    set isDisplayRSquared(value: boolean) {
        this.displayRSquared = value;
    }
    /**
     * @private
     */
    get isDisplayEquation(): boolean {
        return this.displayEquation;
    }
    /**
     * @private
     */
    set isDisplayEquation(value: boolean) {
        this.displayEquation = value;
    }
    /**
     * @private
     */
    public clone(): ChartTrendLines {
        let chart: ChartTrendLines = new ChartTrendLines();
        chart.type = this.type;
        chart.name = this.name;
        chart.forward = this.forward;
        chart.backward = this.backward;
        chart.intercept = this.intercept;
        chart.displayEquation = this.displayEquation;
        chart.displayRSquared = this.displayRSquared;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.type = undefined;
        this.name = undefined;
        this.forward = undefined;
        this.backward = undefined;
    }
}

/** 
 * @private
 */
export class ChartTitleArea {
    /**
     * @private
     */
    private fontName: string;
    /**
     * @private
     */
    private fontSize: number;
    /**
     * @private
     */
    public dataFormat: ChartDataFormat;
    /**
     * @private
     */
    public layout: ChartLayout;
    /**
     * @private
     */
    get chartfontName(): string {
        return this.fontName;
    }
    /**
     * @private
     */
    set chartfontName(value: string) {
        this.fontName = value;
    }
    /**
     * @private
     */
    get chartFontSize(): number {
        return this.fontSize;
    }
    /**
     * @private
     */
    set chartFontSize(value: number) {
        this.fontSize = value;
    }
    /**
     * @private
     */
    constructor() {
        this.dataFormat = new ChartDataFormat();
        this.layout = new ChartLayout();
    }
    /**
     * @private
     */
    public clone(): ChartTitleArea {
        let chart: ChartTitleArea = new ChartTitleArea();
        chart.fontName = this.fontName;
        chart.fontSize = this.fontSize;
        chart.dataFormat = this.dataFormat.clone();
        chart.layout = this.layout.clone();
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.fontName = undefined;
        this.fontSize = undefined;
        this.dataFormat = undefined;
        this.layout = undefined;
    }
}

/** 
 * @private
 */
export class ChartDataFormat {
    /**
     * @private
     */
    public line: ChartFill;
    /**
     * @private
     */
    public fill: ChartFill;
    /**
     * @private
     */
    public id: number;
    /**
     * @private
     */
    constructor() {
        this.fill = new ChartFill();
        this.line = new ChartFill();
    }
    /**
     * @private
     */
    public clone(): ChartDataFormat {
        let chart: ChartDataFormat = new ChartDataFormat();
        chart.fill = this.fill.clone();
        chart.line = this.line.clone();
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.fill = undefined;
        this.line = undefined;
    }
}

/** 
 * @private
 */
export class ChartFill {
    /**
     * @private
     */
    private fillColor: string;
    /**
     * @private
     */
    private fillRGB: string;
    /**
     * @private
     */
    get color(): string {
        return this.fillColor;
    }
    /**
     * @private
     */
    set color(value: string) {
        this.fillColor = value;
    }
    /**
     * @private
     */
    get rgb(): string {
        return this.fillRGB;
    }
    /**
     * @private
     */
    set rgb(value: string) {
        this.fillRGB = value;
    }
    /**
     * @private
     */
    public clone(): ChartFill {
        let chart: ChartFill = new ChartFill();
        chart.fillColor = this.fillColor;
        chart.fillRGB = this.fillRGB;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.fillColor = undefined;
        this.fillRGB = undefined;
    }
}

/** 
 * @private
 */
export class ChartLayout {
    /**
     * @private
     */
    private layoutX: number;
    /**
     * @private
     */
    private layoutY: number;
    /**
     * @private
     */
    get chartLayoutLeft(): number {
        return this.layoutX;
    }
    /**
     * @private
     */
    set chartLayoutLeft(value: number) {
        this.layoutX = value;
    }
    /**
     * @private
     */
    get chartLayoutTop(): number {
        return this.layoutY;
    }
    /**
     * @private
     */
    set chartLayoutTop(value: number) {
        this.layoutY = value;
    }
    /**
     * @private
     */
    public clone(): ChartLayout {
        let chart: ChartLayout = new ChartLayout();
        chart.layoutX = this.layoutX;
        chart.layoutY = this.layoutY;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.layoutX = undefined;
        this.layoutY = undefined;
    }
}

/** 
 * @private
 */
export class ChartCategoryAxis {
    /**
     * @private
     */
    private title: string;
    /**
     * @private
     */
    private fontSize: number;
    /**
     * @private
     */
    private fontName: string;
    /**
     * @private
     */
    private categoryType: string;
    /**
     * @private
     */
    private numberFormat: string;
    /**
     * @private
     */
    public chartTitleArea: ChartTitleArea;
    /**
     * @private
     */
    private hasMajorGridLines: boolean;
    /**
     * @private
     */
    private hasMinorGridLines: boolean;
    /**
     * @private
     */
    private majorTickMark: string;
    /**
     * @private
     */
    private minorTickMark: string;
    /**
     * @private
     */
    private tickLabelPostion: string;
    /**
     * @private
     */
    private majorUnit: number;
    /**
     * @private
     */
    private isAutoMajor: boolean;
    /**
     * @private
     */
    private minimumValue: number;
    /**
     * @private
     */
    private maximumValue: number;
    /**
     * @private
     */
    get majorTick(): string {
        return this.majorTickMark;
    }
    /**
     * @private
     */
    set majorTick(value: string) {
        this.majorTickMark = value;
    }
    /**
     * @private
     */
    get minorTick(): string {
        return this.minorTickMark;
    }
    /**
     * @private
     */
    set minorTick(value: string) {
        this.minorTickMark = value;
    }
    /**
     * @private
     */
    get tickPosition(): string {
        return this.tickLabelPostion;
    }
    /**
     * @private
     */
    set tickPosition(value: string) {
        this.tickLabelPostion = value;
    }
    /**
     * @private
     */
    get minorGridLines(): boolean {
        return this.hasMinorGridLines;
    }
    /**
     * @private
     */
    set minorGridLines(value: boolean) {
        this.hasMinorGridLines = value;
    }
    /**
     * @private
     */
    get majorGridLines(): boolean {
        return this.hasMajorGridLines;
    }
    /**
     * @private
     */
    set majorGridLines(value: boolean) {
        this.hasMajorGridLines = value;
    }
    /**
     * @private
     */
    get interval(): number {
        return this.majorUnit;
    }
    /**
     * @private
     */
    set interval(value: number) {
        this.majorUnit = value;
    }
    /**
     * @private
     */
    get isAutoInternal(): boolean {
        return this.isAutoMajor;
    }
    /**
     * @private
     */
    set isAutoInternal(value: boolean) {
        this.isAutoMajor = value;
    }
    /**
     * @private
     */
    get max(): number {
        return this.maximumValue;
    }
    /**
     * @private
     */
    set max(value: number) {
        this.maximumValue = value;
    }
    /**
     * @private
     */
    get min(): number {
        return this.minimumValue;
    }
    /**
     * @private
     */
    set min(value: number) {
        this.minimumValue = value;
    }
    /**
     * @private
     */
    get categoryAxisTitle(): string {
        return this.title;
    }
    /**
     * @private
     */
    set categoryAxisTitle(value: string) {
        this.title = value;
    }
    /**
     * @private
     */
    get categoryAxisType(): string {
        return this.categoryType;
    }
    /**
     * @private
     */
    set categoryAxisType(value: string) {
        this.categoryType = value;
    }
    /**
     * @private
     */
    get categoryNumberFormat(): string {
        return this.numberFormat;
    }
    /**
     * @private
     */
    set categoryNumberFormat(value: string) {
        this.numberFormat = value;
    }
    /**
     * @private
     */
    get axisFontSize(): number {
        return this.fontSize;
    }
    /**
     * @private
     */
    set axisFontSize(value: number) {
        this.fontSize = value;
    }
    /**
     * @private
     */
    get axisFontName(): string {
        return this.fontName;
    }
    /**
     * @private
     */
    set axisFontName(value: string) {
        this.fontName = value;
    }
    constructor() {
        this.chartTitleArea = new ChartTitleArea();
    }
    /**
     * @private
     */
    public clone(): ChartCategoryAxis {
        let chart: ChartCategoryAxis = new ChartCategoryAxis();
        chart.title = this.title;
        chart.categoryType = this.categoryType;
        chart.numberFormat = this.numberFormat;
        chart.fontSize = this.fontSize;
        chart.fontName = this.fontName;
        chart.hasMajorGridLines = this.hasMajorGridLines;
        chart.hasMinorGridLines = this.hasMinorGridLines;
        chart.minimumValue = this.minimumValue;
        chart.maximumValue = this.maximumValue;
        chart.majorUnit = this.majorUnit;
        chart.isAutoMajor = this.isAutoMajor;
        chart.majorTickMark = this.majorTickMark;
        chart.minorTickMark = this.minorTickMark;
        chart.tickLabelPostion = this.tickLabelPostion;
        chart.chartTitleArea = this.chartTitleArea.clone();
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.title = undefined;
        this.categoryType = undefined;
        this.numberFormat = undefined;
        this.chartTitleArea = undefined;
        this.minimumValue = undefined;
        this.maximumValue = undefined;
        this.fontSize = undefined;
        this.fontName = undefined;
        this.majorUnit = undefined;
        this.majorTickMark = undefined;
        this.minorTickMark = undefined;
        this.tickLabelPostion = undefined;
    }
}

/** 
 * @private
 */
export class ChartDataTable {
    /**
     * @private
     */
    private isSeriesKeys: boolean;
    /**
     * @private
     */
    private isHorzBorder: boolean;
    /**
     * @private
     */
    private isVertBorder: boolean;
    /**
     * @private
     */
    private isBorders: boolean;
    /**
     * @private
     */
    get showSeriesKeys(): boolean {
        return this.isSeriesKeys;
    }
    /**
     * @private
     */
    set showSeriesKeys(value: boolean) {
        this.isSeriesKeys = value;
    }
    /**
     * @private
     */
    get hasHorzBorder(): boolean {
        return this.isHorzBorder;
    }
    /**
     * @private
     */
    set hasHorzBorder(value: boolean) {
        this.isHorzBorder = value;
    }
    /**
     * @private
     */
    get hasVertBorder(): boolean {
        return this.isVertBorder;
    }
    /**
     * @private
     */
    set hasVertBorder(value: boolean) {
        this.isVertBorder = value;
    }
    /**
     * @private
     */
    get hasBorders(): boolean {
        return this.isBorders;
    }
    /**
     * @private
     */
    set hasBorders(value: boolean) {
        this.isBorders = value;
    }
    /**
     * @private
     */
    public clone(): ChartDataTable {
        let chart: ChartDataTable = new ChartDataTable();
        chart.isSeriesKeys = this.isSeriesKeys;
        chart.isHorzBorder = this.isHorzBorder;
        chart.isVertBorder = this.isVertBorder;
        chart.isBorders = this.isBorders;
        return chart;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.isSeriesKeys = undefined;
        this.isHorzBorder = undefined;
        this.isVertBorder = undefined;
        this.isBorders = undefined;
    }
}
/**
 * @private
 */
export class CommentCharacterElementBox extends ElementBox {
    public commentType: number = 0;

    public commentId: string = '';


    private commentInternal: CommentElementBox;

    public commentMark: HTMLElement;

    get comment(): CommentElementBox {
        return this.commentInternal;
    }

    set comment(value: CommentElementBox) {
        this.commentInternal = value;
    }
    public getLength(): number {
        return 1;
    }
    public clone(): ElementBox {
        let comment: CommentCharacterElementBox = new CommentCharacterElementBox(this.commentType);
        comment.commentId = this.commentId;
        comment.commentType = this.commentType;
        if (!isNullOrUndefined(this.commentInternal)) {
            comment.commentInternal = this.commentInternal.clone() as CommentElementBox;
        }
        return comment;
    }
    constructor(type: number) {
        super();
        this.commentType = type;
    }

    public renderCommentMark(topPosition?: string, leftPosition?: string): void {
        let documentHelper: DocumentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
        let commentMarkDictionary:Dictionary<HTMLElement,CommentCharacterElementBox[]>=documentHelper.render.commentMarkDictionary;
        if (this.commentType === 0 && isNullOrUndefined(this.commentMark)) {
            this.commentMark = document.createElement('div');
            this.commentMark.style.display = 'none';
            this.commentMark.classList.add('e-de-cmt-mark');
            let span: HTMLElement = document.createElement('span');
            span.classList.add('e-icons');
            span.classList.add('e-de-cmt-mark-icon');
            this.commentMark.appendChild(span);
        }
        if (this.line && isNullOrUndefined(this.commentMark.parentElement)) {
            documentHelper.pageContainer.appendChild(this.commentMark);
            this.commentMark.addEventListener('click', this.selectComment.bind(this));
        }

        let positionOverlap:boolean=false;
        let overlapKey:HTMLElement;
        for (let index = 0; index < commentMarkDictionary.length; index++) {
            if(this.elementsOverlap(commentMarkDictionary.keys[index],topPosition,leftPosition)){
                positionOverlap=true;
                overlapKey=commentMarkDictionary.keys[index];
                break;
            }  
        }
        if(positionOverlap){
            let ifNotPresent:boolean=true;
            for (let index = 0; index < commentMarkDictionary.get(overlapKey).length; index++) {
                if(commentMarkDictionary.get(overlapKey)[index]===this){
                    ifNotPresent=false;
                    break;
                }
            }
            if(ifNotPresent){
                commentMarkDictionary.get(overlapKey).push(this);
            }
        }
        else{
            commentMarkDictionary.add(this.commentMark,[this]);
        } 
        
        for (let index = 0; index < commentMarkDictionary.length; index++){
            let element:HTMLElement=commentMarkDictionary.keys[index];
            
            if(commentMarkDictionary.get(element).length==1){
                if(commentMarkDictionary.get(element)[0].commentMark){
                    if(commentMarkDictionary.get(element)[0].commentMark.firstElementChild.classList.contains('e-de-multi-cmt-mark')){
                        classList(commentMarkDictionary.get(element)[0].commentMark.firstElementChild,['e-de-cmt-mark-icon'],['e-de-multi-cmt-mark']);
                    } else if(commentMarkDictionary.get(element)[0].commentInternal.isResolved && commentMarkDictionary.get(element)[0].commentMark.firstElementChild.classList.contains('e-de-cmt-mark-icon')) {    
                        classList(commentMarkDictionary.get(element)[0].commentMark.
                        firstElementChild,['e-de-cmt-resolve-icon'],['e-de-cmt-mark-icon']);               
                   } else if(!commentMarkDictionary.get(element)[0].commentInternal.isResolved && commentMarkDictionary.get(element)[0].commentMark.firstElementChild.classList.contains('e-de-cmt-resolve-icon')){
                        classList(commentMarkDictionary.get(element)[0].commentMark.firstElementChild,['e-de-cmt-mark-icon'],['e-de-cmt-resolve-icon']);
                      }
                }
            }

            if(commentMarkDictionary.get(element).length>1){
                for (let z = 0; z < commentMarkDictionary.get(element).length; z++) {
                    let resolve = true;
                    for (var z_1 = 0; z_1 < commentMarkDictionary.get(element).length; z_1++) {
                        if (commentMarkDictionary.get(element)[z_1].commentInternal && !commentMarkDictionary.get(element)[z_1].commentInternal.isResolved) {
                                resolve = false;
                                break;
                        } 
                    }

                    if(commentMarkDictionary.get(element)[z].commentMark){
                    if(commentMarkDictionary.get(element)[z].commentMark.firstElementChild.classList.contains('e-de-cmt-mark-icon')){
                    classList(commentMarkDictionary.get(element)[z].commentMark.firstElementChild,['e-de-multi-cmt-mark'],['e-de-cmt-mark-icon']);}
                    else if(!resolve && commentMarkDictionary.get(element)[z].commentMark.firstElementChild.classList.contains('e-de-multi-cmt-resolve')){classList(commentMarkDictionary.get(element)[z].commentMark.firstElementChild,['e-de-multi-cmt-mark'],['e-de-multi-cmt-resolve']);}
                    else if(resolve){
                        classList(commentMarkDictionary.get(element)[z].commentMark.firstElementChild,['e-de-multi-cmt-resolve'],['e-de-multi-cmt-mark']);
                    }
                }   
            }
        }

        }
    }

    private elementsOverlap(elementOne: HTMLElement, top: string, left: string) {
        const width: number = elementOne.offsetWidth;
        const height: number = elementOne.offsetHeight;
        const elementOneTop: number = parseFloat(elementOne.style.top);
        const elementOneLeft: number = parseFloat(elementOne.style.left);
        const elementOneBottom: number = elementOneTop + height;
        const elementOneRight: number = elementOneLeft + width;
        const elementTwoTop: number = parseFloat(top);
        const elementTwoLeft: number = parseFloat(left);
        const elementTwoBottom: number = elementTwoTop + height;
        const elementTwoRight: number = elementTwoLeft + width;
        return !(
            elementOneTop > elementTwoBottom ||
            elementOneRight < elementTwoLeft ||
            elementOneBottom < elementTwoTop ||
            elementOneLeft > elementTwoRight
        );
    }

    public selectComment(): void {
        let documentHelper: DocumentHelper = this.line.paragraph.bodyWidget.page.documentHelper;
        let commentMarkDictionary:Dictionary<HTMLElement,CommentCharacterElementBox[]>=documentHelper.render.commentMarkDictionary;
        let topPosition:string=this.commentMark.style.top;
        let leftPosition:string=this.commentMark.style.left;
        let currentIndex:number=0;
        let navigationArray:CommentCharacterElementBox[]=[];
        for (let index = 0; index < commentMarkDictionary.keys.length; index++) {
            if(this.elementsOverlap(commentMarkDictionary.keys[index],topPosition,leftPosition)){
                navigationArray=commentMarkDictionary.get(commentMarkDictionary.keys[index]);
                break;
            }
            
        }
        if(!documentHelper.owner.documentHelper.currentSelectedComment){
            currentIndex=0;
        }
        else{
            for (let index = 0; index < navigationArray.length; index++) {
                if(navigationArray[index].comment===documentHelper.owner.documentHelper.currentSelectedComment){
                    currentIndex=index;
                    break;
                }                
            }
            if(currentIndex<(navigationArray.length-1)){
                currentIndex+=1;
            }
            else{
                currentIndex=0;
            }
        }
        if (documentHelper.owner) {
            if (!documentHelper.owner.commentReviewPane.commentPane.isEditMode) {
                documentHelper.selectComment(navigationArray[currentIndex].comment);
            } else {
                documentHelper.owner.showComments = true;
            }
        }
    }

    public removeCommentMark(): void {
        if (this.commentMark && this.commentMark.parentElement) {
            this.commentMark.removeEventListener('click', this.selectComment.bind(this));
            this.commentMark.parentElement.removeChild(this.commentMark);
        }
    }

    public destroy(): void {
        if (this.commentMark) {
            this.removeCommentMark();
        }
        this.commentMark = undefined;
        this.commentInternal = undefined;
        this.commentId = undefined;
        super.componentDestroy();
    }
}

/**
 * @private
 */
export class CommentElementBox extends CommentCharacterElementBox {

    private commentStartIn: CommentCharacterElementBox;

    private commentEndIn: CommentCharacterElementBox;

    /**
     * 
     * @private
     */

    public createdDate: string;

    private authorIn: string = '';

    private initialIn: string = '';

    private done: boolean = false;

    private posted: boolean = false;

    private textIn: string = '';

    public replyComments: CommentElementBox[];

    public isReply: boolean = false;

    public ownerComment: CommentElementBox = undefined;

    private mentionsIn: FieldSettingsModel[] = [];

    get commentStart(): CommentCharacterElementBox {
        return this.commentStartIn;
    }
    set commentStart(value: CommentCharacterElementBox) {
        this.commentStartIn = value;
    }
    get commentEnd(): CommentCharacterElementBox {
        return this.commentEndIn;
    }
    set commentEnd(value: CommentCharacterElementBox) {
        this.commentEndIn = value;
    }
    get author(): string {
        return this.authorIn;
    }
    set author(value: string) {
        this.authorIn = value;
    }
    get initial(): string {
        return this.initialIn;
    }
    set initial(value: string) {
        this.initialIn = value;
    }
    get isResolved(): boolean {
        return this.done;
    }
    set isResolved(value: boolean) {
        this.done = value;
    }

    get date(): string {
        return this.createdDate;
    }

    get text(): string {
        return this.textIn;
    }

    set text(value: string) {
        this.textIn = value;
    }

    get mentions(): FieldSettingsModel[] {
        return this.mentionsIn;
    }

    set mentions(value: FieldSettingsModel[]) {
        this.mentionsIn = value;
    }

    get isPosted(): boolean {
        return this.posted;
    }

    set isPosted(value: boolean) {
        this.posted = value;
    }
    
    constructor(date: string) {
        super(0);
        this.createdDate = date;
        this.replyComments = [];
    }

    public getLength(): number {
        return 1;
    }

    public clone(): ElementBox {
        let comment: CommentElementBox = new CommentElementBox(this.date);
        comment.author = this.author;
        comment.initial = this.initial;
        comment.commentId = this.commentId;
        comment.replyComments = this.replyComments;
        comment.isResolved = this.isResolved;
        comment.text = this.text;
        return comment;
    }

    public destroy(): void {
        if (this.replyComments && this.replyComments.length > 0) {
            for (let i: number = 0; i < this.replyComments.length; i++) {
                let replyComment: CommentElementBox = this.replyComments[i] as CommentElementBox;
                replyComment.destroy();
            }
            this.replyComments = [];
        }
        this.replyComments = undefined;
        if (this.commentStartIn) {
            this.commentStartIn.destroy();
            this.commentStartIn = undefined;
        }
        if (this.commentEndIn) {
            this.commentEndIn.destroy();
            this.commentEndIn = undefined;
        }
        this.commentId = undefined;
        this.createdDate = undefined;
        this.initialIn = undefined;
        this.textIn = undefined;
        this.authorIn = undefined;
        this.ownerComment = undefined;
        super.destroy();
    }
}

/** 
 * @private
 */
export class Page {
    /**
     * Specifies the Viewer
     * @private
     */
    public documentHelper: DocumentHelper;
    /**
     * Specifies the Bonding Rectangle
     * @private
     */
    public boundingRectangle: Rect = new Rect(96, 96, 816, 1056);
    /**
     * @private
     */
    public repeatHeaderRowTableWidget: boolean = false;
    /**
     * Specifies the bodyWidgets
     * @default []
     * @private
     */
    public bodyWidgets: BodyWidget[] = [];
    /**
     * @private
     */
    public headerWidgetIn: HeaderFooterWidget = undefined;
    /**
     * @private
     */
    public footerWidgetIn: HeaderFooterWidget = undefined;
    /**
     * @private
     */
    public footnoteWidget: FootNoteWidget = undefined;
    /**
     * @private
     */
    public endnoteWidget: FootNoteWidget = undefined;
    /**
     * @private
     */
    public currentPageNum: number = 1;
    /**
     * @private
     */
    public allowNextPageRendering: boolean = true;
    /**
     * @private
     */
    get headerWidget(): HeaderFooterWidget {
        if (!isNullOrUndefined(this.headerWidgetIn)) {
            if (this.headerWidgetIn.parentHeaderFooter) {
                return this.headerWidgetIn.parentHeaderFooter;
            }
        }
        return this.headerWidgetIn;
    }
    /**
     * @private
     */
    set headerWidget(value: HeaderFooterWidget) {
        this.headerWidgetIn = value;
    }
    /**
     * @private
     */
    get footerWidget(): HeaderFooterWidget {
        if (!isNullOrUndefined(this.footerWidgetIn)) {
            if (this.footerWidgetIn.parentHeaderFooter) {
                return this.footerWidgetIn.parentHeaderFooter;
            }
        }
        return this.footerWidgetIn;
    }
    /**
     * @private
     */
    set footerWidget(value: HeaderFooterWidget) {
        this.footerWidgetIn = value;
    }
    /**
     * @private
     */
    get index(): number {
        if (this.documentHelper) {
            return this.documentHelper.pages.indexOf(this);
        }
        return -1;
    }
    /**
     * @private
     */
    get previousPage(): Page {
        let index: number = this.index;
        if (index > 0) {
            return this.documentHelper.pages[index - 1];
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextPage(): Page {
        let index: number = this.index;
        if (index < this.documentHelper.pages.length - 1) {
            return this.documentHelper.pages[index + 1];
        }
        return undefined;
    }
    /**
     * @private
     */
    get sectionIndex(): number {
        if (this.bodyWidgets.length > 0) {
            return this.bodyWidgets[0].index;
        }
        return -1;
    }
    /** 
     * Initialize the constructor of Page
     */
    constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        // let text: string = 'DocumentEditor';

    }
    get viewer(): LayoutViewer {
        return this.documentHelper.owner.viewer;
    }

    public destroy(): void {
        if (this.headerWidget && this.headerWidget.page === this) {
            this.headerWidget.page = undefined;
        }
        if (this.footerWidget && this.footerWidget.page === this) {
            this.footerWidget.page = undefined;
        }
        if (this.headerWidgetIn && !isNullOrUndefined(this.headerWidgetIn.parentHeaderFooter)) {
            if (this.viewer && this.documentHelper.owner.editorModule) {
                this.documentHelper.owner.editorModule.removeFieldInWidget(this.headerWidgetIn);
                // Remove content control
                this.documentHelper.owner.editorModule.removeFieldInWidget(this.headerWidgetIn, false, true);
            }
            this.headerWidgetIn.destroy();
            this.headerWidget = undefined;
        }
        if (this.footerWidgetIn && !isNullOrUndefined(this.footerWidgetIn.parentHeaderFooter)) {
            if (this.viewer && this.documentHelper.owner.editorModule) {
                this.documentHelper.owner.editorModule.removeFieldInWidget(this.footerWidgetIn);
                // Remove content control
                this.documentHelper.owner.editorModule.removeFieldInWidget(this.footerWidgetIn, false, true);
            }
            this.footerWidgetIn.destroy();
            this.footerWidgetIn = undefined;
        }
        this.bodyWidgets = [];
        this.bodyWidgets = undefined;
        if (!isNullOrUndefined(this.documentHelper)) {
            if (!isNullOrUndefined(this.documentHelper.pages)) {
                this.documentHelper.removePage(this);
            }
        }
        this.documentHelper = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        if (this.headerWidgetIn) {
            this.headerWidgetIn.componentDestroy();
            this.headerWidgetIn = undefined;
        }
        if (this.footerWidgetIn) {
            this.footerWidgetIn.componentDestroy();
            this.footerWidgetIn = undefined;
        }
        if (this.bodyWidgets) {
            for (let i: number = 0; i < this.bodyWidgets.length; i++) {
                let bodyWidget: BodyWidget = this.bodyWidgets[i];
                bodyWidget.componentDestroy();
            }
            this.bodyWidgets = [];
            this.bodyWidgets = undefined;
        }
        this.documentHelper = undefined;
    }
}

/** 
 * @private
 */
export class WTableHolder {
    private tableColumns: WColumn[] = [];
    /**
     * @private
     */
    public tableWidth: number = 0;


    get columns(): WColumn[] {
        return this.tableColumns;
    }
    /**
     * @private
     */
    public resetColumns(): void {
        for (let i: number = 0; i < this.tableColumns.length; i++) {
            this.tableColumns[i].destroy();
        }
        this.tableColumns = [];
    }
    /**
     * @private
     */
    public getPreviousSpannedCellWidth(previousColumnIndex: number, curColumnIndex: number): number {
        let width: number = 0;
        for (let i: number = previousColumnIndex; i < curColumnIndex; i++) {
            width += this.tableColumns[i].preferredWidth;
        }
        return width;
    }
    /**
     * @private
     */
    public addColumns(currentColumnIndex: number, columnSpan: number, width: number, sizeInfo: ColumnSizeInfo, offset: number, preferredWidthType: WidthType): void {
        for (let i: number = this.columns.length; i < columnSpan; i++) {
            this.columns.push(new WColumn());
        }
        let availableWidth: number = 0;
        for (let j: number = currentColumnIndex; j < columnSpan; j++) {
            availableWidth += this.columns[j].preferredWidth;
        }
        // If width to add is greater than preferred width, then preferred width will be increased.
        // In case of Grid span > 1, only last grid column width will be updated.
        let gridSpan: number = columnSpan - currentColumnIndex;
        if (!(gridSpan > 1) && availableWidth < width) {
            this.columns[columnSpan - 1].preferredWidth += (width - availableWidth);
        }
        if (sizeInfo.minimumWordWidth > this.columns[columnSpan - 1].minimumWordWidth) {
            this.columns[columnSpan - 1].minimumWordWidth = sizeInfo.minimumWordWidth;
        }
        if (sizeInfo.maximumWordWidth > this.columns[columnSpan - 1].maximumWordWidth) {
            this.columns[columnSpan - 1].maximumWordWidth = sizeInfo.maximumWordWidth;
        }
        if (sizeInfo.minimumWidth > this.columns[columnSpan - 1].minimumWidth) {
            this.columns[columnSpan - 1].minimumWidth = sizeInfo.minimumWidth;
        }
        if (offset > this.columns[columnSpan - 1].endOffset) {
            this.columns[columnSpan - 1].endOffset = offset;
        }
        this.columns[columnSpan - 1].widthType = preferredWidthType;
    }
    /**
     * @private
     */
    public getTotalWidth(type: number): number {
        let width: number = 0;
        for (let i: number = 0; i < this.columns.length; i++) {
            let column: WColumn = this.columns[i];
            width += type === 0 ? column.preferredWidth :
                type === 1 ? column.minimumWordWidth :
                    type === 2 ? column.maximumWordWidth : column.minimumWidth;
        }
        return width;
    }
    /**
     * @private
     */
    public isFitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean): boolean {
        // Gets total preferred width.
        let totalColumnWidth: number = this.getTotalWidth(0);

        // If auto table width, based on total column widths, minimum value will be updated.
        if (isAutoWidth) {
            this.tableWidth = preferredTableWidth > totalColumnWidth ? totalColumnWidth : preferredTableWidth;
        } else {
            this.tableWidth = preferredTableWidth;
        }

        // If total columns width doesn't match table width, then all grid column widths will be updated by even factor.
        // If totalColumnWidth < TableWidth, all grid columns are enlarged. Otherwise shrinked.
        if (totalColumnWidth !== this.tableWidth) {
            let factor: number = this.tableWidth / totalColumnWidth;
            factor = isNaN(factor) || factor === Infinity ? 1 : factor;
            for (let i: number = 0; i < this.columns.length; i++) {
                let column: WColumn = this.columns[i];
                //column.PreferredWidth = factor * column.PreferredWidth;
                if (factor * column.preferredWidth < column.minWidth) {
                    return false;
                }
            }
            return true;
        } else {
            return true;
        }
    }
    /**
     * @private
     */
    public isAllColumnHasPointWidthType(): boolean {
        let isPointWidthType: boolean = true;
        for (let i: number = 0; i < this.columns.length; i++) {
            if (this.columns[i].widthType != 'Point') {
                isPointWidthType = false;
            }
        }
        return isPointWidthType;
    }

    /**
     * @private
     */
    public autoFitColumn(containerWidth: number, preferredTableWidth: number, isAuto: boolean, isNestedTable: boolean, isAutoFit: boolean, hasSpannedCells: boolean, indent?: number, pageContainerWidth?: number): void {
        // Cell's preferred width should be considered until the table width fits to the container width.
        let maxTotal: number = 0;
        let minTotal: number = 0;
        // For preferred width set as 0 pixels (not auto), then minimum word width only need to be considered.
        // But currently there is no way to find any one of cell in particular column has 0 px preferred width set.
        // If all columns are set as 0 pixels, then this will work.
        let remainingWidthTotal: number = 0;
        let isAllColumnPointWidth: boolean = true;
        let minWidthExceedCellWidth = 0;
        let columnIndexCollection: number[] = []
        for (let i: number = 0; i < this.columns.length; i++) {
            let column: WColumn = this.columns[i];
            // If preferred width of column is less than column minimum width and also column is empty, considered column preferred width
            if (column.minimumWordWidth === 0 && column.maximumWordWidth === 0 && column.minWidth === 0) {
                column.minimumWordWidth = column.preferredWidth;
                column.maximumWordWidth = column.preferredWidth;
                column.minWidth = column.preferredWidth;
            }
            if (column.widthType !== 'Point') {
                isAllColumnPointWidth = false;
            }
            let difference: number = 0;
            maxTotal += column.preferredWidth > column.maximumWordWidth ? column.preferredWidth : column.maximumWordWidth;
            minTotal += column.preferredWidth > column.minimumWordWidth ? column.preferredWidth : column.minimumWordWidth;
            let preferred: number = column.preferredWidth === 0 ? column.minimumWordWidth : column.preferredWidth > column.minimumWordWidth ? column.preferredWidth : column.minimumWordWidth;
            difference = column.maximumWordWidth - preferred;
            remainingWidthTotal += difference > 0 ? difference : 0;
            if (column.preferredWidth < column.minimumWordWidth) {
                minWidthExceedCellWidth += column.minimumWordWidth - column.preferredWidth;
            } else {
                columnIndexCollection.push(i);
            }
        }
        // Try to fit maximum word width to match preferredTableWidth.
        if (maxTotal <= preferredTableWidth) {
            for (let i: number = 0; i < this.columns.length; i++) {
                let column: WColumn = this.columns[i];
                if (column.widthType === 'Point') {
                    if (column.preferredWidth < column.minimumWordWidth) {
                        column.preferredWidth = column.minimumWordWidth;
                    }
                    continue;
                }
                if (column.preferredWidth < column.maximumWordWidth) {
                    // if (isNestedTable) {
                    //     column.preferredWidth = column.minimumWidth + column.minimumWordWidth;
                    // } else {
                    column.preferredWidth = column.maximumWordWidth;
                    //}
                }
            }
            // If the width is defined for table(cells undefined) then fit the columns to preferred table width using FitColumns.
            if (!isAuto) {
                this.fitColumns(containerWidth, preferredTableWidth, isAuto, isAutoFit);
            }
        } else {
            let totalPreferredWidth: number = this.getTotalWidth(0);
            if (isAllColumnPointWidth && !hasSpannedCells) {
                if (minTotal > containerWidth) {
                    if (containerWidth > totalPreferredWidth) {
                        minWidthExceedCellWidth -= (containerWidth - (totalPreferredWidth));
                    }
                    if (columnIndexCollection.length > 0 && minWidthExceedCellWidth > 0) {
                        let averageWidth: number = minWidthExceedCellWidth / this.columns.length;
                        for (let i: number = 0; i < this.columns.length; i++) {
                            let column: WColumn = this.columns[i];
                            if (columnIndexCollection.indexOf(i) === -1) {
                                // Bug 891720: If minimum word width is greater than total preferred width, then set preferred width to resolve the layout issue.
                                if (totalPreferredWidth > column.minimumWordWidth) {
                                    column.preferredWidth = column.minimumWordWidth;
                                }
                            } else {
                                column.preferredWidth = (column.preferredWidth - averageWidth);
                                // Bug 890447: If the preferred width is less than minimum word width, then set minimum word width as preferred width.
                                if (column.preferredWidth < column.minimumWordWidth) {
                                    column.preferredWidth = column.minimumWordWidth;
                                }
                            }
                        }
                        totalPreferredWidth = this.getTotalWidth(0);
                    }
                }
            }

            // If the table preferred table width is set, then check its greater than total minimum word width. 
            // If yes then set table preferred table width as container width. Else, check whether the total minimum word width is less than container width.
            // If yes, then set total minimum word width as container width. Else, set the container width to container width.
            if (!isAuto) {
                //let totalMinimumWordWidth: number = this.getTotalWidth(1);
                //if (preferredTableWidth > totalMinimumWordWidth && totalMinimumWordWidth < containerWidth) {
                let considerMinAsTableWidth: boolean = false;
                if ((preferredTableWidth < minTotal && minTotal + (isNullOrUndefined(indent) ? 0 : indent) < containerWidth)) {
                    considerMinAsTableWidth = true;
                }
                this.fitColumns(containerWidth, considerMinAsTableWidth ? minTotal : preferredTableWidth, isAuto, isAutoFit);
                return;
                //}
                //containerWidth = preferredTableWidth < totalMinimumWordWidth ? totalMinimumWordWidth < containerWidth ? totalMinimumWordWidth : containerWidth : preferredTableWidth;
            }
            // Try to fit minimum word width to match preferredTableWidth or containerWidth.
            if (minTotal <= preferredTableWidth || minTotal <= containerWidth) {
                let availableWidth: number = containerWidth > preferredTableWidth ? containerWidth : preferredTableWidth;
                availableWidth = availableWidth - minTotal;
                for (let i: number = 0; i < this.columns.length; i++) {
                    let column: WColumn = this.columns[i];
                    if (column.widthType === 'Point') {
                        continue;
                    }
                    if (column.preferredWidth === 0) {
                        column.preferredWidth = column.minimumWordWidth;
                    } else {
                        if (column.preferredWidth < column.minimumWordWidth) {
                            column.preferredWidth = column.minimumWordWidth;
                        }
                    }
                    let difference: number = column.maximumWordWidth - column.preferredWidth;
                    difference = difference > 0 ? difference : 0;
                    let factor: number = availableWidth * (difference / remainingWidthTotal);
                    column.preferredWidth += isNaN(factor) ? 0 : factor;
                }
            } else {
                // Try to fit minimum width for each column and allot remaining space to columns based on their minimum word width.
                let totalMinimumWordWidth: number = this.getTotalWidth(1);
                let totalMinWidth: number = this.getTotalWidth(3);
                if (totalMinWidth > 2112) {
                    let cellWidth: number = 2112 / this.columns.length;
                    for (let i: number = 0; i < this.columns.length; i++) {
                        this.columns[i].preferredWidth = cellWidth;
                    }
                } else {
                    let availableWidth: number = 0;
                    if (((totalMinWidth < containerWidth) && ((containerWidth - totalMinWidth) >= 1) && !isAllColumnPointWidth)
                        || (isAllColumnPointWidth && !hasSpannedCells && totalMinimumWordWidth > containerWidth)) {
                        availableWidth = containerWidth - totalMinWidth;
                        for (let i: number = 0; i < this.columns.length; i++) {
                            let column: WColumn = this.columns[i];
                            // The factor depends of current column's minimum word width and total minimum word width.
                            let factor: number = availableWidth * column.minimumWordWidth / totalMinimumWordWidth;
                            factor = isNaN(factor) ? 0 : factor;
                            column.preferredWidth = (column.minimumWidth == 0 ? 1 : column.minimumWidth) + factor;
                        }
                        // table width exceeds container width
                    } else if (totalPreferredWidth > containerWidth) {
                        let factor: number = containerWidth / totalPreferredWidth;
                        for (let i: number = 0; i < this.columns.length; i++) {
                            let column: WColumn = this.columns[i];
                            column.preferredWidth = column.preferredWidth * factor;
                        }
                    }
                }
            }
        }
        this.tableWidth = this.getTotalWidth(0);

    }
    /**
     * @private
     */
    public getValidColumnIndex(index: number): number {
        let endOffset: number = 0;
        for (let i: number = 0; i < this.columns.length; i++) {
            let column: WColumn = this.columns[i];
            if (i < index) {
                endOffset = column.endOffset;
            }
            else if (endOffset === column.endOffset) {
                //Increment the columnIndex if next column has zero width.
                index++;
            }
            else {
                break;
            }
        }
        return index;
    }
    /**
     * @private
     */
    public fitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean, isAutoFit: boolean, indent?: number): void {
        if (isNullOrUndefined(indent)) {
            indent = 0;
        }
        // Gets total preferred width.
        let totalColumnWidth: number = this.getTotalWidth(0);
        // Neglected left indent value, because in preferred table width left indent value is neglected
        if (isAutoWidth) {
            totalColumnWidth -= indent;
        }

        // If auto table width, based on total column widths, minimum value will be updated.
        if (isAutoWidth) {
            this.tableWidth = totalColumnWidth;
        } else {
            this.tableWidth = preferredTableWidth;
        }
        // If total columns width doesn't match table width, then all grid column widths will be updated by even factor.
        // If totalColumnWidth < TableWidth, all grid columns are enlarged. Otherwise shrinked.
        if (totalColumnWidth !== this.tableWidth) {
            let factor: number = this.tableWidth / totalColumnWidth;
            factor = isNaN(factor) || factor === Infinity ? 1 : factor;
            for (let i: number = 0; i < this.columns.length; i++) {
                let column: WColumn = this.columns[i];
                if (column.widthType === 'Percent' && !isAutoWidth && !isAutoFit && totalColumnWidth > this.tableWidth) {
                    if (i !== 0 && column.endOffset > this.tableWidth) {
                        let totalCellWidth: number = this.getCellWidth(0, i + 1, preferredTableWidth);
                        if (totalCellWidth > this.tableWidth) {
                            column.preferredWidth -= (totalCellWidth - this.tableWidth);
                            if (column.preferredWidth === 0 || column.preferredWidth < column.minimumWidth) {
                                column.preferredWidth = column.minimumWidth > 0 ? column.minimumWidth : 1;
                                this.columns[0].preferredWidth -= column.preferredWidth;
                            }
                        }
                    }
                } else {
                    column.preferredWidth = factor * column.preferredWidth;
                }
            }
        }
    }

    /**
     * @private
     */
    public getCellWidth(columnIndex: number, columnSpan: number, preferredTableWidth: number): number {
        let width: number = 0;
        for (let i: number = 0; i < columnSpan; i++) {
            width += this.tableColumns[i + columnIndex].preferredWidth;
        }
        return width;
    }
    /**
     * @private
     */
    public validateColumnWidths(): void {
        for (let i: number = 0; i < this.columns.length; i++) {
            if (i === 0) {
                if (this.columns[i].preferredWidth !== this.columns[i].endOffset) {
                    this.columns[i].preferredWidth = this.columns[i].endOffset;
                }
            } else {
                // If Previous column offset + current column preferred width is less than current column offset, 
                // Then current column preferred width is set to current column offset - previous column offset.
                if (this.columns[i - 1].endOffset + this.columns[i].preferredWidth < this.columns[i].endOffset) {
                    if (this.columns[i - 1].endOffset === 0) {
                        this.columns[i].preferredWidth = this.columns[i].endOffset - this.getPreviousValidOffset(i - 2);
                    } else {
                        this.columns[i].preferredWidth = this.columns[i].endOffset - this.columns[i - 1].endOffset;
                    }
                }
            }
        }
    }
    private getPreviousValidOffset(columnIndex: number): number {
        for (let j = columnIndex; j >= 0; j--) {
            if (this.columns[j].endOffset !== 0) {
                return this.columns[j].endOffset;
            }
        }
        return 0;
    }
    /**
     * @private
     */
    public clone(): WTableHolder {
        let tableHolder: WTableHolder = new WTableHolder();
        tableHolder.tableWidth = this.tableWidth;
        for (let i: number = 0; i < this.columns.length; i++) {
            tableHolder.columns.push(this.columns[i].clone());
        }
        return tableHolder;
    }
    /**
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.tableColumns)) {
            for (let i: number = 0; i < this.tableColumns.length; i++) {
                let column: WColumn = this.tableColumns[i];
                column.destroy();
            }
        }
        this.tableColumns = [];
        this.tableColumns = undefined;
        this.tableWidth = undefined;
    }
}
/** 
 * @private
 */
export class WColumn {
    /**
     * @private
     */
    public preferredWidth: number = 0;
    /**
     * @private
     */
    public minWidth: number = 0;
    /**
     * @private
     */
    public maxWidth: number = 0;
    /**
     * @private
     */
    public endOffset: number = 0;
    /**
     * @private
     */
    public minimumWordWidth: number = 0;
    /**
     * @private
     */
    public maximumWordWidth: number = 0;
    /**
     * @private
     */
    public minimumWidth: number = 0;
    /**
     * @private
     */
    public widthType: WidthType;
    /**
     * @private
     */
    public clone(): WColumn {
        let column: WColumn = new WColumn();
        column.preferredWidth = this.preferredWidth;
        column.minWidth = this.minWidth;
        column.maxWidth = this.maxWidth;

        return column;
    }
    /**
     * @private
     */
    public destroy(): void {
        this.preferredWidth = undefined;
        this.minWidth = undefined;
        this.maxWidth = undefined;
    }
}
/**
 * @private
 */
export class ColumnSizeInfo {
    /**
     * @private
     */
    public minimumWordWidth: number = 0;
    /**
     * @private
     */
    public maximumWordWidth: number = 0;
    /**
     * @private
     */
    public minimumWidth: number = 0;
    /**
     * @private
     */
    public hasMinimumWidth: boolean = false;
    /**
     * @private
     */
    public hasMinimumWordWidth: boolean = false;
    /**
     * @private
     */
    public hasMaximumWordWidth: boolean = false;
}
/**
 * @private
 */
export class CommentEditInfo {
    /**
     * @private
     */
    public commentId: string;
    /**
     * @private
     */
    public text: string;
}
/**
 * @private
 */
export class MentionDataEditInfo {
    /**
     * @private
     */
    public text: string;
    /**
     * @private
     */
    public value: string;
}
/**
 * @private
 */
export class BreakElementBox extends TextElementBox {
    /**
     * @private
     */
    public breakClearType: BreakClearType;
    public constructor() {
        super();
    }
    /**
     * @private
     */
    public clone(): BreakElementBox {
        let breakElement = super.clone() as BreakElementBox;
        breakElement.breakClearType = this.breakClearType;
        return breakElement;
    }
    /*
    * @Private
    */
    public destroy(): void {
        this.breakClearType = undefined;
        super.destroy();
    }
    /*
    * @Private
    */
    public componentDestroy(): void {
        this.breakClearType = undefined;
        super.componentDestroy();
    }
}
/**
 * @private
 */
export class TabStopListInfo {
    /**
     * @private
     */
    public displayText: string;
    /**
     * @private
     */
    public value: WTabStop;
}
/** 
 * @private
 */
export class FootnoteEndnoteMarkerElementBox extends TextElementBox {
    /**
     * @private
     */
    public getLength(): number {
        return 1;
    }
    /**
     * @private
     */
    public clone(): FootnoteEndnoteMarkerElementBox {
        // return super.clone();
        let footEndEle: FootnoteEndnoteMarkerElementBox = new FootnoteEndnoteMarkerElementBox();
        footEndEle.characterFormat.copyFormat(this.characterFormat);
        footEndEle.text = this.text;
        if (this.margin) {
            footEndEle.margin = this.margin.clone();
        }
        footEndEle.baselineOffset = this.baselineOffset;
        if (!isNullOrUndefined(this.paragraph) && this.paragraph.isInHeaderFooter) {
            if (this.revisions.length > 0) {
                for (let i: number = 0; i < this.revisions.length; i++) {
                    let revision: Revision = this.revisions[i];
                    footEndEle.revisions.push(revision.clone());
                }
            }
        } else {
            if (this.revisions.length > 0) {
                footEndEle.removedIds = Revision.cloneRevisions(this.revisions);
            } else {
                footEndEle.removedIds = this.removedIds.slice();
            }
        }
        footEndEle.width = this.width;
        footEndEle.height = this.height;
        if (this.contentControlProperties) {
            footEndEle.contentControlProperties = this.contentControlProperties;
        }
        return footEndEle;
    }
}