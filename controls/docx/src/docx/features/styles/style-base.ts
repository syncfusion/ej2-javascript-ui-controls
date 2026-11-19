/**
 * Live typed Styles DOM: Style, ParagraphStyle, CharacterStyle.
 *
 * Single mutable source of truth for paragraph and character style definitions.
 * Table and numbering styles use {@link OpaqueStyle} (not public API).
 *
 * Style_Architecture_change.txt §§4–9.
 *
 * @public
 */
import { DetachedObjectError, DocxError, InvalidArgumentError } from '../../core/errors/docx-error';
import { OpenXmlAttribute, OpenXmlChild, OpenXmlElement } from '../../core/xml/index';
import {
    CharacterFormat,
    CharacterFormatHost,
    CharacterFormatSnapshot
} from '../document/character-format';
import {
    ParagraphFormat,
    ParagraphFormatHost,
    ParagraphFormatSnapshot
} from '../document/paragraph-format';
import { parseOnOff, serializeOnOff } from '../document/on-off';
import { elementChildren, isWml, wmlAttr, wmlElement, wValAttribute, WML } from '../document/wml';
import { normalizeStyleName } from './builtin-catalog';
import {
    characterSnapshotFromRPr,
    paragraphSnapshotFromPPr
} from './style-format-bridge';
import { DocxStyle, DocxStyleType, parseDocxStyle } from './style';

// ---------------------------------------------------------------------------
// Owner surface (StylesPart / StyleCollection)
// ---------------------------------------------------------------------------

/**
 * Document styles infrastructure that owns live Style instances.
 *
 * @private
 */
export interface StyleOwner {
    /** Mark `styles.xml` dirty after a modeled mutation. */
    markStylesDirty(): void;
    /** Resolve a style id in the same collection (for base-style lookup). */
    lookupStyle(styleId: string): Style | undefined;
}

// ---------------------------------------------------------------------------
// Metadata helpers
// ---------------------------------------------------------------------------

/** CT_Style children emitted from typed fields (schema preamble). */
const MODELED_META_NAMES: ReadonlySet<string> = new Set([
    'name',
    'aliases',
    'basedOn',
    'next',
    'link',
    'autoRedefine',
    'hidden',
    'uiPriority',
    'semiHidden',
    'unhideWhenUsed',
    'qFormat',
    'locked'
]);

function firstWmlChild(children: ReadonlyArray<OpenXmlElement>, localName: string): OpenXmlElement | undefined {
    for (const element of children) {
        if (element !== undefined && isWml(element, localName)) {
            return element;
        }
    }
    return undefined;
}

function readStringVal(children: ReadonlyArray<OpenXmlElement>, localName: string): string | undefined {
    const el: OpenXmlElement = firstWmlChild(children, localName);
    if (el === undefined) {
        return undefined;
    }
    return wValAttribute(el);
}

function readOnOffChild(children: ReadonlyArray<OpenXmlElement>, localName: string): boolean | undefined {
    const el: OpenXmlElement = firstWmlChild(children, localName);
    if (el === undefined) {
        return undefined;
    }
    return parseOnOff(el);
}

function parseDecimalChild(el: OpenXmlElement | undefined): number | undefined {
    if (el === undefined) {
        return undefined;
    }
    const raw: string = wValAttribute(el);
    if (raw === undefined || !/^-?\d+$/.test(raw.trim())) {
        return undefined;
    }
    return parseInt(raw.trim(), 10);
}

function pushOnOff(out: OpenXmlChild[], localName: string, value: boolean | undefined): void {
    if (value === undefined) {
        return;
    }
    out.push(serializeOnOff(localName, value));
}

// ---------------------------------------------------------------------------
// Style
// ---------------------------------------------------------------------------

/**
 * Base live style definition (`w:style`).
 *
 * Paragraph and character styles are {@link ParagraphStyle} / {@link CharacterStyle}.
 * Table and numbering styles are internal opaque instances.
 *
 * @public
 */
export abstract class Style implements CharacterFormatHost {
    private readonly styleIdValue: string;
    private readonly typeValue: DocxStyleType | undefined;
    private readonly defaultValue: boolean | undefined;
    private customStyleValue: boolean | undefined;
    private nameValue: string | undefined;
    private aliasesValue: string | undefined;
    /** Raw `w:basedOn/@w:val` — preserved even when unresolved. */
    private basedOnIdValue: string | undefined;
    private nextIdValue: string | undefined;
    private linkIdValue: string | undefined;
    private uiPriorityValue: number | undefined;
    private autoRedefineValue: boolean | undefined;
    private hiddenValue: boolean | undefined;
    private semiHiddenValue: boolean | undefined;
    private unhideWhenUsedValue: boolean | undefined;
    private qFormatValue: boolean | undefined;
    private lockedValue: boolean | undefined;
    private extraAttributesValue: OpenXmlAttribute[];
    /**
     * Non-modeled children except `w:pPr` / `w:rPr` (those live on format facades).
     * Order preserved for serialize.
     */
    private opaqueChildrenValue: OpenXmlElement[];
    private ownerValue: StyleOwner | undefined;
    private attachedValue: boolean;
    private readonly characterFormatValue: CharacterFormat;
    private suppressDirty: boolean;

    /**
     * @param {string} styleId - The style id.
     * @param {DocxStyleType | undefined} type - The type.
     * @param {boolean | undefined} defaultFlag - The default flag.
     * @param {boolean | undefined} customStyle - The custom style.
     * @private
     */
    protected constructor(
        styleId: string,
        type: DocxStyleType | undefined,
        defaultFlag: boolean | undefined,
        customStyle: boolean | undefined
    ) {
        if (styleId.length === 0) {
            throw new InvalidArgumentError('Style id must not be empty');
        }
        this.styleIdValue = styleId;
        this.typeValue = type;
        this.defaultValue = defaultFlag;
        this.customStyleValue = customStyle;
        this.nameValue = undefined;
        this.aliasesValue = undefined;
        this.basedOnIdValue = undefined;
        this.nextIdValue = undefined;
        this.linkIdValue = undefined;
        this.uiPriorityValue = undefined;
        this.autoRedefineValue = undefined;
        this.hiddenValue = undefined;
        this.semiHiddenValue = undefined;
        this.unhideWhenUsedValue = undefined;
        this.qFormatValue = undefined;
        this.lockedValue = undefined;
        this.extraAttributesValue = [];
        this.opaqueChildrenValue = [];
        this.ownerValue = undefined;
        this.attachedValue = false;
        this.suppressDirty = false;
        this.characterFormatValue = new CharacterFormat(this);
    }

    // ---- Identity ----

    /**
     * Stable OOXML style identity (`w:style/@w:styleId`).
     *
     *
     * @private
     */
    get styleId(): string {
        return this.styleIdValue;
    }

    /**
     * Style type (`w:style/@w:type`), when present.
     *
     * @public
     */
    get type(): DocxStyleType | undefined {
        return this.typeValue;
    }

    /**
     * Whether this is the default style of its type (`@w:default`).
     *
     * @public
     */
    get isDefault(): boolean | undefined {
        return this.defaultValue;
    }

    /**
     * Customer-defined style flag (`@w:customStyle`).
     *
     * @public
     */
    get customStyle(): boolean | undefined {
        return this.customStyleValue;
    }

    /**
     * Display name (`w:name/@w:val`). Mutable; does not change {@link styleId}.
     *
     * @public
     */
    get name(): string | undefined {
        return this.nameValue;
    }
    set name(value: string | undefined) {
        this.ensureAttached();
        this.nameValue = value;
        this.markDirty();
    }

    /**
     * Style-level character formatting (`w:rPr`). Stable facade identity.
     *
     * @public
     */
    get characterFormat(): CharacterFormat {
        return this.characterFormatValue;
    }

    /**
     * Owning collection infrastructure, when attached.
     *
     * @private
     */
    get owner(): StyleOwner | undefined {
        return this.ownerValue;
    }

    /**
     * Whether this style is attached to a document styles collection.
     *
     * @private
     */
    get isAttached(): boolean {
        return this.attachedValue && this.ownerValue !== undefined;
    }

    // ---- Base style (Option A) ----

    /**
     * Raw `w:basedOn/@w:val` (may be unresolved).
     *
     * @private
     */
    get basedOnId(): string | undefined {
        return this.basedOnIdValue;
    }

    /**
     * Resolved base style of the same public kind, when present and attached.
     *
     * @public
     */
    get baseStyle(): Style | undefined {
        if (this.basedOnIdValue === undefined || this.basedOnIdValue.length === 0) {
            return undefined;
        }
        if (this.ownerValue === undefined) {
            return undefined;
        }
        const resolved: Style = this.ownerValue.lookupStyle(this.basedOnIdValue);
        if (resolved === undefined) {
            return undefined;
        }
        if (this.typeValue !== undefined && resolved.type !== undefined && resolved.type !== this.typeValue) {
            return undefined;
        }
        return resolved;
    }

    /**
     * Set base style by instance or style id (same-type, same-document).
     *
     * Pass `undefined` to clear the relationship.
     *
     * @param {Style | string | undefined} styleOrId - The style or id.
     * @returns {void} Nothing is returned.
     * @public
     */
    applyBaseStyle(styleOrId: Style | string | undefined): void {
        this.ensureAttached();
        if (styleOrId === undefined) {
            this.basedOnIdValue = undefined;
            this.markDirty();
            return;
        }
        let target: Style | undefined;
        if (typeof styleOrId === 'string') {
            if (styleOrId.length === 0) {
                throw new InvalidArgumentError('Base style id must not be empty');
            }
            if (this.ownerValue === undefined) {
                throw new DetachedObjectError('Cannot resolve base style on a detached style');
            }
            target = this.ownerValue.lookupStyle(styleOrId);
            if (target === undefined) {
                // Preserve raw id (dangling basedOn is valid OOXML).
                this.basedOnIdValue = styleOrId;
                this.markDirty();
                return;
            }
        } else {
            target = styleOrId;
        }
        if (target === this) {
            throw new DocxError('styles/circular-based-on', `Style "${this.styleIdValue}" cannot be based on itself`);
        }
        if (!target.isAttached || target.owner !== this.ownerValue) {
            throw new DocxError('argument/invalid', 'Base style must belong to the same document styles collection');
        }
        if (this.typeValue !== undefined && target.type !== undefined && target.type !== this.typeValue) {
            throw new DocxError(
                'styles/invalid-based-on',
                `Style "${this.styleIdValue}" basedOn "${target.styleId}" is a ${String(target.type)} style; expected ${this.typeValue}`
            );
        }
        // Indirect cycle: walk target's chain.
        let cursor: Style | undefined = target;
        const seen: Set<string> = new Set<string>();
        seen.add(this.styleIdValue);
        while (cursor !== undefined) {
            if (seen.has(cursor.styleId)) {
                throw new DocxError(
                    'styles/circular-based-on',
                    `Circular basedOn relationship on style "${this.styleIdValue}"`
                );
            }
            seen.add(cursor.styleId);
            const nextId: string = cursor.basedOnId;
            if (nextId === undefined || this.ownerValue === undefined) {
                break;
            }
            cursor = this.ownerValue.lookupStyle(nextId);
        }
        this.basedOnIdValue = target.styleId;
        this.markDirty();
    }

    // ---- Other metadata (public where useful) ----

    /**
     * `w:next/@w:val`.
     *
     * @private
     */
    get nextStyleId(): string | undefined {
        return this.nextIdValue;
    }
    set nextStyleId(value: string | undefined) {
        this.ensureAttached();
        this.nextIdValue = value;
        this.markDirty();
    }

    /**
     * `w:link/@w:val`.
     *
     * @private
     */
    get linkStyleId(): string | undefined {
        return this.linkIdValue;
    }
    set linkStyleId(value: string | undefined) {
        this.ensureAttached();
        this.linkIdValue = value;
        this.markDirty();
    }

    /** `w:uiPriority/@w:val`. @public */
    get uiPriority(): number | undefined {
        return this.uiPriorityValue;
    }
    set uiPriority(value: number | undefined) {
        this.ensureAttached();
        this.uiPriorityValue = value;
        this.markDirty();
    }

    /** `w:qFormat`. @public */
    get isQuickStyle(): boolean | undefined {
        return this.qFormatValue;
    }
    set isQuickStyle(value: boolean | undefined) {
        this.ensureAttached();
        this.qFormatValue = value;
        this.markDirty();
    }

    /** `w:semiHidden`. @public */
    get isSemiHidden(): boolean | undefined {
        return this.semiHiddenValue;
    }
    set isSemiHidden(value: boolean | undefined) {
        this.ensureAttached();
        this.semiHiddenValue = value;
        this.markDirty();
    }

    // ---- Host ----

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyCharacterFormatMutation(): void {
        this.ensureAttached();
        this.markDirty();
    }

    // ---- Lifecycle ----

    /**
     * Attach to a document styles owner. Idempotent when already attached to the same owner.
     *
     * @param {StyleOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     * @private
     */
    attach(owner: StyleOwner): void {
        if (this.attachedValue && this.ownerValue === owner) {
            return;
        }
        if (this.attachedValue && this.ownerValue !== undefined && this.ownerValue !== owner) {
            throw new DocxError('argument/invalid', `Style "${this.styleIdValue}" is already owned by another document`);
        }
        this.ownerValue = owner;
        this.attachedValue = true;
    }

    /**
     * Detach from the owning collection. Further mutations throw {@link DetachedObjectError}.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    detach(): void {
        this.attachedValue = false;
        this.ownerValue = undefined;
    }

    /**
     * Remove this style from the document styles collection: drop the `w:style`
     * definition, detach this instance, and clear content/catalog references to
     * its style id so save does not re-materialize a stub. After removal the
     * instance is detached; a second call throws {@link DetachedObjectError}.
     *
     * @returns {void} Nothing is returned.
     * @public
     */
    remove(): void {
        this.ensureAttached();
        const owner: StyleOwner = this.ownerValue;
        if (owner === undefined) {
            throw new DetachedObjectError(`Style "${this.styleIdValue}" is detached from its document`);
        }
        // StyleOwner is the lookup/dirty surface; collection owns private remove.
        const collection: StyleOwner & { remove?(styleOrId: string | Style): boolean } = owner as StyleOwner & {
            remove?(styleOrId: Style | string): boolean;
        };
        if (typeof collection.remove !== 'function') {
            throw new InvalidArgumentError(`Style "${this.styleIdValue}" owner does not support removal`);
        }
        collection.remove(this);
    }

    /**
     * Clear basedOn / next / link edges that point at `removedStyleId`.
     * Used by StyleCollection.remove (no dirty — caller marks once).
     *
     * @param {string} removedStyleId - The removed style id.
     * @returns {void} Nothing is returned.
     * @private
     */
    clearReferencesToStyleId(removedStyleId: string): void {
        if (this.basedOnIdValue === removedStyleId) {
            this.basedOnIdValue = undefined;
        }
        if (this.nextIdValue === removedStyleId) {
            this.nextIdValue = undefined;
        }
        if (this.linkIdValue === removedStyleId) {
            this.linkIdValue = undefined;
        }
    }

    /**
     * Hydrate modeled fields and format facades from a parsed {@link DocxStyle}
     * without marking dirty or running authoring exclusivity.
     *
     * @param {DocxStyle} source - The source.
     * @returns {void} Nothing is returned.
     * @private
     */
    hydrateFromDocxStyle(source: DocxStyle): void {
        this.suppressDirty = true;
        try {
            const shell: OpenXmlElement = source.serialize();
            const children: ReadonlyArray<OpenXmlElement> = elementChildren(shell);
            this.nameValue = readStringVal(children, 'name');
            this.aliasesValue = readStringVal(children, 'aliases');
            this.basedOnIdValue = readStringVal(children, 'basedOn');
            this.nextIdValue = readStringVal(children, 'next');
            this.linkIdValue = readStringVal(children, 'link');
            this.uiPriorityValue = parseDecimalChild(firstWmlChild(children, 'uiPriority'));
            this.autoRedefineValue = readOnOffChild(children, 'autoRedefine');
            this.hiddenValue = readOnOffChild(children, 'hidden');
            this.semiHiddenValue = readOnOffChild(children, 'semiHidden');
            this.unhideWhenUsedValue = readOnOffChild(children, 'unhideWhenUsed');
            this.qFormatValue = readOnOffChild(children, 'qFormat');
            this.lockedValue = readOnOffChild(children, 'locked');
            this.customStyleValue = source.customStyle;

            const rPr: OpenXmlElement = firstWmlChild(children, 'rPr');
            this.characterFormatValue.hydrate(characterSnapshotFromRPr(rPr));

            const pPr: OpenXmlElement = firstWmlChild(children, 'pPr');
            this.hydrateParagraphFormat(paragraphSnapshotFromPPr(pPr));

            const opaque: OpenXmlElement[] = [];
            for (const child of children) {
                if (child === undefined) {
                    continue;
                }
                if (isWml(child, child.localName)) {
                    if (MODELED_META_NAMES.has(child.localName)) {
                        continue;
                    }
                    if (child.localName === 'pPr' || child.localName === 'rPr') {
                        continue;
                    }
                }
                opaque.push(child);
            }
            this.opaqueChildrenValue = opaque;

            // Extra attributes from the style element (unknown attrs).
            const knownAttr: Set<string> = new Set(['styleId', 'type', 'default', 'customStyle']);
            this.extraAttributesValue = shell.attributes.filter((a: OpenXmlAttribute) => {
                return !(knownAttr.has(a.localName) && (a.namespaceUri === WML || a.namespaceUri === ''));
            });
        } finally {
            this.suppressDirty = false;
        }
    }

    /**
     * Subclasses with paragraph format hydrate here; default no-op.
     *
     * @param {ParagraphFormatSnapshot} _snapshot - The  snapshot.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected hydrateParagraphFormat(_snapshot: ParagraphFormatSnapshot): void {
    // CharacterStyle / OpaqueStyle without PF: ignore pPr snapshot (Opaque may override).
    }

    /**
     * Subclasses contribute `w:pPr` during serialize.
     *
     * @param {OpenXmlChild[]} _out - The  out.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected serializeParagraphProperties(_out: OpenXmlChild[]): void {
    // default none
    }

    /**
     * Serialize this live style to a `w:style` element.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    serialize(): OpenXmlElement {
        const attributes: OpenXmlAttribute[] = [];
        if (this.typeValue !== undefined) {
            attributes.push(wmlAttr('type', this.typeValue));
        }
        attributes.push(wmlAttr('styleId', this.styleIdValue));
        if (this.defaultValue !== undefined) {
            attributes.push(wmlAttr('default', this.defaultValue ? '1' : '0'));
        }
        if (this.customStyleValue !== undefined) {
            attributes.push(wmlAttr('customStyle', this.customStyleValue ? '1' : '0'));
        }
        for (const attribute of this.extraAttributesValue) {
            attributes.push(attribute);
        }

        const out: OpenXmlChild[] = [];
        const nameVal: string = this.nameValue != null ? this.nameValue : this.styleIdValue;
        out.push(wmlElement('name', { attributes: [wmlAttr('val', nameVal)] }));
        if (this.aliasesValue !== undefined) {
            out.push(wmlElement('aliases', { attributes: [wmlAttr('val', this.aliasesValue)] }));
        }
        if (this.basedOnIdValue !== undefined) {
            out.push(wmlElement('basedOn', { attributes: [wmlAttr('val', this.basedOnIdValue)] }));
        }
        if (this.nextIdValue !== undefined) {
            out.push(wmlElement('next', { attributes: [wmlAttr('val', this.nextIdValue)] }));
        }
        if (this.linkIdValue !== undefined) {
            out.push(wmlElement('link', { attributes: [wmlAttr('val', this.linkIdValue)] }));
        }
        pushOnOff(out, 'autoRedefine', this.autoRedefineValue);
        pushOnOff(out, 'hidden', this.hiddenValue);
        if (this.uiPriorityValue !== undefined) {
            out.push(wmlElement('uiPriority', { attributes: [wmlAttr('val', String(this.uiPriorityValue))] }));
        }
        pushOnOff(out, 'semiHidden', this.semiHiddenValue);
        pushOnOff(out, 'unhideWhenUsed', this.unhideWhenUsedValue);
        pushOnOff(out, 'qFormat', this.qFormatValue);
        pushOnOff(out, 'locked', this.lockedValue);

        // Opaque children (tblPr, tblStylePr, personal*, rsid, …) before pPr/rPr
        // keeps table style structure intact; modeled pPr/rPr append after.
        for (const element of this.opaqueChildrenValue) {
            out.push(element);
        }

        this.serializeParagraphProperties(out);

        const rPrChildren: OpenXmlElement[] = this.characterFormatValue.buildRPrChildren();
        // Style-level rPr must not emit nested rStyle (styleIdValue on CF).
        const filteredRPr: OpenXmlElement[] = [];
        for (const child of rPrChildren) {
            if (isWml(child, 'rStyle')) {
                continue;
            }
            filteredRPr.push(child);
        }
        if (filteredRPr.length > 0) {
            out.push(wmlElement('rPr', { children: filteredRPr }));
        }

        return wmlElement('style', { attributes, children: out });
    }

    /**
     * Character-format snapshot for the effective-format resolver.
     *
     * @returns {CharacterFormatSnapshot} The result.
     * @private
     */
    characterFormatSnapshot(): CharacterFormatSnapshot {
        return this.characterFormatValue.snapshot();
    }

    /**
     * Project this live style to a temporary DocxStyle shell (resolver / TableStyle).
     *
     * @returns {DocxStyle} The result.
     * @private
     */
    toDocxStyle(): DocxStyle {
        const parsed: DocxStyle = parseDocxStyle(this.serialize());
        if (parsed !== undefined) {
            return parsed;
        }
        return new DocxStyle(
            this.styleIdValue,
            this.typeValue,
            this.defaultValue,
            this.customStyleValue,
            elementChildren(this.serialize()).slice()
        );
    }

    /**
     * Replace live fields from a DocxStyle shell (TableStyle mutation path).
     * Does not require attach; used while the style remains document-owned.
     *
     * @param {DocxStyle} shell - The shell.
     * @returns {void} Nothing is returned.
     * @private
     */
    replaceShell(shell: DocxStyle): void {
        if (shell.styleId !== this.styleIdValue) {
            throw new DocxError(
                'argument/invalid',
                `Cannot replace style shell: styleId "${shell.styleId}" does not match "${this.styleIdValue}"`
            );
        }
        this.hydrateFromDocxStyle(shell);
        this.markDirty();
    }

    /**
     * Normalized display name for catalog lookup.
     *
     * @returns {string} The result.
     * @private
     */
    normalizedName(): string {
        const n: string = this.nameValue;
        if (n !== undefined && n.length > 0) {
            return normalizeStyleName(n);
        }
        return normalizeStyleName(this.styleIdValue);
    }

    /**
     * Opaque children retained for package fidelity (table props, conditionals, …).
     *
     * @returns {OpenXmlElement[]} The result.
     * @private
     */
    protected getOpaqueChildren(): OpenXmlElement[] {
        return this.opaqueChildrenValue;
    }

    /**
     * Replace opaque children (TableStyle base props / tblStylePr).
     *
     * @param {OpenXmlElement[]} children - The children.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected setOpaqueChildren(children: OpenXmlElement[]): void {
        this.opaqueChildrenValue = children.slice();
        this.markDirty();
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    protected ensureAttached(): void {
        if (!this.attachedValue || this.ownerValue === undefined) {
            throw new DetachedObjectError(`Style "${this.styleIdValue}" is detached from its document`);
        }
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    protected markDirty(): void {
        if (this.suppressDirty) {
            return;
        }
        if (this.ownerValue !== undefined) {
            this.ownerValue.markStylesDirty();
        }
    }

    /**
     * Set metadata used when creating a minimal / seed style (no dirty).
     *
     * @param {string | undefined} name - The name.
     * @param {string | undefined} basedOnId - The based on id.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected seedIdentity(name: string | undefined, basedOnId: string | undefined): void {
        this.suppressDirty = true;
        try {
            this.nameValue = name;
            this.basedOnIdValue = basedOnId;
        } finally {
            this.suppressDirty = false;
        }
    }

    /**
     * Hydrate CF from snapshot without dirty (catalog / seed).
     *
     * @param {CharacterFormatSnapshot} snapshot - The snapshot.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected hydrateCharacterSnapshot(snapshot: CharacterFormatSnapshot): void {
        this.suppressDirty = true;
        try {
            this.characterFormatValue.hydrate(snapshot);
        } finally {
            this.suppressDirty = false;
        }
    }

    /**
     * Internal write of basedOn id during hydrate/seed (no dirty, no attach check).
     *
     * @param {string | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    setBasedOnIdInternal(value: string | undefined): void {
        this.basedOnIdValue = value;
    }

    /**
     * Internal next/link/ui flags during hydrate/seed.
     *
     * @param {Object} meta - The meta.
     * @returns {void} Nothing is returned.
     * @private
     */
    setMetaInternal(meta: {
        nextId?: string;
        linkId?: string;
        uiPriority?: number;
        semiHidden?: boolean;
        unhideWhenUsed?: boolean;
        qFormat?: boolean;
        aliases?: string;
        autoRedefine?: boolean;
        hidden?: boolean;
        locked?: boolean;
    }): void {
        if (meta.nextId !== undefined) {
            this.nextIdValue = meta.nextId;
        }
        if (meta.linkId !== undefined) {
            this.linkIdValue = meta.linkId;
        }
        if (meta.uiPriority !== undefined) {
            this.uiPriorityValue = meta.uiPriority;
        }
        if (meta.semiHidden !== undefined) {
            this.semiHiddenValue = meta.semiHidden;
        }
        if (meta.unhideWhenUsed !== undefined) {
            this.unhideWhenUsedValue = meta.unhideWhenUsed;
        }
        if (meta.qFormat !== undefined) {
            this.qFormatValue = meta.qFormat;
        }
        if (meta.aliases !== undefined) {
            this.aliasesValue = meta.aliases;
        }
        if (meta.autoRedefine !== undefined) {
            this.autoRedefineValue = meta.autoRedefine;
        }
        if (meta.hidden !== undefined) {
            this.hiddenValue = meta.hidden;
        }
        if (meta.locked !== undefined) {
            this.lockedValue = meta.locked;
        }
    }

    /**
     * @private
     */
    get nextIdInternal(): string | undefined {
        return this.nextIdValue;
    }

    /**
     * @private
     */
    get linkIdInternal(): string | undefined {
        return this.linkIdValue;
    }
}

// ---------------------------------------------------------------------------
// ParagraphStyle
// ---------------------------------------------------------------------------

/**
 * Paragraph style (`w:type="paragraph"`) with paragraph and character format facades.
 *
 * @public
 */
export class ParagraphStyle extends Style implements ParagraphFormatHost {
    private readonly paragraphFormatValue: ParagraphFormat;

    /**
     * @param {string} styleId - The style id.
     * @param {boolean | undefined} defaultFlag - The default flag.
     * @param {boolean | undefined} customStyle - The custom style.
     * @private
     */
    constructor(
        styleId: string,
        defaultFlag?: boolean | undefined,
        customStyle?: boolean | undefined
    ) {
        super(styleId, 'paragraph', defaultFlag, customStyle);
        this.paragraphFormatValue = new ParagraphFormat(this);
    }

    /**
     * Style-level paragraph formatting (`w:pPr`). Stable facade identity.
     *
     * @public
     */
    get paragraphFormat(): ParagraphFormat {
        return this.paragraphFormatValue;
    }

    /**
     * Resolved paragraph base style, when present.
     *
     * @public
     */
    get baseParagraphStyle(): ParagraphStyle | undefined {
        const base: Style = this.baseStyle;
        if (base instanceof ParagraphStyle) {
            return base;
        }
        return undefined;
    }

    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyParagraphFormatMutation(): void {
        this.ensureAttached();
        this.markDirty();
    }

    /**
     * @param {ParagraphFormatSnapshot} snapshot - The snapshot.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected hydrateParagraphFormat(snapshot: ParagraphFormatSnapshot): void {
    // Called only from Style.hydrateFromDocxStyle (suppressDirty already true).
    // hydrate() does not notify the host.
        this.paragraphFormatValue.hydrate(snapshot);
    }

    /**
     * @param {OpenXmlChild[]} out - The out.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected serializeParagraphProperties(out: OpenXmlChild[]): void {
        const children: OpenXmlElement[] = this.paragraphFormatValue.buildPPrChildren();
        if (children.length > 0) {
            out.push(wmlElement('pPr', { children }));
        }
    }

    /**
     * @returns {ParagraphFormatSnapshot} The result.
     * @private
     */
    paragraphFormatSnapshot(): ParagraphFormatSnapshot {
        return this.paragraphFormatValue.snapshot();
    }

    /**
     * Create a minimal paragraph style (ensure / authoring).
     *
     * @param {string} styleId - The style id.
     * @returns {ParagraphStyle} The result.
     * @private
     */
    static createMinimal(styleId: string): ParagraphStyle {
        const style: ParagraphStyle = new ParagraphStyle(styleId, undefined, true);
        style.seedIdentity(styleId, undefined);
        return style;
    }

    /**
     * Hydrate a paragraph style from a parsed DocxStyle shell.
     *
     * @param {DocxStyle} source - The source.
     * @returns {ParagraphStyle} The result.
     * @private
     */
    static fromDocxStyle(source: DocxStyle): ParagraphStyle {
        const style: ParagraphStyle = new ParagraphStyle(source.styleId, source.default, source.customStyle);
        style.hydrateFromDocxStyle(source);
        return style;
    }
}

// ---------------------------------------------------------------------------
// CharacterStyle
// ---------------------------------------------------------------------------

/**
 * Character style (`w:type="character"`) with a character format facade only.
 *
 * @public
 */
export class CharacterStyle extends Style {
    /**
     * @param {string} styleId - The style id.
     * @param {boolean | undefined} defaultFlag - The default flag.
     * @param {boolean | undefined} customStyle - The custom style.
     * @private
     */
    constructor(
        styleId: string,
        defaultFlag?: boolean | undefined,
        customStyle?: boolean | undefined
    ) {
        super(styleId, 'character', defaultFlag, customStyle);
    }

    /**
     * Resolved character base style, when present.
     *
     * @public
     */
    get baseCharacterStyle(): CharacterStyle | undefined {
        const base: Style = this.baseStyle;
        if (base instanceof CharacterStyle) {
            return base;
        }
        return undefined;
    }

    /**
     * Create a minimal character style (ensure / authoring).
     *
     * @param {string} styleId - The style id.
     * @returns {CharacterStyle} The result.
     * @private
     */
    static createMinimal(styleId: string): CharacterStyle {
        const style: CharacterStyle = new CharacterStyle(styleId, undefined, true);
        style.seedIdentity(styleId, undefined);
        return style;
    }

    /**
     * Hydrate a character style from a parsed DocxStyle shell.
     *
     * @param {DocxStyle} source - The source.
     * @returns {CharacterStyle} The result.
     * @private
     */
    static fromDocxStyle(source: DocxStyle): CharacterStyle {
        const style: CharacterStyle = new CharacterStyle(source.styleId, source.default, source.customStyle);
        style.hydrateFromDocxStyle(source);
        return style;
    }
}

// ---------------------------------------------------------------------------
// OpaqueStyle (table / numbering / unknown) — not a public API type
// ---------------------------------------------------------------------------

/**
 * Non-paragraph, non-character style retained for package fidelity.
 * Not part of the public Styles DOM surface.
 *
 * @private
 */
export class OpaqueStyle extends Style {
    private paragraphFormatValue: ParagraphFormat | undefined;

    /**
     * @param {string} styleId - The style id.
     * @param {DocxStyleType | undefined} type - The type.
     * @param {boolean | undefined} defaultFlag - The default flag.
     * @param {boolean | undefined} customStyle - The custom style.
     * @private
     */
    constructor(
        styleId: string,
        type: DocxStyleType | undefined,
        defaultFlag: boolean | undefined,
        customStyle: boolean | undefined
    ) {
        super(styleId, type, defaultFlag, customStyle);
    }

    /**
     * @param {ParagraphFormatSnapshot} snapshot - The snapshot.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected hydrateParagraphFormat(snapshot: ParagraphFormatSnapshot): void {
        if (this.paragraphFormatValue === undefined) {
            // Lazy PF only when pPr present — OpaqueStyle implements host inline.
            this.paragraphFormatValue = new ParagraphFormat({
                notifyParagraphFormatMutation: (): void => {
                    this.ensureAttached();
                    this.markDirty();
                }
            });
        }
        this.paragraphFormatValue.hydrate(snapshot);
    }

    /**
     * @param {OpenXmlChild[]} out - The out.
     * @returns {void} Nothing is returned.
     * @private
     */
    protected serializeParagraphProperties(out: OpenXmlChild[]): void {
        if (this.paragraphFormatValue === undefined) {
            return;
        }
        const children: OpenXmlElement[] = this.paragraphFormatValue.buildPPrChildren();
        if (children.length > 0) {
            out.push(wmlElement('pPr', { children }));
        }
    }

    /**
     * @param {DocxStyle} source - The source.
     * @returns {OpaqueStyle} The result.
     * @private
     */
    static fromDocxStyle(source: DocxStyle): OpaqueStyle {
        const style: OpaqueStyle = new OpaqueStyle(source.styleId, source.type, source.default, source.customStyle);
        style.hydrateFromDocxStyle(source);
        return style;
    }
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/**
 * Build a live Style from a temporary {@link DocxStyle} parse/catalog shell.
 * Does not attach; caller attaches via the collection.
 * Table styles are created as {@link OpaqueStyle} here — the collection upgrades
 * `type === 'table'` shells to {@link TableStyle}.
 *
 * @param {DocxStyle} source - The source.
 * @returns {Style} The result.
 * @private
 */
export function createStyleFromDocxStyle(source: DocxStyle): Style {
    if (source.type === 'paragraph') {
        return ParagraphStyle.fromDocxStyle(source);
    }
    if (source.type === 'character') {
        return CharacterStyle.fromDocxStyle(source);
    }
    return OpaqueStyle.fromDocxStyle(source);
}

/**
 * Alias for {@link createStyleFromDocxStyle} (legacy shell projection name).
 *
 * @param {DocxStyle} shell - The shell.
 * @returns {Style} The result.
 * @private
 */
export function styleFromDocxShell(shell: DocxStyle): Style {
    return createStyleFromDocxStyle(shell);
}

/**
 * Minimal paragraph or character style for ensure / pending materialize.
 *
 * @param {string} styleId - The style id.
 * @param {string | string} type - The type.
 * @returns {Style} The result.
 * @private
 */
export function createMinimalStyle(styleId: string, type: 'paragraph' | 'character'): Style {
    if (type === 'paragraph') {
        return ParagraphStyle.createMinimal(styleId);
    }
    return CharacterStyle.createMinimal(styleId);
}
