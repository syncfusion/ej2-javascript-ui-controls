import { extend, Internationalization, NumberFormatOptions, DateFormatOptions, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotUtil } from './util';
import { Sorting, SummaryTypes, FilterType, LabelOperators, ValueOperators, Operators, DateOperators, Condition } from './types';
import { DateGroup, GroupType } from './types';
import { HeaderCollection, AggregateEventArgs } from '../common';
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
    public pivotValues: IPivotValues;
    /** @hidden */
    public headerContent: IGridValues;
    /** @hidden */
    public valueContent: IGridValues = [];
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
    public excludeFields: string[];
    /** @hidden */
    public groups: IGroupSettings[];
    /** @hidden */
    public isMutiMeasures: boolean;
    /** @hidden */
    public alwaysShowValueHeader: boolean;
    /** @hidden */
    public drilledMembers: IDrillOptions[];
    /** @hidden */
    public formats: IFormatSettings[];
    /** @hidden */
    public isExpandAll: boolean;
    /** @hidden */
    public enableSort: boolean;
    /** @hidden */
    public showSubTotals: boolean;
    /** @hidden */
    public showRowSubTotals: boolean;
    /** @hidden */
    public showColumnSubTotals: boolean;
    /** @hidden */
    public showGrandTotals: boolean;
    /** @hidden */
    public showRowGrandTotals: boolean;
    /** @hidden */
    public showColumnGrandTotals: boolean;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public filterMembers: number[];
    /** @hidden */
    public formatFields: { [key: string]: IFormatSettings } = {};
    /** @hidden */
    public calculatedFieldSettings: ICalculatedFieldSettings[];
    /** @hidden */
    public calculatedFields: { [key: string]: ICalculatedFields } = {};
    /** @hidden */
    public calculatedFormulas: { [key: string]: Object } = {};
    /** @hidden */
    public valueSortSettings: IValueSortSettings;
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
    private allowValueFilter: boolean;
    private isValueFiltered: boolean;
    private isValueFiltersAvail: boolean;
    private valueSortData: ValueSortData[];
    private valueFilteredData: IAxisSet[];
    private filterFramedHeaders: IAxisSet[];
    private valueMatrix: IMatrix2D = [];
    private indexMatrix: IMatrix2D = [];
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
    private rawIndexObject: INumberIndex = {};
    private isEditing: Boolean = false;
    private data: IDataSet[] = [];
    private frameHeaderObjectsCollection: boolean = false;
    private headerObjectsCollection: { [key: string]: IAxisSet[] } = {};
    private localeObj: L10n;
    private getValueCellInfo: Function;
    private fieldsType: IStringIndex;
    private groupingFields: { [key: string]: string } = {};
    /* tslint:disable */
    public renderEngine(
        dataSource?: IDataOptions, customProperties?: ICustomProperties, fn?: Function): void {
        this.getValueCellInfo = fn;
        this.formatFields = {};
        this.calculatedFields = {};
        this.calculatedFormulas = {};
        this.valueAxis = 0;
        this.saveDataHeaders = {};
        this.columnCount = 0;
        this.rowCount = 0;
        this.colFirstLvl = 0;
        this.rowFirstLvl = 0;
        this.rowStartPos = 0;
        this.colStartPos = 0;
        this.excludeFields = isNullOrUndefined(dataSource.excludeFields) ? [] : dataSource.excludeFields;
        this.enableValueSorting = false;
        this.headerCollection = { rowHeaders: [], columnHeaders: [], rowHeadersCount: 0, columnHeadersCount: 0 };
        this.valueMatrix = [];
        this.indexMatrix = [];
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
        this.rawIndexObject = {};
        this.isEditing = false;
        let fields: IDataSet;
        let val: string;
        let filterRw: number[][][];
        this.globalize = new Internationalization();
        this.localeObj = customProperties ? customProperties.localeObj : undefined;
        this.fieldsType = customProperties ? customProperties.fieldsType : {};
        this.enableSort = dataSource.enableSorting;
        this.alwaysShowValueHeader = dataSource.alwaysShowValueHeader;
        this.showSubTotals = isNullOrUndefined(dataSource.showSubTotals) ? true : dataSource.showSubTotals;
        this.showRowSubTotals = isNullOrUndefined(dataSource.showRowSubTotals) ? true : dataSource.showRowSubTotals;
        this.showColumnSubTotals = isNullOrUndefined(dataSource.showColumnSubTotals) ? true : dataSource.showColumnSubTotals;
        this.showGrandTotals = isNullOrUndefined(dataSource.showGrandTotals) ? true : dataSource.showGrandTotals;
        this.showRowGrandTotals = isNullOrUndefined(dataSource.showRowGrandTotals) ? true : dataSource.showRowGrandTotals;
        this.showColumnGrandTotals = isNullOrUndefined(dataSource.showColumnGrandTotals) ? true : dataSource.showColumnGrandTotals;
        this.allowValueFilter = dataSource.allowValueFilter;
        this.isValueFilterEnabled = false;
        this.enableValueSorting = customProperties ? customProperties.enableValueSorting : false;
        this.valueContent = [];
        if (dataSource.data && (dataSource.data as IDataSet[])[0]) {
            this.fields = Object.keys((dataSource.data as IDataSet[])[0]);
            let keys: string[] = this.fields;
            let report: { [key: number]: IFieldOptions[] } = {};
            report[0] = dataSource.rows;
            report[1] = dataSource.columns;
            report[2] = dataSource.values;
            report[3] = dataSource.filters;
            let pos: number = 0;
            while (pos < 4) {
                if (report[pos]) {
                    for (let cnt: number = 0; cnt < report[pos].length; cnt++) {
                        if (this.excludeFields.indexOf(report[pos][cnt].name) > -1) {
                            report[pos].splice(cnt, 1);
                            cnt--;
                        }
                    }
                }
                pos++;
            }
            this.rows = dataSource.rows ? dataSource.rows : [];
            this.columns = dataSource.columns ? dataSource.columns : [];
            this.filters = dataSource.filters ? dataSource.filters : [];
            this.formats = dataSource.formatSettings ? dataSource.formatSettings : [];
            this.values = dataSource.values ? dataSource.values : [];
            this.groups = dataSource.groupSettings ? dataSource.groupSettings : [];
            this.calculatedFieldSettings = dataSource.calculatedFieldSettings ? dataSource.calculatedFieldSettings : [];
            this.enableSort = dataSource.enableSorting === undefined ? true : dataSource.enableSorting;
            fields = this.getGroupData(dataSource.data as IDataSet[]);
            this.data = dataSource.data as IDataSet[];
            this.validateFilters(dataSource);
            this.isExpandAll = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? true : dataSource.expandAll;
            this.drilledMembers =
                dataSource.drilledMembers ? (this.isValueFiltersAvail && dataSource.allowValueFilter) ? [] : dataSource.drilledMembers : [];
            this.isMutiMeasures = this.values.length > 1 ? true : false;
            this.valueAxis = dataSource.valueAxis === 'row' ? 1 : 0;
            this.emptyCellTextContent = dataSource.emptyCellsTextContent ? dataSource.emptyCellsTextContent : '';
            this.rowValuesLength = this.valueAxis === 1 ? this.values.length : 1;
            this.colValuesLength = this.valueAxis === 0 ? this.values.length : 1;
            this.valueSortSettings = dataSource.valueSortSettings ||
                { sortOrder: 'None', headerDelimiter: '.', headerText: '', columnIndex: undefined } as IValueSortSettings;
            this.valueSortData = [];
            this.pageSettings = customProperties ? (customProperties.pageSettings ? customProperties.pageSettings : this.pageSettings)
                : undefined;
            this.savedFieldList = customProperties ? customProperties.savedFieldList : undefined;
            this.isDrillThrough = customProperties ? (customProperties.isDrillThrough ? customProperties.isDrillThrough : false) : false;
            this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
            this.fillFieldMembers(dataSource.data as IDataSet[], this.indexMatrix);
            this.updateSortSettings(dataSource.sortSettings, this.enableSort);
            this.valueMatrix = this.generateValueMatrix(dataSource.data as IDataSet[]);
            this.filterMembers = [];
            this.updateFilterMembers(dataSource);
            this.generateGridData(dataSource);
        }
    }

    /* tslint:disable */
    private getGroupData(data: IDataSet[]): IDataSet {
        let fieldkeySet: IDataSet = data[0];
        for (let dategroup of this.groups) {
            let fieldName: string = dategroup.name;
            if (this.fields.indexOf(fieldName) > -1) {
                let groupFields: { [key: string]: string } = {};
                if (dategroup.type === 'Number') {
                    if (PivotUtil.getType(fieldkeySet[fieldName] as Date) === 'number') {
                        if (dategroup.rangeInterval) {
                            data.sort((a, b) => (a[fieldName] > b[fieldName]) ? 1 : ((b[fieldName] > a[fieldName]) ? -1 : 0));
                        }
                    } else {
                        return fieldkeySet;
                    }
                }
                let len: number = data.length;
                while (len--) {
                    let item: IDataSet = data[len];
                    if (item[fieldName] && dategroup.type === 'Date') {
                        let date: Date = new Date(item[fieldName].toString());
                        if (!isNullOrUndefined(date) && dategroup.groupInterval.length > 0) {
                            let isGrouped: boolean = false;
                            for (let interval of dategroup.groupInterval) {
                                isGrouped = true;
                                let isInRangeAvail: boolean = this.getRange(dategroup, date.getTime());
                                let newDate: Date = PivotUtil.resetTime(new Date());
                                switch (interval) {
                                    case 'Years':
                                        {
                                            let newFieldName: string = fieldName + '_years';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setFullYear(date.getFullYear())).toString());
                                        }
                                        break;
                                    case 'Quarters':
                                        {
                                            let newFieldName: string = fieldName + '_quarters';
                                            groupFields[newFieldName] = interval;
                                            let month: number = Math.ceil((date.getMonth() + 1) / 3);
                                            item[newFieldName] = (isInRangeAvail ? undefined : ((this.localeObj ? this.localeObj.getConstant('qtr') : 'Qtr') + month.toString()));
                                        }
                                        break;
                                    case 'Months':
                                        {
                                            let newFieldName: string = fieldName + '_months';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setMonth(date.getMonth(), newDate.getDate())).toString());
                                        }
                                        break;
                                    case 'Days':
                                        {
                                            let newFieldName: string = fieldName + '_days';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setMonth(date.getMonth(), date.getDate())).toString());
                                        }
                                        break;
                                    case 'Hours':
                                        {
                                            let newFieldName: string = fieldName + '_hours';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setHours(date.getHours())).toString());
                                        }
                                        break;
                                    case 'Minutes':
                                        {
                                            let newFieldName: string = fieldName + '_minutes';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setMinutes(date.getMinutes())).toString());
                                        }
                                        break;
                                    case 'Seconds':
                                        {
                                            let newFieldName: string = fieldName + '_seconds';
                                            groupFields[newFieldName] = interval;
                                            item[newFieldName] = (isInRangeAvail ? undefined : new Date(newDate.setSeconds(date.getSeconds())).toString());
                                        }
                                        break;
                                }
                            }
                            if (isGrouped) {
                                delete item[fieldName];
                            }
                        }
                    } else {
                        let isInRangeAvail: boolean = this.getRange(dategroup, item[fieldName] as number);
                        item[fieldName] = isInRangeAvail ? undefined : item[fieldName];
                    }
                    let keys: string[] = Object.keys(item);
                    let isCompleteSet: boolean[] = [];
                    for (let key of keys) { isCompleteSet.push((item[key]) ? true : false); };
                    fieldkeySet = (((isCompleteSet.indexOf(false) === -1) && keys.length === Object.keys(data[0]).length) ? item : fieldkeySet);
                }
                if (dategroup.type === 'Date') {
                    let isDataSource: boolean = false;
                    let axisFields: IFieldOptions[][] = [this.rows, this.columns, this.values, this.filters];
                    let groupKeys: string[] = Object.keys(groupFields);
                    let gCnt: number = Object.keys(groupKeys).length;
                    let groupField: string;
                    for (let axis of axisFields) {
                        if (!isDataSource && axis) {
                            let cnt: number = axis.length;
                            let i: number = 0;
                            while (i < cnt) {
                                if (axis[i].name === fieldName) {
                                    let actualField: IFieldOptions = axis[i];
                                    axis.splice(i, 1);
                                    while (gCnt--) {
                                        groupField = groupFields[groupKeys[gCnt]];
                                        let newField: IFieldOptions = {
                                            name: groupKeys[gCnt],
                                            caption: (this.localeObj ? this.localeObj.getConstant(groupField) : groupField) + ' (' + fieldName + ')',
                                            type: 'Count' as SummaryTypes,
                                            showNoDataItems: actualField.showNoDataItems,
                                            baseField: actualField.baseField,
                                            baseItem: actualField.baseItem,
                                        };
                                        axis.splice(i, 0, newField);
                                    }
                                    break;
                                }
                                i++;
                            }
                            break;
                        }
                    }
                    gCnt = Object.keys(groupKeys).length;
                    while (gCnt--) {
                        groupField = groupFields[groupKeys[gCnt]];
                        let formatfield: IFormatSettings = new DataManager({ json: this.formats }).executeLocal(new Query().where('name', 'equal', groupKeys[gCnt]))[0] as IFormatSettings;
                        if (groupField !== 'Quarters' && !formatfield) {
                            let formatSettings: IFormatSettings = {
                                name: groupKeys[gCnt],
                                type: ['Years', 'Months', 'Days'].indexOf(groupField) > -1 ? 'date' : 'time',
                                format: ((groupField === 'Years') ? 'yyyy' : (groupField === 'Months') ? 'MMM' :
                                    (groupField === 'Days') ? 'd-MMM' : (groupField === 'Hours') ? 'hh a' :
                                        (groupField === 'Minutes') ? ':mm' : (groupField === 'Seconds') ? ':ss' : undefined)
                            };
                            this.formats.push(formatSettings);
                        }
                    }
                } else if (dategroup.type === 'Number' && dategroup.rangeInterval) {
                    let startValue: number;
                    let endValue: number;
                    let cStartValue: number;
                    let cEndValue: number;
                    let framedSet: number[] = [];
                    let unframedSet: number[] = [];
                    let dataLength: number = data.length;
                    let cnt: number = 0;
                    this.groupingFields[fieldName] = fieldName;
                    while (cnt < dataLength) {
                        unframedSet.push(data[cnt][fieldName] as number);
                        if (data[cnt][fieldName] && framedSet.indexOf(data[cnt][fieldName] as number) === -1) {
                            framedSet.push(data[cnt][fieldName] as number);
                        }
                        cnt++;
                    }
                    let framedSetLength: number = Math.max.apply(Math, framedSet);
                    for (let i: number = framedSet[0], len: number = framedSetLength; i < len; i++) {
                        if (unframedSet.indexOf(i) < 0) {
                            let duplicateData: IDataSet = this.frameData(data[0]);
                            duplicateData[fieldName] = i;
                            let index: number = unframedSet.lastIndexOf(i - 1);
                            unframedSet.splice(index + 1, 0, i);
                            data.splice(index + 1, 0, duplicateData);
                        }
                    }
                    dataLength = data.length;
                    cnt = 0;
                    while (cnt < dataLength) {
                        if (data[cnt] && data[cnt][fieldName]) {
                            cStartValue = data[cnt][fieldName] as number;
                            cEndValue = (cStartValue as number) + (dategroup.rangeInterval - 1);
                            startValue = (!startValue) ? cStartValue : startValue;
                            endValue = ((!endValue) ? ((cEndValue > framedSetLength) ? framedSetLength : cEndValue) : ((endValue > framedSetLength) ? framedSetLength : endValue));
                            if (cStartValue >= startValue && cStartValue <= endValue) {
                                data[cnt][fieldName] = ((startValue === endValue) ? startValue.toString() : startValue.toString() + '-' + endValue.toString());
                            } else if (cStartValue > endValue && cStartValue === endValue + 1) {
                                startValue = endValue + 1;
                                endValue = ((startValue + (dategroup.rangeInterval - 1) > framedSetLength) ? framedSetLength : startValue + (dategroup.rangeInterval - 1));
                                data[cnt][fieldName] = ((startValue === endValue) ? startValue.toString() : startValue.toString() + '-' + endValue.toString());
                            }
                            let keys: string[] = Object.keys(data[cnt]);
                            let isCompleteSet: boolean[] = [];
                            for (let key of keys) { isCompleteSet.push((data[cnt][key]) ? true : false); };
                            fieldkeySet = (((isCompleteSet.indexOf(false) === -1) && keys.length === Object.keys(data[0]).length) ? data[cnt] : fieldkeySet);
                        }
                        cnt++;
                    }
                    let axisFields: IFieldOptions[][] = [this.rows, this.columns, this.values, this.filters];
                    for (let fields of axisFields) {
                        let field: IFieldOptions = new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFieldOptions;
                        if (field) {
                            field = (<{ [key: string]: Object }>field).properties ? (<{ [key: string]: Object }>field).properties : field;
                            field.type = 'Count';
                        }
                    }
                    for (let i: number = 0, len: number = this.formats.length; i < len; i++) {
                        if (this.formats[i].name === fieldName) {
                            this.formats.splice(i, 1);
                            break;
                        }
                    }
                }
                this.groupingFields = extend(this.groupingFields, groupFields) as { [key: string]: string };
            } else {
                return fieldkeySet;
            }
        }
        this.fields = Object.keys(fieldkeySet);
        return fieldkeySet;
    }

    private frameData(data: IDataSet): IDataSet {
        let fields: string[] = Object.keys(data);
        let keyPos: number = 0;
        let framedSet: any = {};
        while (keyPos < fields.length) {
            framedSet[fields[keyPos]] = undefined;
            keyPos++;
        }
        return framedSet;
    }
    /* tslint:enable */

    private getRange(group: IGroupSettings, cValue: number): boolean {
        let isRangeAvail: boolean;
        if (group.type === 'Date') {
            let cDate: Date = new Date(cValue);
            if (group.startingAt && cDate.getTime() < (group.startingAt as Date).getTime() ||
                group.endingAt && cDate.getTime() > (group.endingAt as Date).getTime()) {
                isRangeAvail = true;
            } else {
                isRangeAvail = false;
            }
        } else {
            if (group.startingAt && cValue < (group.startingAt as number) ||
                group.endingAt && cValue > (group.endingAt as number)) {
                isRangeAvail = true;
            } else {
                isRangeAvail = false;
            }
        }
        return isRangeAvail;
    }
    private getFormattedFields(fields: IFieldOptions[]): void {
        let cnt: number = this.formats.length;
        while (cnt--) {
            this.formatFields[this.formats[cnt].name] = this.formats[cnt];
            // for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            // if (fields[len] && fields[len].name === this.formats[cnt].name) {
            //     this.formatFields[fields[len].name] = this.formats[cnt];
            // }
            // }
        }
    }
    private getFieldList(fields: { [index: string]: Object }, isSort: boolean, isValueFilteringEnabled: boolean): void {
        let type: string;
        let keys: string[] = this.fields;
        this.fieldList = {};
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        this.getFormattedFields(dataFields);
        this.getCalculatedField(keys);
        keys = this.fields;
        let lenE: number = this.excludeFields.length;
        lenE = lenE - 1;
        while (lenE > -1) {
            let index: number = this.fields.indexOf(this.excludeFields[lenE]);
            this.fields.splice(index, 1);
            lenE--;
        }
        let len: number = keys.length;
        if (this.savedFieldList) {
            this.fieldList = this.savedFieldList;
            while (len--) { /** while is used for better performance than for */
                let key: string = keys[len];
                if (this.fieldList[key]) {
                    this.fieldList[key].isSelected = false;
                    this.fieldList[key].index = len;
                    this.fieldList[key].filter = [];
                    this.fieldList[key].isExcelFilter = false;
                    this.fieldList[key].filterType = '';
                    if (this.isValueFiltersAvail && isValueFilteringEnabled) {
                        this.fieldList[key].dateMember = [];
                        this.fieldList[key].formattedMembers = {};
                        this.fieldList[key].members = {};
                    }
                } else {
                    this.fieldList[key] = {
                        id: key,
                        caption: key,
                        type: (type === undefined || type === 'undefined') ? 'number' : type,
                        filterType: '',
                        index: len,
                        filter: [],
                        sort: isSort ? 'Ascending' : 'None',
                        isSelected: false
                    };
                }
            }
        } else {
            while (len--) { /** while is used for better performance than for */
                let key: string = keys[len];
                type = (this.fieldsType && this.fieldsType[key]) ? this.fieldsType[key] : PivotUtil.getType(fields[key] as Date);
                if (!this.fieldList) {
                    this.fieldList = {};
                }
                this.fieldList[key] = {
                    id: key,
                    caption: key,
                    type: (type === undefined || type === 'undefined') ? 'number' : type,
                    filterType: '',
                    index: len,
                    filter: [],
                    sort: isSort ? 'Ascending' : 'None',
                    isSelected: false
                };
            }
        }
        this.updateTreeViewData(dataFields);
    }
    private updateFieldList(savedFieldList: IFieldListOptions): void {
        let keys: string[] = this.fields;
        let len: number = keys.length;
        while (len--) { /** while is used for better performance than for */
            this.fieldList[keys[len]].isExcelFilter = savedFieldList[keys[len]].isExcelFilter;
        }
    }
    private updateTreeViewData(fields: IFieldOptions[]): void {
        let cnt: number = fields.length;
        let lnt: number = this.calculatedFieldSettings.length;
        while (cnt--) {
            if (this.fieldList[fields[cnt].name]) {
                let field: IField = this.fieldList[fields[cnt].name];
                field.caption = fields[cnt].caption ? fields[cnt].caption : fields[cnt].name;
                field.isSelected = true;
                field.showNoDataItems = fields[cnt].showNoDataItems;
                field.aggregateType = fields[cnt].type;
                field.baseField = fields[cnt].baseField;
                field.baseItem = fields[cnt].baseItem;
            }
        }
        while (lnt--) {
            this.fieldList[this.calculatedFieldSettings[lnt].name].aggregateType = 'CalculatedField';
            this.fieldList[this.calculatedFieldSettings[lnt].name].formula = this.calculatedFieldSettings[lnt].formula;
        }
    }

    /* tslint:disable:typedef */
    private getCalculatedField(keys: string[]): void {
        for (let field of this.calculatedFieldSettings) {
            this.calculatedFields[field.name] = extend({}, field, null, true) as ICalculatedFields;
            this.calculatedFields[field.name].actualFormula = field.formula;
        }
        let fieldKeys: string[] = Object.keys(this.calculatedFields);
        for (let calc: number = 0, cnt: number = fieldKeys.length; calc < cnt; calc++) {
            let field: ICalculatedFields = this.calculatedFields[fieldKeys[calc]];
            let calcProperties: ICalculatedFields = (<{ [key: string]: Object }>field).properties as ICalculatedFields;
            let actualFormula: string =
                (calcProperties ? calcProperties.formula : field.formula).replace(/ +/g, '');
            let formula: string = actualFormula.replace(/"/g, '');
            field.formula = formula.indexOf('^') > -1 ? this.powerFunction(formula) : formula;
            field.name = calcProperties ? calcProperties.name : field.name;
            keys = keys.filter((key) => { return key !== field.name; });
            keys.push(field.name);
            let formulaType: string[] = actualFormula.split('\"');
            for (let len: number = 0, lmt: number = formulaType.length; len < lmt; len++) {
                let type: string = formulaType[len];
                let aggregateValue: string[] = type.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
                let selectedString: string = (aggregateValue[0] === 'DistinctCount' ?
                    'DistinctCount' : aggregateValue[0] === 'PopulationStDev' ?
                        'PopulationStDev' : aggregateValue[0] === 'SampleStDev' ? 'SampleStDev' : aggregateValue[0] === 'PopulationVar' ?
                            'PopulationVar' : aggregateValue[0] === 'SampleVar' ? 'SampleVar' : aggregateValue[0]);
                if (['Sum', 'Count', 'Min', 'Max', 'Avg', 'Product', 'DistinctCount',
                    'PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar'].indexOf(selectedString) !== -1) {
                    let index: number = keys.indexOf(aggregateValue[1]);
                    if (!this.calculatedFormulas[field.name]) {
                        this.calculatedFormulas[field.name] = [{
                            index: index,
                            type: selectedString,
                            formula: type,
                        }];
                    } else {
                        (<Object[]>this.calculatedFormulas[field.name]).push({
                            index: index,
                            type: selectedString,
                            formula: type,
                        });
                    }
                }
            }
        }
        this.fields = keys;
    }
    private validateFilters(data: IDataOptions): void {
        this.isValueFiltersAvail = false;
        let filterElements: IFilter[] = data.filterSettings ? data.filterSettings : [];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        for (let filter of filterElements) {
            for (let field of dataFields) {
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
    private fillFieldMembers(data: IDataSet[], indMat: IMatrix2D): void {
        let keys: string[] = this.fields;
        let dlen: number = data.length as number;
        let fList: IFieldListOptions = this.fieldList;
        let kLn: number = keys.length;
        for (let kl: number = 0; kl < kLn; kl++) {
            let key: string = keys[kl];
            if (!fList[key].members) {
                fList[key].members = {};
            }
            if (!fList[key].formattedMembers) {
                fList[key].formattedMembers = {};
            }
            if (!fList[key].dateMember) {
                fList[key].dateMember = [];
            }
            let members: IMembers = fList[key].members;
            let isDataAvail: boolean = Object.keys(members).length > 0 ? true : false;
            let formattedMembers: IMembers = fList[key].formattedMembers;
            let dateMember: IAxisSet[] = fList[key].dateMember;
            let membersCnt: number = 0;
            let fmembersCnt: number = 0;
            //let sort: string[] = [];
            for (let dl: number = 0; dl < dlen; dl++) {
                let mkey: string = data[dl][key] as string;
                // if (!isNullOrUndefined(mkey)) {
                if (!isDataAvail) {
                    let fKey: string = mkey;
                    let formattedValue: IAxisSet = (this.pageSettings && !(this.formatFields[key] &&
                        (['date', 'dateTime', 'time'].indexOf(this.formatFields[key].type) > -1))) ? ({
                            formattedText: mkey === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(mkey)) :
                                mkey === undefined ? (this.localeObj ? (key in this.groupingFields) ?
                                    this.localeObj.getConstant('groupOutOfRange') : this.localeObj.getConstant('undefined') :
                                    String(mkey)) : mkey.toString(), actualText: mkey === null ? (this.localeObj ?
                                        this.localeObj.getConstant('null') : String(mkey)) : mkey === undefined ? (this.localeObj ?
                                            (key in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                                                this.localeObj.getConstant('undefined') : String(mkey)) : mkey
                        }) : this.getFormattedValue(mkey, key);
                    if (formattedValue.formattedText) {
                        fKey = formattedValue.formattedText;
                    }
                    if (!members.hasOwnProperty(mkey)) {
                        membersCnt++;
                        members[mkey] = {
                            index: [dl], ordinal: membersCnt,
                            isDrilled: this.isExpandAll ? true : false
                        };
                        /* tslint:disable-next-line:max-line-length */
                        dateMember.push({ formattedText: formattedValue.formattedText, actualText: (formattedValue.dateText ? formattedValue.dateText : formattedValue.actualText) });
                        //sort.push(mkey);
                    } else {
                        members[mkey].index.push(dl);
                    }
                    if (!formattedMembers.hasOwnProperty(fKey)) {
                        fmembersCnt++;
                        formattedMembers[fKey] = {
                            index: [dl], ordinal: fmembersCnt,
                            isDrilled: this.isExpandAll ? true : false
                        };
                    } else {
                        formattedMembers[fKey].index.push(dl);
                    }
                }
                if (!(indMat[dl])) {
                    indMat[dl] = [];
                    indMat[dl][kl] = members[mkey].ordinal;
                } else {
                    indMat[dl][kl] = members[mkey].ordinal;
                }
                // }
            }
            /*sort = Object.keys(members).sort();
            let sortedMembers: Members = {};
            for (let sln: number = 0, slt: number = sort.length; sln < slt; sln++) {
                sortedMembers[sort[sln]] = members[sort[sln]];
            }
            fList[key].members = sortedMembers; */
        }
    }
    private generateValueMatrix(data: IDataSet[]): IMatrix2D {
        let keys: string[] = this.fields;
        let len: number = data.length;
        let vMat: IMatrix2D = [];
        let keyLen: number = keys.length;
        let flList: IFieldListOptions = this.fieldList;
        while (len--) {
            let record: Object = data[len];
            let tkln: number = keyLen;
            //if (isNullOrUndefined(vMat[len])) {
            vMat[len] = [];
            //}
            while (tkln--) {
                let key: string = keys[tkln];
                vMat[len][tkln] = (flList[key].type === 'number') ? data[len][key] as number : 1;
            }
        }
        return vMat;
    }
    private updateSortSettings(sortSettings: ISort[], isSort: boolean): void {
        for (let sln: number = 0, slt: number = sortSettings ? sortSettings.length : 0; sln < slt && isSort; sln++) {
            if (this.fieldList[sortSettings[sln].name]) {
                this.fieldList[sortSettings[sln].name].sort = sortSettings[sln].order;
            }
        }
    }
    private updateFilterMembers(source: IDataOptions): void {
        let filterRw: number[] = this.filterMembers;
        let list: IIterator = {};
        //let eList: {[key: string] : number} = {};
        let isInclude: boolean = this.getFilters(source, list);
        //this.getFilterExcludeList(source.rows, flist);
        //this.getFilterExcludeList(source.columns, flist);
        //this.getFilterExcludeList(source.filters, flist);
        // let filters: Iterator = isInclude ? iList : eList;
        let dln: number = this.indexMatrix.length;
        if (isInclude) {
            let keys: number[] = list.include.index;
            for (let ln: number = 0; ln < keys.length; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[keys[ln]] === undefined) {
                    filterRw.push(keys[ln]);
                }
            }
        } else {
            for (let ln: number = 0; ln < dln; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[ln] === undefined) {
                    filterRw.push(ln);
                }
            }
        }
    }
    private getFilters(source: IDataOptions, ilist: IIterator): boolean {
        let filterElements: IFilter[] = source.filterSettings ? source.filterSettings : [];
        let filters: IFieldOptions[] = this.filters;
        let isInclude: boolean = false;
        let filter: string[] = [];
        //let type: string;
        for (let rln: number = 0, rlt: number = filterElements.length; rln < rlt; rln++) {
            let filterElement: IFilter = (<{ [key: string]: Object }>filterElements[rln]).properties ?
                (<{ [key: string]: Object }>filterElements[rln]).properties : filterElements[rln];
            if (this.fieldList[filterElement.name] &&
                this.fieldList[filterElement.name].isSelected && this.isValidFilterField(filterElement, source.allowLabelFilter)) {
                this.applyLabelFilter(filterElement);
                if (filterElement) {
                    filter = filterElement.items;
                }
                if (filterElement.type && filterElement.type === 'Include') {
                    /* tslint:disable-next-line:max-line-length */
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
             filter = cols[cln].filter ? cols[cln].filter.items : [];
             if (filter.length && cols[cln].filter.type && cols[cln].filter.type === 'include') {
                 //type = cols[cln].filter.type;
                 this.frameFilterList(filter, cols[cln].name, ilist, 'include', isInclude);
                 isInclude = true;
             } else {
                 this.frameFilterList(filter, cols[cln].name, ilist, 'exclude');
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
    private isValidFilterField(filterElement: IFilter, allowLabelFiltering: boolean): boolean {
        let isValidFilterElement: boolean = false;
        let filterTypes: FilterType[] = ['Include', 'Exclude'];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        if (this.fieldList[filterElement.name].isSelected && filterTypes.indexOf(filterElement.type) >= 0) {
            let isNotValidFilterElement: boolean = false;
            for (let field of this.values) {
                if (filterElement.name === field.name) {
                    isNotValidFilterElement = true;
                    break;
                }
            }
            if (!isNotValidFilterElement) {
                isValidFilterElement = true;
            }
        } else {
            for (let field of dataFields) {
                if (filterElement.name === field.name && allowLabelFiltering &&
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
            let members: string[] = Object.keys(this.fieldList[filterElement.name].members);
            filterElement.showLabelFilter = true;
            if (filterElement.type === 'Label') {
                /* tslint:disable-next-line:max-line-length */
                filterElement.items = this.getLabelFilterMembers(members, filterElement.condition as LabelOperators, filterElement.value1 as string, filterElement.value2 as string);
            } else if (filterElement.type === 'Date') {
                filterElement.showDateFilter = true;
                /* tslint:disable-next-line:max-line-length */
                filterElement.items = this.getDateFilterMembers(members, filterElement.name, filterElement.condition as DateOperators, filterElement.value1 as Date, filterElement.value2 as Date);
            } else {
                filterElement.showNumberFilter = true;
                filterElement.items = [];
                for (let member of members) {
                    let operand1: number = this.getParsedValue(filterElement.name, filterElement.value1 as string);
                    let operand2: number = this.getParsedValue(filterElement.name, filterElement.value2 as string);
                    let cValue: number = this.getParsedValue(filterElement.name, member as string);
                    /* tslint:disable-next-line:max-line-length */
                    if (this.validateFilterValue(cValue, filterElement.condition as ValueOperators, operand1, operand2)) {
                        filterElement.items.push(member as string);
                    }
                }
            }
            let excludeOperators: LabelOperators[] =
                ['DoesNotBeginWith', 'DoesNotContains', 'DoesNotEndsWith', 'DoesNotEquals', 'NotBetween'];
            filterElement.type = (excludeOperators.indexOf(filterElement.condition as LabelOperators) > -1 &&
                !filterElement.showNumberFilter) ? 'Exclude' : 'Include';
        } else {
            filterElement.showLabelFilter = false;
        }
    }
    private getLabelFilterMembers(members: string[], operator: LabelOperators, value1: string, value2?: string): string[] {
        let items: string[] = [];
        for (let member of members) {
            let filterValue: string = member.toLowerCase();
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
                }
            }
        }
        return items;
    }
    /* tslint:disable */
    private getDateFilterMembers(members: string[], name: string, operator: DateOperators, value1: Date, value2?: Date): string[] {
        let items: string[] = [];
        for (let member of members) {
            let filterValue: Date = new Date(member);
            if (value1) {
                switch (operator) {
                    case 'Equals':
                    case 'DoesNotEquals':
                        if (this.getFormattedValue(filterValue.toString(), name).formattedText === this.getFormattedValue(value1.toString(), name).formattedText) {
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
                }
            }
        }
        return items;
    }
    /* tslint:enable */
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
            }
        }
        return isMemberInclude;
    }
    /* tslint:disable-next-line:max-line-length */
    private frameFilterList(filter: string[], name: string, list: IIterator, type: string, isLabelFilter: boolean, isInclude?: boolean): void {
        if (!list[type]) {
            list[type] = { indexObject: {}, index: [] };
            this.updateFilter(filter, name, list, type, isLabelFilter, isInclude);
        } else {
            this.updateFilter(filter, name, list, type, isLabelFilter, isInclude);
        }
        // }
    }

    private updateFilter(filter: string[], name: string, list: IIterator, type: string, isLabelFilter: boolean, isInclude?: boolean): void {
        let fln: number = 0;
        let field: IField = this.fieldList[name];
        field.filter = filter;
        field.filterType = type;
        field.isExcelFilter = isLabelFilter;
        let members: IMembers = (this.formatFields[name] &&
            (['date', 'dateTime', 'time'].indexOf(this.formatFields[name].type) > -1)) ?
            field.formattedMembers : field.members;
        let allowFil: boolean = isInclude;
        let final: IIterator = {};
        let filterObj: IStringIndex = {};
        final[type] = { indexObject: {}, index: [] };
        this.fieldFilterMem[name] = { memberObj: {} };
        while (filter[fln]) {
            let indx: number[] = members[filter[fln]].index;
            if (type === 'include') {
                for (let iln: number = 0, ilt: number = indx.length; iln < ilt; iln++) {
                    if (!allowFil || list[type].indexObject[indx[iln]] !== undefined) {
                        final[type].indexObject[indx[iln]] = indx[iln];
                        final[type].index.push(indx[iln]);
                    }
                }
            } else {
                for (let iln: number = 0, ilt: number = indx.length; iln < ilt; iln++) {
                    if (list[type].indexObject[indx[iln]] === undefined) {
                        list[type].indexObject[indx[iln]] = indx[iln];
                        list[type].index.push(indx[iln]);
                    }
                }
                this.fieldFilterMem[name].memberObj[filter[fln]] = filter[fln];
            }
            fln++;
        }
        if (type === 'include') {
            list[type] = final[type];
            for (let iln: number = 0; iln < filter.length; iln++) {
                filterObj[filter[iln]] = filter[iln];
            }
            let items: string[] = Object.keys(members);
            for (let iln: number = 0, ilt: number = items.length; iln < ilt; iln++) {
                if (filterObj[items[iln]] === undefined) {
                    this.fieldFilterMem[name].memberObj[items[iln]] = items[iln];
                }
            }
        }
    }

    /* tslint:disable-next-line:max-line-length */
    private applyValueFiltering(rowData: IFieldOptions, level: number, rows: IAxisSet[], columns: IAxisSet, valueFilter: IValueFilterSettings, rowFilterData: IAxisSet[], type: string): IAxisSet[] {
        this.isValueFiltered = false;
        let allMember: IAxisSet = extend({}, rows[rows.length - 1], null, true);
        this.getFilteredData(rows, columns, valueFilter, rowFilterData, level, rowData.name, allMember, type);
        if (this.isValueFiltered) {
            rowFilterData.push(allMember);
            rows = rowFilterData;
        }
        return rows;
    }
    /* tslint:disable-next-line:max-line-length */
    private getFilteredData(rows: IAxisSet[], columns: IAxisSet, filterSettings: IValueFilterSettings, rowFilterData: IAxisSet[], level: number, fieldName: string, allMember: IAxisSet, type: string): void {
        let rLen: number = rows.length;
        for (let i: number = 0; i < rLen; i++) {
            if (filterSettings[fieldName]) {
                if (rows[i].level === level) {
                    this.isValueFiltered = true;
                    this.fieldList[fieldName].isExcelFilter = true;
                    let value: number = 0;
                    let measure: string = filterSettings[fieldName].measure;
                    let mPos: number = this.fieldList[measure].index;
                    let aggregate: string = this.fieldList[measure].aggregateType;
                    this.rawIndexObject = {};
                    value = (type === 'row' ? this.getAggregateValue(rows[i].index, columns.indexObject, mPos, aggregate) :
                        this.getAggregateValue(columns.index, rows[i].indexObject, mPos, aggregate));
                    let cellDetails: AggregateEventArgs = {
                        fieldName: measure,
                        row: rows[i],
                        column: columns,
                        value: value,
                        cellSets: this.getCellSet(this.rawIndexObject),
                        /* tslint:disable-next-line:max-line-length */
                        rowCellType: (rows[i].hasChild && rows[i].isDrilled ? 'subTotal' : rows[i].type === 'grand sum' ? 'grandTotal' : 'value'),
                        /* tslint:disable-next-line:max-line-length */
                        columnCellType: (columns.hasChild && columns.isDrilled ? 'subTotal' : columns.type === 'grand sum' ? 'grandTotal' : 'value'),
                        aggregateType: aggregate as SummaryTypes,
                        skipFormatting: false
                    };
                    if (this.getValueCellInfo) {
                        this.getValueCellInfo(cellDetails);
                    }
                    value = cellDetails.value;
                    this.rawIndexObject = {};
                    let operand1: number = this.getParsedValue(measure, filterSettings[fieldName].value1 as string);
                    let operand2: number = this.getParsedValue(measure, filterSettings[fieldName].value2 as string);
                    /* tslint:disable-next-line:max-line-length */
                    if (!this.validateFilterValue(value, filterSettings[fieldName].condition as ValueOperators, operand1, operand2) && rows[i].type !== 'grand sum') {
                        let data: IAxisSet = this.removefilteredData(rows[i], this.valueFilteredData);
                        let row: IAxisSet = data ? data : rows[i];
                        this.validateFilteredParentData(row, this.valueFilteredData, allMember, 0, level, type);
                    } else if (rows[i].type !== 'grand sum') {
                        rowFilterData.push(extend({}, rows[i], null, true));
                        rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    }
                } else if (rows[i].hasChild && rows[i].members.length > 0 && rows[i].type !== 'grand sum') {
                    rowFilterData.push(extend({}, rows[i], null, true));
                    rowFilterData[rowFilterData.length - 1].members = [];
                    rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    /* tslint:disable-next-line:max-line-length */
                    this.getFilteredData(rows[i].members, columns, filterSettings, rowFilterData[rowFilterData.length - 1].members, level, fieldName, allMember, type);
                }
            }
        }
    }
    private getParsedValue(measure: string, value: string): number {
        let cValue: string = value ? value.toString() : '';
        if (this.formatFields[measure] && value) {
            let formatSetting: IFormatSettings = extend({}, this.formatFields[measure], null, true) as IFormatSettings;
            delete formatSetting.name;
            return this.globalize.parseNumber(cValue, formatSetting);
        } else {
            return this.globalize.parseNumber(cValue, { format: 'N' });
        }
    }
    private removefilteredData(row: IAxisSet, rowFilterData: IAxisSet[]): IAxisSet {
        let rows: IAxisSet[] = extend([], rowFilterData, null, true) as IAxisSet[];
        let filteredData: IAxisSet;
        for (let i: number = 0; i < rows.length; i++) {
            if (row.isLevelFiltered && row.axis === rows[i].axis &&
                row.valueSort.levelName === rows[i].valueSort.levelName &&
                row.actualText === rows[i].actualText && row.axis === rows[i].axis &&
                row.level === rows[i].level && row.ordinal === rows[i].ordinal) {
                filteredData = rows[i];
                rowFilterData.splice(i, 1);
                break;
            } else if (rowFilterData[i].hasChild && rowFilterData[i].members.length > 0) {
                this.removefilteredData(row, rowFilterData[i].members);
            }
        }
        return filteredData;
    }
    /* tslint:disable-next-line:max-line-length */
    private validateFilteredParentData(row: IAxisSet, rows: IAxisSet[], allMemberData: IAxisSet, i: number, level: number, type: string): void {
        if (rows.length > 0) {
            for (let rowFilteredData of rows) {
                if (rowFilteredData.level === i) {
                    if (type === 'row') {
                        let index: number[] = row.index;
                        for (let key of index) {
                            if (allMemberData.index.indexOf(key) >= 0) {
                                allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                            }
                            if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                rowFilteredData.level !== level && rowFilteredData.index.indexOf(key) >= 0) {
                                rowFilteredData.index.splice(rowFilteredData.index.indexOf(key), 1);
                            }
                        }
                    } else {
                        let index: INumberIndex = row.indexObject;
                        for (let key of Object.keys(index)) {
                            if (index.hasOwnProperty(key)) {
                                delete (<{ [key: string]: Object }>allMemberData.indexObject)[key];
                                if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                    rowFilteredData.level !== level) {
                                    delete (<{ [key: string]: Object }>rowFilteredData.indexObject)[key];
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
                let index: number[] = row.index;
                for (let key of index) {
                    if (allMemberData.index.indexOf(key) >= 0) {
                        allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                    }
                }
            } else {
                let index: INumberIndex = row.indexObject;
                for (let key of Object.keys(index)) {
                    if (index.hasOwnProperty(key)) {
                        delete (<{ [key: string]: Object }>allMemberData.indexObject)[key];
                    }
                }
            }
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private updateFramedHeaders(framedHeaders: IAxisSet[], dataHeaders: IAxisSet[], filteredHeaders: IAxisSet[], headers: IAxisSet[], type: string): IAxisSet[] {
        for (let dHeader of framedHeaders) {
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
        for (let vHeader of filteredHeaders) {
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
    }
    /** @hidden */
    public updateGridData(dataSource: IDataOptions): void {
        this.indexMatrix = [];
        for (let field of this.fields) {
            this.fieldList[field].members = {};
            this.fieldList[field].formattedMembers = {};
            this.fieldList[field].dateMember = [];
        }
        this.fillFieldMembers(dataSource.data as IDataSet[], this.indexMatrix);
        this.valueMatrix = this.generateValueMatrix(dataSource.data as IDataSet[]);
        this.filterMembers = [];
        this.cMembers = [];
        this.rMembers = [];
        this.updateFilterMembers(dataSource);
        this.isEditing = true;
        this.isDrillThrough = true;
        this.generateGridData(dataSource);
        this.isEditing = false;
    }
    /* tslint:disable */
    public generateGridData(dataSource: IDataOptions, headerCollection?: HeaderCollection): void {
        let keys: string[] = this.fields;
        let columns: IFieldOptions[] = dataSource.columns ? dataSource.columns : [];
        let data: IDataSet[] = dataSource.data as IDataSet[];
        let rows: IFieldOptions[] = dataSource.rows ? dataSource.rows : [];
        let filterSettings: IFilter[] = dataSource.filterSettings;
        let values: IFieldOptions[] = dataSource.values ? dataSource.values : [];
        let size: number = 1;
        this.removeCount = 0;
        this.isExpandAll = dataSource.expandAll;
        this.drilledMembers = dataSource.drilledMembers ? dataSource.drilledMembers : [];
        this.isEmptyData = false;
        let filterMembers: number[] = [];
        let showNoDataItems: boolean = (rows[0] && rows[0].showNoDataItems) || (columns[0] && columns[0].showNoDataItems);
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        if (showNoDataItems) {
            for (let ln: number = 0; ln < this.indexMatrix.length; ln++) {
                filterMembers.push(ln);
            }
        }
        for (let ln: number = 0; ln < this.filterMembers.length; ln++) {
            this.filterPosObj[this.filterMembers[ln]] = this.filterMembers[ln];
        }
        //let childrens: Field = this.fieldList[rows[0].name + ''];
        this.valueSortSettings.columnIndex = undefined;
        let st1: number = new Date().getTime();
        if (!this.isValueFilterEnabled || this.isEditing) {
            if (!headerCollection) {
                this.columnCount = 0; this.rowCount = 0; this.cMembers = []; this.rMembers = [];
                if (rows.length !== 0) {
                    this.rMembers =
                        this.getIndexedHeaders(rows, data, 0, rows[0].showNoDataItems ? filterMembers : this.filterMembers, 'row', '', this.allowValueFilter);
                }
                if (columns.length !== 0) {
                    this.cMembers = this.getIndexedHeaders(columns, data, 0, columns[0].showNoDataItems ?
                        filterMembers : this.filterMembers, 'column', '', this.allowValueFilter);
                }
                this.insertAllMembersCommon();
                this.saveDataHeaders = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? {
                    rowHeaders: extend([], this.rMembers, null, true) as IAxisSet[],
                    columnHeaders: extend([], this.cMembers, null, true) as IAxisSet[]
                } : {};
            }
        }
        this.pivotValues = []; let gridData: IPivotValues = []; this.headerContent = [];
        this.valueContent = []; this.valueFilteredData = []; this.filterFramedHeaders = []; let rowheads: IAxisSet[] = [];
        let colheads: IAxisSet[] = []; let rowFilteredData: IAxisSet[] = []; let columnFilteredData: IAxisSet[] = [];
        let valuesCount: number = (this.values.length);
        if (this.isValueFiltersAvail && dataSource.allowValueFilter && !headerCollection) {
            this.valueFilteredData = [];
            let rowHeaders: IAxisSet[] = this.saveDataHeaders.rowHeaders;
            let columnHeaders: IAxisSet[] = this.saveDataHeaders.columnHeaders;
            if (filterSettings.length > 0) {
                let valueFilters: IValueFilterSettings = {};
                let valueFields: IValueFields = {};
                for (let value of values) { valueFields[value.name] = value; }
                for (let filter of filterSettings) {
                    rowHeaders = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
                    columnHeaders = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
                    this.valueFilteredData = [];
                    let filterElement: IFilter = (<{ [key: string]: Object }>filter).properties ?
                        (<{ [key: string]: Object }>filter).properties : filter;
                    if (filterElement.type === 'Value' && this.fieldList[filter.name].isSelected) {
                        valueFilters[filter.name] = filter;
                        filterElement.items = [];
                        let isAvail: boolean = false;
                        let rLen: number = rows.length;
                        let cLen: number = columns.length;
                        for (let i: number = 0; i < rLen; i++) {
                            if (filterElement.name === rows[i].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                /* tslint:disable-next-line:max-line-length */
                                rowFilteredData = this.applyValueFiltering(rows[i], i, rowHeaders, columnHeaders[columnHeaders.length - 1], valueFilters, this.valueFilteredData, 'row');
                                break;
                            }
                        }
                        for (let j: number = 0; j < cLen; j++) {
                            if (filterElement.name === columns[j].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                /* tslint:disable-next-line:max-line-length */
                                columnFilteredData = this.applyValueFiltering(columns[j], j, columnHeaders, rowHeaders[rowHeaders.length - 1], valueFilters, this.valueFilteredData, 'column');
                                break;
                            }
                        }
                    }
                }
            }
            rowFilteredData = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
            columnFilteredData = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
            this.isEmptyDataAvail(rowFilteredData, columnFilteredData);
            let savedFieldList: IFieldListOptions = extend({}, this.fieldList, null, true) as IFieldListOptions;
            this.indexMatrix = []; let fields: IDataSet = (dataSource.data as IDataSet[])[0];
            this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
            this.fillFieldMembers((dataSource.data as IDataSet[]), this.indexMatrix);
            this.updateSortSettings(dataSource.sortSettings, this.enableSort);
            this.valueMatrix = this.generateValueMatrix((dataSource.data as IDataSet[]));
            this.filterMembers = []; let pageSize: number = 1; this.updateFilterMembers(dataSource);
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
        if (this.pageSettings) {
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
        this.getAggregatedHeaders(rows, columns, this.rMembers, this.cMembers, values);
        this.getHeaderData(this.cMembers, colheads, this.pivotValues, 0, this.valueAxis ? 1 : valuesCount);
        if (this.removeCount !== 0 && this.values.length > 0) {
            this.columnCount = this.columnCount - (this.removeCount * (this.valueAxis === 0 ? this.values.length : 1));
        }
        if ((!this.showGrandTotals || !this.showColumnGrandTotals) && this.columns.length > 0) {
            this.columnCount = this.columnCount - (1 * (this.valueAxis === 0 ? this.values.length : 1));
        }
        this.insertSubTotals();
        //this.getHeaderData(rmembers, rowheads, gridData, 0);              
        /* tslint:disable-next-line:max-line-length */
        this.getTableData(this.rMembers, rowheads, colheads, 0, this.pivotValues, valuesCount, this.rMembers[this.rMembers.length - 1], this.cMembers[this.cMembers.length - 1]);
        this.applyAdvancedAggregate(rowheads, colheads, this.pivotValues);
        this.isEngineUpdated = true; let st2: number = new Date().getTime();
        //  console.log(st1 - st2);
    }
    /* tslint:enable */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:typedef */
    /** @hidden */
    public onDrill(drilledItem: IDrilledItem): void {
        let headersInfo: IHeadersInfo = this.getHeadersInfo(drilledItem.fieldName, drilledItem.axis);
        this.performDrillOperation(headersInfo.headers, drilledItem, headersInfo.fields, headersInfo.position, 0);
        this.headerCollection.rowHeadersCount = this.rowCount; this.headerCollection.columnHeadersCount = this.columnCount;
        if (headersInfo.axis === 'row') {
            this.headerCollection.rowHeaders = headersInfo.headers;
        } else {
            this.headerCollection.columnHeaders = headersInfo.headers;
        }
        this.updateEngine();
    }
    /** @hidden */
    public onSort(sortItem: ISort): void {
        let headersInfo: IHeadersInfo = this.getHeadersInfo(sortItem.name, '');
        this.fieldList[sortItem.name].sort = sortItem.order;
        this.performSortOperation(headersInfo.headers, sortItem, headersInfo, 0);
        this.updateEngine();
    }
    /** @hidden */
    public onFilter(filterItem: IFilter, dataSource: IDataOptions): void {
        let headersInfo: IHeadersInfo = this.getHeadersInfo(filterItem.name, '');
        if (filterItem.type === 'Include' && filterItem.items.length === this.fieldList[filterItem.name].dateMember.length) {
            this.fieldList[filterItem.name].filter = [];
            this.fieldList[filterItem.name].filterType = '';
        } else {
            this.fieldList[filterItem.name].filter = filterItem.items;
            this.fieldList[filterItem.name].filterType = filterItem.type;
        }
        let posObj: { [key: number]: number } = {};
        for (let pos of this.filterMembers) {
            posObj[pos] = pos;
        }
        this.filterMembers = [];
        this.fieldFilterMem = {};
        this.updateFilterMembers(dataSource);
        let addPos: number[] = this.filterMembers.filter((pos) => { return posObj[pos] === undefined; });
        let itemsObj: { [key: string]: string } = {};
        for (let item of filterItem.items) {
            itemsObj[item] = item;
        }
        let showNoDataItems: boolean = (this.rows[0] && this.rows[0].showNoDataItems) || (
            this.columns[0] && this.columns[0].showNoDataItems);
        if (showNoDataItems) {
            let filterMembers: number[] = [];
            this.filterPosObj = {};
            for (let ln: number = 0; ln < addPos.length; ln++) {
                this.filterPosObj[addPos[ln]] = addPos[ln];
            }
            for (let ln: number = 0; ln < this.indexMatrix.length; ln++) {
                filterMembers.push(ln);
            }
            addPos = filterMembers;
        }
        this.performFilterCommonUpdate(filterItem, headersInfo, addPos);
        this.frameHeaderObjectsCollection = false;
        this.headerObjectsCollection = {};
        this.updateEngine();
    }
    /** @hidden */
    public onAggregation(field: IFieldOptions): void {
        this.fieldList[field.name].aggregateType = field.type;
        this.rMembers = this.headerCollection.rowHeaders;
        this.cMembers = this.headerCollection.columnHeaders;
        this.updateEngine();
    }
    /** @hidden */
    public onCalcOperation(field: ICalculatedFields): void {
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
                    this.rowCount / (this.values.length - 1)) * this.values.length;
            } else {
                this.headerCollection.columnHeadersCount = this.columnCount = (
                    this.columnCount / (this.values.length - 1)) * this.values.length;
            }
        }
        this.updateEngine();
    }
    private performDrillOperation(
        headers: IAxisSet[], drilledItem: IDrilledItem, fields: IFieldOptions[], position: number, currentPosition: number): IAxisSet[] {
        let count: number = 0;
        while (count < headers.length) {
            if (position === currentPosition) {
                if (drilledItem.memberName === (headers[count].valueSort.levelName as string).split(this.valueSortSettings.headerDelimiter)
                    .join(drilledItem.delimiter ? drilledItem.delimiter : '**')) {
                    if (drilledItem.action === 'down') {
                        headers[count].isDrilled = true;
                        headers[count].members = this.getIndexedHeaders(
                            fields, this.data, position + 1, headers[count].index, drilledItem.axis, drilledItem.memberName);
                        let sortedHeaders: ISortedHeaders;
                        if (drilledItem.axis === 'row') {
                            sortedHeaders = this.applyValueSorting(headers[count].members, this.cMembers);
                            headers[count].members = sortedHeaders.rMembers;
                        } else {
                            sortedHeaders = this.applyValueSorting(this.rMembers, headers[count].members);
                            headers[count].members = sortedHeaders.cMembers;
                        }
                    } else {
                        headers[count].isDrilled = false;
                        this.updateHeadersCount(headers[count].members, drilledItem.axis, 'minus');
                        headers[count].members = [];
                    }
                    break;
                }
            } else if (headers[count].members.length > 0) {
                headers[count].members = this.performDrillOperation(
                    headers[count].members, drilledItem, fields, position, currentPosition + 1);
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
            } else if (headers[count].members.length > 0) {
                headers[count].members = this.performSortOperation(
                    headers[count].members, sortItem, headersInfo, currentPosition + 1);
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
                let engine: PivotEngine = this;
                headers = headers.filter((item) => {
                    return !engine.fieldFilterMem[filterItem.name].memberObj[item.formattedText] || item.type === 'grand sum';
                });
                loopIn = false;
            } else if (headers[count].members.length > 0) {
                headers[count].members = this.performFilterDeletion(
                    headers[count].members, filterItem, headersInfo, filterObjects, currentPosition + 1);
            }
            count++;
        }
        let engine: PivotEngine = this;
        return headers.filter((item) => {
            return item.isDrilled ? item.members.length > 0 : engine.matchIndexes(item.indexObject, filterObjects);
        });
    }
    private matchIndexes(index: INumberIndex, filterObjects: INumberIndex): boolean {
        let keys: string[] = Object.keys(index);
        let len: number = keys.length;
        if (len === 0) {
            return true;
        }
        while (len > -1) {
            if (filterObjects[index[keys[len]]] !== undefined) {
                return true;
            }
            len--;
        }
        return false;
    }
    private performFilterAddition(headers: IAxisSet[], fields: IFieldOptions[], headersInfo: IHeadersInfo): IAxisSet[] {
        let count: number = 0;
        while (count < headers.length) {
            let levelName: string = headers[count].valueSort.levelName as string;
            if (this.headerObjectsCollection[levelName]) {
                let memberNameObj: { [key: string]: string } = {};
                for (let member of headers[count].members) {
                    memberNameObj[member.valueSort.levelName.toString()] = member.valueSort.levelName.toString();
                }
                let excessHeaders: IAxisSet[] = this.headerObjectsCollection[levelName].filter((member) => {
                    return !memberNameObj[member.valueSort.levelName.toString()];
                });
                headers[count].members = headers[count].members.concat(excessHeaders);
                headers[count].members = this.getSortedHeaders(
                    headers[count].members, this.fieldList[headersInfo.fields[headers[count].members[0].level].name].sort);
                delete this.headerObjectsCollection[levelName];
            }
            if (headers[count].members.length > 0) {
                headers[count].members = this.performFilterAddition(headers[count].members, fields, headersInfo);
            }
            count++;
        }
        return headers;
    }
    private performFilterCommonUpdate(filterItem: IFilter, headersInfo: IHeadersInfo, addPos: number[]): void {
        let rawHeaders: IAxisSet[] = headersInfo.axis === 'row' ? this.rMembers : this.cMembers;
        if (headersInfo.axis === 'row') {
            this.rowCount = 0;
        } else {
            this.columnCount = 0;
        }
        let filterObjects: INumberIndex = {};
        for (let item of this.filterMembers) {
            filterObjects[item] = item;
        }
        if (this.fieldFilterMem[filterItem.name]) {
            rawHeaders = this.performFilterDeletion(headersInfo.headers, filterItem, headersInfo, filterObjects, 0);
        }
        if (addPos.length > 0) {
            this.frameHeaderObjectsCollection = true;
            if (headersInfo.fields.filter((item) => { return item.showNoDataItems; }).length > 0) {
                addPos = this.data.map((item, pos) => { return pos; });
            }
            this.headerObjectsCollection['parent'] = this.getIndexedHeaders(headersInfo.fields, this.data, 0, addPos, headersInfo.axis, '');
            rawHeaders = this.performFilterAddition(rawHeaders, headersInfo.fields, headersInfo);
            let headerNames: IStringIndex = {};
            for (let header of rawHeaders) {
                headerNames[header.valueSort.levelName.toString()] = header.valueSort.levelName.toString();
            }
            let excessHeaders: IAxisSet[] = this.headerObjectsCollection['parent'].filter((header) => {
                return !headerNames[header.valueSort.levelName.toString()];
            });
            let grandHeader: IAxisSet[] = rawHeaders.filter((item) => { return item.type === 'grand sum'; });
            rawHeaders.pop();
            rawHeaders = this.getSortedHeaders(
                rawHeaders.concat(excessHeaders), this.fieldList[headersInfo.fields[0].name].sort).concat(grandHeader);
        }
        this.updateHeadersCount(rawHeaders, headersInfo.axis, 'plus');
        if (headersInfo.axis === 'row') {
            if (headersInfo.position > 0) {
                this.insertPosition(this.rows, this.data, 0, this.filterMembers, 'row', '', rawHeaders);
            }
            this.insertTotalPosition(rawHeaders);
            this.rMembers = this.headerCollection.rowHeaders = rawHeaders;
            this.headerCollection.rowHeadersCount = this.rowCount;
        } else {
            if (headersInfo.position > 0) {
                this.insertPosition(this.columns, this.data, 0, this.filterMembers, 'column', '', rawHeaders);
            }
            this.insertTotalPosition(rawHeaders);
            this.cMembers = this.headerCollection.columnHeaders = rawHeaders;
            this.headerCollection.columnHeadersCount = this.columnCount;
        }
        this.applyValueSorting();
    }
    private getHeadersInfo(fieldName: string, axis: string): IHeadersInfo {
        this.rMembers = this.headerCollection.rowHeaders; this.cMembers = this.headerCollection.columnHeaders;
        axis = axis === '' ? this.getAxisByFieldName(fieldName) : axis;
        let headers: IAxisSet[] = axis === 'row' ? this.rMembers : this.cMembers;
        let fields: IFieldOptions[] = axis === 'row' ? this.rows : this.columns;
        let position: number = 0;
        for (let field of fields) {
            if (field.name === fieldName) {
                break;
            }
            position++;
        }
        return { axis: axis, fields: fields, headers: headers, position: position };
    }
    /** @hidden */
    public updateEngine(): void {
        this.removeCount = 0;
        this.calculatePagingValues();
        this.pivotValues = []; this.headerContent = []; this.valueContent = [];
        let rowheads: IAxisSet[] = []; let colheads: IAxisSet[] = [];
        let valuesCount: number = (this.values.length);
        this.getAggregatedHeaders(this.rows, this.columns, this.rMembers, this.cMembers, this.values);
        this.getHeaderData(this.cMembers, colheads, this.pivotValues, 0, this.valueAxis ? 1 : valuesCount);
        this.insertSubTotals();
        this.getTableData(
            this.rMembers, rowheads, colheads, 0, this.pivotValues,
            valuesCount, this.rMembers[this.rMembers.length - 1], this.cMembers[this.cMembers.length - 1]);
        this.applyAdvancedAggregate(rowheads, colheads, this.pivotValues);
        this.isEngineUpdated = true;
    }
    private getAxisByFieldName(fieldName: string): string {
        let axisCount: number = 0;
        let axis: string = '';
        while (axisCount < 4 && axis === '') {
            switch (axisCount) {
                case 0:
                    axis = this.getFieldByName(fieldName, this.rows) ? 'row' : '';
                    break;
                case 1:
                    axis = this.getFieldByName(fieldName, this.columns) ? 'column' : '';
                    break;
            }
            axisCount++;
        }
        return axis;
    }
    private getFieldByName(fieldName: string, fields: IFieldOptions[]): IFieldOptions {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0] as IFieldOptions;
    }
    /* tslint:disable:no-any */
    private updateHeadersCount(headers: IAxisSet[], axis: string, action: string): void {
        let lenCnt: number = 0;
        while (lenCnt < headers.length) {
            if (axis === 'row') {
                this.rowCount = this.rowCount - (
                    action === 'plus' ? -(this.valueAxis === 1 ? this.values.length : 1) :
                        (this.valueAxis === 1 ? this.values.length : 1));
            } else {
                this.columnCount = this.columnCount - (
                    action === 'plus' ? -(this.valueAxis === 1 ? 1 : this.values.length) :
                        (this.valueAxis === 1 ? 1 : this.values.length));
            }
            if (headers[lenCnt].members.length > 0) {
                this.updateHeadersCount(headers[lenCnt].members, axis, action);
            }
            lenCnt++;
        }
    }
    private frameHeaderWithKeys(header: any): IAxisSet {
        let keys: string[] = Object.keys(header);
        let keyPos: number = 0;
        let framedHeader: any = {};
        while (keyPos < keys.length) {
            framedHeader[keys[keyPos]] = header[keys[keyPos]];
            keyPos++;
        }
        return framedHeader;
    }
    private getSortedHeaders(headers: IAxisSet[], sortOrder: string): IAxisSet[] {
        return this.enableSort ? (sortOrder === 'Ascending' ?
            (headers.sort((a, b) => (a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0))) :
            (sortOrder === 'Descending' ?
                (headers.sort((a, b) => (a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0))) : headers)) :
            headers;
    }
    /** @hidden */
    public applyValueSorting(rMembers?: IAxisSet[], cMembers?: IAxisSet[]): ISortedHeaders {
        let isNullArgument: boolean = false;
        if (rMembers === undefined || cMembers === undefined) {
            rMembers = this.rMembers;
            cMembers = this.cMembers;
            isNullArgument = true;
        }
        if (this.enableValueSorting && this.valueSortSettings.headerText &&
            this.valueSortSettings.headerText !== '' && this.values.length > 0) {
            let textArray: string[] = this.valueSortSettings.headerText.split(this.valueSortSettings.headerDelimiter);
            let hText: string = '';
            let mIndex: number;
            let mType: string;
            let caption: string;
            for (let i: number = 0; i < this.values.length; i++) {
                if (this.values[i].caption === textArray[textArray.length - 1]) {
                    caption = this.values[i].name;
                    break;
                } else {
                    caption = textArray[textArray.length - 1];
                }
            }
            if (((this.values.length === 1 && this.columns.length === 0) || this.values.length > 1) && caption && this.fieldList[caption]) {
                for (let i: number = 0; i < textArray.length - 1; i++) {
                    hText = hText === '' ? textArray[i] : (hText + this.valueSortSettings.headerDelimiter + textArray[i]);
                }
                mIndex = this.fieldList[caption].index;
                mType = this.fieldList[caption].aggregateType;
            } else {
                if (!this.alwaysShowValueHeader || textArray.length === 1) {
                    hText = this.valueSortSettings.headerText;
                } else {
                    for (let i: number = 0; i < textArray.length - 1; i++) {
                        hText = hText === '' ? textArray[i] : (hText + this.valueSortSettings.headerDelimiter + textArray[i]);
                    }
                }
                mIndex = this.fieldList[this.values[0].name].index;
                mType = this.fieldList[this.values[0].name].aggregateType;
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
                if (this.pageSettings) {
                    this.headerCollection.rowHeaders = this.rMembers;
                    this.headerCollection.columnHeaders = this.cMembers;
                }
            }
        }
        return { rMembers: rMembers, cMembers: cMembers };
    }
    private getMember(cMembers: IAxisSet[], headerText: string): IAxisSet {
        let vlen: number = cMembers.length;
        let member: IAxisSet;
        for (let j: number = 0; j < vlen; j++) {
            if (cMembers[j].valueSort.levelName === headerText) {
                member = cMembers[j];
                break;
            } else if (cMembers[j].members.length > 0) {
                member = this.getMember(cMembers[j].members, headerText);
            }
            if (member) {
                return member;
            }
        }
        return member;
    }
    private sortByValueRow(rMembers: IAxisSet[], member: IAxisSet, sortOrder: Sorting, mIndex: number, mType: string): IAxisSet[] {
        let aggreColl: { 'header': IAxisSet, 'value'?: number }[] = [];
        for (let header of rMembers) {
            if (header.type === 'grand sum') {
                aggreColl.push({ 'header': header });
            } else {
                this.rawIndexObject = {};
                let value: number = this.getAggregateValue(header.index, member.indexObject, mIndex, mType);
                let cellDetails: AggregateEventArgs = {
                    fieldName: this.fields[mIndex],
                    row: header,
                    column: member,
                    value: value,
                    cellSets: this.getCellSet(this.rawIndexObject),
                    /* tslint:disable-next-line:max-line-length */
                    rowCellType: (header.hasChild && header.isDrilled ? 'subTotal' : header.type === 'grand sum' ? 'grandTotal' : 'value'),
                    /* tslint:disable-next-line:max-line-length */
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
        aggreColl.sort((a, b) => { return sortOrder === 'Descending' ? (b['value'] - a['value']) : (a['value'] - b['value']); });
        rMembers = aggreColl.map((item) => { return item['header']; });
        for (let header of rMembers) {
            if (header.members.length > 0) {
                header.members = this.sortByValueRow(header.members, member, sortOrder, mIndex, mType);
            }
        }
        return rMembers;
    }
    private insertAllMembersCommon(): void {
        /* inserting the row grant-total members */
        let rowFlag: boolean = (this.showGrandTotals && this.showRowGrandTotals) ? true : (this.rows.length > 0) ? false : true;
        if (rowFlag) {
            this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
        }
        /* inserting the column gran-total members */
        let columnFlag: boolean = (this.showGrandTotals && this.showColumnGrandTotals) ? true : (this.columns.length > 0) ? false : true;
        if (columnFlag) {
            this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
        }
    }
    private insertSubTotals(): void {
        let rowLength: number = this.pivotValues.length;
        for (let rowCnt: number = 0; rowCnt < rowLength; rowCnt++) {
            let rowCells: IAxisSet[] = this.pivotValues[rowCnt] as IAxisSet[];
            if (rowCells) {
                let savedCell: IAxisSet;
                let spanCnt: number = 1;
                let colLength: number = rowCells.length;
                let indexObj: { index: number[], indexObject: {} };
                for (let colCnt: number = colLength - 1; colCnt > 0; colCnt--) {
                    let cell: IAxisSet = rowCells[colCnt] as IAxisSet;
                    if (cell) {
                        // if (cell.rowSpan > 1) {
                        //     cell.rowSpan = 1;
                        // }
                        if (savedCell) {
                            savedCell.colSpan = spanCnt;
                            savedCell.colIndex = savedCell.colIndex - (spanCnt - 1);
                        }
                        indexObj = { index: cell.index, indexObject: cell.indexObject };
                        cell.index = [];
                        cell.indexObject = {};
                        savedCell = extend({}, cell, null, true);
                        cell.index = indexObj.index;
                        cell.indexObject = indexObj.indexObject;
                        let rowPos: number = rowCnt + 1;
                        while (this.pivotValues[rowPos] && !this.pivotValues[rowPos][colCnt]) {
                            if (!(this.pivotValues[rowCnt][colCnt] as IAxisSet).isDrilled) {
                                (this.pivotValues[rowCnt][colCnt] as IAxisSet).rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            }
                            let cellType: string = (cell.type === 'sum' || cell.type === 'grand sum') ? cell.type : 'sum';
                            this.pivotValues[rowPos][colCnt] = this.headerContent[rowPos][colCnt] = {
                                type: cellType, formattedText:
                                    ((cell.type === 'sum' || cell.type === 'grand sum') ? cell.formattedText :
                                        (cell.formattedText + ' Total')),
                                axis: 'column', level: -1, colIndex: colCnt, rowIndex: rowPos, valueSort: cell.valueSort
                            };
                            if (cell.valueSort && cell.valueSort[this.valueSortSettings.headerText]) {
                                this.valueSortSettings.columnIndex = colCnt;
                            }
                            let isSpanned: boolean = false;
                            if (cellType === 'grand sum') {
                                (this.pivotValues[rowCnt][colCnt] as IAxisSet).rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            } else if ((this.pivotValues[rowCnt][colCnt] as IAxisSet).type !== 'sum' &&
                                (this.pivotValues[rowCnt][colCnt] as IAxisSet).isDrilled) {
                                (this.pivotValues[rowCnt + 1][colCnt] as IAxisSet).rowSpan = rowPos - rowCnt;
                                isSpanned = true;
                            } else {
                                (this.pivotValues[rowPos][colCnt] as IAxisSet).rowSpan = -1;
                            }
                            if (rowPos > (rowCnt + 1) && ((this.pivotValues[rowCnt][colCnt] as IAxisSet).type === 'sum' ||
                                isSpanned)) {
                                (this.pivotValues[rowPos][colCnt] as IAxisSet).rowSpan = -1;
                            }
                            rowPos++;
                        }
                        spanCnt = 1;
                    } else {
                        rowCells[colCnt] = this.headerContent[rowCnt][colCnt] = extend({}, savedCell, null, true);
                        rowCells[colCnt].index = this.headerContent[rowCnt][colCnt].index = indexObj.index;
                        rowCells[colCnt].indexObject = this.headerContent[rowCnt][colCnt].indexObject = indexObj.indexObject;
                        spanCnt++;
                        rowCells[colCnt].colSpan = spanCnt;
                        rowCells[colCnt].colIndex = rowCells[colCnt].colIndex - (spanCnt - 1);
                    }
                    if (colCnt === 1 && savedCell) {
                        savedCell.colSpan = spanCnt;
                        savedCell.colIndex = savedCell.colIndex - (spanCnt - 1);
                    }
                }
            }
        }
    }
    private checkDrill(member: IAxisSet): boolean {
        let flag: boolean = false;
        for (let key: number = 0; key < this.drilledMembers.length && !flag; key++) {
            for (let mem: number = 0; this.drilledMembers[key].items && mem < this.drilledMembers[key].items.length && !flag; mem++) {
                let memberName: string = this.drilledMembers[key].items[mem];
                if ((member.valueSort.levelName as string).split(this.valueSortSettings.headerDelimiter)
                    .join(this.drilledMembers[key].delimiter ? this.drilledMembers[key].delimiter : '**') === memberName) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
    /* tslint:disable:max-func-body-length */
    private getIndexedHeaders(
        keys: IFieldOptions[], data: IDataSet[], keyInd?: number, position?: number[], axis?: string,
        parentMember?: string, valueFil?: boolean
    ): IAxisSet[] {
        let hierarchy: IAxisSet[] = [];
        if (keys) {
            let rlen: number = keys.length;
            let decisionObj: IIterator = {};
            let fieldName: string = keys[keyInd].name;
            let field: IFieldOptions = keys[keyInd];
            // let members: string[] = Object.keys(this.fieldList[field].members);
            let childrens: IField = this.fieldList[fieldName];
            let isNoData: boolean = false;
            let isDateType: boolean = (this.formatFields[fieldName] &&
                (['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName].type) > -1));
            let showNoDataItems: boolean = (position.length < 1 && keyInd > 0) || field.showNoDataItems;
            let savedMembers: IStringIndex = {};
            if (showNoDataItems) {
                let members: string[] = Object.keys(childrens.members);
                for (let pos: number = 0, lt: number = members.length; pos < lt; pos++) {
                    savedMembers[members[pos]] = members[pos];
                }
                if (position.length < 1) {
                    isNoData = true;
                    position.length = members.length;
                }
            }
            for (let pos: number = 0, lt: number = position.length; pos < lt; pos++) {
                let member: IAxisSet = {};
                if (!isNullOrUndefined(keys[keyInd].showSubTotals) && !keys[keyInd].showSubTotals) {
                    member.showSubTotals = false;
                }
                member.hasChild = keyInd < rlen - 1;
                member.level = keyInd;
                member.axis = axis;
                member.colSpan = 1;
                let memInd: number = isNoData ? childrens.members[Object.keys(savedMembers)[0]].ordinal :
                    this.indexMatrix[position[pos]][childrens.index];
                let headerValue: string = isNoData ? Object.keys(savedMembers)[0] :
                    data[position[pos]][fieldName] as string;
                // if (isNullOrUndefined(headerValue)) {
                //     continue;
                // }
                delete savedMembers[headerValue];
                if (showNoDataItems && this.fieldFilterMem[fieldName] &&
                    this.fieldFilterMem[fieldName].memberObj[headerValue] === headerValue) {
                    continue;
                }
                let formattedValue: IAxisSet = isDateType ? this.getFormattedValue(headerValue, fieldName) :
                    {
                        formattedText: headerValue === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(headerValue)) :
                            headerValue === undefined ? (this.localeObj ? (fieldName in this.groupingFields) ?
                                this.localeObj.getConstant('groupOutOfRange') : this.localeObj.getConstant('undefined') :
                                String(headerValue)) : String(headerValue), actualText: headerValue === null ? (this.localeObj ?
                                    this.localeObj.getConstant('null') : String(headerValue)) : headerValue === undefined ?
                                        (this.localeObj ? (fieldName in this.groupingFields) ?
                                            this.localeObj.getConstant('groupOutOfRange') : this.localeObj.getConstant('undefined') :
                                            String(headerValue)) : headerValue
                    };
                member.actualText = formattedValue.actualText;
                member.formattedText = formattedValue.formattedText;
                if (isDateType) {
                    member.dateText = formattedValue.dateText;
                }
                let availData: boolean = showNoDataItems ? (this.filterPosObj[position[pos]] !== undefined &&
                    !isNoData ? true : false) : true;
                //member.name = members[memInd];
                // member.type = member.hasChild ? 'All' : 'Single';
                let pindx: number[];
                if (!(decisionObj && decisionObj[memInd])) {
                    decisionObj[memInd] = { index: [], indexObject: {} };
                    member.index = decisionObj[memInd].index;
                    member.indexObject = decisionObj[memInd].indexObject;
                    if (availData) {
                        member.index = decisionObj[memInd].index = [position[pos]];
                        decisionObj[memInd].indexObject[position[pos]] = position[pos];
                        member.indexObject = decisionObj[memInd].indexObject;
                    }
                    member.ordinal = memInd;
                    member.valueSort = {};
                    member.valueSort.axis = fieldName;
                    if (keyInd !== 0) {
                        member.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter + member.formattedText;
                        member.valueSort[parentMember + this.valueSortSettings.headerDelimiter + member.formattedText] = 1;
                    } else {
                        member.valueSort[member.formattedText] = 1;
                        member.valueSort.levelName = member.formattedText;
                    }
                    member.isDrilled = (valueFil && this.isValueFiltersAvail) ? true : (member.hasChild && this.checkDrill(member)) ?
                        this.isExpandAll ? false : true : childrens.members[headerValue].isDrilled;
                    //if (!member.members) {
                    member.members = [];
                    //}
                    //let copyObj: AxisSet = Object.create(member);
                    hierarchy.push(member);
                } else if (availData) {
                    decisionObj[memInd].index.push(position[pos]);
                    decisionObj[memInd].indexObject[position[pos]] = position[pos];
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
                        this.rowCount += this.rowValuesLength;
                    } else {
                        this.columnCount += this.colValuesLength;
                    }
                }
                let level: string = null;
                if (hierarchy[iln].valueSort && hierarchy[iln].valueSort.levelName) {
                    level = hierarchy[iln].valueSort.levelName as string;
                }
                parentMember = (level || hierarchy[iln].formattedText) as string;
                if (rlen - 1 > keyInd && hierarchy[iln].isDrilled) {
                    let filterPosition: number[] = hierarchy[iln].index;
                    /* tslint:disable:align */
                    hierarchy[iln].members = this.getIndexedHeaders(keys, data, keyInd + 1,
                        (filterPosition === undefined ? [] : filterPosition), axis, parentMember);
                    /* tslint:enable:align */
                    if (this.frameHeaderObjectsCollection) {
                        this.headerObjectsCollection[parentMember] = hierarchy[iln].members;
                    }
                }
            }
            /* tslint:disable:typedef */
            if (this.enableSort) {
                // return new DataManager(hierarchy as JSON[]).executeLocal(new Query().sortBy('actualText', childrens.sort.toLowerCase()));
                if (isDateType) {
                    return childrens.sort === 'Ascending' ?
                        (hierarchy.sort((a, b) => (a.dateText > b.dateText) ? 1 : ((b.dateText > a.dateText) ? -1 : 0))) :
                        childrens.sort === 'Descending' ?
                            (hierarchy.sort((a, b) => (a.dateText < b.dateText) ? 1 : ((b.dateText < a.dateText) ? -1 : 0))) :
                            hierarchy;
                } else {
                    return childrens.sort === 'Ascending' ?
                        (hierarchy.sort((a, b) => (a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0))) :
                        childrens.sort === 'Descending' ?
                            (hierarchy.sort((a, b) => (a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0))) :
                            hierarchy;
                }
            } else {
                return hierarchy;
            }
            /* tslint:enable:typedef */
        } else {
            return hierarchy;
        }
    }
    private getOrderedIndex(headers: IAxisSet[]): { [key: number]: number } {
        let orderedIndex: { [key: number]: number } = {};
        for (let i: number = 0; i < headers.length; i++) {
            if (headers[i].type !== 'grand sum') {
                orderedIndex[headers[i].ordinal] = i;
            }
        }
        return orderedIndex;
    }
    private insertPosition(
        keys: IFieldOptions[], data: IDataSet[], keyInd?: number, position?: number[], axis?: string,
        parentMember?: string, slicedHeaders?: IAxisSet[]
    ): IAxisSet[] {
        let hierarchy: IAxisSet[] = [];
        let orderedIndex: { [key: number]: number } = this.getOrderedIndex(slicedHeaders);
        if (keys) {
            let decisionObj: IIterator = {};
            let field: string = keys[keyInd].name;
            let childrens: IField = this.fieldList[field];
            for (let pos: number = 0, lt: number = position.length; pos < lt; pos++) {
                let member: IAxisSet = {};
                let memInd: number = this.indexMatrix[position[pos]][childrens.index];
                let slicedHeader: IAxisSet = slicedHeaders[orderedIndex[memInd]];
                let formattedValue: IAxisSet = (this.formatFields[field] &&
                    (['date', 'dateTime', 'time'].indexOf(this.formatFields[field].type) > -1)) ?
                    this.getFormattedValue(data[position[pos]][field] as string, field) :
                    { formattedText: data[position[pos]][field].toString(), actualText: data[position[pos]][field].toString() };
                if (!(slicedHeader && slicedHeader.formattedText === formattedValue.formattedText)) {
                    continue;
                }
                if (!(decisionObj && decisionObj[memInd])) {
                    decisionObj[memInd] = { index: [], indexObject: {} };
                    slicedHeader.index = decisionObj[memInd].index = [position[pos]];
                    decisionObj[memInd].indexObject[position[pos]] = position[pos];
                    slicedHeader.indexObject = decisionObj[memInd].indexObject;
                    slicedHeader.valueSort = {};
                    slicedHeader.valueSort.axis = field;
                    if (keyInd !== 0) {
                        slicedHeader.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter +
                            slicedHeader.formattedText;
                        slicedHeader.valueSort[parentMember + this.valueSortSettings.headerDelimiter +
                            slicedHeader.formattedText] = 1;
                    } else {
                        slicedHeader.valueSort[slicedHeader.formattedText] = 1;
                        slicedHeader.valueSort.levelName = slicedHeader.formattedText;
                    }
                    member.members = [];
                    hierarchy.push(member);
                } else {
                    decisionObj[memInd].index.push(position[pos]);
                    decisionObj[memInd].indexObject[position[pos]] = position[pos];
                }
            }
            let diff: number = slicedHeaders.length - hierarchy.length;
            while (diff > 0) {
                hierarchy.push({ members: [] });
                diff--;
            }
            for (let iln: number = 0, ilt: number = hierarchy.length; iln < ilt; iln++) {
                if (slicedHeaders[iln].members.length > 0) {
                    let level: string = null;
                    if (slicedHeaders[iln].valueSort && slicedHeaders[iln].valueSort.levelName) {
                        level = slicedHeaders[iln].valueSort.levelName as string;
                    }
                    parentMember = (level || slicedHeaders[iln].formattedText) as string;
                    /* tslint:disable:align */
                    hierarchy[iln].members =
                        this.insertPosition(keys, data, keyInd + 1, slicedHeaders[iln].index, axis, parentMember,
                            slicedHeaders[iln].members);
                    /* tslint:enable:align */
                }
            }
            return hierarchy;
        } else {
            return hierarchy;
        }
    }
    private insertTotalPosition(headers: IAxisSet[]): IAxisSet[] {
        let summCell: IAxisSet = headers[headers.length - 1];
        if (summCell && summCell.type === 'grand sum') {
            summCell.index = this.filterMembers;
            /* tslint:disable:typedef */
            let lt: number;
            for (let ln: number = 0, lt = this.filterMembers.length; ln < lt; ln++) {
                summCell.indexObject[this.filterMembers[ln]] = this.filterMembers[ln];
            }
            /* tslint:enable:typedef */
        }
        return headers;
    }
    private calculatePagingValues(): void {
        if (this.pageSettings) {
            if (this.valueAxis === 1) {
                this.rowValuesLength = this.values.length;
            } else {
                this.colValuesLength = this.values.length;
            }
            this.memberCnt = -this.rowValuesLength;
            this.rowStartPos = ((this.pageSettings.rowCurrentPage * this.pageSettings.rowSize) -
                (this.pageSettings.rowSize)) * this.rowValuesLength;
            let exactStartPos: number = (this.rowStartPos + (this.pageSettings.rowSize * 3 * this.rowValuesLength)) > this.rowCount ?
                (this.rowCount - (this.pageSettings.rowSize * 3 * this.rowValuesLength)) : this.rowStartPos;
            if (exactStartPos < 0) {
                exactStartPos = this.rowStartPos = 0;
                this.pageSettings.rowCurrentPage = 1;
            }
            this.rowFirstLvl = (this.rowStartPos - exactStartPos) % this.pageSettings.rowSize;
            this.rowStartPos = exactStartPos;
            this.endPos = this.rowStartPos + (this.pageSettings.rowSize * 3 * this.rowValuesLength);
            this.endPos = this.endPos > this.rowCount ? this.rowCount : this.endPos;
            this.rMembers = this.performSlicing(this.rMembers, [], this.rowStartPos, 'row');
            this.memberCnt = -this.colValuesLength; this.pageInLimit = false; this.colHdrBufferCalculated = false;
            this.colStartPos = ((this.pageSettings.columnCurrentPage * this.pageSettings.columnSize) -
                (this.pageSettings.columnSize)) * this.colValuesLength;
            exactStartPos = (this.colStartPos + (this.pageSettings.columnSize * 3 * this.colValuesLength)) >
                this.columnCount ?
                (this.columnCount - (this.pageSettings.columnSize * 3 * this.colValuesLength)) : this.colStartPos;
            if (exactStartPos < 0) {
                exactStartPos = this.colStartPos = 0;
                this.pageSettings.columnCurrentPage = 1;
            }
            this.colFirstLvl = (this.colStartPos - exactStartPos) % this.pageSettings.columnSize;
            this.colStartPos = exactStartPos;
            this.endPos = this.colStartPos + (this.pageSettings.columnSize * 3 * this.colValuesLength);
            this.endPos = this.endPos > this.columnCount ? this.columnCount : this.endPos;
            this.cMembers = this.performSlicing(this.cMembers, [], this.colStartPos, 'column');
            this.memberCnt = -1; this.pageInLimit = false;
        }
    }
    private performSlicing(headers: IAxisSet[], slicedHeaders: IAxisSet[], startPos: number, axis: string): IAxisSet[] {
        let pos: number = 0;
        while (headers[pos]) {
            this.memberCnt += axis === 'column' ? this.colValuesLength : this.rowValuesLength;
            if (startPos <= this.memberCnt && this.endPos >= this.memberCnt && !this.pageInLimit) {
                if (axis === 'column') {
                    this.colFirstLvl = this.colFirstLvl + headers[pos].level;
                } else {
                    this.rowFirstLvl = this.rowFirstLvl + headers[pos].level;
                }
                this.pageInLimit = true;
            }
            if (this.pageInLimit) {
                if (this.endPos <= this.memberCnt) {
                    if (axis === 'column') {
                        if (headers[pos].members.length === 0) {
                            if (this.colHdrBufferCalculated) {
                                break;
                            }
                            this.colHdrBufferCalculated = true;
                            this.endPos += (headers[pos].level * this.colValuesLength);
                        } else if (this.colHdrBufferCalculated) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            slicedHeaders.push(headers[pos].members.length > 0 ? this.removeChildMembers(headers[pos]) : headers[pos]);
            if (headers[pos].members.length > 0) {
                slicedHeaders[slicedHeaders.length - 1].members =
                    this.performSlicing(headers[pos].members, [], startPos, axis);
            }
            if (!this.pageInLimit) {
                slicedHeaders.pop();
            }
            if (headers[pos].level === 0 && this.pageInLimit && this.endPos <= this.memberCnt) {
                break;
            }
            pos++;
        }
        return slicedHeaders;
    }
    private removeChildMembers(member: any): IAxisSet {
        let keys: string[] = Object.keys(member);
        let keyPos: number = 0;
        let framedMember: any = {};
        while (keyPos < keys.length) {
            framedMember[keys[keyPos]] = member[keys[keyPos]];
            if (keys[keyPos] === 'members') {
                framedMember['members'] = [];
            }
            keyPos++;
        }
        return framedMember;
    }
    private insertAllMember(set: IAxisSet[], filter: number[], customText?: string, axis?: string): void {
        let len: number = set.length;
        customText = ' Total';
        set[len] = {
            hasChild: false,
            index: filter,
            level: 0,
            axis: axis,
            isDrilled: false,
            indexObject: {},
            members: [],
            formattedText: 'Grand' + customText,
            ordinal: len,
            type: 'grand sum',
            valueSort: {}
        };
        set[len].valueSort[set[len].formattedText] = 1;
        set[len].valueSort.levelName = set[len].formattedText;
        for (let ln: number = 0, lt: number = filter.length; ln < lt; ln++) {
            set[len].indexObject[filter[ln]] = filter[ln];
        }
        if (axis === 'row') {
            this.rowCount += this.rowValuesLength;
        } else {
            this.columnCount += this.colValuesLength;
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private getTableData(rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vlt: number, rTotal?: IAxisSet, cTotal?: IAxisSet): void {
        for (let rlt: number = rows.length, rln: number = 0; rln < rlt; rln++) {
            tnum = data.length;
            reformAxis[tnum] = rows[rln];
            let actCnt: number = tnum - Number(Object.keys(reformAxis)[0]);
            //let rplus: number = rln + 1;
            //let lvl: number = rows[rln].level;
            let isLeastNode: boolean = !reformAxis[tnum].members.length;
            rows[rln].colIndex = 0;
            rows[rln].rowIndex = tnum;
            if (!data[tnum]) {
                data[tnum] = [];
                this.valueContent[actCnt] = {} as IAxisSet[];
                //data[tnum][0] = rows[rln].name;
                data[tnum][0] = this.valueContent[actCnt][0] = this.frameHeaderWithKeys(rows[rln]);
            } else {
                // data[tnum][0] = rows[rln].name;
                data[tnum][0] = this.valueContent[actCnt][0] = this.frameHeaderWithKeys(rows[rln]);
            }
            if (this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) && !(rows[rln].isDrilled &&
                ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                    !this.showSubTotals || !this.showRowSubTotals))) {
                let hpos: number = tnum;
                let actpos: number = actCnt;
                for (let vln: number = 0; vln < vlt; vln++) {
                    tnum++;
                    actCnt++;
                    let name: string = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj: Object = {
                        axis: 'row',
                        actualText: this.values[vln].name,
                        formattedText: name,
                        level: 0,
                        valueSort: {},
                        colIndex: 0,
                        rowIndex: tnum,
                        type: 'value'
                    };
                    if (!data[tnum]) {
                        data[tnum] = [];
                        this.valueContent[actCnt] = {} as IAxisSet[];
                        data[tnum][0] = this.valueContent[actCnt][0] = calObj;
                    }
                    let vData: IDataSet = (data[tnum][0] as IAxisSet).valueSort;
                    vData[(data[tnum - vln - 1][0] as IAxisSet).valueSort.levelName + this.valueSortSettings.headerDelimiter + name] = 1;
                    vData.levelName = (data[tnum - vln - 1][0] as IAxisSet).valueSort.levelName + this.valueSortSettings.headerDelimiter
                        + name;
                    for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                        //for (let vln: number = 0; (!this.valueAxis && vln < vlt); vln++) {
                        this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal);
                        dln = data[tnum].length;
                        data[hpos][dln - 1] = this.valueContent[actpos][dln - 1] = {
                            axis: 'value', actualText: '', colSpan: 1,
                            colIndex: dln, formattedText: '', hasChild: false
                        };
                        // }
                    }
                }
                this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, vlt, rTotal, cTotal);
            } else {
                for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                    for (let vln: number = 0; vln < vlt; vln++) {
                        this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal);
                        dln = data[tnum].length;
                    }
                }
                this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, 0, rTotal, cTotal);
            }
        }
        /* for (let rlt: number = rows.length, rln: number = 0; rln < rlt; rln++) {
            if (!data[rln]) {
                data[rln] = [];
                data[rln][0] = rows[rln].name;
            } else {
                data[rln][0] = rows[rln].name;
            }
            for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; dln = ++cln) {
                data[rln][dln] = this.getAggregateValue(rows[rln].index, columns[cln].index, 11);
            }
        } */
    }
    /* tslint:disable-next-line:max-line-length */
    private getAggregatedHeaders(rows: IFieldOptions[], columns: IFieldOptions[], rMembers: IAxisSet[], cMembers: IAxisSet[], values: IFieldOptions[]): void {
        this.selectedHeaders = { selectedHeader: [], values: [] };
        for (let vlt: number = values.length, vln: number = 0; vln < vlt; vln++) {
            switch (values[vln].type) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        let baseField: string;
                        let baseItem: string;
                        this.selectedHeaders.values.push(values[vln].name);
                        if (values[vln].baseField && values[vln].baseItem) {
                            baseField = values[vln].baseField;
                            baseItem = values[vln].baseItem;
                        } else if (this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) && columns.length > 0) {
                            baseField = columns[0].name;
                            baseItem = Object.keys(this.fieldList[columns[0].name].members)[0];
                        } else if (rows.length > 0) {
                            baseField = rows[0].name;
                            baseItem = Object.keys(this.fieldList[rows[0].name].members)[0];
                        }
                        let isHeaderSelected: boolean = false;
                        for (let row of rows) {
                            if (row.name === baseField) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rMembers, values[vln].name, baseItem, false, 'row', values[vln].type, this.selectedHeaders.selectedHeader, vln);
                                isHeaderSelected = true;
                                break;
                            }
                        }
                        if (!isHeaderSelected) {
                            for (let column of columns) {
                                if (column.name === baseField) {
                                    /* tslint:disable-next-line:max-line-length */
                                    this.getAggregatedHeaderData(cMembers, values[vln].name, baseItem, false, 'column', values[vln].type, this.selectedHeaders.selectedHeader, vln);
                                    break;
                                }
                            }
                        }
                    }
                    break;
                case 'PercentageOfParentRowTotal':
                case 'PercentageOfParentColumnTotal':
                    {
                        this.selectedHeaders.values.push(values[vln].name);
                        /* tslint:disable-next-line:max-line-length */
                        this.getAggregatedHeaderData((values[vln].type === 'PercentageOfParentRowTotal' ? rMembers : cMembers), values[vln].name, undefined, false, (values[vln].type === 'PercentageOfParentRowTotal' ? 'row' : 'column'), values[vln].type, this.selectedHeaders.selectedHeader, vln);
                    }
                    break;
                case 'RunningTotals':
                    {
                        this.selectedHeaders.values.push(values[vln].name);
                        /* tslint:disable-next-line:max-line-length */
                        this.getAggregatedHeaderData((this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) ? cMembers : rMembers), values[vln].name, undefined, false, (this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) ? 'column' : 'row'), values[vln].type, this.selectedHeaders.selectedHeader, vln);
                    }
                    break;
                case 'PercentageOfParentTotal':
                    {
                        let baseField: string;
                        this.selectedHeaders.values.push(values[vln].name);
                        if (values[vln].baseField) {
                            baseField = values[vln].baseField;
                        } else if (this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) && columns.length > 0) {
                            baseField = columns[0].name;
                        } else if (rows.length > 0) {
                            baseField = rows[0].name;
                        }
                        let isHeaderSelected: boolean = false;
                        for (let len: number = rows.length, i: number = 0; i < len; i++) {
                            if (rows[i].name === baseField) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rMembers, values[vln].name, undefined, false, 'row', values[vln].type, this.selectedHeaders.selectedHeader, vln, i);
                                isHeaderSelected = true;
                                break;
                            }
                        }
                        if (!isHeaderSelected) {
                            for (let len: number = columns.length, i: number = 0; i < len; i++) {
                                if (columns[i].name === baseField) {
                                    /* tslint:disable-next-line:max-line-length */
                                    this.getAggregatedHeaderData(cMembers, values[vln].name, undefined, false, 'column', values[vln].type, this.selectedHeaders.selectedHeader, vln, i);
                                    break;
                                }
                            }
                        }
                    }
                    break;
            }
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private getAggregatedHeaderData(headers: IAxisSet[], name: string, baseItem: string, isChildren: boolean, type: string, aggregateType: SummaryTypes, selectedHeaders: IHeaderData[], vln: number, level?: number): void {
        for (let rln of headers) {
            switch (aggregateType) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        let levelName: string[] = rln.valueSort.levelName.toString().split('.');
                        if (levelName.indexOf(baseItem) !== -1) {
                            /* tslint:disable-next-line:max-line-length */
                            selectedHeaders.push(this.updateSelectedHeaders(baseItem, rln.level, type, isChildren, name, aggregateType, rln.valueSort.levelName as string, (isChildren ? [rln] : headers), vln + 1));
                            if (rln.members.length > 0) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rln.members, name, baseItem, true, type, aggregateType, selectedHeaders[selectedHeaders.length - 1].childMembers, vln);
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
                            /* tslint:disable-next-line:max-line-length */
                            selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName as string, headers, vln + 1));
                        } else {
                            if (rln.members.length > 0) {
                                /* tslint:disable-next-line:max-line-length */
                                selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName as string, rln.members, vln + 1));
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rln.members, name, undefined, false, type, aggregateType, selectedHeaders, vln);
                            }
                        }
                    }
                    break;
                case 'PercentageOfParentTotal':
                    {
                        if (rln.type !== 'grand sum') {
                            if (rln.level === level) {
                                if (rln.members.length > 0) {
                                    if (isChildren) {
                                        let aggregateHeaders: IAxisSet[] = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                        for (let member of rln.members) {
                                            aggregateHeaders.push(member);
                                        }
                                    } else {
                                        let children: IAxisSet[] = extend([], rln.members, null, true) as IAxisSet[];
                                        /* tslint:disable-next-line:max-line-length */
                                        selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName as string, children, vln + 1));
                                        let aggregateHeaders: IAxisSet[] = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                        aggregateHeaders.push(rln);
                                    }
                                    /* tslint:disable-next-line:max-line-length */
                                    this.getAggregatedHeaderData(rln.members, name, undefined, true, type, aggregateType, selectedHeaders, vln, level + 1);
                                } else {
                                    if (!isChildren) {
                                        /* tslint:disable-next-line:max-line-length */
                                        selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName as string, [rln], vln + 1));
                                    }
                                }
                            } else if (rln.members.length > 0) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rln.members, name, undefined, false, type, aggregateType, selectedHeaders, vln, level);
                            }
                        }
                    }
                    break;
            }

        }
    }
    /* tslint:disable-next-line:max-line-length */
    private updateSelectedHeaders(baseItem: string, level: number, type: string, isChildren: boolean, name: string, aggregateType: SummaryTypes, levelName: string, headers: IAxisSet[], vCount: number): IHeaderData {
        let headerData: IHeaderData = {
            name: baseItem,
            level: level,
            axis: type,
            isChild: isChildren,
            value: name,
            type: aggregateType,
            uniqueName: levelName,
            aggregateHeaders: headers,
            childMembers: [],
            valueCount: vCount
        };
        return headerData;
    }
    private applyAdvancedAggregate(rowheads: IAxisSet[], colheads: IAxisSet[], data: IPivotValues): void {
        if (this.selectedHeaders.values.length > 0) {
            let pivotIndex: { [key: string]: [number, number] } = {};
            let colIndex: number[] = [];
            let isIndexFilled: boolean = false;
            for (let rlt: number = data.length, rln: number = 0; rln < rlt; rln++) {
                if (data[rln] !== undefined && data[rln][0] !== undefined) {
                    if (!isIndexFilled) {
                        for (let clt: number = (data[rln] as IPivotValues[]).length, cln: number = 0; cln < clt; cln++) {
                            if ((data[rln][cln] as IAxisSet).axis === 'value' &&
                                this.selectedHeaders.values.indexOf((data[rln][cln] as IAxisSet).actualText as string) !== -1) {
                                colIndex.push(cln);
                                isIndexFilled = true;
                            }
                        }
                    }
                    if (colIndex.length > 0 && (data[rln][colIndex[0]] as IAxisSet).axis === 'value' &&
                        this.selectedHeaders.values.indexOf((data[rln][colIndex[0]] as IAxisSet).actualText as string) !== -1) {
                        for (let index of colIndex) {
                            pivotIndex[rln + ',' + index] = [rln, index];
                        }
                    }
                }
            }
            this.updateAggregates(rowheads, colheads, data, this.selectedHeaders.selectedHeader, colIndex, pivotIndex);
            let indexCollection: string[] = Object.keys(pivotIndex);
            for (let index of indexCollection) {
                let currentSet: IAxisSet = data[pivotIndex[index][0]][pivotIndex[index][1]] as IAxisSet;
                // currentSet.formattedText = '0';
                currentSet.formattedText = (this.selectedHeaders.selectedHeader.length > 0 ? this.emptyCellTextContent : '#N/A');
            }
        } else {
            return;
        }
    }
    /* tslint:disable:all */
    private updateAggregates(rowheads: IAxisSet[], colheads: IAxisSet[], data: IPivotValues, selectedHeaders: IHeaderData[],
        colIndex: number[], pivotIndex: { [key: string]: [number, number] }): void {
        for (let headers of selectedHeaders) {
            let selectedHeaderCollection: IAxisSet[] = headers.aggregateHeaders;
            let name: string = headers.value;
            let valueCount: number = (this.valueAxis && (this.isMutiMeasures || this.alwaysShowValueHeader) ? headers.valueCount : 0);
            let aggregateType: SummaryTypes = headers.type;
            let uniqueName: string = headers.uniqueName;
            let axis: string = headers.axis;
            let isRowBaseField: boolean = axis === 'row' ? true : false;
            let activeValues: IAxisSet;
            let indexCollection: [number, number][] = [];
            let activeColumn: IAxisSet[] = [];
            let columnHeaders: IAxisSet[] = [];
            let rowindexCollection: number[] = [];
            let selectedRowValues: IAxisSet[] = [];
            let selectedColumnValues: ISelectedValues = [];
            if ((['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal', 'RunningTotals']).indexOf(headers.type) !== -1) {
                if (isRowBaseField) {
                    if (headers.type !== 'RunningTotals') {
                        for (let rlt: number = rowheads.length, rln: number = 0; rln < rlt; rln++) {
                            if (rowheads[rln] !== undefined) {
                                if (rowheads[rln].valueSort[uniqueName]) {
                                    activeValues = rowheads[rln];
                                    selectedRowValues = data[rln + valueCount] as IAxisSet[];
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let len: number = data.length, i: number = 0; i < len; i++) {
                        if (data[i] !== undefined && data[i][0] === undefined) {
                            columnHeaders.push(data[i] as IAxisSet);
                        } else {
                            break;
                        }
                    }
                    let len: number = columnHeaders.length;
                    while (len--) {
                        let axisObj: IAxisSet = (columnHeaders[len] as IAxisSet[])[colIndex[0]];
                        let cLevelName: string = axisObj.actualText as string;
                        if (this.selectedHeaders.values.indexOf(cLevelName) === -1) {
                            activeColumn = columnHeaders[len] as IAxisSet[];
                            len = 0;
                        }
                    }
                    if (headers.type !== 'RunningTotals') {
                        for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                            let isSelectedColumn: boolean = false;
                            if (activeColumn[cln] !== undefined && activeColumn[cln].valueSort[uniqueName]) {
                                activeValues = activeColumn[cln];
                                for (let len: number = data.length, i: number = 0; i < len; i++) {
                                    let axisObj: IAxisSet[] = (data[i] as IAxisSet[]);
                                    if (axisObj !== undefined && axisObj[0] !== undefined &&
                                        (axisObj[cln] as IAxisSet).axis === 'value' &&
                                        this.selectedHeaders.values.indexOf((axisObj[cln] as IAxisSet).actualText as string) !== -1) {
                                        isSelectedColumn = true;
                                        selectedColumnValues[i] = axisObj[cln] as IAxisSet;
                                        rowindexCollection.push(i);
                                    }
                                }
                                if (isSelectedColumn) { break; }
                            }
                        }
                    }
                }
            }
            switch (headers.type) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        let isChildren: boolean = headers.isChild;
                        if (isRowBaseField) {
                            if (!isChildren) {
                                for (let item of selectedHeaderCollection) {
                                    for (let rlt: number = rowheads.length, rln: number = 0; rln < rlt; rln++) {
                                        if (rowheads[rln] !== undefined) {
                                            if (rowheads[rln].valueSort[item.valueSort.levelName as string] &&
                                                rowheads[rln].level === activeValues.level && rowheads[rln].type !== 'grand sum') {
                                                for (let index of colIndex) {
                                                    let currentSet: IAxisSet = data[rln + valueCount][index] as IAxisSet;
                                                    if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                        indexCollection.push([rln + valueCount, index]);
                                                        if (pivotIndex[rln + valueCount + ',' + index]) {
                                                            delete pivotIndex[rln + valueCount + ',' + index];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                let uniqueLevelName: string[] = uniqueName.split('.');
                                for (let rlt: number = rowheads.length, rlen: number = 0; rlen < rlt; rlen++) {
                                    if (rowheads[rlen] !== undefined) {
                                        let levelName: string[] = rowheads[rlen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            rowheads[rlen].level === activeValues.level) {
                                            for (let index of colIndex) {
                                                let currentSet: IAxisSet = data[rlen + valueCount][index] as IAxisSet;
                                                if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                    indexCollection.push([rlen + valueCount, index]);
                                                    if (pivotIndex[rlen + valueCount + ',' + index]) {
                                                        delete pivotIndex[rlen + valueCount + ',' + index];
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                            }
                            for (let index of indexCollection) {
                                let currentSet: IAxisSet = data[index[0]][index[1]] as IAxisSet;
                                let cVal: number = currentSet.value - (selectedRowValues[index[1]] as IAxisSet).value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = cVal === 0 ? this.emptyCellTextContent : this.getFormattedValue(cVal, name).formattedText;
                                } else {
                                    cVal = ((selectedRowValues[index[1]] as IAxisSet).value === 0 ?
                                        0 : (cVal / (selectedRowValues[index[1]] as IAxisSet).value));
                                    currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : this.emptyCellTextContent);
                                }
                            }
                        } else {
                            if (!isChildren) {
                                for (let item of selectedHeaderCollection) {
                                    for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                                        let isSelectedColumn: boolean = false;
                                        if (activeColumn[cln] !== undefined &&
                                            activeColumn[cln].valueSort[item.valueSort.levelName as string] &&
                                            activeColumn[cln].level === activeValues.level && activeColumn[cln].type !== 'grand sum') {
                                            for (let index of rowindexCollection) {
                                                let currentSet: IAxisSet = data[index][cln] as IAxisSet;
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
                                let uniqueLevelName: string[] = uniqueName.split('.');
                                for (let clt: number = activeColumn.length, clen: number = 0; clen < clt; clen++) {
                                    let isSelectedColumn: boolean = false;
                                    if (activeColumn[clen] !== undefined) {
                                        let levelName: string[] = activeColumn[clen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            activeColumn[clen].level === activeValues.level) {
                                            for (let index of rowindexCollection) {
                                                let currentSet: IAxisSet = data[index][clen] as IAxisSet;
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
                            for (let index of indexCollection) {
                                let currentSet: IAxisSet = data[index[0]][index[1]] as IAxisSet;
                                let cVal: number = currentSet.value - (selectedColumnValues[index[0]] as IAxisSet).value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = cVal === 0 ? this.emptyCellTextContent : this.getFormattedValue(cVal, name).formattedText;
                                } else {
                                    cVal = ((selectedColumnValues[index[0]] as IAxisSet).value === 0 ?
                                        0 : (cVal / (selectedColumnValues[index[0]] as IAxisSet).value));
                                    currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : this.emptyCellTextContent);
                                }
                            }
                        }
                        if (headers.childMembers.length > 0) {
                            this.updateAggregates(rowheads, colheads, data, headers.childMembers, colIndex, pivotIndex);
                        }
                    }
                    break;
                case 'PercentageOfParentRowTotal':
                case 'PercentageOfParentColumnTotal':
                case 'PercentageOfParentTotal':
                    {
                        if (isRowBaseField) {
                            for (let item of selectedHeaderCollection) {
                                for (let rlt: number = rowheads.length, i: number = 0; i < rlt; i++) {
                                    if (rowheads[i] !== undefined) {
                                        if (rowheads[i].valueSort[item.valueSort.levelName as string] &&
                                            rowheads[i].level === item.level) {
                                            for (let index of colIndex) {
                                                let currentSet: IAxisSet = data[i + valueCount][index] as IAxisSet;
                                                if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                    indexCollection.push([i + valueCount, index]);
                                                    if (pivotIndex[i + valueCount + ',' + index]) {
                                                        delete pivotIndex[i + valueCount + ',' + index];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i of indexCollection) {
                                let currentSet: IAxisSet = data[i[0]][i[1]] as IAxisSet;
                                let cVal: number = currentSet.value / (selectedRowValues[i[1]] as IAxisSet).value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : this.emptyCellTextContent);
                            }
                        } else {
                            for (let item of selectedHeaderCollection) {
                                for (let clt: number = activeColumn.length, j: number = 0; j < clt; j++) {
                                    let isSelectedColumn: boolean = false;
                                    if (activeColumn[j] !== undefined &&
                                        activeColumn[j].valueSort[item.valueSort.levelName as string]) {
                                        for (let index of rowindexCollection) {
                                            let currentSet: IAxisSet = data[index][j] as IAxisSet;
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                isSelectedColumn = true;
                                                indexCollection.push([index, j]);
                                                if (pivotIndex[index + ',' + j]) {
                                                    delete pivotIndex[index + ',' + j];
                                                }
                                            }
                                        }
                                        if (isSelectedColumn) { break; }
                                    }
                                }
                            }
                            for (let i of indexCollection) {
                                let currentSet: IAxisSet = data[i[0]][i[1]] as IAxisSet;
                                let val: number = currentSet.value / (selectedColumnValues[i[0]] as IAxisSet).value;
                                val = isNaN(val) ? 0 : val;
                                currentSet.formattedText = (val !== 0 ? this.globalize.formatNumber(val, { format: 'P', maximumFractionDigits: 2 }) : this.emptyCellTextContent);
                            }
                        }
                    }
                    break;
                case 'RunningTotals':
                    {
                        if (isRowBaseField) {
                            for (let index of colIndex) {
                                let cVal: number = 0;
                                for (let item of selectedHeaderCollection) {
                                    for (let rlt: number = rowheads.length, rlen: number = 0; rlen < rlt; rlen++) {
                                        if (rowheads[rlen] !== undefined) {
                                            let currentSet: IAxisSet = data[rlen + valueCount][index] as IAxisSet;
                                            if (rowheads[rlen] !== undefined && rowheads[rlen].valueSort[item.valueSort.levelName as string] &&
                                                rowheads[rlen].level === item.level && currentSet.axis === 'value' &&
                                                currentSet.actualText === name) {
                                                if (rowheads[rlen].type !== 'grand sum') {
                                                    cVal += currentSet.value;
                                                    currentSet.formattedText = this.getFormattedValue(cVal, name).formattedText;
                                                }
                                                if (pivotIndex[rlen + valueCount + ',' + index]) {
                                                    delete pivotIndex[rlen + valueCount + ',' + index];
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            for (let rlt: number = rowheads.length, rln: number = 0; rln < rlt; rln++) {
                                if (rowheads[rln] !== undefined) {
                                    let cVal: number = 0;
                                    for (let item of selectedHeaderCollection) {
                                        for (let clt: number = activeColumn.length, cln: number = 0; cln < clt; cln++) {
                                            let currentSet: IAxisSet = data[rln + valueCount][cln] as IAxisSet;
                                            if (activeColumn[cln] !== undefined &&
                                                activeColumn[cln].valueSort[item.valueSort.levelName as string] &&
                                                currentSet.axis === 'value' && currentSet.actualText === name) {
                                                if (activeColumn[cln].type !== 'grand sum') {
                                                    cVal += currentSet.value;
                                                    currentSet.formattedText = this.getFormattedValue(cVal, name).formattedText;
                                                }
                                                if (pivotIndex[rln + valueCount + ',' + cln]) {
                                                    delete pivotIndex[rln + valueCount + ',' + cln];
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
    /* tslint:enable:all */
    private recursiveRowData(
        rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vlt: number,
        isLeastNode: boolean, rln: number, vln: number, rTotal: IAxisSet, cTotal: IAxisSet): void {
        if (!isLeastNode) {
            this.getTableData(reformAxis[tnum - vln].members, reformAxis, columns, tnum, data, vlt, rTotal, cTotal);
        }
        if (!this.pageSettings) {
            reformAxis[tnum - vln].members = [];
        }
    }
    private updateRowData(
        rows: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vln: number, rln: number,
        cln: number, dln: number, actCnt: number, rTotal: IAxisSet, cTotal: IAxisSet): void {
        let mPos: number = this.fieldList[this.values[vln].name].index;
        let aggregate: string = this.fieldList[this.values[vln].name].aggregateType;
        let field: string = this.values[vln].name;
        let gTotalIndex: [IAxisSet, IAxisSet][] = [];
        let totalValues: { [key: string]: number } = {};
        let value: number = 0;
        // let isLeast: boolean = isLeastNode && (vln === vlt - 1);
        switch (aggregate) {
            case 'Index':
                {
                    gTotalIndex = [[rows[rln], columns[cln]], [rows[rln], cTotal], [rTotal, columns[cln]], [rTotal, cTotal]];
                    let valueContent: string[] = ['cVal', 'rTotalVal', 'cTotalVal', 'gTotalVal'];
                    let i: number = 0;
                    for (let rIndex of gTotalIndex) {
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    let val: number = ((totalValues.cVal) * (totalValues.gTotalVal)) / ((totalValues.rTotalVal) * (totalValues.cTotalVal));
                    value = (rows[rln].members.length > 0 && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                        !this.showRowSubTotals || !this.showSubTotals)) ? undefined :
                        (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
                }
                break;
            case 'PercentageOfGrandTotal':
            case 'PercentageOfColumnTotal':
            case 'PercentageOfRowTotal':
                {
                    gTotalIndex = [[rows[rln], columns[cln]]];
                    gTotalIndex.push((aggregate === 'PercentageOfGrandTotal' ?
                        [rTotal, cTotal] : (aggregate === 'PercentageOfColumnTotal' ? [rTotal, columns[cln]] : [rows[rln], cTotal])));
                    let valueContent: string[] = ['cVal', 'gTotalVal'];
                    let i: number = 0;
                    for (let rIndex of gTotalIndex) {
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    let val: number = ((totalValues.cVal) / (totalValues.gTotalVal));
                    value = (rows[rln].members.length > 0 && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                        !this.showSubTotals || !this.showRowSubTotals)) ? undefined :
                        (isNullOrUndefined(totalValues.cVal) ? totalValues.cVal : (isNaN(val) ? 0 : val));
                }
                break;
            default:
                value = (rows[rln].members.length > 0 && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                    !this.showSubTotals || !this.showRowSubTotals)) ? undefined :
                    this.getAggregateValue(rows[rln].index, columns[cln].indexObject, mPos, aggregate);
                break;
        }
        let cellDetails: AggregateEventArgs = {
            fieldName: this.values[vln].name,
            row: rows[rln],
            column: columns[cln],
            value: value,
            cellSets: this.getCellSet(this.rawIndexObject),
            /* tslint:disable-next-line:max-line-length */
            rowCellType: (rows[rln].hasChild && rows[rln].isDrilled ? 'subTotal' : rows[rln].type === 'grand sum' ? 'grandTotal' : 'value'),
            /* tslint:disable-next-line:max-line-length */
            columnCellType: (columns[cln].hasChild && columns[cln].isDrilled ? 'subTotal' : columns[cln].type === 'grand sum' ? 'grandTotal' : 'value'),
            aggregateType: aggregate as SummaryTypes,
            skipFormatting: false
        };
        if (this.getValueCellInfo) {
            this.getValueCellInfo(cellDetails);
        }
        value = cellDetails.value;
        let isSum: boolean = rows[rln].hasChild || columns[cln].hasChild ||
            rows[rln].type === 'grand sum' || columns[cln].type === 'grand sum';
        let subTotal: boolean = (rows[rln].members.length > 0 && ((!isNullOrUndefined(rows[rln].showSubTotals) &&
            !rows[rln].showSubTotals) || !this.showSubTotals || !this.showRowSubTotals));
        let formattedText: string = subTotal ?
            '' : (value === undefined) ? this.emptyCellTextContent :
                aggregate === 'Count' ? value.toLocaleString() : this.getFormattedValue(value, field).formattedText;
        if (!isNaN(value) && !isNullOrUndefined(value) &&
            (['PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal']).indexOf(aggregate) >= 0) {
            formattedText = this.globalize.formatNumber(value, { format: 'P', maximumFractionDigits: 2 });
        } else if (!subTotal &&
            isNaN(value) && !isNullOrUndefined(value) &&
            (['PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar']).indexOf(aggregate) !== -1) {
            formattedText = '#DIV/0!';
        }
        //dln = data[tnum].length;
        /* tslint:disable-next-line:max-line-length */
        formattedText = (cellDetails.skipFormatting ? isNullOrUndefined(value) ? this.emptyCellTextContent : value.toString() : formattedText);
        data[tnum][dln] = this.valueContent[actCnt][dln] = {
            axis: 'value', actualText: field, indexObject: this.isDrillThrough ? this.rawIndexObject : {},
            rowHeaders: rows[rln].type === 'grand sum' ? '' : rows[rln].valueSort.levelName,
            columnHeaders: columns[cln].type === 'grand sum' ? '' : columns[cln].valueSort.levelName,
            formattedText: formattedText, value: isNullOrUndefined(value) ? 0 : value, rowIndex: tnum, colIndex: dln, isSum: isSum
        };
        this.rawIndexObject = {};
    }
    private getCellSet(rawIndexObject: INumberIndex): IDataSet[] {
        let currentCellSets: IDataSet[] = [];
        let keys: string[] = Object.keys(rawIndexObject);
        for (let index of keys) {
            if (this.data[parseInt(index, 10)]) {
                currentCellSets.push(this.data[parseInt(index, 10)]);
            }
        }
        return currentCellSets;
    }
    private getHeaderData(axis: IAxisSet[], reformAxis: IAxisSet[], data: IPivotValues, tnum: number, vcnt: number): void {
        let rlt: number = axis.length;
        let colItmLn: number = this.columns.length;
        let sortText: string = this.valueSortSettings.headerText;
        //let valueLn: number = this.values.length;
        for (let rln: number = 0; rln < rlt; rln++) {
            if (axis[rln].members.length) {
                this.getHeaderData(axis[rln].members, reformAxis, data, tnum, vcnt);
            }
            let isTotalHide: boolean = true;
            if ((!isNullOrUndefined(axis[rln].showSubTotals) && !axis[rln].showSubTotals) ||
                !this.showSubTotals || !this.showColumnSubTotals) {
                if (!(axis[rln].members.length > 0)) {
                    reformAxis[reformAxis.length] = this.frameHeaderWithKeys(axis[rln]);
                } else {
                    this.removeCount++;
                    isTotalHide = false;
                }
                tnum = reformAxis.length - 1;
            } else {
                tnum = reformAxis.length;
                reformAxis[tnum] = this.frameHeaderWithKeys(axis[rln]);
            }
            //  let rplus: number = rln + 1;
            let lvl: number = axis[rln].level;
            axis[rln].rowIndex = lvl;
            axis[rln].colIndex = (tnum * vcnt) + vcnt;
            if (!data[lvl]) {
                data[lvl] = [];
                this.headerContent[lvl] = {} as IAxisSet[];
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = this.frameHeaderWithKeys(axis[rln]);
            } else {
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = this.frameHeaderWithKeys(axis[rln]);
            }
            let isSingleMeasure: boolean = (this.columns.length === 0 && this.values.length === 1) ? true : false;
            if ((this.isMutiMeasures || this.alwaysShowValueHeader || isSingleMeasure) && !this.valueAxis && isTotalHide) {
                for (let vln: number = 0; vln < vcnt; vln++) {
                    let name: string = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj: Object = {
                        axis: 'column',
                        actualText: this.values[vln].name,
                        formattedText: name,
                        level: 0,
                        valueSort: {},
                        colIndex: (tnum * vcnt) + 1 + vln,
                        rowIndex: colItmLn
                    };
                    if (!data[colItmLn]) {
                        data[colItmLn] = [];
                        this.headerContent[colItmLn] = {} as IAxisSet[];
                        data[colItmLn][(tnum * vcnt) + 1 + vln] = this.headerContent[colItmLn][(tnum * vcnt) + 1 + vln] = calObj;
                    } else {
                        data[colItmLn][(tnum * vcnt) + 1 + vln] = this.headerContent[colItmLn][(tnum * vcnt) + 1 + vln] = calObj;
                    }
                    let vData: IDataSet = (data[colItmLn][(tnum * vcnt) + 1 + vln] as IAxisSet).valueSort;
                    vData[axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name] = 1;
                    vData.levelName = axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name;
                    if (vData && vData[sortText]) {
                        this.valueSortSettings.columnIndex = (tnum * vcnt) + 1 + vln;
                    }
                }
            } else if (axis[rln].valueSort && axis[rln].valueSort[sortText]) {
                this.valueSortSettings.columnIndex = (tnum * vcnt) + 1;
            }
            if (!this.pageSettings) {
                reformAxis[tnum].members = [];
            }
        }
    }
    /* tslint:disable */
    private getAggregateValue(rowIndex: number[], columnIndex: INumberIndex, value: number, type: string): number {
        //rowIndex = rowIndex.sort();
        //columnIndex = columnIndex.sort();
        let rlt: number = rowIndex.length;
        //let clt: number = columnIndex.length;
        let mirror: INumberIndex = {};
        let ri: number = 0;
        let ci: number = 0;
        let cellValue: number = 0;
        let avgCnt: number = 0;
        let isInit: boolean = true;
        let isValueExist: boolean = false;
        if (type && type.toLowerCase() === 'count') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    cellValue += (isNullOrUndefined(this.valueMatrix[rowIndex[ri]][value]) ? 0 : 1);
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'distinctcount') {
            let duplicateValues: number[] = [];
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    isValueExist = true;
                    let currentVal: number = this.valueMatrix[rowIndex[ri]][value];
                    if (!isNullOrUndefined(currentVal)) {
                        if (duplicateValues.length === 0 || (duplicateValues.length > 0 && duplicateValues.indexOf(currentVal) === -1)) {
                            cellValue += 1;
                            duplicateValues.push(currentVal);
                        }
                    }
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'product') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    isValueExist = true;
                    let currentVal: number = this.valueMatrix[rowIndex[ri]][value];
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
        } else if (type && (['populationstdev', 'samplestdev', 'populationvar', 'samplevar']).indexOf(type.toLowerCase()) !== -1) {
            let i: number = 0;
            let val: number = 0;
            let indexVal: number[] = [];
            let avgVal: number = 0;
            let cVal: number = 0;
            let avgDifferenceVal: number = 0;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let currentVal: number = this.valueMatrix[rowIndex[ri]][value];
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
                for (let index of indexVal) {
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
        } else if (type && type.toLowerCase() === 'min') {
            let isFirst: boolean = true;
            cellValue = undefined;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined && this.valueMatrix[rowIndex[ri]][value] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    if (isNullOrUndefined(cellValue) && isNullOrUndefined(this.valueMatrix[rowIndex[ri]][value])) {
                        cellValue = this.valueMatrix[rowIndex[ri]][value];
                    } else {
                        if (isFirst) {
                            cellValue = this.valueMatrix[rowIndex[ri]][value];
                            isFirst = false;
                        } else {
                            cellValue = this.valueMatrix[rowIndex[ri]][value] < cellValue ? this.valueMatrix[rowIndex[ri]][value] : cellValue;
                        }
                    }
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'max') {
            let isMaxFirst: boolean = true;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined && this.valueMatrix[rowIndex[ri]][value] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    if (isMaxFirst) {
                        cellValue = this.valueMatrix[rowIndex[ri]][value];
                        isMaxFirst = false;
                    } else {
                        cellValue = this.valueMatrix[rowIndex[ri]][value] > cellValue ? this.valueMatrix[rowIndex[ri]][value] : cellValue;
                    }
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'calculatedfield') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let calcField: ICalculatedFields = this.calculatedFields[this.fields[value]];
                    let actualFormula: string = calcField.formula;
                    let aggregateField: { [key: string]: Object } = {};
                    if (this.calculatedFormulas[calcField.name]) {
                        let calculatedFormulas: Object[] = <Object[]>this.calculatedFormulas[calcField.name];
                        for (let len: number = 0, lmt: number = calculatedFormulas.length; len < lmt; len++) {
                            let aggregatedValue: { [key: string]: Object } = <{ [key: string]: Object }>calculatedFormulas[len];
                            let value: number = <number>aggregateField[<string>aggregatedValue.formula];
                            if (value === undefined) {
                                let type: string = <string>aggregatedValue.type;
                                value = this.getAggregateValue(rowIndex, columnIndex, <number>aggregatedValue.index, type);
                                aggregateField[<string>aggregatedValue.formula] = value;
                            }
                            actualFormula = (actualFormula).replace(<string>aggregatedValue.formula, String(value));
                        }
                    }
                    /* tslint:disable */
                    cellValue = eval(actualFormula);
                    (cellValue === Infinity ? Infinity : (cellValue === undefined || isNaN(cellValue)) ? undefined : JSON.parse(String(cellValue)));
                    /* tslint:enable */
                }
                ri++;
            }
        } else {
            cellValue = undefined;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    isValueExist = true;
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    //let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri]), 1)[0] : rowIndex[ri];
                    let currentVal: number = this.valueMatrix[rowIndex[ri]][value];
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
        /* if (rlt > clt) {
             this.makeMirrorObject(rowIndex, mirror);
             while (columnIndex[ci] !== undefined) {
                 if (mirror[columnIndex[ci]]) {
                     let cIndx: number = isLeastLevel ? columnIndex.splice(ci, 1)[0] : columnIndex[ci];
                     //rowIndex.splice
                     sum += this.valueMatrix[cIndx][value];
                 }
                 ci++;
             }
         } else {
             this.makeMirrorObject(columnIndex, mirror);
             while (rowIndex[ri] !== undefined) {
                 if (mirror[rowIndex[ri]]) {
                     let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri]), 1)[0] : rowIndex[ri];
                     sum += this.valueMatrix[rowIndex[ri]][value];
                 }
                 ri++;
             }
         } */
        return ((type && type.toLowerCase() === 'avg' && cellValue !== 0 &&
            !isNullOrUndefined(cellValue)) ? (cellValue / avgCnt) : isValueExist ? cellValue : undefined);
    }
    /* tslint:enable */
    /** hidden */
    public getFormattedValue(value: number | string, fieldName: string): IAxisSet {
        let formattedValue: IAxisSet = {
            formattedText: value === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(value)) : value === undefined ?
                (this.localeObj ? (fieldName in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                    this.localeObj.getConstant('undefined') : String(value)) : value.toString(),
            actualText: value === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(value)) : value === undefined ?
                (this.localeObj ? (fieldName in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                    this.localeObj.getConstant('undefined') : String(value)) : value,
            dateText: value === null ? (this.localeObj ? this.localeObj.getConstant('null') : String(value)) : value === undefined ?
                (this.localeObj ? (fieldName in this.groupingFields) ? this.localeObj.getConstant('groupOutOfRange') :
                    this.localeObj.getConstant('undefined') : String(value)) : value
        };
        if (this.formatFields[fieldName] && value) {
            let formatField: IFormatSettings = ((<{ [key: string]: Object }>this.formatFields[fieldName]).properties ?
                (<{ [key: string]: Object }>this.formatFields[fieldName]).properties : this.formatFields[fieldName]);
            let formatSetting: IFormatSettings = extend({}, formatField, null, true) as IFormatSettings;

            delete formatSetting.name;
            if (!formatSetting.minimumSignificantDigits && formatSetting.minimumSignificantDigits < 1) {
                delete formatSetting.minimumSignificantDigits;
            }
            if (!formatSetting.maximumSignificantDigits && formatSetting.maximumSignificantDigits < 1) {
                delete formatSetting.maximumSignificantDigits;
            }
            if (formatSetting.type) {
                formattedValue.formattedText = this.globalize.formatDate(new Date(value as string), formatSetting);
            } else {
                formattedValue.formattedText = this.globalize.formatNumber(value as number, formatSetting);
            }
            formattedValue.actualText = value;
            if (formatSetting.type && ['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName].type) > -1) {
                formatSetting.format = 'yyyy/MM/dd/HH/mm/ss';
                formattedValue.dateText = this.globalize.formatDate(new Date(value as string), formatSetting);
            }
        }
        return formattedValue;
    }
    private powerFunction(formula: string): string {
        if (formula.indexOf('^') > -1) {
            let items: string[] = [];
            while (formula.indexOf('(') > -1) {
                formula = formula.replace(/(\([^\(\)]*\))/g, (text: string, item: string): string => {
                    items.push(item);
                    return ('~' + (items.length - 1));
                });
            }

            items.push(formula);
            formula = '~' + (items.length - 1);
            while (formula.indexOf('~') > -1) {
                formula = formula.replace(new RegExp('~' + '(\\d+)', 'g'), (text: string, index: number): string => {
                    return items[index].replace(/(\w*)\^(\w*)/g, 'Math.pow' + '($1,$2)');
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

/** @hidden */
export interface IDataOptions {
    data?: IDataSet[] | DataManager;
    rows?: IFieldOptions[];
    columns?: IFieldOptions[];
    values?: IFieldOptions[];
    filters?: IFieldOptions[];
    excludeFields?: string[];
    expandAll?: boolean;
    valueAxis?: string;
    filterSettings?: IFilter[];
    sortSettings?: ISort[];
    enableSorting?: boolean;
    formatSettings?: IFormatSettings[];
    drilledMembers?: IDrillOptions[];
    valueSortSettings?: IValueSortSettings;
    calculatedFieldSettings?: ICalculatedFieldSettings[];
    allowLabelFilter?: boolean;
    allowValueFilter?: boolean;
    showSubTotals?: boolean;
    showRowSubTotals?: boolean;
    showColumnSubTotals?: boolean;
    showGrandTotals?: boolean;
    showRowGrandTotals?: boolean;
    showColumnGrandTotals?: boolean;
    alwaysShowValueHeader?: boolean;
    conditionalFormatSettings?: IConditionalFormatSettings[];
    emptyCellsTextContent?: string;
    groupSettings?: IGroupSettings[];
}
/**
 * @hidden
 */
export interface IConditionalFormatSettings {
    measure?: string;
    conditions?: Condition;
    value1?: number;
    value2?: number;
    style?: IStyle;
    label?: string;
}
/**
 * @hidden
 */
export interface IStyle {
    backgroundColor?: string;
    color?: string;
    fontFamily?: string;
    fontSize?: string;
}
/**
 * @hidden
 */
export interface IValueSortSettings {
    headerText?: string;
    headerDelimiter?: string;
    sortOrder?: Sorting;
    columnIndex?: number;
}
/**
 * @hidden
 */
export interface IPageSettings {
    columnSize?: number;
    rowSize?: number;
    columnCurrentPage?: number;
    rowCurrentPage?: number;
}
/**
 * @hidden
 */
interface IMatrix2D {
    [key: number]: { [key: number]: number };
    length: number;
    push(item: number): number;
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
 * @hidden
 */
export interface IPivotValues {
    [key: number]: IPivotRows;
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
 * @hidden
 */
export interface IFieldOptions {
    name?: string;
    caption?: string;
    type?: SummaryTypes;
    axis?: string;
    showNoDataItems?: boolean;
    baseField?: string;
    baseItem?: string;
    showSubTotals?: boolean;
    //filter?: FilterOptions;
}
/**
 * @hidden
 */
export interface ISort {
    name?: string;
    //type?: string;
    order?: Sorting;
}
/**
 * @hidden
 */
export interface IFilter {
    name?: string;
    type?: FilterType;
    items?: string[];
    condition?: Operators;
    value1?: string | Date;
    value2?: string | Date;
    showLabelFilter?: boolean;
    showDateFilter?: boolean;
    showNumberFilter?: boolean;
    measure?: string;
}
/**
 * @hidden
 */
export interface IDrillOptions {
    name?: string;
    items?: string[];
    delimiter?: string;
}
/**
 * @hidden
 */
export interface ICalculatedFieldSettings {
    name?: string;
    formula?: string;
}
/**
 * @hidden
 */
export interface ICalculatedFields extends ICalculatedFieldSettings {
    actualFormula?: string;
}
/**
 * @hidden
 */
export interface IFormatSettings extends NumberFormatOptions, DateFormatOptions {
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
    };
}
/**
 * @hidden
 */
export interface IFieldListOptions {
    [index: string]: IField;
}
/**
 * @hidden
 */
export interface IField {
    id?: string;
    caption?: string;
    type?: string;
    formatString?: string;
    index?: number;
    members?: IMembers;
    formattedMembers?: IMembers;
    dateMember?: IAxisSet[];
    filter: string[];
    sort: string;
    aggregateType?: string;
    baseField?: string;
    baseItem?: string;
    filterType?: string;
    format?: string;
    formula?: string;
    isSelected?: boolean;
    isExcelFilter?: boolean;
    showNoDataItems?: boolean;
}
/**
 * @hidden
 */
export interface IAxisSet {
    formattedText?: string;
    actualText?: number | string;
    type?: string;
    isDrilled?: boolean;
    hasChild?: boolean;
    members?: this[];
    index?: number[];
    indexObject?: INumberIndex;
    ordinal?: number;
    level?: number;
    axis?: string;
    value?: number;
    colSpan?: number;
    rowSpan?: number;
    valueSort?: IDataSet;
    colIndex?: number;
    rowIndex?: number;
    columnHeaders?: string | number | Date;
    rowHeaders?: string | number | Date;
    isSum?: boolean;
    isLevelFiltered?: boolean;
    cssClass?: string;
    style?: IStyle;
    enableHyperlink?: boolean;
    showSubTotals?: boolean;
    dateText?: number | string;
}
/** @hidden */
export interface IDrilledItem {
    fieldName: string;
    memberName: string;
    axis: string;
    action: string;
    delimiter: string;
    currentCell?: IAxisSet;
}
/** @hidden */
export interface ICustomProperties {
    mode?: string;
    savedFieldList?: IFieldListOptions;
    pageSettings?: IPageSettings;
    enableValueSorting?: boolean;
    isDrillThrough?: boolean;
    localeObj?: L10n;
    fieldsType?: IStringIndex;
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
 * @hidden
 */
export interface IGroupSettings {
    name?: string;
    groupInterval?: DateGroup[];
    startingAt?: Date | number;
    endingAt?: Date | number;
    rangeInterval?: number;
    type?: GroupType;
}
/**
 * @hidden
 */
export interface IGroupRange {
    range?: string;
    isNotInRange?: boolean;
    value?: Date | number;
}