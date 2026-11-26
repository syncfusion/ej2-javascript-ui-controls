import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the property panel, which is used to configure the selected workflow step.
 * Selecting a sticky note does not open the property panel.
 */
export class WorkflowPropertyPanelSettings extends ChildProperty<WorkflowPropertyPanelSettings> {
    /**
     * Defines whether the property panel is displayed. When `false`, the panel never opens.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines whether selecting a step with a single click opens the property panel. When `false`
     * (the default), double-click a step or connection, or press Enter, to open it; once the panel is
     * open it follows the selection.
     *
     * @default false
     */
    @Property(false)
    public openOnStepSelection: boolean;
}
