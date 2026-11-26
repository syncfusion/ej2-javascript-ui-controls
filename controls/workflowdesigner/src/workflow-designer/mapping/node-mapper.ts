import { NodeModel, PointPortModel } from '@syncfusion/ej2-diagrams';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStepRenderer, WorkflowStepTemplateRenderer } from '../rendering/workflow-step-renderer';
import { WorkflowStepState } from '../models/workflow-step-template';

/**
 * Maps public workflow steps to internal Diagram HTML nodes. Step rendering is
 * delegated to `WorkflowStepRenderer` (the functional-template HTML builder);
 * `NodeMapper` retains its static public surface so `DiagramMapper` can call
 * it without changes. Runtime visual states (selected/running/completed/failed)
 * and red-stroke failure styling are owned by `WorkflowStepRenderer`.
 *
 * This is a P0 visual milestone: executable workflow steps render as
 * Diagram HTML nodes, not Basic Rectangle nodes.
 *
 * @private
 */
export class NodeMapper {
    private static readonly renderer: WorkflowStepRenderer = new WorkflowStepRenderer();

    /**
     * Converts a workflow step to a Diagram HTML node model.
     *
     * @param {WorkflowStep} step - The workflow step to map.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {NodeModel} The internal Diagram node model.
     * @private
     */
    public static toDiagramNode(step: WorkflowStep, template?: WorkflowStepTemplateRenderer): NodeModel {
        return NodeMapper.renderer.render(step, template);
    }

    /**
     * Applies only supplied step changes to an existing Diagram node.
     *
     * @param {NodeModel} node - The Diagram node to update.
     * @param {Partial<WorkflowStep>} changes - The step changes.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void} Nothing.
     * @private
     */
    public static applyChanges(node: NodeModel, changes: Partial<WorkflowStep>, template?: WorkflowStepTemplateRenderer): void {
        NodeMapper.renderer.applyChanges(node, changes, template);
    }

    /**
     * Updates the runtime visual state of a mapped step node.
     *
     * @param {NodeModel} node - The mapped Diagram node.
     * @param {WorkflowStepState} state - The runtime visual state.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void} Nothing.
     * @private
     */
    public static setVisualState(node: NodeModel, state: WorkflowStepState, template?: WorkflowStepTemplateRenderer): void {
        NodeMapper.renderer.setVisualState(node, state, template);
    }

    /**
     * Removes ONLY the running-stroke animation from a mapped node's rendered
     * card, leaving the stored state and inline fill/border colors untouched.
     * Used by user-initiated Stop so a stopped run keeps its
     * completed / failed status colors but stops the dashed "processing"
     * animation. Returns `true` when the running SVG was actually removed.
     *
     * @param {NodeModel} node - The mapped Diagram node.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {boolean} Whether the running SVG was removed.
     * @private
     */
    public static stopStepAnimation(node: NodeModel, template?: WorkflowStepTemplateRenderer): boolean {
        return NodeMapper.renderer.stopStepAnimation(node, template);
    }

    /**
     * Aligns the renderer cache with the live workflow step object so simulation
     * mutations (Formatter runtimeOutput) are visible on the next paint.
     *
     * @param {WorkflowStep} step - The live workflow step object.
     * @returns {void} Nothing.
     * @private
     */
    public static syncStoredStep(step: WorkflowStep): void {
        NodeMapper.renderer.syncStoredStep(step);
    }

    /**
     * Returns the stored workflow step for a mapped node.
     *
     * @param {NodeModel} node - The mapped Diagram node.
     * @returns {WorkflowStep} The stored workflow step.
     * @private
     */
    public static getStoredStep(node: NodeModel): WorkflowStep {
        return NodeMapper.renderer.getStoredStep(node);
    }

    /**
     * Returns a stable Diagram port ID for a public workflow port.
     *
     * @param {string} nodeId - The Diagram node identifier.
     * @param {string} portName - The public port name.
     * @param {boolean} input - Whether the port is an input port.
     * @returns {string} The stable Diagram port identifier.
     * @private
     */
    public static getPortId(nodeId: string, portName: string, input: boolean): string {
        return NodeMapper.renderer.getPortId(nodeId, portName, input);
    }

    /**
     * Builds desired Diagram ports for a workflow step (input + outputs).
     *
     * @param {WorkflowStep} step - The workflow step to map.
     * @returns {PointPortModel[]} The desired Diagram ports.
     * @private
     */
    public static buildPorts(step: WorkflowStep): PointPortModel[] {
        return NodeMapper.renderer.buildPorts(step);
    }

    /**
     * Re-asserts the resolved width/height onto a live Diagram node model.
     *
     * Invoked from `DiagramMapper.updateNode` after `syncNodePorts` so that
     * the Switch-height adjustment survives EJ2's internal `addPorts` /
     * `updateDiagramObject` wrapper rebuild. Without this re-assert, the
     * height applied by `applyChanges` is overwritten by the port sync
     * pass and only paints once execution starts.
     *
     * @param {NodeModel} node - The live Diagram node.
     * @param {WorkflowStep} step - The workflow step model.
     * @returns {void} Nothing.
     * @private
     */
    public static reapplyNodeSize(node: NodeModel, step: WorkflowStep): void {
        NodeMapper.renderer.reapplyNodeSize(node, step);
    }

    /**
     * Repaints the full HTML card (size + style + content) on a live Diagram
     * node, preserving the current visual state. Use after port topology
     * changes that may have replaced the node instance so the canvas picks up
     * the new Switch / Formatter dimensions on the very next paint.
     *
     * @param {NodeModel} node - The live Diagram node.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void} Nothing.
     * @private
     */
    public static repaintHtml(node: NodeModel, template?: WorkflowStepTemplateRenderer): void {
        NodeMapper.renderer.repaintHtml(node, template);
    }

    /**
     * True when current and desired ports match by id and offset.
     *
     * @param {PointPortModel[] | undefined} current - The current Diagram ports.
     * @param {PointPortModel[]} next - The desired Diagram ports.
     * @returns {boolean} Whether the port topologies match.
     * @private
     */
    public static samePortTopology(
        current: PointPortModel[] | undefined,
        next: PointPortModel[]
    ): boolean {
        return NodeMapper.renderer.portsMatch(current, next);
    }

    /**
     * Resolves a Diagram port id back to the public workflow port name.
     * Input ports use `{nodeId}:input`; outputs use `{nodeId}:output:{portName}`.
     * Bare names and legacy short ids are accepted as a fallback.
     *
     * @param {string} portId - The Diagram port identifier.
     * @param {string} nodeId - The Diagram node identifier.
     * @param {boolean} input - Whether the port is an input port.
     * @returns {string} The public workflow port name.
     * @private
     */
    public static parsePortName(portId: string, nodeId: string, input: boolean): string {
        const id: string = String(portId || '');
        if (!id) {
            return input ? 'input' : 'output';
        }
        if (input) {
            const inputId: string = NodeMapper.getPortId(nodeId, 'input', true);
            if (id === inputId || id === 'input') {
                return 'input';
            }
            const parts: string[] = id.split(':');
            return parts[parts.length - 1] || 'input';
        }
        const outputPrefix: string = `${nodeId}:output:`;
        if (id.indexOf(outputPrefix) === 0) {
            return id.substring(outputPrefix.length) || 'output';
        }
        if (id.indexOf('output:') === 0) {
            return id.substring('output:'.length) || 'output';
        }
        if (id.indexOf(':') === -1) {
            return id;
        }
        const segments: string[] = id.split(':');
        return segments[segments.length - 1] || 'output';
    }
}
