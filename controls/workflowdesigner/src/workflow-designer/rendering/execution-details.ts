import { L10n } from '@syncfusion/ej2-base';
import { Tab, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { SecretRedactor } from '../simulation/secret-redactor';

/**
 * Execution Detail Tab.
 *
 * @private
 */
export type ExecutionDetailTab = 'output' | 'input' | 'json';

/**
 * Execution Detail Data.
 *
 * @private
 */
export interface ExecutionDetailData {
    stepId?: string;
    stepName?: string;
    input?: unknown;
    output?: unknown;
    context?: unknown;
    error?: unknown;
}

/**
 * Right-hand execution detail pane: Output / Input / JSON tabs.
 * Rendered with the Syncfusion `Tab` so the pane inherits the active theme;
 * secrets redacted; oversized values truncated safely.
 *
 * NOTE: this supersedes the `FR-014a` native-HTML-UI dependency boundary for
 * this file. The boundary remains in force for files not yet migrated.
 *
 * @private
 */
export class ExecutionDetails {
    private root: HTMLDivElement | null = null;
    private titleEl: HTMLSpanElement | null = null;
    private bodyEl: HTMLPreElement | null = null;
    private tab: Tab | null = null;
    private tabElement: HTMLDivElement | null = null;
    private l10n: L10n | undefined;
    /** Tab order, used to map a selected index back to a tab key. */
    private static readonly TAB_ORDER: ExecutionDetailTab[] = ['output', 'input', 'json'];
    private activeTab: ExecutionDetailTab = 'output';
    private data: ExecutionDetailData | null = null;

    /**
     * Creates the execution details pane.
     *
     * @param {L10n} [l10n] The localization instance.
     * @returns {void} Nothing.
     */
    public constructor(l10n?: L10n) {
        this.l10n = l10n;
    }

    /**
     * Create.
     *
     * @param {HTMLElement} host The host.
     * @returns {void} Nothing.
     * @private
     */
    public create(host: HTMLElement): void {
        this.root = document.createElement('div');
        this.root.className = 'e-wf-execution-details';

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-execution-details-header';
        this.titleEl = document.createElement('span');
        this.titleEl.className = 'e-wf-execution-details-title';
        this.titleEl.textContent = this.resolveCaption('stepDetails', 'Step details');
        header.appendChild(this.titleEl);

        this.tabElement = document.createElement('div');
        this.tabElement.className = 'e-wf-execution-details-tabs';

        const bodyWrap: HTMLDivElement = document.createElement('div');
        bodyWrap.className = 'e-wf-execution-details-body';
        this.bodyEl = document.createElement('pre');
        this.bodyEl.className = 'e-wf-execution-details-content';
        bodyWrap.appendChild(this.bodyEl);

        this.root.appendChild(header);
        this.root.appendChild(this.tabElement);
        this.root.appendChild(bodyWrap);
        host.appendChild(this.root);

        // Instantiated after the host is attached: a component initialised
        // while detached measures zero.
        //
        // The three tabs share one `<pre>` that lives outside the Tab, as it
        // did before. Moving the payload into per-tab content would mean
        // three copies of a value that can reach 100k characters, so the
        // single shared body is kept and only the header strip is themed.
        this.tab = new Tab({
            cssClass: 'e-wf-execution-details-tab',
            items: this.tabItems(),
            selectedItem: ExecutionDetails.TAB_ORDER.indexOf(this.activeTab),
            selected: (args: SelectEventArgs) => {
                const index: number = args && typeof args.selectedIndex === 'number'
                    ? args.selectedIndex
                    : 0;
                // `find` with its index argument avoids indexing the array
                // with a variable, which the security lint rules reject.
                const next: ExecutionDetailTab | undefined = ExecutionDetails.TAB_ORDER
                    .find((_tab: ExecutionDetailTab, position: number) => position === index);
                if (next) {
                    this.setActiveTab(next);
                }
            }
        });
        this.tab.appendTo(this.tabElement);
        this.renderEmpty();
    }

    /**
     * Show.
     *
     * @param {ExecutionDetailData} data The data.
     * @returns {void} Nothing.
     * @private
     */
    public show(data: ExecutionDetailData): void {
        this.data = data;
        if (this.titleEl) {
            this.titleEl.textContent = data.stepName || data.stepId || this.resolveCaption('stepDetails', 'Step details');
        }
        this.renderActive();
    }

    /**
     * Clear.
     *
     * @returns {void} Nothing.
     * @private
     */
    public clear(): void {
        this.data = null;
        if (this.titleEl) {
            this.titleEl.textContent = this.resolveCaption('stepDetails', 'Step details');
        }
        this.renderEmpty();
    }

    /**
     * Destroy.
     *
     * @returns {void} Nothing.
     * @private
     */
    public destroy(): void {
        if (this.tab) {
            this.tab.destroy();
            this.tab = null;
        }
        if (this.root) {
            this.root.remove();
        }
        this.root = null;
        this.titleEl = null;
        this.bodyEl = null;
        this.tabElement = null;
        this.data = null;
    }

    public setLocale(l10n: L10n): void {
        this.l10n = l10n;
        if (this.titleEl && (!this.data || (!this.data.stepName && !this.data.stepId))) {
            this.titleEl.textContent = this.resolveCaption('stepDetails', 'Step details');
        }
        if (this.tab) {
            this.tab.items = this.tabItems();
            this.tab.dataBind();
        }
    }

    private tabItems(): { header: { text: string } }[] {
        return [
            { header: { text: this.resolveCaption('output', 'Output') } },
            { header: { text: this.resolveCaption('input', 'Input') } },
            { header: { text: this.resolveCaption('json', 'JSON') } }
        ];
    }

    private resolveCaption(key: string, fallback: string): string {
        return this.l10n ? (this.l10n.getConstant(key) || fallback) : fallback;
    }

    private setActiveTab(tab: ExecutionDetailTab): void {
        this.activeTab = tab;
        this.renderActive();
    }

    private renderEmpty(): void {
        if (this.bodyEl) {
            this.bodyEl.textContent = this.resolveCaption(
                'selectExecutionRow',
                'Select a step execution row to inspect its context.'
            );
        }
    }

    private renderActive(): void {
        if (!this.bodyEl) {
            return;
        }
        if (!this.data) {
            this.renderEmpty();
            return;
        }
        let value: unknown;
        if (this.activeTab === 'output') {
            value = this.data.error ? { error: this.data.error, output: this.data.output } : this.data.output;
        } else if (this.activeTab === 'input') {
            value = this.data.input;
        } else {
            value = this.data.context !== undefined ? this.data.context : {
                input: this.data.input,
                output: this.data.output,
                error: this.data.error
            };
        }
        this.bodyEl.textContent = ExecutionDetails.stringifySafe(SecretRedactor.redact(value));
    }

    /**
     * Stringify Safe.
     *
     * @param {Object} value The value.
     * @param {number} maxChars The max chars.
     * @returns {string} The result.
     * @private
     */
    public static stringifySafe(value: unknown, maxChars: number = 100000): string {
        if (value === undefined) {
            return 'undefined';
        }
        if (value === null) {
            return 'null';
        }
        try {
            const seen: object[] = [];
            const text: string = JSON.stringify(
                value,
                (_key: string, current: unknown) => {
                    if (current && typeof current === 'object') {
                        if (seen.indexOf(current as object) !== -1) {
                            return '[Circular]';
                        }
                        seen.push(current as object);
                    }
                    if (typeof current === 'function') {
                        return undefined;
                    }
                    return current;
                },
                2
            );
            if (text === undefined) {
                return String(value);
            }
            if (text.length > maxChars) {
                return text.slice(0, maxChars) + '\n… [truncated]';
            }
            return text;
        } catch (error) {
            return String(value);
        }
    }
}
