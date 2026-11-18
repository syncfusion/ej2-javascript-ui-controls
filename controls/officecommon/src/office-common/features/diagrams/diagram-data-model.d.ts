/**
 * DiagramDataModel — CT_DataModel view/API.
 *
 * Citations:
 * - dml-diagram.xsd CT_DataModel, CT_Pt, CT_Cxn, ST_PtType, ST_CxnType, ST_ModelId
 * - Requirement docs/requirements/smart-art-diagrams.md §12 (maintenance API)
 * - ECMA-376 DrawingML diagram data part
 */
import { Literal } from '../../core/literal-type';
import { ElementNode } from './element-tree';
declare const DIAGRAM_DATA_MODEL_BRAND: unique symbol;
/** ST_PtType (dml-diagram.xsd). Default: node. */
export declare type DiagramPointType = 'node' | 'asst' | 'doc' | 'pres' | 'parTrans' | 'sibTrans';
/**
 * ST_CxnType (dml-diagram.xsd). XSD default: **parOf**.
 * (Some narrative docs say presOf; implementers MUST use XSD default parOf.)
 */
export declare type DiagramConnectionType = 'parOf' | 'presOf' | 'presParOf' | 'unknownRelationship';
/** ST_ModelId: int or GUID string as stored in markup. */
export declare type ModelId = string;
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
 * Mutable CT_DataModel graph.
 * Identity: `instanceof DiagramDataModel` and brand symbol.
 */
export declare class DiagramDataModel {
    readonly [DIAGRAM_DATA_MODEL_BRAND]: Literal<true>;
    private readonly _points;
    private readonly _connections;
    private _background;
    private _whole;
    private _extLst;
    private _dirty;
    /** Optional original part bytes when loaded clean (D14). */
    private _originalBytes;
    constructor(init?: DiagramDataModelInit);
    readonly dirty: boolean;
    /**
     * Mark dirty and drop original bytes (must reserialize).
     *
     * @returns {void} Nothing is returned.
     */
    markDirty(): void;
    /**
     * Clear dirty after successful apply; optionally stash bytes.
     *
     * @param {Uint8Array | null | undefined} originalBytes - The original bytes.
     * @returns {void} Nothing is returned.
     */
    clearDirty(originalBytes?: Uint8Array | null): void;
    readonly originalBytes: Uint8Array | null;
    setOriginalBytes(bytes: Uint8Array | null): void;
    readonly points: ReadonlyArray<DiagramPoint>;
    readonly connections: ReadonlyArray<DiagramConnection>;
    background: ElementNode | null;
    whole: ElementNode | null;
    extLst: ElementNode | null;
    pointCount(): number;
    connectionCount(): number;
    getPoint(modelId: ModelId): DiagramPoint | undefined;
    getConnection(modelId: ModelId): DiagramConnection | undefined;
    /**
     * Document point (`type=doc`) if present — typically the root of the logical tree.
     *
     * @returns {DiagramPoint | undefined} The result.
     */
    documentPoint(): DiagramPoint | undefined;
    /**
     * Child node points under `parentId` via parOf connections, ordered by srcOrd.
     * Requirement §12 hierarchy helpers.
     *
     * @param {ModelId} parentId - The parent id.
     * @returns {DiagramPoint[]} The result.
     */
    childrenOf(parentId: ModelId): DiagramPoint[];
    /**
     * Parent via reverse parOf (first match).
     *
     * @param {ModelId} nodeId - The node id.
     * @returns {DiagramPoint | undefined} The result.
     */
    parentOf(nodeId: ModelId): DiagramPoint | undefined;
    /**
     * Replace text content of the point's `t` (dgm:t / a:t shape) body fragment.
     * If no body/`t` exists, creates a minimal text body hook for the serializer.
     * Requirement §12 setNodeText.
     *
     * @param {ModelId} modelId - The model id.
     * @param {string} value - The value.
     * @returns {void} Nothing is returned.
     */
    setNodeText(modelId: ModelId, value: string): void;
    /**
     * Read text from point body (`t` localName preferred).
     *
     * @param {ModelId} modelId - The model id.
     * @returns {string | undefined} The result.
     */
    getNodeText(modelId: ModelId): string | undefined;
    addPoint(props: DiagramPointProps): DiagramPoint;
    addConnection(props: DiagramConnectionProps): DiagramConnection;
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
    };
    /**
     * Remove a node and its incident connections (and optionally subtree).
     * When `recursive` is true, removes descendants via parOf.
     *
     * @param {ModelId} modelId - The model id.
     * @param {boolean} recursive - The recursive.
     * @returns {void} Nothing is returned.
     */
    removeNode(modelId: ModelId, recursive?: boolean): void;
    /**
     * Deep clone of the model (new instance, dirty=false unless copyDirty).
     *
     * @param {object | undefined} options - The options.
     * @returns {DiagramDataModel} The result.
     */
    clone(options?: {
        copyDirty?: boolean;
    }): DiagramDataModel;
}
/**
 * The is diagram data model.
 *
 * @param {unknown} value - The value.
 * @returns {boolean} The result.
 * @private
 */
export declare function isDiagramDataModel(value: unknown): value is DiagramDataModel;
export {};
