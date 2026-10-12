import { createElement } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { FormRenderer, FormSchema, UnifiedSchema } from '@syncfusion/ej2-form-renderer';
import FormBuilder from '../../form-builder';
import MainSection from './main-section';

/** @private */
export interface PreviewPaneOwners {
    buttons: Button[];
    dialogs: any[];
    grids: any[];
    formRenderers: FormRenderer[];
    docListeners: Array<{
        target: EventTarget;
        event: string;
        handler: EventListener;
        opts?: AddEventListenerOptions | boolean;
    }>;
    timers: number[];
}

/** @private */
export interface PreviewPaneOptions {
    isOpen: boolean;
    onClose: () => void;
    schema?: UnifiedSchema | null;
    enableRtl?: boolean;
    formSchema: FormSchema;
    locale?: string;
    owners?: PreviewPaneOwners;
    /**
     * The owning `FormBuilder.toolboxItems` entries to forward to the
     * preview `FormRenderer` as its `customWidgetSettings`. Whatever the
     * builder received (`template` / `type` / `templateId`) is passed to
     * the renderer as-is so custom templates render identically in preview.
     */
    toolboxItems?: any[];
    formBuilder: FormBuilder
}

/** @private */
export class PreviewPane {

    private host: HTMLElement;
    private options: PreviewPaneOptions;

    private mainEl: HTMLElement | null;
    private formAreaEl: HTMLElement | null;
    private formHostEl: HTMLElement | null;
    private closeButton: Button | null;
    private formRenderer: FormRenderer | null;
    private formKey: number;
    private formBuilder: FormBuilder;

    private currentFormName: string;

    private owners: PreviewPaneOwners;
    private localListeners: Array<{
        target: EventTarget;
        event: string;
        handler: EventListener;
        opts?: AddEventListenerOptions | boolean;
    }>;
    private isMounted: boolean;
    private isDestroyed: boolean;

    private handlers: {
        handleClose: () => void;
    };

    constructor(host: HTMLElement, options: PreviewPaneOptions) {
        this.host = host;
        this.options = options;
        this.mainEl = null;
        this.formBuilder = options.formBuilder;
        this.formAreaEl = null;
        this.formHostEl = null;
        this.closeButton = null;
        this.formRenderer = null;
        this.formKey = 0;

        this.currentFormName = (options.formSchema && options.formSchema.settings && options.formSchema.settings.name)
            ? String(options.formSchema.settings.name)
            : 'Untitled Form';

        this.owners = (options.owners) ? options.owners : {
            buttons: [],
            dialogs: [],
            grids: [],
            formRenderers: [],
            docListeners: [],
            timers: []
        };
        this.localListeners = [];
        this.isMounted = false;
        this.isDestroyed = false;

        const self: PreviewPane = this;
        this.handlers = {
            handleClose: function (): void { self.close(); }
        };

        this.buildShell();
    }

    /** @private */
    public render(options: PreviewPaneOptions): void {
        if (this.isDestroyed) {
            return;
        }
        this.options = options;
        if (options.formSchema) {
            this.currentFormName = (options.formSchema.settings && options.formSchema.settings.name)
                ? String(options.formSchema.settings.name)
                : 'Untitled Form';
        }
        this.applyVisibility();
        if (this.options.isOpen) {
            this.mountPreview();
        } else if (!this.options.isOpen) {
            this.unmountPreview();
        }
    }

    /** @private */
    public close(): void {
        if (this.isDestroyed) {
            return;
        }
        if (this.options.onClose) {
            this.options.onClose();
        }
    }

    /**
     * Programmatically sets a form field's value for user edits.
     *
     * @private
     * @param  {string} fieldName - The field's `name` (the schema property's `name`).
     * @param  {any} value - The new value to set.
     * @returns void
     */
    public setFieldValue(fieldName: string, value: any): void {
        this.formRenderer.setFieldValue(fieldName, value);
    }

    /** @private */
    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;
        this.unmountPreview();
        if (this.closeButton) {
            try {
                this.closeButton.destroy();
            } catch (err) {
                /* ignore */
            }
            this.removeFromOwners('buttons', this.closeButton);
            this.closeButton = null;
        }
        this.removeLocalListeners();
        if (this.mainEl && this.mainEl.parentNode === this.host) {
            this.host.removeChild(this.mainEl);
        }
        this.mainEl = null;
        this.formAreaEl = null;
        this.formHostEl = null;
    }

    /** @private */
    public getFormRenderer(): FormRenderer | null {
        return this.formRenderer;
    }

    /** @private */
    public getHostEl(): HTMLElement | null {
        return this.mainEl;
    }

    private buildShell(): void {
        const root: HTMLElement = createElement('main', {
            className: 'preview-main-section',
            attrs: {
                'role': 'dialog',
                'aria-modal': 'true'
            },
            styles: 'position: absolute; left: 0; width: 100%; display: none;'
        });

        // Header
        const header: HTMLElement = createElement('div', {
            className: 'main-header'
        });
        const left: HTMLElement = createElement('div', {
            className: 'left-section'
        });
        left.textContent = this.currentFormName;
        const center: HTMLElement = createElement('div', {
            className: 'center-section'
        });
        const right: HTMLElement = createElement('div', {
            className: 'right-section'
        });
        const closeButtonHost: HTMLButtonElement = createElement('button', {
            attrs: { type: 'button' }
        }) as HTMLButtonElement;
        right.appendChild(closeButtonHost);
        header.appendChild(left);
        header.appendChild(center);
        header.appendChild(right);

        // Content
        const content: HTMLElement = createElement('div', {
            className: 'preview-main-content',
            styles: 'width: 100%; position: relative; z-index: 9999; margin-top: 48px;'
        });
        const formArea: HTMLElement = createElement('div', {
            className: 'form-preview-area'
        });
        content.appendChild(formArea);

        // Initial inline height (re-applied by the height tracker
        // when the container resizes).
        const container: HTMLElement | null = document.querySelector('.e-form-builder') as HTMLElement | null;
        if (container) {
            formArea.style.height = (container.offsetHeight - 48) + 'px';
        }

        root.appendChild(header);
        root.appendChild(content);
        // Insert <main class="preview-main-section"> into the host
        // BEFORE the Editor-Toolbar so the DOM order matches the
        // React reference: canvas → preview → toolbar.
        const toolbarHost: HTMLElement | null = this.host.querySelector('#Editor-Tooltip');
        if (toolbarHost && toolbarHost.parentNode === this.host) {
            this.host.insertBefore(root, toolbarHost);
        } else {
            this.host.appendChild(root);
        }

        // Close button (EJ2 Button)
        const closeBtn: Button = new Button({
            enableRtl: this.options.enableRtl,
            cssClass: 'action-btn e-flat',
            content: 'Close Preview'
        });
        closeBtn.appendTo(closeButtonHost);
        closeBtn.element.onclick = (event: Event): void => {
            event.preventDefault();
            this.handlers.handleClose();
        };
        this.closeButton = closeBtn;
        this.owners.buttons.push(closeBtn);

        this.mainEl = root;
        this.formAreaEl = formArea;
        this.formHostEl = formArea;
    }

    private applyVisibility(): void {
        if (!this.mainEl) {
            return;
        }
        this.mainEl.style.display = this.options.isOpen ? '' : 'none';
    }

    private mountPreview(): void {
        if (!this.mainEl || !this.formHostEl) {
            return;
        }
        this.isMounted = true;
        this.renderForm();
    }

    private unmountPreview(): void {
        if (!this.isMounted) {
            this.applyVisibility();
            return;
        }
        this.isMounted = false;
        this.destroyFormRenderer();
        if (this.formHostEl) {
            while (this.formHostEl.firstChild) {
                this.formHostEl.removeChild(this.formHostEl.firstChild);
            }
        }
        this.applyVisibility();
    }

    private renderForm(): void {
        if (!this.formHostEl) {
            return;
        }
        while (this.formHostEl.firstChild) {
            this.formHostEl.removeChild(this.formHostEl.firstChild);
        }
        const width: string = (this.options.formSchema && this.options.formSchema.settings && this.options.formSchema.settings.width)
            ? String(this.options.formSchema.settings.width)
            : '500px';
        const formContainer: HTMLElement = createElement('div', {
            attrs: {
                'role': 'region',
                'aria-label': this.currentFormName || 'Untitled Form'
            },
            className: 'preview-form',
            styles: 'max-width: ' + width + ';' + (this.options.schema ? '' : ' min-height: 200px;')
        });
        this.formHostEl.appendChild(formContainer);

        if (!this.options.schema) {
            const placeholder: HTMLElement = createElement('div', {
                styles: 'padding: 24px; color: #64748b; font-size: 14px;'
            });
            placeholder.textContent = 'Preview not available: schema not yet rendered.';
            formContainer.appendChild(placeholder);
            return;
        }

        this.formKey = this.formKey + 1;
        formContainer.id = 'preview-form-' + String(this.formKey);
        const self: PreviewPane = this;
        let renderer: FormRenderer | null = null;
        try {
            renderer = new FormRenderer({
                schema: this.options.schema as any,
                className: 'preview-form',
                locale: this.options.locale || 'en-US',
                enableRtl: !!(this.options as any).enableRtl,
                customWidgetSettings: (this.options.toolboxItems || []).map((entry: any) => ({
                    template: entry.template,
                    type: entry.type,
                    templateId: entry.templateId
                })),
                submit: (args: any) => self.handleSubmit(args)
            } as any);
        } catch (err) {
            console.error('PreviewPane: FormRenderer ctor failed', err);
            const errBox: HTMLElement = createElement('div', {
                styles: 'padding: 24px; color: #b91c1c; font-size: 14px;'
            });
            errBox.textContent = 'Preview render error (ctor): ' + (err && (err as any).message ? (err as any).message : String(err));
            formContainer.appendChild(errBox);
            return;
        }
        try {
            if (this.formBuilder.isReact && this.formBuilder.portals) {
                renderer.isReact = true;
                renderer.portals = [];
            }
            renderer.appendTo(formContainer);
            this.formRenderer = renderer;
            this.owners.formRenderers.push(renderer);
        } catch (err) {
            console.error('PreviewPane: FormRenderer.appendTo failed', err);
            const errBox: HTMLElement = createElement('div', {
                styles: 'padding: 24px; color: #b91c1c; font-size: 14px;'
            });
            errBox.textContent = 'Preview render error (appendTo): ' + (err && (err as any).message ? (err as any).message : String(err));
            formContainer.appendChild(errBox);
        }
    }

    private destroyFormRenderer(): void {
        if (this.formRenderer) {
            try {
                this.formRenderer.destroy();
            } catch (err) {
                /* ignore */
            }
            this.removeFromOwners('formRenderers', this.formRenderer);
            this.formRenderer = null;
        }
    }

    private handleSubmit(_args: any): void {
        // Intentionally left empty.
    }

    private updatePreviewHeight(): void {
        if (!this.isMounted) {
            return;
        }
        const container: HTMLElement | null = document.getElementById('form-builder');
        if (!container) {
            return;
        }
        const target: HTMLElement | null =
            (this.mainEl && this.mainEl.querySelector('.form-preview-area')) as HTMLElement | null;
        if (!target) {
            return;
        }
        target.style.height = (container.offsetHeight - 48) + 'px';
    }

    private addTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        target.addEventListener(event, handler, opts);
        const entry: {
            target: EventTarget;
            event: string;
            handler: EventListener;
            opts?: AddEventListenerOptions | boolean;
        } = { target: target, event: event, handler: handler, opts: opts };
        this.localListeners.push(entry);
        if (this.owners.docListeners) {
            this.owners.docListeners.push(entry);
        }
    }

    private removeTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        try {
            target.removeEventListener(event, handler, opts);
        } catch (err) {
            /* ignore */
        }
        for (let i: number = this.localListeners.length - 1; i >= 0; i--) {
            const l: {
                target: EventTarget;
                event: string;
                handler: EventListener;
                opts?: AddEventListenerOptions | boolean;
            } = this.localListeners[i as number];
            if (l.target === target && l.event === event && l.handler === handler) {
                this.localListeners.splice(i, 1);
            }
        }
        if (this.owners.docListeners) {
            for (let i: number = this.owners.docListeners.length - 1; i >= 0; i--) {
                const l: {
                    target: EventTarget;
                    event: string;
                    handler: EventListener;
                    opts?: AddEventListenerOptions | boolean;
                } = this.owners.docListeners[i as number];
                if (l.target === target && l.event === event && l.handler === handler) {
                    this.owners.docListeners.splice(i, 1);
                }
            }
        }
    }

    private removeLocalListeners(): void {
        for (let i: number = this.localListeners.length - 1; i >= 0; i--) {
            const l: {
                target: EventTarget;
                event: string;
                handler: EventListener;
                opts?: AddEventListenerOptions | boolean;
            } = this.localListeners[i as number];
            try {
                l.target.removeEventListener(l.event, l.handler, l.opts);
            } catch (err) {
                /* ignore */
            }
        }
        this.localListeners = [];
    }

    private removeFromOwners(key: 'buttons' | 'dialogs' | 'grids' | 'formRenderers', instance: any): void {
        if (!this.owners || !instance) {
            return;
        }
        const list: any[] = (this.owners as any)[key as string];
        if (!list) {
            return;
        }
        for (let i: number = list.length - 1; i >= 0; i--) {
            if (list[i as number] === instance) {
                list.splice(i, 1);
            }
        }
    }
}

export default PreviewPane;
