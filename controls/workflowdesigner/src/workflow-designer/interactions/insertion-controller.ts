import { PortResolver } from '../mapping/port-resolver';
import { WorkflowStepType } from '../models/workflow-enums';
import { WorkflowPosition } from '../models/workflow-position';
import { WorkflowStep } from '../models/workflow-step';
import { CustomStepResolver } from '../rendering/custom-step-resolver';
import { WorkflowCustomStepDefinitionModel } from '../models/workflow-custom-step-model';
import { StepEditorRegistry } from '../rendering/editors/step-editor-registry';

/**
 * Insertion source kind.
 *
 * @private
 */
export type WorkflowInsertionSourceKind = 'EmptyCanvas' | 'NodeOutput' | 'Connector' | 'Toolbar';

/**
 * Runtime-only insertion context captured while the Node Collection is open
 *. It is never persisted and is cleared on successful
 * insertion, cancel, source deletion or component destruction.
 *
 * @private
 */
export interface WorkflowInsertionContext {
    sourceKind: WorkflowInsertionSourceKind;
    sourceStepId?: string;
    sourcePortId?: string;
    connectorId?: string;
    position: WorkflowPosition;
}

/**
 * Workflow Step Geometry.
 *
 * @private
 */
export interface WorkflowStepGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Insertion Handlers.
 *
 * @private
 */
export interface InsertionHandlers {
    addStep: (step: WorkflowStep) => string | null;
    startGroupAction?: () => void;
    endGroupAction?: () => void;
    selectStep?: (stepId: string) => void;
    generateStepId: (preferred: string) => string;
    getSteps: () => WorkflowStep[];
    getStepGeometry?: (
        stepId: string
    ) => WorkflowStepGeometry | null;
    addConnection?: (connection: {
        id: string;
        sourceStepId: string;
        targetStepId: string;
        sourcePort: string;
        targetPort: string;
    }) => void;
    updateStepPosition?: (stepId: string, position: WorkflowPosition) => void;
    removeItem?: (id: string) => void;
    getConnection?: (id: string) => {
        id?: string;
        sourceStepId?: string;
        targetStepId?: string;
        sourcePort?: string;
        targetPort?: string;
    } | null;
    defaultOutputPort?: (stepType: WorkflowStepType) => string[];
}

/**
 * Owns the runtime-only insertion context for the Node Collection and performs
 * insertions through the public mutation boundary.
 *
 * R5 implements:
 *   - EmptyCanvas first-trigger insertion.
 *   - NodeOutput insertion (the connection to the inserted step is wired in R6
 *     with node Add handles; R5 only records the insertion context and
 *     inserts the step).
 *
 * @internal
 * @private
 */
export class InsertionController {
    private static readonly DEFAULT_NODE_WIDTH: number = 180;
    private static readonly DEFAULT_NODE_HEIGHT: number = 80;
    private static readonly HORIZONTAL_GAP: number = 160;
    private static readonly VERTICAL_GAP: number = 40;
    private static readonly MAX_PLACEMENT_ATTEMPTS: number = 1000;

    private readonly handlers: InsertionHandlers;
    private context: WorkflowInsertionContext | null = null;

    /**
     * Creates the instance.
     *
     * @param {InsertionHandlers} handlers The handlers.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(handlers: InsertionHandlers) {
        this.handlers = handlers;
    }

    /**
     * Returns the active insertion context, or null when the palette is closed.
     *
     * @returns {WorkflowInsertionContext | null} The active insertion context, or null.
     * @private
     */
    public getContext(): WorkflowInsertionContext | null {
        return this.context;
    }

    /**
     * Opens the Node Collection for an empty-canvas first-trigger insertion.
     *
     * @param {WorkflowPosition} position - The insertion position.
     * @returns {void} Nothing.
     * @private
     */
    public openForEmptyCanvas(position: WorkflowPosition): void {
        this.context = { sourceKind: 'EmptyCanvas', position };
    }

    /**
     * Opens the Node Collection from the toolbar for a free-canvas insertion.
     *
     * @param {WorkflowPosition} position - The insertion position.
     * @returns {void} Nothing.
     * @private
     */
    public openForToolbar(position: WorkflowPosition): void {
        this.context = { sourceKind: 'Toolbar', position };
    }

    /**
     * Opens the Node Collection for a selected-node Add insertion request.
     *
     * @param {string} sourceStepId - The source step identifier.
     * @param {string} sourcePortId - The source port identifier.
     * @param {WorkflowPosition} position - The insertion position.
     * @returns {void} Nothing.
     * @private
     */
    public openForNodeOutput(sourceStepId: string, sourcePortId: string, position: WorkflowPosition): void {
        this.context = { sourceKind: 'NodeOutput', sourceStepId, sourcePortId, position };
    }

    /**
     * Opens the Node Collection for a selected-connector Add insertion request.
     *
     * @param {string} connectorId - The connector identifier.
     * @param {WorkflowPosition} position - The insertion position.
     * @returns {void} Nothing.
     * @private
     */
    public openForConnector(connectorId: string, position: WorkflowPosition): void {
        this.context = { sourceKind: 'Connector', connectorId, position };
    }

    /**
     * Returns whether a step type is permitted for the active insertion point.
     *
     * @param {WorkflowStepType} stepType - The step type to check.
     * @returns {boolean} Whether the step type is permitted.
     * @private
     */
    public isPermitted(stepType: WorkflowStepType): boolean {
        if (!this.context) {
            return false;
        }
        if (this.context.sourceKind === 'Toolbar') {
            return true;
        }
        // Triggers cannot have an incoming connection. EmptyCanvas permits
        // triggers (first step); middle insertion points (NodeOutput/Connector)
        // hide/disable triggers.
        const isTrigger: boolean = PortResolver.isTrigger(stepType);
        if (this.context.sourceKind === 'EmptyCanvas') {
            // First-step insertion point: show/enable triggers; hide/disable
            // non-trigger node types when a trigger is required first.
            return isTrigger;
        }
        return !isTrigger;
    }

    /**
     * Performs the insertion of a step type at the active insertion point.
     * Returns the new step id on success, or null when there is no active
     * context. Clears the insertion context after a successful insertion.
     *
     * @param {WorkflowStepType} stepType - The step type to insert.
     * @param {string} name - The display name for the new step.
     * @param {WorkflowCustomStepDefinitionModel} customDefinition - The definition of a custom step being inserted.
     * @returns {string | null} The new step identifier, or null when insertion fails.
     * @private
     */
    public insert(
        stepType: WorkflowStepType,
        name: string,
        customDefinition?: WorkflowCustomStepDefinitionModel
    ): string | null {
        if (!this.context) {
            return null;
        }
        const context: WorkflowInsertionContext = this.context;
        const id: string = this.handlers.generateStepId(stepType);

        const props: Record<string, unknown> = customDefinition
            ? CustomStepResolver.resolveValues(customDefinition)
            : StepEditorRegistry.getDefaultProps(stepType);

        // For Toolbar insertions, don't set position so stagger positioning can work
        // For other insertions (NodeOutput, Connector), use the calculated position
        const shouldUseContextPosition: boolean = context.sourceKind !== 'Toolbar' && context.sourceKind !== 'EmptyCanvas';

        // Props come from the editor registry for this stepType, so they match it.
        const step: WorkflowStep = {
            id,
            stepType,
            name: name || stepType,
            // Bind registry defaults so the property panel is usable immediately.
            props: props,
            position: shouldUseContextPosition ? { x: context.position.x, y: context.position.y } : undefined
        } as WorkflowStep;
        if (customDefinition) {
            step.customStepId = customDefinition.id;
            if (customDefinition.size && typeof customDefinition.size === 'object') {
                step.size = CustomStepResolver.clone(customDefinition.size) as WorkflowStep['size'];
            }
            if (customDefinition.appearance && typeof customDefinition.appearance === 'object') {
                step.appearance = CustomStepResolver.clone(customDefinition.appearance) as WorkflowStep['appearance'];
            }
            if (customDefinition.iconCss && !(step.appearance && step.appearance.iconCss)) {
                step.appearance = Object.assign({}, step.appearance, { iconCss: customDefinition.iconCss });
            }
        }
        // Switch height tracks branch/default ports (Condition base + extras).
        if (stepType === 'Switch') {
            step.size = {
                width: InsertionController.DEFAULT_NODE_WIDTH,
                height: PortResolver.getSwitchNodeHeight(step)
            };
        }

        if (
            context.sourceKind === 'NodeOutput' &&
            context.sourceStepId
        ) {
            step.position = this.findNodeOutputPosition(
                context.sourceStepId,
                context.sourcePortId || 'output',
                step
            );
        }
        const shouldGroup: boolean = context.sourceKind === 'NodeOutput'
            || context.sourceKind === 'Connector';
        if (shouldGroup && this.handlers.startGroupAction) {
            this.handlers.startGroupAction();
        }
        try {
            if (context.sourceKind === 'Connector') {
                return this.insertOnConnector(step, context);
            }
            const addedId: string | null = this.handlers.addStep(step);
            if (!addedId) {
                return null;
            }
            if (this.handlers.selectStep) {
                this.handlers.selectStep(addedId);
            }
            if (context.sourceKind === 'NodeOutput' && context.sourceStepId && this.handlers.addConnection) {
                this.handlers.addConnection({
                    id: this.handlers.generateStepId('c'),
                    sourceStepId: context.sourceStepId,
                    targetStepId: addedId,
                    sourcePort: context.sourcePortId || 'output',
                    targetPort: 'input'
                });
            }
            // For Toolbar insertions, reinitialize context for next insertion; for others, clear it
            if (context.sourceKind === 'Toolbar') {
                this.context = { sourceKind: 'Toolbar', position: context.position };
            } else {
                this.clearContext();
            }
            return addedId;
        } finally {
            if (shouldGroup && this.handlers.endGroupAction) {
                this.handlers.endGroupAction();
            }
        }
    }

    /**
     * Places a newly inserted node to the right of the source node.
     *
     * The initial vertical position follows the clicked output port. For example,
     * the true output of a Condition starts above the source center and the false
     * output starts below it.
     *
     * If that position is occupied, additional vertical slots are checked while
     * preserving the same horizontal column.
     *
     * @param {string} sourceStepId - The source step identifier.
     * @param {string} sourcePortId - The source port identifier.
     * @param {WorkflowStep} newStep - The step being inserted.
     * @returns {WorkflowPosition} An available insertion position.
     */
    private findNodeOutputPosition(
        sourceStepId: string,
        sourcePortId: string,
        newStep: WorkflowStep
    ): WorkflowPosition {
        const steps: WorkflowStep[] =
            this.handlers.getSteps();

        const sourceStep: WorkflowStep | undefined =
            steps.find(
                (step: WorkflowStep): boolean =>
                    step.id === sourceStepId
            );

        if (!sourceStep) {
            return {
                x: this.context
                    ? this.coordinate(this.context.position.x)
                    : 0,

                y: this.context
                    ? this.coordinate(this.context.position.y)
                    : 0
            };
        }

        const sourceGeometry: WorkflowStepGeometry =
            this.resolveStepGeometry(sourceStep);

        const newNodeHeight: number =
            this.nodeHeight(newStep);

        const candidateX: number =
            sourceGeometry.x +
            (sourceGeometry.width / 2) +
            InsertionController.HORIZONTAL_GAP;

        const portOffsetY: number =
            this.getOutputPortOffset(
                sourceStep,
                sourcePortId
            );

        const preferredY: number =
            this.getPortRelativeY(
                sourceGeometry.y,
                sourceGeometry.height,
                newNodeHeight,
                portOffsetY
            );

        const verticalStep: number =
            newNodeHeight +
            InsertionController.VERTICAL_GAP;

        for (
            let attempt: number = 0;
            attempt <
                InsertionController.MAX_PLACEMENT_ATTEMPTS;
            attempt++
        ) {
            const candidateY: number =
                this.verticalCandidate(
                    preferredY,
                    verticalStep,
                    attempt,
                    portOffsetY
                );

            const candidatePosition: WorkflowPosition = {
                x: candidateX,
                y: candidateY
            };

            if (
                !this.overlapsAnyStep(
                    candidatePosition,
                    newStep,
                    steps,
                    sourceStepId
                )
            ) {
                return candidatePosition;
            }
        }

        return {
            x: candidateX,
            y: preferredY
        };
    }

    private resolveStepGeometry(
        step: WorkflowStep
    ): WorkflowStepGeometry {
        if (
            step.id &&
            this.handlers.getStepGeometry
        ) {
            const liveGeometry: WorkflowStepGeometry | null =
                this.handlers.getStepGeometry(step.id);

            if (liveGeometry) {
                return liveGeometry;
            }
        }

        return {
            x: this.coordinate(
                step.position && step.position.x
            ),

            y: this.coordinate(
                step.position && step.position.y
            ),

            width: this.nodeWidth(step),

            height: this.nodeHeight(step)
        };
    }

    private getPortRelativeY(
        sourceY: number,
        sourceHeight: number,
        newNodeHeight: number,
        portOffsetY: number
    ): number {
        if (portOffsetY === 0.5) {
            return sourceY;
        }

        const branchDistance: number =
            (sourceHeight / 2) +
            InsertionController.VERTICAL_GAP +
            (newNodeHeight / 2);

        if (portOffsetY < 0.5) {
            return sourceY - branchDistance;
        }

        return sourceY + branchDistance;
    }

    private getOutputPortOffset(
        sourceStep: WorkflowStep,
        sourcePortId: string
    ): number {
        const outputPorts: string[] =
            PortResolver.getOutputPorts(sourceStep);

        if (outputPorts.length <= 1) {
            return 0.5;
        }

        const portIndex: number =
            outputPorts.indexOf(sourcePortId);

        if (portIndex === -1) {
            return 0.5;
        }

        return (portIndex + 1) / (outputPorts.length + 1);
    }
    /**
     * Returns vertical positions in nearest-first order:
     * source Y, below 1, above 1, below 2, above 2, and so on.
     *
     * @param {number} preferredY - The preferred vertical position.
     * @param {number} verticalStep - The distance between candidate positions.
     * @param {number} attempt - The candidate attempt number.
     * @param {number} portOffsetY - The relative output port offset.
     * @returns {number} The candidate vertical position.
     */
    private verticalCandidate(
        preferredY: number,
        verticalStep: number,
        attempt: number,
        portOffsetY: number
    ): number {
        if (attempt === 0) {
            return preferredY;
        }

        if (portOffsetY < 0.5) {
            return preferredY -
                (attempt * verticalStep);
        }

        if (portOffsetY > 0.5) {
            return preferredY +
                (attempt * verticalStep);
        }

        const level: number =
            Math.ceil(attempt / 2);

        const direction: number =
            attempt % 2 === 1 ? 1 : -1;

        return preferredY +
            (level * verticalStep * direction);
    }

    /**
     * Returns true when the candidate node intersects an existing step.
     *
     * @param {WorkflowPosition} candidatePosition - The candidate position.
     * @param {WorkflowStep} candidateStep - The candidate step.
     * @param {WorkflowStep[]} existingSteps - Existing workflow steps.
     * @param {string} sourceStepId - The source step identifier.
     * @returns {boolean} Whether the candidate overlaps an existing step.
     */
    private overlapsAnyStep(
        candidatePosition: WorkflowPosition,
        candidateStep: WorkflowStep,
        existingSteps: WorkflowStep[],
        sourceStepId: string
    ): boolean {
        const candidateX: number =
            this.coordinate(candidatePosition.x);

        const candidateY: number =
            this.coordinate(candidatePosition.y);

        const candidateWidth: number =
            this.nodeWidth(candidateStep);

        const candidateHeight: number =
            this.nodeHeight(candidateStep);

        return existingSteps.some(
            (step: WorkflowStep): boolean => {
                if (
                    !step.id ||
                    step.id === sourceStepId
                ) {
                    return false;
                }

                const geometry: WorkflowStepGeometry =
                    this.resolveStepGeometry(step);

                const horizontalDistance: number =
                    Math.abs(
                        candidateX - geometry.x
                    );

                const verticalDistance: number =
                    Math.abs(
                        candidateY - geometry.y
                    );

                const requiredHorizontalDistance: number =
                    (
                        candidateWidth +
                        geometry.width
                    ) / 2;

                const requiredVerticalDistance: number =
                    (
                        candidateHeight +
                        geometry.height
                    ) / 2;

                return (
                    horizontalDistance <
                        requiredHorizontalDistance &&
                    verticalDistance <
                        requiredVerticalDistance
                );
            }
        );
    }

    private nodeWidth(step: WorkflowStep): number {
        const width: number | undefined = step.size && step.size.width;

        return typeof width === 'number' && width > 0
            ? width
            : InsertionController.DEFAULT_NODE_WIDTH;
    }

    private nodeHeight(step: WorkflowStep): number {
        const height: number | undefined = step.size && step.size.height;

        return typeof height === 'number' && height > 0
            ? height
            : InsertionController.DEFAULT_NODE_HEIGHT;
    }

    private coordinate(value: number | undefined): number {
        return typeof value === 'number' && isFinite(value) ? value : 0;
    }
    private insertOnConnector(step: WorkflowStep, context: WorkflowInsertionContext): string | null {
        if (!this.handlers.getConnection || !this.handlers.addConnection || !this.handlers.removeItem) {
            return null;
        }
        const original: {
            id?: string;
            sourceStepId?: string;
            targetStepId?: string;
            sourcePort?: string;
            targetPort?: string;
        } | null = this.handlers.getConnection(context.connectorId || '');
        if (!original || !original.sourceStepId || !original.targetStepId) {
            return null;
        }
        const outputs: string[] = this.handlers.defaultOutputPort
            ? this.handlers.defaultOutputPort(step.stepType as WorkflowStepType)
            : ['output'];
        if (step.stepType === 'End' || !outputs.length) {
            return null;
        }
        const sourceGeometry: WorkflowStepGeometry | null = this.handlers.getStepGeometry
            ? this.handlers.getStepGeometry(original.sourceStepId)
            : null;
        const targetGeometry: WorkflowStepGeometry | null = this.handlers.getStepGeometry
            ? this.handlers.getStepGeometry(original.targetStepId)
            : null;
        const originalTargetPosition: WorkflowPosition = {
            x: targetGeometry ? targetGeometry.x : 0,
            y: targetGeometry ? targetGeometry.y : 0
        };
        const insertionGap: number = InsertionController.HORIZONTAL_GAP / 2;
        if (sourceGeometry && targetGeometry) {
            const stepWidth: number = this.nodeWidth(step);
            step.position = {
                x: sourceGeometry.x + (sourceGeometry.width + stepWidth) / 2 + insertionGap,
                y: targetGeometry.y
            };
        }
        const addedId: string | null = this.handlers.addStep(step);
        if (!addedId) {
            return null;
        }
        if (this.handlers.selectStep) {
            this.handlers.selectStep(addedId);
        }
        const firstId: string = this.handlers.generateStepId('c');
        let secondId: string = '';
        try {
            if (targetGeometry && this.handlers.updateStepPosition) {
                this.handlers.updateStepPosition(original.targetStepId, {
                    x: (step.position ? step.position.x : 0) + this.nodeWidth(step) / 2
                        + insertionGap + targetGeometry.width / 2,
                    y: targetGeometry.y
                });
            }
            this.handlers.removeItem(original.id || context.connectorId || '');
            this.handlers.addConnection({
                id: firstId,
                sourceStepId: original.sourceStepId,
                targetStepId: addedId,
                sourcePort: original.sourcePort || 'output',
                targetPort: 'input'
            });
            secondId = this.handlers.generateStepId('c');
            this.handlers.addConnection({
                id: secondId,
                sourceStepId: addedId,
                targetStepId: original.targetStepId,
                sourcePort: outputs[0],
                targetPort: original.targetPort || 'input'
            });
            this.clearContext();
            return addedId;
        } catch (error) {
            if (targetGeometry && this.handlers.updateStepPosition) {
                this.handlers.updateStepPosition(original.targetStepId, originalTargetPosition);
            }
            this.handlers.removeItem(addedId);
            this.handlers.removeItem(firstId);
            this.handlers.removeItem(secondId);
            return null;
        }
    }

    /**
     * Clears the insertion context (cancel, source deletion, destroy).
     *
     * @returns {void} Nothing.
     * @private
     */
    public clearContext(): void {
        this.context = null;
    }
}
