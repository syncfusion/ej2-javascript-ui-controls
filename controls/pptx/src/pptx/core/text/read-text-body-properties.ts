import { findChild, getAttr } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { OoxmlElement } from '../xml/dom';
import { TextAutoFit, TextBodyProperties, TextVerticalAnchor, TextVerticalType, TextWrapping } from './text-layout-types';

/**
 * Reads the existing direct body-property contract without constructing an editing object.
 *
 * @param {OoxmlElement} txBody - Actual DrawingML or PresentationML text body.
 * @returns {TextBodyProperties} Sparse authored values, with no inheritance or mutation.
 * @internal
 */
export function readTextBodyDirectProperties(txBody: OoxmlElement): TextBodyProperties {
    const bodyPr: OoxmlElement = findChild(txBody, DML_NS, 'bodyPr');
    if (bodyPr === undefined) {
        return {};
    }
    return {
        leftInset: readEmuPoints(bodyPr, 'lIns'),
        topInset: readEmuPoints(bodyPr, 'tIns'),
        rightInset: readEmuPoints(bodyPr, 'rIns'),
        bottomInset: readEmuPoints(bodyPr, 'bIns'),
        anchor: token<TextVerticalAnchor>(getAttr(bodyPr, '', 'anchor'), ['t', 'ctr', 'b', 'just', 'dist']),
        wrap: token<TextWrapping>(getAttr(bodyPr, '', 'wrap'), ['none', 'square']),
        columnCount: readPositiveInteger(bodyPr, 'numCol'),
        columnSpacing: readEmuPoints(bodyPr, 'spcCol'),
        verticalType: token<TextVerticalType>(getAttr(bodyPr, '', 'vert'),
                                              ['horz', 'vert', 'vert270', 'wordArtVert', 'eaVert', 'mongolianVert', 'wordArtVertRtl']),
        autoFit: readAutoFit(bodyPr)
    };
}

/**
 * Reads the direct autofit choice.
 *
 * @internal
 * @param {OoxmlElement} bodyPr - Direct text-body properties element.
 * @returns {TextAutoFit | undefined} Sparse direct autofit choice.
 */
function readAutoFit(bodyPr: OoxmlElement): TextAutoFit | undefined {
    if (findChild(bodyPr, DML_NS, 'noAutofit') !== undefined) {
        return { type: 'none' };
    }
    if (findChild(bodyPr, DML_NS, 'spAutoFit') !== undefined) {
        return { type: 'shape' };
    }
    const normal: OoxmlElement = findChild(bodyPr, DML_NS, 'normAutofit');
    if (normal === undefined) {
        return undefined;
    }
    return {
        type: 'normal',
        fontScale: readThousandthPercent(normal, 'fontScale'),
        lineSpacingReduction: readThousandthPercent(normal, 'lnSpcReduction')
    };
}

/**
 * Reads an EMU attribute as points.
 *
 * @internal
 * @param {OoxmlElement} element - Source element.
 * @param {string} name - Unqualified attribute name.
 * @returns {number | undefined} Converted value when valid.
 */
function readEmuPoints(element: OoxmlElement, name: string): number | undefined {
    const raw: string = getAttr(element, '', name);
    const value: number = Number(raw);
    return raw !== undefined && Number.isFinite(value) ? value / 12700 : undefined;
}

/**
 * Reads a positive integer attribute.
 *
 * @internal
 * @param {OoxmlElement} element - Source element.
 * @param {string} name - Unqualified attribute name.
 * @returns {number | undefined} Integer when valid.
 */
function readPositiveInteger(element: OoxmlElement, name: string): number | undefined {
    const raw: string = getAttr(element, '', name);
    const value: number = Number(raw);
    return raw !== undefined && Number.isInteger(value) && value > 0 ? value : undefined;
}

/**
 * Reads a DrawingML thousandth-percent attribute.
 *
 * @internal
 * @param {OoxmlElement} element - Source element.
 * @param {string} name - Unqualified attribute name.
 * @returns {number | undefined} Percentage when valid.
 */
function readThousandthPercent(element: OoxmlElement, name: string): number | undefined {
    const raw: string = getAttr(element, '', name);
    const value: number = Number(raw);
    return raw !== undefined && Number.isFinite(value) ? value / 1000 : undefined;
}

/**
 * Validates one schema token without inventing a fallback.
 *
 * @internal
 * @template T
 * @param {string | undefined} value - Candidate token.
 * @param {ReadonlyArray<T>} allowed - Schema token set.
 * @returns {T | undefined} Valid token only.
 */
function token<T extends string>(value: string | undefined, allowed: ReadonlyArray<T>): T | undefined {
    return allowed.find((candidate: T): boolean => candidate === value);
}
