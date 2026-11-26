import { Diagram, IDraggingEventArgs, NodeModel } from '@syncfusion/ej2-diagrams';
import { WorkflowPosition } from '../models/workflow-position';
import { WorkflowStep } from '../models/workflow-step';
import { DiagramMapper } from '../mapping/diagram-mapper';

type MoveCallback = (steps: WorkflowStep[]) => void;
type PositionChangeHandler = (args: IDraggingEventArgs) => void;

/**
 * Copies the positions of steps the user finished dragging back to the public
 * workflow steps, then reports the moved steps once per drag.
 *
 * It listens to the Diagram's public `positionChange` event and keeps any
 * handler that was already assigned to it.
 *
 * @private
 */
export class PositionSynchronizer {
    private readonly diagram: Diagram;
    private readonly mapper: DiagramMapper;
    private readonly getSteps: () => WorkflowStep[];
    private readOnly: boolean;
    private readonly moveCallback: MoveCallback;
    private previousHandler: PositionChangeHandler | null = null;
    private attached: boolean = false;

    /**
     * Creates a position synchronizer.
     *
     * @param {Diagram} diagram - The Diagram instance to observe.
     * @param {DiagramMapper} mapper - The mapper for resolving step identifiers.
     * @param {Function} getSteps - Returns the current public workflow steps.
     * @param {boolean} readOnly - Whether movement updates are disabled.
     * @param {MoveCallback} moveCallback - Invoked once after one or more steps are moved.
     * @private
     */
    public constructor(
        diagram: Diagram,
        mapper: DiagramMapper,
        getSteps: () => WorkflowStep[],
        readOnly: boolean,
        moveCallback: MoveCallback
    ) {
        this.diagram = diagram;
        this.mapper = mapper;
        this.getSteps = getSteps;
        this.readOnly = readOnly;
        this.moveCallback = moveCallback;
    }

    /**
     * Starts listening for completed drags.
     *
     * @returns {void} Nothing.
     * @private
     */
    public attach(): void {
        if (this.attached) {
            return;
        }
        const existing: unknown = this.diagram.positionChange;
        this.previousHandler = typeof existing === 'function' ? existing as PositionChangeHandler : null;
        this.diagram.positionChange = this.handlePositionChange as unknown as Diagram['positionChange'];
        this.attached = true;
    }

    /**
     * Stops listening and restores the previous `positionChange` handler.
     *
     * @returns {void} Nothing.
     * @private
     */
    public dispose(): void {
        if (!this.attached) {
            return;
        }
        if (this.diagram && !this.diagram.isDestroyed) {
            this.diagram.positionChange = (this.previousHandler || undefined) as unknown as Diagram['positionChange'];
        }
        this.previousHandler = null;
        this.attached = false;
    }

    /**
     * Turns movement synchronization off while the designer is read-only.
     *
     * @param {boolean} readOnly - Whether the designer is read-only.
     * @returns {void} Nothing.
     * @private
     */
    public setReadOnly(readOnly: boolean): void {
        this.readOnly = readOnly;
    }

    /**
     * Handles a Diagram position change; only completed drags are synchronized.
     *
     * @param {IDraggingEventArgs} args - The position change arguments.
     * @returns {void} Nothing.
     */
    private readonly handlePositionChange = (args: IDraggingEventArgs): void => {
        if (this.previousHandler) {
            this.previousHandler(args);
        }
        if (this.readOnly || !args || args.state !== 'Completed') {
            return;
        }
        const source: { nodes?: NodeModel[] } & NodeModel = (args.source || {}) as { nodes?: NodeModel[] } & NodeModel;
        const nodes: NodeModel[] = Array.isArray(source.nodes) && source.nodes.length ? source.nodes : [source];
        const steps: WorkflowStep[] = this.getSteps() || [];
        const moved: WorkflowStep[] = [];
        nodes.forEach((node: NodeModel) => {
            const stepId: string | null = node && node.id ? this.mapper.getStepIdForNode(node.id) : null;
            if (!stepId || typeof node.offsetX !== 'number' || typeof node.offsetY !== 'number') {
                return;
            }
            const step: WorkflowStep | undefined = steps.filter((candidate: WorkflowStep) => candidate.id === stepId)[0];
            if (!step) {
                return;
            }
            const current: WorkflowPosition = { x: node.offsetX, y: node.offsetY };
            if (step.position && step.position.x === current.x && step.position.y === current.y) {
                return;
            }
            step.position = current;
            moved.push(step);
        });
        if (moved.length) {
            this.moveCallback(moved);
        }
    };
}
