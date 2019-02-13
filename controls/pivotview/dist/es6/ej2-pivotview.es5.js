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
var PivotUtil = /** @__PURE__ @class */ (function () {
    function PivotUtil() {
    }
    PivotUtil.getType = function (value) {
        var val;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
        return val;
    };
    PivotUtil.resetTime = function (date) {
        date.setHours(0, 0, 0, 0);
        return date;
    };
    return PivotUtil;
}());

/**
 * PivotEngine is used to manipulate the relational or Multi-Dimensional data as pivoting values.
 */
/** @hidden */
var PivotEngine = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for PivotEngine class
     * @param  {DataOptions} dataSource?
     * @param  {string} mode?
     * @hidden
     */
    /* tslint:disable:align */
    function PivotEngine(dataSource, mode, savedFieldList, pageSettings, enableValueSoring, isDrillThrough) {
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
        var fields;
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
    PivotEngine.prototype.getFormattedFields = function (fields) {
        var cnt = this.formats.length;
        while (cnt--) {
            this.formatFields[this.formats[cnt].name] = this.formats[cnt];
            // for (let len: number = 0, lnt: number = fields.length; len < lnt; len++) {
            // if (fields[len] && fields[len].name === this.formats[cnt].name) {
            //     this.formatFields[fields[len].name] = this.formats[cnt];
            // }
            // }
        }
    };
    PivotEngine.prototype.getFieldList = function (fields, isSort, isValueFilteringEnabled) {
        var type;
        var keys = this.fields;
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        this.getFormattedFields(dataFields);
        this.getCalculatedField(keys);
        var len = keys.length;
        if (this.savedFieldList) {
            this.fieldList = this.savedFieldList;
            while (len--) { /** while is used for better performance than for */
                var key = keys[len];
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
                var key = keys[len];
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
    };
    PivotEngine.prototype.updateFieldList = function (savedFieldList) {
        var keys = this.fields;
        var len = keys.length;
        while (len--) { /** while is used for better performance than for */
            this.fieldList[keys[len]].isExcelFilter = savedFieldList[keys[len]].isExcelFilter;
        }
    };
    PivotEngine.prototype.updateTreeViewData = function (fields) {
        var cnt = fields.length;
        var lnt = this.calculatedFieldSettings.length;
        while (cnt--) {
            if (this.fieldList[fields[cnt].name]) {
                var field = this.fieldList[fields[cnt].name];
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
    };
    PivotEngine.prototype.getCalculatedField = function (keys) {
        for (var _i = 0, _a = this.calculatedFieldSettings; _i < _a.length; _i++) {
            var field = _a[_i];
            this.calculatedFields[field.name] = extend({}, field, null, true);
            this.calculatedFields[field.name].actualFormula = field.formula;
        }
        var fieldKeys = Object.keys(this.calculatedFields);
        for (var calc = 0, cnt = fieldKeys.length; calc < cnt; calc++) {
            var field = this.calculatedFields[fieldKeys[calc]];
            var calcProperties = field.properties;
            var actualFormula = (calcProperties ? calcProperties.formula : field.formula).replace(/ +/g, '');
            var formula = actualFormula.replace(/"/g, '');
            field.formula = formula.indexOf('^') > -1 ? this.powerFunction(formula) : formula;
            field.name = calcProperties ? calcProperties.name : field.name;
            keys.push(field.name);
            var formulaType = actualFormula.split('\"');
            for (var len = 0, lmt = formulaType.length; len < lmt; len++) {
                var type = formulaType[len];
                var aggregateValue = type.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);
                var selectedString = (aggregateValue[0] === 'DistinctCount' ?
                    'DistinctCount' : aggregateValue[0] === 'PopulationStDev' ?
                    'PopulationStDev' : aggregateValue[0] === 'SampleStDev' ? 'SampleStDev' : aggregateValue[0] === 'PopulationVar' ?
                    'PopulationVar' : aggregateValue[0] === 'SampleVar' ? 'SampleVar' : aggregateValue[0]);
                if (['Sum', 'Count', 'Min', 'Max', 'Avg', 'Product', 'DistinctCount',
                    'PopulationStDev', 'SampleStDev', 'PopulationVar', 'SampleVar'].indexOf(selectedString) !== -1) {
                    var index = keys.indexOf(aggregateValue[1]);
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
    };
    PivotEngine.prototype.validateFilters = function (data) {
        this.isValueFiltersAvail = false;
        var filterElements = data.filterSettings ? data.filterSettings : [];
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        for (var _i = 0, filterElements_1 = filterElements; _i < filterElements_1.length; _i++) {
            var filter = filterElements_1[_i];
            for (var _a = 0, dataFields_1 = dataFields; _a < dataFields_1.length; _a++) {
                var field = dataFields_1[_a];
                if (filter.name === field.name && filter.type === 'Value') {
                    this.isValueFiltersAvail = true;
                    break;
                }
            }
            if (this.isValueFiltersAvail) {
                break;
            }
        }
    };
    PivotEngine.prototype.fillFieldMembers = function (data, indMat) {
        var keys = this.fields;
        var dlen = data.length;
        var fList = this.fieldList;
        var kLn = keys.length;
        for (var kl = 0; kl < kLn; kl++) {
            var key = keys[kl];
            if (!fList[key].members) {
                fList[key].members = {};
            }
            if (!fList[key].formattedMembers) {
                fList[key].formattedMembers = {};
            }
            if (!fList[key].dateMember) {
                fList[key].dateMember = [];
            }
            var members = fList[key].members;
            var isDataAvail = Object.keys(members).length > 0 ? true : false;
            var formattedMembers = fList[key].formattedMembers;
            var dateMember = fList[key].dateMember;
            var membersCnt = 0;
            var fmembersCnt = 0;
            //let sort: string[] = [];
            for (var dl = 0; dl < dlen; dl++) {
                var mkey = data[dl][key];
                if (!isNullOrUndefined(mkey)) {
                    if (!isDataAvail) {
                        var fKey = mkey;
                        var formattedValue = (this.pageSettings && !(this.formatFields[key] &&
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
    };
    PivotEngine.prototype.fillDrilledInfo = function () {
        for (var key = 0; key < this.drilledMembers.length; key++) {
            var fieldName = this.drilledMembers[key].name;
            for (var mem = 0; mem < this.drilledMembers[key].items.length; mem++) {
                var memberName = this.drilledMembers[key].items[mem];
                var field = this.fieldList[fieldName];
                if (field && field.members[memberName]) {
                    field.members[memberName].isDrilled = this.isExpandAll ? false : true;
                }
            }
        }
    };
    PivotEngine.prototype.generateValueMatrix = function (data) {
        var keys = this.fields;
        var len = data.length;
        var vMat = [];
        var keyLen = keys.length;
        var flList = this.fieldList;
        while (len--) {
            var record = data[len];
            var tkln = keyLen;
            //if (isNullOrUndefined(vMat[len])) {
            vMat[len] = [];
            //}
            while (tkln--) {
                var key = keys[tkln];
                vMat[len][tkln] = (flList[key].type === 'number') ? data[len][key] : 1;
            }
        }
        return vMat;
    };
    PivotEngine.prototype.updateSortSettings = function (sortSettings, isSort) {
        for (var sln = 0, slt = sortSettings ? sortSettings.length : 0; sln < slt && isSort; sln++) {
            this.fieldList[sortSettings[sln].name].sort = sortSettings[sln].order;
        }
    };
    PivotEngine.prototype.updateFilterMembers = function (source) {
        var filterRw = this.filterMembers;
        var list = {};
        //let eList: {[key: string] : number} = {};
        var isInclude = this.getFilters(source, list);
        //this.getFilterExcludeList(source.rows, flist);
        //this.getFilterExcludeList(source.columns, flist);
        //this.getFilterExcludeList(source.filters, flist);
        // let filters: Iterator = isInclude ? iList : eList;
        var dln = this.indexMatrix.length;
        if (isInclude) {
            var keys = list.include.index;
            for (var ln = 0; ln < keys.length; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[keys[ln]] === undefined) {
                    filterRw.push(keys[ln]);
                }
            }
        }
        else {
            for (var ln = 0; ln < dln; ln++) {
                if (list.exclude === undefined || list.exclude.indexObject[ln] === undefined) {
                    filterRw.push(ln);
                }
            }
        }
    };
    PivotEngine.prototype.getFilters = function (source, ilist) {
        var filterElements = source.filterSettings ? source.filterSettings : [];
        var filters = this.filters;
        var isInclude = false;
        var filter = [];
        //let type: string;
        for (var rln = 0, rlt = filterElements.length; rln < rlt; rln++) {
            var filterElement = filterElements[rln].properties ?
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
    };
    PivotEngine.prototype.isValidFilterField = function (filterElement, allowLabelFiltering) {
        var isValidFilterElement = false;
        var filterTypes = ['Include', 'Exclude'];
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        if (this.fieldList[filterElement.name].isSelected && filterTypes.indexOf(filterElement.type) >= 0) {
            var isNotValidFilterElement = false;
            for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
                var field = _a[_i];
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
            for (var _b = 0, dataFields_2 = dataFields; _b < dataFields_2.length; _b++) {
                var field = dataFields_2[_b];
                if (filterElement.name === field.name && allowLabelFiltering &&
                    (['Label', 'Date', 'Number'].indexOf(filterElement.type) >= 0)) {
                    isValidFilterElement = true;
                    break;
                }
            }
        }
        return isValidFilterElement;
    };
    PivotEngine.prototype.applyLabelFilter = function (filterElement) {
        if (['Label', 'Date', 'Number'].indexOf(filterElement.type) >= 0) {
            var members = Object.keys(this.fieldList[filterElement.name].members);
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
                for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
                    var member = members_1[_i];
                    var operand1 = this.getParsedValue(filterElement.name, filterElement.value1);
                    var operand2 = this.getParsedValue(filterElement.name, filterElement.value2);
                    var cValue = this.getParsedValue(filterElement.name, member);
                    /* tslint:disable-next-line:max-line-length */
                    if (this.validateFilterValue(cValue, filterElement.condition, operand1, operand2)) {
                        filterElement.items.push(member);
                    }
                }
            }
            var excludeOperators = ['DoesNotBeginWith', 'DoesNotContains', 'DoesNotEndsWith', 'DoesNotEquals', 'NotBetween'];
            filterElement.type = (excludeOperators.indexOf(filterElement.condition) > -1 &&
                !filterElement.showNumberFilter) ? 'Exclude' : 'Include';
        }
        else {
            filterElement.showLabelFilter = false;
        }
    };
    PivotEngine.prototype.getLabelFilterMembers = function (members, operator, value1, value2) {
        var items = [];
        for (var _i = 0, members_2 = members; _i < members_2.length; _i++) {
            var member = members_2[_i];
            var filterValue = member.toLowerCase();
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
    };
    PivotEngine.prototype.getDateFilterMembers = function (members, name, operator, value1, value2) {
        var items = [];
        for (var _i = 0, members_3 = members; _i < members_3.length; _i++) {
            var member = members_3[_i];
            var filterValue = new Date(member);
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
    };
    PivotEngine.prototype.validateFilterValue = function (val, operator, value1, value2) {
        var isMemberInclude = false;
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.frameFilterList = function (filter, name, list, type, isLabelFilter, isInclude) {
        var _this = this;
        var updateFilter = function () {
            var fln = 0;
            var field = _this.fieldList[name];
            field.filter = filter;
            field.filterType = type;
            field.isExcelFilter = isLabelFilter;
            var members = (_this.formatFields[name] &&
                (['date', 'dateTime', 'time'].indexOf(_this.formatFields[name].type) > -1)) ?
                field.formattedMembers : field.members;
            var allowFil = isInclude;
            var final = {};
            var filterObj = {};
            final[type] = { indexObject: {}, index: [] };
            _this.fieldFilterMem[name] = { memberObj: {} };
            while (filter[fln]) {
                var indx = members[filter[fln]].index;
                if (type === 'include') {
                    for (var iln = 0, ilt = indx.length; iln < ilt; iln++) {
                        if (!allowFil || list[type].indexObject[indx[iln]] !== undefined) {
                            final[type].indexObject[indx[iln]] = indx[iln];
                            final[type].index.push(indx[iln]);
                        }
                    }
                }
                else {
                    for (var iln = 0, ilt = indx.length; iln < ilt; iln++) {
                        if (list[type].indexObject[indx[iln]] === undefined) {
                            list[type].indexObject[indx[iln]] = indx[iln];
                            list[type].index.push(indx[iln]);
                        }
                    }
                    _this.fieldFilterMem[name].memberObj[filter[fln]] = filter[fln];
                }
                fln++;
            }
            if (type === 'include') {
                list[type] = final[type];
                for (var iln = 0; iln < filter.length; iln++) {
                    filterObj[filter[iln]] = filter[iln];
                }
                var items = Object.keys(members);
                for (var iln = 0, ilt = items.length; iln < ilt; iln++) {
                    if (filterObj[items[iln]] === undefined) {
                        _this.fieldFilterMem[name].memberObj[items[iln]] = items[iln];
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.applyValueFiltering = function (rowData, level, rows, columns, valueFilter, rowFilterData, type) {
        this.isValueFiltered = false;
        var allMember = extend({}, rows[rows.length - 1], null, true);
        this.getFilteredData(rows, columns, valueFilter, rowFilterData, level, rowData.name, allMember, type);
        if (this.isValueFiltered) {
            rowFilterData.push(allMember);
            rows = rowFilterData;
        }
        return rows;
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.getFilteredData = function (rows, columns, filterSettings, rowFilterData, level, fieldName, allMember, type) {
        var rLen = rows.length;
        for (var i = 0; i < rLen; i++) {
            if (filterSettings[fieldName]) {
                if (rows[i].level === level) {
                    this.isValueFiltered = true;
                    this.fieldList[fieldName].isExcelFilter = true;
                    var value = 0;
                    var measure = filterSettings[fieldName].measure;
                    var mPos = this.fieldList[measure].index;
                    var aggregate = this.fieldList[measure].aggregateType;
                    value = (type === 'row' ? this.getAggregateValue(rows[i].index, columns.indexObject, mPos, aggregate) :
                        this.getAggregateValue(columns.index, rows[i].indexObject, mPos, aggregate));
                    var operand1 = this.getParsedValue(measure, filterSettings[fieldName].value1);
                    var operand2 = this.getParsedValue(measure, filterSettings[fieldName].value2);
                    /* tslint:disable-next-line:max-line-length */
                    if (!this.validateFilterValue(value, filterSettings[fieldName].condition, operand1, operand2) && rows[i].type !== 'grand sum') {
                        var data = this.removefilteredData(rows[i], this.valueFilteredData);
                        var row = data ? data : rows[i];
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
    };
    PivotEngine.prototype.getParsedValue = function (measure, value) {
        var cValue = value ? value.toString() : '';
        if (this.formatFields[measure] && value) {
            var formatSetting = extend({}, this.formatFields[measure], null, true);
            delete formatSetting.name;
            return this.globalize.parseNumber(cValue, formatSetting);
        }
        else {
            return this.globalize.parseNumber(cValue, { format: 'N' });
        }
    };
    PivotEngine.prototype.removefilteredData = function (row, rowFilterData) {
        var rows = extend([], rowFilterData, null, true);
        var filteredData;
        for (var i = 0; i < rows.length; i++) {
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.validateFilteredParentData = function (row, rows, allMemberData, i, level, type) {
        if (rows.length > 0) {
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var rowFilteredData = rows_1[_i];
                if (rowFilteredData.level === i) {
                    if (type === 'row') {
                        var index = row.index;
                        for (var _a = 0, index_1 = index; _a < index_1.length; _a++) {
                            var key = index_1[_a];
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
                        var index = row.indexObject;
                        for (var _b = 0, _c = Object.keys(index); _b < _c.length; _b++) {
                            var key = _c[_b];
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
                var index = row.index;
                for (var _d = 0, index_2 = index; _d < index_2.length; _d++) {
                    var key = index_2[_d];
                    if (allMemberData.index.indexOf(key) >= 0) {
                        allMemberData.index.splice(allMemberData.index.indexOf(key), 1);
                    }
                }
            }
            else {
                var index = row.indexObject;
                for (var _e = 0, _f = Object.keys(index); _e < _f.length; _e++) {
                    var key = _f[_e];
                    if (index.hasOwnProperty(key)) {
                        delete allMemberData.indexObject[key];
                    }
                }
            }
        }
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.updateFramedHeaders = function (framedHeaders, dataHeaders, filteredHeaders, headers, type) {
        for (var _i = 0, framedHeaders_1 = framedHeaders; _i < framedHeaders_1.length; _i++) {
            var dHeader = framedHeaders_1[_i];
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
    };
    PivotEngine.prototype.validateFilteredHeaders = function (dHeader, filteredHeaders, type) {
        for (var _i = 0, filteredHeaders_1 = filteredHeaders; _i < filteredHeaders_1.length; _i++) {
            var vHeader = filteredHeaders_1[_i];
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
    };
    PivotEngine.prototype.isEmptyDataAvail = function (rowHeaders, columnHeaders) {
        this.isEmptyData = false;
        if (rowHeaders.length > 0 && rowHeaders[rowHeaders.length - 1].type === 'grand sum' &&
            rowHeaders[rowHeaders.length - 1].index.length === 0) {
            this.isEmptyData = true;
        }
        if (columnHeaders.length > 0 && columnHeaders[columnHeaders.length - 1].type === 'grand sum' &&
            Object.keys(columnHeaders[columnHeaders.length - 1].indexObject).length === 0) {
            this.isEmptyData = true;
        }
    };
    /** @hidden */
    PivotEngine.prototype.updateGridData = function (dataSource) {
        this.indexMatrix = [];
        for (var _i = 0, _a = this.fields; _i < _a.length; _i++) {
            var field = _a[_i];
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
    };
    /* tslint:disable */
    PivotEngine.prototype.generateGridData = function (dataSource, headerCollection) {
        var keys = this.fields;
        var columns = dataSource.columns ? dataSource.columns : [];
        var data = dataSource.data;
        var rows = dataSource.rows ? dataSource.rows : [];
        var filterSettings = dataSource.filterSettings;
        var values = dataSource.values ? dataSource.values : [];
        this.removeCount = 0;
        this.isExpandAll = dataSource.expandAll;
        this.drilledMembers = dataSource.drilledMembers ? dataSource.drilledMembers : [];
        this.isEmptyData = false;
        var filterMembers = [];
        var showNoDataItems = (rows[0] && rows[0].showNoDataItems) || (columns[0] && columns[0].showNoDataItems);
        if (showNoDataItems) {
            for (var ln = 0; ln < this.indexMatrix.length; ln++) {
                filterMembers.push(ln);
            }
        }
        for (var ln = 0; ln < this.filterMembers.length; ln++) {
            this.filterPosObj[this.filterMembers[ln]] = this.filterMembers[ln];
        }
        //let childrens: Field = this.fieldList[rows[0].name + ''];
        this.valueSortSettings.columnIndex = undefined;
        var st1 = new Date().getTime();
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
        var rowheads = [];
        var colheads = [];
        var rowFilteredData = [];
        var columnFilteredData = [];
        var valuesCount = (this.values.length);
        if ((this.isValueFiltersAvail && dataSource.allowValueFilter)) {
            this.valueFilteredData = [];
            var rowHeaders = this.saveDataHeaders.rowHeaders;
            var columnHeaders = this.saveDataHeaders.columnHeaders;
            if (filterSettings.length > 0) {
                var valueFilters = {};
                var valueFields = {};
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    valueFields[value.name] = value;
                }
                for (var _a = 0, filterSettings_1 = filterSettings; _a < filterSettings_1.length; _a++) {
                    var filter = filterSettings_1[_a];
                    rowHeaders = (rowFilteredData.length > 0 ? rowFilteredData : rowHeaders);
                    columnHeaders = (columnFilteredData.length > 0 ? columnFilteredData : columnHeaders);
                    this.valueFilteredData = [];
                    var filterElement = filter.properties ?
                        filter.properties : filter;
                    if (filterElement.type === 'Value' && this.fieldList[filter.name].isSelected) {
                        valueFilters[filter.name] = filter;
                        filterElement.items = [];
                        var isAvail = false;
                        var rLen = rows.length;
                        var cLen = columns.length;
                        for (var i = 0; i < rLen; i++) {
                            if (filterElement.name === rows[i].name && valueFields[filterElement.measure] && !isAvail) {
                                isAvail = true;
                                /* tslint:disable-next-line:max-line-length */
                                rowFilteredData = this.applyValueFiltering(rows[i], i, rowHeaders, columnHeaders[columnHeaders.length - 1], valueFilters, this.valueFilteredData, 'row');
                                break;
                            }
                        }
                        for (var j = 0; j < cLen; j++) {
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
            var savedFieldList = extend({}, this.fieldList, null, true);
            this.indexMatrix = [];
            var fields = dataSource.data[0];
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
        var st2 = new Date().getTime();
        //  console.log(st1 - st2);
    };
    /* tslint:enable */
    PivotEngine.prototype.applyValueSorting = function () {
        if (this.valueSortSettings.headerText && this.valueSortSettings.headerText !== '' && this.values.length > 0) {
            var textArray = this.valueSortSettings.headerText.split(this.valueSortSettings.headerDelimiter);
            var hText = '';
            var mIndex = void 0;
            var mType = void 0;
            var caption = void 0;
            for (var i = 0; i < this.values.length; i++) {
                if (this.values[i].caption === textArray[textArray.length - 1]) {
                    caption = this.values[i].name;
                    break;
                }
                else {
                    caption = textArray[textArray.length - 1];
                }
            }
            if (this.values.length > 1 && caption && this.fieldList[caption]) {
                for (var i = 0; i < textArray.length - 1; i++) {
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
            var member = void 0;
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
    };
    PivotEngine.prototype.getMember = function (cMembers, headerText) {
        var vlen = cMembers.length;
        var member;
        for (var j = 0; j < vlen; j++) {
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
    };
    PivotEngine.prototype.sortByValueRow = function (rMembers, member, sortOrder, mIndex, mType) {
        var sort = false;
        var vlen = rMembers.length;
        for (var j = 0; j < vlen; j++) {
            for (var k = j; k < vlen && rMembers[j].type !== 'grand sum' && rMembers[k].type !== 'grand sum'; k++) {
                if (sortOrder === 'Descending') {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) <
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                }
                else {
                    sort = this.getAggregateValue(rMembers[j].index, member.indexObject, mIndex, mType) >
                        this.getAggregateValue(rMembers[k].index, member.indexObject, mIndex, mType);
                }
                if (sort) {
                    var temp = {};
                    temp = rMembers[j];
                    rMembers[j] = rMembers[k];
                    rMembers[k] = temp;
                }
            }
            if (rMembers[j].members.length > 0) {
                this.sortByValueRow(rMembers[j].members, member, sortOrder, mIndex, mType);
            }
        }
    };
    PivotEngine.prototype.insertAllMembersCommon = function () {
        /* inserting the row grant-total members */
        var rowFlag = (this.showGrandTotals && this.showRowGrandTotals) ? true : (this.rows.length > 0) ? false : true;
        if (rowFlag) {
            this.insertAllMember(this.rMembers, this.filterMembers, '', 'row');
        }
        /* inserting the column gran-total members */
        var columnFlag = (this.showGrandTotals && this.showColumnGrandTotals) ? true : (this.columns.length > 0) ? false : true;
        if (columnFlag) {
            this.insertAllMember(this.cMembers, this.filterMembers, '', 'column');
        }
    };
    PivotEngine.prototype.removeIndexProperties = function () {
        for (var rCnt = 0; rCnt < this.headerContent.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                for (var cCnt = 0; cCnt < Object.keys(this.headerContent[rCnt]).length; cCnt++) {
                    var key = Number(Object.keys(this.headerContent[rCnt])[cCnt]);
                    this.headerContent[rCnt][key].index = [];
                    this.headerContent[rCnt][key].indexObject = {};
                    this.pivotValues[rCnt][key].index = [];
                    this.pivotValues[rCnt][key].indexObject = {};
                }
            }
        }
        for (var rCnt = this.headerContent.length; rCnt < this.pivotValues.length; rCnt++) {
            if (this.headerContent[rCnt]) {
                this.valueContent[rCnt - this.headerContent.length][0].index = [];
                this.valueContent[rCnt - this.headerContent.length][0].indexObject = {};
                this.pivotValues[rCnt][0].index = [];
                this.pivotValues[rCnt][0].indexObject = {};
            }
        }
    };
    PivotEngine.prototype.insertSubTotals = function () {
        var rowLength = this.pivotValues.length;
        for (var rowCnt = 0; rowCnt < rowLength; rowCnt++) {
            var rowCells = this.pivotValues[rowCnt];
            if (rowCells) {
                var savedCell = void 0;
                var spanCnt = 1;
                var colLength = rowCells.length;
                var indexObj = void 0;
                for (var colCnt = colLength - 1; colCnt > 0; colCnt--) {
                    var cell = rowCells[colCnt];
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
                        var rowPos = rowCnt + 1;
                        while (this.pivotValues[rowPos] && !this.pivotValues[rowPos][colCnt]) {
                            if (!this.pivotValues[rowCnt][colCnt].isDrilled) {
                                this.pivotValues[rowCnt][colCnt].rowSpan = (rowPos - rowCnt) + 1;
                                savedCell.rowSpan = (rowPos - rowCnt) + 1;
                            }
                            var cellType = (cell.type === 'sum' || cell.type === 'grand sum') ? cell.type : 'sum';
                            this.pivotValues[rowPos][colCnt] = this.headerContent[rowPos][colCnt] = {
                                type: cellType, formattedText: ((cell.type === 'sum' || cell.type === 'grand sum') ? cell.formattedText :
                                    (cell.formattedText + ' Total')),
                                axis: 'column', level: -1, colIndex: colCnt, rowIndex: rowPos, valueSort: cell.valueSort
                            };
                            if (cell.valueSort && cell.valueSort[this.valueSortSettings.headerText]) {
                                this.valueSortSettings.columnIndex = colCnt;
                            }
                            var isSpanned = false;
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
    };
    /* tslint:disable:max-func-body-length */
    PivotEngine.prototype.getIndexedHeaders = function (keys, data, keyInd, position, axis, parentMember) {
        var hierarchy = [];
        var showPosition = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
        if (keys) {
            var rlen = keys.length;
            var decisionObj = {};
            var fieldName = keys[keyInd].name;
            var field = keys[keyInd];
            // let members: string[] = Object.keys(this.fieldList[field].members);
            var childrens = this.fieldList[fieldName];
            var index = {};
            var isNoData = false;
            var isDateType = (this.formatFields[fieldName] &&
                (['date', 'dateTime', 'time'].indexOf(this.formatFields[fieldName].type) > -1));
            var showNoDataItems = (position.length < 1 && keyInd > 0) || field.showNoDataItems;
            var savedMembers = {};
            if (showNoDataItems) {
                var members = Object.keys(childrens.members);
                for (var pos = 0, lt = members.length; pos < lt; pos++) {
                    savedMembers[members[pos]] = members[pos];
                }
                if (position.length < 1) {
                    isNoData = true;
                    position.length = members.length;
                }
            }
            for (var pos = 0, lt = position.length; pos < lt; pos++) {
                var member = {};
                if (!isNullOrUndefined(keys[keyInd].showSubTotals) && !keys[keyInd].showSubTotals) {
                    member.showSubTotals = false;
                }
                member.hasChild = keyInd < rlen - 1;
                member.level = keyInd;
                member.axis = axis;
                member.colSpan = 1;
                var memInd = isNoData ? childrens.members[Object.keys(savedMembers)[0]].ordinal :
                    this.indexMatrix[position[pos]][childrens.index];
                var headerValue = isNoData ? Object.keys(savedMembers)[0] :
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
                var formattedValue = isDateType ?
                    this.getFormattedValue(headerValue, fieldName) : { formattedText: headerValue.toString(), actualText: headerValue };
                member.actualText = formattedValue.actualText;
                member.formattedText = formattedValue.formattedText;
                if (isDateType) {
                    member.dateText = formattedValue.dateText;
                }
                var availData = showNoDataItems ? (this.filterPosObj[position[pos]] !== undefined &&
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
            for (var iln = 0, ilt = hierarchy.length; iln < ilt; iln++) {
                if (axis === 'row') {
                    this.rowCount += this.rowValuesLength;
                }
                else {
                    this.columnCount += this.colValuesLength;
                }
                if (rlen - 1 > keyInd && hierarchy[iln].isDrilled) {
                    if (showPosition) {
                        var level = null;
                        if (hierarchy[iln].valueSort && hierarchy[iln].valueSort.levelName) {
                            level = hierarchy[iln].valueSort.levelName;
                        }
                        parentMember = (level || hierarchy[iln].formattedText);
                    }
                    var filterPosition = !showPosition ? index[hierarchy[iln].ordinal] : hierarchy[iln].index;
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
                        (hierarchy.sort(function (a, b) { return (a.dateText > b.dateText) ? 1 : ((b.dateText > a.dateText) ? -1 : 0); })) :
                        (hierarchy.sort(function (a, b) { return (a.dateText < b.dateText) ? 1 : ((b.dateText < a.dateText) ? -1 : 0); }));
                }
                else {
                    return childrens.sort === 'Ascending' ?
                        (hierarchy.sort(function (a, b) { return (a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0); })) :
                        (hierarchy.sort(function (a, b) { return (a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0); }));
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
    };
    PivotEngine.prototype.getOrderedIndex = function (headers) {
        var orderedIndex = {};
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].type !== 'grand sum') {
                orderedIndex[headers[i].ordinal] = i;
            }
        }
        return orderedIndex;
    };
    PivotEngine.prototype.insertPosition = function (keys, data, keyInd, position, axis, parentMember, slicedHeaders) {
        var hierarchy = [];
        var orderedIndex = this.getOrderedIndex(slicedHeaders);
        if (keys) {
            var decisionObj = {};
            var field = keys[keyInd].name;
            var childrens = this.fieldList[field];
            for (var pos = 0, lt = position.length; pos < lt; pos++) {
                var member = {};
                var memInd = this.indexMatrix[position[pos]][childrens.index];
                var slicedHeader = slicedHeaders[orderedIndex[memInd]];
                var formattedValue = (this.formatFields[field] &&
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
            var diff = slicedHeaders.length - hierarchy.length;
            while (diff > 0) {
                hierarchy.push({ members: [] });
                diff--;
            }
            for (var iln = 0, ilt = hierarchy.length; iln < ilt; iln++) {
                if (slicedHeaders[iln].members.length > 0) {
                    var level = null;
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
    };
    PivotEngine.prototype.insertTotalPosition = function (headers) {
        var summCell = headers[headers.length - 1];
        if (summCell && summCell.type === 'grand sum') {
            summCell.index = this.filterMembers;
            /* tslint:disable:typedef */
            for (var ln = 0, lt_1 = this.filterMembers.length; ln < lt_1; ln++) {
                summCell.indexObject[this.filterMembers[ln]] = this.filterMembers[ln];
            }
            /* tslint:enable:typedef */
        }
        return headers;
    };
    PivotEngine.prototype.calculatePagingValues = function () {
        var isValueSorting = ((this.valueSortSettings.sortOrder !== 'None' &&
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
            var exactStartPos = (this.rowStartPos + (this.pageSettings.rowSize * 3 * this.rowValuesLength)) > this.rowCount ?
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
    };
    PivotEngine.prototype.performSlicing = function (headers, slicedHeaders, startPos, axis) {
        var pos = 0;
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
            var members = headers[pos].members;
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
    };
    PivotEngine.prototype.insertAllMember = function (set, filter, customText, axis) {
        var len = set.length;
        var showPosition = this.enableValueSorting || this.allowValueFilter || !this.pageSettings;
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
            for (var ln = 0, lt = filter.length; ln < lt; ln++) {
                set[len].indexObject[filter[ln]] = filter[ln];
            }
        }
        if (axis === 'row') {
            this.rowCount += this.rowValuesLength;
        }
        else {
            this.columnCount += this.colValuesLength;
        }
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.getTableData = function (rows, reformAxis, columns, tnum, data, vlt, rTotal, cTotal) {
        for (var rlt = rows.length, rln = 0; rln < rlt; rln++) {
            tnum = data.length;
            reformAxis[tnum] = rows[rln];
            var actCnt = tnum - Number(Object.keys(reformAxis)[0]);
            //let rplus: number = rln + 1;
            //let lvl: number = rows[rln].level;
            var isLeastNode = !reformAxis[tnum].members.length;
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
                var hpos = tnum;
                var actpos = actCnt;
                for (var vln = 0; vln < vlt; vln++) {
                    tnum++;
                    actCnt++;
                    var name_1 = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    var calObj = {
                        axis: 'row',
                        actualText: this.values[vln].name,
                        formattedText: name_1,
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
                    var vData = data[tnum][0].valueSort;
                    vData[data[tnum - vln - 1][0].valueSort.levelName + this.valueSortSettings.headerDelimiter + name_1] = 1;
                    vData.levelName = data[tnum - vln - 1][0].valueSort.levelName + this.valueSortSettings.headerDelimiter
                        + name_1;
                    for (var cln = 0, dln = 1, clt = columns.length; cln < clt; ++cln) {
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
                for (var cln = 0, dln = 1, clt = columns.length; cln < clt; ++cln) {
                    for (var vln = 0; vln < vlt; vln++) {
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.getAggregatedHeaders = function (rows, columns, rMembers, cMembers, values) {
        this.selectedHeaders = { selectedHeader: [], values: [] };
        for (var vlt = values.length, vln = 0; vln < vlt; vln++) {
            switch (values[vln].type) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        var baseField = void 0;
                        var baseItem = void 0;
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
                        var isHeaderSelected = false;
                        for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                            var row = rows_2[_i];
                            if (row.name === baseField) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rMembers, values[vln].name, baseItem, false, 'row', values[vln].type, this.selectedHeaders.selectedHeader, vln);
                                isHeaderSelected = true;
                                break;
                            }
                        }
                        if (!isHeaderSelected) {
                            for (var _a = 0, columns_1 = columns; _a < columns_1.length; _a++) {
                                var column = columns_1[_a];
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
                        var baseField = void 0;
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
                        var isHeaderSelected = false;
                        for (var len = rows.length, i = 0; i < len; i++) {
                            if (rows[i].name === baseField) {
                                /* tslint:disable-next-line:max-line-length */
                                this.getAggregatedHeaderData(rMembers, values[vln].name, undefined, false, 'row', values[vln].type, this.selectedHeaders.selectedHeader, vln, i);
                                isHeaderSelected = true;
                                break;
                            }
                        }
                        if (!isHeaderSelected) {
                            for (var len = columns.length, i = 0; i < len; i++) {
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.getAggregatedHeaderData = function (headers, name, baseItem, isChildren, type, aggregateType, selectedHeaders, vln, level) {
        for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
            var rln = headers_1[_i];
            switch (aggregateType) {
                case 'DifferenceFrom':
                case 'PercentageOfDifferenceFrom':
                    {
                        var levelName = rln.valueSort.levelName.toString().split('.');
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
                                        var aggregateHeaders = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
                                        for (var _a = 0, _b = rln.members; _a < _b.length; _a++) {
                                            var member = _b[_a];
                                            aggregateHeaders.push(member);
                                        }
                                    }
                                    else {
                                        var children = extend([], rln.members, null, true);
                                        /* tslint:disable-next-line:max-line-length */
                                        selectedHeaders.push(this.updateSelectedHeaders(undefined, rln.level, type, false, name, aggregateType, rln.valueSort.levelName, children, vln + 1));
                                        var aggregateHeaders = selectedHeaders[selectedHeaders.length - 1].aggregateHeaders;
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
    };
    /* tslint:disable-next-line:max-line-length */
    PivotEngine.prototype.updateSelectedHeaders = function (baseItem, level, type, isChildren, name, aggregateType, levelName, headers, vCount) {
        var headerData = {
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
    };
    PivotEngine.prototype.applyAdvancedAggregate = function (rowheads, colheads, data) {
        if (this.selectedHeaders.values.length > 0) {
            var pivotIndex = {};
            var colIndex = [];
            var isIndexFilled = false;
            for (var rlt = data.length, rln = 0; rln < rlt; rln++) {
                if (data[rln] !== undefined && data[rln][0] !== undefined) {
                    if (!isIndexFilled) {
                        for (var clt = data[rln].length, cln = 0; cln < clt; cln++) {
                            if (data[rln][cln].axis === 'value' &&
                                this.selectedHeaders.values.indexOf(data[rln][cln].actualText) !== -1) {
                                colIndex.push(cln);
                                isIndexFilled = true;
                            }
                        }
                    }
                    if (colIndex.length > 0 && data[rln][colIndex[0]].axis === 'value' &&
                        this.selectedHeaders.values.indexOf(data[rln][colIndex[0]].actualText) !== -1) {
                        for (var _i = 0, colIndex_1 = colIndex; _i < colIndex_1.length; _i++) {
                            var index = colIndex_1[_i];
                            pivotIndex[rln + ',' + index] = [rln, index];
                        }
                    }
                }
            }
            this.updateAggregates(rowheads, colheads, data, this.selectedHeaders.selectedHeader, colIndex, pivotIndex);
            var indexCollection = Object.keys(pivotIndex);
            for (var _a = 0, indexCollection_1 = indexCollection; _a < indexCollection_1.length; _a++) {
                var index = indexCollection_1[_a];
                var currentSet = data[pivotIndex[index][0]][pivotIndex[index][1]];
                // currentSet.formattedText = '0';
                currentSet.formattedText = (this.selectedHeaders.selectedHeader.length > 0 ? '0' : '#N/A');
            }
        }
        else {
            return;
        }
    };
    /* tslint:disable:all */
    PivotEngine.prototype.updateAggregates = function (rowheads, colheads, data, selectedHeaders, colIndex, pivotIndex) {
        for (var _i = 0, selectedHeaders_1 = selectedHeaders; _i < selectedHeaders_1.length; _i++) {
            var headers = selectedHeaders_1[_i];
            var selectedHeaderCollection = headers.aggregateHeaders;
            var name_2 = headers.value;
            var valueCount = (this.valueAxis && this.isMutiMeasures ? headers.valueCount : 0);
            var aggregateType = headers.type;
            var uniqueName = headers.uniqueName;
            var axis = headers.axis;
            var isRowBaseField = axis === 'row' ? true : false;
            var activeValues = void 0;
            var indexCollection = [];
            var activeColumn = [];
            var columnHeaders = [];
            var rowindexCollection = [];
            var selectedRowValues = [];
            var selectedColumnValues = [];
            if ((['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal', 'RunningTotals']).indexOf(headers.type) !== -1) {
                if (isRowBaseField) {
                    if (headers.type !== 'RunningTotals') {
                        for (var rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
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
                    for (var len_1 = data.length, i = 0; i < len_1; i++) {
                        if (data[i] !== undefined && data[i][0] === undefined) {
                            columnHeaders.push(data[i]);
                        }
                        else {
                            break;
                        }
                    }
                    var len = columnHeaders.length;
                    while (len--) {
                        var axisObj = columnHeaders[len][colIndex[0]];
                        var cLevelName = axisObj.actualText;
                        if (this.selectedHeaders.values.indexOf(cLevelName) === -1) {
                            activeColumn = columnHeaders[len];
                            len = 0;
                        }
                    }
                    if (headers.type !== 'RunningTotals') {
                        for (var clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                            var isSelectedColumn = false;
                            if (activeColumn[cln] !== undefined && activeColumn[cln].valueSort[uniqueName]) {
                                activeValues = activeColumn[cln];
                                for (var len_2 = data.length, i = 0; i < len_2; i++) {
                                    var axisObj = data[i];
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
                        var isChildren = headers.isChild;
                        if (isRowBaseField) {
                            if (!isChildren) {
                                for (var _a = 0, selectedHeaderCollection_1 = selectedHeaderCollection; _a < selectedHeaderCollection_1.length; _a++) {
                                    var item = selectedHeaderCollection_1[_a];
                                    for (var rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
                                        if (rowheads[rln] !== undefined) {
                                            if (rowheads[rln].valueSort[item.valueSort.levelName] &&
                                                rowheads[rln].level === activeValues.level && rowheads[rln].type !== 'grand sum') {
                                                for (var _b = 0, colIndex_2 = colIndex; _b < colIndex_2.length; _b++) {
                                                    var index = colIndex_2[_b];
                                                    var currentSet = data[rln + valueCount][index];
                                                    if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                                var uniqueLevelName = uniqueName.split('.');
                                for (var rlt = rowheads.length, rlen = 0; rlen < rlt; rlen++) {
                                    if (rowheads[rlen] !== undefined) {
                                        var levelName = rowheads[rlen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            rowheads[rlen].level === activeValues.level) {
                                            for (var _c = 0, colIndex_3 = colIndex; _c < colIndex_3.length; _c++) {
                                                var index = colIndex_3[_c];
                                                var currentSet = data[rlen + valueCount][index];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                            for (var _d = 0, indexCollection_2 = indexCollection; _d < indexCollection_2.length; _d++) {
                                var index = indexCollection_2[_d];
                                var currentSet = data[index[0]][index[1]];
                                var cVal = currentSet.value - selectedRowValues[index[1]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = this.getFormattedValue(cVal, name_2).formattedText;
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
                                for (var _e = 0, selectedHeaderCollection_2 = selectedHeaderCollection; _e < selectedHeaderCollection_2.length; _e++) {
                                    var item = selectedHeaderCollection_2[_e];
                                    for (var clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                                        var isSelectedColumn = false;
                                        if (activeColumn[cln] !== undefined &&
                                            activeColumn[cln].valueSort[item.valueSort.levelName] &&
                                            activeColumn[cln].level === activeValues.level && activeColumn[cln].type !== 'grand sum') {
                                            for (var _f = 0, rowindexCollection_1 = rowindexCollection; _f < rowindexCollection_1.length; _f++) {
                                                var index = rowindexCollection_1[_f];
                                                var currentSet = data[index][cln];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                                var uniqueLevelName = uniqueName.split('.');
                                for (var clt = activeColumn.length, clen = 0; clen < clt; clen++) {
                                    var isSelectedColumn = false;
                                    if (activeColumn[clen] !== undefined) {
                                        var levelName = activeColumn[clen].valueSort.levelName.toString().split('.');
                                        if (levelName.indexOf(uniqueLevelName[uniqueLevelName.length - 1]) !== -1 &&
                                            activeColumn[clen].level === activeValues.level) {
                                            for (var _g = 0, rowindexCollection_2 = rowindexCollection; _g < rowindexCollection_2.length; _g++) {
                                                var index = rowindexCollection_2[_g];
                                                var currentSet = data[index][clen];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                            for (var _h = 0, indexCollection_3 = indexCollection; _h < indexCollection_3.length; _h++) {
                                var index = indexCollection_3[_h];
                                var currentSet = data[index[0]][index[1]];
                                var cVal = currentSet.value - selectedColumnValues[index[0]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                if (aggregateType === 'DifferenceFrom') {
                                    currentSet.formattedText = this.getFormattedValue(cVal, name_2).formattedText;
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
                            for (var _j = 0, selectedHeaderCollection_3 = selectedHeaderCollection; _j < selectedHeaderCollection_3.length; _j++) {
                                var item = selectedHeaderCollection_3[_j];
                                for (var rlt = rowheads.length, i = 0; i < rlt; i++) {
                                    if (rowheads[i] !== undefined) {
                                        if (rowheads[i].valueSort[item.valueSort.levelName] &&
                                            rowheads[i].level === item.level) {
                                            for (var _k = 0, colIndex_4 = colIndex; _k < colIndex_4.length; _k++) {
                                                var index = colIndex_4[_k];
                                                var currentSet = data[i + valueCount][index];
                                                if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                            for (var _l = 0, indexCollection_4 = indexCollection; _l < indexCollection_4.length; _l++) {
                                var i = indexCollection_4[_l];
                                var currentSet = data[i[0]][i[1]];
                                var cVal = currentSet.value / selectedRowValues[i[1]].value;
                                cVal = isNaN(cVal) ? 0 : cVal;
                                currentSet.formattedText = (cVal !== 0 ? this.globalize.formatNumber(cVal, { format: 'P', maximumFractionDigits: 2 }) : '0');
                            }
                        }
                        else {
                            for (var _m = 0, selectedHeaderCollection_4 = selectedHeaderCollection; _m < selectedHeaderCollection_4.length; _m++) {
                                var item = selectedHeaderCollection_4[_m];
                                for (var clt = activeColumn.length, j = 0; j < clt; j++) {
                                    var isSelectedColumn = false;
                                    if (activeColumn[j] !== undefined &&
                                        activeColumn[j].valueSort[item.valueSort.levelName]) {
                                        for (var _o = 0, rowindexCollection_3 = rowindexCollection; _o < rowindexCollection_3.length; _o++) {
                                            var index = rowindexCollection_3[_o];
                                            var currentSet = data[index][j];
                                            if (currentSet.axis === 'value' && currentSet.actualText === name_2) {
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
                            for (var _p = 0, indexCollection_5 = indexCollection; _p < indexCollection_5.length; _p++) {
                                var i = indexCollection_5[_p];
                                var currentSet = data[i[0]][i[1]];
                                var val = currentSet.value / selectedColumnValues[i[0]].value;
                                val = isNaN(val) ? 0 : val;
                                currentSet.formattedText = (val !== 0 ? this.globalize.formatNumber(val, { format: 'P', maximumFractionDigits: 2 }) : '0');
                            }
                        }
                    }
                    break;
                case 'RunningTotals':
                    {
                        if (isRowBaseField) {
                            for (var _q = 0, colIndex_5 = colIndex; _q < colIndex_5.length; _q++) {
                                var index = colIndex_5[_q];
                                var cVal = 0;
                                for (var _r = 0, selectedHeaderCollection_5 = selectedHeaderCollection; _r < selectedHeaderCollection_5.length; _r++) {
                                    var item = selectedHeaderCollection_5[_r];
                                    for (var rlt = rowheads.length, rlen = 0; rlen < rlt; rlen++) {
                                        if (rowheads[rlen] !== undefined) {
                                            var currentSet = data[rlen + valueCount][index];
                                            if (rowheads[rlen] !== undefined && rowheads[rlen].valueSort[item.valueSort.levelName] &&
                                                rowheads[rlen].level === item.level && currentSet.axis === 'value' &&
                                                currentSet.actualText === name_2) {
                                                if (rowheads[rlen].type !== 'grand sum') {
                                                    cVal += currentSet.value;
                                                    currentSet.formattedText = this.getFormattedValue(cVal, name_2).formattedText;
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
                            for (var rlt = rowheads.length, rln = 0; rln < rlt; rln++) {
                                if (rowheads[rln] !== undefined) {
                                    var cVal = 0;
                                    for (var _s = 0, selectedHeaderCollection_6 = selectedHeaderCollection; _s < selectedHeaderCollection_6.length; _s++) {
                                        var item = selectedHeaderCollection_6[_s];
                                        for (var clt = activeColumn.length, cln = 0; cln < clt; cln++) {
                                            var currentSet = data[rln + valueCount][cln];
                                            if (activeColumn[cln] !== undefined &&
                                                activeColumn[cln].valueSort[item.valueSort.levelName] &&
                                                currentSet.axis === 'value' && currentSet.actualText === name_2) {
                                                if (activeColumn[cln].type !== 'grand sum') {
                                                    cVal += currentSet.value;
                                                    currentSet.formattedText = this.getFormattedValue(cVal, name_2).formattedText;
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
    };
    /* tslint:enable:all */
    PivotEngine.prototype.recursiveRowData = function (rows, reformAxis, columns, tnum, data, vlt, isLeastNode, rln, vln, rTotal, cTotal) {
        if (!isLeastNode) {
            this.getTableData(reformAxis[tnum - vln].members, reformAxis, columns, tnum, data, vlt, rTotal, cTotal);
        }
        reformAxis[tnum - vln].members = [];
    };
    PivotEngine.prototype.updateRowData = function (rows, columns, tnum, data, vln, rln, cln, dln, actCnt, rTotal, cTotal) {
        var mPos = this.fieldList[this.values[vln].name].index;
        var aggregate = this.fieldList[this.values[vln].name].aggregateType;
        var field = this.values[vln].name;
        var gTotalIndex = [];
        var totalValues = {};
        var value = 0;
        // let isLeast: boolean = isLeastNode && (vln === vlt - 1);
        switch (aggregate) {
            case 'Index':
                {
                    gTotalIndex = [[rows[rln], columns[cln]], [rows[rln], cTotal], [rTotal, columns[cln]], [rTotal, cTotal]];
                    var valueContent = ['cVal', 'rTotalVal', 'cTotalVal', 'gTotalVal'];
                    var i = 0;
                    for (var _i = 0, gTotalIndex_1 = gTotalIndex; _i < gTotalIndex_1.length; _i++) {
                        var rIndex = gTotalIndex_1[_i];
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    var val = ((totalValues.cVal) * (totalValues.gTotalVal)) / ((totalValues.rTotalVal) * (totalValues.cTotalVal));
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
                    var valueContent = ['cVal', 'gTotalVal'];
                    var i = 0;
                    for (var _a = 0, gTotalIndex_2 = gTotalIndex; _a < gTotalIndex_2.length; _a++) {
                        var rIndex = gTotalIndex_2[_a];
                        totalValues[valueContent[i]] = this.getAggregateValue((rIndex[0]).index, (rIndex[1]).indexObject, mPos, aggregate);
                        i++;
                    }
                    var val = ((totalValues.cVal) / (totalValues.gTotalVal));
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
        var isSum = rows[rln].hasChild || columns[cln].hasChild ||
            rows[rln].type === 'grand sum' || columns[cln].type === 'grand sum';
        var subTotal = (rows[rln].isDrilled && ((!isNullOrUndefined(rows[rln].showSubTotals) && !rows[rln].showSubTotals) ||
            !this.showSubTotals || !this.showRowSubTotals));
        var formattedText = subTotal ?
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
    };
    PivotEngine.prototype.getHeaderData = function (axis, reformAxis, data, tnum, vcnt) {
        var rlt = axis.length;
        var colItmLn = this.columns.length;
        var sortText = this.valueSortSettings.headerText;
        //let valueLn: number = this.values.length;
        for (var rln = 0; rln < rlt; rln++) {
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
            var lvl = axis[rln].level;
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
                for (var vln = 0; vln < vcnt; vln++) {
                    var name_3 = this.values[vln].caption ? this.values[vln].caption : this.values[vln].name;
                    var calObj = {
                        axis: 'column',
                        actualText: this.values[vln].name,
                        formattedText: name_3,
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
                    var vData = data[colItmLn][(tnum * vcnt) + 1 + vln].valueSort;
                    vData[axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name_3] = 1;
                    vData.levelName = axis[rln].valueSort.levelName + this.valueSortSettings.headerDelimiter + name_3;
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
    };
    /* tslint:disable */
    PivotEngine.prototype.getAggregateValue = function (rowIndex, columnIndex, value, type) {
        //rowIndex = rowIndex.sort();
        //columnIndex = columnIndex.sort();
        var rlt = rowIndex.length;
        //let clt: number = columnIndex.length;
        var ri = 0;
        var cellValue = 0;
        var avgCnt = 0;
        var isInit = true;
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
            var duplicateValues = [];
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    var currentVal = this.valueMatrix[rowIndex[ri]][value];
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
                    var currentVal = this.valueMatrix[rowIndex[ri]][value];
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
            var i = 0;
            var val = 0;
            var indexVal = [];
            var avgVal = 0;
            var cVal = 0;
            var avgDifferenceVal = 0;
            while (rowIndex[ri] !== undefined) {
                if (columnIndex[rowIndex[ri]] !== undefined) {
                    this.rawIndexObject[rowIndex[ri]] = rowIndex[ri];
                    var currentVal = this.valueMatrix[rowIndex[ri]][value];
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
                for (var _i = 0, indexVal_1 = indexVal; _i < indexVal_1.length; _i++) {
                    var index = indexVal_1[_i];
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
            var isFirst = true;
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
            var isMaxFirst = true;
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
                    var calcField = this.calculatedFields[this.fields[value]];
                    var actualFormula = calcField.formula;
                    var aggregateField = {};
                    if (this.calculatedFormulas[calcField.name]) {
                        var calculatedFormulas = this.calculatedFormulas[calcField.name];
                        for (var len = 0, lmt = calculatedFormulas.length; len < lmt; len++) {
                            var aggregatedValue = calculatedFormulas[len];
                            var value_1 = aggregateField[aggregatedValue.formula];
                            if (value_1 === undefined) {
                                var type_1 = aggregatedValue.type;
                                value_1 = this.getAggregateValue(rowIndex, columnIndex, aggregatedValue.index, type_1);
                                aggregateField[aggregatedValue.formula] = value_1;
                            }
                            actualFormula = (actualFormula).replace(aggregatedValue.formula, value_1.toString());
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
                    var currentVal = this.valueMatrix[rowIndex[ri]][value];
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
    };
    /* tslint:enable */
    /** hidden */
    PivotEngine.prototype.getFormattedValue = function (value, fieldName) {
        var formattedValue = {
            formattedText: value !== undefined ? value === null ? 'null' : value.toString() : undefined,
            actualText: value !== undefined ? value === null ? 'null' : value : undefined,
            dateText: value !== undefined ? value === null ? 'null' : value : undefined
        };
        if (this.formatFields[fieldName] && value) {
            var formatField = (this.formatFields[fieldName].properties ?
                this.formatFields[fieldName].properties : this.formatFields[fieldName]);
            var formatSetting = extend({}, formatField, null, true);
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
    };
    PivotEngine.prototype.powerFunction = function (formula) {
        if (formula.indexOf('^') > -1) {
            var items_1 = [];
            while (formula.indexOf('(') > -1) {
                formula = formula.replace(/(\([^\(\)]*\))/g, function (text, item) {
                    items_1.push(item);
                    return ('~' + (items_1.length - 1));
                });
            }
            items_1.push(formula);
            formula = '~' + (items_1.length - 1);
            while (formula.indexOf('~') > -1) {
                formula = formula.replace(new RegExp('~' + '(\\d+)', 'g'), function (text, index) {
                    return items_1[index].replace(/(\w*)\^(\w*)/g, 'Math.pow' + '($1,$2)');
                });
            }
        }
        return formula;
    };
    return PivotEngine;
}());

/**
 * Specifies pivot external events
 * @hidden
 */
/** @hidden */
var load = 'load';
/** @hidden */
var enginePopulating = 'enginePopulating';
/** @hidden */
var enginePopulated = 'enginePopulated';
/** @hidden */
var onFieldDropped = 'onFieldDropped';
/** @hidden */
var beforePivotTableRender = 'beforePivotTableRender';
/** @hidden */
var afterPivotTableRender = 'afterPivotTableRender';
/** @hidden */
var beforeExport = 'beforeExport';
/** @hidden */
var excelHeaderQueryCellInfo = 'excelHeaderQueryCellInfo';
/** @hidden */
var pdfHeaderQueryCellInfo = 'pdfHeaderQueryCellInfo';
/** @hidden */
var excelQueryCellInfo = 'excelQueryCellInfo';
/** @hidden */
var pdfQueryCellInfo = 'pdfQueryCellInfo';
/** @hidden */
var dataBound = 'dataBound';
/** @hidden */
var queryCellInfo = 'queryCellInfo';
/** @hidden */
var headerCellInfo = 'headerCellInfo';
/** @hidden */
var hyperlinkCellClick = 'hyperlinkCellClick';
/** @hidden */
var resizing = 'resizing';
/** @hidden */
var resizeStop = 'resizeStop';
/** @hidden */
var cellClick = 'cellClick';
/** @hidden */
var drillThrough = 'drillThrough';
/** @hidden */
var beforeColumnsRender = 'beforeColumnsRender';
/** @hidden */
var selected = 'selected';
/** @hidden */
var cellSelected = 'cellSelected';
/** @hidden */
var cellDeselected = 'cellDeselected';
/** @hidden */
var rowSelected = 'rowSelected';
/** @hidden */
var rowDeselected = 'rowDeselected';
/**
 * Specifies pivot internal events
 */
/** @hidden */
var initialLoad = 'initial-load';
/** @hidden */
var uiUpdate = 'ui-update';
/** @hidden */
var scroll = 'scroll';
/** @hidden */
var contentReady = 'content-ready';
/** @hidden */
var dataReady = 'data-ready';
/** @hidden */
var initSubComponent = 'init-groupingbar';
/** @hidden */
var treeViewUpdate = 'tree-view-update';
/** @hidden */
var pivotButtonUpdate = 'pivot-button-update';
/** @hidden */
var initCalculatedField = 'init-calculatedfield';
/** @hidden */
var click = 'click';

/**
 * CSS Constants
 * @hidden
 */
/** @hidden */
var ROOT = 'e-pivotfieldlist';
/** @hidden */
var RTL = 'e-rtl';
/** @hidden */
var DEVICE = 'e-device';
/** @hidden */
var ICON = 'e-icons';
/** @hidden */
var ICON_DISABLE = 'e-disable';
/** @hidden */
var ICON_HIDDEN = 'e-hide';
/** @hidden */
var AXISFIELD_ICON_CLASS = 'e-dropdown-icon';
var WRAPPER_CLASS = 'e-pivotfieldlist-wrapper';
/** @hidden */
var CONTAINER_CLASS = 'e-field-list-container';
/** @hidden */
var TOGGLE_FIELD_LIST_CLASS = 'e-toggle-field-list';
/** @hidden */
var STATIC_FIELD_LIST_CLASS = 'e-static';
/** @hidden */
var TOGGLE_SELECT_CLASS = 'e-select-table';
/** @hidden */
var FIELD_TABLE_CLASS = 'e-field-table';
/** @hidden */
var FIELD_LIST_CLASS = 'e-field-list';
/** @hidden */
var FIELD_LIST_TREE_CLASS = 'e-field-list-tree';
/** @hidden */
var FIELD_HEADER_CLASS = 'e-field-header';
/** @hidden */
var FIELD_LIST_TITLE_CLASS = 'e-field-list-title';
/** @hidden */
var FIELD_LIST_TITLE_CONTENT_CLASS = 'e-title-content';
/** @hidden */
var FIELD_LIST_FOOTER_CLASS = 'e-field-list-footer';
/** @hidden */
var CALCULATED_FIELD_CLASS = 'e-calculated-field';
/** @hidden */
var FLAT_CLASS = 'e-flat e-primary';
/** @hidden */
var OUTLINE_CLASS = 'e-outline';
/** @hidden */
var AXIS_TABLE_CLASS = 'e-axis-table';
/** @hidden */
var LEFT_AXIS_PANEL_CLASS = 'e-left-axis-fields';
/** @hidden */
var RIGHT_AXIS_PANEL_CLASS = 'e-right-axis-fields';
/** @hidden */
var AXIS_HEADER_CLASS = 'e-axis-header';
/** @hidden */
var AXIS_CONTENT_CLASS = 'e-axis-content';
/** @hidden */
var AXIS_PROMPT_CLASS = 'e-draggable-prompt';
/** @hidden */
var PIVOT_BUTTON_WRAPPER_CLASS = 'e-pvt-btn-div';
/** @hidden */
var PIVOT_BUTTON_CLASS = 'e-pivot-button';
/** @hidden */
var PIVOT_BUTTON_CONTENT_CLASS = 'e-content';
/** @hidden */
var DRAG_CLONE_CLASS = 'e-button-drag-clone';
/** @hidden */
var SORT_CLASS = 'e-sort';
/** @hidden */
var SORT_DESCEND_CLASS = 'e-descend';
/** @hidden */
var FILTER_COMMON_CLASS = 'e-btn-filter';
/** @hidden */
var FILTER_CLASS = 'e-pv-filter';
/** @hidden */
var FILTERED_CLASS = 'e-pv-filtered';
/** @hidden */
var REMOVE_CLASS = 'e-remove';
/** @hidden */
var DRAG_CLASS = 'e-drag';
/** @hidden */
var DROP_INDICATOR_CLASS = 'e-drop-indicator';
/** @hidden */
var INDICATOR_HOVER_CLASS = 'e-drop-hover';
/** @hidden */
var MEMBER_EDITOR_DIALOG_CLASS = 'e-member-editor-dialog';
/** @hidden */
var EDITOR_TREE_WRAPPER_CLASS = 'e-member-editor-wrapper';
/** @hidden */
var EDITOR_TREE_CONTAINER_CLASS = 'e-member-editor-container';
/** @hidden */
var DRILLTHROUGH_GRID_CLASS = 'e-drillthrough-grid';
/** @hidden */
var DRILLTHROUGH_BODY_CLASS = 'e-drillthrough-body';
/** @hidden */
var DRILLTHROUGH_BODY_HEADER_CONTAINER_CLASS = 'e-drillthrough-body-header-container';
/** @hidden */
var DRILLTHROUGH_BODY_HEADER_CLASS = 'e-drillthrough-body-header';
/** @hidden */
var DRILLTHROUGH_BODY_HEADER_COMMON_CLASS = 'e-drillthrough-body-header-common';
/** @hidden */
var DRILLTHROUGH_BODY_HEADER_VALUE_CLASS = 'e-drillthrough-body-header-value';
/** @hidden */
var DRILLTHROUGH_DIALOG = 'e-drillthrough-dialog';
/** @hidden */
var EDITOR_LABEL_WRAPPER_CLASS = 'e-editor-label-wrapper';
/** @hidden */
var EDITOR_LABEL_CLASS = 'e-editor-label';
/** @hidden */
var CHECK_BOX_FRAME_CLASS = 'e-frame';
/** @hidden */
var NODE_CHECK_CLASS = 'e-check';
/** @hidden */
var NODE_STOP_CLASS = 'e-stop';
/** @hidden */
var OK_BUTTON_CLASS = 'e-ok-btn';
/** @hidden */
var CANCEL_BUTTON_CLASS = 'e-cancel-btn';
/** @hidden */
var ERROR_DIALOG_CLASS = 'e-pivot-error-dialog';
/** @hidden */
var DROPPABLE_CLASS = 'e-droppable';
/** @hidden */
var ROW_AXIS_CLASS = 'e-rows';
/** @hidden */
var COLUMN_AXIS_CLASS = 'e-columns';
/** @hidden */
var VALUE_AXIS_CLASS = 'e-values';
/** @hidden */
var FILTER_AXIS_CLASS = 'e-filters';
/** @hidden */
var GROUPING_BAR_CLASS = 'e-grouping-bar';
/** @hidden */

/** @hidden */
var GROUP_ROW_CLASS = 'e-group-rows';
/** @hidden */
var GROUP_COLUMN_CLASS = 'e-group-columns';
/** @hidden */

/** @hidden */
var GROUP_VALUE_CLASS = 'e-group-values';
/** @hidden */
var GROUP_FILTER_CLASS = 'e-group-filters';
/** @hidden */

/** @hidden */
var NO_DRAG_CLASS = 'e-drag-restrict';
/** @hidden */
var SELECTED_NODE_CLASS = 'e-list-selected';
/** @hidden */
var TITLE_HEADER_CLASS = 'e-title-header';
/** @hidden */
var TITLE_CONTENT_CLASS = 'e-title-content';
/** @hidden */
var TEXT_CONTENT_CLASS = 'e-text-content';
/** @hidden */
var FOOTER_CONTENT_CLASS = 'e-footer-content';
/** @hidden */
var ADAPTIVE_CONTAINER_CLASS = 'e-adaptive-container';
/** @hidden */
var ADAPTIVE_FIELD_LIST_BUTTON_CLASS = 'e-field-list-btn';
/** @hidden */
var ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS = 'e-calculated-field-btn';
/** @hidden */
var BUTTON_SMALL_CLASS = 'e-small';
/** @hidden */
var BUTTON_ROUND_CLASS = 'e-round';
/** @hidden */
var ADD_ICON_CLASS = 'e-add-icon';
/** @hidden */
var BUTTON_FLAT_CLASS = 'e-flat';
/** @hidden */
var STATIC_CENTER_DIV_CLASS = 'e-center-div';
/** @hidden */
var STATIC_CENTER_HEADER_CLASS = 'e-center-title';
/** @hidden */
var ADAPTIVE_FIELD_LIST_DIALOG_CLASS = 'e-adaptive-field-list-dialog';
/** @hidden */
var LIST_TEXT_CLASS = 'e-list-text';
/** @hidden */
var LIST_SELECT_CLASS = 'e-selected-node';
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
var SELECTED_OPTION_ICON_CLASS = 'e-selected-option-icon';
/** @hidden */
var FILTER_DIV_CONTENT_CLASS = 'e-filter-div-content';
/** @hidden */
var FILTER_TEXT_DIV_CLASS = 'e-filter-text-div';
/** @hidden */
var BETWEEN_TEXT_DIV_CLASS = 'e-between-text-div';
/** @hidden */
var SEPARATOR_DIV_CLASS = 'e-separator-div';
/** @hidden */
var FILTER_OPTION_WRAPPER_1_CLASS = 'e-filter-option-wrapper-1';
/** @hidden */
var FILTER_OPTION_WRAPPER_2_CLASS = 'e-filter-option-wrapper-2';
/** @hidden */
var FILTER_INPUT_DIV_1_CLASS = 'e-filter-input-div-1';
/** @hidden */
var FILTER_INPUT_DIV_2_CLASS = 'e-filter-input-div-2';
/** @hidden */
var VALUE_OPTIONS_CLASS = 'e-value-options';
/** @hidden */
var FILTER_OPERATOR_CLASS = 'e-filter-operator';
/** @hidden */
var COLLAPSE = 'e-collapse';
/** @hidden */
var EXPAND = 'e-expand';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var COLUMNSHEADER = 'e-columnsheader';
/** @hidden */
var ROWSHEADER = 'e-rowsheader';
/** @hidden */
var VALUESCONTENT = 'e-valuescontent';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var SUMMARY = 'e-summary';
/** @hidden */
var CELLVALUE = 'e-cellvalue';
/** @hidden */

/** @hidden */
var PIVOTTOOLTIP = 'e-pivottooltip';
/** @hidden */
var TOOLTIP_HEADER = 'e-tooltipheader';
/** @hidden */
var TOOLTIP_CONTENT = 'e-tooltipcontent';
/** @hidden */
var NEXTSPAN = 'e-nextspan';
/** @hidden */
var LASTSPAN = 'e-lastspan';
/** @hidden */
var EDITOR_SEARCH_WRAPPER_CLASS = 'e-editor-search-wrapper';
/** @hidden */
var EDITOR_SEARCH_CLASS = 'e-editor-search';
/** @hidden */
var SELECT_ALL_WRAPPER_CLASS = 'e-select-all-wrapper';
/** @hidden */
var SELECT_ALL_CLASS = 'e-select-all';
/** @hidden */
var PIVOTCALC = 'e-pivot-calc';
/** @hidden */
var CALCDIALOG = 'e-pivot-calc-dialog-div';
/** @hidden */
var CALCRADIO = 'e-pivot-calc-radio';
/** @hidden */
var CALCCHECK = 'e-pivot-calc-check';
/** @hidden */
var CALCINPUT = 'e-pivot-calc-input';
/** @hidden */
var CALCINPUTDIV = 'e-pivot-calc-input-div';
/** @hidden */
var CALCOUTERDIV = 'e-pivot-calc-outer-div';
/** @hidden */
var FLAT = 'e-flat';
/** @hidden */
var FORMAT = 'e-format';
/** @hidden */
var FORMULA = 'e-pivot-formula';
/** @hidden */
var TREEVIEW = 'e-pivot-treeview';
/** @hidden */
var TREEVIEWOUTER = 'e-pivot-treeview-outer';
/** @hidden */
var CALCCANCELBTN = 'e-pivot-cancel-button';
/** @hidden */
var CALCADDBTN = 'e-pivot-add-button';
/** @hidden */
var CALCOKBTN = 'e-pivot-ok-button';
/** @hidden */
var CALCACCORD = 'e-pivot-accord';
/** @hidden */
var CALCBUTTONDIV = 'e-pivot-button-div';
/** @hidden */
var AXIS_ICON_CLASS = 'e-axis';
/** @hidden */
var AXIS_ROW_CLASS = 'e-axis-row';
/** @hidden */
var AXIS_COLUMN_CLASS = 'e-axis-column';
/** @hidden */
var AXIS_VALUE_CLASS = 'e-axis-value';
/** @hidden */
var AXIS_FILTER_CLASS = 'e-axis-filter';
/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */

/** @hidden */
var GRID_CLASS = 'e-grid';
/** @hidden */
var PIVOT_VIEW_CLASS = 'e-pivotview';
/** @hidden */
var PIVOT_ALL_FIELD_TITLE_CLASS = 'e-pivot-all-field-title';
/** @hidden */
var PIVOT_FORMULA_TITLE_CLASS = 'e-pivot-formula-title';
/** @hidden */
var PIVOT_CONTEXT_MENU_CLASS = 'e-pivot-context-menu';
/** @hidden */
var MENU_DISABLE = 'e-disabled';
/** @hidden */
var EMPTY_MEMBER_CLASS = 'e-member-prompt';
/** @hidden */
var CALC_EDIT = 'e-edit';
/** @hidden */
var CALC_EDITED = 'e-edited';
/** @hidden */
var EMPTY_FIELD = 'e-empty-field';
/** @hidden */
var FORMAT_DIALOG = 'e-pivot-formatting-dialog';
/** @hidden */
var FORMAT_CONDITION_BUTTON = 'e-format-condition-button';
/** @hidden */
var FORMAT_NEW = 'e-new-format';
/** @hidden */
var FORMAT_OUTER = 'e-format-outer-div';
/** @hidden */
var FORMAT_INNER = 'e-format-inner-div';
/** @hidden */
var FORMAT_TABLE = 'e-format-table';
/** @hidden */
var FORMAT_VALUE_LABEL = 'e-format-value-label';
/** @hidden */
var FORMAT_LABEL = 'e-format-label';
/** @hidden */
var INPUT = 'e-input';
/** @hidden */
var FORMAT_VALUE1 = 'e-format-value1';
/** @hidden */
var FORMAT_VALUE2 = 'e-format-value2';
/** @hidden */
var FORMAT_VALUE_SPAN = 'e-format-value-span';
/** @hidden */
var FORMAT_FONT_COLOR = 'e-format-font-color';
/** @hidden */
var FORMAT_BACK_COLOR = 'e-format-back-color';
/** @hidden */
var FORMAT_VALUE_PREVIEW = 'e-format-value-preview';
/** @hidden */
var FORMAT_COLOR_PICKER = 'e-format-color-picker';
/** @hidden */
var FORMAT_DELETE_ICON = 'e-format-delete-icon';
/** @hidden */
var FORMAT_DELETE_BUTTON = 'e-format-delete-button';
/** @hidden */
var SELECTED_COLOR = 'e-selected-color';
/** @hidden */
var DIALOG_HEADER = 'e-dlg-header';
/** @hidden */
var FORMAT_APPLY_BUTTON = 'e-format-apply-button';
/** @hidden */
var FORMAT_CANCEL_BUTTON = 'e-format-cancel-button';
/** @hidden */
var FORMAT_ROUND_BUTTON = 'e-small e-round';
/** @hidden */
var VIRTUALTRACK_DIV = 'e-virtualtrack';
/** @hidden */
var MOVABLECONTENT_DIV = 'e-movablecontent';
/** @hidden */
var FROZENCONTENT_DIV = 'e-frozencontent';
/** @hidden */
var MOVABLEHEADER_DIV = 'e-movableheader';
/** @hidden */

/** @hidden */
var DEFER_APPLY_BUTTON = 'e-defer-apply-button';
/** @hidden */
var DEFER_CANCEL_BUTTON = 'e-defer-cancel-button';
/** @hidden */
var LAYOUT_FOOTER = 'e-layout-footer';
/** @hidden */
var CELL_SELECTED_BGCOLOR = 'e-cellselectionbackground';
/** @hidden */
var SELECTED_BGCOLOR = 'e-selectionbackground';
/** @hidden */
var BUTTON_LAYOUT = 'e-button-layout';
/** @hidden */
var CHECKBOX_LAYOUT = 'e-checkbox-layout';
/** @hidden */
var DEFER_UPDATE_BUTTON = 'e-defer-update-btn';
/** @hidden */
var HEADERCONTENT = 'e-headercontent';
/** @hidden */
var BACK_ICON = 'e-field-list-back-icon';
/** @hidden */
var TITLE_MOBILE_HEADER = 'e-title-mobile-header';
/** @hidden */
var TITLE_MOBILE_CONTENT = 'e-title-mobile-content';

/**
 * Module to render PivotGrid control
 */
/** @hidden */
var Render = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function Render(parent) {
        this.colPos = 0;
        this.lastSpan = 0;
        this.parent = parent;
        this.engine = parent.engineModule;
        this.gridSettings = parent.gridSettings;
        this.formatList = this.getFormatList();
    }
    /** @hidden */
    /* tslint:disable */
    Render.prototype.render = function () {
        var parent = this.parent;
        var engine = this.parent.engineModule;
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
            var e = this.parent.element.querySelector('.e-movablecontent');
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
                var mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
                var mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
                var vtr = mCont.querySelector('.' + VIRTUALTRACK_DIV);
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
    };
    /** @hidden */
    Render.prototype.bindGrid = function (parent, isEmpty) {
        var _this = this;
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
            rowSelected: function (args) {
                parent.renderModule.selected(args);
                parent.trigger(rowSelected, args);
            },
            rowDeselecting: this.gridSettings.rowDeselecting ? this.gridSettings.rowDeselecting.bind(this.parent) : undefined,
            rowDeselected: function (args) {
                parent.renderModule.selected(args);
                parent.trigger(rowDeselected, args);
            },
            cellSelecting: this.gridSettings.cellSelecting ? this.gridSettings.cellSelecting.bind(this.parent) : undefined,
            cellSelected: function (args) {
                parent.renderModule.selected(args);
                parent.trigger(selected, args);
            },
            cellDeselecting: this.gridSettings.cellDeselecting ? this.gridSettings.cellDeselecting.bind(this.parent) : undefined,
            cellDeselected: function (args) {
                parent.renderModule.selected(args);
                parent.trigger(cellDeselected, args);
            },
            resizeStart: this.gridSettings.resizeStart ? this.gridSettings.resizeStart.bind(this.parent) : undefined,
            columnDragStart: this.gridSettings.columnDragStart ? this.gridSettings.columnDragStart.bind(this) : undefined,
            columnDrag: this.gridSettings.columnDrag ? this.gridSettings.columnDrag.bind(this) : undefined,
            columnDrop: this.gridSettings.columnDrop ? this.gridSettings.columnDrop.bind(this) : undefined,
            resizing: this.setGroupWidth.bind(this),
            resizeStop: this.onResizeStop.bind(this),
            queryCellInfo: function (args) {
                parent.renderModule.rowCellBoundEvent(args);
            },
            dataBound: function (args) {
                if (parent.element.querySelector('.e-firstcell')) {
                    if (parent.enableRtl) {
                        parent.element.querySelector('.e-firstcell').style.borderRight = 'none';
                    }
                    else {
                        parent.element.querySelector('.e-firstcell').style.borderLeft = 'none';
                    }
                }
                _this.parent.grid.widthService.setWidthToTable();
                parent.notify(contentReady, {});
            },
            headerCellInfo: function (args) {
                parent.renderModule.columnCellBoundEvent(args);
            },
            excelHeaderQueryCellInfo: function (args) {
                parent.renderModule.excelColumnEvent(args);
            },
            pdfHeaderQueryCellInfo: function (args) {
                parent.renderModule.pdfColumnEvent(args);
            },
            excelQueryCellInfo: function (args) {
                parent.renderModule.excelRowEvent(args);
            },
            pdfQueryCellInfo: function (args) {
                parent.renderModule.pdfRowEvent(args);
            }
        });
    };
    Render.prototype.injectGridModules = function (parent) {
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
    };
    /** @hidden */
    Render.prototype.updateGridSettings = function () {
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
    };
    Render.prototype.appendValueSortIcon = function (cell, tCell, rCnt, cCnt) {
        var vSort = this.parent.dataSource.valueSortSettings;
        var len = (cell.type === 'grand sum' && this.parent.dataSource.values.length === 1) ? 0 :
            this.parent.dataSource.values.length > 1 ? (this.parent.engineModule.headerContent.length - 1) :
                this.parent.dataSource.columns.length === 0 ? 0 : (this.parent.engineModule.headerContent.length - 1);
        var lock = (vSort && vSort.headerText) ? cell.valueSort.levelName === vSort.headerText : cCnt === vSort.columnIndex;
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
                var element = (tCell.querySelector('.e-icon-descending') || tCell.querySelector('.e-icon-ascending'));
                setStyleAttribute(element, { 'padding-top': '12px' });
            }
        }
        return tCell;
    };
    Render.prototype.onResizeStop = function (args) {
        var column = args.column.field === '0.formattedText' ? '0.formattedText' :
            args.column.customAttributes.cell.valueSort.levelName;
        this.parent.resizeInfo[column] =
            Number(args.column.width.toString().split('px')[0]);
        this.setGroupWidth(args);
    };
    Render.prototype.setGroupWidth = function (args) {
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.element.querySelector('.' + GROUPING_BAR_CLASS)) {
            this.parent.groupingBarModule.refreshUI();
            if (this.parent.element.querySelector('.e-group-row').offsetWidth < 245 && !this.parent.firstColWidth) {
                args.cancel = true;
                var gridColumn = this.parent.grid.columns;
                var resColWidth = (this.parent.isAdaptive ? 180 : 250);
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
    };
    /* tslint:disable */
    Render.prototype.selected = function (args) {
        var _this = this;
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(function () {
            var pivotArgs = { selectedCellsInfo: [], pivotValues: _this.parent.pivotValues };
            var selectedElements = _this.parent.element.querySelectorAll('.' + CELL_SELECTED_BGCOLOR);
            selectedElements = selectedElements.length === 0 ? _this.parent.element.querySelectorAll('.' + SELECTED_BGCOLOR) :
                selectedElements;
            for (var _i = 0, selectedElements_1 = selectedElements; _i < selectedElements_1.length; _i++) {
                var element = selectedElements_1[_i];
                var colIndex = Number(element.getAttribute('aria-colindex'));
                var rowIndex = Number(element.getAttribute('index'));
                var cell = _this.engine.pivotValues[rowIndex][colIndex];
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
            _this.parent.trigger(cellSelected, pivotArgs);
        }, 300);
    };
    Render.prototype.rowCellBoundEvent = function (args) {
        var tCell = args.cell;
        if (tCell && this.engine) {
            var customClass = this.parent.hyperlinkSettings.cssClass;
            tCell.setAttribute('index', (Number(tCell.getAttribute('index')) + this.engine.headerContent.length).toString());
            var cell = args.data[0];
            if (tCell.getAttribute('aria-colindex') === '0') {
                var isValueCell = cell.type && cell.type === 'value';
                tCell.innerText = '';
                var level = cell.level ? cell.level : (isValueCell ? (this.lastSpan + 1) : 0);
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
                var fieldName = void 0;
                if ((this.parent.dataSource.rows.length > 0 &&
                    (cell.valueSort ? Object.keys(cell.valueSort).length > 0 : true))) {
                    fieldName = level > -1 ? this.parent.dataSource.rows[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                var localizedText = cell.formattedText;
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
                var vSort = this.parent.pivotView.dataSource.valueSortSettings;
                if (vSort && vSort.headerText && this.parent.dataSource.valueAxis === 'row'
                    && this.parent.pivotValues[Number(tCell.getAttribute('index'))][0].valueSort.levelName) {
                    if (this.parent.pivotValues[Number(tCell.getAttribute('index'))][0].valueSort.levelName
                        === vSort.headerText) {
                        var style = (tCell.querySelector('.e-expand') || tCell.querySelector('.e-collapse')) ? 'padding-top: 18px' :
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
                var innerText = tCell.innerText.toString() === '0' ? '' : tCell.innerText;
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
    };
    Render.prototype.columnCellBoundEvent = function (args) {
        if (args.cell.column && args.cell.column.customAttributes) {
            var cell = args.cell.column.customAttributes.cell;
            var tCell = args.node;
            if (cell) {
                var customClass = this.parent.hyperlinkSettings.cssClass;
                var level = cell.level ? cell.level : 0;
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
                var fieldName = void 0;
                if (!(this.parent.dataSource.values && this.parent.dataSource.valueAxis === 'column' && this.parent.dataSource.values.length > 1 &&
                    (cell.rowIndex === this.engine.headerContent.length - 1)) && this.parent.dataSource.columns &&
                    this.parent.dataSource.columns.length > 0) {
                    fieldName = level > -1 ? this.parent.dataSource.columns[level].name : '';
                    tCell.setAttribute('fieldname', fieldName);
                }
                if (cell.type) {
                    tCell.classList.add(cell.type === 'grand sum' ? 'e-gtot' : 'e-stot');
                    var localizedText = cell.type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
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
                        var innerText = tCell.querySelector('.e-stackedheadercelldiv').innerText;
                        tCell.querySelector('.e-stackedheadercelldiv').innerHTML = '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                    else if (tCell.querySelector('.e-headertext')) {
                        var innerText = tCell.querySelector('.e-headertext').innerText;
                        tCell.querySelector('.e-headertext').innerHTML = '<a data-url="' + innerText + '" class="e-hyperlinkcell ' + customClass + '">' + innerText + '</a>';
                    }
                }
                if (cell.hasChild === true) {
                    var hdrdiv = tCell.querySelector('.e-headercelldiv');
                    if (hdrdiv) {
                        hdrdiv.style.height = 'auto';
                        hdrdiv.style.lineHeight = 'normal';
                    }
                    var div = createElement('div', {
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
    };
    Render.prototype.onHyperCellClick = function (e) {
        var cell = e.target.parentElement.parentElement;
        cell = (cell.className.indexOf('e-headercelldiv') > -1 ? cell.parentElement : cell);
        var args = {
            currentCell: cell,
            data: this.engine.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('aria-colindex'))],
            cancel: true
        };
        this.parent.trigger(hyperlinkCellClick, args);
        if (!args.cancel) {
            window.open(e.target.getAttribute('data-url'));
        }
    };
    Render.prototype.getRowStartPos = function () {
        var pivotValues = this.parent.pivotValues;
        var rowPos;
        for (var rCnt = 0; rCnt < pivotValues.length; rCnt++) {
            if (pivotValues[rCnt] && pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row') {
                rowPos = rCnt;
                break;
            }
        }
        return rowPos;
    };
    Render.prototype.frameDataSource = function (type) {
        var dataContent = [];
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
            if ((this.parent.enableValueSorting) || !this.engine.isEngineUpdated) {
                var rowCnt = 0;
                var pivotValues = this.parent.pivotValues;
                var start = type === 'value' ? this.rowStartPos : 0;
                var end = type === 'value' ? pivotValues.length : this.rowStartPos;
                for (var rCnt = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {};
                        for (var cCnt = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
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
    };
    Render.prototype.frameEmptyData = function () {
        var dataContent = [{
                0: { formattedText: this.parent.localeObj.getConstant('grandTotal') },
                1: { formattedText: this.parent.localeObj.getConstant('emptyData') }
            }];
        return dataContent;
    };
    Render.prototype.calculateColWidth = function (colCount) {
        var parWidth = isNaN(this.parent.width) ? (this.parent.width.toString().indexOf('%') > -1 ?
            ((parseFloat(this.parent.width.toString()) / 100) * this.parent.element.offsetWidth) : this.parent.element.offsetWidth) :
            Number(this.parent.width);
        var resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) : (this.parent.isAdaptive ? 140 : 200);
        if (this.parent.showGroupingBar && this.parent.groupingBarModule && this.parent.grid && this.parent.dataSource.rows.length > 0) {
            parWidth = parWidth - (this.gridSettings.columnWidth > resColWidth ? this.gridSettings.columnWidth : resColWidth);
            colCount = colCount - 1;
        }
        var colWidth = (colCount * this.gridSettings.columnWidth + 78) < parWidth ? (parWidth / colCount) : this.gridSettings.columnWidth;
        return colWidth;
    };
    Render.prototype.calculateGridWidth = function () {
        var parWidth = this.parent.width;
        if (this.parent.width === 'auto' && this.parent.element.offsetWidth < this.parent.totColWidth) {
            parWidth = this.parent.element.offsetWidth;
        }
        return parWidth;
    };
    Render.prototype.frameStackedHeaders = function () {
        var integrateModel = [];
        if (this.parent.dataSource.values.length > 0 && !this.engine.isEmptyData) {
            var headerCnt = this.engine.headerContent.length;
            var headerSplit = [];
            var splitPos = [];
            var colWidth = this.calculateColWidth(this.engine.pivotValues[0].length);
            do {
                var columnModel = [];
                var actualCnt = 0;
                headerCnt--;
                var colField = this.engine.headerContent[headerCnt];
                if (colField) {
                    for (var cCnt = 0; cCnt < Object.keys(colField).length + (colField[0] ? 0 : 1); cCnt++) {
                        var colSpan = (colField[cCnt] && colField[cCnt].colSpan) ? colField[cCnt].colSpan : 1;
                        var rowSpan = (colField[cCnt] && colField[cCnt].rowSpan) ? colField[cCnt].rowSpan : 1;
                        var formattedText = colField[cCnt] ? (colField[cCnt].type === 'grand sum' ? this.parent.localeObj.getConstant('grandTotal') :
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
                            var tmpSpan = colSpan;
                            var innerModel = [];
                            var innerPos = cCnt;
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
            var resColWidth = (this.parent.showGroupingBar && this.parent.groupingBarModule) ? (this.parent.isAdaptive ? 180 : 250) : (this.parent.isAdaptive ? 140 : 200);
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
    };
    /** @hidden */
    Render.prototype.setSavedWidth = function (column, width) {
        width = this.parent.resizeInfo[column] ? this.parent.resizeInfo[column] : width;
        return width;
    };
    Render.prototype.frameEmptyColumns = function () {
        var columns = [];
        var colWidth = this.calculateColWidth(2);
        columns.push({ field: '0.formattedText', headerText: '', minWidth: 30, width: colWidth });
        columns.push({ field: '1.formattedText', headerText: this.parent.localeObj.getConstant('grandTotal'), minWidth: 30, width: colWidth });
        return columns;
    };
    /** @hidden */
    Render.prototype.getFormatList = function () {
        var formatArray = [];
        for (var vCnt = 0; vCnt < this.parent.dataSource.values.length; vCnt++) {
            var field = this.parent.dataSource.values[vCnt];
            if (this.parent.dataSource.formatSettings.length > 0) {
                var format = '';
                for (var fCnt = 0; fCnt < this.parent.dataSource.formatSettings.length; fCnt++) {
                    var formatSettings = this.parent.dataSource.formatSettings[fCnt];
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
    };
    Render.prototype.excelColumnEvent = function (args) {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(excelHeaderQueryCellInfo, args);
    };
    Render.prototype.pdfColumnEvent = function (args) {
        args = this.exportHeaderEvent(args);
        this.parent.trigger(pdfHeaderQueryCellInfo, args);
    };
    Render.prototype.excelRowEvent = function (args) {
        if (args.column.field === '0.formattedText') {
            var isValueCell = args.data[0].type === 'value';
            var level = isValueCell ? (this.lastSpan + 1) : args.data[0].level;
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
    };
    /* tslint:disable:no-any */
    Render.prototype.pdfRowEvent = function (args) {
        args = this.exportContentEvent(args);
        if (args.column.field === '0.formattedText') {
            var isValueCell = args.data[0].type === 'value';
            var level = isValueCell ? (this.lastSpan + 1) : args.data[0].level;
            args.style = { paragraphIndent: level * 10 };
            this.lastSpan = isValueCell ? this.lastSpan : level;
        }
        this.parent.trigger(pdfQueryCellInfo, args);
    };
    Render.prototype.exportHeaderEvent = function (args) {
        var rowSpan = 1;
        if (args.gridCell.column.customAttributes) {
            var cell = args.gridCell.column.customAttributes.cell;
            rowSpan = cell.rowSpan ? cell.rowSpan : 1;
        }
        else {
            rowSpan = Object.keys(this.engine.headerContent).length;
        }
        if (args.cell.rowSpan && args.cell.rowSpan !== rowSpan && rowSpan > -1) {
            args.cell.rowSpan = rowSpan;
        }
        return args;
    };
    Render.prototype.exportContentEvent = function (args) {
        if (args.value === '0') {
            args.value = '';
        }
        args.value = args.data[Number(args.column.field.split('.formattedText')[0])].type === 'grand sum' ?
            this.parent.localeObj.getConstant('grandTotal') : args.value;
        return args;
    };
    Render.prototype.unWireEvents = function (cell) {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.remove(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick);
        }
        else {
            return;
        }
    };
    Render.prototype.wireEvents = function (cell) {
        if (cell.querySelector('.e-hyperlinkcell')) {
            EventHandler.add(cell.querySelector('.e-hyperlinkcell'), this.parent.isAdaptive ? 'touchend' : 'click', this.onHyperCellClick, this);
        }
        else {
            return;
        }
    };
    return Render;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the fields in dataSource.
 */
var FieldOptions = /** @__PURE__ @class */ (function (_super) {
    __extends$1(FieldOptions, _super);
    function FieldOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FieldOptions;
}(ChildProperty));
var FieldListFieldOptions = /** @__PURE__ @class */ (function (_super) {
    __extends$1(FieldListFieldOptions, _super);
    function FieldListFieldOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FieldListFieldOptions;
}(FieldOptions));
/**
 * Configures the style settings.
 */
var Style = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Style, _super);
    function Style() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Style;
}(ChildProperty));
/**
 * Configures the filter settings.
 */
var Filter = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Filter, _super);
    function Filter() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Filter;
}(ChildProperty));
/**
 * Configures the conditional format settings.
 */
var ConditionalFormatSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(ConditionalFormatSettings, _super);
    function ConditionalFormatSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ConditionalFormatSettings;
}(ChildProperty));
/**
 * Configures the sort settings.
 */
var Sort = /** @__PURE__ @class */ (function (_super) {
    __extends$1(Sort, _super);
    function Sort() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property()
    ], Sort.prototype, "name", void 0);
    __decorate$1([
        Property('Ascending')
    ], Sort.prototype, "order", void 0);
    return Sort;
}(ChildProperty));
/**
 * Configures the format settings of value fields.
 */
var FormatSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(FormatSettings, _super);
    function FormatSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return FormatSettings;
}(ChildProperty));
/**
 * Configures the calculatedfields settings.
 */
var CalculatedFieldSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(CalculatedFieldSettings, _super);
    function CalculatedFieldSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property()
    ], CalculatedFieldSettings.prototype, "name", void 0);
    __decorate$1([
        Property()
    ], CalculatedFieldSettings.prototype, "formula", void 0);
    return CalculatedFieldSettings;
}(ChildProperty));
/**
 * Configures drilled state of field members.
 */
var DrillOptions = /** @__PURE__ @class */ (function (_super) {
    __extends$1(DrillOptions, _super);
    function DrillOptions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        Property()
    ], DrillOptions.prototype, "name", void 0);
    __decorate$1([
        Property()
    ], DrillOptions.prototype, "items", void 0);
    return DrillOptions;
}(ChildProperty));
/**
 * Configures value sort settings.
 */
var ValueSortSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$1(ValueSortSettings, _super);
    function ValueSortSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ValueSortSettings;
}(ChildProperty));
/**
 * Configures the settings of dataSource.
 */
var DataSource = /** @__PURE__ @class */ (function (_super) {
    __extends$1(DataSource, _super);
    function DataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return DataSource;
}(ChildProperty));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 *  Represents Pivot widget model class.
 */
var GridSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(GridSettings, _super);
    function GridSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return GridSettings;
}(ChildProperty));

/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
var ExcelExport$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the PivotGrid Excel Export module.
     * @hidden
     */
    function ExcelExport$$1(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExcelExport$$1.prototype.getModuleName = function () {
        return 'excelExport';
    };
    /**
     * Method to perform excel export.
     * @hidden
     */
    ExcelExport$$1.prototype.exportToExcel = function (type) {
        /** Event trigerring */
        if (this.parent.enableVirtualization) {
            var pageSettings = this.parent.engineModule.pageSettings;
            this.parent.engineModule.pageSettings = null;
            this.parent.engineModule.generateGridData(this.parent.dataSource);
            this.parent.engineModule.pageSettings = pageSettings;
        }
        var args = {
            fileName: 'default', header: '', footer: '', dataCollections: [this.parent.engineModule.pivotValues]
        };
        this.parent.trigger(beforeExport, args);
        var fileName = args.fileName;
        var dataCollections = args.dataCollections;
        /** Fill data and export */
        /* tslint:disable-next-line:no-any */
        var workSheets = [];
        for (var dataColl = 0; dataColl < dataCollections.length; dataColl++) {
            var pivotValues = dataCollections[dataColl];
            var colLen = 0;
            var rowLen = pivotValues.length;
            var actualrCnt = 0;
            var formatList = this.parent.renderModule.getFormatList();
            var rows = [];
            var maxLevel = 0;
            for (var rCnt = 0; rCnt < rowLen; rCnt++) {
                if (pivotValues[rCnt]) {
                    actualrCnt++;
                    colLen = pivotValues[rCnt].length;
                    var cells = [];
                    for (var cCnt = 0; cCnt < colLen; cCnt++) {
                        if (pivotValues[rCnt][cCnt]) {
                            var pivotCell = pivotValues[rCnt][cCnt];
                            if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                var cellValue = pivotCell.axis === 'value' ? pivotCell.value : pivotCell.formattedText;
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
            var columns = [];
            for (var cCnt = 0; cCnt < colLen; cCnt++) {
                columns.push({ index: cCnt + 1, width: 100 });
            }
            if (maxLevel > 0) {
                columns[0].width = 100 + (maxLevel * 20);
            }
            workSheets.push({ columns: columns, rows: rows });
        }
        var book = new Workbook({ worksheets: workSheets }, type === 'Excel' ? 'xlsx' : 'csv');
        book.save(fileName + (type === 'Excel' ? '.xlsx' : '.csv'));
    };
    return ExcelExport$$1;
}());

/**
 * @hidden
 * `PDFExport` module is used to handle the PDF export action.
 */
var PDFExport = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the PivotGrid PDF Export module.
     * @hidden
     */
    function PDFExport(parent) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    PDFExport.prototype.getModuleName = function () {
        return 'pdfExport';
    };
    /**
     * Method to perform pdf export.
     * @hidden
     */
    PDFExport.prototype.exportToPDF = function () {
        var eventParams = this.applyEvent();
        /** Fill data and export */
        var dataCollIndex = 0;
        var gridResult;
        var pivotValues = eventParams.args.dataCollections[dataCollIndex];
        var colLength = pivotValues && pivotValues.length > 0 ? pivotValues[0].length : 0;
        var integratedCnt = 0;
        do {
            var pdfGrid = new PdfGrid();
            if (pivotValues && pivotValues.length > 0) {
                pdfGrid.columns.add(pivotValues[0].length - integratedCnt >= 6 ? 6 : pivotValues[0].length - integratedCnt);
                var rowLen = pivotValues.length;
                var actualrCnt = 0;
                var maxLevel = 0;
                for (var rCnt = 0; rCnt < rowLen; rCnt++) {
                    if (pivotValues[rCnt]) {
                        var isColHeader = !(pivotValues[rCnt][0] && pivotValues[rCnt][0].axis === 'row');
                        var colLen = pivotValues[rCnt].length > (integratedCnt + 6) ? (integratedCnt + 6) :
                            pivotValues[rCnt].length;
                        if (isColHeader) {
                            pdfGrid.headers.add(1);
                        }
                        var pdfGridRow = !isColHeader ? pdfGrid.rows.addRow() : pdfGrid.headers.getHeader(actualrCnt);
                        var localCnt = 0;
                        var isEmptyRow = true;
                        for (var cCnt = integratedCnt; cCnt < colLen; cCnt++) {
                            var isValueCell = false;
                            if (pivotValues[rCnt][cCnt]) {
                                var pivotCell = pivotValues[rCnt][cCnt];
                                if (!(pivotCell.level === -1 && !pivotCell.rowSpan)) {
                                    var cellValue = pivotCell.formattedText;
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
                            var stringFormat = new PdfStringFormat();
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
            var layout = new PdfLayoutFormat();
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
    };
    PDFExport.prototype.applyStyle = function (pdfGridRow, pivotCell, localCnt) {
        var color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.backgroundColor);
        var brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.backgroundBrush = brush;
        var size = Number(pivotCell.style.fontSize.split('px')[0]);
        var font = new PdfStandardFont(PdfFontFamily.TimesRoman, size, PdfFontStyle.Regular);
        pdfGridRow.cells.getCell(localCnt).style.font = font;
        color = this.parent.conditionalFormattingModule.hexToRgb(pivotCell.style.color);
        brush = new PdfSolidBrush(new PdfColor(color.r, color.g, color.b));
        pdfGridRow.cells.getCell(localCnt).style.textBrush = brush;
        return pdfGridRow;
    };
    PDFExport.prototype.applyEvent = function () {
        /** Event trigerring */
        if (this.parent.enableVirtualization) {
            var pageSettings = this.parent.engineModule.pageSettings;
            this.parent.engineModule.pageSettings = null;
            this.parent.engineModule.generateGridData(this.parent.dataSource);
            this.parent.engineModule.pageSettings = pageSettings;
        }
        var args = {
            fileName: 'default', header: '', footer: '', dataCollections: [this.parent.engineModule.pivotValues]
        };
        this.parent.trigger(beforeExport, args);
        var header = args.header;
        var footer = args.footer;
        var document = new PdfDocument();
        var page = document.pages.add();
        /** Header and Footer to be set */
        var font = new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Regular);
        var brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        var pen = new PdfPen(new PdfColor(0, 0, 0), .5);
        var headerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        headerTemplate.graphics.drawString(header, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.top = headerTemplate;
        var footerTemplate = new PdfPageTemplateElement(new RectangleF(0, 0, page.graphics.clientSize.width, 20));
        footerTemplate.graphics.drawString(footer, font, pen, brush, 0, 0, new PdfStringFormat(PdfTextAlignment.Center));
        document.template.bottom = footerTemplate;
        return { document: document, page: page, args: args };
    };
    return PDFExport;
}());

/**
 * PivotView Keyboard interaction
 */
/** @hidden */
var KeyboardInteraction = /** @__PURE__ @class */ (function () {
    /**
     * Constructor
     */
    function KeyboardInteraction(parent) {
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
    KeyboardInteraction.prototype.keyActionHandler = function (e) {
        switch (e.action) {
            case 'tab':
                this.processTab(e);
                break;
            case 'enter':
                this.processEnter(e);
                break;
        }
    };
    KeyboardInteraction.prototype.getNextButton = function (target) {
        var allPivotButtons = [].slice.call(this.parent.element.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
        var nextElement = target;
        if (this.parent.grid.element.querySelector('.' + PIVOT_BUTTON_CLASS)) {
            var len = allPivotButtons.length;
            for (var i = 0; i < len; i++) {
                if (allPivotButtons[i].getAttribute('data-uid') === target.getAttribute('data-uid')) {
                    nextElement = allPivotButtons[i + 1] ? allPivotButtons[i + 1] : nextElement;
                    break;
                }
            }
        }
        return nextElement;
    };
    KeyboardInteraction.prototype.processTab = function (e) {
        var target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS)) {
            var gridFocus = this.parent.grid.serviceLocator.getService('focus');
            var nextButton = this.getNextButton(target);
            if (nextButton.getAttribute('data-uid') !== target.getAttribute('data-uid')) {
                gridFocus.currentInfo.skipAction = true;
                nextButton.focus();
            }
            else {
                gridFocus.focus();
                var element = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
            e.preventDefault();
            return;
        }
        else if (!this.parent.showGroupingBar && this.parent.showFieldList) {
            if (target && closest(target, '.' + TOGGLE_FIELD_LIST_CLASS)) {
                var gridFocus = this.parent.grid.serviceLocator.getService('focus');
                gridFocus.focus();
                var element = gridFocus.getFocusedElement();
                addClass([element], ['e-focused', 'e-focus']);
                element.setAttribute('tabindex', '0');
            }
        }
        else if (!this.parent.showGroupingBar && !this.parent.showFieldList) {
            if (target && closest(target, '.' + PIVOT_VIEW_CLASS)) {
                var gridElement = closest(target, '.' + PIVOT_VIEW_CLASS);
                var gridFocus = this.parent.grid.serviceLocator.getService('focus');
                var rows = [].slice.call(gridElement.getElementsByTagName('tr'));
                if (target.innerHTML === (rows[rows.length - 1]).lastChild.innerHTML) {
                    gridFocus.currentInfo.skipAction = true;
                }
                else {
                    gridFocus.focus();
                    var element = gridFocus.getFocusedElement();
                    addClass([element], ['e-focused', 'e-focus']);
                    element.setAttribute('tabindex', '0');
                }
            }
        }
    };
    KeyboardInteraction.prototype.processEnter = function (e) {
        var target = e.target;
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
    };
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    KeyboardInteraction.prototype.destroy = function () {
        if (this.pivotViewKeyboardModule) {
            this.pivotViewKeyboardModule.destroy();
        }
        else {
            return;
        }
    };
    return KeyboardInteraction;
}());

/**
 * Module to render Pivot button
 */
/** @hidden */
var PivotContextMenu = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function PivotContextMenu(parent) {
        this.parent = parent;
        this.parent.contextMenuModule = this;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    PivotContextMenu.prototype.render = function () {
        this.renderContextMenu();
    };
    PivotContextMenu.prototype.renderContextMenu = function () {
        var menuItems = [
            { text: this.parent.localeObj.getConstant('addToFilter'), id: 'Context_Filters' },
            { text: this.parent.localeObj.getConstant('addToRow'), id: 'Context_Rows' },
            { text: this.parent.localeObj.getConstant('addToColumn'), id: 'Context_Columns' },
            { text: this.parent.localeObj.getConstant('addToValue'), id: 'Context_Values' }
        ];
        var menuOptions = {
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
    };
    PivotContextMenu.prototype.onBeforeMenuOpen = function (args) {
        var items = [].slice.call(args.element.querySelectorAll('li'));
        var fieldType = this.fieldElement.querySelector('.' + PIVOT_BUTTON_CONTENT_CLASS).getAttribute('data-type');
        removeClass(items, MENU_DISABLE);
        if (fieldType === 'CalculatedField') {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item.textContent !== this.parent.localeObj.getConstant('addToValue')) {
                    addClass([item], MENU_DISABLE);
                }
            }
        }
    };
    PivotContextMenu.prototype.onSelectContextMenu = function (menu) {
        if (menu.element.textContent !== null) {
            var fieldName = this.fieldElement.getAttribute('data-uid');
            var dropClass = menu.item.id.replace('Context_', '').toLowerCase();
            this.parent.pivotCommon.dataSourceUpdate.updateDataSource(fieldName, dropClass, -1);
            this.parent.updateDataSource(true);
            this.fieldElement = undefined;
        }
    };
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    PivotContextMenu.prototype.destroy = function () {
        if (!this.parent.isDestroyed) {
            return;
        }
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
        else {
            return;
        }
    };
    return PivotContextMenu;
}());

/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
var VirtualScroll$1 = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for PivotView scrolling.
     * @hidden
     */
    function VirtualScroll$$1(parent) {
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
    VirtualScroll$$1.prototype.getModuleName = function () {
        return 'virtualscroll';
    };
    VirtualScroll$$1.prototype.addInternalEvents = function () {
        this.parent.on(contentReady, this.wireEvents, this);
    };
    VirtualScroll$$1.prototype.wireEvents = function () {
        var mCont = this.parent.element.querySelector('.' + MOVABLECONTENT_DIV);
        var fCont = this.parent.element.querySelector('.' + FROZENCONTENT_DIV);
        var mHdr = this.parent.element.querySelector('.' + MOVABLEHEADER_DIV);
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
    };
    VirtualScroll$$1.prototype.onWheelScroll = function (mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            var top = element.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (_this.frozenPreviousValues.top === top) {
                return;
            }
            e.preventDefault();
            fCont.scrollTop = top;
            element.scrollTop = top;
            _this.frozenPreviousValues.top = top;
            _this.eventType = e.type;
        };
    };
    VirtualScroll$$1.prototype.onTouchScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        var element = mCont;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var pageXY = _this.getPointXY(e);
            var top = element.scrollTop + (_this.pageXY.y - pageXY.y);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            if (_this.parent.element.querySelector('.' + HEADERCONTENT).contains(e.target)) {
                if (_this.frozenPreviousValues.left === left || left < 0) {
                    return;
                }
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                _this.pageXY.x = pageXY.x;
                _this.frozenPreviousValues.left = left;
            }
            else {
                if (_this.frozenPreviousValues.top === top || top < 0) {
                    return;
                }
                fCont.scrollTop = top;
                element.scrollTop = top;
                _this.pageXY.y = pageXY.y;
                _this.frozenPreviousValues.top = top;
            }
            _this.eventType = e.type;
        };
    };
    VirtualScroll$$1.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    VirtualScroll$$1.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (e.touches && e.touches.length) {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        else {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        return pageXY;
    };
    VirtualScroll$$1.prototype.update = function (mHdr, mCont, top, left, e) {
        if (this.direction === 'vertical') {
            var rowValues = this.parent.dataSource.valueAxis === 'row' ? this.parent.dataSource.values.length : 1;
            var exactSize = (this.parent.pageSettings.rowSize * rowValues * this.parent.gridSettings.rowHeight);
            var section = Math.ceil(top / exactSize);
            if (this.parent.scrollPosObject.vertical === section) {
                hideSpinner(this.parent.element);
                return;
            }
            showSpinner(this.parent.element);
            this.parent.scrollPosObject.vertical = section;
            this.parent.engineModule.pageSettings.rowCurrentPage = section > 1 ? section : 1;
            this.parent.engineModule.generateGridData(this.parent.dataSource, this.parent.engineModule.headerCollection);
            this.parent.pivotValues = this.parent.engineModule.pivotValues;
            var exactPage = Math.ceil(this.parent.engineModule.rowStartPos / (this.parent.pageSettings.rowSize * rowValues));
            var pos = exactSize * exactPage -
                (this.parent.engineModule.rowFirstLvl * rowValues * this.parent.gridSettings.rowHeight);
            this.parent.scrollPosObject.verticalSection = pos;
        }
        else {
            var colValues = this.parent.dataSource.valueAxis === 'column' ? this.parent.dataSource.values.length : 1;
            var exactSize = (this.parent.pageSettings.columnSize *
                colValues * this.parent.gridSettings.columnWidth);
            var section = Math.ceil(left / exactSize);
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
            var exactPage = Math.ceil(this.parent.engineModule.colStartPos / (this.parent.pageSettings.columnSize * colValues));
            // let pos: number = isLastPage ?
            //     ((left + mHdr.clientWidth) - ((mHdr.querySelector('.' + cls.TABLE) as HTMLElement).offsetWidth)) :
            //     exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
            //         colValues * this.parent.gridSettings.columnWidth);
            var pos = exactSize * exactPage - (this.parent.engineModule.colFirstLvl *
                colValues * this.parent.gridSettings.columnWidth);
            this.parent.scrollPosObject.horizontalSection = pos;
        }
    };
    VirtualScroll$$1.prototype.common = function (mHdr, mCont, fCont) {
        var _this = this;
        return function (e) {
            _this.update(mHdr, mCont, mCont.scrollTop, mCont.scrollLeft, e);
        };
    };
    VirtualScroll$$1.prototype.onHorizondalScroll = function (mHdr, mCont, fCont) {
        var _this = this;
        /* tslint:disable-next-line */
        var timeOutObj;
        return function (e) {
            var left = mCont.scrollLeft;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(function () {
                    left = e.type === 'touchmove' ? mCont.scrollLeft : left;
                    _this.update(mHdr, mCont, mCont.scrollTop, left, e);
                }, 300);
            }
            if (_this.previousValues.left === left) {
                fCont.scrollTop = mCont.scrollTop;
                return;
            }
            _this.direction = 'horizondal';
            var excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                -(_this.parent.scrollPosObject.horizontalSection - left) : ((left + mHdr.offsetWidth) -
                (_this.parent.scrollPosObject.horizontalSection + mCont.querySelector('.e-table').offsetWidth));
            if (_this.parent.scrollPosObject.horizontalSection > left ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (left > mHdr.clientWidth) {
                    if (_this.parent.scrollPosObject.left < 1) {
                        _this.parent.scrollPosObject.left = mHdr.clientWidth;
                    }
                    _this.parent.scrollPosObject.left = _this.parent.scrollPosObject.left - 50;
                    excessMove = _this.parent.scrollPosObject.horizontalSection > left ?
                        (excessMove - _this.parent.scrollPosObject.left) : (excessMove + _this.parent.scrollPosObject.left);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.horizontalSection;
                }
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + (_this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' +
                        _this.parent.scrollPosObject.verticalSection + 'px)'
                });
                setStyleAttribute(mHdr.querySelector('.e-table'), {
                    transform: 'translate(' + (_this.parent.scrollPosObject.horizontalSection + excessMove) + 'px,' + 0 + 'px)'
                });
                _this.parent.scrollPosObject.horizontalSection = _this.parent.scrollPosObject.horizontalSection + excessMove;
            }
            _this.previousValues.left = left;
            _this.frozenPreviousValues.left = left;
            _this.eventType = '';
            mHdr.scrollLeft = mCont.scrollLeft;
        };
    };
    VirtualScroll$$1.prototype.onVerticalScroll = function (fCont, mCont) {
        var _this = this;
        /* tslint:disable-next-line */
        var timeOutObj;
        return function (e) {
            var top = mCont.scrollTop;
            if (e.type === 'wheel' || e.type === 'touchmove' || _this.eventType === 'wheel' || _this.eventType === 'touchmove') {
                clearTimeout(timeOutObj);
                /* tslint:disable */
                timeOutObj = setTimeout(function () {
                    _this.update(null, mCont, mCont.scrollTop, mCont.scrollLeft, e);
                }, 300);
            }
            if (_this.previousValues.top === top) {
                return;
            }
            _this.direction = 'vertical';
            var excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                -(_this.parent.scrollPosObject.verticalSection - top) : ((top + fCont.clientHeight) -
                (_this.parent.scrollPosObject.verticalSection + fCont.querySelector('.e-table').offsetHeight));
            if (_this.parent.scrollPosObject.verticalSection > top ? true : excessMove > 1) {
                //  showSpinner(this.parent.element);
                if (top > fCont.clientHeight) {
                    if (_this.parent.scrollPosObject.top < 1) {
                        _this.parent.scrollPosObject.top = fCont.clientHeight;
                    }
                    _this.parent.scrollPosObject.top = _this.parent.scrollPosObject.top - 50;
                    excessMove = _this.parent.scrollPosObject.verticalSection > top ?
                        (excessMove - _this.parent.scrollPosObject.top) : (excessMove + _this.parent.scrollPosObject.top);
                }
                else {
                    excessMove = -_this.parent.scrollPosObject.verticalSection;
                }
                setStyleAttribute(fCont.querySelector('.e-table'), {
                    transform: 'translate(' + 0 + 'px,' + (_this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                setStyleAttribute(mCont.querySelector('.e-table'), {
                    transform: 'translate(' + _this.parent.scrollPosObject.horizontalSection + 'px,' +
                        (_this.parent.scrollPosObject.verticalSection + excessMove) + 'px)'
                });
                _this.parent.scrollPosObject.verticalSection = _this.parent.scrollPosObject.verticalSection + excessMove;
            }
            _this.previousValues.top = top;
            _this.frozenPreviousValues.top = top;
            _this.eventType = '';
            fCont.scrollTop = mCont.scrollTop;
            mCont.scrollTop = fCont.scrollTop;
        };
    };
    /**
     * @hidden
     */
    VirtualScroll$$1.prototype.removeInternalEvents = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(contentReady, this.wireEvents);
    };
    /**
     * To destroy the virtualscrolling event listener
     * @return {void}
     * @hidden
     */
    VirtualScroll$$1.prototype.destroy = function () {
        this.removeInternalEvents();
    };
    return VirtualScroll$$1;
}());

/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
/** @hidden */
var DrillThroughDialog = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function DrillThroughDialog(parent) {
        this.isUpdated = false;
        this.gridIndexObjects = {};
        this.parent = parent;
    }
    /** @hidden */
    DrillThroughDialog.prototype.showDrillThroughDialog = function (eventArgs) {
        var _this = this;
        this.removeDrillThroughDialog();
        var drillThroughDialog = createElement('div', {
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
            beforeOpen: function () {
                /* tslint:disable:align */
                _this.drillThroughGrid.setProperties({
                    dataSource: _this.parent.editSettings.allowEditing ?
                        _this.dataWithPrimarykey(eventArgs) : eventArgs.rawData, height: 300
                }, true);
                /* tslint:enable:align */
                _this.drillThroughGrid.enableVirtualization = !_this.parent.editSettings.allowEditing;
            },
            beforeClose: function () {
                if (_this.parent.editSettings.allowEditing && _this.isUpdated) {
                    var count = Object.keys(_this.gridIndexObjects).length;
                    var addItems = [];
                    /* tslint:disable:no-string-literal */
                    for (var _i = 0, _a = _this.drillThroughGrid.dataSource; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (isNullOrUndefined(item['__index']) || item['__index'] === '') {
                            for (var _b = 0, _c = _this.parent.engineModule.fields; _b < _c.length; _b++) {
                                var field = _c[_b];
                                if (isNullOrUndefined(item[field])) {
                                    delete item[field];
                                }
                            }
                            delete item['__index'];
                            addItems.push(item);
                        }
                        else if (count > 0) {
                            delete _this.gridIndexObjects[item['__index'].toString()];
                            count--;
                        }
                    }
                    count = 0;
                    var items = [];
                    for (var _d = 0, _e = _this.parent.dataSource.data; _d < _e.length; _d++) {
                        var item = _e[_d];
                        delete item['__index'];
                        if (_this.gridIndexObjects[count.toString()] === undefined) {
                            items.push(item);
                        }
                        count++;
                    }
                    /* tslint:enable:no-string-literal */
                    items = items.concat(addItems);
                    _this.parent.setProperties({ dataSource: { data: items } }, true);
                    _this.parent.engineModule.updateGridData(_this.parent.dataSource);
                    _this.parent.pivotValues = _this.parent.engineModule.pivotValues;
                }
                _this.isUpdated = false;
                _this.gridIndexObjects = {};
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
    };
    DrillThroughDialog.prototype.removeDrillThroughDialog = function () {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        var dialogElement = document.getElementById(this.parent.element.id + '_drillthrough');
        if (dialogElement) {
            remove(dialogElement);
        }
        if (document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg')) {
            remove(document.getElementById(this.parent.element.id + '_drillthroughgrid_ccdlg'));
        }
    };
    /* tslint:disable:max-func-body-length */
    DrillThroughDialog.prototype.createDrillThroughGrid = function (eventArgs) {
        var drillThroughBody = createElement('div', { id: this.parent.element.id + '_drillthroughbody', className: DRILLTHROUGH_BODY_CLASS });
        var drillThroughBodyHeader = createElement('div', {
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
            var measure = eventArgs.value.split('(')[0];
            var value = eventArgs.value.split('(')[1].split(')')[0];
            if (value !== '0') {
                drillThroughBodyHeader.innerHTML = drillThroughBodyHeader.innerHTML + '<span class=' +
                    DRILLTHROUGH_BODY_HEADER_COMMON_CLASS + '><span class=' +
                    DRILLTHROUGH_BODY_HEADER_CLASS + '>' +
                    measure + '</span> :<span class=' + DRILLTHROUGH_BODY_HEADER_VALUE_CLASS + '>' + value + '</span></span>';
            }
        }
        var toolbarItems = ['ColumnChooser'];
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
        var drillThroughGrid = createElement('div', { id: this.parent.element.id + '_drillthroughgrid', className: DRILLTHROUGH_GRID_CLASS });
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
        var dialogModule = this;
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
            this.drillThroughGrid.actionComplete = function (args) {
                if (args.requestType === 'batchsave' || args.requestType === 'save' || args.requestType === 'delete') {
                    dialogModule.isUpdated = true;
                }
                if ((dialogModule.drillThroughGrid.editSettings.mode === 'Normal' && args.requestType === 'save' &&
                    dialogModule.drillThroughGrid.element.querySelectorAll('.e-tbar-btn:hover').length > 0 &&
                    !dialogModule.parent.editSettings.allowCommandColumns) || args.requestType === 'batchsave') {
                    dialogModule.dialogPopUp.hide();
                }
            };
            this.drillThroughGrid.beforeBatchSave = function () {
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
    };
    DrillThroughDialog.prototype.frameGridColumns = function () {
        var keys = Object.keys(this.parent.engineModule.fieldList);
        var columns = [];
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (this.parent.engineModule.fieldList[key].aggregateType !== 'CalculatedField') {
                var editType = '';
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
    };
    DrillThroughDialog.prototype.dataWithPrimarykey = function (eventArgs) {
        var indexString = Object.keys(eventArgs.currentCell.indexObject);
        var rawData = eventArgs.rawData;
        var count = 0;
        for (var _i = 0, rawData_1 = rawData; _i < rawData_1.length; _i++) {
            var item = rawData_1[_i];
            /* tslint:disable-next-line:no-string-literal */
            item['__index'] = indexString[count];
            this.gridIndexObjects[indexString[count].toString()] = Number(indexString[count]);
            count++;
        }
        return rawData;
    };
    return DrillThroughDialog;
}());

/**
 * `DrillThrough` module.
 */
var DrillThrough = /** @__PURE__ @class */ (function () {
    /**
     * Constructor.
     * @hidden
     */
    function DrillThrough(parent) {
        this.parent = parent;
        this.drillThroughDialog = new DrillThroughDialog(this.parent);
        this.addInternalEvents();
    }
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    DrillThrough.prototype.getModuleName = function () {
        return 'drillthrough';
    };
    DrillThrough.prototype.addInternalEvents = function () {
        this.parent.on(contentReady, this.wireEvents, this);
    };
    DrillThrough.prototype.wireEvents = function () {
        this.unWireEvents();
        EventHandler.add(this.parent.element, 'dblclick', this.mouseClickHandler, this);
    };
    DrillThrough.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.element, 'dblclick', this.mouseClickHandler);
    };
    DrillThrough.prototype.mouseClickHandler = function (e) {
        var target = e.target;
        var ele = null;
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
    };
    DrillThrough.prototype.executeDrillThrough = function (ele) {
        var colIndex = Number(ele.getAttribute('aria-colindex'));
        var rowIndex = Number(ele.getAttribute('index'));
        var pivotValue = this.parent.pivotValues[rowIndex][colIndex];
        var valueCaption = this.parent.engineModule.fieldList[pivotValue.actualText.toString()] ?
            this.parent.engineModule.fieldList[pivotValue.actualText.toString()].caption : pivotValue.actualText.toString();
        var rawData = [];
        if (pivotValue.rowHeaders !== undefined && pivotValue.columnHeaders !== undefined && pivotValue.value !== undefined) {
            var indexArray = Object.keys(pivotValue.indexObject);
            for (var _i = 0, indexArray_1 = indexArray; _i < indexArray_1.length; _i++) {
                var index = indexArray_1[_i];
                rawData.push(this.parent.dataSource.data[Number(index)]);
            }
            var aggType = this.parent.engineModule.fieldList[pivotValue.actualText].aggregateType;
            var valuetText = aggType === 'CalculatedField' ? valueCaption.toString() :
                (aggType + ' of ' + valueCaption);
            var eventArgs = {
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
    };
    return DrillThrough;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * It holds the settings of Grouping Bar.
 */
var GroupingBarSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(GroupingBarSettings, _super);
    function GroupingBarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return GroupingBarSettings;
}(ChildProperty));
/**
 * Configures the edit behavior of the Grid.
 */
var CellEditSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(CellEditSettings, _super);
    function CellEditSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return CellEditSettings;
}(ChildProperty));
/**
 * Configures the conditional based hyper link settings.
 */
var ConditionalSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(ConditionalSettings, _super);
    function ConditionalSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return ConditionalSettings;
}(ChildProperty));
/**
 * It holds the settings of Hyperlink.
 */
var HyperlinkSettings = /** @__PURE__ @class */ (function (_super) {
    __extends(HyperlinkSettings, _super);
    function HyperlinkSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return HyperlinkSettings;
}(ChildProperty));
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
var PivotView = /** @__PURE__ @class */ (function (_super) {
    __extends(PivotView, _super);
    /**
     * Constructor for creating the widget
     * @param  {PivotViewModel} options?
     * @param  {string|HTMLElement} element?
     */
    function PivotView(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @hidden */
        _this.resizeInfo = {};
        /** @hidden */
        _this.scrollPosObject = {
            vertical: 0, horizontal: 0, verticalSection: 0,
            horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 }
        };
        /** @hidden */
        _this.pivotColumns = [];
        /** @hidden */
        _this.totColWidth = 0;
        /** @hidden */
        _this.posCount = 0;
        _this.needsID = true;
        _this.pivotView = _this;
        return _this;
    }
    PivotView_1 = PivotView;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    PivotView.prototype.requiredModules = function () {
        var modules = [];
        var isCommonRequire;
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
    };
    /**
     * For internal use only - Initializing internal properties;
     * @private
     */
    PivotView.prototype.preRender = function () {
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
    };
    PivotView.prototype.onBeforeTooltipOpen = function (args) {
        args.element.classList.add('e-pivottooltipwrap');
    };
    PivotView.prototype.renderToolTip = function () {
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
    };
    /* tslint:disable:align */
    PivotView.prototype.initProperties = function () {
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
            var colValues = 1;
            var rowValues = 1;
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
    };
    /**
     * Initialize the control rendering
     * @returns void
     * @hidden
     */
    PivotView.prototype.render = function () {
        createSpinner({ target: this.element }, this.createElement);
        this.trigger(load, { 'dataSource': this.dataSource });
        this.updateClass();
        this.notify(initSubComponent, {});
        this.notify(initialLoad, {});
        if (this.isAdaptive) {
            this.contextMenuModule.render();
        }
    };
    /**
     * Register the internal events.
     * @returns void
     * @hidden
     */
    PivotView.prototype.addInternalEvents = function () {
        this.on(initialLoad, this.generateData, this);
        this.on(dataReady, this.renderPivotGrid, this);
        this.on(contentReady, this.onContentReady, this);
    };
    /**
     * De-Register the internal events.
     * @returns void
     * @hidden
     */
    PivotView.prototype.removeInternalEvents = function () {
        this.off(initialLoad, this.generateData);
        this.off(dataReady, this.renderPivotGrid);
        this.off(contentReady, this.onContentReady);
    };
    /**
     * Get the Pivot widget properties to be maintained in the persisted state.
     * @returns {string}
     * @hidden
     */
    PivotView.prototype.getPersistData = function () {
        var keyEntity = ['dataSource', 'pivotValues', 'gridSettings'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * It returns the Module name.
     * @returns string
     * @hidden
     */
    PivotView.prototype.getModuleName = function () {
        return 'pivotview';
    };
    /**
     * Copy the selected rows or cells data into clipboard.
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     * @hidden
     */
    PivotView.prototype.copy = function (withHeader) {
        this.grid.copy(withHeader);
    };
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
    PivotView.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                    _super.prototype.refresh.call(this);
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
    };
    /**
     * Render the UI section of PivotView.
     * @returns void
     * @hidden
     */
    PivotView.prototype.renderPivotGrid = function () {
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
    };
    /**
     * Updates the PivotEngine using dataSource from Pivot View component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    PivotView.prototype.updateDataSource = function (isRefreshGrid) {
        showSpinner(this.element);
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', this.engineModule.fieldList, this.pageSettings, this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        var eventArgs = {
            dataSource: this.dataSource,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(enginePopulated, eventArgs);
        this.pivotCommon.engineModule = this.engineModule;
        this.pivotCommon.dataSource = this.dataSource;
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.renderPivotGrid();
    };
    /**
     * To destroy the PivotView elements.
     * @returns void
     */
    PivotView.prototype.destroy = function () {
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
        _super.prototype.destroy.call(this);
    };
    /**
     * Export Pivot widget data to Excel file(.xlsx).
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    PivotView.prototype.excelExport = function (excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('Excel');
        }
        else {
            this.grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    };
    /**
     * Export PivotGrid data to CSV file.
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    /* tslint:disable-next-line:no-any */
    PivotView.prototype.csvExport = function (excelExportProperties, isMultipleExport, workbook, isBlob) {
        if (this.enableVirtualization) {
            this.excelExportModule.exportToExcel('CSV');
        }
        else {
            this.grid.csvExport(excelExportProperties, isMultipleExport, workbook, isBlob);
        }
    };
    /**
     * Export Pivot widget data to PDF document.
     * @param  {pdfExportProperties} PdfExportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param  {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns void
     */
    PivotView.prototype.pdfExport = function (pdfExportProperties, isMultipleExport, pdfDoc, isBlob) {
        if (this.enableVirtualization) {
            this.pdfExportModule.exportToPDF();
        }
        else {
            this.grid.pdfExport(pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
    };
    PivotView.prototype.onDrill = function (target) {
        var fieldName = target.parentElement.getAttribute('fieldname');
        var memberName = this.engineModule.pivotValues[Number(target.parentElement.getAttribute('index'))][Number(target.parentElement.getAttribute('aria-colindex'))].actualText;
        this.engineModule.fieldList[fieldName].members[memberName].isDrilled =
            target.classList.contains(COLLAPSE) ? false : true;
        var dataSource = extend({}, this.dataSource, null, true);
        var fieldAvail = false;
        var prop = dataSource.properties;
        if (!prop.drilledMembers || prop.drilledMembers.length === 0) {
            prop.drilledMembers = [{ name: fieldName, items: [memberName] }];
        }
        else {
            for (var fCnt = 0; fCnt < prop.drilledMembers.length; fCnt++) {
                var field = prop.drilledMembers[fCnt];
                if (field.name === fieldName) {
                    fieldAvail = true;
                    var memIndex = field.items.indexOf(memberName);
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
    };
    PivotView.prototype.onContentReady = function () {
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
            var movableTable = this.element.querySelector('.' + MOVABLECONTENT_DIV).querySelector('.e-table');
            var vHeight = (this.gridSettings.rowHeight * this.engineModule.rowCount + 0.1 - movableTable.clientHeight);
            var vWidth = (this.gridSettings.columnWidth * this.engineModule.columnCount
                - this.grid.columns[0].width);
            setStyleAttribute(this.virtualDiv, {
                height: (vHeight > 0.1 ? vHeight : 0.1) + 'px',
                width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            setStyleAttribute(this.virtualHeaderDiv, {
                height: 0, width: (vWidth > 0.1 ? vWidth : 0.1) + 'px'
            });
            var mCnt = this.element.querySelector('.' + MOVABLECONTENT_DIV);
            var fCnt = this.element.querySelector('.' + FROZENCONTENT_DIV);
            var mHdr = this.element.querySelector('.' + MOVABLEHEADER_DIV);
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
    };
    PivotView.prototype.setToolTip = function (args) {
        var colIndex = Number(args.target.getAttribute('aria-colindex'));
        var rowIndex = Number(args.target.getAttribute('index'));
        var cell = this.pivotValues[rowIndex][colIndex];
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
    };
    PivotView.prototype.getRowText = function (rowIndex, colIndex) {
        var cell = this.pivotValues[rowIndex][colIndex];
        var level = cell.level;
        var rowText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
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
    };
    PivotView.prototype.getColText = function (rowIndex, colIndex, limit) {
        var cell = this.pivotValues[0][colIndex];
        var axis = cell.axis;
        var colText = cell.type === 'grand sum' ? this.localeObj.getConstant('grandTotal') : cell.formattedText;
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
    };
    PivotView.prototype.updateClass = function () {
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
    };
    PivotView.prototype.wireEvents = function () {
        EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
        window.addEventListener('resize', this.onWindowResize.bind(this), true);
    };
    PivotView.prototype.mouseClickHandler = function (e) {
        var target = e.target;
        if ((target.classList.contains('e-headercell') ||
            target.classList.contains('e-headercelldiv') ||
            target.classList.contains('e-rowsheader') ||
            target.classList.contains('e-rowcell') ||
            target.classList.contains('e-stackedheadercelldiv') ||
            target.classList.contains('e-headertext') ||
            target.classList.contains('e-ascending') ||
            target.classList.contains('e-descending')) && this.enableValueSorting) {
            var ele = null;
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
                var colIndex = Number(ele.getAttribute('aria-colindex'));
                var rowIndex = Number(ele.getAttribute('index'));
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
    };
    PivotView.prototype.framePivotColumns = function (gridcolumns) {
        for (var _i = 0, gridcolumns_1 = gridcolumns; _i < gridcolumns_1.length; _i++) {
            var column = gridcolumns_1[_i];
            if (column.columns && column.columns.length > 0) {
                this.framePivotColumns(column.columns);
            }
            else {
                /* tslint:disable */
                var levelName = column.field === '0.formattedText' ? '' :
                    (column.customAttributes ? column.customAttributes.cell.valueSort.levelName : '');
                var width = this.renderModule.setSavedWidth(column.field === '0.formattedText' ? column.field :
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
    };
    /** @hidden */
    PivotView.prototype.setGridColumns = function (gridcolumns) {
        if (this.element.offsetWidth < this.totColWidth) {
            for (var _i = 0, gridcolumns_2 = gridcolumns; _i < gridcolumns_2.length; _i++) {
                var column = gridcolumns_2[_i];
                if (column.columns && column.columns.length > 0) {
                    this.setGridColumns(column.columns);
                }
                else {
                    /* tslint:disable */
                    var levelName = column.field === '0.formattedText' ? '' :
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
    };
    /** @hidden */
    PivotView.prototype.triggerColumnRenderEvent = function (gridcolumns) {
        this.pivotColumns = [];
        this.totColWidth = 0;
        this.framePivotColumns(gridcolumns);
        var firstColWidth = this.pivotColumns[0].width;
        var eventArgs = {
            columns: this.pivotColumns,
            dataSource: this.dataSource
        };
        this.trigger(beforeColumnsRender, eventArgs);
        if (firstColWidth !== this.pivotColumns[0].width && this.element.offsetWidth < this.totColWidth) {
            this.firstColWidth = this.pivotColumns[0].width;
        }
        this.posCount = 0;
        this.setGridColumns(gridcolumns);
    };
    /** @hidden */
    PivotView.prototype.setCommonColumnsWidth = function (columns, width) {
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
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
    };
    /** @hidden */
    PivotView.prototype.onWindowResize = function () {
        var _this = this;
        /* tslint:disable */
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(function () {
            if (_this.element && _this.element.classList.contains('e-pivotview') && _this.engineModule) {
                var colWidth = _this.renderModule.calculateColWidth(_this.dataSource.values.length > 0 ?
                    _this.engineModule.pivotValues[0].length : 2);
                _this.grid.width = _this.renderModule.calculateGridWidth();
                _this.setCommonColumnsWidth(_this.grid.columns, colWidth);
                _this.posCount = 0;
                if (!_this.showGroupingBar) {
                    _this.setGridColumns(_this.grid.columns);
                }
                _this.grid.headerModule.refreshUI();
                if (_this.showGroupingBar && _this.groupingBarModule && _this.element.querySelector('.' + GROUPING_BAR_CLASS)) {
                    _this.groupingBarModule.setGridRowWidth();
                }
            }
        }, 500);
        /* tslint:enable */
    };
    PivotView.prototype.CellClicked = function (target) {
        var ele = null;
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
    };
    PivotView.prototype.unwireEvents = function () {
        EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
        window.removeEventListener('resize', this.onWindowResize.bind(this), true);
    };
    PivotView.prototype.renderEmptyGrid = function () {
        this.isEmptyGrid = true;
        if (this.element.querySelector('.' + GRID_CLASS)) {
            remove(this.element.querySelector('.' + GRID_CLASS));
        }
        this.renderModule = new Render(this);
        this.renderModule.bindGrid(this, true);
        /* tslint:disable:no-empty */
        this.grid.showSpinner = function () { };
        this.grid.hideSpinner = function () { };
        /* tslint:enable:no-empty */
        this.element.appendChild(createElement('div', { id: this.element.id + '_grid' }));
        this.grid.appendTo('#' + this.element.id + '_grid');
    };
    PivotView.prototype.initEngine = function () {
        this.trigger(enginePopulating, { 'dataSource': this.dataSource });
        /* tslint:disable:align */
        this.engineModule = new PivotEngine(this.dataSource, '', undefined, this.pageSettings, this.enableValueSorting, (this.allowDrillThrough || this.editSettings.allowEditing));
        this.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.trigger(enginePopulated, { 'pivotValues': this.pivotValues });
        this.notify(dataReady, {});
        this.isEmptyGrid = false;
    };
    PivotView.prototype.generateData = function () {
        var _this = this;
        this.renderEmptyGrid();
        showSpinner(this.element);
        /* tslint:disable */
        if (this.dataSource && this.dataSource.data) {
            if (this.dataSource.data instanceof DataManager) {
                setTimeout(function () {
                    _this.dataSource.data.executeQuery(new Query()).then(function (e) {
                        if (!_this.element.querySelector('.e-spinner-pane')) {
                            showSpinner(_this.element);
                        }
                        _this.setProperties({ dataSource: { data: e.result } }, true);
                        _this.initEngine();
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
    };
    PivotView.prototype.applyFormatting = function () {
        if (this.pivotValues) {
            var colIndex = [];
            for (var len = this.pivotValues.length, i = 0; i < len; i++) {
                if (this.pivotValues[i] !== undefined && this.pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            for (var i = 0; i < this.pivotValues.length; i++) {
                for (var j = 1; (this.pivotValues[i] && j < this.pivotValues[i].length); j++) {
                    if (this.pivotValues[i][j].axis === 'value') {
                        this.pivotValues[i][j].style = undefined;
                        this.pivotValues[i][j].cssClass = undefined;
                        var format_1 = this.dataSource.conditionalFormatSettings;
                        for (var k = 0; k < format_1.length; k++) {
                            if (this.checkCondition(this.pivotValues[i][j].value, format_1[k].conditions, format_1[k].value1, format_1[k].value2)) {
                                var ilen = (this.dataSource.valueAxis === 'row' ? i : this.engineModule.headerContent.length - 1);
                                var jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
                                if ((!format_1[k].measure || this.dataSource.values.length === 1 ||
                                    (this.pivotValues[ilen][jlen].valueSort &&
                                        this.pivotValues[ilen][jlen].valueSort.levelName.
                                            indexOf(format_1[k].measure) > -1)) &&
                                    (!format_1[k].label || ((this.pivotValues[colIndex[format_1[k].label.split('.').length - 1]] &&
                                        this.pivotValues[colIndex[format_1[k].label.split('.').length - 1]][j] &&
                                        this.pivotValues[colIndex[format_1[k].label.split('.').length - 1]][j].valueSort &&
                                        this.pivotValues[colIndex[format_1[k].label.split('.').length - 1]][j].
                                            valueSort[format_1[k].label]) || (this.pivotValues[i][0].
                                        valueSort.levelName.indexOf(format_1[k].label) > -1)))) {
                                    if (format_1[k].style && format_1[k].style.backgroundColor) {
                                        format_1[k].style.backgroundColor = this.conditionalFormattingModule
                                            .isHex(format_1[k].style.backgroundColor.substr(1)) ? format_1[k].style.backgroundColor :
                                            this.conditionalFormattingModule.colourNameToHex(format_1[k].style.backgroundColor);
                                    }
                                    if (format_1[k].style && format_1[k].style.color) {
                                        format_1[k].style.color = this.conditionalFormattingModule
                                            .isHex(format_1[k].style.color.substr(1)) ? format_1[k].style.color :
                                            this.conditionalFormattingModule.colourNameToHex(format_1[k].style.color);
                                    }
                                    this.pivotValues[i][j].style = format_1[k].style;
                                    this.pivotValues[i][j].cssClass = 'format' + this.element.id + k;
                                }
                            }
                        }
                    }
                }
            }
            var format = this.dataSource.conditionalFormatSettings;
            for (var k = 0; k < format.length; k++) {
                var sheet = (function () {
                    var style = document.createElement('style');
                    style.appendChild(document.createTextNode(''));
                    document.head.appendChild(style);
                    return style.sheet;
                })();
                var str = 'color: ' + format[k].style.color + '!important;background-color: ' + format[k].style.backgroundColor +
                    '!important;font-size: ' + format[k].style.fontSize + '!important;font-family: ' + format[k].style.fontFamily +
                    ' !important;';
                sheet.insertRule('.format' + this.element.id + k + '{' + str + '}', 0);
            }
        }
    };
    PivotView.prototype.applyHyperlinkSettings = function () {
        if (this.pivotValues) {
            var pivotValues = this.pivotValues;
            var colIndex = [];
            for (var len = pivotValues.length, i = 0; i < len; i++) {
                if (pivotValues[i] !== undefined && pivotValues[i][0] === undefined) {
                    colIndex.push(i);
                }
            }
            if (this.hyperlinkSettings.conditionalSettings.length > 0) {
                for (var i = 0; i < pivotValues.length; i++) {
                    for (var j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            pivotValues[i][j].enableHyperlink = false;
                            var collection = this.hyperlinkSettings.conditionalSettings;
                            for (var k = 0; k < collection.length; k++) {
                                if (this.checkCondition(pivotValues[i][j].value, collection[k].conditions, collection[k].value1, collection[k].value2)) {
                                    var ilen = (this.dataSource.valueAxis === 'row' ?
                                        i : this.engineModule.headerContent.length - 1);
                                    var jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
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
                for (var i = 0; i < pivotValues.length; i++) {
                    for (var j = 1; (pivotValues[i] && j < pivotValues[i].length); j++) {
                        if (pivotValues[i][j].axis === 'value') {
                            // (pivotValues[i][j] as IAxisSet).enableHyperlink = false;
                            var label = this.hyperlinkSettings.headerText;
                            var ilen = (this.dataSource.valueAxis === 'row' ?
                                i : this.engineModule.headerContent.length - 1);
                            var jlen = (this.dataSource.valueAxis === 'row' ? 0 : j);
                            if ((pivotValues[colIndex[label.split('.').length - 1]] &&
                                pivotValues[colIndex[label.split('.').length - 1]][j] &&
                                pivotValues[colIndex[label.split('.').length - 1]][j].
                                    valueSort && pivotValues[colIndex[label.split('.').length - 1]][j].
                                valueSort[label])) {
                                for (var _i = 0, colIndex_1 = colIndex; _i < colIndex_1.length; _i++) {
                                    var index = colIndex_1[_i];
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
    };
    PivotView.prototype.checkCondition = function (cellValue, conditions, conditionalValue1, conditionalValue2) {
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
    };
    var PivotView_1;
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
    return PivotView;
}(Component));

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
var CommonKeyboardInteraction = /** @__PURE__ @class */ (function () {
    /**
     * Constructor
     */
    function CommonKeyboardInteraction(parent) {
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
    CommonKeyboardInteraction.prototype.keyActionHandler = function (e) {
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
    };
    CommonKeyboardInteraction.prototype.processOpenContextMenu = function (e) {
        var target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) &&
            closest(target, '.' + VALUE_AXIS_CLASS)) {
            target.querySelector('.' + AXISFIELD_ICON_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processSort = function (e) {
        var target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) &&
            !closest(target, '.' + VALUE_AXIS_CLASS) && !closest(target, '.' + AXIS_FILTER_CLASS)) {
            target.querySelector('.' + SORT_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processFilter = function (e) {
        var target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS) && !closest(target, '.' + VALUE_AXIS_CLASS)) {
            target.querySelector('.' + FILTER_COMMON_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    CommonKeyboardInteraction.prototype.processDelete = function (e) {
        var target = e.target;
        if (target && closest(target, '.' + PIVOT_BUTTON_CLASS)) {
            target.querySelector('.' + REMOVE_CLASS).click();
            e.preventDefault();
            return;
        }
    };
    /**
     * To destroy the keyboard module.
     * @return {void}
     * @private
     */
    CommonKeyboardInteraction.prototype.destroy = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        else {
            return;
        }
    };
    return CommonKeyboardInteraction;
}());

/**
 * `EventBase` for active fields action.
 */
/** @hidden */
var EventBase = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function EventBase(parent) {
        this.parent = parent;
    }
    /**
     * Updates sorting order for the selected field.
     * @method updateSorting
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    EventBase.prototype.updateSorting = function (args) {
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        var target = args.target;
        var fieldName = target.parentElement.id;
        var isDescending = target.classList.contains(SORT_DESCEND_CLASS);
        var sortObj = this.getSortItemByName(fieldName);
        if (!isNullOrUndefined(sortObj)) {
            for (var i = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    this.parent.dataSource.sortSettings.splice(i, 1);
                    break;
                }
            }
            var newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
        else {
            var newSortObj = { name: fieldName, order: isDescending ? 'Ascending' : 'Descending' };
            this.parent.dataSource.sortSettings.push(newSortObj);
        }
        isDescending ? removeClass([target], SORT_DESCEND_CLASS) : addClass([target], SORT_DESCEND_CLASS);
    };
    /**
     * Updates sorting order for the selected field.
     * @method updateFiltering
     * @param  {Event} args - Contains clicked element information to update dataSource.
     * @return {void}
     * @hidden
     */
    EventBase.prototype.updateFiltering = function (args) {
        var target = args.target;
        var fieldName = target.parentElement.id;
        var fieldCaption = target.parentElement.textContent;
        var isInclude = false;
        var filterItems = [];
        this.parent.engineModule.fieldList[fieldName].dateMember = new DataManager(this.parent.engineModule.
            fieldList[fieldName].dateMember).executeLocal(new Query().
            sortBy('actualText', this.parent.engineModule.fieldList[fieldName].sort.toLowerCase()));
        var filterObj = this.getFilterItemByName(fieldName);
        if (!isNullOrUndefined(filterObj)) {
            isInclude = filterObj.type === 'Include' ? true : false;
            filterItems = filterObj.items ? filterObj.items : [];
        }
        var treeData = this.getTreeData(isInclude, this.parent.engineModule.fieldList[fieldName].dateMember, filterItems, fieldName);
        if (this.parent.filterDialog.dialogPopUp) {
            this.parent.filterDialog.dialogPopUp.close();
        }
        var popupTarget;
        popupTarget = this.parent.moduleName !== 'pivotfieldlist' ?
            popupTarget = this.parent.element : popupTarget = document.getElementById(this.parent.parentID + '_Wrapper');
        this.parent.filterDialog.createFilterDialog(treeData, fieldName, fieldCaption, popupTarget);
    };
    /**
     * Gets sort object for the given field name from the dataSource.
     * @method getSortItemByName
     * @param  {string} fieldName - Gets sort settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    EventBase.prototype.getSortItemByName = function (fieldName) {
        var sortObjects = this.parent.dataSource.sortSettings;
        return new DataManager({ json: sortObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    EventBase.prototype.getFilterItemByName = function (fieldName) {
        var filterObjects = this.parent.dataSource.filterSettings;
        return new DataManager({ json: filterObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    /**
     * Gets filter object for the given field name from the dataSource.
     * @method getFieldByName
     * @param  {string} fieldName - Gets filter settings for the given field name.
     * @return {Sort}
     * @hidden
     */
    EventBase.prototype.getFieldByName = function (fieldName, fields) {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    /**
     * Gets format object for the given field name from the dataSource.
     * @method getFilterItemByName
     * @param  {string} fieldName - Gets format settings for the given field name.
     * @return {IFormatSettings}
     * @hidden
     */
    EventBase.prototype.getFormatItemByName = function (fieldName) {
        var formatObjects = this.parent.dataSource.formatSettings;
        return new DataManager({ json: formatObjects }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    };
    /**
     * show tree nodes using search text.
     * @hidden
     */
    EventBase.prototype.searchTreeNodes = function (args, treeObj, isFieldCollection) {
        if (isFieldCollection) {
            var searchList = [];
            var nonSearchList = [];
            var list = [].slice.call(treeObj.element.querySelectorAll('li'));
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var element = list_1[_i];
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
            var searchList = [];
            this.parent.searchTreeItems = [];
            var memberCount = 0;
            memberCount = 1;
            for (var _a = 0, _b = this.parent.currentTreeItems; _a < _b.length; _a++) {
                var item = _b[_a];
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
    };
    EventBase.prototype.getTreeData = function (isInclude, members, filterItems, fieldName) {
        this.parent.currentTreeItems = [];
        this.parent.searchTreeItems = [];
        this.parent.currentTreeItemsPos = {};
        this.parent.savedTreeFilterPos = {};
        this.parent.isDateField = this.parent.engineModule.formatFields[fieldName] &&
            ((['date', 'dateTime', 'time']).indexOf(this.parent.engineModule.formatFields[fieldName].type) > -1);
        var list = [];
        var memberCount = 1;
        var filterObj = {};
        for (var _i = 0, filterItems_1 = filterItems; _i < filterItems_1.length; _i++) {
            var item = filterItems_1[_i];
            filterObj[item] = item;
        }
        for (var _a = 0, members_1 = members; _a < members_1.length; _a++) {
            var member = members_1[_a];
            var memberName = this.parent.isDateField ? member.formattedText : member.actualText.toString();
            var obj = {
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
    };
    return EventBase;
}());

/**
 * `DialogAction` module is used to handle field list dialog related behaviour.
 */
/** @hidden */
var NodeStateModified = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function NodeStateModified(parent) {
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
    NodeStateModified.prototype.onStateModified = function (args, fieldName) {
        var droppedClass = '';
        var nodeDropped = true;
        var target = closest(args.target, '.' + DROPPABLE_CLASS);
        var droppedPosition = -1;
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
                var title = this.parent.localeObj.getConstant('warning');
                var description = this.parent.localeObj.getConstant('dropAction');
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
    };
    NodeStateModified.prototype.getButtonPosition = function (target, droppedClass) {
        var droppedPosition = -1;
        var targetBtn = closest(target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
        if (!isNullOrUndefined(targetBtn)) {
            targetBtn = targetBtn.querySelector('.' + PIVOT_BUTTON_CLASS);
            var axisPanel = this.parent.element.querySelector('.e-' + droppedClass);
            var pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            for (var i = 0, n = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === targetBtn.id) {
                    droppedPosition = i;
                    break;
                }
            }
        }
        return droppedPosition;
    };
    return NodeStateModified;
}());

/**
 * `DataSourceUpdate` module is used to update the dataSource.
 */
/** @hidden */
var DataSourceUpdate = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function DataSourceUpdate(parent) {
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
    DataSourceUpdate.prototype.updateDataSource = function (fieldName, droppedClass, droppedPosition) {
        var dataSourceItem;
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
            var eventArgs = {
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
    };
    /**
     * Updates the dataSource by removing the given field from the dataSource.
     * @param  {string} fieldName - Defines dropped field name to remove dataSource.
     * @method removeFieldFromReport
     * @return {void}
     * @hidden
     */
    DataSourceUpdate.prototype.removeFieldFromReport = function (fieldName) {
        var dataSourceItem;
        var isDataSource = false;
        var rows = this.parent.dataSource.rows;
        var columns = this.parent.dataSource.columns;
        var values = this.parent.dataSource.values;
        var filters = this.parent.dataSource.filters;
        var fields = [rows, columns, values, filters];
        var field = this.parent.engineModule.fieldList[fieldName];
        for (var len = 0, lnt = fields.length; len < lnt; len++) {
            if (!isDataSource && fields[len]) {
                for (var i = 0, n = fields[len].length; i < n; i++) {
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
    };
    /**
     * Creates new field object given field name from the field list data.
     * @param  {string} fieldName - Defines dropped field name to add dataSource.
     * @method getNewField
     * @return {void}
     * @hidden
     */
    DataSourceUpdate.prototype.getNewField = function (fieldName) {
        var field = this.parent.engineModule.fieldList[fieldName];
        var newField = {
            name: fieldName,
            caption: field.caption,
            type: field.aggregateType === undefined ? field.type === 'number' ? 'Sum' :
                'Count' : field.aggregateType,
            showNoDataItems: field.showNoDataItems,
            baseField: field.baseField,
            baseItem: field.baseItem,
        };
        return newField;
    };
    return DataSourceUpdate;
}());

/**
 * `ErrorDialog` module to create error dialog.
 */
/** @hidden */
var ErrorDialog = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function ErrorDialog(parent) {
        this.parent = parent;
    }
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createErrorDialog
     * @return {void}
     * @hidden
     */
    ErrorDialog.prototype.createErrorDialog = function (title, description) {
        var errorDialog = createElement('div', {
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
    };
    ErrorDialog.prototype.closeErrorDialog = function () {
        this.errorPopUp.close();
    };
    ErrorDialog.prototype.removeErrorDialog = function () {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    };
    return ErrorDialog;
}());

/**
 * `FilterDialog` module to create filter dialog.
 */
/** @hidden */
var FilterDialog = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the dialog action.
     * @hidden
     */
    function FilterDialog(parent) {
        this.parent = parent;
    }
    /**
     * Creates the member filter dialog for the selected field.
     * @method createFilterDialog
     * @return {void}
     * @hidden
     */
    FilterDialog.prototype.createFilterDialog = function (treeData, fieldName, fieldCaption, target) {
        var editorDialog = createElement('div', {
            id: this.parent.parentID + '_EditorTreeView',
            className: MEMBER_EDITOR_DIALOG_CLASS,
            attrs: { 'data-fieldName': fieldName, 'aria-label': fieldCaption },
            styles: 'visibility:hidden;'
        });
        var headerTemplate = this.parent.localeObj.getConstant('filter') + ' ' +
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
    };
    FilterDialog.prototype.createTreeView = function (treeData, fieldCaption, fieldName) {
        var _this = this;
        var editorTreeWrapper = createElement('div', {
            id: this.parent.parentID + 'EditorDiv',
            className: EDITOR_TREE_WRAPPER_CLASS + (this.allowExcelLikeFilter ? ' e-excelfilter' : '')
        });
        var searchWrapper = createElement('div', {
            id: this.parent.parentID + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: EDITOR_SEARCH_WRAPPER_CLASS
        });
        var editorSearch = createElement('input', { attrs: { 'type': 'text' } });
        var labelWrapper = createElement('div', {
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
        var selectAllWrapper = createElement('div', {
            id: this.parent.parentID + '_AllDiv', attrs: { 'tabindex': '-1' },
            className: SELECT_ALL_WRAPPER_CLASS
        });
        var selectAllContainer = createElement('div', { className: SELECT_ALL_CLASS });
        var treeViewContainer = createElement('div', { className: EDITOR_TREE_CONTAINER_CLASS });
        var promptDiv = createElement('div', {
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
            change: function (e) {
                _this.parent.eventBase.searchTreeNodes(e, _this.memberTreeView, false);
                var filterDialog = _this.dialogPopUp.element;
                var liList = [].slice.call(_this.memberTreeView.element.querySelectorAll('li'));
                if (liList.length === 0) {
                    _this.allMemberSelect.disableNodes([_this.allMemberSelect.element.querySelector('li')]);
                    filterDialog.querySelector('.' + OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                    removeClass([promptDiv], ICON_DISABLE);
                }
                else {
                    _this.allMemberSelect.enableNodes([_this.allMemberSelect.element.querySelector('li')]);
                    filterDialog.querySelector('.' + OK_BUTTON_CLASS).removeAttribute('disabled');
                    addClass([promptDiv], ICON_DISABLE);
                }
                _this.updateCheckedState(fieldCaption);
            }
        });
        this.editorSearch.appendTo(editorSearch);
        var data = [{ id: 'all', name: 'All', checkedStatus: true }];
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
    };
    FilterDialog.prototype.createTabMenu = function (treeData, fieldCaption, fieldName) {
        var wrapper = createElement('div', {
            className: 'e-filter-tab-wrapper'
        });
        this.dialogPopUp.content = wrapper;
        this.dialogPopUp.dataBind();
        var types = ['Label', 'Value', 'Include', 'Exclude'];
        var regx = '((-|\\+)?[0-9]+(\\.[0-9]+)?)+';
        var member = Object.keys(this.parent.engineModule.fieldList[fieldName].members)[0];
        var formatObj = this.parent.eventBase.getFormatItemByName(fieldName);
        var items = [
            {
                header: {
                    text: this.parent.localeObj.getConstant('member'),
                    iconCss: (this.filterObject && types.indexOf(this.filterObject.type) > 1 ? SELECTED_OPTION_ICON_CLASS : '')
                },
                content: this.createTreeView(treeData, fieldCaption, fieldName)
            }
        ];
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            if (((type === 'Label') && this.parent.dataSource.allowLabelFilter) ||
                (type === 'Value' && this.parent.dataSource.allowValueFilter)) {
                var filterType = (type === 'Label' && ((member).match(regx) &&
                    (member).match(regx)[0].length === (member).length)) ? 'Number' :
                    (type === 'Label' && (new Date(member).toString() !== 'Invalid Date') &&
                        ((formatObj && formatObj.type) || (this.filterObject && this.filterObject.type === 'Date'))) ? 'Date' : type;
                var item = {
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
        var selectedIndex = (this.filterObject ? (['Label', 'Date', 'Number'].indexOf(this.filterObject.type) >= 0) ?
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
    };
    FilterDialog.prototype.createCustomFilter = function (fieldName, filterObject, type) {
        var dataSource = [];
        var valueOptions = [];
        var measures = this.parent.dataSource.values;
        var selectedOption = 'DoesNotEquals';
        var selectedValueIndex = 0;
        var options = {
            label: ['Equals', 'DoesNotEquals', 'BeginWith', 'DoesNotBeginWith', 'EndsWith',
                'DoesNotEndsWith', 'Contains', 'DoesNotContains', 'GreaterThan',
                'GreaterThanOrEqualTo', 'LessThan', 'LessThanOrEqualTo', 'Between', 'NotBetween'],
            date: ['Equals', 'DoesNotEquals', 'Before', 'BeforeOrEqualTo', 'After', 'AfterOrEqualTo',
                'Between', 'NotBetween'],
            value: ['Equals', 'DoesNotEquals', 'GreaterThan', 'GreaterThanOrEqualTo', 'LessThan',
                'LessThanOrEqualTo', 'Between', 'NotBetween']
        };
        var betweenOperators = ['Between', 'NotBetween'];
        var operatorCollection = (type === 'label' ? options.label : type === 'date' ? options.date : options.value);
        for (var _i = 0, operatorCollection_1 = operatorCollection; _i < operatorCollection_1.length; _i++) {
            var operator = operatorCollection_1[_i];
            selectedOption = ((filterObject && operator === filterObject.condition) ?
                operatorCollection.indexOf(filterObject.condition) >= 0 ?
                    filterObject.condition : operatorCollection[0] : selectedOption);
            dataSource.push({ value: operator, text: this.parent.localeObj.getConstant(operator) });
        }
        var len = measures.length;
        while (len--) {
            valueOptions.unshift({ value: measures[len].name, text: (measures[len].caption ? measures[len].caption : measures[len].name) });
            selectedValueIndex = filterObject && filterObject.type === 'Value' &&
                filterObject.measure === measures[len].name &&
                filterObject.condition === selectedOption ? len : selectedValueIndex;
        }
        var mainDiv = createElement('div', {
            className: FILTER_DIV_CONTENT_CLASS + ' e-' + ((['date', 'number']).indexOf(type) >= 0 ? 'label' : type) + '-filter',
            id: this.parent.parentID + '_' + type + '_filter_div_content',
            attrs: {
                'data-type': type, 'data-fieldName': fieldName, 'data-operator': selectedOption,
                'data-measure': (this.parent.dataSource.values.length > 0 ? this.parent.dataSource.values[selectedValueIndex].name : ''),
                'data-value1': (filterObject && selectedOption === filterObject.condition ? filterObject.value1.toString() : ''),
                'data-value2': (filterObject && selectedOption === filterObject.condition ? filterObject.value1.toString() : '')
            }
        });
        var textContentdiv = createElement('div', {
            className: FILTER_TEXT_DIV_CLASS,
            innerHTML: this.parent.localeObj.getConstant(type + 'TextContent')
        });
        var betweenTextContentdiv = createElement('div', {
            className: BETWEEN_TEXT_DIV_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption) === -1 ? ICON_DISABLE : ''),
            innerHTML: this.parent.localeObj.getConstant('And')
        });
        var separatordiv = createElement('div', { className: SEPARATOR_DIV_CLASS });
        var filterWrapperDiv1 = createElement('div', { className: FILTER_OPTION_WRAPPER_1_CLASS });
        var optionWrapperDiv1 = createElement('div', {
            className: 'e-measure-option-wrapper' + ' ' + (((['label', 'date', 'number']).indexOf(type) >= 0) ? ICON_DISABLE : ''),
        });
        var optionWrapperDiv2 = createElement('div', { className: 'e-condition-option-wrapper' });
        var filterWrapperDiv2 = createElement('div', { className: FILTER_OPTION_WRAPPER_2_CLASS });
        var dropOptionDiv1 = createElement('div', { id: this.parent.parentID + '_' + type + '_measure_option_wrapper' });
        var dropOptionDiv2 = createElement('div', { id: this.parent.parentID + '_' + type + '_contition_option_wrapper' });
        var inputDiv1 = createElement('div', { className: FILTER_INPUT_DIV_1_CLASS });
        var inputDiv2 = createElement('div', {
            className: FILTER_INPUT_DIV_2_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption) === -1 ? ICON_DISABLE : '')
        });
        var inputField1 = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_1', attrs: { 'type': 'text' }
        });
        var inputField2 = createElement('input', {
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
    };
    /* tslint:disable */
    FilterDialog.prototype.createElements = function (filterObj, operators, optionDiv1, optionDiv2, inputDiv1, inputDiv2, vDataSource, oDataSource, valueIndex, option, type) {
        var popupInstance = this;
        var optionWrapper1 = new DropDownList({
            dataSource: vDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: valueIndex,
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
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
        var optionWrapper = new DropDownList({
            dataSource: oDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, value: option,
            cssClass: FILTER_OPERATOR_CLASS, width: '100%',
            change: function (args) {
                var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    var disabledClasses = [BETWEEN_TEXT_DIV_CLASS, FILTER_INPUT_DIV_2_CLASS];
                    for (var _i = 0, disabledClasses_1 = disabledClasses; _i < disabledClasses_1.length; _i++) {
                        var className = disabledClasses_1[_i];
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
            var inputObj1_1 = new DatePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 : null),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2_1.value });
                    }
                    else {
                        return;
                    }
                },
                width: '100%',
            });
            var inputObj2_1 = new DatePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 : null),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1_1.value, 'data-value2': e.value });
                    }
                    else {
                        return;
                    }
                },
                width: '100%',
            });
            inputObj1_1.appendTo(inputDiv1);
            inputObj2_1.appendTo(inputDiv2);
        }
        else if (type === 'value') {
            var inputObj1_2 = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value1, 10) : undefined),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (e.value ? e.value.toString() : '0'),
                            'data-value2': (inputObj2_2.value ? inputObj2_2.value.toString() : '0')
                        });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            var inputObj2_2 = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value2, 10) : undefined),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (inputObj1_2.value ? inputObj1_2.value.toString() : '0'),
                            'data-value2': (e.value ? e.value.toString() : '0')
                        });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1_2.appendTo(inputDiv1);
            inputObj2_2.appendTo(inputDiv2);
        }
        else {
            var inputObj1_3 = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 : ''),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2_3.value });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            var inputObj2_3 = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 : ''),
                change: function (e) {
                    var element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1_3.value, 'data-value2': e.value });
                    }
                    else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1_3.appendTo(inputDiv1);
            inputObj2_3.appendTo(inputDiv2);
        }
    };
    /* tslint:enable */
    FilterDialog.prototype.updateInputValues = function (element, type, inputDiv1, inputDiv2) {
        var value1;
        var value2;
        if (type === 'date') {
            var inputObj1 = inputDiv1.ej2_instances[0];
            var inputObj2 = inputDiv2.ej2_instances[0];
            value1 = !isNullOrUndefined(inputObj1.value) ? inputObj1.value.toString() : '';
            value2 = !isNullOrUndefined(inputObj2.value) ? inputObj2.value.toString() : '';
        }
        else {
            var inputObj1 = inputDiv1.ej2_instances[0];
            var inputObj2 = inputDiv2.ej2_instances[0];
            value1 = inputObj1.value;
            value2 = inputObj2.value;
        }
        setStyleAndAttributes(element, { 'data-value1': value1, 'data-value2': value2 });
    };
    FilterDialog.prototype.validateTreeNode = function (e) {
        if (e.node.classList.contains(ICON_DISABLE)) {
            e.cancel = true;
        }
        else {
            return;
        }
    };
    /**
     * Update filter state while Member check/uncheck.
     * @hidden
     */
    FilterDialog.prototype.updateCheckedState = function (fieldCaption) {
        var filterDialog = this.dialogPopUp.element;
        setStyleAndAttributes(filterDialog, { 'role': 'menu', 'aria-haspopup': 'true' });
        var list = [].slice.call(this.memberTreeView.element.querySelectorAll('li'));
        var uncheckedNodes = this.getUnCheckedNodes();
        var checkedNodes = this.getCheckedNodes();
        var firstNode = this.allMemberSelect.element.querySelector('li').querySelector('span.' + CHECK_BOX_FRAME_CLASS);
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
    };
    FilterDialog.prototype.getCheckedNodes = function () {
        var checkeNodes = this.parent.searchTreeItems.filter(function (item) {
            return item.checkedStatus;
        });
        return checkeNodes;
    };
    FilterDialog.prototype.getUnCheckedNodes = function () {
        var unCheckeNodes = this.parent.searchTreeItems.filter(function (item) {
            return !item.checkedStatus;
        });
        return unCheckeNodes;
    };
    FilterDialog.prototype.isExcelFilter = function (fieldName) {
        var isFilterField = false;
        for (var _i = 0, _a = this.parent.dataSource.filters; _i < _a.length; _i++) {
            var field = _a[_i];
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
    };
    FilterDialog.prototype.getFilterObject = function (fieldName) {
        var filterObj = this.parent.eventBase.getFilterItemByName(fieldName);
        if (filterObj && (((['Label', 'Date', 'Number'].indexOf(filterObj.type) >= 0) &&
            this.parent.dataSource.allowLabelFilter) || (filterObj.type === 'Value' && this.parent.dataSource.allowValueFilter) ||
            (['Include', 'Exclude'].indexOf(filterObj.type) >= 0))) {
            return filterObj;
        }
        return undefined;
    };
    FilterDialog.prototype.closeFilterDialog = function () {
        if (this.allowExcelLikeFilter) {
            if (this.tabObj && !this.tabObj.isDestroyed) {
                this.tabObj.destroy();
            }
        }
        this.dialogPopUp.close();
    };
    FilterDialog.prototype.removeFilterDialog = function () {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_EditorTreeView')) {
            remove(document.getElementById(this.parent.parentID + '_EditorTreeView'));
        }
    };
    return FilterDialog;
}());

/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource
 * @hidden
 */
/** @hidden */
var PivotCommon = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for PivotEngine class
     * @param  {PivotEngine} pivotEngine?
     * @param  {DataOptions} dataSource?
     * @param  {string} element?
     * @hidden
     */
    function PivotCommon(control) {
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
    PivotCommon.prototype.destroy = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
    };
    return PivotCommon;
}());

/**
 * Module to render Pivot Field List Dialog
 */
/** @hidden */
var DialogRenderer = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function DialogRenderer(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the field list layout rendering
     * @returns void
     * @private
     */
    DialogRenderer.prototype.render = function () {
        var fieldListWrappper = createElement('div', {
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
    };
    DialogRenderer.prototype.renderStaticLayout = function (fieldListWrappper) {
        if (!this.parent.isAdaptive) {
            var layoutHeader = createElement('div', {
                className: FIELD_LIST_TITLE_CLASS
            });
            var headerContent = createElement('div', {
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
    };
    DialogRenderer.prototype.renderDeferUpdateButtons = function () {
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
    };
    DialogRenderer.prototype.createDeferUpdateButtons = function () {
        var layoutFooter = createElement('div', {
            className: LAYOUT_FOOTER
        });
        if (this.parent.allowDeferLayoutUpdate) {
            var checkBoxLayout = createElement('div', {
                className: CHECKBOX_LAYOUT
            });
            var deferUpdateCheckBox = createElement('input', {
                id: this.parent.element.id + 'DeferUpdateCheckBox'
            });
            checkBoxLayout.appendChild(deferUpdateCheckBox);
            layoutFooter.appendChild(checkBoxLayout);
        }
        var buttonLayout = createElement('div', {
            className: BUTTON_LAYOUT
        });
        if (this.parent.allowDeferLayoutUpdate) {
            var deferUpdateButton1 = createElement('button', {
                id: this.parent.element.id + '_DeferUpdateButton1'
            });
            buttonLayout.appendChild(deferUpdateButton1);
        }
        var deferUpdateButton2 = createElement('button', {
            id: this.parent.element.id + '_DeferUpdateButton2'
        });
        buttonLayout.appendChild(deferUpdateButton2);
        layoutFooter.appendChild(buttonLayout);
        return layoutFooter;
    };
    DialogRenderer.prototype.onCheckChange = function (args) {
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
    };
    DialogRenderer.prototype.applyButtonClick = function () {
        this.parent.updateDataSource(false);
        this.parent.clonedDataSource = extend({}, this.parent.dataSource, null, true);
        this.parent.clonedFieldList = extend({}, this.parent.pivotFieldList, null, true);
    };
    DialogRenderer.prototype.cancelButtonClick = function () {
        this.parent.
            setProperties({ dataSource: this.parent.clonedDataSource.properties }, true);
        this.parent.engineModule.fieldList = extend({}, this.parent.clonedFieldList, null, true);
        this.parent.updateDataSource(false, true);
    };
    DialogRenderer.prototype.renderFieldListDialog = function (fieldListWrappper) {
        var toggleFieldList = createElement('div', {
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
            var headerTemplate = '<div class=' + TITLE_MOBILE_HEADER + '><span class="' + ICON + ' ' +
                BACK_ICON + '"></span><div class=' + TITLE_MOBILE_CONTENT + '>' + this.parent.localeObj.getConstant('fieldList') +
                '</div></div>';
            var buttons = [{
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
            var footer = fieldListWrappper.querySelector('.' + FOOTER_CONTENT_CLASS);
            addClass([footer], FIELD_LIST_FOOTER_CLASS);
            removeClass([footer.querySelector('.' + ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS)], BUTTON_FLAT_CLASS);
            removeClass([footer.querySelector('.' + ADAPTIVE_FIELD_LIST_BUTTON_CLASS)], BUTTON_FLAT_CLASS);
            this.fieldListDialog.element.querySelector('.' + BACK_ICON).onclick =
                this.parent.allowDeferLayoutUpdate ? this.onDeferUpdateClick.bind(this) : this.onCloseFieldList.bind(this);
        }
        else {
            var template = this.createDeferUpdateButtons().outerHTML;
            var headerTemplate = '<div class=' + TITLE_HEADER_CLASS + '><div class=' +
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
    };
    /**
     * Called internally if any of the field added to axis.
     * @hidden
     */
    DialogRenderer.prototype.updateDataSource = function (selectedNodes) {
        var axis = ['filters', 'columns', 'rows', 'values'];
        for (var _i = 0, selectedNodes_1 = selectedNodes; _i < selectedNodes_1.length; _i++) {
            var field = selectedNodes_1[_i];
            var fieldName = field;
            var droppedClass = axis[this.adaptiveElement.selectedItem];
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
    };
    DialogRenderer.prototype.onDeferUpdateClick = function () {
        this.parent.updateDataSource();
        this.parent.dialogRenderer.fieldListDialog.hide();
    };
    DialogRenderer.prototype.renderAdaptiveLayout = function (fieldListWrappper) {
        var _this = this;
        var layoutFooter = createElement('div', {
            className: FIELD_LIST_FOOTER_CLASS
        });
        fieldListWrappper.appendChild(this.parentElement);
        var items = [
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
            selected: function (e) {
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
                    _this.adaptiveElement.items[4].content = '';
                    _this.adaptiveElement.dataBind();
                    _this.parent.notify(initCalculatedField, {});
                }
                else {
                    _this.parent.axisFieldModule.render();
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
    };
    DialogRenderer.prototype.createCalculatedButton = function () {
        var calculatedButton = createElement('div', {
            id: this.parent.element.id + '_CalculatedField'
        });
        var calculateField = new Button({
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
    };
    DialogRenderer.prototype.createAddButton = function () {
        var footerContainer = createElement('div', {
            className: FIELD_LIST_FOOTER_CLASS + '-content'
        });
        var fieldListButton = createElement('div', {});
        var calculatedButton = createElement('div', {});
        var calculateField = new Button({
            cssClass: ADAPTIVE_CALCULATED_FIELD_BUTTON_CLASS +
                ' ' + BUTTON_SMALL_CLASS + ' ' + BUTTON_ROUND_CLASS + ' ' + ICON_DISABLE,
            iconCss: ICON + ' ' + ADD_ICON_CLASS,
            enableRtl: this.parent.enableRtl
        });
        var fieldList = new Button({
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
    };
    DialogRenderer.prototype.createAxisTable = function (axis) {
        var axisWrapper = createElement('div', {
            className: FIELD_LIST_CLASS + '-' + axis
        });
        var axisContent = createElement('div', { className: AXIS_CONTENT_CLASS + ' ' + 'e-' + axis });
        var axisPrompt = createElement('span', {
            className: AXIS_PROMPT_CLASS,
            innerHTML: this.parent.localeObj.getConstant('addPrompt')
        });
        axisWrapper.appendChild(axisContent);
        axisWrapper.appendChild(axisPrompt);
        return axisWrapper;
    };
    DialogRenderer.prototype.showCalculatedField = function (event) {
        if (!this.parent.isAdaptive) {
            if (this.parent.dialogRenderer.fieldListDialog) {
                this.parent.dialogRenderer.fieldListDialog.hide();
                addClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
            }
        }
        this.parent.notify(initCalculatedField, {});
    };
    DialogRenderer.prototype.showFieldListDialog = function (event) {
        var activeindex = this.adaptiveElement.selectedItem;
        this.parent.treeViewModule.render(activeindex);
    };
    DialogRenderer.prototype.onShowFieldList = function () {
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
    };
    DialogRenderer.prototype.onCloseFieldList = function () {
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
    };
    DialogRenderer.prototype.removeFieldListIcon = function () {
        if (!document.getElementById(this.parent.element.id + 'calculateddialog')) {
            removeClass([this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
        }
    };
    DialogRenderer.prototype.keyPress = function (e) {
        var target = e.target;
        if (e.keyCode === 13 && e.target) {
            e.target.click();
            e.preventDefault();
            return;
        }
    };
    DialogRenderer.prototype.wireDialogEvent = function (element) {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.onShowFieldList, this);
    };
    DialogRenderer.prototype.unWireDialogEvent = function (element) {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.onShowFieldList);
    };
    return DialogRenderer;
}());

/**
 * Module to render Field List
 */
/** @hidden */
var TreeViewRenderer = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function TreeViewRenderer(parent) {
        this.selectedNodes = [];
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    TreeViewRenderer.prototype.render = function (axis) {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        if (!this.parent.isAdaptive) {
            var fieldTable = createElement('div', { className: FIELD_TABLE_CLASS });
            var treeHeader = createElement('div', {
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
                var centerDiv = createElement('div', { className: STATIC_CENTER_DIV_CLASS });
                var axisHeader = createElement('div', {
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
    };
    TreeViewRenderer.prototype.renderTreeView = function () {
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
    };
    TreeViewRenderer.prototype.renderTreeDialog = function (axis) {
        var _this = this;
        var fieldListDialog = createElement('div', {
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
            close: function () {
                if (document.getElementById(_this.parent.element.id + '_FieldListTreeView')) {
                    remove(document.getElementById(_this.parent.element.id + '_FieldListTreeView'));
                }
            }
        });
        this.fieldDialog.appendTo(fieldListDialog);
    };
    TreeViewRenderer.prototype.createTreeView = function (treeData) {
        var _this = this;
        var editorTreeWrapper = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: EDITOR_TREE_WRAPPER_CLASS
        });
        var searchWrapper = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: EDITOR_SEARCH_WRAPPER_CLASS
        });
        var editorSearch = createElement('input', { attrs: { 'type': 'text' } });
        searchWrapper.appendChild(editorSearch);
        var treeViewContainer = createElement('div', { className: EDITOR_TREE_CONTAINER_CLASS });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            cssClass: EDITOR_SEARCH_CLASS,
            change: function (e) {
                _this.parent.pivotCommon.eventBase.searchTreeNodes(e, _this.fieldTable, true);
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
    };
    TreeViewRenderer.prototype.dragStart = function (args) {
        if (args.event.target.classList.contains(DRAG_CLASS)) {
            this.parent.isDragging = true;
            addClass([args.draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
            var data = this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
            var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
            if (data && data.aggregateType === 'CalculatedField') {
                for (var _i = 0, axis_1 = axis; _i < axis_1.length; _i++) {
                    var axisContent = axis_1[_i];
                    addClass([this.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
                }
            }
        }
        else {
            args.cancel = true;
        }
    };
    TreeViewRenderer.prototype.dragStop = function (args) {
        args.cancel = true;
        this.parent.isDragging = false;
        var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        for (var _i = 0, axis_2 = axis; _i < axis_2.length; _i++) {
            var axisElement = axis_2[_i];
            removeClass([this.parentElement.querySelector('.' + axisElement)], NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + LIST_TEXT_CLASS)], SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        var fieldName = args.draggedNodeData.id.toString();
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
    };
    TreeViewRenderer.prototype.isNodeDropped = function (args, targetID) {
        var isDropped = true;
        if (args.draggedNodeData.isChecked === 'true') {
            var target = this.getButton(targetID);
            var axisPanel = closest(target, '.' + DROPPABLE_CLASS);
            var droppableElement = closest(args.target, '.' + DROPPABLE_CLASS);
            if (target && axisPanel === droppableElement) {
                var pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
                var dropTarget = closest(args.target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
                var sourcePosition = void 0;
                var dropPosition = -1;
                for (var i = 0, n = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        var droppableButton = dropTarget.querySelector('.' + PIVOT_BUTTON_CLASS);
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    var parentElement = document.getElementById(this.parent.element.id + '_Wrapper');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    };
    TreeViewRenderer.prototype.getButton = function (fieldName) {
        var wrapperElement = document.getElementById(this.parent.element.id + '_Wrapper');
        var pivotButtons = [].slice.call(wrapperElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
        var buttonElement;
        for (var i = 0, n = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i].id === fieldName) {
                buttonElement = pivotButtons[i];
                break;
            }
        }
        return buttonElement;
    };
    TreeViewRenderer.prototype.nodeStateChange = function (args) {
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        var node = closest(args.node, '.' + TEXT_CONTENT_CLASS);
        var list = this.parent.pivotFieldList;
        var selectedNode = list[args.data[0].id.toString()];
        if (args.action === 'check') {
            addClass([node.querySelector('.' + LIST_TEXT_CLASS)], LIST_SELECT_CLASS);
            var addNode = this.parent.pivotCommon.dataSourceUpdate.getNewField(args.data[0].id.toString());
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
    };
    TreeViewRenderer.prototype.updateDataSource = function () {
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.renderMode === 'Popup') {
            this.parent.pivotGridModule.engineModule = this.parent.engineModule;
            this.parent.pivotGridModule.
                setProperties({ dataSource: this.parent.dataSource.properties }, true);
            this.parent.pivotGridModule.notify(uiUpdate, this);
        }
        else {
            this.parent.triggerPopulateEvent();
        }
    };
    TreeViewRenderer.prototype.addNode = function (args) {
        var fieldList = this.parent.pivotFieldList;
        var selectedNode = fieldList[args.data[0].id.toString()];
        if (args.action === 'check') {
            this.selectedNodes.push(selectedNode.id.toString());
        }
        else {
            var count = this.selectedNodes.length;
            while (count--) {
                if (this.selectedNodes[count] === selectedNode.id.toString()) {
                    this.selectedNodes.splice(count, 1);
                    break;
                }
            }
        }
    };
    TreeViewRenderer.prototype.getTreeUpdate = function () {
        var liElements = [].slice.call(this.treeViewElement.querySelectorAll('.' + TEXT_CONTENT_CLASS));
        for (var _i = 0, liElements_1 = liElements; _i < liElements_1.length; _i++) {
            var liElement = liElements_1[_i];
            var dragElement = createElement('span', {
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
    };
    TreeViewRenderer.prototype.refreshTreeView = function () {
        if (this.fieldTable) {
            this.fieldTable.fields = { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected' };
            this.fieldTable.dataBind();
            this.getTreeUpdate();
        }
    };
    TreeViewRenderer.prototype.getTreeData = function (axis) {
        var data = [];
        var keys = Object.keys(this.parent.pivotFieldList);
        var fieldList = extend({}, this.parent.pivotFieldList, null, true);
        if (this.parent.isAdaptive) {
            var fields = [this.parent.dataSource.filters, this.parent.dataSource.columns, this.parent.dataSource.rows,
                this.parent.dataSource.values];
            var currentFieldSet = fields[axis];
            var len = keys.length;
            while (len--) {
                fieldList[keys[len]].isSelected = false;
            }
            for (var _i = 0, currentFieldSet_1 = currentFieldSet; _i < currentFieldSet_1.length; _i++) {
                var item = currentFieldSet_1[_i];
                fieldList[item.name].isSelected = true;
            }
        }
        var list = fieldList;
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var member = keys_1[_a];
            var obj = list[member];
            data.push(obj);
        }
        return data;
    };
    TreeViewRenderer.prototype.onFieldAdd = function (e) {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    };
    TreeViewRenderer.prototype.closeTreeDialog = function () {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    };
    /**
     * @hidden
     */
    TreeViewRenderer.prototype.addEventListener = function () {
        this.parent.on(treeViewUpdate, this.refreshTreeView, this);
    };
    /**
     * @hidden
     */
    TreeViewRenderer.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(treeViewUpdate, this.refreshTreeView);
    };
    /**
     * To destroy the tree view event listener
     * @return {void}
     * @hidden
     */
    TreeViewRenderer.prototype.destroy = function () {
        this.removeEventListener();
    };
    return TreeViewRenderer;
}());

/**
 * Module to render Axis Field Table
 */
/** @hidden */
var AxisTableRenderer = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function AxisTableRenderer(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the axis table rendering
     * @returns void
     * @private
     */
    AxisTableRenderer.prototype.render = function () {
        if (!this.parent.isAdaptive) {
            var axisTable = createElement('div', { className: AXIS_TABLE_CLASS });
            this.leftAxisPanel = createElement('div', { className: LEFT_AXIS_PANEL_CLASS });
            this.rightAxisPanel = createElement('div', { className: RIGHT_AXIS_PANEL_CLASS });
            this.parent.dialogRenderer.parentElement.appendChild(axisTable);
            axisTable.appendChild(this.leftAxisPanel);
            axisTable.appendChild(this.rightAxisPanel);
            this.axisTable = axisTable;
            this.renderAxisTable();
        }
        this.parent.axisFieldModule.render();
    };
    AxisTableRenderer.prototype.renderAxisTable = function () {
        var fieldLabels = ['filters', 'rows', 'columns', 'values'];
        for (var len = 0, lnt = fieldLabels.length; len < lnt; len++) {
            var axis = createElement('div', {
                className: FIELD_LIST_CLASS + '-' + fieldLabels[len]
            });
            var axisTitleWrapper = createElement('div', {
                className: AXIS_ICON_CLASS + '-wrapper'
            });
            var axisTitle = createElement('div', {
                className: AXIS_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant(fieldLabels[len])
            });
            axisTitleWrapper.appendChild(this.getIconupdate(fieldLabels[len]));
            axisTitleWrapper.appendChild(axisTitle);
            var axisContent = createElement('div', { className: AXIS_CONTENT_CLASS + ' ' + 'e-' + fieldLabels[len] });
            var localePrompt = void 0;
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
            var axisPrompt = createElement('span', {
                className: AXIS_PROMPT_CLASS,
                innerHTML: localePrompt
            });
            var droppable = new Droppable(axisContent, {});
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
    };
    AxisTableRenderer.prototype.getIconupdate = function (axis) {
        var axisWrapper = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
            className: AXIS_ICON_CLASS + '-icon-wrapper'
        });
        var axisElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: ICON + ' ' + AXIS_ICON_CLASS + '-' + axis
        });
        axisWrapper.appendChild(axisElement);
        return axisWrapper;
    };
    AxisTableRenderer.prototype.wireEvent = function (element) {
        EventHandler.add(element, 'mouseover', this.updateDropIndicator, this);
        EventHandler.add(element, 'mouseleave', this.updateDropIndicator, this);
    };
    AxisTableRenderer.prototype.unWireEvent = function (element) {
        EventHandler.remove(element, 'mouseover', this.updateDropIndicator);
        EventHandler.remove(element, 'mouseleave', this.updateDropIndicator);
    };
    AxisTableRenderer.prototype.updateDropIndicator = function (e) {
        var parentElement = this.parent.dialogRenderer.parentElement;
        if (this.parent.isDragging && e.target.classList.contains(AXIS_CONTENT_CLASS) && e.type === 'mouseover') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            var element = [].slice.call(e.target.querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
            if (element.length > 0) {
                addClass([element[element.length - 1].querySelector('.' + DROP_INDICATOR_CLASS + '-last')], INDICATOR_HOVER_CLASS);
            }
        }
        else if (e.type === 'mouseleave') {
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
    };
    return AxisTableRenderer;
}());

/**
 * `AggregateMenu` module to create aggregate type popup.
 */
/** @hidden */
var AggregateMenu = /** @__PURE__ @class */ (function () {
    /**
     * Constructor for the rener action.
     * @hidden
     */
    function AggregateMenu(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot table rendering
     * @returns void
     * @private
     */
    AggregateMenu.prototype.render = function (args, parentElement) {
        this.parentElement = parentElement;
        this.openContextMenu(args);
    };
    AggregateMenu.prototype.openContextMenu = function (args) {
        if (this.menuInfo === undefined) {
            this.createContextMenu();
        }
        this.currentMenu = args.currentTarget;
        var pos = this.currentMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuInfo.open(pos.top, pos.left - 105);
        }
        else {
            this.menuInfo.open(pos.top, pos.left);
        }
    };
    AggregateMenu.prototype.createContextMenu = function () {
        var menuItems = [
            { text: 'Sum', id: 'Sum' },
            { text: 'Count', id: 'Count' },
            { text: 'Distinct Count', id: 'DistinctCount' },
            { text: 'Product', id: 'Product' },
            { text: 'Avg', id: 'Avg' },
            { text: 'Min', id: 'Min' },
            { text: 'Max', id: 'Max' },
            { text: 'More...', id: 'MoreOption' }
        ];
        var menuOptions = {
            items: menuItems,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.beforeMenuOpen.bind(this),
            select: this.selectOptionInContextMenu.bind(this)
        };
        var removeContextMenu = document.getElementById(this.parent.element.id + 'valueFieldContextMenu');
        if (removeContextMenu !== null) {
            removeContextMenu.innerHTML = '';
        }
        this.parent.element.appendChild(createElement('ul', {
            id: this.parent.element.id + 'valueFieldContextMenu'
        }));
        this.menuInfo = new ContextMenu$1(menuOptions);
        this.menuInfo.appendTo('#' + this.parent.element.id + 'valueFieldContextMenu');
    };
    AggregateMenu.prototype.beforeMenuOpen = function (args) {
        args.element.style.zIndex = (this.menuInfo.element.style.zIndex + 3).toString();
        args.element.style.display = 'inline';
    };
    AggregateMenu.prototype.createValueSettingsDialog = function (target) {
        var _this = this;
        var valueDialog = createElement('div', {
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
                    click: function () { _this.valueDialog.hide(); },
                    buttonModel: { cssClass: CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }
            ],
            closeOnEscape: true,
            target: this.parentElement,
            overlayClick: function () { _this.removeDialog(); },
            close: this.removeDialog.bind(this)
        });
        this.valueDialog.appendTo(valueDialog);
    };
    /* tslint:disable:all */
    AggregateMenu.prototype.createFieldOptions = function (buttonElement) {
        var fieldCaption = buttonElement.getAttribute('data-caption');
        var summaryType = buttonElement.getAttribute('data-type');
        var baseField = buttonElement.getAttribute('data-basefield');
        var baseItem = buttonElement.getAttribute('data-baseitem');
        summaryType = (summaryType.toString() !== 'undefined' ? summaryType : 'Sum');
        var summaryDataSource = [
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
        var baseItemTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom'];
        var baseFieldTypes = ['DifferenceFrom', 'PercentageOfDifferenceFrom', 'PercentageOfParentTotal'];
        var dataFields = extend([], this.parent.dataSource.rows, null, true);
        dataFields = dataFields.concat(this.parent.dataSource.columns);
        var fieldDataSource = [];
        var fieldItemDataSource = [];
        // let summaryDataSource: { [key: string]: Object }[] = [];
        // for (let type of summaryTypes) {
        //     summaryDataSource.push({ value: type, text: type });
        // }
        for (var _i = 0, dataFields_1 = dataFields; _i < dataFields_1.length; _i++) {
            var field = dataFields_1[_i];
            var value = field.name;
            var text = (field.caption ? field.caption : field.name);
            fieldDataSource.push({ value: value, text: text });
        }
        baseField = (baseField.toString() !== 'undefined' ? baseField : fieldDataSource[0].value);
        fieldItemDataSource = Object.keys(this.parent.engineModule.fieldList[(baseField.toString() !== 'undefined' ?
            baseField : fieldDataSource[0].value)].formattedMembers);
        baseItem = (baseItem.toString() !== 'undefined' ? baseItem : fieldItemDataSource[0]);
        var mainDiv = createElement('div', {
            className: 'e-value-field-div-content', id: this.parentElement.id + '_field_div_content',
            attrs: { 'data-type': summaryType, 'data-caption': fieldCaption, 'data-basefield': baseField, 'data-baseitem': baseItem }
        });
        var textWrappper = createElement('div', { className: 'e-field-name-text-wrapper', });
        var filterWrapperDiv1 = createElement('div', { className: 'e-field-option-wrapper' });
        var optionWrapperDiv1 = createElement('div', { className: 'e-type-option-wrapper' });
        var optionWrapperDiv2 = createElement('div', { className: 'e-base-field-option-wrapper' });
        var optionWrapperDiv3 = createElement('div', { className: 'e-base-item-option-wrapper' });
        var texttitle = createElement('div', { className: 'e-field-name-title', innerHTML: this.parent.localeObj.getConstant('sourceName') + '&nbsp;' });
        var textContent = createElement('div', { className: 'e-field-name-content', innerHTML: buttonElement.id.toString() });
        var inputTextDiv1 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('sourceCaption')
        });
        var optionTextDiv1 = createElement('div', {
            className: 'e-base-field-option-text', innerHTML: this.parent.localeObj.getConstant('summarizeValuesBy')
        });
        var optionTextDiv2 = createElement('div', {
            className: 'e-base-item-option-text', innerHTML: this.parent.localeObj.getConstant('baseField')
        });
        var optionTextDiv3 = createElement('div', {
            className: 'e-type-option-text', innerHTML: this.parent.localeObj.getConstant('baseItem')
        });
        var inputDiv1 = createElement('div', { className: 'e-caption-input-wrapper' });
        var dropOptionDiv1 = createElement('div', { id: this.parentElement.id + '_type_option' });
        var dropOptionDiv2 = createElement('div', { id: this.parentElement.id + '_base_field_option' });
        var dropOptionDiv3 = createElement('div', { id: this.parentElement.id + '_base_item_option' });
        var inputField1 = createElement('input', {
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
        var popupInstance = this;
        var optionWrapper1 = new DropDownList({
            dataSource: summaryDataSource,
            fields: { value: 'value', text: 'text' },
            value: summaryType,
            // popupWidth: 'auto',
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                optionWrapper2.enabled = baseFieldTypes.indexOf(args.value) !== -1 ? true : false;
                optionWrapper3.enabled = baseItemTypes.indexOf(args.value) !== -1 ? true : false;
            }
        });
        optionWrapper1.appendTo(dropOptionDiv1);
        var optionWrapper2 = new DropDownList({
            dataSource: fieldDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' },
            value: baseField,
            // popupWidth: 'auto',
            enabled: (baseFieldTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: VALUE_OPTIONS_CLASS, width: '100%',
            change: function (args) {
                fieldItemDataSource = Object.keys(popupInstance.parent.engineModule.fieldList[args.value].formattedMembers);
                optionWrapper3.dataSource = fieldItemDataSource;
                optionWrapper3.value = fieldItemDataSource[0];
                optionWrapper3.filterBarPlaceholder = popupInstance.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0];
                optionWrapper3.dataBind();
            }
        });
        optionWrapper2.appendTo(dropOptionDiv2);
        var optionWrapper3 = new DropDownList({
            dataSource: fieldItemDataSource, enableRtl: this.parent.enableRtl,
            value: baseItem,
            // popupWidth: 'auto',
            allowFiltering: true,
            filterBarPlaceholder: this.parent.localeObj.getConstant('example') + ' ' + fieldItemDataSource[0],
            enabled: (baseItemTypes.indexOf(summaryType) !== -1 ? true : false),
            cssClass: FILTER_OPERATOR_CLASS, width: '100%',
        });
        optionWrapper3.appendTo(dropOptionDiv3);
        var inputObj1 = new MaskedTextBox({
            placeholder: 'Enter field caption',
            // floatLabelType: 'Auto',
            enableRtl: this.parent.enableRtl,
            value: fieldCaption, width: '100%'
        });
        inputObj1.appendTo(inputField1);
        return mainDiv;
    };
    /* tslint:enable:all */
    AggregateMenu.prototype.selectOptionInContextMenu = function (menu) {
        if (menu.item.text !== null) {
            var buttonElement = this.currentMenu.parentElement;
            if (menu.item.id === 'MoreOption') {
                this.createValueSettingsDialog(buttonElement);
            }
            else {
                var field = buttonElement.getAttribute('data-uid');
                var valuefields = this.parent.dataSource.values;
                var contentElement = buttonElement.querySelector('.e-content');
                var captionName = menu.item.text + ' ' + 'of' + ' ' + this.parent.engineModule.fieldList[field].caption;
                contentElement.innerHTML = captionName;
                contentElement.setAttribute('title', captionName);
                buttonElement.setAttribute('data-type', menu.item.id);
                for (var vCnt = 0; vCnt < this.parent.dataSource.values.length; vCnt++) {
                    if (this.parent.dataSource.values[vCnt].name === field) {
                        var dataSourceItem = valuefields[vCnt].properties ?
                            valuefields[vCnt].properties : valuefields[vCnt];
                        dataSourceItem.type = menu.item.id;
                        /* tslint:disable-next-line:no-any */
                    }
                }
                this.updateDataSource();
            }
        }
    };
    AggregateMenu.prototype.updateDataSource = function (isRefreshed) {
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
    };
    AggregateMenu.prototype.updateValueSettings = function () {
        var dialogElement = this.valueDialog.element;
        var captionInstance = getInstance('#' + this.parentElement.id + 'type_input_option', MaskedTextBox);
        var summaryInstance = getInstance('#' + this.parentElement.id + '_type_option', DropDownList);
        var baseFieldInstance = getInstance('#' + this.parentElement.id + '_base_field_option', DropDownList);
        var baseItemInstance = getInstance('#' + this.parentElement.id + '_base_item_option', DropDownList);
        var fieldName = dialogElement.getAttribute('data-field');
        var buttonElement = this.parentElement.querySelector('.' + PIVOT_BUTTON_CLASS + '#' + fieldName);
        var contentElement = buttonElement.querySelector('.e-content');
        var captionName = this.parent.localeObj.getConstant(summaryInstance.value) + ' ' + 'of' + ' ' + captionInstance.value;
        contentElement.innerHTML = captionName;
        contentElement.setAttribute('title', captionName);
        buttonElement.setAttribute('data-type', summaryInstance.value);
        buttonElement.setAttribute('data-caption', captionInstance.value);
        buttonElement.setAttribute('data-basefield', baseFieldInstance.value);
        buttonElement.setAttribute('data-baseitem', baseItemInstance.value);
        var selectedField = this.parent.pivotCommon.eventBase.getFieldByName(fieldName, this.parent.dataSource.values);
        selectedField = selectedField.properties ?
            selectedField.properties : selectedField;
        selectedField.caption = captionInstance.value;
        selectedField.type = summaryInstance.value;
        selectedField.baseField = baseFieldInstance.value;
        selectedField.baseItem = baseItemInstance.value;
        this.valueDialog.close();
        // this.parent.axisFieldModule.render();
        this.updateDataSource(true);
    };
    AggregateMenu.prototype.removeDialog = function () {
        if (this.valueDialog && !this.valueDialog.isDestroyed) {
            this.valueDialog.destroy();
        }
        if (document.getElementById(this.parentElement.id + '_ValueDialog')) {
            remove(document.getElementById(this.parentElement.id + '_ValueDialog'));
        }
    };
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    AggregateMenu.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        if (this.menuInfo && !this.menuInfo.isDestroyed) {
            this.menuInfo.destroy();
        }
        else {
            return;
        }
    };
    return AggregateMenu;
}());

/**
 * Module to render Pivot button
 */
/** @hidden */
var PivotButton = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function PivotButton(parent) {
        this.parent = parent;
        this.menuOption = new AggregateMenu(this.parent);
        this.parent.pivotButtonModule = this;
        this.addEventListener();
    }
    /* tslint:disable */
    PivotButton.prototype.renderPivotButton = function (args) {
        var field = extend([], args.field, null, true);
        var axis = args.axis;
        var axisElement;
        var valuePos = -1;
        var showValuesButton = (this.parent.getModuleName() == "pivotfieldlist" &&
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
                var axisPrompt = this.parentElement.querySelector('.' + FIELD_LIST_CLASS + '-' + axis)
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
                var axisPrompt = createElement('span', {
                    className: AXIS_PROMPT_CLASS,
                    innerHTML: axis === 'rows' ? this.parent.localeObj.getConstant('rowAxisPrompt') :
                        axis === 'columns' ? this.parent.localeObj.getConstant('columnAxisPrompt') :
                            axis === 'values' ? this.parent.localeObj.getConstant('valueAxisPrompt') :
                                this.parent.localeObj.getConstant('filterAxisPrompt')
                });
                axisElement.appendChild(axisPrompt);
            }
            else {
                for (var i = 0, cnt = field.length; i < cnt; i++) {
                    var buttonWrapper = createElement('div', {
                        className: PIVOT_BUTTON_WRAPPER_CLASS + (i === 0 ? ' e-first-btn' : ''),
                        attrs: { 'data-tag': axis + ':' + field[i].name }
                    });
                    var buttonElement = createElement('div', {
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
                    var dropIndicatorElement = createElement('span', {
                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                        className: DROP_INDICATOR_CLASS
                    });
                    var dropLastIndicatorElement = createElement('span', {
                        attrs: { 'tabindex': '-1', 'aria-disabled': 'false' },
                        className: DROP_INDICATOR_CLASS + '-last'
                    });
                    var dragWrapper = this.createButtonDragIcon(buttonElement);
                    var contentElement = this.createButtonText(field, i, axis, valuePos);
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
                    var removeElement = createElement('span', {
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
                    var pivotButton = new Button({ enableRtl: this.parent.enableRtl });
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
    };
    PivotButton.prototype.createButtonText = function (field, i, axis, valuePos) {
        var buttonText;
        var aggregation;
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
        var text = field[i].caption ? field[i].caption : field[i].name;
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
    };
    PivotButton.prototype.getTypeStatus = function (field, i, buttonElement) {
        var fieldListItem = this.parent.engineModule.fieldList[field[i].name];
        if (fieldListItem.aggregateType !== 'CalculatedField' &&
            fieldListItem.type === 'number') {
            this.createSummaryType(buttonElement, field[i].name);
        }
    };
    PivotButton.prototype.createSummaryType = function (pivotButton, fieldName) {
        var spanElement = createElement('span', {
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
    };
    PivotButton.prototype.createMenuOption = function (args) {
        this.menuOption.render(args, this.parentElement);
        this.parent.pivotButtonModule = this;
    };
    PivotButton.prototype.createDraggable = function (target) {
        this.draggable = new Draggable(target, {
            clone: true,
            enableTailMode: true,
            enableAutoScroll: true,
            helper: this.createDragClone.bind(this),
            dragStart: this.onDragStart.bind(this),
            drag: this.onDragging.bind(this),
            dragStop: this.onDragStop.bind(this)
        });
    };
    PivotButton.prototype.createButtonDragIcon = function (pivotButton) {
        var dragWrapper = createElement('span', {
            attrs: { 'tabindex': '-1', 'aria-disabled': 'false' }
        });
        var dragElement = createElement('span', {
            attrs: {
                'tabindex': '-1', 'aria-disabled': 'false'
            },
            className: ICON + ' ' + DRAG_CLASS
        });
        dragWrapper.appendChild(dragElement);
        pivotButton.appendChild(dragWrapper);
        return dragWrapper;
    };
    PivotButton.prototype.createSortOption = function (pivotButton, fieldName) {
        var sortCLass;
        if (!this.parent.allowDeferLayoutUpdate) {
            sortCLass = this.parent.engineModule.fieldList[fieldName].sort === 'Descending' ? SORT_DESCEND_CLASS : '';
        }
        else {
            sortCLass = '';
            for (var i = 0; i < this.parent.dataSource.sortSettings.length; i++) {
                if (this.parent.dataSource.sortSettings[i].name === fieldName) {
                    sortCLass = this.parent.dataSource.sortSettings[i].order === 'Descending' ? SORT_DESCEND_CLASS : '';
                }
            }
        }
        var spanElement = createElement('span', {
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
    };
    PivotButton.prototype.createFilterOption = function (pivotButton, fieldName) {
        var filterCLass;
        if (!this.parent.allowDeferLayoutUpdate) {
            filterCLass = this.parent.engineModule.fieldList[fieldName].filter.length === 0 ?
                !this.parent.engineModule.fieldList[fieldName].isExcelFilter ? FILTER_CLASS : FILTERED_CLASS : FILTERED_CLASS;
        }
        else {
            filterCLass = FILTER_CLASS;
            for (var i = 0; i < this.parent.dataSource.filterSettings.length; i++) {
                if (this.parent.dataSource.filterSettings[i].name === fieldName) {
                    filterCLass = FILTERED_CLASS;
                }
            }
        }
        var spanElement = createElement('span', {
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
    };
    PivotButton.prototype.createDragClone = function (args) {
        var element = closest(args.element, '.' + PIVOT_BUTTON_CLASS);
        var cloneElement = createElement('div', {
            id: this.parent.element.id + '_DragClone',
            className: DRAG_CLONE_CLASS
        });
        var contentElement = createElement('span', {
            className: TEXT_CONTENT_CLASS,
            innerHTML: element.textContent
        });
        cloneElement.appendChild(contentElement);
        document.body.appendChild(cloneElement);
        return cloneElement;
    };
    PivotButton.prototype.onDragStart = function (e) {
        this.parent.isDragging = true;
        var element = closest(e.element, '.' + PIVOT_BUTTON_CLASS);
        var data = this.parent.engineModule.fieldList[element.getAttribute('data-uid')];
        var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        addClass([element], SELECTED_NODE_CLASS);
        if (data && data.aggregateType === 'CalculatedField') {
            for (var _i = 0, axis_1 = axis; _i < axis_1.length; _i++) {
                var axisContent = axis_1[_i];
                addClass([this.parentElement.querySelector('.' + axisContent)], NO_DRAG_CLASS);
            }
        }
    };
    PivotButton.prototype.onDragging = function (e) {
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
    };
    PivotButton.prototype.onDragStop = function (args) {
        this.parent.isDragging = false;
        var element = closest(args.element, '.' + PIVOT_BUTTON_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + PIVOT_BUTTON_CLASS)), SELECTED_NODE_CLASS);
        removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
        var axis = [ROW_AXIS_CLASS, COLUMN_AXIS_CLASS, FILTER_AXIS_CLASS];
        for (var _i = 0, axis_2 = axis; _i < axis_2.length; _i++) {
            var axisContent = axis_2[_i];
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
    };
    PivotButton.prototype.isButtonDropped = function (dropTarget, target) {
        var axisPanel = closest(target, '.' + DROPPABLE_CLASS);
        var droppableElement = closest(dropTarget, '.' + DROPPABLE_CLASS);
        var isDropped = true;
        if (axisPanel === droppableElement) {
            var pivotButtons = [].slice.call(axisPanel.querySelectorAll('.' + PIVOT_BUTTON_CLASS));
            var droppableTarget = closest(dropTarget, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
            var sourcePosition = void 0;
            var droppedPosition = -1;
            for (var i = 0, n = pivotButtons.length; i < n; i++) {
                if (pivotButtons[i].id === target.id) {
                    sourcePosition = i;
                }
                if (droppableTarget) {
                    var droppableButton = droppableTarget.querySelector('.' + PIVOT_BUTTON_CLASS);
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
    };
    PivotButton.prototype.updateSorting = function (args) {
        if (((this.parent.getModuleName() === 'pivotview' && this.parent.enableValueSorting) ||
            (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.pivotGridModule !== undefined &&
                this.parent.pivotGridModule.enableValueSorting)) &&
            args.target.parentElement.parentElement.getAttribute('data-tag').split(':')[0] === 'rows') {
            this.parent.dataSource.valueSortSettings.headerText = '';
        }
        this.parent.pivotCommon.eventBase.updateSorting(args);
        this.updateDataSource(true);
    };
    PivotButton.prototype.updateDataSource = function (isRefreshGrid) {
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
    };
    PivotButton.prototype.updateFiltering = function (args) {
        this.parent.pivotCommon.eventBase.updateFiltering(args);
        var target = args.target;
        var fieldName = target.parentElement.id;
        this.dialogPopUp = this.parent.pivotCommon.filterDialog.dialogPopUp;
        this.memberTreeView = this.parent.pivotCommon.filterDialog.memberTreeView;
        this.parent.pivotCommon.filterDialog.memberTreeView.nodeChecked = this.nodeStateModified.bind(this);
        this.parent.pivotCommon.filterDialog.allMemberSelect.nodeChecked = this.nodeStateModified.bind(this);
        this.bindDialogEvents(fieldName);
    };
    PivotButton.prototype.bindDialogEvents = function (fieldName) {
        var _this = this;
        if (this.parent.pivotCommon.filterDialog.allowExcelLikeFilter && this.parent.pivotCommon.filterDialog.tabObj) {
            this.updateDialogButtonEvents(this.parent.pivotCommon.filterDialog.tabObj.selectedItem, fieldName);
            this.dialogPopUp.buttons[1].click = this.ClearFilter.bind(this);
            this.parent.pivotCommon.filterDialog.tabObj.selected = function (e) {
                _this.updateDialogButtonEvents(e.selectedIndex, fieldName);
                removeClass([].slice.call(_this.dialogPopUp.element.querySelectorAll('.e-selected-tab')), 'e-selected-tab');
                if (e.selectedIndex > 0) {
                    /* tslint:disable-next-line:max-line-length */
                    addClass([_this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (e.selectedIndex === 1 && _this.parent.dataSource.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
                }
                if (e.selectedIndex === 0) {
                    _this.parent.pivotCommon.filterDialog.updateCheckedState();
                }
                else {
                    _this.dialogPopUp.buttons[0].buttonModel.disabled = false;
                    _this.dialogPopUp.element.querySelector('.' + OK_BUTTON_CLASS).removeAttribute('disabled');
                }
            };
        }
        else {
            this.updateDialogButtonEvents(0, fieldName);
        }
    };
    PivotButton.prototype.updateDialogButtonEvents = function (index, fieldName) {
        this.dialogPopUp.buttons[0].click = (index === 0 ?
            this.updateFilterState.bind(this, fieldName) : this.updateCustomFilter.bind(this));
    };
    PivotButton.prototype.updateCustomFilter = function (args) {
        var dialogElement = this.dialogPopUp.element.querySelector('.e-selected-tab');
        var fieldName = dialogElement.getAttribute('data-fieldname');
        var filterType = dialogElement.getAttribute('data-type');
        var measure = dialogElement.getAttribute('data-measure');
        var operator = dialogElement.getAttribute('data-operator');
        var operand1 = dialogElement.getAttribute('data-value1');
        var operand2 = dialogElement.getAttribute('data-value2');
        var type = ((filterType === 'value') ? 'Value' : (filterType === 'date') ? 'Date' :
            (filterType === 'number') ? 'Number' : 'Label');
        var filterItem = {
            name: fieldName,
            type: type,
            measure: measure,
            condition: operator,
            value1: filterType === 'date' ? new Date(operand1) : operand1,
            value2: filterType === 'date' ? new Date(operand2) : operand2
        };
        if ((isNullOrUndefined(operand1) || operand1 === '') ||
            (['Between', 'NotBetween'].indexOf(operator) > -1 && (isNullOrUndefined(operand2) || operand2 === ''))) {
            var inputElementString = (type.toLowerCase() + ((isNullOrUndefined(operand1) || operand1 === '') ? '_input_option_1' : '_input_option_2'));
            var focusElement = dialogElement.querySelector('#' + this.parent.element.id + '_' + inputElementString);
            addClass([focusElement], EMPTY_FIELD);
            focusElement.focus();
            return;
        }
        var filterObject = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
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
    };
    PivotButton.prototype.ClearFilter = function (e) {
        var dialogElement = this.dialogPopUp.element;
        var fieldName = dialogElement.getAttribute('data-fieldname');
        this.dialogPopUp.close();
        this.removeDataSourceSettings(fieldName);
        this.refreshPivotButtonState(fieldName, false);
        this.updateDataSource(true);
    };
    PivotButton.prototype.removeButton = function (args) {
        var target = args.target;
        var fieldName = target.parentElement.id;
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
    };
    PivotButton.prototype.nodeStateModified = function (args) {
        var target = args.node.parentElement.parentElement;
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
            var pos = this.parent.pivotCommon.currentTreeItemsPos[args.data[0].id];
            if (args.action === 'check') {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = true;
            }
            else {
                this.parent.pivotCommon.currentTreeItems[pos].checkedStatus = false;
            }
        }
        this.parent.pivotCommon.filterDialog.updateCheckedState();
    };
    PivotButton.prototype.checkedStateAll = function (state) {
        if (state === 'check') {
            for (var _i = 0, _a = this.parent.pivotCommon.currentTreeItems; _i < _a.length; _i++) {
                var item = _a[_i];
                for (var _b = 0, _c = this.parent.pivotCommon.searchTreeItems; _b < _c.length; _b++) {
                    var searctItem = _c[_b];
                    if (item.id === searctItem.id) {
                        item.checkedStatus = true;
                        searctItem.checkedStatus = true;
                    }
                }
            }
        }
        else {
            for (var _d = 0, _e = this.parent.pivotCommon.currentTreeItems; _d < _e.length; _d++) {
                var item = _e[_d];
                for (var _f = 0, _g = this.parent.pivotCommon.searchTreeItems; _f < _g.length; _f++) {
                    var searctItem = _g[_f];
                    if (item.id === searctItem.id) {
                        item.checkedStatus = false;
                        searctItem.checkedStatus = false;
                    }
                }
            }
        }
    };
    PivotButton.prototype.updateFilterState = function (fieldName, args) {
        var isNodeUnChecked = false;
        var filterItem = { items: [], name: fieldName, type: 'Include' };
        for (var _i = 0, _a = this.parent.pivotCommon.searchTreeItems; _i < _a.length; _i++) {
            var item = _a[_i];
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
        var filterObject = this.parent.pivotCommon.eventBase.getFilterItemByName(fieldName);
        if (filterObject) {
            for (var i = 0; i < this.parent.dataSource.filterSettings.length; i++) {
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
    };
    PivotButton.prototype.refreshPivotButtonState = function (fieldName, isFiltered) {
        var pivotButtons = [].slice.call(this.parentElement.querySelectorAll('.e-pivot-button'));
        var selectedButton;
        for (var _i = 0, pivotButtons_1 = pivotButtons; _i < pivotButtons_1.length; _i++) {
            var item = pivotButtons_1[_i];
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
    };
    PivotButton.prototype.removeDataSourceSettings = function (fieldName) {
        var filterSettings = this.parent.dataSource.filterSettings;
        for (var len = 0, lnt = filterSettings.length; len < lnt; len++) {
            if (filterSettings[len].name === fieldName) {
                filterSettings.splice(len, 1);
                break;
            }
        }
    };
    PivotButton.prototype.updateDropIndicator = function (e) {
        if (this.parent.isDragging) {
            removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parentElement.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            var element = closest(e.target, '.' + PIVOT_BUTTON_WRAPPER_CLASS);
            addClass([element.querySelector('.' + DROP_INDICATOR_CLASS)], INDICATOR_HOVER_CLASS);
        }
    };
    PivotButton.prototype.wireEvent = function (element, axis) {
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
    };
    PivotButton.prototype.unWireEvent = function (element, axis) {
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
    };
    /**
     * @hidden
     */
    PivotButton.prototype.addEventListener = function () {
        this.handlers = {
            load: this.renderPivotButton
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(pivotButtonUpdate, this.handlers.load, this);
    };
    /**
     * @hidden
     */
    PivotButton.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(pivotButtonUpdate, this.handlers.load);
    };
    /**
     * To destroy the pivot button event listener
     * @return {void}
     * @hidden
     */
    PivotButton.prototype.destroy = function () {
        this.menuOption.destroy();
        this.removeEventListener();
    };
    return PivotButton;
}());

/**
 * Module to render Axis Fields
 */
/** @hidden */
var AxisFieldRenderer = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function AxisFieldRenderer(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    AxisFieldRenderer.prototype.render = function () {
        this.pivotButton = new PivotButton(this.parent);
        this.createPivotButtons();
    };
    AxisFieldRenderer.prototype.createPivotButtons = function () {
        var rows = this.parent.dataSource.rows;
        var columns = this.parent.dataSource.columns;
        var values = this.parent.dataSource.values;
        var filters = this.parent.dataSource.filters;
        var fields = [rows, columns, values, filters];
        var parentElement = this.parent.dialogRenderer.parentElement;
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
        var axis = ['rows', 'columns', 'values', 'filters'];
        for (var len = 0, lnt = fields.length; len < lnt; len++) {
            if (fields[len]) {
                var args = {
                    field: fields[len],
                    axis: axis[len].toString()
                };
                this.parent.notify(pivotButtonUpdate, args);
            }
        }
    };
    return AxisFieldRenderer;
}());

/**
 * Module to render Pivot Table component
 */
/** @hidden */
var Render$1 = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function Render(parent) {
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
    Render.prototype.render = function () {
        this.parent.dialogRenderer.render();
        if (!this.parent.isAdaptive) {
            this.parent.treeViewModule.render();
        }
        this.parent.axisTableModule.render();
    };
    return Render;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var PivotFieldList = /** @__PURE__ @class */ (function (_super) {
    __extends$3(PivotFieldList, _super);
    /**
     * Constructor for creating the widget
     * @param  {PivotFieldListModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    function PivotFieldList(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @hidden */
        _this.isRequiredUpdate = true;
        return _this;
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @hidden
     */
    PivotFieldList.prototype.requiredModules = function () {
        var modules = [];
        if (this.allowCalculatedField) {
            modules.push({ args: [this], member: 'calculatedfield' });
        }
        return modules;
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    PivotFieldList.prototype.preRender = function () {
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
    };
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    PivotFieldList.prototype.render = function () {
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
    };
    /**
     * Binding events to the Pivot Field List element.
     * @hidden
     */
    PivotFieldList.prototype.wireEvent = function () {
        this.on(initialLoad, this.generateData, this);
        this.on(dataReady, this.fieldListRender, this);
    };
    /**
     * Unbinding events from the element on widget destroy.
     * @hidden
     */
    PivotFieldList.prototype.unWireEvent = function () {
        if (this.pivotGridModule && this.pivotGridModule.isDestroyed) {
            return;
        }
        this.off(initialLoad, this.generateData);
        this.off(dataReady, this.fieldListRender);
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     * @hidden
     */
    PivotFieldList.prototype.getPersistData = function () {
        var keyEntity = ['dataSource'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Get component name.
     * @returns string
     * @private
     */
    PivotFieldList.prototype.getModuleName = function () {
        return 'pivotfieldlist';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden
     */
    PivotFieldList.prototype.onPropertyChanged = function (newProp, oldProp) {
        var requireRefresh = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
    };
    PivotFieldList.prototype.generateData = function () {
        this.pivotFieldList = {};
        if (this.dataSource && this.dataSource.data) {
            this.trigger(enginePopulating, { 'dataSource': this.dataSource });
            var pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
            var isDrillThrough = this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
            var enableValueSorting = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
            this.engineModule = new PivotEngine(this.dataSource, '', undefined, pageSettings, enableValueSorting, isDrillThrough);
            this.pivotFieldList = this.engineModule.fieldList;
            var eventArgs = {
                pivotFieldList: this.pivotFieldList,
                pivotValues: this.engineModule.pivotValues
            };
            this.trigger(enginePopulated, eventArgs);
        }
        this.notify(dataReady, {});
        this.trigger(dataBound);
    };
    PivotFieldList.prototype.fieldListRender = function () {
        this.element.innerHTML = '';
        if (this.renderMode === 'Popup' && this.dialogRenderer.fieldListDialog && !this.dialogRenderer.fieldListDialog.isDestroyed) {
            this.dialogRenderer.fieldListDialog.destroy();
            remove(document.getElementById(this.element.id + '_Wrapper'));
        }
        this.renderModule.render();
        this.fieldListSpinnerElement = this.renderMode === 'Popup' ?
            this.dialogRenderer.fieldListDialog.element : this.element.querySelector('.e-pivotfieldlist-wrapper');
        createSpinner({ target: this.fieldListSpinnerElement }, this.createElement);
        var args = {
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
    };
    PivotFieldList.prototype.getFieldCaption = function (dataSource) {
        this.getFields(dataSource);
        if (this.captionData.length > 0) {
            var lnt = this.captionData.length;
            while (lnt--) {
                if (this.captionData[lnt]) {
                    for (var _i = 0, _a = this.captionData[lnt]; _i < _a.length; _i++) {
                        var item = _a[_i];
                        var obj = item.properties;
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
    };
    PivotFieldList.prototype.getFields = function (dataSource) {
        var fieldSets = extend({}, dataSource, null, true);
        var obj = fieldSets.properties;
        this.captionData = [obj.rows, obj.columns, obj.values, obj.filters];
    };
    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}
     * @hidden
     */
    PivotFieldList.prototype.updateDataSource = function (isTreeViewRefresh, isEngineRefresh) {
        if (this.pivotGridModule) {
            showSpinner(this.pivotGridModule.element);
        }
        showSpinner(this.fieldListSpinnerElement);
        if (isNullOrUndefined(isEngineRefresh)) {
            var pageSettings = this.pivotGridModule ? this.pivotGridModule.pageSettings : undefined;
            var enableValueSorting = this.pivotGridModule ? this.pivotGridModule.enableValueSorting : undefined;
            var isDrillThrough = this.pivotGridModule ?
                (this.pivotGridModule.allowDrillThrough || this.pivotGridModule.editSettings.allowEditing) : true;
            this.engineModule =
                new PivotEngine(this.dataSource, '', this.pivotFieldList, pageSettings, enableValueSorting, isDrillThrough);
            this.getFieldCaption(this.dataSource);
        }
        else {
            this.axisFieldModule.render();
            this.isRequiredUpdate = false;
        }
        var eventArgs = {
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
    };
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     * @hidden
     */
    PivotFieldList.prototype.update = function (control) {
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
    };
    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     * @hidden
     */
    PivotFieldList.prototype.updateView = function (control) {
        if (control) {
            control.setProperties({ dataSource: this.dataSource }, true);
            control.engineModule = this.engineModule;
            control.pivotValues = this.engineModule.pivotValues;
            control.dataBind();
        }
    };
    /**
     * Called internally to trigger populate event.
     * @hidden
     */
    PivotFieldList.prototype.triggerPopulateEvent = function () {
        var eventArgs = {
            dataSource: this.dataSource,
            pivotFieldList: this.pivotFieldList,
            pivotValues: this.engineModule.pivotValues
        };
        this.trigger(enginePopulated, eventArgs);
    };
    /**
     * Destroys the Field Table component.
     * @method destroy
     * @return {void}
     */
    PivotFieldList.prototype.destroy = function () {
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
        _super.prototype.destroy.call(this);
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
    return PivotFieldList;
}(Component));

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
var COUNT = 'Count';
var AVG = 'Avg';
var MIN = 'Min';
var MAX = 'Max';
var SUM = 'Sum';
var DISTINCTCOUNT = 'DistinctCount';
var PRODUCT = 'Product';
var STDEV = 'SampleStDev';
var STDEVP = 'PopulationStDev';
var VAR = 'SampleVar';
var VARP = 'PopulationVar';
var CALC = 'CalculatedField';
var AGRTYPE = 'AggregateType';
/** @hidden */
var CalculatedField = /** @__PURE__ @class */ (function () {
    /** Constructor for calculatedfield module */
    function CalculatedField(parent) {
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
    CalculatedField.prototype.getModuleName = function () {
        return 'calculatedfield';
    };
    CalculatedField.prototype.keyActionHandler = function (e) {
        var node = e.currentTarget.querySelector('.e-hover.e-node-focus');
        if (node) {
            switch (e.action) {
                case 'moveRight':
                    this.displayMenu(node.previousSibling);
                    break;
                case 'enter':
                    var field = node.getAttribute('data-field');
                    var type = node.getAttribute('data-type');
                    var dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
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
    };
    /**
     * Trigger while click treeview icon.
     * @param  {MouseEvent} e
     * @returns void
     */
    CalculatedField.prototype.fieldClickHandler = function (e) {
        var node = e.event.target.parentElement;
        if (e.event.target.classList.contains(FORMAT) ||
            e.event.target.classList.contains(CALC_EDIT) ||
            e.event.target.classList.contains(CALC_EDITED)) {
            this.displayMenu(node.parentElement);
        }
    };
    /**
     * To display context menu.
     * @param  {HTMLElement} node
     * @returns void
     */
    CalculatedField.prototype.displayMenu = function (node) {
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
    };
    /**
     * To set position for context menu.
     * @returns void
     */
    CalculatedField.prototype.openContextMenu = function () {
        var pos = this.curMenu.getBoundingClientRect();
        if (this.parent.enableRtl) {
            this.menuObj.open(pos.top + 30, pos.left - 100);
        }
        else {
            this.menuObj.open(pos.top + 30, pos.left + 150);
        }
    };
    /**
     * Triggers while select menu.
     * @param  {MenuEventArgs} menu
     * @returns void
     */
    CalculatedField.prototype.selectContextMenu = function (menu) {
        if (menu.element.textContent !== null) {
            var field = closest(this.curMenu, '.e-list-item').getAttribute('data-caption');
            closest(this.curMenu, '.e-list-item').setAttribute('data-type', menu.element.textContent);
            this.curMenu.textContent = field + ' (' + menu.element.textContent + ')';
            addClass([this.curMenu.parentElement.parentElement], ['e-node-focus', 'e-hover']);
            this.curMenu.parentElement.parentElement.setAttribute('tabindex', '-1');
            this.curMenu.parentElement.parentElement.focus();
        }
    };
    /**
     * To create context menu.
     * @returns void
     */
    CalculatedField.prototype.createMenu = function () {
        var menuItems = [
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
        var menuOptions = {
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
    };
    /**
     * Triggers while click OK button.
     * @returns void
     */
    CalculatedField.prototype.applyFormula = function () {
        var currentObj = this;
        var isExist = false;
        removeClass([document.getElementById(this.parentID + 'ddlelement')], EMPTY_FIELD);
        Object.keys(currentObj.parent.engineModule.fieldList).forEach(function (key, index) {
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
        var report = this.parent.dataSource;
        var dropField = document.querySelector('#' + this.parentID + 'droppable');
        if (this.inputObj.value !== null && this.inputObj.value !== '' && dropField.value !== '') {
            var field = {
                name: this.inputObj.value,
                type: 'CalculatedField'
            };
            var cField = {
                name: this.inputObj.value,
                formula: dropField.value
            };
            this.isFieldExist = true;
            if (!this.isEdit) {
                for (var i = 0; i < report.values.length; i++) {
                    if (report.values[i].type === CALC && report.values[i].name === field.name) {
                        for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
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
                for (var i = 0; i < report.values.length; i++) {
                    if (report.values[i].type === CALC && this.currentFieldName !== null &&
                        report.values[i].name === this.currentFieldName && this.isEdit) {
                        for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
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
    };
    CalculatedField.prototype.addFormula = function (report, field) {
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
    };
    /**
     * To get treeview data
     * @param  {PivotGrid|PivotFieldList} parent
     * @returns Object
     */
    CalculatedField.prototype.getFieldListData = function (parent) {
        var fields = [];
        Object.keys(parent.engineModule.fieldList).forEach(function (key) {
            var type = null;
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
    };
    /**
     * Triggers before menu opens.
     * @param  {BeforeOpenCloseMenuEventArgs} args
     * @returns void
     */
    CalculatedField.prototype.beforeMenuOpen = function (args) {
        args.element.style.zIndex = (this.dialog.zIndex + 1).toString();
        args.element.style.display = 'inline';
    };
    /**
     * Trigger while drop node in formula field.
     * @param  {DragAndDropEventArgs} args
     * @returns void
     */
    CalculatedField.prototype.fieldDropped = function (args) {
        args.cancel = true;
        var field = args.draggedNode.getAttribute('data-field');
        var type = args.draggedNode.getAttribute('data-type');
        var dropField = this.dialog.element.querySelector('#' + this.parentID + 'droppable');
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
            var textCovered = void 0;
            var cursorPos = dropField.selectionStart;
            var currentValue = dropField.value;
            var textBeforeText = currentValue.substring(0, cursorPos);
            var textAfterText = currentValue.substring(cursorPos, currentValue.length);
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
    };
    /**
     * To create dialog.
     * @returns void
     */
    CalculatedField.prototype.createDialog = function () {
        var _this = this;
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
                    'click': function () { return _this.applyFormula(); },
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('ok'),
                        isPrimary: true
                    }
                },
                {
                    'click': function () {
                        _this.dialog.close();
                        _this.isEdit = false;
                    },
                    buttonModel: {
                        content: this.parent.localeObj.getConstant('cancel')
                    }
                }
            ],
            close: function (args) {
                if (_this.parent.getModuleName() === 'pivotfieldlist') {
                    _this.parent.axisFieldModule.render();
                    if (_this.parent.renderMode !== 'Fixed') {
                        addClass([_this.parent.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], ICON_HIDDEN);
                        _this.parent.dialogRenderer.fieldListDialog.show();
                    }
                }
                _this.treeObj.destroy();
                _this.dialog.destroy();
                _this.newFields = null;
                remove(document.getElementById(_this.parentID + 'calculateddialog'));
                remove(document.querySelector('.' + _this.parentID + 'calculatedmenu'));
            },
            beforeOpen: function (args) {
                _this.dialog.element.querySelector('.e-dlg-header').
                    setAttribute('title', _this.parent.localeObj.getConstant('createCalculatedField'));
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
    };
    /**
     * To render dialog elements.
     * @returns void
     */
    CalculatedField.prototype.renderDialogElements = function () {
        var outerDiv = createElement('div', { id: this.parentID + 'outerDiv', className: CALCOUTERDIV });
        if (this.parent.getModuleName() === 'pivotfieldlist' && this.parent.
            dialogRenderer.parentElement.querySelector('.' + FORMULA) !== null && this.parent.isAdaptive) {
            var accordDiv = createElement('div', { id: this.parentID + 'accordDiv', className: CALCACCORD });
            outerDiv.appendChild(accordDiv);
            var buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: CALCBUTTONDIV });
            var addBtn = createElement('button', {
                id: this.parentID + 'addBtn', innerHTML: this.parent.localeObj.getConstant('add'),
                className: CALCADDBTN
            });
            var cancelBtn = createElement('button', {
                id: this.parentID + 'cancelBtn', innerHTML: this.parent.localeObj.getConstant('cancel'),
                className: CALCCANCELBTN
            });
            buttonDiv.appendChild(cancelBtn);
            buttonDiv.appendChild(addBtn);
            outerDiv.appendChild(buttonDiv);
        }
        else {
            var inputDiv = createElement('div', { id: this.parentID + 'outerDiv', className: CALCINPUTDIV });
            var inputObj = createElement('input', {
                id: this.parentID + 'ddlelement',
                attrs: { 'type': 'text', 'tabindex': '1' },
                className: CALCINPUT
            });
            inputDiv.appendChild(inputObj);
            outerDiv.appendChild(inputDiv);
            if (!this.parent.isAdaptive) {
                var fieldTitle = createElement('div', {
                    className: PIVOT_ALL_FIELD_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formulaField')
                });
                outerDiv.appendChild(fieldTitle);
            }
            var wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: TREEVIEWOUTER });
            wrapDiv.appendChild(createElement('div', { id: this.parentID + 'tree', className: TREEVIEW }));
            outerDiv.appendChild(wrapDiv);
            if (!this.parent.isAdaptive) {
                var formulaTitle = createElement('div', {
                    className: PIVOT_FORMULA_TITLE_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('formula')
                });
                outerDiv.appendChild(formulaTitle);
            }
            var dropDiv = createElement('textarea', {
                id: this.parentID + 'droppable',
                className: FORMULA,
                attrs: {
                    'placeholder': this.parent.isAdaptive ? this.parent.localeObj.getConstant('dropTextMobile') :
                        this.parent.localeObj.getConstant('dropText')
                }
            });
            outerDiv.appendChild(dropDiv);
            if (this.parent.isAdaptive) {
                var buttonDiv = createElement('div', { id: this.parentID + 'buttonDiv', className: CALCBUTTONDIV });
                var okBtn = createElement('button', {
                    id: this.parentID + 'okBtn', innerHTML: this.parent.localeObj.getConstant('apply'),
                    className: CALCOKBTN
                });
                buttonDiv.appendChild(okBtn);
                outerDiv.appendChild(buttonDiv);
            }
        }
        return outerDiv;
    };
    /**
     * To create calculated field adaptive layout.
     * @returns void
     */
    CalculatedField.prototype.renderAdaptiveLayout = function () {
        if (document.querySelector('#' + this.parentID + 'droppable')) {
            this.formulaText = document.querySelector('#' + this.parentID + 'droppable').value;
            this.fieldText = this.inputObj.value;
        }
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    };
    /**
     * To create treeview.
     * @returns void
     */
    CalculatedField.prototype.createTreeView = function () {
        var _this = this;
        this.treeObj = new TreeView({
            fields: { dataSource: this.getFieldListData(this.parent), id: 'formula', text: 'name', iconCss: 'icon' },
            allowDragAndDrop: true,
            enableRtl: this.parent.enableRtl,
            nodeCollapsing: function (args) {
                args.cancel = true;
            },
            nodeDragStart: function (args) {
                if (args.event.target.classList.contains(DRAG_CLASS)) {
                    var dragItem = document.querySelector('.e-drag-item.e-treeview');
                    addClass([dragItem], PIVOTCALC);
                    dragItem.style.zIndex = (_this.dialog.zIndex + 1).toString();
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
    };
    /**
     * Trigger before treeview text append.
     * @param  {DrawNodeEventArgs} args
     * @returns void
     */
    CalculatedField.prototype.drawTreeNode = function (args) {
        var field = args.nodeData.field;
        args.node.setAttribute('data-field', field);
        args.node.setAttribute('data-caption', args.nodeData.caption);
        args.node.setAttribute('data-type', args.nodeData.type);
        var dragElement = createElement('span', {
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
    };
    /**
     * To create radio buttons.
     * @param  {string} key
     * @returns HTMLElement
     */
    CalculatedField.prototype.createTypeContainer = function (key) {
        var wrapDiv = createElement('div', { id: this.parentID + 'control_wrapper', className: TREEVIEWOUTER });
        var type = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
        for (var i = 0; i < type.length; i++) {
            var input = createElement('input', {
                id: this.parentID + 'radio' + key + type[i],
                attrs: { 'type': 'radio', 'data-ftxt': key },
                className: CALCRADIO
            });
            wrapDiv.appendChild(input);
        }
        return wrapDiv;
    };
    /**
     * To get Accordion Data.
     * @param  {PivotView | PivotFieldList} parent
     * @returns AccordionItemModel
     */
    CalculatedField.prototype.getAccordionData = function (parent) {
        var _this = this;
        var data = [];
        Object.keys(parent.engineModule.fieldList).forEach(function (key, index) {
            data.push({
                header: '<input id=' + _this.parentID + '_' + index + ' class=' + CALCCHECK + ' type="checkbox" data-field=' +
                    key + ' data-caption=' + _this.parent.engineModule.fieldList[key].caption + ' data-type=' +
                    _this.parent.engineModule.fieldList[key].type + '/>',
                content: parent.engineModule.fieldList[key].aggregateType === CALC ||
                    _this.parent.engineModule.fieldList[key].type !== 'number' ? '' : _this.createTypeContainer(key).outerHTML
            });
        });
        return data;
    };
    /**
     * To render mobile layout.
     * @param  {Tab} tabObj
     * @returns void
     */
    CalculatedField.prototype.renderMobileLayout = function (tabObj) {
        var _this = this;
        tabObj.items[4].content = this.renderDialogElements().outerHTML;
        tabObj.dataBind();
        var cancelBtn = new Button({ cssClass: FLAT, isPrimary: true });
        cancelBtn.appendTo('#' + this.parentID + 'cancelBtn');
        if (cancelBtn.element) {
            cancelBtn.element.onclick = this.cancelBtnClick.bind(this);
        }
        if (this.parent.
            dialogRenderer.parentElement.querySelector('.' + FORMULA) !== null && this.parent.isAdaptive) {
            var okBtn = new Button({ cssClass: FLAT + ' ' + OUTLINE_CLASS, isPrimary: true });
            okBtn.appendTo('#' + this.parentID + 'okBtn');
            this.inputObj = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('fieldName')
            });
            this.inputObj.appendTo('#' + this.parentID + 'ddlelement');
            if (this.formulaText !== null && this.parent.
                dialogRenderer.parentElement.querySelector('#' + this.parentID + 'droppable') !== null) {
                var drop = this.parent.
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
            var accordion = new Accordion({
                items: this.getAccordionData(this.parent),
                enableRtl: this.parent.enableRtl,
                expanding: function (args) {
                    if (args.element.querySelectorAll('.e-radio-wrapper').length === 0) {
                        Object.keys(_this.parent.engineModule.fieldList).forEach(function (key) {
                            var type = [SUM, COUNT, AVG, MIN, MAX, DISTINCTCOUNT, PRODUCT, STDEV, STDEVP, VAR, VARP];
                            var radiobutton;
                            if (key === args.element.querySelector('[data-field').getAttribute('data-field')) {
                                for (var i = 0; i < type.length; i++) {
                                    radiobutton = new RadioButton({
                                        label: type[i],
                                        name: AGRTYPE + key,
                                        change: function (args) {
                                            var type = args.event.target.parentElement.querySelector('.e-label').
                                                innerText;
                                            var field = args.event.target.closest('.e-acrdn-item').
                                                querySelector('[data-field').getAttribute('data-caption');
                                            args.event.target.
                                                closest('.e-acrdn-item').querySelector('.e-label').
                                                innerText = field + ' (' + type + ')';
                                            args.event.target.closest('.e-acrdn-item').
                                                querySelector('[data-type').setAttribute('data-type', type);
                                        },
                                    });
                                    radiobutton.appendTo('#' + _this.parentID + 'radio' + key + type[i]);
                                }
                            }
                        });
                    }
                },
            });
            var addBtn = new Button({ cssClass: FLAT, isPrimary: true });
            addBtn.appendTo('#' + this.parentID + 'addBtn');
            accordion.appendTo('#' + this.parentID + 'accordDiv');
            Object.keys(this.parent.engineModule.fieldList).forEach(function (key, index) {
                var type = null;
                if (_this.parent.engineModule.fieldList[key].type === 'string' ||
                    _this.parent.engineModule.fieldList[key].type === 'include' ||
                    _this.parent.engineModule.fieldList[key].type === 'exclude') {
                    type = COUNT;
                }
                else {
                    type = _this.parent.engineModule.fieldList[key].aggregateType !== undefined ?
                        _this.parent.engineModule.fieldList[key].aggregateType : SUM;
                }
                var checkbox = new CheckBox({
                    label: _this.parent.engineModule.fieldList[key].caption + ' (' + type + ')'
                });
                checkbox.appendTo('#' + _this.parentID + '_' + index);
                document.querySelector('#' + _this.parentID + '_' + index).setAttribute('data-field', key);
                document.querySelector('#' + _this.parentID + '_' + index).setAttribute('data-type', type);
            });
            if (addBtn.element) {
                addBtn.element.onclick = this.addBtnClick.bind(this);
            }
        }
    };
    /**
     * Trigger while click cancel button.
     * @returns void
     */
    CalculatedField.prototype.cancelBtnClick = function () {
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    };
    /**
     * Trigger while click add button.
     * @returns void
     */
    CalculatedField.prototype.addBtnClick = function () {
        var node = document.querySelectorAll('.e-accordion .e-check');
        var fieldText = '';
        var field = null;
        var type = null;
        for (var i = 0; i < node.length; i++) {
            field = node[i].parentElement.querySelector('[data-field]').getAttribute('data-field');
            type = node[i].parentElement.querySelector('[data-field]').getAttribute('data-type');
            if (type.indexOf(CALC) === -1) {
                fieldText = fieldText + ('"' + type + '(' + field + ')' + '"');
            }
            else {
                for (var j = 0; j < this.parent.dataSource.calculatedFieldSettings.length; j++) {
                    if (this.parent.dataSource.calculatedFieldSettings[j].name === field) {
                        fieldText = fieldText + this.parent.dataSource.calculatedFieldSettings[j].formula;
                        break;
                    }
                }
            }
        }
        this.formulaText = this.formulaText !== null ? (this.formulaText + fieldText) : fieldText;
        this.renderMobileLayout(this.parent.dialogRenderer.adaptiveElement);
    };
    /**
     * To create calculated field dialog elements.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.createCalculatedFieldDialog = function () {
        if (this.parent.isAdaptive && this.parent.getModuleName() === 'pivotfieldlist') {
            this.renderAdaptiveLayout();
        }
        else if (!this.parent.isAdaptive) {
            this.renderDialogLayout();
            this.dialog.element.style.top = parseInt(this.dialog.element.style.top, 10) < 0 ? '0px' : this.dialog.element.style.top;
        }
    };
    /**
     * To create calculated field desktop layout.
     * @returns void
     */
    CalculatedField.prototype.renderDialogLayout = function () {
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
    };
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createConfirmDialog
     * @return {void}
     * @hidden
     */
    CalculatedField.prototype.createConfirmDialog = function (title, description) {
        var errorDialog = createElement('div', {
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
    };
    CalculatedField.prototype.replaceFormula = function () {
        var report = this.parent.dataSource;
        var dropField = document.querySelector('#' + this.parentID + 'droppable');
        for (var i = 0; i < report.values.length; i++) {
            if (report.values[i].type === CALC && report.values[i].name === this.inputObj.value) {
                for (var j = 0; j < report.calculatedFieldSettings.length; j++) {
                    if (report.calculatedFieldSettings[j].name === this.inputObj.value) {
                        report.calculatedFieldSettings[j].formula = dropField.value;
                    }
                }
            }
        }
        this.addFormula(report, this.inputObj.value);
        this.removeErrorDialog();
    };
    CalculatedField.prototype.removeErrorDialog = function () {
        if (document.getElementById(this.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parentID + '_ErrorDialog').parentElement);
        }
    };
    /**
     * To add event listener.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initCalculatedField, this.createCalculatedFieldDialog, this);
    };
    /**
     * To remove event listener.
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initCalculatedField, this.createCalculatedFieldDialog);
    };
    /**
     * To destroy the calculated field dialog
     * @returns void
     * @hidden
     */
    CalculatedField.prototype.destroy = function () {
        this.removeEventListener();
    };
    return CalculatedField;
}());

PivotFieldList.Inject(CalculatedField);
/**
 * Module for Field List rendering
 */
/** @hidden */
var FieldList = /** @__PURE__ @class */ (function () {
    /** Constructor for Field List module */
    function FieldList(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    FieldList.prototype.getModuleName = function () {
        return 'fieldlist';
    };
    FieldList.prototype.initiateModule = function () {
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
    };
    FieldList.prototype.updateControl = function () {
        var _this = this;
        if (this.element) {
            prepend([this.element], this.parent.element);
            if (this.parent.grid && this.parent.showGroupingBar && this.parent.groupingBarModule) {
                clearTimeout(this.timeOutObj);
                this.timeOutObj = setTimeout(function () {
                    if (_this.parent.grid && _this.parent.grid.element) {
                        var actWidth = _this.parent.grid.element.offsetWidth < 400 ? 400 : _this.parent.grid.element.offsetWidth;
                        setStyleAttribute(_this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS), {
                            left: formatUnit(_this.parent.enableRtl ?
                                -Math.abs((actWidth) -
                                    _this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth) :
                                (actWidth) -
                                    _this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth)
                        });
                        if (_this.parent.enableRtl) {
                            addClass([_this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
                        }
                        else {
                            removeClass([_this.element.querySelector('.' + TOGGLE_FIELD_LIST_CLASS)], 'e-fieldlist-left');
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
    };
    /**
     * @hidden
     */
    FieldList.prototype.addEventListener = function () {
        this.handlers = {
            load: this.initiateModule,
            update: this.updateControl
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initSubComponent, this.handlers.load, this);
        this.parent.on(uiUpdate, this.handlers.update, this);
    };
    /**
     * @hidden
     */
    FieldList.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initSubComponent, this.handlers.load);
        this.parent.off(uiUpdate, this.handlers.update);
    };
    /**
     * To destroy the Field List
     * @return {void}
     * @hidden
     */
    FieldList.prototype.destroy = function () {
        this.removeEventListener();
        if (this.parent.pivotFieldListModule) {
            this.parent.pivotFieldListModule.destroy();
        }
        else {
            return;
        }
    };
    return FieldList;
}());

/**
 * Module for PivotCommon rendering
 */
/** @hidden */
var Common = /** @__PURE__ @class */ (function () {
    /** Constructor for Common module */
    function Common(parent) {
        this.parent = parent;
        this.parent.commonModule = this;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Common.prototype.getModuleName = function () {
        return 'common';
    };
    Common.prototype.initiateCommonModule = function () {
        if (!this.parent.pivotCommon) {
            var args = {
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
    };
    /**
     * @hidden
     */
    Common.prototype.addEventListener = function () {
        this.handlers = {
            load: this.initiateCommonModule
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(uiUpdate, this.handlers.load, this);
    };
    /**
     * @hidden
     */
    Common.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(uiUpdate, this.handlers.load);
    };
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    Common.prototype.destroy = function () {
        this.removeEventListener();
        if (this.parent.pivotCommon) {
            this.parent.pivotCommon.destroy();
        }
    };
    return Common;
}());

/**
 * Module to render Axis Fields
 */
/** @hidden */
var AxisFields = /** @__PURE__ @class */ (function () {
    /** Constructor for render module */
    function AxisFields(parent) {
        this.parent = parent;
    }
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    AxisFields.prototype.render = function () {
        this.pivotButton = new PivotButton(this.parent);
        this.createPivotButtons();
        var pivotButtons = [].slice.call(this.parent.element.querySelector('.' + GROUP_ROW_CLASS)
            .querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
        var vlen = pivotButtons.length;
        for (var j = 0; j < vlen; j++) {
            var indentWidth = 24;
            var indentDiv = createElement('span', {
                className: 'e-indent-div',
                styles: 'width:' + j * indentWidth + 'px'
            });
            prepend([indentDiv], pivotButtons[j]);
        }
    };
    AxisFields.prototype.createPivotButtons = function () {
        var fields = [this.parent.dataSource.rows, this.parent.dataSource.columns, this.parent.dataSource.values, this.parent.dataSource.filters];
        this.parent.element.querySelector('.' + GROUP_ROW_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_COLUMN_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_VALUE_CLASS).innerHTML = '';
        this.parent.element.querySelector('.' + GROUP_FILTER_CLASS).innerHTML = '';
        var axis = ['rows', 'columns', 'values', 'filters'];
        for (var i = 0, lnt = fields.length; i < lnt; i++) {
            if (fields[i]) {
                var args = {
                    field: fields[i],
                    axis: axis[i].toString()
                };
                this.parent.notify(pivotButtonUpdate, args);
            }
        }
    };
    return AxisFields;
}());

PivotView.Inject(Common);
/**
 * Module for GroupingBar rendering
 */
/** @hidden */
var GroupingBar = /** @__PURE__ @class */ (function () {
    /** Constructor for GroupingBar module */
    function GroupingBar(parent) {
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
    GroupingBar.prototype.getModuleName = function () {
        return 'grouping';
    };
    GroupingBar.prototype.renderLayout = function () {
        this.groupingTable = createElement('div', { className: GROUPING_BAR_CLASS });
        this.leftAxisPanel = createElement('div', { className: LEFT_AXIS_PANEL_CLASS });
        this.rightAxisPanel = createElement('div', { className: RIGHT_AXIS_PANEL_CLASS });
        var rowAxisPanel = createElement('div', { className: AXIS_ROW_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper' });
        var columnAxisPanel = createElement('div', {
            className: AXIS_COLUMN_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper'
        });
        var valueAxisPanel = createElement('div', {
            className: AXIS_VALUE_CLASS + ' ' + AXIS_ICON_CLASS + 'wrapper'
        });
        var filterAxisPanel = createElement('div', {
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
        var axisPanels = [this.rowPanel, this.columnPanel, this.valuePanel, this.filterPanel];
        for (var _i = 0, axisPanels_1 = axisPanels; _i < axisPanels_1.length; _i++) {
            var element = axisPanels_1[_i];
            new Droppable(element, {});
            this.unWireEvent(element);
            this.wireEvent(element);
        }
    };
    GroupingBar.prototype.appendToElement = function () {
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
        var emptyRowCount = Object.keys(this.parent.engineModule.headerContent).length;
        if (emptyRowCount) {
            var emptyHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
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
        var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        var rightAxisPanelWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
        setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
        setStyleAttribute(this.rightAxisPanel, { width: rightAxisPanelWidth });
        var rightPanelHeight = (this.valuePanel.offsetHeight / 2);
        if (rightPanelHeight > this.columnPanel.offsetHeight) {
            setStyleAttribute(this.filterPanel, { height: formatUnit(rightPanelHeight) });
            setStyleAttribute(this.columnPanel, { height: formatUnit(rightPanelHeight + 1) });
        }
        var topLeftHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
        setStyleAttribute(this.rowPanel, {
            height: topLeftHeight + 'px'
        });
        if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
            this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                topLeftHeight + 'px';
        }
        var colRows = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
        var columnRows = colRows.filter(function (trCell) {
            return (trCell.childNodes.length > 0);
        });
        var colHeight = topLeftHeight / columnRows.length;
        for (var _i = 0, columnRows_1 = columnRows; _i < columnRows_1.length; _i++) {
            var element = columnRows_1[_i];
            setStyleAttribute(element, { 'height': colHeight + 'px' });
            var rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
            for (var _a = 0, rowHeader_1 = rowHeader; _a < rowHeader_1.length; _a++) {
                var rhElement = rowHeader_1[_a];
                setStyleAttribute(rhElement, { 'height': colHeight + 'px' });
            }
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.refreshUI = function () {
        var _this = this;
        setStyleAttribute(this.groupingTable, { width: formatUnit(this.parent.grid.width) });
        this.groupingTable.style.minWidth = '400px';
        var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        var rightAxisWidth = formatUnit(this.groupingTable.offsetWidth - parseInt(colGroupElement.style.width, 10));
        setStyleAttribute(this.valuePanel, { width: colGroupElement.style.width });
        setStyleAttribute(this.rightAxisPanel, { width: rightAxisWidth });
        if (this.parent.showFieldList && this.parent.pivotFieldListModule && this.parent.pivotFieldListModule.element) {
            var element_1 = this.parent.pivotFieldListModule.element;
            clearTimeout(this.timeOutObj);
            this.timeOutObj = setTimeout(function () {
                var actWidth = _this.parent.grid.element.offsetWidth < 400 ? 400 : _this.parent.grid.element.offsetWidth;
                setStyleAttribute(element_1.querySelector('.' + TOGGLE_FIELD_LIST_CLASS), {
                    left: formatUnit(_this.parent.enableRtl ?
                        -Math.abs((actWidth) -
                            element_1.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth) :
                        (actWidth) -
                            element_1.querySelector('.' + TOGGLE_FIELD_LIST_CLASS).offsetWidth)
                });
            });
        }
        if (!this.parent.grid.element.querySelector('.e-group-row')) {
            var emptyRowHeader = this.parent.element.querySelector('.e-frozenheader').querySelector('.e-columnheader');
            addClass([emptyRowHeader], 'e-row');
            addClass([emptyRowHeader.querySelector('.e-headercell')], 'e-group-row');
            emptyRowHeader.querySelector('.e-group-row').appendChild(this.rowAxisPanel);
            setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-headercelldiv'), {
                display: 'none'
            });
            setStyleAttribute(emptyRowHeader.querySelector('.e-group-row').querySelector('.e-sortfilterdiv'), {
                display: 'none'
            });
            var groupHeight = this.parent.element.querySelector('.e-headercontent').offsetHeight;
            setStyleAttribute(this.rowPanel, {
                height: groupHeight + 'px'
            });
            if (this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler')) {
                this.parent.element.querySelector('.e-frozenheader').querySelector('.e-rhandler').style.height =
                    groupHeight + 'px';
            }
            var colRowElements = [].slice.call(this.parent.element.querySelector('.e-movableheader').querySelector('thead').querySelectorAll('tr'));
            var columnRows = colRowElements.filter(function (trCell) {
                return (trCell.childNodes.length > 0);
            });
            var colHeight = groupHeight / columnRows.length;
            for (var _i = 0, columnRows_2 = columnRows; _i < columnRows_2.length; _i++) {
                var element = columnRows_2[_i];
                setStyleAttribute(element, { 'height': colHeight + 'px' });
                var rowHeader = [].slice.call(element.querySelectorAll('.e-rhandler'));
                for (var _a = 0, rowHeader_2 = rowHeader; _a < rowHeader_2.length; _a++) {
                    var handlerElement = rowHeader_2[_a];
                    setStyleAttribute(handlerElement, { 'height': colHeight + 'px' });
                }
            }
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.setGridRowWidth = function () {
        var colGroupElement = this.parent.element.querySelector('.e-frozenheader').querySelector('colgroup').children[0];
        if (this.rowPanel.querySelector('.' + PIVOT_BUTTON_CLASS)) {
            if (!this.parent.isAdaptive) {
                var pivotButtons = [].slice.call(this.rowPanel.querySelectorAll('.' + PIVOT_BUTTON_WRAPPER_CLASS));
                var lastButton = pivotButtons[pivotButtons.length - 1];
                var lastButtonWidth = (lastButton.querySelector('.' + PIVOT_BUTTON_CLASS).offsetWidth +
                    lastButton.querySelector('.e-indent-div').offsetWidth + 20);
                var resColWidth = (this.parent.isAdaptive ? 180 : 250);
                var buttonWidth = formatUnit(lastButtonWidth < resColWidth ? resColWidth : lastButtonWidth);
                var rowHeaderTable = this.parent.element.querySelector('.e-frozenheader').querySelector('table');
                var rowContentTable = this.parent.element.querySelector('.e-frozencontent').querySelector('table');
                var rowContent = this.parent.element.querySelector('.e-frozencontent').querySelector('colgroup').children[0];
                var colwidth = parseInt(buttonWidth, 10);
                var gridColumn = this.parent.grid.columns;
                if (gridColumn && gridColumn.length > 0) {
                    /* tslint:disable:align */
                    gridColumn[0].width = (gridColumn[0].width >= resColWidth ?
                        (colwidth > resColWidth ? colwidth : resColWidth) : (colwidth > resColWidth ? colwidth : resColWidth));
                }
                var valueColWidth = this.parent.renderModule.calculateColWidth(this.parent.dataSource.values.length > 0 ?
                    this.parent.engineModule.pivotValues[0].length : 2);
                for (var cCnt = 0; cCnt < gridColumn.length; cCnt++) {
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
                    var resColWidth = 180;
                    var gridColumn = this.parent.grid.columns;
                    if (gridColumn && gridColumn.length > 0) {
                        gridColumn[0].width = resColWidth;
                    }
                    this.parent.posCount = 0;
                    this.parent.grid.headerModule.refreshUI();
                }
            }
        }
        this.refreshUI();
    };
    GroupingBar.prototype.setColWidth = function (columns, width) {
        for (var cCnt = 0; cCnt < columns.length; cCnt++) {
            if (columns[cCnt].columns) {
                this.setColWidth(columns[cCnt].columns, width);
            }
            else {
                columns[cCnt].width = width;
            }
        }
    };
    GroupingBar.prototype.wireEvent = function (element) {
        EventHandler.add(element, 'mouseover', this.dropIndicatorUpdate, this);
        EventHandler.add(element, 'mouseleave', this.dropIndicatorUpdate, this);
    };
    GroupingBar.prototype.unWireEvent = function (element) {
        EventHandler.remove(element, 'mouseover', this.dropIndicatorUpdate);
        EventHandler.remove(element, 'mouseleave', this.dropIndicatorUpdate);
    };
    GroupingBar.prototype.dropIndicatorUpdate = function (e) {
        if ((this.parent.isDragging && e.target.classList.contains(DROPPABLE_CLASS) && e.type === 'mouseover') ||
            e.type === 'mouseleave') {
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS)), INDICATOR_HOVER_CLASS);
            removeClass([].slice.call(this.parent.element.querySelectorAll('.' + DROP_INDICATOR_CLASS + '-last')), INDICATOR_HOVER_CLASS);
        }
    };
    GroupingBar.prototype.tapHoldHandler = function (e) {
        var target = closest(e.originalEvent.target, '.' + PIVOT_BUTTON_CLASS);
        if (!isNullOrUndefined(target) && this.parent.isAdaptive) {
            var pos = target.getBoundingClientRect();
            this.parent.contextMenuModule.fieldElement = target;
            this.parent.contextMenuModule.menuObj.open(pos.top, pos.left);
            return;
        }
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.addEventListener = function () {
        this.handlers = {
            load: this.renderLayout,
            end: this.appendToElement,
        };
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(initSubComponent, this.handlers.load, this); //For initial rendering
        this.parent.on(uiUpdate, this.handlers.end, this);
    };
    /**
     * @hidden
     */
    GroupingBar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(initSubComponent, this.handlers.end);
        this.parent.off(uiUpdate, this.handlers.load);
    };
    /**
     * To destroy the groupingbar
     * @return {void}
     * @hidden
     */
    GroupingBar.prototype.destroy = function () {
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
    };
    return GroupingBar;
}());

/**
 * Module to render Conditional Formatting Dialog
 */
/** @hidden */
var ConditionalFormatting = /** @__PURE__ @class */ (function () {
    /** Constructor for conditionalformatting module */
    function ConditionalFormatting(parent) {
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
    ConditionalFormatting.prototype.getModuleName = function () {
        return 'conditionalformatting';
    };
    ConditionalFormatting.prototype.createDialog = function () {
        var _this = this;
        if (document.querySelector('#' + this.parentID + 'conditionalformatting') !== null) {
            remove(document.querySelector('#' + this.parentID + 'conditionalformatting'));
        }
        this.parent.element.appendChild(createElement('div', {
            id: this.parentID + 'conditionalformatting',
        }));
        var buttonModel = [
            {
                'click': function () {
                    var format = {
                        conditions: 'LessThan',
                        value1: 0,
                        style: {
                            backgroundColor: 'white',
                            color: 'black',
                            fontFamily: 'Arial',
                            fontSize: '12px'
                        }
                    };
                    _this.refreshConditionValues();
                    _this.newFormat.push(format);
                    _this.addFormat();
                },
                buttonModel: {
                    cssClass: this.parent.isAdaptive ? (FORMAT_ROUND_BUTTON + ' ' + FORMAT_CONDITION_BUTTON) :
                        FORMAT_CONDITION_BUTTON,
                    iconCss: ICON + ' ' + ADD_ICON_CLASS,
                    content: this.parent.isAdaptive ? '' : this.parent.localeObj.getConstant('condition'),
                }
            },
            {
                'click': function () {
                    _this.refreshConditionValues();
                    _this.parent.setProperties({ dataSource: { conditionalFormatSettings: _this.newFormat } }, true);
                    _this.parent.renderPivotGrid();
                    _this.destroy();
                },
                buttonModel: {
                    cssClass: FLAT_CLASS + ' ' + FORMAT_APPLY_BUTTON,
                    content: this.parent.localeObj.getConstant('apply')
                }
            },
            {
                'click': function () {
                    _this.destroy();
                    _this.newFormat = [];
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
                beforeOpen: function (args) {
                    _this.dialog.element.querySelector('.' + DIALOG_HEADER).
                        setAttribute('title', _this.parent.localeObj.getConstant('conditionalFormating'));
                },
                cssClass: FORMAT_DIALOG, header: this.parent.localeObj.getConstant('conditionalFormating'), target: document.body
            });
        }
        else {
            this.dialog = new Dialog({
                allowDragging: true, position: { X: 'center', Y: this.parent.element.offsetTop }, buttons: buttonModel,
                beforeOpen: function (args) {
                    _this.dialog.element.querySelector('.' + DIALOG_HEADER).
                        setAttribute('title', _this.parent.localeObj.getConstant('conditionalFormating'));
                },
                cssClass: FORMAT_DIALOG, isModal: false, closeOnEscape: true, enableRtl: this.parent.enableRtl,
                showCloseIcon: true, header: this.parent.localeObj.getConstant('conditionalFormating'), target: this.parent.element
            });
        }
        this.dialog.appendTo('#' + this.parentID + 'conditionalformatting');
    };
    ConditionalFormatting.prototype.refreshConditionValues = function () {
        for (var i = 0; i < this.newFormat.length; i++) {
            this.newFormat[i].value1 =
                Number(document.querySelector('#' + this.parentID + 'conditionvalue1' + i).value);
            this.newFormat[i].value2 =
                Number(document.querySelector('#' + this.parentID + 'conditionvalue2' + i).value);
        }
    };
    ConditionalFormatting.prototype.addFormat = function () {
        var format = createElement('div', { id: this.parentID + 'formatDiv', className: FORMAT_NEW });
        for (var i = 0; i < this.newFormat.length; i++) {
            format.appendChild(this.createDialogElements(i));
        }
        this.dialog.setProperties({ 'content': format }, false);
        for (var i = 0; i < this.newFormat.length; i++) {
            this.renderDropDowns(i);
            this.renderColorPicker(i);
        }
    };
    ConditionalFormatting.prototype.createDialogElements = function (i) {
        var format = this.newFormat[i];
        var outerDiv = createElement('div', {
            id: this.parentID + 'outerDiv' + i, className: FORMAT_OUTER
        });
        var button = createElement('button', {
            id: this.parentID + 'removeButton' + i, className: FORMAT_DELETE_BUTTON,
            attrs: { 'title': this.parent.localeObj.getConstant('delete') }
        });
        outerDiv.appendChild(button);
        var innerDiv = createElement('div', { id: this.parentID + 'innerDiv', className: FORMAT_INNER });
        var table = createElement('table', { id: this.parentID + 'cftable', className: FORMAT_TABLE });
        var tRow = createElement('tr');
        var td = createElement('td');
        var valuelabel = createElement('span', {
            id: this.parentID + 'valuelabel' + i, className: FORMAT_VALUE_LABEL,
            innerHTML: this.parent.localeObj.getConstant('value')
        });
        td.appendChild(valuelabel);
        tRow.appendChild(td);
        table.appendChild(tRow);
        tRow = createElement('tr');
        td = createElement('td');
        var measureDropdown = createElement('div', { id: this.parentID + 'measure' + i });
        var measureInput = createElement('input', {
            id: this.parentID + 'measureinput' + i,
            attrs: { 'type': 'text', 'tabindex': '1' }
        });
        measureDropdown.appendChild(measureInput);
        td.appendChild(measureDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        var conditionDropdown = createElement('div', { id: this.parentID + 'condition' });
        var conditionInput = createElement('input', {
            id: this.parentID + 'conditioninput' + i,
            attrs: { 'type': 'text', 'tabindex': '1' }
        });
        conditionDropdown.appendChild(conditionInput);
        td.appendChild(conditionDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        var style = !(format.conditions === 'Between' || format.conditions === 'NotBetween') ? 'display:none; width:10px' : '';
        var value1 = createElement('input', {
            id: this.parentID + 'conditionvalue1' + i,
            attrs: { 'type': 'text', 'tabindex': '1', 'value': !isNullOrUndefined(format.value1) ? format.value1.toString() : '0' },
            styles: this.parent.isAdaptive ? style === '' ? 'width: 35%' : 'width: 100%' : style === '' ? 'width: 45px' : 'width: 120px',
            className: INPUT + ' ' + FORMAT_VALUE1
        });
        td.appendChild(value1);
        var valuespan = createElement('span', {
            id: this.parentID + 'valuespan' + i, className: FORMAT_VALUE_SPAN,
            innerHTML: '&', styles: style
        });
        td.appendChild(valuespan);
        var value2 = createElement('input', {
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
        var formatlabel = createElement('span', {
            id: this.parentID + 'formatlabel' + i, className: FORMAT_LABEL, innerHTML: this.parent.localeObj.getConstant('formatLabel')
        });
        td.appendChild(formatlabel);
        tRow.appendChild(td);
        table.appendChild(tRow);
        tRow = createElement('tr');
        td = createElement('td');
        var fontNameDropdown = createElement('div', { id: this.parentID + 'fontname' });
        var fontNameInput = createElement('input', {
            id: this.parentID + 'fontnameinput' + i, attrs: { 'type': 'text', 'tabindex': '1' }
        });
        fontNameDropdown.appendChild(fontNameInput);
        td.appendChild(fontNameDropdown);
        tRow.appendChild(td);
        td = createElement('td');
        var fontSizeDropdown = createElement('div', { id: this.parentID + 'fontsize' });
        var fontSizeInput = createElement('input', {
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
        var colorPicker1 = createElement('input', {
            id: this.parentID + 'fontcolor' + i, attrs: { 'type': 'color', 'tabindex': '1' }, className: FORMAT_FONT_COLOR
        });
        td.appendChild(colorPicker1);
        var colorPicker2 = createElement('input', {
            id: this.parentID + 'backgroundcolor' + i, attrs: { 'type': 'color', 'tabindex': '1' }, className: FORMAT_BACK_COLOR
        });
        td.appendChild(colorPicker2);
        tRow.appendChild(td);
        td = createElement('td');
        var valuePreview = createElement('div', {
            id: this.parentID + 'valuepreview' + i, className: INPUT + ' ' + FORMAT_VALUE_PREVIEW,
            innerHTML: '123.45',
        });
        td.appendChild(valuePreview);
        tRow.appendChild(td);
        table.appendChild(tRow);
        innerDiv.appendChild(table);
        outerDiv.appendChild(innerDiv);
        return outerDiv;
    };
    ConditionalFormatting.prototype.renderDropDowns = function (i) {
        var _this = this;
        var format = this.newFormat[i];
        var fields = [];
        fields.push({
            index: 0, name: this.parent.localeObj.getConstant('AllValues'),
            field: this.parent.localeObj.getConstant('AllValues')
        });
        for (var i_1 = 0; i_1 < this.parent.dataSource.values.length; i_1++) {
            fields.push({
                index: i_1 + 1,
                name: this.parent.dataSource.values[i_1].caption || this.parent.dataSource.values[i_1].name,
                field: this.parent.dataSource.values[i_1].name
            });
        }
        var value = isNullOrUndefined(format.measure) ? this.parent.localeObj.getConstant('AllValues') : format.measure;
        this.fieldsDropDown[i] = new DropDownList({
            dataSource: fields, fields: { text: 'name' },
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            popupHeight: '200px', popupWidth: 'auto',
            change: function (args) {
                _this.newFormat[i].measure = args.value.toString() === _this.parent.localeObj.getConstant('AllValues') ?
                    undefined : args.value.toString();
            }
        });
        this.fieldsDropDown[i].appendTo('#' + this.parentID + 'measureinput' + i);
        var conditions = [
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
            change: function (args) {
                _this.newFormat[i].conditions = args.value;
                if (args.value === 'Between' || args.value === 'NotBetween') {
                    document.querySelector('#' + _this.parentID + 'valuespan' + i).style.display = 'inline-block';
                    document.querySelector('#' + _this.parentID + 'valuespan' + i).style.width =
                        _this.parent.isAdaptive ? '10%' : '10px';
                    document.querySelector('#' + _this.parentID + 'conditionvalue2' + i).style.display = 'inline-block';
                    document.querySelector('#' + _this.parentID + 'conditionvalue2' + i).style.width =
                        _this.parent.isAdaptive ? '35%' : '45px';
                    document.querySelector('#' + _this.parentID + 'conditionvalue1' + i).style.width =
                        _this.parent.isAdaptive ? '35%' : '45px';
                }
                else {
                    document.querySelector('#' + _this.parentID + 'valuespan' + i).style.display = 'none';
                    document.querySelector('#' + _this.parentID + 'conditionvalue2' + i).style.display = 'none';
                    document.querySelector('#' + _this.parentID + 'conditionvalue1' + i).style.width =
                        _this.parent.isAdaptive ? '100%' : '120px';
                }
            }
        });
        this.conditionsDropDown[i].appendTo('#' + this.parentID + 'conditioninput' + i);
        var fontNames = [
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
            change: function (args) {
                _this.newFormat[i].style.fontFamily = args.value.toString();
                document.querySelector('#' + _this.parentID + 'valuepreview' + i).style.fontFamily = args.value;
            }
        });
        this.fontNameDropDown[i].appendTo('#' + this.parentID + 'fontnameinput' + i);
        var fontSize = [
            { index: 0, name: '9px' }, { index: 1, name: '10px' }, { index: 2, name: '11px' }, { index: 3, name: '12px' },
            { index: 4, name: '13px' }, { index: 5, name: '14px' }, { index: 6, name: '15px' }, { index: 6, name: '16px' }
        ];
        value = isNullOrUndefined(format.style.fontSize) ? '12px' : format.style.fontSize;
        this.fontSizeDropDown[i] = new DropDownList({
            dataSource: fontSize, fields: { text: 'name' }, popupHeight: '200px',
            value: value, width: this.parent.isAdaptive ? '100%' : '120px',
            change: function (args) {
                _this.newFormat[i].style.fontSize = args.value.toString();
                document.querySelector('#' + _this.parentID + 'valuepreview' + i).style.fontSize = args.value;
            }
        });
        this.fontSizeDropDown[i].appendTo('#' + this.parentID + 'fontsizeinput' + i);
    };
    ConditionalFormatting.prototype.renderColorPicker = function (i) {
        var _this = this;
        var format = this.newFormat[i];
        var value = isNullOrUndefined(format.style.color) ? 'black' : format.style.color;
        var color = this.isHex(value.substr(1)) ? value : this.colourNameToHex(value);
        document.querySelector('#' + this.parentID + 'valuepreview' + i).style.color = color;
        this.fontColor[i] = new ColorPicker({
            cssClass: FORMAT_COLOR_PICKER, value: color, mode: 'Palette',
            change: function (args) {
                _this.newFormat[i].style.color = args.currentValue.hex;
                document.querySelector('#' + _this.parentID + 'valuepreview' + i).style.color =
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
            change: function (args) {
                _this.newFormat[i].style.backgroundColor = args.currentValue.hex;
                document.querySelector('#' + _this.parentID + 'valuepreview' + i).style.backgroundColor =
                    args.currentValue.hex;
            }
        });
        this.backgroundColor[i].appendTo('#' + this.parentID + 'backgroundcolor' + i);
        addClass([this.backgroundColor[i].element.nextElementSibling.querySelector('.e-selected-color')], ICON);
        var toggleBtn = new Button({
            iconCss: ICON + ' ' + FORMAT_DELETE_ICON,
            cssClass: FLAT
        });
        toggleBtn.appendTo('#' + this.parentID + 'removeButton' + i);
        toggleBtn.element.onclick = function () {
            _this.newFormat.splice(i, 1);
            _this.addFormat();
        };
    };
    ConditionalFormatting.prototype.isHex = function (h) {
        var a = parseInt(h, 16);
        while (h.charAt(0) === '0') {
            h = h.substr(1);
        }
        return (a.toString(16) === h.toLowerCase() || (a === 0 && h === ''));
    };
    ConditionalFormatting.prototype.hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    ConditionalFormatting.prototype.colourNameToHex = function (colour) {
        var colours = {
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
    };
    /**
     * To create Conditional Formatting dialog.
     * @returns void
     * @hidden
     */
    ConditionalFormatting.prototype.showConditionalFormattingDialog = function () {
        this.newFormat = [];
        for (var i = 0; i < this.parent.dataSource.conditionalFormatSettings.length; i++) {
            this.newFormat.push(extend({}, this.parent.dataSource.conditionalFormatSettings[i].properties, null, true));
        }
        this.createDialog();
        this.dialog.refresh();
        this.addFormat();
    };
    /**
     * To destroy the Conditional Formatting dialog
     * @returns void
     * @hidden
     */
    ConditionalFormatting.prototype.destroy = function () {
        if (this.dialog && !this.dialog.isDestroyed) {
            this.dialog.hide();
            for (var i = 0; i < this.newFormat.length; i++) {
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
    };
    return ConditionalFormatting;
}());

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
//# sourceMappingURL=ej2-pivotview.es5.js.map
