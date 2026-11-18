/**
 * Per-shape `a16:creationId` extension list for `p:cNvPr`.
 *
 * @remarks
 * PowerPoint's repair heuristic rewrites each shape's `cNvPr` to inject a fresh
 * `a16:creationId` GUID and flags packages whose shapes lack one. The element
 * is schema-optional (`CT_NonVisualDrawingProps` `extLst` minOccurs=0) but
 * always emitted by Office-family generators on every shape. Emitting it here
 * avoids the repair prompt on freshly created decks.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `ppt/slides/slide1.xml` — every `p:sp/p:nvSpPr/p:cNvPr` carries:
 * ```xml
 * <a:extLst>
 *   <a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
 *     <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main"
 *                    id="{72618793-B473-2DB7-7D23-4B3953DFF41A}"/>
 *   </a:ext>
 * </a:extLst>
 * ```
 * The extension URI `{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}` is the
 * `creationId` extension marker used by Office 2016+ DrawingML.
 * `a16` namespace: `http://schemas.microsoft.com/office/drawing/2014/main`.
 */
import { OoxmlElement } from '../xml/index';
import { DML_NS } from './constants';
/**
 * DrawingML 2014 namespace (`a16`), used by `a16:creationId`.
 *
 * Citation: inspected `temp/simple-create-output-ms_office.pptx`
 * `ppt/slides/slide1.xml` `a16:creationId` element.
 */
import { padStart } from '../util/es5-compat';
export const A16_NS: string = 'http://schemas.microsoft.com/office/drawing/2014/main';
/**
 * Extension URI for the `a16:creationId` extension on `p:cNvPr`.
 *
 * Citation: inspected MS-Office reference fixture; ECMA-376 Part 1
 * `CT_NonVisualDrawingProps` `extLst` extension marker.
 */
export const CREATION_ID_EXT_URI: string = '{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}';
/**
 * Builds an `<a:extLst>` containing a single `a16:creationId` extension,
 * suitable as a child of `p:cNvPr` (`CT_NonVisualDrawingProps`).
 *
 * @internal
 * @param {string} guid - GUID string in `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` form.
 * @returns {OoxmlElement} A standalone `<a:extLst>` element.
 */
export function buildCreationIdExtLst(guid: string): OoxmlElement {
    const creationId: OoxmlElement = {
        kind: 'element' as 'element',
        namespaceUri: A16_NS,
        localName: 'creationId',
        attributes: [{ namespaceUri: '', localName: 'id', value: guid }],
        children: [],
        prefixHint: 'a16',
        namespaceDeclarations: [{ prefix: 'a16', uri: A16_NS }]
    };
    const ext: OoxmlElement = {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName: 'ext',
        attributes: [{ namespaceUri: '', localName: 'uri', value: CREATION_ID_EXT_URI }],
        children: [creationId],
        prefixHint: 'a'
    };
    return {
        kind: 'element' as 'element',
        namespaceUri: DML_NS,
        localName: 'extLst',
        attributes: [],
        children: [ext],
        prefixHint: 'a'
    };
}
/**
 * Deterministic monotonic GUID generator for `a16:creationId/@id`.
 *
 * @remarks The library avoids pulling `node:crypto` into the core bundle (see `src/pptx/core/package/open.ts` encryption note). Instead, GUIDs
 * are derived deterministically from a monotonic counter seeded at module load. PowerPoint tolerates identical or synthetic GUIDs (it
 * regenerates them on first edit); the only requirement is that the `@id` value is a syntactically valid `s:ST_Guid`
 * (`{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` uppercase hex). Citation: `dml-main.xsd` `s:ST_Guid` — `{` + hex8 `-` hex4 `-` hex4 `-` hex4
 * `-` hex12 `}`. Upper-case hex per Office authoring form. distinct deterministic GUID; the same seed always yields the same GUID.
 * @internal
 * @param {number} seed - Numeric seed (e.g. shape id). Each distinct seed yields a
 * @returns {string} A `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` GUID string.
 */
export function creationIdGuid(seed: number): string {
    // Splitmix32 — small, deterministic, no external dependency.
    let s: number = seed >>> 0;
    const next: () => number = (): number => {
        s = (s + 0x9e3779b9) >>> 0;
        let z: number = s;
        z = (z ^ (z >>> 16)) >>> 0;
        z = Math.imul(z, 0x85ebca6b) >>> 0;
        z = (z ^ (z >>> 13)) >>> 0;
        z = Math.imul(z, 0xc2b2ae35) >>> 0;
        z = (z ^ (z >>> 16)) >>> 0;
        return z >>> 0;
    };
    const hex: (n: number, width: number) => string = (n: number, width: number): string => padStart(n.toString(16).toUpperCase(), width,
                                                                                                     '0').slice(-width);
    const a: number = next();
    const b: number = next();
    const c: number = next();
    const d: number = next();
    // Layout: {A8-B4-C4-D4-E12} — total 32 hex chars.
    // Pack: a→8, b→(4+4 split as c4d4), c+d→12 concatenated.
    const partA: string = hex(a, 8);
    const partB: string = hex(b >>> 16, 4);
    const partC: string = hex(b & 0xffff, 4);
    const partD: string = hex(c >>> 16, 4);
    const partE: string = hex(((c & 0xffff) << 16 | (d >>> 16)) >>> 0, 4) + hex(d & 0xffff, 4) + hex(next(), 4);
    return `{${partA}-${partB}-${partC}-${partD}-${partE}}`;
}
