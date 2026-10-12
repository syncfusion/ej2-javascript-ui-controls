import { ItemModel } from '@syncfusion/ej2-navigations';
import { BlockType, CommandName } from './enums';

/**
 * Represents the configuration of inline toolbar items.
 */
export interface IToolbarItemModel extends ItemModel {
    command: CommandName;
    iconCss?: string;
}

/**
 * Represents the configuration of transform blocks
 */
export interface TransformItemModel {
    type: BlockType;
    id: string;
    disabled?: boolean;
    iconCss: string;
    label: string;
    shortcut: string;
    tooltip: string;
}

/* Collaboration Start */
export type CollaborationAdapter = YjsAdapter;

export interface YjsAdapter {
    /**
     * Specifies the Yjs XmlFragment that represents the editor's blocks.
     * This is where the document structure is stored.
     *
     */
    yXmlFragment: any;

    /**
     * Specifies the Yjs instance that has been created on application end
     *
     */
    yRuntime: any;
}

/**
 * Represents a single point-in-time snapshot of the document state.
 */
export interface VersionSnapshot {
    /** Unique identifier for this snapshot. */
    id: string;
    /** Unix timestamp (ms) when the snapshot was last modified. */
    lastModifiedAt: number;
    /** Unique ID of the User who triggered the save. */
    lastModifiedBy: string;
    /** Optional user-provided label (e.g., "Before restructure"). */
    label: string;
    /** Full Yjs state encoded as a byte array. */
    documentState: Uint8Array;
}

/**
 * Storage backend contract.  The BlockEditor library is storage-agnostic;
 * implement this interface to persist snapshots wherever needed.
 */
export interface IVersionStorage {
    /** Persist a snapshot. */
    saveSnapshot(snapshot: VersionSnapshot): Promise<void>;
    /** Load all persisted snapshots, ordered by timestamp ascending. */
    loadAllSnapshots(): Promise<VersionSnapshot[]>;
    /** Load a single snapshot by id. */
    loadSnapshot(id: string): Promise<VersionSnapshot | null>;
    /** Permanently remove a snapshot by id. */
    deleteSnapshot(id: string): Promise<void>;
    /** Remove all snapshots from storage. */
    clearAll(): Promise<void>;
}

/**
 * Summary of differences between two snapshots.
 */
export interface VersionDiff {
    /** Change in block count (positive = blocks added). */
    blockCountDelta: number;
    /** Change in total character count. */
    lengthDelta: number;
    /** Time elapsed between the two snapshots in ms. */
    timestampDelta: number;
    /** Label of snapshot A. */
    labelA: string;
    /** Label of snapshot B. */
    labelB: string;
}

/**
 * A snapshot encoded for JSON transport (stateUpdate as base64).
 */
export interface ExportedVersion {
    /** The snapshot metadata. */
    snapshot: VersionSnapshot;
    /** Binary stateUpdate encoded as base64 string. */
    stateUpdateBase64: string;
}

export interface SnapshotOptions {
    /** Optional user-provided label for the snapshot. */
    label?: string
    /** Unique ID of the User who triggered the save. */
    modifiedBy?: string
}

/**
 * Defines the public API for managing version history snapshots
 * within the collaborative BlockEditor.
 */
export interface IVersionHistory {

    /**
     * Creates a new snapshot of the current editor state.
     *
     * The snapshot stores the current collaborative document state
     * along with optional metadata such as label and author details.
     *
     * @param {SnapshotOptions} options - Snapshot creation options.
     * @returns {Promise<VersionSnapshot>} - The created snapshot.
     */
    createSnapshot(
        options?: SnapshotOptions
    ): Promise<VersionSnapshot>;

    /**
     * Restores the editor content from an existing snapshot.
     *
     * This replaces the current collaborative document state
     * with the snapshot's stored state.
     *
     * @param {string} snapshotId - ID of the snapshot to restore.
     * @returns {Promise<VersionSnapshot>} - Resolves when restore completes.
     */
    restoreSnapshot(
        snapshotId: string
    ): Promise<VersionSnapshot>;

    /**
     * Deletes an existing snapshot permanently.
     *
     * @param {string} snapshotId - ID of the snapshot to delete.
     * @returns {Promise<void>} - Resolves when deletion completes.
     */
    deleteSnapshot(
        snapshotId: string
    ): Promise<void>;

    /**
     * Renames an existing snapshot.
     *
     * Only snapshot metadata is updated. The stored document state
     * remains unchanged.
     *
     * @param {string} snapshotId - ID of the snapshot to rename.
     * @param {string} newLabel - Updated snapshot label.
     * @returns {Promise<VersionSnapshot>} - The updated snapshot.
     */
    renameSnapshot(
        snapshotId: string,
        newLabel: string
    ): Promise<VersionSnapshot>;

    /**
     * Returns all snapshots ordered from newest to oldest.
     *
     * Supports pagination for large version histories.
     *
     * @param {number} limit - Maximum number of results to return.
     * @param {number} offset - Number of results to skip from the start.
     * @returns {VersionSnapshot[]} - Ordered list of matching snapshots (newest first).
     */
    getSnapshots(limit?: number, offset?: number): VersionSnapshot[];

    /**
     * Exports a snapshot into a serializable object.
     *
     * The exported object can later be imported into another editor
     * instance or persisted externally.
     *
     * @param {string} snapshotId - ID of the snapshot to export.
     * @returns {ExportedVersion | null} - Exported snapshot object.
     */
    exportSnapshot(
        snapshotId: string
    ): ExportedVersion | null;

    /**
     * Imports a previously exported snapshot into the editor's
     * version history storage.
     *
     * @param {ExportedVersion} exported - Exported snapshot object.
     * @returns {Promise<VersionSnapshot>} - Imported snapshot.
     */
    importSnapshot(
        exported: ExportedVersion
    ): Promise<VersionSnapshot>;

    /**
     * Removes old snapshots using the configured retention strategy.
     *
     * The pruning process keeps recent and meaningful snapshots
     * while removing outdated snapshots automatically.
     *
     * @returns {Promise<number>} - Number of removed snapshots.
     */
    pruneVersions(): Promise<number>;
}
/* Collaboration End */
