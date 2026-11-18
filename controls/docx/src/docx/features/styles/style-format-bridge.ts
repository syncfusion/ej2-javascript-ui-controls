/**
 * Bridges immutable Modeled* transfer bags and live CharacterFormat /
 * ParagraphFormat snapshots.
 *
 * Modeled bags remain catalog / resolver transfer values only. Live Style
 * facades own mutable w:rPr / w:pPr state. Conversion is always via the
 * existing parse/serialize codecs so extras and full CF/PF surfaces stay
 * coherent (Style_Architecture_change.txt §8–9).
 *
 * @private
 */
import {
    buildRPrChildrenFromSnapshot,
    CharacterFormatSnapshot,
    parseCharacterFormat
} from '../document/character-format';
import {
    buildPPrChildrenFromSnapshot,
    emptyParagraphFormatSnapshot,
    ParagraphFormatSnapshot,
    parseParagraphFormat
} from '../document/paragraph-format';
import { wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import {
    EMPTY_MODELED_PARAGRAPH_PROPERTIES,
    ModeledParagraphProperties,
    parseModeledParagraphProperties,
    serializeModeledParagraphProperties
} from './paragraph-properties';
import {
    EMPTY_MODELED_RUN_PROPERTIES,
    ModeledRunProperties,
    parseModeledRunProperties,
    serializeModeledRunProperties
} from './run-properties';

/**
 * Convert a modeled run-properties bag into a CharacterFormat hydrate snapshot.
 * Uses serialize → parse so theme fonts, underline, lang, and size units match
 * the body CF codec.
 *
 * @param {ModeledRunProperties} properties - The properties.
 * @returns {CharacterFormatSnapshot} The result.
 * @private
 */
export function modeledRunPropertiesToCharacterSnapshot(
    properties: ModeledRunProperties
): CharacterFormatSnapshot {
    const rPr: OpenXmlElement = serializeModeledRunProperties(properties);
    if (rPr === undefined) {
        return parseCharacterFormat(wmlElement('rPr'));
    }
    return parseCharacterFormat(rPr);
}

/**
 * Convert a live CharacterFormat snapshot into a modeled run-properties bag for
 * resolver merge / theme resolution. Unsupported children stay on the snapshot
 * (`rPrExtra`) and are not reduced into ModeledRunProperties.
 *
 * @param {CharacterFormatSnapshot} snapshot - The snapshot.
 * @returns {ModeledRunProperties} The result.
 * @private
 */
export function characterSnapshotToModeledRunProperties(
    snapshot: CharacterFormatSnapshot
): ModeledRunProperties {
    const children: OpenXmlElement[] = buildRPrChildrenFromSnapshot(snapshot);
    if (children.length === 0) {
        return EMPTY_MODELED_RUN_PROPERTIES;
    }
    return parseModeledRunProperties(wmlElement('rPr', { children }));
}

/**
 * Convert a modeled paragraph-properties bag into a ParagraphFormat snapshot.
 *
 * @param {ModeledParagraphProperties} properties - The properties.
 * @returns {ParagraphFormatSnapshot} The result.
 * @private
 */
export function modeledParagraphPropertiesToParagraphSnapshot(
    properties: ModeledParagraphProperties
): ParagraphFormatSnapshot {
    const pPr: OpenXmlElement = serializeModeledParagraphProperties(properties);
    if (pPr === undefined) {
        return emptyParagraphFormatSnapshot();
    }
    return parseParagraphFormat(pPr);
}

/**
 * Convert a live ParagraphFormat snapshot into a modeled paragraph-properties bag.
 *
 * @param {ParagraphFormatSnapshot} snapshot - The snapshot.
 * @returns {ModeledParagraphProperties} The result.
 * @private
 */
export function paragraphSnapshotToModeledParagraphProperties(
    snapshot: ParagraphFormatSnapshot
): ModeledParagraphProperties {
    const children: OpenXmlElement[] = buildPPrChildrenFromSnapshot(snapshot);
    if (children.length === 0) {
        return EMPTY_MODELED_PARAGRAPH_PROPERTIES;
    }
    return parseModeledParagraphProperties(wmlElement('pPr', { children }));
}

/**
 * Parse full CF snapshot from an optional `w:rPr` element (style body).
 *
 * @param {OpenXmlElement | undefined} rPr - The r pr.
 * @returns {CharacterFormatSnapshot} The result.
 * @private
 */
export function characterSnapshotFromRPr(
    rPr: OpenXmlElement | undefined
): CharacterFormatSnapshot {
    if (rPr === undefined) {
        return parseCharacterFormat(wmlElement('rPr'));
    }
    return parseCharacterFormat(rPr);
}

/**
 * Parse full PF snapshot from an optional `w:pPr` element (style body).
 * Style-level `w:pPr` must not carry `w:pStyle` / `w:rPr` / `w:sectPr` as
 * paragraph-owned children — the PF parser already skips those names.
 *
 * @param {OpenXmlElement | undefined} pPr - The p pr.
 * @returns {ParagraphFormatSnapshot} The result.
 * @private
 */
export function paragraphSnapshotFromPPr(
    pPr: OpenXmlElement | undefined
): ParagraphFormatSnapshot {
    if (pPr === undefined) {
        return emptyParagraphFormatSnapshot();
    }
    return parseParagraphFormat(pPr);
}

/**
 * Empty modeled run-properties bag (resolver / package defaults).
 *
 * @returns {ModeledRunProperties} The result.
 * @private
 */
export function emptyModeledRunProperties(): ModeledRunProperties {
    return EMPTY_MODELED_RUN_PROPERTIES;
}
