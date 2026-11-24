import { AggregateRowModel, ColumnModel, AggregateColumnModel, CustomSummaryType } from '@syncfusion/ej2-grids';
import { FlatRecord, FlatValue } from '../../common/base/interface';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { FlatRecordStore } from './flat-data';
import { FlatQuery } from './flat-query';
import { cloneFlat, resolveFlatCustomAggregate } from '../../common/base/flat-util';
import { DataManager, Query, ReturnOption } from '@syncfusion/ej2-data';
import { getValue } from '@syncfusion/ej2-base';

/** One committed result row, independent from record windows and pivot measures. @hidden */
export class FlatSummaries {
    /** Computed summary values keyed by physical field. @hidden */
    public values: { [field: string]: FlatValue } = Object.create(null);

    constructor(store: FlatRecordStore, query: FlatQuery, settings: FlatSettingsModel, host?: object, ownerWindow?: Window) {
        const rows: AggregateRowModel[] = settings.aggregates || [];
        if (rows.length > 1 || ['None', 'Top', 'Bottom'].indexOf(settings.totalsPosition || 'None') === -1) { this.invalid(); }
        const names: string[] = [];
        const columns: ColumnModel[] = settings.columns || [];
        const aggregates: AggregateColumnModel[] = rows.length && rows[0].columns || [];
        aggregates.forEach((aggregate: AggregateColumnModel) => {
            if (typeof aggregate.field !== 'string' || !aggregate.field ||
                aggregate.field.split('.').some((part: string) => ['__proto__', 'prototype', 'constructor'].indexOf(part) !== -1) ||
                store.length > 0 && store.fields.indexOf(aggregate.field) === -1 || names.indexOf(aggregate.field) !== -1 ||
                typeof aggregate.type !== 'string' ||
                ['Sum', 'Average', 'Min', 'Max', 'Count', 'TrueCount', 'FalseCount', 'Custom'].indexOf(aggregate.type) === -1) {
                this.invalid();
            }
            names.push(aggregate.field);
            if (!settings.totalsPosition || settings.totalsPosition === 'None' ||
                !columns.some((column: ColumnModel) => column.field === aggregate.field) ||
                columns.some((column: ColumnModel) => column.field === aggregate.field && column.visible === false)) { return; }
            let value: FlatValue = null;
            if (aggregate.type === 'Custom') {
                const callable: CustomSummaryType = resolveFlatCustomAggregate(aggregate.customAggregate, ownerWindow) || this.invalid();
                const data: FlatRecord[] = store.project(columns.filter((column: ColumnModel) => column.visible !== false)
                    .map((column: ColumnModel) => column.field), query.ordinals);
                value = callable.call(host, data, cloneFlat(aggregate));
                if (value === undefined) { value = null; }
                if (value !== null && !(['string', 'boolean'].indexOf(typeof value) !== -1 ||
                    typeof value === 'number' && isFinite(value) || value instanceof Date && isFinite(value.getTime()))) {
                    this.invalid();
                }
                if (value instanceof Date) { value = new Date(value.getTime()); }
            } else {
                const type: string = (aggregate.type as string).toLowerCase();
                const data: { value: FlatValue }[] = query.ordinals.map((ordinal: number) =>
                    ({ value: store.read(ordinal, aggregate.field) }));
                const result: ReturnOption = new DataManager(data).executeLocal(
                    new Query().aggregate(type, 'value').requiresCount()) as ReturnOption;
                value = getValue('value - ' + type, result.aggregates);
                if (value === undefined) { value = null; }
            }
            Object.defineProperty(this.values, aggregate.field, {
                value: value, writable: true, enumerable: true, configurable: true
            });
        });
    }

    private invalid(): never { throw new Error('Flat layout settings contain an invalid value.'); }
}
