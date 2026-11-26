/**
 * AI Assist configuration dialog.
 *
 * Extracted from `ai-assist-controller.ts` so the `AIAssistView` integration
 * in that file is not disturbed by this migration, and rebuilt on the
 * Syncfusion `Dialog` so it inherits the active theme.
 *
 * The dialog writes the value supplied through `setCredential` onto the AI
 * Assist settings (`settings.credential`) until the user replaces or clears it.
 * Cancelling leaves the previously stored value intact.
 */

import { L10n } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { WorkflowAIAssistSettingsModel } from '../models/workflow-ai-assist-settings-model';
import {
    AI_ASSIST_DEFAULT_MODEL,
    AI_ASSIST_DEFAULT_PROVIDER,
    AI_ASSIST_DEFAULT_TRANSPORT_MODE,
    ResolvedAIAssistConfig,
    WorkflowAIAssistProvider,
    resolveAIAssistConfig
} from '../models/workflow-ai-assist-settings';
import { AI_ASSIST_FALLBACKS, aiAssistFormatTemplate } from './ai-assist-fallbacks';

/**
 * AIAssist Settings Dialog Result.
 *
 * @private
 */
export interface AIAssistSettingsDialogResult {
    provider: string;
    model: string;
    serverUrl: string;
    /** Raw API key / bearer token carried on the settings object, or empty string if the user cleared. */
    credential: string;
}

/**
 * Snapshot of the settings the dialog edits. Pure data so the dialog is trivially testable.
 *
 * @private
 */
export interface AIAssistSettingsDialogOptions {
    provider: string;
    model: string;
    serverUrl: string;
    /** Existing raw credential carried on the AIAssistSettings.credential field. */
    credential: string;
}

/**
 * Public callbacks fired when the dialog accepts / cancels.
 *
 * @private
 */
export interface AIAssistSettingsDialogHandlers {
    /** Called with the dialog result on Save. */
    onSave: (result: AIAssistSettingsDialogResult) => void;
    /** Called when the dialog is dismissed without saving. */
    onCancel: () => void;
    /** How the credential field is interpreted; `Reference` shows a plain name, `Inline` a masked key. */
    credentialMode?: 'Reference' | 'Inline';
}

/**
 * AIAssist Settings Dialog.
 *
 * @private
 */
export class AIAssistSettingsDialog {
    private readonly container: HTMLElement;
    private readonly settings: WorkflowAIAssistSettingsModel;
    private readonly handlers: AIAssistSettingsDialogHandlers;
    private readonly l10n: L10n | undefined;
    private dialog: Dialog | null = null;
    private target: HTMLDivElement | null = null;
    private provider: DropDownList | null = null;
    private model: TextBox | null = null;
    private serverUrl: TextBox | null = null;
    private credential: TextBox | null = null;
    private serverField: HTMLDivElement | null = null;
    private providerField: HTMLDivElement | null = null;
    private modelField: HTMLDivElement | null = null;
    private credentialField: HTMLDivElement | null = null;
    private savedHint: HTMLDivElement | null = null;
    /** True once Save has resolved, so Dialog's close event cannot also cancel. */
    private saving: boolean = false;

    /**
     * Creates the instance.
     *
     * @param {HTMLElement} container The container.
     * @param {WorkflowAIAssistSettingsModel} settings The settings.
     * @param {AIAssistSettingsDialogHandlers} handlers The handlers.
     * @param {L10n} [l10n] Optional L10n bundle. When omitted the dialog
     *   falls back to the bundled English table for every visible label.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        container: HTMLElement,
        settings: WorkflowAIAssistSettingsModel,
        handlers: AIAssistSettingsDialogHandlers,
        l10n?: L10n
    ) {
        this.container = container;
        this.settings = settings;
        this.handlers = handlers;
        this.l10n = l10n;
    }

    /**
     * Resolve a localised string from the L10n bundle, with a fallback
     * to the bundled English string.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private resolveCaption(key: string, args?: string[]): string {
        let value: string = key;
        if (this.l10n) {
            const localised: string = this.l10n.getConstant(key);
            if (localised) {
                value = localised;
            }
        }
        if (value === key && AI_ASSIST_FALLBACKS[`${key}`]) {
            value = AI_ASSIST_FALLBACKS[`${key}`];
        }
        if (args && args.length) {
            return aiAssistFormatTemplate(value, args);
        }
        return value;
    }

    /**
     * Open.
     *
     * @returns {void} Nothing.
     * @private
     */
    public open(): void {
        if (this.dialog) {
            return;
        }
        this.saving = false;
        const snap: AIAssistSettingsDialogOptions = this.snapshot();

        const target: HTMLDivElement = document.createElement('div');
        this.container.appendChild(target);
        this.target = target;

        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-ai-assist-settings-body';

        const providerHost: HTMLInputElement = document.createElement('input');
        providerHost.type = 'text';
        this.providerField = this.makeField(this.resolveCaption('aiAssistSettingsProvider'), providerHost);
        body.appendChild(this.providerField);

        const modelHost: HTMLInputElement = document.createElement('input');
        modelHost.type = 'text';
        this.modelField = this.makeField(this.resolveCaption('aiAssistSettingsModel'), modelHost);
        body.appendChild(this.modelField);

        const serverHostInput: HTMLInputElement = document.createElement('input');
        // `url` keeps the native input behaviour inside the themed wrapper.
        serverHostInput.type = 'url';
        const serverField: HTMLDivElement = this.makeField(this.resolveCaption('aiAssistSettingsServerUrl'), serverHostInput);
        this.serverField = serverField;
        body.appendChild(serverField);

        const referenceMode: boolean = this.handlers.credentialMode !== 'Inline';
        const credentialHost: HTMLInputElement = document.createElement('input');
        credentialHost.type = referenceMode ? 'text' : 'password';
        const credentialField: HTMLDivElement = document.createElement('div');
        credentialField.className = 'e-wf-ai-assist-field';
        const credentialLabel: HTMLLabelElement = document.createElement('label');
        credentialLabel.className = 'e-wf-ai-assist-field-label';
        credentialLabel.textContent = this.resolveCaption(referenceMode ? 'aiAssistSettingsCredentialReference' : 'aiAssistSettingsApiKeyInline');
        credentialField.appendChild(credentialLabel);
        const helper: HTMLDivElement = document.createElement('div');
        helper.className = 'e-wf-ai-assist-credential-helper';
        helper.appendChild(credentialHost);
        credentialField.appendChild(helper);
        const savedHint: HTMLDivElement = document.createElement('div');
        savedHint.className = 'e-wf-ai-assist-credential-saved-hint';
        savedHint.textContent = this.describeStoredCredential(snap.credential);
        savedHint.style.display = snap.credential ? '' : 'none';
        credentialField.appendChild(savedHint);
        this.credentialField = credentialField;
        this.savedHint = savedHint;
        body.appendChild(credentialField);

        const dialog: Dialog = new Dialog({
            header: this.resolveCaption('aiAssistSettingsDialogTitle'),
            content: body,
            isModal: true,
            // The original overlay offered no close glyph — only Escape and
            // the backdrop — so this stays off.
            showCloseIcon: false,
            closeOnEscape: true,
            width: '480px',
            cssClass: 'e-wf-dialog e-wf-ai-assist-settings',
            buttons: [
                {
                    buttonModel: { content: this.resolveCaption('aiAssistSettingsCancel'), cssClass: 'e-wf-ai-assist-cancel' },
                    click: (): void => this.cancel()
                },
                {
                    buttonModel: {
                        content: this.resolveCaption('aiAssistSettingsSave'),
                        isPrimary: true,
                        cssClass: 'e-wf-dialog-primary e-wf-ai-assist-save'
                    },
                    click: (): void => this.save(snap)
                }
            ],
            // Escape and the overlay both land here. Save sets `saving`
            // first so the close it triggers does not also fire onCancel.
            close: (): void => {
                if (!this.saving) {
                    this.cancel();
                }
            },
            open: (): void => {
                if (this.provider) {
                    this.provider.focusIn();
                }
            }
        });
        dialog.appendTo(target);
        this.dialog = dialog;

        // Components are mounted after the dialog attaches its content:
        // one initialised while detached measures zero.
        const providers: WorkflowAIAssistProvider[] = ['Gemini', 'OpenAI', 'Claude'];
        this.provider = new DropDownList({
            cssClass: 'e-wf-ai-assist-select',
            dataSource: providers.slice() as string[],
            value: snap.provider || AI_ASSIST_DEFAULT_PROVIDER
        });
        this.provider.appendTo(providerHost);
        this.provider.element.setAttribute('aria-label', this.resolveCaption('aiAssistSettingsProvider'));

        this.model = new TextBox({
            cssClass: 'e-wf-ai-assist-input',
            placeholder: this.resolveCaption('aiAssistSettingsModelPlaceholder'),
            value: snap.model
        });
        this.model.appendTo(modelHost);
        this.model.element.setAttribute('aria-label', this.resolveCaption('aiAssistSettingsModel'));

        this.serverUrl = new TextBox({
            cssClass: 'e-wf-ai-assist-input',
            placeholder: this.resolveCaption('aiAssistSettingsServerUrlPlaceholder'),
            value: snap.serverUrl
        });
        this.serverUrl.appendTo(serverHostInput);
        this.serverUrl.element.setAttribute('aria-label', this.resolveCaption('aiAssistSettingsServerUrl'));

        const referenceField: boolean = this.handlers.credentialMode !== 'Inline';
        this.credential = new TextBox({
            cssClass: 'e-wf-ai-assist-input',
            placeholder: this.resolveCaption(referenceField ? 'credentialReferencePlaceholder' : 'aiAssistSettingsCredentialPlaceholder'),
            value: referenceField ? this.resolved().credentialRef : undefined
        });
        this.credential.appendTo(credentialHost);
        this.credential.element.setAttribute('aria-label',
                                             this.resolveCaption(referenceField ? 'aiAssistSettingsCredentialReference' : 'aiAssistSettingsApiKeyInline'));
        this.credential.element.setAttribute('autocomplete', 'new-password');
        this.credential.element.spellcheck = false;

        this.refreshServerVisibility();
    }

    /**
     * Close.
     *
     * @returns {void} Nothing.
     * @private
     */
    public close(): void {
        const dialog: Dialog | null = this.dialog;
        const target: HTMLDivElement | null = this.target;
        if (!dialog && !target) {
            return;
        }
        this.dialog = null;
        this.target = null;
        const owned: Array<{ destroy: () => void } | null> = [
            this.provider, this.model, this.serverUrl, this.credential
        ];
        this.provider = null;
        this.model = null;
        this.serverUrl = null;
        this.credential = null;
        this.serverField = null;
        this.providerField = null;
        this.modelField = null;
        this.credentialField = null;
        this.savedHint = null;
        // Deferred by one task: `close` is reached from inside the Dialog's
        // own button and overlay handlers, which still use the element.
        window.setTimeout(() => {
            owned.forEach((instance: { destroy: () => void } | null) => {
                if (!instance) {
                    return;
                }
                try {
                    instance.destroy();
                } catch (error) {
                    // Already disposed.
                }
            });
            if (dialog) {
                try {
                    dialog.destroy();
                } catch (error) {
                    // Already disposed.
                }
            }
            if (target && target.parentNode) {
                target.parentNode.removeChild(target);
            }
        }, 0);
        if (dialog) {
            dialog.hide();
        }
    }

    /**
     * Dispose.
     *
     * @returns {void} Nothing.
     * @private
     */
    public dispose(): void {
        this.close();
    }

    /**
     * Builds the current snapshot of the settings into the dialog form values.
     *
     * @returns {AIAssistSettingsDialogOptions} The current settings snapshot for the dialog form.
     * @private
     */
    public snapshot(): AIAssistSettingsDialogOptions {
        const config: ResolvedAIAssistConfig = this.resolved();
        return {
            provider: config.provider || AI_ASSIST_DEFAULT_PROVIDER,
            model: config.model || AI_ASSIST_DEFAULT_MODEL,
            serverUrl: config.serverUrl,
            credential: this.handlers.credentialMode === 'Inline' ? config.apiKey : config.credentialRef
        };
    }

    private resolved(): ResolvedAIAssistConfig {
        return resolveAIAssistConfig(this.settings, this.handlers.credentialMode);
    }

    /**
     * Collects the form values and reports them to the host.
     *
     * @param {AIAssistSettingsDialogOptions} snap The snapshot taken when the dialog opened.
     * @returns {void}
     */
    private save(snap: AIAssistSettingsDialogOptions): void {
        const providerValue: unknown = this.provider ? this.provider.value : '';
        const provider: string = (providerValue === null || providerValue === undefined
            ? ''
            : String(providerValue)) || AI_ASSIST_DEFAULT_PROVIDER;
        const modelRaw: string = this.model ? String(this.model.element.value || '').trim() : '';
        const model: string = modelRaw || AI_ASSIST_DEFAULT_MODEL;
        const serverUrl: string = this.serverUrl ? String(this.serverUrl.element.value || '').trim() : '';
        const rawCredential: string = this.credential ? String(this.credential.element.value || '') : '';
        let nextCredential: string = snap.credential;

        if (rawCredential.length > 0) {
            // Accept whatever the user pasted — the executor will surface
            // a clean provider-level error if the key is wrong. The
            // dialog never rejects input; it stores the raw value as-is
            // on the settings object via `setCredential` and lets the
            // next AI call produce the real diagnostic.
            nextCredential = rawCredential;
        } else if (rawCredential.length === 0 && snap.credential && this.handlers.credentialMode !== 'Inline') {
            // Reference mode pre-fills the field with the stored reference, so an
            // empty field means the user cleared it. In Inline mode the secret is
            // never pre-filled, so an empty field means "keep the stored key";
            // otherwise saving any other setting would silently erase the key.
            nextCredential = '';
        }
        if (this.credential) {
            this.credential.value = '';
            this.credential.dataBind();
        }
        if (this.savedHint) {
            // After Save we re-render the saved hint outside of this dialog.
            this.savedHint.style.display = 'none';
        }
        const resultPayload: AIAssistSettingsDialogResult = {
            provider: provider,
            model: model,
            serverUrl: serverUrl,
            credential: nextCredential
        };
        this.saving = true;
        this.close();
        this.handlers.onSave(resultPayload);
    }

    private cancel(): void {
        this.close();
        this.handlers.onCancel();
    }

    /**
     * Shows the Server URL in Reference credential mode and the provider, model and API key in Inline mode.
     *
     * @returns {void}
     */
    private refreshServerVisibility(): void {
        const reference: boolean = this.handlers.credentialMode !== 'Inline';
        if (this.serverField) {
            this.serverField.style.display = reference ? '' : 'none';
        }
        if (this.credentialField) {
            this.credentialField.style.display = reference ? 'none' : '';
        }
        if (this.providerField) {
            this.providerField.style.display = reference ? 'none' : '';
        }
        if (this.modelField) {
            this.modelField.style.display = reference ? 'none' : '';
        }
    }

    private makeField(labelText: string, control: HTMLElement): HTMLDivElement {
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.className = 'e-wf-ai-assist-field';
        const label: HTMLLabelElement = document.createElement('label');
        label.className = 'e-wf-ai-assist-field-label';
        label.textContent = labelText;
        wrapper.appendChild(label);
        const control_: HTMLDivElement = document.createElement('div');
        control_.className = 'e-wf-ai-assist-control';
        control_.appendChild(control);
        wrapper.appendChild(control_);
        return wrapper;
    }

    private describeStoredCredential(credential: string): string {
        const text: string = String(credential || '').trim();
        if (!text) {
            return this.resolveCaption('aiAssistSettingsNoCredential');
        }
        if (this.handlers.credentialMode !== 'Inline') {
            // A reference is a name, not a secret: show it.
            return this.resolveCaption('aiAssistSettingsStoredReference', [text]);
        }
        // Mask the prefix so the user knows a credential is set without
        // exposing its full length.
        return this.resolveCaption(
            'aiAssistSettingsStoredCredential',
            [this.maskCredential(text)]
        );
    }

    private maskCredential(credential: string): string {
        const text: string = String(credential || '').trim();
        if (!text) {
            return '';
        }
        if (text.length <= 8) {
            return text;
        }
        return text.substring(0, 4) + '…' + text.substring(text.length - 4);
    }
}
