import { remove, createElement, closest, formatUnit, Browser, KeyboardEventArgs, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { IGrid, IRenderer, NotifyArgs, VirtualInfo, IModelGenerator, InterSection, RowSelectEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { dataReady, modelChanged, refreshVirtualBlock, contentReady } from '../base/constant';
import * as events from '../base/constant';
import { SentinelType, Offsets } from '../base/type';
import { RenderType } from '../base/enum';
import { ContentRender } from './content-renderer';
import { HeaderRender } from './header-renderer';
import { ServiceLocator } from '../services/service-locator';
import { InterSectionObserver, ScrollDirection } from '../services/intersection-observer';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { isGroupAdaptive, ensureLastRow, ensureFirstRow, getEditedDataIndex, getTransformValues, checkIsVirtual, getVisiblePage, parentsUntil } from '../base/util';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { ColumnWidthService } from '../services/width-controller';
import { Grid } from '../base/grid';
import * as literals from '../base/string-literals';
import { FocusStrategy } from '../services/focus-strategy';
/**
 * VirtualContentRenderer
 *
 * @hidden
 */
export class VirtualContentRenderer extends ContentRender implements IRenderer {
    private count: number;
    private maxPage: number;
    private maxBlock: number;
    private widthServices: ColumnWidthService;
    private prevHeight: number = 0;
    /** @hidden */
    public observer: InterSectionObserver;
    /**
     * @hidden
     */
    public vgenerator: VirtualRowModelGenerator;
    /** @hidden */
    public header: VirtualHeaderRenderer;
    /** @hidden */
    public startIndex: number = 0;
    private preStartIndex: number = 0;
    private preEndIndex: number;
    /** @hidden */
    public startColIndex: number;
    /** @hidden */
    public endColIndex: number;
    private locator: ServiceLocator;
    private preventEvent: boolean = false;
    private actions: string[] = ['filtering', 'searching', 'grouping', 'ungrouping'];
    /** @hidden */
    public content: HTMLElement;
    /** @hidden */
    public offsets: { [x: number]: number } = {};
    private tmpOffsets: { [x: number]: number } = {};
    /** @hidden */
    public virtualEle: VirtualElementHandler = new VirtualElementHandler();
    private offsetKeys: string[] = [];
    private isFocused: boolean = false;
    private isSelection: boolean = false;
    private selectedRowIndex: number;
    private isBottom: boolean = false;
    private isBottomNotify: boolean = false;
    private diff: number = 0;
    private heightChange: boolean = false;
    /** @hidden */
    public isTop: boolean = false;
    /** @hidden */
    public activeKey: string;
    /** @hidden */
    public rowIndex: number;
    /** @hidden */
    public blzRowIndex: number;
    /** @hidden */
    public blazorDataLoad: boolean;
    private cellIndex: number;
    private empty: string | number | Element = undefined;
    private isAdd: boolean;
    private isCancel: boolean = false;
    /** @hidden */
    public requestType: string;
    private editedRowIndex: number;
    private requestTypes: string[] = ['beginEdit', 'cancel', 'delete', 'add', 'save', 'sorting'];
    private isNormaledit: boolean = this.parent.editSettings.mode === 'Normal';
    /** @hidden */
    public virtualData: Object = {};
    private virtualInfiniteData: Object = {};
    private emptyRowData: Object = {};
    private initialRowTop: number;
    private isContextMenuOpen: boolean = false;
    private selectRowIndex: number;
    private isSelectionScroll: boolean = false;
    private validationCheck: boolean = false;
    private validationCol: Column;
    /** @hidden */
    public firstCellFocus: boolean = false;
    private prevPage: number = 0;
    private prevCurrentInfo: VirtualInfo = {};

    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.locator = locator;
        this.eventListener('on');
        this.widthServices = locator.getService<ColumnWidthService>('widthService');
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.vgenerator = <VirtualRowModelGenerator>this.generator;
    }

    public renderTable(): void {
        this.header = <VirtualHeaderRenderer>this.locator.getService<RendererFactory>('rendererFactory').getRenderer(RenderType.Header);
        super.renderTable();
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = this.content = <HTMLElement>this.getPanel().querySelector('.' + literals.content);
        this.virtualEle.renderWrapper(<number>this.parent.height);
        this.virtualEle.renderPlaceHolder();
        if (!(!this.parent.enableVirtualization && this.parent.enableColumnVirtualization)) {
            this.virtualEle.wrapper.style.position = 'absolute';
        }
        const debounceEvent: boolean = (this.parent.dataSource instanceof DataManager && !this.parent.dataSource.dataSource.offline);
        const opt: InterSection = {
            container: this.content, pageHeight: this.getBlockHeight() * 2, debounceEvent: debounceEvent,
            axes: this.parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
    }

    public renderEmpty(tbody: HTMLElement): void {
        this.getTable().appendChild(tbody);
        if (this.parent.frozenRows) {
            this.parent.getHeaderContent().querySelector(literals.tbody).innerHTML = '';
        }
        this.virtualEle.adjustTable(0, 0);
    }

    public getReorderedFrozenRows(args: NotifyArgs): Row<Column>[] {
        const blockIndex: number[] = args.virtualInfo.blockIndexes;
        const colsIndex: number[] = args.virtualInfo.columnIndexes;
        const page: number = args.virtualInfo.page;
        args.virtualInfo.blockIndexes = [1, 2];
        args.virtualInfo.page = 1;
        args.virtualInfo.columnIndexes = [];
        const recordslength: number = this.parent.getCurrentViewRecords().length;
        const firstRecords: object[] = this.parent.renderModule.data.dataManager.dataSource.json.slice(0, recordslength);
        const virtualRows: Row<Column>[] = this.vgenerator.generateRows(firstRecords, args);
        args.virtualInfo.blockIndexes = blockIndex;
        args.virtualInfo.columnIndexes = colsIndex;
        args.virtualInfo.page = page;
        return virtualRows.splice(0, this.parent.frozenRows);
    }

    private scrollListener(scrollArgs: ScrollArg): void {
        if ((!this.parent.enableVirtualization && this.parent.enableColumnVirtualization && (scrollArgs.direction === 'up'
            || scrollArgs.direction === 'down')) || this.isBottomNotify) {
            return;
        }
        this.scrollAfterEdit();
        if (this.parent.enablePersistence) {
            this.parent.scrollPosition = scrollArgs.offset;
        }
        if (this.preventEvent || this.parent.isDestroyed) { this.preventEvent = false; return; }
        if (isNullOrUndefined(document.activeElement)) {
            this.isFocused = false;
        } else {
            this.isFocused = this.content === closest(document.activeElement, '.' + literals.content) || this.content === document.activeElement;
        }
        if (this.parent.islazyloadRequest && scrollArgs.direction === 'down') {
            this.parent.removeMaskRow();
            this.parent.islazyloadRequest = false;
            return;
        }
        const info: SentinelType = scrollArgs.sentinel;
        const viewInfo: VirtualInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (isGroupAdaptive(this.parent)) {
            if (viewInfo.blockIndexes && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString()) {
                this.parent.removeMaskRow();
                return;
            } else {
                viewInfo.event = 'refresh-virtual-block';
                if (!isNullOrUndefined(viewInfo.offsets)) {
                    viewInfo.offsets.top = this.content.scrollTop;
                }
                this.parent.pageSettings.currentPage = viewInfo.page;
                if (this.parent.enableVirtualMaskRow) {
                    this.parent.showMaskRow(info.axis);
                    this.parent.addShimmerEffect();
                }
                if (this.parent.editSettings.showAddNewRow) {
                    this.parent.closeEdit();
                }
                this.parent.notify(
                    viewInfo.event,
                    { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
                return;
            }
        }
        if (this.prevInfo && ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
            || ((info.axis === 'X' && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString())
            || (this.parent.isFrozenGrid() && info.axis === 'X' && this.parent.getVisibleFrozenLeftCount() >= viewInfo.columnIndexes[0]
            && this.prevInfo.columnIndexes.toString().includes(viewInfo.columnIndexes.toString()))))) {
            this.parent.removeMaskRow();
            if (Browser.isIE) {
                this.parent.hideSpinner();
            }
            this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
            if (info.axis === 'Y') {
                this.restoreEdit();
            }
            if (this.parent.groupSettings.enableLazyLoading && this.prevInfo.blockIndexes[0] === 1 && viewInfo.blockIndexes[0] === 1 &&
                scrollArgs.direction === 'up') {
                this.virtualEle.adjustTable(0 , viewInfo.offsets.top < this.offsets[1] ? 0 : this.getBlockHeight());
            }
            return;
        }

        this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        if (!(!this.parent.enableVirtualization && this.parent.enableColumnVirtualization)) {
            this.parent.pageSettings.currentPage = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
        }
        this.requestType = 'virtualscroll';
        if (this.parent.enableVirtualMaskRow) {
            this.parent.showMaskRow(info.axis);
            this.parent.addShimmerEffect();
        }
        this.parent.islazyloadRequest = false;
        if (this.parent.editSettings.showAddNewRow) {
            this.parent.closeEdit();
        }
        this.parent.notify(events.renderResponsiveColumnChooserDiv, { action: 'clear'});
        if (!(!this.parent.isInitialLoad && this.parent.enablePersistence)) {
            if (this.prevPage === this.parent.pageSettings.currentPage && viewInfo.event === modelChanged) {
                this.currentInfo = this.prevCurrentInfo;
                return;
            }
            if (viewInfo.event === modelChanged) {
                this.prevPage = this.parent.pageSettings.currentPage;
                this.prevCurrentInfo = this.currentInfo;
            }
            this.isBottomNotify = this.isBottom && viewInfo.event === modelChanged;
            this.parent.notify(viewInfo.event, {
                requestType: 'virtualscroll', virtualInfo: viewInfo,
                focusElement: scrollArgs.focusElement
            });
        }
        if (this.parent.enableColumnVirtualization && !this.parent.getContentTable().querySelector('tr.e-row')) {
            this.parent.removeMaskRow();
            this.appendContent(undefined, undefined, {
                requestType: 'virtualscroll', virtualInfo: viewInfo,
                focusElement: scrollArgs.focusElement
            });
            this.prevInfo = viewInfo;
        }
    }

    private block(blk: number): boolean {
        return this.vgenerator.isBlockAvailable(blk);
    }

    private getInfoFromView(direction: string, info: SentinelType, e: Offsets): VirtualInfo {
        let isBlockAdded: boolean = false;
        let tempBlocks: number[] = [];
        const infoType: VirtualInfo = { direction: direction, sentinelInfo: info, offsets: e,
            startIndex: this.preStartIndex, endIndex: this.preEndIndex };
        infoType.page = this.getPageFromTop(e.top, infoType);
        infoType.blockIndexes = tempBlocks = this.vgenerator.getBlockIndexes(infoType.page);
        infoType.loadSelf = !this.vgenerator.isBlockAvailable(tempBlocks[infoType.block]);
        const blocks: number[] = this.ensureBlocks(infoType);
        if (this.activeKey === 'upArrow' && infoType.blockIndexes.toString() !== blocks.toString()) {
            // To avoid dupilcate row index problem in key focus support
            const newBlock: number = blocks[blocks.length - 1];
            if (infoType.blockIndexes.indexOf(newBlock) === -1) {
                isBlockAdded = true;
            }
        }
        if (!(!this.parent.enableVirtualization && this.parent.enableColumnVirtualization)) {
            infoType.blockIndexes = blocks;
        }
        infoType.loadNext = !blocks.filter((val: number) => tempBlocks.indexOf(val) === -1)
            .every(this.block.bind(this));
        infoType.event = (infoType.loadNext || infoType.loadSelf) ? modelChanged : refreshVirtualBlock;
        infoType.nextInfo = infoType.loadNext ? { page: Math.max(1, infoType.page + (direction === 'down' ? 1 : -1)) } : {};
        if (isBlockAdded) {
            infoType.blockIndexes = [infoType.blockIndexes[0] - 1, infoType.blockIndexes[0], infoType.blockIndexes[0] + 1];
        }
        if (this.activeKey === 'downArrow' && !isNaN(this.rowIndex)) {
            const firstBlock: number = Math.ceil(this.rowIndex / this.getBlockSize());
            if (firstBlock !== 1 && (infoType.blockIndexes[1] !== firstBlock || infoType.blockIndexes.length < 3)) {
                infoType.blockIndexes = [firstBlock - 1, firstBlock, firstBlock + 1];
                if (infoType.loadNext) {
                    const nextBlock: number[] = this.vgenerator.getBlockIndexes(infoType.nextInfo.page);
                    let hasCommonValue: boolean = false;
                    for (let i: number = 0; i < infoType.blockIndexes.length; i++) {
                        for (let j: number = 0; j < nextBlock.length; j++) {
                            if (infoType.blockIndexes[parseInt(i.toString(), 10)] === nextBlock[parseInt(j.toString(), 10)]) {
                                hasCommonValue = true;
                                break;
                            }
                        }
                        if (hasCommonValue) { break; }
                    }
                    if (!hasCommonValue) {
                        infoType.loadNext = false;
                        infoType.nextInfo = {};
                        infoType.event = refreshVirtualBlock;
                    }
                }
            }
        }
        infoType.columnIndexes = info.axis === 'X' ? this.vgenerator.getColumnIndexes() : this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && info.axis === 'X') {
            infoType.event = refreshVirtualBlock;
        }
        return infoType;
    }

    public ensureBlocks(info: VirtualInfo): number[] {
        let index: number = info.blockIndexes[info.block]; let mIdx: number;
        const old: number = index; const max: Function = Math.max;
        let indexes: number[] = info.direction === 'down' ? [max(index, 1), ++index, ++index] : [max(index - 1, 1), index, index + 1];
        this.prevInfo = this.prevInfo || this.vgenerator.getData();
        indexes = indexes.filter((val: number, ind: number) => indexes.indexOf(val) === ind);
        let preventSelf: boolean = false;
        if (checkIsVirtual(this.parent) && info.direction === 'up' && (((info.page + 1 === this.prevInfo.page
            || info.page === this.prevInfo.page) && (info.block === 1 || (info.block === 0
            && info.page === 1))) || (info.page === this.prevInfo.page && indexes.length === 2))
            && this.vgenerator.isBlockAvailable(info.blockIndexes[1] + 1)) {
            preventSelf = (info.page + 1) === this.prevInfo.page && info.block === 1;
            index += 1;
            indexes = [max(index - 1, 1), index, index + 1];
        }
        if (this.prevInfo.blockIndexes.toString() === indexes.toString()) {
            return indexes;
        }

        if ((info.loadSelf && !preventSelf) || (info.direction === 'down' && this.isEndBlock(old))) {
            indexes = this.vgenerator.getBlockIndexes(info.page);
        }

        indexes.some((val: number, ind: number) => {
            const result: boolean = val === (isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks());
            if (result) { mIdx = ind; }
            return result;
        });

        if (mIdx !== undefined) {
            indexes = indexes.slice(0, mIdx + 1);
            if (info.block === 0 && indexes.length === 1 && this.vgenerator.isBlockAvailable(indexes[0] - 1)) {
                indexes = [indexes[0] - 1, indexes[0]];
            }
        }

        return indexes;
    }

    // tslint:disable-next-line:max-func-body-length
    public appendContent(target: HTMLElement, newChild: DocumentFragment | HTMLElement, e: NotifyArgs): void {
        // currentInfo value will be used if there are multiple dom updates happened due to mousewheel
        const info: VirtualInfo = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
            this.currentInfo.page !== e.virtualInfo.page ? this.currentInfo : e.virtualInfo;
        this.prevInfo = this.prevInfo || e.virtualInfo;
        const cBlock: number = (info.columnIndexes[0]) - 1;
        let cOffset: number = this.getColumnOffset(cBlock);
        let width: string; const blocks: number[] = info.blockIndexes;
        if (this.parent.groupSettings.columns.length) {
            this.refreshOffsets();
        }
        if (this.parent.height === '100%') {
            this.parent.element.style.height = '100%';
        }
        let vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
            vHeight = 0;
        }
        let reduceWidth: number = 0;
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()) {
            let frzLeftWidth: number = 0;
            this.parent.getColumns().filter((col: Column) => {
                if (col.visible) {
                    reduceWidth += parseInt(col.width.toString(), 10);
                    if (col.freeze === 'Left') {
                        frzLeftWidth += parseInt(col.width.toString(), 10);
                    }
                }
            });
            const cIndex: number[] = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            if (cBlock > this.parent.getVisibleFrozenLeftCount()) {
                cOffset = cOffset - frzLeftWidth;
            }
            this.resetStickyLeftPos(cOffset, newChild);
        }
        if (!this.requestTypes.some((value: string) => value === this.requestType)) {
            const translate: number = this.getTranslateY(this.content.scrollTop, <number>vHeight, info);
            if (this.parent.groupSettings.enableLazyLoading && info && this.prevInfo && this.prevInfo.blockIndexes[0] === 1 &&
                info.blockIndexes[0] === 1 && info.direction === 'up') {
                this.virtualEle.adjustTable(0 , this.content.scrollTop < this.offsets[1] ? 0 : this.getBlockHeight());
            } else {
                this.virtualEle.adjustTable(cOffset, translate);
            }
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(cOffset, 0);
        }

        if (this.parent.enableColumnVirtualization) {
            const cIndex: number[] = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            if (this.parent.isFrozenGrid()) {
                width = reduceWidth.toString();
                if (this.parent.allowResizing) {
                    (this.parent.getHeaderTable() as HTMLTableElement).style.width = reduceWidth + 'px';
                    (this.parent.getContentTable() as HTMLTableElement).style.width = reduceWidth + 'Px';
                }
            }
            this.header.virtualEle.setWrapperWidth(width);
        }
        this.virtualEle.setWrapperWidth(width, <boolean>Browser.isIE || Browser.info.name === 'edge');
        if (this.parent.enableColumnVirtualization && isNullOrUndefined(target) && isNullOrUndefined(newChild) ) {
            return;
        }
        if (!isNullOrUndefined(target) && !isNullOrUndefined(target.parentNode)) {
            remove(target);
        }
        const tbody: HTMLElement = this.parent.element.querySelector('.' + literals.content).querySelector( literals.tbody);
        if (tbody) {
            remove(tbody);
            target = null;
        }
        const isReact: boolean = this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate);
        if (!isReact) {
            target = this.parent.createElement( literals.tbody, { attrs: { role: 'rowgroup' } });
            target.appendChild(newChild);
        } else {
            target = newChild as HTMLElement;
        }
        if (this.parent.frozenRows && e.requestType === 'virtualscroll' && (this.parent.pageSettings.currentPage === 1
            || this.isInfiniteColumnvirtualization())) {
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                target.children[0].remove();
            }
        }
        this.getTable().appendChild(target);
        this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
        if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization && (info.direction === 'right' || info.direction === 'left')) {
            this.content.scrollTop = this.currentInfo.offsets.top;
            this.content.scrollLeft = this.currentInfo.offsets.left;
        }
        if (this.parent.groupSettings.columns.length) {
            if (!isGroupAdaptive(this.parent) && info.direction === 'up') {
                const blk: number = this.offsets[this.getTotalBlocks()] - this.prevHeight;
                const sTop: number = this.content.scrollTop;
                this.content.scrollTop = sTop + blk;
            }
            this.setVirtualHeight();
            if (!this.parent.groupSettings.enableLazyLoading) {
                this.observer.setPageHeight(this.getOffset(blocks[blocks.length - 1]) - this.getOffset(blocks[0] - 1));
            }
        }
        if (!this.parent.groupSettings.enableLazyLoading && this.parent.groupSettings.columns.length === 0 &&
            e.requestType === 'ungrouping') {
            this.observer.setPageHeight(this.getBlockHeight() * 2);
        }
        this.prevInfo = info;
        if (this.isFocused  && this.activeKey !== 'downArrow' && this.activeKey !== 'upArrow') {
            this.content.focus();
        }
        const lastPage: number = Math.ceil(this.getTotalBlocks() / 2);
        if (this.isBottom) {
            this.isBottom = false;
            this.isBottomNotify = false;
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 1];
        }
        if ((this.parent.pageSettings.currentPage + 1 === lastPage || this.parent.pageSettings.currentPage === lastPage) &&
            blocks.length === 2 && e.requestType === 'delete') {
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 1];
        }
        if ((this.parent.pageSettings.currentPage === lastPage) && blocks.length === 1) {
            this.isBottom = true;
            setTimeout(() => {
                const scrollElement: HTMLElement = this.parent.getContent().firstElementChild as HTMLElement;
                scrollElement.scrollTop = this.offsets[this.offsetKeys.length - 2];
                const scrollValues: ScrollArg = { direction: 'up', sentinel: this.observer.sentinelInfo.up,
                    offset: { top: scrollElement.scrollTop, left: scrollElement.scrollLeft }, focusElement: this.parent.element };
                this.scrollListener(scrollValues);
            }, 0);
        }
        if (this.isTop) {
            this.parent.getContent().firstElementChild.scrollTop = 0;
            this.isTop = false;
        }
        if (e.requestType === 'virtualscroll' && e.virtualInfo.sentinelInfo.axis === 'X') {
            this.parent.notify(events.autoCol, {});
        }
        this.focusCell(e);
        if (this.firstCellFocus) {
            this.firstCellFocus = false;
            const focusModule: FocusStrategy = this.parent.focusModule;
            const current: number[] = focusModule.active.matrix.current;
            const cell: HTMLElement = (this.parent.getContentTable() as HTMLTableElement).rows[current[0]].cells[current[1]];
            focusModule.currentInfo.element = cell;
            focusModule.currentInfo.elementToFocus = cell;
            cell.classList.add('e-focus');
            cell.classList.add('e-focused');
            cell.tabIndex = 0;
            cell.focus();
        }
        this.restoreEdit(e);
        this.restoreAdd();
        this.ensureSelectedRowPosition();
        this.validationScrollLeft();
        if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization) {
            this.widthServices.refreshFrozenScrollbar();
        }
        if (!this.initialRowTop) {
            const gridTop: number = this.parent.element.getBoundingClientRect().top;
            if (this.parent.getRowByIndex(0)) {
                this.initialRowTop = this.parent.getRowByIndex(0).getBoundingClientRect().top - gridTop;
            }
        }
    }

    private validationScrollLeft(): void {
        if (this.validationCheck) {
            if (this.validationCol) {
                const offset: number = this.vgenerator.cOffsets[(this.validationCol.index - this.parent.getVisibleFrozenColumns()) - 1];
                this.validationCol = null;
                this.content.scrollLeft = offset;
            } else {
                this.validationCheck = false;
                this.parent.editModule.editFormValidate();
            }
        }
    }

    private ensureSelectedRowPosition(): void {
        if (!this.isSelection && this.isSelectionScroll && !isNullOrUndefined(this.selectRowIndex)) {
            this.isSelectionScroll = false;
            const row: Element = this.parent.getRowByIndex(this.selectRowIndex);
            if (row && !this.isRowInView(row)) {
                this.rowSelected({ rowIndex: this.selectRowIndex, row: row }, true);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private focusCell(e: NotifyArgs): void {
        if (this.activeKey !== 'upArrow' && this.activeKey !== 'downArrow') {
            return;
        }
        const row: Element = this.parent.getRowByIndex(this.rowIndex);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cell: any = (<{ cells?: HTMLElement[] }>row).cells[this.cellIndex];
        cell.focus({ preventScroll: true });
        if (!this.parent.selectionSettings.checkboxOnly) {
            this.parent.selectRow(parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1);
        }
        this.activeKey = this.empty as string;
    }

    private restoreEdit(e?: NotifyArgs): void {
        if (this.isNormaledit) {
            if (this.parent.editSettings.allowEditing
                && this.parent.editModule && !isNullOrUndefined(this.editedRowIndex)) {
                const row: HTMLTableRowElement = this.getRowByIndex(this.editedRowIndex) as HTMLTableRowElement;
                const content: Element = this.content;
                const keys: string[] = Object.keys(this.virtualData);
                const isXaxis: boolean = e && e.virtualInfo && e.virtualInfo.sentinelInfo.axis === 'X';
                if (keys.length && row && !content.querySelector('.' + literals.editedRow) &&
                    ['sorting', 'filtering', 'grouping', 'refresh', 'searching', 'ungrouping', 'reorder'].indexOf(e.requestType) === -1) {
                    const top: number = row.getBoundingClientRect().top - this.parent.element.getBoundingClientRect().top;
                    if (isXaxis || (top < this.content.offsetHeight && top > this.parent.getRowHeight())) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
                if (row && this.content.querySelector('.' + literals.editedRow) && !keys.length) {
                    const rowData: Object = (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) ?
                        this.enableCacheOnInfiniteColumnVirtual() ? this.virtualInfiniteData :
                            extend({}, this.parent.getCurrentViewRecords()[this.editedRowIndex]) :
                        extend({}, this.getRowObjectByIndex(this.editedRowIndex));
                    this.virtualData = this.getVirtualEditedData(rowData);
                }
            }
            this.restoreAdd();
        }
    }

    private getVirtualEditedData(rowData: Object): Object {
        const editForms: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-gridform'));
        const isFormDestroyed: boolean = this.parent.editModule && this.parent.editModule.formObj
            && this.parent.editModule.formObj.isDestroyed;
        if (!isFormDestroyed) {
            for (let i: number = 0; i < editForms.length; i++) {
                rowData = this.parent.editModule.getCurrentEditedData(editForms[parseInt(i.toString(), 10)], rowData);
            }
        }
        return rowData;
    }

    private restoreAdd(): void {
        const startAdd: boolean = !this.parent.element.querySelector('.' + literals.addedRow);
        if (this.isNormaledit && this.isAdd && startAdd) {
            const isTop: boolean = this.parent.editSettings.newRowPosition === 'Top' && this.content.scrollTop < this.parent.getRowHeight();
            const isBottom: boolean = this.parent.editSettings.newRowPosition === 'Bottom'
                && this.parent.pageSettings.currentPage === this.maxPage;
            if (isTop || isBottom) {
                this.parent.isEdit = false;
                this.parent.addRecord();
            }
        }
    }

    protected onDataReady(e?: NotifyArgs): void {
        if (!isNullOrUndefined(e.count)) {
            this.count = e.count;
            this.maxPage = Math.ceil((this.parent.groupSettings.columns.length && this.parent.vcRows.length ? this.parent.vcRows.length
                : e.count) / this.parent.pageSettings.pageSize);
        }
        this.vgenerator.checkAndResetCache(e.requestType);
        if (['refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', undefined]
            .some((value: string) => { return e.requestType === value; })) {
            this.refreshOffsets();
        }
        this.setVirtualHeight();
        this.resetScrollPosition(e.requestType);
    }

    /**
     * @param {number} height - specifies the height
     * @returns {void}
     * @hidden
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setVirtualHeight(height?: number): void {
        const width: string = this.parent.enableColumnVirtualization ?
            this.getColumnOffset(this.parent.getVisibleColumns().length + this.parent.groupSettings.columns.length - 1) + 'px' : '100%';
        let virtualHeight: number = (this.offsets[isGroupAdaptive(this.parent) && this.count !== 0 ? this.getGroupedTotalBlocks() :
            this.getTotalBlocks()]);
        if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
            virtualHeight = 0;
        }
        const totalBlocks: number = isGroupAdaptive(this.parent) && this.count !== 0 ? this.getGroupedTotalBlocks()
            : this.getTotalBlocks();
        const lastPage: number = Math.ceil(totalBlocks / 2);
        const placeHolderBottom: number = Math.round(this.virtualEle.placeholder.getBoundingClientRect().bottom);
        const wrapperBottom: number = Math.round(this.virtualEle.wrapper.getBoundingClientRect().bottom);
        if ((this.currentInfo.page === lastPage || this.currentInfo.page + 1 === lastPage) && this.currentInfo.direction === 'down' &&
            placeHolderBottom > wrapperBottom && !this.diff) {
            this.diff = placeHolderBottom - wrapperBottom;
        }
        if (this.diff && (this.currentInfo.page === lastPage) && placeHolderBottom > wrapperBottom &&
            !(this.isAdd && this.parent.editSettings.newRowPosition === 'Bottom')) {
            virtualHeight -= this.diff;
            this.heightChange = true;
        }
        else if (this.requestType === 'virtualscroll'  && this.diff && this.heightChange) {
            virtualHeight -= this.diff;
            this.heightChange = false;
        }
        this.virtualEle.setVirtualHeight(virtualHeight, width);
        if (this.virtualEle && this.virtualEle.wrapper) {
            if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
                this.virtualEle.wrapper.style.minHeight = '';
            } else {
                this.virtualEle.wrapper.style.minHeight = !isNullOrUndefined(virtualHeight) ? formatUnit(<number>this.parent.height) : '0px';
            }
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
        }
    }

    /**
     * @param {number} sTop - specifies the sTop
     * @param {VirtualInfo} info - specifies the info
     * @returns {number} - return the page
     * @hidden
     */
    public getPageFromTop(sTop: number, info: VirtualInfo): number {
        const total: number = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        let page: number = 0;
        this.offsetKeys.some((offset: string) => {
            let iOffset: number = Number(offset);
            const border: boolean = sTop <= this.offsets[`${offset}`] || (iOffset === total && sTop > this.offsets[`${offset}`]);
            if (border) {
                if (this.offsetKeys.length % 2 !== 0 && iOffset.toString() === this.offsetKeys[this.offsetKeys.length - 2]
                    && sTop <= this.offsets[this.offsetKeys.length - 1]) {
                    iOffset = iOffset + 1;
                }
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(this.vgenerator.getPage(iOffset), this.maxPage));
            }
            return border;
        });
        return page;
    }

    protected getTranslateY(sTop: number, cHeight: number, info?: VirtualInfo, isOnenter?: boolean): number {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop, {}) };
            info.blockIndexes = this.vgenerator.getBlockIndexes(info.page);
        }
        const block: number = (info.blockIndexes[0] || 1) - 1;
        const translate: number = this.getOffset(block);
        const endTranslate: number = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        if (isOnenter) {
            info = this.prevInfo;
        }
        let result: number = translate > sTop ?
            this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
        const blockHeight: number = this.offsets[info.blockIndexes[info.blockIndexes.length - 1]] -
            this.tmpOffsets[info.blockIndexes[0]];
        const totalBlocks: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        if (result + blockHeight > this.offsets[parseInt(totalBlocks.toString(), 10)]) {
            result -= (result + blockHeight) - this.offsets[parseInt(totalBlocks.toString(), 10)];
        }
        if (info.page === 1 && info.block === 0 && info.direction === 'up') {
            result = 0;
        }
        if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
            result = 0;
        }
        return result;
    }

    public getOffset(block: number): number {
        return Math.min(this.offsets[parseInt(block.toString(), 10)] | 0, this.offsets[this.maxBlock] | 0);
    }

    private onEntered(): Function {
        return (element: HTMLElement, current: SentinelType, direction: string, e: Offsets, isWheel: boolean, check: boolean) => {
            if ((direction === 'down' || direction === 'up') && !this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
                return;
            }
            if (Browser.isIE && !isWheel && check && !this.preventEvent && !this.parent.enableVirtualMaskRow) {
                this.parent.showSpinner();
            }
            this.prevInfo = this.prevInfo || this.vgenerator.getData();
            const viewInfo: VirtualInfo = this.getInfoFromView(direction, current, e);
            if (this.parent.isFrozenGrid() && current.axis === 'X' && this.parent.getVisibleFrozenLeftCount() >= viewInfo.columnIndexes[0]
                && this.prevInfo && this.prevInfo.columnIndexes.toString().includes(viewInfo.columnIndexes.toString())) {
                return;
            }
            if (this.parent.enableVirtualMaskRow && !this.preventEvent) {
                const firstOffSetKey: number = parseInt(this.offsetKeys[0], 10);
                const lastOffSetKey: number = parseInt(this.offsetKeys[this.offsetKeys.length - 1], 10);
                const blockIndex: number[] = this.currentInfo.blockIndexes;
                const disableShowMaskRow: boolean = (this.prevInfo && current.axis === 'X'
                    && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString())
                    || (direction === 'down' && this.parent.allowGrouping && this.parent.groupSettings.columns.length
                        && ((this.parent.allowFiltering && this.parent.filterSettings.columns.length)
                            || this.parent.searchSettings.key.length) && this.offsetKeys.length <= 2);
                if (!((blockIndex && blockIndex[0] === firstOffSetKey && direction === 'up') ||
                    (blockIndex && blockIndex[blockIndex.length - 1] === lastOffSetKey && direction === 'down') || disableShowMaskRow)) {
                    setTimeout(() => {
                        this.parent.showMaskRow(current.axis);
                    }, 0);
                }
            }
            const xAxis: boolean = current.axis === 'X'; const top: number = this.prevInfo.offsets ? this.prevInfo.offsets.top : null;
            const height: number = this.content.getBoundingClientRect().height;
            let x: number = this.getColumnOffset(xAxis ? this.vgenerator.getColumnIndexes()[0] - 1 : this.prevInfo.columnIndexes[0] - 1);
            if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization && this.currentInfo &&
                this.currentInfo.columnIndexes) {
                const cBlock: number = this.currentInfo.columnIndexes[0] - 1;
                let frzLeftWidth: number = 0;
                this.parent.getColumns().filter((col: Column) => {
                    if (col.visible && col.freeze === 'Left') {
                        frzLeftWidth += parseInt(col.width.toString(), 10);
                    }
                });
                if (cBlock > this.parent.getVisibleFrozenLeftCount()) {
                    x = x - frzLeftWidth;
                }
            }
            if (xAxis) {
                const idx: number = Object.keys(this.vgenerator.cOffsets).length - this.prevInfo.columnIndexes.length;
                const maxLeft: number = this.vgenerator.cOffsets[idx - 1];
                x = x > maxLeft ? maxLeft : x; //TODO: This fix horizontal scrollbar jumping issue in column virtualization.
            }
            if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
                this.virtualEle.adjustTable(x, 0);
            } else {
                const y: number = this.getTranslateY(e.top, height, xAxis && top === e.top ? this.prevInfo : undefined, true);
                this.virtualEle.adjustTable(x, Math.min(y, this.offsets[this.maxBlock]));
            }
            if (this.parent.enableColumnVirtualization) {
                this.header.virtualEle.adjustTable(x, 0);
                if (this.parent.isFrozenGrid()) {
                    this.resetStickyLeftPos(x);
                }
            }
        };
    }

    private dataBound(): void {
        this.parent.notify(events.refreshVirtualFrozenHeight, {});
        if (this.isSelection && this.activeKey !== 'upArrow' && this.activeKey !== 'downArrow') {
            this.parent.selectRow(this.selectedRowIndex);
        } else {
            this.activeKey = this.empty as string;
            this.requestType = this.empty as string;
        }
    }

    /**
     * To calculate the position of frozen cells
     *
     * @param {number} valueX - specifies the transform X value
     * @param {DocumentFragment | HTMLElement} newChild - specifies the element to transform
     * @returns {void}
     * @hidden
     */
    public resetStickyLeftPos(valueX?: number, newChild?: DocumentFragment | HTMLElement): void {
        const cells: HTMLElement[] = [].slice.call(this.parent.getHeaderContent().querySelectorAll(
            '.e-leftfreeze,.e-rightfreeze,.e-fixedfreeze')).concat([].slice.call(
            (newChild ? newChild : this.parent.getContent()).querySelectorAll('.e-leftfreeze,.e-rightfreeze,.e-fixedfreeze')));
        let frzLeftWidth: number = 0;
        let frzRightWidth: number = 0;
        if (this.parent.getHeaderContent().querySelectorAll('.e-fixedfreeze').length) {
            frzLeftWidth = this.parent.leftrightColumnWidth('left');
            frzRightWidth = this.parent.leftrightColumnWidth('right');
        }
        if (cells.length) {
            for (let i: number = 0; i < cells.length; i++) {
                const cell: HTMLElement = cells[parseInt(i.toString(), 10)];
                let col: Column;
                if (cell.classList.contains('e-rowcell')) {
                    if (isNullOrUndefined(cell.getAttribute('aria-colindex')) && cell.querySelector('[data-mappinguid]')) {
                        const uid: string = cell.querySelector('[data-mappinguid]').getAttribute('data-mappinguid');
                        col = this.parent.getColumnByUid(uid);
                    } else {
                        const idx: number = parseInt(cell.getAttribute('aria-colindex'), 10) - 1;
                        col = this.parent.getColumnByIndex(parseInt(idx.toString(), 10));
                    }
                } else {
                    if (cell.classList.contains('e-headercell') || cell.classList.contains('e-filterbarcell')) {
                        const uid: string = cell.classList.contains('e-filterbarcell') ? cell.getAttribute('data-mappinguid') :
                            cell.querySelector('[data-mappinguid]').getAttribute('data-mappinguid');
                        col = this.parent.getColumnByUid(uid);
                    }
                }
                if (!isNullOrUndefined(col)) {
                    if (col.freeze === 'Left') {
                        cell.style.left = ((<{ valueX?: number }>col).valueX  - valueX) + 'px';
                    } else if (col.freeze === 'Right') {
                        cell.style.right = ((<{ valueX?: number }>col).valueX  + valueX) + 'px';
                    } else if (col.freeze === 'Fixed') {
                        cell.style.left = (frzLeftWidth  - valueX) + 'px';
                        cell.style.right = (frzRightWidth  + valueX) + 'px';
                    }
                }
            }
        }
        this.parent.translateX = valueX;
    }

    private rowSelected(args: RowSelectEventArgs, isSelection?: boolean): void {
        if ((this.isSelection || isSelection) && !this.isLastBlockRow(args.rowIndex)) {
            const transform: { width: number, height: number } = getTransformValues(this.content.firstElementChild);
            const gridTop: number = this.parent.element.getBoundingClientRect().top;
            const rowTop: number = (args.row as HTMLElement).getBoundingClientRect().top - gridTop;
            const height: number = this.content.getBoundingClientRect().height;
            const isBottom: boolean = height < rowTop;
            const remainHeight: number = isBottom ? rowTop - height : this.initialRowTop - rowTop;
            let translateY: number = isBottom ? transform.height - remainHeight : transform.height + remainHeight;
            this.virtualEle.adjustTable(transform.width, translateY);
            const wrapperInfo: DOMRect | ClientRect = this.virtualEle.wrapper.getBoundingClientRect();
            const contentInfo: DOMRect | ClientRect = this.content.getBoundingClientRect();
            if (wrapperInfo.top > contentInfo.top) {
                this.virtualEle.adjustTable(transform.width, translateY - (wrapperInfo.top - contentInfo.top));
            }
            const lastRowTop: number = this.content.querySelector('tbody').lastElementChild.getBoundingClientRect().top - gridTop;
            if (lastRowTop < height) {
                translateY = translateY + (height - ((args.row as HTMLElement).getBoundingClientRect().top - gridTop));
                this.virtualEle.adjustTable(transform.width, translateY - (this.parent.getRowHeight() / 2));
            } else if (contentInfo.bottom > wrapperInfo.bottom) {
                this.virtualEle.adjustTable(transform.width, translateY + (contentInfo.bottom - wrapperInfo.bottom));
            }
            if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization) {
                this.resetStickyLeftPos(transform.width);
            }
        }
        this.isSelection = false;
    }

    private isLastBlockRow(index: number): boolean {
        const scrollEle: Element = this.parent.getContent().firstElementChild;
        const visibleRowCount: number = Math.floor((scrollEle as HTMLElement).offsetHeight / this.parent.getRowHeight()) - 1;
        const startIdx: number = (this.maxPage * this.parent.pageSettings.pageSize) - visibleRowCount;
        return index >= startIdx;
    }

    private refreshMaxPage(): void {
        if (this.parent.groupSettings.columns.length && this.parent.vcRows.length) {
            this.maxPage = Math.ceil(this.parent.vcRows.length / this.parent.pageSettings.pageSize);
        }
    }

    private setVirtualPageQuery(args: { query: Query, skipPage: boolean }): void {
        let visiblePage: number[] = [];
        if (this.prevInfo && this.prevInfo.blockIndexes) {
            visiblePage = getVisiblePage(this.prevInfo.blockIndexes);
        }
        if ((this.requestType === 'sorting' || this.requestType === 'delete') && visiblePage.length && checkIsVirtual(this.parent)) {
            args.query.skip(this.parent.pageSettings.pageSize * (visiblePage[0] - 1));
            args.query.take(this.parent.pageSettings.pageSize * visiblePage.length);
            args.skipPage = true;
            return;
        }
        const row: Element = this.parent.getContent().querySelector('.e-row');
        if (this.requestType === 'virtualscroll' && this.vgenerator.currentInfo.blockIndexes) {
            this.vgenerator.currentInfo = {};
        }
        if (row && this.parent.isManualRefresh && this.currentInfo.blockIndexes
            && (this.currentInfo.blockIndexes.length === 3 || visiblePage.length > 1)) {
            this.vgenerator.startIndex = parseInt(row.getAttribute('aria-rowindex'), 10) - 1;
            this.vgenerator.currentInfo = extend({}, this.currentInfo);
            this.vgenerator.currentInfo.blockIndexes = this.currentInfo.blockIndexes.slice();
            const includePrevPage: boolean = this.vgenerator.includePrevPage = this.currentInfo.blockIndexes[0] % 2 === 0;
            if (includePrevPage) {
                this.vgenerator.startIndex = this.vgenerator.startIndex - this.getBlockSize();
                this.vgenerator.currentInfo.blockIndexes.unshift(this.currentInfo.blockIndexes[0] - 1);
            } else {
                this.vgenerator.currentInfo.blockIndexes.push(this.currentInfo.blockIndexes[this.currentInfo.blockIndexes.length - 1] + 1);
            }
            const skip: number = (this.vgenerator.currentInfo.blockIndexes[0] - 1) * this.getBlockSize();
            const take: number = this.vgenerator.currentInfo.blockIndexes.length * this.getBlockSize();
            args.query.skip(skip);
            args.query.take(take);
            args.skipPage = true;
        }
    }

    public eventListener(action: string): void {
        this.parent[`${action}`](dataReady, this.onDataReady, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.addEventListener(events.rowSelected, this.rowSelected.bind(this));
        this.parent[`${action}`](refreshVirtualBlock, this.refreshContentRows, this);
        this.parent[`${action}`](events.refreshVirtualLazyLoadCache, this.refreshVirtualLazyLoadCache, this);
        this.parent[`${action}`](events.selectVirtualRow, this.selectVirtualRow, this);
        this.parent[`${action}`](events.virtaulCellFocus, this.virtualCellFocus, this);
        this.parent[`${action}`](events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent[`${action}`](events.virtualScrollAddActionBegin, this.addActionBegin, this);
        this.parent[`${action}`](events.virtualScrollEdit, this.restoreEdit, this);
        this.parent[`${action}`](events.virtualScrollEditSuccess, this.editSuccess, this);
        this.parent[`${action}`](events.refreshVirtualCache, this.refreshCache, this);
        this.parent[`${action}`](events.editReset, this.resetIsedit, this);
        this.parent[`${action}`](events.getVirtualData, this.getVirtualData, this);
        this.parent[`${action}`](events.virtualScrollEditCancel, this.editCancel, this);
        this.parent[`${action}`](events.refreshVirtualMaxPage, this.refreshMaxPage, this);
        this.parent[`${action}`](events.setVirtualPageQuery, this.setVirtualPageQuery, this);
        this.parent[`${action}`](events.selectRowOnContextOpen, this.selectRowOnContextOpen, this);
        this.parent[`${action}`](events.resetVirtualFocus, this.resetVirtualFocus, this);
        this.parent[`${action}`](events.refreshVirtualEditFormCells, this.refreshCells, this);
        this.parent[`${action}`](events.scrollToEdit, this.scrollToEdit, this);
        const event: string[] = this.actions;
        for (let i: number = 0; i < event.length; i++) {
            this.parent[`${action}`](`${event[parseInt(i.toString(), 10)]}-begin`, this.onActionBegin, this);
        }
        const fn: Function = () => {
            this.observer.observe((scrollArgs: ScrollArg) => this.scrollListener(scrollArgs), this.onEntered());
            const gObj: IGrid = this.parent;
            if (gObj.enablePersistence && gObj.scrollPosition) {
                if (gObj.scrollPosition.top > 0) {
                    this.content.scrollTop = gObj.scrollPosition.top;
                    const scrollValues: ScrollArg = { direction: 'down', sentinel: this.observer.sentinelInfo.down,
                        offset: gObj.scrollPosition, focusElement: gObj.element };
                    this.scrollListener(scrollValues);
                }
                if (gObj.enableColumnVirtualization) {
                    this.content.scrollLeft = gObj.scrollPosition.left;
                }
            }
            this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    }

    private refreshVirtualLazyLoadCache(e: { rows: Row<Column>[], uid?: string, count?: number }): void {
        let blockIndex: number[] = this.currentInfo.blockIndexes;
        if (isNullOrUndefined(this.currentInfo.blockIndexes)) {
            blockIndex = [1, 2];
        }
        let block: number;
        let index: number;
        let cache: Row<Column>[];
        for (let i: number = 0; i < blockIndex.length; i++) {
            const rows: Row<Column>[] = this.vgenerator.cache[blockIndex[parseInt(i.toString(), 10)]];
            for (let j: number = 0; j < rows.length; j++) {
                if (rows[parseInt(j.toString(), 10)].uid === e.uid) {
                    block = blockIndex[parseInt(i.toString(), 10)]; index = j; cache = rows;
                    break;
                }
            }
        }
        if (e.count) {
            this.vgenerator.cache[parseInt(block.toString(), 10)].splice(index + 1, e.count);
        } else if (e.rows && e.rows.length) {
            this.vgenerator.cache[parseInt(block.toString(), 10)] = ([].slice.call(cache.slice(0, index + 1)).concat(
                [].slice.call(e.rows))).concat([].slice.call(cache.slice(index + 1, cache.length)));
        }
        this.refreshOffsets();
    }

    private scrollToEdit(col: Column): void {
        let allowScroll: boolean = true;
        this.validationCheck = true;
        if (this.isAdd && this.content.scrollTop > 0) {
            allowScroll = false;
            const keys: string[] = Object.keys(this.offsets);
            this.content.scrollTop = this.parent.editSettings.newRowPosition === 'Top' ? 0 : this.offsets[keys.length - 1];
        }
        const row: Element = this.parent.getRowByIndex(this.editedRowIndex);
        if (!row && !isNullOrUndefined(this.editedRowIndex)) {
            if (!row || !this.isRowInView(row)) {
                const rowIndex: number = this.parent.getRowHeight();
                const scrollTop: number = this.editedRowIndex * rowIndex;
                if (!isNullOrUndefined(scrollTop)) {
                    allowScroll = false;
                    this.content.scrollTop = scrollTop;
                }
            }
        }
        if (col && allowScroll) {
            let offset: number = this.vgenerator.cOffsets[(col.index - this.parent.getVisibleFrozenColumns()) - 1];
            if (!this.parent.enableColumnVirtualization) {
                const header: Element = this.parent.getHeaderContent().querySelector('.e-headercelldiv[data-mappinguid="' + col.uid + '"]');
                offset = (header.parentElement as HTMLElement).offsetLeft;
            }
            if (this.parent.enableColumnVirtualization && this.parent.getVisibleFrozenLeftCount()) {
                offset -= this.parent.leftrightColumnWidth('left');
            }
            this.content.scrollLeft = this.parent.enableRtl ? -Math.abs(offset) : offset;
        }
        if (col && !allowScroll) {
            this.validationCol = col;
        }
    }

    private refreshCells(rowObj: Row<Column>): void {
        rowObj.cells = this.vgenerator.generateCells(rowObj.foreignKeyData);
    }

    private resetVirtualFocus(e: { isCancel: boolean }): void {
        this.isCancel = e.isCancel;
    }

    /**
     * @param {Object} data - specifies the data
     * @param {Object} data.virtualData -specifies the data
     * @param {boolean} data.isAdd - specifies isAdd
     * @param {boolean} data.isCancel - specifies boolean in cancel
     * @param {boolean} data.isScroll - specifies boolean for scroll
     * @returns {void}
     * @hidden
     */
    public getVirtualData(data: { virtualData: Object, isAdd: boolean, isCancel: boolean, isScroll: boolean }): void {
        if (this.isNormaledit) {
            const error: Element = this.parent.element.querySelector('.e-griderror:not([style*="display: none"])');
            const keys: string[] = Object.keys(this.virtualData);
            data.isScroll = keys.length !== 0 && this.currentInfo.sentinelInfo && this.currentInfo.sentinelInfo.axis === 'X';
            if (error) {
                return;
            }
            this.virtualData = keys.length ? this.virtualData : data.virtualData;
            this.getVirtualEditedData(this.virtualData);
            data.virtualData = this.virtualData;
            data.isAdd = this.isAdd || this.parent.editSettings.showAddNewRow;
            data.isCancel = this.isCancel;
        }
    }

    private selectRowOnContextOpen(args: { isOpen: boolean }): void {
        this.isContextMenuOpen = args.isOpen;
    }

    private editCancel(args: { data: Object }): void {
        const dataIndex: number = getEditedDataIndex(this.parent, args.data);
        if (!isNullOrUndefined(dataIndex)) {
            args.data = this.parent.getCurrentViewRecords()[parseInt(dataIndex.toString(), 10)];
        }
    }

    private editSuccess(args?: EditArgs): void {
        if (this.isNormaledit) {
            if (!this.isAdd && args.data) {
                this.updateCurrentViewData(args.data);
            }
            this.isAdd = false;
        }
    }

    private updateCurrentViewData(data: Object): void {
        const dataIndex: number = getEditedDataIndex(this.parent, data);
        if (!isNullOrUndefined(dataIndex)) {
            this.parent.getCurrentViewRecords()[parseInt(dataIndex.toString(), 10)] = data;
        }
    }

    private actionBegin(args: NotifyArgs): void {
        if (args.requestType !== 'virtualscroll') {
            this.requestType = args.requestType;
        }
        if (!args.cancel) {
            this.parent.notify(events.refreshVirtualFrozenRows, args);
        }
    }

    private virtualCellFocus(e: KeyboardEventArgs): void {
        // To decide the action (select or scroll), when using arrow keys for cell focus
        let ele: Element = document.activeElement;
        if (!ele.classList.contains(literals.rowCell) && (ele instanceof HTMLInputElement
            || !isNullOrUndefined(ele.closest('.e-templatecell')))) {
            ele = ele.closest('.e-rowcell');
        }
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length
            && ele && (ele.classList.contains(literals.rowCell) || !isNullOrUndefined(parentsUntil(ele, literals.groupCaptionRow)))
            && e && (e.action === 'shiftEnter' || e.action === 'upArrow' || e.action === 'downArrow')) {
            const scrollEle: Element = this.parent.getContent().firstElementChild;
            const scrollEleInfo: DOMRect | ClientRect = scrollEle.getBoundingClientRect();
            const row: Element = closest(ele, 'tr');
            const nextFocusRow: Element = e.action === 'downArrow' ? row.nextElementSibling : row.previousElementSibling;
            const nextFocusRowInfo: DOMRect | ClientRect = !isNullOrUndefined(nextFocusRow) ? nextFocusRow.getBoundingClientRect()
                : undefined;
            if (isNullOrUndefined(nextFocusRow) || (e.action === 'downArrow' && nextFocusRowInfo.bottom > scrollEleInfo.bottom)
                || ((e.action === 'upArrow' || e.action === 'shiftEnter') && nextFocusRowInfo.top < scrollEleInfo.top)) {
                this.activeKey = e.action;
                this.parent.focusModule.virtualSelectionInfo = { isPending: isNullOrUndefined(nextFocusRow),
                    direction: e.action, event: e };
                const viewDifference: number = isNullOrUndefined(nextFocusRow) ? this.parent.getRowHeight()
                    : e.action === 'downArrow' ? nextFocusRowInfo.bottom - scrollEleInfo.bottom
                        : scrollEleInfo.top - nextFocusRowInfo.top;
                scrollEle.scrollTop = e.action === 'downArrow' ? scrollEle.scrollTop + viewDifference
                    : scrollEle.scrollTop - viewDifference;
            } else {
                this.activeKey = this.empty as string;
            }
            return;
        }
        if (ele && ele.classList.contains(literals.rowCell)
            && e && (e.action === 'upArrow' || e.action === 'downArrow' || e.action === 'shiftEnter')) {
            let rowIndex: number = parseInt(ele.parentElement.getAttribute(literals.ariaRowIndex), 10) - 1;
            if (e && (e.action === 'upArrow' || e.action === 'shiftEnter' || e.action === 'downArrow')) {
                const scrollEle: Element = this.parent.getContent().firstElementChild;
                if (e.action === 'downArrow') {
                    rowIndex += 1;
                } else {
                    rowIndex -= 1;
                }
                this.rowIndex = rowIndex;
                this.cellIndex = parseInt(ele.getAttribute(literals.ariaColIndex), 10) - 1;
                const row: Element = this.parent.getRowByIndex(rowIndex);
                const page: number = this.parent.pageSettings.currentPage;
                const visibleRowCount: number = Math.floor((scrollEle as HTMLElement).offsetHeight / this.parent.getRowHeight()) - 1;
                let emptyRow: boolean = false;
                if (isNullOrUndefined(row)) {
                    emptyRow = true;
                    if ((e.action === 'downArrow' && page === this.maxPage - 1) || ((e.action === 'upArrow' || e.action === 'shiftEnter') && page === 1)) {
                        emptyRow = false;
                    }
                }
                if (emptyRow || (ensureLastRow(row, this.parent) && e.action === 'downArrow')
                    || (ensureFirstRow(row, this.parent.getRowHeight() * 2) && (e.action === 'upArrow' || e.action === 'shiftEnter'))) {
                    this.activeKey = e.action;
                    scrollEle.scrollTop = e.action === 'downArrow' ?
                        (rowIndex - visibleRowCount) * this.parent.getRowHeight() : rowIndex * this.parent.getRowHeight();
                } else {
                    this.activeKey = this.empty as string;
                }
                if (!this.parent.selectionSettings.checkboxOnly) {
                    this.parent.selectRow(rowIndex);
                }
            }
        }
    }

    private editActionBegin(e: { data: Object, index: number, isScroll: boolean }): void {
        this.editedRowIndex = e.index;
        const rowData: Object = (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) ?
            extend({}, this.parent.getCurrentViewRecords()[e.index]) : extend({}, this.getRowObjectByIndex(e.index));
        const keys: string[] = Object.keys(this.virtualData);
        e.data = keys.length && !this.parent.editSettings.showAddNewRow ? this.virtualData : this.isInfiniteColumnvirtualization() ?
            e.data : rowData;
        if (this.enableCacheOnInfiniteColumnVirtual()) {
            this.virtualInfiniteData = e.data;
        }
        e.isScroll = keys.length !== 0 && this.currentInfo.sentinelInfo && this.currentInfo.sentinelInfo.axis === 'X';
    }

    private getEditedRowObject(): Row<Column> {
        const rowObjects: Row<Column>[] = this.parent.vcRows;
        let editedrow: Row<Column>;
        for (let i: number = 0; i < rowObjects.length; i++) {
            if (rowObjects[parseInt(i.toString(), 10)].index === this.editedRowIndex) {
                editedrow = rowObjects[parseInt(i.toString(), 10)];
            }
        }
        return editedrow;
    }

    private refreshCache(args: { data: Object }): void {
        if (this.isInfiniteColumnvirtualization()) {
            return;
        }
        let block: number = Math.ceil((this.editedRowIndex + 1) / this.getBlockSize());
        if (this.parent.allowPaging && this.parent.enableColumnVirtualization) {
            block = Math.ceil((this.editedRowIndex + 1 + ((this.parent.pageSettings.currentPage - 1) *
                this.parent.pageSettings.pageSize)) / this.getBlockSize());
        }
        const index: number = (this.parent.allowPaging && this.parent.enableColumnVirtualization) ?
            this.editedRowIndex % this.getBlockSize() : this.editedRowIndex - ((block - 1) * this.getBlockSize());
        if (this.parent.groupSettings.columns.length) {
            const editRowObject: Row<Column> = this.getEditedRowObject();
            if (editRowObject) {
                editRowObject.data = args.data;
            }
        } else {
            this.vgenerator.cache[parseInt(block.toString(), 10)][parseInt(index.toString(), 10)].data = args.data;
        }
    }

    private actionComplete(args: NotifyArgs): void {
        if (!(this.parent.enableVirtualization || this.parent.enableColumnVirtualization)) {
            return;
        }
        const editRequestTypes: string[] = ['delete', 'save', 'cancel'];
        const dataActionRequestTypes: string[] = ['sorting', 'filtering', 'grouping', 'refresh', 'searching', 'ungrouping', 'reorder'];
        if (editRequestTypes.some((value: string) => value === args.requestType)) {
            this.refreshOffsets();
            this.refreshVirtualElement();
        }
        if (this.isNormaledit && (dataActionRequestTypes.some((value: string) => value === args.requestType)
            || editRequestTypes.some((value: string) => value === args.requestType))) {
            this.isCancel = true;
            if (this.isAdd && this.parent.editSettings && this.parent.editSettings.newRowPosition === 'Bottom') {
                this.virtualEle.placeholder.style.height =
                    (parseInt(this.virtualEle.placeholder.style.height.toString(), 10) - this.diff) + 'px';
            }
            this.isAdd = false || this.parent.editSettings.showAddNewRow;
            this.editedRowIndex = this.empty as number;
            this.virtualData = {};
            this.virtualInfiniteData = {};
            if (this.parent.editModule) {
                this.parent.editModule.editModule.previousData = undefined;
            }
        }
        if (this.parent.enableColumnVirtualization && args.requestType as string === 'filterAfterOpen'
            && this.currentInfo.columnIndexes && this.currentInfo.columnIndexes[0] > 0) {
            (this.parent as Grid).resetFilterDlgPosition((<{ columnName?: string }>args).columnName);
        }
    }

    private resetIsedit(): void {
        if (this.parent.enableVirtualization && this.isNormaledit) {
            if ((this.parent.editSettings.allowEditing && Object.keys(this.virtualData).length)
                || (this.parent.editSettings.allowAdding && this.isAdd)) {
                this.parent.isEdit = true;
            }
        }
    }

    private scrollAfterEdit(): void {
        if (this.parent.editModule && this.parent.editSettings.allowEditing && this.isNormaledit) {
            if (this.parent.element.querySelector('.e-gridform')) {
                const editForm: Element = this.parent.element.querySelector('.' + literals.editedRow);
                const addForm: Element = this.parent.element.querySelector('.' + literals.addedRow);
                if (editForm || addForm) {
                    const rowData: Object = editForm ? extend({}, this.getRowObjectByIndex(this.editedRowIndex))
                        : extend({}, this.emptyRowData);
                    const keys: string[] = Object.keys(this.virtualData);
                    this.virtualData = keys.length ? this.getVirtualEditedData(this.virtualData) : this.getVirtualEditedData(rowData);
                }
            }
        }
    }

    private createEmptyRowdata(): void {
        (<{ columnModel?: Column[] }>this.parent).columnModel.filter((e: Column) => {
            this.emptyRowData[e.field] = this.empty;
        });
    }

    private addActionBegin(args: { startEdit: boolean }): void {
        if (this.isNormaledit) {
            if (!Object.keys(this.emptyRowData).length) {
                this.createEmptyRowdata();
            }
            this.isAdd = true;
            const page: number = this.parent.pageSettings.currentPage;
            if (!this.parent.frozenRows && this.content.scrollTop > 0 && this.parent.editSettings.newRowPosition === 'Top') {
                this.isAdd = true;
                this.onActionBegin();
                args.startEdit = false;
                this.content.scrollTop = 0;
            }
            if (page < this.maxPage - 1 && this.parent.editSettings.newRowPosition === 'Bottom') {
                this.isAdd = true;
                this.parent.setProperties({ pageSettings: { currentPage: this.maxPage - 1 } }, true);
                args.startEdit = false;
                this.content.scrollTop = this.offsets[this.offsetKeys.length];
            }
        }
    }

    /**
     * @param {number} index - specifies the index
     * @returns {Object} returns the object
     * @hidden
     */
    public getRowObjectByIndex(index: number): Object {
        const data: Object = this.getRowCollection(index, true);
        return data;
    }

    public getBlockSize(): number {
        return this.parent.pageSettings.pageSize >> 1;
    }

    public getBlockHeight(): number {
        return this.getBlockSize() * this.parent.getRowHeight();
    }

    public isEndBlock(index: number): boolean {
        const totalBlocks: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        return index >= totalBlocks || index === totalBlocks - 1;
    }

    public isOddPageSize(): boolean {
        return this.parent.pageSettings.pageSize % 2 !== 0;
    }

    public getOddBlockSize(): number {
        return this.isOddPageSize() ? this.parent.pageSettings.pageSize / 2 : this.getBlockSize();
    }

    public getGroupedTotalBlocks(): number {
        const rows: Object[] = this.parent.vcRows;
        return Math.floor((rows.length / this.getOddBlockSize()) < 1 ? 1 : rows.length / this.getOddBlockSize());
    }

    public getTotalBlocks(): number {
        return Math.ceil(this.count / this.getOddBlockSize());
    }

    public getColumnOffset(block: number): number {
        return this.vgenerator.cOffsets[parseInt(block.toString(), 10)] | 0;
    }

    public getModelGenerator(): IModelGenerator<Column> {
        return new VirtualRowModelGenerator(this.parent);
    }

    private resetScrollPosition(action: string): void {
        if (this.actions.some((value: string) => value === action)) {
            this.preventEvent = this.content.scrollTop !== 0;
            this.content.scrollTop = 0;
        }
        if (action !== 'virtualscroll') {
            this.isAdd = false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onActionBegin(e?: NotifyArgs): void {
        //Update property silently..
        this.parent.setProperties({ pageSettings: { currentPage: 1 } }, true);
    }

    public getRows(): Row<Column>[] {
        return this.isInfiniteColumnvirtualization() ? this.getInfiniteRows() : this.vgenerator.getRows();
    }

    public getRowByIndex(index: number): Element {
        let row: Element;
        if (isGroupAdaptive(this.parent)) {
            if (!isNullOrUndefined(index) && this.parent.enableVirtualization && this.parent.groupSettings.columns.length) {
                for (let i: number = 0; i < this.parent.getDataRows().length; i++) {
                    if (parseInt(this.parent.getDataRows()[parseInt(i.toString(), 10)].getAttribute(literals.ariaRowIndex), 10) - 1 ===
                        index) {
                        row = this.parent.getDataRows()[parseInt(i.toString(), 10)];
                    }
                }
            } else {
                row = !isNullOrUndefined(index) ? this.parent.getDataRows()[parseInt(index.toString(), 10)] : undefined;
            }
        }
        else if (!this.parent.enableVirtualization && this.parent.enableColumnVirtualization) {
            row = !isNullOrUndefined(index) ? this.enableCacheOnInfiniteColumnVirtual() ? this.parent.getDataRows()
                .find((element: Element) => parseInt(element.getAttribute(literals.ariaRowIndex), 10) - 1 === index) :
                this.parent.getDataRows()[parseInt(index.toString(), 10)] : undefined;
        }
        else if (this.prevInfo) {
            row = this.getRowCollection(index, false) as Element;
        }
        return row;
    }

    public getMovableVirtualRowByIndex(index: number): Element {
        return this.getRowCollection(index, false) as Element;
    }

    public getFrozenRightVirtualRowByIndex(index: number): Element {
        return this.getRowCollection(index, false) as Element;
    }

    public getRowCollection(index: number, isRowObject?: boolean): Element | Object {
        const prev: number[] = this.prevInfo.blockIndexes;
        let startIdx: number = (prev[0] - 1) * this.getBlockSize();
        if (this.parent.pageSettings.pageSize % 2 !== 0) {
            startIdx += Math.floor((startIdx / this.getBlockSize()) / 2);
        }
        const rowCollection: Element[] = this.parent.getDataRows();
        let collection: Element[] | Object[] = isRowObject ? this.parent.getCurrentViewRecords() : rowCollection;
        if (isRowObject && this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            startIdx = parseInt(this.parent.getRows()[0].getAttribute(literals.ariaRowIndex), 10) - 1;
            collection = collection.filter((m: object) => { return isNullOrUndefined((<{items?: object }>m).items); });
        }
        if (!isRowObject && this.parent.allowGrouping && this.parent.groupSettings.columns.length && rowCollection.length) {
            startIdx = parseInt(rowCollection[0].getAttribute(literals.ariaRowIndex), 10) - 1;
        }
        let selectedRow: Element | Object = collection[index - startIdx];
        if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
            if (!isRowObject) {
                selectedRow = index <= this.parent.frozenRows ? rowCollection[parseInt(index.toString(), 10)]
                    : rowCollection[(index - startIdx) + this.parent.frozenRows];
            } else {
                selectedRow = index <= this.parent.frozenRows ? this.parent.getRowsObject()[parseInt(index.toString(), 10)].data
                    : selectedRow;
            }
        }
        return selectedRow;
    }

    public getVirtualRowIndex(index: number): number {
        if (isNullOrUndefined(this.prevInfo)) {
            return index;
        } else {
            const prev: number[] = this.prevInfo.blockIndexes;
            let startIdx: number = (prev[0] - 1) * this.getBlockSize();
            if (this.parent.enableVirtualization && this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
                const vGroupedRows: Row<Column>[] = this.vgenerator.cache[prev[0]];
                for (let i: number = 0; i < vGroupedRows.length; i++) {
                    if (vGroupedRows[`${i}`].isDataRow) {
                        startIdx =  vGroupedRows[`${i}`].index;
                        break;
                    }
                }
            }
            return startIdx + index;
        }
    }

    /**
     * @returns {void}
     * @hidden */
    public refreshOffsets(): void {
        const gObj: IGrid = this.parent;
        let row: number = 0; const blockSize: number = this.getBlockSize();
        const oddBlockSize: number = this.getOddBlockSize();
        const total: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[parseInt(total.toString(), 10)];
        this.maxBlock = total % 2 === 0 ? total - 2 : total - 1; this.offsets = {};
        //Row offset update
        // eslint-disable-next-line prefer-spread
        const blocks: number[] = Array.apply(null, Array(total)).map(() => ++row);
        for (let i: number = 0; i < blocks.length; i++) {
            const tmp: number = (this.vgenerator.cache[blocks[parseInt(i.toString(), 10)]] || []).length;
            const rem: number = !isGroupAdaptive(this.parent) ? this.isOddPageSize() ?
                Math.ceil(this.count % oddBlockSize) : this.count % blockSize : this.isOddPageSize() ?
                Math.ceil(gObj.vcRows.length % oddBlockSize) : (gObj.vcRows.length % blockSize);
            let size: number = !isGroupAdaptive(this.parent) && blocks[parseInt(i.toString(), 10)] in this.vgenerator.cache ?
                tmp * this.parent.getRowHeight() : rem && blocks[parseInt(i.toString(), 10)] === total ? rem * this.parent.getRowHeight() :
                    this.getBlockHeight();
            if (this.isOddPageSize() && !(blocks[parseInt(i.toString(), 10)] in this.vgenerator.cache)
                && !(rem && blocks[parseInt(i.toString(), 10)] === total)) {
                size = (blocks[parseInt(i.toString(), 10)] % 2 !== 0 ? Math.floor(oddBlockSize)
                    : Math.ceil(oddBlockSize)) * this.parent.getRowHeight();
            }
            // let size: number = this.parent.groupSettings.columns.length && block in this.vgenerator.cache ?
            // tmp * getRowHeight() : this.getBlockHeight();
            this.offsets[blocks[parseInt(i.toString(), 10)]] = (this.offsets[blocks[parseInt(i.toString(), 10)] - 1] | 0) + size;
            this.tmpOffsets[blocks[parseInt(i.toString(), 10)]] = this.offsets[blocks[parseInt(i.toString(), 10)] - 1] | 0;
        }
        this.offsetKeys = Object.keys(this.offsets);
        if (isGroupAdaptive(this.parent)) {
            this.parent.vGroupOffsets = this.offsets;
        }
        //Column offset update
        if (this.parent.enableColumnVirtualization) {
            this.vgenerator.refreshColOffsets();
        }
    }

    public refreshVirtualElement(): void {
        this.vgenerator.refreshColOffsets();
        this.setVirtualHeight();
    }

    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        let rows: Row<Column>[] = [];
        rows = <Row<Column>[]>this.getRows();
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });

        let isRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            isRefresh = false;
        }
        const tr: Object = gObj.getDataRows();
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[parseInt(c.toString(), 10)];
            const idx: number = gObj.getNormalizedColumnIndex(column.uid);
            const displayVal: string = column.visible === true ? '' : 'none';
            const colGrp: HTMLCollection = this.getColGroup().children;
            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(colGrp[parseInt(idx.toString(), 10)] as HTMLElement, { 'display': displayVal });
            }
            if (!isRefresh) {
                let width: number;
                if (column.width) {
                    if (column.visible) {
                        width = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                    } else {
                        width = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                    }
                }
                if (width > gObj.width) {
                    this.setDisplayNone(tr, idx, displayVal, rows);
                    if (this.parent.enableColumnVirtualization) {
                        this.virtualEle.setWrapperWidth(width + '');
                    }
                    this.refreshVirtualElement();
                } else {
                    isRefresh = true;
                }
            }
            if (!this.parent.invokedFromMedia && column.hideAtMedia) {
                this.parent.updateMediaColumns(column);
            }
            this.parent.invokedFromMedia = false;
        }
        if (isRefresh && !(this.parent.enableVirtualization && this.parent.groupSettings && this.parent.groupSettings.columns.length
            && this.parent.groupSettings.enableLazyLoading)) {
            this.refreshContentRows({ requestType: 'refresh' });
        } else {
            this.parent.notify(events.partialRefresh, { rows: rows, args: { isFrozen: false, rows: rows } });
        }
    }

    private selectVirtualRow(args: { selectedIndex: number, isAvailable: boolean }): void {
        const count: number = isGroupAdaptive(this.parent) ? this.vgenerator.recordsCount : this.count;
        args.isAvailable = args.selectedIndex < count;
        if (args.isAvailable && !this.isContextMenuOpen && this.activeKey !== 'upArrow'
            && this.activeKey !== 'downArrow' && !this.isSelection && !this.requestTypes.some((value: string) => value === this.requestType)
            && !this.parent.selectionModule.isInteracted) {
            const selectedRow: Element = this.parent.getRowByIndex(args.selectedIndex);
            const rowHeight: number = this.parent.getRowHeight();
            if (!selectedRow || !this.isRowInView(selectedRow)) {
                this.isSelection = true;
                this.selectedRowIndex = args.selectedIndex;
                let scrollTop: number = args.selectedIndex * rowHeight;
                if (isGroupAdaptive(this.parent)) {
                    const selectedRowObjectIndex: number = this.parent.vcRows
                        .findIndex((row: Row<Column>) => row.index === args.selectedIndex);
                    scrollTop = selectedRowObjectIndex !== -1 ? selectedRowObjectIndex * rowHeight : undefined;
                    this.isSelection = selectedRowObjectIndex !== -1 ? this.isSelection : false;
                } else if (this.parent.groupSettings.columns.length && this.parent.getDataModule().isRemote()) {
                    const page: number = Math.ceil((args.selectedIndex + 1) / this.parent.pageSettings.pageSize);
                    const blockIndexes: number[] = this.vgenerator.getBlockIndexes(page);
                    scrollTop = this.offsets[blockIndexes[0]];
                }
                if (!isNullOrUndefined(scrollTop)) {
                    const direction: ScrollDirection = this.content.scrollTop < scrollTop ? 'down' : 'up';
                    this.selectRowIndex = args.selectedIndex;
                    this.content.scrollTop = scrollTop;
                    this.isSelectionScroll = this.observer.check(direction);
                }
            }
        }
        this.requestType = this.empty as string;
    }

    private isRowInView(row: Element): boolean {
        const top: number = row.getBoundingClientRect().top;
        const bottom: number = row.getBoundingClientRect().bottom;
        return (top >= this.content.getBoundingClientRect().top && bottom <= this.content.getBoundingClientRect().bottom);
    }
}
/**
 * @hidden
 */
export class VirtualHeaderRenderer extends HeaderRender implements IRenderer {
    public virtualEle: VirtualElementHandler = new VirtualElementHandler();
    /** @hidden */
    public gen: VirtualRowModelGenerator;
    public movableTbl: Element;
    private isMovable: boolean = false;

    constructor(parent: IGrid, locator: ServiceLocator) {
        super(parent, locator);
        this.gen = new VirtualRowModelGenerator(this.parent);
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(refreshVirtualBlock, (e?: NotifyArgs) => e.virtualInfo.sentinelInfo.axis === 'X' ? this.refreshUI() : null, this);
    }

    public renderTable(): void {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(<HTMLElement>this.getPanel().querySelector('.' + literals.headerContent)));
        super.renderTable();
        this.virtualEle.table = <HTMLElement>this.getTable();
        this.virtualEle.content = <HTMLElement>this.getPanel().querySelector('.' + literals.headerContent);
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (!(this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) && this.parent.enableColumnVirtualization) ?
            this.virtualEle.renderPlaceHolder() : this.virtualEle.renderPlaceHolder('absolute');
    }

    public appendContent(table: Element): void {
        this.virtualEle.wrapper.appendChild(table);
    }

    public refreshUI(): void {
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(<HTMLElement>this.getPanel().querySelector('.' + literals.headerContent)));
        super.refreshUI();
    }

    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        let displayVal: string;
        let idx: number;
        let needFullRefresh: boolean;
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[parseInt(c.toString(), 10)];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';
            const colGrp: HTMLCollection = this.getColGroup().children;
            if (gObj.getColumnByField(column.field)) {
                setStyleAttribute(<HTMLElement>colGrp[parseInt(idx.toString(), 10)], { 'display': displayVal });
            }
            if (gObj.enableColumnVirtualization && !gObj.groupSettings.columns.length) {
                let tablewidth: number;
                if (column.visible) {
                    tablewidth = this.virtualEle.wrapper.offsetWidth + parseInt(column.width.toString(), 10);
                } else {
                    tablewidth = this.virtualEle.wrapper.offsetWidth - parseInt(column.width.toString(), 10);
                }
                if (tablewidth > gObj.width) {
                    this.setDisplayNone(column, displayVal);
                    this.virtualEle.setWrapperWidth(tablewidth + '');
                    this.gen.refreshColOffsets();
                } else {
                    needFullRefresh = true;
                }
            } else {
                needFullRefresh = true;
            }
            if (needFullRefresh) {
                this.refreshUI();
            }
        }
    }

    private setDisplayNone(col: Column, displayVal: string): void {
        const table: Element = this.getTable();
        for (const ele of [].slice.apply(table.querySelectorAll('th.e-headercell'))) {
            if (ele.querySelector('[data-mappinguid]') &&
                ele.querySelector('[data-mappinguid]').getAttribute('data-mappinguid') === col.uid) {
                setStyleAttribute(<HTMLElement>ele, { 'display': displayVal });
                if (displayVal === '') {
                    removeClass([ele], 'e-hide');
                }
                break;
            }
        }
    }
}
/**
 * @hidden
 */
export class VirtualElementHandler {
    public wrapper: HTMLElement;
    public placeholder: HTMLElement;
    public content: HTMLElement;
    public table: HTMLElement;

    public renderWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable' });
        this.wrapper.style.minHeight = formatUnit(height);
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    }

    public renderPlaceHolder(position: string = 'relative'): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack' });
        this.placeholder.style.position = position;
        this.content.appendChild(this.placeholder);
    }

    public renderFrozenWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable' });
        this.wrapper.style.cssText = `min-height:${formatUnit(height)}; display: flex;`;
        this.content.appendChild(this.wrapper);
    }

    public renderFrozenPlaceHolder(): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack' });
        this.content.appendChild(this.placeholder);
    }

    public adjustTable(xValue: number, yValue: number): void {
        this.wrapper.style.transform = `translate(${xValue}px, ${yValue}px)`;
    }

    public setWrapperWidth(width: string, full?: boolean): void {
        if (width && width.indexOf('%') === -1 && !(this.content.getBoundingClientRect().width < parseInt(width, 10))) {
            width = undefined;
            full = true;
        }
        this.wrapper.style.width = width ? `${width}px` : full ? '100%' : '';
    }

    public setVirtualHeight(height?: number, width?: string): void {
        this.placeholder.style.height = !isNullOrUndefined(height) ? `${height}px` : '0px';
        if (width && width.indexOf('%') === -1 && !(this.content.getBoundingClientRect().width < parseInt(width, 10))) {
            width = '100%';
        }
        this.placeholder.style.width = width;
    }

    public setFreezeWrapperWidth(wrapper: HTMLElement, width: string, full?: boolean): void {
        wrapper.style.width = width ? `${width}px` : full ? '100%' : '';
    }
}

type ScrollArg = { direction: string, sentinel: SentinelType, offset: Offsets, focusElement: HTMLElement };

interface EditArgs {
    data?: Object;
    requestType?: string;
    previousData?: Object;
    selectedRow?: number;
    type?: string;
    promise?: Promise<Object>;
    row?: Element;
}
