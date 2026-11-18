/**
 * Append-only shared string table (M1.1).
 *
 * Plain-text dedup reuses the first matching plain index. Rich entries are never
 * merged with plain text. Existing indexes are never renumbered or removed.
 *
 * Citations: `docs/specs/shared-strings.md`, ECMA-376-1 §18.4.
 *
 * @private
 */

import { InvalidSharedStringIndexError, PackageLimitError } from '../core/errors';
import { joinRunText, parseRichRunsFromSiXml, serializeRichSiXml, RichTextRun } from './rich-text-xml';
import { DEFAULT_MAX_SHARED_STRING_ENTRIES, parseSstXml, serializeSstXml, SstEntryXml } from './sst-xml';

export { SstEntryXml };
export { RichTextRun };

/**
 * In-memory shared string table.
 */
export class SharedStringTable {
    private readonly entries: SstEntryXml[];
    /** Plain text → first index (plain entries only). */
    private readonly plainIndex: Map<string, number> = new Map<string, number>();
    /** `sst/@count` semantics: total string cell references when known. */
    private referenceCount: number;
    private readonly preserveChildrenXml: string[];
    private readonly rootExtraAttrsXml: string;
    private _dirty: boolean;
    /** True when a sharedStrings part was present on open (even if empty). */
    private readonly hadPart: boolean;
    private readonly partName: string | undefined;
    private readonly maxEntries: number;

    /**
     * Creates an instance.
     *
     * @param {any} options - The options parameter.
     * @param {*} [options.entries] - Optional entries field.
     * @param {*} [options.referenceCount] - Optional referenceCount field.
     * @param {*} [options.preserveChildrenXml] - Optional preserveChildrenXml field.
     * @param {*} [options.rootExtraAttrsXml] - Optional rootExtraAttrsXml field.
     * @param {*} [options.dirty] - Optional dirty field.
     * @param {*} [options.hadPart] - Optional hadPart field.
     * @param {string} [options.partName] - Optional OPC part name.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     */
    private constructor(options: {
        readonly entries: SstEntryXml[];
        readonly referenceCount: number;
        readonly preserveChildrenXml: ReadonlyArray<string>;
        readonly rootExtraAttrsXml: string;
        readonly dirty: boolean;
        readonly hadPart: boolean;
        readonly partName: string | undefined;
        readonly maxEntries: number;
    }) {
        this.entries = [...options.entries];
        this.referenceCount = options.referenceCount;
        this.preserveChildrenXml = [...options.preserveChildrenXml];
        this.rootExtraAttrsXml = options.rootExtraAttrsXml;
        this._dirty = options.dirty;
        this.hadPart = options.hadPart;
        this.partName = options.partName;
        this.maxEntries = options.maxEntries;
        this.rebuildPlainMap();
    }

    /**
     * Empty table (no part on disk yet).
     *
     * @param {Object} options - The options parameter.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @param {string} [options.partName] - Optional OPC part name.
     * @returns {SharedStringTable} - Returns the result.
     */
    public static empty(options?: { readonly maxEntries?: number; readonly partName?: string }): SharedStringTable {
        return new SharedStringTable({
            entries: [],
            referenceCount: 0,
            preserveChildrenXml: [],
            rootExtraAttrsXml: '',
            dirty: false,
            hadPart: false,
            partName: options == null ? undefined : options.partName,
            maxEntries: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_SHARED_STRING_ENTRIES))(
                options == null ? undefined : options.maxEntries
            )
        });
    }

    /**
     * Load from part bytes. Missing part should use {@link empty} instead.
     *
     * @param {Uint8Array} bytes - The bytes parameter.
     * @param {string} partName - The partName parameter.
     * @param {Object} options - The options parameter.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @returns {SharedStringTable} - Returns the result.
     */
    public static fromPartBytes(bytes: Uint8Array, partName: string, options?: { readonly maxEntries?: number }): SharedStringTable {
        const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_SHARED_STRING_ENTRIES))(
            options == null ? undefined : options.maxEntries
        );
        const model: any = parseSstXml(bytes, partName, { maxEntries });
        const referenceCount: number =
            model.count !== undefined ? model.count : model.uniqueCount !== undefined ? model.uniqueCount : model.entries.length;
        return new SharedStringTable({
            entries: [...model.entries],
            referenceCount,
            preserveChildrenXml: model.preserveChildrenXml,
            rootExtraAttrsXml: model.rootExtraAttrsXml,
            dirty: false,
            hadPart: true,
            partName,
            maxEntries
        });
    }

    /**
     * Number of `si` entries (`uniqueCount`).
     *
     * @returns {number} - Returns the result.
     */
    public get length(): number {
        return this.entries.length;
    }

    /**
     * Whether the table should be written on save.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDirty(): boolean {
        return this._dirty;
    }

    /**
     * Whether a sharedStrings part existed when the workbook was opened.
     *
     * @returns {boolean} - Returns the result.
     */
    public get hadSharedStringsPart(): boolean {
        return this.hadPart;
    }

    /**
     * Part name when known (loaded or assigned for create).
     *
     * @returns {string} - Returns the result.
     */
    public get sharedStringsPartName(): string | undefined {
        return this.partName;
    }

    /**
     * True when save should emit the part (had part, dirty with entries, or dirty empty preserve).
     *
     * @returns {boolean} - Returns the result.
     */
    public shouldWritePart(): boolean {
        if (this.hadPart) {
            return true;
        }
        return this._dirty && this.entries.length > 0;
    }

    /**
     * Resolve index → plain text (rich entries use joined run text).
     *
     * @param {number} index - The index parameter.
     * @returns {string} - Returns the result.
     */
    public getPlainText(index: number): string {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidSharedStringIndexError(
                `Shared string index ${index} is out of range (length ${this.entries.length})`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: SstEntryXml = this.entries[index];
        if (entry === undefined) {
            throw new InvalidSharedStringIndexError(
                `Shared string index ${index} is missing`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        return entry.kind === 'plain' ? entry.text : entry.plainFallback;
    }

    /**
     * First plain-entry index for `text`, if any. Rich entries are not considered.
     *
     * @param {string} text - The text parameter.
     * @returns {number} - Returns the result.
     */
    public indexOfPlainText(text: string): number | undefined {
        return this.plainIndex.get(text);
    }

    /**
     * Reuse existing plain index or append a new plain entry. Never renumbers.
     *
     * @param {string} text - The text parameter.
     * @returns {number} - Returns the result.
     */
    public appendPlainText(text: string): number {
        const existing: number = this.plainIndex.get(text);
        if (existing !== undefined) {
            return existing;
        }
        if (this.entries.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Shared string table exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        const index: number = this.entries.length;
        this.entries.push({ kind: 'plain', text, xmlPreserve: undefined });
        this.plainIndex.set(text, index);
        this._dirty = true;
        return index;
    }

    /**
     * Always append a rich `si` entry (never plain-dedup, never renumber). Citations: `docs/specs/rich-text.md`; ECMA-376-1 §18.4.
     *
     * @param {Object} runs - The runs parameter.
     * @returns {number} - Returns the result.
     */
    public appendRichRuns(runs: ReadonlyArray<RichTextRun>): number {
        if (this.entries.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Shared string table exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        const plainFallback: string = joinRunText(runs);
        const xmlPreserve: string = serializeRichSiXml(runs);
        const index: number = this.entries.length;
        this.entries.push({
            kind: 'rich',
            plainFallback,
            xmlPreserve
        });
        this._dirty = true;
        return index;
    }

    /**
     * Resolve index → structured runs. Plain entries become a single unformatted run. Citations: `docs/specs/rich-text.md`; ECMA-376-1 §18.4.
     *
     * @param {number} index - The index parameter.
     * @returns {RichTextRun[]} - Returns the result.
     */
    public getRichRuns(index: number): RichTextRun[] {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidSharedStringIndexError(
                `Shared string index ${index} is out of range (length ${this.entries.length})`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: SstEntryXml = this.entries[index];
        if (entry === undefined) {
            throw new InvalidSharedStringIndexError(
                `Shared string index ${index} is missing`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        if (entry.kind === 'plain') {
            return [{ text: entry.text }];
        }
        return parseRichRunsFromSiXml(entry.xmlPreserve);
    }

    /**
     * Bump total reference count (cell writes in TASK-1105). M1.1 tests may call via workbook.
     *
     * @param {number} delta - The delta parameter.
     * @returns {void} - Returns the result.
     */
    public addReferences(delta: number): void {
        if (delta === 0) {
            return;
        }
        this.referenceCount = Math.max(0, this.referenceCount + delta);
        this._dirty = true;
    }

    /**
     * Serialize to part bytes. `count` / `uniqueCount` recomputed per schema semantics.
     *
     * @returns {Uint8Array} - Returns the result.
     */
    public toPartBytes(): Uint8Array {
        const uniqueCount: number = this.entries.length;
        const count: number = Math.max(this.referenceCount, uniqueCount);
        return serializeSstXml(
            {
                entries: this.entries,
                count,
                uniqueCount,
                preserveChildrenXml: this.preserveChildrenXml,
                rootExtraAttrsXml: this.rootExtraAttrsXml
            },
            { maxEntries: this.maxEntries }
        );
    }

    /**
     * Snapshot of entry kinds for tests.
     *
     * @param {number} index - The index parameter.
     * @returns {Object} - Returns the result.
     */
    public entryKindAt(index: number): 'plain' | 'rich' {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const e: SstEntryXml = this.entries[index];
        if (e === undefined) {
            throw new InvalidSharedStringIndexError(`Shared string index ${index} is out of range`);
        }
        return e.kind;
    }

    /**
     * rebuildPlainMap method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildPlainMap(): void {
        this.plainIndex.clear();
        for (let i: number = 0; i < this.entries.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: SstEntryXml = this.entries[i];
            if (e !== undefined && e.kind === 'plain' && !this.plainIndex.has(e.text)) {
                this.plainIndex.set(e.text, i);
            }
        }
    }
}
