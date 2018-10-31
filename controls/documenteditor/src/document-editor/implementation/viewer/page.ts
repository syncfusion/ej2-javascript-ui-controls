import { WTableFormat, WRowFormat, WCellFormat } from '../format/index';
import { WidthType, WColor } from '../../base/types';
import { WListLevel } from '../list/list-level';
import { WParagraphFormat, WCharacterFormat, WSectionFormat, WBorder, WBorders } from '../format/index';
import { LayoutViewer } from './viewer';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { ElementInfo, HelperMethods, Point } from '../editor/editor-helper';
import { HeaderFooterType, TabLeader } from '../../base/types';


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
    /**
     * @private
     */
    get right(): number {
        return this.x + this.width;
    }
    /**
     * @private
     */
    get bottom(): number {
        return this.y + this.height;
    }
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
    constructor(leftMargin: number, topMargin: number, rightMargin: number, bottomMargin: number) {
        this.left = leftMargin;
        this.top = topMargin;
        this.right = rightMargin;
        this.bottom = bottomMargin;
    }
    /**
     * @private
     */
    public clone(): Margin {
        return new Margin(this.left, this.top, this.right, this.bottom);
    }
    /**
     * @private
     */
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
/* tslint:disable:no-empty-interfaces */
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
    /**
     * @private
     */
    get indexInOwner(): number {
        if (this instanceof BodyWidget && this.page) {
            return this.page.bodyWidgets.indexOf(this);
        } else if (this.containerWidget && this.containerWidget.childWidgets) {
            return this.containerWidget.childWidgets.indexOf(this);
        }
        return -1;
    }
    /**
     * @private
     */
    get firstChild(): IWidget {
        return this.childWidgets.length > 0 ? this.childWidgets[0] : undefined;
    }
    /**
     * @private
     */
    get lastChild(): IWidget {
        if (this.childWidgets) {
            return this.childWidgets.length > 0 ?
                this.childWidgets[this.childWidgets.length - 1] : undefined;
        }
        return undefined;
    }
    /**
     * @private
     */
    get previousWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (widget instanceof BodyWidget) {
            widget = index > 0 ? widget.page.bodyWidgets[index - 1] : undefined;
        } else {
            widget = index > 0 ? widget.containerWidget.childWidgets[index - 1] as Widget : undefined;
        }
        return widget;
    }
    /**
     * @private
     */
    get nextWidget(): Widget {
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
    /**
     * @private
     */
    get previousRenderedWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (index < 0) {
            return undefined;
        }
        if (widget instanceof BodyWidget) {
            if (index > 0) {
                widget = widget.page.bodyWidgets[index - 1];
            } else {
                let page: Page = widget.page.previousPage;
                widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[page.bodyWidgets.length - 1] : undefined;
            }
        } else {
            if (index > 0) {
                widget = widget.containerWidget.childWidgets[index - 1] as Widget;
            } else {
                let previousContainer: Widget = undefined;
                if (widget.containerWidget instanceof TableCellWidget) {
                    previousContainer = widget.containerWidget.getPreviousSplitWidget();
                } else if (!(widget.containerWidget instanceof TableRowWidget
                    || widget.containerWidget instanceof HeaderFooterWidget)) {
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
    /**
     * @private
     */
    get nextRenderedWidget(): Widget {
        let widget: Widget = this;
        let index: number = this.indexInOwner;
        if (index < 0) {
            return undefined;
        }
        if (widget instanceof BodyWidget) {
            if (index < widget.page.bodyWidgets.length - 1) {
                widget = widget.page.bodyWidgets[index + 1];
            } else {
                let page: Page = widget.page.nextPage;
                widget = page && page.bodyWidgets.length > 0 ? page.bodyWidgets[0] : undefined;
            }
        } else {
            if (index < widget.containerWidget.childWidgets.length - 1) {
                widget = widget.containerWidget.childWidgets[index + 1] as Widget;
            } else {
                let nextContainer: Widget = undefined;
                if (widget.containerWidget instanceof TableCellWidget) {
                    nextContainer = widget.containerWidget.getNextSplitWidget();
                } else if (!(widget.containerWidget instanceof TableRowWidget
                    || widget.containerWidget instanceof HeaderFooterWidget)) {
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
    /**
     * @private
     */
    get previousSplitWidget(): Widget {
        let widget: Widget = this;
        if (widget instanceof TableCellWidget) {
            return widget.getPreviousSplitWidget();
        } else {
            let previous: Widget = widget.previousRenderedWidget;
            if (widget instanceof BodyWidget && previous instanceof BodyWidget && widget.equals(previous)) {
                return previous;
            } else if (previous instanceof BlockWidget && widget.index === previous.index && widget.equals(previous)) {
                return previous;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextSplitWidget(): Widget {
        let widget: Widget = this;
        if (widget instanceof TableCellWidget) {
            return widget.getNextSplitWidget();
        } else {
            let next: Widget = widget.nextRenderedWidget;
            if (widget instanceof BodyWidget && next instanceof BodyWidget && widget.equals(next)) {
                return next;
            } else if (next instanceof BlockWidget && widget.index === next.index && widget.equals(next)) {
                return next;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public abstract equals(widget: Widget): boolean;
    /**
     * @private
     */
    public abstract getTableCellWidget(point: Point): TableCellWidget;
    /**
     * @private
     */
    public getPreviousSplitWidgets(): Widget[] {
        let widgets: Widget[] = [];

        let widget: Widget = this.previousSplitWidget;
        while (widget) {
            widgets.unshift(widget);
            widget = widget.previousSplitWidget;
        }
        return widgets;
    }
    /**
     * @private
     */
    public getSplitWidgets(): Widget[] {
        let widgets: Widget[] = this.getPreviousSplitWidgets();
        let widget: Widget = this;
        while (widget) {
            widgets.push(widget);
            widget = widget.nextSplitWidget;
        }
        return widgets;
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
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
            this.childWidgets.push(widget);
        }
    }
    /**
     * @private
     */
    public removeChild(index: number): void {
        if (index > -1 && index < this.childWidgets.length) {
            this.childWidgets.splice(index, 1);
        }
    }
    /**
     * @private
     */
    public abstract destroyInternal(viewer: LayoutViewer): void;
    /**
     * @private
     */
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
    public sectionFormatIn: WSectionFormat = undefined;
    /**
     * @private
     */
    get sectionFormat(): WSectionFormat {
        let container: BlockContainer = this;
        if (container instanceof BodyWidget) {
            return container.sectionFormatIn;
        } else if (container.page) {
            return container.page.bodyWidgets[0].sectionFormat;
        }
        return undefined;
    }
    /**
     * @private
     */
    set sectionFormat(value: WSectionFormat) {
        if (this instanceof BodyWidget) {
            this.sectionFormatIn = value;
        }
    }
    /**
     * @private
     */
    get sectionIndex(): number {
        let container: BlockContainer = this;
        let index: number = 0;
        if (container instanceof BodyWidget) {
            index = container.index;
        } else if (container.page) {
            index = container.page.bodyWidgets[0].index;
        }
        return index;
    }
    /**
     * @private
     */
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let viewer: LayoutViewer = undefined;
        let node: BlockContainer = this;
        if (node instanceof BodyWidget) {
            hierarchicalIndex = node.index + ';' + hierarchicalIndex;
        } else {
            if ((node as HeaderFooterWidget).headerFooterType.indexOf('Header') !== -1) {
                hierarchicalIndex = 'H' + ';' + hierarchicalIndex;
            } else {
                hierarchicalIndex = 'F' + ';' + hierarchicalIndex;
            }
        }
        if (!isNullOrUndefined(node.page)) {
            viewer = this.page.viewer;
            let pageIndex: number = viewer.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    }
}
/** 
 * @private
 */
export class BodyWidget extends BlockContainer {
    /**
     * Initialize the constructor of BodyWidget
     */
    constructor() {
        super();
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        return widget instanceof BodyWidget && widget.sectionFormat === this.sectionFormat;
    }
    /**
     * @private
     */
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let viewer: LayoutViewer = undefined;
        let node: BodyWidget = this;
        hierarchicalIndex = node.index + ';' + hierarchicalIndex;
        if (!isNullOrUndefined(node.page)) {
            viewer = this.page.viewer;
            let pageIndex: number = viewer.pages.indexOf(this.page);
            return pageIndex + ';' + hierarchicalIndex;
        }
        return hierarchicalIndex;
    }
    /**
     * @private
     */
    public getTableCellWidget(touchPoint: Point): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            if ((this.childWidgets[i] as Widget).y <= touchPoint.y
                && ((this.childWidgets[i] as Widget).y + (this.childWidgets[i] as Widget).height) >= touchPoint.y) {
                return (this.childWidgets[i] as Widget).getTableCellWidget(touchPoint);
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
    /**
     * @private
     */
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
        /* tslint:disable: one-line */
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
    /**
     * @private
     */
    public destroy(): void {
        // if (this.sectionFormat) {
        //     this.sectionFormat.destroy();
        // }
        this.sectionFormat = undefined;
        this.page = undefined;
        super.destroy();
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
    constructor(type: HeaderFooterType) {
        super();
        this.headerFooterType = type;
    }
    /**
     * @private
     */
    public getTableCellWidget(point: Point): TableCellWidget {
        return undefined;
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        // Todo: Need to work
        return widget instanceof HeaderFooterWidget
            && widget.containerWidget === this.containerWidget;
    }
    /**
     * @private
     */
    public clone(): HeaderFooterWidget {
        let headerFooter: HeaderFooterWidget = new HeaderFooterWidget(this.headerFooterType);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let block: BlockWidget = (this.childWidgets[i] as BlockWidget).clone();
            headerFooter.childWidgets.push(block);
            block.index = i;
            block.containerWidget = headerFooter;
        }
        headerFooter.x = this.x;
        headerFooter.y = this.y;
        headerFooter.height = 0;
        headerFooter.width = 0;
        return headerFooter;
    }
    /**
     * @private
     */
    public destroyInternal(viewer: LayoutViewer): void {
        this.page = undefined;
        super.destroy();
    }
}
/** 
 * @private
 */
export abstract class BlockWidget extends Widget {
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
    get bodyWidget(): BlockContainer {
        let widget: Widget = this;
        while (widget.containerWidget) {
            if (widget.containerWidget instanceof BlockContainer) {
                return widget.containerWidget as BlockContainer;
            }
            widget = widget.containerWidget;
        }
        return undefined;
    }
    /**
     * @private
     */
    get leftIndent(): number {
        let blockAdv: BlockWidget = this;
        if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
            return blockAdv.paragraphFormat.leftIndent;
        } else if (blockAdv instanceof TableWidget && (blockAdv as TableWidget).tableFormat instanceof WTableFormat) {
            return blockAdv.tableFormat.leftIndent;
        }
        return 0;
    }
    /**
     * @private
     */
    get rightIndent(): number {
        let blockAdv: BlockWidget = this;
        if (blockAdv instanceof ParagraphWidget && blockAdv.paragraphFormat instanceof WParagraphFormat) {
            return (blockAdv as ParagraphWidget).paragraphFormat.rightIndent;
        }
        return 0;
    }
    /**
     * @private
     */
    get isInsideTable(): boolean {
        return this.containerWidget instanceof TableCellWidget;
    }
    /**
     * @private
     */
    get isInHeaderFooter(): boolean {
        return this.bodyWidget instanceof HeaderFooterWidget;
    }
    /**
     * @private
     */
    get associatedCell(): TableCellWidget {
        if (this.containerWidget instanceof TableCellWidget) {
            return this.containerWidget as TableCellWidget;
        }
        return undefined;
    }
    /**
     * Check whether the paragraph contains only page break.
     * @private
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
    /**
     * @private
     */
    public getHierarchicalIndex(hierarchicalIndex: string): string {
        let node: BlockWidget = this;
        hierarchicalIndex = node.containerWidget.childWidgets.indexOf(node) + ';' + hierarchicalIndex;
        if (!isNullOrUndefined(node.containerWidget)) {
            if (node.containerWidget instanceof BlockWidget) {
                return (node.containerWidget as BlockWidget).getHierarchicalIndex(hierarchicalIndex);
            } else if (node.containerWidget instanceof BlockContainer) {
                hierarchicalIndex = node.containerWidget.getHierarchicalIndex(hierarchicalIndex);
            }
        }
        return hierarchicalIndex;
    }
    /**
     * @private
     */
    public abstract clone(): BlockWidget;
    /**
     * @private
     */
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
    /**
     * @private
     */
    public getContainerWidth(): number {
        if (this.isInsideTable) {
            return this.associatedCell.cellFormat.cellWidth - (this.associatedCell.margin.left + this.associatedCell.margin.right);
        }
        else {
            let bodyWidget: BlockContainer = this.bodyWidget;
            let sectionFormat: WSectionFormat = bodyWidget.sectionFormat;
            return sectionFormat.pageWidth - (sectionFormat.leftMargin + sectionFormat.rightMargin);
        }
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
    get isEndsWithPageBreak(): boolean {
        if (this.childWidgets.length > 0) {
            return (this.lastChild as LineWidget).isEndsWithPageBreak;
        }
        return false;
    }
    /**
     * Initialize the constructor of ParagraphWidget
     */
    constructor() {
        super();
        this.paragraphFormat = new WParagraphFormat(this);
        this.characterFormat = new WCharacterFormat(this);
    }
    /**
     * @private
     */
    public equals(widget: Widget): boolean {
        return widget instanceof ParagraphWidget && widget.paragraphFormat === this.paragraphFormat;
    }
    /**
     * @private
     */
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
                    || (inline instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter((inline as FieldElementBox)))) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * @private
     */
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
                        || inline instanceof BookmarkElementBox || inline instanceof FieldElementBox
                        && HelperMethods.isLinkedFieldCharacter(inline as FieldElementBox))) {
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
    /**
     * @private
     */
    public getLength(): number {
        let length: number = 0;
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
     * @private
     */
    public getTableCellWidget(point: Point): TableCellWidget {
        return undefined;
    }
    /**
     * @private
     */
    public clone(): ParagraphWidget {
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.paragraphFormat.copyFormat(this.paragraphFormat);
        paragraph.characterFormat.copyFormat(this.characterFormat);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let line: LineWidget = this.childWidgets[i] as LineWidget;
            let cloneLine: LineWidget = line.clone();
            paragraph.childWidgets.push(cloneLine);
            cloneLine.paragraph = paragraph;
        }
        paragraph.x = this.x;
        paragraph.y = this.y;
        paragraph.height = this.height;
        paragraph.width = this.width;
        return paragraph;
    }
    /**
     * @private
     */
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
        this.destroy();
    }
    /**
     * @private
     */
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
    public tableGrids: number[];
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
    public description: string;
    /**
     * @private
     */
    public title: string;
    /**
     * @private
     */
    public tableCellInfo: Dictionary<number, Dictionary<number, number>>;
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
    private getTableWidth(): number {
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
    public getTableClientWidth(clientWidth: number): number {
        let tableWidth: number = clientWidth;
        if (this.tableFormat.preferredWidthType === 'Point'
            && this.tableFormat.preferredWidth > 0) {
            tableWidth = this.tableFormat.preferredWidth;
        } else {
            if (this.tableFormat.preferredWidthType === 'Percent'
                && this.tableFormat.preferredWidth > 0) {
                tableWidth = tableWidth * this.tableFormat.preferredWidth / 100;
            } else {
                //By default, if Table preferred widthType is auto , width is set based on ClientWidth and type is set as 'Point'
                this.tableFormat.preferredWidthType = 'Point';
                this.tableFormat.preferredWidth = tableWidth;
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
            cellWidth = cell.getMinimumPreferredWidth();
        }
        return cellWidth;
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
    //tslint:disable: max-func-body-length
    public calculateGrid(): void {
        let tempGrid: number[] = [];
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
            }
            //Converts the row grid before width from point to twips point by 15 factor.
            cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, rowFormat.gridBeforeWidthType, tableWidth, null);
            currOffset += cellWidth;
            let startOffset: number = Math.round(currOffset);
            if (tempGrid.indexOf(startOffset) < 0) {
                tempGrid.push(startOffset);
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
                                // tslint:disable-next-line:max-line-length
                                cellWidth = this.getCellWidth(spannedCells[k].cellFormat.preferredWidth, spannedCells[k].cellFormat.preferredWidthType, tableWidth, null);
                                currOffset += cellWidth;
                            }
                        }
                    } else {
                        // If the table gird alone calculted then column index of the rowspanned cell will be directly taken. 
                        // If the gird calculation is done from the UI level opearations such as resizing then table holder 
                        // will have the columns at that time we can get the column index from the table holder.
                        //Converts the cell width from point to twips point by 15 factor.
                        // tslint:disable-next-line:max-line-length
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
                    rowCellInfo.add(cell.cellIndex, Math.round(currOffset - startOffset));
                }
                columnSpan += cell.cellFormat.columnSpan;
                //Converts the cell width from pixel to twips point by 15 factor.
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, null);
                currOffset += cellWidth;
                let offset: number = Math.round(currOffset);
                if (tempGrid.indexOf(offset) < 0) {
                    tempGrid.push(offset);
                }

                if (j === row.childWidgets.length - 1 && rowFormat.gridAfter > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    currOffset += cellWidth;

                    if (tempGrid.indexOf(Math.round(currOffset)) < 0) {
                        tempGrid.push(Math.round(currOffset));
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
        if (tempGrid.length - 1 !== this.tableHolder.columns.length) {
            this.updateColumnSpans(tempGrid, tableWidth);
        }
        this.tableCellInfo.clear();
        this.tableCellInfo = undefined;
    }
    private updateColumnSpans(tempGrid: number[], containerWidth: number): void {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            if (row.rowFormat.gridBeforeWidth >= 0) {
                row.rowFormat.gridBefore = row.getGridCount(tempGrid, undefined, -1, containerWidth);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
                let columnSpan: number = row.getGridCount(tempGrid, cell, cell.getIndex(), containerWidth);
                if (columnSpan > 0 && cell.cellFormat.columnSpan !== columnSpan) {
                    cell.cellFormat.columnSpan = columnSpan;
                }
            }
            if (row.rowFormat.gridAfterWidth >= 0) {
                row.rowFormat.gridAfter = row.getGridCount(tempGrid, undefined, row.childWidgets.length, containerWidth);
            }
        }
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
        let isAutoWidth: boolean = this.tableFormat.preferredWidthType === 'Auto';
        // For continuous layout, window width should be considered. 
        // If preferred width exceeds this limit, it can take upto maximum of 2112 pixels (1584 points will be assigned by Microsoft Word).
        containerWidth = this.getOwnerWidth(true);
        tableWidth = this.getTableClientWidth(containerWidth);
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let row: TableRowWidget = this.childWidgets[i] as TableRowWidget;
            let rowFormat: WRowFormat = row.rowFormat;
            let columnSpan: number = 0;
            let cellWidth: number = 0;
            let offset: number = 0;
            if (rowFormat.gridBefore > 0) {
                cellWidth = this.getCellWidth(rowFormat.gridBeforeWidth, row.rowFormat.gridAfterWidthType, tableWidth, null);
                this.tableHolder.addColumns(columnSpan, columnSpan = rowFormat.gridBefore, cellWidth, cellWidth, offset = cellWidth);
            }
            for (let j: number = 0; j < row.childWidgets.length; j++) {
                let cell: TableCellWidget = row.childWidgets[j] as TableCellWidget;
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
                        // tslint:disable-next-line:max-line-length
                        cellWidth = this.getCellWidth(rowSpannedCell.cellFormat.preferredWidth, rowSpannedCell.cellFormat.preferredWidthType, tableWidth, rowSpannedCell);
                        let minWidth: number = rowSpannedCell.getMinimumPreferredWidth();
                        // If the table gird alone calculted then column index of the rowspanned cell will be directly taken. 
                        // tslint:disable-next-line:max-line-length
                        // If the gird calculation is done from the UI level opearations such as resizing then table holder will have the columns at that time we can get the column index from the table holder.
                        // tslint:disable-next-line:max-line-length
                        if (this.tableHolder.columns.length > 0) {
                            this.tableHolder.addColumns(columnSpan, columnSpan = this.tableHolder.columns.indexOf(rowSpannedCell.ownerColumn) + rowSpannedCell.cellFormat.columnSpan, cellWidth, minWidth, offset += cellWidth);
                            cell.columnIndex = columnSpan;
                        } else {
                            // tslint:disable-next-line:max-line-length
                            this.tableHolder.addColumns(columnSpan, columnSpan = rowSpannedCell.columnIndex + rowSpannedCell.cellFormat.columnSpan, cellWidth, minWidth, offset += cellWidth);
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
                        for (let m: number = rowSpannedCells.length; m > 0; m--) {
                            if (rowSpannedCells[m - 1].columnIndex > columnSpan) {
                                rowSpannedCells.splice(m - 1, 0, cell);
                            }
                        }
                    }
                }
                cellWidth = this.getCellWidth(cell.cellFormat.preferredWidth, cell.cellFormat.preferredWidthType, tableWidth, cell);
                let minWidth: number = cell.getMinimumPreferredWidth();
                this.tableHolder.addColumns(columnSpan, columnSpan += cell.cellFormat.columnSpan, cellWidth, minWidth, offset += cellWidth);
                if (j === row.childWidgets.length - 1 && rowFormat.gridAfterWidth > 0) {
                    cellWidth = this.getCellWidth(rowFormat.gridAfterWidth, 'Point', tableWidth, null);
                    this.tableHolder.addColumns(columnSpan, columnSpan += rowFormat.gridAfter, cellWidth, cellWidth, offset += cellWidth);
                }
            }
        }
        this.tableHolder.validateColumnWidths();
        // Fits the column width based on preferred width. i.e. Fixed layout.
        this.tableHolder.fitColumns(containerWidth, tableWidth, isAutoWidth);
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
                rowFormat.beforeWidth = this.tableHolder.getCellWidth(0, rowFormat.gridBefore, tableWidth, isAutoWidth);
            }
            for (let j: number = 0; j < rw.childWidgets.length; j++) {
                let cell: TableCellWidget = rw.childWidgets[j] as TableCellWidget;
                // tslint:disable-next-line:max-line-length
                cell.cellFormat.cellWidth = this.tableHolder.getCellWidth(cell.columnIndex, cell.cellFormat.columnSpan, tableWidth, isAutoWidth);
                //By default, if cell preferred widthType is auto , width set based on table width and type is changed to 'Point'
                if (cell.cellFormat.preferredWidthType !== 'Percent') {
                    cell.cellFormat.preferredWidth = cell.cellFormat.cellWidth;
                    cell.cellFormat.preferredWidthType = 'Point';
                }
            }
            if (rowFormat.gridAfter > 0) {
                rowFormat.afterWidth = this.tableHolder.getCellWidth(0, rowFormat.gridAfter, tableWidth, isAutoWidth);
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
        let totalPreferredWidth: number = this.tableHolder.getTotalWidth();
        let containerWidth: number = this.getTableClientWidth(this.getOwnerWidth(true));
        if (containerWidth <= totalPreferredWidth) {
            if (this.tableFormat.preferredWidthType === 'Auto') {
                this.tableFormat.preferredWidthType = 'Point';
            }
        }

        if (this.tableFormat.preferredWidthType !== 'Auto') {
            if (this.tableFormat.preferredWidthType === 'Point') {
                this.tableFormat.preferredWidth = this.getMaxRowWidth(containerWidth);
            }
            // else
            // {   //ToDo:Need to anzlyze more the Percentage calculation for table width.
            //     let value:number = ConvertPixelToPercent(GetMaxRowWidth(containerWidth));
            //     this.tableFormat.preferredWidth = value;
            // }
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
    /**
     * @private
     */
    public clone(): TableWidget {
        let table: TableWidget = new TableWidget();
        table.tableHolder = this.tableHolder.clone();
        table.tableFormat.copyFormat(this.tableFormat);
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
        table.containerWidget = this.containerWidget;
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
    public splitWidthToTableCells(tableClientWidth: number): void {
        for (let row: number = 0; row < this.childWidgets.length; row++) {
            (this.childWidgets[row] as TableRowWidget).splitWidthToRowCells(tableClientWidth);
        }
    }
    /**
     * @private
     */
    public insertTableRowsInternal(tableRows: TableRowWidget[], startIndex: number): void {
        for (let i: number = 0; i < tableRows.length; i++) {
            let row: TableRowWidget = tableRows.splice(i, 1)[0] as TableRowWidget;
            row.containerWidget = this;
            this.childWidgets.splice(startIndex, 0, row);
            i--;
        }
        this.updateRowIndex(startIndex);
        this.isGridUpdated = false;
        this.buildTableColumns();
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
        // if (this.spannedRowCollection) {
        //     this.spannedRowCollection.destroy();
        // }
        this.spannedRowCollection = undefined;
        this.tableGrids = [];
        this.tableGrids = undefined;
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
        this.description = undefined;
        this.title = undefined;
        super.destroy();
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
    public spannedRowCollection: TableRowWidget[] = [];

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
            if (cell.cellFormat.rowSpan === 1) {
                let cellHeight: number = cell.height + cell.margin.top + cell.margin.bottom;
                if ((this.height - this.ownerTable.tableFormat.cellSpacing) < cell.height) {
                    this.height = this.ownerTable.tableFormat.cellSpacing + cell.height;
                }
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
    public getCell(rowIndex: number, cellIndex: number): TableCellWidget {
        for (let i: number = 0; i < this.childWidgets.length; i++) {
            let cell: TableCellWidget = this.childWidgets[i] as TableCellWidget;
            if (cell.rowIndex === rowIndex && cell.index === cellIndex) {
                return cell;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public splitWidthToRowCells(tableClientWidth: number): void {
        let cells: TableCellWidget[] = this.childWidgets as TableCellWidget[];
        let cellWidth: number = tableClientWidth / cells.length;
        for (let cell: number = 0; cell < cells.length; cell++) {
            cells[cell].cellFormat.preferredWidth = cellWidth;
        }
    }
    /**
     * @private
     */
    public getGridCount(tableGrid: number[], cell: TableCellWidget, index: number, containerWidth: number): number {
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
        let gridStartIndex: number = this.getOffsetIndex(tableGrid, prevOffset);
        let gridEndIndex: number = this.getOffsetIndex(tableGrid, prevOffset + width);
        return gridEndIndex - gridStartIndex;
    }
    private getOffsetIndex(tableGrid: number[], offset: number): number {
        offset = Math.round(offset);
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
        return row;
    }

    /**
     * @private
     */
    public destroy(): void {
        // if (this.rowFormat) {
        //     this.rowFormat.destroy();
        // }
        this.rowFormat = undefined;
        this.rowFormat = undefined;
        this.spannedRowCollection = [];
        this.spannedRowCollection = undefined;
        this.topBorderWidth = undefined;
        this.bottomBorderWidth = undefined;
        super.destroy();
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
        if (this.cellFormat && this.cellFormat.containsMargins()) {
            return this.cellFormat.leftMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
            return this.ownerTable.tableFormat.leftMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get topMargin(): number {
        if (this.cellFormat && this.cellFormat.containsMargins()) {
            return this.cellFormat.topMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
            return this.ownerTable.tableFormat.topMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get rightMargin(): number {
        if (this.cellFormat && this.cellFormat.containsMargins()) {
            return this.cellFormat.rightMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
            return this.ownerTable.tableFormat.rightMargin;
        } else {
            return 0;
        }
    }
    /**
     * @private
     */
    get bottomMargin(): number {
        if (this.cellFormat && this.cellFormat.containsMargins()) {
            return this.cellFormat.bottomMargin;
        } else if (!isNullOrUndefined(this.ownerTable) && !isNullOrUndefined(this.ownerTable.tableFormat)) {
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
                let previousCell: TableCellWidget = row.getCell(this.rowIndex, this.index);
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
                let nextCell: TableCellWidget = row.getCell(this.rowIndex, this.index);
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
        if (this.cellFormat.preferredWidthType === 'Auto') {
            this.cellFormat.preferredWidth = preferredWidth;
            this.cellFormat.preferredWidthType = 'Point';
        } else if (this.cellFormat.preferredWidthType === 'Point') {
            this.cellFormat.preferredWidth = preferredWidth;
        } else if (this.cellFormat.preferredWidthType === 'Percent') {
            this.cellFormat.preferredWidth = this.convertPointToPercent(preferredWidth);
        }
        this.cellFormat.cellWidth = preferredWidth;
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
            let prevCell: TableCellWidget = undefined;
            if (!isNullOrUndefined(tableCell.previousWidget)) {
                // if the border is shared then choose the border based on Conflict Resolution algorithm.
                prevCell = tableCell.previousWidget as TableCellWidget;
            } else if ((tableCell.cellFormat.columnSpan > 1 || tableCell.columnIndex > 1) && tableCell.ownerRow.rowIndex > 0) {
                let previousRow: TableRowWidget = tableCell.ownerRow.previousWidget as TableRowWidget;
                while (!isNullOrUndefined(previousRow) && previousRow.childWidgets.length > 0) {
                    for (let i: number = 0; i < previousRow.childWidgets.length; i++) {
                        let prevRowCell: TableCellWidget = previousRow.childWidgets[i] as TableCellWidget;
                        if (prevRowCell.columnIndex + prevRowCell.cellFormat.columnSpan === tableCell.columnIndex) {
                            prevCell = previousRow.childWidgets[i] as TableCellWidget;
                            break;
                        }
                    }
                    if (!isNullOrUndefined(prevCell)) {
                        break;
                    }
                    previousRow = previousRow.previousWidget as TableRowWidget;
                }
            }
            leftBorder = tableCell.getPreviousCellLeftBorder(leftBorder, prevCell);
        }
        if (isNullOrUndefined(leftBorder)) {
            leftBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return leftBorder;
    }
    /**
     * @private
     */
    public getLeftBorderWidth(): number {
        let borderWidth: number = 0;
        //let ownerTable = this.ownerTable;
        //Added null condition check for asynchronous loading.
        // if (this.cellFormat !== null && this.cellFormat.borders !== null) {
        // update the margins values respect to layouting of borders.
        //For normal table cells only left border is rendred. for last cell left and right border is rendred.
        // this border widths are not included in margins.
        //     boderWidth = this.cellFormat.borders.GetRightBorderToRender(this).GetLineWidth();
        //need to render rightBorder specifically for all the cells when the cellSpacing is greater than zero or for last cell of each row.
        // }
        return borderWidth;
    }
    /**
     * @private
     */
    public getRightBorderWidth(): number {
        let borderWidth: number = 0;

        let ownerTable: TableWidget = this.ownerTable;
        //Added null condition check for asynchronous loading.
        // if (this.cellFormat !== null && this.cellFormat.borders !== null) {
        ///need to render right border specifically for all the cells when the cell spacing is 
        //greater than zero or for last cell of each row.
        //     let isLastCell: boolean = false;
        //     isLastCell = this.cellIndex === 0;
        //     if (ownerTable.tableFormat.cellSpacing > 0 || isLastCell) {
        //         boderWidth = this.cellFormat.borders.getLeftBorderToRender(this).GetLineWidth();
        //     }
        // }
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
    public getMinimumPreferredWidth(): number {
        let defaultWidth: number = 0;

        defaultWidth = this.leftMargin + this.rightMargin + this.getLeftBorderWidth() + this.getRightBorderWidth() + this.getCellSpacing();

        return defaultWidth;
    }
    /**
     * @private
     */
    public getPreviousCellLeftBorder(leftBorder: WBorder, previousCell: TableCellWidget): WBorder {
        // tslint:disable-next-line:max-line-length
        if ((isNullOrUndefined(previousCell) || (!isNullOrUndefined(leftBorder) && (leftBorder.lineStyle === 'None' && !leftBorder.hasNoneStyle)))) {
            if (!isNullOrUndefined(leftBorder) && !((leftBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getLeftBorderToRenderByHierarchy(leftBorder, TableRowWidget.getRowOf(leftBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(leftBorder.ownerBase as WBorders).tableFormat.borders);
            }
        } else {
            let prevCellRightBorder: WBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousCell.cellFormat.borders) && !isNullOrUndefined(previousCell.cellFormat.borders.right) && previousCell.cellFormat.borders.right.lineStyle !== 'None') {
                prevCellRightBorder = previousCell.cellFormat.borders.right;
            }
            if (!isNullOrUndefined(prevCellRightBorder) && prevCellRightBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(prevCellRightBorder, leftBorder);
            } else if (!isNullOrUndefined(leftBorder) && !((leftBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
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
                let borderColInRGB: WColor = this.convertHexToRGB(border.color);
                let R1: number = borderColInRGB.r;
                let G1: number = borderColInRGB.g;
                let B1: number = borderColInRGB.b;
                let adjacentBorderColInRGB: WColor = this.convertHexToRGB(adjacentBorder.color);
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
        if (!isNullOrUndefined(leftBorder) && (leftBorder.lineStyle !== 'None' || (leftBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(leftBorder.lineStyle === 'None' && leftBorder.lineWidth === 0 && leftBorder.color === '#000000')))) {

            return leftBorder;
            // tslint:disable-next-line:max-line-length
        } else if (!isNullOrUndefined(leftBorder) && (leftBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(leftBorder.ownerBase as WBorders).columnIndex === 0) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.left)) {
                leftBorder = tableBorders.left;
            }
            return leftBorder;
        } else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.vertical) && rowBorders.vertical.lineStyle !== 'None') {
            return leftBorder = rowBorders.vertical;
        } else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.vertical) && tableBorders.vertical.lineStyle !== 'None') {
            return leftBorder = tableBorders.vertical;
        } else {
            return leftBorder;
        }
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
            let nextCell: TableCellWidget = undefined;
            if (!isNullOrUndefined(tableCell.nextWidget)) {
                nextCell = tableCell.nextWidget as TableCellWidget;
            }
            // if the border is shared then choose the border based on Conflict Resolution algorithm.
            rightBorder = tableCell.getAdjacentCellRightBorder(rightBorder, nextCell);
        }
        if (isNullOrUndefined(rightBorder)) {
            rightBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return rightBorder;
    }
    /**
     * @private
     */
    public getAdjacentCellRightBorder(rightBorder: WBorder, nextCell: TableCellWidget): WBorder {
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(nextCell) || (!isNullOrUndefined(rightBorder) && (rightBorder.lineStyle === 'None' && !rightBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(rightBorder) && !((rightBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase).tableFormat.borders);
            }
        } else {
            let nextCellLeftBorder: WBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(nextCell.cellFormat.borders) && !isNullOrUndefined(nextCell.cellFormat.borders.left) && nextCell.cellFormat.borders.left.lineStyle !== 'None') {
                nextCellLeftBorder = nextCell.cellFormat.borders.left;
            }
            if (!isNullOrUndefined(nextCellLeftBorder) && nextCellLeftBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(rightBorder, nextCellLeftBorder);
            } else if (!isNullOrUndefined(rightBorder) && !((rightBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getRightBorderToRenderByHierarchy(rightBorder, TableRowWidget.getRowOf(rightBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(rightBorder.ownerBase as WBorders).tableFormat.borders);

            }
        }
        return rightBorder;
    }
    /**
     * @private
     */
    public getRightBorderToRenderByHierarchy(rightBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        if (!isNullOrUndefined(rightBorder) && (rightBorder.lineStyle !== 'None' || (rightBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(rightBorder.lineStyle === 'None' && rightBorder.lineWidth === 0 && rightBorder.color === '#000000')))) {
            return rightBorder;
            // tslint:disable-next-line:max-line-length
        } else if (!isNullOrUndefined(rightBorder) && (rightBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(rightBorder.ownerBase).columnIndex === TableCellWidget.getCellOf(rightBorder.ownerBase).ownerRow.childWidgets.length - 1) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.right)) {
                rightBorder = tableBorders.right;
            }
            return rightBorder;
        } else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.vertical) && rowBorders.vertical.lineStyle !== 'None') {
            return rightBorder = rowBorders.vertical;
        } else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.vertical) && tableBorders.vertical.lineStyle !== 'None') {
            return rightBorder = tableBorders.vertical;
        } else {
            return rightBorder;
        }
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
            let prevTopCell: TableCellWidget = undefined;
            //ToDo: Need to analyze more to get the previous cell.
            let prevRow: TableRowWidget = tableCell.ownerRow.previousWidget as TableRowWidget;
            while (!isNullOrUndefined(prevRow) && prevRow.childWidgets.length > 0) {
                for (let i: number = 0; i < prevRow.childWidgets.length; i++) {
                    let prevRowCell: TableCellWidget = prevRow.childWidgets[i] as TableCellWidget;

                    if (prevRowCell.columnIndex + prevRowCell.cellFormat.columnSpan - 1 >= tableCell.columnIndex) {
                        prevTopCell = prevRow.childWidgets[i] as TableCellWidget;
                        break;
                    }
                }
                if (!isNullOrUndefined(prevTopCell)) {
                    break;
                }
                prevRow = prevRow.previousWidget as TableRowWidget;
                //If all the previous rows checked and the previous top cell is null
                // then TableCell previus row matched column index cell is taken for border calculation.
                if (isNullOrUndefined(prevRow) && isNullOrUndefined(prevTopCell)) {
                    prevRow = tableCell.ownerRow.previousWidget as TableRowWidget;
                    if (tableCell.columnIndex < prevRow.childWidgets.length) {
                        for (let i: number = 0; i < prevRow.childWidgets.length; i++) {
                            let prevRowCell: TableCellWidget = prevRow.childWidgets[i] as TableCellWidget;
                            if (prevRowCell.columnIndex === tableCell.columnIndex) {
                                prevTopCell = prevRow.childWidgets[i] as TableCellWidget;
                                break;
                            }
                        }
                        //If table cell Column index is greater than previous row cells count then last cell is taken as previous top cell.
                    } else {
                        // tslint:disable-next-line:max-line-length
                        prevTopCell = (tableCell.ownerRow.previousWidget as TableRowWidget).childWidgets[(tableCell.ownerRow.previousWidget as TableRowWidget).childWidgets.length - 1] as TableCellWidget;
                    }
                }
            }
            //If the border is shared then choose the border based on Conflict Resolution algorithm.
            topBorder = tableCell.getPreviousCellTopBorder(topBorder, prevTopCell);
        }
        if (isNullOrUndefined(topBorder)) {
            topBorder = new WBorder(tableCell.cellFormat.borders);
        }
        return topBorder;
    }
    /**
     * @private
     */
    public getPreviousCellTopBorder(topBorder: WBorder, previousTopCell: TableCellWidget): WBorder {
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(previousTopCell) || (!isNullOrUndefined(topBorder) && (topBorder.lineStyle === 'None' && !topBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(topBorder) && !((topBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase as WBorders).tableFormat.borders);
            }
        } else {
            let prevTopCellBottomBorder: WBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(previousTopCell.cellFormat.borders) && !isNullOrUndefined(previousTopCell.cellFormat.borders.bottom) && previousTopCell.cellFormat.borders.bottom.lineStyle !== 'None') {
                prevTopCellBottomBorder = previousTopCell.cellFormat.borders.bottom;
            }
            if (!isNullOrUndefined(prevTopCellBottomBorder) && prevTopCellBottomBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(topBorder, prevTopCellBottomBorder);
            } else if (!isNullOrUndefined(topBorder) && !((topBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getTopBorderToRenderByHierarchy(topBorder, TableRowWidget.getRowOf(topBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(topBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        return topBorder;
    }
    /**
     * @private
     */
    public getTopBorderToRenderByHierarchy(topBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        if (!isNullOrUndefined(topBorder) && (topBorder.lineStyle !== 'None' || (topBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(topBorder.lineStyle === 'None' && topBorder.lineWidth === 0 && topBorder.color === '#000000')))) {
            return topBorder;
            // tslint:disable-next-line:max-line-length
        } else if (!isNullOrUndefined(topBorder) && (topBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(topBorder.ownerBase as WBorders).ownerRow.rowIndex === 0) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.top)) {
                topBorder = tableBorders.top;
            }
            return topBorder;
        } else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.horizontal) && rowBorders.horizontal.lineStyle !== 'None') {
            return topBorder = rowBorders.horizontal;
        } else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.horizontal) && tableBorders.horizontal.lineStyle !== 'None') {
            return topBorder = tableBorders.horizontal;
        } else {
            return topBorder;
        }
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
            // tslint:disable-next-line:max-line-length
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders); // select the left border based on heirarchy.
        }
        if (tableCell.ownerTable.tableFormat.cellSpacing > 0) {
            bottomBorder = tableCell.getBottomBorderToRenderByHierarchy(bottomBorder, rowBorders, tableBorders);
        } else {
            let nextBottomCell: TableCellWidget = undefined;
            let nextRow: TableRowWidget = tableCell.ownerRow.nextWidget as TableRowWidget;
            if (!isNullOrUndefined(nextRow) && tableCell.columnIndex < nextRow.childWidgets.length) {
                nextBottomCell = nextRow.childWidgets[tableCell.columnIndex] as TableCellWidget;
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
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(nextBottomCell) || (!isNullOrUndefined(bottomBorder) && (bottomBorder.lineStyle === 'None' && !bottomBorder.hasNoneStyle))) {
            if (!isNullOrUndefined(bottomBorder) && !((bottomBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase as WBorders).tableFormat.borders);
            }
        } else {
            let prevBottomCellTopBorder: WBorder = undefined;
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(nextBottomCell.cellFormat.borders) && !isNullOrUndefined(nextBottomCell.cellFormat.borders.top) && nextBottomCell.cellFormat.borders.top.lineStyle !== 'None') {
                prevBottomCellTopBorder = nextBottomCell.cellFormat.borders.top;
            }
            if (!isNullOrUndefined(prevBottomCellTopBorder) && prevBottomCellTopBorder.lineStyle !== 'None') {
                return this.getBorderBasedOnPriority(bottomBorder, prevBottomCellTopBorder);
            } else if (!isNullOrUndefined(bottomBorder) && !((bottomBorder.ownerBase as WBorders).ownerBase instanceof WTableFormat)) {
                // tslint:disable-next-line:max-line-length
                return this.getBottomBorderToRenderByHierarchy(bottomBorder, TableRowWidget.getRowOf(bottomBorder.ownerBase as WBorders).rowFormat.borders, TableWidget.getTableOf(bottomBorder.ownerBase as WBorders).tableFormat.borders);
            }
        }
        return bottomBorder;
    }
    /**
     * @private
     */
    public getBottomBorderToRenderByHierarchy(bottomBorder: WBorder, rowBorders: WBorders, tableBorders: WBorders): WBorder {
        if (!isNullOrUndefined(bottomBorder) && (bottomBorder.lineStyle !== 'None' || (bottomBorder.hasNoneStyle &&
            //If border defined with default values then border drawn based on hierarchy. 
            !(bottomBorder.lineStyle === 'None' && bottomBorder.lineWidth === 0 && bottomBorder.color === '#000000')))) {
            return bottomBorder;
            // tslint:disable-next-line:max-line-length
        } else if (!isNullOrUndefined(bottomBorder) && (bottomBorder.ownerBase instanceof WBorders) && TableCellWidget.getCellOf(bottomBorder.ownerBase as WBorders).ownerRow.rowIndex + TableCellWidget.getCellOf(bottomBorder.ownerBase as WBorders).cellFormat.rowSpan === TableCellWidget.getCellOf(bottomBorder.ownerBase as WBorders).ownerTable.childWidgets.length) {
            if (!isNullOrUndefined(tableBorders) && !isNullOrUndefined(tableBorders.bottom)) {
                bottomBorder = tableBorders.bottom;
            }
            return bottomBorder;
        } else if (!isNullOrUndefined(rowBorders)
            && !isNullOrUndefined(rowBorders.horizontal) && rowBorders.horizontal.lineStyle !== 'None') {
            return bottomBorder = rowBorders.horizontal;
        } else if (!isNullOrUndefined(tableBorders)
            && !isNullOrUndefined(tableBorders.horizontal) && tableBorders.horizontal.lineStyle !== 'None') {
            return bottomBorder = tableBorders.horizontal;
        } else {
            return bottomBorder;
        }
    }
    private convertHexToRGB(colorCode: string): WColor {
        if (colorCode) {
            colorCode = colorCode.replace(/[^0-9A-â€Œâ€‹F]/gi, '');   // To remove # from color code string.
            let colCodeNo: number = parseInt(colorCode, 16);
            let r: number = (colCodeNo >> 16) & 255;
            let g: number = (colCodeNo >> 8) & 255;
            let b: number = colCodeNo & 255;
            return { 'r': r, 'g': g, 'b': b };
        }
        return undefined;
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
        if (this.margin) {
            cell.margin = this.margin.clone();
        }
        cell.columnIndex = this.columnIndex;
        cell.x = this.x;
        cell.y = this.y;
        cell.height = this.height;
        cell.width = this.width;
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
        super.destroy();
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
        if (index > -1 && this.paragraph.previousSplitWidget === undefined) {
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
        let lineIndex: number = inline.line.paragraph.childWidgets.indexOf(inline.line);
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
            if (inlineElement instanceof TextElementBox || inlineElement instanceof ImageElementBox
                || inlineElement instanceof BookmarkElementBox || (inlineElement instanceof FieldElementBox
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
    public getInline(offset: number, indexInInline: number): ElementInfo {
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
                || inlineElement instanceof BookmarkElementBox
                || inlineElement instanceof FieldElementBox && HelperMethods.isLinkedFieldCharacter(inlineElement as FieldElementBox))) {
                isStarted = true;
            }
            if (isStarted && offset <= count + inlineElement.length) {
                indexInInline = (offset - count);
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
    public margin: Margin = new Margin(0, 0, 0, 0);
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
    get isPageBreak(): boolean {
        if (this instanceof TextElementBox) {
            return this.text === '\f';
        }
        return false;
    }
    /**
     * @private
     */
    public linkFieldCharacter(viewer: LayoutViewer): void {
        if (!(this instanceof FieldElementBox)) {
            return;
        }
        if (this.fieldType === 0) {
            let fieldBegin: FieldElementBox = this as FieldElementBox;
            if (isNullOrUndefined(fieldBegin.fieldEnd)) {
                this.linkFieldTraversingForward(this.line, fieldBegin, fieldBegin);
                if (viewer.fields.indexOf(fieldBegin) === -1) {
                    viewer.fields.push(fieldBegin);
                }
            }
        } else if (this.fieldType === 2) {
            let fieldSeparator: FieldElementBox = this as FieldElementBox;
            //Links the field begin for the current separator.
            if (isNullOrUndefined(fieldSeparator.fieldBegin)) {
                this.linkFieldTraversingBackwardSeparator(this.line, fieldSeparator, fieldSeparator);
            }
            fieldSeparator.fieldBegin.fieldSeparator = fieldSeparator;
            if (!isNullOrUndefined(fieldSeparator.fieldBegin)) {
                //Links to field end traversing from field separator.
                let isFieldEnd: boolean = this.linkFieldTraversingForward(this.line, fieldSeparator.fieldBegin, fieldSeparator);
                if (isNullOrUndefined(fieldSeparator.fieldEnd) && isFieldEnd) {
                    fieldSeparator.fieldEnd = fieldSeparator.fieldBegin.fieldEnd;
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
                    }
                    return !isNullOrUndefined(fieldEnd.fieldBegin);
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
        } else if (line.paragraph.previousRenderedWidget instanceof ParagraphWidget) {
            let prevParagraph: ParagraphWidget = line.paragraph.previousRenderedWidget as ParagraphWidget;
            // tslint:disable-next-line:max-line-length
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
                        if (!isNullOrUndefined((node as FieldElementBox).fieldEnd)) {
                            fieldBegin.fieldEnd = (node as FieldElementBox).fieldEnd;
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
        } else if (line.paragraph.nextRenderedWidget instanceof ParagraphWidget) {
            this.linkFieldTraversingForward(line.paragraph.nextRenderedWidget.childWidgets[0] as LineWidget, fieldBegin, this);
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
        } else if (line.paragraph.nextRenderedWidget instanceof ParagraphWidget) {
            // tslint:disable-next-line:max-line-length
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
    public hasFieldEnd: boolean = false;
    private fieldBeginInternal: FieldElementBox = undefined;
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
        field.characterFormat.copyFormat(this.characterFormat);
        if (this.margin) {
            field.margin = this.margin.clone();
        }
        field.width = this.width;
        field.height = this.height;
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
    constructor() {
        super();
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
        let span: TextElementBox = new TextElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        return span;
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
        let span: FieldTextElementBox = new FieldTextElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.fieldBegin = this.fieldBegin;
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        return span;
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
    constructor() {
        super();
    }
    /**
     * @private
     */
    public clone(): TabElementBox {
        let span: TabElementBox = new TabElementBox();
        span.characterFormat.copyFormat(this.characterFormat);
        span.tabText = this.tabText;
        span.tabLeader = this.tabLeader;
        span.text = this.text;
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        return span;
    }
}
/** 
 * @private
 */
export class BookmarkElementBox extends ElementBox {
    private bookmarkTypeIn: number = 0;
    private refereneceIn: BookmarkElementBox = undefined;
    private nameIn: string = '';
    /**
     * @private
     */
    get bookmarkType(): number {
        return this.bookmarkTypeIn;
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
        if (this.margin) {
            span.margin = this.margin.clone();
        }
        span.width = this.width;
        span.height = this.height;
        return span;
    }
}
/** 
 * @private
 */
export class ImageElementBox extends ElementBox {
    private imageStr: string = '';
    private imgElement: HTMLImageElement = undefined;
    private isInlineImageIn: boolean = true;
    /**
     * @private
     */
    public isMetaFile: boolean = false;
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
        if (!isNullOrUndefined(value)) {
            this.element.src = this.imageStr;
        }
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
        image.isMetaFile = this.isMetaFile;
        image.width = this.width;
        image.height = this.height;
        if (this.margin) {
            image.margin = this.margin.clone();
        }
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
export class Page {
    /**
     * Specifies the Viewer
     * @private
     */
    public viewer: LayoutViewer;
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
    public headerWidget: HeaderFooterWidget = undefined;
    /**
     * @private
     */
    public footerWidget: HeaderFooterWidget = undefined;
    /**
     * @private
     */
    get index(): number {
        if (this.viewer) {
            return this.viewer.pages.indexOf(this);
        }
        return -1;
    }
    /**
     * @private
     */
    get previousPage(): Page {
        let index: number = this.index;
        if (index > 0) {
            return this.viewer.pages[index - 1];
        }
        return undefined;
    }
    /**
     * @private
     */
    get nextPage(): Page {
        let index: number = this.index;
        if (index < this.viewer.pages.length - 1) {
            return this.viewer.pages[index + 1];
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
    constructor() {
        // let text: string = 'DocumentEditor';
    }
    public destroy(): void {
        if (this.headerWidget) {
            if (this.viewer && this.viewer.owner.editor) {
                this.viewer.owner.editor.removeFieldInWidget(this.headerWidget);
            }
            this.headerWidget.destroy();
        }
        this.headerWidget = undefined;
        if (this.footerWidget) {
            if (this.viewer && this.viewer.owner.editor) {
                this.viewer.owner.editor.removeFieldInWidget(this.footerWidget);
            }
            this.footerWidget.destroy();
        }
        this.footerWidget = undefined;
        this.bodyWidgets = [];
        this.bodyWidgets = undefined;
        if (!isNullOrUndefined(this.viewer)) {
            if (!isNullOrUndefined(this.viewer.pages)) {
                this.viewer.removePage(this);
            }
        }
        this.viewer = undefined;
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
    public addColumns(currentColumnIndex: number, columnSpan: number, width: number, minWidth: number, offset: number): void {
        for (let i: number = this.columns.length; i < columnSpan; i++) {
            this.columns.push(new WColumn());
        }
        let availableWidth: number = 0;
        for (let j: number = currentColumnIndex; j < columnSpan; j++) {
            availableWidth += this.columns[j].preferredWidth;
        }
        // If width to add is greater than preferred width, then preferred width will be increased.
        // In case of Gridspan > 1, only last grid column width will be updated.
        let gridSpan: number = columnSpan - currentColumnIndex;
        if (!(gridSpan > 1) && availableWidth < width) {
            this.columns[columnSpan - 1].preferredWidth += (width - availableWidth);
        }
        if (minWidth > this.columns[columnSpan - 1].minWidth) {
            this.columns[columnSpan - 1].minWidth = minWidth;
        }
        if (offset > this.columns[columnSpan - 1].endOffset) {
            this.columns[columnSpan - 1].endOffset = offset;
        }
    }
    /**
     * @private
     */
    public getTotalWidth(): number {
        let width: number = 0;
        for (let i: number = 0; i < this.columns.length; i++) {
            let column: WColumn = this.columns[i];
            width += column.preferredWidth;
        }
        return width;
    }
    /**
     * @private
     */
    public isFitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean): boolean {
        // Gets total preferred width.
        let totalColumnWidth: number = this.getTotalWidth();

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
            factor = isNaN(factor) ? 1 : factor;
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
    public fitColumns(containerWidth: number, preferredTableWidth: number, isAutoWidth: boolean): void {
        // Gets total preferred width.
        let totalColumnWidth: number = this.getTotalWidth();

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

            for (let i: number = 0; i < this.columns.length; i++) {
                let column: WColumn = this.columns[i];
                column.preferredWidth = factor * column.preferredWidth;
            }
        }
    }

    /**
     * @private
     */
    public getCellWidth(columnIndex: number, columnSpan: number, preferredTableWidth: number, isAutoWidth: boolean): number {
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
                    this.columns[i].preferredWidth = this.columns[i].endOffset - this.columns[i - 1].endOffset;
                }
            }
        }
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