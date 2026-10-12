import { getComponent, Internationalization } from '@syncfusion/ej2-base';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    DateRangePicker
} from '@syncfusion/ej2-calendars';
import  { DataManager, DataOptions, Query } from '@syncfusion/ej2-data';
import { QueryBuilder, ColumnsModel, RuleModel, TemplateColumn } from '@syncfusion/ej2-querybuilder';
import { FormNode, getAdaptorInstance, extractDataFromPath as extractData } from '@syncfusion/ej2-form-renderer';

/** @private */
export type FieldType = 'string' | 'number' | 'date' | 'boolean';

/** @private */
export function inferFieldType(component: FormNode): FieldType {
    const t: string = (component.type || '').toLowerCase();
    if (t === 'number' || t === 'rangeslider' || t === 'rating') {
        return 'number';
    }
    if (t === 'date') {
        return 'date';
    }
    if (t === 'checkbox' || t === 'switch') {
        return 'boolean';
    }
    return 'string';
}

/** @private */
export function isArrayField(component: FormNode): boolean {
    const t: string = (component.type || '').toLowerCase();
    return t === 'multiselect' || t === 'checkboxgroup' || t === 'daterange';
}

/** @private */
export function hasSelectableOptions(component: FormNode): boolean {
    const t: string = (component.type || '').toLowerCase();
    return (t === 'dropdown' || t === 'radio' || t === 'multiselect' || t === 'checkboxgroup')
        && !!component.options;
}

/** @private */
const EXCLUDED_TYPES: string[] = [
    'imageeditor',
    'richtexteditor',
    'datagrid',
    'splitbutton',
    'button',
    'message',
    'panel',
    'table',
    'tabs',
    'card',
    'statichtml',
    'signature',
    'fileupload'
];

/** @private */
export function buildOperators(
    fieldType: FieldType,
    componentType: string,
    isArray: boolean
): { key: string; value: string }[] {
    const t: string = (componentType || '').toLowerCase();

    if (isArray) {
        return [
            { key: 'Is Empty', value: 'isempty' },
            { key: 'Is Not Empty', value: 'isnotempty' },
            { key: 'Contains', value: 'contains' },
            { key: 'Not Contains', value: 'notcontains' }
        ];
    }

    switch (fieldType) {
        case 'number':
            return [
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' },
                { key: 'Greater than', value: 'greaterthan' },
                { key: 'Less than', value: 'lessthan' },
                { key: 'Greater than or equal', value: 'greaterthanorequal' },
                { key: 'Less than or equal', value: 'lessthanorequal' }
            ];
        case 'date':
            return [
                { key: 'Is Empty', value: 'isempty' },
                { key: 'Is Not Empty', value: 'isnotempty' },
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' },
                { key: 'Greater than', value: 'dategreaterthan' },
                { key: 'Less than', value: 'datelessthan' }
            ];
        case 'boolean':
            return [
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' }
            ];
        default: // 'string'
            if (t === 'time') {
                return [
                    { key: 'Is Empty', value: 'isempty' },
                    { key: 'Is Not Empty', value: 'isnotempty' },
                    { key: 'Equal', value: 'equal' },
                    { key: 'Not Equal', value: 'notequal' },
                    { key: 'Greater than', value: 'timegreaterthan' },
                    { key: 'Less than', value: 'timelessthan' }
                ];
            }
            if (t === 'datetime') {
                return [
                    { key: 'Is Empty', value: 'isempty' },
                    { key: 'Is Not Empty', value: 'isnotempty' },
                    { key: 'Equal', value: 'equal' },
                    { key: 'Not Equal', value: 'notequal' },
                    { key: 'Greater than', value: 'datetimegreaterthan' },
                    { key: 'Less than', value: 'datetimelessthan' }
                ];
            }
            return [
                { key: 'Is Empty', value: 'isempty' },
                { key: 'Is Not Empty', value: 'isnotempty' },
                { key: 'Equal', value: 'equal' },
                { key: 'Not Equal', value: 'notequal' },
                { key: 'Starts With', value: 'startswith' },
                { key: 'Not Starts With', value: 'doesnotstartswith' },
                { key: 'Contains', value: 'contains' },
                { key: 'Not Contains', value: 'notcontains' }
            ];
    }
}

/** @private */
export function filterQueryBuilderColumns(
    componentFields: FormNode[],
    excludeFieldId: string | undefined,
    excludeChildIds: string[]
): FormNode[] {
    return (componentFields || []).filter((c: FormNode) => {
        if (excludeFieldId && c.id === excludeFieldId) { return false; }
        if (excludeChildIds && excludeChildIds.indexOf(c.id) >= 0) { return false; }
        const t: string = (c.type || '').toLowerCase();
        return EXCLUDED_TYPES.indexOf(t) < 0;
    });
}

/** @private */
export function buildColumnsForQueryBuilder(
    componentFields: FormNode[],
    qb: QueryBuilder | null,
    excludeFieldId: string | undefined,
    excludeChildIds: string[],
    fetchedOptions: Record<string, any[]>,
    locale: string
): ColumnsModel[] {
    const filtered: FormNode[] = filterQueryBuilderColumns(
        componentFields,
        excludeFieldId,
        excludeChildIds
    );
    return filtered.map((component: FormNode) => {
        const fieldType: FieldType = inferFieldType(component);
        const isArray: boolean = isArrayField(component);
        const operators: { key: string; value: string }[] = buildOperators(
            fieldType,
            component.type || '',
            isArray
        );
        const fieldId: string = (component.id || component.name || (component as any).key || '').toString();
        const fieldLabel: string = (component.label || component.id || component.name || (component as any).key || fieldId || 'Field').toString();
        const column: ColumnsModel = {
            field: fieldId,
            label: fieldLabel,
            type: fieldType,
            format: fieldType === 'date' ? 'MM/dd/yyyy' : undefined,
            operators: operators
        };

        const useTemplate: boolean = (() => {
            if (hasSelectableOptions(component)) { return true; }
            const t: string = (component.type || '').toLowerCase();
            return t === 'date'
                || t === 'time'
                || t === 'datetime'
                || t === 'daterange';
        })();

        if (useTemplate) {
            column.template = createColumnTemplate(component, qb, fetchedOptions, locale);
        } else if (isArray && Array.isArray((component as any).options)) {
            column.values = ((component as any).options as any[]).map((opt: any) => {
                if (typeof opt === 'string') { return opt; }
                if (opt && typeof opt === 'object' && 'value' in opt) {
                    return (opt as any).value;
                }
                return String(opt);
            });
        }

        return column;
    });
}

/** @private */
export function createColumnTemplate(
    component: FormNode,
    qb: QueryBuilder | null,
    fetchedOptions: Record<string, any[]>,
    locale: string
): TemplateColumn {
    const intl: Internationalization = new Internationalization();
    const t: string = (component.type || '').toLowerCase();
    const isMultiple: boolean = t === 'multiselect' || t === 'checkboxgroup';
    const isDateType: boolean = t === 'date';
    const isTimeType: boolean = t === 'time';
    const isDateTimeType: boolean = t === 'datetime';
    const isDateRangeType: boolean = t === 'daterange';

    const urlFetched: any[] = (fetchedOptions || {})[component.id] || [];
    const rawOptions: any = (component as any).options;
    const resolvedOptions: any[] = Array.isArray(rawOptions)
        ? rawOptions
        : (rawOptions && rawOptions.type === 'url')
            ? resolveUrlOptions(rawOptions, urlFetched)
            : [];
    const dataSource: { text: string; value: any }[] = (resolvedOptions || []).map((opt: any) => {
        if (typeof opt === 'string') {
            return { text: opt, value: opt };
        }
        if (opt && typeof opt === 'object' && 'value' in opt) {
            return {
                text: (opt as any).label || (opt as any).text || (opt as any).value,
                value: (opt as any).value
            };
        }
        return { text: String(opt), value: String(opt) };
    });

    return {
        create: (): HTMLElement => {
            const elem: HTMLInputElement = document.createElement('input');
            elem.setAttribute('type', 'text');
            return elem;
        },

        write: (args: { elements: { id: string }; values: any }): void => {
            const id: string = args.elements.id;
            const hostEl: HTMLElement | null = document.getElementById(id);
            if (!hostEl) { return; }

            if (isMultiple) {
                let initialValue: string[] = [];
                if (args.values) {
                    if (typeof args.values === 'string') {
                        initialValue = args.values.split(',').map((v: string) => v.trim()).filter((v: string) => v);
                    } else if (Array.isArray(args.values)) {
                        initialValue = args.values;
                    }
                }
                const ms: MultiSelect = new MultiSelect({
                    change: (e: any) => {
                        const v: string = e.value && e.value.length > 0 ? e.value.join(', ') : '';
                        if (qb) { qb.notifyChange(v, e.element); }
                    },
                    dataSource: dataSource,
                    fields: { text: 'text', value: 'value' },
                    placeholder: 'Select ' + (component.label || component.id),
                    value: initialValue
                });
                ms.appendTo('#' + id);
                hostEl.setAttribute('data-component-id', component.id);
            } else if (isDateType) {
                const initialDate: Date | null = parseDateArg(args.values);
                const dp: DatePicker = new DatePicker({
                    locale: locale,
                    change: (e: any) => {
                        if (e.value) {
                            const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' }) as any);
                            const formatted: string = fmt(e.value);
                            if (qb) { qb.notifyChange(formatted, e.element); }
                        } else {
                            if (qb) { qb.notifyChange('', e.element); }
                        }
                    },
                    format: 'MM/dd/yyyy',
                    placeholder: 'Select ' + (component.label || component.id),
                    value: initialDate || undefined
                });
                dp.appendTo('#' + id);
            } else if (isTimeType) {
                const initialTime: Date | null = parseTimeArg(args.values);
                const tp: TimePicker = new TimePicker({
                    locale: locale,
                    change: (e: any) => {
                        if (e.value) {
                            const fmt: (d: Date) => string = getFmt(intl, { format: 'hh:mm a', type: 'time' });
                            const formatted: string = fmt(e.value);
                            if (qb) { qb.notifyChange(formatted, e.element); }
                        } else {
                            if (qb) { qb.notifyChange('', e.element); }
                        }
                    },
                    format: 'hh:mm a',
                    placeholder: 'Select ' + (component.label || component.id),
                    value: initialTime || undefined
                });
                tp.appendTo('#' + id);
            } else if (isDateTimeType) {
                const initialDateTime: Date | null = parseDateArg(args.values);
                const dtp: DateTimePicker = new DateTimePicker({
                    locale: locale,
                    change: (e: any) => {
                        if (e.value) {
                            const fmt: (d: Date) => string = getFmt(intl, { format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' });
                            const formatted: string = fmt(e.value);
                            const el: HTMLElement | null = document.getElementById(id);
                            if (qb) { qb.notifyChange(formatted, el as HTMLElement); }
                        } else {
                            const el: HTMLElement | null = document.getElementById(id);
                            if (qb) { qb.notifyChange('', el as HTMLElement); }
                        }
                    },
                    format: 'MM/dd/yyyy hh:mm a',
                    placeholder: 'Select ' + (component.label || component.id),
                    value: initialDateTime || undefined
                });
                dtp.appendTo('#' + id);
            } else if (isDateRangeType) {
                const dr: { start: Date | null; end: Date | null } = parseDateRangeArg(args.values);
                const drp: DateRangePicker = new DateRangePicker({
                    locale: locale,
                    change: (e: any) => {
                        if (e.startDate && e.endDate) {
                            const fmt: (d: Date) => string = getFmt(intl, { format: 'MM/dd/yyyy', type: 'date' });
                            const formatted: string = fmt(e.startDate) + ' , ' + fmt(e.endDate);
                            const el: HTMLElement | null = document.getElementById(id);
                            if (qb) { qb.notifyChange(formatted, el as HTMLElement); }
                        } else {
                            const el: HTMLElement | null = document.getElementById(id);
                            if (qb) { qb.notifyChange('', el as HTMLElement); }
                        }
                    },
                    format: 'MM/dd/yyyy',
                    placeholder: 'Select ' + (component.label || component.id),
                    startDate: dr.start || undefined,
                    endDate: dr.end || undefined
                });
                drp.appendTo('#' + id);
            } else {
                const dd: DropDownList = new DropDownList({
                    change: (e: any) => {
                        if (!qb) { return; }
                        const v: any = (e.itemData && e.itemData.value !== undefined)
                            ? e.itemData.value
                            : e.value;
                        qb.notifyChange(v, e.element);
                    },
                    dataSource: dataSource,
                    fields: { text: 'text', value: 'value' },
                    placeholder: 'Select ' + (component.label || component.id),
                    value: args.values || undefined
                });
                dd.appendTo('#' + id);
                hostEl.setAttribute('data-component-id', component.id);
            }
        },

        destroy: (args: { elementId: string }): void => {
            const el: HTMLElement | null = document.getElementById(args.elementId);
            if (!el) { return; }
            if (isMultiple) {
                const inst: MultiSelect = getComponent(el, 'multiselect') as MultiSelect;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            } else if (isDateType) {
                const inst: DatePicker = getComponent(el, 'datepicker') as DatePicker;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            } else if (isTimeType) {
                const inst: TimePicker = getComponent(el, 'timepicker') as TimePicker;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            } else if (isDateTimeType) {
                const inst: DateTimePicker = getComponent(el, 'datetimepicker') as DateTimePicker;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            } else if (isDateRangeType) {
                const inst: DateRangePicker = getComponent(el, 'daterangepicker') as DateRangePicker;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            } else {
                const inst: DropDownList = getComponent(el, 'dropdownlist') as DropDownList;
                if (inst) { try { inst.destroy(); } catch { /* best-effort */ } }
            }
        }
    };
}

function extractDataFromPath(data: any, path: string): any {
    if (!path) { return data; }
    const parts: string[] = path.split('.');
    let cur: any = data;
    for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
            cur = cur[p as string];
        } else {
            return undefined;
        }
    }
    return cur;
}

/** @private */
function resolveUrlOptions(_options: any, fetched: any[]): any[] {
    let data: any = fetched;
    if (Array.isArray(data)) { return data; }
    if (typeof data === 'string') { return [data]; }
    return [];
}

function parseDateArg(v: any): Date | null {
    if (!v) { return null; }
    if (v instanceof Date) { return v; }
    if (typeof v === 'string') { return new Date(v); }
    return null;
}

/** @private */
function getFmt(intl: Internationalization, opts: any): (d: Date) => string {
    return intl.getDateFormat(opts) as any;
}

function parseTimeArg(v: any): Date | null {
    if (!v) { return null; }
    if (v instanceof Date) { return v; }
    if (typeof v === 'string') {
        // Try "HH:mm a" or "HH:mm:ss" or "HH:mm"
        const d: Date = new Date('1970-01-01 ' + v);
        if (!isNaN(d.getTime())) { return d; }
    }
    return null;
}

function parseDateRangeArg(v: any): { start: Date | null; end: Date | null } {
    if (!v) { return { start: null, end: null }; }
    if (Array.isArray(v)) {
        return { start: parseDateArg(v[0]), end: parseDateArg(v[1]) };
    }
    if (typeof v === 'string') {
        const parts: string[] = v.split(',').map((s: string) => s.trim());
        return { start: parseDateArg(parts[0]), end: parseDateArg(parts[1]) };
    }
    return { start: null, end: null };
}

/** @private */
export { resolveUrlOptions, RuleModel, ColumnsModel };

/** @private */
export async function fetchUrlOptionsForFields(
    componentFields: FormNode[],
    fetched: Record<string, any[]>,
    controllers: Record<string, AbortController>
): Promise<void> {
    const tasks: Promise<void>[] = [];
    (componentFields || []).forEach((c: FormNode) => {
        const opts: any = (c as any).options;
        if (!opts || typeof opts !== 'object' || opts.type !== 'url' || !opts.url) { return; }
        if (controllers[c.id]) {
            try { controllers[c.id].abort(); } catch { /* */ }
        }
        const ctrl: AbortController = new AbortController();
        controllers[c.id] = ctrl;

        const task: Promise<void> = new Promise<void>((resolve: () => void) => {
            try {
                const headers: object[] = [];
                if (Array.isArray(opts.headers)) {
                    opts.headers.forEach((h: any) => {
                        if (h.key && String(h.key).trim()) { headers[h.key] = h.value; }
                    });
                }
                const dataOptions: DataOptions = {
                    url: opts.url,
                    adaptor: getAdaptorInstance(opts.adaptorType),
                    headers: headers,
                }
                const dm: DataManager = new DataManager(dataOptions);
                let q: Query = new Query();
                if (opts.skip) { q = q.skip(opts.skip); }
                if (opts.take) { q = q.take(opts.take); }
                dm.executeQuery(q).then((res: any) => {
                    let data: any = res && res.result;
                    if (opts.dataPath && extractData) {
                        data = extractData(data, opts.dataPath);
                    }
                    if (Array.isArray(data)) { fetched[c.id] = data; }
                    else if (typeof data === 'string') { fetched[c.id] = [data]; }
                    else { fetched[c.id] = []; }
                    resolve();
                }).catch(() => { fetched[c.id] = []; resolve(); });
            } catch { fetched[c.id] = []; resolve(); }
        });
        tasks.push(task);
    });
    await Promise.all(tasks);
}
