import { extend, Internationalization, isNullOrUndefined, L10n, Ajax } from '@syncfusion/ej2-base';
import { PivotUtil } from '../util';
import { MDXQuery } from './mdx-query';
import { IField, IDataOptions, IMembers, IDrillOptions, IDrilledItem, IFieldOptions, IPageSettings, ISort, IPivotRows, IDataSet } from '../engine';
import { IAxisSet, IGridValues, IPivotValues, IFilter, ICustomProperties, IValueSortSettings, ICalculatedFieldSettings } from '../engine';
import { IFormatSettings, IMatrix2D } from '../engine';
import * as cls from '../../common/base/css-constant';
import { Sorting, SummaryTypes } from '../types';
import { ExportPageSize, HeadersSortEventArgs } from '../../common/base/interface';

/**
 * OlapEngine is used to manipulate the olap or Multi-Dimensional data as pivoting values.
 */

/** @hidden */
export class OlapEngine {

    /** @hidden */
    public isEmptyData: boolean;
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public fieldList: IOlapFieldListOptions = {};
    /** @hidden */
    public fields: string[];
    /** @hidden */
    public rows: IFieldOptions[];
    /** @hidden */
    public columns: IFieldOptions[];
    /** @hidden */
    public values: IFieldOptions[];
    /** @hidden */
    public filters: IFieldOptions[];
    /** @hidden */
    public calculatedFieldSettings: ICalculatedFieldSettings[];
    /** @hidden */
    public isMutiMeasures: boolean;
    /** @hidden */
    public drilledMembers: IDrillOptions[];
    /** @hidden */
    public valueSortSettings: IValueSortSettings;
    /** @hidden */
    public isEngineUpdated: boolean;
    /** @hidden */
    public savedFieldList: IOlapFieldListOptions;
    /** @hidden */
    public savedFieldListData: IOlapField[];
    /** @hidden */
    public valueAxis: string;
    /** @hidden */
    public columnCount: number = 0;
    /** @hidden */
    public rowCount: number = 0;
    /** @hidden */
    public colFirstLvl: number = 0;
    /** @hidden */
    public rowFirstLvl: number = 0;
    /** @hidden */
    public pageColStartPos: number = 0;
    /** @hidden */
    public enableSort: boolean = false;
    /** @hidden */
    public enableValueSorting: boolean = false;
    /** @hidden */
    public isHeaderAvail: boolean;
    /** @hidden */
    public fieldListData: IOlapField[];
    /** @hidden */
    public fieldListObj: FieldData;
    /** @hidden */
    public dataFields: { [key: string]: IFieldOptions } = {};
    /** @hidden */
    public formats: IFormatSettings[];
    /** @hidden */
    public formatFields: { [key: string]: IFormatSettings } = {};
    /** @hidden */
    public emptyCellTextContent: string;
    /** @hidden */
    public isMondrian: boolean;
    /** @hidden */
    public olapValueAxis: string;
    /** @hidden */
    public isMeasureAvail: boolean;
    /** @hidden */
    public selectedItems: string[];
    /** @hidden */
    public filterSettings: IFilter[];
    /** @hidden */
    public sortSettings: ISort[];
    /** @hidden */
    public filterMembers: { [key: string]: string[] | IFilter[] } = {};
    /** @hidden */
    public allowMemberFilter: boolean;
    /** @hidden */
    public allowLabelFilter: boolean;
    /** @hidden */
    public allowValueFilter: boolean;
    /** @hidden */
    public mdxQuery: string;
    /** @hidden */
    public isPaging: boolean;
    /** @hidden */
    public exportSpeciedPages: ExportPageSize;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public calcChildMembers: IOlapField[];
    /** @hidden */
    public drilledSets: { [key: string]: HTMLElement } = {};
    /** @hidden */
    public olapVirtualization: boolean;
    /** @hidden */
    public isExporting: boolean = false;
    /** @hidden */
    public measureIndex: number;
    private measurePosition: number;
    private showSubTotalsAtTop: boolean;
    private showSubTotalsAtBottom: boolean;
    public aggregatedValueMatrix: IMatrix2D = [];
    private localeObj: L10n;
    private measureReportItems: string[];
    private locale: string;
    private olapRowValueIndex: number;
    private mappingFields: { [key: string]: IFieldOptions } = {};
    private formatRegex: RegExp = /^(?:[ncpae])(?:([0-9]|1[0-9]|20))?$/i;
    private clonedValTuple: Element[] = [];
    private clonedColumnTuple: Element[] = [];
    private clonedRowTuple: Element[] = [];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** @hidden */
    public xmlaCellSet: NodeListOf<Element>;
    /** @hidden */
    public pivotValues: IAxisSet[][] = [];
    /** @hidden */
    public dataSourceSettings: IDataOptions;
    /** @hidden */
    public valueContent: IGridValues = [];
    /** @hidden */
    public headerContent: IGridValues = [];
    /** @hidden */
    public colMeasurePos: number;
    /** @hidden */
    public rowStartPos: number = 0;
    /** @hidden */
    public pageRowStartPos: number = 0;
    /** @hidden */
    public rowMeasurePos: number;
    /** @hidden */
    public tupColumnInfo: ITupInfo[] = [];
    /** @hidden */
    public tupRowInfo: ITupInfo[] = [];
    /** @hidden */
    public gridJSON: string = '';
    /** @hidden */
    public namedSetsPosition: { [key: string]: { [key: number]: string } } = {};
    /** @hidden */
    public errorInfo: string | Error;
    /** @hidden */
    public colDepth: number = 0;
    private totalCollection: ITotCollection[] = [];
    private parentObjCollection: IParentObjCollection = {};
    private colMeasures: { [key: string]: Element };
    private curDrillEndPos: number = -1;
    private headerGrouping: { [key: number]: { UName: { [key: number]: string }; Caption: { [key: number]: string } } } = {};
    private lastLevel: number[] = [];
    private xmlDoc: Document;
    private request: Ajax;
    private customArgs: FieldData;
    private onDemandDrillEngine: IAxisSet[][];
    private showRowSubTotals: boolean = true;
    private showColumnSubTotals: boolean = true;
    private hideRowTotalsObject: { [key: string]: number } = {};
    private hideColumnTotalsObject: { [key: string]: number } = {};
    private sortObject: { [key: string]: string } = {};
    private isColDrill: boolean = false;
    private getHeaderSortInfo: Function;
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public renderEngine(dataSourceSettings?: IDataOptions, customProperties?: IOlapCustomProperties, onHeadersSort?: Function): void {
        this.isEmptyData = false;
        this.getHeaderSortInfo = onHeadersSort;
        this.mdxQuery = '';
        this.isMeasureAvail = false;
        this.allowMemberFilter = false;
        this.allowLabelFilter = false;
        this.allowValueFilter = false;
        this.isMondrian = false;
        this.aggregatedValueMatrix = [];
        this.measureReportItems = [];
        this.calcChildMembers = [];
        this.selectedItems = [];
        this.savedFieldList = undefined;
        this.savedFieldListData = undefined;
        this.formatFields = {};
        this.filterMembers = {};
        this.dataFields = {};
        this.valueAxis = '';
        this.columnCount = 0;
        this.rowCount = 0;
        this.colFirstLvl = 0;
        this.rowFirstLvl = 0;
        this.pageColStartPos = 0;
        this.sortObject = {};
        this.globalize = new Internationalization();
        this.locale = this.globalize.culture ? this.globalize.culture : 'en-US';
        this.localeObj = customProperties ? customProperties.localeObj : undefined;
        this.enableValueSorting = customProperties ? customProperties.enableValueSorting : false;
        if (dataSourceSettings.url) {
            // this.isMondrian = (dataSourceSettings.providerType === 'mondrian');
            this.dataSourceSettings = dataSourceSettings;
            this.measureIndex = !isNullOrUndefined(dataSourceSettings.valueIndex) ? dataSourceSettings.valueIndex : -1;
            this.valueAxis = dataSourceSettings.valueAxis === 'row' ? 'row' : 'column';
            this.getAxisFields();
            this.formats = dataSourceSettings.formatSettings ? dataSourceSettings.formatSettings : [];
            this.enableSort = dataSourceSettings.enableSorting === undefined ? true : dataSourceSettings.enableSorting;
            this.valueSortSettings = dataSourceSettings.valueSortSettings ? dataSourceSettings.valueSortSettings : undefined;
            this.filterSettings = dataSourceSettings.filterSettings ? dataSourceSettings.filterSettings : [];
            this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
            this.allowMemberFilter = dataSourceSettings.allowMemberFilter ? true : false;
            this.allowLabelFilter = dataSourceSettings.allowLabelFilter ? true : false;
            this.allowValueFilter = dataSourceSettings.allowValueFilter ? true : false;
            this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
            this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
            this.emptyCellTextContent = dataSourceSettings.emptyCellsTextContent ? dataSourceSettings.emptyCellsTextContent : '';
            this.pageSettings = customProperties ? (customProperties.pageSettings ?
                customProperties.pageSettings : this.pageSettings) : undefined;
            this.isPaging = this.pageSettings && (customProperties.enablePaging || customProperties.enableVirtualization) ? true : false;
            this.frameSortObject();
            this.getFormattedFields(this.formats);
            this.savedFieldList = customProperties ? customProperties.savedFieldList : undefined;
            this.savedFieldListData = customProperties ? customProperties.savedFieldListData : undefined;
            this.fieldListData = [];
            this.fieldListObj = {};
            this.setNamedSetsPosition();
            if (!(this.savedFieldList && this.savedFieldListData)) {
                this.getCubes(dataSourceSettings);
                this.getFieldList(dataSourceSettings);
            } else {
                this.updateFieldlist(true);
            }
            this.loadCalculatedMemberElements(this.calculatedFieldSettings);
            const measuresInfo: IMeasureInfo = this.getMeasureInfo();
            this.olapVirtualization = this.isPaging && dataSourceSettings.showSubTotals && (measuresInfo.measureIndex === (
                measuresInfo.measureAxis === 'column' ? dataSourceSettings.columns.length - 1 : dataSourceSettings.rows.length - 1
            )) && !isNullOrUndefined(this.pageSettings) && dataSourceSettings.showGrandTotals;
            this.isPaging = this.isPaging ? !this.olapVirtualization : this.isPaging;
            this.measureReportItems = [];
            // this.updateAllMembers(dataSourceSettings, this.filters);
            this.updateFilterItems(this.filterSettings);
            this.generateGridData(dataSourceSettings);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public generateGridData(dataSourceSettings: IDataOptions, action?: string): void {
        const refPaging: boolean = (action && action === 'navPaging' &&
            this.isPaging && this.pageSettings !== undefined ? true : false);
        if (this.rows.length > 0 || this.columns.length > 0 || this.values.length > 0 || this.filters.length > 0) {
            MDXQuery.getCellSets(dataSourceSettings, this, refPaging);
        } else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
            this.generateEngine(undefined, undefined, { dataSourceSettings: dataSourceSettings, action: 'loadTableElements' });
        }
    }
    public generatePagingData(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        const xmlaCellSet: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axes, CellData'));
        // this.rowCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length : 0);
        // this.columnCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length : 0);
        const countCells: NodeListOf<Element> = xmlaCellSet[1] ? xmlaCellSet[1].querySelectorAll('FmtValue') : null;
        if (countCells && countCells.length > 0) {
            this.columnCount = Number(countCells[0].textContent);
            this.rowCount = Number(countCells[1].textContent);
        }
        const dataSourceSettings: IDataOptions = customArgs.dataSourceSettings;
        MDXQuery.getCellSets(dataSourceSettings, this, true);
    }
    public scrollPage(): void {
        if (this.olapVirtualization) {
            const virtualScrollingData: VirtualScrollingData = this.getVirtualScrollingData(this.clonedColumnTuple, this.clonedRowTuple);
            if (virtualScrollingData.isCalculated) {
                this.pivotValues = [];
                this.clearEngineProperties();
                this.performEngine(virtualScrollingData.columnTuple, virtualScrollingData.rowTuple, virtualScrollingData.valueTuple);
            }
            this.pivotValues = this.pivotValues.slice();
        } else {
            MDXQuery.getCellSets(this.dataSourceSettings, this, true);
        }
    }
    private getVirtualScrollingData(colTuples: Element[], rowTuples: Element[]): VirtualScrollingData {
        let valTuples: Element[] = this.clonedValTuple.slice();
        let isCalculated: boolean = false;
        let calColPage: number = (this.pageSettings.currentColumnPage - 1) * this.pageSettings.columnPageSize;
        let calRowPage: number = (this.pageSettings.currentRowPage - 1) * this.pageSettings.rowPageSize;
        const calColSize: number = this.pageSettings.columnPageSize * 3;
        const calRowSize: number = this.pageSettings.rowPageSize * 3;
        calColPage = (this.columnCount < (calColPage + calColSize)) ?
            (this.columnCount > calColSize ? (this.columnCount - calColSize) : 0) : calColPage;
        calRowPage = (this.rowCount < (calRowPage + calRowSize)) ?
            (this.rowCount > calRowSize ? (this.rowCount - calRowSize) : 0) : calRowPage;
        if ((calColPage !== this.pageColStartPos || calRowPage !== this.pageRowStartPos) ||
            !(colTuples.length <= calColSize && rowTuples.length <= calRowSize)) {
            isCalculated = true;
            const measureInfo: IMeasureInfo = this.getMeasureInfo();
            const isColGrandTolExists: boolean = !isNullOrUndefined(colTuples[0]) &&
                (Number(colTuples[0].querySelectorAll('Member')[0].querySelector('LNum').textContent) === 0);
            const isRowGrandTolExists: boolean = !isNullOrUndefined(rowTuples[0]) &&
                (Number(rowTuples[0].querySelectorAll('Member')[0].querySelector('LNum').textContent) === 0);
            const isAddColGrandTotals: boolean = isColGrandTolExists ? (calColPage + calColSize >= colTuples.length - 1) : false;
            const isAddRowGrandTotals: boolean = isRowGrandTolExists ? (calRowPage + calRowSize >= rowTuples.length - 1) : false;
            const colDepth: number = isColGrandTolExists ?
                this.getAxisdepth(colTuples) : measureInfo.measureAxis === 'column' ? measureInfo.valueInfo.length : 1;
            const rowDepth: number = isRowGrandTolExists ?
                this.getAxisdepth(rowTuples) : measureInfo.measureAxis === 'row' ? measureInfo.valueInfo.length : 1 ;
            let colTuplesOffset: number = (isColGrandTolExists ? colDepth : 0) + calColPage;
            let rowTuplesOffset: number = (isRowGrandTolExists ? rowDepth : 0) + calRowPage;
            let virtualColTuples: Element[] = colTuples.slice(colTuplesOffset, colTuplesOffset + calColSize);
            let virtualRowTuples: Element[] = rowTuples.slice(rowTuplesOffset, rowTuplesOffset + calRowSize);
            const colLastLevel: number = virtualColTuples[0] ?
                Number(virtualColTuples[0].querySelectorAll('Member')[0].querySelector('LNum').textContent) : 0;
            const rowLastLevel: number = virtualRowTuples[0] ?
                Number(virtualRowTuples[0].querySelectorAll('Member')[0].querySelector('LNum').textContent) : 0;
            const colData: VirtualTotals = this.getVirtualTotals(
                colTuples.slice(0, colTuplesOffset), colLastLevel, isAddColGrandTotals, 'column', colDepth
            );
            const rowData: VirtualTotals = this.getVirtualTotals(
                rowTuples.slice(0, rowTuplesOffset), rowLastLevel, isAddRowGrandTotals, 'row', rowDepth
            );
            colTuplesOffset = virtualColTuples.length + colData.totalsCollection.length > calColSize ?
                Math.max(virtualColTuples.length + colData.totalsCollection.length - calColSize) : 0;
            rowTuplesOffset = virtualRowTuples.length + rowData.totalsCollection.length > calRowSize ?
                Math.max(virtualRowTuples.length + rowData.totalsCollection.length - calRowSize) : 0;
            virtualColTuples = colData.totalsCollection.concat(virtualColTuples.slice(colTuplesOffset, virtualColTuples.length));
            virtualRowTuples = rowData.totalsCollection.concat(virtualRowTuples.slice(rowTuplesOffset, virtualRowTuples.length));
            const virtualValuesTupples: Element[] = this.getVirtualValues(
                valTuples, calColPage + colTuplesOffset, calRowPage + rowTuplesOffset, calColSize, calRowSize,
                colData.indexCollection, rowData.indexCollection, colTuples.length, rowTuples.length, colDepth,
                rowDepth, isRowGrandTolExists
            );
            colTuples = virtualColTuples.slice();
            rowTuples = virtualRowTuples.slice();
            valTuples = virtualValuesTupples.slice();
        }
        this.pageColStartPos = calColPage;
        this.pageRowStartPos = calRowPage;
        return {
            columnTuple: colTuples,
            rowTuple : rowTuples,
            valueTuple: valTuples,
            isCalculated: isCalculated
        };
    }
    private getAxisdepth(tuplesCollection: Element[]): number {
        let depth: number = 0;
        for (let i: number = 0; i < tuplesCollection.length; i++) {
            const level: number = Number(tuplesCollection[i as number].querySelectorAll('Member')[0].querySelector('LNum').textContent);
            if (level === 0) {
                depth++;
            } else {
                break;
            }
        }
        return depth;
    }
    private getVirtualTotals(
        tuplesCollection: Element[], lastLevel: number, isAddGrandTotals: boolean, axis: string, axisDepth: number
    ): VirtualTotals {
        let totalsCollection: Element[] = [];
        let indexCollection: number[] = [];
        if (lastLevel !== 1) {
            for (let i: number = tuplesCollection.length - 1; i > 0; i--) {
                const currLevel: number = Number(tuplesCollection[i as number].querySelectorAll('Member')[0].querySelector('LNum').textContent);
                if (currLevel === 0) {
                    break;
                } else if (lastLevel > currLevel) {
                    lastLevel = currLevel;
                    const nextLevel: number = Number(tuplesCollection[i - 1].querySelectorAll('Member')[0].querySelector('LNum').textContent);
                    if (nextLevel === currLevel) {
                        for (let offset: number = 0; offset < axisDepth; offset++) {
                            totalsCollection[totalsCollection.length] = tuplesCollection[i - offset];
                            indexCollection[indexCollection.length] = i - offset;
                        }
                        i = axisDepth > 1 ? i - (axisDepth - 1) : i;
                    } else {
                        totalsCollection[totalsCollection.length] = tuplesCollection[i as number];
                        indexCollection[indexCollection.length] = i;
                    }
                } else if (currLevel === 1) {
                    break;
                }
            }
        }
        if (isAddGrandTotals) {
            for (let i: number = axisDepth; i > 0; i--) {
                totalsCollection = totalsCollection.concat([tuplesCollection[i - 1]]);
                indexCollection = indexCollection.concat([i - 1]);
            }
        }
        return {
            totalsCollection: totalsCollection.reverse(),
            indexCollection: indexCollection.reverse()
        };
    }
    private getVirtualValues(
        valueTuples: Element[], calColumnPage: number, calRowPage: number, calColunmnSize: number, calRowSize: number,
        colTotalsIndex: number[], rowTotalsIndex: number[], colTuplesLen: number, rowTuplesLen: number, columnDepth: number,
        rowDepth: number, isRowGrandTolExists: boolean
    ): Element[] {
        let framedVirtValTuples: Element[] = [];
        let virtValTuples: Element[] = valueTuples;
        if (rowTuplesLen > calRowSize) {
            const rowValuesOffset: number = ((isRowGrandTolExists ? rowDepth : 0) + calRowPage) * colTuplesLen;
            virtValTuples = valueTuples.slice(rowValuesOffset, rowValuesOffset + (calRowSize * colTuplesLen));
            let virtRowTotalValues: Element[] = [];
            for (let i: number = 0; i < rowTotalsIndex.length; i++) {
                virtRowTotalValues = virtRowTotalValues.concat(valueTuples.slice(
                    rowTotalsIndex[i as number] * colTuplesLen, (rowTotalsIndex[i as number] * colTuplesLen) + colTuplesLen
                ));
            }
            virtValTuples = virtRowTotalValues.concat(virtValTuples);
        }
        for (let i: number = 0, j: number = virtValTuples.length / colTuplesLen; i < j; i++) {
            const rows: Element[] = virtValTuples.slice(i * colTuplesLen, (i * colTuplesLen) + colTuplesLen);
            const virtRows: Element[] = rows.slice(calColumnPage + columnDepth, calColumnPage + columnDepth + calColunmnSize);
            const virtTotals: Element[] = [];
            for (let x: number = 0; x < colTotalsIndex.length; x++) {
                virtTotals[virtTotals.length] = rows[colTotalsIndex[x as number]];
            }
            framedVirtValTuples = framedVirtValTuples.concat(virtTotals.concat(virtRows));
        }
        return framedVirtValTuples;
    }
    public generateEngine(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        if (customArgs.action !== 'down') {
            this.clearEngineProperties();
        }
        this.xmlDoc = xmlDoc ? xmlDoc.cloneNode(true) as Document : undefined;
        this.request = request;
        this.customArgs = customArgs;
        this.parentObjCollection = {};
        this.curDrillEndPos = -1;
        this.onDemandDrillEngine = [];
        this.getSubTotalsVisibility();
        this.xmlaCellSet = xmlDoc ? xmlDoc.querySelectorAll('Axes, CellData') : undefined;
        const columnTuples: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')) : [];
        const rowTuples: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')) : [];
        let valCollection: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 1 ?
            [].slice.call(this.xmlaCellSet[1].querySelectorAll('Cell')) : [];
        if (this.olapVirtualization && !isNullOrUndefined(this.pageSettings)) {
            if (columnTuples.length * rowTuples.length !== valCollection.length) {
                const valueCollection: Element[] = [];
                for (let colPos: number = 0; colPos < valCollection.length; colPos++) {
                    if (!isNullOrUndefined(valCollection[colPos as number])) {
                        valueCollection[Number(valCollection[colPos as number].getAttribute('CellOrdinal'))] = valCollection[colPos as number];
                    }
                }
                valCollection = valueCollection;
            }
            this.clonedValTuple = valCollection;
            let drillInfo: { [key: string]: string[]; } = this.getDrillInfo('columns');
            let columnData: { tupColls: Element[]; indexColls: number[]; } = this.getActualTuples(columnTuples, drillInfo);
            drillInfo = this.getDrillInfo('rows');
            let rowData: { tupColls: Element[]; indexColls: number[]; } = this.getActualTuples(
                rowTuples, drillInfo, columnData.indexColls, columnTuples.length
            );
            this.clonedColumnTuple = columnData.tupColls;
            this.clonedRowTuple = rowData.tupColls;
            this.columnCount = this.clonedColumnTuple.length;
            this.rowCount = this.clonedRowTuple.length;
            columnData = rowData = undefined;
            const virtualScrollingData: VirtualScrollingData = this.getVirtualScrollingData(this.clonedColumnTuple, this.clonedRowTuple);
            this.performEngine(virtualScrollingData.columnTuple, virtualScrollingData.rowTuple, virtualScrollingData.valueTuple);
        } else {
            this.performEngine(columnTuples, rowTuples, valCollection);
        }
    }
    private getDrillInfo(axis: string): { [key: string]: string[] } {
        const drilledMembers: { [key: string]: string[] } = {};
        let fieldColls: string[] = [];
        if (axis === 'columns') {
            fieldColls  = this.dataSourceSettings.columns.map((field: IFieldOptions) => field.name);
        } else if (axis === 'rows') {
            fieldColls  = this.dataSourceSettings.rows.map((field: IFieldOptions) => field.name);
        }
        if (fieldColls.length > 0) {
            for (let i: number = 0, j: number = this.drilledMembers.length; i < j; i++) {
                const drilledMember: IDrillOptions = this.drilledMembers[i as number];
                const index: number = fieldColls.indexOf(drilledMember.name);
                if (index > -1) {
                    if (!drilledMembers[index as number]) {
                        drilledMembers[index as number] = [];
                    }
                    drilledMembers[index as number] = drilledMembers[index as number].concat(drilledMember.items);
                }
            }
        }
        return drilledMembers;
    }
    private getActualTuples(
        tuplesColl: Element[], drillInfo: { [key: string]: string[] }, indexCollection?: number[], deapth?: number
    ): { tupColls: Element[]; indexColls: number[]; } {
        const tupColls: Element[] = [];
        const indexColls: number[] = [];
        let valueCollection: Element[] = [];
        if (tuplesColl.length > 0) {
            for (let i: number = 0, j: number = tuplesColl.length; i < j; i++) {
                const tuples: Element = tuplesColl[i as number];
                let isAddElement: boolean = true;
                let isGrandSum: boolean = false;
                let isSum: boolean = false;
                const memTypeColl: HTMLCollectionOf<Element> = tuples.getElementsByTagName('MEMBER_TYPE');
                const uNameColl: HTMLCollectionOf<Element> = tuples.getElementsByTagName('UName');
                for (let k: number = 0, l: number = memTypeColl.length; k < l; k++) {
                    const memType: number = Number(memTypeColl[k as number].textContent);
                    const uName: string = uNameColl[k as number].textContent;
                    if (isSum && memType < 2) {
                        isAddElement = false;
                    } else if (memType === 2) {
                        isGrandSum = true;
                    } else if (isGrandSum && memType < 2) {
                        isAddElement = false;
                    }
                    if (drillInfo[k as number] && drillInfo[k as number].indexOf(uName) > -1) {
                        isSum = true;
                    }
                    if (!isAddElement) {
                        break;
                    }
                }
                if (isAddElement) {
                    tupColls[tupColls.length] = tuples;
                    if (indexCollection) {
                        const rowColls: Element[] = this.clonedValTuple.slice(i * deapth, (i * deapth) + deapth);
                        valueCollection = valueCollection.concat(indexCollection.map((index: number) => rowColls[index as number]));
                    } else {
                        indexColls[indexColls.length] = i;
                    }
                }
            }
        } else if (indexCollection) {
            const rowColls: Element[] = this.clonedValTuple.slice(0, deapth);
            valueCollection = valueCollection.concat(indexCollection.map((index: number) => rowColls[index as number]));
        }
        if (valueCollection.length > 0) {
            this.clonedValTuple = valueCollection;
        }
        return {
            tupColls: tupColls,
            indexColls: indexColls
        };
    }

    private clearEngineProperties(): void {
        this.pivotValues = [];
        this.valueContent = [];
        this.headerContent = [];
        this.colDepth = 0;
        this.tupColumnInfo = [];
        this.tupRowInfo = [];
        this.colMeasures = {};
        this.colMeasurePos = undefined;
        this.rowMeasurePos = undefined;
        this.rowStartPos = -1;
    }
    private performEngine(columnTuples: Element[], rowTuples: Element[], valCollection: Element[]): void {
        this.totalCollection = [];
        const measureInfo: IMeasureInfo = this.getMeasureInfo();
        if (this.drilledMembers.length > 0) {
            // let st1: number = new Date().getTime();
            let orderedInfo: IOrderedInfo;
            orderedInfo = this.frameMeasureOrder(
                measureInfo, 'column', columnTuples, valCollection, columnTuples.length, columnTuples.length * rowTuples.length);
            columnTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            orderedInfo = this.frameMeasureOrder(
                measureInfo, 'row', rowTuples, valCollection, columnTuples.length, columnTuples.length * rowTuples.length);
            rowTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            // let st2: number = (new Date().getTime() - st1) / 1000;
            // console.log('over-all:' + st2);
        }
        if (this.customArgs.action === 'down') {
            this.updateTupCollection(this.customArgs.drillInfo.axis === 'row' ? rowTuples.length : columnTuples.length);
        }
        const framedValCollection: { [key: string]: Element } = {};
        for (let colPos: number = 0; colPos < valCollection.length; colPos++) {
            if (!isNullOrUndefined(valCollection[colPos as number])) {
                framedValCollection[
                    this.olapVirtualization ? colPos as number : Number(valCollection[colPos as number].getAttribute('CellOrdinal'))
                ] = valCollection[colPos as number];
            }
        }
        let valueSortData: ValueSortInfo;
        this.valueSortSettings.columnIndex = undefined;
        if (this.enableValueSorting && this.valueSortSettings && !this.isPaging && !this.olapVirtualization) {
            valueSortData = this.getValueSortInfo(columnTuples, rowTuples, measureInfo);
        }
        if (this.customArgs.action === 'down' ? this.customArgs.drillInfo.axis === 'column' : true) {
            this.frameColumnHeader(columnTuples);
            if (!this.isPaging && !this.olapVirtualization) {
                this.performColumnSorting(framedValCollection, valueSortData);
            }
        }
        if (this.customArgs.action === 'down' ? this.customArgs.drillInfo.axis === 'row' : true) {
            this.frameRowHeader(rowTuples);
            if (!this.isPaging && !this.olapVirtualization) {
                this.performRowSorting(framedValCollection, valueSortData);
            }
        }
        this.frameValues(framedValCollection, columnTuples.length);
        this.performColumnSpanning();
        if (!this.isPaging && !this.olapVirtualization && this.enableSort) {
            for (let i: number = 0; i < this.headerContent.length; i++) {
                this.headerContent[i as number] = this.pivotValues[i as number] as IAxisSet[];
            }
        }
        this.isEngineUpdated = true;
        this.isEmptyData = columnTuples.length === 0;
        //this.append(columnTuples.length);
    }

    private getValueSortInfo(columnTuples: Element[], rowTuples: Element[], measureInfo: IMeasureInfo): ValueSortInfo {
        let memberIndex: number;
        if (this.valueSortSettings.headerText) {
            let headersCollection: string[] = this.valueSortSettings.headerText.split(this.valueSortSettings.headerDelimiter);
            const granSumPos: number = headersCollection.indexOf('Grand Total');
            if (granSumPos > -1) {
                const measure: string = headersCollection.join('').split(headersCollection[granSumPos as number]).join('');
                headersCollection = [];
                headersCollection[measureInfo.measureIndex] = measure;
            }
            let measureAxis: string = '';
            let measureIndex: number = measureInfo.measureIndex;
            for (let i: number = 0; i < this.dataSourceSettings.values.length; i++) {
                measureIndex = headersCollection.indexOf(this.dataSourceSettings.values[i as number].caption);
                if (this.dataSourceSettings.values[i as number].caption === headersCollection[measureIndex as number]) {
                    headersCollection[measureIndex as number] = this.fieldList[this.dataSourceSettings.values[i as number].name].name;
                    measureAxis = headersCollection[measureIndex as number];
                    break;
                }
            }
            if (measureIndex !== -1) {
                if (measureIndex < measureInfo.measureIndex) {
                    headersCollection = this.reArrangeHeaders(headersCollection, measureInfo.measureIndex, measureAxis);
                }
                const membersColls: Element[] = this.olapValueAxis === 'column' ? columnTuples : rowTuples;
                if (membersColls.length > 0) {
                    const level: number = membersColls[0].getElementsByTagName('Member').length - (granSumPos > -1 ? measureIndex : 0);
                    const member: Element = this.getParentElement(
                        membersColls, headersCollection, level, measureInfo.measureIndex, measureAxis, granSumPos > -1
                    )[0];
                    memberIndex = membersColls.indexOf(member);
                }
            }
        }
        return {
            memberIndex : memberIndex,
            columnLength: columnTuples.length,
            rowLength: rowTuples.length,
            isValueSorting: memberIndex > -1
        };
    }

    private getParentElement(
        membersColls: Element[], headersCollection: string[], level: number, measureIndex: number,
        measureAxis: string, isGrandTotal?: boolean
    ): Element[] {
        let selectedMember: Element[] = [];
        let parentLevel: number = 0;
        let isParentAvail: boolean = false;
        let isChildAvail: boolean = false;
        const index: number = membersColls[0].getElementsByTagName('Member').length - level;
        for (let i: number = 0; i < membersColls.length; i++) {
            if (isNullOrUndefined(membersColls[i as number].getElementsByTagName('Member')[index as number])) {
                selectedMember = [];
                break;
            }
            const memberUName: string = membersColls[i as number].getElementsByTagName('UName')[index as number].textContent;
            const memberCaption: string = membersColls[i as number].getElementsByTagName('Caption')[index as number].textContent;
            const memberLevel: number = Number(membersColls[i as number].getElementsByTagName('LNum')[index as number].textContent);
            const isParent: boolean = memberUName === headersCollection[index as number] ||
                memberCaption === headersCollection[index as number] ||
                (isNullOrUndefined(headersCollection[index as number]) && memberLevel === 0);
            if (isParent) {
                selectedMember[selectedMember.length] = membersColls[i as number];
                isParentAvail = true;
                parentLevel = memberLevel;
                if (isGrandTotal) {
                    break;
                }
            } else if (isParentAvail && parentLevel < memberLevel) {
                const childMember: Element[] = [];
                for (let j: number = i; j < membersColls.length; j++) {
                    const childUName: string = membersColls[j as number].getElementsByTagName('UName')[index as number].textContent;
                    const childCaption: string = membersColls[j as number].getElementsByTagName('Caption')[index as number].textContent;
                    const childLevel: number = Number(membersColls[j as number].getElementsByTagName('LNum')[index as number].textContent);
                    const isChild: boolean = childUName === headersCollection[index + 1] || childCaption === headersCollection[index + 1] ||
                        (isNullOrUndefined(headersCollection[index + 1]) && childLevel === 0);
                    if ((parentLevel + 1 === childLevel) && isChild) {
                        childMember[childMember.length] = membersColls[j as number];
                        isChildAvail = true;
                    } else if (parentLevel + 1 < childLevel) {
                        if (isChildAvail) {
                            childMember[childMember.length] = membersColls[j as number];
                        } else {
                            break;
                        }
                    } else if (parentLevel + 1 > childLevel) {
                        break;
                    }
                }
                if (isChildAvail) {
                    let childHeaderCollection: string[] = headersCollection.slice(0, index).concat(
                        headersCollection.slice(index + 1, headersCollection.length)
                    );
                    const childMeasureIndex: number = childHeaderCollection.indexOf(measureAxis);
                    if (childMeasureIndex < measureIndex) {
                        childHeaderCollection = this.reArrangeHeaders(childHeaderCollection, measureIndex, measureAxis);
                    }
                    selectedMember = this.getParentElement(
                        childMember, childHeaderCollection, childMember[0].getElementsByTagName('Member').length,
                        measureIndex, measureAxis
                    );
                }
                break;
            } else if (isParentAvail && !isParent) {
                break;
            }
        }
        if (isGrandTotal) {
            return selectedMember;
        } else if (index < (headersCollection.length - 1) && selectedMember.length > 0 && !isChildAvail) {
            selectedMember = this.getParentElement(selectedMember, headersCollection, level - 1, measureIndex, measureAxis);
        }
        return selectedMember;
    }

    private reArrangeHeaders(headersCollection: string[], measureIndex: number, measureAxis: string): string[] {
        const actualIndex: number = headersCollection.indexOf(measureAxis);
        const headerColl1: string[] = headersCollection.slice(0, actualIndex);
        const headerColl2: string[] = headersCollection.slice(actualIndex + 1, headersCollection.length);
        headerColl1[measureIndex as number] = headersCollection[actualIndex as number];
        return headerColl1.concat(headerColl2);
    }

    private getSubTotalsVisibility(): void {
        this.showRowSubTotals = this.dataSourceSettings.showRowSubTotals && this.dataSourceSettings.showSubTotals;
        this.showColumnSubTotals = this.dataSourceSettings.showColumnSubTotals && this.dataSourceSettings.showSubTotals;
        this.showSubTotalsAtTop = this.showColumnSubTotals && this.dataSourceSettings.subTotalsPosition === 'Top';
        this.showSubTotalsAtBottom = this.showRowSubTotals && this.dataSourceSettings.subTotalsPosition === 'Bottom';
        this.hideRowTotalsObject = {};
        this.hideColumnTotalsObject = {};
        let axisCount: number = 1;
        do {
            if (axisCount === 1) {
                if (this.showColumnSubTotals) {
                    for (let cCnt: number = 0; cCnt < this.dataSourceSettings.columns.length; cCnt++) {
                        if (this.dataSourceSettings.columns[cCnt as number].showSubTotals === false) {
                            this.hideColumnTotalsObject[this.dataSourceSettings.columns[cCnt as number].name] = cCnt;
                        }
                    }
                }
            } else {
                if (this.showRowSubTotals) {
                    for (let rCnt: number = 0; rCnt < this.dataSourceSettings.rows.length; rCnt++) {
                        if (this.dataSourceSettings.rows[rCnt as number].showSubTotals === false) {
                            this.hideRowTotalsObject[this.dataSourceSettings.rows[rCnt as number].name] = rCnt;
                        }
                    }
                }
            }
            axisCount++;
        } while (axisCount < 3);
    }

    private frameRowHeader(tuples: Element[]): void {
        this.headerGrouping = {};
        this.lastLevel = [];
        let isGrandTotalAdd: boolean = true;
        let position: number = this.pivotValues.length;
        let pivotValues: IAxisSet[][] = [];
        let valueContent: IGridValues = [];
        if (this.customArgs.action !== 'down') {
            pivotValues = this.pivotValues;
            valueContent = this.valueContent;
        } else {
            position = this.customArgs.drillInfo.currentCell.rowIndex + 1;
        }
        this.rowStartPos = this.rowStartPos > 0 ? this.rowStartPos : position;
        let tupPos: number = 0;
        let lastAllStartPos: number;
        let lastAllCount: number;
        const prevUNArray: string[] = [];
        const allType: { [key: number]: number } = {};
        const rowMembers: string[] = [];
        let availAllMember: boolean = false;
        let withoutAllStartPos: number = -1;
        let withoutAllEndPos: number = -1;
        const minLevel: number[] = [];
        let gTotals: IAxisSet[] = [{
            actualText: 'Grand Total',
            axis: 'row',
            colIndex: 0,
            formattedText: 'Grand Total',
            hasChild: false,
            level: -1,
            rowIndex: 0,
            index: [],
            type: 'grand sum',
            ordinal: 0,
            colSpan: 1,
            rowSpan: 1,
            memberType: 2,
            isDrilled: false,
            valueSort: { 'Grand Total': 1, levelName: 'Grand Total' }
        }];
        let maxLevel: number[] = [];
        let measurePos: number;
        const newTupPosition: number = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'row') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            const members: NodeListOf<Element> = tuples[tupPos as number].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(
                members, maxLevel, (tupPos + newTupPosition), this.tupRowInfo, this.showRowSubTotals,
                this.hideRowTotalsObject, 'row');
            tupPos++;
        }
        tupPos = 0;
        let prevTupInfo: ITupInfo;
        let tuplesLength: number = tuples.length;
        if (this.customArgs.action === 'down') {
            const ordinal: number = this.customArgs.drillInfo.currentCell.ordinal + 1;
            tupPos = ordinal;
            tuplesLength += ordinal;
            lastAllCount = this.tupRowInfo[ordinal - 1].allCount;
            lastAllStartPos = this.tupRowInfo[ordinal - 1].allStartPos;
            prevTupInfo = this.tupRowInfo[ordinal - 1];
        }
        const startTupPos: number = tupPos;
        const pagingAllowFlag: boolean = true;
        let lastMesPos: number = 0;
        let isGrandTotalTop: boolean = false;
        const subTotals: IAxisSet[] = [];
        while (tupPos < tuplesLength && pagingAllowFlag) {
            const members: NodeListOf<Element> = tuples[this.customArgs.action === 'down' ?
                (tupPos - (this.customArgs.drillInfo.currentCell.ordinal + 1)) : tupPos].querySelectorAll('Member');
            let memPos: number = 0;
            let prevParent: IAxisSet;
            const allCount: number = this.tupRowInfo[tupPos as number].allCount;
            const allStartPos: number = this.tupRowInfo[tupPos as number].allStartPos;
            const measure: Element = this.tupRowInfo[tupPos as number].measure;
            const typeColl: string[] = this.tupRowInfo[tupPos as number].typeCollection;
            // let drillInfo: IDrillInfo[] = this.tupRowInfo[tupPos].drillInfo;
            const drillStartPos: number = this.tupRowInfo[tupPos as number].drillStartPos;
            const startDrillUniquename: string = this.tupRowInfo[tupPos as number].startDrillUniquename;
            // let drillEndPos: number = this.tupRowInfo[tupPos].drillEndPos;
            // let levelColl: number[] = this.tupRowInfo[tupPos].levelCollection;
            if (tupPos === 0 || tupPos === startTupPos) {
                const firstTupMembers: NodeListOf<Element> = this.customArgs.action === 'down' ? this.tupRowInfo[0].members : members;
                while (memPos < firstTupMembers.length) {
                    if (firstTupMembers[memPos as number].querySelector('MEMBER_TYPE').textContent === '1' &&
                        Number(firstTupMembers[memPos as number].querySelector('LNum').textContent) === 0) {
                        minLevel[memPos as number] = 0;
                    } else {
                        minLevel[memPos as number] = Number(firstTupMembers[memPos as number].querySelector('LNum').textContent);
                    }
                    // if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    //   (this.isPaging || Number(firstTupMembers[memPos].querySelector('LNum').textContent) === 0)) {
                    if (firstTupMembers[memPos as number].querySelector('MEMBER_TYPE').textContent === '1') {
                        allType[memPos as number] = 0;
                        withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                        withoutAllEndPos = memPos;
                    } else {
                        allType[memPos as number] = 1;
                        availAllMember = firstTupMembers[memPos as number].querySelector('MEMBER_TYPE').textContent === '3' ? availAllMember : true;
                    }
                    memPos++;
                }
                measurePos = typeColl.indexOf('3');
            }
            memPos = 0;

            if (tupPos === 0 && (members.length > (allCount + (measure ? 1 : 0)) || (members.length === 1 && measure))) {
                gTotals.pop();
            }
            if ((tupPos === 0 && this.isPaging) ? gTotals.length === 0 :
                (!availAllMember || allCount === lastAllCount || allStartPos !== lastAllStartPos || (members.length === 1 && measure))) {
                const attrDrill: boolean = this.checkAttributeDrill(this.tupRowInfo[tupPos as number].drillInfo, 'rows');
                let drillAllow: boolean = drillStartPos > -1 ? (allCount > 0 ? (attrDrill || allStartPos > drillStartPos) : true) : true;
                drillAllow = (prevTupInfo && drillAllow && drillStartPos > -1) ?
                    (prevTupInfo.startDrillUniquename !== startDrillUniquename ? true :
                        ((withoutAllEndPos > prevTupInfo.measurePosition ? false :
                            prevTupInfo.measureName !== this.tupRowInfo[tupPos as number].measureName) &&
                            (allStartPos === (drillStartPos + 1) ||
                            this.tupRowInfo[tupPos as number].measurePosition === (drillStartPos + 1))))
                    : drillAllow;
                const withoutAllAllow: boolean = (withoutAllStartPos > -1 && allCount > 0) ?
                    (attrDrill || allStartPos > withoutAllEndPos) : true;
                isGrandTotalTop = this.dataSourceSettings.grandTotalsPosition === 'Top' && this.olapRowValueIndex === 0 &&
                    this.olapValueAxis === 'row'
                    && this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals &&
                    (this.olapValueAxis === 'row' ? this.dataSourceSettings.rows.length > 1 : true);
                if (isGrandTotalTop && gTotals.length === 1) {
                    gTotals = this.frameGrandTotalValues(tuples, gTotals, typeColl, measurePos);
                }
                if (members.length === allCount + (measure ? 1 : 0) && measure && !isGrandTotalTop) {
                    const levelName: string = 'Grand Total' + this.valueSortSettings.headerDelimiter +
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption ?
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption :
                        members[measurePos as number].querySelector('Caption').textContent;
                    const formattedText: string = (typeColl[measurePos as number] === '3' &&
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)] &&
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption) ?
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption :
                        members[measurePos as number].querySelector('Caption').textContent;
                    gTotals = this.frameGrandTotalAxisSet(
                        gTotals, this.getUniqueName(members[measurePos as number].querySelector('UName').textContent), formattedText,
                        position, tupPos, Number(typeColl[measurePos as number]), members[measurePos as number].querySelector('PARENT_UNIQUE_NAME') ?
                            members[measurePos as number].querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                        members[measurePos as number].querySelector('LName').textContent,
                        members[measurePos as number].getAttribute('Hierarchy'), {
                            levelName: levelName, axis: members[measurePos as number].getAttribute('Hierarchy')
                        });
                    gTotals[gTotals.length - 1].valueSort[levelName as string] = 1;
                } else if (!(allStartPos === 0 || (measurePos === 0 && allStartPos === 1)) && drillAllow && withoutAllAllow) {
                    if (this.dataSourceSettings.grandTotalsPosition === 'Top' && isGrandTotalAdd && this.dataSourceSettings.showGrandTotals &&
                        (this.olapValueAxis === 'row' ? this.dataSourceSettings.rows.length > 1 : true)) {
                        this.insertRowGrandTotal(gTotals, valueContent, pivotValues, tuples, position);
                        position = this.pivotValues.length;
                        isGrandTotalAdd = false;
                    }
                    prevTupInfo = this.tupRowInfo[tupPos as number];
                    let lastPos: number = position;
                    let lastMemPos: number = memPos;
                    prevParent = {};
                    let withoutAllDrilled: boolean = false;
                    while (memPos < members.length && pagingAllowFlag) {
                        const member: Element = members[memPos as number];
                        if (member.querySelector('UName').textContent !== prevUNArray[memPos as number] && typeColl[memPos as number] !== '2'
                            && ((Object.keys(prevParent).length > 0 ? (prevParent.isDrilled &&
                                !this.fieldList[prevParent.hierarchy].isHierarchy) : withoutAllDrilled) ?
                                (typeColl[memPos as number] === '3' && (allType[memPos - 1] && allType[memPos + 1] !== 0)) : true)) {
                            const lvl: number = Number(member.querySelector('LNum').textContent) -
                                ((allType[memPos as number] && typeColl[memPos as number] !== '3') ? 1 : minLevel[memPos as number]);
                            const isNamedSet: boolean = this.namedSetsPosition['row'][memPos as number] ? true : false;
                            const uniqueName: string = this.getUniqueName(member.querySelector('UName').textContent);
                            const depth: number =
                                this.getDepth(this.tupRowInfo[tupPos as number], uniqueName, Number(typeColl[memPos as number]));
                            const levelName: string = this.getCaptionCollectionWithMeasure(this.tupRowInfo[tupPos as number], memPos);
                            if (this.showSubTotalsAtBottom && position > this.rowStartPos) {
                                lastPos = position = this.insertRowSubTotal(pivotValues, valueContent, subTotals, position, lvl, levelName);
                            }
                            if (!(this.isPaging && pivotValues[lastMesPos as number][0] &&
                                this.fieldList[(pivotValues[lastMesPos as number][0] as IAxisSet).hierarchy] &&
                                this.fieldList[(pivotValues[lastMesPos as number][0] as IAxisSet).hierarchy].isHierarchy &&
                                (pivotValues[lastMesPos as number][0] as IAxisSet).hasChild &&
                                !(pivotValues[lastMesPos as number][0] as IAxisSet).isDrilled &&
                                !this.rows[memPos as number].isNamedSet && (this.rows[memPos as number].name.indexOf('[Measures]') === 0 ||
                                    (this.fieldList[member.getAttribute('Hierarchy')] &&
                                        (this.fieldList[member.getAttribute('Hierarchy')].isHierarchy ||
                                            this.fieldList[member.getAttribute('Hierarchy')].hasAllMember))) &&
                                (pivotValues[lastMesPos as number][0] as IAxisSet).depth < depth)) {
                                (pivotValues[position as number] as IAxisSet[]) = [{
                                    axis: 'row',
                                    actualText: uniqueName,
                                    colIndex: 0,
                                    formattedText: (typeColl[memPos as number] === '3' && this.dataFields[uniqueName as string] &&
                                        this.dataFields[uniqueName as string].caption) ? this.dataFields[uniqueName as string].caption :
                                        member.querySelector('Caption').textContent,
                                    hasChild: (this.fieldList[member.getAttribute('Hierarchy')] &&
                                        this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && memPos < this.rows.length - 1 &&
                                        !this.rows[memPos + 1].isNamedSet && this.rows[memPos + 1].name.indexOf('[Measures]') < 0 &&
                                        this.fieldList[this.rows[memPos + 1].name] &&
                                        this.fieldList[this.rows[memPos + 1].name].hasAllMember) ? true :
                                        Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                                    level: lvl,
                                    depth: depth,
                                    rowIndex: position,
                                    index: [],
                                    ordinal: tupPos,
                                    type: 'header',
                                    colSpan: 1,
                                    rowSpan: 1,
                                    memberType: Number(typeColl[memPos as number]),
                                    isDrilled: (this.fieldList[member.getAttribute('Hierarchy')] &&
                                        this.fieldList[member.getAttribute('Hierarchy')].isHierarchy &&
                                        !this.isAttributeDrill(
                                            member.getAttribute('Hierarchy'), this.tupRowInfo[tupPos as number].drillInfo, 'rows'
                                        )) ? true : this.tupRowInfo[tupPos as number].drillInfo[memPos as number].isDrilled,
                                    parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ?
                                        member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                                    levelUniqueName: member.querySelector('LName').textContent,
                                    hierarchy: member.getAttribute('Hierarchy'),
                                    isNamedSet: isNamedSet,
                                    valueSort: { levelName: '', axis: member.getAttribute('Hierarchy') }
                                }];
                                if (this.olapVirtualization && (pivotValues[position as number] as IAxisSet[])[0].type === 'header') {
                                    delete (pivotValues[position as number] as IAxisSet[])[0].type;
                                }
                                prevParent = typeColl[memPos as number] !== '3' ? (pivotValues[position as number] as IAxisSet[])[0] : prevParent;
                                if (!prevParent) {
                                    rowMembers.push(member.querySelector('Caption').textContent);
                                }
                                (pivotValues[position as number] as IAxisSet[])[0].valueSort.levelName = levelName;
                                (pivotValues[position as number] as IAxisSet[])[0].valueSort[levelName as string] = 1;
                                valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                                valueContent[position - this.rowStartPos][0] = pivotValues[position as number][0] as IAxisSet;
                                if (measure && measurePos > memPos) {
                                    prevUNArray[measurePos as number] = '';
                                }
                                for (let pos: number = memPos + 1; pos < members.length; pos++) {
                                    prevUNArray[pos as number] = '';
                                }
                                prevUNArray[memPos as number] = member.querySelector('UName').textContent;
                                lastMesPos = Number(typeColl[memPos as number]) !== 3 ? position : lastMesPos;
                                position++;
                                lastMemPos = memPos;
                            }
                        } else if (typeColl[memPos as number] === '2') {
                            lastMemPos = memPos;
                        } else {
                            if (this.tupRowInfo[tupPos as number].drillInfo[memPos as number].isDrilled &&
                                allType[memPos as number] === 0) {
                                withoutAllDrilled = true;
                            }
                        }
                        if (this.tupRowInfo[tupPos as number].drillInfo[memPos as number].isDrilled &&
                            this.tupRowInfo[tupPos as number].showTotals) {
                            this.tupRowInfo[tupPos as number].showTotals = !this.showRowSubTotals ? false :
                                this.hideRowTotalsObject[this.tupRowInfo[tupPos as number].drillInfo[memPos as number].hierarchy] ===
                                 undefined;
                        }
                        memPos++;
                    }
                    if (lastPos < position && lastMemPos >= (members.length - 1)) {
                        (pivotValues[position - 1] as IAxisSet[])[0].ordinal = tupPos;
                        if ((pivotValues[position - 1] as IAxisSet[])[0].type === 'header') {
                            delete (pivotValues[position - 1] as IAxisSet[])[0].type;
                        }
                    }
                }
                lastAllCount = allCount;
                lastAllStartPos = allStartPos;
            }
            tupPos++;
        }
        if (this.showSubTotalsAtBottom && subTotals.length > 0) {
            subTotals.reverse();
            (subTotals as IAxisSet[]).forEach((axis: IAxisSet) => {
                pivotValues[position as number] = [axis as IAxisSet];
                valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                valueContent[position - this.rowStartPos][0] = pivotValues[position as number][0] as IAxisSet;
                position++;
            });
        }
        if (!(this.dataSourceSettings.grandTotalsPosition === 'Top') || (this.olapValueAxis === 'row' &&
            this.dataSourceSettings.rows.length === 1 && this.dataSourceSettings.grandTotalsPosition === 'Top') ||
            this.dataSourceSettings.rows.length === 0) {
            this.insertRowGrandTotal(gTotals, valueContent, pivotValues, tuples, position);
        }
    }

    private insertRowSubTotal(
        pivotValues: IAxisSet[][], valueContent: IGridValues, subTotals: IAxisSet[], position: number, lvl: number,
        levelName: string): number {
        const prevRowParent: IAxisSet = PivotUtil.frameHeaderWithKeys(pivotValues[position - 1][0] as IAxisSet);
        if (prevRowParent.level < lvl && prevRowParent.type !== 'grand sum' && (prevRowParent.isDrilled ||
            prevRowParent.memberType === 3)) {
            if (prevRowParent.memberType === 3) {
                const valueCells: IAxisSet[] = [];
                let index: number = 1;
                while ((pivotValues[position - index][0] as IAxisSet).memberType === 3) {
                    valueCells[valueCells.length] = (pivotValues[position - index][0] as IAxisSet);
                    index++;
                }
                if ((pivotValues[position - index][0] as IAxisSet).isDrilled && valueCells.length !== 0) {
                    for (let i: number = 0, axislength: number = valueCells.length; i < axislength; i++) {
                        valueCells[i as number].formattedText =
                            (pivotValues[position - index][0] as IAxisSet).formattedText + ' ' + valueCells[i as number].formattedText;
                        valueCells[i as number].isSum = true; valueCells[i as number].type = 'sum';
                        valueCells[i as number].parentUniqueName = (pivotValues[position - index][0] as IAxisSet).levelUniqueName;
                        subTotals[subTotals.length] = valueCells[i as number] as IAxisSet;
                    }
                    index--;
                    position -= index;
                }
            } else {
                prevRowParent.hasChild = false; prevRowParent.isDrilled = false; prevRowParent.isSum = true;
                prevRowParent.type = 'sum'; prevRowParent.formattedText = prevRowParent.formattedText + ' Total';
                subTotals[Object.keys(subTotals).length] = prevRowParent;
            }
        }
        if (subTotals.length > 0) {
            let j: number = subTotals.length - 1;
            let subTotalLevel: number = (subTotals[j as number].valueSort.levelName as string).split('.').length;
            const nextLevels: number = levelName.split('.').length;
            while (subTotalLevel >= nextLevels) {
                pivotValues[position as number] = [subTotals[j as number]];
                valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                valueContent[position - this.rowStartPos][0] = pivotValues[position as number][0] as IAxisSet;
                position++;
                subTotals.splice(subTotals.length - 1, 1);
                if (Object.keys(subTotals).length > 0) {
                    j--;
                    subTotalLevel = (subTotals[j as number].valueSort.levelName as string).split('.').length;
                } else {
                    break;
                }
            }
        }
        return position;
    }

    private insertRowGrandTotal(
        gTotals: IAxisSet[], valueContent: IGridValues, pivotValues: IAxisSet[][], tuples: Element[],
        position: number): IAxisSet[] {
        if (gTotals.length > 1 && gTotals[0].memberType !== 3) {
            gTotals[0].ordinal = -1;
        }
        // if (!(this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals)) {
        //     for (let totPos: number = 0; totPos < gTotals.length; totPos++) {
        //         if (this.tupRowInfo[gTotals[totPos].ordinal]) {
        //             this.tupRowInfo[gTotals[totPos].ordinal].showTotals = false;
        //         }
        //     }
        // }
        if (this.customArgs.action !== 'down') {
            const grandTotalFlag: boolean = this.dataSourceSettings.rows.length === 0 ||
                (this.dataSourceSettings.rows.length === 1 && this.dataSourceSettings.rows[0].name === '[Measures]');
            if ((this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) || grandTotalFlag) {
                for (let totPos: number = 0; totPos < gTotals.length; totPos++) {
                    gTotals[totPos as number].rowIndex = position;
                    (pivotValues[position as number] as IAxisSet[]) = [gTotals[totPos as number]];
                    valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                    valueContent[position - this.rowStartPos][0] = pivotValues[position as number][0] as IAxisSet;
                    position++;
                }
            }
        } else {
            this.updateRowEngine(pivotValues, valueContent, tuples.length);
            this.onDemandDrillEngine = pivotValues;
        }
        return gTotals;
    }
    private frameGrandTotalAxisSet(
        gTotals: IAxisSet[], actualText: string | number, formattedText: string,
        rowIndex: number, ordinal: number, memberType: number, parentUniqueName: string, levelUniqueName: string,
        hierarchy: string, valueSort: IDataSet): IAxisSet[] {
        gTotals.push({
            axis: 'row',
            actualText: actualText,
            colIndex: 0,
            formattedText: formattedText,
            hasChild: false,
            level: - 1,
            rowIndex: rowIndex,
            index: [],
            ordinal: ordinal,
            colSpan: 1,
            rowSpan: 1,
            memberType: memberType,
            isDrilled: false,
            parentUniqueName: parentUniqueName,
            levelUniqueName: levelUniqueName,
            hierarchy: hierarchy,
            valueSort: valueSort
        });
        return gTotals;
    }
    private getDepth(tupInfo: ITupInfo, uniqueName: string, memberType: number): number {
        const memberPosition: number = tupInfo.uNameCollection.indexOf(uniqueName);
        const cropUName: string = tupInfo.uNameCollection.substring(0, memberPosition) +
            (memberType === 3 ? '' : uniqueName);
        const fieldSep: string[] = cropUName.split('::[').map((item: string) => {
            return item[0] === '[' ? item : ('[' + item);
        });
        if (memberType === 3 && this.rowMeasurePos === fieldSep.length) {
            fieldSep.push(uniqueName);
        }
        let nxtIndextCount: number = -1;
        for (let fPos: number = 0; fPos < fieldSep.length; fPos++) {
            const fieldMembers: string = fieldSep[fPos as number];
            const membersCount: number = fieldMembers.split('~~').length;
            nxtIndextCount += membersCount;
        }
        return nxtIndextCount;
    }
    private checkAttributeDrill(drillInfo: IDrillInfo[], axis: string): boolean {
        let isDrill: boolean = false;
        for (let i: number = 0; i < drillInfo.length; i++) {
            isDrill = this.isAttributeDrill(drillInfo[i as number].hierarchy, drillInfo, axis);
            if (isDrill) {
                break;
            }
        }
        return isDrill;
    }
    private frameTupCollection(
        members: NodeListOf<Element>, maxLevel: number[], tupPos: number, tupInfo: ITupInfo[],
        showSubTotals: boolean, hideTotalsObject: { [key: string]: number }, axis: string): number[] {
        let memPos: number = 0;
        let allCount: number = 0;
        let allStartPos: number;
        let measure: Element;
        let measureName: string;
        let measurePosition: number;
        const typeColl: string[] = [];
        const levelColl: number[] = [];
        const drillState: IDrillInfo[] = [];
        let uNameCollection: string = '';
        let captionCollection: string = '';
        let showTotals: boolean = true;
        let hideFieldPos: number = -1;
        while (memPos < members.length) {
            const member: Element = members[memPos as number];
            const memberlevel: number = Number(member.querySelector('LNum').textContent);
            const memberUName: string = member.querySelector('UName').textContent;
            if (Number(member.querySelector('MEMBER_TYPE').textContent) > 3) {
                member.querySelector('MEMBER_TYPE').textContent = memberUName.indexOf('[Measures]') === 0 ? '3' : '1';
            }
            const memberType: string = memberUName.indexOf('[Measures]') === 0 ? '3' :
                (Number(member.querySelector('MEMBER_TYPE').textContent) > 3 ? '1' : member.querySelector('MEMBER_TYPE').textContent);
            let memberCaption: string = member.querySelector('Caption').textContent;
            if (this.fieldList[memberCaption as string] && this.fieldList[memberCaption as string].type === 'CalculatedField') {
                memberCaption = this.fieldList[memberCaption as string].caption;
                member.querySelector('Caption').textContent = memberCaption;
            }
            const hierarchy: string = member.getAttribute('Hierarchy');
            const parentUName: string = member.querySelector('PARENT_UNIQUE_NAME') ?
                member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            if (memberType === '2') {
                if (!this.isPaging) {
                    allCount++;
                }
                allStartPos = isNullOrUndefined(allStartPos) ? memPos : allStartPos;
            } else if (memberType === '3') {
                measure = member;
                measureName = memberUName;
                measurePosition = memPos;
                if (axis === 'column') {
                    this.colMeasures[memberUName as string] = member;
                    this.colMeasurePos = memPos;
                } else {
                    this.rowMeasurePos = memPos;
                }
            } else {
                hideFieldPos = hideTotalsObject[hierarchy as string];
            }
            if (memberType !== '2') {
                if (this.headerGrouping[memPos as number]) {
                    if (memberlevel > this.lastLevel[memPos as number]) {
                        this.lastLevel[memPos as number] = memberlevel;
                    } else if (memberlevel < this.lastLevel[memPos as number]) {
                        let levelPos: number = this.lastLevel[memPos as number];
                        while (levelPos >= memberlevel) {
                            delete this.headerGrouping[memPos as number].UName[levelPos as number];
                            delete this.headerGrouping[memPos as number].Caption[levelPos as number];
                            levelPos--;
                        }
                        this.lastLevel[memPos as number] = memberlevel;
                    }
                    this.headerGrouping[memPos as number].UName[memberlevel as number] = memberUName;
                    this.headerGrouping[memPos as number].Caption[memberlevel as number] = memberCaption;
                } else {
                    this.lastLevel[memPos as number] = memberlevel;
                    this.headerGrouping[memPos as number] = {
                        UName: { [memberlevel as number]: memberUName },
                        Caption: { [memberlevel as number]: memberCaption }
                    };
                }
                if (this.isPaging) {
                    let currUName: string = parentUName;
                    while (this.drilledSets[currUName as string]) {
                        const currCaption: string = this.drilledSets[currUName as string].querySelector('Caption').textContent;
                        const currLevel: number = Number(this.drilledSets[currUName as string].querySelector('LNum').textContent);
                        this.headerGrouping[memPos as number].UName[currLevel as number] = currUName;
                        this.headerGrouping[memPos as number].Caption[currLevel as number] = currCaption;
                        currUName = this.drilledSets[currUName as string].querySelector('PARENT_UNIQUE_NAME') === null ? '' :
                            this.drilledSets[currUName as string].querySelector('PARENT_UNIQUE_NAME').textContent;
                    }
                }
                let uNames: string = '';
                const uNamesKeys: string[] = Object.keys(this.headerGrouping[memPos as number].UName);
                for (let i: number = 0; i < uNamesKeys.length; i++) {
                    const j: string = uNamesKeys[i as number];
                    if (i === 0) {
                        uNames = this.headerGrouping[memPos as number].UName[Number(j)];
                    }
                    else {
                        uNames = uNames + '~~' + this.headerGrouping[memPos as number].UName[Number(j)];
                    }
                }
                uNameCollection = uNameCollection === '' ? uNames :
                    (uNameCollection + '::' + uNames);
                let captions: string = '';
                const captionsKeys: string[] = Object.keys(this.headerGrouping[memPos as number].Caption);
                for (let i: number = 0; i < captionsKeys.length; i++) {
                    const j: string = captionsKeys[i as number];
                    if (i === 0) {
                        captions = this.headerGrouping[memPos as number].Caption[Number(j)];
                    }
                    else {
                        captions = captions + '~~' + this.headerGrouping[memPos as number].Caption[Number(j)];
                    }
                }
                if (memPos !== measurePosition) {
                    captionCollection = captionCollection === '' ? captions :
                        (captionCollection + '::' + captions);
                }
            }
            typeColl.push(memberType);
            levelColl.push(memberlevel);
            if (isNullOrUndefined(maxLevel[memPos as number]) || maxLevel[memPos as number] < memberlevel) {
                maxLevel[memPos as number] = memberlevel;
            }
            drillState.push({ level: memberlevel, uName: memberUName, hierarchy: hierarchy, isDrilled: false });
            if (tupInfo[tupPos - 1] && tupInfo[tupPos - 1].typeCollection[memPos as number] === '1' &&
                drillState[memPos as number].level > tupInfo[tupPos - 1].drillInfo[memPos as number].level) {
                const uCollection: string[] = uNameCollection.split(/~~|::\[/).map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
                uCollection.pop();
                const parentLevel: string = uCollection.join('~~');
                this.setDrillInfo(parentUName, parentLevel, memPos, tupPos, tupInfo);
            }
            memPos++;
        }
        if (hideFieldPos > -1) {
            showTotals = typeColl[hideFieldPos + 1] !== '2';
        }
        tupInfo[tupPos as number] = {
            allCount: allCount,
            allStartPos: allStartPos,
            measure: measure,
            measureName: measureName,
            measurePosition: measurePosition,
            members: members,
            typeCollection: typeColl,
            uNameCollection: uNameCollection,
            captionCollection: captionCollection,
            levelCollection: levelColl,
            drillInfo: drillState,
            drillStartPos: -1,
            drillEndPos: -1,
            showTotals: (!showSubTotals && allCount > 0 && allStartPos > (measurePosition === 0 ? 1 : 0)) ? false : showTotals
        };
        return maxLevel;
    }

    private getCaptionCollectionWithMeasure(tuple: ITupInfo, memPos: number): string {
        let captionColection: string = tuple.captionCollection;
        let isMeasureAdd: boolean = true;
        if (tuple.typeCollection[memPos as number] !== '3') {
            for (let i: number = 0; i < this.measurePosition; i++) {
                if (tuple.drillInfo[memPos as number].hierarchy === this.dataSourceSettings.rows[i as number].name) {
                    isMeasureAdd = false;
                    break;
                }
            }
        }
        if (tuple.measure && isMeasureAdd) {
            const uName: string = this.getUniqueName(tuple.measure.querySelector('UName').textContent);
            const measureName: string = this.dataFields[uName as string] && this.dataFields[uName as string].caption ?
                this.dataFields[uName as string].caption : tuple.measure.querySelector('Caption').textContent;
            const measurePosition: number = tuple.uNameCollection.split(/[~~::]+/g).indexOf(tuple.measureName);
            const captionCollectionArray: string[] = tuple.captionCollection.split(/[~~::]+/g);
            captionCollectionArray.splice(measurePosition, 0, measureName);
            captionColection = captionCollectionArray.join(this.valueSortSettings.headerDelimiter);
        } else {
            const captionCollectionArray: string[] = tuple.captionCollection.split(/[~~::]+/g);
            captionColection = captionCollectionArray.join(this.valueSortSettings.headerDelimiter);
        }
        return captionColection;
    }

    /**
     * It performs the set named sets position.
     *
     * @returns {void}
     * @hidden
     */
    public setNamedSetsPosition(): void {
        this.namedSetsPosition = {};
        let axis: number = 0;
        do {
            const setsPositions: { [key: number]: string } = {};
            const axisFields: IFieldOptions[] = axis ? this.dataSourceSettings.rows : this.dataSourceSettings.columns;
            for (let fPos: number = 0; fPos < axisFields.length; fPos++) {
                if (axisFields[fPos as number].isNamedSet) {
                    setsPositions[fPos as number] = axisFields[fPos as number].name;
                }
            }
            this.namedSetsPosition[axis ? 'row' : 'column'] = setsPositions;
            axis++;
        } while (axis < 2);
    }

    private updateRowEngine(pivotValues: IAxisSet[][], valueContent: IGridValues, tuplesLength: number): void {
        let currEngineCount: number = this.pivotValues.length - 1;
        const newEngineCount: number = Object.keys(pivotValues).length;
        while (currEngineCount > this.customArgs.drillInfo.currentCell.rowIndex) {
            this.pivotValues[currEngineCount + newEngineCount] = this.pivotValues[currEngineCount as number];
            (this.pivotValues[currEngineCount + newEngineCount][0] as IAxisSet).ordinal += tuplesLength;
            (this.pivotValues[currEngineCount + newEngineCount][0] as IAxisSet).rowIndex += newEngineCount;
            this.valueContent[(currEngineCount + newEngineCount) - this.rowStartPos] =
                this.valueContent[currEngineCount - this.rowStartPos];
            currEngineCount--;
        }

        // for (let key in pivotValues) {
        for (let key: number = 0; key < pivotValues.length; key++) {
            this.pivotValues[key as number] = pivotValues[key as number];
            this.valueContent[Number(key) - this.rowStartPos] = valueContent[Number(key) - this.rowStartPos];
        }
        (this.pivotValues[this.customArgs.drillInfo.currentCell.rowIndex][0] as IAxisSet).isDrilled = true;
    }

    private updateTupCollection(newTuplesCount: number): void {
        const tupCollection: ITupInfo[] = this.customArgs.drillInfo.axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        let currTupCount: number = tupCollection.length - 1;
        while (currTupCount > this.customArgs.drillInfo.currentCell.ordinal) {
            tupCollection[currTupCount + newTuplesCount] = tupCollection[currTupCount as number];
            currTupCount--;
        }
    }

    private frameGrandTotalValues(tuples: Element[], gTotals: IAxisSet[], typeColl: string[], measurePos: number): IAxisSet[] {
        let tupPos: number = 0;
        let lastAllStartPos: number;
        let lastAllCount: number;
        const availAllMember: boolean = false;
        const withoutAllEndPos: number = -1;
        let isGrandtoalDataAdd: boolean = false;
        let prevTupInfo: ITupInfo;
        const isGrandTotalTop: boolean = false;
        while (tupPos < tuples.length && !isGrandtoalDataAdd) {
            const members: NodeListOf<Element> = tuples[this.customArgs.action === 'down' ?
                (tupPos - (this.customArgs.drillInfo.currentCell.ordinal + 1)) : tupPos].querySelectorAll('Member');
            // let memPos: number = 0;
            const allCount: number = this.tupRowInfo[tupPos as number].allCount;
            const allStartPos: number = this.tupRowInfo[tupPos as number].allStartPos;
            const measure: Element = this.tupRowInfo[tupPos as number].measure;
            const typeColl: string[] = this.tupRowInfo[tupPos as number].typeCollection;
            const drillStartPos: number = this.tupRowInfo[tupPos as number].drillStartPos;
            const startDrillUniquename: string = this.tupRowInfo[tupPos as number].startDrillUniquename;
            // memPos = 0;
            if (tupPos === 0 && (members.length > (allCount + (measure ? 1 : 0)) || (members.length === 1 && measure))) {
                gTotals.pop();
            }
            if ((tupPos === 0 && this.isPaging) ? gTotals.length === 0 :
                (!availAllMember || allCount === lastAllCount || allStartPos !== lastAllStartPos || (members.length === 1 && measure))) {
                const attrDrill: boolean = this.checkAttributeDrill(this.tupRowInfo[tupPos as number].drillInfo, 'rows');
                let drillAllow: boolean = drillStartPos > -1 ? (allCount > 0 ? (attrDrill || allStartPos > drillStartPos) : true) : true;
                drillAllow = (prevTupInfo && drillAllow && drillStartPos > -1) ?
                    (prevTupInfo.startDrillUniquename !== startDrillUniquename ? true :
                        ((withoutAllEndPos > prevTupInfo.measurePosition ? false :
                            prevTupInfo.measureName !== this.tupRowInfo[tupPos as number].measureName) &&
                            (allStartPos === (drillStartPos + 1) ||
                            this.tupRowInfo[tupPos as number].measurePosition === (drillStartPos + 1))))
                    : drillAllow;
                if (members.length === allCount + (measure ? 1 : 0) && measure && !isGrandTotalTop) {
                    const levelName: string = 'Grand Total' + this.valueSortSettings.headerDelimiter +
                        members[measurePos as number].querySelector('Caption').textContent;
                    const formattedText: string = (typeColl[measurePos as number] === '3' &&
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)] &&
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption) ?
                        this.dataFields[this.getUniqueName(members[measurePos as number].querySelector('UName').textContent)].caption :
                        members[measurePos as number].querySelector('Caption').textContent;
                    gTotals = this.frameGrandTotalAxisSet(
                        gTotals, this.getUniqueName(
                            members[measurePos as number].querySelector('UName').textContent), formattedText, this.pivotValues.length, tupPos,
                        Number(typeColl[measurePos as number]), members[measurePos as number].querySelector('PARENT_UNIQUE_NAME') ?
                            members[measurePos as number].querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                        members[measurePos as number].querySelector('LName').textContent,
                        members[measurePos as number].getAttribute('Hierarchy'), {
                            levelName: levelName, axis: members[measurePos as number].getAttribute('Hierarchy')
                        });
                    gTotals[gTotals.length - 1].valueSort[
                        'Grand Total' + this.valueSortSettings.headerDelimiter +
                        members[measurePos as number].querySelector('Caption').textContent
                    ] = 1;
                }
                lastAllCount = allCount;
                lastAllStartPos = allStartPos;
            }
            isGrandtoalDataAdd = this.dataSourceSettings.values.length + 1 === gTotals.length ? true : false;
            tupPos++;
        }
        return gTotals;
    }

    private frameColumnHeader(tuples: Element[]): void {
        this.headerGrouping = {};
        this.lastLevel = [];
        let tupPos: number = 0;
        let maxLevel: number[] = [];
        const allType: number[] = [];
        const minLevel: number[] = [];
        let withoutAllStartPos: number = -1;
        let withoutAllEndPos: number = -1;
        const newTupPosition: number = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'column') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            const members: NodeListOf<Element> = tuples[tupPos as number].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(
                members, maxLevel, (tupPos + newTupPosition),
                this.tupColumnInfo, this.showColumnSubTotals, this.hideColumnTotalsObject, 'column');
            tupPos++;
        }
        if (this.olapVirtualization) {
            maxLevel = maxLevel.slice(0, maxLevel.length - 1).map(
                (level: number) => level === 0 ? 1 : level
            ).concat(maxLevel.slice(maxLevel.length - 1));
        }
        if (tuples.length > 0) {
            const members: NodeListOf<Element> = tuples[0].querySelectorAll('Member');
            let memPos: number = 0;
            while (memPos < members.length) {
                minLevel[memPos as number] = (members[memPos as number].querySelector('MEMBER_TYPE').textContent === '1' &&
                    Number(members[memPos as number].querySelector('LNum').textContent) === 0) ? 0 :
                    Number(members[memPos as number].querySelector('LNum').textContent);
                if (members[memPos as number].querySelector('MEMBER_TYPE').textContent === '1' &&
                    (this.isPaging || Number(members[memPos as number].querySelector('LNum').textContent) === 0)) {
                    allType[memPos as number] = 0;
                    withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                    withoutAllEndPos = memPos;
                } else {
                    allType[memPos as number] = 1;
                }
                memPos++;
            }
        }
        tupPos = 0;
        let position: number = 1;
        const lastSavedInfo: ILastSavedInfo = {};
        let isSubTotIncluded: boolean = true;
        let withoutAllAvail: boolean = false;
        let lastRealTup: ITupInfo;
        while (tupPos < tuples.length) {
            const members: NodeListOf<Element> = tuples[tupPos as number].querySelectorAll('Member');
            const allCount: number = this.tupColumnInfo[tupPos as number].allCount;
            const allStartPos: number = this.tupColumnInfo[tupPos as number].allStartPos;
            const measure: Element = this.tupColumnInfo[tupPos as number].measure;
            const typeColl: string[] = this.tupColumnInfo[tupPos as number].typeCollection;
            const drillInfo: IDrillInfo[] = this.tupColumnInfo[tupPos as number].drillInfo;
            const drillStartPos: number = this.tupColumnInfo[tupPos as number].drillStartPos;
            const startDrillUniquename: string = this.tupColumnInfo[tupPos as number].startDrillUniquename;
            const endDrillUniquename: string = this.tupColumnInfo[tupPos as number].endDrillUniquename;
            const drillEndPos: number = this.tupColumnInfo[tupPos as number].drillEndPos;
            const levelColl: number[] = this.tupColumnInfo[tupPos as number].levelCollection;
            let isStartCol: boolean = typeColl[0] === '2' ? false : (typeColl[0] === '3' ? typeColl[1] !== '2' : true);
            let depth: number = 0;
            maxLevel.map((item: number, pos: number) => {
                depth = depth + (allType[pos as number] === 0 ? (item + (1 - (minLevel[pos as number] > 1 ? 1 : minLevel[pos as number]))) :
                    (item === 0 ? ((this.isPaging && typeColl[pos as number] === '2') ? 0 : 1) : item));
            });
            this.colDepth = this.colDepth > depth ? this.colDepth : depth;
            if (tupPos === 0 && members.length > (allCount + (measure ? 1 : 0))) {
                withoutAllAvail = true;
                isStartCol = (allCount > 0 && isStartCol) ? (allStartPos > withoutAllStartPos) : isStartCol;
            }
            let isGrandTotalTop: boolean = false;
            if (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals &&
                this.dataSourceSettings.showColumnGrandTotals) {
                let count: number = 0;
                for (let i: number = 0; i < members.length; i++) {
                    if ((members[i as number].querySelector('Caption').textContent).indexOf('All') === 0) {
                        count++;
                    }
                }
                isGrandTotalTop = count === (this.olapValueAxis === 'column' ? this.dataSourceSettings.columns.length - 1 :
                    this.dataSourceSettings.columns.length);
            }
            if (isStartCol || isGrandTotalTop) {
                if (allCount === 0 || isGrandTotalTop) {
                    let levelComp: number[] = [-1, -1, -1];
                    if (this.tupColumnInfo[tupPos - 1] && this.tupColumnInfo[tupPos - 1].allCount === 0) {
                        levelComp = this.levelCompare(levelColl, this.tupColumnInfo[tupPos - 1].levelCollection);
                    } else if (withoutAllAvail && lastRealTup) {
                        levelComp = this.levelCompare(levelColl, lastRealTup.levelCollection);
                    }
                    if (this.tupColumnInfo[tupPos as number].drillStartPos < 0 || this.showSubTotalsAtTop) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        this.setParentCollection(members);
                        this.frameCommonColumnLoop(members, tupPos, position, maxLevel, allType, minLevel);
                        if (!this.tupColumnInfo[tupPos as number].showTotals) {
                            position--;
                        }
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        isSubTotIncluded = false;
                        if (!this.isColDrill) {
                            position++;
                        } else {
                            this.isColDrill = false;
                        }
                    } else if ((lastSavedInfo as ITupInfo).drillStartPos === drillStartPos ?
                        ((lastSavedInfo as ITupInfo).startDrillUniquename !== startDrillUniquename ||
                            (lastSavedInfo as ITupInfo).allCount === allCount) : true) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                            isSubTotIncluded = true;
                        }
                        this.setParentCollection(members);
                        if (withoutAllAvail ? (withoutAllEndPos <= drillStartPos) : true) {
                            if (!isGrandTotalTop) {
                                this.totalCollection[this.totalCollection.length] =
                                    ({ allCount: allCount, ordinal: tupPos, members: members, drillInfo: drillInfo });
                            }
                            (lastSavedInfo as ITupInfo).allCount = allCount;
                            (lastSavedInfo as ITupInfo).allStartPos = allStartPos;
                            (lastSavedInfo as ITupInfo).drillStartPos = drillStartPos;
                            (lastSavedInfo as ITupInfo).startDrillUniquename = startDrillUniquename;
                            (lastSavedInfo as ITupInfo).endDrillUniquename = endDrillUniquename;
                        }
                    }
                    lastRealTup = this.tupColumnInfo[tupPos as number];
                }
            }
            const attrDrill: boolean = this.checkAttributeDrill(this.tupColumnInfo[tupPos as number].drillInfo, 'columns');
            if (allCount > 0 && (withoutAllAvail ? (isStartCol && (attrDrill || withoutAllEndPos < allStartPos)) : true)) {
                if (allCount === (lastSavedInfo as ITupInfo).allCount || allStartPos !== (lastSavedInfo as ITupInfo).allStartPos) {
                    const endAllow: boolean = drillEndPos !== drillStartPos ?
                        ((lastSavedInfo as ITupInfo).endDrillUniquename === endDrillUniquename) : true;
                    const allow: boolean = allStartPos !== (lastSavedInfo as ITupInfo).allStartPos ?
                        ((lastSavedInfo as ITupInfo).startDrillUniquename !== startDrillUniquename) : endAllow;
                    if (drillStartPos > -1 ? (allow) : true) {
                        if (!isSubTotIncluded) {
                            position = this.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo);
                            isSubTotIncluded = true;
                        }
                        this.setParentCollection(members);
                        if ((withoutAllAvail && drillStartPos > -1) ? (withoutAllEndPos <= drillStartPos) : true) {
                            if (!isGrandTotalTop) {
                                this.totalCollection[this.totalCollection.length] =
                                    ({
                                        allCount: allCount, ordinal: tupPos, members: members,
                                        allStartPos: allStartPos, drillInfo: drillInfo
                                    });
                            }
                            (lastSavedInfo as ITupInfo).allCount = allCount;
                            (lastSavedInfo as ITupInfo).allStartPos = allStartPos;
                            (lastSavedInfo as ITupInfo).drillStartPos = drillStartPos;
                            (lastSavedInfo as ITupInfo).startDrillUniquename = startDrillUniquename;
                            (lastSavedInfo as ITupInfo).endDrillUniquename = endDrillUniquename;
                        }
                    }
                }
            }
            tupPos++;
        }
        if (this.totalCollection.length > 0) {
            if (Object.keys(this.colMeasures).length > 1) {
                this.orderTotals(position, maxLevel, allType, minLevel);
            } else {
                this.totalCollection = this.totalCollection.reverse();
                for (const coll of this.totalCollection) {
                    const isGrandTotal: boolean = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(
                            coll.members, coll.ordinal, position, maxLevel, minLevel, allType);
                        const attrDrill: boolean = this.checkAttributeDrill(this.tupColumnInfo[coll.ordinal].drillInfo, 'columns');
                        if (this.tupColumnInfo[coll.ordinal].showTotals || attrDrill) {
                            position++;
                        }
                    }
                }
            }
        }
    }

    private orderTotals(position: number, maxLevel: number[], allType: number[], minLevel: number[]): void {
        const groupColl: { [key: string]: { coll: ITotCollection[]; count: number } } = {};
        let maxCnt: number = 1;
        for (const coll of this.totalCollection) {
            const isGrandTotal: boolean = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
            if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                const measureName: string = this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent;
                if (groupColl[measureName as string]) {
                    groupColl[measureName as string].coll.push(coll);
                    groupColl[measureName as string].count++;
                    maxCnt = maxCnt < groupColl[measureName as string].count ? groupColl[measureName as string].count : maxCnt;
                } else {
                    groupColl[measureName as string] = { coll: [coll], count: 1 };
                }
            }
        }
        const keys: string[] = Object.keys(groupColl);
        let collLength: number = maxCnt - 1;
        while (collLength > -1) {
            for (const key of keys) {
                const coll: ITotCollection = groupColl[key as string].coll[collLength as number];
                if (coll) {
                    this.frameCommonColumnLoop(
                        coll.members, coll.ordinal, position, maxLevel, allType, minLevel);
                    if (this.tupColumnInfo[coll.ordinal].showTotals) {
                        position++;
                    }
                }
            }
            collLength--;
        }
    }

    private setParentCollection(members: NodeListOf<Element>): void {
        let memPos: number = 0;
        while (members.length > memPos) {
            const member: Element = members[memPos as number];
            const memberType: string = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                member.querySelector('MEMBER_TYPE').textContent;
            const memberlevel: number = Number(member.querySelector('LNum').textContent);
            const memberUName: string = member.querySelector('UName').textContent;
            const parentUName: string = member.querySelector('PARENT_UNIQUE_NAME') ?
                member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            let isSameParent: boolean = true;
            let isWithoutAllMember: boolean = false;
            if (this.parentObjCollection[memPos as number]) {
                const levelCollection: string[] = Object.keys(this.parentObjCollection[memPos as number]);
                const parentMember: Element = this.parentObjCollection[memPos as number][memberlevel - 1];
                isSameParent = parentMember ? parentUName === parentMember.querySelector('UName').textContent :
                    levelCollection.length === 0;
                isWithoutAllMember = this.tupColumnInfo[0].typeCollection[memPos as number] === '1';
            }
            if (memberType === '2') {
                delete this.parentObjCollection[memPos as number];
            } else {
                if ((this.isPaging || isWithoutAllMember) ? !isSameParent : false) {
                    delete this.parentObjCollection[memPos as number];
                }
                if (!this.parentObjCollection[memPos as number]) {
                    this.parentObjCollection[memPos as number] = {};
                    this.parentObjCollection[memPos as number][memberlevel as number] = member;
                } else if (!this.parentObjCollection[memPos as number][memberlevel as number] ||
                    this.parentObjCollection[memPos as number][memberlevel as number].querySelector('UName').textContent !== memberUName) {
                    this.parentObjCollection[memPos as number][memberlevel as number] = member;
                }
            }
            memPos++;
        }
    }

    private setDrillInfo(pUName: string, parentLvlCollection: string, memPos: number, tupPos: number, tupInfo: ITupInfo[]): void {
        tupPos--;
        while (tupInfo[tupPos as number] && tupInfo[tupPos as number].drillInfo[memPos as number].uName === pUName) {
            const prevUcollection: string[] =
                tupInfo[tupPos as number].uNameCollection.split(/~~|::\[/).map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
            if (prevUcollection.join('~~').indexOf(parentLvlCollection) < 0) {
                break;
            }
            tupInfo[tupPos as number].drillInfo[memPos as number].isDrilled = true;
            if (this.curDrillEndPos <= memPos) {
                tupInfo[tupPos as number].drillEndPos = this.curDrillEndPos = memPos;
                tupInfo[tupPos as number].endDrillUniquename = pUName;
            }
            if (tupInfo[tupPos as number].drillStartPos > memPos || tupInfo[tupPos as number].drillStartPos === -1) {
                tupInfo[tupPos as number].drillStartPos = memPos;
            }
            tupInfo[tupPos as number].startDrillUniquename = pUName;
            tupPos--;
        }
    }

    private levelCompare(newLevels: number[], oldLevels: number[]): number[] {
        let changePos: number[] = [-1, 0];
        for (let lPos: number = 0; lPos < oldLevels.length; lPos++) {
            if (newLevels[lPos as number] !== oldLevels[lPos as number]) {
                changePos = [lPos, newLevels[lPos as number], (oldLevels[lPos as number] - newLevels[lPos as number])];
                break;
            }
        }
        return changePos;
    }

    private mergeTotCollection(
        position: number, allCount: number, maxLevel: number[], allType: number[], minLevel: number[], allStartPos: number,
        drillInfo: IDrillInfo[], levelComp?: number[]): number {
        const prevHdrPos: number = isNullOrUndefined(
            allStartPos) ? levelComp[0] : (allStartPos - ((this.colMeasurePos === (allStartPos - 1)) ? 2 : 1));
        const flagLevel: number = drillInfo[prevHdrPos as number] && drillInfo[prevHdrPos as number].level;
        const flagLevelString: string = this.getLevelsAsString(prevHdrPos - 1, drillInfo);
        const groupColl: { [key: string]: { coll: ITotCollection[]; count: number } } = {};
        let maxCnt: number = 1;
        let enterFlag: boolean = false;
        for (const coll of this.totalCollection) {
            if (enterFlag || (coll.allCount <= allCount &&
                ((flagLevel > -1 && coll.drillInfo[prevHdrPos as number]) ? ((coll.drillInfo[prevHdrPos as number].level >= flagLevel) &&
                    (this.getLevelsAsString(prevHdrPos - 1, coll.drillInfo)) === flagLevelString) : true))) {
                const measureName: string = this.tupColumnInfo[coll.ordinal].measure ?
                    this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent : 'measure';
                if (groupColl[measureName as string]) {
                    groupColl[measureName as string].coll.push(coll);
                    groupColl[measureName as string].count++;
                    maxCnt = maxCnt < groupColl[measureName as string].count ? groupColl[measureName as string].count : maxCnt;
                } else {
                    groupColl[measureName as string] = { coll: [coll], count: 1 };
                }
                enterFlag = false;
            }
        }
        const keys: string[] = Object.keys(groupColl);
        let collLength: number = maxCnt - 1;
        while (collLength > -1) {
            for (const key of keys) {
                const coll1: ITotCollection = groupColl[key as string].coll[collLength as number];
                if (coll1) {
                    const isGrandTotal: boolean = this.tupColumnInfo[coll1.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll1.ordinal].allStartPos === 1 : this.tupColumnInfo[coll1.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(
                            coll1.members, coll1.ordinal, position, maxLevel, minLevel, allType);
                        if (this.tupColumnInfo[coll1.ordinal].showTotals) {
                            position++;
                        }
                    }
                    this.totalCollection.pop();
                }
            }
            collLength--;
        }
        return position;
    }

    private getLevelsAsString(prevHdrPos: number, drillInfo: IDrillInfo[]): string {
        const lvlCollection: number[] = [];
        for (let pos: number = 0; pos < prevHdrPos; pos++) {
            lvlCollection[pos as number] = drillInfo[pos as number].level;
        }
        return lvlCollection.length > 0 ? lvlCollection.toString() : '';
    }

    private frameCommonColumnLoop(
        members: NodeListOf<Element>, tupPos: number, position: number, maxLevel: number[], minLevel: number[],
        allType: number[]): void {
        let drillMemberPosition: number = -1;
        if (this.tupColumnInfo[tupPos as number].showTotals) {
            let memberPos: number = 0;
            let memberDepth: number = 0;
            while (memberPos < members.length) {
                memberDepth += (allType[memberPos as number] > 0 && this.getMeasurePosition(
                    this.tupColumnInfo[tupPos as number].uNameCollection, this.tupColumnInfo[tupPos as number].measurePosition
                ) !== memberPos) ? maxLevel[memberPos as number] : (
                        maxLevel[memberPos as number] + (1 - minLevel[memberPos as number])
                    );
                if (this.tupColumnInfo[tupPos as number].drillInfo[memberPos as number].isDrilled &&
                    this.tupColumnInfo[tupPos as number].showTotals) {
                    this.tupColumnInfo[tupPos as number].showTotals = !this.showColumnSubTotals ? false : this.hideColumnTotalsObject[
                        this.tupColumnInfo[tupPos as number].drillInfo[memberPos as number].hierarchy
                    ] === undefined;
                    memberDepth -= maxLevel[memberPos as number] -
                        this.tupColumnInfo[tupPos as number].levelCollection[memberPos as number];
                    drillMemberPosition = this.tupColumnInfo[tupPos as number].showTotals ? -1 : (memberDepth - 1);
                }
                memberPos++;
            }
        }
        const attrDrill: boolean = this.checkAttributeDrill(this.tupColumnInfo[tupPos as number].drillInfo, 'columns');
        if (this.tupColumnInfo[tupPos as number].showTotals || attrDrill) {
            let memPos: number = 0;
            let spanMemPos: number = 0;
            const colMembers: { [key: string]: string } = {};
            let isGrandTotal: boolean = members[0].querySelector('LNum').textContent === '0';
            while (memPos < members.length) {
                let member: Element = members[memPos as number];
                const memberType: string = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                    member.querySelector('MEMBER_TYPE').textContent;
                let memDup: number = 0;
                const memberLevel: string = member.querySelector('LNum').textContent;
                for (let rowDepthPos: number = memberType !== '2' ? (allType[memPos as number] ? 1 : minLevel[memPos as number]) : 1;
                    rowDepthPos <= (memberType === '3' ? 1 : maxLevel[memPos as number]); rowDepthPos++) {
                    let isDrilled: boolean = false;
                    if (!this.pivotValues[spanMemPos as number]) {
                        (this.pivotValues[spanMemPos as number] as IAxisSet[]) = [];
                    }
                    if (Number(members[memPos as number].querySelector('LNum').textContent) > rowDepthPos && memberType !== '2') {
                        if (!this.parentObjCollection[memPos as number][rowDepthPos as number]) {
                            this.getDrilledParent(members[memPos as number], rowDepthPos, this.parentObjCollection[memPos as number]);
                        }
                        if (this.parentObjCollection[memPos as number][rowDepthPos as number]) {
                            member = this.parentObjCollection[memPos as number][rowDepthPos as number];
                        }
                        isDrilled = true;
                    } else {
                        member = members[memPos as number];
                        memDup++;
                    }
                    const uName: string = this.getUniqueName(member.querySelector('UName').textContent);
                    if (memberType !== '2') {
                        colMembers[uName as string] = (
                            memberType === '3' && this.dataFields[uName as string] && this.dataFields[uName as string].caption
                        ) ? this.dataFields[uName as string].caption : member.querySelector('Caption').textContent;
                    } else if (memberType === '2' && memberLevel === '0' && isGrandTotal) {
                        colMembers[uName as string] = 'Grand Total';
                        isGrandTotal = false;
                    }
                    const levelNameKeys: string[] = Object.keys(colMembers);
                    let levelName: string = memPos >= this.measurePosition && Number(
                        member.getElementsByTagName('LNum')[0].textContent
                    ) === 0 && levelNameKeys.length === 1 ? 'Grand Total' + this.valueSortSettings.headerDelimiter : '';
                    for (let i: number = 0; i < levelNameKeys.length; i++) {
                        const j: string = levelNameKeys[i as number];
                        if (i === 0) {
                            levelName = levelName + colMembers[j as string];
                        }
                        else {
                            levelName = levelName + this.valueSortSettings.headerDelimiter + colMembers[j as string];
                        }
                    }
                    const isNamedSet: boolean = this.namedSetsPosition['column'][memPos as number] ? true : false;
                    const depth: number = this.getDepth(this.tupColumnInfo[tupPos as number], uName, Number(memberType));
                    if (!(this.isPaging && this.pivotValues[spanMemPos - 1] && this.pivotValues[spanMemPos - 1][position as number] &&
                        this.fieldList[(this.pivotValues[spanMemPos - 1][position as number] as IAxisSet).hierarchy] &&
                        this.fieldList[(this.pivotValues[spanMemPos - 1][position as number] as IAxisSet).hierarchy].isHierarchy &&
                        (this.pivotValues[spanMemPos - 1][position as number] as IAxisSet).hasChild &&
                        !(this.pivotValues[spanMemPos - 1][position as number] as IAxisSet).isDrilled &&
                        !this.columns[memPos as number].isNamedSet && this.fieldList[member.getAttribute('Hierarchy')] &&
                        (this.fieldList[member.getAttribute('Hierarchy')].isHierarchy ||
                            this.fieldList[member.getAttribute('Hierarchy')].hasAllMember) &&
                        (this.pivotValues[spanMemPos - 1][position as number] as IAxisSet).depth < depth)) {
                        (this.pivotValues[spanMemPos as number] as IAxisSet[])[position as number] = {
                            axis: 'column',
                            actualText: uName,
                            colIndex: position,
                            formattedText: (memberType === '3' && this.dataFields[uName as string] &&
                                this.dataFields[uName as string].caption) ? this.dataFields[uName as string].caption :
                                member.querySelector('Caption').textContent,
                            hasChild: (this.fieldList[member.getAttribute('Hierarchy')] &&
                                this.fieldList[member.getAttribute('Hierarchy')].isHierarchy && memPos < this.columns.length - 1 &&
                                !this.columns[memPos + 1].isNamedSet && this.columns[memPos + 1].name.indexOf('[Measures]') < 0 &&
                                this.fieldList[this.columns[memPos + 1].name] &&
                                this.fieldList[this.columns[memPos + 1].name].hasAllMember) ?
                                true : Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                            level: memDup > 1 ? -1 : (Number(member.querySelector('LNum').textContent) -
                                ((allType[memPos as number] && memberType !== '3') ? 1 : 0)),
                            rowIndex: spanMemPos,
                            ordinal: tupPos,
                            memberType: Number(memberType),
                            depth: depth,
                            isDrilled: (this.fieldList[member.getAttribute('Hierarchy')] &&
                                this.fieldList[member.getAttribute('Hierarchy')].isHierarchy &&
                                !this.isAttributeDrill(
                                    member.getAttribute('Hierarchy'), this.tupColumnInfo[tupPos as number].drillInfo, 'columns'
                                )) ? true : (isDrilled || this.tupColumnInfo[tupPos as number].drillInfo[memPos as number].isDrilled),
                            parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ?
                                member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                            levelUniqueName: member.querySelector('LName').textContent,
                            hierarchy: member.getAttribute('Hierarchy'),
                            isNamedSet: isNamedSet,
                            valueSort: { levelName: levelName, [levelName as string]: 1, axis: member.getAttribute('Hierarchy') }
                        };
                        if (!this.headerContent[spanMemPos as number]) {
                            this.headerContent[spanMemPos as number] = {} as IAxisSet[];
                        }
                        this.headerContent[spanMemPos as number][position as number] =
                            (this.pivotValues[spanMemPos as number] as IAxisSet[])[position as number];
                        spanMemPos++;
                    } else {
                        this.isColDrill = true;
                        break;
                    }
                }
                memPos++;
            }
        } else {
            if (drillMemberPosition > -1) {
                (this.pivotValues[drillMemberPosition as number] as IAxisSet[])[position - 1].ordinal = tupPos;
            } else if (this.tupColumnInfo[tupPos as number].allCount > 0) {
                let memberPos: number = 0;
                let memberDepth: number = 0;
                while (memberPos < this.tupColumnInfo[tupPos as number].allStartPos) {
                    memberDepth += (allType[memberPos as number] > 0 &&
                        this.getMeasurePosition(this.tupColumnInfo[tupPos as number].uNameCollection,
                                                this.tupColumnInfo[tupPos as number].measurePosition) !== memberPos) ?
                        maxLevel[memberPos as number] :
                        (maxLevel[memberPos as number] + (1 - minLevel[memberPos as number]));
                    memberPos++;
                }
                if (this.tupColumnInfo[tupPos as number].allStartPos === (this.tupColumnInfo[tupPos as number].measurePosition + 1)) {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos as number].allStartPos - 2] -
                        this.tupColumnInfo[tupPos as number].levelCollection[this.tupColumnInfo[tupPos as number].allStartPos - 2] + 1;
                } else {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos as number].allStartPos - 1] -
                        this.tupColumnInfo[tupPos as number].levelCollection[this.tupColumnInfo[tupPos as number].allStartPos - 1];
                }
                if (this.pivotValues[memberDepth - 1]) {
                    (this.pivotValues[memberDepth - 1] as IAxisSet[])[position - 1].ordinal = tupPos;
                }
            }
        }
    }

    private isAttributeDrill(hierarchy: string, drillInfo: IDrillInfo[], axis: string): boolean {
        let isDrill: boolean = false;
        const isAdjacent: boolean = this.isAdjacentToMeasure(hierarchy, axis);
        if (!isAdjacent) {
            for (let i: number = 0; i < this.drilledMembers.length; i++) {
                if (this.drilledMembers[i as number].name === hierarchy) {
                    for (let j: number = 0; j < this.drilledMembers[i as number].items.length; j++) {
                        const delimiter: string = this.drilledMembers[i as number].delimiter;
                        const drillItems: string[] = this.drilledMembers[i as number].items[j as number].split(delimiter);
                        let levelName: string = '';
                        for (let k: number = 0; k < drillItems.length; k++) {
                            if (drillInfo[k as number] && drillInfo[k as number].uName) {
                                levelName = levelName + (levelName === '' ? '' : this.drilledMembers[i as number].delimiter) +
                                    drillInfo[k as number].uName;
                            }
                        }
                        if (levelName === this.drilledMembers[i as number].items[j as number]) {
                            isDrill = true;
                            break;
                        }
                    }
                }
            }
        }
        return isDrill;
    }

    private isAdjacentToMeasure(hierarchy: string, axis: string): boolean {
        let isAdjacent: boolean = false;
        const fields: IFieldOptions[] = axis === 'rows' ? this.rows : this.columns;
        for (let i: number = 0; i < fields.length; i++) {
            if (fields[i as number].name === hierarchy && fields[i + 1] && (fields[i + 1].name === '[Measures]' ||
                fields[i + 1].isNamedSet || (this.fieldList[fields[i + 1].name] &&
                    !this.fieldList[fields[i + 1].name].hasAllMember))) {
                isAdjacent = true;
                break;
            }
        }
        return isAdjacent;
    }

    private getDrilledParent(childMember: Element, parentLevel: number, savedCollection: { [key: number]: Element }): void {
        const childlevel: number = Number(childMember.querySelector('LNum').textContent);
        let currentChild: Element = childMember;
        for (let lvl: number = childlevel - 1; lvl >= parentLevel; lvl--) {
            const currentParent: Element = this.drilledSets[currentChild.querySelector('PARENT_UNIQUE_NAME').textContent];
            if (currentParent) {
                savedCollection[lvl as number] = currentParent;
                currentChild = currentParent;
            } else {
                break;
            }
        }
    }

    private performRowSorting(valCollection: { [key: string]: Element }, valueSortData: ValueSortInfo): void {
        if ((this.enableSort || this.enableValueSorting) && this.tupRowInfo.length > 0) {
            const rowCount: number = this.pivotValues.length;
            const lvlGrouping: { [key: number]: { [key: string]: IAxisSet[] } } = {};
            const measureObjects: { [key: string]: IAxisSet[] } = {};
            let gSumGrouping: IAxisSet[] = [];
            let gSumFlag: boolean = false;
            const withoutAllLastPos: number = this.tupRowInfo[0].typeCollection.lastIndexOf('1');
            let isDrilled: boolean;
            for (let rPos: number = this.colDepth; rPos < rowCount; rPos++) {
                const currentCell: IAxisSet = (this.pivotValues[rPos as number] as IAxisSet[])[0];
                if (this.showSubTotalsAtBottom && currentCell.isSum && currentCell.memberType !== 3) {
                    continue;
                }
                const currentTuple: ITupInfo = this.tupRowInfo[currentCell.ordinal];
                let uniqueName: string = currentTuple ? (currentTuple.measurePosition === 0 && currentCell.memberType === 3 ?
                    currentTuple.measureName : currentTuple.uNameCollection) : '';
                if (uniqueName !== '') {
                    if (withoutAllLastPos > -1) {
                        uniqueName = this.frameUniqueName(uniqueName, currentCell, currentTuple);
                    }
                    const level: number = uniqueName.split(/~~|::\[/).length;
                    if (currentCell.memberType === 3 && this.tupRowInfo[0].measurePosition > 0) {
                        const parentUName: string = this.getParentUname(uniqueName, currentCell, true, true);
                        if (measureObjects[parentUName as string]) {
                            measureObjects[parentUName as string].push(currentCell);
                        } else {
                            measureObjects[parentUName as string] = [currentCell];
                        }
                    } else if (lvlGrouping[level as number]) {
                        lvlGrouping[level as number][uniqueName as string] = [currentCell];
                    } else {
                        lvlGrouping[level as number] = { [uniqueName]: [currentCell] };
                    }
                }
                if (gSumFlag) {
                    gSumGrouping.push(currentCell);
                }
                if (currentCell.type === 'grand sum') {
                    gSumFlag = true;
                }
            }
            const isMeasureAvail: boolean = Object.keys(measureObjects).length > 0 && this.tupRowInfo[0].measurePosition > 0;
            const levels: number[] = Object.keys(lvlGrouping).map((item: string) => {
                return Number(item);
            }).sort((a: number, b: number) => (a > b) ? 1 : ((b > a) ? -1 : 0));
            const sortLvlGrouping: { [key: number]: { [key: string]: IAxisSet[] } } = {};
            for (let lPos: number = levels.length - 1; lPos >= 0; lPos--) {
                const parentGrouping: { [key: string]: IAxisSet[] } = {};
                const objCollection: { [key: string]: IAxisSet[] } = lvlGrouping[levels[lPos as number]];
                const objKeys: string[] = Object.keys(objCollection);
                for (let oPos: number = 0; oPos < objKeys.length; oPos++) {
                    const parentUName: string = lPos === 0 ? 'parent' :
                        this.getParentUname(objKeys[oPos as number], objCollection[objKeys[oPos as number]][0], isMeasureAvail, false);
                    if (parentGrouping[parentUName as string]) {
                        parentGrouping[parentUName as string].push(objCollection[objKeys[oPos as number]][0]);
                    } else {
                        parentGrouping[parentUName as string] = [objCollection[objKeys[oPos as number]]][0];
                    }
                }
                const pKeys: string[] = Object.keys(parentGrouping);
                for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                    parentGrouping[pKeys[kPos as number]] = this.sortRowHeaders(
                        parentGrouping[pKeys[kPos as number]], valCollection, valueSortData
                    );
                }
                if (sortLvlGrouping[levels[lPos + 1]]) {
                    for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                        let groupSets: IAxisSet[] = [];
                        const axisSets: IAxisSet[] = parentGrouping[pKeys[kPos as number]];
                        for (let aPos: number = 0; aPos < axisSets.length; aPos++) {
                            const tupInfo: ITupInfo = this.tupRowInfo[axisSets[aPos as number].ordinal];
                            let uName: string = (tupInfo.measurePosition === 0 && axisSets[aPos as number].memberType === 3) ?
                                tupInfo.measureName : tupInfo.uNameCollection;
                            groupSets.push(axisSets[aPos as number]);
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(uName, axisSets[aPos as number], tupInfo);
                            }
                            let isMembersIncluded: boolean = false;
                            if (isMeasureAvail) {
                                const parentUName: string = this.getParentUname(uName, axisSets[aPos as number], isMeasureAvail, true);
                                if (measureObjects[parentUName as string]) {
                                    measureObjects[parentUName as string] = this.sortRowHeaders(
                                        measureObjects[parentUName as string], valCollection, valueSortData
                                    );
                                    const isLastMeasure: boolean = uName.lastIndexOf('::[') === uName.indexOf('::[Measures]');
                                    const isFullLength: boolean = uName.split('::[').length - 1 === tupInfo.measurePosition;
                                    const isLastNotDrilledMember: boolean = !tupInfo.drillInfo[tupInfo.measurePosition - 1].isDrilled;
                                    const isActualLastMember: boolean = tupInfo.members.length > (tupInfo.measurePosition + 1);
                                    if (isLastMeasure && isFullLength && isLastNotDrilledMember && isActualLastMember) {
                                        isMembersIncluded = true;
                                        for (let mPos: number = 0; mPos < measureObjects[parentUName as string].length; mPos++) {
                                            groupSets.push(measureObjects[parentUName as string][mPos as number]);
                                            const matchParent: string = (uName.substring(
                                                0, uName.indexOf(
                                                    '::[Measures]')) + '::' + measureObjects[parentUName as string][mPos as number].actualText);
                                            if (sortLvlGrouping[levels[lPos + 1]][matchParent as string]) {
                                                groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][matchParent as string]);
                                            }
                                        }
                                    } else {
                                        isDrilled = this.showSubTotalsAtBottom && groupSets[groupSets.length - 1].isDrilled;
                                        groupSets = groupSets.concat(measureObjects[parentUName as string]);
                                    }
                                }
                            }
                            if (!isMembersIncluded &&
                                sortLvlGrouping[levels[lPos + 1]][uName as string]) {
                                if (this.showSubTotalsAtBottom && groupSets[groupSets.length - 1].memberType === 3 &&
                                    groupSets[groupSets.length - 1].level > -1 && isDrilled) {
                                    let valueColl: IAxisSet[] = [];
                                    let sliceIndex: number = 0;
                                    for (let i: number = groupSets.length - 1; i >= 0; i--) {
                                        if (groupSets[i as number].memberType === 3) {
                                            valueColl[valueColl.length] = groupSets[i as number];
                                        } else {
                                            valueColl = valueColl.reverse();
                                            sliceIndex = i + 1;
                                            break;
                                        }
                                    }
                                    groupSets = groupSets.slice(0, sliceIndex).concat(
                                        sortLvlGrouping[levels[lPos + 1]][uName as string]).concat(valueColl);
                                } else {
                                    const currentCell: IAxisSet = groupSets[groupSets.length - 1];
                                    let subTotal: IAxisSet;
                                    if (this.showSubTotalsAtBottom && currentCell.isDrilled) {
                                        subTotal = PivotUtil.frameHeaderWithKeys(currentCell);
                                        subTotal.hasChild = false; subTotal.isDrilled = false; subTotal.isSum = true;
                                        subTotal.formattedText = subTotal.formattedText + ' Total';
                                    }
                                    groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][uName as string]);
                                    if (subTotal) {
                                        groupSets[groupSets.length] = subTotal;
                                    }
                                }
                            }
                        }
                        parentGrouping[pKeys[kPos as number]] = groupSets;
                    }
                } else if (isMeasureAvail) {
                    for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                        const axisSets: IAxisSet[] = parentGrouping[pKeys[kPos as number]];
                        let groupSets: IAxisSet[] = [];
                        for (let aPos: number = 0; aPos < axisSets.length; aPos++) {
                            groupSets.push(axisSets[aPos as number]);
                            let uName: string = this.tupRowInfo[axisSets[aPos as number].ordinal].uNameCollection;
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(
                                    uName, axisSets[aPos as number], this.tupRowInfo[axisSets[aPos as number].ordinal]);
                            }
                            const parentUName: string =
                                this.getParentUname(uName, axisSets[aPos as number], true, true);
                            if (measureObjects[parentUName as string]) {
                                measureObjects[parentUName as string] = this.sortRowHeaders(
                                    measureObjects[parentUName as string], valCollection, valueSortData
                                );
                                groupSets = groupSets.concat(measureObjects[parentUName as string]);
                            }
                        }
                        parentGrouping[pKeys[kPos as number]] = groupSets;
                    }
                }
                sortLvlGrouping[levels[lPos as number]] = parentGrouping;
            }
            let newPos: number = 0;
            let totPos: number = 0;
            let valuePos: number = 0;
            gSumFlag = false;
            gSumGrouping = this.sortRowHeaders(gSumGrouping, valCollection, valueSortData);
            for (let rPos: number = this.colDepth; rPos < rowCount; rPos++) {
                if (this.dataSourceSettings.grandTotalsPosition === 'Top' && (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) &&
                    ((this.olapValueAxis === 'column' && this.colDepth + 1 === rPos) || (this.olapValueAxis === 'row' && this.colDepth + this.dataSourceSettings.values.length + 1 === rPos))) {
                    newPos = 0;
                    gSumFlag = false;
                }
                const cell: IAxisSet[] = gSumFlag ? gSumGrouping : sortLvlGrouping[levels[0]]['parent'];
                const currPos: number = (this.dataSourceSettings.grandTotalsPosition === 'Top' && (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) && this.colDepth === rPos) ? cell.length : gSumFlag ? (newPos - totPos) : newPos;
                if (cell[currPos as number]) {
                    this.pivotValues[rPos as number] = [cell[currPos as number]];
                    (this.pivotValues[rPos as number][0] as IAxisSet).rowIndex = rPos;
                    this.valueContent[valuePos as number][0] = this.pivotValues[rPos as number][0] as IAxisSet;
                }
                newPos++;
                valuePos++;
                if ((this.pivotValues[rPos as number][0] as IAxisSet).type === 'grand sum') {
                    gSumFlag = true;
                    totPos = newPos;
                }
            }
        }
    }
    private performColumnSorting(valCollection: { [key: string]: Element }, valueSortData: ValueSortInfo): void {
        if (this.enableSort || this.enableValueSorting) {
            for (let i: number = 0; i < this.dataSourceSettings.columns.length; i++) {
                const temporary: Object[] = [];
                let index: number = 0;
                const grandTotal: Object[] = [];
                for (let j: number = 0; j < this.pivotValues.length; j++) {
                    const header: IAxisSet[] = this.pivotValues[j as number] as IAxisSet[];
                    let keys: string[];
                    let arrange: { [key: string]: IAxisSet[] } = {};
                    let arrangeHeaders: IAxisSet[] = [];
                    let value: number = 1;
                    grandTotal[index as number] = [];
                    temporary[index as number] = [];
                    let k: number = 1;
                    const fieldName: string = header[k as number].hierarchy;
                    const levelName: string = header[k as number].levelUniqueName;
                    for (k; k < header.length; k++) {
                        if (!header[k as number].isNamedSet) {
                            if ((header[k as number] as IAxisSet).memberType !== 2 && header[k as number].hierarchy
                                !== '[Measures]' && (header[k as number] as IAxisSet).level !== -1) {
                                if (isNullOrUndefined(arrange[header[k as number].formattedText]) ||
                                    isNullOrUndefined(this.pivotValues[j - 1])) {
                                    if (!arrange[header[k as number].formattedText]) {
                                        arrange[header[k as number].formattedText] = [];
                                    }
                                    if (!header[k + 1] || (header[k as number].formattedText !== header[k + 1].formattedText)) {
                                        arrangeHeaders[arrangeHeaders.length] = header[k as number];
                                    }
                                    arrange[header[k as number].formattedText][header[k as number].colIndex] = header[k as number];
                                } else if (arrange[header[k as number].formattedText] && this.pivotValues[j - 1]) {
                                    const prevRowCell: IAxisSet = this.pivotValues[j - 1][header[k as number].colIndex];
                                    const prevColValue: number = Number(Object.keys(arrange[header[k as number].formattedText])[0]);
                                    const prevColIndex: number = ((
                                        arrange[header[k as number].formattedText]
                                    )[prevColValue as number]).colIndex;
                                    const prevColRowCell: IAxisSet = this.pivotValues[j - 1][prevColIndex as number];
                                    if (prevRowCell.formattedText !== prevColRowCell.formattedText) {
                                        keys = this.sortColumnHeaders(
                                            arrange, arrangeHeaders, this.sortObject[header[k - 1].levelUniqueName] ||
                                            this.sortObject[header[k as number].hierarchy],
                                            valCollection, valueSortData, fieldName, levelName
                                        );
                                        temporary[index as number] = isNullOrUndefined(temporary[index as number]) ? [] :
                                            temporary[index as number];
                                        for (let keyPos: number = 0; keyPos < keys.length; keyPos++) {
                                            const length: number = Object.keys(arrange[keys[keyPos as number]]).length;
                                            for (let cellPos: number = 0; cellPos < length; cellPos++) {
                                                value = (temporary[index as number] as Object[]).length === 0 ? 1 : 0;
                                                (temporary[index as number] as Object[])[
                                                    (temporary[index as number] as Object[]).length + value
                                                ] = arrange[keys[keyPos as number]][
                                                    Number(Object.keys(arrange[keys[keyPos as number]])[cellPos as number])
                                                ];
                                            }
                                        }
                                        arrange = {};
                                        arrangeHeaders = [];
                                        arrange[header[k as number].formattedText] = [];
                                        arrangeHeaders[arrangeHeaders.length] = header[k as number];
                                        arrange[header[k as number].formattedText][header[k as number].colIndex] = header[k as number];
                                    } else {
                                        arrange[header[k as number].formattedText][header[k as number].colIndex] = header[k as number];
                                    }
                                }
                            } else if (Object.keys(arrange).length > 0) {
                                (grandTotal[index as number] as Object[])[(grandTotal[index as number] as Object[]).length + value]
                                    = header[k as number];
                                keys = this.sortColumnHeaders(
                                    arrange, arrangeHeaders, this.sortObject[header[k - 1].levelUniqueName] ||
                                    this.sortObject[header[k as number].hierarchy], valCollection, valueSortData, fieldName, levelName
                                );
                                temporary[index as number] = isNullOrUndefined(temporary[index as number]) ? [] :
                                    temporary[index as number];
                                for (let l: number = 0; l < keys.length; l++) {
                                    const length: number = Object.keys(arrange[keys[l as number]]).length;
                                    for (let q: number = 0; q < length; q++) {
                                        value = (temporary[index as number] as Object[]).length === 0 ? 1 : 0;
                                        (temporary[index as number] as Object[])[(temporary[index as number] as Object[]).length + value] =
                                            arrange[keys[l as number]][Number(Object.keys(arrange[keys[l as number]])[q as number])];
                                    }
                                }
                            } else if (((header[k as number] as IAxisSet).level === -1 || (header[k as number] as IAxisSet).level === 0) &&
                                Object.keys(arrange).length >= 0 && header[k as number].hierarchy !== '[Measures]') {
                                (grandTotal[index as number] as Object[])[(grandTotal[index as number] as Object[]).length + value]
                                    = header[k as number];
                            }
                            if ((header[k as number] as IAxisSet).level !== -1 && Object.keys(arrange).length === 1 &&
                                header[k as number].hierarchy !== '[Measures]' && !isNullOrUndefined(header[k + 1]) &&
                                (header[k + 1] as IAxisSet).level === -1) {
                                const height: number = Object.keys(arrange[(header[k as number] as IAxisSet).formattedText]).length;
                                const weight: string[] = Object.keys(arrange[(header[k as number] as IAxisSet).formattedText]);
                                if (height > 1) {
                                    for (let hgt: number = 0; hgt < height; hgt++) {
                                        value = (grandTotal[index as number] as Object[]).length === 0 ? 1 : 0;
                                        (grandTotal[index as number] as Object[])[(grandTotal[index as number] as Object[]).length + value]
                                            = arrange[(header[k as number] as IAxisSet).formattedText][Number(weight[hgt as number])];
                                    }
                                } else {
                                    (grandTotal[index as number] as Object[])[(grandTotal[index as number] as Object[]).length + value]
                                        = header[k as number];
                                }
                            }
                            if (Object.keys(grandTotal[index as number]).length > 0) {
                                value = (temporary[index as number] as Object[]).length === 0 ? 1 : 0;
                                const height1: number = (grandTotal[index as number] as Object[]).length;
                                if (height1 > 2) {
                                    for (let hgt1: number = 1; hgt1 < height1; hgt1++) {
                                        value = (temporary[index as number] as Object[]).length === 0 ? 1 : 0;
                                        (temporary[index as number] as Object[])[(temporary[index as number] as Object[]).length + value] =
                                            (grandTotal[index as number] as Object[])[hgt1 as number];
                                    }
                                } else {
                                    (temporary[index as number] as Object[])[(temporary[index as number] as Object[]).length + value] =
                                        (grandTotal[index as number] as Object[])[1] || (grandTotal[index as number] as Object[])[0];
                                }
                                arrange = {};
                                arrangeHeaders = [];
                                grandTotal[index as number] = [];
                            }
                        }
                    }
                    if (Object.keys(arrange).length > 0) {
                        (grandTotal[index as number] as Object[])[
                            (grandTotal[index as number] as Object[]).length + value
                        ] = header[k as number];
                        const order: string = this.sortObject[header[k - 1].levelUniqueName] || this.sortObject[header[k - 1].hierarchy];
                        keys = this.sortColumnHeaders(arrange, arrangeHeaders, order, valCollection, valueSortData, fieldName, levelName);
                        temporary[index as number] = isNullOrUndefined(temporary[index as number]) ? [] : temporary[index as number];
                        for (let len: number = 0; len < keys.length; len++) {
                            const leng: number = Object.keys(arrange[keys[len as number]]).length;
                            for (let q: number = 0; q < leng; q++) {
                                value = (temporary[index as number] as Object[]).length === 0 ? 1 : 0;
                                (temporary[index as number] as Object[])[
                                    (temporary[index as number] as Object[]).length + value
                                ] = arrange[keys[len as number]][Number(Object.keys(arrange[keys[len as number]])[q as number])];
                            }
                        }
                    }
                    for (let m: number = 1; m < (temporary[index as number] as Object[]).length; m++) {
                        this.pivotValues[index as number][m as number] = (temporary[index as number] as Object[])[m as number];
                    }
                    for (let n: number = j; n < this.pivotValues.length; n++) {
                        const pElement: IPivotRows = extend({}, this.pivotValues[n + 1], null, true) as IAxisSet[][];
                        const cElement: IPivotRows = extend({}, this.pivotValues[n as number], null, true) as IAxisSet[][];
                        if (Object.keys(pElement).length === Object.keys(cElement).length && Object.keys(pElement).length > 2) {
                            for (let o: number = 1; o < this.pivotValues[j as number].length; o++) {
                                if (Object.keys(pElement).length > 0 && (cElement[o as number] as IAxisSet).colIndex
                                    !== (pElement[o as number] as IAxisSet).colIndex) {
                                    this.pivotValues[n + 1][o as number] =
                                        pElement[(cElement[o as number] as IAxisSet).colIndex] as IAxisSet;
                                }
                            }
                            break;
                        }
                    }
                    index++;
                    arrange = {};
                }
                for (let i: number = 0; i < this.pivotValues.length; i++) {
                    const header: IPivotRows = this.pivotValues[i as number];
                    for (let j: number = 1; j < header.length; j++) {
                        (header[j as number] as IAxisSet).colIndex = j;
                    }
                }
            }
        }
    }
    private frameUniqueName(uniqueName: string, currentCell: IAxisSet, currentTuple: ITupInfo): string {
        const hasLastMeasure: boolean = uniqueName.indexOf(currentCell.actualText.toString() + '::[Measures]') > -1;
        uniqueName = uniqueName.substring(0, uniqueName.indexOf(currentCell.actualText.toString())) +
            currentCell.actualText.toString();
        const measureAvail: boolean = uniqueName.split('::[').length <= this.getMeasurePosition(uniqueName, currentTuple.measurePosition);
        uniqueName = uniqueName + ((hasLastMeasure || measureAvail) ? ('::' + currentTuple.measureName) : '');
        return uniqueName;
    }
    private getMeasurePosition(uniqueName: string, measurePosition: number): number {
        let position: number = measurePosition;
        const collection: string[] = uniqueName.split('::[');
        for (let i: number = 0; i < collection.length; i++) {
            if (collection[i as number] && collection[i as number].indexOf('Measures') > -1) {
                position = i;
                break;
            }
        }
        return position;
    }
    private sortRowHeaders(
        headers: IAxisSet[], valCollection: { [key: string]: Element }, valueSortData: ValueSortInfo
    ): IAxisSet[] {
        if (this.enableValueSorting && this.olapValueAxis === 'column' && valueSortData.isValueSorting && !isNullOrUndefined(this.valueSortSettings)) {
            const aggreColl: { 'header': IAxisSet; 'value'?: number }[] = [];
            for (let i: number = 0; i < headers.length; i++) {
                const header: IAxisSet = headers[i as number];
                const valueElement: Element = valCollection[(header.ordinal * valueSortData.columnLength) + valueSortData.memberIndex];
                const valueArray: HTMLCollectionOf<Element> = valueElement ? valueElement.getElementsByTagName('Value') : undefined;
                const value: number = valueElement && valueArray.length > 0 ? Number(valueArray[0].textContent) : 0;
                aggreColl.push({ 'header': header, 'value': value });
            }
            headers = PivotUtil.getSortedValue(aggreColl, this.valueSortSettings.sortOrder);
        } else if (this.enableSort && headers.length > 0 && headers[0].memberType !== 3 && !headers[0].isNamedSet) {
            const sortMembers: string[] = [];
            for (let i: number = 0; i < headers.length; i++) {
                sortMembers[i as number] = headers[i as number].actualText as string;
            }
            let isHeaderSortByDefault: boolean = false;
            const fieldName: string = headers[0].actualText !== 'Grand Total' ? headers[0].hierarchy : headers[1].hierarchy;
            const membersInfo: string[] | number[] =
                this.fieldList[fieldName as string] && this.fieldList[fieldName as string].membersOrder ?
                    [...this.fieldList[fieldName as string].membersOrder] as string[] | number[] : [];
            const sortDetails: HeadersSortEventArgs = {
                fieldName: fieldName,
                levelName: headers[0].levelUniqueName,
                sortOrder: (this.sortObject[headers[0].hierarchy] || this.sortObject[headers[0].levelUniqueName]) as Sorting,
                members: membersInfo && membersInfo.length > 0 ? membersInfo : sortMembers,
                IsOrderChanged: false
            };
            if (membersInfo && membersInfo.length > 0) {
                PivotUtil.applyCustomSort(sortDetails, headers, 'string', false, true);
            }
            else {
                if (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === undefined) {
                    headers.sort((a: IAxisSet, b: IAxisSet) => (a.formattedText > b.formattedText) ? 1 :
                        ((b.formattedText > a.formattedText) ? -1 : 0));
                } else if (sortDetails.sortOrder === 'Descending') {
                    headers.sort((a: IAxisSet, b: IAxisSet) => (a.formattedText < b.formattedText) ? 1 :
                        ((b.formattedText < a.formattedText) ? -1 : 0));
                }
                isHeaderSortByDefault = true;
            }
            if (isHeaderSortByDefault && this.getHeaderSortInfo) {
                const copyOrder: string[] = [];
                for (let m: number = 0, n: number = 0; m < headers.length; m++) {
                    if (headers[m as number].actualText !== 'Grand Total') {
                        copyOrder[n++] = headers[m as number].formattedText;
                    }
                }
                sortDetails.members = copyOrder as string[];
            }
            if (this.getHeaderSortInfo) {
                this.getHeaderSortInfo(sortDetails);
            }
            if (sortDetails.IsOrderChanged) {
                PivotUtil.applyCustomSort(sortDetails, headers, 'string', true, true);
            }
        }
        return headers;
    }
    private sortColumnHeaders(
        arrange: { [key: string]: IAxisSet[] }, headers: IAxisSet[], order: string, valCollection: { [key: string]: Element },
        valueSortData: ValueSortInfo, header?: string, levelName?: string
    ): string[] {
        let keys: string[] = Object.keys(arrange);
        if (this.enableValueSorting && this.olapValueAxis === 'row' && valueSortData.isValueSorting && !isNullOrUndefined(this.valueSortSettings)) {
            const aggreColl: { 'header': IAxisSet; 'value'?: number }[] = [];
            for (let i: number = 0; i < keys.length; i++) {
                const childCollection: IAxisSet[] = arrange[keys[i as number]];
                const header: IAxisSet = this.showSubTotalsAtTop ? childCollection[0] : childCollection[childCollection.length - 1];
                const valueElement: Element = valCollection[(valueSortData.memberIndex * valueSortData.columnLength) + header.ordinal];
                const valueArray: HTMLCollectionOf<Element> = valueElement ? valueElement.getElementsByTagName('Value') : undefined;
                const value: number = valueElement && valueArray.length > 0 ? Number(valueArray[0].textContent) : 0;
                aggreColl.push({ 'header': header, 'value': value });
            }
            headers = PivotUtil.getSortedValue(aggreColl, this.valueSortSettings.sortOrder);
            keys = headers.map((header: IAxisSet) => {
                return header.formattedText;
            });
        } else if (this.enableSort) {
            let isHeaderSortByDefault: boolean = false;
            const membersInfo: string[] | number[] = this.fieldList[header as string] && this.fieldList[header as string].membersOrder ?
                [...this.fieldList[header as string].membersOrder] as string[] | number[] : [];
            const sortDetails: HeadersSortEventArgs = {
                fieldName: header,
                levelName: levelName,
                sortOrder: order as Sorting,
                members: membersInfo && membersInfo.length > 0 ? membersInfo : keys,
                IsOrderChanged: false
            };
            if (membersInfo && membersInfo.length > 0) {
                this.applyCustomSort(keys, sortDetails);
            }
            else {
                if (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === undefined) {
                    keys.sort((a: string, b: string): number => (a > b) ? 1 : ((b > a) ? -1 : 0));
                } else if (sortDetails.sortOrder === 'Descending') {
                    keys.sort((a: string, b: string): number => (a < b) ? 1 : ((b < a) ? -1 : 0));
                }
                isHeaderSortByDefault = true;
            }
            if (isHeaderSortByDefault && this.getHeaderSortInfo) {
                const copyOrder: string[] = [];
                for (let m: number = 0, n: number = 0; m < keys.length; m++) {
                    if (keys[m as number] !== 'Grand Total') {
                        copyOrder[n++] = keys[m as number];
                    }
                }
                sortDetails.members = copyOrder as string[];
            }
            if (this.getHeaderSortInfo) {
                this.getHeaderSortInfo(sortDetails);
            }
            if (sortDetails.IsOrderChanged) {
                this.applyCustomSort(keys, sortDetails, true);
            }
        }
        return keys;
    }
    private applyCustomSort(headers: string[], sortDetails: HeadersSortEventArgs, hasMembersOrder?: boolean): string[] {
        let order: string[] | number[] = [];
        const updatedMembers: string[] = [];
        let grandTotal: string;
        if (sortDetails.IsOrderChanged) {
            order = sortDetails.members;
        }
        else {
            order = (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === 'None' || sortDetails.sortOrder === undefined) ? [].concat(sortDetails.members) : [].concat(sortDetails.members).reverse();
        }
        if (headers[0] === 'Grand Total') {
            grandTotal = headers[0];
            headers.shift();
        }
        for (let i: number = 0, j: number = 0; i < headers.length; i++) {
            const sortText: string = headers[i as number];
            if (order[j as number] === sortText) {
                headers.splice(j++, 0, sortText);
                headers.splice(++i, 1);
                if (j < order.length) {
                    i = -1;
                }
                else {
                    if (!hasMembersOrder) {
                        updatedMembers.splice(--j, 0, sortText);
                    }
                    break;
                }
            }
            if (i >= 0 && !hasMembersOrder) {
                updatedMembers[i as number] = headers[i as number];
            }
        }
        if (!hasMembersOrder) {
            for (let i: number = updatedMembers.length; i < headers.length; i++) {
                updatedMembers[i as number] = headers[i as number];
            }
            if (updatedMembers[updatedMembers.length - 1] === 'Grand Total') {
                updatedMembers.pop();
            }
            sortDetails.members = updatedMembers;
        }
        if (grandTotal) {
            headers.splice(0, 0, grandTotal);
        }
        return headers;
    }
    private frameSortObject(): void {
        if (this.enableSort) {
            for (let fPos: number = 0; fPos < this.sortSettings.length; fPos++) {
                this.sortObject[this.sortSettings[fPos as number].name] = this.sortSettings[fPos as number].order;
            }
        }
    }
    private getParentUname(uniqueNameColl: string, cell: IAxisSet, isMeasureAvail: boolean, isLastMeasure: boolean): string {
        let parentString: string = '';
        if (isMeasureAvail && !isLastMeasure) {
            const tuple: ITupInfo = this.tupRowInfo[cell.ordinal];
            const sepPos: number[] = [];
            const sepObjects: { [key: number]: string } = {};
            for (let i: number = 0; i < uniqueNameColl.length; i++) {
                if (uniqueNameColl[i as number] === '~' || uniqueNameColl[i as number] === ':') {
                    sepPos.push(i);
                    sepObjects[i as number] = uniqueNameColl[i as number] + uniqueNameColl[i as number];
                    i++;
                }
            }
            if (this.getMeasurePosition(uniqueNameColl, tuple.measurePosition) >= (uniqueNameColl.split('::[').length - 1)) {
                if (sepPos[sepPos.length - 2] > -1) {
                    parentString = uniqueNameColl.substring(0, sepPos[sepPos.length - 2]) + sepObjects[sepPos[sepPos.length - 1]] +
                        tuple.measureName;
                } else {
                    parentString = 'parent';
                }
            } else {
                const lastPosition: number = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                    uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
                parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
            }
        } else {
            const lastPosition: number = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
            parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
        }
        return parentString;
    }

    private performColumnSpanning(): void {
        const spanCollection: { [key: number]: { [key: number]: number } } = {};
        let rowPos: number = this.rowStartPos - 1;
        const colMeasureCount: number = Object.keys(this.colMeasures).length;
        let measurePosition: number = this.tupColumnInfo[0] ? this.tupColumnInfo[0].measurePosition : this.measureIndex;
        for (let i: number = rowPos; i > -1; i--) {
            if (this.pivotValues[i as number][1].memberType === 3) {
                measurePosition = i;
                break;
            }
        }
        while (rowPos > -1) {
            spanCollection[rowPos as number] = {};
            let colPos: number = (this.pivotValues[rowPos as number] as IAxisSet[]).length - 1;
            while (colPos > 0) {
                spanCollection[rowPos as number][colPos as number] = 1;
                const nextColCell: IAxisSet = (this.pivotValues[rowPos as number] as IAxisSet[])[colPos + 1];
                const nextRowCell: IAxisSet = ((this.pivotValues[rowPos + 1] as IAxisSet[]) && this.rowStartPos - rowPos > 1) ?
                    (this.pivotValues[rowPos + 1] as IAxisSet[])[colPos as number] : undefined;
                const currCell: IAxisSet = (this.pivotValues[rowPos as number] as IAxisSet[])[colPos as number];
                let colflag: boolean = false;
                let rowflag: boolean = false;
                const tupColInfo: ITupInfo = this.tupColumnInfo[currCell.ordinal];
                const isSubTot: boolean = tupColInfo.allStartPos > (tupColInfo.typeCollection[0] === '3' ? 1 : 0);
                const attrDrill: boolean = this.checkAttributeDrill(tupColInfo.drillInfo, 'columns');
                if (this.showSubTotalsAtTop && currCell.isDrilled && nextColCell &&
                    (nextColCell.actualText !== currCell.actualText) && currCell.level > -1) {
                    currCell.ordinal = this.getOrdinal(currCell, this.pivotValues[rowPos + 1] as IAxisSet[]);
                }
                if (nextRowCell && nextColCell && ((currCell.memberType === 2 || currCell.level === -1) ?
                    (nextColCell.actualText === currCell.actualText) :
                    ((currCell.memberType === 3 && currCell.actualText === nextColCell.actualText) ||
                        nextColCell.valueSort.levelName === currCell.valueSort.levelName))) {
                    if (currCell.memberType === 2) {
                        if (isSubTot ? nextColCell.type === 'sum' : true) {
                            currCell.colSpan = (nextColCell.colSpan + 1) >
                                (measurePosition > rowPos ? colMeasureCount : 0) ? 1 : (nextColCell.colSpan + 1);
                        } else {
                            currCell.colSpan = 1;
                        }
                    } else {
                        currCell.colSpan = nextColCell.colSpan + 1;
                        currCell.ordinal = nextColCell.ordinal;
                    }
                    colflag = true;
                }
                if (currCell.memberType === 2) {
                    if (isSubTot) {
                        if (!attrDrill) {
                            currCell.type = 'sum';
                        }
                        //currCell.formattedText = (this.pivotValues[tupColInfo.allStartPos - 1] as IAxisSet[])[colPos as number].formattedText + ' Total';
                        currCell.formattedText = 'Total';
                        currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                    } else {
                        currCell.type = 'grand sum';
                        currCell.formattedText = 'Grand Total';
                        if (rowPos < this.measureIndex) {
                            const levelName: string | number | Date = 'Grand Total';
                            currCell.valueSort.levelName = levelName;
                            currCell.valueSort[levelName.toString()] = 1;
                        }
                    }
                    currCell.hasChild = false;
                } else if (currCell.level === -1) {
                    currCell.type = 'sum';
                    //currCell.formattedText = currCell.formattedText + ' Total';
                    currCell.formattedText = 'Total';
                    currCell.hasChild = false;
                    currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                }
                if (nextRowCell) {
                    if ((currCell.memberType === 2 && nextRowCell.memberType === 2) || nextRowCell.actualText === currCell.actualText) {
                        spanCollection[rowPos as number][colPos as number] = spanCollection[rowPos + 1] ?
                            (spanCollection[rowPos + 1][colPos as number] + 1) : 1;
                        if (rowPos === 0 || (currCell.memberType === 1 && currCell.level > -1 &&
                            nextRowCell.memberType === 1 && nextRowCell.level === -1)) {
                            currCell.rowSpan = (currCell.isDrilled && ((this.fieldList[currCell.hierarchy] &&
                                this.fieldList[currCell.hierarchy].isHierarchy) ? currCell.hasChild : true)) ? 1 :
                                (spanCollection[rowPos + 1][colPos as number] + 1);
                            nextRowCell.rowSpan = (nextRowCell.isDrilled && ((this.fieldList[nextRowCell.hierarchy] &&
                                this.fieldList[nextRowCell.hierarchy].isHierarchy) ? nextRowCell.hasChild : true) &&
                                nextRowCell.level === -1) ? spanCollection[rowPos + 1][colPos as number] : nextRowCell.rowSpan;
                        } else {
                            if (currCell.memberType === 3) {
                                currCell.rowSpan = 1;
                            } else {
                                currCell.rowSpan = -1;
                            }
                        }
                        rowflag = true;
                    } else if (currCell.isDrilled && ((this.fieldList[currCell.hierarchy] &&
                        this.fieldList[currCell.hierarchy].isHierarchy) ? currCell.hasChild : true) && currCell.level === -1 &&
                        nextRowCell.memberType === 2) {
                        spanCollection[rowPos as number][colPos as number] = spanCollection[rowPos + 1] ?
                            (spanCollection[rowPos + 1][colPos as number] + 1) : 1;
                        currCell.rowSpan = -1;
                        rowflag = true;
                    } else {
                        currCell.rowSpan = rowPos === 0 ? spanCollection[rowPos as number][colPos as number] : -1;
                        nextRowCell.rowSpan = ((nextRowCell.level > -1 && !(nextRowCell.isDrilled &&
                            ((this.fieldList[nextRowCell.hierarchy] && this.fieldList[nextRowCell.hierarchy].isHierarchy) ?
                                nextRowCell.hasChild : true))) || (currCell.memberType !== 2 && nextRowCell.memberType === 2)) ?
                            spanCollection[rowPos + 1][colPos as number] : 1;
                    }
                } else {
                    currCell.rowSpan = (currCell.level > -1 || this.rowStartPos === 1) ?
                        spanCollection[rowPos as number][colPos as number] : -1;
                }
                if (!colflag) {
                    currCell.colSpan = 1;
                }
                if (!rowflag) {
                    spanCollection[rowPos as number][colPos as number] = 1;
                }
                colPos--;
            }
            rowPos--;
        }
    }

    private getOrdinal(currCell: IAxisSet, nextRow: IAxisSet[]): number {
        let newOrdinal: number = 0;
        for (let cellIndex: number = currCell.colIndex; cellIndex > 0; cellIndex--) {
            if (nextRow[cellIndex as number].level === -1) {
                newOrdinal = nextRow[cellIndex as number].ordinal;
                break;
            }
        }
        return newOrdinal;
    }

    private frameValues(valCollection: { [key: string]: Element }, colLength: number): void {
        let rowStartPos: number = this.colDepth;
        let rowEndPos: number = this.pivotValues.length;
        let startRowOrdinal: number = 0;
        if (this.customArgs.action === 'down') {
            const keys: string[] = Object.keys(this.onDemandDrillEngine);
            rowStartPos = Number(keys[0]);
            rowEndPos = Number(keys[keys.length - 1]) + 1;
            startRowOrdinal = (this.onDemandDrillEngine[rowStartPos as number][0] as IAxisSet).ordinal;
        }
        for (let rowPos: number = rowStartPos; rowPos < rowEndPos; rowPos++) {
            const columns: IAxisSet[] = this.pivotValues[rowPos as number] as IAxisSet[];
            const rowOrdinal: number = columns[0].ordinal;
            for (let colPos: number = 1; colPos < (this.pivotValues[0] as IAxisSet[]).length; colPos++) {
                if ((this.pivotValues[this.colDepth - 1] as IAxisSet[])[colPos as number]) {
                    const colOrdinal: number = (this.pivotValues[this.colDepth - 1] as IAxisSet[])[colPos as number].ordinal;
                    const lastColCell: IAxisSet = (this.pivotValues[this.colDepth - 1][colPos as number] as IAxisSet);
                    const measure: string | number = columns[0].memberType === 3 ? columns[0].actualText.toString() :
                        ((this.tupColumnInfo[lastColCell.ordinal] && this.tupColumnInfo[lastColCell.ordinal].measure) ?
                            this.tupColumnInfo[lastColCell.ordinal].measure.querySelector('UName').textContent :
                            columns[0].actualText);
                    if (columns[0].type === 'header') {
                        columns[colPos as number] = {
                            axis: 'value',
                            actualText: this.getUniqueName(measure as string),
                            formattedText: '',
                            value: 0,
                            colIndex: colPos,
                            rowIndex: rowPos
                        };
                    } else {
                        let formattedText: string;
                        let value: string = '0';
                        const measureName: string = this.getUniqueName(measure as string);
                        let showTotals: boolean = true;
                        const attrDrill: boolean = (this.fieldList[columns[0].hierarchy] &&
                            this.fieldList[columns[0].hierarchy].isHierarchy) ? columns[0].isDrilled : true;
                        if (this.tupRowInfo[rowOrdinal as number]) {
                            showTotals = this.tupRowInfo[rowOrdinal as number].showTotals;
                        } else {
                            const grandTotalFlag: boolean = this.dataSourceSettings.rows.length === 0 ||
                                (this.dataSourceSettings.rows.length === 1 && this.dataSourceSettings.rows[0].name === '[Measures]');
                            showTotals = (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) ||
                                grandTotalFlag;
                        }
                        const valElement: Element = valCollection[(rowOrdinal - startRowOrdinal) * colLength + colOrdinal];
                        formattedText = this.showSubTotalsAtBottom && columns[0].isDrilled ? '' : (!showTotals && attrDrill) ? '' :
                            ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('FmtValue'))) ?
                                valElement.querySelector('FmtValue').textContent : this.emptyCellTextContent);
                        value = (!showTotals && attrDrill) ? '0' :
                            ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('Value'))) ?
                                valElement.querySelector('Value').textContent : null);
                        formattedText = this.showSubTotalsAtBottom && columns[0].isDrilled ? '' : showTotals && !isNullOrUndefined(value) ?
                            this.getFormattedValue(Number(value), measureName, (formattedText !== '' ? formattedText : value)) : formattedText;
                        const isSum: boolean = (this.tupColumnInfo[colOrdinal as number] ?
                            (this.tupColumnInfo[colOrdinal as number].allCount > 0 ||
                                this.tupColumnInfo[colOrdinal as number].drillStartPos > -1) : true) ||
                            (this.tupRowInfo[rowOrdinal as number] ? (this.tupRowInfo[rowOrdinal as number].allCount > 0 ||
                                this.tupRowInfo[rowOrdinal as number].drillStartPos > -1) : true);
                        const isGrand: boolean = (this.tupRowInfo[rowOrdinal as number] ?
                            (this.tupRowInfo[rowOrdinal as number].measurePosition === 0 ?
                                this.tupRowInfo[rowOrdinal as number].allStartPos === 1 :
                                this.tupRowInfo[rowOrdinal as number].allStartPos === 0) : false) ||
                                (this.tupColumnInfo[colOrdinal as number] ?
                                    (this.tupColumnInfo[colOrdinal as number].measurePosition === 0 ?
                                        this.tupColumnInfo[colOrdinal as number].allStartPos === 1 :
                                        this.tupColumnInfo[colOrdinal as number].allStartPos === 0) : false);
                        columns[colPos as number] = {
                            axis: 'value',
                            actualText: measureName,
                            formattedText: formattedText,
                            colOrdinal: colOrdinal,
                            rowOrdinal: rowOrdinal,
                            columnHeaders: this.tupColumnInfo[colOrdinal as number] ? this.tupColumnInfo[colOrdinal as number].captionCollection : '',
                            rowHeaders: this.tupRowInfo[rowOrdinal as number] ? this.tupRowInfo[rowOrdinal as number].captionCollection : '',
                            value: !isNullOrUndefined(value) ? Number(value) : null,
                            colIndex: colPos,
                            rowIndex: rowPos,
                            isSum: isSum,
                            isGrandSum: isGrand
                        };
                    }
                    this.valueContent[rowPos - this.rowStartPos][colPos as number] = columns[colPos as number];
                }
            }
        }
    }

    /**
     * It performs to returns the formatted value.
     *
     * @param {number} value - It Defines the value of formatting data.
     * @param {string} fieldName - It contains the value of the field name.
     * @param {string} formattedText - It contains the value of the formatted text.
     * @returns {string} - It returns formatted Value as string.
     * @hidden
     */
    public getFormattedValue(value: number, fieldName: string, formattedText: string): string {
        let formattedValue: string = formattedText;
        if (this.formatFields[fieldName as string] && !isNullOrUndefined(value)) {
            const formatField: IFormatSettings = ((<{ [key: string]: Object }>this.formatFields[fieldName as string]).properties ?
                (<{ [key: string]: Object }>this.formatFields[fieldName as string]).properties : this.formatFields[fieldName as string]);
            const formatObj: IFormatSettings = extend({}, formatField, null, true) as IFormatSettings;
            delete formatObj.name;
            if (!formatObj.minimumSignificantDigits && formatObj.minimumSignificantDigits < 1) {
                delete formatObj.minimumSignificantDigits;
            }
            if (!formatObj.maximumSignificantDigits && formatObj.maximumSignificantDigits < 1) {
                delete formatObj.maximumSignificantDigits;
            }
            if (formatObj.type) {
                formattedValue = this.globalize.formatDate(new Date(value.toString()), formatObj);
            } else {
                delete formatObj.type;
                formattedValue = this.globalize.formatNumber(value, formatObj);
            }
        }
        return formattedValue;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private getMeasureInfo(): IMeasureInfo {
        this.olapValueAxis = undefined;
        this.olapRowValueIndex = undefined;
        let mAxis: string = 'column';
        let mIndex: number;
        const values: string[] = [];
        for (const field of this.values) {
            values[values.length] = (field.isCalculatedField ? this.fieldList[field.name].tag : field.name);
        }
        if (values.length > 0) {
            if (this.isMeasureAvail) {
                let isAvail: boolean = false;
                let fieldCount: number = 0;
                for (let i: number = 0, cnt: number = this.rows.length; i < cnt; i++) {
                    if (this.rows[i as number].name.toLowerCase() === '[measures]') {
                        mAxis = 'row';
                        mIndex = i;
                        isAvail = true;
                        fieldCount = this.dataSourceSettings.rows.length;
                        this.olapRowValueIndex = mIndex;
                        break;
                    }
                }
                if (!isAvail) {
                    for (let i: number = 0, cnt: number = this.columns.length; i < cnt; i++) {
                        if (this.columns[i as number].name.toLowerCase() === '[measures]') {
                            mAxis = 'column';
                            mIndex = i;
                            isAvail = true;
                            fieldCount = this.dataSourceSettings.columns.length;
                            break;
                        }
                    }
                }
                this.olapValueAxis = mAxis;
                this.measurePosition = mIndex;
                this.measureIndex = mIndex === fieldCount - 1 ? -1 : mIndex;
            } else {
                mAxis = this.valueAxis;
                mIndex = mAxis === 'row' ? this.rows.length - 1 : this.columns.length - 1;
            }
            return { measureAxis: mAxis, measureIndex: mIndex, valueInfo: values };
        } else {
            return { measureAxis: mAxis, measureIndex: -1, valueInfo: [] };
        }
    }

    private frameMeasureOrder(
        measureInfo: IMeasureInfo, axis: string, tuples: Element[], vTuples: Element[], cLen: number, valuesCount: number): IOrderedInfo {
        const orderedTuples: Element[] = [];
        const orderedVTuples: Element[] = [];
        const orderedIndex: number[] = [];
        const levels: { [key: string]: { index: number; node: Element } } = {};
        const cLevels: string[] = [];
        const measureAxis: string = measureInfo.measureAxis;
        const measureIndex: number = measureInfo.measureIndex;
        const values: string[] = measureInfo.valueInfo;
        if (measureAxis === axis && values.length > 0) {
            const levelCollection: { [key: string]: string[] } = {};
            const uniqueLevels: string[] = [];
            for (let j: number = 0, lnt: number = tuples.length; j < lnt; j++) {
                const node: Element = tuples[j as number];
                const members: HTMLElement[] = [].slice.call(node.querySelectorAll('Member'));
                let level: string = '';
                let cLevel: string = '';
                let i: number = 0;
                while (i < members.length) {
                    level = level + (level !== '' ? '~~' : '') + members[i as number].querySelector('UName').textContent;
                    if (i === measureIndex && measureIndex === 0) {
                        cLevel = level;
                    } else if (i === (measureIndex - 1)) {
                        cLevel = level;
                    }
                    i++;
                }
                if (levelCollection[cLevel as string]) {
                    levelCollection[cLevel as string][levelCollection[cLevel as string].length] = level;
                } else {
                    levelCollection[cLevel as string] = [level as string];
                    uniqueLevels[uniqueLevels.length] = cLevel;
                }
                levels[level as string] = { index: j, node: node };
                cLevels[cLevels.length] = level;
            }
            if (cLevels.length > 0) {
                if (uniqueLevels.length > 0) {
                    if (measureIndex === 0) {
                        for (const name of values) {
                            for (const key of uniqueLevels) {
                                if (key === name) {
                                    for (const level of levelCollection[key as string]) {
                                        orderedIndex[orderedIndex.length] = levels[level as string].index;
                                        orderedTuples[orderedTuples.length] = levels[level as string].node;
                                    }
                                }
                            }
                        }
                    } else {
                        for (const key of uniqueLevels) {
                            for (const name of values) {
                                for (const level of levelCollection[key as string]) {
                                    const levelInfo: string[] = level.split('~~');
                                    if (levelInfo[measureIndex as number] === name) {
                                        orderedIndex[orderedIndex.length] = levels[level as string].index;
                                        orderedTuples[orderedTuples.length] = levels[level as string].node;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const clonedValTuple: Element[] = [];
            if (vTuples.length > 0) {
                const valueIndex: IPivotValues = [];
                const vOrdinalIndex: number[] = [];
                let vOrdinalIndexPos: number = 0;
                let len: number = 0;
                let cRow: number = 0;
                for (let j: number = 0, cnt: number = valuesCount; j < cnt; j++) {
                    if (len > (cLen - 1)) {
                        cRow++;
                        len = 0;
                        if (!valueIndex[cRow as number]) {
                            valueIndex[cRow as number] = [];
                        }
                        valueIndex[cRow as number][len as number] = j;
                        len++;
                    } else {
                        if (!valueIndex[cRow as number]) {
                            valueIndex[cRow as number] = [];
                        }
                        valueIndex[cRow as number][len as number] = j;
                        len++;
                    }
                    let vTupleOrdinal: number;
                    if (vTuples[vOrdinalIndexPos as number]) {
                        vTupleOrdinal = this.olapVirtualization ?
                            j : Number(vTuples[vOrdinalIndexPos as number].getAttribute('CellOrdinal'));
                    } else {
                        vOrdinalIndexPos++;
                    }
                    if (vTupleOrdinal === j) {
                        vOrdinalIndex[j as number] = vTupleOrdinal;
                        clonedValTuple[vTupleOrdinal as number] = vTuples[vOrdinalIndexPos as number];
                        vOrdinalIndexPos++;
                    }
                }
                vTuples = clonedValTuple;
                if (measureAxis === 'column') {
                    if (valueIndex.length > 0 && valueIndex[0].length === orderedIndex.length) {
                        for (let i: number = 0, cnt: number = orderedIndex.length; i < cnt; i++) {
                            let j: number = 0;
                            while (j < valueIndex.length) {
                                const index: number = (j * cLen) + i;
                                if (!isNullOrUndefined(valueIndex[j as number]) && !isNullOrUndefined(orderedIndex[i as number])) {
                                    const ordinalValue: string = vOrdinalIndex[index as number] ?
                                        vOrdinalIndex[index as number].toString() : index.toString();
                                    const tuple: Element = vTuples[Number(valueIndex[j as number][orderedIndex[i as number]])];
                                    if (tuple) {
                                        tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                        orderedVTuples[index as number] = tuple;
                                    }
                                }
                                j++;
                            }
                        }
                    }
                } else {
                    if (valueIndex.length === orderedIndex.length) {
                        for (let i: number = 0, cnt: number = orderedIndex.length; i < cnt; i++) {
                            let j: number = 0;
                            while (j < valueIndex[orderedIndex[i as number]].length) {
                                const index: number = (i * cLen) + j;
                                const ordinalValue: string = vOrdinalIndex[index as number] ?
                                    vOrdinalIndex[index as number].toString() : index.toString();
                                const tuple: Element = vTuples[Number(valueIndex[orderedIndex[i as number]][j as number])];
                                if (tuple) {
                                    tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                    orderedVTuples[orderedVTuples.length] = tuple;
                                }
                                j++;
                            }
                        }
                    }
                }
            }
            return { orderedHeaderTuples: orderedTuples, orderedValueTuples: orderedVTuples };
        } else {
            return { orderedHeaderTuples: tuples, orderedValueTuples: vTuples };
        }
    }

    public getDrilledSets(uNameCollection: string, currentCell: IAxisSet, fieldPos: number, axis: string): { [key: string]: string } {
        const levels: string[] = [];
        const memberName: string = currentCell.actualText.toString();
        const tupCollection: ITupInfo[] = axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        const currTuple: ITupInfo = tupCollection[currentCell.ordinal];
        const measurePos: number = tupCollection[0].typeCollection.indexOf('3');
        const allStartPos: number = measurePos === 0 ? 1 : 0;
        let tupPos: number = 0;
        const isWithoutAllMember: boolean = tupCollection[0].typeCollection[fieldPos as number] === '1';
        while (tupPos < tupCollection.length) {
            if (isNullOrUndefined(tupCollection[tupPos as number].allStartPos) ||
                tupCollection[tupPos as number].allStartPos > allStartPos) {
                levels[levels.length] = tupCollection[tupPos as number].uNameCollection;
            }
            tupPos++;
        }
        const memberArray: string[] = uNameCollection.split('::[').map((item: string) => {
            return item[0] === '[' ? item : ('[' + item);
        });
        const joinArray: string[] = [];
        for (let memPos: number = 0; memPos <= fieldPos; memPos++) {
            if (memberArray[memPos as number]) {
                if ((isWithoutAllMember || this.isPaging) && memPos === fieldPos) {
                    const splitLevels: string[] = memberArray[memPos as number].split('~~');
                    const drillLevel: number = splitLevels.indexOf(memberName);
                    const cropLevels: string[] = [];
                    for (let lPos: number = 0; lPos <= drillLevel; lPos++) {
                        cropLevels.push(splitLevels[lPos as number]);
                    }
                    joinArray[joinArray.length] = cropLevels.length > 0 ? cropLevels.join('~~') : memberArray[memPos as number];
                } else {
                    joinArray[joinArray.length] = memberArray[memPos as number];
                }
            }
        }
        uNameCollection = joinArray.join('::');
        const childSets: string[] = [];
        const memberObj: { [key: string]: string } = {};
        for (const item of levels) {
            if (item.indexOf(uNameCollection) === 0) {
                childSets.push(item);
                if (this.isPaging) {
                    let drillField: string = item.split('::[')[fieldPos as number];
                    drillField = drillField[0] === '[' ? drillField : ('[' + drillField);
                    const drillFieldSep: string[] = drillField.split('~~');
                    for (let fPos: number = drillFieldSep.indexOf(memberName); fPos < drillFieldSep.length; fPos++) {
                        memberObj[drillFieldSep[fPos as number]] = drillFieldSep[fPos as number];
                    }
                }
            }
        }
        if (this.isPaging) {
            const fieldSep: string[] = currTuple.uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            });
            const cropArray: string[] = [];
            for (let fPos: number = 0; fPos < fieldSep.length; fPos++) {
                if (fPos !== fieldPos) {
                    cropArray[fPos as number] = fieldSep[fPos as number];
                }
            }
            const drillFieldSep: string[] = Object.keys(memberObj);
            for (let fPos: number = 0; fPos < drillFieldSep.length; fPos++) {
                cropArray[fieldPos as number] = drillFieldSep[fPos as number];
                childSets.push(cropArray.join('::'));
            }
        }
        const drillSets: { [key: string]: string } = {};
        for (const level of childSets) {
            const fields: string[] = level.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            });
            let set: string = '';
            for (let pos: number = 0; pos <= fieldPos; pos++) {
                const field: string = fields[pos as number];
                if (field) {
                    const members: string[] = field.split('~~');
                    set = set + (set !== '' ? '~~' : '') + members[members.length - 1];
                }
            }
            drillSets[set as string] = set;
        }
        return drillSets;
    }
    public updateDrilledInfo(dataSourceSettings: IDataOptions): void {
        this.dataSourceSettings = dataSourceSettings;
        this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
        // MDXQuery.getCellSets(this.dataSourceSettings as IDataOptions, this);
        this.generateGridData(dataSourceSettings);
    }
    public updateCalcFields(dataSourceSettings: IDataOptions, lastcalcInfo: ICalculatedFieldSettings): void {
        this.dataSourceSettings = dataSourceSettings;
        this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
        this.getAxisFields();
        this.updateFieldlist();
        this.loadCalculatedMemberElements(this.calculatedFieldSettings);
        if (this.dataFields[lastcalcInfo.name]) {
            this.generateGridData(dataSourceSettings);
        } else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        }
    }
    public onSort(dataSourceSettings: IDataOptions, isValueSort?: boolean): void {
        this.dataSourceSettings = dataSourceSettings;
        if (!isValueSort) {
            this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
            this.getAxisFields();
            this.frameSortObject();
            this.updateFieldlist();
        }
        if (this.xmlaCellSet.length > 0 && this.xmlDoc) {
            this.generateEngine(this.xmlDoc, this.request, this.customArgs);
        } else {
            this.generateGridData(dataSourceSettings);
        }
    }
    private updateFieldlist(isInit?: boolean): void {
        let i: number = 0;
        while (i < this.savedFieldListData.length) {
            const fieldName: string = this.savedFieldListData[i as number].id;
            const parentID: string = this.savedFieldListData[i as number].pid;
            // let aggregateType: string = this.getAggregateType(fieldName);
            // this.savedFieldListData[i as number].aggregateType = aggregateType;
            if (this.savedFieldList[fieldName as string]) {
                const sortOrder: string = (this.enableSort ? this.sortObject[fieldName as string] ?
                    this.sortObject[fieldName as string] : 'Ascending' : 'None');
                this.savedFieldList[fieldName as string].isSelected = false;
                this.savedFieldList[fieldName as string].isExcelFilter = false;
                // this.savedFieldList[fieldName as string].aggregateType = aggregateType;
                this.savedFieldList[fieldName as string].sort = sortOrder;
                this.savedFieldList[fieldName as string].allowDragAndDrop = true;
                this.savedFieldList[fieldName as string].showFilterIcon = true;
                this.savedFieldList[fieldName as string].showSortIcon = true;
                this.savedFieldList[fieldName as string].showEditIcon = true;
                this.savedFieldList[fieldName as string].showRemoveIcon = true;
                this.savedFieldList[fieldName as string].showValueTypeIcon = true;
                this.savedFieldList[fieldName as string].showSubTotals = true;
                this.savedFieldListData[i as number].sort = sortOrder;
                this.savedFieldListData[i as number].allowDragAndDrop = true;
                this.savedFieldListData[i as number].showFilterIcon = true;
                this.savedFieldListData[i as number].showSortIcon = true;
                this.savedFieldListData[i as number].showEditIcon = true;
                this.savedFieldListData[i as number].showRemoveIcon = true;
                this.savedFieldListData[i as number].showValueTypeIcon = true;
                this.savedFieldListData[i as number].showSubTotals = true;
                if (isInit) {
                    this.savedFieldList[fieldName as string].filter = [];
                    this.savedFieldList[fieldName as string].actualFilter = [];
                }
            }
            if (this.dataFields[fieldName as string] && this.savedFieldList[fieldName as string] &&
                this.selectedItems.indexOf(fieldName) > -1) {
                this.savedFieldList[fieldName as string].isSelected = true;
                this.savedFieldList[fieldName as string].allowDragAndDrop = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].allowDragAndDrop : true);
                this.savedFieldList[fieldName as string].showFilterIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showFilterIcon : true);
                this.savedFieldList[fieldName as string].showSortIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showSortIcon : true);
                this.savedFieldList[fieldName as string].showEditIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showEditIcon : true);
                this.savedFieldList[fieldName as string].showRemoveIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showRemoveIcon : true);
                this.savedFieldList[fieldName as string].showValueTypeIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showValueTypeIcon : true);
                this.savedFieldList[fieldName as string].showSubTotals = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showSubTotals : true);
                this.savedFieldListData[i as number].isSelected = true;
                this.savedFieldListData[i as number].allowDragAndDrop = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].allowDragAndDrop : true);
                this.savedFieldListData[i as number].showFilterIcon = (this.dataFields[fieldName as string] ?
                    this.dataFields[fieldName as string].showFilterIcon : true);
                this.savedFieldListData[i as number].showSortIcon =
                    (this.dataFields[fieldName as string] ? this.dataFields[fieldName as string].showSortIcon : true);
                this.savedFieldListData[i as number].showEditIcon =
                    (this.dataFields[fieldName as string] ? this.dataFields[fieldName as string].showEditIcon : true);
                this.savedFieldListData[i as number].showRemoveIcon =
                    (this.dataFields[fieldName as string] ? this.dataFields[fieldName as string].showRemoveIcon : true);
                this.savedFieldListData[i as number].showValueTypeIcon =
                    (this.dataFields[fieldName as string] ? this.dataFields[fieldName as string].showValueTypeIcon : true);
                this.savedFieldListData[i as number].showSubTotals =
                    (this.dataFields[fieldName as string] ? this.dataFields[fieldName as string].showSubTotals : true);
            } else {
                if (this.dataFields[parentID as string] && this.savedFieldList[parentID as string] &&
                    this.selectedItems.indexOf(parentID) > -1) {
                    this.savedFieldListData[i as number].isSelected = true;
                } else {
                    this.savedFieldListData[i as number].isSelected = false;
                }
            }
            if ((this.savedFieldList[fieldName as string] && this.savedFieldList[fieldName as string].isCalculatedField) ||
                fieldName.toLowerCase() === '[calculated members].[_0]') {
                let isAvail: boolean = false;
                for (const field of this.calculatedFieldSettings) {
                    if (fieldName === field.name) {
                        const expression: string = field.formula;
                        const formatString: string = field.formatString;
                        this.savedFieldListData[i as number].formula = expression;
                        this.savedFieldListData[i as number].formatString = formatString;
                        this.savedFieldListData[i as number].parentHierarchy = (expression.toLowerCase().indexOf('measure') > -1 ?
                            undefined : field.hierarchyUniqueName);
                        this.savedFieldList[fieldName as string].formula = expression;
                        this.savedFieldList[fieldName as string].formatString = formatString;
                        this.savedFieldList[fieldName as string].parentHierarchy = this.savedFieldListData[i as number].parentHierarchy;
                        isAvail = true;
                    }
                }
                if ((!isAvail && fieldName.toLowerCase() !== '[calculated members].[_0]') ||
                    (fieldName.toLowerCase() === '[calculated members].[_0]' && this.calculatedFieldSettings.length === 0)) {
                    this.savedFieldListData.splice(i, 1);
                    i--;
                    if (this.savedFieldList[fieldName as string]) {
                        delete this.savedFieldList[fieldName as string];
                    }
                }
            }
            i++;
        }
        this.fieldList = this.savedFieldList;
        this.fieldListData = this.savedFieldListData;
    }
    public updateFieldlistData(name: string, isSelect?: boolean): void {
        for (const item of this.fieldListData) {
            if (item.id === name) {
                item.isSelected = isSelect ? true : false;
                break;
            }
        }
    }
    /**
     * It used to set format a field.
     *
     * @param {IFormatSettings[]} formats - It cotains the formatSettings.
     * @returns {void}
     * @hidden
     */
    public getFormattedFields(formats: IFormatSettings[]): void {
        this.formatFields = {};
        let cnt: number = formats.length;
        while (cnt--) {
            this.formatFields[formats[cnt as number].name] = formats[cnt as number];
        }
    }
    private getCubes(dataSourceSettings: IDataOptions): void {
        const connectionString: ConnectionInfo = this.getConnectionInfo(
            dataSourceSettings.url, dataSourceSettings.localeIdentifier.toString()
        );
        const soapMessage: string = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body>' +
                    '<Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>MDSCHEMA_CUBES</RequestType>' +
                        '<Restrictions><RestrictionList><CATALOG_NAME>' + dataSourceSettings.catalog +
            '</CATALOG_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>' + dataSourceSettings.catalog +
            '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier>' + (dataSourceSettings.roles ? '<Roles>' + dataSourceSettings.roles + '</Roles>' : '') + '</PropertyList></Properties>' +
                    '</Discover></Body></Envelope>';
        this.doAjaxPost('POST', connectionString.url, soapMessage, this.validateCube.bind(this), { dataSourceSettings: dataSourceSettings, action: 'getCubes' });
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }
    private validateCube(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        let isCubeExist: boolean = false;
        for (const field of fields) {
            const cubeName: string = field.querySelector('CUBE_NAME').textContent;
            if (cubeName === customArgs.dataSourceSettings.cube) {
                isCubeExist = true;
                break;
            }
        }
        if (!isCubeExist && fields.length > 0) {
            this.errorInfo = 'Invalid cube name ' + this.dataSourceSettings.cube;
        }
    }
    private getFieldList(dataSourceSettings: IDataOptions): void {
        const args: ConnectionInfo = {
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            url: dataSourceSettings.url,
            LCID: dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_HIERARCHIES',
            roles: dataSourceSettings.roles
        };
        this.getTreeData(args, this.getFieldListItems.bind(this), { dataSourceSettings: dataSourceSettings, action: 'loadFieldElements' });
    }
    public getTreeData(args: ConnectionInfo, successMethod: Function, customArgs: object): void {
        const connectionString: ConnectionInfo = this.getConnectionInfo(args.url, args.LCID);
        const soapMessage: string = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis"><RequestType>' +
            args.request + '</RequestType><Restrictions><RestrictionList><CATALOG_NAME>' + args.catalog +
            '</CATALOG_NAME><CUBE_NAME>' + args.cube + '</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>' + args.catalog +
            '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier>' + (args.roles ? '<Roles>' + args.roles + '</Roles>' : '') + '</PropertyList></Properties></Discover></Body></Envelope>';
        this.doAjaxPost('POST', connectionString.url, soapMessage, successMethod, customArgs);
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }
    private getAxisFields(): void {
        this.rows = this.dataSourceSettings.rows ? this.dataSourceSettings.rows : [];
        this.columns = this.dataSourceSettings.columns ? this.dataSourceSettings.columns : [];
        this.filters = this.dataSourceSettings.filters ? this.dataSourceSettings.filters : [];
        this.values = this.dataSourceSettings.values ? this.dataSourceSettings.values : [];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        let len: number = dataFields.length;
        while (len--) {
            this.dataFields[dataFields[len as number].name] = dataFields[len as number];
            if (dataFields[len as number].name.toLowerCase() === '[measures]') {
                this.isMeasureAvail = true;
            } else {
                this.selectedItems.push(dataFields[len as number].name);
            }
        }
        this.mappingFields = {};
        if (this.dataSourceSettings.fieldMapping) {
            for (const field of this.dataSourceSettings.fieldMapping) {
                this.mappingFields[field.name] = field;
            }
        }
        if (!this.isMeasureAvail && this.values.length > 0) {
            const measureField: IFieldOptions = {
                name: '[Measures]', caption: 'Measures', showRemoveIcon: true, allowDragAndDrop: true
            };
            if (this.valueAxis === 'row') {
                this.rows.push(measureField);
            } else {
                this.columns.push(measureField);
            }
            this.isMeasureAvail = true;
        }
    }
    private getAggregateType(fieldName: string, aggregateType: string): string {
        let type: SummaryTypes;
        switch (aggregateType) {
        case '1':
            type = 'Sum';
            break;
        case '2':
            type = 'Count';
            break;
        case '3':
            type = 'Min';
            break;
        case '4':
            type = 'Max';
            break;
        case '5':
            type = 'Avg';
            break;
        case '8':
            type = 'DistinctCount';
            break;
        case '127':
            type = 'CalculatedField';
            break;
        default:
            type = undefined;
            break;
        }
        // if (this.dataFields[fieldName as string]) {
        //     return this.dataFields[fieldName as string].type;
        // } else {
        //     return undefined;
        // }
        if (type) {
            return type;
        } else {
            return undefined;
        }
    }
    public getUniqueName(name: string): string {
        let uName: string = name;
        for (const item of this.calculatedFieldSettings) {
            const expression: string = item.formula;
            const prefixName: string = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' : item.hierarchyUniqueName + '.');
            const uniqueName: string = prefixName + '[' + item.name + ']';
            if (name === uniqueName) {
                uName = item.name;
                break;
            }
        }
        return uName;
    }
    private updateFilterItems(filterItems: IFilter[]): void {
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        for (const filter of filterItems) {
            if (filter.type === 'Include' && this.allowMemberFilter && this.fieldList[filter.name]) {
                const members: IMembers = this.fieldList[filter.name].members;
                const isMembersAvail: boolean = (members && Object.keys(members).length > 0);
                this.fieldList[filter.name].actualFilter = [...filter.items];
                const selectedElements: string[] = extend([], filter.items, null, true) as string[];
                if (isMembersAvail) {
                    let i: number = 0;
                    while (i < selectedElements.length) {
                        let parentNodes: string[] = [];
                        parentNodes = this.getParentNode(selectedElements[i as number], members, parentNodes);
                        for (const node of parentNodes) {
                            const index: number = PivotUtil.inArray(node, filter.items);
                            if (index !== -1) {
                                filter.items.splice(index, 1);
                            }
                        }
                        i++;
                    }
                }
                const currentItems: string[] = [];
                for (const selectedElement of filter.items) {
                    // currentItems.push(selectedElement.replace(/\&/g, '&amp;'));
                    let filterCaption: string;
                    if (!isMembersAvail && filter.items.length === 1) {
                        this.getMembers(this.dataSourceSettings, filter.name, undefined, undefined, undefined, filter.items[0]);
                        filterCaption = this.fieldList[filter.name].actualFilter[0];
                    }
                    currentItems.push(selectedElement);
                    if (isMembersAvail) {
                        this.fieldList[filter.name].filter.push(members[selectedElement as string].caption);
                    } else {
                        this.fieldList[filter.name].filter.push(filterCaption ? filterCaption : selectedElement);
                    }
                }
                this.filterMembers[filter.name] = currentItems;
                this.fieldList[filter.name].isExcelFilter = false;
            } else if ((this.allowValueFilter || this.allowLabelFilter) &&
                ['Date', 'Label', 'Number', 'Value'].indexOf(filter.type) !== -1) {
                for (const item of dataFields) {
                    if (item.name === filter.name) {
                        const filterMembers: IFilter[] = this.filterMembers[filter.name] as IFilter[];
                        if (filterMembers && (typeof filterMembers[0] === 'object' && filterMembers[0].type === filter.type)) {
                            filterMembers[filterMembers.length] = filter;
                        } else {
                            this.filterMembers[filter.name] = [filter];
                        }
                        this.fieldList[filter.name].isExcelFilter = true;
                        break;
                    }
                }
            }
        }
    }
    private getParentNode(name: string, members: IMembers, items: string[]): string[] {
        if (members[name as string].parent && name !== members[name as string].parent) {
            const parentItem: string = members[name as string].parent;
            items.push(parentItem);
            this.getParentNode(parentItem, members, items);
        }
        return items;
    }
    public updateDrilledItems(drilledMembers: IDrillOptions[]): IDrillOptions[] {
        const drilledItems: IDrillOptions[] = [];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        for (const item of drilledMembers) {
            for (const field of dataFields) {
                if (item.name === field.name) {
                    drilledItems.push(item);
                    break;
                }
            }
        }
        return drilledItems;
    }
    // private updateAllMembers(dataSourceSettings: IDataOptions, slicers: IFieldOptions[]): void {
    //     let query: string = '';
    //     for (let field of slicers) {
    //         let fieldList: IOlapField = this.fieldList[field.name];
    //         if (!(fieldList && fieldList.hasAllMember && fieldList.allMember)) {
    //             query = query + (query !== '' ? ' * ' : '') + '{' + field.name + '}';
    //         } else {
    //             continue;
    //         }
    //     }
    //     if (query !== '') {
    //         this.getAllMember(dataSourceSettings, query);
    //     } else {
    //         return;
    //     }
    // }
    // private getAllMember(dataSourceSettings: IDataOptions, query: string): void {
    //     let dimProp: string = 'DIMENSION PROPERTIES HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY';
    //     let mdxQuery: string = 'SELECT (' + query + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
    //     let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
    //     let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
    //     this.doAjaxPost('POST', connectionString.url, xmla, this.generateAllMembers.bind(this),
    // { dataSourceSettings: dataSourceSettings, action: 'fetchAllMembers' });
    // }

    /**
     * It performs to returns the drill through data.
     *
     * @param {IAxisSet} pivotValue - It cotains the pivotValues data.
     * @param {number} maxRows - It cotains the maximum number of row data.
     * @returns {void}
     * @hidden
     */
    public getDrillThroughData(pivotValue: IAxisSet, maxRows: number): void {
        const column: string[] = this.tupColumnInfo[pivotValue.colOrdinal] &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection !== '' ?
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        const row: string[] = this.tupRowInfo[pivotValue.rowOrdinal] &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection !== '' ?
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        let filters: IFilter[] | string[];
        const filteritems: string[] = [];
        let filterQuery: string = '';
        for (let i: number = 0; i < this.filters.length; i++) {
            filters = this.filterMembers[this.filters[i as number].name];
            if (filters) {
                for (let j: number = 0; j < filters.length; j++) {
                    filterQuery = filterQuery + filters[j as number];
                    filterQuery = j < filters.length - 1 ? filterQuery + ',' : filterQuery + '';
                }
                filteritems[i as number] = filterQuery;
                filterQuery = '';
            }
        }
        for (let i: number = 0; i < filteritems.length; i++) {
            filterQuery = filterQuery === '' ? '{' + filteritems[i as number] + '}' : (filterQuery + ',' + '{' + filteritems[i as number] + '}');
        }
        let columnQuery: string = ''; let rowQuery: string = '';
        for (let i: number = 0; i < column.length; i++) {
            columnQuery = (columnQuery.length > 0 ? (columnQuery + ',') : '') + (column[i as number].split('~~').length > 1 ?
                column[i as number].split('~~')[column[i as number].split('~~').length - 1] : column[i as number]);
        }
        for (let i: number = 0; i < row.length; i++) {
            rowQuery = (rowQuery.length > 0 ? (rowQuery + ',') : '') + (row[i as number].split('~~').length > 1 ?
                row[i as number].split('~~')[row[i as number].split('~~').length - 1] : row[i as number]);
        }
        let drillQuery: string = 'DRILLTHROUGH MAXROWS ' + maxRows + ' Select(' + (columnQuery.length > 0 ? columnQuery : '') +
            (columnQuery.length > 0 && rowQuery.length > 0 ? ',' : '') + (rowQuery.length > 0 ? rowQuery : '') + ') on 0 from ' +
            (filterQuery === '' ? '[' + this.dataSourceSettings.cube + ']' : '(SELECT (' + filterQuery + ') ON COLUMNS FROM [' +
                this.dataSourceSettings.cube + '])');
        drillQuery = drillQuery.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        const xmla: string = this.getSoapMsg(this.dataSourceSettings, drillQuery);
        const connectionString: ConnectionInfo =
            this.getConnectionInfo(this.dataSourceSettings.url, this.dataSourceSettings.localeIdentifier);
        this.doAjaxPost(
            'POST', connectionString.url, xmla, this.drillThroughSuccess.bind(this),
            { dataSourceSettings: this.dataSourceSettings, action: 'drillThrough' });
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }

    private drillThroughSuccess(xmlDoc: Document): void {
        const tag: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        let gridJSON: string = '';
        if (tag.length > 0) {
            const json: string[] = [];
            let i: number = 0;
            while (i < tag.length) {
                const child: HTMLElement[] = [].slice.call(tag[i as number].children);
                let j: number = 0;
                while (j < child.length) {
                    json.push('"' + child[j as number].tagName + '"' + ':' + '"' + child[j as number].textContent + '"');
                    j++;
                }
                i++;
            }
            const value: string = json[0];
            let k: number = 0;
            while (k < json.length) {
                if (Object.keys(JSON.parse('[{' + json[k as number] + '}]')[0])[0] === Object.keys(JSON.parse('[{' + value + '}]')[0])[0]) {
                    gridJSON += gridJSON === '' ? '[{' + json[k as number] : '}, {' + json[k as number];
                    k++;
                    continue;
                }
                gridJSON += ',' + json[k as number];
                k++;
            }
            gridJSON += '}]';
        } else {
            const tag: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('faultstring'));
            let i: number = 0;
            while (i < tag.length) {
                gridJSON += tag[i as number].textContent;
                i++;
            }
        }
        this.gridJSON = gridJSON;
    }

    public getFilterMembers(dataSourceSettings: IDataOptions, fieldName: string, levelCount: number,
                            isSearchFilter?: boolean, loadLevelMember?: boolean): string {
        // let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE';
        const levels: IOlapField[] = this.fieldList[fieldName as string].levels;
        const cLevel: number = this.fieldList[fieldName as string].levelCount;
        let filterQuery: string;
        if (loadLevelMember) {
            filterQuery = 'Descendants({' + levels[cLevel as number].id + '}, ' +
                levels[levelCount - 1].id + ', ' + ((levelCount - cLevel) === 1 ? 'SELF)' : 'SELF_AND_BEFORE)');
        } else {
            filterQuery = fieldName + ', Descendants({' + levels[0].id + '}, ' + levels[levelCount - 1].id + ', SELF_AND_BEFORE)';
        }
        this.fieldList[fieldName as string].levelCount = levelCount;
        if (!isSearchFilter) {
            this.getMembers(dataSourceSettings, fieldName, false, filterQuery, loadLevelMember);
        }
        return filterQuery;
    }
    public getMembers(dataSourceSettings: IDataOptions, fieldName: string, isAllFilterData?: boolean,
                      filterParentQuery?: string, loadLevelMember?: boolean, filterItemName?: string): void {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        const dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        let mdxQuery: string;
        const hasAllMember: boolean = this.fieldList[fieldName as string].hasAllMember;
        const hierarchy: string = (hasAllMember ? fieldName : fieldName + '.LEVELS(0)').replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        if (!isAllFilterData && !filterItemName) {
            mdxQuery = 'SELECT ({' + (filterParentQuery ?
                filterParentQuery : (hasAllMember ? hierarchy + ', ' + hierarchy + '.CHILDREN' : hierarchy + '.ALLMEMBERS')) + '})' +
                dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        } else if (filterItemName) {
            filterItemName = filterItemName.replace(/&/g, '&amp;');
            mdxQuery = 'SELECT {' + filterItemName + '} ON 0 FROM [' + dataSourceSettings.cube + '] WHERE {}';
        } else {
            mdxQuery = 'SELECT ({' + hierarchy + '.ALLMEMBERS})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        }
        const xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        const connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        if (!loadLevelMember) {
            this.fieldList[fieldName as string].filterMembers = [];
            this.fieldList[fieldName as string].childMembers = [];
            this.fieldList[fieldName as string].searchMembers = [];
            // this.fieldList[fieldName as string].isHierarchy = true;
            this.fieldList[fieldName as string].members = {};
            this.fieldList[fieldName as string].currrentMembers = {};
        }
        this.doAjaxPost('POST', connectionString.url, xmla, filterItemName ? this.getOlapFilterText.bind(this) : this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, loadLevelMembers: loadLevelMember, action: 'fetchMembers' });
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }
    private getOlapFilterText(xmlDoc: Document, request: Ajax, customArgs: FieldData): void{
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Tuple'));
        if (fields.length > 0 && this.fieldList[customArgs.fieldName] && fields[fields.length - 1].getElementsByTagName('Caption')
            && fields[fields.length - 1].getElementsByTagName('Caption')[0]) {
            this.fieldList[customArgs.fieldName].actualFilter[0] = fields[fields.length - 1].getElementsByTagName('Caption')[0].textContent;
        }
    }
    public getChildMembers(dataSourceSettings: IDataOptions, memberUQName: string, fieldName: string): void {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        const dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        // var mdxQuery = 'SELECT SUBSET({' + memberUQName + '.CHILDREN}, 0, 5000)' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        const mdxQuery: string = 'SELECT ({' + memberUQName.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '.CHILDREN})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        const xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        const connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, action: 'fetchChildMembers' });
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }
    public getCalcChildMembers(dataSourceSettings: IDataOptions, memberUQName: string): void {
        this.calcChildMembers = [];
        const dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        const mdxQuery: string = 'SELECT ({' + memberUQName.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;') + '.MEMBERS})' +
            dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        const connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        const xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, action: 'fetchCalcChildMembers' });
        if (this.errorInfo) {
            throw this.errorInfo;
        }
    }
    public getSearchMembers(dataSourceSettings: IDataOptions, fieldName: string, searchString: string, maxNodeLimit: number,
                            isAllFilterData?: boolean, levelCount?: number): void {
        this.fieldList[fieldName as string].searchMembers = [];
        this.fieldList[fieldName as string].currrentMembers = {};
        if (searchString !== '') {
            // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
            const dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
            const hierarchy: string = fieldName.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
            const mdxQuery: string = 'WITH SET [SearchMembersSet] AS &#39;FILTER(' + (isAllFilterData ? hierarchy + '.ALLMEMBERS, ' :
                '{' + (levelCount > 1 ? this.getFilterMembers(dataSourceSettings, fieldName, levelCount, true) :
                    hierarchy + ', ' + hierarchy + '.CHILDREN') + '},') +
                '(INSTR(1, ' + hierarchy + '.CurrentMember.member_caption, "' + searchString + '") > 0))&#39;' +
                'SET [SearchParentsSet] AS &#39;GENERATE([SearchMembersSet], ASCENDANTS([SearchMembersSet].Current))&#39;' +
                'SET [SearchSet] AS &#39;HIERARCHIZE(DISTINCT({[SearchMembersSet], [SearchParentsSet]}))&#39;' +
                'SELECT SUBSET([SearchSet], 0, ' + maxNodeLimit + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
            const xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
            const connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
            this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), {
                dataSourceSettings: dataSourceSettings,
                fieldName: fieldName, action: 'fetchSearchMembers'
            });
            if (this.errorInfo) {
                throw this.errorInfo;
            }
        } else {
            return;
        }
    }
    private generateMembers(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Tuple'));
        const fieldName: string = customArgs.fieldName;
        let allMember: string;
        let filterMembers: IOlapField = {};
        for (const field of fields) {
            // let hierarchyUqName: string = fields[0].querySelector('Member HIERARCHY_UNIQUE_NAME').textContent;
            const member: HTMLElement = field.querySelector('Member');
            const memberType: string = member.querySelector('MEMBER_TYPE').textContent;
            const memberUqName: string = member.querySelector('UName').textContent;
            const caption: string = member.querySelector('Caption').textContent;
            const parentUqName: string = member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            const nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName, 'data-memberId': memberUqName };
            if (parentUqName === '' && memberType === '1') {
                filterMembers = {
                    hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                    isSelected: false,
                    id: memberUqName,
                    tag: memberUqName,
                    name: caption,
                    caption: caption,
                    htmlAttributes: nodeAttr
                };
                if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                    this.fieldList[fieldName as string].members[memberUqName as string] =
                        { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName as string].filterMembers.push(filterMembers);
                    this.fieldList[fieldName as string].childMembers.push(filterMembers);
                } else if (customArgs.action === 'fetchSearchMembers') {
                    this.fieldList[fieldName as string].currrentMembers[memberUqName as string] =
                        { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName as string].searchMembers.push(filterMembers);
                    filterMembers.expanded = true;
                } else {
                    this.calcChildMembers.push(filterMembers);
                }
            } else if (parentUqName !== '' && memberType === '1') {
                if (parentUqName === allMember && memberType === '1') {
                    filterMembers = {
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        id: memberUqName,
                        name: caption,
                        isSelected: false,
                        caption: caption,
                        htmlAttributes: nodeAttr,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName as string].filterMembers.push(filterMembers);
                        this.fieldList[fieldName as string].childMembers.push(filterMembers);
                        this.fieldList[fieldName as string].members[memberUqName as string] =
                            { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    } else if (customArgs.action === 'fetchSearchMembers') {
                        filterMembers.expanded = true;
                        this.fieldList[fieldName as string].searchMembers.push(filterMembers);
                        this.fieldList[fieldName as string].currrentMembers[memberUqName as string] =
                            { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    } else {
                        this.calcChildMembers.push(filterMembers);
                    }
                } else {
                    if (customArgs.action === 'fetchMembers' && this.fieldList[fieldName as string].members[memberUqName as string]) {
                        continue;
                    }
                    const nodeSelect: boolean = (customArgs.loadLevelMembers ?
                        this.fieldList[fieldName as string].members[parentUqName as string].isSelected : false);
                    filterMembers = {
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ?
                            (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        htmlAttributes: nodeAttr,
                        isSelected: false,
                        id: memberUqName,
                        pid: parentUqName,
                        name: caption,
                        caption: caption,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName as string].isHierarchy = false;
                        this.fieldList[fieldName as string].filterMembers.push(filterMembers);
                        this.fieldList[fieldName as string].childMembers.push(filterMembers);
                        this.fieldList[fieldName as string].members[memberUqName as string] =
                            { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: nodeSelect };
                    } else if (customArgs.action === 'fetchSearchMembers') {
                        this.fieldList[fieldName as string].searchMembers.push(filterMembers);
                        filterMembers.expanded = true;
                        this.fieldList[fieldName as string].currrentMembers[memberUqName as string] =
                            { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: false };
                    } else {
                        this.calcChildMembers.push(filterMembers);
                    }
                }
            } else if (memberType === '2') {
                allMember = memberUqName;
            }
        }
    }
    // private generateAllMembers(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let members: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Member'));
    //     for (let member of members) {
    //         let caption: string = member.querySelector('Caption').textContent;
    //         let fieldName: string = member.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
    //         this.fieldList[fieldName as string].allMember = caption;
    //     }
    // }
    private getFieldListItems(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let fieldDate: FieldData = {};
        const hierarchyElements: IOlapField[] = [];
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (const field of fields) {
            const isAllMemberAvail: boolean = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            const dimensionName: string = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            const hierarchyName: string = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
            const isSameDim: boolean = dimensionName === hierarchyName && dimensionName.toLowerCase() !== '[measures]' && hierarchyName.toLowerCase() !== '[measures]';
            hierarchyElements.push({
                pid: ((this.isMondrian || isSameDim) ? dimensionName + '~#^Dim' : dimensionName),
                id: hierarchyName,
                name: field.querySelector('HIERARCHY_CAPTION').textContent,
                caption: field.querySelector('HIERARCHY_CAPTION').textContent,
                tag: hierarchyName,
                hasAllMember: isAllMemberAvail,
                allMember: (isAllMemberAvail ? field.querySelectorAll('ALL_MEMBER')[0].textContent : undefined),
                // aggregateType: this.getAggregateType(field.querySelector('HIERARCHY_UNIQUE_NAME').textContent),
                type: 'string'
            });
        }
        fieldDate = {
            hierarchy: hierarchyElements,
            hierarchySuccess: xmlDoc,
            measures: []
        };
        this.fieldListObj = fieldDate;
        const args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_DIMENSIONS',
            roles: customArgs.dataSourceSettings.roles
        };
        this.getTreeData(args, this.loadDimensionElements.bind(this), customArgs);
    }
    private loadCalculatedMemberElements(calcMembers: ICalculatedFieldSettings[]): void {
        if (calcMembers.length > 0) {
            const fieldListElements: IOlapField[] = this.fieldListData;
            // let calcElements: IOlapField[] = [];
            const calcObj: IOlapField = {
                hasChildren: true,
                isSelected: false,
                id: '[Calculated Members].[_0]',
                name: '[Calculated Members].[_0]',
                caption: 'Calculated Members',
                spriteCssClass: 'e-calcMemberGroupCDB' + ' ' + cls.ICON,
                tag: '[Calculated Members].[_0]',
                //aggregateType: this.getAggregateType(dimensionName),
                type: 'string'
            };
            if (fieldListElements.length > 0 && fieldListElements[0].id.toLowerCase() === '[measures]') {
                fieldListElements.splice(0, 0, calcObj);
            }
            for (const field of calcMembers) {
                if (!this.fieldList[field.name]) {
                    const expression: string = field.formula;
                    const prefixName: string = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' :
                        field.hierarchyUniqueName + '.');
                    const uniqueName: string = prefixName + '[' + field.name + ']';
                    const caption: string = (this.dataFields[field.name] && this.dataFields[field.name].caption ?
                        this.dataFields[field.name].caption :
                        this.mappingFields[field.name] && this.mappingFields[field.name].caption ?
                            this.mappingFields[field.name].caption : field.name);
                    const formatString: string = field.formatString;
                    const calcField: IOlapField = {
                        hasChildren: false,
                        isSelected: false,
                        id: field.name,
                        pid: '[Calculated Members].[_0]',
                        name: field.name,
                        caption: caption,
                        spriteCssClass: 'e-calc-member' + ' ' + (expression.toLowerCase().indexOf('measure') > -1 ?
                            'e-calc-measure-icon' : 'e-calc-dimension-icon') + ' ' + cls.ICON,
                        tag: uniqueName,
                        formula: expression,
                        formatString: formatString,
                        aggregateType: undefined,
                        type: 'CalculatedField',
                        filter: [],
                        dateMember: [],
                        sort: 'Ascending',
                        actualFilter: [],
                        filterMembers: [],
                        childMembers: [],
                        searchMembers: [],
                        members: {},
                        currrentMembers: {},
                        isHierarchy: true,
                        isExcelFilter: false,
                        isCalculatedField: true,
                        allowDragAndDrop: (this.dataFields[field.name] ? this.dataFields[field.name].allowDragAndDrop :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].allowDragAndDrop : true),
                        showFilterIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showFilterIcon :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showFilterIcon : true),
                        showSortIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showSortIcon :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showSortIcon : true),
                        showEditIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showEditIcon :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showEditIcon : true),
                        showRemoveIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showRemoveIcon :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showRemoveIcon : true),
                        showValueTypeIcon: (this.dataFields[field.name] ? this.dataFields[field.name].showValueTypeIcon :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showValueTypeIcon : true),
                        showSubTotals: (this.dataFields[field.name] ? this.dataFields[field.name].showSubTotals :
                            this.mappingFields[field.name] ? this.mappingFields[field.name].showSubTotals : true),
                        fieldType: (expression.toLowerCase().indexOf('measure') > -1 ? 'Measure' : 'Dimension'),
                        parentHierarchy: (expression.toLowerCase().indexOf('measure') > -1 ? undefined : field.hierarchyUniqueName)
                    };
                    fieldListElements.push(calcField);
                    this.fieldList[calcField.id] = calcField;
                    this.updateMembersOrder(field.name);
                }
            }
        } else {
            return;
        }
    }
    private loadDimensionElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        const hierarchyElements: IOlapField[] = [];
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        let measure: IOlapField = {};
        for (const field of fields) {
            const dimensionName: string = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            const defaultHierarchy: string = field.querySelector('DEFAULT_HIERARCHY').textContent;
            const dimensionCaption: string = field.querySelector('DIMENSION_CAPTION').textContent;
            const isSameDim: boolean = dimensionName === defaultHierarchy;
            if (dimensionName.toLowerCase().indexOf('[measure') >= 0) {
                measure = {
                    hasChildren: true,
                    isSelected: false,
                    id: dimensionName,
                    name: dimensionName,
                    caption: dimensionCaption,
                    spriteCssClass: dimensionName.toLowerCase() === '[measures]' ? 'e-measureGroupCDB-icon' + ' ' + cls.ICON : 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                };
            } else if (isNullOrUndefined(fields[0].querySelector('HIERARCHY_CAPTION'))) {
                hierarchyElements.push({
                    hasChildren: true,
                    isSelected: false,
                    id: ((this.isMondrian || isSameDim) ? dimensionName + '~#^Dim' : dimensionName),
                    name: dimensionName,
                    caption: dimensionCaption,
                    spriteCssClass: 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    defaultHierarchy: field.querySelector('DEFAULT_HIERARCHY').textContent,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                });
            }
        }
        hierarchyElements.splice(0, 0, measure);
        this.fieldListData = hierarchyElements;
        // customArgs.hierarchy = this.fieldListData;
        // customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        // this.loadHierarchyElements(customArgs);
        const args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_SETS',
            roles: customArgs.dataSourceSettings.roles
        };
        this.getTreeData(args, this.loadNamedSetElements.bind(this), customArgs);
    }
    private loadNamedSetElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.filters);
        const dimensionElements: IOlapField[] = this.fieldListData;
        const reportElement: string[] = [];
        for (const field of dataFields) {
            reportElement.push(field.name);
        }
        const measureGroupItems: string[] = [];
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (const field of fields) {
            if (!(measureGroupItems.indexOf(field.querySelector('DIMENSIONS').textContent.split('.')[0]) >= 0)) {
                dimensionElements.push({
                    hasChildren: true,
                    isSelected: false,
                    pid: field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    id: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    name: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON + ' ' + 'namedSets',
                    caption: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    // aggregateType: this.getAggregateType(field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0]),
                    type: 'string'
                });
                measureGroupItems.push(field.querySelector('DIMENSIONS').textContent.split('.')[0]);
            }
            const id: string = '[' + field.querySelector('SET_NAME').textContent.trim() + ']';
            const fieldObj: IOlapField = {
                hasChildren: true,
                isNamedSets: true,
                isSelected: (reportElement.indexOf('[' + field.querySelector('SET_NAME').textContent + ']') >= 0),
                pid: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                id: id,
                name: field.querySelector('SET_CAPTION').textContent,
                caption: this.dataFields[id as string] && this.dataFields[id as string].caption ? this.dataFields[id as string].caption : this.mappingFields[id as string] && this.mappingFields[id as string].caption ? this.mappingFields[id as string].caption : field.querySelector('SET_CAPTION').textContent,
                spriteCssClass: 'e-namedSetCDB-icon' + ' ' + cls.ICON,
                tag: field.querySelector('EXPRESSION').textContent,
                // aggregateType: this.getAggregateType(id),
                type: 'string',
                filter: [],
                dateMember: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                isHierarchy: true,
                isExcelFilter: false,
                allowDragAndDrop: (this.dataFields[id as string] ? this.dataFields[id as string].allowDragAndDrop :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].allowDragAndDrop : true),
                showFilterIcon: (this.dataFields[id as string] ? this.dataFields[id as string].showFilterIcon :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showFilterIcon : true),
                showSortIcon: (this.dataFields[id as string] ? this.dataFields[id as string].showSortIcon :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showSortIcon : true),
                showEditIcon: (this.dataFields[id as string] ? this.dataFields[id as string].showEditIcon :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showEditIcon : true),
                showRemoveIcon: (this.dataFields[id as string] ? this.dataFields[id as string].showRemoveIcon :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showRemoveIcon : true),
                showValueTypeIcon: (this.dataFields[id as string] ? this.dataFields[id as string].showValueTypeIcon :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showValueTypeIcon : true),
                showSubTotals: (this.dataFields[id as string] ? this.dataFields[id as string].showSubTotals :
                    this.mappingFields[id as string] ? this.mappingFields[id as string].showSubTotals : true)
            };
            dimensionElements.push(fieldObj);
            this.fieldList[id as string] = fieldObj;
            this.updateMembersOrder(id);
        }
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_SETS'
        // };
        // this.getTreeData(args, this.loadHierarchyElements.bind(this), customArgs);
        customArgs.hierarchy = this.fieldListData;
        customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        this.loadHierarchyElements(customArgs);
    }

    private loadHierarchyElements(customArgs: FieldData): void {
        const data: Document = customArgs.hierarchySuccess;
        const dimensionElements: IOlapField[] = customArgs.hierarchy;
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.filters);
        const reportElement: string[] = [];
        for (const field of dataFields) {
            reportElement.push(field.name);
        }
        const fields: HTMLElement[] = [].slice.call(data.querySelectorAll('row'));
        for (const field of fields) {
            const dimensionName: string = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            const hierarchyName: string = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
            const isAllMemberAvail: boolean = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            let allMember: string;
            if (isAllMemberAvail) {
                const stringCollection: string[] = field.querySelectorAll('ALL_MEMBER')[0].textContent.replace(/[\]']+/g, '').split('.');
                allMember = stringCollection[stringCollection.length - 1].trim();
            } else {
                allMember = undefined;
            }
            const hierarchyFolderName: string = ((field.querySelector('HIERARCHY_DISPLAY_FOLDER')) ? (field.querySelector('HIERARCHY_DISPLAY_FOLDER').textContent) : '');
            const curElement: IOlapField[] = [];
            for (const item of dimensionElements) {
                if (item.tag === dimensionName) {
                    curElement.push(item);
                }
            }
            if (curElement.length > 0) {
                const isSameDim: boolean = dimensionName === hierarchyName && dimensionName.toLowerCase() !== '[measures]' && hierarchyName.toLowerCase() !== '[measures]';
                if (dimensionName.toLowerCase() !== '[measures]' && hierarchyName.toLowerCase() !== '[measures]') {
                    let parentID: string = dimensionName + ((this.isMondrian || isSameDim) ? '~#^Dim' : '');
                    if (hierarchyFolderName !== '') {
                        const folderName: string = dimensionName + ((this.isMondrian || isSameDim) ? '~#^Dim' : '') + '_' + hierarchyFolderName;
                        const curParentElement: IOlapField[] = [];
                        for (const item of dimensionElements) {
                            if (item.tag === folderName && item.pid === parentID) {
                                curParentElement.push(item);
                            }
                        }
                        if (curParentElement.length === 0) {
                            const fieldObj: IOlapField = {
                                hasChildren: true,
                                isSelected: false,
                                pid: dimensionName + ((this.isMondrian || isSameDim) ? '~#^Dim' : ''),
                                id: folderName,
                                name: hierarchyFolderName,
                                spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON,
                                tag: folderName,
                                caption: hierarchyFolderName,
                                // aggregateType: this.getAggregateType(hierarchyFolderName),
                                type: 'string'
                            };
                            dimensionElements.push(fieldObj);
                        }
                        parentID = folderName;
                    }
                    const fieldObj: IOlapField = {
                        hasChildren: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? true : false : true),
                        // hasChildren: true,
                        isSelected: (reportElement.indexOf(hierarchyName) >= 0),
                        pid: parentID,
                        id: hierarchyName,
                        name: field.querySelector('HIERARCHY_CAPTION').textContent,
                        spriteCssClass: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? 'e-hierarchyCDB-icon' : 'e-attributeCDB-icon' : 'e-hierarchyCDB-icon') + ' ' + cls.ICON,
                        hasAllMember: isAllMemberAvail,
                        allMember: allMember,
                        tag: hierarchyName,
                        caption: this.dataFields[hierarchyName as string] && this.dataFields[hierarchyName as string].caption ? this.dataFields[hierarchyName as string].caption : this.mappingFields[hierarchyName as string] && this.mappingFields[hierarchyName as string].caption ? this.mappingFields[hierarchyName as string].caption : field.querySelector('HIERARCHY_CAPTION').textContent,
                        // aggregateType: this.getAggregateType(hierarchyName),
                        type: 'string',
                        filter: [],
                        dateMember: [],
                        sort: (this.enableSort ? this.sortObject[hierarchyName as string] ? this.sortObject[hierarchyName as string] : 'Ascending' : 'None'),
                        actualFilter: [],
                        filterMembers: [],
                        childMembers: [],
                        searchMembers: [],
                        members: {},
                        currrentMembers: {},
                        levels: [],
                        levelCount: 1,
                        isHierarchy: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') &&
                            field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? false : true : false),
                        isExcelFilter: false,
                        allowDragAndDrop: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].allowDragAndDrop : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].allowDragAndDrop : true),
                        showFilterIcon: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].showFilterIcon : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].showFilterIcon : true),
                        showSortIcon: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].showSortIcon : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].showSortIcon : true),
                        showEditIcon: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].showEditIcon : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].showEditIcon : true),
                        showRemoveIcon: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].showRemoveIcon : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].showRemoveIcon : true),
                        showValueTypeIcon: (this.dataFields[hierarchyName as string] ?
                            this.dataFields[hierarchyName as string].showValueTypeIcon : this.mappingFields[hierarchyName as string] ?
                                this.mappingFields[hierarchyName as string].showValueTypeIcon : true),
                        showSubTotals: (this.dataFields[hierarchyName as string] ? this.dataFields[hierarchyName as string].showSubTotals :
                            this.mappingFields[hierarchyName as string] ? this.mappingFields[hierarchyName as string].showSubTotals : true)
                    };
                    dimensionElements.push(fieldObj);
                    this.fieldList[hierarchyName as string] = fieldObj;
                    this.updateMembersOrder(hierarchyName);
                }
            }
        }
        const args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_LEVELS',
            roles: customArgs.dataSourceSettings.roles
        };
        this.getTreeData(args, this.loadLevelElements.bind(this), customArgs);
    }

    private updateMembersOrder(key: string): void {
        for (const sortInfo of this.sortSettings) {
            if (key === sortInfo.name && sortInfo.membersOrder) {
                this.fieldList[key as string].membersOrder = sortInfo.membersOrder;
                break;
            }
        }
    }

    private loadLevelElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let newDataSource: IOlapField[] = [];
        let dimensionElements: IOlapField[] = this.fieldListData;
        newDataSource = [];
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (const field of fields) {
            if (parseInt(field.querySelector('LEVEL_TYPE').textContent, 10) !== 1 && field.querySelector('HIERARCHY_UNIQUE_NAME').textContent.toLowerCase() !== '[measures]') {
                const dimensionName: string = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
                const levelName: string = field.querySelector('LEVEL_UNIQUE_NAME').textContent;
                const levelCaption: string = field.querySelector('LEVEL_CAPTION').textContent;
                const levelObj: IOlapField = {
                    hasChildren: false,
                    isChecked: false,
                    isSelected: this.fieldList[dimensionName as string].isSelected,
                    pid: dimensionName,
                    id: levelName,
                    name: levelCaption,
                    tag: levelName,
                    spriteCssClass: 'e-level-members e-hierarchy-level-' + parseInt(field.querySelector('LEVEL_NUMBER').textContent, 10) + '-icon' + ' ' + cls.ICON,
                    caption: levelCaption,
                    // aggregateType: this.getAggregateType(levelName),
                    type: 'string'
                };
                newDataSource.push(levelObj);
                if (this.fieldList[dimensionName as string] && this.fieldList[dimensionName as string].spriteCssClass &&
                    this.fieldList[dimensionName as string].spriteCssClass.indexOf('e-attributeCDB-icon') === -1) {
                    this.fieldList[dimensionName as string].levels.push(levelObj);
                    this.fieldList[dimensionName as string].isHierarchy = false;
                } else {
                    this.fieldList[dimensionName as string].isHierarchy = true;
                }
            }
        }
        this.fieldListData = dimensionElements = dimensionElements.concat(newDataSource);
        const args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_MEASURES',
            roles: customArgs.dataSourceSettings.roles
        };
        this.getTreeData(args, this.loadMeasureElements.bind(this), customArgs);
    }
    private loadMeasureElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        const dimensionElements: IOlapField[] = this.fieldListData;
        const measureGroupItems: string[] = [];
        let caption: string;
        const dataFields: IFieldOptions[] = extend([], this.values, null, true) as IFieldOptions[];
        const reportElement: string[] = [];
        for (const field of dataFields) {
            reportElement.push(field.name);
        }
        if (this.locale !== 'en-US') {
            const args: ConnectionInfo = {
                catalog: customArgs.dataSourceSettings.catalog,
                cube: customArgs.dataSourceSettings.cube,
                url: customArgs.dataSourceSettings.url,
                LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
                request: 'MDSCHEMA_MEASUREGROUPS',
                roles: customArgs.dataSourceSettings.roles
            };
            this.getTreeData(args, this.loadMeasureGroups.bind(this), customArgs);
        }
        const fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (const field of fields) {
            const measureGRPName: string = isNullOrUndefined(field.querySelector('MEASUREGROUP_NAME')) ? '' : field.querySelector('MEASUREGROUP_NAME').textContent;
            const measureName: string = field.querySelector('MEASURE_UNIQUE_NAME').textContent;
            const formatString: string = field.querySelector('DEFAULT_FORMAT_STRING') ?
                field.querySelector('DEFAULT_FORMAT_STRING').textContent : '#,#';
            const aggregateType: string = field.querySelector('MEASURE_AGGREGATOR') ?
                field.querySelector('MEASURE_AGGREGATOR').textContent : '1';
            if (!(measureGroupItems.indexOf(measureGRPName) >= 0)) {
                if (this.locale !== 'en-US') {
                    const measureInfo: HTMLElement[] = [];
                    for (const item of this.fieldListObj.measuresGroups) {
                        if (item.querySelector('MEASUREGROUP_NAME').textContent === measureGRPName) {
                            measureInfo.push(item);
                        }
                    }
                    caption = measureInfo.length > 0 ? measureInfo[0].querySelector('MEASUREGROUP_CAPTION').textContent : measureGRPName;
                } else {
                    caption = measureGRPName;
                }
                if (measureGRPName !== '') {
                    dimensionElements.push({
                        hasChildren: true,
                        isChecked: false,
                        isSelected: false,
                        pid: '[Measures]',
                        id: measureGRPName,
                        name: caption,
                        spriteCssClass: 'e-measureCDB e-folderCDB-icon' + ' ' + cls.ICON,
                        tag: measureGRPName,
                        caption: caption,
                        aggregateType: this.getAggregateType(measureGRPName, aggregateType),
                        type: 'string'
                    });
                    measureGroupItems.push(measureGRPName);
                }
            }
            const fieldObj: IOlapField = {
                hasChildren: false,
                isSelected: (reportElement.indexOf(measureName) >= 0),
                pid: measureGRPName === '' ? '[Measures]' : measureGRPName,
                id: measureName,
                name: field.querySelector('MEASURE_CAPTION').textContent,
                spriteCssClass: 'e-measure-icon' + ' ' + cls.ICON,
                tag: measureName,
                caption: this.dataFields[measureName as string] && this.dataFields[measureName as string].caption ?
                    this.dataFields[measureName as string].caption : this.mappingFields[measureName as string] &&
                        this.mappingFields[measureName as string].caption ? this.mappingFields[measureName as string].caption :
                        field.querySelector('MEASURE_CAPTION').textContent,
                aggregateType: this.getAggregateType(measureName, aggregateType),
                type: 'number',
                filter: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                formatString: formatString,
                allowDragAndDrop: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].allowDragAndDrop :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].allowDragAndDrop : true),
                showFilterIcon: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showFilterIcon :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showFilterIcon : true),
                showSortIcon: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showSortIcon :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showSortIcon : true),
                showEditIcon: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showEditIcon :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showEditIcon : true),
                showRemoveIcon: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showRemoveIcon :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showRemoveIcon : true),
                showValueTypeIcon: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showValueTypeIcon :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showValueTypeIcon : true),
                showSubTotals: (this.dataFields[measureName as string] ? this.dataFields[measureName as string].showSubTotals :
                    this.mappingFields[measureName as string] ? this.mappingFields[measureName as string].showSubTotals : true)
            };
            dimensionElements.push(fieldObj);
            this.fieldList[measureName as string] = fieldObj;
            if ((reportElement.indexOf(measureName) >= 0)) {
                reportElement.splice(reportElement.indexOf(measureName), 1);
            }
        }
        this.measureReportItems = reportElement;
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_KPIS'
        // };
        // customArgs.reportElement = this.measureReportItems;
        // this.getTreeData(args, this.loadKPIElements.bind(this), customArgs);
    }
    private loadMeasureGroups(xmlDoc: Document): void {
        if (isNullOrUndefined(this.fieldListObj)) {
            this.fieldListObj = {};
        }
        this.fieldListObj.measuresGroups = [].slice.call(xmlDoc.querySelectorAll('row'));
    }
    // private loadKPIElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let dimensionElements: IOlapField[] = this.fieldListData;
    //     let parser = new DOMParser();
    //     let measureGroupItems: string[] = [];
    //     let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
    //     dimensionElements.splice(1, 0, {
    //         hasChildren: true,
    //         isChecked: false,
    //         id: 'folderStruct',
    //         name: 'KPI',
    //         spriteCssClass: 'kpiCDB e-kpiCDB-icon' + ' ' +  cls.ICON,
    //         tag: '',
    //         caption: 'KPI',
    //         aggregateType: this.getAggregateType('folderStruct'),
    //         type: 'string'
    //     });
    //     for (let field of fields) {
    //         let kpiName: string = field.querySelector('KPI_CAPTION').textContent;
    //         let kpiGoal: string = field.querySelector('KPI_GOAL').textContent;
    //         let kpiStatus: string = field.querySelector('KPI_STATUS').textContent;
    //         let kpiTrend: string = field.querySelector('KPI_TREND').textContent;
    //         let kpiValue: string = field.querySelector('KPI_VALUE').textContent;
    //         if (!(measureGroupItems.indexOf(field.querySelector('KPI_NAME').textContent) >= 0)) {
    //             dimensionElements.push({
    //                 hasChildren: true,
    //                 isChecked: false,
    //                 pid: 'folderStruct',
    //                 id: kpiName,
    //                 name: kpiName,
    //                 spriteCssClass: 'e-folderCDB-icon' + ' ' +  cls.ICON,
    //                 tag: kpiName,
    //                 caption: kpiName,
    //                 aggregateType: this.getAggregateType(kpiName),
    //                 type: 'string'
    //             });
    //             measureGroupItems.push(kpiName);
    //         }
    //         let kpiCollection: { [key: string]: string } = {
    //             'kpiGoal': kpiGoal,
    //             'kpiStatus': kpiStatus,
    //             'kpiTrend': kpiTrend,
    //             'kpiValue': kpiValue
    //         };
    //         let i: number = 0;
    //         for (let kpi of Object.keys(kpiCollection)) {
    //             let id: string = kpiCollection[kpi];
    //             let name: string = (kpi).split('kpi')[1];
    //             let cssClass: string = 'e-' + kpi + '-icon';
    //             let fieldObj: IOlapField = {
    //                 hasChildren: true,
    //                 isSelected: (customArgs.reportElement.indexOf(id) >= 0),
    //                 id: id,
    //                 pid: kpiName,
    //                 name: name,
    //                 spriteCssClass: cssClass + ' ' +  cls.ICON,
    //                 tag: id,
    //                 caption: name,
    //                 aggregateType: this.getAggregateType(id),
    //                 type: 'number',
    //                 filter: [],
    //                 sort: 'Ascending',
    //                 filterMembers: [],
    //                 searchMembers: [],
    //                 members: {},
    //                 currrentMembers: {}
    //             };
    //             dimensionElements.push(fieldObj);
    //             this.fieldList[id] = fieldObj;
    //         }
    //     }
    // }

    public doAjaxPost(type: string, url: string, data: string, success: Function, customArgs?: Object): void {
        const ajax: Ajax = new Ajax(
            {
                mode: false,
                contentType: 'text/xml',
                url: url,
                data: data,
                dataType: 'xml',
                type: type,
                beforeSend: this.beforeSend.bind(this),
                onSuccess: (args: string | Object, request: Ajax) => {
                    const parser: DOMParser = new DOMParser();
                    // parsing string type result as XML
                    const xmlDoc: Document = parser.parseFromString(args as string, 'text/xml');
                    const body: Element = xmlDoc.querySelector('Body');
                    if (!body.querySelector('OlapInfo')) {
                        if (!body.querySelector('DiscoverResponse')) {
                            // For catalog, calc fields
                            if (body.querySelector('Fault')) {
                                this.errorInfo = body.querySelector('Fault').querySelector('faultstring').innerHTML;
                            } else {
                                this.errorInfo = body.querySelector('return').querySelector('Error').getAttribute('Description');
                            }
                        }
                    }
                    success(xmlDoc, request, customArgs);
                },
                onFailure: (e: string) => {
                    this.errorInfo = e;
                }
            }
        );
        ajax.send();
    }
    private beforeSend(args: string | Object): void {
        if (this.dataSourceSettings.authentication.userName && this.dataSourceSettings.authentication.password) {
            (args as { httpRequest: XMLHttpRequest }).httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(this.dataSourceSettings.authentication.userName +
                ':' + this.dataSourceSettings.authentication.password));
        }
    }
    private getSoapMsg(dataSourceSettings: IDataOptions, query: string): string {
        let xmlMsg: string = '';
        let sourceInfo: string = '';
        const connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        if (this.isMondrian) {
            sourceInfo = '';
            xmlMsg = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement><![CDATA[' +
                query + ']]></Statement></Command><Properties><PropertyList><DataSourceInfo>' + sourceInfo +
                '</DataSourceInfo><Catalog>' + dataSourceSettings.catalog + '</Catalog><AxisFormat>TupleFormat</AxisFormat><Content>Data</Content><Format>Multidimensional</Format></PropertyList></Properties></Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>';
        } else {
            xmlMsg = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Header></Header> <Body> <Execute xmlns="urn:schemas-microsoft-com:xml-analysis"> <Command> <Statement> ' +
                query + ' </Statement> </Command> <Properties> <PropertyList> <Catalog>' + dataSourceSettings.catalog +
                '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier>' + (dataSourceSettings.roles ? '<Roles>' + dataSourceSettings.roles + '</Roles>' : '') + '</PropertyList> </Properties> </Execute> </Body> </Envelope>';
        }
        return xmlMsg;
    }
    public getConnectionInfo(connectionString: string, locale: string | number): ConnectionInfo {
        const connectionInfo: ConnectionInfo = { url: '', LCID: !isNullOrUndefined(locale) ? locale.toString() : '1033' };
        if (connectionString !== '') {
            for (const obj of connectionString.split(';')) {
                if (obj.toLowerCase().indexOf('locale') < 0 && connectionInfo.url.length === 0) {
                    connectionInfo.url = obj;
                } else if (obj.toLowerCase().indexOf('locale') >= 0) {
                    connectionInfo.LCID = obj.replace(/ /g, '').split('=')[1];
                }
            }
        }
        return connectionInfo;
    }

    public getMDXQuery(dataSourceSettings: IDataOptions): string {
        MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        return this.mdxQuery;
    }
}
/**
 * @hidden
 */
export interface IOlapFieldListOptions {
    [index: string]: IOlapField;
}
/**
 * @hidden
 */
export interface IOlapField extends IField {
    pid?: string;
    tag?: string;
    hasChildren?: boolean;
    expanded?: boolean;
    spriteCssClass?: string;
    name?: string;
    defaultHierarchy?: string;
    hasAllMember?: boolean;
    allMember?: string;
    isChecked?: boolean;
    filterMembers?: IOlapField[];
    childMembers?: IOlapField[];
    searchMembers?: IOlapField[];
    htmlAttributes?: { [key: string]: string };
    currrentMembers?: IMembers;
    isHierarchy?: boolean;
    isNamedSets?: boolean;
    formatString?: string;
    actualFilter?: string[];
    levels?: IOlapField[];
    levelCount?: number;
    memberType?: number;
    fieldType?: string;
    parentHierarchy?: string;
}
/**
 * @hidden
 */
export interface ConnectionInfo {
    url?: string;
    LCID?: string;
    catalog?: string;
    cube?: string;
    request?: string;
    roles?: string;
}
/**
 * @hidden
 */
export interface FieldData {
    hierarchy?: IOlapField[];
    hierarchySuccess?: Document;
    measures?: IFieldOptions[];
    dataSourceSettings?: IDataOptions;
    action?: string;
    reportElement?: string[];
    measuresGroups?: HTMLElement[];
    fieldName?: string;
    drillInfo?: IDrilledItem;
    loadLevelMembers?: boolean;
}
/** @hidden */
export interface IOlapCustomProperties extends ICustomProperties {
    savedFieldList?: IOlapFieldListOptions;
    savedFieldListData?: IOlapField[];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** @hidden */
export interface ITupInfo {
    allCount?: number;
    allStartPos?: number;
    measure?: Element;
    measureName?: string;
    measurePosition?: number;
    members?: NodeListOf<Element>;
    typeCollection?: string[];
    levelCollection?: number[];
    uNameCollection?: string;
    captionCollection?: string;
    drillInfo?: IDrillInfo[];
    drillStartPos?: number;
    drillEndPos?: number;
    startDrillUniquename?: string;
    endDrillUniquename?: string;
    showTotals?: boolean;
}
/** @hidden */
export interface IDrillInfo {
    level: number;
    uName: string;
    hierarchy: string;
    isDrilled: boolean;
}
/** @hidden */
export interface ITotCollection {
    allCount: number;
    allStartPos?: number;
    ordinal: number;
    members: NodeListOf<Element>;
    drillInfo?: IDrillInfo[];
}

/** @hidden */
export interface IParentObjCollection {
    [key: number]: { [key: number]: Element };
}
/** @hidden */
export interface ILastSavedInfo {
    [key: string]: string | number;
}
/** @hidden */
export interface IMeasureInfo {
    measureAxis: string;
    measureIndex: number;
    valueInfo: string[];
}
/** @hidden */
export interface IOrderedInfo {
    orderedValueTuples: Element[];
    orderedHeaderTuples: Element[];
}
/** @hidden */
export interface VirtualScrollingData {
    columnTuple: Element[];
    rowTuple: Element[];
    valueTuple: Element[];
    isCalculated: boolean;
}
/** @hidden */
export interface VirtualTotals {
    totalsCollection: Element[];
    indexCollection: number[];
}
/** @hidden */
export interface ValueSortInfo {
    memberIndex: number;
    columnLength: number;
    rowLength: number;
    isValueSorting: boolean;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
