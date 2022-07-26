import { IAxisSet, IGridValues, IPivotValues, IValueSortSettings, IGroupSettings } from '../../base/engine';
import { PivotEngine, IFieldOptions, IFormatSettings, IMatrix2D } from '../../base/engine';
import { PivotView } from '../base/pivotview';
import { Reorder, headerRefreshed, CellSelectEventArgs, RowSelectEventArgs, PdfExportCompleteArgs } from '@syncfusion/ej2-grids';
import { Grid, Resize, ColumnModel, Column, ExcelExport, PdfExport, ContextMenu, ResizeArgs, Freeze } from '@syncfusion/ej2-grids';
import { PdfHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, HeaderCellInfoEventArgs, Selection, RowDeselectEventArgs } from '@syncfusion/ej2-grids';
import { CellDeselectEventArgs, CellSelectingEventArgs, ExcelExportCompleteArgs } from '@syncfusion/ej2-grids';
import { createElement, setStyleAttribute, remove, isNullOrUndefined, EventHandler, getElement } from '@syncfusion/ej2-base';
import { addClass, removeClass, SanitizeHtmlHelper, select, selectAll } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { DataBoundEventArgs, BeforeOpenCloseMenuEventArgs, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { GridSettingsModel } from '../model/gridsettings-model';
import { HyperCellClickEventArgs, PivotCellSelectedEventArgs, QueryCellInfoEventArgs } from '../../common/base/interface';
import { AggregateMenuOpenEventArgs, BeforeExportEventArgs, PivotColumn, ExcelRow } from '../../common/base/interface';
import { AggregateMenu } from '../../common/popups/aggregate-menu';
import { SummaryTypes } from '../../base/types';
import { OlapEngine, ITupInfo, IOlapFieldListOptions } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';
import { SelectedCellsInfo } from '../../common/popups/grouping';
import { AggregateTypes } from '../../common/base/enum';
import { FocusStrategy } from '@syncfusion/ej2-grids/src/grid/services/focus-strategy';
import { FieldOptionsModel } from '../model/datasourcesettings-model';

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
    /* eslint-disable-next-line */
    private timeOutObj: any;
    /** Constructor for render module
     * @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent: PivotView) {    /* eslint-disable-line */
        this.parent = parent;
        this.resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) :
            (this.parent.isAdaptive ? 140 : 200);
        this.engine = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.gridSettings = this.parent.gridSettings;
        this.formatList = this.getFormatList();
        this.aggMenu = new AggregateMenu(this.parent);
    }

    /* eslint-disable-next-line */
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
        if (this.parent.grid && this.parent.grid.element && this.parent.element.querySelector('.e-grid')) {
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
                columns: this.frameStackedHeaders(), dataSource: (this.parent.dataType === 'olap' ? true :
                    this.parent.dataSourceSettings.values.length > 0) && !this.engine.isEmptyData ? this.engine.valueContent :
                    this.frameDataSource('value')
            }, true);
            if (this.parent.grid.height === 'auto') {
                let mCntHeight: number = (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as any).offsetHeight; /* eslint-disable-line */
                let dataHeight: number = (this.parent.grid.dataSource as []).length * this.parent.gridSettings.rowHeight;
                if (mCntHeight > 50 && mCntHeight < dataHeight) {
                    (this.parent.grid.contentModule as any).setHeightToContent(dataHeight); /* eslint-disable-line */
                }
            }
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
            let ele: HTMLElement = this.parent.isAdaptive ? mCont : mCont.parentElement.parentElement.querySelector('.' + cls.MOVABLESCROLL_DIV);
            mHdr.scrollLeft = ele.scrollLeft;
        }
    }
    /* eslint-disable-next-line */
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
            allowReordering: (this.parent.showGroupingBar ? false : this.gridSettings.allowReordering),
            allowSelection: this.gridSettings.allowSelection,
            /* eslint-disable-next-line */
            contextMenuItems: this.gridSettings.contextMenuItems as any,
            selectedRowIndex: this.gridSettings.selectedRowIndex,
            /* eslint-disable-next-line */
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

    /* eslint-disable-next-line */
    private headerRefreshed(args: any): void {
        if (this.parent.lastGridSettings && Object.keys(this.parent.lastGridSettings).indexOf('allowResizing') > -1) {
            this.parent.lastGridSettings = undefined;
            if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
                this.parent.groupingBarModule.setGridRowWidth();
            }
        }
    }

    /* eslint-disable-next-line */
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

    /* eslint-disable */
    private pdfExportComplete(args: PdfExportCompleteArgs): void {
        if (this.parent.lastColumn !== undefined && (this.parent.lastColumn as any).width !== 'auto') {
            (this.parent.lastColumn as any).width = 'auto';
            this.parent.lastColumn = undefined;
        }
    }

    private excelExportComplete(args: ExcelExportCompleteArgs): void {
        if (this.parent.lastColumn !== undefined && (this.parent.lastColumn as any).width !== 'auto') {
            (this.parent.lastColumn as any).width = 'auto';
            this.parent.lastColumn = undefined;
        }
    }

    /* eslint-enable */
    private dataBound(args: DataBoundEventArgs): void { /* eslint-disable-line */
        if (this.parent.cellTemplate) {
            for (let cell of this.parent.gridHeaderCellInfo) {
                if (this.parent.cellTemplate) {
                    /* eslint-disable-next-line */
                    let element: any = this.parent.getCellTemplate()(
                        cell, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate', null, null, cell.targetCell);
                    if (element && element !== '' && element.length > 0) {
                        if (this.parent.enableHtmlSanitizer) {
                            this.parent.appendHtml(cell.targetCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                        } else {
                            this.parent.appendHtml(cell.targetCell, element[0].outerHTML);
                        }
                    }
                }
            }
            this.parent.gridHeaderCellInfo = [];
        }
        // if ((this.parent.dataSourceSettings.valueAxis === 'row' ||
        //     !(this.parent.dataType === 'pivot' && this.parent.dataSourceSettings.valueAxis === 'column' && this.parent.engineModule && !this.parent.engineModule.isLastHeaderHasMeasures)) && /* eslint-disable-line */
        //     this.parent.element.querySelector('.e-firstcell') && !(this.parent.dataSourceSettings.values.length === 1 && this.parent.dataSourceSettings.columns.length > 0)) { /* eslint-disable-line */
        //     if (this.parent.enableRtl) {
        //         (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderRight = 'none';
        //     } else {
        //         (this.parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderLeft = 'none';
        //     }
        // }
        if (this.parent.grid && this.parent.grid.widthService) {
            this.parent.grid.widthService.setWidthToTable();
        }
        if (this.parent.notEmpty) {
            this.calculateGridHeight(true);
        }
        this.parent.isScrolling = false;
        this.setFocusOnLastCell();
        if (!isNullOrUndefined((this.parent as any).renderReactTemplates)) {    /* eslint-disable-line */
            (this.parent as any).renderReactTemplates();    /* eslint-disable-line */
        }
        if (this.parent.isInitial) {
            this.parent.isInitial = false;
            this.parent.refreshData();
        }
        this.parent.notify(events.contentReady, {});
    }

    private setFocusOnLastCell(): void {
        if (this.parent.keyboardModule && this.parent.keyboardModule.event &&
            (this.parent.keyboardModule.event.target as HTMLElement).nodeName === 'TD') {
            let gridFocus: FocusStrategy = this.parent.grid.serviceLocator.getService<FocusStrategy>('focus');
            gridFocus.setFocusedElement(this.parent.keyboardModule.event.target as HTMLElement);
            gridFocus.focus(this.parent.keyboardModule.event);
            addClass([(this.parent.keyboardModule.event.target as HTMLElement)], ['e-focused', 'e-focus']);
            (this.parent.keyboardModule.event.target as HTMLElement).setAttribute('tabindex', '0');
            this.parent.keyboardModule.event = undefined;
        }
    }
    /* eslint-disable */
    private contextMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (args.element && this.parent.cssClass) {
            addClass([args.element.parentElement], this.parent.cssClass);
        }
        for (let item of args.items) {
            let cellTarget: Element = this.parent.lastCellClicked;
            let elem: Element = null;
            let bool: boolean;
            let isGroupElement: boolean;
            if (cellTarget.classList.contains('e-stackedheadercelldiv') || cellTarget.classList.contains('e-cellvalue') ||
                cellTarget.classList.contains('e-headercelldiv') || cellTarget.classList.contains('e-icons') || cellTarget.classList.contains('e-rhandler')) {
                elem = cellTarget.parentElement;
            } else if (cellTarget.classList.contains('e-headercell') || cellTarget.classList.contains('e-rowcell') || cellTarget.classList.contains('e-columnsheader') ||
                cellTarget.classList.contains('e-rowsheader') || cellTarget.classList.contains('e-valuescontent') || cellTarget.classList.contains('e-valuesheader')) {
                elem = cellTarget;
            } else if (cellTarget.classList.contains('e-headertext')) {
                elem = cellTarget.parentElement.parentElement;
            }
            if (!elem) {
                args.cancel = true;
                return;
            }
            if (elem.classList.contains('e-valuesheader') || elem.classList.contains('e-stot')) {
                bool = true;
            }
            if (this.parent.allowGrouping && this.parent.groupingModule && !this.validateField(elem as HTMLElement)) {
                isGroupElement = true;
            }
            let rowIndex: number = Number(elem.getAttribute('index'));
            let colIndex: number = Number(elem.getAttribute('data-colindex'));
            let pivotValue1: IAxisSet = this.parent.pivotValues[rowIndex][colIndex] as IAxisSet;
            let selectedID: string = item.id;
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
                        let fieldName: string = elem.getAttribute('fieldname');
                        let groupField: IGroupSettings = PivotUtil.getFieldByName(fieldName, this.parent.dataSourceSettings.groupSettings) as IGroupSettings;
                        if (groupField && groupField.type === 'Custom' || (this.parent.engineModule.fieldList[fieldName].isCustomField && fieldName.indexOf('_custom_group') > -1)) {
                            groupField = PivotUtil.getFieldByName(fieldName.replace('_custom_group', ''), this.parent.dataSourceSettings.groupSettings) as IGroupSettings;
                            if (groupField) {
                                let cell: IAxisSet = (this.parent.engineModule.pivotValues[Number(elem.getAttribute('index'))][Number(elem.getAttribute('data-colindex'))] as IAxisSet);
                                let selectedCellsInfo: SelectedCellsInfo[] = this.parent.groupingModule.getSelectedCells(cell.axis, fieldName, cell.actualText.toString());
                                selectedCellsInfo.push({ axis: cell.axis, fieldName: fieldName, name: cell.actualText.toString(), cellInfo: cell });
                                let selectedOptions: string[] = this.parent.groupingModule.getSelectedOptions(selectedCellsInfo);
                                for (let customGroup of groupField.customGroups) {
                                    if (selectedOptions.indexOf(customGroup.groupName) > -1) {
                                        isUngroupOption = true;
                                        break;
                                    }
                                }
                            }
                        } else if (groupField && (groupField.type === 'Date' || groupField.type === 'Number') ||
                            (this.parent.engineModule.fieldList[fieldName].isCustomField && fieldName.indexOf('_date_group') > -1)) {
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
                        let eventArgs: AggregateMenuOpenEventArgs = {
                            cancel: false, fieldName: pivotValue1.actualText.toString(),
                            aggregateTypes: [...this.getMenuItem(fieldType)],
                            displayMenuCount: 7
                        };
                        this.parent.trigger(events.aggregateMenuOpen, eventArgs, (observedArgs: AggregateMenuOpenEventArgs) => {
                            if (!observedArgs.cancel && !((elem as HTMLElement).innerText === '')) {
                                let menuItem: MenuItemModel[] = [];
                                let checkDuplicates: AggregateTypes[] = [];
                                for (let i: number = 0; i < observedArgs.aggregateTypes.length; i++) {
                                    let key: AggregateTypes = observedArgs.aggregateTypes[i] as AggregateTypes;
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
        let menuItems: AggregateTypes[] = [];
        for (let i: number = 0; i < this.parent.aggregateTypes.length; i++) {
            let key: AggregateTypes = this.parent.aggregateTypes[i] as AggregateTypes;
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
        let target: Element = this.parent.lastCellClicked;
        let selected: string = args.item.id;
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let exportArgs: BeforeExportEventArgs = {
        };
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
        let colIndx: number = Number(ele.getAttribute('data-colindex'));
        let pivotValue: IAxisSet = this.parent.pivotValues[rowIndx][colIndx] as IAxisSet;
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
                    pdfExportProperties: { fileName: 'Export.pdf' },
                };
                this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                    this.parent.pdfExport(observedArgs.pdfExportProperties, observedArgs.isMultipleExport, observedArgs.pdfDoc, observedArgs.isBlob);
                });
                break;
            case this.parent.element.id + '_excel':
                exportArgs = {
                    isBlob: false,
                    isMultipleExport: false,
                    workbook: undefined,
                    excelExportProperties: { fileName: 'Export.xlsx' },
                };
                this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                    this.parent.excelExport(observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob);
                });
                break;
            case this.parent.element.id + '_csv':
                exportArgs = {
                    isBlob: false,
                    workbook: undefined,
                    isMultipleExport: false,
                    excelExportProperties: { fileName: 'Export.csv' },
                };
                this.parent.trigger(events.beforeExport, exportArgs, (observedArgs: BeforeExportEventArgs) => {
                    this.parent.csvExport(observedArgs.excelExportProperties, observedArgs.isMultipleExport, observedArgs.workbook, observedArgs.isBlob);
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
                    let exp = ele.querySelectorAll('.' + cls.EXPAND)[0] as Element;
                    this.parent.onDrill(exp);
                }
                break;
            case this.parent.element.id + '_collapse':
                if (ele.querySelectorAll('.' + cls.COLLAPSE)) {
                    let colp = ele.querySelectorAll('.' + cls.COLLAPSE)[0] as Element;
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
                    let args: { target: HTMLElement, option: string, parentElement: HTMLElement } = {
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
        let headerPosKeys: string[] = Object.keys(this.engine.headerContent);
        let keysLength: number = headerPosKeys.length;
        let sumLock: boolean = false;
        let fieldName: string = "";
        for (let pos: number = keysLength - 1; pos >= 0; pos--) {
            let cell: IAxisSet = this.engine.headerContent[headerPosKeys[pos] as any][columnIndex];
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
            if (!fieldName || fieldName == '') {
                let rowIndx: number = Number(target.getAttribute('index'));
                let colIndx: number = Number(target.getAttribute('data-colindex'));
                fieldName = (this.engine.pivotValues[rowIndx][colIndx] as IAxisSet).actualText as string;
            }
            let valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
            for (let valueCnt: number = 0; valueCnt < valuefields.length; valueCnt++) {
                if (this.parent.dataSourceSettings.values[valueCnt].name === fieldName) {
                    isValueField = true;
                    break;
                }
            }
        }
        return isValueField;
    }

    /* eslint-enable */
    private updateAggregate(aggregate: string): void {
        if (this.parent.getAllSummaryType().indexOf(aggregate as AggregateTypes) > -1) {
            let valuefields: IFieldOptions[] = this.parent.dataSourceSettings.values;
            for (let valueCnt: number = 0; valueCnt < this.parent.dataSourceSettings.values.length; valueCnt++) {
                if (this.parent.dataSourceSettings.values[valueCnt].name === this.field) {
                    let dataSourceItem: IFieldOptions = (<{ [key: string]: IFieldOptions }>valuefields[valueCnt]);
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

    /* eslint-disable-next-line */
    /** @hidden */
    public updateGridSettings(): void {
        this.injectGridModules(this.parent);
        this.parent.grid.allowResizing = this.gridSettings.allowResizing;
        this.parent.grid.allowTextWrap = this.gridSettings.allowTextWrap;
        this.parent.grid.allowReordering = (this.parent.showGroupingBar ? false : this.gridSettings.allowReordering);
        this.parent.grid.allowSelection = this.gridSettings.allowSelection;
        /* eslint-disable-next-line */
        this.parent.grid.contextMenuItems = this.gridSettings.contextMenuItems as any;
        this.parent.grid.selectedRowIndex = this.gridSettings.selectedRowIndex;
        /* eslint-disable-next-line */
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
            if (keys.indexOf('allowTextWrap') > -1) {
                this.parent.layoutRefresh();
            }
        }
        this.clearColumnSelection();
    }

    private updatePivotColumns(): void {
        let keys: string[] = Object.keys(this.parent.lastGridSettings);
        for (let colPos: number = 0; colPos < this.parent.pivotColumns.length; colPos++) {
            let pivotColumn: PivotColumn = this.parent.pivotColumns[colPos];
            for (let keyPos: number = 0; keyPos < keys.length; keyPos++) {
                let key: string = keys[keyPos];
                /* eslint-disable-next-line */
                if (!isNullOrUndefined((this.parent.pivotColumns[colPos] as any)[key])) {
                    /* eslint-disable-next-line */
                    (pivotColumn as any)[key] = (this.parent.lastGridSettings as any)[key];
                }
            }
        }
        this.parent.fillGridColumns(this.parent.grid.columns as ColumnModel[]);
    }

    private clearColumnSelection(): void {
        removeClass(this.parent.element.querySelectorAll('.' + cls.CELL_ACTIVE_BGCOLOR), [cls.CELL_ACTIVE_BGCOLOR, cls.SELECTED_BGCOLOR]);
    }

    private appendValueSortIcon(cell: IAxisSet, tCell: HTMLElement, rCnt: number, cCnt: number): HTMLElement {
        if (this.parent.enableValueSorting && this.parent.dataType === 'pivot') {
            let vSort: IValueSortSettings = this.parent.dataSourceSettings.valueSortSettings;
            let len: number = (cell.type === 'grand sum' &&
                this.parent.dataSourceSettings.values.length === 1 && !this.parent.dataSourceSettings.alwaysShowValueHeader) ? 0 :
                (this.parent.dataSourceSettings.values.length > 1 || this.parent.dataSourceSettings.alwaysShowValueHeader) ?
                    (this.parent.engineModule.headerContent.length - 1) :
                    this.parent.dataSourceSettings.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
            let lock: boolean = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
            if (vSort !== undefined && lock && (rCnt === len || (rCnt + 1) === len && cell.level > -1 &&
                this.parent.engineModule.headerContent[(rCnt + 1)][cCnt] && this.parent.engineModule.headerContent[(rCnt + 1)][cCnt].level === -1)
                && this.parent.dataSourceSettings.valueAxis === 'column') {
                if (tCell.querySelector('.e-sortfilterdiv')) {
                    tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                        'e-descending' : 'e-ascending');
                    tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                        'e-icon-descending' : 'e-icon-ascending');
                    tCell.querySelector('.e-sortfilterdiv').classList.add('e-value-sort-icon');
                } else {
                    tCell.appendChild(createElement('div', {
                        className: (vSort.sortOrder === 'Descending' ?
                            'e-icon-descending e-icons e-descending e-sortfilterdiv e-value-sort-icon' :
                            'e-icon-ascending e-icons e-ascending e-sortfilterdiv e-value-sort-icon')
                    }));
                }
            }
            // return tCell;
        }
        return tCell;
    }

    private onResizeStop(args: ResizeArgs): void {
        /* eslint-disable-next-line */
        let column: string = args.column.field === '0.formattedText' ? '0.formattedText' : (args.column.customAttributes as any).cell.valueSort.levelName;
        this.parent.resizeInfo[column] = Number(args.column.width.toString().split('px')[0]);
        if (this.parent.enableVirtualization && args.column.field === '0.formattedText') {
            if (this.parent.dataSourceSettings.values.length > 1 && !isNullOrUndefined((this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).columns)) {
                let gridColumns: string[] | ColumnModel[] | Column[] = (this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).columns;
                (gridColumns[gridColumns.length - 1] as ColumnModel).minWidth = this.parent.gridSettings.columnWidth;
            } else {
                (this.parent.grid.columns[this.parent.grid.columns.length - 1] as ColumnModel).minWidth = this.parent.gridSettings.columnWidth;
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
            else {
                (this.parent.element.querySelector('.e-frozenscrollbar') as any).style.width = args.column.width.toString().split('px')[0] + 'px';
            }
        }
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
        if (args.cancel) {
            let column: string = args.column.field === '0.formattedText' ? '0.formattedText' : (args.column.customAttributes as any).cell.valueSort.levelName;
            this.parent.resizeInfo[column] = Number(args.column.width.toString().split('px')[0]);
            if (this.parent.enableVirtualization) {
                this.parent.layoutRefresh();
            }
        }
        if (this.parent.enableVirtualization) {
            this.parent.resizedValue = (args.cancel || args.column.field !== '0.formattedText') ? this.parent.resizedValue : Number(args.column.width.toString().split('px')[0]);
        }
        this.parent.trigger(args.e.type === 'touchend' || args.e.type === 'mouseup' ? events.resizeStop : events.resizing, args);
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public selected(): void {
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(this.onSelect.bind(this), 300);
    }

    private onSelect(): void {
        let pivotArgs: PivotCellSelectedEventArgs = { selectedCellsInfo: [], pivotValues: this.parent.pivotValues, currentCell: null };
        /* eslint-disable-next-line */
        let selectedElements: any = this.parent.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR);
        for (let element of selectedElements) {
            let colIndex: number = Number(element.getAttribute('data-colindex'));
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
        if (tCell && (this.parent.notEmpty) && this.engine.headerContent) {
            let customClass: string = this.parent.hyperlinkSettings.cssClass;
            let cell: IAxisSet = (args.data as IGridValues)[0] as IAxisSet;
            let isRowFieldsAvail: boolean = cell.valueSort && cell.valueSort.levelName === (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row' &&
                this.parent.localeObj.getConstant('grandTotal') + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText));
            tCell.setAttribute('index', cell.rowIndex ? cell.rowIndex.toString() : '0');
            if (tCell.getAttribute('data-colindex') === '0') {
                if (this.parent.dataType === 'pivot') {
                    let isValueCell: boolean = cell.type && cell.type === 'value';
                    tCell.innerText = '';
                    let levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                    let memberPos: number = cell.actualText ?
                        cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                    let levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                        (memberPos ? memberPos - 1 : memberPos);
                    let level: number = levelPosition ? (levelPosition - 1) : 0;
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
                            for (let field of this.parent.dataSourceSettings.values) {
                                let name: string = field.caption ? field.caption : field.name;
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
                        let values: FieldOptionsModel[] = this.parent.dataSourceSettings.values;
                        localizedText = isNullOrUndefined(cell.valueSort.axis) ? (this.parent.dataSourceSettings.rows.length === 0 && values.length === 1 && this.parent.dataSourceSettings.valueAxis === 'row') ?
                            this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values[values.length - 1].type) + ' ' +
                            this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values[values.length - 1].caption) ? values[values.length - 1].caption : values[values.length - 1].name) :
                            this.parent.localeObj.getConstant('grandTotal') : cell.formattedText;
                    } else if (cell.valueSort.levelName === (this.parent.localeObj.getConstant('grandTotal') +
                        (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText))) {
                        tCell.classList.add('e-gtot');
                        localizedText = isRowFieldsAvail ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cell.actualText].aggregateType) + ' '
                            + this.parent.localeObj.getConstant('of') + ' ' + cell.formattedText : localizedText;
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
                let vSort: IValueSortSettings = this.parent.pivotView.dataSourceSettings.valueSortSettings;
                if (this.parent.enableValueSorting) {
                    if (vSort && vSort.headerText && this.parent.dataSourceSettings.valueAxis === 'row' &&
                        this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] &&
                        (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName) {
                        if ((this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName
                            === vSort.headerText) {
                            tCell.appendChild(createElement('div', {
                                className: (vSort.sortOrder === 'Descending' ?
                                    'e-icon-descending e-icons e-descending e-sortfilterdiv e-value-sort-icon' :
                                    'e-icon-ascending e-icons e-ascending e-sortfilterdiv e-value-sort-icon') + (cell.hasChild ? ' e-value-sort-align' : ''),
                                styles: tCell.style.textAlign === 'right' ? 'float: left' : ''
                            }));
                        }
                    }
                }
            } else {
                let innerText: string = tCell.innerText;
                tCell.innerText = '';
                tCell.classList.add(cls.VALUESCONTENT);
                cell = (args.data as IGridValues)[Number(tCell.getAttribute('data-colindex'))] as IAxisSet;
                cell = isNullOrUndefined(cell) ? (args.column.customAttributes.cell as IAxisSet) : cell;
                cell.isGrandSum = isRowFieldsAvail ? true : cell.isGrandSum;
                if (cell.isSum) {
                    tCell.classList.add(cls.SUMMARY);
                }
                let isGrandSum: boolean = (isNullOrUndefined(cell.isGrandSum) && (!isNullOrUndefined(this.parent.olapEngineModule) && this.parent.olapEngineModule.olapValueAxis === 'column') && this.parent.dataType === 'olap' &&
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
                    tCell.setAttribute('data-colindex', (args.column.customAttributes.cell as IAxisSet).colIndex.toString());
                }
            }
            if (this.parent.cellTemplate) {
                let index: string = tCell.getAttribute('index');
                let colindex: string = tCell.getAttribute('data-colindex');
                let templateID: string = index + '_' + colindex;
                /* eslint-disable-next-line */
                let element: any = this.parent.getCellTemplate()(
                    { targetCell: tCell, cellInfo: cell }, this.parent, 'cellTemplate', this.parent.element.id + '_cellTemplate', null, null, tCell);
                if (element && element !== '' && element.length > 0) {
                    if (this.parent.enableHtmlSanitizer) {
                        this.parent.appendHtml(tCell, SanitizeHtmlHelper.sanitize(element[0].outerHTML));
                    } else {
                        this.parent.appendHtml(tCell, element[0].outerHTML);
                    }
                }
            }
            this.unWireEvents(tCell);
            this.wireEvents(tCell);
        }
        args.pivotview = this.parent;
        this.parent.trigger(events.queryCellInfo, args);
    }

    /* eslint-disable */
    private onOlapRowCellBoundEvent(tCell: HTMLElement, cell: IAxisSet): HTMLElement {
        tCell.innerText = '';
        let rowMeasurePos: number = (this.engine as OlapEngine).rowMeasurePos;
        if (this.parent.enableVirtualization) {
            if (cell.ordinal > -1 && this.parent.olapEngineModule.tupRowInfo.length > 0) {
                let tupInfo: ITupInfo = this.parent.olapEngineModule.tupRowInfo[cell.ordinal];
                let memberPosition: number = tupInfo.uNameCollection.indexOf(cell.actualText.toString());
                let cropUName: string = tupInfo.uNameCollection.substring(0, memberPosition) +
                    (cell.memberType === 3 ? '' : cell.actualText.toString());
                let fieldSep: string[] = cropUName.split('::[').map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
                if (cell.memberType === 3 && rowMeasurePos) {
                    fieldSep.push(cell.actualText.toString());
                }
                let nxtIndextCount: number = -1;
                let lastIndextCount: number = 0;
                let prevHasChild: boolean = false;
                for (let fPos: number = 0; fPos < fieldSep.length; fPos++) {
                    let fieldMembers: string = fieldSep[fPos];
                    let membersCount: number = fieldMembers.split('~~').length;
                    nxtIndextCount += membersCount;
                    let hasChild: boolean = tupInfo.typeCollection[fPos] !== '2' ? (this.engine.fieldList[tupInfo.members[fPos].getAttribute('Hierarchy')] && (this.engine.fieldList as IOlapFieldListOptions)[tupInfo.members[fPos].getAttribute('Hierarchy')].isHierarchy && fPos < this.parent.dataSourceSettings.rows.length - 1 && !this.parent.dataSourceSettings.rows[fPos + 1].isNamedSet && this.parent.dataSourceSettings.rows[fPos + 1].name.indexOf('[Measures]') < 0 && (this.engine.fieldList as IOlapFieldListOptions)[this.parent.dataSourceSettings.rows[fPos + 1].name] && (this.engine.fieldList as IOlapFieldListOptions)[this.parent.dataSourceSettings.rows[fPos + 1].name].hasAllMember) ? true : Number(tupInfo.members[fPos].querySelector('CHILDREN_CARDINALITY').textContent) > 0 : false;
                    lastIndextCount += (fPos > 0 && prevHasChild && !hasChild) ? 1 : 0;
                    prevHasChild = hasChild;
                }
                let indent: number = 0;
                for (let iPos: number = 0; iPos < nxtIndextCount; iPos++) {
                    tCell.appendChild(createElement('span', {
                        className: cls.NEXTSPAN,
                    }));
                    indent++;
                }
                for (let iPos: number = 0; iPos < lastIndextCount && nxtIndextCount > 0; iPos++) {
                    tCell.appendChild(createElement('span', {
                        className: cls.LASTSPAN,
                    }));
                }
                this.indentCollection[cell.rowIndex] = indent;
                this.maxIndent = this.maxIndent > indent ? this.maxIndent : indent;
            }
        } else {
            let hierarchyName: string = cell.hierarchy;
            let levelName: string = cell.memberType === 3 ? (this.measurePos + '.' + cell.levelUniqueName) : cell.levelUniqueName;
            let hasChild: boolean = cell.hasChild;
            if (!this.lvlCollection[levelName] && levelName) {
                this.lvlPosCollection[this.position] = levelName;
                this.lvlCollection[levelName] = { position: this.position, hasChild: hasChild };
                this.position++;
            } else if (levelName) {
                let currPos: number = this.lvlCollection[levelName].position;
                for (let pos: number = currPos + 1; pos < this.position; pos++) {
                    delete this.lvlCollection[this.lvlPosCollection[pos]];
                    delete this.lvlPosCollection[pos];
                }
                this.position = this.position > (currPos + 1) ? (currPos + 1) : this.position;
            }
            if (!this.hierarchyCollection[hierarchyName] && hierarchyName) {
                this.hierarchyPosCollection[this.hierarchyCount] = hierarchyName;
                this.hierarchyCollection[hierarchyName] = {
                    lvlPosition: this.position - 1,
                    hierarchyPOs: this.hierarchyCount
                };
                this.hierarchyCount++;
            } else if (hierarchyName) {
                let currPos: number = this.hierarchyCollection[hierarchyName].hierarchyPOs;
                for (let pos: number = currPos + 1; pos < this.hierarchyCount; pos++) {
                    delete this.hierarchyCollection[this.hierarchyPosCollection[pos]];
                    delete this.hierarchyPosCollection[pos];
                }
                this.hierarchyCount = this.hierarchyCount > (currPos + 1) ? (currPos + 1) : this.hierarchyCount;
            }
            if (cell.memberType !== 3 && levelName && this.lvlCollection[levelName]) {
                let currHierarchyPos: number = this.hierarchyCollection[hierarchyName] ?
                    this.hierarchyCollection[hierarchyName].hierarchyPOs : -1;
                this.measurePos = rowMeasurePos <= currHierarchyPos && this.hierarchyPosCollection[rowMeasurePos + 1] ?
                    this.measurePos : this.lvlCollection[levelName].position;
            }
            let currPos: number = this.lvlCollection[levelName] ? this.lvlCollection[levelName].position : -1;
            let lvlPos: number = 0;
            let indent: number = 0;
            while (lvlPos <= currPos && currPos > 0 && cell.level > -1) {
                let hasChild: boolean = this.lvlCollection[this.lvlPosCollection[lvlPos]].hasChild;
                let prevHasChild: boolean = lvlPos > 0 ? this.lvlCollection[this.lvlPosCollection[lvlPos - 1]].hasChild : false;
                if (prevHasChild && !hasChild) {
                    tCell.appendChild(createElement('span', {
                        className: cls.LASTSPAN,
                    }));
                }
                if (lvlPos !== currPos) {
                    tCell.appendChild(createElement('span', {
                        className: cls.NEXTSPAN,
                    }));
                    indent++;
                }
                lvlPos++;
            }
            if (this.parent.dataSourceSettings.grandTotalsPosition === 'Top' && (!isNullOrUndefined(this.parent.olapEngineModule) && this.parent.olapEngineModule.olapValueAxis === 'row') && this.parent.dataType === 'olap' &&
                (cell.valueSort.levelName.toString()).indexOf(this.parent.localeObj.getConstant('grandTotal') + this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) === 0) {
                tCell.appendChild(createElement('span', {
                    className: cls.NEXTSPAN,
                }));
            }
            if (cell.memberType === 3 && cell.level === -1 && Object.keys(this.lvlCollection).length > 1) {
                tCell.appendChild(createElement('span', {
                    className: cls.NEXTSPAN,
                }));
                indent++;
            }
            this.indentCollection[cell.rowIndex] = indent;
            this.maxIndent = this.maxIndent > indent ? this.maxIndent : indent;
        }
        tCell.setAttribute('fieldname', cell.hierarchy);
        let grandTotal: boolean = (this.parent.olapEngineModule.tupRowInfo[cell.ordinal] ?
            (this.parent.olapEngineModule.tupRowInfo[cell.ordinal].measurePosition === 0 ?
                this.parent.olapEngineModule.tupRowInfo[cell.ordinal].allStartPos === 1 :
                this.parent.olapEngineModule.tupRowInfo[cell.ordinal].allStartPos === 0) : false);
        if (grandTotal) {
            tCell.classList.add('e-gtot');
        }
        return tCell;
    }
    /* eslint-enable */
    private columnCellBoundEvent(args: HeaderCellInfoEventArgs): void {
        if (args.cell.column && args.cell.column.customAttributes) {
            let cell: IAxisSet = args.cell.column.customAttributes.cell;
            let tCell: HTMLElement = args.node as HTMLElement;
            if (cell) {
                let customClass: string = this.parent.hyperlinkSettings.cssClass;
                let isValueCell: boolean = false;
                for (let field of this.parent.dataSourceSettings.values) {
                    if (field.name === cell.actualText) {
                        isValueCell = true;
                        tCell.setAttribute('fieldname', field.name);
                    }
                }
                let level: number = cell.rowIndex ? cell.rowIndex : 0;
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
                        (isValueCell && cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSourceSettings.columns &&
                        this.parent.dataSourceSettings.columns.length > 0) {
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
                let isColumnFieldsAvail: boolean = (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column' && cell.valueSort &&
                    cell.valueSort.levelName === (this.parent.localeObj.getConstant('grandTotal') + (this.parent.dataSourceSettings.valueSortSettings.headerDelimiter) + (cell.formattedText)));
                if (cell.type || isColumnFieldsAvail) {
                    tCell.classList.add(cell.type === 'grand sum' ? 'e-gtot' : 'e-stot');
                    if (cell.type === 'grand sum') {
                        this.colGrandPos = cell.colIndex;
                    } else if (cell.type) {
                        tCell.classList.add('e-colstot');
                    }
                    let localizedText: string = cell.type === 'grand sum' ? (isNullOrUndefined(cell.valueSort.axis) ? this.parent.localeObj.getConstant('grandTotal') : cell.formattedText) :
                        cell.formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total');
                    localizedText = isColumnFieldsAvail ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cell.actualText].aggregateType)
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
                        let innerText: string = (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerText;
                        (tCell.querySelector('.e-stackedheadercelldiv') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    } else if (tCell.querySelector('.e-headertext') as HTMLElement) {
                        let innerText: string = (tCell.querySelector('.e-headertext') as HTMLElement).innerText;
                        (tCell.querySelector('.e-headertext') as HTMLElement).innerHTML =
                            '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                }
                if (cell.hasChild === true && !cell.isNamedSet) {
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
                    if (window.navigator.userAgent.indexOf('Edge') > -1 || window.navigator.userAgent.indexOf('Trident') > -1) {
                        (tCell.children[0] as HTMLElement).style.display = 'table';
                    } else {
                        (tCell.children[0] as HTMLElement).style.display = 'block';
                    }
                    if (tCell.children[0].classList.contains('e-stackedheadercelldiv')) {
                        let span: HTMLElement = createElement('span', {
                            className: 'e-stackedheadertext' + ' ' + cls.CELLVALUE,
                            innerHTML: tCell.children[0].innerHTML
                        });
                        tCell.children[0].innerHTML = '';
                        tCell.children[0].append(div);
                        tCell.children[0].append(span);
                    } else {
                        this.updateWrapper(tCell, div);
                    }
                } else {
                    this.updateWrapper(tCell);
                }
                tCell = this.appendValueSortIcon(cell, tCell, cell.rowIndex, cell.colIndex);
                if (this.parent.cellTemplate) {
                    let index: string = tCell.getAttribute('index');
                    let colindex: string = tCell.getAttribute('data-colindex');
                    let templateID: string = index + '_' + colindex;
                    this.parent.gridHeaderCellInfo.push({ targetCell: tCell });
                }
                let len: number = this.parent.dataSourceSettings.values.length;
                for (let vCnt: number = 0; vCnt < len; vCnt++) {
                    if (this.parent.dataSourceSettings.values[vCnt].name === cell.actualText) {
                        if (this.parent.dataType === 'olap') {
                            let grandTotal: boolean = (this.parent.olapEngineModule.tupColumnInfo[cell.ordinal] ?
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
        if (tCell.children[0].classList.contains('e-headercelldiv')) {
            let outerDiv: HTMLElement = createElement('div');
            let innerDiv: HTMLElement = createElement('div', {
                className: (div ? 'e-stackedheadertext' : 'e-headertext') + ' ' + cls.CELLVALUE,
                innerHTML: tCell.children[0].children[0].innerHTML
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
        let prevCell: IAxisSet = this.engine.headerContent[cell.rowIndex] ?
            this.engine.headerContent[cell.rowIndex][cell.colIndex - 1] : undefined;
        if (prevCell && prevCell.actualText === cell.actualText && prevCell.type === cell.type &&
            (prevCell.colSpan > 1)) {
            tCell.style.display = 'none';
        } else {
            tCell.setAttribute('colspan', cell.colSpan.toString());
            tCell.setAttribute('aria-colspan', cell.colSpan.toString());
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
        let args: HyperCellClickEventArgs = {
            currentCell: cell,
            data: this.engine.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))],
            cancel: true,
            nativeEvent: e
        };
        this.parent.trigger(events.hyperlinkCellClick, args, (observedArgs: HyperCellClickEventArgs) => {
            if (!observedArgs.cancel) {
                args.currentCell = getElement(args.currentCell) as Element;
                let url: string = args.currentCell.getAttribute('data-url') ? (args.currentCell).getAttribute('data-url') :
                    (args.currentCell.querySelector('a') as HTMLElement).getAttribute('data-url');
                window.open(url);
            }
        });
    }

    private getRowStartPos(): number {
        let pivotValues: IPivotValues = this.parent.pivotValues;
        let rowPos: number;
        for (let rCnt: number = 0; rCnt < (pivotValues ? pivotValues.length : 0); rCnt++) {
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
                let end: number = type === 'value' ? (pivotValues ? pivotValues.length : 0) : this.rowStartPos;
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
    /* eslint-disable-next-line */
    public frameEmptyData(): any[] {
        /* eslint-disable-next-line */
        let dataContent: any = [{
            0: { formattedText: this.parent.localeObj.getConstant('grandTotal') },
            1: { formattedText: this.parent.localeObj.getConstant('emptyData') }
        }];
        return dataContent;
    }

    public calculateColWidth(colCount: number): number {
        if (!isNullOrUndefined(this.parent.resizedValue)) {
            this.parent.resizedValue = (this.parent.showGroupingBar && this.parent.resizedValue < 250) ? 250 : this.parent.resizedValue
        }
        this.resColWidth = !isNullOrUndefined(this.parent.resizedValue) ? this.parent.resizedValue : this.resColWidth;
        let offsetWidth: number = this.parent.element.offsetWidth ? this.parent.element.offsetWidth :
            this.parent.element.getBoundingClientRect().width;
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * offsetWidth) : offsetWidth) :
            Number(this.parent.width);
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth) - 2;
        colCount = colCount - 1;
        this.isOverflows = !((colCount * this.gridSettings.columnWidth) < parWidth);
        let colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return (!this.isOverflows && !this.gridSettings.allowAutoResizing) ? this.gridSettings.columnWidth : Math.floor(colWidth);
    }

    public resizeColWidth(colCount: number): number {
        if (!isNullOrUndefined(this.parent.resizedValue)) {
            this.parent.resizedValue = (this.parent.showGroupingBar && this.parent.resizedValue < 250) ? 250 : this.parent.resizedValue
        }
        this.resColWidth = !isNullOrUndefined(this.parent.resizedValue) ? this.parent.resizedValue : this.resColWidth;
        let parWidth: number = isNaN(this.parent.width as number) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        colCount = colCount - 1;
        parWidth = parWidth - (this.gridSettings.columnWidth > this.resColWidth ? this.gridSettings.columnWidth : this.resColWidth) - 2;
        this.isOverflows = !((colCount * this.gridSettings.columnWidth) < parWidth);
        let colWidth: number =
            (colCount * this.gridSettings.columnWidth) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return (!this.isOverflows && !this.gridSettings.allowAutoResizing) ? this.gridSettings.columnWidth : Math.floor(colWidth);
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
        return (!this.gridSettings.allowAutoResizing && parWidth > this.parent.totColWidth) ? this.parent.totColWidth : parWidth;
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public calculateGridHeight(elementCreated?: boolean): number | string {
        let gridHeight: number | string = this.parent.height;
        let parHeight: number = this.parent.getHeightAsNumber();
        if (isNaN(parHeight)) {
            parHeight = parHeight > this.parent.minHeight ? parHeight : this.parent.minHeight;
        }
        if ((this.parent.showToolbar && this.parent.currentView !== 'Chart') || (!this.parent.showToolbar && this.parent.displayOption.view !== 'Chart')) {
            if (this.gridSettings.height === 'auto' && parHeight && this.parent.element.querySelector('.' + cls.GRID_HEADER)) {
                let rowColHeight: number = (this.parent.element.querySelector('.' + cls.GRID_HEADER) as HTMLElement).offsetHeight;
                let gBarHeight: number = rowColHeight + (this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) ?
                    (this.parent.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement).offsetHeight : 0);
                let toolBarHeight: number = this.parent.element.querySelector('.' + cls.GRID_TOOLBAR) ? 42 : 0;
                gridHeight = parHeight - (gBarHeight + toolBarHeight) - 1;
                gridHeight = gridHeight < 40 ? 40 : gridHeight;
                if (elementCreated) {
                    let tableHeight: number =
                        (this.parent.element.querySelector('.' + cls.FROZENCONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).offsetHeight;
                    let contentHeight: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetHeight;
                    let tableWidth: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).offsetWidth;
                    let contentWidth: number =
                        (this.parent.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetWidth;
                    let horizontalOverflow: boolean = contentWidth < tableWidth;
                    //let verticalOverflow: boolean = contentHeight < tableHeight;
                    let commonOverflow: boolean = horizontalOverflow && ((gridHeight - tableHeight) < 18) ? true : false;
                    if (gridHeight >= tableHeight && (horizontalOverflow ? gridHeight >= contentHeight : true) &&
                        !commonOverflow) {
                        this.parent.grid.height = 'auto';
                    } else {
                        this.parent.grid.height = gridHeight;
                        this.parent.grid.dataBind();
                    }
                    this.parent.grid.widthService.refreshFrozenScrollbar();
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
        let singleValueFormat: string = this.parent.dataSourceSettings.values.length === 1 &&
            !this.parent.dataSourceSettings.alwaysShowValueHeader ?
            this.formatList[this.parent.dataSourceSettings.values[0].name] : undefined;
        let integrateModel: ColumnModel[] = [];
        if ((this.parent.dataType === 'olap' ? true : this.parent.dataSourceSettings.values.length > 0) && !this.engine.isEmptyData) {
            let headerCnt: number = this.engine.headerContent.length;
            let headerSplit: Object[] = []; /* eslint-disable-line */
            let splitPos: Object[] = [];    /* eslint-disable-line */
            let colWidth: number = this.calculateColWidth(this.engine.pivotValues ? this.engine.pivotValues[0].length : 0);
            do {
                let columnModel: ColumnModel[] = [];
                let actualCnt: number = 0;
                headerCnt--;
                let colField: IAxisSet[] = this.engine.headerContent[headerCnt];
                if (colField) {
                    for (let cCnt: number = 0; cCnt < Object.keys(colField).length + (colField[0] ? 0 : 1); cCnt++) {
                        let colSpan: number = (colField[cCnt] && colField[cCnt].colSpan) ?
                            ((colField[cCnt].memberType !== 3 || headerCnt === 0) ?
                                colField[cCnt].colSpan : headerSplit[cCnt] as number) : 1;
                        colSpan = this.parent.dataType === 'olap' ? 1 : colSpan;
                        let formattedText: string = colField[cCnt] ? (colField[cCnt].type === 'grand sum' ?
                            (isNullOrUndefined(colField[cCnt].valueSort.axis) ? this.parent.localeObj.getConstant('grandTotal') :
                                colField[cCnt].formattedText) : (colField[cCnt].type === 'sum' ?
                                    colField[cCnt].formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total') :
                                    colField[cCnt].formattedText)) : '';
                        if (headerCnt === this.engine.headerContent.length - 1) {
                            colSpan = 1;
                            columnModel[actualCnt] = {
                                field: (cCnt + '.formattedText'),
                                headerText: formattedText,
                                customAttributes: { 'cell': colField[cCnt] },
                                /* eslint-disable-next-line */
                                width: colField[cCnt] ? this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) : this.resColWidth,
                                minWidth: 30,
                                format: cCnt === 0 ? '' : (isNullOrUndefined(singleValueFormat) ? this.formatList[colField[cCnt].actualText] : singleValueFormat),
                                allowReordering: (this.parent.showGroupingBar ? false : this.parent.gridSettings.allowReordering),
                                allowResizing: this.parent.gridSettings.allowResizing,
                                visible: true
                            };
                        } else if (headerSplit[cCnt]) {
                            colSpan = (colField[cCnt] && colField[cCnt].type === 'grand sum' &&
                                colField[cCnt].memberType === 2) ? 1 : colSpan;
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
                                        /* eslint-disable-next-line */
                                        field: colField[cCnt] ? (colField[cCnt].valueSort as any).levelName : '',
                                        customAttributes: { 'cell': colField[cCnt] },
                                        /* eslint-disable-next-line */
                                        width: colField[cCnt] ? this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) :
                                            this.resColWidth,
                                        minWidth: 30,
                                        allowReordering: (this.parent.showGroupingBar ? false : this.parent.gridSettings.allowReordering),
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
            let lastColumn: ColumnModel = integrateModel[integrateModel.length - 1];
            lastColumn.minWidth = lastColumn.width;
            lastColumn.width = 'auto';
            if (lastColumn.columns && lastColumn.columns.length > 0) {
                this.configLastColumnWidth((lastColumn.columns as ColumnModel[])[lastColumn.columns.length - 1]);
            }
        }
        this.parent.triggerColumnRenderEvent(integrateModel);
        return integrateModel;
    }

    private configLastColumnWidth(column: ColumnModel): void {
        column.minWidth = column.width;
        column.width = 'auto';
        if (column.columns && column.columns.length > 0) {
            this.configLastColumnWidth((column.columns as ColumnModel[])[column.columns.length - 1]);
        }
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public setSavedWidth(column: string, width: number): number {
        if (column === '0.formattedText' && !isNullOrUndefined(this.parent.resizedValue)) {
            width = this.parent.resizedValue
        } else {
            width = this.parent.resizeInfo[column] ? this.parent.resizeInfo[column] : width;
        }
        return width;
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public frameEmptyColumns(): ColumnModel[] {
        let columns: ColumnModel[] = [];
        let colWidth: number = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: this.resColWidth });
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    }

    /* eslint-disable-next-line */
    /** @hidden */
    public getFormatList(): { [key: string]: string } {
        let formatArray: { [key: string]: string } = {};
        for (let vCnt: number = 0; vCnt < this.parent.dataSourceSettings.values.length; vCnt++) {
            let field: IFieldOptions = this.parent.dataSourceSettings.values[vCnt];
            let format: string = 'N';
            if (this.parent.dataType === 'olap') {
                if (this.parent.olapEngineModule.fieldList[field.name] && !isNullOrUndefined(this.parent.olapEngineModule.fieldList[field.name].formatString)) {
                    let fString: string = this.parent.olapEngineModule.fieldList[field.name].formatString;
                    format = fString.indexOf('#') > -1 ? fString : (fString[0] + '2');
                }
            } else {
                if ((['PercentageOfDifferenceFrom', 'PercentageOfRowTotal', 'PercentageOfColumnTotal', 'PercentageOfGrandTotal', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal']).indexOf(field.type) > -1) {
                    format = 'P2';
                } else if (['PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar', 'Index'].indexOf(field.type) > -1) {
                    format = undefined;
                }
                if (this.parent.dataSourceSettings.formatSettings.length > 0) {
                    for (let fCnt: number = 0; fCnt < this.parent.dataSourceSettings.formatSettings.length; fCnt++) {
                        let formatSettings: IFormatSettings = this.parent.dataSourceSettings.formatSettings[fCnt];
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

    private getValidHeader(args: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs, axis: string): any {
        let values: FieldOptionsModel[] = this.parent.dataSourceSettings.values;
        if (axis === 'row') {
            let cellInfo: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs = args as ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs;
            if (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) {
                if (this.parent.dataSourceSettings.rows.length === 0 && this.parent.dataSourceSettings.valueAxis === 'row' && (this.parent.localeObj.getConstant('grandTotal') +
                    this.parent.dataSourceSettings.valueSortSettings.headerDelimiter + cellInfo.value) === ((cellInfo.data as IGridValues)[0] as IAxisSet).valueSort.levelName) {
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[cellInfo.value.toString()].aggregateType)
                        + ' ' + this.parent.localeObj.getConstant('of') + ' ' + cellInfo.value.toString();
                } else if (values.length === 1 && this.parent.dataSourceSettings.rows.length === 0) {
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values[values.length - 1].type)
                        + ' ' + this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values[values.length - 1].caption) ? values[values.length - 1].caption : values[values.length - 1].name);
                }
            }
            return cellInfo.value;
        } else if (axis === 'column') {
            let cellInfo: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs = args as ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs;
            if (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0) {
                if (!isNullOrUndefined(((args as any).gridCell as any).column.customAttributes) && this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column' &&
                    (this.parent.localeObj.getConstant('grandTotal') + this.parent.dataSourceSettings.valueSortSettings.headerDelimiter + (cellInfo.gridCell as any).column.customAttributes.cell.formattedText)
                    === (cellInfo.gridCell as any).column.customAttributes.cell.valueSort.levelName) {
                    return this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(this.parent.engineModule.fieldList[(cellInfo
                        .gridCell as any).column.customAttributes.cell.actualText].aggregateType) + ' ' + this.parent.localeObj.getConstant('of') + ' ' + (cellInfo.gridCell as any).column.customAttributes.cell.formattedText;
                }
            }
            return ((cellInfo as any).cell).value;
        }
    }

    /* eslint-disable */
    private excelColumnEvent(args: ExcelHeaderQueryCellInfoEventArgs): void {
        if (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column') {
            ((args as any).cell).value = this.getValidHeader(args, 'column');
        }
        if (args.gridCell !== undefined && (args.gridCell as any).column.width === 'auto') {
            this.parent.lastColumn = (args.gridCell as any).column;
            (args.gridCell as any).column.width = (args.gridCell as any).column.minWidth;
        }
        args = this.exportHeaderEvent(args);
        this.parent.trigger(events.excelHeaderQueryCellInfo, args);
    }

    private pdfColumnEvent(args: PdfHeaderQueryCellInfoEventArgs): void {
        if (this.parent.dataSourceSettings.columns.length === 0 && this.parent.dataSourceSettings.valueAxis === 'column') {
            ((args as any).cell).value = this.getValidHeader(args, 'column');
        }
        if (args.gridCell !== undefined && (args.gridCell as any).column.width === 'auto') {
            this.parent.lastColumn = (args.gridCell as any).column;
            (args.gridCell as any).column.width = (args.gridCell as any).column.minWidth;
        }
        this.parent.trigger(events.pdfHeaderQueryCellInfo, args);
    }

    /* eslint-enable */
    private excelRowEvent(args: ExcelQueryCellInfoEventArgs): void {
        if (args.column.field === '0.formattedText') {
            /* eslint-disable-next-line */
            let cell: IAxisSet = (args.data as IAxisSet[])[0];
            let isValueCell: boolean = cell.type && cell.type === 'value';
            let level: number = 0;
            if (this.parent.dataType === 'olap') {
                level = this.indentCollection[cell.rowIndex];
            } else {
                let levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                let memberPos: number = cell.actualText ?
                    cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                let levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
                    (memberPos ? memberPos - 1 : memberPos);
                level = levelPosition ? (levelPosition - 1) : 0;
            }
            this.colPos = 0;
            args.style = { hAlign: 'Left', indent: level * 2 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        } else {
            this.colPos++;
            /* eslint-disable-next-line */
            let pivotValue: IAxisSet = (<any>args.data)[this.colPos];
            if (isNullOrUndefined(pivotValue.value) || isNullOrUndefined(pivotValue.formattedText) || pivotValue.formattedText === "") {
                args.value = this.parent.exportType === 'Excel' ? null : '';
            } else {
                let aggMatrix: IMatrix2D = this.parent.dataType === 'pivot' && this.parent.engineModule ? this.parent.engineModule.aggregatedValueMatrix : undefined;
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private pdfRowEvent(args: PdfQueryCellInfoEventArgs): void {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            let level: number = 0;
            /* eslint-disable-next-line */
            let cell: IAxisSet = (args.data as IAxisSet[])[0];
            let isValueCell: boolean = cell.type && cell.type === 'value';
            if (this.parent.dataType === 'olap') {
                level = this.indentCollection[cell.rowIndex];
            } else {
                let levelName: string = cell.valueSort ? cell.valueSort.levelName.toString() : '';
                let memberPos: number = cell.actualText ?
                    cell.actualText.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length : 0;
                let levelPosition: number = levelName.split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter).length -
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
        let excelRows: ExcelRow[] = args.excelRows;
        let rowStartPos: number = Object.keys(this.engine.headerContent).length;
        for (let i: number = 0; i < rowStartPos; i++) {
            let cells: any = excelRows[i].cells;
            let tmpCell: any = [];
            for (let j: number = 0; j < cells.length; j++) {
                if (cells[j].rowSpan !== -1) {
                    tmpCell.push(cells[j]);
                }
            }
            excelRows[i].cells = tmpCell;
        }
    }

    private exportHeaderEvent(args: ExcelHeaderQueryCellInfoEventArgs | PdfHeaderQueryCellInfoEventArgs): any {
        let rowSpan: number = 1;
        if (((args as any).gridCell as any).column.customAttributes) {
            let cell: IAxisSet = ((args as any).gridCell as any).column.customAttributes.cell;
            if (this.actualText !== cell.actualText && cell.colSpan > 1 && cell.level > -1) {
                ((args as any).gridCell as any).colSpan = (args.cell as any).colSpan = cell.colSpan > -1 ? cell.colSpan : 1;
            }
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

    private exportContentEvent(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): any {    /* eslint-disable-line */
        let cell: IAxisSet = (<any>args).data[Number(args.column.field.split('.formattedText')[0])];    /* eslint-disable-line */
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
