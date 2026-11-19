import { DetachedObjectError, DocxError, SecurityError } from '../../core/errors/docx-error';
import { Math } from '../math/math';
import { BookmarkStart, BookmarkEnd } from '../bookmarks/index';
import { FeatureId } from '../../core/registry/feature-registry';
import { serializeFeatureRunLeaf, tryParseFeatureRunLeaf, FeatureRunLeafContent } from '../../core/registry/run-leaf-handlers';
import { DEFAULT_RESOURCE_LIMITS } from '../../core/security/limits';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import {
    CharacterFormat,
    CharacterFormatDelta,
    CharacterFormatHost,
    CharacterFormatSnapshot,
    parseCharacterFormat
} from './character-format';
import { FeatureInline } from './feature-inline';
import { FeatureRunLeaf } from './feature-run-leaf';
import { ParagraphItem, ParagraphItemOwner } from './paragraph-item';
export { ParagraphItem, ParagraphItemOwner } from './paragraph-item';
import { EntityType } from './entity-type';
import { elementChildren, isWml, textContent, wmlAttr, wmlElement, xmlSpaceIsPreserve, xmlSpacePreserve } from './wml';
import { Field, FieldMark, FormField } from '../fields/paragraph-field';

// ---------------------------------------------------------------------------
// Break leaf — ECMA-376-1 §17.3.3.1–2; CT_Br / ST_BrType / ST_BrClear
// ---------------------------------------------------------------------------
/**
 * Break kind for `w:br` (`ST_BrType` plus the Line default).
 *
 * OOXML has no `@w:type="line"` value: a line break is a bare `w:br` (type omitted).
 * Text-wrapping breaks use `@w:type="textWrapping"`.
 *
 * Citation: ECMA-376-1 §17.3.3.1–2; transitional `wml.xsd` `CT_Br` / `ST_BrType`.
 *
 * @public
 */
export enum BreakType {
    /**
     * Page break. Maps to `w:br` with `@w:type="page"`.
     */
    PageBreak = 'page',
    /**
     * Column break. Maps to `w:br` with `@w:type="column"`.
     */
    ColumnBreak = 'column',
    /**
     * Line break (Shift+Enter / soft break). Maps to a bare `w:br` (type omitted).
     */
    LineBreak = 'line',
    /**
     * Text-wrapping break. Maps to `w:br` with `@w:type="textWrapping"`.
     */
    TextWrappingBreak = 'textWrapping'
}

/**
 * Text-wrapping clear for a line or text-wrapping break (`ST_BrClear`).
 * Internal / parse-serialize only — not part of the public Break API surface.
 *
 * Citation: ECMA-376-1 §17.3.3.2; transitional `wml.xsd` `ST_BrClear`.
 *
 * @private
 */
export enum BreakClearType {
    None = 'none',
    Left = 'left',
    Right = 'right',
    All = 'all'
}

// ---------------------------------------------------------------------------
// Wire group — private shared w:r character format + attributes
// ---------------------------------------------------------------------------
/**
 * @private
 * Shared identity for paragraph items that serialize inside one physical `w:r`.
 * Owns `w:rPr` ({@link CharacterFormat}) and unmodeled `w:r` attributes.
 */
export class WireRunGroup implements CharacterFormatHost {
    private characterFormatField: CharacterFormat | undefined;
    private extraAttributesValue: ReadonlyArray<OpenXmlAttribute>;
    constructor(extraAttributes?: ReadonlyArray<OpenXmlAttribute>) {
        this.extraAttributesValue = extraAttributes != null ? extraAttributes : [];
    }
    get characterFormat(): CharacterFormat {
        if (this.characterFormatField === undefined) {
            this.characterFormatField = new CharacterFormat(this);
        }
        return this.characterFormatField;
    }
    get extraAttributes(): ReadonlyArray<OpenXmlAttribute> {
        return this.extraAttributesValue;
    }
    setExtraAttributes(attrs: ReadonlyArray<OpenXmlAttribute>): void {
        this.extraAttributesValue = attrs;
    }
    notifyCharacterFormatMutation(): void {
        // Host is paragraph-owned; mutation is gated by the item owner.
    }
    hydrateCharacterFormat(data: CharacterFormatSnapshot): void {
        this.characterFormat.hydrate(data);
    }
    snapshotCharacterFormat(): CharacterFormatSnapshot {
        return this.characterFormat.snapshot();
    }
}

/**
 * @private
 * Marker on every run-level paragraph item that shares a {@link WireRunGroup}.
 */
export interface WireRunMember {
    /**
     * @private
     */
    readonly wireGroup: WireRunGroup;
}

/**
 *  Base for run-level items that share a WireRunGroup + CharacterFormatHost.
 *
 * @private
 */
abstract class WireRunParagraphItem extends ParagraphItem implements CharacterFormatHost, WireRunMember {
    private wireGroupValue: WireRunGroup;
    constructor(wireGroup?: WireRunGroup) {
        super();
        this.wireGroupValue = wireGroup != null ? wireGroup : new WireRunGroup();
    }
    /**
     * @private
     */
    get wireGroup(): WireRunGroup {
        return this.wireGroupValue;
    }
    /**
     * Character formatting for this item (`w:rPr`), shared with siblings from the same `w:r`.
     * @public
     */
    get characterFormat(): CharacterFormat {
        return this.wireGroupValue.characterFormat;
    }
    /**
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyCharacterFormatMutation(): void {
        this.mutate();
    }
}

// ---------------------------------------------------------------------------
// Concrete paragraph items
// ---------------------------------------------------------------------------

/**
 * Tab stop character in a paragraph (`w:r/w:tab`).
 * @public
 */
export class Tab extends WireRunParagraphItem {
    /**
     * Discriminant for {@link Paragraph.items} / {@link paragraphElementTypeOf}.
     * @public
     */
    readonly type: EntityType.AbsoluteTab = EntityType.AbsoluteTab;
    /**
     *  @private
     *
     * @param {WireRunGroup} wireGroup - The wire group.
     */
    constructor(wireGroup?: WireRunGroup) {
        super(wireGroup);
    }
}

/**
 * Carriage return in a paragraph (`w:r/w:cr`).
 * @private
 */
export class CarriageReturn extends WireRunParagraphItem {
    /**
     * Discriminant for {@link Paragraph.items} / {@link paragraphElementTypeOf}.
     * @public
     */
    readonly type: string = 'carriageReturn';
    /**
     *  @private
     *
     * @param {WireRunGroup} wireGroup - The wire group.
     */
    constructor(wireGroup?: WireRunGroup) {
        super(wireGroup);
    }
}

/**
 * Symbol character in a paragraph (`w:r/w:sym`).
 * @private
 */
export class Symbol extends WireRunParagraphItem {
    /**
     * Discriminant for {@link Paragraph.items} / {@link paragraphElementTypeOf}.
     * @public
     */
    readonly type: EntityType.Symbol = EntityType.Symbol;
    private fontValue: string;
    private charValue: string;
    /**
     * @param {string} font - The font.
     * @param {string} char - The char.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @private
     */
    constructor(font: string, char: string, wireGroup?: WireRunGroup) {
        super(wireGroup);
        this.fontValue = font;
        this.charValue = char;
    }
    /**
     * Symbol font name (`w:font`).
     * @public
     */
    get font(): string {
        return this.fontValue;
    }
    set font(value: string) {
        this.mutate();
        this.fontValue = value;
    }
    /**
     * Character code as `ST_ShortHexNumber` hex digits (`w:char`).
     * @public
     */
    get char(): string {
        return this.charValue;
    }
    set char(value: string) {
        this.mutate();
        this.charValue = value;
    }
}

/**
 * Break in a paragraph (`w:r/w:br` / `CT_Br`).
 *
 * Always serialized as run content (`w:r/w:br`). Clear and extras are internal
 * round-trip state — not part of the public authoring API.
 *
 * Citation: ECMA-376-1 §17.3.3.1–2; transitional `wml.xsd` `CT_Br`.
 *
 * @public
 */
export class Break extends WireRunParagraphItem {
    /**
     * Discriminant for {@link Paragraph.items} / {@link paragraphElementTypeOf}.
     * @public
     */
    readonly type: EntityType.Break = EntityType.Break;
    private breakTypeValue: BreakType;
    /**
     * Present when clear is not None (`left`|`right`|`all`).
     *
     * @private
     */
    private clearValue: Exclude<BreakClearType, typeof BreakClearType.None> | undefined;
    /**
     * Unmodeled or unknown attributes (round-trip).
     *
     * @private
     */
    private extrasValue: ReadonlyArray<OpenXmlAttribute>;
    /**
     * @param {BreakType} breakType - The break type.
     * @param {BreakClearType} clear - The clear.
     * @param {ReadonlyArray<OpenXmlAttribute>} extras - The extras.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @private
     */
    constructor(
        breakType: BreakType,
        clear?: BreakClearType,
        extras?: ReadonlyArray<OpenXmlAttribute>,
        wireGroup?: WireRunGroup
    ) {
        super(wireGroup);
        this.breakTypeValue = breakType;
        if (clear !== undefined && clear !== BreakClearType.None) {
            this.clearValue = clear;
        } else {
            this.clearValue = undefined;
        }
        this.extrasValue = extras != null ? extras : [];
    }
    /**
     * Break kind (`ST_BrType` plus the Line default).
     * @public
     */
    get breakType(): BreakType {
        return this.breakTypeValue;
    }
    set breakType(value: BreakType) {
        this.mutate();
        this.breakTypeValue = value;
    }
    /**
     * @private
     */
    get clear(): Exclude<BreakClearType, typeof BreakClearType.None> | undefined {
        return this.clearValue;
    }
    /**
     * @private
     */
    get extras(): ReadonlyArray<OpenXmlAttribute> {
        return this.extrasValue;
    }
}

/**
 * Feature-owned run-level content promoted onto {@link Paragraph.items}
 * (for example images). Storage uses a private tag; public classifiers map
 * to domain types.
 *
 * @private
 */
export class FeatureRunParagraphItem extends WireRunParagraphItem {
    readonly type: 'featureRun';
    readonly featureId: FeatureId;
    readonly value: FeatureRunLeaf;
    /**
     *  @private
     *
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureRunLeaf} value - The value.
     * @param {WireRunGroup} wireGroup - The wire group.
     */
    constructor(featureId: FeatureId, value: FeatureRunLeaf, wireGroup?: WireRunGroup) {
        super(wireGroup);
        this.type = 'featureRun';
        this.featureId = featureId;
        this.value = value;
    }
}

/**
 * Opaque unmodeled run child preserved for round-trip (`w:r/*`).
 *  Internal preservation item. Not part of the public API.
 *
 * @private
 */
export class OpaqueRunItem extends WireRunParagraphItem {
    readonly type: 'opaqueRun';
    readonly xml: OpenXmlElement;
    /**
     *  @private
     *
     * @param {OpenXmlElement} xml - The xml.
     * @param {WireRunGroup} wireGroup - The wire group.
     */
    constructor(xml: OpenXmlElement, wireGroup?: WireRunGroup) {
        super(wireGroup);
        this.type = 'opaqueRun';
        this.xml = xml;
    }
}

/**
 * Feature-owned inline sibling of runs (for example `w:hyperlink`).
 * Storage uses a private tag; public classifiers map to domain types.
 *
 * Concrete feature classes may extend {@link ParagraphItem} directly in a
 * later cut; this wrapper preserves FeatureInline payloads during migration.
 *
 * @private
 */
export class FeatureInlineParagraphItem extends ParagraphItem {
    readonly type: 'featureInline';
    readonly featureId: FeatureId;
    readonly value: FeatureInline;
    /**
     *  @private
     *
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureInline} value - The value.
     */
    constructor(featureId: FeatureId, value: FeatureInline) {
        super();
        this.type = 'featureInline';
        this.featureId = featureId;
        this.value = value;
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    protected onDetached(): void {
        if (this.value.releaseContent != null) {
            this.value.releaseContent();
        }
    }
}

/**
 * Opaque unmodeled paragraph child preserved for round-trip.
 * @public
 */
export class OpaqueParagraphItem extends ParagraphItem {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
    /**
     *  @private
     *
     * @param {OpenXmlElement} xml - The xml.
     */
    constructor(xml: OpenXmlElement) {
        super();
        this.type = 'opaque';
        this.xml = xml;
    }
}

export function needsXmlSpacePreserve(text: string): boolean {
    // Check for leading or trailing whitespace (including Unicode spaces like en-space)
    if (/^\s/.test(text) || /\s$/.test(text)) {
        return true;
    }
    // Check for multiple consecutive spaces or newlines
    if (text.includes('  ') || text.includes('\n')) {
        return true;
    }
    return false;
}

/**
 * Snapshot / hydrate bag for a text range: text content, wire-group linkage, and
 * character-format fields (merged from {@link CharacterFormat.snapshot}).
 *
 * @private
 */
interface TextRangeHydrateData extends CharacterFormatSnapshot {
    extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    text: string;
    xmlSpacePreserve: boolean;
}

/**
 * WordprocessingML text range — public face of text + character formatting.
 *
 * Physical OOXML remains `w:r` with optional `w:rPr` and `w:t`. Non-text run
 * children (breaks, tabs, symbols, images, …) appear as sibling
 * {@link ParagraphItem}s sharing a private {@link WireRunGroup} so serialization
 * can reconstruct the original run.
 *
 * Character formatting lives on {@link TextRange.characterFormat} only
 * (`docs/specs/run-character-format.md` Rev 2 / TASK-9019).
 *
 * @public
 */
export class TextRange extends WireRunParagraphItem {
    /**
     * Discriminant for {@link Paragraph.items} / {@link paragraphElementTypeOf}.
     * @public
     */
    readonly type: EntityType.TextRange = EntityType.TextRange;
    private textValue: string;
    private xmlSpacePreserveValue: boolean;
    /**
     * Create a text range. Prefer `new TextRange(document)` so property setters
     * work before the range is appended to a paragraph. Passing a paragraph-item
     * owner attaches immediately (internal / load paths).
     *
     * @param {ParagraphItemOwner | object} ownerOrDocument - The owner or document.
     * @param {WireRunGroup} wireGroup - The wire group.
     * @public
     */
    constructor(ownerOrDocument?: ParagraphItemOwner | object, wireGroup?: WireRunGroup) {
        super(wireGroup);
        this.textValue = '';
        this.xmlSpacePreserveValue = false;
        if (ownerOrDocument === undefined) {
            return;
        }
        const candidate: ParagraphItemOwner & { assertAttachedItem?: unknown } = ownerOrDocument as ParagraphItemOwner & {
            assertAttachedItem?: unknown;
        };
        if (typeof candidate.assertAttachedItem === 'function') {
            this.attach(candidate);
            return;
        }
        this.setDocumentContext(ownerOrDocument);
    }
    /**
     * Plain text of this range (`w:t`). Setter replaces the text content.
     * @public
     */
    get text(): string {
        return this.textValue;
    }
    set text(value: string) {
        this.mutate();
        if (value.length > DEFAULT_RESOURCE_LIMITS.textNodeLength) {
            throw new SecurityError('security/limit-exceeded', 'w:t exceeds the text node length limit');
        }
        this.textValue = value;
        this.xmlSpacePreserveValue = needsXmlSpacePreserve(value);
    }
    /**
     * Apply character formatting onto this range (DocIO-aligned).
     *
     * - {@link CharacterFormatDelta}: merges listed properties (`assign`).
     * - {@link CharacterFormat}: copies the full snapshot into this range's `rPr`.
     *
     * @param {CharacterFormatDelta | CharacterFormat} source - The source.
     * @returns {void} Nothing is returned.
     * @public
     */
    applyCharacterFormat(source: CharacterFormatDelta | CharacterFormat): void {
        if (source instanceof CharacterFormat) {
            this.characterFormat.hydrate(source.snapshot());
            return;
        }
        this.characterFormat.assign(source);
    }
    /**
     * @private
     */
    get xmlSpacePreserve(): boolean {
        return this.xmlSpacePreserveValue;
    }
    /**
     * @param {string} text - The text.
     * @param {boolean} preserveSpace - The preserve space.
     * @returns {void} Nothing is returned.
     *  Set text during parse without owner mutation checks or CF wipe.
     *
     * @private
     */
    setTextFromParse(text: string, preserveSpace: boolean): void {
        this.textValue = text;
        this.xmlSpacePreserveValue = preserveSpace;
    }
    /**
     * @returns {OpenXmlElement} The result.
     * @private
     * Advanced hatch: `w:r` tree for a lone text range. Unstable; prefer semantic properties.
     */
    toOpenXml(): OpenXmlElement {
        return serializeTextRange(this);
    }
    /**
     * @param {OpenXmlElement} el - The el.
     * @param {ParagraphItemOwner} owner - The owner.
     * @returns {TextRange} The result.
     * @private
     */
    static fromXml(el: OpenXmlElement, owner: ParagraphItemOwner): TextRange {
        const items: ConcreteParagraphItem[] = parseTextRangeGroup(el, owner);
        for (const item of items) {
            if (item instanceof TextRange) {
                return item as TextRange;
            }
        }
        const group: WireRunGroup = new WireRunGroup(el.attributes);
        let characterFormatData: CharacterFormatSnapshot | undefined;
        for (const child of elementChildren(el)) {
            if (isWml(child, 'rPr')) {
                characterFormatData = parseCharacterFormat(child);
            }
        }
        const tr: TextRange = new TextRange(owner, group);
        if (characterFormatData !== undefined) {
            group.hydrateCharacterFormat(characterFormatData);
        }
        return tr;
    }
    /**
     * @param {TextRangeHydrateData} data - The data.
     * @returns {void} Nothing is returned.
     * @private
     */
    hydrate(data: TextRangeHydrateData): void {
        this.wireGroup.setExtraAttributes(data.extraAttributes);
        this.textValue = data.text;
        this.xmlSpacePreserveValue = data.xmlSpacePreserve;
        const {
            extraAttributes: _extraAttributes,
            text: _text,
            xmlSpacePreserve: _xmlSpacePreserve,
            ...characterFormatData
        } = data;
        void _extraAttributes;
        void _text;
        void _xmlSpacePreserve;
        this.wireGroup.hydrateCharacterFormat(characterFormatData);
    }
    /**
     * @returns {TextRangeHydrateData} The result.
     * @private
     */
    snapshot(): TextRangeHydrateData {
        const cf: CharacterFormatSnapshot = this.characterFormat.snapshot();
        return {
            extraAttributes: this.wireGroup.extraAttributes,
            text: this.textValue,
            xmlSpacePreserve: this.xmlSpacePreserveValue,
            rPrExtra: cf.rPrExtra,
            styleIdValue: cf.styleIdValue,
            boldValue: cf.boldValue,
            italicValue: cf.italicValue,
            strikeValue: cf.strikeValue,
            doubleStrikeValue: cf.doubleStrikeValue,
            vanishValue: cf.vanishValue,
            legacyHiddenValue: cf.legacyHiddenValue,
            noProofValue: cf.noProofValue,
            fontSizeValue: cf.fontSizeValue,
            fontSizeBidiValue: cf.fontSizeBidiValue,
            textColorValue: cf.textColorValue,
            textColorTheme: cf.textColorTheme,
            highlightValue: cf.highlightValue,
            shadingValue: cf.shadingValue,
            underlineStyleValue: cf.underlineStyleValue,
            underlineColorValue: cf.underlineColorValue,
            vertAlignValue: cf.vertAlignValue,
            smallCapsValue: cf.smallCapsValue,
            allCapsValue: cf.allCapsValue,
            fontsValue: cf.fontsValue,
            characterScaleValue: cf.characterScaleValue,
            kerningValue: cf.kerningValue,
            characterSpacingValue: cf.characterSpacingValue,
            positionValue: cf.positionValue,
            borderValue: cf.borderValue,
            languageValue: cf.languageValue,
            embossValue: cf.embossValue,
            imprintValue: cf.imprintValue,
            outlineValue: cf.outlineValue,
            shadowValue: cf.shadowValue,
            webHiddenValue: cf.webHiddenValue,
            bidiValue: cf.bidiValue,
            complexScriptValue: cf.complexScriptValue,
            boldBidiValue: cf.boldBidiValue,
            italicBidiValue: cf.italicBidiValue,
            emphasisValue: cf.emphasisValue,
            textEffectValue: cf.textEffectValue,
            specVanishValue: cf.specVanishValue,
            snapToGridValue: cf.snapToGridValue
        };
    }
}

// Re-export base types for consumers that import from text-range.


// ---------------------------------------------------------------------------
// Break helpers
// ---------------------------------------------------------------------------
function isWrappingBreakType(type: BreakType): boolean {
    return type === BreakType.LineBreak || type === BreakType.TextWrappingBreak;
}
function createBreakItem(
    group: WireRunGroup,
    type: BreakType,
    clear: BreakClearType = BreakClearType.None,
    extras?: ReadonlyArray<OpenXmlAttribute>
): Break {
    if (clear !== BreakClearType.None && !isWrappingBreakType(type)) {
        throw new DocxError('content/invalid-break', 'w:br @w:clear is only valid with a line / text-wrapping break');
    }
    return new Break(type, clear, extras, group);
}
/**
 * @param {BreakType} type - The type.
 * @param {BreakClearType} clear - The clear.
 * @returns {Break} The result.
 *  Author a break item under a new wire group (single-item run).
 *
 * @private
 */
export function createStandaloneBreakItem(type: BreakType, clear?: BreakClearType): Break {
    return createBreakItem(new WireRunGroup(), type, clear != null ? clear : BreakClearType.None);
}
/**
 * @param {string} font - The font.
 * @param {string} char - The char.
 * @returns {Symbol} The result.
 *  Author a symbol item under a new wire group.
 *
 * @private
 */
export function createStandaloneSymbolItem(font: string, char: string): Symbol {
    return new Symbol(font, char, new WireRunGroup());
}
/**
 * @returns {Tab} The result.
 *  Author a tab item under a new wire group.
 *
 * @private
 */
export function createStandaloneTabItem(): Tab {
    return new Tab(new WireRunGroup());
}

/**
 * Split plain text on U+0009 into {@link TextRange} and {@link Tab} items that
 * share one {@link WireRunGroup} (one physical `w:r` with interleaved `w:t` /
 * `w:tab`). Empty segments around tabs are omitted. Text with no tab characters
 * yields a single {@link TextRange} (possibly empty). Tab-only text yields only
 * {@link Tab} items.
 *
 * Citation: ECMA-376-1 `EG_RunInnerContent` / `w:tab` (run-level tab character).
 *
 * @param {string} text - The text.
 * @param {WireRunGroup} wireGroup - The wire group.
 * @returns {ConcreteParagraphItem[]} The result.
 * @private
 */
export function createTextAndTabItems(text: string, wireGroup?: WireRunGroup): ConcreteParagraphItem[] {
    const group: WireRunGroup = wireGroup != null ? wireGroup : new WireRunGroup();
    if (text.indexOf('\t') < 0) {
        return [createDetachedTextRange(text, group)];
    }
    const parts: string[] = text.split('\t');
    const items: ConcreteParagraphItem[] = [];
    for (let i: number = 0; i < parts.length; i += 1) {
        const part: string = parts[i];
        if (part !== undefined && part.length > 0) {
            items.push(createDetachedTextRange(part, group));
        }
        if (i < parts.length - 1) {
            items.push(new Tab(group));
        }
    }
    return items;
}

/**
 * Author a detached {@link TextRange} with text set without owner mutation
 * (items are not yet on a paragraph). Enforces the same text-node length limit
 * as the public {@link TextRange.text} setter.
 *
 * @param {string} text - The text.
 * @param {WireRunGroup} group - The group.
 * @returns {TextRange} The result.
 * @private
 */
function createDetachedTextRange(text: string, group: WireRunGroup): TextRange {
    if (text.length > DEFAULT_RESOURCE_LIMITS.textNodeLength) {
        throw new SecurityError('security/limit-exceeded', 'w:t exceeds the text node length limit');
    }
    const tr: TextRange = new TextRange(undefined, group);
    tr.setTextFromParse(text, needsXmlSpacePreserve(text));
    return tr;
}

/**
 * Emit run-level children for plain text that may contain U+0009.
 * Tab characters become dedicated `w:tab` elements; text segments become `w:t`
 * (or `w:instrText` when `isFieldInstruction` is true — tabs stay in the string
 * there so field codes are not rewritten as run leaves).
 *
 * @param {string} text - The text.
 * @param {boolean} isFieldInstruction - The is field instruction.
 * @param {OpenXmlElement[]} into - The into.
 * @returns {void} Nothing is returned.
 * @private
 */
function appendSerializedTextLeaves(
    text: string,
    isFieldInstruction: boolean,
    into: OpenXmlElement[]
): void {
    if (isFieldInstruction || text.indexOf('\t') < 0) {
        const attributes: OpenXmlAttribute[] = isFieldInstruction || needsXmlSpacePreserve(text) ? [xmlSpacePreserve()] : [];
        const name: string = isFieldInstruction ? 'instrText' : 't';
        into.push(wmlElement(name, {
            attributes: attributes,
            children: [{ kind: 'text', value: text }]
        }));
        return;
    }
    const parts: string[] = text.split('\t');
    for (let i: number = 0; i < parts.length; i += 1) {
        const part: string = parts[i];
        if (part !== undefined && part.length > 0) {
            const attributes: OpenXmlAttribute[] = needsXmlSpacePreserve(part) ? [xmlSpacePreserve()] : [];
            into.push(wmlElement('t', {
                attributes: attributes,
                children: [{ kind: 'text', value: part }]
            }));
        }
        if (i < parts.length - 1) {
            into.push(wmlElement('tab'));
        }
    }
}

// ---------------------------------------------------------------------------
// Parse w:r → flat paragraph items sharing one WireRunGroup
// ---------------------------------------------------------------------------
/**
 * Parse a physical `w:r` into one or more flattened {@link ParagraphItem}s that
 * share character formatting via {@link WireRunGroup}.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {ParagraphItemOwner | undefined} owner - The owner.
 * @returns {ConcreteParagraphItem[]} The result.
 * @private
 */
export function parseTextRangeGroup(el: OpenXmlElement, owner: ParagraphItemOwner | undefined): ConcreteParagraphItem[] {
    const group: WireRunGroup = new WireRunGroup(el.attributes);
    const items: ConcreteParagraphItem[] = [];
    let characterFormatData: CharacterFormatSnapshot | undefined;
    for (const child of elementChildren(el)) {
        if (isWml(child, 'rPr')) {
            characterFormatData = parseCharacterFormat(child);
            continue;
        }
        items.push(parseRunChildToItem(child, group, owner));
    }
    if (characterFormatData !== undefined) {
        group.hydrateCharacterFormat(characterFormatData);
    }
    if (items.length === 0) {
        const empty: TextRange = new TextRange(owner, group);
        items.push(empty);
    }
    return items;
}
export function parseRunChildToItem(
    child: OpenXmlElement,
    group: WireRunGroup,
    owner: ParagraphItemOwner | undefined
): ConcreteParagraphItem {
    if (isWml(child, 't')) {
        const text: string = textContent(child);
        const tr: TextRange = new TextRange(owner, group);
        tr.setTextFromParse(text, xmlSpaceIsPreserve(child) || needsXmlSpacePreserve(text));
        return tr;
    }
    if (isWml(child, 'tab')) {
        return new Tab(group);
    }
    if (isWml(child, 'br')) {
        return parseBreakItem(child, group);
    }
    if (isWml(child, 'cr')) {
        return new CarriageReturn(group);
    }
    if (isWml(child, 'sym')) {
        return parseSymItem(child, group);
    }
    const feature: FeatureRunLeafContent = tryParseFeatureRunLeaf(child);
    if (feature !== undefined) {
        return new FeatureRunParagraphItem(feature.featureId, feature.value, group);
    }
    return new OpaqueRunItem(child, group);
}
/**
 * Parse `w:br` (`CT_Br`: optional `w:type`, `w:clear`).
 *
 * @param {OpenXmlElement} child - The child.
 * @param {WireRunGroup} group - The group.
 * @returns {Break} The result.
 */
function parseBreakItem(child: OpenXmlElement, group: WireRunGroup): Break {
    let breakType: BreakType = BreakType.LineBreak;
    let clear: Exclude<BreakClearType, typeof BreakClearType.None> | undefined;
    let knownType: boolean = false;
    let knownClear: boolean = false;
    const typeRaw: string = wmlAttrValLocal(child, 'type');
    if (typeRaw === 'page') {
        breakType = BreakType.PageBreak;
        knownType = true;
    }
    else if (typeRaw === 'column') {
        breakType = BreakType.ColumnBreak;
        knownType = true;
    }
    else if (typeRaw === 'textWrapping') {
        breakType = BreakType.TextWrappingBreak;
        knownType = true;
    }
    else if (typeRaw === undefined) {
        knownType = true;
    }
    else if (typeRaw === 'line') {
        breakType = BreakType.LineBreak;
        knownType = true;
    }
    const clearRaw: string = wmlAttrValLocal(child, 'clear');
    if (breakType === BreakType.LineBreak || breakType === BreakType.TextWrappingBreak) {
        if (clearRaw === 'left') {
            clear = BreakClearType.Left;
            knownClear = true;
        }
        else if (clearRaw === 'right') {
            clear = BreakClearType.Right;
            knownClear = true;
        }
        else if (clearRaw === 'all') {
            clear = BreakClearType.All;
            knownClear = true;
        }
        else if (clearRaw === 'none') {
            knownClear = false;
        }
    }
    const extras: OpenXmlAttribute[] = [];
    for (const attr of child.attributes) {
        const isWmlAttr: boolean = attr.prefix === 'w' || attr.prefix === '';
        if (isWmlAttr && attr.localName === 'type') {
            if (knownType) {
                continue;
            }
            extras.push(attr);
            continue;
        }
        if (isWmlAttr && attr.localName === 'clear') {
            if (knownClear) {
                continue;
            }
            extras.push(attr);
            continue;
        }
        extras.push(attr);
    }
    return new Break(breakType, clear, extras, group);
}
function serializeBreakItem(leaf: Break): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (leaf.breakType === BreakType.PageBreak) {
        attributes.push(wmlAttr('type', 'page'));
    }
    else if (leaf.breakType === BreakType.ColumnBreak) {
        attributes.push(wmlAttr('type', 'column'));
    }
    else if (leaf.breakType === BreakType.TextWrappingBreak) {
        attributes.push(wmlAttr('type', 'textWrapping'));
        if (leaf.clear !== undefined) {
            attributes.push(wmlAttr('clear', leaf.clear));
        }
    }
    else if (leaf.clear !== undefined) {
        attributes.push(wmlAttr('type', 'textWrapping'));
        attributes.push(wmlAttr('clear', leaf.clear));
    }
    for (const extra of leaf.extras) {
        attributes.push(extra);
    }
    return wmlElement('br', { attributes });
}
function parseSymItem(child: OpenXmlElement, group: WireRunGroup): ConcreteParagraphItem {
    for (const attr of child.attributes) {
        if (attr.localName === 'font' || attr.localName === 'char') {
            if (attr.prefix !== 'w' && attr.prefix !== '') {
                return new OpaqueRunItem(child, group);
            }
            continue;
        }
        return new OpaqueRunItem(child, group);
    }
    if (child.children.length > 0) {
        return new OpaqueRunItem(child, group);
    }
    const font: string = wmlAttrValLocal(child, 'font');
    const char: string = wmlAttrValLocal(child, 'char');
    if (font === undefined || char === undefined) {
        return new OpaqueRunItem(child, group);
    }
    if (!/^[0-9A-Fa-f]{4}$/.test(char)) {
        return new OpaqueRunItem(child, group);
    }
    return new Symbol(font, char, group);
}
export function serializeRunLevelItem(item: ParagraphItem, isFieldInstruction: boolean = false): OpenXmlElement | undefined {
    if (item instanceof TextRange) {
        // Prefer appendSerializedTextLeaves via serializeWireGroupItems for tab expansion.
        // Single-leaf path (no U+0009, or field instruction): one w:t / w:instrText.
        if (!isFieldInstruction && item.text.indexOf('\t') >= 0) {
            return undefined;
        }
        const attributes: OpenXmlAttribute[] = item.xmlSpacePreserve || isFieldInstruction ? [xmlSpacePreserve()] : [];
        // If this TextRange is field instruction text, emit w:instrText instead of w:t
        if (isFieldInstruction) {
            return wmlElement('instrText', {
                attributes,
                children: [{ kind: 'text', value: item.text }]
            });
        }
        return wmlElement('t', {
            attributes,
            children: [{ kind: 'text', value: item.text }]
        });
    }
    if (item instanceof Tab) {
        return wmlElement('tab');
    }
    if (item instanceof Break) {
        return serializeBreakItem(item);
    }
    if (item instanceof CarriageReturn) {
        return wmlElement('cr');
    }
    if (item instanceof Symbol) {
        return wmlElement('sym', {
            attributes: [wmlAttr('font', item.font), wmlAttr('char', item.char)]
        });
    }
    // Field begin / FieldMark separator|end: emit w:fldChar as run child.
    if (typeof item === 'object' && item !== null && 'toOpenXml' in item &&
        ('fieldType' in item || 'fieldMarkType' in item)) {
        return (item as { toOpenXml(): OpenXmlElement }).toOpenXml();
    }
    if (item instanceof FeatureRunParagraphItem) {
        return serializeFeatureRunLeaf({
            type: 'feature',
            featureId: item.featureId,
            value: item.value
        });
    }
    if (item instanceof OpaqueRunItem) {
        return item.xml;
    }
    return undefined;
}
function wmlAttrValLocal(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find(function (a: OpenXmlAttribute): boolean {
        return a.localName === localName && (a.prefix === 'w' || a.prefix === '');
    })),
    ts330 == null ? undefined : ts330.value);
}
/**
 * Items (for example charts) that serialize themselves as a complete `w:r`.
 *
 * @param {ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
function hasRunOpenXml(item: ParagraphItem): item is ParagraphItem & { toRunOpenXml(): OpenXmlElement } {
    return typeof item === 'object' && item !== null && 'toRunOpenXml' in item;
}
function isWireRunMember(item: ParagraphItem): item is ParagraphItem & WireRunMember {
    if (item instanceof WireRunParagraphItem) {
        return true;
    }
    // Field / FieldMark implement WireRunMember without extending WireRunParagraphItem.
    return typeof item === 'object' && item !== null && 'wireGroup' in item;
}
/**
 * Serialize a lone {@link TextRange} as a complete `w:r` (rPr + single w:t).
 * Prefer {@link serializeParagraphItems} when emitting a full paragraph.
 *
 * @param {TextRange} textRange - The text range.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeTextRange(textRange: TextRange): OpenXmlElement {
    return serializeWireGroupItems(textRange.wireGroup, [textRange]);
}
function serializeWireGroupItems(
    group: WireRunGroup,
    members: ParagraphItem[],
    instructionMap?: Map<ParagraphItem, boolean>
): OpenXmlElement {
    const rPrChildren: OpenXmlElement[] = group.characterFormat.buildRPrChildren();
    const children: OpenXmlElement[] = [];
    if (rPrChildren.length > 0) {
        children.push(wmlElement('rPr', { children: rPrChildren }));
    }
    for (const member of members) {
        const isInstruction: boolean = instructionMap !== undefined && instructionMap.get(member) === true;
        if (member instanceof TextRange && !isInstruction && member.text.indexOf('\t') >= 0) {
            // Safety net: residual U+0009 in modeled text becomes w:tab leaves.
            appendSerializedTextLeaves(member.text, false, children);
            continue;
        }
        const el: OpenXmlElement = serializeRunLevelItem(member, isInstruction);
        if (el !== undefined) {
            children.push(el);
        }
    }
    return wmlElement('r', { attributes: group.extraAttributes, children });
}
/**
 * Build a map of TextRange items that are field instruction text.
 * Uses depth-aware field stack to classify items by their structural position.
 * FormFields are excluded since they don't have instruction text regions.
 *
 * @param {ReadonlyArray<ParagraphItem>} items - The items.
 * @returns {Map<ParagraphItem, boolean>} The result.
 * @private
 */
function buildFieldInstructionMap(items: ReadonlyArray<ParagraphItem>): Map<ParagraphItem, boolean> {
    const instructionMap: Map<ParagraphItem, boolean> = new Map<ParagraphItem, boolean>();
    const fieldStack: Array<{ phase: 'instruction' | 'result' }> = [];

    for (const item of items) {
        if (item === undefined) {
            continue;
        }

        // Check if this is a Field (has fieldType property)
        // FormFields are excluded since they don't have instruction text regions
        if (typeof item === 'object' && item !== null && 'fieldType' in item && !((item as any) instanceof FormField)) {
            fieldStack.push({ phase: 'instruction' });
            continue;
        }

        // Check if this is a FieldMark (has fieldMarkType property)
        if (typeof item === 'object' && 'fieldMarkType' in item) {
            const fieldMarkType: string = (item as { fieldMarkType: string }).fieldMarkType;
            if (fieldMarkType === 'separate') {
                // Update the active field state to result phase
                if (fieldStack.length > 0) {
                    fieldStack[fieldStack.length - 1].phase = 'result';
                }
            } else if (fieldMarkType === 'end') {
                // Pop the active field
                if (fieldStack.length > 0) {
                    fieldStack.pop();
                }
            }
            continue;
        }

        // For TextRange items, record whether they're instruction text
        if (item instanceof TextRange) {
            const isInstruction: boolean = fieldStack.length > 0 && fieldStack[fieldStack.length - 1].phase === 'instruction';
            instructionMap.set(item, isInstruction);
        }
    }

    return instructionMap;
}

/**
 * Serialize flattened paragraph items, regrouping consecutive wire-run members
 * that share the same {@link WireRunGroup} into physical `w:r` elements.
 * Field and FieldMark items serialize directly.
 * TextRange items in field instruction regions serialize as w:instrText.
 *
 * @param {ReadonlyArray<ParagraphItem>} items - The items.
 * @returns {OpenXmlElement[]} The result.
 * @private
 */
export function serializeParagraphItems(items: ReadonlyArray<ParagraphItem>): OpenXmlElement[] {
    const out: OpenXmlElement[] = [];
    const instructionMap: Map<ParagraphItem, boolean> = buildFieldInstructionMap(items);
    let i: number = 0;
    while (i < items.length) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
        const item: ParagraphItem = items[i];
        if (item === undefined) {
            i += 1;
            continue;
        }

        // Handle FeatureInline items that implement toOpenXml directly
        // (includes BookmarkStart, BookmarkEnd when they extend ParagraphItem)
        if (item instanceof FeatureInlineParagraphItem) {
            out.push(item.value.toOpenXml());
            i += 1;
            continue;
        }

        // Check if item implements FeatureInline interface directly
        if (typeof (item as any).toOpenXml === 'function' && !(item instanceof Math)) {
            const featureItem = item as any;
            // Verify it looks like a bookmark marker
            if ((item as any).type === 'bookmarkStart' || (item as any).type === 'bookmarkEnd') {
                // Skip BookmarkEnd with positioning flags (serialize elsewhere, not inside paragraph)
                if ((item as any).type === 'bookmarkEnd' && 
                    ((item as any).isAfterParagraphMark === true || 
                     (item as any).isAfterTableMark === true ||
                     (item as any).isAfterCellMark === true ||
                     (item as any).isAfterRowMark === true)) {
                    i += 1;
                    continue;
                }
                out.push(featureItem.toOpenXml());
                i += 1;
                continue;
            }
        }
        
        if (item instanceof Math) {
            out.push(item.toOpenXml());
            i += 1;
            continue;
        }
        if (item instanceof OpaqueParagraphItem) {
            out.push(item.xml);
            i += 1;
            continue;
        }
        if (hasRunOpenXml(item)) {
            out.push(item.toRunOpenXml());
            i += 1;
            continue;
        }
        // Field / FieldMark / TextRange / breaks share WireRunGroup → under w:r
        if (!isWireRunMember(item)) {
            i += 1;
            continue;
        }
        const group: WireRunGroup = item.wireGroup;
        const members: ParagraphItem[] = [item];
        let j: number = i + 1;
        while (j < items.length) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
            const next: ParagraphItem = items[j];
            if (next === undefined || !isWireRunMember(next) || next.wireGroup !== group) {
                break;
            }
            members.push(next);
            j += 1;
        }
        out.push(serializeWireGroupItems(group, members, instructionMap));
        i = j;
    }
    return out;
}

// ---------------------------------------------------------------------------
// Compatibility aliases (migration) — prefer concrete class / ParagraphItem names
// ---------------------------------------------------------------------------
/**
 * @deprecated Prefer {@link Break}. Public break view shape used by older APIs.
 * @private
 */
export interface BreakLeaf {
    readonly type: 'break';
    readonly breakType: BreakType;
    readonly clear: BreakClearType;
}
/**
 * @deprecated Prefer {@link Break}.
 * @private
 */
export type BreakItem = Break;
/**
 * @deprecated Prefer {@link Tab}.
 * @private
 */
export type TabItem = Tab;
/**
 * @deprecated Prefer {@link CarriageReturn}.
 * @private
 */
export type CarriageReturnItem = CarriageReturn;
/**
 * @deprecated Prefer {@link Symbol}.
 * @private
 */
export type SymbolItem = Symbol;
/**
 * @deprecated Prefer {@link ParagraphItemOwner}.
 * @private
 */
export type Owner = ParagraphItemOwner;
/**
 * Concrete paragraph-item instances stored on {@link Paragraph.items}.
 * Discriminated by each subclass’s `type` field for switch/narrowing.
 *
 *  Internal item union. Not part of the public API.
 *
 * @private
 */
export type ConcreteParagraphItem =
    | TextRange
    | Tab
    | CarriageReturn
    | Symbol
    | Break
    | FeatureRunParagraphItem
    | FeatureInlineParagraphItem
    | Math
    | OpaqueRunItem
    | OpaqueParagraphItem
    | Field
    | FieldMark
    | BookmarkStart
    | BookmarkEnd;
/**
 * @deprecated Prefer {@link ConcreteParagraphItem}.
 * @private
 */
export type RunLeaf = ConcreteParagraphItem;
/**
 * @deprecated Prefer {@link ConcreteParagraphItem}.
 * @private
 */
export type InlineContent = ConcreteParagraphItem;
/**
 * @deprecated Prefer {@link TextRange}.
 * @private
 */
export const Run: typeof TextRange = TextRange;
/**
 * @deprecated Prefer {@link ParagraphItemOwner}.
 * @private
 */
export type RunOwner = ParagraphItemOwner;
/**
 * @deprecated Prefer {@link serializeTextRange}.
 * @private
 */
export const serializeRun: (textRange: TextRange) => OpenXmlElement = serializeTextRange;
/**
 * Public break view (no extras / wireGroup).
 *
 * @param {Break} leaf - The leaf.
 * @returns {BreakLeaf} The result.
 * @private
 */
export function toBreakLeafView(leaf: Break): BreakLeaf {
    return {
        type: 'break',
        breakType: leaf.breakType,
        clear: leaf.clear !== undefined ? leaf.clear : BreakClearType.None
    };
}
