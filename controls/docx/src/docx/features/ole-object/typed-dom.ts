/**
 * OLE object typed DOM: enums, wire-form model, and attribute /
 * child patch codec over the stored `w:object` element.
 *
 * One semantic model over two schema-backed wire encodings:
 * - **office** — `o:OLEObject` child (transitional `vml-officeDrawing.xsd`
 *   `CT_OLEObject`, ECMA-376-4 §19.2.2.20); what Word writes today.
 * - **wml** — `w:objectEmbed` / `w:objectLink` children (transitional
 *   `wml.xsd` `CT_ObjectEmbed` line 1198 / `CT_ObjectLink` line 1211;
 *   ECMA-376-1 §17.3.3.20/§17.3.3.21).
 *
 * Non-negotiable (`.agent/policies/security.md`): this DOM never executes,
 * activates, or fetches anything. Payload bytes are not surfaced here
 * (owns that decision under human GO Q1).
 *
 * @packageDocumentation
 */
import { pointToTwips, twipsToPoint } from '../document/length';
import { objectValues } from '../../core/compat/object-compat';
import { DocxError } from '../../core/errors/index';
import { OpenXmlAttribute, OpenXmlElement, OpenXmlChild } from '../../core/xml/index';
import { OpenXmlText, NamespaceDeclaration } from '../../core/xml/model';
/**
 * Office namespace for VML Office Drawing / `o:OLEObject`.
 *
 * Source: transitional `vml-officeDrawing.xsd` `targetNamespace`
 * (`urn:schemas-microsoft-com:office:office`).
 */
export const OFFICE_OLE_NAMESPACE: string = 'urn:schemas-microsoft-com:office:office';
/** WordprocessingML transitional namespace (local constant to avoid cycles). */
const WML_NS: string = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
/**
 * Kind of OLE object connection (`o:OLEObject/@Type`, `ST_OLEType`:
 * `Embed` | `Link`; the WML-native form encodes the same choice as
 * `w:objectEmbed` vs `w:objectLink` element selection).
 *
 * @private
 */
export enum OleLinkType {
    /** Embedded storage part (`word/embeddings/*.bin`). */
    Embed = 'embed',
    /** External link target (stored, never fetched). */
    Link = 'link'
}
/**
 * Visual representation of the object (`o:OLEObject/@DrawAspect`,
 * `ST_OLEDrawAspect`: `Content` | `Icon`; WML-native `drawAspect` uses the
 * lowercase tokens `content` | `icon` — both decode to this enum).
 *
 * @private
 */
export enum OleDrawAspect {
    /** Render the object's current content. */
    Content = 'content',
    /** Render a placeholder icon. */
    Icon = 'icon'
}
/**
 * Link refresh mode (`o:OLEObject/@UpdateMode`, `ST_OLEUpdateMode`:
 * `Always` | `OnCall`; WML-native `updateMode`: `always` | `onCall`).
 * Meaningful for linked objects only.
 *
 * @private
 */
export enum OleUpdateMode {
    /** Update automatically. */
    Always = 'always',
    /** Update on caller request. */
    OnCall = 'onCall'
}
/**
 * Which schema encoding the stored `w:object` carries its OLE reference in.
 *
 * Fixed at load; typed edits never convert forms (no corpus evidence Word
 * reads one encoding as the other within a document).
 *
 * @private
 */
export type OleWireForm = 'office' | 'wml';
/** Wire-form discriminant for the office (`o:OLEObject`) encoding. */
const OFFICE_OLE_ELEMENT: string = 'OLEObject';
/** Wire-form discriminants for the WML-native encodings. */
const WML_EMBED_ELEMENT: string = 'objectEmbed';
const WML_LINK_ELEMENT: string = 'objectLink';
/** `ST_OLEType` tokens (office form, capitalized). */
const OLE_TYPE_TOKENS: { Embed: string; Link: string; } = { Embed: 'Embed', Link: 'Link' };
/** `ST_OLEDrawAspect` tokens (office form, capitalized). */
const OLE_ASPECT_TOKENS: { Content: string; Icon: string; } = { Content: 'Content', Icon: 'Icon' };
/** `ST_OLEUpdateMode` tokens (office form, capitalized). */
const OLE_UPDATE_TOKENS: { Always: string; OnCall: string; } = { Always: 'Always', OnCall: 'OnCall' };
/** WML-native lowercase tokens (`ST_ObjectDrawAspect` / `ST_ObjectUpdateMode`). */
const WML_ASPECT_TOKENS: { Content: string; Icon: string; } = { Content: 'content', Icon: 'icon' };
const WML_UPDATE_TOKENS: { Always: string; OnCall: string; } = { Always: 'always', OnCall: 'onCall' };
/**
 * Internal mutable state parsed from (and patched back onto) the stored
 * `w:object` element. The typed `OleObject` class in the owning module delegates
 * here; this type is not part of the public surface.
 *
 * @private
 */
export interface OleObjectDomState {
    /** The stored `w:object` element (byte-preserved outside modeled edits). */
    element: OpenXmlElement;
    /** The OLE child element (`o:OLEObject` / `w:objectEmbed` / `w:objectLink`). */
    oleElement: OpenXmlElement;
    /** Which encoding `oleElement` uses. */
    wireForm: OleWireForm;
}
/**
 *  Element child of an {@link OpenXmlElement}.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ReadonlyArray<OpenXmlElement>} The result.
 */
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
/**
 *  Attribute value by namespace + local name.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
function attributeValue(el: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    let ts330: any;
    return (
        (ts330 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName)),
        ts330 == null ? undefined : ts330.value
    );
}
/**
 * Resolve the OLE child of a `w:object` element and its wire form.
 * Returns `undefined` when no recognized OLE child exists (the element
 * stays opaque per the rule).
 *
 * @param {OpenXmlElement} element - The element.
 * @returns {Object} The result.
 * @private
 */
export function resolveOleChild(element: OpenXmlElement): {
    oleElement: OpenXmlElement;
    wireForm: OleWireForm;
} | undefined {
    for (const child of elementChildren(element)) {
        if (child.namespaceUri === OFFICE_OLE_NAMESPACE &&
            child.localName === OFFICE_OLE_ELEMENT) {
            return { oleElement: child, wireForm: 'office' };
        }
        if (child.namespaceUri === WML_NS &&
            (child.localName === WML_EMBED_ELEMENT || child.localName === WML_LINK_ELEMENT)) {
            return { oleElement: child, wireForm: 'wml' };
        }
    }
    return undefined;
}
/**
 *  Initial DOM state parsed at load (no mutation).
 *
 * @param {OpenXmlElement} element - The element.
 * @param {OpenXmlElement} oleElement - The ole element.
 * @param {OleWireForm} wireForm - The wire form.
 * @returns {OleObjectDomState} The result.
 * @private
 */
export function parseOleObjectDomState(element: OpenXmlElement, oleElement: OpenXmlElement, wireForm: OleWireForm): OleObjectDomState {
    return { element, oleElement, wireForm };
}
// ---------------------------------------------------------------------------
// Read codec (office + wml forms)
// ---------------------------------------------------------------------------
/**
 *  Read `@Type` / element choice as a typed link kind.
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {OleLinkType | undefined} The result.
 * @private
 */
export function readLinkType(state: OleObjectDomState): OleLinkType | undefined {
    if (state.wireForm === 'wml') {
        return state.oleElement.localName === WML_LINK_ELEMENT ? OleLinkType.Link : OleLinkType.Embed;
    }
    const type: string = attributeValue(state.oleElement, '', 'Type');
    if (type === OLE_TYPE_TOKENS.Link) {
        return OleLinkType.Link;
    }
    if (type === OLE_TYPE_TOKENS.Embed) {
        return OleLinkType.Embed;
    }
    return undefined; // unknown/malformed stays residual
}
/**
 *  Read `@ProgID` (office) / `@progId` (wml).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {string | undefined} The result.
 * @private
 */
export function readProgId(state: OleObjectDomState): string | undefined {
    return state.wireForm === 'wml'
        ? attributeValue(state.oleElement, '', 'progId')
        : attributeValue(state.oleElement, '', 'ProgID');
}
/**
 *  Read `@ShapeID` (office) / `@shapeId` (wml).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {string | undefined} The result.
 * @private
 */
export function readShapeId(state: OleObjectDomState): string | undefined {
    return state.wireForm === 'wml'
        ? attributeValue(state.oleElement, '', 'shapeId')
        : attributeValue(state.oleElement, '', 'ShapeID');
}
/**
 *  Read `@DrawAspect` / `@drawAspect` in either casing.
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {OleDrawAspect | undefined} The result.
 * @private
 */
export function readDrawAspect(state: OleObjectDomState): OleDrawAspect | undefined {
    if (state.wireForm === 'wml') {
        const v: string = attributeValue(state.oleElement, '', 'drawAspect');
        if (v === WML_ASPECT_TOKENS.Content) {
            return OleDrawAspect.Content;
        }
        if (v === WML_ASPECT_TOKENS.Icon) {
            return OleDrawAspect.Icon;
        }
        return undefined;
    }
    const v: string = attributeValue(state.oleElement, '', 'DrawAspect');
    if (v === OLE_ASPECT_TOKENS.Content) {
        return OleDrawAspect.Content;
    }
    if (v === OLE_ASPECT_TOKENS.Icon) {
        return OleDrawAspect.Icon;
    }
    return undefined;
}
/**
 * Read `@ObjectID` (office form only; no WML-native counterpart — Office
 * regenerates it per save and does not support it on linked objects,
 * [MS-OI29500] §2.1.1834).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {string | undefined} The result.
 * @private
 */
export function readObjectId(state: OleObjectDomState): string | undefined {
    return state.wireForm === 'wml'
        ? undefined
        : attributeValue(state.oleElement, '', 'ObjectID');
}
/**
 *  Read `@UpdateMode` (office) / required `@updateMode` (wml link).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {OleUpdateMode | undefined} The result.
 * @private
 */
export function readUpdateMode(state: OleObjectDomState): OleUpdateMode | undefined {
    if (state.wireForm === 'wml') {
        if (state.oleElement.localName !== WML_LINK_ELEMENT) {
            return undefined;
        }
        const v: string = attributeValue(state.oleElement, '', 'updateMode');
        if (v === WML_UPDATE_TOKENS.Always) {
            return OleUpdateMode.Always;
        }
        if (v === WML_UPDATE_TOKENS.OnCall) {
            return OleUpdateMode.OnCall;
        }
        return undefined;
    }
    const v: string = attributeValue(state.oleElement, '', 'UpdateMode');
    if (v === OLE_UPDATE_TOKENS.Always) {
        return OleUpdateMode.Always;
    }
    if (v === OLE_UPDATE_TOKENS.OnCall) {
        return OleUpdateMode.OnCall;
    }
    return undefined;
}
/**
 *  `ST_TrueFalseBlank` parse: t/true/on → true; f/false/off/0 → false.
 *
 * @param {string} value - The value.
 * @returns {boolean | undefined} The result.
 */
function parseTrueFalseBlank(value: string): boolean | undefined {
    const normalized: string = value.trim().toLowerCase();
    if (normalized === 't' || normalized === 'true' || normalized === 'on') {
        return true;
    }
    if (normalized === 'f' || normalized === 'false' || normalized === 'off' || normalized === '0') {
        return false;
    }
    return undefined;
}
/**
 *  True when the attribute value is the explicit-false `ST_TrueFalseBlank` form.
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 */
function isExplicitFalse(value: string): boolean {
    const normalized: string = value.trim().toLowerCase();
    return (normalized === 'f' || normalized === 'false' || normalized === 'off' || normalized === '0');
}
/**
 * Read `o:LockedField` child (office) / `@lockedField` (wml link).
 * Returns `undefined` when absent or unparseable (residual).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {boolean | undefined} The result.
 * @private
 */
export function readLockedField(state: OleObjectDomState): boolean | undefined {
    if (state.wireForm === 'wml') {
        if (state.oleElement.localName !== WML_LINK_ELEMENT) {
            return undefined;
        }
        const v: string = attributeValue(state.oleElement, '', 'lockedField');
        return v === undefined ? undefined : parseTrueFalseBlank(v);
    }
    const child: OpenXmlElement = elementChildren(state.oleElement).find((c: OpenXmlElement) => c.namespaceUri === OFFICE_OLE_NAMESPACE && c.localName === 'LockedField');
    if (child === undefined) {
        return undefined;
    }
    const text: { kind: 'text'; value: string; } = child.children.find((c: OpenXmlChild): c is {
        kind: 'text';
        value: string;
    } => c.kind === 'text');
    if (text === undefined) {
        // `<o:LockedField/>` — blank parses as true per ST_TrueFalseBlank.
        return true;
    }
    return parseTrueFalseBlank(text.value);
}
/**
 *  Read `o:LinkType` child (office form only; `ST_OLELinkType` is a string).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {string | undefined} The result.
 * @private
 */
export function readLinkTypeDescription(state: OleObjectDomState): string | undefined {
    if (state.wireForm !== 'office') {
        return undefined;
    }
    const child: OpenXmlElement = elementChildren(state.oleElement).find((c: OpenXmlElement) => c.namespaceUri === OFFICE_OLE_NAMESPACE && c.localName === 'LinkType');
    const text: { kind: 'text'; value: string; } = (child == null ? undefined : child.children).find((c: OpenXmlChild): c is {
        kind: 'text';
        value: string;
    } => c.kind === 'text');
    return text == null ? undefined : text.value;
}
/**
 *  Read `o:FieldCodes` child (office) / `@fieldCodes` (wml).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {string | undefined} The result.
 * @private
 */
export function readFieldCodes(state: OleObjectDomState): string | undefined {
    if (state.wireForm === 'wml') {
        return attributeValue(state.oleElement, '', 'fieldCodes');
    }
    const child: OpenXmlElement = elementChildren(state.oleElement).find((c: OpenXmlElement) => c.namespaceUri === OFFICE_OLE_NAMESPACE && c.localName === 'FieldCodes');
    const text: { kind: 'text'; value: string; } = (child == null ? undefined : child.children).find((c: OpenXmlChild): c is {
        kind: 'text';
        value: string;
    } => c.kind === 'text');
    return text == null ? undefined : text.value;
}
/**
 * Parse an `ST_TwipsMeasure` value (`N` twips or `Npt` points) into points.
 * Wire conversion happens only at this boundary.
 *
 * @param {string} value - The value.
 * @returns {number | undefined} The result.
 */
function parseTwipsMeasureAsPoints(value: string): number | undefined {
    const trimmed: string = value.trim();
    if (trimmed.endsWith('pt')) {
        const pts: number = Number(trimmed.slice(0, -2));
        return Number.isFinite(pts) ? pts : undefined;
    }
    const twips: number = Number(trimmed);
    return Number.isFinite(twips) ? twipsToPoint(twips) : undefined;
}
/**
 * Read `w:object/@dxaOrig` as points (accepts WML-qualified and unqualified
 * spellings — the schema declares it unqualified; Word writes `w:`-prefixed
 * in practice).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {number | undefined} The result.
 * @private
 */
export function readOriginalWidth(state: OleObjectDomState): number | undefined {
    let ts331: any;
    const v: string = ((ts331 = attributeValue(state.element, WML_NS, 'dxaOrig')), ts331 != null ? ts331 : attributeValue(state.element, '', 'dxaOrig'));
    return v === undefined ? undefined : parseTwipsMeasureAsPoints(v);
}
/**
 *  Read `w:object/@dyaOrig` as points (qualified/unqualified tolerant).
 *
 * @param {OleObjectDomState} state - The state.
 * @returns {number | undefined} The result.
 * @private
 */
export function readOriginalHeight(state: OleObjectDomState): number | undefined {
    let ts332: any;
    const v: string = ((ts332 = attributeValue(state.element, WML_NS, 'dyaOrig')), ts332 != null ? ts332 : attributeValue(state.element, '', 'dyaOrig'));
    return v === undefined ? undefined : parseTwipsMeasureAsPoints(v);
}
// ---------------------------------------------------------------------------
// Write codec (patch-in-place)
// ---------------------------------------------------------------------------
/**
 * Replace or remove one attribute on a cloned element, **preserving the
 * original attribute position and prefix** (patch-in-place rule: attribute
 * order is part of byte-stability). New attributes append at the end with
 * the given prefix.
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @param {string | undefined} value - The value.
 * @param {string} prefix - The prefix.
 * @returns {OpenXmlElement} The result.
 */
function withAttribute(
    el: OpenXmlElement,
    namespaceUri: string,
    localName: string,
    value: string | undefined,
    prefix: string
): OpenXmlElement {
    const index: number = el.attributes.findIndex((a: OpenXmlAttribute) => a.namespaceUri === namespaceUri && a.localName === localName);
    if (value === undefined) {
        if (index < 0) {
            return el; // nothing to remove
        }
        return {
            ...el,
            attributes: el.attributes.filter((_: OpenXmlAttribute, i: number) => i !== index)
        };
    }
    // Preserve the existing prefix on replacement (e.g. w:dxaOrig stays
    // w:-prefixed even when the caller passes ''); use the given prefix only
    // for newly created attributes.
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    const existing: OpenXmlAttribute = el.attributes[index];
    const effectivePrefix: string = existing !== undefined ? existing.prefix : prefix;
    const next: OpenXmlAttribute = {
        namespaceUri,
        localName,
        prefix: effectivePrefix,
        value
    };
    if (index >= 0) {
        return {
            ...el,
            attributes: el.attributes.map((a: OpenXmlAttribute, i: number) => (i === index ? next : a))
        };
    }
    return { ...el, attributes: [...el.attributes, next] };
}
/**
 * Replace the element's children, preserving every non-modeled child.
 * The replacer receives the current element children and returns the next
 * list (filter/append/remove).
 *
 * @param {OpenXmlElement} el - The el.
 * @param {Function} replace - The replace.
 * @returns {OpenXmlElement} The result.
 */
function withChildren(
    el: OpenXmlElement,
    replace: (children: ReadonlyArray<OpenXmlElement>) => ReadonlyArray<OpenXmlElement>
): OpenXmlElement {
    const next: ReadonlyArray<OpenXmlElement> = replace(elementChildren(el));
    // Keep text children (none modeled in CT_OLEObject today) before the
    // element children, matching load order where both exist.
    const textChildren: ((OpenXmlElement & { kind: 'text'; }) | (OpenXmlText & { kind: 'text'; }))[] = el.children.filter((c: OpenXmlChild): c is OpenXmlChild & {
        kind: 'text';
    } => c.kind === 'text');
    return { ...el, children: [...textChildren, ...next] };
}
/**
 *  Shallow structural clone of the whole subtree (attributes preserved).
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {OpenXmlElement} The result.
 */
function cloneElement(el: OpenXmlElement): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: el.namespaceUri,
        localName: el.localName,
        prefix: el.prefix,
        attributes: el.attributes.map((a: OpenXmlAttribute) => ({ ...a })),
        namespaceDeclarations: el.namespaceDeclarations.map((n: NamespaceDeclaration) => ({ ...n })),
        children: el.children.map((c: OpenXmlChild): OpenXmlChild => c.kind === 'element'
            ? cloneElement(c)
            : { kind: 'text', value: c.value })
    };
}
/**
 *  Error for value validation failures (mapped to `content/invalid-ole-object` by callers).
 *
 * @param {string} name - The name.
 * @param {unknown} value - The value.
 * @param {ReadonlyArray<string>} allowed - The allowed.
 * @returns {never} The result.
 */
function invalidEnum(name: string, value: unknown, allowed: ReadonlyArray<string>): never {
    throw new DocxError('content/invalid-ole-object', `Invalid OleObject ${name} "${String(value)}"; expected one of: ${allowed.join(', ')}`);
}
/**
 * Runtime enum guard for values crossing the JS boundary (the type system
 * narrows these to the union, but a JS caller can pass an arbitrary string).
 * `never` via exhaustive check with the as-const member sets.
 *
 * @param {string} name - The name.
 * @param {T} value - The value.
 * @param {ReadonlyArray<T>} members - The members.
 * @param {ReadonlyArray<string>} tokens - The tokens.
 * @returns {string} The result.
 */
function assertEnumMember<T extends string>(name: string, value: T, members: ReadonlyArray<T>, tokens: ReadonlyArray<string>): string {
    let ts333: any;
    if ((members as ReadonlyArray<string>).indexOf(value) === -1) {
        invalidEnum(name, value, tokens);
    }
    return ((ts333 = tokens[members.indexOf(value)]), ts333 != null ? ts333 : value);
}
/** Office + WML member lists, parallel to their token lists. */
const ASPECT_MEMBERS: string[] = [OleDrawAspect.Content, OleDrawAspect.Icon];
const UPDATE_MEMBERS: ('always' | 'onCall')[] = [OleUpdateMode.Always, OleUpdateMode.OnCall];
/**
 *  Validate + convert a draw-aspect input for the active wire form.
 *
 * @param {OleObjectDomState} state - The state.
 * @param {OleDrawAspect} value - The value.
 * @returns {string} The result.
 */
function drawAspectToken(state: OleObjectDomState, value: OleDrawAspect): string {
    if (state.wireForm === 'wml') {
        return assertEnumMember('drawAspect', value, ASPECT_MEMBERS, objectValues(WML_ASPECT_TOKENS));
    }
    return assertEnumMember('DrawAspect', value, ASPECT_MEMBERS, objectValues(OLE_ASPECT_TOKENS));
}
/**
 *  Validate + convert an update-mode input for the active wire form.
 *
 * @param {OleObjectDomState} state - The state.
 * @param {OleUpdateMode} value - The value.
 * @returns {string} The result.
 */
function updateModeToken(state: OleObjectDomState, value: OleUpdateMode): string {
    if (state.wireForm === 'wml') {
        return assertEnumMember('updateMode', value, UPDATE_MEMBERS, objectValues(WML_UPDATE_TOKENS));
    }
    return assertEnumMember('UpdateMode', value, UPDATE_MEMBERS, objectValues(OLE_UPDATE_TOKENS));
}
/**
 * Format points as an `ST_TwipsMeasure` integral-twips attribute string.
 * Conversion to wire units happens only at this boundary.
 *
 * @param {number} points - The points.
 * @returns {string} The result.
 */
function formatPointsAsTwipsMeasure(points: number): string {
    const twips: number = pointToTwips(points);
    if (twips <= 0 || !Number.isFinite(twips)) {
        throw new DocxError('content/invalid-ole-object', 'OleObject original size must be a positive point value');
    }
    return String(twips);
}
/**
 * Apply a set of modeled mutations in one structural pass.
 *
 * Every setter builds a `mutation` describing which modeled member changes;
 * this function clones the stored tree once and patches exactly those
 * members, leaving every other attribute/child byte-identical (patch-in-place
 * serialization rule, spec).
 *
 * @private
 */
export interface OleDomMutation {
    /** `@Type` (office only — the WML form encodes the choice in the element name). */
    readonly type?: OleLinkType | undefined;
    /** `@ProgID` / `@progId`. */
    readonly progId?: string | undefined;
    /** `@ShapeID` / `@shapeId`. */
    readonly shapeId?: string | undefined;
    /** `@DrawAspect` / `@drawAspect` (undefined clears). */
    readonly drawAspect?: OleDrawAspect | undefined;
    /** `@ObjectID` (office only; undefined clears). */
    readonly objectId?: string | undefined;
    /** `@UpdateMode` / `@updateMode` (undefined clears where the form allows absence). */
    readonly updateMode?: OleUpdateMode | undefined;
    /** `o:LockedField` / `@lockedField` (undefined clears). */
    readonly lockedField?: boolean | undefined;
    /** `o:LinkType` / (undefined clears; office only). */
    readonly linkTypeDescription?: string | undefined;
    /** `o:FieldCodes` / `@fieldCodes` (undefined clears). */
    readonly fieldCodes?: string | undefined;
    /** `w:object/@dxaOrig` in points (undefined clears; serialized as twips). */
    readonly originalWidth?: number | undefined;
    /** `w:object/@dyaOrig` in points (undefined clears; serialized as twips). */
    readonly originalHeight?: number | undefined;
}
/**
 * Patch the DOM state with the given mutations and return the next state
 * (new element + oleElement references; previous tree untouched).
 *
 * @param {OleObjectDomState} state - The state.
 * @param {OleDomMutation} mutations - The mutations.
 * @returns {OleObjectDomState} The result.
 * @private
 */
export function applyOleDomMutations(state: OleObjectDomState, mutations: OleDomMutation): OleObjectDomState {
    const element: OpenXmlElement = cloneElement(state.element);
    const resolved: { oleElement: OpenXmlElement; wireForm: OleWireForm; } = resolveOleChild(element);
    if (resolved === undefined) {
        // Defensive: callers only construct state with a resolved child.
        throw new DocxError('content/invalid-ole-object', 'OLE object element lost its OLE child');
    }
    let oleElement: OpenXmlElement = resolved.oleElement;
    let nextElement: OpenXmlElement = element;
    const office: boolean = state.wireForm === 'office';
    // All modeled attributes on o:OLEObject and w:object* WML children are
    // schema-unqualified (no namespace, no prefix): `ProgID`, `DrawAspect`,
    // `progId`, `dxaOrig`, … — serialize as bare localNames.
    const attrNs: string = '';
    const attrPrefix: string = '';
    // -- w:object original-size attributes ---------------------------------
    // Word writes these WML-qualified (`w:dxaOrig`); producers that emit them
    // unqualified also parse (namespace ''). Create uses the 'w' prefix;
    // replacement preserves whatever prefix the source carried.
    if ('originalWidth' in mutations) {
        nextElement = withAttribute(nextElement, WML_NS, 'dxaOrig', mutations.originalWidth === undefined
            ? undefined
            : formatPointsAsTwipsMeasure(mutations.originalWidth), 'w');
    }
    if ('originalHeight' in mutations) {
        nextElement = withAttribute(nextElement, WML_NS, 'dyaOrig', mutations.originalHeight === undefined
            ? undefined
            : formatPointsAsTwipsMeasure(mutations.originalHeight), 'w');
    }
    // -- o:OLEObject / w:object* attributes --------------------------------
    // Note: the WML form encodes Embed/Link in the element choice
    // (w:objectEmbed vs w:objectLink); converting between element names is a
    // form conversion and is out of scope (wireForm is fixed at load), so a
    // `type` mutation only applies on the office form. Clearing `@Type` is
    // allowed there (embed is the schema default when absent).
    if ('type' in mutations && office) {
        const value: OleLinkType = mutations.type;
        if (value === undefined) {
            oleElement = withAttribute(oleElement, attrNs, 'Type', undefined, attrPrefix);
        }
        else if (value === OleLinkType.Link) {
            oleElement = withAttribute(oleElement, attrNs, 'Type', OLE_TYPE_TOKENS.Link, attrPrefix);
        }
        else {
            oleElement = withAttribute(oleElement, attrNs, 'Type', OLE_TYPE_TOKENS.Embed, attrPrefix);
        }
    }
    if ('progId' in mutations) {
        oleElement = withAttribute(oleElement, attrNs, office ? 'ProgID' : 'progId', mutations.progId, attrPrefix);
    }
    if ('shapeId' in mutations) {
        oleElement = withAttribute(oleElement, attrNs, office ? 'ShapeID' : 'shapeId', mutations.shapeId, attrPrefix);
    }
    if ('drawAspect' in mutations) {
        const value: OleDrawAspect = mutations.drawAspect;
        oleElement = withAttribute(oleElement, attrNs, office ? 'DrawAspect' : 'drawAspect', value === undefined ? undefined : drawAspectToken(state, value), attrPrefix);
    }
    if ('objectId' in mutations && office) {
        oleElement = withAttribute(oleElement, attrNs, 'ObjectID', mutations.objectId, attrPrefix);
    }
    if ('updateMode' in mutations) {
        const value: OleUpdateMode = mutations.updateMode;
        if (office || state.oleElement.localName === WML_LINK_ELEMENT) {
            oleElement = withAttribute(oleElement, attrNs, office ? 'UpdateMode' : 'updateMode', value === undefined ? undefined : updateModeToken(state, value), attrPrefix);
        }
    }
    // -- office-form children (LinkType / LockedField / FieldCodes) --------
    if (office) {
        oleElement = withChildren(oleElement, (children: ReadonlyArray<OpenXmlElement>) => {
            let next: ReadonlyArray<OpenXmlElement> = children;
            if ('linkTypeDescription' in mutations) {
                next = setOfficeChild(next, 'LinkType', mutations.linkTypeDescription);
            }
            if ('lockedField' in mutations) {
                next = setOfficeChild(next, 'LockedField', mutations.lockedField === undefined
                    ? undefined
                    : mutations.lockedField
                        ? 't'
                        : 'f');
            }
            if ('fieldCodes' in mutations) {
                next = setOfficeChild(next, 'FieldCodes', mutations.fieldCodes);
            }
            return next;
        });
    }
    else if ('lockedField' in mutations || 'fieldCodes' in mutations) {
        // WML link form carries lockedField/fieldCodes as attributes.
        if ('lockedField' in mutations) {
            const value: boolean = mutations.lockedField;
            oleElement = withAttribute(oleElement, attrNs, 'lockedField', value === undefined ? undefined : value ? 'true' : 'false', attrPrefix);
        }
        if ('fieldCodes' in mutations) {
            oleElement = withAttribute(oleElement, attrNs, 'fieldCodes', mutations.fieldCodes, attrPrefix);
        }
    }
    // Splice the patched oleElement back into the element's children.
    nextElement = {
        ...nextElement,
        children: nextElement.children.map((c: OpenXmlChild) => c.kind === 'element' && c === resolved.oleElement ? oleElement : c)
    };
    return { element: nextElement, oleElement, wireForm: state.wireForm };
}
/**
 * Set or remove one office-form child (`o:LinkType`, `o:LockedField`,
 * `o:FieldCodes`) preserving relative order; the child is appended at the
 * end when newly created (CT_OLEObject child sequence is
 * LinkType → LockedField → FieldCodes; setters that create children
 * out of order would violate the sequence, so callers set values in an
 * order-independent way here by always keeping the three slots sorted).
 *
 * @param {ReadonlyArray<OpenXmlElement>} children - The children.
 * @param {string} localName - The local name.
 * @param {string | undefined} value - The value.
 * @returns {ReadonlyArray<OpenXmlElement>} The result.
 */
function setOfficeChild(
    children: ReadonlyArray<OpenXmlElement>,
    localName: string,
    value: string | undefined
): ReadonlyArray<OpenXmlElement> {
    const filtered: OpenXmlElement[] = children.filter(
        (c: OpenXmlElement) => !(c.namespaceUri === OFFICE_OLE_NAMESPACE && c.localName === localName)
    );
    if (value === undefined) {
        return filtered;
    }
    const created: OpenXmlElement = {
        kind: 'element',
        namespaceUri: OFFICE_OLE_NAMESPACE,
        localName,
        prefix: 'o',
        attributes: [],
        namespaceDeclarations: [],
        children: [{ kind: 'text', value }]
    };
    // Re-sort the three modeled slots into schema order relative to each other.
    const order: string[] = ['LinkType', 'LockedField', 'FieldCodes'];
    const slot: number = order.indexOf(localName);
    const insertAt: number = filtered.findIndex((c: OpenXmlElement) => {
        if (c.namespaceUri !== OFFICE_OLE_NAMESPACE) {
            return false;
        }
        const other: number = order.indexOf(c.localName);
        return other >= 0 && other > slot;
    });
    if (insertAt < 0) {
        return [...filtered, created];
    }
    return [...filtered.slice(0, insertAt), created, ...filtered.slice(insertAt)];
}
/**
 *  Exported for the class: attribute lookup helper (namespace-qualified).
 *
 * @param {OpenXmlElement} el - The el.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 * @private
 */
export function oleAttributeValue(el: OpenXmlElement, namespaceUri: string, localName: string): string | undefined {
    return attributeValue(el, namespaceUri, localName);
}
/**
 *  Exported for the class: element children helper.
 *
 * @param {OpenXmlElement} el - The el.
 * @returns {ReadonlyArray<OpenXmlElement>} The result.
 * @private
 */
export function oleElementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return elementChildren(el);
}
/**
 *  Exported for the class: explicit-false detection for LockedField.
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function oleIsExplicitFalse(value: string): boolean {
    return isExplicitFalse(value);
}
/**
 * @private
 * Re-export attribute type for the class file. */
export { OpenXmlAttribute };
