import { NodeModel, PointPortModel, PortConstraints, PortVisibility, ShapeStyleModel } from '@syncfusion/ej2-diagrams';
import { WorkflowStepAppearance } from '../models/workflow-appearance';
import { WorkflowPosition } from '../models/workflow-position';
import { WorkflowSize } from '../models/workflow-size';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStepState } from '../models/workflow-step-template';
import { WorkflowStepType } from '../models/workflow-enums';
import { PortResolver } from '../mapping/port-resolver';
import { FormatterOutput, WorkflowFormatterRuntimeOutput } from '../simulation/formatter-output';
import { WorkflowNodeCatalog, WorkflowNodeCatalogEntry } from './node-catalog';

/**
 * Produces the custom content nodes for a workflow step, or `null` when no custom template is configured.
 *
 * @private
 */
export type WorkflowStepTemplateRenderer = (step: WorkflowStep, state: WorkflowStepState) => Node[] | null;

/** Square card edge length. Mirrors `--wf-node-card-size` in
 * `src/styles/workflow-designer.scss`. Bounds for the Diagram node are
 * **exactly** this size so layout/routing is square; the caption and
 * port labels render as *overflowed* HTML siblings positioned outside
 * the bounds (see `createCardHtml`). */
const NODE_CARD_SIZE: number = 80;
/** Compact fallback width/height for ALL single-output steps. Bounds
 * stay exactly 80×80 — caption + port labels are rendered as overflowed
 * HTML siblings so they do not consume layout space. */
const SINGLE_OUTPUT_NODE_WIDTH: number = NODE_CARD_SIZE;
const SINGLE_OUTPUT_NODE_HEIGHT: number = NODE_CARD_SIZE;
/** Width / height for multi-output steps (Condition, Switch, Loop, Approve).
 * Same exact square bounds as single-output; the right-side port-label
 * column is rendered as overflow HTML siblings too, but only the row
 * portion (top: 0, bottom: caption-height). */
const MULTI_OUTPUT_NODE_WIDTH: number = NODE_CARD_SIZE;
const MULTI_OUTPUT_NODE_HEIGHT: number = NODE_CARD_SIZE;
/** Expanded Formatter canvas size while runtime formatted output is present
 *. The Formatter with runtime output is the *only* shape
 * that occupies non-square bounds; the compact (collapsed) Formatter still
 * uses the 80×80 square. */
const FORMATTER_NODE_WIDTH: number = 200;
const FORMATTER_NODE_HEIGHT: number = 190;
/** Marks the component-owned host of custom template content. */
const CUSTOM_HOST_ATTRIBUTE: string = 'data-wf-step-custom';
const DEFAULT_NODE_FILL: string = '#ffffff';
/** Default node stroke — mirrors `--wf-color-border` defined in
 * workflow-designer.scss. Kept as a literal fallback so the Diagram HTML
 * node still paints correctly when host pages override the token.
 */
const DEFAULT_NODE_STROKE: string = '#64748b';
/** Default node stroke color for the node-name caption below the card.
 * Mirrors the stroke so the caption reads as part of the same visual unit. */
const DEFAULT_NODE_LABEL_COLOR: string = '#64748b';
/** Default node stroke width — mirrors `--wf-node-stroke-width`. */
const DEFAULT_NODE_STROKE_WIDTH: number = 2;
/** Runtime-state stroke colors — mirror `--wf-color-state-*` tokens in
 * workflow-designer.scss. Inline so runtime highlights survive any
 * consumer-side theming refactor. */
const RUNNING_NODE_STROKE: string = '#1565c0';
const COMPLETED_NODE_STROKE: string = '#2e7d32';
const FAILED_NODE_STROKE: string = '#d32f2f';
/**
 * Renders executable workflow steps as Diagram HTML nodes via the
 * functional-template mechanism supported by the installed Diagram version
 *. The Diagram HTML-node `content` is supplied as an HTML string
 * template with `${}` bindings. The template root is always `e-wf-step-card`
 * containing the step icon and label in compact mode, and the label plus
 * formatted body in expanded Formatter mode; icon, `name`, runtime state
 * class and appearance overrides are bound inline,
 * so Diagram receives the complete card — not an icon span or partial
 * template.
 *
 * Returning an HTML string template is the installed Diagram version's
 * supported functional-template content form. Public appearance overrides are
 * honored; documented defaults are applied when appearance values are absent.
 * Runtime visual states (idle/running/completed/failed) are exposed as
 * component-owned CSS classes; a failed node applies a red stroke.
 *
 * This is a P0 visual milestone (per `ui-implementation-roadmap.md` R2). Basic
 * Rectangle nodes are not the final workflow-step renderer.
 *
 * @internal
 * @private
 */
export class WorkflowStepRenderer {
    /** Step models keyed by Diagram node id (stable across Diagram.add clones). */
    private readonly stepById: Map<string, WorkflowStep> = new Map<string, WorkflowStep>();
    /** Visual states keyed by Diagram node id. */
    private readonly stateById: Map<string, WorkflowStepState> = new Map<string, WorkflowStepState>();

    /**
     * Renders a workflow step as a Diagram HTML node with derived ports.
     *
     * @param {WorkflowStep} step The workflow step model to render.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {NodeModel} The Diagram node model representing the rendered step.
     * @private
     */
    public render(step: WorkflowStep, template?: WorkflowStepTemplateRenderer): NodeModel {
        const appearance: WorkflowStepAppearance | undefined = step.appearance;
        const position: WorkflowPosition | undefined = step.position;
        const size: WorkflowSize | undefined = step.size;
        const nodeId: string = step.id || '';
        const resolvedSize: WorkflowSize = WorkflowStepRenderer.resolveNodeSize(step, size);
        const width: number = resolvedSize.width;
        const height: number = resolvedSize.height;
        // Persist computed Switch / Formatter runtime size so model stays aligned.
        if (step.stepType === 'Switch' || WorkflowStepRenderer.hasFormatterRuntime(step)) {
            step.size = { width: width, height: height };
        }
        const content: HTMLElement = WorkflowStepRenderer.createInitialContentElement(step, 'idle', template);
        const custom: boolean = !!content.querySelector('[' + CUSTOM_HOST_ATTRIBUTE + ']');
        const node: NodeModel = {
            id: step.id,
            offsetX: position && typeof position.x === 'number' ? position.x : 0,
            offsetY: position && typeof position.y === 'number' ? position.y : 0,
            width: width,
            height: height,
            shape: {
                type: 'HTML',
                content: content
            },
            addInfo: { isWorkflowNode: true, workflowStepType: step.stepType, workflowStep: step },
            style: custom ? this.createCustomStyle() : this.createStyle(appearance),
            ports: this.createPorts(step)
        };
        this.stepById.set(nodeId, step);
        this.stateById.set(nodeId, 'idle');
        return node;
    }

    /**
     * Repaints a node's size, style and content. A custom template gets a neutral node style, so the
     * step appearance and state colors only ever reach the built-in content.
     *
     * @param {NodeModel} node The live Diagram node.
     * @param {WorkflowStep} step The workflow step.
     * @param {WorkflowStepState} state The current visual state.
     * @param {WorkflowStepTemplateRenderer} [template] Optional custom step content renderer.
     * @returns {void}
     */
    private paint(
        node: NodeModel,
        step: WorkflowStep,
        state: WorkflowStepState,
        template?: WorkflowStepTemplateRenderer
    ): void {
        const content: HTMLElement = WorkflowStepRenderer.createCardElement(step, state, template);
        const custom: boolean = content.hasAttribute(CUSTOM_HOST_ATTRIBUTE);
        node.style = custom ? this.createCustomStyle() : this.createStyle(step.appearance);
        WorkflowStepRenderer.applyResolvedNodeSize(node, step);
        WorkflowStepRenderer.setHtmlContent(node, content);
    }

    /**
     * Replaces the stored step reference with the live workflow model object.
     * Keeps simulation mutations (e.g. Formatter runtimeOutput) visible on paint.
     *
     * @param {WorkflowStep} step The workflow step to persist as the renderer reference.
     * @returns {void}
     * @private
     */
    public syncStoredStep(step: WorkflowStep): void {
        const nodeId: string = step && step.id ? String(step.id) : '';
        if (!nodeId) {
            return;
        }
        this.stepById.set(nodeId, step);
    }

    /**
     * Applies property changes onto the stored step and the live Diagram node.
     * Mutates the stored step in place so identity stays aligned with workflowSteps
     * (Formatter runtimeOutput is written on that same object during simulation).
     *
     * @param {NodeModel} node The live Diagram node model to mutate.
     * @param {Partial<WorkflowStep>} changes The subset of step properties to apply.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void}
     * @private
     */
    public applyChanges(node: NodeModel, changes: Partial<WorkflowStep>, template?: WorkflowStepTemplateRenderer): void {
        const step: WorkflowStep = this.getStoredStep(node);
        Object.assign(step, changes);
        const nodeId: string = String(node.id || step.id || '');
        this.stepById.set(nodeId, step);
        node.addInfo = { isWorkflowNode: true, workflowStepType: step.stepType, workflowStep: step };
        if (changes.name !== undefined
            || changes.stepType !== undefined
            || 'appearance' in changes
            || 'stateAppearance' in changes
            || 'size' in changes
            || changes.customProps !== undefined
            || changes.props !== undefined) {
            const state: WorkflowStepState = this.stateById.get(nodeId) || 'idle';
            this.paint(node, step, state, template);
        }
        if (changes.position) {
            if (typeof changes.position.x === 'number') {
                node.offsetX = changes.position.x;
            }
            if (typeof changes.position.y === 'number') {
                node.offsetY = changes.position.y;
            }
        }
        // Switch / Formatter sizing is applied by `applyResolvedNodeSize` above
        // (which delegates to `resolveNodeSize` → `PortResolver.getSwitchNodeHeight`
        // and persists `step.size`). Re-asserting it here would be redundant and
        // races with the port-sync pass in `DiagramMapper.updateNode`.
        // Port topology is applied by DiagramMapper via diagram.addPorts/removePorts.
        // Assigning node.ports alone does not create port wrappers, so ports stay invisible.
        if (changes.stepType !== undefined) {
            this.storeStepType(node, changes.stepType);
        }
    }

    /**
     * Builds the desired Diagram ports for a step (input + typed outputs).
     * Used by DiagramMapper to sync live ports through EJ2 addPorts/removePorts.
     *
     * @param {WorkflowStep} step The workflow step whose ports should be derived.
     * @returns {PointPortModel[]} The list of Diagram port models for the step.
     * @private
     */
    public buildPorts(step: WorkflowStep): PointPortModel[] {
        return this.createPorts(step);
    }

    /**
     * True when port ids and offsets (order-sensitive) match — used to skip
     * no-op port sync while still applying Switch branch Y redistributes.
     *
     * @param {PointPortModel[] | undefined} current The existing port topology on the live node.
     * @param {PointPortModel[]} next The desired port topology.
     * @returns {boolean} `true` when the two port topologies are equivalent.
     * @private
     */
    public portsMatch(
        current: PointPortModel[] | undefined,
        next: PointPortModel[]
    ): boolean {
        return WorkflowStepRenderer.samePortTopology(current, next);
    }

    /**
     * Re-asserts the resolved width/height onto the live node model.
     *
     * EJ2's `diagram.addPorts` / `removePorts` internally rebuilds the node
     * wrapper and can reset bounds that were set just before the port
     * operation; without a follow-up re-assert, models are left with the
     * stale pre-call dimensions and only catch up after the next
     * `diagram.dataBind()`-triggering path (e.g. execution start). Callers
     * that mutate ports must call this immediately after `addPorts` /
     * `updateDiagramObject` so the height converges immediately.
     *
     * @param {NodeModel} node The live Diagram node model to re-dimension.
     * @param {WorkflowStep} step The workflow step that owns the node.
     * @returns {void}
     * @private
     */
    public reapplyNodeSize(node: NodeModel, step: WorkflowStep): void {
        WorkflowStepRenderer.applyResolvedNodeSize(node, step);
    }
    /**
     * Re-asserts the full card visual (size + style + HTML content) on a live
     * Diagram node using the stored visual state. Mirrors the work
     * `setVisualState` performs, but without changing the runtime state, so it
     * is safe to call from `DiagramMapper.updateNode` after a port topology
     * change that may have replaced the node instance.
     *
     * @param {NodeModel} node The live Diagram node model to repaint.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void}
     * @private
     */
    public repaintHtml(node: NodeModel, template?: WorkflowStepTemplateRenderer): void {
        const nodeId: string = String(node.id || '');
        const storedStep: WorkflowStep = this.getStoredStep(node);
        const state: WorkflowStepState = this.stateById.get(nodeId)
            || WorkflowStepRenderer.readStateFromAddInfo(node)
            || 'idle';
        node.addInfo = {
            isWorkflowNode: true,
            workflowStepType: storedStep.stepType,
            workflowStep: storedStep,
            visualState: state
        };
        this.paint(node, storedStep, state, template);
    }
    /**
     * Updates the runtime visual state of a rendered node.
     * Matches the EJ2 HTML update pattern:
     *   (node.shape as any).content = template(node);
     *   diagram.dataBind();  // caller
     *
     * @param {NodeModel} node The live Diagram node model whose state should change.
     * @param {WorkflowStepState} state The new runtime visual state.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {void}
     * @private
     */
    public setVisualState(node: NodeModel, state: WorkflowStepState, template?: WorkflowStepTemplateRenderer): void {
        const nodeId: string = String(node.id || '');
        this.stateById.set(nodeId, state);
        const storedStep: WorkflowStep = this.getStoredStep(node);
        // Keep addInfo.workflowStep current so the template function can read it.
        node.addInfo = {
            isWorkflowNode: true,
            workflowStepType: storedStep.stepType,
            workflowStep: storedStep,
            visualState: state
        };
        this.paint(node, storedStep, state, template);
    }

    /**
     * Stops the running animation of a node and transitions its stored visual
     * state off `running` so the stop is durable across later repaints.
     *
     * Only the dashed execution-path animation is removed; the card keeps a
     * `completed` paint (matching the historical stop contract: a stopped run
     * keeps its status colors, not its motion). Crucially, the tracked
     * `stateById` / `addInfo.visualState` entries and the `e-wf-state-running`
     * card class are also cleared — otherwise the next `dataBind()` /
     * selection repaint would rebuild the card from the stale `running` state
     * and re-create the animated SVG (Stop visually "not sticking").
     *
     * @param {NodeModel} node The live Diagram node.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {boolean} True when a running node's animation was stopped.
     */
    public stopStepAnimation(node: NodeModel, template?: WorkflowStepTemplateRenderer): boolean {
        const nodeId: string = String(node.id || '');
        if (!nodeId) {
            return false;
        }

        const state: WorkflowStepState = this.stateById.get(nodeId) || 'idle';
        if (state !== 'running') {
            return false;
        }

        // Transition the tracked state first so a full repaint (below) and any
        // later dataBind() render the completed card, never the running one.
        this.stateById.set(nodeId, 'completed');
        if (node.addInfo && typeof node.addInfo === 'object') {
            (node.addInfo as { visualState?: unknown }).visualState = 'completed';
        }

        const card: Element | null = this.findStepCard(node);
        if (card instanceof HTMLElement) {
            card.classList.remove('e-wf-state-running');
        } else if (template) {
            // Custom content has no built-in animation to strip; repaint it for the new state.
            this.paint(node, this.getStoredStep(node), 'completed', template);
            return true;
        }

        if (!node.shape || (node.shape as { type?: string }).type !== 'HTML') {
            return false;
        }

        const content: unknown = (node.shape as { content?: string | HTMLElement | Function }).content;
        if (!(content instanceof HTMLElement)) {
            const storedStep: WorkflowStep = this.getStoredStep(node);
            WorkflowStepRenderer.setHtmlContent(node, WorkflowStepRenderer.createCardElement(storedStep, 'completed', template));
            return true;
        }

        const executionPath: Element | null = content.querySelector('.e-wf-execution-path');
        if (!executionPath) {
            // No animation element to strip, but the state transition above
            // still counts as stopping the node's running animation.
            return true;
        }

        executionPath.remove();
        return true;
    }

    /**
     * Finds the rendered step-card element of a node when available.
     *
     * @param {NodeModel} node The live Diagram node.
     * @returns {Element | null} The `e-wf-step-card` element, or null.
     */
    private findStepCard(node: NodeModel): Element | null {
        const shape: unknown = node.shape;
        const content: unknown =
            shape && typeof shape === 'object'
                ? (shape as { content?: unknown }).content
                : undefined;
        if (content instanceof HTMLElement) {
            return content.classList && content.classList.contains('e-wf-step-card')
                ? content
                : content.querySelector('.e-wf-step-card');
        }
        return null;
    }

    /**
     * Assigns a concrete workflow-card HTMLElement to a Diagram HTML node.
     *
     * This method is used after initial Diagram materialization. The supplied
     * element must be the actual e-wf-step-card and not the initial template
     * host element.
     *
     * @param {NodeModel} node The live Diagram node.
     * @param {HTMLElement} content The complete workflow-card element.
     * @returns {void} Nothing.
     */
    public static setHtmlContent(node: NodeModel, content: HTMLElement): void {
        const shape: { type?: string; content?: string | HTMLElement | Function } =
            node.shape as { type?: string; content?: string | HTMLElement | Function };

        if (!shape || shape.type !== 'HTML') {
            node.shape = { type: 'HTML', content: content };
            return;
        }

        shape.content = content;
    }

    /**
     * Returns the stored workflow step for a rendered node.
     *
     * @param {NodeModel} node The Diagram node model whose stored step should be returned.
     * @returns {WorkflowStep} The workflow step associated with the node.
     * @private
     */
    public getStoredStep(node: NodeModel): WorkflowStep {
        const nodeId: string = String(node.id || '');
        const stored: WorkflowStep | undefined = this.stepById.get(nodeId);
        if (stored) {
            return stored;
        }
        const value: unknown = (node as NodeModel & { addInfo?: { workflowStep?: WorkflowStep } }).addInfo;
        return value && typeof value === 'object' && (value as { workflowStep?: WorkflowStep }).workflowStep
            ? (value as { workflowStep: WorkflowStep }).workflowStep
            : { stepType: this.getStoredStepType(node), name: '' } as WorkflowStep;
    }

    /**
     * Returns a stable Diagram port ID for a public workflow port.
     *
     * @param {string} nodeId The Diagram node id that owns the port.
     * @param {string} portName The public workflow port name.
     * @param {boolean} input `true` when the port is an input port, `false` for output.
     * @returns {string} The stable Diagram port id.
     * @private
     */
    public getPortId(nodeId: string, portName: string, input: boolean): string {
        return input ? `${nodeId}:input` : `${nodeId}:output:${portName}`;
    }


    private static readStateFromAddInfo(node: NodeModel | undefined): WorkflowStepState | undefined {
        if (!node) {
            return undefined;
        }
        const value: unknown = (node as NodeModel & { addInfo?: { visualState?: WorkflowStepState } }).addInfo;
        return value && typeof value === 'object'
            ? (value as { visualState?: WorkflowStepState }).visualState
            : undefined;
    }

    /**
     * Creates the HTMLElement supplied during initial Diagram node creation.
     *
     * Diagram's initial HTML-template path treats the supplied HTMLElement as
     * a template container and materializes its first child. Therefore, the
     * actual workflow card must be wrapped in a temporary host element.
     *
     * The runtime shape.content update path does not require this host.
     *
     * @param {WorkflowStep} step The workflow step to render.
     * @param {WorkflowStepState} state The initial visual state.
     * @param {WorkflowStepTemplateRenderer} [template] - Optional custom step content renderer.
     * @returns {HTMLElement} A template host containing the complete workflow card.
     */
    private static createInitialContentElement(
        step: WorkflowStep,
        state: WorkflowStepState,
        template?: WorkflowStepTemplateRenderer
    ): HTMLElement {
        const host: HTMLDivElement = document.createElement('div');
        host.className = 'e-wf-step-template-host';
        host.appendChild(WorkflowStepRenderer.createCardElement(step, state, template));
        return host;
    }

    /**
     * Builds the complete workflow-step card as a concrete HTMLElement.
     *
     * The returned element preserves the existing class structure:
     *
     * - e-wf-step-card
     * - e-wf-state-{state}
     * - e-wf-execution-path
     * - e-wf-step-icon
     * - e-wf-step-icon-html
     * - e-wf-step-caption
     * - e-wf-port-labels
     * - e-wf-port-label
     * - e-wf-formatter-card
     * - e-wf-formatter-head
     * - e-wf-step-label
     * - e-wf-formatter-body
     * - e-wf-formatter-rendered
     *
     * No Diagram string template or template function is used.
     *
     * @param {WorkflowStep} step The workflow step model driving the card.
     * @param {WorkflowStepState} state The current runtime visual state.
     * @param {WorkflowStepTemplateRenderer} [template] Optional custom content renderer; when it yields nodes they replace the default content.
     * @returns {HTMLElement} A new HTMLElement representing the complete card.
     */
    private static createCardElement(
        step: WorkflowStep,
        state: WorkflowStepState,
        template?: WorkflowStepTemplateRenderer
    ): HTMLElement {
        const appearance: WorkflowStepAppearance | undefined = step.appearance;

        const customNodes: Node[] | null = template ? template(step, state) : null;
        if (customNodes) {
            // Custom content replaces the built-in card entirely. The host carries no built-in class,
            // state or appearance; it only fills the Diagram node so the content follows its size.
            const customHost: HTMLDivElement = document.createElement('div');
            customHost.setAttribute(CUSTOM_HOST_ATTRIBUTE, '');
            customHost.setAttribute('data-wf-step-id', step.id);
            customHost.style.cssText = 'position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;';
            customNodes.forEach((child: Node): void => {
                customHost.appendChild(child);
            });
            return customHost;
        }

        const card: HTMLDivElement = document.createElement('div');
        card.classList.add('e-wf-step-card');
        card.setAttribute('data-wf-step-id', step.id);
        const stateOverride: WorkflowStepAppearance | undefined = WorkflowStepRenderer.getStateOverride(step, state);
        WorkflowStepRenderer.applyCardAppearance(card, appearance, state, stateOverride);
        if (step.stepType === 'Formatter' && WorkflowStepRenderer.hasFormatterRuntime(step)) {
            card.classList.add('e-wf-formatter-card');
        }
        if (state !== 'idle') {
            card.classList.add('e-wf-state-' + state);
        }

        if (state === 'running') {
            card.appendChild(WorkflowStepRenderer.createExecutionPathElement());
        }

        if (step.stepType === 'Formatter') {
            const runtime: WorkflowFormatterRuntimeOutput | null = FormatterOutput.readRuntimeOutput(step.customProps);
            if (runtime) {
                WorkflowStepRenderer.appendFormatterContent(card, step, runtime);
                return card;
            }
        }

        const iconSlot: HTMLSpanElement = document.createElement('span');
        iconSlot.className = 'e-wf-step-icon';
        iconSlot.appendChild(WorkflowStepRenderer.createIconElement(step, appearance));
        card.appendChild(iconSlot);
        card.appendChild(WorkflowStepRenderer.createCaptionElement(step, state, appearance));

        const portLabels: HTMLElement | null = WorkflowStepRenderer.createPortLabelsElement(step);
        if (portLabels) {
            card.appendChild(portLabels);
        }

        return card;
    }

    /**
     * Creates the animated execution-border SVG used by running nodes.
     *
     * The SVG is constructed with the SVG namespace. It is not parsed from
     * an HTML string.
     *
     * @returns {SVGSVGElement} The running-state SVG element.
     */
    private static createExecutionPathElement(): SVGSVGElement {
        const svgNamespace: string = 'http://www.w3.org/2000/svg';
        const svg: SVGSVGElement = document.createElementNS(svgNamespace, 'svg') as SVGSVGElement;
        svg.setAttribute('class', 'e-wf-execution-path');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');

        const rect: SVGRectElement = document.createElementNS(svgNamespace, 'rect') as SVGRectElement;
        rect.setAttribute('x', '3');
        rect.setAttribute('y', '3');
        rect.setAttribute('width', '94');
        rect.setAttribute('height', '94');
        rect.setAttribute('rx', '10');
        rect.setAttribute('ry', '10');
        svg.appendChild(rect);
        return svg;
    }

    /**
     * The caption text color mirrors the node stroke for visual consistency by
     * default. Runtime-state overlays swap in the matching semantic colour so
     * the caption stays in lock-step with the highlighted card.
     *
     * @param {WorkflowStepState} state The current runtime visual state.
     * @param {WorkflowStepAppearance | undefined} appearance The optional appearance override.
     * @returns {string} The CSS color string for the caption text.
     */
    private static resolveCaptionColor(
        state: WorkflowStepState,
        appearance: WorkflowStepAppearance | undefined
    ): string {
        if (state === 'running') {
            return RUNNING_NODE_STROKE;
        }
        if (state === 'completed') {
            return COMPLETED_NODE_STROKE;
        }
        if (state === 'failed') {
            return FAILED_NODE_STROKE;
        }
        // Idle: `textColor`, when author-set, wins
        // over the implicit "matches the border" fallback so the caption can
        // pick a contrasting label color independent of `strokeColor`.
        if (appearance && appearance.textColor) {
            return appearance.textColor;
        }
        return appearance && appearance.strokeColor
            ? appearance.strokeColor
            : DEFAULT_NODE_LABEL_COLOR;
    }

    /**
     * Adds the expanded Formatter header and output body.
     *
     * @param {HTMLElement} card The formatter card element.
     * @param {WorkflowStep} step The Formatter workflow step.
     * @param {WorkflowFormatterRuntimeOutput} runtime Current Formatter runtime output.
     * @returns {void} Nothing.
     */
    private static appendFormatterContent(
        card: HTMLElement,
        step: WorkflowStep,
        runtime: WorkflowFormatterRuntimeOutput
    ): void {
        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-formatter-head';
        const label: HTMLSpanElement = document.createElement('span');
        label.className = 'e-wf-step-label';
        label.textContent = step.name || '';
        header.appendChild(label);
        card.appendChild(header);

        if (runtime.html) {
            const body: HTMLDivElement = document.createElement('div');
            body.classList.add('e-wf-formatter-body', 'e-wf-formatter-rendered');
            WorkflowStepRenderer.appendTrustedHtml(body, runtime.html);
            card.appendChild(body);
            return;
        }

        const body: HTMLPreElement = document.createElement('pre');
        body.className = 'e-wf-formatter-body';
        body.textContent = runtime.display || '';
        card.appendChild(body);
    }

    /** Tags the Formatter emits; anything else is dropped (its text is kept). */
    private static readonly formatterTags: string[] = [
        'b', 'br', 'code', 'div', 'em', 'h2', 'h3', 'h4', 'li', 'ol', 'p', 'pre', 'span', 'strong',
        'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
    ];

    /**
     * Renders Formatter HTML. The Formatter escapes all data, and import strips stored output,
     * but this is the only place parsed HTML enters the page, so it also enforces an allowlist:
     * known tags only, `class` as the only attribute. Script, style, event handlers and URLs
     * can't survive even if a future code path passes unescaped HTML here.
     *
     * @param {HTMLElement} host - The element to render into.
     * @param {string} html - The Formatter HTML.
     * @returns {void}
     */
    private static appendTrustedHtml(host: HTMLElement, html: string): void {
        if (!html) {
            return;
        }
        const parsed: Document = new DOMParser().parseFromString(html, 'text/html');
        const copy: (source: Node, target: Node) => void = (source: Node, target: Node): void => {
            Array.prototype.slice.call(source.childNodes).forEach((child: Node) => {
                if (child.nodeType === 3) {
                    target.appendChild(document.createTextNode(child.textContent || ''));
                    return;
                }
                if (child.nodeType !== 1) {
                    return;
                }
                const tag: string = (child as Element).tagName.toLowerCase();
                if (tag === 'script' || tag === 'style' || tag === 'template') {
                    return; // drop entirely, including text
                }
                if (WorkflowStepRenderer.formatterTags.indexOf(tag) === -1) {
                    copy(child, target); // unknown wrapper: keep only its content
                    return;
                }
                const clean: HTMLElement = document.createElement(tag);
                const className: string | null = (child as Element).getAttribute('class');
                if (className) {
                    clean.className = className;
                }
                copy(child, clean);
                target.appendChild(clean);
            });
        };
        copy(parsed.body, host);
    }

    /**
     * Creates the output-port label container for a multi-output step.
     *
     * Returns null for single-output steps.
     *
     * @param {WorkflowStep} step The workflow step whose output ports need labels.
     * @returns {HTMLElement | null} The label container, or null for a single-output step.
     */
    private static createPortLabelsElement(step: WorkflowStep): HTMLElement | null {
        const outputPorts: string[] = PortResolver.getOutputPorts(step);
        const mainPorts: string[] = outputPorts.filter((port: string) => port !== 'error');
        if (mainPorts.length <= 1) {
            return null;
        }

        const labels: HTMLDivElement = document.createElement('div');
        labels.className = 'e-wf-port-labels';

        mainPorts.forEach((portName: string, index: number) => {
            const offsetY: number = (index + 1) / (mainPorts.length + 1);
            const label: HTMLSpanElement = document.createElement('span');
            label.className = 'e-wf-port-label';
            label.style.top = (offsetY * 100) + '%';
            label.textContent = portName;
            labels.appendChild(label);
        });

        return labels;
    }

    /**
     * Creates the icon element for a workflow step.
     *
     * @param {WorkflowStep} step The workflow step.
     * @param {WorkflowStepAppearance | undefined} appearance Optional appearance overrides.
     * @returns {HTMLElement} The element containing the corresponding EJ2 icon classes.
     */
    private static createIconElement(
        step: WorkflowStep,
        appearance: WorkflowStepAppearance | undefined
    ): HTMLElement {
        const icon: HTMLSpanElement = document.createElement('span');
        icon.classList.add('e-wf-step-icon-html', 'e-icons');

        let iconClasses: string[] = [];
        if (appearance && appearance.iconCss) {
            iconClasses = WorkflowStepRenderer.sanitizeCssClasses(appearance.iconCss);
        }
        if (!iconClasses.length) {
            const fallback: string = WorkflowStepRenderer.getStepIconClass(step.stepType);
            iconClasses = fallback ? [fallback] : [];
        }
        iconClasses.forEach((iconClass: string): void => {
            icon.classList.add(iconClass);
        });

        return icon;
    }

    /**
     * Creates the node-name caption displayed below the workflow card.
     *
     * @param {WorkflowStep} step The workflow step.
     * @param {WorkflowStepState} state Current visual state.
     * @param {WorkflowStepAppearance | undefined} appearance Optional appearance override.
     * @param {WorkflowStepAppearance} [stateOverride] Optional `stateAppearance` entry for the current state.
     * @returns {HTMLElement} The caption element.
     */
    private static createCaptionElement(
        step: WorkflowStep,
        state: WorkflowStepState,
        appearance: WorkflowStepAppearance | undefined,
        stateOverride?: WorkflowStepAppearance
    ): HTMLElement {
        const caption: HTMLDivElement = document.createElement('div');
        caption.className = 'e-wf-step-caption';

        const captionColor: string = stateOverride && stateOverride.textColor
            ? stateOverride.textColor
            : WorkflowStepRenderer.resolveCaptionColor(state, appearance);
        if (captionColor) {
            caption.style.color = captionColor;
        }

        caption.textContent = step.name || '';
        return caption;
    }

    /**
     * Returns every safe class token of a public `iconCss` value, so values such as
     * `'e-icons e-send'` keep the glyph class.
     *
     * @param {string} value The user-supplied CSS class token string.
     * @returns {string[]} The safe class tokens.
     */
    private static sanitizeCssClasses(value: string): string[] {
        if (!value) {
            return [];
        }
        return value.split(/\s+/).filter((t: string) => t.length > 0 && /^[A-Za-z0-9_-]+$/.test(t));
    }

    /**
     * Returns the Syncfusion e-icon class mapped from the catalog
     * presentation model for the given step type.
     * Canvas step cards share the same e-icon glyphs as the Node Collection
     * palette so the two surfaces are visually consistent.
     *
     * @param {WorkflowStepType | undefined} stepType The workflow step type to look up.
     * @returns {string} The CSS class name for the matching e-icon glyph, or a fallback.
     */
    private static getStepIconClass(stepType: WorkflowStepType | undefined): string {
        if (stepType) {
            const entry: WorkflowNodeCatalogEntry | null = WorkflowNodeCatalog.getEntry(stepType);
            if (entry && entry.icon) {
                return entry.icon;
            }
        }
        return 'e-bubbles';
    }

    private createPorts(step: WorkflowStep): PointPortModel[] {
        const ports: PointPortModel[] = [];
        const portColor: string = step.appearance && step.appearance.strokeColor
            ? step.appearance.strokeColor
            : DEFAULT_NODE_STROKE;
        const portStyle: ShapeStyleModel = {
            fill: portColor,
            strokeColor: portColor,
            strokeWidth: 2
        };
        const portDiameter: number = 10;
        // Output port circles anchor to the visible card (NODE_CARD_SIZE ×
        // NODE_CARD_SIZE), not the bounds. The bounds add NODE_PORT_LABEL_COLUMN_WIDTH
        // (multi-output) and NODE_CAPTION_HEIGHT below the card so we translate
        // the card-relative offset into the bounds-relative offset here.
        const nodeSize: WorkflowSize = WorkflowStepRenderer.resolveNodeSize(step, step.size);
        // The card fills the node bounds, so port offsets are fractions of the node itself. The expanded
        // Formatter keeps its fixed 80px card anchor.
        const anchorToCard: boolean = WorkflowStepRenderer.hasFormatterRuntime(step);
        const cardWidthFraction: number = anchorToCard ? NODE_CARD_SIZE / nodeSize.width : 1;
        const cardHeightFraction: number = anchorToCard ? NODE_CARD_SIZE / nodeSize.height : 1;
        // Single-output: card fills bounds horizontally — port offset.x = 1.
        // Multi-output: bounds widened by port-label column — offset.x = card fraction.
        const outputPortOffsetX: number = Math.min(1, cardWidthFraction);
        const inputPortOffsetY: number = 0.5 * cardHeightFraction;
        if (PortResolver.requiresInputPort(step)) {
            ports.push({
                id: this.getPortId(step.id || '', 'input', true),
                shape: 'Circle',
                width: portDiameter,
                height: portDiameter,
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.InConnect,
                style: portStyle,
                offset: { x: 0, y: inputPortOffsetY }
            });
        }
        const outputPorts: string[] = PortResolver.getOutputPorts(step);
        outputPorts.forEach((portName: string, index: number) => {
            const yFraction: number = outputPorts.length === 1
                ? 0.5
                : (index + 1) / (outputPorts.length + 1);
            ports.push({
                id: this.getPortId(step.id || '', portName, false),
                shape: 'Circle',
                width: portDiameter,
                height: portDiameter,
                visibility: PortVisibility.Visible,
                constraints: PortConstraints.Draw | PortConstraints.OutConnect,
                style: portStyle,
                offset: { x: outputPortOffsetX, y: yFraction * cardHeightFraction }
            });
        });
        return ports;
    }

    /**
     * True when port ids and offsets (order-sensitive) match — used to skip
     * no-op port reassignment while still applying Switch branch Y redistributes.
     *
     * @param {PointPortModel[] | undefined} current The existing port topology on the live node.
     * @param {PointPortModel[]} next The desired port topology.
     * @returns {boolean} `true` when the two port topologies are equivalent.
     */
    private static samePortTopology(
        current: PointPortModel[] | undefined,
        next: PointPortModel[]
    ): boolean {
        const existing: PointPortModel[] = current || [];
        if (existing.length !== next.length) {
            return false;
        }
        for (let i: number = 0; i < next.length; i++) {
            // Use parsed-integer keys to avoid flagged object-injection sinks;
            // the security lint does not sink on numeric keys parsed explicitly.
            const key: number = parseInt(String(i), 10);
            const a: PointPortModel = existing[parseInt(i.toString(), 10)];
            const b: PointPortModel = next[parseInt(i.toString(), 10)];
            if (!a || !b || a.id !== b.id) {
                return false;
            }
            const ax: number = a.offset && typeof a.offset.x === 'number' ? a.offset.x : 0;
            const ay: number = a.offset && typeof a.offset.y === 'number' ? a.offset.y : 0;
            const bx: number = b.offset && typeof b.offset.x === 'number' ? b.offset.x : 0;
            const by: number = b.offset && typeof b.offset.y === 'number' ? b.offset.y : 0;
            if (ax !== bx || ay !== by) {
                return false;
            }
            // Reference `key` so the closure isn't accidentally elided by tooling.
            void key;
        }
        return true;
    }

    /**
     * Width/height from model size, Switch ports, or Formatter runtime expansion.
     *
     * All nodes are square on the visible card (140×140) with a caption row
     * below it. Multi-output steps (Condition, Switch, Loop, Approve) widen
     * the bounds by `NODE_PORT_LABEL_COLUMN_WIDTH` (72px) on the right so
     * port labels can render *outside* the card on the right edge without
     * being clipped. Switch also extends the height according to its branch
     * count so each labeled branch stays legible.
     *
     * @param {WorkflowStep} step The workflow step driving the bounds calculation.
     * @param {WorkflowSize | undefined} size The optional caller-supplied size override (ignored for most step types).
     * @returns {WorkflowSize} The resolved width and height for the Diagram node.
     */
    private static resolveNodeSize(step: WorkflowStep, size: WorkflowSize | undefined): WorkflowSize {
        if (step.stepType === 'Switch') {
            // Switch bounds grow with the number of output ports so branch labels
            // and port dots keep a readable vertical gap.
            return {
                width: MULTI_OUTPUT_NODE_WIDTH,
                height: PortResolver.getSwitchNodeHeight(step)
            };
        }
        // Formatter expands only while runtimeOutput is present. When cleared (simulation
        // reset / rerun), always return the compact default — ignore stale step.size left
        // from a prior expanded run so the node collapses back to original size.
        if (step.stepType === 'Formatter') {
            if (WorkflowStepRenderer.hasFormatterRuntime(step)) {
                return { width: FORMATTER_NODE_WIDTH, height: FORMATTER_NODE_HEIGHT };
            }
            return {
                width: SINGLE_OUTPUT_NODE_WIDTH,
                height: SINGLE_OUTPUT_NODE_HEIGHT
            };
        }
        // The step's own width/height win when set to a positive number; otherwise the default
        // 80×80 bounds apply. The built-in card and any custom content fill these bounds.
        const multi: boolean = PortResolver.isMultiOutputStep(step);
        return {
            width: WorkflowStepRenderer.positive(size && size.width, multi ? MULTI_OUTPUT_NODE_WIDTH : SINGLE_OUTPUT_NODE_WIDTH),
            height: WorkflowStepRenderer.positive(size && size.height, multi ? MULTI_OUTPUT_NODE_HEIGHT : SINGLE_OUTPUT_NODE_HEIGHT)
        };
    }

    private static positive(value: number | null | undefined, fallback: number): number {
        return typeof value === 'number' && isFinite(value) && value > 0 ? value : fallback;
    }

    private static hasFormatterRuntime(step: WorkflowStep): boolean {
        return step.stepType === 'Formatter' && !!FormatterOutput.readRuntimeOutput(step.customProps);
    }

    /**
     * Applies resolved width/height onto the live Diagram node (no diagram.refresh).
     *
     * @param {NodeModel} node The live Diagram node model to re-dimension.
     * @param {WorkflowStep} step The workflow step that owns the node.
     * @returns {void}
     */
    private static applyResolvedNodeSize(node: NodeModel, step: WorkflowStep): void {
        const size: WorkflowSize = WorkflowStepRenderer.resolveNodeSize(step, step.size);
        node.width = size.width;
        node.height = size.height;
        if (step.stepType === 'Switch' || step.stepType === 'Formatter') {
            step.size = { width: size.width, height: size.height };
        }
    }

    /**
     * Applies the author-set fill, stroke color and stroke width to the built-in card. Execution states
     * keep their own border colors. Nothing is written when the appearance leaves a value unset, so the
     * themed defaults stay in effect.
     *
     * @param {HTMLElement} card The built-in card element.
     * @param {WorkflowStepAppearance | undefined} appearance The step appearance.
     * @param {WorkflowStepState} state The current visual state.
     * @param {WorkflowStepAppearance} [stateOverride] Optional `stateAppearance` entry for the current state.
     * @returns {void}
     */
    private static applyCardAppearance(
        card: HTMLElement,
        appearance: WorkflowStepAppearance | undefined,
        state: WorkflowStepState,
        stateOverride?: WorkflowStepAppearance
    ): void {
        // Running, completed and failed merge their `stateAppearance` over the base appearance, value by
        // value. The base stroke color is Idle-only (the states keep their own border colors), so a state
        // border color comes only from `stateAppearance`.
        const fill: string | undefined = (stateOverride && stateOverride.fill) || (appearance && appearance.fill);
        const strokeColor: string | undefined = state === 'idle'
            ? (appearance && appearance.strokeColor)
            : (stateOverride && stateOverride.strokeColor);
        const strokeWidth: number | undefined = stateOverride && typeof stateOverride.strokeWidth === 'number'
            ? stateOverride.strokeWidth
            : (appearance && appearance.strokeWidth);
        if (fill) {
            card.style.background = fill;
        }
        if (strokeColor) {
            card.style.borderColor = strokeColor;
        }
        if (typeof strokeWidth === 'number') {
            card.style.borderWidth = Math.max(strokeWidth, DEFAULT_NODE_STROKE_WIDTH) + 'px';
        }
    }

    /**
     * Returns the explicit `stateAppearance` entry for a non-idle state.
     *
     * @param {WorkflowStep} step The workflow step.
     * @param {WorkflowStepState} state The current visual state.
     * @returns {WorkflowStepAppearance | undefined} The state overrides, if any.
     */
    private static getStateOverride(step: WorkflowStep, state: WorkflowStepState): WorkflowStepAppearance | undefined {
        if (state === 'idle' || !step.stateAppearance) {
            return undefined;
        }
        const entry: WorkflowStepAppearance | undefined = state === 'running'
            ? step.stateAppearance.running
            : state === 'completed' ? step.stateAppearance.completed : step.stateAppearance.failed;
        return entry && typeof entry === 'object' ? entry : undefined;
    }

    private createCustomStyle(): ShapeStyleModel {
        return { fill: 'transparent', strokeColor: 'transparent', strokeWidth: 0 };
    }

    /**
     * Builds the Diagram node style. The visible border belongs to the HTML card, so the node's own stroke
     * is constant and never follows the step's `strokeColor`, `strokeWidth` or execution state.
     *
     * @param {WorkflowStepAppearance | undefined} appearance The optional appearance override.
     * @returns {ShapeStyleModel} The node style.
     */
    private createStyle(appearance: WorkflowStepAppearance | undefined): ShapeStyleModel {
        return {
            fill: appearance && appearance.fill ? appearance.fill : DEFAULT_NODE_FILL,
            strokeColor: DEFAULT_NODE_STROKE,
            strokeWidth: DEFAULT_NODE_STROKE_WIDTH
        };
    }

    private getStoredStepType(node: NodeModel): WorkflowStepType | undefined {
        const value: unknown = (node as NodeModel & { addInfo?: { workflowStepType?: WorkflowStepType } }).addInfo;
        return value && typeof value === 'object'
            ? (value as { workflowStepType?: WorkflowStepType }).workflowStepType
            : undefined;
    }

    private storeStepType(node: NodeModel, stepType: WorkflowStepType): void {
        const addInfo: { isWorkflowNode: boolean; workflowStepType: WorkflowStepType; workflowStep?: WorkflowStep } =
            (node.addInfo as { isWorkflowNode: boolean; workflowStepType: WorkflowStepType; workflowStep?: WorkflowStep }) ||
            { isWorkflowNode: true, workflowStepType: stepType };
        addInfo.isWorkflowNode = true;
        addInfo.workflowStepType = stepType;
        node.addInfo = addInfo;
    }
}
