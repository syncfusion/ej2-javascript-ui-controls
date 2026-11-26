import { WorkflowRuntimeContext, WorkflowStepResult, WorkflowRunInput } from '../models/workflow-runtime-context';
import { WorkflowStepType } from '../models/workflow-enums';

/**
 * Owns the runtime-only workflow context. Never overwrites persisted step props.
 *
 * @private
 */
export class RuntimeContextStore {
    private context: WorkflowRuntimeContext = {};
    /** Every step result in run order; unlike `context.nodes` it keeps repeated visits (loops). */
    private history: WorkflowStepResult[] = [];

    /**
     * Returns copies of every step result in run order, including repeated visits.
     *
     * @returns {WorkflowStepResult[]} The ordered step results.
     * @private
     */
    public stepResults(): WorkflowStepResult[] {
        return JSON.parse(JSON.stringify(this.history)) as WorkflowStepResult[];
    }

    /**
     * Snapshot.
     *
     * @returns {WorkflowRuntimeContext} The result.
     * @private
     */
    public snapshot(): WorkflowRuntimeContext {
        return JSON.parse(JSON.stringify(this.context || {})) as WorkflowRuntimeContext;
    }

    /**
     * Get.
     *
     * @returns {WorkflowRuntimeContext} The result.
     * @private
     */
    public get(): WorkflowRuntimeContext {
        return this.context;
    }

    /**
     * Set Input.
     *
     * @param {Object} response The response.
     * @param {Object} [webhook] The webhook request details, set only by `triggerWebhook`.
     * @returns {void} Nothing.
     * @private
     */
    public setInput(response: unknown, webhook?: WorkflowRunInput['webhook']): void {
        this.context.input = webhook ? { response: response as Object, webhook } : { response: response as Object };
    }

    /**
     * Frame stack pushed by `enterLoop` and popped by `exitLoop` so we
     * can restore the prior previousStep / loop context when a loop
     * ends. Each frame captures the state *before* the loop entered.
     * Nested loops end up with multiple frames on the stack.
     */
    private loopStack: Array<{
        loopStepId: string;
        priorPreviousStep: WorkflowRuntimeContext['previousStep'];
        priorLoop: WorkflowRuntimeContext['loop'];
    }> = [];

    /**
     * Record Step.
     *
     * @param {string} id The id.
     * @param {WorkflowStepType} stepType The step type.
     * @param {string} name The step name.
     * @param {Object} response The response.
     * @returns {void} Nothing.
     * @private
     */
    public recordStep(id: string, stepType: WorkflowStepType | string, name: string, response: unknown): void {
        const result: WorkflowStepResult = { id, stepType: String(stepType) as WorkflowStepType, name, response: response as Object };
        this.history.push({ ...result });
        if (!this.context.nodes) {
            this.context.nodes = {};
        }
        // eslint-disable-next-line security/detect-object-injection
        this.context.nodes[id] = result;
        this.context.previousStep = { id, stepType: String(stepType) as WorkflowStepType, response: response as Object };
    }

    /**
     * Push a new loop scope onto the stack. Must be called once before
     * any `setLoop` calls for this loop — it captures the pre-loop state
     * needed to restore previousStep / outer-loop context on `exitLoop`.
     *
     * `all` is the array the loop will iterate over; it is stored on the
     * loop context so the variable picker can expose `$.loop.all`.
     *
     * @param {string} loopStepId - provide the loop step id.
     * @param {unknown[]} all - provide the iteration items.
     * @returns {void}    Used to push a new loop scope onto the stack.
     * @private
     */
    public enterLoop(loopStepId: string, all: unknown[]): void {
        this.loopStack.push({
            loopStepId: loopStepId,
            priorPreviousStep: this.context.previousStep,
            priorLoop: this.context.loop
        });
        const safeAll: unknown[] = Array.isArray(all) ? all : [];
        // Index starts at -1 so the first setLoop() deterministically
        // bumps it instead of guessing what "no iteration yet" means.
        this.context.loop = { index: -1, count: safeAll.length, currentItem: undefined, all: safeAll };
    }

    /**
     * Update the live iteration context (called once per iteration).
     * Overrides `previousStep.response` so body steps binding to
     * `{{$.previousStep}}` naturally receive one iteration item instead
     * of the whole array — fixing the "loop passes the entire array to
     * the next node" bug. The previousStep's id and stepType are
     * preserved (taken from the frame pushed by `enterLoop`) so
     * `$.previousStep.id` still resolves to the outer predecessor.
     *
     * @param {number} index - provide the current iteration index.
     * @param {number} count - provide the total iteration count.
     * @param {unknown} currentItem - provide the current iteration item.
     * @param {unknown[]} all - provide the full iteration items.
     * @returns {void}    Used to update the live iteration context.
     * @private
     */
    public setLoop(index: number, count: number, currentItem: unknown, all: unknown[]): void {
        const safeAll: unknown[] = Array.isArray(all) ? all : (this.context.loop ? this.context.loop.all : []);
        this.context.loop = { index, count, currentItem, all: safeAll };
        const frame: { priorPreviousStep: WorkflowRuntimeContext['previousStep'] } | undefined =
            this.loopStack.length ? this.loopStack[this.loopStack.length - 1] : undefined;
        const prior: WorkflowRuntimeContext['previousStep'] = frame
            ? frame.priorPreviousStep
            : this.context.previousStep;
        this.context.previousStep = {
            id: prior ? prior.id : '_loop',
            stepType: prior ? prior.stepType : 'Loop',
            response: currentItem as Object
        };
    }

    /**
     * Pop the most recent loop frame. Restores previousStep to the
     * value captured at `enterLoop` and restores any outer-loop
     * context that was active before this loop began. Nested loops
     * unwind in reverse entry order.
     *
     * @returns {void}    Used to pop the most recent loop frame.
     * @private
     */
    public exitLoop(): void {
        this.context.loop = undefined;
        const popped: { priorPreviousStep: WorkflowRuntimeContext['previousStep']; priorLoop: WorkflowRuntimeContext['loop'] } | undefined = this.loopStack.pop();
        if (popped) {
            this.context.previousStep = popped.priorPreviousStep;
            if (popped.priorLoop !== undefined && this.context.loop === undefined) {
                this.context.loop = popped.priorLoop;
            }
        }
    }

    /**
     * Back-compat alias kept so the existing simulation controller's
     * `clearLoop()` call site still resolves. New callers should
     * prefer `exitLoop()`; both are equivalent.
     *
     * @returns {void}    Used to pop the most recent loop frame.
     * @private
     */
    public clearLoop(): void {
        this.exitLoop();
    }

    /**
     * Set Variable.
     *
     * @param {string} name The name.
     * @param {Object} value The value.
     * @returns {void} Nothing.
     * @private
     */
    public setVariable(name: string, value: unknown): void {
        if (!this.context.variables) {
            this.context.variables = {};
        }
        // eslint-disable-next-line security/detect-object-injection
        this.context.variables[name] = value;
    }

    /**
     * Reset is also responsible for clearing any in-flight loop stack so
     * a reset during a loop doesn't leak the loop context into the next run.
     *
     * @returns {void}    Used to reset the runtime context store.
     * @private
     */
    public reset(): void {
        this.context = {};
        this.history = [];
        this.loopStack.length = 0;
    }
}
