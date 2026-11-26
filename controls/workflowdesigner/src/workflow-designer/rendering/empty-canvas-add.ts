import { L10n } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { localeDefaults } from '../localization/locale-defaults';
/**
 * Empty-canvas Add control.
 *
 * A centered component-owned native HTML control shown when the canvas has no
 * workflow steps. Clicking it opens the Node Collection at the first-step
 * insertion point (trigger types shown/enabled; non-trigger types
 * hidden/disabled when a trigger is required first). After the first node is
 * inserted, the control is removed/hidden (the Node Collection and
 * InsertionController own the actual insertion).
 *
 * Rendered with a Syncfusion `Button` so the control inherits the active
 * theme, with an accessible name, tooltip and unique `e-wf-*` CSS class.
 *
 * NOTE: this supersedes the `FR-014a` native-HTML-UI dependency boundary for
 * this file. The boundary remains in force for files not yet migrated.
 *
 * @internal
 * @private
 */
export class EmptyCanvasAddControl {
    private readonly host: HTMLElement;
    private readonly onOpen: () => void;
    private l10n: L10n | undefined;
    private readOnly: boolean = false;
    private element: HTMLButtonElement | null = null;
    private button: Button | null = null;

    /**
     * Creates the empty-canvas Add control.
     *
     * @param {HTMLElement} host The canvas region element to overlay.
     * @param {Function} onOpen Invoked when the control is clicked (opens the Node
     * Collection at the EmptyCanvas insertion point).
     * @param {L10n} [l10n] Optional L10n bundle. When omitted the control
     *   falls back to the bundled English string for the visible chrome.
     * @private
     */
    public constructor(host: HTMLElement, onOpen: () => void, l10n?: L10n) {
        this.host = host;
        this.onOpen = onOpen;
        this.l10n = l10n;
    }

    /**
     * Shows the centered Add control when the canvas has no workflow steps.
     *
     * @returns {void}
     * @private
     */
    public show(): void {
        if (this.element) {
            return;
        }
        const label: string = this.resolveCaption('addWorkflowStep');
        const button: HTMLButtonElement = document.createElement('button');
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.setAttribute('aria-disabled', String(this.readOnly));
        // Attached before instantiation: an EJ2 component initialised while
        // detached measures zero.
        this.host.appendChild(button);
        this.button = new Button({
            cssClass: 'e-wf-empty-canvas-add e-flat',
            iconCss: 'e-icons e-plus',
            disabled: this.readOnly
        });
        this.button.appendTo(button);
        button.addEventListener('click', this.onOpen);
        this.element = button;
    }

    /**
     * Update the L10n bundle at runtime (called from the host's
     * `setLocale(l10n)` mirror). The control's button is re-rendered with
     * the resolved label so a locale change takes effect immediately
     * even when the control is already on screen.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(l10n?: L10n): void {
        this.l10n = l10n;
        if (!this.element) {
            return;
        }
        const label: string = this.resolveCaption('addWorkflowStep');
        this.element.setAttribute('aria-label', label);
        this.element.setAttribute('title', label);
    }

    /**
     * Resolve a localised string from the L10n bundle, with a fallback
     * to the bundled English string.
     *
     * @param {string} key The key.
     * @returns {string} The resolved string.
     * @private
     */
    private resolveCaption(key: string): string {
        let value: string = key;
        if (this.l10n) {
            const localised: string = this.l10n.getConstant(key);
            if (localised) {
                value = localised;
            }
        }
        if (value === key && localeDefaults[`${key}`]) {
            value = localeDefaults[`${key}`];
        }
        return value;
    }

    /**
     * Enables or disables the control when the workflow is locked.
     *
     * @param {boolean} readOnly Whether the workflow is locked.
     * @returns {void}
     * @private
     */
    public setReadOnly(readOnly: boolean): void {
        this.readOnly = readOnly;
        if (this.button) {
            this.button.disabled = readOnly;
            this.button.dataBind();
        }
        if (this.element) {
            this.element.setAttribute('aria-disabled', String(readOnly));
        }
    }

    /**
     * Removes/hides the control after the first node is added.
     *
     * @returns {void}
     * @private
     */
    public hide(): void {
        if (this.button) {
            this.button.destroy();
            this.button = null;
        }
        if (this.element) {
            this.element.removeEventListener('click', this.onOpen);
            this.element.remove();
            this.element = null;
        }
    }

    /**
     * Removes the control and its native event listener.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.hide();
    }
}

