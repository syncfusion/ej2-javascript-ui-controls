import { AnnotationConstraints, ConnectorModel, NodeModel, PathAnnotationModel, PointPortModel } from '@syncfusion/ej2-diagrams';
import { WorkflowConnectionStyle } from '../models/workflow-style';
import { WorkflowConnection } from '../models/workflow-connection';
import { NodeMapper } from './node-mapper';

type WarningCallback = (message: string) => void;

/**
 * Runtime visual state applied to a workflow connection during simulation.
 *
 * @private
 */
export type WorkflowConnectorVisualState = 'idle' | 'visited' | 'error';

/** Connector stroke color matches the user-handle chip neutral
 * (`--wf-color-border` / `--wf-handle-fill` in workflow-designer.scss) so
 * connectors feel like a natural extension of the canvas handle palette. */
const DEFAULT_CONNECTOR_COLOR: string = '#64748b';
const DEFAULT_CONNECTOR_WIDTH: number = 2;
const VISITED_CONNECTOR_COLOR: string = '#2e7d32';
const ERROR_CONNECTOR_COLOR: string = '#d32f2f';
const STATE_CONNECTOR_WIDTH: number = 2;

/**
 * Maps public workflow connections to internal Diagram connectors.
 *
 * @private
 */
export class ConnectorMapper {
    private readonly warningCallback?: WarningCallback;

    /**
     * Creates the instance.
     *
     * @param {WarningCallback} warningCallback The warning callback.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(warningCallback?: WarningCallback) {
        this.warningCallback = warningCallback;
    }

    /**
     * Converts a workflow connection to a Diagram connector when both ports exist.
     *
     * @param {WorkflowConnection} connection - The workflow connection to map.
     * @param {Map<string, NodeModel>} nodeMap - The mapped workflow nodes.
     * @returns {ConnectorModel | null} The Diagram connector, or null when mapping fails.
     * @private
     */
    public toDiagramConnector(
        connection: WorkflowConnection,
        nodeMap: Map<string, NodeModel>
    ): ConnectorModel | null {
        const sourceNode: NodeModel | undefined = nodeMap.get(connection.sourceStepId || '');
        const targetNode: NodeModel | undefined = nodeMap.get(connection.targetStepId || '');
        if (!sourceNode || !targetNode) {
            this.warn(`Connection '${connection.id || ''}' has a missing endpoint.`);
            return null;
        }
        const sourcePortId: string = NodeMapper.getPortId(sourceNode.id || '', connection.sourcePort || 'output', false);
        const targetPortId: string = NodeMapper.getPortId(targetNode.id || '', connection.targetPort || 'input', true);
        if (!this.hasPort(sourceNode, sourcePortId) || !this.hasPort(targetNode, targetPortId)) {
            this.warn(`Connection '${connection.id || ''}' targets a missing port.`);
            return null;
        }
        return {
            id: connection.id,
            sourceID: sourceNode.id,
            targetID: targetNode.id,
            sourcePortID: sourcePortId,
            targetPortID: targetPortId,
            type: connection.type || 'Orthogonal',
            sourceDecorator: {
                shape: connection.sourceDecorator || 'None',
                style: { fill: DEFAULT_CONNECTOR_COLOR, strokeColor: DEFAULT_CONNECTOR_COLOR }
            },
            targetDecorator: {
                shape: connection.targetDecorator || 'Arrow',
                style: { fill: DEFAULT_CONNECTOR_COLOR, strokeColor: DEFAULT_CONNECTOR_COLOR }
            },
            annotations: connection.label
                ? [{
                    content: connection.label,
                    offset: 0.5,
                    constraints: AnnotationConstraints.ReadOnly,
                    style: {
                        fill: '#ffffff',
                        strokeColor: this.resolveStroke(connection.style),
                        color: this.resolveStroke(connection.style),
                        fontSize: 12
                    }
                }]
                : [],
            style: this.toDiagramStyle(connection.style),
            addInfo: { workflowConnection: connection }
        };
    }

    /**
     * Updates runtime visual styling on a Diagram connector (visited/error/idle).
     * Mutates style.strokeColor and targetDecorator.style fill/strokeColor in place
     * so EJ2 live connector instances refresh after diagram.dataBind().
     * Restores the connection's configured style when returning to idle.
     *
     * @param {ConnectorModel} connector - The Diagram connector to update.
     * @param {WorkflowConnectorVisualState} state - The runtime visual state.
     * @param {WorkflowConnection | null} [connection] - The source connection.
     * @returns {void} Nothing.
     * @private
     */
    public setVisualState(
        connector: ConnectorModel,
        state: WorkflowConnectorVisualState,
        connection?: WorkflowConnection | null
    ): void {
        if (state === 'idle') {
            const idle: { strokeColor: string; strokeWidth: number; strokeDashArray: string } =
                this.toDiagramStyle(connection ? connection.style : undefined);
            this.applyStroke(connector, idle.strokeColor, idle.strokeWidth, idle.strokeDashArray);
            this.applyDecoratorColors(connector, idle.strokeColor);
            this.applyAnnotationColor(connector, idle.strokeColor);
            this.enforceAnnotationConstraints(connector);
            return;
        }
        const success: WorkflowConnectionStyle | undefined = state === 'visited' && connection
            ? connection.successStyle
            : undefined;
        const base: WorkflowConnectionStyle | undefined = connection ? connection.style : undefined;
        // Visited: successStyle, then the resolved idle style, then the built-in successful look.
        const strokeColor: string = state === 'error'
            ? ERROR_CONNECTOR_COLOR
            : (success && success.strokeColor) || VISITED_CONNECTOR_COLOR;
        const baseWidth: number = base && typeof base.strokeWidth === 'number'
            ? base.strokeWidth
            : DEFAULT_CONNECTOR_WIDTH;
        const width: number = success && typeof success.strokeWidth === 'number'
            ? Math.max(success.strokeWidth, DEFAULT_CONNECTOR_WIDTH)
            : Math.max(baseWidth, STATE_CONNECTOR_WIDTH);
        const dash: string = (success && success.strokeDashArray) || (base && base.strokeDashArray) || '';
        this.applyStroke(connector, strokeColor, width, dash);
        this.applyDecoratorColors(connector, strokeColor);
        // Runtime visited/error recoloring reaches the label too, so the
        // annotation pill always reads as an extension of the connector line.
        this.applyAnnotationColor(connector, strokeColor);
        this.enforceAnnotationConstraints(connector);
    }

    /**
     * Applies only supplied connection changes to a Diagram connector.
     *
     * @param {ConnectorModel} connector - The Diagram connector to update.
     * @param {Partial<WorkflowConnection>} changes - The connection changes.
     * @returns {void} Nothing.
     * @private
     */
    public applyChanges(connector: ConnectorModel, changes: Partial<WorkflowConnection>): void {
        if (changes.sourceStepId !== undefined) {
            connector.sourceID = changes.sourceStepId;
        }
        if (changes.targetStepId !== undefined) {
            connector.targetID = changes.targetStepId;
        }
        if (changes.sourcePort !== undefined && connector.sourceID) {
            connector.sourcePortID = NodeMapper.getPortId(connector.sourceID, changes.sourcePort, false);
        }
        if (changes.targetPort !== undefined && connector.targetID) {
            connector.targetPortID = NodeMapper.getPortId(connector.targetID, changes.targetPort, true);
        }
        if (changes.type !== undefined) {
            if (connector.type !== changes.type) {
                // Segments belong to the previous type; clearing them lets the Diagram route the new type.
                connector.segments = [];
            }
            connector.type = changes.type;
        }
        if (changes.sourceDecorator !== undefined) {
            connector.sourceDecorator = {
                shape: changes.sourceDecorator,
                style: { fill: DEFAULT_CONNECTOR_COLOR, strokeColor: DEFAULT_CONNECTOR_COLOR }
            };
        }
        if (changes.targetDecorator !== undefined) {
            connector.targetDecorator = {
                shape: changes.targetDecorator,
                style: { fill: DEFAULT_CONNECTOR_COLOR, strokeColor: DEFAULT_CONNECTOR_COLOR }
            };
        }
        if (changes.label !== undefined) {
            const annotation: PathAnnotationModel = connector.annotations && connector.annotations[0]
                ? connector.annotations[0]
                // Defensive fallback only: `getConnectorDefaults` always seeds one
                // annotation, so this branch is not expected to run in practice.
                : { content: '', offset: 0.5, constraints: AnnotationConstraints.ReadOnly, style: { fill: '#ffffff', fontSize: 12 } };
            annotation.content = changes.label;
            annotation.offset = 0.5;
            annotation.constraints = AnnotationConstraints.ReadOnly;
            if (!annotation.style) {
                annotation.style = { fill: '#ffffff', fontSize: 12 };
            } else if (!annotation.style.fontSize) {
                annotation.style.fontSize = 12;
            }
            connector.annotations = changes.label ? [annotation] : [];
            this.applyAnnotationColor(
                connector,
                connector.style && connector.style.strokeColor ? connector.style.strokeColor : DEFAULT_CONNECTOR_COLOR
            );
        }
        if (changes.style !== undefined) {
            connector.style = this.toDiagramStyle(changes.style);
            this.applyAnnotationColor(connector, connector.style.strokeColor || DEFAULT_CONNECTOR_COLOR);
        }
        // CRITICAL: Enforce constraints remain ReadOnly after all changes
        this.enforceAnnotationConstraints(connector);
    }

    private hasPort(node: NodeModel, portId: string): boolean {
        return Boolean(node.ports && node.ports.some((port: PointPortModel) => port.id === portId));
    }

    private toDiagramStyle(style: WorkflowConnectionStyle | undefined): {
        strokeColor: string; strokeWidth: number; strokeDashArray: string;
    } {
        return {
            strokeColor: this.resolveStroke(style),
            strokeWidth: style && typeof style.strokeWidth === 'number'
                ? Math.max(style.strokeWidth, DEFAULT_CONNECTOR_WIDTH)
                : DEFAULT_CONNECTOR_WIDTH,
            strokeDashArray: style && style.strokeDashArray ? style.strokeDashArray : ''
        };
    }

    private resolveStroke(style: WorkflowConnectionStyle | undefined): string {
        return style && style.strokeColor ? style.strokeColor : DEFAULT_CONNECTOR_COLOR;
    }

    /**
     * Mutates connector.style properties in place (avoids replacing the style object).
     *
     * @param {ConnectorModel} connector - The Diagram connector to update.
     * @param {string} strokeColor - The stroke color.
     * @param {number} strokeWidth - The stroke width.
     * @param {string} strokeDashArray - The stroke dash pattern.
     * @returns {void} Nothing.
     */
    private applyStroke(
        connector: ConnectorModel,
        strokeColor: string,
        strokeWidth: number,
        strokeDashArray: string
    ): void {
        if (!connector.style) {
            connector.style = {
                strokeColor: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray
            };
            return;
        }
        connector.style.strokeColor = strokeColor;
        connector.style.strokeWidth = strokeWidth;
        connector.style.strokeDashArray = strokeDashArray;
    }

    /**
     * Mutates source/target decorator fill and strokeColor in place so live
     * Diagram connectors update after dataBind.
     *
     * @param {ConnectorModel} connector - The Diagram connector to update.
     * @param {string} color - The decorator color.
     * @returns {void} Nothing.
     */
    private applyDecoratorColors(connector: ConnectorModel, color: string): void {
        if (connector.sourceDecorator) {
            if (!connector.sourceDecorator.style) {
                connector.sourceDecorator.style = {};
            }
            connector.sourceDecorator.style.fill = color;
            connector.sourceDecorator.style.strokeColor = color;
        }
        if (connector.targetDecorator) {
            if (!connector.targetDecorator.style) {
                connector.targetDecorator.style = {};
            }
            connector.targetDecorator.style.fill = color;
            connector.targetDecorator.style.strokeColor = color;
        }
    }

    /**
     * Mirrors a connector's current stroke color onto its label annotation
     * (border + text), keeping the white background fill for legibility.
     * Called from every path that changes `connector.style.strokeColor` —
     * initial mapping, runtime visited/error/idle recoloring, and a
     * host-driven `style` change — so the label pill always reads as a
     * natural extension of the connector line it is attached to.
     *
     * @param {ConnectorModel} connector - The Diagram connector to update.
     * @param {string} strokeColor - The connector's current stroke color.
     * @returns {void} Nothing.
     */
    private applyAnnotationColor(connector: ConnectorModel, strokeColor: string): void {
        const annotation: PathAnnotationModel | undefined = connector.annotations && connector.annotations[0];
        if (!annotation) {
            return;
        }
        // Only update color properties; preserve font size and other styles set during initial creation
        annotation.style = Object.assign({}, annotation.style || {}, {
            fill: '#ffffff',
            strokeColor: strokeColor,
            color: strokeColor
        });
        // CRITICAL: Always re-assert ReadOnly constraint to prevent EJ2 from reverting it
        annotation.constraints = AnnotationConstraints.ReadOnly;
    }

    /**
     * Enforces annotation constraints to remain ReadOnly across all annotations.
     * This is a defensive measure to ensure EJ2 doesn't revert constraints during
     * style updates or visual state changes.
     *
     * @param {ConnectorModel} connector The connector to validate.
     * @returns {void}
     * @private
     */
    private enforceAnnotationConstraints(connector: ConnectorModel): void {
        if (!connector.annotations) {
            return;
        }
        (connector.annotations || []).forEach((annotation: any): void => {
            annotation.constraints = AnnotationConstraints.ReadOnly;
        });
    }

    private warn(message: string): void {
        if (this.warningCallback) {
            this.warningCallback(message);
        }
    }
}
