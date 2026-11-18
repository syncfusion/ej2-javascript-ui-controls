export * from './catalog';
export * from './relationship';
export * from './typed-dom';
import { WordDocument, FeaturePartState } from '../document/document';
import { pointToTwips } from '../document/length';
import { FeatureRunLeaf } from '../document/feature-run-leaf';
import { Paragraph } from '../document/paragraph';
import { FeatureRunParagraphItem, ParagraphItem } from '../document/text-range';
import { isWml } from '../document/wml';
import { DocxError } from '../../core/errors/index';
import { registerFeatureMaterializeHandler, registerFeatureMultiPartHandler, featureId, registerFeature, registerFeatureRunLeafHandler } from '../../core/registry/index';
import { OpcPackage } from '../../core/opc/package';
import { FeatureMultiPartLoadContext } from '../../core/registry/multi-part-handlers';
import { NamespaceDeclaration, OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { ImageType, sniffImageContentType } from '../images/image-sniff';
import { loadOleObjectCatalog, OleObjectCatalog, OLE_OBJECT_DEFAULT_CONTENT_TYPE } from './catalog';
import { OFFICE_OLE_NAMESPACE, OleDrawAspect, OleLinkType, OleUpdateMode, applyOleDomMutations, oleAttributeValue, parseOleObjectDomState, readDrawAspect, readFieldCodes, readLinkType, readLinkTypeDescription, readLockedField, readObjectId, readOriginalHeight, readOriginalWidth, readProgId, readShapeId, readUpdateMode, resolveOleChild, OleDomMutation, OleObjectDomState, OleWireForm } from './typed-dom';
/**
 * @private
 */
/**
 * Feature id for the optional OLE-object module.
 *
 * @private
 */
export const OLE_OBJECT: FeatureId = featureId('ole-object');
/**
 * Transitional relationship type for an embedded/linked OLE object part.
 * Defined in {@link ./relationship}; re-exported by `export *` above.
 *
 * @private
 */
import { OLE_OBJECT_RELATIONSHIP_TYPE } from './relationship';
import { FeatureId } from '../../core/registry/feature-registry';
import { OpenXmlChild } from '../../core/xml/model';
/**
 * Typed, editable view over a WordprocessingML embedded/linked OLE object
 * (`w:object` containing an `o:OLEObject`, `w:objectEmbed`, or
 * `w:objectLink` child).
 *
 * @remarks
 * **Security — never execute.** The library must never activate, open,
 * automate, or execute OLE, ActiveX, VBA, scripts, or external content.
 * Binary payload parts (`word/embeddings/*`) are opaque caller data: the
 * {@link OleObject.payloadBytes} accessor moves bytes in and out verbatim
 * and nothing in the module inspects, parses, or launches them. Link
 * targets are stored strings and are never fetched, resolved, or probed.
 *
 * One semantic model over two schema-backed wire encodings (fixed at load;
 * edits never convert forms):
 * - `office` — `o:OLEObject` (transitional `vml-officeDrawing.xsd`
 *   `CT_OLEObject`, ECMA-376-4 §19.2.2.20)
 * - `wml` — `w:objectEmbed` / `w:objectLink` (transitional `wml.xsd`
 *   `CT_ObjectEmbed`/`CT_ObjectLink`, ECMA-376-1 §17.3.3.20/§17.3.3.21)
 *
 * Setters patch only the modeled attribute/child on the stored element;
 * every unmodeled sibling attribute/child survives verbatim. `undefined`
 * clears the modeled member (three-state semantics).
 *
 * Schema citations: `w:object` (`CT_Object`, transitional `wml.xsd` line
 * 1167; ECMA-376-1 §17.3.3.19), `CT_OLEObject` + `ST_OLEType` /
 * `ST_OLEDrawAspect` / `ST_OLEUpdateMode` / `ST_OLELinkType`
 * (`vml-officeDrawing.xsd` lines 291/475–493), Office behavior
 * [MS-OI29500] §2.1.1834 (`ObjectID` unsupported on links, regenerated per
 * save). Relationship type: `OLE_OBJECT_RELATIONSHIP_TYPE`.
 *
 * @private
 */
export class OleObject implements FeatureRunLeaf {
    private state: OleObjectDomState;
    private relationshipIdValue: string | undefined;
    /**
     *  Image relationship id from `v:imagedata/@r:id` (TASK-8056
     * icon/preview media). Distinct from the OLE embed/link `r:id`.
     *
     * @private
     */
    private imageRelationshipIdValue: string | undefined;
    /**
     *  Pending payload registered by embed authoring (TASK-8054);
     * resolved through the catalog at save. `undefined` for loaded objects
     * and for pending links.
     *
     * @private
     */
    private pendingPayload: {
        readonly bytes: Uint8Array;
        readonly contentType: string;
    } | undefined;
    /**
     *  True when link authoring registered a pending external target
     * (TASK-8055) that still awaits save-time materialization.
     *
     * @private
     */
    private pendingLink: boolean = false;
    /**
     *  True when icon/preview media authoring registered pending
     * image bytes (TASK-8056) that still await save-time materialization.
     *
     * @private
     */
    private pendingIcon: boolean = false;
    /**
     *  @private
     *
     * @param {OpenXmlElement} objectElement - The object element.
     * @param {OpenXmlElement} oleElement - The ole element.
     */
    constructor(objectElement: OpenXmlElement, oleElement: OpenXmlElement) {
        const resolved: { oleElement: OpenXmlElement; wireForm: OleWireForm; } = resolveOleChild(objectElement);
        if (resolved === undefined || resolved.oleElement !== oleElement) {
            // Fallback for direct construction (legacy tests): derive the form
            // from the child element itself.
            const wireForm: OleWireForm = oleElement.namespaceUri === OFFICE_OLE_NAMESPACE ? 'office' : 'wml';
            this.state = parseOleObjectDomState(objectElement, oleElement, wireForm);
        }
        else {
            this.state = parseOleObjectDomState(objectElement, resolved.oleElement, resolved.wireForm);
        }
        this.relationshipIdValue = oleAttributeValue(oleElement, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
        // TASK-8056: bind icon media from VML `v:imagedata/@r:id` when present
        // (ECMA-376-4 §19.2.2.20; ECMA-376-1 §15.2.14).
        this.imageRelationshipIdValue = readImageDataRelationshipId(objectElement);
    }
    /**
     * Which schema encoding this object's `w:object` carries.
     *
     * @private
     */
    get wireForm(): OleWireForm {
        return this.state.wireForm;
    }
    /**
     * Kind of OLE connection — `embed` (storage part) or `link` (external
     * target). `undefined` when the stored `@Type` token is unknown
     * (residual); the WML-native form derives this from
     * `w:objectEmbed` vs `w:objectLink`.
     *
     * @private
     */
    get linkType(): OleLinkType | undefined {
        return readLinkType(this.state);
    }
    set linkType(value: OleLinkType | undefined) {
        this.mutate({ type: value });
    }
    /**
     * Programmatic identifier (`@ProgID` / `@progId`), e.g.
     * `'Excel.Sheet.12'` or `'Acrobat.WordDocument.DC'`.
     *
     * @private
     */
    get progId(): string | undefined {
        return readProgId(this.state);
    }
    set progId(value: string | undefined) {
        this.mutate({ progId: value });
    }
    /**
     * Placeholder shape id (`@ShapeID` / `@shapeId`) — the `v:shape` this
     * object is visually bound to.
     *
     * @private
     */
    get shapeId(): string | undefined {
        return readShapeId(this.state);
    }
    set shapeId(value: string | undefined) {
        this.mutate({ shapeId: value });
    }
    /**
     * Visual representation (`@DrawAspect` / `@drawAspect`): `content`
     * (render object content) or `icon` (placeholder icon).
     * `undefined` = not set / unparseable residual.
     *
     * @private
     */
    get drawAspect(): OleDrawAspect | undefined {
        return readDrawAspect(this.state);
    }
    set drawAspect(value: OleDrawAspect | undefined) {
        this.mutate({ drawAspect: value });
    }
    /**
     * Embedded-object unique id (`@ObjectID`, office form only — the
     * WML-native form has no counterpart). Office regenerates this per save
     * and does not support it on linked objects ([MS-OI29500] §2.1.1834).
     *
     * @private
     */
    get objectId(): string | undefined {
        return readObjectId(this.state);
    }
    set objectId(value: string | undefined) {
        this.mutate({ objectId: value });
    }
    /**
     * Link refresh mode (`@UpdateMode` / `@updateMode`): `always` or
     * `onCall`. Meaningful for linked objects.
     *
     * @private
     */
    get updateMode(): OleUpdateMode | undefined {
        return readUpdateMode(this.state);
    }
    set updateMode(value: OleUpdateMode | undefined) {
        this.mutate({ updateMode: value });
    }
    /**
     * Whether the linked object's appearance is locked
     * (`o:LockedField` child / `@lockedField`). `undefined` = absent.
     *
     * @private
     */
    get lockedField(): boolean | undefined {
        return readLockedField(this.state);
    }
    set lockedField(value: boolean | undefined) {
        this.mutate({ lockedField: value });
    }
    /**
     * `o:LinkType` child value (office form only) — e.g.
     * `'EnhancedMetaFile'`, `'Bitmap'` (`ST_OLELinkType` is an open string).
     *
     * @private
     */
    get linkTypeDescription(): string | undefined {
        return readLinkTypeDescription(this.state);
    }
    set linkTypeDescription(value: string | undefined) {
        this.mutate({ linkTypeDescription: value });
    }
    /**
     * Stored LINK-field switches (`o:FieldCodes` child / `@fieldCodes`),
     * e.g. `'\\f 0'`. Stored verbatim; never interpreted.
     *
     * @private
     */
    get fieldCodes(): string | undefined {
        return readFieldCodes(this.state);
    }
    set fieldCodes(value: string | undefined) {
        this.mutate({ fieldCodes: value });
    }
    /**
     * Original placeholder width from `w:object/@dxaOrig` (points;
     * wire is `ST_TwipsMeasure`).
     *
     * @private
     */
    get originalWidth(): number | undefined {
        return readOriginalWidth(this.state);
    }
    set originalWidth(value: number | undefined) {
        this.mutate({
            originalWidth: value
        });
    }
    /**
     * Original placeholder height from `w:object/@dyaOrig` (points;
     * wire is `ST_TwipsMeasure`).
     *
     * @private
     */
    get originalHeight(): number | undefined {
        return readOriginalHeight(this.state);
    }
    set originalHeight(value: number | undefined) {
        this.mutate({
            originalHeight: value
        });
    }
    /**
     * `true` when the object is linked (`@Type` = `Link`, or the WML-native
     * `w:objectLink` form); otherwise treated as embedded.
     *
     * @private
     */
    get linked(): boolean {
        return readLinkType(this.state) === OleLinkType.Link;
    }
    /**
     * External link target string for linked objects (Main-WordDocument oleObject
     * relationship with `TargetMode="External"`).
     *
     * **Get** returns the pending target registered by
     * {@link Paragraph.appendOleObject} before the first save, otherwise the
     * catalog target bound to `relationshipId`. `undefined` for embeds and
     * when no external relationship is bound.
     *
     * **Security — strings only.** The value is a stored path/URI string and is
     * never fetched, resolved, probed, opened, or executed
     * (`.agent/policies/security.md`). Callers that need network or filesystem
     * access must do so outside this library.
     *
     * @private
     */
    get linkTarget(): string | undefined {
        if (readLinkType(this.state) !== OleLinkType.Link) {
            return undefined;
        }
        const relationshipIdValue: string = this.relationshipIdValue;
        const catalog: OleObjectCatalog = this.lookUpCatalog();
        if (relationshipIdValue !== undefined &&
            relationshipIdValue.length > 0 &&
            catalog !== undefined) {
            const target: string = catalog.targetForRelationship(relationshipIdValue);
            if (target !== undefined) {
                return target;
            }
        }
        if (this.pendingLink && catalog !== undefined) {
            return catalog.pendingTargetFor(this);
        }
        return undefined;
    }
    /**
     * Raw relationship id from `@r:id`, when present. Empty until a pending
     * authored embed or link is materialized at save (images `Image`
     * pattern).
     *
     * @private
     */
    get relationshipId(): string | undefined {
        return this.relationshipIdValue;
    }
    /**
     * Image relationship id from `v:imagedata/@r:id` (TASK-8056 icon/preview
     * media). Empty until a pending authored icon is materialized at save.
     *
     * @private
     */
    get imageRelationshipId(): string | undefined {
        return this.imageRelationshipIdValue;
    }
    /**
     * Icon/preview image bytes (TASK-8056) — PNG or JPEG only.
     *
     * **Get** returns pending icon bytes registered by
     * {@link Paragraph.appendOleObject} before the first save, otherwise the
     * catalog icon bytes bound to `imageRelationshipId`. `undefined` when no
     * icon/preview media is attached. Bytes are copied defensively. The library
     * never renders, executes, or activates the image
     * (`.agent/policies/security.md`).
     *
     * @private
     */
    get previewImageBytes(): Uint8Array | undefined {
        const catalog: OleObjectCatalog = this.lookUpCatalog();
        if (this.pendingIcon && catalog !== undefined) {
            const pending: Uint8Array = catalog.pendingIconBytesFor(this);
            if (pending !== undefined) {
                return copyBytes(pending);
            }
        }
        const imageRelationshipIdValue: string = this.imageRelationshipIdValue;
        if (imageRelationshipIdValue !== undefined &&
            imageRelationshipIdValue.length > 0 &&
            catalog !== undefined) {
            const bytes: Uint8Array = catalog.iconBytesForRelationship(imageRelationshipIdValue);
            if (bytes !== undefined) {
                return copyBytes(bytes);
            }
        }
        return undefined;
    }
    /**
     * Embedded payload bytes — GO program decision Q1 (option A).
     *
     * **Get** returns the embedded object's stored bytes: the pending bytes
     * registered by {@link Paragraph.appendOleObject} before the first save,
     * otherwise the catalog bytes bound to `relationshipId`. `undefined` for
     * linked objects (no part exists) and when the embedding part is missing.
     * The library never interprets these bytes — they are caller data
     * (`.agent/policies/security.md`); any sandboxing decision is the caller's.
     *
     * **Set** replaces the payload bytes byte-for-byte: on pending embeds
     * (registered bytes swap) and on loaded embeddings (catalog entry marked
     * dirty; save rewrites the part). Removing bytes (`undefined`) is not
     * supported — detach by removing the owning run instead. The bytes are
     * copied defensively on both paths.
     *
     * @throws DocxError `content/invalid-ole-object` when setting empty bytes
     * or bytes on a linked object, or when the owning document (and therefore
     * its catalog) is unavailable for a loaded-object write.
     *
     * @private
     */
    get payloadBytes(): Uint8Array | undefined {
        if (readLinkType(this.state) === OleLinkType.Link) {
            return undefined;
        }
        // Catalog-authoritative for materialized objects; pending registration
        // covers the pre-save window (allocated bytes may differ from what the
        // catalog ends up writing — the catalog entry is the source of truth).
        const relationshipIdValue: string = this.relationshipIdValue;
        const catalog: OleObjectCatalog = this.lookUpCatalog();
        if (relationshipIdValue !== undefined &&
            relationshipIdValue.length > 0 &&
            catalog !== undefined) {
            const bytes: Uint8Array = catalog.bytesForRelationship(relationshipIdValue);
            if (bytes !== undefined) {
                return copyBytes(bytes);
            }
        }
        if (this.pendingPayload !== undefined) {
            return copyBytes(this.pendingPayload.bytes);
        }
        return undefined;
    }
    set payloadBytes(value: Uint8Array | undefined) {
        if (value === undefined) {
            throw new DocxError('content/invalid-ole-object', 'OleObject payloadBytes cannot be cleared; remove the owning run instead');
        }
        if (value.byteLength === 0) {
            throw new DocxError('content/invalid-ole-object', 'OleObject payload bytes must not be empty');
        }
        if (readLinkType(this.state) === OleLinkType.Link) {
            throw new DocxError('content/invalid-ole-object', 'OleObject payloadBytes is only available on embedded objects');
        }
        const copy: Uint8Array = copyBytes(value);
        if (this.pendingPayload !== undefined) {
            this.pendingPayload = { ...this.pendingPayload, bytes: copy };
            // Mirror into the catalog registration so materialization writes the
            // replacement bytes (catalog entry is the save-time source of truth).
            const catalog: OleObjectCatalog = this.lookUpCatalog();
            if (catalog !== undefined) {
                catalog.updatePendingBytes(this, copy);
            }
            return;
        }
        const relationshipIdValue: string = this.relationshipIdValue;
        const catalog: OleObjectCatalog = this.lookUpCatalog();
        if (relationshipIdValue === undefined ||
            relationshipIdValue.length === 0 ||
            catalog === undefined) {
            throw new DocxError('content/invalid-ole-object', 'OleObject has no embedding part to replace (not yet saved and no pending payload)');
        }
        catalog.replaceBytes(relationshipIdValue, copy);
    }
    /**
     * Returns the original `w:object` element with modeled edits applied
     * (unmodeled attributes/children stay byte-identical).
     *
     * @returns {OpenXmlElement} The result.
     * @private
     */
    toOpenXml(): OpenXmlElement {
        return this.state.element;
    }
    /**
     * Whether the authored embed or link still awaits save-time
     * materialization. True between {@link Paragraph.appendOleObject} and the
     * first {@link WordDocument.saveSync} (or {@link WordDocument.save}).
     *
     * @returns {boolean} The result.
     * @private
     */
    isPendingRelationship(): boolean {
        return this.pendingPayload !== undefined || this.pendingLink;
    }
    /**
     * Bind the materialized relationship id after catalog allocation.
     * Patches `@r:id` on the stored `o:OLEObject`/`w:object*` element
     * (patch-in-place: only the id value changes; prefix/position preserved).
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     */
    resolveRelationshipId(relationshipId: string): void {
        this.relationshipIdValue = relationshipId;
        this.pendingPayload = undefined;
        this.pendingLink = false;
        // Patch r:id without disturbing anything else on the element.
        this.state = withRelationshipId(this.state, relationshipId);
    }
    /**
     * Register pending embed bytes + content type (authoring path).
     *
     * @param {Uint8Array} bytes - The bytes.
     * @param {string} contentType - The content type.
     * @returns {void} Nothing is returned.
     * @private
     */
    registerPendingPayload(bytes: Uint8Array, contentType: string): void {
        this.pendingPayload = { bytes: copyBytes(bytes), contentType };
        this.pendingLink = false;
    }
    /**
     * Mark this object as a pending external link (authoring path).
     * The target string lives on the catalog registration.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    registerPendingLinkTarget(): void {
        this.pendingLink = true;
        this.pendingPayload = undefined;
    }
    /**
     * Whether authored icon/preview media still awaits save-time
     * materialization (TASK-8056; {@link PendingIconHost}).
     *
     * @returns {boolean} The result.
     * @private
     */
    isPendingIcon(): boolean {
        return this.pendingIcon;
    }
    /**
     * Bind the materialized image relationship id after catalog icon
     * allocation. Patches `v:imagedata/@r:id` (TASK-8056).
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     */
    resolveIconRelationshipId(relationshipId: string): void {
        this.imageRelationshipIdValue = relationshipId;
        this.pendingIcon = false;
        this.state = withImageDataRelationshipId(this.state, relationshipId);
    }
    /**
     * Mark this object as carrying pending icon/preview media (authoring
     * path). Bytes live on the catalog registration.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    registerPendingIconMedia(): void {
        this.pendingIcon = true;
    }
    /**
     *  Pending content type for catalog mirroring.
     *
     * @returns {string | undefined} The result.
     * @private
     */
    pendingContentType(): string | undefined {
        return this.pendingPayload == null ? undefined : this.pendingPayload.contentType;
    }
    /**
     * Look up the owning document's OLE catalog, `undefined` when detached or
     * the feature was not registered at load (authored documents always have
     * it because `appendOleObject` resolved one to register the payload).
     *
     * @returns {OleObjectCatalog | undefined} The result.
     * @private
     */
    private lookUpCatalog(): OleObjectCatalog | undefined {
        const document: WordDocument = this.owningDocumentOf();
        if (document === undefined) {
            return undefined;
        }
        const part: FeaturePartState = document.featurePart(OLE_OBJECT);
        return part instanceof OleObjectCatalog ? part : undefined;
    }
    /**
     * Resolve the owning document through the stored element's host run —
     * tracked by the module when the leaf was bound to a run (authoring) or
     * parsed under a catalog-active load. Walks up nothing structural: the
     * catalog contact point is registered at load/append time (see
     * `bindHostDocument`).
     *
     * @returns {WordDocument | undefined} The result.
     * @private
     */
    private owningDocumentOf(): WordDocument | undefined {
        return hostDocumentOf(this);
    }
    /**
     * Apply one modeled mutation in a single structural pass (patch-in-place).
     * Invalid enum values throw `DocxError('content/invalid-ole-object')`;
     * non-positive sizes likewise.
     *
     * @param {OleDomMutation} mutations - The mutations.
     * @returns {void} Nothing is returned.
     */
    private mutate(mutations: OleDomMutation): void {
        let ts330: any;
        this.state = applyOleDomMutations(this.state, mutations);
        this.relationshipIdValue = ((ts330 = oleAttributeValue(this.state.oleElement, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')), ts330 != null ? ts330 : this.relationshipIdValue);
    }
}
/**
 *  Defensive byte copy (spec: payloadBytes copies on get/set).
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {Uint8Array} The result.
 */
function copyBytes(bytes: Uint8Array): Uint8Array {
    const out: Uint8Array = new Uint8Array(bytes.byteLength);
    out.set(bytes);
    return out;
}
/**
 * Replace `@r:id` on the OLE child of a state, cloning once and keeping
 * every other attribute/child byte-identical (materialization-time patch;
 * the attribute exists from authoring with an empty value).
 *
 * @param {OleObjectDomState} state - The state.
 * @param {string} relationshipId - The relationship id.
 * @returns {OleObjectDomState} The result.
 */
function withRelationshipId(state: OleObjectDomState, relationshipId: string): OleObjectDomState {
    const R_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const element: OpenXmlElement = state.element;
    const oleIndex: number = element.children.findIndex((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element' &&
        (c === state.oleElement ||
            (c.namespaceUri === state.oleElement.namespaceUri &&
                c.localName === state.oleElement.localName)));
    if (oleIndex < 0) {
        return state;
    }
    // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the collection length (loop counter or range-checked argument); not a user-controlled property name
    const ole: OpenXmlChild = element.children[oleIndex];
    if (ole === undefined || ole.kind !== 'element') {
        return state;
    }
    const attributes: OpenXmlAttribute[] = ole.attributes.map((a: OpenXmlAttribute) => a.namespaceUri === R_NAMESPACE && a.localName === 'id'
        ? { ...a, value: relationshipId }
        : a);
    const nextOle: OpenXmlElement = { ...ole, attributes };
    const nextElement: OpenXmlElement = {
        ...element,
        children: element.children.map((c: OpenXmlChild, i: number) => (i === oleIndex ? nextOle : c))
    };
    return { element: nextElement, oleElement: nextOle, wireForm: state.wireForm };
}
/** VML namespace for `v:shape` / `v:imagedata` (ECMA-376-4 Part 4). */
const VML_NAMESPACE_URI: string = 'urn:schemas-microsoft-com:vml';
/** Relationships namespace used by `r:id` on OLE and imagedata. */
const R_NAMESPACE_URI: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
/**
 * Read `v:imagedata/@r:id` from a `w:object` element when present
 * (TASK-8056 load path).
 *
 * @param {OpenXmlElement} objectElement - The object element.
 * @returns {string | undefined} The result.
 */
function readImageDataRelationshipId(objectElement: OpenXmlElement): string | undefined {
    for (const child of objectElement.children) {
        if (child.kind !== 'element' ||
            child.namespaceUri !== VML_NAMESPACE_URI ||
            child.localName !== 'shape') {
            continue;
        }
        for (const shapeChild of child.children) {
            if (shapeChild.kind !== 'element' ||
                shapeChild.namespaceUri !== VML_NAMESPACE_URI ||
                shapeChild.localName !== 'imagedata') {
                continue;
            }
            const id: string = oleAttributeValue(shapeChild, R_NAMESPACE_URI, 'id');
            if (id !== undefined && id.length > 0) {
                return id;
            }
        }
    }
    return undefined;
}
/**
 * Replace `v:imagedata/@r:id` on the shape child of a state, cloning once
 * and keeping every other attribute/child byte-identical (materialization-
 * time icon patch; the attribute exists from authoring with an empty value
 * when icon bytes were supplied).
 *
 * @param {OleObjectDomState} state - The state.
 * @param {string} relationshipId - The relationship id.
 * @returns {OleObjectDomState} The result.
 */
function withImageDataRelationshipId(state: OleObjectDomState, relationshipId: string): OleObjectDomState {
    const element: OpenXmlElement = state.element;
    let shapeIndex: number = -1;
    let shape: OpenXmlElement | undefined;
    for (const [i, child] of element.children.entries()) {
        if (child !== undefined &&
            child.kind === 'element' &&
            child.namespaceUri === VML_NAMESPACE_URI &&
            child.localName === 'shape') {
            shapeIndex = i;
            shape = child;
            break;
        }
    }
    if (shape === undefined) {
        return state;
    }
    let imageDataIndex: number = -1;
    let imageData: OpenXmlElement | undefined;
    for (const [i, child] of shape.children.entries()) {
        if (child !== undefined &&
            child.kind === 'element' &&
            child.namespaceUri === VML_NAMESPACE_URI &&
            child.localName === 'imagedata') {
            imageDataIndex = i;
            imageData = child;
            break;
        }
    }
    if (imageData === undefined) {
        return state;
    }
    const hasId: boolean = imageData.attributes.some((a: OpenXmlAttribute) => a.namespaceUri === R_NAMESPACE_URI && a.localName === 'id');
    const attributes: OpenXmlAttribute[] = hasId
        ? imageData.attributes.map((a: OpenXmlAttribute) => a.namespaceUri === R_NAMESPACE_URI && a.localName === 'id'
            ? { ...a, value: relationshipId }
            : a)
        : [
            ...imageData.attributes,
            {
                namespaceUri: R_NAMESPACE_URI,
                prefix: 'r',
                localName: 'id',
                value: relationshipId
            }
        ];
    const nextImageData: OpenXmlElement = { ...imageData, attributes };
    const nextShape: OpenXmlElement = {
        ...shape,
        children: shape.children.map((c: OpenXmlChild, i: number) => (i === imageDataIndex ? nextImageData : c))
    };
    const nextElement: OpenXmlElement = {
        ...element,
        children: element.children.map((c: OpenXmlChild, i: number) => (i === shapeIndex ? nextShape : c))
    };
    // oleElement reference stays valid when it is not the shape index.
    let nextOle: OpenXmlElement = state.oleElement;
    if (state.oleElement === shape) {
        nextOle = nextShape;
    }
    else {
        for (const child of nextElement.children) {
            if (child.kind === 'element' &&
                child.namespaceUri === state.oleElement.namespaceUri &&
                child.localName === state.oleElement.localName) {
                nextOle = child;
                break;
            }
        }
    }
    return { element: nextElement, oleElement: nextOle, wireForm: state.wireForm };
}
/**
 * Host-document contact point for OLE leaves. Authored leaves bind their
 * owning document at append; loaded leaves bind during body parse while the
 * document's feature parts are visible (module-level WeakMap, keyed by the
 * leaf instance).
 */
const hostDocuments: WeakMap<OleObject, WordDocument> = new WeakMap<OleObject, WordDocument>();
/**
 *   Bind a leaf to its owning document (load + authoring paths).
 *
 * @param {OleObject} object - The object.
 * @param {WordDocument} document - The document.
 * @returns {void} Nothing is returned.
 * @private
 */
function bindHostDocument(object: OleObject, document: WordDocument): void {
    hostDocuments.set(object, document);
}
/**
 *   Host document of a leaf, when bound.
 *
 * @param {OleObject} object - The object.
 * @returns {WordDocument | undefined} The result.
 * @private
 */
function hostDocumentOf(object: OleObject): WordDocument | undefined {
    return hostDocuments.get(object);
}
function parseOleObject(element: OpenXmlElement): OleObject | undefined {
    if (!isWml(element, 'object')) {
        return undefined;
    }
    const resolved: { oleElement: OpenXmlElement; wireForm: OleWireForm; } = resolveOleChild(element);
    if (resolved === undefined) {
        return undefined;
    }
    return new OleObject(element, resolved.oleElement);
}
let registered: boolean = false;
/**
 *   Test hook
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function resetOleObjectFeatureForTests(): void {
    registered = false;
}
/**
 * Register the OLE-object run-leaf handler. Idempotent.
 *
 * @returns {void} Nothing is returned.
 * @private
 */
export function registerOleObjectFeature(): void {
    if (registered) {
        return;
    }
    registered = true;
    registerFeature({ id: OLE_OBJECT });
    registerFeatureMultiPartHandler({
        featureId: OLE_OBJECT,
        relationshipTypes: [OLE_OBJECT_RELATIONSHIP_TYPE],
        loadParts(pkg: OpcPackage, ctx: FeatureMultiPartLoadContext): OleObjectCatalog {
            return loadOleObjectCatalog(pkg, ctx.mainPartName);
        }
    });
    registerFeatureMaterializeHandler({
        featureId: OLE_OBJECT,
        materialize(document: WordDocument): void {
            const part: FeaturePartState = document.featurePart(OLE_OBJECT);
            if (part instanceof OleObjectCatalog) {
                part.materializePending(document, oleObjectsInDocument(document));
            }
        }
    });
    registerFeatureRunLeafHandler({
        featureId: OLE_OBJECT,
        wmlLocalName: 'object',
        tryParse: parseOleObject
    });
}
/**
 * Whether a run leaf is a modeled OLE object from this module.
 *
 * @param {ParagraphItem} item - The item.
 * @returns {Object} The result.
 * @private
 */
export function isOleObjectLeaf(item: ParagraphItem): item is FeatureRunParagraphItem & { value: OleObject } {
    return item instanceof FeatureRunParagraphItem && item.featureId === OLE_OBJECT && item.value instanceof OleObject;
}
function oleObjectsFromLeaves(items: ReadonlyArray<ParagraphItem>): OleObject[] {
    const found: OleObject[] = [];
    for (const item of items) {
        if (isOleObjectLeaf(item)) {
            found.push(item.value);
        }
    }
    return found;
}
/**
 * OLE objects in a paragraph, in document order. Also refreshes the
 * host-document binding used by {@link OleObject.payloadBytes}.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {ReadonlyArray<OleObject>} The result.
 * @private
 */
export function oleObjectsInParagraph(paragraph: Paragraph): ReadonlyArray<OleObject> {
    return oleObjectsFromLeaves(paragraph.items.toArray());
}
/**
 * OLE objects in the Main Document body, in document order. Also refreshes
 * the host-document binding used by {@link OleObject.payloadBytes}.
 *
 * @param {WordDocument} document - The document.
 * @returns {ReadonlyArray<OleObject>} The result.
 * @private
 */
export function oleObjectsInDocument(document: WordDocument): ReadonlyArray<OleObject> {
    const found: OleObject[] = [];
    for (const block of document.listBlocks()) {
        if (block.type !== 'paragraph') {
            continue;
        }
        for (const object of oleObjectsInParagraph(block.paragraph)) {
            bindHostDocument(object, document);
            found.push(object);
        }
    }
    return found;
}
// ---------------------------------------------------------------------------
// Authoring (TASK-8054): appendOleObject embed path
// ---------------------------------------------------------------------------
/** ObjectID upper bound ([MS-OI29500] §2.1.1834: `_<0..2147483647>`). */
const OBJECT_ID_MAX: number = 2147483647;
/** Shape id counter (module-local; Word uses `_x0000_i1026`-style tokens). */
let nextShapeIndex: number = 1026;
/** Anchor id counter (`w14:anchorId`, drawing-module precedent). */
let nextAnchorId: number = 0x5fe19563;
/**
 * Options for {@link Paragraph.appendOleObject}.
 *
 * Provide **either** embed payload bytes (`bytes`) **or** a link target
 * (`linkTarget` / `linkType: 'link'`). Link-only fields (`updateMode`,
 * `lockedField`, `fieldCodes`) reject on the embed path with
 * `content/invalid-ole-object` (mirrors `CT_ObjectEmbed` vs `CT_ObjectLink`).
 *
 * @private
 */
export interface AppendOleObjectOptions {
    /**
     * Programmatic identifier of the object — the `@ProgID` token Word
     * writes, e.g. `'Excel.Sheet.12'`, `'Word.WordDocument.12'`,
     * `'Acrobat.WordDocument.DC'`. Required and non-empty.
     */
    readonly progId: string;
    /**
     * Opaque payload bytes for the embedded object (an OLE compound storage,
     * an `.xlsx`/`.docx`/`.pdf` byte stream, …). Required and non-empty for
     * the embed path. The library stores these bytes verbatim and never
     * parses, decompresses, inspects, activates, or launches them. Must not
     * be combined with a link target.
     */
    readonly bytes?: Uint8Array;
    /**
     * Connection kind. Defaults to embed when `bytes` is supplied, or link
     * when `linkTarget` is supplied. Explicit `link` requires a non-empty
     * `linkTarget`; explicit `embed` rejects link-only fields.
     */
    readonly linkType?: OleLinkType;
    /**
     * External link target path/URI string stored verbatim on a Main-WordDocument
     * oleObject relationship with `TargetMode="External"`. Required for the
     * link path. **Never fetched, resolved, probed, or opened** by this
     * library (`.agent/policies/security.md`).
     */
    readonly linkTarget?: string;
    /**
     * Link refresh mode (`Always` | `OnCall`). Defaults to
     * {@link OleUpdateMode.Always} for links. Rejected on the embed path.
     */
    readonly updateMode?: OleUpdateMode;
    /**
     * Whether the LINK field is locked (`o:LockedField`). Link path only.
     */
    readonly lockedField?: boolean;
    /**
     * LINK field switches stored verbatim (e.g. `'\f 0'`); never interpreted.
     * Link path only (ECMA-376-1 §17.16.5.32).
     */
    readonly fieldCodes?: string;
    /**
     * Optional open-string `o:LinkType` child (e.g. `'EnhancedMetaFile'`).
     * Link path only; stored verbatim.
     */
    readonly linkTypeDescription?: string;
    /**
     * Placeholder width (`w:object/@w:dxaOrig` + `v:shape` style).
     * @defaultValue 1 inch
     */
    readonly width?: number;
    /**
     * Placeholder height (`w:object/@w:dyaOrig` + `v:shape` style).
     * @defaultValue 1 inch
     */
    readonly height?: number;
    /**
     * Display a placeholder icon instead of the object content
     * (`@DrawAspect` `Icon` vs `Content`). The library never renders icons;
     * with no icon bytes (TASK-8056) Word re-renders the placeholder on open
     * (program GO decision Q3). Product reference XML for linked icons
     * commonly uses `Icon`.
     * @defaultValue `false` (content)
     */
    readonly displayAsIcon?: boolean;
    /**
     * Alternative text (`v:shape/@alt`), e.g. a friendly object name.
     */
    readonly name?: string;
    /**
     * Extended description stored as `v:shape/@title` (and on
     * `v:imagedata/@o:title` when {@link iconBytes} is supplied).
     */
    readonly description?: string;
    /**
     * Icon/preview image bytes (TASK-8056). Must sniff as PNG or JPEG
     * (`image/png` / `image/jpeg`). When set, the library writes a media
     * part under `/word/media/`, an image relationship, and
     * `v:imagedata/@r:id` (ECMA-376-4 §19.2.2.20; ECMA-376-1 §15.2.14).
     * Does **not** by itself force `@DrawAspect="Icon"` — use
     * {@link displayAsIcon} for that (program GO Q3). Empty or non-image
     * bytes throw `content/invalid-ole-object`. Never rendered or executed.
     */
    readonly iconBytes?: Uint8Array;
    /**
     * Content type for the embedding part. Omit for the default
     * `application/vnd.openxmlformats-officedocument.oleObject` (ECMA-376-1
     * §15.2.10 permits any content type). Embed path only; ignored for links
     * (no part is created). The value is stored as given; the library does
     * not verify it against the bytes.
     */
    readonly contentType?: string;
}
/**
 * Shared modeled fields after authoring-option validation.
 */
interface ResolvedAuthoringCommon {
    readonly progId: string;
    /** Placeholder width in points (serialized to twips at the wire boundary). */
    readonly width: number;
    /** Placeholder height in points (serialized to twips at the wire boundary). */
    readonly height: number;
    readonly drawAspect: OleDrawAspect;
    readonly name: string | undefined;
    readonly description: string | undefined;
    /** Sniffed icon bytes when {@link AppendOleObjectOptions.iconBytes} set. */
    readonly iconBytes: Uint8Array | undefined;
    /** PNG/JPEG content type paired with {@link iconBytes}. */
    readonly iconContentType: ImageType | undefined;
}
/**
 * Validated embed authoring inputs (payload bytes + optional Override type).
 */
interface ResolvedEmbedAuthoringInput extends ResolvedAuthoringCommon {
    readonly kind: 'embed';
    readonly bytes: Uint8Array;
    readonly contentType: string;
}
/**
 * Validated link authoring inputs (external target string + CT_ObjectLink
 * / CT_OLEObject optional children). No part / no ObjectID.
 */
interface ResolvedLinkAuthoringInput extends ResolvedAuthoringCommon {
    readonly kind: 'link';
    readonly linkTarget: string;
    readonly updateMode: OleUpdateMode;
    readonly lockedField: boolean | undefined;
    readonly fieldCodes: string | undefined;
    readonly linkTypeDescription: string | undefined;
}
/**
 * Validated authoring inputs. Embed carries payload bytes; link carries an
 * external target string and optional CT_ObjectLink / CT_OLEObject fields.
 */
type ResolvedAuthoringInput = ResolvedEmbedAuthoringInput | ResolvedLinkAuthoringInput;
/**
 * Validate one authoring option set and resolve the modeled values.
 *
 * @param {AppendOleObjectOptions} options - The options.
 * @returns {ResolvedAuthoringInput} The result.
 * @throws DocxError `content/invalid-ole-object` on any invalid input
 * (missing/empty `progId`, missing payload/target, link-only fields on
 * embed, non-positive size, non-finite numbers).
 */
function resolveAuthoringInput(options: AppendOleObjectOptions): ResolvedAuthoringInput {
    const progId: string = options.progId;
    if (typeof progId !== 'string' || progId.length === 0) {
        throw new DocxError('content/invalid-ole-object', 'appendOleObject requires a non-empty progId (e.g. "Excel.Sheet.12")');
    }
    const hasBytes: boolean = options.bytes !== undefined;
    const hasLinkTarget: boolean = typeof options.linkTarget === 'string' && options.linkTarget.length > 0;
    const linkOnlySupplied: boolean = options.updateMode !== undefined ||
        options.lockedField !== undefined ||
        options.fieldCodes !== undefined ||
        options.linkTypeDescription !== undefined;
    let kind: 'embed' | 'link';
    if (options.linkType === OleLinkType.Link) {
        kind = 'link';
    }
    else if (options.linkType === OleLinkType.Embed) {
        kind = 'embed';
    }
    else if (hasLinkTarget && !hasBytes) {
        kind = 'link';
    }
    else {
        kind = 'embed';
    }
    if (kind === 'embed' && linkOnlySupplied) {
        throw new DocxError('content/invalid-ole-object', 'updateMode, lockedField, fieldCodes, and linkTypeDescription apply only to linked OLE objects');
    }
    if (kind === 'embed' && hasLinkTarget) {
        throw new DocxError('content/invalid-ole-object', 'linkTarget applies only to linked OLE objects');
    }
    if (kind === 'link' && hasBytes) {
        throw new DocxError('content/invalid-ole-object', 'payload bytes apply only to embedded OLE objects; linked objects store an external target string only');
    }
    const width: number = positivePointsOrThrow('width', options.width != null ? options.width : 72);
    const height: number = positivePointsOrThrow('height', options.height != null ? options.height : 72);
    // DrawAspect follows displayAsIcon only (program GO Q3) — iconBytes alone
    // never forces Icon.
    const drawAspect: OleDrawAspect = options.displayAsIcon === true ? OleDrawAspect.Icon : OleDrawAspect.Content;
    let iconBytes: Uint8Array | undefined;
    let iconContentType: ImageType | undefined;
    if (options.iconBytes !== undefined) {
        const rawIcon: Uint8Array = options.iconBytes;
        if (!(rawIcon instanceof Uint8Array) || rawIcon.byteLength === 0) {
            throw new DocxError('content/invalid-ole-object', 'appendOleObject iconBytes must be a non-empty PNG or JPEG byte sequence');
        }
        const sniffed: ImageType = sniffImageContentType(rawIcon);
        if (sniffed === undefined) {
            throw new DocxError('content/invalid-ole-object', 'appendOleObject iconBytes must sniff as image/png or image/jpeg');
        }
        iconBytes = copyBytes(rawIcon);
        iconContentType = sniffed;
    }
    const common: ResolvedAuthoringCommon = {
        progId,
        width,
        height,
        drawAspect,
        name: options.name,
        description: options.description,
        iconBytes,
        iconContentType
    };
    if (kind === 'link') {
        const linkTarget: string = options.linkTarget;
        if (typeof linkTarget !== 'string' || linkTarget.length === 0) {
            throw new DocxError('content/invalid-ole-object', 'appendOleObject link path requires a non-empty linkTarget string');
        }
        // Typed as OleUpdateMode; only Always | OnCall are valid public values.
        const updateMode: OleUpdateMode = options.updateMode === OleUpdateMode.OnCall
            ? OleUpdateMode.OnCall
            : OleUpdateMode.Always;
        return {
            kind: 'link',
            ...common,
            linkTarget,
            updateMode,
            lockedField: options.lockedField,
            fieldCodes: options.fieldCodes,
            linkTypeDescription: options.linkTypeDescription
        };
    }
    const bytes: Uint8Array = options.bytes;
    if (!(bytes instanceof Uint8Array) || bytes.byteLength === 0) {
        throw new DocxError('content/invalid-ole-object', 'appendOleObject embed requires non-empty bytes for the embedded object');
    }
    return {
        kind: 'embed',
        ...common,
        bytes,
        contentType: options.contentType != null ? options.contentType : OLE_OBJECT_DEFAULT_CONTENT_TYPE
    };
}
/**
 *  Validate a positive finite point measure for authoring (wire convert later).
 *
 * @param {string} name - The name.
 * @param {number} value - The value.
 * @returns {number} The result.
 */
function positivePointsOrThrow(name: string, value: number): number {
    const asNumber: number = value as unknown as number;
    if (typeof asNumber !== 'number' || !Number.isFinite(asNumber)) {
        throw new DocxError('content/invalid-ole-object', `OleObject ${name} must be a finite point value`);
    }
    if (asNumber < 0) {
        throw new DocxError('content/invalid-ole-object', `OleObject ${name} must be a positive point value`);
    }
    // Reject values that would serialize to a non-positive twips measure.
    if (pointToTwips(value) <= 0) {
        throw new DocxError('content/invalid-ole-object', `OleObject ${name} must be a positive point value`);
    }
    return value;
}
/**
 *  Next `_<0..2147483647>` ObjectID ([MS-OI29500] §2.1.1834 format).
 *
 * @returns {string} The result.
 */
function allocateObjectId(): string {
    // Deterministic-per-process counter in the Word format; Office regenerates
    // this value on every save, so stability across runs is not required.
    nextObjectIdValue = (nextObjectIdValue + 1) % (OBJECT_ID_MAX + 1);
    return `_${String(nextObjectIdValue)}`;
}
let nextObjectIdValue: number = 1850929220 % OBJECT_ID_MAX;
/**
 *  Next `_x0000_i{N}` shape id token (Word's conventional VML naming).
 *
 * @returns {string} The result.
 */
function allocateShapeId(): string {
    const id: string = `_x0000_i${String(nextShapeIndex)}`;
    nextShapeIndex += 1;
    return id;
}
/**
 *  Next `w14:anchorId` token (8 uppercase hex digits, drawing precedent).
 *
 * @returns {string} The result.
 */
function allocateAnchorId(): string {
    nextAnchorId = (nextAnchorId + 1) % 0xffffffff;
    const hex: string = nextAnchorId.toString(16).toUpperCase();
    return hex.length >= 8 ? hex : new Array(8 - hex.length + 1).join('0') + hex;
}
/**
 *  `style="width:{pt}pt;height:{pt}pt"` for the authored `v:shape` (points in, points out).
 *
 * @param {number} widthPoints - The width points.
 * @param {number} heightPoints - The height points.
 * @returns {string} The result.
 */
function shapeStyle(widthPoints: number, heightPoints: number): string {
    return `width:${formatPointsForStyle(widthPoints)}pt;height:${formatPointsForStyle(heightPoints)}pt`;
}
/**
 *  Points → VML style number text (2-decimal round, drop trailing .0).
 *
 * @param {number} points - The points.
 * @returns {string} The result.
 */
function formatPointsForStyle(points: number): string {
    const rounded: number = Math.round(points * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
/**
 *  Element in a namespace with a prefix.
 *
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} prefix - The prefix.
 * @param {string} localName - The local name.
 * @param {ReadonlyArray<OpenXmlAttribute>} attributes - The attributes.
 * @param {*} children - The children.
 * @param {ReadonlyArray<NamespaceDeclaration>} namespaceDeclarations - The namespace declarations.
 * @returns {OpenXmlElement} The result.
 */
function el(namespaceUri: string, prefix: string, localName: string, attributes: ReadonlyArray<OpenXmlAttribute>, children: ReadonlyArray<OpenXmlElement['children'][number]> = [], namespaceDeclarations: ReadonlyArray<NamespaceDeclaration> = []): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri,
        prefix,
        localName,
        attributes,
        namespaceDeclarations: [...namespaceDeclarations],
        children
    };
}
/**
 * Build the authored `w:object` subtree per the ECMA-376-4 §19.2.2.20
 * example-2 template (program GO decision Q2: always the VML
 * `o:OLEObject` form — Word's current output):
 *
 * ```xml
 * <w:object w:dxaOrig="…" w:dyaOrig="…" w14:anchorId="…">
 *   <v:shape id="_x0000_iNNNN" type="#_x0000_t75" style="width:…pt;height:…pt"
 *            o:ole="" alt="…">
 *     <v:imagedata/>  <!-- only when icon bytes exist (TASK-8056) -->
 *   </v:shape>
 *   <o:OLEObject Type="Embed|Link" ProgID="…" ShapeID="…" DrawAspect="…"
 *                [UpdateMode="Always|OnCall"] [ObjectID="_…"] r:id="rIdN">
 *     [o:LinkType][o:LockedField][o:FieldCodes]  <!-- link children order -->
 *   </o:OLEObject>
 * </w:object>
 * ```
 *
 * `ShapeID` is shared between `v:shape/@id` and `o:OLEObject/@ShapeID`;
 * the placeholder shape carries the `o:ole=""` marker. Embeds carry the
 * Office-required minimum attribute set (`r:id`/`ObjectID`/`ProgID`/
 * `ShapeID`, [MS-OI29500] §2.1.1834). Links omit `ObjectID` (same clause —
 * unsupported on linked objects) and emit required `UpdateMode`. `r:id` is
 * empty here and written at materialization.
 *
 * @param {ResolvedAuthoringInput} resolved - The resolved.
 * @returns {Object} The result.
 */
function buildAuthoredOleObjectElement(resolved: ResolvedAuthoringInput): {
    element: OpenXmlElement;
    oleElement: OpenXmlElement;
    shapeId: string;
} {
    const shapeId: string = allocateShapeId();
    const VML_NAMESPACE: string = 'urn:schemas-microsoft-com:vml';
    const W14_NAMESPACE: string = 'http://schemas.microsoft.com/office/word/2010/wordml';
    const R_NAMESPACE: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    // TS 3.3 does not narrow discriminated unions through a boolean local.
    const shapeAttributes: OpenXmlAttribute[] = [
        { namespaceUri: '', prefix: '', localName: 'id', value: shapeId },
        { namespaceUri: '', prefix: '', localName: 'type', value: '#_x0000_t75' },
        {
            namespaceUri: '',
            prefix: '',
            localName: 'style',
            value: shapeStyle(resolved.width, resolved.height)
        },
        // The OLE placeholder marker (§19.2.2.20 example 2: `o:ole=""`).
        { namespaceUri: OFFICE_OLE_NAMESPACE, prefix: 'o', localName: 'ole', value: '' }
    ];
    if (resolved.name !== undefined) {
        shapeAttributes.push({ namespaceUri: '', prefix: '', localName: 'alt', value: resolved.name });
    }
    if (resolved.description !== undefined) {
        shapeAttributes.push({
            namespaceUri: '',
            prefix: '',
            localName: 'title',
            value: resolved.description
        });
    }
    // v:imagedata only when icon bytes exist (TASK-8056; ECMA-376-4 §19.2.2.20).
    // r:id is empty here and patched at materialization (same pattern as OLE r:id).
    const shapeChildren: OpenXmlElement[] = [];
    if (resolved.iconBytes !== undefined && resolved.iconContentType !== undefined) {
        const imageDataAttributes: OpenXmlAttribute[] = [
            { namespaceUri: R_NAMESPACE, prefix: 'r', localName: 'id', value: '' }
        ];
        if (resolved.description !== undefined) {
            imageDataAttributes.push({
                namespaceUri: OFFICE_OLE_NAMESPACE,
                prefix: 'o',
                localName: 'title',
                value: resolved.description
            });
        }
        shapeChildren.push(el(VML_NAMESPACE, 'v', 'imagedata', imageDataAttributes));
    }
    const shape: OpenXmlElement = el(VML_NAMESPACE, 'v', 'shape', shapeAttributes, shapeChildren);
    // o:OLEObject attributes in schema declaration order: Type, ProgID,
    // ShapeID, DrawAspect, ObjectID (embed), UpdateMode (link), r:id.
    const oleAttributes: OpenXmlAttribute[] = [
        { namespaceUri: '', prefix: '', localName: 'Type', value: resolved.kind === 'link' ? 'Link' : 'Embed' },
        { namespaceUri: '', prefix: '', localName: 'ProgID', value: resolved.progId },
        { namespaceUri: '', prefix: '', localName: 'ShapeID', value: shapeId },
        {
            namespaceUri: '',
            prefix: '',
            localName: 'DrawAspect',
            value: resolved.drawAspect === OleDrawAspect.Icon ? 'Icon' : 'Content'
        }
    ];
    if (resolved.kind === 'link') {
        // CT_ObjectLink / CT_OLEObject required UpdateMode on linked objects.
        oleAttributes.push({
            namespaceUri: '',
            prefix: '',
            localName: 'UpdateMode',
            value: resolved.updateMode === OleUpdateMode.OnCall ? 'OnCall' : 'Always'
        });
    }
    else {
        // ObjectID is embed-only ([MS-OI29500] §2.1.1834 — unsupported on links).
        oleAttributes.push({
            namespaceUri: '',
            prefix: '',
            localName: 'ObjectID',
            value: allocateObjectId()
        });
    }
    oleAttributes.push({ namespaceUri: R_NAMESPACE, prefix: 'r', localName: 'id', value: '' });
    // Office children in CT_OLEObject sequence: LinkType → LockedField → FieldCodes.
    const oleChildren: OpenXmlElement[] = [];
    if (resolved.kind === 'link') {
        if (typeof resolved.linkTypeDescription === 'string') {
            oleChildren.push(el(OFFICE_OLE_NAMESPACE, 'o', 'LinkType', [], [
                { kind: 'text', value: resolved.linkTypeDescription }
            ]));
        }
        if (resolved.lockedField !== undefined) {
            oleChildren.push(el(OFFICE_OLE_NAMESPACE, 'o', 'LockedField', [], [
                { kind: 'text', value: resolved.lockedField ? 't' : 'f' }
            ]));
        }
        if (typeof resolved.fieldCodes === 'string') {
            oleChildren.push(el(OFFICE_OLE_NAMESPACE, 'o', 'FieldCodes', [], [
                { kind: 'text', value: resolved.fieldCodes }
            ]));
        }
    }
    const oleElement: OpenXmlElement = el(OFFICE_OLE_NAMESPACE, 'o', 'OLEObject', oleAttributes, oleChildren);
    const element: OpenXmlElement = el(WML_TRANSITIONAL, 'w', 'object', [
        {
            namespaceUri: WML_TRANSITIONAL,
            prefix: 'w',
            localName: 'dxaOrig',
            value: String(pointToTwips(resolved.width))
        },
        {
            namespaceUri: WML_TRANSITIONAL,
            prefix: 'w',
            localName: 'dyaOrig',
            value: String(pointToTwips(resolved.height))
        },
        {
            namespaceUri: W14_NAMESPACE,
            prefix: 'w14',
            localName: 'anchorId',
            value: allocateAnchorId()
        }
    ], [shape, oleElement],
        // The authored tree declares the namespaces it uses (Word writes these
        // on the root; a local declaration keeps the subtree well-formed when
        // the host document lacks them).
                                       [
                                           { prefix: 'w14', namespaceUri: W14_NAMESPACE },
                                           { prefix: 'v', namespaceUri: VML_NAMESPACE },
                                           { prefix: 'o', namespaceUri: OFFICE_OLE_NAMESPACE },
                                           { prefix: 'r', namespaceUri: R_NAMESPACE }
                                       ]);
    return { element, oleElement, shapeId };
}
/** Transitional WML namespace (local constant to avoid a core cycle). */
const WML_TRANSITIONAL: string = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
/**
 * Resolve the owning document's OLE catalog for authoring.
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @returns {OleObjectCatalog} The result.
 * @throws DocxError `feature/not-registered` when the OLE module was not
 * registered before the document was loaded/created (authored path is
 * impossible without the catalog).
 */
function catalogForAuthoring(paragraph: Paragraph): OleObjectCatalog {
    const document: WordDocument = paragraph.owningDocument();
    const part: FeaturePartState = document.featurePart(OLE_OBJECT);
    if (part === undefined || !(part instanceof OleObjectCatalog)) {
        throw new DocxError('feature/not-registered', 'OLE object catalog was not loaded; call registerOleObjectFeature() before WordDocument.open');
    }
    return part;
}
/**
 * Author one embedded or linked OLE object and append it to the paragraph
 * (receiver-owns R2.1; one statement R3.2).
 *
 * **Embed path (TASK-8054):** registers payload bytes with the document
 * catalog at append (pending-relationship pattern, images/ink precedent);
 * the embedding part `word/embeddings/oleObject{N}.bin`, its main-document
 * relationship, and the content-type Override are allocated at save.
 *
 * **Link path (TASK-8055):** registers an external target string only —
 * no package part. Save allocates a Main-WordDocument oleObject relationship
 * with `TargetMode="External"` using the transitional relationship type
 * (never the Office 2019 long-path type). The target is **never fetched
 * or opened** (`.agent/policies/security.md`).
 *
 * Returns the created {@link OleObject} view (`relationshipId` empty until
 * the first save materializes it).
 *
 * @param {Paragraph} paragraph - The paragraph.
 * @param {AppendOleObjectOptions} options - The options.
 * @returns {OleObject} The result.
 * @example
 * ```ts
 * // Embed
 * const embedded = paragraph.appendOleObject({
 *   progId: 'Excel.Sheet.12',
 *   bytes: workbookBytes,
 *   width: (75.35),
 *   height: (49.4),
 *   displayAsIcon: true,
 * });
 *
 * // Link (external target string only — never fetched)
 * const linked = paragraph.appendOleObject({
 *   progId: 'Excel.Sheet.12',
 *   linkTarget: 'C:\\\\Data\\\\report.xlsx',
 *   updateMode: OleUpdateMode.OnCall,
 *   lockedField: true,
 *   fieldCodes: '\\\\f 0',
 *   displayAsIcon: true,
 * });
 * ```
 *
 * @throws DocxError `content/invalid-ole-object` on invalid options
 * (missing `progId`, missing payload/target, link-only fields on embed,
 * non-positive size).
 * @throws DocxError `feature/not-registered` when the module is not
 * registered before load.
 * @throws DetachedObjectError when the paragraph is not in a document.
 *
 * @private
 */
export function appendOleObjectToParagraph(paragraph: Paragraph, options: AppendOleObjectOptions): OleObject {
    const resolved: ResolvedAuthoringInput = resolveAuthoringInput(options);
    const catalog: OleObjectCatalog = catalogForAuthoring(paragraph);
    const authored: { element: OpenXmlElement; oleElement: OpenXmlElement; shapeId: string; } = buildAuthoredOleObjectElement(resolved);
    const object: OleObject = new OleObject(authored.element, authored.oleElement);
    bindHostDocument(object, paragraph.owningDocument());
    if (resolved.kind === 'link') {
        // Target is a stored string only — catalog never fetches or opens it.
        object.registerPendingLinkTarget();
        catalog.registerPendingLink(object, resolved.linkTarget);
    }
    else {
        object.registerPendingPayload(resolved.bytes, resolved.contentType);
        catalog.registerPendingEmbed(object, resolved.bytes, resolved.contentType);
    }
    // TASK-8056: pending icon media (PNG/JPEG only; already sniffed).
    if (resolved.iconBytes !== undefined && resolved.iconContentType !== undefined) {
        object.registerPendingIconMedia();
        catalog.registerPendingIcon(object, resolved.iconBytes, resolved.iconContentType);
    }
    paragraph.appendFeatureRunItem(OLE_OBJECT, object);
    return object;
}
/**
 * Remove an OLE object run from its paragraph and drop the embedding part
 * or external link relationship on the next save (GC parity with
 * `paragraph.appendFeatureRunItem(OLE_OBJECT, object
 * this paragraph.
 *
 * @param {WordDocument} document - The document.
 * @param {Paragraph} paragraph - The paragraph.
 * @param {OleObject} object - The object.
 * @returns {void} Nothing is returned.
 * @private
 */
export function removeOleObject(document: WordDocument, paragraph: Paragraph, object: OleObject): void {
    for (const item of paragraph.items) {
        if (isOleObjectLeaf(item) && item.value === object) {
            paragraph.removeFeatureRunItem(object);
            const catalog: OleObjectCatalog = documentOleCatalog(document);
            if (catalog !== undefined) {
                if (object.isPendingRelationship()) {
                    if (object.linked) {
                        catalog.discardPendingLink(object);
                    }
                    else {
                        catalog.discardPendingEmbed(object);
                    }
                }
                else if (object.relationshipId !== undefined && object.relationshipId.length > 0) {
                    catalog.removeEntry(object.relationshipId);
                }
                // TASK-8056: drop pending or materialized icon media with the object.
                if (object.isPendingIcon()) {
                    catalog.discardPendingIcon(object);
                }
                else {
                    const imageRelationshipId: string = object.imageRelationshipId;
                    if (imageRelationshipId !== undefined && imageRelationshipId.length > 0) {
                        catalog.removeIconEntry(imageRelationshipId);
                    }
                }
            }
            return;
        }
    }
    throw new DocxError('content/invalid-ole-object', 'OLE object is not in this paragraph');
}
/**
 *  Catalog of a loaded document, `undefined` when the feature is absent.
 *
 * @param {WordDocument} document - The document.
 * @returns {OleObjectCatalog | undefined} The result.
 */
function documentOleCatalog(document: WordDocument): OleObjectCatalog | undefined {
    const part: FeaturePartState = document.featurePart(OLE_OBJECT);
    return part instanceof OleObjectCatalog ? part : undefined;
}
/**
 * Package catalog for a loaded document.
 *
 * @param {WordDocument} document - The document.
 * @returns {OleObjectCatalog} The result.
 * @throws DocxError `feature/not-registered` when the module was not
 * registered before load.
 *
 * @private
 */
export function oleObjectCatalog(document: WordDocument): OleObjectCatalog {
    const catalog: OleObjectCatalog = documentOleCatalog(document);
    if (catalog === undefined) {
        throw new DocxError('feature/not-registered', 'OLE object catalog was not loaded; call registerOleObjectFeature() before WordDocument.open');
    }
    return catalog;
}
Paragraph.prototype.appendOleObject = function (this: Paragraph, options: AppendOleObjectOptions): OleObject {
    return appendOleObjectToParagraph(this, options);
};
registerOleObjectFeature();
