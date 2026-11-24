import { arrayItem } from '../../core/compat/array-compat';
import { ownDelete, ownGet, ownSet } from '../../core/compat/object-compat';
import { DocxError } from '../../core/errors/docx-error';
import { decodeBase64, encodeBase64 } from '../../core/compat/base64';
import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { OpenXmlChild } from '../../core/xml/model';

/**
 * Data type of a document property value.
 */
export enum PropertyValueType {
    /** Specifies a Boolean value. */
    Boolean,
    /** Specifies a date and time value. */
    Date,
    /** Single precision floating point value. */
    Float,
    /** Double precision floating point value. */
    Double,
    /** Specifies a 32-bit integer value. */
    Int,
    /** Specifies a string value. */
    String,
    /** Specifies a binary (byte array) value. */
    ByteArray,
    /** Clipboard data value (read as opaque; not creatable). */
    ClipData,
}

/**
 * Group a property belongs to.
 */
export enum PropertyType {
    /** Summary information (core properties). */
    Summary,
    /** Document summary information (extended properties). */
    DocumentSummary,
    /** Specifies a user-defined (custom) document property. */
    Custom,
}

/**
 * Identifiers of the built-in document properties. Summary information ids
 * follow the OLE property set ids (2-19). Document summary ids are offset by 1000
 * to keep every member unique.
 */
export enum BuiltInProperty {
    /** Specifies the title property. */
    Title = 2,
    /** Specifies the subject property. */
    Subject = 3,
    /** Specifies the author property. */
    Author = 4,
    /** Specifies the keywords property. */
    Keywords = 5,
    /** Specifies the comments property. */
    Comments = 6,
    /** Specifies the template property. */
    Template = 7,
    /** Specifies the last author property. */
    LastAuthor = 8,
    /** Specifies the revision number property. */
    RevisionNumber = 9,
    /** Specifies the total editing time property. */
    TotalEditingTime = 10,
    /** Specifies the last printed property. */
    LastPrinted = 11,
    /** Specifies the create date property. */
    CreateDate = 12,
    /** Specifies the last save date property. */
    LastSaveDate = 13,
    /** Specifies the page count property. */
    PageCount = 14,
    /** Specifies the word count property. */
    WordCount = 15,
    /** Specifies the char count property. */
    CharCount = 16,
    /** Specifies the thumbnail property. */
    Thumbnail = 17,
    /** Specifies the application name property. */
    ApplicationName = 18,
    /** Specifies the doc security property. */
    DocSecurity = 19,
    /** Specifies the category property. */
    Category = 1002,
    /** Specifies the byte count property. */
    ByteCount = 1004,
    /** Specifies the line count property. */
    LineCount = 1005,
    /** Specifies the paragraph count property. */
    ParagraphCount = 1006,
    /** Specifies the slide count property. */
    SlideCount = 1007,
    /** Specifies the note count property. */
    NoteCount = 1008,
    /** Specifies the hidden count property. */
    HiddenCount = 1009,
    /** Specifies the manager property. */
    Manager = 1014,
    /** Specifies the company property. */
    Company = 1015,
}

/**
 * Supported value of a document property.
 */
export type DocumentPropertyValue = string | number | boolean | Date | Uint8Array;

const DEFAULT_DATE_MS: number = -62135596800000;
const INT32_MAX: number = 2147483647;
const INT32_MIN: number = -2147483648;

/**
 * @param {DocumentPropertyValue} value - The value.
 * @returns {PropertyValueType} The result.
 * @private
 */
export function detectPropertyType(value: DocumentPropertyValue): PropertyValueType {
    if (typeof value === 'string') {
        return PropertyValueType.String;
    }
    if (typeof value === 'boolean') {
        return PropertyValueType.Boolean;
    }
    if (value instanceof Date) {
        return PropertyValueType.Date;
    }
    if (value instanceof Uint8Array) {
        return PropertyValueType.ByteArray;
    }
    if (typeof value === 'number') {
        return Math.floor(value) === value && value >= INT32_MIN && value <= INT32_MAX
            ? PropertyValueType.Int
            : PropertyValueType.Double;
    }
    throw new DocxError('argument/invalid', 'Property value is of unsupported type.');
}

function checkValue(value: DocumentPropertyValue, type: PropertyValueType): void {
    const ok: boolean = (type === PropertyValueType.String && typeof value === 'string')
        || (type === PropertyValueType.Boolean && typeof value === 'boolean')
        || (type === PropertyValueType.Date && value instanceof Date)
        || (type === PropertyValueType.ByteArray && value instanceof Uint8Array)
        || ((type === PropertyValueType.Int || type === PropertyValueType.Float || type === PropertyValueType.Double)
            && typeof value === 'number' && isFinite(value)
            && (type !== PropertyValueType.Int || (Math.floor(value) === value && value >= INT32_MIN && value <= INT32_MAX)));
    if (!ok) {
        throw new DocxError('argument/invalid', 'Property value does not match the property type.');
    }
}

/**
 * A single document property (name/value pair with a data type).
 */
export class DocumentProperty {
    private nameValue: string;
    private val: DocumentPropertyValue;
    private type: PropertyValueType;
    private readonly onChange: (() => void) | undefined;
    /**
     * @private
     */
    pid: number | undefined;
    /**
     * @param {string} name - The name.
     * @param {DocumentPropertyValue} value - The value.
     * @param {PropertyValueType} type - The type.
     * @param {Function} onChange - The on change.
     * @private
     */
    constructor(name: string, value: DocumentPropertyValue, type?: PropertyValueType, onChange?: () => void) {
        const resolved: PropertyValueType = type === undefined ? detectPropertyType(value) : type;
        checkValue(value, resolved);
        this.nameValue = name;
        this.val = value;
        this.type = resolved;
        this.onChange = onChange;
    }
    /**
     * Gets the property name.
     */
    get name(): string {
        return this.nameValue;
    }
    /**
     * Gets or sets the property value. Setting re-detects the type, keeping Float/Double for numbers.
     */
    get value(): DocumentPropertyValue {
        return this.val;
    }
    set value(value: DocumentPropertyValue) {
        let next: PropertyValueType = detectPropertyType(value);
        if (typeof value === 'number' && (this.type === PropertyValueType.Float || this.type === PropertyValueType.Double)) {
            next = this.type;
        }
        checkValue(value, next);
        this.val = value;
        this.type = next;
        this.changed();
    }
    /**
     * Gets the data type of the current value.
     */
    get valueType(): PropertyValueType {
        return this.type;
    }
    /**
     *  Returns the value as boolean.
     *
     * @returns {boolean} - Returns the result.
     */
    toBool(): boolean {
        if (typeof this.val === 'boolean') {
            return this.val;
        }
        if (typeof this.val === 'string') {
            return this.val.toLowerCase() === 'true';
        }
        if (typeof this.val === 'number') {
            return this.val !== 0;
        }
        throw new DocxError('argument/invalid', 'Property value cannot be converted to boolean.');
    }
    /**
     *  Returns the value as Date.
     *
     * @returns {Date} - Returns the value as Date.
     */
    toDateTime(): Date {
        if (this.val instanceof Date) {
            return this.val;
        }
        if (typeof this.val === 'string') {
            const parsed: Date = new Date(this.val);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        throw new DocxError('argument/invalid', 'Property value cannot be converted to a date.');
    }
    /**
     *  Returns the value as a number (float).
     *
     * @returns {number} - Returns the value as a number (float).
     */
    toFloat(): number {
        return this.toNumber();
    }
    /**
     *  Returns the value as a number (double).
     *
     * @returns {number} - Returns the value as a number (double).
     */
    toDouble(): number {
        return this.toNumber();
    }
    /**
     *  Returns the value as an integer.
     *
     * @returns {number} - Returns the value as an integer.
     */
    toInt(): number {
        const n: number = this.toNumber();
        return n < 0 ? Math.ceil(n) : Math.floor(n);
    }
    /**
     *  Returns the value as a byte array.
     *
     * @returns {Uint8Array} - Returns the value as a byte array.
     */
    toByteArray(): Uint8Array {
        if (this.val instanceof Uint8Array) {
            return this.val;
        }
        throw new DocxError('argument/invalid', 'Property value is not a byte array.');
    }
    /**
     *  Returns the value as text.
     *
     * @returns {string} - Returns the value as text.
     */
    toString(): string {
        if (this.val instanceof Date) {
            return formatDate(this.val);
        }
        if (this.val instanceof Uint8Array) {
            return encodeBase64(this.val);
        }
        return String(this.val);
    }
    /**
     *  Creates a detached copy of this property.
     *
     * @returns {DocumentProperty} - Returns the DocumentProperty.
     */
    clone(): DocumentProperty {
        const copy: DocumentProperty = new DocumentProperty(this.nameValue, cloneValue(this.val), this.type);
        copy.pid = this.pid;
        return copy;
    }
    private toNumber(): number {
        if (typeof this.val === 'number') {
            return this.val;
        }
        if (typeof this.val === 'boolean') {
            return this.val ? 1 : 0;
        }
        if (typeof this.val === 'string') {
            const n: number = parseFloat(this.val);
            if (!isNaN(n)) {
                return n;
            }
        }
        throw new DocxError('argument/invalid', 'Property value cannot be converted to a number.');
    }
    private changed(): void {
        if (this.onChange !== undefined) {
            this.onChange();
        }
    }
}

function cloneValue(value: DocumentPropertyValue): DocumentPropertyValue {
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    if (value instanceof Uint8Array) {
        return new Uint8Array(value);
    }
    return value;
}

function formatDate(date: Date): string {
    return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Key/value storage with stable key order and change notification.
 *
 * @private
 */
export class FieldMap {
    private keyList: string[] = [];
    private values: { [key: string]: string } = {};
    private dirtyFlag: boolean = false;
    /**
     *  @private
     *
     * @param {string} key - The key.
     * @returns {string | undefined} The result.
     */
    get(key: string): string | undefined {
        return Object.prototype.hasOwnProperty.call(this.values, key) ? ownGet(this.values, key) : undefined;
    }
    /**
     *  @private
     *
     * @param {string} key - The key.
     * @param {string | undefined} value - The value.
     * @param {boolean} silent - The silent.
     * @returns {void} Nothing is returned.
     */
    set(key: string, value: string | undefined, silent?: boolean): void {
        if (value === undefined) {
            if (this.get(key) === undefined) {
                return;
            }
            ownDelete(this.values, key);
            this.keyList.splice(this.keyList.indexOf(key), 1);
        } else {
            if (this.get(key) === undefined) {
                this.keyList.push(key);
            }
            ownSet(this.values, key, value);
        }
        if (silent !== true) {
            this.dirtyFlag = true;
        }
    }
    /**
     *  @private
     *
     * @returns {string[]} The result.
     */
    keys(): string[] {
        return this.keyList.slice();
    }
    /**
     * @private
     */
    get dirty(): boolean {
        return this.dirtyFlag;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    markClean(): void {
        this.dirtyFlag = false;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    markDirty(): void {
        this.dirtyFlag = true;
    }
}

interface BuiltinMapping {
    readonly store: 'core' | 'ext' | 'mem';
    readonly key: string;
}

const BUILTIN_MAP: Map<number, BuiltinMapping> = new Map<number, BuiltinMapping>();
function map(id: BuiltInProperty, store: 'core' | 'ext' | 'mem', key: string): void {
    BUILTIN_MAP.set(id, { store, key });
}
map(BuiltInProperty.Title, 'core', 'title');
map(BuiltInProperty.Subject, 'core', 'subject');
map(BuiltInProperty.Author, 'core', 'creator');
map(BuiltInProperty.Keywords, 'core', 'keywords');
map(BuiltInProperty.Comments, 'core', 'description');
map(BuiltInProperty.Template, 'ext', 'Template');
map(BuiltInProperty.LastAuthor, 'core', 'lastModifiedBy');
map(BuiltInProperty.RevisionNumber, 'core', 'revision');
map(BuiltInProperty.TotalEditingTime, 'ext', 'TotalTime');
map(BuiltInProperty.LastPrinted, 'core', 'lastPrinted');
map(BuiltInProperty.CreateDate, 'core', 'created');
map(BuiltInProperty.LastSaveDate, 'core', 'modified');
map(BuiltInProperty.PageCount, 'ext', 'Pages');
map(BuiltInProperty.WordCount, 'ext', 'Words');
map(BuiltInProperty.CharCount, 'ext', 'Characters');
map(BuiltInProperty.Thumbnail, 'mem', 'thumbnail');
map(BuiltInProperty.ApplicationName, 'ext', 'Application');
map(BuiltInProperty.DocSecurity, 'ext', 'DocSecurity');
map(BuiltInProperty.Category, 'core', 'category');
map(BuiltInProperty.ByteCount, 'mem', 'bytes');
map(BuiltInProperty.LineCount, 'ext', 'Lines');
map(BuiltInProperty.ParagraphCount, 'ext', 'Paragraphs');
map(BuiltInProperty.SlideCount, 'ext', 'Slides');
map(BuiltInProperty.NoteCount, 'ext', 'Notes');
map(BuiltInProperty.HiddenCount, 'ext', 'HiddenSlides');
map(BuiltInProperty.Manager, 'ext', 'Manager');
map(BuiltInProperty.Company, 'ext', 'Company');

/**
 * Core field keys handled by the built-in properties.
 *
 * @private
 */
export const CORE_FIELD_KEYS: string[] = ['title', 'creator', 'subject', 'description', 'keywords', 'lastModifiedBy', 'revision', 'created', 'modified', 'lastPrinted', 'category'];
/**
 * Extended field keys handled by the built-in properties.
 *
 * @private
 */
export const EXTENDED_FIELD_KEYS: string[] = ['Template', 'Manager', 'Company', 'Pages', 'Words', 'Characters', 'Lines', 'Paragraphs', 'Slides', 'Notes', 'TotalTime', 'HiddenSlides', 'Application', 'DocSecurity'];

/**
 * Built-in document properties (summary and document summary information).
 */
export class BuiltinDocumentProperties {
    private readonly core: FieldMap;
    private readonly ext: FieldMap;
    private readonly mem: FieldMap;
    /**
     * @param {FieldMap} core - The core.
     * @param {FieldMap} ext - The ext.
     * @param {FieldMap} mem - The mem.
     * @private
     */
    constructor(core?: FieldMap, ext?: FieldMap, mem?: FieldMap) {
        this.core = core === undefined ? new FieldMap() : core;
        this.ext = ext === undefined ? new FieldMap() : ext;
        this.mem = mem === undefined ? new FieldMap() : mem;
    }
    /**
     * Gets or sets the title.
     */
    get title(): string { return this.getText(BuiltInProperty.Title); }
    set title(value: string) { this.setText(BuiltInProperty.Title, value); }
    /**
     * Gets or sets the subject.
     */
    get subject(): string { return this.getText(BuiltInProperty.Subject); }
    set subject(value: string) { this.setText(BuiltInProperty.Subject, value); }
    /**
     * Gets or sets the author.
     */
    get author(): string { return this.getText(BuiltInProperty.Author); }
    set author(value: string) { this.setText(BuiltInProperty.Author, value); }
    /**
     * Gets or sets the keywords.
     */
    get keywords(): string { return this.getText(BuiltInProperty.Keywords); }
    set keywords(value: string) { this.setText(BuiltInProperty.Keywords, value); }
    /**
     * Gets or sets the comments.
     */
    get comments(): string { return this.getText(BuiltInProperty.Comments); }
    set comments(value: string) { this.setText(BuiltInProperty.Comments, value); }
    /**
     * Gets or sets the template name.
     */
    get template(): string { return this.getText(BuiltInProperty.Template); }
    set template(value: string) { this.setText(BuiltInProperty.Template, value); }
    /**
     * Gets or sets the last author.
     */
    get lastAuthor(): string { return this.getText(BuiltInProperty.LastAuthor); }
    set lastAuthor(value: string) { this.setText(BuiltInProperty.LastAuthor, value); }
    /**
     * Gets or sets the revision number.
     */
    get revisionNumber(): string { return this.getText(BuiltInProperty.RevisionNumber); }
    set revisionNumber(value: string) { this.setText(BuiltInProperty.RevisionNumber, value); }
    /**
     * Gets or sets the application name.
     */
    get applicationName(): string { return this.getText(BuiltInProperty.ApplicationName); }
    set applicationName(value: string) { this.setText(BuiltInProperty.ApplicationName, value); }
    /**
     * Gets or sets the thumbnail image of the document. The thumbnail is held in memory only.
     */
    get thumbnail(): string { return this.getText(BuiltInProperty.Thumbnail); }
    set thumbnail(value: string) { this.setText(BuiltInProperty.Thumbnail, value); }
    /**
     * Gets or sets the category.
     */
    get category(): string { return this.getText(BuiltInProperty.Category); }
    set category(value: string) { this.setText(BuiltInProperty.Category, value); }
    /**
     * Gets or sets the company.
     */
    get company(): string { return this.getText(BuiltInProperty.Company); }
    set company(value: string) { this.setText(BuiltInProperty.Company, value); }
    /**
     * Gets or sets the manager.
     */
    get manager(): string { return this.getText(BuiltInProperty.Manager); }
    set manager(value: string) { this.setText(BuiltInProperty.Manager, value); }
    /**
     * Gets or sets the total editing time in minutes.
     */
    get totalEditingTime(): number { return this.getInt(BuiltInProperty.TotalEditingTime); }
    set totalEditingTime(value: number) { this.setInt(BuiltInProperty.TotalEditingTime, value); }
    /**
     * Gets or sets the last printed date.
     */
    get lastPrinted(): Date { return this.getDate(BuiltInProperty.LastPrinted); }
    set lastPrinted(value: Date) { this.setDate(BuiltInProperty.LastPrinted, value); }
    /**
     * Gets or sets the creation date.
     */
    get createDate(): Date { return this.getDate(BuiltInProperty.CreateDate); }
    set createDate(value: Date) { this.setDate(BuiltInProperty.CreateDate, value); }
    /**
     * Gets or sets the last save date.
     */
    get lastSaveDate(): Date { return this.getDate(BuiltInProperty.LastSaveDate); }
    set lastSaveDate(value: Date) { this.setDate(BuiltInProperty.LastSaveDate, value); }
    /**
     * Gets or sets the page count.
     */
    get pageCount(): number { return this.getInt(BuiltInProperty.PageCount); }
    set pageCount(value: number) { this.setInt(BuiltInProperty.PageCount, value); }
    /**
     * Gets or sets the word count.
     */
    get wordCount(): number { return this.getInt(BuiltInProperty.WordCount); }
    set wordCount(value: number) { this.setInt(BuiltInProperty.WordCount, value); }
    /**
     * Gets or sets the character count.
     */
    get charCount(): number { return this.getInt(BuiltInProperty.CharCount); }
    set charCount(value: number) { this.setInt(BuiltInProperty.CharCount, value); }
    /**
     * Gets or sets the document security level.
     */
    get docSecurity(): number { return this.getInt(BuiltInProperty.DocSecurity); }
    set docSecurity(value: number) { this.setInt(BuiltInProperty.DocSecurity, value); }
    /**
     * Gets the byte count (read-only; library managed, in memory only).
     */
    get bytesCount(): number { return this.getInt(BuiltInProperty.ByteCount); }
    /**
     * Gets the line count (read-only; library managed).
     */
    get linesCount(): number { return this.getInt(BuiltInProperty.LineCount); }
    /**
     * Gets the paragraph count (read-only; library managed).
     */
    get paragraphCount(): number { return this.getInt(BuiltInProperty.ParagraphCount); }
    /**
     * Gets the slide count.
     */
    get slideCount(): number { return this.getInt(BuiltInProperty.SlideCount); }
    /**
     * Gets the note count.
     */
    get noteCount(): number { return this.getInt(BuiltInProperty.NoteCount); }
    /**
     * Gets the hidden slide count.
     */
    get hiddenCount(): number { return this.getInt(BuiltInProperty.HiddenCount); }
    /**
     * @param {BuiltInProperty} property - The property.
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     *  Sets a library managed statistic (bytes, lines, paragraphs, slides, notes, hidden).
     *
     * @private
     */
    setPropertyValue(property: BuiltInProperty, value: number): void {
        this.setInt(property, value);
    }
    /**
     *  Creates a detached copy of these properties.
     *
     * @returns {BuiltinDocumentProperties} - Returns the BuiltinDocumentProperties.
     */
    clone(): BuiltinDocumentProperties {
        const copy: BuiltinDocumentProperties = new BuiltinDocumentProperties();
        copyFields(this.core, copy.core, CORE_FIELD_KEYS);
        copyFields(this.ext, copy.ext, EXTENDED_FIELD_KEYS);
        copyFields(this.mem, copy.mem, this.mem.keys());
        return copy;
    }
    private storeFor(id: BuiltInProperty): { map: FieldMap; key: string } {
        const m: BuiltinMapping = BUILTIN_MAP.get(id)!;
        return { map: m.store === 'core' ? this.core : m.store === 'ext' ? this.ext : this.mem, key: m.key };
    }
    private getText(id: BuiltInProperty): string {
        const s: { map: FieldMap; key: string; } = this.storeFor(id);
        const v: string = s.map.get(s.key);
        return v === undefined ? '' : v;
    }
    private setText(id: BuiltInProperty, value: string): void {
        if (typeof value !== 'string') {
            throw new DocxError('argument/invalid', 'Property value must be a string.');
        }
        const s: { map: FieldMap; key: string; } = this.storeFor(id);
        s.map.set(s.key, value, BUILTIN_MAP.get(id)!.store === 'mem');
    }
    private getInt(id: BuiltInProperty): number {
        const n: number = parseInt(this.getText(id), 10);
        return isNaN(n) ? 0 : n;
    }
    private setInt(id: BuiltInProperty, value: number): void {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new DocxError('argument/invalid', 'Property value must be a finite number.');
        }
        const s: { map: FieldMap; key: string; } = this.storeFor(id);
        s.map.set(s.key, String(value < 0 ? Math.ceil(value) : Math.floor(value)), BUILTIN_MAP.get(id)!.store === 'mem');
    }
    private getDate(id: BuiltInProperty): Date {
        const text: string = this.getText(id);
        const d: Date = text === '' ? new Date(DEFAULT_DATE_MS) : new Date(text);
        return isNaN(d.getTime()) ? new Date(DEFAULT_DATE_MS) : d;
    }
    private setDate(id: BuiltInProperty, value: Date): void {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new DocxError('argument/invalid', 'Property value must be a valid date.');
        }
        const s: { map: FieldMap; key: string; } = this.storeFor(id);
        s.map.set(s.key, formatDate(value));
    }
}

function copyFields(from: FieldMap, to: FieldMap, keys: string[]): void {
    for (const key of keys) {
        to.set(key, from.get(key), true);
    }
}

/**
 * @private
 */
export const CUSTOM_PROPERTIES_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties';
/**
 * @private
 */
export const VARIANT_TYPES_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';
const CUSTOM_FMTID: string = '{D5CDD505-2E9C-101B-9397-08002B2CF9AE}';

/**
 * User defined (custom) document properties.
 */
export class CustomDocumentProperties {
    private items: DocumentProperty[] = [];
    private dirtyFlag: boolean = false;
    private rootAttributes: ReadonlyArray<OpenXmlAttribute> = [];
    private rootDeclarations: ReadonlyArray<NamespaceDeclaration> = [];
    private rootPrefix: string = '';
    private opaque: OpenXmlElement[] = [];
    private order: Array<DocumentProperty | OpenXmlElement> = [];
    /**
     * Gets the number of custom properties.
     */
    get count(): number {
        return this.items.length;
    }
    /**
     *  Gets a property by name or index; `undefined` when absent.
     *
     * @returns {DocumentProperty | undefined} - Returns the property by name or index; `undefined` when absent.
     * @param {string | number} key - Specifies the key.
     */
    get(key: string | number): DocumentProperty | undefined {
        if (typeof key === 'number') {
            return arrayItem(this.items, key);
        }
        for (const item of this.items) {
            if (item.name === key) {
                return item;
            }
        }
        return undefined;
    }
    /**
     * Adds a property, or updates the value of an existing property with the same name.
     *
     * @returns {DocumentProperty} - Returns the DocumentProperty.
     * @param {string} name - Specifies the name.
     * @param {DocumentPropertyValue} value - Specifies the value.
     * @param {PropertyValueType} type - Specifies the type.
     */
    add(name: string, value: DocumentPropertyValue, type?: PropertyValueType): DocumentProperty {
        if (typeof name !== 'string' || name.length === 0) {
            throw new DocxError('argument/invalid', 'Custom property name must be a non-empty string.');
        }
        const existing: DocumentProperty = this.get(name);
        if (existing !== undefined) {
            if (type !== undefined) {
                checkValue(value, type);
                this.replace(existing, new DocumentProperty(name, value, type, () => this.markDirty()));
                return this.get(name) as DocumentProperty;
            }
            existing.value = value;
            return existing;
        }
        const created: DocumentProperty = new DocumentProperty(name, value, type, () => this.markDirty());
        this.items.push(created);
        this.order.push(created);
        this.dirtyFlag = true;
        return created;
    }
    /**
     *  Removes the property with the given name, if present.
     *
     * @returns {void}
     * @param {string} name - Specifies the name.
     */
    remove(name: string): void {
        const existing: DocumentProperty = this.get(name);
        if (existing === undefined) {
            return;
        }
        this.items.splice(this.items.indexOf(existing), 1);
        this.order.splice(this.order.indexOf(existing), 1);
        this.dirtyFlag = true;
    }
    /**
     *  Creates a detached copy of the collection.
     *
     * @returns {CustomDocumentProperties} - Returns the CustomDocumentProperties.
     */
    clone(): CustomDocumentProperties {
        const copy: CustomDocumentProperties = new CustomDocumentProperties();
        for (const item of this.items) {
            const c: DocumentProperty = new DocumentProperty(item.name, cloneValue(item.value), item.valueType, () => copy.markDirty());
            c.pid = item.pid;
            copy.items.push(c);
            copy.order.push(c);
        }
        return copy;
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    isDirty(): boolean {
        return this.dirtyFlag;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    markClean(): void {
        this.dirtyFlag = false;
    }
    /**
     *  @private
     *
     * @returns {boolean} The result.
     */
    hasContent(): boolean {
        return this.order.length > 0;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    markDirty(): void {
        this.dirtyFlag = true;
    }
    private replace(old: DocumentProperty, next: DocumentProperty): void {
        next.pid = old.pid;
        this.items[this.items.indexOf(old)] = next;
        this.order[this.order.indexOf(old)] = next;
        this.dirtyFlag = true;
    }
    /**
     *  @private
     *
     * @param {OpenXmlElement} root - The root.
     * @returns {CustomDocumentProperties} The result.
     */
    static fromXml(root: OpenXmlElement): CustomDocumentProperties {
        const result: CustomDocumentProperties = new CustomDocumentProperties();
        result.rootAttributes = root.attributes;
        result.rootDeclarations = root.namespaceDeclarations;
        result.rootPrefix = root.prefix;
        for (const child of root.children) {
            if (child.kind !== 'element') {
                continue;
            }
            const parsed: DocumentProperty = child.localName === 'property' && child.namespaceUri === CUSTOM_PROPERTIES_NAMESPACE
                ? parseProperty(child, result)
                : undefined;
            if (parsed === undefined) {
                result.order.push(child);
            } else {
                result.items.push(parsed);
                result.order.push(parsed);
            }
        }
        return result;
    }
    /**
     *  @private
     *
     * @returns {OpenXmlElement} The result.
     */
    toXml(): OpenXmlElement {
        let pid: number = 1;
        for (const item of this.items) {
            if (item.pid !== undefined && item.pid > pid) {
                pid = item.pid;
            }
        }
        const children: OpenXmlElement[] = [];
        for (const entry of this.order) {
            if (entry instanceof DocumentProperty) {
                if (entry.pid === undefined) {
                    pid += 1;
                    entry.pid = pid;
                }
                children.push(propertyElement(entry, this.rootPrefix));
            } else {
                children.push(entry);
            }
        }
        const decls: NamespaceDeclaration[] = this.rootDeclarations.slice();
        let hasVt: boolean = false;
        for (const d of decls) {
            if (d.prefix === 'vt') {
                hasVt = true;
            }
        }
        if (!hasVt) {
            decls.push({ prefix: 'vt', namespaceUri: VARIANT_TYPES_NAMESPACE });
        }
        if (decls.length === 1 && this.rootDeclarations.length === 0) {
            decls.unshift({ prefix: '', namespaceUri: CUSTOM_PROPERTIES_NAMESPACE });
        }
        return {
            kind: 'element',
            namespaceUri: CUSTOM_PROPERTIES_NAMESPACE,
            localName: 'Properties',
            prefix: this.rootPrefix,
            attributes: this.rootAttributes,
            namespaceDeclarations: decls,
            children
        };
    }
}

function textOf(el: OpenXmlElement): string {
    let out: string = '';
    for (const c of el.children) {
        if (c.kind === 'text') {
            out += c.value;
        }
    }
    return out;
}

function parseProperty(el: OpenXmlElement, owner: CustomDocumentProperties): DocumentProperty | undefined {
    let name: string | undefined;
    let pid: number | undefined;
    for (const a of el.attributes) {
        if (a.localName === 'name') {
            name = a.value;
        } else if (a.localName === 'pid') {
            pid = parseInt(a.value, 10);
        } else if (a.localName === 'linkTarget') {
            return undefined;
        }
    }
    const valueEl: OpenXmlElement = el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element')[0];
    if (name === undefined || valueEl === undefined || valueEl.namespaceUri !== VARIANT_TYPES_NAMESPACE) {
        return undefined;
    }
    const parsed: { value: DocumentPropertyValue; type: PropertyValueType; } = parseVariant(valueEl.localName, textOf(valueEl));
    if (parsed === undefined || owner.get(name) !== undefined) {
        return undefined;
    }
    const property: DocumentProperty = new DocumentProperty(name, parsed.value, parsed.type, () => owner.markDirty());
    property.pid = pid === undefined || isNaN(pid) ? undefined : pid;
    return property;
}

function parseVariant(local: string, text: string): { value: DocumentPropertyValue; type: PropertyValueType } | undefined {
    const t: string = text.trim();
    switch (local) {
    case 'lpwstr':
    case 'lpstr':
        return { value: text, type: PropertyValueType.String };
    case 'bool':
        return { value: t === 'true' || t === '1', type: PropertyValueType.Boolean };
    case 'i1': case 'i2': case 'i4': case 'int': case 'ui1': case 'ui2': case 'ui4': case 'uint': {
        const n: number = parseInt(t, 10);
        return isNaN(n) || n > INT32_MAX || n < INT32_MIN ? undefined : { value: n, type: PropertyValueType.Int };
    }
    case 'r4': case 'r8': {
        const n: number = parseFloat(t);
        return isNaN(n) ? undefined : { value: n, type: local === 'r4' ? PropertyValueType.Float : PropertyValueType.Double };
    }
    case 'filetime': case 'date': {
        const d: Date = new Date(t);
        return isNaN(d.getTime()) ? undefined : { value: d, type: PropertyValueType.Date };
    }
    case 'blob':
        return { value: decodeBase64(t.replace(/\s+/g, '')), type: PropertyValueType.ByteArray };
    default:
        return undefined;
    }
}

function propertyElement(property: DocumentProperty, rootPrefix: string): OpenXmlElement {
    let local: string;
    let text: string;
    switch (property.valueType) {
    case PropertyValueType.Boolean: local = 'bool'; text = property.toBool() ? 'true' : 'false'; break;
    case PropertyValueType.Date: local = 'filetime'; text = formatDate(property.toDateTime()); break;
    case PropertyValueType.Float: local = 'r4'; text = String(property.toFloat()); break;
    case PropertyValueType.Double: local = 'r8'; text = String(property.toDouble()); break;
    case PropertyValueType.Int: local = 'i4'; text = String(property.toInt()); break;
    case PropertyValueType.ByteArray: local = 'blob'; text = encodeBase64(property.toByteArray()); break;
    default: local = 'lpwstr'; text = property.toString(); break;
    }
    const value: OpenXmlElement = {
        kind: 'element',
        namespaceUri: VARIANT_TYPES_NAMESPACE,
        localName: local,
        prefix: 'vt',
        attributes: [],
        namespaceDeclarations: [],
        children: [{ kind: 'text', value: text }]
    };
    const attr: (localName: string, v: string) => OpenXmlAttribute = (localName: string, v: string): OpenXmlAttribute => ({ namespaceUri: '', localName, prefix: '', value: v });
    return {
        kind: 'element',
        namespaceUri: CUSTOM_PROPERTIES_NAMESPACE,
        localName: 'property',
        prefix: rootPrefix,
        attributes: [attr('fmtid', CUSTOM_FMTID), attr('pid', String(property.pid)), attr('name', property.name)],
        namespaceDeclarations: [],
        children: [value]
    };
}
