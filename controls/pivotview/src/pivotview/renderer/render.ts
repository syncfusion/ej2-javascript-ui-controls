import { IAxisSet, IGridValues, IValueSortSettings, IGroupSettings } from '../../base/engine';
import { PivotEngine, IFieldOptions, IFormatSettings, IMatrix2D } from '../../base/engine';
import { PivotView } from '../base/pivotview';
import { Reorder, headerRefreshed, CellSelectEventArgs, RowSelectEventArgs, PdfExportCompleteArgs, getScrollBarWidth } from '@syncfusion/ej2-grids';
import { Grid, Resize, ColumnModel, Column, ExcelExport, PdfExport, ContextMenu, ResizeArgs, Freeze } from '@syncfusion/ej2-grids';
import { PdfHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, HeaderCellInfoEventArgs, Selection, RowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, CellSelectingEventArgs, ExcelExportCompleteArgs } from '@syncfusion/ej2-grids';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, EventHandler, getElement, closest, append } from '@syncfusion/ej2-base';
import { addClass, removeClass, SanitizeHtmlHelper, select, selectAll } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { DataBoundEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { GridSettingsModel } from '../model/gridsettings-model';
import { HyperCellClickEventArgs, PivotCellSelectedEventArgs, QueryCellInfoEventArgs, ExportCompleteEventArgs } from '../../common/base/interface';
import { AggregateMenuOpenEventArgs, BeforeExportEventArgs, PivotColumn, ExcelRow } from '../../common/base/interface';
import { AggregateMenu } from '../../common/popups/aggregate-menu';
import { SummaryTypes } from '../../base/types';
import { OlapEngine, ITupInfo, IOlapFieldListOptions } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import { SelectedCellsInfo } from '../../common/popups/grouping';
import { AggregateTypes } from '../../common/base/enum';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';
import { FieldOptionsModel } from '../../model/datasourcesettings-model';

/**
 * Module to render PivotGrid control
 */
/** @hidden */
export class Render {
    /** @hidden */
    public parent: PivotView;
    /** @hidden */
    public engine: PivotEngine | OlapEngine;
    /** @hidden */
    public gridSettings: GridSettingsModel;
    /** @hidden */
    public rowStartPos: number;
    /** @hidden */
    public maxIndent: number;
    /** @hidden */
    public resColWidth: number;
    /** @hidden */
    public isOverflows: boolean;
    /** @hidden */
    public isAutoFitEnabled: boolean = false;
    /** @hidden */
    public pivotColumns: ColumnModel[] = [];
    /** @hidden */
    public indentCollection: { [key: number]: number } = {};
    private formatList: { [key: string]: string };
    private colPos: number = 0;
    private colGrandPos: number;
    private rowGrandPos: number;
    private lastSpan: number = 0;
    private aggMenu: AggregateMenu;
    private field: string;
    private fieldCaption: string;
    private lvlCollection: { [key: string]: { position: number; hasChild: boolean } } = {};
    private hierarchyCollection: { [key: string]: { lvlPosition: number; hierarchyPOs: number } } = {};
    private lvlPosCollection: { [key: number]: string } = {};
    private hierarchyPosCollection: { [key: number]: string } = {};
    private position: number = 0;
    private measurePos: number = 0;
    private maxMeasurePos: number = 0;
    private hierarchyCount: number = 0;
    private actualText: string = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private timeOutObj: any;
    /** Constructor for render module
     *
     * @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) :
            (this.parent.isAdaptive ? 140 : 200);
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.gridSettings = this.parent.gridSettings;
        this.formatList = this.getFormatList();
        this.aggMenu = new AggregateMenu(this.parent);
    }

    /** @hidden */

    public render(refreshRequired?: boolean): void {
        if (refreshRequired) {
            this.initProperties();
        }
        this.resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) :
            (this.parent.isAdaptive ? 140 : 200);
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.gridSettings = this.parent.gridSettings;
        this.formatList = this.getFormatList();
        this.parent.gridHeaderCellInfo = [];
        this.parent.gridCellCollection = {};
        this.injectGridModules(this.parent);
        this.rowStartPos = this.getRowStartPos();
        if (this.parent.grid && this.parent.grid.element && this.parent.element.querySelector('.' + cls.GRID_CLASS)) {
            this.parent.notEmpty = true;
            if (!this.engine.isEngineUpdated) {
                this.engine.headerContent = this.frameDataSource('header');
                this.engine.valueContent = this.frameDataSource('value');
            } else {
                if (this.parent.enableValueSorting) {
                    this.engine.valueContent = this.frameDataSource('value');
                }
                this.engine.isEngineUpdated = false;
            }
            this.parent.grid.setProperties({
                columns: this.frameStackedHeaders(), dataSource: ((this.parent.dataType === 'olap' && this.parent.dataSourceSettings.url !== '') ? true :
                    (this.parent.dataSourceSettings.dataSource && this.parent.engineModule.data.length > 0 &&
                    this.parent.dataSourceSettings.values.length > 0)) && !this.engine.isEmptyData ? this.engine.valueContent :
                    this.frameDataSource('value')
            }, true);
            this.parent.grid.notify('datasource-modified', {});
            if (this.parent.isScrolling) {
                this.parent.resizeInfo = {};
            }
            this.parent.grid.refreshColumns();
            if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                this.parent.groupingBarModule.setGridRowWidth();
            }
            const e: HTMLElement = this.parent.element.querySelector('.' + cls.GRID_CLASS) as HTMLElement;
            e.querySelector('colGroup').innerHTML = this.parent.grid.getHeaderContent().querySelector('colgroup').innerHTML;
            this.parent.grid.width = this.calculateGridWidth();
            if (!this.gridSettings.allowAutoResizing && this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                this.parent.groupingBarModule.refreshUI();
            }
            if (!this.parent.isScrolling) {
                this.calculateGridHeight(true);
            }
            //this.parent.isScrolling = false;
        } else {
            this.parent.element.innerHTML = '';
            this.bindGrid(this.parent, (this.engine.isEmptyData ? true : false));
            this.parent.element.appendChild(createElement('div', { id: this.parent.element.id + '_grid' }));
            this.parent.grid.isStringTemplate = true;
            this.parent.grid.appendTo('#' + this.parent.element.id + '_grid');
        }
        this.parent.grid.on(headerRefreshed, this.refreshHeader, this);
    }

    private initProperties(): void {
        this.rowStartPos = undefined;
        this.maxIndent = undefined;
        this.resColWidth = undefined;
        this.isOverflows = undefined;
        this.indentCollection = {};
        this.formatList = undefined;
        this.colPos = 0;
        this.colGrandPos = undefined;
        this.rowGrandPos = undefined;
        this.lastSpan = 0;
        this.field = undefined;
        this.fieldCaption = undefined;
        this.lvlCollection = {};
        this.hierarchyCollection = {};
        this.lvlPosCollection = {};
        this.hierarchyPosCollection = {};
        this.position = 0;
        this.measurePos = 0;
        this.maxMeasurePos = 0;
        this.hierarchyCount = 0;
        this.actualText = '';
        this.timeOutObj = undefined;
    }

    private refreshHeader(): void {
        if (this.parent.enableVirtualization) {
            const mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
            const mCont: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_VIRTUALTABLE_DIV) as HTMLElement;
            const vtr: HTMLElement = mCont.querySelector('.' + cls.VIRTUALTRACK_DIV) as HTMLElement;
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
            if (mHdr.querySelector('.' + cls.TABLE)) {
                setStyleAttribute(mHdr.querySelector('.' + cls.TABLE) as HTMLElement, {
                    transform: ((mCont.querySelector('.' + cls.TABLE) as HTMLElement).style.transform).split(',')[0] + ',' + 0 + 'px)'
                });
                const freezedCellValue: number  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    = (mHdr.querySelector('.' + cls.TABLE) as any).style.transform.split('(')[1].split(',')[0].split('px')[0];
                if (this.parent.enableRtl) {
                    (this.parent.element.querySelector('.' + cls.FREEZED_CELL) as HTMLElement).style.right
                        = Number(freezedCellValue) + 'px';
                } else {
                    (this.parent.element.querySelector('.' + cls.FREEZED_CELL) as HTMLElement).style.left
                        = Number(-freezedCellValue) + 'px';
                }
            }
            const ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.VIRTUALTABLE_DIV);
            mHdr.scrollLeft = ele.scrollLeft;
        }
    }

    /** @hidden */

    public bindGrid(parent: PivotView, isEmpty: boolean): void {
        this.injectGridModules(parent);
        this.parent.grid = new Grid({
            cssClass: this.parent.cssClass,
            frozenColumns: 1,
            frozenRows: 0,
            enableHover: false,
            dataSource: isEmpty ? this.frameEmptyData() : this.frameDataSource('value'),
            columns: isEmpty ? this.frameEmptyColumns() : this.frameStackedHeaders(),
            height: isEmpty ? 'auto' : this.calculateGridHeight(),
            width: isEmpty ? (this.gridSettings.allowAutoResizing ? this.parent.width : 400) : this.calculateGridWidth(),
            locale: parent.locale,
            enableRtl: parent.enableRtl,
            allowExcelExport: parent.allowExcelExport,
            allowPdfExport: parent.allowPdfExport,
            allowResizing: this.gridSettings.allowResizing,
            allowTextWrap: this.gridSettings.allowTextWrap,
            clipMode: this.gridSettings.clipMode,
            allowReordering: (this.parent.showGroupingBar ? false : this.gridSettings.allowReordering),
            allowSelection: this.gridSettings.allowSelection,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            contextMenuItems: this.gridSettings.contextMenuItems as any,
            selectedRowIndex: this.gridSettings.selectedRowIndex,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            beforeExcelExport: this.beforeExcelExport.bind(this),
            resizing: this.setGroupWidth.bind(this),
            resizeStop: this.onResizeStop.bind(this),
            queryCellInfo: this.queryCellInfo.bind(this),
            dataBound: this.dataBound.bind(this),
            headerCellInfo: this.headerCellInfo.bind(this),
            excelHeaderQueryCellInfo: this.excelHeaderQueryCellInfo.bind(this),
            pdfHeaderQueryCellInfo: this.pdfHeaderQueryCellInfo.bind(this),
            excelQueryCellInfo: this.excelQueryCellInfo.bind(this),
            pdfQueryCellInfo: this.pdfQueryCellInfo.bind(this),
            beforePdfExport: this.gridSettings.beforePdfExport ? this.gridSettings.beforePdfExport.bind(this) : undefined,
            pdfExportComplete: this.pdfExportComplete.bind(this),
            excelExportComplete: this.excelExportComplete.bind(this)
        });
        this.parent.grid.on('header-refreshed', this.headerRefreshed.bind(this));
        this.parent.grid.on('export-DataBound', this.excelDataBound.bind(this));
    }

    private headerRefreshed(): void {
        const mHdr: HTMLElement = this.parent.element.querySelector('.' + cls.MOVABLEHEADER_DIV) as HTMLElement;
        if (this.parent.lastGridSettings && Object.keys(this.parent.lastGridSettings).indexOf('allowResizing') > -1 && !isNullOrUndefined(mHdr) && mHdr.querySelector('.' + cls.TABLE) &&
            this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.lastGridSettings = undefined;
            this.parent.groupingBarModule.setGridRowWidth();
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private beforeExcelExport(args: any): void {
        if (!isNullOrUndefined(args.gridObject.columns) && !isNullOrUndefined(this.parent.pivotColumns)) {
            args.gridObject.columns[args.gridObject.columns.length - 1].width =
                this.parent.pivotColumns[this.parent.pivotColumns.length - 1].width;
        }
        this.parent.trigger(events.beforeExcelExport, args);
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

    private pdfExportComplete(args: PdfExportCompleteArgs): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.parent.lastColumn !== undefined && (this.parent.lastColumn as any).width !== 'auto') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.parent.lastColumn as any).width = 'auto';
            this.parent.lastColumn = undefined;
        }
        const exportCompleteEventArgs: ExportCompleteEventArgs = {
            type: 'PDF',
            promise: args.promise
        };
        this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
    }

    private excelExportComplete(args: ExcelExportCompleteArgs): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.parent.lastColumn !== undefined && (this.parent.lastColumn as any).width !== 'auto') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.parent.lastColumn as any).width = 'auto';
            this.parent.lastColumn = undefined;
        }
        const exportCompleteEventArgs: ExportCompleteEventArgs = {
            type: 'Excel/CSV',
            promise: args.promise
        };
        this.parent.trigger(events.exportComplete, exportCompleteEventArgs);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private dataBound(args: DataBoundEventArgs): void {
        if (this.parent.cellTemplate) {
            for (const cell of this.parent.gridHeaderCellInfo) {
                if (this.parent.cellTemplate) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const element: any = this.parent.getCellTemplate()(
                        cell, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate', null, null, cell.targetCell);
                    if (element && element !== '' && element.length > 0) {
                        if (this.parent.enableHtmlSanitizer) {
                            if ((<{ isVue?: boolean }>this.parent).isVue || (<{ isVue3?: boolean }>this.parent).isVue3) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                append(SanitizeHtmlHelper.sanitize(element) as any, cell.targetCell);
                            } else {
                                this.parent.appendHtml(cell.targetCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                            }
                        } else {
                            if ((<{ isVue?: boolean }>this.parent).isVue || (<{ isVue3?: boolean }>this.parent).isVue3) {
                                append(element, cell.targetCell);
                            } else {
                                this.parent.appendHtml(cell.targetCell, element[0].outerHTML);
                            }
                        }
                    }
                }
            }
            this.parent.gridHeaderCellInfo = [];
        }
        // if ((this.parent.dataSourceSettings.valueAxis === 'row' ||
        //     !(this.parent.dataType === 'pivot' && this.parent.dataSourceSettings.valueAxis === 'column' && this.parent.engineModule && !this.parent.engineModule.isLastHeaderHasMeasures)) &&
        //     this.parent.element.querySelector('.e-firstcell') && !(this.parent.dataSourceSettings.values.length === 1 && this.parent.dataSourceSettings.columns.length > 0)) {
        //     if (this.parent.enableRtl) {
        //         (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderRight = 'none';
        //     } else {
        //         (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderLeft = 'none';
        //     }
        // }
        if (this.parent.notEmpty) {
            this.calculateGridHeight(true);
        }
        this.parent.isScrolling = false;
        this.setFocusOnLastCell();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!isNullOrUndefined((this.parent as any).renderReactTemplates)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.parent as any).renderReactTemplates();
        }
        if (this.parent.isInitial) {
            this.parent.isInitial = false;
            this.parent.refreshData();
            if (this.parent.enableVirtualization) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (this.parent as any).onContentReady();
            }
        }
        this.parent.notify(events.contentReady, {});
    }

    private setFocusOnLastCell(): void {
        if (this.parent.keyboardModule && this.parent.keyboardModule.event &&
            (this.parent.keyboardModule.event.target as HTMLElement).nodeName === 'TD') {
            const gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            gridFocus.setFocusedElement(this.parent.keyboardModule.event.target as HTMLElement);
            gridFocus.focus(this.parent.keyboardModule.event);
            addClass([(this.parent.keyboardModule.event.target as HTMLElement)], ['e-focused', 'e-focus']);
            (this.parent.keyboardModule.event.target as HTMLElement).setAttribute('tabindex', '0');
            this.parent.keyboardModule.event = undefined;
        }
    }
    private getCellElement(target: Element): Element {
        let currentElement: Element = closest(target, 'td');
        if (isNullOrUndefined(currentElement)) {
            currentElement = closest(target, 'th');
        }
        return currentElement;
    }
    private contextMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (args.element && this.parent.cssClass) {
            addClass([args.element.parentElement], this.parent.cssClass);
        }
        for (const item of args.items) {
            const cellTarget: Element = this.parent.lastCellClicked ? this.parent.lastCellClicked :
                (this.parent.isAdaptive ? (args.event.target as Element) : this.parent.lastCellClicked);
            const elem: Element = this.getCellElement(cellTarget);
            let bool: boolean;
            let isGroupElement: boolean;
            if (!elem || (elem && Number(elem.getAttribute('index')) === 0 && Number(elem.getAttribute('data-colindex')) === 0)) {
                args.cancel = true;
                return;
            }
            if (elem.classList.contains('e-valuesheader') || elem.classList.contains('e-stot')) {
                bool = true;
            }
            if (this.parent.allowGrouping && this.parent.groupingModule && !this.validateField(elem as HTMLElement)) {
                isGroupElement = true;
            }
            const rowIndex: number = Number(elem.getAttribute('index'));
            const colIndex: number = Number(elem.getAttribute('data-colindex'));
            const pivotValue1: IAxisSet = this.parent.pivotValues[rowIndex as number][colIndex as number] as IAxisSet;
            const selectedID: string = item.id;
            switch (selectedID) {
            case this.parent.element.id + '_expand':
                if (elem.querySelectorAll('.' + cls.EXPAND).length > 0) {
                    if (selectAll('#' + this.parent.element.id + '_expand', args.element)) {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.add(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_expand', args.element).classList.contains(cls.MENU_DISABLE)) {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_expand', args.element).classList.contains(cls.MENU_HIDE)) {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.remove(cls.MENU_HIDE);
                        select('#' + this.parent.element.id + '_collapse', args.element).classList.remove(cls.MENU_HIDE);
                    }
                } else {
                    if (bool) {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.add(cls.MENU_HIDE);
                    } else {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.add(cls.MENU_DISABLE);
                    }
                }
                break;
            case this.parent.element.id + '_collapse':
                if (elem.querySelectorAll('.' + cls.COLLAPSE).length > 0) {
                    if (select('#' + this.parent.element.id + '_expand', args.element)) {
                        select('#' + this.parent.element.id + '_expand', args.element).classList.add(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_collapse', args.element).classList.contains(cls.MENU_DISABLE)) {
                        select('#' + this.parent.element.id + '_collapse', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_collapse', args.element).classList.contains(cls.MENU_HIDE)) {
                        select('#' + this.parent.element.id + '_collapse', args.element).classList.remove(cls.MENU_HIDE);
                        select('#' + this.parent.element.id + '_expand', args.element).classList.remove(cls.MENU_HIDE);
                    }
                } else {
                    if (bool) {
                        select('#' + this.parent.element.id + '_collapse', args.element).classList.add(cls.MENU_HIDE);
                    } else {
                        select('#' + this.parent.element.id + '_collapse', args.element).classList.add(cls.MENU_DISABLE);
                    }
                }
                break;
            case this.parent.element.id + '_custom_group':
                if (!isGroupElement && args.items.length === 2) {
                    args.cancel = true;
                }
                if (selectAll('#' + this.parent.element.id + '_custom_group', args.element)) {
                    addClass([select('#' + this.parent.element.id + '_custom_group', args.element)], cls.MENU_HIDE);
                }
                if (isGroupElement) {
                    if (selectAll('#' + this.parent.element.id + '_custom_group', args.element)) {
                        removeClass([select('#' + this.parent.element.id + '_custom_group', args.element)], cls.MENU_HIDE);
                    }
                }
                break;
            case this.parent.element.id + '_custom_ungroup':
                if (selectAll('#' + this.parent.element.id + '_custom_ungroup', args.element)) {
                    addClass([select('#' + this.parent.element.id + '_custom_ungroup', args.element)], cls.MENU_HIDE);
                }
                if (isGroupElement) {
                    let isUngroupOption: boolean = false;
                    const fieldName: string = elem.getAttribute('fieldname');
                    let groupField: IGroupSettings =
                        PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.groupSettings) as IGroupSettings;
                    if (groupField && groupField.type === 'Custom' || (this.parent.engineModule.fieldList[fieldName as string].isCustomField && fieldName.indexOf('_custom_group') > -1)) {
                        groupField = PivotUtil.getFieldByName(fieldName.replace('_custom_group', ''), this.parent.dataSourceSettings.groupSettings) as IGroupSettings;
                        if (groupField) {
                            const cell: IAxisSet = (this.parent.engineModule.pivotValues[Number(elem.getAttribute('index'))][Number(elem.getAttribute('data-colindex'))] as IAxisSet);
                            const selectedCellsInfo: SelectedCellsInfo[] =
                                this.parent.groupingModule.getSelectedCells(cell.axis, fieldName, cell.actualText.toString());
                            selectedCellsInfo.push({ axis: cell.axis, fieldName: fieldName, name: cell.actualText.toString(),
                                cellInfo: cell });
                            const selectedOptions: string[] = this.parent.groupingModule.getSelectedOptions(selectedCellsInfo);
                            for (const customGroup of groupField.customGroups) {
                                if (selectedOptions.indexOf(customGroup.groupName) > -1) {
                                    isUngroupOption = true;
                                    break;
                                }
                            }
                        }
                    } else if (groupField && (groupField.type === 'Date' || groupField.type === 'Number') ||
                        (this.parent.engineModule.fieldList[fieldName as string].isCustomField && fieldName.indexOf('_date_group') > -1)) {
                        isUngroupOption = true;
                    }
                    if (selectAll('#' + this.parent.element.id + '_custom_ungroup', args.element) && isUngroupOption) {
                        removeClass([select('#' + this.parent.element.id + '_custom_ungroup', args.element)], cls.MENU_HIDE);
                    }
                }
                break;
            case this.parent.element.id + '_drillthrough':
                if (!this.parent.allowDrillThrough) {
                    if (select('#' + this.parent.element.id + '_drillthrough', args.element)) {
                        select('#' + this.parent.element.id + '_drillthrough', args.element).classList.add(cls.MENU_DISABLE);
                    }
                } else if (!(elem.classList.contains('e-summary'))) {
                    if ((elem as HTMLElement).innerText === '') {
                        if (select('#' + this.parent.element.id + '_drillthrough', args.element)) {
                            select('#' + this.parent.element.id + '_drillthrough', args.element).classList.add(cls.MENU_DISABLE);
                        }
                    }
                } else {
                    if (select('#' + this.parent.element.id + '_drillthrough', args.element).classList.contains(cls.MENU_DISABLE)) {
                        select('#' + this.parent.element.id + '_drillthrough', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                }
                break;
            case this.parent.element.id + '_sortasc':
                if (!this.parent.enableValueSorting) {
                    if (select('#' + this.parent.element.id + '_sortasc', args.element)) {
                        select('#' + this.parent.element.id + '_sortasc', args.element).classList.add(cls.MENU_DISABLE);
                    }
                } else if (elem.querySelectorAll('.e-icon-descending').length > 0) {
                    if (select('#' + this.parent.element.id + '_sortdesc', args.element)) {
                        select('#' + this.parent.element.id + '_sortdesc', args.element).classList.add(cls.MENU_DISABLE);
                    } else {
                        select('#' + this.parent.element.id + '_sortdesc', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_sortasc', args.element).classList.contains(cls.MENU_DISABLE)) {
                        select('#' + this.parent.element.id + '_sortasc', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                } else if (select('#' + this.parent.element.id + '_sortdesc', args.element).classList.contains(cls.MENU_DISABLE)) {
                    select('#' + this.parent.element.id + '_sortdesc', args.element).classList.remove(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_sortdesc':
                if (!this.parent.enableValueSorting) {
                    if (select('#' + this.parent.element.id + '_sortdesc', args.element)) {
                        select('#' + this.parent.element.id + '_sortdesc', args.element).classList.add(cls.MENU_DISABLE);
                    }
                } else if (elem.querySelectorAll('.e-icon-ascending').length > 0) {
                    if (select('#' + this.parent.element.id + '_sortasc', args.element)) {
                        select('#' + this.parent.element.id + '_sortasc', args.element).classList.add(cls.MENU_DISABLE);
                    } else {
                        select('#' + this.parent.element.id + '_sortasc', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                    if (select('#' + this.parent.element.id + '_sortdesc', args.element).classList.contains(cls.MENU_DISABLE)) {
                        select('#' + this.parent.element.id + '_sortdesc', args.element).classList.remove(cls.MENU_DISABLE);
                    }
                } else if (select('#' + this.parent.element.id + '_sortasc', args.element).classList.contains(cls.MENU_DISABLE)) {
                    select('#' + this.parent.element.id + '_sortasc', args.element).classList.remove(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_CalculatedField':
                if (!this.parent.allowCalculatedField) {
                    select('#' + this.parent.element.id + '_CalculatedField', args.element).classList.add(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_pdf':
                if (!this.parent.allowPdfExport) {
                    select('#' + this.parent.element.id + '_pdf', args.element).classList.add(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_excel':
                if (!this.parent.allowExcelExport) {
                    select('#' + this.parent.element.id + '_excel', args.element).classList.add(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_csv':
                if (!this.parent.allowExcelExport) {
                    select('#' + this.parent.element.id + '_csv', args.element).classList.add(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_exporting':
                if ((!this.parent.allowExcelExport) && (!this.parent.allowPdfExport)) {
                    select('#' + this.parent.element.id + '_exporting', args.element).classList.add(cls.MENU_DISABLE);
                }
                break;
            case this.parent.element.id + '_aggregate':
                if ((select('#' + this.parent.element.id + '_aggregate', args.element)) &&
                    (!select('#' + this.parent.element.id + '_aggregate', args.element).classList.contains(cls.MENU_DISABLE))) {
                    select('#' + this.parent.element.id + '_aggregate', args.element).classList.add(cls.MENU_DISABLE);
                }
                if ((elem.classList.contains('e-valuesheader') || elem.classList.contains('e-valuescontent') ||
                    (elem.classList.contains('e-stot') && elem.classList.contains('e-rowsheader'))) && this.parent.dataType !== 'olap') {
                    let fieldType: string;
                    if (!((elem as HTMLElement).innerText === '')) {
                        fieldType = this.parent.engineModule.fieldList[pivotValue1.actualText.toString()].type;
                    }
                    const eventArgs: AggregateMenuOpenEventArgs = {
                        cancel: false, fieldName: pivotValue1.actualText.toString(),
                        aggregateTypes: [...this.getMenuItem(fieldType)],
                        displayMenuCount: 7
                    };
                    this.parent.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
                        if (!observedArgs.cancel && !((elem as HTMLElement).innerText === '')) {
                            const menuItem: MenuItemModel[] = [];
                            const checkDuplicates: AggregateTypes[] = [];
                            for (let i: number = 0; i < observedArgs.aggregateTypes.length; i++) {
                                const key: AggregateTypes = observedArgs.aggregateTypes[i as number] as AggregateTypes;
                                if (fieldType !== 'number') {
                                    if ((['Count', 'DistinctCount'].indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                                        menuItem.push(
                                            { text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + '_Agg' + key });
                                        checkDuplicates.push(key);
                                    }
                                } else {
                                    if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (checkDuplicates.indexOf(key) < 0)) {
                                        menuItem.push({ text: this.parent.localeObj.getConstant(key), id: this.parent.element.id + '_Agg' + key });
                                        checkDuplicates.push(key);
                                    }
                                }
                            }
                            if (menuItem.length > observedArgs.displayMenuCount) {
                                menuItem.splice(observedArgs.displayMenuCount);
                                menuItem.push(
                                    {
                                        text: this.parent.localeObj.getConstant('MoreOption'),
                                        id: this.parent.element.id + '_Agg' + 'MoreOption'
                                    });
                            }
                            if (menuItem && menuItem.length >= 1) {
                                item.items = menuItem;
                                select('#' + this.parent.element.id + '_aggregate', args.element).classList.remove(cls.MENU_DISABLE);
                            }
                        }
                    });
                }
                break;
            }
        }
        this.parent.trigger(events.contextMenuOpen, args);
    }

    private getMenuItem(isStringField: string): AggregateTypes[] {
        const menuItems: AggregateTypes[] = [];
        for (let i: number = 0; i < this.parent.aggregateTypes.length; i++) {
            const key: AggregateTypes = this.parent.aggregateTypes[i as number] as AggregateTypes;
            if (isStringField !== 'string') {
                if ((this.parent.getAllSummaryType().indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            } else {
                if ((['Count', 'DistinctCount'].indexOf(key) > -1) && (menuItems.indexOf(key) === -1)) {
                    menuItems.push(key);
                }
            }
        }
        return menuItems;
    }

    private contextMenuClick(args: MenuEventArgs): void {
        // this.parent.gridSettings.contextMenuClick();
        const target: Element = this.parent.lastCellClicked;
        const selected: string = args.item.id;
        const event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let exportArgs: BeforeExportEventArgs = {
        };
        const ele: Element = this.getCellElement(target);
        const rowIndx: number = Number(ele.getAttribute('index'));
        const colIndx: number = Number(ele.getAttribute('data-colindex'));
        const pivotValue: IAxisSet = this.parent.pivotValues[rowIndx as number][colIndx as number] as IAxisSet;
        let aggregateType: string;
        if (args.item.id.indexOf(this.parent.element.id + '_Agg') > -1) {
            this.field = this.parent.engineModule.fieldList[pivotValue.actualText.toString()].id;
            this.fieldCaption = this.parent.engineModule.fieldList[pivotValue.actualText.toString()].caption;
            aggregateType = args.item.id.split('_Agg')[1];
        }
        switch (selected) {
        case this.parent.element.id + '_pdf':
            exportArgs = {
                pdfDoc: undefined,
                isBlob: false,
                isMultipleExport: false,
                pdfExportProperties: { fileName: 'Export.pdf' }
            };
            this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                this.parent.pdfExport(
                    observedArgs.pdfExportProperties, observedArgs.isMultipleExport, observedArgs.pdfDoc, observedArgs.isBlob
                );
            });
            break;
        case this.parent.element.id + '_excel':
            exportArgs = {
                isBlob: false,
                isMultipleExport: false,
                workbook: undefined,
                excelExportProperties: { fileName: 'Export.xlsx' }
            };
            this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                this.parent.excelExport(
                    observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob
                );
            });
            break;
        case this.parent.element.id + '_csv':
            exportArgs = {
                isBlob: false,
                workbook: undefined,
                isMultipleExport: false,
                excelExportProperties: { fileName: 'Export.csv' }
            };
            this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                this.parent.csvExport(
                    observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob
                );
            });
            break;
        case this.parent.element.id + '_drillthrough_menu':
            ele.dispatchEvent(event);
            break;
        case this.parent.element.id + '_sortasc':
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
        case this.parent.element.id + '_sortdesc':
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
        case this.parent.element.id + '_expand':
            if (ele.querySelectorAll('.' + cls.EXPAND)) {
                const exp: Element = ele.querySelectorAll('.' + cls.EXPAND)[0] as Element;
                this.parent.onDrill(exp);
            }
            break;
        case this.parent.element.id + '_collapse':
            if (ele.querySelectorAll('.' + cls.COLLAPSE)) {
                const colp: Element = ele.querySelectorAll('.' + cls.COLLAPSE)[0] as Element;
                this.parent.onDrill(colp);
            }
            break;
        case this.parent.element.id + '_CalculatedField':
            this.parent.calculatedFieldModule.createCalculatedFieldDialog();
            break;
        case this.parent.element.id + '_AggMoreOption':
        case this.parent.element.id + '_AggDifferenceFrom':
        case this.parent.element.id + '_AggPercentageOfDifferenceFrom':
        case this.parent.element.id + '_AggPercentageOfParentTotal':
            ele.setAttribute('id', this.field);
            ele.setAttribute('data-caption', this.fieldCaption);
            ele.setAttribute('data-field', this.field);
            ele.setAttribute('data-type', this.engine.fieldList[pivotValue.actualText.toString()].aggregateType);
            ele.setAttribute('data-basefield', this.engine.fieldList[pivotValue.actualText.toString()].baseField);
            ele.setAttribute('data-baseItem', this.engine.fieldList[pivotValue.actualText.toString()].baseItem);
            this.aggMenu.createValueSettingsDialog(ele as HTMLElement, this.parent.element, aggregateType);
            break;
        case this.parent.element.id + '_Agg' + aggregateType:
            this.updateAggregate(aggregateType);
            break;
        case this.parent.element.id + '_custom_group':
        case this.parent.element.id + '_custom_ungroup':
            if (this.parent.groupingModule) {
                const args: { target: HTMLElement, option: string, parentElement: HTMLElement } = {
                    target: ele as HTMLElement,
                    option: selected,
                    parentElement: this.parent.element
                };
                this.parent.notify(events.initGrouping, args);
                this.parent.grid.contextMenuModule.contextMenu.close();
            }
            break;
        }
        this.parent.trigger(events.contextMenuClick, args);
    }

    private validateColumnTotalcell(columnIndex: number): boolean {
        const headerPosKeys: string[] = Object.keys(this.engine.headerContent);
        const keysLength: number = headerPosKeys.length;
        let sumLock: boolean = false;
        let fieldName: string = '';
        for (let pos: number = keysLength - 1; pos >= 0; pos--) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cell: IAxisSet = this.engine.headerContent[headerPosKeys[pos as number] as any][columnIndex as number];
            if (cell) {
                sumLock = sumLock && fieldName !== '' ? fieldName === cell.valueSort.axis : false;
                fieldName = cell.valueSort.axis ? cell.valueSort.axis.toString() : '';
                if (cell.type === 'sum') {
                    sumLock = true;
                }
                if (sumLock && cell.members && cell.members.length > 0) {
                    return true;
                }
            } else {
                return false;
            }
        }
        return false;
    }

    private validateField(target: HTMLElement): boolean {
        let isValueField: boolean = false;
        if (target.classList.contains('e-stot') || target.classList.contains('e-gtot') || target.classList.contains('e-valuescontent') || target.classList.contains('e-valuesheader')) {
            isValueField = true;
        } else {
            let fieldName: string = target.getAttribute('fieldName');
            if (!fieldName || fieldName === '') {
                const rowIndx: number = Number(target.getAttribute('index'));
                const colIndx: number = Number(target.getAttribute('data-colindex'));
                fieldName = (this.engine.pivotValues[rowIndx as number][colIndx as number] as IAxisSet).actualText as string;
            }
            const valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
            for (let valueCnt: number = 0; valueCnt < valuefields.length; valueCnt++) {
                if (this.parent.dataSourceSettings.values[valueCnt as number].name === fieldName) {
                    isValueField = true;
                    break;
                }
            }
        }
        return isValueField;
    }

    private updateAggregate(aggregate: string): void {
        if (this.parent.getAllSummaryType().indexOf(aggregate as AggregateTypes) > -1) {
            const valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
            for (let valueCnt: number = 0; valueCnt < this.parent.dataSourceSettings.values.length; valueCnt++) {
                if (this.parent.dataSourceSettings.values[valueCnt as number].name === this.field) {
                    const dataSourceItem: IFieldOptions = (<{ [key: string]: IFieldOptions }>valuefields[valueCnt as number]);
                    dataSourceItem.type = aggregate as SummaryTypes;
                }
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
        this.parent.grid.clipMode = this.gridSettings.clipMode;
        this.parent.grid.allowTextWrap = this.gridSettings.allowTextWrap;
        this.parent.grid.allowReordering = (this.parent.showGroupingBar ? false : this.gridSettings.allowReordering);
        this.parent.grid.allowSelection = this.gridSettings.allowSelection;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.parent.grid.contextMenuItems = this.gridSettings.contextMenuItems as any;
        this.parent.grid.selectedRowIndex = this.gridSettings.selectedRowIndex;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.parent.grid.selectionSettings = this.gridSettings.selectionSettings as any;
        this.parent.grid.textWrapSettings = this.gridSettings.textWrapSettings;
        this.parent.grid.printMode = this.gridSettings.printMode;
        this.parent.grid.rowHeight = this.gridSettings.rowHeight;
        this.parent.grid.gridLines = this.gridSettings.gridLines;
        if (this.parent.lastGridSettings) {
            const keys: string[] = Object.keys(this.parent.lastGridSettings);
            if (keys.indexOf('height') > -1) {
                this.parent.grid.height = this.gridSettings.height;
            }
            if (keys.indexOf('width') > -1) {
                this.parent.grid.width = this.gridSettings.width;
            }
            this.updatePivotColumns();
            if (keys.indexOf('allowTextWrap') > -1 || keys.indexOf('clipMode') > -1) {
                this.parent.layoutRefresh();
            }
        }
        this.clearColumnSelection();
    }

    private updatePivotColumns(): void {
        const keys: string[] = Object.keys(this.parent.lastGridSettings);
        for (let colPos: number = 0; colPos < this.parent.pivotColumns.length; colPos++) {
            const pivotColumn: PivotColumn = this.parent.pivotColumns[colPos as number];
            for (let keyPos: number = 0; keyPos < keys.length; keyPos++) {
                const key: string = keys[keyPos as number];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!isNullOrUndefined((this.parent.pivotColumns[colPos as number] as any)[key as string])) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (pivotColumn as any)[key as string] = (this.parent.lastGridSettings as any)[key as string];
                }
            }
        }
        this.parent.fillGridColumns(this.parent.grid.columns as ColumnModel[]);
    }

    private clearColumnSelection(): void {
        removeClass(this.parent.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
    }

    private appendValueSortIcon(cell: IAxisSet, tCell: HTMLElement, rCnt: number, cCnt: number, column: Column): HTMLElement {
        if (this.parent.enableValueSorting && this.parent.dataType === 'pivot') {
            const vSort: IValueSortSettings = this.parent.dataSourceSettings.valueSortSettings;
            const len: number = (cell.type === 'grand sum' &&
                this.parent.dataSourceSettings.values.length === 1 && !this.parent.dataSourceSettings.alwaysShowValueHeader) ? 0 :
                (this.parent.dataSourceSettings.values.length > 1 || this.parent.dataSourceSettings.alwaysShowValueHeader) ?
                    (this.parent.engineModule.headerContent.length - 1) :
                    this.parent.dataSourceSettings.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
            const lock: boolean = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
            if (vSort !== undefined && lock && (rCnt === len || (rCnt + 1) === len && cell.level > -1 &&
                this.parent.engineModule.headerContent[(rCnt + 1)][cCnt as number]
                && this.parent.engineModule.headerContent[(rCnt + 1)][cCnt as number].level === -1)
                && this.parent.dataSourceSettings.valueAxis === 'column') {
                tCell.querySelector('div div').appendChild(createElement('span', {
                    className: (vSort.sortOrder === 'Descending' ?
                        'e-icon-descending e-icons e-descending e-sortfilterdiv e-value-sort-icon' :
                        'e-icon-ascending e-icons e-ascending e-sortfilterdiv e-value-sort-icon') + (cell.hasChild ? ' e-value-sort-align' : ''),
                    styles: column.headerTextAlign === 'Right' ? 'float : left' : ''
                }));
            }
            // return tCell;
        }
        return tCell;
    }

    private onResizeStop(args: ResizeArgs): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const column: string = args.column.field === '0.formattedText' ? '0.formattedText' : (args.column.customAttributes as any).cell.valueSort.levelName;
        this.parent.resizeInfo[column as string] = Number(args.column.width.toString().split('px')[0]);
        if (this.parent.enableVirtualization && args.column.field === '0.formattedText') {
            if (this.parent.dataSourceSettings.values.length > 1
                && !isNullOrUndefined((this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).columns)) {
                const gridColumns: string[] | ColumnModel[] | Column[] =
                    (this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).columns;
                (gridColumns[gridColumns.length - 1] as ColumnModel).minWidth = this.parent.gridSettings.columnWidth;
            } else {
                (this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).minWidth =
                    this.parent.gridSettings.columnWidth;
            }
            this.parent.layoutRefresh();
        }
        this.setGroupWidth(args);
        this.calculateGridHeight(true);
        this.parent.grid.hideScroll();
    }

    private setGroupWidth(args: ResizeArgs): void {
        if (this.parent.enableVirtualization && args.column.field === '0.formattedText') {
            if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS) && Number(args.column.width.toString().split('px')[0]) < 250) {
                args.cancel = true;
            }
            // else {
            //     (this.parent.element.querySelector('.e-frozenscrollbar') as HTMLElement).style.width = args.column.width.toString().split('px')[0] + 'px';
            // }
        }
        if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
            if ((this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth < 245 && !this.parent.firstColWidth) {
                args.cancel = true;
                const gridColumn: Column[] = this.parent.grid.columns as Column[];
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = this.resColWidth;
                }
                this.parent.element.querySelector('.' + cls.HEADERCONTENT).querySelector('col').style.width = (this.resColWidth + 'px');
                this.parent.element.querySelector('.' + cls.CONTENT_CLASS).querySelector('col').style.width = (this.resColWidth + 'px');
            }
            (this.parent.element.querySelector('.e-group-rows') as HTMLElement).style.height = 'auto';
            (this.parent.element.querySelector('.e-group-values') as HTMLElement).style.width =
                (this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth + 'px';
            const firstRowHeight: number = (this.parent.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight;
            (this.parent.element.querySelector('.e-group-rows') as HTMLElement).style.height = firstRowHeight + 'px';
        }
        if (args.cancel) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const column: string = args.column.field === '0.formattedText' ? '0.formattedText' : (args.column.customAttributes as any).cell.valueSort.levelName;
            this.parent.resizeInfo[column as string] = Number(args.column.width.toString().split('px')[0]);
            if (this.parent.enableVirtualization) {
                this.parent.layoutRefresh();
            }
        }
        if (this.parent.enableVirtualization) {
            this.parent.resizedValue = (args.cancel || args.column.field !== '0.formattedText') ? this.parent.resizedValue : Number(args.column.width.toString().split('px')[0]);
        }
        this.parent.trigger(args.e.type === 'touchend' || args.e.type === 'mouseup' ? events.resizeStop : events.resizing, args);
    }

    /** @hidden */

    public selected(): void {
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.onSelect.bind(this), 300);
    }

    private onSelect(): void {
        const pivotArgs: PivotCellSelectedEventArgs = { selectedCellsInfo: [], pivotValues: this.parent.pivotValues, currentCell: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const selectedElements: any = this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR);
        for (const element of selectedElements) {
            const colIndex: number = Number(element.getAttribute('data-colindex'));
            const rowIndex: number = Number(element.getAttribute('index'));
            const cell: IAxisSet = (this.engine.pivotValues[rowIndex as number][colIndex as number] as IAxisSet);
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
        if (tCell && (this.parent.notEmpty) && this.engine.headerContent) {
            const customClass: string = this.parent.hyperlinkSettings.cssClass;
            let cell: IAxisSet = (args.data as IGridValues)[0] as IAxisSet;
            const isRowFieldsAvail: boolean = cell.valueSort && cell.valueSort.levelName === (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row' &&
                this.parent.localeObj.getConstant('grandTotal') + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText));
            tCell.setAttribute('index', cell.rowIndex ? cell.rowIndex.toString() : '0');
            if (tCell.getAttribute('data-colindex') === '0') {
                if (this.parent.dataType === 'pivot') {
                    const isValueCell: boolean = cell.type && cell.type === 'value';
                    tCell.innerText = '';
                    const levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                    const memberPos: number = cell.actualText ?
                        cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                    const levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                        (memberPos ? memberPos - 1 : memberPos);
                    let level: number = levelPosition ? (levelPosition - 1) : 0;
                    level = cell.isSum ? level - 1 : level;
                    do {
                        if (level > 0) {
                            tCell.appendChild(createElement('span', {
                                className: level === 0 ? '' : cls.NEXTSPAN
                            }));
                        }
                        level--;
                    } while (level > -1);
                    level = levelPosition ? (levelPosition - 1) : 0;
                    this.lastSpan = levelPosition ? this.lastSpan : 0;
                    if (!cell.hasChild && (!isValueCell ? level : 0) > 0) {
                        tCell.appendChild(createElement('span', {
                            className: cls.LASTSPAN
                        }));
                    }
                    let fieldName: string;
                    if ((this.parent.dataSourceSettings.rows.length > 0 &&
                        (cell.valueSort ? Object.keys(cell.valueSort).length > 0 : true))) {
                        if (isValueCell) {
                            for (const field of this.parent.dataSourceSettings.values) {
                                const name: string = field.caption ? field.caption : field.name;
                                if (levelName.indexOf(name) > -1) {
                                    fieldName = field.name;
                                    break;
                                }
                            }
                        } else {
                            fieldName = cell.level > -1 && this.parent.dataSourceSettings.rows[cell.level] ?
                                this.parent.dataSourceSettings.rows[cell.level].name : '';
                        }
                        tCell.setAttribute('fieldname', fieldName);
                    }
                } else {
                    tCell = this.onOlapRowCellBoundEvent(tCell, cell);
                }
                let localizedText: string = cell.formattedText;
                if (cell.type) {
                    if (cell.type === 'grand sum') {
                        this.rowGrandPos = cell.rowIndex;
                        tCell.classList.add('e-gtot');
                        const values: FieldOptionsModel[] = this.parent.dataSourceSettings.values;
                        localizedText = isNullOrUndefined(cell.valueSort.axis) ? (this.parent.dataSourceSettings.rows.length === 0 && values.length === 1 && this.parent.dataSourceSettings.valueAxis === 'row') ?
                            this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values[values.length - 1].type) + ' ' +
                            this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values[values.length - 1].caption) ? values[values.length - 1].caption : values[values.length - 1].name) :
                            this.parent.localeObj.getConstant('grandTotal') : cell.formattedText;
                    } else if (cell.valueSort.levelName === (this.parent.localeObj.getConstant('grandTotal') +
                        (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText))) {
                        tCell.classList.add('e-gtot');
                        localizedText = isRowFieldsAvail ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cell.actualText].aggregateType) + ' '
                            + this.parent.localeObj.getConstant('of') + ' ' + cell.formattedText : localizedText;
                    } else if (cell.type === 'sum' && cell.memberType !== 3) {
                        localizedText = cell.formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total');
                    } else {
                        tCell.classList.add('e-stot');
                    }
                }
                tCell.classList.add(cls.ROWSHEADER);
                if (cell.hasChild === true && !cell.isNamedSet) {
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
                    innerHTML: (this.parent.isRowCellHyperlink || cell.enableHyperlink ? '<a  data-url="' + localizedText + '" class="e-hyperlinkcell ' + customClass + '">' + localizedText + '</a>' : localizedText)
                }));
                const vSort: IValueSortSettings = this.parent.pivotView.dataSourceSettings.valueSortSettings;
                if (this.parent.enableValueSorting) {
                    if (vSort && vSort.headerText && this.parent.dataSourceSettings.valueAxis === 'row' &&
                        this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] &&
                        (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName) {
                        if ((this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName
                            === vSort.headerText) {
                            tCell.appendChild(createElement('span', {
                                className: (vSort.sortOrder === 'Descending' ?
                                    'e-icon-descending e-icons e-descending e-sortfilterdiv e-value-sort-icon' :
                                    'e-icon-ascending e-icons e-ascending e-sortfilterdiv e-value-sort-icon') + (cell.hasChild ? ' e-value-sort-align' : ''),
                                styles: tCell.style.textAlign === 'right' ? 'float: left' : ''
                            }));
                        }
                    }
                }
            } else {
                const innerText: string = tCell.innerText;
                tCell.innerText = '';
                tCell.classList.add(cls.VALUESCONTENT);
                cell = (args.data as IGridValues)[Number(tCell.getAttribute('data-colindex'))] as IAxisSet;
                cell = isNullOrUndefined(cell) ? (args.column.customAttributes.cell as IAxisSet) : cell;
                cell.isGrandSum = isRowFieldsAvail ? true : cell.isGrandSum;
                if (cell.isSum) {
                    tCell.classList.add(cls.SUMMARY);
                }
                const isGrandSum: boolean = (isNullOrUndefined(cell.isGrandSum) && (!isNullOrUndefined(this.parent.olapEngineModule) && this.parent.olapEngineModule.olapValueAxis === 'column') && this.parent.dataType === 'olap' &&
                    ((this.colGrandPos - this.parent.dataSourceSettings.values.length) < Number(tCell.getAttribute('data-colindex'))));
                if (cell.isGrandSum || (isGrandSum || this.colGrandPos === Number(tCell.getAttribute('data-colindex'))) || this.rowGrandPos === Number(tCell.getAttribute('index'))) {
                    tCell.classList.add('e-gtot');
                } else if (this.parent.dataType === 'olap' ? cell.isSum : this.validateColumnTotalcell(cell.colIndex)) {
                    tCell.classList.add('e-colstot');
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
                if (this.parent.gridSettings.allowReordering && !this.parent.showGroupingBar) {
                    tCell.setAttribute('data-colindex', args.column.customAttributes ? (args.column.customAttributes.cell as IAxisSet).colIndex.toString() : args.column.index.toString());
                }
            }
            if (this.parent.cellTemplate) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const element: any = this.parent.getCellTemplate()(
                    { targetCell: tCell, cellInfo: cell }, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate', null, null, tCell);
                if (element && element !== '' && element.length > 0) {
                    if (this.parent.enableHtmlSanitizer) {
                        if ((<{ isVue?: boolean }>this.parent).isVue || (<{ isVue3?: boolean }>this.parent).isVue3) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            append(SanitizeHtmlHelper.sanitize(element) as any, tCell);
                        } else {
                            this.parent.appendHtml(tCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                        }
                    } else {
                        if ((<{ isVue?: boolean }>this.parent).isVue || (<{ isVue3?: boolean }>this.parent).isVue3) {
                            append(element, tCell);
                        } else {
                            this.parent.appendHtml(tCell, element[0].outerHTML);
                        }
                    }
                }
            }
            this.unWireEvents(tCell);
            this.wireEvents(tCell);
        }
        args.pivotview = this.parent;
        this.parent.trigger(events.queryCellInfo, args);
    }

    private onOlapRowCellBoundEvent(tCell: HTMLElement, cell: IAxisSet): HTMLElement {
        tCell.innerText = '';
        const rowMeasurePos: number = (this.engine as OlapEngine).rowMeasurePos;
        if (this.parent.enableVirtualization) {
            if (cell.ordinal > -1 && this.parent.olapEngineModule.tupRowInfo.length > 0) {
                const tupInfo: ITupInfo = this.parent.olapEngineModule.tupRowInfo[cell.ordinal];
                const memberPosition: number = tupInfo.uNameCollection.indexOf(cell.actualText.toString());
                const cropUName: string = tupInfo.uNameCollection.substring(0, memberPosition) +
                    (cell.memberType === 3 ? '' : cell.actualText.toString());
                const fieldSep: string[] = cropUName.split('::[').map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
                if (cell.memberType === 3 && rowMeasurePos) {
                    fieldSep.push(cell.actualText.toString());
                }
                let nxtIndextCount: number = -1;
                let lastIndextCount: number = 0;
                let prevHasChild: boolean = false;
                for (let fPos: number = 0; fPos < fieldSep.length; fPos++) {
                    const fieldMembers: string = fieldSep[fPos as number];
                    const membersCount: number = fieldMembers.split('~~').length;
                    nxtIndextCount += membersCount;
                    const hasChild: boolean = tupInfo.typeCollection[fPos as number] !== '2' ? (this.engine.fieldList[tupInfo.members[fPos as number].getAttribute('Hierarchy')] && (this.engine.fieldList as IOlapFieldListOptions)[tupInfo.members[fPos as number].getAttribute('Hierarchy')].isHierarchy && fPos < this.parent.dataSourceSettings.rows.length - 1 && !this.parent.dataSourceSettings.rows[fPos + 1].isNamedSet && this.parent.dataSourceSettings.rows[fPos + 1].name.indexOf('[Measures]') < 0 && (this.engine.fieldList as IOlapFieldListOptions)[this.parent.dataSourceSettings.rows[fPos + 1].name] && (this.engine.fieldList as IOlapFieldListOptions)[this.parent.dataSourceSettings.rows[fPos + 1].name].hasAllMember) ? true : Number(tupInfo.members[fPos as number].querySelector('CHILDREN_CARDINALITY').textContent) > 0 : false;
                    lastIndextCount += (fPos > 0 && prevHasChild && !hasChild) ? 1 : 0;
                    prevHasChild = hasChild;
                }
                let indent: number = 0;
                for (let iPos: number = 0; iPos < nxtIndextCount; iPos++) {
                    tCell.appendChild(createElement('span', {
                        className: cls.NEXTSPAN
                    }));
                    indent++;
                }
                for (let iPos: number = 0; iPos < lastIndextCount && nxtIndextCount > 0; iPos++) {
                    tCell.appendChild(createElement('span', {
                        className: cls.LASTSPAN
                    }));
                }
                this.indentCollection[cell.rowIndex] = indent;
                this.maxIndent = this.maxIndent > indent ? this.maxIndent : indent;
            }
        } else {
            const hierarchyName: string = cell.hierarchy;
            const levelName: string = cell.memberType === 3 ? (this.measurePos + '.' + cell.levelUniqueName) : cell.levelUniqueName;
            const hasChild: boolean = cell.hasChild;
            let isSubTotalCell: boolean = false;
            if (cell.isSum && cell.memberType === 3) {
                const currPos: number = this.lvlCollection[cell.parentUniqueName].position;
                for (let i: number = currPos + 1; i < this.position; i++) {
                    delete this.lvlCollection[this.lvlPosCollection[i as number]];
                    delete this.lvlPosCollection[i as number];
                }
                this.position = this.position > (currPos + 1) ? (currPos + 1) : this.position;
                isSubTotalCell = true;
                this.measurePos = this.lvlCollection[cell.parentUniqueName].position;
            }
            if (!this.lvlCollection[levelName as string] && levelName) {
                this.lvlPosCollection[this.position] = levelName;
                this.lvlCollection[levelName as string] = { position: this.position, hasChild: hasChild };
                this.position++;
            } else if (levelName) {
                const currPos: number = this.lvlCollection[levelName as string].position;
                for (let pos: number = currPos + 1; pos < this.position; pos++) {
                    delete this.lvlCollection[this.lvlPosCollection[pos as number]];
                    delete this.lvlPosCollection[pos as number];
                }
                this.position = this.position > (currPos + 1) ? (currPos + 1) : this.position;
            }
            if (!this.hierarchyCollection[hierarchyName as string] && hierarchyName) {
                this.hierarchyPosCollection[this.hierarchyCount] = hierarchyName;
                this.hierarchyCollection[hierarchyName as string] = {
                    lvlPosition: this.position - 1,
                    hierarchyPOs: this.hierarchyCount
                };
                this.hierarchyCount++;
            } else if (hierarchyName) {
                const currPos: number = this.hierarchyCollection[hierarchyName as string].hierarchyPOs;
                for (let pos: number = currPos + 1; pos < this.hierarchyCount; pos++) {
                    delete this.hierarchyCollection[this.hierarchyPosCollection[pos as number]];
                    delete this.hierarchyPosCollection[pos as number];
                }
                this.hierarchyCount = this.hierarchyCount > (currPos + 1) ? (currPos + 1) : this.hierarchyCount;
            }
            if (cell.memberType !== 3 && levelName && this.lvlCollection[levelName as string]) {
                const currHierarchyPos: number = this.hierarchyCollection[hierarchyName as string] ?
                    this.hierarchyCollection[hierarchyName as string].hierarchyPOs : -1;
                this.measurePos = rowMeasurePos <= currHierarchyPos && this.hierarchyPosCollection[rowMeasurePos + 1] ?
                    this.measurePos : this.lvlCollection[levelName as string].position;
            }
            let currPos: number = this.lvlCollection[levelName as string] ? this.lvlCollection[levelName as string].position : -1;
            currPos = isSubTotalCell ? currPos - 1 : currPos;
            let lvlPos: number = 0;
            let indent: number = 0;
            while (lvlPos <= currPos && currPos > 0 && cell.level > -1) {
                const hasChild: boolean = this.lvlCollection[this.lvlPosCollection[lvlPos as number]].hasChild;
                const prevHasChild: boolean = lvlPos > 0 ? this.lvlCollection[this.lvlPosCollection[lvlPos - 1]].hasChild : false;
                if (prevHasChild && !hasChild) {
                    tCell.appendChild(createElement('span', {
                        className: cls.LASTSPAN
                    }));
                }
                if (lvlPos !== currPos) {
                    tCell.appendChild(createElement('span', {
                        className: cls.NEXTSPAN
                    }));
                    indent++;
                }
                lvlPos++;
            }
            if (this.parent.dataSourceSettings.grandTotalsPosition === 'Top' && (!isNullOrUndefined(this.parent.olapEngineModule) && this.parent.olapEngineModule.olapValueAxis === 'row') && this.parent.dataType === 'olap' &&
                (cell.valueSort.levelName.toString()).indexOf(this.parent.localeObj.getConstant('grandTotal') + this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) === 0) {
                tCell.appendChild(createElement('span', {
                    className: cls.NEXTSPAN
                }));
            }
            if (cell.memberType === 3 && cell.level === -1 && Object.keys(this.lvlCollection).length > 1) {
                tCell.appendChild(createElement('span', {
                    className: cls.NEXTSPAN
                }));
                indent++;
            }
            this.indentCollection[cell.rowIndex] = indent;
            this.maxIndent = this.maxIndent > indent ? this.maxIndent : indent;
        }
        tCell.setAttribute('fieldname', cell.hierarchy);
        const grandTotal: boolean = (this.parent.olapEngineModule.tupRowInfo[cell.ordinal] ?
            (this.parent.olapEngineModule.tupRowInfo[cell.ordinal].measurePosition === 0 ?
                this.parent.olapEngineModule.tupRowInfo[cell.ordinal].allStartPos === 1 :
                this.parent.olapEngineModule.tupRowInfo[cell.ordinal].allStartPos === 0) : false);
        if (grandTotal) {
            tCell.classList.add('e-gtot');
        }
        return tCell;
    }

    private columnCellBoundEvent(args: HeaderCellInfoEventArgs): void {
        if (args.cell.column && args.cell.column.customAttributes) {
            const cell: IAxisSet = args.cell.column.customAttributes.cell;
            let tCell: HTMLElement = args.node as HTMLElement;
            if (cell) {
                const customClass: string = this.parent.hyperlinkSettings.cssClass;
                let isValueCell: boolean = false;
                for (const field of this.parent.dataSourceSettings.values) {
                    if (field.name === cell.actualText) {
                        isValueCell = true;
                        tCell.setAttribute('fieldname', field.name);
                    }
                }
                if ((cell.level === -1 && !cell.rowSpan) || cell.rowSpan === -1) {
                    (args.node as HTMLElement).style.display = 'none';
                } else if (cell.rowSpan > 1) {
                    args.node.setAttribute('rowspan', cell.rowSpan.toString());
                    args.node.setAttribute('aria-rowspan', cell.rowSpan.toString());
                    if ((cell.rowIndex + cell.rowSpan) === this.engine.headerContent.length) {
                        (args.node as HTMLElement).style.borderBottomWidth = '0px';
                    }
                }
                args.node.setAttribute('data-colindex', cell.colIndex.toString());
                args.node.setAttribute('index', cell.rowIndex.toString());
                let fieldName: string;
                if (this.parent.dataType === 'pivot') {
                    if (!isValueCell && !(this.parent.dataSourceSettings.values && this.parent.dataSourceSettings.valueAxis === 'column' &&
                        this.parent.dataSourceSettings.values.length > 1 &&
                        (isValueCell && cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSourceSettings.columns
                        && this.parent.dataSourceSettings.columns.length > 0) {
                        fieldName = cell.level > -1 && this.parent.dataSourceSettings.columns[cell.level] ?
                            this.parent.dataSourceSettings.columns[cell.level].name : '';
                        tCell.setAttribute('fieldname', fieldName);
                    }
                    if (this.validateColumnTotalcell(cell.colIndex)) {
                        tCell.classList.add('e-colstot');
                    }
                } else {
                    tCell = this.onOlapColumnCellBoundEvent(tCell, cell);
                }
                const isColumnFieldsAvail: boolean = (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column' && cell.valueSort &&
                    cell.valueSort.levelName === (this.parent.localeObj.getConstant('grandTotal') + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText)));
                if (cell.type || isColumnFieldsAvail) {
                    tCell.classList.add(cell.type === 'grand sum' ? 'e-gtot' : 'e-stot');
                    if (cell.type === 'grand sum') {
                        this.colGrandPos = cell.colIndex;
                    } else if (cell.type) {
                        tCell.classList.add('e-colstot');
                    }
                    let localizedText: string = cell.type === 'grand sum' ? (isNullOrUndefined(cell.valueSort.axis) || this.parent.dataType === 'olap' ? this.parent.localeObj.getConstant('grandTotal') :
                        cell.formattedText) : cell.formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total');
                    localizedText = isColumnFieldsAvail && this.parent.engineModule.fieldList ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cell.actualText].aggregateType)
                        + ' ' + this.parent.localeObj.getConstant('of') + ' ' + cell.formattedText : localizedText;
                    if ((tCell.querySelector('.e-headertext') as HTMLElement) !== null) {
                        (tCell.querySelector('.e-headertext') as HTMLElement).innerText = localizedText;
                    } else {
                        (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerText = localizedText;
                    }
                }
                tCell.classList.add(cls.COLUMNSHEADER);
                if (this.parent.isColumnCellHyperlink || cell.enableHyperlink) {
                    if (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement) {
                        const innerText: string = (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerText;
                        (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    } else if (tCell.querySelector('.e-headertext') as HTMLElement) {
                        const innerText: string = (tCell.querySelector('.e-headertext') as HTMLElement).innerText;
                        (tCell.querySelector('.e-headertext') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                }
                if (cell.hasChild === true && !cell.isNamedSet) {
                    const hdrdiv: HTMLElement = tCell.querySelector('.e-headercelldiv') as HTMLElement;
                    if (hdrdiv) {
                        hdrdiv.style.height = 'auto';
                        hdrdiv.style.lineHeight = 'normal';
                    }
                    const div: HTMLElement = createElement('div', {
                        className: (cell.isDrilled === true ? cls.COLLAPSE : cls.EXPAND) + ' ' + cls.ICON,
                        attrs: {
                            'title': cell.isDrilled === true ? this.parent.localeObj.getConstant('collapse') :
                                this.parent.localeObj.getConstant('expand')
                        }
                    });
                    if (window.navigator.userAgent.indexOf('Edge') > -1 || window.navigator.userAgent.indexOf('Trident') > -1) {
                        (tCell.children[0] as HTMLElement).style.display = 'table';
                    } else {
                        (tCell.children[0] as HTMLElement).style.display = 'block';
                    }
                    this.updateWrapper(tCell, div);
                } else {
                    this.updateWrapper(tCell);
                }
                tCell = this.appendValueSortIcon(cell, tCell, cell.rowIndex, cell.colIndex, args.cell.column);
                if (this.parent.cellTemplate) {
                    this.parent.gridHeaderCellInfo.push({ targetCell: tCell });
                }
                const len: number = this.parent.dataSourceSettings.values.length;
                for (let vCnt: number = 0; vCnt < len; vCnt++) {
                    if (this.parent.dataSourceSettings.values[vCnt as number].name === cell.actualText) {
                        if (this.parent.dataType === 'olap') {
                            const grandTotal: boolean = (this.parent.olapEngineModule.tupColumnInfo[cell.ordinal] ?
                                (this.parent.olapEngineModule.tupColumnInfo[cell.ordinal].measurePosition === 0 ?
                                    this.parent.olapEngineModule.tupColumnInfo[cell.ordinal].allStartPos === 1 :
                                    this.parent.olapEngineModule.tupColumnInfo[cell.ordinal].allStartPos === 0) : false);
                            if (grandTotal) {
                                tCell.classList.add('e-gtot');
                            }
                        }
                        if (cell.valueSort.levelName === (this.parent.localeObj.getConstant('grandTotal') + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText))
                            || cell.valueSort.levelName === ('Grand Total' + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText))) {
                            tCell.classList.add('e-gtot');
                        } else {
                            tCell.classList.add(cls.VALUESHEADER);
                        }
                    }
                }
                this.unWireEvents(tCell);
                this.wireEvents(tCell);
            }
        }
        this.parent.trigger(events.headerCellInfo, args);
    }
    private updateWrapper(tCell: HTMLElement, div?: HTMLElement): HTMLElement {
        if (tCell.querySelectorAll('.e-headercelldiv').length > 0 || tCell.querySelectorAll('.e-stackedheadercelldiv').length > 0) {
            const outerDiv: HTMLElement = createElement('div', {
                className: cls.PIVOT_CELL_CONTAINER
            });
            const innerDiv: HTMLElement = createElement('div', {
                className: (div ? 'e-stackedheadertext' : 'e-headertext') + ' ' + cls.CELLVALUE,
                innerHTML: tCell.querySelectorAll('.e-headercelldiv').length > 0 ? (tCell.querySelector('.e-headercelldiv') as HTMLElement).innerHTML : (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerHTML
            });
            if (div) {
                outerDiv.append(div);
            }
            outerDiv.append(innerDiv);
            tCell.children[0].innerHTML = '';
            tCell.children[0].append(outerDiv);
        }
        return tCell;
    }
    private onOlapColumnCellBoundEvent(tCell: HTMLElement, cell: IAxisSet): HTMLElement {
        tCell.setAttribute('fieldname', cell.memberType === 3 ? cell.actualText.toString() : cell.hierarchy);
        const prevCell: IAxisSet = this.engine.headerContent[cell.rowIndex] ?
            this.engine.headerContent[cell.rowIndex][cell.colIndex - 1] : undefined;
        if (prevCell && prevCell.actualText === cell.actualText && prevCell.type === cell.type &&
            (prevCell.colSpan > 1)) {
            tCell.style.display = 'none';
        } else {
            // tCell.setAttribute('colspan', cell.colSpan.toString());
            // tCell.setAttribute('aria-colspan', cell.colSpan.toString());
        }
        if (cell.rowIndex === (this.engine.headerContent.length - 1) && cell.memberType === 2) {
            tCell.style.display = this.isSpannedCell(this.engine.headerContent.length, cell) ? 'none' : tCell.style.display;
        }
        return tCell;
    }
    private isSpannedCell(colLength: number, currCell: IAxisSet): boolean {
        let prevCell: IAxisSet = this.engine.headerContent[currCell.rowIndex - 1] ?
            this.engine.headerContent[currCell.rowIndex - 1][currCell.colIndex] : undefined;
        let parentCellSpan: number;
        let parentCellPos: number;
        while (prevCell && ((prevCell.memberType === currCell.memberType) || (prevCell.type && currCell.type))) {
            if (prevCell.rowSpan > 0) {
                parentCellSpan = prevCell.rowSpan;
                parentCellPos = prevCell.rowIndex;
            }
            prevCell = this.engine.headerContent[prevCell.rowIndex - 1] ?
                this.engine.headerContent[prevCell.rowIndex - 1][currCell.colIndex] : undefined;
        }
        return (parentCellPos + parentCellSpan) >= colLength;
    }

    private onHyperCellClick(e: MouseEvent): void {
        let cell: Element = (e.target as Element).parentElement.parentElement;
        cell = (cell.className.indexOf('e-headercelldiv') > -1 ? cell.parentElement : cell);
        const args: HyperCellClickEventArgs = {
            currentCell: cell,
            data: this.engine.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))],
            cancel: true,
            nativeEvent: e
        };
        this.parent.trigger(events.hyperlinkCellClick, args, (observedArgs: HyperCellClickEventArgs) => {
            if (!observedArgs.cancel) {
                args.currentCell = getElement(args.currentCell) as Element;
                const url: string = args.currentCell.getAttribute('data-url') ? (args.currentCell).getAttribute('data-url') :
                    (args.currentCell.querySelector('a') as HTMLElement).getAttribute('data-url');
                window.open(url);
            }
        });
    }

    private getRowStartPos(): number {
        const pivotValues: IAxisSet[][] = this.parent.pivotValues;
        let rowPos: number;
        for (let rCnt: number = 0; rCnt < (pivotValues ? pivotValues.length : 0); rCnt++) {
            if (pivotValues[rCnt as number] && pivotValues[rCnt as number][0] && (pivotValues[rCnt as number][0] as IAxisSet).axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }
        return rowPos;
    }

    private frameDataSource(type: string): IGridValues {
        let dataContent: IGridValues = [];
        if (((this.parent.dataType === 'pivot' && this.parent.dataSourceSettings.dataSource && this.parent.engineModule.data.length > 0) || (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.url !== '') ||
        (this.parent.dataSourceSettings.mode === 'Server' && this.parent.dataSourceSettings.url !== '' && this.engine.pivotValues.length > 0)) && this.parent.dataSourceSettings.values.length > 0 && !this.engine.isEmptyData) {
            if ((this.parent.enableValueSorting) || !this.engine.isEngineUpdated) {
                let rowCnt: number = 0;
                const pivotValues: IAxisSet[][] = this.parent.pivotValues;
                const start: number = type === 'value' ? this.rowStartPos : 0;
                const end: number = type === 'value' ? (pivotValues ? pivotValues.length : 0) : this.rowStartPos;
                for (let rCnt: number = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt as number]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt as number] = {} as IAxisSet[];
                        for (let cCnt: number = 0; cCnt < pivotValues[rCnt as number].length; cCnt++) {
                            if (pivotValues[rCnt as number][cCnt as number]) {
                                dataContent[rowCnt as number][cCnt as number] = pivotValues[rCnt as number][cCnt as number] as IAxisSet;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public frameEmptyData(): any[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataContent: any = [{
            0: { formattedText: this.parent.localeObj.getConstant('grandTotal') },
            1: { formattedText: this.parent.localeObj.getConstant('emptyData') }
        }];
        return dataContent;
    }

    /** @hidden */

    public calculateColWidth(colCount: number): number {
        if (!isNullOrUndefined(this.parent.resizedValue)) {
            this.parent.resizedValue = (this.parent.showGroupingBar && this.parent.resizedValue < 250) ? 250 : this.parent.resizedValue;
        }
        this.resColWidth = !isNullOrUndefined(this.parent.resizedValue) ? this.parent.resizedValue : this.resColWidth;
        const offsetWidth: number = this.parent.element.offsetWidth ? this.parent.element.offsetWidth :
            this.parent.element.getBoundingClientRect().width;
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * offsetWidth) : offsetWidth) :
            Number(this.parent.width);
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth) - 2;
        colCount = colCount - 1;
        this.isOverflows = !((colCount * this.gridSettings.columnWidth) < parWidth);
        if (!this.isOverflows) {
            const parentHeight: number = this.parent.getHeightAsNumber();
            const headersLength: number = (this.engine && this.engine.headerContent) ? Object.keys(this.engine.headerContent).length : 1;
            const height: number = parentHeight > this.parent.minHeight ? parentHeight :
                (this.parent.minHeight - (this.gridSettings.rowHeight * headersLength));
            if (this.engine && this.engine.valueContent && ((this.gridSettings.rowHeight * this.engine.valueContent.length) > height)) {
                parWidth = parWidth - getScrollBarWidth();
            }
        }
        const colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return (!this.isOverflows && !this.gridSettings.allowAutoResizing) ? this.gridSettings.columnWidth : Math.floor(colWidth);
    }

    /** @hidden */

    public resizeColWidth(colCount: number): number {
        if (!isNullOrUndefined(this.parent.resizedValue)) {
            this.parent.resizedValue = (this.parent.showGroupingBar && this.parent.resizedValue < 250) ? 250 : this.parent.resizedValue;
        }
        this.resColWidth = !isNullOrUndefined(this.parent.resizedValue) ? this.parent.resizedValue : this.resColWidth;
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        colCount = colCount - 1;
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth) - 2;
        this.isOverflows = !((colCount * this.gridSettings.columnWidth) < parWidth);
        const colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return (!this.isOverflows && !this.gridSettings.allowAutoResizing) ? this.gridSettings.columnWidth : Math.floor(colWidth);
    }

    /** @hidden */

    public calculateGridWidth(): number | string {
        let parWidth: number | string = this.parent.width;
        let eleWidth: number = this.parent.element.getBoundingClientRect().width ?
            this.parent.element.getBoundingClientRect().width : this.parent.element.offsetWidth;
        if (eleWidth === 0) {
            eleWidth = this.parent.element.parentElement.getBoundingClientRect().width ?
                this.parent.element.parentElement.getBoundingClientRect().width : this.parent.element.parentElement.offsetWidth;
        }
        if (this.gridSettings.width === 'auto') {
            if (this.parent.width === 'auto') {
                parWidth = eleWidth;
            } else if (this.parent.width.toString().indexOf('%') > -1) {
                parWidth = ((parseFloat(this.parent.width.toString()) / 100) * eleWidth);
            }
        } else {
            parWidth = this.gridSettings.width;
        }
        return (!this.gridSettings.allowAutoResizing && parWidth as number > this.parent.totColWidth) ? this.parent.totColWidth : parWidth;
    }

    /** @hidden */

    public calculateGridHeight(elementCreated?: boolean): number | string {
        const contentElement: HTMLElement = (
            this.parent.element.querySelector('.' + cls.GRID_CLASS + ' .' + cls.CONTENT_CLASS) as HTMLElement
        );
        let gridHeight: number | string = this.parent.height;
        let parHeight: number = this.parent.getHeightAsNumber();
        if (isNaN(parHeight)) {
            parHeight = parHeight > this.parent.minHeight ? parHeight : this.parent.minHeight;
        } else {
            parHeight = (contentElement.offsetWidth < (contentElement.querySelector('.' + cls.TABLE) as HTMLElement).offsetWidth) ?
                parHeight - getScrollBarWidth() : parHeight;
        }
        if ((this.parent.showToolbar && this.parent.currentView !== 'Chart') || (!this.parent.showToolbar && this.parent.displayOption.view !== 'Chart')) {
            if (this.gridSettings.height === 'auto' && parHeight && this.parent.element.querySelector('.' + cls.GRID_HEADER)) {
                const rowColHeight: number = (this.parent.element.querySelector('.' + cls.GRID_HEADER) as HTMLElement).offsetHeight;
                const gBarHeight: number = rowColHeight + (this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) ?
                    (this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement).offsetHeight : 0);
                const toolBarHeight: number = this.parent.element.querySelector('.' + cls.GRID_TOOLBAR) ? 42 : 0;
                const pagerHeight: number = this.parent.element.querySelector('.' + cls.GRID_PAGER) ? (this.parent.element.querySelector('.' + cls.GRID_PAGER) as HTMLElement).offsetHeight : 0;
                gridHeight = parHeight - (gBarHeight + toolBarHeight + pagerHeight) - 1;
                gridHeight = gridHeight < 40 ? 40 : gridHeight;
                if (elementCreated) {
                    const tableHeight: number = (contentElement.querySelector('.' + cls.TABLE) as HTMLElement).offsetHeight;
                    const contentHeight: number = (contentElement.querySelector('.' + cls.TABLE) as HTMLElement).offsetHeight;
                    const tableWidth: number = (contentElement.querySelector('.' + cls.TABLE) as HTMLElement).offsetWidth;
                    const contentWidth: number = contentElement.offsetWidth;
                    const horizontalOverflow: boolean = contentWidth <= tableWidth;
                    // if (horizontalOverflow && ((contentWidth + 2) < tableWidth) && !this.parent.enableVirtualization) {
                    //     contentElement.style.overflowX = 'scroll';
                    // } else {
                    //     contentElement.style.overflowX = 'hidden';
                    //     horizontalOverflow = false;
                    // }
                    //let verticalOverflow: boolean = contentHeight < tableHeight;
                    const commonOverflow: boolean = horizontalOverflow && ((gridHeight - tableHeight) < 18) ? true : false;
                    if (gridHeight >= tableHeight && (horizontalOverflow ? gridHeight >= contentHeight : true) &&
                        !commonOverflow) {
                        this.parent.grid.height = 'auto';
                    } else {
                        this.parent.grid.height = gridHeight;
                        this.parent.grid.dataBind();
                    }
                    // this.parent.grid.widthService.refreshFrozenScrollbar();
                } else {
                    if (gridHeight > (this.engine.valueContent.length * this.gridSettings.rowHeight)) {
                        gridHeight = 'auto';
                    }
                }
            } else {
                gridHeight = this.gridSettings.height;
            }
        }
        return gridHeight as number < this.parent.gridSettings.rowHeight ? this.parent.gridSettings.rowHeight : gridHeight;
    }

    /**
     * It used to frame stacked headers.
     *
     * @returns {ColumnModel[]} - Returns grid columns.
     * @hidden
     */
    public frameStackedHeaders(): ColumnModel[] {
        const pivotColumns: PivotColumn[] = this.parent.pivotColumns;
        const gridColumns: ColumnModel[] = this.parent.grid['columnModel'];
        let autoFitApplied: boolean = false;
        const refreshColumn: boolean = this.parent.toolbarModule && this.parent.toolbarModule.isReportChange ? true : this.parent.actionObj ? ((this.parent.actionObj.actionName === 'Sort value' && this.parent.engineModule.valueAxis === 1) ||
            (this.parent.actionObj.actionName === 'Sort field' && this.parent.actionObj.fieldInfo.axis === 'columns') ||
            (this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.actionObj.actionName === 'Sort field' && this.parent.pivotFieldListModule.actionObj.fieldInfo.axis === 'columns')
        ) : false;
        const singleValueFormat: string = this.parent.dataSourceSettings.values.length === 1 &&
            !this.parent.dataSourceSettings.alwaysShowValueHeader ?
            this.formatList[this.parent.dataSourceSettings.values[0].name] : undefined;
        this.pivotColumns = [];
        if ((((this.parent.dataType === 'olap' && this.parent.dataSourceSettings.url !== '') ? true : (this.parent.dataSourceSettings.values.length > 0 && this.parent.dataSourceSettings.dataSource && this.parent.engineModule.data.length > 0)) ||
            (this.parent.dataSourceSettings.mode === 'Server' && this.parent.dataSourceSettings.url !== '' && this.engine.pivotValues.length > 0)) && !this.engine.isEmptyData) {
            let headerCnt: number = this.engine.headerContent.length;
            const headerSplit: Object[] = [];
            const splitPos: Object[] = [];
            const colWidth: number = this.calculateColWidth(this.engine.pivotValues ? this.engine.pivotValues[0].length : 0);
            const measureFlag: boolean = this.parent.dataType === 'olap' && !isNullOrUndefined((this.engine as OlapEngine).colMeasurePos) && // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((this.engine as OlapEngine) as any).colDepth - 1 === this.parent.olapEngineModule.colMeasurePos;
            do {
                const columnModel: ColumnModel[] = [];
                let actualCnt: number = 0;
                headerCnt--;
                const colField: IAxisSet[] = this.engine.headerContent[headerCnt as number];
                const colCount: number = colField ? Object.keys(colField).length : 0;
                if (colField) {
                    for (let cCnt: number = 0; cCnt < Object.keys(colField).length + (colField[0] ? 0 : 1); cCnt++) {
                        let colSpan: number = (colField[cCnt as number] && colField[cCnt as number].colSpan) ?
                            ((colField[cCnt as number].memberType !== 3 || (colField[cCnt as number].memberType === 3 && !measureFlag) ||
                                headerCnt === 0) ? colField[cCnt as number].colSpan : headerSplit[cCnt as number] as number) : 1;
                        colSpan = this.parent.dataType === 'olap' && isNullOrUndefined(colSpan) ? 1 : colSpan;
                        let formattedText: string = colField[cCnt as number] ? (colField[cCnt as number].type === 'grand sum' ?
                            (isNullOrUndefined(colField[cCnt as number].valueSort.axis) ? this.parent.localeObj.getConstant('grandTotal') :
                                colField[cCnt as number].formattedText) : (colField[cCnt as number].type === 'sum' ?
                                colField[cCnt as number].formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total') :
                                colField[cCnt as number].formattedText)) : '';
                        formattedText = this.parent.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(formattedText) : formattedText;
                        if (headerCnt === this.engine.headerContent.length - 1) {
                            colSpan = 1;
                            autoFitApplied = pivotColumns.length - 1 !== colCount ? false : (!refreshColumn && !this.parent.isEmptyGrid
                                && pivotColumns[actualCnt as number] && pivotColumns[actualCnt as number].autoFit);
                            columnModel[actualCnt as number] = {
                                field: (cCnt + '.formattedText'),
                                headerText: formattedText,
                                customAttributes: { 'cell': colField[cCnt as number] },
                                width: autoFitApplied ? (gridColumns[actualCnt as number] as ColumnModel).width : colField[cCnt as number]
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, max-len
                                    ? colField[cCnt as number].valueSort ? this.setSavedWidth((colField[cCnt as number].valueSort as any).levelName, colWidth) : this.resColWidth
                                    : this.resColWidth,
                                minWidth: autoFitApplied && actualCnt === colCount
                                    ? (gridColumns[gridColumns.length - 1] as ColumnModel).minWidth : 30,
                                format: cCnt === 0 ? '' : (isNullOrUndefined(singleValueFormat) ? this.formatList[colField[cCnt as number].actualText] : singleValueFormat),
                                allowReordering: (this.parent.showGroupingBar ? false : this.parent.gridSettings.allowReordering),
                                allowResizing: this.parent.gridSettings.allowResizing,
                                visible: true,
                                textAlign: this.parent.enableRtl ? 'Left' : 'Right',
                                headerTextAlign: this.parent.enableRtl ? 'Right' : 'Left'
                            };
                        } else if (headerSplit[cCnt as number]) {
                            // colSpan = (colField[cCnt as number] && colField[cCnt as number].type === 'grand sum' &&
                            //     colField[cCnt as number].memberType === 2) ? 1 : colSpan;
                            let tmpSpan: number = colSpan;
                            let innerModel: ColumnModel[] = [];
                            let innerPos: number = cCnt;
                            while (tmpSpan > 0) {
                                if (columnModel[actualCnt as number]) {
                                    if (!this.pivotColumns[splitPos[innerPos as number] as number]) {
                                        break;
                                    }
                                    innerModel.push(this.pivotColumns[splitPos[innerPos as number] as number]);
                                } else {
                                    columnModel[actualCnt as number] = {
                                        headerText: formattedText,
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        field: colField[cCnt as number] ? (colField[cCnt as number].valueSort as any).levelName : '',
                                        customAttributes: { 'cell': colField[cCnt as number] },
                                        width: (autoFitApplied && actualCnt === 0 && !refreshColumn && !this.parent.isEmptyGrid
                                            && pivotColumns[0].autoFit) ? (gridColumns[0] as ColumnModel).width : colField[cCnt as number] ?
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                this.setSavedWidth((colField[cCnt as number].valueSort as any).levelName, colWidth)
                                                : this.resColWidth,
                                        minWidth: 30,
                                        allowReordering: (this.parent.showGroupingBar ? false : this.parent.gridSettings.allowReordering),
                                        allowResizing: this.parent.gridSettings.allowResizing,
                                        visible: true
                                    };
                                    innerModel = [this.pivotColumns[splitPos[innerPos as number] as number] as Column];
                                }
                                this.isAutoFitEnabled = this.isAutoFitEnabled ? true : autoFitApplied;
                                tmpSpan = tmpSpan - (headerSplit[innerPos as number] as number);
                                innerPos = innerPos + (headerSplit[innerPos as number] as number);
                            }
                            columnModel[actualCnt as number].columns = innerModel;
                        }
                        if (columnModel[actualCnt as number]) {
                            columnModel[actualCnt as number].clipMode = this.gridSettings.clipMode;
                        }
                        headerSplit[cCnt as number] = colSpan;
                        splitPos[cCnt as number] = actualCnt;
                        actualCnt++;
                        cCnt = cCnt + colSpan - 1;
                    }
                }
                this.pivotColumns = columnModel.length > 0 ? columnModel : this.pivotColumns;
            } while (headerCnt > 0);
            this.pivotColumns[0] = {
                field: (0 + '.formattedText'),
                width: (autoFitApplied && !refreshColumn && !this.parent.isEmptyGrid && pivotColumns[0].autoFit)
                    ? (gridColumns[0] as ColumnModel).width : this.resColWidth,
                minWidth: 30,
                headerText: '',
                allowReordering: false,
                allowResizing: this.parent.gridSettings.allowResizing,
                visible: true,
                clipMode: this.parent.gridSettings.clipMode
            };
        } else {
            this.pivotColumns = this.frameEmptyColumns();
        }
        if (this.parent.toolbarModule && this.parent.showToolbar) {
            this.parent.toolbarModule.isReportChange = false;
        }
        this.parent.triggerColumnRenderEvent(this.pivotColumns);
        autoFitApplied = this.parent.pivotColumns.length > 0 && this.parent.pivotColumns[this.parent.pivotColumns.length - 1].autoFit;
        if (this.pivotColumns.length > 1 && !autoFitApplied) {
            const lastColumn: ColumnModel = this.pivotColumns[this.pivotColumns.length - 1];
            lastColumn.minWidth = lastColumn.width;
            lastColumn.width = 'auto';
            if (lastColumn.columns && lastColumn.columns.length > 0) {
                this.configLastColumnWidth((lastColumn.columns as ColumnModel[])[lastColumn.columns.length - 1]);
            }
        }
        return this.pivotColumns;
    }

    private configLastColumnWidth(column: ColumnModel): void {
        column.minWidth = column.width;
        column.width = 'auto';
        if (column.columns && column.columns.length > 0) {
            this.configLastColumnWidth((column.columns as ColumnModel[])[column.columns.length - 1]);
        }
    }

    /** @hidden */

    public setSavedWidth(column: string, width: number): number {
        if (column === '0.formattedText' && !isNullOrUndefined(this.parent.resizedValue)) {
            width = this.parent.resizedValue;
        } else {
            width = this.parent.resizeInfo[column as string] ? this.parent.resizeInfo[column as string] : width;
        }
        return width;
    }

    /** @hidden */

    public frameEmptyColumns(): ColumnModel[] {
        const columns: ColumnModel[] = [];
        const colWidth: number = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: this.resColWidth });
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    }

    /** @hidden */

    public getFormatList(): { [key: string]: string } {
        const formatArray: { [key: string]: string } = {};
        for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
            const field: IFieldOptions = this.parent.dataSourceSettings.values[vCnt as number];
            let format: string = 'N';
            if (this.parent.dataType === 'olap') {
                if (this.parent.olapEngineModule.fieldList[field.name] &&
                    !isNullOrUndefined(this.parent.olapEngineModule.fieldList[field.name].formatString)) {
                    const fString: string = this.parent.olapEngineModule.fieldList[field.name].formatString;
                    format = (!isNullOrUndefined(fString) && fString !== '') ? fString.indexOf('#') > -1 ? fString : (fString[0] + '2') : undefined;
                }
            } else {
                if ((['PercentageOfDifferenceFrom', 'PercentageOfRowTotal', 'PercentageOfColumnTotal', 'PercentageOfGrandTotal', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal']).indexOf(field.type) > -1) {
                    format = 'P2';
                } else if (['PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar', 'Index'].indexOf(field.type) > -1) {
                    format = undefined;
                }
                if (this.parent.dataSourceSettings.formatSettings.length > 0) {
                    for (let fCnt: number = 0; fCnt < this.parent.dataSourceSettings.formatSettings.length; fCnt++) {
                        const formatSettings: IFormatSettings = this.parent.dataSourceSettings.formatSettings[fCnt as number];
                        if (field.name === formatSettings.name) {
                            format = formatSettings.format;
                            break;
                        } else {
                            continue;
                        }
                    }
                }
            }
            formatArray[field.name] = format;
        }
        return formatArray;
    }

    private getValidHeader(args: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs
    | PdfQueryCellInfoEventArgs, axis: string): any {  // eslint-disable-line @typescript-eslint/no-explicit-any
        const values: FieldOptionsModel[] = this.parent.dataSourceSettings.values;
        if (axis === 'row') {
            const cellInfo: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs =
            args as ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs;
            if (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) {
                if (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row' && (this.parent.localeObj.getConstant('grandTotal') +
                    this.parent.dataSourceSettings.valueSortSettings.headerDelimiter + cellInfo.value)
                    === ((cellInfo.data as IGridValues)[0] as IAxisSet).valueSort.levelName) {
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cellInfo.value.toString()].aggregateType)
                        + ' ' + this.parent.localeObj.getConstant('of') + ' ' + cellInfo.value.toString();
                } else if (values.length === 1 && this.parent.dataSourceSettings.rows.length === 0) {
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values[values.length - 1].type)
                        + ' ' + this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values[values.length - 1].caption) ? values[values.length - 1].caption : values[values.length - 1].name);
                }
            }
            return cellInfo.value;
        } else if (axis === 'column') {
            const cellInfo: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs =
            args as ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs;
            if (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) {
                if (!isNullOrUndefined(((args as any).gridCell as any).column.customAttributes) && this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column' && // eslint-disable-line @typescript-eslint/no-explicit-any
                    (this.parent.localeObj.getConstant('grandTotal') + this.parent.dataSourceSettings.valueSortSettings.headerDelimiter + (cellInfo.gridCell as any).column.customAttributes.cell.formattedText) // eslint-disable-line @typescript-eslint/no-explicit-any
                    === (cellInfo.gridCell as any).column.customAttributes.cell.valueSort.levelName) {// eslint-disable-line @typescript-eslint/no-explicit-any
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[(cellInfo
                        .gridCell as any).column.customAttributes.cell.actualText].aggregateType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + (cellInfo.gridCell as any).column.customAttributes.cell.formattedText; // eslint-disable-line @typescript-eslint/no-explicit-any
                }
            }
            return ((cellInfo as any).cell).value; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
    }

    private excelColumnEvent(args: ExcelHeaderQueryCellInfoEventArgs): void {
        if (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column') {
            ((args as any).cell).value = this.getValidHeader(args, 'column'); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        if (args.gridCell !== undefined && (args.gridCell as any).column.width === 'auto') { // eslint-disable-line @typescript-eslint/no-explicit-any
            this.parent.lastColumn = (args.gridCell as any).column; // eslint-disable-line @typescript-eslint/no-explicit-any
            (args.gridCell as any).column.width = (args.gridCell as any).column.minWidth; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        args = this.exportHeaderEvent(args);
        this.parent.trigger(events.excelHeaderQueryCellInfo, args);
    }

    private pdfColumnEvent(args: PdfHeaderQueryCellInfoEventArgs): void {
        if (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column') {
            ((args as any).cell).value = this.getValidHeader(args, 'column'); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        if (args.gridCell !== undefined && (args.gridCell as any).column.width === 'auto') { // eslint-disable-line @typescript-eslint/no-explicit-any
            this.parent.lastColumn = (args.gridCell as any).column; // eslint-disable-line @typescript-eslint/no-explicit-any
            (args.gridCell as any).column.width = (args.gridCell as any).column.minWidth; // eslint-disable-line @typescript-eslint/no-explicit-any
        }
        this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
    }

    private excelRowEvent(args: ExcelQueryCellInfoEventArgs): void {
        if (args.column.field === '0.formattedText') {
            const cell: IAxisSet = (args.data as IAxisSet[])[0];
            const isValueCell: boolean = cell.type && cell.type === 'value';
            let level: number = 0;
            if (this.parent.dataType === 'olap') {
                level = this.indentCollection[cell.rowIndex];
            } else {
                const levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                const memberPos: number = cell.actualText ?
                    cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                const levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                    (memberPos ? memberPos - 1 : memberPos);
                level = levelPosition ? (levelPosition - 1) : 0;
            }
            this.colPos = 0;
            args.style = { hAlign: 'Left', indent: level * 2 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        } else {
            this.colPos++;
            const pivotValue: IAxisSet =
            (<any>args.data)[args.column.customAttributes.cell ? (args.column.customAttributes.cell as IAxisSet).colIndex : this.colPos]; // eslint-disable-line @typescript-eslint/no-explicit-any
            if (isNullOrUndefined(pivotValue.value) || isNullOrUndefined(pivotValue.formattedText) || pivotValue.formattedText === '') {
                args.value = this.parent.exportType === 'Excel' ? null : '';
            } else {
                const aggMatrix: IMatrix2D = this.parent.dataType === 'pivot' && this.parent.engineModule ? this.parent.engineModule.aggregatedValueMatrix : undefined;
                if (aggMatrix && aggMatrix[pivotValue.rowIndex] && aggMatrix[pivotValue.rowIndex][pivotValue.colIndex]) {
                    args.value = aggMatrix[pivotValue.rowIndex][pivotValue.colIndex];
                } else {
                    args.value = !isNullOrUndefined(pivotValue.value) ? (pivotValue.formattedText === '#DIV/0!' ? pivotValue.formattedText : pivotValue.value) : pivotValue.formattedText;
                }
            }
        }
        args = this.exportContentEvent(args);
        if (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row') {
            args.value = args.column.field === '0.formattedText' ? this.getValidHeader(args, 'row') : args.value;
        }
        this.parent.trigger(events.excelQueryCellInfo, args);
    }

    private pdfRowEvent(args: PdfQueryCellInfoEventArgs): void {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            let level: number = 0;
            const cell: IAxisSet = (args.data as IAxisSet[])[0];
            const isValueCell: boolean = cell.type && cell.type === 'value';
            if (this.parent.dataType === 'olap') {
                level = this.indentCollection[cell.rowIndex];
            } else {
                const levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                const memberPos: number = cell.actualText ?
                    cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                const levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                    (memberPos ? memberPos - 1 : memberPos);
                level = levelPosition ? (levelPosition - 1) : 0;
            }
            args.style = { paragraphIndent: level * 10 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
            if (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row') {
                args.value = this.getValidHeader(args, 'row');
            }
        }
        this.parent.trigger(events.pdfQueryCellInfo, args);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private excelDataBound(args: any): void {
        const excelRows: ExcelRow[] = args.excelRows;
        const rowStartPos: number = Object.keys(this.engine.headerContent).length;
        for (let i: number = 0; i < rowStartPos; i++) {
            const cells: any = excelRows[i as number].cells;
            const tmpCell: any = [];
            for (let j: number = 0; j < cells.length; j++) {
                if (cells[j as number].rowSpan !== -1) {
                    tmpCell.push(cells[j as number]);
                }
            }
            excelRows[i as number].cells = tmpCell;
        }
    }

    private exportHeaderEvent(args: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs): any {
        let rowSpan: number = 1;
        if (((args as any).gridCell as any).column.customAttributes) {
            const cell: IAxisSet = ((args as any).gridCell as any).column.customAttributes.cell;
            // if (this.actualText !== cell.actualText && cell.colSpan > 1 && cell.level > -1) {
            //     ((args as any).gridCell as any).colSpan = (args.cell as any).colSpan = cell.colSpan > -1 ? cell.colSpan : 1;
            // }
            rowSpan = cell.rowSpan > -1 ? cell.rowSpan : 1;
            if ((args as any).name === 'excelHeaderQueryCellInfo') {
                if (cell.rowSpan > -1) {
                    rowSpan = cell.rowSpan;
                } else if (!isNullOrUndefined(cell.type) && cell.level !== 0) {
                    rowSpan = -1;
                    (args.cell as any).rowSpan = -1;
                }
            }
            this.actualText = cell.actualText as string;
        } else {
            rowSpan = Object.keys(this.engine.headerContent).length;
        }
        if ((args.cell as any).rowSpan !== rowSpan && rowSpan > -1) {
            (args.cell as any).rowSpan = rowSpan;
        }
        return args;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private exportContentEvent(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cell: IAxisSet = (<any>args).data[Number(args.column.field.split('.formattedText')[0])];
        args.value = cell.type === 'grand sum' ? (isNullOrUndefined(cell.valueSort.axis) ?
            this.parent.localeObj.getConstant('grandTotal') : cell.formattedText) : args.value;
        return args;
    }
    private unWireEvents(cell: HTMLElement): void {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.remove(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick);
        } else {
            return;
        }
    }

    private wireEvents(cell: HTMLElement): void {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.add(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick, this);
        } else {
            return;
        }
    }
}
