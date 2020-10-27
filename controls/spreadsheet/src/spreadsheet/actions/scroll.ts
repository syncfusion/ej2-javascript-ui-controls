import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { Spreadsheet } from '../base/index';
import { contentLoaded, spreadsheetDestroyed, onVerticalScroll, onHorizontalScroll, getScrollBarWidth, IScrollArgs } from '../common/index';
import { IOffset, onContentScroll, deInitProperties, setScrollEvent, skipHiddenIdx } from '../common/index';
import { SheetModel, getRowHeight, getColumnWidth, getCellAddress } from '../../workbook/index';
import { isFormulaBarEdit, FormulaBarEdit } from '../common/index';

/**
 * The `Scroll` module is used to handle scrolling behavior.
 * @hidden
 */
export class Scroll {
    private parent: Spreadsheet;
    private onScroll: EventListener;
    public offset: { left: IOffset, top: IOffset };
    private topIndex: number;
    private leftIndex: number;
    private initScrollValue: number; // For RTL mode
    /** @hidden */
    public prevScroll: { scrollLeft: number, scrollTop: number };

    /**
     * Constructor for the Spreadsheet scroll module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.initProps();
    }

    private onContentScroll(e: { scrollTop?: number, scrollLeft?: number, preventScroll?: boolean, skipHidden?: boolean }): void {
        let target: HTMLElement = this.parent.getMainContent() as HTMLElement;
        let scrollLeft: number = e.scrollLeft || target.scrollLeft; let top: number = e.scrollTop || target.scrollTop;
        let left: number = this.parent.enableRtl ? this.initScrollValue - scrollLeft : scrollLeft;
        let scrollArgs: IScrollArgs; let prevSize: number;
        if (this.prevScroll.scrollLeft !== left) {
            let scrollRight: boolean = left > this.prevScroll.scrollLeft;
            prevSize = this.offset.left.size;
            this.offset.left = this.getColOffset(left, scrollRight, e.skipHidden);
            if (this.parent.getActiveSheet().showHeaders) { this.parent.getColumnHeaderContent().scrollLeft = scrollLeft; }
            scrollArgs = {
                cur: this.offset.left, prev: { idx: this.leftIndex, size: prevSize }, increase: scrollRight, preventScroll: e.preventScroll
            };
            this.parent.notify(onHorizontalScroll, scrollArgs);
            this.updateTopLeftCell(scrollRight);
            if (!this.parent.scrollSettings.enableVirtualization && scrollRight && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualCols();
            }
            this.leftIndex = scrollArgs.prev.idx; this.prevScroll.scrollLeft = left;
        }
        if (this.prevScroll.scrollTop !== top) {
            let scrollDown: boolean = top > this.prevScroll.scrollTop;
            prevSize = this.offset.top.size;
            this.offset.top = this.getRowOffset(top, scrollDown);
            if (this.parent.getActiveSheet().showHeaders) { this.parent.getRowHeaderContent().scrollTop = top; }
            scrollArgs = {
                cur: this.offset.top, prev: { idx: this.topIndex, size: prevSize }, increase: scrollDown, preventScroll: e.preventScroll };
            this.parent.notify(onVerticalScroll, scrollArgs);
            this.updateTopLeftCell(scrollDown);
            if (!this.parent.scrollSettings.enableVirtualization && scrollDown && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualRows();
            }
            this.topIndex = scrollArgs.prev.idx; this.prevScroll.scrollTop = top;
        }
        let isEdit: boolean = false;
        let args: FormulaBarEdit = {isEdit: isEdit};
        this.parent.notify(isFormulaBarEdit, args);
        if (args.isEdit) {
            let textArea: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar');
            textArea.focus();
        }
    }

    private updateNonVirtualRows(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let threshold: number =  this.parent.getThreshold('row');
        if (this.offset.top.idx > sheet.rowCount - (this.parent.viewport.rowCount + threshold)) {
            this.parent.renderModule.refreshUI(
                { colIndex: 0, direction: 'first', refresh: 'RowPart' },
                `${getCellAddress(sheet.rowCount, 0)}:${getCellAddress(sheet.rowCount + threshold - 1, sheet.colCount - 1)}`);
            sheet.rowCount += threshold;
        }
    }

    private updateNonVirtualCols(): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let threshold: number =  this.parent.getThreshold('col');
        if (this.offset.left.idx > sheet.colCount - (this.parent.viewport.colCount + threshold)) {
            this.parent.renderModule.refreshUI(
                { rowIndex: 0, colIndex: sheet.colCount, direction: 'first', refresh: 'ColumnPart' },
                `${getCellAddress(0, sheet.colCount)}:${getCellAddress(sheet.rowCount - 1, sheet.colCount + threshold - 1)}`);
            sheet.colCount += threshold;
        }
    }

    private updateTopLeftCell(increase: boolean): void {
        let top: number = this.offset.top.idx; let left: number = this.offset.left.idx;
        if (!increase) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            top = skipHiddenIdx(sheet, top, true); left = skipHiddenIdx(sheet, left, true, 'columns');
        }
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'topLeftCell', getCellAddress(top, left));
    }

    private getRowOffset(scrollTop: number, scrollDown: boolean): IOffset {
        let temp: number = this.offset.top.size;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let i: number = scrollDown ? this.offset.top.idx + 1 : (this.offset.top.idx ? this.offset.top.idx - 1 : 0);
        let count: number;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.rowCount;
            if (scrollDown && i + this.parent.viewport.rowCount + this.parent.getThreshold('row') >= count) {
                return { idx: this.offset.top.idx, size: this.offset.top.size };
            }
        } else {
            count = Infinity;
        }
        while (i < count) {
            if (scrollDown) {
                temp += getRowHeight(sheet, i - 1);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollTop) {
                    return { idx: i - 1, size: temp - getRowHeight(sheet, i - 1) };
                }
                i++;
            } else {
                if (temp === 0) { return { idx: 0, size: 0 }; }
                temp -= getRowHeight(sheet, i);
                if (temp === scrollTop) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollTop) {
                    temp += getRowHeight(sheet, i);
                    if (temp > scrollTop) {
                        return { idx: i, size: temp - getRowHeight(sheet, i) };
                    } else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.top.idx, size: this.offset.top.size };
    }

    private getColOffset(scrollLeft: number, increase: boolean, skipHidden: boolean): IOffset {
        let temp: number = this.offset.left.size;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let i: number = increase ? this.offset.left.idx + 1 : this.offset.left.idx - 1;
        let count: number;
        if (this.parent.scrollSettings.isFinite) {
            count = sheet.colCount;
            if (increase && i + this.parent.viewport.colCount + this.parent.getThreshold('col') >= count) {
                return { idx: this.offset.left.idx, size: this.offset.left.size };
            }
        } else {
            count = Infinity;
        }
        while (i < count) {
            if (increase) {
                temp += getColumnWidth(sheet, i - 1, skipHidden);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp > scrollLeft) {
                    return { idx: i - 1, size: temp - getColumnWidth(sheet, i - 1, skipHidden) };
                }
                i++;
            } else {
                if (temp === 0) { return { idx: 0, size: 0 }; }
                temp -= getColumnWidth(sheet, i, skipHidden);
                if (temp === scrollLeft) {
                    return { idx: i, size: temp };
                }
                if (temp < scrollLeft) {
                    temp += getColumnWidth(sheet, i, skipHidden);
                    if (temp > scrollLeft) {
                        return { idx: i, size: temp - getColumnWidth(sheet, i, skipHidden) };
                    } else {
                        return { idx: i + 1, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.left.idx, size: this.offset.left.size };
    }

    private contentLoaded(): void {
        this.onScroll = this.onContentScroll.bind(this);
        this.setScrollEvent();
        if (this.parent.enableRtl) {
            this.initScrollValue = this.parent.getMainContent().scrollLeft;
        }
    }

    private setScrollEvent(args: { set: boolean } = { set: true }): void {
        args.set ? EventHandler.add(this.parent.getMainContent(), 'scroll', this.onScroll, this) :
            EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
    }

    private initProps(): void {
        this.topIndex = 0; this.leftIndex = 0; this.prevScroll = { scrollLeft: 0, scrollTop: 0 };
        this.offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    }

    private getThreshold(): number {
        /* Some browsers places the scroller outside the content, 
         * hence the padding should be adjusted.*/
        if (Browser.info.name === 'mozilla') {
            return 0.5;
        }
        return 1;
    }

    /**
     * @hidden
     */
    public setPadding(): void {
        if (!this.parent.allowScrolling) { return; }
        let colHeader: HTMLElement = <HTMLElement>this.parent.getColumnHeaderContent();
        let rowHeader: HTMLElement = <HTMLElement>this.parent.getRowHeaderContent();
        let scrollWidth: number = getScrollBarWidth() - this.getThreshold();
        let cssProps: { padding: string, border: string } = this.parent.enableRtl ? { padding: 'paddingLeft', border: 'borderLeftWidth' }
            : { padding: 'paddingRight', border: 'borderRightWidth' };
        if (scrollWidth > 0) {
            colHeader.parentElement.style[cssProps.padding] = scrollWidth + 'px';
            colHeader.style[cssProps.border] = '1px';
            rowHeader.style.marginBottom = scrollWidth + 'px';
        }
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.contentLoaded, this);
        this.parent.on(onContentScroll, this.onContentScroll, this);
        this.parent.on(deInitProperties, this.initProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
        this.parent.on(setScrollEvent, this.setScrollEvent, this);
    }

    private destroy(): void {
        EventHandler.remove(this.parent.getMainContent(), 'scroll', this.onScroll);
        this.removeEventListener();
        this.parent = null;
    }

    private removeEventListener(): void {
        this.parent.off(contentLoaded, this.contentLoaded);
        this.parent.off(onContentScroll, this.onContentScroll);
        this.parent.off(deInitProperties, this.initProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
        this.parent.off(setScrollEvent, this.setScrollEvent);
    }
}