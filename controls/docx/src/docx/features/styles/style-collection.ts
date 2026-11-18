/**
 * Document-owned live StyleCollection (public Styles DOM).
 *
 * Merges live authoring APIs (paragraph/character facades, StyleOwner) with
 * table-style support, pending ensure, and stable DocxStyle projection cache.
 *
 * @public
 */
import { DocxError, InvalidArgumentError } from '../../core/errors/docx-error';
import { WordDocument } from '../document/document';
import { wmlAttr, wmlElement } from '../document/wml';
import { normalizeStyleName } from './builtin-catalog';
import { resolveReferencedStyle, resolveStyleForTarget, StyleLookupSurface } from './builtin-resolver';
import {
    CharacterStyle,
    createMinimalStyle,
    createStyleFromDocxStyle,
    ParagraphStyle,
    Style,
    StyleOwner
} from './style-base';
import { createMinimalDocxStyle, DocxStyle } from './style';
import { TableStyle, TableStyleHost } from './table-style';

/**
 * Callback surface from StyleCollection into StylesPart (dirty + optional hooks).
 *
 * @private
 */
export interface StyleCollectionHost {
    markStylesDirty(): void;
    /**
     * Drop a stable DocxStyle projection for a removed style id (StylesPart cache).
     *
     * @private
     */
    forgetProjectedStyle?(styleId: string): void;
    /**
     * Clear content references (`w:pStyle` / `w:rStyle` / table style) to a removed
     * style id across the document. Prevents save-time materialize from re-creating
     * a minimal stub for dangling refs.
     *
     * @private
     */
    purgeContentStyleReferences?(document: WordDocument, styleId: string): void;
}

/**
 * Public styles collection on {@link WordDocument.styles}.
 *
 * Stable identity: `document.styles === document.styles`.
 * Entry identity: `getStyle(id) === getStyle(id)`.
 *
 * @public
 */
export class StyleCollection implements StyleOwner, Iterable<Style> {
    readonly [index: number]: Style;

    private readonly document: WordDocument;
    private readonly host: StyleCollectionHost;
    private readonly styleList: Style[];
    private readonly styleById: Map<string, Style>;
    private readonly pendingParagraphStyles: Set<string>;
    private readonly pendingCharacterStyles: Set<string>;
    private readonly pendingTableStyles: Set<string>;
    /** Stable DocxStyle projections keyed by styleId (identity cache). */
    private readonly projected: Map<string, DocxStyle>;
    private cachedLength: number = 0;

    /**
     * @param {WordDocument} document - The document.
     * @param {StyleCollectionHost} host - The host.
     * @param {ReadonlyArray<Style>} initial - The initial.
     * @private
     */
    constructor(document: WordDocument, host: StyleCollectionHost, initial: ReadonlyArray<Style> = []) {
        this.document = document;
        this.host = host;
        this.styleList = [];
        this.styleById = new Map();
        this.pendingParagraphStyles = new Set();
        this.pendingCharacterStyles = new Set();
        this.pendingTableStyles = new Set();
        this.projected = new Map();
        void this.document;
        for (const style of initial) {
            this.attachAndIndex(style, false);
        }
    }

    /**
     * Owning document.
     *
     * @private
     */
    get ownerDocument(): WordDocument {
        return this.document;
    }

    /**
     * Number of styles in document order.
     *
     * @public
     */
    get count(): number {
        this.rebuildIndexProperties();
        return this.styleList.length;
    }

    /**
     * Style at zero-based index, or `undefined` when out of range.
     *
     * @param {number} index - The index.
     * @returns {Style | undefined} The result.
     * @public
     */
    itemAt(index: number): Style | undefined {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        return this.styleList[index];
    }

    [Symbol.iterator](): Iterator<Style> {
        const items: Style[] = this.styleList.slice();
        let i: number = 0;
        return {
            next(): IteratorResult<Style> {
                if (i >= items.length) {
                    return { done: true, value: undefined as unknown as Style };
                }
                // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                const value: Style = items[i]!;
                i += 1;
                return { done: false, value };
            }
        };
    }

    /**
     * Look up any style by `w:styleId`.
     *
     * @param {string} styleId - The style id.
     * @returns {Style | undefined} The result.
     * @public
     */
    getStyle(styleId: string): Style | undefined {
        return this.styleById.get(styleId);
    }

    /**
     * Look up any style by `w:styleId` (alias of {@link getStyle}).
     *
     * @param {string} styleId - The style id.
     * @returns {Style | undefined} The result.
     * @public
     */
    findById(styleId: string): Style | undefined {
        return this.getStyle(styleId);
    }

    /**
     * Look up a paragraph style by id.
     *
     * @param {string} styleId - The style id.
     * @returns {ParagraphStyle | undefined} The result.
     * @public
     */
    getParagraphStyle(styleId: string): ParagraphStyle | undefined {
        const style: Style = this.styleById.get(styleId);
        if (style instanceof ParagraphStyle) {
            return style;
        }
        return undefined;
    }

    /**
     * Look up a character style by id.
     *
     * @param {string} styleId - The style id.
     * @returns {CharacterStyle | undefined} The result.
     * @public
     */
    getCharacterStyle(styleId: string): CharacterStyle | undefined {
        const style: Style = this.styleById.get(styleId);
        if (style instanceof CharacterStyle) {
            return style;
        }
        return undefined;
    }

    /**
     * Look up a table style by id.
     *
     * @param {string} styleId - The style id.
     * @returns {TableStyle | undefined} The result.
     * @public
     */
    getTableStyle(styleId: string): TableStyle | undefined {
        const style: Style = this.styleById.get(styleId);
        if (style instanceof TableStyle) {
            return style;
        }
        return undefined;
    }

    /**
     * Find a style whose display name matches `name` (normalized).
     *
     * @param {string} name - The name.
     * @returns {Style | undefined} The result.
     * @public
     */
    findByName(name: string): Style | undefined {
        const normalized: string = normalizeStyleName(name);
        if (normalized.length === 0) {
            return undefined;
        }
        for (const style of this.styleList) {
            if (style.normalizedName() === normalized) {
                return style;
            }
        }
        return undefined;
    }

    /**
     * Whether a style id exists (including pending ensure).
     *
     * @param {string} styleId - The style id.
     * @returns {boolean} The result.
     * @public
     */
    hasStyle(styleId: string): boolean {
        return (
            this.styleById.has(styleId) ||
      this.pendingParagraphStyles.has(styleId) ||
      this.pendingCharacterStyles.has(styleId) ||
      this.pendingTableStyles.has(styleId)
        );
    }

    /**
     * Create and add a paragraph style with the given id.
     * Throws when the id is empty or already present.
     *
     * @param {string} styleId - The style id.
     * @returns {ParagraphStyle} The result.
     * @public
     */
    addParagraphStyle(styleId: string): ParagraphStyle {
        this.assertNewId(styleId);
        const style: ParagraphStyle = ParagraphStyle.createMinimal(styleId);
        this.attachAndIndex(style, true);
        return style;
    }

    /**
     * Create and add a character style with the given id.
     *
     * @param {string} styleId - The style id.
     * @returns {CharacterStyle} The result.
     * @public
     */
    addCharacterStyle(styleId: string): CharacterStyle {
        this.assertNewId(styleId);
        const style: CharacterStyle = CharacterStyle.createMinimal(styleId);
        this.attachAndIndex(style, true);
        return style;
    }

    /**
     * Create a custom table style and add it to this collection.
     *
     * @param {string} name - The name.
     * @returns {TableStyle} The result.
     * @public
     */
    addTableStyle(name: string): TableStyle {
        const trimmed: string = name.trim();
        if (trimmed.length === 0) {
            throw new InvalidArgumentError('Table style name must not be empty');
        }
        let styleId: string = sanitizeStyleId(trimmed);
        if (styleId.length === 0) {
            styleId = 'TableStyle';
        }
        styleId = uniqueStyleId(styleId, (candidate: string) => this.styleById.has(candidate));
        const shell: DocxStyle = new DocxStyle(styleId, 'table', undefined, true, [
            wmlElement('name', { attributes: [wmlAttr('val', trimmed)] })
        ]);
        const live: Style = this.appendFromDocxShell(shell, true);
        return live as TableStyle;
    }

    /**
     * Ensure a paragraph style exists (built-in catalog or minimal stub).
     * Returns the live style.
     *
     * @param {string} styleId - The style id.
     * @returns {ParagraphStyle} The result.
     * @public
     */
    ensureParagraphStyle(styleId: string): ParagraphStyle {
        const existing: ParagraphStyle = this.getParagraphStyle(styleId);
        if (existing !== undefined) {
            return existing;
        }
        this.ensureStyle(styleId, 'paragraph');
        const created: ParagraphStyle = this.getParagraphStyle(styleId);
        if (created === undefined) {
            const byName: Style = this.findByName(styleId);
            if (byName instanceof ParagraphStyle) {
                return byName;
            }
            throw new DocxError('styles/undefined-style', `Failed to ensure paragraph style "${styleId}"`);
        }
        return created;
    }

    /**
     * Ensure a character style exists (built-in catalog or minimal stub).
     *
     * @param {string} styleId - The style id.
     * @returns {CharacterStyle} The result.
     * @public
     */
    ensureCharacterStyle(styleId: string): CharacterStyle {
        const existing: CharacterStyle = this.getCharacterStyle(styleId);
        if (existing !== undefined) {
            return existing;
        }
        this.ensureStyle(styleId, 'character');
        const created: CharacterStyle = this.getCharacterStyle(styleId);
        if (created === undefined) {
            const byName: Style = this.findByName(styleId);
            if (byName instanceof CharacterStyle) {
                return byName;
            }
            throw new DocxError('styles/undefined-style', `Failed to ensure character style "${styleId}"`);
        }
        return created;
    }

    /**
     * Ensure a table style exists (built-in catalog or minimal stub).
     *
     * @param {string} styleId - The style id.
     * @returns {TableStyle} The result.
     * @public
     */
    ensureTableStyle(styleId: string): TableStyle {
        const existing: TableStyle = this.getTableStyle(styleId);
        if (existing !== undefined) {
            return existing;
        }
        this.ensureStyle(styleId, 'table');
        const created: TableStyle = this.getTableStyle(styleId);
        if (created === undefined) {
            const byName: Style = this.findByName(styleId);
            if (byName instanceof TableStyle) {
                return byName;
            }
            throw new DocxError('styles/undefined-style', `Failed to ensure table style "${styleId}"`);
        }
        return created;
    }

    /**
     * Remove a style by id or instance. Detaches the style, clears pending /
     * projection caches, strips content references (`pStyle` / `rStyle` / table
     * style) and catalog edges (`basedOn` / `next` / `link`) that point at the
     * removed id so save-time materialize cannot re-create a minimal stub.
     * Returns `true` when removed.
     *
     * Not part of the public Styles collection surface — use {@link Style.remove}.
     *
     * @param {Style | string} styleOrId - The style or id.
     * @returns {boolean} The result.
     * @private
     */
    remove(styleOrId: Style | string): boolean {
        const styleId: string = typeof styleOrId === 'string' ? styleOrId : styleOrId.styleId;
        const style: Style = this.styleById.get(styleId);
        if (style === undefined) {
            return false;
        }
        if (typeof styleOrId !== 'string' && styleOrId !== style) {
            throw new InvalidArgumentError('Style instance is not the collection entry for its styleId');
        }

        // Content refs first so materialize cannot observe a dangling id after detach.
        if (typeof this.host.purgeContentStyleReferences === 'function') {
            this.host.purgeContentStyleReferences(this.document, styleId);
        }
        this.purgeCatalogReferencesTo(styleId, style);

        const index: number = this.styleList.indexOf(style);
        if (index >= 0) {
            this.styleList.splice(index, 1);
        }
        this.styleById.delete(styleId);
        this.projected.delete(styleId);
        this.pendingParagraphStyles.delete(styleId);
        this.pendingCharacterStyles.delete(styleId);
        this.pendingTableStyles.delete(styleId);
        if (typeof this.host.forgetProjectedStyle === 'function') {
            this.host.forgetProjectedStyle(styleId);
        }
        style.detach();
        this.host.markStylesDirty();
        this.rebuildIndexProperties();
        return true;
    }

    /**
     * Clear `basedOn` / `next` / `link` on remaining styles that point at `styleId`.
     *
     * @param {string} styleId - The style id.
     * @param {Style} removed - The removed.
     * @returns {void} Nothing is returned.
     * @private
     */
    private purgeCatalogReferencesTo(styleId: string, removed: Style): void {
        for (const other of this.styleList) {
            if (other === removed) {
                continue;
            }
            other.clearReferencesToStyleId(styleId);
        }
    }

    /**
     * Ordered styles for package serialization.
     *
     * @returns {ReadonlyArray<Style>} The result.
     * @private
     */
    stylesInOrder(): ReadonlyArray<Style> {
        return this.styleList;
    }

    /**
     * StyleOwner: mark styles part dirty and drop projection for all styles when
     * a live mutation may have changed modeled XML (host may call for any style).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    markStylesDirty(): void {
    // Drop projection cache so subsequent projectDocxStyle re-serializes.
        this.projected.clear();
        this.host.markStylesDirty();
    }

    /**
     * StyleOwner: lookup by id.
     *
     * @param {string} styleId - The style id.
     * @returns {Style | undefined} The result.
     * @private
     */
    lookupStyle(styleId: string): Style | undefined {
        return this.styleById.get(styleId);
    }

    /**
     * Resolver / part surface: find by display name.
     *
     * @param {string} name - The name.
     * @returns {DocxStyle | undefined} The result.
     * @private
     */
    findStyleByDisplayName(name: string): DocxStyle | undefined {
        const live: Style = this.findByName(name);
        if (live === undefined) {
            return undefined;
        }
        return this.projectDocxStyle(live.styleId);
    }

    /**
     * Add a live style (resolver / hydrate). No-op when id already present.
     *
     * @param {Style | DocxStyle} style - The style.
     * @returns {void} Nothing is returned.
     * @private
     */
    addStyle(style: Style | DocxStyle): void {
        if (style instanceof DocxStyle) {
            if (this.styleById.has(style.styleId)) {
                return;
            }
            this.appendFromDocxShell(style, true);
            return;
        }
        if (this.styleById.has(style.styleId)) {
            return;
        }
        if (style.isAttached && style.owner !== this) {
            throw new DocxError('argument/invalid', `Style "${style.styleId}" is owned by another document`);
        }
        this.attachAndIndex(style, true);
    }

    /**
     * Hydrate from temporary DocxStyle shells (parse / create path). Does not mark dirty
     * when `markDirty` is false (load path).
     *
     * @param {ReadonlyArray<DocxStyle>} sources - The sources.
     * @param {boolean} markDirty - The mark dirty.
     * @returns {void} Nothing is returned.
     * @private
     */
    hydrateFromDocxStyles(sources: ReadonlyArray<DocxStyle>, markDirty: boolean): void {
        for (const shell of sources) {
            if (this.styleById.has(shell.styleId)) {
                continue;
            }
            this.appendFromDocxShell(shell, markDirty);
        }
    }

    /**
     * Replace contents from DocxStyle shells (load / create). Clears existing entries.
     *
     * @param {ReadonlyArray<DocxStyle>} sources - The sources.
     * @param {boolean} markDirty - The mark dirty.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceFromDocxStyles(sources: ReadonlyArray<DocxStyle>, markDirty: boolean): void {
        for (const style of this.styleList) {
            style.detach();
        }
        this.styleList.length = 0;
        this.styleById.clear();
        this.projected.clear();
        this.hydrateFromDocxStyles(sources, markDirty);
        this.rebuildIndexProperties();
    }

    /**
     *  @private
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    registerPendingParagraphStyle(styleId: string): void {
        if (styleId.length === 0 || this.styleById.has(styleId)) {
            return;
        }
        this.pendingParagraphStyles.add(styleId);
    }

    /**
     *  @private
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    registerPendingCharacterStyle(styleId: string): void {
        if (styleId.length === 0 || this.styleById.has(styleId)) {
            return;
        }
        this.pendingCharacterStyles.add(styleId);
    }

    /**
     *  @private
     *
     * @param {string} styleId - The style id.
     * @returns {void} Nothing is returned.
     */
    registerPendingTableStyle(styleId: string): void {
        if (styleId.length === 0 || this.styleById.has(styleId)) {
            return;
        }
        this.pendingTableStyles.add(styleId);
    }

    /**
     * Materialize pending style ids and canonicalize dangling refs (save path).
     *
     * @param {Function} onParagraphStyle - The on paragraph style.
     * @param {Function} onCharacterStyle - The on character style.
     * @param {Function} onTableStyle - The on table style.
     * @returns {void} Nothing is returned.
     * @private
     */
    materializePendingIds(
        onParagraphStyle: (fromId: string, toId: string) => void,
        onCharacterStyle: (fromId: string, toId: string) => void,
        onTableStyle?: (fromId: string, toId: string) => void
    ): void {
        const pendingParagraph: string[] = Array.from(this.pendingParagraphStyles);
        this.pendingParagraphStyles.clear();
        for (const styleId of pendingParagraph) {
            if (!this.styleById.has(styleId)) {
                this.ensureStyle(styleId, 'paragraph');
            }
            const resolved: Style = this.styleById.get(styleId);
            if (resolved !== undefined && resolved.styleId !== styleId) {
                onParagraphStyle(styleId, resolved.styleId);
            } else if (resolved === undefined) {
                const byName: Style = this.findByName(styleId);
                if (byName !== undefined && byName.styleId !== styleId) {
                    onParagraphStyle(styleId, byName.styleId);
                }
            }
        }
        const pendingCharacter: string[] = Array.from(this.pendingCharacterStyles);
        this.pendingCharacterStyles.clear();
        for (const styleId of pendingCharacter) {
            if (!this.styleById.has(styleId)) {
                this.ensureStyle(styleId, 'character');
            }
            const resolved: Style = this.styleById.get(styleId);
            if (resolved !== undefined && resolved.styleId !== styleId) {
                onCharacterStyle(styleId, resolved.styleId);
            } else if (resolved === undefined) {
                const byName: Style = this.findByName(styleId);
                if (byName !== undefined && byName.styleId !== styleId) {
                    onCharacterStyle(styleId, byName.styleId);
                }
            }
        }
        if (onTableStyle !== undefined) {
            const pendingTable: string[] = Array.from(this.pendingTableStyles);
            this.pendingTableStyles.clear();
            for (const styleId of pendingTable) {
                if (!this.styleById.has(styleId)) {
                    this.ensureStyle(styleId, 'table');
                }
                const resolved: Style = this.styleById.get(styleId);
                if (resolved !== undefined && resolved.styleId !== styleId) {
                    onTableStyle(styleId, resolved.styleId);
                } else if (resolved === undefined) {
                    const byName: Style = this.findByName(styleId);
                    if (byName !== undefined && byName.styleId !== styleId) {
                        onTableStyle(styleId, byName.styleId);
                    }
                }
            }
        } else {
            this.pendingTableStyles.clear();
        }
    }

    /**
     * Adapter so the existing DocxStyle-based catalog resolver can read/add into this collection.
     *
     * @returns {StyleLookupSurface} The result.
     * @private
     */
    asDocxLookup(): StyleLookupSurface {
        return {
            getStyle: (styleId: string): DocxStyle | undefined => {
                return this.projectDocxStyle(styleId);
            },
            findStyleByDisplayName: (name: string): DocxStyle | undefined => {
                return this.findStyleByDisplayName(name);
            },
            addStyle: (style: DocxStyle): void => {
                if (this.styleById.has(style.styleId)) {
                    return;
                }
                this.appendFromDocxShell(style, true);
            }
        };
    }

    /**
     * Project live styles to temporary DocxStyle shells (resolver / transitional StylesPart surface).
     *
     * @returns {DocxStyle[]} The result.
     * @private
     */
    projectDocxStyles(): DocxStyle[] {
        const out: DocxStyle[] = [];
        for (const style of this.styleList) {
            const shell: DocxStyle = this.projectDocxStyle(style.styleId);
            if (shell !== undefined) {
                out.push(shell);
            }
        }
        return out;
    }

    /**
     * Project one live style to a DocxStyle shell, or `undefined`.
     * Caches by styleId so StylesPart can keep stable object identity until dirty.
     *
     * @param {string} styleId - The style id.
     * @returns {DocxStyle | undefined} The result.
     * @private
     */
    projectDocxStyle(styleId: string): DocxStyle | undefined {
        const cached: DocxStyle = this.projected.get(styleId);
        if (cached !== undefined) {
            return cached;
        }
        const live: Style = this.styleById.get(styleId);
        if (live === undefined) {
            return undefined;
        }
        const shell: DocxStyle = live.toDocxStyle();
        this.projected.set(styleId, shell);
        return shell;
    }

    /**
     * @param {string} styleId - The style id.
     * @param {string | string | string} type - The type.
     * @returns {void} Nothing is returned.
     * @private
     */
    private ensureStyle(styleId: string, type: 'paragraph' | 'character' | 'table'): void {
        if (styleId.length === 0) {
            throw new DocxError('content/invalid-style-id', 'Style id must not be empty');
        }
        if (this.styleById.has(styleId)) {
            return;
        }
        if (type === 'paragraph' || type === 'character') {
            try {
                resolveStyleForTarget(this.asDocxLookup(), styleId, type);
            } catch (err) {
                void err;
            }
            if (this.styleById.has(styleId)) {
                return;
            }
        }
        const referenced: DocxStyle = resolveReferencedStyle(this.asDocxLookup(), styleId, type);
        if (referenced !== undefined) {
            if (!this.styleById.has(referenced.styleId)) {
                this.appendFromDocxShell(referenced, true);
            }
            return;
        }
        if (type === 'table') {
            const created: DocxStyle = createMinimalDocxStyle(styleId, 'table');
            this.appendFromDocxShell(created, true);
            return;
        }
        const created: Style = createMinimalStyle(styleId, type);
        this.attachAndIndex(created, true);
    }

    private assertNewId(styleId: string): void {
        if (styleId.length === 0) {
            throw new InvalidArgumentError('Style id must not be empty');
        }
        if (this.styleById.has(styleId)) {
            throw new DocxError('argument/invalid', `Style id "${styleId}" already exists in this document`);
        }
    }

    /**
     * Build live Style (or TableStyle) from a DocxStyle shell and index it.
     *
     * @param {DocxStyle} shell - The shell.
     * @param {boolean} markDirty - The mark dirty.
     * @returns {Style} The result.
     * @private
     */
    private appendFromDocxShell(shell: DocxStyle, markDirty: boolean): Style {
        let live: Style;
        if (shell.type === 'table') {
            const tableHost: TableStyleHost = {
                notifyTableStyleMutation: (): void => {
                    this.projected.delete(shell.styleId);
                    this.host.markStylesDirty();
                }
            };
            live = new TableStyle(shell, tableHost);
        } else {
            live = createStyleFromDocxStyle(shell);
        }
        this.attachAndIndex(live, markDirty);
        // Prefer the original shell for stable identity when freshly loaded.
        this.projected.set(live.styleId, shell);
        return live;
    }

    private attachAndIndex(style: Style, markDirty: boolean): void {
        if (this.styleById.has(style.styleId)) {
            return;
        }
        if (style instanceof TableStyle) {
            style.bindHost({
                notifyTableStyleMutation: (): void => {
                    this.projected.delete(style.styleId);
                    this.host.markStylesDirty();
                }
            });
        }
        style.attach(this);
        this.styleList.push(style);
        this.styleById.set(style.styleId, style);
        if (markDirty) {
            this.host.markStylesDirty();
        }
        this.rebuildIndexProperties();
    }

    /**
     * Numeric index properties (CommentCollection pattern).
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    rebuildIndexProperties(): void {
        const items: Style[] = this.styleList;
        const nextLen: number = items.length;
        const prevLen: number = this.cachedLength;
        const limit: number = prevLen > nextLen ? prevLen : nextLen;
        for (let i: number = 0; i < limit; i += 1) {
            const key: string = String(i);
            if (i < nextLen) {
                Object.defineProperty(this, key, {
                    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
                    value: items[i],
                    writable: false,
                    enumerable: true,
                    configurable: true
                });
            } else {
                // eslint-disable-next-line security/detect-object-injection -- key is a numeric index string produced by this collection's own index mirroring, not user input
                delete (this as unknown as Record<string, unknown>)[key];
            }
        }
        this.cachedLength = nextLen;
    }
}
function sanitizeStyleId(name: string): string {
    let out: string = '';
    for (let i: number = 0; i < name.length; i += 1) {
        const ch: string = name.charAt(i);
        const code: number = name.charCodeAt(i);
        const isLetter: boolean =
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      code > 127;
        const isDigit: boolean = code >= 48 && code <= 57;
        if (isLetter || isDigit) {
            out += ch;
        }
    }
    return out;
}

function uniqueStyleId(base: string, exists: (id: string) => boolean): string {
    if (!exists(base)) {
        return base;
    }
    let n: number = 1;
    while (exists(base + String(n))) {
        n += 1;
    }
    return base + String(n);
}
