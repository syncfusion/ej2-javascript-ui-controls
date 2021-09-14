import { remove, createElement, closest, formatUnit, Browser, KeyboardEventArgs, extend } from '@syncfusion/ej2-base';
import { isNullOrUndefined, removeClass } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { IGrid, IRenderer, NotifyArgs, VirtualInfo, IModelGenerator, InterSection, RowSelectEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { dataReady, modelChanged, refreshVirtualBlock, contentReady } from '../base/constant';
import * as events from '../base/constant';
import { SentinelType, Offsets } from '../base/type';
import { RenderType, freezeMode, freezeTable } from '../base/enum';
import { ContentRender } from './content-renderer';
import { HeaderRender } from './header-renderer';
import { ServiceLocator } from '../services/service-locator';
import { InterSectionObserver, ScrollDirection } from '../services/intersection-observer';
import { RendererFactory } from '../services/renderer-factory';
import { VirtualRowModelGenerator } from '../services/virtual-row-model-generator';
import { isGroupAdaptive, ensureLastRow, ensureFirstRow, getEditedDataIndex, getTransformValues } from '../base/util';
import { setStyleAttribute } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import * as literals from '../base/string-literals';
import { VirtualFreezeRenderer } from './virtual-freeze-renderer';
/**
 * VirtualContentRenderer
 *
 * @hidden
 */
export class VirtualContentRenderer extends ContentRender implements IRenderer {
    private count: number;
    private maxPage: number;
    private maxBlock: number;
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
    public movableContent: HTMLElement;
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
    private rndrCount: number = 0;
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
    private requestTypes: string[] = ['beginEdit', 'cancel', 'delete', 'add', 'save'];
    private isNormaledit: boolean = this.parent.editSettings.mode === 'Normal';
    /** @hidden */
    public virtualData: Object = {};
    private emptyRowData: Object = {};
    private vfColIndex: number[] = [];
    private frzIdx: number = 1;
    private initialRowTop: number;
    private isContextMenuOpen: boolean = false;
    private selectRowIndex: number;
    private isSelectionScroll: boolean = false;
    private validationCheck: boolean = false;
    private validationCol: Column;

    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
        this.locator = locator;
        this.eventListener('on');
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
        this.virtualEle.wrapper.style.position = 'absolute';
        const debounceEvent: boolean = (this.parent.dataSource instanceof DataManager && !this.parent.dataSource.dataSource.offline);
        const opt: InterSection = {
            container: this.content, pageHeight: this.getBlockHeight() * 2, debounceEvent: debounceEvent,
            axes: this.parent.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
    }

    public renderEmpty(tbody: HTMLElement): void {
        this.getTable().appendChild(tbody);
        this.virtualEle.adjustTable(0, 0);
    }

    public getReorderedFrozenRows(args: NotifyArgs): Row<Column>[] {
        const blockIndex: number[] = args.virtualInfo.blockIndexes;
        const colsIndex: number[] = args.virtualInfo.columnIndexes;
        const page: number = args.virtualInfo.page;
        args.virtualInfo.blockIndexes = [1, 2];
        args.virtualInfo.page = 1;
        if (!args.renderMovableContent) {
            args.virtualInfo.columnIndexes = [];
        }
        const recordslength: number = this.parent.getCurrentViewRecords().length;
        const firstRecords: object[] = this.parent.renderModule.data.dataManager.dataSource.json.slice(0, recordslength);
        const virtualRows: Row<Column>[] = this.vgenerator.generateRows(firstRecords, args);
        args.virtualInfo.blockIndexes = blockIndex;
        args.virtualInfo.columnIndexes = colsIndex;
        args.virtualInfo.page = page;
        return virtualRows.splice(0, this.parent.frozenRows);
    }

    private scrollListener(scrollArgs: ScrollArg): void {
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
        const info: SentinelType = scrollArgs.sentinel;
        const viewInfo: VirtualInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (isGroupAdaptive(this.parent)) {
            if (viewInfo.blockIndexes && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString()) {
                return;
            } else {
                viewInfo.event = 'refresh-virtual-block';
                if (!isNullOrUndefined(viewInfo.offsets)) {
                    viewInfo.offsets.top = this.content.scrollTop;
                }
                this.parent.pageSettings.currentPage = viewInfo.page;
                this.parent.notify(
                    viewInfo.event,
                    { requestType: 'virtualscroll', virtualInfo: viewInfo, focusElement: scrollArgs.focusElement });
                return;
            }
        }
        if (this.prevInfo && ((info.axis === 'Y' && this.prevInfo.blockIndexes.toString() === viewInfo.blockIndexes.toString())
            || (info.axis === 'X' && this.prevInfo.columnIndexes.toString() === viewInfo.columnIndexes.toString()))) {
            if (Browser.isIE) {
                this.parent.hideSpinner();
            }
            this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
            if (info.axis === 'Y') {
                this.restoreEdit();
            }
            return;
        }

        this.parent.setColumnIndexesInView(this.parent.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        this.parent.pageSettings.currentPage = viewInfo.loadNext && !viewInfo.loadSelf ? viewInfo.nextInfo.page : viewInfo.page;
        this.requestType = 'virtualscroll';
        this.parent.notify(viewInfo.event, {
            requestType: 'virtualscroll', virtualInfo: viewInfo,
            focusElement: scrollArgs.focusElement
        });
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
        infoType.blockIndexes = blocks;
        infoType.loadNext = !blocks.filter((val: number) => tempBlocks.indexOf(val) === -1)
            .every(this.block.bind(this));
        infoType.event = (infoType.loadNext || infoType.loadSelf) ? modelChanged : refreshVirtualBlock;
        infoType.nextInfo = infoType.loadNext ? { page: Math.max(1, infoType.page + (direction === 'down' ? 1 : -1)) } : {};
        if (isBlockAdded) {
            infoType.blockIndexes = [infoType.blockIndexes[0] - 1, infoType.blockIndexes[0], infoType.blockIndexes[0] + 1];
        }
        if (this.activeKey === 'downArrow') {
            const firstBlock: number = Math.ceil(this.rowIndex / this.getBlockSize());
            if (firstBlock !== 1 && (infoType.blockIndexes[1] !== firstBlock || infoType.blockIndexes.length < 3)) {
                infoType.blockIndexes = [firstBlock - 1, firstBlock, firstBlock + 1];
            }
        }
        infoType.columnIndexes = info.axis === 'X' ? this.vgenerator.getColumnIndexes() : this.parent.getColumnIndexesInView();
        if (this.parent.enableColumnVirtualization && info.axis === 'X') {
            infoType.event = refreshVirtualBlock;
        }
        return infoType;
    }

    private setKeyboardNavIndex(): void {
        this.blazorDataLoad = true;
        if (this.activeKey === 'downArrow' || this.activeKey === 'upArrow') {
            this.blzRowIndex = this.activeKey === 'downArrow' ? this.rowIndex + 1 : this.rowIndex - 1;
            (document.activeElement as HTMLElement).blur();
        }
    }

    public ensureBlocks(info: VirtualInfo): number[] {
        let index: number = info.blockIndexes[info.block]; let mIdx: number;
        const old: number = index; const max: Function = Math.max;
        let indexes: number[] = info.direction === 'down' ? [max(index, 1), ++index, ++index] : [max(index - 1, 1), index, index + 1];
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid()) {
            // To avoid frozen content white space issue
            if (info.sentinelInfo.axis === 'X' || (info.sentinelInfo.axis === 'Y' && (info.page === this.prevInfo.page))) {
                indexes = this.prevInfo.blockIndexes;
            }
        }
        indexes = indexes.filter((val: number, ind: number) => indexes.indexOf(val) === ind);
        if (this.prevInfo.blockIndexes.toString() === indexes.toString()) {
            return indexes;
        }

        if (info.loadSelf || (info.direction === 'down' && this.isEndBlock(old))) {
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
        const isFrozen: boolean = this.parent.isFrozenGrid();
        const frzCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
        const colVFtable: boolean = this.parent.enableColumnVirtualization && isFrozen;
        this.checkFirstBlockColIndexes(e);
        const info: VirtualInfo = e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'Y' && this.currentInfo.page &&
            this.currentInfo.page !== e.virtualInfo.page ? this.currentInfo : e.virtualInfo;
        this.prevInfo = this.prevInfo || e.virtualInfo;
        let cBlock: number = (info.columnIndexes[0]) - 1;
        if (colVFtable && info.columnIndexes[0] === frzCols) {
            cBlock = (info.columnIndexes[0] - frzCols) - 1;
        }
        const cOffset: number = this.getColumnOffset(cBlock);
        let width: string; const blocks: number[] = info.blockIndexes;
        if (this.parent.groupSettings.columns.length) {
            this.refreshOffsets();
        }
        if (this.parent.height === '100%') {
            this.parent.element.style.height = '100%';
        }
        const vHeight: string | number = this.parent.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        if (!this.requestTypes.some((value: string) => value === this.requestType)) {
            const translate: number = this.getTranslateY(this.content.scrollTop, <number>vHeight, info);
            this.virtualEle.adjustTable(colVFtable ? 0 : cOffset, translate);
            if (colVFtable) {
                this.virtualEle.adjustMovableTable(cOffset, 0);
            }
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(colVFtable ? 0 : cOffset, 0);
            if (colVFtable) {
                this.header.virtualEle.adjustMovableTable(cOffset, 0);
            }
        }

        if (this.parent.enableColumnVirtualization) {
            const cIndex: number[] = info.columnIndexes;
            width = this.getColumnOffset(cIndex[cIndex.length - 1]) - this.getColumnOffset(cIndex[0] - 1) + '';
            if (colVFtable) {
                this.header.virtualEle.setMovableWrapperWidth(width);
            } else {
                this.header.virtualEle.setWrapperWidth(width);
            }
        }
        if (colVFtable) {
            this.virtualEle.setMovableWrapperWidth(width, <boolean>Browser.isIE || Browser.info.name === 'edge');
        } else {
            this.virtualEle.setWrapperWidth(width, <boolean>Browser.isIE || Browser.info.name === 'edge');
        }
        if (!isNullOrUndefined(target.parentNode)) {
            remove(target);
        }
        let tbody: HTMLElement;
        if (isFrozen) {
            if (e.renderFrozenRightContent) {
                tbody = this.parent.getContent().querySelector('.e-frozen-right-content').querySelector( literals.tbody);
            } else if (!e.renderMovableContent) {
                tbody = this.parent.getFrozenVirtualContent().querySelector( literals.tbody);
            } else if (e.renderMovableContent) {
                tbody = this.parent.getMovableVirtualContent().querySelector( literals.tbody);
            }
        } else {
            tbody = this.parent.element.querySelector('.' + literals.content).querySelector( literals.tbody);
        }
        if (tbody) {
            remove(tbody);
            target = null;
        }
        const isReact: boolean = this.parent.isReact && !isNullOrUndefined(this.parent.rowTemplate);
        if (!isReact) {
            target = this.parent.createElement( literals.tbody);
            target.appendChild(newChild);
        } else {
            target = newChild as HTMLElement;
        }
        if (this.parent.frozenRows && e.requestType === 'virtualscroll' && this.parent.pageSettings.currentPage === 1) {
            for (let i: number = 0; i < this.parent.frozenRows; i++) {
                target.children[0].remove();
            }
        }
        if (isFrozen) {
            if (e.renderFrozenRightContent) {
                this.parent.getContent().querySelector('.e-frozen-right-content').querySelector('.' + literals.table).appendChild(target);
                this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
            } else if (!e.renderMovableContent) {
                this.parent.getFrozenVirtualContent().querySelector('.' + literals.table).appendChild(target);
            } else if (e.renderMovableContent) {
                this.parent.getMovableVirtualContent().querySelector('.' + literals.table).appendChild(target);
                if (this.parent.getFrozenMode() !== literals.leftRight) {
                    this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
                }
            }
            if (this.vfColIndex.length) {
                e.virtualInfo.columnIndexes = info.columnIndexes = extend([], this.vfColIndex) as number[];
                this.vfColIndex = e.renderMovableContent ? [] : this.vfColIndex;
            }
        } else {
            this.getTable().appendChild(target);
            this.requestType = this.requestType === 'virtualscroll' ? this.empty as string : this.requestType;
        }
        if (this.parent.groupSettings.columns.length) {
            if (!isGroupAdaptive(this.parent) && info.direction === 'up') {
                const blk: number = this.offsets[this.getTotalBlocks()] - this.prevHeight;
                this.preventEvent = true; const sTop: number = this.content.scrollTop;
                this.content.scrollTop = sTop + blk;
            }
            this.setVirtualHeight();
            this.observer.setPageHeight(this.getOffset(blocks[blocks.length - 1]) - this.getOffset(blocks[0] - 1));
        }
        this.prevInfo = info;
        if (this.isFocused  && this.activeKey !== 'downArrow' && this.activeKey !== 'upArrow') {
            this.content.focus();
        }
        const lastPage: number = Math.ceil(this.getTotalBlocks() / 2);
        if (this.isBottom) {
            this.isBottom = false;
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 1];
        }
        if ((this.parent.pageSettings.currentPage === lastPage) && blocks.length === 1) {
            this.isBottom = true;
            this.parent.getContent().firstElementChild.scrollTop = this.offsets[this.offsetKeys.length - 2];
        }
        if (e.requestType === 'virtualscroll' && e.virtualInfo.sentinelInfo.axis === 'X') {
            this.parent.notify(events.autoCol, {});
        }
        this.focusCell(e);
        this.restoreEdit(e);
        this.restoreAdd(e);
        this.ensureSelectedRowPosition();
        this.validationScrollLeft(e, isFrozen);
        if (!this.initialRowTop) {
            const gridTop: number = this.parent.element.getBoundingClientRect().top;
            this.initialRowTop = this.parent.getRowByIndex(0).getBoundingClientRect().top - gridTop;
        }
        const tableName: freezeTable = (<{ tableName?: freezeTable }>e).tableName;
        const isLoaded: boolean = this.parent.getFrozenMode() === 'Left-Right' ? tableName === 'frozen-right' : tableName === 'movable';
        if (!isFrozen || isLoaded) {
            this.vgenerator.startIndex = null; this.vgenerator.currentInfo = {}; this.vgenerator.includePrevPage = null;
        }
    }

    private validationScrollLeft(e: NotifyArgs, isFrozen: boolean): void {
        const left: number = this.parent.getFrozenColumns();
        const table: freezeMode = this.parent.getFrozenMode();
        const trigger: boolean = !isFrozen || e && (left || table === 'Left' || table === 'Right' ? e.renderMovableContent
            : e.renderFrozenRightContent);
        if (this.validationCheck && trigger) {
            if (this.validationCol) {
                const offset: number = this.vgenerator.cOffsets[(this.validationCol.index - this.parent.getVisibleFrozenColumns()) - 1];
                this.validationCol = null;
                if (this.parent.isFrozenGrid()) {
                    this.movableContent.scrollLeft = offset;
                } else {
                    this.content.scrollLeft = offset;
                }
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

    private checkFirstBlockColIndexes(e: NotifyArgs): void {
        if (this.parent.enableColumnVirtualization && this.parent.isFrozenGrid() && e.virtualInfo.columnIndexes[0] === 0) {
            const indexes: number[] = [];
            const frozenCols: number = this.parent.getFrozenColumns() || this.parent.getFrozenLeftColumnsCount();
            if (!e.renderMovableContent && e.virtualInfo.columnIndexes.length > frozenCols) {
                this.vfColIndex = e.virtualInfo.columnIndexes;
                for (let i: number = 0; i < frozenCols; i++) {
                    indexes.push(i);
                }
                e.virtualInfo.columnIndexes = indexes;
            } else if (e.renderMovableContent) {
                if (!this.vfColIndex.length) {
                    this.vfColIndex = extend([], e.virtualInfo.columnIndexes) as number[];
                }
                e.virtualInfo.columnIndexes = extend([], this.vfColIndex) as number[];
                e.virtualInfo.columnIndexes.splice(0, frozenCols);
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
        this.parent.selectRow(parseInt(row.getAttribute(literals.ariaRowIndex), 10));
        this.activeKey = this.empty as string;
    }

    private restoreEdit(e?: NotifyArgs): void {
        if (this.isNormaledit) {
            const left: number = this.parent.getFrozenColumns();
            const isFrozen: boolean = e && this.parent.isFrozenGrid();
            const table: freezeMode = this.parent.getFrozenMode();
            const trigger: boolean = e && (left || table === 'Left' || table === 'Right' ? e.renderMovableContent
                : e.renderFrozenRightContent);
            if ((!isFrozen || (isFrozen && trigger)) && this.parent.editSettings.allowEditing
                && this.parent.editModule && !isNullOrUndefined(this.editedRowIndex)) {
                let row: HTMLTableRowElement = this.getRowByIndex(this.editedRowIndex) as HTMLTableRowElement;
                let content: Element = this.content;
                const keys: string[] = Object.keys(this.virtualData);
                const isXaxis: boolean = e && e.virtualInfo && e.virtualInfo.sentinelInfo.axis === 'X';
                if (isFrozen && isXaxis) {
                    row = this.parent.getMovableRowByIndex(this.editedRowIndex) as HTMLTableRowElement;
                    content = this.movableContent;
                }
                if (keys.length && row && !content.querySelector('.' + literals.editedRow)) {
                    const top: number = row.getBoundingClientRect().top;
                    if (isXaxis || (top < this.content.offsetHeight && top > this.parent.getRowHeight())) {
                        this.parent.isEdit = false;
                        this.parent.editModule.startEdit(row);
                    }
                }
                if (row && this.content.querySelector('.' + literals.editedRow) && !keys.length) {
                    const rowData: Object = extend({}, this.getRowObjectByIndex(this.editedRowIndex));
                    this.virtualData = this.getVirtualEditedData(rowData);
                }
            }
            this.restoreAdd(e);
        }
    }

    private getVirtualEditedData(rowData: Object): Object {
        const editForms: Element[] = [].slice.call(this.parent.element.getElementsByClassName('e-gridform'));
        const isFormDestroyed: boolean = this.parent.editModule && this.parent.editModule.formObj
            && this.parent.editModule.formObj.isDestroyed;
        if (!isFormDestroyed) {
            for (let i: number = 0; i < editForms.length; i++) {
                rowData = this.parent.editModule.getCurrentEditedData(editForms[i], rowData);
            }
        }
        return rowData;
    }

    private restoreAdd(e?: NotifyArgs): void {
        const left: number = this.parent.getFrozenColumns();
        const isFrozen: boolean = e && this.parent.isFrozenGrid();
        const table: freezeMode = this.parent.getFrozenMode();
        const isXaxis: boolean = e && e.virtualInfo && e.virtualInfo.sentinelInfo && e.virtualInfo.sentinelInfo.axis === 'X';
        const startAdd: boolean = isXaxis && isFrozen ? !(this.parent.getMovableVirtualHeader().querySelector('.' + literals.addedRow)
        || this.parent.getMovableVirtualContent().querySelector('.' + literals.addedRow)) : !this.parent.element.querySelector('.' + literals.addedRow);
        const trigger: boolean = e && (left || table === 'Left' || table === 'Right' ? e.renderMovableContent : e.renderFrozenRightContent);
        if ((!isFrozen || (isFrozen && trigger)) && this.isNormaledit && this.isAdd && startAdd) {
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
            this.maxPage = Math.ceil(e.count / this.parent.pageSettings.pageSize);
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
            this.getColumnOffset(this.parent.columns.length + this.parent.groupSettings.columns.length - 1) + 'px' : '100%';
        if (this.parent.isFrozenGrid()) {
            let virtualHeightTemp: number = (this.parent.pageSettings.currentPage === 1 && Object.keys(this.offsets).length <= 2) ?
                this.offsets[1] : this.offsets[this.getTotalBlocks() - 2];
            const scrollableElementHeight: number = this.content.clientHeight;
            virtualHeightTemp = virtualHeightTemp > scrollableElementHeight ? virtualHeightTemp : 0;
            // To overcome the white space issue in last page (instead of position absolute)
            this.virtualEle.setVirtualHeight(virtualHeightTemp, width);
        } else {
            const virtualHeight: number = (this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() :
                this.getTotalBlocks()]);
            this.virtualEle.setVirtualHeight(virtualHeight, width);
        }
        if (this.parent.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
            if (this.parent.isFrozenGrid()) {
                this.virtualEle.setMovableVirtualHeight(1, width);
                this.header.virtualEle.setMovableVirtualHeight(1, width);
            }
        }
    }

    private getPageFromTop(sTop: number, info: VirtualInfo): number {
        const total: number = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        let page: number = 0;
        this.offsetKeys.some((offset: string) => {
            let iOffset: number = Number(offset);
            const border: boolean = sTop <= this.offsets[offset] || (iOffset === total && sTop > this.offsets[offset]);
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
        if (result + blockHeight > this.offsets[totalBlocks]) {
            result -= (result + blockHeight) - this.offsets[totalBlocks];
        }
        return result;
    }

    public getOffset(block: number): number {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock] | 0);
    }

    private onEntered(): Function {
        return (element: HTMLElement, current: SentinelType, direction: string, e: Offsets, isWheel: boolean, check: boolean) => {
            if (Browser.isIE && !isWheel && check && !this.preventEvent) {
                this.parent.showSpinner();
            }
            const colVFtable: boolean = this.parent.enableColumnVirtualization && this.parent.isFrozenGrid();
            const xAxis: boolean = current.axis === 'X'; const top: number = this.prevInfo.offsets ? this.prevInfo.offsets.top : null;
            const height: number = this.content.getBoundingClientRect().height;
            let x: number = this.getColumnOffset(xAxis ? this.vgenerator.getColumnIndexes()[0] - 1 : this.prevInfo.columnIndexes[0] - 1);
            if (xAxis && !colVFtable) {
                const idx: number = Object.keys(this.vgenerator.cOffsets).length - this.prevInfo.columnIndexes.length;
                const maxLeft: number = this.vgenerator.cOffsets[idx - 1];
                x = x > maxLeft ? maxLeft : x; //TODO: This fix horizontal scrollbar jumping issue in column virtualization.
            }
            const y: number = this.getTranslateY(e.top, height, xAxis && top === e.top ? this.prevInfo : undefined, true);
            this.virtualEle.adjustTable(colVFtable ? 0 : x, Math.min(y, this.offsets[this.maxBlock]));
            if (colVFtable) {
                this.virtualEle.adjustMovableTable(x, 0);
            }
            if (this.parent.enableColumnVirtualization) {
                this.header.virtualEle.adjustTable(colVFtable ? 0 : x, 0);
                if (colVFtable) {
                    this.header.virtualEle.adjustMovableTable(x, 0);
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
        }
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
            const lastRowTop: number = this.content.querySelector('tbody').lastElementChild.getBoundingClientRect().top - gridTop;
            if (lastRowTop < height) {
                translateY = translateY + (height - ((args.row as HTMLElement).getBoundingClientRect().top - gridTop));
                this.virtualEle.adjustTable(transform.width, translateY - (this.parent.getRowHeight() / 2));
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
        const row: Element = this.parent.getContent().querySelector('.e-row');
        if (row && this.parent.isManualRefresh && this.currentInfo.blockIndexes && this.currentInfo.blockIndexes.length === 3) {
            this.vgenerator.startIndex = parseInt(row.getAttribute('aria-rowindex'), 10);
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
        this.parent[action](dataReady, this.onDataReady, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.addEventListener(events.rowSelected, this.rowSelected.bind(this));
        this.parent[action](refreshVirtualBlock, this.refreshContentRows, this);
        this.parent[action](events.selectVirtualRow, this.selectVirtualRow, this);
        this.parent[action](events.virtaulCellFocus, this.virtualCellFocus, this);
        this.parent[action](events.virtualScrollEditActionBegin, this.editActionBegin, this);
        this.parent[action](events.virtualScrollAddActionBegin, this.addActionBegin, this);
        this.parent[action](events.virtualScrollEdit, this.restoreEdit, this);
        this.parent[action](events.virtualScrollEditSuccess, this.editSuccess, this);
        this.parent[action](events.refreshVirtualCache, this.refreshCache, this);
        this.parent[action](events.editReset, this.resetIsedit, this);
        this.parent[action](events.getVirtualData, this.getVirtualData, this);
        this.parent[action](events.virtualScrollEditCancel, this.editCancel, this);
        this.parent[action](events.refreshVirtualMaxPage, this.refreshMaxPage, this);
        this.parent[action](events.setVirtualPageQuery, this.setVirtualPageQuery, this);
        this.parent[action](events.selectRowOnContextOpen, this.selectRowOnContextOpen, this);
        this.parent[action](events.resetVirtualFocus, this.resetVirtualFocus, this);
        this.parent[action](events.refreshVirtualEditFormCells, this.refreshCells, this);
        this.parent[action](events.scrollToEdit, this.scrollToEdit, this);
        const event: string[] = this.actions;
        for (let i: number = 0; i < event.length; i++) {
            this.parent[action](`${event[i]}-begin`, this.onActionBegin, this);
        }
        const fn: Function = () => {
            this.observer.observe((scrollArgs: ScrollArg) => this.scrollListener(scrollArgs), this.onEntered());
            const gObj: IGrid = this.parent;
            if (gObj.enablePersistence && gObj.scrollPosition) {
                this.content.scrollTop = gObj.scrollPosition.top;
                const scrollValues: ScrollArg = { direction: 'down', sentinel: this.observer.sentinelInfo.down,
                    offset: gObj.scrollPosition, focusElement: gObj.element };
                this.scrollListener(scrollValues);
                if (gObj.enableColumnVirtualization) {
                    this.content.scrollLeft = gObj.scrollPosition.left;
                }
            }
            this.parent.off(contentReady, fn);
        };
        this.parent.on(contentReady, fn, this);
    }

    private scrollToEdit(col: Column): void {
        const isFrozen: boolean = this.parent.isFrozenGrid();
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
                const header: Element = this.parent.getHeaderContent().querySelector('.e-headercelldiv[e-mappinguid="' + col.uid + '"]');
                offset = isFrozen ? (header.parentElement as HTMLElement).offsetLeft
                    - (this.parent.getFrozenVirtualHeader() as HTMLElement).offsetWidth
                    : (header.parentElement as HTMLElement).offsetLeft;
            }
            if (isFrozen) {
                this.parent.getMovableVirtualContent().scrollLeft = this.parent.enableRtl ? -Math.abs(offset) : offset;
            } else {
                this.content.scrollLeft = this.parent.enableRtl ? -Math.abs(offset) : offset;
            }
        }
        if (col && !allowScroll) {
            this.validationCol = col;
        }
    }

    private refreshCells(rowObj: Row<Column>): void {
        rowObj.cells = this.vgenerator.generateCells();
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
            data.isAdd = this.isAdd;
            data.isCancel = this.isCancel;
        }
    }

    private selectRowOnContextOpen(args: { isOpen: boolean }): void {
        this.isContextMenuOpen = args.isOpen;
    }

    private editCancel(args: { data: Object }): void {
        const dataIndex: number = getEditedDataIndex(this.parent, args.data);
        if (!isNullOrUndefined(dataIndex)) {
            args.data = this.parent.getCurrentViewRecords()[dataIndex];
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
            this.parent.getCurrentViewRecords()[dataIndex] = data;
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
        const ele: Element = document.activeElement;
        if (ele.classList.contains(literals.rowCell)
            && e && (e.action === 'upArrow' || e.action === 'downArrow')) {
            let rowIndex: number = parseInt(ele.parentElement.getAttribute(literals.ariaRowIndex), 10);
            if (e && (e.action === 'downArrow' || e.action === 'upArrow')) {
                const scrollEle: Element = this.parent.getContent().firstElementChild;
                if (e.action === 'downArrow') {
                    rowIndex += 1;
                } else {
                    rowIndex -= 1;
                }
                this.rowIndex = rowIndex;
                this.cellIndex = parseInt(ele.getAttribute(literals.ariaColIndex), 10);
                const row: Element = this.parent.getRowByIndex(rowIndex);
                const page: number = this.parent.pageSettings.currentPage;
                const visibleRowCount: number = Math.floor((scrollEle as HTMLElement).offsetHeight / this.parent.getRowHeight()) - 1;
                let emptyRow: boolean = false;
                if (isNullOrUndefined(row)) {
                    emptyRow = true;
                    if ((e.action === 'downArrow' && page === this.maxPage - 1) || (e.action === 'upArrow' && page === 1)) {
                        emptyRow = false;
                    }
                }
                if (emptyRow || (ensureLastRow(row, this.parent) && e.action === 'downArrow')
                    || (ensureFirstRow(row, this.parent.getRowHeight() * 2) && e.action === 'upArrow')) {
                    this.activeKey = e.action;
                    scrollEle.scrollTop = e.action === 'downArrow' ?
                        (rowIndex - visibleRowCount) * this.parent.getRowHeight() : rowIndex * this.parent.getRowHeight();
                } else {
                    this.activeKey = this.empty as string;
                }
                this.parent.selectRow(rowIndex);
            }
        }
    }

    private editActionBegin(e: { data: Object, index: number, isScroll: boolean }): void {
        this.editedRowIndex = e.index;
        const rowData: Object = extend({}, this.getRowObjectByIndex(e.index));
        const keys: string[] = Object.keys(this.virtualData);
        e.data = keys.length ? this.virtualData : rowData;
        e.isScroll = keys.length !== 0 && this.currentInfo.sentinelInfo && this.currentInfo.sentinelInfo.axis === 'X';
    }

    private refreshCache(args: { data: Object }): void {
        const block: number = Math.ceil((this.editedRowIndex + 1) / this.getBlockSize());
        const index: number = this.editedRowIndex - ((block - 1) * this.getBlockSize());
        this.vgenerator.cache[block][index].data = args.data;
        if (this.vgenerator.movableCache[block]) {
            this.vgenerator.movableCache[block][index].data = args.data;
        }
        if (this.vgenerator.frozenRightCache[block]) {
            this.vgenerator.frozenRightCache[block][index].data = args.data;
        }
    }

    private actionComplete(args: NotifyArgs): void {
        const editRequestTypes: string[] = ['delete', 'save', 'cancel'];
        const dataActionRequestTypes: string[] = ['sorting', 'filtering', 'grouping', 'refresh', 'searching', 'ungrouping', 'reorder'];
        if (editRequestTypes.some((value: string) => value === args.requestType)) {
            this.refreshOffsets();
            if (this.parent.isFrozenGrid()) {
                this.vgenerator.refreshColOffsets();
                (this.parent.contentModule as VirtualFreezeRenderer).virtualRenderer.virtualEle.setVirtualHeight();
            } else {
                this.refreshVirtualElement();
            }
        }
        if (this.isNormaledit && (dataActionRequestTypes.some((value: string) => value === args.requestType)
            || editRequestTypes.some((value: string) => value === args.requestType))) {
            this.isCancel = true;
            this.isAdd = false;
            this.editedRowIndex = this.empty as number;
            this.virtualData = {};
            if (this.parent.editModule) {
                this.parent.editModule.editModule.previousData = undefined;
            }
        }
        if (this.parent.enableColumnVirtualization && args.requestType as string === 'filterafteropen'
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
        const data: Object = this.getRowCollection(index, false, true);
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

    public getGroupedTotalBlocks(): number {
        const rows: Object[] = this.parent.vcRows;
        return Math.floor((rows.length / this.getBlockSize()) < 1 ? 1 : rows.length / this.getBlockSize());
    }

    public getTotalBlocks(): number {
        return Math.ceil(this.count / this.getBlockSize());
    }

    public getColumnOffset(block: number): number {
        return this.vgenerator.cOffsets[block] | 0;
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
        return this.vgenerator.getRows();
    }

    public getRowByIndex(index: number): Element {
        let row: Element;
        if (isGroupAdaptive(this.parent)) {
            row = this.parent.getDataRows()[index];
        }
        if (this.prevInfo) {
            row = this.getRowCollection(index, false) as Element;
        }
        return row;
    }

    public getMovableVirtualRowByIndex(index: number): Element {
        return this.getRowCollection(index, true) as Element;
    }

    public getFrozenRightVirtualRowByIndex(index: number): Element {
        return this.getRowCollection(index, false, false, true) as Element;
    }

    public getRowCollection(index: number, isMovable: boolean, isRowObject?: boolean, isFrozenRight?: boolean): Element | Object {
        const prev: number[] = this.prevInfo.blockIndexes;
        let startIdx: number = (prev[0] - 1) * this.getBlockSize();
        let rowCollection: Element[] = isMovable ? this.parent.getMovableDataRows() : this.parent.getDataRows();
        rowCollection = isFrozenRight ? this.parent.getFrozenRightDataRows() : rowCollection;
        let collection: Element[] | Object[] = isRowObject ? this.parent.getCurrentViewRecords() : rowCollection;
        if (isRowObject && this.parent.allowGrouping && this.parent.groupSettings.columns.length) {
            startIdx = parseInt(this.parent.getRows()[0].getAttribute(literals.ariaRowIndex), 10);
            collection = collection.filter((m: object) => { return isNullOrUndefined((<{items?: object }>m).items); });
        }
        let selectedRow: Element | Object = collection[index - startIdx];
        if (this.parent.frozenRows && this.parent.pageSettings.currentPage > 1) {
            if (!isRowObject) {
                selectedRow = index <= this.parent.frozenRows ? rowCollection[index]
                    : rowCollection[(index - startIdx) + this.parent.frozenRows];
            } else {
                selectedRow = index <= this.parent.frozenRows ? this.parent.getRowsObject()[index].data : selectedRow;
            }
        }
        return selectedRow;
    }

    public getVirtualRowIndex(index: number): number {
        const prev: number[] = this.prevInfo.blockIndexes;
        const startIdx: number = (prev[0] - 1) * this.getBlockSize();
        return startIdx + index;
    }

    /**
     * @returns {void}
     * @hidden */
    public refreshOffsets(): void {
        const gObj: IGrid = this.parent;
        let row: number = 0; const bSize: number = this.getBlockSize();
        const total: number = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[total]; this.maxBlock = total % 2 === 0 ? total - 2 : total - 1; this.offsets = {};
        //Row offset update
        // eslint-disable-next-line prefer-spread
        const blocks: number[] = Array.apply(null, Array(total)).map(() => ++row);
        for (let i: number = 0; i < blocks.length; i++) {
            const tmp: number = (this.vgenerator.cache[blocks[i]] || []).length;
            const rem: number = !isGroupAdaptive(this.parent) ? this.count % bSize : (gObj.vcRows.length % bSize);
            const size: number = !isGroupAdaptive(this.parent) && blocks[i] in this.vgenerator.cache ?
                tmp * this.parent.getRowHeight() : rem && blocks[i] === total ? rem * this.parent.getRowHeight() :
                    this.getBlockHeight();
                // let size: number = this.parent.groupSettings.columns.length && block in this.vgenerator.cache ?
                // tmp * getRowHeight() : this.getBlockHeight();
            this.offsets[blocks[i]] = (this.offsets[blocks[i] - 1] | 0) + size;
            this.tmpOffsets[blocks[i]] = this.offsets[blocks[i] - 1] | 0;
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
        const frozenCols: number = this.parent.getFrozenColumns();
        let fcntColGrp: HTMLCollection;
        let mcntColGrp: HTMLCollection;

        if (frozenCols) {
            fcntColGrp = [].slice.call(this.parent.getFrozenVirtualContent().querySelectorAll('col'));
            mcntColGrp = [].slice.call(this.parent.getMovableVirtualContent().querySelectorAll('col'));
        }
        let rows: Row<Column>[] = [];
        rows = <Row<Column>[]>this.getRows();
        let testRow: Row<Column>;
        rows.some((r: Row<Column>) => { if (r.isDataRow) { testRow = r; } return r.isDataRow; });

        let isRefresh: boolean = true;
        if (!gObj.groupSettings.columns.length && testRow) {
            isRefresh = false;
        }
        let tr: Object = gObj.getDataRows();
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[c];
            let idx: number = gObj.getNormalizedColumnIndex(column.uid);
            const displayVal: string = column.visible === true ? '' : 'none';

            let colGrp: HTMLCollection;
            if (fcntColGrp && mcntColGrp) {
                if (idx >= frozenCols) {
                    colGrp = mcntColGrp;
                    tr = this.parent.getMovableRows();
                    idx = idx - frozenCols;
                } else {
                    colGrp = fcntColGrp;
                }
            } else {
                colGrp = this.getColGroup().children;
            }

            if (idx !== -1 && testRow && idx < testRow.cells.length) {
                setStyleAttribute(colGrp[idx] as HTMLElement, { 'display': displayVal });
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
        if (isRefresh || frozenCols) {
            this.refreshContentRows({ requestType: 'refresh' });
        } else {
            this.parent.notify(events.partialRefresh, { rows: rows, args: { isFrozen: false, rows: rows } });
        }
    }

    private selectVirtualRow(args: { selectedIndex: number, isAvailable: boolean }): void {
        args.isAvailable = args.selectedIndex < this.count;
        if (args.isAvailable && !this.isContextMenuOpen && this.activeKey !== 'upArrow'
            && this.activeKey !== 'downArrow' && !this.isSelection && !this.requestTypes.some((value: string) => value === this.requestType)
            && !this.parent.selectionModule.isInteracted) {
            const selectedRow: Element = this.parent.getRowByIndex(args.selectedIndex);
            const rowHeight: number = this.parent.getRowHeight();
            if (!selectedRow || !this.isRowInView(selectedRow)) {
                this.isSelection = true;
                this.selectedRowIndex = args.selectedIndex;
                const scrollTop: number = (args.selectedIndex + 1) * rowHeight;
                if (!isNullOrUndefined(scrollTop)) {
                    const direction: ScrollDirection = this.content.scrollTop < scrollTop ? 'down' : 'up';
                    this.selectRowIndex = args.selectedIndex;
                    this.content.scrollTop = scrollTop;
                    this.isSelectionScroll = this.observer.check(direction);
                }
            }
        }
        if (this.parent.isFrozenGrid() && this.requestType) {
            if (this.parent.getTablesCount() === this.frzIdx) {
                this.requestType = this.empty as string;
                this.frzIdx = 1;
            } else {
                this.frzIdx++;
            }
        } else {
            this.requestType = this.empty as string;
        }
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
        this.virtualEle.renderPlaceHolder('absolute');
    }

    public appendContent(table: Element): void {
        if (!this.isMovable) {
            this.virtualEle.wrapper.appendChild(table);
        } else {
            this.virtualEle.movableWrapper.appendChild(table);
            this.isMovable = false;
        }
    }

    public refreshUI(): void {
        this.isMovable = this.parent.isFrozenGrid();
        this.setFrozenTable(this.parent.getMovableVirtualContent());
        this.gen.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.gen.getColumnIndexes(<HTMLElement>this.getPanel().querySelector('.' + literals.headerContent)));
        super.refreshUI();
        this.setFrozenTable(this.parent.getFrozenVirtualContent());
    }

    public setVisible(columns?: Column[]): void {
        const gObj: IGrid = this.parent;
        let displayVal: string;
        let idx: number;
        let needFullRefresh: boolean;
        const frozenCols: number = this.parent.getFrozenColumns();
        let fhdrColGrp: HTMLCollection;
        let mhdrColGrp: HTMLCollection;

        if (frozenCols) {
            fhdrColGrp = [].slice.call(this.parent.getFrozenVirtualHeader().querySelectorAll('col'));
            mhdrColGrp = [].slice.call(this.parent.getMovableVirtualHeader().querySelectorAll('col'));
        }
        for (let c: number = 0, clen: number = columns.length; c < clen; c++) {
            const column: Column = columns[c];
            idx = gObj.getNormalizedColumnIndex(column.uid);
            displayVal = column.visible ? '' : 'none';

            let colGrp: HTMLCollection;
            if (fhdrColGrp && mhdrColGrp) {
                if (idx >= frozenCols) {
                    colGrp = mhdrColGrp;
                    idx = idx - frozenCols;
                } else {
                    colGrp = fhdrColGrp;
                }
            } else {
                colGrp = this.getColGroup().children;
            }
            setStyleAttribute(<HTMLElement>colGrp[idx], { 'display': displayVal });
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
            if (needFullRefresh && !frozenCols) {
                this.refreshUI();
            }
        }
        if (frozenCols) {
            this.parent.notify(events.columnPositionChanged, {});
        }
    }

    private setFrozenTable(content: Element): void {
        if (this.parent.isFrozenGrid() && this.parent.enableColumnVirtualization
            && (<{ isXaxis?: Function }>this.parent.contentModule).isXaxis()) {
            (<{ setTable?: Function }>(<Grid>this.parent).contentModule)
                .setTable(content.querySelector('.' + literals.table));
        }
    }

    private setDisplayNone(col: Column, displayVal: string): void {
        const frozenCols: boolean = this.parent.isFrozenGrid();
        let table: Element = this.getTable();
        if (frozenCols && col.getFreezeTableName() === 'movable') {
            table = this.parent.getMovableVirtualHeader().querySelector('.' + literals.table);
        }
        for (const ele of [].slice.apply(table.querySelectorAll('th.e-headercell'))) {
            if (ele.querySelector('[e-mappinguid]') &&
                ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === col.uid) {
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
    public movableWrapper: HTMLElement;
    public movablePlaceholder: HTMLElement;
    public movableTable: HTMLElement;
    public movableContent: HTMLElement;

    public renderWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: `min-height:${formatUnit(height)}` });
        this.wrapper.appendChild(this.table);
        this.content.appendChild(this.wrapper);
    }

    public renderPlaceHolder(position: string = 'relative'): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack', styles: `position:${position}` });
        this.content.appendChild(this.placeholder);
    }

    public renderFrozenWrapper(height?: number): void {
        this.wrapper = createElement('div', { className: 'e-virtualtable', styles: `min-height:${formatUnit(height)}; display: flex` });
        this.content.appendChild(this.wrapper);
    }

    public renderFrozenPlaceHolder(): void {
        this.placeholder = createElement('div', { className: 'e-virtualtrack' });
        this.content.appendChild(this.placeholder);
    }

    public renderMovableWrapper(height?: number): void {
        this.movableWrapper = createElement('div', { className: 'e-virtualtable', styles: `min-height:${formatUnit(height)}` });
        this.movableContent.appendChild(this.movableWrapper);
    }

    public renderMovablePlaceHolder(): void {
        this.movablePlaceholder = createElement('div', { className: 'e-virtualtrack' });
        this.movableContent.appendChild(this.movablePlaceholder);
    }

    public adjustTable(xValue: number, yValue: number): void {
        this.wrapper.style.transform = `translate(${xValue}px, ${yValue}px)`;
    }

    public adjustMovableTable(xValue: number, yValue: number): void {
        this.movableWrapper.style.transform = `translate(${xValue}px, ${yValue}px)`;
    }

    public setMovableWrapperWidth(width: string, full?: boolean): void {
        this.movableWrapper.style.width = width ? `${width}px` : full ? '100%' : '';
    }

    public setMovableVirtualHeight(height?: number, width?: string): void {
        this.movablePlaceholder.style.height = `${height}px`;
        this.movablePlaceholder.style.width = width;
    }

    public setWrapperWidth(width: string, full?: boolean): void {
        this.wrapper.style.width = width ? `${width}px` : full ? '100%' : '';
    }

    public setVirtualHeight(height?: number, width?: string): void {
        this.placeholder.style.height = `${height}px`;
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
