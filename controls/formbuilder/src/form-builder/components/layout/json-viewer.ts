import { createElement, L10n } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { FormSchema, splitSchema, UnifiedSchema } from '@syncfusion/ej2-form-renderer';
import { isDefaultFormSchema } from '../../context/default-form-schema';

/**
 * @private
 */
export interface JsonViewerOwners {
    buttons?: any[];
    docListeners?: Array<{ target: EventTarget; event: string; handler: EventListener; opts?: AddEventListenerOptions | boolean; }>;
}

/**
 * @private
 */
export interface JsonViewerOptions {
    formSchema: FormSchema;
    l10n?: L10n;
    force?: boolean;
    copySchema?: () => void;
}

/**
 * @private
 */
export class JsonViewer {
    private host: HTMLElement;
    private l10n: L10n | undefined;
    private options: JsonViewerOptions;
    private owners: JsonViewerOwners | null;
    private preEl: HTMLElement | null;
    private buttonInstance: Button | null;
    private buttonHost: HTMLElement | null;
    private container: HTMLElement | null;
    private lastSchemaJson: string | null;
    private docListeners: Array<{ target: EventTarget; event: string; handler: EventListener; opts?: AddEventListenerOptions | boolean; }>;

    /**
     * @private
     */
    constructor(host: HTMLElement, options: JsonViewerOptions, owners?: JsonViewerOwners) {
        this.host = host;
        this.options = options;
        this.l10n = options && options.l10n ? options.l10n : undefined;
        this.owners = owners || null;
        this.container = null;
        this.preEl = null;
        this.buttonInstance = null;
        this.buttonHost = null;
        this.lastSchemaJson = null;
        this.docListeners = [];
        this.render(options);
    }

    /**
     * @private
     */
    public render(options: JsonViewerOptions): void {
        this.options = options;
        this.l10n = options && options.l10n ? options.l10n : this.l10n;
        const safe: FormSchema = options && options.formSchema ? options.formSchema : null;
        const isEmpty: boolean = isDefaultFormSchema(safe);
        const splitData: UnifiedSchema = safe ? splitSchema(safe as any) : null;
        const jsonText: string = isEmpty || !splitData
            ? '{}'
            : JSON.stringify(splitData, null, 2);

        const schemaChanged: boolean = this.lastSchemaJson !== jsonText;
        if (!this.container || options.force || schemaChanged) {
            this.buildInnerDom(jsonText, isEmpty);
            this.lastSchemaJson = jsonText;
            return;
        }
        if (this.preEl) {
            this.preEl.textContent = jsonText;
        }
        this.lastSchemaJson = jsonText;
    }

    /**
     * @private
     */
    public refresh(schema: FormSchema): void {
        this.render({ formSchema: schema, l10n: this.l10n });
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.buttonInstance) {
            try {
                this.buttonInstance.destroy();
            } catch (e) {
                /* ignore */
            }
            if (this.owners && this.owners.buttons) {
                const idx: number = this.owners.buttons.indexOf(this.buttonInstance);
                if (idx >= 0) {
                    this.owners.buttons.splice(idx, 1);
                }
            }
            this.buttonInstance = null;
        }
        for (let i: number = this.docListeners.length - 1; i >= 0; i--) {
            const entry: { target: EventTarget; event: string; handler: EventListener; opts?: AddEventListenerOptions | boolean; } = this.docListeners[i as number];
            try {
                if (entry.opts !== undefined) {
                    entry.target.removeEventListener(entry.event, entry.handler, entry.opts);
                } else {
                    entry.target.removeEventListener(entry.event, entry.handler);
                }
            } catch (e) {
                /* ignore */
            }
        }
        this.docListeners = [];
        this.preEl = null;
        this.buttonHost = null;
        this.container = null;
        this.lastSchemaJson = null;
        if (this.host && this.host.firstChild) {
            let toRemove: HTMLElement | null = this.container;
            if (toRemove && toRemove.parentNode === this.host) {
                this.host.removeChild(toRemove);
            } else {
                // Fallback: walk for any leftover
                // split-view-container under host.
                const leftovers: NodeListOf<Element> = this.host.querySelectorAll('.split-view-container');
                for (let i: number = leftovers.length - 1; i >= 0; i--) {
                    const node: Node = leftovers[i as number];
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                }
            }
        }
    }

    private addTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        target.addEventListener(event, handler, opts);
        this.docListeners.push({ target: target, event: event, handler: handler, opts: opts });
        if (this.owners && this.owners.docListeners) {
            this.owners.docListeners.push({ target: target, event: event, handler: handler, opts: opts });
        }
    }

    private handleCopyClick = (): void => {
        if(this.options.copySchema) {
          this.options.copySchema();
        }
    };

    private buildInnerDom(jsonText: string, isEmpty: boolean): void {
        if (this.buttonInstance) {
            try {
                this.buttonInstance.destroy();
            } catch (e) {
                /* ignore */
            }
            this.buttonInstance = null;
        }
        this.buttonHost = null;
        this.preEl = null;
        this.container = null;
        if (this.host) {
            const leftovers: NodeListOf<Element> = this.host.querySelectorAll('.split-view-container');
            for (let i: number = leftovers.length - 1; i >= 0; i--) {
                const node: Node = leftovers[i as number];
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        }
        const container: HTMLElement = createElement('div', {
            className: 'split-view-container'
        });
        const panels: HTMLElement = createElement('div', {
            className: 'split-panels'
        });
        const panel: HTMLElement = createElement('div', {
            className: 'split-panel full-width',
            attrs: { 'aria-labelledby': 'combined-schema-heading' }
        });
        const header: HTMLElement = createElement('div', {
            className: 'json-header'
        });
        const title: HTMLElement = createElement('span', {
            className: 'json-title'
        });
        const titleText: string = this.l10n
            ? (this.l10n.getConstant('combinedSchema') || 'Schema')
            : 'Schema';
        title.textContent = titleText;
        header.appendChild(title);
        if (!isEmpty) {
            const copyText: string = this.l10n
                ? (this.l10n.getConstant('copy') || 'Copy')
                : 'Copy';
            const copyAria: string = copyText;
            const copyHost: HTMLElement = createElement('button', {
                attrs: {
                    'type': 'button',
                    'aria-label': copyAria
                }
            });
            copyHost.textContent = copyText;
            header.appendChild(copyHost);
            this.buttonHost = copyHost;

            const buttonOptions: any = {
                iconCss: 'e-icons e-copy',
                content: copyText
            };
            const button: Button = new Button(buttonOptions);
            button.appendTo(copyHost);
            button.element.onclick = this.handleCopyClick.bind(this);
            this.buttonInstance = button;
            if (this.owners && this.owners.buttons) {
                this.owners.buttons.push(button);
            }
        }

        panel.appendChild(header);

        const pre: HTMLElement = createElement('pre', {
            className: 'json-content',
            attrs: {
                'role': 'textbox',
                'aria-readonly': 'true',
                'aria-label': 'Schema'
            }
        });
        pre.textContent = jsonText;
        panel.appendChild(pre);

        panels.appendChild(panel);
        container.appendChild(panels);
        this.host.appendChild(container);

        this.container = container;
        this.preEl = pre;
    }
}

export default JsonViewer;
