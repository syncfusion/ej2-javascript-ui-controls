import { ChildProperty, EmitType, Event, Property } from '@syncfusion/ej2-base';
import { IVersionStorage, VersionSnapshot } from '../../models/interface';
import { SnapshotCreatedEventArgs, SnapshotRestoredEventArgs } from '../eventargs';

/**
 * Interface for a class VersionHistorySettings
 */
export class VersionHistorySettings extends ChildProperty<VersionHistorySettings> {

    /**
     * Storage backend that persists snapshots.
     * The app must implement `IVersionStorage` and supply it here.
     *
     * @default null
     */
    @Property(null)
    public storage: IVersionStorage;

    /**
     * Snapshot interval in milliseconds after a structural change.
     * Multiple changes within this window are batched into one snapshot.
     *
     * @default 3000 (3 seconds)
     */
    @Property(3000)
    public snapshotInterval: number;

    /**
     * Callback invoked after every snapshot is created.
     *
     * @event snapshotCreated
     */
    @Event()
    public snapshotCreated: EmitType<SnapshotCreatedEventArgs>;

    /**
     * Callback invoked after a snapshot is restored.
     *
     * @event snapshotRestored
     */
    @Event()
    public snapshotRestored: EmitType<SnapshotRestoredEventArgs>;
}
