import { IDataOptions, IFieldOptions, IFilter, ISort, IFormatSettings, IFieldListOptions, IMembers, PivotEngine, IDataSet, INumberIndex } from './engine';
import { IDrillOptions, IValueSortSettings, IGroupSettings, IConditionalFormatSettings, ICustomGroups, FieldItemInfo } from './engine';
import { ICalculatedFieldSettings, IAuthenticationInfo, IGridValues, IAxisSet } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PivotView, PivotViewModel } from '../pivotview';
import { PivotFieldList, PivotFieldListModel } from '../pivotfieldlist';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SummaryTypes } from './types';
import { IOlapCustomProperties, IOlapField, IOlapFieldListOptions } from './olap/engine';
import { HeadersSortEventArgs } from '../common/base/interface';
import { PdfPageSize } from '@syncfusion/ej2-grids';
import { SizeF } from '@syncfusion/ej2-pdf-export';
import { PivotChart } from '../pivotchart/base/pivotchart';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 *
 * @hidden
 */

export class PivotUtil {
    public static getType(value: string | number | Date): string {
        let val: string;
        const dateValue: Date = new Date(value as string | number);
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
            for (const item of data as { [key: string]: Object }[]) {
                const fields: string[] = Object.keys(item);
                let keyPos: number = 0;
                const framedSet: { [key: string]: Object } = {};
                while (keyPos < fields.length) {
                    framedSet[fields[keyPos as number]] = item[fields[keyPos as number]];
                    keyPos++;
                }
                clonedData.push(framedSet);
            }
        }
        return clonedData;
    }

    public static getClonedCSVData(data: string[][]): string[][] {
        const clonedData: string[][] = data.map((row: string[]) => [...row]);
        return clonedData;
    }

    private static getDefinedObj(
        data: { [key: string]: string } | IDataOptions | IFieldOptions | IOlapField | IFilter | ISort | ICustomGroups
        | IGroupSettings | IConditionalFormatSettings
    ): { [key: string]: string } {
        let keyPos: number = 0;
        let framedSet: { [key: string]: string } = {};
        if (!(data === null || data === undefined)) {
            const fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                if (!((data as { [key: string]: string })[fields[keyPos as number]] === null
                    || (data as { [key: string]: string })[fields[keyPos as number]] === undefined)) {
                    framedSet[fields[keyPos as number]] = (data as { [key: string]: string })[fields[keyPos as number]];
                }
                keyPos++;
            }
        } else {
            framedSet = data as { [key: string]: string };
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

    public static setPivotProperties(control: PivotView | PivotFieldList, properties: { [key: string]: Object }): void {
        control.allowServerDataBinding = false;
        if ((control as PivotFieldList).pivotGridModule) {
            (control as PivotFieldList).pivotGridModule.allowServerDataBinding = false;
        }
        control.setProperties(properties, true);
        control.allowServerDataBinding = true;
        if ((control as PivotFieldList).pivotGridModule) {
            (control as PivotFieldList).pivotGridModule.allowServerDataBinding = true;
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
            valueIndex: dataSourceSettings.valueIndex,
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
        } as IDataOptions);
        return clonesDataSource;
    }

    public static getClonedFieldList(fieldListObj: IFieldListOptions | IOlapFieldListOptions): IFieldListOptions | IOlapFieldListOptions {
        const keys: string[] = Object.keys(fieldListObj);
        const clonedfieldlistObj: IOlapFieldListOptions = {};
        for (let i: number = 0, keysLength: number = keys.length; i < keysLength; i++) {
            const fieldlistObj: IOlapField = fieldListObj[keys[i as number]];
            if (fieldListObj[keys[i as number]]) {
                clonedfieldlistObj[keys[i as number]] = {
                    type: fieldlistObj.type,
                    caption: fieldlistObj.caption,
                    id: fieldlistObj.id,
                    isSelected: fieldlistObj.isSelected,
                    sort: fieldlistObj.sort,
                    filterType: fieldlistObj.filterType,
                    index: fieldlistObj.index,
                    filter: fieldlistObj.filter,
                    isCustomField: fieldlistObj.isCustomField,
                    showRemoveIcon: fieldlistObj.showRemoveIcon,
                    showFilterIcon: fieldlistObj.showFilterIcon,
                    showSortIcon: fieldlistObj.showSortIcon,
                    showNoDataItems: fieldlistObj.showNoDataItems,
                    isCalculatedField: fieldlistObj.isCalculatedField,
                    showEditIcon: fieldlistObj.showEditIcon,
                    showValueTypeIcon: fieldlistObj.showValueTypeIcon,
                    allowDragAndDrop: fieldlistObj.allowDragAndDrop,
                    showSubTotals: fieldlistObj.showSubTotals,
                    expandAll: fieldlistObj.expandAll,
                    pid: fieldlistObj.pid,
                    aggregateType: fieldlistObj.aggregateType,
                    baseField: fieldlistObj.baseField,
                    baseItem: fieldlistObj.baseItem,
                    dateMember: this.cloneDateMembers(fieldlistObj.dateMember),
                    members: this.cloneFormatMembers(fieldlistObj.members),
                    formatString: fieldlistObj.formatString,
                    format: fieldlistObj.format,
                    formula: fieldlistObj.formula,
                    isExcelFilter: fieldlistObj.isExcelFilter,
                    membersOrder: (fieldlistObj.membersOrder ? [...fieldlistObj.membersOrder] :
                        fieldlistObj.membersOrder) as string[] | number[],
                    isAlphanumeric: fieldlistObj.isAlphanumeric,
                    tag: fieldlistObj.tag,
                    expanded: fieldlistObj.expanded,
                    spriteCssClass: fieldlistObj.spriteCssClass,
                    name: fieldlistObj.name,
                    defaultHierarchy: fieldlistObj.defaultHierarchy,
                    hasAllMember: fieldlistObj.hasAllMember,
                    allMember: fieldlistObj.allMember,
                    isChecked: fieldlistObj.isChecked,
                    filterMembers: this.cloneFieldMembers(fieldlistObj.filterMembers),
                    childMembers: this.cloneFieldMembers(fieldlistObj.childMembers),
                    searchMembers: this.cloneFieldMembers(fieldlistObj.searchMembers),
                    htmlAttributes: this.getDefinedObj(fieldlistObj.htmlAttributes),
                    currrentMembers: this.cloneFormatMembers(fieldlistObj.currrentMembers),
                    isHierarchy: fieldlistObj.isHierarchy,
                    isNamedSets: fieldlistObj.isNamedSets,
                    actualFilter: fieldlistObj.actualFilter ? [...fieldlistObj.actualFilter] : fieldlistObj.actualFilter,
                    levels: this.cloneFieldMembers(fieldlistObj.levels),
                    levelCount: fieldlistObj.levelCount,
                    fieldType: fieldlistObj.fieldType,
                    memberType: fieldlistObj.memberType,
                    parentHierarchy: fieldlistObj.parentHierarchy
                };
            }
        }
        return clonedfieldlistObj;
    }

    public static cloneDateMembers(collection: IAxisSet[]): IAxisSet[] {
        if (collection) {
            const clonedCollection: IAxisSet[] = [];
            for (const set of collection) {
                clonedCollection.push({
                    formattedText: set.formattedText,
                    actualText: set.actualText
                });
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    public static cloneFormatMembers(collection: IMembers): IMembers {
        if (collection) {
            const keys: string[] = Object.keys(collection);
            const clonedFormatMembers: { [key: string]: Object } = {};
            for (let i: number = 0, keysLength: number = keys.length; i < keysLength; i++) {
                const cloneFormatMembersObj: IMembers = collection[keys[i as number]] as IMembers;
                clonedFormatMembers[keys[i as number]] = {
                    index: cloneFormatMembersObj.index ? [...(cloneFormatMembersObj.index as number[])] : cloneFormatMembersObj.index,
                    isDrilled: cloneFormatMembersObj.isDrilled,
                    ordinal: cloneFormatMembersObj.ordinal
                };
            }
            return clonedFormatMembers;
        } else {
            return collection;
        }
    }

    public static cloneFieldMembers(collection: IOlapField[]): IOlapField[] {
        if (collection) {
            const clonedCollection: IOlapField[] = [];
            for (const set of collection) {
                clonedCollection.push({
                    caption: set.caption,
                    hasChildren: set.hasChildren,
                    id: set.id,
                    isSelected: set.isSelected,
                    name: set.name,
                    tag: set.tag,
                    htmlAttributes: this.getDefinedObj(set.htmlAttributes),
                    type: set.type,
                    spriteCssClass: set.spriteCssClass,
                    pid: set.pid,
                    isChecked: set.isChecked
                });
            }
            return clonedCollection;
        } else {
            return collection;
        }
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
                } as IDataOptions)
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
                } as IFieldOptions));
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
                    htmlAttributes: this.getDefinedObj(set.htmlAttributes),
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
                } as IOlapField));
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
                } as IFilter));
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
                } as ISort));
            }
            return clonedCollection;
        } else {
            return collection;
        }
    }

    /**
     * It format the headers of pivot table.
     *
     * @param {IAxisSet} headerCell - It contains the header cell.
     * @param {PivotEngine} engine - It contains the instance of pivot engine.
     * @returns {IAxisSet} - It returns the formatted header data as IAxisSet.
     * @hidden
     */
    public static getFormattedHeader(headerCell: IAxisSet, engine: PivotEngine): IAxisSet {
        const clonedHeader: IAxisSet = PivotUtil.frameHeaderWithKeys(headerCell);
        if (clonedHeader.valueSort && clonedHeader.valueSort['axis']) {
            const fieldName: string = clonedHeader.valueSort['axis'] as string;
            const isDateType: boolean = this.isDateField(fieldName as string, engine);
            clonedHeader.formattedText = isDateType || !engine.formatFields[fieldName as string] || headerCell.isSum === true ?
                clonedHeader.formattedText : engine.getFormattedValue(clonedHeader.actualText, fieldName as string).formattedText;
        }
        return clonedHeader;
    }

    /**
     * It format the members of field.
     *
     * @param {IMembers} members - It contains the members.
     * @param {string} fieldName - It contains the field Name.
     * @param {PivotEngine} engine - It contains the instance of pivot engine.
     * @returns {IMembers} - It returns the formatted members as IMembers.
     * @hidden
     */
    public static getFormattedMembers(members: IMembers, fieldName: string, engine: PivotEngine): IMembers {
        const isDateField: boolean = this.isDateField(fieldName as string, engine);
        if (isDateField || engine.groupingFields[fieldName as string]) {
            const fieldMembers: IMembers = {};
            const keys: string[] = Object.keys(members);
            const dateMember: IAxisSet[] = engine.fieldList[fieldName as string].dateMember;
            for (let i: number = 0, j: number = keys.length; i < j; i++) {
                const values: {
                    ordinal?: number;
                    index?: number[];
                    name?: string;
                    isDrilled?: boolean;
                    isNodeExpand?: boolean;
                    parent?: string;
                    caption?: string;
                    isSelected?: boolean;
                } = members[keys[i as number]];
                if (isDateField) {
                    fieldMembers[values.caption as string] = values;
                } else {
                    const commonValue: string | number = dateMember[values.ordinal - 1].actualText;
                    fieldMembers[commonValue as string | number] = values;
                }
            }
            return fieldMembers;
        }
        return members;
    }

    /**
     * It determines whether the specified field is of date type.
     *
     * @param {string} fieldName - It contains the field Name.
     * @param {PivotEngine} engineModule - It contains the instance of pivot engine.
     * @returns {boolean} - It  returns whether the field is of date type or not.
     * @hidden
     */
    public static isDateField(fieldName: string, engineModule: PivotEngine): boolean {
        return (engineModule.formatFields[fieldName as string] &&
            (['date', 'dateTime', 'time'].indexOf(engineModule.formatFields[fieldName as string].type) > -1));
    }

    /**
     * It format the headers of pivot chart.
     *
     * @param {string[]} values - It contains the headers.
     * @param {PivotChart} chartModule - It contains the instance of pivot chart.
     * @param {boolean} isColumnHeader - It determines whether the specified header is column or row.
     * @returns {string} - It returns the formatted header.
     * @hidden
     */
    public static formatChartHeaders(values: string[], chartModule: PivotChart, isColumnHeader: boolean): string {
        const formattedValues: string[] = [];
        for (let i: number = 0, j: number = values.length; i < j; i++) {
            const fieldName: string = isColumnHeader ? ((chartModule.parent.dataSourceSettings.columns.length > 0 &&
                !isNullOrUndefined(chartModule.parent.dataSourceSettings.columns[i as number])) ?
                chartModule.parent.dataSourceSettings.columns[i as number].name as string : undefined) :
                (chartModule.parent.dataSourceSettings.rows.length > 0 &&
                    !isNullOrUndefined(chartModule.parent.dataSourceSettings.rows[i as number])) ?
                    chartModule.parent.dataSourceSettings.rows[i as number].name as string : undefined;
            if (!isNullOrUndefined(fieldName)) {
                if ((chartModule.engineModule.formatFields[fieldName as string] &&
                    (['date', 'dateTime', 'time'].indexOf(chartModule.engineModule.formatFields[fieldName as string].type) > -1))) {
                    formattedValues.push(values[i as number] as string);
                } else {
                    formattedValues.push((chartModule.engineModule as PivotEngine).getFormattedValue(
                        values[i as number] as string, fieldName as string).formattedText
                    );
                }
            } else {
                formattedValues.push(values[i as number] as string);
            }
        }
        return formattedValues.join(' - ');
    }

    public static cloneDrillMemberSettings(collection: IDrillOptions[]): IDrillOptions[] {
        if (collection) {
            const clonedCollection: IDrillOptions[] = [];
            for (const set of collection) {
                clonedCollection.push(this.getDefinedObj({
                    name: set.name,
                    delimiter: set.delimiter,
                    items: set.items ? [...set.items] : set.items
                } as IDrillOptions));
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
                } as IFormatSettings));
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
                } as ICalculatedFieldSettings));
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
                } as IConditionalFormatSettings));
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
                } as IGroupSettings));

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
                } as ICustomGroups));
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

    public static getFieldByName(fieldName: string, fields: IFieldOptions[] | ISort[] | IFormatSettings[] | IDrillOptions[] |
    IGroupSettings[] | ICalculatedFieldSettings[]): IFieldOptions | ISort | IFormatSettings | IDrillOptions | IGroupSettings |
        ICalculatedFieldSettings {
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

    public static isButtonIconRefesh(
        prop: string, oldProp: PivotViewModel | PivotFieldListModel, newProp: PivotViewModel | PivotFieldListModel
    ): boolean {
        let isButtonRefresh: boolean = false;
        try {
            if (prop === 'dataSourceSettings' && oldProp.dataSourceSettings && newProp.dataSourceSettings) {
                const propValidation: string[] = ['notAvail', 'notAvail', 'notAvail', 'notAvail'];
                const oldAxesProp: string[] = Object.keys(oldProp.dataSourceSettings);
                const newAxesProp: string[] = Object.keys(newProp.dataSourceSettings);
                if (oldAxesProp && newAxesProp && newAxesProp.length > 0 && oldAxesProp.length === newAxesProp.length) {
                    const axes: string[] = ['rows', 'columns', 'values', 'filters'];
                    for (let i: number = 0; i < newAxesProp.length; i++) {
                        const oldAxis: string[] = (newAxesProp[i as number] in oldProp.dataSourceSettings &&
                            !isNullOrUndefined((oldProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]])) ?
                            Object.keys((oldProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]]) : [];
                        const newAxis: string[] = (newAxesProp[i as number] in newProp.dataSourceSettings &&
                            !isNullOrUndefined((newProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]])) ?
                            Object.keys((newProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]]) : [];
                        if (axes.indexOf(newAxesProp[i as number]) !== -1 && axes.indexOf(oldAxesProp[i as number]) !== -1 &&
                            oldAxis && newAxis && newAxis.length > 0 && oldAxis.length === newAxis.length) {
                            const options: string[] = ['showFilterIcon', 'showSortIcon', 'showRemoveIcon', 'showValueTypeIcon', 'showEditIcon', 'allowDragAndDrop', 'expandAll'];
                            for (let j: number = 0; j < newAxis.length; j++) {
                                const oldAxisProp: string[] =
                                    Object.keys(((oldProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]] as {
                                        [key: string]: Object
                                    })[newAxis[j as number]]);
                                const newAxisProp: string[] =
                                    Object.keys(((newProp.dataSourceSettings as { [key: string]: Object })[newAxesProp[i as number]] as {
                                        [key: string]: Object
                                    })[newAxis[j as number]]);
                                for (let k: number = 0; k < newAxisProp.length; k++) {
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

    public static formatPivotValues(pivotValues: { [key: string]: Object }[][]): IAxisSet[][] {
        const values: IAxisSet[][] = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i as number]) {
                values[i as number] = [];
                for (let j: number = 0; j < pivotValues[i as number].length; j++) {
                    if (pivotValues[i as number][j as number]) {
                        values[i as number][j as number] = {
                            axis: pivotValues[i as number][j as number].Axis as string,
                            actualText: pivotValues[i as number][j as number].ActualText as string,
                            indexObject: pivotValues[i as number][j as number].IndexObject as INumberIndex,
                            index: pivotValues[i as number][j as number].Index as number[],
                            rowHeaders: pivotValues[i as number][j as number].RowHeaders as string,
                            columnHeaders: pivotValues[i as number][j as number].ColumnHeaders as string,
                            formattedText: pivotValues[i as number][j as number].FormattedText as string,
                            actualValue: pivotValues[i as number][j as number].ActualValue as number,
                            rowIndex: pivotValues[i as number][j as number].RowIndex as number,
                            colIndex: pivotValues[i as number][j as number].ColIndex as number,
                            colSpan: pivotValues[i as number][j as number].ColSpan as number,
                            level: pivotValues[i as number][j as number].Level as number,
                            rowSpan: pivotValues[i as number][j as number].RowSpan as number,
                            isSum: pivotValues[i as number][j as number].IsSum as boolean,
                            isGrandSum: pivotValues[i as number][j as number].IsGrandSum as boolean,
                            valueSort: pivotValues[i as number][j as number].ValueSort as IDataSet,
                            ordinal: pivotValues[i as number][j as number].Ordinal as number,
                            hasChild: pivotValues[i as number][j as number].HasChild as boolean,
                            isDrilled: pivotValues[i as number][j as number].IsDrilled as boolean,
                            value: pivotValues[i as number][j as number].Value as number,
                            type: pivotValues[i as number][j as number].Type as SummaryTypes,
                            members: pivotValues[i as number][j as number].Members as IAxisSet[]
                        };
                    }
                }
            }
        }
        return values;
    }

    public static formatFieldList(fieldList: { [key: string]: { [key: string]: Object } }): { [key: string]: Object } {
        const keys: string[] = Object.keys(fieldList);
        const fList: { [key: string]: Object } = {};
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

    public static frameContent(
        pivotValues: IAxisSet[][], type: string, rowPosition: number, control: PivotView | PivotFieldList
    ): IGridValues {
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
        const locale: { [key: string]: Object } = {};
        locale['Null'] = control.localeObj.getConstant('null');
        locale['Years'] = control.localeObj.getConstant('Years');
        locale['Quarters'] = control.localeObj.getConstant('Quarters');
        locale['Months'] = control.localeObj.getConstant('Months');
        locale['Days'] = control.localeObj.getConstant('Days');
        locale['Hours'] = control.localeObj.getConstant('Hours');
        locale['Minutes'] = control.localeObj.getConstant('Minutes');
        locale['Seconds'] = control.localeObj.getConstant('Seconds');
        locale['QuarterYear'] = control.localeObj.getConstant('QuarterYear');
        locale['Of'] = control.localeObj.getConstant('of');
        locale['Qtr'] = control.localeObj.getConstant('qtr');
        locale['Undefined'] = control.localeObj.getConstant('undefined');
        locale['GroupOutOfRange'] = control.localeObj.getConstant('groupOutOfRange');
        locale['Group'] = control.localeObj.getConstant('group');
        return locale;
    }

    public static updateReport(control: PivotView | PivotFieldList, report: {
        Rows: { [key: string]: Object}[],
        Columns: { [key: string]: Object}[],
        FormatSettings: { [key: string]: Object}[]
    }): void {
        control.setProperties({ dataSourceSettings: { rows: [] } }, true);
        control.setProperties({ dataSourceSettings: { columns: [] } }, true);
        control.setProperties({ dataSourceSettings: { formatSettings: [] } }, true);
        for (let i: number = 0; i < report.Rows.length; i++) {
            control.dataSourceSettings.rows.push({
                name: report.Rows[i as number].Name as string,
                caption: report.Rows[i as number].Caption as string,
                showNoDataItems: report.Rows[i as number].ShowNoDataItems as boolean,
                baseField: report.Rows[i as number].BaseField as string,
                baseItem: report.Rows[i as number].BaseItem as string,
                showFilterIcon: report.Rows[i as number].ShowFilterIcon as boolean,
                showSortIcon: report.Rows[i as number].ShowSortIcon as boolean,
                showEditIcon: report.Rows[i as number].ShowEditIcon as boolean,
                showRemoveIcon: report.Rows[i as number].ShowRemoveIcon as boolean,
                showSubTotals: report.Rows[i as number].ShowValueTypeIcon as boolean,
                allowDragAndDrop: report.Rows[i as number].AllowDragAndDrop as boolean,
                axis: report.Rows[i as number].Axis as string,
                dataType: report.Rows[i as number].DataType as string,
                isCalculatedField: report.Rows[i as number].IsCalculatedField as boolean,
                showValueTypeIcon: report.Rows[i as number].ShowValueTypeIcon as boolean,
                type: report.Rows[i as number].Type as SummaryTypes,
                expandAll: report.Rows[i as number].expandAll as boolean
            });
        }
        for (let i: number = 0; i < report.Columns.length; i++) {
            control.dataSourceSettings.columns.push({
                name: report.Columns[i as number].Name as string,
                caption: report.Columns[i as number].Caption as string,
                showNoDataItems: report.Columns[i as number].ShowNoDataItems as boolean,
                baseField: report.Columns[i as number].BaseField as string,
                baseItem: report.Columns[i as number].BaseItem as string,
                showFilterIcon: report.Columns[i as number].ShowFilterIcon as boolean,
                showSortIcon: report.Columns[i as number].ShowSortIcon as boolean,
                showEditIcon: report.Columns[i as number].ShowEditIcon as boolean,
                showRemoveIcon: report.Columns[i as number].ShowRemoveIcon as boolean,
                showSubTotals: report.Columns[i as number].ShowValueTypeIcon as boolean,
                allowDragAndDrop: report.Columns[i as number].AllowDragAndDrop as boolean,
                axis: report.Columns[i as number].Axis as string,
                dataType: report.Columns[i as number].DataType as string,
                isCalculatedField: report.Columns[i as number].IsCalculatedField as boolean,
                showValueTypeIcon: report.Columns[i as number].ShowValueTypeIcon as boolean,
                type: report.Columns[i as number].Type as SummaryTypes,
                expandAll: report.Columns[i as number].expandAll as boolean
            });
        }
        for (let i: number = 0; i < report.FormatSettings.length; i++) {
            control.dataSourceSettings.formatSettings.push({
                name: report.FormatSettings[i as number].Name as string,
                format: report.FormatSettings[i as number].Format as string,
                type: report.FormatSettings[i as number].Type as string,
                currency: report.FormatSettings[i as number].Currency as string,
                maximumFractionDigits: report.FormatSettings[i as number].MaximumFractionDigits as number,
                maximumSignificantDigits: report.FormatSettings[i as number].MaximumSignificantDigits as number,
                minimumFractionDigits: report.FormatSettings[i as number].MinimumFractionDigits as number,
                minimumIntegerDigits: report.FormatSettings[i as number].MinimumIntegerDigits as number,
                minimumSignificantDigits: report.FormatSettings[i as number].MinimumSignificantDigits as number,
                skeleton: report.FormatSettings[i as number].Skeleton as string,
                useGrouping: report.FormatSettings[i as number].UseGrouping as boolean
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
    public static applyCustomSort(
        sortDetails: HeadersSortEventArgs, sortMembersOrder: IAxisSet[], type: string | boolean,
        hasMembersOrder?: boolean, isOlap?: boolean
    ): IAxisSet[] {
        let grandTotal: IAxisSet;
        let order: (string | number)[] = [];
        if (sortDetails.IsOrderChanged) {
            order = sortDetails.members;
        }
        else {
            order = (sortDetails.sortOrder === 'Ascending' || sortDetails.sortOrder === 'None' || sortDetails.sortOrder === undefined) ? [].concat(sortDetails.members) : [].concat(sortDetails.members).reverse();
        }
        if (order.length > sortMembersOrder.length) {
            order = order.filter((item: string | number) =>
                sortMembersOrder.some((member: { formattedText: string, actualText: string, dateText: string }) => {
                    const sortText: string | number = isOlap
                        ? member.formattedText
                        : type === 'string' || type === 'number'
                            ? member.actualText
                            : member.dateText;
                    return (typeof item === typeof sortText) && (sortText === item);
                })
            );
        }
        const updatedMembers: string[] | number[] = [];
        const isNormalType: boolean = type === undefined || type === 'string' || type === 'number';
        if (sortMembersOrder.length > 0 && sortMembersOrder[0].actualText === 'Grand Total') {
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
     * @param {boolean} isNumberGroupSorting - it defines the sorting is numer grouping or not.
     * @returns {IAxisSet[]} - It returns the sorted data as IAxisSet[].
     * @hidden
     */
    public static applyHeadersSort(
        sortMembersOrder: IAxisSet[], sortOrder: string, type: string | boolean, isNumberGroupSorting?: boolean
    ): IAxisSet[] {
        if (isNumberGroupSorting) {
            sortMembersOrder = sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => {
                const aText: string = a.actualText as string;
                const bText: string = b.actualText as string;
                return (aText === 'Grand Total' || bText === 'Grand Total') ? 0 : (aText === 'Out of Range') ? 1 :
                    (bText === 'Out of Range') ? -1 : !isNaN(parseFloat(aText)) && !isNaN(parseFloat(bText)) ?
                        sortOrder === 'Ascending' ? parseFloat(aText) - parseFloat(bText) : parseFloat(bText) - parseFloat(aText) :
                        sortOrder === 'Ascending' ? aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' }) :
                            bText.localeCompare(aText, undefined, { numeric: true, sensitivity: 'base' });
            });
        } else if (type === 'datetime' || type === 'date' || type === 'time') {
            sortMembersOrder = sortOrder === 'Ascending'
                ? sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => {
                    if (a.dateText === 'Out of Range') { return 1; }
                    if (b.dateText === 'Out of Range') { return -1; }
                    return a.dateText > b.dateText ? 1 : a.dateText < b.dateText ? -1 : 0;
                })
                : sortOrder === 'Descending'
                    ? sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => {
                        if (a.dateText === 'Out of Range') { return 1; }
                        if (b.dateText === 'Out of Range') { return -1; }
                        return a.dateText < b.dateText ? 1 : a.dateText > b.dateText ? -1 : 0;
                    })
                    : sortMembersOrder;
        } else if (type === true) {
            sortMembersOrder = sortOrder === 'Ascending' ?
                (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : (a.actualText === 'Out of Range') ? 1 : (b.actualText === 'Out of Range') ? -1 : (Number(a.actualText.toString().match(/\d+/)) > Number(b.actualText.toString().match(/\d+/))) ? 1 : ((Number(b.actualText.toString().match(/\d+/)) > Number(a.actualText.toString().match(/\d+/))) ? -1 : 0))) :
                sortOrder === 'Descending' ?
                    (sortMembersOrder.sort((a: IAxisSet, b: IAxisSet): number => (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : (a.actualText === 'Out of Range') ? -1 : (b.actualText === 'Out of Range') ? 1 : (Number(a.actualText.toString().match(/\d+/)) < Number(b.actualText.toString().match(/\d+/))) ? 1 : ((Number(b.actualText.toString().match(/\d+/)) < Number(a.actualText.toString().match(/\d+/))) ? -1 : 0))) :
                    sortMembersOrder;
        } else {
            sortMembersOrder = sortOrder === 'Ascending' ?
                (sortMembersOrder.sort(function (a: IAxisSet, b: IAxisSet): number { return (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : ((a.actualText > b.actualText) ? 1 : ((b.actualText > a.actualText) ? -1 : 0)); })) :
                sortOrder === 'Descending' ?
                    (sortMembersOrder.sort(function (a: IAxisSet, b: IAxisSet): number { return (a.actualText === 'Grand Total' || b.actualText === 'Grand Total') ? 0 : ((a.actualText < b.actualText) ? 1 : ((b.actualText < a.actualText) ? -1 : 0)); })) :
                    sortMembersOrder;
        }
        return sortMembersOrder;
    }

    /**
     * It performs to render the olap engine.
     *
     * @param {PivotView | PivotFieldList} pivot - It specifies the pivotview and pivot field list component instance.
     * @param {IOlapCustomProperties} customProperties - It contains the internal properties that used for engine population.
     * @returns {void}
     * @hidden
     */
    public static renderOlapEngine(pivot: PivotView | PivotFieldList, customProperties?: IOlapCustomProperties): void {
        try {
            pivot.olapEngineModule.renderEngine(
                pivot.dataSourceSettings as IDataOptions, customProperties ? customProperties :
                    (pivot as PivotFieldList).frameCustomProperties(pivot.olapEngineModule.fieldListData, pivot.olapEngineModule.fieldList),
                pivot.onHeadersSort ? (pivot as PivotView).getHeaderSortInfo.bind(pivot) : undefined
            );
            pivot.setProperties({ dataSourceSettings: { valueIndex: pivot.olapEngineModule.measureIndex } }, true);
        } catch (exception) {
            pivot.actionObj.actionName = 'engineFormation';
            if (pivot.olapEngineModule.errorInfo) {
                pivot.actionFailureMethod(pivot.olapEngineModule.errorInfo as Error);
                pivot.olapEngineModule.errorInfo = undefined;
            } else {
                pivot.actionFailureMethod(exception);
            }
        }
    }

    /**
     *
     * @param {IDataSet | IAxisSet} header - It contains the value of header
     * @returns {IAxisSet} - It frame Header With Keys
     * @hidden */
    public static frameHeaderWithKeys(header: IDataSet | IAxisSet): IAxisSet | IDataSet {
        const keys: string[] = Object.keys(header);
        let keyPos: number = 0;
        const framedHeader: IDataSet = {};
        while (keyPos < keys.length) {
            framedHeader[keys[keyPos as number]] = (header as IDataSet)[keys[keyPos as number]];
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

    /**
     *
     * @param {any} aggreColl - It contains the selected header and its value cell collection, that should be sorted for value sorting.
     * @param {string} sortOrder - It denotes the sorting order.
     * @returns {IAxisSet[]} - It returns the sorted collection in the provided sort order.
     * @hidden */
    public static getSortedValue(aggreColl: { 'header': IAxisSet; 'value'?: number }[], sortOrder: string): IAxisSet[] {
        aggreColl.sort((a: { value?: number, header: { type: string } }, b: { value?: number, header: { type: string } }) => {
            return sortOrder === 'Descending' ? (
                (b['value'] || b['header']['type'] === 'grand sum' ? b['value'] : 0) -
                (a['value'] || a['header']['type'] === 'grand sum' ? a['value'] : 0)
            ) : (
                (a['value'] || a['header']['type'] === 'grand sum' ? a['value'] : 0) -
                (b['value'] || b['header']['type'] === 'grand sum' ? b['value'] : 0)
            );
        });
        return aggreColl.map((item: { 'header': IAxisSet; 'value'?: number }) => {
            return item['header'];
        });
    }
}
