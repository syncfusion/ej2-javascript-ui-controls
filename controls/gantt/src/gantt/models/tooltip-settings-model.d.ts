import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables tooltip of Gantt element.
     * @default true
     */
    showTooltip?: boolean;

    /**
     * Defines tooltip template for taskbar elements.
     * @default null
     */
    taskbar?: string;

    /**
     * Defines template for baseline tooltip element.
     * @default null
     */
    baseline?: string;

    /**
     * Defines template for dependency line tooltip.
     * @default null
     */
    connectorLine?: string;

    /**
     * Defines tooltip template for taskbar editing action.
     * @default null
     */
    editing?: string;

}