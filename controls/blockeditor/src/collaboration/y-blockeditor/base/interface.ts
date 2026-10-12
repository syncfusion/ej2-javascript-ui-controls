import * as Y from '../yjs-types';
import { UserModel } from '../../../models/common/user-model';
import { BlockManager } from '../../../block-manager/base/block-manager';
import { Collaboration } from '../base/collaboration';
import { VersionSnapshot } from '../../../models/interface';
import { VersionHistorySettingsModel } from '../../../models/collaboration/version-history-settings-model';

export type YBlock = Y.XmlElement;

/**
 * Configuration options for the sync plugin
 */
export interface SyncPluginOptions {
    parent: Collaboration;
    blockManager: BlockManager;
    yBlocks: Y.XmlFragment;
}

/**
 * Configuration options for the cursor plugin
 */
export interface CursorPluginOptions {
    parent: Collaboration;
    blockManager: BlockManager;
    awareness: Y.Awareness;
}

/**
 * Configuration options for the undo plugin
 */
export interface UndoPluginOptions {
    parent: Collaboration;
    blockManager: BlockManager;
    yXmlFragment: Y.XmlFragment;
    trackedOrigins?: Set<any>;
    captureTimeout?: number;
    maxStackSize?: number;
}

/**
 * Color definition for cursors
 */
export interface DerivedColor {
    selection: string;
    caret: string;
}

/**
 * Cursor state stored in awareness
 */
export interface CursorState {
    anchor: Y.RelativePosition | null;
    head: Y.RelativePosition | null;
}

/**
 * Full awareness state for a user
 */
export interface AwarenessState {
    user: UserModel;
    cursor: CursorState | null;
}

/**
 * Absolute position in the BlockEditor document
 */
export interface AbsolutePosition {
    blockIndex: number;
    blockId: string;
    offset: number;
    segmentIndex?: number;
    parentId?: string;
    rowIndex?: number;
    colIndex?: number;
}

/**
 * Selection range in the BlockEditor
 */
export interface SelectionRange {
    anchor: AbsolutePosition;
    head: AbsolutePosition;
}

/**
 * Decoration for a remote cursor
 */
export interface CursorDecoration {
    clientId: number;
    user: UserModel;
    cursor: CursorState;
    element?: HTMLElement;
    selectionElement?: HTMLElement;
}

/**
 * Result of a simple text diff
 */
export interface SimpleDiffResult {
    /** Index where the change starts */
    index: number;
    /** Number of characters to remove */
    remove: number;
    /** Text to insert at the index */
    insert: string;
}

/**
 * Flattened attributes that can be applied to a range in Y.XmlText / Y.Text
 * These are the keys/values broadcast via yText.format() and received in deltas.
 *
 */
export interface YTextAttributes {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    inlineCode?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
    color?: string;
    backgroundColor?: string;
    url?: string;
    labelId?: string;
    userId?: string;
}

export type DeltaAnalysis = {
    inserts: Array<{ id: string; yElement: Y.XmlElement; index: number }>;
    deletes: Array<{ id: string; index: number }>;
    moves: Array<{ id: string; toIndex: number }>;
    transforms: Array<{ id: string; yElement: Y.XmlElement; index: number }>;
};

export interface DomPosition {
    node: Node;
    offset: number;
}

/**
 * Delta operation from Y.XmlText event
 */
export interface DeltaOp {
    retain?: number;
    insert?: string;
    delete?: number;
    attributes?: YTextAttributes;
}

/**
 * Result of applying delta operations
 */
export interface DeltaApplyResult {
    success: boolean;
    offsetBefore: number;
    offsetAfter: number;
    mutations: MutationInfo[];
    error?: string;
}

/**
 * Information about a single DOM mutation
 */
export interface MutationInfo {
    type: 'insert' | 'delete' | 'format';
    offset: number;
    length?: number;
    content?: string;
    tagName?: string;
}

export interface TextNodePosition {
    node: Text;
    offsetInContainer: number;
    offsetInNode: number;
}

export interface ParentBlockContext {
    parentBlockId: string,
    yContainer: Y.XmlElement,
    containerType: 'callout' | 'table-cell' | 'quote' | 'collapsible'
}

export interface OffsetMap {
    startOffset: number;
    endOffset: number;
    length: number
}

export interface YjsDelta {
    insert?: string | any[];
    delete?: number;
    retain?: number;
    attributes?: Record<string, any> | null;
}

export type XmlElement = (Y.XmlElement | Y.XmlText)

export interface StackItem {
    meta: Map<any, any>;
    insertions?: any;
    deletions?: any;
}

export interface YUndoManagerEvent {
    stackItem: StackItem;
    origin?: any;
    transaction?: any;
    type?: 'undo' | 'redo';
}

/**
 * Snapshot of a Table's Yjs children taken before a remote transaction.
 * Used to resolve correct indices for remote deletions.
 */
export interface TableSnapshot {
    columnIds: string[];
    rowIds: string[];
}

export interface InternalYRuntime {
    Doc: typeof Y.Doc;
    XmlElement: typeof Y.XmlElement;
    XmlText: typeof Y.XmlText;
    AbstractType: typeof Y.AbstractType;
    UndoManager: typeof Y.UndoManager;
    encodeStateAsUpdate: typeof Y.encodeStateAsUpdate;
    applyUpdate: typeof Y.applyUpdate;
    createRelativePositionFromTypeIndex: typeof Y.createRelativePositionFromTypeIndex;
    createAbsolutePositionFromRelativePosition: typeof Y.createAbsolutePositionFromRelativePosition;
}

// ─────────────────────────────────────────────────────────────────────────────
// Version History Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Constructor options for VersionHistory.
 */
export interface VersionHistoryOptions {
    yDoc: Y.Doc;
    yXmlFragment: Y.XmlFragment;
    parent: Collaboration;
    vhSettings: VersionHistorySettingsModel;
}

export interface YBlockLocation {
    node: Y.XmlElement;
    parent: Y.XmlElement | Y.XmlFragment;
    index: number;
}
