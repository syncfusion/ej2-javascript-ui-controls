import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Interface for a class WorkflowPropertyPanelSettings
 */
export interface WorkflowPropertyPanelSettingsModel {

    /**
     * Defines whether the property panel is displayed. When `false`, the panel never opens.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Defines whether selecting a step with a single click opens the property panel. When `false`
     * (the default), double-click a step or connection, or press Enter, to open it; once the panel is
     * open it follows the selection.
     *
     * @default false
     */
    openOnStepSelection?: boolean;

}