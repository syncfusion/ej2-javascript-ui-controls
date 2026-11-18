/**
 * DiagramDataModel — CT_DataModel view/API.
 *
 * Citations:
 * - dml-diagram.xsd CT_DataModel, CT_Pt, CT_Cxn, ST_PtType, ST_CxnType, ST_ModelId
 * - Requirement docs/requirements/smart-art-diagrams.md §12 (maintenance API)
 * - ECMA-376 DrawingML diagram data part
 */

import { Literal } from '../../core/literal-type';
import { MAX_DIAGRAM_CONNECTIONS, MAX_DIAGRAM_POINTS } from './constants';
import { ElementNode, ElementChild } from './element-tree';
import { cloneElement } from './element-tree';
import { DiagramModelError } from './errors';
const DIAGRAM_DATA_MODEL_BRAND: unique symbol = Symbol.for('@syncfusion/ej2-office-common.DiagramDataModel');

/** ST_PtType (dml-diagram.xsd). Default: node. */
export type DiagramPointType = 'node' | 'asst' | 'doc' | 'pres' | 'parTrans' | 'sibTrans';

/**
 * ST_CxnType (dml-diagram.xsd). XSD default: **parOf**.
 * (Some narrative docs say presOf; implementers MUST use XSD default parOf.)
 */
export type DiagramConnectionType = 'parOf' | 'presOf' | 'presParOf' | 'unknownRelationship';

/** ST_ModelId: int or GUID string as stored in markup. */
export type ModelId = string;
export interface DiagramPointProps {
    readonly modelId: ModelId;
    /** Default `node` per XSD. */
    readonly type?: DiagramPointType;
    /** Default `"0"` per XSD cxnId. */
    readonly cxnId?: ModelId;
    /**
     * Opaque element-tree fragment for prSet / spPr / t / extLst children
     * preserved for round-trip. Callers of setNodeText replace text under `t`.
     */
    readonly body?: ElementNode | null;
}
export interface DiagramConnectionProps {
    readonly modelId: ModelId;
    /** Default `parOf` per XSD. */
    readonly type?: DiagramConnectionType;
    readonly srcId: ModelId;
    readonly destId: ModelId;
    readonly srcOrd: number;
    readonly destOrd: number;
    readonly parTransId?: ModelId;
    readonly sibTransId?: ModelId;
    readonly presId?: string;
    readonly body?: ElementNode | null;
}
export interface DiagramPoint {
    modelId: ModelId;
    type: DiagramPointType;
    cxnId: ModelId;
    /** Mutable body subtree (prSet/spPr/t/extLst). */
    body: ElementNode | null;
}
export interface DiagramConnection {
    modelId: ModelId;
    type: DiagramConnectionType;
    srcId: ModelId;
    destId: ModelId;
    srcOrd: number;
    destOrd: number;
    parTransId: ModelId;
    sibTransId: ModelId;
    presId: string;
    body: ElementNode | null;
}
export interface DiagramDataModelInit {
    readonly points?: ReadonlyArray<DiagramPointProps>;
    readonly connections?: ReadonlyArray<DiagramConnectionProps>;
    /** bg / whole / extLst preserved as opaque trees. */
    readonly background?: ElementNode | null;
    readonly whole?: ElementNode | null;
    readonly extLst?: ElementNode | null;
}
/**
 * The clone body.
 *
 * @param {ElementNode | null | undefined} body - The body.
 * @returns {ElementNode | null} The result.
 */
function cloneBody(body: ElementNode | null | undefined): ElementNode | null {
    if (body == null) {return null; }
    return cloneElement(body);
}
/**
 * The normalize point.
 *
 * @param {DiagramPointProps} p - The p.
 * @returns {DiagramPoint} The result.
 */
function normalizePoint(p: DiagramPointProps): DiagramPoint {
    return {
        modelId: p.modelId,
        type: p.type != null ? p.type : 'node',
        cxnId: p.cxnId != null ? p.cxnId : '0',
        body: cloneBody(p.body)
    };
}
/**
 * The normalize connection.
 *
 * @param {DiagramConnectionProps} c - The c.
 * @returns {DiagramConnection} The result.
 */
function normalizeConnection(c: DiagramConnectionProps): DiagramConnection {
    return {
        modelId: c.modelId,
        type: c.type != null ? c.type : 'parOf',
        srcId: c.srcId,
        destId: c.destId,
        srcOrd: c.srcOrd,
        destOrd: c.destOrd,
        parTransId: c.parTransId != null ? c.parTransId : '0',
        sibTransId: c.sibTransId != null ? c.sibTransId : '0',
        presId: c.presId != null ? c.presId : '',
        body: cloneBody(c.body)
    };
}

/**
 * Mutable CT_DataModel graph.
 * Identity: `instanceof DiagramDataModel` and brand symbol.
 */
export class DiagramDataModel {
    readonly [DIAGRAM_DATA_MODEL_BRAND]: Literal<true> = true;
    private readonly _points: DiagramPoint[] = [];
    private readonly _connections: DiagramConnection[] = [];
    private _background: ElementNode | null;
    private _whole: ElementNode | null;
    private _extLst: ElementNode | null;
    private _dirty: boolean = false;
    /** Optional original part bytes when loaded clean (D14). */
    private _originalBytes: Uint8Array | null = null;
    constructor(init: DiagramDataModelInit = {}) {
        const points: ReadonlyArray<DiagramPointProps> = init.points != null ? init.points : [];
        const connections: ReadonlyArray<DiagramConnectionProps> = init.connections != null ? init.connections : [];
        if (points.length > MAX_DIAGRAM_POINTS) {
            throw new DiagramModelError('limit_exceeded', `Point count ${String(points.length)} exceeds MAX_DIAGRAM_POINTS (${String(MAX_DIAGRAM_POINTS)}).`);
        }
        if (connections.length > MAX_DIAGRAM_CONNECTIONS) {
            throw new DiagramModelError('limit_exceeded', `Connection count ${String(connections.length)} exceeds MAX_DIAGRAM_CONNECTIONS (${String(MAX_DIAGRAM_CONNECTIONS)}).`);
        }
        for (const p of points) {this._points.push(normalizePoint(p)); }
        for (const c of connections) {this._connections.push(normalizeConnection(c)); }
        this._background = cloneBody(init.background);
        this._whole = cloneBody(init.whole);
        this._extLst = cloneBody(init.extLst);
    }
    get dirty(): boolean {
        return this._dirty;
    }

    /**
     * Mark dirty and drop original bytes (must reserialize).
     *
     * @returns {void} Nothing is returned.
     */
    markDirty(): void {
        this._dirty = true;
        this._originalBytes = null;
    }

    /**
     * Clear dirty after successful apply; optionally stash bytes.
     *
     * @param {Uint8Array | null | undefined} originalBytes - The original bytes.
     * @returns {void} Nothing is returned.
     */
    clearDirty(originalBytes?: Uint8Array | null): void {
        this._dirty = false;
        this._originalBytes = originalBytes != null ? originalBytes : null;
    }
    get originalBytes(): Uint8Array | null {
        return this._originalBytes;
    }
    setOriginalBytes(bytes: Uint8Array | null): void {
        this._originalBytes = bytes;
    }
    get points(): ReadonlyArray<DiagramPoint> {
        return this._points;
    }
    get connections(): ReadonlyArray<DiagramConnection> {
        return this._connections;
    }
    get background(): ElementNode | null {
        return this._background;
    }
    set background(value: ElementNode | null) {
        this._background = cloneBody(value);
        this.markDirty();
    }
    get whole(): ElementNode | null {
        return this._whole;
    }
    set whole(value: ElementNode | null) {
        this._whole = cloneBody(value);
        this.markDirty();
    }
    get extLst(): ElementNode | null {
        return this._extLst;
    }
    set extLst(value: ElementNode | null) {
        this._extLst = cloneBody(value);
        this.markDirty();
    }
    pointCount(): number {
        return this._points.length;
    }
    connectionCount(): number {
        return this._connections.length;
    }
    getPoint(modelId: ModelId): DiagramPoint | undefined {
        return this._points.find((p: DiagramPoint) => p.modelId === modelId);
    }
    getConnection(modelId: ModelId): DiagramConnection | undefined {
        return this._connections.find((c: DiagramConnection) => c.modelId === modelId);
    }

    /**
     * Document point (`type=doc`) if present — typically the root of the logical tree.
     *
     * @returns {DiagramPoint | undefined} The result.
     */
    documentPoint(): DiagramPoint | undefined {
        return this._points.find((p: DiagramPoint) => p.type === 'doc');
    }

    /**
     * Child node points under `parentId` via parOf connections, ordered by srcOrd.
     * Requirement §12 hierarchy helpers.
     *
     * @param {ModelId} parentId - The parent id.
     * @returns {DiagramPoint[]} The result.
     */
    childrenOf(parentId: ModelId): DiagramPoint[] {
        const links: DiagramConnection[] = this._connections.filter((c: DiagramConnection) => c.type === 'parOf' && c.srcId === parentId).slice().sort((a: DiagramConnection, b: DiagramConnection) => a.srcOrd - b.srcOrd);
        const out: DiagramPoint[] = [];
        for (const link of links) {
            const pt: DiagramPoint = this.getPoint(link.destId);
            if (pt) {out.push(pt); }
        }
        return out;
    }

    /**
     * Parent via reverse parOf (first match).
     *
     * @param {ModelId} nodeId - The node id.
     * @returns {DiagramPoint | undefined} The result.
     */
    parentOf(nodeId: ModelId): DiagramPoint | undefined {
        const link: DiagramConnection = this._connections.find((c: DiagramConnection) => c.type === 'parOf' && c.destId === nodeId);
        if (!link) {return undefined; }
        return this.getPoint(link.srcId);
    }

    /**
     * Replace text content of the point's `t` (dgm:t / a:t shape) body fragment.
     * If no body/`t` exists, creates a minimal text body hook for the serializer.
     * Requirement §12 setNodeText.
     *
     * @param {ModelId} modelId - The model id.
     * @param {string} value - The value.
     * @returns {void} Nothing is returned.
     */
    setNodeText(modelId: ModelId, value: string): void {
        const pt: DiagramPoint = this.getPoint(modelId);
        if (!pt) {
            throw new DiagramModelError('unknown_point', `No point with modelId=${modelId}.`);
        }
        // Store text as a synthetic body element `t` with a text child.
        // Parsers preserve full dgm:t trees when present; this API replaces/creates.
        pt.body = { kind: 'element',
            localName: 't',
            namespaceUri: null,
            attributes: [],
            children: [{ kind: 'text', text: value
            }]
        };
        this.markDirty();
    }

    /**
     * Read text from point body (`t` localName preferred).
     *
     * @param {ModelId} modelId - The model id.
     * @returns {string | undefined} The result.
     */
    getNodeText(modelId: ModelId): string | undefined {
        const pt: DiagramPoint = this.getPoint(modelId);
        if (!(pt == null ? void 0 : pt.body)) {return undefined; }
        if (pt.body.localName === 't') {
            return pt.body.children.map((c: ElementChild) => c.kind === 'text' ? c.text : '').join('');
        }
        // Search first t descendant.
        const stack: ElementNode[] = [pt.body];
        while (stack.length > 0) {
            const n: ElementNode = stack.pop();
            if (n === undefined) {break; }
            if (n.localName === 't') {
                return n.children.map((c: ElementChild) => c.kind === 'text' ? c.text : '').join('');
            }
            for (const c of n.children) {
                if (c.kind === 'element') {stack.push(c); }
            }
        }
        return undefined;
    }
    addPoint(props: DiagramPointProps): DiagramPoint {
        if (this._points.length >= MAX_DIAGRAM_POINTS) {
            throw new DiagramModelError('limit_exceeded', `Cannot add point: MAX_DIAGRAM_POINTS (${String(MAX_DIAGRAM_POINTS)}) reached.`);
        }
        if (this._points.some((p: DiagramPoint) => p.modelId === props.modelId)) {
            throw new DiagramModelError('inconsistent_graph', `Duplicate point modelId=${props.modelId}.`);
        }
        const pt: DiagramPoint = normalizePoint(props);
        this._points.push(pt);
        this.markDirty();
        return pt;
    }
    addConnection(props: DiagramConnectionProps): DiagramConnection {
        if (this._connections.length >= MAX_DIAGRAM_CONNECTIONS) {
            throw new DiagramModelError('limit_exceeded', `Cannot add connection: MAX_DIAGRAM_CONNECTIONS (${String(MAX_DIAGRAM_CONNECTIONS)}) reached.`);
        }
        if (this._connections.some((c: DiagramConnection) => c.modelId === props.modelId)) {
            throw new DiagramModelError('inconsistent_graph', `Duplicate connection modelId=${props.modelId}.`);
        }
        const cxn: DiagramConnection = normalizeConnection(props);
        this._connections.push(cxn);
        this.markDirty();
        return cxn;
    }

    /**
     * Append a child node under parent via parOf.
     * Creates point + connection; assigns next srcOrd.
     *
     * @param {ModelId} parentId - The parent id.
     * @param {DiagramPointProps} child - The child.
     * @param {ModelId} connectionModelId - The connection model id.
     * @returns {object} The result.
     */
    appendChild(parentId: ModelId, child: DiagramPointProps, connectionModelId: ModelId): {
        point: DiagramPoint;
        connection: DiagramConnection;
    } {
        if (!this.getPoint(parentId)) {
            throw new DiagramModelError('unknown_point', `Parent modelId=${parentId} not found.`);
        }
        const siblings: DiagramConnection[] = this._connections.filter((c: DiagramConnection) => c.type === 'parOf' && c.srcId === parentId);
        const nextOrd: number = siblings.length === 0 ? 0 : Math.max(...siblings.map((s: DiagramConnection) => s.srcOrd)) + 1;
        const point: DiagramPoint = this.addPoint(child);
        const connection: DiagramConnection = this.addConnection({
            modelId: connectionModelId,
            type: 'parOf',
            srcId: parentId,
            destId: child.modelId,
            srcOrd: nextOrd,
            destOrd: 0
        });
        return {
            point,
            connection
        };
    }

    /**
     * Remove a node and its incident connections (and optionally subtree).
     * When `recursive` is true, removes descendants via parOf.
     *
     * @param {ModelId} modelId - The model id.
     * @param {boolean} recursive - The recursive.
     * @returns {void} Nothing is returned.
     */
    removeNode(modelId: ModelId, recursive: boolean = true): void {
        if (!this.getPoint(modelId)) {
            throw new DiagramModelError('unknown_point', `No point with modelId=${modelId}.`);
        }
        const toRemove: Set<string> = new Set<ModelId>();
        const visit: (id: ModelId) => void = (id: ModelId): void => {
            if (toRemove.has(id)) {return; }
            toRemove.add(id);
            if (!recursive) {return; }
            for (const c of this._connections) {
                if (c.type === 'parOf' && c.srcId === id) {visit(c.destId); }
            }
        };
        visit(modelId);
        for (const c of this._connections.slice().reverse()) {
            if (c === undefined) {continue; }
            if (toRemove.has(c.srcId) || toRemove.has(c.destId) || toRemove.has(c.modelId)) {
                this._connections.splice(this._connections.indexOf(c), 1);
            }
        }
        for (const p of this._points.slice().reverse()) {
            if (p !== undefined && toRemove.has(p.modelId)) {
                this._points.splice(this._points.indexOf(p), 1);
            }
        }
        this.markDirty();
    }

    /**
     * Deep clone of the model (new instance, dirty=false unless copyDirty).
     *
     * @param {object | undefined} options - The options.
     * @returns {DiagramDataModel} The result.
     */
    clone(options?: {
        copyDirty?: boolean;
    }): DiagramDataModel {
        const m: DiagramDataModel = new DiagramDataModel({
            points: this._points.map((p: DiagramPoint) => ({
                modelId: p.modelId,
                type: p.type,
                cxnId: p.cxnId,
                body: p.body
            })),
            connections: this._connections.map((c: DiagramConnection) => ({
                modelId: c.modelId,
                type: c.type,
                srcId: c.srcId,
                destId: c.destId,
                srcOrd: c.srcOrd,
                destOrd: c.destOrd,
                parTransId: c.parTransId,
                sibTransId: c.sibTransId,
                presId: c.presId,
                body: c.body
            })),
            background: this._background,
            whole: this._whole,
            extLst: this._extLst
        });
        if ((options == null ? void 0 : options.copyDirty) && this._dirty) {
            m.markDirty();
        } else if (this._originalBytes && !this._dirty) {
            m.setOriginalBytes(this._originalBytes);
            m.clearDirty(this._originalBytes);
        }
        return m;
    }
}

/**
 * The is diagram data model.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export function isDiagramDataModel(value: unknown): value is DiagramDataModel {
    return value instanceof DiagramDataModel;
}
