import { IAxisSet, IGridValues, IPivotValues, IValueSortSettings, } from '../../base/engine';
import { PivotEngine, IFieldOptions, IFormatSettings } from '../../base/engine';
import { PivotView } from '../base/pivotview';
import { Reorder, headerRefreshed, CellSelectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { Grid, Resize, ColumnModel, Column, ExcelExport, PdfExport, ContextMenu, ResizeArgs, Freeze } from '@syncfusion/ej2-grids';
import { PdfHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, HeaderCellInfoEventArgs, Selection, RowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, CellSelectingEventArgs } from '@syncfusion/ej2-grids';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, EventHandler, append } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { DataBoundEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { GridSettingsModel } from '../model/gridsettings-model';
import { HyperCellClickEventArgs, PivotCellSelectedEventArgs, QueryCellInfoEventArgs, PivotColumn } from '../../common/base/interface';
import { AggregateMenu } from '../../common/popups/aggregate-menu';
import { SummaryTypes } from '../../base/types';

/**
 * Module to render PivotGrid control
 */
/** @hidden */
export class Render {
    /** @hidden */
    public parent: PivotView;
    /** @hidden */
    public engine: PivotEngine;
    /** @hidden */
    public gridSettings: GridSettingsModel;
    /** @hidden */
    public rowStartPos: number;
    private formatList: string[];
    private colPos: number = 0;
    private lastSpan: number = 0;
    private resColWidth: number;
    private aggMenu: AggregateMenu;
    private field: string;
    /* tslint:disable-next-line */
    private timeOutObj: any;
    /** Constructor for render module */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) :
            (this.parent.isAdaptive ? 140 : 200);
        this.engine = parent.engineModule;
        this.gridSettings = parent.gridSettings;
        this.formatList = this.getFormatList();
        this.aggMenu = new AggregateMenu(this.parent);
    }

    /** @hidden */
    /* tslint:disable */
    public render(): void {
        let parent: PivotView = this.parent;
        let engine: PivotEngine = this.parent.engineModule;
        this.parent.gridHeaderCellInfo = [];
        this.parent.gridCellCollection = {};
        this.injectGridModules(parent);
        this.rowStartPos = this.getRowStartPos();
        if (this.parent.grid && this.parent.grid.element && this.parent.element.querySelector('.e-grid')) {
            if (!engine.isEngineUpdated) {
                engine.headerContent = this.frameDataSource('header');
                engine.valueContent = this.frameDataSource('value');
            } else {
                if (this.parent.enableValueSorting) {
                    engine.valueContent = this.frameDataSource('value');
                }
                engine.isEngineUpdated = false;
            }
            /* tslint:disable */
            this.parent.grid.setProperties({
                columns: this.frameStackedHeaders(), dataSource: parent.dataSourceSettings.values.length > 0 && !this.engine.isEmptyData ? engine.valueContent :
                    this.frameDataSource('value')
            }, true);
            /* tslint:enable */
            this.parent.grid.notify('datasource-modified', {});
            if (this.parent.isScrolling) {
                this.parent.resizeInfo = {};
            }
            this.parent.grid.refreshColumns();
            if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                this.parent.groupingBarModule.setGridRowWidth();
            }
            let e: HTMLElement = this.parent.element.querySelector('.e-movablecontent') as HTMLElement;
            e.querySelector('colGroup').innerHTML =
                this.parent.grid.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
            this.parent.grid.width = this.calculateGridWidth();
            if (!this.parent.isScrolling) {
                this.calculateGridHeight(true);
            }
            //this.parent.isScrolling = false;
        } else {
            this.parent.element.innerHTML = '';
            this.bindGrid(this.parent, (this.engine.isEmptyData ? true : false));
            this.parent.element.appendChild(createElement('div', { id: this.parent.element.id + '_grid' }));
            this.parent.grid.appendTo('#' + this.parent.element.id + '_grid');
        }
        /* tslint:disable */
        this.parent.grid.on(headerRefreshed, this.refreshHeader, this);
    }

    private refreshHeader(): void {
        if (this.parent.enableVirtualization) {
            let mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
            let mCont: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement;
            let vtr: HTMLElement = mCont.querySelector('.' + cls.VIRTUALTRACK_DIV) as HTMLElement;
            this.parent.virtualHeaderDiv = mHdr.querySelector('.' + cls.VIRTUALTRACK_DIV) as HTMLElement;
            if (mHdr.querySelector('.' + cls.VIRTUALTRACK_DIV)) {
                remove(mHdr.querySelector('.' + cls.VIRTUALTRACK_DIV));
            } else {
                this.parent.virtualHeaderDiv = createElement('div', { className: cls.VIRTUALTRACK_DIV }) as HTMLElement;
            }
            mHdr.appendChild(this.parent.virtualHeaderDiv);
            if (vtr) {
                setStyleAttribute(this.parent.virtualHeaderDiv, { height: 0, width: vtr.style.width });
            }
            setStyleAttribute(mHdr.querySelector('.e-table') as HTMLElement, {
                transform: ((mCont.querySelector('.e-table') as HTMLElement).style.transform).split(',')[0] + ',' + 0 + 'px)'
            });
            mHdr.scrollLeft = mCont.scrollLeft;
        }
    }
    /** @hidden */
    public bindGrid(parent: PivotView, isEmpty: boolean): void {
        this.injectGridModules(parent);
        this.parent.grid = new Grid({
            frozenColumns: 1,
            frozenRows: 0,
            dataSource: isEmpty ? this.frameEmptyData() : this.frameDataSource('value'),
            columns: isEmpty ? this.frameEmptyColumns() : this.frameStackedHeaders(),
            height: isEmpty ? 'auto' : this.calculateGridHeight(),
            width: isEmpty ? this.parent.width : this.calculateGridWidth(),
            locale: parent.locale,
            enableRtl: parent.enableRtl,
            allowExcelExport: parent.allowExcelExport,
            allowPdfExport: parent.allowPdfExport,
            allowResizing: this.gridSettings.allowResizing,
            allowTextWrap: this.gridSettings.allowTextWrap,
            allowReordering: this.gridSettings.allowReordering,
            allowSelection: this.gridSettings.allowSelection,
            /* tslint:disable-next-line */
            contextMenuItems: this.gridSettings.contextMenuItems as any,
            selectedRowIndex: this.gridSettings.selectedRowIndex,
            /* tslint:disable-next-line */
            selectionSettings: this.gridSettings.selectionSettings as any,
            textWrapSettings: this.gridSettings.textWrapSettings,
            printMode: this.gridSettings.printMode,
            rowHeight: this.gridSettings.rowHeight,
            gridLines: this.gridSettings.gridLines,
            contextMenuClick: this.contextMenuClick.bind(this),
            contextMenuOpen: this.contextMenuOpen.bind(this),
            beforeCopy: this.gridSettings.beforeCopy ? this.gridSettings.beforeCopy.bind(this.parent) : undefined,
            beforePrint: this.gridSettings.beforePrint ? this.gridSettings.beforePrint.bind(this.parent) : undefined,
            printComplete: this.gridSettings.printComplete ? this.gridSettings.printComplete.bind(this.parent) : undefined,
            rowSelecting: this.gridSettings.rowSelecting ? this.gridSettings.rowSelecting.bind(this.parent) : undefined,
            rowSelected: this.rowSelected.bind(this),
            rowDeselecting: this.gridSettings.rowDeselecting ? this.gridSettings.rowDeselecting.bind(this.parent) : undefined,
            rowDeselected: this.rowDeselected.bind(this),
            cellSelecting: this.gridSettings.cellSelecting ? this.gridSettings.cellSelecting.bind(this.parent) : undefined,
            cellSelected: this.cellSelected.bind(this),
            cellDeselecting: this.gridSettings.cellDeselecting ? this.gridSettings.cellDeselecting.bind(this.parent) : undefined,
            cellDeselected: this.cellDeselected.bind(this),
            resizeStart: this.gridSettings.resizeStart ? this.gridSettings.resizeStart.bind(this.parent) : undefined,
            columnDragStart: this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined,
            columnDrag: this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined,
            columnDrop: this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined,
            resizing: this.setGroupWidth.bind(this),
            resizeStop: this.onResizeStop.bind(this),
            queryCellInfo: this.queryCellInfo.bind(this),
            dataBound: this.dataBound.bind(this),
            headerCellInfo: this.headerCellInfo.bind(this),
            excelHeaderQueryCellInfo: this.excelHeaderQueryCellInfo.bind(this),
            pdfHeaderQueryCellInfo: this.pdfHeaderQueryCellInfo.bind(this),
            excelQueryCellInfo: this.excelQueryCellInfo.bind(this),
            pdfQueryCellInfo: this.pdfQueryCellInfo.bind(this)
        });
        this.parent.grid.on('header-refreshed', this.headerRefreshed.bind(this));
    }
    /* tslint:disable-next-line */
    private headerRefreshed(args: any): void {
        if (this.parent.lastGridSettings && Object.keys(this.parent.lastGridSettings).indexOf('allowResizing') > -1) {
            this.parent.lastGridSettings = undefined;
            if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                this.parent.groupingBarModule.setGridRowWidth();
            }
        }
    }

    private rowSelected(args: RowSelectEventArgs): void {
        this.parent.renderModule.selected();
        this.parent.trigger(events.rowSelected, args);
    }

    private rowDeselected(args: RowDeselectEventArgs): void {
        this.parent.renderModule.selected();
        this.parent.trigger(events.rowDeselected, args);
    }

    private cellSelected(args: CellSelectEventArgs): void {
        if (this.parent.rowRangeSelection.enable) {
            this.parent.grid.selectionModule.selectRowsByRange(
                this.parent.rowRangeSelection.startIndex, this.parent.rowRangeSelection.endIndex);
            this.parent.rowRangeSelection.enable = false;
        } else {
            this.parent.renderModule.selected();
            this.parent.trigger(events.selected, args);
        }
    }

    private cellSelecting(args: CellSelectingEventArgs): void {
        this.parent.trigger(events.cellSelecting, args);
    }

    private cellDeselected(args: CellDeselectEventArgs): void {
        this.parent.renderModule.selected();
        this.parent.trigger(events.cellDeselected, args);
    }

    private queryCellInfo(args: QueryCellInfoEventArgs): void {
        this.parent.renderModule.rowCellBoundEvent(args);
    }

    private headerCellInfo(args: HeaderCellInfoEventArgs): void {
        this.parent.renderModule.columnCellBoundEvent(args);
    }

    private excelHeaderQueryCellInfo(args: ExcelHeaderQueryCellInfoEventArgs): void {
        this.parent.renderModule.excelColumnEvent(args);
    }

    private pdfQueryCellInfo(args: PdfQueryCellInfoEventArgs): void {
        this.parent.renderModule.pdfRowEvent(args);
    }

    private excelQueryCellInfo(args: ExcelQueryCellInfoEventArgs): void {
        this.parent.renderModule.excelRowEvent(args);
    }

    private pdfHeaderQueryCellInfo(args: PdfHeaderQueryCellInfoEventArgs): void {
        this.parent.renderModule.pdfColumnEvent(args);
    }

    private dataBound(args: DataBoundEventArgs): void {
        /* tslint:disable-next-line */
        if (this.parent.cellTemplate && !(window && (window as any).Blazor)) {
            for (let cell of this.parent.gridHeaderCellInfo) {
                if (this.parent.cellTemplate) {
                    /* tslint:disable-next-line */
                    append([].slice.call(this.parent.getCellTemplate()(cell, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate')), cell.targetCell);
                }
            }
            this.parent.gridHeaderCellInfo = [];
        }
        if (this.parent.element.querySelector('.e-firstcell')) {
            if (this.parent.enableRtl) {
                (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderRight = 'none';
            } else {
                (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderLeft = 'none';
            }
        }
        this.parent.grid.widthService.setWidthToTable();
        /* tslint:disable-next-line */
        if (!(this.parent as any).isEmptyGrid) {
            this.calculateGridHeight(true);
        }
        if (this.parent.currentView !== 'Chart') {
            this.parent.grid.hideScroll();
        }
        this.parent.isScrolling = false;
        this.parent.notify(events.contentReady, {});
    }

    /* tslint:disable */
    /* tslint:disable:typedef */
    private contextMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        for (let item of args.items) {
            let cellTarget: Element = this.parent.lastCellClicked;
            let elem: Element = null;
            let bool: boolean;
            if (cellTarget.classList.contains('e-stackedheadercelldiv') || cellTarget.classList.contains('e-cellvalue') ||
                cellTarget.classList.contains('e-headercelldiv') || cellTarget.classList.contains('e-icons') || cellTarget.classList.contains('e-rhandler')) {
                elem = cellTarget.parentElement;
            } else if (cellTarget.classList.contains('e-headercell') || cellTarget.classList.contains('e-rowcell') || cellTarget.classList.contains('e-columnsheader') ||
                cellTarget.classList.contains('e-rowsheader') || cellTarget.classList.contains('e-valuescontent') || cellTarget.classList.contains('e-valuesheader')) {
                elem = cellTarget;
            } else if (cellTarget.classList.contains('e-headertext')) {
                elem = cellTarget.parentElement.parentElement;
            }
            if (elem.classList.contains('e-valuesheader') || elem.classList.contains('e-stot')) {
                bool = true;
            }
            let rowIndex: number = Number(elem.getAttribute('index'));
            let colIndex: number = Number(elem.getAttribute('aria-colindex'));
            let pivotValue1: IAxisSet = this.parent.pivotValues[rowIndex][colIndex] as IAxisSet;
            let select: string = item.id;
            switch (select) {
                case 'expand':
                    if (elem.querySelectorAll('.' + cls.EXPAND).length > 0) {
                        if (args.element.querySelectorAll(cls.CONTEXT_COLLAPSE_ID)) {
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.add(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.remove(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.contains(cls.MENU_HIDE)) {
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.remove(cls.MENU_HIDE);
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.remove(cls.MENU_HIDE);
                        }
                    } else {

                        if (bool) {
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.add(cls.MENU_HIDE);
                        } else {
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.add(cls.MENU_DISABLE);
                        }
                    }
                    break;
                case 'collapse':
                    if (elem.querySelectorAll('.' + cls.COLLAPSE).length > 0) {
                        if (args.element.querySelector(cls.CONTEXT_EXPAND_ID)) {
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.add(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.remove(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.contains(cls.MENU_HIDE)) {
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.remove(cls.MENU_HIDE);
                            args.element.querySelector(cls.CONTEXT_EXPAND_ID).classList.remove(cls.MENU_HIDE);
                        }
                    } else {

                        if (bool) {
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.add(cls.MENU_HIDE);
                        } else {
                            args.element.querySelector(cls.CONTEXT_COLLAPSE_ID).classList.add(cls.MENU_DISABLE);
                        }
                    }
                    break;
                case 'drillthrough':
                    if (!this.parent.allowDrillThrough) {
                        if (args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID)) {
                            args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID).classList.add(cls.MENU_DISABLE);
                        }
                    } else if (!(elem.classList.contains('e-summary'))) {
                        if ((elem as HTMLElement).innerText === "") {
                            if (args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID)) {
                                args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID).classList.add(cls.MENU_DISABLE);
                            }
                        }
                    } else {
                        if (args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_DRILLTHROUGH_ID).classList.remove(cls.MENU_DISABLE);
                        }
                    }
                    break;
                case 'sortasc':
                    if (!this.parent.enableValueSorting) {
                        if (args.element.querySelector(cls.CONTEXT_SORT_ASC_ID)) {
                            args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.add(cls.MENU_DISABLE);
                        }
                    } else if (elem.querySelectorAll('.e-icon-descending').length > 0) {
                        if (args.element.querySelector(cls.CONTEXT_SORT_DESC_ID)) {
                            args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.add(cls.MENU_DISABLE);
                        } else {
                            args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.remove(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.remove(cls.MENU_DISABLE);
                        }
                    } else if (args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.contains(cls.MENU_DISABLE)) {
                        args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.remove(cls.MENU_DISABLE);
                    }
                    break;
                case 'sortdesc':
                    if (!this.parent.enableValueSorting) {
                        if (args.element.querySelector(cls.CONTEXT_SORT_DESC_ID)) {
                            args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.add(cls.MENU_DISABLE);
                        }
                    } else if (elem.querySelectorAll('.e-icon-ascending').length > 0) {
                        if (args.element.querySelector(cls.CONTEXT_SORT_ASC_ID)) {
                            args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.add(cls.MENU_DISABLE);
                        } else {
                            args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.remove(cls.MENU_DISABLE);
                        }
                        if (args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_SORT_DESC_ID).classList.remove(cls.MENU_DISABLE);
                        }
                    } else if (args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.contains(cls.MENU_DISABLE)) {
                        args.element.querySelector(cls.CONTEXT_SORT_ASC_ID).classList.remove(cls.MENU_DISABLE);
                    }
                    break;
                case 'CalculatedField':
                    if (!this.parent.allowCalculatedField) {
                        args.element.querySelector(cls.CONTEXT_CALC_ID).classList.add(cls.MENU_DISABLE);
                    }
                    break;
                case 'pdf':
                    if (!this.parent.allowPdfExport) {
                        args.element.querySelector(cls.CONTEXT_PDF_ID).classList.add(cls.MENU_DISABLE);
                    }
                    break;
                case 'excel':
                    if (!this.parent.allowExcelExport) {
                        args.element.querySelector(cls.CONTEXT_EXCEL_ID).classList.add(cls.MENU_DISABLE);
                    }
                    break;
                case 'csv':
                    if (!this.parent.allowExcelExport) {
                        args.element.querySelector(cls.CONTEXT_CSV_ID).classList.add(cls.MENU_DISABLE);
                    }
                    break;
                case 'exporting':
                    if ((!this.parent.allowExcelExport) && (!this.parent.allowPdfExport)) {
                        args.element.querySelector(cls.CONTEXT_EXPORT_ID).classList.add(cls.MENU_DISABLE);
                    }
                    break;
                case 'aggregate':
                    if ((elem as HTMLElement).innerText === "") {
                        if (args.element.querySelector(cls.CONTEXT_AGGREGATE_ID)) {
                            args.element.querySelector(cls.CONTEXT_AGGREGATE_ID).classList.add(cls.MENU_DISABLE);
                        }
                    } else {
                        if (args.element.querySelector(cls.CONTEXT_AGGREGATE_ID).classList.contains(cls.MENU_DISABLE)) {
                            args.element.querySelector(cls.CONTEXT_AGGREGATE_ID).classList.remove(cls.MENU_DISABLE);
                        }
                    }
                    break;
            }
        }
        this.parent.trigger(events.contextMenuOpen, args);
    }

    private contextMenuClick(args: MenuEventArgs): void {
        // this.parent.gridSettings.contextMenuClick();
        let target: Element = this.parent.lastCellClicked;
        let selected: string = args.item.id;
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let ele: Element = null;
        if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv') || target.classList.contains('e-icons') || target.classList.contains('e-rhandler')) {
            ele = target.parentElement;
        } else if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        } else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        let rowIndx: number = Number(ele.getAttribute('index'));
        let colIndx: number = Number(ele.getAttribute('aria-colindex'));
        let pivotValue: IAxisSet = this.parent.pivotValues[rowIndx][colIndx] as IAxisSet;
        if (args.item.id === 'AggSum' || args.item.id === 'AggProduct' || args.item.id === 'AggCount' ||
            args.item.id === 'AggDistinctCount' || args.item.id === 'AggAvg' || args.item.id === 'AggMin' ||
            args.item.id === 'AggMax' || args.item.id === 'AggMoreOption') {
            this.field = this.parent.engineModule.fieldList[pivotValue.actualText.toString()].caption;
        }
        switch (selected) {
            case 'pdf':
                this.parent.pdfExport();
                break;
            case 'excel':
                this.parent.excelExport();
                break;
            case 'csv':
                this.parent.csvExport();
                break;
            case 'drillthrough':
                ele.dispatchEvent(event);
                break;
            case 'sortasc':
                this.parent.setProperties({
                    dataSourceSettings: {
                        valueSortSettings: {
                            headerText: (pivotValue as IAxisSet).valueSort.levelName as string,
                            headerDelimiter: this.parent.dataSourceSettings.valueSortSettings.headerDelimiter
                        }
                    }
                });
                this.parent.dataSourceSettings.valueSortSettings.sortOrder = 'Ascending';
                break;
            case 'sortdesc':
                this.parent.setProperties({
                    dataSourceSettings: {
                        valueSortSettings: {
                            headerText: (pivotValue as IAxisSet).valueSort.levelName as string,
                            headerDelimiter: this.parent.dataSourceSettings.valueSortSettings.headerDelimiter
                        }
                    }
                });
                this.parent.dataSourceSettings.valueSortSettings.sortOrder = 'Descending';
                break;
            case 'expand':
                if (ele.querySelectorAll('.' + cls.EXPAND)) {
                    let exp = ele.querySelectorAll('.' + cls.EXPAND)[0] as Element
                    this.parent.onDrill(exp);
                }
                break;
            case 'collapse':
                if (ele.querySelectorAll('.' + cls.COLLAPSE)) {
                    let colp = ele.querySelectorAll('.' + cls.COLLAPSE)[0] as Element
                    this.parent.onDrill(colp);
                }
                break;
            case 'CalculatedField':
                this.parent.calculatedFieldModule.createCalculatedFieldDialog();
                break;
            case 'AggSum':
                this.updateAggregate('Sum');
                break;
            case 'AggProduct':
                this.updateAggregate('Product');
                break;
            case 'AggCount':
                this.updateAggregate('Count');
                break;
            case 'AggDistinctCount':
                this.updateAggregate('DistinctCount');
                break;
            case 'AggAvg':
                this.updateAggregate('Avg');
                break;
            case 'AggMin':
                this.updateAggregate('Min');
                break;
            case 'AggMax':
                this.updateAggregate('Max');
                break;
            case 'AggMoreOption':
                ele.setAttribute('id', this.field);
                ele.setAttribute('data-caption', this.field);
                ele.setAttribute('data-field', this.field);
                ele.setAttribute('data-type', this.parent.engineModule.fieldList[pivotValue.actualText.toString()].aggregateType);
                ele.setAttribute('data-basefield', this.parent.engineModule.fieldList[pivotValue.actualText.toString()].baseField);
                ele.setAttribute('data-baseItem', this.parent.engineModule.fieldList[pivotValue.actualText.toString()].baseItem);
                this.aggMenu.createValueSettingsDialog(ele as HTMLElement, this.parent.element);
                break;

        }
        this.parent.trigger(events.contextMenuClick, args);
    }
    /* tslint:enable */
    private updateAggregate(aggregate: string): void {
        let valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
        for (let valueCnt: number = 0; valueCnt < this.parent.dataSourceSettings.values.length; valueCnt++) {
            if (this.parent.dataSourceSettings.values[valueCnt].name === this.field) {
                let dataSourceItem: IFieldOptions = (<{ [key: string]: IFieldOptions }>valuefields[valueCnt]);
                dataSourceItem.type = aggregate as SummaryTypes;
            }
        }
    }

    private injectGridModules(parent: PivotView): void {
        Grid.Inject(Freeze);
        if (parent.allowExcelExport) {
            Grid.Inject(ExcelExport);
        }
        if (parent.allowPdfExport) {
            Grid.Inject(PdfExport);
        }
        Grid.Inject(Selection, Reorder, Resize);
        if (this.gridSettings.contextMenuItems) {
            Grid.Inject(ContextMenu);
        }
    }

    /** @hidden */
    public updateGridSettings(): void {
        this.injectGridModules(this.parent);
        this.parent.grid.allowResizing = this.gridSettings.allowResizing;
        this.parent.grid.allowTextWrap = this.gridSettings.allowTextWrap;
        this.parent.grid.allowReordering = this.gridSettings.allowReordering;
        this.parent.grid.allowSelection = this.gridSettings.allowSelection;
        /* tslint:disable-next-line */
        this.parent.grid.contextMenuItems = this.gridSettings.contextMenuItems as any;
        this.parent.grid.selectedRowIndex = this.gridSettings.selectedRowIndex;
        /* tslint:disable-next-line */
        this.parent.grid.selectionSettings = this.gridSettings.selectionSettings as any;
        this.parent.grid.textWrapSettings = this.gridSettings.textWrapSettings;
        this.parent.grid.printMode = this.gridSettings.printMode;
        this.parent.grid.rowHeight = this.gridSettings.rowHeight;
        this.parent.grid.gridLines = this.gridSettings.gridLines;
        if (this.parent.lastGridSettings) {
            let keys: string[] = Object.keys(this.parent.lastGridSettings);
            if (keys.indexOf('height') > -1) {
                this.parent.grid.height = this.gridSettings.height;
            }
            if (keys.indexOf('width') > -1) {
                this.parent.grid.width = this.gridSettings.width;
            }
            this.updatePivotColumns();
        }
        this.clearColumnSelection();
    }

    private updatePivotColumns(): void {
        let keys: string[] = Object.keys(this.parent.lastGridSettings);
        for (let colPos: number = 0; colPos < this.parent.pivotColumns.length; colPos++) {
            let pivotColumn: PivotColumn = this.parent.pivotColumns[colPos];
            for (let keyPos: number = 0; keyPos < keys.length; keyPos++) {
                let key: string = keys[keyPos];
                /* tslint:disable-next-line */
                if (!isNullOrUndefined((this.parent.pivotColumns[colPos] as any)[key])) {
                    /* tslint:disable-next-line */
                    (pivotColumn as any)[key] = (this.parent.lastGridSettings as any)[key];
                }
            }
        }
        this.parent.fillGridColumns(this.parent.grid.columns as ColumnModel[]);
    }

    private clearColumnSelection(): void {
        this.parent.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR).forEach((ele: HTMLElement) => {
            ele.classList.remove(cls.CELL_ACTIVE_BGCOLOR);
            ele.classList.remove(cls.SELECTED_BGCOLOR);
        });
    }

    private appendValueSortIcon(cell: IAxisSet, tCell: HTMLElement, rCnt: number, cCnt: number): HTMLElement {
        if (this.parent.enableValueSorting) {
            let vSort: IValueSortSettings = this.parent.dataSourceSettings.valueSortSettings;
            let len: number = (cell.type === 'grand sum' &&
                this.parent.dataSourceSettings.values.length === 1 && !this.parent.dataSourceSettings.alwaysShowValueHeader) ? 0 :
                (this.parent.dataSourceSettings.values.length > 1 || this.parent.dataSourceSettings.alwaysShowValueHeader) ?
                    (this.parent.engineModule.headerContent.length - 1) :
                    this.parent.dataSourceSettings.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
            let lock: boolean = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
            if (vSort !== undefined && lock && rCnt === len && this.parent.dataSourceSettings.valueAxis === 'column') {
                if (tCell.querySelector('.e-sortfilterdiv')) {
                    tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                        'e-descending' : 'e-ascending');
                    tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                        'e-icon-descending' : 'e-icon-ascending');
                } else {
                    tCell.appendChild(createElement('div', {
                        className: (vSort.sortOrder === 'Descending' ?
                            'e-icon-descending e-icons e-descending e-sortfilterdiv' :
                            'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                    }));
                }
                if (!isNullOrUndefined(cell.hasChild) && cell.type !== 'grand sum' && tCell.querySelector('.e-expand') &&
                    (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'))) {
                    let element: HTMLElement =
                        (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending')) as HTMLElement;
                    setStyleAttribute(element, { 'padding-top': '12px' });
                }
            }
            // return tCell;
        }
        return tCell;
    }

    private onResizeStop(args: ResizeArgs): void {
        /* tslint:disable-next-line */
        let column: string = args.column.field === '0.formattedText' ? '0.formattedText' : (args.column.customAttributes as any).cell.valueSort.levelName;
        this.parent.resizeInfo[column] = Number(args.column.width.toString().split('px')[0]);
        this.setGroupWidth(args);
        this.calculateGridHeight(true);
        this.parent.grid.hideScroll();
    }

    private setGroupWidth(args: ResizeArgs): void {
        if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
            if ((this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth < 245 && !this.parent.firstColWidth) {
                args.cancel = true;
                let gridColumn: Column[] = this.parent.grid.columns as Column[];
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = this.resColWidth;
                }
                this.parent.element.querySelector('.e-frozenheader').querySelector('col').style.width = (this.resColWidth + 'px');
                this.parent.element.querySelector('.e-frozencontent').querySelector('col').style.width = (this.resColWidth + 'px');
            }
            (this.parent.element.querySelector('.e-group-rows') as HTMLElement).style.height = 'auto';
            (this.parent.element.querySelector('.e-group-values') as HTMLElement).style.width =
                (this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth + 'px';
            let firstRowHeight: number = (this.parent.element.querySelector('.e-headercontent') as HTMLElement).offsetHeight;
            (this.parent.element.querySelector('.e-group-rows') as HTMLElement).style.height = firstRowHeight + 'px';
        }
        this.parent.trigger(args.e.type === 'touchend' || args.e.type === 'mouseup' ? events.resizeStop : events.resizing, args);
    }

    /* tslint:disable */
    /** @hidden */
    public selected(): void {
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.onSelect.bind(this), 300);
    }

    private onSelect(): void {
        let pivotArgs: PivotCellSelectedEventArgs = { selectedCellsInfo: [], pivotValues: this.parent.pivotValues, currentCell: null };
        /* tslint:disable-next-line */
        let selectedElements: any = this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR);
        for (let element of selectedElements) {
            let colIndex: number = Number(element.getAttribute('aria-colindex'));
            let rowIndex: number = Number(element.getAttribute('index'));
            let cell: IAxisSet = (this.engine.pivotValues[rowIndex][colIndex] as IAxisSet);
            if (cell) {
                if (cell.axis === 'value') {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.value,
                        columnHeaders: cell.columnHeaders,
                        rowHeaders: cell.rowHeaders,
                        measure: cell.actualText.toString()
                    });
                } else if (cell.axis === 'column') {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.formattedText,
                        columnHeaders: cell.valueSort.levelName,
                        rowHeaders: '',
                        measure: ''
                    });
                } else {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.formattedText,
                        columnHeaders: '',
                        rowHeaders: cell.valueSort.levelName,
                        measure: ''
                    });
                }
            }
        }
        this.parent.trigger(events.cellSelected, pivotArgs);
    }

    private rowCellBoundEvent(args: QueryCellInfoEventArgs): void {
        let tCell: HTMLElement = args.cell as HTMLElement;
        /* tslint:disable-next-line */
        if (tCell && !(this.parent as any).isEmptyGrid) {
            let customClass: string = this.parent.hyperlinkSettings.cssClass;
            tCell.setAttribute('index', (Number(tCell.getAttribute('index')) + this.engine.headerContent.length).toString());
            let cell: IAxisSet = (args.data as IGridValues)[0] as IAxisSet;
            if (tCell.getAttribute('aria-colindex') === '0') {
                let isValueCell: boolean = cell.type && cell.type === 'value';
                tCell.innerText = '';
                let level: number = cell.level ? cell.level : (isValueCell ? (this.lastSpan + 1) : 0);
                do {
                    if (level > 0) {
                        tCell.appendChild(createElement('span', {
                            className: level === 0 ? '' : cls.NEXTSPAN,
                        }));
                    }
                    level--;
                } while (level > -1);
                level = cell.level ? cell.level : 0;
                this.lastSpan = !isValueCell ? level : this.lastSpan;
                if (!cell.hasChild && level > 0) {
                    tCell.appendChild(createElement('span', {
                        className: cls.LASTSPAN,
                    }));
                }
                let fieldName: string;
                if ((this.parent.dataSourceSettings.rows.length > 0 &&
                    (cell.valueSort ? Object.keys(cell.valueSort).length > 0 : true))) {
                    fieldName = level > -1 ? this.parent.dataSourceSettings.rows[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                let localizedText: string = cell.formattedText;
                if (cell.type) {
                    if (cell.type === 'grand sum') {
                        tCell.classList.add('e-gtot');
                        localizedText = this.parent.localeObj.getConstant('grandTotal');
                    } else {
                        tCell.classList.add('e-stot');
                    }
                }
                tCell.classList.add(cls.ROWSHEADER);
                if (cell.hasChild === true) {
                    tCell.appendChild(createElement('div', {
                        className: (cell.isDrilled === true ? cls.COLLAPSE : cls.EXPAND) + ' ' + cls.ICON,
                        attrs: {
                            'title': cell.isDrilled === true ? this.parent.localeObj.getConstant('collapse') :
                                this.parent.localeObj.getConstant('expand')
                        }
                    }));
                }
                tCell.appendChild(createElement('span', {
                    className: cls.CELLVALUE,
                    /* tslint:disable-next-line */
                    innerHTML: (this.parent.isRowCellHyperlink || cell.enableHyperlink ? '<a  data-url="' + localizedText + '" class="e-hyperlinkcell ' + customClass + '">' + localizedText + '</a>' : localizedText)
                }));
                let vSort: IValueSortSettings = this.parent.pivotView.dataSourceSettings.valueSortSettings;
                if (this.parent.enableValueSorting) {
                    if (vSort && vSort.headerText && this.parent.dataSourceSettings.valueAxis === 'row'
                        && (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName) {
                        if ((this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName
                            === vSort.headerText) {
                            let style: string = (tCell.querySelector('.e-expand') || tCell.querySelector('.e-collapse')) ?
                                'padding-top: 18px' : 'padding-top: 12px';
                            tCell.appendChild(createElement('div', {
                                className: (vSort.sortOrder === 'Descending' ?
                                    'e-icon-descending e-icons e-descending e-sortfilterdiv' :
                                    'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                                styles: style
                            }));
                        }
                    }
                }
            } else {
                let innerText: string = tCell.innerText;
                tCell.innerText = '';
                tCell.classList.add(cls.VALUESCONTENT);
                cell = (args.data as IGridValues)[Number(tCell.getAttribute('aria-colindex'))] as IAxisSet;
                if (cell.isSum) {
                    tCell.classList.add(cls.SUMMARY);
                }
                if (cell.cssClass) {
                    tCell.classList.add(cell.cssClass);
                }
                tCell.appendChild(createElement('span', {
                    className: cls.CELLVALUE,
                    innerHTML: ((tCell.className.indexOf('e-summary') !== -1 && this.parent.isSummaryCellHyperlink) ||
                        (tCell.className.indexOf('e-summary') === -1 && this.parent.isValueCellHyperlink) || cell.enableHyperlink ?
                        '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>' : innerText)
                }));
            }
            if (this.parent.cellTemplate) {
                let index: string = tCell.getAttribute('index');
                let colindex: string = tCell.getAttribute('aria-colindex');
                let templateID: string = index + '_' + colindex;
                /* tslint:disable-next-line */
                if (!(window && (window as any).Blazor)) {
                    /* tslint:disable-next-line */
                    append([].slice.call(this.parent.getCellTemplate()({ targetCell: tCell }, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate')), tCell);
                } else if (index && colindex) {
                    this.parent.gridCellCollection[templateID] = tCell;
                }
            }
            this.unWireEvents(tCell);
            this.wireEvents(tCell);
        }
        args.pivotview = this.parent;
        this.parent.trigger(events.queryCellInfo, args);
    }

    private columnCellBoundEvent(args: HeaderCellInfoEventArgs): void {
        if (args.cell.column && args.cell.column.customAttributes) {
            let cell: IAxisSet = args.cell.column.customAttributes.cell;
            let tCell: HTMLElement = args.node as HTMLElement;
            if (cell) {
                let customClass: string = this.parent.hyperlinkSettings.cssClass;
                let level: number = cell.level ? cell.level : 0;
                if ((cell.level === -1 && !cell.rowSpan && cell.rowIndex !== this.engine.headerContent.length - 1)
                    || cell.rowSpan === -1) {
                    (args.node as HTMLElement).style.display = 'none';
                } else if (cell.rowSpan > 1) {
                    args.node.setAttribute('rowspan', cell.rowSpan.toString());
                    args.node.setAttribute('aria-rowspan', cell.rowSpan.toString());
                    if ((cell.rowIndex + cell.rowSpan) === this.engine.headerContent.length) {
                        (args.node as HTMLElement).style.borderBottomWidth = '0px';
                    }
                }
                args.node.setAttribute('aria-colindex', cell.colIndex.toString());
                args.node.setAttribute('index', cell.rowIndex.toString());
                let fieldName: string;
                if (!(this.parent.dataSourceSettings.values && this.parent.dataSourceSettings.valueAxis === 'column' &&
                    this.parent.dataSourceSettings.values.length > 1 &&
                    (cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSourceSettings.columns &&
                    this.parent.dataSourceSettings.columns.length > 0) {
                    fieldName = level > -1 && this.parent.dataSourceSettings.columns[level] ?
                        this.parent.dataSourceSettings.columns[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                if (cell.type) {
                    tCell.classList.add(cell.type === 'grand sum' ? 'e-gtot' : 'e-stot');
                    let localizedText: string = cell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                        cell.formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total');
                    if ((tCell.querySelector('.e-headertext') as HTMLElement) !== null) {
                        (tCell.querySelector('.e-headertext') as HTMLElement).innerText = localizedText;
                    } else {
                        (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerText = localizedText;
                    }
                }
                tCell.classList.add(cls.COLUMNSHEADER);
                if (this.parent.isColumnCellHyperlink || cell.enableHyperlink) {
                    if (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement) {
                        let innerText: string = (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerText;
                        (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    } else if (tCell.querySelector('.e-headertext') as HTMLElement) {
                        let innerText: string = (tCell.querySelector('.e-headertext') as HTMLElement).innerText;
                        (tCell.querySelector('.e-headertext') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                }
                if (cell.hasChild === true) {
                    let hdrdiv: HTMLElement = tCell.querySelector('.e-headercelldiv') as HTMLElement;
                    if (hdrdiv) {
                        hdrdiv.style.height = 'auto';
                        hdrdiv.style.lineHeight = 'normal';
                    }
                    let div: HTMLElement = createElement('div', {
                        className: (cell.isDrilled === true ? cls.COLLAPSE : cls.EXPAND) + ' ' + cls.ICON,
                        attrs: {
                            'title': cell.isDrilled === true ? this.parent.localeObj.getConstant('collapse') :
                                this.parent.localeObj.getConstant('expand')
                        }
                    });
                    tCell.children[0].classList.add(cls.CELLVALUE);
                    if (window.navigator.userAgent.indexOf('Edge') > -1 || window.navigator.userAgent.indexOf('Trident') > -1) {
                        (tCell.children[0] as HTMLElement).style.display = 'table';
                    } else {
                        (tCell.children[0] as HTMLElement).style.display = 'block';
                    }
                    tCell.insertBefore(div, tCell.children[0]);
                }
                tCell = this.appendValueSortIcon(cell, tCell, cell.rowIndex, cell.colIndex);
                if (this.parent.cellTemplate) {
                    let index: string = tCell.getAttribute('index');
                    let colindex: string = tCell.getAttribute('aria-colindex');
                    let templateID: string = index + '_' + colindex;
                    /* tslint:disable-next-line */
                    if (!(window && (window as any).Blazor)) {
                        this.parent.gridHeaderCellInfo.push({ targetCell: tCell });
                    } else if (index && colindex) {
                        this.parent.gridCellCollection[templateID] = tCell;
                    }
                }
                let field: string;
                let len: number = this.parent.dataSourceSettings.values.length;
                for (let vCnt: number = 0; vCnt < len; vCnt++) {
                    if (this.parent.dataSourceSettings.values[vCnt].name === cell.actualText) {
                        tCell.classList.add(cls.VALUESHEADER);
                    }
                }
                this.unWireEvents(tCell);
                this.wireEvents(tCell);
            }
        }
        this.parent.trigger(events.headerCellInfo, args);
    }

    private onHyperCellClick(e: MouseEvent): void {
        let cell: Element = (e.target as Element).parentElement.parentElement;
        cell = (cell.className.indexOf('e-headercelldiv') > -1 ? cell.parentElement : cell);
        let args: HyperCellClickEventArgs = {
            currentCell: cell,
            data: this.engine.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('aria-colindex'))],
            cancel: true
        };
        this.parent.trigger(events.hyperlinkCellClick, args, (observedArgs: HyperCellClickEventArgs) => {
            if (!observedArgs.cancel) {
                let url: string = args.currentCell.getAttribute('data-url') ? (args.currentCell).getAttribute('data-url') :
                    (args.currentCell.querySelector('a') as HTMLElement).getAttribute('data-url');
                window.open(url);
            }
        });
    }

    private getRowStartPos(): number {
        let pivotValues: IPivotValues = this.parent.pivotValues;
        let rowPos: number;
        for (let rCnt: number = 0; rCnt < pivotValues.length; rCnt++) {
            if (pivotValues[rCnt] && pivotValues[rCnt][0] && (pivotValues[rCnt][0] as IAxisSet).axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }
        return rowPos;
    }

    private frameDataSource(type: string): IGridValues {
        let dataContent: IGridValues = [];
        if (this.parent.dataSourceSettings.values.length > 0 && !this.engine.isEmptyData) {
            if ((this.parent.enableValueSorting) || !this.engine.isEngineUpdated) {
                let rowCnt: number = 0;
                let pivotValues: IPivotValues = this.parent.pivotValues;
                let start: number = type === 'value' ? this.rowStartPos : 0;
                let end: number = type === 'value' ? pivotValues.length : this.rowStartPos;
                for (let rCnt: number = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {} as IAxisSet[];
                        for (let cCnt: number = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
                            if (pivotValues[rCnt][cCnt]) {
                                dataContent[rowCnt][cCnt] = pivotValues[rCnt][cCnt] as IAxisSet;
                            }
                        }
                        rowCnt++;
                    }
                }
            } else {
                dataContent = type === 'value' ? this.engine.valueContent : this.engine.headerContent;
            }
        } else {
            dataContent = this.frameEmptyData();
        }
        return dataContent;
    }

    /** @hidden */
    /* tslint:disable-next-line */
    public frameEmptyData(): any[] {
        /* tslint:disable-next-line */
        let dataContent: any = [{
            0: { formattedText: this.parent.localeObj.getConstant('grandTotal') },
            1: { formattedText: this.parent.localeObj.getConstant('emptyData') }
        }];
        return dataContent;
    }

    public calculateColWidth(colCount: number): number {
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth);
        colCount = colCount - 1;
        let colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return colWidth;
    }

    public resizeColWidth(colCount: number): number {
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        colCount = colCount - 1;
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth);
        let colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return colWidth;
    }

    public calculateGridWidth(): number | string {
        let parWidth: number | string = this.parent.width;
        let eleWidth: number = this.parent.element.getBoundingClientRect().width ?
            this.parent.element.getBoundingClientRect().width : this.parent.element.offsetWidth;
        if (this.gridSettings.width === 'auto') {
            if (this.parent.width === 'auto') {
                parWidth = eleWidth;
            } else if (this.parent.width.toString().indexOf('%') > -1) {
                parWidth = ((parseFloat(this.parent.width.toString()) / 100) * eleWidth);
            }
        } else {
            parWidth = this.gridSettings.width;
        }
        return parWidth;
    }

    /** @hidden */
    public calculateGridHeight(elementCreated?: boolean): number | string {
        let gridHeight: number | string = this.parent.height;
        let parHeight: number = this.parent.getHeightAsNumber();
        if (isNaN(parHeight)) {
            parHeight = this.parent.element.offsetHeight > 0 ? this.parent.element.offsetHeight : 1;
        }
        if (this.parent.currentView !== 'Chart') {
            if (this.gridSettings.height === 'auto' && parHeight && this.parent.element.querySelector('.' + cls.GRID_HEADER)) {
                let rowColHeight: number = (this.parent.element.querySelector('.' + cls.GRID_HEADER) as HTMLElement).offsetHeight;
                let gBarHeight: number = rowColHeight + (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS) ?
                    (this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS) as HTMLElement).offsetHeight : 0);
                let toolBarHeight: number = this.parent.element.querySelector('.' + cls.GRID_TOOLBAR) ? 42 : 0;
                gridHeight = parHeight - (gBarHeight + toolBarHeight) - 2;
                if (elementCreated) {
                    let tableHeight: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).offsetHeight;
                    let contentHeight: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetHeight;
                    let tableWidth: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).offsetWidth;
                    let contentWidth: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetWidth;
                    let horizontalOverflow: boolean = contentWidth < tableWidth;
                    let verticalOverflow: boolean = contentHeight < tableHeight;
                    let commonOverflow: boolean = horizontalOverflow && ((gridHeight - tableHeight) < 18) ? true : false;
                    if (gridHeight >= tableHeight && (horizontalOverflow ? gridHeight >= contentHeight : true) &&
                        !verticalOverflow && !commonOverflow) {
                        this.parent.grid.height = 'auto';
                    } else {
                        this.parent.grid.height = gridHeight;
                    }
                } else {
                    if (gridHeight > (this.engine.valueContent.length * this.gridSettings.rowHeight)) {
                        gridHeight = 'auto';
                    }
                }
            } else {
                gridHeight = this.gridSettings.height;
            }
        }
        return gridHeight < this.parent.gridSettings.rowHeight ? this.parent.gridSettings.rowHeight : gridHeight;
    }

    public frameStackedHeaders(): ColumnModel[] {
        let integrateModel: ColumnModel[] = [];
        if (this.parent.dataSourceSettings.values.length > 0 && !this.engine.isEmptyData) {
            let headerCnt: number = this.engine.headerContent.length;
            let headerSplit: Object[] = [];
            let splitPos: Object[] = [];
            let colWidth: number = this.calculateColWidth(this.engine.pivotValues[0].length);
            do {
                let columnModel: ColumnModel[] = [];
                let actualCnt: number = 0;
                headerCnt--;
                let colField: IAxisSet[] = this.engine.headerContent[headerCnt];
                if (colField) {
                    for (let cCnt: number = 0; cCnt < Object.keys(colField).length + (colField[0] ? 0 : 1); cCnt++) {
                        let colSpan: number = (colField[cCnt] && colField[cCnt].colSpan) ? colField[cCnt].colSpan : 1;
                        let rowSpan: number = (colField[cCnt] && colField[cCnt].rowSpan) ? colField[cCnt].rowSpan : 1;
                        let formattedText: string = colField[cCnt] ?
                            (colField[cCnt].type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                                (colField[cCnt].type === 'sum' ?
                                    colField[cCnt].formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total') :
                                    colField[cCnt].formattedText)) : '';
                        if (headerCnt === this.engine.headerContent.length - 1) {
                            columnModel[actualCnt] = {
                                field: (cCnt + '.formattedText'),
                                headerText: formattedText,
                                customAttributes: { 'cell': colField[cCnt] },
                                /* tslint:disable-next-line */
                                width: colField[cCnt] ? this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) : this.resColWidth,
                                minWidth: 30,
                                format: cCnt === 0 ? '' : this.formatList[(cCnt - 1) % this.parent.dataSourceSettings.values.length],
                                allowReordering: this.parent.gridSettings.allowReordering,
                                allowResizing: this.parent.gridSettings.allowResizing,
                                visible: true
                            };
                        } else if (headerSplit[cCnt]) {
                            let tmpSpan: number = colSpan;
                            let innerModel: ColumnModel[] = [];
                            let innerPos: number = cCnt;
                            while (tmpSpan > 0) {
                                if (columnModel[actualCnt]) {
                                    if (!integrateModel[splitPos[innerPos] as number]) {
                                        break;
                                    }
                                    innerModel.push(integrateModel[splitPos[innerPos] as number]);
                                } else {
                                    columnModel[actualCnt] = {
                                        headerText: formattedText,
                                        customAttributes: { 'cell': colField[cCnt] },
                                        /* tslint:disable-next-line */
                                        width: colField[cCnt] ? this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) : this.resColWidth,
                                        minWidth: 30,
                                        allowReordering: this.parent.gridSettings.allowReordering,
                                        allowResizing: this.parent.gridSettings.allowResizing,
                                        visible: true
                                    };
                                    innerModel = [integrateModel[splitPos[innerPos] as number] as Column];
                                }
                                tmpSpan = tmpSpan - (headerSplit[innerPos] as number);
                                innerPos = innerPos + (headerSplit[innerPos] as number);
                            }
                            columnModel[actualCnt].columns = innerModel;
                        }
                        if (columnModel[actualCnt]) {
                            columnModel[actualCnt].clipMode = this.gridSettings.clipMode;
                        }
                        headerSplit[cCnt] = colSpan;
                        splitPos[cCnt] = actualCnt;
                        actualCnt++;
                        cCnt = cCnt + colSpan - 1;
                    }
                }
                integrateModel = columnModel.length > 0 ? columnModel : integrateModel;
            } while (headerCnt > 0);
            integrateModel[0] = {
                field: (0 + '.formattedText'),
                width: this.resColWidth,
                minWidth: 30,
                headerText: '',
                allowReordering: false,
                allowResizing: this.parent.gridSettings.allowResizing,
                visible: true
            };
        } else {
            integrateModel = this.frameEmptyColumns();
        }
        if (integrateModel.length > 1) {
            integrateModel[integrateModel.length - 1].minWidth = integrateModel[integrateModel.length - 1].width;
            integrateModel[integrateModel.length - 1].width = 'auto';
        }
        this.parent.triggerColumnRenderEvent(integrateModel);
        return integrateModel;
    }

    /** @hidden */
    public setSavedWidth(column: string, width: number): number {
        width = this.parent.resizeInfo[column] ? this.parent.resizeInfo[column] : width;
        return width;
    }

    /** @hidden */
    public frameEmptyColumns(): ColumnModel[] {
        let columns: ColumnModel[] = [];
        let colWidth: number = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: this.resColWidth });
        /* tslint:disable-next-line */
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    }

    /** @hidden */
    public getFormatList(): string[] {
        let formatArray: string[] = [];
        for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
            let field: IFieldOptions = this.parent.dataSourceSettings.values[vCnt];
            if (this.parent.dataSourceSettings.formatSettings.length > 0) {
                let format: string = '';
                for (let fCnt: number = 0; fCnt < this.parent.dataSourceSettings.formatSettings.length; fCnt++) {
                    let formatSettings: IFormatSettings = this.parent.dataSourceSettings.formatSettings[fCnt];
                    if (field.name === formatSettings.name) {
                        format = formatSettings.format;
                        break;
                    } else {
                        continue;
                    }
                }
                formatArray.push(format);
            } else {
                formatArray.push('N');
            }
        }
        return formatArray;
    }

    private excelColumnEvent(args: ExcelHeaderQueryCellInfoEventArgs): void {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(events.excelHeaderQueryCellInfo, args);
    }
    private pdfColumnEvent(args: PdfHeaderQueryCellInfoEventArgs): void {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
    }
    private excelRowEvent(args: ExcelQueryCellInfoEventArgs): void {
        if (args.column.field === '0.formattedText') {
            let isValueCell: boolean = (args.data as IAxisSet[])[0].type === 'value';
            let level: number = isValueCell ? (this.lastSpan + 1) : (args.data as IAxisSet[])[0].level;
            this.colPos = 0;
            args.style = { hAlign: 'Left', indent: level * 2 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        } else {
            this.colPos++;
            /* tslint:disable-next-line */
            args.value = (<any>args.data)[this.colPos].value || (<any>args.data)[this.colPos].formattedText;
        }
        args = this.exportContentEvent(args);
        this.parent.trigger(events.excelQueryCellInfo, args);
    }
    /* tslint:disable:no-any */
    private pdfRowEvent(args: PdfQueryCellInfoEventArgs): void {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            let isValueCell: boolean = ((args as any).data as IAxisSet[])[0].type === 'value';
            let level: number = isValueCell ? (this.lastSpan + 1) : ((args as any).data as IAxisSet[])[0].level;
            args.style = { paragraphIndent: level * 10 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        }
        this.parent.trigger(events.pdfQueryCellInfo, args);
    }

    private exportHeaderEvent(args: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs): any {
        let rowSpan: number = 1;
        if (((args as any).gridCell as any).column.customAttributes) {
            let cell: IAxisSet = ((args as any).gridCell as any).column.customAttributes.cell;
            rowSpan = cell.rowSpan ? cell.rowSpan : 1;
        } else {
            rowSpan = Object.keys(this.engine.headerContent).length;
        }
        if ((args.cell as any).rowSpan && (args.cell as any).rowSpan !== rowSpan && rowSpan > -1) {
            (args.cell as any).rowSpan = rowSpan;
        }
        return args;
    }

    private exportContentEvent(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): any {
        args.value = (<any>args).data[Number(args.column.field.split('.formattedText')[0])].type === 'grand sum' ?
            this.parent.localeObj.getConstant('grandTotal') : args.value;
        return args;
    }

    private unWireEvents(cell: HTMLElement): void {
        if (cell.querySelector('.e-hyperlinkcell')) {
            /* tslint:disable-next-line */
            EventHandler.remove(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick);
        } else {
            return;
        }
    }

    private wireEvents(cell: HTMLElement): void {
        if (cell.querySelector('.e-hyperlinkcell')) {
            /* tslint:disable-next-line */
            EventHandler.add(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick, this);
        } else {
            return;
        }
    }
}
