import { TextStylePartSnapshot, readTextStylePartSnapshot } from './rich-text-snapshot';
import { GradientHostPartBindings, readGradientHostBindings } from './gradient-host-bindings';
import { TableFillBinding, TableStyleFillSnapshot, readTableFillBindings, readTableStyleFills } from './table-fill-bindings';
import { GroupFillBinding, readGroupFillBindings } from './group-fill-bindings';
import { TextFillPartBindings, readTextFillPartBindings } from './text-fill-part';
import { TextCharacterFills, readTextCharacterFills, hasTextCharacterFills } from '../core/text/character-fills';
import { getAttr } from '../core/shapes/dom-utils';
import { AuthoredFillMatrixReference, readFillMatrixReference } from '../core/theme/read-fill-reference';
/** Part-scoped authored gradient transport shared by core and embedded Worker. */
import { AuthoredGradientFill } from '../core/theme/gradient-types';
import { readAuthoredGradient } from '../core/theme/read-gradient';
import { OoxmlElement, OoxmlText, parseXml } from '../core/xml/dom';
import { DEFAULT_SECURITY_LIMITS, SecurityLimits } from '../core/security/limits';
import { arrayAt } from '../core/util/es5-compat';

/** Stable identity inside an unchanged XML part; prefixes are not identities. @internal */
export interface GradientPathStep {
    /** Namespace URI of the element. */
    readonly namespaceUri: string;
    /** Case-sensitive local name. */
    readonly localName: string;
    /** Index in the parent's element children; the root is zero. */
    readonly elementIndex: number;
}
/** One direct gradient; no resolved colors or inherited defaults. @internal */
export interface AuthoredGradientRecord {
    /** Full path from the owning part's root. */
    readonly path: ReadonlyArray<GradientPathStep>;
    /** Complete sparse authored fields and read diagnostics. */
    readonly gradient: AuthoredGradientFill;
}
/** One direct fill/background reference with stable part-local identity. @internal */
export interface AuthoredFillReferenceRecord {
    /** Path from the owning part root; prefixes are not identities. */
    readonly path: ReadonlyArray<GradientPathStep>;
    /** Complete raw reference context, separate from resolved paint. */
    readonly reference: AuthoredFillMatrixReference;
}
/** Namespace/path-addressed character data independent of legacy text paint. @internal */
export interface AuthoredCharacterFillRecord {
    /** Full source path, distinguishing defaults, runs, fields and paragraph ends. */
    readonly path: ReadonlyArray<GradientPathStep>;
    /** Complete direct glyph/outline/underline data. */
    readonly properties: TextCharacterFills;
    /** Original field identity/type, when the carrier belongs to a field. */
    readonly fieldId?: string;
    readonly fieldType?: string;
}
/** Additive, versioned contract carried separately from legacy paint projections. @internal */
export interface GradientPartSnapshot {
    /** Full direct master/presentation style context; absent in older producers. */
    readonly textStyles?: TextStylePartSnapshot;
    /** Wire contract version; existing render fields are not reinterpreted. */
    readonly version: 1;
    /** Additive canonical host source inputs; absent in older version-one producers. */
    readonly hostBindings?: GradientHostPartBindings;
    /** Absolute OPC part name. */
    readonly partName: string;
    /** Gradient records in XML document order. */
    readonly records: ReadonlyArray<AuthoredGradientRecord>;
    /** Additive field: absent in older version-1 producers, always supplied by this reader. */
    readonly references?: ReadonlyArray<AuthoredFillReferenceRecord>;
    /** Absent in older producers; this reader emits explicit character carriers only. */
    readonly characters?: ReadonlyArray<AuthoredCharacterFillRecord>;
    /** Canonical bindings for existing paragraph/list snapshot consumers. */
    readonly textFills?: TextFillPartBindings;
    /** Bindable exact-namespace group references; raw source remains unchanged. */
    readonly groupFills?: ReadonlyArray<GroupFillBinding>;
    /** Exact table frames and table-style fill inputs; absent in older producers. */
    readonly tableFills?: ReadonlyArray<TableFillBinding>;
    readonly tableStyles?: ReadonlyArray<TableStyleFillSnapshot>;
}
/**
 * Parses a complete part so inherited/rebound namespace declarations stay valid.
 *
 * @remarks The same implementation is deterministically embedded into the Worker.
 * Unknown markup remains in the original package; this sidecar is never serialized
 * back into XML. Paths use element indices so insignificant whitespace is excluded.
 * @param {string} xml - Original complete part XML, never a detached fragment.
 * @param {string} partName - Absolute OPC part name for identity and diagnostics.
 * @param {Partial<SecurityLimits>} limits - Optional core XML resource limits.
 * @returns {GradientPartSnapshot} Clone-safe direct records in source order.
 * @internal
 */
export function readGradientPartSnapshot(xml: string, partName: string, limits?: Partial<SecurityLimits>): GradientPartSnapshot {
    const root: OoxmlElement = parseXml(xml, { partName, limits });
    const records: AuthoredGradientRecord[] = [];
    const gradients: Map<OoxmlElement, AuthoredGradientFill> = new Map();
    const references: AuthoredFillReferenceRecord[] = [];
    const characters: AuthoredCharacterFillRecord[] = [];
    const characterNodes: Map<OoxmlElement, TextCharacterFills> = new Map();
    /**
     * Walks bounded parsed XML in source order.
     *
     * @param {OoxmlElement} element - Current element.
     * @param {ReadonlyArray<GradientPathStep>} path - Ancestor identities.
     * @param {number} index - Element index in its parent.
     * @param {OoxmlElement} parent - Optional immediate owner for field metadata.
     * @returns {void} Appends direct gradient records.
     */
    function visit(element: OoxmlElement, path: ReadonlyArray<GradientPathStep>, index: number, parent?: OoxmlElement): void {
        const current: GradientPathStep[] = path.concat([{
            namespaceUri: element.namespaceUri, localName: element.localName, elementIndex: index
        }]);
        const gradient: AuthoredGradientFill | undefined = readAuthoredGradient(element, partName);
        if (gradient !== undefined) { records.push({ path: current, gradient }); gradients.set(element, gradient); }
        const reference: AuthoredFillMatrixReference | undefined = readFillMatrixReference(element, partName);
        if (reference !== undefined) { references.push({ path: current, reference }); }
        if (element.localName === 'rPr' || element.localName === 'defRPr' || element.localName === 'endParaRPr') {
            const properties: TextCharacterFills = readTextCharacterFills(element, partName);
            if (hasTextCharacterFills(properties)) {
                characterNodes.set(element, properties);
                const field: OoxmlElement | undefined = parent !== undefined && parent.namespaceUri === element.namespaceUri &&
                    parent.localName === 'fld' ? parent : undefined;
                characters.push({ path: current, properties,
                    fieldId: field === undefined ? undefined : getAttr(field, '', 'id'),
                    fieldType: field === undefined ? undefined : getAttr(field, '', 'type') });
            }
        }
        let elementIndex: number = 0;
        for (let i: number = 0; i < element.children.length; i++) {
            const child: OoxmlElement | OoxmlText = arrayAt(element.children, i);
            if (child.kind === 'element') { visit(child, current, elementIndex++, element); }
        }
    }
    visit(root, [], 0);
    const groupDepth: number = limits && limits.groupNestingDepth !== undefined ?
        limits.groupNestingDepth : DEFAULT_SECURITY_LIMITS.groupNestingDepth;
    const textStyles: TextStylePartSnapshot | undefined = readTextStylePartSnapshot(root);
    return { version: 1, partName, records, references, characters,
        ...(textStyles === undefined ? {} : { textStyles }),
        hostBindings: readGradientHostBindings(root, partName, limits, gradients),
        ...(xml.indexOf('tbl') < 0 ? {} : { tableFills: readTableFillBindings(root, partName, groupDepth, gradients),
            tableStyles: readTableStyleFills(root, partName, gradients) }),
        ...(xml.indexOf('grpFill') < 0 ? {} : { groupFills: readGroupFillBindings(root, partName, groupDepth) }),
        ...(characters.length === 0 && xml.indexOf('fontRef') < 0 ? {} : { textFills: readTextFillPartBindings(root, characterNodes) }) };
}

/** Core XML defaults embedded alongside the reader, avoiding a second policy table. @internal */
export const gradientXmlDefaults: Partial<SecurityLimits> = {
    groupNestingDepth: DEFAULT_SECURITY_LIMITS.groupNestingDepth,
    xmlNestingDepth: DEFAULT_SECURITY_LIMITS.xmlNestingDepth,
    xmlAttributesPerElement: DEFAULT_SECURITY_LIMITS.xmlAttributesPerElement,
    textNodeLengthBytes: DEFAULT_SECURITY_LIMITS.textNodeLengthBytes
};

export { resolveTableFillData, tableFillBuckets, bindTableFillData, indexTableStyleFills } from './table-fill-bindings';

export { tableBorderBucketOrder } from './table-border-bindings';

export { resolveGradientSlidePaint } from './gradient-slide-paint';
