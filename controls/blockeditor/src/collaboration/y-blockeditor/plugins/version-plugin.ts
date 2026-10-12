import * as Y from '../yjs-types';
import { InternalYRuntime, VersionHistoryOptions } from '../base/interface';
import { Collaboration } from '../base/collaboration';
import { BlockModel } from '../../../models/block/block-model';
import { yVersionHistoryKey } from './keys';
import { VersionHistorySettingsModel } from '../../../models/collaboration/version-history-settings-model';
import { VersionSnapshot, ExportedVersion, VersionDiff, SnapshotOptions, IVersionHistory } from '../../../models/interface';
import { SnapshotCreatedEventArgs, SnapshotRestoredEventArgs } from '../../../models/eventargs';
import { Conversion } from '../utils/conversion';
import { BlockManager } from '../../../block-manager/base/block-manager';
import { CollaborationSettingsModel } from '../../../models/collaboration/collaboration-settings-model';

const MAX_SNAPSHOT_INTERVAL_MS: number = 60000; // 1 minute (fallback safety net)
const MIN_CHANGES_BETWEEN_SNAPSHOTS: number = 1; // 1 (Prevents empty snapshots)

export class VersionHistory implements IVersionHistory {
    private blockManager: BlockManager;
    public settings: CollaborationSettingsModel;
    private yDoc: Y.Doc;
    private yFragment: Y.XmlFragment;
    private collabManager: Collaboration;
    private vhSettings: VersionHistorySettingsModel;
    private YRuntime: InternalYRuntime;

    private snapshots: VersionSnapshot[] = [];
    private changesSinceSnapshot: number = 0;
    private isDestroyed: boolean = false;

    private debounceTimer: ReturnType<typeof setTimeout> | null = null;
    private safetyNetTimer: ReturnType<typeof setInterval> | null = null;
    private observeDeepFn: (events: Y.YEvent<any>[], tr: Y.Transaction) => void;
    private initPromise: Promise<void>;

    /**
     * Initializes the version history module
     *
     * @param {BlockManager} blockManager - The manager instance
     * @param {CollaborationSettingsModel} settings - The Collaboration settings
     * @returns {void}
     * @hidden
     */
    public initialize(blockManager: BlockManager, settings: CollaborationSettingsModel): void {
        this.blockManager = blockManager;
        this.collabManager = this.blockManager.collaborationModule;
        this.settings = settings;
        this.yDoc = this.settings.adapter.yXmlFragment.doc;
        this.yFragment = this.settings.adapter.yXmlFragment;
        this.vhSettings = this.settings.versionHistory;
        this.YRuntime = this.collabManager.getYRuntime();

        this.observeDeepFn = this.onYjsChange.bind(this);

        this.initPromise = this.loadFromStorage();
        this.setupObserver();
        this.setupSafetyNetTimer();
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the module name.
     * @private
     */
    public getModuleName(): string {
        return 'versionHistory';
    }

    /**
     * Resolves when version history initialization completes.
     *
     * @returns {Promise<void>} - The promise
     */
    public whenReady = (): Promise<void> => {
        return this.initPromise;
    }

    /**
     * Captures the current document state as a named snapshot.
     *
     * @param {SnapshotOptions} options - Options for creating snapshots
     * @returns {Promise<VersionSnapshot>} - The created snapshot.
     */
    public createSnapshot = async (options?: SnapshotOptions): Promise<VersionSnapshot> => {
        const snapshot: VersionSnapshot = {
            id: this.generateId(),
            lastModifiedAt: Date.now(),
            lastModifiedBy: (options ? options.modifiedBy : null) || this.blockManager.currentUserId,
            label: options ? options.label : '',
            documentState: this.YRuntime.encodeStateAsUpdate(this.yDoc)
        };

        this.snapshots.push(snapshot);
        this.changesSinceSnapshot = 0;

        await this.vhSettings.storage.saveSnapshot(snapshot);

        if (this.vhSettings.snapshotCreated) {
            const args: SnapshotCreatedEventArgs = { snapshot };
            this.vhSettings.snapshotCreated.call(this, args);
        }

        return snapshot;
    }

    /**
     * Renames an existing snapshot.
     *
     * @param {string} snapshotId - Snapshot ID.
     * @param {string} newLabel - Updated snapshot label.
     * @returns {Promise<VersionSnapshot>} - Updated snapshot.
     */
    public renameSnapshot = async (
        snapshotId: string,
        newLabel: string
    ): Promise<VersionSnapshot> => {
        const normalizedLabel: string = newLabel.trim();
        const snapshot: VersionSnapshot = this.snapshots.find((snap: VersionSnapshot) => snap.id === snapshotId);
        if (!snapshot) { throw new Error(`Snapshot with id "${snapshotId}" not found`); }

        const updatedSnapshot: VersionSnapshot = {
            ...snapshot,
            label: normalizedLabel
        };

        const index: number = this.snapshots.findIndex((snap: VersionSnapshot) => snap.id === snapshotId);
        this.snapshots[index as number] = updatedSnapshot;

        await this.vhSettings.storage.saveSnapshot(updatedSnapshot);

        return updatedSnapshot;
    }

    /**
     * Restores the document to a previously saved snapshot.
     * A 'restore-point' backup is automatically created before applying the snapshot.
     *
     * @param {string} versionId - ID of the snapshot to restore.
     * @returns {Promise<VersionSnapshot>} - The backup snapshot created before restore.
     */
    public restoreSnapshot = async (versionId: string): Promise<VersionSnapshot> => {
        const target: VersionSnapshot = this.snapshots.find((s: VersionSnapshot) => s.id === versionId);
        if (!target) { return Promise.reject(new Error(`Snapshot not found: ${versionId}`)); }

        const backup: VersionSnapshot = await this.createSnapshot({
            label: `Before restore to: ${(target.label || target.id)}`,
            modifiedBy: this.blockManager.currentUserId
        });

        const tempDoc: Y.Doc = new this.YRuntime.Doc();
        this.YRuntime.applyUpdate(tempDoc, target.documentState);
        const tempFragment: Y.XmlFragment = tempDoc.getXmlFragment('blockeditor');

        // Convert temp fragment → BlockModels → new YElements, then swap into live doc
        const conversion: Conversion = this.collabManager.syncBinding.conversion;
        const blocks: BlockModel[] = conversion.yFragmentToBlocks(tempFragment);

        this.yDoc.transact((): void => {
            if (this.yFragment.length > 0) {
                this.yFragment.delete(0, this.yFragment.length);
            }
            const yElements: Y.XmlElement[] = blocks.map(
                (block: BlockModel): Y.XmlElement => conversion.blockModelToYElement(block)
            );
            if (yElements.length > 0) {
                this.yFragment.push(yElements);
            }
        }, yVersionHistoryKey);

        tempDoc.destroy();

        if (this.vhSettings.snapshotRestored) {
            const args: SnapshotRestoredEventArgs = {
                snapshot: target,
                backupSnapshot: backup
            };
            this.vhSettings.snapshotRestored.call(this, args);
        }

        return backup;
    }

    /**
     * Returns snapshots ordered from newest to oldest.
     *
     * Supports pagination for large version histories.
     *
     * @param {number} limit - Maximum number of results to return.
     * @param {number} offset - Number of results to skip from the start.
     * @returns {VersionSnapshot[]} - Ordered list of matching snapshots (newest first).
     */
    public getSnapshots = (limit: number = 50, offset: number = 0): VersionSnapshot[] => {
        const list: VersionSnapshot[] = this.snapshots.slice();

        // Most recent first
        list.sort((a: VersionSnapshot, b: VersionSnapshot): number => b.lastModifiedAt - a.lastModifiedAt);

        return list.slice(offset, offset + limit);
    }

    /**
     * Computes a structural diff summary between two snapshots.
     *
     * @param {string} versionIdA - ID of the first (earlier) snapshot.
     * @param {string} versionIdB - ID of the second (later) snapshot.
     * @returns {VersionDiff | null} - Diff summary, or null if either snapshot is not found.
     */
    public compareVersions = (versionIdA: string, versionIdB: string): VersionDiff | null => {
        const snapA: VersionSnapshot | undefined = this.snapshots.find(
            (s: VersionSnapshot): boolean => s.id === versionIdA
        );
        const snapB: VersionSnapshot | undefined = this.snapshots.find(
            (s: VersionSnapshot): boolean => s.id === versionIdB
        );

        if (!snapA || !snapB) {
            return null;
        }

        const docA: Y.Doc = new this.YRuntime.Doc();
        const docB: Y.Doc = new this.YRuntime.Doc();

        this.YRuntime.applyUpdate(docA, snapA.documentState);
        this.YRuntime.applyUpdate(docB, snapB.documentState);

        const fragA: Y.XmlFragment = docA.getXmlFragment('blockeditor');
        const fragB: Y.XmlFragment = docB.getXmlFragment('blockeditor');

        const lengthA: number = this.computeFragmentLength(fragA);
        const lengthB: number = this.computeFragmentLength(fragB);

        const diff: VersionDiff = {
            blockCountDelta: fragB.length - fragA.length,
            lengthDelta: lengthB - lengthA,
            timestampDelta: snapB.lastModifiedAt - snapA.lastModifiedAt,
            labelA: snapA.label,
            labelB: snapB.label
        };

        docA.destroy();
        docB.destroy();

        return diff;
    }

    /**
     * Permanently deletes a snapshot from memory and storage.
     *
     * @param {string} versionId - ID of the snapshot to delete.
     * @returns {Promise<void>} The promise
     */
    public deleteSnapshot = async (versionId: string): Promise<void> => {
        const index: number = this.snapshots.findIndex(
            (s: VersionSnapshot): boolean => s.id === versionId
        );

        if (index === -1) {
            return;
        }

        this.snapshots.splice(index, 1);
        await this.vhSettings.storage.deleteSnapshot(versionId);
    }

    /**
     * Applies pyramid retention: prunes old snapshots while keeping
     * meaningful milestones (user-labelled or explicitly tagged).
     *
     * Retention tiers (from most recent):
     *   - Last 1 hour  : keep all
     *   - Last 24 hours: keep one per hour
     *   - Last 7 days  : keep one per day
     *   - Last 30 days : keep one per week
     *   - Older        : delete (unless user-labelled)
     *
     * @returns {Promise<number>} - Number of snapshots removed.
     */
    public pruneVersions = async (): Promise<number> => {
        const now: number = Date.now();
        const HOUR: number = 60 * 60 * 1000;
        const DAY: number = 24 * HOUR;
        const WEEK: number = 7 * DAY;
        const MONTH: number = 30 * DAY;

        const toDelete: VersionSnapshot[] = [];
        // Buckets: key = bucket string, value = snapshot chosen to represent that bucket
        const hourBucket: Map<string, VersionSnapshot> = new Map();
        const dayBucket: Map<string, VersionSnapshot> = new Map();
        const weekBucket: Map<string, VersionSnapshot> = new Map();

        // Sort DESCENDING (newest first)
        const sorted: VersionSnapshot[] = this.snapshots.slice().sort(
            (a: VersionSnapshot, b: VersionSnapshot): number => b.lastModifiedAt - a.lastModifiedAt
        );

        for (const snap of sorted) {
            const age: number = now - snap.lastModifiedAt;

            if (age <= HOUR) {
                // Tier 1 — keep everything
                continue;
            }

            if (age <= DAY) {
                // Tier 2 — keep one per hour slot
                const bucket: string = this.toHourBucket(snap.lastModifiedAt);
                if (hourBucket.has(bucket)) {
                    toDelete.push(snap);
                } else {
                    hourBucket.set(bucket, snap);
                }
                continue;
            }

            if (age <= WEEK) {
                // Tier 3 — keep one per day slot
                const bucket: string = this.toDayBucket(snap.lastModifiedAt);
                if (dayBucket.has(bucket)) {
                    toDelete.push(snap);
                } else {
                    dayBucket.set(bucket, snap);
                }
                continue;
            }

            if (age <= MONTH) {
                // Tier 4 — keep one per week slot
                const bucket: string = this.toWeekBucket(snap.lastModifiedAt);
                if (weekBucket.has(bucket)) {
                    toDelete.push(snap);
                } else {
                    weekBucket.set(bucket, snap);
                }
                continue;
            }

            const isUserLabelled: boolean = snap.label && snap.label.length > 0;

            // Older than 30 days — delete (unless user-labelled)
            if (!isUserLabelled) {
                toDelete.push(snap);
            }
        }

        this.snapshots = this.snapshots.filter((snap: VersionSnapshot) => toDelete.indexOf(snap) === -1);
        for (const snap of toDelete) {
            await this.vhSettings.storage.deleteSnapshot(snap.id);
        }

        return toDelete.length;
    }

    /**
     * Exports a snapshot to a JSON-serialisable object (documentState as base64).
     *
     * @param {string} versionId - ID of the snapshot to export.
     * @returns {ExportedVersion | null} - Exported object, or null when not found.
     */
    public exportSnapshot = (versionId: string): ExportedVersion | null => {
        const snap: VersionSnapshot = this.snapshots.find((s: VersionSnapshot) => s.id === versionId);
        if (!snap) { return null; }

        const binaryStr: string = Array.from(snap.documentState)
            .map((byte: number): string => String.fromCharCode(byte))
            .join('');

        return {
            snapshot: snap,
            stateUpdateBase64: btoa(binaryStr)
        };
    }

    /**
     * Imports a previously exported snapshot into memory and storage.
     *
     * @param {ExportedVersion} exported - The exported version object.
     * @returns {Promise<VersionSnapshot>} - The imported snapshot.
     */
    public importSnapshot = async (exported: ExportedVersion): Promise<VersionSnapshot> => {
        const binaryStr: string = atob(exported.stateUpdateBase64);
        const documentState: Uint8Array = new Uint8Array(binaryStr.length);
        for (let i: number = 0; i < binaryStr.length; i++) {
            documentState[i as number] = binaryStr.charCodeAt(i);
        }

        const snapshot: VersionSnapshot = {
            id: exported.snapshot.id,
            lastModifiedAt: exported.snapshot.lastModifiedAt,
            lastModifiedBy: exported.snapshot.lastModifiedBy,
            label: exported.snapshot.label,
            documentState: documentState
        };

        this.snapshots.push(snapshot);
        await this.vhSettings.storage.saveSnapshot(snapshot);

        return snapshot;
    }

    /**
     * Returns the total number of snapshots currently held in memory.
     *
     * @returns {number} - Snapshot count.
     */
    public getSnapshotCount(): number {
        return this.snapshots.length;
    }

    /**
     * Cleans up all timers and observers.  Call when the editor is destroyed.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;

        this.yFragment.unobserveDeep(this.observeDeepFn);

        if (this.debounceTimer !== null) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        if (this.safetyNetTimer !== null) {
            clearInterval(this.safetyNetTimer);
            this.safetyNetTimer = null;
        }
    }

    private setupObserver(): void {
        this.yFragment.observeDeep(this.observeDeepFn);
    }

    private onYjsChange(events: Y.YEvent<any>[], tr: Y.Transaction): void {
        // Ignore version-control transactions to avoid recursive snapshots
        if (tr.origin === yVersionHistoryKey) {
            return;
        }

        // Tier 1 — only structural block operations trigger the debounce
        const isStructural: boolean = this.hasStructuralChange(events);

        if (isStructural) {
            this.changesSinceSnapshot++;
            this.scheduleDebouncedSnapshot();
        }
    }

    private hasStructuralChange(events: Y.YEvent<any>[]): boolean {
        for (const event of events) {
            const isRootLevel: boolean = event.target === this.collabManager.adapter.yXmlFragment;
            const isNestedLevel: boolean = event.target instanceof this.YRuntime.XmlElement;
            // XmlEvent on XmlElement or XmlFragment with childList delta => structural
            if (isRootLevel || isNestedLevel) {
                const changes: any = (event as Y.XmlEvent).changes;
                if (changes && changes.delta && (changes.delta).length > 0) {
                    const delta: Y.XmlDelta = changes.delta;
                    const hasInsertOrDelete: boolean = delta.some(
                        (op: Y.XmlDeltaItem): boolean => op.insert !== undefined || op.delete !== undefined
                    );
                    if (hasInsertOrDelete) {
                        return true;
                    }
                }
                // Attribute change on a block element (type transform, indent, etc.)
                if (changes && changes.keys && (changes.keys as Map<string, any>).size > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private scheduleDebouncedSnapshot(): void {
        if (this.debounceTimer !== null) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout((): void => {
            this.debounceTimer = null;
            if (!this.isDestroyed) {
                this.createSnapshot();
            }
        }, this.vhSettings.snapshotInterval);
    }

    private setupSafetyNetTimer(): void {
        this.safetyNetTimer = setInterval(() => {
            this.handleSafetyNetCheck();
        }, MAX_SNAPSHOT_INTERVAL_MS);
    }

    private handleSafetyNetCheck(): void {
        if (this.isDestroyed) { return; }

        if (this.changesSinceSnapshot >= MIN_CHANGES_BETWEEN_SNAPSHOTS) {
            if (this.debounceTimer !== null) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }

            this.createSnapshot();
        }
    }

    private loadFromStorage = async (): Promise<void> => {
        const loaded: VersionSnapshot[] = await this.vhSettings.storage.loadAllSnapshots();
        this.snapshots = loaded;
    }

    private generateId(): string {
        return 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
    }

    private computeFragmentLength(fragment: Y.XmlFragment): number {
        let total: number = 0;
        const children: (Y.XmlElement | Y.XmlText)[] = fragment.toArray();

        for (const child of children) {
            if (child instanceof this.YRuntime.XmlText) {
                total += (child as Y.XmlText).length;
            } else if (child instanceof this.YRuntime.XmlElement) {
                total += this.computeElementLength(child as Y.XmlElement);
            }
        }

        return total;
    }

    private computeElementLength(element: Y.XmlElement): number {
        let total: number = 0;
        const children: (Y.XmlElement | Y.XmlText)[] = element.toArray();

        for (const child of children) {
            if (child instanceof this.YRuntime.XmlText) {
                total += (child as Y.XmlText).length;
            } else if (child instanceof this.YRuntime.XmlElement) {
                total += this.computeElementLength(child as Y.XmlElement);
            }
        }

        return total;
    }

    private toHourBucket(lastModifiedAt: number): string {
        const d: Date = new Date(lastModifiedAt);
        return d.getFullYear() + '-' +
            this.pad(d.getMonth() + 1) + '-' +
            this.pad(d.getDate()) + 'T' +
            this.pad(d.getHours());
    }

    private toDayBucket(lastModifiedAt: number): string {
        const d: Date = new Date(lastModifiedAt);
        return d.getFullYear() + '-' +
            this.pad(d.getMonth() + 1) + '-' +
            this.pad(d.getDate());
    }

    private toWeekBucket(lastModifiedAt: number): string {
        const d: Date = new Date(lastModifiedAt);
        // ISO week: Monday-based, year + week number
        const thursday: Date = new Date(d.getTime());
        thursday.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
        const firstThursday: Date = new Date(thursday.getFullYear(), 0, 4);
        const week: number = 1 + Math.round(
            ((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
        );
        return thursday.getFullYear() + '-W' + this.pad(week);
    }

    private pad(n: number): string {
        return n < 10 ? '0' + n : String(n);
    }
}
