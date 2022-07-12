import { SelectorModel } from '../objects/node-model';
import { ConnectorModel } from '../objects/connector-model';
import { NodeModel, PhaseModel } from '../objects/node-model';
import { DiagramModel } from '../diagram-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { PointPortModel } from '../objects/port-model';
import { EntryType, EntryChangeType, EntryCategory, DiagramHistoryAction, HistoryEntryType } from '../enum/enum';
import { DiagramElement } from '../core/elements/diagram-element';
/**
 * Interface for a class HistoryEntry
 */
export interface HistoryEntry {

    /**
     * Sets the type of the entry to be stored
     */
    type?: EntryType;
    /**
     * Sets the changed values to be stored
     */
    redoObject?: NodeModel | ConnectorModel | SelectorModel | DiagramModel;
    /**
     * Sets the changed values to be stored
     */
    undoObject?: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotation | PathAnnotation | PointPortModel;
    /**
     * Sets the changed values to be stored in table
     */
    childTable?: {};
    /**
     * Sets the category for the entry
     */
    category?: EntryCategory;
    /**
     * Sets the next the current object
     */
    next?: HistoryEntry;
    /**
     * Sets the previous of the current object
     */
    previous?: HistoryEntry;

    /**
     * Sets the type of the object is added or remove
     */
    changeType?: EntryChangeType;
    /**
     * Set the value for undo action is activated
     */
    isUndo?: boolean;
    /**
     * Used to stored the entry or not
     */
    cancel?: boolean;
    /**
     * Used to stored the which annotation or port to be changed
     */
    objectId?: string;
    /**
     * Used to indicate last phase to be changed.
     */
    isLastPhase?: boolean;
    /**
     * Used to stored the previous phase.
     */
    previousPhase?: PhaseModel;
    /**
     * Used to stored the added node cause.
     * @blazorType object
     */
    historyAction?: DiagramHistoryAction;

    /**
     * Used to define the object type that is to be added into the entry.
     */
    blazorHistoryEntryType?: HistoryEntryType

}

export interface History {
    /**
     * set the history entry can be undo
     */
    canUndo?: boolean;
    /**
     * Set the history entry can be redo
     */
    canRedo?: boolean;
    /**
     *  Set the current entry object
     */
    currentEntry?: HistoryEntry;
    /**
     * Stores a history entry to history list
     */
    push?: Function;
    /**
     * Used for custom undo option
     */
    undo?: Function;
    /**
     * Used for custom redo option
     */
    redo?: Function;
    /**
     * Used to intimate the group action is start
     */
    startGroupAction?: Function;
    /**
     * Used to intimate the group action is end
     */
    endGroupAction?: Function;
    /**
     * Used to decide to stored the changes to history
     */
    canLog?: Function;
    /**
     * Used to store the undoStack
     */
    undoStack?: HistoryEntry[];
    /**
     * Used to store the redostack
     */
    redoStack?: HistoryEntry[];
    /**
     * Used to restrict or limits the number of history entry will be stored on the history list
     *
     * @deprecated
     */
    stackLimit?: number;
}
