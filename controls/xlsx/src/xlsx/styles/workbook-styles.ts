/**
 * Workbook styles table handle (M1.2).
 *
 * Parse/serialize `xl/styles.xml`, baseline on first dirty write, preserve
 * collection order and indexes. Public cell authoring is
 * {@link Cell.style} / {@link Cell.numberFormat}; conditional-formatting
 * differentials use `ConditionalFormat.format`. The `add*` / `ensure*`
 * factories, table getters, counters, and part-state properties are
 * `@private` (stripped from the shipped `.d.ts`).
 *
 * Citations: `docs/specs/styles-table.md`, ECMA-376-1 §12.3.20 / §18.8.
 */

import { InvalidNumberFormatError, InvalidStyleIndexError, PackageLimitError } from '../core/errors';
import {
    cellBorderFromInput,
    borderMatchKey,
    buildBaselineCellBorders,
    buildBaselineCellXfEntries,
    buildBaselineFillEntries,
    buildBaselineFontEntries,
    buildBaselineStylesCollections,
    cellXfEntryFromResolved,
    cellXfMatchKey,
    collectionItemXmls,
    DEFAULT_MAX_STYLE_ENTRIES,
    dxfEntryFromInput,
    dxfEntryToView,
    dxfMatchKey,
    fillEntryFromInput,
    fillMatchKey,
    fontEntryFromInput,
    fontMatchKey,
    parseBordersCollection,
    parseCellXfsCollection,
    parseDxfsCollection,
    parseFillsCollection,
    parseFontsCollection,
    parseNumFmtsCollection,
    parseStylesXml,
    serializeBordersCollection,
    serializeCellXfsCollection,
    serializeDxfsCollection,
    serializeFillsCollection,
    serializeFontsCollection,
    serializeNumFmtsCollection,
    serializeStylesXml,
    serializeXfElement,
    Alignment,
    Color,
    CellBorder,
    Border,
    CellStyle,
    CellXfEntry,
    CellFormat,
    DifferentialFormatInput,
    DifferentialFormatView,
    DxfEntry,
    FillEntry,
    Fill,
    FontEntry,
    Font,
    NumFmtEntry,
    Protection,
    StylesCollectionXml,
    StylesXmlModel,
    allocateNextCustomNumFmtId,
    getBuiltinFormatCode,
    stripFormatLocalePrefix
} from './styles-xml';
import {
    ColorResolutionContext,
    defaultThemeColorScheme,
    parseIndexedColorOverrides,
    parseThemeColorScheme,
    resolveColorToRgb,
    ThemeColorScheme
} from './color-resolve';

export {
    Alignment,
    Border,
    CellStyle,
    CellFormat,
    DifferentialFormatInput,
    DifferentialFormatView,
    FillEntry,
    Fill,
    Font,
    NumFmtEntry,
    Protection
};
export {
    BorderEdge,
    Color,
    DifferentialNumFmtInput,
    PatternType,
    UnderlineValue,
    FontSchemeValue,
    HorizontalAlignment,
    VerticalAlignment
} from './styles-xml';

/**
 * Manages the styles available in a workbook, letting you look up and reuse
 * its number formats, fonts, fills, borders, and cell formats.
 *
 * @private
 */
export class WorkbookStyles {
    private collections: StylesCollectionXml[];
    private unknownChildrenXml: string[];
    private rootExtraAttrsXml: string;
    private _dirty: boolean;
    /** True when a styles part was present on open (even if empty). */
    private readonly hadPart: boolean;
    private partName: string | undefined;
    private readonly maxEntries: number;
    private baselineEnsured: boolean;
    /**
     * Ordered custom/loaded `numFmt` rows. Built-in ids 0–163 are not authored as
     * rows by the library (may still appear if present on disk — preserved).
     */
    private numFmts: NumFmtEntry[];
    /** Exact `formatCode` → first matching `numFmtId` for ensure reuse. */
    private formatCodeIndex: Map<string, number>;
    /** Ordered font rows (positional indexes). */
    private fonts: FontEntry[];
    /** Exact-match key → first font index. */
    private fontKeyIndex: Map<string, number>;
    /** Ordered fill rows (positional; 0=none, 1=gray125 reserved when baseline). */
    private fills: FillEntry[];
    /** Exact-match key → first fill index. */
    private fillKeyIndex: Map<string, number>;
    /** Ordered border rows (positional indexes). */
    private borders: CellBorder[];
    /** Exact-match key → first border index. */
    private borderKeyIndex: Map<string, number>;
    /** Ordered cellXfs xf rows (positional indexes → `c@s`). */
    private cellXfs: CellXfEntry[];
    /** Exact-match key → first cellXf index. */
    private cellXfKeyIndex: Map<string, number>;
    /** Ordered dxf rows (positional indexes → `cfRule/@dxfId`). */
    private dxfs: DxfEntry[];
    /**
     * Theme + indexed palette used only to compute {@link Color.rgbColor}.
     * Never written back. Defaults to the Office scheme until a theme part
     * is bound.
     */
    private colorContext: ColorResolutionContext;
    /** Exact-match key → first dxf index. */
    private dxfKeyIndex: Map<string, number>;

    /**
     * Creates an instance.
     *
     * @param {any} options - The options parameter.
     * @param {*} [options.collections] - Optional collections field.
     * @param {*} [options.unknownChildrenXml] - Optional unknownChildrenXml field.
     * @param {*} [options.rootExtraAttrsXml] - Optional rootExtraAttrsXml field.
     * @param {*} [options.dirty] - Optional dirty field.
     * @param {*} [options.hadPart] - Optional hadPart field.
     * @param {string} [options.partName] - Optional OPC part name.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @param {*} [options.baselineEnsured] - Optional baselineEnsured field.
     * @param {*} [options.numFmts] - Optional numFmts field.
     * @param {*} [options.fonts] - Optional fonts field.
     * @param {*} [options.fills] - Optional fills field.
     * @param {*} [options.borders] - Optional borders field.
     * @param {*} [options.cellXfs] - Optional cellXfs field.
     * @param {*} [options.dxfs] - Optional dxfs field.
     */
    private constructor(options: {
        readonly collections: ReadonlyArray<StylesCollectionXml>;
        readonly unknownChildrenXml: ReadonlyArray<string>;
        readonly rootExtraAttrsXml: string;
        readonly dirty: boolean;
        readonly hadPart: boolean;
        readonly partName: string | undefined;
        readonly maxEntries: number;
        readonly baselineEnsured: boolean;
        readonly colorContext?: ColorResolutionContext;
        readonly numFmts: ReadonlyArray<NumFmtEntry>;
        readonly fonts: ReadonlyArray<FontEntry>;
        readonly fills: ReadonlyArray<FillEntry>;
        readonly borders: ReadonlyArray<CellBorder>;
        readonly cellXfs: ReadonlyArray<CellXfEntry>;
        readonly dxfs: ReadonlyArray<DxfEntry>;
    }) {
        this.collections = [...options.collections];
        this.unknownChildrenXml = [...options.unknownChildrenXml];
        this.rootExtraAttrsXml = options.rootExtraAttrsXml;
        this._dirty = options.dirty;
        this.hadPart = options.hadPart;
        this.partName = options.partName;
        this.maxEntries = options.maxEntries;
        this.baselineEnsured = options.baselineEnsured;
        this.numFmts = [...options.numFmts];
        this.formatCodeIndex = new Map();
        this.fonts = [...options.fonts];
        this.fontKeyIndex = new Map();
        this.fills = [...options.fills];
        this.fillKeyIndex = new Map();
        this.borders = [...options.borders];
        this.borderKeyIndex = new Map();
        this.cellXfs = [...options.cellXfs];
        this.cellXfKeyIndex = new Map();
        this.colorContext = options.colorContext !== undefined
            ? options.colorContext
            : {
                theme: defaultThemeColorScheme(),
                indexedRgb: indexedOverridesFromCollections(options.collections)
            };
        this.dxfs = [...options.dxfs];
        this.dxfKeyIndex = new Map();
        this.rebuildFormatCodeIndex();
        this.rebuildFontKeyIndex();
        this.rebuildFillKeyIndex();
        this.rebuildBorderKeyIndex();
        this.rebuildCellXfKeyIndex();
        this.rebuildDxfKeyIndex();
    }

    /**
     * Empty styles (no part on disk yet).
     *
     * @param {Object} options - The options parameter.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @param {string} [options.partName] - Optional OPC part name.
     * @returns {WorkbookStyles} - Returns the result.
     */
    public static empty(options?: { readonly maxEntries?: number; readonly partName?: string }): WorkbookStyles {
        return new WorkbookStyles({
            collections: [],
            unknownChildrenXml: [],
            rootExtraAttrsXml: '',
            dirty: false,
            hadPart: false,
            partName: options == null ? undefined : options.partName,
            maxEntries: ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_STYLE_ENTRIES))(
                options == null ? undefined : options.maxEntries
            ),
            baselineEnsured: false,
            numFmts: [],
            fonts: [],
            fills: [],
            borders: [],
            cellXfs: [],
            dxfs: []
        });
    }

    /**
     * Load from part bytes. Missing part should use {@link empty} instead.
     *
     * @param {Uint8Array} bytes - The bytes parameter.
     * @param {string} partName - The partName parameter.
     * @param {Object} options - The options parameter.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @returns {WorkbookStyles} - Returns the result.
     */
    public static fromPartBytes(bytes: Uint8Array, partName: string, options?: { readonly maxEntries?: number }): WorkbookStyles {
        const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_STYLE_ENTRIES))(
            options == null ? undefined : options.maxEntries
        );
        const model: StylesXmlModel = parseStylesXml(bytes, partName, { maxEntries });
        return WorkbookStyles.fromModel(model, {
            partName,
            maxEntries,
            hadPart: true,
            dirty: false
        });
    }

    /**
     * fromModel method.
     *
     * @param {StylesXmlModel} model - The model parameter.
     * @param {any} options - The options parameter.
     * @param {string} [options.partName] - Optional OPC part name.
     * @param {*} [options.maxEntries] - Optional maxEntries field.
     * @param {*} [options.hadPart] - Optional hadPart field.
     * @param {*} [options.dirty] - Optional dirty field.
     * @returns {WorkbookStyles} - Returns the result.
     */
    public static fromModel(
        model: StylesXmlModel,
        options: {
            readonly partName: string | undefined;
            readonly maxEntries?: number;
            readonly hadPart: boolean;
            readonly dirty: boolean;
        }
    ): WorkbookStyles {
        const findXml: (name: string) => string =
            /**
             * findXml function.
             *
             * @param {string} name - The name parameter.
             * @returns {string} - Returns the result.
             */
            (name: string): string | undefined =>
                ((__t: StylesCollectionXml): string => (__t == null ? undefined : __t.xml))(
                    model.collections.find((c: StylesCollectionXml): boolean => c.name === name)
                );

        const numFmtsXml: string = findXml('numFmts');
        const numFmts: NumFmtEntry[] = numFmtsXml !== undefined && numFmtsXml.trim().length > 0 ? parseNumFmtsCollection(numFmtsXml) : [];

        const fontsXml: string = findXml('fonts');
        const fonts: FontEntry[] = fontsXml !== undefined && fontsXml.trim().length > 0 ? parseFontsCollection(fontsXml) : [];

        const fillsXml: string = findXml('fills');
        const fills: FillEntry[] = fillsXml !== undefined && fillsXml.trim().length > 0 ? parseFillsCollection(fillsXml) : [];

        const bordersXml: string = findXml('borders');
        const borders: CellBorder[] = bordersXml !== undefined && bordersXml.trim().length > 0 ? parseBordersCollection(bordersXml) : [];

        const cellXfsXml: string = findXml('cellXfs');
        const cellXfs: CellXfEntry[] = cellXfsXml !== undefined && cellXfsXml.trim().length > 0 ? parseCellXfsCollection(cellXfsXml) : [];

        const dxfsXml: string = findXml('dxfs');
        const dxfs: DxfEntry[] = dxfsXml !== undefined && dxfsXml.trim().length > 0 ? parseDxfsCollection(dxfsXml) : [];

        return new WorkbookStyles({
            collections: model.collections,
            unknownChildrenXml: model.unknownChildrenXml,
            rootExtraAttrsXml: model.rootExtraAttrsXml,
            dirty: options.dirty,
            hadPart: options.hadPart,
            partName: options.partName,
            maxEntries: options.maxEntries != null ? options.maxEntries : DEFAULT_MAX_STYLE_ENTRIES,
            baselineEnsured: model.collections.length > 0,
            numFmts,
            fonts,
            fills,
            borders,
            cellXfs,
            dxfs
        });
    }

    /**
     * Gets cellXfCount.
     *
     * @returns {number} - Returns the result.
     */
    public get cellXfCount(): number {
        return this.cellXfs.length;
    }

    /**
     * Gets isDirty.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDirty(): boolean {
        return this._dirty;
    }

    /**
     * Gets hadStylesPart.
     *
     * @returns {boolean} - Returns the result.
     */
    public get hadStylesPart(): boolean {
        return this.hadPart;
    }

    /**
     * Gets stylesPartName.
     *
     * @returns {string} - Returns the result.
     */
    public get stylesPartName(): string | undefined {
        return this.partName;
    }

    /**
     * shouldWritePart method.
     *
     * @returns {boolean} - Returns the result.
     */
    public shouldWritePart(): boolean {
        // Per ECMA-376-1 §12.3.20: styles.xml is mandatory in every workbook.
        // Always write, even for brand-new empty workbooks that haven't been modified.
        return true;
    }

    /**
     * getCellXf method.
     *
     * @param {number} index - The index parameter.
     * @returns {CellFormat} - Returns the result.
     */
    public getCellXf(index: number): CellFormat {
        if (!Number.isInteger(index) || index < 0 || index >= this.cellXfs.length) {
            throw new InvalidStyleIndexError(
                `Style index ${index} is out of range (cellXfs length ${this.cellXfs.length})`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: CellXfEntry = this.cellXfs[index];
        if (entry === undefined) {
            throw new InvalidStyleIndexError(
                `Style index ${index} is missing`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        return this.cellXfEntryToFormat(entry);
    }

    /**
     * Gets numFmtCount.
     *
     * @returns {number} - Returns the result.
     */
    public get numFmtCount(): number {
        return this.numFmts.length;
    }

    /**
     * Snapshot of a stored `numFmt` row by table order (not by `numFmtId`).
     *
     * @param {number} index - The index parameter.
     * @returns {*} - Returns the result.
     */
    public getNumFmtAt(index: number): NumFmtEntry | undefined {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        return this.numFmts[index];
    }

    /**
     * Lookup `formatCode` for a `numFmtId`, with locale prefix tokens stripped.
     *
     * Resolution order:
     * 1. Package / library `numFmts` rows (custom ≥164, or any built-in row that
     *    was present on disk and preserved) — first matching row wins.
     * 2. Excel/XlsIO en-US implied built-in table for ids that are not authored
     *    as `numFmt` elements (e.g. id 14 → `m/d/yyyy`).
     *
     * Built-in fallback is read-only: it never appends rows to `numFmts` and
     * never dirties the styles part. Locale-only built-ins not listed in the
     * language-neutral table remain `undefined` until a package row exists.
     *
     * @param {number} numFmtId - The numFmtId parameter.
     * @returns {string | undefined} - Returns the result.
     */
    public getFormatCode(numFmtId: number): string | undefined {
        for (const e of this.numFmts) {
            if (e.numFmtId === numFmtId) {
                return stripFormatLocalePrefix(e.formatCode);
            }
        }
        const builtin: string = getBuiltinFormatCode(numFmtId);
        return builtin !== undefined ? stripFormatLocalePrefix(builtin) : undefined;
    }

    /**
     * Gets fontCount.
     *
     * @returns {number} - Returns the result.
     */
    public get fontCount(): number {
        return this.fonts.length;
    }

    /**
     * Snapshot of `fonts[index]`.
     *
     * @param {number} index - The index parameter.
     * @returns {*} - Returns the result.
     */
    public getFontAt(index: number): FontEntry | undefined {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        return this.fonts[index];
    }

    /**
     * Gets fillCount.
     *
     * @returns {number} - Returns the result.
     */
    public get fillCount(): number {
        return this.fills.length;
    }

    /**
     * Snapshot of `fills[index]`.
     *
     * @param {number} index - The index parameter.
     * @returns {*} - Returns the result.
     */
    public getFillAt(index: number): FillEntry | undefined {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        return this.fills[index];
    }

    /**
     * Gets borderCount.
     *
     * @returns {number} - Returns the result.
     */
    public get borderCount(): number {
        return this.borders.length;
    }

    /**
     * Gets dxfCount.
     *
     * @returns {number} - Returns the result.
     */
    public get dxfCount(): number {
        return this.dxfs.length;
    }

    /**
     * Snapshot of `dxfs[index]`.
     *
     * @param {number} index - The index parameter.
     * @returns {*} - Returns the result.
     */
    public getDxfAt(index: number): DxfEntry | undefined {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        return this.dxfs[index];
    }

    /**
     * getDifferentialFormat method.
     *
     * @param {number} index - The index parameter.
     * @returns {DifferentialFormatView} - Returns the result.
     */
    public getDifferentialFormat(index: number): DifferentialFormatView {
        if (!Number.isInteger(index) || index < 0 || index >= this.dxfs.length) {
            throw new InvalidStyleIndexError(
                `Differential format index ${index} is out of range (dxfs length ${this.dxfs.length})`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const entry: DxfEntry = this.dxfs[index];
        if (entry === undefined) {
            throw new InvalidStyleIndexError(
                `Differential format index ${index} is missing`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        return dxfEntryToView(entry);
    }

    /**
     * Snapshot of `borders[index]`.
     *
     * @param {number} index - The index parameter.
     * @returns {*} - Returns the result.
     */
    public getBorderAt(index: number): CellBorder | undefined {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        return this.borders[index];
    }

    /**
     * Ensure a custom number format row exists for `formatCode`. - Empty / whitespace-only codes throw {@link InvalidNumberFormatError}. - Exact `formatCode` match reuses the existing `numFmtId` (no renumber). - New codes append with `numFmtId = max(existing, 163) + 1` (≥ 164). - Does not emit built-in 0–163 rows. Citations: ECMA-376-1 §18.8.31; `CT_NumFmt` in transitional sml.xsd.
     *
     * @param {string} formatCode - The formatCode parameter.
     * @returns {number} - Returns the result.
     */
    public ensureCustomNumberFormat(formatCode: string): number {
        if (typeof formatCode !== 'string' || formatCode.length === 0) {
            throw new InvalidNumberFormatError(
                'Custom number formatCode must be a non-empty string',
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }
        if (formatCode.trim().length === 0) {
            throw new InvalidNumberFormatError(
                'Custom number formatCode must not be empty or whitespace-only',
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const existing: number = this.formatCodeIndex.get(formatCode);
        if (existing !== undefined) {
            return existing;
        }

        if (this.numFmts.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "numFmts" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        this.ensureBaseline();
        const numFmtId: number = allocateNextCustomNumFmtId(this.numFmts.map((e: NumFmtEntry): number => e.numFmtId));
        const entry: NumFmtEntry = { numFmtId, formatCode };
        this.numFmts.push(entry);
        this.formatCodeIndex.set(formatCode, numFmtId);
        this.syncNumFmtsCollection();
        this._dirty = true;
        return numFmtId;
    }

    /**
     * Ensure a font row exists. Exact-match reuse returns the existing index; otherwise appends. Never renumbers existing indexes. Citations: ECMA-376-1 §18.8.22; `CT_Font` in transitional sml.xsd.
     *
     * @param {Font} font - The font parameter.
     * @returns {number} - Returns the result.
     */
    public ensureFont(font: Font): number {
        const key: string = fontMatchKey(font);
        const existing: number = this.fontKeyIndex.get(key);
        if (existing !== undefined) {
            return existing;
        }

        this.ensureBaseline();

        // Re-check after baseline (baseline fonts may satisfy the key).
        const afterBaseline: number = this.fontKeyIndex.get(key);
        if (afterBaseline !== undefined) {
            return afterBaseline;
        }

        if (this.fonts.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "fonts" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const entry: FontEntry = fontEntryFromInput(font);
        const index: number = this.fonts.length;
        this.fonts.push(entry);
        this.fontKeyIndex.set(key, index);
        this.syncFontsCollection();
        this._dirty = true;
        return index;
    }

    /**
     * Ensure a fill row exists. Indexes 0 (`none`) and 1 (`gray125`) are reserved by baseline and never replaced. Exact-match reuse returns existing index; otherwise appends (≥ 2 after baseline). Never renumbers. Citations: ECMA-376-1 §18.8.21; `CT_Fill` / `CT_PatternFill`.
     *
     * @param {Fill} fill - The fill parameter.
     * @returns {number} - Returns the result.
     */
    public ensureFill(fill: Fill): number {
        const key: string = fillMatchKey(fill);
        const existing: number = this.fillKeyIndex.get(key);
        if (existing !== undefined) {
            return existing;
        }

        this.ensureBaseline();

        const afterBaseline: number = this.fillKeyIndex.get(key);
        if (afterBaseline !== undefined) {
            return afterBaseline;
        }

        if (this.fills.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "fills" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const entry: FillEntry = fillEntryFromInput(fill);
        const index: number = this.fills.length;
        this.fills.push(entry);
        this.fillKeyIndex.set(key, index);
        this.syncFillsCollection();
        this._dirty = true;
        return index;
    }

    /**
     * Ensure a border row exists. Exact-match reuse returns existing index; otherwise appends. Library-created edges use Transitional left/right/top/bottom/diagonal. Never renumbers. Citations: ECMA-376-1 §18.8.4; `CT_Border` in transitional sml.xsd.
     *
     * @param {Border} border - The border parameter.
     * @returns {number} - Returns the result.
     */
    public ensureBorder(border: Border): number {
        const key: string = borderMatchKey(border);
        const existing: number = this.borderKeyIndex.get(key);
        if (existing !== undefined) {
            return existing;
        }

        this.ensureBaseline();

        const afterBaseline: number = this.borderKeyIndex.get(key);
        if (afterBaseline !== undefined) {
            return afterBaseline;
        }

        if (this.borders.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "borders" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const entry: CellBorder = cellBorderFromInput(border);
        const index: number = this.borders.length;
        this.borders.push(entry);
        this.borderKeyIndex.set(key, index);
        this.syncBordersCollection();
        this._dirty = true;
        return index;
    }

    /**
     * Ensure a `cellXfs` xf row exists. Exact-match reuse returns the existing index; otherwise appends. Never renumbers existing indexes. Nested `font` / `fill` / `border` inputs go through the corresponding `ensure*` helpers. `apply*` flags are set when the corresponding input is present. `xfId` defaults to 0. Default component ids are 0 when omitted. Citations: ECMA-376-1 §18.8.10 / §18.8.45; `CT_Xf` in transitional sml.xsd. Called by {@link Cell.style} / {@link Cell.numberFormat} authoring.
     *
     * @param {CellStyle} style - The style parameter.
     * @returns {number} - Returns the result.
     */
    public ensureCellXf(style: CellStyle): number {
        // Resolve nested tables first so candidate ids are stable for match key.
        // ensure* may seed baseline; match key is computed after nested resolve.
        const fontId: number = style.font !== undefined ? this.ensureFont(style.font) : 0;
        const fillId: number = style.fill !== undefined ? this.ensureFill(style.fill) : 0;
        const borderId: number = style.border !== undefined ? this.ensureBorder(style.border) : 0;

        const numFmtId: number = style.numFmtId !== undefined ? style.numFmtId : 0;
        const xfId: number = style.xfId !== undefined ? style.xfId : 0;

        const applyNumberFormat: true = style.numFmtId !== undefined ? true : undefined;
        const applyFont: true = style.font !== undefined ? true : undefined;
        const applyFill: true = style.fill !== undefined ? true : undefined;
        const applyBorder: true = style.border !== undefined ? true : undefined;
        const applyAlignment: true = style.alignment !== undefined ? true : undefined;
        const applyProtection: true = style.protection !== undefined ? true : undefined;

        const candidate: CellXfEntry = cellXfEntryFromResolved({
            numFmtId,
            fontId,
            fillId,
            borderId,
            xfId,
            ...(style.quotePrefix !== undefined ? { quotePrefix: style.quotePrefix } : {}),
            ...(style.pivotButton !== undefined ? { pivotButton: style.pivotButton } : {}),
            ...(applyNumberFormat !== undefined ? { applyNumberFormat } : {}),
            ...(applyFont !== undefined ? { applyFont } : {}),
            ...(applyFill !== undefined ? { applyFill } : {}),
            ...(applyBorder !== undefined ? { applyBorder } : {}),
            ...(applyAlignment !== undefined ? { applyAlignment } : {}),
            ...(applyProtection !== undefined ? { applyProtection } : {}),
            ...(style.alignment !== undefined ? { alignment: style.alignment } : {}),
            ...(style.protection !== undefined ? { protection: style.protection } : {})
        });

        const key: string = cellXfMatchKey(candidate);
        const existing: number = this.cellXfKeyIndex.get(key);
        if (existing !== undefined) {
            return existing;
        }

        this.ensureBaseline();

        const afterBaseline: number = this.cellXfKeyIndex.get(key);
        if (afterBaseline !== undefined) {
            return afterBaseline;
        }

        if (this.cellXfs.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "cellXfs" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const index: number = this.cellXfs.length;
        this.cellXfs.push(candidate);
        this.cellXfKeyIndex.set(key, index);
        this.syncCellXfsCollection();
        this._dirty = true;
        return index;
    }

    /**
     * Add or reuse a custom number format code. Thin alias of {@link ensureCustomNumberFormat}. Not part of the public API; cell authors use {@link Cell.numberFormat}.
     *
     * @param {string} formatCode - The formatCode parameter.
     * @returns {number} - Returns the result.
     */
    public addNumberFormat(formatCode: string): number {
        return this.ensureCustomNumberFormat(formatCode);
    }

    /**
     * Add or reuse a font row. Thin alias of {@link ensureFont}. Not part of the public API; cell authors use {@link Cell.style}.
     *
     * @param {Font} font - The font parameter.
     * @returns {number} - Returns the result.
     */
    public addFont(font: Font): number {
        return this.ensureFont(font);
    }

    /**
     * Add or reuse a fill row. Thin alias of {@link ensureFill}. Not part of the public API; cell authors use {@link Cell.style}.
     *
     * @param {Fill} fill - The fill parameter.
     * @returns {number} - Returns the result.
     */
    public addFill(fill: Fill): number {
        return this.ensureFill(fill);
    }

    /**
     * Add or reuse a border row. Thin alias of {@link ensureBorder}. Not part of the public API; cell authors use {@link Cell.style}.
     *
     * @param {Border} border - The border parameter.
     * @returns {number} - Returns the result.
     */
    public addBorder(border: Border): number {
        return this.ensureBorder(border);
    }

    /**
     * Add or reuse a cellXf style row. Thin alias of {@link ensureCellXf}. Not part of the public API; cell authors use {@link Cell.style} / {@link Cell.numberFormat}.
     *
     * @param {CellStyle} style - The style parameter.
     * @returns {number} - Returns the result.
     */
    public addCellStyle(style: CellStyle): number {
        return this.ensureCellXf(style);
    }

    /**
     * Ensure a differential format (`dxf`) row exists. Exact-match reuse returns the existing index; otherwise appends. Never renumbers existing indexes. Public authoring children: font / numFmt / fill / border (inline under `dxf`, not fontId/fillId table refs). Alignment/protection are not authored here; loaded rows that carry them are preserved on serialize. Baseline fonts/fills/borders are still seeded when the stylesheet is empty so the part remains Excel-compatible on first write. Citations: ECMA-376-1 §18.8.14 / §18.8.15 / §18.8.30; `CT_Dxf` / `CT_Dxfs`.
     *
     * @param {DifferentialFormatInput} format - The format parameter.
     * @returns {number} - Returns the result.
     */
    public ensureDxf(format: DifferentialFormatInput): number {
        const key: string = dxfMatchKey(format);
        const existing: number = this.dxfKeyIndex.get(key);
        if (existing !== undefined) {
            return existing;
        }

        // Seed baseline stylesheet tables when empty (Excel-compatible part).
        this.ensureBaseline();

        const afterBaseline: number = this.dxfKeyIndex.get(key);
        if (afterBaseline !== undefined) {
            return afterBaseline;
        }

        if (this.dxfs.length >= this.maxEntries) {
            throw new PackageLimitError(
                `Styles collection "dxfs" exceeds maximum of ${this.maxEntries} entries`,
                this.partName !== undefined ? { partName: this.partName } : undefined
            );
        }

        const entry: DxfEntry = dxfEntryFromInput(format);
        const index: number = this.dxfs.length;
        this.dxfs.push(entry);
        this.dxfKeyIndex.set(key, index);
        this.syncDxfsCollection();
        this._dirty = true;
        return index;
    }

    /**
     * addDifferentialFormat method.
     *
     * @param {DifferentialFormatInput} format - The format parameter.
     * @returns {number} - Returns the result.
     */
    public addDifferentialFormat(format: DifferentialFormatInput): number {
        return this.ensureDxf(format);
    }

    /**
     * Mark dirty and ensure library baseline tables exist (for first write).
     *
     * @returns {void} - Returns the result.
     */
    public markDirty(): void {
        this.ensureBaseline();
        this._dirty = true;
    }

    /**
     * Assign part name used when creating the part on save.
     *
     * @param {string} partName - The partName parameter.
     * @returns {void} - Returns the result.
     */
    public assignPartName(partName: string): void {
        this.partName = partName;
    }

    /**
     * Serialize the workbook's styles into the bytes of the styles part
     * written on save. Any pending changes are applied first, so the bytes
     * always reflect the current fonts, fills, borders, and number formats.
     *
     * @returns {Object} the styles-part content, ready to be written to the package.
     * @private
     */
    public toPartBytes(): Uint8Array {
        if (this._dirty || this.collections.length === 0) {
            this.ensureBaseline();
        }
        this.syncAllStructuredCollections();
        return serializeStylesXml(
            {
                collections: this.collections,
                unknownChildrenXml: this.unknownChildrenXml,
                rootExtraAttrsXml: this.rootExtraAttrsXml
            },
            { maxEntries: this.maxEntries }
        );
    }

    /**
     * Bind theme-part XML used only to resolve {@link Color.rgbColor}.
     * Does not mark the styles table dirty and does not rewrite the theme part.
     * An absent or empty part leaves the Office default scheme.
     *
     * @private
     * @param {string | undefined} themeXml - Theme part XML, or undefined when absent.
     * @returns {void} - Returns the result.
     */
    public bindThemeXml(themeXml: string | undefined): void {
        const theme: ThemeColorScheme =
            themeXml !== undefined && themeXml.trim().length > 0
                ? parseThemeColorScheme(themeXml)
                : defaultThemeColorScheme();
        this.colorContext = {
            theme,
            indexedRgb: indexedOverridesFromCollections(this.collections)
        };
    }

    /**
     * Return a copy of a stored color with {@link Color.rgbColor} filled in.
     * Does not mutate the stored color.
     *
     * @private
     * @param {Color} color - Stored color attributes.
     * @returns {Color} Stored attributes plus the resolved view when known.
     */
    public colorWithRgb(color: Color): Color {
        const rgbColor: string | undefined = resolveColorToRgb(color, this.colorContext);
        return {
            ...(color.auto !== undefined ? { auto: color.auto } : {}),
            ...(color.indexed !== undefined ? { indexed: color.indexed } : {}),
            ...(color.rgb !== undefined ? { rgb: color.rgb } : {}),
            ...(color.theme !== undefined ? { theme: color.theme } : {}),
            ...(color.tint !== undefined ? { tint: color.tint } : {}),
            ...(rgbColor !== undefined ? { rgbColor } : {})
        };
    }

    /**
     * collectionNames method.
     *
     * @returns {string} - Returns the result.
     */
    public collectionNames(): ReadonlyArray<string> {
        return this.collections.map((c: StylesCollectionXml): string => c.name);
    }

    /**
     * collectionXml method.
     *
     * @param {string} name - The name parameter.
     * @returns {string} - Returns the result.
     */
    public collectionXml(name: string): string | undefined {
        return ((__t: StylesCollectionXml): string => (__t == null ? undefined : __t.xml))(
            this.collections.find((c: StylesCollectionXml): boolean => c.name === name)
        );
    }

    /**
     * cellXfEntryToFormat method.
     *
     * @param {CellXfEntry} entry - The entry parameter.
     * @returns {CellFormat} - Returns the result.
     */
    private cellXfEntryToFormat(entry: CellXfEntry): CellFormat {
        return {
            numFmtId: entry.numFmtId,
            fontId: entry.fontId,
            fillId: entry.fillId,
            borderId: entry.borderId,
            xfId: entry.xfId,
            quotePrefix: entry.quotePrefix,
            pivotButton: entry.pivotButton,
            applyNumberFormat: entry.applyNumberFormat,
            applyFont: entry.applyFont,
            applyFill: entry.applyFill,
            applyBorder: entry.applyBorder,
            applyAlignment: entry.applyAlignment,
            applyProtection: entry.applyProtection,
            alignment: entry.alignment,
            protection: entry.protection,
            extraChildrenXml: entry.extraChildrenXml,
            xmlPreserve:
                entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0
                    ? entry.xmlPreserve.trim()
                    : serializeXfElement(entry)
        };
    }

    /**
     * ensureBaseline method.
     *
     * @returns {void} - Returns the result.
     */
    private ensureBaseline(): void {
        if (this.baselineEnsured && this.collections.length > 0) {
            // Ensure in-memory arrays mirror collections when empty styleSheet (had
            // part) then marked dirty / ensure* without structured rows yet.
            if (this.fonts.length === 0 && this.fills.length === 0 && this.borders.length === 0 && this.cellXfs.length === 0) {
                const hasFonts: boolean = this.collections.some((c: StylesCollectionXml): boolean => c.name === 'fonts');
                if (!hasFonts) {
                    this.applyStructuredBaselineArrays();
                    this.syncAllStructuredCollections();
                }
            } else if (this.cellXfs.length === 0) {
                const hasCellXfs: boolean = this.collections.some((c: StylesCollectionXml): boolean => c.name === 'cellXfs');
                if (!hasCellXfs) {
                    this.cellXfs = buildBaselineCellXfEntries();
                    this.rebuildCellXfKeyIndex();
                    this.syncCellXfsCollection();
                }
            }
            return;
        }
        if (this.collections.length > 0) {
            this.baselineEnsured = true;
            return;
        }
        this.collections = buildBaselineStylesCollections();
        this.applyStructuredBaselineArrays();
        this.baselineEnsured = true;
        this.syncAllStructuredCollections();
    }

    /**
     * applyStructuredBaselineArrays method.
     *
     * @returns {void} - Returns the result.
     */
    private applyStructuredBaselineArrays(): void {
        if (this.fonts.length === 0) {
            this.fonts = buildBaselineFontEntries();
            this.rebuildFontKeyIndex();
        }
        if (this.fills.length === 0) {
            this.fills = buildBaselineFillEntries();
            this.rebuildFillKeyIndex();
        }
        if (this.borders.length === 0) {
            this.borders = buildBaselineCellBorders();
            this.rebuildBorderKeyIndex();
        }
        if (this.cellXfs.length === 0) {
            this.cellXfs = buildBaselineCellXfEntries();
            this.rebuildCellXfKeyIndex();
        }
    }

    /**
     * syncAllStructuredCollections method.
     *
     * @returns {void} - Returns the result.
     */
    private syncAllStructuredCollections(): void {
        this.syncNumFmtsCollection();
        this.syncFontsCollection();
        this.syncFillsCollection();
        this.syncBordersCollection();
        this.syncCellXfsCollection();
        this.syncDxfsCollection();
    }

    /**
     * syncDxfsCollection method.
     *
     * @returns {void} - Returns the result.
     */
    private syncDxfsCollection(): void {
        this.upsertCollection(serializeDxfsCollection(this.dxfs), 'dxfs');
    }

    /**
     * Write or remove the `numFmts` collection from `collections` to match `this.numFmts`. Preserves relative order among other collections via schema-ordered serialize.
     *
     * @returns {void} - Returns the result.
     */
    private syncNumFmtsCollection(): void {
        this.upsertCollection(serializeNumFmtsCollection(this.numFmts), 'numFmts');
    }

    /**
     * syncFontsCollection method.
     *
     * @returns {void} - Returns the result.
     */
    private syncFontsCollection(): void {
        this.upsertCollection(serializeFontsCollection(this.fonts), 'fonts');
    }

    /**
     * syncFillsCollection method.
     *
     * @returns {void} - Returns the result.
     */
    private syncFillsCollection(): void {
        this.upsertCollection(serializeFillsCollection(this.fills), 'fills');
    }

    /**
     * syncBordersCollection method.
     *
     * @returns {void} - Returns the result.
     */
    private syncBordersCollection(): void {
        this.upsertCollection(serializeBordersCollection(this.borders), 'borders');
    }

    /**
     * syncCellXfsCollection method.
     *
     * @returns {void} - Returns the result.
     */
    private syncCellXfsCollection(): void {
        this.upsertCollection(serializeCellXfsCollection(this.cellXfs), 'cellXfs');
    }

    /**
     * upsertCollection method.
     *
     * @param {*} serialized - The serialized parameter.
     * @param {string} name - The name parameter.
     * @returns {void} - Returns the result.
     */
    private upsertCollection(serialized: StylesCollectionXml | undefined, name: string): void {
        const without: StylesCollectionXml[] = this.collections.filter((c: StylesCollectionXml): boolean => c.name !== name);
        if (serialized === undefined) {
            this.collections = without;
            return;
        }
        this.collections = [...without, serialized];
    }

    /**
     * rebuildFormatCodeIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildFormatCodeIndex(): void {
        this.formatCodeIndex.clear();
        for (const e of this.numFmts) {
            if (!this.formatCodeIndex.has(e.formatCode)) {
                this.formatCodeIndex.set(e.formatCode, e.numFmtId);
            }
        }
    }

    /**
     * rebuildFontKeyIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildFontKeyIndex(): void {
        this.fontKeyIndex.clear();
        for (let i: number = 0; i < this.fonts.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: FontEntry = this.fonts[i];
            if (e === undefined) {
                continue;
            }
            const key: string = fontMatchKey(e);
            if (!this.fontKeyIndex.has(key)) {
                this.fontKeyIndex.set(key, i);
            }
        }
    }

    /**
     * rebuildFillKeyIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildFillKeyIndex(): void {
        this.fillKeyIndex.clear();
        for (let i: number = 0; i < this.fills.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: FillEntry = this.fills[i];
            if (e === undefined) {
                continue;
            }
            const key: string = fillMatchKey(e);
            if (!this.fillKeyIndex.has(key)) {
                this.fillKeyIndex.set(key, i);
            }
        }
    }

    /**
     * rebuildBorderKeyIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildBorderKeyIndex(): void {
        this.borderKeyIndex.clear();
        for (let i: number = 0; i < this.borders.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: CellBorder = this.borders[i];
            if (e === undefined) {
                continue;
            }
            const key: string = borderMatchKey(e);
            if (!this.borderKeyIndex.has(key)) {
                this.borderKeyIndex.set(key, i);
            }
        }
    }

    /**
     * rebuildCellXfKeyIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildCellXfKeyIndex(): void {
        this.cellXfKeyIndex.clear();
        for (let i: number = 0; i < this.cellXfs.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: CellXfEntry = this.cellXfs[i];
            if (e === undefined) {
                continue;
            }
            const key: string = cellXfMatchKey(e);
            if (!this.cellXfKeyIndex.has(key)) {
                this.cellXfKeyIndex.set(key, i);
            }
        }
    }

    /**
     * rebuildDxfKeyIndex method.
     *
     * @returns {void} - Returns the result.
     */
    private rebuildDxfKeyIndex(): void {
        this.dxfKeyIndex.clear();
        for (let i: number = 0; i < this.dxfs.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: DxfEntry = this.dxfs[i];
            if (e === undefined) {
                continue;
            }
            const key: string = dxfMatchKey(e);
            if (!this.dxfKeyIndex.has(key)) {
                this.dxfKeyIndex.set(key, i);
            }
        }
    }

    /**
     * collectionCount method.
     *
     * @param {string} name - The name parameter.
     * @returns {number} - Returns the result.
     */
    private collectionCount(name: string): number {
        const c: StylesCollectionXml = this.collections.find((x: StylesCollectionXml): boolean => x.name === name);
        return ((__t: number): number => (__t != null ? __t : 0))(c == null ? undefined : c.count);
    }

    /**
     * collectionItems method.
     *
     * @param {string} name - The name parameter.
     * @returns {string[]} - Returns the result.
     */
    private collectionItems(name: string): string[] {
        const c: StylesCollectionXml = this.collections.find((x: StylesCollectionXml): boolean => x.name === name);
        if (c === undefined || c.xml.trim().length === 0) {
            return [];
        }
        return collectionItemXmls(c.xml);
    }
}

/**
 * Indexed palette overrides from a parsed `colors` collection, if present.
 *
 * @param {ReadonlyArray<StylesCollectionXml>} collections - Styles collections.
 * @returns {ReadonlyArray<string | undefined> | undefined} Palette slots, or undefined.
 */
function indexedOverridesFromCollections(
    collections: ReadonlyArray<StylesCollectionXml>
): ReadonlyArray<string | undefined> | undefined {
    const colors: StylesCollectionXml | undefined = collections.find(
        (c: StylesCollectionXml): boolean => c.name === 'colors'
    );
    return parseIndexedColorOverrides(colors == null ? undefined : colors.xml);
}
