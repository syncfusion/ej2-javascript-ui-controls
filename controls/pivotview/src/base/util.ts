import { IPivotValues, IDataOptions, IFieldOptions, IFilter, ISort } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings } from './engine';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView } from '../pivotview';
import { PivotFieldList } from '../pivotfieldlist';

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
            clonedSets[i] = [];
            for (let j: number = 0; j < pivotValues[i].length; j++) {
                if (pivotValues[i][j]) {
                    clonedSets[i][j] = this.getClonedObj(pivotValues[i][j] as { [key: string]: Object });
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
        for (let i: number = 0, cnt: number = collection.length; i < cnt; i++) {
            if (collection[i] === value) {
                return i;
            }
        }
        return -1;
    }

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
            enableSorting: dataSourceSettings.enableSorting ? true : false,
            rows: extend([], dataSourceSettings.rows, null, true) as IFieldOptions[],
            columns: extend([], dataSourceSettings.columns, null, true) as IFieldOptions[],
            filters: extend([], dataSourceSettings.filters, null, true) as IFieldOptions[],
            values: extend([], dataSourceSettings.values, null, true) as IFieldOptions[],
            filterSettings: extend([], dataSourceSettings.filterSettings, null, true) as IFilter[],
            sortSettings: extend([], dataSourceSettings.sortSettings, null, true) as ISort[],
            drilledMembers: extend([], dataSourceSettings.drilledMembers, null, true) as IDrillOptions[],
            valueSortSettings: extend({}, dataSourceSettings.valueSortSettings, null, true) as IValueSortSettings,
            valueAxis: dataSourceSettings.valueAxis,
            formatSettings: extend([], dataSourceSettings.formatSettings, null, true) as IDrillOptions[],
            calculatedFieldSettings: extend([], dataSourceSettings.calculatedFieldSettings, null, true) as IDrillOptions[],
            showSubTotals: dataSourceSettings.showSubTotals,
            showRowSubTotals: dataSourceSettings.showRowSubTotals,
            showColumnSubTotals: dataSourceSettings.showColumnSubTotals,
            showGrandTotals: dataSourceSettings.showGrandTotals,
            showRowGrandTotals: dataSourceSettings.showRowGrandTotals,
            showColumnGrandTotals: dataSourceSettings.showColumnGrandTotals,
            showHeaderWhenEmpty: dataSourceSettings.showHeaderWhenEmpty,
            alwaysShowValueHeader: dataSourceSettings.alwaysShowValueHeader,
            conditionalFormatSettings: extend([], dataSourceSettings.conditionalFormatSettings, null, true) as IConditionalFormatSettings[],
            emptyCellsTextContent: dataSourceSettings.emptyCellsTextContent,
            groupSettings: extend([], dataSourceSettings.groupSettings, null, true) as IGroupSettings[]
        };
        return clonesDataSource;
    }

    public static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void {
        if (control) {
            /* tslint:disable */
            control.setProperties({
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
            }, true);
        }
    }
}