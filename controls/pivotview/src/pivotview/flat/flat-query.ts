import { FilterSettingsModel, SortDescriptorModel, SearchSettingsModel, PredicateModel, ColumnModel } from '@syncfusion/ej2-grids';
import { QueryBuilder, QueryBuilderModel, RuleModel } from '@syncfusion/ej2-querybuilder';
import { DateFormatOptions, Internationalization } from '@syncfusion/ej2-base';
import { DataManager, DataUtil, Predicate, Query } from '@syncfusion/ej2-data';
import { FlatSettingsModel } from '../model/flatsettings-model';
import { FlatValue } from '../../common/base/interface';
import { FlatRecordStore } from './flat-data';

/** Native local queries over safe source ordinals; no second record projection. @hidden */
export class FlatQuery {
    /** Source ordinals in committed filter and sort order. @hidden */
    public ordinals: number[] = [];
    private store: FlatRecordStore;
    private settings: FlatSettingsModel;
    private locale: string;
    private columns: ColumnModel[];
    private manager: DataManager;
    private advanced: Predicate;
    private collator: Intl.Collator;
    private groups: Map<string, Predicate> = new Map<string, Predicate>();

    constructor(store: FlatRecordStore, settings: FlatSettingsModel, locale: string) {
        this.store = store;
        this.settings = settings;
        this.locale = locale;
        this.columns = settings.columns || [];
        this.collator = new Intl.Collator(locale);
        const filter: FilterSettingsModel = settings.filterSettings || {};
        if (filter.mode && filter.mode !== 'OnEnter' || filter.type && ['Menu', 'Excel'].indexOf(filter.type) === -1) {
            this.invalid();
        }
        (filter.columns || []).forEach((model: PredicateModel) => {
            if (model.predicate && ['and', 'or'].indexOf(model.predicate) === -1) { this.invalid(); }
            const predicate: Predicate = this.predicate(model);
            const previous: Predicate = this.groups.get(model.field);
            this.groups.set(model.field, !previous ? predicate : model.predicate === 'or'
                ? previous.or(predicate) : previous.and(predicate));
        });
        const builder: QueryBuilderModel = settings.advancedFilterSettings && settings.advancedFilterSettings.queryBuilderSettings;
        this.advanced = this.compileRule(builder && builder.rule, []);
        const sorts: SortDescriptorModel[] = settings.sortSettings && settings.sortSettings.columns || [];
        const sortedFields: string[] = [];
        sorts.forEach((sort: SortDescriptorModel) => {
            this.requireField(sort.field);
            if (['Ascending', 'Descending'].indexOf(sort.direction) === -1 || sortedFields.indexOf(sort.field) !== -1) { this.invalid(); }
            sortedFields.push(sort.field);
        });
        const ordinals: number[] = [];
        for (let ordinal: number = 0; ordinal < store.length; ordinal++) { ordinals.push(ordinal); }
        this.manager = new DataManager(ordinals);
        const query: Query = this.createQuery();
        if (sorts.length) {
            query.sortBy('', (left: number, right: number) => {
                for (const sort of sorts) {
                    const result: number = this.compare(store.read(left, sort.field), store.read(right, sort.field), sort.direction);
                    if (result) { return result; }
                }
                return left - right;
            });
        }
        this.ordinals = this.manager.executeLocal(query) as number[];
    }

    private invalid(): never { throw new Error('Flat layout settings contain an invalid value.'); }

    private requireField(field: string): void {
        if (typeof field !== 'string' || this.columns.every((column: ColumnModel) => column.field !== field) ||
            this.store.length > 0 && this.store.fields.indexOf(field) === -1) { this.invalid(); }
    }

    private normalize(text: string, ignoreCase: boolean, ignoreAccent: boolean): string {
        const normalized: string = ignoreAccent ? DataUtil.ignoreDiacritics(text) as string : text;
        return ignoreCase ? normalized.toLocaleLowerCase.call(normalized, this.locale) : normalized;
    }

    private validatePredicate(predicate: PredicateModel): void {
        this.requireField(predicate.field);
        const operators: string[] = ['equal', 'notequal', 'contains', 'doesnotcontain', 'startswith', 'doesnotstartwith',
            'endswith', 'doesnotendwith', 'greaterthan', 'greaterthanorequal', 'lessthan', 'lessthanorequal',
            'isnull', 'isnotnull', 'isempty', 'isnotempty', 'in', 'notin', 'between', 'notbetween'];
        if (operators.indexOf(predicate.operator) === -1) { this.invalid(); }
        const value: string | number | boolean | Date | FlatValue[] = predicate.value;
        const scalar: (operand: FlatValue) => boolean = (operand: FlatValue) => operand === null || operand === undefined ||
            ['string', 'boolean'].indexOf(typeof operand) !== -1 || typeof operand === 'number' && isFinite(operand) ||
            operand instanceof Date && isFinite(operand.getTime());
        if (Array.isArray(value)) {
            if (['in', 'notin', 'between', 'notbetween'].indexOf(predicate.operator) === -1 ||
                !value.every(scalar) || /between/.test(predicate.operator) && value.length !== 2) { this.invalid(); }
        } else if (!scalar(value) || ['in', 'notin', 'between', 'notbetween'].indexOf(predicate.operator) !== -1) {
            this.invalid();
        }
    }

    private check(read: (ordinal: number) => boolean, expected: boolean = true): Predicate {
        return new Predicate('__flat', 'equal', expected, false, false, false,
                             (_field: string, ordinal: number) => read(ordinal));
    }

    private negate(predicate: Predicate): Predicate {
        // Native andnot/ornot mutate child conditions during validation; keep repeated queries independent.
        return this.check((ordinal: number) => !!predicate.validate(ordinal), false);
    }

    private predicate(model: PredicateModel): Predicate {
        this.validatePredicate(model);
        const operator: string = model.operator;
        const leaf: (op: string, value: FlatValue) => Predicate = (op: string, value: FlatValue) =>
            this.predicate(Object.assign({}, model, { operator: op, value: value }));
        if (operator === 'in' || operator === 'notin') {
            const choices: Predicate[] = (model.value as FlatValue[]).map((value: FlatValue) => leaf('equal', value));
            const any: Predicate = choices.length ? Predicate.or(choices) : this.check(() => false);
            return operator === 'notin' ? this.negate(any) : any;
        }
        if (operator === 'between' || operator === 'notbetween') {
            const bounds: FlatValue[] = model.value as FlatValue[];
            const dates: boolean = bounds.every((bound: FlatValue) => bound instanceof Date);
            if (!dates && !bounds.every((bound: FlatValue) => typeof bound === 'number')) { return this.check(() => false); }
            const range: Predicate = Predicate.and(leaf('greaterthanorequal', bounds[0]), leaf('lessthanorequal', bounds[1]));
            return operator === 'between' ? range : Predicate.and(this.check((ordinal: number) => {
                const value: FlatValue = this.store.read(ordinal, model.field);
                return dates ? value instanceof Date && isFinite(value.getTime()) : typeof value === 'number' && isFinite(value);
            }), this.negate(range));
        }
        let nativeOperator: string = operator;
        switch (operator) {
        case 'notequal':
        case 'isnull':
        case 'isnotnull':
        case 'isempty':
        case 'isnotempty':
            nativeOperator = 'equal';
            break;
        case 'doesnotcontain':
            nativeOperator = 'contains';
            break;
        case 'doesnotstartwith':
            nativeOperator = 'startswith';
            break;
        case 'doesnotendwith':
            nativeOperator = 'endswith';
            break;
        }
        const operand: FlatValue = operator === 'isnull' || operator === 'isnotnull' ? null :
            operator === 'isempty' || operator === 'isnotempty' ? '' : model.value as FlatValue;
        const text: boolean = ['contains', 'startswith', 'endswith'].indexOf(nativeOperator) !== -1;
        const ordered: boolean = /^(greater|less)than/.test(operator);
        if (text && typeof operand !== 'string' || ordered && !(operand instanceof Date || typeof operand === 'number')) {
            return this.check(() => false);
        }
        const dates: boolean = operand instanceof Date;
        const ignoreCase: boolean = text ? model.matchCase !== true : model.matchCase === false;
        const normalize: (value: FlatValue) => FlatValue = (value: FlatValue) => {
            if (ordered || dates) {
                return dates ? value instanceof Date ? value.getTime() : NaN :
                    typeof value === 'number' && isFinite(value) ? value : NaN;
            }
            return typeof value === 'string' ? this.normalize(value, ignoreCase, (text || ignoreCase) && model.ignoreAccent) :
                value === undefined ? null : value;
        };
        let result: Predicate = new Predicate(model.field, nativeOperator, normalize(operand), false, false, false,
                                              (field: string, ordinal: number) => normalize(this.store.read(ordinal, field)));
        if (['notequal', 'isnotnull', 'isnotempty'].indexOf(operator) !== -1 || operator.indexOf('doesnot') === 0) {
            result = this.negate(result);
        }
        return text ? Predicate.and(this.check((ordinal: number) => typeof this.store.read(ordinal, model.field) === 'string'),
                                    result) : result;
    }

    private compileRule(rule: RuleModel, ancestors: RuleModel[]): Predicate {
        if (!rule) { return undefined; }
        if (ancestors.indexOf(rule) !== -1 || ancestors.length > 64) { this.invalid(); }
        if (rule.rules) {
            if (!Array.isArray(rule.rules) || ['and', 'or'].indexOf(rule.condition) === -1) { this.invalid(); }
            const children: Predicate[] = rule.rules.map((child: RuleModel) =>
                this.compileRule(child, ancestors.concat(rule)) || this.check(() => true));
            const group: Predicate = !children.length ? this.check(() => true) : rule.condition === 'and'
                ? Predicate.and(children) : Predicate.or(children);
            return rule.not ? this.negate(group) : group;
        }
        if (!rule.type) { return this.predicate({ field: rule.field, operator: rule.operator, value: rule.value }); }
        return this.nativeRule(rule);
    }

    private nativeRule(rule: RuleModel): Predicate {
        this.requireField(rule.field);
        if (['string', 'number', 'boolean', 'date'].indexOf(rule.type) === -1) { this.invalid(); }
        const aliases: { [operator: string]: string } = {
            notcontains: 'doesnotcontain', notstartswith: 'doesnotstartwith', notendswith: 'doesnotendwith'
        };
        const alias: PropertyDescriptor = Object.getOwnPropertyDescriptor(aliases, rule.operator);
        const operator: string = alias ? alias.value : rule.operator;
        const date: boolean = rule.type === 'date';
        const column: ColumnModel = this.columns.filter((entry: ColumnModel) => entry.field === rule.field)[0];
        const intl: Internationalization = date ? new Internationalization(this.locale) : undefined;
        const value: (operand: FlatValue, end?: boolean) => FlatValue = (operand: FlatValue, end: boolean = false) => {
            if (!date || operand === null || operand === undefined) { return operand; }
            if (operand instanceof Date) { return operand.getTime(); }
            if (typeof operand !== 'string') { this.invalid(); }
            const format: DateFormatOptions = typeof column.format === 'string' ?
                column.format === 'yMd' || column.format === 'short' ? { skeleton: column.format, type: 'date' } :
                    { format: column.format } : column.format || { skeleton: 'yMd', type: 'date' };
            const parsed: Date = intl.parseDate(operand as string, format);
            if (!parsed || !isFinite(parsed.getTime())) { this.invalid(); }
            if ((operand as string).indexOf(':') === -1) {
                parsed.setHours(end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0);
            }
            return parsed.getTime();
        };
        const original: FlatValue | FlatValue[] = rule.value as FlatValue | FlatValue[];
        const normalized: FlatValue | FlatValue[] = Array.isArray(original) ? original.map((entry: FlatValue, index: number) =>
            value(entry, /between/.test(operator) && index === 1)) :
            value(original, operator === 'greaterthan' || operator === 'lessthanorequal');
        this.validatePredicate({ field: rule.field, operator: operator, value: normalized });
        let leaf: RuleModel = { field: rule.field, type: date ? 'number' : rule.type, operator: operator,
            value: normalized as RuleModel['value'] };
        if (date && typeof original === 'string' && original.indexOf(':') === -1 &&
            (operator === 'equal' || operator === 'notequal')) {
            leaf = { condition: operator === 'equal' ? 'and' : 'or', rules: [
                { field: rule.field, type: 'number', operator: operator === 'equal' ? 'greaterthanorequal' : 'lessthan',
                    value: value(original) as number },
                { field: rule.field, type: 'number', operator: operator === 'equal' ? 'lessthanorequal' : 'greaterthan',
                    value: value(original, true) as number }
            ] };
        }
        // Compile without rendering another control. Only scalar operands reach the public compiler.
        const builder: QueryBuilder = new QueryBuilder({ columns: [{ field: rule.field, type: date ? 'number' : rule.type }] });
        const native: Predicate = builder.getPredicate({ condition: 'and', rules: [leaf] });
        const bind: (entry: Predicate) => Predicate = (entry: Predicate): Predicate => {
            if (!entry) { return this.check(() => true); }
            if (entry.isComplex) {
                const children: Predicate[] = entry.predicates.map(bind);
                return entry.condition === 'or' ? Predicate.or(children) : Predicate.and(children);
            }
            const operand: FlatValue = date && typeof entry.value === 'number' ? new Date(entry.value) : entry.value as FlatValue;
            return this.predicate({ field: rule.field, operator: entry.operator, value: operand, matchCase: !entry.ignoreCase });
        };
        return bind(native);
    }

    private addSearch(query: Query): void {
        const search: SearchSettingsModel = this.settings.searchSettings || {};
        const fields: string[] = search.fields && search.fields.length ? search.fields : this.columns
            .filter((column: ColumnModel) => column.visible !== false && column.allowSearching !== false)
            .map((column: ColumnModel) => column.field);
        fields.forEach((field: string) => this.requireField(field));
        const eligible: string[] = fields.filter((field: string) =>
            this.columns.some((column: ColumnModel) => column.field === field && column.allowSearching !== false));
        const operator: string = search.operator || 'contains';
        if (['contains', 'startswith', 'endswith', 'equal', 'notequal'].indexOf(operator) === -1) { this.invalid(); }
        const key: string = this.normalize(search.key || '', search.ignoreCase !== false, search.ignoreAccent);
        if (!key) { return; }
        if (!eligible.length) { query.where(this.check(() => false)); return; }
        query.search(key, eligible, operator, false, false, (field: string, ordinal: number) => {
            const value: FlatValue = this.store.read(ordinal, field);
            if (value === null || typeof value === 'number' && !isFinite(value) ||
                value instanceof Date && !isFinite(value.getTime())) { return operator === 'notequal' ? key : null; }
            return this.normalize(value instanceof Date ? value.toISOString() : String(value),
                                  search.ignoreCase !== false, search.ignoreAccent);
        });
    }

    private createQuery(omitField?: string): Query {
        const predicates: Predicate[] = [];
        this.groups.forEach((predicate: Predicate, field: string) => {
            if (field !== omitField) { predicates.push(predicate); }
        });
        if (this.advanced) { predicates.push(this.advanced); }
        const query: Query = new Query();
        if (predicates.length) { query.where(Predicate.and(predicates)); }
        this.addSearch(query);
        return query;
    }

    private compare(left: FlatValue, right: FlatValue, direction: string): number {
        const rank: (value: FlatValue) => number = (value: FlatValue) => value === null ||
            typeof value === 'number' && isNaN(value) || value instanceof Date && !isFinite(value.getTime()) ? 4 :
            typeof value === 'boolean' ? 0 : typeof value === 'number' ? 1 : value instanceof Date ? 2 : 3;
        const a: number = rank(left);
        const b: number = rank(right);
        if (a === 4 || b === 4) { return a === b ? 0 : a === 4 ? 1 : -1; }
        const result: number = a !== b ? a - b : typeof left === 'string' ? this.collator.compare(left, right as string) :
            Number(left) - Number(right);
        return direction === 'Descending' ? -result : result;
    }

    /**
     * Gets all typed choices while retaining the other query stages.
     *
     * @param {string} field - Physical selected field.
     * @returns {FlatValue[]} Complete choice set.
     * @hidden
     */
    public facet(field: string): FlatValue[] {
        this.requireField(field);
        const result: FlatValue[] = [];
        const keys: Set<string> = new Set<string>();
        const ordinals: number[] = this.manager.executeLocal(this.createQuery(field)) as number[];
        ordinals.forEach((ordinal: number) => {
            const value: FlatValue = this.store.read(ordinal, field);
            const key: string = value instanceof Date ? 'date:' + value.getTime() : typeof value + ':' + String(value);
            if (!keys.has(key)) { keys.add(key); result.push(value instanceof Date ? new Date(value.getTime()) : value); }
        });
        return result;
    }
}
