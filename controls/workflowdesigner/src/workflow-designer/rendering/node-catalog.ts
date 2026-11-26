import { WorkflowStepType } from '../models/workflow-enums';

/**
 * Approved catalog category for a workflow step type.
 *
 * @private
 */
export interface WorkflowNodeCatalogEntry {
    stepType: WorkflowStepType;
    label: string;
    category: string;
    icon: string;
    isTrigger: boolean;
    /** Identifier of the custom step definition, set only for entries of the Custom category. */
    customStepId?: string;
    /** Tooltip text of a custom step. */
    description?: string;
}

/**
 * Source-defined node catalog. The catalog is a presentation model derived from
 * `WorkflowStepType`; it is distinct from the type union and never exposes a
 * Diagram object. It groups approved step types into approved
 * categories with localized labels and type-specific Syncfusion e-icon classes.
 *
 * the Node Collection renders entries from this
 * catalog. Trigger filtering at middle-insertion points uses `isTrigger`
 * (triggers cannot have an incoming connection).
 *
 * @internal
 * @private
 */
export class WorkflowNodeCatalog {
    /**
     * Returns the immutable list of catalog entries.
     *
     * @returns {WorkflowNodeCatalogEntry[]} The catalog entries.
     * @private
     */
    public static getEntries(): WorkflowNodeCatalogEntry[] {
        return WorkflowNodeCatalog.ENTRIES.slice();
    }

    /**
     * Returns entries valid for the first-step insertion point: triggers only.
     *
     * @returns {WorkflowNodeCatalogEntry[]} The trigger entries.
     * @private
     */
    public static getTriggerEntries(): WorkflowNodeCatalogEntry[] {
        return WorkflowNodeCatalog.ENTRIES.filter((e: WorkflowNodeCatalogEntry) => e.isTrigger);
    }

    /**
     * Returns entries valid for a middle insertion point (non-trigger only).
     *
     * @returns {WorkflowNodeCatalogEntry[]} The non-trigger entries.
     * @private
     */
    public static getNonTriggerEntries(): WorkflowNodeCatalogEntry[] {
        return WorkflowNodeCatalog.ENTRIES.filter((e: WorkflowNodeCatalogEntry) => !e.isTrigger);
    }

    /**
     * Returns the entry for a step type, or null when not found.
     *
     * @param {WorkflowStepType} stepType The step type to find.
     * @returns {WorkflowNodeCatalogEntry|null} The matching catalog entry.
     * @private
     */
    public static getEntry(stepType: WorkflowStepType): WorkflowNodeCatalogEntry | null {
        return WorkflowNodeCatalog.ENTRIES.find((e: WorkflowNodeCatalogEntry) => e.stepType === stepType) || null;
    }

    private static readonly ENTRIES: WorkflowNodeCatalogEntry[] = [
        { stepType: 'ManualTrigger', label: 'Manual Trigger', category: 'Triggers', icon: 'e-play', isTrigger: true },
        { stepType: 'ScheduledTrigger', label: 'Scheduled Trigger', category: 'Triggers', icon: 'e-clock', isTrigger: true },
        { stepType: 'WebhookTrigger', label: 'Webhook Trigger', category: 'Triggers', icon: 'e-link', isTrigger: true },
        { stepType: 'FormInputTrigger', label: 'Form Input Trigger', category: 'Triggers', icon: 'e-form-field', isTrigger: true },
        { stepType: 'SetVariable', label: 'Set Variable', category: 'Actions', icon: 'e-code-view', isTrigger: false },
        { stepType: 'Filter', label: 'Filter', category: 'Actions', icon: 'e-filter', isTrigger: false },
        { stepType: 'Sort', label: 'Sort', category: 'Actions', icon: 'e-sorting-1', isTrigger: false },
        { stepType: 'ApiRequest', label: 'API Request', category: 'Actions', icon: 'e-web-layout', isTrigger: false },
        { stepType: 'Delay', label: 'Delay', category: 'Flow', icon: 'e-pause', isTrigger: false },
        { stepType: 'Condition', label: 'Condition', category: 'Flow', icon: 'e-conditional-formatting', isTrigger: false },
        { stepType: 'Switch', label: 'Switch', category: 'Flow', icon: 'e-swap-arrow', isTrigger: false },
        { stepType: 'Loop', label: 'Loop', category: 'Flow', icon: 'e-repeat', isTrigger: false },
        { stepType: 'Approve', label: 'Approve', category: 'Human', icon: 'e-check', isTrigger: false },
        { stepType: 'Notify', label: 'Notify', category: 'Human', icon: 'e-comment-show', isTrigger: false },
        { stepType: 'AI', label: 'AI', category: 'AI', icon: 'e-magic-wand', isTrigger: false },
        { stepType: 'Formatter', label: 'Formatter', category: 'Output', icon: 'e-text-form', isTrigger: false },
        { stepType: 'Custom', label: 'Custom', category: 'Custom', icon: 'e-border-custom', isTrigger: false },
        { stepType: 'End', label: 'End', category: 'Output', icon: 'e-stop-rectangle', isTrigger: false }
    ];
}
