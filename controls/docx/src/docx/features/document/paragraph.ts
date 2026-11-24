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
import { BodyItem, isBodyItemInstance } from './body-item';
import { Body } from './body';
import { BodyBlockParseContext } from '../../core/registry/block-handlers';
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
import { ParagraphItem, isDirectInlineFeatureItem } from './paragraph-item';
import {
    ParagraphItemCollection,
    ParagraphItemCollectionHost
} from './paragraph-item-collection';
import {
    Break,
    CarriageReturn,
    BreakClearType,
    BreakType,
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
 *
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
 *
 * @private
 */
const TEXT_FORM_FIELD_DEFAULT_TEXT: string = '\u2002\u2002\u2002\u2002\u2002';

/**
 * Factory for {@link Paragraph.listFormat} — registered by the numbering feature
 * to avoid Vitest ESM-breaking extensionless CJS require of list-format.
 *
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
 *
 * @private
 */
let appendChartFactory: ((paragraph: Paragraph, chartType: string, width: number, height: number) => Chart) | undefined;

/**
 * @param {Function} factory - The factory.
 * @returns {void} Nothing is returned.
 *  Registers the chart creation bridge used by {@link Paragraph.appendChart}.
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
 *
 * @private
 */
type ParagraphItemsPostProcessor = (items: ParagraphItem[]) => void;
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
 * sibling paragraphs.
 *
 * @private
 */
interface ParagraphBlockHost {
    rawBlocks(): ReadonlyArray<BlockContent>;
    replaceRawBlocks(blocks: ReadonlyArray<BlockContent>): void;
    notifyBodyItemsChanged?(): void;
    readonly items?: {
        insertRawBlockAt?(index: number, block: BlockContent): void;
    };
}

function isParagraphBlockHost(owner: unknown): owner is ParagraphBlockHost {
    const candidate: ParagraphBlockHost = owner as ParagraphBlockHost;
    return typeof candidate.rawBlocks === 'function'
        && typeof candidate.replaceRawBlocks === 'function';
}

/**
 * Optional clear for {@link Paragraph.appendBreak} on line / text-wrapping breaks.
 *
 * @public
 */
export interface AppendBreakOptions {
    /**
     * Gets the clear type that specifies where text resumes after a line or text-wrapping break.
     */
    readonly clear?: BreakClearType;
}

/**
 * Represents a paragraph in a document.
 *
 * Paragraph formatting is available through {@link Paragraph.paragraphFormat}, and the content is available through {@link Paragraph.items}.
 *
 * @public
 */
export class Paragraph extends BodyItem implements ParagraphFormatHost, CharacterFormatHost, ParagraphItemCollectionHost {
    private legacyOwner: BodyBlockParseContext | undefined;
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
    /** all typed `w:pPr` formatting state lives on ParagraphFormat. */
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
     * @param {BodyBlockParseContext | undefined} owner - The owning body or body-like host.
     */
    constructor(owner: BodyBlockParseContext | undefined) {
        super();
        this.legacyOwner = owner;
        this.extraAttributes = [];
        this.numPrExtra = [];
        this.sectionBreakSectPrElement = undefined;
        this.paragraphItems = new ParagraphItemCollection(this);
        this.paragraphFormatField = undefined;
        this.breakCharacterFormatField = undefined;
        this.listFormatField = undefined;
    }
    /**
     * Gets the paragraph formatting of the paragraph.
     *
     * @example
     * ```ts
     * paragraph.paragraphFormat.beforeSpacing = 18;
     * paragraph.paragraphFormat.lineSpacing = 10;
     * paragraph.paragraphFormat.firstLineIndent = 10; // negative = hanging
     * paragraph.paragraphFormat.backColor = 'D3D3D3';
     * ```
     * @public
     */
    get paragraphFormat(): ParagraphFormat {
        if (this.paragraphFormatField === undefined) {
            this.paragraphFormatField = new ParagraphFormat(this);
        }
        return this.paragraphFormatField;
    }
    /**
     * Gets the character formatting of the paragraph mark.
     *
     * @example
     * ```ts
     * paragraph.breakCharacterFormat.bold = true;
     * paragraph.breakCharacterFormat.italic = true;
     * paragraph.breakCharacterFormat.fontSize = 14;
     * ```
     * @public
     */
    get breakCharacterFormat(): CharacterFormat {
        if (this.breakCharacterFormatField === undefined) {
            this.breakCharacterFormatField = new CharacterFormat(this);
        }
        return this.breakCharacterFormatField;
    }
    /**
     * Gets the paragraph list formatting.
     *
     * A live list-format interface for applying and modifying numbering and bullet formatting on this paragraph. Lazily created on first access and cached; never null.
     *
     * @example
     * ```ts
     * paragraph.listFormat.applyDefBulletStyle();
     * paragraph.listFormat.increaseIndentLevel();
     * paragraph.listFormat.listId = 5;
     * ```
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
            if (paragraph === undefined || paragraph.legacyOwner === undefined) {
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
            if (sibling === undefined || sibling.legacyOwner === undefined) {
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
        this.legacyOwner = undefined;
        this.paragraphItems.detachAll();
    }
    /**
     *  @private
     *
     * @param {Body} owner - The owning body.
     * @returns {void} Nothing is returned.
     */
    attach(owner: BodyBlockParseContext): void {
        this.legacyOwner = owner;
        this.paragraphItems.reattachAll();

        // Also trigger new BodyItem attachment if owner is a Body instance
        // This enables gradual migration to the new model
        if (owner !== undefined && 'items' in owner && isBodyItemInstance(this)) {
            try {
                const bodyHost: Body = owner as unknown as Body;
                // Only attach via new model if not already attached
                if (this.ownerTextBody === undefined) {
                    this.attachToBody(bodyHost);
                }
            } catch {
                // Silent failure - owner may not support attachToBody yet
            }
        }
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
        // Prefer new BodyItem ownership model, fall back to legacy owner
        const bodyOwner: Body = this.ownerTextBody;
        if (bodyOwner !== undefined) {
            // Use new model - item is attached via BodyItem
            bodyOwner.items.assertAttached(this);
            return;
        }
        // Fall back to legacy model for transitional code paths
        if (this.legacyOwner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }
        this.legacyOwner.assertAttachedParagraph(this);
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
        // Prefer new BodyItem ownership model, fall back to legacy owner
        const bodyOwner: Body = this.ownerTextBody;
        if (bodyOwner !== undefined) {
            // Use inherited BodyItem method
            return super.owningDocument();
        }
        // Fall back to legacy model
        if (this.legacyOwner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }
        return this.legacyOwner.owningDocument();
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
     * @returns {void}
     * @param {string} _style - Specifies the style.
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
     * Gets a value indicating whether this paragraph’s nearest body owner is a table cell (including nested table cells). False for body, header/footer, text box, footnote, endnote, or detached paragraphs.
     *
     * @public
     */
    get isInCell(): boolean {
        const body: BodyBlockParseContext = this.legacyOwner;
        if (body === undefined) {
            return false;
        }
        // Check if body is a TableCell by looking for isTableCell marker
        return (body as any).isTableCell === true;
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
        if (this.legacyOwner !== undefined) {
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
     * before body ownership is established.
     */
    replaceSectionBreakPropertiesModel(value: {
        toOpenXml(): OpenXmlElement;
    } | undefined): void {
        if (this.legacyOwner !== undefined) {
            this.mutate();
        }
        this.sectionBreakPropertiesModelValue = value;
        if (value !== undefined) {
            this.sectionBreakSectPrElement = undefined;
        }
    }
    /**
     * Gets the collection of items in the paragraph, such as text ranges, breaks, tabs, and pictures, in document order.
     *
     * @public
     */
    get items(): ParagraphItemCollection {
        return this.paragraphItems;
    }
    /**
     * Gets the plain text of the paragraph.
     *
     * Tab items are returned as tab characters. Field codes and items that are not text, such as hyperlinks, are not included.
     *
     * @public
     */
    get text(): string {
        const parts: string[] = [];
        const items: ParagraphItem[] = this.paragraphItems.snapshot();
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
     * @returns {TextRange} - Returns the newly created empty text range.
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
     * Appends an empty display equation to the end of the paragraph.
     *
     * @returns {DocMath} - Returns the new {@link Math} item, which is a display equation until `changeToInline()` is called.
     * @public
     */
    appendMath(): DocMath;
    /**
     * Appends a native math item whose equation is parsed from a LaTeX string.
     *
     * Unsupported or malformed LaTeX degrades to plain math text instead of throwing.
     *
     * @param {string} latex - Specifies the laTeX source, for example `\\frac{a}{b}`.
     * @returns {DocMath} - Returns the new {@link Math} item.
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
     * Appends text to the paragraph, optionally with character formatting.
     *
     * Tab characters become tab items. Newline characters start new paragraphs.
     *
     * @returns {TextRange} - Returns the first {@link TextRange} created for non-empty text segments, or.
     * an empty trailing {@link TextRange} when `text` is empty or tab-only (so the
     * return type stays {@link TextRange}).
     * @param {string} text - Specifies the text.
     * @param {Object} options - Specifies the options.
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
        const items: ParagraphItem[] = createTextAndTabItems(text, group);
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
            const items: ParagraphItem[] = createTextAndTabItems(text, group);
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
        if (this.legacyOwner === undefined) {
            throw new DetachedObjectError('This paragraph is no longer in a document');
        }

        let firstTextRange: TextRange | undefined;

        // Append first segment to this paragraph
        const firstSegment: string = parts[0];
        if (firstSegment !== undefined && firstSegment.length > 0) {
            const group: WireRunGroup = new WireRunGroup();
            const items: ParagraphItem[] = createTextAndTabItems(firstSegment, group);
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
        if (isParagraphBlockHost(this.legacyOwner)) {
            const ownerAsHost: ParagraphBlockHost = this.legacyOwner;
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
                        newParagraph.attach(this.legacyOwner);
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
        const items: ParagraphItem[] = createTextAndTabItems(segment, group);
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
     * Appends a break to the paragraph.
     *
     * @returns {Break} - Returns the break item.
     * @param {BreakType} type - Specifies the type.
     * @param {AppendBreakOptions} options - Specifies the options.
     * @throws DocxError `content/invalid-break` if `clear` is set on Page or Column.
     * @example
     * ```ts
     * paragraph.appendBreak(BreakType.PageBreak);
     * paragraph.appendBreak(BreakType.LineBreak, { clear: BreakClearType.All });
     * ```
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
     * Appends a symbol character to the paragraph.
     *
     * @param {string} font - Specifies the symbol font name, for example `"Wingdings"`.
     * @param {string} char - Specifies the four-digit hexadecimal character code, for example `"F0FC"`.
     * @returns {Symbol} - Returns the symbol that was added.
     * @example
     * ```ts
     * paragraph.appendText('checkmark: ');
     * paragraph.appendSymbol('Wingdings', 'F0FC');
     * ```
     * @public
     */
    // eslint-disable-next-line @typescript-eslint/ban-types -- project Symbol class, not the global primitive wrapper
    appendSymbol(font: string, char: string): Symbol {
        this.mutate();
        // eslint-disable-next-line @typescript-eslint/ban-types -- project Symbol class, not the global primitive wrapper
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
     * @returns {Chart} - Returns the live Chart paragraph item with full API access.
     * @param {string} chartType - Specifies the chart type.
     * @param {number} width - Specifies the width.
     * @param {number} height - Specifies the height.
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
     * Append a bookmark start marker at the end of the paragraph.
     *
     * @returns {BookmarkStart} - Returns the authored start marker (pending negative id until save).
     * @param {string} name - Specifies the name.
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
     * Append a bookmark end marker.
     *
     * The end marker will pair with the most recent unmatched start marker
     * that has the same name (after normalization). Place after the desired
     * enclosed content (same or a later paragraph) so the pair spans the intended range.
     *
     * @returns {BookmarkEnd} - Returns the authored end marker.
     * @param {string} name - Specifies the name.
     * @public
     */
    appendBookmarkEnd(name: string): BookmarkEnd {
        this.mutate();
        const end: BookmarkEnd = new BookmarkEnd(name);
        this.paragraphItems.add(end);
        return end;
    }

    /**
     * Append a checkbox form field.
     *
     * @returns {CheckBoxFormField} - Returns the checkbox form field.
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
        const field: CheckBoxFormField = new CheckBoxFormField();

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
        const bookmarkStart: BookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);

        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);

        // Add field code text range (FORMCHECKBOX)
        this.appendText('FORMCHECKBOX');

        // Add end mark
        const endMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);

        // Add bookmark end
        const bookmarkEnd: BookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
        this.paragraphItems.add(bookmarkEnd);

        return field;
    }

    /**
     * Append a dropdown form field.
     *
     * @returns {DropDownFormField} - Returns the dropdown form field.
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
        const field: DropDownFormField = new DropDownFormField();

        // Generate a bookmark name if not set
        const bookmarkName: string = (name !== undefined && name !== null && name.length > 0) ?
            name : generateFormFieldId('DropDown');

        // Assign the generated name to the field
        field.name = bookmarkName;

        // Add bookmark start
        const bookmarkStart: BookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);

        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);

        // Add field code text range (FORMDROPDOWN)
        this.appendText('FORMDROPDOWN');

        // Add end mark
        const endMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);

        // Add bookmark end
        const bookmarkEnd: BookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
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
        const field: TextFormField = new TextFormField();

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
        const bookmarkStart: BookmarkStart = new BookmarkStart(bookmarkName);
        this.paragraphItems.add(bookmarkStart);

        // Add the form field as the begin item (it extends Field and serializes as w:fldChar begin)
        this.paragraphItems.add(field);

        // Add field code text range (FORMTEXT)
        this.appendText('FORMTEXT');

        // Add separator mark (for TextFormField)
        const separatorMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.Separator, undefined, undefined, []);
        this.paragraphItems.add(separatorMark);

        // Add result text range (displays the default text or current value)
        this.appendText(textValue);

        // Add end mark
        const endMark: ParagraphFieldMark = new ParagraphFieldMark(ParagraphFieldMarkType.End, undefined, undefined, []);
        this.paragraphItems.add(endMark);

        // Add bookmark end
        const bookmarkEnd: BookmarkEnd = new BookmarkEnd(bookmarkStart.name, bookmarkStart.bookmarkId);
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
     * @returns {ParagraphItem} The stored item (the value itself for modeled inline items, otherwise its wrapper).
     * @private
     */
    appendFeatureInline(featureId: FeatureId, value: FeatureInline): ParagraphItem {
        this.mutate();
        const item: ParagraphItem = isDirectInlineFeatureItem(value) ? value : new FeatureInlineParagraphItem(featureId, value);
        this.paragraphItems.add(item);
        return item;
    }
    /**
     * Inserts a feature-owned inline at a raw content index (`0…items.count` inclusive).
     *
     * @param {number} index - The index.
     * @param {FeatureId} featureId - The feature id.
     * @param {FeatureInline} value - The value.
     * @returns {ParagraphItem} The stored item (the value itself for modeled inline items, otherwise its wrapper).
     * @private
     */
    insertFeatureInlineAt(index: number, featureId: FeatureId, value: FeatureInline): ParagraphItem {
        this.mutate();
        const item: ParagraphItem = isDirectInlineFeatureItem(value) ? value : new FeatureInlineParagraphItem(featureId, value);
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
        const items: ParagraphItem[] = this.paragraphItems.snapshot();
        for (const [i, item] of items.entries()) {
            if (item === (value as unknown) || (item instanceof FeatureInlineParagraphItem && item.value === value)) {
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
        const items: ParagraphItem[] = this.paragraphItems.snapshot();
        for (const [i, item] of items.entries()) {
            if (item instanceof FeatureRunParagraphItem && item.value === value) {
                this.paragraphItems.removeAt(i);
                return;
            }
        }
        throw new DetachedObjectError('This item is no longer in its paragraph');
    }
    /**
     * @param {ParagraphItem} item - The item.
     * @returns {void} Nothing is returned.
     *  Append a pre-built paragraph item (feature modules).
     *
     * @private
     */
    appendParagraphItem(item: ParagraphItem): void {
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
     * @param {BodyBlockParseContext} owner - The owning body or body-like host.
     * @returns {Paragraph} The result.
     */
    static fromXml(el: OpenXmlElement, owner: BodyBlockParseContext): Paragraph {
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
        this.paragraphItems.hydrate(items as ReadonlyArray<ParagraphItem>);
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
        items: ParagraphItem[];
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
        // formatting state hydrates from parseParagraphFormat snapshot.
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
        items: ParagraphItem[];
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

    /**
     * Create an independent copy of this paragraph.
     * All formatting, list format, and items are cloned.
     *
     * The cloned paragraph is detached and has no owner until attached to a body
     * or section.
     *
     * @returns {Paragraph} Cloned paragraph.
     * @public
     */
    clone(): Paragraph {
        const cloned: Paragraph = new Paragraph(undefined);
        const snap: ReturnType<Paragraph['snapshot']> = this.snapshot();
        const clonedItems: ParagraphItem[] = snap.items.map(
            (item: ParagraphItem): ParagraphItem => cloneParagraphItem(item)
        );

        // hydrate copies the style id, list ids, and the paragraph/break formats into
        // formats that the cloned paragraph owns; items attach to the cloned paragraph.
        cloned.hydrate({
            extraAttributes: snap.extraAttributes,
            styleIdValue: snap.styleIdValue,
            numIdValue: snap.numIdValue,
            listLevelValue: snap.listLevelValue,
            numPrExtra: snap.numPrExtra,
            sectionBreakSectPr: snap.sectionBreakSectPr,
            items: clonedItems,
            // Format clones own their records, so edits to the source never reach the copy.
            paragraphFormat: this.paragraphFormat.clone().snapshot(),
            breakCharacterFormat: this.breakCharacterFormat.clone().snapshot()
        });
        return cloned;
    }
}

/**
 * Clone a single paragraph item recursively.
 * Used by Paragraph.clone() to deep-copy all items.
 *
 * @param {ParagraphItem} source - Source paragraph item to clone
 * @returns {ParagraphItem} Cloned paragraph item
 * @private
 */
function cloneParagraphItem(source: ParagraphItem): ParagraphItem {
    // Clone TextRange
    if (source instanceof TextRange) {
        return source.clone();
    }

    // Clone Break
    if (source instanceof Break) {
        return new Break(source.breakType, source.clear, source.extras);
    }

    // Clone Symbol
    if (source instanceof Symbol) {
        return new Symbol(source.font, source.char);
    }

    // Clone Tab
    if (source instanceof Tab) {
        return new Tab();
    }

    // Clone CarriageReturn
    if (source instanceof CarriageReturn) {
        return new CarriageReturn();
    }

    // Clone FeatureRunParagraphItem - try to clone wrapped FeatureRunLeaf values
    // Picture, DrawingShape, and other FeatureRunLeaf types should implement clone()
    if (source instanceof FeatureRunParagraphItem) {
        const wrappedValue: FeatureRunLeaf = source.value;
        const clonedValue: FeatureRunLeaf = cloneFeatureRunLeaf(wrappedValue);
        return new FeatureRunParagraphItem(source.featureId, clonedValue);
    }

    // Clone FeatureInlineParagraphItem - try to clone wrapped FeatureInline values
    // ContentControl and other FeatureInline types should implement clone()
    if (source instanceof FeatureInlineParagraphItem) {
        const wrappedValue: FeatureInline = source.value;
        const clonedValue: FeatureInline = cloneFeatureInline(wrappedValue);
        return new FeatureInlineParagraphItem(source.featureId, clonedValue);
    }

    // For OpaqueParagraphItem, preserve as-is (unmodeled XML)
    if (source instanceof OpaqueParagraphItem) {
        return source;
    }

    // Fallback: return as-is (should not reach here in normal operation)
    return source;
}

/**
 * Clone a FeatureRunLeaf value (Picture, DrawingShape, Field, etc.).
 * Checks instanceof and calls clone() if available.
 *
 * @param {FeatureRunLeaf} source - The feature run leaf to clone
 * @returns {FeatureRunLeaf} Cloned value or preserved if clone not available
 * @private
 */
function cloneFeatureRunLeaf(source: FeatureRunLeaf): FeatureRunLeaf {
    // Import types dynamically to avoid circular dependencies
    // Check by class name pattern rather than instanceof to keep dependencies minimal
    const cloneable: { clone?: () => FeatureRunLeaf } = source as { clone?: () => FeatureRunLeaf };
    if (typeof cloneable.clone === 'function') {
        // Picture, DrawingShape, Field, FieldMark, and other cloneable types
        return cloneable.clone();
    }
    // Preserve as-is if not cloneable
    return source;
}

/**
 * Clone a FeatureInline value (ContentControl, etc.).
 * Checks instanceof and calls clone() if available.
 *
 * @param {FeatureInline} source - The feature inline to clone
 * @returns {FeatureInline} Cloned value or preserved if clone not available
 * @private
 */
function cloneFeatureInline(source: FeatureInline): FeatureInline {
    // Check if clone method exists and call it
    const cloneable: { clone?: () => FeatureInline } = source as { clone?: () => FeatureInline };
    if (typeof cloneable.clone === 'function') {
        // InlineContentControl and other cloneable types
        return cloneable.clone();
    }
    // Preserve as-is if not cloneable
    return source;
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
 * @param {Body} owner - The owning body.
 * @returns {Paragraph} The result.
 */
function parseParagraph(el: OpenXmlElement, owner: BodyBlockParseContext): Paragraph {
    const paragraph: Paragraph = new Paragraph(owner);
    let styleIdValue: string | undefined;
    let numIdValue: number | undefined;
    let listLevelValue: number | undefined;
    let sectionBreakSectPr: OpenXmlElement | undefined;
    const numPrExtra: OpenXmlElement[] = [];
    const items: ParagraphItem[] = [];
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
            // format-owned pPr interpretation (skips pStyle/numPr/rPr/sectPr).
            formatSnap = parseParagraphFormat(child);
            continue;
        }
        if (isWml(child, 'r')) {
            // Owner is applied by paragraph.hydrate → collection.hydrate.
            const groupItems: ParagraphItem[] = parseTextRangeGroup(child, undefined);
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
            items.push(isDirectInlineFeatureItem(feature.value)
                ? feature.value
                : new FeatureInlineParagraphItem(feature.featureId, feature.value));
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
 * {@link ParagraphFormat.buildPPrChildren} (CT_PPr order).
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
        items: ParagraphItem[];
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
    // Word pageBreakAfter has no ECMA pPr child. Body serializers emit a
    // following page-break-only paragraph via shouldEmitPageBreakAfterParagraph /
    // createPageBreakAfterParagraphElement — do not append w:br into this w:p.
    // Citation: the format specification (deliberate omissions); ECMA-376-1 §17.3.3.1 w:br.
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
        items: ParagraphItem[];
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

