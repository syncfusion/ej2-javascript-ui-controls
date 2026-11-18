/**
 * Typed model of the workbook metadata and rich-value parts that back
 * Picture in Cell ([MS-XLSX] §2.1.10–§2.1.12, §2.1.21, §2.3.6.1.8; ECMA-376-1 §18.9).
 *
 * Parts: `xl/metadata.xml`, `xl/richData/rdrichvalue.xml`,
 * `xl/richData/rdrichvaluestructure.xml`, `xl/richData/richValueRel.xml`.
 *
 * Entries the library does not understand are kept as raw XML and written back
 * unchanged, so workbooks that also use other metadata (for example dynamic
 * arrays) keep that content.
 *
 * @private
 */

import { parsePivotXml, PivotXmlNode, serializeAttrs } from '../pivot/pivot-xml-tree';
import { escapeXml, escapeXmlText, unescapeXml } from '../core/xml/minimal-xml';

/** `xlrd` namespace used by `rvb` inside `futureMetadata`. */
/** @private */
export const XLRD_NS: string = 'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata';
/** Rich value data / structure namespace. */
/** @private */
export const RICHDATA_NS: string = 'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata';
/** Rich value types namespace. */
/** @private */
export const RICHDATA2_NS: string = 'http://schemas.microsoft.com/office/spreadsheetml/2017/richdata2';
/** Rich value rel namespace. */
/** @private */
export const RICHVALUEREL_NS: string = 'http://schemas.microsoft.com/office/spreadsheetml/2022/richvaluerel';
const MAIN_NS: string = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const R_NS: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

/** Metadata type that binds a cell to a rich value. */
/** @private */
export const RICH_VALUE_TYPE_NAME: string = 'XLRICHVALUE';
/** `ext@uri` of the `rvb` extension ([MS-XLSX] §2.3.5). */
/** @private */
export const RVB_EXT_URI: string = '{3e2802c4-a4d2-4d8b-9148-e3be6c30e623}';
/** Rich value structure type of an in-cell picture ([MS-XLSX] §2.3.6.1.8). */
/** @private */
export const LOCAL_IMAGE_STRUCTURE: string = '_localImage';
/** Key holding the zero-based `richValueRel` index. */
/** @private */
export const LOCAL_IMAGE_KEY: string = '_rvRel:LocalImageIdentifier';
/** Key describing how the rich value was created. */
/** @private */
export const CALC_ORIGIN_KEY: string = 'CalcOrigin';
/** Key holding the picture's alt text. */
/** @private */
export const TEXT_KEY: string = 'Text';
/** `CalcOrigin` Excel writes for a standalone in-cell picture. */
/** @private */
export const CALC_ORIGIN_STANDALONE: number = 5;

/** One `rc` child of a `valueMetadata/bk`. */
/** @private */
export interface RichDataRc {
    /** 1-based index into `metadataTypes`. */
    readonly t: number;
    /** 0-based index into the matching `futureMetadata` blocks. */
    readonly v: number;
}

/** One `valueMetadata/bk`. */
/** @private */
export interface ValueBlock {
    /** Raw element text. */
    readonly xml: string;
    /** Parsed `rc` entries. */
    readonly rcs: ReadonlyArray<RichDataRc>;
}

/** One `futureMetadata` element. */
/** @private */
export interface FutureMetadata {
    readonly name: string;
    /** Raw `bk` elements. */
    blocks: string[];
}

/** One `rv` element. */
/** @private */
export interface RichValueRecord {
    /** Raw element text. */
    readonly xml: string;
    /** `s` attribute: index into the structures. */
    readonly s: number;
    /** Raw (escaped) text of each `v` child. */
    readonly values: ReadonlyArray<string>;
    /** False when the element holds children other than `v`. */
    readonly simple: boolean;
}

/** One `s` structure with its keys. */
/** @private */
export interface RichStructure {
    /** Raw element text. */
    readonly xml: string;
    /** Structure type name. */
    readonly t: string;
    readonly keys: ReadonlyArray<{ readonly n: string; readonly t: string }>;
}

/**
 * Metadata and rich-value state of one workbook.
 *
 * @private
 */
export interface RichDataModel {
    /** Serialized `metadata` root attributes (namespace declarations kept). */
    rootAttrs: string;
    types: string[];
    typeNames: string[];
    futures: FutureMetadata[];
    cellMetadataXml: string | undefined;
    valueBlocks: ValueBlock[];
    extraXml: string[];
    values: RichValueRecord[];
    structures: RichStructure[];
    /** Media part names, indexed by `richValueRel` position. */
    relTargets: string[];
    /** Raw `rdRichValueTypes.xml` text when present. */
    typesInfoXml: string | undefined;
}

/**
 * Empty model with the root namespace declarations Excel uses.
 *
 * @returns {RichDataModel} A model with no entries.
 *
 * @private
 */
export function createEmptyRichData(): RichDataModel {
    return {
        rootAttrs: ` xmlns="${MAIN_NS}" xmlns:xlrd="${XLRD_NS}"`,
        types: [],
        typeNames: [],
        futures: [],
        cellMetadataXml: undefined,
        valueBlocks: [],
        extraXml: [],
        values: [],
        structures: [],
        relTargets: [],
        typesInfoXml: undefined,
    };
}

function raw(xml: string, node: PivotXmlNode): string {
    return xml.slice(node.start, node.end);
}

function textAttr(node: PivotXmlNode, name: string): string {
    const value: string | undefined = node.attrs.get(name);
    return value !== undefined ? value : '';
}

function intAttr(node: PivotXmlNode, name: string): number | undefined {
    const text: string | undefined = node.attrs.get(name);
    return text !== undefined && /^\d+$/.test(text) ? Number.parseInt(text, 10) : undefined;
}

/**
 * Parse `xl/metadata.xml` into `model`. Returns false when the part is unreadable.
 *
 * @param {string} xml - Part text.
 * @param {RichDataModel} model - Model to fill.
 * @returns {boolean} Whether the part was understood.
 *
 * @private
 */
export function parseMetadataXml(xml: string, model: RichDataModel): boolean {
    const root: PivotXmlNode | undefined = parsePivotXml(xml);
    if (root === undefined || root.name !== 'metadata') {
        return false;
    }
    model.rootAttrs = serializeAttrs(root.attrs);
    for (const child of root.children) {
        if (child.name === 'metadataTypes') {
            for (const type of child.children) {
                model.types.push(raw(xml, type));
                model.typeNames.push(textAttr(type, 'name'));
            }
        } else if (child.name === 'futureMetadata') {
            model.futures.push({
                name: textAttr(child, 'name'),
                blocks: child.children.map((bk: PivotXmlNode): string => raw(xml, bk)),
            });
        } else if (child.name === 'cellMetadata') {
            model.cellMetadataXml = raw(xml, child);
        } else if (child.name === 'valueMetadata') {
            for (const bk of child.children) {
                const rcs: RichDataRc[] = [];
                for (const rc of bk.children) {
                    const t: number | undefined = intAttr(rc, 't');
                    const v: number | undefined = intAttr(rc, 'v');
                    if (rc.name === 'rc' && t !== undefined && v !== undefined) {
                        rcs.push({ t, v });
                    }
                }
                model.valueBlocks.push({ xml: raw(xml, bk), rcs });
            }
        } else {
            model.extraXml.push(raw(xml, child));
        }
    }
    return true;
}

/**
 * Parse `rdrichvalue.xml` into `model.values`.
 *
 * @param {string} xml - Part text.
 * @param {RichDataModel} model - Model to fill.
 * @returns {boolean} Whether the part was understood.
 *
 * @private
 */
export function parseRichValueXml(xml: string, model: RichDataModel): boolean {
    const root: PivotXmlNode | undefined = parsePivotXml(xml);
    if (root === undefined || root.name !== 'rvData') {
        return false;
    }
    for (const rv of root.children) {
        const s: number | undefined = intAttr(rv, 's');
        const values: string[] = [];
        let simple: boolean = rv.name === 'rv' && s !== undefined;
        for (const v of rv.children) {
            if (v.name === 'v') {
                values.push(v.closeStart < 0 ? '' : xml.slice(v.openEnd, v.closeStart));
            } else {
                simple = false;
            }
        }
        model.values.push({ xml: raw(xml, rv), s: s !== undefined ? s : -1, values, simple });
    }
    return true;
}

/**
 * Parse `rdrichvaluestructure.xml` into `model.structures`.
 *
 * @param {string} xml - Part text.
 * @param {RichDataModel} model - Model to fill.
 * @returns {boolean} Whether the part was understood.
 *
 * @private
 */
export function parseRichStructureXml(xml: string, model: RichDataModel): boolean {
    const root: PivotXmlNode | undefined = parsePivotXml(xml);
    if (root === undefined || root.name !== 'rvStructures') {
        return false;
    }
    for (const s of root.children) {
        const keys: Array<{ n: string; t: string }> = [];
        for (const k of s.children) {
            keys.push({ n: textAttr(k, 'n'), t: textAttr(k, 't') });
        }
        model.structures.push({ xml: raw(xml, s), t: textAttr(s, 't'), keys });
    }
    return true;
}

/**
 * Parse `richValueRel.xml` and return the `r:id` of each `rel`, in order.
 *
 * @param {string} xml - Part text.
 * @returns {string[] | undefined} Relationship ids, or `undefined` when unreadable.
 *
 * @private
 */
export function parseRichValueRelIds(xml: string): string[] | undefined {
    const root: PivotXmlNode | undefined = parsePivotXml(xml);
    if (root === undefined || root.name !== 'richValueRels') {
        return undefined;
    }
    const ids: string[] = [];
    for (const rel of root.children) {
        let id: string = '';
        rel.attrs.forEach((value: string, key: string): void => {
            if (key === 'id' || key.endsWith(':id')) {
                id = value;
            }
        });
        ids.push(id);
    }
    return ids;
}

/**
 * Index of the `XLRICHVALUE` type (1-based, as `rc@t` uses), or 0 when absent.
 *
 * @param {RichDataModel} model - Model.
 * @returns {number} Type index.
 *
 * @private
 */
export function richValueTypeIndex(model: RichDataModel): number {
    return model.typeNames.indexOf(RICH_VALUE_TYPE_NAME) + 1;
}

/**
 * The `futureMetadata` element named `XLRICHVALUE`, if any.
 *
 * @param {RichDataModel} model - Model.
 * @returns {FutureMetadata | undefined} The element.
 *
 * @private
 */
export function richValueFuture(model: RichDataModel): FutureMetadata | undefined {
    return model.futures.find((f: FutureMetadata): boolean => f.name === RICH_VALUE_TYPE_NAME);
}

/**
 * Serialize the `rvb` index held by a `futureMetadata/bk`, or `undefined`.
 *
 * @param {string} blockXml - Raw `bk` element.
 * @returns {number | undefined} The rich value index.
 *
 * @private
 */
export function rvbIndexOf(blockXml: string): number | undefined {
    const root: PivotXmlNode | undefined = parsePivotXml(blockXml);
    if (root === undefined) {
        return undefined;
    }
    const stack: PivotXmlNode[] = [root];
    for (let node: PivotXmlNode | undefined = stack.pop(); node !== undefined; node = stack.pop()) {
        if (node.name === 'rvb') {
            return intAttr(node, 'i');
        }
        for (const c of node.children) {
            stack.push(c);
        }
    }
    return undefined;
}

/**
 * `futureMetadata/bk` binding to rich value `index`.
 *
 * @param {number} index - Rich value index.
 * @returns {string} Element text.
 *
 * @private
 */
export function rvbBlockXml(index: number): string {
    return `<bk><extLst><ext uri="${RVB_EXT_URI}"><xlrd:rvb i="${index}"/></ext></extLst></bk>`;
}

/**
 * Serialize `metadata.xml` from the model.
 *
 * @param {RichDataModel} model - Model.
 * @returns {string} Part text.
 *
 * @private
 */
export function serializeMetadataXml(model: RichDataModel): string {
    const parts: string[] = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', `<metadata${model.rootAttrs}>`];
    if (model.types.length > 0) {
        parts.push(`<metadataTypes count="${model.types.length}">${model.types.join('')}</metadataTypes>`);
    }
    for (const f of model.futures) {
        parts.push(`<futureMetadata name="${escapeXml(f.name)}" count="${f.blocks.length}">${f.blocks.join('')}</futureMetadata>`);
    }
    if (model.cellMetadataXml !== undefined) {
        parts.push(model.cellMetadataXml);
    }
    if (model.valueBlocks.length > 0) {
        parts.push(`<valueMetadata count="${model.valueBlocks.length}">${model.valueBlocks.map((b: ValueBlock): string => b.xml).join('')}</valueMetadata>`);
    }
    parts.push(model.extraXml.join(''), '</metadata>');
    return parts.join('');
}

/**
 * Serialize `rdrichvalue.xml`.
 *
 * @param {RichDataModel} model - Model.
 * @returns {string} Part text.
 *
 * @private
 */
export function serializeRichValueXml(model: RichDataModel): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><rvData xmlns="${RICHDATA_NS}" count="${model.values.length}">${model.values.map((v: RichValueRecord): string => v.xml).join('')}</rvData>`;
}

/**
 * Serialize `rdrichvaluestructure.xml`.
 *
 * @param {RichDataModel} model - Model.
 * @returns {string} Part text.
 *
 * @private
 */
export function serializeRichStructureXml(model: RichDataModel): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><rvStructures xmlns="${RICHDATA_NS}" count="${model.structures.length}">${model.structures.map((s: RichStructure): string => s.xml).join('')}</rvStructures>`;
}

/**
 * Serialize `richValueRel.xml` for the given relationship ids.
 *
 * @param {string[]} relIds - Relationship ids in `richValueRel` order.
 * @returns {string} Part text.
 *
 * @private
 */
export function serializeRichValueRelXml(relIds: ReadonlyArray<string>): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><richValueRels xmlns="${RICHVALUEREL_NS}" xmlns:r="${R_NS}">${relIds.map((id: string): string => `<rel r:id="${escapeXml(id)}"/>`).join('')}</richValueRels>`;
}

/**
 * Default `rdRichValueTypes.xml` Excel and XlsIO write for in-cell pictures.
 *
 * @returns {string} Part text.
 *
 * @private
 */
export function defaultTypesInfoXml(): string {
    const keys: string[] = ['_DisplayString', '_Flags', '_Format', '_SubLabel', '_Attribution', '_Icon', '_Display', '_CanonicalPropertyName', '_ClassificationId'];
    const flag: string = '<flag name="ExcludeFromCalcComparison" value="1"/>';
    const body: string = keys.map((k: string): string => `<key name="${k}">${flag}</key>`).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><rvTypesInfo xmlns="${RICHDATA2_NS}" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:x="${MAIN_NS}" mc:Ignorable="x"><global><keyFlags><key name="_Self"><flag name="ExcludeFromFile" value="1"/>${flag}</key>${body}</keyFlags></global></rvTypesInfo>`;
}

/**
 * Structure element of an in-cell picture.
 *
 * @param {boolean} withText - Include the alt-text key.
 * @returns {RichStructure} The structure.
 *
 * @private
 */
export function localImageStructure(withText: boolean): RichStructure {
    const keys: Array<{ n: string; t: string }> = [{ n: LOCAL_IMAGE_KEY, t: 'i' }, { n: CALC_ORIGIN_KEY, t: 'i' }];
    if (withText) {
        keys.push({ n: TEXT_KEY, t: 's' });
    }
    const xml: string = `<s t="${LOCAL_IMAGE_STRUCTURE}">${keys.map((k: { n: string; t: string }): string => `<k n="${k.n}" t="${k.t}"/>`).join('')}</s>`;
    return { xml, t: LOCAL_IMAGE_STRUCTURE, keys };
}

/**
 * `rv` element for an in-cell picture.
 *
 * @param {number} structure - Index of the local-image structure.
 * @param {number} relIndex - `richValueRel` index.
 * @param {number} calcOrigin - `CalcOrigin` value.
 * @param {string | undefined} text - Alt text, written when the structure has a `Text` key.
 * @returns {RichValueRecord} The record.
 *
 * @private
 */
export function localImageValue(structure: number, relIndex: number, calcOrigin: number, text: string | undefined): RichValueRecord {
    const values: string[] = [String(relIndex), String(calcOrigin)];
    if (text !== undefined) {
        values.push(escapeXmlText(text));
    }
    return { xml: `<rv s="${structure}">${values.map((v: string): string => `<v>${v}</v>`).join('')}</rv>`, s: structure, values, simple: true };
}

/**
 * Read the fields of an in-cell picture rich value.
 *
 * @param {RichDataModel} model - Model.
 * @param {RichValueRecord} record - The `rv` record.
 * @returns {object | undefined} Relationship index, `CalcOrigin` and alt text; `undefined` when `record` is not a local image.
 *
 * @private
 */
export function readLocalImage(model: RichDataModel, record: RichValueRecord): { relIndex: number; calcOrigin: number | undefined; text: string | undefined } | undefined {
    const structure: RichStructure | undefined = model.structures[record.s];
    if (!record.simple || structure === undefined || structure.t !== LOCAL_IMAGE_STRUCTURE || structure.keys.length !== record.values.length) {
        return undefined;
    }
    let relIndex: number | undefined;
    let calcOrigin: number | undefined;
    let text: string | undefined;
    structure.keys.forEach((key: { n: string; t: string }, at: number): void => {
        const value: string = record.values[at];
        if (key.n === LOCAL_IMAGE_KEY && /^\d+$/.test(value)) {
            relIndex = Number.parseInt(value, 10);
        } else if (key.n === CALC_ORIGIN_KEY && /^\d+$/.test(value)) {
            calcOrigin = Number.parseInt(value, 10);
        } else if (key.n === TEXT_KEY) {
            text = unescapeXml(value);
        }
    });
    return relIndex === undefined ? undefined : { relIndex, calcOrigin, text };
}

/**
 * Index of the local-image structure with or without the `Text` key; appended when missing.
 *
 * @param {RichDataModel} model - Model (changed when a structure is appended).
 * @param {boolean} withText - Whether the structure carries alt text.
 * @returns {number} Structure index.
 *
 * @private
 */
export function ensureLocalImageStructure(model: RichDataModel, withText: boolean): number {
    const wanted: RichStructure = localImageStructure(withText);
    const found: number = model.structures.findIndex((s: RichStructure): boolean =>
        s.t === LOCAL_IMAGE_STRUCTURE && s.keys.length === wanted.keys.length && s.keys.every((k: { n: string; t: string }, at: number): boolean => k.n === wanted.keys[at].n && k.t === wanted.keys[at].t));
    if (found >= 0) {
        return found;
    }
    model.structures.push(wanted);
    return model.structures.length - 1;
}

/**
 * `metadataType` element for the rich-value binding type.
 *
 * @returns {string} Element text.
 *
 * @private
 */
export function richValueTypeXml(): string {
    return `<metadataType name="${RICH_VALUE_TYPE_NAME}" minSupportedVersion="120000" copy="1" pasteAll="1" pasteValues="1" merge="1" splitFirst="1" rowColShift="1" clearFormats="1" clearComments="1" assign="1" coerce="1"/>`;
}

/**
 * `valueMetadata/bk` binding a cell to future-metadata block `futureIndex`.
 *
 * @param {number} typeIndex - 1-based metadata type index.
 * @param {number} futureIndex - 0-based future metadata block index.
 * @returns {ValueBlock} The block.
 *
 * @private
 */
export function richValueBlock(typeIndex: number, futureIndex: number): ValueBlock {
    return { xml: `<bk><rc t="${typeIndex}" v="${futureIndex}"/></bk>`, rcs: [{ t: typeIndex, v: futureIndex }] };
}
