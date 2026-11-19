import { L10n, createElement } from '@syncfusion/ej2-base';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

/** @private */
export interface LookupConfigModel {
    dataSource?: string;
    displayFormat?: 'Dropdown' | 'MultiSelect' | 'Radio' | 'Checkbox' | 'CheckboxGroup';
    bindText?: string;
    bindValue?: string;
    groupBy?: string;
    sortBy?: string;
    filterType?: 'None' | 'StartsWith' | 'Contains' | 'Equals';
    pageSize?: number;
}

/** @private */
const DISPLAY_FORMATS: string[] = ['Dropdown', 'MultiSelect', 'Radio', 'Checkbox', 'CheckboxGroup'];

/** @private */
const FILTER_TYPES: string[] = ['None', 'StartsWith', 'Contains', 'Equals'];

/** @private */
export interface LookupConfigOptions {
    host: HTMLElement;
    value: LookupConfigModel;
    l10n: L10n;
    onChange: (value: LookupConfigModel) => void;
}

/** @private */
export class LookupConfig {

    private host: HTMLElement;
    private value: LookupConfigModel;
    private l10n: L10n;
    private onChange: (value: LookupConfigModel) => void;
    private inputs: any[];
    private destroyed: boolean;
    private previewEl: HTMLElement | null;

    constructor(opts: LookupConfigOptions) {
        this.host = opts.host;
        this.value = opts.value || {};
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.inputs = [];
        this.destroyed = false;
        this.previewEl = null;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';

        this.appendTextInput('dataSource', 'Data source URL', this.value.dataSource || '');
        this.appendDropdown('displayFormat', 'Display format', DISPLAY_FORMATS, this.value.displayFormat || 'Dropdown');
        this.appendTextInput('bindText', 'Bind text field', this.value.bindText || 'text');
        this.appendTextInput('bindValue', 'Bind value field', this.value.bindValue || 'value');
        this.appendTextInput('groupBy', 'Group by', this.value.groupBy || '');
        this.appendTextInput('sortBy', 'Sort by', this.value.sortBy || '');
        this.appendDropdown('filterType', 'Filter type', FILTER_TYPES, this.value.filterType || 'None');
        this.appendNumeric('pageSize', 'Page size', this.value.pageSize || 0);

        const fetchBtn: HTMLElement = createElement('button', {
            attrs: { 'type': 'button' }
        });
        fetchBtn.textContent = this.l10n.getConstant('fetch') || 'Fetch';
        fetchBtn.classList.add('e-btn', 'e-small');
        fetchBtn.addEventListener('click', () => this.testFetch());
        this.host.appendChild(fetchBtn);

        this.previewEl = createElement('pre', { className: 'lookup-config-preview' });
        this.previewEl.textContent = '';
        this.host.appendChild(this.previewEl);
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.inputs.forEach((input: any) => {
            try { input.destroy(); } catch { /* ignore */ }
        });
        this.inputs = [];
        this.previewEl = null;
        this.host.innerHTML = '';
    }

    private appendTextInput(field: keyof LookupConfigModel, label: string, value: string): void {
        const wrapper: HTMLElement = createElement('div', { className: 'lookup-config-field' });
        const lbl: HTMLElement = createElement('label');
        lbl.textContent = label;
        wrapper.appendChild(lbl);
        const inputEl: HTMLElement = createElement('input', { attrs: { 'type': 'text' } });
        wrapper.appendChild(inputEl);
        this.host.appendChild(wrapper);
        const tb: TextBox = new TextBox({
            value: value,
            change: (e: any) => {
                this.value = { ...this.value, [field]: e.value };
                this.onChange(this.value);
            }
        });
        tb.appendTo(inputEl);
        this.inputs.push(tb);
    }

    private appendNumeric(field: keyof LookupConfigModel, label: string, value: number): void {
        const wrapper: HTMLElement = createElement('div', { className: 'lookup-config-field' });
        const lbl: HTMLElement = createElement('label');
        lbl.textContent = label;
        wrapper.appendChild(lbl);
        const inputEl: HTMLElement = createElement('input', { attrs: { 'type': 'text' } });
        wrapper.appendChild(inputEl);
        this.host.appendChild(wrapper);
        const nb: NumericTextBox = new NumericTextBox({
            value: value,
            format: 'n',
            min: 0,
            change: (e: any) => {
                this.value = { ...this.value, [field]: e.value };
                this.onChange(this.value);
            }
        });
        nb.appendTo(inputEl);
        this.inputs.push(nb);
    }

    private appendDropdown(field: keyof LookupConfigModel, label: string, options: string[], value: string): void {
        const wrapper: HTMLElement = createElement('div', { className: 'lookup-config-field' });
        const lbl: HTMLElement = createElement('label');
        lbl.textContent = label;
        wrapper.appendChild(lbl);
        const inputEl: HTMLElement = createElement('input', { attrs: { 'type': 'text' } });
        wrapper.appendChild(inputEl);
        this.host.appendChild(wrapper);
        const dd: DropDownList = new DropDownList({
            dataSource: options.map((o: string) => ({ text: o, value: o })),
            fields: { text: 'text', value: 'value' },
            value: value,
            change: (e: any) => {
                this.value = { ...this.value, [field]: e.value };
                this.onChange(this.value);
            }
        });
        dd.appendTo(inputEl);
        this.inputs.push(dd);
    }

    private async testFetch(): Promise<void> {
        if (!this.previewEl) { return; }
        const url: string = (this.value.dataSource || '').trim();
        if (!url) {
            this.previewEl.textContent = 'No data source URL set.';
            return;
        }
        try {
            const response: Response = await fetch(url);
            const text: string = await response.text();
            const truncated: string = text.length > 5120 ? text.substring(0, 5120) + '...' : text;
            this.previewEl.textContent = truncated;
        } catch (err) {
            this.previewEl.textContent = `Fetch failed: ${err && (err as any).message ? (err as any).message : err}`;
        }
    }
}
