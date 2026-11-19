/**
 * Read direct text character properties from DrawingML DOM (rPr / defRPr / list styles).
 *
 * @remarks
 * Citation: Transitional `dml-main.xsd` `CT_TextCharacterProperties` (`@sz`,
 * `solidFill`); `CT_TextListStyle` `lvl1pPr`…`lvl9pPr`; `CT_ParagraphProperties`
 * optional `defRPr`.
 */
import { findChild, getAttr } from '../shapes/dom-utils';
import { DML_NS } from '../shapes/constants';
import { tryParseSolidFillColor } from '../theme/parse-color-choice';
import { ColorValue } from '../theme/color-value';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { arrayAt } from '../util/es5-compat';
/**
 * Atomic character props read from one `a:rPr` / `a:defRPr`.
 *
 * @internal
 */
export interface DirectCharProps {
    readonly fontSizeHundredths?: number;
    readonly color?: ColorValue;
}
/**
 * Reads `@sz` and `solidFill` colour from character properties.
 *
 * @internal
 * @param {OoxmlElement} charProps - `a:rPr` or `a:defRPr` element.
 * @returns {DirectCharProps} Sparse direct props (scheme colour on the run counts as specified).
 */
export function readCharProps(charProps: OoxmlElement): DirectCharProps {
    const sz: string = getAttr(charProps, '', 'sz');
    const fontSizeHundredths: number = sz !== undefined && /^-?\d+$/u.test(sz) ? Number(sz) : undefined;
    const color: ColorValue = tryParseSolidFillColor(charProps);
    return {
        ...(fontSizeHundredths !== undefined ? { fontSizeHundredths } : {}),
        ...(color !== undefined ? { color } : {})
    };
}
/**
 * Locates `a:rPr` under a regular run `a:r`.
 *
 * @internal
 * @param {OoxmlElement} runElement - The runElement value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findRunRPr(runElement: OoxmlElement): OoxmlElement | undefined {
    return findChild(runElement, DML_NS, 'rPr');
}
/**
 * Locates paragraph `a:pPr` under `a:p`.
 *
 * @internal
 * @param {OoxmlElement} paragraph - The paragraph value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findParagraphPPr(paragraph: OoxmlElement): OoxmlElement | undefined {
    return findChild(paragraph, DML_NS, 'pPr');
}
/**
 * Reads `@lvl` on `a:pPr` (0-based). Missing → `0` (lvl1pPr).
 *
 * @internal
 * @param {OoxmlElement} paragraph - The paragraph value.
 * @returns {number} The result.
 */
export function readParagraphLevel(paragraph: OoxmlElement): number {
    const pPr: OoxmlElement = findParagraphPPr(paragraph);
    if (pPr === undefined) {
        return 0;
    }
    const lvl: string = getAttr(pPr, '', 'lvl');
    if (lvl === undefined || !/^\d+$/u.test(lvl)) {
        return 0;
    }
    const n: number = Number(lvl);
    if (!Number.isSafeInteger(n) || n < 0 || n > 8) {
        return 0;
    }
    return n;
}
/**
 * `a:p` elements under a text body, document order.
 *
 * @internal
 * @param {OoxmlElement} txBody - The txBody value.
 * @returns {OoxmlElement[]} The result.
 */
export function listParagraphs(txBody: OoxmlElement): OoxmlElement[] {
    const result: OoxmlElement[] = [];
    for (let i: number = 0; i < txBody.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(txBody.children, i);
        if (child.kind === 'element' && child.namespaceUri === DML_NS && child.localName === 'p') {
            result.push(child);
        }

    }
    return result;
}
/**
 * Regular runs `a:r` under a paragraph, document order.
 *
 * @internal
 * @param {OoxmlElement} paragraph - The paragraph value.
 * @returns {OoxmlElement[]} The result.
 */
export function listRuns(paragraph: OoxmlElement): OoxmlElement[] {
    const result: OoxmlElement[] = [];
    for (let i: number = 0; i < paragraph.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(paragraph.children, i);
        if (child.kind === 'element' && child.namespaceUri === DML_NS && child.localName === 'r') {
            result.push(child);
        }

    }
    return result;
}
/**
 * Character props from run `rPr`, else paragraph `pPr/defRPr` on the same paragraph.
 *
 * @internal
 * @param {OoxmlElement} paragraph - The paragraph value.
 * @param {number} runIndex - The runIndex value.
 * @returns {DirectCharProps | undefined} The result.
 */
export function readRunPathProps(paragraph: OoxmlElement, runIndex: number): DirectCharProps | undefined {
    const runs: Array<OoxmlElement> = listRuns(paragraph);
    const run: OoxmlElement = arrayAt(runs, runIndex);
    if (run !== undefined) {
        const rPr: OoxmlElement = findRunRPr(run);
        if (rPr !== undefined) {
            const fromRun: DirectCharProps = readCharProps(rPr);
            if (fromRun.color !== undefined || fromRun.fontSizeHundredths !== undefined) {
                return fromRun;
            }
        }
    }
    const pPr: OoxmlElement = findParagraphPPr(paragraph);
    if (pPr === undefined) {
        return undefined;
    }
    const defRPr: OoxmlElement = findChild(pPr, DML_NS, 'defRPr');
    if (defRPr === undefined) {
        return undefined;
    }
    const fromDef: DirectCharProps = readCharProps(defRPr);
    if (fromDef.color === undefined && fromDef.fontSizeHundredths === undefined) {
        return undefined;
    }
    return fromDef;
}
/**
 * Character props for paragraph style (paragraph `defRPr` only — not run rPr).
 *
 * @internal
 * @param {OoxmlElement} paragraph - The paragraph value.
 * @returns {DirectCharProps | undefined} The result.
 */
export function readParagraphDefRPr(paragraph: OoxmlElement): DirectCharProps | undefined {
    const pPr: OoxmlElement = findParagraphPPr(paragraph);
    if (pPr === undefined) {
        return undefined;
    }
    const defRPr: OoxmlElement = findChild(pPr, DML_NS, 'defRPr');
    if (defRPr === undefined) {
        return undefined;
    }
    const props: DirectCharProps = readCharProps(defRPr);
    if (props.color === undefined && props.fontSizeHundredths === undefined) {
        return undefined;
    }
    return props;
}
/**
 * Maps 0-based paragraph level to list-style child local name (`lvl1pPr`…`lvl9pPr`).
 *
 * @internal
 * @param {number} level0Based - The level0Based value.
 * @returns {string} The result.
 */
export function listStyleLevelLocalName(level0Based: number): string {
    const clamped: number = Math.min(8, Math.max(0, level0Based));
    return `lvl${String(clamped + 1)}pPr`;
}
/**
 * Reads `defRPr` under a `CT_TextListStyle` for the given paragraph level.
 *
 * @internal
 * @param {OoxmlElement} listStyle - `a:lstStyle` or master `titleStyle`/`bodyStyle`/`otherStyle` root.
 * @param {number} level0Based - Paragraph `@lvl` (0 → lvl1pPr).
 * @returns {DirectCharProps | undefined} The result.
 */
export function readListStyleLevelProps(listStyle: OoxmlElement, level0Based: number): DirectCharProps | undefined {
    const levelEl: OoxmlElement = findChild(listStyle, DML_NS, listStyleLevelLocalName(level0Based));
    if (levelEl === undefined) {
        // Fallback: try defPPr on the list style (CT_TextListStyle optional defPPr).
        const defPPr: OoxmlElement = findChild(listStyle, DML_NS, 'defPPr');
        if (defPPr === undefined) {
            return undefined;
        }
        const defRPr: OoxmlElement = findChild(defPPr, DML_NS, 'defRPr');
        if (defRPr === undefined) {
            return undefined;
        }
        const props: DirectCharProps = readCharProps(defRPr);
        if (props.color === undefined && props.fontSizeHundredths === undefined) {
            return undefined;
        }
        return props;
    }
    const defRPr: OoxmlElement = findChild(levelEl, DML_NS, 'defRPr');
    if (defRPr === undefined) {
        return undefined;
    }
    const props: DirectCharProps = readCharProps(defRPr);
    if (props.color === undefined && props.fontSizeHundredths === undefined) {
        return undefined;
    }
    return props;
}
/**
 * Converts hundredths of a point to points.
 *
 * @internal
 * @param {number} hundredths - The hundredths value.
 * @returns {number} The result.
 */
export function hundredthsToPoints(hundredths: number): number {
    return hundredths / 100;
}
