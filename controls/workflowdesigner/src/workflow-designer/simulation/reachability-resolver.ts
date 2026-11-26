import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowStep } from '../models/workflow-step';

/**
 * Deterministic upstream reachability for runtime-context suggestions.
 *
 * @private
 */
export class ReachabilityResolver {
    /**
     * Get Upstream Step Ids.
     *
     * @param {string} selectedStepId The selected step id.
     * @param {WorkflowStepModel} steps The steps.
     * @param {WorkflowConnectionModel} connections The connections.
     * @returns {string} The result.
     * @private
     */
    public static getUpstreamStepIds(
        selectedStepId: string,
        steps: WorkflowStep[],
        connections: WorkflowConnection[]
    ): string[] {
        const incoming: { [id: string]: string[] } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            const target: string = connection.targetStepId || '';
            const source: string = connection.sourceStepId || '';
            // Workflow step IDs are dynamic graph keys.
            // eslint-disable-next-line security/detect-object-injection
            if (!incoming[target]) {
                // Workflow step IDs are dynamic graph keys.
                // eslint-disable-next-line security/detect-object-injection
                incoming[target] = [];
            }
            // Workflow step IDs are dynamic graph keys.
            // eslint-disable-next-line security/detect-object-injection
            incoming[target].push(source);
        });
        const visited: { [id: string]: boolean } = Object.create(null);
        const ordered: string[] = [];
        const visit: (id: string) => void = (id: string): void => {
            // Workflow step IDs are dynamic graph keys.
            // eslint-disable-next-line security/detect-object-injection
            (incoming[id] || []).forEach((sourceId: string) => {
                // Workflow step IDs are dynamic graph keys.
                // eslint-disable-next-line security/detect-object-injection
                if (visited[sourceId] || sourceId === selectedStepId) {
                    return;
                }
                // Workflow step IDs are dynamic graph keys.
                // eslint-disable-next-line security/detect-object-injection
                visited[sourceId] = true;
                visit(sourceId);
                ordered.push(sourceId);
            });
        };
        visit(selectedStepId);
        return ordered;
    }

    /**
     * Get Direct Predecessor.
     *
     * @param {string} selectedStepId The selected step id.
     * @param {WorkflowConnectionModel} connections The connections.
     * @returns {string} The result.
     * @private
     */
    public static getDirectPredecessor(
        selectedStepId: string,
        connections: WorkflowConnection[]
    ): string | null {
        const match: WorkflowConnection | undefined = connections.filter(
            (connection: WorkflowConnection) => connection.targetStepId === selectedStepId
        )[0];
        return match && match.sourceStepId ? match.sourceStepId : null;
    }

    /**
     * Walk every incoming edge to `selectedStepId` and look for Loop steps
     * connected via their `loop` body port. The IDs returned are the loop
     * steps that contain the selected step in their iteration body.
     *
     * Loop steps have two output ports:
     *   - `loop`  → body steps (executed once per item)
     *   - `done`  → steps after the loop finishes
     * A step reached via a `loop` edge is "inside the loop body" and
     * inherits `$.loop.*` bindings from the live runtime context.
     *
     * The function visits loops in incoming-BFS order. The first entry
     * is the innermost enclosing loop; later entries are enclosing loops
     * for nested-for-loop scenarios (rare but supported).
     *
     * @param {string} selectedStepId - Step whose enclosing loops are needed.
     * @param {WorkflowStep[]} steps - Workflow steps to inspect.
     * @param {WorkflowConnection[]} connections - Workflow connections.
     * @returns {string[]} Enclosing loop step IDs.
     * @private
     */
    public static findEnclosingLoops(
        selectedStepId: string,
        steps: WorkflowStep[],
        connections: WorkflowConnection[]
    ): string[] {
        const stepMap: { [id: string]: WorkflowStep } = Object.create(null);
        steps.forEach((step: WorkflowStep) => {
            if (step.id) {
                stepMap[step.id] = step;
            }
        });
        const visited: { [id: string]: boolean } = Object.create(null);
        const enclosing: string[] = [];
        const queue: string[] = [];
        const incoming: { [id: string]: WorkflowConnection[] } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            const target: string = connection.targetStepId || '';
            const targetConnections: WorkflowConnection[] | undefined = incoming[`${target}`];
            if (targetConnections) {
                targetConnections.push(connection);
            } else {
                Object.defineProperty(incoming, target, {
                    configurable: true,
                    enumerable: true,
                    value: [connection],
                    writable: true
                });
            }
        });
        const enqueue: (id: string | undefined) => void = (id: string | undefined): void => {
            if (!id || visited[id]) { // eslint-disable-line security/detect-object-injection
                return;
            }
            // Workflow step IDs are dynamic graph keys.
            // eslint-disable-next-line security/detect-object-injection
            visited[id] = true;
            queue.push(id);
        };
        enqueue(selectedStepId);
        while (queue.length) {
            const current: string = queue.shift() as string;
            // Workflow step IDs are dynamic graph keys.
            // eslint-disable-next-line security/detect-object-injection
            const edges: WorkflowConnection[] = incoming[current] || [];
            edges.forEach((edge: WorkflowConnection) => {
                const sourceId: string = edge.sourceStepId || '';
                // Workflow step IDs are dynamic graph keys.
                // eslint-disable-next-line security/detect-object-injection
                const sourceStep: WorkflowStep | undefined = stepMap[sourceId];
                if (!sourceStep) {
                    return;
                }
                const port: string = ReachabilityResolver.logicalSourcePort(edge.sourcePort);
                if (sourceStep.stepType === 'Loop' && port === 'loop') {
                    if (enclosing.indexOf(sourceId) === -1) {
                        enclosing.push(sourceId);
                    }
                }
                enqueue(sourceId);
            });
        }
        return enclosing;
    }

    /**
     * Normalize connector source-port strings to the logical branch name
     * used by the dispatcher ('true', 'false', 'output', 'loop', 'done',
     * 'error', 'default'). Mirrors `SimulationController.logicalPort` so
     * port ids emitted by the diagram (e.g. `Loop:output:loop`) resolve
     * back to the same branch.
     * /
     *
     * @param {string} sourcePort - Raw connector source-port identifier.
     * @returns {string} Logical source-port name.
     */
    private static logicalSourcePort(sourcePort?: string): string {
        const raw: string = String(sourcePort || '').trim();
        if (!raw) {
            return 'output';
        }
        if (raw.indexOf(':') === -1) {
            return raw;
        }
        const parts: string[] = raw.split(':').filter((part: string) => part.length > 0);
        return parts.length ? parts[parts.length - 1] : raw;
    }
}
