import { LocaleContext } from '../localization/locale-context';
import { L10n } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { TextBox } from '@syncfusion/ej2-inputs';
import { Diagram } from '@syncfusion/ej2-diagrams';
import { WorkflowExecutionLogEntry } from '../models/workflow-validation';
import { WorkflowExecutionLogSettingsModel } from '../models/workflow-execution-log-settings-model';
import { ExecutionDetails } from './execution-details';
import { ServiceLocator } from './service';
import { SimulationLogEntryView } from './simulation-log-entry';

/**
 * Bottom simulation log region: row-by-row step table + Output/Input/JSON detail.
 *
 * @private
 */
export class SimulationLog {
    private root: HTMLDivElement | null = null;
    private summaryEl: HTMLSpanElement | null = null;
    private list: HTMLDivElement | null = null;
    private body: HTMLDivElement | null = null;
    private detailsHost: HTMLDivElement | null = null;
    private details: ExecutionDetails | null = null;
    private open: boolean = false;
    private readonly entries: SimulationLogEntryView[] = [];
    private selected: SimulationLogEntryView | null = null;
    private startedAt: number | null = null;
    private endedAt: number | null = null;
    private hasFailure: boolean = false;
    private hasStopped: boolean = false;
    private finalized: boolean = false;
    private toggleBtn: HTMLButtonElement | null = null;
    private toggleButton: Button | null = null;
    private clearButton: Button | null = null;
    private searchInput: HTMLInputElement | null = null;
    private searchBox: TextBox | null = null;
    private searchQuery: string = '';
    // Lazily resolved on each toggle so a Diagram recreated during the
    // designer's lifetime (theme change, layout reset, ...) still re-layouts
    // when the user expands or collapses the log region.
    private readonly getDiagram: () => Diagram | null;
    private readonly host: HTMLElement;
    private readonly settings: WorkflowExecutionLogSettingsModel;
    private readonly serviceLocator: ServiceLocator;
    private l10n: L10n;
    /**
     * Creates the instance.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowExecutionLogSettingsModel} settings The settings.
     * @param {Object} getDiagram The get diagram.
     * @param {ServiceLocator} serviceLocator The service locator holding the localization instance.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        host: HTMLElement,
        settings: WorkflowExecutionLogSettingsModel,
        getDiagram?: () => Diagram | null,
        serviceLocator?: ServiceLocator
    ) {
        this.host = host;
        this.settings = settings;
        this.serviceLocator = serviceLocator || new ServiceLocator();
        // Resolve the shared localization instance; the main component
        // registers it before any rendering begins.
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.getDiagram = getDiagram || (() => null);
    }

    /**
     * Create.
     *
     * @returns {void} Nothing.
     * @private
     */
    public create(): void {
        if (this.settings.visible === false) {
            return;
        }
        this.root = document.createElement('div');
        this.root.className = 'e-wf-simulation-log-panel';

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-simulation-log-header';
        this.summaryEl = document.createElement('span');
        this.summaryEl.className = 'e-wf-simulation-summary';
        this.summaryEl.textContent = this.l10n.getConstant('executionLog');

        const actions: HTMLDivElement = document.createElement('div');
        actions.className = 'e-wf-simulation-log-actions';

        // Search control next to clear (design imageb).
        const searchWrap: HTMLDivElement = document.createElement('div');
        searchWrap.className = 'e-wf-simulation-log-search-wrap';
        const searchHost: HTMLInputElement = document.createElement('input');
        searchHost.type = 'text';
        searchWrap.appendChild(searchHost);
        actions.appendChild(searchWrap);

        const clearBtn: HTMLButtonElement = document.createElement('button');
        clearBtn.className = 'e-wf-simulation-log-clear';
        // `clearSimulationLog` drives both the visible button title (hover)
        // and the button's aria-label — same concept, shared key.
        clearBtn.setAttribute('title', this.l10n.getConstant('clearSimulationLog'));
        clearBtn.setAttribute('aria-label', this.l10n.getConstant('clearSimulationLog'));
        clearBtn.addEventListener('click', () => this.clear());
        actions.appendChild(clearBtn);

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'e-wf-simulation-log-toggle';
        // `toggleSimulationLog` likewise drives both title and aria-label.
        this.toggleBtn.setAttribute('aria-label', this.l10n.getConstant('toggleSimulationLog'));
        this.toggleBtn.setAttribute('title', this.l10n.getConstant('toggleSimulationLog'));
        this.toggleBtn.addEventListener('click', () => this.setOpen(!this.open));
        actions.appendChild(this.toggleBtn);

        header.appendChild(this.summaryEl);
        header.appendChild(actions);

        this.body = document.createElement('div');
        this.body.className = 'e-wf-simulation-log-body';

        const listPane: HTMLDivElement = document.createElement('div');
        listPane.className = 'e-wf-simulation-log-list-pane';
        this.list = document.createElement('div');
        this.list.className = 'e-wf-simulation-log-list';
        this.list.setAttribute('role', 'table');
        this.list.setAttribute('aria-label', LocaleContext.text('executionLogEntries'));
        listPane.appendChild(this.list);

        this.detailsHost = document.createElement('div');
        this.detailsHost.className = 'e-wf-simulation-log-details-pane';

        this.body.appendChild(listPane);
        this.body.appendChild(this.detailsHost);

        this.root.appendChild(header);
        this.root.appendChild(this.body);
        this.host.appendChild(this.root);
        this.host.removeAttribute('aria-hidden');

        // Every EJ2 component below is mounted only once the panel is in
        // the document: one initialised while detached measures zero. This
        // includes the detail pane, whose Tab is sized on creation.
        this.searchBox = new TextBox({
            cssClass: 'e-wf-simulation-log-search',
            placeholder: this.l10n.getConstant('search')
        });
        this.searchBox.appendTo(searchHost);
        this.searchInput = this.searchBox.element as HTMLInputElement;
        this.searchInput.setAttribute('aria-label', LocaleContext.text('searchExecutionLog'));
        this.searchInput.addEventListener('input', () => {
            this.searchQuery = (this.searchInput && this.searchInput.value || '').trim().toLowerCase();
            this.applyFilter();
        });

        this.clearButton = new Button({
            cssClass: 'e-wf-simulation-log-clear e-flat',
            iconCss: 'e-icons e-trash'
        });
        this.clearButton.appendTo(clearBtn);

        if (this.toggleBtn) {
            this.toggleButton = new Button({
                cssClass: 'e-wf-simulation-log-toggle e-flat',
                iconCss: 'e-icons e-chevron-up'
            });
            this.toggleButton.appendTo(this.toggleBtn);
        }

        this.details = new ExecutionDetails(this.l10n);
        this.details.create(this.detailsHost);
        // Simulation Log height is responsive — sized by the parent layout,
        // not from settings.height (removed).
        // Simulation Log always starts collapsed in this iteration; consumers
        // who want a different default should toggle after construction.
        const initiallyOpen: boolean = false;
        // 'init' on create: skip the diagram-bounds refresh — the canvas has
        // just been laid out, and asking it to fit again would only cause a
        // flicker on first paint. User-driven toggles always refresh bounds.
        this.setOpen(initiallyOpen, 'init');
        this.refreshSummary();
    }

    /**
     * Append.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {void} Nothing.
     * @private
     */
    public append(entry: WorkflowExecutionLogEntry): void {
        if (!this.list) {
            return;
        }
        // Reset execution state flags when a new execution starts (Started entry)
        // This ensures previous execution failures don't affect the current run's header status
        if (entry.status === 'Started') {
            this.hasFailure = false;
            this.hasStopped = false;
            this.finalized = false;
        }
        const ts: number = SimulationLog.toMillis(entry.timestamp);
        if (this.startedAt === null || ts < this.startedAt) {
            this.startedAt = ts;
        }
        this.endedAt = ts;
        if (entry.status === 'Error' || entry.status === 'Validation') {
            this.hasFailure = true;
        }
        if (entry.status === 'Stopped') {
            this.hasStopped = true;
        }
        if (entry.status === 'Final' || entry.status === 'Stopped') {
            this.finalized = true;
            // Final entry message can indicate Failed vs Completed when status is Final.
            if (entry.status === 'Final' && entry.error) {
                this.hasFailure = true;
            }
            if (entry.status === 'Final' && entry.message
                && /fail/i.test(String(entry.message))) {
                this.hasFailure = true;
            }
            if (entry.status === 'Final' && entry.message
                && /stop/i.test(String(entry.message))) {
                this.hasStopped = true;
            }
        }

        const view: SimulationLogEntryView = new SimulationLogEntryView(
            entry,
            (selected: SimulationLogEntryView) => {
                this.select(selected);
            },
            this.l10n
        );
        this.entries.push(view);
        this.list.appendChild(view.element);
        // Mounted after attach: a component initialised while detached
        // measures zero.
        view.mount();
        this.applyFilterToView(view);

        while (this.entries.length > 500) {
            const removed: SimulationLogEntryView | undefined = this.entries.shift();
            if (removed) {
                if (this.selected === removed) {
                    this.selected = null;
                    if (this.details) {
                        this.details.clear();
                    }
                }
                removed.destroy();
                removed.element.remove();
            }
        }

        this.list.scrollTop = this.list.scrollHeight;
        this.refreshSummary();

        // Prefer the latest step or grouped validation row for the detail pane.
        if (SimulationLogEntryView.isStepRow(entry) || entry.status === 'Validation') {
            this.select(view);
        } else if (this.selected === null && (entry.status === 'Final' || entry.status === 'Stopped')
            && this.entries.length > 0) {
            const lastStep: SimulationLogEntryView | undefined = this.entries
                .slice()
                .reverse()
                .find((item: SimulationLogEntryView) =>
                    SimulationLogEntryView.isStepRow(item.entry) || item.entry.status === 'Validation');
            if (lastStep) {
                this.select(lastStep);
            }
        }
    }

    /**
     * Clear.
     *
     * @returns {void} Nothing.
     * @private
     */
    public clear(): void {
        this.entries.forEach((view: SimulationLogEntryView) => view.destroy());
        this.entries.splice(0, this.entries.length);
        this.selected = null;
        this.startedAt = null;
        this.endedAt = null;
        this.hasFailure = false;
        this.hasStopped = false;
        this.finalized = false;
        this.searchQuery = '';
        if (this.searchBox) {
            this.searchBox.value = '';
            this.searchBox.dataBind();
        }
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        if (this.list) {
            this.list.innerHTML = '';
        }
        if (this.details) {
            this.details.clear();
        }
        this.refreshSummary();
    }

    /**
     * Destroy.
     *
     * @returns {void} Nothing.
     * @private
     */
    public destroy(): void {
        if (this.details) {
            this.details.destroy();
        }
        if (this.root) {
            this.root.remove();
        }
        this.root = null;
        this.summaryEl = null;
        this.list = null;
        this.body = null;
        this.detailsHost = null;
        this.details = null;
        this.selected = null;
        if (this.searchBox) {
            this.searchBox.destroy();
            this.searchBox = null;
        }
        if (this.clearButton) {
            this.clearButton.destroy();
            this.clearButton = null;
        }
        if (this.toggleButton) {
            this.toggleButton.destroy();
            this.toggleButton = null;
        }
        this.toggleBtn = null;
        this.searchInput = null;
        this.entries.forEach((view: SimulationLogEntryView) => view.destroy());
        this.entries.splice(0, this.entries.length);
    }

    /**
     * Refreshes every rendered simulation-log string after the host swaps
     * the L10n instance in the service locator. Updates the summary
     * heading, status badge, step count, button titles, search placeholder,
     * and pushes the new l10n down to every existing log entry.
     *
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        if (this.details) {
            this.details.setLocale(this.l10n);
        }
        if (this.searchBox) {
            this.searchBox.placeholder = this.l10n.getConstant('search');
            this.searchBox.dataBind();
        }
        if (this.clearButton) {
            const clearLabel: string = this.l10n.getConstant('clearSimulationLog');
            const clearEl: HTMLElement | null = this.clearButton.element;
            if (clearEl) {
                clearEl.setAttribute('title', clearLabel);
                clearEl.setAttribute('aria-label', clearLabel);
            }
        }
        if (this.toggleBtn) {
            const toggleLabel: string = this.l10n.getConstant('toggleSimulationLog');
            this.toggleBtn.setAttribute('title', toggleLabel);
            this.toggleBtn.setAttribute('aria-label', toggleLabel);
        }
        this.entries.forEach((view: SimulationLogEntryView) => view.setLocale(this.l10n));
        this.refreshSummary();
    }

    private select(view: SimulationLogEntryView): void {
        if (this.selected) {
            this.selected.setSelected(false);
        }
        this.selected = view;
        view.setSelected(true);
        if (this.details) {
            this.details.show(view.detail);
        }
    }

    private refreshSummary(): void {
        if (!this.summaryEl) {
            return;
        }
        this.summaryEl.innerHTML = '';
        const stepCount: number = this.entries.filter((item: SimulationLogEntryView) =>
            SimulationLogEntryView.isStepRow(item.entry) && item.entry.status !== 'Retry').length;
        if (this.entries.length === 0) {
            this.summaryEl.textContent = this.l10n.getConstant('executionLog');
            this.summaryEl.className = 'e-wf-simulation-summary';
            return;
        }

        let stateKey: 'failed' | 'completed' | 'stopped' | 'running' = 'running';
        let stateLabel: string = this.l10n.getConstant('executionRunning');
        if (this.hasFailure) {
            stateKey = 'failed';
            stateLabel = this.l10n.getConstant('executionFailed');
        } else if (this.hasStopped) {
            stateKey = 'stopped';
            stateLabel = this.l10n.getConstant('executionStopped');
        } else if (this.finalized) {
            stateKey = 'completed';
            stateLabel = this.l10n.getConstant('executionCompleted');
        }

        this.summaryEl.className = 'e-wf-simulation-summary e-wf-simulation-summary-' + stateKey;

        const statusSpan: HTMLSpanElement = document.createElement('span');
        const statusClassKey: 'failed' | 'completed' | 'stopped' | 'running' =
            stateKey === 'stopped' ? 'failed' : stateKey;
        statusSpan.className = 'e-wf-simulation-summary-status e-wf-simulation-summary-status-' + statusClassKey;
        statusSpan.textContent = stateLabel;
        this.summaryEl.appendChild(statusSpan);

        // Container for metadata to maintain stable layout
        const metaContainer: HTMLSpanElement = document.createElement('span');
        metaContainer.className = 'e-wf-simulation-summary-meta-container';

        if (stepCount > 0) {
            const stepsSpan: HTMLSpanElement = document.createElement('span');
            stepsSpan.className = 'e-wf-simulation-summary-meta e-wf-simulation-summary-steps';
            // Plural-aware step count: `stepCountOne` for 1, `stepCountOther`
            // for everything else. Both keys use `{0}` for the count.
            const stepCountKey: 'stepCountOne' | 'stepCountOther' =
                stepCount === 1 ? 'stepCountOne' : 'stepCountOther';
            const stepCountTemplate: string = this.l10n.getConstant(stepCountKey);
            stepsSpan.textContent = stepCountTemplate.replace('{0}', String(stepCount));
            metaContainer.appendChild(stepsSpan);
        }

        if (this.startedAt !== null && this.endedAt !== null && this.endedAt >= this.startedAt) {
            const durationSpan: HTMLSpanElement = document.createElement('span');
            durationSpan.className = 'e-wf-simulation-summary-meta e-wf-simulation-summary-duration';
            durationSpan.textContent = SimulationLog.formatDuration(this.endedAt - this.startedAt);
            metaContainer.appendChild(durationSpan);
        }

        this.summaryEl.appendChild(metaContainer);
    }

    private setOpen(open: boolean, trigger: 'init' | 'user' = 'user'): void {
        this.open = open;
        if (this.host) {
            if (open) {
                this.host.classList.add('e-wf-simulation-log-open');
            } else {
                this.host.classList.remove('e-wf-simulation-log-open');
            }
        }
        if (this.root) {
            this.root.classList.toggle('e-wf-simulation-log-collapsed', !open);
        }
        if (this.toggleButton) {
            this.toggleButton.iconCss = 'e-icons ' + (open ? 'e-chevron-up' : 'e-chevron-down');
            this.toggleButton.dataBind();
        }
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        if (trigger === 'user') {
            this.refreshDiagramBounds();
        }
    }

    /**
     * Recompute viewport metrics so the canvas resizes with the simulation
     * log region. Without this the diagram keeps its old
     * scrollSettings/viewBox, leaving a visual gap (collapsed) or empty
     * whitespace (expanded) along the bottom edge.
     *
     * `updateViewPort` re-measures the host element after the log's
     * collapsed class flips while retaining the current zoom level, so the
     * user's zoom is preserved. Both directions (open and close) need the
     * same pass: the canvas region's own height changed in either case.
     * No `fitToPage` here — that would reset the zoom the user chose.
     *
     * @returns {void}
     */
    private refreshDiagramBounds(): void {
        const diagram: Diagram | null = this.getDiagram();
        if (!diagram) {
            return;
        }
        diagram.updateViewPort();
    }

    private applyFilter(): void {
        this.entries.forEach((view: SimulationLogEntryView) => this.applyFilterToView(view));
    }

    private applyFilterToView(view: SimulationLogEntryView): void {
        view.element.style.display = view.matchesQuery(this.searchQuery) ? '' : 'none';
    }

    private static toMillis(timestamp: number | string): number {
        if (typeof timestamp === 'number') {
            return timestamp;
        }
        const parsed: number = Date.parse(String(timestamp));
        return isNaN(parsed) ? Date.now() : parsed;
    }

    private static formatDuration(ms: number): string {
        if (ms < 1000) {
            return ms + ' ms';
        }
        const seconds: number = ms / 1000;
        if (seconds < 60) {
            return (Math.round(seconds * 100) / 100) + ' s';
        }
        const minutes: number = Math.floor(seconds / 60);
        const rem: number = Math.round(seconds - minutes * 60);
        return minutes + ' m ' + rem + ' s';
    }
}
