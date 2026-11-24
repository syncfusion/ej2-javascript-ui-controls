import { ColumnModel, PageSettingsModel, SelectionSettingsModel, AggregateRowModel, AggregateColumnModel, CustomSummaryType,
    ColumnMenuItemModel, ColumnChooserSettingsModel, PredicateModel, SortDescriptorModel } from '@syncfusion/ej2-grids';
import { QueryBuilderModel } from '@syncfusion/ej2-querybuilder';
import { FlatSettingsModel } from '../../pivotview/model/flatsettings-model';
import { ChildProperty, getValue, setValue } from '@syncfusion/ej2-base';
import { RuleModel } from '@syncfusion/ej2-querybuilder';

/**
 * Resolves the shared view and column permission for a Flat UI action.
 *
 * @param {FlatSettingsModel} settings - Independent Flat settings.
 * @param {ColumnModel} column - Physical column descriptor.
 * @param {string} flag - Corresponding Grid permission property.
 * @returns {boolean} Whether both levels permit the action.
 * @hidden
 */
export function isFlatColumnActionEnabled(settings: FlatSettingsModel, column: ColumnModel, flag: string): boolean {
    return !!column && getValue(flag, settings) === true && getValue(flag, column) !== false;
}

/**
 * Resolves a Grid custom aggregate without invoking accessors or inherited bindings.
 *
 * @param {string | CustomSummaryType} binding - Grid customAggregate callback or host-window path.
 * @param {Window} ownerWindow - Window owning the PivotView element.
 * @returns {CustomSummaryType} Callable binding, or undefined when unavailable.
 * @hidden
 */
export function resolveFlatCustomAggregate(binding: string | CustomSummaryType, ownerWindow?: Window): CustomSummaryType {
    if (typeof binding === 'function') { return binding; }
    if (typeof binding !== 'string' || !binding) { return undefined; }
    let reference: object = ownerWindow;
    for (const part of binding.split('.')) {
        if (['__proto__', 'prototype', 'constructor'].indexOf(part) !== -1) { return undefined; }
        const descriptor: PropertyDescriptor = reference && Object.getOwnPropertyDescriptor(reference, part);
        reference = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;
    }
    return typeof reference === 'function' ? reference as CustomSummaryType : undefined;
}

/**
 * Validates the supported subset of reused Grid models.
 *
 * @param {FlatSettingsModel} settings - Candidate settings.
 * @returns {void}
 * @hidden
 */
export function validateFlatSettings(settings: FlatSettingsModel): void {
    const invalid: () => never = () => { throw new Error('Flat layout settings contain an invalid value.'); };
    (settings.toolbar || []).forEach((item: unknown) => {
        if (typeof item !== 'string' || ['Search', 'AdvancedFilter', 'ColumnChooser', 'ExcelExport', 'CsvExport',
            'PdfExport', 'Print'].indexOf(item) === -1) { invalid(); }
    });
    const chooser: ColumnChooserSettingsModel = settings.columnChooserSettings || {};
    if (Object.keys(chooser).some((key: string) =>
        ['operator', 'ignoreAccent', 'enableSearching', 'mode', 'immediateModeDelay'].indexOf(key) === -1) ||
        chooser.operator && ['startsWith', 'endsWith', 'contains'].indexOf(chooser.operator) === -1 ||
        chooser.mode && ['Default', 'Immediate'].indexOf(chooser.mode) === -1 ||
        chooser.immediateModeDelay !== undefined && (!Number.isInteger(chooser.immediateModeDelay) || chooser.immediateModeDelay < 0) ||
        settings.queryCellInfo !== undefined && typeof settings.queryCellInfo !== 'function' ||
        settings.headerCellInfo !== undefined && typeof settings.headerCellInfo !== 'function') { invalid(); }
    ['rowSelecting', 'rowSelected', 'rowDeselecting', 'rowDeselected',
        'cellSelecting', 'cellSelected', 'cellDeselecting', 'cellDeselected'].forEach((name: string) => {
        const callback: unknown = getValue(name, settings);
        if (callback !== undefined && typeof callback !== 'function') { invalid(); }
    });
    const columns: ColumnModel[] = settings.columns || [];
    const visible: ColumnModel[] = columns.filter((column: ColumnModel) => column.visible !== false);
    const pinCount: number = settings.frozenColumns || 0;
    if (!Number.isInteger(pinCount) || pinCount < 0 || pinCount > visible.length) { invalid(); }
    const columnKeys: string[] = ['field', 'headerText', 'type', 'width', 'visible', 'format', 'textAlign', 'autoFit',
        'allowSorting', 'allowFiltering', 'allowResizing', 'allowReordering', 'allowSearching', 'showColumnMenu', 'filter', 'freeze', 'isFrozen'];
    columns.forEach((column: ColumnModel) => {
        if (Object.keys(column).some((name: string) => columnKeys.indexOf(name) === -1) ||
            typeof column.field !== 'string' || column.headerText !== undefined && typeof column.headerText !== 'string') { invalid(); }
        if (column.width !== undefined && (!isFinite(Number(column.width)) || Number(column.width) <= 0)) { invalid(); }
        if (column.freeze && ['Left', 'Right', 'Fixed', 'None'].indexOf(column.freeze) === -1) { invalid(); }
        if (column.isFrozen && column.freeze && column.freeze !== 'Left' && column.freeze !== 'None') { invalid(); }
        if (pinCount && (column.isFrozen || column.freeze && column.freeze !== 'None')) { invalid(); }
        if (column.filter && (Object.keys(column.filter).some((key: string) => key !== 'type') ||
            column.filter.type && ['Menu', 'Excel'].indexOf(column.filter.type) === -1)) { invalid(); }
    });
    const page: PageSettingsModel = settings.pageSettings || {};
    ['pageSize', 'currentPage', 'pageCount'].forEach((key: string) => {
        const value: number = getValue(key, page);
        if (value !== undefined && (!Number.isInteger(value) || value < 1)) { invalid(); }
    });
    if (page.enableQueryString || Array.isArray(page.pageSizes) && page.pageSizes.some((value: string | number) =>
        typeof value !== 'number' || !Number.isInteger(value) || value < 1)) { invalid(); }
    if (settings.rowHeight !== undefined && (!isFinite(settings.rowHeight) || settings.rowHeight <= 0)) { invalid(); }
    const selection: SelectionSettingsModel = settings.selectionSettings || {};
    if (selection.persistSelection || selection.checkboxOnly || selection.mode && ['Row', 'Cell', 'Both'].indexOf(selection.mode) === -1 ||
        selection.type && ['Single', 'Multiple'].indexOf(selection.type) === -1 ||
        selection.cellSelectionMode && ['Flow', 'Box'].indexOf(selection.cellSelectionMode) === -1) { invalid(); }
    const builder: QueryBuilderModel = settings.advancedFilterSettings && settings.advancedFilterSettings.queryBuilderSettings;
    if (builder && Object.keys(builder).some((key: string) =>
        ['rule', 'width', 'height', 'displayMode', 'showButtons', 'enableNotCondition'].indexOf(key) === -1)) { invalid(); }
    const names: string[] = ['SortAscending', 'SortDescending', 'Filter', 'AutoFit', 'AutoFitAll', 'ColumnChooser',
        'FlatFreezeLeft', 'FlatFreezeRight', 'FlatFreezeFixed', 'FlatUnfreeze'];
    const menu: (string | ColumnMenuItemModel)[] = settings.columnMenuItems || [];
    menu.forEach((item: string | ColumnMenuItemModel) => {
        if (typeof item === 'string') { if (names.indexOf(item) === -1) { invalid(); } }
        else if (names.indexOf(item.id) === -1 || Object.keys(item).some((key: string) =>
            ['id', 'text', 'iconCss'].indexOf(key) === -1)) { invalid(); }
    });
    (settings.aggregates || []).forEach((row: AggregateRowModel) => {
        if (Object.keys(row).some((key: string) => key !== 'columns')) { invalid(); }
        (row.columns || []).forEach((column: AggregateColumnModel) => {
            if (Object.keys(column).some((key: string) =>
                ['field', 'type', 'format', 'customAggregate', 'columnName'].indexOf(key) === -1) ||
                column.columnName && column.columnName !== column.field) { invalid(); }
        });
    });
}

/**
 * Checks whether pinned fields leave the movable viewport reachable.
 *
 * @param {FlatSettingsModel} settings - Configured pinning and widths.
 * @param {number} width - Available viewport width.
 * @returns {boolean} Whether the configured panes fit.
 * @hidden
 */
export function flatPinsFit(settings: FlatSettingsModel, width: number): boolean {
    if (!width) { return true; }
    const columns: ColumnModel[] = (settings.columns || []).filter((column: ColumnModel) => column.visible !== false);
    let pinned: number = 0;
    let count: number = 0;
    columns.forEach((column: ColumnModel, index: number) => {
        if (index < (settings.frozenColumns || 0) || column.isFrozen || column.freeze && column.freeze !== 'None') {
            count++;
            pinned += Number(column.width || 200);
        }
    });
    return !count || pinned <= width - (count < columns.length ? 40 : 0);
}

/**
 * Clones settings, including decorated defaults, without losing runtime callbacks.
 *
 * @template T
 * @param {T} input - Settings to detach.
 * @param {boolean} publicSnapshot - Whether to omit callbacks.
 * @param {object[]} ancestors - Current traversal path.
 * @returns {T} Detached settings.
 * @hidden
 */
export function cloneFlat<T>(input: T, publicSnapshot: boolean = false, ancestors: object[] = []): T {
    if (typeof input === 'function') { return publicSnapshot ? undefined : input; }
    if (input instanceof Date) { return new Date(input.getTime()) as unknown as T; }
    if (!input || typeof input !== 'object') { return input; }
    const value: object = input instanceof ChildProperty ? getValue('properties', input) : input;
    if (ancestors.indexOf(value) !== -1) { throw new Error('Flat layout settings contain an invalid value.'); }
    if (input instanceof ChildProperty) {
        const names: string[] = ['propNames', 'complexPropNames', 'colPropNames'].reduce(
            (all: string[], group: string) => all.concat(getValue('propList.' + group, input) || []), []);
        names.forEach((name: string) => { getValue(name, input); });
    }
    if (Array.isArray(value)) {
        return value.map((item: unknown) => cloneFlat(item, publicSnapshot, ancestors.concat([value]))) as unknown as T;
    }
    const result: { [field: string]: unknown } = {};
    Object.keys(value).forEach((key: string) => {
        if (['__proto__', 'prototype', 'constructor'].indexOf(key) !== -1) {
            throw new Error('Flat layout settings contain an invalid value.');
        }
        const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
            throw new Error('Flat layout settings contain an invalid value.');
        }
        const child: unknown = cloneFlat(descriptor.value, publicSnapshot, ancestors.concat([value]));
        if (!publicSnapshot || child !== undefined) {
            Object.defineProperty(result, key, { value: child, writable: true, enumerable: true, configurable: true });
        }
    });
    return result as T;
}

/**
 * Serializes only Flat configuration, tagging Date filter operands explicitly.
 *
 * @param {FlatSettingsModel} settings - Runtime configuration.
 * @returns {FlatSettingsModel} Detached serializable configuration.
 * @hidden
 */
export function serializeFlatSettings(settings: FlatSettingsModel): FlatSettingsModel {
    const snapshot: FlatSettingsModel = cloneFlat(settings, true);
    flatOperands(snapshot, (value: unknown): unknown => value instanceof Date ? { flatDate: value.getTime() } : value);
    return snapshot;
}

/**
 * Restores configuration using trusted runtime bindings, without restoring executable payloads.
 *
 * @param {FlatSettingsModel} saved - Saved configuration.
 * @param {FlatSettingsModel} current - Trusted host configuration.
 * @param {FlatSettingsModel} defaults - Independent defaults for old reports.
 * @returns {FlatSettingsModel} Detached restored configuration.
 * @hidden
 */
export function restoreFlatSettings(saved: FlatSettingsModel, current: FlatSettingsModel,
                                    defaults: FlatSettingsModel): FlatSettingsModel {
    const restored: FlatSettingsModel = cloneFlat(saved || defaults);
    flatOperands(restored, (value: unknown): unknown => {
        if (value && typeof value === 'object' && Object.keys(value).length === 1 &&
            Object.prototype.hasOwnProperty.call(value, 'flatDate')) {
            const time: number = getValue('flatDate', value);
            if (typeof time !== 'number' || !isFinite(new Date(time).getTime())) {
                throw new Error('Flat layout settings contain an invalid date operand.');
            }
            return new Date(time);
        }
        return value;
    });
    restored.queryCellInfo = current.queryCellInfo;
    restored.headerCellInfo = current.headerCellInfo;
    ['rowSelecting', 'rowSelected', 'rowDeselecting', 'rowDeselected',
        'cellSelecting', 'cellSelected', 'cellDeselecting', 'cellDeselected'].forEach((name: string) => {
        const callback: unknown = getValue(name, current);
        if (typeof callback === 'function') { setValue(name, callback, restored); }
        else { Reflect.deleteProperty(restored, name); }
    });
    (restored.aggregates || []).forEach((row: AggregateRowModel) => (row.columns || []).forEach((column: AggregateColumnModel) => {
        const trusted: AggregateColumnModel = (current.aggregates || []).reduce((all: AggregateColumnModel[], item: AggregateRowModel) =>
            all.concat(item.columns || []), []).filter((item: AggregateColumnModel) => item.field === column.field)[0];
        if (column.customAggregate !== undefined && (!trusted || column.customAggregate !== trusted.customAggregate)) {
            throw new Error('Flat custom aggregation requires a trusted host callback.');
        }
        if (trusted) { column.customAggregate = trusted.customAggregate; }
        if (column.type === 'Custom' && !column.customAggregate) {
            throw new Error('Flat custom aggregation requires a trusted host callback.');
        }
    }));
    validateFlatSettings(restored);
    return restored;
}

/**
 * Maps typed operands only; source records and ordinary strings are not converted.
 *
 * @param {FlatSettingsModel} settings - Detached configuration.
 * @param {Function} map - Operand conversion.
 * @returns {void}
 */
function flatOperands(settings: FlatSettingsModel, map: (value: unknown) => unknown): void {
    const value: (input: unknown) => unknown = (input: unknown): unknown => Array.isArray(input) ? input.map(value) : map(input);
    (settings.filterSettings && settings.filterSettings.columns || []).forEach((column: PredicateModel) => {
        if (Object.prototype.hasOwnProperty.call(column, 'value')) { setValue('value', value(column.value), column); }
    });
    const rule: (entry: RuleModel) => void = (entry: RuleModel): void => {
        if (!entry) { return; }
        if (entry.rules) { entry.rules.forEach(rule); }
        else if (Object.prototype.hasOwnProperty.call(entry, 'value')) { setValue('value', value(entry.value), entry); }
    };
    rule(settings.advancedFilterSettings && settings.advancedFilterSettings.queryBuilderSettings &&
        settings.advancedFilterSettings.queryBuilderSettings.rule);
}

/**
 * Removes references to fields lost from a replacement source schema.
 *
 * @param {FlatSettingsModel} settings - Detached candidate configuration.
 * @param {string[]} fields - Eligible source fields.
 * @returns {boolean} Whether entries were removed.
 * @hidden
 */
export function pruneFlatSettings(settings: FlatSettingsModel, fields: string[]): boolean {
    const before: string = JSON.stringify(settings);
    const visible: number = (settings.columns || []).filter((column: ColumnModel) => column.visible !== false).length;
    const exists: (field: string) => boolean = (field: string): boolean => fields.indexOf(field) !== -1;
    settings.columns = (settings.columns || []).filter((column: ColumnModel) => exists(column.field));
    if (settings.sortSettings) {
        settings.sortSettings.columns = (settings.sortSettings.columns || []).filter((sort: SortDescriptorModel) => exists(sort.field));
    }
    if (settings.filterSettings) {
        settings.filterSettings.columns = (settings.filterSettings.columns || []).filter((filter: PredicateModel) => exists(filter.field));
    }
    if (settings.searchSettings && settings.searchSettings.fields) {
        settings.searchSettings.fields = settings.searchSettings.fields.filter(exists);
    }
    if (settings.aggregates) {
        settings.aggregates = settings.aggregates.map((row: AggregateRowModel) => Object.assign({}, row, {
            columns: (row.columns || []).filter((column: AggregateColumnModel) => exists(column.field))
        })).filter((row: AggregateRowModel) => row.columns.length > 0);
    }
    const prune: (rule: RuleModel) => boolean = (rule: RuleModel): boolean => {
        if (!rule.rules) { return exists(rule.field); }
        rule.rules = rule.rules.filter(prune);
        return rule.rules.length > 0;
    };
    const root: RuleModel = settings.advancedFilterSettings && settings.advancedFilterSettings.queryBuilderSettings &&
        settings.advancedFilterSettings.queryBuilderSettings.rule;
    if (root) { prune(root); }
    if (settings.frozenColumns && settings.columns.filter((column: ColumnModel) => column.visible !== false).length < visible) {
        settings.frozenColumns = Math.min(settings.frozenColumns,
                                          settings.columns.filter((column: ColumnModel) => column.visible !== false).length);
    }
    return before !== JSON.stringify(settings);
}
