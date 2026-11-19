/**
 * Interface for undo/redo integration from chart overlays.
 */
export interface IUndoRedoHost {
    saveUndoSnapshot(actionName: string, eventArgs: object): void;
    saveRedoSnapshot(actionName: string, eventArgs: object): void;
    isEnabled?(): boolean;
}
