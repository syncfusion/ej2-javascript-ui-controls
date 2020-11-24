import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings, ICustomGroups, FieldItemInfo } from './engine';
import { ICalculatedFieldSettings, IAuthenticationInfo, IGridValues, IAxisSet } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView, PivotViewModel } from '../pivotview';
import { PivotFieldList, PivotFieldListModel } from '../pivotfieldlist';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SummaryTypes } from './types';
import { IOlapField } from './olap/engine';
import { ExcelExportProperties, ExcelRow } from '@syncfusion/ej2-grids';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */

export class PivotUtil {
    public static getType(value: Date): string {
        let val: string;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : !isNaN(Number(value)) ?
                'number' : typeof (value);
        return val;
    }

    public static resetTime(date: Date): Date {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    public static getClonedData(data: { [key: string]: Object }[]): { [key: string]: Object }[] {
        let clonedData: { [key: string]: Object }[] = [];
        if (data) {
            for (let item of data as { [key: string]: Object }[]) {
                let fields: string[] = Object.keys(item);
                let keyPos: number = 0;
                /* tslint:disable:no-any */
                let framedSet: any = {};
                /* tslint:enable:no-any */
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos]] = item[fields[keyPos]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    }

    public static getClonedPivotValues(pivotValues: IPivotValues): IPivotValues {
        let clonedSets: IPivotValues = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                clonedSets[i] = [];
                for (let j: number = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        clonedSets[i][j] = this.getClonedPivotValueObj(pivotValues[i][j] as { [key: string]: Object });
                    }
                }
            }
        }
        return clonedSets;
    }

    private static getClonedPivotValueObj(data: { [key: string]: Object }): { [key: string]: Object } {
        let keyPos: number = 0;
        /* tslint:disable:no-any */
        let framedSet: any = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            let fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    /* tslint:disable:no-any */
    private static getDefinedObj(data: { [key: string]: any }): { [key: string]: any } {
        let keyPos: number = 0;
        let framedSet: any = {};
        /* tslint:enable:no-any */
        if (!(data === null || data === undefined)) {
            let fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos]] === null || data[fields[keyPos]] === undefined)) {
                    framedSet[fields[keyPos]] = data[fields[keyPos]];
                }
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    public static inArray(value: Object, collection: Object[]): number {
        if (collection) {
            for (let i: number = 0, cnt: number = collection.length; i < cnt; i++) {
                if (collection[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    }

    public static isContainCommonElements(collection1: Object[], collection2: Object[]): boolean {
        let isContain: boolean = false;
        for (let i: number = 0, cnt: number = collection1.length; i < cnt; i++) {
            for (let j: number = 0, lnt: number = collection2.length; j < lnt; j++) {
                if (collection2[j] === collection1[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    /* tslint:disable:no-any */
    public static setPivotProperties(control: any, properties: any): void {
        control.allowServerDataBinding = false;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = false;
        }
        control.setProperties(properties, true);
        control.allowServerDataBinding = true;
        if (control.pivotGridModule) {
            control.pivotGridModule.allowServerDataBinding = true;
        }
    }
    /* tslint:enable:no-any */

    public static getClonedDataSourceSettings(dataSourceSettings: IDataOptions): IDataOptions {
        let clonesDataSource: IDataOptions = this.getDefinedObj({
            type: dataSourceSettings.type,
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            providerType: dataSourceSettings.providerType,
            url: dataSourceSettings.url,
            localeIdentifier: dataSourceSettings.localeIdentifier,
            excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : [...dataSourceSettings.excludeFields],
            expandAll: dataSourceSettings.expandAll,
            allowLabelFilter: dataSourceSettings.allowLabelFilter,
            allowValueFilter: dataSourceSettings.allowValueFilter,
            allowMemberFilter: dataSourceSettings.allowMemberFilter,
            enableSorting: dataSourceSettings.enableSorting ? true : false,
            rows: this.cloneFieldSettings(dataSourceSettings.rows),
            columns: this.cloneFieldSettings(dataSourceSettings.columns),
            filters: this.cloneFieldSettings(dataSourceSettings.filters),
            values: this.cloneFieldSettings(dataSourceSettings.values),
            filterSettings: this.cloneFilterSettings(dataSourceSettings.filterSettings),
            sortSettings: this.cloneSortSettings(dataSourceSettings.sortSettings),
            drilledMembers: this.cloneDrillMemberSettings(dataSourceSettings.drilledMembers),
            valueSortSettings: this.CloneValueSortObject(dataSourceSettings.valueSortSettings),
            valueAxis: dataSourceSettings.valueAxis,
            formatSettings: this.cloneFormatSettings(dataSourceSettings.formatSettings),
            calculatedFieldSettings: this.cloneCalculatedFieldSettings(dataSourceSettings.calculatedFieldSettings),
            fieldMapping: this.cloneFieldSettings(dataSourceSettings.fieldMapping),
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: this.cloneConditionalFormattingSettings(dataSourceSettings.conditionalFormatSettings),
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: this.cloneGroupSettings(dataSourceSettings.groupSettings),
            showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
            authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
            /* tslint:disable:no-any */
        } as { [key: string]: any });
        /* tslint:enable:no-any */
        return clonesDataSource;
    }

    public static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void {
        if (control) {
            this.setPivotProperties(control, {
                dataSourceSettings: this.getDefinedObj({
                    type: dataSourceSettings.type,
                    catalog: dataSourceSettings.catalog,
                    cube: dataSourceSettings.cube,
                    providerType: dataSourceSettings.providerType,
                    url: dataSourceSettings.url,
                    localeIdentifier: dataSourceSettings.localeIdentifier,
                    excludeFields: isNullOrUndefined(dataSourceSettings.excludeFields) ? [] : dataSourceSettings.excludeFields,
                    expandAll: dataSourceSettings.expandAll,
                    allowLabelFilter: dataSourceSettings.allowLabelFilter,
                    allowValueFilter: dataSourceSettings.allowValueFilter,
                    allowMemberFilter: dataSourceSettings.allowMemberFilter,
                    enableSorting: dataSourceSettings.enableSorting ? true : false,
                    rows: dataSourceSettings.rows,
                    columns: dataSourceSettings.columns,
                    filters: dataSourceSettings.filters,
                    values: dataSourceSettings.values,
                    filterSettings: dataSourceSettings.filterSettings,
                    sortSettings: dataSourceSettings.sortSettings,
                    drilledMembers: dataSourceSettings.drilledMembers,
                    valueSortSettings: dataSourceSettings.valueSortSettings,
                    valueAxis: dataSourceSettings.valueAxis,
                    formatSettings: dataSourceSettings.formatSettings,
                    calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings,
                    fieldMapping: dataSourceSettings.fieldMapping,
                    showSubTotals: dataSourceSettings.showSubTotals,
                    showRowSubTotals: dataSourceSettings.showRowSubTotals,
                    showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
                    showGrandTotals: dataSourceSettings.showGrandTotals,
                    showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
                    showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
                    showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
                    alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
                    conditionalFormatSettings: dataSourceSettings.conditionalFormatSettings,
                    emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
                    groupSettings: dataSourceSettings.groupSettings,
                    showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
                    authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication),
                    /* tslint:disable:no-any */
                } as { [key: string]: any })
                /* tslint:enable:no-any */
            });
        }
    }

    public static cloneFieldSettings(collection: IFieldOptions[]): IFieldOptions[] {
        if (collection) {
            let clonedCollection: IFieldOptions[] = [];
            for (let set of collection) {
                let field: IFieldOptions = {};
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    axis: set.axis,
                    baseField: set.baseField,
                    baseItem: set.baseItem,
                    isCalculatedField: set.isCalculatedField,
                    isNamedSet: set.isNamedSet,
                    showNoDataItems: set.showNoDataItems,
                    showSubTotals: set.showSubTotals,
                    type: set.type,
                    dataType: set.dataType,
                    showFilterIcon: set.showFilterIcon,
                    showSortIcon: set.showSortIcon,
                    showRemoveIcon: set.showRemoveIcon,
                    showValueTypeIcon: set.showValueTypeIcon,
                    showEditIcon: set.showEditIcon,
                    allowDragAndDrop: set.allowDragAndDrop
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneFilterSettings(collection: IFilter[]): IFilter[] {
        if (collection) {
            let clonedCollection: IFilter[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    type: set.type,
                    condition: set.condition,
                    items: set.items ? [...set.items] : set.items,
                    levelCount: set.levelCount,
                    measure: set.measure,
                    selectedField: set.selectedField,
                    showDateFilter: set.showDateFilter,
                    showLabelFilter: set.showLabelFilter,
                    showNumberFilter: set.showNumberFilter,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneSortSettings(collection: ISort[]): ISort[] {
        if (collection) {
            let clonedCollection: ISort[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    order: set.order
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneDrillMemberSettings(collection: IDrillOptions[]): IDrillOptions[] {
        if (collection) {
            let clonedCollection: IDrillOptions[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? [...set.items] : set.items
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneFormatSettings(collection: IFormatSettings[]): IFormatSettings[] {
        if (collection) {
            let clonedCollection: IFormatSettings[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    calendar: set.calendar,
                    currency: set.currency,
                    format: set.format,
                    maximumFractionDigits: set.maximumFractionDigits,
                    maximumSignificantDigits: set.maximumSignificantDigits,
                    minimumFractionDigits: set.minimumFractionDigits,
                    minimumIntegerDigits: set.minimumIntegerDigits,
                    minimumSignificantDigits: set.minimumSignificantDigits,
                    skeleton: set.skeleton,
                    type: set.type,
                    useGrouping: set.useGrouping
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static CloneValueSortObject(collection: IValueSortSettings): IValueSortSettings {
        if (collection) {
            let clonedCollection: IValueSortSettings = {
                columnIndex: collection.columnIndex,
                headerDelimiter: collection.headerDelimiter,
                headerText: collection.headerText,
                measure: collection.measure,
                sortOrder: collection.sortOrder
            };
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static CloneAuthenticationObject(collection: IAuthenticationInfo): IAuthenticationInfo {
        if (collection) {
            let clonedCollection: IAuthenticationInfo = {
                userName: collection.userName,
                password: collection.password
            };
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneCalculatedFieldSettings(collection: ICalculatedFieldSettings[]): ICalculatedFieldSettings[] {
        if (collection) {
            let clonedCollection: ICalculatedFieldSettings[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    formatString: set.formatString,
                    formula: set.formula,
                    hierarchyUniqueName: set.hierarchyUniqueName
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneConditionalFormattingSettings(collection: IConditionalFormatSettings[]): IConditionalFormatSettings[] {
        if (collection) {
            let clonedCollection: IConditionalFormatSettings[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    applyGrandTotals: set.applyGrandTotals,
                    conditions: set.conditions,
                    label: set.label,
                    measure: set.measure,
                    style: set.style ? {
                        backgroundColor: set.style.backgroundColor,
                        color: set.style.color,
                        fontFamily: set.style.fontFamily,
                        fontSize: set.style.fontSize
                    } : set.style,
                    value1: set.value1,
                    value2: set.value2
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneGroupSettings(collection: IGroupSettings[]): IGroupSettings[] {
        if (collection) {
            let clonedCollection: IGroupSettings[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    customGroups: this.cloneCustomGroups(set.customGroups),
                    endingAt: set.endingAt,
                    startingAt: set.startingAt,
                    groupInterval: set.groupInterval,
                    rangeInterval: set.rangeInterval,
                    type: set.type
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */

            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneCustomGroups(collection: ICustomGroups[]): ICustomGroups[] {
        if (collection) {
            let clonedCollection: ICustomGroups[] = [];
            for (let set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    groupName: set.groupName,
                    items: set.items ? [...set.items] : set.items
                    /* tslint:disable:no-any */
                } as { [key: string]: any }));
                /* tslint:enable:no-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static getFilterItemByName(fieldName: string, fields: IFilter[]): IFilter {
        let filterItems: IFilter[] = new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName));
        if (filterItems && filterItems.length > 0) {
            return filterItems[filterItems.length - 1];
        }
        return undefined;
    }

    /* tslint:disable-next-line:max-line-length */
    public static getFieldByName(fieldName: string, fields: IFieldOptions[] | ISort[] | IFormatSettings[] | IDrillOptions[] | IGroupSettings[] | ICalculatedFieldSettings[]): IFieldOptions | ISort | IFormatSettings | IDrillOptions | IGroupSettings | ICalculatedFieldSettings {
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }

    public static getFieldInfo(fieldName: string, control: PivotView | PivotFieldList): FieldItemInfo {
        let rows: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.rows);
        let columns: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.columns);
        let values: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.values);
        let filters: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.filters);
        let fields: IFieldOptions[][] = [rows, columns, values, filters];
        for (let i: number = 0, len: number = fields.length; i < len; i++) {
            for (let j: number = 0, cnt: number = (fields[i] ? fields[i].length : 0); j < cnt; j++) {
                if (fields[i][j] && fields[i][j].name === fieldName) {
                    /* tslint:disable-next-line:max-line-length */
                    return { fieldName: fieldName, fieldItem: fields[i][j], axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters', position: j };
                }
            }
        }
        let fieldList: IOlapField = control.dataType === 'olap' ?
            control.olapEngineModule.fieldList[fieldName] : control.engineModule.fieldList[fieldName];
        let fieldItem: IFieldOptions = (fieldList ? {
            name: fieldName,
            caption: fieldList.caption,
            baseField: fieldList.baseField,
            baseItem: fieldList.baseItem,
            isCalculatedField: fieldList.isCalculatedField,
            isNamedSet: fieldList.isNamedSets,
            showNoDataItems: fieldList.showNoDataItems,
            showSubTotals: fieldList.showSubTotals,
            type: fieldList.aggregateType as SummaryTypes,
            showFilterIcon: fieldList.showFilterIcon,
            showSortIcon: fieldList.showSortIcon,
            showRemoveIcon: fieldList.showRemoveIcon,
            showValueTypeIcon: fieldList.showValueTypeIcon,
            showEditIcon: fieldList.showEditIcon,
            allowDragAndDrop: fieldList.allowDragAndDrop
        } : undefined);
        return { fieldName: fieldName, fieldItem: fieldItem, axis: 'fieldlist', position: -1 };
    }

    /* tslint:disable-next-line:max-line-length */
    public static isButtonIconRefesh(prop: string, oldProp: PivotViewModel | PivotFieldListModel, newProp: PivotViewModel | PivotFieldListModel): boolean {
        let isButtonRefresh: boolean = false;
        try {
            if (prop === 'dataSourceSettings' && oldProp.dataSourceSettings && newProp.dataSourceSettings) {
                let propValidation: string[] = ['notAvail', 'notAvail', 'notAvail', 'notAvail'];
                let oldAxesProp: string[] = Object.keys(oldProp.dataSourceSettings);
                let newAxesProp: string[] = Object.keys(newProp.dataSourceSettings);
                if (oldAxesProp && newAxesProp && newAxesProp.length > 0 && oldAxesProp.length === newAxesProp.length) {
                    let axes: string[] = ['rows', 'columns', 'values', 'filters'];
                    /* tslint:disable:no-any */
                    for (let i: number = 0; i < newAxesProp.length; i++) {
                        let oldAxis: string[] = (newAxesProp[i] in oldProp.dataSourceSettings && !isNullOrUndefined((oldProp.dataSourceSettings as any)[newAxesProp[i]])) ? Object.keys((oldProp.dataSourceSettings as any)[newAxesProp[i]]) : [];
                        let newAxis: string[] = (newAxesProp[i] in newProp.dataSourceSettings && !isNullOrUndefined((newProp.dataSourceSettings as any)[newAxesProp[i]])) ? Object.keys((newProp.dataSourceSettings as any)[newAxesProp[i]]) : [];
                        if (axes.indexOf(newAxesProp[i]) !== -1 && axes.indexOf(oldAxesProp[i]) !== -1 &&
                            oldAxis && newAxis && newAxis.length > 0 && oldAxis.length === newAxis.length) {
                            /* tslint:disable-next-line:max-line-length */
                            let options: string[] = ['showFilterIcon', 'showSortIcon', 'showRemoveIcon', 'showValueTypeIcon', 'showEditIcon', 'allowDragAndDrop'];
                            for (let j: number = 0; j < newAxis.length; j++) {
                                let oldAxisProp: string[] = Object.keys((oldProp.dataSourceSettings as any)[newAxesProp[i]][newAxis[j]]);
                                let newAxisProp: string[] = Object.keys((newProp.dataSourceSettings as any)[newAxesProp[i]][newAxis[j]]);
                                for (let k: number = 0; k < newAxisProp.length; k++) {
                                    if (options.indexOf(newAxisProp[k]) !== -1 && options.indexOf(oldAxisProp[k]) !== -1) {
                                        propValidation[i] = 'update';
                                    } else {
                                        propValidation[i] = 'break';
                                        break;
                                    }
                                }
                                if (propValidation[i] === 'break') {
                                    break;
                                }
                            }
                        } else {
                            propValidation[i] = 'break';
                        }
                        if (propValidation[i] === 'break') {
                            break;
                        }
                    }
                    /* tslint:enable:no-any */
                }
                let a: number = 0; let b: number = 0; let c: number = 0;
                for (let validation of propValidation) {
                    if (validation === 'break') {
                        a++;
                    }
                    if (validation === 'notAvail') {
                        b++;
                    }
                    if (validation === 'update') {
                        c++;
                    }
                }
                isButtonRefresh = (a > 0 || b === 4) ? false : (a === 0 && b < 4 && c > 0);
            }
        } catch (exception) {
            isButtonRefresh = false;
        }
        return isButtonRefresh;
    }

    /* tslint:disable:no-any */
    public static formatPivotValues(pivotValues: any): any {
        let values: any = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                values[i] = [];
                for (let j: number = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        values[i][j] = {
                            axis: pivotValues[i][j].Axis,
                            actualText: pivotValues[i][j].ActualText,
                            indexObject: pivotValues[i][j].IndexObject,
                            index: pivotValues[i][j].Index,
                            rowHeaders: pivotValues[i][j].RowHeaders,
                            columnHeaders: pivotValues[i][j].ColumnHeaders,
                            formattedText: pivotValues[i][j].FormattedText,
                            actualValue: pivotValues[i][j].ActualValue,
                            rowIndex: pivotValues[i][j].RowIndex,
                            colIndex: pivotValues[i][j].ColIndex,
                            colSpan: pivotValues[i][j].ColSpan,
                            level: pivotValues[i][j].Level,
                            rowSpan: pivotValues[i][j].RowSpan,
                            isSum: pivotValues[i][j].IsSum,
                            isGrandSum: pivotValues[i][j].IsGrandSum,
                            valueSort: pivotValues[i][j].ValueSort,
                            ordinal: pivotValues[i][j].Ordinal,
                            hasChild: pivotValues[i][j].HasChild,
                            isDrilled: pivotValues[i][j].IsDrilled,
                            value: pivotValues[i][j].Value,
                            type: pivotValues[i][j].Type,
                            members: pivotValues[i][j].Members
                        };
                    }
                }
            }
        }
        return values;
    }

    public static formatPdfHeaderFooter(pdf: any): any {
        let contents: any = [];
        if (!isNullOrUndefined(pdf)) {
            for (let i: number = 0; i < pdf.length; i++) {
                let a = pdf[i];
                let content = {
                    type: a.Type,
                    pageNumberType: a.PageNumberType,
                    style: a.Style ? {
                        penColor: a.Style.PenColor,
                        penSize: a.Style.PenSize,
                        dashStyle: a.Style.DashStyle,
                        textBrushColor: a.Style.TextBrushColor,
                        textPenColor: a.Style.TextPenColor,
                        fontSize: a.Style.FontSize,
                        hAlign: a.Style.HAlign,
                        vAlign: a.Style.VAlign
                    } : a.Style,
                    points: a.Points !== null ? {
                        x1: a.Points.X1,
                        y1: a.Points.Y1,
                        x2: a.Points.X2,
                        y2: a.Points.Y2
                    } : null,
                    format: a.Format,
                    position: a.Position !== null ? {
                        x: a.Position.X,
                        y: a.Position.Y,
                    } : null,
                    size: a.Size !== null ? {
                        height: a.Size.Height,
                        width: a.Size.Width,
                    } : null,
                    src: a.Src,
                    value: a.Value,
                    font: a.Font
                };
                contents.push(content);
            }
        }
        return contents;
    }

    /* tslint:disable:no-any */
    public static formatPdfExportProperties(pdf: any): any {
        let values: any;
        values = this.getDefinedObj({
            pageOrientation: typeof pdf.PageOrientation === 'string' ? pdf.PageOrientation : null,
            pageSize: typeof pdf.PageSize === 'string' ? pdf.PageSize : null,
            header: !isNullOrUndefined(pdf.Header) ? {
                fromTop: pdf.Header.FromTop,
                height: pdf.Header.Height,
                contents: this.formatPdfHeaderFooter(pdf.Header.Contents),
            } : null,
            columns: pdf.Columns,
            footer: !isNullOrUndefined(pdf.Footer) ? {
                fromTop: pdf.Footer.FromBottom,
                height: pdf.Footer.Height,
                contents: this.formatPdfHeaderFooter(pdf.Footer.Contents),
            } : null,
            includeHiddenColumn: pdf.IncludeHiddenColumn,
            dataSource: pdf.DataSource,
            exportType: typeof pdf.ExportType === 'string' ? pdf.ExportType : null,
            theme: !isNullOrUndefined(pdf.Theme) ? {
                header: pdf.Theme.Header,
                record: pdf.Theme.Record,
                caption: pdf.Theme.Caption
            } : null,
            fileName: pdf.FileName,
            hierarchyExportMode: typeof pdf.HierarchyExportMode === 'string' ? pdf.HierarchyExportMode : null,
            allowHorizontalOverflow: pdf.AllowHorizontalOverflow
        });
        return values;
    }
    public static formatExcelStyle(style: any): any {
        let prop;
        if (!isNullOrUndefined(style)) {
            prop = this.getDefinedObj({
                fontColor: style.FontColor,
                fontName: style.FontName,
                fontSize: style.FontSize,
                hAlign: style.HAlign === String ? style.HAlign : null,
                vAlign: style.VAlign === String ? style.VAlign : null,
                bold: style.Bold,
                indent: style.Indent,
                italic: style.Italic,
                underline: style.Underline,
                backColor: style.BackColor,
                wrapText: style.WrapText,
                borders: style.Borders,
                numberFormat: style.NumberFormat,
                type: style.Type
            });
        }
        return prop;
    }

    public static formatExcelCell(cell: any): any {
        let cells: ExcelRow[] = [];
        if (!isNullOrUndefined(cell)) {
            for (let i: number = 0; i < cell.length; i++) {
                let prop = this.getDefinedObj({
                    index: !isNullOrUndefined(cell[i].Index) ? cell[i].Index : null,
                    colSpan: !isNullOrUndefined(cell[i].ColSpan) ? cell[i].ColSpan : null,
                    value: !isNullOrUndefined(cell[i].Value) ? cell[i].Value : null,
                    hyperlink: {
                        target: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.Target : null,
                        displayText: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.DisplayText : null
                    },
                    styles: this.formatExcelStyle(cell[i].Style),
                    rowSpan: !isNullOrUndefined(cell[i].RowSpan) ? cell[i].RowSpan : null
                });
            }
        }
        return cells;
    }

    public static formatExcelHeaderFooter(excel: any): any {
        let rows: ExcelRow[] = [];
        if (!isNullOrUndefined(excel)) {
            for (let i: number = 0; i < excel.Rows.length; i++) {
                let row = excel.Rows[i];
                let prop = this.getDefinedObj({
                    index: !isNullOrUndefined(row.Index) ? row.Index : null,
                    cells: this.formatExcelCell(row.Cells),
                    grouping: !isNullOrUndefined(row.Grouping) ? row.Grouping : null
                });
                rows.push(prop);
            }
        }
        return rows;
    }

    public static formatExcelExportProperties(excel: any): any {
        let prop: ExcelExportProperties;
        prop = this.getDefinedObj({
            dataSource: excel.DataSource,
            query: excel.Query,
            multipleExport: this.getDefinedObj({
                type: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.Type : null,
                blankRows: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.BlankRows : null
            }),
            header: this.getDefinedObj({
                headerRows: !isNullOrUndefined(excel.Header) ? excel.Header.HeaderRows : null,
                rows: this.formatExcelHeaderFooter(excel.Header)
            }),
            footer: this.getDefinedObj({
                footerRows: !isNullOrUndefined(excel.Footer) ? excel.Footer.FooterRows : null,
                rows: this.formatExcelHeaderFooter(excel.Footer)
            }),
            columns: excel.Columns,
            exportType: typeof excel.ExportType === 'string' ? excel.ExportType : undefined,
            includeHiddenColumn: excel.IncludeHiddenColumn,
            theme: !isNullOrUndefined(excel.Theme) ? {
                header: this.formatExcelStyle(excel.Theme.Header),
                record: this.formatExcelStyle(excel.Theme.Record),
                caption: this.formatExcelStyle(excel.Theme.Caption)
            } : undefined,
            fileName: excel.FileName,
            hierarchyExportMode: typeof excel.HierarchyExportMode === 'string' ? excel.HierarchyExportMode : undefined
        });
        return prop;
    }

    /* tslint:disable:no-any */
    public static formatFieldList(fieldList: any): any {
        let keys: string[] = Object.keys(fieldList);
        let fList: any = {};
        for (let i: number = 0; i < keys.length; i++) {
            if (fieldList[keys[i]]) {
                fList[keys[i]] = {
                    id: fieldList[keys[i]].Id,
                    caption: fieldList[keys[i]].Caption,
                    type: fieldList[keys[i]].Type,
                    formatString: fieldList[keys[i]].FormatString,
                    index: fieldList[keys[i]].Index,
                    members: fieldList[keys[i]].Members,
                    formattedMembers: fieldList[keys[i]].FormattedMembers,
                    dateMember: fieldList[keys[i]].DateMember,
                    filter: fieldList[keys[i]].Filter,
                    sort: fieldList[keys[i]].Sort,
                    aggregateType: fieldList[keys[i]].AggregateType,
                    baseField: fieldList[keys[i]].BaseField,
                    baseItem: fieldList[keys[i]].BaseItem,
                    filterType: fieldList[keys[i]].FilterType,
                    format: fieldList[keys[i]].Format,
                    formula: fieldList[keys[i]].Formula,
                    isSelected: fieldList[keys[i]].IsSelected,
                    isExcelFilter: fieldList[keys[i]].IsExcelFilter,
                    showNoDataItems: fieldList[keys[i]].ShowNoDataItems,
                    isCustomField: fieldList[keys[i]].IsCustomField,
                    showFilterIcon: fieldList[keys[i]].ShowFilterIcon,
                    showSortIcon: fieldList[keys[i]].ShowSortIcon,
                    showRemoveIcon: fieldList[keys[i]].ShowRemoveIcon,
                    showEditIcon: fieldList[keys[i]].ShowEditIcon,
                    showValueTypeIcon: fieldList[keys[i]].ShowValueTypeIcon,
                    allowDragAndDrop: fieldList[keys[i]].AllowDragAndDrop,
                    isCalculatedField: fieldList[keys[i]].IsCalculatedField,
                    showSubTotals: fieldList[keys[i]].ShowSubTotals
                }
            }
        }
        return fList;
    }

    public static frameContent(pivotValues: IPivotValues, type: string, rowPosition: number, control: PivotView | PivotFieldList): IGridValues {
        let dataContent: IGridValues = [];
        var pivot = control;
        if (pivot.dataSourceSettings.values.length > 0 && !pivot.engineModule.isEmptyData) {
            if ((pivot.enableValueSorting) || !pivot.engineModule.isEngineUpdated) {
                let rowCnt: number = 0;
                let start: number = type === 'value' ? rowPosition : 0;
                let end: number = type === 'value' ? pivotValues.length : rowPosition;
                for (var rCnt = start; rCnt < end; rCnt++) {
                    if (pivotValues[rCnt]) {
                        rowCnt = type === 'header' ? rCnt : rowCnt;
                        dataContent[rowCnt] = {} as IAxisSet[];
                        for (var cCnt = 0; cCnt < pivotValues[rCnt].length; cCnt++) {
                            if (pivotValues[rCnt][cCnt]) {
                                dataContent[rowCnt][cCnt] = pivotValues[rCnt][cCnt] as IAxisSet;
                            }
                        }
                        rowCnt++;
                    }
                }
            }
        }
        return dataContent;
    }

    public static getLocalizedObject(control: PivotView | PivotFieldList): Object {
        let locale: Object = new Object();
        (locale as any)["Null"] = control.localeObj.getConstant('null');
        (locale as any)["Years"] = control.localeObj.getConstant('Years');
        (locale as any)["Quarters"] = control.localeObj.getConstant('Quarters');
        (locale as any)["Months"] = control.localeObj.getConstant('Months');
        (locale as any)["Days"] = control.localeObj.getConstant('Days');
        (locale as any)["Hours"] = control.localeObj.getConstant('Hours');
        (locale as any)["Minutes"] = control.localeObj.getConstant('Minutes');
        (locale as any)["Seconds"] = control.localeObj.getConstant('Seconds');
        (locale as any)["QuarterYear"] = control.localeObj.getConstant('QuarterYear');
        (locale as any)["Of"] = control.localeObj.getConstant('of');
        (locale as any)["Qtr"] = control.localeObj.getConstant('qtr');
        (locale as any)["Undefined"] = control.localeObj.getConstant('undefined');
        (locale as any)["GroupOutOfRange"] = control.localeObj.getConstant('groupOutOfRange');
        (locale as any)["Group"] = control.localeObj.getConstant('group');
        return locale;
    }

    public static updateReport(control: PivotView | PivotFieldList, report: any): void {
        control.setProperties({ dataSourceSettings: { rows: [] } }, true);
        control.setProperties({ dataSourceSettings: { columns: [] } }, true);
        control.setProperties({ dataSourceSettings: { formatSettings: [] } }, true);
        for (let i: number = 0; i < report.Rows.length; i++) {
            control.dataSourceSettings.rows.push({
                name: report.Rows[i].Name,
                caption: report.Rows[i].Caption,
                showNoDataItems: report.Rows[i].ShowNoDataItems,
                baseField: report.Rows[i].BaseField,
                baseItem: report.Rows[i].BaseItem,
                showFilterIcon: report.Rows[i].ShowFilterIcon,
                showSortIcon: report.Rows[i].ShowSortIcon,
                showEditIcon: report.Rows[i].ShowEditIcon,
                showRemoveIcon: report.Rows[i].ShowRemoveIcon,
                showSubTotals: report.Rows[i].ShowValueTypeIcon,
                allowDragAndDrop: report.Rows[i].AllowDragAndDrop,
                axis: report.Rows[i].Axis,
                dataType: report.Rows[i].DataType,
                isCalculatedField: report.Rows[i].IsCalculatedField,
                showValueTypeIcon: report.Rows[i].ShowValueTypeIcon,
                type: report.Rows[i].Type
            });
        }
        for (let i: number = 0; i < report.Columns.length; i++) {
            control.dataSourceSettings.columns.push({
                name: report.Columns[i].Name,
                caption: report.Columns[i].Caption,
                showNoDataItems: report.Columns[i].ShowNoDataItems,
                baseField: report.Columns[i].BaseField,
                baseItem: report.Columns[i].BaseItem,
                showFilterIcon: report.Columns[i].ShowFilterIcon,
                showSortIcon: report.Columns[i].ShowSortIcon,
                showEditIcon: report.Columns[i].ShowEditIcon,
                showRemoveIcon: report.Columns[i].ShowRemoveIcon,
                showSubTotals: report.Columns[i].ShowValueTypeIcon,
                allowDragAndDrop: report.Columns[i].AllowDragAndDrop,
                axis: report.Columns[i].Axis,
                dataType: report.Columns[i].DataType,
                isCalculatedField: report.Columns[i].IsCalculatedField,
                showValueTypeIcon: report.Columns[i].ShowValueTypeIcon,
                type: report.Columns[i].Type
            });
        }
        for (let i: number = 0; i < report.FormatSettings.length; i++) {
            control.dataSourceSettings.formatSettings.push({
                name: report.FormatSettings[i].Name,
                format: report.FormatSettings[i].Format,
                type: report.FormatSettings[i].Type,
                currency: report.FormatSettings[i].Currency,
                maximumFractionDigits: report.FormatSettings[i].MaximumFractionDigits,
                maximumSignificantDigits: report.FormatSettings[i].MaximumSignificantDigits,
                minimumFractionDigits: report.FormatSettings[i].MinimumFractionDigits,
                minimumIntegerDigits: report.FormatSettings[i].MinimumIntegerDigits,
                minimumSignificantDigits: report.FormatSettings[i].MinimumSignificantDigits,
                skeleton: report.FormatSettings[i].Skeleton,
                useGrouping: report.FormatSettings[i].UseGrouping
            });
        }
    }

    public static generateUUID(): string {
        let d: number = new Date().getTime();
        let d2: number = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r: number = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}