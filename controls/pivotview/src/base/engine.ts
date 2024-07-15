import { extend, Internationalization, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { isNullOrUndefined, L10n, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotUtil } from './util';
import { Sorting, SummaryTypes, FilterType, LabelOperators, ValueOperators, Operators, DateOperators, Condition, RenderMode } from './types';
import { DateGroup, GroupType, ProviderType, DataSourceType } from './types';
import { HeaderCollection, AggregateEventArgs, GrandTotalsPosition, HeadersSortEventArgs, SubTotalsPosition } from '../common';

/**
 * PivotEngine is used to manipulate the relational or Multi-Dimensional data as pivoting values.
 */

/** @hidden */
export class PivotEngine {

    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public fieldList: IFieldListOptions;
    /** @hidden */
    public pivotValues: IAxisSet[][];
    /** @hidden */
    public aggregatedValueMatrix: IMatrix2D = [];
    /** @hidden */
    public headerContent: IGridValues;
    /** @hidden */
    public valueContent: IGridValues = [];
    /** @hidden */
    public fields: string[];
    /** @hidden */
    public isMultiMeasures: boolean;
    /** @hidden */
    public drilledMembers: IDrillOptions[];
    /** @hidden */
    public isExpandAll: boolean;
    /** @hidden */
    public enableSort: boolean;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public filterMembers: number[];
    /** @hidden */
    public formatFields: { [key: string]: IFormatSettings } = {};
    /** @hidden */
    public groupingFieldsInfo: { [key: string]: string } = {};
    /** @hidden */
    public dateFormatFunction: { [key: string]: { exactFormat: Function, fullFormat: Function } } = {};
    /** @hidden */
    public calculatedFields: { [key: string]: ICalculatedFields } = {};
    /** @hidden */
    public calculatedFormulas: { [key: string]: Object } = {};
    /** @hidden */
    public valueSortSettings: IValueSortSettings;
    /** @hidden */
    public rowIndex: number[];
    /** @hidden */
    public isEngineUpdated: boolean;
    /** @hidden */
    public savedFieldList: IFieldListOptions;
    /** @hidden */
    public valueAxis: number = 0;
    /** @hidden */
    public saveDataHeaders: { [key: string]: IAxisSet[] } = {};
    /** @hidden */
    public columnCount: number = 0;
    /** @hidden */
    public rowCount: number = 0;
    /** @hidden */
    public columnPageCount: number = 0;
    /** @hidden */
    public rowPageCount: number = 0;
    /** @hidden */
    public colFirstLvl: number = 0;
    /** @hidden */
    public rowFirstLvl: number = 0;
    /** @hidden */
    public rowStartPos: number = 0;
    /** @hidden */
    public colStartPos: number = 0;
    /** @hidden */
    public enableValueSorting: boolean = false;
    /** @hidden */
    public headerCollection: HeaderCollection = { rowHeaders: [], columnHeaders: [], rowHeadersCount: 0, columnHeadersCount: 0 };
    /** @hidden */
    public isValueFilterEnabled: boolean;
    /** @hidden */
    public isEmptyData: boolean;
    /** @hidden */
    public emptyCellTextContent: string;
    /** @hidden */
    public isHeaderAvail: boolean;
    /** @hidden */
    public isDrillThrough: boolean;
    /** @hidden */
    public rMembers: IAxisSet[] = [];
    /** @hidden */
    public cMembers: IAxisSet[] = [];
    /** @hidden */
    public groupingFields: { [key: string]: string } = {};
    /** @hidden */
    public isLastHeaderHasMeasures: boolean = true;
    /** @hidden */
    public measureIndex: number = -1;
    /** @hidden */
    public isPagingOrVirtualizationEnabled: boolean = false;
    /** @hidden */
    public valueMatrix: ValueMatrixInfo[][] = [];
    private reportDataType: { [key: string]: string };
    private allowValueFilter: boolean;
    private isValueFiltered: boolean;
    private isValueFiltersAvail: boolean;
    private valueSortData: ValueSortData[];
    private valueFilteredData: IAxisSet[];
    private filterFramedHeaders: IAxisSet[];
    private memberCnt: number = -1;
    private pageInLimit: boolean = false;
    private endPos: number = 0;
    private removeCount: number = 0;
    private colHdrBufferCalculated: boolean = false;
    private colValuesLength: number = 1;
    private rowValuesLength: number = 1;
    private slicedHeaders: IAxisSet[] = [];
    private fieldFilterMem: IFilterObj = {};
    private filterPosObj: INumberIndex = {};
    private selectedHeaders: AggregateCollection = { selectedHeader: [], values: [] };
    private rowGrandTotal: IAxisSet = null;
    private columnGrandTotal: IAxisSet = null;
    private removeRowGrandTotal: boolean = false;
    private removeColumnGrandTotal: boolean = false;
    private isValueHasAdvancedAggregate: boolean = false;
    private rawIndexObject: INumberIndex = {};
    private valueSortHeaderText: string;
    private showSubTotalsAtTop: boolean;
    private showSubTotalsAtBottom: boolean;
    private reformAxisCount: number = 0;
    private isEditing: boolean = false;
    /** @hidden */
    public valueAxisFields: IValueFields = {};
    /** @hidden */
    public data: IDataSet[] | string[][] = [];
    /** @hidden */
    public actualData: IDataSet[] | string[][] = [];
    /** @hidden */
    public groupRawIndex: { [key: number]: number[] } = {};
    /** @hidden */
    public fieldKeys: IDataSet = {};
    private allowDataCompression: boolean = false;
    private dataSourceSettings: IDataOptions = {};
    private frameHeaderObjectsCollection: boolean = false;
    private headerObjectsCollection: { [key: string]: IAxisSet[] } = {};
    private localeObj: L10n;
    private getValueCellInfo: Function;
    private getHeaderSortInfo: Function;
    private fieldsType: IStringIndex;
    private columnKeys: { [key: string]: IFieldOptions } = {};
    private fieldDrillCollection: { [key: string]: string } = {};
    private formatRegex: RegExp = /^(?:[ncpae])(?:([0-9]|1[0-9]|20))?$/i;
    private clonedReport: IDataOptions;
    private measureNames: { [key: string]: string } = {};
    private currencyCode: string;
    private enablePaging: boolean = false;
    private enableVirtualization: boolean = false;
    private enableHtmlSanitizer: boolean = false;
    private isParentLevelAdded: boolean = true;
    private enableOptimizedRendering: boolean = false;
    private groupedDataType: { [key: string]: string } = {};

    /**
     * It is used to clear properties.
     *
     * @param {boolean} isExport - It indicates whether it is triggered after the export or not.
     * @returns {void}
     * @hidden
     */
    public clearProperties(isExport?: boolean): void {
        if (!this.isPagingOrVirtualizationEnabled && !isExport) {
            this.columnKeys = {};
            this.headerCollection = { rowHeaders: [], columnHeaders: [], rowHeadersCount: 0, columnHeadersCount: 0 };
        }
        if (this.enableValueSorting) {
            this.valueContent = [];
        }
        this.saveDataHeaders = this.allowValueFilter ? this.saveDataHeaders : {};
        this.rMembers = [];
        this.cMembers = [];
        this.slicedHeaders = [];
        this.fieldFilterMem = {};
        this.filterPosObj = {};
        this.selectedHeaders = { selectedHeader: [], values: [] };
        this.rowGrandTotal = null;
        this.columnGrandTotal = null;
        this.rawIndexObject = {};
        if (this.dataSourceSettings.valueIndex > -1) {
            this.valueAxisFields = {};
        }
        this.headerObjectsCollection = {};
        this.fieldDrillCollection = {};
    }
    /**
     * It is used to render the pivot engine.
     *
     * @param {IDataOptions} dataSource -  It contains the dataSourceSettings.
     * @param {ICustomProperties} customProperties -  It contains the custom Properties.
     * @param {Function} fn - It contains aggreagateCellnInfo method.
     * @param {Function} onHeadersSort -  It contains onHeaderSort method.
     * @returns {void}
     * @hidden
     */
    public renderEngine(
        dataSource?: IDataOptions, customProperties?: ICustomProperties, fn?: Function, onHeadersSort?: Function): void {
        this.getValueCellInfo = fn;
        this.getHeaderSortInfo = onHeadersSort;
        if (this.fieldList) {
            for (let i: number = 0, j: IFormatSettings[] = dataSource.formatSettings; i < j.length; i++) {
                if (!this.formatFields[j[i as number].name] && this.fieldList[j[i as number].name]) {
                    this.fieldList[j[i as number].name].members = {};
                    this.fieldList[j[i as number].name].formattedMembers = {};
                    this.fieldList[j[i as number].name].dateMember = [];
                }
            }
        }
        this.formatFields = {};
        this.dateFormatFunction = {};
        this.calculatedFields = {};
        this.calculatedFormulas = {};
        this.valueAxis = 0;
        this.saveDataHeaders = {};
        this.columnCount = 0;
        this.rowCount = 0;
        this.columnPageCount = 0;
        this.rowPageCount = 0;
        this.colFirstLvl = 0;
        this.rowFirstLvl = 0;
        this.rowStartPos = 0;
        this.colStartPos = 0;
        this.dataSourceSettings.excludeFields = isNullOrUndefined(dataSource.excludeFields) ? [] : dataSource.excludeFields;
        this.enableValueSorting = false;
        this.headerCollection = { rowHeaders: [], columnHeaders: [], rowHeadersCount: 0, columnHeadersCount: 0 };
        this.aggregatedValueMatrix = [];
        this.rMembers = [];
        this.cMembers = [];
        this.memberCnt = -1;
        this.pageInLimit = false;
        this.endPos = 0;
        this.removeCount = 0;
        this.colHdrBufferCalculated = false;
        this.colValuesLength = 1;
        this.rowValuesLength = 1;
        this.slicedHeaders = [];
        this.fieldFilterMem = {};
        this.filterPosObj = {};
        this.selectedHeaders = { selectedHeader: [], values: [] };
        this.rowGrandTotal = null;
        this.columnGrandTotal = null;
        this.removeRowGrandTotal = false;
        this.removeColumnGrandTotal = false;
        this.isValueHasAdvancedAggregate = false;
        this.rawIndexObject = {};
        this.isLastHeaderHasMeasures = true;
        this.isEditing = false;
        let fields: IDataSet;
        this.globalize = (customProperties && customProperties.globalize) ? customProperties.globalize : new Internationalization();
        this.currencyCode = (customProperties && customProperties.currenyCode) ? customProperties.currenyCode : undefined;
        this.localeObj = customProperties ? customProperties.localeObj : undefined;
        this.fieldsType = customProperties ? customProperties.fieldsType : {};
        this.clonedReport = customProperties ? (customProperties.clonedReport &&
            (<{ [key: string]: Object }>customProperties.clonedReport).properties ?
            (<{ [key: string]: Object }>customProperties.clonedReport).properties :
            customProperties.clonedReport) : {};
        this.enablePaging = customProperties.enablePaging;
        this.enableVirtualization = customProperties.enableVirtualization;
        this.enableOptimizedRendering = customProperties.enableOptimizedRendering;
        this.enableHtmlSanitizer = customProperties.enableHtmlSanitizer;
        this.isPagingOrVirtualizationEnabled = this.enablePaging || this.enableVirtualization;
        this.enableSort = dataSource.enableSorting;
        this.dataSourceSettings.alwaysShowValueHeader = dataSource.alwaysShowValueHeader;
        this.dataSourceSettings.showHeaderWhenEmpty = isNullOrUndefined(dataSource.showHeaderWhenEmpty) ? true :
            dataSource.showHeaderWhenEmpty;
        this.dataSourceSettings.showSubTotals = isNullOrUndefined(dataSource.showSubTotals) ? true : dataSource.showSubTotals;
        this.dataSourceSettings.showRowSubTotals = isNullOrUndefined(dataSource.showRowSubTotals) ? true : dataSource.showRowSubTotals;
        this.dataSourceSettings.showColumnSubTotals = isNullOrUndefined(dataSource.showColumnSubTotals) ? true :
            dataSource.showColumnSubTotals;
        this.dataSourceSettings.showGrandTotals = isNullOrUndefined(dataSource.showGrandTotals) ? true : dataSource.showGrandTotals;
        this.dataSourceSettings.grandTotalsPosition = isNullOrUndefined(dataSource.grandTotalsPosition) ? 'Bottom' :
            dataSource.grandTotalsPosition;
        this.dataSourceSettings.showRowGrandTotals = isNullOrUndefined(dataSource.showRowGrandTotals) ? true :
            dataSource.showRowGrandTotals;
        this.dataSourceSettings.showColumnGrandTotals = isNullOrUndefined(dataSource.showColumnGrandTotals) ? true :
            dataSource.showColumnGrandTotals;
        this.showSubTotalsAtTop = this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showColumnSubTotals &&
            dataSource.subTotalsPosition === 'Top';
        this.showSubTotalsAtBottom = this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showRowSubTotals &&
            dataSource.subTotalsPosition === 'Bottom';
        this.allowValueFilter = dataSource.allowValueFilter;
        this.isValueFilterEnabled = false;
        this.enableValueSorting = customProperties ? customProperties.enableValueSorting : false;
        this.isDrillThrough = customProperties ? (customProperties.isDrillThrough ? customProperties.isDrillThrough : false) : false;
        this.valueContent = [];
        this.dataSourceSettings = PivotUtil.getClonedDataSourceSettings(dataSource);
        if (!(dataSource.dataSource instanceof DataManager)) {
            this.data = dataSource.dataSource;
        }
        if (this.data && (this.data as IDataSet[])[0]) {
            if (!this.fieldList) {
                if (dataSource.type === 'CSV') {
                    this.fields = this.data.shift() as string[];
                } else {
                    this.fields = Object.keys((this.data as IDataSet[])[0]);
                }
                for (let i: number = 0; i < this.fields.length; i++) {
                    this.fieldKeys[this.fields[i as number]] = dataSource.type === 'CSV' ? i : this.fields[i as number];
                }
            }
            if (customProperties && customProperties.pageSettings && customProperties.allowDataCompression) {
                this.actualData = this.data;
                this.data = this.getGroupedRawData(dataSource);
            }
            this.dataSourceSettings.rows = dataSource.rows ? dataSource.rows : [];
            this.dataSourceSettings.columns = dataSource.columns ? dataSource.columns : [];
            this.dataSourceSettings.filters = dataSource.filters ? dataSource.filters : [];
            this.dataSourceSettings.values = dataSource.values ? dataSource.values : [];
            this.dataSourceSettings.formatSettings = dataSource.formatSettings ? dataSource.formatSettings : [];
            this.dataSourceSettings.groupSettings = dataSource.groupSettings ? dataSource.groupSettings : [];
            this.dataSourceSettings.calculatedFieldSettings = dataSource.calculatedFieldSettings ? dataSource.calculatedFieldSettings : [];
            this.enableSort = dataSource.enableSorting === undefined ? true : dataSource.enableSorting;
            this.dataSourceSettings.fieldMapping = dataSource.fieldMapping ? dataSource.fieldMapping : [];
            this.valueAxisFields = {};
            for (const value of this.dataSourceSettings.values) {
                this.valueAxisFields[value.name] = value;
            }
            fields = this.getGroupData(this.data as IDataSet[]);
            for (let i: number = 0; i < this.fields.length; i++) {
                this.fieldKeys[this.fields[i as number]] = dataSource.type === 'CSV' ? i : this.fields[i as number];
            }
            this.validateFilters(dataSource);
            this.isExpandAll = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? true : dataSource.expandAll;
            this.drilledMembers =
                dataSource.drilledMembers ? (this.isValueFiltersAvail && dataSource.allowValueFilter) ? [] : dataSource.drilledMembers : [];
            this.isMultiMeasures = this.dataSourceSettings.values.length > 1 ? true : false;
            this.valueAxis = dataSource.valueAxis === 'row' ? 1 : 0;
            this.measureIndex = !isNullOrUndefined(dataSource.valueIndex) ? dataSource.valueIndex : -1;
            this.emptyCellTextContent = dataSource.emptyCellsTextContent ? dataSource.emptyCellsTextContent : '';
            this.rowValuesLength = this.valueAxis === 1 ? this.dataSourceSettings.values.length : 1;
            this.colValuesLength = this.valueAxis === 0 ? this.dataSourceSettings.values.length : 1;
            this.valueSortSettings = dataSource.valueSortSettings ||
                { sortOrder: 'None', headerDelimiter: '.', headerText: '', columnIndex: undefined } as IValueSortSettings;
            this.valueSortData = [];
            this.pageSettings = customProperties ? (customProperties.pageSettings ? customProperties.pageSettings : this.pageSettings)
                : undefined;
            this.allowDataCompression = customProperties && customProperties.allowDataCompression;
            this.savedFieldList = customProperties ? customProperties.savedFieldList : undefined;
            this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
            this.removeIrrelevantFields(Object.keys(this.fieldList));
            this.fillFieldMembers();
            this.updateSortSettings(dataSource.sortSettings, this.enableSort);
            this.filterMembers = [];
            let columnLength: number = this.dataSourceSettings.columns.length - 1;
            this.columnKeys = {};
            while (columnLength > -1) {
                this.columnKeys[this.dataSourceSettings.columns[columnLength as number].name] = this.dataSourceSettings
                    .columns[columnLength as number];
                columnLength--;
            }
            this.updateFilterMembers(dataSource);
            this.generateGridData(dataSource);
        }
    }
    private removeIrrelevantFields(fields: string[]): void {
        const report: { [key: number]: IFieldOptions[] } = {};
        report[0] = this.dataSourceSettings.rows;
        report[1] = this.dataSourceSettings.columns;
        report[2] = this.dataSourceSettings.values;
        report[3] = this.dataSourceSettings.filters;
        let pos: number = 0;
        while (pos < 4) {
            if (report[pos as number]) {
                for (let cnt: number = 0; cnt < report[pos as number].length; cnt++) {
                    const fieldName: string = report[pos as number][cnt as number].name;
                    if ((this.dataSourceSettings.excludeFields.indexOf(fieldName) > -1) || (!isNullOrUndefined(fields)
                        && fields.indexOf(fieldName) === -1)) {
                        report[pos as number].splice(cnt, 1);
                        cnt--;
                    } else if (pos === 2) {
                        this.measureNames[fieldName as string] =
                        report[pos as number][cnt as number].caption ? report[pos as number][cnt as number].caption : fieldName;
                        this.measureNames[report[pos as number][cnt as number].caption ?
                            report[pos as number][cnt as number].caption : fieldName] = fieldName;
                    }
                }
            }
            pos++;
        }
        this.isMultiMeasures = this.dataSourceSettings.values.length > 1 ? true : false;
        this.measureIndex = this.measureIndex === -1 ? (this.valueAxis ? report[0].length : report[1].length) : this.measureIndex;
    }
    private updateDataSourceSettings(dataSource: IDataOptions, requireDatasourceUpdate: boolean): void {
        if (requireDatasourceUpdate) {
            this.emptyCellTextContent = dataSource.emptyCellsTextContent ? dataSource.emptyCellsTextContent : '';
            this.valueAxis = dataSource.valueAxis === 'row' ? 1 : 0;
            this.rowValuesLength = this.valueAxis === 1 ? this.dataSourceSettings.values.length : 1;
            this.colValuesLength = this.valueAxis === 0 ? this.dataSourceSettings.values.length : 1;
            this.measureIndex = !isNullOrUndefined(dataSource.valueIndex) ? dataSource.valueIndex : -1;
            this.enableSort = dataSource.enableSorting;
            this.dataSourceSettings.alwaysShowValueHeader = dataSource.alwaysShowValueHeader;
            this.dataSourceSettings.showHeaderWhenEmpty = isNullOrUndefined(dataSource.showHeaderWhenEmpty) ? true :
                dataSource.showHeaderWhenEmpty;
            this.dataSourceSettings.showSubTotals = isNullOrUndefined(dataSource.showSubTotals) ? true : dataSource.showSubTotals;
            this.dataSourceSettings.showRowSubTotals = isNullOrUndefined(dataSource.showRowSubTotals) ? true : dataSource.showRowSubTotals;
            this.dataSourceSettings.showColumnSubTotals = isNullOrUndefined(dataSource.showColumnSubTotals) ? true :
                dataSource.showColumnSubTotals;
            this.dataSourceSettings.showGrandTotals = isNullOrUndefined(dataSource.showGrandTotals) ? true : dataSource.showGrandTotals;
            this.dataSourceSettings.grandTotalsPosition = isNullOrUndefined(dataSource.grandTotalsPosition) ? 'Bottom' :
                dataSource.grandTotalsPosition;
            this.dataSourceSettings.showRowGrandTotals = isNullOrUndefined(dataSource.showRowGrandTotals) ? true :
                dataSource.showRowGrandTotals;
            this.dataSourceSettings.showColumnGrandTotals = isNullOrUndefined(dataSource.showColumnGrandTotals) ? true :
                dataSource.showColumnGrandTotals;
            this.showSubTotalsAtTop = this.dataSourceSettings.showSubTotals && dataSource.subTotalsPosition === 'Top' &&
                dataSource.showColumnSubTotals;
            this.showSubTotalsAtBottom = this.dataSourceSettings.showSubTotals && dataSource.subTotalsPosition === 'Bottom' && dataSource.showRowSubTotals;
            this.allowValueFilter = dataSource.allowValueFilter;
            this.dataSourceSettings.formatSettings = dataSource.formatSettings ? dataSource.formatSettings : [];
            this.dataSourceSettings.groupSettings = dataSource.groupSettings ? dataSource.groupSettings : [];
            this.dataSourceSettings.calculatedFieldSettings = dataSource.calculatedFieldSettings ? dataSource.calculatedFieldSettings : [];
            this.enableSort = dataSource.enableSorting === undefined ? true : dataSource.enableSorting;
            this.dataSourceSettings.fieldMapping = dataSource.fieldMapping ? dataSource.fieldMapping : [];
            this.removeIrrelevantFields(Object.keys(this.fieldList));
        }
    }

    private getGroupedRawData(dataSourceSettings: IDataOptions): IDataSet[] | string[][] {
        this.data = [];
        for (const data of this.actualData as IDataSet[]) {
            this.data[this.data.length] = PivotUtil.frameHeaderWithKeys(data) as IDataSet | string[];
        }
        const countFields: string[] = dataSourceSettings.values.filter((item: IFieldOptions) => {
            return item.type === 'Count' || item.type === 'DistinctCount';
        }).map((item: IFieldOptions) => { return item.name; });
        const hasCountField: boolean = countFields.length > 0;
        const realData: IDataSet[] | string[][] = this.data;
        const headerFields: string[] =
            dataSourceSettings.rows.concat(dataSourceSettings.columns.concat(dataSourceSettings.filters)).map((item: IFieldOptions) => {
                return item.name;
            });
        const groupRawData: { [key: string]: IDataSet } | string[] = {};
        const finalData: IDataSet[] = [];
        this.groupRawIndex = {};
        const groupKeys: { [key: string]: number } = {};
        let indexLength: number = 0;
        for (let i: number = 0; i < realData.length; i++) {
            const currData: IDataSet | string[] = realData[i as number];
            const members: string[] = [];
            if (hasCountField) {
                for (let vPos: number = 0; vPos < countFields.length; vPos++) {
                    (currData as IDataSet)[this.fieldKeys[countFields[vPos as number]] as string | number] =
                        isNullOrUndefined((currData as IDataSet)[this.fieldKeys[countFields[vPos as number]] as string | number]) ?
                            (currData as IDataSet)[this.fieldKeys[countFields[vPos as number]] as string | number] : 1;
                }
            }
            for (let hPos: number = 0; hPos < headerFields.length; hPos++) {
                members.push((currData as string[])[this.fieldKeys[headerFields[hPos as number]] as number]);
            }
            const memberJoin: string = members.join('-');
            if (groupRawData[memberJoin as string]) {
                for (let vPos: number = 0; vPos < dataSourceSettings.values.length; vPos++) {
                    const currFieldName: string = dataSourceSettings.values[vPos as number].name;
                    const currValue: string | number | Date = (currData as IDataSet)[this.fieldKeys[
                        currFieldName as string] as string | number];
                    const savedData: IDataSet = groupRawData[memberJoin as string];
                    let summType: SummaryTypes = dataSourceSettings.values[vPos as number].type;
                    if (!isNullOrUndefined(currValue)) {
                        if (typeof currValue !== 'number' || summType === 'DistinctCount') {
                            summType = 'Count';
                        }
                        if (isNullOrUndefined(savedData[currFieldName as string])) {
                            savedData[currFieldName as string] = summType === 'Product' ? 1 : ((summType === 'Min' || summType === 'Max')
                                ? undefined : 0);
                        } else if (typeof savedData[currFieldName as string] !== 'number') {
                            savedData[currFieldName as string] = 1;
                        }
                        if (summType === 'Count') {
                            (savedData[currFieldName as string] as number) += 1;
                        } else if (summType === 'Min') {
                            if (!isNullOrUndefined(savedData[currFieldName as string])) {
                                savedData[currFieldName as string] = savedData[currFieldName as string] > currValue ?
                                    currValue : savedData[currFieldName as string];
                            }
                        } else if (summType === 'Max') {
                            if (!isNullOrUndefined(savedData[currFieldName as string])) {
                                savedData[currFieldName as string] = savedData[currFieldName as string] < currValue ?
                                    currValue : savedData[currFieldName as string];
                            }
                        } else if (summType === 'Product') {
                            (savedData[currFieldName as string] as number) *= currValue as number;
                        } else {
                            (savedData[currFieldName as string] as number) += currValue as number;
                        }
                    }
                }
                if (this.isDrillThrough) {
                    this.groupRawIndex[groupKeys[memberJoin as string]].push(i);
                }
            } else {
                (groupRawData)[memberJoin as string] = currData as IDataSet;
                finalData.push(currData as IDataSet);
                if (this.isDrillThrough) {
                    this.groupRawIndex[indexLength as number] = [i as number];
                    groupKeys[memberJoin as string] = indexLength;
                    indexLength++;
                }
            }
        }
        return finalData;
    }
    private getGroupData(data: IDataSet[]): IDataSet {
        let fieldkeySet: IDataSet = data[0];
        for (const group of this.dataSourceSettings.groupSettings) {
            const fieldName: string = group.name;
            const caption: string = group.caption;
            if (this.fields.indexOf(fieldName) > -1) {
                const groupFields: { [key: string]: string } = {};
                let customGroupFieldName: string;
                if ((group.type === 'Date' && this.groupingFields[fieldName as string]) ||
                    (group.type === 'Custom' && this.groupingFields[fieldName as string])) {
                    return fieldkeySet;
                } else if (group.type === 'Number') {
                    if (PivotUtil.getType(fieldkeySet[fieldName as string] as Date) === 'number' ||
                    !this.groupingFields[fieldName as string]) {
                        if (group.rangeInterval) {
                            data.sort((a: IDataSet, b: IDataSet) => (Number(a[this.fieldKeys[fieldName as string] as string | number]) >
                                Number(b[this.fieldKeys[fieldName as string] as string | number])) ? 1 :
                                ((Number(b[this.fieldKeys[fieldName as string] as string | number]) >
                            Number(a[this.fieldKeys[fieldName as string] as string | number])) ? -1 : 0));
                        }
                    } else {
                        return fieldkeySet;
                    }
                }
                // else if (group.type === 'Custom' && this.fields.indexOf(fieldName + '_custom_group') > -1) {
                //     return fieldkeySet;
                // }
                let len: number = data.length;
                while (len--) {
                    const item: IDataSet = data[len as number];
                    if (item[this.fieldKeys[fieldName as string] as string | number] && group.type === 'Date') {
                        const date: Date = new Date(item[this.fieldKeys[fieldName as string] as string | number].toString());
                        if (!isNullOrUndefined(date) && group.groupInterval.length > 0) {
                            for (let i: number = 0, len: number = group.groupInterval.length; i < len; i++) {
                                const interval: DateGroup = group.groupInterval[i as number];
                                const isInRangeAvail: boolean = this.getRange(group, date.getTime());
                                const newDate: Date = PivotUtil.resetTime(new Date());
                                switch (interval) {
                                case 'Years':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_years';
                                        groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setFullYear(date.getFullYear())).toString());
                                    }
                                    break;
                                case 'Quarters':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_quarters';
                                        groupFields[newFieldName as string] = interval;
                                        const month: number = Math.ceil((date.getMonth() + 1) / 3);
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            ((this.localeObj ? this.localeObj.getConstant('qtr') : 'Qtr') + month.toString()));
                                    }
                                    break;
                                case 'QuarterYear':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_quarterYear';
                                        groupFields[newFieldName as string] = interval;
                                        const month: number = Math.ceil((date.getMonth() + 1) / 3);
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            ((this.localeObj ? this.localeObj.getConstant('qtr') : 'Qtr') + month.toString() + ' '
                                                + (this.localeObj ? this.localeObj.getConstant('of') : 'of') + ' '
                                                + date.getFullYear().toString()));
                                    }
                                    break;
                                case 'Months':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_months';
                                        groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setMonth(date.getMonth(), 1)).toString());
                                    }
                                    break;
                                case 'Days':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_days';
                                        groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setMonth(date.getMonth(), date.getDate())).toString());
                                    }
                                    break;
                                case 'Hours':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_hours';
                                        groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setHours(date.getHours())).toString());
                                    }
                                    break;
                                case 'Minutes':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_minutes'; groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setMinutes(date.getMinutes())).toString());
                                    }
                                    break;
                                case 'Seconds':
                                    {
                                        const newFieldName: string = (i === group.groupInterval.length - 1) ? fieldName :
                                            fieldName + '_date_group_seconds'; groupFields[newFieldName as string] = interval;
                                        this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                            (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                                this.fields.length) : newFieldName;
                                        if (this.fields.indexOf(newFieldName) === -1) {
                                            this.fields.push(newFieldName);
                                        }
                                        item[this.fieldKeys[newFieldName as string] as string | number] = (isInRangeAvail ? undefined :
                                            new Date(newDate.setSeconds(date.getSeconds())).toString());
                                    }
                                    break;
                                }
                            }
                        }
                    } else if (!isNaN(Number(item[this.fieldKeys[fieldName as string] as string | number])) && group.type === 'Number') {
                        const isInRangeAvail: boolean = this.getRange(group, Number(item[this.fieldKeys[
                            fieldName as string] as string | number]));
                        item[this.fieldKeys[fieldName as string] as string | number] = isInRangeAvail ? undefined :
                            item[this.fieldKeys[fieldName as string] as string | number];
                    } else if (item[this.fieldKeys[fieldName as string] as string | number] && group.type === 'Custom' &&
                        group.customGroups && group.customGroups.length > 0) {
                        const newFieldName: string = fieldName + '_custom_group';
                        const customGroups: ICustomGroups[] = group.customGroups;
                        let groupValue: string;
                        this.groupingFieldsInfo[fieldName as string] = fieldName;
                        this.groupingFieldsInfo[newFieldName as string] = fieldName;
                        for (let i: number = 0, len: number = customGroups.length; i < len; i++) {
                            const cGroup: ICustomGroups = customGroups[i as number];
                            if (cGroup.items && cGroup.items.length > 1) {
                                customGroupFieldName = newFieldName;
                                this.fieldKeys[newFieldName as string] = this.dataSourceSettings.type === 'CSV' ?
                                    (this.fieldKeys[newFieldName as string] ? this.fieldKeys[newFieldName as string] :
                                        this.fields.length) : newFieldName;
                                if (this.fields.indexOf(newFieldName) === -1) {
                                    this.fields.push(newFieldName);
                                }
                                const isDataMatch: boolean = PivotUtil.inArray(item[this.fieldKeys[
                                    fieldName as string] as string | number].toString(), cGroup.items) === -1 ? false : true;
                                item[this.fieldKeys[newFieldName as string] as string | number] =
                                    (isDataMatch ? (cGroup.groupName && cGroup.groupName !== '') ? cGroup.groupName :
                                        this.localeObj.getConstant('group') + ' ' + i : (groupValue &&
                                            groupValue !== item[this.fieldKeys[fieldName as string] as string | number].toString()) ?
                                        groupValue : item[this.fieldKeys[fieldName as string] as string | number].toString());
                                groupValue = item[this.fieldKeys[newFieldName as string] as string | number] as string;
                            }
                        }
                    }
                    const keys: string[] = Object.keys(item);
                    const isCompleteSet: boolean[] = [];
                    for (const key of keys) { isCompleteSet.push((item[key as string]) ? true : false); }
                    fieldkeySet =
                        (((isCompleteSet.indexOf(false) === -1) && keys.length === Object.keys(data[0]).length) ? item : fieldkeySet);
                    //this.fields = Object.keys(fieldkeySet);
                }
                if (group.type === 'Date') {
                    let isDataSource: boolean = false;
                    const axisFields: IFieldOptions[][] = [this.dataSourceSettings.rows, this.dataSourceSettings.columns,
                        this.dataSourceSettings.values, this.dataSourceSettings.filters];
                    const groupKeys: string[] = Object.keys(groupFields);
                    let gCnt: number = Object.keys(groupKeys).length;
                    let groupField: string;
                    for (const axis of axisFields) {
                        if (!isDataSource && axis) {
                            const cnt: number = axis.length;
                            let i: number = 0;
                            while (i < cnt) {
                                if (axis[i as number].name === fieldName) {
                                    isDataSource = true;
                                    const actualField: IFieldOptions = axis[i as number];
                                    axis.splice(i, 1);
                                    let dataFields: IFieldOptions[] = this.dataSourceSettings.rows;
                                    dataFields = dataFields.concat(
                                        this.dataSourceSettings.columns, this.dataSourceSettings.values, this.dataSourceSettings.filters
                                    );
                                    while (gCnt--) {
                                        let caption: string = actualField.caption ? actualField.caption : actualField.name;
                                        if (this.clonedReport) {
                                            let clonedFields: IFieldOptions[] = this.clonedReport.rows;
                                            clonedFields = clonedFields.concat(
                                                this.clonedReport.columns, this.clonedReport.values, this.clonedReport.filters);
                                            const cloneField: IFieldOptions =
                                                PivotUtil.getFieldByName(groupKeys[gCnt as number], clonedFields) as IFieldOptions;
                                            if (cloneField) {
                                                caption = cloneField.caption ? cloneField.caption : cloneField.name;
                                            }
                                        }
                                        if (!PivotUtil.getFieldByName(groupKeys[gCnt as number], dataFields)) {
                                            groupField = groupFields[groupKeys[gCnt as number]];
                                            caption = (caption.indexOf(' (') !== -1 && caption.indexOf(')') !== -1) ?
                                                caption.slice(caption.indexOf('(') + 1, caption.length - 1) : caption;
                                            const newField: IFieldOptions = {
                                                name: groupKeys[gCnt as number],
                                                caption: (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + caption + ')',
                                                type: 'Count' as SummaryTypes,
                                                showNoDataItems: actualField.showNoDataItems,
                                                baseField: actualField.baseField,
                                                baseItem: actualField.baseItem,
                                                showFilterIcon: actualField.showFilterIcon,
                                                showSortIcon: actualField.showSortIcon,
                                                showEditIcon: actualField.showEditIcon,
                                                showRemoveIcon: actualField.showRemoveIcon,
                                                showSubTotals: actualField.showValueTypeIcon,
                                                allowDragAndDrop: actualField.allowDragAndDrop,
                                                expandAll: actualField.expandAll,
                                                groupName: actualField.groupName
                                            };
                                            axis.splice(i, 0, newField);
                                            this.groupingFieldsInfo[newField.name] = fieldName;
                                        } else {
                                            this.groupingFieldsInfo[groupKeys[gCnt as number]] = fieldName;
                                        }
                                    }
                                    break;
                                } else if (axis[i as number].name.indexOf(fieldName) > -1) {
                                    const axisField: string = groupFields[axis[i as number].name];
                                    const currentField: IFieldOptions = axis.filter((axisField: IFieldOptions) => {
                                        return axisField.name === fieldName;
                                    })[0];
                                    if (!isNullOrUndefined(currentField)) {
                                        const currentFieldCaption: string = (currentField.caption.indexOf(' (') !== -1 &&
                                            currentField.caption.indexOf(')') !== -1) ? currentField.caption.slice(
                                                currentField.caption.indexOf('(') + 1, currentField.caption.length - 1
                                            ) : currentField.caption;
                                        axis[i as number].caption = (this.localeObj ? this.localeObj.getConstant(axisField) : currentField)
                                            + ' (' + currentFieldCaption + ')';
                                    }
                                }
                                i++;
                            }
                            if (isDataSource) {
                                break;
                            }
                        }
                    }
                    gCnt = Object.keys(groupKeys).length;
                    const field: IFieldOptions = this.getMappingField(fieldName, this.clonedReport ? this.clonedReport.fieldMapping
                        : this.dataSourceSettings.fieldMapping);
                    const caption: string = field.caption ? field.caption : fieldName;
                    while (gCnt--) {
                        groupField = groupFields[groupKeys[gCnt as number]];
                        for (let i: number = 0, len: number = this.dataSourceSettings.formatSettings.length; i < len; i++) {
                            if (this.dataSourceSettings.formatSettings[i as number].name === groupKeys[gCnt as number]) {
                                this.dataSourceSettings.formatSettings.splice(i, 1);
                                break;
                            }
                        }
                        if (groupField !== 'Quarters' && groupField !== 'QuarterYear') {
                            const formatSettings: IFormatSettings = {
                                name: groupKeys[gCnt as number],
                                type: ['Years', 'Months', 'Days'].indexOf(groupField) > -1 ? 'date' : 'time',
                                format: ((groupField === 'Years') ? 'yyyy' : (groupField === 'Months') ? 'MMM' :
                                    (groupField === 'Days') ? 'd-MMM' : (groupField === 'Hours') ? 'hh a' :
                                        (groupField === 'Minutes') ? ':mm' : (groupField === 'Seconds') ? ':ss' : undefined)
                            };
                            this.dataSourceSettings.formatSettings.push(formatSettings);
                        }
                        if (!isDataSource) {
                            const mappingField: IFieldOptions = this.getMappingField(
                                groupKeys[gCnt as number], this.dataSourceSettings.fieldMapping
                            );
                            if (groupKeys[gCnt as number] !== fieldName && isNullOrUndefined(mappingField.name)) {
                                const newField: IFieldOptions = {
                                    name: groupKeys[gCnt as number],
                                    caption: (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + caption + ')'
                                };
                                this.dataSourceSettings.fieldMapping.push(newField);
                                this.groupingFieldsInfo[newField.name] = fieldName;
                            } else if (groupKeys[gCnt as number] !== fieldName) {
                                mappingField.caption = (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + caption + ')';
                                this.groupingFieldsInfo[mappingField.name] = fieldName;
                            }
                        }
                    }
                    if (!isDataSource) {
                        const mappingField: IFieldOptions = this.getMappingField(fieldName, this.dataSourceSettings.fieldMapping);
                        groupField = groupFields[fieldName as string];
                        if (groupKeys[gCnt as number] !== fieldName && isNullOrUndefined(mappingField.name)) {
                            const newField: IFieldOptions = {
                                name: fieldName,
                                caption: (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + caption + ')'
                            };
                            this.dataSourceSettings.fieldMapping.push(newField);
                            this.groupingFieldsInfo[newField.name] = fieldName;
                        } else {
                            mappingField.caption = (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + caption + ')';
                            this.groupingFieldsInfo[mappingField.name] = fieldName;
                        }
                    }
                } else if (group.type === 'Number' && group.rangeInterval) {
                    let cEndValue: number;
                    const framedSet: number[] = [];
                    const unframedSet: number[] = [];
                    let dataLength: number = data.length;
                    let cnt: number = 0;
                    this.groupingFields[fieldName as string] = fieldName;
                    let endingAt: number;
                    const groupName: number[] = [];
                    while (cnt < dataLength) {
                        const numericFieldName: number = Number(data[cnt as number][fieldName as string]);
                        unframedSet.push(numericFieldName);
                        if (!isNaN(numericFieldName) && framedSet.indexOf(numericFieldName) === -1) {
                            framedSet.push(numericFieldName);
                        }
                        cnt++;
                    }
                    dataLength = data.length;
                    cnt = 0;
                    while (cnt < dataLength) {
                        const currentData : IDataSet = data[cnt as number];
                        if (currentData && !isNaN(Number(currentData[fieldName as string]))) {
                            endingAt = typeof (group.endingAt) === 'string' ? parseInt(group.endingAt, 10) : group.endingAt as number;
                            cEndValue = endingAt ? endingAt : Math.max(...framedSet);
                            const currentStartValue: number = Math.round(Number(currentData[fieldName as string]));
                            const currentEndValue: number = Math.round(currentStartValue + (group.rangeInterval - 1));
                            if (currentStartValue >= groupName[0] && currentStartValue <= groupName[groupName.length - 1]) {
                                const startValue: number = groupName[0];
                                const endValue: number = groupName[groupName.length - 1];
                                currentData[fieldName as string] = this.getNumberGroupHeaders(startValue, endValue, cEndValue);
                                if (isNullOrUndefined(this.groupedDataType[fieldName as string])) {
                                    this.groupedDataType[fieldName as string] = 'string';
                                }
                            } else {
                                if (groupName.length === 0) {
                                    for (let i: number = currentStartValue; i <= currentEndValue; i++) {
                                        groupName.push(i);
                                    }
                                    const startValue: number = groupName[0];
                                    const endValue: number = groupName[groupName.length - 1];
                                    currentData[fieldName as string]  = this.getNumberGroupHeaders(startValue, endValue, cEndValue);
                                    if (isNullOrUndefined(this.groupedDataType[fieldName as string])) {
                                        this.groupedDataType[fieldName as string] = 'string';
                                    }
                                } else {
                                    let startValue: number = groupName[groupName.length - 1] + 1;
                                    let endValue: number = startValue + (group.rangeInterval - 1);
                                    let grouping: boolean = true;
                                    groupName.splice(0, groupName.length);
                                    while (grouping) {
                                        if (currentStartValue >= startValue && currentStartValue <= endValue) {
                                            currentData[fieldName as string]  = this.getNumberGroupHeaders(startValue, endValue, cEndValue);
                                            if (isNullOrUndefined(this.groupedDataType[fieldName as string])) {
                                                this.groupedDataType[fieldName as string] = 'string';
                                            }
                                            groupName.push(startValue);
                                            groupName.push(endValue);
                                            grouping = false;
                                        }
                                        startValue = endValue + 1;
                                        endValue = startValue + (group.rangeInterval - 1);
                                    }
                                }
                            }
                            const keys: string[] = Object.keys(currentData);
                            const isCompleteSet: boolean[] = [];
                            for (const key of keys) { isCompleteSet.push((currentData[key as string]) ? true : false); }
                            fieldkeySet = (((isCompleteSet.indexOf(false) === -1) && keys.length === Object.keys(data[0]).length) ?
                                currentData : fieldkeySet);
                        }
                        cnt++;
                    }
                    const axisFields: IFieldOptions[][] = [this.dataSourceSettings.rows, this.dataSourceSettings.columns,
                        this.dataSourceSettings.values, this.dataSourceSettings.filters];
                    for (const fields of axisFields) {
                        let field: IFieldOptions = PivotUtil.getFieldByName(fieldName, fields) as IFieldOptions;
                        if (field) {
                            field = (<{ [key: string]: Object }>field).properties ? (<{ [key: string]: Object }>field).properties : field;
                            field.type = 'Count';
                        }
                    }
                    for (let i: number = 0, len: number = this.dataSourceSettings.formatSettings.length; i < len; i++) {
                        if (this.dataSourceSettings.formatSettings[i as number].name === fieldName) {
                            this.dataSourceSettings.formatSettings.splice(i, 1);
                            break;
                        }
                    }
                } else if (group.type === 'Custom' && customGroupFieldName) {
                    const customFieldName: string = customGroupFieldName;
                    // this.groupingFields[customFieldName] = customFieldName;
                    let isDataSource: boolean = false;
                    const axisFields: IFieldOptions[][] = [this.dataSourceSettings.rows, this.dataSourceSettings.columns,
                        this.dataSourceSettings.values, this.dataSourceSettings.filters];
                    let dataFields: IFieldOptions[] = this.dataSourceSettings.rows;
                    dataFields = dataFields.concat(
                        this.dataSourceSettings.columns, this.dataSourceSettings.values, this.dataSourceSettings.filters
                    );
                    let pattern: string[] = [];
                    if (!caption || caption === '') {
                        pattern = customFieldName.match(/_custom_group/g);
                    }
                    // let actualFieldName: string = fieldName.replace(/_custom_group/g, '');
                    const parentField: IFieldOptions = PivotUtil.getFieldByName(fieldName.replace(/_custom_group/g, ''), dataFields) as IFieldOptions;
                    const customGroupField: IFieldOptions = PivotUtil.getFieldByName(customFieldName, dataFields) as IFieldOptions;
                    for (const axis of axisFields) {
                        if (!isDataSource && axis) {
                            const cnt: number = axis.length;
                            let i: number = 0;
                            while (i < cnt) {
                                if (axis[i as number].name === group.name && !customGroupField) {
                                    isDataSource = true;
                                    const actualField: IFieldOptions = axis[i as number];
                                    const newField: IFieldOptions = {
                                        name: customFieldName,
                                        caption: (!caption || caption === '') ? (parentField.caption ? parentField.caption : parentField.name) + (pattern.length + 1) : caption,
                                        type: 'Count' as SummaryTypes,
                                        showNoDataItems: actualField.showNoDataItems,
                                        baseField: actualField.baseField,
                                        baseItem: actualField.baseItem,
                                        showSubTotals: actualField.showValueTypeIcon,
                                        allowDragAndDrop: actualField.allowDragAndDrop,
                                        showFilterIcon: actualField.showFilterIcon,
                                        showSortIcon: actualField.showSortIcon,
                                        showRemoveIcon: actualField.showRemoveIcon,
                                        showEditIcon: actualField.showEditIcon,
                                        expandAll: actualField.expandAll,
                                        groupName: actualField.groupName
                                    };
                                    axis.splice(i, 0, newField);
                                    this.groupingFieldsInfo[newField.name] = fieldName;
                                    this.groupingFieldsInfo[fieldName as string] = fieldName;
                                    break;
                                } else if (axis[i as number].name === customFieldName && customGroupField) {
                                    const newField: IFieldOptions = {
                                        name: customGroupField.name,
                                        caption: (!caption || caption === '') ? customGroupField.caption : caption,
                                        type: customGroupField.type,
                                        showNoDataItems: customGroupField.showNoDataItems,
                                        baseField: customGroupField.baseField,
                                        baseItem: customGroupField.baseItem,
                                        showRemoveIcon: customGroupField.showRemoveIcon,
                                        showSubTotals: customGroupField.showValueTypeIcon,
                                        allowDragAndDrop: customGroupField.allowDragAndDrop,
                                        showFilterIcon: customGroupField.showFilterIcon,
                                        showSortIcon: customGroupField.showSortIcon,
                                        showEditIcon: customGroupField.showEditIcon,
                                        expandAll: customGroupField.expandAll,
                                        groupName: customGroupField.groupName
                                    };
                                    axis.splice(i, 1, newField);
                                    this.groupingFieldsInfo[newField.name] = fieldName;
                                    this.groupingFieldsInfo[fieldName as string] = fieldName;
                                    break;
                                }
                                i++;
                            }
                            if (isDataSource) {
                                break;
                            }
                        }
                    }
                    const formatfield: IFormatSettings = PivotUtil.getFieldByName(
                        fieldName, PivotUtil.cloneFormatSettings(this.dataSourceSettings.formatSettings)) as IFormatSettings;
                    if (formatfield) {
                        formatfield.name = customFieldName;
                        this.dataSourceSettings.formatSettings.push(formatfield);
                    }
                    this.groupingFields[fieldName as string] = fieldName;
                }
                this.groupingFields = extend(this.groupingFields, groupFields) as { [key: string]: string };
            } else {
                return fieldkeySet;
            }
        }
        //this.fields = Object.keys(fieldkeySet);
        return fieldkeySet;
    }
    private getNumberGroupHeaders(startValue : number , endValue: number, cEndValue: number): string {
        const fieldName: string = (startValue === endValue) ? startValue.toString() : (cEndValue >= startValue && cEndValue <= endValue) ?
            (cEndValue === startValue) ? startValue.toString() : startValue.toString() + '-' + cEndValue.toString() :
            startValue.toString() + '-' + endValue.toString();
        return fieldName;
    }
    private getRange(group: IGroupSettings, cValue: number): boolean {
        let isRangeAvail: boolean;
        if (group.type === 'Date') {
            const cDate: Date = new Date(cValue);
            const startDate: Date = typeof (group.startingAt) === 'string' ? new Date(group.startingAt) : group.startingAt as Date;
            const endDate: Date = typeof (group.endingAt) === 'string' ? new Date(group.endingAt) : group.endingAt as Date;
            if (startDate && cDate.getTime() < startDate.getTime() ||
                endDate && cDate.getTime() > endDate.getTime()) {
                isRangeAvail = true;
            } else {
                isRangeAvail = false;
            }
        } else {
            const startValue: number = typeof (group.startingAt) === 'string' ? parseInt(group.startingAt, 10) : group.startingAt as number;
            const endValue: number = typeof (group.endingAt) === 'string' ? parseInt(group.endingAt, 10) : group.endingAt as number;
            if (!isNaN(startValue) && cValue < startValue || !isNaN(endValue) && cValue > endValue) {
                isRangeAvail = true;
            } else {
                isRangeAvail = false;
            }
        }
        return isRangeAvail;
    }
    private getPercentFormat(formatField: { [key: string]: IFormatSettings }, currentField: string): number {
        const isHavingFormat: RegExpMatchArray = (!isNullOrUndefined(formatField[currentField as string]) &&
            !isNullOrUndefined(this.formatFields[currentField as string].format)) ?
            (this.formatFields[currentField as string].format).toLowerCase().match(/p[0-9]/) : undefined;
        return !isNullOrUndefined(isHavingFormat) ? (Number((this.formatFields[currentField as string].format).replace(/[^0-9]/g, ''))) : 2;
    }
    private getFormattedFields(dataSourceSettings: IDataOptions): void {
        this.formatFields = this.setFormattedFields(dataSourceSettings.formatSettings);
        // for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
        // if (fields[len as number] && fields[len as number].name === this.dataSourceSettings.formatSettings[cnt as number].name) {
        //     this.formatFields[fields[len as number].name] = this.dataSourceSettings.formatSettings[cnt as number];
        // }
        // }
    }

    /**
     * It is used to update the format fields.
     *
     * @param {IFormatSettings[]} formatSettings -  It contains the format settings.
     * @returns {Object} - An object mapping keys to format settings.
     * @hidden
     */
    public setFormattedFields(formatSettings: IFormatSettings[]): { [key: string]: IFormatSettings } {
        let cnt: number = formatSettings.length;
        const formatFields: { [key: string]: IFormatSettings } = {};
        while (cnt--) {
            formatFields[formatSettings[cnt as number].name] = formatSettings[cnt as number];
            if (formatSettings[cnt as number].type) {
                this.dateFormatFunction[formatSettings[cnt as number].name] = {
                    exactFormat: this.globalize.getDateFormat(formatSettings[cnt as number]),
                    fullFormat: this.globalize.getDateFormat({
                        format: 'yyyy/MM/dd/HH/mm/ss', type: formatSettings[cnt as number].type
                    })
                };
            }
        }

        return formatFields;
    }

    private getFieldList(fields: { [index: string]: Object }, isSort: boolean, isValueFilteringEnabled: boolean): void {
        let type: string;
        let lenE: number = this.dataSourceSettings.excludeFields.length - 1;
        while (lenE > -1) {
            const index: number = this.fields.indexOf(this.dataSourceSettings.excludeFields[lenE as number]);
            if (index !== -1) {
                this.fields.splice(index, 1);
            }
            if (this.fieldList) {
                delete this.fieldList[this.dataSourceSettings.excludeFields[lenE as number]];
            }
            lenE--;
        }
        let keys: string[] = this.fields;
        let dataFields: IFieldOptions[] = extend([], this.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.dataSourceSettings.columns, this.dataSourceSettings.values, this.dataSourceSettings.filters);
        this.getFormattedFields(this.dataSourceSettings);
        this.getCalculatedField(keys);
        keys = this.fields;
        let len: number = keys.length;
        const dataTypes: string[] = ['string', 'number', 'datetime', 'date', 'boolean'];
        if (this.savedFieldList) {
            this.fieldList = this.savedFieldList;
            while (len--) { /** while is used for better performance than for */
                const key: string = keys[len as number];
                const field: IFieldOptions = this.getMappingField(key, this.dataSourceSettings.fieldMapping);
                if (this.fieldList[key as string]) {
                    this.fieldList[key as string].isSelected = false;
                    this.fieldList[key as string].index = len;
                    this.fieldList[key as string].filter = [];
                    this.fieldList[key as string].sort = isSort ? 'Ascending' : 'None';
                    this.fieldList[key as string].isExcelFilter = false;
                    this.fieldList[key as string].filterType = '';
                    this.fieldList[key as string].showFilterIcon = (field && 'showFilterIcon' in field) ?
                        field.showFilterIcon : true;
                    this.fieldList[key as string].showRemoveIcon = (field && 'showRemoveIcon' in field) ?
                        field.showRemoveIcon : true;
                    this.fieldList[key as string].showSortIcon = (field && 'showSortIcon' in field) ?
                        field.showSortIcon : true;
                    this.fieldList[key as string].showEditIcon = (field && 'showEditIcon' in field) ?
                        field.showEditIcon : true;
                    this.fieldList[key as string].showValueTypeIcon = (field && 'showValueTypeIcon' in field) ?
                        field.showValueTypeIcon : true;
                    this.fieldList[key as string].allowDragAndDrop = (field && 'allowDragAndDrop' in field) ?
                        field.allowDragAndDrop : true;
                    this.fieldList[key as string].isCalculatedField = (field && 'isCalculatedField' in field) ?
                        field.isCalculatedField : false;
                    this.fieldList[key as string].showNoDataItems = (field && 'showNoDataItems' in field) ?
                        field.showNoDataItems : false;
                    this.fieldList[key as string].showSubTotals = (field && 'showSubTotals' in field) ?
                        field.showSubTotals : true;
                    this.fieldList[key as string].expandAll = (field && 'expandAll' in field) ?
                        field.expandAll : false;
                    this.fieldList[key as string].pid = (field && 'groupName' in field && field.groupName) ? field.groupName :
                        this.groupingFieldsInfo[key as string] ? this.groupingFieldsInfo[key as string] : undefined;
                    if (this.isValueFiltersAvail && isValueFilteringEnabled) {
                        this.fieldList[key as string].dateMember = [];
                        this.fieldList[key as string].members = {};
                        this.fieldList[key as string].isMembersFilled = false;
                    }
                    this.updateMembersOrder(key);
                } else {
                    if (!isNullOrUndefined(this.groupedDataType[key as string])) {
                        type = this.groupedDataType[key as string];
                    } else {
                        type = (field && 'dataType' in field && field.dataType && dataTypes.indexOf(field.dataType.toLowerCase()) > -1) ?
                            field.dataType.toLowerCase() : type;
                    }
                    this.fieldList[key as string] = {
                        caption: (field && 'caption' in field && field.caption) ? field.caption : key,
                        id: key,
                        type: ((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)) ?
                            'string' : (type === undefined || type === 'undefined') ? 'number' : type,
                        isSelected: false,
                        sort: isSort ? 'Ascending' : 'None',
                        filterType: '',
                        index: len,
                        filter: [],
                        isCustomField: ((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)),
                        showRemoveIcon: (field && 'showRemoveIcon' in field) ?
                            field.showRemoveIcon : true,
                        showFilterIcon: (field && 'showFilterIcon' in field) ?
                            field.showFilterIcon : true,
                        showSortIcon: (field && 'showSortIcon' in field) ?
                            field.showSortIcon : true,
                        showNoDataItems: (field && 'showNoDataItems' in field) ?
                            field.showNoDataItems : false,
                        isCalculatedField: (field && 'isCalculatedField' in field) ?
                            field.isCalculatedField : false,
                        showEditIcon: (field && 'showEditIcon' in field) ?
                            field.showEditIcon : true,
                        showValueTypeIcon: (field && 'showValueTypeIcon' in field) ?
                            field.showValueTypeIcon : true,
                        allowDragAndDrop: (field && 'allowDragAndDrop' in field) ?
                            field.allowDragAndDrop : true,
                        showSubTotals: (field && 'showSubTotals' in field) ?
                            field.showSubTotals : true,
                        expandAll: (field && 'expandAll' in field) ?
                            field.expandAll : false,
                        pid: (field && 'groupName' in field && field.groupName) ? field.groupName :
                            this.groupingFieldsInfo[key as string] ? this.groupingFieldsInfo[key as string] : undefined,
                        aggregateType: (field && 'type' in field) ? field.type :
                            (((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)) ? 'string' :
                                (type === undefined || type === 'undefined') ? 'number' : type) === 'number' ? 'Sum' : 'Count',
                        baseField: (field && 'baseField' in field) ?
                            field.baseField : undefined,
                        baseItem: (field && 'baseItem' in field) ?
                            field.baseItem : undefined
                    };
                    this.updateMembersOrder(key);
                }
            }
        } else {
            this.fieldList = {};
            while (len--) { /** while is used for better performance than for */
                const key: string = keys[len as number];
                const field: IFieldOptions = this.getMappingField(key, this.dataSourceSettings.fieldMapping);
                if (!isNullOrUndefined(this.groupedDataType[key as string])) {
                    type = this.groupedDataType[key as string];
                } else {
                    type = (field && 'dataType' in field && field.dataType && dataTypes.indexOf(field.dataType.toLowerCase()) > -1) ?
                        field.dataType.toLowerCase() : PivotUtil.getType(fields[this.fieldKeys[key as string] as string | number] as Date);
                }
                this.fieldList[key as string] = {
                    id: key,
                    pid: (field && 'groupName' in field && field.groupName) ? field.groupName :
                        this.groupingFieldsInfo[key as string] ? this.groupingFieldsInfo[key as string] : undefined,
                    caption: (field && 'caption' in field && field.caption) ? field.caption : key,
                    type: ((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)) ?
                        'string' : (type === undefined || type === 'undefined') ? 'number' : type,
                    filterType: '',
                    index: len,
                    filter: [],
                    sort: isSort ? 'Ascending' : 'None',
                    isSelected: false,
                    isCustomField: ((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)),
                    showFilterIcon: (field && 'showFilterIcon' in field) ?
                        field.showFilterIcon : true,
                    showRemoveIcon: (field && 'showRemoveIcon' in field) ?
                        field.showRemoveIcon : true,
                    showSortIcon: (field && 'showSortIcon' in field) ?
                        field.showSortIcon : true,
                    showEditIcon: (field && 'showEditIcon' in field) ?
                        field.showEditIcon : true,
                    showValueTypeIcon: (field && 'showValueTypeIcon' in field) ?
                        field.showValueTypeIcon : true,
                    allowDragAndDrop: (field && 'allowDragAndDrop' in field) ?
                        field.allowDragAndDrop : true,
                    showSubTotals: (field && 'showSubTotals' in field) ?
                        field.showSubTotals : true,
                    showNoDataItems: (field && 'showNoDataItems' in field) ?
                        field.showNoDataItems : false,
                    isCalculatedField: (field && 'isCalculatedField' in field) ?
                        field.isCalculatedField : false,
                    expandAll: (field && 'expandAll' in field) ?
                        field.expandAll : false,
                    aggregateType: (field && 'type' in field) ? field.type :
                        (((key.indexOf('_custom_group') !== -1) || (key.indexOf('_date_group') !== -1)) ? 'string' :
                            (type === undefined || type === 'undefined') ? 'number' : type) === 'number' ? 'Sum' : 'Count',
                    baseField: (field && 'baseField' in field) ?
                        field.baseField : undefined,
                    baseItem: (field && 'baseItem' in field) ?
                        field.baseItem : undefined
                };
                this.updateMembersOrder(key);
            }
        }
        this.groupedDataType = {};
        this.updateTreeViewData(dataFields);
    }

    private updateMembersOrder(key: string): void {
        for (const sortInfo of this.dataSourceSettings.sortSettings) {
            if (key === sortInfo.name && sortInfo.membersOrder) {
                this.fieldList[key as string].membersOrder = sortInfo.membersOrder;
                break;
            }
        }
    }
    private getMappingField(key: string, fieldMapping: IFieldOptions[]): IFieldOptions {
        let field: IFieldOptions = {};
        if (fieldMapping && fieldMapping.length > 0) {
            for (let index: number = 0, cnt: number = fieldMapping.length; index < cnt; index++) {
                if (fieldMapping[index as number].name === key) {
                    field = fieldMapping[index as number];
                    break;
                }
            }
        }
        return field;
    }
    private updateFieldList(savedFieldList: IFieldListOptions): void {
        const keys: string[] = this.fields;
        let len: number = keys.length;
        while (len--) { /** while is used for better performance than for */
            this.fieldList[keys[len as number]].isExcelFilter = savedFieldList[keys[len as number]].isExcelFilter;
        }
    }
    private updateTreeViewData(fields: IFieldOptions[]): void {
        let cnt: number = fields.length;
        let lnt: number = this.dataSourceSettings.calculatedFieldSettings.length;
        while (cnt--) {
            if (this.fieldList[fields[cnt as number].name]) {
                const field: IField = this.fieldList[fields[cnt as number].name];
                field.type = fields[cnt as number].dataType ? fields[cnt as number].dataType.toLowerCase() : field.type;
                field.caption = fields[cnt as number].caption ? fields[cnt as number].caption : fields[cnt as number].name;
                field.isSelected = true;
                field.showNoDataItems = fields[cnt as number].showNoDataItems;
                field.aggregateType = fields[cnt as number].type;
                field.baseField = fields[cnt as number].baseField;
                field.baseItem = fields[cnt as number].baseItem;
                field.allowDragAndDrop = fields[cnt as number].allowDragAndDrop;
                field.showFilterIcon = fields[cnt as number].showFilterIcon;
                field.showSortIcon = fields[cnt as number].showSortIcon;
                field.showRemoveIcon = fields[cnt as number].showRemoveIcon;
                field.showValueTypeIcon = fields[cnt as number].showValueTypeIcon;
                field.showEditIcon = fields[cnt as number].showEditIcon;
                field.showSubTotals = fields[cnt as number].showSubTotals;
                field.expandAll = fields[cnt as number].expandAll;
            }
        }
        while (lnt--) {
            if (this.fieldList[this.dataSourceSettings.calculatedFieldSettings[lnt as number].name]) {
                this.fieldList[this.dataSourceSettings.calculatedFieldSettings[lnt as number].name].aggregateType = 'CalculatedField';
                this.fieldList[this.dataSourceSettings.calculatedFieldSettings[lnt as number].name].isCalculatedField = true;
                this.fieldList[this.dataSourceSettings.calculatedFieldSettings[lnt as number].name].formula
                    = this.dataSourceSettings.calculatedFieldSettings[lnt as number].formula;
            }
        }
    }

    private getCalculatedField(keys: string[]): void {
        for (const field of this.dataSourceSettings.calculatedFieldSettings) {
            this.calculatedFields[field.name] = extend({}, field, null, true) as ICalculatedFields;
            this.calculatedFields[field.name].actualFormula = field.formula;
        }
        const fieldKeys: string[] = Object.keys(this.calculatedFields);
        for (let calc: number = 0, cnt: number = fieldKeys.length; calc < cnt; calc++) {
            const field: ICalculatedFields = this.calculatedFields[fieldKeys[calc as number]];
            const calcProperties: ICalculatedFields = (<{ [key: string]: Object }>field).properties as ICalculatedFields;
            const actualFormula: string =
                (calcProperties ? calcProperties.formula : field.formula).trim();
            const formula: string = actualFormula.replace(/"/g, '');
            field.formula = formula.indexOf('^') > -1 ? this.powerFunction(formula) : formula;
            if (field.formula.indexOf('Math.min(') === -1 && field.formula.indexOf('min(') > -1) {
                field.formula = field.formula.replace(/min\(/g, 'Math.min(');
            }
            if (field.formula.indexOf('Math.max(') === -1 && field.formula.indexOf('max(') > -1) {
                field.formula = field.formula.replace(/max\(/g, 'Math.max(');
            }
            if (field.formula.indexOf('Math.abs(') === -1 && field.formula.indexOf('abs(') > -1) {
                field.formula = field.formula.replace(/abs\(/g, 'Math.abs(');
            }
            field.name = calcProperties ? calcProperties.name : field.name;
            if (this.dataSourceSettings.type === 'CSV') {
                if (keys.indexOf(field.name) === -1) {
                    keys.push(field.name);
                }
            } else {
                keys = keys.filter((key: string) => { return key !== field.name; });
                keys.push(field.name);
            }
            const formulaType: string[] = actualFormula.split('"');
            for (let len: number = 0, lmt: number = formulaType.length; len < lmt; len++) {
                const type: string = formulaType[len as number].trim();
                const aggregateValue: string[] = type.split(/[ .:;?!~,`"&|()<>{}[\]\r\n/\\]+/);
                const matchStrings: string[] = type.match(/^([^()]+)\((.*)\)$/);
                const selectedString: string = (aggregateValue[0] === 'DistinctCount' ?
                    'DistinctCount' : aggregateValue[0] === 'PopulationStDev' ?
                        'PopulationStDev' : aggregateValue[0] === 'SampleStDev' ? 'SampleStDev' : aggregateValue[0] === 'PopulationVar' ?
                            'PopulationVar' : aggregateValue[0] === 'SampleVar' ? 'SampleVar' : aggregateValue[0]);
                if (['Sum', 'Count', 'Min', 'Max', 'Avg', 'Product', 'DistinctCount',
                    'PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar', 'Median'].indexOf(selectedString) !== -1) {
                    const index: number = (keys.indexOf(aggregateValue[1]) === -1 && matchStrings[2]) ?
                        keys.indexOf(matchStrings[2]) : keys.indexOf(aggregateValue[1]);
                    if (!this.calculatedFormulas[field.name]) {
                        this.calculatedFormulas[field.name] = [{
                            index: index,
                            type: selectedString,
                            formula: type
                        }];
                    } else {
                        (<Object[]>this.calculatedFormulas[field.name]).push({
                            index: index,
                            type: selectedString,
                            formula: type
                        });
                    }
                }
            }
        }
        this.fields = keys;
    }
    private validateFilters(data: IDataOptions): void {
        this.isValueFiltersAvail = false;
        const filterElements: IFilter[] = data.filterSettings ? data.filterSettings : [];
        let dataFields: IFieldOptions[] = extend([], this.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.dataSourceSettings.columns);
        for (const filter of filterElements) {
            for (const field of dataFields) {
                if (filter.name === field.name && filter.type === 'Value') {
                    this.isValueFiltersAvail = true;
                    break;
                }
            }
            if (this.isValueFiltersAvail) {
                break;
            }
        }
    }
    private validateValueFields(): void {
        this.isValueHasAdvancedAggregate = false;
        for (const value of this.dataSourceSettings.values) {
            if ((['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal', 'RunningTotals']).indexOf(value.type) !== -1) {
                this.isValueHasAdvancedAggregate = true;
                break;
            }
        }
    }
    /**
     * It is used to update the current field members.
     *
     * @param {string} fieldName -  Current field Name.
     * @returns {void}
     * @hidden
     */
    public fetchFieldMembers(fieldName: string): void {
        const fieldPosition: number = this.fieldList[fieldName as string].index;
        this.generateMembers(fieldPosition, new Set<number>());
    }
    private generateMembers(kl: number, formulaFields: Set<number>): void {
        const dlen: number = this.data.length as number;
        const keys: string[] = this.fields;
        const fList: IFieldListOptions = this.fieldList;
        const key: string = keys[kl as number];
        if (!fList[key as string].members || this.allowDataCompression) {
            fList[key as string].members = {};
            if (this.allowDataCompression) {
                fList[key as string].isMembersFilled = false;
            }
        }
        if (!fList[key as string].dateMember || this.allowDataCompression) {
            fList[key as string].dateMember = [];
        }
        const members: IMembers =  fList[key as string].members;
        const dateMember: IAxisSet[] = fList[key as string].dateMember;
        if ((fList[key as string].isSelected || formulaFields.has(kl as number)) && !fList[key as string].isMembersFilled) {
            const isDataAvail: boolean = Object.keys(members).length > 0;
            let membersCnt: number = 0;
            const isFieldHasExpandAll: boolean = fList[key as string].expandAll;
            const isDateType: boolean = PivotUtil.isDateField(key as string, this);
            //let sort: string[] = [];
            for (let dl: number = 0; dl < dlen; dl++) {
                const memberkey: string | number | Date = (this.data as IDataSet[])[dl as number][this.fieldKeys[key as string] as string];
                let mkey: string = memberkey as string;
                mkey = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(mkey) : mkey;
                // if (!isNullOrUndefined(mkey)) {
                if (!isDataAvail) {
                    const formattedValue: IAxisSet = isDateType ? this.getFormattedValue(mkey, key) : ({
                        formattedText: mkey === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(mkey)) :
                            mkey === undefined ? (this.localeObj ? (key in this.groupingFields) ?
                                this.localeObj.getConstant('groupOutOfRange') : this.localeObj.getConstant('undefined') :
                                String(mkey)) : mkey.toString(), actualText: mkey === null ? (this.localeObj ?
                            this.localeObj.getConstant('null') : String(mkey)) : mkey === undefined ? (this.localeObj ?
                            (key in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                                this.localeObj.getConstant('undefined') : String(mkey)) : mkey
                    });
                    if (!Object.prototype.hasOwnProperty.call(members, mkey)) {
                        membersCnt++;
                        members[mkey as string] = {
                            index: [dl as number], ordinal: membersCnt,
                            isDrilled: this.isExpandAll || isFieldHasExpandAll,
                            caption: formattedValue.formattedText
                        };
                        dateMember.push({ formattedText: formattedValue.formattedText, actualText: isDateType ?
                            formattedValue.dateText : formattedValue.actualText });
                        //sort.push(mkey);
                    } else {
                        members[mkey as string].index.push(dl);
                    }
                }
                const memberName: string | number | Date = isNullOrUndefined(memberkey) ? memberkey : fList[key as string].type === 'number' ?
                    (!isNaN(Number(memberkey)) ? Number(memberkey) : undefined) : 1;
                const valueMatrixInfo: ValueMatrixInfo = {
                    ordinal: members[mkey as string].ordinal,
                    member: memberName as number
                };
                if (!(this.valueMatrix[dl as number])) {
                    this.valueMatrix[dl as number] = [];
                }
                this.valueMatrix[dl as number][kl as number] = valueMatrixInfo;
                // }
            }
            fList[key as string].isMembersFilled = true;
        }
    }
    private fillFieldMembers(): void {
        const keys: string[] = this.fields;
        const fList: IFieldListOptions = this.fieldList;
        const kLn: number = keys.length;
        if (this.data.length - this.valueMatrix.length < 0) {
            this.valueMatrix = this.valueMatrix.slice(0, this.data.length);
        }
        const formulaFields: Set<number> = new Set<number>();
        if (this.calculatedFormulas && Object.keys(this.calculatedFormulas).length > 0) {
            for (const key in this.calculatedFormulas) {
                if (fList[key as string] && fList[key as string].isSelected) {
                    const calculatedFormulas: Object[] = <Object[]>this.calculatedFormulas[key as string];
                    for (let i: number = 0; i < calculatedFormulas.length; i++) {
                        const values: { [key: string]: Object } = <{ [key: string]: Object }>calculatedFormulas[i as number];
                        formulaFields.add(<number>values.index);
                    }
                }
            }
        }
        for (let kl: number = 0; kl < kLn; kl++) {
            this.generateMembers(kl, formulaFields);
            /*sort = Object.keys(members).sort();
            let sortedMembers: Members = {};
            for (let sln: number = 0, slt: number = sort.length; sln < slt; sln++) {
                sortedMembers[sort[sln]] = members[sort[sln]];
            }
            fList[key].members = sortedMembers; */
        }
    }
    private generateValueMatrix(): void {
        const keys: string[] = this.fields;
        let len: number = this.data.length;
        const keyLen: number = keys.length;
        const flList: IFieldListOptions = this.fieldList;
        while (len--) {
            let tkln: number = keyLen;
            //if (isNullOrUndefined(vMat[len as number])) {
            //}
            while (tkln--) {
                const key: string = keys[tkln as number];
                const field: IField = flList[key as string];
                if (field.isMembersFilled) {
                    const fieldValue: string | number | Date = (this.data as IDataSet[])[len as number][
                        this.fieldKeys[key as string] as string | number];
                    this.valueMatrix[len as number][tkln as number].member =
                        isNullOrUndefined(fieldValue) ? fieldValue as number : (field.type === 'number' ?
                            (!isNaN(Number(fieldValue)) ? Number(fieldValue) : undefined) : 1);
                }
            }
        }
    }
    private updateSortSettings(sortSettings: ISort[], isSort: boolean): void {
        for (let sln: number = 0, slt: number = sortSettings ? sortSettings.length : 0; sln < slt && isSort; sln++) {
            if (this.fieldList[sortSettings[sln as number].name]) {
                this.fieldList[sortSettings[sln as number].name].sort = sortSettings[sln as number].order;
            }
        }
    }
    private updateFilterMembers(source: IDataOptions): void {
        const filterRw: number[] = this.filterMembers;
        const list: IIterator = {};
        //let eList: {[key: string] : number} = {};
        const isInclude: boolean = this.getFilters(source, list);
        //this.getFilterExcludeList(source.rows, flist);
        //this.getFilterExcludeList(source.columns, flist);
        //this.getFilterExcludeList(source.filters, flist);
        // let filters: Iterator = isInclude ? iList : eList;
        const dln: number = this.valueMatrix.length;
        if (isInclude) {
            const keys: number[] = list.include.index;
            for (let ln: number = 0; ln < keys.length; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[keys[ln as number]] === undefined) {
                    filterRw.push(keys[ln as number]);
                }
            }
        } else {
            for (let ln: number = 0; ln < dln; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[ln as number] === undefined) {
                    filterRw.push(ln);
                }
            }
        }
    }
    private getFilters(source: IDataOptions, ilist: IIterator): boolean {
        const filterElements: IFilter[] = source.filterSettings ? source.filterSettings : [];
        let isInclude: boolean = false;
        let filter: string[] = [];
        for (let rln: number = 0, rlt: number = filterElements.length; rln < rlt; rln++) {
            const filterElement: IFilter = (<{ [key: string]: Object }>filterElements[rln as number]).properties ?
                (<{ [key: string]: Object }>filterElements[rln as number]).properties : filterElements[rln as number];
            if (this.fieldList[filterElement.name] &&
                this.fieldList[filterElement.name].isSelected &&
                this.isValidFilterField(filterElement, source.allowMemberFilter, source.allowLabelFilter)) {
                this.applyLabelFilter(filterElement);
                if (filterElement) {
                    filter = filterElement.items;
                }
                if (filterElement.type && filterElement.type === 'Include') {
                    this.frameFilterList(filter, filterElement.name, ilist, 'include', filterElement.showLabelFilter, isInclude);
                    isInclude = true;
                } else {
                    this.frameFilterList(filter, filterElement.name, ilist, 'exclude', filterElement.showLabelFilter);
                }
                if (filterElement.showLabelFilter) {
                    filterElement.items = [];
                    filterElement.type = filterElement.showDateFilter ? 'Date' : filterElement.showNumberFilter ? 'Number' : 'Label';
                }
            }
        }
        /* for (let cln: number = 0, clt: number = cols.length; cln < clt; cln ++) {
             filter = cols[cln as number].filter ? cols[cln as number].filter.items : [];
             if (filter.length && cols[cln as number].filter.type && cols[cln as number].filter.type === 'include') {
                 //type = cols[cln as number].filter.type;
                 this.frameFilterList(filter, cols[cln as number].name, ilist, 'include', isInclude);
                 isInclude = true;
             } else {
                 this.frameFilterList(filter, cols[cln as number].name, ilist, 'exclude');
             }
         }
         for (let vln: number = 0, vlt: number = filters.length; vln < vlt; vln ++) {
             filter = filters[vln].filter ? filters[vln].filter.items : [];
             if (filter.length && filters[vln].filter.type && filters[vln].filter.type === 'include') {
                 this.frameFilterList(filter, filters[vln].name, ilist, 'include', isInclude);
                 isInclude = true;
             } else {
                 this.frameFilterList(filter, filters[vln].name, ilist, 'exclude');
             }
         } */
        return isInclude;
    }
    private isValidFilterField(filterElement: IFilter, allowMemberFiltering: boolean, allowLabelFiltering: boolean): boolean {
        const fieldName: string = filterElement.name;
        let isValidFilterElement: boolean = false;
        const filterTypes: FilterType[] = ['Include', 'Exclude'];
        let dataFields: IFieldOptions[] = extend([], this.dataSourceSettings.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.dataSourceSettings.columns);
        if (this.fieldList[fieldName as string].isSelected && allowMemberFiltering && filterTypes.indexOf(filterElement.type) >= 0) {
            isValidFilterElement = true;
            for (const field of this.dataSourceSettings.values) {
                if (fieldName === field.name) {
                    isValidFilterElement = false;
                    break;
                }
            }
        } else if (allowLabelFiltering) {
            for (const field of dataFields) {
                if (fieldName === field.name &&
                    ((['Label', 'Date', 'Number'] as FilterType[]).indexOf(filterElement.type) >= 0)) {
                    isValidFilterElement = true;
                    break;
                }
            }
        }
        return isValidFilterElement;
    }
    private applyLabelFilter(filterElement: IFilter): void {
        if ((['Label', 'Date', 'Number'] as FilterType[]).indexOf(filterElement.type) >= 0) {
            const members: string[] = Object.keys(this.fieldList[filterElement.name].members);
            filterElement.showLabelFilter = true;
            if (filterElement.type === 'Label') {
                filterElement.items = this.getLabelFilterMembers(
                    members, filterElement.condition as LabelOperators, filterElement.value1 as string, filterElement.value2 as string);
            } else if (filterElement.type === 'Date') {
                filterElement.showDateFilter = true;
                const date1: Date = typeof (filterElement.value1) === 'string' ?
                    new Date(filterElement.value1) : filterElement.value1;
                const date2: Date = typeof (filterElement.value2) === 'string' ?
                    new Date(filterElement.value2) : filterElement.value2;
                filterElement.items = this.getDateFilterMembers(
                    members, filterElement.name, filterElement.condition as DateOperators, date1, date2
                );
            } else {
                filterElement.showNumberFilter = true;
                filterElement.items = [];
                for (const member of members) {
                    const operand1: number = this.getParsedValue(filterElement.name, filterElement.value1 as string);
                    const operand2: number = this.getParsedValue(filterElement.name, filterElement.value2 as string);
                    const cValue: number = this.getParsedValue(filterElement.name, member as string);
                    if (this.validateFilterValue(cValue, filterElement.condition as ValueOperators, operand1, operand2)) {
                        filterElement.items.push(member as string);
                    }
                }
            }
            const excludeOperators: LabelOperators[] =
                ['DoesNotBeginWith', 'DoesNotContains', 'DoesNotEndsWith', 'DoesNotEquals', 'NotBetween'];
            filterElement.type = (filterElement.condition ? (excludeOperators.indexOf(filterElement.condition as LabelOperators) > -1 &&
                !filterElement.showNumberFilter) ? 'Exclude' : 'Include' : 'Exclude');
        } else {
            filterElement.showLabelFilter = false;
        }
    }
    private getLabelFilterMembers(members: string[], operator: LabelOperators, value1: string, value2?: string): string[] {
        const items: string[] = [];
        for (const member of members) {
            const filterValue: string = member.toLowerCase();
            if (value1.toString()) {
                switch (operator) {
                case 'Equals':
                case 'DoesNotEquals':
                    if (filterValue === value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                case 'BeginWith':
                case 'DoesNotBeginWith':
                    if (filterValue.indexOf(value1.toLowerCase()) === 0) {
                        items.push(member);
                    }
                    break;
                case 'EndsWith':
                case 'DoesNotEndsWith':
                    if (filterValue.match(value1.toLowerCase() + '$') !== null) {
                        items.push(member);
                    }
                    break;
                case 'Contains':
                case 'DoesNotContains':
                    if (filterValue.indexOf(value1.toLowerCase()) > -1) {
                        items.push(member);
                    }
                    break;
                case 'GreaterThan':
                    if (filterValue > value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                case 'GreaterThanOrEqualTo':
                    if (filterValue >= value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                case 'LessThan':
                    if (filterValue < value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                case 'LessThanOrEqualTo':
                    if (filterValue <= value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                case 'Between':
                case 'NotBetween':
                    if ((filterValue >= value1.toLowerCase()) && (filterValue <= value2.toLowerCase())) {
                        items.push(member);
                    }
                    break;
                default:
                    if (filterValue === value1.toLowerCase()) {
                        items.push(member);
                    }
                    break;
                }
            }
        }
        return items;
    }
    private getDateFilterMembers(members: string[], name: string, operator: DateOperators, value1: Date, value2?: Date): string[] {
        const items: string[] = [];
        for (const member of members) {
            const filterValue: Date = new Date(member);
            if (value1) {
                switch (operator) {
                case 'Equals':
                case 'DoesNotEquals':
                    if (this.getFormattedValue(
                        filterValue.toString(), name).formattedText === this.getFormattedValue(value1.toString(), name
                    ).formattedText) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                case 'After':
                    if (filterValue.getTime() > value1.getTime()) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                case 'AfterOrEqualTo':
                    if (filterValue.getTime() >= value1.getTime()) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                case 'Before':
                    if (filterValue.getTime() < value1.getTime()) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                case 'BeforeOrEqualTo':
                    if (filterValue.getTime() <= value1.getTime()) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                case 'Between':
                case 'NotBetween':
                    if ((filterValue.getTime() >= value1.getTime()) &&
                        (filterValue.getTime() <= value2.getTime())) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                default:
                    if (this.getFormattedValue(
                        filterValue.toString(), name).formattedText === this.getFormattedValue(value1.toString(), name
                    ).formattedText) {
                        items.push(this.getFormattedValue(member, name).formattedText);
                    }
                    break;
                }
            }
        }
        return items;
    }
    private validateFilterValue(val: number, operator: ValueOperators, value1: number, value2?: number): boolean {
        let isMemberInclude: boolean = false;
        if (typeof (value1) === 'number') {
            switch (operator) {
            case 'Equals':
                if (val === value1) {
                    isMemberInclude = true;
                }
                break;
            case 'DoesNotEquals':
                if (val !== value1) {
                    isMemberInclude = true;
                }
                break;
            case 'GreaterThan':
                if (val > value1) {
                    isMemberInclude = true;
                }
                break;
            case 'GreaterThanOrEqualTo':
                if (val >= value1) {
                    isMemberInclude = true;
                }
                break;
            case 'LessThan':
                if (val < value1) {
                    isMemberInclude = true;
                }
                break;
            case 'LessThanOrEqualTo':
                if (val <= value1) {
                    isMemberInclude = true;
                }
                break;
            case 'Between':
                if ((val >= value1) && (val <= value2)) {
                    isMemberInclude = true;
                }
                break;
            case 'NotBetween':
                if (!((val >= value1) && (val <= value2))) {
                    isMemberInclude = true;
                }
                break;
            default:
                if (val !== value1) {
                    isMemberInclude = true;
                }
                break;
            }
        }
        return isMemberInclude;
    }
    private frameFilterList(
        filter: string[], name: string, list: IIterator, type: string, isLabelFilter: boolean, isInclude?: boolean): void {
        if (!list[type as string]) {
            list[type as string] = { indexObject: {}, index: [] };
            this.updateFilter(filter, name, list, type, isLabelFilter, isInclude);
        } else {
            this.updateFilter(filter, name, list, type, isLabelFilter, isInclude);
        }
    }
    private updateFilter(filter: string[], name: string, list: IIterator, type: string, isLabelFilter: boolean, isInclude?: boolean): void {
        let fln: number = 0;
        const field: IField = this.fieldList[name as string];
        field.filter = filter;
        field.filterType = type;
        field.isExcelFilter = isLabelFilter;
        const members: IMembers = PivotUtil.getFormattedMembers(field.members, name, this);
        const allowFil: boolean = isInclude;
        const final: IIterator = {};
        const filterObj: IStringIndex = {};
        final[type as string] = { indexObject: {}, index: [] };
        this.fieldFilterMem[name as string] = { memberObj: {} };
        while (!isNullOrUndefined(filter[fln as number])) {
            if (members[filter[fln as number]]) {
                const indx: number[] = members[filter[fln as number]].index;
                if (type === 'include') {
                    for (let iln: number = 0, ilt: number = indx.length; iln < ilt; iln++) {
                        if (!allowFil || list[type as string].indexObject[indx[iln as number]] !== undefined) {
                            final[type as string].indexObject[indx[iln as number]] = indx[iln as number];
                            final[type as string].index.push(indx[iln as number]);
                        }
                    }
                } else {
                    for (let iln: number = 0, ilt: number = indx.length; iln < ilt; iln++) {
                        if (list[type as string].indexObject[indx[iln as number]] === undefined) {
                            list[type as string].indexObject[indx[iln as number]] = indx[iln as number];
                            list[type as string].index.push(indx[iln as number]);
                        }
                    }
                    this.fieldFilterMem[name as string].memberObj[filter[fln as number]] = filter[fln as number];
                }
            }
            fln++;
        }
        if (type === 'include') {
            list[type as string] = final[type as string];
            for (let iln: number = 0; iln < filter.length; iln++) {
                if (members[filter[iln as number]]) {
                    filterObj[filter[iln as number]] = filter[iln as number];
                }
            }
            const items: string[] = Object.keys(members);
            for (let iln: number = 0, ilt: number = items.length; iln < ilt; iln++) {
                if (filterObj[items[iln as number]] === undefined) {
                    this.fieldFilterMem[name as string].memberObj[items[iln as number]] = items[iln as number];
                }
            }
        }
    }
    private applyValueFiltering(
        rowData: IFieldOptions, level: number, rows: IAxisSet[], columns: IAxisSet, valueFilter: IValueFilterSettings,
        rowFilterData: IAxisSet[], type: string): IAxisSet[] {
        this.isValueFiltered = false;
        const allMember: IAxisSet = extend({}, (type === 'row' && this.rowGrandTotal ? this.rowGrandTotal : type === 'column' && this.columnGrandTotal ? this.columnGrandTotal : (!(this.dataSourceSettings.grandTotalsPosition === 'Top') ? rows[rows.length - 1] : rows[0])), null, true);
        this.getFilteredData(rows, columns, valueFilter, rowFilterData, level, rowData.name, allMember, type);
        if (this.isValueFiltered) {
            if ((type === 'row' && this.rowGrandTotal === null) || (type === 'column' && this.columnGrandTotal === null)) {
                rowFilterData.push(allMember);
            }
            rows = rowFilterData;
        }
        return rows;
    }
    private getFilteredData(
        rows: IAxisSet[], columns: IAxisSet, filterSettings: IValueFilterSettings, rowFilterData: IAxisSet[],
        level: number, fieldName: string, allMember: IAxisSet, type: string): void {
        const rLen: number = rows.length;
        for (let i: number = 0; i < rLen; i++) {
            if (filterSettings[fieldName as string]) {
                if (rows[i as number].level === level) {
                    this.isValueFiltered = true;
                    this.fieldList[fieldName as string].isExcelFilter = true;
                    let value: number = 0;
                    const measure: string = filterSettings[fieldName as string].measure;
                    const mPos: number = this.fieldList[measure as string].index;
                    const aggregate: string = this.fieldList[measure as string].aggregateType;
                    this.rawIndexObject = {};
                    value = (type === 'row' ? this.getAggregateValue(rows[i as number].index, columns.indexObject, mPos, aggregate, false) :
                        this.getAggregateValue(columns.index, rows[i as number].indexObject, mPos, aggregate, false));
                    const cellDetails: AggregateEventArgs = {
                        fieldName: measure,
                        row: rows[i as number],
                        column: columns,
                        value: value,
                        cellSets: this.getValueCellInfo ? this.getCellSet(this.rawIndexObject) : [],
                        rowCellType: (rows[i as number].hasChild && rows[i as number].isDrilled ? 'subTotal' : rows[i as number].type === 'grand sum' ? 'grandTotal' : 'value'),
                        columnCellType: (columns.hasChild && columns.isDrilled ? 'subTotal' : columns.type === 'grand sum' ? 'grandTotal' : 'value'),
                        aggregateType: aggregate as SummaryTypes,
                        skipFormatting: false
                    };
                    if (this.getValueCellInfo) {
                        this.getValueCellInfo(cellDetails);
                    }
                    value = cellDetails.value;
                    this.rawIndexObject = {};
                    const operand1: number = this.getParsedValue(measure, filterSettings[fieldName as string].value1 as string);
                    const operand2: number = this.getParsedValue(measure, filterSettings[fieldName as string].value2 as string);
                    if (!this.validateFilterValue(value, filterSettings[fieldName as string].condition as ValueOperators, operand1, operand2) && rows[i as number].type !== 'grand sum') {
                        const data: IAxisSet = this.removefilteredData(rows[i as number], this.valueFilteredData);
                        const row: IAxisSet = data ? data : rows[i as number];
                        this.validateFilteredParentData(row, this.valueFilteredData, allMember, 0, level, type);
                    } else if (rows[i as number].type !== 'grand sum') {
                        rowFilterData.push(extend({}, rows[i as number], null, true));
                        rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    }
                } else if (rows[i as number].hasChild && rows[i as number].members.length > 0 && rows[i as number].type !== 'grand sum') {
                    rowFilterData.push(extend({}, rows[i as number], null, true));
                    rowFilterData[rowFilterData.length - 1].members = [];
                    rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    this.getFilteredData(
                        rows[i as number].members, columns, filterSettings,
                        rowFilterData[rowFilterData.length - 1].members, level, fieldName, allMember, type);
                }
            }
        }
    }
    private getParsedValue(measure: string, value: string): number {
        const cValue: string = value ? value.toString() : '';
        if (this.formatFields[measure as string] && value) {
            const formatSetting: IFormatSettings = extend({}, this.formatFields[measure as string], null, true) as IFormatSettings;
            delete formatSetting.name;
            return this.globalize.parseNumber(cValue, formatSetting);
        } else {
            return this.globalize.parseNumber(cValue, { format: 'N' });
        }
    }
    private removefilteredData(row: IAxisSet, rowFilterData: IAxisSet[]): IAxisSet {
        const rows: IAxisSet[] = extend([], rowFilterData, null, true) as IAxisSet[];
        let filteredData: IAxisSet;
        for (let i: number = 0; i < rows.length; i++) {
            if (row.isLevelFiltered && row.axis === rows[i as number].axis &&
                row.valueSort.levelName === rows[i as number].valueSort.levelName &&
                row.actualText === rows[i as number].actualText && row.axis === rows[i as number].axis &&
                row.level === rows[i as number].level && row.ordinal === rows[i as number].ordinal) {
                filteredData = rows[i as number];
                rowFilterData.splice(i, 1);
                break;
            } else if (rowFilterData[i as number].hasChild && rowFilterData[i as number].members.length > 0) {
                this.removefilteredData(row, rowFilterData[i as number].members);
            }
        }
        return filteredData;
    }
    private validateFilteredParentData(
        row: IAxisSet, rows: IAxisSet[], allMemberData: IAxisSet, i: number, level: number, type: string): void {
        if (rows.length > 0) {
            for (const rowFilteredData of rows) {
                if (rowFilteredData.level === i) {
                    if (type === 'row') {
                        const index: number[] = row.index;
                        for (const key of index) {
                            if (allMemberData.index.indexOf(key) >= 0) {
                                allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                            }
                            if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                rowFilteredData.level !== level && rowFilteredData.index.indexOf(key) >= 0) {
                                rowFilteredData.index.splice(rowFilteredData.index.indexOf(key), 1);
                            }
                        }
                    } else {
                        const index: INumberIndex = row.indexObject;
                        for (const key of Object.keys(index)) {
                            if (Object.prototype.hasOwnProperty.call(index, key)) {
                                delete (<{ [key: string]: Object }>allMemberData.indexObject)[key as string];
                                if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                    rowFilteredData.level !== level) {
                                    delete (<{ [key: string]: Object }>rowFilteredData.indexObject)[key as string];
                                }
                            }
                        }
                    }
                    if (rowFilteredData && rowFilteredData.members.length > 0 &&
                        rowFilteredData.members[0].level === i + 1 && rowFilteredData.members[0].level !== level) {
                        this.validateFilteredParentData(row, rowFilteredData.members, allMemberData, i + 1, level, type);
                    }
                }
            }
        } else {
            if (type === 'row') {
                const index: number[] = row.index;
                for (const key of index) {
                    if (allMemberData.index.indexOf(key) >= 0) {
                        allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                    }
                }
            } else {
                const index: INumberIndex = row.indexObject;
                for (const key of Object.keys(index)) {
                    if (Object.prototype.hasOwnProperty.call(index, key)) {
                        delete (<{ [key: string]: Object }>allMemberData.indexObject)[key as string];
                    }
                }
            }
        }
    }
    private updateFramedHeaders(
        framedHeaders: IAxisSet[], dataHeaders: IAxisSet[], filteredHeaders: IAxisSet[],
        headers: IAxisSet[], type: string): IAxisSet[] {
        for (const dHeader of framedHeaders) {
            this.isHeaderAvail = false;
            if (this.validateFilteredHeaders(dHeader, filteredHeaders, type) || dHeader.type === 'grand sum') {
                if (type === 'row') {
                    this.rowCount += this.rowValuesLength;
                } else {
                    this.columnCount += this.colValuesLength;
                }
                headers.push(extend({}, dHeader, null, true));
                headers[headers.length - 1].members = [];
                if (dHeader.hasChild && dHeader.isDrilled && dHeader.members.length > 0) {
                    this.updateFramedHeaders(dHeader.members, dataHeaders, filteredHeaders, headers[headers.length - 1].members, type);
                }
            }
        }
        return this.filterFramedHeaders;
    }
    private validateFilteredHeaders(dHeader: IAxisSet, filteredHeaders: IAxisSet[], type: string): boolean {
        for (const vHeader of filteredHeaders) {
            if (!this.isHeaderAvail) {
                if (dHeader.actualText === vHeader.actualText &&
                    dHeader.level === vHeader.level &&
                    dHeader.valueSort.levelName === vHeader.valueSort.levelName) {
                    if (type === 'row') {
                        if (vHeader.index.length > 0) {
                            this.isHeaderAvail = true;
                            dHeader.index = vHeader.index;
                            return true;
                        } else {
                            this.isHeaderAvail = false;
                            dHeader.index = vHeader.index;
                            return false;
                        }
                    } else {
                        if (Object.keys(vHeader.indexObject).length > 0) {
                            this.isHeaderAvail = true;
                            dHeader.indexObject = vHeader.indexObject;
                            return true;
                        } else {
                            this.isHeaderAvail = false;
                            dHeader.indexObject = vHeader.indexObject;
                            return false;
                        }
                    }
                } else if (vHeader.hasChild && vHeader.members.length > 0 && vHeader.type !== 'grand sum') {
                    this.validateFilteredHeaders(dHeader, vHeader.members, type);
                }
            }
        }
        return this.isHeaderAvail;
    }
    private isEmptyDataAvail(rowHeaders: IAxisSet[], columnHeaders: IAxisSet[]): void {
        this.isEmptyData = false;
        if (rowHeaders.length > 0 && rowHeaders[rowHeaders.length - 1].type === 'grand sum' &&
            rowHeaders[rowHeaders.length - 1].index.length === 0) {
            this.isEmptyData = true;
        }
        if (columnHeaders.length > 0 && columnHeaders[columnHeaders.length - 1].type === 'grand sum' &&
            Object.keys(columnHeaders[columnHeaders.length - 1].indexObject).length === 0) {
            this.isEmptyData = true;
        }
        if (rowHeaders.length === 0 || columnHeaders.length === 0) {
            this.isEmptyData = true;
        }
    }
    /**
     * It is used to update the grid data.
     *
     * @param {IDataOptions} dataSource -  It contains the dataSourceSettings.
     * @returns {void}
     * @hidden
     */
    public updateGridData(dataSource: IDataOptions): void {
        this.updateDataSourceSettings(dataSource, true);
        this.data = dataSource.dataSource as IDataSet[];
        if (this.allowDataCompression) {
            this.actualData = this.data;
            this.data = this.getGroupedRawData(dataSource);
        }
        for (const field of this.fields) {
            this.fieldList[field as string].members = {};
            this.fieldList[field as string].dateMember = [];
            this.fieldList[field as string].isMembersFilled = false;
        }
        this.fillFieldMembers();
        this.filterMembers = [];
        this.cMembers = [];
        this.rMembers = [];
        this.updateFilterMembers(dataSource);
        this.isEditing = true;
        this.isDrillThrough = true;
        this.generateGridData(dataSource);
        this.isEditing = false;
    }
    public generateGridData(
        dataSource: IDataOptions, requireDatasourceUpdate: boolean = false, isExport?: boolean, headerCollection?: HeaderCollection
    ): void {
        this.updateDataSourceSettings(dataSource, requireDatasourceUpdate);
        const columns: IFieldOptions[] = dataSource.columns ? dataSource.columns : [];
        const data: IDataSet[] = this.data as IDataSet[];
        const rows: IFieldOptions[] = dataSource.rows ? dataSource.rows : [];
        const filterSettings: IFilter[] = dataSource.filterSettings;
        const values: IFieldOptions[] = dataSource.values ? dataSource.values : [];
        this.removeCount = 0;
        this.isExpandAll = dataSource.expandAll;
        this.drilledMembers = dataSource.drilledMembers ? dataSource.drilledMembers : [];
        this.isEmptyData = false;
        const filterMembers: number[] = [];
        const showNoDataItems: boolean = (rows[0] && rows[0].showNoDataItems) || (columns[0] && columns[0].showNoDataItems);
        // let dataFields: IFieldOptions[] = extend([], this.dataSourceSettings.rows, null, true) as IFieldOptions[];
        // dataFields = dataFields.concat(this.dataSourceSettings.columns, this.dataSourceSettings.values, this.dataSourceSettings.filters);
        if (showNoDataItems) {
            for (let ln: number = 0; ln < this.valueMatrix.length; ln++) {
                filterMembers.push(ln);
            }
        }
        for (let ln: number = 0; ln < this.filterMembers.length; ln++) {
            this.filterPosObj[this.filterMembers[ln as number]] = this.filterMembers[ln as number];
        }
        //let childrens: Field = this.fieldList[rows[0].name + ''];
        this.valueSortSettings.columnIndex = undefined;
        this.validateValueFields();
        this.frameDrillObject();
        if (!this.isValueFilterEnabled || this.isEditing) {
            if (!headerCollection) {
                this.isLastHeaderHasMeasures = true;
                this.columnCount = 0; this.rowCount = 0; this.cMembers = []; this.rMembers = [];
                if (rows.length !== 0 && values.length !== 0) {
                    this.rMembers = this.getIndexedHeaders(
                        rows, data, 0, rows[0].showNoDataItems ? filterMembers : this.filterMembers, 'row', '', this.allowValueFilter
                    );
                }
                if (columns.length !== 0 && values.length !== 0) {
                    this.cMembers = this.getIndexedHeaders(
                        columns, data, 0, columns[0].showNoDataItems ? filterMembers : this.filterMembers, 'column', '', this.allowValueFilter
                    );
                }
                this.insertAllMembersCommon();
                this.saveDataHeaders = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? {
                    rowHeaders: extend([], this.rMembers, null, true) as IAxisSet[],
                    columnHeaders: extend([], this.cMembers, null, true) as IAxisSet[]
                } : {};
            }
        }
        this.pivotValues = []; this.headerContent = [];
        this.valueContent = []; this.valueFilteredData = []; this.filterFramedHeaders = []; const rowheads: IAxisSet[] = [];
        const colheads: IAxisSet[] = []; let rowFilteredData: IAxisSet[] = []; let columnFilteredData: IAxisSet[] = [];
        const updatedRowMembers: IAxisSet[] = [];
        const valuesCount: number = (this.dataSourceSettings.values.length);
        if (this.isValueFiltersAvail && dataSource.allowValueFilter && !headerCollection) {
            this.valueFilteredData = [];
            let rowHeaders: IAxisSet[] = this.saveDataHeaders.rowHeaders ? this.saveDataHeaders.rowHeaders : [];
            let columnHeaders: IAxisSet[] = this.saveDataHeaders.columnHeaders ? this.saveDataHeaders.columnHeaders : [];
            if (filterSettings.length > 0) {
                const valueFilters: IValueFilterSettings = {};
                const valueFields: IValueFields = {};
                for (const value of values) { valueFields[value.name] = value; }
                for (const filter of filterSettings) {
                    rowHeaders = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
                    columnHeaders = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
                    this.valueFilteredData = [];
                    const filterElement: IFilter = (<{ [key: string]: Object }>filter).properties ?
                        (<{ [key: string]: Object }>filter).properties : filter;
                    if (filterElement.type === 'Value' && this.fieldList[filter.name] && this.fieldList[filter.name].isSelected) {
                        valueFilters[filter.name] = filter;
                        filterElement.items = [];
                        let isAvail: boolean = false;
                        const rLen: number = rows.length;
                        const cLen: number = columns.length;
                        for (let i: number = 0; i < rLen; i++) {
                            if (filterElement.name === rows[i as number].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                rowFilteredData = this.applyValueFiltering(rows[i as number], i, rowHeaders, (this.columnGrandTotal ? this.columnGrandTotal : (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals) ? columnHeaders[0] : columnHeaders[columnHeaders.length - 1]), valueFilters, this.valueFilteredData, 'row');
                                break;
                            }
                        }
                        for (let j: number = 0; j < cLen; j++) {
                            if (filterElement.name === columns[j as number].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                columnFilteredData = this.applyValueFiltering(columns[j as number], j, columnHeaders, (this.rowGrandTotal ? this.rowGrandTotal : (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals) ? rowHeaders[0] : rowHeaders[rowHeaders.length - 1]), valueFilters, this.valueFilteredData, 'column');
                                break;
                            }
                        }
                    }
                }
            }
            rowFilteredData = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
            columnFilteredData = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
            this.isEmptyDataAvail(rowFilteredData, columnFilteredData);
            const savedFieldList: IFieldListOptions = PivotUtil.getClonedFieldList(this.fieldList);
            const fields: IDataSet = (this.data as IDataSet[])[0];
            this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
            this.fillFieldMembers();
            this.updateSortSettings(dataSource.sortSettings, this.enableSort);
            this.filterMembers = []; this.updateFilterMembers(dataSource);
            this.isLastHeaderHasMeasures = true;
            this.rMembers = rows.length !== 0 ?
                this.getIndexedHeaders(rows, data, 0, rows[0].showNoDataItems ?
                    filterMembers : this.filterMembers, 'row', '') : [];
            this.cMembers = columns.length !== 0 ?
                this.getIndexedHeaders(columns, data, 0, columns[0].showNoDataItems ?
                    filterMembers : this.filterMembers, 'column', '') : [];
            this.insertAllMembersCommon();
            this.updateFieldList(savedFieldList);
            this.rowCount = 0; this.columnCount = 0;
            this.rMembers = this.updateFramedHeaders(this.rMembers, this.rMembers, rowFilteredData, this.filterFramedHeaders, 'row');
            this.filterFramedHeaders = [];
            this.cMembers = this.updateFramedHeaders(this.cMembers, this.cMembers, columnFilteredData, this.filterFramedHeaders, 'column');
            this.isValueFilterEnabled = true;
        }
        if (!headerCollection) {
            this.applyValueSorting();
        }
        if (this.isPagingOrVirtualizationEnabled) {
            if (!headerCollection) {
                this.headerCollection.rowHeaders = this.rMembers;
                this.headerCollection.columnHeaders = this.cMembers;
                this.headerCollection.rowHeadersCount = this.rowCount; this.headerCollection.columnHeadersCount = this.columnCount;
            } else {
                this.rMembers = headerCollection.rowHeaders; this.cMembers = headerCollection.columnHeaders;
                this.rowCount = headerCollection.rowHeadersCount; this.columnCount = headerCollection.columnHeadersCount;
            }
            this.calculatePagingValues();
        }
        if (!this.valueAxis && this.isLastHeaderHasMeasures) {
            this.getAggregatedHeaders(rows, columns, this.rMembers, this.cMembers, values);
        }
        this.getHeaderData(
            rows, columns, values, updatedRowMembers, this.cMembers, colheads, this.pivotValues, 0, this.valueAxis ? 1 : valuesCount);
        this.insertSubTotals();
        this.getTableData(
            (updatedRowMembers.length > 0 ? updatedRowMembers : this.rMembers), rowheads, colheads, 0,
            this.pivotValues, valuesCount, 0, (this.rowGrandTotal ? this.rowGrandTotal :
                this.rMembers[this.rMembers.length - 1]), (this.columnGrandTotal ? this.columnGrandTotal :
                this.cMembers[this.cMembers.length - 1]));
        this.applyAdvancedAggregate(rowheads, colheads, this.pivotValues);
        this.isEngineUpdated = true;
        this.isEmptyDataAvail(this.rMembers, this.cMembers);
        //  console.log(st1 - st2);
        this.clearProperties(isExport);
    }
    private updateHeaders(rowFlag?: boolean, columnFlag?: boolean): void {
        /* removing the row grant-total members */
        rowFlag = (isNullOrUndefined(rowFlag) ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) ?
            true : (this.dataSourceSettings.rows.length > 0) ? false : true : rowFlag);
        if (((this.pageSettings && (this.removeRowGrandTotal)) || (!rowFlag && !this.rowGrandTotal)) &&
            this.rMembers[this.rMembers.length - 1].type === 'grand sum') {
            this.rMembers = this.rMembers.slice(0, this.rMembers.length - 1);
        }
        /* removing the column gran-total members */
        columnFlag = (isNullOrUndefined(columnFlag) ? (this.dataSourceSettings.showGrandTotals &&
            this.dataSourceSettings.showColumnGrandTotals) ? true : (this.dataSourceSettings.columns.length > 0) ? false : true :
            columnFlag);
        if (((this.pageSettings && (this.removeColumnGrandTotal)) || (!columnFlag && !this.columnGrandTotal)) &&
            this.cMembers[this.cMembers.length - 1].type === 'grand sum') {
            this.cMembers = this.cMembers.slice(0, this.cMembers.length - 1);
        }
    }
    private updatePivotValues(updateHeaders?: boolean): void {
        const rowFlag: boolean = (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) ?
            true : (this.dataSourceSettings.rows.length > 0) ? false : true;
        const columnFlag: boolean = (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) ?
            true : (this.dataSourceSettings.columns.length > 0) ? false : true;
        if (updateHeaders) {
            this.updateHeaders(rowFlag, columnFlag);
        }
        /* removing the row grant-totals */
        if (((this.pageSettings && (this.removeRowGrandTotal)) ||
            (!rowFlag && !this.rowGrandTotal)) && this.valueContent.length > 0) {
            let slicePos: number = 1;
            if (this.valueAxis && this.dataSourceSettings.values.length > 0) {
                slicePos = 1 + this.dataSourceSettings.values.length;
            }
            if (this.pivotValues[this.pivotValues.length - slicePos] &&
                (this.pivotValues[this.pivotValues.length - slicePos][0] as IAxisSet).type === 'grand sum') {
                this.pivotValues = (this.pivotValues as []).slice(0, this.pivotValues.length - slicePos);
                this.valueContent = (this.valueContent as []).slice(0, this.valueContent.length - slicePos);
            }
        }
        /* removing the column gran-totals */
        if (((this.pageSettings && (this.removeColumnGrandTotal)) ||
            (!columnFlag && !this.columnGrandTotal)) && this.headerContent.length > 0) {
            let slicePos: number = this.dataSourceSettings.values.length;
            if (this.valueAxis && this.dataSourceSettings.values.length > 0) {
                slicePos = 1;
            }
            if (this.pivotValues[0][this.pivotValues[0].length - slicePos] &&
                (this.pivotValues[0][this.pivotValues[0].length - slicePos] as IAxisSet).type === 'grand sum') {
                for (let ln: number = 0; ln < this.pivotValues.length; ln++) {
                    if (this.pivotValues[ln as number]) {
                        this.pivotValues[ln as number] =
                            (this.pivotValues[ln as number] as []).slice(0, this.pivotValues[ln as number].length - slicePos);
                    }
                    if (this.headerContent[ln as number]) {
                        for (let pos: number = this.pivotValues[ln as number].length;
                            pos < (this.pivotValues[ln as number].length + slicePos); pos++) {
                            delete this.headerContent[ln as number][pos as number];
                        }
                    }
                }
            }
        }
        this.removeRowGrandTotal = this.removeColumnGrandTotal = false;
    }
    /**
     * It performs the updateing Engine by the drilled item.
     *
     * @param {IDrilledItem} drilledItem -  It cotains the drilled items.
     * @returns {void}
     * @hidden
     */
    public onDrill(drilledItem: IDrilledItem): void {
        this.frameDrillObject(drilledItem);
        const headersInfo: IHeadersInfo = this.getHeadersInfo(drilledItem.fieldName, drilledItem.axis);
        this.performDrillOperation(headersInfo.headers, drilledItem, headersInfo.fields, headersInfo.position, 0);
        this.headerCollection.rowHeadersCount = this.rowCount; this.headerCollection.columnHeadersCount = this.columnCount;
        if (headersInfo.axis === 'row') {
            this.headerCollection.rowHeaders = headersInfo.headers;
        } else {
            this.headerCollection.columnHeaders = headersInfo.headers;
        }
        this.updateEngine();
    }
    /**
     * It performs to update the engine by sorting data.
     *
     * @param {ISort} sortItem - It cotains the drilled item data.
     * @returns {void}
     * @hidden
     */
    public onSort(sortItem: ISort): void {
        const headersInfo: IHeadersInfo = this.getHeadersInfo(sortItem.name, '');
        this.fieldList[sortItem.name].sort = sortItem.order;
        this.performSortOperation(headersInfo.headers, sortItem, headersInfo, 0);
        this.updateEngine();
    }
    /**
     * It performs to update the engine by filtering data.
     *
     * @param {IFilter} filterItem - It contains the value of filter Item.
     * @param {IDataOptions} dataSource - It contains dataSource.
     * @returns {void}
     * @hidden
     */
    public onFilter(filterItem: IFilter, dataSource: IDataOptions): void {
        this.updateDataSourceSettings(dataSource, true);
        const headersInfo: IHeadersInfo = this.getHeadersInfo(filterItem.name, '');
        this.isLastHeaderHasMeasures = (this.valueAxis && headersInfo.axis === 'row') ||
            (!this.valueAxis && headersInfo.axis === 'column') ? true : this.isLastHeaderHasMeasures;
        if (filterItem.type === 'Include' && filterItem.items.length === this.fieldList[filterItem.name].dateMember.length) {
            this.fieldList[filterItem.name].filter = [];
            this.fieldList[filterItem.name].filterType = '';
        } else {
            this.fieldList[filterItem.name].filter = filterItem.items;
            this.fieldList[filterItem.name].filterType = filterItem.type;
        }
        const posObj: { [key: number]: number } = {};
        for (const pos of this.filterMembers) {
            posObj[pos as number] = pos;
        }
        this.filterMembers = [];
        this.fieldFilterMem = {};
        this.updateFilterMembers(dataSource);
        let addPos: number[] = this.filterMembers.filter((pos: number) => { return posObj[pos as number] === undefined; });
        const itemsObj: { [key: string]: string } = {};
        for (const item of filterItem.items) {
            itemsObj[item as string] = item;
        }
        let showNoDataItems: boolean = (this.dataSourceSettings.rows[0] && this.dataSourceSettings.rows[0].showNoDataItems) || (
            this.dataSourceSettings.columns[0] && this.dataSourceSettings.columns[0].showNoDataItems);
        if (showNoDataItems && this.columnKeys[filterItem.name]) {
            showNoDataItems = (this.dataSourceSettings.columns[0] && this.dataSourceSettings.columns[0].showNoDataItems) ? true : false;
        } else if (showNoDataItems && headersInfo.axis === 'row') {
            showNoDataItems = (this.dataSourceSettings.rows[0] && this.dataSourceSettings.rows[0].showNoDataItems) ? true : false;
        }
        if (showNoDataItems) {
            const filterMembers: number[] = [];
            this.filterPosObj = {};
            for (let ln: number = 0; ln < addPos.length; ln++) {
                this.filterPosObj[addPos[ln as number]] = addPos[ln as number];
            }
            for (let ln: number = 0; ln < this.valueMatrix.length; ln++) {
                filterMembers.push(ln);
            }
            addPos = filterMembers;
        }
        this.performFilterCommonUpdate(filterItem, headersInfo, addPos);
        this.frameHeaderObjectsCollection = false;
        this.headerObjectsCollection = {};
        this.updateEngine();
    }
    /**
     * It performs to update the engine by the aggregation.
     *
     * @param {IFieldOptions} field -  It cotains the field data.
     * @returns {void}
     * @hidden
     */
    public onAggregation(field: IFieldOptions): void {
        this.fieldList[field.name].aggregateType = field.type;
        this.rMembers = this.headerCollection.rowHeaders;
        this.cMembers = this.headerCollection.columnHeaders;
        if (this.allowDataCompression) {
            this.data = this.getGroupedRawData(this.dataSourceSettings);
            this.generateValueMatrix();
        }
        this.updateEngine();
    }
    /**
     * It performs to update the engine by the calculated field operation.
     *
     * @param {ICalculatedFields} field -  It cotains the Calculated Fields.
     * @param {IDataOptions} dataSourceSettings -  It cotains the dataSourceSettings.
     * @returns {void}
     * @hidden
     */
    public onCalcOperation(field: ICalculatedFields, dataSourceSettings: IDataOptions): void {
        this.dataSourceSettings.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ?
            dataSourceSettings.calculatedFieldSettings : [];
        this.dataSourceSettings.values = dataSourceSettings.values ? dataSourceSettings.values : [];
        this.rMembers = this.headerCollection.rowHeaders;
        this.cMembers = this.headerCollection.columnHeaders;
        this.getCalculatedField(this.fields);
        if (this.fieldList[field.name]) {
            this.fieldList[field.name].formula = field.formula;
        } else {
            this.fieldList[field.name] = {
                id: field.name,
                caption: field.name,
                type: 'number',
                aggregateType: 'CalculatedField',
                filterType: '',
                index: this.fields.length - 1,
                filter: [],
                sort: this.enableSort ? 'Ascending' : 'None',
                isSelected: true,
                isExcelFilter: false,
                formula: field.formula
            };
            if (this.valueAxis === 1) {
                this.headerCollection.rowHeadersCount = this.rowCount = (
                    this.rowCount / (this.dataSourceSettings.values.length - 1)) * this.dataSourceSettings.values.length;
            } else {
                this.headerCollection.columnHeadersCount = this.columnCount = (
                    this.columnCount / (this.dataSourceSettings.values.length - 1)) * this.dataSourceSettings.values.length;
            }
        }
        this.getFormattedFields(dataSourceSettings);
        this.fillFieldMembers();
        this.updateEngine();
    }
    private performDrillOperation(
        headers: IAxisSet[], drilledItem: IDrilledItem, fields: IFieldOptions[], position: number, currentPosition: number): IAxisSet[] {
        let count: number = 0;
        while (count < headers.length) {
            if (position === currentPosition) {
                const levelName: string[] =
                    (headers[count as number].valueSort.levelName as string).split(this.valueSortSettings.headerDelimiter);
                if (drilledItem.memberName === levelName.join(drilledItem.delimiter ? drilledItem.delimiter : '**')) {
                    if (drilledItem.action === 'down') {
                        headers[count as number].isDrilled = true;
                        headers[count as number].members = this.getIndexedHeaders(
                            fields, this.data, position + 1, headers[count as number].index, drilledItem.axis, drilledItem.memberName.
                                split(drilledItem.delimiter ? drilledItem.delimiter : '**').join(this.valueSortSettings.headerDelimiter));
                        let sortedHeaders: ISortedHeaders;
                        if (drilledItem.axis === 'row') {
                            sortedHeaders = this.applyValueSorting(headers[count as number].members, this.cMembers);
                            headers[count as number].members = sortedHeaders.rMembers;
                            this.rowCount += (this.showSubTotalsAtBottom ? 1 : 0);
                        } else {
                            const showSubTotals: boolean = this.dataSourceSettings.showSubTotals &&
                                this.dataSourceSettings.showColumnSubTotals && fields[position as number].showSubTotals;
                            this.columnCount -= !showSubTotals ? this.colValuesLength : 0;
                            sortedHeaders = this.applyValueSorting(this.rMembers, headers[count as number].members);
                            headers[count as number].members = sortedHeaders.cMembers;
                        }
                    } else {
                        headers[count as number].isDrilled = false;
                        this.updateHeadersCount(headers[count as number].members, drilledItem.axis, position, fields, 'minus', true);
                        headers[count as number].members = [];
                        if (drilledItem.axis === 'row') {
                            this.rowCount -= (this.showSubTotalsAtBottom ? 1 : 0);
                        }
                    }
                    break;
                }
            } else if (headers[count as number].members.length > 0) {
                headers[count as number].members = this.performDrillOperation(
                    headers[count as number].members, drilledItem, fields, position, currentPosition + 1);
            }
            count++;
        }
        return headers;
    }
    private performSortOperation(headers: IAxisSet[], sortItem: ISort, headersInfo: IHeadersInfo, currentPosition: number): IAxisSet[] {
        let count: number = 0;
        while (count < headers.length) {
            if (headersInfo.position === currentPosition) {
                headers = this.getSortedHeaders(headers, sortItem.order.toString());
                break;
            } else if (headers[count as number].members.length > 0) {
                headers[count as number].members =
                    this.performSortOperation(headers[count as number].members, sortItem, headersInfo, currentPosition + 1);
            }
            count++;
        }
        return headers;
    }
    private performFilterDeletion(
        headers: IAxisSet[], filterItem: IFilter,
        headersInfo: IHeadersInfo, filterObjects: INumberIndex, currentPosition: number): IAxisSet[] {
        let count: number = 0;
        let loopIn: boolean = true;
        while (count < headers.length && loopIn) {
            if (headersInfo.position === currentPosition) {
                const engine: PivotEngine = this as PivotEngine;
                headers = headers.filter((item: IAxisSet) => {
                    return engine.fieldFilterMem[filterItem.name].memberObj[item.formattedText] === '' ? false :
                        !engine.fieldFilterMem[filterItem.name].memberObj[item.formattedText] || item.type === 'grand sum';
                });
                loopIn = false;
            } else if (headers[count as number].members.length > 0) {
                headers[count as number].members = this.performFilterDeletion(
                    headers[count as number].members, filterItem, headersInfo, filterObjects, currentPosition + 1);
            }
            count++;
        }
        const engine: PivotEngine = this as PivotEngine;
        return headers.filter((item: IAxisSet) => {
            return (item.members.length > 0 || item.type === 'grand sum') ? true : engine.matchIndexes(item.indexObject, filterObjects);
        });
    }
    private matchIndexes(index: INumberIndex, filterObjects: INumberIndex): boolean {
        const keys: string[] = Object.keys(index);
        let len: number = keys.length;
        if (len === 0) {
            return true;
        }
        while (len > -1) {
            if (filterObjects[index[keys[len as number]]] !== undefined) {
                return true;
            }
            len--;
        }
        return false;
    }
    private performFilterAddition(headers: IAxisSet[], fields: IFieldOptions[], headersInfo: IHeadersInfo): IAxisSet[] {
        let count: number = 0;
        while (count < headers.length) {
            const levelName: string = headers[count as number].valueSort.levelName as string;
            if (this.headerObjectsCollection[levelName as string]) {
                const memberNameObj: { [key: string]: string } = {};
                for (const member of headers[count as number].members) {
                    memberNameObj[member.valueSort.levelName.toString()] = member.valueSort.levelName.toString();
                }
                const excessHeaders: IAxisSet[] = this.headerObjectsCollection[levelName as string].filter((member: IAxisSet) => {
                    return !memberNameObj[member.valueSort.levelName.toString()];
                });
                headers[count as number].members = headers[count as number].members.concat(excessHeaders);
                headers[count as number].members = this.getSortedHeaders(
                    headers[count as number].members,
                    this.fieldList[headersInfo.fields[headers[count as number].members[0].level].name].sort);
                delete this.headerObjectsCollection[levelName as string];
            }
            if (headers[count as number].members.length > 0) {
                headers[count as number].members = this.performFilterAddition(headers[count as number].members, fields, headersInfo);
            }
            count++;
        }
        return headers;
    }
    private performFilterCommonUpdate(filterItem: IFilter, headersInfo: IHeadersInfo, addPos: number[]): void {
        if (headersInfo.axis === 'row' || headersInfo.axis === 'column') {
            let rawHeaders: IAxisSet[] = headersInfo.axis === 'row' ? this.rMembers : this.cMembers;
            const filterObjects: INumberIndex = {};
            for (const item of this.filterMembers) {
                filterObjects[item as number] = item;
            }
            if (this.fieldFilterMem[filterItem.name]) {
                rawHeaders = this.performFilterDeletion(headersInfo.headers, filterItem, headersInfo, filterObjects, 0);
            }
            if (addPos.length > 0 && headersInfo.fields.length > 0) {
                this.frameHeaderObjectsCollection = true;
                if (headersInfo.fields.filter((item: IFieldOptions) => { return item.showNoDataItems; }).length > 0) {
                    for (let i: number = 0; i < this.data.length; i++) {
                        addPos.push(i);
                    }
                }
                this.headerObjectsCollection['parent'] = this.getIndexedHeaders(headersInfo.fields, this.data, 0, addPos, headersInfo.axis, '');
                rawHeaders = this.performFilterAddition(rawHeaders, headersInfo.fields, headersInfo);
                const headerNames: IStringIndex = {};
                for (const header of rawHeaders) {
                    headerNames[header.valueSort.levelName.toString()] = header.valueSort.levelName.toString();
                }
                const excessHeaders: IAxisSet[] = this.headerObjectsCollection['parent'].filter((header: IAxisSet) => {
                    return !headerNames[header.valueSort.levelName.toString()];
                });
                const grandHeader: IAxisSet[] = rawHeaders.filter((item: IAxisSet) => { return item.type === 'grand sum'; });
                if (grandHeader.length > 0) {
                    rawHeaders.pop();
                }
                rawHeaders = this.getSortedHeaders(
                    rawHeaders.concat(excessHeaders), this.fieldList[headersInfo.fields[0].name].sort).concat(grandHeader);
                if (headersInfo.axis === 'row') {
                    this.cMembers = this.getIndexedHeaders(this.dataSourceSettings.columns, this.data, 0, this.filterMembers, 'column', '');
                    this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
                }
                else {
                    this.rMembers = this.getIndexedHeaders(this.dataSourceSettings.rows, this.data, 0, this.filterMembers, 'row', '');
                    this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
                }
            }
            if (headersInfo.axis === 'row') {
                this.rowCount = 0;
            } else {
                this.columnCount = 0;
            }
            this.updateHeadersCount(rawHeaders, headersInfo.axis, 0, headersInfo.fields, 'plus', false);
            if (headersInfo.axis === 'row') {
                if (headersInfo.position > 0) {
                    this.insertPosition(this.dataSourceSettings.rows, this.data, 0, this.filterMembers, 'row', '', rawHeaders);
                }
                this.insertTotalPosition(rawHeaders);
                this.rMembers = this.headerCollection.rowHeaders = rawHeaders;
                this.headerCollection.rowHeadersCount = this.rowCount;
            } else {
                if (headersInfo.position > 0) {
                    this.insertPosition(this.dataSourceSettings.columns, this.data, 0, this.filterMembers, 'column', '', rawHeaders);
                }
                this.insertTotalPosition(rawHeaders);
                this.cMembers = this.headerCollection.columnHeaders = rawHeaders;
                this.headerCollection.columnHeadersCount = this.columnCount;
            }
        }
        else {
            const showNoDataItems: boolean = (this.dataSourceSettings.rows[0] && this.dataSourceSettings.rows[0].showNoDataItems) || (
                this.dataSourceSettings.columns[0] && this.dataSourceSettings.columns[0].showNoDataItems);
            this.rMembers = this.getIndexedHeaders(this.dataSourceSettings.rows, this.data, 0, showNoDataItems ? addPos : this.filterMembers, 'row', '');
            this.cMembers = this.getIndexedHeaders(this.dataSourceSettings.columns, this.data, 0, showNoDataItems ? addPos : this.filterMembers, 'column', '');
            this.insertAllMembersCommon();
            this.rowCount = 0;
            this.columnCount = 0;
            this.updateHeadersCount(this.cMembers, 'column', 0, this.dataSourceSettings.columns, 'plus', false);
            this.updateHeadersCount(this.rMembers, 'row', 0, this.dataSourceSettings.rows, 'plus', false);
            if (showNoDataItems) {
                this.insertPosition(this.dataSourceSettings.rows, this.data, 0, this.filterMembers, 'row', '', this.rMembers);
                this.insertPosition(this.dataSourceSettings.columns, this.data, 0, this.filterMembers, 'column', '', this.cMembers);
            }
            this.headerCollection.rowHeaders = this.rMembers;
            this.headerCollection.rowHeadersCount = this.rowCount;
            this.headerCollection.columnHeaders = this.cMembers;
            this.headerCollection.columnHeadersCount = this.columnCount;
        }
        this.applyValueSorting();
    }
    private getHeadersInfo(fieldName: string, axis: string): IHeadersInfo {
        this.rMembers = this.headerCollection.rowHeaders; this.cMembers = this.headerCollection.columnHeaders;
        axis = axis === '' ? this.getAxisByFieldName(fieldName) : axis;
        const headers: IAxisSet[] = axis === 'row' ? this.rMembers : this.cMembers;
        const fields: IFieldOptions[] = axis === 'row' ? this.dataSourceSettings.rows : this.dataSourceSettings.columns;
        let position: number = 0;
        for (const field of fields) {
            if (field.name === fieldName) {
                break;
            }
            position++;
        }
        return { axis: axis, fields: fields, headers: headers, position: position };
    }
    /**
     * It performs the updating engine.
     *
     * @returns {void}
     * @hidden
     */
    public updateEngine(): void {
        this.removeCount = 0;
        this.validateValueFields();
        this.calculatePagingValues();
        this.pivotValues = []; this.headerContent = []; this.valueContent = [];
        const rowheads: IAxisSet[] = []; const colheads: IAxisSet[] = [];
        const updatedRowMembers: IAxisSet[] = [];
        const valuesCount: number = (this.dataSourceSettings.values.length);
        this.getAggregatedHeaders(
            this.dataSourceSettings.rows, this.dataSourceSettings.columns, this.rMembers, this.cMembers, this.dataSourceSettings.values
        );
        this.getHeaderData(
            this.dataSourceSettings.rows, this.dataSourceSettings.columns, this.dataSourceSettings.values, updatedRowMembers,
            this.cMembers, colheads, this.pivotValues, 0, this.valueAxis ? 1 : valuesCount
        );
        this.insertSubTotals();
        this.getTableData(
            (updatedRowMembers.length > 0 ? updatedRowMembers : this.rMembers), rowheads, colheads, 0, this.pivotValues,
            valuesCount, 0, (this.rowGrandTotal ? this.rowGrandTotal : this.rMembers[this.rMembers.length - 1]),
            (this.columnGrandTotal ? this.columnGrandTotal : this.cMembers[this.cMembers.length - 1]));
        this.applyAdvancedAggregate(rowheads, colheads, this.pivotValues);
        this.isEngineUpdated = true;
        this.isEmptyDataAvail(this.rMembers, this.cMembers);
    }
    private getAxisByFieldName(fieldName: string): string {
        let axisCount: number = 0;
        let axis: string = '';
        while (axisCount < 4 && axis === '') {
            switch (axisCount) {
            case 0:
                axis = this.getFieldByName(fieldName, this.dataSourceSettings.rows) ? 'row' : '';
                break;
            case 1:
                axis = this.getFieldByName(fieldName, this.dataSourceSettings.columns) ? 'column' : '';
                break;
            }
            axisCount++;
        }
        return axis;
    }
    private getFieldByName(fieldName: string, fields: IFieldOptions[]): IFieldOptions {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFieldOptions;
    }
    private updateHeadersCount(
        headers: IAxisSet[], axis: string, position?: number, fields?: IFieldOptions[], action?: string, isDrill?: boolean): void {
        let lenCnt: number = 0;
        const field: IFieldOptions = fields[position as number];
        let showSubTotals: boolean = true;
        if (axis === 'column') {
            showSubTotals = this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showColumnSubTotals &&
                (field ? field.showSubTotals : true);
        } else {
            showSubTotals = this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showRowSubTotals &&
                (field ? field.showSubTotals : true);
        }
        while (lenCnt < headers.length) {
            if (axis === 'row') {
                this.rowCount = this.rowCount - (
                    action === 'plus' ? -(this.valueAxis === 1 ? this.dataSourceSettings.values.length : 1) :
                        (this.valueAxis === 1 ? this.dataSourceSettings.values.length : 1));
            } else {
                this.columnCount = this.columnCount - (
                    action === 'plus' ? -(this.valueAxis === 1 ? 1 : this.dataSourceSettings.values.length) :
                        (this.valueAxis === 1 ? 1 : this.dataSourceSettings.values.length));
            }
            if (headers[lenCnt as number].members.length > 0) {
                this.updateHeadersCount(headers[lenCnt as number].members, axis, position + 1, fields, action, true);
                if (axis === 'row') {
                    this.rowCount += this.showSubTotalsAtBottom && headers[lenCnt as number].hasChild && headers[
                        lenCnt as number
                    ].isDrilled ? 1 : 0;
                }
            }
            lenCnt++;
        }
        if (axis === 'column' && !showSubTotals && isDrill) {
            this.columnCount += action === 'plus' ? -this.colValuesLength : this.colValuesLength;
        }
    }
    /**
     * It performs to retrieve the sorted headers.
     *
     * @param {IAxisSet[]} headers - It cotains the headers data.
     * @param {string} sortOrder -  It cotains the ortOrder data
     * @returns {IAxisSet[]} - return sorted headers as IAxisSet[].
     * @hidden
     */
    private getSortedHeaders(headers: IAxisSet[], sortOrder: string): IAxisSet[] {
        const fieldName: string | number | Date = headers[0].actualText !== 'Grand Total' ? headers[0].valueSort.axis :
            headers[1].valueSort.axis;
        const isNotDateType: boolean = !(this.formatFields && this.formatFields[fieldName as string] &&
            this.formatFields[fieldName as string].type);
        const childrens: IField = this.fieldList[fieldName as string];
        if (isNotDateType) {
            if (childrens && childrens.type === 'number' && headers.length > 0 && (typeof (headers[0].actualText) === 'string')) {
                const stringValue: IAxisSet[] = [];
                let alphaNumbervalue: IAxisSet[] = [];
                const nullValue: IAxisSet[] = [];
                for (let i: number = 0; i < headers.length; i++) {
                    if (isNaN(Number(headers[i as number].actualText.toString().charAt(0)))) {
                        stringValue.push(headers[i as number]);
                    } else if (headers[i as number].actualText === '') {
                        nullValue.push(headers[i as number]);
                    } else {
                        alphaNumbervalue.push(headers[i as number]);
                        break;
                    }
                }
                if (alphaNumbervalue.length > 0) {
                    alphaNumbervalue = this.sortHeaders(fieldName as string, childrens, headers, childrens.sort, childrens.isAlphanumeric);
                }
                return headers;
            } else {
                return this.sortHeaders(fieldName as string, childrens, headers, sortOrder, childrens.type);
            }
        } else {
            return this.sortHeaders(fieldName as string, childrens, headers, sortOrder, childrens.type);
        }
    }
    private sortHeaders(
        fieldName: string, childrens: IField, sortMembersOrder: IAxisSet[], sortOrder: string, type: string | boolean
    ): IAxisSet[] {
        let isHeaderSortByDefault: boolean = false;
        const membersInfo: string[] | number[] = this.fieldList[fieldName as string] && this.fieldList[fieldName as string].membersOrder ?
            [...this.fieldList[fieldName as string].membersOrder] as string[] | number[] : [];
        const sortDetails: HeadersSortEventArgs = {
            fieldName: fieldName,
            sortOrder: sortOrder as Sorting,
            members: membersInfo && membersInfo.length > 0 ? membersInfo : Object.keys(childrens.members),
            IsOrderChanged: false
        };
        type = (type === 'datetime' || type === 'date' || type === 'time') ? (this.formatFields[fieldName as string] &&
            (['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName as string].type) > -1)) ? type : 'string' : type;
        const isDateType: boolean = (type === 'datetime' || type === 'date' || type === 'time');
        let isNumberGroupSorting: boolean = false;
        if (this.dataSourceSettings.groupSettings.length > 0) {
            const groupField: IGroupSettings[] = this.dataSourceSettings.groupSettings.filter((field: IGroupSettings) => {
                return field.name === childrens.id as string;
            });
            if (!isNullOrUndefined(groupField) && groupField.length > 0) {
                isNumberGroupSorting = groupField[0].type === 'Number' && childrens.type === 'string';
            }
        }
        if (membersInfo && membersInfo.length > 0) {
            PivotUtil.applyCustomSort(sortDetails, sortMembersOrder, type);
        }
        else {
            PivotUtil.applyHeadersSort(sortMembersOrder, sortOrder, type, isNumberGroupSorting);
            isHeaderSortByDefault = true;
        }
        if (isHeaderSortByDefault && this.getHeaderSortInfo) {
            const copyOrder: string[] | number[] = [];
            for (let m: number = 0, n: number = 0; m < sortMembersOrder.length; m++) {
                const member: IAxisSet = sortMembersOrder[m as number];
                const sortText: string | number = isDateType ?
                    member.dateText : member.actualText;
                if (member.actualText !== 'Grand Total') {
                    copyOrder[n++] = sortText;
                }
            }
            sortDetails.members = copyOrder as string[];
        }
        if (this.getHeaderSortInfo) {
            this.getHeaderSortInfo(sortDetails);
        }
        if (sortDetails.IsOrderChanged) {
            PivotUtil.applyCustomSort(sortDetails, sortMembersOrder, type, true);
        }
        return sortMembersOrder;
    }
    /**
     * It performs to applying  the value sorting.
     *
     * @param {IAxisSet[]} rMembers - It contains the row members data.
     * @param {IAxisSet[]} cMembers - It contains the column members data.
     * @returns {ISortedHeaders} - It return the sorted value as ISortedHeaders.
     * @hidden
     */
    public applyValueSorting(rMembers?: IAxisSet[], cMembers?: IAxisSet[]): ISortedHeaders {

        let isNullArgument: boolean = false;
        if (rMembers === undefined || cMembers === undefined) {
            this.valueSortHeaderText = undefined;
            if (this.enableValueSorting && this.valueSortSettings.headerText && !this.valueSortHeaderText &&
                this.valueSortSettings.headerText !== '' && this.dataSourceSettings.values.length > 0) {
                this.valueSortHeaderText = this.valueSortSettings.headerText;
                const textArray: string[] = this.valueSortHeaderText.split(this.valueSortSettings.headerDelimiter);
                for (const field of this.dataSourceSettings.values) {
                    const name: string = field.caption ? field.caption : field.name;
                    const valueIndex: number = textArray.indexOf(name);
                    if (valueIndex > -1) {
                        textArray.splice(valueIndex, 1);
                        textArray.push(name);
                        this.valueSortHeaderText = textArray.join(this.valueSortSettings.headerDelimiter);
                        break;
                    }
                }
            }
            rMembers = this.rMembers;
            cMembers = this.cMembers;
            isNullArgument = true;
        }
        if (this.valueSortHeaderText) {
            const textArray: string[] = this.valueSortHeaderText.split(this.valueSortSettings.headerDelimiter);
            let hText: string = '';
            let mIndex: number;
            let mType: string;
            let caption: string;
            for (let i: number = 0; i < this.dataSourceSettings.values.length; i++) {
                if (this.dataSourceSettings.values[i as number].caption === textArray[textArray.length - 1]) {
                    caption = this.dataSourceSettings.values[i as number].name;
                    break;
                } else {
                    caption = textArray[textArray.length - 1];
                }
            }
            if (((this.dataSourceSettings.values.length === 1 && this.dataSourceSettings.columns.length === 0) ||
                this.dataSourceSettings.values.length > 1) && caption && this.fieldList[caption as string]) {
                for (let i: number = 0; i < textArray.length - 1; i++) {
                    hText = hText === '' ? textArray[i as number] : (hText + this.valueSortSettings.headerDelimiter + textArray[i as number]);
                }
                mIndex = this.fieldList[caption as string].index;
                mType = this.fieldList[caption as string].aggregateType;
            } else {
                if (!this.dataSourceSettings.alwaysShowValueHeader || textArray.length === 1) {
                    hText = this.valueSortHeaderText;
                } else {
                    for (let i: number = 0; i < textArray.length - 1; i++) {
                        hText = hText === '' ? textArray[i as number] : (hText + this.valueSortSettings.headerDelimiter + textArray[i as number]);
                    }
                }
                mIndex = this.fieldList[this.dataSourceSettings.values[0].name].index;
                mType = this.fieldList[this.dataSourceSettings.values[0].name].aggregateType;
            }
            let member: IAxisSet;
            if (this.valueAxis === 0) {
                member = this.getMember(cMembers, hText);
                if (member) {
                    rMembers = this.sortByValueRow(rMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            } else {
                member = this.getMember(rMembers, hText);
                if (member) {
                    cMembers = this.sortByValueRow(cMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            }
            if (isNullArgument) {
                this.rMembers = rMembers;
                this.cMembers = cMembers;
                if (this.isPagingOrVirtualizationEnabled) {
                    this.headerCollection.rowHeaders = this.rMembers;
                    this.headerCollection.columnHeaders = this.cMembers;
                }
            }
        }
        return { rMembers: rMembers, cMembers: cMembers };
    }
    private getMember(cMembers: IAxisSet[], headerText: string): IAxisSet {
        const vlen: number = cMembers.length;
        let member: IAxisSet;
        for (let j: number = 0; j < vlen; j++) {
            if (cMembers[j as number].valueSort.levelName === headerText) {
                member = cMembers[j as number];
                break;
            } else if (cMembers[j as number].members.length > 0) {
                member = this.getMember(cMembers[j as number].members, headerText);
            }
            if (member) {
                return member;
            }
        }
        return member;
    }
    private sortByValueRow(rMembers: IAxisSet[], member: IAxisSet, sortOrder: Sorting, mIndex: number, mType: string): IAxisSet[] {
        const aggreColl: { 'header': IAxisSet; 'value'?: number }[] = [];
        for (const header of rMembers) {
            if (header.type === 'grand sum') {
                aggreColl.push({ 'header': header });
            } else {
                this.rawIndexObject = {};
                let value: number = this.getAggregateValue(header.index, member.indexObject, mIndex, mType, false);
                const cellDetails: AggregateEventArgs = {
                    fieldName: this.fields[mIndex as number],
                    row: header,
                    column: member,
                    value: value,
                    cellSets: this.getValueCellInfo ? this.getCellSet(this.rawIndexObject) : [],
                    rowCellType: (header.hasChild && header.isDrilled ? 'subTotal' : header.type === 'grand sum' ? 'grandTotal' : 'value'),
                    columnCellType: (member.hasChild && member.isDrilled ? 'subTotal' : member.type === 'grand sum' ? 'grandTotal' : 'value'),
                    aggregateType: mType as SummaryTypes,
                    skipFormatting: false
                };
                if (this.getValueCellInfo) {
                    this.getValueCellInfo(cellDetails);
                }
                value = cellDetails.value;
                this.rawIndexObject = {};
                aggreColl.push({ 'header': header, 'value': value });
            }
        }
        rMembers = PivotUtil.getSortedValue(aggreColl, sortOrder);
        for (const header of rMembers) {
            if (header.members.length > 0) {
                header.members = this.sortByValueRow(header.members, member, sortOrder, mIndex, mType);
            }
        }
        return rMembers;
    }
    private insertAllMembersCommon(): void {
        this.rowGrandTotal = this.columnGrandTotal = null;
        const rowFlag: boolean = (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) ? true :
            (this.dataSourceSettings.rows.length > 0) ? false : true;
        const columnFlag: boolean = (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) ?
            true : (this.dataSourceSettings.columns.length > 0) ? false : true;
        if (this.isValueHasAdvancedAggregate) {
            /* inserting the row grant-total members */
            this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
            if (rowFlag) {
                this.rowCount += this.rowValuesLength;
            }
            /* inserting the column gran-total members */
            this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
            if (columnFlag) {
                this.columnCount += this.colValuesLength;
            }
        } else {
            if (rowFlag) {
                /* inserting the row grant-total members */
                this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
                this.rowCount += this.rowValuesLength;
            } else {
                this.rowGrandTotal = this.insertAllMember([], this.filterMembers, '', 'row')[0];
            }
            if (columnFlag) {
                /* inserting the column gran-total members */
                this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
                this.columnCount += this.colValuesLength;
            } else {
                this.columnGrandTotal = this.insertAllMember([], this.filterMembers, '', 'column')[0];
            }
        }
    }
    private insertSubTotals(): void {
        const rowLength: number = this.pivotValues.length;
        for (let rowCnt: number = 0; rowCnt < rowLength; rowCnt++) {
            const rowCells: IAxisSet[] = this.pivotValues[rowCnt as number] as IAxisSet[];
            if (rowCells) {
                let savedCell: IAxisSet;
                let spanCnt: number = 1;
                const colLength: number = rowCells.length;
                let indexObj: { index: number[]; indexObject: {} };
                let startIndex: number = 1;
                const lastIndex: number = this.showSubTotalsAtTop ? this.reformAxisCount : colLength;
                let colCnt: number = this.showSubTotalsAtTop ? startIndex : lastIndex - 1;
                let columnSpan: number;
                let memberCnt: number;
                while (startIndex < lastIndex) {
                    const cell: IAxisSet = rowCells[colCnt as number] as IAxisSet;
                    if (cell) {
                        // if (cell.rowSpan > 1) {
                        //     cell.rowSpan = 1;
                        // }
                        if (savedCell) {
                            savedCell.colSpan = spanCnt;
                            savedCell.colIndex = this.showSubTotalsAtTop ? savedCell.colIndex + (spanCnt - 1) :
                                savedCell.colIndex - (spanCnt - 1);
                        }
                        if (this.showSubTotalsAtTop) {
                            columnSpan = memberCnt = this.getMemberSpanCount(this.pivotValues[rowCnt as number] as IAxisSet[], colCnt);
                        }
                        indexObj = { index: cell.index, indexObject: cell.indexObject };
                        cell.index = [];
                        cell.indexObject = {};
                        savedCell = extend({}, cell, null, true);
                        cell.index = indexObj.index;
                        cell.indexObject = indexObj.indexObject;
                        let rowPos: number = rowCnt + 1;
                        while (this.pivotValues[rowPos as number] && !this.pivotValues[rowPos as number][colCnt as number]) {
                            const curentCell: IAxisSet = this.pivotValues[rowCnt as number][colCnt as number] as IAxisSet;
                            if (!curentCell.isDrilled && !(!this.valueAxis && !this.isLastHeaderHasMeasures && (curentCell.members
                                && curentCell.members.length > 0 && rowPos > this.measureIndex))) {
                                curentCell.rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            }
                            const cellType: string = (cell.type === 'sum' || cell.type === 'grand sum') ? cell.type : 'sum';
                            this.pivotValues[rowPos as number][colCnt as number] =
                                this.headerContent[rowPos as number][colCnt as number] = {
                                    type: cellType, formattedText: ((cell.type === 'sum' || cell.type === 'grand sum') ? cell.formattedText :
                                        (cell.formattedText + ' Total')), axis: 'column', hierarchyName: cell.hierarchyName,
                                    level: -1, colIndex: colCnt, rowIndex: rowPos, valueSort: cell.valueSort
                                };
                            if (cell.valueSort && cell.valueSort[this.valueSortSettings.headerText]) {
                                this.valueSortSettings.columnIndex = colCnt;
                            }
                            let isSpanned: boolean = false;
                            if (cellType === 'grand sum') {
                                curentCell.rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            } else if (curentCell.type !== 'sum' && (curentCell.isDrilled || (this.valueAxisFields[curentCell.actualText] &&
                                !this.valueAxis && !this.isLastHeaderHasMeasures && curentCell.members && curentCell.members.length > 0))) {
                                (this.pivotValues[rowCnt + 1][colCnt as number] as IAxisSet).rowSpan = rowPos - rowCnt;
                                isSpanned = true;
                            } else {
                                (this.pivotValues[rowPos as number][colCnt as number] as IAxisSet).rowSpan = -1;
                            }
                            if (rowPos > (rowCnt + 1) && (curentCell.type === 'sum' ||
                                isSpanned)) {
                                (this.pivotValues[rowPos as number][colCnt as number] as IAxisSet).rowSpan = -1;
                            }
                            rowPos++;
                        }
                        spanCnt = 1;
                    } else {
                        rowCells[colCnt as number] =
                            this.headerContent[rowCnt as number][colCnt as number] = extend({}, savedCell, null, true);
                        rowCells[colCnt as number].index =
                            this.headerContent[rowCnt as number][colCnt as number].index = indexObj.index;
                        rowCells[colCnt as number].indexObject =
                            this.headerContent[rowCnt as number][colCnt as number].indexObject = indexObj.indexObject;
                        spanCnt++;
                        if (this.showSubTotalsAtTop) {
                            memberCnt--;
                            rowCells[colCnt as number].colSpan = memberCnt;
                            rowCells[colCnt as number].colIndex = rowCells[colCnt as number].colIndex + (spanCnt - 1);
                        } else {
                            rowCells[colCnt as number].colSpan = spanCnt;
                            rowCells[colCnt as number].colIndex = rowCells[colCnt as number].colIndex - (spanCnt - 1);
                        }
                    }
                    if (colCnt === 1 && savedCell) {
                        if (this.showSubTotalsAtTop) {
                            savedCell.colSpan = columnSpan;
                            savedCell.colIndex = savedCell.colIndex + (spanCnt - 1);
                        } else {
                            savedCell.colSpan = spanCnt;
                            savedCell.colIndex = savedCell.colIndex - (spanCnt - 1);
                        }
                    }
                    if (this.showSubTotalsAtTop && (rowCells[colCnt + 1] || colCnt + 1 === this.reformAxisCount)) {
                        const cell: IAxisSet = this.pivotValues[rowCnt as number][(colCnt - spanCnt) + 1] as IAxisSet;
                        cell.colSpan = columnSpan;
                        this.pivotValues[rowCnt as number][(colCnt - spanCnt) + 1] = cell;
                    }
                    colCnt = this.showSubTotalsAtTop ? colCnt + 1 : colCnt - 1;
                    startIndex++;
                }
            }
        }
    }
    private getMemberSpanCount(rowCellArray: IAxisSet[], cellIndex: number): number {
        let colIndex: number = 1;
        for (let i: number = cellIndex + 1; i < this.reformAxisCount; i++) {
            if (!rowCellArray[i as number]) {
                colIndex++;
            } else {
                break;
            }
        }
        return colIndex;
    }
    private frameDrillObject(vDrilledItem: IDrilledItem = null): void {
        this.fieldDrillCollection = {};
        for (let fieldCnt: number = 0; fieldCnt < this.drilledMembers.length; fieldCnt++) {
            const drillOption: IDrillOptions = this.drilledMembers[fieldCnt as number];
            let hasValueField: boolean = false;
            let levelCount: number = 1;
            let isFieldAvail: boolean = false;
            const field: IField = this.fieldList[drillOption.name];
            const isDrillMemberExpand: boolean = (field && field.expandAll);
            for (let i: number = 0; i < this.dataSourceSettings.rows.length; i++) {
                if (this.dataSourceSettings.rows[i as number].name === drillOption.name) {
                    const hasMeasureIndex: boolean = this.valueAxis && (this.isMultiMeasures ||
                        this.dataSourceSettings.alwaysShowValueHeader) && this.measureIndex > -1 && this.measureIndex <= i;
                    levelCount = (hasMeasureIndex ? (i + 1) : i) + 1;
                    hasValueField = hasMeasureIndex ? true : false;
                    isFieldAvail = true;
                    break;
                }
            }
            if (!isFieldAvail) {
                for (let i: number = 0; i < this.dataSourceSettings.columns.length; i++) {
                    if (this.dataSourceSettings.columns[i as number].name === drillOption.name) {
                        const hasMeasureIndex: boolean = !this.valueAxis && (this.isMultiMeasures ||
                            this.dataSourceSettings.alwaysShowValueHeader) && this.measureIndex > -1 && this.measureIndex <= i;
                        levelCount = (hasMeasureIndex ? (i + 1) : i) + 1;
                        hasValueField = hasMeasureIndex ? true : false;
                        isFieldAvail = true;
                        break;
                    }
                }
            }
            for (const drilledItem of drillOption.items) {
                let members: string[] = drilledItem.split(drillOption.delimiter);
                if (levelCount === members.length) {
                    let memberString: string = drillOption.name + this.valueSortSettings.headerDelimiter +
                        members.join(this.valueSortSettings.headerDelimiter);
                    this.fieldDrillCollection[memberString as string] = memberString;
                    if (hasValueField) {
                        let isAllValuesAvail: boolean = false;
                        if (this.isExpandAll || isDrillMemberExpand) {
                            for (const field of this.dataSourceSettings.values) {
                                const name: string = field.caption ? field.caption : field.name;
                                members[this.measureIndex] = name;
                                if (drillOption.items.indexOf(members.join(drillOption.delimiter)) > -1) {
                                    isAllValuesAvail = true;
                                } else {
                                    isAllValuesAvail = false;
                                    break;
                                }
                            }
                        }
                        if (((this.isExpandAll || isDrillMemberExpand) && isAllValuesAvail) || !this.isExpandAll || !isDrillMemberExpand) {
                            members = drilledItem.split(drillOption.delimiter);
                            members.splice(this.measureIndex, 1);
                            if (vDrilledItem && vDrilledItem.memberName === drilledItem) {
                                vDrilledItem.memberName = members.join(drillOption.delimiter);
                            }
                            memberString = drillOption.name + this.valueSortSettings.headerDelimiter +
                                members.join(this.valueSortSettings.headerDelimiter);
                            this.fieldDrillCollection[memberString as string] = memberString;
                        }
                    }
                }
            }
        }
    }
    private getIndexedHeaders(
        keys: IFieldOptions[], data: IDataSet[] | string[][], keyInd?: number, position?: number[], axis?: string,
        parentMember?: string, valueFil?: boolean
    ): IAxisSet[] {
        const hierarchy: IAxisSet[] = [];
        let keysPos: number = 0;
        if (keys && keys.length > 0) {
            keysPos++;
            const rlen: number = keys.length;
            const decisionObj: IIterator = {};
            const fieldName: string = keys[keyInd as number].name;
            const field: IFieldOptions = keys[keyInd as number];
            // let members: string[] = Object.keys(this.fieldList[field].members);
            const childrens: IField = this.fieldList[fieldName as string];
            if (isNullOrUndefined(this.reportDataType)) {
                this.reportDataType = {};
                for (let i: number = 0; i < this.dataSourceSettings.rows.length; i++) {
                    this.reportDataType[this.dataSourceSettings.rows[i as number].name] =
                        this.dataSourceSettings.rows[i as number].dataType;
                }
                for (let i: number = 0; i < this.dataSourceSettings.columns.length; i++) {
                    this.reportDataType[this.dataSourceSettings.columns[i as number].name] =
                        this.dataSourceSettings.columns[i as number].dataType;
                }
                for (let i: number = 0; i < this.dataSourceSettings.values.length; i++) {
                    this.reportDataType[this.dataSourceSettings.values[i as number].name] =
                        this.dataSourceSettings.values[i as number].dataType;
                }
            }
            childrens.type = !isNullOrUndefined(this.reportDataType[childrens.id]) ? this.reportDataType[childrens.id] : childrens.type;
            let isNoData: boolean = false;
            const isDateType: boolean = (this.formatFields[fieldName as string] &&
                (['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName as string].type) > -1));
            const showNoDataItems: boolean = (position.length < 1 && keyInd > 0) || field.showNoDataItems;
            const savedMembers: IStringIndex = {};
            if (showNoDataItems) {
                const members: string[] = Object.keys(childrens.members);
                for (let pos: number = 0, lt: number = members.length; pos < lt; pos++) {
                    if (this.dataSourceSettings.showHeaderWhenEmpty ||
                            (this.localeObj && members[pos as number] !== this.localeObj.getConstant('undefined'))) {
                        savedMembers[members[pos as number]] = members[pos as number];
                    }
                }
                if (position.length < 1) {
                    isNoData = true;
                    position.length = members.length;
                }
            }
            if (axis === this.dataSourceSettings.valueAxis && this.measureIndex === keyInd &&
                (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                this.isLastHeaderHasMeasures = false;
            }
            for (let pos: number = 0, lt: number = position.length; pos < lt; pos++) {
                const member: IAxisSet = {};
                if (!isNullOrUndefined(keys[keyInd as number].showSubTotals) && !keys[keyInd as number].showSubTotals) {
                    member.showSubTotals = false;
                }
                member.hasChild = keyInd < rlen - 1;
                member.level = keyInd;
                member.axis = axis;
                member.colSpan = 1;
                const memInd: number = isNoData ? childrens.members[Object.keys(savedMembers)[0]].ordinal :
                    this.valueMatrix[position[pos as number]][childrens.index].ordinal;
                let headerValue: string = isNoData ? Object.keys(savedMembers)[0] :
                    (data as IDataSet[])[position[pos as number]][this.fieldKeys[fieldName as string] as string | number] as string;
                headerValue = this.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(headerValue) : headerValue;
                if ((isNullOrUndefined(headerValue) || (this.localeObj && headerValue === this.localeObj.getConstant('undefined')))
                    && !this.dataSourceSettings.showHeaderWhenEmpty) {
                    if (showNoDataItems && !isNoData && keyInd > 0 && pos + 1 === position.length &&
                        Object.keys(savedMembers).length > 0) {
                        lt = Object.keys(savedMembers).length;
                        isNoData = true;
                        pos = -1;
                    }
                    continue;
                }
                delete savedMembers[headerValue as string];
                if (showNoDataItems && this.fieldFilterMem[fieldName as string] &&
                    this.fieldFilterMem[fieldName as string].memberObj[headerValue as string] === headerValue) {
                    continue;
                }
                const formattedValue: IAxisSet = isDateType ? {
                    actualText: headerValue,
                    formattedText: childrens.dateMember[memInd - 1].formattedText,
                    dateText: childrens.dateMember[memInd - 1].actualText
                } : {
                    formattedText: headerValue === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(headerValue)) :
                        headerValue === undefined ? (this.localeObj ? (fieldName in this.groupingFields) ?
                            this.localeObj.getConstant('groupOutOfRange') : this.localeObj.getConstant('undefined') :
                            String(headerValue)) : String(headerValue), actualText: headerValue === null ? (this.localeObj ?
                        this.localeObj.getConstant('null') : String(headerValue)) : headerValue === undefined ?
                        (this.localeObj ? (fieldName in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                            this.localeObj.getConstant('undefined') : String(headerValue)) : headerValue
                };
                member.actualText = formattedValue.actualText;
                member.formattedText = formattedValue.formattedText;
                if (isDateType) {
                    member.dateText = formattedValue.dateText;
                }
                const availData: boolean = showNoDataItems ? (this.filterPosObj[position[pos as number]] !== undefined &&
                    !isNoData ? true : false) : true;
                //member.name = members[memInd as number];
                // member.type = member.hasChild ? 'All' : 'Single';
                let isFiltered: boolean = false;
                if (showNoDataItems && childrens.filter.length > 0 && childrens.filterType === 'include') {
                    isFiltered = true;
                }
                if ((!(decisionObj && decisionObj[memInd as number])) && (!isFiltered ||
                    (isFiltered && childrens.filter.indexOf(headerValue.toString()) > -1))) {
                    decisionObj[memInd as number] = { index: [], indexObject: {} };
                    member.index = decisionObj[memInd as number].index;
                    member.indexObject = decisionObj[memInd as number].indexObject;
                    if (availData) {
                        member.index = decisionObj[memInd as number].index = [position[pos as number]];
                        decisionObj[memInd as number].indexObject[position[pos as number]] = position[pos as number];
                        member.indexObject = decisionObj[memInd as number].indexObject;
                    }
                    member.ordinal = memInd;
                    member.valueSort = {};
                    member.valueSort.axis = fieldName;
                    if (keyInd !== 0) {
                        member.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter + member.formattedText;
                        member.valueSort[parentMember + this.valueSortSettings.headerDelimiter + member.formattedText] = 1;
                        member.valueSort.uniqueName = parentMember + this.valueSortSettings.headerDelimiter +
                        (member.actualText ? member.actualText : member.formattedText);
                        member.valueSort[parentMember + this.valueSortSettings.headerDelimiter + (member.actualText ?
                            member.actualText : member.formattedText)] = 1;
                    } else {
                        member.valueSort[member.formattedText] = 1;
                        member.valueSort.levelName = member.formattedText;
                        member.valueSort[member.actualText ? member.actualText : member.formattedText] = 1;
                        member.valueSort.uniqueName = (member.actualText ? member.actualText : member.formattedText);
                    }
                    const memberString: string =
                        member.valueSort.axis + this.valueSortSettings.headerDelimiter + member.valueSort.levelName;
                    const isExpandMember: boolean = this.isExpandAll || (field && field.expandAll);
                    member.isDrilled = (valueFil && this.isValueFiltersAvail) ? true :
                        (member.hasChild && this.fieldDrillCollection[memberString as string]) ?
                            isExpandMember ? (!this.valueAxis && !this.isLastHeaderHasMeasures && (keysPos >= this.measureIndex) ?
                                true : false) : true : isExpandMember;
                    //if (!member.members) {
                    member.members = [];
                    //}
                    //let copyObj: AxisSet = Object.create(member);
                    hierarchy.push(member);
                } else if (availData) {
                    decisionObj[memInd as number].index.push(position[pos as number]);
                    decisionObj[memInd as number].indexObject[position[pos as number]] = position[pos as number];
                }
                if (showNoDataItems && !isNoData && keyInd > 0 && pos + 1 === position.length &&
                    Object.keys(savedMembers).length > 0) {
                    isNoData = true;
                    lt = Object.keys(savedMembers).length;
                    pos = -1;
                }
            }
            for (let iln: number = 0, ilt: number = hierarchy.length; iln < ilt; iln++) {
                if (!this.frameHeaderObjectsCollection) {
                    if (axis === 'row') {
                        this.rowCount += (this.rowValuesLength + (
                            hierarchy[iln as number].isDrilled && hierarchy[iln as number].hasChild && this.showSubTotalsAtBottom ? 1 : 0
                        ));
                    } else {
                        this.columnCount += this.colValuesLength;
                    }
                }
                let level: string = null;
                if (hierarchy[iln as number].valueSort && hierarchy[iln as number].valueSort.levelName) {
                    level = hierarchy[iln as number].valueSort.levelName as string;
                }
                parentMember = (level || hierarchy[iln as number].formattedText) as string;
                if (!this.dataSourceSettings.showHeaderWhenEmpty && rlen - 1 > keyInd && hierarchy[iln as number].index &&
                    hierarchy[iln as number].index.length > 0) {
                    if (showNoDataItems && keys[keyInd + 1] && keys[keyInd + 1].name &&
                        Object.keys(this.fieldList[keys[keyInd + 1].name].members).length > 0) {
                        hierarchy[iln as number].hasChild = true;
                    } else {
                        const hIndLen: number = hierarchy[iln as number].index.length;
                        let count: number = 0;
                        for (let len: number = 0; len < hIndLen; len++) {
                            const headerValue: string = (data as IDataSet[])[hierarchy[iln as number].index[len as number]][
                                this.fieldKeys[keys[keyInd + 1].name] as string | number] as string;
                            if ((isNullOrUndefined(headerValue) || (this.localeObj &&
                                headerValue === this.localeObj.getConstant('undefined')))) {
                                count++;
                            }
                        }
                        hierarchy[iln as number].hasChild = count !== hIndLen;
                    }
                }
                if (rlen - 1 > keyInd && hierarchy[iln as number].isDrilled) {
                    this.columnCount -= (!(this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showColumnSubTotals && field.showSubTotals) && axis === 'column') ?
                        this.colValuesLength : 0;
                    const filterPosition: number[] = hierarchy[iln as number].index;
                    hierarchy[iln as number].members = this.getIndexedHeaders(
                        keys, data, keyInd + 1, (filterPosition === undefined ? [] : filterPosition), axis, parentMember, valueFil);
                    if (this.frameHeaderObjectsCollection) {
                        this.headerObjectsCollection[parentMember as string] = hierarchy[iln as number].members;
                    }
                }
            }
            if (this.enableSort) {
                // return new DataManager(hierarchy as JSON[]).executeLocal(new Query().sortBy('actualText', childrens.sort.toLowerCase()));
                if (isDateType) {
                    return this.sortHeaders(fieldName, childrens, hierarchy, childrens.sort, 'date');
                } else {
                    if (childrens.type.toLowerCase() === 'number' && hierarchy.length > 0 && (typeof (hierarchy[0].actualText) === 'string') && hierarchy[0].actualText.match(/[a-zA-Z]+/g)) {
                        const stringValue: IAxisSet[] = [];
                        let outOfRange: IAxisSet;
                        const alphaNumbervalue: IAxisSet[] = [];
                        const nullValue: IAxisSet[] = [];
                        for (let i: number = 0; i < hierarchy.length; i++) {
                            if (isNullOrUndefined(hierarchy[i as number].actualText.toString().match(/\d+/))) {
                                stringValue.push(hierarchy[i as number]);
                                if (!outOfRange && childrens.sort !== 'None') {
                                    if (hierarchy[i as number].actualText === 'Out of Range') {
                                        outOfRange = hierarchy[i as number];
                                        hierarchy.splice(i, 1);
                                    }
                                }
                            }
                            else if (hierarchy[i as number].actualText === '') {
                                nullValue.push(hierarchy[i as number]);
                            }
                            else {
                                this.fieldList[fieldName as string].isAlphanumeric = true;
                                alphaNumbervalue.push(hierarchy[i as number]);
                                break;
                            }
                        }
                        if (outOfRange) {
                            if (childrens.sort === 'Ascending') {
                                if (hierarchy[0].actualText === 'Grand Total') {
                                    hierarchy.splice(1, 0, outOfRange);
                                }
                                else {
                                    hierarchy.splice(0, 0, outOfRange);
                                }
                            }
                            else {
                                if (hierarchy[hierarchy.length - 1].actualText === 'Grand Total') {
                                    hierarchy.splice(hierarchy.length - 1, 0, outOfRange);
                                }
                                else {
                                    hierarchy.splice(hierarchy.length, 0, outOfRange);
                                }
                            }
                        }
                        if (alphaNumbervalue.length > 0) {
                            this.sortHeaders(fieldName, childrens, hierarchy, childrens.sort, childrens.isAlphanumeric);
                        }
                        return hierarchy;
                    }
                    else {
                        return this.sortHeaders(fieldName, childrens, hierarchy, childrens.sort, childrens.type);
                    }
                }
            }
            else {
                return hierarchy;
            }
        } else {
            return hierarchy;
        }
    }
    private getOrderedIndex(headers: IAxisSet[]): { [key: number]: number } {
        const orderedIndex: { [key: number]: number } = {};
        for (let i: number = 0; i < headers.length; i++) {
            if (headers[i as number].type !== 'grand sum') {
                orderedIndex[headers[i as number].ordinal] = i;
            }
        }
        return orderedIndex;
    }

    private insertPosition(
        keys: IFieldOptions[], data: IDataSet[] | string[][], keyInd?: number, position?: number[], axis?: string,
        parentMember?: string, slicedHeaders?: IAxisSet[]
    ): IAxisSet[] {
        const hierarchy: IAxisSet[] = [];
        const orderedIndex: { [key: number]: number } = this.getOrderedIndex(slicedHeaders);
        if (keys) {
            const decisionObj: IIterator = {};
            const field: string = keys[keyInd as number].name;
            const childrens: IField = this.fieldList[field as string];
            for (let pos: number = 0, lt: number = position.length; pos < lt; pos++) {
                const member: IAxisSet = {};
                const memInd: number = this.valueMatrix[position[pos as number]][childrens.index].ordinal;
                const slicedHeader: IAxisSet = slicedHeaders[orderedIndex[memInd as number]];
                let value: string | number | Date = (data as IDataSet[])[position[pos as number]][
                    this.fieldKeys[field as string] as number | string];
                value = value === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(value)) : value;
                const formattedValue: IAxisSet = (this.formatFields[field as string] &&
                    (['date', 'dateTime', 'time'].indexOf(this.formatFields[field as string].type) > -1)) ?
                    this.getFormattedValue(value as string, field) : { formattedText: value.toString(), actualText: value.toString() };
                if (!(slicedHeader && slicedHeader.formattedText === formattedValue.formattedText)) {
                    continue;
                }
                if (!(decisionObj && decisionObj[memInd as number])) {
                    decisionObj[memInd as number] = { index: [], indexObject: {} };
                    slicedHeader.index = decisionObj[memInd as number].index = [position[pos as number]];
                    decisionObj[memInd as number].indexObject[position[pos as number]] = position[pos as number];
                    slicedHeader.indexObject = decisionObj[memInd as number].indexObject;
                    slicedHeader.valueSort = {};
                    slicedHeader.valueSort.axis = field;
                    if (keyInd !== 0) {
                        slicedHeader.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter +
                            slicedHeader.formattedText;
                        slicedHeader.valueSort[parentMember + this.valueSortSettings.headerDelimiter +
                            slicedHeader.formattedText] = 1;
                        slicedHeader.valueSort.uniqueName = parentMember + this.valueSortSettings.headerDelimiter +
                            (slicedHeader.actualText ? slicedHeader.actualText : slicedHeader.formattedText);
                        slicedHeader.valueSort[parentMember + this.valueSortSettings.headerDelimiter +
                            (slicedHeader.actualText ? slicedHeader.actualText : slicedHeader.formattedText)] = 1;
                    } else {
                        slicedHeader.valueSort[slicedHeader.formattedText] = 1;
                        slicedHeader.valueSort.levelName = slicedHeader.formattedText;
                        slicedHeader.valueSort[(slicedHeader.actualText ? slicedHeader.actualText : slicedHeader.formattedText)] = 1;
                        slicedHeader.valueSort.uniqueName =
                            (slicedHeader.actualText ? slicedHeader.actualText : slicedHeader.formattedText);
                    }
                    member.members = [];
                    hierarchy.push(member);
                } else {
                    decisionObj[memInd as number].index.push(position[pos as number]);
                    decisionObj[memInd as number].indexObject[position[pos as number]] = position[pos as number];
                }
            }
            let diff: number = slicedHeaders.length - hierarchy.length;
            while (diff > 0) {
                hierarchy.push({ members: [] });
                diff--;
            }
            for (let iln: number = 0, ilt: number = hierarchy.length; iln < ilt; iln++) {
                if (slicedHeaders[iln as number].members.length > 0) {
                    let level: string = null;
                    if (slicedHeaders[iln as number].valueSort && slicedHeaders[iln as number].valueSort.levelName) {
                        level = slicedHeaders[iln as number].valueSort.levelName as string;
                    }
                    parentMember = (level || slicedHeaders[iln as number].formattedText) as string;
                    hierarchy[iln as number].members = this.insertPosition(
                        keys, data, keyInd + 1, slicedHeaders[iln as number].index, axis, parentMember,
                        slicedHeaders[iln as number].members);
                }
            }
            return hierarchy;
        } else {
            return hierarchy;
        }
    }
    private insertTotalPosition(headers: IAxisSet[]): IAxisSet[] {
        const summCell: IAxisSet = headers[headers.length - 1];
        if (summCell && summCell.type === 'grand sum') {
            summCell.index = this.filterMembers;
            summCell.indexObject = {};
            for (let ln: number = 0, lt: number = this.filterMembers.length; ln < lt; ln++) {
                summCell.indexObject[this.filterMembers[ln as number]] = this.filterMembers[ln as number];
            }
        }
        return headers;
    }
    private calculatePagingValues(): void {
        if (this.isPagingOrVirtualizationEnabled) {
            if (this.valueAxis === 1) {
                this.rowValuesLength = this.dataSourceSettings.values.length;
            } else {
                this.colValuesLength = this.dataSourceSettings.values.length;
            }
            this.columnPageCount = Math.ceil(this.columnCount / this.pageSettings.columnPageSize);
            this.rowPageCount = Math.ceil(this.rowCount / this.pageSettings.rowPageSize);
            this.pageSettings.currentColumnPage = this.pageSettings.currentColumnPage >= this.columnPageCount ||
                (this.enableOptimizedRendering && this.pageSettings.currentColumnPage > 1 &&
                    ((this.pageSettings.currentColumnPage + 1) * this.colValuesLength) >= this.columnPageCount) ?
                this.columnPageCount : this.pageSettings.currentColumnPage;
            this.pageSettings.currentRowPage = this.pageSettings.currentRowPage >= this.rowPageCount  ||
                (this.enableOptimizedRendering && this.pageSettings.currentRowPage > 1 &&
                    ((this.pageSettings.currentRowPage + 1) * this.rowValuesLength) >= this.rowPageCount) ?
                this.rowPageCount : this.pageSettings.currentRowPage;
            const requirePageCount: number = this.enablePaging || this.enableOptimizedRendering ? 1 : 3;
            this.memberCnt = this.enablePaging ? 0 : -this.rowValuesLength;
            this.rowStartPos = ((this.pageSettings.currentRowPage * this.pageSettings.rowPageSize) -
                (this.pageSettings.rowPageSize)) * (this.enablePaging ? 1 : this.rowValuesLength) + (this.enablePaging ? 1 : 0);
            let exactStartPos: number = this.enablePaging ? this.rowStartPos :
                (this.rowStartPos + (this.pageSettings.rowPageSize * requirePageCount * this.rowValuesLength)) > this.rowCount ?
                    (this.rowCount - (this.pageSettings.rowPageSize * requirePageCount * this.rowValuesLength)) : this.rowStartPos;
            if (exactStartPos < 0) {
                exactStartPos = this.rowStartPos = 0;
                this.pageSettings.currentRowPage = 1;
            }
            this.rowFirstLvl = (this.rowStartPos - exactStartPos) % this.pageSettings.rowPageSize;
            this.rowStartPos = exactStartPos;
            this.endPos = this.rowStartPos + (this.pageSettings.rowPageSize * requirePageCount * (this.enablePaging ? 1 :
                this.rowValuesLength)) - (this.enablePaging ? 1 : 0);
            this.endPos = this.endPos > (this.rowCount + 1) ? (this.rowCount + 1) : this.endPos;
            this.rMembers = this.performSlicing(this.rMembers, [], this.rowStartPos, 'row');
            this.memberCnt = this.enablePaging ? 0 : -this.colValuesLength; this.pageInLimit = false; this.colHdrBufferCalculated = false;
            this.colStartPos = ((this.pageSettings.currentColumnPage * this.pageSettings.columnPageSize) -
                (this.pageSettings.columnPageSize)) * (this.enablePaging ? 1 : this.colValuesLength) + (this.enablePaging ? 1 : 0);
            exactStartPos = this.enablePaging ? this.colStartPos : (this.colStartPos + (this.pageSettings.columnPageSize *
                requirePageCount * this.colValuesLength)) > this.columnCount ? (this.columnCount - (this.pageSettings.columnPageSize *
                    requirePageCount * this.colValuesLength)) : this.colStartPos;
            if (exactStartPos < 0) {
                exactStartPos = this.colStartPos = 0;
                this.pageSettings.currentColumnPage = 1;
            }
            this.colFirstLvl = (this.colStartPos - exactStartPos) % this.pageSettings.columnPageSize;
            this.colStartPos = exactStartPos;
            this.endPos = this.colStartPos + (this.pageSettings.columnPageSize * requirePageCount *
                (this.enablePaging ? 1 : this.colValuesLength)) - (this.enablePaging ? 1 : 0);
            this.endPos = this.endPos > (this.columnCount + 1) ? (this.columnCount + 1) : this.endPos;
            this.cMembers = this.performSlicing(this.cMembers, [], this.colStartPos, 'column');
            this.memberCnt = -1; this.pageInLimit = false;
            if (this.isValueHasAdvancedAggregate) {
                if (this.rMembers[this.rMembers.length - 1].type !== 'grand sum' &&
                    this.headerCollection.rowHeaders[this.headerCollection.rowHeaders.length - 1].type === 'grand sum') {
                    this.rMembers.push(this.headerCollection.rowHeaders[this.headerCollection.rowHeaders.length - 1]);
                    this.removeRowGrandTotal = true;
                }
                if (this.cMembers[this.cMembers.length - 1].type !== 'grand sum' &&
                    this.headerCollection.columnHeaders[this.headerCollection.columnHeaders.length - 1].type === 'grand sum') {
                    this.cMembers.push(this.headerCollection.columnHeaders[this.headerCollection.columnHeaders.length - 1]);
                    this.removeColumnGrandTotal = true;
                }
            } else {
                this.rowGrandTotal = this.rowGrandTotal ? this.rowGrandTotal :
                    this.headerCollection.rowHeaders[this.headerCollection.rowHeaders.length - 1];
                this.columnGrandTotal = this.columnGrandTotal ? this.columnGrandTotal :
                    this.headerCollection.columnHeaders[this.headerCollection.columnHeaders.length - 1];
            }
        }
    }
    private performSlicing(headers: IAxisSet[], slicedHeaders: IAxisSet[], startPos: number, axis: string): IAxisSet[] {
        let pos: number = 0;
        while (headers[pos as number]) {
            if (this.enablePaging && this.endPos <= this.memberCnt && pos !== 0) {
                break;
            }
            this.memberCnt += headers[pos as number].level <= this.measureIndex ? (axis === 'column' ? this.colValuesLength : this.rowValuesLength) : 1;
            if (startPos <= this.memberCnt && this.endPos >= this.memberCnt && !this.pageInLimit) {
                if (axis === 'column') {
                    this.colFirstLvl = this.colFirstLvl + headers[pos as number].level;
                } else {
                    this.rowFirstLvl = this.rowFirstLvl + headers[pos as number].level;
                }
                this.isParentLevelAdded = axis === 'column' ? (this.colFirstLvl > 0 ? false : true) : (this.rowFirstLvl > 0 ? false : true);
                this.pageInLimit = true;
            }
            if (this.pageInLimit && !this.enablePaging) {
                if (this.endPos <= this.memberCnt) {
                    if (axis === 'column') {
                        if (headers[pos as number].members.length === 0) {
                            if (this.colHdrBufferCalculated) {
                                break;
                            }
                            this.colHdrBufferCalculated = true;
                            this.endPos += (headers[pos as number].level * this.colValuesLength);
                        } else if (this.colHdrBufferCalculated) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            slicedHeaders.push(headers[pos as number].members.length > 0 ?
                this.removeChildMembers(headers[pos as number] as { [key: string]: Object }) : headers[pos as number]);
            if (headers[pos as number].members.length > 0) {
                if (axis === 'column') {
                    this.memberCnt -= !(this.dataSourceSettings.showSubTotals && this.dataSourceSettings.showColumnSubTotals &&
                        this.columnKeys[(headers[pos as number].valueSort as { [key: string]: number }).axis].showSubTotals) ?
                        this.colValuesLength : 0;
                } else if (this.showSubTotalsAtBottom) {
                    this.memberCnt++;
                }
                slicedHeaders[slicedHeaders.length - 1].members =
                    this.performSlicing(headers[pos as number].members, [], startPos, axis);
            }
            if (!this.isParentLevelAdded && this.enablePaging) {
                this.memberCnt += (slicedHeaders[slicedHeaders.length - 1].level <= this.measureIndex ?
                    (axis === 'column' ? this.colValuesLength : this.rowValuesLength) : 1) * slicedHeaders[slicedHeaders.length - 1].level;
                this.isParentLevelAdded = true;
            }
            if (!this.pageInLimit) {
                slicedHeaders.pop();
            }
            if (headers[pos as number].level === 0 && this.pageInLimit && this.endPos <= this.memberCnt) {
                break;
            }
            pos++;
        }
        return slicedHeaders;
    }
    private removeChildMembers(member: { [key: string]: Object }): IAxisSet {
        const keys: string[] = Object.keys(member);
        let keyPos: number = 0;
        const framedMember: { [key: string]: Object } = {};
        while (keyPos < keys.length) {
            framedMember[keys[keyPos as number]] = member[keys[keyPos as number]];
            if (keys[keyPos as number] === 'members') {
                framedMember['members'] = [];
            }
            keyPos++;
        }
        return framedMember;
    }
    private insertAllMember(set: IAxisSet[], filter: number[], customText?: string, axis?: string): IAxisSet[] {
        const len: number = set.length;
        customText = ' Total';
        const grandTotalSet: IAxisSet = {
            hasChild: false,
            index: filter,
            level: 0,
            axis: axis,
            isDrilled: false,
            indexObject: {},
            members: [],
            actualText: 'Grand' + customText,
            formattedText: this.localeObj ? this.localeObj.getConstant('grandTotal') : ('Grand' + customText),
            ordinal: len,
            type: 'grand sum',
            valueSort: {}
        };
        grandTotalSet.valueSort[grandTotalSet.formattedText] = 1;
        grandTotalSet.valueSort.levelName = grandTotalSet.formattedText;
        grandTotalSet.valueSort[grandTotalSet.actualText] = 1;
        grandTotalSet.valueSort.uniqueName = grandTotalSet.actualText;
        for (let ln: number = 0, lt: number = filter.length; ln < lt; ln++) {
            grandTotalSet.indexObject[filter[ln as number]] = filter[ln as number];
        }
        if (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals) {
            set.unshift(grandTotalSet);
        } else {
            set.push(grandTotalSet);
        }
        // if (axis === 'row') {
        //     this.rowCount += this.rowValuesLength;
        // } else {
        //     this.columnCount += this.colValuesLength;
        // }
        return set;
    }
    private getTableData(
        rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], pIndex: number, data: IAxisSet[][],
        vlt: number, level: number, rTotal?: IAxisSet, cTotal?: IAxisSet, valueParentIndex?: number): void {
        for (let rlt: number = rows.length, rln: number = 0; rln < rlt; rln++) {
            const tnum: number = (!this.valueAxis && !this.isLastHeaderHasMeasures && data.length <
                (this.dataSourceSettings.columns.length + 1)) ? (this.dataSourceSettings.columns.length + 1) : data.length;
            const row: IAxisSet = rows[rln as number];
            reformAxis[tnum as number] = row;
            const actCnt: number = tnum - Number(Object.keys(reformAxis)[0]);
            const isLeastNode: boolean = !reformAxis[tnum as number].members.length;
            row.colIndex = 0;
            row.rowIndex = tnum;
            let isRowFieldsAvail: boolean = false;
            const delimiter: string = this.dataSourceSettings.valueSortSettings.headerDelimiter;
            if (this.valueAxis && this.dataSourceSettings.rows.length === 0 && this.dataSourceSettings.values.length > 1) {
                this.rowIndex = (isNullOrUndefined(this.rowIndex) && !isLeastNode &&
                    this.dataSourceSettings.rows.length === 0) ? row.index : this.rowIndex;
                isRowFieldsAvail = (this.valueAxis && this.dataSourceSettings.rows.length === 0 && row.valueSort.levelName &&
                        row.valueSort.levelName.toString().indexOf('Grand Total' + delimiter) !== 0);
                if (this.valueAxis && this.dataSourceSettings.rows.length === 0 &&
                        row.valueSort.levelName.toString().indexOf('Grand Total' + delimiter) === 0) {
                    row.index = this.rowIndex;
                }
            }
            if (!isRowFieldsAvail) {
                let isValue: boolean = false;
                if (this.showSubTotalsAtBottom && reformAxis[pIndex as number] && reformAxis[pIndex as number].hasChild) {
                    let axis: IAxisSet;
                    for (axis of reformAxis[pIndex as number].members) {
                        if (axis.type === 'value') {
                            isValue = true;
                            break;
                        }
                    }
                }
                if (isValue && !reformAxis[tnum as number].isSum && reformAxis[tnum as number].members &&
                    reformAxis[tnum as number].members.length === 0) {
                    continue;
                }
                if (!data[tnum as number]) {
                    data[tnum as number] = [];
                    this.valueContent[actCnt as number] = {} as IAxisSet[];
                }
                data[tnum as number][0] = reformAxis[tnum as number]
                    = this.valueContent[actCnt as number][0] = PivotUtil.getFormattedHeader(row, this);
                if (this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader)) {
                    const hPos: number = tnum;
                    const actpos: number = actCnt;
                    const rowIndex: number = tnum;
                    let isValueCellUpdated: boolean = false;
                    if ((((!(level === 0 && this.measureIndex === 0) && !isLeastNode) || isLeastNode) && row.type === 'value' && !row.valueSort.axis) ||
                        (level > this.measureIndex && row.axis === 'row' && row.valueSort.axis)) {
                        let vln: number = 0;
                        let isValueIndexFound: boolean = false;
                        const rowUniqueName: string[] = row.valueSort.uniqueName ?
                            row.valueSort.uniqueName.toString().split(this.valueSortSettings.headerDelimiter) : [];
                        for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                            if (!isValueIndexFound) {
                                for (vln = 0; vln < vlt; vln++) {
                                    if (rowUniqueName.indexOf(this.dataSourceSettings.values[vln as number].name) > -1) {
                                        isValueIndexFound = true;
                                        isValueCellUpdated = true;
                                        break;
                                    }
                                }
                            }
                            if (level > this.measureIndex && row.axis === 'row' && row.valueSort.axis) {
                                this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal);
                            } else {
                                if (!reformAxis[pIndex as number]) {
                                    isValueCellUpdated = false;
                                    break;
                                }
                                const parentIndex: number = this.showSubTotalsAtBottom && valueParentIndex ? valueParentIndex : pIndex;
                                this.updateRowData(reformAxis, columns, tnum, data, vln, parentIndex, cln, dln, actCnt, rTotal, cTotal);
                            }
                            dln = data[tnum as number].length;
                        }
                    }
                    if (!isValueCellUpdated) {
                        for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                            dln = data[tnum as number].length;
                            data[hPos as number][dln as number] = this.valueContent[actpos as number][dln as number] = {
                                axis: 'value', actualText: '', colSpan: 1,
                                colIndex: dln, formattedText: '', hasChild: false
                            };
                        }
                    }
                    this.recursiveRowData(rows, reformAxis, columns, rowIndex, data, vlt, isLeastNode, rln, vlt, level, rTotal, cTotal);
                } else {
                    for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                        const columnUniqueName: string[] = columns[cln as number].valueSort.uniqueName ?
                            columns[cln as number].valueSort.uniqueName.toString().split(this.valueSortSettings.headerDelimiter) : [];
                        for (let vln: number = 0; vln < vlt; vln++) {
                            if (!this.valueAxis && !this.isLastHeaderHasMeasures) {
                                if (columnUniqueName.indexOf(this.dataSourceSettings.values[vln as number].name) > -1) {
                                    this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal);
                                    dln = data[tnum as number].length;
                                }
                            } else {
                                this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal);
                                dln = data[tnum as number].length;
                            }
                        }
                    }
                    this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, 0, level, rTotal, cTotal);
                }
            } else if (!isLeastNode) {
                this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, 0, level, rTotal, cTotal);
            }
        }
    }
    private insertRowSubTotals(
        reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IAxisSet[][],
        vlt: number, level: number, rTotal: IAxisSet, cTotal: IAxisSet): void {
        const isValueAxis: boolean = reformAxis[tnum as number].type ? reformAxis[tnum as number].type === 'value' &&
            (reformAxis[tnum as number].valueSort.levelName as string) !== reformAxis[tnum as number].actualText : false;
        if (reformAxis[tnum as number].hasChild && reformAxis[tnum as number].members.length > 0) {
            let parentIndexes: number[] = [];
            const subTotal: IAxisSet = PivotUtil.frameHeaderWithKeys(reformAxis[tnum as number]);
            if (reformAxis[tnum as number].members[0].type === 'value') {
                let startIndex: number = 0;
                const valueCells: IAxisSet[] = [];
                let i: number = 1;
                for (const axis of subTotal.members) {
                    if (axis.type === 'value') {
                        valueCells[valueCells.length] = axis;
                    }
                }
                while (startIndex < (valueCells as IAxisSet[]).length) {
                    const valueCell: IAxisSet = PivotUtil.frameHeaderWithKeys(valueCells[startIndex as number]);
                    let index: number;
                    for (i; i < reformAxis.length; i++) {
                        if (reformAxis[i as number] && reformAxis[i as number].valueSort.levelName === valueCell.valueSort.levelName) {
                            index = reformAxis.indexOf(reformAxis[i as number]);
                            break;
                        }
                    }
                    if (index > -1) {
                        parentIndexes[parentIndexes.length] = index;
                    }
                    valueCell.formattedText = subTotal.formattedText + ' ' + valueCell.formattedText;
                    valueCell.isSum = true; valueCell.members = [];
                    this.getTableData([valueCell], reformAxis, columns, tnum, data, vlt, level, rTotal, cTotal);
                    startIndex++;
                }
            } else {
                subTotal.formattedText = subTotal.formattedText + ' Total';
                subTotal.members = []; subTotal.isDrilled = false; subTotal.hasChild = false;
                subTotal.isSum = true; subTotal.type = 'sum';
                const parentIndex: number = isValueAxis ? this.getParentIndex(reformAxis, subTotal) : 0;
                this.getTableData([subTotal], reformAxis, columns, tnum, data, vlt, level, rTotal, cTotal, parentIndex);
                parentIndexes = [tnum as number];
            }
            for (let index: number = 0; index < parentIndexes.length; index++) {
                let parentInfo: IAxisSet[] = data[parentIndexes[index as number]] as IAxisSet[];
                parentInfo = parentInfo.map((dataValue: IAxisSet) => {
                    dataValue.formattedText = dataValue.colIndex === 0 ? dataValue.formattedText : '';
                    return dataValue;
                });
                data[parentIndexes[index as number]] = parentInfo;
            }
        }
    }
    private getParentIndex(reformAxis: IAxisSet[], axis: IAxisSet): number {
        let parentIndex: number = 0;
        for (let i: number = reformAxis.length - 1; i > 0; i--) {
            if (axis.level === reformAxis[i as number].level && reformAxis[i as number].index) {
                parentIndex = i;
                break;
            }
        }
        return parentIndex;
    }
    private getAggregatedHeaders(
        rows: IFieldOptions[], columns: IFieldOptions[], rMembers: IAxisSet[], cMembers: IAxisSet[], values: IFieldOptions[]): void {
        this.selectedHeaders = { selectedHeader: [], values: [] };
        for (let vlt: number = values.length, vln: number = 0; vln < vlt; vln++) {
            switch (values[vln as number].type) {
            case 'DifferenceFrom':
            case 'PercentageOfDifferenceFrom':
                {
                    let baseField: string;
                    let baseItem: string;
                    this.selectedHeaders.values.push(values[vln as number].name);
                    if (values[vln as number].baseField && values[vln as number].baseItem) {
                        baseField = values[vln as number].baseField;
                        baseItem = values[vln as number].baseItem;
                    } else if (this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader) &&
                        columns.length > 0) {
                        baseField = columns[0].name;
                        baseItem = Object.keys(this.fieldList[columns[0].name].members)[0];
                    } else if (rows.length > 0) {
                        baseField = rows[0].name;
                        baseItem = Object.keys(this.fieldList[rows[0].name].members)[0];
                    }
                    let isHeaderSelected: boolean = false;
                    for (const row of rows) {
                        if (row.name === baseField) {
                            this.getAggregatedHeaderData(rMembers, values[vln as number].name, baseItem, false, 'row', values[vln as number].type, this.selectedHeaders.selectedHeader, vln);
                            isHeaderSelected = true;
                            break;
                        }
                    }
                    if (!isHeaderSelected) {
                        for (const column of columns) {
                            if (column.name === baseField) {
                                this.getAggregatedHeaderData(cMembers, values[vln as number].name, baseItem, false, 'column', values[vln as number].type, this.selectedHeaders.selectedHeader, vln);
                                break;
                            }
                        }
                    }
                }
                break;
            case 'PercentageOfParentRowTotal':
            case 'PercentageOfParentColumnTotal':
                {
                    this.selectedHeaders.values.push(values[vln as number].name);
                    this.getAggregatedHeaderData((values[vln as number].type === 'PercentageOfParentRowTotal' ? rMembers : cMembers), values[vln as number].name, undefined, false, (values[vln as number].type === 'PercentageOfParentRowTotal' ? 'row' : 'column'), values[vln as number].type, this.selectedHeaders.selectedHeader, vln);
                }
                break;
            case 'RunningTotals':
                {
                    this.selectedHeaders.values.push(values[vln as number].name);
                    this.getAggregatedHeaderData((this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader) ? cMembers : rMembers), values[vln as number].name, undefined, false, (this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader) ? 'column' : 'row'), values[vln as number].type, this.selectedHeaders.selectedHeader, vln);
                }
                break;
            case 'PercentageOfParentTotal':
                {
                    let baseField: string;
                    this.selectedHeaders.values.push(values[vln as number].name);
                    if (values[vln as number].baseField) {
                        baseField = values[vln as number].baseField;
                    } else if (this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader) &&
                        columns.length > 0) {
                        baseField = columns[0].name;
                    } else if (rows.length > 0) {
                        baseField = rows[0].name;
                    }
                    let isHeaderSelected: boolean = false;
                    for (let len: number = rows.length, i: number = 0; i < len; i++) {
                        if (rows[i as number].name === baseField) {
                            const level: number = i >= this.measureIndex ? i + 1 : i;
                            this.getAggregatedHeaderData(rMembers, values[vln as number].name, undefined, false, 'row', values[vln as number].type, this.selectedHeaders.selectedHeader, vln, level);
                            isHeaderSelected = true;
                            break;
                        }
                    }
                    if (!isHeaderSelected) {
                        for (let len: number = columns.length, i: number = 0; i < len; i++) {
                            if (columns[i as number].name === baseField) {
                                let level: number = i;
                                if (!this.valueAxis && !this.isLastHeaderHasMeasures) {
                                    level = i >= this.measureIndex ? i + 1 : i;
                                }
                                this.getAggregatedHeaderData(cMembers, values[vln as number].name, undefined, false, 'column', values[vln as number].type, this.selectedHeaders.selectedHeader, vln, level);
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    private getAggregatedHeaderData(
        headers: IAxisSet[], name: string, baseItem: string, isChildren: boolean, type: string, aggregateType: SummaryTypes,
        selectedHeaders: IHeaderData[], vln: number, level?: number): void {
        for (const rln of headers) {
            switch (aggregateType) {
            case 'DifferenceFrom':
            case 'PercentageOfDifferenceFrom':
                {
                    const levelName: string[] = rln.valueSort.levelName.toString().split(this.valueSortSettings.headerDelimiter);
                    if (levelName.indexOf(baseItem) !== -1) {
                        const actualHeaders: IAxisSet[] = [];
                        if (!isChildren && type === 'row') {
                            for (const header of headers) {
                                if (header.level >= rln.level) {
                                    actualHeaders.push(header);
                                }
                            }
                        }
                        selectedHeaders.push(this.updateSelectedHeaders(baseItem, rln.level, type, isChildren, name, aggregateType, rln.valueSort.levelName as string, (isChildren ? [rln as IAxisSet] : (type === 'column' ? headers : actualHeaders)), vln + 1));
                        if (rln.members.length > 0) {
                            let isValuesAvail: boolean = false;
                            const members: IAxisSet[] = [];
                            if (type === 'row') {
                                for (const member of rln.members) {
                                    if (member.type === 'value' && member.members.length === 0) {
                                        isValuesAvail = true;
                                    } else {
                                        members.push(member);
                                        isValuesAvail = false;
                                        break;
                                    }
                                }
                            }
                            if ((!isValuesAvail && members.length > 0) || type === 'column') {
                                this.getAggregatedHeaderData(type === 'column' ? rln.members : members, name, baseItem, true, type, aggregateType, selectedHeaders[selectedHeaders.length - 1].childMembers, vln);
                            }
                        }
                    } else if (rln.members.length > 0) {
                        this.getAggregatedHeaderData(rln.members, name, baseItem, false, type, aggregateType, selectedHeaders, vln);
                    }
                }
                break;
            case 'RunningTotals':
            case 'PercentageOfParentRowTotal':
            case 'PercentageOfParentColumnTotal':
                {
                    if (rln.type === 'grand sum') {
                        selectedHeaders.push(this.updateSelectedHeaders(
                            undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName as string, headers, vln + 1));
                    } else {
                        if (rln.members.length > 0) {
                            selectedHeaders.push(this.updateSelectedHeaders(
                                undefined, rln.level, type, false, name, aggregateType,
                                rln.valueSort.levelName as string, rln.members, vln + 1));
                            this.getAggregatedHeaderData(rln.members, name, undefined, false, type, aggregateType, selectedHeaders, vln);
                        }
                    }
                }
                break;
            case 'PercentageOfParentTotal':
                {
                    if (rln.type !== 'grand sum') {
                        if (((rln.valueSort.levelName as string).split(this.valueSortSettings.headerDelimiter).length - 1) === level) {
                            if (rln.members.length > 0) {
                                if (isChildren) {
                                    const aggregateHeaders: IAxisSet[] = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                    for (const member of rln.members) {
                                        aggregateHeaders.push(extend({}, member, null, true) as IAxisSet);
                                    }
                                } else {
                                    const children: IAxisSet[] = extend([], rln.members, null, true) as IAxisSet[];
                                    selectedHeaders.push(this.updateSelectedHeaders(
                                        undefined, rln.level, type, false, name, aggregateType,
                                        rln.valueSort.levelName as string, children, vln + 1));
                                    const aggregateHeaders: IAxisSet[] = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                    aggregateHeaders.push(extend({}, rln, null, true) as IAxisSet);
                                }
                                this.getAggregatedHeaderData(
                                    rln.members, name, undefined, true, type, aggregateType, selectedHeaders, vln, level + 1);
                            } else {
                                if (!isChildren) {
                                    selectedHeaders.push(
                                        this.updateSelectedHeaders(
                                            undefined, rln.level, type, false, name, aggregateType,
                                            rln.valueSort.levelName as string, [rln as IAxisSet], vln + 1));
                                }
                            }
                        } else if (rln.members.length > 0) {
                            this.getAggregatedHeaderData(
                                rln.members, name, undefined, false, type, aggregateType, selectedHeaders, vln, level);
                        }
                    }
                }
                break;
            }
        }
    }
    private updateSelectedHeaders(
        baseItem: string, level: number, type: string, isChildren: boolean, name: string, aggregateType: SummaryTypes,
        levelName: string, headers: IAxisSet[], vCount: number): IHeaderData {
        const headerData: IHeaderData = {
            name: baseItem,
            level: level,
            axis: type,
            isChild: isChildren,
            value: name,
            type: aggregateType,
            uniqueName: levelName,
            aggregateHeaders: extend([], headers, null, true) as IAxisSet[],
            childMembers: [],
            valueCount: vCount
        };
        return headerData;
    }
    private applyAdvancedAggregate(rowheads: IAxisSet[], colheads: IAxisSet[], data: IAxisSet[][]): void {
        this.aggregatedValueMatrix = [];
        if (this.selectedHeaders.values.length > 0) {
            const pivotIndex: { [key: string]: [number, number] } = {};
            const colIndex: number[] = [];
            const rowIndex: number[] = [];
            let isIndexFilled: boolean = false;
            for (let rlt: number = data.length, rln: number = 0; rln < rlt; rln++) {
                if (data[rln as number] !== undefined && data[rln as number][0] !== undefined) {
                    if (!isIndexFilled) {
                        for (let clt: number = (data[rln as number] as IAxisSet[][]).length, cln: number = 0; cln < clt; cln++) {
                            const actualText: string = (data[rln as number][cln as number] as IAxisSet).actualText as string;
                            if ((data[rln as number][cln as number] as IAxisSet).axis === 'value' &&
                                this.selectedHeaders.values.indexOf(actualText) !== -1) {
                                colIndex.push(cln);
                                isIndexFilled = true;
                            }
                        }
                    }
                    const isTotal: boolean = this.showSubTotalsAtBottom && (data[rln as number][0] as IAxisSet).isDrilled &&
                        (data[rln as number][0] as IAxisSet).hasChild;
                    if (!isTotal) {
                        if (colIndex.length > 0 && (data[rln as number][colIndex[0]] as IAxisSet).axis === 'value' &&
                            this.selectedHeaders.values.indexOf(
                                (data[rln as number][colIndex[0]] as IAxisSet).actualText as string) !== -1) {
                            rowIndex.push(rln);
                            for (const index of colIndex) {
                                pivotIndex[rln + ',' + index] = [rln, index];
                            }
                        }
                    }
                }
            }
            this.updateAggregates(rowheads, colheads, data, this.selectedHeaders.selectedHeader, colIndex, rowIndex, pivotIndex);
            const indexCollection: string[] = Object.keys(pivotIndex);
            for (const index of indexCollection) {
                const currentSet: IAxisSet = data[pivotIndex[index as string][0]][pivotIndex[index as string][1]] as IAxisSet;
                // currentSet.formattedText = '0';
                currentSet.formattedText = (this.selectedHeaders.selectedHeader.length > 0 ? this.emptyCellTextContent : '#N/A');
                if (!this.aggregatedValueMatrix[pivotIndex[index as string][0]]) {
                    this.aggregatedValueMatrix[pivotIndex[index as string][0]] = [];
                }
                this.aggregatedValueMatrix[pivotIndex[index as string][0]][pivotIndex[index as string][1]] = 0;
            }
            this.updatePivotValues(true);
        } else {
            return;
        }
    }
    private updateAggregates(
        rowheads: IAxisSet[], colheads: IAxisSet[], data: IAxisSet[][], selectedHeaders: IHeaderData[], colIndex: number[],
        rowIndex: number[], pivotIndex: { [key: string]: [number, number] }): void {
        for (const headers of selectedHeaders) {
            const selectedHeaderCollection: IAxisSet[] = headers.aggregateHeaders;
            const name: string = headers.value;
            // let valueCount: number = (this.valueAxis && (this.isMutiMeasures || this.dataSourceSettings.alwaysShowValueHeader) ? headers.valueCount : 0);
            const aggregateType: SummaryTypes = headers.type;
            const uniqueName: string = headers.uniqueName;
            const axis: string = headers.axis;
            const isRowBaseField: boolean = axis === 'row' ? true : false;
            let activeValues: IAxisSet;
            const indexCollection: [number, number][] = [];
            let activeColumn: IAxisSet[] = [];
            const columnHeaders: IAxisSet[] = [];
            const rowindexCollection: number[] = [];
            let selectedRowValues: IAxisSet[] = [];
            const selectedColumnValues: ISelectedValues = [];
            if ((['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal', 'RunningTotals']).indexOf(headers.type) !== -1) {
                if (isRowBaseField) {
                    if (headers.type !== 'RunningTotals') {
                        for (const rln of rowIndex) {
                            if (rowheads[rln as number] !== undefined) {
                                if (rowheads[rln as number].valueSort[uniqueName as string]) {
                                    activeValues = rowheads[rln as number];
                                    if (this.valueAxis === 0 || (this.valueAxis && data[rln as number] && data[rln as number][1] &&
                                        (data[rln as number][1] as IAxisSet).actualText === name)) {
                                        selectedRowValues = data[rln as number] as IAxisSet[];
                                    } else {
                                        selectedRowValues = [];
                                    }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let len: number = data.length, i: number = 0; i < len; i++) {
                        if (data[i as number] !== undefined && data[i as number][0] === undefined) {
                            columnHeaders.push(data[i as number] as IAxisSet);
                        } else {
                            break;
                        }
                    }
                    let len: number = columnHeaders.length;
                    while (len--) {
                        const axisObj: IAxisSet = (columnHeaders[len as number] as IAxisSet[])[colIndex[0]];
                        const cLevelName: string = axisObj.actualText as string;
                        if (this.selectedHeaders.values.indexOf(cLevelName) === -1) {
                            activeColumn = columnHeaders[len as number] as IAxisSet[];
                            len = 0;
                        }
                    }
                    if (headers.type !== 'RunningTotals') {
                        for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                            let isSelectedColumn: boolean = false;
                            if (activeColumn[cln as number] !== undefined && activeColumn[cln as number].valueSort[uniqueName as string]) {
                                activeValues = activeColumn[cln as number];
                                for (let len: number = data.length, i: number = 0; i < len; i++) {
                                    const axisObj: IAxisSet[] = (data[i as number] as IAxisSet[]);
                                    if (axisObj !== undefined && axisObj[0] !== undefined && (axisObj[cln as number] as IAxisSet).axis === 'value' && this.selectedHeaders.values.indexOf((axisObj[cln as number] as IAxisSet).actualText as string) !== -1) {
                                        isSelectedColumn = true;
                                        selectedColumnValues[i as number] = axisObj[cln as number] as IAxisSet;
                                        rowindexCollection.push(i);
                                    }
                                }
                                if (isSelectedColumn) { break; }
                            }
                        }
                        if ((selectedColumnValues as []).length === 0 && rowindexCollection.length === 0) {
                            for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                                let isSelectedColumn: boolean = false;
                                if (activeColumn[cln as number] !== undefined &&
                                        (activeColumn[cln as number].valueSort.levelName as string).indexOf(uniqueName) === 0) {
                                    activeValues = activeColumn[cln as number];
                                    for (let lnt: number = data.length, j: number = 0; j < lnt; j++) {
                                        const axisObj: IAxisSet[] = (data[j as number] as IAxisSet[]);
                                        if (axisObj !== undefined && axisObj[0] !== undefined && (axisObj[cln as number] as IAxisSet).axis === 'value' && this.selectedHeaders.values.indexOf((axisObj[cln as number] as IAxisSet).actualText as string) !== -1) {
                                            isSelectedColumn = true;
                                            // selectedColumnValues[i as number] = axisObj[cln as number] as IAxisSet;
                                            rowindexCollection.push(j);
                                        }
                                    }
                                    if (isSelectedColumn) { break; }
                                }
                            }
                        }
                    }
                }
            }
            switch (headers.type) {
            case 'DifferenceFrom':
            case 'PercentageOfDifferenceFrom':
                {
                    const isChildren: boolean = headers.isChild;
                    if (isRowBaseField) {
                        if (!isChildren) {
                            for (const item of selectedHeaderCollection) {
                                for (const rln of rowIndex) {
                                    if (rowheads[rln as number] !== undefined) {
                                        if (rowheads[rln as number].valueSort[item.valueSort.levelName as string] &&
                                            rowheads[rln as number].level === activeValues.level && rowheads[rln as number].type !== 'grand sum') {
                                            for (const index of colIndex) {
                                                const currentSet: IAxisSet = data[rln as number][index as number] as IAxisSet;
                                                if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                    indexCollection.push([rln, index]);
                                                    if (pivotIndex[rln + ',' + index]) {
                                                        delete pivotIndex[rln + ',' + index];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            const uniqueLevelName: string[] = uniqueName.split(this.valueSortSettings.headerDelimiter);
                            for (const rlen of rowIndex) {
                                if (rowheads[rlen as number] !== undefined) {
                                    const levelName: string[] = (rowheads[rlen as number].valueSort.levelName as string
                                    ).split(this.valueSortSettings.headerDelimiter);
                                    if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 && activeValues &&
                                        rowheads[rlen as number].level === activeValues.level) {
                                        for (const index of colIndex) {
                                            const currentSet: IAxisSet = data[rlen as number][index as number] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                indexCollection.push([rlen, index]);
                                                if (pivotIndex[rlen + ',' + index]) {
                                                    delete pivotIndex[rlen + ',' + index];
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }
                        for (const index of indexCollection) {
                            const currentSet: IAxisSet = data[index[0]][index[1]] as IAxisSet;
                            const actualValue: number = isNullOrUndefined((selectedRowValues[index[1]] as IAxisSet
                            ).actualValue) ? 0 : (selectedRowValues[index[1]] as IAxisSet).actualValue;
                            // let cVal: number = currentSet.value - (selectedRowValues[index[1]] as IAxisSet).value;
                            let cVal: number = (isNullOrUndefined(currentSet.actualValue) ? 0 : currentSet.actualValue) - actualValue;
                            cVal = isNaN(cVal) ? 0 : (currentSet.value === 0 && (selectedRowValues[index[1]] as IAxisSet
                            ).value === 0) ? 0 : cVal;
                            if (!this.aggregatedValueMatrix[index[0]]) {
                                this.aggregatedValueMatrix[index[0]] = [];
                            }
                            if (aggregateType === 'DifferenceFrom') {
                                this.aggregatedValueMatrix[index[0]][index[1]] = cVal;
                                currentSet.formattedText = cVal === 0 ? this.emptyCellTextContent :
                                    this.getFormattedValue(cVal, name).formattedText;
                            } else {
                                // cVal = ((selectedRowValues[index[1]] as IAxisSet).value === 0 ?
                                // 0 : (cVal / (selectedRowValues[index[1]] as IAxisSet).value));
                                cVal = (actualValue === 0 ? 0 : (cVal / actualValue));
                                this.aggregatedValueMatrix[index[0]][index[1]] = cVal;
                                currentSet.formattedText = currentSet.showSubTotals ? (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: this.getPercentFormat(this.formatFields, currentSet.actualText as string) }) : this.emptyCellTextContent) : currentSet.formattedText;
                            }
                        }
                    } else {
                        if (!isChildren) {
                            for (const item of selectedHeaderCollection) {
                                for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                                    let isSelectedColumn: boolean = false;
                                    if (activeColumn[cln as number] !== undefined &&
                                        activeColumn[cln as number].valueSort[item.valueSort.levelName as string] && activeValues &&
                                        activeColumn[cln as number].level === activeValues.level && activeColumn[cln as number].type !== 'grand sum') {
                                        for (const index of rowindexCollection) {
                                            const currentSet: IAxisSet = data[index as number][cln as number] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                isSelectedColumn = true;
                                                indexCollection.push([index, cln]);
                                                if (pivotIndex[index + ',' + cln]) {
                                                    delete pivotIndex[index + ',' + cln];
                                                }
                                            }
                                        }
                                        if (isSelectedColumn) { break; }
                                    }
                                }
                            }
                        } else {
                            const uniqueLevelName: string[] = uniqueName.split(this.valueSortSettings.headerDelimiter);
                            for (let clt: number = activeColumn.length, clen: number = 0; clen < clt; clen++) {
                                let isSelectedColumn: boolean = false;
                                if (activeColumn[clen as number] !== undefined) {
                                    const levelName: string[] =
                                    (activeColumn[clen as number].valueSort.levelName as string).split(
                                        this.valueSortSettings.headerDelimiter);
                                    if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                        activeColumn[clen as number].level === activeValues.level) {
                                        for (const index of rowindexCollection) {
                                            const currentSet: IAxisSet = data[index as number][clen as number] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                isSelectedColumn = true;
                                                indexCollection.push([index, clen]);
                                                if (pivotIndex[index + ',' + clen]) {
                                                    delete pivotIndex[index + ',' + clen];
                                                }
                                            }
                                        }
                                        if (isSelectedColumn) { break; }
                                    }
                                }
                            }
                        }
                        let selectedColumn: IAxisSet;
                        if ((selectedColumnValues as []).length === 0) {
                            selectedColumn = this.getSelectedColumn(headers.uniqueName, colheads);
                        }
                        for (const index of indexCollection) {
                            const currentSet: IAxisSet = data[index[0]][index[1]] as IAxisSet;
                            let selectedColumnValue: number = 0;
                            if ((selectedColumnValues as []).length === 0) {
                                const selectedRow: IAxisSet = this.getSelectedRow(currentSet.rowHeaders as string, rowheads);
                                selectedColumnValue = this.getAggregateValue(
                                    selectedRow.index, selectedColumn.indexObject, this.fieldList[name as string].index,
                                    headers.type, false);
                            } else {
                                selectedColumnValue = (selectedColumnValues[index[0]] as IAxisSet).value;
                            }
                            let cVal: number = currentSet.value - selectedColumnValue;
                            cVal = isNaN(cVal) ? 0 : cVal;
                            if (!this.aggregatedValueMatrix[index[0]]) {
                                this.aggregatedValueMatrix[index[0]] = [];
                            }
                            if (aggregateType === 'DifferenceFrom') {
                                currentSet.formattedText = cVal === 0 ? this.emptyCellTextContent :
                                    this.getFormattedValue(cVal, name).formattedText;
                                this.aggregatedValueMatrix[index[0]][index[1]] = cVal;
                            } else {
                                cVal = ((selectedColumnValues[index[0]] as IAxisSet).value === 0 ?
                                    0 : (cVal / (selectedColumnValues[index[0]] as IAxisSet).value));
                                currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: this.getPercentFormat(this.formatFields, currentSet.actualText as string) }) : this.emptyCellTextContent);
                                this.aggregatedValueMatrix[index[0]][index[1]] = cVal;
                            }
                        }
                    }
                    if (headers.childMembers.length > 0) {
                        this.updateAggregates(rowheads, colheads, data, headers.childMembers, colIndex, rowIndex, pivotIndex);
                    }
                }
                break;
            case 'PercentageOfParentRowTotal':
            case 'PercentageOfParentColumnTotal':
            case 'PercentageOfParentTotal':
                {
                    if (isRowBaseField) {
                        for (const item of selectedHeaderCollection) {
                            for (const i of rowIndex) {
                                if (rowheads[i as number] !== undefined) {
                                    if (rowheads[i as number].valueSort[item.valueSort.levelName as string] &&
                                        rowheads[i as number].level === item.level) {
                                        for (const index of colIndex) {
                                            const currentSet: IAxisSet = data[i as number][index as number] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                indexCollection.push([i, index]);
                                                if (pivotIndex[i + ',' + index]) {
                                                    delete pivotIndex[i + ',' + index];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        for (const i of indexCollection) {
                            const currentSet: IAxisSet = data[i[0]][i[1]] as IAxisSet;
                            // let cVal: number = currentSet.value / (selectedRowValues[i[1]] as IAxisSet).value;
                            let selectedRowValue: number = 0;
                            if (selectedRowValues.length === 0 && activeValues) {
                                selectedRowValue = this.getAggregateValue(
                                    activeValues.index, colheads[i[1] - 1].indexObject, this.fieldList[name as string].index,
                                    headers.type, false);
                            } else {
                                selectedRowValue = selectedRowValues[i[1]] ? (selectedRowValues[i[1]] as IAxisSet).actualValue : 0;
                            }
                            let cVal: number = currentSet.value / selectedRowValue;
                            cVal = isNaN(cVal) ? 0 : cVal;
                            currentSet.formattedText = currentSet.showSubTotals ? (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: this.getPercentFormat(this.formatFields, currentSet.actualText as string) }) : this.emptyCellTextContent) : currentSet.formattedText;
                            if (!this.aggregatedValueMatrix[i[0]]) {
                                this.aggregatedValueMatrix[i[0]] = [];
                            }
                            this.aggregatedValueMatrix[i[0]][i[1]] = cVal;
                        }
                    } else {
                        for (const item of selectedHeaderCollection) {
                            for (let clt: number = activeColumn.length, j: number = 0; j < clt; j++) {
                                let isSelectedColumn: boolean = false;
                                if (activeColumn[j as number] !== undefined &&
                                    activeColumn[j as number].valueSort[item.valueSort.levelName as string]) {
                                    for (const index of rowindexCollection) {
                                        const isTotals: boolean = this.showSubTotalsAtBottom && (
                                            data[index as number][0] as IAxisSet).isDrilled && (
                                            data[index as number][0] as IAxisSet).hasChild;
                                        if (!isTotals) {
                                            const currentSet: IAxisSet = data[index as number][j as number] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                isSelectedColumn = true;
                                                indexCollection.push([index, j]);
                                                if (pivotIndex[index + ',' + j]) {
                                                    delete pivotIndex[index + ',' + j];
                                                }
                                            }
                                        }
                                    }
                                    if (isSelectedColumn) { break; }
                                }
                            }
                        }
                        let selectedCol: IAxisSet;
                        if ((selectedColumnValues as []).length === 0) {
                            selectedCol = this.getSelectedColumn(headers.uniqueName, colheads);
                        }
                        for (const i of indexCollection) {
                            const currentSet: IAxisSet = data[i[0]][i[1]] as IAxisSet;
                            let selectedColValue: number = 0;
                            if ((selectedColumnValues as []).length === 0) {
                                const selectedRow: IAxisSet = this.getSelectedRow(currentSet.rowHeaders as string, rowheads);
                                selectedColValue = this.getAggregateValue(
                                    selectedRow.index, selectedCol.indexObject, this.fieldList[name as string].index, headers.type, false);
                            } else {
                                selectedColValue = (selectedColumnValues[i[0]] as IAxisSet).value;
                            }
                            let val: number = currentSet.value / selectedColValue;
                            val = isNaN(val) ? 0 : val;
                            currentSet.formattedText = (val !== 0 ? this.globalize.formatNumber(val, { format: 'P', maximumFractionDigits: this.getPercentFormat(this.formatFields, currentSet.actualText as string) }) : this.emptyCellTextContent);
                            if (!this.aggregatedValueMatrix[i[0]]) {
                                this.aggregatedValueMatrix[i[0]] = [];
                            }
                            this.aggregatedValueMatrix[i[0]][i[1]] = val;
                        }
                    }
                }
                break;
            case 'RunningTotals':
                {
                    if (isRowBaseField) {
                        for (const index of colIndex) {
                            let cVal: number = 0;
                            for (const item of selectedHeaderCollection) {
                                for (const rlen of rowIndex) {
                                    if (rowheads[rlen as number] !== undefined) {
                                        const currentSet: IAxisSet = data[rlen as number][index as number] as IAxisSet;
                                        if (rowheads[rlen as number] !== undefined && rowheads[rlen as number].valueSort[item.valueSort.levelName as string] && rowheads[rlen as number].level === item.level && currentSet.axis === 'value' && currentSet.actualText === name) {
                                            if (rowheads[rlen as number].type !== 'grand sum') {
                                                cVal += (!currentSet.showSubTotals && !(
                                                    !isNullOrUndefined(currentSet.actualValue) && isNaN(currentSet.actualValue))) ?
                                                    currentSet.actualValue : (!isNullOrUndefined(currentSet.value) &&
                                                    !isNaN(currentSet.value)) ? currentSet.value : null;
                                                currentSet.formattedText = currentSet.showSubTotals ? (cVal === 0 &&
                                                    (currentSet.actualValue && currentSet.actualValue !== 0) ? '' :
                                                    this.getFormattedValue(cVal, name).formattedText) : currentSet.formattedText;
                                                if (!this.aggregatedValueMatrix[rlen as number]) {
                                                    this.aggregatedValueMatrix[rlen as number] = [];
                                                }
                                                this.aggregatedValueMatrix[rlen as number][index as number] = cVal;
                                            }
                                            if (pivotIndex[rlen + ',' + index]) {
                                                delete pivotIndex[rlen + ',' + index];
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        for (const rln of rowIndex) {
                            if (data[rln as number] !== undefined) {
                                let cVal: number = 0;
                                for (const item of selectedHeaderCollection) {
                                    const subTotal: boolean = (rowheads[rln as number].hasChild && rowheads[rln as number].isDrilled &&
                                        ((!isNullOrUndefined(rowheads[rln as number].showSubTotals) &&
                                            !rowheads[rln as number].showSubTotals) || !this.dataSourceSettings.showSubTotals ||
                                            !this.dataSourceSettings.showRowSubTotals));
                                    for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                                        const currentSet: IAxisSet = data[rln as number][cln as number] as IAxisSet;
                                        if (activeColumn[cln as number] !== undefined &&
                                            activeColumn[cln as number].valueSort[item.valueSort.levelName as string] &&
                                            currentSet.axis === 'value' && currentSet.actualText === name) {
                                            if (activeColumn[cln as number].type !== 'grand sum') {
                                                if (!isNullOrUndefined(currentSet.value)) {
                                                    cVal += currentSet.value;
                                                }
                                                currentSet.formattedText = subTotal ? '' : this.getFormattedValue(cVal, name).formattedText;
                                                if (!this.aggregatedValueMatrix[rln as number]) {
                                                    this.aggregatedValueMatrix[rln as number] = [];
                                                }
                                                this.aggregatedValueMatrix[rln as number][cln as number] = cVal;
                                            }
                                            if (pivotIndex[rln + ',' + cln]) {
                                                delete pivotIndex[rln + ',' + cln];
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    private getSelectedColumn(name: string, colheads: IAxisSet[]): IAxisSet {
        const set: IAxisSet = { axis: 'column', index: [], indexObject: {} };
        for (const head of colheads) {
            if (head && head.valueSort && (head.valueSort.levelName as string).indexOf(name) === 0) {
                set.index = [...set.index, ...head.index].sort(function (a: number, b: number): number { return a - b; });
                set.indexObject = { ...set.indexObject, ...head.indexObject } as {};
            }
        }
        return set;
    }
    private getSelectedRow(name: string, rowheads: IAxisSet[]): IAxisSet {
        for (const head of rowheads) {
            if (head) {
                if (head.valueSort && head.valueSort.levelName as string === name) {
                    return head;
                } else if (name === '' && head.type === 'grand sum') {
                    return head;
                }
            }
        }
        return null;
    }
    private recursiveRowData(
        rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IAxisSet[][], vlt: number,
        isLeastNode: boolean, rln: number, vln: number, level: number, rTotal: IAxisSet, cTotal: IAxisSet): void {
        if (!isLeastNode) {
            this.getTableData(reformAxis[tnum as number].members, reformAxis, columns, tnum, data, vlt, level + 1, rTotal, cTotal);
        }
        if (this.showSubTotalsAtBottom && (
            !isNullOrUndefined(rows[rln as number].showSubTotals) ? rows[rln as number].showSubTotals : true)) {
            this.insertRowSubTotals(reformAxis, columns, tnum, data, vlt, level, rTotal, cTotal);
        }
        if (!this.isPagingOrVirtualizationEnabled) {
            reformAxis[tnum as number].members = [];
        }
    }
    private updateRowData(
        rows: IAxisSet[], columns: IAxisSet[], tnum: number, data: IAxisSet[][], vln: number, rln: number,
        cln: number, dln: number, actCnt: number, rTotal: IAxisSet, cTotal: IAxisSet): void {
        const mPos: number = this.fieldList[this.dataSourceSettings.values[vln as number].name].index;
        const aggregate: string = this.fieldList[this.dataSourceSettings.values[vln as number].name].aggregateType;
        const field: string = this.dataSourceSettings.values[vln as number].name;
        let gTotalIndex: [IAxisSet, IAxisSet][] = [];
        const totalValues: { [key: string]: number } = {};
        let value: number = 0;
        let actualValue: number = 0;
        // let isLeast: boolean = isLeastNode && (vln === vlt - 1);
        switch (aggregate) {
        case 'Index':
            {
                gTotalIndex = [
                    [rows[rln as number], columns[cln as number]], [rows[rln as number], cTotal],
                    [rTotal, columns[cln as number]], [rTotal, cTotal]];
                const valueContent: string[] = ['cVal', 'rTotalVal', 'cTotalVal', 'gTotalVal'];
                let i: number = 0;
                for (const rIndex of gTotalIndex) {
                    totalValues[valueContent[i as number]] = this.getAggregateValue(
                        (rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate, i === 0 ? false : true);
                    i++;
                }
                const val: number = ((totalValues.cVal) * (totalValues.gTotalVal)) / ((totalValues.rTotalVal) * (totalValues.cTotalVal));
                value = (rows[rln as number].members.length > 0 && rows[rln as number].hasChild && rows[rln as number].isDrilled &&
                    ((!isNullOrUndefined(rows[rln as number].showSubTotals) && !rows[rln as number].showSubTotals) ||
                    !this.dataSourceSettings.showRowSubTotals || !this.dataSourceSettings.showSubTotals )) ? undefined :
                    (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
                actualValue = (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
            }
            break;
        case 'PercentageOfGrandTotal':
        case 'PercentageOfColumnTotal':
        case 'PercentageOfRowTotal':
            {
                gTotalIndex = [[rows[rln as number], columns[cln as number]]];
                gTotalIndex.push((aggregate === 'PercentageOfGrandTotal' ?
                    [rTotal, cTotal] : (aggregate === 'PercentageOfColumnTotal' ? [rTotal, columns[cln as number]] :
                        [rows[rln as number], cTotal])));
                const valueContent: string[] = ['cVal', 'gTotalVal'];
                let i: number = 0;
                for (const rIndex of gTotalIndex) {
                    totalValues[valueContent[i as number]] = this.getAggregateValue(
                        (rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate, i === 0 ? false : true);
                    i++;
                }
                const val: number = ((totalValues.cVal) / (totalValues.gTotalVal));
                value = (rows[rln as number].members.length > 0 && rows[rln as number].hasChild && rows[rln as number].isDrilled &&
                    ((!isNullOrUndefined(rows[rln as number].showSubTotals) && !rows[rln as number].showSubTotals) ||
                    !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showRowSubTotals)) ? undefined :
                    (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
                actualValue = (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
            }
            break;
        default:
            {
                const val: number = this.getAggregateValue(
                    rows[rln as number].index, columns[cln as number].indexObject, mPos, aggregate, false);
                value = (rows[rln as number].members.length > 0 && rows[rln as number].hasChild && rows[rln as number].isDrilled &&
                    ((!isNullOrUndefined(rows[rln as number].showSubTotals) && !rows[rln as number].showSubTotals) ||
                        !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showRowSubTotals)) ? undefined : val;
                actualValue = val;
            }
            break;
        }
        const cellDetails: AggregateEventArgs = {
            fieldName: this.dataSourceSettings.values[vln as number].name, row: rows[rln as number], column: columns[cln as number],
            value: value,
            cellSets: this.getValueCellInfo ? this.getCellSet(this.rawIndexObject) : [],
            rowCellType: (rows[rln as number].hasChild && rows[rln as number].isDrilled ? 'subTotal' : rows[rln as number].type === 'grand sum' ? 'grandTotal' : 'value'),
            columnCellType: (columns[cln as number].hasChild && columns[cln as number].isDrilled ? 'subTotal' : columns[cln as number].type === 'grand sum' ? 'grandTotal' : 'value'),
            aggregateType: aggregate as SummaryTypes, skipFormatting: false
        };
        if (this.getValueCellInfo) {
            this.getValueCellInfo(cellDetails);
        }
        value = cellDetails.value;
        const isSum: boolean = rows[rln as number].hasChild || columns[cln as number].hasChild || rows[rln as number].type === 'grand sum' ||
            columns[cln as number].type === 'grand sum' || (this.showSubTotalsAtBottom && rows[rln as number].isSum);
        const isGrand: boolean = rows[rln as number].type === 'grand sum' || columns[cln as number].type === 'grand sum';
        const subTotal: boolean = (rows[rln as number].members.length > 0 && rows[rln as number].hasChild &&
            rows[rln as number].isDrilled && ((!isNullOrUndefined(rows[rln as number].showSubTotals) &&
            !rows[rln as number].showSubTotals) || !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showRowSubTotals));
        let formattedText: string = subTotal ?
            '' : (value === undefined) ? this.emptyCellTextContent :
                (aggregate === 'Count' || aggregate === 'DistinctCount') ? value.toLocaleString() :
                    this.getFormattedValue(value, field).formattedText;
        if (!isNaN(value) && !isNullOrUndefined(value) && (['PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal']).indexOf(aggregate) >= 0) {
            formattedText = this.globalize.formatNumber(value, { format: 'P', maximumFractionDigits: this.getPercentFormat(this.formatFields, cellDetails.fieldName) });
        } else if (!subTotal &&
            isNaN(value) && !isNullOrUndefined(value) &&
            (['PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar']).indexOf(aggregate) !== -1) {
            formattedText = '#DIV/0!';
            value = 0;
        }
        //dln = data[tnum as number].length;
        formattedText = (cellDetails.skipFormatting ? isNullOrUndefined(value) ?
            this.emptyCellTextContent : value.toString() : formattedText);
        data[tnum as number][dln as number] = this.valueContent[actCnt as number][dln as number] = {
            axis: 'value', actualText: field, indexObject: this.isDrillThrough ? this.rawIndexObject : {},
            rowHeaders: rows[rln as number].type === 'grand sum' ? '' : rows[rln as number].valueSort.levelName,
            columnHeaders: columns[cln as number].type === 'grand sum' ? '' : columns[cln as number].valueSort.levelName,
            formattedText: formattedText, value: value,
            hierarchyName: columns[cln as number].hierarchyName,
            actualValue: actualValue,
            rowIndex: tnum, colIndex: dln, isSum: isSum, isGrandSum: isGrand, showSubTotals: !subTotal
        };
        this.rawIndexObject = {};
    }

    private getCellSet(rawIndexObject: INumberIndex): IDataSet[] {
        const currentCellSets: IDataSet[] = [];
        const keys: string[] = Object.keys(rawIndexObject);
        for (const index of keys) {
            if (this.data[parseInt(index, 10)]) {
                currentCellSets.push(this.data[parseInt(index, 10)] as IDataSet);
            }
        }
        return currentCellSets;
    }
    private updateValueMembers(
        hasMeasureIndex: boolean, headerInfo: IAxisSet, levelInfo: IDataSet, columnHeaders: IAxisSet[], axis: IAxisSet[],
        vcnt: number, levelIndex: number): void {
        const levelName: string = levelInfo && !isNullOrUndefined(levelInfo.levelName) ? levelInfo.levelName.toString() : undefined;
        const uniqueName: string = levelInfo && !isNullOrUndefined(levelInfo.uniqueName) ? levelInfo.uniqueName.toString() : undefined;
        if (hasMeasureIndex) {
            for (let vln: number = 0; vln < vcnt; vln++) {
                const field: IFieldOptions = this.dataSourceSettings.values[vln as number];
                const name: string = field.caption ? field.caption : field.name;
                const calObj: IAxisSet = {
                    axis: this.valueAxis ? 'row' : 'column',
                    rowIndex: !this.valueAxis ? (headerInfo && levelIndex <= headerInfo.rowIndex ?
                        (headerInfo.rowIndex + 1) : levelIndex) : 0,
                    actualText: field.name,
                    formattedText: name,
                    level: 0,
                    valueSort: {},
                    // colIndex: (tnum) + 1 + vln,
                    // rowIndex: this.measureIndex,
                    members: [],
                    type: this.valueAxis ? 'value' : (headerInfo ? headerInfo.type : null),
                    index: !this.valueAxis && headerInfo ? headerInfo.index : null,
                    indexObject: !this.valueAxis && headerInfo ? headerInfo.indexObject : null
                };
                if (axis.length > 0) {
                    calObj.showSubTotals = field.showSubTotals;
                }
                const vData: IDataSet = calObj.valueSort;
                vData.axis = !this.valueAxis ? field.name : undefined;
                vData[(levelName ? (levelName + this.valueSortSettings.headerDelimiter) : '') + name] = 1;
                vData[(uniqueName ? (uniqueName + this.valueSortSettings.headerDelimiter) : '') + field.name] = 1;
                vData.levelName = (levelName ? (levelName + this.valueSortSettings.headerDelimiter) : '') + name;
                vData.uniqueName = (uniqueName ? (uniqueName + this.valueSortSettings.headerDelimiter) : '') + field.name;
                columnHeaders.push(calObj);
                this.updateValueMembers(false, headerInfo, vData, calObj.members, axis, vcnt, levelIndex + 1);
            }
        } else {
            for (let rln: number = 0, rlt: number = axis.length; rln < rlt; rln++) {
                const header: IAxisSet = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
                header.members = [];
                header.rowIndex = !this.valueAxis ? (levelIndex < 0 ? 0 : levelIndex) : header.rowIndex;
                const hData: IDataSet = {};
                hData.axis = header.valueSort.axis;
                hData[(levelName ? (levelName + this.valueSortSettings.headerDelimiter) : '') + header.formattedText] = 1;
                hData[(uniqueName ? (uniqueName + this.valueSortSettings.headerDelimiter) : '') + header.actualText] = 1;
                hData.levelName = (levelName ? (levelName + this.valueSortSettings.headerDelimiter) : '') + header.formattedText;
                hData.uniqueName = (uniqueName ? (uniqueName + this.valueSortSettings.headerDelimiter) : '') + header.actualText;
                header.hierarchyName = header.valueSort.uniqueName as string;
                header.valueSort = hData;
                const drillInfo: string = hData.axis + this.valueSortSettings.headerDelimiter + hData.levelName;
                const isFieldValueHeader: IField = this.fieldList[hData.axis as string];
                if (header.isDrilled && (((this.isExpandAll || isFieldValueHeader.expandAll) &&
                this.fieldDrillCollection[drillInfo as string]) || ((!this.isExpandAll && !isFieldValueHeader.expandAll) &&
                !this.fieldDrillCollection[drillInfo as string]))) {
                    header.isDrilled = false;
                }
                columnHeaders.push(header);
                if (header.isDrilled && axis[rln as number].members.length > 0) {
                    if (this.valueAxis && levelIndex < this.measureIndex && this.measureIndex !== (levelIndex + 1
                    ) && (!(axis[rln as number].hasChild &&
                        ((!isNullOrUndefined(axis[rln as number].showSubTotals) && !axis[rln as number].showSubTotals) ||
                        !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showRowSubTotals)))) {
                        this.updateValueMembers(
                            true, header, hData, columnHeaders[columnHeaders.length - 1].members, [], vcnt, levelIndex);
                    }
                    this.updateValueMembers(
                        this.measureIndex === (levelIndex + 1), header, hData, columnHeaders[columnHeaders.length - 1].members,
                        axis[rln as number].members, vcnt, levelIndex + 1);
                    if (!this.valueAxis && levelIndex < this.measureIndex && this.measureIndex !== (levelIndex + 1) &&
                        (!(axis[rln as number].hasChild && ((!isNullOrUndefined(axis[rln as number].showSubTotals) &&
                            !axis[rln as number].showSubTotals) || !this.dataSourceSettings.showSubTotals ||
                            !this.dataSourceSettings.showColumnSubTotals)))) {
                        this.updateValueMembers(true, header, hData, columnHeaders[columnHeaders.length - 1].members, [], vcnt, levelIndex);
                    }
                }
                else if (levelIndex < this.measureIndex) {
                    this.updateValueMembers(
                        true, header, hData, columnHeaders[columnHeaders.length - 1].members, [], vcnt, levelIndex);
                }
            }
        }
    }
    private reArrangeValueMember(member: IAxisSet[]): IAxisSet[] {
        const valueAxis: IAxisSet[] = [];
        for (const axis of member) {
            if (this.valueAxisFields[axis.actualText]) {
                valueAxis[valueAxis.length] = axis;
            }
        }
        return valueAxis.concat(member).slice(0, member.length);
    }
    private frameDefinedHeaderData(
        axis: IAxisSet[], reformAxis: IAxisSet[], data: IAxisSet[][], levelIndex: number, tnum: number, vcnt: number): void {
        // let sortText: string = this.valueSortSettings.headerText;
        for (let rln: number = 0, rlt: number = axis.length; rln < rlt; rln++) {
            let showSubTotals: boolean = true;
            if (axis[rln as number].members.length > 0 && (
                (!isNullOrUndefined(axis[rln as number].showSubTotals) && !axis[rln as number].showSubTotals) ||
                !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showColumnSubTotals)) {
                showSubTotals = false;
            }
            const index: number = (this.measureIndex < levelIndex && showSubTotals ? 1 : ((this.measureIndex > levelIndex &&
                axis[rln as number].members.length > 0) || !(this.measureIndex === (levelIndex + 1) &&
                axis[rln as number].isDrilled) ? ((this.measureIndex === levelIndex && this.measureIndex !== 0 && showSubTotals
                ) ? 1 : ((this.measureIndex > levelIndex && showSubTotals && axis[rln as number].valueSort &&
                        axis[rln as number].valueSort.axis && this.measureNames[axis[rln as number].valueSort.axis.toString()]
                    ) ? 1 : 0)) : (this.measureIndex === 0 || !showSubTotals ? 0 : 1)));
            if (axis[rln as number].members.length) {
                let pos: number;
                let members: IAxisSet[] = axis[rln as number].members;
                if (this.showSubTotalsAtTop) {
                    if (levelIndex + 1 < this.measureIndex && showSubTotals) {
                        pos = tnum; members = this.reArrangeValueMember(members);
                    } else {
                        pos = tnum + index;
                    }
                } else {
                    pos = tnum;
                }
                this.frameDefinedHeaderData(members, reformAxis, data, levelIndex + 1, pos, vcnt);
            }
            // let lvl: number = axis[rln as number].level;
            // axis[rln as number].rowIndex = lvl;
            const level: number = this.measureIndex > levelIndex && axis[rln as number].valueSort &&
                axis[rln as number].valueSort.axis && this.measureNames[axis[rln as number].valueSort.axis.toString()] ?
                this.measureIndex : levelIndex;
            tnum = this.showSubTotalsAtTop ? tnum + 1 : reformAxis.length + index;
            if (!reformAxis[tnum - 1]) {
                reformAxis[tnum - 1] = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
            }
            axis[rln as number].colIndex = tnum;
            if (!data[level as number]) {
                data[level as number] = [];
                this.headerContent[level as number] = {} as IAxisSet[];
                data[level as number][tnum as number] = this.headerContent[level as number][tnum as number]
                    = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
            } else {
                data[level as number][tnum as number] = this.headerContent[level as number][tnum as number]
                    = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
            }
            if (!this.isPagingOrVirtualizationEnabled && (this.showSubTotalsAtTop ? index !== 0 : true)) {
                if (reformAxis[tnum - 1]) {
                    reformAxis[tnum - 1].members = [];
                }
            }
            if (this.showSubTotalsAtTop) {
                tnum = reformAxis.length;
                if (rln + 1 === rlt && axis[rln as number].level === 0) {
                    this.reformAxisCount = reformAxis.length + 1;
                }
            }
        }
    }
    private getHeaderData(
        rows: IFieldOptions[], columns: IFieldOptions[], values: IFieldOptions[], rowAxis: IAxisSet[], axis: IAxisSet[],
        reformAxis: IAxisSet[], data: IAxisSet[][], tnum: number, vcnt: number): void {
        if (!this.valueAxis && !this.isLastHeaderHasMeasures) {
            const columnHeaders: IAxisSet[] = [];
            if (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals && axis[axis.length - 1].type === 'grand sum') {
                this.updateValueMembers(
                    this.measureIndex === 0 && axis.length > 1, null, null, columnHeaders, axis.slice(0, axis.length - 1), vcnt, 0);
                this.updateValueMembers(false, null, null, columnHeaders, axis.slice(axis.length - 1, axis.length), vcnt, -1);
            } else if (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals && this.measureIndex === 0) {
                this.updateValueMembers(false, null, null, columnHeaders, axis.slice(0, 1), vcnt, -1);
                this.updateValueMembers(
                    this.measureIndex === 0 && axis.length > 1, null, null, columnHeaders, axis.slice(1, axis.length), vcnt, 0);
            } else {
                const hasColumnTotal: boolean = columns.length === 0 && axis.length === 1 && axis[0].type === 'grand sum';
                this.updateValueMembers(
                    !hasColumnTotal && this.measureIndex === 0, null, null, columnHeaders, axis, vcnt, hasColumnTotal ? -1 : 0);
            }
            this.getAggregatedHeaders(rows, columns, this.rMembers, columnHeaders, values);
            if (this.selectedHeaders.values.length > 0) {
                for (let clt: number = this.selectedHeaders.selectedHeader.length, i: number = 0; i < clt; i++) {
                    const headerData: IHeaderData = this.selectedHeaders.selectedHeader[i as number];
                    if (headerData.axis === 'column') {
                        if (headerData.uniqueName === headerData.value) {
                            this.selectedHeaders.selectedHeader.splice(i, 1);
                            i--;
                            clt--;
                        } else if (headerData.uniqueName === 'Grand Total') {
                            for (let clt: number = headerData.aggregateHeaders.length, j: number = 0; j < clt; j++) {
                                if (headerData.aggregateHeaders[j as number] &&
                                        headerData.aggregateHeaders[j as number].members.length > 0) {
                                    for (const member of headerData.aggregateHeaders[j as number].members) {
                                        if (member.actualText === headerData.value) {
                                            headerData.aggregateHeaders[j as number] = member;
                                            if (member.type === 'grand sum') {
                                                headerData.uniqueName = member.valueSort.levelName as string;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.frameDefinedHeaderData(columnHeaders, reformAxis, data, 0, this.showSubTotalsAtTop ? 0 : 1, vcnt);
            return;
        } else if (rowAxis.length === 0 && (
            this.valueAxis && (this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader)) &&
            this.dataSourceSettings.values.length > 0) {
            if (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals &&
                this.rMembers[this.rMembers.length - 1].type === 'grand sum') {
                this.updateValueMembers(
                    this.measureIndex === 0 && this.rMembers.length > 1, null, null, rowAxis, this.rMembers.slice(
                        0, this.rMembers.length - 1), this.dataSourceSettings.values.length, 0);
                this.updateValueMembers(
                    false, null, null, rowAxis, this.rMembers.slice(
                        this.rMembers.length - 1, this.rMembers.length), this.dataSourceSettings.values.length, -1);
            } else if (this.dataSourceSettings.grandTotalsPosition === 'Top' && this.dataSourceSettings.showGrandTotals && this.measureIndex === 0) {
                this.updateValueMembers(
                    false, null, null, rowAxis, this.rMembers.slice(0, 1), this.dataSourceSettings.values.length, -1);
                this.updateValueMembers(
                    this.measureIndex === 0 && this.rMembers.length > 1, null, null, rowAxis, this.rMembers.slice(
                        1, this.rMembers.length), this.dataSourceSettings.values.length, 0);
            } else {
                const hasRowTotal: boolean = rows.length === 0 && this.rMembers.length === 1 && this.rMembers[0].type === 'grand sum';
                this.updateValueMembers(
                    !hasRowTotal && this.measureIndex === 0, null, null, rowAxis, this.rMembers, this.dataSourceSettings.values.length,
                    hasRowTotal ? -1 : 0
                );
            }
            this.getAggregatedHeaders(rows, columns, rowAxis, axis, values);
            if (this.selectedHeaders.values.length > 0) {
                for (let clt: number = this.selectedHeaders.selectedHeader.length, i: number = 0; i < clt; i++) {
                    const headerData: IHeaderData = this.selectedHeaders.selectedHeader[i as number];
                    if (headerData.axis === 'row') {
                        for (let clt: number = headerData.aggregateHeaders.length, j: number = 0; j < clt; j++) {
                            if (headerData.aggregateHeaders[j as number].actualText === headerData.value) {
                                if ((headerData.aggregateHeaders[j as number].valueSort.levelName as string
                                ).indexOf(headerData.uniqueName) !== -1) {
                                    headerData.uniqueName = headerData.aggregateHeaders[j as number].valueSort.levelName as string;
                                    headerData.aggregateHeaders.splice(j, 1);
                                    j--;
                                    clt--;
                                } else {
                                    for (let count: number = headerData.aggregateHeaders[j as number].members.length,
                                        k: number = 0; k < count; k++) {
                                        const member: IAxisSet = headerData.aggregateHeaders[j as number].members[k as number];
                                        if (member.type !== 'value' && member.level ===
                                            headerData.aggregateHeaders[j as number].level) {
                                            const members: IAxisSet[] = extend(
                                                [], headerData.aggregateHeaders[j as number].members, null, true) as IAxisSet[];
                                            headerData.aggregateHeaders = [].concat(
                                                headerData.aggregateHeaders, members, headerData.aggregateHeaders.splice(j));
                                            headerData.aggregateHeaders.splice(members.length + j, 1);
                                            j = (members.length + j) - 1;
                                            clt = headerData.aggregateHeaders.length;
                                        }
                                    }
                                }
                            } else if (headerData.aggregateHeaders[j as number].actualText !== headerData.value &&
                                    headerData.aggregateHeaders[j as number].members.length > 0) {
                                for (let count: number = headerData.aggregateHeaders[j as number].members.length,
                                    k: number = 0; k < count; k++) {
                                    const member: IAxisSet = headerData.aggregateHeaders[j as number].members[k as number];
                                    if (member.actualText === headerData.value) {
                                        if (headerData.uniqueName ===
                                            headerData.aggregateHeaders[j as number].valueSort.levelName as string) {
                                            headerData.uniqueName = member.valueSort.levelName as string;
                                        }
                                        headerData.aggregateHeaders[j as number].members.splice(k, 1);
                                        headerData.aggregateHeaders[j as number] = member;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        const rlt: number = axis.length; const colItmLn: number = this.dataSourceSettings.columns.length;
        const sortText: string = this.valueSortSettings.headerText;
        //let valueLn: number = this.dataSourceSettings.values.length;
        for (let rln: number = 0; rln < rlt; rln++) {
            const isHidden: boolean = !isNullOrUndefined(axis[rln as number].showSubTotals) && !axis[rln as number].showSubTotals;
            if (axis[rln as number].members.length) {
                this.getHeaderData(
                    rows, columns, values, rowAxis, axis[rln as number].members, reformAxis, data,
                    this.showSubTotalsAtTop && !isHidden ? tnum + 1 : tnum, vcnt);
            }
            let isTotalHide: boolean = true;
            tnum = this.showSubTotalsAtTop ? tnum : reformAxis.length;
            if ( isHidden || !this.dataSourceSettings.showSubTotals || !this.dataSourceSettings.showColumnSubTotals) {
                if (!(axis[rln as number].members.length > 0)) {
                    reformAxis[this.showSubTotalsAtTop ? tnum : reformAxis.length] = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
                } else {
                    this.removeCount++;
                    isTotalHide = false;
                }
                tnum = this.showSubTotalsAtTop ? tnum : reformAxis.length - 1;
            } else {
                reformAxis[tnum as number] = PivotUtil.frameHeaderWithKeys(axis[rln as number]);
            }
            //  let rplus: number = rln + 1;
            const lvl: number = axis[rln as number].level;
            axis[rln as number].rowIndex = lvl;
            const index: number = (tnum * vcnt) + (this.showSubTotalsAtTop ? 1 : vcnt);
            axis[rln as number].colIndex = index;
            if (!data[lvl as number]) {
                data[lvl as number] = [];
                this.headerContent[lvl as number] = {} as IAxisSet[];
            }
            data[lvl as number][index as number] = this.headerContent[lvl as number][index as number] =
                PivotUtil.getFormattedHeader(axis[rln as number], this);
            const isSingleMeasure: boolean = (this.dataSourceSettings.columns.length === 0 &&
                this.dataSourceSettings.values.length === 1) ? true : false;
            if ((this.isMultiMeasures || this.dataSourceSettings.alwaysShowValueHeader || isSingleMeasure) &&
                !this.valueAxis && isTotalHide) {
                for (let vln: number = 0; vln < vcnt; vln++) {
                    const name: string = this.dataSourceSettings.values[vln as number].caption ?
                        this.dataSourceSettings.values[vln as number].caption : this.dataSourceSettings.values[vln as number].name;
                    const calObj: Object = {
                        axis: 'column', actualText: this.dataSourceSettings.values[vln as number].name, formattedText: name, level: 0, valueSort: {},
                        colIndex: (tnum * vcnt) + 1 + vln, rowIndex: colItmLn
                    };
                    if (!data[colItmLn as number]) {
                        data[colItmLn as number] = [];
                        this.headerContent[colItmLn as number] = {} as IAxisSet[];
                        data[colItmLn as number][(tnum * vcnt) + 1 + vln] =
                            this.headerContent[colItmLn as number][(tnum * vcnt) + 1 + vln] = calObj;
                    } else {
                        data[colItmLn as number][(tnum * vcnt) + 1 + vln] =
                            this.headerContent[colItmLn as number][(tnum * vcnt) + 1 + vln] = calObj;
                    }
                    const vData: IDataSet = (data[colItmLn as number][(tnum * vcnt) + 1 + vln] as IAxisSet).valueSort;
                    vData[axis[rln as number].valueSort.levelName + this.valueSortSettings.headerDelimiter + name] = 1;
                    vData.levelName = axis[rln as number].valueSort.levelName + this.valueSortSettings.headerDelimiter + name;
                    vData[axis[rln as number].valueSort.uniqueName + this.valueSortSettings.headerDelimiter +
                    this.dataSourceSettings.values[vln as number].name] = 1;
                    vData.uniqueName = axis[rln as number].valueSort.uniqueName +
                        this.valueSortSettings.headerDelimiter + this.dataSourceSettings.values[vln as number].name;
                    if (vData && vData[sortText as string]) {
                        this.valueSortSettings.columnIndex = (tnum * vcnt) + 1 + vln;
                    }
                }
            } else if (axis[rln as number].valueSort && axis[rln as number].valueSort[sortText as string]) {
                this.valueSortSettings.columnIndex = (tnum * vcnt) + 1;
            }
            if (!this.isPagingOrVirtualizationEnabled) {
                reformAxis[tnum as number].members = [];
            }
            if (this.showSubTotalsAtTop) {
                tnum = reformAxis.length;
                if (axis[rln as number].level === 0 && rln + 1 === rlt) {
                    this.reformAxisCount = (reformAxis.length * vcnt) + 1;
                }
            }
        }
    }

    public getAggregateValue(rowIndex: number[], columnIndex: INumberIndex, value: number, type: string, isGrandTotal: boolean): number {
        //rowIndex = rowIndex.sort();
        //columnIndex = columnIndex.sort();
        //let clt: number = columnIndex.length;
        let ri: number = 0;
        let cellValue: number = 0;
        let avgCnt: number = 0;
        let isInit: boolean = true;
        let isValueExist: boolean = false;
        switch (type.toLowerCase()) {
        case 'median':
            {
                const values: number[] = [];
                let position: number = 0;
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined) {
                        isValueExist = true;
                        this.rawIndexObject[index as number] = index as number;
                        if (!isNullOrUndefined(this.valueMatrix[index as number][value as number].member)) {
                            values.push(this.valueMatrix[index as number][value as number].member);
                        }
                    }
                    ri++;
                }
                const len: number = values.length;
                if (len > 0) {
                    values.sort((a: number, b: number) => a - b);
                    if (len % 2 === 0) {
                        position = (len / 2) <= 1 ? 0 : ((len / 2) - 1);
                        cellValue = (values[position as number] + values[position + 1]) / 2;
                    } else {
                        position = (len + 1) / 2 <= 1 ? 0 : (((len + 1) / 2) - 1);
                        cellValue = values[position as number];
                    }
                }
            }
            break;
        case 'count':
            {
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined) {
                        isValueExist = true;
                        this.rawIndexObject[index as number] = index as number;
                        cellValue += (isNullOrUndefined(this.valueMatrix[index as number][value as number].member) ?
                            0 : (this.allowDataCompression ? this.valueMatrix[index as number][value as number].member : 1));
                    }
                    ri++;
                }
            }
            break;
        case 'distinctcount':
            {
                const duplicateValues: string[] = [];
                while (rowIndex[ri as number] !== undefined) {
                    if (columnIndex[rowIndex[ri as number]] !== undefined) {
                        this.rawIndexObject[rowIndex[ri as number]] = rowIndex[ri as number];
                        isValueExist = true;
                        const val: string | number | Date = ((this.data as IDataSet[])[rowIndex[ri as number]][
                            this.fieldKeys[this.fields[value as number]] as string | number]);
                        // let currentVal: number = this.valueMatrix[rowIndex[ri as number]][value as number];
                        if (!isNullOrUndefined(val)) {
                            const currentVal: string = val.toString();
                            if (duplicateValues.length === 0 || (duplicateValues.length > 0 &&
                                    duplicateValues.indexOf(currentVal) === -1)) {
                                cellValue += (this.allowDataCompression && typeof val === 'number') ? val : 1;
                                duplicateValues.push(currentVal);
                            }
                        }
                    }
                    ri++;
                }
            }
            break;
        case 'product':
            {
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined) {
                        this.rawIndexObject[index as number] = index as number;
                        isValueExist = true;
                        const currentVal: number = this.valueMatrix[index as number][value as number].member;
                        if (!isNullOrUndefined(currentVal)) {
                            cellValue = ((isInit || isNullOrUndefined(cellValue)) ? 1 : cellValue);
                            cellValue *= currentVal;
                        } else if (isInit) {
                            cellValue = currentVal;
                        }
                        isInit = false;
                    }
                    ri++;
                }
            }
            break;
        case 'populationstdev':
        case 'samplestdev':
        case 'populationvar':
        case 'samplevar':
            {
                let i: number = 0;
                let val: number = 0;
                const indexVal: number[] = [];
                let avgVal: number = 0;
                let cVal: number = 0;
                let avgDifferenceVal: number = 0;
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined) {
                        isValueExist = true;
                        this.rawIndexObject[index as number] = index as number;
                        const currentVal: number = this.valueMatrix[index as number][value as number].member;
                        if (!isNullOrUndefined(currentVal)) {
                            val += currentVal;
                            indexVal.push(currentVal);
                            i++;
                        }
                    }
                    ri++;
                }
                if (i > 0) {
                    avgVal = val / i;
                    for (const index of indexVal) {
                        avgDifferenceVal += Math.pow((index - avgVal), 2);
                    }
                    if ((['populationstdev', 'samplestdev']).indexOf(type.toLowerCase()) !== -1) {
                        cVal = Math.sqrt(avgDifferenceVal / (type.toLowerCase() === 'populationstdev' ? i : (i - 1)));
                    } else {
                        cVal = avgDifferenceVal / (type.toLowerCase() === 'populationvar' ? i : (i - 1));
                    }
                    cellValue = (cVal === 0 ? NaN : cVal);
                } else {
                    cellValue = val;
                }
            }
            break;
        case 'min':
            {
                let isFirst: boolean = true;
                cellValue = undefined;
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined &&
                        this.valueMatrix[index as number][value as number].member !== undefined) {
                        isValueExist = true;
                        this.rawIndexObject[index as number] = index as number;
                        if (isNullOrUndefined(cellValue) &&
                            isNullOrUndefined(this.valueMatrix[index as number][value as number].member)) {
                            cellValue = this.valueMatrix[index as number][value as number].member;
                        } else {
                            if (isFirst) {
                                cellValue = this.valueMatrix[index as number][value as number].member;
                                isFirst = false;
                            } else {
                                cellValue = this.valueMatrix[index as number][value as number].member < cellValue ?
                                    this.valueMatrix[index as number][value as number].member : cellValue;
                            }
                        }
                    }
                    ri++;
                }
            }
            break;
        case 'max':
            {
                let isMaxFirst: boolean = true;
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined &&
                            this.valueMatrix[index as number][value as number].member !== undefined) {
                        isValueExist = true;
                        this.rawIndexObject[index as number] = index as number;
                        if (isMaxFirst) {
                            cellValue = this.valueMatrix[index as number][value as number].member;
                            isMaxFirst = false;
                        } else {
                            cellValue = this.valueMatrix[index as number][value as number].member > cellValue ?
                                this.valueMatrix[index as number][value as number].member : cellValue;
                        }
                    }
                    ri++;
                }
            }
            break;
        case 'calculatedfield':
            {
                isValueExist = true;
                const calcField: ICalculatedFields = this.calculatedFields[this.fields[value as number]];
                let actualFormula: string = calcField.formula;
                const aggregateField: { [key: string]: Object } = {};
                if (this.calculatedFormulas[calcField.name]) {
                    const calculatedFormulas: Object[] = <Object[]>this.calculatedFormulas[calcField.name];
                    for (let len: number = 0, lmt: number = calculatedFormulas.length; len < lmt; len++) {
                        const aggregatedValue: { [key: string]: Object } = <{ [key: string]: Object }>calculatedFormulas[len as number];
                        let value: number = <number>aggregateField[<string>aggregatedValue.formula];
                        if (value === undefined) {
                            const type: string = <string>aggregatedValue.type;
                            value = this.getAggregateValue(rowIndex, columnIndex, <number>aggregatedValue.index, type, false);
                            aggregateField[<string>aggregatedValue.formula] = value;
                        }
                        actualFormula = (actualFormula).replace(<string>aggregatedValue.formula, String(value));
                    }
                }
                cellValue = this.evaluate(actualFormula);
                cellValue = (cellValue === Infinity || cellValue === -Infinity ? Infinity : (cellValue === undefined || isNaN(cellValue)) ?
                    undefined : JSON.parse(String(cellValue)));
            }
            break;
        default:
            {
                cellValue = undefined;
                while (rowIndex[ri as number] !== undefined) {
                    const index: number = rowIndex[ri as number];
                    if (columnIndex[index as number] !== undefined) {
                        isValueExist = true;
                        if (!isGrandTotal) {
                            this.rawIndexObject[index as number] = index as number;
                        }
                        //let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri as number]), 1)[0] : rowIndex[ri as number];
                        const currentVal: number = this.valueMatrix[index as number][value as number].member;
                        if (isNullOrUndefined(cellValue) && isNullOrUndefined(currentVal)) {
                            cellValue = currentVal;
                        } else {
                            if (isNullOrUndefined(cellValue)) {
                                cellValue = 0;
                            }
                            cellValue += (isNullOrUndefined(currentVal) ? 0 : currentVal);
                        }
                        if (!isNullOrUndefined(currentVal)) {
                            avgCnt++;
                        }
                    }
                    ri++;
                }
            }
            break;
        }
        /* if (rlt > clt) {
             this.makeMirrorObject(rowIndex, mirror);
             while (columnIndex[ci] !== undefined) {
                 if (mirror[columnIndex[ci]]) {
                     let cIndx: number = isLeastLevel ? columnIndex.splice(ci, 1)[0] : columnIndex[ci];
                     //rowIndex.splice
                     sum += this.valueMatrix[cIndx][value as number];
                 }
                 ci++;
             }
         } else {
             this.makeMirrorObject(columnIndex, mirror);
             while (rowIndex[ri as number] !== undefined) {
                 if (mirror[rowIndex[ri as number]]) {
                     let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri as number]), 1)[0] : rowIndex[ri as number];
                     sum += this.valueMatrix[rowIndex[ri as number]][value as number];
                 }
                 ri++;
             }
         } */
        return ((type && type.toLowerCase() === 'avg' && cellValue !== 0 &&
            !isNullOrUndefined(cellValue)) ? (cellValue / avgCnt) : isValueExist ? cellValue : undefined);
    }
    private evaluate(obj: string): number {
        return Function('"use strict";return (' + obj + ')')();
    }
    /**
     * It performs the formatting to get formatted Value
     *
     * @param {number | string} value - It contains the value which went formatting.
     * @param {string} fieldName - It contains the field name.
     * @returns {IAxisSet} - It returns the formatted value as IAxisSet data.
     * @hidden
     */
    public getFormattedValue(value: number | string, fieldName: string): IAxisSet {
        const commonValue: number | string = value === null ? (this.localeObj ? this.localeObj.getConstant('null') :
            String(value)) : value === undefined ?
            (this.localeObj ? (fieldName in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                this.localeObj.getConstant('undefined') : String(value)) : value;
        const formattedValue: IAxisSet = {
            formattedText: commonValue.toString(),
            actualText: commonValue,
            dateText: commonValue
        };
        if (this.formatFields[fieldName as string] && (this.formatFields[fieldName as string].format ||
            this.formatFields[fieldName as string].skeleton) && !isNullOrUndefined(value)) {
            try {
                const formatField: IFormatSettings = ((<{ [key: string]: Object }>this.formatFields[fieldName as string]).properties ?
                    (<{ [key: string]: Object }>this.formatFields[fieldName as string]).properties :
                    this.formatFields[fieldName as string]);
                const formatSetting: IFormatSettings = extend({}, formatField, null, true) as IFormatSettings;
                delete formatSetting.name;
                if (!formatSetting.minimumSignificantDigits && formatSetting.minimumSignificantDigits < 1) {
                    delete formatSetting.minimumSignificantDigits;
                }
                if (!formatSetting.maximumSignificantDigits && formatSetting.maximumSignificantDigits < 1) {
                    delete formatSetting.maximumSignificantDigits;
                }
                if (formatSetting.type) {
                    formattedValue.formattedText = this.dateFormatFunction[fieldName as string].exactFormat(new Date(value as string));
                    formattedValue.actualText = value;
                } else {
                    delete formatSetting.type;
                    if ((formatSetting.format) && !(this.formatRegex.test(formatSetting.format))) {
                        if (isNullOrUndefined(formatSetting.minimumFractionDigits)) {
                            delete formatSetting.minimumFractionDigits;
                        }
                        if (isNullOrUndefined(formatSetting.maximumFractionDigits)) {
                            delete formatSetting.maximumFractionDigits;
                        }
                        if (isNullOrUndefined(formatSetting.minimumIntegerDigits)) {
                            delete formatSetting.minimumIntegerDigits;
                        }
                    }
                    formattedValue.formattedText =
                        this.globalize.formatNumber(!isNaN(Number(value)) ? Number(value) : value as number, formatSetting);
                    formattedValue.actualText = !isNaN(Number(value)) ? Number(value) : value;
                    formattedValue.dateText = !isNaN(Number(value)) ? Number(value) : value;
                }
                if (this.fieldList[fieldName as string].sort !== 'None' && formatSetting.type &&
                    ['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName as string].type) > -1) {
                    formattedValue.dateText = this.dateFormatFunction[fieldName as string].fullFormat(new Date(value as string));
                }
                if (this.fieldList[fieldName as string].isCustomField) {
                    formattedValue.formattedText = formattedValue.formattedText === 'NaN' ?
                        commonValue.toString() : formattedValue.formattedText;
                    formattedValue.dateText = formattedValue.dateText === 'NaN' ?
                        commonValue.toString() : formattedValue.dateText;
                }
            } catch (exception) {
                if (!this.fieldList[fieldName as string].isCustomField) {
                    throw exception;
                }
            } finally {
                if (this.fieldList[fieldName as string].isCustomField) {
                    formattedValue.formattedText =
                        (isNullOrUndefined(formattedValue.formattedText) || formattedValue.formattedText === 'NaN') ?
                            commonValue.toString() : formattedValue.formattedText;
                    formattedValue.dateText = (isNullOrUndefined(formattedValue.dateText) || formattedValue.dateText === 'NaN') ?
                        commonValue.toString() : formattedValue.dateText;
                }
            }
        }
        return formattedValue;
    }
    private powerFunction(formula: string): string {
        if (formula.indexOf('^') > -1) {
            const items: string[] = [];
            while (formula.indexOf('(') > -1) {
                formula = formula.replace(/(\([^()]*\))/g, (text: string, item: string): string => {
                    items.push(item);
                    return ('~' + (items.length - 1));
                });
            }
            items.push(formula);
            formula = '~' + (items.length - 1);
            while (formula.indexOf('~') > -1) {
                formula = formula.replace(new RegExp('~' + '(\\d+)', 'g'), (text: string, index: number): string => {
                    return items[index as number].replace(/(\w*)\^(\w*)/g, 'Math.pow' + '($1,$2)');
                });
            }
        }
        return formula;
    }
    /* private makeMirrorObject(elements: number[], obj: NumberIndex): void {
         for (let lp: number = 0, end: number = elements.length; lp < end; lp++) {
             obj[elements[lp]] = elements[lp];
         }
     } */
}

/**
 * Allows the following pivot report information such as rows, columns, values, filters, etc., that are used to render the pivot table and field list.
 * * `catalog`: Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string. **Note: It is applicable only for OLAP data source.**
 * * `cube`: Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering. **Note: It is applicable only for OLAP data source.**
 * * `providerType`: Allows to set the provider type to identify the given connection is either Relational or SSAS to render the pivot table and field list.
 * * `url`: Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list. **Note: It is applicable only for OLAP data source.**
 * * `localeIdentifier`: Allows you to set the specific culture code as number type to render pivot table with desired localization.
 * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale. **Note: It is applicable only for OLAP data source.**
 * * `dataSource`: Allows you to set the data source as JSON collection to the pivot report either from local or from remote server to the render the pivot that and field list.
 * You can fetch JSON data from remote server by using DataManager. **Note: It is applicable only for relational data source.**
 * * `rows`: Allows specific fields associated with field information that needs to be displayed in row axis of pivot table.
 * * `columns`: Allows specific fields associated with field information that needs to be displayed in column axis of pivot table.
 * * `values`: Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table.
 * * `filters`: Allows to filter the values in other axis based on the collection of filter fields in pivot table.
 * * `excludeFields`: Allows you to restrict the specific field(s) from displaying it in the field list UI.
 * You may also be unable to render the pivot table with this field(s) by doing so. **Note: It is applicable only for relational data source.**
 * * `expandAll`: Allows you to either expand or collapse all the headers that are displayed in the pivot table.
 * By default, all the headers are collapsed in the pivot table. **Note: It is applicable only for Relational data.**
 * * `valueAxis`: Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
 * * `filterSettings`: Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
 * * `sortSettings`: Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
 * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
 * * `enableSorting`: Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
 * * `formatSettings`: Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
 * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
 * * `drilledMembers`: Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
 * * `valueSortSettings`: Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
 * * `calculatedFieldSettings`: Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
 * * `allowMemberFilter`: Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
 * * `allowLabelFilter`: Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
 * * `allowValueFilter`: Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
 * * `showSubTotals`: Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
 * * `showRowSubTotals`: Allows to show or hide sub-totals in row axis of the pivot table.
 * * `showColumnSubTotals`: Allows to show or hide sub-totals in column axis of the pivot table.
 * * `showGrandTotals`: Allows to show or hide grand totals in both rows and columns axis of the pivot table.
 * * `grandTotalsPosition`: Allows the grand totals to be position at first position in the row and column axis of the pivot table.
 * * `showRowGrandTotals`: Allows to show or hide grand totals in row axis of the pivot table.
 * * `showColumnGrandTotals`: Allows to show or hide grand totals in column axis of the pivot table.
 * * `showHeaderWhenEmpty`: Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data.
 * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
 * * `alwaysShowValueHeader`: Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
 * * `conditionalFormatSettings`: Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
 * * `emptyCellsTextContent`: Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
 * * `groupSettings`: Allows specific fields to group their data on the basis of their type.
 * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
 * You can perform custom group to the string type fields that used to displayed in the pivot table.
 * * `showAggregationOnValueField`: Allows the pivot button with specific value field caption along with the aggregation type, to be displayed in the grouping bar and field list UI.
 * For example, if the value field "Sold Amount" is aggregated with Sum, it will be displayed with caption "Sum of Sold Amount" in its pivot button.
 * * `authentication`: Allows you to set the credential information to access the specified SSAS cube. **Note: It is applicable only for OLAP data source**.
 */
export interface IDataOptions {
    /**
     * Allows to set the database name of SSAS cube as string type that used to retrieve the data from the specified connection string.
     * > It is applicable only for OLAP data source.
     */
    catalog?: string;
    /**
     * Allows you to set the SSAS cube name as string type that used to retrieve data for pivot table rendering.
     * > It is applicable only for OLAP data source.
     */
    cube?: string;
    /**
     * Allows to set the provider type to identify the given connection is either **Relational** or **SSAS** to render the pivot table and field list. The following options are:
     * * `Relational`: Allows to render the pivot table with JSON data collection either fetch at local or remote server.
     * * `SSAS`: Allows to render the pivot table with OLAP data fetch from OLAP cube.
     */
    providerType?: ProviderType;
    /**
     * Allows to set the mode of rendering the pivot table.
     *
     */
    mode?: RenderMode;
    /**
     * Allows to set the URL as string type, which helps to identify the service endpoint where the data are processed and retrieved to render the pivot table and field list.
     * > It is applicable only for OLAP data source.
     */
    url?: string;
    /**
     * Allows you to set the specific culture code as number type to render pivot table with desired localization.
     * By default, the pivot table displays with culture code **1033**, which indicates "en-US" locale.
     * > It is applicable only for OLAP data source.
     */
    localeIdentifier?: number;
    /**
     * Allows you to assign multiple roles to the OLAP cube, separated by commas, each of which can access only restricted OLAP cube information such as measures, dimensions, and more that can be rendered in the pivot table.
     * > It is applicable only for OLAP data source.
     */
    roles?: string;
    /**
     * Allows you to set the data source as JSON collection to the pivot report either from local or from remote server to the render the pivot that and field list.
     * You can fetch JSON data from remote server by using DataManager.
     * > It is applicable only for relational data source.
     */
    dataSource?: IDataSet[] | DataManager | string[][];
    /**
     * Allows specific fields associated with field information that needs to be displayed in row axis of pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * * `expandAll`: Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    rows?: IFieldOptions[];
    /**
     * Allows specific fields associated with field information that needs to be displayed in column axis of pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in column axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in column axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * * `expandAll`: Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    columns?: IFieldOptions[];
    /**
     * Allows specific fields associated with field information that needs to be displayed as aggregated numeric values in pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `type`: Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… **Note: It is applicable only for relational data source.**
     * * `baseField`: Allows you to set the selective field, which used to display the values with either
     *  DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types. **Note: It is applicable only for relational data source.**
     * * `baseItem`: Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
     * The selective item should be set the from field specified in the baseField property. **Note: It is applicable only for relational data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showValueTypeIcon`: Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * * `expandAll`: Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    values?: IFieldOptions[];
    /**
     * Allows to filter the values in other axis based on the collection of filter fields in pivot table. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * * `expandAll`: Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    filters?: IFieldOptions[];
    /**
     * Allows you to restrict the specific field(s) from displaying it in the field list UI.
     * You may also be unable to render the pivot table with this field(s) by doing so.
     * > It is applicable only for relational data source.
     */
    excludeFields?: string[];
    /**
     * Allows you to either expand or collapse all the headers that are displayed in the pivot table.
     * By default, all the headers are collapsed in the pivot table.
     * > It is applicable only for Relational data.
     */
    expandAll?: boolean;
    /**
     * Allows you to set the value fields that to be plotted either in row or column axis in the pivot table.
     */
    valueAxis?: string;

    /**
     * Allows you to display the value headers based on the index position in row or column axis in the pivot table.
     * By default, the value headers are displayed at last index position based on the `valueAxis` property.
     * > It is applicable only for relational data source.
     */
    valueIndex?: number;
    /**
     * Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
     */
    filterSettings?: IFilter[];
    /**
     * Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
     * By default, the data source containing fields are display with Ascending order alone. To use this option, it requires the `enableSorting` property to be **true**.
     */
    sortSettings?: ISort[];
    /**
     * Allows to perform sort operation to order members of a specific fields either in ascending or descending that used to be displayed in the pivot table.
     */
    enableSorting?: boolean;
    /**
     * Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
     * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
     */
    formatSettings?: IFormatSettings[];
    /**
     * Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
     */
    drilledMembers?: IDrillOptions[];
    /**
     * Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
     */
    valueSortSettings?: IValueSortSettings;
    /**
     * Allows to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     */
    calculatedFieldSettings?: ICalculatedFieldSettings[];
    /**
     * Allows to perform filter operation based on the selective filter members of the specific fields used to be displayed in the pivot table.
     */
    allowMemberFilter?: boolean;
    /**
     * Allows to perform filter operation based on the selective headers used to be displayed in the pivot table.
     */
    allowLabelFilter?: boolean;
    /**
     * Allows to perform filter operation based only on value fields and its resultant aggregated values over other fields defined in row and column axes that used to be displayed in the pivot table.
     */
    allowValueFilter?: boolean;
    /**
     * Allows to show or hide sub-totals in both rows and columns axis of the pivot table.
     */
    showSubTotals?: boolean;
    /**
     * Allows to show or hide sub-totals in row axis of the pivot table.
     */
    showRowSubTotals?: boolean;
    /**
     * Allows to show or hide sub-totals in column axis of the pivot table.
     */
    showColumnSubTotals?: boolean;
    /**
     * Allows the row and column sub-totals to be displayed at the top or bottom of the header group in the pivot table.
     * > By default, the column sub-totals are displayed at the bottom and row sub-totals are displayed at the top of their header group in the pivot table.
     */
    subTotalsPosition?: SubTotalsPosition;
    /**
     * Allows to show or hide grand totals in both rows and columns axis of the pivot table.
     */
    showGrandTotals?: boolean;
    /**
     * Allows the grand totals to be position at first position in the row and column axis of the pivot table.
     */
    grandTotalsPosition?: GrandTotalsPosition;
    /**
     * Allows to show or hide grand totals in row axis of the pivot table.
     */
    showRowGrandTotals?: boolean;
    /**
     * Allows to show or hide grand totals in column axis of the pivot table.
     */
    showColumnGrandTotals?: boolean;
    /**
     * Allows the undefined headers to be displayed in the pivot table, when the specific field(s) are not defined in the raw data.
     * For example, if the raw data for the field ‘Country’ is defined as “United Kingdom” and “State” is not defined means, it will be shown as “United Kingdom >> Undefined” in the header section.
     */
    showHeaderWhenEmpty?: boolean;
    /**
     * Allows to show the value field header always in pivot table, even if it holds a single field in the value field axis.
     */
    alwaysShowValueHeader?: boolean;
    /**
     * Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
     */
    conditionalFormatSettings?: IConditionalFormatSettings[];
    /**
     * Allows to show custom string to the empty value cells that used to display in the pivot table. You can fill empty value cells with any value like “0”, ”-”, ”*”, “(blank)”, etc.
     */
    emptyCellsTextContent?: string;
    /**
     * Allows specific fields to group their data on the basis of their type.
     * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
     * You can perform custom group to the string type fields that used to displayed in the pivot table.
     */
    groupSettings?: IGroupSettings[];
    /**
     * Allows the pivot button with specific value field caption along with the aggregation type, to be displayed in the grouping bar and field list UI.
     * For example, if the value field "Sold Amount" is aggregated with Sum, it will be displayed with caption "Sum of Sold Amount" in its pivot button.
     */
    showAggregationOnValueField?: boolean;
    /**
     * Allows you to set the credential information to access the specified SSAS cube.
     * > It is applicable only for OLAP data source.
     */
    authentication?: IAuthenticationInfo;
    /**
     * Allows to define the data source type.
     */
    type?: DataSourceType;
    /**
     * Allows specific fields associated with field information that can be used while creating fieldlist. The following configurations which are applicable are as follows:
     * * `name`: Allows you to set the field name which is going to configure while creating the fieldlist.
     * * `caption`: Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     * * `showNoDataItems`: Allows you to display all members items of a specific field to the pivot table,
     * even doesn't have any data in its row/column intersection in data source. **Note: It is applicable only for relational data source.**
     * * `showSubTotals`: Allows to show or hide sub-totals to a specific field in row axis of the pivot table.
     * * `isNamedSet`: Allows you to set whether the specified field is a named set or not. In general,
     * the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself. **Note: It is applicable only for OLAP data source.**
     * * `isCalculatedField`: Allows to set whether the specified field is a calculated field or not.
     * In general, the calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table. **Note: It is applicable only for OLAP data source.**
     * * `showFilterIcon`: Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     * * `showSortIcon`: Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     * * `showRemoveIcon`: Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     * * `showEditIcon`: Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     * * `allowDragAndDrop`: Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     * * `expandAll`: Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    fieldMapping?: IFieldOptions[];
}
/**
 * Allows a collection of values fields to change the appearance of the pivot table value cells with different style properties such as background color, font color, font family, and font size based on specific conditions.
 */
export interface IConditionalFormatSettings {
    /**
     * Allows to set the value field name to apply conditional formatting.
     */
    measure?: string;
    /**
     * Allows you to choose the operator type such as equals, greater than, less than, etc. for conditional formatting.
     */
    conditions?: Condition;
    /**
     * Allows you to set the start value for applying conditional formatting.
     */
    value1?: number;
    /**
     * Allows you to set the end value for applying conditional formatting.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply.
     */
    value2?: number;
    /**
     * Allows to set the custom styles for the formatting applied values in the pivot table.
     */
    style?: IStyle;
    /**
     * Allows to set the header text of a specific row/column field to apply conditional formatting.
     */
    label?: string;
    /**
     * Allows to apply conditional formatting to the grand totals of row and column axis in the pivot table.
     */
    applyGrandTotals?: boolean;
}
/**
 * Allows the style information to customize the pivot table cell appearance.
 */
export interface IStyle {
    /**
     * It allows to set the background color to the value cell in the pivot table.
     */
    backgroundColor?: string;
    /**
     * It allows to set the font color to the value cell in the pivot table.
     */
    color?: string;
    /**
     * It allows to set the font family to the value cell in the pivot table.
     */
    fontFamily?: string;
    /**
     * It allows to set the font size to the value cell in the pivot table.
     */
    fontSize?: string;
}
/**
 * Allows to sort individual value field and its aggregated values either in row or column axis to ascending or descending order.
 */
export interface IValueSortSettings {
    /**
     * It allows to set the member name of a specific field for value sorting.
     */
    headerText?: string;
    /**
     * It allows to set the delimiter, which is used a separator to split the given header text.
     */
    headerDelimiter?: string;
    /**
     * Allows to apply sorting to the specified field either by ascending or descending. The types are,
     * * `Ascending`: It allows to display the field members in ascending order.
     * * `Descending`: It allows to display the field members in descending order.
     */
    sortOrder?: Sorting;
    /**
     * It allows to set the column index of the value cell.
     */
    columnIndex?: number;
    /**
     * It allows to set the measure name to achieve value sorting based on this.
     * > It is applicable only for OLAP data source.
     */
    measure?: string;
    // preserveHierarchy?: boolean;
}
/**
 * Allows you to set the credential information to access the specified SSAS cube.
 * > It is applicable only for OLAP data source.
 */
export interface IAuthenticationInfo {
    /**
     * It allows to set the user name to access the specified SSAS cube.
     */
    userName?: string;
    /**
     * It allows to set the password to access the specified SSAS cube.
     */
    password?: string;
}
/**
 * Allows to set the page information to display the pivot table with specific page during virtual scrolling.
 */
export interface IPageSettings {
    /**
     * It allows to set the total column count of the pivot table.
     */
    columnPageSize?: number;
    /**
     * It allows to set the total row count of the pivot table.
     */
    rowPageSize?: number;
    /**
     * It allows to set the current column page count displayed in the pivot table.
     */
    currentColumnPage?: number;
    /**
     * It allows to set the current row page count displayed in the pivot table.
     */
    currentRowPage?: number;
}
/**
 * @hidden
 */
export interface IMatrix2D {
    [key: number]: { [key: number]: number };
    length: number;
    push(item: number): number;
}
/**
 * @hidden
 */
export interface ValueMatrixInfo {
    ordinal: number;
    member: number;
}
/**
 * @hidden
 */
interface ISortedHeaders {
    rMembers: IAxisSet[];
    cMembers: IAxisSet[];
}
/**
 * @hidden
 */
export interface IFilterObj {
    [key: string]: {
        memberObj: IStringIndex
    };
}
/**
 * @hidden
 */
export interface IIterator {
    [key: string]: {
        index: number[],
        indexObject: INumberIndex
    };
}
/**
 * @hidden
 */
export interface INumberIndex {
    [key: string]: number;
}
/**
 * @hidden
 */
export interface INumberArrayIndex {
    [key: string]: number[];
}
/**
 * @hidden
 */
export interface IStringIndex {
    [key: string]: string;
}
/**
 * It holds the collection of cell information to render the pivot table component.
 *
 * @hidden
 */
export interface IPivotValues {
    /**
     * Allows you to configure the pivot cell information retrieved from the data source.
     */
    [key: number]: {
        [key: number]: number | string | Object | IAxisSet,
        length: number
    };
    /**
     * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
     */
    length: number;
}
/**
 * @hidden
 */
export interface IPivotRows {
    [key: number]: number | string | Object | IAxisSet;
    length: number;
}
/**
 * @hidden
 */
export interface IGridValues {
    [key: number]: IAxisSet[];
    length: number;
}
/**
 * @hidden
 */
export interface ISelectedValues {
    [key: number]: IAxisSet;
}
/**
 * @hidden
 */
export interface IDataSet {
    [key: string]: string | number | Date;
}

/**
 * Allows specific fields associated with field information that needs to be displayed in the field axes of pivot table. The following configurations which are applicable are as follows:
 */
export interface IFieldOptions {
    /**
     * Allows you to set the field name that needs to be displayed in row/column/value/filter axis of pivot table.
     */
    name?: string;
    /**
     * Allows you to set caption to the specific field. It will be used to display instead of its name in pivot table component's UI.
     */
    caption?: string;
    /**
     * Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… The available types are,
     * * `Sum`: Allows to display the pivot table values with sum.
     * * `Product`: Allows to display the pivot table values with product.
     * * `Count`: Allows to display the pivot table values with count.
     * * `DistinctCount`: Allows to display the pivot table values with distinct count.
     * * `Min`: Allows to display the pivot table with minimum value.
     * * `Max`: Allows to display the pivot table with maximum value.
     * * `Avg`: Allows to display the pivot table values with average.
     * * `Median`: Allows to display the pivot table values with median.
     * * `Index`: Allows to display the pivot table values with index.
     * * `PopulationStDev`: Allows to display the pivot table values with population standard deviation.
     * * `SampleStDev`: Allows to display the pivot table values with sample standard deviation.
     * * `PopulationVar`: Allows to display the pivot table values with population variance.
     * * `SampleVar`: Allows to display the pivot table values with sample variance.
     * * `RunningTotals`: Allows to display the pivot table values with running totals.
     * * `DifferenceFrom`: Allows to display the pivot table values with difference from the value of the base item in the base field.
     * * `PercentageOfDifferenceFrom`: Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
     * * `PercentageOfGrandTotal`: Allows to display the pivot table values with percentage of grand total of all values.
     * * `PercentageOfColumnTotal`: Allows to display the pivot table values in each column with percentage of total values for the column.
     * * `PercentageOfRowTotal`: Allows to display the pivot table values in each row with percentage of total values for the row.
     * * `PercentageOfParentTotal`: Allows to display the pivot table values with percentage of total of all values based on selected field.
     * * `PercentageOfParentColumnTotal`: Allows to display the pivot table values with percentage of its parent total in each column.
     * * `PercentageOfParentRowTotal`: Allows to display the pivot table values with percentage of its parent total in each row.
     * * `CalculatedField`: Allows to display the pivot table with calculated field values. It allows user to create a new calculated field alone.
     *
     * > It is applicable only for relational data source.
     */
    type?: SummaryTypes;
    /**
     * Allows you to set the axis name to the specific field. This will help to display the field in specified axis such as row/column/value/filter axis of pivot table.
     */
    axis?: string;
    /**
     * Allows you to display all members items of a specific field to the pivot table, even doesn't have any data in its row/column intersection in data source.
     * > It is applicable only for relational data source.
     */
    showNoDataItems?: boolean;
    /**
     * Allows you to set the selective field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom or PercentageOfParentTotal aggregate types.
     * > It is applicable only for relational data source.
     */
    baseField?: string;
    /**
     * Allows you to set the selective item of a specific field, which used to display the values with either DifferenceFrom or PercentageOfDifferenceFrom aggregate types.
     * The selective item should be set the from field specified in the baseField property.
     * > It is applicable only for relational data source.
     */
    baseItem?: string;
    /**
     * Allows to show or hide sub-totals to a specific field in row/column axis of the pivot table.
     */
    showSubTotals?: boolean;
    /**
     * Allows you to set whether the specified field is a named set or not.
     * In general, the named set is a set of dimension members or a set expression (MDX query) to be created as a dimension in the SSAS OLAP cube itself.
     * > It is applicable only for OLAP data source.
     */
    isNamedSet?: boolean;
    /**
     * Allows to set whether the specified field is a calculated field or not. In general, a calculated field is created from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
     * > This option is applicable only for OLAP data source.
     */
    isCalculatedField?: boolean;
    /**
     * Allows you to show or hide the filter icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This filter icon is used to filter the members of a specified field at runtime in the pivot table.
     */
    showFilterIcon?: boolean;
    /**
     * Allows you to show or hide the sort icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This sort icon is used to order members of a specified field either in ascending or descending at runtime.
     */
    showSortIcon?: boolean;
    /**
     * Allows you to show or hide the remove icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This remove icon is used to remove the specified field during runtime.
     */
    showRemoveIcon?: boolean;
    /**
     * Allows you to show or hide the value type icon of a specific field that used to be displayed in the pivot button of the grouping bar and field list UI.
     * This value type icon helps to select the appropriate aggregation type to specified value field at runtime.
     */
    showValueTypeIcon?: boolean;
    /**
     * Allows you to show or hide the edit icon of a specific field that used to be displayed on the pivot button of the grouping bar and field list UI.
     * This edit icon is used to modify caption, formula, and format of a specified calculated field at runtime that to be displayed in the pivot table.
     */
    showEditIcon?: boolean;
    /**
     * Allows you to restrict the specific field's pivot button that is used to drag on runtime in the grouping bar and field list UI.
     * This will prevent you from modifying the current report.
     */
    allowDragAndDrop?: boolean;
    //filter?: FilterOptions;
    /**
     * Allows to specify the data type of specific field.
     */
    dataType?: string;
    /**
     * Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    expandAll?: boolean;
    /**
     * Allows you to create group folder for fields in pivot field list.
     * Allows user to set the group (i.e., folder) name for selected fields that used to be displayed in the field list tree.
     * > It is applicable only for relational data source.
     */
    groupName?: string;
}

/**
 * Allows specific fields associated with sort settings to order their members either in ascending or descending that used to be displayed in the pivot table.
 */
export interface ISort {
    /**
     * Allows to set the field name to order their members either in ascending or descending in the pivot table.
     */
    name?: string;
    //type?: string;
    /**
     * Allows to apply sorting to the specified field either by ascending or descending or JSON order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order.
     * * `Descending`: It allows to display the field members in descending order.
     * * `None`: It allows to display the field members based on JSON order.
     */
    order?: Sorting;
    /**
     * Allows to specify the sorting order for custom sorting.
     *
     */
    membersOrder?: string[] | number[];
}

/**
 * Allows specific fields associated with either selective or conditional-based filter members that used to be displayed in the pivot table.
 */
export interface IFilter {
    /**
     * Allows you to set the field name that used to display the selective or conditional-based filter members that used to be displayed in the pivot table.
     */
    name?: string;
    /**
     * Allows you to set the specific filter type to display the filter members in the pivot table. They are:
     * * Include - Specifies the filter type as include.
     * * Exclude - Specifies the filter type as exclude.
     * * Label - Specifies the filter type as label.
     * * Date - Specifies the filter type as date.
     * * Number - Specifies the filter type as number.
     * * Value - Specifies the filter type as value.
     *
     * @default Include
     */
    type?: FilterType;
    /**
     * Allows you to specify the field members that used to be displayed based on the filter type provided in the pivot table.
     */
    items?: string[];
    /**
     * Allows you to choose the operator type such as equals, greater than, less than, etc. for conditional-based filtering.
     * > It is applicable only for label and value filtering.
     */
    condition?: Operators;
    /**
     * Allows you to set the start value to display the filter items in the pivot table based on the condition applied.
     * > It is applicable only for label and value filtering.
     */
    value1?: string | Date;
    /**
     * Allows you to set the end value to display the filter items in the pivot table based on the condition applied.
     * > This option will be used by default when the operator **Between** and **NotBetween** is chosen to apply. Also, it is applicable only for label and value filtering.
     */
    value2?: string | Date;
    /**
     * It allows excel-like label filtering operation through UI and code-behind.
     */
    showLabelFilter?: boolean;
    /**
     * It allows excel-like date filtering operation through UI and code-behind.
     */
    showDateFilter?: boolean;
    /**
     * It allows excel-like number filtering operation through UI and code-behind.
     */
    showNumberFilter?: boolean;
    /**
     * Allows to set value field for evaluation using conditions and operands for filtering.
     * > It is applicable only for label and value filtering.
     */
    measure?: string;
    /**
     * Allows to set level of the field to fetch data from the cube for filtering.
     * > This option is applicable only for user-defined hierarchies in OLAP data source.
     */
    levelCount?: number;
    /**
     * Allows to set level name of a specified field, where the filtering settings to be applied.
     * > This option is applicable only for user-defined hierarchies in OLAP data source.
     */
    selectedField?: string;
}

/**
 * Allows specific fields used to display their the headers to be either expanded or collapsed in the pivot table.
 */
export interface IDrillOptions {
    /**
     * It allows to set the field name whose members to be either expanded or collapsed in the pivot table.
     */
    name?: string;
    /**
     * It allows to set the members to be either expanded or collapsed in the pivot table.
     */
    items?: string[];
    /**
     * It allows to set the delimiter, which is used a separator to split the given members.
     */
    delimiter?: string;
}

/**
 * Allows options to create new calculated fields from the bound data source or using simple formula with basic arithmetic operators in the pivot table.
 */
export interface ICalculatedFieldSettings {
    /**
     * It allows to set the field name that used to create as a calculated field.
     */
    name?: string;
    /**
     * It allows to set the formula/expression to the specified calculated field.
     */
    formula?: string;
    /**
     * It allows to set hierarchy unique name, that used to create calculated member.
     * > It is applicable only for OLAP data source.
     */
    hierarchyUniqueName?: string;
    /**
     * It allows to set format string that used to create calculated member with specified formatted values that to be displayed in the pivot table.
     * > It is applicable only for OLAP data source.
     */
    formatString?: string;
}
/**
 * Configures the specific calculated field information.
 */
export interface ICalculatedFields extends ICalculatedFieldSettings {
    /**
     * It allows to set the caption to the calculated field that used to be displayed in the pivot table UI.
     */
    caption?: string;
    /**
     * It allows to set the calculated field's actual formula.
     */
    actualFormula?: string;
}

/**
 * Allows specific fields used to display the values with specific format that used to be displayed in the pivot table.
 * For example, to display a specific field with currency formatted values in the pivot table, the set the `format` property to be **C**.
 */
export interface IFormatSettings extends NumberFormatOptions, DateFormatOptions {
    /**
     * It allows to set the field name to apply format settings.
     */
    name?: string;
}
/**
 * @hidden
 */
export interface IMembers {
    [index: string]: {
        ordinal?: number;
        index?: number[];
        name?: string;
        isDrilled?: boolean;
        isNodeExpand?: boolean;
        parent?: string;
        caption?: string;
        isSelected?: boolean;
    };
}
/**
 * @hidden
 */
export interface IFieldListOptions {
    [index: string]: IField;
}

/**
 * Allows you to configure the information retrieved from the data source for the field list.
 */
export interface IField {
    /**
     * It allows to set the field name.
     */
    id?: string;
    /**
     * It allows to set the parent name.
     *
     */
    pid?: string;
    /**
     * It allows to set the field caption.
     */
    caption?: string;
    /**
     * It allows to set the field type to be either number or string or data or datetime.
     */
    type?: string;
    /**
     * It allows to set the current number format string of the field.
     */
    formatString?: string;
    /**
     * It allows to set the exact position of the specific field situated in the given data source.
     */
    index?: number;
    /**
     * It allows to set members information of the specific field.
     */
    members?: IMembers;
    /**
     * It allows to set members caption information of the specific field.
     */
    formattedMembers?: IMembers;
    /**
     * It allows to set date members information of the specific field.
     */
    dateMember?: IAxisSet[];
    /**
     * It allows to set the current filter members to the specific field.
     */
    filter?: string[];
    /**
     * It allows to set the current sort order to the specific field.
     */
    sort?: string;
    /**
     * It allows to set the current aggregate type to the specific field.
     */
    aggregateType?: string;
    /**
     * It allows to set the selective field name to the field to perform aggregation.
     */
    baseField?: string;
    /**
     * It allows to set the selective member of the specific field to perform aggregation.
     */
    baseItem?: string;
    /**
     * It allows to change the specific field's type.
     */
    filterType?: string;
    /**
     * It allows to set the format to the specific field.
     */
    format?: string;
    /**
     * It allows to set the calculated field formula.
     */
    formula?: string;
    /**
     * Allows to set whether the specific field is selected or not.
     */
    isSelected?: boolean;
    /**
     * Allows to set the specific field for excel-like filtering.
     */
    isExcelFilter?: boolean;
    /**
     * Allows to set the specific field to display the data items that are not in combination with respect to current report.
     */
    showNoDataItems?: boolean;
    /**
     * Allows to set whether the specific field is custom grouped or not.
     */
    isCustomField?: boolean;
    /**
     * It allows to set the visibility of filter icon in grouping bar and field list button.
     */
    showFilterIcon?: boolean;
    /**
     * It allows to set the visibility of sort icon in grouping bar and field list button.
     */
    showSortIcon?: boolean;
    /**
     * It allows to set the visibility of remove icon in grouping bar button.
     */
    showRemoveIcon?: boolean;
    /**
     * It allows to set the visibility of calculated field edit icon in grouping bar and field list button.
     */
    showEditIcon?: boolean;
    /**
     * It allows to set the visibility of summary type drop down icon in grouping bar and field list button.
     */
    showValueTypeIcon?: boolean;
    /**
     * It allows to enable/disable the drag and drop option to grouping bar and field list button.
     */
    allowDragAndDrop?: boolean;
    /**
     * Allows to set whether is is a calculated field or not.
     */
    isCalculatedField?: boolean;
    /**
     * It allows enable/disable sub total in pivot table.
     */
    showSubTotals?: boolean;
    /**
     * Allows you to expand or collapse all of the pivot table's headers for a specific field.
     */
    expandAll?: boolean;
    /**
     * It allows to set custom sort members of the specific field.
     */
    membersOrder?: string[] | number[];
    /**
     * It allows you to check if the custom sort type of a specific field is Alphanumeric or not.
     *
     * @default false
     */
    isAlphanumeric?: boolean;
    /**
     * @hidden
     */
    isMembersFilled?: boolean;
}

/**
 * Allows you to configure the pivot cell information retrieved from the data source.
 */
export interface IAxisSet {
    /**
     * It allows to set the formatted text.
     */
    formattedText?: string;
    /**
     * It allows to set the actual text.
     */
    actualText?: number | string;
    /**
     * It allows to set the member type.
     */
    type?: string;
    /**
     * It allows to set whether the member is drilled or not.
     */
    isDrilled?: boolean;
    /**
     * It allows to set whether the member has children or not.
     */
    hasChild?: boolean;
    /**
     * It allows to set the child members collection of the specific member.
     */
    members?: this[];
    /**
     * Specifies its position collections in data source.
     */
    index?: number[];
    /**
     * Specifies its position collections in data source with indexed object.
     */
    indexObject?: INumberIndex;
    /**
     * It allows to set the cell ordinal.
     */
    ordinal?: number;
    /**
     * It allows to set level of the member.
     */
    level?: number;
    /**
     * It allows to set the axis name of the member.
     */
    axis?: string;
    /**
     * It allows to set value of the cell.
     */
    value?: number;
    /**
     * It allows to set actual value of the cell.
     */
    actualValue?: number;
    /**
     * It allows to set column span to the cell.
     */
    colSpan?: number;
    /**
     * It allows to set row span to the cell.
     */
    rowSpan?: number;
    /**
     * Specifies the data collection which is to be framed for value sorted members.
     */
    valueSort?: IDataSet;
    /**
     * It allows to set column index to the cell.
     */
    colIndex?: number;
    /**
     * It allows to set row index to the cell.
     */
    rowIndex?: number;
    /**
     * Specifies the column header of a value cell.
     */
    columnHeaders?: string | number | Date;
    /**
     * Specifies the row header of a value cell.
     */
    rowHeaders?: string | number | Date;
    /**
     * Specifies whether the cell is summary or not.
     */
    isSum?: boolean;
    /**
     * Specifies whether the cell is grand summary or not.
     */
    isGrandSum?: boolean;
    /**
     * Specifies whether the level of the cell is filtered or not.
     */
    isLevelFiltered?: boolean;
    /**
     * It allows to custom class names to the cell.
     */
    cssClass?: string;
    /**
     * It allows to set the style information for conditional formatting.
     */
    style?: IStyle;
    /**
     * It allows to set the visibility of hyperlink to the cell.
     */
    enableHyperlink?: boolean;
    /**
     * It allows enable/disable sub totals.
     */
    showSubTotals?: boolean;
    /**
     * It allows set the formatted date string of the cell.
     */
    dateText?: number | string;
    /**
     * It allows to set member type.
     */
    memberType?: number;
    /**
     * It allows to set the parent unique name.
     */
    parentUniqueName?: string;
    /**
     * It allows to set the parent unique name.
     */
    levelUniqueName?: string;
    /**
     * It allows to set whether the member field is a attribute hierarchy or not.
     */
    hierarchy?: string;
    /**
     * It allows to set column ordinal of the cell.
     */
    colOrdinal?: number;
    /**
     * It allows to set row ordinal of the cell.
     */
    rowOrdinal?: number;
    /**
     * It allows to set whether field is a namedset or not.
     */
    isNamedSet?: boolean;
    /**
     * It allows to set depth of the cell.
     */
    depth?: number;
    /**
     * Specifies the value cell's unique header name.
     *
     * @hidden
     */
    hierarchyName?: string;
}
/**
 * Allows you to configure the drill information of a specific field item that used to display the pivot table.
 */
export interface IDrilledItem {
    /**
     * It allows to set the field name whose members to be drilled.
     */
    fieldName: string;
    /**
     * It allows to set the member name of the specific field.
     */
    memberName: string;
    /**
     * It allows to set the axis name of the specific field.
     */
    axis: string;
    /**
     * It allows to set whether the member performs drill-down or drill-up operation.
     */
    action: string;
    /**
     * It allows to set the delimiter, which is used a member separator.
     */
    delimiter: string;
    /**
     * It allows to set the selected cell information.
     */
    currentCell?: IAxisSet;
}
/**
 * Allows you to configure the additional properties from the pivot component to popuplate the pivot engine.
 *
 * @hidden
 */
export interface ICustomProperties {
    /**
     * Specifies the current data type.
     */
    mode?: string;
    /**
     * Specifies the saved field list information.
     */
    savedFieldList?: IFieldListOptions;
    /**
     * Specifies the paging information for virtualization.
     */
    pageSettings?: IPageSettings;
    /**
     * Specifies the whether the value sorting is enabled or not.
     */
    enableValueSorting?: boolean;
    /**
     * Specifies the whether the paging option is enabled or not.
     */
    enablePaging?: boolean;
    /**
     * Specifies the whether the virtualization option is enabled or not.
     */
    enableVirtualization?: boolean;
    /**
     * Specifies the whether the data compression option is enabled or not.
     */
    allowDataCompression?: boolean;
    /**
     * Specifies the whether drill through is enabled or not.
     */
    isDrillThrough?: boolean;
    /**
     * Specifies the whether html sanitizer is enabled or not.
     */
    enableHtmlSanitizer?: boolean;
    /**
     * Specifies the current locale information of the component.
     */
    localeObj?: L10n;
    /**
     * Specifies the current culture information of the component.
     */
    globalize?: Internationalization;
    /**
     * Specifies the current currency code of the component.
     */
    currenyCode?: string;
    /**
     * Specifies the customized field type information.
     */
    fieldsType?: IStringIndex;
    /**
     * Specifies the cloned report.
     */
    clonedReport?: IDataOptions;
    /**
     * Specifies whether the allowSinglePage option is enabled or not.
     */
    enableOptimizedRendering ?: boolean;
}
/**
 * @hidden
 */
interface IHeadersInfo {
    axis: string;
    headers: IAxisSet[];
    fields: IFieldOptions[];
    position: number;
}
/**
 * @hidden
 */
interface ValueSortData {
    rowData: IDataSet[];
    childMembers: this[];
}

/**
 * @hidden
 */
interface IHeaderData {
    name: string;
    level: number;
    axis: string;
    isChild: boolean;
    valueCount: number;
    aggregateHeaders: IAxisSet[];
    childMembers: this[];
    value: string;
    type: SummaryTypes;
    uniqueName: string;
}

/**
 * @hidden
 */
interface AggregateCollection {
    selectedHeader: IHeaderData[];
    values: string[];
}

/**
 * @hidden
 */
interface IValueFilterSettings {
    [index: string]: IFilter;
}
/**
 * @hidden
 */
interface IValueFields {
    [index: string]: IFieldOptions;
}
/**
 * Allows specific fields to group their data on the basis of their type.
 * For example, the date type fields can be formatted and displayed based on year, quarter, month, and more. Likewise, the number type fields can be grouped range-wise, such as 1-5, 6-10, etc.
 * You can perform custom group to the string type fields that used to displayed in the pivot table.
 */
export interface IGroupSettings {
    /**
     * It allows to set the specific field name to apply group settings.
     */
    name?: string;
    /**
     * It allows to specify the date group intervals such as years or quarter or months or days or hours or minutes or seconds to group fields based on that in the pivot table. They options are:
     * * Years - Specifies the group as years.
     * * Quarters - Specifies the group as quarters.
     * * Months - Specifies the group as months.
     * * Days - Specifies the group as days.
     * * Hours - Specifies the group as hours.
     * * Minutes - Specifies the group as minutes.
     * * Seconds - Specifies the group as seconds.
     *
     * > It is applicable only for date type grouping.
     */
    groupInterval?: DateGroup[];
    /**
     * It allows to set the start value/date to group fields from the specified range that to be displayed in the pivot table.
     */
    startingAt?: Date | number | string;
    /**
     * It allows to set the start value/date to group fields to the specified range that to be displayed in the pivot table.
     */
    endingAt?: Date | number | string;
    /**
     * It allows to set the interval range to group field based on the specified range.
     * > It is applicable only of number type grouping.
     */
    rangeInterval?: number;
    /**
     * It allows to set the type as date or number or custom to the specified field for apply grouping. The types are:
     * * Date - Defines group type as 'Date' for date type field
     * * Number - Defines group type as 'Number' for numeric type field.
     * * Custom - Defines group type as 'Custom' for custom group field.
     */
    type?: GroupType;
    /**
     * It allows to set the caption to custom field that will be used to created from custom group fields in the pivot table.
     * > It is applicable only for custom grouping.
     */
    caption?: string;
    /**
     * It allows to set the custom group information to create custom group fields.
     * > It is applicable only for custom grouping.
     */
    customGroups?: ICustomGroups[];
}

/**
 * Allows to specify the custom group information of specific field to create custom groups.
 */
export interface ICustomGroups {
    /**
     * Allows user to set the group name (or title) for selected headers for custom grouping.
     */
    groupName?: string;
    /**
     * It allows to set the headers which needs to be grouped from display.
     */
    items?: string[];
}

/**
 * Allows to configure the group range information to perform date and number grouping on specific fields.
 */
export interface IGroupRange {
    /**
     * Specifies the group range value.
     */
    range?: string;
    /**
     * Specifies whether the group value is in range or not.
     */
    isNotInRange?: boolean;
    /**
     * Specifies the actual value exists in the raw item.
     */
    value?: Date | number;
}

/**
 * Allows to configure the specific field information during UI operation at runtime.
 */
export interface FieldItemInfo {
    /**
     * Specifies the field name.
     */
    fieldName?: string;
    /**
     * Specifies the field information as an object.
     */
    fieldItem?: IFieldOptions;
    /**
     * Specifies the axis name where the field currently exists.
     */
    axis?: string;
    /**
     * Specifies the position of the field in the axis.
     */
    position?: number;
}
