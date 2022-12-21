import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings, ICustomGroups, FieldItemInfo } from './engine';
import { ICalculatedFieldSettings, IAuthenticationInfo, IGridValues, IAxisSet } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView, PivotViewModel } from '../pivotview';
import { PivotFieldList, PivotFieldListModel } from '../pivotfieldlist';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SummaryTypes } from './types';
import { IOlapField } from './olap/engine';
import { HeadersSortEventArgs } from '../common/base/interface';
import { PdfPageSize } from '@syncfusion/ej2-grids';
import { SizeF } from '@syncfusion/ej2-pdf-export';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 *
 * @hidden
 */

export class PivotUtil {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public static getType(value: any): string {
        let val: string;    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dateValue: any = new Date(value);
        if (typeof value === 'boolean') {
            val = 'boolean';
        } else if (!isNaN(Number(value))) {
            val = 'number';
        } else if (dateValue instanceof Date && !isNaN(dateValue.valueOf())) {
            val = (dateValue && dateValue.getDay() && (dateValue.getHours() > 0 || dateValue.getMinutes() > 0 ||
                dateValue.getSeconds() > 0 || dateValue.getMilliseconds() > 0) ? 'datetime' : 'date');
        } else {
            val = typeof(value);
        }
        return val;
    }

    public static resetTime(date: Date): Date {
        date.setHours(0, 0, 0, 0);
        return date;
    }

    public static getClonedData(data: { [key: string]: Object }[]): { [key: string]: Object }[] {
        const clonedData: { [key: string]: Object }[] = [];
        if (data) {
            for (const item of data as { [key: string]: Object }[]) {   /* eslint-enable @typescript-eslint/ban-types */
                const fields: string[] = Object.keys(item);
                let keyPos: number = 0;     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const framedSet: any = {};
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos as number]] = item[fields[keyPos as number]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private static getDefinedObj(data: { [key: string]: any }): { [key: string]: any } {
        let keyPos: number = 0;
        let framedSet: any = {}; /* eslint-enable @typescript-eslint/no-explicit-any */
        if (!(data === null || data === undefined)) {
            const fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos as number]] === null || data[fields[keyPos as number]] === undefined)) {
                    framedSet[fields[keyPos as number]] = data[fields[keyPos as number]];
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
                if (collection[i as number] === value) {
                    return i;
                }
            }
        }
        return -1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
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

    public static getClonedDataSourceSettings(dataSourceSettings: IDataOptions): IDataOptions {
        const clonesDataSource: IDataOptions = this.getDefinedObj({
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
            grandTotalsPosition: dataSourceSettings.grandTotalsPosition,
            formatSettings: this.cloneFormatSettings(dataSourceSettings.formatSettings),
            calculatedFieldSettings: this.cloneCalculatedFieldSettings(dataSourceSettings.calculatedFieldSettings),
            fieldMapping: this.cloneFieldSettings(dataSourceSettings.fieldMapping),
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            subTotalsPosition: dataSourceSettings.subTotalsPosition,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: this.cloneConditionalFormattingSettings(dataSourceSettings.conditionalFormatSettings),
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: this.cloneGroupSettings(dataSourceSettings.groupSettings),
            showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
            authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication)
        } as { [key: string]: any });   /* eslint-disable-line @typescript-eslint/no-explicit-any */
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
                    grandTotalsPosition: dataSourceSettings.grandTotalsPosition,
                    formatSettings: dataSourceSettings.formatSettings,
                    calculatedFieldSettings: dataSourceSettings.calculatedFieldSettings,
                    fieldMapping: dataSourceSettings.fieldMapping,
                    showSubTotals: dataSourceSettings.showSubTotals,
                    showRowSubTotals: dataSourceSettings.showRowSubTotals,
                    showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
                    subTotalsPosition: dataSourceSettings.subTotalsPosition,
                    showGrandTotals: dataSourceSettings.showGrandTotals,
                    showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
                    showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
                    showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
                    alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
                    conditionalFormatSettings: dataSourceSettings.conditionalFormatSettings,
                    emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
                    groupSettings: dataSourceSettings.groupSettings,
                    showAggregationOnValueField: dataSourceSettings.showAggregationOnValueField,
                    authentication: this.CloneAuthenticationObject(dataSourceSettings.authentication)
                } as { [key: string]: any })    /* eslint-disable-line @typescript-eslint/no-explicit-any */
            });
        }
    }

    public static cloneFieldSettings(collection: IFieldOptions[]): IFieldOptions[] {
        if (collection) {
            const clonedCollection: IFieldOptions[] = [];
            for (const set of collection) {
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
                    allowDragAndDrop: set.allowDragAndDrop,
                    expandAll: set.expandAll,
                    groupName: set.groupName
                } as { [key: string]: any }));  /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneOlapFieldSettings(collection: IOlapField[]): IOlapField[] {
        if (collection) {
            const clonedCollection: IOlapField[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    caption: set.caption,
                    hasChildren: set.hasChildren,
                    id: set.id,
                    isSelected: set.isSelected,
                    name: set.name,
                    spriteCssClass: set.spriteCssClass,
                    tag: set.tag,
                    type: set.type,
                    pid: set.pid,
                    expanded: set.expanded,
                    defaultHierarchy: set.defaultHierarchy,
                    hasAllMember: set.hasAllMember,
                    allMember: set.allMember,
                    isChecked: set.isChecked,
                    filterMembers: set.filterMembers,
                    childMembers: set.childMembers,
                    searchMembers: set.searchMembers,
                    htmlAttributes: set.htmlAttributes,
                    currrentMembers: set.currrentMembers,
                    isHierarchy: set.isHierarchy,
                    isNamedSets: set.isNamedSets,
                    formatString: set.formatString,
                    actualFilter: set.actualFilter,
                    levels: set.levels,
                    levelCount: set.levelCount,
                    memberType: set.memberType,
                    fieldType: set.fieldType,
                    parentHierarchy: set.parentHierarchy
                } as { [key: string]: any }));  /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneFilterSettings(collection: IFilter[]): IFilter[] {
        if (collection) {
            const clonedCollection: IFilter[] = [];
            for (const set of collection) {
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
                } as { [key: string]: any }));  /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneSortSettings(collection: ISort[]): ISort[] {
        if (collection) {
            const clonedCollection: ISort[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    order: set.order,
                    membersOrder: set.membersOrder ? [...set.membersOrder] : set.membersOrder
                } as { [key: string]: any }));  /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneDrillMemberSettings(collection: IDrillOptions[]): IDrillOptions[] {
        if (collection) {
            const clonedCollection: IDrillOptions[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? [...set.items] : set.items
                } as { [key: string]: any })); /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneFormatSettings(collection: IFormatSettings[]): IFormatSettings[] {
        if (collection) {
            const clonedCollection: IFormatSettings[] = [];
            for (const set of collection) {
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
                } as { [key: string]: any })); /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static CloneValueSortObject(collection: IValueSortSettings): IValueSortSettings {
        if (collection) {
            const clonedCollection: IValueSortSettings = {
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
            const clonedCollection: IAuthenticationInfo = {
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
            const clonedCollection: ICalculatedFieldSettings[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    formatString: set.formatString,
                    formula: set.formula,
                    hierarchyUniqueName: set.hierarchyUniqueName
                } as { [key: string]: any })); /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneConditionalFormattingSettings(collection: IConditionalFormatSettings[]): IConditionalFormatSettings[] {
        if (collection) {
            const clonedCollection: IConditionalFormatSettings[] = [];
            for (const set of collection) {
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
                } as { [key: string]: any })); /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneGroupSettings(collection: IGroupSettings[]): IGroupSettings[] {
        if (collection) {
            const clonedCollection: IGroupSettings[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    caption: set.caption,
                    customGroups: this.cloneCustomGroups(set.customGroups),
                    endingAt: set.endingAt,
                    startingAt: set.startingAt,
                    groupInterval: set.groupInterval,
                    rangeInterval: set.rangeInterval,
                    type: set.type
                } as { [key: string]: any })); /* eslint-disable-line @typescript-eslint/no-explicit-any */

            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneCustomGroups(collection: ICustomGroups[]): ICustomGroups[] {
        if (collection) {
            const clonedCollection: ICustomGroups[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    groupName: set.groupName,
                    items: set.items ? [...set.items] : set.items
                } as { [key: string]: any }));  /* eslint-disable-line @typescript-eslint/no-explicit-any */
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static getFilterItemByName(fieldName: string, fields: IFilter[]): IFilter {
        const filterItems: IFilter[] = new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName));
        if (filterItems && filterItems.length > 0) {
            return filterItems[filterItems.length - 1];
        }
        return undefined;
    }

    public static getFieldByName(fieldName: string, fields: IFieldOptions[] | ISort[] | IFormatSettings[] | IDrillOptions[] | IGroupSettings[] | ICalculatedFieldSettings[]): IFieldOptions | ISort | IFormatSettings | IDrillOptions | IGroupSettings | ICalculatedFieldSettings { /* eslint-disable-line */
        return new DataManager({ json: fields }).executeLocal(new Query().where('name', 'equal', fieldName))[0];
    }

    public static getFieldInfo(fieldName: string, control: PivotView | PivotFieldList, hasAllField?: boolean): FieldItemInfo {
        if (!hasAllField) {
            const rows: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.rows);
            const columns: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.columns);
            const values: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.values);
            const filters: IFieldOptions[] = this.cloneFieldSettings(control.dataSourceSettings.filters);
            const fields: IFieldOptions[][] = [rows, columns, values, filters];
            for (let i: number = 0, len: number = fields.length; i < len; i++) {
                for (let j: number = 0, cnt: number = (fields[i as number] ? fields[i as number].length : 0); j < cnt; j++) {
                    if (fields[i as number][j as number] && fields[i as number][j as number].name === fieldName) {
                        return { fieldName: fieldName, fieldItem: fields[i as number][j as number], axis: i === 0 ? 'rows' : i === 1 ? 'columns' : i === 2 ? 'values' : 'filters', position: j };
                    }
                }
            }
        }
        const fieldList: IOlapField = control.dataType === 'olap' ?
            control.olapEngineModule.fieldList[fieldName as string] : control.engineModule.fieldList[fieldName as string];
        const fieldItem: IFieldOptions = (fieldList ? {
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
            allowDragAndDrop: fieldList.allowDragAndDrop,
            expandAll: fieldList.expandAll
        } : undefined);
        return { fieldName: fieldName, fieldItem: fieldItem, axis: 'fieldlist', position: -1 };
    }

    public static isButtonIconRefesh(prop: string, oldProp: PivotViewModel | PivotFieldListModel, newProp: PivotViewModel | PivotFieldListModel): boolean { /* eslint-disable-line */
        let isButtonRefresh: boolean = false;
        try {
            if (prop === 'dataSourceSettings' && oldProp.dataSourceSettings && newProp.dataSourceSettings) {
                const propValidation: string[] = ['notAvail', 'notAvail', 'notAvail', 'notAvail'];
                const oldAxesProp: string[] = Object.keys(oldProp.dataSourceSettings);
                const newAxesProp: string[] = Object.keys(newProp.dataSourceSettings);
                if (oldAxesProp && newAxesProp && newAxesProp.length > 0 && oldAxesProp.length === newAxesProp.length) {
                    const axes: string[] = ['rows', 'columns', 'values', 'filters']; /* eslint-disable @typescript-eslint/no-explicit-any */
                    for (let i: number = 0; i < newAxesProp.length; i++) {
                        const oldAxis: string[] = (newAxesProp[i as number] in oldProp.dataSourceSettings &&
                            !isNullOrUndefined((oldProp.dataSourceSettings as any)[newAxesProp[i as number]])) ?
                            Object.keys((oldProp.dataSourceSettings as any)[newAxesProp[i as number]]) : [];
                        const newAxis: string[] = (newAxesProp[i as number] in newProp.dataSourceSettings &&
                            !isNullOrUndefined((newProp.dataSourceSettings as any)[newAxesProp[i as number]])) ?
                            Object.keys((newProp.dataSourceSettings as any)[newAxesProp[i as number]]) : [];
                        if (axes.indexOf(newAxesProp[i as number]) !== -1 && axes.indexOf(oldAxesProp[i as number]) !== -1 &&
                            oldAxis && newAxis && newAxis.length > 0 && oldAxis.length === newAxis.length) {
                            const options: string[] = ['showFilterIcon', 'showSortIcon', 'showRemoveIcon', 'showValueTypeIcon', 'showEditIcon', 'allowDragAndDrop', 'expandAll'];
                            for (let j: number = 0; j < newAxis.length; j++) {
                                const oldAxisProp: string[] =
                                    Object.keys((oldProp.dataSourceSettings as any)[newAxesProp[i as number]][newAxis[j as number]]);
                                const newAxisProp: string[] =
                                    Object.keys((newProp.dataSourceSettings as any)[newAxesProp[i as number]][newAxis[j as number]]);
                                for (let k: number = 0; k < newAxisProp.length; k++) {  /* eslint-enable @typescript-eslint/no-explicit-any */
                                    if (options.indexOf(newAxisProp[k as number]) !== -1 &&
                                        options.indexOf(oldAxisProp[k as number]) !== -1) {
                                        propValidation[i as number] = 'update';
                                    } else {
                                        propValidation[i as number] = 'break';
                                        break;
                                    }
                                }
                                if (propValidation[i as number] === 'break') {
                                    break;
                                }
                            }
                        } else {
                            propValidation[i as number] = 'break';
                        }
                        if (propValidation[i as number] === 'break') {
                            break;
                        }
                    }
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                }
                let a: number = 0; let b: number = 0; let c: number = 0;
                for (const validation of propValidation) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public static formatPivotValues(pivotValues: any): any { // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const values: any = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i as number]) {
                values[i as number] = [];
                for (let j: number = 0; j < pivotValues[i as number].length; j++) {
                    if (pivotValues[i as number][j as number]) {
                        values[i as number][j as number] = {
                            axis: pivotValues[i as number][j as number].Axis,
                            actualText: pivotValues[i as number][j as number].ActualText,
                            indexObject: pivotValues[i as number][j as number].IndexObject,
                            index: pivotValues[i as number][j as number].Index,
                            rowHeaders: pivotValues[i as number][j as number].RowHeaders,
                            columnHeaders: pivotValues[i as number][j as number].ColumnHeaders,
                            formattedText: pivotValues[i as number][j as number].FormattedText,
                            actualValue: pivotValues[i as number][j as number].ActualValue,
                            rowIndex: pivotValues[i as number][j as number].RowIndex,
                            colIndex: pivotValues[i as number][j as number].ColIndex,
                            colSpan: pivotValues[i as number][j as number].ColSpan,
                            level: pivotValues[i as number][j as number].Level,
                            rowSpan: pivotValues[i as number][j as number].RowSpan,
                            isSum: pivotValues[i as number][j as number].IsSum,
                            isGrandSum: pivotValues[i as number][j as number].IsGrandSum,
                            valueSort: pivotValues[i as number][j as number].ValueSort,
                            ordinal: pivotValues[i as number][j as number].Ordinal,
                            hasChild: pivotValues[i as number][j as number].HasChild,
                            isDrilled: pivotValues[i as number][j as number].IsDrilled,
                            value: pivotValues[i as number][j as number].Value,
                            type: pivotValues[i as number][j as number].Type,
                            members: pivotValues[i as number][j as number].Members
                        };
                    }
                }
            }
        }
        return values;
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
    public static formatFieldList(fieldList: any): any {
        const keys: string[] = Object.keys(fieldList);
        const fList: any = {}; /* eslint-disable-line @typescript-eslint/no-explicit-any */
        for (let i: number = 0; i < keys.length; i++) {
            if (fieldList[keys[i as number]]) {
                fList[keys[i as number]] = {
                    id: fieldList[keys[i as number]].Id,
                    caption: fieldList[keys[i as number]].Caption,
                    type: fieldList[keys[i as number]].Type,
                    formatString: fieldList[keys[i as number]].FormatString,
                    index: fieldList[keys[i as number]].Index,
                    members: fieldList[keys[i as number]].Members,
                    formattedMembers: fieldList[keys[i as number]].FormattedMembers,
                    dateMember: fieldList[keys[i as number]].DateMember,
                    filter: fieldList[keys[i as number]].Filter,
                    sort: fieldList[keys[i as number]].Sort,
                    aggregateType: fieldList[keys[i as number]].AggregateType,
                    baseField: fieldList[keys[i as number]].BaseField,
                    baseItem: fieldList[keys[i as number]].BaseItem,
                    filterType: fieldList[keys[i as number]].FilterType,
                    format: fieldList[keys[i as number]].Format,
                    formula: fieldList[keys[i as number]].Formula,
                    isSelected: fieldList[keys[i as number]].IsSelected,
                    isExcelFilter: fieldList[keys[i as number]].IsExcelFilter,
                    showNoDataItems: fieldList[keys[i as number]].ShowNoDataItems,
                    isCustomField: fieldList[keys[i as number]].IsCustomField,
                    showFilterIcon: fieldList[keys[i as number]].ShowFilterIcon,
                    showSortIcon: fieldList[keys[i as number]].ShowSortIcon,
                    showRemoveIcon: fieldList[keys[i as number]].ShowRemoveIcon,
                    showEditIcon: fieldList[keys[i as number]].ShowEditIcon,
                    showValueTypeIcon: fieldList[keys[i as number]].ShowValueTypeIcon,
                    allowDragAndDrop: fieldList[keys[i as number]].AllowDragAndDrop,
                    isCalculatedField: fieldList[keys[i as number]].IsCalculatedField,
                    showSubTotals: fieldList[keys[i as number]].ShowSubTotals,
                    expandAll: fieldList[keys[i as number]].expandAll,
                    groupName: fieldList[keys[i as number]].groupName
                };
            }
        }
        return fList;
    }

    public static frameContent(pivotValues: IPivotValues, type: string, rowPosition: number,
                               control: PivotView | PivotFieldList): IGridValues {
        const dataContent: IGridValues = [];
        const pivot: PivotView | PivotFieldList = control;
        if (pivot.dataSourceSettings.values.length > 0 && !pivot.engineModule.isEmptyData) {
            if ((pivot.enableValueSorting) || !pivot.engineModule.isEngineUpdated) {
                let rowCnt: number = 0;
                const start: number = type === 'value' ? rowPosition : 0;
                const end: number = type === 'value' ? pivotValues.length : rowPosition;
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
            }
        }
        return dataContent;
    }

    public static getLocalizedObject(control: PivotView | PivotFieldList): Object {
        const locale: Object = new Object();    /* eslint-enable @typescript-eslint/ban-types */
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (locale as any)['Null'] = control.localeObj.getConstant('null');
        (locale as any)['Years'] = control.localeObj.getConstant('Years');
        (locale as any)['Quarters'] = control.localeObj.getConstant('Quarters');
        (locale as any)['Months'] = control.localeObj.getConstant('Months');
        (locale as any)['Days'] = control.localeObj.getConstant('Days');
        (locale as any)['Hours'] = control.localeObj.getConstant('Hours');
        (locale as any)['Minutes'] = control.localeObj.getConstant('Minutes');
        (locale as any)['Seconds'] = control.localeObj.getConstant('Seconds');
        (locale as any)['QuarterYear'] = control.localeObj.getConstant('QuarterYear');
        (locale as any)['Of'] = control.localeObj.getConstant('of');
        (locale as any)['Qtr'] = control.localeObj.getConstant('qtr');
        (locale as any)['Undefined'] = control.localeObj.getConstant('undefined');
        (locale as any)['GroupOutOfRange'] = control.localeObj.getConstant('groupOutOfRange');
        (locale as any)['Group'] = control.localeObj.getConstant('group');
        return locale;  /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public static updateReport(control: PivotView | PivotFieldList, report: any): void {
        control.setProperties({ dataSourceSettings: { rows: [] } }, true);
        control.setProperties({ dataSourceSettings: { columns: [] } }, true);
        control.setProperties({ dataSourceSettings: { formatSettings: [] } }, true);
        for (let i: number = 0; i < report.Rows.length; i++) {
            control.dataSourceSettings.rows.push({
                name: report.Rows[i as number].Name,
                caption: report.Rows[i as number].Caption,
                showNoDataItems: report.Rows[i as number].ShowNoDataItems,
                baseField: report.Rows[i as number].BaseField,
                baseItem: report.Rows[i as number].BaseItem,
                showFilterIcon: report.Rows[i as number].ShowFilterIcon,
                showSortIcon: report.Rows[i as number].ShowSortIcon,
                showEditIcon: report.Rows[i as number].ShowEditIcon,
                showRemoveIcon: report.Rows[i as number].ShowRemoveIcon,
                showSubTotals: report.Rows[i as number].ShowValueTypeIcon,
                allowDragAndDrop: report.Rows[i as number].AllowDragAndDrop,
                axis: report.Rows[i as number].Axis,
                dataType: report.Rows[i as number].DataType,
                isCalculatedField: report.Rows[i as number].IsCalculatedField,
                showValueTypeIcon: report.Rows[i as number].ShowValueTypeIcon,
                type: report.Rows[i as number].Type,
                expandAll: report.Rows[i as number].expandAll
            });
        }
        for (let i: number = 0; i < report.Columns.length; i++) {
            control.dataSourceSettings.columns.push({
                name: report.Columns[i as number].Name,
                caption: report.Columns[i as number].Caption,
                showNoDataItems: report.Columns[i as number].ShowNoDataItems,
                baseField: report.Columns[i as number].BaseField,
                baseItem: report.Columns[i as number].BaseItem,
                showFilterIcon: report.Columns[i as number].ShowFilterIcon,
                showSortIcon: report.Columns[i as number].ShowSortIcon,
                showEditIcon: report.Columns[i as number].ShowEditIcon,
                showRemoveIcon: report.Columns[i as number].ShowRemoveIcon,
                showSubTotals: report.Columns[i as number].ShowValueTypeIcon,
                allowDragAndDrop: report.Columns[i as number].AllowDragAndDrop,
                axis: report.Columns[i as number].Axis,
                dataType: report.Columns[i as number].DataType,
                isCalculatedField: report.Columns[i as number].IsCalculatedField,
                showValueTypeIcon: report.Columns[i as number].ShowValueTypeIcon,
                type: report.Columns[i as number].Type,
                expandAll: report.columns[i as number].expandAll
            });
        }
        for (let i: number = 0; i < report.FormatSettings.length; i++) {
            control.dataSourceSettings.formatSettings.push({
                name: report.FormatSettings[i as number].Name,
                format: report.FormatSettings[i as number].Format,
                type: report.FormatSettings[i as number].Type,
                currency: report.FormatSettings[i as number].Currency,
                maximumFractionDigits: report.FormatSettings[i as number].MaximumFractionDigits,
                maximumSignificantDigits: report.FormatSettings[i as number].MaximumSignificantDigits,
                minimumFractionDigits: report.FormatSettings[i as number].MinimumFractionDigits,
                minimumIntegerDigits: report.FormatSettings[i as number].MinimumIntegerDigits,
                minimumSignificantDigits: report.FormatSettings[i as number].MinimumSignificantDigits,
                skeleton: report.FormatSettings[i as number].Skeleton,
                useGrouping: report.FormatSettings[i as number].UseGrouping
            });
        }
    }

    public static generateUUID(): string {
        let d: number = new Date().getTime();
        let d2: number = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
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

    /**
     * It performing the Custom Sorting.
     *
     * @param {HeadersSortEventArgs} sortDetails - It contains the sort Details.
     * @param {IAxisSet[]} sortMembersOrder - It contains the sort Members Order.
     * @param {string | boolean} type - It contains the type.
     * @param {boolean} hasMembersOrder - It contains the has Members Order.
     * @param {boolean} isOlap - It contains the isOlap.
     * @returns {IAxisSet[]} - It returns the sorted data as IAxisSet[].
     * @hidden
     */
    public static applyCustomSort(sortDetails: HeadersSortEventArgs, sortMembersOrder: IAxisSet[], type: string | boolean,
                                  hasMembersOrder?: boolean, isOlap?: boolean): IAxisSet[] {
        let grandTotal: IAxisSet;
        let order: string[] | number[] = [];
        if (sortDetails.IsOrderChanged) {
            order = sortDetails.members;
        }
        else {
            order = (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === 'None' || sortDetails.sortOrder === undefined) ? [].concat(sortDetails.members) : [].concat(sortDetails.members).reverse();
        }
        const updatedMembers: string[] | number[] = [];
        const isNormalType: boolean = type === undefined || type === 'string' || type === 'number';
        if (sortMembersOrder[0].actualText === 'Grand Total') {
            grandTotal = sortMembersOrder[0];
            sortMembersOrder.shift();
        }
        for (let i: number = 0, j: number = 0; i < sortMembersOrder.length; i++) {
            const member: IAxisSet = sortMembersOrder[i as number];
            const sortText: string | number = isOlap ? member.formattedText : isNormalType ? member.actualText :
                type === true ? member.actualText.toString() : member.dateText;
            if (order[j as number] === sortText) {
                sortMembersOrder.splice(j++, 0, member);
                sortMembersOrder.splice(++i, 1);
                if (j < order.length) {
                    i = -1;
                }
                else {
                    if (!hasMembersOrder) {
                        updatedMembers.splice(--j, 0, sortText as string);
                    }
                    break;
                }
            }
            if (i >= 0 && !hasMembersOrder) {
                updatedMembers[i as number] = sortText;
            }
        }
        if (!hasMembersOrder) {
            for (let i: number = updatedMembers.length; i < sortMembersOrder.length; i++) {
                const member: IAxisSet = sortMembersOrder[i as number];
                const sortText: string | number = isOlap ? member.formattedText : isNormalType ? member.actualText :
                    type === true ? member.actualText.toString() : member.dateText;
                updatedMembers[i as number] = sortText;
            }
            if (updatedMembers[updatedMembers.length - 1] === 'Grand Total') {
                updatedMembers.pop();
            }
            sortDetails.members = updatedMembers;
        }
        if (grandTotal) {
            sortMembersOrder.splice(0, 0, grandTotal);
        }
        return sortMembersOrder;
    }

    /**
     * It performs to returnssorted headers.
     *
     * @param {IAxisSet[]} sortMembersOrder - It contains the sort members order.
     * @param {string} sortOrder - It contains the sort order.
     * @param {string | boolean} type - It contains the type.
     * @returns {IAxisSet[]} - It returns the sorted data as IAxisSet[].
     * @hidden
     */
    public static applyHeadersSort(sortMembersOrder: IAxisSet[], sortOrder: string, type: string | boolean): IAxisSet[] {
        if (type === 'datetime' || type === 'date' || type === 'time') {
            sortMembersOrder = sortOrder === 'Ascending' ?
                (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.dateText > b.dateText) ? 1 :
                    ((b.dateText > a.dateText) ? -1 : 0))) : sortOrder === 'Descending' ?
                    (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.dateText < b.dateText) ? 1 :
                        ((b.dateText < a.dateText) ? -1 : 0))) : sortMembersOrder;
        }
        else if (type === true) {
            sortMembersOrder = sortOrder === 'Ascending' ?
                (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : (a.actualText === 'Out of Range') ? 1 : (b.actualText === 'Out of Range') ? -1 : (Number(a.actualText.toString().match(/\d+/)) > Number(b.actualText.toString().match(/\d+/))) ? 1 : ((Number(b.actualText.toString().match(/\d+/)) > Number(a.actualText.toString().match(/\d+/))) ? -1 : 0))) :
                sortOrder === 'Descending' ?
                    (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : (a.actualText === 'Out of Range') ? -1 : (b.actualText === 'Out of Range') ? 1 : (Number(a.actualText.toString().match(/\d+/)) < Number(b.actualText.toString().match(/\d+/))) ? 1 : ((Number(b.actualText.toString().match(/\d+/)) < Number(a.actualText.toString().match(/\d+/))) ? -1 : 0))) :
                    sortMembersOrder;
        }
        else {
            sortMembersOrder = sortOrder === 'Ascending' ?
                (sortMembersOrder.sort(function (a: IAxisSet, b: IAxisSet): number { return (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : ((a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0)); })) :
                sortOrder === 'Descending' ?
                    (sortMembersOrder.sort(function (a: IAxisSet, b: IAxisSet): number { return (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : ((a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0)); })) :
                    sortMembersOrder;
        }
        return sortMembersOrder;
    }

    /**
     *
     * @param {any} header - It contains the value of header
     * @returns {IAxisSet} - It frame Header With Keys
     * @hidden */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    public static frameHeaderWithKeys(header: any): IAxisSet {
        const keys: string[] = Object.keys(header);
        let keyPos: number = 0; // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const framedHeader: any = {};
        while (keyPos < keys.length) {
            framedHeader[keys[keyPos as number]] = header[keys[keyPos as number]];
            keyPos++;
        }
        return framedHeader;
    }

    /**
     *
     * @param {PdfPageSize} pageSize - It contains the value of page Size
     * @returns {SizeF} - It returns the value as SizeF
     * @hidden */
    public static getPageSize(pageSize: PdfPageSize): SizeF {
        switch (pageSize) {
        case 'Letter':
            return new SizeF(612, 792);
        case 'Note':
            return new SizeF(540, 720);
        case 'Legal':
            return new SizeF(612, 1008);
        case 'A0':
            return new SizeF(2380, 3368);
        case 'A1':
            return new SizeF(1684, 2380);
        case 'A2':
            return new SizeF(1190, 1684);
        case 'A3':
            return new SizeF(842, 1190);
        case 'A5':
            return new SizeF(421, 595);
        case 'A6':
            return new SizeF(297, 421);
        case 'A7':
            return new SizeF(210, 297);
        case 'A8':
            return new SizeF(148, 210);
        case 'A9':
            return new SizeF(105, 148);
        case 'B0':
            return new SizeF(2836, 4008);
        case 'B1':
            return new SizeF(2004, 2836);
        case 'B2':
            return new SizeF(1418, 2004);
        case 'B3':
            return new SizeF(1002, 1418);
        case 'B4':
            return new SizeF(709, 1002);
        case 'B5':
            return new SizeF(501, 709);
        case 'Archa':
            return new SizeF(648, 864);
        case 'Archb':
            return new SizeF(864, 1296);
        case 'Archc':
            return new SizeF(1296, 1728);
        case 'Archd':
            return new SizeF(1728, 2592);
        case 'Arche':
            return new SizeF(2592, 3456);
        case 'Flsa':
            return new SizeF(612, 936);
        case 'HalfLetter':
            return new SizeF(396, 612);
        case 'Letter11x17':
            return new SizeF(792, 1224);
        case 'Ledger':
            return new SizeF(1224, 792);
        default:
            return new SizeF(595, 842);
        }
    }
}
