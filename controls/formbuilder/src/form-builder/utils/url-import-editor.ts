import { L10n, createElement } from '@syncfusion/ej2-base';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { TextBox } from '@syncfusion/ej2-inputs';

/** @private */
export interface URLImportEditorOptions {
    host: HTMLElement;
    value: any;
    l10n: L10n;
    onChange: (value: any) => void;
}

/** @private */
export class URLImportEditor {
    private host: HTMLElement;
    private value: any;
    private l10n: L10n;
    private onChange: (value: any) => void;
    private checkboxComponent?: CheckBox;
    private textboxComponent?: TextBox;
    private isEnabled: boolean;
    private serviceUrl: string;
    private containerDiv?: HTMLElement;

    constructor(opts: URLImportEditorOptions) {
        this.host = opts.host;
        this.value = opts.value;
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;

        // Parse initial value: can be boolean, object, or null
        if (typeof opts.value === 'object' && opts.value !== null) {
            this.isEnabled = opts.value.enabled !== undefined ? opts.value.enabled : false;
            this.serviceUrl = opts.value.serviceUrl !== undefined ? opts.value.serviceUrl : '';
        } else {
            this.isEnabled = Boolean(opts.value);
            this.serviceUrl = '';
        }
    }

    /** @private */
    public render(): void {
        this.host.innerHTML = '';

        this.containerDiv = createElement('div', {
            className: 'property-field'
        });
        this.host.appendChild(this.containerDiv);

        const checkboxContainer = createElement('div', {
            className: 'property-field property-field-checkbox',
            styles: 'margin-bottom: 0.5rem;'
        });
        this.containerDiv.appendChild(checkboxContainer);

        const checkboxElement = createElement('input', {
            id: 'url-import-checkbox',
            attrs: { 'type': 'checkbox' }
        });
        checkboxContainer.appendChild(checkboxElement);

        this.checkboxComponent = new CheckBox({
            label: this.l10n.getConstant('enableUrlImport') || 'Enable URL Import',
            checked: this.isEnabled,
            change: (e: any) => this.handleEnabledChange(e.checked === true)
        });
        this.checkboxComponent.appendTo(checkboxElement);

        if (this.isEnabled) {
            const descriptionText = this.l10n.getConstant('urlImportDescription');
            if (descriptionText) {
                const description = createElement('p', {
                    className: 'property-description property-description-inline'
                });
                description.textContent = descriptionText;
                this.containerDiv.appendChild(description);
            }

            const textboxDiv = createElement('div');
            this.containerDiv.appendChild(textboxDiv);

            const textboxElement = createElement('input', {
                id: 'url-import-textbox',
                attrs: { 'type': 'text' }
            });
            textboxDiv.appendChild(textboxElement);

            this.textboxComponent = new TextBox({
                value: this.serviceUrl,
                placeholder: this.l10n.getConstant('enterServiceUrl') || 'Enter service URL',
                change: (e: any) => this.handleServiceChange(e.value)
            });
            this.textboxComponent.appendTo(textboxElement);
        }
    }

    private handleEnabledChange(checked: boolean): void {
        this.isEnabled = checked;

        if (checked) {
            this.onChange({
                enabled: this.serviceUrl ? true : false,
                serviceUrl: this.serviceUrl || ''
            });
            this.render();
        } else {
            this.onChange(null);
            this.render();
        }
    }

    private handleServiceChange(value: string): void {
        this.serviceUrl = value;
        this.onChange({
            enabled: true,
            serviceUrl: value
        });
    }

    /** @private */
    public destroy(): void {
        if (this.checkboxComponent) {
            this.checkboxComponent.destroy();
        }
        if (this.textboxComponent) {
            this.textboxComponent.destroy();
        }
    }
}
