import { IAxisSet, IGridValues, IPivotValues, IValueSortSettings, } from '../../base/engine';
import { PivotEngine, IFieldOptions, IFormatSettings } from '../../base/engine';
import { PivotView } from '../base/pivotview';
import { Reorder, QueryCellInfoEventArgs, headerRefreshed } from '@syncfusion/ej2-grids';
import { Grid, Resize, ColumnModel, Column, ExcelExport, PdfExport, ContextMenu, ResizeArgs, Freeze } from '@syncfusion/ej2-grids';
import { PdfHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ExcelHeaderQueryCellInfoEventArgs, HeaderCellInfoEventArgs, Selection } from '@syncfusion/ej2-grids';
import { createElement, setStyleAttribute, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { DataBoundEventArgs } from '@syncfusion/ej2-navigations';
import { GridSettingsModel } from '../model/gridsettings-model';

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
    /** Constructor for render module */
    constructor(parent: PivotView) {
        this.parent = parent;
        this.engine = parent.engineModule;
        this.gridSettings = parent.gridSettings;
        this.formatList = this.getFormatList();
    }

    /** @hidden */
    /* tslint:enable */
    public render(): void {
        let parent: PivotView = this.parent;
        let engine: PivotEngine = this.parent.engineModule;
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
                columns: this.frameStackedHeaders(), dataSource: parent.dataSource.values.length > 0 && !this.engine.isEmptyData ? engine.valueContent :
                    this.frameDataSource('value')
            }, true);
            /* tslint:enable */
            this.parent.grid.notify('datasource-modified', {});
            this.parent.grid.refreshColumns();
            let e: HTMLElement = this.parent.element.querySelector('.e-movablecontent') as HTMLElement;
            e.querySelector('colGroup').innerHTML =
                this.parent.grid.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
            this.parent.grid.width = this.calculateGridWidth();
            if (this.parent.height > (this.engine.valueContent.length * this.gridSettings.rowHeight)) {
                this.parent.grid.height = 'auto';
            } else {
                this.parent.grid.height = this.parent.height;
            }
        } else {
            this.parent.element.innerHTML = '';
            this.bindGrid(this.parent, (this.engine.isEmptyData ? true : false));
            this.parent.element.appendChild(createElement('div', { id: this.parent.element.id + '_grid' }));
            this.parent.grid.appendTo('#' + this.parent.element.id + '_grid');
        }
        /* tslint:disable */
        this.parent.grid.on(headerRefreshed, function (): void {
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
        }, this);
    }
    /** @hidden */
    public bindGrid(parent: PivotView, isEmpty: boolean): void {
        this.injectGridModules(parent);
        this.parent.grid = new Grid({
            frozenColumns: 1,
            frozenRows: 0,
            dataSource: isEmpty ? this.frameEmptyData() : this.frameDataSource('value'),
            columns: isEmpty ? this.frameEmptyColumns() : this.frameStackedHeaders(),
            height: ((this.engine && (parent.height > (this.engine.valueContent.length * this.gridSettings.rowHeight)))
                || isEmpty) ? 'auto' : parent.height,
            width: isEmpty ? this.parent.width : this.calculateGridWidth(),
            locale: parent.locale,
            enableRtl: parent.enableRtl,
            allowExcelExport: parent.allowExcelExport,
            allowPdfExport: parent.allowPdfExport,
            allowResizing: this.gridSettings.allowResizing,
            allowTextWrap: this.gridSettings.allowTextWrap,
            allowReordering: this.gridSettings.allowReordering,
            allowSelection: this.gridSettings.allowSelection,
            contextMenuItems: this.gridSettings.contextMenuItems,
            selectedRowIndex: this.gridSettings.selectedRowIndex,
            selectionSettings: this.gridSettings.selectionSettings,
            printMode: this.gridSettings.printMode,
            rowHeight: this.gridSettings.rowHeight,
            gridLines: this.gridSettings.gridLines,
            contextMenuClick: this.gridSettings.contextMenuClick ? this.gridSettings.contextMenuClick.bind(this.parent) : undefined,
            contextMenuOpen: this.gridSettings.contextMenuOpen ? this.gridSettings.contextMenuOpen.bind(this.parent) : undefined,
            beforeCopy: this.gridSettings.beforeCopy ? this.gridSettings.beforeCopy.bind(this.parent) : undefined,
            beforePrint: this.gridSettings.beforePrint ? this.gridSettings.beforePrint.bind(this.parent) : undefined,
            printComplete: this.gridSettings.printComplete ? this.gridSettings.printComplete.bind(this.parent) : undefined,
            rowSelecting: this.gridSettings.rowSelecting ? this.gridSettings.rowSelecting.bind(this.parent) : undefined,
            rowSelected: this.gridSettings.rowSelected ? this.gridSettings.rowSelected.bind(this.parent) : undefined,
            rowDeselecting: this.gridSettings.rowDeselecting ? this.gridSettings.rowDeselecting.bind(this.parent) : undefined,
            rowDeselected: this.gridSettings.rowDeselected ? this.gridSettings.rowDeselected.bind(this.parent) : undefined,
            cellSelecting: this.gridSettings.cellSelecting ? this.gridSettings.cellSelecting.bind(this.parent) : undefined,
            cellSelected: this.gridSettings.cellSelected ? this.gridSettings.cellSelected.bind(this.parent) : undefined,
            cellDeselecting: this.gridSettings.cellDeselecting ? this.gridSettings.cellDeselecting.bind(this.parent) : undefined,
            cellDeselected: this.gridSettings.cellDeselected ? this.gridSettings.cellDeselected.bind(this.parent) : undefined,
            resizeStart: this.gridSettings.resizeStart ? this.gridSettings.resizeStart.bind(this.parent) : undefined,
            columnDragStart: this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined,
            columnDrag: this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined,
            columnDrop: this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined,
            resizing: this.setGroupWidth.bind(this),
            resizeStop: this.onResizeStop.bind(this),
            queryCellInfo: (args: QueryCellInfoEventArgs): void => {
                parent.renderModule.rowCellBoundEvent(args);
            },
            dataBound: (args: DataBoundEventArgs): void => {
                if (parent.element.querySelector('.e-firstcell')) {
                    if (parent.enableRtl) {
                        (parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderRight = 'none';
                    } else {
                        (parent.element.querySelector('.e-firstcell') as HTMLElement).style.borderLeft = 'none';
                    }
                }
                this.parent.grid.widthService.setWidthToTable();
                parent.notify(events.contentReady, {});
            },
            headerCellInfo: (args: HeaderCellInfoEventArgs): void => {
                parent.renderModule.columnCellBoundEvent(args);
            },
            excelHeaderQueryCellInfo: (args: ExcelHeaderQueryCellInfoEventArgs): void => {
                parent.renderModule.excelColumnEvent(args);
            },
            pdfHeaderQueryCellInfo: (args: PdfHeaderQueryCellInfoEventArgs): void => {
                parent.renderModule.pdfColumnEvent(args);
            },
            excelQueryCellInfo: (args: ExcelQueryCellInfoEventArgs): void => {
                parent.renderModule.excelRowEvent(args);
            },
            pdfQueryCellInfo: (args: PdfQueryCellInfoEventArgs): void => {
                parent.renderModule.pdfRowEvent(args);
            }
        });
    }

    private injectGridModules(parent: PivotView): void {
        Grid.Inject(Freeze);
        if (parent.allowExcelExport) {
            Grid.Inject(ExcelExport);
        }
        if (parent.allowPdfExport) {
            Grid.Inject(PdfExport);
        }
        if (this.gridSettings.allowSelection) {
            Grid.Inject(Selection);
        }
        if (this.gridSettings.allowReordering) {
            Grid.Inject(Reorder);
        }
        if (this.gridSettings.allowResizing) {
            Grid.Inject(Resize);
        }
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
        this.parent.grid.contextMenuItems = this.gridSettings.contextMenuItems;
        this.parent.grid.selectedRowIndex = this.gridSettings.selectedRowIndex;
        this.parent.grid.selectionSettings = this.gridSettings.selectionSettings;
        this.parent.grid.printMode = this.gridSettings.printMode;
        this.parent.grid.rowHeight = this.gridSettings.rowHeight;
        this.parent.grid.gridLines = this.gridSettings.gridLines;
    }

    private appendValueSortIcon(cell: IAxisSet, tCell: HTMLElement, rCnt: number, cCnt: number): HTMLElement {
        let vSort: IValueSortSettings = this.parent.dataSource.valueSortSettings;
        let len: number = (cell.type === 'grand sum' && this.parent.dataSource.values.length === 1) ? 0 :
            this.parent.dataSource.values.length > 1 ? (this.parent.engineModule.headerContent.length - 1) :
                this.parent.dataSource.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
        let lock: boolean = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
        if (vSort !== undefined && lock && rCnt === len && this.parent.dataSource.valueAxis === 'column') {
            if (tCell.querySelector('.e-sortfilterdiv')) {
                tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ? 'e-descending' : 'e-ascending');
                tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                    'e-icon-descending' : 'e-icon-ascending');
            } else {
                tCell.appendChild(createElement('div', {
                    className: (vSort.sortOrder === 'Descending' ?
                        'e-icon-descending e-icons e-descending e-sortfilterdiv' : 'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                }));
            }
            if (!isNullOrUndefined(cell.hasChild) && cell.type !== 'grand sum' && tCell.querySelector('.e-expand') &&
                (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'))) {
                let element: HTMLElement = (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'))  as HTMLElement;
                setStyleAttribute(element, {'padding-top': '12px'});
        }
        }
        return tCell;
    }

    private onResizeStop(args: ResizeArgs): void {
        let column: string = args.column.field === '0.formattedText' ? '0.formattedText' :
            (args.column.customAttributes as any).cell.valueSort.levelName;
        this.parent.resizeInfo[column] =
            Number(args.column.width.toString().split('px')[0]);
        this.parent.grid.headerModule.refreshUI();
        this.setGroupWidth(args);
    }

    private setGroupWidth(args: ResizeArgs): void {
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + cls.GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
            if ((this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth < 245) {
                args.cancel = true;
                let gridColumn: Column[] = this.parent.grid.columns as Column[];
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = 250;
                }
                this.parent.element.querySelector('.e-frozenheader').querySelector('col').style.width = '250px';
                this.parent.element.querySelector('.e-frozencontent').querySelector('col').style.width = '250px';
            }
            (this.parent.element.querySelector('.e-group-values') as HTMLElement).style.width =
                (this.parent.element.querySelector('.e-group-row') as HTMLElement).offsetWidth + 'px';
            (this.parent.element.querySelector('.e-group-row') as HTMLElement).style.height =
                (this.parent.element.querySelector('.e-headercontent') as HTMLElement).offsetHeight + 'px';
        }
        this.parent.trigger(args.e.type === 'touchend' || args.e.type === 'mouseup' ? events.resizeStop : events.resizing, args);
    }

    private rowCellBoundEvent(args: QueryCellInfoEventArgs): void {
        let tCell: HTMLElement = args.cell as HTMLElement;
        if (tCell && this.engine) {
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
                if ((this.parent.dataSource.rows.length > 0 &&
                    (cell.valueSort ? Object.keys(cell.valueSort).length > 0 : true))) {
                    fieldName = level > -1 ? this.parent.dataSource.rows[level].name : '';
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
                    innerHTML: localizedText
                }));
                let vSort: IValueSortSettings = this.parent.pivotView.dataSource.valueSortSettings;
                if (vSort && vSort.headerText && this.parent.dataSource.valueAxis === 'row'
                    && (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName) {
                    if ((this.parent.pivotValues[Number(tCell.getAttribute('index'))][0] as IAxisSet).valueSort.levelName
                        === vSort.headerText) {
                        let style: string = (tCell.querySelector('.e-expand') || tCell.querySelector('.e-collapse')) ? 'padding-top: 18px' :
                        'padding-top: 12px';
                        tCell.appendChild(createElement('div', {
                            className: (vSort.sortOrder === 'Descending' ?
                                'e-icon-descending e-icons e-descending e-sortfilterdiv' : 'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                                styles: style
                        }));
                    }
                }
            } else {
                let innerText: string = tCell.innerText.toString() === '0' ? '' : tCell.innerText;
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
                    innerHTML: innerText
                }));
            }
        }
        this.parent.trigger(events.queryCellInfo, args);
    }

    private columnCellBoundEvent(args: HeaderCellInfoEventArgs): void {
        if (args.cell.column && args.cell.column.customAttributes) {
            let cell: IAxisSet = args.cell.column.customAttributes.cell;
            let tCell: HTMLElement = args.node as HTMLElement;
            if (cell) {
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
                if (!(this.parent.dataSource.values && this.parent.dataSource.valueAxis === 'column' && this.parent.dataSource.values.length > 1 &&
                    (cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSource.columns &&
                    this.parent.dataSource.columns.length > 0) {
                    fieldName = level > -1 ? this.parent.dataSource.columns[level].name : '';
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
            }
        }
        this.parent.trigger(events.headerCellInfo, args);
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
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
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

    private frameEmptyData(): any[] {
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
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.grid && this.parent.dataSource.rows.length > 0) {
            let gridColumn: Column[] = this.parent.grid.columns as Column[];
            parWidth = parWidth - (gridColumn[0].width as number);
            colCount = colCount - 1;
        }
        let colWidth: number = (colCount * this.gridSettings.columnWidth + 80) < parWidth ?
            (parWidth / colCount) : this.gridSettings.columnWidth;
        return colWidth;
    }

    public calculateGridWidth(): number | string {
        let colTotWidth: number = (this.engine.pivotValues[0].length * this.gridSettings.columnWidth + 80);
        let parWidth: number | string = this.parent.width;
        if (this.parent.width === 'auto' && this.parent.element.offsetWidth < colTotWidth) {
            parWidth = this.parent.element.offsetWidth;
        }
        return parWidth;
    }

    public frameStackedHeaders(): ColumnModel[] {
        let integrateModel: ColumnModel[] = [];
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
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
                        let formattedText: string = colField[cCnt] ? (colField[cCnt].type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                            (colField[cCnt].type === 'sum' ? colField[cCnt].formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total') :
                                colField[cCnt].formattedText)) : '';
                        if (headerCnt === this.engine.headerContent.length - 1) {
                            columnModel[actualCnt] = {
                                field: (cCnt + '.formattedText'),
                                headerText: formattedText,
                                customAttributes: { 'cell': colField[cCnt] },
                                width: colField[cCnt] ?
                                    this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) : colWidth,
                                minWidth: 30,
                                format: cCnt === 0 ? '' : this.formatList[(cCnt - 1) % this.parent.dataSource.values.length]
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
                                        width: colField[cCnt] ?
                                            this.setSavedWidth((colField[cCnt].valueSort as any).levelName, colWidth) : colWidth,
                                        minWidth: 30
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
                width: this.setSavedWidth('0.formattedText', (this.parent.showGroupingBar && this.parent.groupingBarModule) ?
                    colWidth < 250 ? 250 : colWidth : colWidth < 200 ? 200 : colWidth),
                minWidth: 30,
                headerText: '',
                allowReordering: false
            };
        } else {
            integrateModel = this.frameEmptyColumns();
        }
        return integrateModel;
    }

    private setSavedWidth(column: string, width: number): number {
        width = this.parent.resizeInfo[column] ? this.parent.resizeInfo[column] : width;
        return width;
    }

    private frameEmptyColumns(): ColumnModel[] {
        let columns: ColumnModel[] = [];
        let colWidth: number = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: colWidth });
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    }

    /** @hidden */
    public getFormatList(): string[] {
        let formatArray: string[] = [];
        for (let vCnt: number = 0; vCnt < this.parent.dataSource.values.length; vCnt++) {
            let field: IFieldOptions = this.parent.dataSource.values[vCnt];
            if (this.parent.dataSource.formatSettings.length > 0) {
                let format: string = '';
                for (let fCnt: number = 0; fCnt < this.parent.dataSource.formatSettings.length; fCnt++) {
                    let formatSettings: IFormatSettings = this.parent.dataSource.formatSettings[fCnt];
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
            this.colPos = 0;
            args.style = { hAlign: 'Left', indent: (args.data as IAxisSet[])[0].level * 2 };
        } else {
            this.colPos++;
            args.value = (<any>args.data)[this.colPos].value || (<any>args.data)[this.colPos].formattedText;
        }
        args = this.exportContentEvent(args);
        this.parent.trigger(events.excelQueryCellInfo, args);
    }
    /* tslint:disable:no-any */
    private pdfRowEvent(args: PdfQueryCellInfoEventArgs): void {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            args.style = { paragraphIndent: ((args as any).data as IAxisSet[])[0].level * 10 };
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
        if (args.value === '0') {
            args.value = '';
        }
        args.value = (<any>args).data[Number(args.column.field.split('.formattedText')[0])].type === 'grand sum' ?
            this.parent.localeObj.getConstant('grandTotal') : args.value;
        return args;
    }
}
