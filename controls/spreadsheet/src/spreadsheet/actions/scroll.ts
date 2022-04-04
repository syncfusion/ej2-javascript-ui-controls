import { Browser, EventHandler, getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Spreadsheet, FormulaBarEdit, ScrollEventArgs, isFormulaBarEdit, colWidthChanged, mouseDown, getUpdateUsingRaf } from '../index';
import { contentLoaded, spreadsheetDestroyed, onVerticalScroll, onHorizontalScroll, getScrollBarWidth, IScrollArgs } from '../common/index';
import { IOffset, onContentScroll, deInitProperties, setScrollEvent, updateScroll, selectionStatus } from '../common/index';
import { virtualContentLoaded, updateScrollValue } from '../common/index';
import { SheetModel, getRowHeight, getColumnWidth, getCellAddress, skipHiddenIdx } from '../../workbook/index';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * The `Scroll` module is used to handle scrolling behavior.
 *
 * @hidden
 */
export class Scroll {
    private parent: Spreadsheet;
    /** @hidden */
    public offset: { left: IOffset, top: IOffset };
    private topIndex: number;
    private leftIndex: number;
    private clientX: number = 0;
    /** @hidden */
    public isKeyScroll: boolean = true;
    private initScrollValue: number; // For RTL mode
    /** @hidden */
    public prevScroll: { scrollLeft: number, scrollTop: number };

    /**
     * Constructor for the Spreadsheet scroll module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet scroll module.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.initProps();
    }

    private onContentScroll(e: ScrollEventArgs): void {
        if (!this.parent) {
            return;
        }
        const target: HTMLElement = this.parent.getMainContent().parentElement;
        const scrollLeft: number = e.scrollLeft; const top: number = e.scrollTop || target.scrollTop;
        const left: number = scrollLeft && this.parent.enableRtl ? this.initScrollValue - scrollLeft : scrollLeft;
        let scrollArgs: IScrollArgs; let prevSize: number;
        if (this.parent.allowAutoFill) {
            const elem: Element = document.querySelector('#' + this.parent.element.id + '_autofilloptionbtn-popup');
            const DDBElem: HTMLElement = document.querySelector('#' + this.parent.element.id + '_autofilloptionbtn');
            if (elem) {
                const DDBObj: DropDownButton = getComponent(DDBElem, DropDownButton);
                DDBObj.toggle();
            }
        }
        if (!isNullOrUndefined(scrollLeft) && this.prevScroll.scrollLeft !== left) {
            const scrollRight: boolean = left > this.prevScroll.scrollLeft;
            prevSize = this.offset.left.size;
            this.offset.left = this.getColOffset(left, scrollRight, e.skipHidden);
            if (!e.preventScroll) {
                this.parent.getColumnHeaderContent().scrollLeft = scrollLeft; this.parent.getMainContent().scrollLeft = scrollLeft;
                e.scrollLeft = scrollLeft;
            }
            scrollArgs = {
                cur: this.offset.left, prev: { idx: this.leftIndex, size: prevSize }, increase: scrollRight, preventScroll: e.preventScroll
            };
            this.updateTopLeftCell(scrollRight, true);
            this.parent.notify(onHorizontalScroll, scrollArgs);
            if (!this.parent.scrollSettings.enableVirtualization && scrollRight && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualCols();
            }
            this.leftIndex = scrollArgs.prev.idx; this.prevScroll.scrollLeft = left;
        }
        if (Math.round(this.prevScroll.scrollTop) !== Math.round(top)) {
            if (e.skipRowVirualScroll) {
                this.prevScroll.scrollTop = 0; this.offset.top = { idx: 0, size: 0 };
            }
            const scrollDown: boolean = top > this.prevScroll.scrollTop;
            prevSize = this.offset.top.size;
            this.offset.top = this.getRowOffset(top, scrollDown);
            scrollArgs = {
                cur: this.offset.top, prev: { idx: this.topIndex, size: prevSize }, increase: scrollDown, preventScroll: e.preventScroll };
            this.updateTopLeftCell(scrollDown);
            if (e.preventScroll && this.offset.top.idx <= this.parent.getThreshold('row')) {
                this.offset.top = { idx: 0, size: 0 };
            } else if (!e.skipRowVirualScroll) {
                this.parent.notify(onVerticalScroll, scrollArgs);
            } else {
                scrollArgs.prev.idx = scrollArgs.cur.idx;
            }
            if (!this.parent.scrollSettings.enableVirtualization && scrollDown && !this.parent.scrollSettings.isFinite) {
                this.updateNonVirtualRows();
            }
            this.topIndex = scrollArgs.prev.idx; this.prevScroll.scrollTop = top;
        }
        const isEdit: boolean = false;
        const args: FormulaBarEdit = {isEdit: isEdit};
        this.parent.notify(isFormulaBarEdit, args);
        if (args.isEdit) {
            const textArea: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar');
            textArea.focus();
        }
        this.isKeyScroll = true;
    }

    private updateScrollValue(args: { scrollLeft?: number, scrollTop?: number }): void {
        if (args.scrollLeft !== undefined) {
            this.prevScroll.scrollLeft = args.scrollLeft + (this.prevScroll.scrollLeft - this.offset.left.size);
            this.offset.left.size = args.scrollLeft;
        }
        if (args.scrollTop !== undefined) {
            this.prevScroll.scrollTop = args.scrollTop + (this.prevScroll.scrollTop - this.offset.top.size);
            this.offset.top.size = args.scrollTop;
        }
    }

    private updateNonVirtualRows(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const threshold: number =  this.parent.getThreshold('row');
        if (this.offset.top.idx > sheet.rowCount - (this.parent.viewport.rowCount + threshold)) {
            this.parent.renderModule.refreshUI(
                { rowIndex: sheet.rowCount , colIndex: 0, direction: 'first', refresh: 'RowPart' },
                `${getCellAddress(sheet.rowCount, 0)}:${getCellAddress(sheet.rowCount + threshold - 1, sheet.colCount - 1)}`);
            this.parent.setSheetPropertyOnMute(sheet, 'rowCount', sheet.rowCount + threshold);
            this.parent.viewport.bottomIndex = sheet.rowCount - 1;
        }
    }

    private updateNonVirtualCols(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const threshold: number =  this.parent.getThreshold('col');
        if (this.offset.left.idx > sheet.colCount - (this.parent.viewport.colCount + threshold)) {
            this.parent.renderModule.refreshUI(
                { rowIndex: 0, colIndex: sheet.colCount, direction: 'first', refresh: 'ColumnPart' },
                `${getCellAddress(0, sheet.colCount)}:${getCellAddress(sheet.rowCount - 1, sheet.colCount + threshold - 1)}`);
            this.parent.setSheetPropertyOnMute(sheet, 'colCount', sheet.colCount + threshold);
            this.parent.viewport.rightIndex = sheet.colCount - 1;
        }
    }

    private updateTopLeftCell(increase: boolean, isLeft?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let top: number = this.offset.top.idx; let left: number = this.offset.left.idx;
        if (!increase) {
            const frozenRow: number = this.parent.frozenRowCount(sheet);
            top = skipHiddenIdx(sheet, top + frozenRow, true) - frozenRow;
            const frozenCol: number = this.parent.frozenColCount(sheet);
            left = skipHiddenIdx(sheet, left + frozenCol, true, 'columns') - frozenCol;
        }
        if (isLeft) {
            this.parent.updateTopLeftCell(null, left, 'row');
        } else {
            this.parent.updateTopLeftCell(top, null, 'col');
        }
    }

    private getRowOffset(scrollTop: number, scrollDown: boolean): IOffset {
        let temp: number = this.offset.top.size;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let i: number = scrollDown ? this.offset.top.idx + 1 : (this.offset.top.idx ? this.offset.top.idx - 1 : 0);
        const frozenRow: number = this.parent.frozenRowCount(sheet);
        const count: number = this.parent.scrollSettings.isFinite ? sheet.rowCount : Infinity;
        scrollTop = Math.round(scrollTop);
        while (i < count) {
            if (scrollDown) {
                temp += getRowHeight(sheet, i - 1 + frozenRow, true);
                if (Math.abs(Math.round(temp) - scrollTop) <= 1) { // <=1 -> For other resolution scrollTop value slightly various with row height
                    return { idx: skipHiddenIdx(sheet, i + frozenRow, true) - frozenRow, size: temp };
                }
                if (Math.round(temp) > scrollTop) {
                    return { idx: i - 1, size: temp - getRowHeight(sheet, i - 1 + frozenRow, true) };
                }
                i++;
            } else {
                temp -= getRowHeight(sheet, i + frozenRow, true);
                if (temp <= 0) {
                    return { idx: 0, size: 0 };
                }
                if (Math.abs(Math.round(temp) - scrollTop) <= 1) {
                    return { idx: i, size: temp };
                }
                if (Math.round(temp) < scrollTop) {
                    temp += getRowHeight(sheet, i + frozenRow, true);
                    if (Math.round(temp) > scrollTop) {
                        return { idx: i, size: temp - getRowHeight(sheet, i + frozenRow, true) < 0 ? 0 :
                            temp - getRowHeight(sheet, i + frozenRow, true) };
                    } else {
                        return { idx: skipHiddenIdx(sheet, i + 1 + frozenRow, true) - frozenRow, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.top.idx, size: this.offset.top.size };
    }

    private getColOffset(scrollLeft: number, increase: boolean, skipHidden: boolean): IOffset {
        let temp: number = this.offset.left.size;
        const sheet: SheetModel = this.parent.getActiveSheet();
        let i: number = increase ? this.offset.left.idx + 1 : (this.offset.left.idx ? this.offset.left.idx - 1 : 0);
        const frozenCol: number = this.parent.frozenColCount(sheet);
        const count: number = this.parent.scrollSettings.isFinite ? sheet.colCount : Infinity;
        while (i < count) {
            if (increase) {
                temp += getColumnWidth(sheet, i - 1 + frozenCol, skipHidden, true);
                if (Math.abs(Math.round(temp) - scrollLeft) <= 1) {
                    return { idx: skipHiddenIdx(sheet, i + frozenCol, true, 'columns') - frozenCol, size: temp };
                }
                if (Math.round(temp) > scrollLeft) {
                    return { idx: i - 1, size: temp - getColumnWidth(sheet, i - 1 + frozenCol, skipHidden, true) };
                }
                i++;
            } else {
                temp -= getColumnWidth(sheet, i + frozenCol, skipHidden, true);
                if (temp <= 0) {
                    return { idx: 0, size: 0 };
                }
                if (Math.abs(Math.round(temp) - scrollLeft) <= 1) {
                    return { idx: i, size: temp };
                }
                if (Math.round(temp) < scrollLeft) {
                    temp += getColumnWidth(sheet, i + frozenCol, skipHidden, true);
                    if (Math.round(temp) > scrollLeft) {
                        temp = temp - getColumnWidth(sheet, i + frozenCol, skipHidden, true);
                        return { idx: i, size: temp < 0 ? 0 : temp};
                    } else {
                        return { idx: skipHiddenIdx(sheet, i + 1 + frozenCol, true, 'columns') - frozenCol, size: temp };
                    }
                }
                i--;
            }
        }
        return { idx: this.offset.left.idx, size: this.offset.left.size };
    }

    private contentLoaded(args: { left?: number }): void {
        if (!this.parent.scrollSettings.enableVirtualization) {
            const scrollTrack: HTMLElement = this.parent.createElement('div', { className: 'e-virtualtrack' });
            this.updateNonVirualScrollWidth({ scrollTrack: scrollTrack });
            this.parent.getScrollElement().appendChild(scrollTrack);
        }
        if (args.left) { this.parent.getScrollElement().scrollLeft = args.left; }
        this.setScrollEvent();
        if (this.parent.enableRtl) { this.initScrollValue = this.parent.getScrollElement().scrollLeft; }
    }

    private updateNonVirualScrollWidth(args: { scrollTrack?: HTMLElement }): void {
        if (!args.scrollTrack) { args.scrollTrack = this.parent.getScrollElement().getElementsByClassName('e-virtualtrack')[0] as HTMLElement; }
        args.scrollTrack.style.width = Math.abs(this.parent.getContentTable().getBoundingClientRect().width) + 'px';
    }

    private onHeaderWheel(e: WheelEvent): void {
        e.preventDefault();
        this.parent.getMainContent().parentElement.scrollTop += e.deltaY;
        this.parent.getScrollElement().scrollLeft += e.deltaX;
    }

    private onContentWheel(e: WheelEvent): void {
        if (e.deltaX !== 0) {
            e.preventDefault();
            this.parent.getScrollElement().scrollLeft += e.deltaX;
        }
    }

    private scrollHandler(e: MouseEvent): void {
        this.onContentScroll(<ScrollEventArgs>{ scrollLeft: (e.target as Element).scrollLeft });
    }

    private updateScroll(args: { top?: number, left?: number }): void {
        if (isNullOrUndefined(args.left)) {
            this.parent.sheetModule.contentPanel.scrollTop = args.top;
        } else {
            this.parent.getScrollElement().scrollLeft = args.left;
        }
    }

    private setScrollEvent(args: { set: boolean } = { set: true }): void {
        if (args.set) {
            EventHandler.add(this.parent.sheetModule.contentPanel, 'scroll', this.onContentScroll, this);
            EventHandler.add(this.parent.getColumnHeaderContent(), 'wheel', this.onHeaderWheel, this);
            EventHandler.add(this.parent.getSelectAllContent(), 'wheel', this.onHeaderWheel, this);
            EventHandler.add(this.parent.getMainContent(), 'wheel', this.onContentWheel, this);
            EventHandler.add(this.parent.getRowHeaderContent(), 'wheel', this.onContentWheel, this);
            EventHandler.add(this.parent.getScrollElement(), 'scroll', this.scrollHandler, this);
        } else {
            EventHandler.remove(this.parent.sheetModule.contentPanel, 'scroll', this.onContentScroll);
            EventHandler.remove(this.parent.getColumnHeaderContent(), 'wheel', this.onHeaderWheel);
            EventHandler.remove(this.parent.getSelectAllContent(), 'wheel', this.onHeaderWheel);
            EventHandler.remove(this.parent.getMainContent(), 'wheel', this.onContentWheel);
            EventHandler.remove(this.parent.getRowHeaderContent(), 'wheel', this.onContentWheel);
            EventHandler.remove(this.parent.getScrollElement(), 'scroll', this.scrollHandler);
        }
    }

    private initProps(): void {
        this.topIndex = 0; this.leftIndex = 0; this.prevScroll = { scrollLeft: 0, scrollTop: 0 };
        this.offset = { left: { idx: 0, size: 0 }, top: { idx: 0, size: 0 } };
    }

    /**
     * @hidden
     *
     * @returns {void} - To Set padding
     */
    public setPadding(): void {
        this.parent.sheetModule.contentPanel.style.overflowY = 'scroll';
        const scrollWidth: number = getScrollBarWidth();
        if (scrollWidth > 0) {
            const colHeader: HTMLElement = this.parent.getColumnHeaderContent();
            const cssProps: { margin: string, border: string } = this.parent.enableRtl ? { margin: 'marginLeft', border: 'borderLeftWidth' }
                : { margin: 'marginRight', border: 'borderRightWidth' };
            colHeader.parentElement.style[cssProps.margin] = scrollWidth + 'px';
            colHeader.style[cssProps.border] = '1px';
        }
    }

    private setClientX(e: PointerEvent | TouchEvent): void {
        if (e.type === 'mousedown' || (e as PointerEvent).pointerType === 'mouse') { return; }
        const args: { touchSelectionStarted: boolean } = { touchSelectionStarted: false };
        this.parent.notify(selectionStatus, args);
        if (args.touchSelectionStarted) { return; }
        this.clientX = this.getPointX(e);
        const sheetContent: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
        EventHandler.add(sheetContent, Browser.isPointer ? 'pointermove' : 'touchmove', this.onTouchScroll, this);
        EventHandler.add(sheetContent, Browser.isPointer ? 'pointerup' : 'touchend', this.pointerUpHandler, this);
    }

    private getPointX(e: PointerEvent | TouchEvent): number {
        let clientX: number = 0;
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length) {
            clientX = (e as TouchEvent).touches[0].clientX;
        } else {
            clientX = (e as PointerEvent).clientX;
        }
        return clientX;
    }

    private onTouchScroll(e: PointerEvent | TouchEvent): void {
        if ((e as PointerEvent).pointerType === 'mouse') { return; }
        const clientX: number = this.getPointX(e);
        const diff: number = this.clientX - clientX;
        const scroller: Element = this.parent.element.getElementsByClassName('e-scroller')[0];
        if ((diff > 10 || diff < -10) && scroller.scrollLeft + diff >= 0) {
            e.preventDefault();
            this.clientX = clientX;
            getUpdateUsingRaf((): void => { scroller.scrollLeft += diff; });
        }
    }

    private pointerUpHandler(): void {
        const sheetContent: HTMLElement = document.getElementById(this.parent.element.id + '_sheet');
        EventHandler.remove(sheetContent, Browser.isPointer ? 'pointermove' : 'touchmove', this.onTouchScroll);
        EventHandler.remove(sheetContent, Browser.isPointer ? 'pointerup' : 'touchend', this.pointerUpHandler);
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.contentLoaded, this);
        this.parent.on(onContentScroll, this.onContentScroll, this);
        this.parent.on(updateScroll, this.updateScroll, this);
        this.parent.on(deInitProperties, this.initProps, this);
        this.parent.on(spreadsheetDestroyed, this.destroy, this);
        this.parent.on(setScrollEvent, this.setScrollEvent, this);
        this.parent.on(mouseDown, this.setClientX, this);
        this.parent.on(updateScrollValue, this.updateScrollValue, this);
        if (!this.parent.scrollSettings.enableVirtualization) {
            this.parent.on(virtualContentLoaded, this.updateNonVirualScrollWidth, this);
            this.parent.on(colWidthChanged, this.updateNonVirualScrollWidth, this);
        }
    }

    private destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private removeEventListener(): void {
        this.parent.off(contentLoaded, this.contentLoaded);
        this.parent.off(onContentScroll, this.onContentScroll);
        this.parent.off(updateScroll, this.updateScroll);
        this.parent.off(deInitProperties, this.initProps);
        this.parent.off(spreadsheetDestroyed, this.destroy);
        this.parent.off(setScrollEvent, this.setScrollEvent);
        this.parent.off(mouseDown, this.setClientX);
        this.parent.off(updateScrollValue, this.updateScrollValue);
        if (!this.parent.scrollSettings.enableVirtualization) {
            this.parent.off(virtualContentLoaded, this.updateNonVirualScrollWidth);
            this.parent.off(colWidthChanged, this.updateNonVirualScrollWidth);
        }
    }
}
