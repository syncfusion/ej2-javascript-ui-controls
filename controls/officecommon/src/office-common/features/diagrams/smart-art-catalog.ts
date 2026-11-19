/**
 * SmartArtCatalog — package-level index of diagram parts and SmartArt instances.
 *
 * D14: when a part is clean and originalBytes are present, applyToPackage
 * writes those bytes; otherwise serializes ElementTree (caller encodes XML).
 *
 * Clone remaps modelIds; orphan-GC drops unreferenced parts after apply plan.
 *
 * Citations: requirement §12–§14; TASK-9008 catalog contract.
 */

import { Literal } from '../../core/literal-type';
import { DIAGRAM_COLORS_CONTENT_TYPE, DIAGRAM_COLORS_RELATIONSHIP_TYPE, DIAGRAM_DATA_CONTENT_TYPE, DIAGRAM_DATA_RELATIONSHIP_TYPE, DIAGRAM_DRAWING_CONTENT_TYPE, DIAGRAM_DRAWING_RELATIONSHIP_TYPE, DIAGRAM_LAYOUT_CONTENT_TYPE, DIAGRAM_LAYOUT_RELATIONSHIP_TYPE, DIAGRAM_QUICK_STYLE_CONTENT_TYPE, DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE } from './constants';
import { DiagramDataModel } from './diagram-data-model';
import { serializeDiagramData } from './diagram-serializers';
import { serializeDiagramColors, serializeDiagramDrawing, serializeDiagramLayout, serializeDiagramQuickStyle } from './diagram-serializers';
import { DiagramColors, DiagramDrawing, DiagramLayout, DiagramQuickStyle } from './diagram-views';
import { ElementNode } from './element-tree';
import { DiagramError } from './errors';
import { DiagramRelIds, SmartArtDiagram } from './smart-art-diagram';

type DiagramPartValue = DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing;
const CATALOG_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.SmartArtCatalog');
export type DiagramPartKind = 'data' | 'layout' | 'quickStyle' | 'colors' | 'drawing';
export interface DiagramPartRecord {
    readonly kind: DiagramPartKind;
    readonly partName: string;
    readonly relationshipId?: string;
    readonly contentType: string;
    readonly relationshipType: string;
    /** Model or view instance. */
    readonly part: DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing;
}
export interface SmartArtRecord {
    readonly id: string;
    readonly diagram: SmartArtDiagram;
    /** Package part names keyed by role. */
    readonly partNames: {
        readonly data: string;
        readonly layout: string;
        readonly quickStyle: string;
        readonly colors: string;
        readonly drawing?: string;
    };
}

/**
 * Minimal package mutation view for applyToPackage.
 * Hosts (docx) implement this against their OPC layer.
 */
export interface PackageView {
    /** Upsert part bytes. */
    putPart(partName: string, contentType: string, bytes: Uint8Array): void;
    /** Optional: remove part. */
    removePart?(partName: string): void;
    /** Optional: ensure relationship. */
    ensureRelationship?(sourcePartName: string, relationshipId: string, relationshipType: string, target: string): void;
}
export interface ApplyToPackageOptions {
    /**
     * Encode ElementTree → UTF-8 bytes. Required when a dirty part lacks originalBytes.
     */
    encodeXml: (tree: ElementNode) => Uint8Array;
    /** When true, remove parts not referenced by any SmartArtRecord (orphan-GC). */
    garbageCollectOrphans?: boolean;
}
export interface ApplyToPackageResult {
    readonly written: string[];
    readonly reusedBytes: string[];
    readonly removed: string[];
}
/**
 * The content type for.
 *
 * @param {DiagramPartKind} kind - The kind.
 * @returns {string} The result.
 */
function contentTypeFor(kind: DiagramPartKind): string {
    switch (kind) {
    case 'data':
        return DIAGRAM_DATA_CONTENT_TYPE;
    case 'layout':
        return DIAGRAM_LAYOUT_CONTENT_TYPE;
    case 'quickStyle':
        return DIAGRAM_QUICK_STYLE_CONTENT_TYPE;
    case 'colors':
        return DIAGRAM_COLORS_CONTENT_TYPE;
    case 'drawing':
        return DIAGRAM_DRAWING_CONTENT_TYPE;
    }
}
/**
 * The relationship type for.
 *
 * @param {DiagramPartKind} kind - The kind.
 * @returns {string} The result.
 */
function relationshipTypeFor(kind: DiagramPartKind): string {
    switch (kind) {
    case 'data':
        return DIAGRAM_DATA_RELATIONSHIP_TYPE;
    case 'layout':
        return DIAGRAM_LAYOUT_RELATIONSHIP_TYPE;
    case 'quickStyle':
        return DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE;
    case 'colors':
        return DIAGRAM_COLORS_RELATIONSHIP_TYPE;
    case 'drawing':
        return DIAGRAM_DRAWING_RELATIONSHIP_TYPE;
    }
}
/**
 * The is dirty part.
 *
 * @param {DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing} part - The part.
 * @returns {boolean} The result.
 */
function isDirtyPart(part: DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing): boolean {
    return part.dirty;
}
/**
 * The original bytes of.
 *
 * @param {DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing} part - The part.
 * @returns {Uint8Array | null} The result.
 */
function originalBytesOf(part: DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing): Uint8Array | null {
    return part.originalBytes;
}
/**
 * The serialize part.
 *
 * @param {DiagramPartKind} kind - The kind.
 * @param {DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing} part - The part.
 * @returns {ElementNode} The result.
 */
function serializePart(
    kind: DiagramPartKind,
    part: DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing
): ElementNode {
    switch (kind) {
    case 'data':
        return serializeDiagramData(part as DiagramDataModel);
    case 'layout':
        return serializeDiagramLayout(part as DiagramLayout);
    case 'quickStyle':
        return serializeDiagramQuickStyle(part as DiagramQuickStyle);
    case 'colors':
        return serializeDiagramColors(part as DiagramColors);
    case 'drawing':
        return serializeDiagramDrawing(part as DiagramDrawing);
    }
}
/**
 * The clear part dirty.
 *
 * @param {DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing} part - The part.
 * @param {Uint8Array} bytes - The bytes.
 * @returns {void} Nothing is returned.
 */
function clearPartDirty(
    part: DiagramDataModel | DiagramLayout | DiagramQuickStyle | DiagramColors | DiagramDrawing,
    bytes: Uint8Array
): void {
    part.clearDirty(bytes);
}
export class SmartArtCatalog {
    readonly [CATALOG_BRAND]: Literal<true> = true;
    private readonly _parts: Map<string, DiagramPartRecord> = new Map<string, DiagramPartRecord>();
    private readonly _smartArts: Map<string, SmartArtRecord> = new Map<string, SmartArtRecord>();
    private _seq: number = 0;
    get parts(): ReadonlyArray<DiagramPartRecord> {
        return [...this._parts.values()];
    }
    get smartArts(): ReadonlyArray<SmartArtRecord> {
        return [...this._smartArts.values()];
    }
    partCount(): number {
        return this._parts.size;
    }
    smartArtCount(): number {
        return this._smartArts.size;
    }
    getPart(partName: string): DiagramPartRecord | undefined {
        return this._parts.get(partName);
    }
    getSmartArt(id: string): SmartArtRecord | undefined {
        return this._smartArts.get(id);
    }
    registerPart(record: DiagramPartRecord): void {
        this._parts.set(record.partName, {
            ...record,
            contentType: record.contentType || contentTypeFor(record.kind),
            relationshipType: record.relationshipType || relationshipTypeFor(record.kind)
        });
    }
    registerSmartArt(record: SmartArtRecord): void {
        this._smartArts.set(record.id, record);
    }

    /**
     * Allocate a new SmartArt id and register the diagram + its parts.
     *
     * @param {SmartArtDiagram} diagram - The diagram.
     * @param {*} partNames - The part names.
     * @param {string | undefined} id - The id.
     * @returns {SmartArtRecord} The result.
     */
    addSmartArt(diagram: SmartArtDiagram, partNames: SmartArtRecord['partNames'], id?: string): SmartArtRecord {
        const sid: string = id != null ? id : `smartart-${String(++this._seq)}`;
        if (this._smartArts.has(sid)) {
            throw new DiagramError('catalog_error', `SmartArt id already exists: ${sid}`);
        }
        const rec: SmartArtRecord = {
            id: sid,
            diagram,
            partNames
        };
        this._smartArts.set(sid, rec);
        const ensure: (kind: DiagramPartKind, name: string, part: DiagramPartValue) => void =
            (kind: DiagramPartKind, name: string, part: DiagramPartValue): void => {
                if (!this._parts.has(name)) {
                    this.registerPart({
                        kind,
                        partName: name,
                        contentType: contentTypeFor(kind),
                        relationshipType: relationshipTypeFor(kind),
                        part
                    });
                }
            };
        ensure('data', partNames.data, diagram.data());
        ensure('layout', partNames.layout, diagram.layout());
        ensure('quickStyle', partNames.quickStyle, diagram.quickStyle());
        ensure('colors', partNames.colors, diagram.colors());
        const drawingPart: DiagramDrawing = diagram.drawing();
        if (partNames.drawing && drawingPart) {
            ensure('drawing', partNames.drawing, drawingPart);
        }
        return rec;
    }
    removeSmartArt(id: string): void {
        this._smartArts.delete(id);
    }

    /**
     * Deep-clone a SmartArt instance with optional modelId remap prefix.
     * Registers the clone under a new id; parts get new names when `partNamePrefix` set.
     *
     * @param {string} id - The id.
     * @param {object | undefined} options - The options.
     * @returns {SmartArtRecord} The result.
     */
    cloneSmartArt(id: string, options?: {
        newId?: string;
        partNamePrefix?: string;
        modelIdPrefix?: string;
    }): SmartArtRecord {
        const src: SmartArtRecord = this._smartArts.get(id);
        if (!src) {
            throw new DiagramError('catalog_error', `SmartArt not found: ${id}`);
        }
        const cloned: SmartArtDiagram = src.diagram.clone();
        if (options == null ? void 0 : options.modelIdPrefix) {
            const prefix: string = options.modelIdPrefix;
            const data: DiagramDataModel = cloned.data();
            for (const p of data.points) {
                (p as {
                    modelId: string;
                }).modelId = prefix + p.modelId;
            }
            for (const c of data.connections) {
                (c as {
                    modelId: string;
                }).modelId = prefix + c.modelId;
                (c as {
                    srcId: string;
                }).srcId = prefix + c.srcId;
                (c as {
                    destId: string;
                }).destId = prefix + c.destId;
                if (c.parTransId !== '0') {
                    (c as {
                        parTransId: string;
                    }).parTransId = prefix + c.parTransId;
                }
                if (c.sibTransId !== '0') {
                    (c as {
                        sibTransId: string;
                    }).sibTransId = prefix + c.sibTransId;
                }
                data.markDirty();
            }
        }
        const pfx: string = function (): string {
            const _nc: string = options == null ? void 0 : options.partNamePrefix;
            return _nc != null ? _nc : `cloned/${id}/`;
        }();
        const partNames: SmartArtRecord['partNames'] = {
            data: `${pfx}data.xml`,
            layout: `${pfx}layout.xml`,
            quickStyle: `${pfx}quickStyle.xml`,
            colors: `${pfx}colors.xml`,
            ...(src.partNames.drawing ? {
                drawing: `${pfx}drawing.xml`
            } : {})
        };
        return this.addSmartArt(cloned, partNames, options == null ? void 0 : options.newId);
    }

    /**
     * Parts referenced by at least one SmartArtRecord.
     *
     * @returns {Set<string>} The result.
     */
    referencedPartNames(): Set<string> {
        const set: Set<string> = new Set<string>();
        for (const s of this._smartArts.values()) {
            set.add(s.partNames.data);
            set.add(s.partNames.layout);
            set.add(s.partNames.quickStyle);
            set.add(s.partNames.colors);
            if (s.partNames.drawing) {set.add(s.partNames.drawing); }
        }
        return set;
    }

    /**
     * Remove part records not referenced by any SmartArt (in-memory orphan-GC).
     *
     * @returns {string[]} The result.
     */
    garbageCollectOrphans(): string[] {
        const ref: Set<string> = this.referencedPartNames();
        const removed: string[] = [];
        for (const name of [...this._parts.keys()]) {
            if (!ref.has(name)) {
                this._parts.delete(name);
                removed.push(name);
            }
        }
        return removed;
    }

    /**
     * Apply dirty (or all) parts to a PackageView.
     * Clean parts with originalBytes reuse bytes (D14).
     *
     * @param {PackageView} pkg - The pkg.
     * @param {ApplyToPackageOptions} options - The options.
     * @returns {ApplyToPackageResult} The result.
     */
    applyToPackage(pkg: PackageView, options: ApplyToPackageOptions): ApplyToPackageResult {
        const written: string[] = [];
        const reusedBytes: string[] = [];
        const removed: string[] = [];

        // Sync part map from smart arts (model identity may share).
        for (const s of this._smartArts.values()) {
            const d: SmartArtDiagram = s.diagram;
            this.registerPart({
                kind: 'data',
                partName: s.partNames.data,
                contentType: DIAGRAM_DATA_CONTENT_TYPE,
                relationshipType: DIAGRAM_DATA_RELATIONSHIP_TYPE,
                part: d.data()
            });
            this.registerPart({
                kind: 'layout',
                partName: s.partNames.layout,
                contentType: DIAGRAM_LAYOUT_CONTENT_TYPE,
                relationshipType: DIAGRAM_LAYOUT_RELATIONSHIP_TYPE,
                part: d.layout()
            });
            this.registerPart({
                kind: 'quickStyle',
                partName: s.partNames.quickStyle,
                contentType: DIAGRAM_QUICK_STYLE_CONTENT_TYPE,
                relationshipType: DIAGRAM_QUICK_STYLE_RELATIONSHIP_TYPE,
                part: d.quickStyle()
            });
            this.registerPart({
                kind: 'colors',
                partName: s.partNames.colors,
                contentType: DIAGRAM_COLORS_CONTENT_TYPE,
                relationshipType: DIAGRAM_COLORS_RELATIONSHIP_TYPE,
                part: d.colors()
            });
            const drawingPart: DiagramDrawing = d.drawing();
            if (s.partNames.drawing && drawingPart) {
                this.registerPart({
                    kind: 'drawing',
                    partName: s.partNames.drawing,
                    contentType: DIAGRAM_DRAWING_CONTENT_TYPE,
                    relationshipType: DIAGRAM_DRAWING_RELATIONSHIP_TYPE,
                    part: drawingPart
                });
            }
        }
        for (const rec of this._parts.values()) {
            const dirty: boolean = isDirtyPart(rec.part);
            const orig: Uint8Array = originalBytesOf(rec.part);
            let bytes: Uint8Array;
            if (!dirty && orig) {
                bytes = orig;
                reusedBytes.push(rec.partName);
            } else {
                const tree: ElementNode = serializePart(rec.kind, rec.part);
                bytes = options.encodeXml(tree);
                written.push(rec.partName);
            }
            pkg.putPart(rec.partName, rec.contentType, bytes);
            clearPartDirty(rec.part, bytes);
        }
        if (options.garbageCollectOrphans) {
            const gone: string[] = this.garbageCollectOrphans();
            for (const name of gone) {
                if (pkg.removePart != null) {
                    pkg.removePart(name);
                }
                removed.push(name);
            }
        }
        return {
            written,
            reusedBytes,
            removed
        };
    }
}
/**
 * The is smart art catalog.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 */
export function isSmartArtCatalog(value: unknown): value is SmartArtCatalog {
    return value instanceof SmartArtCatalog;
}

/**
 * Build DiagramRelIds helper for tests/hosts.
 *
 * @param {string} dm - The dm.
 * @param {string} lo - The lo.
 * @param {string} qs - The qs.
 * @param {string} cs - The cs.
 * @returns {DiagramRelIds} The result.
 */
export function relIds(dm: string, lo: string, qs: string, cs: string): DiagramRelIds {
    return {
        dm,
        lo,
        qs,
        cs
    };
}
