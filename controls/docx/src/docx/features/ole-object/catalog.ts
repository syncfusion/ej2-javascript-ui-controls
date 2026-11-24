/**
 * OLE object multi-package-part catalog (embed + link +
 * icon/preview media).
 *
 * Owns the embedded-package bytes for OLE objects (`word/embeddings/*`),
 * external link targets, and optional icon/preview media
 * (`word/media/imageN.{png|jpeg}`), mirroring the images module part
 * pipeline (`registerPendingImage` → `materializePending` → `allocatePart` →
 * `applyToPackage`):
 *
 * - **Pending registration at append** — authoring registers payload bytes
 *   (and optional icon bytes) against the created {@link OleObject} without
 *   allocating package ids; relationship ids and part names are allocated at
 *   save (`materializePending`).
 * - **Deterministic part naming** — embeddings `word/embeddings/oleObject{N}.bin`
 *   (ECMA-376-1 §15.2.10); icons `word/media/image{N}.{png|jpeg}`
 *   (ECMA-376-1 §15.2.14; images module parity).
 * - **Content type** — embed: caller-provided, else the default
 *   `application/vnd.openxmlformats-officedocument.oleObject`; icon: sniffed
 *   PNG/JPEG only.
 * - **No OLE byte dedupe** — OLE storages are not content-addressable (two
 *   appends of identical bytes yield two distinct parts and relationships).
 * - **Icon hash dedupe** — identical icon bytes share one media part and one
 *   image relationship (sha256; images module parity).
 * - **Orphan GC at save** — a part with no referencing `w:object` in the
 *   document is removed together with its relationship and content-type
 *   override (parity with the images module).
 * - **Linked objects** — external relationships only
 *   (`TargetMode="External"`); **no part** is created for the OLE link.
 *   Icon media for a link is still an internal image part.
 *
 * Security (`.agent/policies/security.md`): payload bytes are opaque data.
 * This catalog stores, replaces, and writes them; it never parses,
 * decompresses, inspects beyond length, activates, or launches anything.
 * Link targets are strings only. Icon bytes are PNG/JPEG media only.
 *
 * @packageDocumentation
 */
import { sha256Hex as sha256Digest } from '../../core/compat/sha256';
import { WordDocument } from '../document/document';
import { FeatureMultiPackagePart } from '../document/feature-multi-package-part';
import { allocateRelationshipId, relationshipsWith, TargetMode, OpcRelationship, RelationshipId, Relationships } from '../../core/opc/relationships';
import { partByName, relationshipsForPart, withPartRelationships, OpcPackage, PackagePart } from '../../core/opc/package';
import { partName, partNameKey, PartName } from '../../core/opc/part-name';
import { replaceOrAddPackagePart } from '../../core/registry/multi-part-handlers';
import { usedMainDocumentRelationshipIds } from '../../core/registry/multi-part-handlers';
import { IMAGE_RELATIONSHIP_TYPE, JPEG_CONTENT_TYPE, PNG_CONTENT_TYPE, ImageType } from '../images/index';
import { OLE_OBJECT_LINK_LONG_PATH_RELATIONSHIP_TYPE, OLE_OBJECT_RELATIONSHIP_TYPE } from './relationship';
import { ContentTypeRecord } from '../../core/opc/content-types';
/**
 * Minimal structural view of an OLE object the catalog needs for the
 * pending-embed / pending-link lifecycle (keeps the owning module free of an
 * index import; `OleObject` satisfies this structurally).
 *
 * @private
 */
export interface PendingEmbedHost {
    /** Whether the authored embed/link still awaits save-time materialization. */
    isPendingRelationship(): boolean;
    /** Bind the allocated relationship id at materialization. */
    resolveRelationshipId(relationshipId: string): void;
}
/**
 * Minimal structural view for pending icon media materialization
 * Distinct from {@link PendingEmbedHost} so embed/link and
 * icon can materialize independently on the same object.
 *
 * @private
 */
export interface PendingIconHost {
    /** Whether authored icon bytes still await save-time materialization. */
    isPendingIcon(): boolean;
    /** Bind the allocated image relationship id onto `v:imagedata/@r:id`. */
    resolveIconRelationshipId(relationshipId: string): void;
}
/**
 * Default content type for authored embedded-object parts (unknown binary
 * storage). ECMA-376-1 §15.2.10 permits any content type; Word uses this
 * token for OLE compound storages.
 *
 * @private
 */
export const OLE_OBJECT_DEFAULT_CONTENT_TYPE: string = 'application/vnd.openxmlformats-officedocument.oleObject';
/** Part-name prefix for authored embedding parts (spec §Package parts). */
const EMBEDDINGS_PART_PREFIX: string = '/word/embeddings/oleObject';
/** Part-name extension for authored embedding parts. */
const EMBEDDINGS_PART_SUFFIX: string = '.bin';
/** Part-name prefix for authored icon media (images module parity). */
const MEDIA_PART_PREFIX: string = '/word/media/image';
/**
 * One embedded-object part linked from the Main Document part.
 *
 * @private
 */
export interface OleObjectPartEntry {
    /** Full OPC part name, e.g. `/word/embeddings/oleObject1.bin`. */
    readonly partName: PartName;
    /** Main-document relationship id pointing at the part. */
    readonly relationshipId: string;
    /** Relationship type (`OLE_OBJECT_RELATIONSHIP_TYPE` on load/authored). */
    readonly relationshipType: string;
    /** Content type of the part (Override). */
    readonly contentType: string;
    /** Opaque payload bytes (embedded objects only; linked has no part). */
    data: Uint8Array;
    /** True when the bytes changed since load/last save. */
    dirty: boolean;
    /**
     * @private
     * Relationship queued for creation at the next save. */
    pendingRelationship: OpcRelationship | undefined;
}
/**
 * One icon/preview media part linked from the Main Document part
 * (ECMA-376-1 §15.2.14 Image Part; VML `v:imagedata`).
 *
 * @private
 */
export interface OleIconPartEntry {
    /** Full OPC part name, e.g. `/word/media/image1.png`. */
    readonly partName: PartName;
    /** Main-document relationship id pointing at the media part. */
    readonly relationshipId: string;
    /** Relationship type (`IMAGE_RELATIONSHIP_TYPE`). */
    readonly relationshipType: string;
    /** Sniffed PNG or JPEG content type. */
    readonly contentType: ImageType;
    /** Icon/preview image bytes. */
    data: Uint8Array;
    /** True when the bytes changed since load/last save. */
    dirty: boolean;
    /**
     * @private
     * Relationship queued for creation at the next save. */
    pendingRelationship: OpcRelationship | undefined;
}
/**
 * External (linked) OLE relationship entry — target string only, no part.
 *
 * @private
 */
interface OleObjectExternalEntry {
    readonly relationshipId: string;
    /** Stored target string (path/URI); never fetched. */
    readonly target: string;
    /**
     * Relationship type as loaded. Authored links always use the transitional
     * oleObject type; long-path is accept-only and never re-emitted.
     */
    readonly relationshipType: string;
    /** Relationship queued for creation at the next save (authored only). */
    pendingRelationship: OpcRelationship | undefined;
}
/**
 * Package catalog for embedded OLE object parts, linked external targets,
 * and icon/preview media parts.
 *
 * Loaded from Main-WordDocument relationships of the transitional `oleObject`
 * type (and the long-path link variant on load only) plus image
 * relationships whose parts are PNG/JPEG (icon media). Authored
 * embeds/links/icons register pending entries that are materialized at save.
 *
 * @private
 */
export class OleObjectCatalog implements FeatureMultiPackagePart {
    private readonly entries: Map<PartName, OleObjectPartEntry>;
    private readonly byRelationshipId: Map<string, OleObjectPartEntry>;
    private readonly externalByRelationshipId: Map<string, OleObjectExternalEntry>;
    private readonly iconEntries: Map<PartName, OleIconPartEntry>;
    private readonly iconByRelationshipId: Map<string, OleIconPartEntry>;
    private readonly iconHashToRelationshipId: Map<string, string>;
    private readonly pendingRemovals: OleObjectPartEntry[];
    private readonly pendingExternalRemovals: string[];
    private readonly pendingIconRemovals: OleIconPartEntry[];
    private readonly pendingEmbeds: Map<PendingEmbedHost, {
        readonly bytes: Uint8Array;
        readonly contentType: string;
    }>;
    private readonly pendingLinks: Map<PendingEmbedHost, {
        readonly target: string;
    }>;
    private readonly pendingIcons: Map<PendingIconHost, {
        readonly bytes: Uint8Array;
        readonly contentType: ImageType;
    }>;
    /**
     * @param {Map<PartName, OleObjectPartEntry>} entries - The entries.
     * @param {Map<string, OleObjectExternalEntry>} externalByRelationshipId - The external by relationship id.
     * @param {Map<PartName, OleIconPartEntry>} iconEntries - The icon entries.
     * @private
     */
    constructor(
        entries: Map<PartName, OleObjectPartEntry>,
        externalByRelationshipId: Map<string, OleObjectExternalEntry> = new Map(),
        iconEntries: Map<PartName, OleIconPartEntry> = new Map()
    ) {
        this.entries = entries;
        this.byRelationshipId = new Map<string, OleObjectPartEntry>(
            [...entries.values()].map((entry: OleObjectPartEntry): [string, OleObjectPartEntry] => [entry.relationshipId, entry])
        );
        this.externalByRelationshipId = externalByRelationshipId;
        this.iconEntries = iconEntries;
        this.iconByRelationshipId = new Map<string, OleIconPartEntry>(
            [...iconEntries.values()].map((entry: OleIconPartEntry): [string, OleIconPartEntry] => [entry.relationshipId, entry])
        );
        this.iconHashToRelationshipId = new Map();
        for (const entry of iconEntries.values()) {
            this.iconHashToRelationshipId.set(sha256Hex(entry.data), entry.relationshipId);
        }
        this.pendingRemovals = [];
        this.pendingExternalRemovals = [];
        this.pendingIconRemovals = [];
        this.pendingEmbeds = new Map();
        this.pendingLinks = new Map();
        this.pendingIcons = new Map();
    }
    /**
     * Loaded + pending embedded-object entries (embedded only; linked objects
     * have no part).
     *
     * @returns {ReadonlyArray<OleObjectPartEntry>} The result.
     * @private
     */
    objects(): ReadonlyArray<OleObjectPartEntry> {
        return [...this.entries.values()];
    }
    /**
     * Payload bytes for a main-document relationship id (embedded parts only).
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {Uint8Array | undefined} The result.
     * @private
     */
    bytesForRelationship(relationshipId: string): Uint8Array | undefined {
        let ts330: any;
        return ((ts330 = this.byRelationshipId.get(relationshipId)), ts330 == null ? undefined : ts330.data);
    }
    /**
     * External target string for a main-document relationship id (linked
     * objects only). Returns `undefined` for embeds. The string is stored
     * verbatim and is never fetched, resolved, or opened.
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {string | undefined} The result.
     * @private
     */
    targetForRelationship(relationshipId: string): string | undefined {
        let ts331: any;
        return ((ts331 = this.externalByRelationshipId.get(relationshipId)), ts331 == null ? undefined : ts331.target);
    }
    /**
     * Icon/preview image bytes for a main-document image relationship id
     * Returns `undefined` when the id is not an icon media entry.
     *
     * @param {string} relationshipId - The relationship id.
     * @returns {Uint8Array | undefined} The result.
     * @private
     */
    iconBytesForRelationship(relationshipId: string): Uint8Array | undefined {
        let ts332: any;
        return ((ts332 = this.iconByRelationshipId.get(relationshipId)), ts332 == null ? undefined : ts332.data);
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @returns {Uint8Array | undefined} The result.
     * @private
     * Pending payload bytes for a not-yet-materialized embed.
     */
    pendingBytesFor(object: PendingEmbedHost): Uint8Array | undefined {
        let ts333: any;
        return ((ts333 = this.pendingEmbeds.get(object)), ts333 == null ? undefined : ts333.bytes);
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @returns {string | undefined} The result.
     * @private
     * Pending external target for a not-yet-materialized link.
     */
    pendingTargetFor(object: PendingEmbedHost): string | undefined {
        let ts334: any;
        return ((ts334 = this.pendingLinks.get(object)), ts334 == null ? undefined : ts334.target);
    }
    /**
     * @param {PendingIconHost} object - The object.
     * @returns {Uint8Array | undefined} The result.
     * @private
     * Pending icon bytes for a not-yet-materialized icon.
     */
    pendingIconBytesFor(object: PendingIconHost): Uint8Array | undefined {
        let ts335: any;
        return ((ts335 = this.pendingIcons.get(object)), ts335 == null ? undefined : ts335.bytes);
    }
    /**
     * @returns {ReadonlyArray<PartName>} The result.
     * @private
     * Part names already owned by the catalog (embed + icon).
     */
    pendingPartNames(): ReadonlyArray<PartName> {
        return [...this.entries.keys(), ...this.iconEntries.keys()];
    }
    /**
     * @returns {ReadonlyArray<string>} The result.
     * @private
     * Relationship ids already owned by the catalog
     * (embed + link + icon).
     */
    pendingRelationshipIds(): ReadonlyArray<string> {
        return [
            ...this.byRelationshipId.keys(),
            ...this.externalByRelationshipId.keys(),
            ...this.iconByRelationshipId.keys()
        ];
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @param {Uint8Array} bytes - The bytes.
     * @param {string} contentType - The content type.
     * @returns {void} Nothing is returned.
     * @private
     * Record embed intent without allocating package ids
     * (images `registerPendingImage` pattern). `contentType` may be
     * caller-provided or the module default.
     */
    registerPendingEmbed(object: PendingEmbedHost, bytes: Uint8Array, contentType: string): void {
        this.pendingEmbeds.set(object, { bytes, contentType });
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @param {string} target - The target.
     * @returns {void} Nothing is returned.
     * @private
     * Record link intent without allocating package ids
     * (hyperlinks `registerPendingExternal` pattern). Target is a stored
     * string only — never fetched.
     */
    registerPendingLink(object: PendingEmbedHost, target: string): void {
        this.pendingLinks.set(object, { target });
    }
    /**
     * @param {PendingIconHost} object - The object.
     * @param {Uint8Array} bytes - The bytes.
     * @param {ImageType} contentType - The content type.
     * @returns {void} Nothing is returned.
     * @private
     * Record icon/preview media intent without allocating package
     * ids (images `registerPendingImage` pattern). Bytes must
     * already be sniffed as PNG or JPEG by the caller.
     */
    registerPendingIcon(object: PendingIconHost, bytes: Uint8Array, contentType: ImageType): void {
        this.pendingIcons.set(object, { bytes, contentType });
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @returns {void} Nothing is returned.
     * @private
     * Drop a pending embed removed before save.
     */
    discardPendingEmbed(object: PendingEmbedHost): void {
        this.pendingEmbeds.delete(object);
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @returns {void} Nothing is returned.
     * @private
     * Drop a pending link removed before save.
     */
    discardPendingLink(object: PendingEmbedHost): void {
        this.pendingLinks.delete(object);
    }
    /**
     * @param {PendingIconHost} object - The object.
     * @returns {void} Nothing is returned.
     * @private
     * Drop a pending icon removed before save.
     */
    discardPendingIcon(object: PendingIconHost): void {
        this.pendingIcons.delete(object);
    }
    /**
     * @param {PendingEmbedHost} object - The object.
     * @param {Uint8Array} bytes - The bytes.
     * @returns {void} Nothing is returned.
     * @private
     * Replace bytes on a not-yet-materialized embed.
     */
    updatePendingBytes(object: PendingEmbedHost, bytes: Uint8Array): void {
        const pending: { readonly bytes: Uint8Array; readonly contentType: string; } = this.pendingEmbeds.get(object);
        if (pending === undefined) {
            throw new Error('Pending OLE object was not found');
        }
        this.pendingEmbeds.set(object, { ...pending, bytes });
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @param {Uint8Array} bytes - The bytes.
     * @returns {void} Nothing is returned.
     * @private
     * Replace bytes on a loaded entry and mark it dirty
     * (byte-replace only; the library never interprets OLE storages).
     */
    replaceBytes(relationshipId: string, bytes: Uint8Array): void {
        const entry: OleObjectPartEntry = this.byRelationshipId.get(relationshipId);
        if (entry === undefined) {
            throw new Error(`OLE object relationship ${relationshipId} is not loaded`);
        }
        entry.data = bytes;
        entry.dirty = true;
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     * Queue orphan removal of a part + relationship + content-type
     * override (GC parity with the images module). For external (link-only)
     * relationships, removes the relationship entry only — there is no part.
     */
    removeEntry(relationshipId: string): void {
        const entry: OleObjectPartEntry = this.byRelationshipId.get(relationshipId);
        if (entry !== undefined) {
            this.entries.delete(entry.partName);
            this.byRelationshipId.delete(relationshipId);
            this.pendingRemovals.push(entry);
            return;
        }
        if (this.externalByRelationshipId.has(relationshipId)) {
            this.externalByRelationshipId.delete(relationshipId);
            this.pendingExternalRemovals.push(relationshipId);
        }
    }
    /**
     * @param {string} relationshipId - The relationship id.
     * @returns {void} Nothing is returned.
     * @private
     * Queue removal of an icon media part + image relationship
     * Shared media (hash-deduped) is removed only when this is
     * the last catalog reference; callers must not remove shared icons while
     * other objects still reference the same relationship id.
     */
    removeIconEntry(relationshipId: string): void {
        const entry: OleIconPartEntry = this.iconByRelationshipId.get(relationshipId);
        if (entry === undefined) {
            return;
        }
        this.iconEntries.delete(entry.partName);
        this.iconByRelationshipId.delete(relationshipId);
        const hash: string = sha256Hex(entry.data);
        if (this.iconHashToRelationshipId.get(hash) === relationshipId) {
            this.iconHashToRelationshipId.delete(hash);
        }
        this.pendingIconRemovals.push(entry);
    }
    /**
     * @returns {boolean} The result.
     * @private
     */
    isDirty(): boolean {
        if (this.pendingRemovals.length > 0 ||
            this.pendingExternalRemovals.length > 0 ||
            this.pendingIconRemovals.length > 0 ||
            this.pendingEmbeds.size > 0 ||
            this.pendingLinks.size > 0 ||
            this.pendingIcons.size > 0) {
            return true;
        }
        for (const entry of this.entries.values()) {
            if (entry.dirty || entry.pendingRelationship !== undefined) {
                return true;
            }
        }
        for (const entry of this.externalByRelationshipId.values()) {
            if (entry.pendingRelationship !== undefined) {
                return true;
            }
        }
        for (const entry of this.iconEntries.values()) {
            if (entry.dirty || entry.pendingRelationship !== undefined) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {Uint8Array} bytes - The bytes.
     * @param {string} contentType - The content type.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {Object} The result.
     * @private
     * Allocate a new embedding part + main-document relationship
     * for one pending embed (images `allocatePart` pattern; no dedupe).
     */
    allocatePart(bytes: Uint8Array, contentType: string, usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): {
        entry: OleObjectPartEntry;
        relationshipId: string;
    } {
        const partNameValue: PartName = allocateEmbeddingPartName(usedPartNames);
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while (this.byRelationshipId.has(relId) ||
            this.externalByRelationshipId.has(relId) ||
            this.iconByRelationshipId.has(relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const entry: OleObjectPartEntry = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType: OLE_OBJECT_RELATIONSHIP_TYPE,
            contentType,
            data: bytes,
            dirty: true,
            pendingRelationship: {
                id: relId as never,
                type: OLE_OBJECT_RELATIONSHIP_TYPE,
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.entries.set(partNameValue, entry);
        this.byRelationshipId.set(relId, entry);
        return { entry, relationshipId: relId };
    }
    /**
     * @param {string} target - The target.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @returns {string} The result.
     * @private
     * Allocate an external oleObject relationship for one pending
     * link (hyperlinks `allocateExternalTarget` pattern). No part is created.
     * Always emits the transitional oleObject type — never the long-path
     * accept-only variant.
     */
    allocateExternalTarget(target: string, usedRelIds: ReadonlySet<string>): string {
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while (this.byRelationshipId.has(relId) ||
            this.externalByRelationshipId.has(relId) ||
            this.iconByRelationshipId.has(relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const pending: OpcRelationship = {
            id: relId,
            type: OLE_OBJECT_RELATIONSHIP_TYPE,
            target,
            targetMode: TargetMode.External,
            extraAttributes: [],
            children: []
        };
        this.externalByRelationshipId.set(relId, {
            relationshipId: relId,
            target,
            relationshipType: OLE_OBJECT_RELATIONSHIP_TYPE,
            pendingRelationship: pending
        });
        return relId;
    }
    /**
     * @param {Uint8Array} bytes - The bytes.
     * @param {ImageType} contentType - The content type.
     * @param {ReadonlySet<string>} usedRelIds - The used rel ids.
     * @param {ReadonlySet<string>} usedPartNames - The used part names.
     * @returns {Object} The result.
     * @private
     * Allocate (or reuse via sha256) an icon media part + image
     * relationship (images `allocatePart` + hash-dedupe pattern).
     */
    allocateIconPart(bytes: Uint8Array, contentType: ImageType, usedRelIds: ReadonlySet<string>, usedPartNames: ReadonlySet<string>): {
        entry: OleIconPartEntry;
        relationshipId: string;
    } {
        const hash: string = sha256Hex(bytes);
        const existingId: string = this.iconHashToRelationshipId.get(hash);
        if (existingId !== undefined) {
            const existing: OleIconPartEntry = this.iconByRelationshipId.get(existingId);
            if (existing !== undefined) {
                return { entry: existing, relationshipId: existingId };
            }
        }
        const partNameValue: PartName = allocateIconPartName(contentType, usedPartNames);
        let relId: RelationshipId = allocateRelationshipId(usedRelIds);
        while (this.byRelationshipId.has(relId) ||
            this.externalByRelationshipId.has(relId) ||
            this.iconByRelationshipId.has(relId)) {
            relId = allocateRelationshipId(new Set([...usedRelIds, relId]));
        }
        const entry: OleIconPartEntry = {
            partName: partNameValue,
            relationshipId: relId,
            relationshipType: IMAGE_RELATIONSHIP_TYPE,
            contentType,
            data: bytes,
            dirty: true,
            pendingRelationship: {
                id: relId as never,
                type: IMAGE_RELATIONSHIP_TYPE,
                target: relativeTarget(partNameValue),
                extraAttributes: [],
                children: []
            }
        };
        this.iconEntries.set(partNameValue, entry);
        this.iconByRelationshipId.set(relId, entry);
        this.iconHashToRelationshipId.set(hash, relId);
        return { entry, relationshipId: relId };
    }
    /**
     * @param {WordDocument} document - The document.
     * @param {*} objects - The objects.
     * @returns {void} Nothing is returned.
     * @private
     * Allocate relationship ids (+ part names for embeds/icons) for
     * pending embeds, links, and icons and resolve each object's `r:id` values
     * (save-time `materializePending`). The caller supplies the modeled OLE
     * objects in document order (avoids a circular import of the index listing
     * helper). Objects that carry a pending registration but were not visited
     * keep their registration (the next save retries); objects removed before
     * save are dropped via `discardPendingEmbed` / `discardPendingLink` /
     * `discardPendingIcon`.
     */
    materializePending(document: WordDocument, objects: ReadonlyArray<(PendingEmbedHost & PendingIconHost)>): void {
        if (this.pendingEmbeds.size === 0 &&
            this.pendingLinks.size === 0 &&
            this.pendingIcons.size === 0) {
            return;
        }
        const usedRelIds: Set<string> = usedMainDocumentRelationshipIds(document);
        for (const id of this.pendingRelationshipIds()) {
            usedRelIds.add(id);
        }
        const usedPartNames: Set<string> = usedPartNameKeys(document, this);
        for (const object of objects) {
            if (object.isPendingRelationship()) {
                const pendingEmbed: { readonly bytes: Uint8Array; readonly contentType: string; } = this.pendingEmbeds.get(object);
                if (pendingEmbed !== undefined) {
                    const allocated: { entry: OleObjectPartEntry; relationshipId: string } = this.allocatePart(
                        pendingEmbed.bytes,
                        pendingEmbed.contentType,
                        usedRelIds,
                        usedPartNames
                    );
                    usedRelIds.add(allocated.relationshipId);
                    usedPartNames.add(partNameKey(allocated.entry.partName));
                    object.resolveRelationshipId(allocated.relationshipId);
                    this.pendingEmbeds.delete(object);
                }
                else {
                    const pendingLink: { readonly target: string; } = this.pendingLinks.get(object);
                    if (pendingLink !== undefined) {
                        const relationshipId: string = this.allocateExternalTarget(pendingLink.target, usedRelIds);
                        usedRelIds.add(relationshipId);
                        object.resolveRelationshipId(relationshipId);
                        this.pendingLinks.delete(object);
                    }
                }
            }
            if (object.isPendingIcon()) {
                const pendingIcon: { readonly bytes: Uint8Array; readonly contentType: ImageType; } = this.pendingIcons.get(object);
                if (pendingIcon !== undefined) {
                    const allocated: { entry: OleIconPartEntry; relationshipId: string } = this.allocateIconPart(
                        pendingIcon.bytes,
                        pendingIcon.contentType,
                        usedRelIds,
                        usedPartNames
                    );
                    usedRelIds.add(allocated.relationshipId);
                    usedPartNames.add(partNameKey(allocated.entry.partName));
                    object.resolveIconRelationshipId(allocated.relationshipId);
                    this.pendingIcons.delete(object);
                }
            }
        }
    }
    /**
     * @param {OpcPackage} pkg - The pkg.
     * @param {PartName} mainPartName - The main part name.
     * @returns {OpcPackage} The result.
     * @private
     */
    applyToPackage(pkg: OpcPackage, mainPartName: PartName): OpcPackage {
        let next: OpcPackage = pkg;
        for (const entry of this.entries.values()) {
            if (!entry.dirty && entry.pendingRelationship === undefined) {
                continue;
            }
            const rel: OpcRelationship =
                entry.pendingRelationship != null
                    ? entry.pendingRelationship
                    : relationshipsForPart(next, mainPartName).items.find((item: OpcRelationship) => item.id === entry.relationshipId);
            next = replaceOrAddPackagePart(next, mainPartName, entry.partName, entry.contentType, entry.data, rel);
            entry.dirty = false;
            entry.pendingRelationship = undefined;
        }
        for (const entry of this.iconEntries.values()) {
            if (!entry.dirty && entry.pendingRelationship === undefined) {
                continue;
            }
            const rel: OpcRelationship =
                entry.pendingRelationship != null
                    ? entry.pendingRelationship
                    : relationshipsForPart(next, mainPartName).items.find((item: OpcRelationship) => item.id === entry.relationshipId);
            next = replaceOrAddPackagePart(next, mainPartName, entry.partName, entry.contentType, entry.data, rel);
            entry.dirty = false;
            entry.pendingRelationship = undefined;
        }
        // Merge pending external (link) relationships — no parts (hyperlinks pattern).
        const pendingExternalRels: OpcRelationship[] = [...this.externalByRelationshipId.values()]
            .map((entry: OleObjectExternalEntry) => entry.pendingRelationship)
            .filter((rel: OpcRelationship): rel is OpcRelationship => rel !== undefined);
        if (pendingExternalRels.length > 0) {
            const existing: Relationships = relationshipsForPart(next, mainPartName);
            const merged: Relationships = mergePendingRelationships(existing, pendingExternalRels);
            for (const entry of this.externalByRelationshipId.values()) {
                entry.pendingRelationship = undefined;
            }
            next = withPartRelationships(next, mainPartName, merged);
        }
        for (const entry of this.pendingRemovals) {
            next = removeOleObjectPartFromPackage(next, mainPartName, entry);
        }
        this.pendingRemovals.length = 0;
        for (const entry of this.pendingIconRemovals) {
            next = removeOleIconPartFromPackage(next, mainPartName, entry);
        }
        this.pendingIconRemovals.length = 0;
        for (const relationshipId of this.pendingExternalRemovals) {
            next = withFilteredPartRelationshipsLocal(next, mainPartName, (rel: OpcRelationship) => rel.id !== relationshipId);
        }
        this.pendingExternalRemovals.length = 0;
        return next;
    }
}
function mergePendingRelationships(
    existing: ReturnType<typeof relationshipsForPart>,
    add: ReadonlyArray<OpcRelationship>
): ReturnType<typeof relationshipsWith> {
    if (add.length === 0) {
        return existing;
    }
    const used: Set<RelationshipId> = new Set(existing.items.map((item: OpcRelationship) => item.id));
    const next: OpcRelationship[] = [...existing.items];
    for (const rel of add) {
        let id: RelationshipId = rel.id;
        while (used.has(id)) {
            id = allocateRelationshipId(used);
        }
        used.add(id);
        next.push({ ...rel, id });
    }
    return relationshipsWith(next, existing.opaque);
}
function relativeTarget(partNameValue: PartName): string {
    return partNameValue.slice('/word/'.length);
}
/**
 *  First unused `oleObject{N}.bin` part name (deterministic, no dedupe).
 *
 * @param {ReadonlySet<string>} used - The used.
 * @returns {PartName} The result.
 */
function allocateEmbeddingPartName(used: ReadonlySet<string>): PartName {
    let index: number = 1;
    while (used.has(partNameKey(`${EMBEDDINGS_PART_PREFIX}${String(index)}${EMBEDDINGS_PART_SUFFIX}`))) {
        index += 1;
    }
    return partName(`${EMBEDDINGS_PART_PREFIX}${String(index)}${EMBEDDINGS_PART_SUFFIX}`);
}
/**
 *  First unused `image{N}.{png|jpeg}` part name (images module parity).
 *
 * @param {ImageType} contentType - The content type.
 * @param {ReadonlySet<string>} used - The used.
 * @returns {PartName} The result.
 */
function allocateIconPartName(contentType: ImageType, used: ReadonlySet<string>): PartName {
    const ext: string = extensionForIconContentType(contentType);
    let index: number = 1;
    while (used.has(partNameKey(`${MEDIA_PART_PREFIX}${String(index)}.${ext}`))) {
        index += 1;
    }
    return partName(`${MEDIA_PART_PREFIX}${String(index)}.${ext}`);
}
function extensionForIconContentType(contentType: ImageType): string {
    return contentType === JPEG_CONTENT_TYPE ? 'jpeg' : 'png';
}
function sha256Hex(data: Uint8Array): string {
    return sha256Digest(data);
}
function usedPartNameKeys(document: WordDocument, catalog: OleObjectCatalog): Set<string> {
    const used: Set<string> = new Set<string>();
    for (const part of document.opcPackage().parts) {
        used.add(partNameKey(part.name));
    }
    for (const name of catalog.pendingPartNames()) {
        used.add(partNameKey(name));
    }
    return used;
}
function removeOleObjectPartFromPackage(pkg: OpcPackage, mainPartName: PartName, entry: OleObjectPartEntry): OpcPackage {
    let next: OpcPackage = withRemovedPartLocal(pkg, entry.partName);
    next = withRemovedContentTypeOverrideLocal(next, entry.partName);
    next = withFilteredPartRelationshipsLocal(next, mainPartName, (rel: OpcRelationship) => rel.id !== entry.relationshipId);
    return next;
}
function removeOleIconPartFromPackage(pkg: OpcPackage, mainPartName: PartName, entry: OleIconPartEntry): OpcPackage {
    let next: OpcPackage = withRemovedPartLocal(pkg, entry.partName);
    next = withRemovedContentTypeOverrideLocal(next, entry.partName);
    next = withFilteredPartRelationshipsLocal(next, mainPartName, (rel: OpcRelationship) => rel.id !== entry.relationshipId);
    return next;
}
function withRemovedPartLocal(pkg: OpcPackage, name: PartName): OpcPackage {
    const key: string = partNameKey(name);
    const parts: PackagePart[] = pkg.parts.filter((part: PackagePart) => partNameKey(part.name) !== key);
    if (parts.length === pkg.parts.length) {
        return pkg;
    }
    return { ...pkg, parts };
}
function withRemovedContentTypeOverrideLocal(pkg: OpcPackage, logicalPartName: PartName): OpcPackage {
    return {
        ...pkg,
        contentTypes: {
            records: pkg.contentTypes.records.filter((record: ContentTypeRecord) => !(record.kind === 'override' && record.partName === logicalPartName))
        }
    };
}
function withFilteredPartRelationshipsLocal(pkg: OpcPackage, source: PartName, keep: (rel: OpcRelationship) => boolean): OpcPackage {
    const existing: Relationships = relationshipsForPart(pkg, source);
    const kept: OpcRelationship[] = existing.items.filter(keep);
    if (kept.length === existing.items.length) {
        return pkg;
    }
    return withPartRelationships(pkg, source, relationshipsWith(kept, existing.opaque));
}
function isOleObjectRelationshipType(type: string): boolean {
    return (type === OLE_OBJECT_RELATIONSHIP_TYPE ||
        type === OLE_OBJECT_LINK_LONG_PATH_RELATIONSHIP_TYPE);
}
function isImageRelationshipType(type: string): boolean {
    return type === IMAGE_RELATIONSHIP_TYPE;
}
function contentTypeForIconPart(part: PackagePart): ImageType | undefined {
    if (part.contentType === PNG_CONTENT_TYPE || part.contentType === JPEG_CONTENT_TYPE) {
        return part.contentType;
    }
    return undefined;
}
/**
 * Load the OLE-object catalog from Main-WordDocument relationships of the
 * `oleObject` type (and the long-path link variant) plus PNG/JPEG image
 * relationships used as OLE icon/preview media.
 *
 * Internal oleObject targets load embedded parts; external targets load
 * link target strings only (no part). Image relationships with PNG/JPEG
 * content types load into the icon catalog.
 *
 * @param {OpcPackage} pkg - The pkg.
 * @param {PartName} mainPartName - The main part name.
 * @returns {OleObjectCatalog} The result.
 * @private
 */
export function loadOleObjectCatalog(pkg: OpcPackage, mainPartName: PartName): OleObjectCatalog {
    const rels: Relationships = relationshipsForPart(pkg, mainPartName);
    const entries: Map<PartName, OleObjectPartEntry> = new Map<PartName, OleObjectPartEntry>();
    const externalByRelationshipId: Map<string, OleObjectExternalEntry> = new Map<string, OleObjectExternalEntry>();
    const iconEntries: Map<PartName, OleIconPartEntry> = new Map<PartName, OleIconPartEntry>();
    for (const rel of rels.items) {
        if (isOleObjectRelationshipType(rel.type)) {
            // External targets are linked objects; store the target string only.
            if (rel.targetMode === TargetMode.External) {
                externalByRelationshipId.set(rel.id, {
                    relationshipId: rel.id,
                    target: rel.target,
                    relationshipType: rel.type,
                    pendingRelationship: undefined
                });
                continue;
            }
            // Long-path is a link-only product type; ignore internal targets for it.
            if (rel.type === OLE_OBJECT_LINK_LONG_PATH_RELATIONSHIP_TYPE) {
                continue;
            }
            const target: PartName = resolveInternalTargetLocal(rel.target, mainPartName);
            const part: PackagePart = partByName(pkg, target);
            if (part === undefined) {
                continue; // dangling relationship: body parse keeps the object; GC handles the rest
            }
            entries.set(part.name, {
                partName: part.name,
                relationshipId: rel.id,
                relationshipType: rel.type,
                contentType: part.contentType,
                data: part.data,
                dirty: false,
                pendingRelationship: undefined
            });
            continue;
        }
        // PNG/JPEG image relationships are candidates for icon media.
        if (!isImageRelationshipType(rel.type) || rel.targetMode === TargetMode.External) {
            continue;
        }
        const imageTarget: PartName = resolveInternalTargetLocal(rel.target, mainPartName);
        const imagePart: PackagePart = partByName(pkg, imageTarget);
        if (imagePart === undefined) {
            continue;
        }
        const iconContentType: ImageType = contentTypeForIconPart(imagePart);
        if (iconContentType === undefined) {
            continue;
        }
        iconEntries.set(imagePart.name, {
            partName: imagePart.name,
            relationshipId: rel.id,
            relationshipType: rel.type,
            contentType: iconContentType,
            data: imagePart.data,
            dirty: false,
            pendingRelationship: undefined
        });
    }
    return new OleObjectCatalog(entries, externalByRelationshipId, iconEntries);
}
function resolveInternalTargetLocal(target: string, mainPartName: PartName): PartName {
    if (target.startsWith('/')) {
        return partName(target);
    }
    // Relative targets resolve against the source part directory (/word/…).
    const base: string = mainPartName.slice(0, mainPartName.lastIndexOf('/') + 1);
    return partName(`${base}${target}`);
}
