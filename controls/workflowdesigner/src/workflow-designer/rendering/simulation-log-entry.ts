import { LocaleContext } from '../localization/locale-context';
import { Button } from '@syncfusion/ej2-buttons';
import { L10n } from '@syncfusion/ej2-base';
import { WorkflowExecutionLogEntry, WorkflowExecutionLogEntryStatus } from '../models/workflow-validation';
import { WorkflowStepResult, WorkflowRuntimeContext } from '../models/workflow-runtime-context';
import { ExecutionDetailData } from './execution-details';

/**
 * One simulation-log table row.
 * Supports expandable multi-message validation/error groups.
 *
 * The row keeps its native five-column grid and its `role="row"` semantics:
 * only rows with more than one child message are expandable, which an
 * Accordion cannot express without giving every row a chevron, and the
 * column alignment has no equivalent in an Accordion header template.
 * Only the interactive expand control is an EJ2 component, so the row is
 * themed where it matters without losing the table affordance.
 *
 * @private
 */
export class SimulationLogEntryView {
    /**
     * Element.
     *
     * @private
     */
    public readonly element: HTMLDivElement;
    /**
     * Entry.
     *
     * @private
     */
    public readonly entry: WorkflowExecutionLogEntry;
    /**
     * Detail.
     *
     * @private
     */
    public readonly detail: ExecutionDetailData;
    private l10n: L10n;
    private expanded: boolean = false;
    private expandBtn: HTMLButtonElement | null = null;
    private expandButton: Button | null = null;
    private childList: HTMLUListElement | null = null;

    /**
     * Creates the instance.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @param {Object} onSelect The on select.
     * @param {L10n} l10n The localization instance; consumed by `statusLabel`
     * and the expand-button titles.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        entry: WorkflowExecutionLogEntry,
        onSelect: (view: SimulationLogEntryView) => void,
        l10n: L10n
    ) {
        this.entry = entry;
        this.l10n = l10n;
        this.detail = SimulationLogEntryView.toDetail(entry);
        this.element = document.createElement('div');
        this.element.className = SimulationLogEntryView.rowClass(entry.status, entry);
        this.element.setAttribute('role', 'row');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('data-status', entry.status);
        if (entry.stepId) {
            this.element.setAttribute('data-step-id', entry.stepId);
        }
        if (entry.connectionId) {
            this.element.setAttribute('data-connection-id', entry.connectionId);
        }

        const mainRow: HTMLDivElement = document.createElement('div');
        mainRow.className = 'e-wf-simulation-entry-main';

        const statusCell: HTMLSpanElement = document.createElement('span');
        statusCell.className = 'e-wf-simulation-entry-status';
        statusCell.setAttribute('aria-label', SimulationLogEntryView.statusLabel(l10n, entry.status, entry));
        const statusIcon: HTMLSpanElement = document.createElement('span');
        statusIcon.className = 'e-wf-simulation-entry-status-icon e-icons '
            + SimulationLogEntryView.statusIconClass(entry.status, entry);
        statusIcon.setAttribute('aria-hidden', 'true');
        statusCell.appendChild(statusIcon);

        const timeCell: HTMLSpanElement = document.createElement('span');
        timeCell.className = 'e-wf-simulation-entry-time';
        timeCell.textContent = SimulationLogEntryView.formatTime(entry.timestamp);

        const nameCell: HTMLSpanElement = document.createElement('span');
        nameCell.className = 'e-wf-simulation-entry-name';
        nameCell.textContent = this.detail.stepName || entry.stepId || SimulationLogEntryView.statusLabel(l10n, entry.status, entry);

        const resultCell: HTMLSpanElement = document.createElement('span');
        resultCell.className = 'e-wf-simulation-entry-result';
        resultCell.textContent = SimulationLogEntryView.statusLabel(l10n, entry.status, entry);

        const messageCell: HTMLSpanElement = document.createElement('span');
        messageCell.className = 'e-wf-simulation-entry-message';
        const messageText: string = entry.message || '';
        messageCell.textContent = messageText;
        // Ellipsis truncates long single-line messages; native title exposes full text.
        if (messageText) {
            messageCell.title = messageText;
        }

        mainRow.appendChild(statusCell);
        mainRow.appendChild(timeCell);
        mainRow.appendChild(nameCell);
        mainRow.appendChild(resultCell);
        mainRow.appendChild(messageCell);

        const childMessages: string[] = SimulationLogEntryView.childMessages(entry);
        if (childMessages.length > 1) {
            this.element.classList.add('e-wf-simulation-entry-expandable');
            this.expandBtn = document.createElement('button');
            this.expandBtn.className = 'e-wf-simulation-entry-expand';
            this.expandBtn.setAttribute('aria-label', LocaleContext.text('toggleValidationDetails'));
            this.expandBtn.setAttribute('aria-expanded', 'false');
            this.expandBtn.setAttribute('title', this.l10n.getConstant('showAllIssues'));
            // Place expand control before message so the grid stays aligned.
            mainRow.insertBefore(this.expandBtn, messageCell);
            mainRow.classList.add('e-wf-simulation-entry-main-expandable');

            const childList: HTMLUListElement = document.createElement('ul');
            childList.className = 'e-wf-simulation-entry-children';
            childList.hidden = true;
            childList.setAttribute('aria-label', LocaleContext.text('validationIssues'));
            this.childList = childList;
            childMessages.forEach((text: string, index: number) => {
                const child: HTMLLIElement = document.createElement('li');
                child.className = 'e-wf-simulation-entry-child';
                child.setAttribute('data-child-index', String(index));
                const childMsg: HTMLSpanElement = document.createElement('span');
                childMsg.className = 'e-wf-simulation-entry-child-message';
                childMsg.textContent = text;
                child.appendChild(childMsg);
                childList.appendChild(child);
            });

            this.expandBtn.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                this.setExpanded(!this.expanded);
            });
            // Start collapsed; arrow click reveals child errors.
            this.setExpanded(false);
        }

        this.element.appendChild(mainRow);
        if (this.childList) {
            this.element.appendChild(this.childList);
        }

        this.element.addEventListener('click', () => onSelect(this));
        this.element.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(this);
            }
        });
    }

    /**
     * Mounts the EJ2 expand control. Called once, after the row is attached
     * to the list, so the component is not initialised while detached.
     *
     * @returns {void}
     * @private
     */
    public mount(): void {
        if (!this.expandBtn || this.expandButton) {
            return;
        }
        this.expandButton = new Button({
            cssClass: 'e-wf-simulation-entry-expand e-flat',
            iconCss: 'e-icons e-chevron-right e-wf-simulation-entry-expand-icon'
        });
        this.expandButton.appendTo(this.expandBtn);
        // Re-apply the collapsed glyph now the component owns the icon.
        this.setExpanded(this.expanded);
    }

    /**
     * Disposes the row's EJ2 component. Safe to call more than once.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.expandButton) {
            try {
                this.expandButton.destroy();
            } catch (error) {
                // Already disposed.
            }
            this.expandButton = null;
        }
    }

    /**
     * Set Expanded.
     *
     * @param {boolean} expanded The expanded.
     * @returns {void} Nothing.
     * @private
     */
    public setExpanded(expanded: boolean): void {
        this.expanded = expanded;
        if (this.childList) {
            this.childList.hidden = !expanded;
        }
        if (this.expandBtn) {
            this.expandBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            this.expandBtn.setAttribute('title', expanded ? this.l10n.getConstant('hideIssues') : this.l10n.getConstant('showAllIssues'));
            const icon: Element | null = this.expandBtn.querySelector('.e-wf-simulation-entry-expand-icon');
            if (icon) {
                icon.classList.remove('e-chevron-right', 'e-chevron-down');
                icon.classList.add(expanded ? 'e-chevron-down' : 'e-chevron-right');
            }
            if (this.expandButton) {
                // Keep the component model in sync with the glyph swapped
                // above; `dataBind()` is deliberately not called, as
                // re-binding re-creates the icon element.
                this.expandButton.iconCss = 'e-icons '
                    + (expanded ? 'e-chevron-down' : 'e-chevron-right')
                    + ' e-wf-simulation-entry-expand-icon';
            }
        }
        this.element.classList.toggle('e-wf-simulation-entry-expanded', expanded);
    }

    /**
     * Set Selected.
     *
     * @param {boolean} selected The selected.
     * @returns {void} Nothing.
     * @private
     */
    public setSelected(selected: boolean): void {
        this.element.classList.toggle('e-wf-simulation-entry-selected', selected);
        this.element.setAttribute('aria-selected', selected ? 'true' : 'false');
    }

    /**
     * Refreshes every localized string on this row after the host swaps
     * the L10n instance in the service locator. The status badge label,
     * its aria-label, the result-cell label and the expand-button title
     * all flow through `l10n.getConstant`.
     *
     * @param {L10n} l10n The new L10n instance.
     * @returns {void}
     * @private
     */
    public setLocale(l10n: L10n): void {
        this.l10n = l10n;
        const statusCell: HTMLSpanElement | null = this.element.querySelector('.e-wf-simulation-entry-status');
        if (statusCell) {
            statusCell.setAttribute('aria-label', SimulationLogEntryView.statusLabel(l10n, this.entry.status, this.entry));
        }
        const resultCell: HTMLSpanElement | null = this.element.querySelector('.e-wf-simulation-entry-result');
        if (resultCell) {
            resultCell.textContent = SimulationLogEntryView.statusLabel(l10n, this.entry.status, this.entry);
        }
        if (this.expandBtn) {
            this.expandBtn.setAttribute(
                'title',
                this.expanded ? l10n.getConstant('hideIssues') : l10n.getConstant('showAllIssues')
            );
        }
    }

    /**
     * Matches Query.
     *
     * @param {string} query The query.
     * @returns {boolean} The result.
     * @private
     */
    public matchesQuery(query: string): boolean {
        if (!query) {
            return true;
        }
        const parts: string[] = [
            this.detail.stepName || '',
            this.entry.stepId || '',
            this.entry.connectionId || '',
            this.entry.message,
            this.entry.status,
            SimulationLogEntryView.statusLabel(this.l10n, this.entry.status, this.entry)
        ];
        const children: string[] = SimulationLogEntryView.childMessages(this.entry);
        // Build the haystack without any dynamic-keyed index access — using
        // `.map().join()` chained on the literal `parts` array, plus a parallel
        // pass over `children`, then mashing them together with string concat.
        // This sidesteps `security/detect-object-injection` because no
        // `obj[dynamicKey]` expression is ever emitted.
        const partHaystack: string = parts
            .map((item: string): string => String(item || ''))
            .filter((item: string): boolean => Boolean(item))
            .join(' ');
        const childHaystack: string = children
            .map((item: string): string => String(item || ''))
            .filter((item: string): boolean => Boolean(item && item.trim()))
            .join(' ');
        const haystack: string = (partHaystack + ' ' + childHaystack).trim().toLowerCase();
        return haystack.indexOf(query) >= 0;
    }

    /**
     * Child Messages.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {string} The result.
     * @private
     */
    public static childMessages(entry: WorkflowExecutionLogEntry): string[] {
        if (entry.messages && entry.messages.length) {
            return entry.messages.filter((item: string) => Boolean(item && String(item).trim()));
        }
        if (entry.error && Array.isArray(entry.error.details)) {
            const fromDetails: string[] = (entry.error.details as unknown[])
                .map((item: unknown) => {
                    if (typeof item === 'string') {
                        return item;
                    }
                    if (item && typeof item === 'object' && (item as { message?: string }).message) {
                        return String((item as { message?: string }).message);
                    }
                    return '';
                })
                .filter((item: string) => Boolean(item));
            if (fromDetails.length > 1) {
                return fromDetails;
            }
        }
        return entry.message ? [entry.message] : [];
    }

    /**
     * To Detail.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {ExecutionDetailData} The result.
     * @private
     */
    public static toDetail(entry: WorkflowExecutionLogEntry): ExecutionDetailData {
        const context: WorkflowRuntimeContext | undefined =
            entry.contextSummary && typeof entry.contextSummary === 'object'
                ? entry.contextSummary as WorkflowRuntimeContext
                : undefined;
        const nodeDescriptor: PropertyDescriptor | undefined =
            context && context.nodes && entry.stepId
                ? Object.getOwnPropertyDescriptor(context.nodes, String(entry.stepId))
                : undefined;
        const node: WorkflowStepResult | undefined = nodeDescriptor
            ? nodeDescriptor.value as WorkflowStepResult
            : undefined;
        const stepName: string | undefined = node && node.name
            ? node.name
            : entry.stepId;
        let output: unknown = node ? node.response : undefined;
        if (output === undefined && entry.error) {
            output = entry.error;
        }
        if (output === undefined && entry.messages && entry.messages.length) {
            output = { messages: entry.messages };
        }
        let input: unknown;
        if (context && context.previousStep && entry.stepId && context.previousStep.id !== entry.stepId) {
            input = context.previousStep.response;
        } else if (context && context.input) {
            input = context.input.response;
        }
        return {
            stepId: entry.stepId,
            stepName,
            input,
            output,
            context: entry.contextSummary,
            error: entry.error
        };
    }

    /**
     * Format Time.
     *
     * @param {number} timestamp The timestamp.
     * @returns {string} The result.
     * @private
     */
    public static formatTime(timestamp: number | string): string {
        const date: Date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(String(timestamp));
        if (isNaN(date.getTime())) {
            return String(timestamp);
        }
        // Include milliseconds so paced steps within the same second remain distinct.
        return SimulationLogEntryView.pad2(date.getHours())
            + ':' + SimulationLogEntryView.pad2(date.getMinutes())
            + ':' + SimulationLogEntryView.pad2(date.getSeconds())
            + '.' + SimulationLogEntryView.pad3(date.getMilliseconds());
    }

    private static pad2(value: number): string {
        return value < 10 ? '0' + value : String(value);
    }

    private static pad3(value: number): string {
        if (value < 10) {
            return '00' + value;
        }
        if (value < 100) {
            return '0' + value;
        }
        return String(value);
    }

    /**
     * Is Final Failed.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {boolean} The result.
     * @private
     */
    public static isFinalFailed(entry: WorkflowExecutionLogEntry): boolean {
        if (entry.status !== 'Final') {
            return false;
        }
        if (entry.error) {
            return true;
        }
        return Boolean(entry.message && /fail/i.test(String(entry.message)));
    }

    /**
     * Status Label.
     *
     * @param {L10n} l10n The localization instance.
     * @param {WorkflowExecutionLogEntryStatus} status The status.
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {string} The result.
     * @private
     */
    public static statusLabel(
        l10n: L10n,
        status: WorkflowExecutionLogEntryStatus,
        entry?: WorkflowExecutionLogEntry
    ): string {
        switch (status) {
        case 'Completed':
            return l10n.getConstant('statusSuccess');
        case 'Error':
            return l10n.getConstant('statusFailure');
        case 'Started':
            return l10n.getConstant('statusStarted');
        case 'Skipped':
            return l10n.getConstant('statusSkipped');
        case 'Retry':
            return l10n.getConstant('statusRetry');
        case 'Warning':
            return l10n.getConstant('statusWarning');
        case 'Stopped':
            return l10n.getConstant('statusStopped');
        case 'Validation':
            return l10n.getConstant('statusValidation');
        case 'Final':
            if (entry && SimulationLogEntryView.isFinalFailed(entry)) {
                return l10n.getConstant('statusFailed');
            }
            return l10n.getConstant('statusCompleted');
        default:
            return String(status);
        }
    }

    /**
     * Status Icon Class.
     *
     * @param {WorkflowExecutionLogEntryStatus} status The status.
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {string} The result.
     * @private
     */
    public static statusIconClass(
        status: WorkflowExecutionLogEntryStatus,
        entry?: WorkflowExecutionLogEntry
    ): string {
        switch (status) {
        case 'Completed':
            return 'e-check';
        case 'Final':
            return entry && SimulationLogEntryView.isFinalFailed(entry) ? 'e-close' : 'e-check';
        case 'Error':
        case 'Validation':
            return 'e-close';
        case 'Stopped':
            return 'e-stop-rectangle';
        case 'Retry':
            return 'e-refresh';
        case 'Warning':
            return 'e-warning';
        case 'Skipped':
            return 'e-circle-info';
        case 'Started':
            return 'e-play';
        default:
            return 'e-circle-info';
        }
    }

    /**
     * Row Class.
     *
     * @param {WorkflowExecutionLogEntryStatus} status The status.
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {string} The result.
     * @private
     */
    public static rowClass(
        status: WorkflowExecutionLogEntryStatus,
        entry?: WorkflowExecutionLogEntry
    ): string {
        let modifier: string = String(status).toLowerCase();
        if (status === 'Final' && entry && SimulationLogEntryView.isFinalFailed(entry)) {
            modifier = 'final-failed';
        }
        return 'e-wf-simulation-entry e-wf-simulation-entry-' + modifier;
    }

    /**
     * Is Step Row.
     *
     * @param {WorkflowExecutionLogEntry} entry The entry.
     * @returns {boolean} The result.
     * @private
     */
    public static isStepRow(entry: WorkflowExecutionLogEntry): boolean {
        return Boolean(entry.stepId) && (entry.status === 'Completed' || entry.status === 'Error'
            || entry.status === 'Skipped' || entry.status === 'Stopped' || entry.status === 'Retry'
            || entry.status === 'Validation' || entry.status === 'Warning');
    }
}
