import { L10n, Internationalization, createElement } from '@syncfusion/ej2-base';
import { DropDownList, MultiSelect, DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { DatePicker, DateTimePicker, TimePicker, DateRangePicker } from '@syncfusion/ej2-calendars';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { FormNode } from '@syncfusion/ej2-form-renderer';
import { resolveUrlOptions } from './conditional-editor-utils';

/** @private */
export interface ValueRendererOptions {
    host: HTMLElement;
    component: FormNode | undefined;
    enableRtl?: boolean;
    initialValue: any;
    locale: string;
    l10n?: L10n;
    onChange: (value: any) => void;
}

/** @private */
export class ValueRenderer {

    private host: HTMLElement;
    private component: FormNode | undefined;
    private value: any;
    private locale: string;
    private l10n: L10n | undefined;
    private onChange: (v: any) => void;
    private props: ValueRendererOptions;

    private widget: any;
    private destroyed: boolean;

    constructor(opts: ValueRendererOptions) {
        this.host = opts.host;
        this.props = opts;
        this.component = opts.component;
        this.value = opts.initialValue;
        this.locale = opts.locale || 'en-US';
        this.l10n = opts.l10n;
        this.onChange = opts.onChange;
        this.widget = null;
        this.destroyed = false;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.host.innerHTML = '';

        const label: HTMLElement = createElement('label', { className: 'property-description' });
        label.textContent = (this.l10n && this.l10n.getConstant('setValue')) || 'Value:';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        this.host.appendChild(label);

        if (!this.component) { return; }

        const t: string = (this.component.type || '').toLowerCase();

        if (t === 'multiselect' || t === 'checkboxgroup') {
            this.renderMultiSelect();
        } else if (t === 'dropdown' || t === 'radio') {
            this.renderDropDownList();
        } else if (t === 'date') {
            this.renderDatePicker();
        } else if (t === 'time') {
            this.renderTimePicker();
        } else if (t === 'datetime') {
            this.renderDateTimePicker();
        } else if (t === 'daterange') {
            this.renderDateRangePicker();
        } else if (t === 'number' || t === 'rangeslider' || t === 'rating') {
            this.renderNumericTextBox();
        } else if (t === 'checkbox' || t === 'switch') {
            this.renderCheckBox();
        } else {
            this.renderTextBox();
        }
    }

    /** @private */
    public getValue(): any {
        if (!this.widget) { return this.value; }
        const t: string = (this.component && this.component.type || '').toLowerCase();
        if (t === 'multiselect' || t === 'checkboxgroup') {
            return Array.isArray(this.widget.value) ? this.widget.value.slice() : [];
        }
        if (t === 'daterange') {
            const v: any = this.widget.value;
            if (Array.isArray(v) && v.length === 2) {
                const intl: Internationalization = new Internationalization();
                const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' }) as any);
                return [fmt(v[0]), fmt(v[1])];
            }
            return undefined;
        }
        if (t === 'date' && this.widget.value instanceof Date) {
            const intl: Internationalization = new Internationalization();
            return intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' })(this.widget.value);
        }
        if (t === 'time' && this.widget.value instanceof Date) {
            const intl: Internationalization = new Internationalization();
            return intl.getDateFormat({ format: 'hh:mm a', type: 'time' })(this.widget.value);
        }
        if (t === 'datetime' && this.widget.value instanceof Date) {
            const intl: Internationalization = new Internationalization();
            return intl.getDateFormat({ format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' })(this.widget.value);
        }
        if (t === 'checkbox' || t === 'switch') {
            return !!this.widget.checked;
        }
        return this.widget.value;
    }

    /** @private */
    public setValue(v: any): void {
        this.value = v;
        if (!this.widget) { return; }
        try {
            this.widget.value = v;
        } catch { /* best-effort */ }
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        if (this.widget) {
            try { this.widget.destroy(); } catch { /* best-effort */ }
            this.widget = null;
        }
        this.host.innerHTML = '';
    }

    private getResolvedOptions(): { text: string; value: any }[] {
        if (!this.component) { return []; }
        const opts: any = (this.component as any).options;
        if (!opts) { return []; }
        const resolved: any[] = Array.isArray(opts) ? opts : resolveUrlOptions(opts, []);
        return resolved.map((opt: any) => {
            if (typeof opt === 'string') {
                return { text: opt, value: opt };
            }
            if (opt && typeof opt === 'object' && 'value' in opt) {
                return {
                    text: (opt as any).label || (opt as any).text || (opt as any).value,
                    value: (opt as any).value
                };
            }
            return { text: String(opt), value: String(opt) };
        });
    }

    private renderMultiSelect(): void {
        const data: { text: string; value: any }[] = this.getResolvedOptions();
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        this.widget = new MultiSelect({
            dataSource: data,
            enableRtl: this.props.enableRtl,
            fields: { text: 'text', value: 'value' },
            value: Array.isArray(this.value) ? this.value : [],
            change: (e: any) => this.onChange(e.value || []),
            placeholder: 'Select values',
            popupHeight: '300px'
        });
        this.widget.appendTo(input);
    }

    private renderDropDownList(): void {
        const data: { text: string; value: any }[] = this.getResolvedOptions();
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        this.widget = new DropDownList({
            dataSource: data,
            enableRtl: this.props.enableRtl,
            fields: { text: 'text', value: 'value' },
            value: this.value || '',
            change: (e: any) => this.onChange(e.value),
            placeholder: 'Select value',
            popupHeight: '300px'
        });
        this.widget.appendTo(input);
    }

    private renderDatePicker(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        const initial: Date | null = this.value ? new Date(this.value) : null;
        this.widget = new DatePicker({
            locale: this.locale,
            value: initial || undefined,
            enableRtl: this.props.enableRtl,
            format: 'MM/dd/yyyy',
            placeholder: 'Select date',
            change: (e: any) => {
                if (e.value) {
                    const intl: Internationalization = new Internationalization();
                    const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' }) as any);
                    this.onChange(fmt(e.value));
                } else {
                    this.onChange('');
                }
            }
        });
        this.widget.appendTo(input);
    }

    private renderTimePicker(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        const initial: Date | null = this.value
            ? (this.value instanceof Date
                ? this.value
                : new Date('1970-01-01 ' + String(this.value)))
            : null;
        this.widget = new TimePicker({
            locale: this.locale,
            value: initial || undefined,
            enableRtl: this.props.enableRtl,
            format: 'hh:mm a',
            placeholder: 'Select time',
            change: (e: any) => {
                if (e.value) {
                    const intl: Internationalization = new Internationalization();
                    const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'hh:mm a', type: 'time' }) as any);
                    this.onChange(fmt(e.value));
                } else {
                    this.onChange('');
                }
            }
        });
        this.widget.appendTo(input);
    }

    private renderDateTimePicker(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        const initial: Date | null = this.value ? new Date(this.value) : null;
        this.widget = new DateTimePicker({
            locale: this.locale,
            value: initial || undefined,
            enableRtl: this.props.enableRtl,
            format: 'MM/dd/yyyy hh:mm a',
            placeholder: 'Select date and time',
            change: (e: any) => {
                if (e.value) {
                    const intl: Internationalization = new Internationalization();
                    const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'MM/dd/yyyy hh:mm a', type: 'dateTime' }) as any);
                    this.onChange(fmt(e.value));
                } else {
                    this.onChange('');
                }
            }
        });
        this.widget.appendTo(input);
    }

    private renderDateRangePicker(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        let initial: [Date, Date] | undefined;
        if (Array.isArray(this.value) && this.value.length === 2) {
            initial = [new Date(this.value[0]), new Date(this.value[1])];
        }
        this.widget = new DateRangePicker({
            locale: this.locale,
            enableRtl: this.props.enableRtl,
            value: initial as any,
            format: 'MM/dd/yyyy',
            placeholder: 'Select date range',
            change: (e: any) => {
                if (e.startDate && e.endDate) {
                    const intl: Internationalization = new Internationalization();
                    const fmt: (d: Date) => string = (intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' }) as any);
                    this.onChange([fmt(e.startDate), fmt(e.endDate)]);
                } else {
                    this.onChange('');
                }
            }
        });
        this.widget.appendTo(input);
    }

    private renderNumericTextBox(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        this.widget = new NumericTextBox({
            value: typeof this.value === 'number' ? this.value : 0,
            enableRtl: this.props.enableRtl,
            format: 'n',
            placeholder: 'Enter number',
            change: (e: any) => this.onChange(e.value)
        });
        this.widget.appendTo(input);
    }

    private renderCheckBox(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'checkbox';
        this.host.appendChild(input);
        this.widget = new CheckBox({
            enableRtl: this.props.enableRtl,
            checked: !!this.value,
            change: (e: any) => this.onChange(!!e.checked)
        });
        this.widget.appendTo(input);
    }

    private renderTextBox(): void {
        const input: HTMLInputElement = document.createElement('input');
        this.host.appendChild(input);
        this.widget = new TextBox({
            enableRtl: this.props.enableRtl,
            value: this.value || '',
            placeholder: 'Enter value for ' + (this.component ? (this.component.label || this.component.id) : ''),
            change: (e: any) => this.onChange(e.value)
        });
        this.widget.appendTo(input);
    }
}
