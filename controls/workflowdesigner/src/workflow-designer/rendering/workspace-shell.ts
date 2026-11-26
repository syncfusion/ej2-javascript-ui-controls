import { LocaleContext } from '../localization/locale-context';
/**
 * WorkspaceShell — structural layout owner for the Workflow Designer workspace
 *.
 *
 * The shell is built from native HTML elements, standard DOM APIs and
 * component-owned SCSS only. No additional Syncfusion EJ2 UI component
 * dependency is introduced (FR-014a, native-HTML-UI dependency boundary).
 *
 * The shell owns the structural regions only:
 *   - fixed top toolbar region (placeholder; functional toolbar lands in R4)
 *   - left Node Collection region (placeholder; functional palette lands in R5)
 *   - center Diagram canvas region (mounted by `CanvasRenderer`)
 *   - right Property Section region (placeholder; functional panel lands in R7)
 *   - bottom Simulation Log region (placeholder; functional log lands in R10)
 *   - floating canvas controls (mounted by `CanvasToolbar`)
 *
 * Opening, closing or resizing workspace regions must never modify workflow
 * node positions, persisted coordinates or Diagram bounds. The shell does not mutate public
 * collections or Diagram model bounds; it only positions child DOM regions.
 *
 * @internal
 * @private
 */
export class WorkspaceShell {
    private readonly root: HTMLElement;
    private shellElement: HTMLDivElement | null = null;
    private topToolbarRegion: HTMLDivElement | null = null;
    private nodeCollectionRegion: HTMLDivElement | null = null;
    private canvasRegion: HTMLDivElement | null = null;
    private propertyPanelRegion: HTMLDivElement | null = null;
    private simulationLogRegion: HTMLDivElement | null = null;

    /**
     * Creates a workspace shell bound to a root element.
     *
     * @param {HTMLElement} root The component host element.
     * @private
     */
    public constructor(root: HTMLElement) {
        this.root = root;
    }

    /**
     * Creates and appends the structural workspace regions. Returns the center
     * canvas region element where `CanvasRenderer` should mount the Diagram.
     *
     * @returns {HTMLDivElement} The center canvas region element.
     * @private
     */
    public create(): HTMLDivElement {
        if (this.shellElement) {
            return this.canvasRegion as HTMLDivElement;
        }
        const shell: HTMLDivElement = document.createElement('div');
        shell.className = 'e-wf-workspace';
        this.shellElement = shell;

        const topToolbar: HTMLDivElement = document.createElement('div');
        topToolbar.className = 'e-wf-top-toolbar';
        topToolbar.setAttribute('role', 'region');
        topToolbar.setAttribute('aria-label', LocaleContext.text('regionToolbar'));
        this.topToolbarRegion = topToolbar;

        const workspaceBody: HTMLDivElement = document.createElement('div');
        workspaceBody.className = 'e-wf-workspace-body';

        const nodeCollection: HTMLDivElement = document.createElement('div');
        nodeCollection.className = 'e-wf-node-collection';
        nodeCollection.setAttribute('role', 'region');
        nodeCollection.setAttribute('aria-label', LocaleContext.text('regionStepCollection'));
        nodeCollection.setAttribute('aria-hidden', 'true');
        this.nodeCollectionRegion = nodeCollection;

        const canvas: HTMLDivElement = document.createElement('div');
        canvas.className = 'e-wf-canvas-region';
        canvas.setAttribute('role', 'region');
        canvas.setAttribute('aria-label', LocaleContext.text('regionCanvas'));
        this.canvasRegion = canvas;

        const propertyPanel: HTMLDivElement = document.createElement('div');
        propertyPanel.className = 'e-wf-property-panel';
        propertyPanel.setAttribute('role', 'region');
        propertyPanel.setAttribute('aria-label', LocaleContext.text('regionProperties'));
        propertyPanel.setAttribute('aria-hidden', 'true');
        this.propertyPanelRegion = propertyPanel;

        workspaceBody.appendChild(nodeCollection);
        workspaceBody.appendChild(canvas);
        workspaceBody.appendChild(propertyPanel);

        const simulationLog: HTMLDivElement = document.createElement('div');
        simulationLog.className = 'e-wf-simulation-log';
        simulationLog.setAttribute('role', 'region');
        simulationLog.setAttribute('aria-label', LocaleContext.text('executionLog'));
        simulationLog.setAttribute('aria-hidden', 'true');
        this.simulationLogRegion = simulationLog;

        shell.appendChild(topToolbar);
        shell.appendChild(workspaceBody);
        shell.appendChild(simulationLog);
        this.root.appendChild(shell);
        return canvas;
    }

    /**
     * Returns the top toolbar region element (placeholder in R3).
     *
     * @returns {HTMLDivElement | null} The top toolbar region element, or `null` if not yet created.
     * @private
     */
    public getTopToolbarRegion(): HTMLDivElement | null {
        return this.topToolbarRegion;
    }

    /**
     * Returns the left Node Collection region element (placeholder in R3).
     *
     * @returns {HTMLDivElement | null} The left Node Collection region element, or `null` if not yet created.
     * @private
     */
    public getNodeCollectionRegion(): HTMLDivElement | null {
        return this.nodeCollectionRegion;
    }

    /**
     * Returns the center canvas region element.
     *
     * @returns {HTMLDivElement | null} The center canvas region element, or `null` if not yet created.
     * @private
     */
    public getCanvasRegion(): HTMLDivElement | null {
        return this.canvasRegion;
    }

    /**
     * Returns the right Property Section region element (placeholder in R3).
     *
     * @returns {HTMLDivElement | null} The right Property Section region element, or `null` if not yet created.
     * @private
     */
    public getPropertyPanelRegion(): HTMLDivElement | null {
        return this.propertyPanelRegion;
    }

    /**
     * Returns the bottom Simulation Log region element (placeholder in R3).
     *
     * @returns {HTMLDivElement | null} The bottom Simulation Log region element, or `null` if not yet created.
     * @private
     */
    public getSimulationLogRegion(): HTMLDivElement | null {
        return this.simulationLogRegion;
    }

    /**
     * Removes all workspace shell DOM.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.shellElement) {
            this.shellElement.remove();
        }
        this.shellElement = null;
        this.topToolbarRegion = null;
        this.nodeCollectionRegion = null;
        this.canvasRegion = null;
        this.propertyPanelRegion = null;
        this.simulationLogRegion = null;
    }
}
