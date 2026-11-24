import { L10n } from '@syncfusion/ej2-base';
import { createL10n, DEFAULT_PPTX_LOCALE } from '../localization/localization';
import {
    PresentationLoadError,
    PresentationLoadProgress
} from './presentation-source';

/**
 * Default localization keys for loading, cancellation and error UI.
 * @private
 */
export const DEFAULT_LOAD_LOCALE: Record<string, string> = DEFAULT_PPTX_LOCALE;

/**
 * Host operations consumed by the accessible loading overlay.
 * @private
 */
export interface LoadUiHost {
    readonly locale: string;
    cancelLoad(): void;
    retryLoad(): Promise<void>;
}

/**
 * Accessible loading/error overlay bound to loader lifecycle events.
 * @constructor
 * @private
 */
export class LoadUi {
    private readonly host: LoadUiHost;
    private root: HTMLElement | null = null;
    private loadingPanel: HTMLElement | null = null;
    private errorPanel: HTMLElement | null = null;
    private progress: HTMLProgressElement | null = null;
    private status: HTMLElement | null = null;
    private errorMessage: HTMLElement | null = null;
    private l10n: L10n;
    private lastAnnouncement: string = '';

    public constructor(host: LoadUiHost) {
        this.host = host;
        this.l10n = createL10n(host.locale);
    }

    public initialize(container: HTMLElement): void {
        void ((container.querySelector('.ej2-pptx-load-ui')) !== undefined && (container.querySelector('.ej2-pptx-load-ui')) !== null ? (container.querySelector('.ej2-pptx-load-ui')).remove() : undefined);
        this.l10n.setLocale(this.host.locale);
        const root: HTMLElement = document.createElement('div');
        root.className = 'ej2-pptx-load-ui';

        const loading: HTMLElement = document.createElement('section');
        loading.className = 'ej2-pptx-load-panel';
        loading.setAttribute('role', 'status');
        loading.setAttribute('aria-live', 'polite');
        loading.setAttribute('aria-atomic', 'true');
        loading.hidden = true;
        const status: HTMLElement = document.createElement('span');
        status.className = 'ej2-pptx-load-status';
        const progress: HTMLProgressElement = document.createElement('progress');
        progress.max = 100;
        progress.removeAttribute('value');
        progress.setAttribute('aria-label', 'Loading presentation');
        const cancel: HTMLButtonElement = this.button(
            'cancel',
            this.text('Cancel'),
            (): void => this.host.cancelLoad()
        );
        loading.append(status, progress, cancel);

        const error: HTMLElement = document.createElement('section');
        error.className = 'ej2-pptx-load-error';
        error.setAttribute('role', 'alert');
        error.setAttribute('aria-atomic', 'true');
        error.hidden = true;
        const title: HTMLElement = document.createElement('h2');
        title.setAttribute('data-load-error-title', '');
        title.textContent = this.text('LoadErrorTitle');
        const message: HTMLElement = document.createElement('p');
        message.setAttribute('data-load-error-message', '');
        const actions: HTMLElement = document.createElement('div');
        actions.className = 'ej2-pptx-load-actions';
        actions.append(
            this.button('retry', this.text('Retry'), (): void => {
                void this.host.retryLoad().catch((): void => undefined);
            }),
            this.button('dismiss', this.text('Cancel'), (): void => this.hide())
        );
        error.append(title, message, actions);

        root.append(loading, error);
        container.appendChild(root);
        this.root = root;
        this.loadingPanel = loading;
        this.errorPanel = error;
        this.progress = progress;
        this.status = status;
        this.errorMessage = message;
    }

    public showLoading(progress?: PresentationLoadProgress): void {
        if (!this.loadingPanel || !this.errorPanel || !this.progress || !this.status) {
            return;
        }
        this.loadingPanel.hidden = false;
        this.errorPanel.hidden = true;
        const percent: number | undefined = progress && progress.percent;
        const message: string = percent === undefined
            ? this.text('Loading')
            : this.format('LoadingPercent', String(Math.round(percent)));
        if (percent === undefined) {
            this.progress.removeAttribute('value');
        } else {
            this.progress.value = percent;
        }
        if (message !== this.lastAnnouncement) {
            this.status.textContent = message;
            this.lastAnnouncement = message;
        }
    }

    public showError(error: PresentationLoadError): void {
        if (!this.loadingPanel || !this.errorPanel || !this.errorMessage) {
            return;
        }
        this.loadingPanel.hidden = true;
        this.errorPanel.hidden = false;
        this.errorMessage.textContent = this.text(error.messageKey);
    }

    public hide(): void {
        if (this.loadingPanel) {
            this.loadingPanel.hidden = true;
        }
        if (this.errorPanel) {
            this.errorPanel.hidden = true;
        }
        this.lastAnnouncement = '';
    }

    public destroy(): void {
        void ((this.root) !== undefined && (this.root) !== null ? (this.root).remove() : undefined);
        this.root = null;
    }

    private button(action: string, label: string, clicked: () => void): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.type = 'button';
        button.className = 'e-btn';
        button.setAttribute('data-load-action', action);
        button.textContent = label;
        button.addEventListener('click', clicked);
        return button;
    }

    private text(key: string): string {
        return this.l10n.getConstant(key);
    }

    private format(key: string, value: string): string {
        return this.text(key).replace('{0}', value);
    }
}
