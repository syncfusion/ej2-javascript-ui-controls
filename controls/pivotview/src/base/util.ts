import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings, ICalculatedFieldSettings } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings, ICustomGroups } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView } from '../pivotview';
import { PivotFieldList } from '../pivotfieldlist';
import { DataManager, Query } from '@syncfusion/ej2-data';

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
                /* tslint:disable */
                let framedSet: any = {};
                /* tslint:enable */
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
                        clonedSets[i][j] = this.getClonedObj(pivotValues[i][j] as { [key: string]: Object });
                    }
                }
            }
        }
        return clonedSets;
    }
    private static getClonedObj(data: { [key: string]: Object }): { [key: string]: Object } {
        let keyPos: number = 0;
        /* tslint:disable */
        let framedSet: any = {};
        /* tslint:enable */
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

    /* tslint:disable */
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
    /* tslint:enable */

    public static getClonedDataSourceSettings(dataSourceSettings: IDataOptions): IDataOptions {
        let clonesDataSource: IDataOptions = {
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
        };
        return clonesDataSource;
    }

    public static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void {
        if (control) {
            /* tslint:disable */
            this.setPivotProperties(control, {
                dataSourceSettings: {
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
                }
            });
        }
    }

    private static cloneFieldSettings(collection: IFieldOptions[]): IFieldOptions[] {
        if (collection) {
            let clonedCollection: IFieldOptions[] = [];
            for (let set of collection) {
                clonedCollection.push({
                    name: set.name,
                    caption: set.caption,
                    axis: set.axis,
                    baseField: set.baseField,
                    baseItem: set.baseItem,
                    isCalculatedField: set.isCalculatedField,
                    isNamedSet: set.isNamedSet,
                    showNoDataItems: set.showNoDataItems,
                    showSubTotals: set.showSubTotals,
                    type: set.type
                });
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneFilterSettings(collection: IFilter[]): IFilter[] {
        if (collection) {
            let clonedCollection: IFilter[] = [];
            for (let set of collection) {
                clonedCollection.push({
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
                });
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
                clonedCollection.push({
                    name: set.name,
                    order: set.order
                });
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneDrillMemberSettings(collection: IDrillOptions[]): IDrillOptions[] {
        if (collection) {
            let clonedCollection: IDrillOptions[] = [];
            for (let set of collection) {
                clonedCollection.push({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? [...set.items] : set.items
                });
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
                clonedCollection.push({
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
                });
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
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    private static cloneCalculatedFieldSettings(collection: ICalculatedFieldSettings[]): ICalculatedFieldSettings[] {
        if (collection) {
            let clonedCollection: ICalculatedFieldSettings[] = [];
            for (let set of collection) {
                clonedCollection.push({
                    name: set.name,
                    formatString: set.formatString,
                    formula: set.formula,
                    hierarchyUniqueName: set.hierarchyUniqueName
                });
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
                clonedCollection.push({
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

                });
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
                clonedCollection.push({
                    name: set.name,
                    caption: set.caption,
                    customGroups: this.cloneCustomGroups(set.customGroups),
                    endingAt: set.endingAt,
                    startingAt: set.startingAt,
                    groupInterval: set.groupInterval,
                    rangeInterval: set.rangeInterval,
                    type: set.type
                });
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
                clonedCollection.push({
                    groupName: set.groupName,
                    items: set.items ? [...set.items] : set.items
                });
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
}