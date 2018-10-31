import { extend, Internationalization, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { PivotUtil } from './util';
import { Sorting, SummaryTypes, FilterType, LabelOperators, ValueOperators, Operators, DateOperators, Condition } from './types';
import { HeaderCollection } from '../common';
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
    public valueContent: IGridValues;
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
    public isMutiMeasures: boolean;
    /** @hidden */
    public drilledMembers: IDrillOptions[];
    /** @hidden */
    public formats: IFormatSettings[];
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
    public isHeaderAvail: boolean;
    private allowValueFilter: boolean;
    private isValueFiltered: boolean;
    private isValueFiltersAvail: boolean;
    private valueSortData: ValueSortData[];
    private valueFilteredData: IAxisSet[];
    private filterFramedHeaders: IAxisSet[];
    private valueMatrix: IMatrix2D = [];
    private indexMatrix: IMatrix2D = [];
    private rMembers: IAxisSet[] = [];
    private cMembers: IAxisSet[] = [];
    private memberCnt: number = -1;
    private pageInLimit: boolean = false;
    private endPos: number = 0;
    private colHdrBufferCalculated: boolean = false;
    private colValuesLength: number = 1;
    private rowValuesLength: number = 1;
    private slicedHeaders: IAxisSet[] = [];
    private fieldFilterMem: IFilterObj = {};
    private filterPosObj: INumberIndex = {};

    /**
     * Constructor for PivotEngine class
     * @param  {DataOptions} dataSource?
     * @param  {string} mode?
     * @hidden
     */
    /* tslint:disable:align */
    constructor(dataSource?: IDataOptions, mode?: string, savedFieldList?: IFieldListOptions,
        pageSettings?: IPageSettings, enableValueSoring?: boolean) {
        /* tslint:enable:align */
        let fields: IDataSet;
        let val: string;
        let filterRw: number[][][];
        this.globalize = new Internationalization();
        this.enableSort = dataSource.enableSorting;
        this.allowValueFilter = dataSource.allowValueFilter;
        this.isValueFilterEnabled = false;
        this.enableValueSorting = enableValueSoring;
        fields = (dataSource.data as IDataSet[])[0];
        this.fields = Object.keys(fields);
        this.rows = dataSource.rows ? dataSource.rows : [];
        this.columns = dataSource.columns ? dataSource.columns : [];
        this.filters = dataSource.filters ? dataSource.filters : [];
        this.formats = dataSource.formatSettings ? dataSource.formatSettings : [];
        this.values = dataSource.values ? dataSource.values : [];
        this.calculatedFieldSettings = dataSource.calculatedFieldSettings ? dataSource.calculatedFieldSettings : [];
        this.enableSort = dataSource.enableSorting === undefined ? true : dataSource.enableSorting;
        this.validateFilters(dataSource);
        this.isExpandAll = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? true : dataSource.expandAll;
        this.drilledMembers =
            dataSource.drilledMembers ? (this.isValueFiltersAvail && dataSource.allowValueFilter) ? [] : dataSource.drilledMembers : [];
        this.isMutiMeasures = this.values.length > 1 ? true : false;
        this.valueAxis = dataSource.valueAxis === 'row' ? 1 : 0;
        this.rowValuesLength = this.valueAxis === 1 ? this.values.length : 1;
        this.colValuesLength = this.valueAxis === 0 ? this.values.length : 1;
        this.valueSortSettings = dataSource.valueSortSettings ||
            { sortOrder: 'None', headerDelimiter: '.', headerText: '', columnIndex: undefined } as IValueSortSettings;
        this.valueSortData = [];
        this.savedFieldList = savedFieldList;
        this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
        this.fillFieldMembers(dataSource.data as IDataSet[], this.indexMatrix);
        this.updateSortSettings(dataSource.sortSettings, this.enableSort);
        this.pageSettings = pageSettings ? pageSettings : this.pageSettings;
        this.valueMatrix = this.generateValueMatrix(dataSource.data as IDataSet[]);
        this.filterMembers = [];
        this.updateFilterMembers(dataSource);
        this.generateGridData(dataSource);
        return this;
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
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        this.getFormattedFields(dataFields);
        this.getCalculatedField(keys);
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
                type = PivotUtil.getType(fields[key] as Date);
                if (!this.fieldList) {
                    this.fieldList = {};
                }
                this.fieldList[key] = {
                    id: key,
                    caption: key,
                    type: (type === undefined || type === 'undefined') ? 'number' : type,
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
                this.fieldList[fields[cnt].name].caption = fields[cnt].caption ? fields[cnt].caption : fields[cnt].name;
                this.fieldList[fields[cnt].name].isSelected = true;
                this.fieldList[fields[cnt].name].aggregateType = fields[cnt].type;
                this.fieldList[fields[cnt].name].showNoDataItems = fields[cnt].showNoDataItems;
            }
        }
        while (lnt--) {
            this.fieldList[this.calculatedFieldSettings[lnt].name].aggregateType = 'CalculatedField';
            this.fieldList[this.calculatedFieldSettings[lnt].name].formula = this.calculatedFieldSettings[lnt].formula;
        }
    }
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
            keys.push(field.name);
            let formulaType: string[] = actualFormula.split('\"');
            for (let len: number = 0, lmt: number = formulaType.length; len < lmt; len++) {
                let type: string = formulaType[len];
                let aggregateValue: string[] = type.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
                if (['Sum', 'Count', 'Min', 'Max', 'Avg'].indexOf(aggregateValue[0]) !== -1) {
                    let index: number = keys.indexOf(aggregateValue[1]);
                    if (!this.calculatedFormulas[field.name]) {
                        this.calculatedFormulas[field.name] = [{
                            index: index,
                            type: aggregateValue[0],
                            formula: type,
                        }];
                    } else {
                        (<Object[]>this.calculatedFormulas[field.name]).push({
                            index: index,
                            type: aggregateValue[0],
                            formula: type,
                        });
                    }
                }
            }
        }
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
                if (!isDataAvail) {
                    let fKey: string = mkey;
                    let formattedValue: IAxisSet = this.getFormattedValue(mkey, key);
                    if (formattedValue.formattedText) {
                        fKey = formattedValue.formattedText;
                    }
                    if (!members.hasOwnProperty(mkey)) {
                        membersCnt++;
                        members[mkey] = {
                            index: [dl], ordinal: membersCnt,
                            isDrilled: this.isExpandAll ? true : false
                        };
                        dateMember.push({ formattedText: formattedValue.formattedText, actualText: formattedValue.actualText });
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
            }
            /*sort = Object.keys(members).sort();
            let sortedMembers: Members = {};
            for (let sln: number = 0, slt: number = sort.length; sln < slt; sln++) {
                sortedMembers[sort[sln]] = members[sort[sln]];
            }
            fList[key].members = sortedMembers; */
        }
        this.fillDrilledInfo();
    }
    private fillDrilledInfo(): void {
        for (let key: number = 0; key < this.drilledMembers.length; key++) {
            let fieldName: string = this.drilledMembers[key].name;
            for (let mem: number = 0; mem < this.drilledMembers[key].items.length; mem++) {
                let memberName: string = this.drilledMembers[key].items[mem];
                let field: IField = this.fieldList[fieldName];
                if (field && field.members[memberName]) {
                    field.members[memberName].isDrilled = this.isExpandAll ? false : true;
                }
            }
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
            this.fieldList[sortSettings[sln].name].sort = sortSettings[sln].order;
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
            if (this.fieldList[filterElement.name].isSelected && this.isValidFilterField(filterElement, source.allowLabelFilter)) {
                this.applyLabelFilter(filterElement);
                filter = filterElement ? filterElement.items : [];
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
                    /* tslint:disable-next-line:max-line-length */
                    if (this.validateFilterValue(parseInt(member, 10), filterElement.condition as ValueOperators, operand1, operand2)) {
                        filterElement.items.push(member);
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
                        if (filterValue.match(value1.toLowerCase() + '$') != null) {
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
    private getDateFilterMembers(members: string[], name: string, operator: DateOperators, value1: Date, value2?: Date): string[] {
        let items: string[] = [];
        for (let member of members) {
            let filterValue: Date = new Date(member);
            if (value1) {
                switch (operator) {
                    case 'Equals':
                    case 'DoesNotEquals':
                        if ((PivotUtil.resetTime(filterValue)).getTime() === (PivotUtil.resetTime(value1)).getTime()) {
                            items.push(this.getFormattedValue(member, name).formattedText);
                        }
                        break;
                    case 'After':
                        if ((PivotUtil.resetTime(filterValue)).getTime() > (PivotUtil.resetTime(value1)).getTime()) {
                            items.push(this.getFormattedValue(member, name).formattedText);
                        }
                        break;
                    case 'AfterOrEqualTo':
                        if ((PivotUtil.resetTime(filterValue)).getTime() >= (PivotUtil.resetTime(value1)).getTime()) {
                            items.push(this.getFormattedValue(member, name).formattedText);
                        }
                        break;
                    case 'Before':
                        if ((PivotUtil.resetTime(filterValue)).getTime() < (PivotUtil.resetTime(value1)).getTime()) {
                            items.push(this.getFormattedValue(member, name).formattedText);
                        }
                        break;
                    case 'BeforeOrEqualTo':
                        if ((PivotUtil.resetTime(filterValue)).getTime() <= (PivotUtil.resetTime(value1)).getTime()) {
                            items.push(this.getFormattedValue(member, name).formattedText);
                        }
                        break;
                    case 'Between':
                    case 'NotBetween':
                        if (((PivotUtil.resetTime(filterValue)).getTime() >= (PivotUtil.resetTime(value1)).getTime()) &&
                            ((PivotUtil.resetTime(filterValue)).getTime() <= (PivotUtil.resetTime(value2)).getTime())) {
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
            }
        }
        return isMemberInclude;
    }
    /* tslint:disable-next-line:max-line-length */
    private frameFilterList(filter: string[], name: string, list: IIterator, type: string, isLabelFilter: boolean, isInclude?: boolean): void {
        let updateFilter: Function = () => {
            let fln: number = 0;
            let field: IField = this.fieldList[name];
            field.filter = filter;
            field.type = type;
            field.isExcelFilter = isLabelFilter;
            let members: IMembers = field.formattedMembers;
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
        };
        if (!list[type]) {
            list[type] = { indexObject: {}, index: [] };
            updateFilter();
        } else {
            updateFilter();
        }
        // }
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
                    value = (type === 'row' ? this.getAggregateValue(rows[i].index, columns.indexObject, mPos, aggregate) :
                        this.getAggregateValue(columns.index, rows[i].indexObject, mPos, aggregate));
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
        if (this.formatFields[measure] && value) {
            let formatSetting: IFormatSettings = extend({}, this.formatFields[measure], null, true) as IFormatSettings;
            delete formatSetting.name;
            return this.globalize.parseNumber(value, formatSetting);
        } else {
            return parseInt(value, 10);
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
    /* tslint:disable */
    public generateGridData(dataSource: IDataOptions, headerCollection?: HeaderCollection): void {
        let keys: string[] = this.fields;
        let columns: IFieldOptions[] = dataSource.columns ? dataSource.columns : [];
        let data: IDataSet[] = dataSource.data as IDataSet[];
        let rows: IFieldOptions[] = dataSource.rows ? dataSource.rows : [];
        let filterSettings: IFilter[] = dataSource.filterSettings;
        let values: IFieldOptions[] = dataSource.values;
        let size: number = 1;
        this.isExpandAll = dataSource.expandAll;
        this.drilledMembers = dataSource.drilledMembers ? dataSource.drilledMembers : [];
        this.isEmptyData = false;
        let filterMembers: number[] = [];
        let showNoDataItems: boolean = (rows[0] && rows[0].showNoDataItems) || (columns[0] && columns[0].showNoDataItems);
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
        if (!this.isValueFilterEnabled) {
            if (!headerCollection || this.enableValueSorting) {
                this.columnCount = 0; this.rowCount = 0; this.cMembers = []; this.rMembers = [];
                if (rows.length !== 0) {
                    this.rMembers =
                        this.getIndexedHeaders(rows, data, 0, rows[0].showNoDataItems ? filterMembers : this.filterMembers, 'row', '');
                }
                if (columns.length !== 0) {
                    this.cMembers = this.getIndexedHeaders(columns, data, 0, columns[0].showNoDataItems ?
                        filterMembers : this.filterMembers, 'column', '');
                }
                this.insertAllMembersCommon();
            }
            this.saveDataHeaders = (this.isValueFiltersAvail && dataSource.allowValueFilter) ? {
                rowHeaders: extend([], this.rMembers, null, true) as IAxisSet[],
                columnHeaders: extend([], this.cMembers, null, true) as IAxisSet[]
            } : {};
        }
        this.pivotValues = []; let gridData: IPivotValues = []; this.headerContent = [];
        this.valueContent = []; this.valueFilteredData = []; this.filterFramedHeaders = []; let rowheads: IAxisSet[] = [];
        let colheads: IAxisSet[] = []; let rowFilteredData: IAxisSet[] = []; let columnFilteredData: IAxisSet[] = [];
        let valuesCount: number = (this.values.length);
        if ((this.isValueFiltersAvail && dataSource.allowValueFilter)) {
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
                    filterMembers : this.filterMembers, 'row', '') : this.rMembers;
            this.cMembers = columns.length !== 0 ?
                this.getIndexedHeaders(columns, data, 0, columns[0].showNoDataItems ?
                    filterMembers : this.filterMembers, 'column', '') : this.cMembers;
            this.insertAllMembersCommon();
            this.updateFieldList(savedFieldList);
            this.rowCount = 0; this.columnCount = 0;
            this.rMembers = this.updateFramedHeaders(this.rMembers, this.rMembers, rowFilteredData, this.filterFramedHeaders, 'row');
            this.filterFramedHeaders = [];
            this.cMembers = this.updateFramedHeaders(this.cMembers, this.cMembers, columnFilteredData, this.filterFramedHeaders, 'column');
            this.isValueFilterEnabled = true;
        }
        this.applyValueSorting();
        if (this.pageSettings) {
            if (!headerCollection || this.enableValueSorting) {
                this.headerCollection.rowHeaders = extend([], this.rMembers, null, true) as IAxisSet[];
                this.headerCollection.columnHeaders = extend([], this.cMembers, null, true) as IAxisSet[];
                this.headerCollection.rowHeadersCount = this.rowCount; this.headerCollection.columnHeadersCount = this.columnCount;
            } else {
                this.rMembers = headerCollection.rowHeaders; this.cMembers = headerCollection.columnHeaders;
                this.rowCount = headerCollection.rowHeadersCount; this.columnCount = headerCollection.columnHeadersCount;
                if (this.columns.length > 1 || this.rows.length > 1 || this.allowValueFilter) {
                    this.headerCollection = extend({}, headerCollection, null, true) as HeaderCollection;
                }
            }
            this.calculatePagingValues();
            if (!this.enableValueSorting || !this.allowValueFilter) {
                if (rows.length > 0) {
                    this.insertPosition(rows, data, 0, this.filterMembers, 'row', '', this.rMembers);
                }
                if (columns.length > 0) {
                    this.insertPosition(columns, data, 0, this.filterMembers, 'column', '', this.cMembers);
                }
                this.rMembers = this.insertTotalPosition(this.rMembers); this.cMembers = this.insertTotalPosition(this.cMembers);
            }
        }
        this.getHeaderData(this.cMembers, colheads, this.pivotValues, 0, this.valueAxis ? 1 : valuesCount);
        this.insertSubTotals();
        //this.getHeaderData(rmembers, rowheads, gridData, 0);              
        this.getTableData(this.rMembers, rowheads, colheads, 0, this.pivotValues, valuesCount);
        if (this.pageSettings) {
            this.removeIndexProperties();
        }
        this.isEngineUpdated = true; let st2: number = new Date().getTime();
        //  console.log(st1 - st2);
    }
    /* tslint:enable */
    private applyValueSorting(): void {
        if (this.valueSortSettings.headerText && this.valueSortSettings.headerText !== '' && this.values.length > 0) {
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
            if (this.values.length > 1 && caption && this.fieldList[caption]) {
                for (let i: number = 0; i < textArray.length - 1; i++) {
                    hText = hText === '' ? textArray[i] : (hText + this.valueSortSettings.headerDelimiter + textArray[i]);
                }
                mIndex = this.fieldList[caption].index;
                mType = this.fieldList[caption].aggregateType;
            } else {
                hText = this.valueSortSettings.headerText;
                mIndex = this.fieldList[this.values[0].name].index;
                mType = this.fieldList[this.values[0].name].aggregateType;
            }
            let member: IAxisSet;
            if (this.valueAxis === 0) {
                member = this.getMember(this.cMembers, hText);
                if (member) {
                    this.sortByValueRow(this.rMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            } else {
                member = this.getMember(this.rMembers, hText);
                if (member) {
                    this.sortByValueRow(this.cMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            }
        }
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
    private sortByValueRow(rMembers: IAxisSet[], member: IAxisSet, sortOrder: Sorting, mIndex: number, mType: string): void {
        let sort: boolean = false;
        let vlen: number = rMembers.length;
        for (let j: number = 0; j < vlen; j++) {
            for (let k: number = j; k < vlen && rMembers[j].type !== 'grand sum' && rMembers[k].type !== 'grand sum'; k++) {
                if (sortOrder === 'Descending') {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) <
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                } else {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) >
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                }
                if (sort) {
                    let temp: IAxisSet = {} as IAxisSet;
                    temp = rMembers[j];
                    rMembers[j] = rMembers[k];
                    rMembers[k] = temp;
                }
            }
            if (rMembers[j].members.length > 0) {
                this.sortByValueRow(rMembers[j].members, member, sortOrder, mIndex, mType);
            }
        }
    }
    private insertAllMembersCommon(): void {
        /* inserting the row grant-total members */
        this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
        /* inserting the column gran-total members */
        this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
    }
    private removeIndexProperties(): void {
        for (let rCnt: number = 0; rCnt < this.headerContent.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                for (let cCnt: number = 0; cCnt < Object.keys(this.headerContent[rCnt]).length; cCnt++) {
                    let key: number = Number(Object.keys(this.headerContent[rCnt])[cCnt]);
                    this.headerContent[rCnt][key].index = [];
                    this.headerContent[rCnt][key].indexObject = {};
                    (this.pivotValues[rCnt][key] as IAxisSet).index = [];
                    (this.pivotValues[rCnt][key] as IAxisSet).indexObject = {};
                }
            }
        }
        for (let rCnt: number = this.headerContent.length; rCnt < this.pivotValues.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                this.valueContent[rCnt - this.headerContent.length][0].index = [];
                this.valueContent[rCnt - this.headerContent.length][0].indexObject = {};
                (this.pivotValues[rCnt][0] as IAxisSet).index = [];
                (this.pivotValues[rCnt][0] as IAxisSet).indexObject = {};
            }
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
    /* tslint:disable:max-func-body-length */
    private getIndexedHeaders(
        keys: IFieldOptions[], data: IDataSet[], keyInd?: number, position?: number[], axis?: string,
        parentMember?: string
    ): IAxisSet[] {
        let hierarchy: IAxisSet[] = [];
        let showPosition: boolean = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
        if (keys) {
            let rlen: number = keys.length;
            let decisionObj: IIterator = {};
            let fieldName: string = keys[keyInd].name;
            let field: IFieldOptions = keys[keyInd];
            // let members: string[] = Object.keys(this.fieldList[field].members);
            let childrens: IField = this.fieldList[fieldName];
            let index: { [key: number]: number[] } = {};
            let isNoData: boolean = false;
            let showNoDataItems: boolean = (position.length < 1 && keyInd > 0) || field.showNoDataItems;
            let savedMembers: IStringIndex = {};
            if (showNoDataItems) {
                for (let pos: number = 0, lt: number = childrens.dateMember.length; pos < lt; pos++) {
                    savedMembers[childrens.dateMember[pos].actualText as string] =
                        childrens.dateMember[pos].actualText as string;
                }
                if (position.length < 1) {
                    isNoData = true;
                    position.length = childrens.dateMember.length;
                }
            }
            for (let pos: number = 0, lt: number = position.length; pos < lt; pos++) {
                let member: IAxisSet = {};
                member.hasChild = keyInd < rlen - 1;
                member.level = keyInd;
                member.axis = axis;
                member.colSpan = 1;
                let memInd: number = isNoData ? childrens.members[Object.keys(savedMembers)[0]].ordinal :
                    this.indexMatrix[position[pos]][childrens.index];
                let headerValue: string = isNoData ? Object.keys(savedMembers)[0] :
                    data[position[pos]][fieldName] as string;
                delete savedMembers[headerValue];
                if (showNoDataItems && this.fieldFilterMem[fieldName] &&
                    this.fieldFilterMem[fieldName].memberObj[headerValue] === headerValue) {
                    continue;
                }
                member.isDrilled = member.hasChild ? childrens.members[headerValue].isDrilled : false;
                let formattedValue: IAxisSet = this.getFormattedValue(headerValue, fieldName);
                member.actualText = formattedValue.actualText;
                member.formattedText = formattedValue.formattedText;
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
                        if (showPosition) {
                            member.index = decisionObj[memInd].index = [position[pos]];
                            decisionObj[memInd].indexObject[position[pos]] = position[pos];
                            member.indexObject = decisionObj[memInd].indexObject;
                        } else {
                            index[memInd] = [position[pos]];
                        }
                    }
                    member.ordinal = memInd;
                    member.valueSort = {};
                    if (showPosition) {
                        if (keyInd !== 0) {
                            member.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter + member.formattedText;
                            member.valueSort[parentMember + this.valueSortSettings.headerDelimiter + member.formattedText] = 1;
                        } else {
                            member.valueSort[member.formattedText] = 1;
                            member.valueSort.levelName = member.formattedText;
                        }
                    }
                    //if (!member.members) {
                    member.members = [];
                    //}
                    //let copyObj: AxisSet = Object.create(member);
                    hierarchy.push(member);
                } else if (availData) {
                    if (showPosition) {
                        decisionObj[memInd].index.push(position[pos]);
                        decisionObj[memInd].indexObject[position[pos]] = position[pos];
                    } else {
                        if (index[memInd] === undefined) {
                            index[memInd] = [position[pos]];
                        } else {
                            index[memInd].push(position[pos]);
                        }
                    }
                }
                if (showNoDataItems && !isNoData && keyInd > 0 && pos + 1 === position.length &&
                    Object.keys(savedMembers).length > 0) {
                    isNoData = true;
                    lt = Object.keys(savedMembers).length;
                    pos = -1;
                }
            }
            for (let iln: number = 0, ilt: number = hierarchy.length; iln < ilt; iln++) {
                if (axis === 'row') {
                    this.rowCount += this.rowValuesLength;
                } else {
                    this.columnCount += this.colValuesLength;
                }
                if (rlen - 1 > keyInd && hierarchy[iln].isDrilled) {
                    if (showPosition) {
                        let level: string = null;
                        if (hierarchy[iln].valueSort && hierarchy[iln].valueSort.levelName) {
                            level = hierarchy[iln].valueSort.levelName as string;
                        }
                        parentMember = (level || hierarchy[iln].formattedText) as string;
                    }
                    let filterPosition: number[] = !showPosition ? index[hierarchy[iln].ordinal] : hierarchy[iln].index;
                    /* tslint:disable:align */
                    hierarchy[iln].members = this.getIndexedHeaders(keys, data, keyInd + 1,
                        (filterPosition === undefined ? [] : filterPosition), axis, parentMember);
                    /* tslint:enable:align */
                }
            }
            if (this.enableSort) {
                return new DataManager(hierarchy as JSON[]).executeLocal(new Query().sortBy('actualText', childrens.sort.toLowerCase()));
            } else {
                return hierarchy;
            }
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
                let formattedValue: IAxisSet = this.getFormattedValue(data[position[pos]][field] as string, field);
                if (!(slicedHeader && slicedHeader.formattedText === formattedValue.formattedText)) {
                    continue;
                }
                if (!(decisionObj && decisionObj[memInd])) {
                    decisionObj[memInd] = { index: [], indexObject: {} };
                    slicedHeader.index = decisionObj[memInd].index = [position[pos]];
                    decisionObj[memInd].indexObject[position[pos]] = position[pos];
                    slicedHeader.indexObject = decisionObj[memInd].indexObject;
                    slicedHeader.valueSort = {};
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
        let isValueSorting: boolean = ((this.valueSortSettings.sortOrder !== 'None' &&
            this.valueSortSettings.headerText !== '') || this.enableValueSorting) ? true : false;
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
            this.rMembers = isValueSorting ? this.rMembers : this.performSlicing(this.rMembers, [], this.rowStartPos, 'row');
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
            if (!isValueSorting) {
                this.endPos = this.colStartPos + (this.pageSettings.columnSize * 3 * this.colValuesLength);
                this.endPos = this.endPos > this.columnCount ? this.columnCount : this.endPos;
                this.cMembers = this.performSlicing(this.cMembers, [], this.colStartPos, 'column');
            }
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
            let members: IAxisSet[] = headers[pos].members;
            slicedHeaders.push(headers[pos]);
            if (headers[pos].members.length > 0) {
                slicedHeaders[slicedHeaders.length - 1].members = [];
                slicedHeaders[slicedHeaders.length - 1].members =
                    this.performSlicing(members, [], startPos, axis);
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
    private insertAllMember(set: IAxisSet[], filter: number[], customText?: string, axis?: string): void {
        let len: number = set.length;
        let showPosition: boolean = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
        customText = ' Total';
        set[len] = {
            hasChild: false,
            index: !showPosition ? [] : filter,
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
        if (showPosition) {
            for (let ln: number = 0, lt: number = filter.length; ln < lt; ln++) {
                set[len].indexObject[filter[ln]] = filter[ln];
            }
        }
        if (axis === 'row') {
            this.rowCount += this.rowValuesLength;
        } else {
            this.columnCount += this.colValuesLength;
        }
    }
    private getTableData(
        rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vlt: number): void {
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
                data[tnum][0] = this.valueContent[actCnt][0] = rows[rln];
            } else {
                // data[tnum][0] = rows[rln].name;
                data[tnum][0] = this.valueContent[actCnt][0] = rows[rln];
            }
            if (this.valueAxis && this.isMutiMeasures) {
                let hpos: number = tnum;
                let actpos: number = actCnt;
                for (let vln: number = 0; vln < vlt; vln++) {
                    tnum++;
                    actCnt++;
                    let name: string = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj: Object = {
                        axis: 'row',
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
                        this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt);
                        dln = data[tnum].length;
                        data[hpos][dln - 1] = this.valueContent[actpos][dln - 1] = {
                            axis: 'value', actualText: '', colSpan: 1,
                            colIndex: dln, formattedText: '', hasChild: false
                        };
                        // }
                    }
                }
                this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, vlt);
            } else {
                for (let cln: number = 0, dln: number = 1, clt: number = columns.length; cln < clt; ++cln) {
                    for (let vln: number = 0; vln < vlt; vln++) {
                        this.updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt);
                        dln = data[tnum].length;
                    }
                }
                this.recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, 0);
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
    private recursiveRowData(
        rows: IAxisSet[], reformAxis: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vlt: number,
        isLeastNode: boolean, rln: number, vln: number): void {
        if (!isLeastNode) {
            this.getTableData(
                reformAxis[tnum - vln].members, reformAxis, columns, tnum, data, vlt);
        }
        reformAxis[tnum - vln].members = [];
    }
    private updateRowData(
        rows: IAxisSet[], columns: IAxisSet[], tnum: number, data: IPivotValues, vln: number, rln: number,
        cln: number, dln: number, actCnt: number): void {
        let mPos: number = this.fieldList[this.values[vln].name].index;
        let aggregate: string = this.fieldList[this.values[vln].name].aggregateType;
        let field: string = this.values[vln].name;
        let value: number = 0;
        // let isLeast: boolean = isLeastNode && (vln === vlt - 1);
        value = this.getAggregateValue(rows[rln].index, columns[cln].indexObject, mPos, aggregate);
        let isSum: boolean = rows[rln].hasChild || columns[cln].hasChild ||
            rows[rln].type === 'grand sum' || columns[cln].type === 'grand sum';
        let formattedText: string = this.getFormattedValue(value, field).formattedText;
        //dln = data[tnum].length;
        data[tnum][dln] = this.valueContent[actCnt][dln] = {
            axis: 'value', actualText: field,
            formattedText: formattedText, value: value, rowIndex: tnum, colIndex: dln, isSum: isSum
        };
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
            tnum = reformAxis.length;
            reformAxis[tnum] = axis[rln];
            //  let rplus: number = rln + 1;
            let lvl: number = axis[rln].level;
            axis[rln].rowIndex = lvl;
            axis[rln].colIndex = (tnum * vcnt) + vcnt;
            if (!data[lvl]) {
                data[lvl] = [];
                this.headerContent[lvl] = {} as IAxisSet[];
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = axis[rln];
            } else {
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = axis[rln];
            }
            if (this.isMutiMeasures && !this.valueAxis) {
                for (let vln: number = 0; vln < vcnt; vln++) {
                    let name: string = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj: Object = {
                        axis: 'column',
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
            reformAxis[tnum].members = [];
        }
    }
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
        if (type && type.toLowerCase() === 'count') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    cellValue += 1;
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'min') {
            let isFirst: boolean = true;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    if (isFirst) {
                        cellValue = this.valueMatrix[rowIndex[ri]][value];
                        isFirst = false;
                    } else {
                        cellValue = this.valueMatrix[rowIndex[ri]][value] < cellValue ? this.valueMatrix[rowIndex[ri]][value] : cellValue;
                    }
                }
                ri++;
            }
        } else if (type && type.toLowerCase() === 'max') {
            let isMaxFirst: boolean = true;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
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
                            actualFormula = (actualFormula).replace(<string>aggregatedValue.formula, value.toString());
                        }
                    }
                    cellValue = this.evaluate(actualFormula);
                    JSON.parse(cellValue.toString());
                }
                ri++;
            }
        } else {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    //let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri]), 1)[0] : rowIndex[ri];
                    cellValue += this.valueMatrix[rowIndex[ri]][value];
                    avgCnt++;
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
        return ((type && type.toLowerCase() === 'avg' && cellValue !== 0) ? (cellValue / avgCnt) : cellValue);
    }
    private getFormattedValue(value: number | string, fieldName: string): IAxisSet {
        let formattedValue: IAxisSet = {
            formattedText: value !== undefined ? value === null ? 'null' : value.toString() : undefined,
            actualText: value !== undefined ? value === null ? 'null' : value : undefined
        };
        if (this.formatFields[fieldName] && value) {
            let formatSetting: IFormatSettings = extend({}, this.formatFields[fieldName], null, true) as IFormatSettings;
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
            if (formatSetting.type && this.formatFields[fieldName].type === 'date') {
                formatSetting.format = 'yyyy/MM/dd/HH/mm/ss';
                formattedValue.actualText = this.globalize.formatDate(new Date(value as string), formatSetting);
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
    private evaluate(obj: string): number {
        return Function('"use strict";return (' + obj + ')')();
    };
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
    conditionalFormatSettings?: IConditionalFormatSettings[];
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
export interface IStringIndex {
    [key: string]: string;
}
/**
 * @hidden
 */
export interface IPivotValues {
    [key: number]: { [key: number]: number | string | Object | IAxisSet, length: number };
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
    isSum?: boolean;
    isLevelFiltered?: boolean;
    cssClass?: string;
    style?: IStyle;
}
interface ValueSortData {
    rowData: IDataSet[];
    childMembers: this[];
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