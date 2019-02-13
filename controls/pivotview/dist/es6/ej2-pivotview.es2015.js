import { Browser, ChildProperty, Collection, Complex, Component, Draggable, Droppable, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, closest, createElement, extend, formatUnit, getInstance, isNullOrUndefined, prepend, remove, removeClass, setCurrencyCode, setStyleAttribute } from '@syncfusion/ej2-base';
import { Dialog, Tooltip, createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { ColumnChooser, CommandColumn, ContextMenu, Edit, ExcelExport, Freeze, Grid, Page, PdfExport, Reorder, Resize, Selection, Toolbar, VirtualScroll, headerRefreshed, setStyleAndAttributes } from '@syncfusion/ej2-grids';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { PdfColor, PdfDocument, PdfFontFamily, PdfFontStyle, PdfGrid, PdfLayoutFormat, PdfPageTemplateElement, PdfPen, PdfSolidBrush, PdfStandardFont, PdfStringFormat, PdfTextAlignment, PdfVerticalAlignment, PointF, RectangleF } from '@syncfusion/ej2-pdf-export';
import { Accordion, ContextMenu as ContextMenu$1, Tab, TreeView } from '@syncfusion/ej2-navigations';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ColorPicker, MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { Button, CheckBox, RadioButton } from '@syncfusion/ej2-buttons';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */
class PivotUtil {
    static getType(value) {
        let val;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        return val;
    }
    static resetTime(date) {
        date.setHours(0, 0, 0, 0);
        return date;
    }
}

/**
 * PivotEngine is used to manipulate the relational or Multi-Dimensional data as pivoting values.
 */
/** @hidden */
class PivotEngine {
    /**
     * Constructor for PivotEngine class
     * @param  {DataOptions} dataSource?
     * @param  {string} mode?
     * @hidden
     */
    /* tslint:disable:align */
    constructor(dataSource, mode, savedFieldList, pageSettings, enableValueSoring, isDrillThrough) {
        /** @hidden */
        this.formatFields = {};
        /** @hidden */
        this.calculatedFields = {};
        /** @hidden */
        this.calculatedFormulas = {};
        /** @hidden */
        this.valueAxis = 0;
        /** @hidden */
        this.saveDataHeaders = {};
        /** @hidden */
        this.columnCount = 0;
        /** @hidden */
        this.rowCount = 0;
        /** @hidden */
        this.colFirstLvl = 0;
        /** @hidden */
        this.rowFirstLvl = 0;
        /** @hidden */
        this.rowStartPos = 0;
        /** @hidden */
        this.colStartPos = 0;
        /** @hidden */
        this.enableValueSorting = false;
        /** @hidden */
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
        /* tslint:enable:align */
        let fields;
        this.globalize = new Internationalization();
        this.enableSort = dataSource.enableSorting;
        this.showSubTotals = isNullOrUndefined(dataSource.showSubTotals) ? true : dataSource.showSubTotals;
        this.showRowSubTotals = isNullOrUndefined(dataSource.showRowSubTotals) ? true : dataSource.showRowSubTotals;
        this.showColumnSubTotals = isNullOrUndefined(dataSource.showColumnSubTotals) ? true : dataSource.showColumnSubTotals;
        this.showGrandTotals = isNullOrUndefined(dataSource.showGrandTotals) ? true : dataSource.showGrandTotals;
        this.showRowGrandTotals = isNullOrUndefined(dataSource.showRowGrandTotals) ? true : dataSource.showRowGrandTotals;
        this.showColumnGrandTotals = isNullOrUndefined(dataSource.showColumnGrandTotals) ? true : dataSource.showColumnGrandTotals;
        this.allowValueFilter = dataSource.allowValueFilter;
        this.isValueFilterEnabled = false;
        this.enableValueSorting = enableValueSoring;
        fields = dataSource.data[0];
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
            { sortOrder: 'None', headerDelimiter: '.', headerText: '', columnIndex: undefined };
        this.valueSortData = [];
        this.pageSettings = pageSettings ? pageSettings : this.pageSettings;
        this.savedFieldList = savedFieldList;
        this.isDrillThrough = isDrillThrough ? isDrillThrough : false;
        this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
        this.fillFieldMembers(dataSource.data, this.indexMatrix);
        this.updateSortSettings(dataSource.sortSettings, this.enableSort);
        this.valueMatrix = this.generateValueMatrix(dataSource.data);
        this.filterMembers = [];
        this.updateFilterMembers(dataSource);
        this.generateGridData(dataSource);
        return this;
    }
    getFormattedFields(fields) {
        let cnt = this.formats.length;
        while (cnt--) {
            this.formatFields[this.formats[cnt].name] = this.formats[cnt];
            // for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            // if (fields[len] && fields[len].name === this.formats[cnt].name) {
            //     this.formatFields[fields[len].name] = this.formats[cnt];
            // }
            // }
        }
    }
    getFieldList(fields, isSort, isValueFilteringEnabled) {
        let type;
        let keys = this.fields;
        let dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        this.getFormattedFields(dataFields);
        this.getCalculatedField(keys);
        let len = keys.length;
        if (this.savedFieldList) {
            this.fieldList = this.savedFieldList;
            while (len--) { /** while is used for better performance than for */
                let key = keys[len];
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
                }
                else {
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
        }
        else {
            while (len--) { /** while is used for better performance than for */
                let key = keys[len];
                type = PivotUtil.getType(fields[key]);
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
    updateFieldList(savedFieldList) {
        let keys = this.fields;
        let len = keys.length;
        while (len--) { /** while is used for better performance than for */
            this.fieldList[keys[len]].isExcelFilter = savedFieldList[keys[len]].isExcelFilter;
        }
    }
    updateTreeViewData(fields) {
        let cnt = fields.length;
        let lnt = this.calculatedFieldSettings.length;
        while (cnt--) {
            if (this.fieldList[fields[cnt].name]) {
                let field = this.fieldList[fields[cnt].name];
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
    getCalculatedField(keys) {
        for (let field of this.calculatedFieldSettings) {
            this.calculatedFields[field.name] = extend({}, field, null, true);
            this.calculatedFields[field.name].actualFormula = field.formula;
        }
        let fieldKeys = Object.keys(this.calculatedFields);
        for (let calc = 0, cnt = fieldKeys.length; calc < cnt; calc++) {
            let field = this.calculatedFields[fieldKeys[calc]];
            let calcProperties = field.properties;
            let actualFormula = (calcProperties ? calcProperties.formula : field.formula).replace(/ +/g, '');
            let formula = actualFormula.replace(/"/g, '');
            field.formula = formula.indexOf('^') > -1 ? this.powerFunction(formula) : formula;
            field.name = calcProperties ? calcProperties.name : field.name;
            keys.push(field.name);
            let formulaType = actualFormula.split('\"');
            for (let len = 0, lmt = formulaType.length; len < lmt; len++) {
                let type = formulaType[len];
                let aggregateValue = type.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
                let selectedString = (aggregateValue[0] === 'DistinctCount' ?
                    'DistinctCount' : aggregateValue[0] === 'PopulationStDev' ?
                    'PopulationStDev' : aggregateValue[0] === 'SampleStDev' ? 'SampleStDev' : aggregateValue[0] === 'PopulationVar' ?
                    'PopulationVar' : aggregateValue[0] === 'SampleVar' ? 'SampleVar' : aggregateValue[0]);
                if (['Sum', 'Count', 'Min', 'Max', 'Avg', 'Product', 'DistinctCount',
                    'PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar'].indexOf(selectedString) !== -1) {
                    let index = keys.indexOf(aggregateValue[1]);
                    if (!this.calculatedFormulas[field.name]) {
                        this.calculatedFormulas[field.name] = [{
                                index: index,
                                type: selectedString,
                                formula: type,
                            }];
                    }
                    else {
                        this.calculatedFormulas[field.name].push({
                            index: index,
                            type: selectedString,
                            formula: type,
                        });
                    }
                }
            }
        }
    }
    validateFilters(data) {
        this.isValueFiltersAvail = false;
        let filterElements = data.filterSettings ? data.filterSettings : [];
        let dataFields = extend([], this.rows, null, true);
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
    fillFieldMembers(data, indMat) {
        let keys = this.fields;
        let dlen = data.length;
        let fList = this.fieldList;
        let kLn = keys.length;
        for (let kl = 0; kl < kLn; kl++) {
            let key = keys[kl];
            if (!fList[key].members) {
                fList[key].members = {};
            }
            if (!fList[key].formattedMembers) {
                fList[key].formattedMembers = {};
            }
            if (!fList[key].dateMember) {
                fList[key].dateMember = [];
            }
            let members = fList[key].members;
            let isDataAvail = Object.keys(members).length > 0 ? true : false;
            let formattedMembers = fList[key].formattedMembers;
            let dateMember = fList[key].dateMember;
            let membersCnt = 0;
            let fmembersCnt = 0;
            //let sort: string[] = [];
            for (let dl = 0; dl < dlen; dl++) {
                let mkey = data[dl][key];
                if (!isNullOrUndefined(mkey)) {
                    if (!isDataAvail) {
                        let fKey = mkey;
                        let formattedValue = (this.pageSettings && !(this.formatFields[key] &&
                            (['date', 'dateTime', 'time'].indexOf(this.formatFields[key].type) > -1))) ? ({
                            formattedText: isNullOrUndefined(mkey) ? mkey : mkey.toString(),
                            actualText: mkey
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
                        }
                        else {
                            members[mkey].index.push(dl);
                        }
                        if (!formattedMembers.hasOwnProperty(fKey)) {
                            fmembersCnt++;
                            formattedMembers[fKey] = {
                                index: [dl], ordinal: fmembersCnt,
                                isDrilled: this.isExpandAll ? true : false
                            };
                        }
                        else {
                            formattedMembers[fKey].index.push(dl);
                        }
                    }
                    if (!(indMat[dl])) {
                        indMat[dl] = [];
                        indMat[dl][kl] = members[mkey].ordinal;
                    }
                    else {
                        indMat[dl][kl] = members[mkey].ordinal;
                    }
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
    fillDrilledInfo() {
        for (let key = 0; key < this.drilledMembers.length; key++) {
            let fieldName = this.drilledMembers[key].name;
            for (let mem = 0; mem < this.drilledMembers[key].items.length; mem++) {
                let memberName = this.drilledMembers[key].items[mem];
                let field = this.fieldList[fieldName];
                if (field && field.members[memberName]) {
                    field.members[memberName].isDrilled = this.isExpandAll ? false : true;
                }
            }
        }
    }
    generateValueMatrix(data) {
        let keys = this.fields;
        let len = data.length;
        let vMat = [];
        let keyLen = keys.length;
        let flList = this.fieldList;
        while (len--) {
            let record = data[len];
            let tkln = keyLen;
            //if (isNullOrUndefined(vMat[len])) {
            vMat[len] = [];
            //}
            while (tkln--) {
                let key = keys[tkln];
                vMat[len][tkln] = (flList[key].type === 'number') ? data[len][key] : 1;
            }
        }
        return vMat;
    }
    updateSortSettings(sortSettings, isSort) {
        for (let sln = 0, slt = sortSettings ? sortSettings.length : 0; sln < slt && isSort; sln++) {
            this.fieldList[sortSettings[sln].name].sort = sortSettings[sln].order;
        }
    }
    updateFilterMembers(source) {
        let filterRw = this.filterMembers;
        let list = {};
        //let eList: {[key: string] : number} = {};
        let isInclude = this.getFilters(source, list);
        //this.getFilterExcludeList(source.rows, flist);
        //this.getFilterExcludeList(source.columns, flist);
        //this.getFilterExcludeList(source.filters, flist);
        // let filters: Iterator = isInclude ? iList : eList;
        let dln = this.indexMatrix.length;
        if (isInclude) {
            let keys = list.include.index;
            for (let ln = 0; ln < keys.length; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[keys[ln]] === undefined) {
                    filterRw.push(keys[ln]);
                }
            }
        }
        else {
            for (let ln = 0; ln < dln; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[ln] === undefined) {
                    filterRw.push(ln);
                }
            }
        }
    }
    getFilters(source, ilist) {
        let filterElements = source.filterSettings ? source.filterSettings : [];
        let filters = this.filters;
        let isInclude = false;
        let filter = [];
        //let type: string;
        for (let rln = 0, rlt = filterElements.length; rln < rlt; rln++) {
            let filterElement = filterElements[rln].properties ?
                filterElements[rln].properties : filterElements[rln];
            if (this.fieldList[filterElement.name].isSelected && this.isValidFilterField(filterElement, source.allowLabelFilter)) {
                this.applyLabelFilter(filterElement);
                filter = filterElement ? filterElement.items : [];
                if (filterElement.type && filterElement.type === 'Include') {
                    /* tslint:disable-next-line:max-line-length */
                    this.frameFilterList(filter, filterElement.name, ilist, 'include', filterElement.showLabelFilter, isInclude);
                    isInclude = true;
                }
                else {
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
    isValidFilterField(filterElement, allowLabelFiltering) {
        let isValidFilterElement = false;
        let filterTypes = ['Include', 'Exclude'];
        let dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        if (this.fieldList[filterElement.name].isSelected && filterTypes.indexOf(filterElement.type) >= 0) {
            let isNotValidFilterElement = false;
            for (let field of this.values) {
                if (filterElement.name === field.name) {
                    isNotValidFilterElement = true;
                    break;
                }
            }
            if (!isNotValidFilterElement) {
                isValidFilterElement = true;
            }
        }
        else {
            for (let field of dataFields) {
                if (filterElement.name === field.name && allowLabelFiltering &&
                    (['Label', 'Date', 'Number'].indexOf(filterElement.type) >= 0)) {
                    isValidFilterElement = true;
                    break;
                }
            }
        }
        return isValidFilterElement;
    }
    applyLabelFilter(filterElement) {
        if (['Label', 'Date', 'Number'].indexOf(filterElement.type) >= 0) {
            let members = Object.keys(this.fieldList[filterElement.name].members);
            filterElement.showLabelFilter = true;
            if (filterElement.type === 'Label') {
                /* tslint:disable-next-line:max-line-length */
                filterElement.items = this.getLabelFilterMembers(members, filterElement.condition, filterElement.value1, filterElement.value2);
            }
            else if (filterElement.type === 'Date') {
                filterElement.showDateFilter = true;
                /* tslint:disable-next-line:max-line-length */
                filterElement.items = this.getDateFilterMembers(members, filterElement.name, filterElement.condition, filterElement.value1, filterElement.value2);
            }
            else {
                filterElement.showNumberFilter = true;
                filterElement.items = [];
                for (let member of members) {
                    let operand1 = this.getParsedValue(filterElement.name, filterElement.value1);
                    let operand2 = this.getParsedValue(filterElement.name, filterElement.value2);
                    let cValue = this.getParsedValue(filterElement.name, member);
                    /* tslint:disable-next-line:max-line-length */
                    if (this.validateFilterValue(cValue, filterElement.condition, operand1, operand2)) {
                        filterElement.items.push(member);
                    }
                }
            }
            let excludeOperators = ['DoesNotBeginWith', 'DoesNotContains', 'DoesNotEndsWith', 'DoesNotEquals', 'NotBetween'];
            filterElement.type = (excludeOperators.indexOf(filterElement.condition) > -1 &&
                !filterElement.showNumberFilter) ? 'Exclude' : 'Include';
        }
        else {
            filterElement.showLabelFilter = false;
        }
    }
    getLabelFilterMembers(members, operator, value1, value2) {
        let items = [];
        for (let member of members) {
            let filterValue = member.toLowerCase();
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
    getDateFilterMembers(members, name, operator, value1, value2) {
        let items = [];
        for (let member of members) {
            let filterValue = new Date(member);
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
    validateFilterValue(val, operator, value1, value2) {
        let isMemberInclude = false;
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
    frameFilterList(filter, name, list, type, isLabelFilter, isInclude) {
        let updateFilter = () => {
            let fln = 0;
            let field = this.fieldList[name];
            field.filter = filter;
            field.filterType = type;
            field.isExcelFilter = isLabelFilter;
            let members = (this.formatFields[name] &&
                (['date', 'dateTime', 'time'].indexOf(this.formatFields[name].type) > -1)) ?
                field.formattedMembers : field.members;
            let allowFil = isInclude;
            let final = {};
            let filterObj = {};
            final[type] = { indexObject: {}, index: [] };
            this.fieldFilterMem[name] = { memberObj: {} };
            while (filter[fln]) {
                let indx = members[filter[fln]].index;
                if (type === 'include') {
                    for (let iln = 0, ilt = indx.length; iln < ilt; iln++) {
                        if (!allowFil || list[type].indexObject[indx[iln]] !== undefined) {
                            final[type].indexObject[indx[iln]] = indx[iln];
                            final[type].index.push(indx[iln]);
                        }
                    }
                }
                else {
                    for (let iln = 0, ilt = indx.length; iln < ilt; iln++) {
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
                for (let iln = 0; iln < filter.length; iln++) {
                    filterObj[filter[iln]] = filter[iln];
                }
                let items = Object.keys(members);
                for (let iln = 0, ilt = items.length; iln < ilt; iln++) {
                    if (filterObj[items[iln]] === undefined) {
                        this.fieldFilterMem[name].memberObj[items[iln]] = items[iln];
                    }
                }
            }
        };
        if (!list[type]) {
            list[type] = { indexObject: {}, index: [] };
            updateFilter();
        }
        else {
            updateFilter();
        }
        // }
    }
    /* tslint:disable-next-line:max-line-length */
    applyValueFiltering(rowData, level, rows, columns, valueFilter, rowFilterData, type) {
        this.isValueFiltered = false;
        let allMember = extend({}, rows[rows.length - 1], null, true);
        this.getFilteredData(rows, columns, valueFilter, rowFilterData, level, rowData.name, allMember, type);
        if (this.isValueFiltered) {
            rowFilterData.push(allMember);
            rows = rowFilterData;
        }
        return rows;
    }
    /* tslint:disable-next-line:max-line-length */
    getFilteredData(rows, columns, filterSettings, rowFilterData, level, fieldName, allMember, type) {
        let rLen = rows.length;
        for (let i = 0; i < rLen; i++) {
            if (filterSettings[fieldName]) {
                if (rows[i].level === level) {
                    this.isValueFiltered = true;
                    this.fieldList[fieldName].isExcelFilter = true;
                    let value = 0;
                    let measure = filterSettings[fieldName].measure;
                    let mPos = this.fieldList[measure].index;
                    let aggregate = this.fieldList[measure].aggregateType;
                    value = (type === 'row' ? this.getAggregateValue(rows[i].index, columns.indexObject, mPos, aggregate) :
                        this.getAggregateValue(columns.index, rows[i].indexObject, mPos, aggregate));
                    let operand1 = this.getParsedValue(measure, filterSettings[fieldName].value1);
                    let operand2 = this.getParsedValue(measure, filterSettings[fieldName].value2);
                    /* tslint:disable-next-line:max-line-length */
                    if (!this.validateFilterValue(value, filterSettings[fieldName].condition, operand1, operand2) && rows[i].type !== 'grand sum') {
                        let data = this.removefilteredData(rows[i], this.valueFilteredData);
                        let row = data ? data : rows[i];
                        this.validateFilteredParentData(row, this.valueFilteredData, allMember, 0, level, type);
                    }
                    else if (rows[i].type !== 'grand sum') {
                        rowFilterData.push(extend({}, rows[i], null, true));
                        rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    }
                }
                else if (rows[i].hasChild && rows[i].members.length > 0 && rows[i].type !== 'grand sum') {
                    rowFilterData.push(extend({}, rows[i], null, true));
                    rowFilterData[rowFilterData.length - 1].members = [];
                    rowFilterData[rowFilterData.length - 1].isLevelFiltered = true;
                    /* tslint:disable-next-line:max-line-length */
                    this.getFilteredData(rows[i].members, columns, filterSettings, rowFilterData[rowFilterData.length - 1].members, level, fieldName, allMember, type);
                }
            }
        }
    }
    getParsedValue(measure, value) {
        let cValue = value ? value.toString() : '';
        if (this.formatFields[measure] && value) {
            let formatSetting = extend({}, this.formatFields[measure], null, true);
            delete formatSetting.name;
            return this.globalize.parseNumber(cValue, formatSetting);
        }
        else {
            return this.globalize.parseNumber(cValue, { format: 'N' });
        }
    }
    removefilteredData(row, rowFilterData) {
        let rows = extend([], rowFilterData, null, true);
        let filteredData;
        for (let i = 0; i < rows.length; i++) {
            if (row.isLevelFiltered && row.axis === rows[i].axis &&
                row.valueSort.levelName === rows[i].valueSort.levelName &&
                row.actualText === rows[i].actualText && row.axis === rows[i].axis &&
                row.level === rows[i].level && row.ordinal === rows[i].ordinal) {
                filteredData = rows[i];
                rowFilterData.splice(i, 1);
                break;
            }
            else if (rowFilterData[i].hasChild && rowFilterData[i].members.length > 0) {
                this.removefilteredData(row, rowFilterData[i].members);
            }
        }
        return filteredData;
    }
    /* tslint:disable-next-line:max-line-length */
    validateFilteredParentData(row, rows, allMemberData, i, level, type) {
        if (rows.length > 0) {
            for (let rowFilteredData of rows) {
                if (rowFilteredData.level === i) {
                    if (type === 'row') {
                        let index = row.index;
                        for (let key of index) {
                            if (allMemberData.index.indexOf(key) >= 0) {
                                allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                            }
                            if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                rowFilteredData.level !== level && rowFilteredData.index.indexOf(key) >= 0) {
                                rowFilteredData.index.splice(rowFilteredData.index.indexOf(key), 1);
                            }
                        }
                    }
                    else {
                        let index = row.indexObject;
                        for (let key of Object.keys(index)) {
                            if (index.hasOwnProperty(key)) {
                                delete allMemberData.indexObject[key];
                                if (((row.valueSort.levelName.toString()).indexOf(rowFilteredData.valueSort.levelName.toString()) >= 0) &&
                                    rowFilteredData.level !== level) {
                                    delete rowFilteredData.indexObject[key];
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
        }
        else {
            if (type === 'row') {
                let index = row.index;
                for (let key of index) {
                    if (allMemberData.index.indexOf(key) >= 0) {
                        allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                    }
                }
            }
            else {
                let index = row.indexObject;
                for (let key of Object.keys(index)) {
                    if (index.hasOwnProperty(key)) {
                        delete allMemberData.indexObject[key];
                    }
                }
            }
        }
    }
    /* tslint:disable-next-line:max-line-length */
    updateFramedHeaders(framedHeaders, dataHeaders, filteredHeaders, headers, type) {
        for (let dHeader of framedHeaders) {
            this.isHeaderAvail = false;
            if (this.validateFilteredHeaders(dHeader, filteredHeaders, type) || dHeader.type === 'grand sum') {
                if (type === 'row') {
                    this.rowCount += this.rowValuesLength;
                }
                else {
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
    validateFilteredHeaders(dHeader, filteredHeaders, type) {
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
                        }
                        else {
                            this.isHeaderAvail = false;
                            dHeader.index = vHeader.index;
                            return false;
                        }
                    }
                    else {
                        if (Object.keys(vHeader.indexObject).length > 0) {
                            this.isHeaderAvail = true;
                            dHeader.indexObject = vHeader.indexObject;
                            return true;
                        }
                        else {
                            this.isHeaderAvail = false;
                            dHeader.indexObject = vHeader.indexObject;
                            return false;
                        }
                    }
                }
                else if (vHeader.hasChild && vHeader.members.length > 0 && vHeader.type !== 'grand sum') {
                    this.validateFilteredHeaders(dHeader, vHeader.members, type);
                }
            }
        }
        return this.isHeaderAvail;
    }
    isEmptyDataAvail(rowHeaders, columnHeaders) {
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
    updateGridData(dataSource) {
        this.indexMatrix = [];
        for (let field of this.fields) {
            this.fieldList[field].members = {};
            this.fieldList[field].formattedMembers = {};
            this.fieldList[field].dateMember = [];
        }
        this.fillFieldMembers(dataSource.data, this.indexMatrix);
        this.valueMatrix = this.generateValueMatrix(dataSource.data);
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
    generateGridData(dataSource, headerCollection) {
        let keys = this.fields;
        let columns = dataSource.columns ? dataSource.columns : [];
        let data = dataSource.data;
        let rows = dataSource.rows ? dataSource.rows : [];
        let filterSettings = dataSource.filterSettings;
        let values = dataSource.values ? dataSource.values : [];
        this.removeCount = 0;
        this.isExpandAll = dataSource.expandAll;
        this.drilledMembers = dataSource.drilledMembers ? dataSource.drilledMembers : [];
        this.isEmptyData = false;
        let filterMembers = [];
        let showNoDataItems = (rows[0] && rows[0].showNoDataItems) || (columns[0] && columns[0].showNoDataItems);
        if (showNoDataItems) {
            for (let ln = 0; ln < this.indexMatrix.length; ln++) {
                filterMembers.push(ln);
            }
        }
        for (let ln = 0; ln < this.filterMembers.length; ln++) {
            this.filterPosObj[this.filterMembers[ln]] = this.filterMembers[ln];
        }
        //let childrens: Field = this.fieldList[rows[0].name + ''];
        this.valueSortSettings.columnIndex = undefined;
        let st1 = new Date().getTime();
        if (!this.isValueFilterEnabled || this.isEditing) {
            if (!headerCollection || this.enableValueSorting) {
                this.columnCount = 0;
                this.rowCount = 0;
                this.cMembers = [];
                this.rMembers = [];
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
                rowHeaders: extend([], this.rMembers, null, true),
                columnHeaders: extend([], this.cMembers, null, true)
            } : {};
        }
        this.pivotValues = [];
        this.headerContent = [];
        this.valueContent = [];
        this.valueFilteredData = [];
        this.filterFramedHeaders = [];
        let rowheads = [];
        let colheads = [];
        let rowFilteredData = [];
        let columnFilteredData = [];
        let valuesCount = (this.values.length);
        if ((this.isValueFiltersAvail && dataSource.allowValueFilter)) {
            this.valueFilteredData = [];
            let rowHeaders = this.saveDataHeaders.rowHeaders;
            let columnHeaders = this.saveDataHeaders.columnHeaders;
            if (filterSettings.length > 0) {
                let valueFilters = {};
                let valueFields = {};
                for (let value of values) {
                    valueFields[value.name] = value;
                }
                for (let filter of filterSettings) {
                    rowHeaders = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
                    columnHeaders = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
                    this.valueFilteredData = [];
                    let filterElement = filter.properties ?
                        filter.properties : filter;
                    if (filterElement.type === 'Value' && this.fieldList[filter.name].isSelected) {
                        valueFilters[filter.name] = filter;
                        filterElement.items = [];
                        let isAvail = false;
                        let rLen = rows.length;
                        let cLen = columns.length;
                        for (let i = 0; i < rLen; i++) {
                            if (filterElement.name === rows[i].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                /* tslint:disable-next-line:max-line-length */
                                rowFilteredData = this.applyValueFiltering(rows[i], i, rowHeaders, columnHeaders[columnHeaders.length - 1], valueFilters, this.valueFilteredData, 'row');
                                break;
                            }
                        }
                        for (let j = 0; j < cLen; j++) {
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
            let savedFieldList = extend({}, this.fieldList, null, true);
            this.indexMatrix = [];
            let fields = dataSource.data[0];
            this.getFieldList(fields, this.enableSort, dataSource.allowValueFilter);
            this.fillFieldMembers(dataSource.data, this.indexMatrix);
            this.updateSortSettings(dataSource.sortSettings, this.enableSort);
            this.valueMatrix = this.generateValueMatrix(dataSource.data);
            this.filterMembers = [];
            this.updateFilterMembers(dataSource);
            this.rMembers = rows.length !== 0 ?
                this.getIndexedHeaders(rows, data, 0, rows[0].showNoDataItems ?
                    filterMembers : this.filterMembers, 'row', '') : this.rMembers;
            this.cMembers = columns.length !== 0 ?
                this.getIndexedHeaders(columns, data, 0, columns[0].showNoDataItems ?
                    filterMembers : this.filterMembers, 'column', '') : this.cMembers;
            this.insertAllMembersCommon();
            this.updateFieldList(savedFieldList);
            this.rowCount = 0;
            this.columnCount = 0;
            this.rMembers = this.updateFramedHeaders(this.rMembers, this.rMembers, rowFilteredData, this.filterFramedHeaders, 'row');
            this.filterFramedHeaders = [];
            this.cMembers = this.updateFramedHeaders(this.cMembers, this.cMembers, columnFilteredData, this.filterFramedHeaders, 'column');
            this.isValueFilterEnabled = true;
        }
        this.applyValueSorting();
        if (this.pageSettings) {
            if (!headerCollection || this.enableValueSorting) {
                this.headerCollection.rowHeaders = extend([], this.rMembers, null, true);
                this.headerCollection.columnHeaders = extend([], this.cMembers, null, true);
                this.headerCollection.rowHeadersCount = this.rowCount;
                this.headerCollection.columnHeadersCount = this.columnCount;
            }
            else {
                this.rMembers = headerCollection.rowHeaders;
                this.cMembers = headerCollection.columnHeaders;
                this.rowCount = headerCollection.rowHeadersCount;
                this.columnCount = headerCollection.columnHeadersCount;
                if (this.columns.length > 1 || this.rows.length > 1 || this.allowValueFilter) {
                    this.headerCollection = extend({}, headerCollection, null, true);
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
                this.rMembers = this.insertTotalPosition(this.rMembers);
                this.cMembers = this.insertTotalPosition(this.cMembers);
            }
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
        if (this.pageSettings) {
            this.removeIndexProperties();
        }
        this.isEngineUpdated = true;
        let st2 = new Date().getTime();
        //  console.log(st1 - st2);
    }
    /* tslint:enable */
    applyValueSorting() {
        if (this.valueSortSettings.headerText && this.valueSortSettings.headerText !== '' && this.values.length > 0) {
            let textArray = this.valueSortSettings.headerText.split(this.valueSortSettings.headerDelimiter);
            let hText = '';
            let mIndex;
            let mType;
            let caption;
            for (let i = 0; i < this.values.length; i++) {
                if (this.values[i].caption === textArray[textArray.length - 1]) {
                    caption = this.values[i].name;
                    break;
                }
                else {
                    caption = textArray[textArray.length - 1];
                }
            }
            if (this.values.length > 1 && caption && this.fieldList[caption]) {
                for (let i = 0; i < textArray.length - 1; i++) {
                    hText = hText === '' ? textArray[i] : (hText + this.valueSortSettings.headerDelimiter + textArray[i]);
                }
                mIndex = this.fieldList[caption].index;
                mType = this.fieldList[caption].aggregateType;
            }
            else {
                hText = this.valueSortSettings.headerText;
                mIndex = this.fieldList[this.values[0].name].index;
                mType = this.fieldList[this.values[0].name].aggregateType;
            }
            let member;
            if (this.valueAxis === 0) {
                member = this.getMember(this.cMembers, hText);
                if (member) {
                    this.sortByValueRow(this.rMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            }
            else {
                member = this.getMember(this.rMembers, hText);
                if (member) {
                    this.sortByValueRow(this.cMembers, member, this.valueSortSettings.sortOrder, mIndex, mType);
                }
            }
        }
    }
    getMember(cMembers, headerText) {
        let vlen = cMembers.length;
        let member;
        for (let j = 0; j < vlen; j++) {
            if (cMembers[j].valueSort.levelName === headerText) {
                member = cMembers[j];
                break;
            }
            else if (cMembers[j].members.length > 0) {
                member = this.getMember(cMembers[j].members, headerText);
            }
            if (member) {
                return member;
            }
        }
        return member;
    }
    sortByValueRow(rMembers, member, sortOrder, mIndex, mType) {
        let sort = false;
        let vlen = rMembers.length;
        for (let j = 0; j < vlen; j++) {
            for (let k = j; k < vlen && rMembers[j].type !== 'grand sum' && rMembers[k].type !== 'grand sum'; k++) {
                if (sortOrder === 'Descending') {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) <
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                }
                else {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) >
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                }
                if (sort) {
                    let temp = {};
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
    insertAllMembersCommon() {
        /* inserting the row grant-total members */
        let rowFlag = (this.showGrandTotals && this.showRowGrandTotals) ? true : (this.rows.length > 0) ? false : true;
        if (rowFlag) {
            this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
        }
        /* inserting the column gran-total members */
        let columnFlag = (this.showGrandTotals && this.showColumnGrandTotals) ? true : (this.columns.length > 0) ? false : true;
        if (columnFlag) {
            this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
        }
    }
    removeIndexProperties() {
        for (let rCnt = 0; rCnt < this.headerContent.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                for (let cCnt = 0; cCnt < Object.keys(this.headerContent[rCnt]).length; cCnt++) {
                    let key = Number(Object.keys(this.headerContent[rCnt])[cCnt]);
                    this.headerContent[rCnt][key].index = [];
                    this.headerContent[rCnt][key].indexObject = {};
                    this.pivotValues[rCnt][key].index = [];
                    this.pivotValues[rCnt][key].indexObject = {};
                }
            }
        }
        for (let rCnt = this.headerContent.length; rCnt < this.pivotValues.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                this.valueContent[rCnt - this.headerContent.length][0].index = [];
                this.valueContent[rCnt - this.headerContent.length][0].indexObject = {};
                this.pivotValues[rCnt][0].index = [];
                this.pivotValues[rCnt][0].indexObject = {};
            }
        }
    }
    insertSubTotals() {
        let rowLength = this.pivotValues.length;
        for (let rowCnt = 0; rowCnt < rowLength; rowCnt++) {
            let rowCells = this.pivotValues[rowCnt];
            if (rowCells) {
                let savedCell;
                let spanCnt = 1;
                let colLength = rowCells.length;
                let indexObj;
                for (let colCnt = colLength - 1; colCnt > 0; colCnt--) {
                    let cell = rowCells[colCnt];
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
                        let rowPos = rowCnt + 1;
                        while (this.pivotValues[rowPos] && !this.pivotValues[rowPos][colCnt]) {
                            if (!this.pivotValues[rowCnt][colCnt].isDrilled) {
                                this.pivotValues[rowCnt][colCnt].rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            }
                            let cellType = (cell.type === 'sum' || cell.type === 'grand sum') ? cell.type : 'sum';
                            this.pivotValues[rowPos][colCnt] = this.headerContent[rowPos][colCnt] = {
                                type: cellType, formattedText: ((cell.type === 'sum' || cell.type === 'grand sum') ? cell.formattedText :
                                    (cell.formattedText + ' Total')),
                                axis: 'column', level: -1, colIndex: colCnt, rowIndex: rowPos, valueSort: cell.valueSort
                            };
                            if (cell.valueSort && cell.valueSort[this.valueSortSettings.headerText]) {
                                this.valueSortSettings.columnIndex = colCnt;
                            }
                            let isSpanned = false;
                            if (cellType === 'grand sum') {
                                this.pivotValues[rowCnt][colCnt].rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            }
                            else if (this.pivotValues[rowCnt][colCnt].type !== 'sum' &&
                                this.pivotValues[rowCnt][colCnt].isDrilled) {
                                this.pivotValues[rowCnt + 1][colCnt].rowSpan = rowPos - rowCnt;
                                isSpanned = true;
                            }
                            else {
                                this.pivotValues[rowPos][colCnt].rowSpan = -1;
                            }
                            if (rowPos > (rowCnt + 1) && (this.pivotValues[rowCnt][colCnt].type === 'sum' ||
                                isSpanned)) {
                                this.pivotValues[rowPos][colCnt].rowSpan = -1;
                            }
                            rowPos++;
                        }
                        spanCnt = 1;
                    }
                    else {
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
    getIndexedHeaders(keys, data, keyInd, position, axis, parentMember) {
        let hierarchy = [];
        let showPosition = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
        if (keys) {
            let rlen = keys.length;
            let decisionObj = {};
            let fieldName = keys[keyInd].name;
            let field = keys[keyInd];
            // let members: string[] = Object.keys(this.fieldList[field].members);
            let childrens = this.fieldList[fieldName];
            let index = {};
            let isNoData = false;
            let isDateType = (this.formatFields[fieldName] &&
                (['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName].type) > -1));
            let showNoDataItems = (position.length < 1 && keyInd > 0) || field.showNoDataItems;
            let savedMembers = {};
            if (showNoDataItems) {
                let members = Object.keys(childrens.members);
                for (let pos = 0, lt = members.length; pos < lt; pos++) {
                    savedMembers[members[pos]] = members[pos];
                }
                if (position.length < 1) {
                    isNoData = true;
                    position.length = members.length;
                }
            }
            for (let pos = 0, lt = position.length; pos < lt; pos++) {
                let member = {};
                if (!isNullOrUndefined(keys[keyInd].showSubTotals) && !keys[keyInd].showSubTotals) {
                    member.showSubTotals = false;
                }
                member.hasChild = keyInd < rlen - 1;
                member.level = keyInd;
                member.axis = axis;
                member.colSpan = 1;
                let memInd = isNoData ? childrens.members[Object.keys(savedMembers)[0]].ordinal :
                    this.indexMatrix[position[pos]][childrens.index];
                let headerValue = isNoData ? Object.keys(savedMembers)[0] :
                    data[position[pos]][fieldName];
                if (isNullOrUndefined(headerValue)) {
                    continue;
                }
                delete savedMembers[headerValue];
                if (showNoDataItems && this.fieldFilterMem[fieldName] &&
                    this.fieldFilterMem[fieldName].memberObj[headerValue] === headerValue) {
                    continue;
                }
                member.isDrilled = member.hasChild ? childrens.members[headerValue].isDrilled : false;
                let formattedValue = isDateType ?
                    this.getFormattedValue(headerValue, fieldName) : { formattedText: headerValue.toString(), actualText: headerValue };
                member.actualText = formattedValue.actualText;
                member.formattedText = formattedValue.formattedText;
                if (isDateType) {
                    member.dateText = formattedValue.dateText;
                }
                let availData = showNoDataItems ? (this.filterPosObj[position[pos]] !== undefined &&
                    !isNoData ? true : false) : true;
                //member.name = members[memInd];
                // member.type = member.hasChild ? 'All' : 'Single';
                if (!(decisionObj && decisionObj[memInd])) {
                    decisionObj[memInd] = { index: [], indexObject: {} };
                    member.index = decisionObj[memInd].index;
                    member.indexObject = decisionObj[memInd].indexObject;
                    if (availData) {
                        if (showPosition) {
                            member.index = decisionObj[memInd].index = [position[pos]];
                            decisionObj[memInd].indexObject[position[pos]] = position[pos];
                            member.indexObject = decisionObj[memInd].indexObject;
                        }
                        else {
                            index[memInd] = [position[pos]];
                        }
                    }
                    member.ordinal = memInd;
                    member.valueSort = {};
                    if (showPosition) {
                        member.valueSort.axis = fieldName;
                        if (keyInd !== 0) {
                            member.valueSort.levelName = parentMember + this.valueSortSettings.headerDelimiter + member.formattedText;
                            member.valueSort[parentMember + this.valueSortSettings.headerDelimiter + member.formattedText] = 1;
                        }
                        else {
                            member.valueSort[member.formattedText] = 1;
                            member.valueSort.levelName = member.formattedText;
                        }
                    }
                    //if (!member.members) {
                    member.members = [];
                    //}
                    //let copyObj: AxisSet = Object.create(member);
                    hierarchy.push(member);
                }
                else if (availData) {
                    if (showPosition) {
                        decisionObj[memInd].index.push(position[pos]);
                        decisionObj[memInd].indexObject[position[pos]] = position[pos];
                    }
                    else {
                        if (index[memInd] === undefined) {
                            index[memInd] = [position[pos]];
                        }
                        else {
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
            for (let iln = 0, ilt = hierarchy.length; iln < ilt; iln++) {
                if (axis === 'row') {
                    this.rowCount += this.rowValuesLength;
                }
                else {
                    this.columnCount += this.colValuesLength;
                }
                if (rlen - 1 > keyInd && hierarchy[iln].isDrilled) {
                    if (showPosition) {
                        let level = null;
                        if (hierarchy[iln].valueSort && hierarchy[iln].valueSort.levelName) {
                            level = hierarchy[iln].valueSort.levelName;
                        }
                        parentMember = (level || hierarchy[iln].formattedText);
                    }
                    let filterPosition = !showPosition ? index[hierarchy[iln].ordinal] : hierarchy[iln].index;
                    /* tslint:disable:align */
                    hierarchy[iln].members = this.getIndexedHeaders(keys, data, keyInd + 1, (filterPosition === undefined ? [] : filterPosition), axis, parentMember);
                    /* tslint:enable:align */
                }
            }
            /* tslint:disable:typedef */
            if (this.enableSort) {
                // return new DataManager(hierarchy as JSON[]).executeLocal(new Query().sortBy('actualText', childrens.sort.toLowerCase()));
                if (isDateType) {
                    return childrens.sort === 'Ascending' ?
                        (hierarchy.sort((a, b) => (a.dateText > b.dateText) ? 1 : ((b.dateText > a.dateText) ? -1 : 0))) :
                        (hierarchy.sort((a, b) => (a.dateText < b.dateText) ? 1 : ((b.dateText < a.dateText) ? -1 : 0)));
                }
                else {
                    return childrens.sort === 'Ascending' ?
                        (hierarchy.sort((a, b) => (a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0))) :
                        (hierarchy.sort((a, b) => (a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0)));
                }
            }
            else {
                return hierarchy;
            }
            /* tslint:enable:typedef */
        }
        else {
            return hierarchy;
        }
    }
    getOrderedIndex(headers) {
        let orderedIndex = {};
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].type !== 'grand sum') {
                orderedIndex[headers[i].ordinal] = i;
            }
        }
        return orderedIndex;
    }
    insertPosition(keys, data, keyInd, position, axis, parentMember, slicedHeaders) {
        let hierarchy = [];
        let orderedIndex = this.getOrderedIndex(slicedHeaders);
        if (keys) {
            let decisionObj = {};
            let field = keys[keyInd].name;
            let childrens = this.fieldList[field];
            for (let pos = 0, lt = position.length; pos < lt; pos++) {
                let member = {};
                let memInd = this.indexMatrix[position[pos]][childrens.index];
                let slicedHeader = slicedHeaders[orderedIndex[memInd]];
                let formattedValue = (this.formatFields[field] &&
                    (['date', 'dateTime', 'time'].indexOf(this.formatFields[field].type) > -1)) ?
                    this.getFormattedValue(data[position[pos]][field], field) :
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
                    }
                    else {
                        slicedHeader.valueSort[slicedHeader.formattedText] = 1;
                        slicedHeader.valueSort.levelName = slicedHeader.formattedText;
                    }
                    member.members = [];
                    hierarchy.push(member);
                }
                else {
                    decisionObj[memInd].index.push(position[pos]);
                    decisionObj[memInd].indexObject[position[pos]] = position[pos];
                }
            }
            let diff = slicedHeaders.length - hierarchy.length;
            while (diff > 0) {
                hierarchy.push({ members: [] });
                diff--;
            }
            for (let iln = 0, ilt = hierarchy.length; iln < ilt; iln++) {
                if (slicedHeaders[iln].members.length > 0) {
                    let level = null;
                    if (slicedHeaders[iln].valueSort && slicedHeaders[iln].valueSort.levelName) {
                        level = slicedHeaders[iln].valueSort.levelName;
                    }
                    parentMember = (level || slicedHeaders[iln].formattedText);
                    /* tslint:disable:align */
                    hierarchy[iln].members =
                        this.insertPosition(keys, data, keyInd + 1, slicedHeaders[iln].index, axis, parentMember, slicedHeaders[iln].members);
                    /* tslint:enable:align */
                }
            }
            return hierarchy;
        }
        else {
            return hierarchy;
        }
    }
    insertTotalPosition(headers) {
        let summCell = headers[headers.length - 1];
        if (summCell && summCell.type === 'grand sum') {
            summCell.index = this.filterMembers;
            /* tslint:disable:typedef */
            for (let ln = 0, lt = this.filterMembers.length; ln < lt; ln++) {
                summCell.indexObject[this.filterMembers[ln]] = this.filterMembers[ln];
            }
            /* tslint:enable:typedef */
        }
        return headers;
    }
    calculatePagingValues() {
        let isValueSorting = ((this.valueSortSettings.sortOrder !== 'None' &&
            this.valueSortSettings.headerText !== '') || this.enableValueSorting) ? true : false;
        if (this.pageSettings) {
            if (this.valueAxis === 1) {
                this.rowValuesLength = this.values.length;
            }
            else {
                this.colValuesLength = this.values.length;
            }
            this.memberCnt = -this.rowValuesLength;
            this.rowStartPos = ((this.pageSettings.rowCurrentPage * this.pageSettings.rowSize) -
                (this.pageSettings.rowSize)) * this.rowValuesLength;
            let exactStartPos = (this.rowStartPos + (this.pageSettings.rowSize * 3 * this.rowValuesLength)) > this.rowCount ?
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
            this.memberCnt = -this.colValuesLength;
            this.pageInLimit = false;
            this.colHdrBufferCalculated = false;
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
            this.memberCnt = -1;
            this.pageInLimit = false;
        }
    }
    performSlicing(headers, slicedHeaders, startPos, axis) {
        let pos = 0;
        while (headers[pos]) {
            this.memberCnt += axis === 'column' ? this.colValuesLength : this.rowValuesLength;
            if (startPos <= this.memberCnt && this.endPos >= this.memberCnt && !this.pageInLimit) {
                if (axis === 'column') {
                    this.colFirstLvl = this.colFirstLvl + headers[pos].level;
                }
                else {
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
                        }
                        else if (this.colHdrBufferCalculated) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            let members = headers[pos].members;
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
    insertAllMember(set, filter, customText, axis) {
        let len = set.length;
        let showPosition = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
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
            for (let ln = 0, lt = filter.length; ln < lt; ln++) {
                set[len].indexObject[filter[ln]] = filter[ln];
            }
        }
        if (axis === 'row') {
            this.rowCount += this.rowValuesLength;
        }
        else {
            this.columnCount += this.colValuesLength;
        }
    }
    /* tslint:disable-next-line:max-line-length */
    getTableData(rows, reformAxis, columns, tnum, data, vlt, rTotal, cTotal) {
        for (let rlt = rows.length, rln = 0; rln < rlt; rln++) {
            tnum = data.length;
            reformAxis[tnum] = rows[rln];
            let actCnt = tnum - Number(Object.keys(reformAxis)[0]);
            //let rplus: number = rln + 1;
            //let lvl: number = rows[rln].level;
            let isLeastNode = !reformAxis[tnum].members.length;
            rows[rln].colIndex = 0;
            rows[rln].rowIndex = tnum;
            if (!data[tnum]) {
                data[tnum] = [];
                this.valueContent[actCnt] = {};
                //data[tnum][0] = rows[rln].name;
                data[tnum][0] = this.valueContent[actCnt][0] = rows[rln];
            }
            else {
                // data[tnum][0] = rows[rln].name;
                data[tnum][0] = this.valueContent[actCnt][0] = rows[rln];
            }
            if (this.valueAxis && this.isMutiMeasures && !(rows[rln].isDrilled &&
                ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                    !this.showSubTotals || !this.showRowSubTotals))) {
                let hpos = tnum;
                let actpos = actCnt;
                for (let vln = 0; vln < vlt; vln++) {
                    tnum++;
                    actCnt++;
                    let name = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj = {
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
                        this.valueContent[actCnt] = {};
                        data[tnum][0] = this.valueContent[actCnt][0] = calObj;
                    }
                    let vData = data[tnum][0].valueSort;
                    vData[data[tnum - vln - 1][0].valueSort.levelName + this.valueSortSettings.headerDelimiter + name] = 1;
                    vData.levelName = data[tnum - vln - 1][0].valueSort.levelName + this.valueSortSettings.headerDelimiter
                        + name;
                    for (let cln = 0, dln = 1, clt = columns.length; cln < clt; ++cln) {
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
            }
            else {
                for (let cln = 0, dln = 1, clt = columns.length; cln < clt; ++cln) {
                    for (let vln = 0; vln < vlt; vln++) {
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
    getAggregatedHeaders(rows, columns, rMembers, cMembers, values) {
        this.selectedHeaders = { selectedHeader: [], values: [] };
        for (let vlt = values.length, vln = 0; vln < vlt; vln++) {
            switch (values[vln].type) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        let baseField;
                        let baseItem;
                        this.selectedHeaders.values.push(values[vln].name);
                        if (values[vln].baseField && values[vln].baseItem) {
                            baseField = values[vln].baseField;
                            baseItem = values[vln].baseItem;
                        }
                        else if (this.valueAxis && this.isMutiMeasures && columns.length > 0) {
                            baseField = columns[0].name;
                            baseItem = Object.keys(this.fieldList[columns[0].name].members)[0];
                        }
                        else if (rows.length > 0) {
                            baseField = rows[0].name;
                            baseItem = Object.keys(this.fieldList[rows[0].name].members)[0];
                        }
                        let isHeaderSelected = false;
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
                        this.getAggregatedHeaderData((this.valueAxis && this.isMutiMeasures ? cMembers : rMembers), values[vln].name, undefined, false, (this.valueAxis && this.isMutiMeasures ? 'column' : 'row'), values[vln].type, this.selectedHeaders.selectedHeader, vln);
                    }
                    break;
                case 'PercentageOfParentTotal':
                    {
                        let baseField;
                        this.selectedHeaders.values.push(values[vln].name);
                        if (values[vln].baseField) {
                            baseField = values[vln].baseField;
                        }
                        else if (this.valueAxis && this.isMutiMeasures && columns.length > 0) {
                            baseField = columns[0].name;
                        }
                        else if (rows.length > 0) {
                            baseField = rows[0].name;
                        }
                        let isHeaderSelected = false;
                        for (let len = rows.length, i = 0; i < len; i++) {
                            if (rows[i].name === baseField) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rMembers, values[vln].name, undefined, false, 'row', values[vln].type, this.selectedHeaders.selectedHeader, vln, i);
                                isHeaderSelected = true;
                                break;
                            }
                        }
                        if (!isHeaderSelected) {
                            for (let len = columns.length, i = 0; i < len; i++) {
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
    getAggregatedHeaderData(headers, name, baseItem, isChildren, type, aggregateType, selectedHeaders, vln, level) {
        for (let rln of headers) {
            switch (aggregateType) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        let levelName = rln.valueSort.levelName.toString().split('.');
                        if (levelName.indexOf(baseItem) !== -1) {
                            /* tslint:disable-next-line:max-line-length */
                            selectedHeaders.push(this.updateSelectedHeaders(baseItem, rln.level, type, isChildren, name, aggregateType, rln.valueSort.levelName, (isChildren ? [rln] : headers), vln + 1));
                            if (rln.members.length > 0) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rln.members, name, baseItem, true, type, aggregateType, selectedHeaders[selectedHeaders.length - 1].childMembers, vln);
                            }
                        }
                        else if (rln.members.length > 0) {
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
                            selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName, headers, vln + 1));
                        }
                        else {
                            if (rln.members.length > 0) {
                                /* tslint:disable-next-line:max-line-length */
                                selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName, rln.members, vln + 1));
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
                                        let aggregateHeaders = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                        for (let member of rln.members) {
                                            aggregateHeaders.push(member);
                                        }
                                    }
                                    else {
                                        let children = extend([], rln.members, null, true);
                                        /* tslint:disable-next-line:max-line-length */
                                        selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName, children, vln + 1));
                                        let aggregateHeaders = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                        aggregateHeaders.push(rln);
                                    }
                                    /* tslint:disable-next-line:max-line-length */
                                    this.getAggregatedHeaderData(rln.members, name, undefined, true, type, aggregateType, selectedHeaders, vln, level + 1);
                                }
                                else {
                                    if (!isChildren) {
                                        /* tslint:disable-next-line:max-line-length */
                                        selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName, [rln], vln + 1));
                                    }
                                }
                            }
                            else if (rln.members.length > 0) {
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
    updateSelectedHeaders(baseItem, level, type, isChildren, name, aggregateType, levelName, headers, vCount) {
        let headerData = {
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
    applyAdvancedAggregate(rowheads, colheads, data) {
        if (this.selectedHeaders.values.length > 0) {
            let pivotIndex = {};
            let colIndex = [];
            let isIndexFilled = false;
            for (let rlt = data.length, rln = 0; rln < rlt; rln++) {
                if (data[rln] !== undefined && data[rln][0] !== undefined) {
                    if (!isIndexFilled) {
                        for (let clt = data[rln].length, cln = 0; cln < clt; cln++) {
                            if (data[rln][cln].axis === 'value' &&
                                this.selectedHeaders.values.indexOf(data[rln][cln].actualText) !== -1) {
                                colIndex.push(cln);
                                isIndexFilled = true;
                            }
                        }
                    }
                    if (colIndex.length > 0 && data[rln][colIndex[0]].axis === 'value' &&
                        this.selectedHeaders.values.indexOf(data[rln][colIndex[0]].actualText) !== -1) {
                        for (let index of colIndex) {
                            pivotIndex[rln + ',' + index] = [rln, index];
                        }
                    }
                }
            }
            this.updateAggregates(rowheads, colheads, data, this.selectedHeaders.selectedHeader, colIndex, pivotIndex);
            let indexCollection = Object.keys(pivotIndex);
            for (let index of indexCollection) {
                let currentSet = data[pivotIndex[index][0]][pivotIndex[index][1]];
                // currentSet.formattedText = '0';
                currentSet.formattedText = (this.selectedHeaders.selectedHeader.length > 0 ? '0' : '#N/A');
            }
        }
        else {
            return;
        }
    }
    /* tslint:disable:all */
    updateAggregates(rowheads, colheads, data, selectedHeaders, colIndex, pivotIndex) {
        for (let headers of selectedHeaders) {
            let selectedHeaderCollection = headers.aggregateHeaders;
            let name = headers.value;
            let valueCount = (this.valueAxis && this.isMutiMeasures ? headers.valueCount : 0);
            let aggregateType = headers.type;
            let uniqueName = headers.uniqueName;
            let axis = headers.axis;
            let isRowBaseField = axis === 'row' ? true : false;
            let activeValues;
            let indexCollection = [];
            let activeColumn = [];
            let columnHeaders = [];
            let rowindexCollection = [];
            let selectedRowValues = [];
            let selectedColumnValues = [];
            if ((['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal', 'RunningTotals']).indexOf(headers.type) !== -1) {
                if (isRowBaseField) {
                    if (headers.type !== 'RunningTotals') {
                        for (let rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
                            if (rowheads[rln] !== undefined) {
                                if (rowheads[rln].valueSort[uniqueName]) {
                                    activeValues = rowheads[rln];
                                    selectedRowValues = data[rln + valueCount];
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    for (let len = data.length, i = 0; i < len; i++) {
                        if (data[i] !== undefined && data[i][0] === undefined) {
                            columnHeaders.push(data[i]);
                        }
                        else {
                            break;
                        }
                    }
                    let len = columnHeaders.length;
                    while (len--) {
                        let axisObj = columnHeaders[len][colIndex[0]];
                        let cLevelName = axisObj.actualText;
                        if (this.selectedHeaders.values.indexOf(cLevelName) === -1) {
                            activeColumn = columnHeaders[len];
                            len = 0;
                        }
                    }
                    if (headers.type !== 'RunningTotals') {
                        for (let clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                            let isSelectedColumn = false;
                            if (activeColumn[cln] !== undefined && activeColumn[cln].valueSort[uniqueName]) {
                                activeValues = activeColumn[cln];
                                for (let len = data.length, i = 0; i < len; i++) {
                                    let axisObj = data[i];
                                    if (axisObj !== undefined && axisObj[0] !== undefined &&
                                        axisObj[cln].axis === 'value' &&
                                        this.selectedHeaders.values.indexOf(axisObj[cln].actualText) !== -1) {
                                        isSelectedColumn = true;
                                        selectedColumnValues[i] = axisObj[cln];
                                        rowindexCollection.push(i);
                                    }
                                }
                                if (isSelectedColumn) {
                                    break;
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
                        let isChildren = headers.isChild;
                        if (isRowBaseField) {
                            if (!isChildren) {
                                for (let item of selectedHeaderCollection) {
                                    for (let rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
                                        if (rowheads[rln] !== undefined) {
                                            if (rowheads[rln].valueSort[item.valueSort.levelName] &&
                                                rowheads[rln].level === activeValues.level && rowheads[rln].type !== 'grand sum') {
                                                for (let index of colIndex) {
                                                    let currentSet = data[rln + valueCount][index];
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
                            }
                            else {
                                let uniqueLevelName = uniqueName.split('.');
                                for (let rlt = rowheads.length, rlen = 0; rlen < rlt; rlen++) {
                                    if (rowheads[rlen] !== undefined) {
                                        let levelName = rowheads[rlen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            rowheads[rlen].level === activeValues.level) {
                                            for (let index of colIndex) {
                                                let currentSet = data[rlen + valueCount][index];
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
                                let currentSet = data[index[0]][index[1]];
                                let cVal = currentSet.value - selectedRowValues[index[1]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = this.getFormattedValue(cVal, name).formattedText;
                                }
                                else {
                                    cVal = (selectedRowValues[index[1]].value === 0 ?
                                        0 : (cVal / selectedRowValues[index[1]].value));
                                    currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : '0');
                                }
                            }
                        }
                        else {
                            if (!isChildren) {
                                for (let item of selectedHeaderCollection) {
                                    for (let clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                                        let isSelectedColumn = false;
                                        if (activeColumn[cln] !== undefined &&
                                            activeColumn[cln].valueSort[item.valueSort.levelName] &&
                                            activeColumn[cln].level === activeValues.level && activeColumn[cln].type !== 'grand sum') {
                                            for (let index of rowindexCollection) {
                                                let currentSet = data[index][cln];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                    isSelectedColumn = true;
                                                    indexCollection.push([index, cln]);
                                                    if (pivotIndex[index + ',' + cln]) {
                                                        delete pivotIndex[index + ',' + cln];
                                                    }
                                                }
                                            }
                                            if (isSelectedColumn) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                let uniqueLevelName = uniqueName.split('.');
                                for (let clt = activeColumn.length, clen = 0; clen < clt; clen++) {
                                    let isSelectedColumn = false;
                                    if (activeColumn[clen] !== undefined) {
                                        let levelName = activeColumn[clen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            activeColumn[clen].level === activeValues.level) {
                                            for (let index of rowindexCollection) {
                                                let currentSet = data[index][clen];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                    isSelectedColumn = true;
                                                    indexCollection.push([index, clen]);
                                                    if (pivotIndex[index + ',' + clen]) {
                                                        delete pivotIndex[index + ',' + clen];
                                                    }
                                                }
                                            }
                                            if (isSelectedColumn) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            for (let index of indexCollection) {
                                let currentSet = data[index[0]][index[1]];
                                let cVal = currentSet.value - selectedColumnValues[index[0]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = this.getFormattedValue(cVal, name).formattedText;
                                }
                                else {
                                    cVal = (selectedColumnValues[index[0]].value === 0 ?
                                        0 : (cVal / selectedColumnValues[index[0]].value));
                                    currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : '0');
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
                                for (let rlt = rowheads.length, i = 0; i < rlt; i++) {
                                    if (rowheads[i] !== undefined) {
                                        if (rowheads[i].valueSort[item.valueSort.levelName] &&
                                            rowheads[i].level === item.level) {
                                            for (let index of colIndex) {
                                                let currentSet = data[i + valueCount][index];
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
                                let currentSet = data[i[0]][i[1]];
                                let cVal = currentSet.value / selectedRowValues[i[1]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : '0');
                            }
                        }
                        else {
                            for (let item of selectedHeaderCollection) {
                                for (let clt = activeColumn.length, j = 0; j < clt; j++) {
                                    let isSelectedColumn = false;
                                    if (activeColumn[j] !== undefined &&
                                        activeColumn[j].valueSort[item.valueSort.levelName]) {
                                        for (let index of rowindexCollection) {
                                            let currentSet = data[index][j];
                                            if (currentSet.axis === 'value' && currentSet.actualText === name) {
                                                isSelectedColumn = true;
                                                indexCollection.push([index, j]);
                                                if (pivotIndex[index + ',' + j]) {
                                                    delete pivotIndex[index + ',' + j];
                                                }
                                            }
                                        }
                                        if (isSelectedColumn) {
                                            break;
                                        }
                                    }
                                }
                            }
                            for (let i of indexCollection) {
                                let currentSet = data[i[0]][i[1]];
                                let val = currentSet.value / selectedColumnValues[i[0]].value;
                                val = isNaN(val) ? 0 : val;
                                currentSet.formattedText = (val !== 0 ? this.globalize.formatNumber(val, { format: 'P', maximumFractionDigits: 2 }) : '0');
                            }
                        }
                    }
                    break;
                case 'RunningTotals':
                    {
                        if (isRowBaseField) {
                            for (let index of colIndex) {
                                let cVal = 0;
                                for (let item of selectedHeaderCollection) {
                                    for (let rlt = rowheads.length, rlen = 0; rlen < rlt; rlen++) {
                                        if (rowheads[rlen] !== undefined) {
                                            let currentSet = data[rlen + valueCount][index];
                                            if (rowheads[rlen] !== undefined && rowheads[rlen].valueSort[item.valueSort.levelName] &&
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
                        }
                        else {
                            for (let rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
                                if (rowheads[rln] !== undefined) {
                                    let cVal = 0;
                                    for (let item of selectedHeaderCollection) {
                                        for (let clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                                            let currentSet = data[rln + valueCount][cln];
                                            if (activeColumn[cln] !== undefined &&
                                                activeColumn[cln].valueSort[item.valueSort.levelName] &&
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
    recursiveRowData(rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, vln, rTotal, cTotal) {
        if (!isLeastNode) {
            this.getTableData(reformAxis[tnum - vln].members, reformAxis, columns, tnum, data, vlt, rTotal, cTotal);
        }
        reformAxis[tnum - vln].members = [];
    }
    updateRowData(rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal) {
        let mPos = this.fieldList[this.values[vln].name].index;
        let aggregate = this.fieldList[this.values[vln].name].aggregateType;
        let field = this.values[vln].name;
        let gTotalIndex = [];
        let totalValues = {};
        let value = 0;
        // let isLeast: boolean = isLeastNode && (vln === vlt - 1);
        switch (aggregate) {
            case 'Index':
                {
                    gTotalIndex = [[rows[rln], columns[cln]], [rows[rln], cTotal], [rTotal, columns[cln]], [rTotal, cTotal]];
                    let valueContent = ['cVal', 'rTotalVal', 'cTotalVal', 'gTotalVal'];
                    let i = 0;
                    for (let rIndex of gTotalIndex) {
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    let val = ((totalValues.cVal) * (totalValues.gTotalVal)) / ((totalValues.rTotalVal) * (totalValues.cTotalVal));
                    value = (rows[rln].isDrilled && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                        !this.showSubTotals || !this.showRowSubTotals)) ? undefined :
                        (isNaN(val) ? 0 : val);
                }
                break;
            case 'PercentageOfGrandTotal':
            case 'PercentageOfColumnTotal':
            case 'PercentageOfRowTotal':
                {
                    gTotalIndex = [[rows[rln], columns[cln]]];
                    gTotalIndex.push((aggregate === 'PercentageOfGrandTotal' ?
                        [rTotal, cTotal] : (aggregate === 'PercentageOfColumnTotal' ? [rTotal, columns[cln]] : [rows[rln], cTotal])));
                    let valueContent = ['cVal', 'gTotalVal'];
                    let i = 0;
                    for (let rIndex of gTotalIndex) {
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    let val = ((totalValues.cVal) / (totalValues.gTotalVal));
                    value = (rows[rln].isDrilled && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                        !this.showSubTotals || !this.showRowSubTotals)) ? undefined :
                        (isNaN(val) ? 0 : val);
                }
                break;
            default:
                value = (rows[rln].isDrilled && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
                    !this.showSubTotals || !this.showRowSubTotals)) ? undefined :
                    this.getAggregateValue(rows[rln].index, columns[cln].indexObject, mPos, aggregate);
                break;
        }
        let isSum = rows[rln].hasChild || columns[cln].hasChild ||
            rows[rln].type === 'grand sum' || columns[cln].type === 'grand sum';
        let subTotal = (rows[rln].isDrilled && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
            !this.showSubTotals || !this.showRowSubTotals));
        let formattedText = subTotal ?
            '' : aggregate === 'Count' ? value.toLocaleString() : this.getFormattedValue(value, field).formattedText;
        if (value && (['PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal']).indexOf(aggregate) >= 0) {
            formattedText = this.globalize.formatNumber(value, { format: 'P', maximumFractionDigits: 2 });
        }
        else if (!subTotal &&
            isNaN(value) && (['PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar']).indexOf(aggregate) !== -1) {
            formattedText = '#DIV/0!';
        }
        //dln = data[tnum].length;
        data[tnum][dln] = this.valueContent[actCnt][dln] = {
            axis: 'value', actualText: field, indexObject: this.isDrillThrough ? this.rawIndexObject : {},
            rowHeaders: rows[rln].type === 'grand sum' ? '' : rows[rln].valueSort.levelName,
            columnHeaders: columns[cln].type === 'grand sum' ? '' : columns[cln].valueSort.levelName,
            formattedText: formattedText, value: value, rowIndex: tnum, colIndex: dln, isSum: isSum
        };
        this.rawIndexObject = {};
    }
    getHeaderData(axis, reformAxis, data, tnum, vcnt) {
        let rlt = axis.length;
        let colItmLn = this.columns.length;
        let sortText = this.valueSortSettings.headerText;
        //let valueLn: number = this.values.length;
        for (let rln = 0; rln < rlt; rln++) {
            if (axis[rln].members.length) {
                this.getHeaderData(axis[rln].members, reformAxis, data, tnum, vcnt);
            }
            if ((!isNullOrUndefined(axis[rln].showSubTotals) && !axis[rln].showSubTotals) ||
                !this.showSubTotals || !this.showColumnSubTotals) {
                if (!axis[rln].isDrilled) {
                    reformAxis[reformAxis.length] = axis[rln];
                }
                else {
                    this.removeCount++;
                }
                tnum = reformAxis.length - 1;
            }
            else {
                tnum = reformAxis.length;
                reformAxis[tnum] = axis[rln];
            }
            //  let rplus: number = rln + 1;
            let lvl = axis[rln].level;
            axis[rln].rowIndex = lvl;
            axis[rln].colIndex = (tnum * vcnt) + vcnt;
            if (!data[lvl]) {
                data[lvl] = [];
                this.headerContent[lvl] = {};
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = axis[rln];
            }
            else {
                data[lvl][(tnum * vcnt) + vcnt] = this.headerContent[lvl][(tnum * vcnt) + vcnt] = axis[rln];
            }
            if (this.isMutiMeasures && !this.valueAxis) {
                for (let vln = 0; vln < vcnt; vln++) {
                    let name = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    let calObj = {
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
                        this.headerContent[colItmLn] = {};
                        data[colItmLn][(tnum * vcnt) + 1 + vln] = this.headerContent[colItmLn][(tnum * vcnt) + 1 + vln] = calObj;
                    }
                    else {
                        data[colItmLn][(tnum * vcnt) + 1 + vln] = this.headerContent[colItmLn][(tnum * vcnt) + 1 + vln] = calObj;
                    }
                    let vData = data[colItmLn][(tnum * vcnt) + 1 + vln].valueSort;
                    vData[axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name] = 1;
                    vData.levelName = axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name;
                    if (vData && vData[sortText]) {
                        this.valueSortSettings.columnIndex = (tnum * vcnt) + 1 + vln;
                    }
                }
            }
            else if (axis[rln].valueSort && axis[rln].valueSort[sortText]) {
                this.valueSortSettings.columnIndex = (tnum * vcnt) + 1;
            }
            reformAxis[tnum].members = [];
        }
    }
    /* tslint:disable */
    getAggregateValue(rowIndex, columnIndex, value, type) {
        //rowIndex = rowIndex.sort();
        //columnIndex = columnIndex.sort();
        let rlt = rowIndex.length;
        //let clt: number = columnIndex.length;
        let ri = 0;
        let cellValue = 0;
        let avgCnt = 0;
        let isInit = true;
        if (type && type.toLowerCase() === 'count') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    cellValue += (this.valueMatrix[rowIndex[ri]][value] === undefined ? 0 : 1);
                }
                ri++;
            }
        }
        else if (type && type.toLowerCase() === 'distinctcount') {
            let duplicateValues = [];
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let currentVal = this.valueMatrix[rowIndex[ri]][value];
                    if (currentVal !== undefined) {
                        if (duplicateValues.length === 0 || (duplicateValues.length > 0 && duplicateValues.indexOf(currentVal) === -1)) {
                            cellValue += 1;
                            duplicateValues.push(currentVal);
                        }
                    }
                }
                ri++;
            }
        }
        else if (type && type.toLowerCase() === 'product') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let currentVal = this.valueMatrix[rowIndex[ri]][value];
                    if (currentVal !== undefined) {
                        cellValue = (isInit ? 1 : (cellValue === 0 ? 1 : cellValue));
                        cellValue *= currentVal;
                    }
                    isInit = false;
                }
                ri++;
            }
        }
        else if (type && (['populationstdev', 'samplestdev', 'populationvar', 'samplevar']).indexOf(type.toLowerCase()) !== -1) {
            let i = 0;
            let val = 0;
            let indexVal = [];
            let avgVal = 0;
            let cVal = 0;
            let avgDifferenceVal = 0;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let currentVal = this.valueMatrix[rowIndex[ri]][value];
                    if (currentVal !== undefined) {
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
                }
                else {
                    cVal = avgDifferenceVal / (type.toLowerCase() === 'populationvar' ? i : (i - 1));
                }
                cellValue = (cVal === 0 ? NaN : cVal);
            }
            else {
                cellValue = val;
            }
        }
        else if (type && type.toLowerCase() === 'min') {
            let isFirst = true;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    if (isFirst) {
                        cellValue = this.valueMatrix[rowIndex[ri]][value];
                        isFirst = false;
                    }
                    else {
                        cellValue = this.valueMatrix[rowIndex[ri]][value] < cellValue ? this.valueMatrix[rowIndex[ri]][value] : cellValue;
                    }
                }
                ri++;
            }
        }
        else if (type && type.toLowerCase() === 'max') {
            let isMaxFirst = true;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    if (isMaxFirst) {
                        cellValue = this.valueMatrix[rowIndex[ri]][value];
                        isMaxFirst = false;
                    }
                    else {
                        cellValue = this.valueMatrix[rowIndex[ri]][value] > cellValue ? this.valueMatrix[rowIndex[ri]][value] : cellValue;
                    }
                }
                ri++;
            }
        }
        else if (type && type.toLowerCase() === 'calculatedfield') {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    let calcField = this.calculatedFields[this.fields[value]];
                    let actualFormula = calcField.formula;
                    let aggregateField = {};
                    if (this.calculatedFormulas[calcField.name]) {
                        let calculatedFormulas = this.calculatedFormulas[calcField.name];
                        for (let len = 0, lmt = calculatedFormulas.length; len < lmt; len++) {
                            let aggregatedValue = calculatedFormulas[len];
                            let value = aggregateField[aggregatedValue.formula];
                            if (value === undefined) {
                                let type = aggregatedValue.type;
                                value = this.getAggregateValue(rowIndex, columnIndex, aggregatedValue.index, type);
                                aggregateField[aggregatedValue.formula] = value;
                            }
                            actualFormula = (actualFormula).replace(aggregatedValue.formula, value.toString());
                        }
                    }
                    // /* tslint:disable */
                    cellValue = eval(actualFormula);
                    // /* tslint:enable */
                    JSON.parse(cellValue.toString());
                }
                ri++;
            }
        }
        else {
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    //let cIndx: number = isLeastLevel ? columnIndex.splice(columnIndex.indexOf(rowIndex[ri]), 1)[0] : rowIndex[ri];
                    let currentVal = this.valueMatrix[rowIndex[ri]][value];
                    cellValue += (currentVal === undefined ? 0 : currentVal);
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
    /* tslint:enable */
    /** hidden */
    getFormattedValue(value, fieldName) {
        let formattedValue = {
            formattedText: value !== undefined ? value === null ? 'null' : value.toString() : undefined,
            actualText: value !== undefined ? value === null ? 'null' : value : undefined,
            dateText: value !== undefined ? value === null ? 'null' : value : undefined
        };
        if (this.formatFields[fieldName] && value) {
            let formatField = (this.formatFields[fieldName].properties ?
                this.formatFields[fieldName].properties : this.formatFields[fieldName]);
            let formatSetting = extend({}, formatField, null, true);
            delete formatSetting.name;
            if (!formatSetting.minimumSignificantDigits && formatSetting.minimumSignificantDigits < 1) {
                delete formatSetting.minimumSignificantDigits;
            }
            if (!formatSetting.maximumSignificantDigits && formatSetting.maximumSignificantDigits < 1) {
                delete formatSetting.maximumSignificantDigits;
            }
            if (formatSetting.type) {
                formattedValue.formattedText = this.globalize.formatDate(new Date(value), formatSetting);
            }
            else {
                formattedValue.formattedText = this.globalize.formatNumber(value, formatSetting);
            }
            formattedValue.actualText = value;
            if (formatSetting.type && ['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName].type) > -1) {
                formatSetting.format = 'yyyy/MM/dd/HH/mm/ss';
                formattedValue.dateText = this.globalize.formatDate(new Date(value), formatSetting);
            }
        }
        return formattedValue;
    }
    powerFunction(formula) {
        if (formula.indexOf('^') > -1) {
            let items = [];
            while (formula.indexOf('(') > -1) {
                formula = formula.replace(/(\([^\(\)]*\))/g, (text, item) => {
                    items.push(item);
                    return ('~' + (items.length - 1));
                });
            }
            items.push(formula);
            formula = '~' + (items.length - 1);
            while (formula.indexOf('~') > -1) {
                formula = formula.replace(new RegExp('~' + '(\\d+)', 'g'), (text, index) => {
                    return items[index].replace(/(\w*)\^(\w*)/g, 'Math.pow' + '($1,$2)');
                });
            }
        }
        return formula;
    }
}

/**
 * Specifies pivot external events
 * @hidden
 */
/** @hidden */
const load = 'load';
/** @hidden */
const enginePopulating = 'enginePopulating';
/** @hidden */
const enginePopulated = 'enginePopulated';
/** @hidden */
const onFieldDropped = 'onFieldDropped';
/** @hidden */
const beforePivotTableRender = 'beforePivotTableRender';
/** @hidden */
const afterPivotTableRender = 'afterPivotTableRender';
/** @hidden */
const beforeExport = 'beforeExport';
/** @hidden */
const excelHeaderQueryCellInfo = 'excelHeaderQueryCellInfo';
/** @hidden */
const pdfHeaderQueryCellInfo = 'pdfHeaderQueryCellInfo';
/** @hidden */
const excelQueryCellInfo = 'excelQueryCellInfo';
/** @hidden */
const pdfQueryCellInfo = 'pdfQueryCellInfo';
/** @hidden */
const dataBound = 'dataBound';
/** @hidden */
const queryCellInfo = 'queryCellInfo';
/** @hidden */
const headerCellInfo = 'headerCellInfo';
/** @hidden */
const hyperlinkCellClick = 'hyperlinkCellClick';
/** @hidden */
const resizing = 'resizing';
/** @hidden */
const resizeStop = 'resizeStop';
/** @hidden */
const cellClick = 'cellClick';
/** @hidden */
const drillThrough = 'drillThrough';
/** @hidden */
const beforeColumnsRender = 'beforeColumnsRender';
/** @hidden */
const selected = 'selected';
/** @hidden */
const cellSelected = 'cellSelected';
/** @hidden */
const cellDeselected = 'cellDeselected';
/** @hidden */
const rowSelected = 'rowSelected';
/** @hidden */
const rowDeselected = 'rowDeselected';
/**
 * Specifies pivot internal events
 */
/** @hidden */
const initialLoad = 'initial-load';
/** @hidden */
const uiUpdate = 'ui-update';
/** @hidden */
const scroll = 'scroll';
/** @hidden */
const contentReady = 'content-ready';
/** @hidden */
const dataReady = 'data-ready';
/** @hidden */
const initSubComponent = 'init-groupingbar';
/** @hidden */
const treeViewUpdate = 'tree-view-update';
/** @hidden */
const pivotButtonUpdate = 'pivot-button-update';
/** @hidden */
const initCalculatedField = 'init-calculatedfield';
/** @hidden */
const click = 'click';

/**
 * CSS Constants
 * @hidden
 */
/** @hidden */
const ROOT = 'e-pivotfieldlist';
/** @hidden */
const RTL = 'e-rtl';
/** @hidden */
const DEVICE = 'e-device';
/** @hidden */
const ICON = 'e-icons';
/** @hidden */
const ICON_DISABLE = 'e-disable';
/** @hidden */
const ICON_HIDDEN = 'e-hide';
/** @hidden */
const AXISFIELD_ICON_CLASS = 'e-dropdown-icon';
const WRAPPER_CLASS = 'e-pivotfieldlist-wrapper';
/** @hidden */
const CONTAINER_CLASS = 'e-field-list-container';
/** @hidden */
const TOGGLE_FIELD_LIST_CLASS = 'e-toggle-field-list';
/** @hidden */
const STATIC_FIELD_LIST_CLASS = 'e-static';
/** @hidden */
const TOGGLE_SELECT_CLASS = 'e-select-table';
/** @hidden */
const FIELD_TABLE_CLASS = 'e-field-table';
/** @hidden */
const FIELD_LIST_CLASS = 'e-field-list';
/** @hidden */
const FIELD_LIST_TREE_CLASS = 'e-field-list-tree';
/** @hidden */
const FIELD_HEADER_CLASS = 'e-field-header';
/** @hidden */
const FIELD_LIST_TITLE_CLASS = 'e-field-list-title';
/** @hidden */
const FIELD_LIST_TITLE_CONTENT_CLASS = 'e-title-content';
/** @hidden */
const FIELD_LIST_FOOTER_CLASS = 'e-field-list-footer';
/** @hidden */
const CALCULATED_FIELD_CLASS = 'e-calculated-field';
/** @hidden */
const FLAT_CLASS = 'e-flat e-primary';
/** @hidden */
const OUTLINE_CLASS = 'e-outline';
/** @hidden */
const AXIS_TABLE_CLASS = 'e-axis-table';
/** @hidden */
const LEFT_AXIS_PANEL_CLASS = 'e-left-axis-fields';
/** @hidden */
const RIGHT_AXIS_PANEL_CLASS = 'e-right-axis-fields';
/** @hidden */
const AXIS_HEADER_CLASS = 'e-axis-header';
/** @hidden */
const AXIS_CONTENT_CLASS = 'e-axis-content';
/** @hidden */
const AXIS_PROMPT_CLASS = 'e-draggable-prompt';
/** @hidden */
const PIVOT_BUTTON_WRAPPER_CLASS = 'e-pvt-btn-div';
/** @hidden */
const PIVOT_BUTTON_CLASS = 'e-pivot-button';
/** @hidden */
const PIVOT_BUTTON_CONTENT_CLASS = 'e-content';
/** @hidden */
const DRAG_CLONE_CLASS = 'e-button-drag-clone';
/** @hidden */
const SORT_CLASS = 'e-sort';
/** @hidden */
const SORT_DESCEND_CLASS = 'e-descend';
/** @hidden */
const FILTER_COMMON_CLASS = 'e-btn-filter';
/** @hidden */
const FILTER_CLASS = 'e-pv-filter';
/** @hidden */
const FILTERED_CLASS = 'e-pv-filtered';
/** @hidden */
const REMOVE_CLASS = 'e-remove';
/** @hidden */
const DRAG_CLASS = 'e-drag';
/** @hidden */
const DROP_INDICATOR_CLASS = 'e-drop-indicator';
/** @hidden */
const INDICATOR_HOVER_CLASS = 'e-drop-hover';
/** @hidden */
const MEMBER_EDITOR_DIALOG_CLASS = 'e-member-editor-dialog';
/** @hidden */
const EDITOR_TREE_WRAPPER_CLASS = 'e-member-editor-wrapper';
/** @hidden */
const EDITOR_TREE_CONTAINER_CLASS = 'e-member-editor-container';
/** @hidden */
const DRILLTHROUGH_GRID_CLASS = 'e-drillthrough-grid';
/** @hidden */
const DRILLTHROUGH_BODY_CLASS = 'e-drillthrough-body';
/** @hidden */
const DRILLTHROUGH_BODY_HEADER_CONTAINER_CLASS = 'e-drillthrough-body-header-container';
/** @hidden */
const DRILLTHROUGH_BODY_HEADER_CLASS = 'e-drillthrough-body-header';
/** @hidden */
const DRILLTHROUGH_BODY_HEADER_COMMON_CLASS = 'e-drillthrough-body-header-common';
/** @hidden */
const DRILLTHROUGH_BODY_HEADER_VALUE_CLASS = 'e-drillthrough-body-header-value';
/** @hidden */
const DRILLTHROUGH_DIALOG = 'e-drillthrough-dialog';
/** @hidden */
const EDITOR_LABEL_WRAPPER_CLASS = 'e-editor-label-wrapper';
/** @hidden */
const EDITOR_LABEL_CLASS = 'e-editor-label';
/** @hidden */
const CHECK_BOX_FRAME_CLASS = 'e-frame';
/** @hidden */
const NODE_CHECK_CLASS = 'e-check';
/** @hidden */
const NODE_STOP_CLASS = 'e-stop';
/** @hidden */
const OK_BUTTON_CLASS = 'e-ok-btn';
/** @hidden */
const CANCEL_BUTTON_CLASS = 'e-cancel-btn';
/** @hidden */
const ERROR_DIALOG_CLASS = 'e-pivot-error-dialog';
/** @hidden */
const DROPPABLE_CLASS = 'e-droppable';
/** @hidden */
const ROW_AXIS_CLASS = 'e-rows';
/** @hidden */
const COLUMN_AXIS_CLASS = 'e-columns';
/** @hidden */
const VALUE_AXIS_CLASS = 'e-values';
/** @hidden */
const FILTER_AXIS_CLASS = 'e-filters';
/** @hidden */
const GROUPING_BAR_CLASS = 'e-grouping-bar';
/** @hidden */

/** @hidden */
const GROUP_ROW_CLASS = 'e-group-rows';
/** @hidden */
const GROUP_COLUMN_CLASS = 'e-group-columns';
/** @hidden */

/** @hidden */
const GROUP_VALUE_CLASS = 'e-group-values';
/** @hidden */
const GROUP_FILTER_CLASS = 'e-group-filters';
/** @hidden */

/** @hidden */
const NO_DRAG_CLASS = 'e-drag-restrict';
/** @hidden */
const SELECTED_NODE_CLASS = 'e-list-selected';
/** @hidden */
const TITLE_HEADER_CLASS = 'e-title-header';
/** @hidden */
const TITLE_CONTENT_CLASS = 'e-title-content';
/** @hidden */
const TEXT_CONTENT_CLASS = 'e-text-content';
/** @hidden */
const FOOTER_CONTENT_CLASS = 'e-footer-content';
/** @hidden */
const ADAPTIVE_CONTAINER_CLASS = 'e-adaptive-container';
/** @hidden */
const ADAPTIVE_FIELD_LIST_BUTTON_CLASS = 'e-field-list-btn';
/** @hidden */
const ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS = 'e-calculated-field-btn';
/** @hidden */
const BUTTON_SMALL_CLASS = 'e-small';
/** @hidden */
const BUTTON_ROUND_CLASS = 'e-round';
/** @hidden */
const ADD_ICON_CLASS = 'e-add-icon';
/** @hidden */
const BUTTON_FLAT_CLASS = 'e-flat';
/** @hidden */
const STATIC_CENTER_DIV_CLASS = 'e-center-div';
/** @hidden */
const STATIC_CENTER_HEADER_CLASS = 'e-center-title';
/** @hidden */
const ADAPTIVE_FIELD_LIST_DIALOG_CLASS = 'e-adaptive-field-list-dialog';
/** @hidden */
const LIST_TEXT_CLASS = 'e-list-text';
/** @hidden */
const LIST_SELECT_CLASS = 'e-selected-node';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const SELECTED_OPTION_ICON_CLASS = 'e-selected-option-icon';
/** @hidden */
const FILTER_DIV_CONTENT_CLASS = 'e-filter-div-content';
/** @hidden */
const FILTER_TEXT_DIV_CLASS = 'e-filter-text-div';
/** @hidden */
const BETWEEN_TEXT_DIV_CLASS = 'e-between-text-div';
/** @hidden */
const SEPARATOR_DIV_CLASS = 'e-separator-div';
/** @hidden */
const FILTER_OPTION_WRAPPER_1_CLASS = 'e-filter-option-wrapper-1';
/** @hidden */
const FILTER_OPTION_WRAPPER_2_CLASS = 'e-filter-option-wrapper-2';
/** @hidden */
const FILTER_INPUT_DIV_1_CLASS = 'e-filter-input-div-1';
/** @hidden */
const FILTER_INPUT_DIV_2_CLASS = 'e-filter-input-div-2';
/** @hidden */
const VALUE_OPTIONS_CLASS = 'e-value-options';
/** @hidden */
const FILTER_OPERATOR_CLASS = 'e-filter-operator';
/** @hidden */
const COLLAPSE = 'e-collapse';
/** @hidden */
const EXPAND = 'e-expand';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const COLUMNSHEADER = 'e-columnsheader';
/** @hidden */
const ROWSHEADER = 'e-rowsheader';
/** @hidden */
const VALUESCONTENT = 'e-valuescontent';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const SUMMARY = 'e-summary';
/** @hidden */
const CELLVALUE = 'e-cellvalue';
/** @hidden */

/** @hidden */
const PIVOTTOOLTIP = 'e-pivottooltip';
/** @hidden */
const TOOLTIP_HEADER = 'e-tooltipheader';
/** @hidden */
const TOOLTIP_CONTENT = 'e-tooltipcontent';
/** @hidden */
const NEXTSPAN = 'e-nextspan';
/** @hidden */
const LASTSPAN = 'e-lastspan';
/** @hidden */
const EDITOR_SEARCH_WRAPPER_CLASS = 'e-editor-search-wrapper';
/** @hidden */
const EDITOR_SEARCH_CLASS = 'e-editor-search';
/** @hidden */
const SELECT_ALL_WRAPPER_CLASS = 'e-select-all-wrapper';
/** @hidden */
const SELECT_ALL_CLASS = 'e-select-all';
/** @hidden */
const PIVOTCALC = 'e-pivot-calc';
/** @hidden */
const CALCDIALOG = 'e-pivot-calc-dialog-div';
/** @hidden */
const CALCRADIO = 'e-pivot-calc-radio';
/** @hidden */
const CALCCHECK = 'e-pivot-calc-check';
/** @hidden */
const CALCINPUT = 'e-pivot-calc-input';
/** @hidden */
const CALCINPUTDIV = 'e-pivot-calc-input-div';
/** @hidden */
const CALCOUTERDIV = 'e-pivot-calc-outer-div';
/** @hidden */
const FLAT = 'e-flat';
/** @hidden */
const FORMAT = 'e-format';
/** @hidden */
const FORMULA = 'e-pivot-formula';
/** @hidden */
const TREEVIEW = 'e-pivot-treeview';
/** @hidden */
const TREEVIEWOUTER = 'e-pivot-treeview-outer';
/** @hidden */
const CALCCANCELBTN = 'e-pivot-cancel-button';
/** @hidden */
const CALCADDBTN = 'e-pivot-add-button';
/** @hidden */
const CALCOKBTN = 'e-pivot-ok-button';
/** @hidden */
const CALCACCORD = 'e-pivot-accord';
/** @hidden */
const CALCBUTTONDIV = 'e-pivot-button-div';
/** @hidden */
const AXIS_ICON_CLASS = 'e-axis';
/** @hidden */
const AXIS_ROW_CLASS = 'e-axis-row';
/** @hidden */
const AXIS_COLUMN_CLASS = 'e-axis-column';
/** @hidden */
const AXIS_VALUE_CLASS = 'e-axis-value';
/** @hidden */
const AXIS_FILTER_CLASS = 'e-axis-filter';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
const GRID_CLASS = 'e-grid';
/** @hidden */
const PIVOT_VIEW_CLASS = 'e-pivotview';
/** @hidden */
const PIVOT_ALL_FIELD_TITLE_CLASS = 'e-pivot-all-field-title';
/** @hidden */
const PIVOT_FORMULA_TITLE_CLASS = 'e-pivot-formula-title';
/** @hidden */
const PIVOT_CONTEXT_MENU_CLASS = 'e-pivot-context-menu';
/** @hidden */
const MENU_DISABLE = 'e-disabled';
/** @hidden */
const EMPTY_MEMBER_CLASS = 'e-member-prompt';
/** @hidden */
const CALC_EDIT = 'e-edit';
/** @hidden */
const CALC_EDITED = 'e-edited';
/** @hidden */
const EMPTY_FIELD = 'e-empty-field';
/** @hidden */
const FORMAT_DIALOG = 'e-pivot-formatting-dialog';
/** @hidden */
const FORMAT_CONDITION_BUTTON = 'e-format-condition-button';
/** @hidden */
const FORMAT_NEW = 'e-new-format';
/** @hidden */
const FORMAT_OUTER = 'e-format-outer-div';
/** @hidden */
const FORMAT_INNER = 'e-format-inner-div';
/** @hidden */
const FORMAT_TABLE = 'e-format-table';
/** @hidden */
const FORMAT_VALUE_LABEL = 'e-format-value-label';
/** @hidden */
const FORMAT_LABEL = 'e-format-label';
/** @hidden */
const INPUT = 'e-input';
/** @hidden */
const FORMAT_VALUE1 = 'e-format-value1';
/** @hidden */
const FORMAT_VALUE2 = 'e-format-value2';
/** @hidden */
const FORMAT_VALUE_SPAN = 'e-format-value-span';
/** @hidden */
const FORMAT_FONT_COLOR = 'e-format-font-color';
/** @hidden */
const FORMAT_BACK_COLOR = 'e-format-back-color';
/** @hidden */
const FORMAT_VALUE_PREVIEW = 'e-format-value-preview';
/** @hidden */
const FORMAT_COLOR_PICKER = 'e-format-color-picker';
/** @hidden */
const FORMAT_DELETE_ICON = 'e-format-delete-icon';
/** @hidden */
const FORMAT_DELETE_BUTTON = 'e-format-delete-button';
/** @hidden */
const SELECTED_COLOR = 'e-selected-color';
/** @hidden */
const DIALOG_HEADER = 'e-dlg-header';
/** @hidden */
const FORMAT_APPLY_BUTTON = 'e-format-apply-button';
/** @hidden */
const FORMAT_CANCEL_BUTTON = 'e-format-cancel-button';
/** @hidden */
const FORMAT_ROUND_BUTTON = 'e-small e-round';
/** @hidden */
const VIRTUALTRACK_DIV = 'e-virtualtrack';
/** @hidden */
const MOVABLECONTENT_DIV = 'e-movablecontent';
/** @hidden */
const FROZENCONTENT_DIV = 'e-frozencontent';
/** @hidden */
const MOVABLEHEADER_DIV = 'e-movableheader';
/** @hidden */

/** @hidden */
const DEFER_APPLY_BUTTON = 'e-defer-apply-button';
/** @hidden */
const DEFER_CANCEL_BUTTON = 'e-defer-cancel-button';
/** @hidden */
const LAYOUT_FOOTER = 'e-layout-footer';
/** @hidden */
const CELL_SELECTED_BGCOLOR = 'e-cellselectionbackground';
/** @hidden */
const SELECTED_BGCOLOR = 'e-selectionbackground';
/** @hidden */
const BUTTON_LAYOUT = 'e-button-layout';
/** @hidden */
const CHECKBOX_LAYOUT = 'e-checkbox-layout';
/** @hidden */
const DEFER_UPDATE_BUTTON = 'e-defer-update-btn';
/** @hidden */
const HEADERCONTENT = 'e-headercontent';
/** @hidden */
const BACK_ICON = 'e-field-list-back-icon';
/** @hidden */
const TITLE_MOBILE_HEADER = 'e-title-mobile-header';
/** @hidden */
const TITLE_MOBILE_CONTENT = 'e-title-mobile-content';

/**
 * Module to render PivotGrid control
 */
/** @hidden */
class Render {
    /** Constructor for render module */
    constructor(parent) {
        this.colPos = 0;
        this.lastSpan = 0;
        this.parent = parent;
        this.engine = parent.engineModule;
        this.gridSettings = parent.gridSettings;
        this.formatList = this.getFormatList();
    }
    /** @hidden */
    /* tslint:disable */
    render() {
        let parent = this.parent;
        let engine = this.parent.engineModule;
        this.injectGridModules(parent);
        this.rowStartPos = this.getRowStartPos();
        if (this.parent.grid && this.parent.grid.element && this.parent.element.querySelector('.e-grid')) {
            if (!engine.isEngineUpdated) {
                engine.headerContent = this.frameDataSource('header');
                engine.valueContent = this.frameDataSource('value');
            }
            else {
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
            let e = this.parent.element.querySelector('.e-movablecontent');
            e.querySelector('colGroup').innerHTML =
                this.parent.grid.getHeaderContent().querySelector('.e-movableheader').querySelector('colgroup').innerHTML;
            this.parent.grid.width = this.calculateGridWidth();
            if (this.parent.height > (this.engine.valueContent.length * this.gridSettings.rowHeight)) {
                this.parent.grid.height = 'auto';
            }
            else {
                this.parent.grid.height = this.parent.height;
            }
        }
        else {
            this.parent.element.innerHTML = '';
            this.bindGrid(this.parent, (this.engine.isEmptyData ? true : false));
            this.parent.element.appendChild(createElement('div', { id: this.parent.element.id + '_grid' }));
            this.parent.grid.appendTo('#' + this.parent.element.id + '_grid');
        }
        /* tslint:disable */
        this.parent.grid.on(headerRefreshed, function () {
            if (this.parent.enableVirtualization) {
                let mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
                let mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
                let vtr = mCont.querySelector('.' + VIRTUALTRACK_DIV);
                this.parent.virtualHeaderDiv = mHdr.querySelector('.' + VIRTUALTRACK_DIV);
                if (mHdr.querySelector('.' + VIRTUALTRACK_DIV)) {
                    remove(mHdr.querySelector('.' + VIRTUALTRACK_DIV));
                }
                else {
                    this.parent.virtualHeaderDiv = createElement('div', { className: VIRTUALTRACK_DIV });
                }
                mHdr.appendChild(this.parent.virtualHeaderDiv);
                if (vtr) {
                    setStyleAttribute(this.parent.virtualHeaderDiv, { height: 0, width: vtr.style.width });
                }
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: (mCont.querySelector('.e-table').style.transform).split(',')[0] + ',' + 0 + 'px)'
                });
                mHdr.scrollLeft = mCont.scrollLeft;
            }
        }, this);
    }
    /** @hidden */
    bindGrid(parent, isEmpty) {
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
            rowSelected: (args) => {
                parent.renderModule.selected(args);
                parent.trigger(rowSelected, args);
            },
            rowDeselecting: this.gridSettings.rowDeselecting ? this.gridSettings.rowDeselecting.bind(this.parent) : undefined,
            rowDeselected: (args) => {
                parent.renderModule.selected(args);
                parent.trigger(rowDeselected, args);
            },
            cellSelecting: this.gridSettings.cellSelecting ? this.gridSettings.cellSelecting.bind(this.parent) : undefined,
            cellSelected: (args) => {
                parent.renderModule.selected(args);
                parent.trigger(selected, args);
            },
            cellDeselecting: this.gridSettings.cellDeselecting ? this.gridSettings.cellDeselecting.bind(this.parent) : undefined,
            cellDeselected: (args) => {
                parent.renderModule.selected(args);
                parent.trigger(cellDeselected, args);
            },
            resizeStart: this.gridSettings.resizeStart ? this.gridSettings.resizeStart.bind(this.parent) : undefined,
            columnDragStart: this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined,
            columnDrag: this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined,
            columnDrop: this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined,
            resizing: this.setGroupWidth.bind(this),
            resizeStop: this.onResizeStop.bind(this),
            queryCellInfo: (args) => {
                parent.renderModule.rowCellBoundEvent(args);
            },
            dataBound: (args) => {
                if (parent.element.querySelector('.e-firstcell')) {
                    if (parent.enableRtl) {
                        parent.element.querySelector('.e-firstcell').style.borderRight = 'none';
                    }
                    else {
                        parent.element.querySelector('.e-firstcell').style.borderLeft = 'none';
                    }
                }
                this.parent.grid.widthService.setWidthToTable();
                parent.notify(contentReady, {});
            },
            headerCellInfo: (args) => {
                parent.renderModule.columnCellBoundEvent(args);
            },
            excelHeaderQueryCellInfo: (args) => {
                parent.renderModule.excelColumnEvent(args);
            },
            pdfHeaderQueryCellInfo: (args) => {
                parent.renderModule.pdfColumnEvent(args);
            },
            excelQueryCellInfo: (args) => {
                parent.renderModule.excelRowEvent(args);
            },
            pdfQueryCellInfo: (args) => {
                parent.renderModule.pdfRowEvent(args);
            }
        });
    }
    injectGridModules(parent) {
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
    updateGridSettings() {
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
    appendValueSortIcon(cell, tCell, rCnt, cCnt) {
        let vSort = this.parent.dataSource.valueSortSettings;
        let len = (cell.type === 'grand sum' && this.parent.dataSource.values.length === 1) ? 0 :
            this.parent.dataSource.values.length > 1 ? (this.parent.engineModule.headerContent.length - 1) :
                this.parent.dataSource.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
        let lock = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
        if (vSort !== undefined && lock && rCnt === len && this.parent.dataSource.valueAxis === 'column') {
            if (tCell.querySelector('.e-sortfilterdiv')) {
                tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ? 'e-descending' : 'e-ascending');
                tCell.querySelector('.e-sortfilterdiv').classList.add(vSort.sortOrder === 'Descending' ?
                    'e-icon-descending' : 'e-icon-ascending');
            }
            else {
                tCell.appendChild(createElement('div', {
                    className: (vSort.sortOrder === 'Descending' ?
                        'e-icon-descending e-icons e-descending e-sortfilterdiv' : 'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                }));
            }
            if (!isNullOrUndefined(cell.hasChild) && cell.type !== 'grand sum' && tCell.querySelector('.e-expand') &&
                (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'))) {
                let element = (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'));
                setStyleAttribute(element, { 'padding-top': '12px' });
            }
        }
        return tCell;
    }
    onResizeStop(args) {
        let column = args.column.field === '0.formattedText' ? '0.formattedText' :
            args.column.customAttributes.cell.valueSort.levelName;
        this.parent.resizeInfo[column] =
            Number(args.column.width.toString().split('px')[0]);
        this.setGroupWidth(args);
    }
    setGroupWidth(args) {
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
            if (this.parent.element.querySelector('.e-group-row').offsetWidth < 245 && !this.parent.firstColWidth) {
                args.cancel = true;
                let gridColumn = this.parent.grid.columns;
                let resColWidth = (this.parent.isAdaptive ? 180 : 250);
                if (gridColumn && gridColumn.length > 0) {
                    gridColumn[0].width = resColWidth;
                }
                this.parent.element.querySelector('.e-frozenheader').querySelector('col').style.width = (resColWidth + 'px');
                this.parent.element.querySelector('.e-frozencontent').querySelector('col').style.width = (resColWidth + 'px');
            }
            this.parent.element.querySelector('.e-group-values').style.width =
                this.parent.element.querySelector('.e-group-row').offsetWidth + 'px';
            this.parent.element.querySelector('.e-group-row').style.height =
                this.parent.element.querySelector('.e-headercontent').offsetHeight + 'px';
        }
        this.parent.trigger(args.e.type === 'touchend' || args.e.type === 'mouseup' ? resizeStop : resizing, args);
    }
    /* tslint:disable */
    selected(args) {
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(() => {
            let pivotArgs = { selectedCellsInfo: [], pivotValues: this.parent.pivotValues };
            let selectedElements = this.parent.element.querySelectorAll('.' + CELL_SELECTED_BGCOLOR);
            selectedElements = selectedElements.length === 0 ? this.parent.element.querySelectorAll('.' + SELECTED_BGCOLOR) :
                selectedElements;
            for (let element of selectedElements) {
                let colIndex = Number(element.getAttribute('aria-colindex'));
                let rowIndex = Number(element.getAttribute('index'));
                let cell = this.engine.pivotValues[rowIndex][colIndex];
                if (cell.axis === 'value') {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.value,
                        columnHeaders: cell.columnHeaders,
                        rowHeaders: cell.rowHeaders,
                        measure: cell.actualText.toString()
                    });
                }
                else if (cell.axis === 'column') {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.formattedText,
                        columnHeaders: cell.valueSort.levelName,
                        rowHeaders: '',
                        measure: ''
                    });
                }
                else {
                    pivotArgs.selectedCellsInfo.push({
                        currentCell: cell,
                        value: cell.formattedText,
                        columnHeaders: '',
                        rowHeaders: cell.valueSort.levelName,
                        measure: ''
                    });
                }
            }
            this.parent.trigger(cellSelected, pivotArgs);
        }, 300);
    }
    rowCellBoundEvent(args) {
        let tCell = args.cell;
        if (tCell && this.engine) {
            let customClass = this.parent.hyperlinkSettings.cssClass;
            tCell.setAttribute('index', (Number(tCell.getAttribute('index')) + this.engine.headerContent.length).toString());
            let cell = args.data[0];
            if (tCell.getAttribute('aria-colindex') === '0') {
                let isValueCell = cell.type && cell.type === 'value';
                tCell.innerText = '';
                let level = cell.level ? cell.level : (isValueCell ? (this.lastSpan + 1) : 0);
                do {
                    if (level > 0) {
                        tCell.appendChild(createElement('span', {
                            className: level === 0 ? '' : NEXTSPAN,
                        }));
                    }
                    level--;
                } while (level > -1);
                level = cell.level ? cell.level : 0;
                this.lastSpan = !isValueCell ? level : this.lastSpan;
                if (!cell.hasChild && level > 0) {
                    tCell.appendChild(createElement('span', {
                        className: LASTSPAN,
                    }));
                }
                let fieldName;
                if ((this.parent.dataSource.rows.length > 0 &&
                    (cell.valueSort ? Object.keys(cell.valueSort).length > 0 : true))) {
                    fieldName = level > -1 ? this.parent.dataSource.rows[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                let localizedText = cell.formattedText;
                if (cell.type) {
                    if (cell.type === 'grand sum') {
                        tCell.classList.add('e-gtot');
                        localizedText = this.parent.localeObj.getConstant('grandTotal');
                    }
                    else {
                        tCell.classList.add('e-stot');
                    }
                }
                tCell.classList.add(ROWSHEADER);
                if (cell.hasChild === true) {
                    tCell.appendChild(createElement('div', {
                        className: (cell.isDrilled === true ? COLLAPSE : EXPAND) + ' ' + ICON,
                        attrs: {
                            'title': cell.isDrilled === true ? this.parent.localeObj.getConstant('collapse') :
                                this.parent.localeObj.getConstant('expand')
                        }
                    }));
                }
                tCell.appendChild(createElement('span', {
                    className: CELLVALUE,
                    innerHTML: (this.parent.isRowCellHyperlink || cell.enableHyperlink ? '<a  data-url="' + localizedText + '" class="e-hyperlinkcell ' + customClass + '">' + localizedText + '</a>' : localizedText)
                }));
                let vSort = this.parent.pivotView.dataSource.valueSortSettings;
                if (vSort && vSort.headerText && this.parent.dataSource.valueAxis === 'row'
                    && this.parent.pivotValues[Number(tCell.getAttribute('index'))][0].valueSort.levelName) {
                    if (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0].valueSort.levelName
                        === vSort.headerText) {
                        let style = (tCell.querySelector('.e-expand') || tCell.querySelector('.e-collapse')) ? 'padding-top: 18px' :
                            'padding-top: 12px';
                        tCell.appendChild(createElement('div', {
                            className: (vSort.sortOrder === 'Descending' ?
                                'e-icon-descending e-icons e-descending e-sortfilterdiv' : 'e-icon-ascending e-icons e-ascending e-sortfilterdiv'),
                            styles: style
                        }));
                    }
                }
            }
            else {
                let innerText = tCell.innerText.toString() === '0' ? '' : tCell.innerText;
                tCell.innerText = '';
                tCell.classList.add(VALUESCONTENT);
                cell = args.data[Number(tCell.getAttribute('aria-colindex'))];
                if (cell.isSum) {
                    tCell.classList.add(SUMMARY);
                }
                if (cell.cssClass) {
                    tCell.classList.add(cell.cssClass);
                }
                tCell.appendChild(createElement('span', {
                    className: CELLVALUE,
                    innerHTML: ((tCell.className.indexOf('e-summary') !== -1 && this.parent.isSummaryCellHyperlink) ||
                        (tCell.className.indexOf('e-summary') === -1 && this.parent.isValueCellHyperlink) ||
                        cell.enableHyperlink ? '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>' : innerText)
                }));
            }
            this.unWireEvents(tCell);
            this.wireEvents(tCell);
        }
        this.parent.trigger(queryCellInfo, args);
    }
    columnCellBoundEvent(args) {
        if (args.cell.column && args.cell.column.customAttributes) {
            let cell = args.cell.column.customAttributes.cell;
            let tCell = args.node;
            if (cell) {
                let customClass = this.parent.hyperlinkSettings.cssClass;
                let level = cell.level ? cell.level : 0;
                if ((cell.level === -1 && !cell.rowSpan && cell.rowIndex !== this.engine.headerContent.length - 1)
                    || cell.rowSpan === -1) {
                    args.node.style.display = 'none';
                }
                else if (cell.rowSpan > 1) {
                    args.node.setAttribute('rowspan', cell.rowSpan.toString());
                    args.node.setAttribute('aria-rowspan', cell.rowSpan.toString());
                    if ((cell.rowIndex + cell.rowSpan) === this.engine.headerContent.length) {
                        args.node.style.borderBottomWidth = '0px';
                    }
                }
                args.node.setAttribute('aria-colindex', cell.colIndex.toString());
                args.node.setAttribute('index', cell.rowIndex.toString());
                let fieldName;
                if (!(this.parent.dataSource.values && this.parent.dataSource.valueAxis === 'column' && this.parent.dataSource.values.length > 1 &&
                    (cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSource.columns &&
                    this.parent.dataSource.columns.length > 0) {
                    fieldName = level > -1 ? this.parent.dataSource.columns[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                if (cell.type) {
                    tCell.classList.add(cell.type === 'grand sum' ? 'e-gtot' : 'e-stot');
                    let localizedText = cell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                        cell.formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total');
                    if (tCell.querySelector('.e-headertext') !== null) {
                        tCell.querySelector('.e-headertext').innerText = localizedText;
                    }
                    else {
                        tCell.querySelector('.e-stackedheadercelldiv').innerText = localizedText;
                    }
                }
                tCell.classList.add(COLUMNSHEADER);
                if (this.parent.isColumnCellHyperlink || cell.enableHyperlink) {
                    if (tCell.querySelector('.e-stackedheadercelldiv')) {
                        let innerText = tCell.querySelector('.e-stackedheadercelldiv').innerText;
                        tCell.querySelector('.e-stackedheadercelldiv').innerHTML = '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                    else if (tCell.querySelector('.e-headertext')) {
                        let innerText = tCell.querySelector('.e-headertext').innerText;
                        tCell.querySelector('.e-headertext').innerHTML = '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                }
                if (cell.hasChild === true) {
                    let hdrdiv = tCell.querySelector('.e-headercelldiv');
                    if (hdrdiv) {
                        hdrdiv.style.height = 'auto';
                        hdrdiv.style.lineHeight = 'normal';
                    }
                    let div = createElement('div', {
                        className: (cell.isDrilled === true ? COLLAPSE : EXPAND) + ' ' + ICON,
                        attrs: {
                            'title': cell.isDrilled === true ? this.parent.localeObj.getConstant('collapse') :
                                this.parent.localeObj.getConstant('expand')
                        }
                    });
                    tCell.children[0].classList.add(CELLVALUE);
                    if (window.navigator.userAgent.indexOf('Edge') > -1 || window.navigator.userAgent.indexOf('Trident') > -1) {
                        tCell.children[0].style.display = 'table';
                    }
                    else {
                        tCell.children[0].style.display = 'block';
                    }
                    tCell.insertBefore(div, tCell.children[0]);
                }
                tCell = this.appendValueSortIcon(cell, tCell, cell.rowIndex, cell.colIndex);
                this.unWireEvents(tCell);
                this.wireEvents(tCell);
            }
        }
        this.parent.trigger(headerCellInfo, args);
    }
    onHyperCellClick(e) {
        let cell = e.target.parentElement.parentElement;
        cell = (cell.className.indexOf('e-headercelldiv') > -1 ? cell.parentElement : cell);
        let args = {
            currentCell: cell,
            data: this.engine.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('aria-colindex'))],
            cancel: true
        };
        this.parent.trigger(hyperlinkCellClick, args);
        if (!args.cancel) {
            window.open(e.target.getAttribute('data-url'));
        }
    }
    getRowStartPos() {
        let pivotValues = this.parent.pivotValues;
        let rowPos;
        for (let rCnt = 0; rCnt < pivotValues.length; rCnt++) {
            if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }
        return rowPos;
    }
    frameDataSource(type) {
        let dataContent = [];
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
            if ((this.parent.enableValueSorting) || !this.engine.isEngineUpdated) {
                let rowCnt = 0;
                let pivotValues = this.parent.pivotValues;
                let start = type === 'value' ? this.rowStartPos : 0;
                let end = type === 'value' ? pivotValues.length : this.rowStartPos;
                for (let rCnt = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {};
                        for (let cCnt = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
                            if (pivotValues[rCnt][cCnt]) {
                                dataContent[rowCnt][cCnt] = pivotValues[rCnt][cCnt];
                            }
                        }
                        rowCnt++;
                    }
                }
            }
            else {
                dataContent = type === 'value' ? this.engine.valueContent : this.engine.headerContent;
            }
        }
        else {
            dataContent = this.frameEmptyData();
        }
        return dataContent;
    }
    frameEmptyData() {
        let dataContent = [{
                0: { formattedText: this.parent.localeObj.getConstant('grandTotal') },
                1: { formattedText: this.parent.localeObj.getConstant('emptyData') }
            }];
        return dataContent;
    }
    calculateColWidth(colCount) {
        let parWidth = isNaN(this.parent.width) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        let resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) : (this.parent.isAdaptive ? 140 : 200);
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.grid && this.parent.dataSource.rows.length > 0) {
            parWidth = parWidth - (this.gridSettings.columnWidth > resColWidth ? this.gridSettings.columnWidth : resColWidth);
            colCount = colCount - 1;
        }
        let colWidth = (colCount * this.gridSettings.columnWidth + 78) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return colWidth;
    }
    calculateGridWidth() {
        let parWidth = this.parent.width;
        if (this.parent.width === 'auto' && this.parent.element.offsetWidth < this.parent.totColWidth) {
            parWidth = this.parent.element.offsetWidth;
        }
        return parWidth;
    }
    frameStackedHeaders() {
        let integrateModel = [];
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
            let headerCnt = this.engine.headerContent.length;
            let headerSplit = [];
            let splitPos = [];
            let colWidth = this.calculateColWidth(this.engine.pivotValues[0].length);
            do {
                let columnModel = [];
                let actualCnt = 0;
                headerCnt--;
                let colField = this.engine.headerContent[headerCnt];
                if (colField) {
                    for (let cCnt = 0; cCnt < Object.keys(colField).length + (colField[0] ? 0 : 1); cCnt++) {
                        let colSpan = (colField[cCnt] && colField[cCnt].colSpan) ? colField[cCnt].colSpan : 1;
                        let rowSpan = (colField[cCnt] && colField[cCnt].rowSpan) ? colField[cCnt].rowSpan : 1;
                        let formattedText = colField[cCnt] ? (colField[cCnt].type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                            (colField[cCnt].type === 'sum' ? colField[cCnt].formattedText.split('Total')[0] + this.parent.localeObj.getConstant('total') :
                                colField[cCnt].formattedText)) : '';
                        if (headerCnt === this.engine.headerContent.length - 1) {
                            columnModel[actualCnt] = {
                                field: (cCnt + '.formattedText'),
                                headerText: formattedText,
                                customAttributes: { 'cell': colField[cCnt] },
                                width: colField[cCnt] ?
                                    this.setSavedWidth(colField[cCnt].valueSort.levelName, colWidth) : colWidth,
                                minWidth: 30,
                                format: cCnt === 0 ? '' : this.formatList[(cCnt - 1) % this.parent.dataSource.values.length],
                                allowReordering: this.parent.gridSettings.allowReordering,
                                allowResizing: this.parent.gridSettings.allowResizing,
                                visible: true
                            };
                        }
                        else if (headerSplit[cCnt]) {
                            let tmpSpan = colSpan;
                            let innerModel = [];
                            let innerPos = cCnt;
                            while (tmpSpan > 0) {
                                if (columnModel[actualCnt]) {
                                    if (!integrateModel[splitPos[innerPos]]) {
                                        break;
                                    }
                                    innerModel.push(integrateModel[splitPos[innerPos]]);
                                }
                                else {
                                    columnModel[actualCnt] = {
                                        headerText: formattedText,
                                        customAttributes: { 'cell': colField[cCnt] },
                                        width: colField[cCnt] ?
                                            this.setSavedWidth(colField[cCnt].valueSort.levelName, colWidth) : colWidth,
                                        minWidth: 30,
                                        allowReordering: this.parent.gridSettings.allowReordering,
                                        allowResizing: this.parent.gridSettings.allowResizing,
                                        visible: true
                                    };
                                    innerModel = [integrateModel[splitPos[innerPos]]];
                                }
                                tmpSpan = tmpSpan - headerSplit[innerPos];
                                innerPos = innerPos + headerSplit[innerPos];
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
            let resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) : (this.parent.isAdaptive ? 140 : 200);
            integrateModel[0] = {
                field: (0 + '.formattedText'),
                width: this.setSavedWidth('0.formattedText', colWidth < resColWidth ? resColWidth : colWidth),
                minWidth: 30,
                headerText: '',
                allowReordering: false,
                allowResizing: this.parent.gridSettings.allowResizing,
                visible: true
            };
        }
        else {
            integrateModel = this.frameEmptyColumns();
        }
        this.parent.triggerColumnRenderEvent(integrateModel);
        return integrateModel;
    }
    /** @hidden */
    setSavedWidth(column, width) {
        width = this.parent.resizeInfo[column] ? this.parent.resizeInfo[column] : width;
        return width;
    }
    frameEmptyColumns() {
        let columns = [];
        let colWidth = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: colWidth });
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    }
    /** @hidden */
    getFormatList() {
        let formatArray = [];
        for (let vCnt = 0; vCnt < this.parent.dataSource.values.length; vCnt++) {
            let field = this.parent.dataSource.values[vCnt];
            if (this.parent.dataSource.formatSettings.length > 0) {
                let format = '';
                for (let fCnt = 0; fCnt < this.parent.dataSource.formatSettings.length; fCnt++) {
                    let formatSettings = this.parent.dataSource.formatSettings[fCnt];
                    if (field.name === formatSettings.name) {
                        format = formatSettings.format;
                        break;
                    }
                    else {
                        continue;
                    }
                }
                formatArray.push(format);
            }
            else {
                formatArray.push('N');
            }
        }
        return formatArray;
    }
    excelColumnEvent(args) {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(excelHeaderQueryCellInfo, args);
    }
    pdfColumnEvent(args) {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(pdfHeaderQueryCellInfo, args);
    }
    excelRowEvent(args) {
        if (args.column.field === '0.formattedText') {
            let isValueCell = args.data[0].type === 'value';
            let level = isValueCell ? (this.lastSpan + 1) : args.data[0].level;
            this.colPos = 0;
            args.style = { hAlign: 'Left', indent: level * 2 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        }
        else {
            this.colPos++;
            args.value = args.data[this.colPos].value || args.data[this.colPos].formattedText;
        }
        args = this.exportContentEvent(args);
        this.parent.trigger(excelQueryCellInfo, args);
    }
    /* tslint:disable:no-any */
    pdfRowEvent(args) {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            let isValueCell = args.data[0].type === 'value';
            let level = isValueCell ? (this.lastSpan + 1) : args.data[0].level;
            args.style = { paragraphIndent: level * 10 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        }
        this.parent.trigger(pdfQueryCellInfo, args);
    }
    exportHeaderEvent(args) {
        let rowSpan = 1;
        if (args.gridCell.column.customAttributes) {
            let cell = args.gridCell.column.customAttributes.cell;
            rowSpan = cell.rowSpan ? cell.rowSpan : 1;
        }
        else {
            rowSpan = Object.keys(this.engine.headerContent).length;
        }
        if (args.cell.rowSpan && args.cell.rowSpan !== rowSpan && rowSpan > -1) {
            args.cell.rowSpan = rowSpan;
        }
        return args;
    }
    exportContentEvent(args) {
        if (args.value === '0') {
            args.value = '';
        }
        args.value = args.data[Number(args.column.field.split('.formattedText')[0])].type === 'grand sum' ?
            this.parent.localeObj.getConstant('grandTotal') : args.value;
        return args;
    }
    unWireEvents(cell) {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.remove(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick);
        }
        else {
            return;
        }
    }
    wireEvents(cell) {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.add(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick, this);
        }
        else {
            return;
        }
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the fields in dataSource.
 */
class FieldOptions extends ChildProperty {
}
__decorate$1([
    Property()
], FieldOptions.prototype, "name", void 0);
__decorate$1([
    Property()
], FieldOptions.prototype, "caption", void 0);
__decorate$1([
    Property('Sum')
], FieldOptions.prototype, "type", void 0);
__decorate$1([
    Property()
], FieldOptions.prototype, "axis", void 0);
__decorate$1([
    Property(false)
], FieldOptions.prototype, "showNoDataItems", void 0);
__decorate$1([
    Property()
], FieldOptions.prototype, "baseField", void 0);
__decorate$1([
    Property()
], FieldOptions.prototype, "baseItem", void 0);
__decorate$1([
    Property(true)
], FieldOptions.prototype, "showSubTotals", void 0);

/**
 * Configures the style settings.
 */
class Style extends ChildProperty {
}
__decorate$1([
    Property()
], Style.prototype, "backgroundColor", void 0);
__decorate$1([
    Property()
], Style.prototype, "color", void 0);
__decorate$1([
    Property()
], Style.prototype, "fontFamily", void 0);
__decorate$1([
    Property()
], Style.prototype, "fontSize", void 0);
/**
 * Configures the filter settings.
 */
class Filter extends ChildProperty {
}
__decorate$1([
    Property()
], Filter.prototype, "name", void 0);
__decorate$1([
    Property('Include')
], Filter.prototype, "type", void 0);
__decorate$1([
    Property()
], Filter.prototype, "items", void 0);
__decorate$1([
    Property('DoesNotEquals')
], Filter.prototype, "condition", void 0);
__decorate$1([
    Property()
], Filter.prototype, "value1", void 0);
__decorate$1([
    Property()
], Filter.prototype, "value2", void 0);
__decorate$1([
    Property()
], Filter.prototype, "measure", void 0);
/**
 * Configures the conditional format settings.
 */
class ConditionalFormatSettings extends ChildProperty {
}
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "measure", void 0);
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "label", void 0);
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "conditions", void 0);
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "value1", void 0);
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "value2", void 0);
__decorate$1([
    Property()
], ConditionalFormatSettings.prototype, "style", void 0);
/**
 * Configures the sort settings.
 */
class Sort extends ChildProperty {
}
__decorate$1([
    Property()
], Sort.prototype, "name", void 0);
__decorate$1([
    Property('Ascending')
], Sort.prototype, "order", void 0);
/**
 * Configures the format settings of value fields.
 */
class FormatSettings extends ChildProperty {
}
__decorate$1([
    Property()
], FormatSettings.prototype, "name", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "minimumFractionDigits", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "maximumFractionDigits", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "minimumSignificantDigits", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "maximumSignificantDigits", void 0);
__decorate$1([
    Property(true)
], FormatSettings.prototype, "useGrouping", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "skeleton", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "type", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "currency", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "minimumIntegerDigits", void 0);
__decorate$1([
    Property()
], FormatSettings.prototype, "format", void 0);
/**
 * Configures the calculatedfields settings.
 */
class CalculatedFieldSettings extends ChildProperty {
}
__decorate$1([
    Property()
], CalculatedFieldSettings.prototype, "name", void 0);
__decorate$1([
    Property()
], CalculatedFieldSettings.prototype, "formula", void 0);
/**
 * Configures drilled state of field members.
 */
class DrillOptions extends ChildProperty {
}
__decorate$1([
    Property()
], DrillOptions.prototype, "name", void 0);
__decorate$1([
    Property()
], DrillOptions.prototype, "items", void 0);
/**
 * Configures value sort settings.
 */
class ValueSortSettings extends ChildProperty {
}
__decorate$1([
    Property()
], ValueSortSettings.prototype, "headerText", void 0);
__decorate$1([
    Property('.')
], ValueSortSettings.prototype, "headerDelimiter", void 0);
__decorate$1([
    Property('None')
], ValueSortSettings.prototype, "sortOrder", void 0);
/**
 * Configures the settings of dataSource.
 */
class DataSource extends ChildProperty {
}
__decorate$1([
    Property()
], DataSource.prototype, "data", void 0);
__decorate$1([
    Collection([], FieldOptions)
], DataSource.prototype, "rows", void 0);
__decorate$1([
    Collection([], FieldOptions)
], DataSource.prototype, "columns", void 0);
__decorate$1([
    Collection([], FieldOptions)
], DataSource.prototype, "values", void 0);
__decorate$1([
    Collection([], FieldOptions)
], DataSource.prototype, "filters", void 0);
__decorate$1([
    Property(false)
], DataSource.prototype, "expandAll", void 0);
__decorate$1([
    Property('column')
], DataSource.prototype, "valueAxis", void 0);
__decorate$1([
    Collection([], Filter)
], DataSource.prototype, "filterSettings", void 0);
__decorate$1([
    Collection([], Sort)
], DataSource.prototype, "sortSettings", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "enableSorting", void 0);
__decorate$1([
    Property(false)
], DataSource.prototype, "allowLabelFilter", void 0);
__decorate$1([
    Property(false)
], DataSource.prototype, "allowValueFilter", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showSubTotals", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showRowSubTotals", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showColumnSubTotals", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showGrandTotals", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showRowGrandTotals", void 0);
__decorate$1([
    Property(true)
], DataSource.prototype, "showColumnGrandTotals", void 0);
__decorate$1([
    Property([])
], DataSource.prototype, "formatSettings", void 0);
__decorate$1([
    Collection([], DrillOptions)
], DataSource.prototype, "drilledMembers", void 0);
__decorate$1([
    Complex({}, ValueSortSettings)
], DataSource.prototype, "valueSortSettings", void 0);
__decorate$1([
    Collection([], CalculatedFieldSettings)
], DataSource.prototype, "calculatedFieldSettings", void 0);
__decorate$1([
    Collection([], ConditionalFormatSettings)
], DataSource.prototype, "conditionalFormatSettings", void 0);

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *  Represents Pivot widget model class.
 */
class GridSettings extends ChildProperty {
}
__decorate$2([
    Property('Both')
], GridSettings.prototype, "gridLines", void 0);
__decorate$2([
    Property(false)
], GridSettings.prototype, "allowTextWrap", void 0);
__decorate$2([
    Property(false)
], GridSettings.prototype, "allowReordering", void 0);
__decorate$2([
    Property(true)
], GridSettings.prototype, "allowResizing", void 0);
__decorate$2([
    Property(null)
], GridSettings.prototype, "rowHeight", void 0);
__decorate$2([
    Property(110)
], GridSettings.prototype, "columnWidth", void 0);
__decorate$2([
    Property('Ellipsis')
], GridSettings.prototype, "clipMode", void 0);
__decorate$2([
    Property(false)
], GridSettings.prototype, "allowSelection", void 0);
__decorate$2([
    Property(-1)
], GridSettings.prototype, "selectedRowIndex", void 0);
__decorate$2([
    Property({ mode: 'Row', cellSelectionMode: 'Flow', type: 'Single' })
], GridSettings.prototype, "selectionSettings", void 0);
__decorate$2([
    Property('AllPages')
], GridSettings.prototype, "printMode", void 0);
__decorate$2([
    Property()
], GridSettings.prototype, "contextMenuItems", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "beforeCopy", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "printComplete", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "beforePrint", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "contextMenuOpen", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "contextMenuClick", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "queryCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "headerCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "rowSelecting", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "rowSelected", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "rowDeselecting", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "rowDeselected", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "cellSelecting", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "cellSelected", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "cellDeselecting", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "cellDeselected", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "resizeStart", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "resizing", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "resizeStop", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "pdfHeaderQueryCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "pdfQueryCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "excelHeaderQueryCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "excelQueryCellInfo", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "columnDragStart", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "columnDrag", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "columnDrop", void 0);
__decorate$2([
    Event()
], GridSettings.prototype, "beforeColumnsRender", void 0);

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
class ExcelExport$1 {
    /**
     * Constructor for the PivotGrid Excel Export module.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'excelExport';
    }
    /**
     * Method to perform excel export.
     * @hidden
     */
    exportToExcel(type) {
        /** Event trigerring */
        if (this.parent.enableVirtualization) {
            let pageSettings = this.parent.engineModule.pageSettings;
            this.parent.engineModule.pageSettings = null;
            this.parent.engineModule.generateGridData(this.parent.dataSource);
            this.parent.engineModule.pageSettings = pageSettings;
        }
        let args = {
            fileName: 'default', header: '', footer: '', dataCollections: [this.parent.engineModule.pivotValues]
        };
        this.parent.trigger(beforeExport, args);
        let fileName = args.fileName;
        let dataCollections = args.dataCollections;
        /** Fill data and export */
        /* tslint:disable-next-line:no-any */
        let workSheets = [];
        for (let dataColl = 0; dataColl < dataCollections.length; dataColl++) {
            let pivotValues = dataCollections[dataColl];
            let colLen = 0;
            let rowLen = pivotValues.length;
            let actualrCnt = 0;
            let formatList = this.parent.renderModule.getFormatList();
            let rows = [];
            let maxLevel = 0;
            for (let rCnt = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt]) {
                    actualrCnt++;
                    colLen = pivotValues[rCnt].length;
                    let cells = [];
                    for (let cCnt = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt][cCnt]) {
                            let pivotCell = pivotValues[rCnt][cCnt];
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                let cellValue = pivotCell.axis === 'value' ? pivotCell.value : pivotCell.formattedText;
                                if (pivotCell.type === 'grand sum') {
                                    cellValue = this.parent.localeObj.getConstant('grandTotal');
                                }
                                else if (pivotCell.type === 'sum') {
                                    cellValue = cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total'));
                                }
                                else {
                                    cellValue = cellValue === '0' ? '' : cellValue;
                                }
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    cells.push({
                                        index: cCnt + 1, value: cellValue,
                                        colSpan: pivotCell.colSpan, rowSpan: pivotCell.rowSpan,
                                    });
                                    if (pivotCell.axis === 'value') {
                                        cells[cells.length - 1].style = {
                                            numberFormat: formatList[(cCnt - 1) % this.parent.dataSource.values.length],
                                            bold: false,
                                            wrapText: true
                                        };
                                        if (pivotCell.style) {
                                            cells[cells.length - 1].style.backColor = pivotCell.style.backgroundColor;
                                            cells[cells.length - 1].style.fontColor = pivotCell.style.color;
                                            cells[cells.length - 1].style.fontName = pivotCell.style.fontFamily;
                                            cells[cells.length - 1].style.fontSize = Number(pivotCell.style.fontSize.split('px')[0]);
                                        }
                                    }
                                    else {
                                        cells[cells.length - 1].style = {
                                            bold: true,
                                            vAlign: 'Center',
                                            wrapText: true,
                                            indent: cCnt === 1 ? pivotCell.level * 10 : 0
                                        };
                                        if (pivotCell.axis === 'row' && cCnt === 0) {
                                            cells[cells.length - 1].style.hAlign = 'Left';
                                            cells[cells.length - 1].style.indent = pivotCell.level * 2;
                                            maxLevel = pivotCell.level > maxLevel ? pivotCell.level : maxLevel;
                                        }
                                    }
                                    cells[cells.length - 1].style.borders = { color: '#000000', lineStyle: 'Thin' };
                                }
                            }
                            cCnt = cCnt + (pivotCell.colSpan ? (pivotCell.colSpan - 1) : 0);
                        }
                        else {
                            cells.push({
                                index: cCnt + 1, value: '', colSpan: 1, rowSpan: 1,
                            });
                        }
                    }
                    rows.push({ index: actualrCnt, cells: cells });
                }
            }
            let columns = [];
            for (let cCnt = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: rows });
        }
        let book = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv');
        book.save(fileName + (type === 'Excel' ? '.xlsx' : '.csv'));
    }
}

/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
class PDFExport {
    /**
     * Constructor for the PivotGrid PDF Export module.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'pdfExport';
    }
    /**
     * Method to perform pdf export.
     * @hidden
     */
    exportToPDF() {
        let eventParams = this.applyEvent();
        /** Fill data and export */
        let dataCollIndex = 0;
        let gridResult;
        let pivotValues = eventParams.args.dataCollections[dataCollIndex];
        let colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        let integratedCnt = 0;
        do {
            let pdfGrid = new PdfGrid();
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= 6 ? 6 : pivotValues[0].length - integratedCnt);
                let rowLen = pivotValues.length;
                let actualrCnt = 0;
                let maxLevel = 0;
                for (let rCnt = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt]) {
                        let isColHeader = !(pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row');
                        let colLen = pivotValues[rCnt].length > (integratedCnt + 6) ? (integratedCnt + 6) :
                            pivotValues[rCnt].length;
                        if (isColHeader) {
                            pdfGrid.headers.add(1);
                        }
                        let pdfGridRow = !isColHeader ? pdfGrid.rows.addRow() : pdfGrid.headers.getHeader(actualrCnt);
                        let localCnt = 0;
                        let isEmptyRow = true;
                        for (let cCnt = integratedCnt; cCnt < colLen; cCnt++) {
                            let isValueCell = false;
                            if (pivotValues[rCnt][cCnt]) {
                                let pivotCell = pivotValues[rCnt][cCnt];
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    let cellValue = pivotCell.formattedText;
                                    cellValue = pivotCell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
                                        (pivotCell.type === 'sum' ?
                                            cellValue.toString().replace('Total', this.parent.localeObj.getConstant('total')) :
                                            (cellValue === '0' ? '' : cellValue));
                                    if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                        pdfGridRow.cells.getCell(localCnt).columnSpan = pivotCell.colSpan ?
                                            (6 - localCnt < pivotCell.colSpan ? 6 - localCnt : pivotCell.colSpan) : 1;
                                        if (isColHeader && pivotCell.rowSpan && pivotCell.rowSpan > 1) {
                                            pdfGridRow.cells.getCell(localCnt).rowSpan = pivotCell.rowSpan ? pivotCell.rowSpan : 1;
                                        }
                                        pdfGridRow.cells.getCell(localCnt).value = cellValue ? cellValue.toString() : '';
                                    }
                                    if (cellValue !== '') {
                                        isEmptyRow = false;
                                    }
                                }
                                maxLevel = pivotCell.level > maxLevel && cCnt === 0 ? pivotCell.level : maxLevel;
                                isValueCell = pivotCell.axis === 'value';
                                cCnt = cCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                localCnt = localCnt + (pdfGridRow.cells.getCell(localCnt).columnSpan ?
                                    (pdfGridRow.cells.getCell(localCnt).columnSpan - 1) : 0);
                                if (pivotCell.style) {
                                    pdfGridRow = this.applyStyle(pdfGridRow, pivotCell, localCnt);
                                }
                            }
                            else {
                                pdfGridRow.cells.getCell(localCnt).value = '';
                                if (cCnt === 0 && isColHeader && this.parent.dataSource.columns &&
                                    this.parent.dataSource.columns.length > 0) {
                                    pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan++;
                                }
                            }
                            let stringFormat = new PdfStringFormat();
                            stringFormat.paragraphIndent = (!isColHeader && cCnt === 0 && pivotValues[rCnt][cCnt]) ?
                                pivotValues[rCnt][cCnt].level * 15 : 0;
                            stringFormat.alignment = isValueCell ? PdfTextAlignment.Right : PdfTextAlignment.Left;
                            stringFormat.lineAlignment = PdfVerticalAlignment.Middle;
                            pdfGridRow.cells.getCell(localCnt).style.stringFormat = stringFormat;
                            localCnt++;
                        }
                        if (isEmptyRow) {
                            pdfGridRow.height = 16;
                        }
                        actualrCnt++;
                    }
                }
                if (integratedCnt === 0) {
                    pdfGrid.columns.getColumn(0).width = 100 + (maxLevel * 20);
                }
            }
            let layout = new PdfLayoutFormat();
            layout.paginateBounds = new RectangleF(0, 0, 0, 0);
            if (integratedCnt === 0 && this.parent.dataSource.columns && this.parent.dataSource.columns.length > 0) {
                pdfGrid.headers.getHeader(0).cells.getCell(0).rowSpan--;
            }
            if (gridResult) {
                gridResult = pdfGrid.draw(gridResult.page, new PointF(10, gridResult.bounds.y + gridResult.bounds.height + 10), layout);
            }
            else {
                gridResult = pdfGrid.draw(eventParams.page, new PointF(10, 20), layout);
            }
            integratedCnt = integratedCnt + 6;
            if (integratedCnt >= colLength && eventParams.args.dataCollections.length > (dataCollIndex + 1)) {
                dataCollIndex++;
                pivotValues = eventParams.args.dataCollections[dataCollIndex];
                colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
                integratedCnt = 0;
            }
        } while (integratedCnt < colLength);
        eventParams.document.save(eventParams.args.fileName + '.pdf');
        eventParams.document.destroy();
    }
    applyStyle(pdfGridRow, pivotCell, localCnt) {
        let color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.backgroundColor);
        let brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.backgroundBrush = brush;
        let size = Number(pivotCell.style.fontSize.split('px')[0]);
        let font = new PdfStandardFont(PdfFontFamily.TimesRoman, size, PdfFontStyle.Regular);
        pdfGridRow.cells.getCell(localCnt).style.font = font;
        color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.color);
        brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.textBrush = brush;
        return pdfGridRow;
    }
    applyEvent() {
        /** Event trigerring */
        if (this.parent.enableVirtualization) {
            let pageSettings = this.parent.engineModule.pageSettings;
            this.parent.engineModule.pageSettings = null;
            this.parent.engineModule.generateGridData(this.parent.dataSource);
            this.parent.engineModule.pageSettings = pageSettings;
        }
        let args = {
            fileName: 'default', header: '', footer: '', dataCollections: [this.parent.engineModule.pivotValues]
        };
        this.parent.trigger(beforeExport, args);
        let header = args.header;
        let footer = args.footer;
        let document = new PdfDocument();
        let page = document.pages.add();
        /** Header and Footer to be set */
        let font = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        let brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        let pen = new PdfPen(new PdfColor(0, 0, 0), .5);
        let headerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.top = headerTemplate;
        let footerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.bottom = footerTemplate;
        return { document: document, page: page, args: args };
    }
}

/**
 * PivotView Keyboard interaction
 */
/** @hidden */
class KeyboardInteraction {
    /**
     * Constructor
     */
    constructor(parent) {
        this.keyConfigs = {
            tab: 'tab',
            enter: 'enter',
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.pivotViewKeyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'tab':
                this.processTab(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
        }
    }
    getNextButton(target) {
        let allPivotButtons = [].slice.call(this.parent.element.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
        let nextElement = target;
        if (this.parent.grid.element.querySelector('.' + PIVOT_BUTTON_CLASS)) {
            let len = allPivotButtons.length;
            for (let i = 0; i < len; i++) {
                if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    nextElement = allPivotButtons[i + 1] ? allPivotButtons[i + 1] : nextElement;
                    break;
                }
            }
        }
        return nextElement;
    }
    processTab(e) {
        let target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS)) {
            let gridFocus = this.parent.grid.serviceLocator.getService('focus');
            let nextButton = this.getNextButton(target);
            if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                gridFocus.currentInfo.skipAction = true;
                nextButton.focus();
            }
            else {
                gridFocus.focus();
                let element = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
            e.preventDefault();
            return;
        }
        else if (!this.parent.showGroupingBar && this.parent.showFieldList) {
            if (target && closest(target, '.' + TOGGLE_FIELD_LIST_CLASS)) {
                let gridFocus = this.parent.grid.serviceLocator.getService('focus');
                gridFocus.focus();
                let element = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
        }
        else if (!this.parent.showGroupingBar && !this.parent.showFieldList) {
            if (target && closest(target, '.' + PIVOT_VIEW_CLASS)) {
                let gridElement = closest(target, '.' + PIVOT_VIEW_CLASS);
                let gridFocus = this.parent.grid.serviceLocator.getService('focus');
                let rows = [].slice.call(gridElement.getElementsByTagName('tr'));
                if (target.innerHTML === (rows[rows.length - 1]).lastChild.innerHTML) {
                    gridFocus.currentInfo.skipAction = true;
                }
                else {
                    gridFocus.focus();
                    let element = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                }
            }
        }
    }
    processEnter(e) {
        let target = e.target;
        if (target && closest(target, '.' + GRID_CLASS)) {
            if (target.querySelector('.' + ICON)) {
                target.querySelector('.' + ICON).click();
            }
            else if (target.classList.contains('e-valuescontent')) {
                target.dispatchEvent(new MouseEvent('dblclick', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                }));
            }
            e.preventDefault();
            return;
        }
    }
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * Module to render Pivot button
 */
/** @hidden */
class PivotContextMenu {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
        this.parent.contextMenuModule = this;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    render() {
        this.renderContextMenu();
    }
    renderContextMenu() {
        let menuItems = [
            { text: this.parent.localeObj.getConstant('addToFilter'), id: 'Context_Filters' },
            { text: this.parent.localeObj.getConstant('addToRow'), id: 'Context_Rows' },
            { text: this.parent.localeObj.getConstant('addToColumn'), id: 'Context_Columns' },
            { text: this.parent.localeObj.getConstant('addToValue'), id: 'Context_Values' }
        ];
        let menuOptions = {
            cssClass: PIVOT_CONTEXT_MENU_CLASS,
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.onBeforeMenuOpen.bind(this),
            select: this.onSelectContextMenu.bind(this)
        };
        this.parent.element.appendChild(createElement('ul', {
            id: this.parent.element.id + '_PivotContextMenu'
        }));
        this.menuObj = new ContextMenu$1(menuOptions);
        this.menuObj.appendTo('#' + this.parent.element.id + '_PivotContextMenu');
    }
    onBeforeMenuOpen(args) {
        let items = [].slice.call(args.element.querySelectorAll('li'));
        let fieldType = this.fieldElement.querySelector('.' + PIVOT_BUTTON_CONTENT_CLASS).getAttribute('data-type');
        removeClass(items, MENU_DISABLE);
        if (fieldType === 'CalculatedField') {
            for (let item of items) {
                if (item.textContent !== this.parent.localeObj.getConstant('addToValue')) {
                    addClass([item], MENU_DISABLE);
                }
            }
        }
    }
    onSelectContextMenu(menu) {
        if (menu.element.textContent !== null) {
            let fieldName = this.fieldElement.getAttribute('data-uid');
            let dropClass = menu.item.id.replace('Context_', '').toLowerCase();
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, dropClass, -1);
            this.parent.updateDataSource(true);
            this.fieldElement = undefined;
        }
    }
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    destroy() {
        if (!this.parent.isDestroyed) {
            return;
        }
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
class VirtualScroll$1 {
    /**
     * Constructor for PivotView scrolling.
     * @hidden
     */
    constructor(parent) {
        this.previousValues = { top: 0, left: 0 };
        this.frozenPreviousValues = { top: 0, left: 0 };
        this.eventType = '';
        this.parent = parent;
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    getModuleName() {
        return 'virtualscroll';
    }
    addInternalEvents() {
        this.parent.on(contentReady, this.wireEvents, this);
    }
    wireEvents() {
        let mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
        let fCont = this.parent.element.querySelector('.' + FROZENCONTENT_DIV);
        let mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
        EventHandler.clearEvents(mCont);
        EventHandler.clearEvents(fCont);
        if (this.parent.engineModule) {
            EventHandler.add(mCont, 'scroll touchmove pointermove', this.onHorizondalScroll(mHdr, mCont, fCont), this);
            EventHandler.add(mCont, 'scroll wheel touchmove pointermove', this.onVerticalScroll(fCont, mCont), this);
            EventHandler.add(mCont, 'mouseup touchend', this.common(mHdr, mCont, fCont), this);
            EventHandler.add(fCont, 'wheel', this.onWheelScroll(mCont, fCont), this);
            EventHandler.add(fCont, 'touchstart pointerdown', this.setPageXY(), this);
            EventHandler.add(fCont, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
            EventHandler.add(mHdr, 'touchstart pointerdown', this.setPageXY(), this);
            EventHandler.add(mHdr, 'touchmove pointermove', this.onTouchScroll(mHdr, mCont, fCont), this);
        }
        this.parent.grid.isPreventScrollEvent = true;
    }
    onWheelScroll(mCont, fCont) {
        let element = mCont;
        return (e) => {
            let top = element.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            fCont.scrollTop = top;
            element.scrollTop = top;
            this.frozenPreviousValues.top = top;
            this.eventType = e.type;
        };
    }
    onTouchScroll(mHdr, mCont, fCont) {
        let element = mCont;
        return (e) => {
            if (e.pointerType === 'mouse') {
                return;
            }
            let pageXY = this.getPointXY(e);
            let top = element.scrollTop + (this.pageXY.y - pageXY.y);
            let left = element.scrollLeft + (this.pageXY.x - pageXY.x);
            if (this.parent.element.querySelector('.' + HEADERCONTENT).contains(e.target)) {
                if (this.frozenPreviousValues.left === left || left < 0) {
                    return;
                }
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                this.pageXY.x = pageXY.x;
                this.frozenPreviousValues.left = left;
            }
            else {
                if (this.frozenPreviousValues.top === top || top < 0) {
                    return;
                }
                fCont.scrollTop = top;
                element.scrollTop = top;
                this.pageXY.y = pageXY.y;
                this.frozenPreviousValues.top = top;
            }
            this.eventType = e.type;
        };
    }
    setPageXY() {
        return (e) => {
            if (e.pointerType === 'mouse') {
                return;
            }
            this.pageXY = this.getPointXY(e);
        };
    }
    getPointXY(e) {
        let pageXY = { x: 0, y: 0 };
        if (e.touches && e.touches.length) {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        else {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        return pageXY;
    }
    update(mHdr, mCont, top, left, e) {
        if (this.direction === 'vertical') {
            let rowValues = this.parent.dataSource.valueAxis === 'row' ? this.parent.dataSource.values.length : 1;
            let exactSize = (this.parent.pageSettings.rowSize * rowValues * this.parent.gridSettings.rowHeight);
            let section = Math.ceil(top / exactSize);
            if (this.parent.scrollPosObject.vertical === section) {
                hideSpinner(this.parent.element);
                return;
            }
            showSpinner(this.parent.element);
            this.parent.scrollPosObject.vertical = section;
            this.parent.engineModule.pageSettings.rowCurrentPage = section > 1 ? section : 1;
            this.parent.engineModule.generateGridData(this.parent.dataSource, this.parent.engineModule.headerCollection);
            this.parent.pivotValues = this.parent.engineModule.pivotValues;
            let exactPage = Math.ceil(this.parent.engineModule.rowStartPos / (this.parent.pageSettings.rowSize * rowValues));
            let pos = exactSize * exactPage -
                (this.parent.engineModule.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
            this.parent.scrollPosObject.verticalSection = pos;
        }
        else {
            let colValues = this.parent.dataSource.valueAxis === 'column' ? this.parent.dataSource.values.length : 1;
            let exactSize = (this.parent.pageSettings.columnSize *
                colValues * this.parent.gridSettings.columnWidth);
            let section = Math.ceil(left / exactSize);
            if (this.parent.scrollPosObject.horizontal === section) {
                hideSpinner(this.parent.element);
                return;
            }
            showSpinner(this.parent.element);
            this.parent.scrollPosObject.horizontal = section;
            this.parent.engineModule.pageSettings.columnCurrentPage = section > 1 ? section : 1;
            this.parent.engineModule.generateGridData(this.parent.dataSource, this.parent.engineModule.headerCollection);
            // let isLastPage: boolean =
            //     (this.parent.engineModule.pivotValues[0] as IAxisSet[])[this.parent.engineModule.pivotValues[0].length - 1].type
            //     === 'grand sum' && section > 0;
            this.parent.pivotValues = this.parent.engineModule.pivotValues;
            let exactPage = Math.ceil(this.parent.engineModule.colStartPos / (this.parent.pageSettings.columnSize * colValues));
            // let pos: number = isLastPage ?
            //     ((left + mHdr.clientWidth) - ((mHdr.querySelector('.' + cls.TABLE) as HTMLElement).offsetWidth)) :
            //     exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
            //         colValues * this.parent.gridSettings.columnWidth);
            let pos = exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
                colValues * this.parent.gridSettings.columnWidth);
            this.parent.scrollPosObject.horizontalSection = pos;
        }
    }
    common(mHdr, mCont, fCont) {
        return (e) => {
            this.update(mHdr, mCont, mCont.scrollTop, mCont.scrollLeft, e);
        };
    }
    onHorizondalScroll(mHdr, mCont, fCont) {
        /* tslint:disable-next-line */
        let timeOutObj;
        return (e) => {
            let left = mCont.scrollLeft;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(() => {
                    left = e.type === 'touchmove' ? mCont.scrollLeft : left;
                    this.update(mHdr, mCont, mCont.scrollTop, left, e);
                }, 300);
            }
            if (this.previousValues.left === left) {
                fCont.scrollTop = mCont.scrollTop;
                return;
            }
            this.direction = 'horizondal';
            let excessMove = this.parent.scrollPosObject.horizontalSection > left ?
                -(this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                (this.parent.scrollPosObject.horizontalSection + mCont.querySelector('.e-table').offsetWidth));
            if (this.parent.scrollPosObject.horizontalSection > left ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (left > mHdr.clientWidth) {
                    if (this.parent.scrollPosObject.left < 1) {
                        this.parent.scrollPosObject.left = mHdr.clientWidth;
                    }
                    this.parent.scrollPosObject.left = this.parent.scrollPosObject.left - 50;
                    excessMove = this.parent.scrollPosObject.horizontalSection > left ?
                        (excessMove - this.parent.scrollPosObject.left) : (excessMove + this.parent.scrollPosObject.left);
                }
                else {
                    excessMove = -this.parent.scrollPosObject.horizontalSection;
                }
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + (this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' +
                        this.parent.scrollPosObject.verticalSection + 'px)'
                });
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: 'translate(' + (this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' + 0 + 'px)'
                });
                this.parent.scrollPosObject.horizontalSection = this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            this.previousValues.left = left;
            this.frozenPreviousValues.left = left;
            this.eventType = '';
            mHdr.scrollLeft = mCont.scrollLeft;
        };
    }
    onVerticalScroll(fCont, mCont) {
        /* tslint:disable-next-line */
        let timeOutObj;
        return (e) => {
            let top = mCont.scrollTop;
            if (e.type === 'wheel' || e.type === 'touchmove' || this.eventType === 'wheel' || this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(() => {
                    this.update(null, mCont, mCont.scrollTop, mCont.scrollLeft, e);
                }, 300);
            }
            if (this.previousValues.top === top) {
                return;
            }
            this.direction = 'vertical';
            let excessMove = this.parent.scrollPosObject.verticalSection > top ?
                -(this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.clientHeight) -
                (this.parent.scrollPosObject.verticalSection + fCont.querySelector('.e-table').offsetHeight));
            if (this.parent.scrollPosObject.verticalSection > top ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (top > fCont.clientHeight) {
                    if (this.parent.scrollPosObject.top < 1) {
                        this.parent.scrollPosObject.top = fCont.clientHeight;
                    }
                    this.parent.scrollPosObject.top = this.parent.scrollPosObject.top - 50;
                    excessMove = this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - this.parent.scrollPosObject.top) : (excessMove + this.parent.scrollPosObject.top);
                }
                else {
                    excessMove = -this.parent.scrollPosObject.verticalSection;
                }
                setStyleAttribute(fCont.querySelector('.e-table'), {
                    transform: 'translate(' + 0 + 'px,' + (this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + this.parent.scrollPosObject.horizontalSection + 'px,' +
                        (this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                this.parent.scrollPosObject.verticalSection = this.parent.scrollPosObject.verticalSection + excessMove;
            }
            this.previousValues.top = top;
            this.frozenPreviousValues.top = top;
            this.eventType = '';
            fCont.scrollTop = mCont.scrollTop;
            mCont.scrollTop = fCont.scrollTop;
        };
    }
    /**
     * @hidden
     */
    removeInternalEvents() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.wireEvents);
    }
    /**
     * To destroy the virtualscrolling event listener
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeInternalEvents();
    }
}

/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
class DrillThroughDialog {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.isUpdated = false;
        this.gridIndexObjects = {};
        this.parent = parent;
    }
    /** @hidden */
    showDrillThroughDialog(eventArgs) {
        this.removeDrillThroughDialog();
        let drillThroughDialog = createElement('div', {
            id: this.parent.element.id + '_drillthrough',
            className: DRILLTHROUGH_DIALOG,
            styles: 'visibility:hidden;'
        });
        this.parent.element.appendChild(drillThroughDialog);
        this.dialogPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('details'),
            content: this.createDrillThroughGrid(eventArgs),
            beforeOpen: () => {
                /* tslint:disable:align */
                this.drillThroughGrid.setProperties({
                    dataSource: this.parent.editSettings.allowEditing ?
                        this.dataWithPrimarykey(eventArgs) : eventArgs.rawData, height: 300
                }, true);
                /* tslint:enable:align */
                this.drillThroughGrid.enableVirtualization = !this.parent.editSettings.allowEditing;
            },
            beforeClose: () => {
                if (this.parent.editSettings.allowEditing && this.isUpdated) {
                    let count = Object.keys(this.gridIndexObjects).length;
                    let addItems = [];
                    /* tslint:disable:no-string-literal */
                    for (let item of this.drillThroughGrid.dataSource) {
                        if (isNullOrUndefined(item['__index']) || item['__index'] === '') {
                            for (let field of this.parent.engineModule.fields) {
                                if (isNullOrUndefined(item[field])) {
                                    delete item[field];
                                }
                            }
                            delete item['__index'];
                            addItems.push(item);
                        }
                        else if (count > 0) {
                            delete this.gridIndexObjects[item['__index'].toString()];
                            count--;
                        }
                    }
                    count = 0;
                    let items = [];
                    for (let item of this.parent.dataSource.data) {
                        delete item['__index'];
                        if (this.gridIndexObjects[count.toString()] === undefined) {
                            items.push(item);
                        }
                        count++;
                    }
                    /* tslint:enable:no-string-literal */
                    items = items.concat(addItems);
                    this.parent.setProperties({ dataSource: { data: items } }, true);
                    this.parent.engineModule.updateGridData(this.parent.dataSource);
                    this.parent.pivotValues = this.parent.engineModule.pivotValues;
                }
                this.isUpdated = false;
                this.gridIndexObjects = {};
            },
            isModal: true,
            visible: true,
            showCloseIcon: true,
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            width: this.parent.isAdaptive ? '100%' : '60%',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            target: document.body,
            close: this.removeDrillThroughDialog.bind(this)
        });
        this.dialogPopUp.appendTo(drillThroughDialog);
        setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
    }
    removeDrillThroughDialog() {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        let dialogElement = document.getElementById(this.parent.element.id + '_drillthrough');
        if (dialogElement) {
            remove(dialogElement);
        }
        if (document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg')) {
            remove(document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg'));
        }
    }
    /* tslint:disable:max-func-body-length */
    createDrillThroughGrid(eventArgs) {
        let drillThroughBody = createElement('div', { id: this.parent.element.id + '_drillthroughbody', className: DRILLTHROUGH_BODY_CLASS });
        let drillThroughBodyHeader = createElement('div', {
            id: this.parent.element.id +
                '_drillthroughbodyheader', className: DRILLTHROUGH_BODY_HEADER_CONTAINER_CLASS
        });
        if (eventArgs.rowHeaders !== '') {
            drillThroughBodyHeader.innerHTML = '<span class=' +
                DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' + DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                this.parent.localeObj.getConstant('row') + '</span> :<span class=' +
                DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + eventArgs.rowHeaders + '</span></span>';
        }
        if (eventArgs.columnHeaders !== '') {
            drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                DRILLTHROUGH_BODY_HEADER_CLASS + '>' + this.parent.localeObj.getConstant('column') +
                '</span> :<span class=' + DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' +
                eventArgs.columnHeaders + '</span></span>';
        }
        if (eventArgs.value !== '') {
            let measure = eventArgs.value.split('(')[0];
            let value = eventArgs.value.split('(')[1].split(')')[0];
            if (value !== '0') {
                drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                    DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                    DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                    measure + '</span> :<span class=' + DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + value + '</span></span>';
            }
        }
        let toolbarItems = ['ColumnChooser'];
        if (this.parent.editSettings.allowEditing) {
            if (this.parent.editSettings.allowCommandColumns) {
                toolbarItems = ['ColumnChooser', 'Add'];
            }
            else if (this.parent.editSettings.mode === 'Batch') {
                toolbarItems = ['ColumnChooser', 'Add', 'Delete', 'Update', 'Cancel'];
            }
            else if (this.parent.editSettings.mode === 'Dialog') {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete'];
            }
            else {
                toolbarItems = ['ColumnChooser', 'Add', 'Edit', 'Delete', 'Update', 'Cancel'];
            }
        }
        let drillThroughGrid = createElement('div', { id: this.parent.element.id + '_drillthroughgrid', className: DRILLTHROUGH_GRID_CLASS });
        Grid.Inject(Selection, Reorder, Resize, Toolbar, ColumnChooser);
        this.drillThroughGrid = new Grid({
            gridLines: 'Default',
            allowResizing: true,
            allowReordering: true,
            showColumnChooser: true,
            toolbar: toolbarItems,
            columns: this.frameGridColumns(),
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            enableVirtualization: this.parent.editSettings.allowEditing,
            allowPaging: this.parent.editSettings.allowEditing
        });
        let dialogModule = this;
        if (this.parent.editSettings.allowEditing) {
            Grid.Inject(Edit, Page);
            this.drillThroughGrid.editSettings = this.parent.editSettings;
            if (this.parent.editSettings.allowCommandColumns) {
                this.drillThroughGrid.editSettings.mode = 'Normal';
                this.drillThroughGrid.editSettings.allowEditOnDblClick = false;
                Grid.Inject(CommandColumn);
                this.drillThroughGrid.columns.push({
                    headerText: this.parent.localeObj.getConstant('manageRecords'), width: 160, showInColumnChooser: false,
                    commands: [
                        { type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat' } },
                        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat' } },
                        { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat' } },
                        { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat' } }
                    ]
                });
            }
            else {
                this.drillThroughGrid.editSettings.allowEditOnDblClick = this.parent.editSettings.allowEditOnDblClick;
            }
            /* tslint:disable:align */
            this.drillThroughGrid.columns.push({
                field: '__index', visible: false, isPrimaryKey: true, type: 'string', showInColumnChooser: false
            });
            /* tslint:disable-next-line:no-any */
            this.drillThroughGrid.actionComplete = (args) => {
                if (args.requestType === 'batchsave' || args.requestType === 'save' || args.requestType === 'delete') {
                    dialogModule.isUpdated = true;
                }
                if ((dialogModule.drillThroughGrid.editSettings.mode === 'Normal' && args.requestType === 'save' &&
                    dialogModule.drillThroughGrid.element.querySelectorAll('.e-tbar-btn:hover').length > 0 &&
                    !dialogModule.parent.editSettings.allowCommandColumns) || args.requestType === 'batchsave') {
                    dialogModule.dialogPopUp.hide();
                }
            };
            this.drillThroughGrid.beforeBatchSave = () => {
                dialogModule.isUpdated = true;
            };
            /* tslint:enable:align */
        }
        else {
            Grid.Inject(VirtualScroll);
        }
        this.drillThroughGrid.appendTo(drillThroughGrid);
        drillThroughBody.appendChild(drillThroughBodyHeader);
        drillThroughBody.appendChild(drillThroughGrid);
        return drillThroughBody;
    }
    frameGridColumns() {
        let keys = Object.keys(this.parent.engineModule.fieldList);
        let columns = [];
        for (let key of keys) {
            if (this.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                let editType = '';
                if (this.parent.engineModule.fieldList[key].type === 'number') {
                    editType = 'numericedit';
                }
                else if (this.parent.engineModule.fieldList[key].type === 'date') {
                    editType = 'datepickeredit';
                }
                else {
                    editType = '';
                }
                columns.push({
                    field: key,
                    headerText: this.parent.engineModule.fieldList[key].caption,
                    width: 120,
                    visible: this.parent.engineModule.fieldList[key].isSelected,
                    validationRules: { required: true },
                    editType: editType,
                    type: 'string'
                });
            }
        }
        return columns;
    }
    dataWithPrimarykey(eventArgs) {
        let indexString = Object.keys(eventArgs.currentCell.indexObject);
        let rawData = eventArgs.rawData;
        let count = 0;
        for (let item of rawData) {
            /* tslint:disable-next-line:no-string-literal */
            item['__index'] = indexString[count];
            this.gridIndexObjects[indexString[count].toString()] = Number(indexString[count]);
            count++;
        }
        return rawData;
    }
}

/**
 * `DrillThrough` module.
 */
class DrillThrough {
    /**
     * Constructor.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    getModuleName() {
        return 'drillthrough';
    }
    addInternalEvents() {
        this.parent.on(contentReady, this.wireEvents, this);
    }
    wireEvents() {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    }
    unWireEvents() {
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    }
    mouseClickHandler(e) {
        let target = e.target;
        let ele = null;
        if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        }
        else if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        }
        else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        if (ele) {
            if (this.parent.allowDrillThrough && ele.classList.contains('e-valuescontent') || this.parent.editSettings.allowEditing) {
                this.executeDrillThrough(ele);
            }
        }
    }
    executeDrillThrough(ele) {
        let colIndex = Number(ele.getAttribute('aria-colindex'));
        let rowIndex = Number(ele.getAttribute('index'));
        let pivotValue = this.parent.pivotValues[rowIndex][colIndex];
        let valueCaption = this.parent.engineModule.fieldList[pivotValue.actualText.toString()] ?
            this.parent.engineModule.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
        let rawData = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && pivotValue.value !== undefined) {
            let indexArray = Object.keys(pivotValue.indexObject);
            for (let index of indexArray) {
                rawData.push(this.parent.dataSource.data[Number(index)]);
            }
            let aggType = this.parent.engineModule.fieldList[pivotValue.actualText].aggregateType;
            let valuetText = aggType === 'CalculatedField' ? valueCaption.toString() :
                (aggType + ' of ' + valueCaption);
            let eventArgs = {
                currentTarget: ele,
                currentCell: pivotValue,
                rawData: rawData,
                rowHeaders: pivotValue.rowHeaders === '' ? '' : pivotValue.rowHeaders.toString().split('.').join(' - '),
                columnHeaders: pivotValue.columnHeaders === '' ? '' : pivotValue.columnHeaders.toString().split('.').join(' - '),
                value: valuetText + '(' + pivotValue.formattedText + ')'
            };
            this.parent.trigger(drillThrough, eventArgs);
            this.drillThroughDialog.showDrillThroughDialog(eventArgs);
        }
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PivotView_1;
/**
 * It holds the settings of Grouping Bar.
 */
class GroupingBarSettings extends ChildProperty {
}
__decorate([
    Property(true)
], GroupingBarSettings.prototype, "showFilterIcon", void 0);
__decorate([
    Property(true)
], GroupingBarSettings.prototype, "showSortIcon", void 0);
__decorate([
    Property(true)
], GroupingBarSettings.prototype, "showRemoveIcon", void 0);
__decorate([
    Property(true)
], GroupingBarSettings.prototype, "showValueTypeIcon", void 0);
/**
 * Configures the edit behavior of the Grid.
 */
class CellEditSettings extends ChildProperty {
}
__decorate([
    Property(false)
], CellEditSettings.prototype, "allowAdding", void 0);
__decorate([
    Property(false)
], CellEditSettings.prototype, "allowEditing", void 0);
__decorate([
    Property(false)
], CellEditSettings.prototype, "allowDeleting", void 0);
__decorate([
    Property(false)
], CellEditSettings.prototype, "allowCommandColumns", void 0);
__decorate([
    Property('Normal')
], CellEditSettings.prototype, "mode", void 0);
__decorate([
    Property(true)
], CellEditSettings.prototype, "allowEditOnDblClick", void 0);
__decorate([
    Property(true)
], CellEditSettings.prototype, "showConfirmDialog", void 0);
__decorate([
    Property(false)
], CellEditSettings.prototype, "showDeleteConfirmDialog", void 0);
/**
 * Configures the conditional based hyper link settings.
 */
class ConditionalSettings extends ChildProperty {
}
__decorate([
    Property()
], ConditionalSettings.prototype, "measure", void 0);
__decorate([
    Property()
], ConditionalSettings.prototype, "label", void 0);
__decorate([
    Property('NotEquals')
], ConditionalSettings.prototype, "conditions", void 0);
__decorate([
    Property()
], ConditionalSettings.prototype, "value1", void 0);
__decorate([
    Property()
], ConditionalSettings.prototype, "value2", void 0);
/**
 * It holds the settings of Hyperlink.
 */
class HyperlinkSettings extends ChildProperty {
}
__decorate([
    Property(false)
], HyperlinkSettings.prototype, "showHyperlink", void 0);
__decorate([
    Property(false)
], HyperlinkSettings.prototype, "showRowHeaderHyperlink", void 0);
__decorate([
    Property(false)
], HyperlinkSettings.prototype, "showColumnHeaderHyperlink", void 0);
__decorate([
    Property(false)
], HyperlinkSettings.prototype, "showValueCellHyperlink", void 0);
__decorate([
    Property(false)
], HyperlinkSettings.prototype, "showSummaryCellHyperlink", void 0);
__decorate([
    Collection([], ConditionalSettings)
], HyperlinkSettings.prototype, "conditionalSettings", void 0);
__decorate([
    Property()
], HyperlinkSettings.prototype, "headerText", void 0);
__decorate([
    Property('')
], HyperlinkSettings.prototype, "cssClass", void 0);
/**
 * Represents the PivotView component.
 * ```html
 * <div id="PivotView"></div>
 * <script>
 *  var pivotviewObj = new PivotView({ enableGroupingBar: true });
 *  pivotviewObj.appendTo("#pivotview");
 * </script>
 * ```
 */
let PivotView = PivotView_1 = class PivotView extends Component {
    /**
     * Constructor for creating the widget
     * @param  {PivotViewModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options, element) {
        super(options, element);
        /** @hidden */
        this.resizeInfo = {};
        /** @hidden */
        this.scrollPosObject = {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
        /** @hidden */
        this.pivotColumns = [];
        /** @hidden */
        this.totColWidth = 0;
        /** @hidden */
        this.posCount = 0;
        this.needsID = true;
        this.pivotView = this;
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        let isCommonRequire;
        if (this.allowConditionalFormatting) {
            modules.push({ args: [this], member: 'conditionalformatting' });
        }
        if (this.allowCalculatedField) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        if (this.showGroupingBar) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'grouping' });
        }
        if (this.showFieldList) {
            isCommonRequire = true;
            modules.push({ args: [this], member: 'fieldlist' });
        }
        if (this.allowExcelExport) {
            modules.push({ args: [this], member: 'excelExport' });
        }
        if (this.allowPdfExport) {
            modules.push({ args: [this], member: 'pdfExport' });
        }
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualscroll' });
        }
        if (isCommonRequire) {
            modules.push({ args: [this], member: 'common' });
        }
        return modules;
    }
    /**
     * For internal use only - Initializing internal properties;
     * @private
     */
    preRender() {
        this.initProperties();
        this.isAdaptive = Browser.isDevice;
        this.renderToolTip();
        this.keyboardModule = new KeyboardInteraction(this);
        this.contextMenuModule = new PivotContextMenu(this);
        this.globalize = new Internationalization(this.locale);
        this.defaultLocale = {
            grandTotal: 'Grand Total',
            total: 'Total',
            value: 'Value',
            noValue: 'No value',
            row: 'Row',
            column: 'Column',
            collapse: 'Collapse',
            expand: 'Expand',
            rowAxisPrompt: 'Drop row here',
            columnAxisPrompt: 'Drop column here',
            valueAxisPrompt: 'Drop value here',
            filterAxisPrompt: 'Drop filter here',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            calculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            search: 'Search',
            drag: 'Drag',
            remove: 'Remove',
            sum: 'Sum',
            average: 'Average',
            count: 'Count',
            min: 'Min',
            max: 'Max',
            allFields: 'All Fields',
            formula: 'Formula',
            addToRow: 'Add to Row',
            addToColumn: 'Add to Column',
            addToValue: 'Add to Value',
            addToFilter: 'Add to Filter',
            emptyData: 'No records to display',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            /* tslint:disable */
            member: 'Member',
            label: 'Label',
            date: 'Date',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            /* tslint:enable */
            NotEquals: 'Not Equals',
            AllValues: 'All Values',
            conditionalFormating: 'Conditional Formatting',
            apply: 'APPLY',
            condition: 'Add Condition',
            formatLabel: 'Format',
            valueFieldSettings: 'Value field settings',
            baseField: 'Base field :',
            baseItem: 'Base item :',
            summarizeValuesBy: 'Summarize values by :',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption :',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            details: 'Details',
            manageRecords: 'Manage Records'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.addInternalEvents();
        setCurrencyCode(this.currencyCode);
    }
    onBeforeTooltipOpen(args) {
        args.element.classList.add('e-pivottooltipwrap');
    }
    renderToolTip() {
        if (this.showTooltip) {
            this.tooltip = new Tooltip({
                target: 'td.e-valuescontent',
                showTipPointer: false,
                enableRtl: this.enableRtl,
                beforeRender: this.setToolTip.bind(this),
                beforeOpen: this.onBeforeTooltipOpen
            });
            this.tooltip.appendTo(this.element);
        }
        else if (this.tooltip) {
            this.tooltip.destroy();
        }
    }
    /* tslint:disable:align */
    initProperties() {
        this.setProperties({ pivotValues: [] }, true);
        this.queryCellInfo = this.gridSettings.queryCellInfo ? this.gridSettings.queryCellInfo.bind(this) : undefined;
        this.headerCellInfo = this.gridSettings.headerCellInfo ? this.gridSettings.headerCellInfo.bind(this) : undefined;
        this.resizing = this.gridSettings.resizing ? this.gridSettings.resizing.bind(this) : undefined;
        this.resizeStop = this.gridSettings.resizeStop ? this.gridSettings.resizeStop.bind(this) : undefined;
        this.pdfHeaderQueryCellInfo = this.gridSettings.pdfHeaderQueryCellInfo ?
            this.gridSettings.pdfHeaderQueryCellInfo.bind(this) : undefined;
        this.pdfQueryCellInfo = this.gridSettings.pdfQueryCellInfo ? this.gridSettings.pdfQueryCellInfo.bind(this) : undefined;
        this.excelHeaderQueryCellInfo = this.gridSettings.excelHeaderQueryCellInfo ?
            this.gridSettings.excelHeaderQueryCellInfo.bind(this) : undefined;
        this.excelQueryCellInfo = this.gridSettings.excelQueryCellInfo ?
            this.gridSettings.excelQueryCellInfo.bind(this) : undefined;
        this.columnDragStart = this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined;
        this.columnDrag = this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined;
        this.columnDrop = this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined;
        this.beforeColumnsRender = this.gridSettings.beforeColumnsRender ? this.gridSettings.beforeColumnsRender : undefined;
        this.selected = this.gridSettings.cellSelected ? this.gridSettings.cellSelected : undefined;
        this.cellDeselected = this.gridSettings.cellDeselected ? this.gridSettings.cellDeselected : undefined;
        this.rowSelected = this.gridSettings.rowSelected ? this.gridSettings.rowSelected : undefined;
        this.rowDeselected = this.gridSettings.rowDeselected ? this.gridSettings.rowDeselected : undefined;
        if (this.gridSettings.rowHeight === null) {
            this.setProperties({ gridSettings: { rowHeight: this.isAdaptive ? 48 : 36 } }, true);
        }
        if (this.enableVirtualization) {
            this.height = (typeof this.height === 'string' && this.height.indexOf('%') === -1) ?
                Number(this.height.split('px')[0]) : this.height;
            this.width = (typeof this.width === 'string' && this.width.indexOf('%') === -1) ?
                Number(this.width.split('px')[0]) : this.width;
            this.height = typeof this.height === 'number' ? this.height : 300;
            this.width = typeof this.width === 'number' ? this.width : 800;
        }
        if (this.enableVirtualization) {
            let colValues = 1;
            let rowValues = 1;
            if (this.dataSource.valueAxis === 'row') {
                rowValues = this.dataSource.values.length;
            }
            else {
                colValues = this.dataSource.values.length;
            }
            this.pageSettings = {
                columnCurrentPage: 1, rowCurrentPage: 1,
                columnSize: Math.ceil((Math.floor(this.width /
                    this.gridSettings.columnWidth) - 1) / colValues),
                rowSize: Math.ceil(Math.floor(this.height / this.gridSettings.rowHeight) / rowValues)
            };
            if (this.allowExcelExport) {
                PivotView_1.Inject(ExcelExport$1);
            }
            if (this.allowPdfExport) {
                PivotView_1.Inject(PDFExport);
            }
            if (this.editSettings.allowEditing) {
                PivotView_1.Inject(DrillThrough);
            }
        }
    }
    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    render() {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger(load, { 'dataSource': this.dataSource });
        this.updateClass();
        this.notify(initSubComponent, {});
        this.notify(initialLoad, {});
        if (this.isAdaptive) {
            this.contextMenuModule.render();
        }
    }
    /**
     * Register the internal events.
     * @returns void
     * @hidden
     */
    addInternalEvents() {
        this.on(initialLoad, this.generateData, this);
        this.on(dataReady, this.renderPivotGrid, this);
        this.on(contentReady, this.onContentReady, this);
    }
    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    removeInternalEvents() {
        this.off(initialLoad, this.generateData);
        this.off(dataReady, this.renderPivotGrid);
        this.off(contentReady, this.onContentReady);
    }
    /**
     * Get the Pivot widget properties to be maintained in the persisted state.
     * @returns {string}
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['dataSource', 'pivotValues', 'gridSettings'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    getModuleName() {
        return 'pivotview';
    }
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     * @hidden
     */
    copy(withHeader) {
        this.grid.copy(withHeader);
    }
    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./api-pivotgrid.html#printmode-string).
     * @returns {void}
     * @hidden
     */
    // public print(): void {
    //     this.grid.print();
    // }
    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'dataSource':
                case 'hyperlinkSettings':
                case 'allowDrillThrough':
                case 'editSettings':
                    this.notify(initialLoad, {});
                    break;
                case 'pivotValues':
                    this.notify(dataReady, {});
                    break;
                case 'gridSettings':
                    this.renderModule.updateGridSettings();
                    break;
                case 'locale':
                case 'currencyCode':
                    if (this.tooltip) {
                        this.tooltip.destroy();
                    }
                    super.refresh();
                    break;
                case 'enableRtl':
                    this.notify(dataReady, {});
                    this.updateClass();
                    break;
                case 'groupingBarSettings':
                    this.axisFieldModule.render();
                    break;
                case 'showTooltip':
                    this.renderToolTip();
                    break;
            }
        }
    }
    /**
     * Render the UI section of PivotView.
     * @returns void
     * @hidden
     */
    renderPivotGrid() {
        if (this.enableVirtualization) {
            this.virtualscrollModule = new VirtualScroll$1(this);
        }
        if (this.hyperlinkSettings) {
            this.isRowCellHyperlink = (this.hyperlinkSettings.showRowHeaderHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isColumnCellHyperlink = (this.hyperlinkSettings.showColumnHeaderHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isValueCellHyperlink = (this.hyperlinkSettings.showValueCellHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.isSummaryCellHyperlink = (this.hyperlinkSettings.showSummaryCellHyperlink ?
                true : this.hyperlinkSettings.showHyperlink ? true : false);
            this.applyHyperlinkSettings();
        }
        if (this.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        this.renderModule = new Render(this);
        this.renderModule.render();
        if (this.showFieldList || this.showGroupingBar) {
            this.notify(uiUpdate, this);
            if (this.pivotFieldListModule && this.allowDeferLayoutUpdate) {
                this.pivotFieldListModule.clonedDataSource = extend({}, this.dataSource, null, true);
            }
        }
        this.trigger(dataBound);
        if (this.allowConditionalFormatting) {
            this.applyFormatting();
        }
    }
    /**
     * Updates the PivotEngine using dataSource from Pivot View component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    updateDataSource(isRefreshGrid) {
        showSpinner(this.element);
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', this.engineModule.fieldList, this.pageSettings, this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        let eventArgs = {
            dataSource: this.dataSource,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(enginePopulated, eventArgs);
        this.pivotCommon.engineModule = this.engineModule;
        this.pivotCommon.dataSource = this.dataSource;
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.renderPivotGrid();
    }
    /**
     * To destroy the PivotView elements.
     * @returns void
     */
    destroy() {
        this.removeInternalEvents();
        if (this.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.destroy();
        }
        if (this.enableVirtualization && this.virtualscrollModule) {
            this.virtualscrollModule.destroy();
        }
        if (this.allowConditionalFormatting && this.conditionalFormattingModule) {
            this.conditionalFormattingModule.destroy();
        }
        if (this.isAdaptive && this.contextMenuModule) {
            this.contextMenuModule.destroy();
        }
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        this.unwireEvents();
        removeClass([this.element], ROOT);
        removeClass([this.element], RTL);
        removeClass([this.element], DEVICE);
        this.element.innerHTML = '';
        super.destroy();
    }
    /**
     * Export Pivot widget data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    excelExport(excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('Excel');
        }
        else {
            this.grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }
    /**
     * Export PivotGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    csvExport(excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('CSV');
        }
        else {
            this.grid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    }
    /**
     * Export Pivot widget data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob) {
        if (this.enableVirtualization) {
            this.pdfExportModule.exportToPDF();
        }
        else {
            this.grid.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
    }
    onDrill(target) {
        let fieldName = target.parentElement.getAttribute('fieldname');
        let memberName = this.engineModule.pivotValues[Number(target.parentElement.getAttribute('index'))][Number(target.parentElement.getAttribute('aria-colindex'))].actualText;
        this.engineModule.fieldList[fieldName].members[memberName].isDrilled =
            target.classList.contains(COLLAPSE) ? false : true;
        let dataSource = extend({}, this.dataSource, null, true);
        let fieldAvail = false;
        let prop = dataSource.properties;
        if (!prop.drilledMembers || prop.drilledMembers.length === 0) {
            prop.drilledMembers = [{ name: fieldName, items: [memberName] }];
        }
        else {
            for (let fCnt = 0; fCnt < prop.drilledMembers.length; fCnt++) {
                let field = prop.drilledMembers[fCnt];
                if (field.name === fieldName) {
                    fieldAvail = true;
                    let memIndex = field.items.indexOf(memberName);
                    if (memIndex > -1) {
                        field.items.splice(memIndex, 1);
                    }
                    else {
                        field.items.push(memberName);
                    }
                }
                else {
                    continue;
                }
            }
            if (!fieldAvail) {
                prop.drilledMembers.push({ name: fieldName, items: [memberName] });
            }
        }
        this.setProperties({ dataSource: { drilledMembers: prop.drilledMembers } }, true);
        showSpinner(this.element);
        this.engineModule.generateGridData(this.dataSource);
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.renderPivotGrid();
    }
    onContentReady() {
        if (this.showFieldList) {
            hideSpinner(this.pivotFieldListModule.fieldListSpinnerElement);
        }
        else if (this.fieldListSpinnerElement) {
            hideSpinner(this.fieldListSpinnerElement);
        }
        if (!this.isEmptyGrid) {
            hideSpinner(this.element);
        }
        else {
            this.isEmptyGrid = false;
        }
        if (this.enableVirtualization && this.engineModule) {
            if (this.element.querySelector('.' + MOVABLECONTENT_DIV) &&
                !this.element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.' + VIRTUALTRACK_DIV)) {
                this.virtualDiv = createElement('div', { className: VIRTUALTRACK_DIV });
                this.element.querySelector('.' + MOVABLECONTENT_DIV).appendChild(this.virtualDiv);
            }
            if (this.element.querySelector('.' + MOVABLEHEADER_DIV) &&
                !this.element.querySelector('.' + MOVABLEHEADER_DIV).querySelector('.' + VIRTUALTRACK_DIV)) {
                this.virtualHeaderDiv = createElement('div', { className: VIRTUALTRACK_DIV });
                this.element.querySelector('.' + MOVABLEHEADER_DIV).appendChild(this.virtualHeaderDiv);
            }
            else {
                this.virtualHeaderDiv =
                    this.element.querySelector('.' + MOVABLEHEADER_DIV).querySelector('.' + VIRTUALTRACK_DIV);
            }
            let movableTable = this.element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.e-table');
            let vHeight = (this.gridSettings.rowHeight * this.engineModule.rowCount + 0.1 - movableTable.clientHeight);
            let vWidth = (this.gridSettings.columnWidth * this.engineModule.columnCount
                - this.grid.columns[0].width);
            setStyleAttribute(this.virtualDiv, {
                height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            setStyleAttribute(this.virtualHeaderDiv, {
                height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            let mCnt = this.element.querySelector('.' + MOVABLECONTENT_DIV);
            let fCnt = this.element.querySelector('.' + FROZENCONTENT_DIV);
            let mHdr = this.element.querySelector('.' + MOVABLEHEADER_DIV);
            setStyleAttribute(fCnt.querySelector('.e-table'), {
                transform: 'translate(' + 0 + 'px,' + this.scrollPosObject.verticalSection + 'px)'
            });
            setStyleAttribute(mCnt.querySelector('.e-table'), {
                transform: 'translate(' + this.scrollPosObject.horizontalSection + 'px,' + this.scrollPosObject.verticalSection + 'px)'
            });
            setStyleAttribute(mHdr.querySelector('.e-table'), {
                transform: 'translate(' + this.scrollPosObject.horizontalSection + 'px,' + 0 + 'px)'
            });
        }
        if (this.showGroupingBar) {
            this.element.style.minWidth = '400px';
            this.grid.element.style.minWidth = '400px';
        }
        else {
            this.element.style.minWidth = '310px';
            this.grid.element.style.minWidth = '310px';
        }
        this.unwireEvents();
        this.wireEvents();
    }
    setToolTip(args) {
        let colIndex = Number(args.target.getAttribute('aria-colindex'));
        let rowIndex = Number(args.target.getAttribute('index'));
        let cell = this.pivotValues[rowIndex][colIndex];
        this.tooltip.content = '';
        if (cell) {
            this.tooltip.content = '<div class=' + PIVOTTOOLTIP + '><p class=' + TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('row') + ':</p><p class=' + TOOLTIP_CONTENT + '>' +
                this.getRowText(rowIndex, 0) +
                '</p></br><p class=' + TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('column') + ':</p><p class=' + TOOLTIP_CONTENT + '>' +
                this.getColText(0, colIndex, rowIndex) + '</p></br>' + '<p class=' + TOOLTIP_HEADER + '>' +
                this.localeObj.getConstant('value') + ':</p><p class=' + TOOLTIP_CONTENT + '>' +
                (((cell.formattedText === '0' || cell.formattedText === '') ?
                    this.localeObj.getConstant('noValue') : cell.formattedText)) + '</p></div>';
        }
        else {
            args.cancel = true;
        }
    }
    getRowText(rowIndex, colIndex) {
        let cell = this.pivotValues[rowIndex][colIndex];
        let level = cell.level;
        let rowText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (level > 0 || cell.index === undefined) {
            rowIndex--;
            cell = this.pivotValues[rowIndex][colIndex];
            if (cell.index !== undefined) {
                if (level > cell.level) {
                    rowText = rowText + ' - ' + cell.formattedText;
                }
                level = cell.level;
            }
        }
        return rowText.split(' - ').reverse().join(' - ');
    }
    getColText(rowIndex, colIndex, limit) {
        let cell = this.pivotValues[0][colIndex];
        let axis = cell.axis;
        let colText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
        while (axis !== 'value' && limit > rowIndex) {
            rowIndex++;
            if (this.pivotValues[rowIndex]) {
                cell = this.pivotValues[rowIndex][colIndex];
                axis = cell.axis;
                if (cell.type !== 'sum' && cell.type !== 'grand sum' && axis !== 'value') {
                    colText = colText + ' - ' + cell.formattedText;
                }
            }
        }
        return colText;
    }
    updateClass() {
        if (this.enableRtl) {
            addClass([this.element], RTL);
        }
        else {
            removeClass([this.element], RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], DEVICE);
        }
        else {
            removeClass([this.element], DEVICE);
        }
    }
    wireEvents() {
        EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
    }
    mouseClickHandler(e) {
        let target = e.target;
        if ((target.classList.contains('e-headercell') ||
            target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-rowsheader') ||
            target.classList.contains('e-rowcell') ||
            target.classList.contains('e-stackedheadercelldiv') ||
            target.classList.contains('e-headertext') ||
            target.classList.contains('e-ascending') ||
            target.classList.contains('e-descending')) && this.enableValueSorting) {
            let ele = null;
            if (target.classList.contains('e-headercell') || target.classList.contains('e-rowsheader')
                || target.classList.contains('e-rowcell')) {
                ele = target;
            }
            else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-headercelldiv') ||
                target.classList.contains('e-ascending') || target.classList.contains('e-descending')) {
                ele = target.parentElement;
            }
            else if (target.classList.contains('e-headertext')) {
                ele = target.parentElement.parentElement;
            }
            this.CellClicked(target);
            if ((ele.parentElement.parentElement.parentElement.parentElement.classList.contains('e-movableheader')
                && this.dataSource.valueAxis === 'column') || (ele.parentElement.classList.contains('e-row') &&
                this.dataSource.valueAxis === 'row')) {
                /* tslint:disable */
                let colIndex = Number(ele.getAttribute('aria-colindex'));
                let rowIndex = Number(ele.getAttribute('index'));
                if (this.dataSource.valueAxis === 'row' && this.dataSource.values.length > 1) {
                    rowIndex = this.pivotValues[rowIndex][colIndex].type === 'value' ? rowIndex : (rowIndex + 1);
                }
                else if (this.dataSource.valueAxis === 'column' && this.dataSource.values.length > 1) {
                    colIndex = (Number(ele.getAttribute('aria-colindex')) + Number(ele.getAttribute('aria-colspan')) - 1);
                    rowIndex = this.engineModule.headerContent.length - 1;
                }
                this.setProperties({
                    dataSource: {
                        valueSortSettings: {
                            columnIndex: (Number(ele.getAttribute('aria-colindex')) +
                                Number(ele.getAttribute('aria-colspan')) - 1),
                            sortOrder: this.dataSource.valueSortSettings.sortOrder === 'Descending' ? 'Ascending' : 'Descending',
                            headerText: this.pivotValues[rowIndex][colIndex].valueSort.levelName,
                            headerDelimiter: this.dataSource.valueSortSettings.headerDelimiter ?
                                this.dataSource.valueSortSettings.headerDelimiter : '.'
                        }
                    }
                }, true);
                /* tslint:enable */
                showSpinner(this.element);
                this.engineModule.enableValueSorting = true;
                this.engineModule.generateGridData(this.dataSource, this.engineModule.headerCollection);
                this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
                this.renderPivotGrid();
            }
        }
        else if (target.classList.contains(COLLAPSE) || target.classList.contains(EXPAND)) {
            this.onDrill(target);
        }
        else {
            this.CellClicked(target);
            return;
        }
    }
    framePivotColumns(gridcolumns) {
        for (let column of gridcolumns) {
            if (column.columns && column.columns.length > 0) {
                this.framePivotColumns(column.columns);
            }
            else {
                /* tslint:disable */
                let levelName = column.field === '0.formattedText' ? '' :
                    (column.customAttributes ? column.customAttributes.cell.valueSort.levelName : '');
                let width = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                    levelName, Number(column.width));
                this.pivotColumns.push({
                    allowReordering: column.allowReordering,
                    allowResizing: column.allowResizing,
                    headerText: levelName,
                    width: width
                });
                this.totColWidth = this.totColWidth + Number(width);
                /* tslint:enable */
            }
        }
    }
    /** @hidden */
    setGridColumns(gridcolumns) {
        if (this.element.offsetWidth < this.totColWidth) {
            for (let column of gridcolumns) {
                if (column.columns && column.columns.length > 0) {
                    this.setGridColumns(column.columns);
                }
                else {
                    /* tslint:disable */
                    let levelName = column.field === '0.formattedText' ? '' :
                        (column.customAttributes ? column.customAttributes.cell.valueSort.levelName : '');
                    column.allowReordering = this.pivotColumns[this.posCount].allowReordering;
                    column.allowResizing = this.pivotColumns[this.posCount].allowResizing;
                    column.width = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
                        levelName, Number(this.pivotColumns[this.posCount].width));
                    this.posCount++;
                    if (column.allowReordering) {
                        this.gridSettings.allowReordering = true;
                    }
                    if (column.allowResizing) {
                        this.gridSettings.allowResizing = true;
                    }
                }
            }
            if (this.gridSettings.allowReordering) {
                Grid.Inject(Reorder);
            }
            if (this.gridSettings.allowResizing) {
                Grid.Inject(Resize);
            }
            /* tslint:enable */
        }
    }
    /** @hidden */
    triggerColumnRenderEvent(gridcolumns) {
        this.pivotColumns = [];
        this.totColWidth = 0;
        this.framePivotColumns(gridcolumns);
        let firstColWidth = this.pivotColumns[0].width;
        let eventArgs = {
            columns: this.pivotColumns,
            dataSource: this.dataSource
        };
        this.trigger(beforeColumnsRender, eventArgs);
        if (firstColWidth !== this.pivotColumns[0].width && this.element.offsetWidth < this.totColWidth) {
            this.firstColWidth = this.pivotColumns[0].width;
        }
        this.posCount = 0;
        this.setGridColumns(gridcolumns);
    }
    /** @hidden */
    setCommonColumnsWidth(columns, width) {
        for (let column of columns) {
            if (column.field !== '0.formattedText') {
                if (column.columns) {
                    this.setCommonColumnsWidth(column.columns, width);
                }
                else {
                    column.width = width;
                }
            }
            else {
                column.width = width < this.firstColWidth ? this.firstColWidth : width;
            }
        }
    }
    /** @hidden */
    onWindowResize() {
        /* tslint:disable */
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(() => {
            if (this.element && this.element.classList.contains('e-pivotview') && this.engineModule) {
                let colWidth = this.renderModule.calculateColWidth(this.dataSource.values.length > 0 ?
                    this.engineModule.pivotValues[0].length : 2);
                this.grid.width = this.renderModule.calculateGridWidth();
                this.setCommonColumnsWidth(this.grid.columns, colWidth);
                this.posCount = 0;
                if (!this.showGroupingBar) {
                    this.setGridColumns(this.grid.columns);
                }
                this.grid.headerModule.refreshUI();
                if (this.showGroupingBar && this.groupingBarModule && this.element.querySelector('.' + GROUPING_BAR_CLASS)) {
                    this.groupingBarModule.setGridRowWidth();
                }
            }
        }, 500);
        /* tslint:enable */
    }
    CellClicked(target) {
        let ele = null;
        if (target.classList.contains('e-headercell') || target.classList.contains('e-rowcell')) {
            ele = target;
        }
        else if (target.classList.contains('e-stackedheadercelldiv') || target.classList.contains('e-cellvalue') ||
            target.classList.contains('e-headercelldiv')) {
            ele = target.parentElement;
        }
        else if (target.classList.contains('e-headertext')) {
            ele = target.parentElement.parentElement;
        }
        if (ele) {
            if (this.cellClick) {
                this.trigger(cellClick, {
                    currentCell: ele,
                    data: this.pivotValues[Number(ele.getAttribute('index'))][Number(ele.getAttribute('aria-colindex'))]
                });
            }
        }
    }
    unwireEvents() {
        EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
        window.removeEventListener('resize', this.onWindowResize.bind(this), true);
    }
    renderEmptyGrid() {
        this.isEmptyGrid = true;
        if (this.element.querySelector('.' + GRID_CLASS)) {
            remove(this.element.querySelector('.' + GRID_CLASS));
        }
        this.renderModule = new Render(this);
        this.renderModule.bindGrid(this, true);
        /* tslint:disable:no-empty */
        this.grid.showSpinner = () => { };
        this.grid.hideSpinner = () => { };
        /* tslint:enable:no-empty */
        this.element.appendChild(createElement('div', { id: this.element.id + '_grid' }));
        this.grid.appendTo('#' + this.element.id + '_grid');
    }
    initEngine() {
        this.trigger(enginePopulating, { 'dataSource': this.dataSource });
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', undefined, this.pageSettings, this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.trigger(enginePopulated, { 'pivotValues': this.pivotValues });
        this.notify(dataReady, {});
        this.isEmptyGrid = false;
    }
    generateData() {
        this.renderEmptyGrid();
        showSpinner(this.element);
        /* tslint:disable */
        if (this.dataSource && this.dataSource.data) {
            if (this.dataSource.data instanceof DataManager) {
                setTimeout(() => {
                    this.dataSource.data.executeQuery(new Query()).then((e) => {
                        if (!this.element.querySelector('.e-spinner-pane')) {
                            showSpinner(this.element);
                        }
                        this.setProperties({ dataSource: { data: e.result } }, true);
                        this.initEngine();
                    });
                }, 100);
            }
            else if (this.dataSource.data.length > 0) {
                this.initEngine();
            }
            else {
                hideSpinner(this.element);
            }
        }
        else {
            hideSpinner(this.element);
        }
        /* tslint:enable */
    }
    applyFormatting() {
        if (this.pivotValues) {
            let colIndex = [];
            for (let len = this.pivotValues.length, i = 0; i < len; i++) {
                if (this.pivotValues[i] !== undefined && this.pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            for (let i = 0; i < this.pivotValues.length; i++) {
                for (let j = 1; (this.pivotValues[i] && j < this.pivotValues[i].length); j++) {
                    if (this.pivotValues[i][j].axis === 'value') {
                        this.pivotValues[i][j].style = undefined;
                        this.pivotValues[i][j].cssClass = undefined;
                        let format = this.dataSource.conditionalFormatSettings;
                        for (let k = 0; k < format.length; k++) {
                            if (this.checkCondition(this.pivotValues[i][j].value, format[k].conditions, format[k].value1, format[k].value2)) {
                                let ilen = (this.dataSource.valueAxis === 'row' ? i : this.engineModule.headerContent.length - 1);
                                let jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
                                if ((!format[k].measure || this.dataSource.values.length === 1 ||
                                    (this.pivotValues[ilen][jlen].valueSort &&
                                        this.pivotValues[ilen][jlen].valueSort.levelName.
                                            indexOf(format[k].measure) > -1)) &&
                                    (!format[k].label || ((this.pivotValues[colIndex[format[k].label.split('.').length - 1]] &&
                                        this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j] &&
                                        this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j].valueSort &&
                                        this.pivotValues[colIndex[format[k].label.split('.').length - 1]][j].
                                            valueSort[format[k].label]) || (this.pivotValues[i][0].
                                        valueSort.levelName.indexOf(format[k].label) > -1)))) {
                                    if (format[k].style && format[k].style.backgroundColor) {
                                        format[k].style.backgroundColor = this.conditionalFormattingModule
                                            .isHex(format[k].style.backgroundColor.substr(1)) ? format[k].style.backgroundColor :
                                            this.conditionalFormattingModule.colourNameToHex(format[k].style.backgroundColor);
                                    }
                                    if (format[k].style && format[k].style.color) {
                                        format[k].style.color = this.conditionalFormattingModule
                                            .isHex(format[k].style.color.substr(1)) ? format[k].style.color :
                                            this.conditionalFormattingModule.colourNameToHex(format[k].style.color);
                                    }
                                    this.pivotValues[i][j].style = format[k].style;
                                    this.pivotValues[i][j].cssClass = 'format' + this.element.id + k;
                                }
                            }
                        }
                    }
                }
            }
            let format = this.dataSource.conditionalFormatSettings;
            for (let k = 0; k < format.length; k++) {
                let sheet = (() => {
                    let style = document.createElement('style');
                    style.appendChild(document.createTextNode(''));
                    document.head.appendChild(style);
                    return style.sheet;
                })();
                let str = 'color: ' + format[k].style.color + '!important;background-color: ' + format[k].style.backgroundColor +
                    '!important;font-size: ' + format[k].style.fontSize + '!important;font-family: ' + format[k].style.fontFamily +
                    ' !important;';
                sheet.insertRule('.format' + this.element.id + k + '{' + str + '}', 0);
            }
        }
    }
    applyHyperlinkSettings() {
        if (this.pivotValues) {
            let pivotValues = this.pivotValues;
            let colIndex = [];
            for (let len = pivotValues.length, i = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            if (this.hyperlinkSettings.conditionalSettings.length > 0) {
                for (let i = 0; i < pivotValues.length; i++) {
                    for (let j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            pivotValues[i][j].enableHyperlink = false;
                            let collection = this.hyperlinkSettings.conditionalSettings;
                            for (let k = 0; k < collection.length; k++) {
                                if (this.checkCondition(pivotValues[i][j].value, collection[k].conditions, collection[k].value1, collection[k].value2)) {
                                    let ilen = (this.dataSource.valueAxis === 'row' ?
                                        i : this.engineModule.headerContent.length - 1);
                                    let jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
                                    if ((!collection[k].measure || this.dataSource.values.length === 1 ||
                                        (pivotValues[ilen][jlen].valueSort &&
                                            pivotValues[ilen][jlen].valueSort.levelName.
                                                indexOf(collection[k].measure) > -1)) &&
                                        (!collection[k].label || ((pivotValues[colIndex[collection[k].label.split('.').length - 1]] &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j] &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j].valueSort &&
                                            pivotValues[colIndex[collection[k].label.split('.').length - 1]][j].
                                                valueSort[collection[k].label]) || (pivotValues[i][0].
                                            valueSort.levelName.indexOf(collection[k].label) > -1)))) {
                                        pivotValues[i][j].enableHyperlink = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isNullOrUndefined(this.hyperlinkSettings.headerText)) {
                for (let i = 0; i < pivotValues.length; i++) {
                    for (let j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            // (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            let label = this.hyperlinkSettings.headerText;
                            let ilen = (this.dataSource.valueAxis === 'row' ?
                                i : this.engineModule.headerContent.length - 1);
                            let jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
                            if ((pivotValues[colIndex[label.split('.').length - 1]] &&
                                pivotValues[colIndex[label.split('.').length - 1]][j] &&
                                pivotValues[colIndex[label.split('.').length - 1]][j].
                                    valueSort && pivotValues[colIndex[label.split('.').length - 1]][j].
                                valueSort[label])) {
                                for (let index of colIndex) {
                                    if (pivotValues[index][j] &&
                                        pivotValues[index][j].axis === 'column' &&
                                        (pivotValues[index][j].valueSort.levelName.indexOf(label) > -1)) {
                                        pivotValues[index][j].enableHyperlink = true;
                                    }
                                }
                                pivotValues[i][j].enableHyperlink = true;
                            }
                            else if (pivotValues[i][0].valueSort.levelName.indexOf(label) > -1) {
                                pivotValues[i][0].enableHyperlink = true;
                                pivotValues[i][j].enableHyperlink = true;
                            }
                        }
                    }
                }
            }
            else {
                return;
            }
        }
    }
    checkCondition(cellValue, conditions, conditionalValue1, conditionalValue2) {
        switch (conditions) {
            case 'LessThan':
                return cellValue < conditionalValue1;
            case 'LessThanOrEqualTo':
                return cellValue <= conditionalValue1;
            case 'GreaterThan':
                return cellValue > conditionalValue1;
            case 'GreaterThanOrEqualTo':
                return cellValue >= conditionalValue1;
            case 'Equals':
                return cellValue === conditionalValue1;
            case 'NotEquals':
                return cellValue !== conditionalValue1;
            case 'Between':
                return (conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2);
            case 'NotBetween':
                return !((conditionalValue1 < conditionalValue2 && cellValue >= conditionalValue1 && cellValue <= conditionalValue2) ||
                    (conditionalValue1 > conditionalValue2 && cellValue <= conditionalValue1 && cellValue >= conditionalValue2));
            default:
                return false;
        }
    }
};
__decorate([
    Property('USD')
], PivotView.prototype, "currencyCode", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "showFieldList", void 0);
__decorate([
    Complex({}, GridSettings)
], PivotView.prototype, "gridSettings", void 0);
__decorate([
    Complex({}, GroupingBarSettings)
], PivotView.prototype, "groupingBarSettings", void 0);
__decorate([
    Complex({}, HyperlinkSettings)
], PivotView.prototype, "hyperlinkSettings", void 0);
__decorate([
    Complex({}, DataSource)
], PivotView.prototype, "dataSource", void 0);
__decorate([
    Complex({}, CellEditSettings)
], PivotView.prototype, "editSettings", void 0);
__decorate([
    Property()
], PivotView.prototype, "pivotValues", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "showGroupingBar", void 0);
__decorate([
    Property(true)
], PivotView.prototype, "showTooltip", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "showValuesButton", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowCalculatedField", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "enableValueSorting", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowConditionalFormatting", void 0);
__decorate([
    Property('auto')
], PivotView.prototype, "height", void 0);
__decorate([
    Property('auto')
], PivotView.prototype, "width", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowExcelExport", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "enableVirtualization", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowDrillThrough", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowPdfExport", void 0);
__decorate([
    Property(false)
], PivotView.prototype, "allowDeferLayoutUpdate", void 0);
__decorate([
    Property(1000)
], PivotView.prototype, "maxNodeLimitInMemberEditor", void 0);
__decorate([
    Event()
], PivotView.prototype, "queryCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "headerCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "resizing", void 0);
__decorate([
    Event()
], PivotView.prototype, "resizeStop", void 0);
__decorate([
    Event()
], PivotView.prototype, "pdfHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "pdfQueryCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "excelHeaderQueryCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "excelQueryCellInfo", void 0);
__decorate([
    Event()
], PivotView.prototype, "columnDragStart", void 0);
__decorate([
    Event()
], PivotView.prototype, "columnDrag", void 0);
__decorate([
    Event()
], PivotView.prototype, "columnDrop", void 0);
__decorate([
    Event()
], PivotView.prototype, "beforeColumnsRender", void 0);
__decorate([
    Event()
], PivotView.prototype, "selected", void 0);
__decorate([
    Event()
], PivotView.prototype, "cellDeselected", void 0);
__decorate([
    Event()
], PivotView.prototype, "rowSelected", void 0);
__decorate([
    Event()
], PivotView.prototype, "rowDeselected", void 0);
__decorate([
    Event()
], PivotView.prototype, "load", void 0);
__decorate([
    Event()
], PivotView.prototype, "enginePopulating", void 0);
__decorate([
    Event()
], PivotView.prototype, "enginePopulated", void 0);
__decorate([
    Event()
], PivotView.prototype, "onFieldDropped", void 0);
__decorate([
    Event()
], PivotView.prototype, "dataBound", void 0);
__decorate([
    Event()
], PivotView.prototype, "created", void 0);
__decorate([
    Event()
], PivotView.prototype, "destroyed", void 0);
__decorate([
    Event()
], PivotView.prototype, "beforeExport", void 0);
__decorate([
    Event()
], PivotView.prototype, "cellClick", void 0);
__decorate([
    Event()
], PivotView.prototype, "drillThrough", void 0);
__decorate([
    Event()
], PivotView.prototype, "hyperlinkCellClick", void 0);
__decorate([
    Event()
], PivotView.prototype, "cellSelected", void 0);
PivotView = PivotView_1 = __decorate([
    NotifyPropertyChanges
], PivotView);

/**
 * Base export
 */

/**
 * Renderer Export
 */

/**
 * Action export
 */

/**
 * PivotGrid component exported items
 */

/**
 * Keyboard interaction
 */
/** @hidden */
class CommonKeyboardInteraction {
    /**
     * Constructor
     */
    constructor(parent) {
        this.keyConfigs = {
            shiftF: 'shift+F',
            shiftS: 'shift+S',
            delete: 'delete',
            enter: 'enter'
        };
        this.parent = parent;
        this.parent.element.tabIndex = this.parent.element.tabIndex === -1 ? 0 : this.parent.element.tabIndex;
        this.keyboardModule = new KeyboardEvents(this.parent.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }
    keyActionHandler(e) {
        switch (e.action) {
            case 'shiftF':
                this.processFilter(e);
                break;
            case 'shiftS':
                this.processSort(e);
                break;
            case 'delete':
                this.processDelete(e);
                break;
            case 'enter':
                this.processOpenContextMenu(e);
                break;
        }
    }
    processOpenContextMenu(e) {
        let target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) &&
            closest(target, '.' + VALUE_AXIS_CLASS)) {
            target.querySelector('.' + AXISFIELD_ICON_CLASS).click();
            e.preventDefault();
            return;
        }
    }
    processSort(e) {
        let target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) &&
            !closest(target, '.' + VALUE_AXIS_CLASS) && !closest(target, '.' + AXIS_FILTER_CLASS)) {
            target.querySelector('.' + SORT_CLASS).click();
            e.preventDefault();
            return;
        }
    }
    processFilter(e) {
        let target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) && !closest(target, '.' + VALUE_AXIS_CLASS)) {
            target.querySelector('.' + FILTER_COMMON_CLASS).click();
            e.preventDefault();
            return;
        }
    }
    processDelete(e) {
        let target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS)) {
            target.querySelector('.' + REMOVE_CLASS).click();
            e.preventDefault();
            return;
        }
    }
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    destroy() {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * `EventBase` for active fields action.
 */
/** @hidden */
class EventBase {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Updates sorting order for the selected field.
     * @method updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    updateSorting(args) {
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let target = args.target;
        let fieldName = target.parentElement.id;
        let isDescending = target.classList.contains(SORT_DESCEND_CLASS);
        let sortObj = this.getSortItemByName(fieldName);
        if (!isNullOrUndefined(sortObj)) {
            for (let i = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    this.parent.dataSource.sortSettings.splice(i, 1);
                    break;
                }
            }
            let newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
        else {
            let newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
        isDescending ? removeClass([target], SORT_DESCEND_CLASS) : addClass([target], SORT_DESCEND_CLASS);
    }
    /**
     * Updates sorting order for the selected field.
     * @method updateFiltering
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    updateFiltering(args) {
        let target = args.target;
        let fieldName = target.parentElement.id;
        let fieldCaption = target.parentElement.textContent;
        let isInclude = false;
        let filterItems = [];
        this.parent.engineModule.fieldList[fieldName].dateMember = new DataManager(this.parent.engineModule.
            fieldList[fieldName].dateMember).executeLocal(new Query().
            sortBy('actualText', this.parent.engineModule.fieldList[fieldName].sort.toLowerCase()));
        let filterObj = this.getFilterItemByName(fieldName);
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type === 'Include' ? true : false;
            filterItems = filterObj.items ? filterObj.items : [];
        }
        let treeData = this.getTreeData(isInclude, this.parent.engineModule.fieldList[fieldName].dateMember, filterItems, fieldName);
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        let popupTarget;
        popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
            popupTarget = this.parent.element : popupTarget = document.getElementById(this.parent.parentID + '_Wrapper');
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    }
    /**
     * Gets sort object for the given field name from the dataSource.
     * @method getSortItemByName
     * @param  {string} fieldName - Gets sort settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    getSortItemByName(fieldName) {
        let sortObjects = this.parent.dataSource.sortSettings;
        return new DataManager({ json: sortObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }
    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    getFilterItemByName(fieldName) {
        let filterObjects = this.parent.dataSource.filterSettings;
        return new DataManager({ json: filterObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }
    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFieldByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    getFieldByName(fieldName, fields) {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }
    /**
     * Gets format object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets format settings for the given field name.
     * @return {IFormatSettings}
     * @hidden
     */
    getFormatItemByName(fieldName) {
        let formatObjects = this.parent.dataSource.formatSettings;
        return new DataManager({ json: formatObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }
    /**
     * show tree nodes using search text.
     * @hidden
     */
    searchTreeNodes(args, treeObj, isFieldCollection) {
        if (isFieldCollection) {
            let searchList = [];
            let nonSearchList = [];
            let list = [].slice.call(treeObj.element.querySelectorAll('li'));
            for (let element of list) {
                if ((element.querySelector('.e-list-text').textContent.toLowerCase()).indexOf(args.value.toLowerCase()) > -1) {
                    searchList.push(element);
                }
                else {
                    nonSearchList.push(element);
                }
            }
            treeObj.enableNodes(searchList);
            treeObj.disableNodes(nonSearchList);
        }
        else {
            let searchList = [];
            this.parent.searchTreeItems = [];
            let memberCount = 0;
            memberCount = 1;
            for (let item of this.parent.currentTreeItems) {
                if (item.name.toLowerCase().indexOf(args.value.toLowerCase()) > -1) {
                    this.parent.searchTreeItems.push(item);
                    if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                        searchList.push(item);
                    }
                    memberCount++;
                }
            }
            memberCount--;
            if (memberCount > this.parent.control.maxNodeLimitInMemberEditor) {
                this.parent.editorLabelElement.innerText = (memberCount - this.parent.control.maxNodeLimitInMemberEditor) +
                    this.parent.control.localeObj.getConstant('editorDataLimitMsg');
                this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '440px' : '400px');
                this.parent.isDataOverflow = true;
            }
            else {
                this.parent.editorLabelElement.innerText = '';
                this.parent.filterDialog.dialogPopUp.height = (this.parent.filterDialog.allowExcelLikeFilter ? '400px' : '350px');
                this.parent.isDataOverflow = false;
            }
            this.parent.isDataOverflow = (memberCount > this.parent.control.maxNodeLimitInMemberEditor);
            this.parent.editorLabelElement.parentElement.style.display = this.parent.isDataOverflow ? 'inline-block' : 'none';
            treeObj.fields = { dataSource: searchList, id: 'id', text: 'name', isChecked: 'checkedStatus' };
            treeObj.dataBind();
        }
    }
    getTreeData(isInclude, members, filterItems, fieldName) {
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        this.parent.savedTreeFilterPos = {};
        this.parent.isDateField = this.parent.engineModule.formatFields[fieldName] &&
            ((['date', 'dateTime', 'time']).indexOf(this.parent.engineModule.formatFields[fieldName].type) > -1);
        let list = [];
        let memberCount = 1;
        let filterObj = {};
        for (let item of filterItems) {
            filterObj[item] = item;
        }
        for (let member of members) {
            let memberName = this.parent.isDateField ? member.formattedText : member.actualText.toString();
            let obj = {
                id: member.actualText.toString(),
                name: memberName,
                checkedStatus: isInclude ? false : true
            };
            if (filterObj[memberName] !== undefined) {
                obj.checkedStatus = isInclude ? true : false;
            }
            if (memberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            if (!obj.checkedStatus) {
                this.parent.savedTreeFilterPos[memberCount - 1] = memberName;
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[member.actualText] = memberCount - 1;
            memberCount++;
        }
        this.parent.isDataOverflow = ((memberCount - 1) > this.parent.control.maxNodeLimitInMemberEditor);
        return list;
    }
}

/**
 * `DialogAction` module is used to handle field list dialog related behaviour.
 */
/** @hidden */
class NodeStateModified {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Updates the dataSource by drag and drop the selected field from either field list or axis table with dropped target position.
     * @method onStateModified
     * @param  {DragEventArgs & DragAndDropEventArgs} args -  Contains both pivot button and field list drag and drop information.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @return {void}
     * @hidden
     */
    onStateModified(args, fieldName) {
        let droppedClass = '';
        let nodeDropped = true;
        let target = closest(args.target, '.' + DROPPABLE_CLASS);
        let droppedPosition = -1;
        this.parent.dataSourceUpdate.btnElement = args.element ? args.element.parentElement : undefined;
        if (target) {
            droppedClass = target.classList[1] === ROW_AXIS_CLASS ?
                'rows' : target.classList[1] === COLUMN_AXIS_CLASS ? 'columns' : target.classList[1] === VALUE_AXIS_CLASS ?
                'values' : target.classList[1] === FILTER_AXIS_CLASS ? 'filters' : '';
        }
        if ((args.cancel && droppedClass === '') ||
            (this.parent.dataSourceUpdate.btnElement && this.parent.dataSourceUpdate.btnElement.getAttribute('isValue') === 'true' &&
                ((droppedClass === 'filters' || droppedClass === 'values') ||
                    droppedClass.indexOf(this.parent.dataSource.valueAxis) > -1))) {
            nodeDropped = false;
            return nodeDropped;
        }
        if (droppedClass !== '') {
            if (this.parent.engineModule.fieldList[fieldName] &&
                this.parent.engineModule.fieldList[fieldName].aggregateType === 'CalculatedField' && droppedClass !== 'values') {
                let title = this.parent.localeObj.getConstant('warning');
                let description = this.parent.localeObj.getConstant('dropAction');
                this.parent.errorDialog.createErrorDialog(title, description);
                nodeDropped = false;
                return nodeDropped;
            }
            droppedPosition = this.getButtonPosition(args.target, droppedClass);
        }
        else if (this.parent.engineModule.fieldList[fieldName]) {
            this.parent.engineModule.fieldList[fieldName].isSelected = false;
        }
        this.parent.dataSourceUpdate.updateDataSource(fieldName, droppedClass, droppedPosition);
        return nodeDropped;
    }
    getButtonPosition(target, droppedClass) {
        let droppedPosition = -1;
        let targetBtn = closest(target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
        if (!isNullOrUndefined(targetBtn)) {
            targetBtn = targetBtn.querySelector('.' + PIVOT_BUTTON_CLASS);
            let axisPanel = this.parent.element.querySelector('.e-' + droppedClass);
            let pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            for (let i = 0, n = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === targetBtn.id) {
                    droppedPosition = i;
                    break;
                }
            }
        }
        return droppedPosition;
    }
}

/**
 * `DataSourceUpdate` module is used to update the dataSource.
 */
/** @hidden */
class DataSourceUpdate {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Updates the dataSource by adding the given field along with field dropped position to the dataSource.
     * @param  {string} fieldName - Defines dropped field name to update dataSource.
     * @param  {string} droppedClass -  Defines dropped field axis name to update dataSource.
     * @param  {number} fieldCaption - Defines dropped position to the axis based on field position.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    updateDataSource(fieldName, droppedClass, droppedPosition) {
        let dataSourceItem;
        if (this.control && this.btnElement && this.btnElement.getAttribute('isvalue') === 'true') {
            switch (droppedClass) {
                case '':
                    this.control.setProperties({ dataSource: { values: [] } }, true);
                    break;
                case 'rows':
                    this.control.setProperties({ dataSource: { valueAxis: 'row' } }, true);
                    break;
                case 'columns':
                    this.control.setProperties({ dataSource: { valueAxis: 'column' } }, true);
                    break;
            }
        }
        else {
            dataSourceItem = this.removeFieldFromReport(fieldName.toString());
            dataSourceItem = dataSourceItem ? dataSourceItem : this.getNewField(fieldName.toString());
            if (dataSourceItem.type === 'CalculatedField' && droppedClass !== '') {
                droppedClass = 'values';
            }
        }
        if (this.control) {
            let eventArgs = {
                'droppedField': dataSourceItem, 'dataSource': this.parent.dataSource, 'droppedAxis': droppedClass
            };
            this.control.trigger(onFieldDropped, eventArgs);
        }
        if (dataSourceItem) {
            switch (droppedClass) {
                case 'filters':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.filters.splice(droppedPosition, 0, dataSourceItem) :
                        this.parent.dataSource.filters.push(dataSourceItem);
                    break;
                case 'rows':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.rows.splice(droppedPosition, 0, dataSourceItem) :
                        this.parent.dataSource.rows.push(dataSourceItem);
                    break;
                case 'columns':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.columns.splice(droppedPosition, 0, dataSourceItem) :
                        this.parent.dataSource.columns.push(dataSourceItem);
                    break;
                case 'values':
                    droppedPosition !== -1 ?
                        this.parent.dataSource.values.splice(droppedPosition, 0, dataSourceItem) :
                        this.parent.dataSource.values.push(dataSourceItem);
                    break;
            }
        }
    }
    /**
     * Updates the dataSource by removing the given field from the dataSource.
     * @param  {string} fieldName - Defines dropped field name to remove dataSource.
     * @method removeFieldFromReport
     * @return {void}
     * @hidden
     */
    removeFieldFromReport(fieldName) {
        let dataSourceItem;
        let isDataSource = false;
        let rows = this.parent.dataSource.rows;
        let columns = this.parent.dataSource.columns;
        let values = this.parent.dataSource.values;
        let filters = this.parent.dataSource.filters;
        let fields = [rows, columns, values, filters];
        let field = this.parent.engineModule.fieldList[fieldName];
        for (let len = 0, lnt = fields.length; len < lnt; len++) {
            if (!isDataSource && fields[len]) {
                for (let i = 0, n = fields[len].length; i < n; i++) {
                    if (fields[len][i].name === fieldName) {
                        dataSourceItem = fields[len][i].properties ?
                            fields[len][i].properties : fields[len][i];
                        dataSourceItem.type = field.type === 'number' ? dataSourceItem.type :
                            'Count';
                        fields[len].splice(i, 1);
                        isDataSource = true;
                        break;
                    }
                }
            }
        }
        return dataSourceItem;
    }
    /**
     * Creates new field object given field name from the field list data.
     * @param  {string} fieldName - Defines dropped field name to add dataSource.
     * @method getNewField
     * @return {void}
     * @hidden
     */
    getNewField(fieldName) {
        let field = this.parent.engineModule.fieldList[fieldName];
        let newField = {
            name: fieldName,
            caption: field.caption,
            type: field.aggregateType === undefined ? field.type === 'number' ? 'Sum' :
                'Count' : field.aggregateType,
            showNoDataItems: field.showNoDataItems,
            baseField: field.baseField,
            baseItem: field.baseItem,
        };
        return newField;
    }
}

/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
class ErrorDialog {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createErrorDialog
     * @return {void}
     * @hidden
     */
    createErrorDialog(title, description) {
        let errorDialog = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.errorPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: 1000001,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
                    buttonModel: { cssClass: OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                }
            ],
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this)
        });
        this.errorPopUp.appendTo(errorDialog);
    }
    closeErrorDialog() {
        this.errorPopUp.close();
    }
    removeErrorDialog() {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    }
}

/**
 * `FilterDialog` module to create filter dialog.
 */
/** @hidden */
class FilterDialog {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Creates the member filter dialog for the selected field.
     * @method createFilterDialog
     * @return {void}
     * @hidden
     */
    createFilterDialog(treeData, fieldName, fieldCaption, target) {
        let editorDialog = createElement('div', {
            id: this.parent.parentID + '_EditorTreeView',
            className: MEMBER_EDITOR_DIALOG_CLASS,
            attrs: { 'data-fieldName': fieldName, 'aria-label': fieldCaption },
            styles: 'visibility:hidden;'
        });
        let headerTemplate = this.parent.localeObj.getConstant('filter') + ' ' +
            '"' + fieldCaption + '"' + ' ' + this.parent.localeObj.getConstant('by');
        this.filterObject = this.getFilterObject(fieldName);
        this.allowExcelLikeFilter = this.isExcelFilter(fieldName);
        this.parent.element.appendChild(editorDialog);
        this.dialogPopUp = new Dialog({
            animationSettings: { effect: (this.allowExcelLikeFilter ? 'None' : 'Fade') },
            allowDragging: false,
            header: (this.allowExcelLikeFilter ? headerTemplate : fieldCaption),
            content: (this.allowExcelLikeFilter ? '' : this.createTreeView(treeData, fieldCaption, fieldName)),
            isModal: this.parent.renderMode === 'Popup' ? true : this.parent.isAdaptive ? true : false,
            visible: true,
            showCloseIcon: this.allowExcelLikeFilter ? true : false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: this.parent.isDataOverflow ? (this.allowExcelLikeFilter ? '440px' : '400px') :
                (this.allowExcelLikeFilter ? '400px' : '350px'),
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    buttonModel: {
                        cssClass: OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    buttonModel: {
                        cssClass: 'e-clear-filter-button' + (this.allowExcelLikeFilter ? '' : ' ' + ICON_DISABLE),
                        iconCss: 'e-icons e-clear-filter-icon', enableRtl: this.parent.enableRtl,
                        content: this.parent.localeObj.getConstant('clearFilter'), disabled: (this.filterObject ? false : true)
                    }
                },
                {
                    click: this.closeFilterDialog.bind(this),
                    buttonModel: { cssClass: CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: target,
            close: this.removeFilterDialog.bind(this),
            /* tslint:disable-next-line:typedef */
            open: function (args) {
                if (this.element.querySelector('.e-editor-label-wrapper')) {
                    this.element.querySelector('.e-editor-label-wrapper').style.width = this.element.offsetWidth + 'px';
                }
            }
        });
        this.dialogPopUp.appendTo(editorDialog);
        if (this.allowExcelLikeFilter) {
            this.createTabMenu(treeData, fieldCaption, fieldName);
            addClass([this.dialogPopUp.element], 'e-excel-filter');
            this.updateCheckedState(fieldCaption);
        }
        else {
            this.updateCheckedState(fieldCaption);
        }
        setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
        if (this.allowExcelLikeFilter) {
            this.dialogPopUp.element.querySelector('.e-dlg-closeicon-btn').focus();
        }
        else {
            return;
        }
    }
    createTreeView(treeData, fieldCaption, fieldName) {
        let editorTreeWrapper = createElement('div', {
            id: this.parent.parentID + 'EditorDiv',
            className: EDITOR_TREE_WRAPPER_CLASS + (this.allowExcelLikeFilter ? ' e-excelfilter' : '')
        });
        let searchWrapper = createElement('div', {
            id: this.parent.parentID + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: EDITOR_SEARCH_WRAPPER_CLASS
        });
        let editorSearch = createElement('input', { attrs: { 'type': 'text' } });
        let labelWrapper = createElement('div', {
            id: this.parent.parentID + '_LabelDiv', attrs: { 'tabindex': '-1' },
            className: EDITOR_LABEL_WRAPPER_CLASS
        });
        this.parent.editorLabelElement = createElement('label', { className: EDITOR_LABEL_CLASS });
        this.parent.editorLabelElement.innerText = this.parent.isDataOverflow ?
            ((this.parent.currentTreeItems.length - this.parent.control.maxNodeLimitInMemberEditor) +
                this.parent.control.localeObj.getConstant('editorDataLimitMsg')) : '';
        labelWrapper.style.display = this.parent.isDataOverflow ? 'inline-block' : 'none';
        labelWrapper.appendChild(this.parent.editorLabelElement);
        searchWrapper.appendChild(editorSearch);
        let selectAllWrapper = createElement('div', {
            id: this.parent.parentID + '_AllDiv', attrs: { 'tabindex': '-1' },
            className: SELECT_ALL_WRAPPER_CLASS
        });
        let selectAllContainer = createElement('div', { className: SELECT_ALL_CLASS });
        let treeViewContainer = createElement('div', { className: EDITOR_TREE_CONTAINER_CLASS });
        let promptDiv = createElement('div', {
            className: EMPTY_MEMBER_CLASS + ' ' + ICON_DISABLE,
            innerHTML: this.parent.localeObj.getConstant('noMatches')
        });
        selectAllWrapper.appendChild(selectAllContainer);
        editorTreeWrapper.appendChild(searchWrapper);
        editorTreeWrapper.appendChild(selectAllWrapper);
        editorTreeWrapper.appendChild(promptDiv);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search') + ' ' + '"' + fieldCaption + '"',
            enableRtl: this.parent.enableRtl,
            cssClass: EDITOR_SEARCH_CLASS,
            showClearButton: true,
            change: (e) => {
                this.parent.eventBase.searchTreeNodes(e, this.memberTreeView, false);
                let filterDialog = this.dialogPopUp.element;
                let liList = [].slice.call(this.memberTreeView.element.querySelectorAll('li'));
                if (liList.length === 0) {
                    this.allMemberSelect.disableNodes([this.allMemberSelect.element.querySelector('li')]);
                    filterDialog.querySelector('.' + OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                    removeClass([promptDiv], ICON_DISABLE);
                }
                else {
                    this.allMemberSelect.enableNodes([this.allMemberSelect.element.querySelector('li')]);
                    filterDialog.querySelector('.' + OK_BUTTON_CLASS).removeAttribute('disabled');
                    addClass([promptDiv], ICON_DISABLE);
                }
                this.updateCheckedState(fieldCaption);
            }
        });
        this.editorSearch.appendTo(editorSearch);
        let data = [{ id: 'all', name: 'All', checkedStatus: true }];
        this.allMemberSelect = new TreeView({
            fields: { dataSource: data, id: 'id', text: 'name', isChecked: 'checkedStatus', },
            showCheckBox: true,
            enableRtl: this.parent.enableRtl,
        });
        this.allMemberSelect.appendTo(selectAllContainer);
        editorTreeWrapper.appendChild(treeViewContainer);
        this.memberTreeView = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'name', isChecked: 'checkedStatus' },
            showCheckBox: true,
            enableRtl: this.parent.enableRtl,
            nodeChecking: this.validateTreeNode.bind(this)
        });
        this.memberTreeView.appendTo(treeViewContainer);
        editorTreeWrapper.appendChild(labelWrapper);
        return editorTreeWrapper;
    }
    createTabMenu(treeData, fieldCaption, fieldName) {
        let wrapper = createElement('div', {
            className: 'e-filter-tab-wrapper'
        });
        this.dialogPopUp.content = wrapper;
        this.dialogPopUp.dataBind();
        let types = ['Label', 'Value', 'Include', 'Exclude'];
        let regx = '((-|\\+)?[0-9]+(\\.[0-9]+)?)+';
        let member = Object.keys(this.parent.engineModule.fieldList[fieldName].members)[0];
        let formatObj = this.parent.eventBase.getFormatItemByName(fieldName);
        let items = [
            {
                header: {
                    text: this.parent.localeObj.getConstant('member'),
                    iconCss: (this.filterObject && types.indexOf(this.filterObject.type) > 1 ? SELECTED_OPTION_ICON_CLASS : '')
                },
                content: this.createTreeView(treeData, fieldCaption, fieldName)
            }
        ];
        for (let type of types) {
            if (((type === 'Label') && this.parent.dataSource.allowLabelFilter) ||
                (type === 'Value' && this.parent.dataSource.allowValueFilter)) {
                let filterType = (type === 'Label' && ((member).match(regx) &&
                    (member).match(regx)[0].length === (member).length)) ? 'Number' :
                    (type === 'Label' && (new Date(member).toString() !== 'Invalid Date') &&
                        ((formatObj && formatObj.type) || (this.filterObject && this.filterObject.type === 'Date'))) ? 'Date' : type;
                let item = {
                    header: {
                        text: (filterType === 'Number' ? this.parent.localeObj.getConstant('label') :
                            this.parent.localeObj.getConstant(filterType.toLowerCase())),
                        iconCss: (this.filterObject && this.filterObject.type === filterType ? SELECTED_OPTION_ICON_CLASS : '')
                    },
                    /* tslint:disable-next-line:max-line-length */
                    content: this.createCustomFilter(fieldName, (this.filterObject && this.filterObject.type === filterType ? this.filterObject : undefined), filterType.toLowerCase())
                };
                items.push(item);
            }
        }
        let selectedIndex = (this.filterObject ? (['Label', 'Date', 'Number'].indexOf(this.filterObject.type) >= 0) ?
            1 : this.filterObject.type === 'Value' ?
            (this.parent.dataSource.allowLabelFilter && this.parent.dataSource.allowValueFilter) ? 2 : 1 : 0 : 0);
        this.tabObj = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            selectedItem: selectedIndex,
            enableRtl: this.parent.enableRtl
        });
        this.tabObj.appendTo(wrapper);
        if (selectedIndex > 0) {
            /* tslint:disable-next-line:max-line-length */
            addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (selectedIndex === 1 && this.parent.dataSource.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }
    }
    createCustomFilter(fieldName, filterObject, type) {
        let dataSource = [];
        let valueOptions = [];
        let measures = this.parent.dataSource.values;
        let selectedOption = 'DoesNotEquals';
        let selectedValueIndex = 0;
        let options = {
            label: ['Equals', 'DoesNotEquals', 'BeginWith', 'DoesNotBeginWith', 'EndsWith',
                'DoesNotEndsWith', 'Contains', 'DoesNotContains', 'GreaterThan',
                'GreaterThanOrEqualTo', 'LessThan', 'LessThanOrEqualTo', 'Between', 'NotBetween'],
            date: ['Equals', 'DoesNotEquals', 'Before', 'BeforeOrEqualTo', 'After', 'AfterOrEqualTo',
                'Between', 'NotBetween'],
            value: ['Equals', 'DoesNotEquals', 'GreaterThan', 'GreaterThanOrEqualTo', 'LessThan',
                'LessThanOrEqualTo', 'Between', 'NotBetween']
        };
        let betweenOperators = ['Between', 'NotBetween'];
        let operatorCollection = (type === 'label' ? options.label : type === 'date' ? options.date : options.value);
        for (let operator of operatorCollection) {
            selectedOption = ((filterObject && operator === filterObject.condition) ?
                operatorCollection.indexOf(filterObject.condition) >= 0 ?
                    filterObject.condition : operatorCollection[0] : selectedOption);
            dataSource.push({ value: operator, text: this.parent.localeObj.getConstant(operator) });
        }
        let len = measures.length;
        while (len--) {
            valueOptions.unshift({ value: measures[len].name, text: (measures[len].caption ? measures[len].caption : measures[len].name) });
            selectedValueIndex = filterObject && filterObject.type === 'Value' &&
                filterObject.measure === measures[len].name &&
                filterObject.condition === selectedOption ? len : selectedValueIndex;
        }
        let mainDiv = createElement('div', {
            className: FILTER_DIV_CONTENT_CLASS + ' e-' + ((['date', 'number']).indexOf(type) >= 0 ? 'label' : type) + '-filter',
            id: this.parent.parentID + '_' + type + '_filter_div_content',
            attrs: {
                'data-type': type, 'data-fieldName': fieldName, 'data-operator': selectedOption,
                'data-measure': (this.parent.dataSource.values.length > 0 ? this.parent.dataSource.values[selectedValueIndex].name : ''),
                'data-value1': (filterObject && selectedOption === filterObject.condition ? filterObject.value1.toString() : ''),
                'data-value2': (filterObject && selectedOption === filterObject.condition ? filterObject.value1.toString() : '')
            }
        });
        let textContentdiv = createElement('div', {
            className: FILTER_TEXT_DIV_CLASS,
            innerHTML: this.parent.localeObj.getConstant(type + 'TextContent')
        });
        let betweenTextContentdiv = createElement('div', {
            className: BETWEEN_TEXT_DIV_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption) === -1 ? ICON_DISABLE : ''),
            innerHTML: this.parent.localeObj.getConstant('And')
        });
        let separatordiv = createElement('div', { className: SEPARATOR_DIV_CLASS });
        let filterWrapperDiv1 = createElement('div', { className: FILTER_OPTION_WRAPPER_1_CLASS });
        let optionWrapperDiv1 = createElement('div', {
            className: 'e-measure-option-wrapper' + ' ' + (((['label', 'date', 'number']).indexOf(type) >= 0) ? ICON_DISABLE : ''),
        });
        let optionWrapperDiv2 = createElement('div', { className: 'e-condition-option-wrapper' });
        let filterWrapperDiv2 = createElement('div', { className: FILTER_OPTION_WRAPPER_2_CLASS });
        let dropOptionDiv1 = createElement('div', { id: this.parent.parentID + '_' + type + '_measure_option_wrapper' });
        let dropOptionDiv2 = createElement('div', { id: this.parent.parentID + '_' + type + '_contition_option_wrapper' });
        let inputDiv1 = createElement('div', { className: FILTER_INPUT_DIV_1_CLASS });
        let inputDiv2 = createElement('div', {
            className: FILTER_INPUT_DIV_2_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption) === -1 ? ICON_DISABLE : '')
        });
        let inputField1 = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_1', attrs: { 'type': 'text' }
        });
        let inputField2 = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_2', attrs: { 'type': 'text' }
        });
        inputDiv1.appendChild(inputField1);
        inputDiv2.appendChild(inputField2);
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv1.appendChild(separatordiv);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv2.appendChild(inputDiv1);
        filterWrapperDiv2.appendChild(betweenTextContentdiv);
        filterWrapperDiv2.appendChild(inputDiv2);
        /* tslint:disable-next-line:max-line-length */
        this.createElements(filterObject, betweenOperators, dropOptionDiv1, dropOptionDiv2, inputField1, inputField2, valueOptions, dataSource, selectedValueIndex, selectedOption, type);
        mainDiv.appendChild(textContentdiv);
        mainDiv.appendChild(filterWrapperDiv1);
        mainDiv.appendChild(filterWrapperDiv2);
        return mainDiv;
    }
    /* tslint:disable */
    createElements(filterObj, operators, optionDiv1, optionDiv2, inputDiv1, inputDiv2, vDataSource, oDataSource, valueIndex, option, type) {
        let popupInstance = this;
        let optionWrapper1 = new DropDownList({
            dataSource: vDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: valueIndex,
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change(args) {
                let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    setStyleAndAttributes(element, { 'data-measure': args.value });
                }
                else {
                    return;
                }
            }
        });
        optionWrapper1.appendTo(optionDiv1);
        let optionWrapper = new DropDownList({
            dataSource: oDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, value: option,
            cssClass: FILTER_OPERATOR_CLASS, width: '100%',
            change(args) {
                let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    let disabledClasses = [BETWEEN_TEXT_DIV_CLASS, FILTER_INPUT_DIV_2_CLASS];
                    for (let className of disabledClasses) {
                        if (operators.indexOf(args.value) >= 0) {
                            removeClass([element.querySelector('.' + className)], ICON_DISABLE);
                        }
                        else {
                            addClass([element.querySelector('.' + className)], ICON_DISABLE);
                        }
                    }
                    setStyleAndAttributes(element, { 'data-operator': args.value });
                }
                else {
                    return;
                }
            }
        });
        optionWrapper.appendTo(optionDiv2);
        if (type === 'date') {
            let inputObj1 = new DatePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 : null),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    }
                    else {
                        return;
                    }
                },
                width: '100%',
            });
            let inputObj2 = new DatePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 : null),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    }
                    else {
                        return;
                    }
                },
                width: '100%',
            });
            inputObj1.appendTo(inputDiv1);
            inputObj2.appendTo(inputDiv2);
        }
        else if (type === 'value') {
            let inputObj1 = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value1, 10) : undefined),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (e.value ? e.value.toString() : '0'),
                            'data-value2': (inputObj2.value ? inputObj2.value.toString() : '0')
                        });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            let inputObj2 = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value2, 10) : undefined),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (inputObj1.value ? inputObj1.value.toString() : '0'),
                            'data-value2': (e.value ? e.value.toString() : '0')
                        });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1.appendTo(inputDiv1);
            inputObj2.appendTo(inputDiv2);
        }
        else {
            let inputObj1 = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 : ''),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            let inputObj2 = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 : ''),
                change: (e) => {
                    let element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1.appendTo(inputDiv1);
            inputObj2.appendTo(inputDiv2);
        }
    }
    /* tslint:enable */
    updateInputValues(element, type, inputDiv1, inputDiv2) {
        let value1;
        let value2;
        if (type === 'date') {
            let inputObj1 = inputDiv1.ej2_instances[0];
            let inputObj2 = inputDiv2.ej2_instances[0];
            value1 = !isNullOrUndefined(inputObj1.value) ? inputObj1.value.toString() : '';
            value2 = !isNullOrUndefined(inputObj2.value) ? inputObj2.value.toString() : '';
        }
        else {
            let inputObj1 = inputDiv1.ej2_instances[0];
            let inputObj2 = inputDiv2.ej2_instances[0];
            value1 = inputObj1.value;
            value2 = inputObj2.value;
        }
        setStyleAndAttributes(element, { 'data-value1': value1, 'data-value2': value2 });
    }
    validateTreeNode(e) {
        if (e.node.classList.contains(ICON_DISABLE)) {
            e.cancel = true;
        }
        else {
            return;
        }
    }
    /**
     * Update filter state while Member check/uncheck.
     * @hidden
     */
    updateCheckedState(fieldCaption) {
        let filterDialog = this.dialogPopUp.element;
        setStyleAndAttributes(filterDialog, { 'role': 'menu', 'aria-haspopup': 'true' });
        let list = [].slice.call(this.memberTreeView.element.querySelectorAll('li'));
        let uncheckedNodes = this.getUnCheckedNodes();
        let checkedNodes = this.getCheckedNodes();
        let firstNode = this.allMemberSelect.element.querySelector('li').querySelector('span.' + CHECK_BOX_FRAME_CLASS);
        if (list.length > 0) {
            if (checkedNodes.length > 0) {
                if (uncheckedNodes.length > 0) {
                    removeClass([firstNode], NODE_CHECK_CLASS);
                    addClass([firstNode], NODE_STOP_CLASS);
                }
                else if (uncheckedNodes.length === 0) {
                    removeClass([firstNode], NODE_STOP_CLASS);
                    addClass([firstNode], NODE_CHECK_CLASS);
                }
                this.dialogPopUp.buttons[0].buttonModel.disabled = false;
                filterDialog.querySelector('.' + OK_BUTTON_CLASS).removeAttribute('disabled');
            }
            else if (uncheckedNodes.length > 0 && checkedNodes.length === 0) {
                removeClass([firstNode], [NODE_CHECK_CLASS, NODE_STOP_CLASS]);
                if (this.getCheckedNodes().length === checkedNodes.length) {
                    this.dialogPopUp.buttons[0].buttonModel.disabled = true;
                    filterDialog.querySelector('.' + OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                }
            }
        }
        else {
            this.dialogPopUp.buttons[0].buttonModel.disabled = true;
            filterDialog.querySelector('.' + OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
        }
    }
    getCheckedNodes() {
        let checkeNodes = this.parent.searchTreeItems.filter((item) => {
            return item.checkedStatus;
        });
        return checkeNodes;
    }
    getUnCheckedNodes() {
        let unCheckeNodes = this.parent.searchTreeItems.filter((item) => {
            return !item.checkedStatus;
        });
        return unCheckeNodes;
    }
    isExcelFilter(fieldName) {
        let isFilterField = false;
        for (let field of this.parent.dataSource.filters) {
            if (field.name === fieldName) {
                isFilterField = true;
                break;
            }
        }
        if (!isFilterField && (this.parent.dataSource.allowLabelFilter || this.parent.dataSource.allowValueFilter)) {
            return true;
        }
        else {
            return false;
        }
    }
    getFilterObject(fieldName) {
        let filterObj = this.parent.eventBase.getFilterItemByName(fieldName);
        if (filterObj && (((['Label', 'Date', 'Number'].indexOf(filterObj.type) >= 0) &&
            this.parent.dataSource.allowLabelFilter) || (filterObj.type === 'Value' && this.parent.dataSource.allowValueFilter) ||
            (['Include', 'Exclude'].indexOf(filterObj.type) >= 0))) {
            return filterObj;
        }
        return undefined;
    }
    closeFilterDialog() {
        if (this.allowExcelLikeFilter) {
            if (this.tabObj && !this.tabObj.isDestroyed) {
                this.tabObj.destroy();
            }
        }
        this.dialogPopUp.close();
    }
    removeFilterDialog() {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_EditorTreeView')) {
            remove(document.getElementById(this.parent.parentID + '_EditorTreeView'));
        }
    }
}

/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource
 * @hidden
 */
/** @hidden */
class PivotCommon {
    /**
     * Constructor for PivotEngine class
     * @param  {PivotEngine} pivotEngine?
     * @param  {DataOptions} dataSource?
     * @param  {string} element?
     * @hidden
     */
    constructor(control) {
        /** @hidden */
        this.currentTreeItems = [];
        /** @hidden */
        this.savedTreeFilterPos = {};
        /** @hidden */
        this.currentTreeItemsPos = {};
        /** @hidden */
        this.searchTreeItems = [];
        /** @hidden */
        this.isDataOverflow = false;
        /** @hidden */
        this.isDateField = false;
        this.element = control.element;
        this.moduleName = control.moduleName;
        this.dataSource = control.dataSource;
        this.engineModule = control.pivotEngine;
        this.enableRtl = control.enableRtl;
        this.isAdaptive = control.isAdaptive;
        this.renderMode = control.renderMode;
        this.parentID = control.id;
        this.localeObj = control.localeObj;
        this.nodeStateModified = new NodeStateModified(this);
        this.dataSourceUpdate = new DataSourceUpdate(this);
        this.eventBase = new EventBase(this);
        this.filterDialog = new FilterDialog(this);
        this.errorDialog = new ErrorDialog(this);
        this.keyboardModule = new CommonKeyboardInteraction(this);
        return this;
    }
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    destroy() {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
    }
}

/**
 * Module to render Pivot Field List Dialog
 */
/** @hidden */
class DialogRenderer {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the field list layout rendering
     * @returns void
     * @private
     */
    render() {
        let fieldListWrappper = createElement('div', {
            id: this.parent.element.id + '_Wrapper',
            className: WRAPPER_CLASS,
            styles: 'width:' + this.parent.element.style.width
        });
        if (this.parent.isAdaptive) {
            addClass([fieldListWrappper], DEVICE);
        }
        else {
            removeClass([fieldListWrappper], DEVICE);
        }
        if (this.parent.enableRtl) {
            addClass([fieldListWrappper], RTL);
        }
        else {
            removeClass([fieldListWrappper], RTL);
        }
        if (this.parent.cssClass) {
            addClass([fieldListWrappper], this.parent.cssClass);
        }
        this.parentElement = createElement('div', { className: CONTAINER_CLASS });
        this.parent.element.appendChild(fieldListWrappper);
        if (this.parent.isAdaptive) {
            fieldListWrappper.removeAttribute('style');
            this.parentElement = createElement('div', { className: ADAPTIVE_CONTAINER_CLASS });
            this.renderAdaptiveLayout(fieldListWrappper);
        }
        if (this.parent.renderMode === 'Popup') {
            this.renderFieldListDialog(fieldListWrappper);
            this.unWireDialogEvent(this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS));
            this.wireDialogEvent(this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS));
        }
        else {
            this.renderStaticLayout(fieldListWrappper);
        }
    }
    renderStaticLayout(fieldListWrappper) {
        if (!this.parent.isAdaptive) {
            let layoutHeader = createElement('div', {
                className: FIELD_LIST_TITLE_CLASS
            });
            let headerContent = createElement('div', {
                className: FIELD_LIST_TITLE_CONTENT_CLASS,
                innerHTML: this.parent.localeObj.getConstant('staticFieldList')
            });
            layoutHeader.appendChild(headerContent);
            layoutHeader.appendChild(this.createCalculatedButton());
            addClass([fieldListWrappper], STATIC_FIELD_LIST_CLASS);
            fieldListWrappper.appendChild(layoutHeader);
            fieldListWrappper.appendChild(this.parentElement);
            addClass([fieldListWrappper], STATIC_FIELD_LIST_CLASS);
            if (this.parent.allowDeferLayoutUpdate) {
                fieldListWrappper.appendChild(this.createDeferUpdateButtons());
                this.renderDeferUpdateButtons();
            }
        }
    }
    renderDeferUpdateButtons() {
        if (this.parent.allowDeferLayoutUpdate) {
            this.deferUpdateCheckBox = new CheckBox({
                label: this.parent.localeObj.getConstant('deferLayoutUpdate'),
                checked: true,
                enableRtl: this.parent.enableRtl,
                change: this.onCheckChange.bind(this)
            });
            this.deferUpdateCheckBox.appendTo('#' + this.parent.element.id + 'DeferUpdateCheckBox');
            this.deferUpdateApplyButton = new Button({
                cssClass: DEFER_APPLY_BUTTON + ' ' + DEFER_UPDATE_BUTTON + (this.parent.renderMode === 'Popup' ?
                    (' ' + BUTTON_FLAT_CLASS) : ''),
                content: this.parent.localeObj.getConstant('apply'),
                enableRtl: this.parent.enableRtl,
                isPrimary: true
            });
            this.deferUpdateApplyButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton1');
            this.deferUpdateApplyButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.applyButtonClick.bind(this) :
                this.onDeferUpdateClick.bind(this);
        }
        this.deferUpdateCancelButton = new Button({
            cssClass: DEFER_CANCEL_BUTTON + ' ' + CANCEL_BUTTON_CLASS + (this.parent.renderMode === 'Popup' ?
                (' ' + BUTTON_FLAT_CLASS) : ''),
            content: this.parent.allowDeferLayoutUpdate ? this.parent.localeObj.getConstant('cancel') :
                this.parent.localeObj.getConstant('close'),
            enableRtl: this.parent.enableRtl, isPrimary: !this.parent.allowDeferLayoutUpdate
        });
        this.deferUpdateCancelButton.appendTo('#' + this.parent.element.id + '_DeferUpdateButton2');
        this.deferUpdateCancelButton.element.onclick = this.parent.renderMode === 'Fixed' ? this.cancelButtonClick.bind(this) :
            this.onCloseFieldList.bind(this);
    }
    createDeferUpdateButtons() {
        let layoutFooter = createElement('div', {
            className: LAYOUT_FOOTER
        });
        if (this.parent.allowDeferLayoutUpdate) {
            let checkBoxLayout = createElement('div', {
                className: CHECKBOX_LAYOUT
            });
            let deferUpdateCheckBox = createElement('input', {
                id: this.parent.element.id + 'DeferUpdateCheckBox'
            });
            checkBoxLayout.appendChild(deferUpdateCheckBox);
            layoutFooter.appendChild(checkBoxLayout);
        }
        let buttonLayout = createElement('div', {
            className: BUTTON_LAYOUT
        });
        if (this.parent.allowDeferLayoutUpdate) {
            let deferUpdateButton1 = createElement('button', {
                id: this.parent.element.id + '_DeferUpdateButton1'
            });
            buttonLayout.appendChild(deferUpdateButton1);
        }
        let deferUpdateButton2 = createElement('button', {
            id: this.parent.element.id + '_DeferUpdateButton2'
        });
        buttonLayout.appendChild(deferUpdateButton2);
        layoutFooter.appendChild(buttonLayout);
        return layoutFooter;
    }
    onCheckChange(args) {
        if (args.checked) {
            this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true);
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
        }
        this.parent.allowDeferLayoutUpdate = !this.parent.allowDeferLayoutUpdate;
        if (this.parent.renderMode === 'Fixed') {
            this.deferUpdateApplyButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
            this.deferUpdateCancelButton.setProperties({ disabled: !this.parent.allowDeferLayoutUpdate });
        }
        else {
            if (this.parent.allowDeferLayoutUpdate) {
                this.deferUpdateApplyButton.element.style.display = '';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('cancel') });
                this.deferUpdateCancelButton.isPrimary = false;
            }
            else {
                this.deferUpdateApplyButton.element.style.display = 'none';
                this.deferUpdateCancelButton.setProperties({ content: this.parent.localeObj.getConstant('close') });
                this.deferUpdateCancelButton.isPrimary = true;
            }
        }
        this.cancelButtonClick();
    }
    applyButtonClick() {
        this.parent.updateDataSource(false);
        this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true);
        this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
    }
    cancelButtonClick() {
        this.parent.
            setProperties({ dataSource: this.parent.clonedDataSource.properties }, true);
        this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
        this.parent.updateDataSource(false, true);
    }
    renderFieldListDialog(fieldListWrappper) {
        let toggleFieldList = createElement('div', {
            className: TOGGLE_FIELD_LIST_CLASS + ' ' + ICON + ' ' + TOGGLE_SELECT_CLASS,
            attrs: {
                'tabindex': '0',
                title: this.parent.localeObj.getConstant('fieldList'),
                'aria-disabled': 'false',
                'aria-label': this.parent.localeObj.getConstant('fieldList')
            }
        });
        this.parent.element.appendChild(toggleFieldList);
        if (this.parent.isAdaptive) {
            let headerTemplate = '<div class=' + TITLE_MOBILE_HEADER + '><span class="' + ICON + ' ' +
                BACK_ICON + '"></span><div class=' + TITLE_MOBILE_CONTENT + '>' + this.parent.localeObj.getConstant('fieldList') +
                '</div></div>';
            let buttons = [{
                    click: this.showFieldListDialog.bind(this),
                    buttonModel: {
                        cssClass: ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + BUTTON_SMALL_CLASS + ' ' + BUTTON_ROUND_CLASS,
                        iconCss: ICON + ' ' + ADD_ICON_CLASS,
                        isPrimary: true
                    }
                }, {
                    click: this.showCalculatedField.bind(this),
                    buttonModel: {
                        cssClass: ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                            ' ' + BUTTON_SMALL_CLASS + ' ' + BUTTON_ROUND_CLASS + ' ' + ICON_DISABLE,
                        iconCss: ICON + ' ' + ADD_ICON_CLASS, enableRtl: this.parent.enableRtl,
                        isPrimary: true
                    }
                }];
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: this.parent.enableRtl ? 'SlideRight' : 'SlideLeft' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: true,
                showCloseIcon: false,
                visible: false,
                allowDragging: false,
                closeOnEscape: false,
                enableRtl: this.parent.enableRtl,
                width: '100%',
                height: '100%',
                position: { X: 'center', Y: 'center' },
                buttons: buttons,
                target: document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.appendTo(fieldListWrappper);
            setStyleAttribute(fieldListWrappper.querySelector('#' + fieldListWrappper.id + '_dialog-content'), {
                'padding': '0'
            });
            let footer = fieldListWrappper.querySelector('.' + FOOTER_CONTENT_CLASS);
            addClass([footer], FIELD_LIST_FOOTER_CLASS);
            removeClass([footer.querySelector('.' + ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], BUTTON_FLAT_CLASS);
            removeClass([footer.querySelector('.' + ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], BUTTON_FLAT_CLASS);
            this.fieldListDialog.element.querySelector('.' + BACK_ICON).onclick =
                this.parent.allowDeferLayoutUpdate ? this.onDeferUpdateClick.bind(this) : this.onCloseFieldList.bind(this);
        }
        else {
            let template = this.createDeferUpdateButtons().outerHTML;
            let headerTemplate = '<div class=' + TITLE_HEADER_CLASS + '><div class=' +
                TITLE_CONTENT_CLASS + '>' + this.parent.localeObj.getConstant('fieldList') + '</div></div>';
            this.fieldListDialog = new Dialog({
                animationSettings: { effect: 'Zoom' },
                header: headerTemplate,
                content: this.parentElement,
                isModal: false,
                showCloseIcon: false,
                visible: false,
                allowDragging: true,
                enableRtl: this.parent.enableRtl,
                width: this.parent.element.style.width,
                position: { X: 'center', Y: this.parent.element.offsetTop },
                footerTemplate: template,
                closeOnEscape: true,
                target: !isNullOrUndefined(this.parent.target) ? ((typeof this.parent.target) === 'string') ?
                    document.querySelector(this.parent.target) : this.parent.target : document.body,
                close: this.removeFieldListIcon.bind(this)
            });
            this.fieldListDialog.appendTo(fieldListWrappper);
            this.renderDeferUpdateButtons();
            setStyleAttribute(fieldListWrappper.querySelector('#' + fieldListWrappper.id + '_title'), { 'width': '100%' });
            fieldListWrappper.querySelector('.' + TITLE_HEADER_CLASS).appendChild(this.createCalculatedButton());
        }
    }
    /**
     * Called internally if any of the field added to axis.
     * @hidden
     */
    updateDataSource(selectedNodes) {
        let axis = ['filters', 'columns', 'rows', 'values'];
        for (let field of selectedNodes) {
            let fieldName = field;
            let droppedClass = axis[this.adaptiveElement.selectedItem];
            this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ?
                this.parent : (this.parent.pivotGridModule ?
                this.parent.pivotGridModule : this.parent);
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, droppedClass, -1);
        }
        this.parent.axisFieldModule.render();
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        }
        else {
            this.parent.triggerPopulateEvent();
        }
    }
    onDeferUpdateClick() {
        this.parent.updateDataSource();
        this.parent.dialogRenderer.fieldListDialog.hide();
    }
    renderAdaptiveLayout(fieldListWrappper) {
        let layoutFooter = createElement('div', {
            className: FIELD_LIST_FOOTER_CLASS
        });
        fieldListWrappper.appendChild(this.parentElement);
        let items = [
            {
                header: { 'text': this.parent.localeObj.getConstant('filters') },
                content: this.createAxisTable('filters')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('columns') },
                content: this.createAxisTable('columns')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('rows') },
                content: this.createAxisTable('rows')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('values') },
                content: this.createAxisTable('values')
            },
            {
                header: { 'text': this.parent.localeObj.getConstant('createCalculatedField') },
                content: 'Calculated Field Related UI'
            }
        ];
        if (!this.parent.allowCalculatedField) {
            items.pop();
        }
        this.adaptiveElement = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            enableRtl: this.parent.enableRtl,
            selected: (e) => {
                if (fieldListWrappper.querySelector('.' + ADAPTIVE_FIELD_LIST_BUTTON_CLASS)) {
                    if (e.selectedIndex !== 4) {
                        addClass([fieldListWrappper.querySelector('.' + ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], ICON_DISABLE);
                        removeClass([fieldListWrappper.querySelector('.' + ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], ICON_DISABLE);
                    }
                    else {
                        removeClass([fieldListWrappper.querySelector('.' + ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], ICON_DISABLE);
                        addClass([fieldListWrappper.querySelector('.' + ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], ICON_DISABLE);
                    }
                }
                if (e.selectedIndex === 4) {
                    this.adaptiveElement.items[4].content = '';
                    this.adaptiveElement.dataBind();
                    this.parent.notify(initCalculatedField, {});
                }
                else {
                    this.parent.axisFieldModule.render();
                }
            }
        });
        if (this.parent.renderMode === 'Fixed') {
            layoutFooter.appendChild(this.createAddButton());
            addClass([fieldListWrappper], STATIC_FIELD_LIST_CLASS);
            this.adaptiveElement.appendTo(this.parentElement);
            this.parentElement.appendChild(layoutFooter);
        }
        else {
            this.adaptiveElement.appendTo(this.parentElement);
        }
    }
    createCalculatedButton() {
        let calculatedButton = createElement('div', {
            id: this.parent.element.id + '_CalculatedField'
        });
        let calculateField = new Button({
            cssClass: CALCULATED_FIELD_CLASS + ' ' + ICON_DISABLE,
            content: this.parent.localeObj.getConstant('calculatedField'),
            enableRtl: this.parent.enableRtl
        });
        calculateField.appendTo(calculatedButton);
        if (this.parent.calculatedFieldModule) {
            removeClass([calculatedButton], ICON_DISABLE);
        }
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        return calculatedButton;
    }
    createAddButton() {
        let footerContainer = createElement('div', {
            className: FIELD_LIST_FOOTER_CLASS + '-content'
        });
        let fieldListButton = createElement('div', {});
        let calculatedButton = createElement('div', {});
        let calculateField = new Button({
            cssClass: ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                ' ' + BUTTON_SMALL_CLASS + ' ' + BUTTON_ROUND_CLASS + ' ' + ICON_DISABLE,
            iconCss: ICON + ' ' + ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        let fieldList = new Button({
            cssClass: ADAPTIVE_FIELD_LIST_BUTTON_CLASS + ' ' + BUTTON_SMALL_CLASS + ' ' + BUTTON_ROUND_CLASS,
            iconCss: ICON + ' ' + ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        fieldList.appendTo(fieldListButton);
        calculateField.appendTo(calculatedButton);
        footerContainer.appendChild(fieldListButton);
        footerContainer.appendChild(calculatedButton);
        calculateField.element.onclick = this.showCalculatedField.bind(this);
        fieldList.element.onclick = this.showFieldListDialog.bind(this);
        return footerContainer;
    }
    createAxisTable(axis) {
        let axisWrapper = createElement('div', {
            className: FIELD_LIST_CLASS + '-' + axis
        });
        let axisContent = createElement('div', { className: AXIS_CONTENT_CLASS + ' ' + 'e-' + axis });
        let axisPrompt = createElement('span', {
            className: AXIS_PROMPT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('addPrompt')
        });
        axisWrapper.appendChild(axisContent);
        axisWrapper.appendChild(axisPrompt);
        return axisWrapper;
    }
    showCalculatedField(event) {
        if (!this.parent.isAdaptive) {
            if (this.parent.dialogRenderer.fieldListDialog) {
                this.parent.dialogRenderer.fieldListDialog.hide();
                addClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
            }
        }
        this.parent.notify(initCalculatedField, {});
    }
    showFieldListDialog(event) {
        let activeindex = this.adaptiveElement.selectedItem;
        this.parent.treeViewModule.render(activeindex);
    }
    onShowFieldList() {
        if (this.parent.allowDeferLayoutUpdate) {
            if (this.parent.isAdaptive) {
                this.parent.axisFieldModule.render();
            }
            this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true);
            this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
        }
        addClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
        this.parent.dialogRenderer.fieldListDialog.show();
        this.parent.dialogRenderer.fieldListDialog.element.style.top =
            parseInt(this.parent.dialogRenderer.fieldListDialog.element.style.top, 10) < 0 ?
                '0px' : this.parent.dialogRenderer.fieldListDialog.element.style.top;
    }
    onCloseFieldList() {
        if (this.parent.allowDeferLayoutUpdate) {
            this.parent.dataSource =
                extend({}, this.parent.clonedDataSource.properties, null, true);
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.
                setProperties({ dataSource: this.parent.clonedDataSource.properties }, true);
            this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
            this.parent.pivotGridModule.notify(uiUpdate, this);
            this.parent.pivotGridModule.notify(contentReady, this);
        }
        this.parent.dialogRenderer.fieldListDialog.hide();
    }
    removeFieldListIcon() {
        if (!document.getElementById(this.parent.element.id + 'calculateddialog')) {
            removeClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
        }
    }
    keyPress(e) {
        let target = e.target;
        if (e.keyCode === 13 && e.target) {
            e.target.click();
            e.preventDefault();
            return;
        }
    }
    wireDialogEvent(element) {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.onShowFieldList, this);
    }
    unWireDialogEvent(element) {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.onShowFieldList);
    }
}

/**
 * Module to render Field List
 */
/** @hidden */
class TreeViewRenderer {
    /** Constructor for render module */
    constructor(parent) {
        this.selectedNodes = [];
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    render(axis) {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        if (!this.parent.isAdaptive) {
            let fieldTable = createElement('div', { className: FIELD_TABLE_CLASS });
            let treeHeader = createElement('div', {
                className: FIELD_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant('allFields')
            });
            this.treeViewElement = createElement('div', {
                id: this.parent.element.id + '_TreeView',
                className: FIELD_LIST_CLASS
            });
            fieldTable.appendChild(treeHeader);
            fieldTable.appendChild(this.treeViewElement);
            this.parentElement.appendChild(fieldTable);
            if (this.parent.renderMode === 'Fixed') {
                let centerDiv = createElement('div', { className: STATIC_CENTER_DIV_CLASS });
                let axisHeader = createElement('div', {
                    className: STATIC_CENTER_HEADER_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('centerHeader')
                });
                this.parentElement.appendChild(centerDiv);
                this.parentElement.appendChild(axisHeader);
            }
            this.renderTreeView();
        }
        else {
            this.renderTreeDialog(axis);
        }
    }
    renderTreeView() {
        this.fieldTable = new TreeView({
            fields: { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected' },
            nodeChecked: this.nodeStateChange.bind(this),
            cssClass: FIELD_LIST_TREE_CLASS,
            showCheckBox: true,
            allowDragAndDrop: true,
            sortOrder: 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeDragStart: this.dragStart.bind(this),
            nodeDragStop: this.dragStop.bind(this)
        });
        this.treeViewElement.innerHTML = '';
        this.fieldTable.appendTo(this.treeViewElement);
        this.getTreeUpdate();
    }
    renderTreeDialog(axis) {
        let fieldListDialog = createElement('div', {
            id: this.parent.element.id + '_FieldListTreeView',
            className: ADAPTIVE_FIELD_LIST_DIALOG_CLASS
        });
        this.parentElement.appendChild(fieldListDialog);
        this.fieldDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('adaptiveFieldHeader'),
            content: this.createTreeView(this.getTreeData(axis)),
            isModal: true,
            visible: true,
            showCloseIcon: false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: '350px',
            position: { X: 'center', Y: 'center' },
            buttons: [{
                    click: this.closeTreeDialog.bind(this),
                    buttonModel: {
                        cssClass: CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel')
                    }
                }, {
                    click: this.onFieldAdd.bind(this),
                    buttonModel: {
                        cssClass: OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('add'),
                        isPrimary: true
                    }
                }],
            closeOnEscape: true,
            target: this.parentElement.parentElement,
            close: () => {
                if (document.getElementById(this.parent.element.id + '_FieldListTreeView')) {
                    remove(document.getElementById(this.parent.element.id + '_FieldListTreeView'));
                }
            }
        });
        this.fieldDialog.appendTo(fieldListDialog);
    }
    createTreeView(treeData) {
        let editorTreeWrapper = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: EDITOR_TREE_WRAPPER_CLASS
        });
        let searchWrapper = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: EDITOR_SEARCH_WRAPPER_CLASS
        });
        let editorSearch = createElement('input', { attrs: { 'type': 'text' } });
        searchWrapper.appendChild(editorSearch);
        let treeViewContainer = createElement('div', { className: EDITOR_TREE_CONTAINER_CLASS });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            cssClass: EDITOR_SEARCH_CLASS,
            change: (e) => {
                this.parent.pivotCommon.eventBase.searchTreeNodes(e, this.fieldTable, true);
            }
        });
        this.editorSearch.appendTo(editorSearch);
        editorTreeWrapper.appendChild(treeViewContainer);
        this.fieldTable = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected' },
            showCheckBox: true,
            sortOrder: 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeChecked: this.addNode.bind(this),
        });
        this.fieldTable.appendTo(treeViewContainer);
        return editorTreeWrapper;
    }
    dragStart(args) {
        if (args.event.target.classList.contains(DRAG_CLASS)) {
            this.parent.isDragging = true;
            addClass([args.draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
            let data = this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
            let axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
            if (data && data.aggregateType === 'CalculatedField') {
                for (let axisContent of axis) {
                    addClass([this.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
                }
            }
        }
        else {
            args.cancel = true;
        }
    }
    dragStop(args) {
        args.cancel = true;
        this.parent.isDragging = false;
        let axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        for (let axisElement of axis) {
            removeClass([this.parentElement.querySelector('.' + axisElement)], NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        let fieldName = args.draggedNodeData.id.toString();
        if (!this.isNodeDropped(args, fieldName)) {
            return;
        }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            (this.parent.pivotGridModule ? this.parent.pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, fieldName)) {
            if (this.parent.allowDeferLayoutUpdate) {
                this.updateDataSource();
            }
            else {
                this.parent.updateDataSource();
            }
            this.parent.axisFieldModule.render();
        }
    }
    isNodeDropped(args, targetID) {
        let isDropped = true;
        if (args.draggedNodeData.isChecked === 'true') {
            let target = this.getButton(targetID);
            let axisPanel = closest(target, '.' + DROPPABLE_CLASS);
            let droppableElement = closest(args.target, '.' + DROPPABLE_CLASS);
            if (target && axisPanel === droppableElement) {
                let pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                let dropTarget = closest(args.target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
                let sourcePosition;
                let dropPosition = -1;
                for (let i = 0, n = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        let droppableButton = dropTarget.querySelector('.' + PIVOT_BUTTON_CLASS);
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    let parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    }
    getButton(fieldName) {
        let wrapperElement = document.getElementById(this.parent.element.id + '_Wrapper');
        let pivotButtons = [].slice.call(wrapperElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
        let buttonElement;
        for (let i = 0, n = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i].id === fieldName) {
                buttonElement = pivotButtons[i];
                break;
            }
        }
        return buttonElement;
    }
    nodeStateChange(args) {
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        let node = closest(args.node, '.' + TEXT_CONTENT_CLASS);
        let list = this.parent.pivotFieldList;
        let selectedNode = list[args.data[0].id.toString()];
        if (args.action === 'check') {
            addClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
            let addNode = this.parent.pivotCommon.dataSourceUpdate.getNewField(args.data[0].id.toString());
            selectedNode.type === 'number' ?
                this.parent.dataSource.values.push(addNode) : this.parent.dataSource.rows.push(addNode);
        }
        else {
            removeClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(args.data[0].id.toString());
        }
        if (!this.parent.allowDeferLayoutUpdate) {
            this.parent.updateDataSource(true);
        }
        else {
            if (args.action === 'check') {
                selectedNode.isSelected = true;
            }
            else {
                selectedNode.isSelected = false;
            }
            this.updateDataSource();
        }
        this.parent.axisFieldModule.render();
    }
    updateDataSource() {
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.
                setProperties({ dataSource: this.parent.dataSource.properties }, true);
            this.parent.pivotGridModule.notify(uiUpdate, this);
        }
        else {
            this.parent.triggerPopulateEvent();
        }
    }
    addNode(args) {
        let fieldList = this.parent.pivotFieldList;
        let selectedNode = fieldList[args.data[0].id.toString()];
        if (args.action === 'check') {
            this.selectedNodes.push(selectedNode.id.toString());
        }
        else {
            let count = this.selectedNodes.length;
            while (count--) {
                if (this.selectedNodes[count] === selectedNode.id.toString()) {
                    this.selectedNodes.splice(count, 1);
                    break;
                }
            }
        }
    }
    getTreeUpdate() {
        let liElements = [].slice.call(this.treeViewElement.querySelectorAll('.' + TEXT_CONTENT_CLASS));
        for (let liElement of liElements) {
            let dragElement = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: this.parent.localeObj.getConstant('drag'),
                    'aria-disabled': 'false'
                },
                className: ICON + ' ' + DRAG_CLASS
            });
            prepend([dragElement], liElement);
            if (liElement.querySelector('.' + NODE_CHECK_CLASS)) {
                addClass([liElement.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
            }
        }
    }
    refreshTreeView() {
        if (this.fieldTable) {
            this.fieldTable.fields = { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected' };
            this.fieldTable.dataBind();
            this.getTreeUpdate();
        }
    }
    getTreeData(axis) {
        let data = [];
        let keys = Object.keys(this.parent.pivotFieldList);
        let fieldList = extend({}, this.parent.pivotFieldList, null, true);
        if (this.parent.isAdaptive) {
            let fields = [this.parent.dataSource.filters, this.parent.dataSource.columns, this.parent.dataSource.rows,
                this.parent.dataSource.values];
            let currentFieldSet = fields[axis];
            let len = keys.length;
            while (len--) {
                fieldList[keys[len]].isSelected = false;
            }
            for (let item of currentFieldSet) {
                fieldList[item.name].isSelected = true;
            }
        }
        let list = fieldList;
        for (let member of keys) {
            let obj = list[member];
            data.push(obj);
        }
        return data;
    }
    onFieldAdd(e) {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    }
    closeTreeDialog() {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.parent.on(treeViewUpdate, this.refreshTreeView, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(treeViewUpdate, this.refreshTreeView);
    }
    /**
     * To destroy the tree view event listener
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

/**
 * Module to render Axis Field Table
 */
/** @hidden */
class AxisTableRenderer {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the axis table rendering
     * @returns void
     * @private
     */
    render() {
        if (!this.parent.isAdaptive) {
            let axisTable = createElement('div', { className: AXIS_TABLE_CLASS });
            this.leftAxisPanel = createElement('div', { className: LEFT_AXIS_PANEL_CLASS });
            this.rightAxisPanel = createElement('div', { className: RIGHT_AXIS_PANEL_CLASS });
            this.parent.dialogRenderer.parentElement.appendChild(axisTable);
            axisTable.appendChild(this.leftAxisPanel);
            axisTable.appendChild(this.rightAxisPanel);
            this.axisTable = axisTable;
            this.renderAxisTable();
        }
        this.parent.axisFieldModule.render();
    }
    renderAxisTable() {
        let fieldLabels = ['filters', 'rows', 'columns', 'values'];
        for (let len = 0, lnt = fieldLabels.length; len < lnt; len++) {
            let axis = createElement('div', {
                className: FIELD_LIST_CLASS + '-' + fieldLabels[len]
            });
            let axisTitleWrapper = createElement('div', {
                className: AXIS_ICON_CLASS + '-wrapper'
            });
            let axisTitle = createElement('div', {
                className: AXIS_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant(fieldLabels[len])
            });
            axisTitleWrapper.appendChild(this.getIconupdate(fieldLabels[len]));
            axisTitleWrapper.appendChild(axisTitle);
            let axisContent = createElement('div', { className: AXIS_CONTENT_CLASS + ' ' + 'e-' + fieldLabels[len] });
            let localePrompt;
            if (fieldLabels[len] === 'rows') {
                localePrompt = this.parent.localeObj.getConstant('dropRowPrompt');
            }
            else if (fieldLabels[len] === 'columns') {
                localePrompt = this.parent.localeObj.getConstant('dropColPrompt');
            }
            else if (fieldLabels[len] === 'values') {
                localePrompt = this.parent.localeObj.getConstant('dropValPrompt');
            }
            else {
                localePrompt = this.parent.localeObj.getConstant('dropFilterPrompt');
            }
            let axisPrompt = createElement('span', {
                className: AXIS_PROMPT_CLASS,
                innerHTML: localePrompt
            });
            let droppable = new Droppable(axisContent, {});
            axis.appendChild(axisTitleWrapper);
            axis.appendChild(axisContent);
            axis.appendChild(axisPrompt);
            if (len <= 1) {
                this.leftAxisPanel.appendChild(axis);
            }
            else {
                this.rightAxisPanel.appendChild(axis);
            }
            this.unWireEvent(axisContent);
            this.wireEvent(axisContent);
        }
    }
    getIconupdate(axis) {
        let axisWrapper = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: AXIS_ICON_CLASS + '-icon-wrapper'
        });
        let axisElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: ICON + ' ' + AXIS_ICON_CLASS + '-' + axis
        });
        axisWrapper.appendChild(axisElement);
        return axisWrapper;
    }
    wireEvent(element) {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        EventHandler.add(element, 'mouseleave', this.updateDropIndicator, this);
    }
    unWireEvent(element) {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        EventHandler.remove(element, 'mouseleave', this.updateDropIndicator);
    }
    updateDropIndicator(e) {
        let parentElement = this.parent.dialogRenderer.parentElement;
        if (this.parent.isDragging && e.target.classList.contains(AXIS_CONTENT_CLASS) && e.type === 'mouseover') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            let element = [].slice.call(e.target.querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
            if (element.length > 0) {
                addClass([element[element.length - 1].querySelector('.' + DROP_INDICATOR_CLASS + '-last')], INDICATOR_HOVER_CLASS);
            }
        }
        else if (e.type === 'mouseleave') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
    }
}

/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
class AggregateMenu {
    /**
     * Constructor for the rener action.
     * @hidden
     */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    render(args, parentElement) {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    }
    openContextMenu(args) {
        if (this.menuInfo === undefined) {
            this.createContextMenu();
        }
        this.currentMenu = args.currentTarget;
        let pos = this.currentMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuInfo.open(pos.top, pos.left - 105);
        }
        else {
            this.menuInfo.open(pos.top, pos.left);
        }
    }
    createContextMenu() {
        let menuItems = [
            { text: 'Sum', id: 'Sum' },
            { text: 'Count', id: 'Count' },
            { text: 'Distinct Count', id: 'DistinctCount' },
            { text: 'Product', id: 'Product' },
            { text: 'Avg', id: 'Avg' },
            { text: 'Min', id: 'Min' },
            { text: 'Max', id: 'Max' },
            { text: 'More...', id: 'MoreOption' }
        ];
        let menuOptions = {
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectOptionInContextMenu.bind(this)
        };
        let removeContextMenu = document.getElementById(this.parent.element.id + 'valueFieldContextMenu');
        if (removeContextMenu !== null) {
            removeContextMenu.innerHTML = '';
        }
        this.parent.element.appendChild(createElement('ul', {
            id: this.parent.element.id + 'valueFieldContextMenu'
        }));
        this.menuInfo = new ContextMenu$1(menuOptions);
        this.menuInfo.appendTo('#' + this.parent.element.id + 'valueFieldContextMenu');
    }
    beforeMenuOpen(args) {
        args.element.style.zIndex = (this.menuInfo.element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    }
    createValueSettingsDialog(target) {
        let valueDialog = createElement('div', {
            id: this.parentElement.id + '_ValueDialog',
            className: 'e-value-field-settings',
            attrs: { 'data-field': target.id }
        });
        this.parentElement.appendChild(valueDialog);
        this.valueDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: true,
            header: this.parent.localeObj.getConstant('valueFieldSettings'),
            content: this.createFieldOptions(target),
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.updateValueSettings.bind(this),
                    buttonModel: { cssClass: OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                },
                {
                    click: () => { this.valueDialog.hide(); },
                    buttonModel: { cssClass: CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parentElement,
            overlayClick: () => { this.removeDialog(); },
            close: this.removeDialog.bind(this)
        });
        this.valueDialog.appendTo(valueDialog);
    }
    /* tslint:disable:all */
    createFieldOptions(buttonElement) {
        let fieldCaption = buttonElement.getAttribute('data-caption');
        let summaryType = buttonElement.getAttribute('data-type');
        let baseField = buttonElement.getAttribute('data-basefield');
        let baseItem = buttonElement.getAttribute('data-baseitem');
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        let summaryDataSource = [
            { value: 'Sum', text: 'Sum' },
            { value: 'Count', text: 'Count' },
            { value: 'DistinctCount', text: 'Distinct Count' },
            { value: 'Product', text: 'Product' },
            { value: 'Avg', text: 'Avg' },
            { value: 'Min', text: 'Min' },
            { value: 'Max', text: 'Max' },
            { value: 'Index', text: 'Index' },
            { value: 'SampleStDev', text: 'Sample StDev' },
            { value: 'PopulationStDev', text: 'Population StDev' },
            { value: 'SampleVar', text: 'Sample Var' },
            { value: 'PopulationVar', text: 'Population Var' },
            { value: 'RunningTotals', text: 'Running Totals' },
            { value: 'DifferenceFrom', text: 'Difference From' },
            { value: 'PercentageOfDifferenceFrom', text: '% of Difference From' },
            { value: 'PercentageOfGrandTotal', text: '% of Grand Total' },
            { value: 'PercentageOfColumnTotal', text: '% of Column Total' },
            { value: 'PercentageOfRowTotal', text: '% of Row Total' },
            { value: 'PercentageOfParentTotal', text: '% of Parent Total' },
            { value: 'PercentageOfParentColumnTotal', text: '% of Parent Column Total' },
            { value: 'PercentageOfParentRowTotal', text: '% of Parent Row Total' },
        ];
        let baseItemTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        let baseFieldTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        let dataFields = extend([], this.parent.dataSource.rows, null, true);
        dataFields = dataFields.concat(this.parent.dataSource.columns);
        let fieldDataSource = [];
        let fieldItemDataSource = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (let field of dataFields) {
            let value = field.name;
            let text = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        baseField = (baseField.toString() !== 'undefined' ? baseField : fieldDataSource[0].value);
        fieldItemDataSource = Object.keys(this.parent.engineModule.fieldList[(baseField.toString() !== 'undefined' ?
            baseField : fieldDataSource[0].value)].formattedMembers);
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        let mainDiv = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        let textWrappper = createElement('div', { className: 'e-field-name-text-wrapper', });
        let filterWrapperDiv1 = createElement('div', { className: 'e-field-option-wrapper' });
        let optionWrapperDiv1 = createElement('div', { className: 'e-type-option-wrapper' });
        let optionWrapperDiv2 = createElement('div', { className: 'e-base-field-option-wrapper' });
        let optionWrapperDiv3 = createElement('div', { className: 'e-base-item-option-wrapper' });
        let texttitle = createElement('div', { className: 'e-field-name-title', innerHTML: this.parent.localeObj.getConstant('sourceName') + '&nbsp;' });
        let textContent = createElement('div', { className: 'e-field-name-content', innerHTML: buttonElement.id.toString() });
        let inputTextDiv1 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('sourceCaption')
        });
        let optionTextDiv1 = createElement('div', {
            className: 'e-base-field-option-text', innerHTML: this.parent.localeObj.getConstant('summarizeValuesBy')
        });
        let optionTextDiv2 = createElement('div', {
            className: 'e-base-item-option-text', innerHTML: this.parent.localeObj.getConstant('baseField')
        });
        let optionTextDiv3 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('baseItem')
        });
        let inputDiv1 = createElement('div', { className: 'e-caption-input-wrapper' });
        let dropOptionDiv1 = createElement('div', { id: this.parentElement.id + '_type_option' });
        let dropOptionDiv2 = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        let dropOptionDiv3 = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        let inputField1 = createElement('input', {
            id: this.parentElement.id + 'type_input_option',
            className: 'e-caption-input-text',
            attrs: { 'type': 'text' }
        });
        textWrappper.appendChild(texttitle);
        textWrappper.appendChild(textContent);
        inputDiv1.appendChild(inputTextDiv1);
        inputDiv1.appendChild(inputField1);
        optionWrapperDiv1.appendChild(optionTextDiv1);
        optionWrapperDiv2.appendChild(optionTextDiv2);
        optionWrapperDiv3.appendChild(optionTextDiv3);
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        optionWrapperDiv3.appendChild(dropOptionDiv3);
        filterWrapperDiv1.appendChild(textWrappper);
        filterWrapperDiv1.appendChild(inputDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv1.appendChild(optionWrapperDiv3);
        mainDiv.appendChild(filterWrapperDiv1);
        let popupInstance = this;
        let optionWrapper1 = new DropDownList({
            dataSource: summaryDataSource,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change(args) {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value) !== -1 ? true : false;
            }
        });
        optionWrapper1.appendTo(dropOptionDiv1);
        let optionWrapper2 = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change(args) {
                fieldItemDataSource = Object.keys(popupInstance.parent.engineModule.fieldList[args.value].formattedMembers);
                optionWrapper3.dataSource = fieldItemDataSource;
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.appendTo(dropOptionDiv2);
        let optionWrapper3 = new DropDownList({
            dataSource: fieldItemDataSource, enableRtl: this.parent.enableRtl,
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: FILTER_OPERATOR_CLASS, width: '100%',
        });
        optionWrapper3.appendTo(dropOptionDiv3);
        let inputObj1 = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            value: fieldCaption, width: '100%'
        });
        inputObj1.appendTo(inputField1);
        return mainDiv;
    }
    /* tslint:enable:all */
    selectOptionInContextMenu(menu) {
        if (menu.item.text !== null) {
            let buttonElement = this.currentMenu.parentElement;
            if (menu.item.id === 'MoreOption') {
                this.createValueSettingsDialog(buttonElement);
            }
            else {
                let field = buttonElement.getAttribute('data-uid');
                let valuefields = this.parent.dataSource.values;
                let contentElement = buttonElement.querySelector('.e-content');
                let captionName = menu.item.text + ' ' + 'of' + ' ' + this.parent.engineModule.fieldList[field].caption;
                contentElement.innerHTML = captionName;
                contentElement.setAttribute('title', captionName);
                buttonElement.setAttribute('data-type', menu.item.id);
                for (let vCnt = 0; vCnt < this.parent.dataSource.values.length; vCnt++) {
                    if (this.parent.dataSource.values[vCnt].name === field) {
                        let dataSourceItem = valuefields[vCnt].properties ?
                            valuefields[vCnt].properties : valuefields[vCnt];
                        dataSourceItem.type = menu.item.id;
                        /* tslint:disable-next-line:no-any */
                    }
                }
                this.updateDataSource();
            }
        }
    }
    updateDataSource(isRefreshed) {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshed);
        }
        else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
                this.parent.pivotGridModule.
                    setProperties({ dataSource: this.parent.dataSource.properties }, true);
                this.parent.pivotGridModule.notify(uiUpdate, this);
                this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            }
            else {
                this.parent.triggerPopulateEvent();
            }
        }
    }
    updateValueSettings() {
        let dialogElement = this.valueDialog.element;
        let captionInstance = getInstance('#' + this.parentElement.id + 'type_input_option', MaskedTextBox);
        let summaryInstance = getInstance('#' + this.parentElement.id + '_type_option', DropDownList);
        let baseFieldInstance = getInstance('#' + this.parentElement.id + '_base_field_option', DropDownList);
        let baseItemInstance = getInstance('#' + this.parentElement.id + '_base_item_option', DropDownList);
        let fieldName = dialogElement.getAttribute('data-field');
        let buttonElement = this.parentElement.querySelector('.' + PIVOT_BUTTON_CLASS + '#' + fieldName);
        let contentElement = buttonElement.querySelector('.e-content');
        let captionName = this.parent.localeObj.getConstant(summaryInstance.value) + ' ' + 'of' + ' ' + captionInstance.value;
        contentElement.innerHTML = captionName;
        contentElement.setAttribute('title', captionName);
        buttonElement.setAttribute('data-type', summaryInstance.value);
        buttonElement.setAttribute('data-caption', captionInstance.value);
        buttonElement.setAttribute('data-basefield', baseFieldInstance.value);
        buttonElement.setAttribute('data-baseitem', baseItemInstance.value);
        let selectedField = this.parent.pivotCommon.eventBase.getFieldByName(fieldName, this.parent.dataSource.values);
        selectedField = selectedField.properties ?
            selectedField.properties : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value;
        selectedField.baseField = baseFieldInstance.value;
        selectedField.baseItem = baseItemInstance.value;
        this.valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.updateDataSource(true);
    }
    removeDialog() {
        if (this.valueDialog && !this.valueDialog.isDestroyed) {
            this.valueDialog.destroy();
        }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    }
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    destroy() {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.menuInfo && !this.menuInfo.isDestroyed) {
            this.menuInfo.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * Module to render Pivot button
 */
/** @hidden */
class PivotButton {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
        this.menuOption = new AggregateMenu(this.parent);
        this.parent.pivotButtonModule = this;
        this.addEventListener();
    }
    /* tslint:disable */
    renderPivotButton(args) {
        let field = extend([], args.field, null, true);
        let axis = args.axis;
        let axisElement;
        let valuePos = -1;
        let showValuesButton = (this.parent.getModuleName() == "pivotfieldlist" &&
            this.parent.pivotGridModule) ?
            this.parent.pivotGridModule.showValuesButton : this.parent.showValuesButton;
        if (((this.parent.dataSource.valueAxis === 'row' && args.axis === 'rows') ||
            (this.parent.dataSource.valueAxis === 'column' && args.axis === 'columns')) && showValuesButton && this.parent.dataSource.values.length > 1) {
            valuePos = field.length;
            field.push({
                name: this.parent.localeObj.getConstant('values'), caption: this.parent.localeObj.getConstant('values'),
                axis: args.axis
            });
        }
        this.parentElement = this.parent.getModuleName() === 'pivotview' ? this.parent.element :
            document.getElementById(this.parent.element.id + '_Wrapper');
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
            if (this.parentElement.querySelector('.' + FIELD_LIST_CLASS + '-' + axis)) {
                let axisPrompt = this.parentElement.querySelector('.' + FIELD_LIST_CLASS + '-' + axis)
                    .querySelector('.' + AXIS_PROMPT_CLASS);
                if (field.length === 0) {
                    removeClass([axisPrompt], ICON_DISABLE);
                }
                else {
                    addClass([axisPrompt], ICON_DISABLE);
                }
                axisElement =
                    this.parentElement.querySelector('.' + FIELD_LIST_CLASS + '-' + axis).querySelector('.' + AXIS_CONTENT_CLASS);
            }
            else {
                return;
            }
        }
        else {
            this.parentElement = this.parent.element;
            axisElement = this.parentElement.querySelector('.e-group-' + axis);
        }
        if (axisElement) {
            if (this.parent.getModuleName() === 'pivotview' && field.length === 0) {
                let axisPrompt = createElement('span', {
                    className: AXIS_PROMPT_CLASS,
                    innerHTML: axis === 'rows' ? this.parent.localeObj.getConstant('rowAxisPrompt') :
                        axis === 'columns' ? this.parent.localeObj.getConstant('columnAxisPrompt') :
                            axis === 'values' ? this.parent.localeObj.getConstant('valueAxisPrompt') :
                                this.parent.localeObj.getConstant('filterAxisPrompt')
                });
                axisElement.appendChild(axisPrompt);
            }
            else {
                for (let i = 0, cnt = field.length; i < cnt; i++) {
                    let buttonWrapper = createElement('div', {
                        className: PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 ? ' e-first-btn' : ''),
                        attrs: { 'data-tag': axis + ':' + field[i].name }
                    });
                    let buttonElement = createElement('div', {
                        id: field[i].name, className: PIVOT_BUTTON_CLASS,
                        attrs: {
                            'data-uid': field[i].name, 'tabindex': '0', 'isvalue': i === valuePos ? 'true' : 'false',
                            'aria-disabled': 'false', 'aria-label': field[i].caption ? field[i].caption : field[i].name,
                            'data-type': field[i].type,
                            'data-caption': field[i].caption ? field[i].caption : field[i].name,
                            'data-basefield': field[i].baseField,
                            'data-baseitem': field[i].baseItem
                        }
                    });
                    let dropIndicatorElement = createElement('span', {
                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                        className: DROP_INDICATOR_CLASS
                    });
                    let dropLastIndicatorElement = createElement('span', {
                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                        className: DROP_INDICATOR_CLASS + '-last'
                    });
                    let dragWrapper = this.createButtonDragIcon(buttonElement);
                    let contentElement = this.createButtonText(field, i, axis, valuePos);
                    buttonElement.appendChild(contentElement);
                    if (['filters', 'values'].indexOf(axis) === -1 && valuePos !== i) {
                        this.createSortOption(buttonElement, field[i].name);
                    }
                    if (axis !== 'values' && valuePos !== i) {
                        this.createFilterOption(buttonElement, field[i].name);
                    }
                    if (axis === 'values') {
                        this.getTypeStatus(field, i, buttonElement);
                    }
                    let removeElement = createElement('span', {
                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                        className: ICON + ' ' + REMOVE_CLASS
                    });
                    if (this.parent.getModuleName() === 'pivotview') {
                        if (this.parent.groupingBarSettings.showRemoveIcon) {
                            removeClass([removeElement], ICON_DISABLE);
                        }
                        else {
                            addClass([removeElement], ICON_DISABLE);
                        }
                    }
                    buttonElement.appendChild(removeElement);
                    buttonWrapper.appendChild(dropIndicatorElement);
                    buttonWrapper.appendChild(buttonElement);
                    buttonWrapper.appendChild(dropLastIndicatorElement);
                    axisElement.appendChild(buttonWrapper);
                    let pivotButton = new Button({ enableRtl: this.parent.enableRtl });
                    pivotButton.appendTo(buttonElement);
                    this.unWireEvent(buttonWrapper, i === valuePos ? 'values' : axis);
                    this.wireEvent(buttonWrapper, i === valuePos ? 'values' : axis);
                    if ((this.parent.getModuleName() === 'pivotview' && !this.parent.isAdaptive) ||
                        this.parent.getModuleName() === 'pivotfieldlist') {
                        this.createDraggable(this.parent.getModuleName() === 'pivotview' ? contentElement : dragWrapper);
                    }
                }
            }
        }
        else {
            return;
        }
    }
    createButtonText(field, i, axis, valuePos) {
        let buttonText;
        let aggregation;
        if (this.parent.engineModule.fieldList[field[i].name] !== undefined) {
            aggregation = this.parent.engineModule.fieldList[field[i].name].aggregateType;
            if (aggregation === undefined && (this.parent.engineModule.fieldList[field[i].name].type === 'string' || this.parent.engineModule.fieldList[field[i].name].type === 'include' ||
                this.parent.engineModule.fieldList[field[i].name].type === 'exclude')) {
                aggregation = 'Count';
            }
            else if (aggregation === undefined) {
                aggregation = this.parent.engineModule.fieldList[field[i].name].aggregateType !== undefined ?
                    this.parent.engineModule.fieldList[field[i].name].aggregateType : 'Sum';
            }
        }
        let text = field[i].caption ? field[i].caption : field[i].name;
        buttonText = createElement('span', {
            attrs: {
                title: ((axis !== 'values' || aggregation === 'CalculatedField') ? text : this.parent.localeObj.getConstant(aggregation) + ' ' + 'of' + ' ' + text),
                'tabindex': '-1', 'aria-disabled': 'false', 'oncontextmenu': 'return false;',
                'data-type': valuePos === i ? '' : aggregation
            },
            className: PIVOT_BUTTON_CONTENT_CLASS,
            innerHTML: axis !== 'values' || aggregation === 'CalculatedField' ? text : this.parent.localeObj.getConstant(aggregation) + ' ' + 'of' + ' ' + text
        });
        return buttonText;
    }
    getTypeStatus(field, i, buttonElement) {
        let fieldListItem = this.parent.engineModule.fieldList[field[i].name];
        if (fieldListItem.aggregateType !== 'CalculatedField' &&
            fieldListItem.type === 'number') {
            this.createSummaryType(buttonElement, field[i].name);
        }
    }
    createSummaryType(pivotButton, fieldName) {
        let spanElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: ICON + ' ' + AXISFIELD_ICON_CLASS
        });
        if (this.parent.getModuleName() === 'pivotview') {
            if (this.parent.groupingBarSettings.showValueTypeIcon) {
                removeClass([spanElement], ICON_DISABLE);
            }
            else {
                addClass([spanElement], ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    createMenuOption(args) {
        this.menuOption.render(args, this.parentElement);
        this.parent.pivotButtonModule = this;
    }
    createDraggable(target) {
        this.draggable = new Draggable(target, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this),
            dragStart: this.onDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onDragStop.bind(this)
        });
    }
    createButtonDragIcon(pivotButton) {
        let dragWrapper = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' }
        });
        let dragElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: ICON + ' ' + DRAG_CLASS
        });
        dragWrapper.appendChild(dragElement);
        pivotButton.appendChild(dragWrapper);
        return dragWrapper;
    }
    createSortOption(pivotButton, fieldName) {
        let sortCLass;
        if (!this.parent.allowDeferLayoutUpdate) {
            sortCLass = this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ? SORT_DESCEND_CLASS : '';
        }
        else {
            sortCLass = '';
            for (let i = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    sortCLass = this.parent.dataSource.sortSettings[i].order === 'Descending' ? SORT_DESCEND_CLASS : '';
                }
            }
        }
        let spanElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: ICON + ' ' + SORT_CLASS + ' ' + sortCLass
        });
        if (this.parent.dataSource.enableSorting) {
            removeClass([spanElement], ICON_DISABLE);
        }
        else {
            addClass([spanElement], ICON_DISABLE);
        }
        if (this.parent.getModuleName() === 'pivotview') {
            if (this.parent.groupingBarSettings.showSortIcon) {
                removeClass([spanElement], ICON_DISABLE);
            }
            else {
                addClass([spanElement], ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    createFilterOption(pivotButton, fieldName) {
        let filterCLass;
        if (!this.parent.allowDeferLayoutUpdate) {
            filterCLass = this.parent.engineModule.fieldList[fieldName].filter.length === 0 ?
                !this.parent.engineModule.fieldList[fieldName].isExcelFilter ? FILTER_CLASS : FILTERED_CLASS : FILTERED_CLASS;
        }
        else {
            filterCLass = FILTER_CLASS;
            for (let i = 0; i < this.parent.dataSource.filterSettings.length; i++) {
                if (this.parent.dataSource.filterSettings[i].name === fieldName) {
                    filterCLass = FILTERED_CLASS;
                }
            }
        }
        let spanElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: FILTER_COMMON_CLASS + ' ' + ICON + ' ' + filterCLass
        });
        if (this.parent.getModuleName() === 'pivotview') {
            if (this.parent.groupingBarSettings.showFilterIcon) {
                removeClass([spanElement], ICON_DISABLE);
            }
            else {
                addClass([spanElement], ICON_DISABLE);
            }
        }
        pivotButton.appendChild(spanElement);
        return spanElement;
    }
    createDragClone(args) {
        let element = closest(args.element, '.' + PIVOT_BUTTON_CLASS);
        let cloneElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: DRAG_CLONE_CLASS
        });
        let contentElement = createElement('span', {
            className: TEXT_CONTENT_CLASS,
            innerHTML: element.textContent
        });
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    }
    onDragStart(e) {
        this.parent.isDragging = true;
        let element = closest(e.element, '.' + PIVOT_BUTTON_CLASS);
        let data = this.parent.engineModule.fieldList[element.getAttribute('data-uid')];
        let axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        addClass([element], SELECTED_NODE_CLASS);
        if (data && data.aggregateType === 'CalculatedField') {
            for (let axisContent of axis) {
                addClass([this.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
            }
        }
    }
    onDragging(e) {
        this.draggable.setProperties({ cursorAt: { top: (!isNullOrUndefined(e.event.targetTouches) || Browser.isDevice) ? 60 : -20, } });
        // if (closest(e.event.srcElement, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS)) {
        //     let droppableElement: HTMLElement = closest(e.event.srcElement, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
        //     let buttonElement: HTMLElement = closest(e.event.srcElement, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
        //     if (droppableElement.offsetHeight < droppableElement.scrollHeight) {
        //         let scrollPosition: number = (droppableElement.scrollHeight - buttonElement.offsetTop);
        //         if (buttonElement.offsetTop >= droppableElement.offsetTop && scrollPosition > droppableElement.scrollTop) {
        //             droppableElement.scrollTop += Math.abs(buttonElement.offsetHeight);
        //         } else if (buttonElement.offsetTop <= droppableElement.offsetTop) {
        //             droppableElement.scrollTop -= Math.abs(buttonElement.offsetHeight);
        //         }
        //     }
        // }
    }
    onDragStop(args) {
        this.parent.isDragging = false;
        let element = closest(args.element, '.' + PIVOT_BUTTON_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS)), SELECTED_NODE_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
        let axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        for (let axisContent of axis) {
            removeClass([this.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
        }
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        if (document.getElementById(this.parent.element.id + '_DragClone')) {
            remove(document.getElementById(this.parent.element.id + '_DragClone'));
        }
        document.body.style.cursor = 'auto';
        if (!this.isButtonDropped(args.target, element)) {
            return;
        }
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            (this.parent.pivotGridModule ? this.parent.pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, element.id)) {
            this.updateDataSource();
            this.parent.axisFieldModule.render();
        }
    }
    isButtonDropped(dropTarget, target) {
        let axisPanel = closest(target, '.' + DROPPABLE_CLASS);
        let droppableElement = closest(dropTarget, '.' + DROPPABLE_CLASS);
        let isDropped = true;
        if (axisPanel === droppableElement) {
            let pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            let droppableTarget = closest(dropTarget, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
            let sourcePosition;
            let droppedPosition = -1;
            for (let i = 0, n = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === target.id) {
                    sourcePosition = i;
                }
                if (droppableTarget) {
                    let droppableButton = droppableTarget.querySelector('.' + PIVOT_BUTTON_CLASS);
                    if (pivotButtons[i].id === droppableButton.id) {
                        droppedPosition = i;
                    }
                }
            }
            if (sourcePosition === droppedPosition || (sourcePosition === (pivotButtons.length - 1) && droppedPosition === -1)) {
                removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
                isDropped = false;
            }
        }
        return isDropped;
    }
    updateSorting(args) {
        if (((this.parent.getModuleName() === 'pivotview' && this.parent.enableValueSorting) ||
            (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.pivotGridModule !== undefined &&
                this.parent.pivotGridModule.enableValueSorting)) &&
            args.target.parentElement.parentElement.getAttribute('data-tag').split(':')[0] === 'rows') {
            this.parent.dataSource.valueSortSettings.headerText = '';
        }
        this.parent.pivotCommon.eventBase.updateSorting(args);
        this.updateDataSource(true);
    }
    updateDataSource(isRefreshGrid) {
        if (!this.parent.allowDeferLayoutUpdate || this.parent.getModuleName() === 'pivotview') {
            this.parent.updateDataSource(isRefreshGrid);
        }
        else {
            if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
                this.parent.pivotGridModule.engineModule = this.parent.engineModule;
                this.parent.pivotGridModule.notify(uiUpdate, this);
                this.parent.
                    pivotGridModule.setProperties({ dataSource: this.parent.dataSource.properties }, true);
            }
            else {
                this.parent.triggerPopulateEvent();
            }
        }
    }
    updateFiltering(args) {
        this.parent.pivotCommon.eventBase.updateFiltering(args);
        let target = args.target;
        let fieldName = target.parentElement.id;
        this.dialogPopUp = this.parent.pivotCommon.filterDialog.dialogPopUp;
        this.memberTreeView = this.parent.pivotCommon.filterDialog.memberTreeView;
        this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        this.parent.pivotCommon.filterDialog.allMemberSelect.nodeChecked = this.nodeStateModified.bind(this);
        this.bindDialogEvents(fieldName);
    }
    bindDialogEvents(fieldName) {
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.updateDialogButtonEvents(this.parent.pivotCommon.filterDialog.tabObj.selectedItem, fieldName);
            this.dialogPopUp.buttons[1].click = this.ClearFilter.bind(this);
            this.parent.pivotCommon.filterDialog.tabObj.selected = (e) => {
                this.updateDialogButtonEvents(e.selectedIndex, fieldName);
                removeClass([].slice.call(this.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
                if (e.selectedIndex > 0) {
                    /* tslint:disable-next-line:max-line-length */
                    addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && this.parent.dataSource.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
                }
                if (e.selectedIndex === 0) {
                    this.parent.pivotCommon.filterDialog.updateCheckedState();
                }
                else {
                    this.dialogPopUp.buttons[0].buttonModel.disabled = false;
                    this.dialogPopUp.element.querySelector('.' + OK_BUTTON_CLASS).removeAttribute('disabled');
                }
            };
        }
        else {
            this.updateDialogButtonEvents(0, fieldName);
        }
    }
    updateDialogButtonEvents(index, fieldName) {
        this.dialogPopUp.buttons[0].click = (index === 0 ?
            this.updateFilterState.bind(this, fieldName) : this.updateCustomFilter.bind(this));
    }
    updateCustomFilter(args) {
        let dialogElement = this.dialogPopUp.element.querySelector('.e-selected-tab');
        let fieldName = dialogElement.getAttribute('data-fieldname');
        let filterType = dialogElement.getAttribute('data-type');
        let measure = dialogElement.getAttribute('data-measure');
        let operator = dialogElement.getAttribute('data-operator');
        let operand1 = dialogElement.getAttribute('data-value1');
        let operand2 = dialogElement.getAttribute('data-value2');
        let type = ((filterType === 'value') ? 'Value' : (filterType === 'date') ? 'Date' :
            (filterType === 'number') ? 'Number' : 'Label');
        let filterItem = {
            name: fieldName,
            type: type,
            measure: measure,
            condition: operator,
            value1: filterType === 'date' ? new Date(operand1) : operand1,
            value2: filterType === 'date' ? new Date(operand2) : operand2
        };
        if ((isNullOrUndefined(operand1) || operand1 === '') ||
            (['Between', 'NotBetween'].indexOf(operator) > -1 && (isNullOrUndefined(operand2) || operand2 === ''))) {
            let inputElementString = (type.toLowerCase() + ((isNullOrUndefined(operand1) || operand1 === '') ? '_input_option_1' : '_input_option_2'));
            let focusElement = dialogElement.querySelector('#' + this.parent.element.id + '_' + inputElementString);
            addClass([focusElement], EMPTY_FIELD);
            focusElement.focus();
            return;
        }
        let filterObject = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            // this.removeDataSourceSettings(fieldName);
            filterObject = filterObject.properties ?
                filterObject.properties : filterObject;
            filterObject.type = type;
            filterObject.measure = measure;
            filterObject.condition = operator;
            filterObject.value1 = filterType === 'date' ? new Date(operand1) : operand1;
            filterObject.value2 = filterType === 'date' ? new Date(operand2) : operand2;
        }
        else {
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        this.dialogPopUp.close();
        this.refreshPivotButtonState(fieldName, true);
        this.updateDataSource(true);
    }
    ClearFilter(e) {
        let dialogElement = this.dialogPopUp.element;
        let fieldName = dialogElement.getAttribute('data-fieldname');
        this.dialogPopUp.close();
        this.removeDataSourceSettings(fieldName);
        this.refreshPivotButtonState(fieldName, false);
        this.updateDataSource(true);
    }
    removeButton(args) {
        let target = args.target;
        let fieldName = target.parentElement.id;
        if (target.parentElement.getAttribute('isvalue') === 'true') {
            this.parent.setProperties({ dataSource: { values: [] } }, true);
        }
        else {
            this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(fieldName);
        }
        if (this.parent.getModuleName() === 'pivotfieldlist') {
            this.parent.axisFieldModule.render();
        }
        this.updateDataSource();
    }
    nodeStateModified(args) {
        let target = args.node.parentElement.parentElement;
        if (target.getAttribute('data-uid') === 'all') {
            this.memberTreeView.nodeChecked = null;
            if (args.action === 'check') {
                this.memberTreeView.checkAll();
            }
            else {
                this.memberTreeView.uncheckAll();
            }
            this.checkedStateAll(args.action);
            this.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        }
        else {
            let pos = this.parent.pivotCommon.currentTreeItemsPos[args.data[0].id];
            if (args.action === 'check') {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = true;
            }
            else {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = false;
            }
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    }
    checkedStateAll(state) {
        if (state === 'check') {
            for (let item of this.parent.pivotCommon.currentTreeItems) {
                for (let searctItem of this.parent.pivotCommon.searchTreeItems) {
                    if (item.id === searctItem.id) {
                        item.checkedStatus = true;
                        searctItem.checkedStatus = true;
                    }
                }
            }
        }
        else {
            for (let item of this.parent.pivotCommon.currentTreeItems) {
                for (let searctItem of this.parent.pivotCommon.searchTreeItems) {
                    if (item.id === searctItem.id) {
                        item.checkedStatus = false;
                        searctItem.checkedStatus = false;
                    }
                }
            }
        }
    }
    updateFilterState(fieldName, args) {
        let isNodeUnChecked = false;
        let filterItem = { items: [], name: fieldName, type: 'Include' };
        for (let item of this.parent.pivotCommon.searchTreeItems) {
            if (item.checkedStatus) {
                if (this.parent.pivotCommon.isDateField) {
                    filterItem.items.push(item.name);
                }
                else {
                    filterItem.items.push(item.id);
                }
            }
        }
        isNodeUnChecked = (filterItem.items.length === this.parent.pivotCommon.currentTreeItems.length ?
            false : true);
        let filterObject = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            for (let i = 0; i < this.parent.dataSource.filterSettings.length; i++) {
                if (this.parent.dataSource.filterSettings[i].name === fieldName) {
                    this.parent.dataSource.filterSettings.splice(i, 1);
                    break;
                }
            }
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        else {
            this.parent.dataSource.filterSettings.push(filterItem);
        }
        this.dialogPopUp.close();
        this.refreshPivotButtonState(fieldName, isNodeUnChecked);
        if (!isNodeUnChecked) {
            this.removeDataSourceSettings(fieldName);
        }
        this.updateDataSource(true);
    }
    refreshPivotButtonState(fieldName, isFiltered) {
        let pivotButtons = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
        let selectedButton;
        for (let item of pivotButtons) {
            if (item.getAttribute('data-uid') === fieldName) {
                selectedButton = item.querySelector('.' + FILTER_COMMON_CLASS);
                break;
            }
        }
        if (isFiltered) {
            removeClass([selectedButton], FILTER_CLASS);
            addClass([selectedButton], FILTERED_CLASS);
        }
        else {
            removeClass([selectedButton], FILTERED_CLASS);
            addClass([selectedButton], FILTER_CLASS);
        }
    }
    removeDataSourceSettings(fieldName) {
        let filterSettings = this.parent.dataSource.filterSettings;
        for (let len = 0, lnt = filterSettings.length; len < lnt; len++) {
            if (filterSettings[len].name === fieldName) {
                filterSettings.splice(len, 1);
                break;
            }
        }
    }
    updateDropIndicator(e) {
        if (this.parent.isDragging) {
            removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            let element = closest(e.target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
            addClass([element.querySelector('.' + DROP_INDICATOR_CLASS)], INDICATOR_HOVER_CLASS);
        }
    }
    wireEvent(element, axis) {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        if (['filters', 'values'].indexOf(axis) === -1) {
            EventHandler.add(element.querySelector('.' + SORT_CLASS), 'click', this.updateSorting, this);
        }
        if (axis !== 'values') {
            EventHandler.add(element.querySelector('.' + FILTER_COMMON_CLASS), 'click', this.updateFiltering, this);
        }
        if (axis === 'values' && element.querySelector('.' + AXISFIELD_ICON_CLASS) !== null) {
            EventHandler.add(element.querySelector('.' + AXISFIELD_ICON_CLASS), 'click', this.createMenuOption, this);
        }
        EventHandler.add(element.querySelector('.' + REMOVE_CLASS), 'click', this.removeButton, this);
    }
    unWireEvent(element, axis) {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        if (['filters', 'values'].indexOf(axis) === -1) {
            EventHandler.remove(element.querySelector('.' + SORT_CLASS), 'click', this.updateSorting);
        }
        if (axis !== 'values') {
            EventHandler.remove(element.querySelector('.' + FILTER_COMMON_CLASS), 'click', this.updateFiltering);
        }
        if (axis === 'values' && element.querySelector('.' + AXISFIELD_ICON_CLASS) !== null) {
            EventHandler.remove(element.querySelector('.' + AXISFIELD_ICON_CLASS), 'click', this.createMenuOption);
        }
        EventHandler.remove(element.querySelector('.' + REMOVE_CLASS), 'click', this.removeButton);
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.handlers = {
            load: this.renderPivotButton
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(pivotButtonUpdate, this.handlers.load, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(pivotButtonUpdate, this.handlers.load);
    }
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    destroy() {
        this.menuOption.destroy();
        this.removeEventListener();
    }
}

/**
 * Module to render Axis Fields
 */
/** @hidden */
class AxisFieldRenderer {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    render() {
        this.pivotButton = new PivotButton(this.parent);
        this.createPivotButtons();
    }
    createPivotButtons() {
        let rows = this.parent.dataSource.rows;
        let columns = this.parent.dataSource.columns;
        let values = this.parent.dataSource.values;
        let filters = this.parent.dataSource.filters;
        let fields = [rows, columns, values, filters];
        let parentElement = this.parent.dialogRenderer.parentElement;
        if (parentElement.querySelector('.' + FIELD_LIST_CLASS + '-filters')) {
            parentElement.querySelector('.' + FIELD_LIST_CLASS + '-filters').querySelector('.' + AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + FIELD_LIST_CLASS + '-rows')) {
            parentElement.querySelector('.' + FIELD_LIST_CLASS + '-rows').querySelector('.' + AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + FIELD_LIST_CLASS + '-columns')) {
            parentElement.querySelector('.' + FIELD_LIST_CLASS + '-columns').querySelector('.' + AXIS_CONTENT_CLASS).innerHTML = '';
        }
        if (parentElement.querySelector('.' + FIELD_LIST_CLASS + '-values')) {
            parentElement.querySelector('.' + FIELD_LIST_CLASS + '-values').querySelector('.' + AXIS_CONTENT_CLASS).innerHTML = '';
        }
        let axis = ['rows', 'columns', 'values', 'filters'];
        for (let len = 0, lnt = fields.length; len < lnt; len++) {
            if (fields[len]) {
                let args = {
                    field: fields[len],
                    axis: axis[len].toString()
                };
                this.parent.notify(pivotButtonUpdate, args);
            }
        }
    }
}

/**
 * Module to render Pivot Table component
 */
/** @hidden */
class Render$1 {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
        this.parent.dialogRenderer = new DialogRenderer(this.parent);
        this.parent.treeViewModule = new TreeViewRenderer(this.parent);
        this.parent.axisTableModule = new AxisTableRenderer(this.parent);
        this.parent.axisFieldModule = new AxisFieldRenderer(this.parent);
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    render() {
        this.parent.dialogRenderer.render();
        if (!this.parent.isAdaptive) {
            this.parent.treeViewModule.render();
        }
        this.parent.axisTableModule.render();
    }
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Represents the PivotFieldList component.
 * ```html
 * <div id="pivotfieldlist"></div>
 * <script>
 *  var pivotfieldlistObj = new PivotFieldList({ });
 *  pivotfieldlistObj.appendTo("#pivotfieldlist");
 * </script>
 * ```
 */
let PivotFieldList = class PivotFieldList extends Component {
    /**
     * Constructor for creating the widget
     * @param  {PivotFieldListModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options, element) {
        super(options, element);
        /** @hidden */
        this.isRequiredUpdate = true;
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    requiredModules() {
        let modules = [];
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        return modules;
    }
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    preRender() {
        this.isAdaptive = Browser.isDevice;
        this.globalize = new Internationalization(this.locale);
        this.renderModule = new Render$1(this);
        this.defaultLocale = {
            staticFieldList: 'Pivot Field List',
            fieldList: 'Field List',
            dropFilterPrompt: 'Drop filter here',
            dropColPrompt: 'Drop column here',
            dropRowPrompt: 'Drop row here',
            dropValPrompt: 'Drop value here',
            addPrompt: 'Add field here',
            adaptiveFieldHeader: 'Choose field',
            centerHeader: 'Drag fields between axes below:',
            add: 'add',
            drag: 'Drag',
            filter: 'Filter',
            filtered: 'Filtered',
            sort: 'Sort',
            remove: 'Remove',
            filters: 'Filters',
            rows: 'Rows',
            columns: 'Columns',
            values: 'Values',
            calculatedField: 'Calculated Field',
            createCalculatedField: 'Create Calculated Field',
            fieldName: 'Enter the field name',
            error: 'Error',
            invalidFormula: 'Invalid formula.',
            dropText: 'Example: ("Sum(Order_Count)" + "Sum(In_Stock)") * 250',
            dropTextMobile: 'Add fields and edit formula here.',
            dropAction: 'Calculated field cannot be place in any other region except value axis.',
            search: 'Search',
            close: 'Close',
            cancel: 'Cancel',
            delete: 'Delete',
            alert: 'Alert',
            warning: 'Warning',
            ok: 'OK',
            sum: 'Sum',
            average: 'Average',
            count: 'Count',
            min: 'Min',
            max: 'Max',
            allFields: 'All Fields',
            formula: 'Formula',
            fieldExist: 'A field already exists in this name. Please enter a different name.',
            confirmText: 'A calculation field already exists in this name. Do you want to replace it?',
            noMatches: 'No matches',
            format: 'Summaries values by',
            edit: 'Edit',
            clear: 'Clear',
            formulaField: 'Drag and drop fields to formula',
            dragField: 'Drag field to formula',
            clearFilter: 'Clear',
            by: 'by',
            enterValue: 'Enter value',
            chooseDate: 'Enter date',
            /* tslint:disable */
            Equals: 'Equals',
            DoesNotEquals: 'Does Not Equal',
            BeginWith: 'Begins With',
            DoesNotBeginWith: 'Does Not Begin With',
            EndsWith: 'Ends With',
            DoesNotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            DoesNotContains: 'Does Not Contain',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqualTo: 'Greater Than Or Equal To',
            LessThan: 'Less Than',
            LessThanOrEqualTo: 'Less Than Or Equal To',
            Between: 'Between',
            NotBetween: 'Not Between',
            Before: 'Before',
            BeforeOrEqualTo: 'Before Or Equal To',
            After: 'After',
            AfterOrEqualTo: 'After Or Equal To',
            member: 'Member',
            label: 'Label',
            date: 'Date',
            value: 'Value',
            labelTextContent: 'Show the items for which the label',
            dateTextContent: 'Show the items for which the date',
            valueTextContent: 'Show the items for which',
            And: 'and',
            Sum: 'Sum',
            Count: 'Count',
            DistinctCount: 'Distinct Count',
            Product: 'Product',
            Avg: 'Avg',
            Min: 'Min',
            Max: 'Max',
            Index: 'Index',
            SampleStDev: 'Sample StDev',
            PopulationStDev: 'Population StDev',
            SampleVar: 'Sample Var',
            PopulationVar: 'Population Var',
            RunningTotals: 'Running Totals',
            DifferenceFrom: 'Difference From',
            PercentageOfDifferenceFrom: '% of Difference From',
            PercentageOfGrandTotal: '% of Grand Total',
            PercentageOfColumnTotal: '% of Column Total',
            PercentageOfRowTotal: '% of Row Total',
            PercentageOfParentTotal: '% of Parent Total',
            PercentageOfParentColumnTotal: '% of Parent Column Total',
            PercentageOfParentRowTotal: '% of Parent Row Total',
            /* tslint:enable */
            apply: 'APPLY',
            valueFieldSettings: 'Value field settings',
            sourceName: 'Field name :',
            sourceCaption: 'Field caption :',
            summarizeValuesBy: 'Summarize values by :',
            baseField: 'Base field :',
            baseItem: 'Base item :',
            example: 'e.g:',
            editorDataLimitMsg: ' more items. Search to refine further.',
            deferLayoutUpdate: 'Defer Layout Update'
        };
        this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale);
        this.isDragging = false;
        this.captionData = [];
        this.wireEvent();
    }
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    render() {
        this.trigger(load, { 'dataSource': this.dataSource });
        addClass([this.element], ROOT);
        if (this.enableRtl) {
            addClass([this.element], RTL);
        }
        else {
            removeClass([this.element], RTL);
        }
        if (this.isAdaptive) {
            addClass([this.element], DEVICE);
        }
        else {
            removeClass([this.element], DEVICE);
        }
        if (this.cssClass) {
            addClass([this.element], this.cssClass);
        }
        this.notify(initialLoad, {});
    }
    /**
     * Binding events to the Pivot Field List element.
     * @hidden
     */
    wireEvent() {
        this.on(initialLoad, this.generateData, this);
        this.on(dataReady, this.fieldListRender, this);
    }
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    unWireEvent() {
        if (this.pivotGridModule && this.pivotGridModule.isDestroyed) {
            return;
        }
        this.off(initialLoad, this.generateData);
        this.off(dataReady, this.fieldListRender);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['dataSource'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'pivotfieldlist';
    }
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    onPropertyChanged(newProp, oldProp) {
        let requireRefresh = false;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'locale':
                    this.refresh();
                    break;
                case 'enableRtl':
                    if (this.enableRtl) {
                        addClass([this.element], RTL);
                    }
                    else {
                        removeClass([this.element], RTL);
                    }
                    requireRefresh = true;
                    break;
            }
            if (requireRefresh) {
                this.fieldListRender();
            }
        }
    }
    generateData() {
        this.pivotFieldList = {};
        if (this.dataSource && this.dataSource.data) {
            this.trigger(enginePopulating, { 'dataSource': this.dataSource });
            let pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
            let isDrillThrough = this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
            let enableValueSorting = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
            this.engineModule = new PivotEngine(this.dataSource, '', undefined, pageSettings, enableValueSorting, isDrillThrough);
            this.pivotFieldList = this.engineModule.fieldList;
            let eventArgs = {
                pivotFieldList: this.pivotFieldList,
                pivotValues: this.engineModule.pivotValues
            };
            this.trigger(enginePopulated, eventArgs);
        }
        this.notify(dataReady, {});
        this.trigger(dataBound);
    }
    fieldListRender() {
        this.element.innerHTML = '';
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Wrapper'));
        }
        this.renderModule.render();
        this.fieldListSpinnerElement = this.renderMode === 'Popup' ?
            this.dialogRenderer.fieldListDialog.element : this.element.querySelector('.e-pivotfieldlist-wrapper');
        createSpinner({ target: this.fieldListSpinnerElement }, this.createElement);
        let args = {
            pivotEngine: this.engineModule,
            dataSource: this.dataSource,
            id: this.element.id,
            element: document.getElementById(this.element.id + '_Wrapper'),
            moduleName: this.getModuleName(),
            enableRtl: this.enableRtl,
            isAdaptive: this.isAdaptive,
            renderMode: this.renderMode,
            localeObj: this.localeObj
        };
        this.pivotCommon = new PivotCommon(args);
        this.pivotCommon.control = this;
        if (this.allowDeferLayoutUpdate) {
            this.clonedDataSource = extend({}, this.dataSource, null, true);
            this.clonedFieldList = extend({}, this.pivotFieldList, null, true);
        }
    }
    getFieldCaption(dataSource) {
        this.getFields(dataSource);
        if (this.captionData.length > 0) {
            let lnt = this.captionData.length;
            while (lnt--) {
                if (this.captionData[lnt]) {
                    for (let item of this.captionData[lnt]) {
                        let obj = item.properties;
                        if (obj) {
                            if (this.engineModule.fieldList[obj.name] && obj.caption) {
                                this.engineModule.fieldList[obj.name].caption = obj.caption;
                            }
                            else {
                                this.engineModule.fieldList[obj.name].caption = obj.name;
                            }
                        }
                    }
                }
            }
        }
        else {
            return;
        }
    }
    getFields(dataSource) {
        let fieldSets = extend({}, dataSource, null, true);
        let obj = fieldSets.properties;
        this.captionData = [obj.rows, obj.columns, obj.values, obj.filters];
    }
    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    updateDataSource(isTreeViewRefresh, isEngineRefresh) {
        if (this.pivotGridModule) {
            showSpinner(this.pivotGridModule.element);
        }
        showSpinner(this.fieldListSpinnerElement);
        if (isNullOrUndefined(isEngineRefresh)) {
            let pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
            let enableValueSorting = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
            let isDrillThrough = this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
            this.engineModule =
                new PivotEngine(this.dataSource, '', this.pivotFieldList, pageSettings, enableValueSorting, isDrillThrough);
            this.getFieldCaption(this.dataSource);
        }
        else {
            this.axisFieldModule.render();
            this.isRequiredUpdate = false;
        }
        let eventArgs = {
            dataSource: this.dataSource,
            pivotFieldList: this.pivotFieldList,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(enginePopulated, eventArgs);
        this.pivotCommon.engineModule = this.engineModule;
        this.pivotCommon.dataSource = this.dataSource;
        this.pivotFieldList = this.engineModule.fieldList;
        if (!isTreeViewRefresh && this.treeViewModule.fieldTable && !this.isAdaptive) {
            this.notify(treeViewUpdate, {});
        }
        if (this.isRequiredUpdate) {
            if (this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSource, null, true);
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true);
            }
            this.updateView(this.pivotGridModule);
        }
        else if (this.renderMode === 'Popup' && this.allowDeferLayoutUpdate) {
            this.pivotGridModule.engineModule = this.engineModule;
            this.pivotGridModule.
                setProperties({ dataSource: this.dataSource.properties }, true);
            this.pivotGridModule.notify(uiUpdate, this);
            hideSpinner(this.fieldListSpinnerElement);
        }
        this.isRequiredUpdate = true;
        if (!this.pivotGridModule) {
            hideSpinner(this.fieldListSpinnerElement);
        }
        else {
            this.pivotGridModule.fieldListSpinnerElement = this.fieldListSpinnerElement;
        }
    }
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     * @hidden
     */
    update(control) {
        if (control) {
            this.setProperties({ dataSource: control.dataSource }, true);
            this.engineModule = control.engineModule;
            this.pivotFieldList = control.engineModule.fieldList;
            if (this.renderMode === 'Popup') {
                this.pivotGridModule = control;
            }
            this.getFieldCaption(control.dataSource);
            this.pivotCommon.engineModule = this.engineModule;
            this.pivotCommon.dataSource = this.dataSource;
            this.pivotCommon.control = control;
            if (this.treeViewModule.fieldTable && !this.isAdaptive) {
                this.notify(treeViewUpdate, {});
            }
            this.axisFieldModule.render();
            if (this.renderMode === 'Fixed' && this.allowDeferLayoutUpdate) {
                this.clonedDataSource = extend({}, this.dataSource, null, true);
                this.clonedFieldList = extend({}, this.pivotFieldList, null, true);
            }
        }
    }
    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     * @hidden
     */
    updateView(control) {
        if (control) {
            control.setProperties({ dataSource: this.dataSource }, true);
            control.engineModule = this.engineModule;
            control.pivotValues = this.engineModule.pivotValues;
            control.dataBind();
        }
    }
    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    triggerPopulateEvent() {
        let eventArgs = {
            dataSource: this.dataSource,
            pivotFieldList: this.pivotFieldList,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(enginePopulated, eventArgs);
    }
    /**
     * Destroys the Field Table component.
     * @method destroy
     * @return {void}
     */
    destroy() {
        this.unWireEvent();
        if (this.treeViewModule) {
            this.treeViewModule.destroy();
        }
        if (this.pivotButtonModule) {
            this.pivotButtonModule.destroy();
        }
        if (this.allowDeferLayoutUpdate && this.dialogRenderer &&
            this.dialogRenderer.deferUpdateCheckBox && !this.dialogRenderer.deferUpdateCheckBox.isDestroyed) {
            this.dialogRenderer.deferUpdateCheckBox.destroy();
        }
        super.destroy();
        this.element.innerHTML = '';
        removeClass([this.element], ROOT);
        removeClass([this.element], RTL);
        removeClass([this.element], DEVICE);
        if (this.renderMode === 'Popup') {
            if (this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
                this.dialogRenderer.fieldListDialog.destroy();
            }
            if (document.getElementById(this.element.id + '_Wrapper')) {
                remove(document.getElementById(this.element.id + '_Wrapper'));
            }
        }
    }
};
__decorate$3([
    Complex({}, DataSource)
], PivotFieldList.prototype, "dataSource", void 0);
__decorate$3([
    Property('Popup')
], PivotFieldList.prototype, "renderMode", void 0);
__decorate$3([
    Property()
], PivotFieldList.prototype, "target", void 0);
__decorate$3([
    Property('')
], PivotFieldList.prototype, "cssClass", void 0);
__decorate$3([
    Property(false)
], PivotFieldList.prototype, "allowCalculatedField", void 0);
__decorate$3([
    Property(false)
], PivotFieldList.prototype, "showValuesButton", void 0);
__decorate$3([
    Property(false)
], PivotFieldList.prototype, "allowDeferLayoutUpdate", void 0);
__decorate$3([
    Property(1000)
], PivotFieldList.prototype, "maxNodeLimitInMemberEditor", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "load", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "enginePopulating", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "enginePopulated", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "onFieldDropped", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "dataBound", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "created", void 0);
__decorate$3([
    Event()
], PivotFieldList.prototype, "destroyed", void 0);
PivotFieldList = __decorate$3([
    NotifyPropertyChanges
], PivotFieldList);

/**
 * Base export
 */
/** @hidden */

/**
 * Models
 */
/** @hidden */

/**
 * PivotGrid component exported items
 */
/** @hidden */

/**
 * Module to render Calculated Field Dialog
 */
const COUNT = 'Count';
const AVG = 'Avg';
const MIN = 'Min';
const MAX = 'Max';
const SUM = 'Sum';
const DISTINCTCOUNT = 'DistinctCount';
const PRODUCT = 'Product';
const STDEV = 'SampleStDev';
const STDEVP = 'PopulationStDev';
const VAR = 'SampleVar';
const VARP = 'PopulationVar';
const CALC = 'CalculatedField';
const AGRTYPE = 'AggregateType';
/** @hidden */
class CalculatedField {
    /** Constructor for calculatedfield module */
    constructor(parent) {
        this.parent = parent;
        this.existingReport = null;
        this.parent.calculatedFieldModule = this;
        this.removeEventListener();
        this.addEventListener();
        this.parentID = this.parent.element.id;
        this.dialog = null;
        this.inputObj = null;
        this.treeObj = null;
        this.droppable = null;
        this.menuObj = null;
        this.newFields = null;
        this.isFieldExist = true;
        this.formulaText = null;
        this.fieldText = null;
        this.isEdit = false;
        this.currentFieldName = null;
        this.confirmPopUp = null;
    }
    /**
     * To get module name.
     * @returns string
     */
    getModuleName() {
        return 'calculatedfield';
    }
    keyActionHandler(e) {
        let node = e.currentTarget.querySelector('.e-hover.e-node-focus');
        if (node) {
            switch (e.action) {
                case 'moveRight':
                    this.displayMenu(node.previousSibling);
                    break;
                case 'enter':
                    let field = node.getAttribute('data-field');
                    let type = node.getAttribute('data-type');
                    let dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
                    if (dropField.value === '') {
                        if (type === CALC) {
                            dropField.value = node.getAttribute('data-uid');
                        }
                        else {
                            dropField.value = '"' + type + '(' + field + ')' + '"';
                        }
                    }
                    else if (dropField.value !== '') {
                        if (type === CALC) {
                            dropField.value = dropField.value + node.getAttribute('data-uid');
                        }
                        else {
                            dropField.value = dropField.value + '"' + type + '(' + field + ')' + '"';
                        }
                    }
                    break;
            }
        }
    }
    /**
     * Trigger while click treeview icon.
     * @param  {MouseEvent} e
     * @returns void
     */
    fieldClickHandler(e) {
        let node = e.event.target.parentElement;
        if (e.event.target.classList.contains(FORMAT) ||
            e.event.target.classList.contains(CALC_EDIT) ||
            e.event.target.classList.contains(CALC_EDITED)) {
            this.displayMenu(node.parentElement);
        }
    }
    /**
     * To display context menu.
     * @param  {HTMLElement} node
     * @returns void
     */
    displayMenu(node) {
        if (document.querySelector('.' + this.parentID + 'calculatedmenu') !== null &&
            node.querySelector('.e-list-icon').classList.contains(ICON) &&
            !node.querySelector('.e-list-icon').classList.contains(CALC_EDITED) &&
            !node.querySelector('.e-list-icon').classList.contains(CALC_EDIT) && node.tagName === 'LI') {
            this.menuObj.close();
            this.curMenu = node.querySelector('.' + LIST_TEXT_CLASS);
            this.openContextMenu();
        }
        else if (node.querySelector('.e-list-icon').classList.contains(CALC_EDIT) && node.tagName === 'LI') {
            addClass([node.querySelector('.e-list-icon')], CALC_EDITED);
            removeClass([node.querySelector('.e-list-icon')], CALC_EDIT);
            node.querySelector('.' + CALC_EDITED).setAttribute('title', this.parent.localeObj.getConstant('clear'));
            this.isEdit = true;
            this.currentFieldName = node.getAttribute('data-field');
            this.inputObj.value = node.getAttribute('data-caption');
            this.dialog.element.querySelector('.' + CALCINPUT).value = node.getAttribute('data-caption');
            document.querySelector('#' + this.parentID + 'droppable').value = node.getAttribute('data-uid');
        }
        else if (node.querySelector('.e-list-icon').classList.contains(CALC_EDITED) && node.tagName === 'LI') {
            addClass([node.querySelector('.e-list-icon')], CALC_EDIT);
            removeClass([node.querySelector('.e-list-icon')], CALC_EDITED);
            node.querySelector('.' + CALC_EDIT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            this.isEdit = false;
            this.inputObj.value = '';
            this.dialog.element.querySelector('.' + CALCINPUT).value = '';
            document.querySelector('#' + this.parentID + 'droppable').value = '';
        }
    }
    /**
     * To set position for context menu.
     * @returns void
     */
    openContextMenu() {
        let pos = this.curMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuObj.open(pos.top + 30, pos.left - 100);
        }
        else {
            this.menuObj.open(pos.top + 30, pos.left + 150);
        }
    }
    /**
     * Triggers while select menu.
     * @param  {MenuEventArgs} menu
     * @returns void
     */
    selectContextMenu(menu) {
        if (menu.element.textContent !== null) {
            let field = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.textContent);
            this.curMenu.textContent = field + ' (' + menu.element.textContent + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '-1');
            this.curMenu.parentElement.parentElement.focus();
        }
    }
    /**
     * To create context menu.
     * @returns void
     */
    createMenu() {
        let menuItems = [
            { text: COUNT, },
            { text: AVG },
            { text: MIN },
            { text: MAX },
            { text: SUM },
            { text: DISTINCTCOUNT, },
            { text: PRODUCT },
            { text: STDEV },
            { text: STDEVP },
            { text: VAR },
            { text: VARP }
        ];
        let menuOptions = {
            cssClass: this.parentID + 'calculatedmenu',
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectContextMenu.bind(this)
        };
        this.parent.element.appendChild(createElement('ul', {
            id: this.parentID + 'contextmenu'
        }));
        this.menuObj = new ContextMenu$1(menuOptions);
        this.menuObj.appendTo('#' + this.parentID + 'contextmenu');
    }
    /**
     * Triggers while click OK button.
     * @returns void
     */
    applyFormula() {
        let currentObj = this;
        let isExist = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], EMPTY_FIELD);
        Object.keys(currentObj.parent.engineModule.fieldList).forEach((key, index) => {
            if (currentObj.inputObj.value && currentObj.inputObj.value === key &&
                currentObj.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                isExist = true;
            }
        });
        if (isExist) {
            currentObj.parent.pivotCommon.errorDialog.createErrorDialog(currentObj.parent.localeObj.getConstant('error'), currentObj.parent.localeObj.getConstant('fieldExist'));
            return;
        }
        this.newFields = extend([], this.parent.dataSource.calculatedFieldSettings, null, true);
        this.existingReport = extend({}, this.parent.dataSource, null, true);
        let report = this.parent.dataSource;
        let dropField = document.querySelector('#' + this.parentID + 'droppable');
        if (this.inputObj.value !== null && this.inputObj.value !== '' && dropField.value !== '') {
            let field = {
                name: this.inputObj.value,
                type: 'CalculatedField'
            };
            let cField = {
                name: this.inputObj.value,
                formula: dropField.value
            };
            this.isFieldExist = true;
            if (!this.isEdit) {
                for (let i = 0; i < report.values.length; i++) {
                    if (report.values[i].type === CALC && report.values[i].name === field.name) {
                        for (let j = 0; j < report.calculatedFieldSettings.length; j++) {
                            if (report.calculatedFieldSettings[j].name === field.name) {
                                this.createConfirmDialog(currentObj.parent.localeObj.getConstant('alert'), currentObj.parent.localeObj.getConstant('confirmText'));
                                return;
                            }
                        }
                        this.isFieldExist = false;
                    }
                }
            }
            else {
                for (let i = 0; i < report.values.length; i++) {
                    if (report.values[i].type === CALC && this.currentFieldName !== null &&
                        report.values[i].name === this.currentFieldName && this.isEdit) {
                        for (let j = 0; j < report.calculatedFieldSettings.length; j++) {
                            if (report.calculatedFieldSettings[j].name === this.currentFieldName) {
                                report.values[i].caption = this.inputObj.value;
                                report.calculatedFieldSettings[j].formula = dropField.value;
                                this.parent.engineModule.fieldList[this.currentFieldName].caption = this.inputObj.value;
                                this.isFieldExist = false;
                            }
                        }
                    }
                }
            }
            if (this.isFieldExist) {
                report.values.push(field);
                report.calculatedFieldSettings.push(cField);
            }
            this.addFormula(report, field.name);
        }
        else {
            if (this.inputObj.value === null || this.inputObj.value === '') {
                addClass([document.getElementById(this.parentID + 'ddlelement')], EMPTY_FIELD);
                document.getElementById(this.parentID + 'ddlelement').focus();
            }
            else {
                this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
            }
        }
    }
    addFormula(report, field) {
        try {
            this.parent.setProperties({ dataSource: report }, true);
            if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.allowDeferLayoutUpdate) {
                this.parent.isRequiredUpdate = false;
            }
            this.parent.updateDataSource(false);
            this.isEdit = false;
            if (this.dialog) {
                this.dialog.close();
            }
            else {
                this.inputObj.value = '';
                this.formulaText = null;
                this.fieldText = null;
                this.parent.
                    dialogRenderer.parentElement.querySelector('.' + CALCINPUT).value = '';
                this.parent.
                    dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable').value = '';
            }
        }
        catch (exception) {
            if (this.parent.engineModule.fieldList[field]) {
                delete this.parent.engineModule.fieldList[field];
            }
            this.parent.pivotCommon.errorDialog.createErrorDialog(this.parent.localeObj.getConstant('error'), this.parent.localeObj.getConstant('invalidFormula'));
            this.parent.setProperties({ dataSource: this.existingReport }, true);
            this.parent.updateDataSource(false);
        }
    }
    /**
     * To get treeview data
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    getFieldListData(parent) {
        let fields = [];
        Object.keys(parent.engineModule.fieldList).forEach((key) => {
            let type = null;
            if (parent.engineModule.fieldList[key].type === 'string' || parent.engineModule.fieldList[key].type === 'include' ||
                parent.engineModule.fieldList[key].type === 'exclude') {
                type = COUNT;
            }
            else {
                type = parent.engineModule.fieldList[key].aggregateType !== undefined ?
                    parent.engineModule.fieldList[key].aggregateType : SUM;
            }
            fields.push({
                index: parent.engineModule.fieldList[key].index,
                name: parent.engineModule.fieldList[key].caption + ' (' + type + ')',
                type: type,
                icon: FORMAT + ' ' + ICON,
                formula: parent.engineModule.fieldList[key].formula,
                field: key,
                caption: parent.engineModule.fieldList[key].caption ? parent.engineModule.fieldList[key].caption : key
            });
        });
        return fields;
    }
    /**
     * Triggers before menu opens.
     * @param  {BeforeOpenCloseMenuEventArgs} args
     * @returns void
     */
    beforeMenuOpen(args) {
        args.element.style.zIndex = (this.dialog.zIndex + 1).toString();
        args.element.style.display = 'inline';
    }
    /**
     * Trigger while drop node in formula field.
     * @param  {DragAndDropEventArgs} args
     * @returns void
     */
    fieldDropped(args) {
        args.cancel = true;
        let field = args.draggedNode.getAttribute('data-field');
        let type = args.draggedNode.getAttribute('data-type');
        let dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
        if (args.target.id === this.parentID + 'droppable' && dropField.value === '') {
            if (type === CALC) {
                dropField.value = args.draggedNodeData.id.toString();
            }
            else {
                dropField.value = '"' + type + '(' + field + ')' + '"';
            }
            dropField.focus();
        }
        else if (args.target.id === (this.parentID + 'droppable') && dropField.value !== '') {
            let textCovered;
            let cursorPos = dropField.selectionStart;
            let currentValue = dropField.value;
            let textBeforeText = currentValue.substring(0, cursorPos);
            let textAfterText = currentValue.substring(cursorPos, currentValue.length);
            if (type === CALC) {
                textCovered = textBeforeText + args.draggedNodeData.id.toString();
                dropField.value = textBeforeText + args.draggedNodeData.id.toString() + textAfterText;
            }
            else {
                textCovered = textBeforeText + '"' + type + '(' + field + ')' + '"';
                dropField.value = textBeforeText + '"' + type + '(' + field + ')' + '"' + textAfterText;
            }
            dropField.focus();
            dropField.setSelectionRange(textCovered.length, textCovered.length);
        }
        else {
            args.cancel = true;
        }
    }
    /**
     * To create dialog.
     * @returns void
     */
    createDialog() {
        if (document.querySelector('#' + this.parentID + 'calculateddialog') !== null) {
            remove(document.querySelector('#' + this.parentID + 'calculateddialog'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'calculateddialog',
            className: CALCDIALOG
        }));
        this.dialog = new Dialog({
            allowDragging: true,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    'click': () => this.applyFormula(),
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'),
                        isPrimary: true
                    }
                },
                {
                    'click': () => {
                        this.dialog.close();
                        this.isEdit = false;
                    },
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            close: (args) => {
                if (this.parent.getModuleName() === 'pivotfieldlist') {
                    this.parent.axisFieldModule.render();
                    if (this.parent.renderMode !== 'Fixed') {
                        addClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
                        this.parent.dialogRenderer.fieldListDialog.show();
                    }
                }
                this.treeObj.destroy();
                this.dialog.destroy();
                this.newFields = null;
                remove(document.getElementById(this.parentID + 'calculateddialog'));
                remove(document.querySelector('.' + this.parentID + 'calculatedmenu'));
            },
            beforeOpen: (args) => {
                this.dialog.element.querySelector('.e-dlg-header').
                    setAttribute('title', this.parent.localeObj.getConstant('createCalculatedField'));
            },
            animationSettings: { effect: 'Zoom' },
            width: '25%',
            isModal: false,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            showCloseIcon: true,
            header: this.parent.localeObj.getConstant('createCalculatedField'),
            target: document.body
        });
        this.dialog.appendTo('#' + this.parentID + 'calculateddialog');
    }
    /**
     * To render dialog elements.
     * @returns void
     */
    renderDialogElements() {
        let outerDiv = createElement('div', { id: this.parentID + 'outerDiv', className: CALCOUTERDIV });
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.
            dialogRenderer.parentElement.querySelector('.' + FORMULA) !== null && this.parent.isAdaptive) {
            let accordDiv = createElement('div', { id: this.parentID + 'accordDiv', className: CALCACCORD });
            outerDiv.appendChild(accordDiv);
            let buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: CALCBUTTONDIV });
            let addBtn = createElement('button', {
                id: this.parentID + 'addBtn', innerHTML: this.parent.localeObj.getConstant('add'),
                className: CALCADDBTN
            });
            let cancelBtn = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: this.parent.localeObj.getConstant('cancel'),
                className: CALCCANCELBTN
            });
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        }
        else {
            let inputDiv = createElement('div', { id: this.parentID + 'outerDiv', className: CALCINPUTDIV });
            let inputObj = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text', 'tabindex': '1' },
                className: CALCINPUT
            });
            inputDiv.appendChild(inputObj);
            outerDiv.appendChild(inputDiv);
            if (!this.parent.isAdaptive) {
                let fieldTitle = createElement('div', {
                    className: PIVOT_ALL_FIELD_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formulaField')
                });
                outerDiv.appendChild(fieldTitle);
            }
            let wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: TREEVIEWOUTER });
            wrapDiv.appendChild(createElement('div', { id: this.parentID + 'tree', className: TREEVIEW }));
            outerDiv.appendChild(wrapDiv);
            if (!this.parent.isAdaptive) {
                let formulaTitle = createElement('div', {
                    className: PIVOT_FORMULA_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formula')
                });
                outerDiv.appendChild(formulaTitle);
            }
            let dropDiv = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: FORMULA,
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        this.parent.localeObj.getConstant('dropText')
                }
            });
            outerDiv.appendChild(dropDiv);
            if (this.parent.isAdaptive) {
                let buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: CALCBUTTONDIV });
                let okBtn = createElement('button', {
                    id: this.parentID + 'okBtn', innerHTML: this.parent.localeObj.getConstant('apply'),
                    className: CALCOKBTN
                });
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
        }
        return outerDiv;
    }
    /**
     * To create calculated field adaptive layout.
     * @returns void
     */
    renderAdaptiveLayout() {
        if (document.querySelector('#' + this.parentID + 'droppable')) {
            this.formulaText = document.querySelector('#' + this.parentID + 'droppable').value;
            this.fieldText = this.inputObj.value;
        }
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    }
    /**
     * To create treeview.
     * @returns void
     */
    createTreeView() {
        this.treeObj = new TreeView({
            fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
            allowDragAndDrop: true,
            enableRtl: this.parent.enableRtl,
            nodeCollapsing: (args) => {
                args.cancel = true;
            },
            nodeDragStart: (args) => {
                if (args.event.target.classList.contains(DRAG_CLASS)) {
                    let dragItem = document.querySelector('.e-drag-item.e-treeview');
                    addClass([dragItem], PIVOTCALC);
                    dragItem.style.zIndex = (this.dialog.zIndex + 1).toString();
                    dragItem.style.display = 'inline';
                }
                else {
                    args.cancel = true;
                }
            },
            nodeClicked: this.fieldClickHandler.bind(this),
            nodeDragStop: this.fieldDropped.bind(this),
            drawNode: this.drawTreeNode.bind(this),
            sortOrder: 'Ascending'
        });
        this.treeObj.appendTo('#' + this.parentID + 'tree');
    }
    /**
     * Trigger before treeview text append.
     * @param  {DrawNodeEventArgs} args
     * @returns void
     */
    drawTreeNode(args) {
        let field = args.nodeData.field;
        args.node.setAttribute('data-field', field);
        args.node.setAttribute('data-caption', args.nodeData.caption);
        args.node.setAttribute('data-type', args.nodeData.type);
        let dragElement = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false', 'title': this.parent.localeObj.getConstant('dragField') },
            className: ICON + ' e-drag'
        });
        prepend([dragElement], args.node.querySelector('.' + TEXT_CONTENT_CLASS));
        append([args.node.querySelector('.' + FORMAT)], args.node.querySelector('.' + TEXT_CONTENT_CLASS));
        if (this.parent.engineModule.fieldList[field].type !== 'number' &&
            this.parent.engineModule.fieldList[field].aggregateType !== CALC) {
            removeClass([args.node.querySelector('.' + FORMAT)], ICON);
        }
        else {
            args.node.querySelector('.' + FORMAT).setAttribute('title', this.parent.localeObj.getConstant('format'));
        }
        if (this.parent.engineModule.fieldList[field].aggregateType === CALC) {
            args.node.querySelector('.' + FORMAT).setAttribute('title', this.parent.localeObj.getConstant('edit'));
            addClass([args.node.querySelector('.' + FORMAT)], CALC_EDIT);
            removeClass([args.node.querySelector('.' + FORMAT)], FORMAT);
        }
    }
    /**
     * To create radio buttons.
     * @param  {string} key
     * @returns HTMLElement
     */
    createTypeContainer(key) {
        let wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: TREEVIEWOUTER });
        let type = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
        for (let i = 0; i < type.length; i++) {
            let input = createElement('input', {
                id: this.parentID + 'radio' + key + type[i],
                attrs: { 'type': 'radio', 'data-ftxt': key },
                className: CALCRADIO
            });
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    }
    /**
     * To get Accordion Data.
     * @param  {PivotView | PivotFieldList} parent
     * @returns AccordionItemModel
     */
    getAccordionData(parent) {
        let data = [];
        Object.keys(parent.engineModule.fieldList).forEach((key, index) => {
            data.push({
                header: '<input id=' + this.parentID + '_' + index + ' class=' + CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption=' + this.parent.engineModule.fieldList[key].caption + ' data-type=' +
                    this.parent.engineModule.fieldList[key].type + '/>',
                content: parent.engineModule.fieldList[key].aggregateType === CALC ||
                    this.parent.engineModule.fieldList[key].type !== 'number' ? '' : this.createTypeContainer(key).outerHTML
            });
        });
        return data;
    }
    /**
     * To render mobile layout.
     * @param  {Tab} tabObj
     * @returns void
     */
    renderMobileLayout(tabObj) {
        tabObj.items[4].content = this.renderDialogElements().outerHTML;
        tabObj.dataBind();
        let cancelBtn = new Button({ cssClass: FLAT, isPrimary: true });
        cancelBtn.appendTo('#' + this.parentID + 'cancelBtn');
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if (this.parent.
            dialogRenderer.parentElement.querySelector('.' + FORMULA) !== null && this.parent.isAdaptive) {
            let okBtn = new Button({ cssClass: FLAT + ' ' + OUTLINE_CLASS, isPrimary: true });
            okBtn.appendTo('#' + this.parentID + 'okBtn');
            this.inputObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName')
            });
            this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
            if (this.formulaText !== null && this.parent.
                dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') !== null) {
                let drop = this.parent.
                    dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable');
                drop.value = this.formulaText;
            }
            if (this.fieldText !== null && this.parent.
                dialogRenderer.parentElement.querySelector('.' + CALCINPUT) !== null) {
                this.parent.
                    dialogRenderer.parentElement.querySelector('.' + CALCINPUT).value = this.fieldText;
                this.inputObj.value = this.fieldText;
            }
            if (okBtn.element) {
                okBtn.element.onclick = this.applyFormula.bind(this);
            }
        }
        else if (this.parent.isAdaptive) {
            let accordion = new Accordion({
                items: this.getAccordionData(this.parent),
                enableRtl: this.parent.enableRtl,
                expanding: (args) => {
                    if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
                        Object.keys(this.parent.engineModule.fieldList).forEach((key) => {
                            let type = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                            let radiobutton;
                            if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                                for (let i = 0; i < type.length; i++) {
                                    radiobutton = new RadioButton({
                                        label: type[i],
                                        name: AGRTYPE + key,
                                        change: (args) => {
                                            let type = args.event.target.parentElement.querySelector('.e-label').
                                                innerText;
                                            let field = args.event.target.closest('.e-acrdn-item').
                                                querySelector('[data-field').getAttribute('data-caption');
                                            args.event.target.
                                                closest('.e-acrdn-item').querySelector('.e-label').
                                                innerText = field + ' (' + type + ')';
                                            args.event.target.closest('.e-acrdn-item').
                                                querySelector('[data-type').setAttribute('data-type', type);
                                        },
                                    });
                                    radiobutton.appendTo('#' + this.parentID + 'radio' + key + type[i]);
                                }
                            }
                        });
                    }
                },
            });
            let addBtn = new Button({ cssClass: FLAT, isPrimary: true });
            addBtn.appendTo('#' + this.parentID + 'addBtn');
            accordion.appendTo('#' + this.parentID + 'accordDiv');
            Object.keys(this.parent.engineModule.fieldList).forEach((key, index) => {
                let type = null;
                if (this.parent.engineModule.fieldList[key].type === 'string' ||
                    this.parent.engineModule.fieldList[key].type === 'include' ||
                    this.parent.engineModule.fieldList[key].type === 'exclude') {
                    type = COUNT;
                }
                else {
                    type = this.parent.engineModule.fieldList[key].aggregateType !== undefined ?
                        this.parent.engineModule.fieldList[key].aggregateType : SUM;
                }
                let checkbox = new CheckBox({
                    label: this.parent.engineModule.fieldList[key].caption + ' (' + type + ')'
                });
                checkbox.appendTo('#' + this.parentID + '_' + index);
                document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-field', key);
                document.querySelector('#' + this.parentID + '_' + index).setAttribute('data-type', type);
            });
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    }
    /**
     * Trigger while click cancel button.
     * @returns void
     */
    cancelBtnClick() {
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    }
    /**
     * Trigger while click add button.
     * @returns void
     */
    addBtnClick() {
        let node = document.querySelectorAll('.e-accordion .e-check');
        let fieldText = '';
        let field = null;
        let type = null;
        for (let i = 0; i < node.length; i++) {
            field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
            type = node[i].parentElement.querySelector('[data-field]').getAttribute('data-type');
            if (type.indexOf(CALC) === -1) {
                fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
            }
            else {
                for (let j = 0; j < this.parent.dataSource.calculatedFieldSettings.length; j++) {
                    if (this.parent.dataSource.calculatedFieldSettings[j].name === field) {
                        fieldText = fieldText + this.parent.dataSource.calculatedFieldSettings[j].formula;
                        break;
                    }
                }
            }
        }
        this.formulaText = this.formulaText !== null ? (this.formulaText + fieldText) : fieldText;
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    }
    /**
     * To create calculated field dialog elements.
     * @returns void
     * @hidden
     */
    createCalculatedFieldDialog() {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout();
        }
        else if (!this.parent.isAdaptive) {
            this.renderDialogLayout();
            this.dialog.element.style.top = parseInt(this.dialog.element.style.top, 10) < 0 ? '0px' : this.dialog.element.style.top;
        }
    }
    /**
     * To create calculated field desktop layout.
     * @returns void
     */
    renderDialogLayout() {
        this.newFields = extend([], this.parent.dataSource.calculatedFieldSettings, null, true);
        this.createDialog();
        this.dialog.content = this.renderDialogElements();
        this.dialog.refresh();
        this.inputObj = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('fieldName')
        });
        this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
        this.createTreeView();
        this.createMenu();
        this.droppable = new Droppable(this.dialog.element.querySelector('#' + this.parentID + 'droppable'));
        this.keyboardEvents = new KeyboardEvents(this.parent.calculatedFieldModule.dialog.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: { moveRight: 'rightarrow', enter: 'enter' },
            eventName: 'keydown'
        });
    }
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createConfirmDialog
     * @return {void}
     * @hidden
     */
    createConfirmDialog(title, description) {
        let errorDialog = createElement('div', {
            id: this.parentID + '_ErrorDialog',
            className: ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        this.confirmPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.replaceFormula.bind(this),
                    buttonModel: {
                        cssClass: OK_BUTTON_CLASS + ' ' + OUTLINE_CLASS,
                        content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    click: this.removeErrorDialog.bind(this),
                    buttonModel: {
                        cssClass: CANCEL_BUTTON_CLASS,
                        content: this.parent.localeObj.getConstant('cancel'), isPrimary: true
                    }
                }
            ],
            header: title,
            content: description,
            isModal: true,
            visible: true,
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this)
        });
        this.confirmPopUp.appendTo(errorDialog);
    }
    replaceFormula() {
        let report = this.parent.dataSource;
        let dropField = document.querySelector('#' + this.parentID + 'droppable');
        for (let i = 0; i < report.values.length; i++) {
            if (report.values[i].type === CALC && report.values[i].name === this.inputObj.value) {
                for (let j = 0; j < report.calculatedFieldSettings.length; j++) {
                    if (report.calculatedFieldSettings[j].name === this.inputObj.value) {
                        report.calculatedFieldSettings[j].formula = dropField.value;
                    }
                }
            }
        }
        this.addFormula(report, this.inputObj.value);
        this.removeErrorDialog();
    }
    removeErrorDialog() {
        if (document.getElementById(this.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parentID + '_ErrorDialog').parentElement);
        }
    }
    /**
     * To add event listener.
     * @returns void
     * @hidden
     */
    addEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initCalculatedField, this.createCalculatedFieldDialog, this);
    }
    /**
     * To remove event listener.
     * @returns void
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initCalculatedField, this.createCalculatedFieldDialog);
    }
    /**
     * To destroy the calculated field dialog
     * @returns void
     * @hidden
     */
    destroy() {
        this.removeEventListener();
    }
}

PivotFieldList.Inject(CalculatedField);
/**
 * Module for Field List rendering
 */
/** @hidden */
class FieldList {
    /** Constructor for Field List module */
    constructor(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'fieldlist';
    }
    initiateModule() {
        this.element = createElement('div', {
            id: this.parent.element.id + '_PivotFieldList',
            styles: 'position:' + (this.parent.enableRtl ? 'static' : 'absolute') + ';height:0;width:' + this.parent.element.style.width
        });
        this.parent.element.parentElement.setAttribute('id', 'ContainerWrapper');
        this.parent.element.parentElement.appendChild(this.element);
        this.parent.element.parentElement.appendChild(this.parent.element);
        this.parent.pivotFieldListModule = new PivotFieldList({
            dataSource: {
                rows: [],
                columns: [],
                values: [],
                filters: []
            },
            allowDeferLayoutUpdate: this.parent.allowDeferLayoutUpdate,
            renderMode: 'Popup',
            allowCalculatedField: this.parent.allowCalculatedField,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            target: this.parent.element.parentElement
        });
        this.parent.pivotFieldListModule.appendTo('#' + this.element.id);
    }
    updateControl() {
        if (this.element) {
            prepend([this.element], this.parent.element);
            if (this.parent.grid && this.parent.showGroupingBar && this.parent.groupingBarModule) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(() => {
                    if (this.parent.grid && this.parent.grid.element) {
                        let actWidth = this.parent.grid.element.offsetWidth < 400 ? 400 : this.parent.grid.element.offsetWidth;
                        setStyleAttribute(this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS), {
                            left: formatUnit(this.parent.enableRtl ?
                                -Math.abs((actWidth) -
                                    this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth) :
                                (actWidth) -
                                    this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth)
                        });
                        if (this.parent.enableRtl) {
                            addClass([this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                        }
                        else {
                            removeClass([this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                        }
                    }
                });
            }
            else {
                if (this.parent.enableRtl) {
                    removeClass([this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                }
                else {
                    addClass([this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                }
            }
            setStyleAttribute(this.element, {
                width: formatUnit(this.parent.element.offsetWidth)
            });
        }
        this.parent.pivotFieldListModule.update(this.parent);
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.handlers = {
            load: this.initiateModule,
            update: this.updateControl
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initSubComponent, this.handlers.load, this);
        this.parent.on(uiUpdate, this.handlers.update, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initSubComponent, this.handlers.load);
        this.parent.off(uiUpdate, this.handlers.update);
    }
    /**
     * To destroy the Field List
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        if (this.parent.pivotFieldListModule) {
            this.parent.pivotFieldListModule.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * Module for PivotCommon rendering
 */
/** @hidden */
class Common {
    /** Constructor for Common module */
    constructor(parent) {
        this.parent = parent;
        this.parent.commonModule = this;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'common';
    }
    initiateCommonModule() {
        if (!this.parent.pivotCommon) {
            let args = {
                pivotEngine: this.parent.engineModule,
                dataSource: this.parent.dataSource.properties ?
                    this.parent.dataSource.properties : this.parent.dataSource,
                id: this.parent.element.id,
                element: this.parent.element,
                moduleName: this.parent.getModuleName(),
                enableRtl: this.parent.enableRtl,
                isAdaptive: Browser.isDevice,
                renderMode: 'Popup',
                localeObj: this.parent.localeObj
            };
            this.parent.pivotCommon = new PivotCommon(args);
        }
        else {
            this.parent.pivotCommon.element = this.parent.element;
            this.parent.pivotCommon.engineModule = this.parent.engineModule;
            this.parent.pivotCommon.parentID = this.parent.element.id;
            this.parent.pivotCommon.dataSource = this.parent.dataSource.properties ?
                this.parent.dataSource.properties : this.parent.dataSource;
            this.parent.pivotCommon.moduleName = this.parent.getModuleName();
            this.parent.pivotCommon.enableRtl = this.parent.enableRtl;
            this.parent.pivotCommon.isAdaptive = Browser.isDevice;
            this.parent.pivotCommon.renderMode = 'Popup';
            this.parent.pivotCommon.localeObj = this.parent.localeObj;
        }
        this.parent.pivotCommon.control = this.parent;
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.handlers = {
            load: this.initiateCommonModule
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(uiUpdate, this.handlers.load, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(uiUpdate, this.handlers.load);
    }
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        if (this.parent.pivotCommon) {
            this.parent.pivotCommon.destroy();
        }
    }
}

/**
 * Module to render Axis Fields
 */
/** @hidden */
class AxisFields {
    /** Constructor for render module */
    constructor(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    render() {
        this.pivotButton = new PivotButton(this.parent);
        this.createPivotButtons();
        let pivotButtons = [].slice.call(this.parent.element.querySelector('.' + GROUP_ROW_CLASS)
            .querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
        let vlen = pivotButtons.length;
        for (let j = 0; j < vlen; j++) {
            let indentWidth = 24;
            let indentDiv = createElement('span', {
                className: 'e-indent-div',
                styles: 'width:' + j * indentWidth + 'px'
            });
            prepend([indentDiv], pivotButtons[j]);
        }
    }
    createPivotButtons() {
        let fields = [this.parent.dataSource.rows, this.parent.dataSource.columns, this.parent.dataSource.values, this.parent.dataSource.filters];
        this.parent.element.querySelector('.' + GROUP_ROW_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_COLUMN_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_VALUE_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_FILTER_CLASS).innerHTML = '';
        let axis = ['rows', 'columns', 'values', 'filters'];
        for (let i = 0, lnt = fields.length; i < lnt; i++) {
            if (fields[i]) {
                let args = {
                    field: fields[i],
                    axis: axis[i].toString()
                };
                this.parent.notify(pivotButtonUpdate, args);
            }
        }
    }
}

PivotView.Inject(Common);
/**
 * Module for GroupingBar rendering
 */
/** @hidden */
class GroupingBar {
    /** Constructor for GroupingBar module */
    constructor(parent) {
        this.parent = parent;
        this.parent.groupingBarModule = this;
        this.addEventListener();
        this.parent.axisFieldModule = new AxisFields(this.parent);
        this.touchObj = new Touch(this.parent.element, {
            tapHold: this.tapHoldHandler.bind(this)
        });
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    getModuleName() {
        return 'grouping';
    }
    renderLayout() {
        this.groupingTable = createElement('div', { className: GROUPING_BAR_CLASS });
        this.leftAxisPanel = createElement('div', { className: LEFT_AXIS_PANEL_CLASS });
        this.rightAxisPanel = createElement('div', { className: RIGHT_AXIS_PANEL_CLASS });
        let rowAxisPanel = createElement('div', { className: AXIS_ROW_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper' });
        let columnAxisPanel = createElement('div', {
            className: AXIS_COLUMN_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper'
        });
        let valueAxisPanel = createElement('div', {
            className: AXIS_VALUE_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper'
        });
        let filterAxisPanel = createElement('div', {
            className: AXIS_FILTER_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper'
        });
        this.rowPanel = createElement('div', { className: GROUP_ROW_CLASS + ' ' + ROW_AXIS_CLASS });
        this.columnPanel = createElement('div', { className: GROUP_COLUMN_CLASS + ' ' + COLUMN_AXIS_CLASS });
        this.valuePanel = createElement('div', { className: GROUP_VALUE_CLASS + ' ' + VALUE_AXIS_CLASS });
        this.filterPanel = createElement('div', { className: GROUP_FILTER_CLASS + ' ' + FILTER_AXIS_CLASS });
        rowAxisPanel.appendChild(this.rowPanel);
        columnAxisPanel.appendChild(this.columnPanel);
        valueAxisPanel.appendChild(this.valuePanel);
        filterAxisPanel.appendChild(this.filterPanel);
        this.rowAxisPanel = rowAxisPanel;
        this.columnAxisPanel = columnAxisPanel;
        this.valueAxisPanel = valueAxisPanel;
        this.filterAxisPanel = filterAxisPanel;
        this.leftAxisPanel.appendChild(valueAxisPanel);
        this.leftAxisPanel.appendChild(rowAxisPanel);
        this.rightAxisPanel.appendChild(filterAxisPanel);
        this.rightAxisPanel.appendChild(columnAxisPanel);
        this.groupingTable.appendChild(this.leftAxisPanel);
        this.groupingTable.appendChild(this.rightAxisPanel);
        let axisPanels = [this.rowPanel, this.columnPanel, this.valuePanel, this.filterPanel];
        for (let element of axisPanels) {
            new Droppable(element, {});
            this.unWireEvent(element);
            this.wireEvent(element);
        }
    }
    appendToElement() {
        if (this.parent.element.querySelector('.' + GROUPING_BAR_CLASS)) {
            remove(this.parent.element.querySelector('.' + GROUPING_BAR_CLASS));
        }
        if (this.parent.isAdaptive) {
            this.leftAxisPanel.style.minWidth = '180px';
            this.valuePanel.style.minWidth = '180px';
        }
        if (this.parent.firstColWidth) {
            this.leftAxisPanel.style.minWidth = 'auto';
            this.valuePanel.style.minWidth = 'auto';
        }
        this.filterPanel.removeAttribute('style');
        this.columnPanel.removeAttribute('style');
        this.rowPanel.removeAttribute('style');
        this.filterPanel.removeAttribute('style');
        let emptyRowCount = Object.keys(this.parent.engineModule.headerContent).length;
        if (emptyRowCount) {
            let emptyHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
            addClass([emptyHeader], 'e-row');
            emptyHeader.removeAttribute('style');
            addClass([emptyHeader.querySelector('.e-headercell')], 'e-group-row');
            emptyHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
            emptyHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv').style.display = 'none';
            emptyHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv').style.display = 'none';
        }
        prepend([this.groupingTable], this.parent.element);
        setStyleAttribute(this.groupingTable, { width: formatUnit(this.parent.grid.width) });
        this.groupingTable.style.minWidth = '400px';
        this.parent.axisFieldModule.render();
        this.setGridRowWidth();
        let colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        let rightAxisPanelWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
        setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
        setStyleAttribute(this.rightAxisPanel, { width: rightAxisPanelWidth });
        let rightPanelHeight = (this.valuePanel.offsetHeight / 2);
        if (rightPanelHeight > this.columnPanel.offsetHeight) {
            setStyleAttribute(this.filterPanel, { height: formatUnit(rightPanelHeight) });
            setStyleAttribute(this.columnPanel, { height: formatUnit(rightPanelHeight + 1) });
        }
        let topLeftHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
        setStyleAttribute(this.rowPanel, {
            height: topLeftHeight + 'px'
        });
        if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
            this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                topLeftHeight + 'px';
        }
        let colRows = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
        let columnRows = colRows.filter((trCell) => {
            return (trCell.childNodes.length > 0);
        });
        let colHeight = topLeftHeight / columnRows.length;
        for (let element of columnRows) {
            setStyleAttribute(element, { 'height': colHeight + 'px' });
            let rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
            for (let rhElement of rowHeader) {
                setStyleAttribute(rhElement, { 'height': colHeight + 'px' });
            }
        }
    }
    /**
     * @hidden
     */
    refreshUI() {
        setStyleAttribute(this.groupingTable, { width: formatUnit(this.parent.grid.width) });
        this.groupingTable.style.minWidth = '400px';
        let colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        let rightAxisWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
        setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
        setStyleAttribute(this.rightAxisPanel, { width: rightAxisWidth });
        if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
            let element = this.parent.pivotFieldListModule.element;
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(() => {
                let actWidth = this.parent.grid.element.offsetWidth < 400 ? 400 : this.parent.grid.element.offsetWidth;
                setStyleAttribute(element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS), {
                    left: formatUnit(this.parent.enableRtl ?
                        -Math.abs((actWidth) -
                            element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth) :
                        (actWidth) -
                            element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth)
                });
            });
        }
        if (!this.parent.grid.element.querySelector('.e-group-row')) {
            let emptyRowHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
            addClass([emptyRowHeader], 'e-row');
            addClass([emptyRowHeader.querySelector('.e-headercell')], 'e-group-row');
            emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
            setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv'), {
                display: 'none'
            });
            setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv'), {
                display: 'none'
            });
            let groupHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
            setStyleAttribute(this.rowPanel, {
                height: groupHeight + 'px'
            });
            if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                    groupHeight + 'px';
            }
            let colRowElements = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
            let columnRows = colRowElements.filter((trCell) => {
                return (trCell.childNodes.length > 0);
            });
            let colHeight = groupHeight / columnRows.length;
            for (let element of columnRows) {
                setStyleAttribute(element, { 'height': colHeight + 'px' });
                let rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
                for (let handlerElement of rowHeader) {
                    setStyleAttribute(handlerElement, { 'height': colHeight + 'px' });
                }
            }
        }
    }
    /**
     * @hidden
     */
    setGridRowWidth() {
        let colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        if (this.rowPanel.querySelector('.' + PIVOT_BUTTON_CLASS)) {
            if (!this.parent.isAdaptive) {
                let pivotButtons = [].slice.call(this.rowPanel.querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
                let lastButton = pivotButtons[pivotButtons.length - 1];
                let lastButtonWidth = (lastButton.querySelector('.' + PIVOT_BUTTON_CLASS).offsetWidth +
                    lastButton.querySelector('.e-indent-div').offsetWidth + 20);
                let resColWidth = (this.parent.isAdaptive ? 180 : 250);
                let buttonWidth = formatUnit(lastButtonWidth < resColWidth ? resColWidth : lastButtonWidth);
                let rowHeaderTable = this.parent.element.querySelector('.e-frozenheader').querySelector('table');
                let rowContentTable = this.parent.element.querySelector('.e-frozencontent').querySelector('table');
                let rowContent = this.parent.element.querySelector('.e-frozencontent').querySelector('colgroup').children[0];
                let colwidth = parseInt(buttonWidth, 10);
                let gridColumn = this.parent.grid.columns;
                if (gridColumn && gridColumn.length > 0) {
                    /* tslint:disable:align */
                    gridColumn[0].width = (gridColumn[0].width >= resColWidth ?
                        (colwidth > resColWidth ? colwidth : resColWidth) : (colwidth > resColWidth ? colwidth : resColWidth));
                }
                let valueColWidth = this.parent.renderModule.calculateColWidth(this.parent.dataSource.values.length > 0 ?
                    this.parent.engineModule.pivotValues[0].length : 2);
                for (let cCnt = 0; cCnt < gridColumn.length; cCnt++) {
                    if (cCnt !== 0) {
                        if (gridColumn[cCnt].columns) {
                            this.setColWidth(gridColumn[cCnt].columns, valueColWidth);
                        }
                        else {
                            gridColumn[cCnt].width = valueColWidth;
                        }
                    }
                }
                this.parent.posCount = 0;
                this.parent.setGridColumns(this.parent.grid.columns);
                this.parent.grid.headerModule.refreshUI();
                if (!this.parent.firstColWidth) {
                    colGroupElement.style.width = buttonWidth;
                    rowContent.style.width = buttonWidth;
                    rowHeaderTable.style.width = buttonWidth;
                    rowContentTable.style.width = buttonWidth;
                    setStyleAttribute(rowHeaderTable, { 'width': buttonWidth });
                    setStyleAttribute(rowContentTable, { 'width': buttonWidth });
                }
            }
            else {
                if (!this.parent.firstColWidth) {
                    let resColWidth = 180;
                    let gridColumn = this.parent.grid.columns;
                    if (gridColumn && gridColumn.length > 0) {
                        gridColumn[0].width = resColWidth;
                    }
                    this.parent.posCount = 0;
                    this.parent.grid.headerModule.refreshUI();
                }
            }
        }
        this.refreshUI();
    }
    setColWidth(columns, width) {
        for (let cCnt = 0; cCnt < columns.length; cCnt++) {
            if (columns[cCnt].columns) {
                this.setColWidth(columns[cCnt].columns, width);
            }
            else {
                columns[cCnt].width = width;
            }
        }
    }
    wireEvent(element) {
        EventHandler.add(element, 'mouseover', this.dropIndicatorUpdate, this);
        EventHandler.add(element, 'mouseleave', this.dropIndicatorUpdate, this);
    }
    unWireEvent(element) {
        EventHandler.remove(element, 'mouseover', this.dropIndicatorUpdate);
        EventHandler.remove(element, 'mouseleave', this.dropIndicatorUpdate);
    }
    dropIndicatorUpdate(e) {
        if ((this.parent.isDragging && e.target.classList.contains(DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
    }
    tapHoldHandler(e) {
        let target = closest(e.originalEvent.target, '.' + PIVOT_BUTTON_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            let pos = target.getBoundingClientRect();
            this.parent.contextMenuModule.fieldElement = target;
            this.parent.contextMenuModule.menuObj.open(pos.top, pos.left);
            return;
        }
    }
    /**
     * @hidden
     */
    addEventListener() {
        this.handlers = {
            load: this.renderLayout,
            end: this.appendToElement,
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initSubComponent, this.handlers.load, this); //For initial rendering
        this.parent.on(uiUpdate, this.handlers.end, this);
    }
    /**
     * @hidden
     */
    removeEventListener() {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initSubComponent, this.handlers.end);
        this.parent.off(uiUpdate, this.handlers.load);
    }
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    destroy() {
        this.removeEventListener();
        if (this.parent.pivotButtonModule) {
            this.parent.pivotButtonModule.destroy();
            if (this.touchObj && !this.touchObj.isDestroyed) {
                this.touchObj.destroy();
            }
        }
        else {
            return;
        }
    }
}

/**
 * Module to render Conditional Formatting Dialog
 */
/** @hidden */
class ConditionalFormatting {
    /** Constructor for conditionalformatting module */
    constructor(parent) {
        this.parent = parent;
        this.parent.conditionalFormattingModule = this;
        this.parentID = this.parent.element.id;
        this.dialog = null;
        this.fieldsDropDown = [];
        this.conditionsDropDown = [];
        this.fontNameDropDown = [];
        this.fontSizeDropDown = [];
        this.fontColor = [];
        this.backgroundColor = [];
        this.newFormat = [];
    }
    /**
     * To get module name.
     * @returns string
     */
    getModuleName() {
        return 'conditionalformatting';
    }
    createDialog() {
        if (document.querySelector('#' + this.parentID + 'conditionalformatting') !== null) {
            remove(document.querySelector('#' + this.parentID + 'conditionalformatting'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'conditionalformatting',
        }));
        let buttonModel = [
            {
                'click': () => {
                    let format = {
                        conditions: 'LessThan',
                        value1: 0,
                        style: {
                            backgroundColor: 'white',
                            color: 'black',
                            fontFamily: 'Arial',
                            fontSize: '12px'
                        }
                    };
                    this.refreshConditionValues();
                    this.newFormat.push(format);
                    this.addFormat();
                },
                buttonModel: {
                    cssClass: this.parent.isAdaptive ? (FORMAT_ROUND_BUTTON + ' ' + FORMAT_CONDITION_BUTTON) :
                        FORMAT_CONDITION_BUTTON,
                    iconCss: ICON + ' ' + ADD_ICON_CLASS,
                    content: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('condition'),
                }
            },
            {
                'click': () => {
                    this.refreshConditionValues();
                    this.parent.setProperties({ dataSource: { conditionalFormatSettings: this.newFormat } }, true);
                    this.parent.renderPivotGrid();
                    this.destroy();
                },
                buttonModel: {
                    cssClass: FLAT_CLASS + ' ' + FORMAT_APPLY_BUTTON,
                    content: this.parent.localeObj.getConstant('apply')
                }
            },
            {
                'click': () => {
                    this.destroy();
                    this.newFormat = [];
                },
                buttonModel: {
                    cssClass: FLAT_CLASS + ' ' + FORMAT_CANCEL_BUTTON,
                    content: this.parent.localeObj.getConstant('cancel')
                }
            }
        ];
        if (this.parent.isAdaptive) {
            this.dialog = new Dialog({
                animationSettings: { effect: 'Zoom' }, isModal: true, width: '100%', height: '100%',
                showCloseIcon: false, closeOnEscape: false, enableRtl: this.parent.enableRtl,
                position: { X: 'center', Y: 'center' }, allowDragging: true, buttons: buttonModel,
                beforeOpen: (args) => {
                    this.dialog.element.querySelector('.' + DIALOG_HEADER).
                        setAttribute('title', this.parent.localeObj.getConstant('conditionalFormating'));
                },
                cssClass: FORMAT_DIALOG, header: this.parent.localeObj.getConstant('conditionalFormating'), target: document.body
            });
        }
        else {
            this.dialog = new Dialog({
                allowDragging: true, position: { X: 'center', Y: this.parent.element.offsetTop }, buttons: buttonModel,
                beforeOpen: (args) => {
                    this.dialog.element.querySelector('.' + DIALOG_HEADER).
                        setAttribute('title', this.parent.localeObj.getConstant('conditionalFormating'));
                },
                cssClass: FORMAT_DIALOG, isModal: false, closeOnEscape: true, enableRtl: this.parent.enableRtl,
                showCloseIcon: true, header: this.parent.localeObj.getConstant('conditionalFormating'), target: this.parent.element
            });
        }
        this.dialog.appendTo('#' + this.parentID + 'conditionalformatting');
    }
    refreshConditionValues() {
        for (let i = 0; i < this.newFormat.length; i++) {
            this.newFormat[i].value1 =
                Number(document.querySelector('#' + this.parentID + 'conditionvalue1' + i).value);
            this.newFormat[i].value2 =
                Number(document.querySelector('#' + this.parentID + 'conditionvalue2' + i).value);
        }
    }
    addFormat() {
        let format = createElement('div', { id: this.parentID + 'formatDiv', className: FORMAT_NEW });
        for (let i = 0; i < this.newFormat.length; i++) {
            format.appendChild(this.createDialogElements(i));
        }
        this.dialog.setProperties({ 'content': format }, false);
        for (let i = 0; i < this.newFormat.length; i++) {
            this.renderDropDowns(i);
            this.renderColorPicker(i);
        }
    }
    createDialogElements(i) {
        let format = this.newFormat[i];
        let outerDiv = createElement('div', {
            id: this.parentID + 'outerDiv' + i, className: FORMAT_OUTER
        });
        let button = createElement('button', {
            id: this.parentID + 'removeButton' + i, className: FORMAT_DELETE_BUTTON,
            attrs: { 'title': this.parent.localeObj.getConstant('delete') }
        });
        outerDiv.appendChild(button);
        let innerDiv = createElement('div', { id: this.parentID + 'innerDiv', className: FORMAT_INNER });
        let table = createElement('table', { id: this.parentID + 'cftable', className: FORMAT_TABLE });
        let tRow = createElement('tr');
        let td = createElement('td');
        let valuelabel = createElement('span', {
            id: this.parentID + 'valuelabel' + i, className: FORMAT_VALUE_LABEL,
            innerHTML: this.parent.localeObj.getConstant('value')
        });
        td.appendChild(valuelabel);
        tRow.appendChild(td);
        table.appendChild(tRow);
        tRow = createElement('tr');
        td = createElement('td');
        let measureDropdown = createElement('div', { id: this.parentID + 'measure' + i });
        let measureInput = createElement('input', {
            id: this.parentID + 'measureinput' + i,
            attrs: { 'type': 'text', 'tabindex': '1' }
        });
        measureDropdown.appendChild(measureInput);
        td.appendChild(measureDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        let conditionDropdown = createElement('div', { id: this.parentID + 'condition' });
        let conditionInput = createElement('input', {
            id: this.parentID + 'conditioninput' + i,
            attrs: { 'type': 'text', 'tabindex': '1' }
        });
        conditionDropdown.appendChild(conditionInput);
        td.appendChild(conditionDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        let style = !(format.conditions === 'Between' || format.conditions === 'NotBetween') ? 'display:none; width:10px' : '';
        let value1 = createElement('input', {
            id: this.parentID + 'conditionvalue1' + i,
            attrs: { 'type': 'text', 'tabindex': '1', 'value': !isNullOrUndefined(format.value1) ? format.value1.toString() : '0' },
            styles: this.parent.isAdaptive ? style === '' ? 'width: 35%' : 'width: 100%' : style === '' ? 'width: 45px' : 'width: 120px',
            className: INPUT + ' ' + FORMAT_VALUE1
        });
        td.appendChild(value1);
        let valuespan = createElement('span', {
            id: this.parentID + 'valuespan' + i, className: FORMAT_VALUE_SPAN,
            innerHTML: '&', styles: style
        });
        td.appendChild(valuespan);
        let value2 = createElement('input', {
            id: this.parentID + 'conditionvalue2' + i,
            attrs: { 'type': 'text', 'tabindex': '1', 'value': !isNullOrUndefined(format.value2) ? format.value2.toString() : '0' },
            styles: (this.parent.isAdaptive && style === '') ? 'width: 35%' : style === '' ? 'width: 45px' : style,
            className: INPUT + ' ' + FORMAT_VALUE2
        });
        td.appendChild(value2);
        tRow.appendChild(td);
        table.appendChild(tRow);
        if (this.parent.isAdaptive) {
            innerDiv.appendChild(table);
            table = createElement('table', { id: this.parentID + 'cftable', className: FORMAT_TABLE });
        }
        tRow = createElement('tr');
        td = createElement('td');
        let formatlabel = createElement('span', {
            id: this.parentID + 'formatlabel' + i, className: FORMAT_LABEL, innerHTML: this.parent.localeObj.getConstant('formatLabel')
        });
        td.appendChild(formatlabel);
        tRow.appendChild(td);
        table.appendChild(tRow);
        tRow = createElement('tr');
        td = createElement('td');
        let fontNameDropdown = createElement('div', { id: this.parentID + 'fontname' });
        let fontNameInput = createElement('input', {
            id: this.parentID + 'fontnameinput' + i, attrs: { 'type': 'text', 'tabindex': '1' }
        });
        fontNameDropdown.appendChild(fontNameInput);
        td.appendChild(fontNameDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        let fontSizeDropdown = createElement('div', { id: this.parentID + 'fontsize' });
        let fontSizeInput = createElement('input', {
            id: this.parentID + 'fontsizeinput' + i, attrs: { 'type': 'text', 'tabindex': '1' }
        });
        fontSizeDropdown.appendChild(fontSizeInput);
        td.appendChild(fontSizeDropdown);
        tRow.appendChild(td);
        if (this.parent.isAdaptive) {
            table.appendChild(tRow);
            tRow = createElement('tr');
            table.appendChild(tRow);
            tRow = createElement('tr');
        }
        td = createElement('td');
        let colorPicker1 = createElement('input', {
            id: this.parentID + 'fontcolor' + i, attrs: { 'type': 'color', 'tabindex': '1' }, className: FORMAT_FONT_COLOR
        });
        td.appendChild(colorPicker1);
        let colorPicker2 = createElement('input', {
            id: this.parentID + 'backgroundcolor' + i, attrs: { 'type': 'color', 'tabindex': '1' }, className: FORMAT_BACK_COLOR
        });
        td.appendChild(colorPicker2);
        tRow.appendChild(td);
        td = createElement('td');
        let valuePreview = createElement('div', {
            id: this.parentID + 'valuepreview' + i, className: INPUT + ' ' + FORMAT_VALUE_PREVIEW,
            innerHTML: '123.45',
        });
        td.appendChild(valuePreview);
        tRow.appendChild(td);
        table.appendChild(tRow);
        innerDiv.appendChild(table);
        outerDiv.appendChild(innerDiv);
        return outerDiv;
    }
    renderDropDowns(i) {
        let format = this.newFormat[i];
        let fields = [];
        fields.push({
            index: 0, name: this.parent.localeObj.getConstant('AllValues'),
            field: this.parent.localeObj.getConstant('AllValues')
        });
        for (let i = 0; i < this.parent.dataSource.values.length; i++) {
            fields.push({
                index: i + 1,
                name: this.parent.dataSource.values[i].caption || this.parent.dataSource.values[i].name,
                field: this.parent.dataSource.values[i].name
            });
        }
        let value = isNullOrUndefined(format.measure) ? this.parent.localeObj.getConstant('AllValues') : format.measure;
        this.fieldsDropDown[i] = new DropDownList({
            dataSource: fields, fields: { text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            popupHeight: '200px', popupWidth: 'auto',
            change: (args) => {
                this.newFormat[i].measure = args.value.toString() === this.parent.localeObj.getConstant('AllValues') ?
                    undefined : args.value.toString();
            }
        });
        this.fieldsDropDown[i].appendTo('#' + this.parentID + 'measureinput' + i);
        let conditions = [
            { value: 'LessThan', name: this.parent.localeObj.getConstant('LessThan') },
            { value: 'LessThanOrEqualTo', name: this.parent.localeObj.getConstant('LessThanOrEqualTo') },
            { value: 'GreaterThan', name: this.parent.localeObj.getConstant('GreaterThan') },
            { value: 'GreaterThanOrEqualTo', name: this.parent.localeObj.getConstant('GreaterThanOrEqualTo') },
            { value: 'Equals', name: this.parent.localeObj.getConstant('Equals') },
            { value: 'NotEquals', name: this.parent.localeObj.getConstant('NotEquals') },
            { value: 'Between', name: this.parent.localeObj.getConstant('Between') },
            { value: 'NotBetween', name: this.parent.localeObj.getConstant('NotBetween') }
        ];
        value = isNullOrUndefined(format.conditions) ? 'LessThan' : format.conditions;
        this.conditionsDropDown[i] = new DropDownList({
            dataSource: conditions, fields: { value: 'value', text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            popupHeight: '200px', popupWidth: 'auto',
            change: (args) => {
                this.newFormat[i].conditions = args.value;
                if (args.value === 'Between' || args.value === 'NotBetween') {
                    document.querySelector('#' + this.parentID + 'valuespan' + i).style.display = 'inline-block';
                    document.querySelector('#' + this.parentID + 'valuespan' + i).style.width =
                        this.parent.isAdaptive ? '10%' : '10px';
                    document.querySelector('#' + this.parentID + 'conditionvalue2' + i).style.display = 'inline-block';
                    document.querySelector('#' + this.parentID + 'conditionvalue2' + i).style.width =
                        this.parent.isAdaptive ? '35%' : '45px';
                    document.querySelector('#' + this.parentID + 'conditionvalue1' + i).style.width =
                        this.parent.isAdaptive ? '35%' : '45px';
                }
                else {
                    document.querySelector('#' + this.parentID + 'valuespan' + i).style.display = 'none';
                    document.querySelector('#' + this.parentID + 'conditionvalue2' + i).style.display = 'none';
                    document.querySelector('#' + this.parentID + 'conditionvalue1' + i).style.width =
                        this.parent.isAdaptive ? '100%' : '120px';
                }
            }
        });
        this.conditionsDropDown[i].appendTo('#' + this.parentID + 'conditioninput' + i);
        let fontNames = [
            { index: 0, name: 'Arial' }, { index: 1, name: 'San Serif' }, { index: 2, name: 'Impact' },
            { index: 3, name: 'Trebuchet MS' }, { index: 4, name: 'Serif' }, { index: 5, name: 'Verdana' },
            { index: 6, name: 'Courier New' }, { index: 7, name: 'Times New Roman' }, { index: 8, name: 'Tahoma' },
            { index: 9, name: 'Gerogia' }
        ];
        value = isNullOrUndefined(format.style.fontFamily) ? 'Arial' : format.style.fontFamily;
        this.fontNameDropDown[i] = new DropDownList({
            dataSource: fontNames, fields: { text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            popupWidth: '150px', popupHeight: '200px',
            change: (args) => {
                this.newFormat[i].style.fontFamily = args.value.toString();
                document.querySelector('#' + this.parentID + 'valuepreview' + i).style.fontFamily = args.value;
            }
        });
        this.fontNameDropDown[i].appendTo('#' + this.parentID + 'fontnameinput' + i);
        let fontSize = [
            { index: 0, name: '9px' }, { index: 1, name: '10px' }, { index: 2, name: '11px' }, { index: 3, name: '12px' },
            { index: 4, name: '13px' }, { index: 5, name: '14px' }, { index: 6, name: '15px' }, { index: 6, name: '16px' }
        ];
        value = isNullOrUndefined(format.style.fontSize) ? '12px' : format.style.fontSize;
        this.fontSizeDropDown[i] = new DropDownList({
            dataSource: fontSize, fields: { text: 'name' }, popupHeight: '200px',
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            change: (args) => {
                this.newFormat[i].style.fontSize = args.value.toString();
                document.querySelector('#' + this.parentID + 'valuepreview' + i).style.fontSize = args.value;
            }
        });
        this.fontSizeDropDown[i].appendTo('#' + this.parentID + 'fontsizeinput' + i);
    }
    renderColorPicker(i) {
        let format = this.newFormat[i];
        let value = isNullOrUndefined(format.style.color) ? 'black' : format.style.color;
        let color = this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        document.querySelector('#' + this.parentID + 'valuepreview' + i).style.color = color;
        this.fontColor[i] = new ColorPicker({
            cssClass: FORMAT_COLOR_PICKER, value: color, mode: 'Palette',
            change: (args) => {
                this.newFormat[i].style.color = args.currentValue.hex;
                document.querySelector('#' + this.parentID + 'valuepreview' + i).style.color =
                    args.currentValue.hex;
            }
        });
        this.fontColor[i].appendTo('#' + this.parentID + 'fontcolor' + i);
        addClass([this.fontColor[i].element.nextElementSibling.querySelector('.' + SELECTED_COLOR)], ICON);
        value = isNullOrUndefined(format.style.backgroundColor) ? 'white' : format.style.backgroundColor;
        color = this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        document.querySelector('#' + this.parentID + 'valuepreview' + i).style.backgroundColor = color;
        document.querySelector('#' + this.parentID + 'valuepreview' + i).style.fontFamily = format.style.fontFamily;
        document.querySelector('#' + this.parentID + 'valuepreview' + i).style.fontSize = format.style.fontSize;
        this.backgroundColor[i] = new ColorPicker({
            cssClass: FORMAT_COLOR_PICKER, value: color, mode: 'Palette',
            change: (args) => {
                this.newFormat[i].style.backgroundColor = args.currentValue.hex;
                document.querySelector('#' + this.parentID + 'valuepreview' + i).style.backgroundColor =
                    args.currentValue.hex;
            }
        });
        this.backgroundColor[i].appendTo('#' + this.parentID + 'backgroundcolor' + i);
        addClass([this.backgroundColor[i].element.nextElementSibling.querySelector('.e-selected-color')], ICON);
        let toggleBtn = new Button({
            iconCss: ICON + ' ' + FORMAT_DELETE_ICON,
            cssClass: FLAT
        });
        toggleBtn.appendTo('#' + this.parentID + 'removeButton' + i);
        toggleBtn.element.onclick = () => {
            this.newFormat.splice(i, 1);
            this.addFormat();
        };
    }
    isHex(h) {
        let a = parseInt(h, 16);
        while (h.charAt(0) === '0') {
            h = h.substr(1);
        }
        return (a.toString(16) === h.toLowerCase() || (a === 0 && h === ''));
    }
    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    colourNameToHex(colour) {
        let colours = {
            'aliceblue': '#f0f8ff', 'antiquewhite': '#faebd7', 'aqua': '#00ffff', 'aquamarine': '#7fffd4',
            'azure': '#f0ffff', 'beige': '#f5f5dc', 'bisque': '#ffe4c4', 'black': '#000000',
            'blanchedalmond': '#ffebcd', 'blue': '#0000ff',
            'blueviolet': '#8a2be2', 'brown': '#a52a2a', 'burlywood': '#deb887', 'cadetblue': '#5f9ea0',
            'chartreuse': '#7fff00', 'chocolate': '#d2691e',
            'coral': '#ff7f50', 'cornflowerblue': '#6495ed', 'cornsilk': '#fff8dc', 'crimson': '#dc143c', 'cyan': '#00ffff',
            'darkblue': '#00008b', 'darkcyan': '#008b8b', 'darkgoldenrod': '#b8860b', 'darkgray': '#a9a9a9', 'darkgreen': '#006400',
            'darkkhaki': '#bdb76b', 'darkmagenta': '#8b008b', 'darkolivegreen': '#556b2f',
            'darkorange': '#ff8c00', 'darkorchid': '#9932cc', 'darkred': '#8b0000', 'darksalmon': '#e9967a', 'darkseagreen': '#8fbc8f',
            'darkslateblue': '#483d8b', 'darkslategray': '#2f4f4f', 'darkturquoise': '#00ced1',
            'darkviolet': '#9400d3', 'deeppink': '#ff1493', 'deepskyblue': '#00bfff', 'dimgray': '#696969', 'dodgerblue': '#1e90ff',
            'firebrick': '#b22222', 'floralwhite': '#fffaf0', 'forestgreen': '#228b22', 'fuchsia': '#ff00ff',
            'gainsboro': '#dcdcdc', 'ghostwhite': '#f8f8ff', 'gold': '#ffd700', 'goldenrod': '#daa520',
            'gray': '#808080', 'green': '#008000',
            'greenyellow': '#adff2f', 'honeydew': '#f0fff0', 'hotpink': '#ff69b4', 'indianred ': '#cd5c5c',
            'indigo': '#4b0082', 'ivory': '#fffff0',
            'khaki': '#f0e68c', 'lavender': '#e6e6fa', 'lavenderblush': '#fff0f5', 'lawngreen': '#7cfc00', 'lemonchiffon': '#fffacd',
            'lightblue': '#add8e6', 'lightcoral': '#f08080', 'lightcyan': '#e0ffff', 'lightgoldenrodyellow': '#fafad2',
            'lightgrey': '#d3d3d3', 'lightgreen': '#90ee90', 'lightpink': '#ffb6c1', 'lightsalmon': '#ffa07a', 'lightseagreen': '#20b2aa',
            'lightskyblue': '#87cefa', 'lightslategray': '#778899', 'lightsteelblue': '#b0c4de',
            'lightyellow': '#ffffe0', 'lime': '#00ff00', 'limegreen': '#32cd32', 'linen': '#faf0e6',
            'magenta': '#ff00ff', 'maroon': '#800000', 'mediumaquamarine': '#66cdaa', 'mediumblue': '#0000cd', 'mediumorchid': '#ba55d3',
            'mediumpurple': '#9370d8', 'mediumseagreen': '#3cb371', 'mediumslateblue': '#7b68ee',
            'mediumspringgreen': '#00fa9a', 'mediumturquoise': '#48d1cc', 'mediumvioletred': '#c71585', 'midnightblue': '#191970',
            'mintcream': '#f5fffa', 'mistyrose': '#ffe4e1', 'moccasin': '#ffe4b5', 'navajowhite': '#ffdead', 'navy': '#000080',
            'oldlace': '#fdf5e6', 'olive': '#808000', 'olivedrab': '#6b8e23', 'orange': '#ffa500', 'orangered': '#ff4500',
            'orchid': '#da70d6',
            'palegoldenrod': '#eee8aa', 'palegreen': '#98fb98', 'paleturquoise': '#afeeee', 'palevioletred': '#d87093',
            'papayawhip': '#ffefd5',
            'peachpuff': '#ffdab9', 'peru': '#cd853f', 'pink': '#ffc0cb', 'plum': '#dda0dd', 'powderblue': '#b0e0e6', 'purple': '#800080',
            'rebeccapurple': '#663399', 'red': '#ff0000', 'rosybrown': '#bc8f8f', 'royalblue': '#4169e1',
            'saddlebrown': '#8b4513', 'salmon': '#fa8072', 'sandybrown': '#f4a460', 'seagreen': '#2e8b57',
            'seashell': '#fff5ee', 'sienna': '#a0522d',
            'silver': '#c0c0c0', 'skyblue': '#87ceeb', 'slateblue': '#6a5acd', 'slategray': '#708090', 'snow': '#fffafa',
            'springgreen': '#00ff7f',
            'steelblue': '#4682b4', 'tan': '#d2b48c', 'teal': '#008080', 'thistle': '#d8bfd8', 'tomato': '#ff6347', 'turquoise': '#40e0d0',
            'violet': '#ee82ee', 'wheat': '#f5deb3', 'white': '#ffffff', 'whitesmoke': '#f5f5f5', 'yellow': '#ffff00',
            'yellowgreen': '#9acd32'
        };
        if (typeof colours[colour.toLowerCase()] !== 'undefined') {
            return colours[colour.toLowerCase()];
        }
        return '#d5d5d5';
    }
    /**
     * To create Conditional Formatting dialog.
     * @returns void
     * @hidden
     */
    showConditionalFormattingDialog() {
        this.newFormat = [];
        for (let i = 0; i < this.parent.dataSource.conditionalFormatSettings.length; i++) {
            this.newFormat.push(extend({}, this.parent.dataSource.conditionalFormatSettings[i].properties, null, true));
        }
        this.createDialog();
        this.dialog.refresh();
        this.addFormat();
    }
    /**
     * To destroy the Conditional Formatting dialog
     * @returns void
     * @hidden
     */
    destroy() {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.hide();
            for (let i = 0; i < this.newFormat.length; i++) {
                if (this.fontColor[i] && !this.fontColor[i].isDestroyed) {
                    this.fontColor[i].destroy();
                }
                if (this.backgroundColor[i] && !this.backgroundColor[i].isDestroyed) {
                    this.backgroundColor[i].destroy();
                }
            }
            this.dialog.destroy();
        }
        else {
            return;
        }
    }
}

/**
 * common exported items
 */

/**
 * Data modules
 */
/** @hidden */

/**
 * Export PivotGrid components
 */

export { GroupingBarSettings, CellEditSettings, ConditionalSettings, HyperlinkSettings, PivotView, Render, ExcelExport$1 as ExcelExport, PDFExport, KeyboardInteraction, VirtualScroll$1 as VirtualScroll, DrillThrough, PivotFieldList, TreeViewRenderer, AxisFieldRenderer, AxisTableRenderer, DialogRenderer, EventBase, NodeStateModified, DataSourceUpdate, FieldList, CommonKeyboardInteraction, GroupingBar, CalculatedField, ConditionalFormatting, PivotCommon, load, enginePopulating, enginePopulated, onFieldDropped, beforePivotTableRender, afterPivotTableRender, beforeExport, excelHeaderQueryCellInfo, pdfHeaderQueryCellInfo, excelQueryCellInfo, pdfQueryCellInfo, dataBound, queryCellInfo, headerCellInfo, hyperlinkCellClick, resizing, resizeStop, cellClick, drillThrough, beforeColumnsRender, selected, cellSelected, cellDeselected, rowSelected, rowDeselected, initialLoad, uiUpdate, scroll, contentReady, dataReady, initSubComponent, treeViewUpdate, pivotButtonUpdate, initCalculatedField, click, ErrorDialog, FilterDialog, PivotContextMenu, AggregateMenu, PivotEngine, PivotUtil };
//# sourceMappingURL=ej2-pivotview.es2015.js.map
