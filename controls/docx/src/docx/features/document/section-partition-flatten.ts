/**
 * Section partition (load) and flatten (save) for the single physical `w:body`.
 *
 * Evidence: ECMA-376-1 §11.3.10 (Main Document), §17.6 (section properties);
 * transitional `wml.xsd` body / sectPr / CT_PPr.sectPr. Break paragraph belongs
 * to the ending section. Non-final properties live on that paragraph; final
 * properties are the trailing body-level `w:sectPr`.
 *
 * @private
 */
import { SectionPropertiesModel } from './section-properties-model';
import { WordDocument } from './document';
import { BlockContent, Paragraph } from './paragraph';
import { OpenXmlElement } from '../../core/xml/index';

/**
 * One logical section after partition (internal blocks + page-setup source).
 *
 * @private
 */
export type SectionData = {
    readonly items: BlockContent[];
    /** Paragraph- or body-level section properties (XML or live model). */
    readonly properties: SectionPropertiesModel | OpenXmlElement | undefined;
    readonly isFinal: boolean;
};

/**
 * Optional feature hook: materialize live section properties from `w:sectPr` XML.
 * Installed by the sections feature so core never imports `SectionProperties`.
 *
 * @private
 */
export type SectionPropertiesParse = (
    element: OpenXmlElement,
) => SectionPropertiesModel | undefined;

/**
 * Optional feature hook: associate a live page-setup model with its owning document
 * (headers/footers WeakMap bridges). Core never imports `SectionProperties`.
 *
 * @private
 */
export type SectionPropertiesAttached = (
    model: SectionPropertiesModel,
    document: WordDocument,
) => void;

let sectionPropertiesParse: SectionPropertiesParse | undefined;
let sectionPropertiesAttached: SectionPropertiesAttached | undefined;

/**
 * @param {SectionPropertiesParse} parse - The parse.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerSectionPropertiesParse(parse: SectionPropertiesParse): void {
    sectionPropertiesParse = parse;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetSectionPropertiesParseForTests(): void {
    sectionPropertiesParse = undefined;
}

/**
 * @param {SectionPropertiesAttached} handler - The handler.
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerSectionPropertiesAttached(
    handler: SectionPropertiesAttached
): void {
    sectionPropertiesAttached = handler;
}

/**
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetSectionPropertiesAttachedForTests(): void {
    sectionPropertiesAttached = undefined;
}

/**
 * @param {SectionPropertiesModel | undefined} model - The model.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 * Notify the sections feature that a live page-setup model is attached to a document.
 */
export function notifySectionPropertiesAttached(
    model: SectionPropertiesModel | undefined,
    document: WordDocument
): void {
    if (model === undefined || sectionPropertiesAttached === undefined) {
        return;
    }
    sectionPropertiesAttached(model, document);
}

/**
 * @param {SectionPropertiesModel | OpenXmlElement | undefined} source - The source.
 * @returns {SectionPropertiesModel | OpenXmlElement | undefined} The result.
 * @private
 * Materialize XML `w:sectPr` to a live model when the sections feature is registered.
 */
export function materializeSectionProperties(
    source: SectionPropertiesModel | OpenXmlElement | undefined
): SectionPropertiesModel | OpenXmlElement | undefined {
    if (source === undefined) {
        return undefined;
    }
    if (typeof (source as SectionPropertiesModel).toOpenXml === 'function') {
        return source as SectionPropertiesModel;
    }
    if (sectionPropertiesParse === undefined) {
        return source;
    }
    const parsed: SectionPropertiesModel = sectionPropertiesParse(source as OpenXmlElement);
    return parsed !== undefined ? parsed : source;
}

/**
 * Resolve paragraph-level section break as model or preserved XML, if any.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {SectionPropertiesModel | OpenXmlElement | undefined} The result.
 * @private
 */
export function paragraphSectionBreakSource(
    paragraph: Paragraph
): SectionPropertiesModel | OpenXmlElement | undefined {
    const model: { toOpenXml(): OpenXmlElement; } = paragraph.sectionBreakPropertiesModel();
    if (model !== undefined) {
        return model;
    }
    return paragraph.sectionBreakSectPr();
}

/**
 * True when the paragraph closes a non-final section (has `w:pPr/w:sectPr`).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {boolean} The result.
 * @private
 */
export function paragraphClosesSection(paragraph: Paragraph): boolean {
    return paragraphSectionBreakSource(paragraph) !== undefined;
}

/**
 * Partition ordered body blocks + trailing body-level sectPr into logical sections.
 *
 * Non-final sections close on a paragraph that carries section properties; that
 * paragraph is included in the ending section. The final section uses
 * `trailingSectPr` (may be undefined for an empty/default final).
 *
 * @param {ReadonlyArray<BlockContent>} blocks - The blocks.
 * @param {SectionPropertiesModel | OpenXmlElement | undefined} trailingSectPr - The trailing sect pr.
 * @returns {SectionData[]} The result.
 * @private
 */
export function partitionBodyIntoSections(
    blocks: ReadonlyArray<BlockContent>,
    trailingSectPr: SectionPropertiesModel | OpenXmlElement | undefined
): SectionData[] {
    const sections: SectionData[] = [];
    let current: BlockContent[] = [];

    for (const block of blocks) {
        current.push(block);
        if (block.type === 'paragraph' && paragraphClosesSection(block.paragraph)) {
            const props: OpenXmlElement | SectionPropertiesModel = paragraphSectionBreakSource(block.paragraph);
            sections.push({
                items: current,
                properties: props,
                isFinal: false
            });
            current = [];
        }
    }

    sections.push({
        items: current,
        properties: trailingSectPr,
        isFinal: true
    });

    // Invariant: at least one section (empty body → single final with optional props).
    return sections;
}

/**
 * Attach page setup onto the last paragraph of a non-final section for serialize.
 * Clears dual-hold on the paragraph so the section's pageSetup is the source.
 *
 * @param {Paragraph} lastParagraph - The last paragraph.
 * @param {SectionPropertiesModel | OpenXmlElement | undefined} pageSetup - The page setup.
 * @returns {void} Nothing is returned.
 * @private
 */
export function applyNonFinalSectionBreak(
    lastParagraph: Paragraph,
    pageSetup: SectionPropertiesModel | OpenXmlElement | undefined
): void {
    if (pageSetup === undefined) {
        lastParagraph.replaceSectionBreakPropertiesModel(undefined);
        lastParagraph.replaceSectionBreakSectPr(undefined);
        return;
    }
    if (typeof (pageSetup as SectionPropertiesModel).toOpenXml === 'function') {
        lastParagraph.replaceSectionBreakPropertiesModel(pageSetup as SectionPropertiesModel);
        return;
    }
    lastParagraph.replaceSectionBreakSectPr(pageSetup as OpenXmlElement);
}

/**
 * Ensure a non-final section ends on a paragraph; append empty terminator if needed.
 * Returns the paragraph that will carry section properties.
 *
 * @param {BlockContent[]} items - The items.
 * @returns {Paragraph} The result.
 * @private
 */
export function ensureSectionTerminatorParagraph(
    items: BlockContent[]
): Paragraph {
    const last: BlockContent = items[items.length - 1];
    if (last !== undefined && last.type === 'paragraph') {
        return last.paragraph;
    }
    const paragraph: Paragraph = new Paragraph(undefined);
    items.push({ type: 'paragraph', paragraph });
    return paragraph;
}

/**
 * Flatten logical sections into one ordered body-child list (no trailing body sectPr).
 * Mutates non-final section stores only as needed to ensure terminator paragraphs and
 * attach paragraph-level section properties from each section's pageSetup.
 *
 * Caller appends body-final sectPr from the last section separately.
 *
 * @param {Function} sections - The sections.
 * @returns {BlockContent[]} The result.
 * @private
 */
export function flattenSectionsToBodyBlocks(
    sections: ReadonlyArray<{
        readonly listBlocks: () => ReadonlyArray<BlockContent>;
        readonly pageSetup: SectionPropertiesModel | undefined;
        /** Optional raw XML when pageSetup model is absent. */
        readonly pageSetupXml?: OpenXmlElement | undefined;
        readonly replaceItems?: (items: ReadonlyArray<BlockContent>) => void;
        readonly isLast: boolean;
    }>
): BlockContent[] {
    const out: BlockContent[] = [];

    for (const section of sections) {
        const isFinal: boolean = section.isLast;
        const raw: BlockContent[] = section.listBlocks().slice();
        const setup: OpenXmlElement | SectionPropertiesModel =
            section.pageSetup !== undefined
                ? section.pageSetup
                : section.pageSetupXml;

        if (!isFinal) {
            const terminator: Paragraph = ensureSectionTerminatorParagraph(raw);
            // When neither model nor XML page setup is available (sections feature
            // not registered), leave existing paragraph-level sectPr dual-hold alone.
            if (setup !== undefined || section.pageSetup !== undefined || section.pageSetupXml !== undefined) {
                applyNonFinalSectionBreak(terminator, setup);
            } else if (!paragraphClosesSection(terminator)) {
                // Terminator was just appended (section ended on non-paragraph) with
                // no properties to attach — still a valid empty closer; properties
                // remain absent (Word may treat as default section mark).
            }
            if (section.replaceItems !== undefined) {
                section.replaceItems(raw);
            }
        } else {
            // Final section must not leave paragraph-level sectPr on its last paragraph
            // from a prior dual-hold authoring path when pageSetup is body-level only.
            // Leave any internal paragraph breaks that intentionally closed earlier
            // non-final sections alone — those live in prior sections after partition.
            // Clear break on last paragraph only if it still holds a break that mirrors
            // final props (authoring via lastSection alone should not emit pPr sectPr).
            // Spec: final properties are body-level only.
            const last: BlockContent = raw[raw.length - 1];
            if (last !== undefined && last.type === 'paragraph') {
                // Do not strip if this paragraph was itself a mid-document break —
                // final section items never include those after correct partition.
                // Authoring bridge may still put sectionBreak on a final-section
                // paragraph; strip so body-level sectPr is sole final source.
                if (paragraphClosesSection(last.paragraph)) {
                    last.paragraph.replaceSectionBreakPropertiesModel(undefined);
                    last.paragraph.replaceSectionBreakSectPr(undefined);
                }
            }
            if (section.replaceItems !== undefined) {
                section.replaceItems(raw);
            }
        }

        for (const content of raw) {
            out.push(content);
        }
    }

    return out;
}

/**
 * Serialize page setup source to OpenXmlElement for body-final or paragraph sectPr.
 *
 * @param {SectionPropertiesModel | OpenXmlElement | undefined} source - The source.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function sectionPropertiesToOpenXml(
    source: SectionPropertiesModel | OpenXmlElement | undefined
): OpenXmlElement | undefined {
    if (source === undefined) {
        return undefined;
    }
    if (typeof (source as SectionPropertiesModel).toOpenXml === 'function') {
        return (source as SectionPropertiesModel).toOpenXml();
    }
    return source as OpenXmlElement;
}
