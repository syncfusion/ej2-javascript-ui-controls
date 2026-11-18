import { ListFormat } from '../numbering/list-format';
import { WordDocument } from './document';
import { Math as DocMath } from '../math/math';
import { Chart } from '../charts/chart';
import { BookmarkStart, BookmarkEnd, tryParseBookmarkStart, tryParseBookmarkEnd } from '../bookmarks/index';
import { CheckBoxFormField, DropDownFormField, TextFormField, FieldMark as ParagraphFieldMark, FieldMarkType as ParagraphFieldMarkType } from '../fields/paragraph-field';
import { DetachedObjectError, DocxError } from '../../core/errors/docx-error';
import { FeatureId } from '../../core/registry/feature-registry';
import { tryParseFeatureInline, FeatureInlineContent } from '../../core/registry/inline-handlers';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { FeatureBlock } from './feature-block';
import { FeatureInline } from './feature-inline';
import { FeatureRunLeaf } from './feature-run-leaf';
import {
    CharacterFormat,
    CharacterFormatHost,
    CharacterFormatSnapshot,
    parseCharacterFormat
} from './character-format';
import {
    emptyParagraphFormatSnapshot,
    ParagraphFormat,
    ParagraphFormatHost,
    ParagraphFormatSnapshot,
    parseParagraphFormat
} from './paragraph-format';
import {
    CnfStyle,
    NormalizedCnfStyle
} from '../tables/tbl-pr';
import { ParagraphItem } from './paragraph-item';
import {
    ParagraphItemCollection,
    ParagraphItemCollectionHost
} from './paragraph-item-collection';
import {
    Break,
    BreakClearType,
    BreakType,
    ConcreteParagraphItem,
    createStandaloneBreakItem,
    createStandaloneSymbolItem,
    createTextAndTabItems,
    FeatureInlineParagraphItem,
    FeatureRunParagraphItem,
    OpaqueParagraphItem,
    parseTextRangeGroup,
    serializeParagraphItems,
    Symbol,
    Tab,
    TextRange,
    WireRunGroup
} from './text-range';
import { elementChildren, isWml, wValAttribute, wmlAttr, wmlElement } from './wml';

/**
 * Generate a unique form field identifier.
 * @param {string} prefix - The prefix for the identifier (CheckBox, DropDown, TextInput).
 * @returns {string} A unique identifier.
 * @private
 */
function generateFormFieldId(prefix: string): string {
    return prefix + '_' + Date.now().toString(16) + '_' + Math.floor(Math.random() * 0x100000).toString(16);
}

/**
 * Default text for text form fields when none is provided.
 * Five en-space characters (U+2002).
 * @private
 */
const TEXT_FORM_FIELD_DEFAULT_TEXT: string = '\u2002\u2002\u2002\u2002\u2002';

/**
 * Factory for {@link Paragraph.listFormat} — registered by the numbering feature
 * to avoid Vitest ESM-breaking extensionless CJS require of list-format.
 * @private
 */
let listFormatFactory: ((paragraph: Paragraph) => any) | undefined;

/**
 * @param {Function} factory - The factory.
 * @returns {void} Nothing is returned.
 *  Registers the ListFormat constructor bridge (called from numbering feature load).
 *
 * @private
 */
export function setListFormatFactory(factory: (paragraph: Paragraph) => any): void {
    listFormatFactory = factory;
}

/**
 * @returns {void} Nothing is returned.
 *  Test-only reset.
 *
 * @private
 */
export function resetListFormatFactoryForTests(): void {
    listFormatFactory = undefined;
}

/**
 * Chart creation bridge, registered by the charts feature (loaded from the package root)
 * so this module needs no runtime import of the charts feature.
 * @private
 */
let appendChartFactory: ((paragraph: Paragraph, chartType: string, width: number, height: number) => Chart) | undefined;

/**
 * @param {Function} factory - The factory.
 * @returns {void} Nothing is returned.
 *  Registers the chart creation bridge used by <see cref="Paragraph.appendChart">appendChart</see>.
 *
 * @private
 */
export function setAppendChartFactory(
    factory: (paragraph: Paragraph, chartType: string, width: number, height: number) => Chart
): void {
    appendChartFactory = factory;
}

/**
 * Post-processor for paragraph items (e.g., field structure reconstruction).
 * Registered by features that need to transform items after parsing but before hydration.
 * @private
 */
type ParagraphItemsPostProcessor = (items: ConcreteParagraphItem[]) => void;
let paragraphItemsPostProcessor: ParagraphItemsPostProcessor | undefined;

/**
 * @param {ParagraphItemsPostProcessor} processor - The processor.
 * @returns {void} Nothing is returned.
 *  Register a post-processor for paragraph items.
 * Called by fields feature to reconstruct field structures.
 *
 * @private
 */
export function setParagraphItemsPostProcessor(processor: ParagraphItemsPostProcessor): void {
    paragraphItemsPostProcessor = processor;
}

/**
 * @returns {void} Nothing is returned.
 *  Test-only reset.
 *
 * @private
 */
export function resetParagraphItemsPostProcessorForTests(): void {
    paragraphItemsPostProcessor = undefined;
}

/**
 * Body child: a modeled paragraph, optional feature block, or preserved unmodeled markup.
 *
 * @private
 */
export type BlockContent = {
    readonly type: 'paragraph';
    readonly paragraph: Paragraph;
} | {
    readonly type: 'feature';
    readonly featureId: FeatureId;
    readonly value: FeatureBlock;
} | {
    readonly type: 'bookmark-start';
    readonly bookmarkStart: BookmarkStart;
} | {
    readonly type: 'bookmark-end';
    readonly bookmarkEnd: BookmarkEnd;
} | {
    readonly type: 'opaque';
    readonly xml: OpenXmlElement;
};
/**
 * Body owner that can splice raw blocks. Used when newline text creates
 * sibling paragraphs. Not every {@link ParagraphOwner} (for example a table
 * cell that only implements attachment) exposes this surface.
 * @private
 */
interface ParagraphBlockHost extends ParagraphOwner {
    rawBlocks(): ReadonlyArray<BlockContent>;
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void;
    notifyBodyItemsChanged?(): void;
    readonly items?: {
        insertRawBlockAt?(index: number, block: BlockContent): void;
    };
}

function isParagraphBlockHost(owner: ParagraphOwner): owner is ParagraphBlockHost {
    const candidate: ParagraphBlockHost = owner as ParagraphBlockHost;
    return typeof candidate.rawBlocks === 'function'
        && typeof candidate.replaceRawBlocks === 'function';
}

export interface ParagraphOwner {
    assertAttachedParagraph(target: Paragraph): void;
    /**
     * @private
     */
    owningDocument(): WordDocument;
    /**
     * Optional body-owner kind used for ownership queries without circular imports.
     * Table cells set this to `'tableCell'`.
     *
     * @private
     */
    readonly bodyOwnerKind?: 'tableCell' | string;
}

/**
 * Optional clear for {@link Paragraph.appendBreak} on line / text-wrapping breaks.
 *
 * @public
 */
export interface AppendBreakOptions {
    /**
     * Text-wrapping clear (`ST_BrClear`). Only valid with
     * {@link BreakType.LineBreak} or {@link BreakType.TextWrappingBreak}.
     */
    readonly clear?: BreakClearType;
}

/**
 * WordprocessingML paragraph (`w:p`).
 *
 * Paragraph properties live on {@link Paragraph.paragraphFormat} (`w:pPr`).
 * Paragraph-mark character formatting lives on
 * {@link Paragraph.breakCharacterFormat} (`w:pPr/w:rPr`). Text-range character
 * formatting remains on {@link TextRange.characterFormat} (`w:r/w:rPr`).
 *
 * Items appear directly on {@link Paragraph.items} — there is no nested run
 * collection. Physical `w:r` grouping is reconstructed on serialize.
 *
 * @public
 */
export class Paragraph implements ParagraphFormatHost, CharacterFormatHost, ParagraphItemCollectionHost {
    private owner: ParagraphOwner | undefined;
    private extraAttributes: ReadonlyArray<OpenXmlAttribute>;
    private styleIdValue: string | undefined;
    private numIdValue: number | undefined;
    private listLevelValue: number | undefined;
    private numPrExtra: OpenXmlElement[];
    private sectionBreakSectPrElement: OpenXmlElement | undefined;
    /** Live section-break model from the optional sections feature (not XML). */
    private sectionBreakPropertiesModelValue: {
        toOpenXml(): OpenXmlElement;
    } | undefined;
    /**
     * Stable paragraph-item collection. Never replaced after construction —
     * hydrate/clear mutate contents in place.
     */
    private readonly paragraphItems: ParagraphItemCollection;
    /** TASK-9020-B: all typed `w:pPr` formatting state lives on ParagraphFormat. */
    private paragraphFormatField: ParagraphFormat | undefined;
    /** Paragraph-mark character formatting (`w:pPr/w:rPr`). */
    private breakCharacterFormatField: CharacterFormat | undefined;
    /** Paragraph list formatting (`w:numPr`). */
    private listFormatField: any | undefined;
    /**
     * Siblings created by the latest newline `appendText` on this paragraph.
     * Later paragraph-format writes on this instance are mirrored onto them
     * so a post-append property (for example `pageBreakBefore`) covers every
     * paragraph that call produced. Cleared when this paragraph is itself
     * edited independently.
     */
    private newlineCohort: Paragraph[] | undefined;
    /**
     *  @private
     *
     * @param {ParagraphOwner | undefined} owner - The owner.
     */
    constructor(owner: ParagraphOwner | undefined) {
        this.owner = owner;
        this.extraAttributes = [];
        this.numPrExtra = [];
        this.sectionBreakSectPrElement = undefined;
        this.paragraphItems = new ParagraphItemCollection(this);
        this.paragraphFormatField = undefined;
        this.breakCharacterFormatField = undefined;
        this.listFormatField = undefined;
    }
    /**
     * The direct paragraph formatting (`w:pPr`) of this paragraph — the only
     * public paragraph-formatting surface.
     *
     * A live view over the typed `w:pPr` state: every read/write goes to the
     * same storage the parser fills and the serializer reads. Lazily created
     * on first access and cached; never null.
     *
     * Mutating it validates attachment — writes on a detached paragraph throw
     * {@link DetachedObjectError}.
     *
     * @example
     * ```ts
     * paragraph.paragraphFormat.beforeSpacing = 18;
     * paragraph.paragraphFormat.lineSpacing = 10;
     * paragraph.paragraphFormat.firstLineIndent = 10; // negative = hanging
     * paragraph.paragraphFormat.backColor = 'D3D3D3';
     * ```
     *
     * @public
     */
    get paragraphFormat(): ParagraphFormat {
        if (this.paragraphFormatField === undefined) {
            this.paragraphFormatField = new ParagraphFormat(this);
        }
        return this.paragraphFormatField;
    }
    /**
     * Character formatting of the paragraph mark (`w:pPr/w:rPr`).
     *
     * Reuses the same {@link CharacterFormat} type as {@link TextRange.characterFormat}.
     * Lazily constructed; never null. Empty format does not emit an empty `w:rPr`.
     *
     * @example
     * ```ts
     * paragraph.breakCharacterFormat.bold = true;
     * paragraph.breakCharacterFormat.italic = true;
     * paragraph.breakCharacterFormat.fontSize = 14;
     * ```
     *
     * @public
     */
    get breakCharacterFormat(): CharacterFormat {
        if (this.breakCharacterFormatField === undefined) {
            this.breakCharacterFormatField = new CharacterFormat(this);
        }
        return this.breakCharacterFormatField;
    }
    /**
     * Paragraph list formatting (`w:numPr`).
     *
     * A live list-format interface for applying and modifying numbering and
     * bullet formatting on this paragraph. Lazily created on first access
     * and cached; never null.
     *
     * @example
     * ```ts
     * paragraph.listFormat.applyDefBulletStyle();
     * paragraph.listFormat.increaseIndentLevel();
     * paragraph.listFormat.listId = 5;
     * ```
     *
     * @public
     */
    get listFormat(): ListFormat {
        if (this.listFormatField === undefined) {
            // Factory is registered by the numbering feature (avoids circular
            // import and extensionless CJS require under Vitest).
            if (listFormatFactory === undefined) {
                throw new DocxError(
                    'feature/not-registered',
                    'ListFormat is unavailable; register the numbering feature before accessing paragraph.listFormat'
                );
            }
            this.listFormatField = listFormatFactory(this);
        }
        return this.listFormatField;
    }
    /**
     *   ParagraphFormatHost — mutation notification + detachment guard.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyParagraphFormatMutation(): void {
        this.mutate();
        const cohort: Paragraph[] = this.newlineCohort;
        if (cohort === undefined) {
            return;
        }
        const snap: ParagraphFormatSnapshot = this.paragraphFormat.snapshot();
        for (const paragraph of cohort) {
            if (paragraph === undefined || paragraph.owner === undefined) {
                continue;
            }
            paragraph.newlineCohort = undefined;
            paragraph.paragraphFormat.hydrate(snap);
        }
    }
    /**
     *   CharacterFormatHost — mark rPr mutation notification.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    notifyCharacterFormatMutation(): void {
        this.mutate();
        const cohort: Paragraph[] = this.newlineCohort;
        if (cohort === undefined || this.breakCharacterFormatField === undefined) {
            return;
        }
        const snap: CharacterFormatSnapshot = this.breakCharacterFormat.snapshot();
        for (const sibling of cohort) {
            if (sibling === undefined || sibling.owner === undefined) {
                continue;
            }
            sibling.newlineCohort = undefined;
            sibling.breakCharacterFormat.hydrate(snap);
        }
    }
    /**
     *  @private
     *
     * @returns {void} Nothing is returned.
     */
    detach(): void {
        this.owner = undefined;
        this.paragraphItems.detachAll();
    }
    /**
     *  @private
     *
     * @param {ParagraphOwner} owner - The owner.
     * @returns {void} Nothing is returned.
     */
    attach(owner: ParagraphOwner): void {
        this.owner = owner;
        this.paragraphItems.reattachAll();
    }
    /**
     * @param {ParagraphItem} target - The target.
     * @returns {void} Nothing is returned.
     *  ParagraphItemOwner — gate item property mutation.
     *
     * @private
     */
    assertAttachedItem(target: ParagraphItem): void {
        this.mutate();
        if (!this.paragraphItems.containsIdentity(target)) {
            throw new DetachedObjectError('This paragraph item is no longer in its paragraph');
        }
    }
    /**
     * @returns {void} Nothing is returned.
     *  Gate paragraph-level authoring.
     *
     * @private
     */
    assertMutable(): void {
        this.mutate();
    }
    private mutate(): void {
        if (this.owner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }
        this.owner.assertAttachedParagraph(this);
    }
    /**
     * @returns {void} Nothing is returned.
     *  For feature modules: assert this paragraph is mutable.
     *
     * @private
     */
    ensureMutable(): void {
        this.mutate();
    }
    /**
     *  @private
     *
     * @returns {WordDocument} The result.
     */
    owningDocument(): WordDocument {
        if (this.owner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }
        return this.owner.owningDocument();
    }
    /**
     * Gets or sets the identifier of the paragraph style applied to this paragraph.
     *
     * If undefined, no paragraph style is applied and formatting comes from the
     * document defaults. The identifier must name a style that exists in the
     * document when the file is saved.
     *
     * @defaultValue No paragraph style when omitted (body text formatting).
     *
     * @public
     */
    get styleId(): string | undefined {
        return this.styleIdValue;
    }
    set styleId(value: string | undefined) {
        this.mutate();
        this.styleIdValue = value;
    }
    /**
     * Applies a paragraph style by id or BuiltInStyle.
     * Implementation is registered by the styles feature (writes resolved styleId only).
     *
     * @param {string} _style - The  style.
     * @returns {void} Nothing is returned.
     * @public
     */
    applyStyle(_style: string): void {
        throw new Error('Styles feature is not loaded');
    }
    /**
     * @param {string} _key - The  key.
     * @returns {unknown} The result.
     *  Optional CharacterFormatHost effective resolver (overwritten by styles feature).
     *
     * @private
     */
    resolveEffectiveCharacterValue?(_key: string): unknown {
        return undefined;
    }
    /**
     * @param {string} _key - The  key.
     * @returns {unknown} The result.
     *  Optional ParagraphFormatHost effective resolver (overwritten by styles feature).
     *
     * @private
     */
    resolveEffectiveParagraphValue?(_key: string): unknown {
        return undefined;
    }
    /**
     * @private
     * Direct `w:numPr/w:numId/@w:val`. `undefined` means absent (not in a list). */
    get numId(): number | undefined {
        return this.numIdValue;
    }
    /**
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Direct `w:numPr/w:numId/@w:val`. `undefined` means absent (not in a list).
     */
    set numId(value: number | undefined) {
        this.mutate();
        this.numIdValue = value;
    }
    /**
     * Zero-based list level (`w:ilvl`). Prefer {@link listFormat.listLevelNumber}.
     *
     * @private
     */
    get listLevel(): number | undefined {
        return this.listLevelValue;
    }
    /**
     * @param {number | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    set listLevel(value: number | undefined) {
        this.mutate();
        this.listLevelValue = value;
    }

    /**
     * @returns {CnfStyle | undefined} The result.
     * @private
     * Conditional table-style membership on `w:pPr/w:cnfStyle`.
     */
    getConditionalFormatting(): CnfStyle | undefined {
        return this.paragraphFormat.readCnfStyle();
    }

    /**
     * @param {NormalizedCnfStyle | CnfStyle | undefined} state - The state.
     * @returns {void} Nothing is returned.
     * @private
     * Set or clear conditional table-style membership on this paragraph.
     * Does not call {@link mutate} beyond ParagraphFormat's write path so
     * detached table rebuilds during calculation can still write masks.
     */
    setConditionalFormatting(state: NormalizedCnfStyle | CnfStyle | undefined): void {
        this.paragraphFormat.writeCnfStyle(state);
    }

    /**
     * True when this paragraph’s nearest body owner is a table cell
     * (including nested table cells). False for body, header/footer, text box,
     * footnote, endnote, or detached paragraphs.
     *
     * @public
     */
    get isInCell(): boolean {
        const owner: ParagraphOwner = this.owner;
        return owner !== undefined && owner.bodyOwnerKind === 'tableCell';
    }

    /**
     *   Paragraph section-break `w:pPr/w:sectPr`, when present.
     *
     * @returns {OpenXmlElement | undefined} The result.
     * @private
     */
    sectionBreakSectPr(): OpenXmlElement | undefined {
        return this.sectionBreakSectPrElement;
    }
    /**
     * @param {OpenXmlElement | undefined} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Replace paragraph section-break `w:sectPr`.
     *
     * Load/partition/flatten may dual-hold before the paragraph is attached to a
     * body (parse uses a detached context; save may append an empty terminator).
     * When already attached, still assert ownership via {@link mutate}.
     */
    replaceSectionBreakSectPr(value: OpenXmlElement | undefined): void {
        if (this.owner !== undefined) {
            this.mutate();
        }
        this.sectionBreakSectPrElement = value;
        if (value !== undefined) {
            this.sectionBreakPropertiesModelValue = undefined;
        }
    }
    /**
     * @returns {Object} The result.
     * @private
     * Live paragraph section-break properties model (sections feature), if any.
     */
    sectionBreakPropertiesModel(): {
        toOpenXml(): OpenXmlElement;
    } | undefined {
        return this.sectionBreakPropertiesModelValue;
    }
    /**
     * @param {Object} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     * Attach or clear the live paragraph section-break properties model.
     * When set, clears preserved `w:sectPr` XML so the model is the sole source of truth.
     *
     * Same attach rules as {@link replaceSectionBreakSectPr}: dual-hold is allowed
     * before body ownership is established (TASK-8075 partition/flatten).
     */
    replaceSectionBreakPropertiesModel(value: {
        toOpenXml(): OpenXmlElement;
    } | undefined): void {
        if (this.owner !== undefined) {
            this.mutate();
        }
        this.sectionBreakPropertiesModelValue = value;
        if (value !== undefined) {
            this.sectionBreakSectPrElement = undefined;
        }
    }
    /**
     * Ordered paragraph items (text ranges, breaks, tabs, symbols, feature
     * content, opaque markup) in document order.
     *
     * Stable collection identity for the life of the paragraph. Physical `w:r`
     * grouping is reconstructed on serialize via shared wire groups.
     *
     * @public
     */
    get items(): ParagraphItemCollection {
        return this.paragraphItems;
    }
    /**
     * Gets the concatenated plain text of modeled text ranges and tab characters
     * in document order.
     *
     * Opaque and feature inlines (for example hyperlinks owned by feature modules)
     * are skipped. Field instruction text is also skipped; only field result text
     * is included. {@link Tab} items contribute U+0009 so plain-text views match
     * run-level tab characters authored via {@link appendText} or loaded from
     * `w:tab`.
     *
     * @public
     */
    get text(): string {
        const parts: string[] = [];
        const items: ConcreteParagraphItem[] = this.paragraphItems.snapshot();
        const fieldStack: Array<{ phase: 'instruction' | 'result' }> = [];

        for (const item of items) {

            // Check if this is a Field (begin marker)
            if (item !== undefined && typeof item === 'object' && 'fieldType' in item && !('fieldMarkType' in item)) {
                fieldStack.push({ phase: 'instruction' });
                continue;
            }

            // Check if this is a FieldMark (separator or end)
            if (item !== undefined && typeof item === 'object' && 'fieldMarkType' in item) {
                const mark: { fieldMarkType: unknown; } = item as { fieldMarkType: unknown };
                if (mark.fieldMarkType === 'separate') {
                    if (fieldStack.length > 0) {
                        const top: { phase: 'instruction' | 'result'; } = fieldStack[fieldStack.length - 1];
                        if (top !== undefined) {
                            top.phase = 'result';
                        }
                    }
                    continue;
                } else if (mark.fieldMarkType === 'end') {
                    if (fieldStack.length > 0) {
                        fieldStack.pop();
                    }
                    continue;
                }
            }

            // Include text / tabs only if not in field instruction phase
            const inResult: boolean = fieldStack.length === 0 || fieldStack[fieldStack.length - 1]!.phase === 'result';
            if (!inResult) {
                continue;
            }
            if (item instanceof TextRange) {
                parts.push(item.text);
            } else if (item instanceof Tab) {
                parts.push('\t');
            }
        }
        return parts.join('');
    }
    /**
     * Appends an empty text range to the end of this paragraph and returns it.
     *
     * @returns {TextRange} The newly created empty text range.
     * @throws DetachedObjectError if this paragraph is no longer attached to a document.
     *
     * @public
     */
    appendTextRange(): TextRange {
        this.mutate();
        const textRange: TextRange = new TextRange();
        this.paragraphItems.add(textRange);
        return textRange;
    }
    /**
     * Appends an empty native math item (display `m:oMathPara`) to the end of this paragraph.
     *
     * @returns The new {@link Math} item (display `m:oMathPara` until `changeToInline()` is called).
     *
     * @public
     */
    appendMath(): DocMath;
    /**
     * Appends a native math item whose equation is parsed from a LaTeX string.
     *
     * Unsupported or malformed LaTeX degrades to plain math text instead of throwing.
     *
     * @param latex - LaTeX source, for example `\\frac{a}{b}`.
     * @returns The new {@link Math} item.
     *
     * @example
     * ```typescript
     * const math = paragraph.appendMath('\\sqrt{x}');
     * math.changeToInline();
     * ```
     *
     * @public
     */
    appendMath(latex: string): DocMath;
    appendMath(latex?: string): DocMath {
        this.mutate();
        const math: DocMath = new DocMath(false);
        this.paragraphItems.add(math);
        if (latex !== undefined) {
            math.mathParagraph.latex = latex;
        }
        return math;
    }
    /**
     * Append text as one or more paragraph items, optionally with common character
     * formatting. U+0009 (tab) characters become dedicated {@link Tab} items
     * (`w:r/w:tab`) interleaved with {@link TextRange} segments that share one
     * wire run group, matching Word / OOXML run-inner content.
     *
     * Newline characters (U+000A `\n`, U+000D `\r`, or `\r\n` sequences) create
     * new paragraphs. When newlines are detected:
     * - The input text is split by newline sequences
     * - Text segments are appended to separate paragraphs
     * - Each newly created paragraph inherits the formatting of the source paragraph
     * - The new paragraphs are inserted immediately after the source paragraph
     *
     * @param {string} text - The text.
     * @param {Object} options - The options.
     * @returns {TextRange} The first {@link TextRange} created for non-empty text segments, or
     * an empty trailing {@link TextRange} when `text` is empty or tab-only (so the
     * return type stays {@link TextRange}).
     *
     * @public
     */
    appendText(text: string, options?: {
        readonly bold?: boolean;
        readonly italic?: boolean;
        readonly fontSize?: number;
    }): TextRange {
        this.mutate();

        // Check for newline characters (\n, \r, or \r\n)
        if (text.indexOf('\n') >= 0 || text.indexOf('\r') >= 0) {
            return this.appendTextWithNewlines(text, options);
        }

        const group: WireRunGroup = new WireRunGroup();
        const items: ConcreteParagraphItem[] = createTextAndTabItems(text, group);
        let firstTextRange: TextRange | undefined;
        for (const item of items) {
            if (item === undefined) {
                continue;
            }
            this.paragraphItems.add(item);
            if (firstTextRange === undefined && item instanceof TextRange) {
                firstTextRange = item;
            }
        }
        if (firstTextRange === undefined) {
            // Tab-only input: keep API contract with an empty range on the same wire group.
            firstTextRange = new TextRange(undefined, group);
            this.paragraphItems.add(firstTextRange);
        }
        // Shared WireRunGroup CF — any member's characterFormat is the run's rPr.
        if (options != null && options.bold !== undefined) {
            firstTextRange.characterFormat.bold = options.bold;
        }
        if (options != null && options.italic !== undefined) {
            firstTextRange.characterFormat.italic = options.italic;
        }
        if (options != null && options.fontSize !== undefined) {
            firstTextRange.characterFormat.fontSize = options.fontSize;
        }
        return firstTextRange;
    }

    /**
     * @param {string} text - The text.
     * @param {Object} options - The options.
     * @returns {TextRange} The result.
     * @private
     * Internal helper: split text by newline characters and create multiple paragraphs.
     * Handles \n, \r, and \r\n as paragraph separators.
     */
    private appendTextWithNewlines(text: string, options?: {
        readonly bold?: boolean;
        readonly italic?: boolean;
        readonly fontSize?: number;
    }): TextRange {
        // Split by newlines: handle \r\n, \n, and \r
        const parts: string[] = text.split(/\r\n|\r|\n/);

        if (parts.length <= 1) {
            // No newlines found, process normally
            const group: WireRunGroup = new WireRunGroup();
            const items: ConcreteParagraphItem[] = createTextAndTabItems(text, group);
            let firstTextRange: TextRange | undefined;
            for (const item of items) {
                if (item === undefined) {
                    continue;
                }
                this.paragraphItems.add(item);
                if (firstTextRange === undefined && item instanceof TextRange) {
                    firstTextRange = item;
                }
            }
            if (firstTextRange === undefined) {
                firstTextRange = new TextRange(undefined, group);
                this.paragraphItems.add(firstTextRange);
            }
            if (options != null && options.bold !== undefined) {
                firstTextRange.characterFormat.bold = options.bold;
            }
            if (options != null && options.italic !== undefined) {
                firstTextRange.characterFormat.italic = options.italic;
            }
            if (options != null && options.fontSize !== undefined) {
                firstTextRange.characterFormat.fontSize = options.fontSize;
            }
            return firstTextRange;
        }

        // Multiple segments: append to current paragraph and create new ones
        if (this.owner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }

        let firstTextRange: TextRange | undefined;

        // Append first segment to this paragraph
        const firstSegment: string = parts[0];
        if (firstSegment !== undefined && firstSegment.length > 0) {
            const group: WireRunGroup = new WireRunGroup();
            const items: ConcreteParagraphItem[] = createTextAndTabItems(firstSegment, group);
            for (const item of items) {
                if (item === undefined) {
                    continue;
                }
                this.paragraphItems.add(item);
                if (firstTextRange === undefined && item instanceof TextRange) {
                    firstTextRange = item;
                }
            }
        }

        // If first segment is empty or contains only tabs, create an empty text range
        if (firstTextRange === undefined) {
            const group: WireRunGroup = new WireRunGroup();
            firstTextRange = new TextRange(undefined, group);
            this.paragraphItems.add(firstTextRange);
        }

        // Apply character formatting to first segment
        if (options != null && options.bold !== undefined) {
            firstTextRange.characterFormat.bold = options.bold;
        }
        if (options != null && options.italic !== undefined) {
            firstTextRange.characterFormat.italic = options.italic;
        }
        if (options != null && options.fontSize !== undefined) {
            firstTextRange.characterFormat.fontSize = options.fontSize;
        }

        const cohort: Paragraph[] = [];
        // Insert sibling paragraphs when the owner stores raw blocks.
        if (isParagraphBlockHost(this.owner)) {
            const ownerAsHost: ParagraphBlockHost = this.owner;
            const bodyItems: ReadonlyArray<BlockContent> = ownerAsHost.rawBlocks();
            let currentIndex: number = -1;
            for (const [i, content] of bodyItems.entries()) {
                if (content !== undefined && content.type === 'paragraph' && content.paragraph === this) {
                    currentIndex = i;
                    break;
                }
            }

            // Insert first so format writes see an attached paragraph.
            if (currentIndex !== -1) {
                const itemsCollection: { insertRawBlockAt?(index: number, block: BlockContent): void; } = ownerAsHost.items;
                let insertAt: number = currentIndex + 1;
                for (const segment of parts.slice(1)) {
                    const newParagraph: Paragraph = new Paragraph(undefined);
                    if (itemsCollection != null && typeof itemsCollection.insertRawBlockAt === 'function') {
                        itemsCollection.insertRawBlockAt(insertAt, { type: 'paragraph', paragraph: newParagraph });
                    } else {
                        newParagraph.attach(this.owner);
                        const next: BlockContent[] = ownerAsHost.rawBlocks().slice();
                        next.splice(insertAt, 0, { type: 'paragraph', paragraph: newParagraph });
                        ownerAsHost.replaceRawBlocks(next);
                        if (ownerAsHost.notifyBodyItemsChanged !== undefined) {
                            ownerAsHost.notifyBodyItemsChanged();
                        }
                    }
                    insertAt += 1;
                    this.copyParagraphFormatTo(newParagraph);
                    this.appendSegmentText(newParagraph, segment === undefined ? '' : segment, options);
                    newParagraph.newlineCohort = undefined;
                    cohort.push(newParagraph);
                }
            }
        }

        this.newlineCohort = cohort.length > 0 ? cohort : undefined;
        return firstTextRange;
    }

    /**
     * @param {Paragraph} target - The target.
     * @param {string} segment - The segment.
     * @param {Object} options - The options.
     * @returns {void} Nothing is returned.
     * @private
     * Append one newline segment. Empty segments stay empty paragraphs.
     */
    private appendSegmentText(target: Paragraph, segment: string, options?: {
        readonly bold?: boolean;
        readonly italic?: boolean;
        readonly fontSize?: number;
    }): void {
        const group: WireRunGroup = new WireRunGroup();
        const items: ConcreteParagraphItem[] = createTextAndTabItems(segment, group);
        let firstTextRange: TextRange | undefined;
        for (const item of items) {
            if (item === undefined) {
                continue;
            }
            target.paragraphItems.add(item);
            if (firstTextRange === undefined && item instanceof TextRange) {
                firstTextRange = item;
            }
        }
        if (firstTextRange === undefined) {
            firstTextRange = new TextRange(undefined, group);
            target.paragraphItems.add(firstTextRange);
        }
        if (options != null && options.bold !== undefined) {
            firstTextRange.characterFormat.bold = options.bold;
        }
        if (options != null && options.italic !== undefined) {
            firstTextRange.characterFormat.italic = options.italic;
        }
        if (options != null && options.fontSize !== undefined) {
            firstTextRange.characterFormat.fontSize = options.fontSize;
        }
    }

    /**
     * @param {Paragraph} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     * Copy formatting from this paragraph to an already-attached target.
     */
    private copyParagraphFormatTo(target: Paragraph): void {
        // Copy authored snapshot only. Getters resolve defaults (empty backColor,
        // false flags) that setters reject or would persist as authored markup.
        target.paragraphFormat.hydrate(this.paragraphFormat.snapshot());
        if (this.styleIdValue !== undefined) {
            target.styleId = this.styleIdValue;
        }
        if (this.breakCharacterFormatField !== undefined) {
            target.breakCharacterFormat.hydrate(this.breakCharacterFormat.snapshot());
        }
    }
    /**
     * Append a break (`w:br`) as a direct paragraph item.
     *
     * Always run content on the wire (`w:r/w:br`), never a paragraph-level
     * sibling of `w:r`. Serialization rebuilds the physical run.
     *
     * @param {BreakType} type - Break kind ({@link BreakType}).
     * @param {AppendBreakOptions} options - Optional text-wrapping clear (Line / TextWrappingBreak only).
     * @returns {Break} The break item.
     * @throws DocxError `content/invalid-break` if `clear` is set on Page or Column.
     *
     * @example
     * ```ts
     * paragraph.appendBreak(BreakType.PageBreak);
     * paragraph.appendBreak(BreakType.LineBreak, { clear: BreakClearType.All });
     * ```
     *
     * @public
     */
    appendBreak(type: BreakType, options?: AppendBreakOptions): Break {
        this.mutate();
        const clear: BreakClearType = options == null ? undefined : options.clear;
        const item: Break = createStandaloneBreakItem(type, clear != null ? clear : BreakClearType.None);
        this.paragraphItems.add(item);
        return item;
    }
    /**
     * Append a symbol character (`w:sym`) as a direct paragraph item.
     *
     * Always run content on the wire (`w:r/w:sym`, ECMA-376-1 §17.3.3.30).
     *
     * @param {string} font - Symbol font name (`w:font`), for example `"Wingdings"`.
     * @param {string} char - `ST_ShortHexNumber` hex digits for `w:char` (four hex digits, e.g. `"F0FC"`).
     * @returns {Symbol} The symbol paragraph item that was created.
     *
     * @example
     * ```ts
     * paragraph.appendText('checkmark: ');
     * paragraph.appendSymbol('Wingdings', 'F0FC');
     * ```
     *
     * @public
     */
    appendSymbol(font: string, char: string): Symbol {
        this.mutate();
        const item: Symbol = createStandaloneSymbolItem(font, char);
        this.paragraphItems.add(item);
        return item;
    }
    /**
     * Append a chart to this paragraph.
     *
     * Creates a new chart with the specified type, width, and height. The chart is
     * immediately usable - all public chart APIs are available right after creation.
     *
     * No async prerequisite is required - `appendChart()` is synchronous.
     *
     * @param {string} chartType - Chart type identifier (e.g., `ChartType.ColumnClustered`).
     * @param {number} width - Width in points (must be positive and finite).
     * @param {number} height - Height in points (must be positive and finite).
     * @returns {Chart} Live Chart paragraph item with full API access.
     * @throws {DocxError} If ej2-xlsx module cannot be loaded (package not installed)
     * @throws {Error} If width or height are not positive and finite numbers
     *
     * @example
     * ```typescript
     * const para = doc.lastSection.body.appendParagraph();
     * const chart = para.appendChart(ChartType.ColumnClustered, 500, 300);
     *
     * // Typed APIs available immediately:
     * chart.chartData.setValue(1, 1, 'Q1');
     * chart.chartData.setValue(1, 2, 100);
     * chart.series[0].name = 'Sales';
     * chart.chartTitle = 'Quarterly Results';
     * ```
     *
     * @public
     */
    appendChart(chartType: string, width: number, height: number): Chart {
        if (appendChartFactory === undefined) {
            throw new DocxError('feature/not-registered', 'Charts feature is not registered; import it from the package root.');
        }
        return appendChartFactory(this, chartType, width, height);
    }

    /**
     * Append a bookmark start marker (`w:bookmarkStart`) at the end of the paragraph.
     *
     * @param {string} name - Bookmark name (`w:name`); must be non-empty / not whitespace-only.
     * @returns {BookmarkStart} The authored start marker (pending negative id until save).
     * @throws DocxError `content/invalid-bookmark` for an invalid name.
     * @public
     */
    appendBookmarkStart(name: string): BookmarkStart {
        this.mutate();
        const start: BookmarkStart = new BookmarkStart(name);
        this.paragraphItems.add(start);
        return start;
    }

    /**
     * Append a bookmark end marker (w:bookmarkEnd).
     *
     * The end marker will pair with the most recent unmatched start marker
     * that has the same name (after normalization). Place after the desired
     * enclosed content (same or a later paragraph) so the pair spans the intended range.
     *
     * @param {string} name - Bookmark name to close; must match a prior start marker.
     * @returns {BookmarkEnd} The authored end marker.
     * @public
     */
    appendBookmarkEnd(name: string): BookmarkEnd {
        this.mutate();
        const end: BookmarkEnd = new BookmarkEnd(name);
        this.paragraphItems.add(end);
        return end;
    }

    /**
     * Append a checkbox form field (w:ffData with w:checkBox).
     *
     * @returns {CheckBoxFormField} The checkbox form field.
     * @public
     */
    appendCheckBoxFormField(): CheckBoxFormField;
    /**
     * Append a checkbox form field (w:ffData with w:checkBox) with specified name and default value.
     *
     * @param {string} [name] - The form field and bookmark name.
     * @param {boolean} [defaultChecked] - The default checked state.
     * @returns {CheckBoxFormField} The checkbox form field.
     * @public
     */
    appendCheckBoxFormField(name: string, defaultChecked?: boolean): CheckBoxFormField;
    appendCheckBoxFormField(name?: string, defaultChecked?: boolean): CheckBoxFormField {
        this.mutate();
        const field = new CheckBoxFormField();
        
        // Generate a bookmark name if not set
        const bookmarkName: string = (name !== undefined && name !== null && name.length > 0) ?
            name : generateFormFieldId('CheckBox');
        
        // Assign the generated name to the field
        field.name = bookmarkName;
        if (defaultChecked !== undefined) {
            field.defaultCheckBoxValue = defaultChecked;
            field.checked = defaultChecked;
        }
        
        // Add bookmark start
        const bookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);
        
        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);
        
        // Add field code text range (FORMCHECKBOX)
        this.appendText('FORMCHECKBOX');
        
        // Add end mark
        const endMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);
        
        // Add bookmark end
        const bookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
        this.paragraphItems.add(bookmarkEnd);
        
        return field;
    }

    /**
     * Append a dropdown form field (w:ffData with w:ddList).
     *
     * @returns {DropDownFormField} The dropdown form field.
     * @public
     */
    appendDropDownFormField(): DropDownFormField;
    /**
     * Append a dropdown form field (w:ffData with w:ddList) with specified name.
     *
     * @param {string} [name] - The form field and bookmark name.
     * @returns {DropDownFormField} The dropdown form field.
     * @public
     */
    appendDropDownFormField(name: string): DropDownFormField;
    appendDropDownFormField(name?: string): DropDownFormField {
        this.mutate();
        const field = new DropDownFormField();
        
        // Generate a bookmark name if not set
        const bookmarkName: string = (name !== undefined && name !== null && name.length > 0) ?
            name : generateFormFieldId('DropDown');
        
        // Assign the generated name to the field
        field.name = bookmarkName;
        
        // Add bookmark start
        const bookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);
        
        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);
        
        // Add field code text range (FORMDROPDOWN)
        this.appendText('FORMDROPDOWN');
        
        // Add end mark
        const endMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);
        
        // Add bookmark end
        const bookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
        this.paragraphItems.add(bookmarkEnd);
        
        return field;
    }

    /**
     * Append a text form field (w:ffData with w:textInput) with auto-generated name.
     *
     * @param {string} defaultText - The default text value for the text form field.
     * @returns {TextFormField} The text form field.
     * @public
     */
    appendTextFormField(defaultText: string): TextFormField;
    /**
     * Append a text form field (w:ffData with w:textInput) with specified name.
     *
     * @param {string} name - The form field and bookmark name.
     * @param {string} defaultText - The default text value for the text form field.
     * @returns {TextFormField} The text form field.
     * @public
     */
    appendTextFormField(name: string, defaultText: string): TextFormField;
    appendTextFormField(name: string, defaultText?: string): TextFormField {
        // Handle overload: single parameter generates unique name
        if (defaultText === undefined) {
            const fieldName: string = generateFormFieldId('TextInput');
            return this.appendTextFormField(fieldName, name);
        }

        this.mutate();
        const field = new TextFormField();
        
        // Use default text if none provided
        const textValue: string = (defaultText === undefined || defaultText === null || defaultText === '') ? 
            TEXT_FORM_FIELD_DEFAULT_TEXT : 
            defaultText;
        
        field.name = name;
        
        // Set both defaultText and display text to the same value
        field.defaultText = textValue;
        
        // Use name as bookmark name
        const bookmarkName: string = field.name && field.name.length > 0 ? 
            field.name : 
            generateFormFieldId('TextInput');
        
        // Assign the name to the field
        field.name = bookmarkName;
        
        // Add bookmark start
        const bookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);
        
        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);
        
        // Add field code text range (FORMTEXT)
        this.appendText('FORMTEXT');
        
        // Add separator mark (for TextFormField)
        const separatorMark = new ParagraphFieldMark(ParagraphFieldMarkType.Separator, undefined, undefined, []);
        this.paragraphItems.add(separatorMark);
        
        // Add result text range (displays the default text or current value)
        this.appendText(textValue);
        
        // Add end mark
        const endMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);
        
        // Add bookmark end
        const bookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
        this.paragraphItems.add(bookmarkEnd);
        
        return field;
    }

    /**
     * Appends a feature-owned run-level item (for example an image) as a direct
     * paragraph child. Serializes inside a physical `w:r` via its wire group.
     *
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureRunLeaf} value - The value.
     * @returns {FeatureRunParagraphItem} The result.
     * @private
     */
    appendFeatureRunItem(featureId: FeatureId, value: FeatureRunLeaf): FeatureRunParagraphItem {
        this.mutate();
        const item: FeatureRunParagraphItem = new FeatureRunParagraphItem(featureId, value, new WireRunGroup());
        this.paragraphItems.add(item);
        return item;
    }
    /**
     * Appends a feature-owned inline sibling (for example `w:hyperlink`).
     *
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureInline} value - The value.
     * @returns {FeatureInlineParagraphItem} The result.
     * @private
     */
    appendFeatureInline(featureId: FeatureId, value: FeatureInline): FeatureInlineParagraphItem {
        this.mutate();
        const item: FeatureInlineParagraphItem = new FeatureInlineParagraphItem(featureId, value);
        this.paragraphItems.add(item);
        return item;
    }
    /**
     * Inserts a feature-owned inline at a raw content index (`0…items.count` inclusive).
     *
     * @param {number} index - The index.
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureInline} value - The value.
     * @returns {FeatureInlineParagraphItem} The result.
     * @private
     */
    insertFeatureInlineAt(index: number, featureId: FeatureId, value: FeatureInline): FeatureInlineParagraphItem {
        this.mutate();
        const item: FeatureInlineParagraphItem = new FeatureInlineParagraphItem(featureId, value);
        this.paragraphItems.insert(index, item);
        return item;
    }
    /**
     *   Remove a feature inline from this paragraph.
     *
     * @param {FeatureInline} value - The value.
     * @returns {void} Nothing is returned.
     * @private
     */
    removeFeatureInline(value: FeatureInline): void {
        this.mutate();
        const items: ConcreteParagraphItem[] = this.paragraphItems.snapshot();
        for (const [i, item] of items.entries()) {
            if (item instanceof FeatureInlineParagraphItem && item.value === value) {
                this.paragraphItems.removeAt(i);
                return;
            }
        }
        throw new DetachedObjectError('This inline is no longer in its paragraph');
    }
    /**
     * @param {FeatureRunLeaf} value - The value.
     * @returns {void} Nothing is returned.
     *  Remove a feature run-level item (image, drawing residual, …).
     *
     * @private
     */
    removeFeatureRunItem(value: FeatureRunLeaf): void {
        this.mutate();
        const items: ConcreteParagraphItem[] = this.paragraphItems.snapshot();
        for (const [i, item] of items.entries()) {
            if (item instanceof FeatureRunParagraphItem && item.value === value) {
                this.paragraphItems.removeAt(i);
                return;
            }
        }
        throw new DetachedObjectError('This item is no longer in its paragraph');
    }
    /**
     * @param {ConcreteParagraphItem} item - The item.
     * @returns {void} Nothing is returned.
     *  Append a pre-built paragraph item (feature modules).
     *
     * @private
     */
    appendParagraphItem(item: ConcreteParagraphItem): void {
        this.mutate();
        this.paragraphItems.add(item);
    }
    /**
     * @param {TextRange} run - The run.
     * @returns {void} Nothing is returned.
     *  Remove a text range by identity.
     *
     * @private
     */
    removeTextRange(run: TextRange): void {
        this.mutate();
        const at: number = this.paragraphItems.indexOfIdentity(run);
        if (at === -1) {
            throw new DetachedObjectError('This text range is no longer in its paragraph');
        }
        this.paragraphItems.removeAt(at);
    }
    /**
     * Advanced hatch: `w:p` tree. Unstable; prefer semantic properties.
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return serializeParagraph(this);
    }
    /**
     *  @private
     *
     * @param {OpenXmlElement} el - The el.
     * @param {ParagraphOwner} owner - The owner.
     * @returns {Paragraph} The result.
     */
    static fromXml(el: OpenXmlElement, owner: ParagraphOwner): Paragraph {
        return parseParagraph(el, owner);
    }
    /**
     * @param {ReadonlyArray<ParagraphItem>} items - The items.
     * @returns {void} Nothing is returned.
     *  Replace modeled items after load (feature post-load hooks), keeping paragraph formatting.
     *
     * @private
     */
    hydrateItems(items: ReadonlyArray<ParagraphItem>): void {
        this.paragraphItems.hydrate(items as ReadonlyArray<ConcreteParagraphItem>);
    }
    /**
     *  @private
     *
     * @param {Object} data - The data.
     * @returns {void} Nothing is returned.
     */
    hydrate(data: {
        extraAttributes: ReadonlyArray<OpenXmlAttribute>;
        styleIdValue: string | undefined;
        numIdValue: number | undefined;
        listLevelValue: number | undefined;
        numPrExtra: OpenXmlElement[];
        sectionBreakSectPr: OpenXmlElement | undefined;
        items: ConcreteParagraphItem[];
        paragraphFormat: ParagraphFormatSnapshot;
        breakCharacterFormat?: CharacterFormatSnapshot;
    }): void {
        this.extraAttributes = data.extraAttributes;
        this.styleIdValue = data.styleIdValue;
        this.numIdValue = data.numIdValue;
        this.listLevelValue = data.listLevelValue;
        this.numPrExtra = data.numPrExtra;
        this.sectionBreakSectPrElement = data.sectionBreakSectPr;
        // Detach any prior owner on incoming items so collection hydrate can attach.
        for (const item of data.items) {
            if (item.owner !== undefined) {
                item.detach();
            }
        }
        this.paragraphItems.hydrate(data.items);
        // TASK-9020-C: formatting state hydrates from parseParagraphFormat snapshot.
        this.paragraphFormat.hydrate(data.paragraphFormat);
        if (data.breakCharacterFormat !== undefined) {
            this.breakCharacterFormat.hydrate(data.breakCharacterFormat);
        }
    }
    /**
     *  @private
     *
     * @returns {Object} The result.
     */
    snapshot(): {
        extraAttributes: ReadonlyArray<OpenXmlAttribute>;
        styleIdValue: string | undefined;
        numIdValue: number | undefined;
        listLevelValue: number | undefined;
        numPrExtra: OpenXmlElement[];
        sectionBreakSectPr: OpenXmlElement | undefined;
        items: ConcreteParagraphItem[];
        paragraphFormat: ParagraphFormatSnapshot;
        breakCharacterFormat: CharacterFormatSnapshot;
    } {
        return {
            extraAttributes: this.extraAttributes,
            styleIdValue: this.styleIdValue,
            numIdValue: this.numIdValue,
            listLevelValue: this.listLevelValue,
            numPrExtra: this.numPrExtra,
            // Prefer the live sections-feature model when present (clears preserved XML).
            sectionBreakSectPr: this.sectionBreakPropertiesModelValue !== undefined
                ? this.sectionBreakPropertiesModelValue.toOpenXml()
                : this.sectionBreakSectPrElement,
            items: this.paragraphItems.snapshot(),
            paragraphFormat: this.paragraphFormat.snapshot(),
            breakCharacterFormat: this.breakCharacterFormat.snapshot()
        };
    }
}
function parseDecimalVal(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    return Number.parseInt(raw, 10);
}
/**
 * Parse `w:p`. Paragraph-owned: `pStyle` / `numPr` / `rPr` / `sectPr` / content.
 * Format-owned `w:pPr` children go through {@link parseParagraphFormat}.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {ParagraphOwner} owner - The owner.
 * @returns {Paragraph} The result.
 */
function parseParagraph(el: OpenXmlElement, owner: ParagraphOwner): Paragraph {
    const paragraph: Paragraph = new Paragraph(owner);
    let styleIdValue: string | undefined;
    let numIdValue: number | undefined;
    let listLevelValue: number | undefined;
    let sectionBreakSectPr: OpenXmlElement | undefined;
    const numPrExtra: OpenXmlElement[] = [];
    const items: ConcreteParagraphItem[] = [];
    let formatSnap: ParagraphFormatSnapshot | undefined;
    let breakCfSnap: CharacterFormatSnapshot | undefined;
    for (const child of elementChildren(el)) {
        if (isWml(child, 'pPr')) {
            // Paragraph-owned children first, then format codec for the rest.
            for (const prop of elementChildren(child)) {
                if (isWml(prop, 'pStyle')) {
                    styleIdValue = wValAttribute(prop);
                    continue;
                }
                if (isWml(prop, 'numPr')) {
                    for (const numChild of elementChildren(prop)) {
                        if (isWml(numChild, 'ilvl')) {
                            const parsed: number = parseDecimalVal(wValAttribute(numChild));
                            if (parsed === undefined) {
                                numPrExtra.push(numChild);
                            }
                            else {
                                listLevelValue = parsed;
                            }
                            continue;
                        }
                        if (isWml(numChild, 'numId')) {
                            const parsed: number = parseDecimalVal(wValAttribute(numChild));
                            if (parsed === undefined) {
                                numPrExtra.push(numChild);
                            }
                            else {
                                numIdValue = parsed;
                            }
                            continue;
                        }
                        numPrExtra.push(numChild);
                    }
                    continue;
                }
                if (isWml(prop, 'rPr')) {
                    // Paragraph-mark character formatting (`w:pPr/w:rPr`).
                    breakCfSnap = parseCharacterFormat(prop);
                    continue;
                }
                if (isWml(prop, 'sectPr')) {
                    sectionBreakSectPr = prop;
                    continue;
                }
            }
            // TASK-9020-C: format-owned pPr interpretation (skips pStyle/numPr/rPr/sectPr).
            formatSnap = parseParagraphFormat(child);
            continue;
        }
        if (isWml(child, 'r')) {
            // Owner is applied by paragraph.hydrate → collection.hydrate.
            const groupItems: ConcreteParagraphItem[] = parseTextRangeGroup(child, undefined);
            for (const item of groupItems) {
                items.push(item);
            }
            continue;
        }
        const mathItem: DocMath = DocMath.tryFromOpenXml(child);
        if (mathItem !== undefined) {
            items.push(mathItem);
            continue;
        }
        const bookmarkStartItem: BookmarkStart = tryParseBookmarkStart(child);
        if (bookmarkStartItem !== undefined) {
            items.push(bookmarkStartItem);
            continue;
        }
        const bookmarkEndItem: BookmarkEnd = tryParseBookmarkEnd(child);
        if (bookmarkEndItem !== undefined) {
            items.push(bookmarkEndItem);
            continue;
        }
        const feature: FeatureInlineContent = tryParseFeatureInline(child);
        if (feature !== undefined) {
            items.push(new FeatureInlineParagraphItem(feature.featureId, feature.value));
            continue;
        }
        items.push(new OpaqueParagraphItem(child));
    }
    // Post-process items (e.g., field structure reconstruction)
    if (paragraphItemsPostProcessor !== undefined) {
        paragraphItemsPostProcessor(items);
    }
    paragraph.hydrate({
        extraAttributes: el.attributes,
        styleIdValue: styleIdValue,
        numIdValue: numIdValue,
        listLevelValue: listLevelValue,
        numPrExtra: numPrExtra,
        sectionBreakSectPr: sectionBreakSectPr,
        items: items,
        paragraphFormat: formatSnap !== undefined
            ? formatSnap
            : emptyParagraphFormatSnapshot(),
        breakCharacterFormat: breakCfSnap
    });
    return paragraph;
}
/**
 * Serialize a paragraph. `w:pPr` children after `pStyle` come from
 * {@link ParagraphFormat.buildPPrChildren} (CT_PPr order; TASK-9020-D).
 * Mark `w:rPr` is injected from {@link Paragraph.breakCharacterFormat}.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function serializeParagraph(paragraph: Paragraph): OpenXmlElement {
    const snap: {
        extraAttributes: ReadonlyArray<OpenXmlAttribute>;
        styleIdValue: string;
        numIdValue: number;
        listLevelValue: number;
        numPrExtra: OpenXmlElement[];
        sectionBreakSectPr: OpenXmlElement;
        items: ConcreteParagraphItem[];
        paragraphFormat: ParagraphFormatSnapshot;
        breakCharacterFormat: CharacterFormatSnapshot;
    } = paragraph.snapshot();
    const pPrChildren: OpenXmlElement[] = [];
    if (snap.styleIdValue !== undefined) {
        pPrChildren.push(wmlElement('pStyle', { attributes: [wmlAttr('val', snap.styleIdValue)] }));
    }
    let numPr: OpenXmlElement | undefined;
    if (snap.numIdValue !== undefined ||
        snap.listLevelValue !== undefined ||
        snap.numPrExtra.length > 0) {
        const numPrChildren: OpenXmlElement[] = [];
        if (snap.listLevelValue !== undefined) {
            numPrChildren.push(wmlElement('ilvl', { attributes: [wmlAttr('val', String(snap.listLevelValue))] }));
        }
        if (snap.numIdValue !== undefined) {
            numPrChildren.push(wmlElement('numId', { attributes: [wmlAttr('val', String(snap.numIdValue))] }));
        }
        for (const element of snap.numPrExtra) {
            numPrChildren.push(element);
        }
        numPr = wmlElement('numPr', { children: numPrChildren });
    }
    // Match TextRange: omit empty mark rPr (no empty <w:rPr/>).
    const rPrChildList: OpenXmlElement[] = paragraph.breakCharacterFormat.buildRPrChildren();
    let rPr: OpenXmlElement | undefined;
    if (rPrChildList.length > 0) {
        rPr = wmlElement('rPr', { children: rPrChildList });
    }
    const formatChildren: OpenXmlElement[] = paragraph.paragraphFormat.buildPPrChildren({
        numPr: numPr,
        rPr: rPr,
        sectPr: snap.sectionBreakSectPr
    });
    for (const element of formatChildren) {
        pPrChildren.push(element);
    }
    const children: OpenXmlElement[] = [];
    if (pPrChildren.length > 0) {
        children.push(wmlElement('pPr', { children: pPrChildren }));
    }
    const itemXml: OpenXmlElement[] = serializeParagraphItems(snap.items);
    for (const element of itemXml) {
        children.push(element);
    }
    // DocIO pageBreakAfter has no ECMA pPr child. Body serializers emit a
    // following page-break-only paragraph via shouldEmitPageBreakAfterParagraph /
    // createPageBreakAfterParagraphElement — do not append w:br into this w:p.
    // Citation: docs/specs/paragraph-formatting.md (deliberate omissions); ECMA-376-1 §17.3.3.1 w:br.
    return wmlElement('p', { attributes: snap.extraAttributes, children: children });
}

/**
 * True when {@link ParagraphFormat.pageBreakAfter} should emit a dedicated
 * following paragraph containing only `w:br/@w:type="page"`.
 *
 * Skips when the content paragraph already contains a page-break item so
 * authoring does not duplicate breaks.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {boolean} The result.
 * @private
 */
export function shouldEmitPageBreakAfterParagraph(paragraph: Paragraph): boolean {
    const snap: {
        extraAttributes: ReadonlyArray<OpenXmlAttribute>;
        styleIdValue: string;
        numIdValue: number;
        listLevelValue: number;
        numPrExtra: OpenXmlElement[];
        sectionBreakSectPr: OpenXmlElement;
        items: ConcreteParagraphItem[];
        paragraphFormat: ParagraphFormatSnapshot;
        breakCharacterFormat: CharacterFormatSnapshot;
    } = paragraph.snapshot();
    if (snap.paragraphFormat.pageBreakAfterValue !== true) {
        return false;
    }
    return !paragraphItemsIncludePageBreak(snap.items);
}

/**
 * Build a standalone `w:p` whose only content is a page break run.
 * Used after a content paragraph when {@link shouldEmitPageBreakAfterParagraph}.
 *
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function createPageBreakAfterParagraphElement(): OpenXmlElement {
    const pageBreakItem: Break = createStandaloneBreakItem(BreakType.PageBreak);
    const breakXml: OpenXmlElement[] = serializeParagraphItems([pageBreakItem]);
    return wmlElement('p', { children: breakXml });
}

/**
 * True when paragraph items already contain a page break (`w:br/@w:type="page"`).
 *
 * @param {ReadonlyArray<ParagraphItem>} items - The items.
 * @returns {boolean} The result.
 * @private
 */
function paragraphItemsIncludePageBreak(items: ReadonlyArray<ParagraphItem>): boolean {
    for (const item of items) {
        if (item instanceof Break && item.breakType === BreakType.PageBreak) {
            return true;
        }
    }
    return false;
}

// Re-export BodyItem for historical import sites (paragraph was the old home).
// TS 3.3.1: no export type { ... } from (3.8+). Use import() type queries.

