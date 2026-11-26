import { WorkflowConnectionDecorator, WorkflowConnectionType } from './workflow-enums';
import { WorkflowConnectionStyle } from './workflow-style';

/**
 * Defines a configurable directed connection between two workflow steps.
 */
export interface WorkflowConnection {
    /**
     * Defines the unique identifier of the workflow connection.
     *
     * The identifier must be unique across workflow steps, workflow
     * connections and sticky notes.
     *
     * @default ''
     */
    id?: string;

    /**
     * Defines the identifier of the source workflow step.
     *
     * @default ''
     */
    sourceStepId?: string;

    /**
     * Defines the identifier of the target workflow step.
     *
     * @default ''
     */
    targetStepId?: string;

    /**
     * Defines the source output port name.
     *
     * @default 'output'
     */
    sourcePort?: string;

    /**
     * Defines the target input port name. Every step has a single `'input'` port, so this is
     * always `'input'`; it is kept in the saved JSON so more input ports can be added later.
     *
     * @default 'input'
     * @private
     */
    targetPort?: string;

    /**
     * Defines the connector label.
     *
     * @default ''
     */
    label?: string;

    /**
     * Defines the connector geometry type.
     *
     * @default 'Orthogonal'
     */
    type?: WorkflowConnectionType;

    /**
     * Defines the decorator displayed at the source end of the connection.
     *
     * @default 'None'
     * @private
     */
    sourceDecorator?: WorkflowConnectionDecorator;

    /**
     * Defines the decorator displayed at the target end of the connection.
     *
     * @default 'Arrow'
     * @private
     */
    targetDecorator?: WorkflowConnectionDecorator;

    /**
     * Defines the visual style of the workflow connection.
     *
     * @default {}
     * @private
     */
    style?: WorkflowConnectionStyle;

    /**
     * Defines the style applied after the connection is visited successfully during a run. `style` is the
     * base (Idle) style; only the values that differ from it need to be set here. A missing value falls
     * back to the resolved base `style`, and then to the built-in successful-connection look. The base
     * style is restored when a new run starts.
     *
     * @default {}
     * @private
     */
    successStyle?: WorkflowConnectionStyle;
}
