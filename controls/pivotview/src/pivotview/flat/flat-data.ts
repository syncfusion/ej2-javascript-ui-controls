import { FlatRecord, FlatValue } from '../../common/base/interface';

/** Own scalar source paths and detached selected-field projection. @hidden */
export class FlatRecordStore {
    /** Discovered eligible physical field paths. @hidden */
    public fields: string[] = [];
    /** Observed scalar types for eligible physical fields. @hidden */
    public types: { [field: string]: string } = Object.create(null);
    private paths: Map<string, string[]> = new Map<string, string[]>();
    private excluded: string[];
    private records: object[];

    constructor(records: object[], excluded: string[] = [], csv: boolean = false) {
        this.records = csv ? this.normalizeCsv(records as string[][]) : records;
        this.excluded = excluded;
        this.records.forEach((record: object) => {
            if (!record || typeof record !== 'object' || Array.isArray(record) || record instanceof Date) {
                throw new Error('Flat layout requires a complete relational record source.');
            }
            this.scan(record, [], []);
        });
    }

    private normalizeCsv(records: string[][]): FlatRecord[] {
        if (!records.length) { return []; }
        const header: string[] = records[0];
        if (!Array.isArray(header) || header.some((name: string, index: number) =>
            typeof name !== 'string' || !name || header.indexOf(name) !== index)) {
            throw new Error('Flat layout settings contain an invalid value.');
        }
        return records.slice(1).map((values: string[]) => {
            if (!Array.isArray(values)) { throw new Error('Flat layout settings contain an invalid value.'); }
            const record: FlatRecord = Object.create(null);
            header.forEach((name: string, index: number) => {
                const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(values, String(index));
                const value: string = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : null;
                Object.defineProperty(record, name, { value: value, writable: true, enumerable: true, configurable: true });
            });
            return record;
        });
    }

    private scan(record: object, prefix: string[], ancestors: object[]): void {
        if (!record || typeof record !== 'object' || Array.isArray(record) || ancestors.indexOf(record) !== -1) { return; }
        Object.keys(record).forEach((key: string) => {
            const parts: string[] = prefix.concat(key);
            const field: string = parts.join('.');
            if (key.split('.').some((part: string) => ['__proto__', 'prototype', 'constructor'].indexOf(part) !== -1)) {
                throw new Error('Flat layout settings contain an invalid value.');
            }
            if (this.excluded.some((name: string) => field === name || field.indexOf(name + '.') === 0)) { return; }
            const descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(record, key);
            if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) { return; }
            const value: FlatValue = descriptor.value;
            if (value === null || value === undefined || value instanceof Date ||
                ['string', 'number', 'boolean'].indexOf(typeof value) !== -1) {
                const previous: string[] = this.paths.get(field);
                if (previous && (previous.length !== parts.length ||
                    (parts.length > 1 && previous.join('\0') !== parts.join('\0')))) {
                    throw new Error('Flat layout settings contain an invalid value.');
                }
                if (!previous) { this.paths.set(field, parts); this.fields.push(field); }
                if (value !== null && value !== undefined) {
                    const type: string = value instanceof Date ? 'date' : typeof value;
                    const inferred: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.types, field);
                    const previousType: string = inferred && inferred.value;
                    const nextType: string = previousType && previousType !== type ? 'mixed' : type;
                    if (previousType !== nextType) {
                        Object.defineProperty(this.types, field, {
                            value: nextType, writable: true, enumerable: true, configurable: true
                        });
                    }
                }
            } else {
                this.scan(descriptor.value, parts, ancestors.concat(record));
            }
        });
    }

    /**
     * Number of physical records.
     *
     * @returns {number} Record count.
     * @hidden
     */
    public get length(): number { return this.records.length; }

    /**
     * Reads an own scalar path without invoking getters.
     *
     * @param {number} ordinal - Physical record index.
     * @param {string} field - Safe schema field.
     * @returns {FlatValue} Physical scalar or blank.
     * @hidden
     */
    public read(ordinal: number, field: string): FlatValue {
        const path: string[] = this.paths.get(field);
        if (!path) { throw new Error('Flat layout ignored an unavailable or unsupported field.'); }
        const record: PropertyDescriptor = Object.getOwnPropertyDescriptor(this.records, String(ordinal));
        let current: object = record && record.value;
        for (const part of path) {
            const descriptor: PropertyDescriptor = current && typeof current === 'object'
                ? Object.getOwnPropertyDescriptor(current, part) : undefined;
            current = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : undefined;
        }
        return current instanceof Date || ['string', 'number', 'boolean'].indexOf(typeof current) !== -1
            ? current as FlatValue : null;
    }

    /**
     * Creates detached selected-field records in the supplied source order.
     *
     * @param {string[]} fields - Eligible physical field paths to include.
     * @param {number[]} ordinals - Source ordinals; omitted to include every source record.
     * @returns {FlatRecord[]} Detached scalar records with copied Date values.
     * @hidden
     */
    public project(fields: string[], ordinals?: number[]): FlatRecord[] {
        fields.forEach((field: string) => {
            if (!this.paths.has(field)) { throw new Error('Flat layout ignored an unavailable or unsupported field.'); }
        });
        const indexes: number[] = ordinals || this.records.map((_record: object, index: number) => index);
        return indexes.map((ordinal: number) => {
            const projected: FlatRecord = {};
            fields.forEach((field: string) => {
                const value: FlatValue = this.read(ordinal, field);
                Object.defineProperty(projected, field, {
                    value: value instanceof Date ? new Date(value.getTime()) : value,
                    writable: true, enumerable: true, configurable: true
                });
            });
            return projected;
        });
    }
}
