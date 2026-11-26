import { WorkflowStep } from '../models/workflow-step';

interface SwitchBranch {
    branchName?: unknown;
}

interface StepProps {
    branches?: unknown;
    defaultBranch?: unknown;
    errorPort?: unknown;
}

/**
 * Derives the public input and output ports for workflow steps.
 *
 * @private
 */
export class PortResolver {
    /**
     * Returns the primary output port names supported by a workflow step.
     *
     * @param {WorkflowStep} step - The workflow step to inspect.
     * @returns {string[]} The supported output port names.
     * @private
     */
    public static getOutputPorts(step: WorkflowStep): string[] {
        switch (step.stepType) {
        case 'Condition':
            return PortResolver.withError(['true', 'false'], step);
        case 'Switch':
            return PortResolver.withError(PortResolver.getSwitchBranchNames(step.props), step);
        case 'Loop':
            return PortResolver.withError(['loop', 'done'], step);
        case 'Approve':
            return PortResolver.withError(['approved', 'declined'], step);
        case 'End':
            return [];
        default:
            return PortResolver.withError(['output'], step);
        }
    }

    /**
     * Requires Input Port.
     *
     * @param {WorkflowStep} step The step.
     * @returns {boolean} The result.
     * @private
     */
    public static requiresInputPort(step: WorkflowStep): boolean {
        return !PortResolver.isTrigger(step.stepType);
    }

    /**
     * True for steps with more than one primary output port (Condition,
     * Switch, Loop, Approve). These draw labeled output ports on the right
     * edge and therefore keep the wider default node box.
     *
     * Error ports are intentionally ignored here — adding an error port
     * widens the diagram port stack but does not change the visual card,
     * so the card width rule stays keyed off the primary ports only.
     *
     * @param {WorkflowStep} step - The workflow step to inspect.
     * @returns {boolean} Whether the step has multiple primary outputs.
     * @private
     */
    public static isMultiOutputStep(step: WorkflowStep): boolean {
        switch (step.stepType) {
        case 'Condition':
        case 'Switch':
        case 'Loop':
        case 'Approve':
            return true;
        default:
            return false;
        }
    }

    /**
     * Is Trigger.
     *
     * @param {string} stepType The step type.
     * @returns {boolean} The result.
     * @private
     */
    public static isTrigger(stepType?: string): boolean {
        return stepType === 'ManualTrigger' || stepType === 'ScheduledTrigger'
            || stepType === 'WebhookTrigger' || stepType === 'FormInputTrigger';
    }

    /**
     * Allows Multiple Incoming.
     *
     * @param {WorkflowStep} step The step.
     * @returns {boolean} The result.
     * @private
     */
    public static allowsMultipleIncoming(step: WorkflowStep): boolean {
        // A node can be reached by more than one branch. Execution walks
        // each incoming branch independently, so rejecting fan-in here would
        // make otherwise valid workflows fail before they can run. Triggers
        // are still protected by the validator because they are entry points,
        // not merge targets.
        return !PortResolver.isTrigger(step.stepType);
    }

    /**
     * Allows Fan Out.
     *
     * @param {WorkflowStep} _step The step.
     * @param {string} _sourcePort The source port.
     * @returns {boolean} The result.
     * @private
     */
    public static allowsFanOut(_step: WorkflowStep, _sourcePort?: string): boolean {
        void _step;
        void _sourcePort;
        return false;
    }

    private static withError(ports: string[], step: WorkflowStep): string[] {
        if (step.stepType === 'End' || PortResolver.isTrigger(step.stepType)) {
            return ports;
        }
        const handling: { errorPort?: boolean } = step.errorHandling || {};
        if (handling.errorPort) {
            if (ports.indexOf('error') === -1) {
                return ports.concat(['error']);
            }
        }
        return ports;
    }

    /**
     * Switch outputs: ordered unique branch names, then a trailing default port.
     * Empty/missing branches seed `branch1` so new Switch nodes match Condition
     * (two right ports: first branch + default). Default is always present so
     * no-match paths can connect via the named `defaultBranch` port (or `default`
     * when unspecified). Switch always falls through to this port on no-match.
     *
     * @param {object} props - The step properties to inspect.
     * @returns {string[]} The ordered unique Switch output names.
     */
    private static getSwitchBranchNames(props: unknown): string[] {
        const names: string[] = [];
        const seen: { [name: string]: boolean } = Object.create(null);
        if (PortResolver.isRecord(props) && Array.isArray((props as StepProps).branches)) {
            ((props as StepProps).branches as unknown[]).forEach((branch: unknown) => {
                if (!PortResolver.isRecord(branch)) {
                    return;
                }
                const branchName: unknown = (branch as SwitchBranch).branchName;
                if (typeof branchName !== 'string' || !branchName || seen[`${branchName}`]) {
                    return;
                }
                seen[`${branchName}`] = true;
                names.push(branchName);
            });
        }
        if (!names.length) {
            names.push('branch1');
            seen.branch1 = true;
        }
        const record: StepProps = PortResolver.isRecord(props) ? props as StepProps : {};
        const fallback: string = typeof record.defaultBranch === 'string' && record.defaultBranch
            ? record.defaultBranch
            : 'default';
        if (!seen[`${fallback}`]) {
            names.push(fallback);
        }
        return names;
    }

    /**
     * Recommended canvas height for a Switch step given its output ports.
     *
     * @param {WorkflowStep} step - The Switch step to inspect.
     * @returns {number} The recommended canvas height.
     * @private
     */
    public static getSwitchNodeHeight(step: WorkflowStep): number {
        const outputPortCount: number = PortResolver.getOutputPorts(step).length;
        const baseHeight: number = 80;
        const additionalPortSpacing: number = 30;
        return baseHeight + Math.max(0, outputPortCount - 2) * additionalPortSpacing;
    }

    private static isRecord(value: unknown): value is Record<string, unknown> {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
}
