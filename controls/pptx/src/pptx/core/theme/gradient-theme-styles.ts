import { TextLineStyleSnapshot, readTextLineStyle } from '../text/text-line-style';
import { OutlineEnds, readOutlineEndList } from '../resolve/outline-line-ends';
/** Complete sparse fill matrices loaded once with the owning theme. */
import { readDrawingFillChoice, readDrawingFillProperties, TextFillSnapshot } from '../text/character-fills';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { findChild } from '../shapes/dom-utils';
import { arrayAt } from '../util/es5-compat';
import { GradientInheritanceSource } from '../resolve/gradient-resolution-types';
import { getGradientDrawingNamespace, readAuthoredGradient } from './read-gradient';

/** Direct sparse matrix entries; non-gradient entries retain their choice barrier. */
export type GradientThemeStyle = GradientInheritanceSource['fill'] | TextFillSnapshot;
/** Independent theme fill lists; undefined is unavailable, [] is present empty. */
export interface GradientThemeStyles {
    /** Sparse raw line geometry aligned to the independent line matrix; absent in older producers. */
    readonly lineStyles?: ReadonlyArray<TextLineStyleSnapshot>;
    /** Sparse independent line decorations, optional on older producers. */
    readonly lineEnds?: ReadonlyArray<OutlineEnds>;
    /** Independent line fills; absent on older producers or unavailable themes. */
    readonly lines?: ReadonlyArray<GradientThemeStyle>;
    /** Complete fillStyleLst entries. */
    readonly fills: ReadonlyArray<GradientThemeStyle> | undefined;
    /** Complete bgFillStyleLst entries, independent of fillStyleLst. */
    readonly backgrounds: ReadonlyArray<GradientThemeStyle> | undefined;
}
/**
 * Reads sparse matrices without resolving colors or applying Office defaults.
 *
 * @param {OoxmlElement | undefined} format - Theme fmtScheme element.
 * @param {string} partName - Owning theme part for diagnostics.
 * @returns {GradientThemeStyles} Authored lists separate from legacy projections.
 * @internal
 */
export function readGradientThemeStyles(format: OoxmlElement | undefined, partName: string): GradientThemeStyles {
    if (format === undefined) { return { fills: undefined, backgrounds: undefined }; }
    const ns: string | undefined = getGradientDrawingNamespace(format.namespaceUri);
    if (ns === undefined) { return { fills: undefined, backgrounds: undefined }; }
    return {
        lineStyles: readLineStyles(findChild(format, ns, 'lnStyleLst'), ns),
        lineEnds: readOutlineEndList(findChild(format, ns, 'lnStyleLst'), ns),
        lines: readLineList(findChild(format, ns, 'lnStyleLst'), ns, partName),
        fills: readList(findChild(format, ns, 'fillStyleLst'), ns, partName),
        backgrounds: readList(findChild(format, ns, 'bgFillStyleLst'), ns, partName)
    };
}
/**
 * Reads one matrix list without dropping non-gradient choice barriers.
 *
 * @param {OoxmlElement | undefined} list - Direct style list.
 * @param {string} ns - DrawingML namespace URI.
 * @param {string} partName - Owning theme part.
 * @returns {ReadonlyArray<GradientThemeStyle> | undefined} Complete ordered entries.
 */
function readList(list: OoxmlElement | undefined, ns: string, partName: string): ReadonlyArray<GradientThemeStyle> | undefined {
    if (list === undefined) { return undefined; }
    const entries: GradientThemeStyle[] = [];
    for (let i: number = 0; i < list.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(list.children, i);
        if (child.kind !== 'element' || child.namespaceUri !== ns) { continue; }
        const gradient: GradientThemeStyle | undefined = readAuthoredGradient(child, partName);
        if (gradient !== undefined) { entries.push(gradient); continue; }
        switch (child.localName) {
        case 'noFill': entries.push({ kind: 'none' }); break;
        case 'solidFill': entries.push(readDrawingFillProperties({ ...list, children: [child] }, ns, partName)); break;
        case 'blipFill': entries.push({ kind: 'picture' }); break;
        case 'pattFill': entries.push({ kind: 'pattern' }); break;
        case 'grpFill': entries.push({ kind: 'group' }); break;
        default: entries.push({ kind: 'unknown' }); break;
        }
    }
    return entries;
}

/**
 * Reads line carriers without shifting malformed or non-gradient slots.
 *
 * @param {OoxmlElement | undefined} list - Independent line style list.
 * @param {string} ns - Exact DrawingML namespace.
 * @param {string} partName - Owning theme identity.
 * @returns {ReadonlyArray<GradientThemeStyle> | undefined} Sparse line choices.
 */
function readLineList(list: OoxmlElement | undefined, ns: string,
                      partName: string): ReadonlyArray<GradientThemeStyle> | undefined {
    if (list === undefined) { return undefined; }
    const entries: GradientThemeStyle[] = [];
    for (let i: number = 0; i < list.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(list.children, i);
        if (child.kind !== 'element') { continue; }
        entries.push(child.namespaceUri === ns && child.localName === 'ln' ? readDrawingFillChoice(child, ns, partName) : { kind: 'unknown' });
    }
    return entries;
}

/** @param {OoxmlElement} list - Actual independent line-style list.
 * @param {string} ns - Exact DrawingML dialect.
 * @returns {ReadonlyArray<TextLineStyleSnapshot> | undefined} Sparse slots without shifting malformed entries.
 */
function readLineStyles(list: OoxmlElement | undefined, ns: string): ReadonlyArray<TextLineStyleSnapshot> | undefined {
    if (list === undefined) { return undefined; }
    const entries: TextLineStyleSnapshot[] = [];
    list.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind !== 'element') { return; }
        entries.push(child.namespaceUri === ns && child.localName === 'ln' ? readTextLineStyle(child, ns) || {} : {});
    });
    return entries;
}
