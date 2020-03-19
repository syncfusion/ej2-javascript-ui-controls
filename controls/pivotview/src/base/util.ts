import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings, ICalculatedFieldSettings } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings, ICustomGroups, FieldItemInfo } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView, PivotViewModel } from '../pivotview';
import { PivotFieldList, PivotFieldListModel } from '../pivotfieldlist';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SummaryTypes } from './types';
import { IOlapField } from './olap/engine';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */

export class PivotUtil {
    public static getType(value: Date): string {
        let val: string;
        val = (value && value.getDay) ? (value.getHours() > 0 || value.getMinutes() > 0 ||
            value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
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
            groupSettings: this.cloneGroupSettings(dataSourceSettings.groupSettings)
            /* tslint:disable:no-any */
        } as { [key: string]: any });
        /* tslint:enable:no-any */
        return clonesDataSource;
    }

    public static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void {
        if (control) {
            this.setPivotProperties(control, {
                dataSourceSettings: this.getDefinedObj({
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
                    groupSettings: dataSourceSettings.groupSettings
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
                        let oldAxis: string[] = Object.keys((oldProp.dataSourceSettings as any)[newAxesProp[i]]);
                        let newAxis: string[] = Object.keys((newProp.dataSourceSettings as any)[newAxesProp[i]]);
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
}